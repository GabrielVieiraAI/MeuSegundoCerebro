---
tags:
  - projeto
  - insi
  - veiling-holambra
  - sap
  - fi-ar
  - fscm
  - rap
  - abap-cloud
  - del-r2r-009
  - arquitetura
id_demanda: DEL-R2R-009
tipo: arquitetura-tecnica
data: 2026-10-23
---

# DEL-R2R-009 · Arquitetura Técnica e Lista de Objetos (ABAP Cloud Lean)

⬅️ [[00 - Identificação da Solicitação e Sumário|Sumário da Demanda]] | 📄 [[03 - Detalhamento para Desenvolvimento|Detalhamento para Desenvolvimento]] | 📋 [[03 - Consolidado de decisões tomadas em todas as reuniões|Decisões das Reuniões]] | 🚀 [[01 - DEL-R2R-009 - Guia de Implementação|Guia de Implementação]] | 💬 [[04 - DEL-R2R-009 - Guia de Implementação (Feedback Visual e Mensagens)|Feedback Visual e Mensagens]]

---

## 📌 Visão Geral da Arquitetura

🎨 **Diagrama Visual:** [[01 - DEL-R2R-009 - Arquitetura da Camada CDS.excalidraw|Visualizar no Excalidraw]]

A solução para a demanda **DEL-R2R-009 (Bloqueio e Desbloqueio Massivo de Clientes Inadimplentes)** segue a abordagem **ABAP Cloud Lean** (*Clean Core Tier 1*), desenvolvida inteiramente no **ABAP RESTful Application Programming Model (RAP)** e consumida via **SAP Fiori Elements (List Report)**.

### Decisões Fundamentais de Arquitetura:
1. **Abordagem ABAP Cloud Lean (Sem ZD / ZE redundantes):** 
   - A tabela de log utiliza tipos primitivos embutidos (`abap.char`, `abap.curr`, etc.) e tipos standard liberados (`sysuuid_x16`, `bu_partner`).
   - Os rótulos de apresentação (labels) são gerenciados pelas anotações nas CDS Views (`@EndUserText.label`).
   - A integridade de valores permitidos (ações `B`/`D`) é garantida pelo framework RAP (validações e ENUMs no Behavior Pool), eliminando a criação de domínios e elementos de dados Z obsoletos.
2. **Sem Job em background:** A identificação dos inadimplentes e o cálculo da régua são realizados dinamicamente em tempo real via [[CDS - Core Data Services|CDS Views]].
3. **Sem tabela Z de lista de trabalho:** O app reflete os dados vivos da CDS View. A tabela Z existe unicamente para **auditoria e histórico (log)**.
4. **Crédito centralizado na Matriz:** O bloqueio é efetivado no BP da Matriz; filiais com títulos em atraso são mapeadas e exibidas como **BP de Origem**.
5. **Processamento independente em lote:** As ações em massa tratam cliente a cliente de forma desacoplada, retornando mensagens consolidadas para a UI (Message View).

---

## 🧱 Lista Consolidada de Objetos Técnicos

A nomenclatura segue estritamente o [[00 - Padrão de Nomenclatura ABAP Veiling Holambra|Padrão de Nomenclatura ABAP Veiling Holambra]] (módulo **FI**, separador `_`, descrições em português).

### 1. Camada de Dicionário de Dados (ABAP Dictionary - DDL via Eclipse ADT)

| Tipo de Objeto          | Padrão          | Nome do Objeto       | Responsabilidade Técnica                                                                                                                                                                                                                                                                                                                                       |
| :---------------------- | :-------------- | :------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Tabela Transparente** | `ZT[MD]_<desc>` | [[01 - ZTFI_LOG_INADIMP|ZTFI_LOG_INADIMP]] | Tabela de log para auditoria de bloqueio e desbloqueio. Registra chave única (`sysuuid_x16`), BP Matriz (`bu_partner`), BP Origem (`bu_partner`), segmento de crédito, ação (`abap.char(1)`: B/D), motivo do bloqueio, status da execução (`abap.char(1)`: S/E), montante vencido, dias de atraso, timestamp (`abap.utclong`) e usuário (`abp_creation_user`). |

