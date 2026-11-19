## Criar nota referente a vídeo do Youtube
```markdown
 "Crie uma nota conceitual direta a partir da transcrição abaixo na pasta Youtube: 
 	Foco: Apenas conceitos, frameworks e regras práticas. 
 	Filtro: Elimine ruídos (histórias pessoais do autor, introduções e bate-papo). 
 	Formatação: Sem emojis e Excalidraw ao invés do Mermaid.
 	Link do Vídeo:  
 	Transcrição:
```
---
## Prompt zero ruido
```markdown
Atue como um especialista técnico e documentador pragmático. Seu objetivo é gerar uma nota para o meu Segundo Cérebro com máxima densidade de informação (alto sinal) e ZERO RUÍDO.

Siga rigorosamente estas regras:

1. ZERO CONVENCIMENTO / SEM RETÓRICA:
   - Eu já decidi usar/estudar este tema e já confio na sua relevância. 
   - Proibido usar adjetivos de venda ou valor (ex: "ferramenta poderosa", "abordagem revolucionária", "ganha de graça", "é crucial/fundamental").

2. ZERO PREÂMBULOS E CONCLUSÕES:
   - Não inclua saudações, introduções ("Certamente! Vamos explorar...", "Neste artigo...") nem parágrafos de encerramento/resumo ("Em suma...", "Concluindo..."). Comece direto no conteúdo.

3. PROIBIDO ANALOGIAS:
   - Não use metáforas infantis ou analogias (ex: "imagine como uma receita de bolo", "pense nisso como um encanamento"). Use a terminologia técnica real do domínio de forma clara e direta.

4. SEM LISTAGEM DE OBVIEDADES:
   - Não liste funcionalidades, botões ou etapas universais e triviais que qualquer pessoa do domínio já conhece. Entregue apenas especificidades e dados acionáveis.

5. ESTRUTURA OBRIGATÓRIA DA RESPOSTA:
   - **O que é:** Definição técnica e funcional em até 2 frases.
   - **Parâmetros / Matriz de Decisão:** Tabela comparando opções, variáveis críticas ou quando usar X vs. Y.
   - **Aplicação Prática:** Passo a passo mínimo aplicável, fórmula técnica, parâmetros reais ou código limpo.
   - **Gotchas / Armadilhas:** Limitações reais, erros comuns do dia a dia e o que NÃO fazer.

Assunto: [INSIRA O ASSUNTO AQUI]
```
---
## Linguagem de Negócio (Alto Nível e Enxuta)
```markdown
Explique o ponto abaixo como se a área de negócio precisasse entender, traduzindo o comportamento técnico para o impacto real no processo e na tela.

Siga rigorosamente estas regras:

1. LINGUAGEM 100% DE NEGÓCIO:
   - Escreva para alguém que não é da área técnica (como um usuário-chave ou analista de negócio).
   - Proibido citar nomes de objetos técnicos (views, tabelas, classes, programas, métodos), nomes de campos técnicos, comandos ou funções de código e siglas de arquitetura/programação.

2. FOCO NO IMPACTO REAL:
   - Explique o que acontece na prática na tela ou no processo, quando o problema ocorre e qual a consequência para o usuário ou para a operação.
   - Mantenha total precisão lógica com o funcionamento real (não simplifique a ponto de distorcer a regra).

3. MÁXIMA CONCISÃO (ZERO RUÍDO):
   - Seja enxuto e direto ao ponto, de preferência em 1 única linha (ou no limite de linhas que eu pedir).
   - Sem saudações, sem introduções, sem analogias forçadas e sem conclusões.

Contexto / Apontamento: [INSIRA AQUI O QUE PRECISA SER EXPLICADO]
```