---
tipo: objeto-tecnico
tags:
  - projeto
  - veiling-holambra
  - sap
  - fi
  - su21
  - seguranca
  - abap-cloud
  - del-com-165
  - objeto-tecnico
id_demanda: DEL-COM-165
objeto: "ZTAXCARGA"
camada: "4 - Segurança e Mensagens"
data: 2026-11-11
aliases:
  - "ZTAXCARGA"
---

# 📦 `ZTAXCARGA` (Objeto de Autorização — SU21)

⬅️ [[00 - DEL-COM-165 - Visão Integrada e Infraestrutura|Visão Integrada]] | 📱 [[01 - DEL-COM-165 - Arquitetura App 1 (Carga Massiva de Taxas)|Arquitetura App 1]] | ⚙️ [[02 - DEL-COM-165 - Arquitetura App 2 (Tipos de Movimento)|Arquitetura App 2]]

---

## 📌 Visão Geral do Objeto

O objeto de autorização `ZTAXCARGA` controla a segurança de acesso e segregação de funções nos dois aplicativos da demanda **DEL-COM-165**. Ele segue o [[00 - Padrão de Nomenclatura ABAP Veiling Holambra|Padrão de Nomenclatura ABAP Veiling Holambra]] (`Z<desc>`, máximo de 10 caracteres, contendo obrigatoriamente o campo `ACTVT`).

---

## ⚖️ Regras de Negócio Aplicadas

1. **Segregação por Empresa (`BUKRS`) e Atividade (`ACTVT`):**
   - `ACTVT = '01'` (*Criar / Gerar*): Permissão para realizar o upload de planilha Excel (`carregarArquivo`) no Aplicativo 1 e criar novos Tipos de Movimento no Aplicativo 2.
   - `ACTVT = '02'` (*Modificar*): Permissão para editar Tipos de Movimento na tabela `ZTFI_TAX_TPMOV` (Aplicativo 2).
   - `ACTVT = '03'` (*Exibir*): Permissão de leitura validada pelo controle de acesso DCL [[20 - ZI_FI_TAX_CARGA (DCL)|ZI_FI_TAX_CARGA]] e para download do modelo Excel (`baixarModelo`).
   - `ACTVT = '16'` (*Executar*): Permissão para acionar o botão **Contabilizar Lote** (`lancar`) no Aplicativo 1, efetuando o lançamento contábil via BAPI.

---

## 🛠️ Passo a Passo da Criação do Objeto

1. **No Eclipse ADT (ou transação `SU21` no SAP GUI):** Conecte-se ao sistema e acesse o pacote `ZFI_CARGA_TAXAS`.
2. Clique com o botão direito -> **`New`** -> **`Other ABAP Repository Object`** -> **`Authorization Object`**.
3. Preencha as propriedades:
   - **Name:** `ZTAXCARGA`
   - **Description:** `DEL-COM-165: Autorização Carga de Taxas com Razão Especial`
   - **Object Class:** `FI` (ou `ZFI`)
4. Adicione os campos de autorização `BUKRS` e `ACTVT`.
5. Em **Permitted Activities**, marque `01` (Create), `02` (Change), `03` (Display) e `16` (Execute).
6. Salve e ative com **`Ctrl + F3`**.

---

## 💻 Snippet de Código

### 📝 Código Comentado (Para Estudo e Referência)

```text
// =========================================================================
// DEFINIÇÃO DO OBJETO DE AUTORIZAÇÃO ZTAXCARGA (SU21 / Eclipse ADT)
// =========================================================================
Object Name        : ZTAXCARGA
Description        : DEL-COM-165: Autorização Carga de Taxas com Razão Especial
Authorization Class: FI
Package            : ZFI_CARGA_TAXAS

// Campos de Autorização (Authorization Fields):
1. BUKRS (Empresa / Company Code)
2. ACTVT (Atividade / Activity)

// Atividades Permitidas (Permitted Activities for ACTVT):
- 01 : Criar ou gerar (Upload de planilha no App 1 / Criar Tipo Mov. no App 2)
- 02 : Modificar (Alterar Tipo de Movimento no App 2)
- 03 : Exibir (Visualizar cargas no monitor / Baixar modelo Excel)
- 16 : Executar (Contabilizar documentos válidos no App 1)
```

```abap
" Exemplo de verificação via AUTHORITY-CHECK nos Behavior Pools:
AUTHORITY-CHECK OBJECT 'ZTAXCARGA'
  ID 'BUKRS' FIELD 'CVH1'
  ID 'ACTVT' FIELD '16'.
IF sy-subrc <> 0.
  " Dispara mensagem E001(ZFI_TAXAS)
ENDIF.
```

---

### 🚀 Código Limpo (Sem Comentários - Para Copiar e Colar)

```text
Object Name: ZTAXCARGA
Description: DEL-COM-165: Autorização Carga de Taxas com Razão Especial
Class      : FI
Fields     : BUKRS, ACTVT
Activities : 01, 02, 03, 16
```
