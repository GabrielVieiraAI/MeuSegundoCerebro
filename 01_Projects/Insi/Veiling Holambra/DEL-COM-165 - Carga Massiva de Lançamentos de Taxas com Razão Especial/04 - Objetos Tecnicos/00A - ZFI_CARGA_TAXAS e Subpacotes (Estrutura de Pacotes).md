---
tipo: objeto-tecnico
tags:
  - projeto
  - veiling-holambra
  - sap
  - abap
  - package
  - eclipse-adt
  - del-com-165
  - objeto-tecnico
id_demanda: DEL-COM-165
objeto: "ZFI_CARGA_TAXAS / ZFI_TAX_COMUM / ZFI_TAX_TPMOV / ZFI_TAX_CARGA"
camada: "0 - Estrutura de Pacotes e Encapsulamento"
data: 2026-11-13
aliases:
  - "00A - ZFI_CARGA_TAXAS e Subpacotes (Estrutura de Pacotes)"
---

# 📦 Estrutura de Pacotes da Demanda (`ZFI_CARGA_TAXAS` e Subpacotes)

⬅️ [[01 - DEL-COM-165 - Guia de Implementação|Guia de Implementação]] | ➡️ [[00B - ZPI_FI_TAX_COMUM (Package Interface)|Passo 0.2: Package Interface]] | 📄 [[00 - DEL-COM-165 - Visão Integrada e Infraestrutura|Visão Integrada]]

---

## 📌 Visão Geral

Estrutura hierárquica obrigatória para os objetos da demanda **DEL-COM-165** no Eclipse ADT (*ABAP Development Tools*):

```text
📦 ZFI
 └── 📦 ZFI_CARGA_TAXAS                      (Organizador — não criar objetos ABAP diretamente nele)
      ├── 📦 ZFI_TAX_COMUM                   (Objetos compartilhados + ZPI_FI_TAX_COMUM)
      ├── 📦 ZFI_TAX_TPMOV                   (Objetos exclusivos do Aplicativo de Tipos de Movimento (`ZFI_TAX_TPMOV`))
      └── 📦 ZFI_TAX_CARGA                   (Objetos exclusivos do Aplicativo de Carga Massiva de Taxas (`ZFI_TAX_CARGA`))
```

---

## 📋 Parâmetros Exatos dos Pacotes

| Ordem | Name | Description | Superpackage | Package Type | `Package encapsulated` | Finalidade |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **1** | `ZFI_CARGA_TAXAS` | `DEL-COM-165: Carga Massiva de Taxas (Organizador)` | `ZFI` | `Development` | Marcado (`✓`) | Agrupar os 3 subpacotes |
| **2** | `ZFI_TAX_COMUM` | `DEL-COM-165: Objetos Compartilhados de Taxas` | `ZFI_CARGA_TAXAS` | `Development` | Marcado (`✓`) | Infraestrutura compartilhada e `ZI_FI_TAX_TPMOV` |
| **3** | `ZFI_TAX_TPMOV` | `DEL-COM-165: App Tipos de Movimento de Taxas` | `ZFI_CARGA_TAXAS` | `Development` | Marcado (`✓`) | Backend RAP e deploy BSP do Aplicativo de Tipos de Movimento (`ZFI_TAX_TPMOV`) |
| **4** | `ZFI_TAX_CARGA` | `DEL-COM-165: App Carga Massiva de Taxas` | `ZFI_CARGA_TAXAS` | `Development` | Marcado (`✓`) | Backend RAP e deploy BSP do Aplicativo de Carga Massiva de Taxas (`ZFI_TAX_CARGA`) |

**Propriedades comuns (herdadas de `ZFI` no `S4D`):**
- **Default ABAP Language Version:** `Standard ABAP`
- **Transport Layer:** `ZS4D`
- **Software Component:** `HOME`
- **Adding further objects not possible:** desmarcado (`[ ]`)
- **Record objects changes in transport requests:** marcado (`✓`)

---

## 🛠️ Passo a Passo no Eclipse ADT

### 🔖 Metadados ADT (*ABAP Development Tools* — Passos 0.1A a 0.1D `[MCP]`)

#### Passo 0.1A · `ZFI_CARGA_TAXAS` (Pacote Pai Organizador)

```yaml
objectType: "DEVC/K"
packageName: "ZFI_CARGA_TAXAS"
name: "ZFI_CARGA_TAXAS"
description: "DEL-COM-165: Carga Massiva de Taxas (Organizador)"
extraParams:
  superPackage: "ZFI"
  transportLayer: "ZS4D"
  softwareComponent: "HOME"
  packageType: "development"
  packageEncapsulated: true
  recordChanges: true
```

#### Passo 0.1B · `ZFI_TAX_COMUM` (Subpacote Compartilhado)

