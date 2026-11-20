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
item_cr: CR-109
prioridade: Recomendado (Ponto de Atenção)
status: concluido
data: 2026-11-18
sap_destination: Veiling_S4D_100_GVSOUZA_PT
transport_requests:
  - S4DK900952 - DEL-R2R-009 - Bloqueio e Desbloqueio de Inadimplentes
---

# 🟡 CR-109: CATCH cx_uuid_error Vazio e Exceções Genéricas (cx_root)

🗺️ [[00 - DEL-R2R-009 - Escada Code Review 1.excalidraw|Voltar para a Escada]] | 📄 [[Code Review 1.pdf|PDF Original]] | ⬅️ [[CR-108 - Textos Fixos em Vez da Classe de Mensagens|CR-108]] | ➡️ [[CR-110 - Retirar Interfaces de Outra Demanda da Request|CR-110]]

---

## 1. O que está sendo apontado (Linguagem de Negócio)

O tratamento de falhas técnicas durante a geração do histórico de auditoria e durante a atualização do cadastro de crédito apresenta dois problemas de confiabilidade:

* **Perda silenciosa de registros no histórico de auditoria:** Se ocorrer uma falha interna no momento de gerar o número identificador único de uma linha do histórico, o sistema ignora o problema silenciosamente. Com isso, a ação é executada no cliente, mas o registro de auditoria deixa de ser gravado sem exibir qualquer aviso ao usuário.
* **Captura genérica de erros inesperados:** O tratamento de erros ao consultar parâmetros ou atualizar o crédito está configurado de forma ampla demais, engolindo qualquer falha técnica imprevista como se fosse um erro comum de operação, o que dificulta identificar a causa real quando houver um problema sistêmico.

---

## 2. O que eu preciso fazer (Linguagem de Negócio)

Para aumentar a confiabilidade do histórico de auditoria e tornar o diagnóstico de falhas mais preciso durante o bloqueio e o desbloqueio de clientes, o tratamento de erros deve ser ajustado nos seguintes pontos:

1. **Impedir a perda silenciosa de registros do histórico de auditoria:**
   * Centralizar a geração do identificador único de cada linha do histórico e, caso ocorra qualquer falha nessa geração, exibir imediatamente um aviso de erro na tela de resumo para o usuário, em vez de ignorar o problema silenciosamente e deixar a operação sem rastro de auditoria.
2. **Tratar falhas específicas de crédito e de parâmetros de forma direcionada:**
   * Substituir a captura genérica de erros por validações específicas para as falhas conhecidas da operação (como ausência de cadastro de crédito ativo ou ausência de parâmetro configurado), garantindo que erros operacionais esperados sejam reportados de forma clara ao usuário e que falhas sistêmicas graves não sejam mascaradas.

---

## 3. Plano de Ação

### O que será feito em cada objeto

