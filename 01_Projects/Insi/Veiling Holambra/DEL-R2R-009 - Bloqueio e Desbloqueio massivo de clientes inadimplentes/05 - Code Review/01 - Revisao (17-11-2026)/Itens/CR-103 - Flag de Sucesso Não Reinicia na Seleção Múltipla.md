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
item_cr: CR-103
prioridade: Obrigatório (Crítico)
status: concluido
data: 2026-11-18
sap_destination: Veiling_S4D_100_GVSOUZA_PT
transport_requests:
  - S4DK900952 - DEL-R2R-009 - Bloqueio e Desbloqueio de Inadimplentes
---

# 🔴 CR-103: Flag de Sucesso Não Reinicia Entre Clientes na Seleção Múltipla

🗺️ [[00 - DEL-R2R-009 - Escada Code Review 1.excalidraw|Voltar para a Escada]] | 📄 [[Code Review 1.pdf|PDF Original]] | ⬅️ [[CR-102 - Cascata Altera Bloqueios Externos|CR-102]] | ➡️ [[CR-104 - Gravação Fora da Fase de Save e Sem Lock|CR-104]]

---

## 1. O que está sendo apontado (Linguagem de Negócio)

Quando o usuário seleciona vários clientes ao mesmo tempo na lista para bloquear ou desbloquear em lote, o controle interno que identifica se a operação deu certo não está sendo reiniciado entre um cliente e o próximo:

* **Falso aviso de sucesso na tela após o primeiro cliente:** Assim que o primeiro cliente do lote é processado com sucesso, o sistema mantém essa marcação de sucesso ativa para todos os clientes seguintes da seleção. Com isso, mesmo que um dos próximos clientes apresente erro e não possa ser alterado (por exemplo, por não possuir cadastro de crédito ativo), a tela exibe uma mensagem de sucesso e atualiza a linha como se ele tivesse sido bloqueado ou desbloqueado, embora o histórico de auditoria registre que houve erro.
* **Reaproveitamento indevido de resultado em membros já avaliados:** Quando uma empresa do grupo econômico já passou pelo processamento em outra linha do mesmo lote, o sistema assume automaticamente que o resultado anterior foi bem-sucedido, mesmo nos casos em que aquela tentativa anterior tenha falhado.

---

## 2. O que eu preciso fazer (Linguagem de Negócio)

Para garantir que cada cliente selecionado em uma operação em lote receba o retorno fiel ao que realmente aconteceu no seu processamento (tanto na tela quanto no histórico de auditoria), o comportamento do aplicativo deve ser ajustado nos seguintes pontos:

1. **Reiniciar o indicador de sucesso a cada cliente da seleção múltipla:**
   * Tanto na ação de **Bloquear** quanto na ação de **Desbloquear** em lote, o controle que define se a operação deu certo deve ser zerado no início do processamento de cada linha selecionada.
   * Dessa forma, o resultado positivo obtido no primeiro cliente nunca pode ser carregado para os clientes seguintes da mesma seleção.
2. **Exibir erro e preservar o status real na tela quando um cliente falhar:**
   * Se todas as empresas ligadas à linha selecionada falharem ou forem impedidas de sofrer alteração (por exemplo, por não possuírem cadastro de crédito ativo, por pertencerem a uma classe de risco excluída ou por já estarem bloqueadas por outra área), o sistema deve exibir o aviso de erro para aquela linha na tela de resumo e **não** pode marcar o cliente como bloqueado ou desbloqueado na lista.
   * Os demais clientes válidos selecionados antes ou depois da linha com falha no mesmo lote devem continuar sendo processados normalmente, exibindo cada um o seu respectivo aviso de sucesso.
3. **Respeitar o resultado real (sucesso ou falha) de empresas já avaliadas no mesmo lote:**
   * Quando o usuário selecionar no mesmo lote duas ou mais linhas ligadas ao mesmo grupo econômico (por exemplo, a linha do Cliente Matriz e uma linha de Filial), o sistema deve guardar o resultado real obtido por cada empresa do grupo (se ela foi processada com **sucesso** ou se **falhou**).
   * Ao passar pela linha seguinte daquele grupo, em vez de assumir automaticamente que uma empresa já avaliada deu certo, o sistema deve consultar o resultado real registrado anteriormente: ela só contará como sucesso se a tentativa anterior tiver sido efetivamente bem-sucedida; se tiver falhado, permanecerá como falha.

