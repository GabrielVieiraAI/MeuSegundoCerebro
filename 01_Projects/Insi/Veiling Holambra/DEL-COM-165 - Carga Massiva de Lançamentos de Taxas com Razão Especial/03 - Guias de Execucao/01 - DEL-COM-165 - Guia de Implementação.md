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
id_demanda: DEL-COM-165
data: 2026-11-12
sap_destination: Veiling_S4D_100_GVSOUZA_PT
transport_requests:
  - S4DK901042 - DEL-COM-165 - Carga Massiva de Lançamentos de Taxas
aliases:
  - DEL-COM-165 - Guia de Implementação
  - 01 - DEL-COM-165 - Guia de Implementação
---

# 🚀 DEL-COM-165 · Guia Passo a Passo de Implementação (Ordem de Criação)

⬅️ [[00 - DEL-COM-165 - Visão Integrada e Infraestrutura|Visão Integrada]] | 📱 [[01 - DEL-COM-165 - Arquitetura (Carga Massiva de Taxas)|Arquitetura Carga Massiva de Taxas]] | ⚙️ [[02 - DEL-COM-165 - Arquitetura (Tipos de Movimento)|Arquitetura Tipos de Movimento]] | 🧪 [[02 - DEL-COM-165 - Guia de Testes e Homologação|Guia de Testes e Homologação]] | 🎨 [[02 - DEL-COM-165 - Fluxo de Implementação.excalidraw|Fluxo de Implementação (Excalidraw)]] | 🗺️ [[03 - DEL-COM-165 - Jornada do Dado dos Apps (Fluxo End-to-End).excalidraw|Jornada do Dado (Excalidraw)]] | 📋 [[Consolidado de decisões tomadas em todas as reuniões|Decisões Consolidadas]]

---

🎨 **Diagrama Visual do Fluxo (Fase 0 + Passos 01 a 42):**
[[02 - DEL-COM-165 - Fluxo de Implementação.excalidraw|Abrir fluxo no Excalidraw]]
![[02 - DEL-COM-165 - Fluxo de Implementação.excalidraw|Abrir fluxo no Excalidraw]]

---

## 🛠️ Detalhamento Passo a Passo por Fase

> [!NOTE] Guia de Execução (Ordem Bottom-Up)
> Esta checklist representa a **ordem cronológica exata de dependências técnicas** da demanda sob o pacote pai `ZFI_CARGA_TAXAS` (dividido nos 3 subpacotes irmãos `ZFI_TAX_COMUM`, `ZFI_TAX_TPMOV` e `ZFI_TAX_CARGA`). Cada passo indica o modo de execução (**`[MCP]`** via servidor **MCP** `sap-adt` no ambiente `DEV`, ou **`[Manual]`** pelo desenvolvedor no **ADT** / **SAP GUI** / **BAS**), o subpacote de criação e o link direto para a nota técnica em `04 - Objetos Tecnicos`. Blocos circulares sinalizados com **`[Ativação em Massa: Ctrl + Shift + F3]`** devem ser criados e editados em conjunto antes da ativação em lote.

### Fase 0: Estrutura de Pacotes e Encapsulamento (Pré-requisito de Pacotes)
> **Objetivo:** Configurar a hierarquia de **3 subpacotes irmãos** dentro de `ZFI_CARGA_TAXAS` (sob `ZFI`) mantendo o padrão **`Package encapsulated`** da Veiling Holambra sem erros de *Package Check* no **ATC** (*ABAP Test Cockpit*).

