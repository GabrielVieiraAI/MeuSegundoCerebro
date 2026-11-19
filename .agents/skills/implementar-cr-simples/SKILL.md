---
name: implementar-cr-simples
description: >-
  Implementa ajustes pontuais e simples de Code Review (CR-XXX) diretamente em ambiente SAP de
  Desenvolvimento (DEV) via servidor MCP sap-adt a partir da própria nota do CR (sem gerar arquivo
  em Guias/). Valida a Seção 3 (Plano de Ação), lê exclusivamente o código ativo atual no SAP DEV
  (economizando contexto ao não ler 04 - Objetos Tecnicos/ na análise), apresenta portão único de
  aprovação com diff visual comentado em Linguagem de Negócio (Código Atual vs. Como Deve Ficar),
  aplica, ativa, executa ATC obrigatório e sincroniza a(s) nota(s) afetada(s) em 04 - Objetos Tecnicos/,
  mantendo status Pendente no CR até os testes no QAS. Ativada pelo comando `/implementar-cr-simples`.
---

# Skill: Implementar CR Simples (`/implementar-cr-simples`)

Implementa um item pontual de **Code Review (`CR-XXX`)** diretamente no ambiente SAP de **Desenvolvimento (`DEV`)** via servidor **MCP** (*Model Context Protocol*) **`sap-adt`**, dispensando a criação de um guia intermediário em `05 - Code Review/.../Guias/`.

- **100% agnóstica de demanda:** opera sobre a estrutura padrão das notas em `05 - Code Review/0<R> - Revisao (...)/Itens/<CR-XXX> - *.md` seguindo `05_Templates/01_Projetos_SAP/Template_Item_Code_Review.md`.
- **Padrão de numeração `CR-XXX`:** os dígitos anteriores aos 2 últimos identificam a pasta da revisão (ex.: `CR-103` → `01 - Revisao (...)`; `CR-203` → `02 - Revisao (...)`).
- **Economia de contexto na análise:** durante as Etapas 1 e 2, **nunca** leia as notas de código em `04 - Objetos Tecnicos/` nem documentos de `02 - Arquitetura e Design/`. A fonte de verdade para diagnosticar e montar o ajuste é **exclusivamente o código ativo (`ACTIVE`) lido direto do SAP `DEV`**. As notas em `04 - Objetos Tecnicos/` só são lidas e atualizadas na Etapa 3, após a ativação e o **ATC** (*ABAP Test Cockpit*) no SAP.
- **Referência complementar de esquemas `sap-adt`:** caso precise consultar detalhes de payload ou mapeamento **AFF** (*ABAP File Format*), consulte `../implementar-demanda-sap/references/sap-adt-workflow.md`.

---

## 1. Regras Inegociáveis e Travas de Segurança

1. **Pré-requisito de Plano de Ação (`## 3. Plano de Ação`):**
   * Verifique se a Seção 3 da nota `<CR-XXX> - *.md` está preenchida com definições concretas do ajuste.
   * Se estiver vazia ou contiver apenas *placeholder* (ex.: `*(A definir...)*`), **pare imediatamente** e informe que o Plano de Ação precisa ser definido antes da implementação.
2. **Guarda de Escopo (CR Simples vs. Fluxo Completo / Manual):**
   * **Elegível para `/implementar-cr-simples`:** ajuste pontual em 1 objeto (ou 1–2 objetos simples sem dependência circular), suportado pelo MCP `sap-adt` (ex.: `CLAS/OC`, `DDLS/DF`, `DDLX/EX`, `DCLS/DL`, `BDEF/BDO`, `INTF/OI`, `PROG/P`, `FUGR/FF`).
   * **Redirecionar para o fluxo completo:** se o CR exigir **ativação em massa por dependência circular** (ex.: alteração simultânea de chave primária entre CDS Raiz, Projeção e BDEFs), criação encadeada de múltiplos objetos novos ou mudanças arquiteturais amplas, **pare** e oriente usar `/gerar-guia-code-review-sap` + `/implementar-demanda-sap`.
   * **Itens puramente manuais (`[Manual]`):** se o ajuste envolver apenas objetos/transações fora do MCP (ex.: `SU21`/`SUSO`, *Behavior Extension*, `SAJC`, `SE03` para idioma original, retirada de objetos de *Transport Request* em `SE09`/`SE10` ou deploy **SAPUI5** / **BSP**, *Business Server Pages*, via BAS), informe claramente que a execução é manual e apresente o passo a passo no chat sem tentar gravar via MCP.
3. **Trava de Ambiente `DEV` (Bloqueio Estrito de `QAS` / `PRD`):**
   * Leia `sap_destination` no YAML da nota `<CR-XXX> - *.md`.
   * Chame `abap_destination_list` (que retorna apenas conexões ativas).
   * **Bloqueie automaticamente** qualquer destino cujo nome contenha `QAS`, `PRD`, `PROD`, `S4Q` ou `S4P` (sem distinguir maiúsculas/minúsculas).
   * Se `sap_destination` já estiver preenchido no YAML, ativo em `abap_destination_list` e fora dos padrões bloqueados: marque **`🟢`**.
   * Se `sap_destination` estiver vazio, ausente, inativo ou bloqueado: marque **`🔴`**, liste os destinos ativos elegíveis e exija escolha + confirmação explícita do usuário de que o destino é `DEV` no Portão de Aprovação antes de gravar no SAP.
