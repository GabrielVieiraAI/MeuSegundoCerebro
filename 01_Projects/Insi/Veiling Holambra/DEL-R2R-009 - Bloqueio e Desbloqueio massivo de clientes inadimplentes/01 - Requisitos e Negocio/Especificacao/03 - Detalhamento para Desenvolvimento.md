---
tags:
  - projeto
  - insi
  - veiling-holambra
  - sap
  - fi-ar
  - del-r2r-009
id_demanda: DEL-R2R-009
secao: 03 - Detalhamento para Desenvolvimento
---

# 03 – Detalhamento para Desenvolvimento

⬅️ [[02 - Estratégia da Solução|Seção Anterior]] | 🏠 [[00 - Identificação da Solicitação e Sumário|Sumário]] | ➡️ [[04 - Governança Técnica da Solução|Próxima Seção: Governança Técnica da Solução]]

---

## Estratégia de Desenvolvimento

### Requisitos do Desenvolvimento

A solução **DEL-R2R-009** atende e entrega:

#### 1. Camada de Apuração Analítica em Tempo Real (CDS Views):
* **Seleção de Parceiros:** Seleciona Parceiros de Negócio com função `UKM000` (Ficha de Gestão de Crédito) no segmento de crédito `1000` da empresa `CVH1`.
* **Exclusão de Contas Internas:** Desconsidera a classe de risco `5 - CVH Interna` (contas da própria Veiling Holambra), conforme premissa PR-07.
* **Classificação por Risco:** Classifica o parceiro pela classe de risco (`UKMBP_CMS-RISK_CLASS`): à vista para classes `1A`, a prazo para classes `2A`.
* **Apuração Financeira:** Consolida, por cliente, o saldo das partidas em aberto vencidas há pelo menos 1 dia na empresa `CVH1` a partir de `I_OperationalAcctgDocItem`, desconsiderando juros, multas e partidas de razão especial.
* **Régua de Negócio (Ação Proposta):**
  - **Bloquear:** Parceiro desbloqueado com saldo vencido > R$ 0,00 (`1A` - À Vista) ou >= R$ 500,01 (`2A` - A Prazo).
  - **Desbloquear:** Parceiro bloqueado por inadimplência (`IsBlocked = 'X'` e `BlockReason = '10'`) cujo saldo devedor foi regularizado.
* **Proteção de Bloqueios Externos:** Clientes bloqueados por outros motivos (ex.: pendência fiscal ou jurídica `<> 10`) são filtrados no SQL da CDS e omitidos da tela, permanecendo sob gestão individual no standard.
* **Filtro de Autosserviço:** Expõe o segmento de atuação (`BP001-GROUP_FEATURE`), permitindo isolar supermercados e redes de autosserviço (código `002`).
* **Preservação Cadastral:** O bloqueio afeta exclusivamente as travas de crédito, mantendo 100% inalterados os limites sazonais temporários e datas de validade (`DEL-COM-064`).

---

#### 2. App SAP Fiori Elements (List Report):
* **Template:** Fiori Elements List Report OData V2, módulo `bloqinadimplente` (contêiner BSP `ZZ1_BLOQ_INAD`).
* **Filtros de Tela:** Ação Proposta, Cliente (Matriz), Segmento de Atuação e Classe de Risco.
* **Processamento em Lote:** Suporte a seleção múltipla (`multiSelect: true`) e layout compacto (`condensedTableLayout: true`).
* **Ações em Massa:** Botões **Bloquear** e **Desbloquear** diretos na barra da tabela, com motivo `10` fixado automaticamente pelo backend (sem pop-ups repetitivos).
* **Resiliência e Feedback:** Processamento registro a registro no Behavior Pool RAP; erros pontuais são acumulados e exibidos de forma consolidada no componente **Message View**.

---

### Detalhamento da Implementação Técnica

#### 1. Arquitetura Clean Core / ABAP Cloud
* **Sem Jobs e Sem Tabelas Transitórias:** Todo o cálculo da régua ocorre dinamicamente na camada de leitura HANA via CDS Views (`ZI_FI_TITULOS_VENCIDOS` ➔ `ZI_FI_PARCEIRO_CREDITO` ➔ `ZI_FI_CLIENTE_INADIMPLENTE`), garantindo dados em tempo real no momento da consulta.
* **Regra Mandatória de Grupo Econômico (Efeito em Cascata):** No FSCM, Matriz e Filiais compartilham uma relação indivisível de crédito (`UKM001` na `BUT050`). O método `obter_grupo_economico` identifica todos os parceiros do grupo econômico. Ao acionar bloqueio ou desbloqueio em qualquer membro, **a Matriz e TODAS as suas filiais vinculadas são bloqueadas ou desbloqueadas simultaneamente** nas contas de crédito do FSCM.
* **APIs Standard Liberadas:** Persistência no FSCM executada exclusivamente via `CL_UKM_BUPA_FACTORY` e `CL_UKM_ACCOUNT`, disparando a persistência no banco via `SAVE_ALL`.

---

