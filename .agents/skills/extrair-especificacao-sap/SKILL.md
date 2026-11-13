---
name: extrair-especificacao-sap
description: >-
  Etapa 1 do Processo de Desenvolvimento de Demandas SAP. Lê a apresentação PowerPoint (DPS) da demanda
  e extrai uma especificação funcional em alto nível voltada para desenvolvedores, consultores e key users,
  estruturada em 6 pilares essenciais com citação obrigatória de slides e zero inferência.
  Ativada pelo comando `/extrair-especificacao-sap`.
---

# Skill: Extrair Especificação SAP (`/extrair-especificacao-sap`)

Esta skill atua na **Etapa 1 — Requisitos e Negócio** do [[Processo de Desenvolvimento de Demandas]]. Ela analisa a apresentação PowerPoint (`.pptx`) do Desenho de Proposta de Solução (DPS) e gera uma especificação funcional unificada, limpa e de alto nível.

---

## 1. Público-Alvo e Tom do Documento

O documento gerado deve ser escrito em **linguagem técnica de alto nível, clara e acessível**, servindo como fonte única da verdade para três públicos:
1. **Desenvolvedores ABAP:** Para compreender com clareza o que construir, os limites do escopo e as regras que o código deve seguir.
2. **Consultores Funcionais:** Para validar se todos os requisitos e regras contábeis/negociais foram mapeados com precisão.
3. **Key Users (Usuários-Chave):** Para entender a solução, como a operação diária será impactada e validar o comportamento esperado.

---

## 2. Portão de Aprovação Obrigatório (Explicar antes de Executar)

1. **Primeiro Passo (Análise Prévia no Chat):**
   * Localize e leia o PowerPoint (`.pptx`) em `01 - Requisitos e Negocio/Anexos/` ou no anexo da sessão.
   * Apresente no chat um resumo direto de 1 parágrafo explicando o que você identificou no DPS (ID do delta, nome, quantidade de slides e objetivo central).
   * Informe ao usuário o caminho do arquivo Markdown que será criado em `01 - Requisitos e Negocio/Especificacao/01 - Especificação Funcional (Visão da Solução).md`.
   * **Não crie o arquivo antes da confirmação do usuário.**
2. **Segundo Passo (Geração após Autorização):**
   * Assim que o usuário autorizar, gere o documento seguindo rigorosamente a estrutura dos 6 pilares abaixo.

---

## 3. Estrutura Obrigatória da Nota Gerada (Os 6 Pilares)

O arquivo gerado deve conter exclusivamente as 6 seções abaixo, sem sumários prolixos, sem termos de aceite e sem ruído burocrático:

### 1. Contexto do Cliente (O que a demanda soluciona)
* Descreva a dor real do negócio, o modelo operacional da empresa/cooperativa e o problema prático que motivou essa demanda.
* Citar a fonte: `(Slide X)`.

### 2. O que precisa ser criado com Desenvolvimento ABAP
* Comece informando de forma direta **quantos e quais aplicativos/programas precisam ser criados** na demanda (ex.: *"Nesta demanda, é necessário criar 2 aplicativos SAP Fiori..."*).
* Evite textos densos ou jargões embolados. Divida a explicação em subtópicos claros **por aplicativo/entregável**, detalhando para cada um:
  * **Quem usa:** Qual área ou perfil opera aquele aplicativo;
  * **Qual é a função do app:** O que ele faz na prática, passo a passo, em linguagem simples;
  * **Regras de negócio aplicadas a este app:** Resumo claro das regras e comportamentos que aquele aplicativo específico precisa obedecer e validar.
* Citar a fonte: `(Slide X)`.

### 3. Escopo Negativo (Limites da Solução)
* Liste com máxima clareza o que o programa **explicitamente NÃO faz** (ex.: não calcula impostos, não rateia percentuais automaticamente, não faz estorno em massa).
* **Finalidade:** Alinhar expectativas de key users e blindar o desenvolvedor contra cobranças indevidas de escopo invisível.
* Citar a fonte: `(Slide X)`.

### 4. Regras de Negócio e Dados
* Consolide todas as regras funcionais que o código precisa executar:
  * Regras de validação linha a linha e condições cadastrais;
  * Mecanismos de derivação automática (tabelas de regras, tipos de movimento);
  * Bloqueios de pagamento, códigos de razão especial e contas contábeis;
  * Layout de campos de entrada/saída (colunas do arquivo ou da tela, tipos de dados e obrigatoriedade);
  * Tratamento de erros e permissão de processamento parcial.
* Citar a fonte de cada regra individualmente: `(Slide X)`.

### 5. Cenários de Testes
* Transcreva os cenários de teste documentados no DPS para homologação da solução (cenários de sucesso, validações de erro, regressão e autorizações).
* Citar a fonte: `(Slide X)`.

### 6. Lacunas, Dúvidas e Ambiguidades
* Seção obrigatória que compila todos os pontos que o PowerPoint **não respondeu**, deixou vago, contraditório ou com premissas provisórias (ex.: perguntas a validar com o cliente).
* Cada ponto deve conter a dúvida exata e o slide onde o tema foi mencionado: `(Slide X)`.
* **Finalidade:** Servir de pauta imediata para a reunião com o consultor funcional.

---

## 4. Travas de Segurança da IA (Guardrails e Rastreabilidade)

* **Proibição Absoluta de Suposição ou Inferência:** A IA **não pode inventar** regras de negócio, dados mestres, contas ou cálculos. Traga estritamente o que estiver escrito no material original.
* **Citação Obrigatória de Slides:** Todas as regras, limitações, cenários ou afirmações **devem carregar a menção do slide de origem**, seja no início ou no fim do parágrafo/item: `(Slide X)`.
* **Tratamento de Incompletudes:** Se uma informação for vaga ou estiver em aberto no DPS, a IA não deve preencher a resposta; deve registrá-la obrigatoriamente no pilar **6. Lacunas, Dúvidas e Ambiguidades**.
* **Linguagem Técnica Acessível:** Ao citar qualquer sigla técnica pela primeira vez (ex.: *RAP*, *BAPI*, *CME*, *BP*, *OData*), descreva-a por extenso com uma breve explicação acessível.
* **Proibição de Diagramas Mermaid:** É terminantemente proibido o uso de blocos ````mermaid````. Empregue tabelas Markdown ou referencie links de desenhos Excalidraw (`[[Nome.excalidraw]]`).
* **Compatibilidade com Dataview:** Nunca utilize seletores inline isolados entre crases como `` `=>` ``. Use sempre em negrito (**`**=>**`**) ou com escape para evitar erro de parsing.