- [x] **Passo 0.1A** `[MCP]` `[ZFI]` — Criar/validar o pacote pai `ZFI_CARGA_TAXAS` [[00A - ZFI_CARGA_TAXAS e Subpacotes (Estrutura de Pacotes)|Estrutura de Pacotes (Passo 0.1A)]] ✅ 2026-11-13
- [x] **Passo 0.1B** `[MCP]` `[ZFI_CARGA_TAXAS]` — Criar/validar o subpacote compartilhado `ZFI_TAX_COMUM` [[00A - ZFI_CARGA_TAXAS e Subpacotes (Estrutura de Pacotes)|Estrutura de Pacotes (Passo 0.1B)]] ✅ 2026-11-13
- [x] **Passo 0.1C** `[MCP]` `[ZFI_CARGA_TAXAS]` — Criar/validar o subpacote `ZFI_TAX_TPMOV` [[00A - ZFI_CARGA_TAXAS e Subpacotes (Estrutura de Pacotes)|Estrutura de Pacotes (Passo 0.1C)]] ✅ 2026-11-13
- [x] **Passo 0.1D** `[MCP]` `[ZFI_CARGA_TAXAS]` — Criar/validar o subpacote `ZFI_TAX_CARGA` [[00A - ZFI_CARGA_TAXAS e Subpacotes (Estrutura de Pacotes)|Estrutura de Pacotes (Passo 0.1D)]] ✅ 2026-11-13
- [x] **Passo 0.2** `[Manual]` `[ZFI_TAX_COMUM]` — Criar e ativar a *Package Interface* `ZPI_FI_TAX_COMUM` em `ZFI_TAX_COMUM` [[00B - ZPI_FI_TAX_COMUM (Package Interface)|Package Interface ZPI_FI_TAX_COMUM (Passo 0.2)]] *(se existir uma `ZPI_FI_CARGA_TAXAS` de teste no pacote pai, pode excluí-la)* ✅ 2026-11-13
- [x] **Passo 0.3** `[Manual]` `[ZFI_TAX_TPMOV / ZFI_TAX_CARGA]` — Liberar o acesso entre irmãos configurando `Use Access` -> `ZPI_FI_TAX_COMUM` (`Error Severity = none`) nos pacotes `ZFI_TAX_TPMOV` e `ZFI_TAX_CARGA` [[00C - Use Accesses (Liberação entre Subpacotes)|Use Accesses (Passo 0.3)]] ✅ 2026-11-13

---

### Fase 1: Fundação, Segurança e Dicionário de Dados (DDIC)
> **Objetivo:** Construir os objetos independentes de suporte (mensagens, segurança, numeração e tabelas transparentes) nos respectivos subpacotes.

- [x] Passo 1 `[MCP]` `[ZFI_TAX_COMUM]` — Criar a Classe de Mensagens (`SE91`) [[06 - ZFI_TAXAS|ZFI_TAXAS]] *(20 mensagens ativas no intervalo `001` a `025` compartilhadas entre `ZFI_TAX_CARGA` e `ZFI_TAX_TPMOV`; validada empiricamente via AFF)* ✅ 2026-11-13
- [x] Passo 2 `[Manual]` `[ZFI_TAX_COMUM]` — Criar o Objeto de Autorização (`SU21`) [[07 - ZTAXCARGA|ZTAXCARGA]] *(campos `BUKRS` e `ACTVT` com atividades `01`, `02`, `03` e `16`)* ✅ 2026-11-13
- [x] Passo 3 `[MCP]` `[ZFI_TAX_COMUM]` — Criar o Objeto de Intervalo de Numeração (`SNRO`) [[08 - ZTAXCARNR|ZTAXCARNR]] *(numeração de 10 dígitos `NUMC10` para `carga_id`; validado empiricamente via AFF — intervalo `01` no Passo 41 `[Manual]`)* ✅ 2026-11-13
- [x] Passo 4 `[MCP]` `[ZFI_TAX_COMUM]` — Criar a Tabela Transparente de Regras [[01 - ZTFI_TAX_TPMOV|ZTFI_TAX_TPMOV]] *(parametrização dos Tipos de Movimento; validada empiricamente via AFF)* ✅ 2026-11-13
- [x] Passo 5 `[MCP]` `[ZFI_TAX_TPMOV]` — Criar a Tabela Transparente de Rascunho (*Draft*) [[02 - ZTFI_TAX_TPMOV_D|ZTFI_TAX_TPMOV_D]] *(suporte ao *Draft* do Aplicativo de Tipos de Movimento (`ZFI_TAX_TPMOV`) no **RAP** — *ABAP RESTful Application Programming Model*; validada empiricamente via AFF)* ✅ 2026-11-13
- [x] Passo 6 `[MCP]` `[ZFI_TAX_CARGA]` — Criar a Tabela Transparente Nível 1 [[03 - ZTFI_TAX_CARGA|ZTFI_TAX_CARGA]] *(cabeçalho do lote de carga; validada empiricamente via AFF)* ✅ 2026-11-13
- [x] Passo 7 `[MCP]` `[ZFI_TAX_CARGA]` — Criar a Tabela Transparente Nível 2 [[04 - ZTFI_TAX_DOC|ZTFI_TAX_DOC]] *(documentos contábeis agrupados por `DOCSEQ`; validada empiricamente via AFF)* ✅ 2026-11-13
- [x] Passo 8 `[MCP]` `[ZFI_TAX_CARGA]` — Criar a Tabela Transparente Nível 3 [[05 - ZTFI_TAX_ITEM|ZTFI_TAX_ITEM]] *(partidas de fornecedor e contrapartida automática; validada empiricamente via AFF)* ✅ 2026-11-13

