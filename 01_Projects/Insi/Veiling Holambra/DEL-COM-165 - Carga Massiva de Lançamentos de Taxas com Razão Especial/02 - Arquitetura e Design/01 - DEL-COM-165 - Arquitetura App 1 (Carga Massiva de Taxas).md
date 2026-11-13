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
  - app1
id_demanda: DEL-COM-165
tipo: arquitetura-tecnica
data: 2026-11-11
aliases:
  - "01 - DEL-COM-165 - Arquitetura App 1 (Carga Massiva de Taxas)"
---

# DEL-COM-165 · Arquitetura Técnica — Aplicativo 1 (Carga Massiva e Monitor de Taxas)

⬅️ [[00 - DEL-COM-165 - Visão Integrada e Infraestrutura|Visão Integrada]] | ⚙️ [[02 - DEL-COM-165 - Arquitetura App 2 (Tipos de Movimento)|Ir para Arquitetura App 2]] | 🗺️ [[03 - DEL-COM-165 - Jornada do Dado dos Apps (Fluxo End-to-End).excalidraw|Jornada do Dado (End-to-End)]] | 📄 [[01 - Especificação Funcional (Visão da Solução)|Especificação Funcional]] | 📋 [[Consolidado de decisões tomadas em todas as reuniões|Decisões das Reuniões]]

---

## 📌 Visão Geral da Arquitetura do Aplicativo 1

🎨 **Diagrama Visual Exclusivo do App 1:** [[01 - DEL-COM-165 - Arquitetura Técnica App 1 (Carga Massiva).excalidraw|Visualizar no Excalidraw]]
![[01 - DEL-COM-165 - Arquitetura Técnica App 1 (Carga Massiva).excalidraw]]

O **Aplicativo 1 (`taxascarga` / BSP `ZZ1_TAXCARGA`)** é um monitor transacional e motor de carga massiva em lote via planilha Excel (`.xlsx`), construído em **RAP (*Managed with Additional Save*)** e exposto via **OData V4**. Diferente de um cadastro simples, ele modela uma **hierarquia composicional de 3 níveis** (`Carga -> Documento -> Item`) e integra leitura nativa de Excel (`XCO_CP_XLSX`) com simulação e lançamento contábil via BAPI (`BAPI_ACC_DOCUMENT_CHECK` / `BAPI_ACC_DOCUMENT_POST`).

### Decisões Fundamentais de Arquitetura do App 1:

1. **Hierarquia Transacional de 3 Níveis (Sem Draft):**
   - **Nível 1 — Cabeçalho do Lote ([[03 - ZTFI_TAX_CARGA|ZTFI_TAX_CARGA]] / [[19 - ZI_FI_TAX_CARGA (CDS)|ZI_FI_TAX_CARGA]]):** Representa o arquivo carregado (`carga_id` gerado pelo objeto [[08 - ZTAXCARNR|ZTAXCARNR]]), consolidando total de documentos, válidos, com erro, lançados e somatórios de débito e crédito.
   - **Nível 2 — Documento Contábil ([[04 - ZTFI_TAX_DOC|ZTFI_TAX_DOC]] / [[21 - ZI_FI_TAX_DOC|ZI_FI_TAX_DOC]]):** Agrupado pelo sequencial `DOCSEQ` da planilha. Armazena os dados de cabeçalho (`BKPF`), o status individual (`V` = Verificado OK, `E` = Erro, `L` = Lançado), o documento gerado (`belnr` / `gjahr`) e a mensagem principal retornada pela BAPI (`mensagem`).
   - **Nível 3 — Partida Individual ([[05 - ZTFI_TAX_ITEM|ZTFI_TAX_ITEM]] / [[22 - ZI_FI_TAX_ITEM|ZI_FI_TAX_ITEM]]):** Armazena cada linha de fornecedor/cooperado (`lifnr`) com o código de Razão Especial derivado (`umskz`) e bloqueio de pagamento (`zlspr`), além da linha de contrapartida contábil (`hkont = '2205010002'`) gerada automaticamente para o movimento `DS-ATR`.
   - Não há uso de *Draft* porque os registros nascem prontos a partir do upload do Excel e precisam ser persistidos imediatamente — inclusive quando apresentam erros — para auditoria e conferência no monitor.

