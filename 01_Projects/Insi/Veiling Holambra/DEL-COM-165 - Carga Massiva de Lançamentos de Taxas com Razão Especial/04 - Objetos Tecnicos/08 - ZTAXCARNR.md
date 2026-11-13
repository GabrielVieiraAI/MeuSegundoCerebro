---
tipo: objeto-tecnico
tags:
  - projeto
  - veiling-holambra
  - sap
  - fi
  - snro
  - abap-cloud
  - del-com-165
  - objeto-tecnico
id_demanda: DEL-COM-165
objeto: "ZTAXCARNR"
camada: "4 - Segurança e Mensagens"
data: 2026-11-11
aliases:
  - "ZTAXCARNR"
---

# 📦 `ZTAXCARNR` (Objeto de Intervalo de Numeração — SNRO)

⬅️ [[00 - DEL-COM-165 - Visão Integrada e Infraestrutura|Visão Integrada]] | 📱 [[01 - DEL-COM-165 - Arquitetura App 1 (Carga Massiva de Taxas)|Arquitetura App 1]] | ⚙️ [[02 - DEL-COM-165 - Arquitetura App 2 (Tipos de Movimento)|Arquitetura App 2]]

---

## 📌 Visão Geral do Objeto

O objeto de intervalo de numeração (`Number Range Object`) `ZTAXCARNR` gera o código sequencial único de 10 dígitos (`carga_id`) para cada lote de planilha carregado no Aplicativo 1 (gravado na chave primária de [[03 - ZTFI_TAX_CARGA|ZTFI_TAX_CARGA]] e propagado para o campo contábil `BSEG-XREF1` no lançamento das BAPIs).

---

## ⚖️ Regras de Negócio Aplicadas

1. **Sequencial Único de 10 Posições (`0000000001` a `9999999999`):**
   - Garante que cada upload de planilha receba um identificador exclusivo e rastreável na contabilidade (`REF_KEY_1` / `XREF1`, que suporta até 12 caracteres no SAP).
2. **Consumo via Wrapper C1 / Runtime API:**
   - A geração do próximo número no intervalo `01` é encapsulada pelo método `obter_proximo_carga_id` da classe [[09 - ZCLFI_TAX_BAPI_WRAP|ZCLFI_TAX_BAPI_WRAP]] (utilizando `CL_NUMBERRANGE_RUNTIME` ou `NUMBER_GET_NEXT`).

---

## 🛠️ Passo a Passo da Criação do Objeto

1. **No Eclipse ADT (ou transação `SNRO` no SAP GUI):** Conecte-se ao sistema e acesse o pacote `ZFI_CARGA_TAXAS`.
2. Clique com o botão direito -> **`New`** -> **`Other ABAP Repository Object`** -> **`Number Range Object`**.
3. Preencha as propriedades:
   - **Name:** `ZTAXCARNR`
   - **Description:** `DEL-COM-165: ID Sequencial do Lote de Carga de Taxas`
   - **Number Length Domain:** `CHAR10` (ou `NUMC10`)
   - **Warning %:** `5.0`
4. Salve e ative o objeto com **`Ctrl + F3`**.
5. Acesse a manutenção de intervalos (botão **Ranges** na transação `SNRO` ou app Fiori *Manage Number Range Intervals*) e cadastre o intervalo `01`:
   - **No.:** `01`
   - **From Number:** `0000000001`
   - **To Number:** `9999999999`
   - **External:** Desmarcado (numeração interna automática).

---

## 💻 Snippet de Código

### 📝 Código Comentado (Para Estudo e Referência)

```text
// =========================================================================
// CONFIGURAÇÃO DO OBJETO DE NUMERAÇÃO ZTAXCARNR (Transação SNRO / ADT)
// =========================================================================
Object Name          : ZTAXCARNR
Short Text           : ID Carga de Taxas
Long Text            : DEL-COM-165: Identificador do Lote de Carga de Taxas
Number Length Domain : NUMC10
Warning Percentage   : 5,0
Main Memory Buffering: No Buffering (Garante sequência contínua sem saltos para auditoria)

// Intervalo a ser criado na SNRO (Botão "Intervals"):
Interval No. : 01
From Number  : 0000000001
To Number    : 9999999999
External     : [ ] (Interno)
```

---

### 🚀 Código Limpo (Sem Comentários - Para Copiar e Colar)

```text
Object Name : ZTAXCARNR
Domain      : NUMC10
Warning %   : 5.0
Buffering   : No Buffering
Interval 01 : 0000000001 - 9999999999 (Internal)
```
