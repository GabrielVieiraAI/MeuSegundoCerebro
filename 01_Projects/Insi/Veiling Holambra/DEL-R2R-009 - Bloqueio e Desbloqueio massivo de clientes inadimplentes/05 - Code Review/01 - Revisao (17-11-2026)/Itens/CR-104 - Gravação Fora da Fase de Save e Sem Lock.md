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
item_cr: CR-104
prioridade: Obrigatório (Crítico)
status: Pendente
data: 2026-11-18
sap_destination: Veiling_S4D_100_GVSOUZA_PT
transport_requests:
  - S4DK900952 - DEL-R2R-009 - Bloqueio e Desbloqueio de Inadimplentes
---

# 🔴 CR-104: Gravação no FSCM e no Log Fora da Fase de Save e Sem Lock

🗺️ [[00 - DEL-R2R-009 - Escada Code Review 1.excalidraw|Voltar para a Escada]] | 📄 [[Code Review 1.pdf|PDF Original]] | ⬅️ [[CR-103 - Flag de Sucesso Não Reinicia na Seleção Múltipla|CR-103]] | ➡️ [[CR-105 - Hardcode nas CDS Views e no Authority-Check|CR-105]]

---

## 1. O que está sendo apontado (Linguagem de Negócio)

Durante a execução das ações de bloqueio e desbloqueio, o sistema está gravando as alterações diretamente no cadastro de crédito e no histórico de auditoria antes do momento final de confirmação da operação e sem travar temporariamente o cadastro dos clientes em edição. Isso gera três riscos operacionais:

* **Alteração simultânea por dois usuários (perda de atualização):** Se um usuário estiver editando o cadastro de crédito de um cliente na tela padrão do sistema ao mesmo tempo em que outro usuário aciona o bloqueio ou desbloqueio pelo aplicativo em massa, não há trava de proteção, e uma alteração pode sobrescrever a outra.
* **Grupo econômico bloqueado pela metade em caso de falha:** Caso ocorra uma falha inesperada ou cancelamento no meio do processamento, as empresas do grupo que já foram gravadas não têm a alteração desfeita automaticamente, podendo deixar parte do grupo bloqueada e parte desbloqueada.
* **Risco de cancelamento da operação pelo sistema:** Como a gravação está ocorrendo fora da etapa final de salvamento exigida pelo padrão do aplicativo, a execução pode ser interrompida pelo sistema com erro técnico.

---

## 2. O que eu preciso fazer (Linguagem de Negócio)

Para garantir a segurança das alterações de crédito e evitar divergências em grupos econômicos ou conflitos entre usuários trabalhando ao mesmo tempo, o processo de confirmação das ações deve ser ajustado nos seguintes pontos:

1. **Travar temporariamente o cadastro de crédito de todas as empresas do grupo antes de alterar:**
   * No momento em que o usuário clicar em **Bloquear** ou **Desbloquear**, o sistema deve reservar temporariamente o cadastro de crédito do Cliente Matriz e de todas as suas Filiais vinculadas.
   * Caso algum membro do grupo esteja sendo editado naquele exato instante por outro usuário no sistema padrão de crédito, a operação deve ser impedida com um aviso claro na tela, evitando que uma alteração sobrescreva a outra.
2. **Efetivar a gravação somente na etapa final de confirmação da operação:**
   * Durante a avaliação inicial de cada cliente selecionado, o sistema deve apenas validar as regras e preparar as alterações necessárias (tanto do bloqueio ou desbloqueio quanto do histórico de auditoria), sem gravar imediatamente de forma isolada.
   * A gravação definitiva no cadastro de crédito e no histórico de auditoria deve ocorrer de forma coordenada apenas no fechamento da operação, garantindo que o grupo econômico seja atualizado por completo ou, em caso de cancelamento sistêmico, permaneça em seu estado original sem bloqueios pela metade.
3. **Limpar os dados temporários ao final de cada processamento:**
   * Ao concluir ou cancelar uma ação em lote, todas as informações preparadas temporariamente devem ser descartadas para que uma nova operação executada em seguida pelo usuário comece totalmente limpa.

---

## 3. Plano de Ação

### O que será feito em cada objeto