> [!TIP]
> **Definição Lean da Tabela:** No ABAP Cloud, os campos `partner` e `partner_origem` reutilizam o mesmo elemento de dados standard liberado `bu_partner`. A diferenciação de rótulo para o usuário ("Matriz" vs "BP de Origem") é realizada via `@EndUserText.label` na camada de CDS View.
> 
> **Tabela de Parâmetros (Clean Core):** A parametrização de empresa (`BUKRS/EMPRESA`), segmento de crédito (`CREDIT_SGMNT/SEGMENTO`), tipo de vínculo (`RELTYP/GRUPO`), classes de risco (`RISK_CLASS/A_VISTA`, `RISK_CLASS/A_PRAZO`, `RISK_CLASS/EXCLUIR`) e limite de corte (`LIMITE_CORTE/A_PRAZO`) utiliza a tabela corporativa de parâmetros da Veiling (`ZTCA_PARAM_PAR` / `ZTCA_PARAM_VAL`, sob `Modulo = 'FI'` e `Chave1 = 'DEL_R2R_009'`), lida nas CDS Views via `ZI_CA_GET_PARAMETER` e no *Behavior Pool* via **zclca_tabela_parametros\=>get_instance( )**, eliminando hardcodes e garantindo fonte única entre tela e ações.

---

### 2. Camada de Modelagem de Dados (CDS Views)

🎨 **Diagrama Visual:** [[01 - DEL-R2R-009 - Arquitetura da Camada CDS.excalidraw|Visualizar no Excalidraw]]

| Tipo de Objeto                       | Padrão            | Nome do Objeto               | Responsabilidade Técnica                                                                                                                                                                                                                   |
| :----------------------------------- | :---------------- | :--------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **CDS Interface (Basic/Composite)**  | `ZI_[MD]_<desc>`  | [[04 - ZI_FI_TITULOS_VENCIDOS|ZI_FI_TITULOS_VENCIDOS]]     | Filtra as parcelas em aberto e vencidas a partir de `I_OperationalAcctgDocItem` (chave por item: `CompanyCode`, `AccountingDocument`, `FiscalYear`, `AccountingDocumentItem`) aplicando `FinancialAccountType = 'D'`, empresa parametrizada via `ZI_CA_GET_PARAMETER` (`BUKRS/EMPRESA`), `ClearingDate` inicial e `NetDueDate < $session.system_date`, sumarizando o saldo vencido por cliente e empresa. |
| **CDS Interface (Basic/Composite)**  | `ZI_[MD]_<desc>`  | [[05 - ZI_FI_PARCEIRO_CREDITO|ZI_FI_PARCEIRO_CREDITO]]     | Consolida os dados de crédito do Parceiro de Negócio (`UKM000`, `UKMBP_CMS`, `UKMBP_CMS_SGM`, `BP001`) consumindo empresa, segmento de crédito, tipo de vínculo na `BUT050` e classes excluídas diretamente de `ZI_CA_GET_PARAMETER`, expondo `CompanyCode` e resolvendo a hierarquia Matriz x Filiais via `UNION` (chave tripla `PartnerMatriz + CreditSegment + PartnerOrigem`). |
| **CDS Interface (Composite)**        | `ZI_[MD]_<desc>`  | [[15 - ZI_FI_GRUPO_INADIMPLENTE|ZI_FI_GRUPO_INADIMPLENTE]] | Consolida a situação de inadimplência do grupo econômico (`PartnerMatriz + CreditSegment + CompanyCode`) avaliando a régua de corte individualmente por empresa sem somar saldos, consumindo as classes (`A_VISTA` / `A_PRAZO`) e o valor mínimo (`LIMITE_CORTE/A_PRAZO`) de `ZI_CA_GET_PARAMETER` e retornando a flag `GrupoInadimplente` (`1` ou `0`). |
| **CDS Interface (Composite / Root)** | `ZI_[MD]_<desc>`  | [[06 - ZI_FI_CLIENTE_INADIMPLENTE (CDS)\|ZI_FI_CLIENTE_INADIMPLENTE]] | Entidade raiz do modelo RAP com chave tripla (`PartnerMatriz + CreditSegment + PartnerOrigem`) e atributo `CompanyCode`. Cruza os parceiros de crédito com os títulos vencidos individuais por empresa, exclui clientes bloqueados por outros motivos (`BLOCK_REASON <> '10'`) e consome `ZI_FI_GRUPO_INADIMPLENTE` para definir `AcaoProposta` e `OrdemProposta` de forma 100% simétrica pelo grupo econômico. |
| **CDS Consumption (Projection)**     | `ZC_[MD]_<desc>`  | [[09 - ZC_FI_CLIENTE_INADIMPLENTE (CDS)\|ZC_FI_CLIENTE_INADIMPLENTE]] | Visão de projeção exposta para a UI com chave tripla (`PartnerMatriz + CreditSegment + PartnerOrigem`, 1 linha por empresa: Matriz e filiais) e atributo oculto `CompanyCode` (`@UI.hidden: true`), ordenada pela coluna de ação proposta (`Bloquear` primeiro), com filtros por segmento de atuação (`GROUP_FEATURE` / Autosserviço), classe de risco e ação proposta. |
| **Metadata Extension (MDE)**         | Mesmo nome da CDS | [[10 - ZC_FI_CLIENTE_INADIMPLENTE (MDE)\|ZC_FI_CLIENTE_INADIMPLENTE]] | Centraliza as anotações visuais da UI (`@UI.lineItem`, `@UI.selectionField`, `@UI.presentationVariant` para ordenação e botões de ação), mantendo o código da CDS desacoplado da interface. |


