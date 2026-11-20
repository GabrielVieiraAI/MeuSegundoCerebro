---
tags:
  - projeto
  - insi
  - veiling-holambra
  - sap
  - code-review
  - del-r2r-009
  - atc
id_demanda: DEL-R2R-009
revisao: Code Review 1
request: S4DK900952
tarefa: S4DK900953
status: concluido
data: 2026-11-19
sap_destination: Veiling_S4D_100_GVSOUZA_PT
---

# 🧹 Resolução dos Avisos Restantes do ATC (P2 e P3) — `DEL-R2R-009`

🗺️ [[00 - DEL-R2R-009 - Escada Code Review 1.excalidraw|Voltar para a Escada]] | 📄 [[Code Review 1.pdf|PDF Original]] | ✅ [[CR-117 - Checklist de Testes no QAS|CR-117]]

---

## 1. Resumo do ATC Completo (`Veiling_S4D_100_GVSOUZA_PT`)

Os **17 objetos** da demanda no pacote `ZFI_BLOQ_INADIMPLENTES` (**5 CDS Views** — *Core Data Services*, **1 DDLX** — *Metadata Extension*, **2 BDEFs** — *Behavior Definitions*, **1 Classe**, **1 Tabela**, **4 Elementos de Dados**, **1 SRVD** — *Service Definition*, **1 SRVB** — *Service Binding* e **1 MSAG** — *Message Class*) foram submetidos ao **ATC** (*ABAP Test Cockpit* — ferramenta de verificação estática de qualidade do SAP; `worklistId: 02FC10E7A66F1FE1B98E3B7ABE50090D`).

* **Resultado geral:** **0 Erros (P1) | 1 Aviso (P2) | 1 Info (P3)**
* **Agrupamento:** **zero avisos repetidos** — existem apenas **2 ocorrências únicas** em toda a demanda.

| # | Prioridade | Objeto | Código ATC | Resumo | Execução |
| :---: | :---: | :--- | :---: | :--- | :---: |
| **1** | 🟡 **P2 (Aviso)** | `[[01 - ZTFI_LOG_INADIMP|ZTFI_LOG_INADIMP]]` | `0070` | Índice secundário `Z01` em tabela *Column Store* tem mais de 1 campo (`CLIENT` + `PARTNER`) | `[Manual]` |
| **2** | 🔵 **P3 (Info)** | `[[08 - ZCLFI_BP_CLIENTE_INAD|ZCLFI_BP_CLIENTE_INAD]]` | `W012` (`MESSAGE G#T`) | `READ TABLE` na linha 154 cobre a chave secundária `"ID"`, mas não a utiliza | `[MCP]` |

---

## 2. Explicação Detalhada de Cada Aviso

### Aviso 1 — Prioridade 2 (Aviso): Índice secundário `Z01` com mais de 1 campo na `[[01 - ZTFI_LOG_INADIMP|ZTFI_LOG_INADIMP]]`

* **Verificação:** `Verificação dos atributos tabela` (`CL_CI_TEST_DDIC_TABLES`) — Código **`0070`**
* **Mensagem exata:** *"Embora a tabela ZTFI_LOG_INADIMP se encontre na memória da colunas, o índice secundário Z01 tem mais do que um campo"*
* **O que significa:** No **SAP HANA** em *Column Store* (armazenamento em memória por colunas), cada coluna já funciona como estrutura de busca individual. Quando um índice secundário não-único tem mais de 1 campo (`CLIENT` + `PARTNER`), o HANA precisa criar e manter uma coluna concatenada extra na memória RAM (*Random Access Memory*) sem ganho real de seletividade para o campo de mandante (`CLIENT`).
* **Por que basta remover `CLIENT` (confirmado no código padrão do S4D — `CL_CI_TEST_DDIC_TABLES`, `SCI_GET_INDEX_FORMAT` e `LSD12O01`):**
  * No **S/4HANA** atual (`S4D`), a opção clássica *"Para sistemas de banco selecionados"* (`HDB`) foi ocultada da tela (`screen-active = '0'`) porque o sistema já opera nativamente em **SAP HANA** (`SCI_GET_INDEX_FORMAT` sempre retorna `is_hana = abap_true` e todo índice ativo já recebe tipo `C`).
  * Por isso, ao remover `CLIENT` deixando **apenas `PARTNER`** (posição `1`) e manter o padrão **No banco de dados** (*Database Index*), o P2 (`0070` — que checa `position <> 1`) some **e não gera** o aviso antigo `0038` (pois no HANA o método `chk_2nd_index_clnt_fld` ignora índices de tipo `C`).
* **Conformidade com a `DEL-R2R-009`:** mantém integralmente o índice secundário não-único por `PARTNER` solicitado na [[CR-112 - Ajustes na Tabela ZTFI_LOG_INADIMP|CR-112]], sem alterar nenhuma coluna da tabela nem o `INSERT` na `[[08 - ZCLFI_BP_CLIENTE_INAD|ZCLFI_BP_CLIENTE_INAD]]`.

### Aviso 2 — Prioridade 3 (Info): Chave secundária `"ID"` não utilizada no `READ TABLE` na `[[08 - ZCLFI_BP_CLIENTE_INAD|ZCLFI_BP_CLIENTE_INAD]]`