1. **[[08 - ZCLFI_BP_CLIENTE_INAD|ZCLFI_BP_CLIENTE_INAD]] *(Behavior Pool — Aba `Local Types` / `CCIMP`: versão enxuta usando o buffer nativo da `cl_ukm_bupa_factory`)*:**
   * **Buffer compartilhado de auditoria (`lhc_clienteinadimplente` na `CCIMP`):** Adicionar uma `PUBLIC SECTION.` em `lhc_clienteinadimplente` contendo o atributo estático `CLASS-DATA gt_log TYPE STANDARD TABLE OF ztfi_log_inadimp WITH DEFAULT KEY.` para acumular os registros de log entre a fase de interação e a fase de salvamento, aproveitando o próprio *singleton* da `cl_ukm_bupa_factory` como buffer nativo das alterações de crédito em memória.
   * **Implementação do bloqueio lógico por grupo econômico (`METHOD lock`):** Para cada chave em `keys`:
     * Obter Matriz e todas as filiais vinculadas (`UKM001`) via `obter_grupo_economico( iv_partner = <ls_key>-PartnerMatriz )`.
     * Percorrer `lt_grupo` chamando o módulo de função standard `BUPA_ENQUEUE` (`iv_partner = lv_bp_membro`, `et_return = lt_return`), que aplica exatamente o mesmo bloqueio lógico (`EBU_PARTNR` e BAdI `BUPA_LOCK`) usado pela transação `UKM_BP`.
     * Caso `lt_return` retorne erro (`type = 'E'`, ex.: mensagem `R1/084` indicando edição simultânea na `UKM_BP`) ou falha na chamada: destravar os membros de `lt_grupo` via `BUPA_DEQUEUE`, preencher `failed-clienteinadimplente` (`%tky = <ls_key>-%tky`, `%fail-cause =` **if_abap_behv\=>cause-locked**), preencher `reported-clienteinadimplente` via `new_message` com a mensagem retornada em `lt_return` (ou `ZFI_INADIMPLENCIA` `003` como *fallback*) e encerrar a verificação daquele grupo (`EXIT`).
   * **Fase de interação sem gravação direta (`bloquearCliente` e `desbloquearCliente`):**
     * Manter integralmente a lógica de negócio existente (validações de classe de risco `UKMBP_CMS`, proteção de bloqueios prévios do **CR-102**, controle de flags/tabela do **CR-103** e `lo_account->set_bp_cms_sgm` em memória).
     * Ao final de cada ação, substituir `lo_bupa_factory->save_all( i_upd_task = abap_false ).` e `INSERT ztfi_log_inadimp FROM TABLE @lt_log.` apenas por `APPEND LINES OF lt_log TO gt_log.`.
   * **Persistência coordenada na fase de salvamento (`lsc_zi_fi_cliente_inadimplente~save`):**
     * Quando **lhc_clienteinadimplente\=>gt_log** não estiver vazia: chamar **cl_ukm_bupa_factory\=>create( )->save_all( EXPORTING i_upd_task = abap_true EXCEPTIONS failed = 1 OTHERS = 2 )** para gravar as alterações no **FSCM** (*SAP Credit Management*) e documentos de modificação (`CDHDR`/`CDPOS`) via *Update Task* oficial do SAP, em conformidade com `strict ( 2 )`.
     * Estando o salvamento sem erro (`sy-subrc = 0`), copiar o buffer para variável local (`lt_log_save`) e persistir atomicamente na mesma **LUW** (*Logical Unit of Work*) com `INSERT ztfi_log_inadimp FROM TABLE @lt_log_save.`.
   * **Limpeza garantida de memória (`cleanup` e `cleanup_finalize`):**
     * Implementar `cleanup` em `lsc_zi_fi_cliente_inadimplente` chamando **cl_ukm_bupa_factory\=>create( )->free_all( )** e `CLEAR` em **lhc_clienteinadimplente\=>gt_log**, e implementar `cleanup_finalize` chamando `cleanup( )`.

### Dependências / Decisões

