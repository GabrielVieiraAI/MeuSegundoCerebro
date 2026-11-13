---
tipo: objeto-tecnico
tags:
  - projeto
  - veiling-holambra
  - sap
  - fi
  - cds
  - rap
  - abap-cloud
  - del-com-165
  - objeto-tecnico
id_demanda: DEL-COM-165
objeto: "ZI_FI_TAX_ARQUIVO"
camada: "2 - Modelagem CDS"
data: 2026-11-11
aliases:
  - "ZI_FI_TAX_ARQUIVO"
---

# 📦 `ZI_FI_TAX_ARQUIVO` (CDS Abstract Entity — Parâmetros de Upload e Download Excel)

⬅️ [[01 - DEL-COM-165 - Arquitetura App 1 (Carga Massiva de Taxas)|Voltar para Arquitetura App 1]] | 🎨 [[01 - DEL-COM-165 - Arquitetura Técnica App 1 (Carga Massiva).excalidraw|Ver no Diagrama Excalidraw App 1]]

---

## 📌 Visão Geral do Objeto

A CDS Abstract Entity `ZI_FI_TAX_ARQUIVO` define uma estrutura de transporte sem persistência em banco de dados utilizada como parâmetro de entrada da *static action* `carregarArquivo` e como estrutura de retorno (`result [1]`) da *static action* `baixarModelo` no Behavior Definition [[24 - ZI_FI_TAX_CARGA (BDEF)|ZI_FI_TAX_CARGA]].

---

## ⚖️ Regras de Negócio Aplicadas

1. **Transporte Seguro de Arquivo `.xlsx` em OData V4:**
   - `nome_arquivo`: Nome original do arquivo enviado pelo usuário (ex.: `DEL-COM-165_Carga_Janeiro.xlsx`) ou nome sugerido no download do template (`DEL-COM-165_Modelo_Layout_Carga.xlsx`).
   - `mime_type`: Tipo MIME padrão de planilha OpenXML (`application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`).
   - `conteudo_base64`: Conteúdo binário do arquivo codificado em string `Base64` (`abap.string(0)`).

---

## 🛠️ Passo a Passo da Criação do Objeto

1. **No Eclipse ADT:** Conecte-se ao sistema e acesse o pacote `ZFI_CARGA_TAXAS`.
2. Clique com o botão direito -> **`New`** -> **`Data Definition`**.
3. Preencha as propriedades:
   - **Name:** `ZI_FI_TAX_ARQUIVO`
   - **Description:** `DEL-COM-165: Abstract Entity para Upload/Download Excel`
4. Selecione o template **`Define Abstract Entity`** e conclua o assistente.
5. Substitua o código gerado pelo snippet abaixo e ative com **`Ctrl + F3`**.

---

## 💻 Snippet de Código

### 📝 Código Comentado (Para Estudo e Referência)

```abap
@EndUserText.label: 'DEL-COM-165: Parâmetros de Arquivo Excel'
define abstract entity ZI_FI_TAX_ARQUIVO
{
  // Nome do arquivo .xlsx (gravado no cabeçalho do lote ZTFI_TAX_CARGA)
  @EndUserText.label: 'Nome do Arquivo'
  nome_arquivo    : abap.char(120);

  // Tipo MIME do arquivo Excel
  @EndUserText.label: 'Tipo MIME'
  mime_type       : abap.char(128);

  // Conteúdo binário da planilha codificado em Base64
  @EndUserText.label: 'Conteúdo Base64'
  conteudo_base64 : abap.string(0);
}
```

---

### 🚀 Código Limpo (Sem Comentários - Para Copiar e Colar)

```abap
@EndUserText.label: 'DEL-COM-165: Parâmetros de Arquivo Excel'
define abstract entity ZI_FI_TAX_ARQUIVO
{
  @EndUserText.label: 'Nome do Arquivo'
  nome_arquivo    : abap.char(120);

  @EndUserText.label: 'Tipo MIME'
  mime_type       : abap.char(128);

  @EndUserText.label: 'Conteúdo Base64'
  conteudo_base64 : abap.string(0);
}
```