4. **Política de *Transport Request* (`TR`) — Nunca Autoselecionar:**
   * Leia `transport_requests` (e, de forma informativa, `request` / `tarefa`) no YAML da nota `<CR-XXX> - *.md`.
   * Se `transport_requests` já tiver uma `TR` registrada, valide-a no SAP via `abap_transport_get_request` (`isCreation: false` para alteração de objeto existente; `isCreation: true` para criação de objeto novo). Estando aberta e válida, marque **`🟢`**.
   * Se `transport_requests` estiver vazio ou a `TR` estiver fechada/inválida: marque **`🔴`**, consulte as `TR`s abertas via `abap_transport_get_request` (destacando a `request` do cabeçalho do CR caso esteja aberta no SAP, além da opção de criar nova via `abap_transport_create_request` com descrição <= 60 caracteres) e aguarde a escolha explícita do usuário no Portão de Aprovação.
   * **Proibição de `$TMP`:** gravação em pacote local `$TMP` é proibida, salvo pedido explícito do usuário no chat.
5. **Status do CR no YAML:**
   * **Nunca altere** o campo `status` no YAML da nota `<CR-XXX> - *.md` ao concluir a etapa em `DEV` (`status: Pendente` permanece intacto para ser alterado a `concluido` somente após os testes da Seção 4 no `QAS`).

---

## 2. Fluxo de Execução (3 Etapas)

### Etapa 1 · Entrada, Validação no SAP `DEV` e Leitura do Código Vivo

1. **Localizar a nota do CR:**
   * Identifique a pasta `05 - Code Review/0<R> - Revisao (...)/Itens/` pelo número do `<CR-XXX>` e leia a nota `<CR-XXX> - *.md`.
   * Valide a Seção 3 (`## 3. Plano de Ação`) e a elegibilidade do CR como simples (Regras 1 e 2).
2. **Validar Destino `DEV` e `TR`:**
   * Execute as checagens das Regras 3 e 4 usando o YAML do próprio CR e o servidor `sap-adt`.
   * **Lembrete:** mesmo que `sap_destination` ou `transport_requests` estejam vazios (`🔴`), caso haja um destino `DEV` único/evidente ou você precise confirmar em qual ambiente ler, só prossiga com a leitura no SAP `DEV` se houver ao menos um destino `DEV` inequívoco e ativo (caso contrário, pare e pergunte o destino primeiro, sem tocar em nenhum outro ambiente).
3. **Pesquisar e Ler Objetos Diretamente no SAP `DEV` (Somente Leitura):**
   * A partir dos nomes técnicos indicados na Seção 3 do CR, chame `abap_repository_search_object` no destino `DEV` para confirmar a existência, o tipo (`objectType`) e o pacote real de cada objeto (travando como **`🔴`** se algum objeto existir em `$TMP` inesperado ou em pacote divergente do projeto).
   * Para objetos multi-arquivo (como `CLAS/OC`), chame `abap_object_list_file_uris` para identificar o(s) *include(s)* alvo (ex.: `locals_imp`, `abap`, `testclasses`).
   * Leia o código-fonte completo atual via `abap_object_read_file` com **`version: "ACTIVE"`** (paginando com `offset`/`limit` caso necessário, sem truncar).
   * **Não leia** `04 - Objetos Tecnicos/` nem `02 - Arquitetura e Design/` nesta etapa.

### Etapa 2 · Portão Único de Aprovação no Chat (Sem Gravar Nada Ainda)

Apresente em **uma única resposta clara** no chat:

1. **Checklist Sucinto de Pré-Checagem (máx. 1 linha por item):**
   * **CR e Plano de Ação** (`🟢` Seção 3 validada e escopo simples confirmado)
   * **Destino `DEV`** (`🟢` validado ou `🔴` aguardando escolha entre os destinos ativos)
   * **`TR`** (`🟢` validada aberta ou `🔴` aguardando escolha entre as `TR`s abertas)
   * **Objeto(s) no SAP `DEV`** (`🟢` pacote e código `ACTIVE` lidos ou `🔴` divergência encontrada)
2. **Diagnóstico e O Que Vai Mudar:**
   * Explique de forma direta o ajuste planejado em cima do código real lido no SAP `DEV`.