---

## 3. Plano de Ação

### O que será feito em cada objeto

1. **[[08 - ZCLFI_BP_CLIENTE_INAD|ZCLFI_BP_CLIENTE_INAD]] *(Behavior Pool — Ajustar definição local e métodos `bloquearCliente` e `desbloquearCliente`)*:**
   * **Estrutura compartilhada de resultado por membro (`PRIVATE SECTION` da `lhc_clienteinadimplente`):** Criar os tipos locais `ty_resultado_membro` (`partner TYPE bu_partner`, `credit_sgmnt TYPE ukm_credit_sgmnt`, `ok TYPE abap_bool`) e `tt_resultado_membro` (*hashed table* com chave única `partner` e `credit_sgmnt`) para armazenar o desfecho real de cada parceiro processado no lote, substituindo o controle simples baseado apenas na existência do BP em `lt_parceiros_processados`.
   * **Reinicialização explícita das flags no método `bloquearCliente`:** Mover `DATA lv_bloqueio_ok TYPE abap_bool.` para fora do `LOOP AT lt_clientes` e atribuir `lv_bloqueio_ok = abap_false.` logo na primeira linha de cada iteração (antes mesmo da verificação de `RiskClass IN lr_classes_excluidas`), eliminando a declaração `DATA ... VALUE abap_false` dentro do laço.
   * **Controle real por membro no método `bloquearCliente`:** Substituir `lt_parceiros_processados` por `lt_resultados_membros TYPE tt_resultado_membro`. Ao iniciar cada `lv_bp_membro` em `lt_grupo`:
     * Se o par `(partner = lv_bp_membro, credit_sgmnt = <ls_cliente>-CreditSegment)` já existir em `lt_resultados_membros`, marcar `lv_bloqueio_ok = abap_true` **somente se** `<ls_res_existente>-ok = abap_true` e seguir (`CONTINUE`).
     * Caso contrário, inserir imediatamente o membro em `lt_resultados_membros` com `ok = abap_false` antes das validações; manter `ok = abap_false` em todos os cenários de falha ou impedimento (classe de risco excluída na `UKMBP_CMS`, bloqueio pré-existente por motivo `<> '10'` ou exceção capturada no `CATCH`), e atualizar `ok = abap_true` (junto com `lv_bloqueio_ok = abap_true`) exclusivamente quando o membro for bloqueado com sucesso ou já estiver bloqueado pelo motivo `'10'`.
   * **Reinicialização explícita e controle real por membro no método `desbloquearCliente`:** Aplicar exatamente o mesmo padrão em `desbloquearCliente`: declarar `DATA lv_desbloqueio_ok TYPE abap_bool.` fora do `LOOP AT lt_clientes`, atribuir `lv_desbloqueio_ok = abap_false.` no início de cada cliente e substituir `lt_parceiros_processados` por `lt_resultados_membros TYPE tt_resultado_membro`. Caso um membro já processado no lote seja encontrado novamente, só ativar `lv_desbloqueio_ok = abap_true` se `<ls_res_existente>-ok = abap_true`; manter `ok = abap_false` quando o membro possuir bloqueio de outro motivo (`<> '10'`) ou falhar no `CATCH`, e atualizar `ok = abap_true` apenas quando `set_bp_cms_sgm` concluir o desbloqueio com sucesso.

### Dependências / Decisões

