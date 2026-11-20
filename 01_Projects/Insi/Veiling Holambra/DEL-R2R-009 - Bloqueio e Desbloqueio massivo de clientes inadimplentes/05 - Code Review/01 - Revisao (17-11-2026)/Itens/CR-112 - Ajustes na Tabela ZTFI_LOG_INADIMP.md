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
status: concluido
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

### O que será feito em cada objeto

1. **Mapeamento DDIC (*ABAP Data Dictionary* — dicionário de dados ABAP) dos 6 campos da [[01 - ZTFI_LOG_INADIMP|ZTFI_LOG_INADIMP]]:**
   * A inspeção no **S4D** (`Veiling_S4D_100_GVSOUZA_PT`) confirmou a definição ativa da tabela com os 6 campos usando tipos primitivos, `@AbapCatalog.dataMaintenance : #RESTRICTED` e sem índice secundário em `PARTNER`. O mapeamento abaixo **preserva exatamente os tipos técnicos e tamanhos atuais** para garantir zero quebra na [[08 - ZCLFI_BP_CLIENTE_INAD|ZCLFI_BP_CLIENTE_INAD]] e conversão segura sem perda de dados no **QAS** (*Quality Assurance System* — ambiente de qualidade):

| Campo | Tipo Atual | Ação / Objeto Definido | Tipo Técnico Preservado | Forma | Observações e Checagem no S4D |
| :--- | :--- | :--- | :--- | :---: | :--- |
| `ACAO` | `abap.char(1)` | **Criar** `ZE_ACAO_BLOQ_INAD` *(+ domínio opcional `ZD_ACAO_BLOQ_INAD` com valores fixos `'B'` = Bloquear, `'D'` = Desbloquear)* | `CHAR(1)` | `[MCP]` (`DTEL/DE`) / `[Manual]` (`DOMA/DD`) | Único existente `ZE_COM013_ACAO` é específico de envio (*inclusão/estorno*). Novo nome segue [[00 - Padrão de Nomenclatura ABAP Veiling Holambra|Padrão de Nomenclatura]] (`ZE_<desc>`/`ZD_<desc>`, sem módulo, idioma `PT`). |
| `STATUS` | `abap.char(1)` | **Criar** `ZE_STATUS_BLOQ_INAD` *(+ domínio opcional `ZD_STATUS_BLOQ_INAD` com valores fixos `'S'` = Sucesso, `'E'` = Erro)* | `CHAR(1)` | `[MCP]` (`DTEL/DE`) / `[Manual]` (`DOMA/DD`) | Existentes (`ZE_141_STATUS`, `ZE_DESC_STATUS`, `ZE_STATUS_ENVIO`, `ZE_FR_STATUS`, `ZE_TAX_LOG_STATUS`, `ZE_COM013_STATUS`) pertencem a outros processos com valores fixos distintos (`P`, `Z`, `T`, etc.). |
| `MENSAGEM` | `abap.char(220)` | **Reutilizar standard SAP** `BAPI_MSG` *(domínio `TEXT220`)* | `CHAR(220)` | `[MCP]` (uso na DDL) | Confirmado ativo no S4D (*Texto de mensagem*). Evita criação de objeto Z; preserva `lv_msg_log TYPE ztfi_log_inadimp-mensagem`. *(Não usar `ZE_141_MENSAGEM`, que rotula apenas erro, nem `ZE_DESC_MSGTXT`, que é `STRING(256)`.)* |
| `VLR_VENCIDO` | `abap.curr(15,2)` | **Criar** `ZE_VLR_VENCIDO` *(domínio standard `WERTV8` — `CURR(15,2)` com sinal — ou predefinido `CURR(15,2)`)* | `CURR(15,2)` | `[MCP]` (`DTEL/DE`) | `WRBTR` e `FAGL_CURRVAL_15` são `CURR(23,2)`; `UKM_AMOUNT` e `UKM_KPI_OIT_AMOUNT` são `CURR(13,2)` (risco de truncamento). `CRM_PS_DM_OVERDUE_AMT` e `UKM_OLDEST_OI_AMOUNT` (`CURR(15,2)`) estão em `EN` com semântica específica; criar `ZE_VLR_VENCIDO` garante rótulos claros em `PT`. |
| `DIAS_ATRASO` | `abap.int4` | **Criar** `ZE_DIAS_ATRASO` *(domínio standard `INT4` ou predefinido `INT4`)* | `INT4` | `[MCP]` (`DTEL/DE`) | `AVG_DAYS_OVERDUE` (`DEC(15,2)`), `COLL_P2P_DAYS_IN_ARREARS` (`DEC(5,0)`), `CRM_PS_DM_MAX_DAYS_ARREARS` (`NUMC(6)`) e `UKM_VECTOR_OI_DAYS_IN_ARREARS` (`DEC(3,0)`) são incompatíveis. Standard `INT4` (`UKM_OI_DAYS_IN_ARREARS`, `COLL_PR_DAYS_IN_ARREARS`, `FAR_PDAV_NET_DUE_ARREARS_DAYS`) estão em `EN` com rótulos incompletos, e `/FHG/E_DIAS_ATRASO` é de add-on de parceiro. |
| `CREATED_AT` | `abap.utclong` | **Reutilizar standard SAP** `ABP_CREATION_UTCL` *(domínio `UTCL`)* | `UTCLONG` (`27`) | `[MCP]` (uso na DDL) | Confirmado ativo no S4D (*Data/hora de criação*) e par oficial de `ABP_CREATION_USER` já usado em `CREATED_BY`. **ATENÇÃO CRÍTICA:** **PROIBIDO** usar `ZE_CREATED_AT` ou `ABP_CREATION_TSTMPL`, pois ambos são `DEC(21,7)` (`TZNTSTMPL`) e quebrariam `utclong_current( )` na [[08 - ZCLFI_BP_CLIENTE_INAD|ZCLFI_BP_CLIENTE_INAD]]. |