---

### Fase 2: Motores e Wrappers ABAP de Suporte
> **Objetivo:** Construir no pacote compartilhado **`ZFI_TAX_COMUM`** as duas classes utilitárias centrais que isolam as chamadas clássicas de **BAPI** (*Business Application Programming Interface*) e a manipulação nativa de arquivos `.xlsx` via biblioteca **XCO** (*ABAP Cloud XCO Library*).

> [!IMPORTANT] Contrato de Liberação C1 na Classe Wrapper
> No **Passo 9**, a classe `ZCLFI_TAX_BAPI_WRAP` deve usar **Language Version = Standard ABAP** para invocar `BAPI_ACC_DOCUMENT_CHECK`, `BAPI_ACC_DOCUMENT_POST` e `NUMBER_GET_NEXT`. Em seguida, no **Passo 9B**, recebe a liberação **API State `C1` (*Use System-Internally*)** na aba *Properties -> API State* do Eclipse ADT para que o *Behavior Pool* em ABAP Cloud possa chamá-la sem erro de sintaxe.

- [x] Passo 9 `[MCP]` `[ZFI_TAX_COMUM]` — Criar e implementar a Classe Wrapper (`Standard ABAP`) [[09 - ZCLFI_TAX_BAPI_WRAP|ZCLFI_TAX_BAPI_WRAP]] ✅ 2026-11-16
- [x] Passo 9B `[Manual]` `[ZFI_TAX_COMUM]` — Liberar contrato **API State `C1`** (*Use System-Internally*) em [[09 - ZCLFI_TAX_BAPI_WRAP|ZCLFI_TAX_BAPI_WRAP]] no Eclipse ADT ✅ 2026-11-16
- [x] Passo 10 `[MCP]` `[ZFI_TAX_COMUM]` — Criar a Classe de Leitura e Geração Excel (`XCO_CP_XLSX`) [[10 - ZCLFI_TAX_EXCEL|ZCLFI_TAX_EXCEL]] ✅ 2026-11-16

---

### Fase 3: Backend do Aplicativo de Tipos de Movimento (`ZFI_TAX_TPMOV`) (RAP + Draft)
> **Objetivo:** Construir e validar primeiro todo o backend do **Aplicativo de Tipos de Movimento (`ZFI_TAX_TPMOV`)** em **`ZFI_TAX_TPMOV`**, mantendo a CDS View básica `ZI_FI_TAX_TPMOV` em **`ZFI_TAX_COMUM`** e realizando no **Passo 12** a exposição de todos os objetos compartilhados na `ZPI_FI_TAX_COMUM` antes da criação das projeções e behaviors nos subpacotes dos aplicativos.

