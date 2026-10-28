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
---

# 🌳 `ZI_FI_CLIENTE_INADIMPLENTE` (CDS Interface Root)

⬅️ [[DEL-R2R-009 - Arquitetura e Objetos|Voltar para Arquitetura e Objetos]] | 🎨 [[DEL-R2R-009 - Arquitetura da Camada CDS.excalidraw|Ver no Diagrama Excalidraw]]

---

## 📌 Visão Geral do Objeto

A **`ZI_FI_CLIENTE_INADIMPLENTE`** é a **CDS View Raiz (`root view entity`)** do nosso modelo **RAP** (*ABAP RESTful Application Programming Model*).

Ela é o coração analítico do aplicativo: faz o cruzamento (`LEFT OUTER JOIN`) entre o cadastro de clientes de crédito (`[[ZI_FI_PARCEIRO_CREDITO]]`) e a soma dos títulos vencidos (`[[ZI_FI_TITULOS_VENCIDOS]]`), filtra clientes bloqueados por outros motivos e calcula a coluna **`AcaoProposta`** (`Bloquear` ou `Desbloquear`) com base na régua de risco. É sobre esta entidade que o comportamento transacional (`[[ZI_FI_CLIENTE_INADIMPLENTE (BDEF)]]`) é definido.

---

## ⚖️ Regras de Negócio Aplicadas

1. **Uma Linha por Cliente (Com ou Sem Títulos Vencidos):** Por usar `LEFT OUTER JOIN` partindo da carteira de clientes, a visão lista os clientes tendo eles títulos vencidos em aberto ou não (permitindo visualizar tanto quem precisa ser bloqueado quanto quem já pagou e precisa ser desbloqueado, ou mesmo executar ações manuais).
2. **Filtro Estrito do Motivo de Bloqueio (`BLOCK_REASON = '10'`):**
   - Se o cliente estiver bloqueado (`IsBlocked = 'X'`) com `BlockReason` diferente de `'10'` (ex.: bloqueio fiscal ou jurídico), ele **não aparece no aplicativo**.
   - Aparecem apenas clientes desbloqueados (`IsBlocked = ''`) ou clientes bloqueados especificamente por inadimplência (`BlockReason = '10'`).
3. **Cálculo da Coluna `AcaoProposta` (Régua por Perfil de Crédito):**
   - **Proposta = `'Bloquear'`:** Cliente atualmente **desbloqueado** (`IsBlocked = ''`) que possui saldo vencido maior que R$ 0,00 (para `RiskClass = '1A'` À Vista) ou maior/igual a **R$ 500,01** (para `RiskClass = '2A'` A Prazo).
   - **Proposta = `'Desbloquear'`:** Cliente atualmente **bloqueado por inadimplência** (`IsBlocked = 'X'` e `BlockReason = '10'`) que regularizou sua dívida (não ultrapassa mais a régua do seu perfil).
   - *Importante:* A coluna `AcaoProposta` é uma sugestão analítica direta no banco HANA; os botões de ação continuam livres para a decisão soberana do operador, sendo validados pelo Behavior Pool `[[ZCLFI_BP_CLIENTE_INAD]]` com base na tabela corporativa de parâmetros.

---

## 🛠️ Passo a Passo da Criação do Objeto

1. **No Eclipse ADT:** Clique com o botão direito sobre o pacote de desenvolvimento `ZFI_BLOQ_INADIMPLENTES` (ou na pasta `Core Data Services` -> `Data Definitions`) -> **`New`** -> **`Data Definition`**.
2. Preencha os campos da CDS View:
   - **Name:** `ZI_FI_CLIENTE_INADIMPLENTE`
   - **Description:** `DEL-R2R-009: Clientes Inadimplentes (Root Interface)`