---

### 3. Camada de Comportamento de Negócio (RAP - Business Object)

| Tipo de Objeto | Padrão | Nome do Objeto | Responsabilidade Técnica |
| :--- | :--- | :--- | :--- |
| **Behavior Definition (BDEF Root)** | Mesmo nome da CDS raiz | [[07 - ZI_FI_CLIENTE_INADIMPLENTE (BDEF)\|ZI_FI_CLIENTE_INADIMPLENTE]] | Define as operações do Business Object e as ações customizadas em massa: `bloquearCliente` (motivo fixo `10`, sem pop-up) e `desbloquearCliente`. |
| **Behavior Definition (Projection)**| Mesmo nome da CDS consumo | [[11 - ZC_FI_CLIENTE_INADIMPLENTE (BDEF)\|ZC_FI_CLIENTE_INADIMPLENTE]] | Projeta as ações de negócio para a interface Fiori Elements. |
| **Behavior Pool (Classe ABAP)** | `ZCL[MD]_<desc>` | [[08 - ZCLFI_BP_CLIENTE_INAD|ZCLFI_BP_CLIENTE_INAD]] | Implementação das ações do BDEF. Lê instâncias pela chave tripla (`PartnerMatriz`, `CreditSegment`, `PartnerOrigem`), executa validações dinâmicas de autorização por empresa do registro (`ZFI_BLOQ`), resolve o grupo econômico parametrizado (`RELTYP/GRUPO`), realiza bloqueio/desbloqueio em cascata via APIs standard de crédito (`CL_UKM_BUPA_FACTORY` / `CL_UKM_ACCOUNT`), grava a auditoria em [[01 - ZTFI_LOG_INADIMP|ZTFI_LOG_INADIMP]] e monta as mensagens consolidadas de retorno. |

---

### 4. Camada de Serviço e Exposição (Service Layer)

| Tipo de Objeto | Padrão | Nome do Objeto | Responsabilidade Técnica |
| :--- | :--- | :--- | :--- |
| **Service Definition** | `ZUI_[MD]_<desc>` | [[12 - ZUI_FI_CLIENTE_INAD|ZUI_FI_CLIENTE_INAD]] | Declara e expõe a entidade de consumo [[09 - ZC_FI_CLIENTE_INADIMPLENTE (CDS)\|ZC_FI_CLIENTE_INADIMPLENTE]]. |
| **Service Binding** | `ZUI_<O2\|O4>_[MD]_<desc>` | [[13 - ZUI_O2_FI_CLIENTE_INAD|ZUI_O2_FI_CLIENTE_INAD]] | Gera o serviço OData V2 (categoria UI) pronto para consumo por aplicações SAP Fiori Elements. |

---

### 5. Camada de Segurança e Mensagens

| Tipo de Objeto                   | Padrão         | Nome do Objeto      | Responsabilidade Técnica                                                                                                                                                        |
| :------------------------------- | :------------- | :------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Classe de Mensagens (SE91)**   | `Z[MD]_<desc>` | [[03 - ZFI_INADIMPLENCIA|ZFI_INADIMPLENCIA]] | Mensagens do sistema para validações, autorização, sucesso e mensagens individuais no retorno consolidado.                                                                      |
| **Objeto de Autorização (SU21)** | `Z<desc>`      | [[02 - ZFI_BLOQ|ZFI_BLOQ]]          | Objeto de autorização contendo os campos: Empresa (`BUKRS`), Segmento de Crédito (`UKM_SGMNT`) e Atividade (`ACTVT` = `03` Exibir, `43` Liberar/Desbloquear, `05` Bloquear). |

