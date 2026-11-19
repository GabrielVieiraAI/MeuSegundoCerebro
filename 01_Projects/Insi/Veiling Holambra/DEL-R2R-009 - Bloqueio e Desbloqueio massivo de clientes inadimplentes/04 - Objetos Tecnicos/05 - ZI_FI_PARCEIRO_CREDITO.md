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

aliases:
  - "ZI_FI_PARCEIRO_CREDITO"
---

# 👥 `ZI_FI_PARCEIRO_CREDITO` (CDS Interface - Crédito do Cliente)

⬅️ [[DEL-R2R-009 - Arquitetura e Objetos|Voltar para Arquitetura e Objetos]] | 🎨 [[01 - DEL-R2R-009 - Arquitetura da Camada CDS.excalidraw|Ver no Diagrama Excalidraw]]

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

1. **Carteira de Crédito e Empresa Parametrizadas (`ZI_CA_GET_PARAMETER`):** Seleciona os Parceiros de Negócio que possuem gestão de crédito ativa (`UKM000`) no segmento de crédito cadastrado em `FI` / `DEL_R2R_009` / `CREDIT_SGMNT` / `SEGMENTO` e expõe `CompanyCode` a partir de `FI` / `DEL_R2R_009` / `BUKRS` / `EMPRESA`.
2. **Filtro Unificado de Classes Excluídas (`RISK_CLASS` / `EXCLUIR`):** Desconsidera os parceiros cuja classe de risco (`UKMBP_CMS-RISK_CLASS`) conste no parâmetro `FI` / `DEL_R2R_009` / `RISK_CLASS` / `EXCLUIR` (por meio de `left outer join` com filtro `ClasseExcluida.Low is null`), utilizando exatamente a mesma fonte corporativa consultada pelo *Behavior Pool* `[[08 - ZCLFI_BP_CLIENTE_INAD|ZCLFI_BP_CLIENTE_INAD]]` e evitando divergência entre a tela e os botões.
3. **Exposição dos Campos Obrigatórios do BP:**
   - `BP001-GROUP_FEATURE`: Traz a identificação de segmento de atuação (ex.: Autosserviço / Supermercados) para exibição e filtro na tela.
   - `UKMBP_CMS-RISK_CLASS`: Traz o perfil de risco do cliente para cálculo da régua de inadimplência na CDS Raiz.
4. **Hierarquia Matriz vs. Filial (`BP de Origem`):** Na Veiling Holambra, o crédito é centralizado na **Matriz**. Para garantir que as faturas da própria Matriz nunca sejam ocultadas quando houver filiais vinculadas (`BUT050` com `reltyp` lido de `FI` / `DEL_R2R_009` / `RELTYP` / `GRUPO`), a CDS utiliza `union` para gerar **sempre uma linha própria da Matriz** (`PartnerOrigem = Segmento.partner`) somada a **uma linha para cada filial vinculada** (`PartnerOrigem = Relacao.partner2`), compondo a chave tripla `PartnerMatriz`, `CreditSegment` e `PartnerOrigem`. Além disso, o primeiro ramo realiza `left outer join` com `but050` (`VinculoSuperior.partner2 = Segmento.partner and VinculoSuperior.reltyp = ParamRelacao.Low`) filtrando `VinculoSuperior.partner2 is null`, impedindo que filiais com conta própria no segmento parametrizado apareçam duplicadas como matrizes independentes.

---

## 🛠️ Passo a Passo da Criação do Objeto

### 🔖 Metadados ADT (*ABAP Development Tools* — Obrigatório para MCP `sap-adt`)

```yaml
objectType: "DDLS/DF"
packageName: "ZFI_BLOQ_INADIMPLENTES"
name: "ZI_FI_PARCEIRO_CREDITO"
description: "DEL-R2R-009: Parceiro e Crédito FSCM"
extraParams: {}
```

### 📋 Passo a Passo no ADT / SAP GUI

1. **No Eclipse ADT:** Clique com o botão direito sobre o pacote de desenvolvimento `ZFI_BLOQ_INADIMPLENTES` -> **`New`** -> **`Data Definition`**.
2. Preencha as propriedades da CDS View:
   - **Name:** `ZI_FI_PARCEIRO_CREDITO`
   - **Description:** `DEL-R2R-009: Parceiro e Crédito FSCM`
