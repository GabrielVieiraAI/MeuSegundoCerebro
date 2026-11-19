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
id_demanda: DEL-COM-165
tipo: arquitetura-tecnica
data: 2026-11-11
aliases:
  - "DEL-COM-165 - Arquitetura e Objetos"
  - "00 - DEL-COM-165 - Visão Integrada e Infraestrutura"
---

# DEL-COM-165 · Visão Integrada e Infraestrutura Compartilhada

📄 [[01 - Especificação Funcional (Visão da Solução)|Especificação Funcional]] | 📋 [[Consolidado de decisões tomadas em todas as reuniões|Decisões das Reuniões]] | 🗺️ [[03 - DEL-COM-165 - Jornada do Dado dos Apps (Fluxo End-to-End).excalidraw|Jornada do Dado (End-to-End)]] | 🚀 [[01 - DEL-COM-165 - Guia de Implementação|Guia de Implementação]] | 🧪 [[02 - DEL-COM-165 - Guia de Testes e Homologação|Guia de Testes e Homologação]]

---

## 📌 Divisão da Solução em 2 Aplicativos Independentes

A demanda **DEL-COM-165 (Carga Massiva de Lançamentos de Taxas com Razão Especial)** é composta por **dois aplicativos SAP Fiori Elements (OData V4)** desacoplados sob o pacote organizador `ZFI_CARGA_TAXAS` (dentro de `ZFI`), organizados em **3 subpacotes irmãos** com encapsulamento ativo (`Package encapsulated`):
- **`ZFI_TAX_COMUM`:** hospeda os objetos compartilhados e a *Package Interface* **`ZPI_FI_TAX_COMUM`**.
- **`ZFI_TAX_TPMOV`:** exclusivo do **Aplicativo de Tipos de Movimento (`ZFI_TAX_TPMOV`)** (declara *Use Access* para `ZPI_FI_TAX_COMUM`).
- **`ZFI_TAX_CARGA`:** exclusivo do **Aplicativo de Carga Massiva de Taxas (`ZFI_TAX_CARGA`)** (declara *Use Access* para `ZPI_FI_TAX_COMUM`).

Cada aplicativo possui sua própria nota de arquitetura, seu próprio diagrama Excalidraw e seu próprio ciclo de vida transacional no **RAP** (*ABAP RESTful Application Programming Model*):

| Aplicativo | Nota de Arquitetura | Diagrama Excalidraw Exclusivo | Persona & Modelo Transacional |
| :--- | :--- | :--- | :--- |
| **Aplicativo de Carga Massiva de Taxas (`ZFI_TAX_CARGA`)** (`taxascarga` / `ZZ1_TAXCARGA`) | 📱 [[01 - DEL-COM-165 - Arquitetura (Carga Massiva de Taxas)\|Arquitetura (Carga Massiva)]] | 🎨 [[01 - DEL-COM-165 - Arquitetura Técnica (Carga Massiva).excalidraw\|Diagrama Excalidraw (Carga Massiva)]] | **Operador Financeiro (Contas a Pagar):** Hierarquia de **3 níveis** (`Carga -> Documento -> Item`), *Managed with Additional Save* (sem *Draft*), motor Excel `XCO_CP_XLSX` e contabilização via Wrapper C1 (`BAPI_ACC_DOCUMENT_CHECK` / `POST`). |
| **Aplicativo de Tipos de Movimento (`ZFI_TAX_TPMOV`)** (`taxastipomov` / `ZZ1_TAXTPMOV`) | ⚙️ [[02 - DEL-COM-165 - Arquitetura (Tipos de Movimento)\|Arquitetura (Tipos de Movimento)]] | 🎨 [[02 - DEL-COM-165 - Arquitetura Técnica (Tipos de Movimento).excalidraw\|Diagrama Excalidraw (Tipos de Movimento)]] | **Key User de FI:** Cadastro de **1 único nível** (`ZTFI_TAX_TPMOV`), *Managed com Draft* (`ZTFI_TAX_TPMOV_D`), 100% Fiori Elements standard. |

---

## 🔐 Infraestrutura Compartilhada (Segurança, Mensagens e Numeração)

Os objetos abaixo pertencem ao subpacote compartilhado **`ZFI_TAX_COMUM`** (expostos na *Package Interface* **`ZPI_FI_TAX_COMUM`** para consumo por `ZFI_TAX_TPMOV` e `ZFI_TAX_CARGA`), seguindo o [[00 - Padrão de Nomenclatura ABAP Veiling Holambra|Padrão de Nomenclatura ABAP Veiling Holambra]]:

| Tipo de Objeto | Padrão | Nome do Objeto | Papel na Solução (Carga Massiva de Taxas e Tipos de Movimento) |
| :--- | :--- | :--- | :--- |
| **Classe de Mensagens (SE91)** | `ZFI_<desc>` | [[06 - ZFI_TAXAS\|ZFI_TAXAS]] | Centraliza as 20 mensagens ativas (no intervalo `001` a `025`, sem os IDs `008`, `010`, `012`, `017`, `018` delegados à BAPI/removidos) consumidas pelo **Aplicativo de Carga Massiva de Taxas (`ZFI_TAX_CARGA`)** (`001`–`007`, `009`, `011`, `013`–`016`, `019`–`021`, `025`) e pelo **Aplicativo de Tipos de Movimento (`ZFI_TAX_TPMOV`)** (`022`–`024`). |
| **Objeto de Autorização (SU21)** | `Z<desc>` | [[07 - ZTAXCARGA\|ZTAXCARGA]] | Segrega permissões por Empresa (`BUKRS`) e Atividade (`ACTVT`):<br>• **Aplicativo de Carga Massiva de Taxas (`ZFI_TAX_CARGA`):** `01` (Upload de planilha), `03` (Exibir monitor / DCL / Baixar modelo) e `16` (Contabilizar lote).<br>• **Aplicativo de Tipos de Movimento (`ZFI_TAX_TPMOV`):** `02` (Criar, editar e excluir Tipos de Movimento). |
| **Intervalo de Numeração (SNRO)** | `Z<desc>` | [[08 - ZTAXCARNR\|ZTAXCARNR]] | Gera o número sequencial único de 10 dígitos (`carga_id`) para cada lote de planilha carregado no **Aplicativo de Carga Massiva de Taxas (`ZFI_TAX_CARGA`)**, gravado também em `BSEG-XREF1` para rastreabilidade contábil. |
