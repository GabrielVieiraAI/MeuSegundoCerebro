---
tags:
  - projeto
  - insi
  - veiling-holambra
  - sap
  - fscm
  - cds
  - abap-cloud
  - del-r2r-009
  - objeto-tecnico
id_demanda: DEL-R2R-009
objeto: ZI_FI_PARCEIRO_CREDITO
camada: 2 - Modelagem de Dados (CDS Views)
data: 2026-10-23
---

# 👥 `ZI_FI_PARCEIRO_CREDITO` (CDS Interface - Crédito do Cliente)

⬅️ [[DEL-R2R-009 - Arquitetura e Objetos|Voltar para Arquitetura e Objetos]] | 🎨 [[DEL-R2R-009 - Arquitetura da Camada CDS.excalidraw|Ver no Diagrama Excalidraw]]

---

## 📌 Visão Geral do Objeto

A **`ZI_FI_PARCEIRO_CREDITO`** é a segunda **CDS View Interface** de base da nossa camada de modelagem.

A responsabilidade técnica dela é unificar, em uma única visão limpa, os dados cadastrais do **Parceiro de Negócio (BP — *Business Partner*)** com as informações do módulo **SAP Credit Management (FSCM)**:
- Dados gerais de crédito e Classe de Risco (`UKMBP_CMS`);
- Dados do Segmento de Crédito `1000`, status de bloqueio e motivo atual (`UKMBP_CMS_SGM`);
- Característica de agrupamento / Segmento de Atuação (`BP001-GROUP_FEATURE`, que identifica se o cliente é **Autosserviço**);
- Relacionamento hierárquico de crédito entre **Matriz e Filiais** (`BUT050`).

---

## ⚖️ Regras de Negócio Aplicadas

1. **Carteira de Crédito no Segmento `1000`:** Seleciona os Parceiros de Negócio que possuem gestão de crédito ativa (função `UKM000`) no segmento de crédito `1000`.
2. **Exclusão da Classe de Risco `5` (CVH Interna):** Desconsidera os parceiros cuja classe de risco (`UKMBP_CMS-RISK_CLASS`) seja `5` (contas internas da própria Veiling Holambra), mantendo as classes avaliadas (`1A` À Vista e `2A` A Prazo).
3. **Exposição dos Campos Obrigatórios do BP:**
   - `BP001-GROUP_FEATURE`: Traz a identificação de segmento de atuação (ex.: Autosserviço / Supermercados) para exibição e filtro na tela.
   - `UKMBP_CMS-RISK_CLASS`: Traz o perfil de risco do cliente para cálculo da régua de inadimplência na CDS Raiz.
4. **Hierarquia Matriz vs. Filial (`BP de Origem`):** Na Veiling Holambra, o crédito é centralizado na **Matriz**. Caso existam filiais vinculadas (`BUT050`), esta CDS identifica quem é o BP da Matriz (onde o bloqueio ocorre) e quem é o BP vinculado (`PartnerOrigem`, onde o título financeiro pode ter sido lançado).

---

## 💻 Snippet de Código

```abap
@AbapCatalog.viewEnhancementCategory: [#NONE]
@AccessControl.authorizationCheck: #NOT_REQUIRED
@EndUserText.label: 'DEL-R2R-009: Parceiro e Crédito FSCM'
@Metadata.ignorePropagatedAnnotations: true
@ObjectModel.usageType:{
  serviceQuality: #X,
  sizeCategory: #L,
  dataClass: #MASTER
}
define view entity ZI_FI_PARCEIRO_CREDITO
  as select from    ukmbp_cms_sgm      as Segmento     // Tabela de dados de crédito do parceiro por segmento (FSCM)
    inner join      ukmbp_cms          as CreditoGeral on  CreditoGeral.partner = Segmento.partner   // Tabela mestre de crédito geral (classe de risco)
    left outer join I_BusinessPartner  as BP           on  BP.BusinessPartner   = Segmento.partner   // CDS Standard para obter a razão social do cliente
    left outer join bp001              as Atuacao      on  Atuacao.partner      = Segmento.partner   // Dados adicionais do BP (segmento de atuação)
    left outer join but050             as Relacao      on  Relacao.partner1     = Segmento.partner   // Relacionamentos entre parceiros (Matriz x Filial)
                                                       and Relacao.reltyp       = 'UKM001'           // Categoria de relação FSCM: Conta de crédito de nível superior
{
  key Segmento.partner                                           as PartnerMatriz,   // Chave 1: BP da Matriz (onde o bloqueio de crédito é aplicado)
  key coalesce( Relacao.partner2, Segmento.partner )             as PartnerOrigem,   // Chave 2: BP da filial devedora (ou a própria Matriz se não houver filial)
      Segmento.credit_sgmnt                                      as CreditSegment,   // Segmento de crédito do FSCM avaliado (1000)
      BP.BusinessPartnerFullName                                 as NomeCliente,     // Nome/Razão social do cliente para exibição no aplicativo
      CreditoGeral.risk_class                                    as RiskClass,       // Classe de risco do cliente (1A = À vista, 2A = A prazo)
      Atuacao.group_feature                                      as GroupFeature,   // Segmento de atuação (identifica se o cliente é Autosserviço)
      Segmento.xblocked                                          as IsBlocked,       // Status de bloqueio atual no FSCM (X = Bloqueado, vazio = Liberado)
      Segmento.block_reason                                      as BlockReason      // Motivo do bloqueio atual gravado no FSCM (10 = Inadimplência)
}
where
      Segmento.credit_sgmnt     = '1000'                                             // Filtra exclusivamente o segmento de crédito 1000 da Veiling
  and CreditoGeral.risk_class  <> '5'                                                // Exclui a classe 5 (contas internas da própria Veiling Holambra)
```
