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
objeto: ZI_FI_CLIENTE_INADIMPLENTE (CDS)
camada: 2 - Modelagem de Dados (CDS Views)
data: 2026-10-23

aliases:
  - "ZI_FI_CLIENTE_INADIMPLENTE (CDS)"
---

# 🌳 `ZI_FI_CLIENTE_INADIMPLENTE` (CDS Interface Root)

⬅️ [[DEL-R2R-009 - Arquitetura e Objetos|Voltar para Arquitetura e Objetos]] | 🎨 [[01 - DEL-R2R-009 - Arquitetura da Camada CDS.excalidraw|Ver no Diagrama Excalidraw]]

---

## 📌 Visão Geral do Objeto

A **`ZI_FI_CLIENTE_INADIMPLENTE`** é a **CDS View Raiz (`root view entity`)** do nosso modelo **RAP** (*ABAP RESTful Application Programming Model*).

Ela é o coração analítico do aplicativo: faz o cruzamento (`LEFT OUTER JOIN`) entre a carteira de parceiros (`[[05 - ZI_FI_PARCEIRO_CREDITO|ZI_FI_PARCEIRO_CREDITO]]`), os títulos vencidos individuais por empresa (`[[04 - ZI_FI_TITULOS_VENCIDOS|ZI_FI_TITULOS_VENCIDOS]]`) e a sinalização consolidada do grupo econômico (`[[15 - ZI_FI_GRUPO_INADIMPLENTE|ZI_FI_GRUPO_INADIMPLENTE]]`), diferenciando cada registro pela chave tripla (`PartnerMatriz`, `CreditSegment` e `PartnerOrigem`), filtrando clientes bloqueados por outros motivos e calculando a coluna **`AcaoProposta`** de forma 100% simétrica pelo grupo. É sobre esta entidade que o comportamento transacional (`[[07 - ZI_FI_CLIENTE_INADIMPLENTE (BDEF)|ZI_FI_CLIENTE_INADIMPLENTE (BDEF)]]`) é definido.

---

## ⚖️ Regras de Negócio Aplicadas

1. **Visão Detalhada por Empresa com Chave Tripla (`PartnerMatriz + CreditSegment + PartnerOrigem`):** Por partir da `ZI_FI_PARCEIRO_CREDITO` em `LEFT OUTER JOIN` com `ZI_FI_TITULOS_VENCIDOS`, a visão lista uma linha distinta para a própria Matriz e uma linha distinta para cada filial vinculada, exibindo o saldo vencido, o vencimento mais antigo e os dias em atraso exclusivos de cada empresa (`PartnerOrigem`).
2. **Filtro Estrito do Motivo de Bloqueio (`BLOCK_REASON = '10'`):**
   - Se o cliente estiver bloqueado (`IsBlocked = 'X'`) com `BlockReason` diferente de `'10'` (ex.: bloqueio fiscal ou jurídico), ele **não aparece no aplicativo**.
   - Aparecem apenas clientes desbloqueados (`IsBlocked = ''`) ou clientes bloqueados especificamente por inadimplência (`BlockReason = '10'`).
3. **Cálculo Simétrico da Coluna `AcaoProposta` e `OrdemProposta` pelo Grupo Econômico:** Consome a flag `GrupoInadimplente` da CDS auxiliar `[[15 - ZI_FI_GRUPO_INADIMPLENTE|ZI_FI_GRUPO_INADIMPLENTE]]` (que avalia a régua individualmente por empresa sem somar saldos):
   - **Proposta = `'Bloquear'` (`OrdemProposta = 1`):** Grupo atualmente **desbloqueado** (`IsBlocked is initial`) com `Grupo.GrupoInadimplente = 1` (todas as linhas do grupo sugerem bloquear quando ao menos uma empresa ultrapassa a régua).
   - **Proposta = `'Desbloquear'` (`OrdemProposta = 2`):** Grupo atualmente **bloqueado por inadimplência** (`IsBlocked = 'X'` e `BlockReason = '10'`) com `coalesce( Grupo.GrupoInadimplente, 0 ) = 0` (todas as linhas do grupo sugerem desbloquear somente quando todas as empresas estão abaixo da régua).
   - **Proposta = `''` (`OrdemProposta = 3`):** Demais casos (inclusive grupo já bloqueado em que ainda exista ao menos uma empresa acima da régua).
   - *Importante:* A coluna `AcaoProposta` é uma sugestão analítica direta no banco HANA; os botões de ação continuam livres para a decisão soberana do operador, sendo validados pelo Behavior Pool `[[08 - ZCLFI_BP_CLIENTE_INAD|ZCLFI_BP_CLIENTE_INAD]]` com base na tabela corporativa de parâmetros.

---

## 🛠️ Passo a Passo da Criação do Objeto

### 🔖 Metadados ADT (*ABAP Development Tools* — Obrigatório para MCP `sap-adt`)

