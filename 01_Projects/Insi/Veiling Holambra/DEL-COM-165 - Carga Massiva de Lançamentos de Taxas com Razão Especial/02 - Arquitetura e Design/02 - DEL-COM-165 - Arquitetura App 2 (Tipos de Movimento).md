---
tags:
  - projeto
  - insi
  - veiling-holambra
  - sap
  - fi
  - fi-ap
  - rap
  - abap-cloud
  - del-com-165
  - arquitetura
  - app2
id_demanda: DEL-COM-165
tipo: arquitetura-tecnica
data: 2026-11-11
aliases:
  - "02 - DEL-COM-165 - Arquitetura App 2 (Tipos de Movimento)"
---

# DEL-COM-165 · Arquitetura Técnica — Aplicativo 2 (Manutenção de Tipos de Movimento)

⬅️ [[00 - DEL-COM-165 - Visão Integrada e Infraestrutura|Visão Integrada]] | 📱 [[01 - DEL-COM-165 - Arquitetura App 1 (Carga Massiva de Taxas)|Ir para Arquitetura App 1]] | 🗺️ [[03 - DEL-COM-165 - Jornada do Dado dos Apps (Fluxo End-to-End).excalidraw|Jornada do Dado (End-to-End)]] | 📄 [[01 - Especificação Funcional (Visão da Solução)|Especificação Funcional]] | 📋 [[Consolidado de decisões tomadas em todas as reuniões|Decisões das Reuniões]]

---

## 📌 Visão Geral da Arquitetura do Aplicativo 2

🎨 **Diagrama Visual Exclusivo do App 2:** [[02 - DEL-COM-165 - Arquitetura Técnica App 2 (Tipos de Movimento).excalidraw|Visualizar no Excalidraw]]
![[02 - DEL-COM-165 - Arquitetura Técnica App 2 (Tipos de Movimento).excalidraw]]

O **Aplicativo 2 (`taxastipomov` / BSP `ZZ1_TAXTPMOV`)** é a aplicação administrativa voltada aos usuários chave (*Key Users* de FI) para parametrizar os **Tipos de Movimento**. Ele segue uma arquitetura **RAP Managed com Draft de 1 único nível** (apenas 1 CDS de Interface Raiz e 1 CDS de Projeção), exposta via **OData V4** e consumida por um aplicativo **SAP Fiori Elements** 100% standard.

### Decisões Fundamentais de Arquitetura do App 2:

1. **Modelagem Plana de 1 Único Nível com Suporte a Draft:**
   - Como a configuração de Tipos de Movimento não possui entidades filhas, a camada de modelagem utiliza exclusivamente **uma CDS Raiz** ([[11 - ZI_FI_TAX_TPMOV (CDS)|ZI_FI_TAX_TPMOV]]) sobre a tabela ativa [[01 - ZTFI_TAX_TPMOV|ZTFI_TAX_TPMOV]] e **uma CDS de Projeção** ([[14 - ZC_FI_TAX_TPMOV (CDS)|ZC_FI_TAX_TPMOV]]), acompanhada da tabela de rascunho [[02 - ZTFI_TAX_TPMOV_D|ZTFI_TAX_TPMOV_D]].
2. **Parametrização Flexível de Razão Especial (`umskz_deb` / `umskz_cred`) e Contrapartida (`hkont_contrapartida`):**
   - A estrutura de [[01 - ZTFI_TAX_TPMOV|ZTFI_TAX_TPMOV]] separa o código de Razão Especial de débito (`umskz_deb`) do código de Razão Especial de crédito (`umskz_cred`) e inclui a conta contábil de contrapartida (`hkont_contrapartida`), permitindo atender sem *hardcode*:
     - Movimentos em que Débito e Crédito usam o mesmo Razão Especial (`I`, `M`, `E`, `O`, `J`, `T`).
     - Movimento `CM-DEV` (*Cessão de Mudas*), onde o Débito no Sítio não possui Razão Especial (`umskz_deb` vazio) e o Crédito no Sócio usa Razão Especial `N` (`umskz_cred = 'N'`).
     - Movimento `DS-ATR` (*Distribuição de Sobras*), onde o Crédito usa Razão Especial `U` (`umskz_cred = 'U'`) e o Débito é gerado automaticamente na conta `2205010002` (`hkont_contrapartida = '2205010002'`).
3. **Determinações e Validações Nativas no Behavior Pool (`ZCLFI_BP_TAX_TPMOV`):**
   - Ao criar um novo registro, a *determination* `preencherDefaults` sugere automaticamente `blart = 'Z1'`, `zlspr = 'T'`, `ativo = 'X'`, `valido_de = data atual` e `valido_ate = '99991231'`.
   - Ao salvar, a *validation* `validarRegistro` garante que a descrição foi preenchida, que a vigência inicial não é maior que a final e que ao menos um código de Razão Especial ou conta de contrapartida foi informado.

---

## 🧱 Lista Consolidada de Objetos Técnicos — Aplicativo 2

### 1. Camada de Dicionário de Dados (ABAP Dictionary)

