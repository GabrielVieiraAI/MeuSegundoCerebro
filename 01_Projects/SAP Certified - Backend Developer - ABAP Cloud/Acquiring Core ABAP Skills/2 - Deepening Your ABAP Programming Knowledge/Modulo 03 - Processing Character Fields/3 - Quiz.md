---
title: "Quiz - Processing Character Fields"
source: "https://learning.sap.com/courses/deepening-your-abap-programming-knowledge/processing-character-fields_quiz"
created: 2026-11-03
tags:
  - sap
  - abap
  - abap-cloud
  - quiz
  - strings
  - regex
  - i18n
---
**Roteiro de Estudos Relacionado:** [[Roteiro de Estudos SAP]]

# SAP Learning - Deepening Your ABAP Programming Knowledge
## Quiz: Processing Character Fields

> [!NOTE] Instruções de Estudo Ativo
> Tente resolver cada uma das questões antes de abrir o bloco retrátil contendo o gabarito oficial e a explicação conceitual.

---

### Pergunta 1
**Quantos caracteres alfanuméricos compõem, obrigatoriamente, a chave identificadora de um Símbolo de Texto (*Text Symbol / Text Element*) no Text Pool de uma classe ou programa ABAP?**

- **A.** 1 caractere
- **B.** 2 caracteres
- **C.** 3 caracteres
- **D.** Até 10 caracteres

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **C**  
> **Fundamentação Técnica:** No SAP ABAP, todo símbolo de texto cadastrado no *Text Pool* é indexado por um ID fixo de **3 caracteres alfanuméricos** (por exemplo: `001`, `002`, `A01`, `ERR`). No código, ele pode ser referenciado como `TEXT-001` ou com a sintaxe recomendada `'Texto Literal Padrão'(001)`.

---

### Pergunta 2
**Ao realizar uma auditoria de código com o ABAP Test Cockpit (ATC), o sistema sinaliza com aviso de qualidade (*finding*) um literal de texto técnico fixo (por exemplo, uma constante de status `'ACTV'` ou uma URL). Como o desenvolvedor deve proceder no ABAP Cloud para indicar que esse literal não deve ser traduzido, eliminando o aviso?**

- **A.** Inserir o pseudo-comentário `"#EC NOTEXT` após o ponto final da linha.
- **B.** Adicionar o Pragma `##NO_TEXT` antes do ponto final da instrução.
- **C.** Declarar a variável como `TYPE n`.
- **D.** Alterar o idioma original do programa para inglês.

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **B**  
> **Fundamentação Técnica:** No desenvolvimento ABAP contemporâneo, a supressão oficial e padronizada para literais técnicos não traduzíveis é realizada através do Pragma **`##NO_TEXT`**, inserido imediatamente antes do ponto final (`.`) da linha de código. Pseudo-comentários com `"#EC` são considerados obsoletos no ABAP Cloud.

---

### Pergunta 3
**Qual é o valor retornado pela função de descrição embutida `find( val = lv_source sub = lv_target )` caso a substring informada no parâmetro `sub` NÃO exista dentro da cadeia `val`?**

- **A.** `0`
- **B.** `4`
- **C.** `NULL`
- **D.** `-1`

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **D**  
> **Fundamentação Técnica:** A função `find( )` utiliza indexação baseada em zero (onde `0` representa o primeiro caractere da cadeia). Portanto, para indicar com precisão que a substring pesquisada não foi localizada, a função retorna o valor numérico inteiro **`-1`**.

---

### Pergunta 4
**Ao avaliar o comprimento de uma cadeia com a função embutida `strlen( val )`, como a função se comporta ao receber uma variável de tamanho fixo `TYPE c LENGTH 20` contendo a palavra `'SAP'` seguida por 17 espaços em branco?**