3. Clique em **Next**, selecione a Ordem de Transporte (TR) do projeto e clique em **Next** para a lista de templates.
4. Selecione o template **`Define Root View Entity`** e clique em **Finish**.
   *(Nota: O modificador `root` na declaração `define root view entity` é fundamental para indicar ao compilador que esta é a entidade principal de negócio que controlará as operações no modelo RAP).*
5. Substitua o esqueleto gerado pelo código completo exibido na seção [Snippet de Código](file:///c:/Users/gabriel.vsouza/source/MeuSegundoCerebro/01_Projects/Insi/Veiling%20Holambra/DEL-R2R-009%20-%20Bloqueio%20e%20Desbloqueio%20massivo%20de%20clientes%20inadimplentes/Objetos/ZI_FI_CLIENTE_INADIMPLENTE%20(CDS).md#L62-L130) abaixo.
6. Ative o objeto pressionando **`Ctrl + F3`**.
7. **Validação dos Dados (`F8 - Data Preview`):** Pressione `F8` sobre a CDS View no editor do Eclipse ADT e valide:
   - Se os clientes sem pendência e clientes inadimplentes aparecem na listagem;
   - Se clientes bloqueados por motivos judiciais/fiscais (motivo diferente de `'10'`) foram devidamente omitidos;
   - Se as colunas calculadas `DiasAtraso` e `AcaoProposta` estão respondendo conforme a régua de corte esperada.

---

## 💻 Snippet de Código

### 📝 Código Comentado (Para Estudo e Referência)
```abap
@AccessControl.authorizationCheck: #CHECK
@EndUserText.label: 'DEL-R2R-009: Clientes Inadimplentes'
@Metadata.ignorePropagatedAnnotations: true
define root view entity ZI_FI_CLIENTE_INADIMPLENTE
  as select from    ZI_FI_PARCEIRO_CREDITO as Parceiro   // CDS de dados de crédito e parceiros elegíveis (Passo 05)
    left outer join ZI_FI_TITULOS_VENCIDOS as Titulos    // CDS de agregação financeira de títulos vencidos (Passo 04)
      on Titulos.Customer = Parceiro.PartnerOrigem       // Cruza os títulos em aberto pelo BP da filial devedora
{
  key Parceiro.PartnerMatriz,                            // Chave 1: BP da Matriz (onde a conta de crédito reside e onde o bloqueio é aplicado)
  key Parceiro.CreditSegment,                            // Chave 2: Segmento de crédito do FSCM avaliado (1000)

      Parceiro.PartnerOrigem,                            // BP de Origem: filial que originou a dívida contábil (ou Matriz se não houver filial)
      Parceiro.NomeCliente,                              // Razão social / Nome do cliente para exibição no aplicativo
      Parceiro.RiskClass,                                // Classe de risco do cliente (1A = À vista, 2A = A prazo)
      Parceiro.GroupFeature,                             // Segmento de atuação (identifica se o cliente é Autosserviço)
      Parceiro.IsBlocked,                                // Status atual de bloqueio no FSCM (X = Bloqueado, vazio = Liberado)
      Parceiro.BlockReason,                              // Motivo atual de bloqueio no FSCM (ex.: 10 = Inadimplência)

      coalesce( Titulos.CompanyCodeCurrency, cast( 'BRL' as abap.cuky(5) ) ) as Moeda, // Moeda dos títulos (ou default BRL caso em dia)

      @Semantics.amount.currencyCode: 'Moeda'
      coalesce( Titulos.ValorTotalVencido, cast( 0 as abap.curr(15,2) ) )    as ValorTotalVencido, // Saldo vencido consolidado (0 se sem atraso)

      Titulos.MenorDataVencimento,                       // Data da fatura vencida mais antiga (base para o cálculo de dias de atraso)

      // Calcula a quantidade de dias em atraso entre a data de vencimento mais antiga e a data atual do sistema
      case
        when Titulos.MenorDataVencimento is not null
         and Titulos.MenorDataVencimento <> '00000000'
        then dats_days_between( Titulos.MenorDataVencimento, $session.system_date )
        else 0
      end                                                                    as DiasAtraso,

      // Régua de Inadimplência: sugere 'Bloquear', 'Desbloquear' ou '' (sem proposta) para orientar o operador
      case
        when Parceiro.IsBlocked is initial
         and ( ( Parceiro.RiskClass = '1A' and Titulos.ValorTotalVencido > 0 )
            or ( Parceiro.RiskClass = '2A' and Titulos.ValorTotalVencido >= 500.01 ) )
          then 'Bloquear'
        when Parceiro.IsBlocked    = 'X'
         and Parceiro.BlockReason  = '10'
         and ( Titulos.ValorTotalVencido is null
            or ( Parceiro.RiskClass = '1A' and Titulos.ValorTotalVencido <= 0 )
            or ( Parceiro.RiskClass = '2A' and Titulos.ValorTotalVencido < 500.01 ) )
          then 'Desbloquear'
        else ''
      end                                                                    as AcaoProposta,

      // Campo auxiliar de ordenação: garante que 'Bloquear' apareça no topo da lista na tela
      case
        when Parceiro.IsBlocked is initial
         and ( ( Parceiro.RiskClass = '1A' and Titulos.ValorTotalVencido > 0 )
            or ( Parceiro.RiskClass = '2A' and Titulos.ValorTotalVencido >= 500.01 ) )
          then 1
        when Parceiro.IsBlocked    = 'X'
         and Parceiro.BlockReason  = '10'
          then 2
        else 3
      end                                                                    as OrdemProposta
}
where
     Parceiro.IsBlocked   is initial                     // Inclui clientes liberados para verificar se devem ser bloqueados
  or Parceiro.BlockReason = '10'                         // Inclui bloqueados por inadimplência (oculta bloqueios fiscais/jurídicos <> 10)
```

---

### 🚀 Código Limpo (Sem Comentários - Para Copiar e Colar)

```abap
@AccessControl.authorizationCheck: #CHECK
@EndUserText.label: 'DEL-R2R-009: Clientes Inadimplentes'
@Metadata.ignorePropagatedAnnotations: true
define root view entity ZI_FI_CLIENTE_INADIMPLENTE
  as select from    ZI_FI_PARCEIRO_CREDITO as Parceiro
    left outer join ZI_FI_TITULOS_VENCIDOS as Titulos
      on Titulos.Customer = Parceiro.PartnerOrigem
{
  key Parceiro.PartnerMatriz,
  key Parceiro.CreditSegment,

      Parceiro.PartnerOrigem,
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
        when Parceiro.IsBlocked is initial
         and ( ( Parceiro.RiskClass = '1A' and Titulos.ValorTotalVencido > 0 )
            or ( Parceiro.RiskClass = '2A' and Titulos.ValorTotalVencido >= 500.01 ) )
          then 'Bloquear'
        when Parceiro.IsBlocked    = 'X'
         and Parceiro.BlockReason  = '10'
         and ( Titulos.ValorTotalVencido is null
            or ( Parceiro.RiskClass = '1A' and Titulos.ValorTotalVencido <= 0 )
            or ( Parceiro.RiskClass = '2A' and Titulos.ValorTotalVencido < 500.01 ) )
          then 'Desbloquear'
        else ''
      end                                                                    as AcaoProposta,

      case
        when Parceiro.IsBlocked is initial
         and ( ( Parceiro.RiskClass = '1A' and Titulos.ValorTotalVencido > 0 )
            or ( Parceiro.RiskClass = '2A' and Titulos.ValorTotalVencido >= 500.01 ) )
          then 1
        when Parceiro.IsBlocked    = 'X'
         and Parceiro.BlockReason  = '10'
          then 2
        else 3
      end                                                                    as OrdemProposta
}
where
     Parceiro.IsBlocked   is initial
  or Parceiro.BlockReason = '10'
```
