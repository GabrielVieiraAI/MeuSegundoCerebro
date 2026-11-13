---
tipo: guia-implementacao
tipo_demanda: novo-app
tags:
  - projeto
  - veiling-holambra
  - sap
  - fi
  - fi-ap
  - rap
  - cds
  - odata-v4
  - fiori
  - abap-cloud
  - del-com-165
  - guia-implementacao
id_demanda: "DEL-COM-165"
data: 2026-11-12
aliases:
  - "DEL-COM-165 - Guia de Implementação"
  - "01 - DEL-COM-165 - Guia de Implementação"
---

# 🚀 DEL-COM-165 · Guia Passo a Passo de Implementação (Ordem de Criação)

⬅️ [[00 - DEL-COM-165 - Visão Integrada e Infraestrutura|Visão Integrada]] | 📱 [[01 - DEL-COM-165 - Arquitetura App 1 (Carga Massiva de Taxas)|Arquitetura App 1]] | ⚙️ [[02 - DEL-COM-165 - Arquitetura App 2 (Tipos de Movimento)|Arquitetura App 2]] | 🧪 [[02 - DEL-COM-165 - Guia de Testes e Homologação|Guia de Testes e Homologação]] | 🎨 [[02 - DEL-COM-165 - Fluxo de Implementação.excalidraw|Fluxo de Implementação (Excalidraw)]] | 🗺️ [[03 - DEL-COM-165 - Jornada do Dado dos Apps (Fluxo End-to-End).excalidraw|Jornada do Dado (Excalidraw)]] | 📋 [[Consolidado de decisões tomadas em todas as reuniões|Decisões Consolidadas]]

---

🎨 **Diagrama Visual do Fluxo (Passos 01 a 36 + Go-Live Técnico):**
[[02 - DEL-COM-165 - Fluxo de Implementação.excalidraw|Abrir fluxo no Excalidraw]]
![[02 - DEL-COM-165 - Fluxo de Implementação.excalidraw|Abrir fluxo no Excalidraw]]

---

## 🛠️ Detalhamento Passo a Passo por Fase

> [!NOTE] Guia de Execução (Ordem Bottom-Up)
> Esta checklist representa a **ordem cronológica exata de dependências técnicas** da demanda no pacote `ZFI_CARGA_TAXAS`. Cada passo aponta diretamente para a nota individual do objeto na pasta `04 - Objetos Tecnicos`, onde constam o passo a passo de criação no **Eclipse ADT** (*ABAP Development Tools*) ou **BAS** (*SAP Business Application Studio*) e os snippets de código completos (**Comentado** e **Limpo**).

### Fase 1: Fundação, Segurança e Dicionário de Dados (DDIC)
> **Objetivo:** Criar o pacote `ZFI_CARGA_TAXAS` (caso ainda não exista no ambiente) e construir todos os objetos independentes de suporte que serão consumidos pelas classes ABAP, CDS Views (*Core Data Services*) e controles de autorização nas fases seguintes.

- [ ] Passo 1 — Criar a Classe de Mensagens (`SE91`) [[06 - ZFI_TAXAS|ZFI_TAXAS]] *(mensagens `001` a `025` compartilhadas entre App 1 e App 2)*
- [ ] Passo 2 — Criar o Objeto de Autorização (`SU21`) [[07 - ZTAXCARGA|ZTAXCARGA]] *(campos `BUKRS` e `ACTVT` com atividades `01`, `02`, `03` e `16`)*
- [ ] Passo 3 — Criar o Objeto de Intervalo de Numeração (`SNRO`) [[08 - ZTAXCARNR|ZTAXCARNR]] *(numeração de 10 dígitos para `carga_id`)*
- [ ] Passo 4 — Criar a Tabela Transparente de Regras [[01 - ZTFI_TAX_TPMOV|ZTFI_TAX_TPMOV]] *(parametrização dos Tipos de Movimento)*
- [ ] Passo 5 — Criar a Tabela Transparente de Rascunho (*Draft*) [[02 - ZTFI_TAX_TPMOV_D|ZTFI_TAX_TPMOV_D]] *(suporte ao *Draft* do App 2 no **RAP** — *ABAP RESTful Application Programming Model*)*
- [ ] Passo 6 — Criar a Tabela Transparente Nível 1 [[03 - ZTFI_TAX_CARGA|ZTFI_TAX_CARGA]] *(cabeçalho do lote de carga)*
- [ ] Passo 7 — Criar a Tabela Transparente Nível 2 [[04 - ZTFI_TAX_DOC|ZTFI_TAX_DOC]] *(documentos contábeis agrupados por `DOCSEQ`)*
- [ ] Passo 8 — Criar a Tabela Transparente Nível 3 [[05 - ZTFI_TAX_ITEM|ZTFI_TAX_ITEM]] *(partidas de fornecedor e contrapartida automática)*