| Tipo de Objeto | Padrão | Nome do Objeto | Responsabilidade Técnica no App 2 |
| :--- | :--- | :--- | :--- |
| **Tabela Transparente (Ativa)** | `ZTFI_<desc>` | [[01 - ZTFI_TAX_TPMOV\|ZTFI_TAX_TPMOV]] | Armazena os Tipos de Movimento (`ztpmov`, `descricao`, `umskz_deb`, `umskz_cred`, `hkont_contrapartida`, `blart`, `zlspr`, `zfbdt_obrig`, `zuonr_obrig`, `ativo`, `valido_de`, `valido_ate` e campos de auditoria). |
| **Tabela Transparente (Draft)** | `ZTFI_<desc>_D` | [[02 - ZTFI_TAX_TPMOV_D\|ZTFI_TAX_TPMOV_D]] | Persistência temporária de rascunho (*Draft*) gerenciada pelo framework RAP durante a criação/edição no App 2. |

---

### 2. Camada de Modelagem de Dados (CDS Views — 1 Único Nível)

| Tipo de Objeto | Padrão | Nome do Objeto | Responsabilidade Técnica no App 2 |
| :--- | :--- | :--- | :--- |
| **CDS Interface (Root)** | `ZI_FI_<desc>` | [[11 - ZI_FI_TAX_TPMOV (CDS)\|ZI_FI_TAX_TPMOV]] | Entidade raiz única sobre `ZTFI_TAX_TPMOV` com anotações `@Semantics` de controle de usuário e timestamp (*ETag*). |
| **CDS Consumption (Projection)** | `ZC_FI_<desc>` | [[14 - ZC_FI_TAX_TPMOV (CDS)\|ZC_FI_TAX_TPMOV]] | Projeção transacional exposta para o App 2 com busca textual (`@Search.searchable`) por código e descrição. |
| **Metadata Extension (MDE)** | Mesmo nome da CDS | [[15 - ZC_FI_TAX_TPMOV (MDE)\|ZC_FI_TAX_TPMOV]] | Anotações `@UI.lineItem`, `@UI.selectionField` e `@UI.facet` (3 seções na Object Page: Identificação, Regras Contábeis e Auditoria). |

---

### 3. Camada de Comportamento de Negócio (RAP / Classes ABAP)

| Tipo de Objeto | Padrão | Nome do Objeto | Responsabilidade Técnica no App 2 |
| :--- | :--- | :--- | :--- |
| **Behavior Definition (Root)** | Mesmo nome da CDS | [[12 - ZI_FI_TAX_TPMOV (BDEF)\|ZI_FI_TAX_TPMOV]] | BDEF *Managed with Draft* com operações `create`, `update`, `delete`, `determination preencherDefaults` e `validation validarRegistro`. |
| **Behavior Definition (Projection)** | Mesmo nome da CDS | [[16 - ZC_FI_TAX_TPMOV (BDEF)\|ZC_FI_TAX_TPMOV]] | Projeta o CRUD e as ações de *Draft* (`Edit`, `Activate`, `Discard`, `Resume`, `Prepare`) para o serviço OData V4. |
| **Classe ABAP (Behavior Pool)** | `ZCLFI_BP_<desc>` | [[13 - ZCLFI_BP_TAX_TPMOV\|ZCLFI_BP_TAX_TPMOV]] | Implementa a checagem de autorização (`ACTVT = '02'`), o preenchimento de defaults e as validações de consistência do cadastro. |

---

### 4. Camada de Segurança e Mensagens (Compartilhada)

| Tipo de Objeto | Padrão | Nome do Objeto | Responsabilidade Técnica no App 2 |
| :--- | :--- | :--- | :--- |
| **Objeto de Autorização (SU21)** | `Z<desc>` | [[07 - ZTAXCARGA\|ZTAXCARGA]] | Valida permissão de manutenção (`ACTVT = '02'`) no método `get_global_authorizations`. |
| **Classe de Mensagens (SE91)** | `ZFI_<desc>` | [[06 - ZFI_TAXAS\|ZFI_TAXAS]] | Mensagens de erro de validação do cadastro (`022`, `023` e `024`). |

---

### 5. Camada de Serviço e Exposição (OData V4)

| Tipo de Objeto | Padrão | Nome do Objeto | Responsabilidade Técnica no App 2 |
| :--- | :--- | :--- | :--- |
| **Service Definition** | `ZUI_FI_<desc>` | [[17 - ZUI_FI_TAX_TPMOV\|ZUI_FI_TAX_TPMOV]] | Expõe exclusivamente a entidade `ZC_FI_TAX_TPMOV as TipoMovimento`. |
| **Service Binding** | `ZUI_O4_FI_<desc>` | [[18 - ZUI_O4_FI_TAX_TPMOV\|ZUI_O4_FI_TAX_TPMOV]] | Publica o serviço **OData V4 - UI** dedicado à manutenção de Tipos de Movimento. |

---

### 6. Camada Frontend (SAP Fiori & Launchpad)

| Tipo de Objeto | Padrão | Nome do Objeto | Responsabilidade Técnica no App 2 |
| :--- | :--- | :--- | :--- |
| **Aplicativo SAP Fiori** | `<desc>` | [[36 - taxastipomov (App Fiori)\|taxastipomov]] | App SAP Fiori Elements OData V4 standard (List Report + Object Page com Draft). Repositório BSP: `ZZ1_TAXTPMOV`. |
