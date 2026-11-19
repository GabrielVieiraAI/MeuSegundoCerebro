---
tags: [inbox, quick-capture]
status: draft
---
# 📥 Capturas Rápidas
## 💻 Tecnologia & Estudos 
- [ ] Estudar princípios fundamentais de IA (ordem de prioridade):
	- [ ] **1. Engenharia de Contexto (*Context Engineering*) e Janela de Contexto:** selecionar, estruturar e filtrar o que entra na memória de trabalho do modelo, gerenciando *tokens* e evitando degradação de atenção (*Lost in the Middle*).
		- *Pesquisa YouTube:* `"Context Engineering for AI Agents"`, `"Context Engineering vs Prompt Engineering"`, `"Lost in the Middle LLM"`, `"Context Rot LLM"`, `"Managing context window in AI agents"`.
	- [ ] **2. Avaliação Sistemática (*Evals*):** criar testes objetivos e repetíveis para medir qualidade e evitar regressões ao alterar *skills*, *prompts* ou modelos.
		- *Pesquisa YouTube:* `"LLM Evals explained"`, `"Building AI Evals from scratch"`, `"Evaluating AI Agents"`, `"LLM as a judge limitations"`.
	- [ ] **3. Arquitetura de Agentes, *Workflows* e *Tool Calling*:** distinguir fluxos determinísticos de agentes autônomos e dominar chamada de ferramentas via **MCP** (*Model Context Protocol*).
		- *Pesquisa YouTube:* `"Building Effective Agents Anthropic"`, `"AI Workflows vs AI Agents"`, `"Model Context Protocol architecture"`, `"LLM Tool Calling patterns"`.
	- [ ] **4. RAG (*Retrieval-Augmented Generation*) e Busca Híbrida:** *chunking* (divisão de textos em blocos), *embeddings* (representação numérica de significado) e recuperação de trechos relevantes da base de conhecimento.
		- *Pesquisa YouTube:* `"RAG from scratch"`, `"Chunking strategies RAG"`, `"Hybrid Search RAG embeddings"`, `"Vector embeddings explained visually"`.
	- [ ] **5. Mecânica Probabilística de LLMs (*Large Language Models*):** previsão do próximo *token*, *temperatura* e saídas estruturadas (*Structured Outputs*).
		- *Pesquisa YouTube:* `"How Large Language Models work"`, `"LLM temperature sampling explained"`, `"Structured Outputs JSON Schema LLM"`, `"Why LLMs hallucinate"`.
	- [ ] **6. Mecanismo de Atenção e Arquitetura *Transformer*:** base arquitetural de relacionamento entre palavras e crescimento de custo computacional conforme o tamanho do contexto.
		- *Pesquisa YouTube:* `"Attention in transformers visually explained"`, `"3Blue1Brown Transformers"`, `"How attention mechanism works"`.
- [ ] Estudar metodologias de fluxo e engenharia de processos:
	- [ ] **Shift-Left Testing & Eval-Driven Development:** trazer a definição de critérios de teste e avaliação (*evals*) para o início do fluxo (junto da especificação), antes da construção.
		- *Pesquisa YouTube:* `"Shift Left Testing explained"`, `"Eval Driven Development AI"`.
	- [ ] **Spec-Driven Development:** usar a especificação como contrato verificável que define a transformação antes de escrever código.
		- *Pesquisa YouTube:* `"Spec Driven Development AI"`.
	- [ ] **The Algorithm (SpaceX / Tesla) & Value Stream Mapping (VSM):** método de 5 passos (questionar requisitos, deletar etapas, simplificar, acelerar ciclo e automatizar por último) e mapeamento de gargalos.
		- *Pesquisa YouTube:* `"Elon Musk 5 step algorithm engineering"`, `"Value Stream Mapping explained"`.
- [ ] **Referência Salva — Fluxo de Trabalho (Anthropic & OpenAI):**
	1. **Context Engineering (Contexto da demanda):** reunir e limpar apenas o contexto de alto sinal necessário.
	2. **Spec-Driven (Transformação):** definir em especificação clara e verificável o que de fato será construído.
	3. **Eval-Driven (Avaliação e Teste) → Produto:** validar continuamente com critérios objetivos de avaliação e teste até a entrega do produto final.
- [ ] Criar uma nota detalhada de como realizar a publicação de um serviço **OData** através do **SAP GUI**.
- [ ] Criar uma nota explicando todo o ciclo de desenvolvimento de um app fiori. visto que já foi publicado 2.
- [ ] Estudar as transações indispensáveis do desenvolvedor sênior mapeadas na nota [[Transacoes SAP - Principais Transacoes|Transações SAP – Guia das Principais Transações (TCodes)]]
- [ ] Atualizar as *skills* e templates do repositório SAP (`implementar-demanda-sap`, `gerar-guia-code-review-sap`, `gerar-guia-atualizacao-sap`, `arquitetar-demanda-sap` e `Template_Objeto_Tecnico.md`) para adotar o ambiente **DEV** (*Development* — Desenvolvimento) do cliente como fonte única da verdade para código-fonte:
	- **Antes de existir no DEV:** a nota em `04 - Objetos Tecnicos/` mantém os blocos de código (`📝 Código Comentado` e `🚀 Código Limpo`) para viabilizar a criação inicial.
	- Pesquisar se existe outras skills que dependem do código do objeto técnico para funcionar.
	- **Após o objeto existir no DEV:** remover automaticamente da nota no Obsidian todos os trechos de código (tanto o código comentado/explicativo quanto o código limpo de copiar e colar), evitando que a **IA** (*Inteligência Artificial*) consulte código desatualizado quando alterações forem feitas diretamente no SAP sem espelhamento no cofre.
	- **O que permanece no Obsidian:** apenas as seções que não citam código (Visão Geral, Regras de Negócio, Metadados **ADT** — *ABAP Development Tools* — e orientações de criação/manutenção).
---
## Tarefas de Casa
- [ ] Lavar o carro
- [ ] Concertar painel do carro
- [ ] Pesquisar como deixar pano de prato branco novamente
- [ ] Pesquisar como remover mancha do piso com facilidade