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
item_cr: CR-106
prioridade: Recomendado (Ponto de Atenção)
status: concluido
data: 2026-11-18
sap_destination: ""
transport_requests: []
---

# 🟡 CR-106: Filtro de Partidas Memo/Adiantamento e Validade da BUT050

🗺️ [[00 - DEL-R2R-009 - Escada Code Review 1.excalidraw|Voltar para a Escada]] | 📄 [[Code Review 1.pdf|PDF Original]] | ⬅️ [[CR-105 - Hardcode nas CDS Views e no Authority-Check|CR-105]] | ➡️ [[CR-107 - Falta de Controle de Acesso (DCL) nas CDS Views|CR-107]]

---

## 1. O que está sendo apontado (Linguagem de Negócio)

Foram identificados dois pontos na apuração dos dados que precisam ser confirmados com a área de negócio para evitar cobranças ou bloqueios incorretos:

* **Inclusão de lançamentos provisórios e adiantamentos no saldo vencido:** A soma atual dos títulos em aberto não está separando lançamentos meramente informativos (como solicitações de adiantamento ou registros provisórios que não representam fatura vencida real). Com isso, esses lançamentos podem ser somados como dívida em atraso e fazer o aplicativo sugerir o bloqueio indevido do cliente.
* **Vínculos encerrados entre Matriz e Filial continuam ativos na regra:** Ao identificar quais filiais pertencem a um Cliente Matriz (tanto para exibir na lista quanto para bloquear ou desbloquear em cascata), o sistema não está conferindo a data de validade do vínculo. Dessa forma, uma filial cujo vínculo societário ou comercial com a Matriz já foi encerrado continua sendo tratada como parte do mesmo grupo econômico.

---

## 2. O que eu preciso fazer (Linguagem de Negócio)

Para evitar que lançamentos meramente informativos gerem sugestões indevidas de bloqueio e impedir que empresas com vínculo já encerrado continuem sendo afetadas pelo grupo econômico, devem ser realizados os seguintes passos:

1. **Confirmar com a área de negócio e filtrar lançamentos que não representam dívida real:**
   * Alinhar com o responsável funcional quais tipos de lançamentos provisórios ou adiantamentos não devem entrar na conta de inadimplência.
   * Ajustar a apuração de valores vencidos para desconsiderar esses lançamentos informativos, garantindo que apenas faturas e débitos efetivamente exigíveis componham o valor total vencido e a sugestão de bloqueio.
2. **Considerar apenas vínculos vigentes entre Cliente Matriz e Filiais:**
   * Tanto na montagem da lista na tela quanto na identificação das empresas do grupo econômico durante o bloqueio e o desbloqueio em cascata, passar a verificar a data de início e a data de fim de cada vínculo.
   * Vínculos cujo prazo de validade já tenha expirado (ou que ainda não estejam em vigor na data atual) devem ser ignorados, garantindo que ex-filiais não sofram bloqueio ou desbloqueio junto com o grupo antigo.

---

## 3. Plano de Ação
* **O que será feito:** *(A definir após entendimento na etapa 2)*
* **Dependências / Decisões:** Confirmação funcional sobre lançamentos provisórios/adiantamentos e validade dos vínculos de grupo econômico.

---

## 4. Teste Pós Ajuste

> Além do roteiro geral de testes do revisor em [[CR-117 - Checklist de Testes no QAS|CR-117]], os cenários abaixo validam diretamente no **QAS** (*Quality Assurance System* — ambiente de qualidade) o teste exigido pelo supervisor técnico referente ao **CR-106** e verificações complementares de vigência *(complementar após confirmação funcional e definição da Seção 3)*.

### Teste solicitado pelo Supervisor Técnico (ref. ao CR-106)

* **1. Exclusão de partidas memo e razões especiais vencidas** *(item 7 da Seção 5 e item 6 da Seção 3 do [[Code Review 1.pdf|Code Review 1]])* — **Registro:** —
  - [ ] **1.1. Cliente apenas com partida memo ou solicitação de adiantamento vencida:** Consultar no aplicativo no QAS um cliente que possua exclusivamente partidas memo ou códigos de razão especial excluídos vencidos (sem faturas normais em atraso).
  - [ ] **1.2. Não contabilização no saldo nem na sugestão:** Validar que esses lançamentos não compõem o `ValorTotalVencido` e que o cliente **não** aparece com sugestão `"Bloquear"` na coluna `AcaoProposta`.

* **2. Filtro de validade da relação na tabela `BUT050`** *(item 6 da Seção 3 do [[Code Review 1.pdf|Code Review 1]])* — **Registro:** —
  - [ ] **2.1. Relação `UKM001` encerrada fora da listagem e da cascata:** Em uma Matriz que possua uma filial com vínculo já expirado (`DATE_TO` anterior à data do sistema), validar que a filial expirada não aparece vinculada ao grupo na lista nem sofre bloqueio/desbloqueio em cascata ao acionar a Matriz.

### Testes adicionais do que foi implementado aqui (além do pedido pelo supervisor)

* **1. Grupo econômico com mistura de vínculos vigentes e encerrados** — **Registro:** —
  - [ ] **1.1. Cálculo simétrico e ação restritos aos vínculos vigentes:** Em Matriz com 1 filial vigente e 1 filial com vínculo `UKM001` encerrado, confirmar que apenas a Matriz e a filial vigente participam da avaliação de inadimplência do grupo e recebem o registro correspondente na `[[01 - ZTFI_LOG_INADIMP|ZTFI_LOG_INADIMP]]`.
