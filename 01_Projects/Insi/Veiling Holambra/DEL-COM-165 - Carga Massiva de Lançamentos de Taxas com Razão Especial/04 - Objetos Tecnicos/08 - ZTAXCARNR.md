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

⬅️ [[00 - DEL-COM-165 - Visão Integrada e Infraestrutura|Visão Integrada]] | 📱 [[01 - DEL-COM-165 - Arquitetura (Carga Massiva de Taxas)|Arquitetura Carga Massiva de Taxas]] | ⚙️ [[02 - DEL-COM-165 - Arquitetura (Tipos de Movimento)|Arquitetura Tipos de Movimento]]

---

## 📌 Visão Geral do Objeto

O objeto de intervalo de numeração (`Number Range Object`) `ZTAXCARNR` gera o código sequencial único de 10 dígitos (`carga_id`) para cada lote de planilha carregado no Aplicativo de Carga Massiva de Taxas (`ZFI_TAX_CARGA`) (gravado na chave primária de [[03 - ZTFI_TAX_CARGA|ZTFI_TAX_CARGA]] e propagado para o campo contábil `BSEG-XREF1` no lançamento das BAPIs).

---

## ⚖️ Regras de Negócio Aplicadas

1. **Sequencial Único de 10 Posições (`0000000001` a `9999999999`):**
   - Garante que cada upload de planilha receba um identificador exclusivo e rastreável na contabilidade (`REF_KEY_1` / `XREF1`, que suporta até 12 caracteres no SAP).
2. **Consumo via Wrapper C1 / Runtime API:**
   - A geração do próximo número no intervalo `01` é encapsulada pelo método `obter_proximo_carga_id` da classe [[09 - ZCLFI_TAX_BAPI_WRAP|ZCLFI_TAX_BAPI_WRAP]] (utilizando `CL_NUMBERRANGE_RUNTIME` ou `NUMBER_GET_NEXT`).

---

## 🛠️ Passo a Passo da Criação do Objeto

### 🔖 Metadados ADT

```yaml
objectType: "NROB/NRO"
packageName: "ZFI_TAX_COMUM"
name: "ZTAXCARNR"
description: "DEL-COM-165: ID Sequencial do Lote de Carga de Taxas"
```

1. **No Eclipse ADT (ou transação `SNRO` no SAP GUI):** Conecte-se ao sistema e acesse o pacote `ZFI_TAX_COMUM`.
2. Clique com o botão direito -> **`New`** -> **`Other ABAP Repository Object`** -> **`Number Range Object`**.
3. Preencha as propriedades:
   - **Name:** `ZTAXCARNR`
   - **Description:** `DEL-COM-165: ID Sequencial do Lote de Carga de Taxas`
   - **Number Length Domain:** `CHAR10` (ou `NUMC10`)
   - **Warning %:** `5.0`
4. Salve e ative o objeto com **`Ctrl + F3`**.

---

### Passo 41 · Cadastro do Intervalo `01` na Transação `SNRO` (Manual por Ambiente)

> [!IMPORTANT] Por que este passo é manual em cada ambiente (`DEV`, `QAS` e `PRD`)?
> No SAP, a definição técnica do objeto `ZTAXCARNR` vai na **TR** (*Transport Request* — ordem de transporte), mas os **intervalos numéricos** (de qual número até qual número o contador vai girar) são dependentes de mandante (*client*) e **não são transportados automaticamente**. Por isso, o intervalo `01` precisa ser cadastrado manualmente no ambiente `S4D` (Desenvolvimento) e, quando a demanda subir, repetido em `QAS` (Qualidade) e `PRD` (Produção).

#### Opção A — Pelo SAP GUI (Transação `SNRO` — Padrão Recomendado)

1. Abra o **SAP GUI** no ambiente desejado (começando por **`S4D`**, mandante `100`).
2. Na barra de transações (canto superior esquerdo), digite **`SNRO`** e pressione **`Enter`**.
3. No campo **Objeto** (*Number Range Object*), digite **`ZTAXCARNR`**.
4. Clique no botão **`Intervalos`** (*Intervalos de numeração* / *Ranges* ou *Intervals*, na barra superior da tela — ícone de tabela/lápis ou tecla `F7` conforme versão do SAP GUI).
   - *Observação:* caso apareça uma tela com três botões (*Exibir intervalos*, *Modificar intervalos* e *Modificar status NR*), clique em **`Modificar intervalos`** (ícone de lápis).