#### 2. Tabela de Parâmetros Corporativa (`ZCLCA_TABELA_PARAMETROS`)
Para evitar código estático ao incluir ou excluir perfis no futuro, o Behavior Pool consulta a classe corporativa de parâmetros:
* **Módulo:** `FI`
* **Chave 1:** `DEL_R2R_009`
* **Chave 2:** `RISK_CLASS`
* **Chave 3:** `EXCLUIR`
* **Comportamento:** Retorna o range de classes de risco que não podem ser bloqueadas pelo aplicativo (com fallback de segurança para a classe `5`).

---

#### 3. Controle de Acesso e Autorizações (`ZFI_BLOQ`)
Objeto de autorização customizado com validação por linha no método `get_instance_authorizations`:
* **Campos:** `BUKRS` (Empresa), `UKM_SGMNT` (Segmento de Crédito FSCM) e `ACTVT` (Atividade).
* **Atividades:** `05` (Bloquear) e `43` (Desbloquear).
* **Integração:** Vinculado aos catálogos Fiori `ZTC_FI_INADIMPLENCIA` e `ZBC_FI_INADIMPLENCIA`, acessível pelo Objeto Semântico `ZClienteInad` (ação `manage`).

---

### Classificação por Classe de Risco (`UKMBP_CMS-RISK_CLASS`)

| Classe de Risco | Descrição | Régua Aplicada no Sistema |
| :--- | :--- | :--- |
| **`1A`** | À VISTA | Bloqueio proposto para qualquer valor vencido há 1 dia ou mais (> R$ 0,00). |
| **`2A`** | A PRAZO | Bloqueio proposto para saldo vencido >= R$ 500,01 há 1 dia ou mais. |
| **`5`** | CVH INTERNA | Excluída da avaliação e omitida da visualização no app (PR-07). |

---

### Fontes de Dados Utilizadas pelo App

| Objeto de Origem | Campo de Negócio | Campo Técnico |
| :--- | :--- | :--- |
| **Parceiro de Negócio** | Ficha de crédito ativa | `BUT100-RLTYP = UKM000` |
| **Crédito – Dados Gerais** | Classe de risco do cliente | `UKMBP_CMS-RISK_CLASS` |
| **Parceiro de Negócio** | Segmento de atuação (Autosserviço) | `BP001-GROUP_FEATURE` |
| **Parceiro de Negócio** | Relacionamento Matriz x Filial | `BUT050-RELTYP = UKM001` |
| **Crédito – Segmento** | Segmento de crédito operacional | `UKMBP_CMS_SGM-CREDIT_SGMNT` (1000) |
| **Crédito – Segmento** | Indicador de bloqueio de crédito | `UKMBP_CMS_SGM-XBLOCKED` |
| **Crédito – Segmento** | Motivo do bloqueio no FSCM | `UKMBP_CMS_SGM-BLOCK_REASON` (10) |
| **Contas a Receber** | Empresa e Conta do Cliente | `I_OperationalAcctgDocItem-CompanyCode` / `Customer` |
| **Contas a Receber** | Vencimento líquido da fatura | `I_OperationalAcctgDocItem-NetDueDate` |
| **Contas a Receber** | Montante em moeda interna | `I_OperationalAcctgDocItem-AmountInCompanyCodeCurrency` |

---

### Estrutura Real da Tabela Transparente de Log (`ZTFI_LOG_INADIMP`)

| Campo Técnico | Tipo de Dados | Descrição / Finalidade |
| :--- | :--- | :--- |
| **`MANDT`** | `mandt` | Mandante do sistema SAP. |
| **`LOG_ID`** | `sysuuid_x16` | Chave primária: Identificador único universal (UUID) gerado por `CL_SYSTEM_UUID`. |
| **`PARTNER`** | `bu_partner` | Parceiro que recebeu a alteração no FSCM (Matriz ou Filial do grupo econômico). |
| **`PARTNER_ORIGEM`** | `bu_partner` | Parceiro devedor que originou a dívida financeira. |
| **`CREDIT_SGMNT`** | `ukm_credit_sgmnt` | Segmento de crédito avaliado (fixo: `1000`). |
| **`ACAO`** | `char(1)` | Ação executada: `B` (Bloqueio) ou `D` (Desbloqueio). |
| **`BLOCK_REASON`** | `ukm_block_reason` | Motivo gravado no FSCM (`10` para bloqueio, vazio para desbloqueio). |
| **`STATUS`** | `char(1)` | Status da execução: `S` (Sucesso) ou `E` (Erro). |
| **`MENSAGEM`** | `char(255)` | Mensagem descritiva retornada da operação. |
| **`RISK_CLASS`** | `ukm_risk_class` | Classe de risco do parceiro no momento da ação. |
| **`MOEDA`** | `waers` | Moeda dos títulos apurados (`BRL`). |
| **`VLR_VENCIDO`** | `curr(15,2)` | Saldo total vencido apurado no momento da ação. |
| **`DIAS_ATRASO`** | `int4` | Maior quantidade de dias em atraso apurada. |
| **`CREATED_BY`** | `abp_creation_user` | Usuário SAP responsável pela execução (`sy-uname`). |
| **`CREATED_AT`** | `utclong` | Timestamp UTC do registro da auditoria. |
