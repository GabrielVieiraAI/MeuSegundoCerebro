---
tipo: objeto-tecnico
tags:
  - projeto
  - insi
  - veiling-holambra
  - sap
  - fi-ar
  - fscm
  - cds
  - abap-cloud
  - del-r2r-009
  - objeto-tecnico
id_demanda: DEL-R2R-009
objeto: ZI_FI_GRUPO_INADIMPLENTE
camada: 2 - Modelagem de Dados (CDS Views)
data: 2026-11-18
aliases:
  - "ZI_FI_GRUPO_INADIMPLENTE"
---

# 📊 `ZI_FI_GRUPO_INADIMPLENTE` (CDS Interface - Situação de Inadimplência do Grupo)

⬅️ [[DEL-R2R-009 - Arquitetura e Objetos|Voltar para Arquitetura e Objetos]] | 🎨 [[01 - DEL-R2R-009 - Comparativo Arquitetura CR-101.excalidraw|Ver no Diagrama Excalidraw (CR-101)]]

---

## 📌 Visão Geral do Objeto

A **`ZI_FI_GRUPO_INADIMPLENTE`** é uma **CDS View Interface** (*Core Data Services* — camada de visões de dados no banco SAP HANA) auxiliar criada para consolidar a situação de inadimplência do grupo econômico sem somar valores vencidos entre Matriz e filiais.

Ela cruza cada empresa listada na `[[05 - ZI_FI_PARCEIRO_CREDITO|ZI_FI_PARCEIRO_CREDITO]]` com seus títulos vencidos na `[[04 - ZI_FI_TITULOS_VENCIDOS|ZI_FI_TITULOS_VENCIDOS]]`, avalia a régua de corte individualmente por empresa e devolve para a CDS Raiz (`[[06 - ZI_FI_CLIENTE_INADIMPLENTE (CDS)|ZI_FI_CLIENTE_INADIMPLENTE]]`) uma única sinalização por Matriz e Segmento de Crédito (`GrupoInadimplente`).

---

## ⚖️ Regras de Negócio Aplicadas

1. **Avaliação Individual por Empresa (Sem Soma de Grupo e Régua Parametrizada):** Cruza `ZI_FI_PARCEIRO_CREDITO` com `ZI_FI_TITULOS_VENCIDOS` por `CompanyCode` e `PartnerOrigem` (`Titulos.CompanyCode = Parceiro.CompanyCode and Titulos.Customer = Parceiro.PartnerOrigem`) e lê dinamicamente em `ZI_CA_GET_PARAMETER` (`Modulo = 'FI'`, `Chave1 = 'DEL_R2R_009'`) os perfis de classe de risco (`RISK_CLASS/A_VISTA` e `RISK_CLASS/A_PRAZO`) e o valor mínimo da régua de corte (`LIMITE_CORTE/A_PRAZO`):
   - Perfil À Vista (`ClasseAVista.Low is not null`): `ValorTotalVencido > 0`.
   - Perfil A Prazo (`ClasseAPrazo.Low is not null`): `ValorTotalVencido >= ParamLimite.Low` (convertido para `abap.dec( 15, 2 )`).
2. **Consolidação Binária por Grupo (`GrupoInadimplente`):** Agrupa o resultado por `PartnerMatriz`, `CreditSegment` e `CompanyCode` utilizando `max(...)`, retornando `1` quando **ao menos uma empresa** do grupo ultrapassa a régua de corte individual e `0` quando **todas as empresas** do grupo estão abaixo da régua.

---

## 🛠️ Passo a Passo da Criação do Objeto

### 🔖 Metadados ADT (*ABAP Development Tools* — Obrigatório para MCP `sap-adt`)

```yaml
objectType: "DDLS/DF"
packageName: "ZFI_BLOQ_INADIMPLENTES"
name: "ZI_FI_GRUPO_INADIMPLENTE"
description: "DEL-R2R-009: Situação de Inadimplência do Grupo"
extraParams: {}
```

