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
objeto: "ZI_FI_TAX_ITEM"
camada: "2 - Modelagem CDS"
data: 2026-11-11
aliases:
  - "ZI_FI_TAX_ITEM"
---

# 📦 `ZI_FI_TAX_ITEM` (CDS Grandchild View Entity — Partidas do Documento)

⬅️ [[01 - DEL-COM-165 - Arquitetura App 1 (Carga Massiva de Taxas)|Voltar para Arquitetura App 1]] | 🎨 [[01 - DEL-COM-165 - Arquitetura Técnica App 1 (Carga Massiva).excalidraw|Ver no Diagrama Excalidraw App 1]]

---

## 📌 Visão Geral do Objeto

A CDS View `ZI_FI_TAX_ITEM` representa o **nível 3 (Entidade Neta — Partidas Contábeis)** na hierarquia do Aplicativo 1. Construída sobre a tabela [[05 - ZTFI_TAX_ITEM|ZTFI_TAX_ITEM]], ela vincula cada partida ao seu documento pai ([[21 - ZI_FI_TAX_DOC|ZI_FI_TAX_DOC]]) via `association to parent ZI_FI_TAX_DOC as _Documento` e ao ancestral raiz ([[19 - ZI_FI_TAX_CARGA (CDS)|ZI_FI_TAX_CARGA]]) via `association [1..1] to ZI_FI_TAX_CARGA as _Carga`.

---

## ⚖️ Regras de Negócio Aplicadas

1. **Transparência das Regras Derivadas:** Expõe para a página de detalhes do documento no Fiori Elements tanto os campos informados na planilha (`lifnr`, `wrsol`, `wrhab`, `zfbdt`, `zterm`, `sgtxt`, `zuonr`) quanto os campos calculados automaticamente pelo motor de regras (`hkont` da contrapartida `2205010002`, `shkzg`, `umskz` do Razão Especial, `zlspr` do Bloqueio de Pagamento `T` e flag `gerado_auto`).

---

## 🛠️ Passo a Passo da Criação do Objeto

1. **No Eclipse ADT:** Conecte-se ao sistema e acesse o pacote `ZFI_CARGA_TAXAS`.
2. Clique com o botão direito -> **`New`** -> **`Data Definition`**.
3. Preencha as propriedades:
   - **Name:** `ZI_FI_TAX_ITEM`
   - **Description:** `DEL-COM-165: CDS Grandchild Partidas do Documento`
4. Selecione o template **`Define View Entity`** e conclua o assistente.
5. Substitua o código gerado pelo snippet abaixo e ative com **`Ctrl + F3`**.

---

## 💻 Snippet de Código

### 📝 Código Comentado (Para Estudo e Referência)

```abap
@AccessControl.authorizationCheck: #NOT_REQUIRED
@EndUserText.label: 'DEL-COM-165: Partidas do Documento do Lote'
@Metadata.ignorePropagatedAnnotations: true
define view entity ZI_FI_TAX_ITEM
  as select from ztfi_tax_item
  association        to parent ZI_FI_TAX_DOC as _Documento on  $projection.carga_id = _Documento.carga_id
                                                           and $projection.docseq   = _Documento.docseq
  association [1..1] to ZI_FI_TAX_CARGA      as _Carga     on  $projection.carga_id = _Carga.carga_id
{
      // Chave tripla: ID da Carga + Sequencial do Documento + Número do Item
  key carga_id,
  key docseq,
  key item_num,
      // Fornecedor/Cooperado (col I do Excel) ou Conta do Razão (contrapartida DS-ATR)
      lifnr,
      hkont,
      // Indicador Débito/Crédito (S = Débito, H = Crédito) e Razão Especial derivado (UMSKZ)
      shkzg,
      umskz,
      // Valores monetários de Débito (WRSOL) e Crédito (WRHAB)
      waers,
      @Semantics.amount.currencyCode: 'waers'
      wrsol,
      @Semantics.amount.currencyCode: 'waers'
      wrhab,
      // Condições de vencimento, bloqueio e textos da partida
      zfbdt,
      zterm,
      zlspr,
      sgtxt,
      zuonr,
      // Indica se a linha foi gerada automaticamente pelo sistema (contrapartida DS-ATR)
      gerado_auto,

      // Associações para a entidade pai (Documento) e entidade raiz (Carga)
      _Documento,
      _Carga
}
```

---

### 🚀 Código Limpo (Sem Comentários - Para Copiar e Colar)

```abap
@AccessControl.authorizationCheck: #NOT_REQUIRED
@EndUserText.label: 'DEL-COM-165: Partidas do Documento do Lote'
@Metadata.ignorePropagatedAnnotations: true
define view entity ZI_FI_TAX_ITEM
  as select from ztfi_tax_item
  association        to parent ZI_FI_TAX_DOC as _Documento on  $projection.carga_id = _Documento.carga_id
                                                           and $projection.docseq   = _Documento.docseq
  association [1..1] to ZI_FI_TAX_CARGA      as _Carga     on  $projection.carga_id = _Carga.carga_id
{
  key carga_id,
  key docseq,
  key item_num,
      lifnr,
      hkont,
      shkzg,
      umskz,
      waers,
      @Semantics.amount.currencyCode: 'waers'
      wrsol,
      @Semantics.amount.currencyCode: 'waers'
      wrhab,
      zfbdt,
      zterm,
      zlspr,
      sgtxt,
      zuonr,
      gerado_auto,

      _Documento,
      _Carga
}
```