- [x] Passo 11 `[MCP]` `[ZFI_TAX_COMUM]` — Criar a CDS Interface Root [[11 - ZI_FI_TAX_TPMOV (CDS)|ZI_FI_TAX_TPMOV (CDS)]] ✅ 2026-11-16
- [x] Passo 12 `[Manual]` `[ZFI_TAX_COMUM]` — Incluir os 7 objetos compartilhados na *Package Interface* [[11B - ZPI_FI_TAX_COMUM (Inclusão de Elementos)|ZPI_FI_TAX_COMUM (Inclusão de Elementos)]] e ativar (`Ctrl + F3`) ✅ 2026-11-16
- [x] Passo 13 `[MCP]` `[ZFI_TAX_TPMOV]` — Criar a CDS Projection [[14 - ZC_FI_TAX_TPMOV (CDS)|ZC_FI_TAX_TPMOV (CDS)]] ✅ 2026-11-16
- [x] Passo 14 `[MCP]` `[ZFI_TAX_TPMOV]` — Criar a Metadata Extension (`MDE`) [[15 - ZC_FI_TAX_TPMOV (MDE)|ZC_FI_TAX_TPMOV (MDE)]] ✅ 2026-11-16
- [x] Passo 15 `[MCP]` `[ZFI_TAX_TPMOV]` — Criar o Behavior Definition Root (`BDEF` Managed com Draft) [[12 - ZI_FI_TAX_TPMOV (BDEF)|ZI_FI_TAX_TPMOV (BDEF)]] ✅ 2026-11-16
- [x] Passo 16 `[MCP]` `[ZFI_TAX_TPMOV]` — Criar e implementar a classe *Behavior Pool* [[13 - ZCLFI_BP_TAX_TPMOV|ZCLFI_BP_TAX_TPMOV]] *(Global Class + Local Types AFF)* ✅ 2026-11-16
- [x] Passo 17 `[MCP]` `[ZFI_TAX_TPMOV]` — Criar o Behavior Definition de Projeção [[16 - ZC_FI_TAX_TPMOV (BDEF)|ZC_FI_TAX_TPMOV (BDEF)]] ✅ 2026-11-16
- [x] Passo 18 `[MCP]` `[ZFI_TAX_TPMOV]` — Criar o Service Definition [[17 - ZUI_FI_TAX_TPMOV|ZUI_FI_TAX_TPMOV]] ✅ 2026-11-16
- [x] Passo 19 `[MCP]` `[ZFI_TAX_TPMOV]` — Criar, publicar (`abap_object_run_action` / validação empírica) e validar no *Fiori Preview* o Service Binding OData V4 [[18 - ZUI_O4_FI_TAX_TPMOV|ZUI_O4_FI_TAX_TPMOV]] ✅ 2026-11-16

---

### Fase 4: Backend do Aplicativo de Carga Massiva de Taxas (`ZFI_TAX_CARGA`) (RAP 3 Níveis)
> **Objetivo:** Construir no subpacote **`ZFI_TAX_CARGA`** a hierarquia composicional de 3 níveis (`Carga -> Documento -> Item`), o controle de acesso **DCL** (*Data Control Language*), o *Behavior Pool* com geração automática da contrapartida `DS-ATR` e a contabilização em commit único no método `save_modified`.

> [!WARNING] Ativação em Massa (`Ctrl + Shift + F3`) nas Hierarquias de 3 Níveis
> Como `ZI_FI_TAX_CARGA` compõe `ZI_FI_TAX_DOC` e `ZI_FI_TAX_DOC` compõe `ZI_FI_TAX_ITEM` (que apontam de volta para os pais via `association to parent`), há referência circular entre as três definições. Os **Passos 21, 22 e 23** formam um bloco circular (criação e edição conjuntas antes da ativação em lote) e os **Passos 25, 26 e 27** formam o segundo bloco circular (Camada de Projeção `ZC_`).

