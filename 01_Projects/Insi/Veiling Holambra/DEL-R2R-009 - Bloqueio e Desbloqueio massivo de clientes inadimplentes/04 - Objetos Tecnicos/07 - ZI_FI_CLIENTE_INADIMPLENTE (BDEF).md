---
tags:
  - projeto
  - insi
  - veiling-holambra
  - sap
  - rap
  - bdef
  - abap-cloud
  - del-r2r-009
  - objeto-tecnico
id_demanda: DEL-R2R-009
objeto: ZI_FI_CLIENTE_INADIMPLENTE (BDEF)
camada: 3 - Comportamento de Negócio (RAP)
data: 2026-10-23

aliases:
  - "ZI_FI_CLIENTE_INADIMPLENTE (BDEF)"
---

# ⚙️ `ZI_FI_CLIENTE_INADIMPLENTE` (Behavior Definition Root - BDEF)

⬅️ [[DEL-R2R-009 - Arquitetura e Objetos|Voltar para Arquitetura e Objetos]] | 🎨 [[01 - DEL-R2R-009 - Arquitetura da Camada CDS.excalidraw|Ver no Diagrama Excalidraw]]

---

## 📌 Visão Geral do Objeto

O **Behavior Definition (BDEF) Root** `ZI_FI_CLIENTE_INADIMPLENTE` é o objeto que transforma a nossa CDS Raiz (`[[06 - ZI_FI_CLIENTE_INADIMPLENTE (CDS)|ZI_FI_CLIENTE_INADIMPLENTE]]`) de uma simples consulta de leitura em um **Business Object (BO) transacional** dentro do modelo **RAP** (*ABAP RESTful Application Programming Model*).

Como os dados de bloqueio são gravados nas tabelas standard de crédito via classes standard da SAP (`CL_UKM_BUPA_FACTORY` / `CL_UKM_ACCOUNT`) e o log é gravado em `[[01 - ZTFI_LOG_INADIMP|ZTFI_LOG_INADIMP]]`, utilizamos o cenário **`unmanaged implementation in class zclfi_bp_cliente_inad unique`**, declarando as duas ações customizadas: **`bloquearCliente`** e **`desbloquearCliente`**.

---

## ⚖️ Regras de Negócio Aplicadas

1. **Somente Ações de Negócio (Sem Create/Update/Delete Genérico):** O usuário não cria nem exclui clientes pela lista; ele apenas seleciona clientes e dispara as ações **`bloquearCliente`** ou **`desbloquearCliente`**.
2. **Sem Pop-up de Motivo na Ação `bloquearCliente`:** Como o motivo de bloqueio de inadimplência foi fixado em **`10`** pela consultora, a ação `bloquearCliente` não exige parâmetro de entrada (executa direto ao clicar e confirmar).
3. **Atualização Imediata da Linha na Tela (`result [1] $self`):** Ao retornar `$self`, o Fiori Elements atualiza automaticamente o status do cliente na tabela após o clique em Bloquear ou Desbloquear, sem o usuário precisar recarregar a página manualmente.
4. **Verificação de Autorização:** Declara `authorization master ( instance )` para validar o objeto `[[02 - ZFI_BLOQ|ZFI_BLOQ]]` antes da execução.

---

## 🛠️ Passo a Passo da Criação do Objeto

1. **No Eclipse ADT:** Clique com o botão direito sobre a CDS View raiz `ZI_FI_CLIENTE_INADIMPLENTE` -> **`New Behavior Definition`**.
2. No diálogo de criação:
   - **Root Entity:** `ZI_FI_CLIENTE_INADIMPLENTE` *(preenchido automaticamente)*.
   - **Description:** `DEL-R2R-009: Behavior Root Inadimplentes`
   - **Implementation Type:** Pode manter o padrão sugerido pelo assistente, pois o modificador `unmanaged` será definido diretamente na sintaxe do arquivo.
3. Clique em **Next**, selecione a Ordem de Transporte (TR) do projeto e clique em **Finish**.
4. Substitua o esqueleto padrão gerado pelo código presente na seção [Snippet de Código](file:///c:/Users/gabriel.vsouza/source/MeuSegundoCerebro/01_Projects/Insi/Veiling%20Holambra/DEL-R2R-009%20-%20Bloqueio%20e%20Desbloqueio%20massivo%20de%20clientes%20inadimplentes/Objetos/ZI_FI_CLIENTE_INADIMPLENTE%20(BDEF).md#L55-L90) abaixo.
   *(Nota técnica: A cláusula `unmanaged implementation in class zclfi_bp_cliente_inad unique;` avisa ao compilador do RAP que não gravaremos dados em tabelas proprietárias via engine padrão, e sim chamaremos métodos ABAP customizados na classe Behavior Pool).*
5. Ative o objeto pressionando **`Ctrl + F3`**.
   *(Dica de Desenvolvedor: Se a classe `ZCLFI_BP_CLIENTE_INAD` ainda não tiver sido criada, o Eclipse sublinhará o nome dela em amarelo/vermelho. Posicione o cursor sobre ela e pressione **`Ctrl + 1`** -> **`Create behavior implementation class`** para gerá-la no passo seguinte).*

---

## 💻 Snippet de Código

### 📝 Código Comentado (Para Estudo e Referência)
```abap
unmanaged implementation in class zclfi_bp_cliente_inad unique;  // Cenário unmanaged: persistência manual via APIs standard e log Z
strict ( 2 );                                                      // Habilita as verificações de sintaxe estritas do RAP versão 2

define behavior for ZI_FI_CLIENTE_INADIMPLENTE alias ClienteInadimplente // Comportamento transacional da entidade raiz
lock master                                                        // Controle de concorrência e bloqueio de registros da entidade raiz
authorization master ( instance )                                  // Valida autorização por linha (método get_instance_authorizations)
{
  field ( readonly )                                               // Define todos os campos como somente leitura na tela
    PartnerMatriz,
    CreditSegment,
    PartnerOrigem,
    NomeCliente,
    RiskClass,
    GroupFeature,
    IsBlocked,
    BlockReason,
    Moeda,
    ValorTotalVencido,
    MenorDataVencimento,
    DiasAtraso,
    AcaoProposta,
    OrdemProposta;

  action bloquearCliente    result [1] $self;                      // Ação em massa: bloqueia cliente no FSCM e atualiza a linha na tela
  action desbloquearCliente result [1] $self;                      // Ação em massa: desbloqueia cliente no FSCM e atualiza a linha na tela
}
```

---

### 🚀 Código Limpo (Sem Comentários - Para Copiar e Colar)

```abap
unmanaged implementation in class zclfi_bp_cliente_inad unique;
strict ( 2 );

define behavior for ZI_FI_CLIENTE_INADIMPLENTE alias ClienteInadimplente
lock master
authorization master ( instance )
{
  field ( readonly )
    PartnerMatriz,
    CreditSegment,
    PartnerOrigem,
    NomeCliente,
    RiskClass,
    GroupFeature,
    IsBlocked,
    BlockReason,
    Moeda,
    ValorTotalVencido,
    MenorDataVencimento,
    DiasAtraso,
    AcaoProposta,
    OrdemProposta;

  action bloquearCliente    result [1] $self;
  action desbloquearCliente result [1] $self;
}
```