1. **[[08 - ZCLFI_BP_CLIENTE_INAD|ZCLFI_BP_CLIENTE_INAD]] *(Behavior Pool — Aba `Local Types` / `CCIMP` — Ajustar)*:**
   * **Método auxiliar para geração centralizada do UUID do log (`gerar_uuid_log`):**
     * Declarar na `PRIVATE SECTION` de `lhc_clienteinadimplente` o método `gerar_uuid_log` (`IMPORTING is_tky TYPE STRUCTURE FOR KEY OF zi_fi_cliente_inadimplente iv_partner TYPE bu_partner CHANGING ct_reported TYPE TABLE FOR REPORTED EARLY zi_fi_cliente_inadimplente RETURNING VALUE(rv_log_id) TYPE sysuuid_x16`).
     * Chamar **cl_system_uuid\=>create_uuid_x16_static( )** dentro de um único `TRY ... CATCH cx_uuid_error INTO DATA(lx_uuid_error)` centralizado. Caso ocorra falha na geração do **UUID** (*Universally Unique Identifier*), converter o texto da exceção (`DATA(lv_msg_uuid) = CONV symsgv( lx_uuid_error->get_text( ) )`) e propagar imediatamente o erro em `ct_reported` (`reported-clienteinadimplente`) via `new_message` com a mensagem **`003`** da `[[03 - ZFI_INADIMPLENCIA|ZFI_INADIMPLENCIA]]` (`severity =` **if_abap_behv_message\=>severity-error**, `v1 = iv_partner`, `v2 = lv_msg_uuid`).
     * Nos métodos `bloquearCliente` e `desbloquearCliente`, gerar o UUID uma única vez por linha de log (`lv_log_id = gerar_uuid_log( ... )`) — na validação inicial de classe de risco excluída da linha selecionada e no início do processamento de cada membro em `LOOP AT lt_grupo` / `LOOP AT lt_grupo_desb` (logo após a checagem do cache `lt_resultados_membros`) — e reutilizar `lv_log_id` em todos os `APPEND VALUE #( log_id = lv_log_id ... ) TO lt_log` (condicionado a `IF lv_log_id IS NOT INITIAL`), removendo os 4 blocos `TRY ... CATCH cx_uuid_error` vazios espalhados pelos laços.
   * **Validação de existência da conta de crédito e captura de exceção específica do FSCM (`validar_conta_credito` e `CATCH cx_ukm_commons`):**
     * Declarar na `PRIVATE SECTION` de `lhc_clienteinadimplente` o método auxiliar `validar_conta_credito` (`IMPORTING io_account TYPE REF TO cl_ukm_account iv_partner TYPE bu_partner iv_credit_sgmnt TYPE ukm_credit_sgmnt RAISING cx_ukm_commons`).
     * Dentro de `validar_conta_credito`, acionar o método standard `io_account->check_existence` (`EXCEPTIONS unknown_partner = 1 unknown_segment = 2 initial_master_data_partner = 3 initial_master_data_segment = 4 OTHERS = 5`) e, quando `sy-subrc <> 0` (ou `io_account IS NOT BOUND`), lançar a exceção específica do **FSCM** (*SAP Credit Management*) `RAISE EXCEPTION TYPE cx_ukm_commons MESSAGE ID 'UKM_COMM' TYPE 'E' NUMBER ... WITH ...` (que implementa `IF_T100_DYN_MSG`), mapeando as mensagens standard da classe `UKM_COMM`:
       * `sy-subrc = 1` (`unknown_partner`): mensagem `006` (`WITH iv_partner` — *"Parceiro de negócios &1 desconhecido"*).
       * `sy-subrc = 2` (`unknown_segment`): mensagem `005` (`WITH iv_credit_sgmnt` — *"Segmento de crédito &1 não existe"*).
       * `sy-subrc = 3` (`initial_master_data_partner`): mensagem `007` (`WITH iv_partner` — *"Não existem dados mestre de crédito para parceiro de negócios &1"*).
       * `sy-subrc = 4` ou `OTHERS` (`initial_master_data_segment`): mensagem `008` (`WITH iv_partner iv_credit_sgmnt` — *"Não existem dados mestre de crédito p/parceiro &1 em segmento crédito &2"*).
     * Nos laços de `bloquearCliente` e `desbloquearCliente`, obter `DATA(lo_account) = lo_bupa_factory->get_credit_account( ... )` (sem o `CAST cl_ukm_account` redundante), chamar `validar_conta_credito( io_account = lo_account iv_partner = ... iv_credit_sgmnt = <ls_cliente>-CreditSegment )` antes de `lo_account->get_bp_cms_sgm` e substituir `CATCH cx_root INTO DATA(lx_erro_membro)` / `CATCH cx_root INTO DATA(lx_erro_desb)` por `CATCH cx_ukm_commons INTO ...`.
   * **Captura da exceção específica na leitura da Tabela de Parâmetros (`CATCH zcxca_tabela_parametros`):**
     * Nos métodos `get_instance_authorizations` (`m_get_single` para `BUKRS/EMPRESA`), `obter_grupo_economico` (`m_get_range` para `RELTYP/GRUPO`) e `bloquearCliente` (`m_get_range` para `RISK_CLASS/EXCLUIR`), substituir os 3 blocos `CATCH cx_root.` pela exceção específica `CATCH zcxca_tabela_parametros.` declarada na assinatura de `zclca_tabela_parametros`, mantendo os respectivos valores de *fallback* apenas quando o parâmetro não estiver cadastrado.

### Dependências / Decisões

