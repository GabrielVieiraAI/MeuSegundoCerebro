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
item_cr: CR-112
prioridade: Melhoria Opcional
status: Pendente
data: 2026-11-18
sap_destination: ""
transport_requests: []
---

# 🔵 CR-112: Ajustes Técnicos na Tabela ZTFI_LOG_INADIMP

🗺️ [[00 - DEL-R2R-009 - Escada Code Review 1.excalidraw|Voltar para a Escada]] | 📄 [[Code Review 1.pdf|PDF Original]] | ⬅️ [[CR-111 - Idioma Original Alemão no Deploy do App Fiori|CR-111]] | ➡️ [[CR-113 - Checagem de Tabela Vazia e Failed no Método Read|CR-113]]

---

## 1. O que está sendo apontado (Linguagem de Negócio)

O cadastro que armazena o histórico de auditoria dos bloqueios e desbloqueios apresenta três pontos de melhoria referentes a segurança da informação, padronização e desempenho:

* **Permissão de alteração manual no histórico de auditoria:** O cadastro de histórico está configurado permitindo manutenção manual com restrições. Por se tratar de um registro oficial de auditoria (quem bloqueou, quando e por qual motivo), ele não deve permitir edição ou alteração manual direta.
* **Falta de padronização nos rótulos de algumas colunas:** Algumas informações gravadas no histórico (como ação realizada, resultado, mensagem, valor vencido, dias em atraso e data/hora) foram criadas sem vínculo com os padrões de nomenclatura e rótulos do dicionário do sistema.
* **Lentidão em consultas futuras por cliente:** Ainda não existe um organizador de busca rápida por código de cliente no histórico, o que pode tornar a pesquisa lenta conforme o volume de bloqueios e desbloqueios crescer ao longo do tempo.

---

## 2. O que eu preciso fazer (Linguagem de Negócio)

Para reforçar a segurança da informação, a padronização visual e o desempenho de consultas futuras no histórico de auditoria dos bloqueios e desbloqueios (caso esta melhoria opcional seja aprovada), devem ser realizados os seguintes ajustes:

1. **Bloquear a alteração manual direta no histórico de auditoria:**
   * Alterar a configuração do cadastro de histórico para **não permitir manutenção manual**, garantindo que os registros de quem bloqueou ou desbloqueou um cliente só possam ser gravados pela própria rotina oficial do aplicativo e nunca editados manualmente.
2. **Padronizar os rótulos das colunas do histórico:**
   * Vincular as informações de ação realizada, status, mensagem de retorno, valor vencido, dias em atraso e data/hora de criação a definições padronizadas do sistema, para que exibam títulos claros em qualquer consulta ou relatório futuro.
3. **Otimizar a velocidade de busca por cliente:**
   * Incluir um organizador de pesquisa rápida pelo código do cliente no cadastro de histórico, garantindo consultas ágeis mesmo com o crescimento do volume de registros ao longo do tempo.

---

## 3. Plano de Ação
* **O que será feito:** *(A definir após análise na etapa 2)*
* **Dependências / Decisões:** Melhoria opcional — avaliar impacto e necessidade de ajuste na estrutura do histórico.

---

## 4. Teste Pós Ajuste

> Além do roteiro geral de testes do revisor em [[CR-117 - Checklist de Testes no QAS|CR-117]], os cenários abaixo validam diretamente no **S4D** e no **QAS** (*Quality Assurance System* — ambiente de qualidade) as melhorias opcionais sugeridas pelo supervisor técnico referentes ao **CR-112** *(executar os itens aplicáveis conforme o que for aprovado implementar na Seção 3)*.

### Teste solicitado pelo Supervisor Técnico (ref. ao CR-112)

* **1. Padronização **DDIC** (*ABAP Data Dictionary*), bloqueio de manutenção e índice na `[[01 - ZTFI_LOG_INADIMP|ZTFI_LOG_INADIMP]]`** *(Seção 4 do [[Code Review 1.pdf|Code Review 1]])* — **Registro:** —
  - [ ] **1.1. Elementos de dados:** Caso implementado, confirmar na `SE11`/ADT que os campos `ACAO`, `STATUS`, `MENSAGEM`, `VLR_VENCIDO`, `DIAS_ATRASO` e `CREATED_AT` utilizam elementos de dados com rótulos descritivos corretos.
  - [ ] **1.2. Bloqueio de edição manual (`#NOT_ALLOWED`):** Confirmar que `dataMaintenance` está configurado como manutenção não permitida e que a edição manual pela `SM30`/`SE16N` está bloqueada para preservar a integridade da auditoria.
  - [ ] **1.3. Índice por `PARTNER`:** Confirmar a criação/ativação do índice secundário pelo campo `PARTNER` e gravação normal de novas linhas de log no QAS.

### Testes adicionais do que foi implementado aqui (além do pedido pelo supervisor)

* **1. Compatibilidade de gravação na classe `[[08 - ZCLFI_BP_CLIENTE_INAD|ZCLFI_BP_CLIENTE_INAD]]`** — **Registro:** —
  - [ ] **1.1. Regressão do `INSERT ztfi_log_inadimp` e ATC:** Executar bloqueio e desbloqueio no aplicativo e validar que todos os campos do log continuam sendo gravados sem erro de tipo ou truncamento, com **ATC** (*ABAP Test Cockpit*) sem erros P1.