* **Dependências:** Construído diretamente sobre o código ativo pós-[[CR-101 - Chave Duplicada na CDS Raiz|CR-101]], [[CR-102 - Cascata Altera Bloqueios Externos|CR-102]] e [[CR-103 - Flag de Sucesso Não Reinicia na Seleção Múltipla|CR-103]] na `[[08 - ZCLFI_BP_CLIENTE_INAD|ZCLFI_BP_CLIENTE_INAD]]` (`S4D`), mantendo o **BDEF** (*Behavior Definition*) raiz `[[07 - ZI_FI_CLIENTE_INADIMPLENTE (BDEF)|ZI_FI_CLIENTE_INADIMPLENTE (BDEF)]]` intacto (já possui `lock master` e `strict ( 2 )`).
* **Decisão técnica (Versão Enxuta aprovada):** Como `cl_ukm_bupa_factory` já opera como *singleton* e mantém as contas alteradas via `set_bp_cms_sgm` em buffer próprio até o `save_all`, dispensou-se a criação de uma classe auxiliar adicional (`lcl_buffer`), concentrando a persistência via *Update Task* em `save` e a limpeza da *factory* + `gt_log` em `cleanup`/`cleanup_finalize`.
* **Escopo isolado (ATC e mensagens legadas):** Os novos trechos de código (`lock`, `save`, `cleanup`, `cleanup_finalize`) seguem padrão limpo de **ATC** (*ABAP Test Cockpit*), sem `new_message_with_text` e sem `CATCH` vazio. A troca dos textos fixos e `CATCH cx_root` pré-existentes permanece nos itens [[CR-108 - Textos Fixos em Vez da Classe de Mensagens|CR-108]] e [[CR-109 - Catch Vazio e Exceções Genéricas na Classe|CR-109]].

---

## 4. Teste Pós Ajuste

### Teste solicitado pelo Supervisor Técnico (ref. ao CR-104)

* **1. Concorrência (`UKM_BP` aberta na Matriz ou em Filial)** *(item 5 da Seção 5 do [[Code Review 1.pdf|Code Review 1]])* — **Registro:** —
  - [x] **1.1. Bloqueio lógico (`lock`) na Matriz:** Abrir o cadastro de crédito da Matriz em modo de edição na transação `UKM_BP` e acionar **Bloquear** ou **Desbloquear** para esse cliente no aplicativo. ✅ 2026-11-19
    * **Como validar o sucesso:** O aplicativo exibe na tela o erro de bloqueio informando o número da **Matriz** e o usuário que está na `UKM_BP`, sem alterar o status do cliente na lista.
  - [x] **1.2. Bloqueio lógico (`lock`) em Filial do grupo:** Fechar a Matriz, abrir uma **Filial** vinculada (`UKM001`) em modo de edição na `UKM_BP` e acionar **Bloquear** ou **Desbloquear** na linha da Matriz no aplicativo. ✅ 2026-11-19
    * **Como validar o sucesso:** O aplicativo exibe na tela o erro de bloqueio informando o número da **Filial** aberta na `UKM_BP`, e a Matriz continua sem alteração de bloqueio na tela.

* **2. Persistência na fase de `save` em grupo econômico** *(item 2 da Seção 5 e item 4 da Seção 3 do [[Code Review 1.pdf|Code Review 1]])* — **Registro:** —
  - [x] **2.1. Gravação efetivada no `save` ao Bloquear:** Com todos os membros livres na `UKM_BP`, acionar **Bloquear** em uma Matriz com filiais (`UKM001`). ✅ 2026-11-19
    * **Como validar o sucesso:** O aplicativo exibe mensagem verde de sucesso e, ao consultar a Matriz e as filiais na `UKM_BP` (ou `ZTFI_LOG_INADIMP` na `SE16N`), todas estão bloqueadas com motivo `10` e com registro de log gravado.
  - [ ] **2.2. Gravação efetivada no `save` ao Desbloquear:** Na sequência, acionar **Desbloquear** no mesmo grupo econômico.
    * **Como validar o sucesso:** O aplicativo exibe mensagem verde de sucesso e, ao consultar a Matriz e as filiais na `UKM_BP` (ou `ZTFI_LOG_INADIMP` na `SE16N`), o bloqueio por motivo `10` foi removido e o log de desbloqueio foi gravado.
