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
objeto: "ZC_FI_TAX_CARGA (MDE)"
camada: "2 - Modelagem CDS"
data: 2026-11-11
aliases:
  - "ZC_FI_TAX_CARGA (MDE)"
---

# 📦 `ZC_FI_TAX_CARGA (MDE)` (Metadata Extension — Monitor de Lotes de Carga)

⬅️ [[01 - DEL-COM-165 - Arquitetura App 1 (Carga Massiva de Taxas)|Voltar para Arquitetura App 1]] | 🎨 [[01 - DEL-COM-165 - Arquitetura Técnica App 1 (Carga Massiva).excalidraw|Ver no Diagrama Excalidraw App 1]]

---

## 📌 Visão Geral do Objeto

O Metadata Extension `ZC_FI_TAX_CARGA` define o layout do **List Report** (tela inicial do monitor de lotes) e da **Object Page de 1º nível** (detalhes do lote e tabela de documentos filhos `_Documentos`) para o **Aplicativo 1** ([[35 - taxascarga (App Fiori)|taxascarga]]).

---

## ⚖️ Regras de Negócio Aplicadas

1. **Botões na Barra de Ferramentas:**
   - Expõe o botão de instância **Contabilizar Lote** (`dataAction: 'lancar'`) tanto na tabela do List Report quanto no cabeçalho da Object Page (`@UI.identification`).
   - Os botões de upload (**Carregar Planilha**) e download (**Baixar Modelo Excel**) são adicionados via *Controller Extension* no `manifest.json` do app Fiori [[35 - taxascarga (App Fiori)|taxascarga]] para manipular o arquivo `.xlsx` nativamente no navegador.
2. **Ordenação Decrescente por ID da Carga:** Exibe sempre os lotes mais recentes no topo da lista (`sortOrder: [{ by: 'carga_id', direction: #DESC }]`).

---

## 🛠️ Passo a Passo da Criação do Objeto

1. **No Eclipse ADT:** Clique com o botão direito sobre a CDS View [[26 - ZC_FI_TAX_CARGA (CDS)|ZC_FI_TAX_CARGA]] -> **`New Metadata Extension`**.
2. Preencha as propriedades:
   - **Name:** `ZC_FI_TAX_CARGA`
   - **Description:** `DEL-COM-165: UI Annotations Monitor de Lotes de Carga`
3. Selecione a Request (TR) de desenvolvimento e conclua o assistente.
4. Substitua o código gerado pelo snippet abaixo e ative com **`Ctrl + F3`**.

---

## 💻 Snippet de Código

### 📝 Código Comentado (Para Estudo e Referência)

```abap
@Metadata.layer: #CORE
@UI: {
  headerInfo: {
    typeName: 'Lote de Carga',
    typeNamePlural: 'Lotes de Carga de Taxas',
    title: { type: #STANDARD, value: 'carga_id' },
    description: { type: #STANDARD, value: 'nome_arquivo' }
  },
  presentationVariant: [{
    sortOrder: [{ by: 'carga_id', direction: #DESC }],
    visualizations: [{ type: #AS_LINEITEM }]
  }]
}
annotate entity ZC_FI_TAX_CARGA with
{
  @UI.facet: [
    { id: 'HeaderStatus',
      purpose: #HEADER,
      type: #DATAPOINT_REFERENCE,
      targetQualifier: 'DpStatus',
      position: 10 },
    { id: 'HeaderDebito',
      purpose: #HEADER,
      type: #DATAPOINT_REFERENCE,
      targetQualifier: 'DpDebito',
      position: 20 },
    { id: 'FacetResumo',
      purpose: #STANDARD,
      type: #FIELDGROUP_REFERENCE,
      label: 'Resumo do Lote e Totais',
      targetQualifier: 'GrpResumo',
      position: 10 },
    { id: 'FacetDocumentos',
      purpose: #STANDARD,
      type: #LINEITEM_REFERENCE,
      label: 'Documentos Contábeis da Planilha (Por DOCSEQ)',
      targetElement: '_Documentos',
      position: 20 }
  ]

  @UI: {
    lineItem: [
      { position: 10, importance: #HIGH },
      { type: #FOR_ACTION, dataAction: 'lancar', label: 'Contabilizar Lote', position: 10 }
    ],
    selectionField: [{ position: 10 }],
    fieldGroup: [{ qualifier: 'GrpResumo', position: 10 }]
  }
  carga_id;

  @UI: {
    lineItem: [{ position: 20, importance: #HIGH }],
    fieldGroup: [{ qualifier: 'GrpResumo', position: 20 }]
  }
  nome_arquivo;

  @UI.selectionField: [{ position: 20 }]
  status_geral;

  @UI: {
    lineItem: [{ position: 30, importance: #HIGH, criticality: 'criticidade_status' }],
     identification: [{ type: #FOR_ACTION, dataAction: 'lancar', label: 'Contabilizar Lote', position: 10 }],
    dataPoint: { qualifier: 'DpStatus', title: 'Status do Lote', criticality: 'criticidade_status' },
    fieldGroup: [{ qualifier: 'GrpResumo', position: 30, criticality: 'criticidade_status' }]
  }
  status_texto;

  @UI.hidden: true
  criticidade_status;

  @UI: {
    lineItem: [{ position: 40, importance: #HIGH }],
    fieldGroup: [{ qualifier: 'GrpResumo', position: 40 }]
  }
  qtd_docs;

  @UI: {
    lineItem: [{ position: 50, importance: #HIGH }],
    fieldGroup: [{ qualifier: 'GrpResumo', position: 50 }]
  }
  qtd_validos;

  @UI: {
    lineItem: [{ position: 60, importance: #HIGH }],
    fieldGroup: [{ qualifier: 'GrpResumo', position: 60 }]
  }
  qtd_erros;

  @UI: {
    lineItem: [{ position: 70, importance: #HIGH }],
    fieldGroup: [{ qualifier: 'GrpResumo', position: 70 }]
  }
  qtd_lancados;

  @UI: {
    lineItem: [{ position: 80, importance: #HIGH }],
    dataPoint: { qualifier: 'DpDebito', title: 'Total Débito do Lote' },
    fieldGroup: [{ qualifier: 'GrpResumo', position: 80 }]
  }
  total_debito;

  @UI: {
    lineItem: [{ position: 90, importance: #HIGH }],
    fieldGroup: [{ qualifier: 'GrpResumo', position: 90 }]
  }
  total_credito;

  @UI: {
    lineItem: [{ position: 100, importance: #MEDIUM }],
    selectionField: [{ position: 30 }],
    fieldGroup: [{ qualifier: 'GrpResumo', position: 100 }]
  }
  criado_por;

  @UI: {
    lineItem: [{ position: 110, importance: #MEDIUM }],
    fieldGroup: [{ qualifier: 'GrpResumo', position: 110 }]
  }
  criado_em;
}
```