```yaml
objectType: "DEVC/K"
packageName: "ZFI_TAX_COMUM"
name: "ZFI_TAX_COMUM"
description: "DEL-COM-165: Objetos Compartilhados de Taxas"
extraParams:
  superPackage: "ZFI_CARGA_TAXAS"
  transportLayer: "ZS4D"
  softwareComponent: "HOME"
  packageType: "development"
  packageEncapsulated: true
  recordChanges: true
```

#### Passo 0.1C · `ZFI_TAX_TPMOV` (Subpacote Tipos de Movimento)

```yaml
objectType: "DEVC/K"
packageName: "ZFI_TAX_TPMOV"
name: "ZFI_TAX_TPMOV"
description: "DEL-COM-165: App Tipos de Movimento de Taxas"
extraParams:
  superPackage: "ZFI_CARGA_TAXAS"
  transportLayer: "ZS4D"
  softwareComponent: "HOME"
  packageType: "development"
  packageEncapsulated: true
  recordChanges: true
```

#### Passo 0.1D · `ZFI_TAX_CARGA` (Subpacote Carga Massiva)

```yaml
objectType: "DEVC/K"
packageName: "ZFI_TAX_CARGA"
name: "ZFI_TAX_CARGA"
description: "DEL-COM-165: App Carga Massiva de Taxas"
extraParams:
  superPackage: "ZFI_CARGA_TAXAS"
  transportLayer: "ZS4D"
  softwareComponent: "HOME"
  packageType: "development"
  packageEncapsulated: true
  recordChanges: true
```

*(Caso algum dos pacotes abaixo já exista no ambiente com as propriedades acima, pule apenas os já criados.)*

### 1. Criar `ZFI_CARGA_TAXAS`
1. No **Project Explorer**, pressione **`Ctrl + Shift + A`** e localize o pacote **`ZFI`**.
2. Clique com o botão direito em **`ZFI`** -> **`New`** -> **`ABAP Package`**.
3. Preencha:
   - **Name:** `ZFI_CARGA_TAXAS`
   - **Description:** `DEL-COM-165: Carga Massiva de Taxas (Organizador)`
   - **Superpackage:** `ZFI`
   - Marque **`Add to favorite packages`**.
4. Clique em **`Next >`**.
5. Em **Package Properties**, selecione **Package Type = `Development`** e confirme **`Package encapsulated`** marcado (`✓`).
6. Clique em **`Next >`**, selecione ou crie a **TR** (*Transport Request*) da demanda e clique em **`Finish`**.

### 2. Criar `ZFI_TAX_COMUM`
1. Clique com o botão direito em **`ZFI_CARGA_TAXAS`** -> **`New`** -> **`ABAP Package`**.
2. Preencha:
   - **Name:** `ZFI_TAX_COMUM`
   - **Description:** `DEL-COM-165: Objetos Compartilhados de Taxas`
   - **Superpackage:** `ZFI_CARGA_TAXAS`
3. Clique em **`Next >`**, confirme **`Development`** e **`Package encapsulated`** marcado (`✓`).
4. Clique em **`Next >`**, selecione a mesma **TR** da demanda e clique em **`Finish`**.

### 3. Criar `ZFI_TAX_TPMOV` e `ZFI_TAX_CARGA`
Repita o procedimento clicando com o botão direito em **`ZFI_CARGA_TAXAS`** -> **`New`** -> **`ABAP Package`** para os dois subpacotes restantes:

1. **Aplicativo de Tipos de Movimento (`ZFI_TAX_TPMOV`):**
   - **Name:** `ZFI_TAX_TPMOV`
   - **Description:** `DEL-COM-165: App Tipos de Movimento de Taxas`
   - **Superpackage:** `ZFI_CARGA_TAXAS` | **Package Type:** `Development` | **`Package encapsulated`:** `✓`
2. **Aplicativo de Carga Massiva de Taxas (`ZFI_TAX_CARGA`):**
   - **Name:** `ZFI_TAX_CARGA`
   - **Description:** `DEL-COM-165: App Carga Massiva de Taxas`
   - **Superpackage:** `ZFI_CARGA_TAXAS` | **Package Type:** `Development` | **`Package encapsulated`:** `✓`

---

## ✅ Validação
Expanda **`ZFI_CARGA_TAXAS`** -> **`Subpackages`** no **Project Explorer** (`F5` para atualizar) e confirme que constam os 3 subpacotes: `ZFI_TAX_COMUM`, `ZFI_TAX_TPMOV` e `ZFI_TAX_CARGA`.

Avance para o **[[00B - ZPI_FI_TAX_COMUM (Package Interface)|Passo 0.2 — Criar ZPI_FI_TAX_COMUM]]**.
