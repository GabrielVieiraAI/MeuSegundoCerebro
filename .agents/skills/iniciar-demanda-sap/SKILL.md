---
name: iniciar-demanda-sap
description: >-
  Etapa 1 do Processo de Desenvolvimento de Demandas SAP. Cria a estrutura de 4 macro-pastas da demanda,
  organiza os anexos brutos (PowerPoint/DPS e planilhas) em Anexos/ e extrai a especificação funcional
  em alto nível estruturada nos 6 pilares essenciais dentro de Especificacao/.
  Ativada quando o usuário usar o comando `/iniciar-demanda-sap`.
---

# Skill: Iniciar Demanda SAP (`/iniciar-demanda-sap`)

Esta skill executa exclusivamente o pontapé inicial (**Etapa 1 — Especificação**) do [[Processo de Desenvolvimento de Demandas]].

---

## 1. Portão de Aprovação Obrigatório (Explicar antes de Executar)

1. **Primeiro Passo (Análise e Explicação no Chat):**
   * Leia o PowerPoint (`.pptx`) ou documento da demanda informado pelo usuário (seja anexado no chat ou localizado no workspace).
   * Responda no chat explicando de forma direta o que você entendeu que precisa fazer:
     * Um resumo de 1 parágrafo do que você identificou no DPS (ID do delta, nome, quantidade de slides e objetivo central).
     * O caminho da pasta da demanda em `01_Projects/Insi/<Empresa>/<ID_DEMANDA> - <Nome da Demanda>/` e a estrutura das 4 macro-pastas que será criada.
     * Quais arquivos brutos serão copiados ou movidos para `01 - Requisitos e Negocio/Anexos/` (identificando se o PowerPoint veio via upload no chat ou já está em disco).
     * A nota unificada que será criada dentro de `01 - Requisitos e Negocio/Especificacao/01 - Especificação Funcional (Visão da Solução).md` estruturada nos 6 pilares essenciais.
   * **Não crie nem mova nenhum arquivo antes da autorização do usuário.**
2. **Segundo Passo (Execução após Autorização):**
   * Assim que o usuário autorizar (ou pedir ajustes), execute os passos da Seção 2 abaixo.

---

## 2. Escopo Exato de Execução

### Passo 1: Criar a Estrutura Completa de Pastas
Dentro de `01_Projects/Insi/<Empresa>/<ID_DEMANDA> - <Nome da Demanda>/` (reutilizando a pasta raiz caso já exista), crie toda a árvore de diretórios:
```text
<ID_DEMANDA> - <Nome da Demanda>/
├── 01 - Requisitos e Negocio/
│   ├── Anexos/
│   ├── Especificacao/
│   └── Reunioes/
├── 02 - Arquitetura e Design/
│   └── Imagens/
├── 03 - Guias de Execucao/
└── 04 - Objetos Tecnicos/
```

### Passo 2: Organizar os Anexos
Garanta que todos os arquivos brutos fornecidos fiquem arquivados dentro de `01 - Requisitos e Negocio/Anexos/`:
* **Arquivo Anexado via Chat (Upload):** Se o usuário tiver anexado/feito upload do PowerPoint (`.pptx`) ou planilhas diretamente no chat (arquivos na sessão/`.user_uploaded`), copie o arquivo para `01 - Requisitos e Negocio/Anexos/`, salvando-o com o nome padronizado da demanda (ex.: `<ID_DEMANDA> - <Nome da Demanda>.pptx` ou com o nome original).
* **Arquivo Existente no Workspace/Disco:** Se o arquivo já estiver presente no workspace ou solto na pasta da demanda/raiz do projeto, mova-o para `01 - Requisitos e Negocio/Anexos/`.
* **Garantia Obrigatória:** A pasta `Anexos/` **nunca** deve ficar vazia se um PowerPoint ou documento de especificação foi fornecido pelo usuário.

### Passo 3: Extrair a Nota de `Especificacao/`
Analise a apresentação PowerPoint (`.pptx`) do Desenho de Proposta de Solução (DPS) e gere a especificação funcional unificada, limpa e de alto nível em `01 - Requisitos e Negocio/Especificacao/01 - Especificação Funcional (Visão da Solução).md`:

#### Público-Alvo e Tom do Documento
O documento gerado deve ser escrito em **linguagem técnica de alto nível, clara e acessível**, servindo como fonte única da verdade para três públicos:
1. **Desenvolvedores ABAP:** Para compreender com clareza o que construir, os limites do escopo e as regras que o código deve seguir.
2. **Consultores Funcionais:** Para validar se todos os requisitos e regras contábeis/negociais foram mapeados com precisão.
3. **Key Users (Usuários-Chave):** Para entender a solução, como a operação diária será impactada e validar o comportamento esperado.

