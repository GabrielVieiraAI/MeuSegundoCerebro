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

A demanda **DEL-COM-165 (Carga Massiva de Lançamentos de Taxas com Razão Especial)** é composta por **dois aplicativos SAP Fiori Elements (OData V4)** desacoplados no pacote `ZFI_CARGA_TAXAS`, cada um com sua própria nota de arquitetura, seu próprio diagrama Excalidraw e seu próprio ciclo de vida transacional no **RAP** (*ABAP RESTful Application Programming Model*):

| Aplicativo | Nota de Arquitetura | Diagrama Excalidraw Exclusivo | Persona & Modelo Transacional |
| :--- | :--- | :--- | :--- |
| **App 1 — Carga Massiva e Monitor de Taxas** (`taxascarga` / `ZZ1_TAXCARGA`) | 📱 [[01 - DEL-COM-165 - Arquitetura App 1 (Carga Massiva de Taxas)\|Arquitetura App 1 (Carga Massiva)]] | 🎨 [[01 - DEL-COM-165 - Arquitetura Técnica App 1 (Carga Massiva).excalidraw\|Diagrama Excalidraw App 1]] | **Operador Financeiro (Contas a Pagar):** Hierarquia de **3 níveis** (`Carga -> Documento -> Item`), *Managed with Additional Save* (sem *Draft*), motor Excel `XCO_CP_XLSX` e contabilização via Wrapper C1 (`BAPI_ACC_DOCUMENT_CHECK` / `POST`). |
| **App 2 — Manutenção de Tipos de Movimento** (`taxastipomov` / `ZZ1_TAXTPMOV`) | ⚙️ [[02 - DEL-COM-165 - Arquitetura App 2 (Tipos de Movimento)\|Arquitetura App 2 (Tipos de Movimento)]] | 🎨 [[02 - DEL-COM-165 - Arquitetura Técnica App 2 (Tipos de Movimento).excalidraw\|Diagrama Excalidraw App 2]] | **Key User de FI:** Cadastro de **1 único nível** (`ZTFI_TAX_TPMOV`), *Managed com Draft* (`ZTFI_TAX_TPMOV_D`), 100% Fiori Elements standard. |

---

## 🔐 Infraestrutura Compartilhada (Segurança, Mensagens e Numeração)

Os objetos abaixo pertencem ao pacote `ZFI_CARGA_TAXAS` e fornecem a infraestrutura base de segurança, mensagens e numeração para a solução, seguindo o [[00 - Padrão de Nomenclatura ABAP Veiling Holambra|Padrão de Nomenclatura ABAP Veiling Holambra]]:

| Tipo de Objeto | Padrão | Nome do Objeto | Papel na Solução (App 1 e App 2) |
| :--- | :--- | :--- | :--- |
| **Classe de Mensagens (SE91)** | `ZFI_<desc>` | [[06 - ZFI_TAXAS\|ZFI_TAXAS]] | Centraliza as mensagens `001` a `025` consumidas tanto pelo motor de validação de planilhas e contabilização do **App 1** (`001` a `021`, `025`) quanto pelas validações de cadastro do **App 2** (`022` a `024`). |
| **Objeto de Autorização (SU21)** | `Z<desc>` | [[07 - ZTAXCARGA\|ZTAXCARGA]] | Segrega permissões por Empresa (`BUKRS`) e Atividade (`ACTVT`):<br>• **App 1:** `01` (Upload de planilha), `03` (Exibir monitor / DCL / Baixar modelo) e `16` (Contabilizar lote).<br>• **App 2:** `02` (Criar, editar e excluir Tipos de Movimento). |
| **Intervalo de Numeração (SNRO)** | `Z<desc>` | [[08 - ZTAXCARNR\|ZTAXCARNR]] | Gera o número sequencial único de 10 dígitos (`carga_id`) para cada lote de planilha carregado no **App 1**, gravado também em `BSEG-XREF1` para rastreabilidade contábil. |
