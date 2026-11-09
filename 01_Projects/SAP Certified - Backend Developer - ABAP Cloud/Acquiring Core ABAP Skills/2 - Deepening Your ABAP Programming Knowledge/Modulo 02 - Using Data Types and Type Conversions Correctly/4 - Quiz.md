---
title: "Quiz - Using Data Types and Type Conversions Correctly"
source: "https://learning.sap.com/courses/deepening-your-abap-programming-knowledge/using-data-types-and-type-conversions-correctly_quiz"
created: 2026-11-03
tags:
  - sap
  - abap
  - abap-cloud
  - quiz
  - tipos-de-dados
  - conversao
  - utclong
---
**Roteiro de Estudos Relacionado:** [[Roteiro de Estudos SAP]]

# SAP Learning - Deepening Your ABAP Programming Knowledge
## Quiz: Using Data Types and Type Conversions Correctly

> [!NOTE] Instruções de Estudo Ativo
> Responda mentalmente a cada uma das questões antes de expandir o bloco com o gabarito oficial e a respectiva fundamentação técnica.

---

### Pergunta 1
**Qual dos seguintes tipos elementares embutidos (*Built-in ABAP Types*) é classificado como um tipo de dado INCOMPLETO, exigindo obrigatoriamente que o desenvolvedor especifique a extensão (`LENGTH`) na sua declaração?**

- **A.** `STRING`
- **B.** `INT8`
- **C.** `C`
- **D.** `UTCLONG`

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **C**  
> **Fundamentação Técnica:** Os tipos elementares incompletos no ABAP são `C`, `N`, `P` e `X`. Ao declarar variáveis com esses tipos, é mandatória a definição explícita do comprimento em memória (`LENGTH`). Tipos como `STRING`, `INT8`, `I` e `UTCLONG` são tipos completos cujo tamanho físico é intrinsecamente fixado ou alocado dinamicamente pelo kernel.

---

### Pergunta 2
**Ao projetar uma aplicação financeira ou de precificação no SAP S/4HANA ou SAP BTP, por que o tipo de ponto flutuante binário `F` NÃO deve ser utilizado para armazenar valores monetários ou cálculos de impostos?**

- **A.** O tipo `F` consome mais memória que qualquer outro tipo numérico.
- **B.** O tipo `F` armazena números em formato binário fracionário (IEEE 754), o que impossibilita a representação exata de certos decimais em base 10 (como 0.10) e gera imprecisões e centavos fantasmas por arredondamento.
- **C.** O compilador ABAP Cloud bloqueia a ativação de qualquer variável do tipo `F`.
- **D.** O tipo `F` não suporta números negativos.

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **B**  
> **Fundamentação Técnica:** Em qualquer linguagem de computação alinhada ao padrão IEEE 754, números decimais fracionários simples não possuem representação binária exata e geram aproximações indesejadas. Para valores monetários, balanços contábeis e notas fiscais, a SAP exige o uso de números empacotados (`P` com casas decimais) ou ponto flutuante decimal (`DECFLOAT34`), que calculam estritamente em base decimal.

---

### Pergunta 3
**Se você executar a instrução aritmética `lv_target_date = lv_source_date + 10.`, onde `lv_source_date` é uma variável do tipo `D` contendo o valor `'20260225'`, qual será a unidade de medida considerada pelo ABAP na adição?**

- **A.** Segundos
- **B.** Horas
- **C.** Meses
- **D.** Dias corridos

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **D**  
> **Fundamentação Técnica:** Operações de adição ou subtração de números inteiros sobre variáveis do tipo `D` (Date) são calculadas em **dias corridos**. O ABAP converte a data para o número de dias desde 01.01.0001, computa a soma e reconverte para `YYYYMMDD`, respeitando automaticamente a quantidade de dias do mês e anos bissextos.

---

### Pergunta 4
**Ao realizar operações aritméticas de adição ou subtração de um número inteiro diretamente sobre uma variável do tipo `T` (Time), qual é a unidade de tempo considerada pelo compilador?**

- **A.** Minutos
- **B.** Milissegundos
- **C.** Segundos
- **D.** Horas

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **C**  
> **Fundamentação Técnica:** No tipo `T`, o horário (`HHMMSS`) é interpretado internamente como a quantidade de **segundos** decorridos desde a meia-noite (`00:00:00`). Portanto, somar `3600` a uma variável do tipo `T` avança exatamente 1 hora no relógio.

