---
tags:
  - projeto
  - cliente # ex: nome-cliente
  - sap
  - code-review
  - id-demanda # ex: del-com-165
  - prioridade-tag # ex: critico, recomendado, melhoria-opcional
id_demanda: "[ID-DEMANDA]"
revisao: "Code Review [N]"
request: "[REQUEST]"
tarefa: "[TAREFA]"
item_cr: "CR-[N]XX"
prioridade: "[Obrigatório (Crítico) | Recomendado (Ponto de Atenção) | Melhoria Opcional]"
status: Pendente
data: {{date}}
sap_destination: "" # Destino SAP de Desenvolvimento (DEV)
transport_requests: [] # Transport Requests selecionadas para execução direta do CR
---

# [🔴|🟡|🔵] CR-[N]XX: [Título do Apontamento]

🗺️ [[00 - [ID-DEMANDA] - Escada Code Review [N].excalidraw|Voltar para a Escada]] | 📄 [[Code Review [N].pdf|PDF Original]] | ⬅️ [[CR-[N]XX - [Item Anterior]|CR-[N]XX]] | ➡️ [[CR-[N]XX - [Próximo Item]|CR-[N]XX]]

---

## 1. O que está sendo apontado (Linguagem de Negócio)
[Explicação clara e direta do problema apontado na revisão sob a ótica de negócio, processo, comportamento em tela e impacto operacional, sem citar nomes técnicos de objetos, tabelas, campos ou código.]

---

## 2. O que eu preciso fazer (Linguagem de Negócio)
*(A preencher na análise individual do item)*

---

## 3. Plano de Ação

**Comparativo de Arquitetura *(quando aplicável)*:** [[NN - [ID-DEMANDA] - Comparativo Arquitetura CR-[N]XX.excalidraw|Visualizar Arquitetura Atual vs. Nova Arquitetura no Excalidraw]]
### O que será feito em cada objeto

1. **[[NN - NOME_OBJETO_1|NOME_OBJETO_1]] *([Tipo do Objeto] — [Criar | Ajustar | Reativar | Republicar])*:**
   * [Descrição direta da alteração que será feita neste objeto e como ela resolve o ponto levantado].
   * [Detalhe complementar da regra ou comportamento técnico aplicado neste objeto, quando necessário].

2. **[[NN - NOME_OBJETO_2|NOME_OBJETO_2]] *([Tipo do Objeto] — [Criar | Ajustar | Reativar | Republicar])*:**
   * [Descrição direta da alteração ou reativação necessária neste objeto dependente].

---

## 4. Teste Pós Ajuste

> Além do roteiro geral de testes do revisor em [[CR-[N]XX - Checklist de Testes no QAS|CR-[N]XX]], os cenários abaixo validam diretamente no **QAS** (*Quality Assurance System* — ambiente de qualidade) o teste exigido pelo supervisor técnico referente ao **CR-[N]XX** e os comportamentos adicionais desenhados nesta solução.

### Teste solicitado pelo Supervisor Técnico (ref. ao CR-[N]XX)

* **1. [Título do cenário cobrado pelo revisor]** *(item [X] do [[Code Review [N].pdf|Code Review [N]]])* — **Registro:** —
  - [ ] **1.1. [Título curto da verificação]:** [Ação/consulta a realizar e comportamento esperado na tela ou no histórico].
  - [ ] **1.2. [Título curto da verificação]:** [Ação/consulta a realizar e comportamento esperado na tela ou no histórico].

### Testes adicionais do que foi implementado aqui (além do pedido pelo supervisor)

* **1. [Título do cenário adicional decorrente da solução desenhada]** — **Registro:** —
  - [ ] **1.1. [Título curto da verificação]:** [Ação/consulta a realizar e comportamento esperado].
  - [ ] **1.2. [Título curto da verificação]:** [Ação/consulta a realizar e comportamento esperado].