---

### Fase 2: Motores e Wrappers ABAP de Suporte
> **Objetivo:** Construir as duas classes utilitárias centrais que isolam as chamadas clássicas de **BAPI** (*Business Application Programming Interface*) e a manipulação nativa de arquivos `.xlsx` via biblioteca **XCO** (*ABAP Cloud XCO Library*).

> [!IMPORTANT] Contrato de Liberação C1 na Classe Wrapper
> No **Passo 9**, a classe `ZCLFI_TAX_BAPI_WRAP` deve ser criada com **Language Version = Standard ABAP** para poder invocar `BAPI_ACC_DOCUMENT_CHECK`, `BAPI_ACC_DOCUMENT_POST` e `NUMBER_GET_NEXT`, e em seguida receber a liberação **API State `C1` (*Use System-Internally*)** na aba *Properties -> API State* do Eclipse ADT para que o *Behavior Pool* em ABAP Cloud possa chamá-la sem erro de sintaxe.

- [ ] Passo 9 — Criar e liberar (API State C1) a Classe Wrapper [[09 - ZCLFI_TAX_BAPI_WRAP|ZCLFI_TAX_BAPI_WRAP]]
- [ ] Passo 10 — Criar a Classe de Leitura e Geração Excel (`XCO_CP_XLSX`) [[10 - ZCLFI_TAX_EXCEL|ZCLFI_TAX_EXCEL]]

---

### Fase 3: Backend do Aplicativo 2 — Manutenção de Tipos de Movimento (RAP + Draft)
> **Objetivo:** Construir e validar primeiro todo o backend do **Aplicativo 2**, pois a CDS View raiz `ZI_FI_TAX_TPMOV` é referenciada diretamente pelo **Aplicativo 1** (para ajuda de pesquisa *Value Help* e exposição no serviço OData) e permite cadastrar as regras antes dos testes de carga.

- [ ] Passo 11 — Criar a CDS Interface Root [[11 - ZI_FI_TAX_TPMOV (CDS)|ZI_FI_TAX_TPMOV (CDS)]]
- [ ] Passo 12 — Criar a CDS Projection [[14 - ZC_FI_TAX_TPMOV (CDS)|ZC_FI_TAX_TPMOV (CDS)]]
- [ ] Passo 13 — Criar a Metadata Extension (`MDE`) [[15 - ZC_FI_TAX_TPMOV (MDE)|ZC_FI_TAX_TPMOV (MDE)]]
- [ ] Passo 14 — Criar o Behavior Definition Root (`BDEF` Managed com Draft) [[12 - ZI_FI_TAX_TPMOV (BDEF)|ZI_FI_TAX_TPMOV (BDEF)]]
- [ ] Passo 15 — Gerar (via `Ctrl + 1` no BDEF) e implementar a classe *Behavior Pool* [[13 - ZCLFI_BP_TAX_TPMOV|ZCLFI_BP_TAX_TPMOV]]
- [ ] Passo 16 — Criar o Behavior Definition de Projeção [[16 - ZC_FI_TAX_TPMOV (BDEF)|ZC_FI_TAX_TPMOV (BDEF)]]
- [ ] Passo 17 — Criar o Service Definition [[17 - ZUI_FI_TAX_TPMOV|ZUI_FI_TAX_TPMOV]]
- [ ] Passo 18 — Criar, publicar (`Publish`) e testar no *Fiori Preview* o Service Binding OData V4 [[18 - ZUI_O4_FI_TAX_TPMOV|ZUI_O4_FI_TAX_TPMOV]]

---

### Fase 4: Backend do Aplicativo 1 — Carga Massiva e Monitor de Taxas (RAP 3 Níveis)
> **Objetivo:** Construir a hierarquia composicional de 3 níveis (`Carga -> Documento -> Item`), o controle de acesso **DCL** (*Data Control Language*), o *Behavior Pool* com geração automática da contrapartida `DS-ATR` e a contabilização em commit único no método `save_modified`.