---

### 🚀 Código Limpo (Sem Comentários - Para Copiar e Colar)

```abap
@Metadata.layer: #CORE
@UI: {
  headerInfo: {
    typeName: 'Lote de Carga',
    typeNamePlural: 'Lotes de Carga de Taxas',
    title: { type: #STANDARD, value: 'carga_id' },
    description: { type: #STANDARD, value: 'nome_arquivo' }
  },
  presentationVariant: [{
    sortOrder: [{ by: 'carga_id', direction: #DESC }],
    visualizations: [{ type: #AS_LINEITEM }]
  }]
}
annotate entity ZC_FI_TAX_CARGA with
{
  @UI.facet: [
    { id: 'HeaderStatus',
      purpose: #HEADER,
      type: #DATAPOINT_REFERENCE,
      targetQualifier: 'DpStatus',
      position: 10 },
    { id: 'HeaderDebito',
      purpose: #HEADER,
      type: #DATAPOINT_REFERENCE,
      targetQualifier: 'DpDebito',
      position: 20 },
    { id: 'FacetResumo',
      purpose: #STANDARD,
      type: #FIELDGROUP_REFERENCE,
      label: 'Resumo do Lote e Totais',
      targetQualifier: 'GrpResumo',
      position: 10 },
    { id: 'FacetDocumentos',
      purpose: #STANDARD,
      type: #LINEITEM_REFERENCE,
      label: 'Documentos Contábeis da Planilha (Por DOCSEQ)',
      targetElement: '_Documentos',
      position: 20 }
  ]

  @UI: {
    lineItem: [
      { position: 10, importance: #HIGH },
      { type: #FOR_ACTION, dataAction: 'lancar', label: 'Contabilizar Lote', position: 10 }
    ],
    selectionField: [{ position: 10 }],
    fieldGroup: [{ qualifier: 'GrpResumo', position: 10 }]
  }
  carga_id;

  @UI: {
    lineItem: [{ position: 20, importance: #HIGH }],
    fieldGroup: [{ qualifier: 'GrpResumo', position: 20 }]
  }
  nome_arquivo;

  @UI.selectionField: [{ position: 20 }]
  status_geral;

  @UI: {
    lineItem: [{ position: 30, importance: #HIGH, criticality: 'criticidade_status' }],
    identification: [{ type: #FOR_ACTION, dataAction: 'lancar', label: 'Contabilizar Lote', position: 10 }],
    dataPoint: { qualifier: 'DpStatus', title: 'Status do Lote', criticality: 'criticidade_status' },
    fieldGroup: [{ qualifier: 'GrpResumo', position: 30, criticality: 'criticidade_status' }]
  }
  status_texto;

  @UI.hidden: true
  criticidade_status;

  @UI: {
    lineItem: [{ position: 40, importance: #HIGH }],
    fieldGroup: [{ qualifier: 'GrpResumo', position: 40 }]
  }
  qtd_docs;

  @UI: {
    lineItem: [{ position: 50, importance: #HIGH }],
    fieldGroup: [{ qualifier: 'GrpResumo', position: 50 }]
  }
  qtd_validos;

  @UI: {
    lineItem: [{ position: 60, importance: #HIGH }],
    fieldGroup: [{ qualifier: 'GrpResumo', position: 60 }]
  }
  qtd_erros;

  @UI: {
    lineItem: [{ position: 70, importance: #HIGH }],
    fieldGroup: [{ qualifier: 'GrpResumo', position: 70 }]
  }
  qtd_lancados;

  @UI: {
    lineItem: [{ position: 80, importance: #HIGH }],
    dataPoint: { qualifier: 'DpDebito', title: 'Total Débito do Lote' },
    fieldGroup: [{ qualifier: 'GrpResumo', position: 80 }]
  }
  total_debito;

  @UI: {
    lineItem: [{ position: 90, importance: #HIGH }],
    fieldGroup: [{ qualifier: 'GrpResumo', position: 90 }]
  }
  total_credito;

  @UI: {
    lineItem: [{ position: 100, importance: #MEDIUM }],
    selectionField: [{ position: 30 }],
    fieldGroup: [{ qualifier: 'GrpResumo', position: 100 }]
  }
  criado_por;

  @UI: {
    lineItem: [{ position: 110, importance: #MEDIUM }],
    fieldGroup: [{ qualifier: 'GrpResumo', position: 110 }]
  }
  criado_em;
}
```
