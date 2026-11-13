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
objeto: "ZC_FI_TAX_CARGA (CDS)"
camada: "2 - Modelagem CDS"
data: 2026-11-11
aliases:
  - "ZC_FI_TAX_CARGA (CDS)"
  - "ZC_FI_TAX_CARGA"
---

# 📦 `ZC_FI_TAX_CARGA (CDS)` (CDS Root Projection View — Monitor de Lotes de Carga)

⬅️ [[01 - DEL-COM-165 - Arquitetura App 1 (Carga Massiva de Taxas)|Voltar para Arquitetura App 1]] | 🎨 [[01 - DEL-COM-165 - Arquitetura Técnica App 1 (Carga Massiva).excalidraw|Ver no Diagrama Excalidraw App 1]]

---

## 📌 Visão Geral do Objeto

A CDS View `ZC_FI_TAX_CARGA` é a **Entidade Raiz de Projeção (*Root Projection View*)** do **Aplicativo 1** (Carga Massiva e Monitor de Taxas com Razão Especial), projetando [[19 - ZI_FI_TAX_CARGA (CDS)|ZI_FI_TAX_CARGA]] e redirecionando a composição `_Documentos` para [[27 - ZC_FI_TAX_DOC (CDS)|ZC_FI_TAX_DOC]].

---

## ⚖️ Regras de Negócio Aplicadas

1. **Pesquisa Global e Rótulos Amigáveis:** Permite buscar lotes pelo ID da Carga (`carga_id`) ou pelo nome do arquivo Excel (`nome_arquivo`), exibindo contadores de documentos (total, válidos, erro e lançados) e somatórios de débito e crédito.

---

## 🛠️ Passo a Passo da Criação do Objeto

1. **No Eclipse ADT:** Conecte-se ao sistema e acesse o pacote `ZFI_CARGA_TAXAS`.
2. Clique com o botão direito -> **`New`** -> **`Data Definition`**.
3. Preencha as propriedades:
   - **Name:** `ZC_FI_TAX_CARGA`
   - **Description:** `DEL-COM-165: Projection Root Monitor de Lotes de Carga`
   - **Referenced Object:** `ZI_FI_TAX_CARGA`
4. Selecione o template **`Define Root View Entity`** / **`Projection View`** e conclua o assistente.
5. Substitua o código gerado pelo snippet abaixo e ative com **`Ctrl + F3`** (em conjunto com [[27 - ZC_FI_TAX_DOC (CDS)|ZC_FI_TAX_DOC]] e [[28 - ZC_FI_TAX_ITEM (CDS)|ZC_FI_TAX_ITEM]]).

---

## 💻 Snippet de Código

### 📝 Código Comentado (Para Estudo e Referência)

```abap
@AccessControl.authorizationCheck: #CHECK
@EndUserText.label: 'DEL-COM-165: Monitor de Cargas de Taxas'
@Metadata.allowExtensions: true
@Search.searchable: true
define root view entity ZC_FI_TAX_CARGA
  provider contract transactional_query
  as projection on ZI_FI_TAX_CARGA
{
      @EndUserText.label: 'ID da Carga'
      @Search.defaultSearchElement: true
  key carga_id,

      @EndUserText.label: 'Arquivo Excel'
      @Search.defaultSearchElement: true
      @Search.fuzzinessThreshold: 0.8
      nome_arquivo,

      @EndUserText.label: 'Código Status'
      status_geral,

      @EndUserText.label: 'Status do Lote'
      status_texto,

      criticidade_status,

      @EndUserText.label: 'Total Docs'
      qtd_docs,

      @EndUserText.label: 'Docs Válidos (V)'
      qtd_validos,

      @EndUserText.label: 'Docs c/ Erro (E)'
      qtd_erros,

      @EndUserText.label: 'Docs Lançados (L)'
      qtd_lancados,

      @EndUserText.label: 'Moeda'
      waers,

      @EndUserText.label: 'Total Débito'
      @Semantics.amount.currencyCode: 'waers'
      total_debito,

      @EndUserText.label: 'Total Crédito'
      @Semantics.amount.currencyCode: 'waers'
      total_credito,

      @EndUserText.label: 'Criado Por'
      criado_por,

      @EndUserText.label: 'Data/Hora Upload'
      criado_em,

      @EndUserText.label: 'Alterado Por'
      alterado_por,

      @EndUserText.label: 'Última Atualização'
      alterado_em,

      // Redireciona a composição para a projeção de documentos contábeis do lote
      _Documentos : redirected to composition child ZC_FI_TAX_DOC
}
```

---

### 🚀 Código Limpo (Sem Comentários - Para Copiar e Colar)

```abap
@AccessControl.authorizationCheck: #CHECK
@EndUserText.label: 'DEL-COM-165: Monitor de Cargas de Taxas'
@Metadata.allowExtensions: true
@Search.searchable: true
define root view entity ZC_FI_TAX_CARGA
  provider contract transactional_query
  as projection on ZI_FI_TAX_CARGA
{
      @EndUserText.label: 'ID da Carga'
      @Search.defaultSearchElement: true
  key carga_id,

      @EndUserText.label: 'Arquivo Excel'
      @Search.defaultSearchElement: true
      @Search.fuzzinessThreshold: 0.8
      nome_arquivo,

      @EndUserText.label: 'Código Status'
      status_geral,

      @EndUserText.label: 'Status do Lote'
      status_texto,

      criticidade_status,

      @EndUserText.label: 'Total Docs'
      qtd_docs,

      @EndUserText.label: 'Docs Válidos (V)'
      qtd_validos,

      @EndUserText.label: 'Docs c/ Erro (E)'
      qtd_erros,

      @EndUserText.label: 'Docs Lançados (L)'
      qtd_lancados,

      @EndUserText.label: 'Moeda'
      waers,

      @EndUserText.label: 'Total Débito'
      @Semantics.amount.currencyCode: 'waers'
      total_debito,

      @EndUserText.label: 'Total Crédito'
      @Semantics.amount.currencyCode: 'waers'
      total_credito,

      @EndUserText.label: 'Criado Por'
      criado_por,

      @EndUserText.label: 'Data/Hora Upload'
      criado_em,

      @EndUserText.label: 'Alterado Por'
      alterado_por,

      @EndUserText.label: 'Última Atualização'
      alterado_em,

      _Documentos : redirected to composition child ZC_FI_TAX_DOC
}
```
