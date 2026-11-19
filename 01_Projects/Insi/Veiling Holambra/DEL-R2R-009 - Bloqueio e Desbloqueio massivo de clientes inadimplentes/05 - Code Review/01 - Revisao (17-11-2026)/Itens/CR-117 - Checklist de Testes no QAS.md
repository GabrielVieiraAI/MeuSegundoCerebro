---
tags:
  - projeto
  - insi
  - veiling-holambra
  - sap
  - code-review
  - del-r2r-009
  - checklist
id_demanda: DEL-R2R-009
revisao: Code Review 1
request: S4DK900952
tarefa: S4DK900953
item_cr: CR-117
prioridade: Checklist Final (QAS)
status: Pendente
data: 2026-11-18
sap_destination: ""
transport_requests: []
---

# 🟢 CR-117: Checklist de Testes no QAS e Próximos Passos

🗺️ [[00 - DEL-R2R-009 - Escada Code Review 1.excalidraw|Voltar para a Escada (Code Review 1)]] | 📄 [[Code Review 1.pdf|PDF Original]] | ⬅️ [[CR-116 - Documentação ABAP Doc e Testes ABAP Unit|CR-116]] | 🧪 [[03 - DEL-R2R-009 - Guia de Testes e Homologação|Guia de Testes Anterior]]

---

## 📌 Contexto Importante do Code Review

* **Request / Tarefa:** `S4DK900952` / tarefa `S4DK900953` (ainda modificável — os ajustes podem entrar nela mesma).
* **Por que testar no QAS:** O ambiente `DEV` não possui dados de crédito no segmento `1000` nem relações `UKM001` na tabela `BUT050`. Por isso, todos os cenários de grupo econômico apontados nos pontos críticos vieram de leitura de código e **precisam obrigatoriamente ser validados no QAS** (via cópia de transporte antes da liberação final).

---

## ✅ Checklist de Testes Obrigatórios no QAS (Antes da Liberação)

- [ ] **1. Matriz com 2 filiais (`UKM001`):** o app lista uma **única linha para a matriz**, com o valor vencido conforme a regra acordada com o funcional (grupo ou parceiro). *(Valida [[CR-101 - Chave Duplicada na CDS Raiz|CR-101]])*
- [ ] **2. Bloquear essa matriz:** matriz e todas as filiais ficam bloqueadas com motivo `10` no FSCM, gerando **uma linha de log por membro** na `ZTFI_LOG_INADIMP`. *(Valida [[CR-101 - Chave Duplicada na CDS Raiz|CR-101]] e [[CR-104 - Gravação Fora da Fase de Save e Sem Lock|CR-104]])*
- [ ] **3. Filial bloqueada por outro motivo (ex.: `20`):** bloquear e depois desbloquear a matriz **não altera a filial** bloqueada pelo outro motivo; o log registra a **mensagem `006`**. *(Valida [[CR-102 - Cascata Altera Bloqueios Externos|CR-102]])*
- [ ] **4. Seleção múltipla de 3 clientes (onde o 2º não tem conta de crédito):** o 2º mostra erro na tela e no log, enquanto o 1º e o 3º mostram sucesso normalmente. *(Valida [[CR-103 - Flag de Sucesso Não Reinicia na Seleção Múltipla|CR-103]])*
- [ ] **5. `UKM_BP` aberta no mesmo cliente por outro usuário:** a ação no app retorna erro de bloqueio (*lock*), **sem gravação parcial** no grupo. *(Valida [[CR-104 - Gravação Fora da Fase de Save e Sem Lock|CR-104]])*
- [ ] **6. Usuário sem `ZFI_BLOQ` atividade `05` ou `43` (e sem `03`):** o botão correspondente (`Bloquear` ou `Desbloquear`) fica desabilitado; sem a atividade `03`, o usuário **não vê os clientes** na lista. *(Valida [[CR-107 - Falta de Controle de Acesso (DCL) nas CDS Views|CR-107]])*
- [ ] **7. Cliente com apenas partida memo ou adiantamento vencido:** não aparece proposto como `"Bloquear"` (conforme regra confirmada com o funcional). *(Valida [[CR-106 - Filtro de Partidas Memo e Validade da BUT050|CR-106]])*

---

## 🧭 Roteiro para Devolução e Aprovação da Request

1. [ ] Corrigir os **4 itens obrigatórios** ([[CR-101 - Chave Duplicada na CDS Raiz|CR-101]] a [[CR-104 - Gravação Fora da Fase de Save e Sem Lock|CR-104]]).
2. [ ] Avaliar e aplicar os **itens recomendados** ([[CR-105 - Hardcode nas CDS Views e no Authority-Check|CR-105]] a [[CR-111 - Idioma Original Alemão no Deploy do App Fiori|CR-111]]) — recomendado concluir antes da ida para produção (especialmente [[CR-110 - Retirar Interfaces de Outra Demanda da Request|CR-110]] sobre retirar objetos de outra demanda da request).
3. [ ] Executar os **7 testes no QAS** via cópia de transporte.
4. [ ] **Reexecutar o ATC** nos objetos alterados e anexar o resultado comprovando **zero erros P1** (e redução dos avisos P2/P3).
5. [ ] Devolver a request `S4DK900952` para nova revisão antes da liberação oficial.

---

## 📋 Registro de Escopo e Status ATC da 1ª Revisão

* **Status ATC inicial (`S4D / 100`):**
  - `ZCLFI_BP_CLIENTE_INAD`: `0` Erro (P1) | `3` Avisos (P2) | `10` Infos (P3)
  - CDS Views (`ZI_*` e `ZC_*`): `0` Erro (P1) | `0` Aviso (P2) | `0` Info (P3)
* **Objetos revisados nesta rodada:** CDS Views (`ZI_FI_TITULOS_VENCIDOS`, `ZI_FI_PARCEIRO_CREDITO`, `ZI_FI_CLIENTE_INADIMPLENTE`, `ZC_FI_CLIENTE_INADIMPLENTE`), BDEFs `ZI`/`ZC`, classe `ZCLFI_BP_CLIENTE_INAD` (inclusive classes locais), SRVD `ZUI_FI_CLIENTE_INAD`, tabela `ZTFI_LOG_INADIMP` (`DD02L`/`DD03L`), objeto de autorização `ZFI_BLOQ` (`TOBJ`), textos da `ZFI_INADIMPLENCIA` (`T100`) e `manifest.json` do BSP `ZZ1_BLOQ_INAD`.
* **Objetos fora do escopo desta revisão:** Metadata Extension (`DDLX`), anotações de UI e restante do código do BSP, objetos Gateway gerados (`IWMO`/`IWSV`/`IWVB`/`IWOM`/`IWSG`), `SUSH` e `SICF`.
