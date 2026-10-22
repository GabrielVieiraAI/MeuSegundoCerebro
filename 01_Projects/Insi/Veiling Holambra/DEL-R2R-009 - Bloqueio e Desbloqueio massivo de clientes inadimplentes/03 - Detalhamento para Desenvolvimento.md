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

### Requisitos do desenvolvimento

O desenvolvimento DEL-R2R-009 deve atender e entregar:

#### CDS com busca de clientes inadimplentes:
* Selecionar os Parceiros de Negócio com função UKM000 e segmento de crédito 1000, empresa CVH1, desconsiderando a classe de risco 5 – CVH Interna, que não é avaliada pelo job nem exibida no app (PR-07).
* Classificar o cliente pela classe de risco (UKMBP_CMS-RISK_CLASS): à vista para as classes 1A, a prazo para as classes 2A.
* Apurar, por cliente, o saldo das partidas em aberto vencidas há pelo menos 1 dia, não incluindo juros e multas.
* Aplicar a régua: à vista, qualquer valor vencido; a prazo, valor vencido a partir de R$ 500,01.
* Gerar a lista de clientes com a ação proposta: bloquear (cliente que ultrapassa a régua e está desbloqueado) ou desbloquear (cliente bloqueado pelo próprio DEL-R2R-009 que não ultrapassa mais a régua).
* Considerar como bloqueado pelo DEL-R2R-009 somente o cliente cuja última ação na tabela Z de log é Bloqueio, que permanece bloqueado (XBLOCKED) e cujo motivo atual (BLOCK_REASON) é igual ao registrado no log. O motivo de inadimplência não é exclusivo do app (PR-12).
* Não propor desbloqueio para clientes bloqueados por outros motivos (ex.: problema fiscal), que permanecem sob gestão individual no app standard.
* Trazer na lista o segmento de atuação do cliente (BP001-GROUP_FEATURE), para que os clientes que não devem ser bloqueados, como supermercados (Autosserviço), sejam identificados e filtrados no app (PR-08).
* Não alterar o limite de crédito sazonal (crédito adicional) do cliente.
* Registrar o log de execução do job: data, hora, quantidade de clientes avaliados e de propostas geradas.

#### Job de identificação – clientes vinculados (matriz e filiais):
* Identificar os BPs vinculados pela relação standard de hierarquia de crédito entre Parceiros de Negócio, em que o crédito é controlado a partir do BP principal.
* Quando um BP do grupo ultrapassar a régua, propor o bloqueio do BP principal e de todos os BPs vinculados, informando na lista o BP de origem do bloqueio.
* Gravar o bloqueio em cada BP do grupo, com um registro na tabela Z de log por BP contendo o BP de origem, para que cada um seja comunicado aos sistemas legados pelo DEL-COM-051.
* Propor o desbloqueio dos BPs do grupo somente quando nenhum BP do grupo ultrapassar mais a régua.
* Aplicar aos BPs vinculados a mesma regra de identificação dos bloqueios feitos pelo DEL-R2R-009 (PR-12)

#### App Fiori – Gestão em massa de bloqueio e desbloqueio:
* App no padrão Fiori Elements (List Report), gerado a partir de CDS View com anotações.
* Exibir os clientes da última execução do job com a ação proposta (Bloquear / Desbloquear), o segmento de atuação e o BP de origem (clientes vinculados), com filtros por ação proposta, classe de risco, segmento de atuação, cliente e execução do job.
* Permitir a seleção de vários clientes e as ações Bloquear e Desbloquear em massa.
* Na ação Bloquear, solicitar o motivo do bloqueio, informado manualmente pelo usuário através de seleção por match code.
* Gravar ou retirar o bloqueio no segmento de crédito 1000 de cada cliente selecionado, pelas classes standard do Controle de Crédito, e registrar a ação na tabela Z de log, com identificador único por registro.
* Processar cada cliente de forma independente e retornar a mensagem de sucesso ou erro por cliente: o erro em um cliente não impede a gravação dos demais.
* Permitir a navegação do cliente para os apps standard Administrar contas de crédito e Administrar itens de cliente, para consulta individual.

#### Frequência de utilização do GAP
Job executado diariamente em background às 02:00. Como as baixas de títulos são feitas via API, os pagamentos recebidos até a execução já estão refletidos na lista. O app é utilizado uma vez ao dia pela equipe de Contas a Receber/Crédito, após a execução do job.

---

### Detalhamento da implementação

* Programa ABAP (job) de identificação, agendado diariamente às 02:00 pelo app Programar jobs de aplicação, com execução em background.
* CDS View (Z) de apuração do saldo vencido por cliente, a partir das partidas em aberto de Contas a Receber (I_OperationalAcctgDocItem) e dos dados de crédito do Parceiro de Negócio (UKMBP_CMS e UKMBP_CMS_SGM), do segmento de atuação (BP001) e da hierarquia de crédito entre BPs.
* Tabela Z de lista de trabalho, com as propostas da última execução e o BP de origem dos clientes vinculados, e tabela Z de log de bloqueios e desbloqueios, para auditoria e reconhecimento dos bloqueios do app.
* App Fiori Elements (List Report) sobre CDS View com anotações de UI e comportamento RAP, com as ações Bloquear (parâmetro Motivo) e Desbloquear.
* Gravação do bloqueio e do motivo pelas classes standard do SAP Credit Management, sem atualização direta de tabela, para que seja gerado o histórico de alterações standard lido pelo DEL-COM-051: CL_UKM_BUPA_FACTORY (GET_CREDIT_ACCOUNT e SAVE_ALL) e CL_UKM_ACCOUNT (SET_BLOCK ou GET_BP_CMS_SGM / SET_BP_CMS_SGM).