3. **Comparativo Visual por Objeto (`🔴 Código Atual` vs. `🟢 Como Deve Ficar`):**
   * Exiba de forma enxuta apenas os trechos relevantes (ou o objeto completo se for pequeno, como uma DCL ou CDS curta) mostrando exatamente **🔴 Código Atual (SAP `DEV`)** e **🟢 Como Deve Ficar** após a alteração.
   * **Comentários obrigatórios em Linguagem de Negócio dentro dos blocos de código:** tanto em **🔴 Código Atual** quanto em **🟢 Como Deve Ficar**, inclua comentários de código válidos na linguagem do objeto (ex.: `"` em ABAP, `//` em CDS/DCL) explicando o comportamento atual, o problema causado e o que está mudando em cada trecho relevante:
     * **Foco dos comentários:** regra de negócio, fluxo do processo, comportamento visível na tela e impacto operacional (para público de negócio / *Key User*).
     * **Proibições dentro do texto dos comentários:** não cite nomes técnicos de objetos, tabelas, classes, métodos, campos, parâmetros, variáveis, comandos SQL/ABAP, jargões de programação nem analogias desnecessárias; traduza tudo para termos naturais do negócio.
     * **Escopo visual:** esses comentários servem para explicar o comparativo no Portão de Aprovação e **não** devem ser gravados no código ativo do SAP `DEV` na Etapa 3 (salvo se o Plano de Ação exigir comentários no código-fonte).
4. **Autorização Explícita:**
   * Peça confirmação única para executar no SAP `DEV` (e, se aplicável, a confirmação de `sap_destination` e/ou `TR` marcada como `🔴` no checklist).
   * **Nunca edite nem crie nada no SAP ou no cofre antes da autorização explícita do usuário.**

### Etapa 3 · Execução no SAP `DEV`, ATC e Sincronização com o Cofre

Após a autorização do usuário (e definidos destino `DEV` + `TR`):

1. **Persistir Destino e TR no YAML do CR (se preenchidos/alterados):**
   * Grave `sap_destination` e `transport_requests` no cabeçalho YAML da nota `<CR-XXX> - *.md`.
   * Mantenha `status: Pendente` intacto.
2. **Aplicar a Alteração no SAP `DEV` (`sap-adt`):**
   * **Se objeto existente:** releia o arquivo alvo em `version: "WORKING_AREA"` (sem truncar, garantindo `oldString` exato se houver versão inativa) e aplique a alteração via `abap_object_edit_file` informando `transportNumber`.
   * **Se objeto novo simples** (ex.: `DCLS/DL` ou auxiliar única suportada): siga a cadeia `abap_repository_list_creatable_types` → `abap_object_get_creatable_type_detail` → `abap_object_validate_creation` (`objectContent` apenas JSON de metadados) → `abap_object_create` (com `transportRequestNumber`) → `abap_object_edit_file` (`oldString: ""`).
3. **Critério de Pronto (`Check` → `Ativação` → `ATC` Obrigatório):**
   * Execute `abap_object_check` e em seguida `abap_object_activate` (caso retorne `Step is still running`, confirme lendo `version: "ACTIVE"` via `abap_object_read_file`).
   * Se houver ação pós-ativação inequívoca (quando aplicável), consulte `abap_object_list_actions` e execute `abap_object_run_action`.
   * Execute **ATC obrigatório**: `abap_atc_run_start` (omitindo `checkVariant`) → `abap_atc_run_get_result` (paginando por `nextCursor` até finalizar).
   * **Tratamento de Erros:**
     * **Nível 1 (erro simples de sintaxe local):** sem mudar regra de negócio nem assinatura/comportamento externo, corrija via `abap_object_edit_file` e repita `check` → `activate` → `ATC` (máximo de **2 tentativas**; persistindo na 2ª, escale para Nível 2).
     * **Nível 2 (regra de negócio, impacto em dependências ou limitação do MCP):** **pare imediatamente**, informe a mensagem exata do SAP, causa técnica e alternativas.
     * **Achados ATC Prioridade 2 e 3 (Avisos / Informações):** não travam; relate no resumo final.
4. **Sincronizar Nota(s) em `04 - Objetos Tecnicos/` (Somente Agora):**
   * **Se objeto existente:** localize e leia apenas as linhas necessárias da nota correspondente em `04 - Objetos Tecnicos/` e atualize as seções `📝 Código Comentado` e `🚀 Código Limpo` (mantendo a divisão por abas **AFF** em objetos multi-arquivo como `CLAS/OC`) para refletir o código final ativo no SAP `DEV`.
   * **Se objeto novo criado:** crie a nota numerada em `04 - Objetos Tecnicos/<NN> - <NOME_OBJETO>.md` seguindo `05_Templates/01_Projetos_SAP/Template_Objeto_Tecnico.md` (com `🔖 Metadados ADT`) e atualize `02 - Arquitetura e Design/<ID> - Arquitetura e Objetos.md`.
   * **Regras visuais obrigatórias:** nunca deixe o seletor estático ABAP isolado entre crases (use em negrito ou com escape `\=>`), nunca utilize diagramas Mermaid e nunca utilize analogias desnecessárias.
   * **Não crie** nenhum arquivo em `05 - Code Review/0<R> - Revisao (...)/Guias/`.
5. **Resumo Final:**
   * Apresente resumo objetivo com: objeto(s) e pacote, destino `DEV`, `TR`, resultado de `Check`/`Ativação`, resultado do `ATC` (`Erros P1 / Avisos P2 / Infos P3`), eventuais ajustes Nível 1, link da(s) nota(s) atualizada(s) em `04 - Objetos Tecnicos/`, confirmação de que o YAML do CR mantém `status: Pendente` e lembrete de validar a Seção 4 (`Teste Pós Ajuste`) no `QAS`.