---

### Pergunta 5
**Qual das seguintes alternativas descreve com precisão a estrutura e as características do tipo de dado moderno `UTCLONG` introduzido no ABAP moderno?**

- **A.** Armazena a data e a hora locais como um número empacotado de 8 bytes na classe `CL_ABAP_TSTMP`.
- **B.** É um tipo de dado completo dedicado que armazena um carimbo de data/hora universal UTC de alta precisão (até 100 nanossegundos) no formato padrão ISO-8601 (`YYYY-MM-DD HH:MM:SS.sssssss`).
- **C.** É uma string de texto dinâmica que só aceita horário militar.
- **D.** É um tipo obsoleto substituído pelo tipo `D`.

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **B**  
> **Fundamentação Técnica:** O `UTCLONG` é o padrão contemporâneo da SAP para timestamps universais. Possui resolução de até 100 nanossegundos, segue o padrão ISO-8601, elimina discrepâncias de fuso horário local e é manipulado por funções nativas de kernel como `utclong_current( )`, `utclong_add( )` e `utclong_diff( )`.

---

### Pergunta 6
**O que acontece em tempo de execução se um programa tentar atribuir a string `'LOTE_ABC'` a uma variável declarada como `TYPE i` (inteiro) sem nenhum bloco de tratamento de exceções?**

- **A.** O valor é convertido para 0 sem interrupção.
- **B.** O programa é abortado imediatamente com um erro em tempo de execução (*Short Dump*) decorrente da exceção não tratada `CX_SY_CONVERSION_NO_NUMBER`.
- **C.** Apenas os primeiros caracteres são convertidos para o código ASCII correspondente.
- **D.** O compilador impede a execução através de um erro de sintaxe.

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **B**  
> **Fundamentação Técnica:** Como a conversão é permitida pelo compilador sintaticamente, o kernel tenta realizar a conversão em tempo de execução. Ao encontrar caracteres não numéricos em uma string destinada a um número inteiro, o sistema dispara a exceção tratável **`CX_SY_CONVERSION_NO_NUMBER`**. Caso não haja um bloco `TRY ... CATCH`, a sessão termina com um *runtime error*.

---

### Pergunta 7
**Qual é o principal objetivo do operador construtor `EXACT` (*Lossless Operator*) introduzido nas versões modernas do ABAP?**

- **A.** Forçar a conversão de caracteres minúsculos para maiúsculos.
- **B.** Garantir que uma atribuição ou conversão ocorra sem nenhuma perda oculta de dados, disparando uma exceção (`CX_SY_CONVERSION_DATA_LOSS`) caso ocorra truncamento ou arredondamento indesejado.
- **C.** Converter valores inteiros diretamente em formato JSON.
- **D.** Declarar classes de teste unitário no ADT.

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **B**  
> **Fundamentação Técnica:** O operador `EXACT #( ... )` implementa o conceito de *Lossless Assignment* (atribuição sem perdas). Enquanto atribuições comuns descartam silenciosamente caracteres à direita ou frações decimais em caso de incompatibilidade de tamanho, o `EXACT` valida se o valor de destino representa com exatidão matemática o valor original, disparando `CX_SY_CONVERSION_DATA_LOSS` se qualquer informação for perdida.

---

### Pergunta 8
**Dada a variável `DATA lv_date TYPE d VALUE '20261103'.`, qual é a sintaxe correta de deslocamento e comprimento (*Offset/Length*) para extrair estritamente os dois dígitos correspondentes ao MÊS?**

- **A.** `lv_date(2)`
- **B.** `lv_date+2(4)`
- **C.** `lv_date+4(2)`
- **D.** `lv_date+6(2)`

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **C**  
> **Fundamentação Técnica:** No formato fixo `YYYYMMDD`:
> - Os primeiros 4 caracteres (deslocamento 0, tamanho 4: `lv_date(4)`) são o Ano (`2026`).
> - Pulando 4 posições e lendo 2 caracteres (deslocamento 4, tamanho 2: `lv_date+4(2)`), obtemos o Mês (`11`).
> - Pulando 6 posições e lendo 2 caracteres (deslocamento 6, tamanho 2: `lv_date+6(2)`), obtemos o Dia (`03`).