2. **Domínios opcionais de valores fixos (`ZD_ACAO_BLOQ_INAD` e `ZD_STATUS_BLOQ_INAD` — Criar `[Manual]` antes dos elementos `ZE_*`, caso aprovados):**
   * **Por que `[Manual]`:** A consulta de tipos criáveis no servidor **MCP** (*Model Context Protocol*) `sap-adt` confirmou que `DOMA/DD` (*Domain*) não é suportado para criação via MCP, exigindo criação manual no **Eclipse ADT** (*ABAP Development Tools*) ou transação **`SE11`** no pacote `ZFI_BLOQ_INADIMPLENTES` (request `S4DK900952` / tarefa `S4DK900953`, idioma original **`PT`**):
     * `ZD_ACAO_BLOQ_INAD`: tipo `CHAR`, tamanho `1`, valores fixos `'B'` (*Bloquear*) e `'D'` (*Desbloquear*).
     * `ZD_STATUS_BLOQ_INAD`: tipo `CHAR`, tamanho `1`, valores fixos `'S'` (*Sucesso*) e `'E'` (*Erro*).
   * *(Caso a equipe dispense valores fixos no dicionário e opte apenas por tipo predefinido `CHAR(1)` nos elementos `ZE_ACAO_BLOQ_INAD` e `ZE_STATUS_BLOQ_INAD`, esta etapa é dispensada e toda a criação dos elementos `ZE_*` segue 100% via `[MCP]`.)*

3. **Novos Elementos de Dados (`ZE_ACAO_BLOQ_INAD`, `ZE_STATUS_BLOQ_INAD`, `ZE_VLR_VENCIDO`, `ZE_DIAS_ATRASO` — Criar `[MCP]`):**
   * Criar via `DTEL/DE` no pacote `ZFI_BLOQ_INADIMPLENTES` (request `S4DK900952` / tarefa `S4DK900953`) com idioma original **`PT`** e rótulos completos em português (curto/médio/longo/cabeçalho dentro dos limites `10`/`20`/`40`/`55` caracteres):
     * `ZE_ACAO_BLOQ_INAD`: tipo `CHAR(1)` (vinculado a `ZD_ACAO_BLOQ_INAD` ou predefinido `CHAR(1)`), rótulos `"Ação"` / `"Ação bloqueio"` / `"Ação de bloqueio/desbloqueio"` / `"Ação"`.
     * `ZE_STATUS_BLOQ_INAD`: tipo `CHAR(1)` (vinculado a `ZD_STATUS_BLOQ_INAD` ou predefinido `CHAR(1)`), rótulos `"Status"` / `"Status execução"` / `"Status da execução do log"` / `"Status"`.
     * `ZE_VLR_VENCIDO`: tipo `CURR(15,2)` (domínio standard `WERTV8`, mantendo sinal), rótulos `"Vlr.venc."` / `"Valor vencido"` / `"Valor total vencido"` / `"Valor vencido"`.
     * `ZE_DIAS_ATRASO`: tipo `INT4` (domínio standard `INT4`), rótulos `"Dias atras"` / `"Dias em atraso"` / `"Dias em atraso"` / `"Dias em atraso"`.
   * Ativar todos os novos elementos de dados antes de ajustar a tabela transparente.

