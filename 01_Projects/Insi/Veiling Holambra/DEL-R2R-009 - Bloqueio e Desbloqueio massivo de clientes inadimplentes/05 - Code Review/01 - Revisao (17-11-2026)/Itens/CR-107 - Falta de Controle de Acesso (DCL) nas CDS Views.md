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
item_cr: CR-107
prioridade: Recomendado (Ponto de Atenção)
status: concluido
data: 2026-11-18
sap_destination: ""
transport_requests: []
---

# 🟡 CR-107: Falta de Controle de Acesso (DCL) na Leitura das CDS Views

🗺️ [[00 - DEL-R2R-009 - Escada Code Review 1.excalidraw|Voltar para a Escada]] | 📄 [[Code Review 1.pdf|PDF Original]] | ⬅️ [[CR-106 - Filtro de Partidas Memo e Validade da BUT050|CR-106]] | ➡️ [[CR-108 - Textos Fixos em Vez da Classe de Mensagens|CR-108]]

---

## 1. O que está sendo apontado (Linguagem de Negócio)

Atualmente, o controle de permissão de segurança do aplicativo está sendo aplicado apenas nos botões de **Bloquear** e **Desbloquear**, mas não na visualização da lista de clientes:

* **Exposição de dados financeiros para usuários sem permissão na empresa ou segmento:** Qualquer usuário que tenha acesso ao aplicativo no painel inicial consegue visualizar todos os clientes, seus valores vencidos, dias em atraso e classe de risco, mesmo que o seu perfil de acesso não tenha autorização para consultar dados daquela empresa ou segmento de crédito.

---

## 2. O que eu preciso fazer (Linguagem de Negócio)

Para proteger o sigilo das informações financeiras e garantir que cada usuário visualize apenas os clientes para os quais possui permissão de acesso, a segurança de consulta do aplicativo deve ser ajustada nos seguintes pontos:

1. **Restringir a visualização da lista de clientes conforme o perfil de acesso do usuário:**
   * Ativar a verificação obrigatória de permissão de leitura na consulta do aplicativo, vinculada à empresa e à área de crédito autorizadas para o usuário.
2. **Exigir permissão de visualização além das permissões de ação:**
   * Garantir que o usuário precise ter a permissão de **consulta** para enxergar os clientes, valores vencidos, dias em atraso e classe de risco na tela, mantendo em paralelo as permissões específicas já existentes que habilitam ou desabilitam os botões **Bloquear** e **Desbloquear**.
   * Caso o usuário não possua autorização de leitura para determinada empresa ou área de crédito, os registros correspondentes não devem ser exibidos na listagem.

---

## 3. Plano de Ação
* **O que será feito:** *(A definir após entendimento na etapa 2)*
* **Dependências / Decisões:** —

---

## 4. Teste Pós Ajuste

> Além do roteiro geral de testes do revisor em [[CR-117 - Checklist de Testes no QAS|CR-117]], os cenários abaixo validam diretamente no **QAS** (*Quality Assurance System* — ambiente de qualidade) o controle de acesso exigido pelo supervisor técnico referente ao **CR-107** *(complementar após definição final da Seção 3, se necessário)*.

### Teste solicitado pelo Supervisor Técnico (ref. ao CR-107)

* **1. Controle de visualização via DCL e restrição dos botões via `ZFI_BLOQ`** *(item 6 da Seção 5 e item 7 da Seção 3 do [[Code Review 1.pdf|Code Review 1]])* — **Registro:** —
  - [ ] **1.1. Usuário sem atividade `03` (Exibir):** Acessar o aplicativo no QAS com um usuário de teste que possua acesso ao catálogo, mas sem permissão no objeto `[[02 - ZFI_BLOQ|ZFI_BLOQ]]` para atividade `03` (ou restrito a outro segmento/empresa), e confirmar que os clientes não autorizados **não são exibidos** na lista.
  - [ ] **1.2. Usuário sem atividade `05` (Bloquear) ou `43` (Desbloquear):** Acessar com usuário que tenha apenas leitura (`03`) e uma das ações, validando que o botão correspondente à atividade ausente permanece desabilitado.
  - [ ] **1.3. Usuário com acesso completo (`03`, `05` e `43`):** Confirmar exibição integral da lista para a empresa/segmento autorizados e funcionamento normal de ambos os botões.

### Testes adicionais do que foi implementado aqui (além do pedido pelo supervisor)

* **1. Conformidade de segurança da **DCL** (*Data Control Language*) e **ATC*** — **Registro:** —
  - [ ] **1.1. Anotação `#CHECK` e ativação da DCL:** Validar que a **CDS** (*Core Data Services*) de consumo possui `@AccessControl.authorizationCheck: #CHECK`, DCL ativa de mesmo nome e zero achados de segurança no **ATC** (*ABAP Test Cockpit*).
