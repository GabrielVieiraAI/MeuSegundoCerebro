---
tipo: objeto-tecnico
tags:
  - projeto
  - veiling-holambra
  - sap
  - abap
  - package-interface
  - eclipse-adt
  - del-com-165
  - objeto-tecnico
id_demanda: DEL-COM-165
objeto: "ZPI_FI_TAX_COMUM"
camada: "0 - Estrutura de Pacotes e Encapsulamento"
data: 2026-11-13
aliases:
  - "ZPI_FI_TAX_COMUM"
  - "00B - ZPI_FI_TAX_COMUM (Package Interface)"
---

# 🔌 `ZPI_FI_TAX_COMUM` (Criação da Package Interface)

⬅️ [[00A - ZFI_CARGA_TAXAS e Subpacotes (Estrutura de Pacotes)|Passo 0.1: Estrutura de Pacotes]] | ➡️ [[00C - Use Accesses (Liberação entre Subpacotes)|Passo 0.3: Use Accesses]] | 🚀 [[01 - DEL-COM-165 - Guia de Implementação|Guia de Implementação]]

---

## 📌 Visão Geral

Criação da Package Interface **`ZPI_FI_TAX_COMUM`** dentro de **`ZFI_TAX_COMUM`**. Neste passo ela é criada e ativada **vazia**; a inclusão dos objetos compartilhados será executada no **[[11B - ZPI_FI_TAX_COMUM (Inclusão de Elementos)|Passo 12]]**, após todos eles existirem no sistema.

---

## 📋 Propriedades do Objeto

| Propriedade | Valor |
| :--- | :--- |
| **Tipo de Objeto** | `Package Interface` |
| **Package** | `ZFI_TAX_COMUM` |
| **Name** | `ZPI_FI_TAX_COMUM` |
| **Description** | `DEL-COM-165: Interface pública do pacote ZFI_TAX_COMUM` |

---

## 🛠️ Passo a Passo no Eclipse ADT

### 🔖 Metadados ADT

```yaml
objectType: "Package Interface (Manual)"
packageName: "ZFI_TAX_COMUM"
name: "ZPI_FI_TAX_COMUM"
description: "DEL-COM-165: Interface pública do pacote ZFI_TAX_COMUM"
extraParams:
  manualTransaction: "ADT / SE21"
  emptyOnCreation: true
```

1. *(Se houver uma `ZPI_FI_CARGA_TAXAS` de teste dentro de `ZFI_CARGA_TAXAS`, exclua antes de prosseguir).*
2. No **Project Explorer**, clique com o botão direito em **`ZFI_TAX_COMUM`** -> **`New`** -> **`Other ABAP Repository Object`**.
3. Pesquise **`Package Interface`**, selecione e clique em **`Next >`**.
4. Preencha:
   - **Package:** `ZFI_TAX_COMUM`
   - **Name:** `ZPI_FI_TAX_COMUM`
   - **Description:** `DEL-COM-165: Interface pública do pacote ZFI_TAX_COMUM`
5. Clique em **`Next >`**, selecione a **TR** (*Transport Request*) da demanda e clique em **`Finish`**.
6. Com a interface aberta, ative pressionando **`Ctrl + F3`**.

*(Caso o ADT abra a tela clássica da `SE21`, preencha os mesmos campos, grave na TR e ative com `Ctrl + F3`.)*

---

## ✅ Validação
Confirme que **`ZPI_FI_TAX_COMUM`** aparece ativa dentro de `ZFI_TAX_COMUM` -> **`Package Interfaces`**.

Avance para o **[[00C - Use Accesses (Liberação entre Subpacotes)|Passo 0.3 — Configurar os Use Accesses]]**.
