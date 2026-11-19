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
item_cr: CR-114
prioridade: Melhoria Opcional
status: Pendente
data: 2026-11-18
sap_destination: ""
transport_requests: []
---

# 🔵 CR-114: Habilitação Dinâmica dos Botões (Features Instance)

🗺️ [[00 - DEL-R2R-009 - Escada Code Review 1.excalidraw|Voltar para a Escada]] | 📄 [[Code Review 1.pdf|PDF Original]] | ⬅️ [[CR-113 - Checagem de Tabela Vazia e Failed no Método Read|CR-113]] | ➡️ [[CR-115 - Ambiguidade no Select Single da BUT050|CR-115]]

---

## 1. O que está sendo apontado (Linguagem de Negócio)

Na tela principal do aplicativo, os botões **Bloquear** e **Desbloquear** permanecem sempre habilitados para qualquer cliente selecionado (desde que o usuário tenha permissão de acesso), independentemente da situação atual ou da sugestão exibida na linha:

* **Sugestão de ativação dinâmica dos botões:** O revisor sugeriu avaliar com o negócio se cada botão deveria ficar habilitado apenas quando fizesse sentido para a linha selecionada (conforme a sugestão da coluna de ação proposta), evitando cliques acidentais em ações desnecessárias.

---

## 2. O que eu preciso fazer (Linguagem de Negócio)

Para tratar esta sugestão opcional sem contrariar as regras já acordadas com a área de negócio, devem ser seguidos os passos abaixo:

1. **Confirmar com a área de negócio se os botões devem permanecer livres ou seguir a sugestão da linha:**
   * Validar com o responsável funcional se a decisão original de reunião — em que a decisão do usuário é soberana e os botões **Bloquear** e **Desbloquear** podem ser acionados para qualquer cliente independentemente da sugestão da coluna de ação proposta — deve ser mantida, ou se o negócio prefere restringir os botões conforme o estado/sugestão da linha.
2. **Aplicar a regra dinâmica somente se a área de negócio aprovar a mudança:**
   * Caso o negócio opte por manter a decisão soberana do usuário, registrar essa definição formalmente para justificar ao revisor a manutenção dos botões sempre ativos.
   * Caso o negócio aprove a ativação dinâmica, configurar a tela para habilitar ou desabilitar automaticamente os botões **Bloquear** e **Desbloquear** conforme a condição de cada linha selecionada.

---

## 3. Plano de Ação
* **O que será feito:** *(A definir após entendimento na etapa 2)*
* **Dependências / Decisões:** Atenção ao alinhamento funcional consolidado em reunião (os botões devem funcionar de forma soberana independentemente da sugestão de ação proposta).

---

## 4. Teste Pós Ajuste

> Além do roteiro geral de testes do revisor em [[CR-117 - Checklist de Testes no QAS|CR-117]], os cenários abaixo validam diretamente no **QAS** (*Quality Assurance System* — ambiente de qualidade) a melhoria opcional sugerida pelo supervisor técnico referente ao **CR-114** *(executar somente se aprovado pelo funcional e implementado na Seção 3)*.

### Teste solicitado pelo Supervisor Técnico (ref. ao CR-114)

* **1. Habilitação dinâmica dos botões via `features ( instance )`** *(Seção 4 do [[Code Review 1.pdf|Code Review 1]])* — **Registro:** —
  - [ ] **1.1. Linha com `AcaoProposta = 'Bloquear'`:** Selecionar um cliente elegível para bloqueio e validar que o botão **Bloquear** fica habilitado e o botão **Desbloquear** se comporta estritamente conforme a regra acordada com o funcional.
  - [ ] **1.2. Linha com `AcaoProposta = 'Desbloquear'` ou em branco:** Selecionar linhas com sugestão de desbloqueio e linhas com sugestão em branco, confirmando habilitação/desabilitação dinâmica coerente com a regra definida e combinada com as permissões do `[[02 - ZFI_BLOQ|ZFI_BLOQ]]`.

### Testes adicionais do que foi implementado aqui (além do pedido pelo supervisor)

* **1. Alinhamento com a decisão funcional de soberania do usuário** — **Registro:** —
  - [ ] **1.1. Validação com o consultor funcional:** Confirmar formalmente antes e depois da implantação que a eventual restrição de botões por `features ( instance )` não bloqueia cenários operacionais onde o usuário precisa agir manualmente mesmo com `AcaoProposta` em branco (decisão original de 23/10/2026).
