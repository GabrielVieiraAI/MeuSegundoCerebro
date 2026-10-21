---
title: "Quiz - Applying Basic Techniques and Concepts"
source: "https://learning.sap.com/courses/basic-abap-programming/applying-basic-techniques-and-concepts_229d99f1-2c5a-3df4-872e-ca6b16d6567a"
created: 2026-10-20
tags:
  - sap
  - abap
  - abap-cloud
  - adt
  - quiz
---
**Roteiro de Estudos Relacionado:** [[Roteiro de Estudos SAP]]

# SAP Learning - Basic ABAP Programming
## Quiz: Applying Basic Techniques and Concepts

> [!NOTE] Instruções de Estudo Ativo
> Responda às questões marcando os checkboxes antes de expandir o gabarito.

---

### Pergunta 1
**Quais dos seguintes elementos podem ser usados para indicar um comentário em ABAP? (Escolha duas opções)**

- **A.** `//` no início de uma linha
- **B.** `*` no início de uma linha
- **C.** `--` em qualquer posição da linha
- **D.** `"` em qualquer posição da linha

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **B, D**  
> **Conceito:** `*` na primeira coluna comenta a linha inteira; `"` em qualquer posição da linha comenta o restante do texto até o final da linha.

---

### Pergunta 2
**Quais das seguintes afirmações sobre exceções são verdadeiras? (Escolha duas opções)**

- **A.** Todas as exceções não tratadas resultam em erros de execução (*runtime errors*)
- **B.** Todas as exceções podem ser capturadas.
- **C.** Algumas exceções podem ser capturadas e outras não podem.
- **D.** Um bloco `TRY...ENDTRY` deve conter pelo menos duas instruções `CATCH`.

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **A, C**  
> **Conceito:** Exceções não tratadas abortam o programa gerando um *Runtime Error (Short Dump ST22)*. Apenas exceções tratáveis podem ser capturadas por blocos `CATCH`.

---

### Pergunta 3
**Você declara uma variável da seguinte forma:**

```abap
DATA var TYPE i VALUE 100.
```

**Em seguida, executa a instrução:**

```abap
CLEAR var.
```

**Qual será o valor da variável `var` após o comando `CLEAR`?**

- **A.** 0
- **B.** 100

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **A**  
> **Conceito:** O comando `CLEAR` sempre redefine a variável para o valor inicial técnico padrão do tipo (`0` para inteiros), ignorando o valor de partida definido na adição `VALUE`.

---

### Pergunta 4
**Você deseja concatenar duas strings. Qual é o operador correto?**

- **A.** `+`
- **B.** `&`
- **C.** `++`
- **D.** `&&`

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **D**  
> **Conceito:** `&&` é o operador moderno oficial de concatenação de strings no ABAP.

---

### Pergunta 5
**Quando você deve escolher Resume (F8) no depurador (Debugger)?**

- **A.** Executar o programa até o próximo breakpoint
- **B.** Executar apenas uma instrução
- **C.** Encerrar a sessão de depuração
- **D.** Executar o programa até a posição atual do cursor

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **A**  
> **Conceito:** **F8 (Resume)** retoma a execução contínua do programa até encontrar o próximo breakpoint/watchpoint ou finalizar a execução.

---

### Pergunta 6
**Qual informação é exibida ao posicionar o ponteiro do mouse sobre uma variável no depurador?**

- **A.** O tipo de dado da variável
- **B.** O conteúdo atual da variável
- **C.** O consumo atual de memória da variável

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **B**  
> **Conceito:** No Debugger do Eclipse ADT, posicionar o cursor do mouse (*hover*) sobre qualquer variável exibe um pop-up com seu valor atual em memória.

---

### Pergunta 7
**Como é possível sair de um loop em ABAP? (Escolha duas opções)**

- **A.** Após um determinado número de repetições
- **B.** Após um determinado intervalo de tempo
- **C.** Quando uma condição específica for atendida

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **A, C**  
> **Conceito:** Um laço pode ser encerrado por limite de iterações (`DO n TIMES`) ou por saída condicional antecipada com a instrução `EXIT`.

---

### Pergunta 8
**Considere o seguinte código:**

```abap
IF a > 10.
  ...
ELSEIF a = 25.
  ...
ENDIF.
```

**Sabendo que a variável `a` possui o valor 25, qual ramo será executado?**

- **A.** O ramo iniciado por `IF a > 10.`
- **B.** O ramo iniciado por `ELSEIF a = 25.`
- **C.** Ambos os ramos

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **A**  
> **Conceito:** Em cadeias `IF/ELSEIF`, a avaliação é sequencial. Como o valor 25 satisfaz a primeira condição (`a > 10`), seu bloco é executado e o `ELSEIF a = 25` é ignorado.

---

### Pergunta 9
**O resultado da expressão abaixo é 1:**

```abap
result = var MOD 2.
```

**O que isso indica sobre o valor da variável `var`?**

- **A.** `var` é um número par
- **B.** `var` é um número ímpar

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **B**  
> **Conceito:** O operador `MOD` calcula o resto da divisão inteira. Todo número inteiro cujo resto da divisão por 2 seja 1 é um número ímpar.

---

### Pergunta 10
**Quais dos seguintes tipos predefinidos do ABAP são completos? (Escolha duas opções)**

- **A.** C
- **B.** D
- **C.** P
- **D.** I

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **B, D**  
> **Conceito:** Tipos completos possuem comprimento fixo nativo: `D` (data, 8 caracteres) e `I` (inteiro, 4 bytes). Tipos `C` e `P` são incompletos porque exigem definir `LENGTH` ou `DECIMALS`.
