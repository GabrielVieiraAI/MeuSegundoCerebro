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
status: concluido
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

### O que será feito em cada objeto

1. **`ZPI_FI_CARGA_TAXAS` *(Package Interface `R3TR PINF` — Remover da Request `[Manual]` via SAP GUI `SE09`/`SE10`)*:**
   * **Estado confirmado no SAP DEV (*Development System* — ambiente de desenvolvimento, destino `Veiling_S4D_100_GVSOUZA_PT`):** O objeto `ZPI_FI_CARGA_TAXAS` **não existe mais no repositório ABAP** (*Advanced Business Application Programming*). Conforme documentado em [[00B - ZPI_FI_TAX_COMUM (Package Interface)|00B - ZPI_FI_TAX_COMUM]], tratava-se de uma *Package Interface* (interface de pacote) de teste dentro de `ZFI_CARGA_TAXAS` que foi excluída no início da demanda `DEL-COM-165`, restando na tarefa `S4DK900953` da request `S4DK900952` apenas a entrada órfã / de exclusão `R3TR PINF ZPI_FI_CARGA_TAXAS`.
   * **Ação na `SE09`/`SE10` (*Transport Organizer* — gerenciador de ordens de transporte do SAP GUI — *SAP Graphical User Interface*):**
     * Abrir a **TR** (*Transport Request* — ordem de transporte) `S4DK900952` e expandir a tarefa modificável `S4DK900953`.
     * Conferir se a entrada `R3TR PINF ZPI_FI_CARGA_TAXAS` nunca foi transportada anteriormente ao **QAS** (*Quality Assurance System* — ambiente de qualidade), consultando o histórico de versões/transportes do objeto ou validando com a frente da `DEL-COM-165` que a exclusão ocorreu apenas em DEV.
     * Confirmado que nunca subiu ao QAS, remover a linha `R3TR PINF ZPI_FI_CARGA_TAXAS` da lista de objetos da tarefa `S4DK900953` (liberando eventuais *locks* — bloqueios de edição/transporte — associados), sem necessidade de recriar o objeto no repositório.

2. **[[00B - ZPI_FI_TAX_COMUM (Package Interface)|ZPI_FI_TAX_COMUM]] *(Package Interface `R3TR PINF` — Remover da Request `[Manual]` e Garantir na TR de Origem `[Manual]` via SAP GUI `SE09`/`SE10`)*:**
   * **Estado confirmado no SAP DEV (`Veiling_S4D_100_GVSOUZA_PT`):** O objeto `ZPI_FI_TAX_COMUM` (`PINF/KI`) está **ativo no pacote `ZFI_TAX_COMUM`** (subpacote compartilhado da estrutura `ZFI_CARGA_TAXAS`), pertencendo exclusivamente à demanda `DEL-COM-165` (*Carga Massiva de Lançamentos de Taxas com Razão Especial* — ver também [[11B - ZPI_FI_TAX_COMUM (Inclusão de Elementos)|ZPI_FI_TAX_COMUM (Inclusão de Elementos)]]).
   * **Remoção da request da `DEL-R2R-009`:**
     * Na mesma tarefa `S4DK900953` (request `S4DK900952`), remover a entrada `R3TR PINF ZPI_FI_TAX_COMUM` da lista de objetos e liberar eventuais *locks* associados, impedindo que a subida da `DEL-R2R-009` transporte ou falhe por dependência de objetos da `DEL-COM-165`.
   * **Garantia de vínculo na TR da `DEL-COM-165` (`S4DK901042`):**
     * Abrir a request oficial da demanda `DEL-COM-165` (`S4DK901042` — *DEL-COM-165 - Carga Massiva de Lançamentos de Taxas*) na `SE09`/`SE10` e verificar se `R3TR PINF ZPI_FI_TAX_COMUM` já consta na lista de objetos de sua tarefa modificável.
     * Caso ainda não conste na `S4DK901042`, incluí-la manualmente via opção *Include Objects* (*Incluir objetos* -> `R3TR` / `PINF` / `ZPI_FI_TAX_COMUM`) e salvar na tarefa da `S4DK901042`, preservando a definição e os elementos expostos da interface na entrega da demanda correta.

