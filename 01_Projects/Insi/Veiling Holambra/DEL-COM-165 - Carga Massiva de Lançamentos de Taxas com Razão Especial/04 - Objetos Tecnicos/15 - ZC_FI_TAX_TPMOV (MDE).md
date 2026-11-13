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
objeto: "ZC_FI_TAX_TPMOV (MDE)"
camada: "2 - Modelagem CDS"
data: 2026-11-11
aliases:
  - "ZC_FI_TAX_TPMOV (MDE)"
---

# 📦 `ZC_FI_TAX_TPMOV (MDE)` (Metadata Extension — Tipos de Movimento)

⬅️ [[02 - DEL-COM-165 - Arquitetura App 2 (Tipos de Movimento)|Voltar para Arquitetura App 2]] | 🎨 [[02 - DEL-COM-165 - Arquitetura Técnica App 2 (Tipos de Movimento).excalidraw|Ver no Diagrama Excalidraw App 2]]

---

## 📌 Visão Geral do Objeto

O Metadata Extension `ZC_FI_TAX_TPMOV` define toda a estrutura visual do **Aplicativo 2** ([[36 - taxastipomov (App Fiori)|taxastipomov]]) no SAP Fiori Elements: filtros de pesquisa (`@UI.selectionField`), colunas da tabela principal (`@UI.lineItem`) e seções organizadas da página de detalhes (`@UI.facet` e `@UI.fieldGroup`).

---

## ⚖️ Regras de Negócio Aplicadas

1. **Agrupamento Lógico na Object Page:** Divide os campos em 3 seções claras para o usuário chave:
   - **Identificação e Vigência:** Código (`ztpmov`), Descrição, Ativo e Datas de Validade.
   - **Parametrização Contábil e Razão Especial:** Razão Especial Débito (`umskz_deb`), Razão Especial Crédito (`umskz_cred`), Conta Contrapartida (`hkont_contrapartida`), Tipo de Documento (`blart`), Bloqueio de Pagamento (`zlspr`) e flags de obrigatoriedade (`zfbdt_obrig`, `zuonr_obrig`).
   - **Dados Administrativos:** Usuário e data/hora de criação e última alteração.

---

## 🛠️ Passo a Passo da Criação do Objeto

1. **No Eclipse ADT:** Clique com o botão direito sobre a CDS View [[14 - ZC_FI_TAX_TPMOV (CDS)|ZC_FI_TAX_TPMOV]] -> **`New Metadata Extension`**.
2. Preencha as propriedades:
   - **Name:** `ZC_FI_TAX_TPMOV`
   - **Description:** `DEL-COM-165: UI Annotations Tipos de Movimento`
3. Selecione a Request (TR) de desenvolvimento e conclua o assistente.
4. Substitua o código gerado pelo snippet abaixo e ative com **`Ctrl + F3`**.

---

## 💻 Snippet de Código

### 📝 Código Comentado (Para Estudo e Referência)

```abap
@Metadata.layer: #CORE
@UI: {
  headerInfo: {
    typeName: 'Tipo de Movimento',
    typeNamePlural: 'Tipos de Movimento',
    title: { type: #STANDARD, value: 'ztpmov' },
    description: { type: #STANDARD, value: 'descricao' }
  },
  presentationVariant: [{
    sortOrder: [{ by: 'ztpmov', direction: #ASC }],
    visualizations: [{ type: #AS_LINEITEM }]
  }]
}
annotate entity ZC_FI_TAX_TPMOV with
{
  // Definição das seções (Facets) na Object Page
  @UI.facet: [
    { id: 'FacetIdentificacao',
      purpose: #STANDARD,
      type: #FIELDGROUP_REFERENCE,
      label: 'Identificação e Vigência',
      targetQualifier: 'GrpIdentificacao',
      position: 10 },
    { id: 'FacetContabil',
      purpose: #STANDARD,
      type: #FIELDGROUP_REFERENCE,
      label: 'Regras Contábeis e Razão Especial',
      targetQualifier: 'GrpContabil',
      position: 20 },
    { id: 'FacetAuditoria',
      purpose: #STANDARD,
      type: #FIELDGROUP_REFERENCE,
      label: 'Auditoria',
      targetQualifier: 'GrpAuditoria',
      position: 30 }
  ]

  @UI.lineItem: [{ position: 10, importance: #HIGH }]
  @UI.selectionField: [{ position: 10 }]
  @UI.fieldGroup: [{ qualifier: 'GrpIdentificacao', position: 10 }]
  ztpmov;

  @UI.lineItem: [{ position: 20, importance: #HIGH }]
  @UI.fieldGroup: [{ qualifier: 'GrpIdentificacao', position: 20 }]
  descricao;

  @UI.lineItem: [{ position: 30, importance: #HIGH }]
  @UI.fieldGroup: [{ qualifier: 'GrpContabil', position: 10 }]
  umskz_deb;

  @UI.lineItem: [{ position: 40, importance: #HIGH }]
  @UI.selectionField: [{ position: 20 }]
  @UI.fieldGroup: [{ qualifier: 'GrpContabil', position: 20 }]
  umskz_cred;

  @UI.lineItem: [{ position: 50, importance: #MEDIUM }]
  @UI.fieldGroup: [{ qualifier: 'GrpContabil', position: 30 }]
  hkont_contrapartida;

  @UI.lineItem: [{ position: 60, importance: #MEDIUM }]
  @UI.fieldGroup: [{ qualifier: 'GrpContabil', position: 40 }]
  blart;

  @UI.lineItem: [{ position: 70, importance: #MEDIUM }]
  @UI.fieldGroup: [{ qualifier: 'GrpContabil', position: 50 }]
  zlspr;

  @UI.lineItem: [{ position: 80, importance: #MEDIUM }]
  @UI.fieldGroup: [{ qualifier: 'GrpContabil', position: 60 }]
  zfbdt_obrig;

  @UI.lineItem: [{ position: 90, importance: #MEDIUM }]
  @UI.fieldGroup: [{ qualifier: 'GrpContabil', position: 70 }]
  zuonr_obrig;

  @UI.lineItem: [{ position: 100, importance: #HIGH }]
  @UI.selectionField: [{ position: 30 }]
  @UI.fieldGroup: [{ qualifier: 'GrpIdentificacao', position: 30 }]
  ativo;

  @UI.lineItem: [{ position: 110, importance: #LOW }]
  @UI.fieldGroup: [{ qualifier: 'GrpIdentificacao', position: 40 }]
  valido_de;

  @UI.lineItem: [{ position: 120, importance: #LOW }]
  @UI.fieldGroup: [{ qualifier: 'GrpIdentificacao', position: 50 }]
  valido_ate;

  @UI.fieldGroup: [{ qualifier: 'GrpAuditoria', position: 10 }]
  criado_por;

  @UI.fieldGroup: [{ qualifier: 'GrpAuditoria', position: 20 }]
  criado_em;

  @UI.fieldGroup: [{ qualifier: 'GrpAuditoria', position: 30 }]
  alterado_por;

  @UI.fieldGroup: [{ qualifier: 'GrpAuditoria', position: 40 }]
  alterado_em;
}
```

