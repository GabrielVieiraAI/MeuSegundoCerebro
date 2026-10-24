---
tags:
  - projeto
  - insi
  - veiling-holambra
  - sap
  - fi-ar
  - fscm
  - cds
  - rap
  - abap-cloud
  - del-r2r-009
  - objeto-tecnico
id_demanda: DEL-R2R-009
objeto: ZC_FI_CLIENTE_INADIMPLENTE (CDS)
camada: 2 - Modelagem de Dados (CDS Views)
data: 2026-10-23
---

# 🖥️ `ZC_FI_CLIENTE_INADIMPLENTE` (CDS Consumption / Projection)

⬅️ [[DEL-R2R-009 - Arquitetura e Objetos|Voltar para Arquitetura e Objetos]] | 🎨 [[DEL-R2R-009 - Arquitetura da Camada CDS.excalidraw|Ver no Diagrama Excalidraw]]

---

## 📌 Visão Geral do Objeto

A **`ZC_FI_CLIENTE_INADIMPLENTE`** é a **CDS Projection View** (Visão de Consumo/Projeção) do modelo RAP.

Enquanto a CDS Raiz (`[[ZI_FI_CLIENTE_INADIMPLENTE (CDS)|ZI_FI_CLIENTE_INADIMPLENTE]]`) contém toda a regra de negócio e junções de tabelas, a visão `ZC_*` projeta exatamente os campos que serão consumidos pela aplicação **SAP Fiori Elements (List Report)** através do serviço OData V2 (`[[ZUI_FI_CLIENTE_INAD]]` / `[[ZUI_O2_FI_CLIENTE_INAD]]`), habilitando também a extensão visual via Metadata Extension (`[[ZC_FI_CLIENTE_INADIMPLENTE (MDE)]]`).

---

## ⚖️ Regras de Negócio Aplicadas

1. **Exposição dos Campos Solicitados no App Fiori:**
   - Código do Cliente Matriz (`PartnerMatriz`) e Nome;
   - Código da Filial Devedora (`PartnerOrigem` — BP de Origem);
   - Segmento de Atuação (`GroupFeature` — identifica **Autosserviço**);
   - Classe de Risco (`RiskClass` — `1A` ou `2A`);
   - Valor Total Vencido (`ValorTotalVencido`) e Dias de Atraso (`DiasAtraso`);
   - Status Atual de Bloqueio (`IsBlocked` / `BlockReason`) e **Ação Proposta** (`AcaoProposta`).
2. **Habilitação de Busca e Filtros:** Configura `@Search.searchable: true` para pesquisa rápida por código/nome de cliente e delega as anotações de tela (`@Metadata.allowExtensions: true`) para a MDE.

---

## 💻 Snippet de Código

```abap
@AccessControl.authorizationCheck: #CHECK
@EndUserText.label: 'DEL-R2R-009: Projeção de Clientes Inadimplentes'
@Metadata.allowExtensions: true
@Search.searchable: true
define root view entity ZC_FI_CLIENTE_INADIMPLENTE
  provider contract transactional_query
  as projection on ZI_FI_CLIENTE_INADIMPLENTE
{
      @Search.defaultSearchElement: true
      @EndUserText.label: 'Cliente (Matriz)'
  key PartnerMatriz,

      @EndUserText.label: 'Segmento de Crédito'
  key CreditSegment,

      @Search.defaultSearchElement: true
      @EndUserText.label: 'BP de Origem'
      PartnerOrigem,

      @Search.defaultSearchElement: true
      @Search.fuzzinessThreshold: 0.8
      @EndUserText.label: 'Nome do Cliente'
      NomeCliente,

      @EndUserText.label: 'Classe de Risco'
      RiskClass,

      @EndUserText.label: 'Segmento de Atuação (Autosserviço)'
      GroupFeature,

      @EndUserText.label: 'Bloqueado'
      IsBlocked,

      @EndUserText.label: 'Motivo do Bloqueio'
      BlockReason,

      @Semantics.currencyCode: true
      Moeda,

      @Semantics.amount.currencyCode: 'Moeda'
      @EndUserText.label: 'Valor Vencido'
      ValorTotalVencido,

      @EndUserText.label: 'Vencimento Mais Antigo'
      MenorDataVencimento,

      @EndUserText.label: 'Dias em Atraso'
      DiasAtraso,

      @EndUserText.label: 'Ação Proposta'
      AcaoProposta,

      OrdemProposta
}
```