> [!IMPORTANT] Regra de Limite e Consistência
> `description` não pode ultrapassar **60 caracteres** (limite padrão do dicionário SAP/ADT).

### 📋 Passo a Passo no ADT / SAP GUI

1. **No Eclipse ADT:** Conecte-se ao sistema e acesse o pacote `ZFI_BLOQ_INADIMPLENTES`.
2. Clique com o botão direito -> **`New`** -> **`Data Definition`**.
3. Preencha as propriedades:
   - **Name:** `ZI_FI_GRUPO_INADIMPLENTE`
   - **Description:** `DEL-R2R-009: Situação de Inadimplência do Grupo`
4. Selecione a Request (TR) de desenvolvimento, escolha o template **`Define View Entity`** e conclua o assistente.
5. Substitua o código gerado pelo snippet abaixo e ative com **`Ctrl + F3`**.

---

## 💻 Snippet de Código

### 📝 Código Comentado (Para Estudo e Referência)

```abap
@AbapCatalog.viewEnhancementCategory: [#NONE]
@AccessControl.authorizationCheck: #NOT_REQUIRED
@EndUserText.label: 'DEL-R2R-009: Inadimplência do Grupo'
@Metadata.ignorePropagatedAnnotations: true
@ObjectModel.usageType:{
  serviceQuality: #X,
  sizeCategory: #L,
  dataClass: #TRANSACTIONAL
}
define view entity ZI_FI_GRUPO_INADIMPLENTE
  as select from    ZI_FI_PARCEIRO_CREDITO as Parceiro          // Carteira de parceiros (1 linha da Matriz + 1 por filial vinculada)
    inner join      ZI_CA_GET_PARAMETER    as ParamLimite       // Valor mínimo da régua de corte A Prazo parametrizado (CR-105)
      on  ParamLimite.Modulo  = 'FI'
      and ParamLimite.Chave1  = 'DEL_R2R_009'
      and ParamLimite.Chave2  = 'LIMITE_CORTE'
      and ParamLimite.Chave3  = 'A_PRAZO'
      and ParamLimite.Sign    = 'I'
      and ParamLimite.Opt     = 'EQ'
    left outer join ZI_CA_GET_PARAMETER    as ClasseAVista      // Classes de risco com perfil À Vista parametrizadas (CR-105)
      on  ClasseAVista.Modulo = 'FI'
      and ClasseAVista.Chave1 = 'DEL_R2R_009'
      and ClasseAVista.Chave2 = 'RISK_CLASS'
      and ClasseAVista.Chave3 = 'A_VISTA'
      and ClasseAVista.Sign   = 'I'
      and ClasseAVista.Opt    = 'EQ'
      and ClasseAVista.Low    = Parceiro.RiskClass
    left outer join ZI_CA_GET_PARAMETER    as ClasseAPrazo      // Classes de risco com perfil A Prazo parametrizadas (CR-105)
      on  ClasseAPrazo.Modulo = 'FI'
      and ClasseAPrazo.Chave1 = 'DEL_R2R_009'
      and ClasseAPrazo.Chave2 = 'RISK_CLASS'
      and ClasseAPrazo.Chave3 = 'A_PRAZO'
      and ClasseAPrazo.Sign   = 'I'
      and ClasseAPrazo.Opt    = 'EQ'
      and ClasseAPrazo.Low    = Parceiro.RiskClass
    left outer join ZI_FI_TITULOS_VENCIDOS as Titulos           // Títulos vencidos consolidados por empresa e cliente devedor
      on  Titulos.CompanyCode = Parceiro.CompanyCode
      and Titulos.Customer    = Parceiro.PartnerOrigem
{
  key Parceiro.PartnerMatriz,                                   // Chave 1: BP da Matriz do grupo econômico
  key Parceiro.CreditSegment,                                   // Chave 2: Segmento de crédito avaliado
      Parceiro.CompanyCode,                                     // Empresa parametrizada do grupo

      // Avalia a régua individualmente por empresa consumindo as classes e o limite da tabela de parâmetros (CR-105)
      max(
        case
          when ( ClasseAVista.Low is not null and Titulos.ValorTotalVencido > 0 )
            or ( ClasseAPrazo.Low is not null
             and cast( Titulos.ValorTotalVencido as abap.dec( 15, 2 ) ) >=
                 cast( cast( replace( replace( ParamLimite.Low, '.', '' ), ',', '' ) as abap.numc( 15 ) ) as abap.dec( 15, 2 ) ) / 100 )
            then 1
          else 0
        end
      ) as GrupoInadimplente
}
group by
  Parceiro.PartnerMatriz,                                       // Agrupa por Matriz
  Parceiro.CreditSegment,                                       // Agrupa por Segmento de Crédito
  Parceiro.CompanyCode                                          // Agrupa por Empresa
```