2. **Upload com Simulação Automática (`BAPI_ACC_DOCUMENT_CHECK`) e Sem Botão "Reprocessar":**
   - Ao acionar `carregarArquivo`, o Behavior Pool [[25 - ZCLFI_BP_TAX_CARGA|ZCLFI_BP_TAX_CARGA]] lê as **15 colunas** da aba `Carga` (a partir da linha 6) via [[10 - ZCLFI_TAX_EXCEL|ZCLFI_TAX_EXCEL]], aplica as regras da tabela [[01 - ZTFI_TAX_TPMOV|ZTFI_TAX_TPMOV]], gera a contrapartida automática do `DS-ATR`, valida duplicidade (`XBLNR + LIFNR + ZTPMOV + Valor`) e já executa `BAPI_ACC_DOCUMENT_CHECK` para cada documento.
   - Conforme decisão consolidada, **não existem botões "Verificar" nem "Reprocessar"**. Documentos com erro permanecem com `status = 'E'` no histórico do lote, e o usuário envia uma nova planilha contendo os documentos corrigidos.

3. **Contabilização Efetiva na Fase `save_modified` (Commit Único) via Wrapper C1:**
   - A ação `lancar` habilita a contabilização apenas para os documentos com `status = 'V'`.
   - A chamada à `BAPI_ACC_DOCUMENT_POST` ocorre dentro do método `save_modified` de [[25 - ZCLFI_BP_TAX_CARGA|ZCLFI_BP_TAX_CARGA]] através da classe Wrapper C1 [[09 - ZCLFI_TAX_BAPI_WRAP|ZCLFI_TAX_BAPI_WRAP]], sem `COMMIT WORK` intermediário, aproveitando o commit único do framework RAP e gravando `carga_id` em `BSEG-XREF1` (`REF_KEY_1`) e `ztpmov` em `BSEG-XREF3` (`REF_KEY_3`).

4. **Controller Extension SAPUI5 para Upload e Download em Base64:**
   - A entidade abstrata [[23 - ZI_FI_TAX_ARQUIVO|ZI_FI_TAX_ARQUIVO]] transporta `nome_arquivo`, `mime_type` e `conteudo_base64` entre a *Controller Extension* do app Fiori [[35 - taxascarga (App Fiori)|taxascarga]] e as *static actions* `carregarArquivo` e `baixarModelo`.

---

## 🧱 Lista Consolidada de Objetos Técnicos — Aplicativo 1

### 1. Camada de Dicionário de Dados (ABAP Dictionary)

| Tipo de Objeto | Padrão | Nome do Objeto | Responsabilidade Técnica no App 1 |
| :--- | :--- | :--- | :--- |
| **Tabela Transparente (Nível 1)** | `ZTFI_<desc>` | [[03 - ZTFI_TAX_CARGA\|ZTFI_TAX_CARGA]] | Cabeçalho do lote de carga (`carga_id`, `nome_arquivo`, `status_geral`, contadores `qtd_docs`/`qtd_validos`/`qtd_erros`/`qtd_lancados`, somatórios e auditoria). |
| **Tabela Transparente (Nível 2)** | `ZTFI_<desc>` | [[04 - ZTFI_TAX_DOC\|ZTFI_TAX_DOC]] | Documentos contábeis agrupados por `DOCSEQ` (`ztpmov`, `bukrs`, `bldat`, `budat`, `xblnr`, `bktxt`, `waers`, `status`, `belnr`, `gjahr`, `mensagem`). |
| **Tabela Transparente (Nível 3)** | `ZTFI_<desc>` | [[05 - ZTFI_TAX_ITEM\|ZTFI_TAX_ITEM]] | Partidas individuais do documento (`lifnr`, `hkont`, `shkzg`, `umskz`, `wrsol`, `wrhab`, `zfbdt`, `zterm`, `zlspr`, `sgtxt`, `zuonr`, `gerado_auto`). |

---

### 2. Camada de Modelagem de Dados (CDS Views — Hierarquia de 3 Níveis + DCL + Abstract)

