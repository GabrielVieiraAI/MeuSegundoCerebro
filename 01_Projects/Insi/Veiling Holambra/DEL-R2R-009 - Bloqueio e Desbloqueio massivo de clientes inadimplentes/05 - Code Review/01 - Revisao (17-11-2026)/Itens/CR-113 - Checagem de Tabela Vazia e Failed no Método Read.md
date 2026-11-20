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
item_cr: CR-113
prioridade: Melhoria Opcional
status: Pendente
data: 2026-11-18
sap_destination: Veiling_S4D_100_GVSOUZA_PT
transport_requests:
  - S4DK900952 - DEL-R2R-009 - Bloqueio e Desbloqueio de Inadimplentes
---

# 🔵 CR-113: Checagem de Tabela Vazia (FOR ALL ENTRIES) e Preenchimento de failed no Read

🗺️ [[00 - DEL-R2R-009 - Escada Code Review 1.excalidraw|Voltar para a Escada]] | 📄 [[Code Review 1.pdf|PDF Original]] | ⬅️ [[CR-112 - Ajustes na Tabela ZTFI_LOG_INADIMP|CR-112]] | ➡️ [[CR-114 - Habilitação Dinâmica dos Botões (Features Instance)|CR-114]]

---

## 1. O que está sendo apontado (Linguagem de Negócio)

Na rotina que recarrega os dados dos clientes selecionados pelo usuário no momento da ação, foram identificadas duas melhorias preventivas:

* **Falta de verificação quando nenhum registro é recebido na busca:** Caso a rotina de leitura seja acionada sem nenhum cliente preenchido na lista de entrada, o sistema não interrompe a busca antecipadamente, correndo o risco de consultar toda a base de clientes sem necessidade.
* **Ausência de sinalização quando um cliente selecionado não é encontrado:** Se algum cliente selecionado na tela deixar de atender aos critérios da listagem no exato momento da leitura (por exemplo, se outro usuário alterou sua situação instantes antes), o sistema não sinaliza formalmente que aquele registro específico não foi localizado.

---

## 2. O que eu preciso fazer (Linguagem de Negócio)

Para tornar a rotina de leitura dos clientes selecionados mais segura e eficiente (caso esta melhoria opcional seja implementada), o comportamento deve ser ajustado em dois pontos:

1. **Encerrar a consulta imediatamente quando nenhum cliente for informado:**
   * Antes de buscar os dados na base, verificar se a lista de clientes solicitada está vazia; caso não haja nenhum cliente selecionado na chamada, retornar imediatamente sem executar uma busca desnecessária em toda a base de clientes.
2. **Sinalizar formalmente quando um cliente solicitado não for encontrado:**
   * Comparar os clientes solicitados com os registros efetivamente encontrados na consulta e, caso algum cliente selecionado não seja localizado no momento da leitura, registrar formalmente a falha de localização daquele item para que o aplicativo trate a ausência de forma controlada.

---

## 3. Plano de Ação

### O que será feito em cada objeto

1. **[[08 - ZCLFI_BP_CLIENTE_INAD|ZCLFI_BP_CLIENTE_INAD]] *(Behavior Pool — Aba `Local Types` / `CCIMP` — Ajustar método `read` `[MCP]`)*:**
   * **Manutenção da assinatura do método (`DEFINITION` de `lhc_clienteinadimplente`):** Manter inalterada a declaração `METHODS read FOR READ IMPORTING keys FOR READ ClienteInadimplente RESULT result.`, pois no modelo **RAP** (*ABAP RESTful Application Programming Model*) o parâmetro `failed` já existe implicitamente na assinatura de `FOR READ`.
   * **Guarda imediata contra tabela `keys` vazia:** Inserir `IF keys IS INITIAL. RETURN. ENDIF.` logo no início de `METHOD read`, antes da instrução `SELECT * FROM zi_fi_cliente_inadimplente FOR ALL ENTRIES IN @keys`, impedindo consultas irrestritas à visão **CDS** (*Core Data Services*) `[[06 - ZI_FI_CLIENTE_INADIMPLENTE (CDS)|ZI_FI_CLIENTE_INADIMPLENTE (CDS)]]` em chamadas sem chaves e eliminando o achado `FAllRisky` no **ATC** (*ABAP Test Cockpit*).
   * **Consulta com busca ordenada e preenchimento de `failed-clienteinadimplente`:**
     * Declarar a tabela interna de retorno como tabela ordenada pela chave tripla da visão (`DATA lt_dados TYPE SORTED TABLE OF zi_fi_cliente_inadimplente WITH NON-UNIQUE KEY PartnerMatriz CreditSegment PartnerOrigem.`) para armazenar o resultado do `SELECT * FROM zi_fi_cliente_inadimplente FOR ALL ENTRIES IN @keys WHERE PartnerMatriz = @keys-PartnerMatriz AND CreditSegment = @keys-CreditSegment AND PartnerOrigem = @keys-PartnerOrigem INTO TABLE @lt_dados.` (alternativamente `INTO TABLE @DATA(lt_dados)`), mantendo na sequência `result = CORRESPONDING #( lt_dados ).`.
     * Após `result = CORRESPONDING #( lt_dados ).`, percorrer as chaves solicitadas (`LOOP AT keys ASSIGNING FIELD-SYMBOL(<ls_key>).`) verificando se a chave tripla (`PartnerMatriz`, `CreditSegment`, `PartnerOrigem`) foi retornada em `lt_dados` via `IF NOT line_exists( lt_dados[ PartnerMatriz = <ls_key>-PartnerMatriz CreditSegment = <ls_key>-CreditSegment PartnerOrigem = <ls_key>-PartnerOrigem ] ).`.
     * Para cada chave ausente, registrar a falha formal de leitura em `failed-clienteinadimplente` com `APPEND VALUE #( %tky = <ls_key>-%tky %fail-cause =` **if_abap_behv\=>cause-not_found** `) TO failed-clienteinadimplente.`.