3. Clique em **Next**, selecione a sua ordem de transporte (TR) e clique em **Next** para a tela de templates.
4. Escolha o template **`Define View Entity`** e clique em **Finish**.
5. Substitua o código gerado pelo snippet abaixo e ative o objeto com **`Ctrl + F3`**.
   *(Nota: Warnings amarelos de "Search help assignment is not inherited" são comuns em View Entities modernas e podem ser ignorados).*
6. **Validação dos Dados (`F8 - Data Preview`):** Pressione `F8` e confira se os clientes da classe `5` foram filtrados e se a Matriz aparece tanto em linha própria quanto acompanhada de cada filial vinculada (`BUT050` / `UKM001`).

---

## 💻 Snippet de Código

### 📝 Código Comentado (Para Estudo e Referência)
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
  // Ramo 1: Gera sempre a linha própria da Matriz (PartnerOrigem = Segmento.partner), excluindo filiais subordinadas
  as select from    ukmbp_cms_sgm       as Segmento                  // Tabela de dados de crédito do parceiro por segmento (FSCM)
    inner join      ukmbp_cms           as CreditoGeral    on  CreditoGeral.partner     = Segmento.partner   // Tabela mestre de crédito geral (classe de risco)
    inner join      ZI_CA_GET_PARAMETER as ParamEmpresa    on  ParamEmpresa.Modulo      = 'FI'               // Empresa avaliada parametrizada (CR-105)
                                                           and ParamEmpresa.Chave1      = 'DEL_R2R_009'
                                                           and ParamEmpresa.Chave2      = 'BUKRS'
                                                           and ParamEmpresa.Chave3      = 'EMPRESA'
                                                           and ParamEmpresa.Sign        = 'I'
                                                           and ParamEmpresa.Opt         = 'EQ'
    inner join      ZI_CA_GET_PARAMETER as ParamSegmento   on  ParamSegmento.Modulo     = 'FI'               // Segmento de crédito parametrizado (CR-105)
                                                           and ParamSegmento.Chave1     = 'DEL_R2R_009'
                                                           and ParamSegmento.Chave2     = 'CREDIT_SGMNT'
                                                           and ParamSegmento.Chave3     = 'SEGMENTO'
                                                           and ParamSegmento.Sign       = 'I'
                                                           and ParamSegmento.Opt        = 'EQ'
                                                           and ParamSegmento.Low        = Segmento.credit_sgmnt
    inner join      ZI_CA_GET_PARAMETER as ParamRelacao    on  ParamRelacao.Modulo      = 'FI'               // Tipo de relação Matriz x Filial parametrizado (CR-105)
                                                           and ParamRelacao.Chave1      = 'DEL_R2R_009'
                                                           and ParamRelacao.Chave2      = 'RELTYP'
                                                           and ParamRelacao.Chave3      = 'GRUPO'
                                                           and ParamRelacao.Sign        = 'I'
                                                           and ParamRelacao.Opt         = 'EQ'
    left outer join ZI_CA_GET_PARAMETER as ClasseExcluida  on  ClasseExcluida.Modulo    = 'FI'               // Classes de risco excluídas lidas da mesma fonte da classe ABAP (CR-105)
                                                           and ClasseExcluida.Chave1    = 'DEL_R2R_009'
                                                           and ClasseExcluida.Chave2    = 'RISK_CLASS'
                                                           and ClasseExcluida.Chave3    = 'EXCLUIR'
                                                           and ClasseExcluida.Sign      = 'I'
                                                           and ClasseExcluida.Opt       = 'EQ'
                                                           and ClasseExcluida.Low       = CreditoGeral.risk_class
    left outer join I_BusinessPartner   as BP              on  BP.BusinessPartner       = Segmento.partner   // CDS Standard para obter a razão social do cliente
    left outer join bp001               as Atuacao         on  Atuacao.partner          = Segmento.partner   // Dados adicionais do BP (segmento de atuação)
    left outer join but050              as VinculoSuperior on  VinculoSuperior.partner2 = Segmento.partner   // Verifica se o parceiro já é filial (partner2) de outra Matriz
                                                           and VinculoSuperior.reltyp   = ParamRelacao.Low
{
  key Segmento.partner                        as PartnerMatriz,      // Chave 1: BP da Matriz (onde o bloqueio de crédito é aplicado)
  key Segmento.credit_sgmnt                   as CreditSegment,      // Chave 2: Segmento de crédito do FSCM avaliado
  key Segmento.partner                        as PartnerOrigem,      // Chave 3: Própria Matriz como origem de suas faturas vencidas
      cast( ParamEmpresa.Low as bukrs )       as CompanyCode,        // Empresa parametrizada do registro (para join e AUTHORITY-CHECK)
      BP.BusinessPartnerFullName              as NomeCliente,        // Nome/Razão social do cliente para exibição no aplicativo
      CreditoGeral.risk_class                 as RiskClass,          // Classe de risco do cliente
      Atuacao.group_feature                   as GroupFeature,       // Segmento de atuação (identifica se o cliente é Autosserviço)
      Segmento.xblocked                       as IsBlocked,          // Status de bloqueio atual no FSCM (X = Bloqueado, vazio = Liberado)
      Segmento.block_reason                   as BlockReason         // Motivo do bloqueio atual gravado no FSCM (10 = Inadimplência)
}
where
      ClasseExcluida.Low       is null                               // Desconsidera todas as classes de risco cadastradas em EXCLUIR
  and VinculoSuperior.partner2 is null                               // Garante que filiais com conta própria não entrem como Matriz

