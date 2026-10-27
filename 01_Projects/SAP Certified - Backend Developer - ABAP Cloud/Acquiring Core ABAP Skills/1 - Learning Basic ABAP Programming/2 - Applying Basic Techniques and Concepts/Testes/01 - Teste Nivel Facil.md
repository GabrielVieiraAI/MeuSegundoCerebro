---
tipo: teste-notebooklm
tags:
  - sap
  - abap
  - abap-cloud
  - teste
modulo: 2
dificuldade: facil
tentativa: 1
score: 0%
aprovado: false
data: 2026-10-26
---

# 📝 Bateria de Teste: Nível Fácil - Módulo 2 (Applying Basic Techniques and Concepts)

> [!NOTE] Instruções de Estudo Ativo
> Este teste avalia o conhecimento direto de **sintaxe fundamental, tipos de dados básicos, comandos essenciais e atalhos de depuração** do módulo 2.  
> Responda a todas as 10 questões mentalmente ou marcando as alternativas antes de expandir o bloco de gabarito.  
> **Meta para aprovação:** ≥ 90% de acertos (mínimo de 9 em 10 questões).

---

### Questão 1
Qual sinal gráfico de pontuação é **estritamente obrigatório** para indicar o encerramento de qualquer instrução (*statement*) na linguagem ABAP?

