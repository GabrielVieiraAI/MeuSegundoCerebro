---
name: implementar-demanda-sap
description: >-
  Etapa 5 do Processo de Desenvolvimento de Demandas SAP. Implementa um passo específico
  (ou bloco circular) ou executa em sequência uma fase pendente do Guia de Implementação
  diretamente em ambiente SAP de Desenvolvimento (DEV) via servidor MCP sap-adt, com
  pré-checagens enxutas, ativação, ATC obrigatório, orquestração por subagente no modo Fase
  e sincronização com o cofre. Ativada pelo comando `/implementar-demanda-sap`.
tags:
  - recurso
  - ia
  - skill
  - sap
  - abap
  - sap-adt
  - mcp
---

# Skill: Implementar Demanda SAP (`/implementar-demanda-sap`)

Implementa passos ou fases completas de desenvolvimento diretamente em ambientes SAP de **Desenvolvimento (`DEV`)** por meio do servidor **MCP** (*Model Context Protocol*) **`sap-adt`**, sem scripts **REST** (*Representational State Transfer*) externos e sem gravar credenciais no cofre ou na skill. Integra-se ao [[Processo de Desenvolvimento de Demandas]], ao comando [[gerar-guia-implementacao-sap]] e às notas geradas por [[arquitetar-demanda-sap]].

- **Pré-requisitos no VS Code (`sapse.adt-vscode`):** requer `adt.mcpServer.enableEditFileToolForABAPObjects: true` e `adt.mcpServer.accessRestrictionsEnabled: true` com `destinations` restrito aos destinos `DEV` autorizados e `packages-objectChanges` liberando os prefixos customizados das demandas.
- **Escopo de ferramentas:** utilize o ciclo direto `create` -> `edit_file` -> `check` -> `activate` -> ações pós-ativação -> **ATC** (*ABAP Test Cockpit*). Não utilize `abap_objects_generator_*` no fluxo padrão (gera modelos **RAP**, *ABAP RESTful Application Programming Model*, padrão SAP e não reproduz o código customizado das notas técnicas).

> [!NOTE] Referência Técnica Complementar
> Os parâmetros exatos dos esquemas **JSON** (*JavaScript Object Notation*) do servidor `sap-adt` e o mapeamento detalhado de arquivos **AFF** (*ABAP File Format*) também estão documentados em `.agents/skills/implementar-demanda-sap/references/sap-adt-workflow.md`.

---

## 1. Contrato Estrutural da Demanda (Baseado nos Templates)

As demandas e seus templates são **100% isentos de referências ou comandos de skill**. Esta skill reconhece a estrutura das demandas diretamente a partir dos templates neutros em `05_Templates/01_Projetos_SAP/`:

