---
tipo: objeto-tecnico
tags:
  - projeto
  - veiling-holambra
  - sap
  - abap
  - use-access
  - eclipse-adt
  - del-com-165
  - objeto-tecnico
id_demanda: DEL-COM-165
objeto: "Use Accesses (ZFI_TAX_TPMOV / ZFI_TAX_CARGA)"
camada: "0 - Estrutura de Pacotes e Encapsulamento"
data: 2026-11-13
aliases:
  - "Use Accesses DEL-COM-165"
  - "00C - Use Accesses (Liberação entre Subpacotes)"
---

# 🔑 `Use Accesses` (Liberação de Consumo nos Subpacotes)

⬅️ [[00B - ZPI_FI_TAX_COMUM (Package Interface)|Passo 0.2: Package Interface]] | ➡️ [[06 - ZFI_TAXAS|Passo 1: ZFI_TAXAS]] | 🚀 [[01 - DEL-COM-165 - Guia de Implementação|Guia de Implementação]]

---

## 📌 Visão Geral

Registro da permissão **`Use Access`** nos subpacotes dos dois aplicativos (**`ZFI_TAX_TPMOV`** e **`ZFI_TAX_CARGA`**) apontando para **`ZPI_FI_TAX_COMUM`**, liberando o consumo dos objetos compartilhados sem erro de verificação de pacote (**ATC** — *ABAP Test Cockpit*).

---

## 🛠️ Passo a Passo no Eclipse ADT

### 🔖 Metadados ADT

```yaml
objectType: "Use Access (Manual)"
packageName: "ZFI_TAX_TPMOV / ZFI_TAX_CARGA"
name: "Use Access -> ZPI_FI_TAX_COMUM"
description: "DEL-COM-165: Use Access entre subpacotes de taxas"
extraParams:
  packageInterface: "ZPI_FI_TAX_COMUM"
  errorSeverity: "none"
```

### 1. Configurar no subpacote `ZFI_TAX_TPMOV` (Aplicativo de Tipos de Movimento (`ZFI_TAX_TPMOV`))
1. No **Project Explorer**, abra **`ZFI_CARGA_TAXAS`** -> **`Subpackages`** -> dê duplo clique em **`ZFI_TAX_TPMOV`**.
2. Na barra inferior do editor do pacote, clique na aba **`Use Accesses`**.
3. Clique no ícone **`+`** (*Add...*).
4. Preencha:
   - **Package Interface:** `ZPI_FI_TAX_COMUM`
   - **Error Severity:** `none`
5. Clique em **`OK`**, selecione a **TR** (*Transport Request*) da demanda caso solicitado e salve com **`Ctrl + S`**.

### 2. Configurar no subpacote `ZFI_TAX_CARGA` (Aplicativo de Carga Massiva de Taxas (`ZFI_TAX_CARGA`))
1. No **Project Explorer**, dê duplo clique em **`ZFI_TAX_CARGA`**.
2. Clique na aba inferior **`Use Accesses`**.
3. Clique no ícone **`+`** (*Add...*).
4. Preencha:
   - **Package Interface:** `ZPI_FI_TAX_COMUM`
   - **Error Severity:** `none`
5. Clique em **`OK`**, selecione a **TR** da demanda caso solicitado e salve com **`Ctrl + S`**.

---

## ✅ Validação
Confirme que tanto **`ZFI_TAX_TPMOV`** quanto **`ZFI_TAX_CARGA`** exibem **`Use Accesses (1)`** na aba inferior, listando `ZPI_FI_TAX_COMUM` com **Error Severity = `none`**.

Prossiga para a **Fase 1** pelo **[[06 - ZFI_TAXAS|Passo 1 — ZFI_TAXAS]]**.