5. Na tela **Atualizar intervalos de objeto de numeração `ZTAXCARNR`**:
   - Clique no botão **`Inserir linha`** (ícone `+` verde / *Insert Line* ou tecla `F6`) para habilitar uma nova linha editável.
6. Preencha os campos da linha exatamente conforme abaixo:

| Campo (PT / EN) | Valor a preencher | Observação |
| :--- | :--- | :--- |
| **`Nº` (`No.`)** | `01` | Código fixo do intervalo chamado pela classe `ZCLFI_TAX_BAPI_WRAP`. |
| **`De número` (`From No.`)** | `0000000001` | Primeiro número sequencial do lote (`carga_id`). |
| **`Até número` (`To Number`)** | `9999999999` | Limite máximo de 10 dígitos (`NUMC10`). |
| **`Status NR` (`NR Status`)** | `0` *(ou deixe em branco)* | Indica que a numeração começará do `1` no primeiro upload. |
| **`Ext.` (`External`)** | **Desmarcado** (`[ ]`) | Garante numeração interna automática gerada pelo SAP. |

7. Pressione **`Enter`** para validar os zeros à esquerda e o formato do intervalo.
8. Clique em **Gravar** (**`Ctrl + S`**).
9. O SAP exibirá uma janela informativa padrão alertando sobre o transporte de intervalos de numeração (*"Os intervalos do objeto de numeração não são incluídos no transporte automático..."* / *Transport Number Range Intervals*). Clique em **Confirmar** (**`Enter`** ou ícone de visto verde `✓`).
10. Confirme na barra de status inferior a mensagem de gravação concluída (ex.: *"As modificações foram gravadas"* / *"Changes were saved"*).

#### Opção B — Pelo SAP Fiori Launchpad (caso use o app padrão)

1. Abra o aplicativo padrão **`Manage Number Range Intervals`** (ou *Administrar intervalos de numeração*).
2. Pesquise pelo objeto **`ZTAXCARNR`**.
3. Clique em **Create / Add Interval** e informe **Number:** `01`, **From Number:** `0000000001`, **To Number:** `9999999999`, deixando **External** desmarcado, e salve.

#### Validação do Passo 41

1. Volte à tela inicial da transação **`SNRO`**, informe **`ZTAXCARNR`** e clique em **Exibir intervalos** (ícone de óculos).
2. Confirme que a linha **`01`** aparece listada com `De número = 0000000001`, `Até número = 9999999999`, `Status NR = 0` e `Ext.` desmarcado.
3. *(Apenas quando subir para outros ambientes)* Repita este mesmo procedimento em **`QAS`** e **`PRD`** durante o *cutover* (entrada em produção), evitando o transporte direto de intervalos pela `SNRO` para não correr o risco de sobrescrever contadores já em uso.

---

## 💻 Snippet de Código

### 📝 Código Comentado (Para Estudo e Referência)

```text
// =========================================================================
// CONFIGURAÇÃO DO OBJETO DE NUMERAÇÃO ZTAXCARNR (Transação SNRO / ADT AFF)
// =========================================================================
Object Name          : ZTAXCARNR
Description (ADT)    : DEL-COM-165: ID Sequencial do Lote de Carga de Taxas
Original Language    : pt
Number Length Domain : NUMC10
Warning Percentage   : 5.0
Until Year           : false (numeração contínua sem quebra por exercício)
Rolling              : false (não reinicia do início ao atingir o limite)
Prefix               : false
Main Memory Buffering: none (No Buffering — garante sequência contínua sem saltos para auditoria)
Buffered Numbers     : 0

// Intervalo a ser criado manualmente no Passo 41 (SNRO -> Botão "Intervals"):
Interval No. : 01
From Number  : 0000000001
To Number    : 9999999999
External     : [ ] (Interno)
```

---

### 🚀 Código Limpo (Sem Comentários - Para Copiar e Colar)

```json
{
  "formatVersion": "1",
  "header": {
    "description": "DEL-COM-165: ID Sequencial do Lote de Carga de Taxas",
    "originalLanguage": "pt"
  },
  "interval": {
    "numberLengthDomain": "NUMC10",
    "percentWarning": 5.0,
    "subType": "",
    "untilYear": false,
    "rolling": false,
    "prefix": false
  },
  "configuration": {
    "buffering": "none",
    "bufferedNumbers": 0
  }
}
```

```text
// Intervalo SNRO (Passo 41 [Manual]):
Interval 01 : 0000000001 - 9999999999 (Internal)
```