| Tipo de Objeto | Padrão | Nome do Objeto | Responsabilidade Técnica no App 1 |
| :--- | :--- | :--- | :--- |
| **CDS Interface (Root - Nível 1)** | `ZI_FI_<desc>` | [[19 - ZI_FI_TAX_CARGA (CDS)\|ZI_FI_TAX_CARGA]] | Entidade raiz do lote de carga sobre `ZTFI_TAX_CARGA`, com `composition [0..*] of ZI_FI_TAX_DOC as _Documentos` e cálculo de criticidade semântica. |
| **Access Control (DCL)** | Mesmo nome da CDS | [[20 - ZI_FI_TAX_CARGA (DCL)\|ZI_FI_TAX_CARGA]] | Restringe a leitura dos lotes ao objeto de autorização [[07 - ZTAXCARGA\|ZTAXCARGA]] com `ACTVT = '03'`. |
| **CDS Interface (Child - Nível 2)** | `ZI_FI_<desc>` | [[21 - ZI_FI_TAX_DOC\|ZI_FI_TAX_DOC]] | Entidade filha de documentos sobre `ZTFI_TAX_DOC`, com `association to parent ZI_FI_TAX_CARGA` e `composition [0..*] of ZI_FI_TAX_ITEM as _Itens`. |
| **CDS Interface (Grandchild - Nível 3)** | `ZI_FI_<desc>` | [[22 - ZI_FI_TAX_ITEM\|ZI_FI_TAX_ITEM]] | Entidade neta de partidas sobre `ZTFI_TAX_ITEM`, associada ao documento pai `_Documento` e à carga raiz `_Carga`. |
| **CDS Abstract Entity** | `ZI_FI_<desc>` | [[23 - ZI_FI_TAX_ARQUIVO\|ZI_FI_TAX_ARQUIVO]] | Estrutura de parâmetros/retorno (`nome_arquivo`, `mime_type`, `conteudo_base64`) para as actions `carregarArquivo` e `baixarModelo`. |
| **CDS Projection (Root - Nível 1)** | `ZC_FI_<desc>` | [[26 - ZC_FI_TAX_CARGA (CDS)\|ZC_FI_TAX_CARGA]] | Projeção raiz do monitor de lotes, redirecionando `_Documentos` para `ZC_FI_TAX_DOC`. |
| **CDS Projection (Child - Nível 2)** | `ZC_FI_<desc>` | [[27 - ZC_FI_TAX_DOC (CDS)\|ZC_FI_TAX_DOC]] | Projeção dos documentos do lote com Value Help de Tipo de Movimento e redirecionamento para `ZC_FI_TAX_ITEM`. |
| **CDS Projection (Grandchild - Nível 3)** | `ZC_FI_<desc>` | [[28 - ZC_FI_TAX_ITEM (CDS)\|ZC_FI_TAX_ITEM]] | Projeção das partidas individuais para conferência de Razão Especial, bloqueio e contrapartida. |
| **Metadata Extension (Root MDE)** | Mesmo nome da CDS | [[29 - ZC_FI_TAX_CARGA (MDE)\|ZC_FI_TAX_CARGA]] | Anotações `@UI` do List Report de Lotes, cabeçalho com *DataPoints* e botão `Contabilizar Lote`. |
| **Metadata Extension (Child MDE)** | Mesmo nome da CDS | [[30 - ZC_FI_TAX_DOC (MDE)\|ZC_FI_TAX_DOC]] | Anotações `@UI` da tabela de Documentos (por `DOCSEQ`) e Object Page de 2º nível. |
| **Metadata Extension (Grandchild MDE)** | Mesmo nome da CDS | [[31 - ZC_FI_TAX_ITEM (MDE)\|ZC_FI_TAX_ITEM]] | Anotações `@UI` da tabela de Partidas Contábeis na Object Page do Documento. |

---

### 3. Camada de Comportamento de Negócio e Motores (RAP / Classes ABAP)