- [x] Passo 20 `[MCP]` `[ZFI_TAX_CARGA]` — Criar a CDS Entity Abstrata (payload Base64 de upload/download) [[23 - ZI_FI_TAX_ARQUIVO|ZI_FI_TAX_ARQUIVO]] ✅ 2026-11-16
- [x] Passo 21 `[MCP]` `[Ativação em Massa: Ctrl + Shift + F3]` `[ZFI_TAX_CARGA]` — Criar e editar a CDS Interface Nível 3 [[22 - ZI_FI_TAX_ITEM|ZI_FI_TAX_ITEM]] *(Bloco Circular 1: Passos 21, 22 e 23)* ✅ 2026-11-16
- [x] Passo 22 `[MCP]` `[Ativação em Massa: Ctrl + Shift + F3]` `[ZFI_TAX_CARGA]` — Criar e editar a CDS Interface Nível 2 [[21 - ZI_FI_TAX_DOC|ZI_FI_TAX_DOC]] *(Bloco Circular 1: Passos 21, 22 e 23)* ✅ 2026-11-16
- [x] Passo 23 `[MCP]` `[Ativação em Massa: Ctrl + Shift + F3]` `[ZFI_TAX_CARGA]` — Criar e editar a CDS Interface Root Nível 1 [[19 - ZI_FI_TAX_CARGA (CDS)|ZI_FI_TAX_CARGA (CDS)]] e ativar em lote os **Passos 21, 22 e 23** ✅ 2026-11-16
- [x] Passo 24 `[MCP]` `[ZFI_TAX_CARGA]` — Criar e ativar o Access Control (`DCL`) [[20 - ZI_FI_TAX_CARGA (DCL)|ZI_FI_TAX_CARGA (DCL)]] ✅ 2026-11-16
- [x] Passo 25 `[MCP]` `[Ativação em Massa: Ctrl + Shift + F3]` `[ZFI_TAX_CARGA]` — Criar e editar a CDS Projection Nível 3 [[28 - ZC_FI_TAX_ITEM (CDS)|ZC_FI_TAX_ITEM (CDS)]] *(Bloco Circular 2: Passos 25, 26 e 27)* ✅ 2026-11-16
- [x] Passo 26 `[MCP]` `[Ativação em Massa: Ctrl + Shift + F3]` `[ZFI_TAX_CARGA]` — Criar e editar a CDS Projection Nível 2 [[27 - ZC_FI_TAX_DOC (CDS)|ZC_FI_TAX_DOC (CDS)]] *(Bloco Circular 2: Passos 25, 26 e 27)* ✅ 2026-11-16
- [x] Passo 27 `[MCP]` `[Ativação em Massa: Ctrl + Shift + F3]` `[ZFI_TAX_CARGA]` — Criar e editar a CDS Projection Root Nível 1 [[26 - ZC_FI_TAX_CARGA (CDS)|ZC_FI_TAX_CARGA (CDS)]] e ativar em lote os **Passos 25, 26 e 27** ✅ 2026-11-16
- [x] Passo 28 `[MCP]` `[ZFI_TAX_CARGA]` — Criar a Metadata Extension (`MDE`) Nível 1 [[29 - ZC_FI_TAX_CARGA (MDE)|ZC_FI_TAX_CARGA (MDE)]] ✅ 2026-11-16
- [x] Passo 29 `[MCP]` `[ZFI_TAX_CARGA]` — Criar a Metadata Extension (`MDE`) Nível 2 [[30 - ZC_FI_TAX_DOC (MDE)|ZC_FI_TAX_DOC (MDE)]] ✅ 2026-11-16
- [x] Passo 30 `[MCP]` `[ZFI_TAX_CARGA]` — Criar a Metadata Extension (`MDE`) Nível 3 [[31 - ZC_FI_TAX_ITEM (MDE)|ZC_FI_TAX_ITEM (MDE)]] ✅ 2026-11-16
- [x] Passo 31 `[MCP]` `[ZFI_TAX_CARGA]` — Criar o Behavior Definition Root (`Managed with additional save`) [[24 - ZI_FI_TAX_CARGA (BDEF)|ZI_FI_TAX_CARGA (BDEF)]] ✅ 2026-11-16
- [x] Passo 32 `[MCP]` `[ZFI_TAX_CARGA]` — Criar e implementar a classe *Behavior Pool* [[25 - ZCLFI_BP_TAX_CARGA|ZCLFI_BP_TAX_CARGA]] *(Global Class + Local Types AFF)* ✅ 2026-11-16
- [x] Passo 33 `[MCP]` `[ZFI_TAX_CARGA]` — Criar o Behavior Definition de Projeção [[32 - ZC_FI_TAX_CARGA (BDEF)|ZC_FI_TAX_CARGA (BDEF)]] ✅ 2026-11-16
- [x] Passo 34 `[MCP]` `[ZFI_TAX_CARGA]` — Criar o Service Definition [[33 - ZUI_FI_TAX_CARGA|ZUI_FI_TAX_CARGA]] ✅ 2026-11-16
- [x] Passo 35 `[MCP]` `[ZFI_TAX_CARGA]` — Criar, publicar (`abap_object_run_action` / validação empírica) e validar abertura inicial no *Fiori Preview* o Service Binding OData V4 [[34 - ZUI_O4_FI_TAX_CARGA|ZUI_O4_FI_TAX_CARGA]] ✅ 2026-11-16

---