> [!WARNING] Ativação em Massa (`Ctrl + Shift + F3`) nas Hierarquias de 3 Níveis
> Como `ZI_FI_TAX_CARGA` compõe `ZI_FI_TAX_DOC` e `ZI_FI_TAX_DOC` compõe `ZI_FI_TAX_ITEM` (que apontam de volta para os pais via `association to parent`), há referência circular entre as três definições. **Crie e salve (`Ctrl + S`) os Passos 20, 21 e 22 e ative todos juntos usando Ativação em Massa (`Ctrl + Shift + F3`)**. Repita o mesmo procedimento conjunto nos **Passos 24, 25 e 26** (Camada de Projeção `ZC_`).

- [ ] Passo 19 — Criar a CDS Entity Abstrata (payload Base64 de upload/download) [[23 - ZI_FI_TAX_ARQUIVO|ZI_FI_TAX_ARQUIVO]]
- [ ] Passo 20 — Criar e salvar a CDS Interface Nível 3 [[22 - ZI_FI_TAX_ITEM|ZI_FI_TAX_ITEM]] *(aguardar Passo 22 para ativar em massa)*
- [ ] Passo 21 — Criar e salvar a CDS Interface Nível 2 [[21 - ZI_FI_TAX_DOC|ZI_FI_TAX_DOC]] *(aguardar Passo 22 para ativar em massa)*
- [ ] Passo 22 — Criar a CDS Interface Root Nível 1 [[19 - ZI_FI_TAX_CARGA (CDS)|ZI_FI_TAX_CARGA (CDS)]] e ativar os **Passos 20, 21 e 22 juntos (`Ctrl + Shift + F3`)**
- [ ] Passo 23 — Criar e ativar o Access Control (`DCL`) [[20 - ZI_FI_TAX_CARGA (DCL)|ZI_FI_TAX_CARGA (DCL)]]
- [ ] Passo 24 — Criar e salvar a CDS Projection Nível 3 [[28 - ZC_FI_TAX_ITEM (CDS)|ZC_FI_TAX_ITEM (CDS)]] *(aguardar Passo 26 para ativar em massa)*
- [ ] Passo 25 — Criar e salvar a CDS Projection Nível 2 [[27 - ZC_FI_TAX_DOC (CDS)|ZC_FI_TAX_DOC (CDS)]] *(aguardar Passo 26 para ativar em massa)*
- [ ] Passo 26 — Criar a CDS Projection Root Nível 1 [[26 - ZC_FI_TAX_CARGA (CDS)|ZC_FI_TAX_CARGA (CDS)]] e ativar os **Passos 24, 25 e 26 juntos (`Ctrl + Shift + F3`)**
- [ ] Passo 27 — Criar a Metadata Extension (`MDE`) Nível 1 [[29 - ZC_FI_TAX_CARGA (MDE)|ZC_FI_TAX_CARGA (MDE)]]
- [ ] Passo 28 — Criar a Metadata Extension (`MDE`) Nível 2 [[30 - ZC_FI_TAX_DOC (MDE)|ZC_FI_TAX_DOC (MDE)]]
- [ ] Passo 29 — Criar a Metadata Extension (`MDE`) Nível 3 [[31 - ZC_FI_TAX_ITEM (MDE)|ZC_FI_TAX_ITEM (MDE)]]
- [ ] Passo 30 — Criar o Behavior Definition Root (`Managed with additional save`) [[24 - ZI_FI_TAX_CARGA (BDEF)|ZI_FI_TAX_CARGA (BDEF)]]
- [ ] Passo 31 — Gerar (via `Ctrl + 1` no BDEF) e implementar a classe *Behavior Pool* [[25 - ZCLFI_BP_TAX_CARGA|ZCLFI_BP_TAX_CARGA]] *(atentar-se para colar o código na aba **Local Types** e na **Global Class**)*
- [ ] Passo 32 — Criar o Behavior Definition de Projeção [[32 - ZC_FI_TAX_CARGA (BDEF)|ZC_FI_TAX_CARGA (BDEF)]]
- [ ] Passo 33 — Criar o Service Definition [[33 - ZUI_FI_TAX_CARGA|ZUI_FI_TAX_CARGA]]
- [ ] Passo 34 — Criar, publicar (`Publish`) e testar a abertura inicial no *Fiori Preview* o Service Binding OData V4 [[34 - ZUI_O4_FI_TAX_CARGA|ZUI_O4_FI_TAX_CARGA]]

