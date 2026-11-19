---
tags:
  - projeto
  - insi
  - veiling-holambra
  - sap
  - code-review
  - del-r2r-009
  - critico
id_demanda: DEL-R2R-009
revisao: Code Review 1
request: S4DK900952
tarefa: S4DK900953
item_cr: CR-102
prioridade: Obrigatório (Crítico)
status: concluido
data: 2026-11-18
---

# 🔴 CR-102: Bloqueio em Cascata Altera Bloqueios de Outros Motivos

🗺️ [[00 - DEL-R2R-009 - Escada Code Review 1.excalidraw|Voltar para a Escada]] | 📄 [[Code Review 1.pdf|PDF Original]] | 🚀 [[CR-102 - Guia de Implementação|Guia de Implementação]] | ⬅️ [[CR-101 - Chave Duplicada na CDS Raiz|CR-101]] | ➡️ [[CR-103 - Flag de Sucesso Não Reinicia na Seleção Múltipla|CR-103]]

---

## 1. O que está sendo apontado (Linguagem de Negócio)

Ao acionar as ações de bloqueio ou desbloqueio para um cliente que faz parte de um grupo econômico (Cliente Matriz e suas Filiais), o sistema replica a operação em cascata para todas as empresas vinculadas ao grupo. Na revisão do comportamento atual, foram identificados os seguintes problemas nessa regra:

* **Falta de verificação individual de cada filial:** A regra atual verifica apenas a situação do Cliente Matriz, mas aplica a operação em todas as filiais do grupo sem checar a situação individual de crédito de cada uma delas.
* **Remoção indevida de bloqueios de outras áreas no desbloqueio:** Se uma filial estiver bloqueada por um motivo diferente de inadimplência (por exemplo, bloqueio jurídico, suspeita de fraude ou outra restrição manual), ao desbloquear o grupo, o sistema remove esse bloqueio junto e libera a filial indevidamente.
* **Perda do motivo original de bloqueio ao bloquear o grupo:** Se uma filial já estiver bloqueada por outro motivo e o usuário acionar o bloqueio por inadimplência no grupo, o sistema substitui o motivo original pelo motivo de inadimplência. Com isso, o controle do bloqueio anterior se perde e, em um futuro desbloqueio por inadimplência, essa filial acabará sendo liberada indevidamente.
* **Regra de classe de risco excluída validada apenas na Matriz:** Clientes pertencentes a classes de risco configuradas como exceção (como contas internas) não devem ser bloqueados por inadimplência. Atualmente, essa verificação é feita somente no cadastro principal selecionado, sem checar individualmente se alguma filial vinculada também faz parte de uma classe excluída.
* **Aviso de bloqueio por outro motivo ainda não utilizado:** Já existe uma mensagem prevista para registrar quando uma empresa possui bloqueio por um motivo diferente de inadimplência, porém ela ainda não está sendo aplicada e gravada no histórico durante o processamento das filiais.

---

## 2. O que eu preciso fazer (Linguagem de Negócio)

Para corrigir o processamento em cascata nos grupos econômicos (Cliente Matriz e suas Filiais) e garantir o cumprimento das regras de negócio, o comportamento das ações no aplicativo deve ser ajustado nos seguintes pontos:

1. **Consultar a situação individual de cada empresa do grupo antes de alterar:**
   * Durante as ações em cascata de bloqueio e desbloqueio, antes de aplicar qualquer mudança, o sistema deve verificar individualmente a situação atual do cadastro de crédito de cada empresa pertencente ao grupo econômico, em vez de assumir que todas estão na mesma condição do Cliente Matriz.
2. **Preservar bloqueios de outros motivos durante o desbloqueio:**
   * Na ação de desbloqueio, o sistema só pode liberar as empresas do grupo que estejam bloqueadas exclusivamente pelo motivo de inadimplência.
   * Caso alguma empresa do grupo esteja bloqueada por qualquer outro motivo (como jurídico, suspeita de fraude ou outra restrição manual), ela deve ser ignorada pela ação de desbloqueio, mantendo o seu bloqueio ativo.
