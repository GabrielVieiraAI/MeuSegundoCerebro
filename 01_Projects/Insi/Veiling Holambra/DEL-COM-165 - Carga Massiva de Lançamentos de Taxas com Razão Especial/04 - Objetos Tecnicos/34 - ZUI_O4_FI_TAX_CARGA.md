---
tipo: objeto-tecnico
tags:
  - projeto
  - veiling-holambra
  - sap
  - fi
  - rap
  - odata-v4
  - abap-cloud
  - del-com-165
  - objeto-tecnico
id_demanda: DEL-COM-165
objeto: "ZUI_O4_FI_TAX_CARGA"
camada: "5 - Serviço e Exposição"
data: 2026-11-11
aliases:
  - "ZUI_O4_FI_TAX_CARGA"
---

# 📦 `ZUI_O4_FI_TAX_CARGA` (Service Binding OData V4 — Carga Massiva de Taxas)

⬅️ [[01 - DEL-COM-165 - Arquitetura App 1 (Carga Massiva de Taxas)|Voltar para Arquitetura App 1]] | 🎨 [[01 - DEL-COM-165 - Arquitetura Técnica App 1 (Carga Massiva).excalidraw|Ver no Diagrama Excalidraw App 1]]

---

## 📌 Visão Geral do Objeto

O Service Binding `ZUI_O4_FI_TAX_CARGA` publica a Service Definition [[33 - ZUI_FI_TAX_CARGA|ZUI_FI_TAX_CARGA]] no protocolo **OData V4 - UI**, servindo como fonte de dados para o aplicativo SAP Fiori Elements [[35 - taxascarga (App Fiori)|taxascarga]].

---

## ⚖️ Regras de Negócio Aplicadas

1. **Exposição de Static Actions e Instance Actions via OData V4:** Publica as actions `carregarArquivo`, `baixarModelo` e `lancar` diretamente no metadado OData V4, permitindo invocação via `extensionAPI.getEditFlow().invokeAction(...)` no Fiori Elements.

---

## 🛠️ Passo a Passo da Criação do Objeto

1. **No Eclipse ADT:** Clique com o botão direito sobre a Service Definition [[33 - ZUI_FI_TAX_CARGA|ZUI_FI_TAX_CARGA]] -> **`New Service Binding`**.
2. Preencha as propriedades:
   - **Name:** `ZUI_O4_FI_TAX_CARGA`
   - **Description:** `DEL-COM-165: Service Binding OData V4 Carga Massiva de Taxas`
   - **Binding Type:** `OData V4 - UI`
3. Selecione a Request (TR) de desenvolvimento, conclua o assistente e ative com **`Ctrl + F3`**.
4. Clique em **`Publish`** para publicar o grupo de serviços OData V4 no SAP Gateway.

---

## 💻 Snippet de Código

### 📝 Código Comentado (Para Estudo e Referência)

```text
// =========================================================================
// CONFIGURAÇÃO DO SERVICE BINDING NO ECLIPSE ADT
// =========================================================================
Name               : ZUI_O4_FI_TAX_CARGA
Description        : DEL-COM-165: Service Binding OData V4 Carga Massiva de Taxas
Binding Type       : OData V4 - UI
Service Definition : ZUI_FI_TAX_CARGA
Entity Sets        : Carga (Root), Documento (Child), Item (Grandchild), TipoMovimento (ValueHelp)
```

---

### 🚀 Código Limpo (Sem Comentários - Para Copiar e Colar)

```text
Name               : ZUI_O4_FI_TAX_CARGA
Binding Type       : OData V4 - UI
Service Definition : ZUI_FI_TAX_CARGA
```