```yaml
objectType: "DDLS/DF"
packageName: "ZFI_BLOQ_INADIMPLENTES"
name: "ZI_FI_CLIENTE_INADIMPLENTE"
description: "DEL-R2R-009: Clientes Inadimplentes"
extraParams: {}
```

### 📋 Passo a Passo no ADT / SAP GUI

1. **No Eclipse ADT:** Clique com o botão direito sobre o pacote de desenvolvimento `ZFI_BLOQ_INADIMPLENTES` (ou na pasta `Core Data Services` -> `Data Definitions`) -> **`New`** -> **`Data Definition`**.
2. Preencha os campos da CDS View:
   - **Name:** `ZI_FI_CLIENTE_INADIMPLENTE`
   - **Description:** `DEL-R2R-009: Clientes Inadimplentes`
3. Clique em **Next**, selecione a Ordem de Transporte (TR) do projeto e clique em **Next** para a lista de templates.
4. Selecione o template **`Define Root View Entity`** e clique em **Finish**.
   *(Nota: O modificador `root` na declaração `define root view entity` é fundamental para indicar ao compilador que esta é a entidade principal de negócio que controlará as operações no modelo RAP).*
5. Substitua o esqueleto gerado pelo código completo exibido na seção [Snippet de Código](file:///c:/Users/gabriel.vsouza/source/MeuSegundoCerebro/01_Projects/Insi/Veiling%20Holambra/DEL-R2R-009%20-%20Bloqueio%20e%20Desbloqueio%20massivo%20de%20clientes%20inadimplentes/04%20-%20Objetos%20Tecnicos/06%20-%20ZI_FI_CLIENTE_INADIMPLENTE%20(CDS).md) abaixo.
6. Ative o objeto pressionando **`Ctrl + F3`** *(ou em massa junto à projeção e aos BDEFs quando houver alteração simultânea de chave)*.
7. **Validação dos Dados (`F8 - Data Preview`):** Pressione `F8` sobre a CDS View no editor do Eclipse ADT e valide:
   - Se Matriz e filiais vinculadas aparecem em linhas distintas sem duplicação de chave (`PartnerMatriz + CreditSegment + PartnerOrigem`);
   - Se clientes bloqueados por motivos judiciais/fiscais (motivo diferente de `'10'`) foram devidamente omitidos;
   - Se as colunas calculadas `DiasAtraso` e `AcaoProposta` refletem os valores individuais e a regra simétrica do grupo econômico.

---

## 💻 Snippet de Código

### 📝 Código Comentado (Para Estudo e Referência)
```abap
@AccessControl.authorizationCheck: #NOT_REQUIRED
@EndUserText.label: 'DEL-R2R-009: Clientes Inadimplentes'
@Metadata.ignorePropagatedAnnotations: true
define root view entity ZI_FI_CLIENTE_INADIMPLENTE
  as select from    ZI_FI_PARCEIRO_CREDITO   as Parceiro   // CDS de dados de crédito e parceiros elegíveis (Matriz + Filiais)
    left outer join ZI_FI_TITULOS_VENCIDOS   as Titulos    // CDS de agregação financeira de títulos vencidos por empresa
      on  Titulos.CompanyCode = Parceiro.CompanyCode       // Cruza pela empresa parametrizada (CR-105)
      and Titulos.Customer    = Parceiro.PartnerOrigem     // Cruza os títulos em aberto pelo BP de Origem
    left outer join ZI_FI_GRUPO_INADIMPLENTE as Grupo      // CDS auxiliar com situação de inadimplência do grupo econômico
      on  Grupo.PartnerMatriz = Parceiro.PartnerMatriz     // Cruza pela Matriz do grupo
      and Grupo.CreditSegment = Parceiro.CreditSegment     // Cruza pelo Segmento de Crédito
      and Grupo.CompanyCode   = Parceiro.CompanyCode       // Cruza pela Empresa parametrizada (CR-105)
{
  key Parceiro.PartnerMatriz,                              // Chave 1: BP da Matriz (onde a conta de crédito reside e o bloqueio é aplicado)
  key Parceiro.CreditSegment,                              // Chave 2: Segmento de crédito do FSCM avaliado
  key Parceiro.PartnerOrigem,                              // Chave 3: BP de Origem da dívida (Matriz ou filial vinculada)

      Parceiro.CompanyCode,                                // Empresa do registro (para AUTHORITY-CHECK dinâmico e DCL)
      Parceiro.NomeCliente,                                // Razão social / Nome do cliente para exibição no aplicativo
      Parceiro.RiskClass,                                  // Classe de risco do cliente (1A = À vista, 2A = A prazo)
      Parceiro.GroupFeature,                               // Segmento de atuação (identifica se o cliente é Autosserviço)
      Parceiro.IsBlocked,                                  // Status atual de bloqueio no FSCM (X = Bloqueado, vazio = Liberado)
      Parceiro.BlockReason,                                // Motivo atual de bloqueio no FSCM (ex.: 10 = Inadimplência)

      coalesce( Titulos.CompanyCodeCurrency, cast( 'BRL' as abap.cuky(5) ) ) as Moeda, // Moeda dos títulos (ou default BRL caso em dia)

      @Semantics.amount.currencyCode: 'Moeda'
      coalesce( Titulos.ValorTotalVencido, cast( 0 as abap.curr(15,2) ) )    as ValorTotalVencido, // Saldo vencido da empresa (0 se sem atraso)

      Titulos.MenorDataVencimento,                         // Data da fatura vencida mais antiga da empresa

      // Calcula a quantidade de dias em atraso entre a data de vencimento mais antiga da empresa e a data atual do sistema
      case
        when Titulos.MenorDataVencimento is not null
         and Titulos.MenorDataVencimento <> '00000000'
        then dats_days_between( Titulos.MenorDataVencimento, $session.system_date )
        else 0
      end                                                                    as DiasAtraso,

      // Regra 100% simétrica pelo grupo: todas as linhas do grupo refletem a decisão consolidada da CDS auxiliar
      case
        when Parceiro.IsBlocked         is initial
         and Grupo.GrupoInadimplente    = 1
          then 'Bloquear'
        when Parceiro.IsBlocked         = 'X'
         and Parceiro.BlockReason       = '10'
         and coalesce( Grupo.GrupoInadimplente, 0 ) = 0
          then 'Desbloquear'
        else ''
      end                                                                    as AcaoProposta,

      // Campo auxiliar de ordenação: garante que 'Bloquear' apareça no topo da lista na tela
      case
        when Parceiro.IsBlocked         is initial
         and Grupo.GrupoInadimplente    = 1
          then 1
        when Parceiro.IsBlocked         = 'X'
         and Parceiro.BlockReason       = '10'
         and coalesce( Grupo.GrupoInadimplente, 0 ) = 0
          then 2
        else 3
      end                                                                    as OrdemProposta
}
where
     Parceiro.IsBlocked   is initial                       // Inclui clientes liberados para verificar se devem ser bloqueados
  or Parceiro.BlockReason = '10'                           // Inclui bloqueados por inadimplência (oculta bloqueios fiscais/jurídicos <> 10)
```

---

### 🚀 Código Limpo (Sem Comentários - Para Copiar e Colar)

```abap
@AccessControl.authorizationCheck: #NOT_REQUIRED
@EndUserText.label: 'DEL-R2R-009: Clientes Inadimplentes'
@Metadata.ignorePropagatedAnnotations: true
define root view entity ZI_FI_CLIENTE_INADIMPLENTE
  as select from    ZI_FI_PARCEIRO_CREDITO   as Parceiro
    left outer join ZI_FI_TITULOS_VENCIDOS   as Titulos on  Titulos.CompanyCode = Parceiro.CompanyCode
                                                        and Titulos.Customer    = Parceiro.PartnerOrigem
    left outer join ZI_FI_GRUPO_INADIMPLENTE as Grupo   on  Grupo.PartnerMatriz = Parceiro.PartnerMatriz
                                                        and Grupo.CreditSegment = Parceiro.CreditSegment
                                                        and Grupo.CompanyCode   = Parceiro.CompanyCode
{
  key Parceiro.PartnerMatriz,
  key Parceiro.CreditSegment,
  key Parceiro.PartnerOrigem,

      Parceiro.CompanyCode,
      Parceiro.NomeCliente,
      Parceiro.RiskClass,
      Parceiro.GroupFeature,
      Parceiro.IsBlocked,
      Parceiro.BlockReason,

      coalesce( Titulos.CompanyCodeCurrency, cast( 'BRL' as abap.cuky(5) ) ) as Moeda,

      @Semantics.amount.currencyCode: 'Moeda'
      coalesce( Titulos.ValorTotalVencido, cast( 0 as abap.curr(15,2) ) )    as ValorTotalVencido,

      Titulos.MenorDataVencimento,

      case
        when Titulos.MenorDataVencimento is not null
         and Titulos.MenorDataVencimento <> '00000000'
        then dats_days_between( Titulos.MenorDataVencimento, $session.system_date )
        else 0
      end                                                                    as DiasAtraso,

      case
        when Parceiro.IsBlocked         is initial
         and Grupo.GrupoInadimplente    = 1
          then 'Bloquear'
        when Parceiro.IsBlocked         = 'X'
         and Parceiro.BlockReason       = '10'
         and coalesce( Grupo.GrupoInadimplente, 0 ) = 0
          then 'Desbloquear'
        else ''
      end                                                                    as AcaoProposta,

      case
        when Parceiro.IsBlocked         is initial
         and Grupo.GrupoInadimplente    = 1
          then 1
        when Parceiro.IsBlocked         = 'X'
         and Parceiro.BlockReason       = '10'
         and coalesce( Grupo.GrupoInadimplente, 0 ) = 0
          then 2
        else 3
      end                                                                    as OrdemProposta
}
where
     Parceiro.IsBlocked   is initial
  or Parceiro.BlockReason = '10'
```