* **Dependências:** Construído diretamente sobre o código ativo da `[[08 - ZCLFI_BP_CLIENTE_INAD|ZCLFI_BP_CLIENTE_INAD]]` pós-[[CR-101 - Chave Duplicada na CDS Raiz|CR-101]], [[CR-102 - Cascata Altera Bloqueios Externos|CR-102]], [[CR-103 - Flag de Sucesso Não Reinicia na Seleção Múltipla|CR-103]], [[CR-104 - Gravação Fora da Fase de Save e Sem Lock|CR-104]], [[CR-105 - Hardcode nas CDS Views e no Authority-Check|CR-105]] e [[CR-108 - Textos Fixos em Vez da Classe de Mensagens|CR-108]].
* **Por que validar com `check_existence` + `cx_ukm_commons`:** No standard do FSCM (`CL_UKM_BUPA_FACTORY` e `CL_UKM_ACCOUNT`), os métodos `get_credit_account`, `get_bp_cms_sgm` e `set_bp_cms_sgm` não declaram exceções baseadas em classe (`RAISING`) em suas assinaturas e não falham automaticamente quando um parceiro não possui conta de crédito criada no segmento `1000` (retornam estrutura vazia). Além de o compilador ABAP e a verificação ampliada (**SLIN** — *Extended Program Check*) emitirem aviso caso uma exceção `CX_STATIC_CHECK` seja declarada no `CATCH` sem poder ser lançada no `TRY`, a chamada a `io_account->check_existence` convertida em `RAISE EXCEPTION TYPE cx_ukm_commons` garante que a ausência de conta de crédito em membro ou cliente selecionado (cenário cobrado no item 4 da Seção 5 do [[Code Review 1.pdf|Code Review 1]]) seja efetivamente capturada, registrada na `[[01 - ZTFI_LOG_INADIMP|ZTFI_LOG_INADIMP]]` (`status = 'E'`) e reportada na tela com a mensagem `003`.
* **Eliminação integral dos avisos P2 (`0248`) no ATC:** A centralização da geração do UUID em `gerar_uuid_log` elimina todas as **4 ocorrências P2 (`0248` — *"Tratamento de exceções em falta após instrução CATCH"*)** atualmente apontadas pelo **ATC** (*ABAP Test Cockpit*) na `[[08 - ZCLFI_BP_CLIENTE_INAD|ZCLFI_BP_CLIENTE_INAD]]` (as 3 ocorrências originais do Code Review + 1 ocorrência adicionada na validação de classe de risco do membro no CR-102), zerando os achados de Prioridade 1 e Prioridade 2 da classe.

---

## 4. Teste Pós Ajuste

> Além do roteiro geral de testes do revisor em [[CR-117 - Checklist de Testes no QAS|CR-117]], os cenários abaixo validam diretamente no **QAS** (*Quality Assurance System* — ambiente de qualidade) o tratamento de exceções recomendado pelo supervisor técnico referente ao **CR-109** *(complementar após definição final da Seção 3, se necessário)*.

### Teste solicitado pelo Supervisor Técnico (ref. ao CR-109)

* **1. Eliminação de `CATCH cx_uuid_error` vazio e de `CATCH cx_root` genérico** *(item 9 da Seção 3 do [[Code Review 1.pdf|Code Review 1]])* — **Registro:** —
  - [ ] **1.1. Reexecução do **ATC** (*ABAP Test Cockpit*):** Rodar o ATC na `[[08 - ZCLFI_BP_CLIENTE_INAD|ZCLFI_BP_CLIENTE_INAD]]` e confirmar a eliminação dos 3 avisos P2 (`0248`) de `CATCH` vazio apontados pelo revisor.
  - [ ] **1.2. Captura de exceções específicas do **FSCM** (*SAP Credit Management*):** Simular falha nas chamadas do FSCM (ex.: cliente sem conta de crédito no segmento `1000`) e validar que a exceção específica é tratada, registra o erro na `[[01 - ZTFI_LOG_INADIMP|ZTFI_LOG_INADIMP]]` e devolve mensagem clara ao usuário.
  - [ ] **1.3. Propagação de erro na geração de **UUID** (*Universally Unique Identifier*):** Validar por revisão de código / teste unitário que o método auxiliar de geração de UUID propaga eventual falha em `reported` em vez de silenciar a perda do registro de log.

### Testes adicionais do que foi implementado aqui (além do pedido pelo supervisor)

* **1. Tratamento específico na leitura de parâmetros (`zclca_tabela_parametros`)** — **Registro:** —
  - [ ] **1.1. Fallback sem captura ampla indevida:** Confirmar que uma eventual ausência de registro na tabela de parâmetros utiliza a exceção específica prevista (aplicando o fallback seguro definido) sem mascarar erros críticos não relacionados.
