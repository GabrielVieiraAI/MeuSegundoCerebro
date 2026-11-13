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
objeto: "ZC_FI_TAX_ITEM (MDE)"
camada: "2 - Modelagem CDS"
data: 2026-11-11
aliases:
  - "ZC_FI_TAX_ITEM (MDE)"
---

# 📦 `ZC_FI_TAX_ITEM (MDE)` (Metadata Extension — Partidas do Documento)

⬅️ [[01 - DEL-COM-165 - Arquitetura App 1 (Carga Massiva de Taxas)|Voltar para Arquitetura App 1]] | 🎨 [[01 - DEL-COM-165 - Arquitetura Técnica App 1 (Carga Massiva).excalidraw|Ver no Diagrama Excalidraw App 1]]

---

## 📌 Visão Geral do Objeto

O Metadata Extension `ZC_FI_TAX_ITEM` define as colunas da tabela de **Partidas Contábeis** (nível 3) exibida ao abrir um documento específico dentro do monitor de cargas.

---

## ⚖️ Regras de Negócio Aplicadas

1. **Conferência Completa das Colunas I..O e Campos Derivados:** Exibe lado a lado o número do item (`item_num`), Fornecedor (`lifnr`), Conta do Razão (`hkont` para `DS-ATR`), indicador D/C (`shkzg`), Razão Especial (`umskz`), Débito (`wrsol`), Crédito (`wrhab`), Data Base (`zfbdt`), Condição de Pagamento (`zterm`), Bloqueio (`zlspr`), Texto (`sgtxt`), Atribuição (`zuonr`) e o indicador `gerado_auto`.

---

## 🛠️ Passo a Passo da Criação do Objeto

1. **No Eclipse ADT:** Clique com o botão direito sobre a CDS View [[28 - ZC_FI_TAX_ITEM (CDS)|ZC_FI_TAX_ITEM]] -> **`New Metadata Extension`**.
2. Preencha as propriedades:
   - **Name:** `ZC_FI_TAX_ITEM`
   - **Description:** `DEL-COM-165: UI Annotations Partidas do Documento`
3. Selecione a Request (TR) de desenvolvimento e conclua o assistente.
4. Substitua o código gerado pelo snippet abaixo e ative com **`Ctrl + F3`**.

---

## 💻 Snippet de Código

### 📝 Código Comentado (Para Estudo e Referência)

```abap
@Metadata.layer: #CORE
@UI: {
  headerInfo: {
    typeName: 'Partida do Documento',
    typeNamePlural: 'Partidas do Documento',
    title: { type: #STANDARD, value: 'item_num' },
    description: { type: #STANDARD, value: 'sgtxt' }
  },
  presentationVariant: [{
    sortOrder: [{ by: 'item_num', direction: #ASC }],
    visualizations: [{ type: #AS_LINEITEM }]
  }]
}
annotate entity ZC_FI_TAX_ITEM with
{
  @UI.lineItem: [{ position: 10, importance: #HIGH }]
  item_num;

  @UI.lineItem: [{ position: 20, importance: #HIGH }]
  lifnr;

  @UI.lineItem: [{ position: 30, importance: #HIGH }]
  hkont;

  @UI.lineItem: [{ position: 40, importance: #HIGH }]
  shkzg;

  @UI.lineItem: [{ position: 50, importance: #HIGH }]
  umskz;

  @UI.lineItem: [{ position: 60, importance: #HIGH }]
  wrsol;

  @UI.lineItem: [{ position: 70, importance: #HIGH }]
  wrhab;

  @UI.lineItem: [{ position: 80, importance: #MEDIUM }]
  zfbdt;

  @UI.lineItem: [{ position: 90, importance: #MEDIUM }]
  zterm;

  @UI.lineItem: [{ position: 100, importance: #HIGH }]
  zlspr;

  @UI.lineItem: [{ position: 110, importance: #HIGH }]
  sgtxt;

  @UI.lineItem: [{ position: 120, importance: #MEDIUM }]
  zuonr;

  @UI.lineItem: [{ position: 130, importance: #LOW }]
  gerado_auto;
}
```

---

### 🚀 Código Limpo (Sem Comentários - Para Copiar e Colar)

```abap
@Metadata.layer: #CORE
@UI: {
  headerInfo: {
    typeName: 'Partida do Documento',
    typeNamePlural: 'Partidas do Documento',
    title: { type: #STANDARD, value: 'item_num' },
    description: { type: #STANDARD, value: 'sgtxt' }
  },
  presentationVariant: [{
    sortOrder: [{ by: 'item_num', direction: #ASC }],
    visualizations: [{ type: #AS_LINEITEM }]
  }]
}
annotate entity ZC_FI_TAX_ITEM with
{
  @UI.lineItem: [{ position: 10, importance: #HIGH }]
  item_num;

  @UI.lineItem: [{ position: 20, importance: #HIGH }]
  lifnr;

  @UI.lineItem: [{ position: 30, importance: #HIGH }]
  hkont;

  @UI.lineItem: [{ position: 40, importance: #HIGH }]
  shkzg;

  @UI.lineItem: [{ position: 50, importance: #HIGH }]
  umskz;

  @UI.lineItem: [{ position: 60, importance: #HIGH }]
  wrsol;

  @UI.lineItem: [{ position: 70, importance: #HIGH }]
  wrhab;

  @UI.lineItem: [{ position: 80, importance: #MEDIUM }]
  zfbdt;

  @UI.lineItem: [{ position: 90, importance: #MEDIUM }]
  zterm;

  @UI.lineItem: [{ position: 100, importance: #HIGH }]
  zlspr;

  @UI.lineItem: [{ position: 110, importance: #HIGH }]
  sgtxt;

  @UI.lineItem: [{ position: 120, importance: #MEDIUM }]
  zuonr;

  @UI.lineItem: [{ position: 130, importance: #LOW }]
  gerado_auto;
}
```
