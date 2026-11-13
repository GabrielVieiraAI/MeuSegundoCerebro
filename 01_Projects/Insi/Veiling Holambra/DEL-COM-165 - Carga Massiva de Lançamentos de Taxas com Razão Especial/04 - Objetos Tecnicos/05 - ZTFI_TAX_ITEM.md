---
tipo: objeto-tecnico
tags:
  - projeto
  - veiling-holambra
  - sap
  - fi
  - ddic
  - abap-cloud
  - del-com-165
  - objeto-tecnico
id_demanda: DEL-COM-165
objeto: "ZTFI_TAX_ITEM"
camada: "1 - Dicionário de Dados"
data: 2026-11-11
aliases:
  - "ZTFI_TAX_ITEM"
---

# 📦 `ZTFI_TAX_ITEM` (Tabela Transparente — Partidas Individuais do Documento)

⬅️ [[01 - DEL-COM-165 - Arquitetura App 1 (Carga Massiva de Taxas)|Voltar para Arquitetura App 1]] | 🎨 [[01 - DEL-COM-165 - Arquitetura Técnica App 1 (Carga Massiva).excalidraw|Ver no Diagrama Excalidraw App 1]]

---

## 📌 Visão Geral do Objeto

A tabela transparente `ZTFI_TAX_ITEM` representa o **nível 3 (Entidade Neta / Partida Contábil)** na hierarquia do Aplicativo 1. Ela persiste cada linha de lançamento pertencente a um documento ([[04 - ZTFI_TAX_DOC|ZTFI_TAX_DOC]]), incluindo tanto as partidas de fornecedor/cooperado informadas nas colunas I a O da planilha Excel quanto a partida de contrapartida contábil gerada automaticamente pelo sistema para o movimento `DS-ATR` (conta `2205010002`).

---

## ⚖️ Regras de Negócio Aplicadas

1. **Exclusividade Mútua Débito (`wrsol`) vs Crédito (`wrhab`):**
   - Cada item possui valor preenchido apenas em `wrsol` (`shkzg = 'S'`, Débito) **ou** em `wrhab` (`shkzg = 'H'`, Crédito).
2. **Derivação Automática de Razão Especial (`umskz`) e Bloqueio de Pagamento (`zlspr`):**
   - Para partidas de fornecedor (`lifnr` preenchido), o código de Razão Especial `umskz` é derivado da tabela [[01 - ZTFI_TAX_TPMOV|ZTFI_TAX_TPMOV]] (`umskz_deb` quando débito, `umskz_cred` quando crédito).
   - Sempre que `umskz` estiver preenchido na partida, o campo `zlspr` recebe automaticamente o bloqueio de pagamento configurado no Tipo de Movimento (`T`). No caso do `CM-DEV`, a partida de débito do Sítio fica com `umskz` vazio e `zlspr` vazio, enquanto a partida de crédito do Sócio recebe `umskz = 'N'` e `zlspr = 'T'`.
3. **Linha Gerada Automaticamente no `DS-ATR` (`gerado_auto = 'X'`):**
   - Quando o Tipo de Movimento possui `hkont_contrapartida` preenchido (`2205010002`), o motor de upload cria automaticamente uma partida adicional em `ZTFI_TAX_ITEM` com `hkont = '2205010002'`, `shkzg = 'S'`, `wrsol = soma dos créditos` e `gerado_auto = 'X'`, permitindo que o usuário visualize o documento completo (débito e créditos) na tela do Fiori antes mesmo de contabilizar.

---

## 🛠️ Passo a Passo da Criação do Objeto

1. **No Eclipse ADT:** Conecte-se ao sistema e acesse o pacote `ZFI_CARGA_TAXAS`.
2. Clique com o botão direito -> **`New`** -> **`Database Table`**.
3. Preencha as propriedades:
   - **Name:** `ZTFI_TAX_ITEM`
   - **Description:** `DEL-COM-165: Partidas dos Documentos do Lote de Carga`
