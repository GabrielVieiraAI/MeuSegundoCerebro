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
---

# ⚙️ `ZI_FI_CLIENTE_INADIMPLENTE` (Behavior Definition Root - BDEF)

⬅️ [[DEL-R2R-009 - Arquitetura e Objetos|Voltar para Arquitetura e Objetos]] | 🎨 [[DEL-R2R-009 - Arquitetura da Camada CDS.excalidraw|Ver no Diagrama Excalidraw]]

---

## 📌 Visão Geral do Objeto

O **Behavior Definition (BDEF) Root** `ZI_FI_CLIENTE_INADIMPLENTE` é o objeto que transforma a nossa CDS Raiz (`[[ZI_FI_CLIENTE_INADIMPLENTE (CDS)|ZI_FI_CLIENTE_INADIMPLENTE]]`) de uma simples consulta de leitura em um **Business Object (BO) transacional** dentro do modelo **RAP** (*ABAP RESTful Application Programming Model*).

Como os dados de bloqueio são gravados nas tabelas standard de crédito via classes standard da SAP (`CL_UKM_BUPA_FACTORY` / `CL_UKM_ACCOUNT`) e o log é gravado em `[[ZTFI_LOG_INADIMP]]`, utilizamos o cenário **`unmanaged implementation in class zclfi_bp_cliente_inad unique`**, declarando as duas ações customizadas: **`bloquearCliente`** e **`desbloquearCliente`**.

---

## ⚖️ Regras de Negócio Aplicadas

1. **Somente Ações de Negócio (Sem Create/Update/Delete Genérico):** O usuário não cria nem exclui clientes pela lista; ele apenas seleciona clientes e dispara as ações **`bloquearCliente`** ou **`desbloquearCliente`**.
2. **Sem Pop-up de Motivo na Ação `bloquearCliente`:** Como o motivo de bloqueio de inadimplência foi fixado em **`10`** pela consultora, a ação `bloquearCliente` não exige parâmetro de entrada (executa direto ao clicar e confirmar).
3. **Atualização Imediata da Linha na Tela (`result [1] $self`):** Ao retornar `$self`, o Fiori Elements atualiza automaticamente o status do cliente na tabela após o clique em Bloquear ou Desbloquear, sem o usuário precisar recarregar a página manualmente.
4. **Verificação de Autorização:** Declara `authorization master ( instance )` para validar o objeto `[[ZFI_BLOQ]]` antes da execução.

---

## 💻 Snippet de Código

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
