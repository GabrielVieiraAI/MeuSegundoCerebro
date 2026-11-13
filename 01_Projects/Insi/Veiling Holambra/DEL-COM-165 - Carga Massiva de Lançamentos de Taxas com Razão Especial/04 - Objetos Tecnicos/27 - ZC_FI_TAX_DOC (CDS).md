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
objeto: "ZC_FI_TAX_DOC (CDS)"
camada: "2 - Modelagem CDS"
data: 2026-11-11
aliases:
  - "ZC_FI_TAX_DOC (CDS)"
  - "ZC_FI_TAX_DOC"
---

# 📦 `ZC_FI_TAX_DOC (CDS)` (CDS Child Projection View — Documentos do Lote)

⬅️ [[01 - DEL-COM-165 - Arquitetura App 1 (Carga Massiva de Taxas)|Voltar para Arquitetura App 1]] | 🎨 [[01 - DEL-COM-165 - Arquitetura Técnica App 1 (Carga Massiva).excalidraw|Ver no Diagrama Excalidraw App 1]]

---

## 📌 Visão Geral do Objeto

A CDS View `ZC_FI_TAX_DOC` projeta a entidade filha [[21 - ZI_FI_TAX_DOC|ZI_FI_TAX_DOC]] (nível 2 — Documentos Contábeis agrupados por `DOCSEQ`), redirecionando o vínculo pai para [[26 - ZC_FI_TAX_CARGA (CDS)|ZC_FI_TAX_CARGA]] e a composição de partidas para [[28 - ZC_FI_TAX_ITEM (CDS)|ZC_FI_TAX_ITEM]].

---

## ⚖️ Regras de Negócio Aplicadas

1. **Rastreabilidade e Diagnóstico Visual:** Expõe na Object Page do Lote cada documento contábil (`docseq`), seu Tipo de Movimento (`ztpmov`), Referência (`xblnr`), somas de Débito/Crédito, Status colorido (`status_texto` / `criticidade_status`), documento contábil SAP gerado (`belnr` / `gjahr`) e a mensagem detalhada da BAPI (`mensagem`).

---

## 🛠️ Passo a Passo da Criação do Objeto

1. **No Eclipse ADT:** Conecte-se ao sistema e acesse o pacote `ZFI_CARGA_TAXAS`.
2. Clique com o botão direito -> **`New`** -> **`Data Definition`**.
3. Preencha as propriedades:
   - **Name:** `ZC_FI_TAX_DOC`
   - **Description:** `DEL-COM-165: Projection Child Documentos do Lote`
   - **Referenced Object:** `ZI_FI_TAX_DOC`
4. Selecione o template **`Define Projection View`** e conclua o assistente.
5. Substitua o código gerado pelo snippet abaixo e ative com **`Ctrl + F3`**.

---

## 💻 Snippet de Código

### 📝 Código Comentado (Para Estudo e Referência)

```abap
@AccessControl.authorizationCheck: #NOT_REQUIRED
@EndUserText.label: 'DEL-COM-165: Documentos do Lote de Carga'
@Metadata.allowExtensions: true
@Search.searchable: true
define view entity ZC_FI_TAX_DOC
  as projection on ZI_FI_TAX_DOC
{
      @EndUserText.label: 'ID da Carga'
  key carga_id,

      @EndUserText.label: 'Nº Doc. na Carga (DOCSEQ)'
      @Search.defaultSearchElement: true
  key docseq,

      @EndUserText.label: 'Tipo de Movimento'
      @Consumption.valueHelpDefinition: [{ entity: { name: 'ZI_FI_TAX_TPMOV', element: 'ztpmov' } }]
      ztpmov,

      @EndUserText.label: 'Empresa'
      bukrs,

      @EndUserText.label: 'Data do Documento'
      bldat,

      @EndUserText.label: 'Data de Lançamento'
      budat,

      @EndUserText.label: 'Referência (XBLNR)'
      @Search.defaultSearchElement: true
      xblnr,

      @EndUserText.label: 'Texto do Cabeçalho'
      bktxt,

      @EndUserText.label: 'Moeda'
      waers,

      @EndUserText.label: 'Total Débito'
      @Semantics.amount.currencyCode: 'waers'
      total_debito,

      @EndUserText.label: 'Total Crédito'
      @Semantics.amount.currencyCode: 'waers'
      total_credito,

      @EndUserText.label: 'Código Status'
      status,

      @EndUserText.label: 'Status do Documento'
      status_texto,

      criticidade_status,

      @EndUserText.label: 'Nº Doc. Contábil (BELNR)'
      @Search.defaultSearchElement: true
      belnr,

      @EndUserText.label: 'Exercício (GJAHR)'
      gjahr,

      @EndUserText.label: 'Mensagem de Validação / BAPI'
      mensagem,

      // Redirecionamento composicional para o pai (Carga) e filhos (Itens)
      _Carga : redirected to parent ZC_FI_TAX_CARGA,
      _Itens : redirected to composition child ZC_FI_TAX_ITEM,
      _TipoMovimento
}
```

---

### 🚀 Código Limpo (Sem Comentários - Para Copiar e Colar)

```abap
@AccessControl.authorizationCheck: #NOT_REQUIRED
@EndUserText.label: 'DEL-COM-165: Documentos do Lote de Carga'
@Metadata.allowExtensions: true
@Search.searchable: true
define view entity ZC_FI_TAX_DOC
  as projection on ZI_FI_TAX_DOC
{
      @EndUserText.label: 'ID da Carga'
  key carga_id,

      @EndUserText.label: 'Nº Doc. na Carga (DOCSEQ)'
      @Search.defaultSearchElement: true
  key docseq,

      @EndUserText.label: 'Tipo de Movimento'
      @Consumption.valueHelpDefinition: [{ entity: { name: 'ZI_FI_TAX_TPMOV', element: 'ztpmov' } }]
      ztpmov,

      @EndUserText.label: 'Empresa'
      bukrs,

      @EndUserText.label: 'Data do Documento'
      bldat,

      @EndUserText.label: 'Data de Lançamento'
      budat,

      @EndUserText.label: 'Referência (XBLNR)'
      @Search.defaultSearchElement: true
      xblnr,

      @EndUserText.label: 'Texto do Cabeçalho'
      bktxt,

      @EndUserText.label: 'Moeda'
      waers,

      @EndUserText.label: 'Total Débito'
      @Semantics.amount.currencyCode: 'waers'
      total_debito,

      @EndUserText.label: 'Total Crédito'
      @Semantics.amount.currencyCode: 'waers'
      total_credito,

      @EndUserText.label: 'Código Status'
      status,

      @EndUserText.label: 'Status do Documento'
      status_texto,

      criticidade_status,

      @EndUserText.label: 'Nº Doc. Contábil (BELNR)'
      @Search.defaultSearchElement: true
      belnr,

      @EndUserText.label: 'Exercício (GJAHR)'
      gjahr,

      @EndUserText.label: 'Mensagem de Validação / BAPI'
      mensagem,

      _Carga : redirected to parent ZC_FI_TAX_CARGA,
      _Itens : redirected to composition child ZC_FI_TAX_ITEM,
      _TipoMovimento
}
```
