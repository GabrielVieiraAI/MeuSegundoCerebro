---
tipo: conceito
tags:
  - youtube
  - inteligencia-artificial
  - engenharia-de-software
  - spec-driven-development
  - egm
  - claude-code
  - agentes-ia
fonte: "https://www.youtube.com/watch?v=VJ1CMfatVg8"
status: ativo
---

# Elephant-Goldfish Model (EGM) - Spec-Driven Development com IA

Fonte de Referência: [O Google liberou de graça: o plugin que faz a IA planejar antes de programar (EGM)](https://www.youtube.com/watch?v=VJ1CMfatVg8)

## Tese Central

O método predominante de programação assistida por IA, conhecido informalmente como *vibe coding* (onde o desenvolvedor solicita alterações em tempo real via chat e a IA cospe código imediatamente), colapsa em projetos de média e alta complexidade. Esse colapso ocorre pela **poluição de contexto** (*context pollution*) e pelo **viés de confirmação conversacional**: à medida que uma sessão com um LLM (*Large Language Model* - Modelo de Linguagem de Grande Escala) se estende por dezenas de mensagens, o modelo perde a capacidade crítica, assume premissas não verificadas como verdadeiras e passa a validar decisões frágeis do desenvolvedor em vez de apontar falhas estruturais.

O **Elephant-Goldfish Model (EGM)**, desenvolvido com base no ensaio de Dave Rensin (Engenheiro Distinto da Google) e disponibilizado como plugin de código aberto, resolve essa falha ao transformar o desenvolvimento assistido por IA em **Spec-Driven Development (SDD - Desenvolvimento Orientado por Especificação)**. 

A arquitetura do EGM estabelece uma divisão funcional estrita entre duas personas de IA com estados de memória opostos:
1. **O Elefante:** Sessão de contexto amplo e cumulativo que debate requisitos com o usuário e sintetiza a visão do projeto em um documento técnico formal (`spec.md`), com a regra absoluta de **não escrever nenhuma linha de código de produção**.
2. **Os Peixinhos-Dourados (*Goldfish*):** Subagentes efêmeros e sem memória prévia (*stateless* - sem retenção de estado anterior) que leem unicamente o documento de especificação e a base de código fria, atuando como auditores adversariais para expor lacunas, premissas implícitas e falhas de design antes do início da implementação.

---

## Mapa Conceitual de Execução

![[Elephant-Goldfish Model (EGM) - Fluxo de Spec-Driven Development.excalidraw]]

---

## Fundamentos Conceituais

### 1. Poluição de Contexto e Viés Conversacional (Context Drift & Flattery)
- **Degradação de Atenção:** Em sessões longas de chat, o histórico inflado com conversas intermediárias, tentativas e erros consome a janela de contexto útil do modelo.
- **Cegueira Compartilhada:** Se o desenvolvedor e o modelo chegam a um acordo informal durante uma discussão de meia hora, o modelo assume esse acordo como regra imutável, mesmo que viole princípios básicos de segurança, escalabilidade ou coerência com o restante do repositório.
- **Incapacidade de Identificar Ambiguidade:** O LLM é treinado para satisfazer a intenção do usuário; diante de uma especificação incompleta durante uma sessão longa, ele tende a preencher as lacunas silenciosamente com inferências estocásticas em vez de pausar a execução e exigir esclarecimentos.

### 2. A Dualidade Elefante vs. Peixinho-Dourado
O framework utiliza a metáfora da memória animal para isolar responsabilidades cognitivas complementares:

- **O Elefante (Memória Longa / Contexto Profundo):**
  - **Função:** Parceiro de reflexão arquitetural, exploração de trade-offs e redação técnica.
  - **Vantagem:** Retém o objetivo de negócio de longo prazo e a visão estratégica compartilhada com o desenvolvedor.
  - **Vulnerabilidade:** Vieses acumulados, complacência e perda de rigor analítico por excesso de contexto histórico.

- **O Peixinho-Dourado (Memória Zero / Stateless):**
  - **Função:** Auditor adversarial estrito e descompromissado da especificação.
  - **Vantagem:** Lê a especificação técnica sem saber quem a escreveu, sem histórico emocional ou conversacional, avaliando apenas se o texto é suficiente, coeso, seguro e implementável.
  - **Vulnerabilidade:** Não possui visão holística de negócio; restringe-se estritamente à lógica contida no documento e no repositório.

### 3. Spec-Driven Development (SDD) com Agentes de IA
O paradigma tradicional de desenvolvimento ágil frequentemente tratava a documentação como subproduto tardio da codificação. No contexto de engenharia com agentes de IA, esse fluxo se inverte:
- **A Especificação é o Produto Primário:** O documento técnico (`spec.md`) representa o contrato determinístico entre o arquiteto humano e os agentes executores.
- **Geração de Código como Etapa Derivada:** A geração de código-fonte torna-se uma tarefa quase mecânica de tradução da especificação auditada em arquivos físicos de projeto, reduzindo exponencialmente as chances de alucinação sintática ou desvio de regra de negócio.

### 4. A Regra Cardinal da Concepção: Zero Linhas de Código
Durante as fases de brainstorming, redação de minuta e auditoria de especificação, nenhuma linha de código da aplicação deve ser modificada ou criada. Se o modelo tentar escrever classes, funções ou testes de produção antes do encerramento da fase de resolução da especificação, o processo é considerado corrompido, pois o foco cognitivo muda prematuramente da arquitetura para a sintaxe.

---

## Frameworks Operacionais

### Framework 1: Ciclo Operacional em 7 Comandos do EGM

O plugin EGM estrutura a interação por meio de um conjunto padronizado de comandos executados no terminal de agentes (como Claude Code ou Antigravity CLI):

| Comando | Agente / Estado | Função Operacional | Saída Gerada |
| :--- | :--- | :--- | :--- |
| **`bootstrap`** | Elefante | Analisa o repositório existente, identifica padrões de arquitetura, linguagens e dependências para alimentar o contexto inicial do projeto. | Arquivo de contexto de projeto ou diretrizes arquiteturais |
| **`brainstorm`** | Elefante | Inicia uma entrevista técnica estruturada onde a IA faz perguntas ativas e provocativas ao desenvolvedor para delimitar escopo, restrições e alternativas. | Minuta conceitual de requisitos (*concept brief*) |
| **`draft`** | Elefante | Consolida as decisões tomadas na entrevista em uma especificação técnica formal e padronizada em Markdown. | `spec.md` (Documento de Especificação Técnica) |
| **`review`** | Peixinhos (Subagentes) | Dispara subagentes independentes com memória zerada para ler friamente a `spec.md` contra rubricas de qualidade, listando todas as lacunas e contradições. | Relatório de deficiências e riscos (*deficiency report*) |
| **`resolve`** | Elefante + Humano | Retoma a sessão principal para negociar cada apontamento dos peixinhos. O humano aceita, rejeita ou adapta as críticas, e a IA aplica as correções no texto. | `spec.md` revisada e atualizada |
| **`review loop`** | Peixinhos + Elefante | Automatiza a alternância iterativa entre `review` e `resolve` até que todas as pendências críticas sejam sanadas ou o humano autorize o avanço. | Especificação técnica aprovada para codificação |
| **`drift report`** | Subagente de Auditoria | Executado após a codificação: compara a árvore de alterações do Git (*diff*) contra a `spec.md` aprovada para garantir que nenhum código não planejado foi inserido. | Relatório de desvio de escopo (*spec drift*) |

---

### Framework 2: Rubrica de Auditoria Fria dos Peixinhos

Quando o comando `review` é acionado, os subagentes peixinho avaliam a especificação segundo quatro pilares rigorosos de auditoria:

1. **Clareza de Contratos de Interface:**
   - As assinaturas de métodos, endpoints de API (*Application Programming Interface* - Interface de Programação de Aplicações) e modelos de dados estão explicitados sem ambiguidades?
   - Os tipos primitivos, formatos de payload e códigos de status HTTP estão documentados?

2. **Mapeamento de Falhas e Casos de Borda (*Edge Cases*):**
   - A especificação prevê o comportamento exato em caso de falha de banco de dados, timeout de rede ou entrada de dados inválida?
   - O fluxo de reversão de transações (*rollback*) foi projetado?

3. **Premissas Não Declaradas (*Hidden Assumptions*):**
   - O documento presume a existência de variáveis de ambiente, serviços auxiliares ou permissões sem explicitá-las formalmente?

4. **Compatibilidade com o Repositório:**
   - As alterações propostas respeitam as convenções de código, versionamento de bibliotecas e esteira de CI/CD (*Continuous Integration / Continuous Deployment* - Integração e Entrega Contínuas) já estabelecidas?

---

### Framework 3: Matriz de Decisão: Quando Utilizar o EGM

Nem toda demanda de engenharia de software justifica a sobrecarga operacional de um ciclo completo de especificação. A decisão deve seguir a matriz de complexidade:

| Critério de Avaliação | Fluxo Tradicional / Direto | Fluxo com EGM (Spec-Driven) |
| :--- | :--- | :--- |
| **Tipo de Demanda** | Correção pontual de bug (*hotfix*), alteração cosmética de CSS/UI, ajuste de documentação textual. | Criação de novos módulos, refatoração de regras de negócio, modelagem de banco de dados, arquitetura de microsserviços. |
| **Custo de Falha** | Baixo (facilmente detectável e revertido por testes unitários locais). | Alto (risco de quebra de compatibilidade regressiva, inconsistência transacional ou falha de segurança). |
| **Número de Arquivos Afetados** | 1 a 2 arquivos isolados. | Múltiplos componentes interdependentes no repositório. |
| **Consumo de Tokens / Tempo** | Menor latência imediata, gasto pontual de contexto. | Maior investimento inicial de tokens e tempo de planejamento, com economia substancial na fase de depuração e retrabalho. |

---

## Matriz Comparativa: Vibe Coding vs. EGM

| Dimensão Técnica | Programação por Chat Direto (*Vibe Coding*) | Spec-Driven Development (EGM) |
| :--- | :--- | :--- |
| **Abordagem Primária** | Codificação reativa baseada em prompts pontuais | Planejamento arquitetural formal antes de qualquer código |
| **Papel do Desenvolvedor** | Revisor manual de código gerado em tempo real | Arquiteto de sistemas e árbitro de especificações |
| **Retenção de Contexto** | Memória cumulativa contínua sujeita a viés e complacência | Separação deliberada entre memória de design e auditoria sem memória |
| **Qualidade da Especificação** | Informal, volátil e perdida no histórico do chat | Documento Markdown perene, versionado no Git (`spec.md`) |
| **Detecção de Falhas** | Em tempo de execução ou após commits defeituosos | Em tempo de design, antes de gerar uma única linha de código |
| **Prevenção de Alucinação** | Baixa; o modelo tenta preencher dúvidas chutando soluções | Alta; peixinhos forçam o modelo a sanar dúvidas na especificação |
| **Controle de Escopo** | Suscetível a código desnecessário e deriva funcional | Auditado matematicamente pós-código via `drift report` |

---

## Regras Práticas de Engenharia com EGM

1. **Nunca permita que o Elefante programe durante a fase de concepção:**
   - Se o modelo sugerir blocos extensos de código durante o `brainstorm` ou o `draft`, ordene explicitamente: *"Permaneça no design. Substitua implementações por assinaturas de contratos e descrições conceituais no documento de especificação"*.

2. **Aja como juiz, não como espectador das revisões:**
   - Os subagentes peixinho emitirão críticas severas. Algumas serão pertinentes e fundamentais; outras serão desnecessárias ou fora do escopo prático. Cabe ao desenvolvedor humano arbitrar no comando `resolve` quais apontamentos geram alterações reais na `spec.md`.

3. **Mantenha a especificação técnica dentro do controle de versão:**
   - O arquivo gerado (`spec.md` ou equivalente em subpasta como `.egm/` ou `docs/specs/`) deve ser commitado no Git junto com o código final. Ele serve como documentação de arquitetura perene para o time e para futuras sessões de IA.

4. **Execute o `drift report` antes de abrir o Pull Request:**
   - Antes de considerar a tarefa finalizada, rode a verificação de desvio para identificar se o agente adicionou dependências não solicitadas, alterou configurações globais desnecessárias ou esqueceu algum requisito aprovado no contrato original.

---

## Conexões no Segundo Cérebro

- [[00_Inbox/Capturas Rápidas|Capturas Rápidas]] — Registro de novas ideias de automação e ferramentas de produtividade para desenvolvimento.
- [[03_Resources/Como Aprender Qualquer Coisa Sozinho|Como Aprender Qualquer Coisa Sozinho]] — Aplicação prática de aprendizado ativo e filtragem deliberada de ruídos cognitivos no desenvolvimento técnico.
