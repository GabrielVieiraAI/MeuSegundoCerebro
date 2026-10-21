---
title: "Processamento de Dados (Cálculos e Manipulação de Strings)"
source: "https://learning.sap.com/courses/basic-abap-programming/processing-data_b025c9e3-697d-423f-977a-43b9051a7c15"
created: 2026-10-20
tags:
  - sap
  - abap
  - abap-cloud
  - adt
  - strings
  - matematica
---
**Roteiro de Estudos Relacionado:** [[Roteiro de Estudos SAP]]
# Objetivos
Após concluir esta lição, você será capaz de:
- Executar cálculos aritméticos utilizando operadores e funções matemáticas embutidas.
- Compreender como o tipo de dado do resultado impacta o arredondamento e a precisão decimal.
- Criar e formatar textos dinâmicos utilizando **String Templates** (`|...|`), expressões embutidas (`{ ... }`) e o operador de concatenação (`&&`).
- Controlar opções de formatação de saída para datas (`DATE = ISO / USER`) e números (`NUMBER`, `SIGN`, `STYLE`).

---

## 1. Cálculos Aritméticos no ABAP

<iframe 
    src="https://cdnapisec.kaltura.com/p/1921661/embedPlaykitJs/uiconf_id/50355372?iframeembed=true&entry_id=1_kr2xs45i" 
    width="100%" 
    height="400" 
    allowfullscreen 
    frameborder="0">
</iframe>

Expressões aritméticas em ABAP combinam valores, variáveis, operadores matemáticos e funções para calcular um resultado. Elas podem ser usadas em qualquer lugar que espere uma leitura de valor (como no lado direito de uma atribuição com `=`).

### Operadores Básicos e Funções

| Operação                | Operador / Função | Exemplo                               | Observação de Sintaxe                                          |
| :---------------------- | :---------------- | :------------------------------------ | :------------------------------------------------------------- |
| **Soma**                | `+`               | `result = 2 + 3.`                     | **Obrigatório:** Espaços em branco antes e depois do operador. |
| **Subtração**           | `-`               | `result = 5 - 2.`                     | Espaços obrigatórios.                                          |
| **Multiplicação**       | `*`               | `result = 4 * 2.`                     | Espaços obrigatórios.                                          |
| **Divisão**             | `/`               | `result = 10 / 2.`                    | Espaços obrigatórios.                                          |
| **Raiz Quadrada**       | `sqrt( )`         | `result = sqrt( 9 ).`                 | Pelo menos um espaço dentro dos parênteses.                    |
| **Potenciação Inteira** | `ipow( )`         | `result = ipow( base = 2 exp = 3 ).`  | Calcula $2^3 = 8$.                                             |
| **Precedência**         | `( )`             | `result = ( 8 * 7 - 6 ) / ( 5 + 4 ).` | Parênteses para forçar a ordem de cálculo.                     |

> [!WARNING]
> **Espaçamento Obrigatório:** Escrever `result = 2+3.` causará erro de compilação. O compilador ABAP exige espaços entre operandos e operadores (`result = 2 + 3.`).

---

### O Tipo de Dado e a Precisão do Resultado

O tipo da variável que recebe o cálculo define como o valor será armazenado:

* **Com `TYPE i` (Inteiro):** Se você calcular `2 / 3` em uma variável inteira, o resultado será arredondado para `1` (ou truncado para `0`), perdendo todas as casas decimais.
* **Com `TYPE p DECIMALS 2` (Packed Decimal):** O cálculo preserva as casas decimais exatas (ex: `0.67`), ideal para operações comerciais e financeiras.

---

## 2. Prática Guiada: Testando Cálculos Aritméticos

No método `if_oo_adt_classrun~main` da sua classe de testes, experimente o código abaixo:

```abap
* Declarações de Tipos e Variáveis
**********************************************************************
    " Alterne entre as definições para ver a diferença no resultado:
    TYPES t_result TYPE p LENGTH 8 DECIMALS 2.
*   TYPES t_result TYPE p LENGTH 8 DECIMALS 0.
*   TYPES t_result TYPE i.

    DATA result TYPE t_result.

* Cálculos Aritméticos
**********************************************************************
    result = 2 + 3.
*   result = 2 - 3.
*   result = 2 * 3.
*   result = 2 / 3.
*
*   result = sqrt( 2 ).
*   result = ipow( base = 2 exp = 3 ).
*
*   result = ( 8 * 7 - 6 ) / ( 5 + 4 ).
*   result = 8 * 7 - 6 / 5 + 4.

* Saída no Console
**********************************************************************
    out->write( |Resultado do Cálculo: { result }| ).
```

---

## 3. Manipulação de Strings (*String Processing*)

### String Templates (`|...|`) e Expressões Embutidas (`{ ... }`)

![[02_-_String_Processing_001.png]]

Um **String Template** é um texto dinâmico delimitado por barras verticais / *pipe* (`|`). Ele permite intercalar texto fixo com variáveis e expressões usando chaves (`{ }`):

```abap
DATA(texto) = |Total a pagar: { amount } EUR|.
```

> [!IMPORTANT]
> **Regra de Ouro do String Template:**  
> Deve haver obrigatoriamente **pelo menos um espaço** após a chave de abertura `{` e antes da chave de fechamento `}`:
> * Correto: `|Olá, { lv_nome }!|`
> * Erro de Sintaxe: `|Olá, {lv_nome}!|`

