---
tags:
  - projeto
  - insi
  - veiling-holambra
  - sap
  - fi-ar
  - cds
  - abap-cloud
  - del-r2r-009
  - objeto-tecnico
id_demanda: DEL-R2R-009
objeto: ZI_FI_TITULOS_VENCIDOS
camada: 2 - Modelagem de Dados (CDS Views)
data: 2026-10-23
---

# 📊 `ZI_FI_TITULOS_VENCIDOS` (CDS Interface - Títulos Vencidos)

⬅️ [[DEL-R2R-009 - Arquitetura e Objetos|Voltar para Arquitetura e Objetos]] | 🎨 [[DEL-R2R-009 - Arquitetura da Camada CDS.excalidraw|Ver no Diagrama Excalidraw]]

---

## 📌 Visão Geral do Objeto

A **`ZI_FI_TITULOS_VENCIDOS`** é a primeira **CDS View Interface** (*Core Data Services*, camada de visões analíticas do banco HANA) da nossa arquitetura.

A responsabilidade técnica dela é ler as partidas contábeis da CDS standard da SAP **`I_OperationalAcctgDocItem`** (módulo FI-AR, Contas a Receber), filtrar apenas as parcelas de clientes que estão em aberto e vencidas, e **agrupar (somar) o saldo devedor total por Cliente (`Customer`)** e código de empresa (`CompanyCode`), calculando também a data de vencimento mais antiga para apuração dos dias de atraso.

---

## ⚖️ Regras de Negócio Aplicadas

1. **Avaliação no Nível de Parcela (Item):** A base `I_OperationalAcctgDocItem` tem como chave `CompanyCode`, `AccountingDocument`, `FiscalYear` e `AccountingDocumentItem`. O filtro de vencimento atua sobre cada item/parcela individualmente, pois uma mesma fatura pode ter parcelas vencidas e parcelas a vencer.
2. **Aplicação Estrita dos 4 Filtros Definidos pela Consultora:**
   - `FinancialAccountType = 'D'`: Filtra exclusivamente lançamentos de contas de **Clientes** (*Debitor*).
   - `CompanyCode = 'CVH1'`: Filtra os lançamentos da Cooperativa Veiling Holambra (lido via parâmetro para aderência ao Clean Core).
   - `ClearingDate is initial`: Garante que apenas **títulos em aberto** (não compensados/não pagos) sejam considerados.
   - `NetDueDate < $session.system_date`: Garante que apenas **títulos vencidos** há pelo menos 1 dia entrem no cálculo.
3. **Consolidação por Cliente (`GROUP BY`):** Soma o montante em moeda da empresa (`SUM(AmountInCompanyCodeCurrency)`) e obtém o vencimento mais antigo (`MIN(NetDueDate)`) por cliente, entregando o saldo pronto para a CDS Raiz (`[[ZI_FI_CLIENTE_INADIMPLENTE (CDS)|ZI_FI_CLIENTE_INADIMPLENTE]]`) avaliar a régua de proposta de bloqueio.

---

## 💻 Snippet de Código

```abap
@AbapCatalog.viewEnhancementCategory: [#NONE]
@AccessControl.authorizationCheck: #NOT_REQUIRED
@EndUserText.label: 'DEL-R2R-009: Agregação de Títulos Vencidos por Cliente'
@Metadata.ignorePropagatedAnnotations: true
@ObjectModel.usageType:{
  serviceQuality: #X,
  sizeCategory: #XL,
  dataClass: #TRANSACTIONAL
}
define view entity ZI_FI_TITULOS_VENCIDOS
  as select from I_OperationalAcctgDocItem as Item
{
  key Item.CompanyCode,
  key Item.Customer,

      Item.CompanyCodeCurrency,

      @Semantics.amount.currencyCode: 'CompanyCodeCurrency'
      sum( Item.AmountInCompanyCodeCurrency ) as ValorTotalVencido,

      min( Item.NetDueDate )                  as MenorDataVencimento,

      count( distinct Item.AccountingDocument ) as QtdTitulosVencidos
}
where
      Item.FinancialAccountType = 'D'
  and Item.CompanyCode          = 'CVH1' // Em implementação final, vincular à tabela de parâmetros
  and Item.ClearingDate         is initial
  and Item.NetDueDate           < $session.system_date
group by
  Item.CompanyCode,
  Item.Customer,
  Item.CompanyCodeCurrency
```
