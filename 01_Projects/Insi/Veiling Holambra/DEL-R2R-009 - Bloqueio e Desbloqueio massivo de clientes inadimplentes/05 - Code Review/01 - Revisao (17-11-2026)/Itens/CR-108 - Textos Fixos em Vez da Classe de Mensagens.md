---
tags:
  - projeto
  - insi
  - veiling-holambra
  - sap
  - code-review
  - del-r2r-009
  - recomendado
id_demanda: DEL-R2R-009
revisao: Code Review 1
request: S4DK900952
tarefa: S4DK900953
item_cr: CR-108
prioridade: Recomendado (Ponto de Atenção)
status: concluido
data: 2026-11-18
sap_destination: Veiling_S4D_100_GVSOUZA_PT
transport_requests:
  - S4DK900952 - DEL-R2R-009 - Bloqueio e Desbloqueio de Inadimplentes
---

# 🟡 CR-108: Textos Fixos no Código em Vez da Classe de Mensagens

🗺️ [[00 - DEL-R2R-009 - Escada Code Review 1.excalidraw|Voltar para a Escada]] | 📄 [[Code Review 1.pdf|PDF Original]] | ⬅️ [[CR-107 - Falta de Controle de Acesso (DCL) nas CDS Views|CR-107]] | ➡️ [[CR-109 - Catch Vazio e Exceções Genéricas na Classe|CR-109]]

---

## 1. O que está sendo apontado (Linguagem de Negócio)

Algumas mensagens exibidas ao usuário na tela de resumo e gravadas no histórico de auditoria estão escritas com textos avulsos em vez de utilizarem o cadastro centralizado de mensagens padronizadas do sistema:

* **Falta de padronização e impossibilidade de tradução das mensagens:** Os avisos de erro ao bloquear ou desbloquear, de cliente pertencente a classe de risco excluída e de bloqueio por motivo diferente de inadimplência foram digitados diretamente na rotina, embora já existam mensagens oficiais cadastradas especificamente para esses cenários e que ainda não estão sendo utilizadas.

---

## 2. O que eu preciso fazer (Linguagem de Negócio)

Para padronizar toda a comunicação exibida ao usuário na tela de resumo e registrada no histórico de auditoria, eliminando textos avulsos e permitindo manutenção centralizada e tradução, devem ser feitos os seguintes ajustes:

1. **Utilizar as mensagens oficiais cadastradas em todos os avisos de erro e exceção:**
   * Substituir os textos fixos de falha de bloqueio ou desbloqueio, de cliente pertencente a classe de risco excluída e de cliente já bloqueado por motivo de outra área pelas mensagens padronizadas do cadastro central de mensagens do sistema, preenchendo dinamicamente o código do cliente e o motivo ou detalhe da ocorrência.
2. **Gravar no histórico de auditoria o mesmo texto padronizado:**
   * Garantir que a descrição gravada no histórico de auditoria utilize exatamente o texto gerado a partir do cadastro oficial de mensagens, mantendo total uniformidade entre o aviso apresentado na tela de resumo e o registro histórico da operação.

---

## 3. Plano de Ação

### Mapa Completo de Mensagens da Classe `[[03 - ZFI_INADIMPLENCIA|ZFI_INADIMPLENCIA]]` (`SE91` / `zfi_inadimplencia.msag.json`)

Para eliminar 100% dos literais e *string templates* fixos da classe `[[08 - ZCLFI_BP_CLIENTE_INAD|ZCLFI_BP_CLIENTE_INAD]]` (tanto no *Message View* da tela quanto na coluna `MENSAGEM` da tabela `[[01 - ZTFI_LOG_INADIMP|ZTFI_LOG_INADIMP]]`), a classe de mensagens `[[03 - ZFI_INADIMPLENCIA|ZFI_INADIMPLENCIA]]` passará a contemplar os números `001` a `010`, todos respeitando o limite máximo de 73 caracteres da transação **`SE91`** (*Message Maintenance* — manutenção de mensagens):

