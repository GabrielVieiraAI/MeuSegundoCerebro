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
@EndUserText.label: 'DEL-R2R-009: Dados de Crédito e Hierarquia do Parceiro'
@Metadata.ignorePropagatedAnnotations: true
@ObjectModel.usageType:{
  serviceQuality: #X,
  sizeCategory: #L,
  dataClass: #MASTER
}
define view entity ZI_FI_PARCEIRO_CREDITO
  as select from    ukmbp_cms_sgm      as Segmento
    inner join      ukmbp_cms          as CreditoGeral on  CreditoGeral.partner = Segmento.partner
    left outer join I_BusinessPartner  as BP           on  BP.BusinessPartner   = Segmento.partner
    left outer join bp001              as Atuacao      on  Atuacao.partner      = Segmento.partner
    left outer join but050             as Relacao      on  Relacao.partner1     = Segmento.partner
                                                       and Relacao.reltyp       = 'FUKM001'
{
  key Segmento.partner                                           as PartnerMatriz,
  key coalesce( Relacao.partner2, Segmento.partner )             as PartnerOrigem,
      Segmento.credit_sgmnt                                      as CreditSegment,
      BP.BusinessPartnerFullName                                 as NomeCliente,
      CreditoGeral.risk_class                                    as RiskClass,
      Atuacao.group_feature                                      as GroupFeature,
      Segmento.xblocked                                          as IsBlocked,
      Segmento.block_reason                                      as BlockReason
}
where
      Segmento.credit_sgmnt     = '1000'
  and CreditoGeral.risk_class  <> '5'
```
