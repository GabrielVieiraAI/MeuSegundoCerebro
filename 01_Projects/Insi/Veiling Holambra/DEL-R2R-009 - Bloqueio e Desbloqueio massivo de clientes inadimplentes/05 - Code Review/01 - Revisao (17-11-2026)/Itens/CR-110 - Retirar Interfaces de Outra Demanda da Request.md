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
item_cr: CR-110
prioridade: Recomendado (Ponto de Atenção)
status: Pendente
data: 2026-11-18
sap_destination: ""
transport_requests: []
---

# 🟡 CR-110: Retirar Interfaces de Outra Demanda (ZPI_FI_*) da Request

🗺️ [[00 - DEL-R2R-009 - Escada Code Review 1.excalidraw|Voltar para a Escada]] | 📄 [[Code Review 1.pdf|PDF Original]] | ⬅️ [[CR-109 - Catch Vazio e Exceções Genéricas na Classe|CR-109]] | ➡️ [[CR-111 - Idioma Original Alemão no Deploy do App Fiori|CR-111]]

---

## 1. O que está sendo apontado (Linguagem de Negócio)

No pacote de entrega desta demanda de bloqueio e desbloqueio de inadimplentes, foram incluídos por engano dois itens pertencentes a outro projeto (demanda de carga de taxas):

* **Risco de falha ao transportar a entrega para o ambiente de testes e produção:** Como esses dois itens pertencem a outra iniciativa que pode ainda não estar implantada nos próximos ambientes, mantê-los junto com a entrega atual pode travar ou gerar erro na subida da solução para o ambiente de qualidade.

---

## 2. O que eu preciso fazer (Linguagem de Negócio)

Para garantir que a entrega desta solução seja transportada para os ambientes de testes e de produção sem interferir nem depender de outros projetos em andamento, devem ser tomadas as seguintes ações:

1. **Retirar do pacote de entrega os dois itens que pertencem à demanda de carga de taxas:**
   * Remover da entrega atual os dois componentes vinculados ao projeto de carga de taxas que foram incluídos na mesma entrega por engano, deixando no pacote exclusivamente os itens que fazem parte da solução de bloqueio e desbloqueio de inadimplentes.
2. **Vincular os itens removidos ao pacote de entrega do projeto correto:**
   * Incluir esses dois componentes na entrega específica da demanda de carga de taxas, garantindo que nenhum trabalho da outra frente seja perdido e que cada projeto siga seu fluxo de aprovação e implantação de forma independente.

---

## 3. Plano de Ação
* **O que será feito:** *(A definir após entendimento na etapa 2)*
* **Dependências / Decisões:** Priorizar antes de enviar a entrega para testes no ambiente de qualidade.

---

## 4. Teste Pós Ajuste

> Além do roteiro geral de testes do revisor em [[CR-117 - Checklist de Testes no QAS|CR-117]], os cenários abaixo validam a limpeza da *Transport Request* exigida pelo supervisor técnico referente ao **CR-110** antes do transporte para o **QAS** (*Quality Assurance System* — ambiente de qualidade).

### Teste solicitado pelo Supervisor Técnico (ref. ao CR-110)

* **1. Remoção das interfaces de outra demanda da tarefa `S4DK900953` / request `S4DK900952`** *(item 10 da Seção 3 e Tabela de Conformidade do [[Code Review 1.pdf|Code Review 1]])* — **Registro:** —
  - [ ] **1.1. Exclusão na `SE09`/`SE10`:** Abrir a request `S4DK900952` e a tarefa `S4DK900953` e confirmar que os objetos `PINF ZPI_FI_CARGA_TAXAS` e `PINF ZPI_FI_TAX_COMUM` foram removidos desta ordem de transporte.
  - [ ] **1.2. Realocação na demanda de origem:** Confirmar que ambos os objetos `PINF` foram incluídos na *request* da demanda de carga de taxas sem perda de alteração.
  - [ ] **1.3. Transporte limpo para o QAS:** Validar na importação (via cópia de transporte ou liberação) no QAS que a request sobe sem erros de dependência de pacotes de outra demanda.

### Testes adicionais do que foi implementado aqui (além do pedido pelo supervisor)

* **1. Auditoria integral da lista de objetos da request `S4DK900952`** — **Registro:** —
  - [ ] **1.1. Conferência de escopo exclusivo da `DEL-R2R-009`:** Revisar todos os objetos restantes vinculados à `S4DK900952` confirmando que 100% pertencem ao pacote `ZFI_BLOQ_INADIMPLENTES` ou ao escopo desta demanda.