#### Detalhamento da Tabela/APP/STVARV de Parâmetros
A régua de bloqueio é fixa no código, conforme o BPDD. Recomenda-se manter em parâmetro (APP Tabele de parâmetros) apenas a relação entre classe de risco e perfil (à vista / a prazo) e as classes excluídas da avaliação (ex.: 5 – CVH Interna), para que a criação ou exclusão de uma classe não exija alteração de programa.

#### Dados referentes a liberação do GAP em APP Fiori
* **Nome do aplicativo:** Bloquear/Desbloquear Clientes Inadimplentes.
* **Catálogo/Grupo Fiori:** Contas a Receber / Gestão de Crédito, incluído no Launchpad dos perfis de Contas a Receber e Crédito.
* **Telas previstas:** (1) lista de clientes com filtros, seleção múltipla e ações; (2) diálogo padrão da ação Bloquear com o motivo. O detalhe do cliente é consultado nos apps standard, por navegação.

#### Objetos de autorização
Objeto de autorização customizado (ex.: Z_FI_BLOQ) com os campos Empresa (BUKRS), Segmento de crédito e Atividade (Exibir / Bloquear / Desbloquear). O mesmo perfil executa bloqueio e desbloqueio, conforme definido com o negócio. Role PFCG dedicada ao app, derivada dos perfis SAP_BR_AR_MANAGER e SAP_BR_CREDIT_CONTROLLER.

#### Frequência e volume
Job diário às 02:00, avaliando a base de clientes com função de crédito no segmento 1000, exceto a classe 5. O volume de propostas acompanha o nível de inadimplência da carteira.

---

### Classificação por classe de risco (UKMBP_CMS-RISK_CLASS) e régua aplicada

| Classe de risco | Descrição | Régua aplicada |
| :--- | :--- | :--- |
| **1A** | A VISTA | À vista – qualquer valor vencido há 1 dia ou mais |
| **2A** | A PRAZO | A prazo – a partir de R$ 500,01 vencido há 1 dia ou mais |
| **5** | CVH - INTERNA | Não avaliada – excluída do job e do app (PR-07) |

---

### Fontes de dados utilizadas pelo job

| Objeto | Campo de negócio | Campo técnico |
| :--- | :--- | :--- |
| **Parceiro de Negócio** | Função de crédito | BUT100-RLTYP = UKM000 |
| **Crédito – dados gerais** | Classe de risco | UKMBP_CMS-RISK_CLASS |
| **Parceiro de Negócio** | Segmento de atuação (característica de agrupamento) | BP001-GROUP_FEATURE |
| **Parceiro de Negócio** | Hierarquia de crédito (BP principal / vinculados) | BUT050-RELTYP = FUKM001 / TUKM001 |
| **Crédito – segmento** | Segmento de crédito | UKMBP_CMS_SGM-CREDIT_SGMNT |
| **Crédito – segmento** | Indicador de bloqueio | UKMBP_CMS_SGM-XBLOCKED |
| **Crédito – segmento** | Motivo do bloqueio | UKMBP_CMS_SGM-BLOCK_REASON |
| **Contas a Receber** | Empresa / Cliente | CompanyCode / Customer |
| **Contas a Receber** | Vencimento líquido | NetDueDate |
| **Contas a Receber** | Montante em moeda interna | AmountInCompanyCodeCurrency |
| **Contas a Receber** | Código de razão especial | SpecialGLCode |

*\*Campos de Contas a Receber da CDS standard I_OperationalAcctgDocItem, considerando somente partidas em aberto.*

---

### Estrutura sugerida da tabela Z de log (ex.: ZTFI_R2R009_LOG)

| Campo | Campo técnico (sugerido) | Origem | Observação |
| :--- | :--- | :--- | :--- |
| **ID do registro** | LOG_ID | Sistema | Chave única do registro |
| **Cliente** | PARTNER | Lista de trabalho / app | Parceiro de Negócio |
| **BP de origem** | PARTNER_ORIGEM | Job | BP do grupo que ultrapassou a régua; igual ao cliente quando não há vínculo |
| **Segmento de crédito** | CREDIT_SGMNT | Fixo | 1000 |
| **Ação** | ACAO | App | B = Bloqueio, D = Desbloqueio |
| **Motivo** | BLOCK_REASON | Usuário | Informado manualmente na efetivação |
| **Status** | STATUS / MENSAGEM | App | Sucesso ou erro da gravação do bloqueio |
| **Situação apurada** | RISK_CLASS / VLR_VENCIDO / DIAS_ATRASO | Job | Classe de risco, valor vencido e maior atraso no momento da ação |
| **Usuário, data e hora** | UNAME / DATUM / UZEIT | Sistema | Auditoria |
| **Execução do job** | JOBRUN_ID | Job | Vincula a ação à lista de trabalho de origem |
| **Origem do registro** | ORIGEM | App / carga inicial | A = App; C = Carga inicial do go-live (PR-13) |
