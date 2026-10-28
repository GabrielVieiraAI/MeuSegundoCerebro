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
2. **Filtro da Carteira e Exclusão da Classe `5` (CVH Interna):** Desconsidera os parceiros cuja classe de risco (`UKMBP_CMS-RISK_CLASS`) seja `5` (contas internas da própria Veiling Holambra), mantendo as classes avaliadas (`1A` À Vista e `2A` A Prazo).
   *(Alinhamento Clean Core)*: Conforme decisão arquitetural da demanda, a CDS View mantém o filtro estável e direto no SQL para garantir máxima performance analítica no banco HANA sem poluir a visão com múltiplos `JOINs` artificiais. A validação dinâmica dos parâmetros cadastrados no Fiori é delegada à camada transacional no Behavior Pool `[[ZCLFI_BP_CLIENTE_INAD]]` através do motor de ranges nativo do ABAP.
3. **Exposição dos Campos Obrigatórios do BP:**
   - `BP001-GROUP_FEATURE`: Traz a identificação de segmento de atuação (ex.: Autosserviço / Supermercados) para exibição e filtro na tela.
   - `UKMBP_CMS-RISK_CLASS`: Traz o perfil de risco do cliente para cálculo da régua de inadimplência na CDS Raiz.
4. **Hierarquia Matriz vs. Filial (`BP de Origem`):** Na Veiling Holambra, o crédito é centralizado na **Matriz**. Caso existam filiais vinculadas (`BUT050`), esta CDS identifica quem é o BP da Matriz (onde o bloqueio ocorre) e quem é o BP vinculado (`PartnerOrigem`, onde o título financeiro pode ter sido lançado).

---

## 🛠️ Passo a Passo da Criação do Objeto

1. **No Eclipse ADT:** Clique com o botão direito sobre o pacote de desenvolvimento `ZFI_BLOQ_INADIMPLENTES` -> **`New`** -> **`Data Definition`**.
2. Preencha as propriedades da CDS View:
   - **Name:** `ZI_FI_PARCEIRO_CREDITO`
   - **Description:** `DEL-R2R-009: Parceiro e Crédito FSCM Segmento 1000`
3. Clique em **Next**, selecione a sua ordem de transporte (TR) e clique em **Next** para a tela de templates.
4. Escolha o template **`Define View Entity`** e clique em **Finish**.
5. Substitua o código gerado pelo snippet abaixo e ative o objeto com **`Ctrl + F3`**.
   *(Nota: Warnings amarelos de "Search help assignment is not inherited" são comuns em View Entities modernas e podem ser ignorados).*
6. **Validação dos Dados (`F8 - Data Preview`):** Pressione `F8` e confira se os clientes da classe `5` foram filtrados e se o relacionamento Matriz x Filial (`BUT050` / `UKM001`) foi resolvido corretamente.

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
  as select from    ukmbp_cms_sgm      as Segmento
    inner join      ukmbp_cms          as CreditoGeral on  CreditoGeral.partner = Segmento.partner
    left outer join I_BusinessPartner  as BP           on  BP.BusinessPartner   = Segmento.partner
    left outer join bp001              as Atuacao      on  Atuacao.partner      = Segmento.partner
    left outer join but050             as Relacao      on  Relacao.partner1     = Segmento.partner
                                                       and Relacao.reltyp       = 'UKM001'
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