// Ramo 2: Une uma linha para cada filial vinculada à Matriz conforme tipo de relação parametrizado
union select from   ukmbp_cms_sgm       as Segmento                  // Tabela de dados de crédito da Matriz por segmento (FSCM)
    inner join      ukmbp_cms           as CreditoGeral   on  CreditoGeral.partner   = Segmento.partner   // Tabela mestre de crédito geral (classe de risco)
    inner join      ZI_CA_GET_PARAMETER as ParamEmpresa   on  ParamEmpresa.Modulo    = 'FI'               // Empresa avaliada parametrizada (CR-105)
                                                          and ParamEmpresa.Chave1    = 'DEL_R2R_009'
                                                          and ParamEmpresa.Chave2    = 'BUKRS'
                                                          and ParamEmpresa.Chave3    = 'EMPRESA'
                                                          and ParamEmpresa.Sign      = 'I'
                                                          and ParamEmpresa.Opt       = 'EQ'
    inner join      ZI_CA_GET_PARAMETER as ParamSegmento  on  ParamSegmento.Modulo   = 'FI'               // Segmento de crédito parametrizado (CR-105)
                                                          and ParamSegmento.Chave1   = 'DEL_R2R_009'
                                                          and ParamSegmento.Chave2   = 'CREDIT_SGMNT'
                                                          and ParamSegmento.Chave3   = 'SEGMENTO'
                                                          and ParamSegmento.Sign     = 'I'
                                                          and ParamSegmento.Opt      = 'EQ'
                                                          and ParamSegmento.Low      = Segmento.credit_sgmnt
    inner join      ZI_CA_GET_PARAMETER as ParamRelacao   on  ParamRelacao.Modulo    = 'FI'               // Tipo de relação Matriz x Filial parametrizado (CR-105)
                                                          and ParamRelacao.Chave1    = 'DEL_R2R_009'
                                                          and ParamRelacao.Chave2    = 'RELTYP'
                                                          and ParamRelacao.Chave3    = 'GRUPO'
                                                          and ParamRelacao.Sign      = 'I'
                                                          and ParamRelacao.Opt       = 'EQ'
    inner join      but050              as Relacao        on  Relacao.partner1       = Segmento.partner   // Relacionamento Matriz (partner1) x Filial (partner2)
                                                          and Relacao.reltyp         = ParamRelacao.Low
    left outer join ZI_CA_GET_PARAMETER as ClasseExcluida on  ClasseExcluida.Modulo  = 'FI'               // Classes de risco excluídas parametrizadas (CR-105)
                                                          and ClasseExcluida.Chave1  = 'DEL_R2R_009'
                                                          and ClasseExcluida.Chave2  = 'RISK_CLASS'
                                                          and ClasseExcluida.Chave3  = 'EXCLUIR'
                                                          and ClasseExcluida.Sign    = 'I'
                                                          and ClasseExcluida.Opt     = 'EQ'
                                                          and ClasseExcluida.Low     = CreditoGeral.risk_class
    left outer join I_BusinessPartner   as BP             on  BP.BusinessPartner     = Segmento.partner   // CDS Standard para obter a razão social do cliente
    left outer join bp001               as Atuacao        on  Atuacao.partner        = Segmento.partner   // Dados adicionais do BP (segmento de atuação)
{
  key Segmento.partner                        as PartnerMatriz,      // Chave 1: BP da Matriz (onde o bloqueio de crédito é aplicado)
  key Segmento.credit_sgmnt                   as CreditSegment,      // Chave 2: Segmento de crédito do FSCM avaliado
  key Relacao.partner2                        as PartnerOrigem,      // Chave 3: BP da filial vinculada que pode originar faturas vencidas
      cast( ParamEmpresa.Low as bukrs )       as CompanyCode,        // Empresa parametrizada do registro
      BP.BusinessPartnerFullName              as NomeCliente,        // Nome/Razão social da Matriz para exibição no aplicativo
      CreditoGeral.risk_class                 as RiskClass,          // Classe de risco do grupo econômico
      Atuacao.group_feature                   as GroupFeature,       // Segmento de atuação (Autosserviço)
      Segmento.xblocked                       as IsBlocked,          // Status de bloqueio atual no FSCM
      Segmento.block_reason                   as BlockReason         // Motivo do bloqueio atual gravado no FSCM
}
where
      ClasseExcluida.Low is null                                     // Desconsidera todas as classes de risco cadastradas em EXCLUIR