- **Guia de Implementação ([[Template_Guia_Implementacao_Novo_App]]):** localizado em `03 - Guias de Execucao/01 - <ID> - Guia de Implementação.md` (ou `<ID> - Guia de Implementação.md`). Contém:
  - Cabeçalho **YAML** (*YAML Ain't Markup Language*) com `id_demanda`, `sap_destination` e `transport_requests`.
  - Seções `### Fase X` com checkboxes `- [ ]` / `- [x]` em ordem de dependência técnica, trazendo tag obrigatória **`[MCP]`** ou **`[Manual]`**, subpacote quando aplicável, marcação **`[Ativação em Massa: Ctrl + Shift + F3]`** em blocos circulares e link direto para a nota técnica em `04 - Objetos Tecnicos/`.
- **Notas de Objetos Técnicos ([[Template_Objeto_Tecnico]]):** localizadas em `04 - Objetos Tecnicos/` (considerando sufixos de desambiguação como `(CDS)`, `(BDEF)`, `(MDE)`). Contêm:
  - Bloco `🔖 Metadados ADT` em YAML (`objectType`, `packageName`, `name`, `description` <= 60 caracteres e `extraParams`).
  - Seção `📝 Código Comentado` e seção `🚀 Código Limpo` (com sub-blocos separados por arquivo/aba **AFF** quando o objeto for multi-arquivo, como *Behavior Pool* `CLAS/OC`).

---

## 2. Regras Inegociáveis e Travas de Segurança

1. **Modos de Execução (`Passo` vs. `Fase`) e Blocos Circulares:**
   - **Modo Passo Único** (`/implementar-demanda-sap <Demanda> <Fase> <Passo>`): executa estritamente **1 passo por vez** (ou 1 bloco circular) diretamente na conversa principal (**sem subagente**).
   - **Modo Fase** (`/implementar-demanda-sap <Demanda> <Fase>`): executa os passos `- [ ]` pendentes da fase **um por vez, em ciclo completo**, disparando **sempre 1 subagente isolado** para cada passo/bloco `[MCP]`, e **parando imediatamente** ao encontrar um passo `[Manual]`, pré-checagem `🔴` ou erro **Nível 2**.
   - **Se o usuário omitir passo e fase:** pesquise guias em `03 - Guias de Execucao/` com `- [ ]` pendentes e pergunte qual demanda/passo ou demanda/fase deseja executar.
   - **Única exceção à execução unitária:** grupos com dependência circular mútua marcados no Guia com **`[Ativação em Massa: Ctrl + Shift + F3]`** (ex.: **CDS Views**, *Core Data Services*, pai/filho com `composition` e `association to parent`). Em ambos os modos, crie e edite todos os objetos do grupo como **uma única unidade atômica** antes da ativação em lote via `abap_object_activate` e validação no ATC.
2. **Bloqueio de Guia sem tags:**
   - Todo passo no Guia deve possuir tag explícita **`[MCP]`** ou **`[Manual]`**. Se o Guia não estiver classificado, marque **`🔴`**, **bloqueie a execução** e exija a atualização prévia do Guia.
3. **Passos manuais (`[Manual]`):**
   - Passos `[Manual]` são 100% executados e marcados (`[x]`) pelo desenvolvedor humano no **ADT** (*ABAP Development Tools*), **SAP GUI** ou **BAS** (*SAP Business Application Studio*).
   - Se acionado no Modo Passo Único ou alcançado no Modo Fase: informe qual passo exige ação manual (com o link da nota), aguarde execução e marcação humana no Guia e encerre sem tocar no SAP.
   - Na retomada posterior (novo comando `/implementar-demanda-sap <Demanda> <Fase>`): releia o Guia; se o passo `[Manual]` já estiver `[x]`, avance para o próximo `- [ ]`; se continuar `[ ]`, pare nele novamente.
4. **Trava de ambiente `DEV` e persistência no YAML do Guia:**
   - Chame `abap_destination_list` (que retorna apenas nomes de conexões ativas).
   - **Bloqueie automaticamente** qualquer destino cujo nome contenha `QAS`, `PRD`, `PROD`, `S4Q` ou `S4P` (sem distinguir maiúsculas/minúsculas).
   - Se `sap_destination` estiver ausente/vazio no cabeçalho YAML do Guia, inativo ou bloqueado: sinalize **`🔴`**, pare antes de tocar no SAP, exiba os destinos ativos válidos e exija escolha + confirmação explícita do usuário de que o destino é `DEV`, gravando `sap_destination` no YAML do Guia após a resposta.
   - Se `sap_destination` já estiver preenchido no Guia, ativo em `abap_destination_list` e fora dos padrões bloqueados: marque **`🟢`** e utilize-o diretamente sem pedir nova confirmação.
5. **Proibição de `$TMP`:**
   - Criação em pacote local (`$TMP`) é proibida por padrão; só é permitida mediante pedido explícito do usuário no chat.
6. **Política de Transport Request (`TR`) — Nunca autoselecionar:**
   - Leia `transport_requests` no YAML do topo do Guia e chame `abap_transport_get_request` para validar a TR no SAP (atenção ao formato diferente de `objectIdentifier` para `isCreation: true` vs. `false` em `.agents/skills/implementar-demanda-sap/references/sap-adt-workflow.md`).
   - Se não houver TR registrada no YAML ou a TR registrada estiver fechada/inválida no SAP: sinalize **`🔴`**, pare antes de tocar no SAP, exiba as TRs abertas (ou a opção de criar nova via `abap_transport_create_request` com descrição <= 60 caracteres), aguarde a escolha e registre no YAML do Guia.
   - Se já houver TR registrada no Guia **e** validada como aberta no SAP: marque **`🟢`** e utilize-a diretamente sem perguntar novamente no chat.
7. **Execução direta com `🟢` e bloqueio por pendência `🔴`:**
   - Todas as pré-checagens ocorrem internamente pela **IA** (*Inteligência Artificial*) antes de qualquer gravação no SAP.
   - Se **qualquer** item estiver **`🔴`**, pare antes de criar/editar no SAP e aguarde ação humana detalhando apenas o(s) item(ns) `🔴`.
   - Se **todos** os itens estiverem **`🟢`**, execute diretamente no SAP sem pedir confirmação prévia.

---

## 3. Fluxo do Modo Passo Único (Execução Direta na Conversa Principal)

Use este fluxo quando o usuário especificar **Demanda + Fase + Passo** (sem disparar subagente).

### Etapa 1 · Descoberta e Pré-Checagem no Cofre

1. **Localizar Demanda, Guia e Passo:**
   - Identifique o Guia em `03 - Guias de Execucao/` e o passo (ou bloco circular) solicitado.
   - Verifique as travas de entrada: Guia sem tags `[MCP]`/`[Manual]` (**`🔴`** e bloquear) e passo `[Manual]` (informar e encerrar sem tocar no SAP).
   - **Passos fora de ordem:** se existirem passos anteriores ainda com `- [ ]`, marque **`🔴`** no checklist, pare e liste os pré-requisitos pendentes perguntando se o usuário deseja assumir o risco e continuar ou cancelar.
2. **Validar Destino `DEV`:** conforme Seção 2.4.
3. **Extrair Nota Técnica do Objeto (`04 - Objetos Tecnicos/`):**
   - Localize a nota pelo link no Guia e extraia internamente (sem colar no chat):
     - Bloco de **Metadados ADT**: `objectType`, `packageName`, `name`, `description` (<= 60 caracteres) e `extraParams`.
     - Seção `📝 Código Comentado` e seção `🚀 Código Limpo` (incluindo sub-blocos separados por arquivo/aba AFF em objetos multi-arquivo).
   - **Fallback de metadado/bloco ausente:** se faltar `objectType`, pacote, descrição, código limpo ou aba esperada, marque **`🔴`**, pare antes de tocar no SAP e solicite ao usuário o que falta, sem inferir valores.
   - Confira a elegibilidade do `objectType`:
     - **Criáveis (`creatableObjects`):** `DEVC/K`, `TABL/DT`, `TABL/DS`, `DTEL/DE`, `DDLS/DF`, `DDLX/EX`, `DCLS/DL`, `BDEF/BDO`, `CLAS/OC`, `INTF/OI`, `SRVD/SRV`, `SRVB/SVB`, `MSAG/N`, `NROB/NRO`, `PROG/P`, `PROG/I`, `FUGR/F`, `FUGR/FF`, `ENHO/XHB`.
     - **Exclusivos `[Manual]`:** `SU21`/`SUSO`, *Behavior Extension*, `SAJC`, `UIAD/TYP`, `SRVC/SVM`, `FUGR/I`, camada frontend **SAPUI5** (criação e deploy **BSP**, *Business Server Pages*, via BAS/VS Code) e publicação/segurança no *SAP Fiori Launchpad* / `PFCG`. Se não suportado, informe tratamento `[Manual]` e encerre.
     - **Validação empírica incremental:** tipos ainda não validados em escrita/pós-ativação prática (como `DTEL/DE`, `MSAG/N`, *Elements* de *Package Interface*, intervalos `SNRO`, *API State `C1`*, `ENHO/XHB` e publicação `SRVB/SVB`) são validados no primeiro uso real; se o MCP retornar limitação estrutural, trate como erro **Nível 2** e proponha reclassificação para `[Manual]` no processo.

### Etapa 2 · Idempotência e Consulta de TR

1. **Idempotência no SAP (`abap_repository_search_object`):**
   - Pesquise cada objeto do passo no destino `DEV` confirmado.
   - Se o objeto **não existir**: marque **`🟢`** no checklist (pronto para criação).
   - Se o objeto **já existir**, verifique o pacote retornado, leia o conteúdo atual com `abap_object_read_file` comparando com `🚀 Código Limpo`, marque **`🔴`** no checklist e pare detalhando a situação:
     - **Pacote certo e código idêntico:** pergunte entre **(1)** apenas validar/ativar/ATC ou **(2)** pular o passo.
     - **Pacote certo e código vazio ou divergente:** exiba resumo das diferenças (**diff**) e pergunte entre **(1)** atualizar no SAP com o código da nota e ativar, **(2)** manter o código do SAP e apenas validar/ativar ou **(3)** pular o passo.
     - **Pacote diferente do esperado (ou `$TMP` inesperado):** trave a execução e reporte a divergência para correção manual no ADT, sem editar.
2. **Consulta de TR:** execute `abap_transport_get_request` conforme a Seção 2.6.

### Etapa 3 · Checklist Sucinto de Pré-Checagem (Máx. 1 Linha por Item)

Consolide as checagens das Etapas 1 e 2 em uma **lista sucinta de checkboxes** com **no máximo 1 linha por item** (`- [x] 🟢` ok / `- [ ] 🔴` exige ação humana), **sem colar** JSON de metadados, lista AFF nem código-fonte no chat (referencie apenas o link da nota técnica):
- **Passo e Pré-requisitos** (`[MCP]` e status dos passos anteriores)
- **Destino DEV** (nome validado no YAML e ativo em `abap_destination_list`)
- **TR** (número validado como aberto no SAP)
- **Nota Técnica** (`objectType`, pacote e `🚀 Código Limpo` localizados)
- **Idempotência SAP** (`inexistente` = `🟢`; `existente/divergente` = `🔴`)

**Decisão após o checklist:**
- **Com qualquer `🔴`:** **pare antes de gravar no SAP**, exiba o checklist e detalhe logo abaixo **exclusivamente** o(s) item(ns) `🔴`.
- **Todos `🟢`:** **não pare no chat** — execute as **Etapas 4, 5 e 7** e apresente o checklist `🟢` junto ao resumo final.

### Etapa 4 · Execução no SAP (`sap-adt`)

Execute na ordem estrita exigida pelos esquemas:
1. **Criação (para objetos novos):** `abap_repository_list_creatable_types` -> `abap_object_get_creatable_type_detail` -> `abap_object_validate_creation` (`objectContent` apenas JSON de metadados) -> `abap_object_create` (com `transportRequestNumber`).
2. **Mapeamento e Edição AFF:** `abap_object_list_file_uris` (e `abap_object_get_aff_specification` se precisar de schema `.json` ou mapear includes). Para cada arquivo/aba previsto na nota: leia todo o conteúdo atual com `abap_object_read_file` (`WORKING_AREA` / `INACTIVE`, sem truncar) e aplique `🚀 Código Limpo` via `abap_object_edit_file` (`oldString: ""` se vazio; conteúdo exato lido se preenchido), informando `transportNumber`.
   - *Em blocos circulares:* crie e edite **todos** os objetos do grupo antes da Etapa 5.

### Etapa 5 · Critério de Pronto (Check, Ativação, Ação e ATC)

1. **Checagem e Ativação:** `abap_object_check` -> `abap_object_activate` (enviando o array completo se bloco circular); se retornar `Step is still running`, confirme lendo `version: "ACTIVE"` via `abap_object_read_file`.
2. **Ações Pós-Ativação (quando aplicável, ex.: publicar *Service Binding* `SRVB/SVB`):** consulte `abap_object_list_actions`; se ação e *payload* forem inequívocos para o passo, execute diretamente via `abap_object_run_action`; se houver ambiguidade ou erro, trate como Nível 2.
3. **ATC Obrigatório (`ABAP Test Cockpit`):** com o(s) objeto(s) ativo(s) e sem erro de sintaxe, execute `abap_atc_run_start` (omitindo `checkVariant`) -> `abap_atc_run_get_result` (paginando por `nextCursor` até concluir).
4. **Diff da TR (`abap_transport_get_unified_diff`):** fora do padrão; execute **apenas se o usuário pedir explicitamente**.

### Etapa 6 · Tratamento de Erros (Check, Ativação, Ação ou ATC)

- **Nível 1 — Erro simples ou sintaxe local** (não altera regra de negócio nem muda assinatura ou comportamento de outros objetos): corrija via `abap_object_edit_file` e repita checagem -> ativação -> ATC. Limite máximo de **2 tentativas**; persistindo na 2ª, escale para Nível 2. Registre todo ajuste para o resumo final.
- **Nível 2 — Regra de negócio, impacto em dependências ou limitação estrutural do MCP** (ou > 2 tentativas, *Package Check* / *API State `C1`*, limitação de esquema): **pare imediatamente.** Apresente **(a)** mensagem exata do SAP, **(b)** causa técnica identificada e **(c)** alternativas e impactos, aguardando decisão do usuário.
- **Achados ATC Prioridade 2 e 3 (Avisos / Informações):** não travam a execução; liste-os no resumo final.

### Etapa 7 · Sincronização com o Cofre e Fechamento (Sem "OK" Final)

1. **Espelhamento das Notas de Objeto (somente após sucesso no SAP):** se o código final ativo divergir do original da nota por ajuste Nível 1 ou ajuste autorizado, atualize `🚀 Código Limpo` e `📝 Código Comentado` na nota em `04 - Objetos Tecnicos/`. **Compatibilidade Dataview:** nunca deixe o seletor estático ABAP isolado entre crases (use negrito ou escape). Nunca utilize diagramas Mermaid nem analogias.
2. **Persistência de Metadados no Guia:** grave/atualize `sap_destination` e `transport_requests` no YAML se definidos ou alterados nesta execução.
3. **Marcação Automática no Guia e Resumo Final:**
   - Se checagem, ativação e **ATC** concluírem sem erros críticos (Prioridade 1), **marque imediatamente o(s) checkbox(es) no Guia** sem esperar `"OK"` final: `- [x] Passo X ... ✅ YYYY-MM-DD`. (Nunca marque `[x]` se houver `🔴`, erro Nível 2 ou passo pulado.)
   - Exiba o checklist sucinto (`🟢`, máx. 1 linha/item) + resumo objetivo (objeto, pacote, TR, checagem/ativação, resultado ATC com eventuais Prioridades 2/3, eventual espelhamento da nota, confirmação da marcação `[x]` e próximo passo).

---

## 4. Fluxo do Modo Fase (Orquestrador + Subagente Isolado por Passo)

Use este fluxo sempre que o usuário informar **Demanda + Fase** (sem passo específico), mesmo para fases pequenas.

### Etapa F1 · Pré-Checagem Inicial Única (Orquestrador)

1. Localize o Guia em `03 - Guias de Execucao/` e identifique a seção `### Fase X`.
2. Verifique as travas globais do Guia:
   - Todos os passos possuem tag `[MCP]` ou `[Manual]` (senão `🔴` e bloquear).
   - Se houver passos `- [ ]` pendentes **antes** da fase solicitada (ex.: fase anterior incompleta ou passo manual anterior ainda aberto): marque **`🔴`**, pare e liste esses pré-requisitos pendentes perguntando se o usuário deseja assumir o risco ou cancelar.
3. Valide **1 única vez** os recursos compartilhados da fase:
   - `sap_destination` (Seção 2.4 via `abap_destination_list`).
   - `TR` aberta (`transport_requests` no YAML + `abap_transport_get_request`, Seção 2.6).
   - `abap_repository_list_creatable_types` (`creatableObjects` ativos no destino `DEV`).
   - Se faltar `sap_destination` ou `TR`, pare antes de iniciar qualquer passo detalhando apenas o item `🔴`.
4. Mapeie os itens `- [ ]` pendentes da fase em ordem cronológica, agrupando passos contíguos com `[Ativação em Massa: Ctrl + Shift + F3]` em **uma única unidade atômica**.

### Etapa F2 · Loop Sequencial em Ciclo Completo (1 Unidade por Vez)

Para o próximo item `- [ ]` pendente da fase (lendo o estado atual do Guia a cada iteração):

1. **Se o item for `[Manual]`:**
   - **Pare o loop imediatamente** (não marque o item `[Manual]`).
   - Passe para a **Etapa F3** informando qual passo `[Manual]` precisa ser executado e marcado `[x]` manualmente no Guia pelo usuário (com o link da nota), lembrando que a retomada ocorre executando `/implementar-demanda-sap <Demanda> <Fase>` novamente após marcar `[x]`.
2. **Se o item for `[MCP]` (ou bloco circular):**
   - Dispare **sempre 1 subagente isolado** via `invoke_subagent` (`TypeName: "self"`, `Workspace: "inherit"`, `Model: "inherit"`).
   - **Contexto Prévio Obrigatório no `Prompt` do Subagente (e nada além disso):**
     1. Caminho absoluto do Guia de Implementação e caminho(s) exato(s) da(s) nota(s) técnica(s) deste passo/bloco em `04 - Objetos Tecnicos/`.
     2. `sap_destination` já validado como `DEV`.
     3. Número da `TR` já validada no Guia.
     4. Identificação exata do(s) passo(s) (sinalizando se é bloco `[Ativação em Massa: Ctrl + Shift + F3]`) e pacote(s) alvo(s).
     5. Lista de `creatableObjects` obtida na Etapa F1.
     6. Instrução estrita para executar as Etapas 1–7 da Seção 3 exclusivamente para este passo/bloco (lendo **apenas** a(s) nota(s) deste passo, sem re-ler o YAML do Guia para destino/TR e sem pesquisar o cofre) e responder **somente** com um resumo curto estruturado contendo:
        - `STATUS`: `CONCLUIDO` | `BLOQUEIO_PRECHECK` | `ERRO_NIVEL_2`
        - `PASSO` e `OBJETOS`
        - `CHECK_ATIVACAO`
        - `ATC_RESUMO` (`Errors / Warnings / Infos`)
        - `AJUSTES_NIVEL_1` (se houver)
        - `NOTA_ATUALIZADA` (`sim/nao`)
        - `CHECKBOX_GUIA_MARCADO` (`sim/nao`)
        - `DETALHE_BLOQUEIO` (preenchido apenas se `BLOQUEIO_PRECHECK` ou `ERRO_NIVEL_2`)
   - *(Regra de preservação de contexto: o Orquestrador **nunca** lê as notas técnicas para copiar código-fonte dentro do `Prompt` enviado ao subagente.)*
3. **Verificação Pós-Subagente no Orquestrador:**
   - Leia apenas o trecho do passo no Guia para confirmar que o checkbox foi atualizado para `- [x]`.
   - Se `STATUS = CONCLUIDO` e `[x]` confirmado no Guia: registre a linha consolidada deste passo e avance para o próximo `- [ ]` da fase.
   - Se `STATUS` for `BLOQUEIO_PRECHECK` (`🔴`), `ERRO_NIVEL_2`, ou o `[x]` não tiver sido marcado: **interrompa o loop imediatamente** (mantendo os `[x]` já concluídos nos passos anteriores) e siga para a **Etapa F3**.

### Etapa F3 · Entrega Resumida da Fase (Conclusão ou Parada)

Apresente diretamente no chat principal:
1. **Cabeçalho enxuto:** `Demanda` | `Fase` | `Destino DEV` | `TR`.
2. **Tabela ou lista resumida da fase** (1 linha por passo processado nesta execução: `Passo` | `Objeto` | `Check / Ativação` | `ATC` | `Ajustes Nível 1` | `Resultado`).
3. **Status de encerramento:**
   - **Fase concluída (`100%`):** todos os passos da fase estão `[x]`.
   - **Pausa em `[Manual]`:** passo manual aguardando execução e marcação `[x]` no Guia pelo usuário; informe o link da nota e o comando de retomada `/implementar-demanda-sap <Demanda> <Fase>`.
   - **Bloqueio (`🔴` ou Erro Nível 2):** detalhe exclusivamente o bloqueio/erro do passo onde a execução parou (para decisão humana antes de rodar `/implementar-demanda-sap <Demanda> <Fase>` novamente).
