---
tags:
  - projeto
  - insi
  - veiling-holambra
  - sap
  - code-review
  - del-r2r-009
  - melhoria-opcional
id_demanda: DEL-R2R-009
revisao: Code Review 1
request: S4DK900952
tarefa: S4DK900953
item_cr: CR-115
prioridade: Melhoria Opcional
status: Pendente
data: 2026-11-18
sap_destination: ""
transport_requests: []
---

# 🔵 CR-115: Ambiguidade no SELECT SINGLE da BUT050

🗺️ [[00 - DEL-R2R-009 - Escada Code Review 1.excalidraw|Voltar para a Escada]] | 📄 [[Code Review 1.pdf|PDF Original]] | ⬅️ [[CR-114 - Habilitação Dinâmica dos Botões (Features Instance)|CR-114]] | ➡️ [[CR-116 - Documentação ABAP Doc e Testes ABAP Unit|CR-116]]

---

## 1. O que está sendo apontado (Linguagem de Negócio)

Quando o sistema precisa identificar a qual Cliente Matriz uma determinada filial pertence para aplicar o bloqueio ou desbloqueio no grupo econômico, a busca atual seleciona apenas um vínculo sem ordenar ou considerar todos os identificadores do relacionamento:

* **Escolha aleatória de grupo caso uma filial tenha mais de um vínculo cadastrado:** Se existir no cadastro mais de um registro de vínculo para a mesma filial (por exemplo, um vínculo antigo encerrado e um vínculo novo ativo com outra Matriz), o sistema pode escolher qualquer um deles de forma imprevisível.

---

## 2. O que eu preciso fazer (Linguagem de Negócio)

Para garantir que a identificação do Cliente Matriz a partir de uma filial seja sempre exata e previsível (caso esta melhoria opcional seja implementada, preferencialmente em conjunto com a verificação de validade dos vínculos), o comportamento deve ser ajustado nos seguintes pontos:

1. **Considerar apenas vínculos ativos e definir um critério único de escolha:**
   * Ao buscar a qual Cliente Matriz uma filial pertence para aplicar o bloqueio ou desbloqueio no grupo econômico, filtrar os vínculos vigentes na data atual e aplicar uma regra clara de ordenação/identificação para que o sistema nunca escolha um grupo econômico de forma aleatória caso exista mais de um registro histórico para a mesma filial.

---

## 3. Plano de Ação
* **O que será feito:** *(A definir após análise na etapa 2)*
* **Dependências / Decisões:** Pode ser tratado em conjunto com a verificação de validade do vínculo em [[CR-106 - Filtro de Partidas Memo e Validade da BUT050|CR-106]].

---

## 4. Teste Pós Ajuste

> Além do roteiro geral de testes do revisor em [[CR-117 - Checklist de Testes no QAS|CR-117]], os cenários abaixo validam diretamente no **S4D** e no **QAS** (*Quality Assurance System* — ambiente de qualidade) a correção opcional sugerida pelo supervisor técnico referente ao **CR-115** *(executar caso implementada na Seção 3)*.

### Teste solicitado pelo Supervisor Técnico (ref. ao CR-115)

* **1. Eliminação de ambiguidade no `SELECT SINGLE` da `BUT050`** *(Seção 4 do [[Code Review 1.pdf|Code Review 1]])* — **Registro:** —
  - [ ] **1.1. Reexecução do **ATC** (*ABAP Test Cockpit*):** Rodar o ATC na `[[08 - ZCLFI_BP_CLIENTE_INAD|ZCLFI_BP_CLIENTE_INAD]]` e confirmar a eliminação do achado `AMB_SINGLE` no método `obter_grupo_economico`.
  - [ ] **1.2. Determinismo com múltiplos vínculos na `BUT050`:** Testar no QAS com uma filial que possua registro histórico encerrado e registro vigente na `BUT050` (`UKM001`), confirmando que `obter_grupo_economico` identifica sempre a Matriz correta e vigente de forma determinística.

### Testes adicionais do que foi implementado aqui (além do pedido pelo supervisor)

* **1. Regressão dos 3 fluxos de `obter_grupo_economico`** — **Registro:** —
  - [ ] **1.1. Matriz, Filial e Parceiro individual:** Validar nas ações em lote que o método continua resolvendo corretamente grupos consultados pela Matriz, pela Filial e por parceiros sem vínculo `UKM001`, sem duplicidades na lista de membros.
