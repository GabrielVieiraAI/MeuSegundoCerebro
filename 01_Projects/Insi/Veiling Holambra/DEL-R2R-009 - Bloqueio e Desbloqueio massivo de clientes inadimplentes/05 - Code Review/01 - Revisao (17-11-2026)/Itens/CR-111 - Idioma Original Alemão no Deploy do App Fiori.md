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
item_cr: CR-111
prioridade: Recomendado (Ponto de Atenção)
status: Pendente
data: 2026-11-18
sap_destination: ""
transport_requests: []
---

# 🟡 CR-111: Idioma Original Alemão (DE) no Deploy do App Fiori (ZZ1_BLOQ_INAD)

🗺️ [[00 - DEL-R2R-009 - Escada Code Review 1.excalidraw|Voltar para a Escada]] | 📄 [[Code Review 1.pdf|PDF Original]] | ⬅️ [[CR-110 - Retirar Interfaces de Outra Demanda da Request|CR-110]] | ➡️ [[CR-112 - Ajustes na Tabela ZTFI_LOG_INADIMP|CR-112]]

---

## 1. O que está sendo apontado (Linguagem de Negócio)

O aplicativo publicado no painel do usuário foi gerado com o idioma original configurado como **Alemão**, em vez do padrão **Português** exigido pela empresa:

* **Desconformidade com o padrão de idioma do ambiente:** Embora o nome do aplicativo esteja correto, ter o idioma original registrado em alemão foge à regra de governança do projeto e pode causar inconsistências na exibição de textos ou em futuras manutenções realizadas em português.

---

## 2. O que eu preciso fazer (Linguagem de Negócio)

Para adequar o aplicativo publicado no painel do usuário ao padrão oficial de governança da cooperativa e evitar divergências de idioma em textos e manutenções futuras, devem ser realizados os seguintes passos:

1. **Definir o Português como idioma original do aplicativo publicado e de seus componentes:**
   * Ajustar o cadastro do aplicativo publicado (ou republicá-lo estando conectado em português) para que o idioma original dele e de seus arquivos de interface passe de **Alemão** para **Português**.
2. **Validar a exibição da tela após o ajuste:**
   * Conferir a abertura do aplicativo em português garantindo que todos os títulos, colunas, filtros e botões continuem sendo apresentados normalmente ao usuário final.

---

## 3. Plano de Ação
* **O que será feito:** *(A definir após entendimento na etapa 2)*
* **Dependências / Decisões:** —

---

## 4. Teste Pós Ajuste

> Além do roteiro geral de testes do revisor em [[CR-117 - Checklist de Testes no QAS|CR-117]], os cenários abaixo validam diretamente no **S4D** e no **QAS** (*Quality Assurance System* — ambiente de qualidade) a correção de idioma recomendada pelo supervisor técnico referente ao **CR-111**.

### Teste solicitado pelo Supervisor Técnico (ref. ao CR-111)

* **1. Ajuste do idioma original para Português (`PT`) no deploy do app** *(item 11 da Seção 3 e Tabela de Conformidade do [[Code Review 1.pdf|Code Review 1]])* — **Registro:** —
  - [ ] **1.1. Conferência na `SE03` / `SE80`:** Inspecionar o idioma original da aplicação **BSP** (*Business Server Pages*) `WAPA ZZ1_BLOQ_INAD`, dos dois nós `SICF` gerados pelo deploy e do objeto `SMIM 02FC10E7A66F1FE1B4D99E490ACDC90A`, confirmando que todos estão configurados com idioma original **`PT`**.
  - [ ] **1.2. Abertura do aplicativo no QAS em Português:** Após transportar a alteração ao QAS, abrir o aplicativo `[[14 - bloqinadimplente (App Fiori)|bloqinadimplente]]` no Fiori Launchpad com logon em português e validar a exibição correta dos títulos, filtros e botões.

### Testes adicionais do que foi implementado aqui (além do pedido pelo supervisor)

* **1. Integridade visual e atualização de cache pós-redeploy** — **Registro:** —
  - [ ] **1.1. Regressão das funcionalidades do app:** Confirmar que seleção múltipla (`multiSelect`), barra de ações (**Bloquear** / **Desbloquear**) e exibição do *Message View* continuam operando normalmente após o ajuste de idioma / redeploy.
