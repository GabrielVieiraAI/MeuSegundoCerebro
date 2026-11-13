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
objeto: "ZUI_O4_FI_TAX_TPMOV"
camada: "5 - Serviço e Exposição"
data: 2026-11-11
aliases:
  - "ZUI_O4_FI_TAX_TPMOV"
---

# 📦 `ZUI_O4_FI_TAX_TPMOV` (Service Binding OData V4 — Tipos de Movimento)

⬅️ [[02 - DEL-COM-165 - Arquitetura App 2 (Tipos de Movimento)|Voltar para Arquitetura App 2]] | 🎨 [[02 - DEL-COM-165 - Arquitetura Técnica App 2 (Tipos de Movimento).excalidraw|Ver no Diagrama Excalidraw App 2]]

---

## 📌 Visão Geral do Objeto

O Service Binding `ZUI_O4_FI_TAX_TPMOV` vincula a Service Definition [[17 - ZUI_FI_TAX_TPMOV|ZUI_FI_TAX_TPMOV]] ao protocolo **OData V4 - UI**, gerando o endpoint consumido pelo aplicativo SAP Fiori Elements [[36 - taxastipomov (App Fiori)|taxastipomov]].

---

## ⚖️ Regras de Negócio Aplicadas

1. **Protocolo OData V4 - UI (`ZUI_O4_FI_*`):** Habilita suporte nativo a *Draft* otimizado e testes imediatos via botão **Preview** no Eclipse ADT.

---

## 🛠️ Passo a Passo da Criação do Objeto

1. **No Eclipse ADT:** Clique com o botão direito sobre a Service Definition [[17 - ZUI_FI_TAX_TPMOV|ZUI_FI_TAX_TPMOV]] -> **`New Service Binding`**.
2. Preencha as propriedades:
   - **Name:** `ZUI_O4_FI_TAX_TPMOV`
   - **Description:** `DEL-COM-165: Service Binding OData V4 Tipos de Movimento`
   - **Binding Type:** `OData V4 - UI`
3. Selecione a Request (TR) de desenvolvimento, conclua o assistente e ative com **`Ctrl + F3`**.
4. Na tela do Service Binding, clique no botão **`Publish`** para publicar o grupo de serviços localmente (ou via transação `/IWFND/V4_ADMIN`).

---

## 💻 Snippet de Código

### 📝 Código Comentado (Para Estudo e Referência)

```text
// =========================================================================
// CONFIGURAÇÃO DO SERVICE BINDING NO ECLIPSE ADT
// =========================================================================
Name               : ZUI_O4_FI_TAX_TPMOV
Description        : DEL-COM-165: Service Binding OData V4 Tipos de Movimento
Binding Type       : OData V4 - UI
Service Definition : ZUI_FI_TAX_TPMOV
Entity Set Exposto : TipoMovimento (ZC_FI_TAX_TPMOV)
```

---

### 🚀 Código Limpo (Sem Comentários - Para Copiar e Colar)

```text
Name               : ZUI_O4_FI_TAX_TPMOV
Binding Type       : OData V4 - UI
Service Definition : ZUI_FI_TAX_TPMOV
```