---

### Fase 5: Camada Frontend (SAP Fiori Elements & Deploy BSP)
> **Objetivo:** Gerar os dois projetos **SAP Fiori Elements** no **BAS** (*SAP Business Application Studio*) ou **VS Code**, adicionar a *Controller Extension* de manipulação Excel em Base64 no App 1 e realizar o deploy dos repositórios **BSP** (*Business Server Pages*) no servidor ABAP respeitando o limite de 15 caracteres da Veiling Holambra.

- [ ] Passo 35 — Gerar, configurar e fazer deploy do App 2 [[36 - taxastipomov (App Fiori)|taxastipomov (App Fiori)]] *(BSP: `ZZ1_TAXTPMOV` sobre `ZUI_O4_FI_TAX_TPMOV`)*
- [ ] Passo 36 — Gerar, implementar `ListReportExt.controller.js` + `manifest.json` e fazer deploy do App 1 [[35 - taxascarga (App Fiori)|taxascarga (App Fiori)]] *(BSP: `ZZ1_TAXCARGA` sobre `ZUI_O4_FI_TAX_CARGA`)*

---

### Fase 6: Publicação no SAP Fiori Launchpad e Carga Inicial de Parâmetros (Go-Live Técnico)
> **Objetivo:** Expor os dois aplicativos como tiles no **SAP Fiori Launchpad**, atribuir as permissões nas funções de usuário (**Roles PFCG**) e preencher os dados iniciais obrigatórios antes de iniciar a bateria de testes.

- [ ] **Launchpad (`FLPM` / `/UI2/FLPD_CONF`):** Criar o Catálogo Técnico `ZTC_FI_TAXAS` com os dois Mapeamentos de Alvo (*Target Mappings*):
  - App 1: Objeto Semântico `ZFI_TAXAS_CARGA` | Ação `manage` | ID UI5 `br.com.veiling.fi.taxascarga` | BSP `ZZ1_TAXCARGA`
  - App 2: Objeto Semântico `ZFI_TAXAS_TPMOV` | Ação `manage` | ID UI5 `br.com.veiling.fi.taxastipomov` | BSP `ZZ1_TAXTPMOV`
- [ ] **Catálogos de Negócio e Grupo (`FLPM`):**
  - `ZBC_FI_TAXAS` (Operadores Financeiros / Auditoria — exibe apenas o App 1 `taxascarga`)
  - `ZBC_FI_TAXAS_CFG` (Key Users de Contabilidade — exibe o App 2 `taxastipomov`)
  - Grupo `ZGP_FI_TAXAS` reunindo os tiles de acesso conforme o perfil do usuário
- [ ] **Segurança (`PFCG`):** Criar/atualizar as Roles atribuindo os serviços OData V4 (`ZUI_O4_FI_TAX_CARGA` e `ZUI_O4_FI_TAX_TPMOV`), os catálogos de negócio e o objeto de autorização `ZTAXCARGA`:
  - **Perfil Operador Financeiro (Carga + Lançamento):** `ACTVT` = `01` (Upload), `03` (Exibir/Modelo), `16` (Contabilizar)
  - **Perfil Consulta / Auditoria:** `ACTVT` = `03` (Exibir apenas)
  - **Perfil Key User Contabilidade (Parâmetros):** `ACTVT` = `02` (Manter `ZTFI_TAX_TPMOV`)
- [ ] **Intervalo `SNRO` (`ZTAXCARNR`):** Cadastrar o intervalo **`01`** de `0000000001` até `9999999999` (numeração interna) no ambiente de Desenvolvimento (`DEV`) e replicar via ambiente de Qualidade (`QAS`) / Produção (`PRD`).
- [ ] **Carga Inicial de Parâmetros no App 2 (`taxastipomov`):** Abrir o App 2 recém-publicado e cadastrar os Tipos de Movimento oficiais da [[01 - Especificação Funcional (Visão da Solução)|Especificação Funcional]] (ex.: `CS-ADM`, `CS-INT`, `CS-DES`, `CS-LCP`, `DS-ATR` com contrapartida `2205010002`, `DS-LCP`, `CM-AQU` e `CM-DEV` com `zuonr_obrig = 'X'`, `FP-AJU` e `FR-AJU`).