| Nº | Texto da Mensagem (máx. 73 caracteres) | Chars | Uso na Solução (`reported` e/ou `ZTFI_LOG_INADIMP`) |
| :---: | :--- | :---: | :--- |
| `001` | `Cliente &1 bloqueado com sucesso no segmento &2 (Motivo 10).` | 60 | Sucesso ao bloquear (`reported` e `lt_log` da Matriz) |
| `002` | `Cliente &1 desbloqueado com sucesso no segmento &2.` | 51 | Sucesso ao desbloquear (`reported` e `lt_log` da Matriz) |
| `003` | `Erro ao atualizar bloqueio do cliente &1: &2` | 44 | Falha ao bloquear/desbloquear no **FSCM** (*SAP Credit Management*) (`reported` e `lt_log`) |
| `004` | `Sem autorização para bloquear clientes na empresa &1 / segmento &2.` | 67 | Falha de permissão na ação de bloqueio (atividade `05`) |
| `005` | `Sem autorização para desbloquear clientes na empresa &1 / segmento &2.` | 70 | Falha de permissão na ação de desbloqueio (atividade `43`) |
| `006` | `Cliente &1 possui bloqueio por motivo &2 (diferente de 10-Inadimplência).` | 73 | Membro bloqueado por outro motivo (`<> '10'`) (`lt_log` e `reported` quando todo o grupo é impedido) |
| `007` | `Cliente &1 pertence à classe de risco &2 (excluída) e não é bloqueado.` | 70 | Cliente ou filial em classe de risco excluída (`RISK_CLASS/EXCLUIR`) (`reported` e `lt_log`) |
| `008` | `Cliente &1 já se encontra bloqueado por inadimplência (Motivo &2).` | 66 | Membro já bloqueado previamente pelo motivo `10` durante o bloqueio (`lt_log`) |
| `009` | `Bloqueio em cascata do cliente &1 (Grupo Econômico Matriz &2).` | 62 | Sucesso no bloqueio em cascata de filial vinculada (`lt_log`) |
| `010` | `Desbloqueio em cascata do cliente &1 (Grupo Econômico Matriz &2).` | 65 | Sucesso no desbloqueio em cascata de filial vinculada (`lt_log`) |

### O que será feito em cada objeto

1. **[[03 - ZFI_INADIMPLENCIA|ZFI_INADIMPLENCIA]] *(Classe de Mensagens `MSAG` — Ajustar)*:**
   * **Ajuste do texto da mensagem `006`:** Substituir `"Cliente &1 possui bloqueio por motivo &2 (diferente de 10 - Inadimplência"` por `"Cliente &1 possui bloqueio por motivo &2 (diferente de 10-Inadimplência)."` (73 caracteres exatos), corrigindo o parêntese final que havia sido truncado pelo limite da `SE91`.
   * **Inclusão das mensagens `007` a `010`:** Cadastrar no arquivo **AFF** (*ABAP File Format*) `zfi_inadimplencia.msag.json` (ou via `SE91` / Eclipse ADT) as mensagens padronizadas para classe de risco excluída (`007`), cliente já bloqueado pelo motivo `10` (`008`), bloqueio em cascata de filial (`009`) e desbloqueio em cascata de filial (`010`).

