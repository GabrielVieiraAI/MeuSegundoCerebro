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

## 🛠️ Passo a Passo da Criação do Objeto

1. **No Eclipse ADT:** Clique com o botão direito sobre a CDS View raiz `ZI_FI_CLIENTE_INADIMPLENTE` (ou sobre o pacote `ZFI_BLOQ_INADIMPLENTES` em `Core Data Services` -> `Data Definitions`) -> **`New`** -> **`Data Definition`**.
2. Preencha os dados do objeto:
   - **Name:** `ZC_FI_CLIENTE_INADIMPLENTE`
   - **Description:** `DEL-R2R-009: Projeção Inadimplentes (Consumption)`
3. Clique em **Next**, selecione a Ordem de Transporte (TR) e clique em **Next** para a seleção de templates.
4. Escolha o template padrão **`Define Root View Entity`** (ou template em branco) e clique em **Finish**.
   *(Nota: A declaração `as projection on ZI_FI_CLIENTE_INADIMPLENTE` com o contrato `provider contract transactional_query` converte a entidade para uma Projeção Transacional no RAP, que herda as capacidades da raiz e permite o consumo limpo no SAP Fiori).*
5. Substitua o conteúdo pelo código presente na seção [Snippet de Código](file:///c:/Users/gabriel.vsouza/source/MeuSegundoCerebro/01_Projects/Insi/Veiling%20Holambra/DEL-R2R-009%20-%20Bloqueio%20e%20Desbloqueio%20massivo%20de%20clientes%20inadimplentes/Objetos/ZC_FI_CLIENTE_INADIMPLENTE%20(CDS).md#L62-L118) abaixo.
6. Ative o objeto pressionando **`Ctrl + F3`**.
7. **Validação dos Dados (`F8 - Data Preview`):** Pressione `F8` na CDS View de Projeção para verificar se os dados são exibidos com os textos de rótulo corretos e se os campos de chave e moeda estão devidamente amarrados.

---

## 💻 Snippet de Código

### 📝 Código Comentado (Para Estudo e Referência)
```abap
@AccessControl.authorizationCheck: #CHECK
@EndUserText.label: 'DEL-R2R-009: Projeção Inadimplentes'
@Metadata.allowExtensions: true
@Search.searchable: true
define root view entity ZC_FI_CLIENTE_INADIMPLENTE
  provider contract transactional_query                                // Contrato transacional do RAP para projeção consumida no Fiori
  as projection on ZI_FI_CLIENTE_INADIMPLENTE                          // Projeta diretamente os campos da CDS Raiz (Passo 06)
{
      @Search.defaultSearchElement: true
      @EndUserText.label: 'Cliente (Matriz)'
  key PartnerMatriz,                                                   // Chave 1: BP Matriz (alvo do bloqueio/desbloqueio)

      @EndUserText.label: 'Segmento de Crédito'
  key CreditSegment,                                                   // Chave 2: Segmento de crédito avaliado (1000)

      @Search.defaultSearchElement: true
      @EndUserText.label: 'BP de Origem'
      PartnerOrigem,                                                   // BP da filial devedora (ou Matriz se não houver filial)

      @Search.defaultSearchElement: true
      @Search.fuzzinessThreshold: 0.8
      @EndUserText.label: 'Nome do Cliente'
      NomeCliente,                                                     // Nome / Razão social do cliente

      @EndUserText.label: 'Classe de Risco'
      RiskClass,                                                       // Perfil de risco (1A = À vista, 2A = A prazo)

      @EndUserText.label: 'Segmento de Atuação (Autosserviço)'
      GroupFeature,                                                    // Identifica se o cliente atua no Autosserviço

      @EndUserText.label: 'Bloqueado'
      IsBlocked,                                                       // Status de bloqueio atual (X = Bloqueado, vazio = Liberado)

      @EndUserText.label: 'Motivo do Bloqueio'
      BlockReason,                                                     // Motivo do bloqueio no FSCM (10 = Inadimplência)

      @Semantics.currencyCode: true
      Moeda,                                                           // Moeda dos valores financeiros (BRL)

      @Semantics.amount.currencyCode: 'Moeda'
      @EndUserText.label: 'Valor Vencido'
      ValorTotalVencido,                                               // Saldo total vencido do cliente

      @EndUserText.label: 'Vencimento Mais Antigo'
      MenorDataVencimento,                                             // Data da parcela em atraso mais antiga

      @EndUserText.label: 'Dias em Atraso'
      DiasAtraso,                                                      // Quantidade calculada de dias em atraso

      @EndUserText.label: 'Ação Proposta'
      AcaoProposta,                                                    // Sugestão da régua: 'Bloquear', 'Desbloquear' ou vazio

      OrdemProposta                                                    // Campo numérico técnico para ordenação (1=Bloquear no topo)
}
```

---

### 🚀 Código Limpo (Sem Comentários - Para Copiar e Colar)

```abap
@AccessControl.authorizationCheck: #CHECK
@EndUserText.label: 'DEL-R2R-009: Projeção Inadimplentes'
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