- **A.** Retorna 20, pois conta todos os bytes alocados na memória física.
- **B.** Retorna 3, pois a função `strlen` desconsidera automaticamente os espaços em branco à direita (*trailing blanks*) em tipos `C`.
- **C.** Dispara a exceção `CX_SY_CONVERSION_DATA_LOSS`.
- **D.** Retorna 0, pois a variável possui espaços em branco.

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **B**  
> **Fundamentação Técnica:** Em campos de texto de comprimento fixo (tipo `C`), o kernel do ABAP preenche automaticamente as posições restantes com espaços em branco. A função `strlen( )` ignora esses espaços em branco à direita em tipos `C`, retornando apenas o comprimento da parte útil do texto (`3`). Caso a variável fosse do tipo dinâmico `STRING`, eventuais espaços explícitos no final seriam contabilizados.

---

### Pergunta 5
**Qual das seguintes funções lógicas/relacionais deve ser utilizada para verificar se o conteúdo de uma string obedece integralmente a uma regra de formato definida por uma Expressão Regular (Regex)?**

- **A.** `contains( )`
- **B.** `count( )`
- **C.** `matches( )`
- **D.** `substring( )`

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **C**  
> **Fundamentação Técnica:** A função relacional **`matches( val = ... pcre = ... )`** avalia a cadeia de entrada contra um padrão de expressão regular e retorna um valor booleano (`abap_true` ou `abap_false`). Ela exige que a string inteira obedeça à regra especificada, sendo ideal para validação de e-mails, CEPs e códigos fiscais.

---

### Pergunta 6
**Qual biblioteca e padrão formal de Expressões Regulares foi adotado pelo kernel do SAP S/4HANA e ABAP Cloud para substituir a sintaxe legada baseada no padrão POSIX?**

- **A.** Java Regex Framework
- **B.** PCRE (Perl Compatible Regular Expressions / biblioteca PCRE2)
- **C.** XSD Regex Engine
- **D.** OpenSQL Like Engine

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **B**  
> **Fundamentação Técnica:** As versões modernas do ABAP utilizam a biblioteca **PCRE2**, tornando o padrão **PCRE (Perl Compatible Regular Expressions)** o padrão oficial do ecossistema SAP. Nos parâmetros de funções e instruções ABAP, utiliza-se a adição **`pcre = ...`**, garantindo alta velocidade de compilação e compatibilidade com padrões mundiais de regex.

---

### Pergunta 7
**Ao processar um volume massivo de dezenas de milhares de registros em um loop, qual estratégia orientada a objetos é recomendada para aplicar uma expressão regular sem sobrecarregar a CPU com recompilações contínuas do mesmo padrão?**

- **A.** Utilizar a instrução procedural `SEARCH ... FOR ...`.
- **B.** Compilar a expressão regular uma única vez fora do loop com a classe `CL_ABAP_REGEX` e aplicar a validação nos registros usando a classe `CL_ABAP_MATCHER`.
- **C.** Chamar a função `matches( )` com `case = abap_false`.
- **D.** Converter a string para o tipo `XSTRING`.

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **B**  
> **Fundamentação Técnica:** Chamar funções embutidas de regex repetidamente dentro de um loop força o sistema a interpretar e compilar o padrão para cada iteração. A prática recomendada de alta performance é instanciar **`CL_ABAP_REGEX`** uma única vez antes do loop para compilar o padrão em memória e, dentro do loop, utilizar **`CL_ABAP_MATCHER`** para executar a correspondência imediata com máxima eficiência.

---

### Pergunta 8
**No ciclo de transporte e tradução de sistemas SAP, quais são as duas transações clássicas padrão empregadas, respectivamente, para (1) traduzir os textos e símbolos de um objeto para outros idiomas e (2) agrupar essas traduções em uma Ordem de Transporte (*Transport Request*)?**

- **A.** `SE38` e `SE10`
- **B.** `SE63` e `SLXT`
- **C.** `ST05` e `ST22`
- **D.** `SICF` e `STRUST`

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **B**  
> **Fundamentação Técnica:** A transação **`SE63`** é a ferramenta de tradução padrão da SAP utilizada para traduzir *text pools*, elementos de dados e objetos de repositório. A transação **`SLXT`** (*Translation Transport*) é o utilitário que coleta todas as traduções geradas em um determinado período e as empacota em uma ordem de transporte (Workbench Request) para distribuição aos demais ambientes da paisagem.
