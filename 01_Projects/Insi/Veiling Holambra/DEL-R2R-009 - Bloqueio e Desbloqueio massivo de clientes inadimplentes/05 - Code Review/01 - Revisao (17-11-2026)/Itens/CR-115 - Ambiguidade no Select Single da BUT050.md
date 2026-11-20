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
item_cr: CR-115
prioridade: Melhoria Opcional
status: Pendente
data: 2026-11-18
sap_destination: Veiling_S4D_100_GVSOUZA_PT
transport_requests:
  - S4DK900952 - DEL-R2R-009 - Bloqueio e Desbloqueio de Inadimplentes
---

# 🔵 CR-115: Ambiguidade no SELECT SINGLE da BUT050

🗺️ [[00 - DEL-R2R-009 - Escada Code Review 1.excalidraw|Voltar para a Escada]] | 📄 [[Code Review 1.pdf|PDF Original]] | ⬅️ [[CR-114 - Habilitação Dinâmica dos Botões (Features Instance)|CR-114]] | ➡️ [[CR-116 - Documentação ABAP Doc e Testes ABAP Unit|CR-116]]

---

## 1. O que está sendo apontado (Linguagem de Negócio)

Quando o sistema precisa identificar a qual Cliente Matriz uma determinada filial pertence para aplicar o bloqueio ou desbloqueio no grupo econômico, a busca atual seleciona apenas um vínculo sem ordenar ou considerar todos os identificadores do relacionamento:

* **Escolha aleatória de grupo caso uma filial tenha mais de um vínculo cadastrado:** Se existir no cadastro mais de um registro de vínculo para a mesma filial (por exemplo, um vínculo antigo encerrado e um vínculo novo ativo com outra Matriz), o sistema pode escolher qualquer um deles de forma imprevisível.

---

## 2. O que eu preciso fazer (Linguagem de Negócio)

Para garantir que a identificação do Cliente Matriz a partir de uma filial seja sempre exata e previsível (caso esta melhoria opcional seja implementada, preferencialmente em conjunto com a verificação de validade dos vínculos), o comportamento deve ser ajustado nos seguintes pontos:

1. **Considerar apenas vínculos ativos e definir um critério único de escolha:**
   * Ao buscar a qual Cliente Matriz uma filial pertence para aplicar o bloqueio ou desbloqueio no grupo econômico, filtrar os vínculos vigentes na data atual e aplicar uma regra clara de ordenação/identificação para que o sistema nunca escolha um grupo econômico de forma aleatória caso exista mais de um registro histórico para a mesma filial.

---

## 3. Plano de Ação

### O que será feito em cada objeto

1. **[[08 - ZCLFI_BP_CLIENTE_INAD|ZCLFI_BP_CLIENTE_INAD]] *(Behavior Pool — Aba `Local Types` / `CCIMP` — Ajustar método `obter_grupo_economico` `[MCP]`)*:**
   * **Diagnóstico do código ativo no SAP `DEV` (*Development* — ambiente de desenvolvimento):** No Caso 2 de `obter_grupo_economico` (quando o parceiro informado `iv_partner` não é Matriz e o sistema busca a Matriz vinculada pelo campo `partner2`), o código ativo executa `SELECT SINGLE partner1 FROM but050 WHERE partner2 = @iv_partner AND reltyp IN @lr_reltyp INTO @DATA(lv_matriz_encontrada).`. Como a chave primária da tabela `BUT050` é composta por `(client, relnr, partner1, partner2, date_to)` e a consulta filtra apenas `partner2` e `reltyp` (sem chave completa nem ordenação), o **ATC** (*ABAP Test Cockpit*) aponta o achado `AMB_SINGLE` por risco de seleção não determinística caso existam múltiplos vínculos para a mesma filial.
   * **Substituição por consulta determinística com `ORDER BY` e `UP TO 1 ROWS`:** Em **ABAP** (*Advanced Business Application Programming*) **SQL** (*Structured Query Language*), `SELECT SINGLE` não aceita a cláusula `ORDER BY`, e o uso de `SELECT ... ENDSELECT` gera outros apontamentos de verificação estática. Portanto, substituir o `SELECT SINGLE` pela leitura ordenada em tabela interna (`lt_matrizes`) limitada a 1 linha e ajustar o fechamento condicional do `IF` para `IF lt_matrizes IS NOT INITIAL AND lv_matriz_encontrada IS NOT INITIAL.`, mantendo integralmente o fluxo subsequente de busca das filiais irmãs e retorno (`RETURN`):
     ```abap
     SELECT partner1
       FROM but050
       WHERE partner2 = @iv_partner
         AND reltyp   IN @lr_reltyp
       ORDER BY date_to DESCENDING, date_from DESCENDING, partner1 ASCENDING
       INTO TABLE @DATA(lt_matrizes)
       UP TO 1 ROWS.

     IF lt_matrizes IS NOT INITIAL.
       DATA(lv_matriz_encontrada) = lt_matrizes[ 1 ].
     ENDIF.

     IF lt_matrizes IS NOT INITIAL AND lv_matriz_encontrada IS NOT INITIAL.
       ev_matriz = lv_matriz_encontrada.
       APPEND lv_matriz_encontrada TO et_parceiros.

       SELECT partner2
         FROM but050
         WHERE partner1 = @lv_matriz_encontrada
           AND reltyp   IN @lr_reltyp
         INTO TABLE @lt_filiais.

       LOOP AT lt_filiais ASSIGNING FIELD-SYMBOL(<lv_f>).
         APPEND <lv_f> TO et_parceiros.
       ENDLOOP.
       SORT et_parceiros.
       DELETE ADJACENT DUPLICATES FROM et_parceiros.
       RETURN.
     ENDIF.
     ```
   * **Justificativa do critério de ordenação (sem descarte de registros):**
     * `date_to DESCENDING`: prioriza vínculos vigentes (por exemplo, `99991231`) sobre vínculos históricos encerrados.
     * `date_from DESCENDING`: desempata pelo vínculo iniciado mais recentemente.
     * `partner1 ASCENDING`: garante determinismo absoluto em eventual empate completo de datas.
     * Esse critério elimina o achado `AMB_SINGLE` no ATC **sem** aplicar filtro rígido de validade (`date_from`/`date_to`) que descarte vínculos da `BUT050`, respeitando a decisão do projeto de não implementar a [[CR-106 - Filtro de Partidas Memo e Validade da BUT050|CR-106]].