#### Estrutura Obrigatória da Nota Gerada (Os 6 Pilares)
O arquivo gerado deve conter exclusivamente as 6 seções abaixo, sem sumários prolixos, sem termos de aceite e sem ruído burocrático:

1. **Contexto do Cliente (O que a demanda soluciona):**
   * Descreva a dor real do negócio, o modelo operacional da empresa/cooperativa e o problema prático que motivou essa demanda.
   * Citar a fonte: `(Slide X)`.
2. **O que precisa ser criado com Desenvolvimento ABAP:**
   * Comece informando de forma direta **quantos e quais aplicativos/programas precisam ser criados** na demanda (ex.: *"Nesta demanda, é necessário criar 2 aplicativos SAP Fiori..."*).
   * Evite textos densos ou jargões embolados. Divida a explicação em subtópicos claros **por aplicativo/entregável**, detalhando para cada um:
     * **Quem usa:** Qual área ou perfil opera aquele aplicativo;
     * **Qual é a função do app:** O que ele faz na prática, passo a passo, em linguagem simples;
     * **Regras de negócio aplicadas a este app:** Resumo claro das regras e comportamentos que aquele aplicativo específico precisa obedecer e validar.
   * Citar a fonte: `(Slide X)`.
3. **Escopo Negativo (Limites da Solução):**
   * Liste com máxima clareza o que o programa **explicitamente NÃO faz** (ex.: não calcula impostos, não rateia percentuais automaticamente, não faz estorno em massa).
   * **Finalidade:** Alinhar expectativas de key users e blindar o desenvolvedor contra cobranças indevidas de escopo invisível.
   * Citar a fonte: `(Slide X)`.
4. **Regras de Negócio e Dados:**
   * Consolide todas as regras funcionais que o código precisa executar:
     * Regras de validação linha a linha e condições cadastrais;
     * Mecanismos de derivação automática (tabelas de regras, tipos de movimento);
     * Bloqueios de pagamento, códigos de razão especial e contas contábeis;
     * Layout de campos de entrada/saída (colunas do arquivo ou da tela, tipos de dados e obrigatoriedade);
     * Tratamento de erros e permissão de processamento parcial.
   * Citar a fonte de cada regra individualmente: `(Slide X)`.
5. **Cenários de Testes:**
   * Transcreva os cenários de teste documentados no DPS para homologação da solução (cenários de sucesso, validações de erro, regressão e autorizações).
   * Citar a fonte: `(Slide X)`.
6. **Lacunas, Dúvidas e Ambiguidades:**
   * Seção obrigatória que compila todos os pontos que o PowerPoint **não respondeu**, deixou vago, contraditório ou com premissas provisórias (ex.: perguntas a validar com o cliente).
   * Cada ponto deve conter a dúvida exata e o slide onde o tema foi mencionado: `(Slide X)`.
   * **Finalidade:** Servir de pauta imediata para a reunião com o consultor funcional.

#### Travas de Segurança da IA (Guardrails e Rastreabilidade)
* **Proibição Absoluta de Suposição ou Inferência:** A IA **não pode inventar** regras de negócio, dados mestres, contas ou cálculos. Traga estritamente o que estiver escrito no material original.
* **Citação Obrigatória de Slides:** Todas as regras, limitações, cenários ou afirmações **devem carregar a menção do slide de origem**, seja no início ou no fim do parágrafo/item: `(Slide X)`.
* **Tratamento de Incompletudes:** Se uma informação for vaga ou estiver em aberto no DPS, a IA não deve preencher a resposta; deve registrá-la obrigatoriamente no pilar **6. Lacunas, Dúvidas e Ambiguidades**.
* **Linguagem Técnica Acessível:** Ao citar qualquer sigla técnica pela primeira vez (ex.: *RAP*, *BAPI*, *CME*, *BP*, *OData*), descreva-a por extenso com uma breve explicação acessível.
* **Proibição de Diagramas Mermaid:** É terminantemente proibido o uso de blocos ````mermaid````. Empregue tabelas Markdown ou referencie links de desenhos Excalidraw (`[[Nome.excalidraw]]`).
* **Compatibilidade com Dataview:** Nunca utilize seletores inline isolados entre crases como `` `=>` ``. Use sempre em negrito (**`**=>**`**) ou com escape para evitar erro de parsing.

### Passo 4: Parar na Etapa 1
* Não crie nenhuma nota dentro de `Reunioes/`, `02 - Arquitetura e Design/`, `03 - Guias de Execucao/` ou `04 - Objetos Tecnicos/`.