### Fase 5: Camada Frontend (SAP Fiori Elements & Deploy BSP)
> **Objetivo:** Gerar os dois projetos **SAP Fiori Elements** no **BAS** (*SAP Business Application Studio*) ou **VS Code**, adicionar a *Controller Extension* de manipulação Excel em Base64 no Aplicativo de Carga Massiva de Taxas (`ZFI_TAX_CARGA`) e realizar o deploy dos repositórios **BSP** (*Business Server Pages*) nos respectivos subpacotes no servidor ABAP respeitando o limite de 15 caracteres da Veiling Holambra.

- [x] Passo 36 `[Manual]` `[ZFI_TAX_TPMOV]` — Gerar, configurar e fazer deploy do Aplicativo de Tipos de Movimento (`ZFI_TAX_TPMOV`) [[36 - taxastipomov (App Fiori)|taxastipomov (App Fiori)]] *(BSP: `ZZ1_TAXTPMOV` sobre `ZUI_O4_FI_TAX_TPMOV`)* ✅ 2026-11-16
- [x] Passo 37 `[Manual]` `[ZFI_TAX_CARGA]` — Gerar, implementar `ListReportExt.controller.js` + `manifest.json` e fazer deploy do Aplicativo de Carga Massiva de Taxas (`ZFI_TAX_CARGA`) [[35 - taxascarga (App Fiori)|taxascarga (App Fiori)]] *(BSP: `ZZ1_TAXCARGA` sobre `ZUI_O4_FI_TAX_CARGA`)* ✅ 2026-11-16

---

### Fase 6: Publicação no SAP Fiori Launchpad e Carga Inicial de Parâmetros (Go-Live Técnico)
> **Objetivo:** Expor os dois aplicativos como tiles no **SAP Fiori Launchpad**, atribuir as permissões nas funções de usuário (**Roles PFCG**) e preencher os dados iniciais obrigatórios antes de iniciar a bateria de testes.

- [x] Passo 38 `[Manual]` — **Launchpad (`FLPM` / `/UI2/FLPD_CONF`):** Criar o Catálogo Técnico `ZTC_FI_TAXAS` com os dois Mapeamentos de Alvo (*Target Mappings*): ✅ 2026-11-16
  - Aplicativo de Carga Massiva de Taxas (`ZFI_TAX_CARGA`): Objeto Semântico `ZFI_TAXAS_CARGA` | Ação `manage` | ID UI5 `br.com.veiling.fi.taxascarga` | BSP `ZZ1_TAXCARGA`
  - Aplicativo de Tipos de Movimento (`ZFI_TAX_TPMOV`): Objeto Semântico `ZFI_TAXAS_TPMOV` | Ação `manage` | ID UI5 `br.com.veiling.fi.taxastipomov` | BSP `ZZ1_TAXTPMOV`
- [x] Passo 39 `[Manual]` — **Catálogos de Negócio e Grupo (`FLPM`):** ✅ 2026-11-16
  - `ZBC_FI_TAXAS` (Operadores Financeiros / Auditoria — exibe apenas o Aplicativo de Carga Massiva de Taxas (`ZFI_TAX_CARGA`) `taxascarga`)
  - `ZBC_FI_TAXAS_CFG` (Key Users de Contabilidade — exibe o Aplicativo de Tipos de Movimento (`ZFI_TAX_TPMOV`) `taxastipomov`)
  - Grupo `ZGP_FI_TAXAS` reunindo os tiles de acesso conforme o perfil do usuário
- [x] Passo 40 `[Manual]` — **Segurança (`PFCG`):** Criar/atualizar as Roles atribuindo os serviços OData V4 (`ZUI_O4_FI_TAX_CARGA` e `ZUI_O4_FI_TAX_TPMOV`), os catálogos de negócio e o objeto de autorização `ZTAXCARGA`: ✅ 2026-11-16
  - **Perfil Operador Financeiro (Carga + Lançamento):** `ACTVT` = `01` (Upload), `03` (Exibir/Modelo), `16` (Contabilizar)
  - **Perfil Consulta / Auditoria:** `ACTVT` = `03` (Exibir apenas)
  - **Perfil Key User Contabilidade (Parâmetros):** `ACTVT` = `02` (Manter `ZTFI_TAX_TPMOV`)