### Dependências / Decisões

* **Escopo isolado — `CR-106` dispensada pelo projeto:** A [[CR-106 - Filtro de Partidas Memo e Validade da BUT050|CR-106]] **não foi implementada** por decisão confirmada de não haver necessidade. Portanto, a `CR-115` **não** reabre o escopo da `CR-106`: não alterar **CDS** (*Core Data Services*) Views, não adicionar filtro de partidas memo e não aplicar filtro rígido de `date_from`/`date_to` na `BUT050` (mantendo inalteradas também as demais consultas de `obter_grupo_economico`).
* **Alinhamento sequencial com a `CR-109` na mesma classe e método:** A leitura no SAP `DEV` (`Veiling_S4D_100_GVSOUZA_PT`) confirmou que o código ativo de `obter_grupo_economico` já possui o filtro `reltyp IN @lr_reltyp` da [[CR-105 - Hardcode nas CDS Views e no Authority-Check|CR-105]] e ainda contém `CATCH cx_root.` pendente da [[CR-109 - Catch Vazio e Exceções Genéricas na Classe|CR-109]] (`status: Pendente`). Como ambas alteram `obter_grupo_economico` na [[08 - ZCLFI_BP_CLIENTE_INAD|ZCLFI_BP_CLIENTE_INAD]], devem ser aplicadas **sequencialmente** para evitar sobrescrita no include `CCIMP` (*Class Implementation Include* — implementação local da classe).
* **Precedência sobre a `CR-116`:** Deve preceder a implementação da [[CR-116 - Documentação ABAP Doc e Testes ABAP Unit|CR-116]], pois a `CR-116` criará testes **ABAP Unit** para validar o comportamento de `obter_grupo_economico`.
* **Execução `[MCP]` e elegibilidade:** Ajuste pontual em um único método de um único objeto suportado pelo servidor **MCP** (*Model Context Protocol*) `sap-adt`, **elegível para execução direta via `/implementar-cr-simples`** (sem necessidade de guia em `Guias/`). Por ter prioridade *Melhoria Opcional*, sua aplicação em `DEV` depende apenas da confirmação de implementá-la.

---

## 4. Teste Pós Ajuste

> Além do roteiro geral de testes do revisor em [[CR-117 - Checklist de Testes no QAS|CR-117]], os cenários abaixo validam diretamente no **S4D** e no **QAS** (*Quality Assurance System* — ambiente de qualidade) a correção opcional sugerida pelo supervisor técnico referente ao **CR-115** *(executar caso implementada na Seção 3)*.

### Teste solicitado pelo Supervisor Técnico (ref. ao CR-115)

* **1. Eliminação de ambiguidade no `SELECT SINGLE` da `BUT050`** *(Seção 4 do [[Code Review 1.pdf|Code Review 1]])* — **Registro:** —
  - [ ] **1.1. Reexecução do **ATC** (*ABAP Test Cockpit*):** Rodar o ATC na `[[08 - ZCLFI_BP_CLIENTE_INAD|ZCLFI_BP_CLIENTE_INAD]]` e confirmar a eliminação do achado `AMB_SINGLE` no método `obter_grupo_economico`.
  - [ ] **1.2. Determinismo com múltiplos vínculos na `BUT050`:** Testar no QAS com uma filial que possua registro histórico encerrado e registro vigente na `BUT050` (`UKM001`), confirmando que `obter_grupo_economico` identifica sempre a Matriz correta e vigente de forma determinística.

### Testes adicionais do que foi implementado aqui (além do pedido pelo supervisor)

* **1. Regressão dos 3 fluxos de `obter_grupo_economico`** — **Registro:** —
  - [ ] **1.1. Matriz, Filial e Parceiro individual:** Validar nas ações em lote que o método continua resolvendo corretamente grupos consultados pela Matriz, pela Filial e por parceiros sem vínculo `UKM001`, sem duplicidades na lista de membros.