3. **Não sobrescrever bloqueios já existentes durante o bloqueio:**
   * Na ação de bloqueio, se alguma empresa do grupo já estiver com o crédito bloqueado (seja por inadimplência ou por qualquer outro motivo), o sistema deve ignorá-la e não pode substituir o motivo original pelo motivo de inadimplência.
   * Apenas as empresas do grupo que estiverem desbloqueadas devem receber o bloqueio por inadimplência.
4. **Validar a classe de risco excluída individualmente para cada membro do grupo:**
   * A regra de exceção que impede o bloqueio de clientes de determinadas classes de risco (como contas internas da cooperativa) deve ser verificada individualmente para cada empresa do grupo econômico durante a cascata, e não apenas para o cliente selecionado inicialmente.
   * Se uma filial pertencer a uma classe de risco excluída, ela deve ser ignorada na ação de bloqueio, preservando normalmente o bloqueio dos demais membros aptos do grupo.
5. **Registrar no histórico quando uma empresa for ignorada por ter outro motivo de bloqueio:**
   * Durante a ação de desbloqueio, sempre que uma empresa do grupo for ignorada por possuir um bloqueio diferente de inadimplência, o sistema deve gravar essa ocorrência no histórico de auditoria utilizando a mensagem padrão já prevista para esse cenário, registrando o cliente e o motivo de bloqueio encontrado.

---

## 3. Plano de Ação

### O que será feito em cada objeto

1. **[[08 - ZCLFI_BP_CLIENTE_INAD|ZCLFI_BP_CLIENTE_INAD]] *(Behavior Pool — Ajustar métodos `bloquearCliente` e `desbloquearCliente`)*:**
   * **Checagem individual da Classe de Risco no bloqueio (`bloquearCliente`):** Dentro do laço de membros do grupo econômico (`lt_grupo`), consultar individualmente a classe de risco (`risk_class`) de cada `lv_bp_membro` na tabela `UKMBP_CMS` (dados gerais de crédito do Parceiro de Negócio). Caso a classe de risco do membro esteja no range de exclusão `lr_classes_excluidas` (ex.: classe `5` – CVH Interna), **pular** esse membro (`CONTINUE`) registrando a ocorrência no log (`lt_log`), sem impedir o bloqueio dos demais membros aptos do grupo.
   * **Proteção contra sobrescrita de bloqueios existentes no bloqueio (`bloquearCliente`):** Logo após a leitura da situação atual do membro via `lo_account->get_bp_cms_sgm`, verificar se `ls_sgm-xblocked = abap_true`. Se o membro **já estiver bloqueado** (seja pelo motivo `10` ou por qualquer outro motivo externo como jurídico/fraude), **não alterar** `ls_sgm` e **não chamar** `set_bp_cms_sgm`, registrando a ocorrência no log (utilizando o texto da mensagem `006` da `ZFI_INADIMPLENCIA` quando `ls_sgm-block_reason <> gc_motivo_inadimplencia`) e seguindo para o próximo membro (`CONTINUE`).
   * **Proteção de bloqueios por outros motivos no desbloqueio (`desbloquearCliente`):** Logo após `lo_account->get_bp_cms_sgm`, verificar se `ls_sgm-xblocked = abap_true AND ls_sgm-block_reason <> gc_motivo_inadimplencia`. Nesse caso, **não desbloquear** o membro (`CONTINUE`), gravando um registro em `lt_log` com `status = 'E'`, o `block_reason` atual encontrado e o texto formatado da **mensagem `006`** da `[[03 - ZFI_INADIMPLENCIA|ZFI_INADIMPLENCIA]]` (com o código do membro e o motivo do bloqueio).
   * **Escopo da alteração:** Manter o retorno visual na tela (*Message View*) restrito ao comportamento já existente, sem adicionar avisos extras por filial pulada.

2. **[[03 - ZFI_INADIMPLENCIA|ZFI_INADIMPLENCIA]] *(Classe de Mensagens — Reutilizar mensagem `006`)*:**
   * Reutilizar a **mensagem `006`** já cadastrada no ambiente (**S4D**) ao montar o texto do log quando um membro possuir bloqueio diferente de `10`.
   * *(Opcional/ajuste fino se desejado durante o guia)*: revisar o texto da mensagem `006` na transação `SE91` (*Message Maintenance* — manutenção de mensagens) apenas se necessário fechar o parêntese final dentro do limite de 73 caracteres (atualmente terminando em `...Inadimplência` sem `)`), mantendo os mesmos placeholders `&1` (cliente) e `&2` (motivo).