4. Selecione a Request (TR) de desenvolvimento e conclua o assistente.
5. Substitua o código gerado pelo snippet abaixo e ative com **`Ctrl + F3`**.

---

## 💻 Snippet de Código

### 📝 Código Comentado (Para Estudo e Referência)

```abap
@EndUserText.label : 'DEL-COM-165: Partidas do Lote de Carga'
@AbapCatalog.enhancement.category : #NOT_EXTENSIBLE
@AbapCatalog.tableCategory : #TRANSPARENT
@AbapCatalog.deliveryClass : #A
@AbapCatalog.dataMaintenance : #RESTRICTED
define table ztfi_tax_item {

  // Mandante e chave composta de 3 níveis: Carga + Documento (DOCSEQ) + Número do Item
  key client        : abap.clnt not null;
  key carga_id      : abap.numc(10) not null;
  key docseq        : abap.numc(4) not null;
  key item_num      : abap.numc(4) not null;
  // Código do Fornecedor/Cooperado (LIFNR - preenchido nas linhas da planilha)
  lifnr             : lifnr;
  // Conta do Razão Geral (HKONT - preenchido na linha automática 2205010002 do DS-ATR)
  hkont             : hkont;
  // Indicador Débito/Crédito derivado: S = Débito (WRSOL > 0), H = Crédito (WRHAB > 0)
  shkzg             : shkzg;
  // Código de Razão Especial derivado de ZTFI_TAX_TPMOV (ex: I, N, U, M, E, O, J, T)
  umskz             : umskz;
  // Moeda do documento
  waers             : waers;
  // Valor a Débito informado na coluna J (WRSOL) ou calculado para contrapartida DS-ATR
  @Semantics.amount.currencyCode : 'ztfi_tax_item.waers'
  wrsol             : abap.curr(13,2);
  // Valor a Crédito informado na coluna K (WRHAB)
  @Semantics.amount.currencyCode : 'ztfi_tax_item.waers'
  wrhab             : abap.curr(13,2);
  // Data Base para vencimento (coluna L - ZFBDT)
  zfbdt             : dzfbdt;
  // Condição de Pagamento (coluna M - ZTERM)
  zterm             : dzterm;
  // Bloqueio de Pagamento derivado automaticamente (T quando UMSKZ preenchido)
  zlspr             : dzlspr;
  // Texto do Item (coluna N - SGTXT)
  sgtxt             : sgtxt;
  // Atribuição / Número de Contrato (coluna O - ZUONR)
  zuonr             : dzuonr;
  // Indica se a partida foi gerada automaticamente pelo sistema (X = Contrapartida DS-ATR)
  gerado_auto       : abap_boolean;

}
```

---

### 🚀 Código Limpo (Sem Comentários - Para Copiar e Colar)

```abap
@EndUserText.label : 'DEL-COM-165: Partidas do Lote de Carga'
@AbapCatalog.enhancement.category : #NOT_EXTENSIBLE
@AbapCatalog.tableCategory : #TRANSPARENT
@AbapCatalog.deliveryClass : #A
@AbapCatalog.dataMaintenance : #RESTRICTED
define table ztfi_tax_item {

  key client        : abap.clnt not null;
  key carga_id      : abap.numc(10) not null;
  key docseq        : abap.numc(4) not null;
  key item_num      : abap.numc(4) not null;
  lifnr             : lifnr;
  hkont             : hkont;
  shkzg             : shkzg;
  umskz             : umskz;
  waers             : waers;
  @Semantics.amount.currencyCode : 'ztfi_tax_item.waers'
  wrsol             : abap.curr(13,2);
  @Semantics.amount.currencyCode : 'ztfi_tax_item.waers'
  wrhab             : abap.curr(13,2);
  zfbdt             : dzfbdt;
  zterm             : dzterm;
  zlspr             : dzlspr;
  sgtxt             : sgtxt;
  zuonr             : dzuonr;
  gerado_auto       : abap_boolean;

}
```