4. **[[01 - ZTFI_LOG_INADIMP|ZTFI_LOG_INADIMP]] *(Tabela Transparente `TABL/DT` — Ajustar `[MCP]`)*:**
   * Alterar a anotação de cabeçalho **DDL** (*Data Definition Language* — linguagem de definição de dados) de `@AbapCatalog.dataMaintenance : #RESTRICTED` para `@AbapCatalog.dataMaintenance : #NOT_ALLOWED`, impedindo manutenção manual direta pelas transações **`SM30`** / **`SE16N`**.
   * Substituir os 6 tipos primitivos pelos elementos de dados definidos (`acao : ze_acao_bloq_inad`, `status : ze_status_bloq_inad`, `mensagem : bapi_msg`, `vlr_vencido : ze_vlr_vencido`, `dias_atraso : ze_dias_atraso` e `created_at : abp_creation_utcl`), preservando chaves, demais campos e a anotação `@Semantics.amount.currencyCode : 'ztfi_log_inadimp.moeda'`.
   * Ativar a tabela no **S4D** e reexecutar o **ATC** (*ABAP Test Cockpit*) na tabela e na [[08 - ZCLFI_BP_CLIENTE_INAD|ZCLFI_BP_CLIENTE_INAD]] (confirmando zero erros P1 e zero impactos de compilação).

5. **Índice secundário não-único na [[01 - ZTFI_LOG_INADIMP|ZTFI_LOG_INADIMP]] *(Índice de Banco de Dados — Criar `[Manual]`)*:**
   * **Por que `[Manual]`:** A consulta de tipos criáveis no MCP `sap-adt` e dos arquivos `.tabl.ddic` / `.tabl.settings.json` no S4D confirmou que índices secundários não são criáveis via MCP nem declarados na sintaxe DDL `define table`.
   * **Passo manual no Eclipse ADT ou transação `SE11`:** Abrir a tabela `ZTFI_LOG_INADIMP`, criar um índice secundário **não-único** (ID sugerido **`Z01`** ou **`PTR`**, descrição *"DEL-R2R-009: Índice por Parceiro (PARTNER)"*) composto pelos campos **`CLIENT`** + **`PARTNER`** (nessa ordem, garantindo eficiência por mandante), gravar na request `S4DK900952` / tarefa `S4DK900953` e ativar.

### Dependências / Decisões

* **Classificação e decisão de execução (Melhoria Opcional):** Item classificado como **Melhoria Opcional** (Semáforo Azul) na Seção 4 do [[Code Review 1.pdf|Code Review 1]]. Sua não implementação não bloqueia o funcionamento nem a liberação da demanda, mas sua adoção reforça a integridade de auditoria (`#NOT_ALLOWED`), a clareza de exibição em relatórios futuros e a performance de buscas por `PARTNER`.
* **Elegibilidade das skills do fluxo (`[MCP]` + `[Manual]`):**
  * **Caminho Recomendado (`/gerar-guia-code-review-sap`):** Como o plano completo envolve criação encadeada de múltiplos novos objetos DDIC (`ZE_*` e opcionais `ZD_*`), alteração da tabela `ZTFI_LOG_INADIMP` e etapas `[Manual]` fora do MCP (domínios e índice secundário), recomenda-se gerar o guia dedicado com **`/gerar-guia-code-review-sap`** (e executar os passos `[MCP]` via **`/implementar-demanda-sap`**, realizando os passos `[Manual]` no ADT/`SE11`).
  * **Caminho Enxuto Alternativo (`/implementar-cr-simples` + índice `[Manual]`):** Caso a equipe decida reutilizar exclusivamente elementos standard já existentes no S4D para todos os 6 campos (ex.: `BAPI_MSG`, `ABP_CREATION_UTCL`, `CRM_PS_DM_OVERDUE_AMT`, `FAR_PDAV_NET_DUE_ARREARS_DAYS`), a edição apenas na [[01 - ZTFI_LOG_INADIMP|ZTFI_LOG_INADIMP]] seria elegível para **`/implementar-cr-simples`** (`[MCP]`), complementada pela criação `[Manual]` do índice secundário `Z01` no ADT/`SE11` — com a ressalva de que `ACAO` e `STATUS` ficariam sem elemento semântico dedicado em português e `VLR_VENCIDO`/`DIAS_ATRASO` ficariam com rótulos em inglês ou parciais.
