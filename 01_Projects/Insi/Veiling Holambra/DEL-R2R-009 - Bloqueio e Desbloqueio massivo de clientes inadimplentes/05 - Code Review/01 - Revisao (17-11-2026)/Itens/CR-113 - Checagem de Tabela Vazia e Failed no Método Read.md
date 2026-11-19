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
item_cr: CR-113
prioridade: Melhoria Opcional
status: Pendente
data: 2026-11-18
sap_destination: ""
transport_requests: []
---

# 🔵 CR-113: Checagem de Tabela Vazia (FOR ALL ENTRIES) e Preenchimento de failed no Read

🗺️ [[00 - DEL-R2R-009 - Escada Code Review 1.excalidraw|Voltar para a Escada]] | 📄 [[Code Review 1.pdf|PDF Original]] | ⬅️ [[CR-112 - Ajustes na Tabela ZTFI_LOG_INADIMP|CR-112]] | ➡️ [[CR-114 - Habilitação Dinâmica dos Botões (Features Instance)|CR-114]]

---

## 1. O que está sendo apontado (Linguagem de Negócio)

Na rotina que recarrega os dados dos clientes selecionados pelo usuário no momento da ação, foram identificadas duas melhorias preventivas:

* **Falta de verificação quando nenhum registro é recebido na busca:** Caso a rotina de leitura seja acionada sem nenhum cliente preenchido na lista de entrada, o sistema não interrompe a busca antecipadamente, correndo o risco de consultar toda a base de clientes sem necessidade.
* **Ausência de sinalização quando um cliente selecionado não é encontrado:** Se algum cliente selecionado na tela deixar de atender aos critérios da listagem no exato momento da leitura (por exemplo, se outro usuário alterou sua situação instantes antes), o sistema não sinaliza formalmente que aquele registro específico não foi localizado.

---

## 2. O que eu preciso fazer (Linguagem de Negócio)

Para tornar a rotina de leitura dos clientes selecionados mais segura e eficiente (caso esta melhoria opcional seja implementada), o comportamento deve ser ajustado em dois pontos:

1. **Encerrar a consulta imediatamente quando nenhum cliente for informado:**
   * Antes de buscar os dados na base, verificar se a lista de clientes solicitada está vazia; caso não haja nenhum cliente selecionado na chamada, retornar imediatamente sem executar uma busca desnecessária em toda a base de clientes.
2. **Sinalizar formalmente quando um cliente solicitado não for encontrado:**
   * Comparar os clientes solicitados com os registros efetivamente encontrados na consulta e, caso algum cliente selecionado não seja localizado no momento da leitura, registrar formalmente a falha de localização daquele item para que o aplicativo trate a ausência de forma controlada.

---

## 3. Plano de Ação
* **O que será feito:** *(A definir após análise na etapa 2)*
* **Dependências / Decisões:** Melhoria opcional — ajuste simples e seguro.

---

## 4. Teste Pós Ajuste

> Além do roteiro geral de testes do revisor em [[CR-117 - Checklist de Testes no QAS|CR-117]], os cenários abaixo validam diretamente no **S4D** e no **QAS** (*Quality Assurance System* — ambiente de qualidade) as melhorias preventivas sugeridas pelo supervisor técnico referentes ao **CR-113** *(executar caso esta melhoria opcional seja implementada)*.

### Teste solicitado pelo Supervisor Técnico (ref. ao CR-113)

* **1. Checagem de tabela `keys` vazia e preenchimento de `failed` no método `read`** *(Seção 4 do [[Code Review 1.pdf|Code Review 1]])* — **Registro:** —
  - [ ] **1.1. Reexecução do **ATC** (*ABAP Test Cockpit*):** Rodar o ATC na `[[08 - ZCLFI_BP_CLIENTE_INAD|ZCLFI_BP_CLIENTE_INAD]]` e confirmar a eliminação do achado `FAllRisky` (`FOR ALL ENTRIES IN @keys` sem checagem prévia de vazio).
  - [ ] **1.2. Comportamento com `keys` vazio ou chave não encontrada:** Validar via teste unitário / depuração que uma chamada com `keys` vazio retorna imediatamente sem consultar o banco, e que uma chave ausente na view é inserida em `failed-clienteinadimplente` (com `%tky` e causa `not_found`).

### Testes adicionais do que foi implementado aqui (além do pedido pelo supervisor)

* **1. Regressão da leitura nas ações de Bloqueio e Desbloqueio** — **Registro:** —
  - [ ] **1.1. Leitura interna pelo `READ ENTITIES ... IN LOCAL MODE`:** Executar bloqueio e desbloqueio pelo aplicativo Fiori no QAS confirmando que os dados das linhas selecionadas continuam sendo carregados normalmente pelo método `read`.
