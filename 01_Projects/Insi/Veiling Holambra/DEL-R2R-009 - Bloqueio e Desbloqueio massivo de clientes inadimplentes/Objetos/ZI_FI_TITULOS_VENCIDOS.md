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
@AbapCatalog.viewEnhancementCategory: [#NONE]                       // Impede extensões desnecessárias que possam degradar a performance
@AccessControl.authorizationCheck: #NOT_REQUIRED                   // Leitura analítica agregada; a segurança é validada na camada de topo
@EndUserText.label: 'DEL-R2R-009: Agregação Títulos Vencidos'       // Rótulo da CDS View no catálogo ABAP (máximo de 40 caracteres)
@Metadata.ignorePropagatedAnnotations: true                        // Ignora anotações propagadas para otimizar o tempo de ativação
@ObjectModel.usageType:{
  serviceQuality: #X,                                              // Nível de serviço para consultas analíticas de agregação
  sizeCategory: #XL,                                               // Categoria de volume: tabela contábil com grande massa de dados
  dataClass: #TRANSACTIONAL                                        // Dados transacionais de partidas em aberto (FI-AR)
}
define view entity ZI_FI_TITULOS_VENCIDOS
  as select from I_OperationalAcctgDocItem as Item                 // CDS Standard SAP de itens contábeis operacionais (ACDOCA / BSEG)
{
  key Item.CompanyCode,                                            // Chave 1: Empresa contábil responsável pelo lançamento (ex.: CVH1)
  key Item.Customer,                                               // Chave 2: Código do Cliente devedor (base do agrupamento financeiro)

      Item.CompanyCodeCurrency,                                    // Moeda da empresa: obrigatória para associação semântica de valores

      @Semantics.amount.currencyCode: 'CompanyCodeCurrency'
      sum( Item.AmountInCompanyCodeCurrency ) as ValorTotalVencido,  // Montante total: soma do valor líquido de todas as parcelas vencidas

      min( Item.NetDueDate )                  as MenorDataVencimento,// Vencimento mais antigo: usado na CDS Raiz para calcular dias de atraso

      count( distinct Item.AccountingDocument ) as QtdTitulosVencidos // Quantidade de títulos: total de faturas distintas em aberto vencidas
}
where
      Item.FinancialAccountType = 'D'                              // Filtro 1: Somente partidas de Clientes (D = Debitor / FI-AR)
  and Item.CompanyCode          = 'CVH1'                           // Filtro 2: Empresa da Veiling (via parâmetro no Clean Core)
  and Item.ClearingDate         is initial                         // Filtro 3: Somente títulos em aberto (sem data de compensação/baixa)
  and Item.NetDueDate           < $session.system_date             // Filtro 4: Somente títulos vencidos há pelo menos 1 dia da data atual
group by
  Item.CompanyCode,                                                // Agrupa por empresa
  Item.Customer,                                                   // Agrupa por cliente (garante exatamente 1 linha por cliente devedor)
  Item.CompanyCodeCurrency                                         // Agrupa por moeda para garantir coerência monetária na soma
```