2. **[[08 - ZCLFI_BP_CLIENTE_INAD|ZCLFI_BP_CLIENTE_INAD]] *(Behavior Pool — Aba `Local Types` / `CCIMP` — Ajustar métodos `bloquearCliente` e `desbloquearCliente`)*:**
   * **Substituição na validação de Classe de Risco Excluída (`bloquearCliente` — Matriz e Membro):**
     * Na validação inicial da linha selecionada (`IF <ls_cliente>-RiskClass IN lr_classes_excluidas`) e na validação individual do membro na `UKMBP_CMS` (`IF lv_risk_class_membro IS NOT INITIAL AND lv_risk_class_membro IN lr_classes_excluidas`), substituir o *string template* fixo por `MESSAGE ID 'ZFI_INADIMPLENCIA' TYPE 'W' NUMBER '007' WITH <parceiro> <classe_risco> INTO DATA(lv_msg_007).`, gravando `lv_msg_007` em `lt_log-mensagem`.
     * No retorno para a tela (`reported-clienteinadimplente`) da linha selecionada em classe excluída, substituir `new_message_with_text` por `new_message( id = 'ZFI_INADIMPLENCIA' number = '007' severity = if_abap_behv_message=>severity-warning v1 = <ls_cliente>-PartnerMatriz v2 = <ls_cliente>-RiskClass )`.
   * **Substituição nos logs do laço de grupo econômico (`bloquearCliente` e `desbloquearCliente`):**
     * **Membro já bloqueado pelo motivo `10` (`bloquearCliente`):** Substituir o *string template* fixo por `MESSAGE ID 'ZFI_INADIMPLENCIA' TYPE 'S' NUMBER '008' WITH lv_bp_membro gc_motivo_inadimplencia INTO DATA(lv_msg_bloq_008).` e gravar `lv_msg_bloq_008` em `lt_log-mensagem`.
     * **Sucesso ao bloquear (`bloquearCliente`):** Quando `lv_bp_membro = <ls_cliente>-PartnerMatriz`, formatar `lt_log-mensagem` com a mensagem **`001`** (`WITH lv_bp_membro <ls_cliente>-CreditSegment`); quando for filial em cascata (`lv_bp_membro <> <ls_cliente>-PartnerMatriz`), formatar com a mensagem **`009`** (`WITH lv_bp_membro lv_matriz`).
     * **Sucesso ao desbloquear (`desbloquearCliente`):** Quando `lv_bp_membro_desb = <ls_cliente>-PartnerMatriz`, formatar `lt_log-mensagem` com a mensagem **`002`** (`WITH lv_bp_membro_desb <ls_cliente>-CreditSegment`); quando for filial em cascata (`lv_bp_membro_desb <> <ls_cliente>-PartnerMatriz`), formatar com a mensagem **`010`** (`WITH lv_bp_membro_desb lv_matriz_desb`).
     * **Falha técnica capturada no `CATCH` (`bloquearCliente` e `desbloquearCliente`):** Formatar `lt_log-mensagem` via `MESSAGE ID 'ZFI_INADIMPLENCIA' TYPE 'E' NUMBER '003' WITH <parceiro> <texto_excecao> INTO DATA(lv_msg_erro_003).` e guardar o detalhe da falha na variável de controle da linha (`lv_ultimo_erro`).
   * **Substituição do `new_message_with_text` no bloco `ELSE` de falha da linha (`IF lv_bloqueio_ok = abap_true ... ELSE` e `IF lv_desbloqueio_ok = abap_true ... ELSE`):**
     * Substituir `new_message_with_text( ... text = |Erro ao bloquear/desbloquear cliente...| )` por chamadas `new_message( id = 'ZFI_INADIMPLENCIA' ... )` em `reported-clienteinadimplente` de acordo com a causa que impediu a operação na linha selecionada:
       * Se o impedimento ocorreu por bloqueio pré-existente com motivo diferente de `10`: emitir a mensagem **`006`** (`severity = if_abap_behv_message=>severity-error`, `v1 = lv_bp_motivo_dif`, `v2 = lv_motivo_dif`).
       * Se o impedimento ocorreu por membro em classe de risco excluída: emitir a mensagem **`007`** (`severity = if_abap_behv_message=>severity-warning`, `v1 = lv_bp_classe_excl`, `v2 = lv_classe_excl`).
       * Nos demais casos de erro (ex.: falha técnica no FSCM): emitir a mensagem **`003`** (`severity = if_abap_behv_message=>severity-error`, `v1 = <ls_cliente>-PartnerMatriz`, `v2 = lv_ultimo_erro`).

### Dependências / Decisões