### Dependências / Decisões

* **Estado atual confirmado no SAP `DEV` (`Veiling_S4D_100_GVSOUZA_PT`):** A leitura direta do código ativo de `ZCLFI_BP_CLIENTE_INAD` (`zclfi_bp_cliente_inad.clas.implementations.abap`) e da entidade `ZI_FI_CLIENTE_INADIMPLENTE` (**BDEF** — *Behavior Definition* — *unmanaged* `strict ( 2 )` sem *draft* e **CDS** raiz com chave tripla `PartnerMatriz`, `CreditSegment`, `PartnerOrigem` pós-[[CR-101 - Chave Duplicada na CDS Raiz|CR-101]]) confirmou que o método `read` possui apenas o `SELECT * ... FOR ALL ENTRIES IN @keys ... INTO TABLE @DATA(lt_dados)` e `result = CORRESPONDING #( lt_dados )`, sem `IF keys IS INITIAL` e sem preenchimento de `failed`.
* **Classificação e elegibilidade (`[MCP]` via `/implementar-cr-simples`):** Trata-se de **melhoria opcional** (Semáforo Azul) e ajuste pontual isolado no método `read` de um único objeto (`[[08 - ZCLFI_BP_CLIENTE_INAD|ZCLFI_BP_CLIENTE_INAD]]`), executável integralmente via servidor **MCP** (*Model Context Protocol*) `sap-adt` e **elegível para `/implementar-cr-simples`** (dispensando geração de guia dedicado em `Guias/`).
* **Dependências e sequenciamento no SAP `DEV`:** Não há dependência lógica com a [[CR-109 - Catch Vazio e Exceções Genéricas na Classe|CR-109]] nem com a [[CR-115 - Ambiguidade no Select Single da BUT050|CR-115]], porém todas compartilham o mesmo objeto `[[08 - ZCLFI_BP_CLIENTE_INAD|ZCLFI_BP_CLIENTE_INAD]]` (`CCIMP`). Caso implementada, deve ser executada **sequencialmente** no SAP `DEV` (evitando conflito de edição simultânea na mesma classe) e **antes** da [[CR-116 - Documentação ABAP Doc e Testes ABAP Unit|CR-116]], garantindo que a documentação **ABAP Doc** (*ABAP Documentation*) e os testes unitários **ABAP Unit** já reflitam o método `read` ajustado.
* **Decisão técnica sobre a verificação de chaves ausentes:** A declaração de `lt_dados` como `SORTED TABLE ... WITH NON-UNIQUE KEY PartnerMatriz CreditSegment PartnerOrigem` combinada com `line_exists` entrega busca binária eficiente sem risco de erro de execução por chave duplicada e sem necessidade de alterar a **CDS** ou o **BDEF** `[[07 - ZI_FI_CLIENTE_INADIMPLENTE (BDEF)|ZI_FI_CLIENTE_INADIMPLENTE (BDEF)]]`.

---

## 4. Teste Pós Ajuste

> Além do roteiro geral de testes do revisor em [[CR-117 - Checklist de Testes no QAS|CR-117]], os cenários abaixo validam diretamente no **S4D** e no **QAS** (*Quality Assurance System* — ambiente de qualidade) as melhorias preventivas sugeridas pelo supervisor técnico referentes ao **CR-113** *(executar caso esta melhoria opcional seja implementada)*.

### Teste solicitado pelo Supervisor Técnico (ref. ao CR-113)

* **1. Checagem de tabela `keys` vazia e preenchimento de `failed` no método `read`** *(Seção 4 do [[Code Review 1.pdf|Code Review 1]])* — **Registro:** —
  - [ ] **1.1. Reexecução do **ATC** (*ABAP Test Cockpit*):** Rodar o ATC na `[[08 - ZCLFI_BP_CLIENTE_INAD|ZCLFI_BP_CLIENTE_INAD]]` e confirmar a eliminação do achado `FAllRisky` (`FOR ALL ENTRIES IN @keys` sem checagem prévia de vazio).
  - [ ] **1.2. Comportamento com `keys` vazio ou chave não encontrada:** Validar via teste unitário / depuração que uma chamada com `keys` vazio retorna imediatamente sem consultar o banco, e que uma chave ausente na view é inserida em `failed-clienteinadimplente` (com `%tky` e causa `not_found`).

### Testes adicionais do que foi implementado aqui (além do pedido pelo supervisor)

* **1. Regressão da leitura nas ações de Bloqueio e Desbloqueio** — **Registro:** —
  - [ ] **1.1. Leitura interna pelo `READ ENTITIES ... IN LOCAL MODE`:** Executar bloqueio e desbloqueio pelo aplicativo Fiori no QAS confirmando que os dados das linhas selecionadas continuam sendo carregados normalmente pelo método `read`.
