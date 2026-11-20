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

### O que será feito em cada objeto

#### Decisão Recomendada — Cenário A: Manter Soberania do Usuário (Não Implementar)

1. **Alinhamento funcional e justificativa formal ao revisor *(Atividade de Governança — `[Manual]`)*:**
   * **Confirmação da regra de negócio vigente:** Validar com o consultor funcional se permanece válida a decisão formalizada em 23/10/2026 no item 23 do [[03 - Consolidado de decisões tomadas em todas as reuniões|consolidado de reuniões]]: a coluna `AcaoProposta` atua apenas como sugestão e ordenação visual, enquanto a decisão do usuário é soberana — podendo acionar **Bloquear** e **Desbloquear** para qualquer cliente listado, independentemente do valor sugerido na coluna.
   * **Manutenção integral dos objetos atuais:** Confirmada a manutenção dessa regra, **não alterar** as definições de comportamento (**BDEF** — *Behavior Definition*) `[[07 - ZI_FI_CLIENTE_INADIMPLENTE (BDEF)|ZI_FI_CLIENTE_INADIMPLENTE (BDEF)]]` e `[[11 - ZC_FI_CLIENTE_INADIMPLENTE (BDEF)|ZC_FI_CLIENTE_INADIMPLENTE (BDEF)]]` nem a classe `[[08 - ZCLFI_BP_CLIENTE_INAD|ZCLFI_BP_CLIENTE_INAD]]`.
   * **Resposta formal no retorno do Code Review:** Registrar ao revisor técnico que a disponibilidade contínua de ambos os botões é um requisito funcional validado com o negócio, mantendo-se exclusivamente o controle de acesso por instância em `get_instance_authorizations` sobre o objeto de autorização `[[02 - ZFI_BLOQ|ZFI_BLOQ]]` (atividades `05` e `43`).

#### Roteiro Técnico Condicional — Cenário B: Somente se o Funcional Revogar a Decisão de 23/10/2026

> Executar os ajustes abaixo **exclusivamente** caso a área funcional decida revogar a soberania dos botões e aprove por escrito a regra exata de habilitação/desabilitação por linha (por exemplo, com base em `AcaoProposta`, `IsBlocked` e `BlockReason`).

1. **[[07 - ZI_FI_CLIENTE_INADIMPLENTE (BDEF)|ZI_FI_CLIENTE_INADIMPLENTE (BDEF)]] *(BDEF Root — Ajustar `[MCP]`)*:**
   * Alterar a declaração atual das duas ações para ativar o controle dinâmico por instância:
     * `action ( features : instance ) bloquearCliente result [1] $self;`
     * `action ( features : instance ) desbloquearCliente result [1] $self;`

2. **[[11 - ZC_FI_CLIENTE_INADIMPLENTE (BDEF)|ZC_FI_CLIENTE_INADIMPLENTE (BDEF)]] *(BDEF Projection — Reativar `[MCP]`)*:**
   * Reativar a definição de comportamento de projeção (`use action bloquearCliente;` e `use action desbloquearCliente;`) após a mudança na raiz, para refletir o controle de *features* herdado no serviço exposto.

3. **[[08 - ZCLFI_BP_CLIENTE_INAD|ZCLFI_BP_CLIENTE_INAD]] *(Behavior Pool `Local Types` / `CCIMP` — Ajustar `[MCP]`)*:**
   * **Declaração na classe local `lhc_clienteinadimplente`:** Adicionar a assinatura `METHODS get_instance_features FOR INSTANCE FEATURES IMPORTING keys REQUEST requested_features FOR ClienteInadimplente RESULT result.`.
   * **Implementação de `get_instance_features`:** Ler `AcaoProposta` (e/ou `IsBlocked` e `BlockReason`, conforme a regra exata aprovada) via `READ ENTITIES OF zi_fi_cliente_inadimplente IN LOCAL MODE ENTITY ClienteInadimplente FIELDS ( ... ) WITH CORRESPONDING #( keys ) RESULT DATA(lt_clientes)`.
   * **Controle dos botões:** Devolver **if_abap_behv\=>fc-o-enabled** ou **if_abap_behv\=>fc-o-disabled** para `%action-bloquearCliente` e `%action-desbloquearCliente` em `result`, operando em conjunto com `get_instance_authorizations` sobre `[[02 - ZFI_BLOQ|ZFI_BLOQ]]`.

4. **[[13 - ZUI_O2_FI_CLIENTE_INAD|ZUI_O2_FI_CLIENTE_INAD]] *(Service Binding — Validar/Limpar Cache `[Manual]`)*:**
   * Validar os metadados **OData** (*Open Data Protocol*) V2 do serviço `ZUI_O2_FI_CLIENTE_INAD` após a reativação dos BDEFs e limpar o cache (`/IWFND/CACHE_CLEANUP`) para que o aplicativo Fiori Elements `[[14 - bloqinadimplente (App Fiori)|bloqinadimplente]]` reconheça o controle dinâmico dos botões na interface.

### Dependências / Decisões

* **Estado atual confirmado no SAP DEV (`Veiling_S4D_100_GVSOUZA_PT`):** Os objetos `ZI_FI_CLIENTE_INADIMPLENTE` (**BDEF** raiz) e `ZC_FI_CLIENTE_INADIMPLENTE` (**BDEF** projeção) encontram-se ativos sem `( features : instance )`, e a classe `ZCLFI_BP_CLIENTE_INAD` implementa apenas `get_instance_authorizations` (sem `get_instance_features`).
* **Cenário A (Recomendado — `[Manual]`):** Não há alteração de objetos **RAP** (*ABAP RESTful Application Programming Model*) nem impacto nas demais CRs; exige apenas confirmação funcional da regra de 23/10/2026 e resposta formal ao revisor.
* **Cenário B (Condicional — `/gerar-guia-code-review-sap` + `/implementar-demanda-sap` + `[Manual]`):** Como envolve múltiplos objetos interdependentes (**BDEF** Raiz + **BDEF** Projeção + Behavior Pool + Service Binding), caso o funcional aprove a habilitação dinâmica, recomenda-se gerar o guia dedicado via `/gerar-guia-code-review-sap` e executá-lo por `/implementar-demanda-sap`, encerrando com a validação e limpeza manual de cache do Service Binding.
* **Impacto em outras CRs (apenas no Cenário B):** Amplia o escopo de **ABAP Doc** (*ABAP Documentation* — comentários ` "! `) e eventuais testes unitários da `[[CR-116 - Documentação ABAP Doc e Testes ABAP Unit|CR-116]]` (inclusão de `get_instance_features`) e deve anteceder eventual redeploy da `[[CR-111 - Idioma Original Alemão no Deploy do App Fiori|CR-111]]`.

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