* **Dependências:** Construído sobre o código ativo da `[[08 - ZCLFI_BP_CLIENTE_INAD|ZCLFI_BP_CLIENTE_INAD]]` pós-[[CR-101 - Chave Duplicada na CDS Raiz|CR-101]], [[CR-102 - Cascata Altera Bloqueios Externos|CR-102]], [[CR-103 - Flag de Sucesso Não Reinicia na Seleção Múltipla|CR-103]], [[CR-104 - Gravação Fora da Fase de Save e Sem Lock|CR-104]] e [[CR-105 - Hardcode nas CDS Views e no Authority-Check|CR-105]]. O refinamento de `CATCH cx_uuid_error` vazio e de `CATCH cx_root` para exceções específicas do FSCM será tratado em sequência no [[CR-109 - Catch Vazio e Exceções Genéricas na Classe|CR-109]].
* **Preservação da regra do [[CR-102 - Cascata Altera Bloqueios Externos|CR-102]] no *Message View*:** Quando o bloqueio ou desbloqueio do grupo econômico tiver sucesso (`lv_bloqueio_ok = abap_true` ou `lv_desbloqueio_ok = abap_true`), a tela continua exibindo apenas a mensagem `001` ou `002` da linha selecionada (sem *warnings* extras por filial ignorada, que ficam registradas no log `[[01 - ZTFI_LOG_INADIMP|ZTFI_LOG_INADIMP]]`). As mensagens `003`, `006` e `007` só são exibidas no *Message View* quando a linha selecionada inteira não puder ser processada (`ELSE`).
* **Eliminação integral dos achados `1700` e `1713` no ATC:** A substituição de todos os literais e *string templates* por `MESSAGE ID 'ZFI_INADIMPLENCIA' ... INTO ...` e `new_message` elimina as **11 ocorrências P3 (`1700`/`1713`)** da verificação ampliada de programa (**SLIN** — *Extended Program Check*) atualmente apontadas pelo **ATC** (*ABAP Test Cockpit*) na `[[08 - ZCLFI_BP_CLIENTE_INAD|ZCLFI_BP_CLIENTE_INAD]]` (8 ocorrências originais do Code Review + 3 adicionadas nos logs do CR-102).

---

## 4. Teste Pós Ajuste

> Além do roteiro geral de testes do revisor em [[CR-117 - Checklist de Testes no QAS|CR-117]], os cenários abaixo validam diretamente no **QAS** (*Quality Assurance System* — ambiente de qualidade) e no **ATC** (*ABAP Test Cockpit*) a padronização de mensagens recomendada pelo supervisor técnico referente ao **CR-108**.

### Teste solicitado pelo Supervisor Técnico (ref. ao CR-108)

* **1. Uso da classe `[[03 - ZFI_INADIMPLENCIA|ZFI_INADIMPLENCIA]]` na tela e no log** *(item 8 da Seção 3 do [[Code Review 1.pdf|Code Review 1]])* — **Registro:** —
  - [x] **1.1. Mensagens de erro e exceção no *Message View*:** Provocar cenários de erro ao bloquear/desbloquear (mensagem `003`), classe de risco excluída (mensagem `007`) e motivo diferente de `10` (mensagem `006`), confirmando que a tela exibe os textos oriundos da `[[03 - ZFI_INADIMPLENCIA|ZFI_INADIMPLENCIA]]` com os marcadores (`&1`, `&2`) preenchidos. ✅ 2026-11-19
  - [x] **1.2. Gravação do texto da mensagem no log (`[[01 - ZTFI_LOG_INADIMP|ZTFI_LOG_INADIMP]]`):** Confirmar que o campo `MENSAGEM` na tabela de log recebe exatamente os textos formatados pelas mensagens `001`, `002`, `003`, `006`, `007`, `008`, `009` e `010` da classe de mensagens, sem strings fixas no código. ✅ 2026-11-19
  - [ ] **1.3. Reexecução do **ATC** (*ABAP Test Cockpit*):** Rodar o ATC na `[[08 - ZCLFI_BP_CLIENTE_INAD|ZCLFI_BP_CLIENTE_INAD]]` e confirmar a eliminação total das ocorrências P3 (`1700`/`1713` — textos não traduzíveis) apontadas na revisão.

### Testes adicionais do que foi implementado aqui (além do pedido pelo supervisor)

* **1. Integridade dos textos cadastrados na transação `SE91`** — **Registro:** —
  - [ ] **1.1. Conferência visual na `SE91` e tradução:** Validar que todas as mensagens (`001` a `010`) cadastradas na `[[03 - ZFI_INADIMPLENCIA|ZFI_INADIMPLENCIA]]` estão completas dentro do limite de 73 caracteres (incluindo o fechamento do parêntese na mensagem `006`) e exibem corretamente no idioma de logon `PT`.
