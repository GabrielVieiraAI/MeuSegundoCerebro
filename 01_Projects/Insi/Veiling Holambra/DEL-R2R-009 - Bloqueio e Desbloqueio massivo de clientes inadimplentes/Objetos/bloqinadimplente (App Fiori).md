---
tags:
  - projeto
  - insi
  - veiling-holambra
  - sap
  - fiori
  - ui5
  - del-r2r-009
  - objeto-tecnico
id_demanda: DEL-R2R-009
objeto: bloqinadimplente
camada: 6 - Camada Frontend (SAP Fiori Elements & Launchpad)
data: 2026-10-23
---

# 📱 `bloqinadimplente` (App SAP Fiori Elements & Launchpad)

⬅️ [[DEL-R2R-009 - Arquitetura e Objetos|Voltar para Arquitetura e Objetos]] | 🎨 [[DEL-R2R-009 - Arquitetura da Camada CDS.excalidraw|Ver no Diagrama Excalidraw]]

---

## 📌 Visão Geral do Objeto

O **`bloqinadimplente`** é a aplicação frontend gerada no template **SAP Fiori Elements (List Report)** a partir do serviço OData V2 `[[ZUI_O2_FI_CLIENTE_INAD]]` e publicada no repositório ABAP sob o contêiner BSP **`ZZ1_BLOQ_INAD`**.

Esta nota também documenta os objetos de configuração do **SAP Fiori Launchpad** que disponibilizam o bloco (Tile) do aplicativo para os usuários finais:
- **Catálogo Técnico:** `ZTC_FI_INADIMPLENCIA`
- **Catálogo de Negócio:** `ZBC_FI_INADIMPLENCIA`
- **Grupo / Espaço e Página:** `ZGP_FI_INADIMPLENCIA`

---

## ⚖️ Regras de Negócio Aplicadas

1. **List Report com Seleção Múltipla em Massa:** Habilita caixas de seleção (*checkboxes*) em todas as linhas da tabela (`multiSelect: true`), permitindo ao operador selecionar dezenas de clientes de uma só vez e acionar **Bloquear** ou **Desbloquear**.
2. **Ordenação Inicial por Ação Proposta (`Bloquear`):** Segue a anotação `@UI.presentationVariant` da Metadata Extension (`[[ZC_FI_CLIENTE_INADIMPLENTE (MDE)]]`), exibindo no topo os clientes com ação proposta **Bloquear**.
3. **Resumo Único em Lote (Message View):** Quando múltiplos clientes são processados em lote (`$batch`), o Fiori Elements OData V2 agrupa automaticamente as mensagens retornadas pela classe `[[ZCLFI_BP_CLIENTE_INAD]]` em um único componente **Message View** (evitando múltiplos pop-ups).

---

## 💻 Snippet de Código

Trecho principal de configuração do `manifest.json` da aplicação Fiori Elements (OData V2 List Report com seleção múltipla habilitada):

```json
{
  "_version": "1.59.0",
  "sap.app": {
    "id": "br.com.veiling.bloqinadimplente",
    "type": "application",
    "title": "Bloquear/Desbloquear Clientes Inadimplentes",
    "dataSources": {
      "mainService": {
        "uri": "/sap/opu/odata/sap/ZUI_O2_FI_CLIENTE_INAD/",
        "type": "OData",
        "settings": {
          "odataVersion": "2.0"
        }
      }
    }
  },
  "sap.ui.generic.app": {
    "_version": "1.3.0",
    "settings": {
      "forceGlobalRefresh": true
    },
    "pages": {
      "ListReport|ClienteInadimplente": {
        "entitySet": "ClienteInadimplente",
        "component": {
          "name": "sap.suite.ui.generic.template.ListReport",
          "list": true,
          "settings": {
            "condensedTableLayout": true,
            "smartVariantManagement": true,
            "enableTableFilterInPageVariant": true,
            "tableSettings": {
              "type": "ResponsiveTable",
              "multiSelect": true
            }
          }
        }
      }
    }
  }
}
```
