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
objeto: "ZTFI_TAX_CARGA"
camada: "1 - Dicionário de Dados"
data: 2026-11-11
aliases:
  - "ZTFI_TAX_CARGA"
---

# 📦 `ZTFI_TAX_CARGA` (Tabela Transparente — Cabeçalho do Lote de Carga)

⬅️ [[01 - DEL-COM-165 - Arquitetura App 1 (Carga Massiva de Taxas)|Voltar para Arquitetura App 1]] | 🎨 [[01 - DEL-COM-165 - Arquitetura Técnica App 1 (Carga Massiva).excalidraw|Ver no Diagrama Excalidraw App 1]]

---

## 📌 Visão Geral do Objeto

A tabela transparente `ZTFI_TAX_CARGA` representa o **nível 1 (Raiz / Cabeçalho do Lote)** na hierarquia de 3 níveis do Aplicativo 1 ([[35 - taxascarga (App Fiori)|taxascarga]]). Cada upload de planilha Excel realizado pelo operador financeiro gera um registro único nesta tabela identificado por `carga_id` (obtido do intervalo de numeração [[08 - ZTAXCARNR|ZTAXCARNR]]), consolidando os contadores de documentos (total, válidos, com erro e lançados), os somatórios financeiros de débito e crédito do lote e os metadados de auditoria (usuário, data/hora e nome do arquivo).

---

## ⚖️ Regras de Negócio Aplicadas

1. **Identificador de Lote e Rastreabilidade (`carga_id`):** O número sequencial de 10 posições gerado para `carga_id` identifica o lote no monitor Fiori e é gravado no campo contábil `BSEG-XREF1` (`REF_KEY_1` na BAPI) de todas as partidas lançadas a partir deste lote.
2. **Máquina de Estados do Lote (`status_geral`):**
   - `V` (*Verificado OK*): Todos os documentos do lote passaram sem erros nas validações customizadas e na simulação da `BAPI_ACC_DOCUMENT_CHECK`.
   - `E` (*Com Erros*): Um ou mais documentos falharam na verificação (ou todos falharam). Documentos válidos (`V`) do mesmo lote ainda podem ser contabilizados.
   - `P` (*Parcialmente Lançado*): Os documentos válidos foram contabilizados (`status = 'L'`), mas restaram documentos com erro (`status = 'E'`) no histórico do lote.
   - `L` (*Totalmente Lançado*): Todos os documentos do lote foram efetivamente contabilizados no SAP e possuem `BELNR` gerado.
3. **Semântica Monetária:** Os campos `total_debito` e `total_credito` estão vinculados ao campo de moeda `waers` via anotação `@Semantics.amount.currencyCode`.

---

## 🛠️ Passo a Passo da Criação do Objeto

1. **No Eclipse ADT:** Conecte-se ao sistema e acesse o pacote `ZFI_CARGA_TAXAS`.
2. Clique com o botão direito -> **`New`** -> **`Database Table`**.
3. Preencha as propriedades:
   - **Name:** `ZTFI_TAX_CARGA`
   - **Description:** `DEL-COM-165: Cabeçalho do Lote de Carga de Taxas`
4. Selecione a Request (TR) de desenvolvimento e conclua o assistente.
5. Substitua o código gerado pelo snippet abaixo e ative com **`Ctrl + F3`**.

---

## 💻 Snippet de Código

### 📝 Código Comentado (Para Estudo e Referência)

```abap
@EndUserText.label : 'DEL-COM-165: Cabeçalho do Lote de Carga'
@AbapCatalog.enhancement.category : #NOT_EXTENSIBLE
@AbapCatalog.tableCategory : #TRANSPARENT
@AbapCatalog.deliveryClass : #A
@AbapCatalog.dataMaintenance : #RESTRICTED
define table ztfi_tax_carga {

  // Mandante SAP
  key client        : abap.clnt not null;
  // Identificador sequencial único do lote (gerado via SNRO ZTAXCARNR)
  key carga_id      : abap.numc(10) not null;
  // Nome do arquivo Excel (.xlsx) enviado pelo usuário no upload
  nome_arquivo      : abap.char(120);
  // Status geral do lote: V=Verificado OK, E=Com Erros, P=Parcialmente Lançado, L=Totalmente Lançado
  status_geral      : abap.char(1);
  // Contadores de documentos do lote para exibição rápida no List Report
  qtd_docs          : abap.int4;
  qtd_validos       : abap.int4;
  qtd_erros         : abap.int4;
  qtd_lancados      : abap.int4;
  // Moeda de referência dos totalizadores do lote (padrão: BRL)
  waers             : waers;
  // Somatório total de débitos de todos os documentos do lote
  @Semantics.amount.currencyCode : 'ztfi_tax_carga.waers'
  total_debito      : abap.curr(15,2);
  // Somatório total de créditos de todos os documentos do lote
  @Semantics.amount.currencyCode : 'ztfi_tax_carga.waers'
  total_credito     : abap.curr(15,2);
  // Campos de auditoria gerenciados pelo RAP
  criado_por        : abp_creation_user;
  criado_em         : abp_creation_tstmpl;
  alterado_por      : abp_locinst_lastchange_user;
  alterado_em       : abp_locinst_lastchange_tstmpl;

}
```

---

### 🚀 Código Limpo (Sem Comentários - Para Copiar e Colar)

```abap
@EndUserText.label : 'DEL-COM-165: Cabeçalho do Lote de Carga'
@AbapCatalog.enhancement.category : #NOT_EXTENSIBLE
@AbapCatalog.tableCategory : #TRANSPARENT
@AbapCatalog.deliveryClass : #A
@AbapCatalog.dataMaintenance : #RESTRICTED
define table ztfi_tax_carga {

  key client        : abap.clnt not null;
  key carga_id      : abap.numc(10) not null;
  nome_arquivo      : abap.char(120);
  status_geral      : abap.char(1);
  qtd_docs          : abap.int4;
  qtd_validos       : abap.int4;
  qtd_erros         : abap.int4;
  qtd_lancados      : abap.int4;
  waers             : waers;
  @Semantics.amount.currencyCode : 'ztfi_tax_carga.waers'
  total_debito      : abap.curr(15,2);
  @Semantics.amount.currencyCode : 'ztfi_tax_carga.waers'
  total_credito     : abap.curr(15,2);
  criado_por        : abp_creation_user;
  criado_em         : abp_creation_tstmpl;
  alterado_por      : abp_locinst_lastchange_user;
  alterado_em       : abp_locinst_lastchange_tstmpl;

}
```
