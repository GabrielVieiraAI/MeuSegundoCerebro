---
tipo: objeto-tecnico
tags:
  - projeto
  - veiling-holambra
  - sap
  - fi
  - mde
  - fiori
  - abap-cloud
  - del-com-165
  - objeto-tecnico
id_demanda: DEL-COM-165
objeto: "ZC_FI_TAX_DOC (MDE)"
camada: "2 - Modelagem CDS"
data: 2026-11-11
aliases:
  - "ZC_FI_TAX_DOC (MDE)"
---

# 📦 `ZC_FI_TAX_DOC (MDE)` (Metadata Extension — Documentos do Lote)

⬅️ [[01 - DEL-COM-165 - Arquitetura App 1 (Carga Massiva de Taxas)|Voltar para Arquitetura App 1]] | 🎨 [[01 - DEL-COM-165 - Arquitetura Técnica App 1 (Carga Massiva).excalidraw|Ver no Diagrama Excalidraw App 1]]

---

## 📌 Visão Geral do Objeto

O Metadata Extension `ZC_FI_TAX_DOC` configura as colunas da tabela de **Documentos Contábeis** (dentro da Object Page do Lote) e a subpágina de detalhes do documento (Object Page de 2º nível), que lista todas as suas partidas contábeis (`_Itens`).

---

## ⚖️ Regras de Negócio Aplicadas

1. **Visão Clara de Sucesso vs Erro por Documento (`DOCSEQ`):** Destaca com cores semânticas (`criticidade_status`) quais documentos estão `Verificado OK`, `Contabilizado` (com `BELNR` e `GJAHR` visíveis) ou `Erro na Verificação` (com a mensagem completa da BAPI na coluna `mensagem`).

---

## 🛠️ Passo a Passo da Criação do Objeto

1. **No Eclipse ADT:** Clique com o botão direito sobre a CDS View [[27 - ZC_FI_TAX_DOC (CDS)|ZC_FI_TAX_DOC]] -> **`New Metadata Extension`**.
2. Preencha as propriedades:
   - **Name:** `ZC_FI_TAX_DOC`
   - **Description:** `DEL-COM-165: UI Annotations Documentos do Lote`
3. Selecione a Request (TR) de desenvolvimento e conclua o assistente.
4. Substitua o código gerado pelo snippet abaixo e ative com **`Ctrl + F3`**.

---

## 💻 Snippet de Código

### 📝 Código Comentado (Para Estudo e Referência)

```abap
@Metadata.layer: #CORE
@UI: {
  headerInfo: {
    typeName: 'Documento da Carga',
    typeNamePlural: 'Documentos da Carga',
    title: { type: #STANDARD, value: 'docseq' },
    description: { type: #STANDARD, value: 'ztpmov' }
  },
  presentationVariant: [{
    sortOrder: [{ by: 'docseq', direction: #ASC }],
    visualizations: [{ type: #AS_LINEITEM }]
  }]
}
annotate entity ZC_FI_TAX_DOC with
{
  @UI.facet: [
    { id: 'FacetCabecalhoDoc',
      purpose: #STANDARD,
      type: #FIELDGROUP_REFERENCE,
      label: 'Cabeçalho do Documento Contábil (BKPF)',
      targetQualifier: 'GrpDocHeader',
      position: 10 },
    { id: 'FacetPartidasDoc',
      purpose: #STANDARD,
      type: #LINEITEM_REFERENCE,
      label: 'Partidas do Documento (Fornecedores / Razão Especial / Contrapartida)',
      targetElement: '_Itens',
      position: 20 }
  ]

  @UI.lineItem: [{ position: 10, importance: #HIGH }]
  @UI.fieldGroup: [{ qualifier: 'GrpDocHeader', position: 10 }]
  docseq;

  @UI.lineItem: [{ position: 20, importance: #HIGH }]
  @UI.fieldGroup: [{ qualifier: 'GrpDocHeader', position: 20 }]
  ztpmov;

  @UI.lineItem: [{ position: 30, importance: #HIGH, criticality: 'criticidade_status' }]
  @UI.fieldGroup: [{ qualifier: 'GrpDocHeader', position: 30, criticality: 'criticidade_status' }]
  status_texto;

  @UI.hidden: true
  criticidade_status;

  @UI.lineItem: [{ position: 40, importance: #HIGH }]
  @UI.fieldGroup: [{ qualifier: 'GrpDocHeader', position: 40 }]
  belnr;

  @UI.lineItem: [{ position: 50, importance: #MEDIUM }]
  @UI.fieldGroup: [{ qualifier: 'GrpDocHeader', position: 50 }]
  gjahr;

  @UI.lineItem: [{ position: 60, importance: #HIGH }]
  @UI.fieldGroup: [{ qualifier: 'GrpDocHeader', position: 60 }]
  bukrs;

  @UI.lineItem: [{ position: 70, importance: #MEDIUM }]
  @UI.fieldGroup: [{ qualifier: 'GrpDocHeader', position: 70 }]
  bldat;

  @UI.lineItem: [{ position: 80, importance: #MEDIUM }]
  @UI.fieldGroup: [{ qualifier: 'GrpDocHeader', position: 80 }]
  budat;

  @UI.lineItem: [{ position: 90, importance: #HIGH }]
  @UI.fieldGroup: [{ qualifier: 'GrpDocHeader', position: 90 }]
  xblnr;

  @UI.lineItem: [{ position: 100, importance: #MEDIUM }]
  @UI.fieldGroup: [{ qualifier: 'GrpDocHeader', position: 100 }]
  bktxt;

  @UI.lineItem: [{ position: 110, importance: #HIGH }]
  @UI.fieldGroup: [{ qualifier: 'GrpDocHeader', position: 110 }]
  total_debito;

  @UI.lineItem: [{ position: 120, importance: #HIGH }]
  @UI.fieldGroup: [{ qualifier: 'GrpDocHeader', position: 120 }]
  total_credito;

  @UI.lineItem: [{ position: 130, importance: #HIGH }]
  @UI.fieldGroup: [{ qualifier: 'GrpDocHeader', position: 130 }]
  mensagem;
}
```

