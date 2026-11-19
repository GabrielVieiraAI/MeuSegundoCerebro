---
name: gerar-guia-code-review-sap
description: >-
  Gera o Guia de Implementação específico para um item de Code Review (CR-XXX) de uma demanda SAP.
  Valida a existência do Plano de Ação na nota do item, lê o estado ativo atual dos objetos afetados
  diretamente no ambiente SAP DEV via MCP sap-adt, atualiza as notas em 04 - Objetos Tecnicos/ (e a
  Arquitetura quando aplicável) exclusivamente com as modificações do CR em questão e cria o guia em
  05 - Code Review/<Revisão>/Guias/<CR-XXX> - Guia de Implementação.md pronto para execução pela
  skill /implementar-demanda-sap. Ativada pelo comando `/gerar-guia-code-review-sap`.
---

# Skill: Gerar Guia de Implementação de Code Review SAP (`/gerar-guia-code-review-sap`)

Esta skill prepara e gera o **Guia de Implementação de Code Review** para **um único item (`CR-XXX`) por vez** (`05 - Code Review/0<R> - Revisao (...)/Guias/<CR-XXX> - Guia de Implementação.md`), deixando as notas técnicas em `04 - Objetos Tecnicos/` prontas para execução automatizada via `/implementar-demanda-sap <Demanda> <CR-XXX>`.

- **100% agnóstica de demanda:** opera exclusivamente sobre a estrutura padrão de pastas das demandas SAP e os templates neutros de `05_Templates/01_Projetos_SAP/`.
- **Padrão de numeração `CR-XXX`:** os dígitos anteriores aos 2 últimos identificam a revisão (ex.: `CR-101` a `CR-199` pertencem à pasta `01 - Revisao (...)`; `CR-201` a `CR-299` pertencem à pasta `02 - Revisao (...)`).
- **Independência entre itens de CR:** cada guia contempla **exclusivamente** as alterações do `<CR-XXX>` solicitado. Como cada CR é gerado após a conclusão do anterior e parte da leitura direta do código ativo no ambiente SAP de Desenvolvimento (`DEV`), objetos compartilhados entre múltiplos CRs refletem naturalmente o estado real acumulado no SAP.

---

## 1. Pré-Requisito e Portão de Aprovação Obrigatório (Explicar antes de Executar)

1. **Primeiro Passo (Validação, Leitura no SAP DEV e Explicação no Chat):**
   * **Localizar o Item de CR e Validar Pré-Requisito:**
     * Identifique a pasta da revisão a partir do número do `<CR-XXX>` e leia a nota `05 - Code Review/0<R> - Revisao (...)/Itens/<CR-XXX> - *.md`.
     * **Trava obrigatória de Plano de Ação:** verifique se a seção **Plano de Ação** (ex.: `## 3. Plano de Ação`) está preenchida com as definições do ajuste. Caso esteja vazia ou contenha apenas texto provisório (*placeholder*, como `*(A definir...)*`), **interrompa imediatamente** e informe ao usuário que o Plano de Ação precisa ser definido antes de gerar o guia.
   * **Ler Contexto Arquitetural e Templates no Cofre:**
     * Leia `02 - Arquitetura e Design/<ID> - Arquitetura e Objetos.md` e as notas dos objetos afetados em `04 - Objetos Tecnicos/`.
     * Caso o CR exija a criação de um novo objeto técnico, consulte o padrão de nomenclatura na pasta de regras globais da empresa (`01_Projects/Insi/<Empresa>/Regras Globais*` ou `01_Projects/Insi/Padrão de Nomenclatura ABAP Geral.md`) e o template `05_Templates/01_Projetos_SAP/Template_Objeto_Tecnico.md`.
     * Leia obrigatoriamente o template:
       * `05_Templates/01_Projetos_SAP/Template_Guia_Implementacao_Code_Review.md`
   * **Ler o Estado Atual dos Objetos Afetados Diretamente no SAP `DEV` (Somente Leitura via MCP `sap-adt`):**
     * Chame `abap_destination_list` e selecione a conexão ativa de Desenvolvimento (`DEV`), **bloqueando** qualquer destino cujo nome contenha `QAS`, `PRD`, `PROD`, `S4Q` ou `S4P` (sem distinguir maiúsculas/minúsculas). *(Só pergunte ao usuário qual destino utilizar para a leitura caso não haja conexão `DEV` ativa ou existam múltiplos destinos `DEV` ambíguos.)*
     * Para cada objeto existente no SAP que será ajustado pelo `<CR-XXX>`, leia o código-fonte ativo atual diretamente no SAP via `abap_object_read_file` (`version: "ACTIVE"`, paginando por `offset`/`limit` sem truncar; para objetos multi-arquivo como classes `CLAS/OC`, liste antes os arquivos com `abap_object_list_file_uris`).
     * **Regra de base:** as modificações do `<CR-XXX>` devem partir **sempre do estado atual do objeto lido no ambiente SAP `DEV`**.
   * **Responder no Chat (Portão de Aprovação):**
     * Explique de forma direta o que você entendeu que precisa fazer, separando claramente os dois níveis de comunicação abaixo:
       * **Diagnóstico e solução planejada (estritamente em Linguagem de Negócio):** explique o problema identificado no `<CR-XXX>` e o que mudará após o ajuste com foco exclusivo na regra de negócio, no processo, no comportamento visível em tela, nos registros de auditoria e no impacto operacional — **sem citar** nomes técnicos de objetos, tabelas, CDS, classes, métodos, campos, variáveis ou trechos de código.
       * **Escopo de arquivos do cofre e estrutura do guia (em linguagem de alto nível):**
         * Quais notas em `04 - Objetos Tecnicos/` serão atualizadas (ou criadas, caso o CR introduza objeto novo) e se `02 - Arquitetura e Design/<ID> - Arquitetura e Objetos.md` precisará ser atualizado.
         * O arquivo de guia que será criado (`05 - Code Review/0<R> - Revisao (...)/Guias/<CR-XXX> - Guia de Implementação.md`) e a sequência de Passos dividida por Fases (mantendo as descrições em alto nível, sem descer para código ou variáveis), sinalizando quais passos são **`[MCP]`**, quais são **`[Manual]`** e eventuais blocos **`[Ativação em Massa: Ctrl + Shift + F3]`**.
     * **Não crie nem edite nenhum arquivo no cofre (e nunca altere nada no SAP) antes da autorização explícita do usuário.**