Você também pode incluir operações matemáticas diretamente dentro das chaves:
```abap
DATA(mensagem) = |Resultado da soma: { valor1 + valor2 }|.
```

---

### Opções de Formatação de Saída

![[02_-_String_Processing_002.png]]

Podemos instruir o template a formatar os dados para exibição amigável ao usuário:

#### 1. Formatação de Datas (`DATE`):
A variável do tipo `d` armazena datas no formato bruto `YYYYMMDD` (ex: `19891109`).
* Bruto: `{ the_date }` $\rightarrow$ `19891109`
* Padrão Internacional: `{ the_date DATE = ISO }` $\rightarrow$ `1989-11-09`
* Padrão do Usuário: `{ the_date DATE = USER }` $\rightarrow$ `09.11.1989` (conforme configurações regionais do usuário).

#### 2. Formatação de Números (`NUMBER`, `SIGN`, `STYLE`):
* Padrão Regional de Separadores: `{ my_number NUMBER = USER }` (aplica ponto para milhar e vírgula para decimal, ou vice-versa).
* Posição do Sinal Negativo: `{ my_number SIGN = RIGHT }` $\rightarrow$ exibe `273.15-`.
* Notação Científica: `{ my_number STYLE = SCIENTIFIC }` $\rightarrow$ exibe `-2.731500E+02`.

---

### Operador de Concatenação (`&&`)

![](https://learning.sap.com/service/media/topic/ca63364f-4ad8-490f-9b8b-3e414b496003/S4D400_2601_en-US_media/S4D400_2601_en-US_images/02_-_String_Processing_003.png)

Para juntar variáveis e templates em uma única string contínua, utilize o operador **`&&`**:

```abap
DATA(texto_completo) = part1 && part2.              " Junta sem espaços: 'HelloWorld'
DATA(texto_espacado) = part1 && | | && part2.        " Adiciona espaço: 'Hello World'
```

---

## 4. Exercício Prático: Declarar Variáveis e Processar Dados

Neste exercício, você construirá uma classe que realiza uma operação aritmética entre dois números e exibe o resultado formatado no console com precisão decimal controlada.

### Tarefa 1: Criar a Classe e Declarar Variáveis
1. No Eclipse ADT, crie uma nova classe ABAP chamada **`ZCL_##_COMPUTE`** (substitua `##` pelo seu número de usuário).
2. Adicione a interface **`IF_OO_ADT_CLASSRUN`**.
3. No método `main`, declare duas variáveis inteiras e atribua valores:
```abap
DATA number1 TYPE i.
DATA number2 TYPE i.

number1 = -8.
number2 =  3.
```

---

### Tarefa 2: Cálculo e Formatação com String Template
1. Efetue a divisão dos dois números e monte a string de resultado usando um template:
```abap
DATA(result) = number1 / number2.
DATA(output) = |{ number1 } / { number2 } = { result }|.

out->write( output ).
```
2. Ative com **Ctrl + F3** e execute com **F9**.
3. **Problema identificado:** Note que o resultado exibido foi um número inteiro arredondado (`-3`), pois ambos os operandos eram inteiros (`TYPE i`), e a declaração inline inferiu o tipo `i` para a variável `result`.

---

### Tarefa 3: Controlar a Precisão Decimal
Para exibir o valor real com casas decimais, declare a variável `result` explicitamente como tipo empacotado (`TYPE p`) antes de calcular:

```abap
METHOD if_oo_adt_classrun~main.
  * 1. Declarações Explícitas com Casas Decimais
  ********************************************************************
  DATA number1 TYPE i.
  DATA number2 TYPE i.
  DATA result  TYPE p LENGTH 8 DECIMALS 2.

  * 2. Valores de Entrada
  ********************************************************************
  number1 = -8.
  number2 =  3.

  * 3. Cálculo e Montagem da Saída
  ********************************************************************
  result = number1 / number2.
  DATA(output) = |{ number1 } / { number2 } = { result }|.

  * 4. Exibição no Console
  ********************************************************************
  out->write( output ).
ENDMETHOD.
```

1. Ative (**Ctrl + F3**) e execute (**F9**).
2. **Resultado correto no Console:**
   ```text
   -8 / 3 = -2.67
   ```

---

## 📌 Termos e Conceitos para Adicionar em `03_Resources/SAP/Conceitos`

Abaixo estão os conceitos fundamentais apresentados nesta lição recomendados para criação de notas dedicadas na pasta `03_Resources/SAP/Conceitos`:

- `[[Expressões Aritméticas e Funções Matemáticas no ABAP]]` — Regras de cálculo, precedência, operadores e funções nativas (sqrt, ipow).
- `[[String Templates e Expressões Embutidas (|...| e { ... })]]` — Interpolação moderna de strings, regras de espaçamento e concatenação com `&&`.
- `[[Opções de Formatação de Saída (DATE, NUMBER, STYLE)]]` — Formatação regional de dados e padrões internacionais (ISO, USER) para exibição.
- `[[Controle de Precisão e Tipo Packed Decimal (p)]]` — Como evitar perda de precisão e truncamentos em divisões e cálculos financeiros.