3. **Request `S4DK900952` / Tarefa `S4DK900953` *(Ordem de Transporte da `DEL-R2R-009` — Auditar Lista Restante `[Manual]` via SAP GUI `SE09`/`SE10`)*:**
   * Após remover ambas as entradas `R3TR PINF`, revisar integralmente os objetos restantes na tarefa `S4DK900953` e na request `S4DK900952`, confirmando que **100% pertencem ao pacote `ZFI_BLOQ_INADIMPLENTES`** ou ao escopo exclusivo da demanda `DEL-R2R-009` (incluindo os objetos de backend e de publicação do aplicativo Fiori `ZZ1_BLOQ_INAD`), antes de gerar cópia de transporte ou liberar para o QAS.

### Dependências / Decisões

* **Modo de execução `[Manual]` (não aplicável ao MCP `sap-adt`, a `/implementar-cr-simples` nem a `/gerar-guia-code-review-sap`):** A manipulação de entradas e *locks* na lista de objetos de ordens de transporte na `SE09`/`SE10` não é suportada pelas ferramentas do servidor **MCP** (*Model Context Protocol*) `sap-adt` e não requer geração de guia técnico nem uso de `/implementar-cr-simples`. Toda a execução deve ser feita manualmente pelo desenvolvedor no **SAP GUI** (`SE09`/`SE10`).
* **Dependência crítica antes de transporte ao QAS:** Este ajuste na `S4DK900952` / `S4DK900953` deve ser concluído obrigatoriamente **antes** de gerar uma cópia de transporte (*Transport of Copies*) para os testes finais no QAS ou de liberar a request oficial, garantindo uma importação limpa e livre de dependências cruzadas com `ZFI_CARGA_TAXAS` / `ZFI_TAX_COMUM`.
* **Decisão para a entrada órfã `ZPI_FI_CARGA_TAXAS`:** Conforme confirmado em consulta somente leitura no SAP DEV, `ZPI_FI_CARGA_TAXAS` não existe mais no repositório. Desde que não tenha sido transportada anteriormente ao QAS, basta removê-la da `S4DK900953` sem recriá-la (caso excepcionalmente já tenha ido ao QAS em alguma cópia prévia, transferir o registro de exclusão para a `S4DK901042` antes de remover da `S4DK900953`).
* **Independência entre frentes:** Com `ZPI_FI_TAX_COMUM` removida da `S4DK900952` e garantida na `S4DK901042`, as entregas de `DEL-R2R-009` e `DEL-COM-165` passam a tramitar de forma totalmente independente até produção.

---

## 4. Teste Pós Ajuste

> Além do roteiro geral de testes do revisor em [[CR-117 - Checklist de Testes no QAS|CR-117]], os cenários abaixo validam a limpeza da *Transport Request* exigida pelo supervisor técnico referente ao **CR-110** antes do transporte para o **QAS** (*Quality Assurance System* — ambiente de qualidade).

### Teste solicitado pelo Supervisor Técnico (ref. ao CR-110)

* **1. Remoção das interfaces de outra demanda da tarefa `S4DK900953` / request `S4DK900952`** *(item 10 da Seção 3 e Tabela de Conformidade do [[Code Review 1.pdf|Code Review 1]])* — **Registro:** —
  - [x] **1.1. Exclusão na `SE09`/`SE10`:** Abrir a request `S4DK900952` e a tarefa `S4DK900953` e confirmar que os objetos `PINF ZPI_FI_CARGA_TAXAS` e `PINF ZPI_FI_TAX_COMUM` foram removidos desta ordem de transporte. ✅ 2026-11-19
  - [x] **1.2. Realocação na demanda de origem:** Confirmar que ambos os objetos `PINF` foram incluídos na *request* da demanda de carga de taxas sem perda de alteração. ✅ 2026-11-19
  - [x] **1.3. Transporte limpo para o QAS:** Validar na importação (via cópia de transporte ou liberação) no QAS que a request sobe sem erros de dependência de pacotes de outra demanda. ✅ 2026-11-19

### Testes adicionais do que foi implementado aqui (além do pedido pelo supervisor)

* **1. Auditoria integral da lista de objetos da request `S4DK900952`** — **Registro:** —
  - [x] **1.1. Conferência de escopo exclusivo da `DEL-R2R-009`:** Revisar todos os objetos restantes vinculados à `S4DK900952` confirmando que 100% pertencem ao pacote `ZFI_BLOQ_INADIMPLENTES` ou ao escopo desta demanda. ✅ 2026-11-19