* **Impacto nulo na [[08 - ZCLFI_BP_CLIENTE_INAD|ZCLFI_BP_CLIENTE_INAD]] e demais objetos:** Levantamento no cofre e no S4D confirmou que nenhuma **CDS** (*Core Data Services*) ou projeção consome a `ZTFI_LOG_INADIMP` — apenas a [[08 - ZCLFI_BP_CLIENTE_INAD|ZCLFI_BP_CLIENTE_INAD]] declara `gt_log`, `lt_log`, `lv_msg_log TYPE ztfi_log_inadimp-mensagem` e executa `INSERT ztfi_log_inadimp`. Preservando `CHAR(1)`, `CHAR(1)`, `CHAR(220)`, `CURR(15,2)`, `INT4` e `UTCLONG` (`ABP_CREATION_UTCL`), não há nenhuma alteração necessária na classe nem risco de falha de conversão no **QAS**.
* **Sequenciamento recomendado em relação à `CR-116`:** Caso esta melhoria seja aprovada, convém executá-la **antes da [[CR-116 - Documentação ABAP Doc e Testes ABAP Unit|CR-116]]**, garantindo que os testes automatizados **ABAP Unit** e o **ATC** final da solução sejam validados já sobre a estrutura definitiva da tabela de log.

---

## 4. Teste Pós Ajuste

> Além do roteiro geral de testes do revisor em [[CR-117 - Checklist de Testes no QAS|CR-117]], os cenários abaixo validam diretamente no **S4D** e no **QAS** (*Quality Assurance System* — ambiente de qualidade) as melhorias opcionais sugeridas pelo supervisor técnico referentes ao **CR-112** *(executar os itens aplicáveis conforme o que for aprovado implementar na Seção 3)*.

### Teste solicitado pelo Supervisor Técnico (ref. ao CR-112)

* **1. Padronização **DDIC** (*ABAP Data Dictionary*), bloqueio de manutenção e índice na `[[01 - ZTFI_LOG_INADIMP|ZTFI_LOG_INADIMP]]`** *(Seção 4 do [[Code Review 1.pdf|Code Review 1]])* — **Registro:** —
  - [x] **1.1. Elementos de dados:** Caso implementado, confirmar na `SE11`/ADT que os campos `ACAO`, `STATUS`, `MENSAGEM`, `VLR_VENCIDO`, `DIAS_ATRASO` e `CREATED_AT` utilizam elementos de dados com rótulos descritivos corretos. ✅ 2026-11-19
  - [x] **1.2. Bloqueio de edição manual (`#NOT_ALLOWED`):** Confirmar que `dataMaintenance` está configurado como manutenção não permitida e que a edição manual pela `SM30`/`SE16N` está bloqueada para preservar a integridade da auditoria. ✅ 2026-11-19
  - [x] **1.3. Índice por `PARTNER`:** Confirmar a criação/ativação do índice secundário pelo campo `PARTNER` e gravação normal de novas linhas de log no QAS. ✅ 2026-11-19

### Testes adicionais do que foi implementado aqui (além do pedido pelo supervisor)

* **1. Compatibilidade de gravação na classe `[[08 - ZCLFI_BP_CLIENTE_INAD|ZCLFI_BP_CLIENTE_INAD]]`** — **Registro:** —
  - [x] **1.1. Regressão do `INSERT ztfi_log_inadimp` e ATC:** Executar bloqueio e desbloqueio no aplicativo e validar que todos os campos do log continuam sendo gravados sem erro de tipo ou truncamento, com **ATC** (*ABAP Test Cockpit*) sem erros P1. ✅ 2026-11-19
