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
status: Pendente
data: 2026-11-18
sap_destination: ""
transport_requests: []
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
* **O que será feito:** *(A definir após entendimento na etapa 2)*
* **Dependências / Decisões:** —

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
