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
status: Pendente
data: 2026-11-18
sap_destination: ""
transport_requests: []
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
* **O que será feito:** *(A definir após entendimento na etapa 2)*
* **Dependências / Decisões:** —

---

## 4. Teste Pós Ajuste

> Além do roteiro geral de testes do revisor em [[CR-117 - Checklist de Testes no QAS|CR-117]], os cenários abaixo validam diretamente no **QAS** (*Quality Assurance System* — ambiente de qualidade) a padronização de mensagens recomendada pelo supervisor técnico referente ao **CR-108** *(complementar após definição final da Seção 3, se necessário)*.

### Teste solicitado pelo Supervisor Técnico (ref. ao CR-108)

* **1. Uso da classe `[[03 - ZFI_INADIMPLENCIA|ZFI_INADIMPLENCIA]]` na tela e no log** *(item 8 da Seção 3 do [[Code Review 1.pdf|Code Review 1]])* — **Registro:** —
  - [ ] **1.1. Mensagens de erro e exceção no *Message View*:** Provocar cenários de erro ao bloquear/desbloquear (mensagem `003`), classe de risco excluída e motivo diferente de `10` (`006`), confirmando que a tela exibe os textos oriundos da `[[03 - ZFI_INADIMPLENCIA|ZFI_INADIMPLENCIA]]` com os marcadores (`&1`, `&2`) preenchidos.
  - [ ] **1.2. Gravação do texto da mensagem no log (`[[01 - ZTFI_LOG_INADIMP|ZTFI_LOG_INADIMP]]`):** Confirmar que o campo `MENSAGEM` na tabela de log recebe exatamente o texto formatado pela classe de mensagens, sem strings fixas no código.
  - [ ] **1.3. Reexecução do **ATC** (*ABAP Test Cockpit*):** Rodar o ATC na `[[08 - ZCLFI_BP_CLIENTE_INAD|ZCLFI_BP_CLIENTE_INAD]]` e confirmar a eliminação das 8 ocorrências P3 (`1700`/`1713`) apontadas na revisão.

### Testes adicionais do que foi implementado aqui (além do pedido pelo supervisor)

* **1. Integridade dos textos cadastrados na transação `SE91`** — **Registro:** —
  - [ ] **1.1. Conferência visual na `SE91` e tradução:** Validar que todas as mensagens cadastradas na `[[03 - ZFI_INADIMPLENCIA|ZFI_INADIMPLENCIA]]` estão completas dentro do limite de 73 caracteres (sem corte de palavra ou parêntese faltando) e exibem corretamente no idioma de logon `PT`.