---

### 🚀 Código Limpo (Sem Comentários - Para Copiar e Colar)

```abap
@Metadata.layer: #CORE
@UI: {
  headerInfo: {
    typeName: 'Documento da Carga',
    typeNamePlural: 'Documentos da Carga',
    title: { type: #STANDARD, value: 'docseq' },
    description: { type: #STANDARD, value: 'ztpmov' }
  },
  presentationVariant: [{
    sortOrder: [{ by: 'docseq', direction: #ASC }],
    visualizations: [{ type: #AS_LINEITEM }]
  }]
}
annotate entity ZC_FI_TAX_DOC with
{
  @UI.facet: [
    { id: 'FacetCabecalhoDoc',
      purpose: #STANDARD,
      type: #FIELDGROUP_REFERENCE,
      label: 'Cabeçalho do Documento Contábil (BKPF)',
      targetQualifier: 'GrpDocHeader',
      position: 10 },
    { id: 'FacetPartidasDoc',
      purpose: #STANDARD,
      type: #LINEITEM_REFERENCE,
      label: 'Partidas do Documento (Fornecedores / Razão Especial / Contrapartida)',
      targetElement: '_Itens',
      position: 20 }
  ]

  @UI.lineItem: [{ position: 10, importance: #HIGH }]
  @UI.fieldGroup: [{ qualifier: 'GrpDocHeader', position: 10 }]
  docseq;

  @UI.lineItem: [{ position: 20, importance: #HIGH }]
  @UI.fieldGroup: [{ qualifier: 'GrpDocHeader', position: 20 }]
  ztpmov;

  @UI.lineItem: [{ position: 30, importance: #HIGH, criticality: 'criticidade_status' }]
  @UI.fieldGroup: [{ qualifier: 'GrpDocHeader', position: 30, criticality: 'criticidade_status' }]
  status_texto;

  @UI.hidden: true
  criticidade_status;

  @UI.lineItem: [{ position: 40, importance: #HIGH }]
  @UI.fieldGroup: [{ qualifier: 'GrpDocHeader', position: 40 }]
  belnr;

  @UI.lineItem: [{ position: 50, importance: #MEDIUM }]
  @UI.fieldGroup: [{ qualifier: 'GrpDocHeader', position: 50 }]
  gjahr;

  @UI.lineItem: [{ position: 60, importance: #HIGH }]
  @UI.fieldGroup: [{ qualifier: 'GrpDocHeader', position: 60 }]
  bukrs;

  @UI.lineItem: [{ position: 70, importance: #MEDIUM }]
  @UI.fieldGroup: [{ qualifier: 'GrpDocHeader', position: 70 }]
  bldat;

  @UI.lineItem: [{ position: 80, importance: #MEDIUM }]
  @UI.fieldGroup: [{ qualifier: 'GrpDocHeader', position: 80 }]
  budat;

  @UI.lineItem: [{ position: 90, importance: #HIGH }]
  @UI.fieldGroup: [{ qualifier: 'GrpDocHeader', position: 90 }]
  xblnr;

  @UI.lineItem: [{ position: 100, importance: #MEDIUM }]
  @UI.fieldGroup: [{ qualifier: 'GrpDocHeader', position: 100 }]
  bktxt;

  @UI.lineItem: [{ position: 110, importance: #HIGH }]
  @UI.fieldGroup: [{ qualifier: 'GrpDocHeader', position: 110 }]
  total_debito;

  @UI.lineItem: [{ position: 120, importance: #HIGH }]
  @UI.fieldGroup: [{ qualifier: 'GrpDocHeader', position: 120 }]
  total_credito;

  @UI.lineItem: [{ position: 130, importance: #HIGH }]
  @UI.fieldGroup: [{ qualifier: 'GrpDocHeader', position: 130 }]
  mensagem;
}
```