---

### 🚀 Código Limpo (Sem Comentários - Para Copiar e Colar)

```abap
@Metadata.layer: #CORE
@UI: {
  headerInfo: {
    typeName: 'Tipo de Movimento',
    typeNamePlural: 'Tipos de Movimento',
    title: { type: #STANDARD, value: 'ztpmov' },
    description: { type: #STANDARD, value: 'descricao' }
  },
  presentationVariant: [{
    sortOrder: [{ by: 'ztpmov', direction: #ASC }],
    visualizations: [{ type: #AS_LINEITEM }]
  }]
}
annotate entity ZC_FI_TAX_TPMOV with
{
  @UI.facet: [
    { id: 'FacetIdentificacao',
      purpose: #STANDARD,
      type: #FIELDGROUP_REFERENCE,
      label: 'Identificação e Vigência',
      targetQualifier: 'GrpIdentificacao',
      position: 10 },
    { id: 'FacetContabil',
      purpose: #STANDARD,
      type: #FIELDGROUP_REFERENCE,
      label: 'Regras Contábeis e Razão Especial',
      targetQualifier: 'GrpContabil',
      position: 20 },
    { id: 'FacetAuditoria',
      purpose: #STANDARD,
      type: #FIELDGROUP_REFERENCE,
      label: 'Auditoria',
      targetQualifier: 'GrpAuditoria',
      position: 30 }
  ]

  @UI.lineItem: [{ position: 10, importance: #HIGH }]
  @UI.selectionField: [{ position: 10 }]
  @UI.fieldGroup: [{ qualifier: 'GrpIdentificacao', position: 10 }]
  ztpmov;

  @UI.lineItem: [{ position: 20, importance: #HIGH }]
  @UI.fieldGroup: [{ qualifier: 'GrpIdentificacao', position: 20 }]
  descricao;

  @UI.lineItem: [{ position: 30, importance: #HIGH }]
  @UI.fieldGroup: [{ qualifier: 'GrpContabil', position: 10 }]
  umskz_deb;

  @UI.lineItem: [{ position: 40, importance: #HIGH }]
  @UI.selectionField: [{ position: 20 }]
  @UI.fieldGroup: [{ qualifier: 'GrpContabil', position: 20 }]
  umskz_cred;

  @UI.lineItem: [{ position: 50, importance: #MEDIUM }]
  @UI.fieldGroup: [{ qualifier: 'GrpContabil', position: 30 }]
  hkont_contrapartida;

  @UI.lineItem: [{ position: 60, importance: #MEDIUM }]
  @UI.fieldGroup: [{ qualifier: 'GrpContabil', position: 40 }]
  blart;

  @UI.lineItem: [{ position: 70, importance: #MEDIUM }]
  @UI.fieldGroup: [{ qualifier: 'GrpContabil', position: 50 }]
  zlspr;

  @UI.lineItem: [{ position: 80, importance: #MEDIUM }]
  @UI.fieldGroup: [{ qualifier: 'GrpContabil', position: 60 }]
  zfbdt_obrig;

  @UI.lineItem: [{ position: 90, importance: #MEDIUM }]
  @UI.fieldGroup: [{ qualifier: 'GrpContabil', position: 70 }]
  zuonr_obrig;

  @UI.lineItem: [{ position: 100, importance: #HIGH }]
  @UI.selectionField: [{ position: 30 }]
  @UI.fieldGroup: [{ qualifier: 'GrpIdentificacao', position: 30 }]
  ativo;

  @UI.lineItem: [{ position: 110, importance: #LOW }]
  @UI.fieldGroup: [{ qualifier: 'GrpIdentificacao', position: 40 }]
  valido_de;

  @UI.lineItem: [{ position: 120, importance: #LOW }]
  @UI.fieldGroup: [{ qualifier: 'GrpIdentificacao', position: 50 }]
  valido_ate;

  @UI.fieldGroup: [{ qualifier: 'GrpAuditoria', position: 10 }]
  criado_por;

  @UI.fieldGroup: [{ qualifier: 'GrpAuditoria', position: 20 }]
  criado_em;

  @UI.fieldGroup: [{ qualifier: 'GrpAuditoria', position: 30 }]
  alterado_por;

  @UI.fieldGroup: [{ qualifier: 'GrpAuditoria', position: 40 }]
  alterado_em;
}
```