2. **Segundo Passo (Execução após Autorização):**
   * Após a autorização do usuário, execute os itens da Seção 2.

---

## 2. Escopo Exato de Execução

1. **Atualizar (ou Criar) as Notas dos Objetos Técnicos (`04 - Objetos Tecnicos/`):**
   * Partindo do código atual lido do ambiente SAP `DEV`, aplique **exclusivamente** as modificações exigidas pelo `<CR-XXX>` e atualize as seções `📝 Código Comentado` e `🚀 Código Limpo` nas notas afetadas em `04 - Objetos Tecnicos/` (mantendo os sub-blocos separados por arquivo/aba **AFF**, *ABAP File Format*, em objetos multi-arquivo como *Behavior Pool* `CLAS/OC`).
   * Caso o `<CR-XXX>` exija um objeto técnico novo, crie sua nota numerada em `04 - Objetos Tecnicos/<NN> - <NOME_OBJETO>.md` seguindo estritamente `05_Templates/01_Projetos_SAP/Template_Objeto_Tecnico.md` (incluindo o bloco `🔖 Metadados ADT` completo).
   * **Compatibilidade Dataview e Regras Visuais:** nunca deixe o seletor estático ABAP isolado entre crases (utilize em negrito ou com escape `\=>`) e nunca utilize diagramas Mermaid.
2. **Atualizar o Documento de Arquitetura (`02 - Arquitetura e Design/<ID> - Arquitetura e Objetos.md`) *(Quando Aplicável)*:**
   * Se o `<CR-XXX>` criar novo objeto, alterar chaves primárias ou mudar a responsabilidade arquitetural de um objeto, atualize `<ID> - Arquitetura e Objetos.md` para manter a lista de objetos e decisões sincronizada.
3. **Criar o Guia de Implementação do Code Review (`05 - Code Review/0<R> - Revisao (...)/Guias/<CR-XXX> - Guia de Implementação.md`):**
   * Siga estritamente `05_Templates/01_Projetos_SAP/Template_Guia_Implementacao_Code_Review.md`.
   * **Mantenha obrigatoriamente vazios** no cabeçalho YAML os campos `sap_destination: ""` e `transport_requests: []` (não consulte nem pergunte ao usuário sobre destino ou *request* para preenchimento do YAML; o usuário preencherá manualmente antes de acionar `/implementar-demanda-sap`).
   * Organize os passos em fases respeitando a ordem estrita de dependência de ativação no SAP, incluindo obrigatoriamente a tag **`[MCP]`** ou **`[Manual]`** em todos os checkboxes (`- [ ] Passo X [MCP] — Atualizar/Criar ... [[Link da Nota do Objeto]]`).
   * Sinalize grupos com dependência circular mútua ou alterações simultâneas de chave/assinatura entre objetos dependentes com a marcação explícita **`[Ativação em Massa: Ctrl + Shift + F3]`**.
4. **Vincular o Guia na Nota do Item de Code Review (`05 - Code Review/0<R> - Revisao (...)/Itens/<CR-XXX> - *.md`):**
   * Adicione na barra de navegação superior da nota do item apenas o link para o guia gerado (`🚀 [[<CR-XXX> - Guia de Implementação|Guia de Implementação]]`).
   * **Nunca altere** o campo `status` no cabeçalho YAML da nota do item de Code Review.