* **Dependências:** Baseado no código atual pós-[[CR-101 - Chave Duplicada na CDS Raiz|CR-101]] e [[CR-102 - Cascata Altera Bloqueios Externos|CR-102]] na `[[08 - ZCLFI_BP_CLIENTE_INAD|ZCLFI_BP_CLIENTE_INAD]]`. A movimentação da gravação para a fase de `save` com `lock` será tratada em sequência no [[CR-104 - Gravação Fora da Fase de Save e Sem Lock|CR-104]], sobre a mesma estrutura de laço e controle por cliente/membro.
* **Escopo isolado:** A troca de textos fixos de erro (`new_message_with_text`) por mensagens da `[[03 - ZFI_INADIMPLENCIA|ZFI_INADIMPLENCIA]]` e o refinamento das exceções capturadas no `CATCH` pertencem aos itens [[CR-108 - Textos Fixos em Vez da Classe de Mensagens|CR-108]] e [[CR-109 - Catch Vazio e Exceções Genéricas na Classe|CR-109]], respectivamente, não sendo alterados neste ajuste.

---

## 4. Teste Pós Ajuste

> Além do roteiro geral de testes do revisor em [[CR-117 - Checklist de Testes no QAS|CR-117]], os cenários abaixo validam diretamente no **QAS** (*Quality Assurance System* — ambiente de qualidade) o teste exigido pelo supervisor técnico referente ao **CR-103** e os comportamentos adicionais desenhados nesta solução.

### Teste solicitado pelo Supervisor Técnico (ref. ao CR-103)

* **1. Seleção múltipla de 3 clientes com erro no 2º cliente** *(item 4 da Seção 5 do [[Code Review 1.pdf|Code Review 1]])* — **Registro:** —
  - [x] **1.1. Ação de Bloquear em lote (1º e 3º válidos, 2º sem conta de crédito):** Selecionar 3 clientes simultaneamente na lista onde o 2º não possua conta de crédito no segmento `1000` e acionar **Bloquear**. ✅ 2026-11-19
  - [x] **1.2. Retorno visual fiel na tela:** Confirmar que apenas o 1º e o 3º exibem a mensagem de sucesso (`001`) e ficam marcados como bloqueados (motivo `10`), enquanto o 2º exibe aviso de erro e permanece sem bloqueio na lista. ✅ 2026-11-19
  - [x] **1.3. Consistência no log (`[[01 - ZTFI_LOG_INADIMP|ZTFI_LOG_INADIMP]]`):** Consultar a tabela de log e confirmar status `'S'` para o 1º e o 3º clientes e status `'E'` para o 2º cliente. ✅ 2026-11-19

### Testes adicionais do que foi implementado aqui (além do pedido pelo supervisor)

* **1. Reaproveitamento de resultado real entre linhas do mesmo grupo econômico** — **Registro:** —
  - [x] **1.1. Matriz e Filial selecionadas juntas com falha em todos os membros:** Selecionar simultaneamente a linha da Matriz e a(s) linha(s) de Filial(is) de um grupo onde todos os membros possuam impedimento (ex.: sem conta de crédito ou bloqueio pré-existente por motivo diferente de `10`) e acionar **Bloquear**. ✅ 2026-11-19
  - [x] **1.2. Ausência de falso positivo na 2ª linha:** Validar que **todas** as linhas do grupo exibem erro na tela e nenhuma recebe marcação indevida de bloqueio ao consultar o resultado armazenado (`ok = abap_false`) do membro já avaliado. ✅ 2026-11-19

* **2. Seleção múltipla de 3 clientes na ação Desbloquear** — **Registro:** —
  - [x] **2.1. Ação de Desbloquear em lote (1º e 3º válidos, 2º com falha/impedimento):** Selecionar 3 clientes bloqueados onde o 2º não possua conta de crédito (ou esteja bloqueado por motivo diferente de `10`) e acionar **Desbloquear**. ✅ 2026-11-19
  - [x] **2.2. Retorno coerente no Desbloquear:** Confirmar que o 1º e o 3º exibem a mensagem de sucesso (`002`) e têm o bloqueio removido na tela, enquanto o 2º exibe erro e mantém seu status anterior sem atualização indevida. ✅ 2026-11-19

* **3. Reinício da flag antes de linha com classe de risco excluída** — **Registro:** —
  - [x] **3.1. Cliente excluído entre cliente válido e cliente com falha:** Selecionar em lote 1º cliente válido, 2º cliente em classe de risco excluída (ex.: classe `5`) e 3º cliente com erro na conta de crédito, confirmando que o 3º recebe aviso de erro (sem herdar sucesso do 1º). ✅ 2026-11-19