### Dependências / Decisões

* **Dependências:** Baseado no código atual pós-**CR-101** na `[[08 - ZCLFI_BP_CLIENTE_INAD|ZCLFI_BP_CLIENTE_INAD]]`; os ajustes seguintes de controle de flag na seleção múltipla (**CR-103**) e gravação em fase de `save`/`lock` (**CR-104**) atuarão em sequência sobre os mesmos métodos.
* **Decisão de escopo:** Não serão adicionados alertas (`warning`) extras no *Message View* para filiais puladas, seguindo estritamente o pedido do consultor e do revisor técnico (registro apenas no log `[[01 - ZTFI_LOG_INADIMP|ZTFI_LOG_INADIMP]]`).

---

## 4. Teste Pós Ajuste

> Além do roteiro geral de testes do revisor em [[CR-117 - Checklist de Testes no QAS|CR-117]], os cenários abaixo validam diretamente no **QAS** (*Quality Assurance System* — ambiente de qualidade) o teste exigido pelo supervisor técnico referente ao **CR-102** e os comportamentos adicionais desenhados nesta solução.

### Teste solicitado pelo Supervisor Técnico (ref. ao CR-102)

* **1. Filial bloqueada por outro motivo (ex.: `20`) durante Bloqueio e Desbloqueio em cascata** *(item 3 do [[Code Review 1.pdf|Code Review 1]])* — **Registro:** —
  - [x] **1.1. Bloqueio da Matriz sem sobrescrever a filial:** Em grupo econômico onde a Matriz está desbloqueada e uma filial possui bloqueio prévio por outro motivo (ex.: `20`), acionar **Bloquear** na Matriz e validar no **FSCM** (*SAP Credit Management* — gestão de crédito) que a Matriz recebeu o bloqueio com motivo `10`, enquanto a filial manteve intactos o bloqueio e o motivo original (`20`), gerando registro correspondente em `[[01 - ZTFI_LOG_INADIMP|ZTFI_LOG_INADIMP]]`. ✅ 2026-11-19
  - [x] **1.2. Desbloqueio da Matriz preservando a filial:** Na sequência, acionar **Desbloquear** na Matriz e validar que apenas a Matriz foi desbloqueada, enquanto a filial permaneceu bloqueada pelo motivo original (`20`). ✅ 2026-11-19
  - [x] **1.3. Registro da mensagem `006` no log:** Consultar a tabela `[[01 - ZTFI_LOG_INADIMP|ZTFI_LOG_INADIMP]]` após o desbloqueio e confirmar a gravação da linha referente à filial ignorada contendo o texto da **mensagem `006`** da `[[03 - ZFI_INADIMPLENCIA|ZFI_INADIMPLENCIA]]` (informando o cliente e o motivo diferente de `10`). ✅ 2026-11-19

### Testes adicionais do que foi implementado aqui (além do pedido pelo supervisor)

* **1. Filial pertencente à classe de risco excluída (`5 - CVH Interna`)** — **Registro:** —
  - [x] **1.1. Proteção da filial excluída no bloqueio em cascata:** Em grupo econômico onde a Matriz pertence a uma classe avaliada (`1A` ou `2A`) e uma filial vinculada pertence à classe de risco `5` (configurada como excluída na tabela de parâmetros), acionar **Bloquear** na Matriz e validar que a Matriz (e demais filiais aptas) são bloqueadas com motivo `10`, enquanto a filial de classe `5` permanece **desbloqueada**, com registro da exceção no log. ✅ 2026-11-19

* **2. Filial já bloqueada por inadimplência (`10`) ao acionar Bloqueio em cascata** — **Registro:** —
  - [x] **2.1. Não regravar membro já bloqueado:** Em grupo econômico onde a Matriz está desbloqueada e uma filial já se encontra bloqueada pelo motivo `10`, acionar **Bloquear** na Matriz e validar que a Matriz é bloqueada normalmente e a filial já bloqueada não sofre alteração indevida no FSCM, mantendo rastreabilidade no log. ✅ 2026-11-19