---

### 6. Camada Frontend (SAP Fiori Elements & Launchpad)

| Tipo de Objeto | Padrão | Nome do Objeto | Responsabilidade Técnica |
| :--- | :--- | :--- | :--- |
| **Aplicação Fiori Elements** | Até 21 caracteres | [[14 - bloqinadimplente (App Fiori)\|bloqinadimplente]] | App no padrão List Report com seleção múltipla, filtros avançados e suporte à visualização de mensagens consolidadas (Message View). |
| **Objeto BSP (Deploy)** | `ZZ1_<desc>` (máx. 15 chars) | [[14 - bloqinadimplente (App Fiori)\|ZZ1_BLOQ_INAD]] | Aplicação BSP persistida no repositório ABAP após o deploy. |
| **Catálogo Técnico** | `ZTC_[MD]_<desc>` | [[14 - bloqinadimplente (App Fiori)\|ZTC_FI_INADIMPLENCIA]] | Catálogo técnico que contém o target mapping e definição da aplicação. |
| **Catálogo de Negócio** | `ZBC_[MD]_<desc>` | [[14 - bloqinadimplente (App Fiori)\|ZBC_FI_INADIMPLENCIA]] | Catálogo de negócio associado ao perfil dos operadores de Contas a Receber e Crédito. |
| **Grupo / Espaço e Página** | `ZGP_[MD]_<desc>` | [[14 - bloqinadimplente (App Fiori)\|ZGP_FI_INADIMPLENCIA]] | Agrupamento de apps para exibição na tela inicial do SAP Fiori Launchpad. |

---

## 📋 Resumo Comparativo: O Que Economizamos com o ABAP Cloud Lean

| Elemento Clássico | Equivalente no ABAP Cloud Lean | Vantagem Técnica |
| :--- | :--- | :--- |
| `ZD_ACAO_BLOQUEIO` (Domínio) | Tipo embutido `abap.char(1)` + Validação no RAP | Elimina objeto físico de dicionário; regras ficam na camada de aplicação. |
| `ZD_STATUS_PROCESSAMENTO` (Domínio) | Tipo embutido `abap.char(1)` | Menos um objeto para manter e transportar via request. |
| `ZE_ACAO_BLOQUEIO` (Elemento de Dados) | Anotação `@EndUserText.label` na CDS View | Textos dinâmicos desacoplados da estrutura de banco de dados. |
| `ZE_STATUS_PROCESSAMENTO` (Elemento de Dados) | Anotação `@EndUserText.label` na CDS View | Centralização dos rótulos de apresentação na camada analítica. |
| `ZE_BP_ORIGEM` (Elemento de Dados) | Reutilização do standard `bu_partner` + `@EndUserText.label: 'BP de Origem'` | 100% aderente ao Clean Core (reuso de tipos liberados pela SAP). |

---

## 🔄 Próximos Passos para o Detalhamento

1. [x] Definir a sintaxe exata DDL da tabela [[01 - ZTFI_LOG_INADIMP|ZTFI_LOG_INADIMP]] no Eclipse ADT (campos, tipos e chaves).
2. [x] Detalhar a arquitetura das CDS Views ([[04 - ZI_FI_TITULOS_VENCIDOS|ZI_FI_TITULOS_VENCIDOS]], [[05 - ZI_FI_PARCEIRO_CREDITO|ZI_FI_PARCEIRO_CREDITO]], [[06 - ZI_FI_CLIENTE_INADIMPLENTE (CDS)|ZI_FI_CLIENTE_INADIMPLENTE]] e [[09 - ZC_FI_CLIENTE_INADIMPLENTE (CDS)|ZC_FI_CLIENTE_INADIMPLENTE]]).
3. [x] Desenhar a lógica do Behavior Pool [[08 - ZCLFI_BP_CLIENTE_INAD|ZCLFI_BP_CLIENTE_INAD]] (chamada das classes de crédito com motivo fixo `10` e persistência do log).