- [ ] Passo 41 `[Manual]` — **Intervalo `SNRO` (`ZTAXCARNR`):** Cadastrar o intervalo **`01`** de `0000000001` até `9999999999` (numeração interna) no ambiente de Desenvolvimento (`DEV`) e replicar manualmente em Qualidade (`QAS`) / Produção (`PRD`) [[08 - ZTAXCARNR|Ver tutorial completo em ZTAXCARNR]]:
  1. No **SAP GUI**, acesse a transação **`SNRO`**, informe **`ZTAXCARNR`** e clique em **Intervalos** (*Ranges*) -> **Modificar intervalos** (ícone de lápis).
  2. Clique em **Inserir linha** (`+` / `F6`), preencha **`Nº` = `01`**, **`De número` = `0000000001`**, **`Até número` = `9999999999`**, **`Status NR` = `0`** e deixe **`Ext.` desmarcado**.
  3. Pressione **`Enter`**, salve (**`Ctrl + S`**) e confirme o aviso padrão de transporte de intervalos.
- [x] Passo 42 `[Manual]` — **Carga Inicial de Parâmetros no Aplicativo de Tipos de Movimento (`ZFI_TAX_TPMOV` / `taxastipomov`):** Abrir o Aplicativo de Tipos de Movimento (`ZFI_TAX_TPMOV`) recém-publicado e cadastrar os Tipos de Movimento oficiais da [[01 - Especificação Funcional (Visão da Solução)|Especificação Funcional]] (ex.: `CS-ADM`, `CS-INT`, `CS-DES`, `CS-LCP`, `DS-ATR` com contrapartida `2205010002`, `DS-LCP`, `CM-AQU` e `CM-DEV` com `zuonr_obrig = 'X'`, `FP-AJU` e `FR-AJU`). ✅ 2026-11-16

---

## 📝 Ajustes Técnicos para Alinhar com o Consultor

### Classe de Mensagens `ZFI_TAXAS` (Passo 1)
- **Motivo da alteração:** O SAP limita cada texto da classe de mensagens (`SE91` / tabela `T100`) ao máximo de **73 caracteres**. Como 8 mensagens definidas na especificação ultrapassavam esse limite (`76` a `85` caracteres), elas foram encurtadas para caber no padrão do sistema, mantendo o mesmo sentido e todas as variáveis (`&1`–`&4`).

| Nº | Original (Consultor) | Gravado no SAP (`<= 73` chars) |
| :--- | :--- | :--- |
| `009` | `Doc &1: Movimento &2 exige apenas linhas de crédito (contrapartida &3 é automática).` *(84)* | `Doc &1: Movimento &2 exige só crédito (contrapartida &3 automática).` *(68)* |
| `011` | `Doc &1: Documento verificado com sucesso na simulação BAPI (Apto para lançamento).` *(82)* | `Doc &1: Verificado com sucesso na simulação BAPI (apto p/ lançamento).` *(70)* |
| `013` | `Doc &1 Item &2: Não preencha Débito (WRSOL) e Crédito (WRHAB) na mesma linha.` *(77)* | `Doc &1 Item &2: Não informe Débito (WRSOL) e Crédito (WRHAB) juntos.` *(68)* |
| `015` | `Doc &1 Item &2: Atribuição/Contrato (ZUONR) é obrigatória para o movimento &3.` *(78)* | `Doc &1 Item &2: Atribuição/Contrato (ZUONR) obrigatória p/ mov. &3.` *(67)* |
| `016` | `Doc &1 Item &2: Duplicidade detectada (XBLNR &3, Forn. &4 já lançado no Doc &2).` *(80)* | `Doc &1 Item &2: Duplicidade (XBLNR &3, Forn. &4 já lançado no Doc &2).` *(70)* |
| `019` | `Lote &1 já está totalmente contabilizado ou não possui documentos válidos (Status V).` *(85)* | `Lote &1 já contabilizado ou sem documentos válidos (Status V).` *(62)* |
| `020` | `Contabilização concluída no lote &1: &2 documento(s) lançado(s), &3 erro(s).` *(76)* | `Contabilização do lote &1 concluída: &2 doc(s) lançado(s), &3 erro(s).` *(70)* |
| `024` | `Informe ao menos um Razão Especial (Débito/Crédito) ou Conta de Contrapartida.` *(78)* | `Informe ao menos 1 Razão Especial (Déb./Créd.) ou Conta Contrapartida.` *(70)* |