- **A.** Ponto e vírgula (`;`)
- **B.** Dois-pontos (`:`)
- **C.** Ponto final (`.`)
- **D.** Barra invertida (`\`)

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **C**  
> **Conceito:** No ABAP, toda instrução individual deve ser obrigatoriamente finalizada com um ponto final (`.`). O ponto e vírgula (`;`) não existe para finalização de instruções em ABAP, e os dois-pontos (`:`) são utilizados apenas para encadeamento de comandos repetidos (*chained statements*).

---

### Questão 2
Ao tentar compilar o código abaixo no Eclipse ADT (*ABAP Development Tools* — a IDE oficial de desenvolvimento ABAP), o compilador acusou um erro de sintaxe:

```abap
lv_resultado = lv_valor1+lv_valor2.
```

Qual é a causa do erro de compilação?

- **A.** O ABAP não permite soma direta de variáveis sem a instrução `ADD`
- **B.** Faltam espaços em branco obrigatórios antes e depois do operador `+`
- **C.** O ponto final não pode ser precedido por um identificador
- **D.** Variáveis numéricas não podem ser somadas na mesma linha de declaração

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **B**  
> **Conceito:** O compilador ABAP exige obrigatoriamente espaços em branco separando operadores (como `=`, `+`, `-`, `*`, `/`), parênteses e identificadores. A forma correta aceita pela sintaxe é `lv_resultado = lv_valor1 + lv_valor2.`.

---

### Questão 3
Quais dos seguintes caracteres podem ser utilizados para transformar linhas em **comentários** no código-fonte ABAP? (Escolha duas opções)

- **A.** `//` em qualquer coluna da linha
- **B.** `*` obrigatoriamente na primeira coluna da linha
- **C.** `--` antes do texto
- **D.** `"` em qualquer posição da linha (comentando até o final dela)

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **B, D**  
> **Conceito:** No ABAP, um asterisco (`*`) na primeira coluna transforma toda a linha em comentário. As aspas duplas (`"`) podem ser colocadas em qualquer posição da linha, comentando tudo à sua direita até o final daquela linha.

---

### Questão 4
No Eclipse ADT, qual tecla de atalho é utilizada para executar a ferramenta **Pretty Printer**, responsável por padronizar automaticamente as palavras-chave em maiúsculas e alinhar a indentação do código?

- **A.** Shift + F1
- **B.** Ctrl + Shift + F
- **C.** Ctrl + F3
- **D.** F8

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **A**  
> **Conceito:** O atalho **Shift + F1** executa o *Pretty Printer* no Eclipse ADT. O atalho `Ctrl + F3` ativa o objeto, e `Ctrl + Shift + F` é utilizado em outras linguagens, mas não no ADT.

---

### Questão 5
Qual das seguintes categorias de objetos de dados é definida com um valor fixo no código-fonte e **nunca pode ter seu conteúdo modificado** durante o tempo de execução (*runtime*)?

- **A.** Variáveis (`DATA`)
- **B.** Constantes (`CONSTANTS`)
- **C.** Tabelas Internas (`DATA ... TYPE TABLE OF`)
- **D.** Parâmetros do console (`out->write`)

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **B**  
> **Conceito:** Objetos declarados com a palavra-chave `CONSTANTS` possuem valor fixo imutável. Qualquer tentativa de atribuir um novo valor a uma constante gera erro imediato de compilação.

---

### Questão 6
Considere a declaração de variável abaixo:

```abap
DATA lv_status TYPE c LENGTH 10 VALUE 'PROCESSANDO'.
CLEAR lv_status.
```

Após a execução da instrução `CLEAR`, qual será o conteúdo exato armazenado na variável `lv_status`?

- **A.** O valor nulo (`null`)
- **B.** A palavra `'INITIAL'`
- **C.** Uma cadeia de caracteres vazia / espaços em branco (valor inicial do tipo `c`)
- **D.** O programa gera um erro em tempo de execução (*Short Dump*)

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **C**  
> **Conceito:** O comando `CLEAR` restaura a variável ao valor inicial padrão (*initial value*) correspondente ao seu tipo de dado. Para o tipo caractere (`c`), o valor inicial padrão é preenchido com espaços em branco (vazio). O ABAP não utiliza o conceito de ponteiro nulo (`null`) para tipos elementares.

---

### Questão 7
Qual é o operador moderno utilizado na linguagem ABAP para realizar a **concatenação de strings** sem inserir espaços adicionais indesejados?

- **A.** `+`
- **B.** `.`
- **C.** `&&`
- **D.** `CONCAT`

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **C**  
> **Conceito:** O operador **`&&`** é o operador de encadeamento/concatenação de strings em expressões modernas de ABAP (ex: `lv_completo = lv_nome && '_' && lv_sobrenome.`). O sinal de `+` é estritamente aritmético no ABAP.

---

### Questão 8
Qual expressão condicional deve ser empregada para testar se uma variável qualquer contém o seu **valor inicial padrão** (ex: `0` para inteiros, espaço para caracteres ou vazio para strings)?

- **A.** `IF lv_var IS NULL.`
- **B.** `IF lv_var = EMPTY.`
- **C.** `IF lv_var IS INITIAL.`
- **D.** `IF lv_var IS ZERO.`

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **C**  
> **Conceito:** A expressão `IS INITIAL` (e sua negação `IS NOT INITIAL`) é o operador relacional padrão do ABAP para validar se um objeto de dados ainda se encontra no seu estado inicial de declaração.

---

### Questão 9
Qual instrução adiciona um novo registro no **final** de uma tabela interna simples (*Simple Internal Table*) alocada em memória?

- **A.** `INSERT INTO`
- **B.** `APPEND`
- **C.** `PUSH`
- **D.** `ADD LINE`

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **B**  
> **Conceito:** A instrução `APPEND <valor> TO <tabela>.` insere uma nova linha na última posição de uma tabela interna dinâmica na memória RAM.

---

### Questão 10
Durante uma sessão de depuração (*debugging*) no Eclipse ADT, você deseja avançar a execução instrução por instrução. Ao chegar em uma linha que chama um **método**, você deseja **entrar dentro desse método** para acompanhar sua lógica interna. Qual tecla de atalho deve ser pressionada?

- **A.** F6 (Step Over)
- **B.** F5 (Step Into)
- **C.** F7 (Step Return)
- **D.** F8 (Resume)

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **B**  
> **Conceito:** **F5 (Step Into)** executa o código em passo simples e entra dentro de métodos, funções ou sub-rotinas chamadas. A tecla `F6` (Step Over) executaria o método como um bloco único sem entrar no seu código fonte.