* **Verificação:** `Verificação ampliada de programa (SLIN)` — Código **`W012`** (`MESSAGE G#T`)
* **Local exato:** `[[08 - ZCLFI_BP_CLIENTE_INAD|ZCLFI_BP_CLIENTE_INAD]]` → aba `Local Types` (`zclfi_bp_cliente_inad.clas.implementations.abap`), método `get_instance_authorizations`, **linha 154**.
* **Mensagem exata:** *"Advertência da verificação de sintaxe. The secondary key "ID" is completely covered. However, "ID" is not used in the statement."*
* **O que significa:** No modelo **RAP** (*ABAP RESTful Application Programming Model*), a tabela interna `lt_clientes` preenchida pelo comando `READ ENTITIES` já vem com uma chave secundária ordenada chamada `id`, formada exatamente pelos campos de `%tky` (`PartnerMatriz`, `CreditSegment`, `PartnerOrigem`). Como o `READ TABLE` da linha 154 faz `WITH KEY %tky = <ls_key>-%tky` sem citar `KEY id`, o **ABAP** (*Advanced Business Application Programming*) ignora o índice em memória e percorre a tabela sequencialmente.
* **Conformidade com a `DEL-R2R-009`:** muda apenas a forma como a busca interna é feita na memória, preservando 100% a checagem de permissão no objeto `[[02 - ZFI_BLOQ|ZFI_BLOQ]]` (atividades `05` e `43`) e o *fallback* (valor padrão alternativo) da empresa parametrizada definido na [[CR-105 - Hardcode nas CDS Views e no Authority-Check|CR-105]].

---

## 3. Plano de Ação

### ✅ Passo 1 — Ajustar `READ TABLE` na `[[08 - ZCLFI_BP_CLIENTE_INAD|ZCLFI_BP_CLIENTE_INAD]]` (`[MCP]` — **Concluído e Ativado em `S4D`**)

1. Na aba `Local Types` (`zclfi_bp_cliente_inad.clas.implementations.abap`), método `get_instance_authorizations` (**linha 154**):

   * **Antes:**
     ```abap
     READ TABLE lt_clientes INTO ls_cli_auth WITH KEY %tky = <ls_key>-%tky.
     ```
   * **Depois:**
     ```abap
     READ TABLE lt_clientes INTO ls_cli_auth WITH KEY id COMPONENTS %tky = <ls_key>-%tky.
     ```

2. [x] Gravado na request **`S4DK900952`** e ativado em `S4D`. ✅ 2026-11-19
3. [x] Executados os **5 testes ABAP Unit** (`lcl_test_grupo_economico`): **`[PASSED]`**. ✅ 2026-11-19
4. [x] Reexecutado **ATC** na `[[08 - ZCLFI_BP_CLIENTE_INAD|ZCLFI_BP_CLIENTE_INAD]]` (`worklistId: 02FC10E7A66F1FE1B98E876DDFC5E90D`): **0 Erros (P1) | 0 Avisos (P2) | 0 Infos (P3)**. ✅ 2026-11-19
5. [x] Sincronizada a nota técnica `[[08 - ZCLFI_BP_CLIENTE_INAD|08 - ZCLFI_BP_CLIENTE_INAD]]`. ✅ 2026-11-19

---

### ✅ Passo 2 — Ajustar índice `ZTFI_LOG_INADIMP~Z01` (`[Manual]` — **Concluído em `S4D`**)

#### Opção A — No Eclipse **ADT** (*ABAP Development Tools*)
1. Abrir o índice **`ZTFI_LOG_INADIMP~Z01`**.
2. Remover o campo **`CLIENT`**, deixando **apenas `PARTNER`**.
3. Manter **Não-único** (*Non-Unique*) e criação padrão no banco de dados (*Database Index*).
4. Salvar na request **`S4DK900952`** (`Ctrl + S`) e **Ativar (`Ctrl + F3`)**.

#### Opção B — Na transação `SE11` no **SAP GUI** (*SAP Graphical User Interface*)
1. Abrir a **`SE11`** → **Tabela database** → `ZTFI_LOG_INADIMP` → **Exibir** → botão **Índices...** (`Ctrl + F11`) → abrir **`Z01`** em modo **Modificar**.
2. Excluir a linha **`CLIENT`**, deixando **apenas `PARTNER`**.
3. Manter **Índice não-único** e **Criar no banco de dados** (padrão).
4. Salvar na request **`S4DK900952`** (`Ctrl + S`) e **Ativar (`Ctrl + F3`)**.

---

### ✅ Passo 3 — Verificação Final (`[MCP]` — **Concluído com `0 / 0 / 0`**)

1. [x] **ATC** completo executado nos 17 objetos da demanda (`worklistId: 02FC10E7A66F1FE1B98EC3CE01D7890D`): **0 Erros (P1) | 0 Avisos (P2) | 0 Infos (P3)** (*0 findings in 4 objects*). ✅ 2026-11-19
2. [x] Bateria **ABAP Unit** executada na `[[08 - ZCLFI_BP_CLIENTE_INAD|ZCLFI_BP_CLIENTE_INAD]]`: **`[PASSED]`**. ✅ 2026-11-19