---

### 🚀 Código Limpo (Sem Comentários - Para Copiar e Colar)

```abap
@AbapCatalog.viewEnhancementCategory: [#NONE]
@AccessControl.authorizationCheck: #NOT_REQUIRED
@EndUserText.label: 'DEL-R2R-009: Inadimplência do Grupo'
@Metadata.ignorePropagatedAnnotations: true
@ObjectModel.usageType:{
  serviceQuality: #X,
  sizeCategory: #L,
  dataClass: #TRANSACTIONAL
}
define view entity ZI_FI_GRUPO_INADIMPLENTE
  as select from    ZI_FI_PARCEIRO_CREDITO as Parceiro
    inner join      ZI_CA_GET_PARAMETER    as ParamLimite  on  ParamLimite.Modulo  = 'FI'
                                                           and ParamLimite.Chave1  = 'DEL_R2R_009'
                                                           and ParamLimite.Chave2  = 'LIMITE_CORTE'
                                                           and ParamLimite.Chave3  = 'A_PRAZO'
                                                           and ParamLimite.Sign    = 'I'
                                                           and ParamLimite.Opt     = 'EQ'
    left outer join ZI_CA_GET_PARAMETER    as ClasseAVista on  ClasseAVista.Modulo = 'FI'
                                                           and ClasseAVista.Chave1 = 'DEL_R2R_009'
                                                           and ClasseAVista.Chave2 = 'RISK_CLASS'
                                                           and ClasseAVista.Chave3 = 'A_VISTA'
                                                           and ClasseAVista.Sign   = 'I'
                                                           and ClasseAVista.Opt    = 'EQ'
                                                           and ClasseAVista.Low    = Parceiro.RiskClass
    left outer join ZI_CA_GET_PARAMETER    as ClasseAPrazo on  ClasseAPrazo.Modulo = 'FI'
                                                           and ClasseAPrazo.Chave1 = 'DEL_R2R_009'
                                                           and ClasseAPrazo.Chave2 = 'RISK_CLASS'
                                                           and ClasseAPrazo.Chave3 = 'A_PRAZO'
                                                           and ClasseAPrazo.Sign   = 'I'
                                                           and ClasseAPrazo.Opt    = 'EQ'
                                                           and ClasseAPrazo.Low    = Parceiro.RiskClass
    left outer join ZI_FI_TITULOS_VENCIDOS as Titulos      on  Titulos.CompanyCode = Parceiro.CompanyCode
                                                           and Titulos.Customer    = Parceiro.PartnerOrigem
{
  key Parceiro.PartnerMatriz,
  key Parceiro.CreditSegment,
      Parceiro.CompanyCode,

      max(
        case
          when ( ClasseAVista.Low is not null and Titulos.ValorTotalVencido > 0 )
            or ( ClasseAPrazo.Low is not null
             and cast( Titulos.ValorTotalVencido as abap.dec( 15, 2 ) ) >=
                 cast( cast( replace( replace( ParamLimite.Low, '.', '' ), ',', '' ) as abap.numc( 15 ) ) as abap.dec( 15, 2 ) ) / 100 )
            then 1
          else 0
        end
      ) as GrupoInadimplente
}
group by
  Parceiro.PartnerMatriz,
  Parceiro.CreditSegment,
  Parceiro.CompanyCode
```
