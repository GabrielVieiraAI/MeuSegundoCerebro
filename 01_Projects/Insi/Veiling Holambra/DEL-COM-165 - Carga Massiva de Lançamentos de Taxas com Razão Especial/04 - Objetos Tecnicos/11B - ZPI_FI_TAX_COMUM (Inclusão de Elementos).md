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
  - "ZPI_FI_TAX_COMUM (Inclusão de Elementos)"
  - "11B - ZPI_FI_TAX_COMUM (Inclusão de Elementos)"
---

# 🧩 `ZPI_FI_TAX_COMUM` (Inclusão de Elementos Compartilhados)

⬅️ [[11 - ZI_FI_TAX_TPMOV (CDS)|Passo 11: ZI_FI_TAX_TPMOV]] | ➡️ [[14 - ZC_FI_TAX_TPMOV (CDS)|Passo 13: ZC_FI_TAX_TPMOV]] | 🚀 [[01 - DEL-COM-165 - Guia de Implementação|Guia de Implementação]]

---

## 📌 Visão Geral

Inclusão dos **7 objetos compartilhados** criados em **`ZFI_TAX_COMUM`** (Passos 1 a 11) na aba **Elements** da Package Interface **`ZPI_FI_TAX_COMUM`**, liberando o consumo para **`ZFI_TAX_TPMOV`** e **`ZFI_TAX_CARGA`** a partir do Passo 13.

---

## 🛠️ Passo a Passo no Eclipse ADT

### 🔖 Metadados ADT

```yaml
objectType: "Package Interface Elements (Manual)"
packageName: "ZFI_TAX_COMUM"
name: "ZPI_FI_TAX_COMUM"
description: "DEL-COM-165: Exposição de objetos em ZPI_FI_TAX_COMUM"
extraParams:
  manualTransaction: "ADT / SE21"
```

1. No **Project Explorer**, abra **`ZFI_CARGA_TAXAS`** -> **`Subpackages`** -> **`ZFI_TAX_COMUM`** -> **`Package Interfaces`**.
2. Dê duplo clique em **`ZPI_FI_TAX_COMUM`**.
3. Acesse a aba **`Elements`** (ou **`Visible Elements`**).
4. Clique em **`Add...`** (ícone `+`) e inclua todos os **7 objetos** da tabela abaixo:

| Passo de Origem | Objeto                | Tipo                                |
| :-------------- | :-------------------- | :---------------------------------- |
| Passo 1         | `ZFI_TAXAS`           | `MSAG` (Classe de Mensagens)        |
| Passo 2         | `ZTAXCARGA`           | `SUSO` (Objeto de Autorização)      |
| Passo 3         | `ZTAXCARNR`           | `NROB` (Objeto de Intervalo `SNRO`) |
| Passo 4         | `ZTFI_TAX_TPMOV`      | `TABL` (Tabela Transparente)        |
| Passo 9         | `ZCLFI_TAX_BAPI_WRAP` | `CLAS` (Classe ABAP Wrapper C1)     |
| Passo 10        | `ZCLFI_TAX_EXCEL`     | `CLAS` (Classe ABAP Excel)          |
| Passo 11        | `ZI_FI_TAX_TPMOV`     | `DDLS` (CDS Data Definition)        |

5. Salve com **`Ctrl + S`** (selecione a **TR** da demanda caso solicitado).
6. Ative a Package Interface pressionando **`Ctrl + F3`**.

*(Caso o ADT abra a tela clássica da `SE21`, adicione os mesmos 7 objetos na aba **Package Interface Elements** / **Visible Elements**, salve na TR e ative.)*

---

## ✅ Validação
Confirme que os **7 objetos** constam na aba **Elements** da **`ZPI_FI_TAX_COMUM`** e que o status da interface está **Active**.

Avance para o **[[14 - ZC_FI_TAX_TPMOV (CDS)|Passo 13 — ZC_FI_TAX_TPMOV (CDS)]]**.