```

---

### 🚀 Código Limpo (Sem Comentários - Para Copiar e Colar)

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
  as select from    ukmbp_cms_sgm       as Segmento
    inner join      ukmbp_cms           as CreditoGeral    on  CreditoGeral.partner     = Segmento.partner
    inner join      ZI_CA_GET_PARAMETER as ParamEmpresa    on  ParamEmpresa.Modulo      = 'FI'
                                                           and ParamEmpresa.Chave1      = 'DEL_R2R_009'
                                                           and ParamEmpresa.Chave2      = 'BUKRS'
                                                           and ParamEmpresa.Chave3      = 'EMPRESA'
                                                           and ParamEmpresa.Sign        = 'I'
                                                           and ParamEmpresa.Opt         = 'EQ'
    inner join      ZI_CA_GET_PARAMETER as ParamSegmento   on  ParamSegmento.Modulo     = 'FI'
                                                           and ParamSegmento.Chave1     = 'DEL_R2R_009'
                                                           and ParamSegmento.Chave2     = 'CREDIT_SGMNT'
                                                           and ParamSegmento.Chave3     = 'SEGMENTO'
                                                           and ParamSegmento.Sign       = 'I'
                                                           and ParamSegmento.Opt        = 'EQ'
                                                           and ParamSegmento.Low        = Segmento.credit_sgmnt
    inner join      ZI_CA_GET_PARAMETER as ParamRelacao    on  ParamRelacao.Modulo      = 'FI'
                                                           and ParamRelacao.Chave1      = 'DEL_R2R_009'
                                                           and ParamRelacao.Chave2      = 'RELTYP'
                                                           and ParamRelacao.Chave3      = 'GRUPO'
                                                           and ParamRelacao.Sign        = 'I'
                                                           and ParamRelacao.Opt         = 'EQ'
    left outer join ZI_CA_GET_PARAMETER as ClasseExcluida  on  ClasseExcluida.Modulo    = 'FI'
                                                           and ClasseExcluida.Chave1    = 'DEL_R2R_009'
                                                           and ClasseExcluida.Chave2    = 'RISK_CLASS'
                                                           and ClasseExcluida.Chave3    = 'EXCLUIR'
                                                           and ClasseExcluida.Sign      = 'I'
                                                           and ClasseExcluida.Opt       = 'EQ'
                                                           and ClasseExcluida.Low       = CreditoGeral.risk_class
    left outer join I_BusinessPartner   as BP              on  BP.BusinessPartner       = Segmento.partner
    left outer join bp001               as Atuacao         on  Atuacao.partner          = Segmento.partner
    left outer join but050              as VinculoSuperior on  VinculoSuperior.partner2 = Segmento.partner
                                                           and VinculoSuperior.reltyp   = ParamRelacao.Low
{
  key Segmento.partner                        as PartnerMatriz,
  key Segmento.credit_sgmnt                   as CreditSegment,
  key Segmento.partner                        as PartnerOrigem,
      cast( ParamEmpresa.Low as bukrs )       as CompanyCode,
      BP.BusinessPartnerFullName              as NomeCliente,
      CreditoGeral.risk_class                 as RiskClass,
      Atuacao.group_feature                   as GroupFeature,
      Segmento.xblocked                       as IsBlocked,
      Segmento.block_reason                   as BlockReason
}
where
      ClasseExcluida.Low       is null
  and VinculoSuperior.partner2 is null

union select from   ukmbp_cms_sgm       as Segmento
    inner join      ukmbp_cms           as CreditoGeral   on  CreditoGeral.partner   = Segmento.partner
    inner join      ZI_CA_GET_PARAMETER as ParamEmpresa   on  ParamEmpresa.Modulo    = 'FI'
                                                          and ParamEmpresa.Chave1    = 'DEL_R2R_009'
                                                          and ParamEmpresa.Chave2    = 'BUKRS'
                                                          and ParamEmpresa.Chave3    = 'EMPRESA'
                                                          and ParamEmpresa.Sign      = 'I'
                                                          and ParamEmpresa.Opt       = 'EQ'
    inner join      ZI_CA_GET_PARAMETER as ParamSegmento  on  ParamSegmento.Modulo   = 'FI'
                                                          and ParamSegmento.Chave1   = 'DEL_R2R_009'
                                                          and ParamSegmento.Chave2   = 'CREDIT_SGMNT'
                                                          and ParamSegmento.Chave3   = 'SEGMENTO'
                                                          and ParamSegmento.Sign     = 'I'
                                                          and ParamSegmento.Opt      = 'EQ'
                                                          and ParamSegmento.Low      = Segmento.credit_sgmnt
    inner join      ZI_CA_GET_PARAMETER as ParamRelacao   on  ParamRelacao.Modulo    = 'FI'
                                                          and ParamRelacao.Chave1    = 'DEL_R2R_009'
                                                          and ParamRelacao.Chave2    = 'RELTYP'
                                                          and ParamRelacao.Chave3    = 'GRUPO'
                                                          and ParamRelacao.Sign      = 'I'
                                                          and ParamRelacao.Opt       = 'EQ'
    inner join      but050              as Relacao        on  Relacao.partner1       = Segmento.partner
                                                          and Relacao.reltyp         = ParamRelacao.Low
    left outer join ZI_CA_GET_PARAMETER as ClasseExcluida on  ClasseExcluida.Modulo  = 'FI'
                                                          and ClasseExcluida.Chave1  = 'DEL_R2R_009'
                                                          and ClasseExcluida.Chave2  = 'RISK_CLASS'
                                                          and ClasseExcluida.Chave3  = 'EXCLUIR'
                                                          and ClasseExcluida.Sign    = 'I'
                                                          and ClasseExcluida.Opt     = 'EQ'
                                                          and ClasseExcluida.Low     = CreditoGeral.risk_class
    left outer join I_BusinessPartner   as BP             on  BP.BusinessPartner     = Segmento.partner
    left outer join bp001               as Atuacao        on  Atuacao.partner        = Segmento.partner
{
  key Segmento.partner                        as PartnerMatriz,
  key Segmento.credit_sgmnt                   as CreditSegment,
  key Relacao.partner2                        as PartnerOrigem,
      cast( ParamEmpresa.Low as bukrs )       as CompanyCode,
      BP.BusinessPartnerFullName              as NomeCliente,
      CreditoGeral.risk_class                 as RiskClass,
      Atuacao.group_feature                   as GroupFeature,
      Segmento.xblocked                       as IsBlocked,
      Segmento.block_reason                   as BlockReason
}
where
      ClasseExcluida.Low is null
```