| Tipo de Objeto | Padrão | Nome do Objeto | Responsabilidade Técnica no App 1 |
| :--- | :--- | :--- | :--- |
| **Behavior Definition (Root)** | Mesmo nome da CDS | [[24 - ZI_FI_TAX_CARGA (BDEF)\|ZI_FI_TAX_CARGA]] | BDEF *Managed with additional save* para os 3 níveis (`Carga`, `Documento`, `Item`) e declaração das actions `carregarArquivo`, `baixarModelo` e `lancar`. |
| **Behavior Definition (Projection)** | Mesmo nome da CDS | [[32 - ZC_FI_TAX_CARGA (BDEF)\|ZC_FI_TAX_CARGA]] | Projeta as actions `carregarArquivo`, `baixarModelo` e `lancar` e as associações para o OData V4. |
| **Classe ABAP (Behavior Pool)** | `ZCLFI_BP_<desc>` | [[25 - ZCLFI_BP_TAX_CARGA\|ZCLFI_BP_TAX_CARGA]] | Implementa o upload com agrupamento por `DOCSEQ`, derivação de `UMSKZ`/`ZLSPR`, geração automática da conta `2205010002` no `DS-ATR`, checagem de duplicidade, simulação imediata (`CHECK`) e contabilização no `save_modified` (`POST`). |
| **Classe ABAP (Motor Excel XCO)** | `ZCLFI_<desc>` | [[10 - ZCLFI_TAX_EXCEL\|ZCLFI_TAX_EXCEL]] | Lê as 15 colunas da aba `Carga` (a partir da linha 6) e gera dinamicamente o template `.xlsx` via `XCO_CP_XLSX`. |
| **Classe ABAP (Wrapper C1 BAPI)** | `ZCLFI_<desc>` | [[09 - ZCLFI_TAX_BAPI_WRAP\|ZCLFI_TAX_BAPI_WRAP]] | Classe *Standard ABAP* com contrato C1 que encapsula `BAPI_ACC_DOCUMENT_CHECK`, `BAPI_ACC_DOCUMENT_POST` (`XREF1`/`XREF3`), `NUMBER_GET_NEXT` (`ZTAXCARNR`) e validações `LFB1`/`SKB1`. |

---

### 4. Camada de Segurança, Mensagens e Numeração (Compartilhada)

| Tipo de Objeto | Padrão | Nome do Objeto | Responsabilidade Técnica no App 1 |
| :--- | :--- | :--- | :--- |
| **Classe de Mensagens (SE91)** | `ZFI_<desc>` | [[06 - ZFI_TAXAS\|ZFI_TAXAS]] | Mensagens `001` a `021` e `025` (erros de planilha, saldo, duplicidade, fornecedor e retorno de contabilização). |
| **Objeto de Autorização (SU21)** | `Z<desc>` | [[07 - ZTAXCARGA\|ZTAXCARGA]] | Controle por `BUKRS` e `ACTVT` (`01` Upload, `03` Exibir, `16` Contabilizar). |
| **Intervalo de Numeração (SNRO)** | `Z<desc>` | [[08 - ZTAXCARNR\|ZTAXCARNR]] | Numeração sequencial de 10 dígitos para `carga_id`. |

---

### 5. Camada de Serviço e Exposição (OData V4)

| Tipo de Objeto | Padrão | Nome do Objeto | Responsabilidade Técnica no App 1 |
| :--- | :--- | :--- | :--- |
| **Service Definition** | `ZUI_FI_<desc>` | [[33 - ZUI_FI_TAX_CARGA\|ZUI_FI_TAX_CARGA]] | Expõe `ZC_FI_TAX_CARGA as Carga`, `ZC_FI_TAX_DOC as Documento`, `ZC_FI_TAX_ITEM as Item` e `ZI_FI_TAX_TPMOV as TipoMovimento`. |
| **Service Binding** | `ZUI_O4_FI_<desc>` | [[34 - ZUI_O4_FI_TAX_CARGA\|ZUI_O4_FI_TAX_CARGA]] | Publica o serviço **OData V4 - UI** para o aplicativo de Carga Massiva. |

---

### 6. Camada Frontend (SAP Fiori & Launchpad)

| Tipo de Objeto | Padrão | Nome do Objeto | Responsabilidade Técnica no App 1 |
| :--- | :--- | :--- | :--- |
| **Aplicativo SAP Fiori** | `<desc>` | [[35 - taxascarga (App Fiori)\|taxascarga]] | App Fiori Elements OData V4 em 3 níveis + *Controller Extension* (`ListReportExt.controller.js`) para upload/download de `.xlsx` em Base64. BSP: `ZZ1_TAXCARGA`. |
