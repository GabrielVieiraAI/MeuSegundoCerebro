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
objeto: "ZC_FI_TAX_ITEM (CDS)"
camada: "2 - Modelagem CDS"
data: 2026-11-11
aliases:
  - "ZC_FI_TAX_ITEM (CDS)"
  - "ZC_FI_TAX_ITEM"
---

# 📦 `ZC_FI_TAX_ITEM (CDS)` (CDS Grandchild Projection View — Partidas do Documento)

⬅️ [[01 - DEL-COM-165 - Arquitetura App 1 (Carga Massiva de Taxas)|Voltar para Arquitetura App 1]] | 🎨 [[01 - DEL-COM-165 - Arquitetura Técnica App 1 (Carga Massiva).excalidraw|Ver no Diagrama Excalidraw App 1]]

---

## 📌 Visão Geral do Objeto

A CDS View `ZC_FI_TAX_ITEM` projeta a entidade neta [[22 - ZI_FI_TAX_ITEM|ZI_FI_TAX_ITEM]] (nível 3 — Partidas Individuais do Documento), redirecionando o vínculo pai para [[27 - ZC_FI_TAX_DOC (CDS)|ZC_FI_TAX_DOC]] e a associação ancestral para [[26 - ZC_FI_TAX_CARGA (CDS)|ZC_FI_TAX_CARGA]].

---

## ⚖️ Regras de Negócio Aplicadas

1. **Conferência Detalhada de Partidas:** Permite ao operador financeiro clicar em um documento do lote e visualizar todas as suas partidas (incluindo o código de Razão Especial `umskz` aplicado, o bloqueio de pagamento `zlspr` e a partida de contrapartida `2205010002` gerada automaticamente para `DS-ATR`).

---

## 🛠️ Passo a Passo da Criação do Objeto

1. **No Eclipse ADT:** Conecte-se ao sistema e acesse o pacote `ZFI_CARGA_TAXAS`.
2. Clique com o botão direito -> **`New`** -> **`Data Definition`**.
3. Preencha as propriedades:
   - **Name:** `ZC_FI_TAX_ITEM`
   - **Description:** `DEL-COM-165: Projection Grandchild Partidas do Documento`
   - **Referenced Object:** `ZI_FI_TAX_ITEM`
4. Selecione o template **`Define Projection View`** e conclua o assistente.
5. Substitua o código gerado pelo snippet abaixo e ative com **`Ctrl + F3`**.

---

## 💻 Snippet de Código

### 📝 Código Comentado (Para Estudo e Referência)

```abap
@AccessControl.authorizationCheck: #NOT_REQUIRED
@EndUserText.label: 'DEL-COM-165: Partidas do Documento'
@Metadata.allowExtensions: true
define view entity ZC_FI_TAX_ITEM
  as projection on ZI_FI_TAX_ITEM
{
      @EndUserText.label: 'ID da Carga'
  key carga_id,

      @EndUserText.label: 'Nº Doc. na Carga'
  key docseq,

      @EndUserText.label: 'Item'
  key item_num,

      @EndUserText.label: 'Fornecedor / Cooperado (LIFNR)'
      lifnr,

      @EndUserText.label: 'Conta do Razão (HKONT)'
      hkont,

      @EndUserText.label: 'D/C'
      shkzg,

      @EndUserText.label: 'Razão Especial (UMSKZ)'
      umskz,

      @EndUserText.label: 'Moeda'
      waers,

      @EndUserText.label: 'Valor Débito (WRSOL)'
      @Semantics.amount.currencyCode: 'waers'
      wrsol,

      @EndUserText.label: 'Valor Crédito (WRHAB)'
      @Semantics.amount.currencyCode: 'waers'
      wrhab,

      @EndUserText.label: 'Data Base (ZFBDT)'
      zfbdt,

      @EndUserText.label: 'Cond. Pagamento (ZTERM)'
      zterm,

      @EndUserText.label: 'Bloq. Pagamento (ZLSPR)'
      zlspr,

      @EndUserText.label: 'Texto do Item (SGTXT)'
      sgtxt,

      @EndUserText.label: 'Atribuição / Contrato (ZUONR)'
      zuonr,

      @EndUserText.label: 'Gerado Automaticamente'
      gerado_auto,

      // Redirecionamento para o documento pai e carga raiz
      _Documento : redirected to parent ZC_FI_TAX_DOC,
      _Carga     : redirected to ZC_FI_TAX_CARGA
}
```

---

### 🚀 Código Limpo (Sem Comentários - Para Copiar e Colar)

```abap
@AccessControl.authorizationCheck: #NOT_REQUIRED
@EndUserText.label: 'DEL-COM-165: Partidas do Documento'
@Metadata.allowExtensions: true
define view entity ZC_FI_TAX_ITEM
  as projection on ZI_FI_TAX_ITEM
{
      @EndUserText.label: 'ID da Carga'
  key carga_id,

      @EndUserText.label: 'Nº Doc. na Carga'
  key docseq,

      @EndUserText.label: 'Item'
  key item_num,

      @EndUserText.label: 'Fornecedor / Cooperado (LIFNR)'
      lifnr,

      @EndUserText.label: 'Conta do Razão (HKONT)'
      hkont,

      @EndUserText.label: 'D/C'
      shkzg,

      @EndUserText.label: 'Razão Especial (UMSKZ)'
      umskz,

      @EndUserText.label: 'Moeda'
      waers,

      @EndUserText.label: 'Valor Débito (WRSOL)'
      @Semantics.amount.currencyCode: 'waers'
      wrsol,

      @EndUserText.label: 'Valor Crédito (WRHAB)'
      @Semantics.amount.currencyCode: 'waers'
      wrhab,

      @EndUserText.label: 'Data Base (ZFBDT)'
      zfbdt,

      @EndUserText.label: 'Cond. Pagamento (ZTERM)'
      zterm,

      @EndUserText.label: 'Bloq. Pagamento (ZLSPR)'
      zlspr,

      @EndUserText.label: 'Texto do Item (SGTXT)'
      sgtxt,

      @EndUserText.label: 'Atribuição / Contrato (ZUONR)'
      zuonr,

      @EndUserText.label: 'Gerado Automaticamente'
      gerado_auto,

      _Documento : redirected to parent ZC_FI_TAX_DOC,
      _Carga     : redirected to ZC_FI_TAX_CARGA
}
```
