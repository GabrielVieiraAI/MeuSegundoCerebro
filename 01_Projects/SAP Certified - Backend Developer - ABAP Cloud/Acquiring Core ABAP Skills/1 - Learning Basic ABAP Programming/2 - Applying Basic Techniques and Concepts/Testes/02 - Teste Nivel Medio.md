---
tipo: teste-notebooklm
tags:
  - sap
  - abap
  - abap-cloud
  - teste
modulo: 2
dificuldade: medio
tentativa: 1
score: 0%
aprovado: false
data: 2026-10-26
---

# 📝 Bateria de Teste: Nível Médio - Módulo 2 (Applying Basic Techniques and Concepts)

> [!NOTE] Instruções de Estudo Ativo
> Este teste avalia a compreensão do **comportamento de execução, regras de tipagem, controle de fluxo e depuração avançada** no ABAP moderno.  
> Responda a todas as 10 questões antes de expandir o bloco de gabarito.  
> **Meta para aprovação:** ≥ 90% de acertos (mínimo de 9 em 10 questões).

---

### Questão 1
Considere o seguinte trecho de código ABAP executado no console:

```abap
DATA lv_inteiro TYPE i.
lv_inteiro = 2 / 3.
out->write( lv_inteiro ).
```

Qual será a saída impressa no console e qual é a regra do runtime ABAP para este cálculo?

- **A.** `0` (o valor decimal é sempre truncado)
- **B.** `1` (o runtime arredonda comercialmente frações $\ge 0.5$ ao atribuir para inteiros `i`)
- **C.** `0.666` (o ABAP converte o tipo `i` para ponto flutuante dinamicamente)
- **D.** Ocorre um erro em tempo de execução (*Short Dump*) por incompatibilidade de tipos

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **B**  
> **Conceito:** O cálculo $2 / 3$ com a barra de divisão (`/`) resulta em $0.6666...$. Ao atribuir o resultado a uma variável inteira (`i`), o compilador ABAP aplica **arredondamento comercial** (*half-up*): como a parte fracionária é maior que `0.5`, o valor é arredondado estritamente para cima (**`1`**). O resultado só seria `0` caso a fração fosse menor que `0.5` (como em $1 / 3 = 0.333...$) ou se fosse utilizado o operador de divisão inteira explícita **`DIV`** (`2 DIV 3 = 0`). Para preservar casas decimais exatas, utiliza-se o tipo packed decimal (`p`).

---

### Questão 2
Por que no desenvolvimento de aplicações de negócio (como faturamento, vendas e contabilidade) a SAP preconiza o uso do tipo de dado **`p` (*Packed Decimal*)** em vez de números inteiros (`i`) ou ponto flutuante binário (`f`)?

- **A.** Porque o tipo `p` ocupa menos espaço em disco do que o tipo `i`
- **B.** Porque o tipo `p` suporta strings embutidas diretamente na mesma variável
- **C.** Porque o tipo `p` permite configurar tamanho e casas decimais exatas (`DECIMALS d`), prevenindo distorções causadas por arredondamentos em ponto flutuante
- **D.** Porque o modelo [[ABAP Cloud]] tornou o tipo `i` obsoleto

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **C**  
> **Conceito:** Variáveis numéricas de ponto flutuante (`f`) utilizam representação binária interna suscetível a pequenas discrepâncias de arredondamento. O tipo `p` (*Packed Decimal / BCD*) opera em decimal puro de alta precisão com especificação exata de casas decimais (`LENGTH l DECIMALS d`), sendo o padrão oficial para valores monetários e financeiros.

---

### Questão 3
Analise o uso de **String Templates** (`|...|`) e opções de formatação no código a seguir:

```abap
DATA lv_data TYPE d VALUE '20261231'.
out->write( |Data Formatada: { lv_data DATE = ISO }| ).
```

Qual será o texto impresso no console?

- **A.** `Data Formatada: 31/12/2026`
- **B.** `Data Formatada: 2026-12-31`
- **C.** `Data Formatada: 20261231`
- **D.** O código acusa erro de sintaxe porque `DATE = ISO` não é suportado no ABAP Cloud

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **B**  
> **Conceito:** Dentro de *String Templates* (`|...|`), expressões entre chaves `{ ... }` aceitam parâmetros de formatação. O modificador `DATE = ISO` formata uma data nativa de 8 posições (`YYYYMMDD`) no padrão internacional `YYYY-MM-DD`. Caso fosse utilizado `DATE = USER`, a data seria formatada de acordo com as preferências do perfil do usuário (ex: `DD.MM.YYYY` ou `DD/MM/YYYY`).

---

### Questão 4
Uma tabela interna simples foi preenchida com três elementos inteiros:

```abap
DATA numbers TYPE TABLE OF i.
APPEND 10 TO numbers.
APPEND 20 TO numbers.
APPEND 30 TO numbers.

DATA(item) = numbers[ 5 ].
```

O que acontece exatamente na última linha ao tentar ler a linha de índice 5?

- **A.** A variável `item` recebe o valor inicial padrão `0`
- **B.** O programa aguarda até que o índice 5 seja inserido
- **C.** O sistema dispara a exceção tratável `cx_sy_itab_line_not_found`, resultando em queda (*dump*) caso não esteja em um bloco `TRY ... CATCH`
- **D.** O compilador recusa a ativação da classe por detectar o estouro de índice antes da execução

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **C**  
> **Conceito:** O acesso a tabelas internas por expressões de tabela (*Table Expressions* como `numbers[ 5 ]`) falha caso a linha não exista, levantando a exceção capturável **`cx_sy_itab_line_not_found`**. Se a leitura não estiver protegida por um bloco `TRY ... CATCH` ou acompanhada da expressão `OPTIONAL` / `DEFAULT`, o programa é abortado em tempo de execução com um *Short Dump*.

---

### Questão 5
Um desenvolvedor precisa implementar uma estrutura de decisão condicional. Qual a recomendação de boas práticas no ABAP para a escolha entre `IF ... ELSEIF ... ENDIF` e `CASE ... WHEN ... ENDCASE`?

- **A.** O `CASE` deve ser sempre evitado porque é uma instrução legada incompatível com Clean Core
- **B.** Usa-se `IF` quando for necessário avaliar condições compostas e arbitrárias com operadores lógicos (`AND`, `OR`, `IS INITIAL`); usa-se `CASE` quando se compara uma única variável contra valores específicos discretos
- **C.** O `CASE` só funciona com variáveis de texto (`string`), enquanto o `IF` aceita apenas números
- **D.** Ambas as estruturas possuem exatamente o mesmo plano de execução e desempenho em qualquer situação

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **B**  
> **Conceito:** A instrução `CASE <variavel>` é mais limpa, legível e otimizada quando o fluxo depende unicamente do valor discreto de uma mesma variável. Já o `IF` é necessário sempre que as condições envolverem variáveis distintas, faixas de valores (`BETWEEN`) ou expressões relacionais complexas combinadas com `AND`/`OR`.

---

### Questão 6
Considere o seguinte laço de repetição:

```abap
DO 4 TIMES.
  IF sy-index = 3.
    CONTINUE.
  ENDIF.
  out->write( |Iteração: { sy-index }| ).
ENDDO.
```

Quais saídas serão exibidas no console?

- **A.** `Iteração: 1`, `Iteração: 2`, `Iteração: 4`
- **B.** `Iteração: 1`, `Iteração: 2`
- **C.** `Iteração: 1`, `Iteração: 2`, `Iteração: 3`, `Iteração: 4`
- **D.** `Iteração: 0`, `Iteração: 1`, `Iteração: 2`

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **A**  
> **Conceito:** A variável de sistema `sy-index` armazena o número da iteração corrente em um laço `DO` (iniciando em 1). O comando `CONTINUE` encerra imediatamente a iteração atual e salta para a próxima, ignorando o comando `out->write` quando `sy-index = 3`. O comando `EXIT` terminaria o laço por completo.

---

### Questão 7
Durante a iteração de uma tabela interna com a instrução `LOOP AT itab INTO DATA(wa)`, qual variável de sistema da SAP armazena o **número da linha atual** da tabela que está sendo processada no momento?

- **A.** `sy-index`
- **B.** `sy-tabix`
- **C.** `sy-subrc`
- **D.** `sy-linno`

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **B**  
> **Conceito:** No ABAP, a variável de sistema **`sy-tabix`** contém o índice da linha atual da tabela interna durante a execução do laço `LOOP AT`. Já `sy-index` é utilizada em laços `DO` ou `WHILE`.

---

### Questão 8
Qual das opções a seguir representa o tratamento correto de exceções em tempo de execução para evitar a queda abrupta da aplicação (*Short Dump*) ao realizar uma divisão matemática?

- **A.**
```abap
TRY.
    result = 10 / divisor.
  CATCH cx_sy_zerodivide.
    out->write( 'Divisão por zero interceptada' ).
ENDTRY.
```
- **B.**
```abap
ON ERROR ( divisor = 0 ).
  out->write( 'Erro de cálculo' ).
ENDON.
```
- **C.**
```abap
TRY.
    result = 10 / divisor.
  EXCEPT 0.
    out->write( 'Zero' ).
ENDTRY.
```
- **D.** No ABAP Cloud não existem blocos `TRY ... CATCH`, sendo obrigatório validar `IF divisor = 0` em todos os casos

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **A**  
> **Conceito:** O tratamento de exceções baseadas em classes no ABAP é feito com a estrutura `TRY ... CATCH <classe_de_excecao> ... ENDTRY`. A divisão por zero levanta a exceção do sistema `cx_sy_zerodivide`.

---

### Questão 9
No depurador do Eclipse ADT, você está posicionado dentro de um método complexo de cálculo com mais de 100 linhas. Você deseja que o sistema execute todo o restante desse método de uma única vez e retorne a parada para o método chamador (linha imediatamente posterior à chamada). Qual atalho deve ser utilizado?

- **A.** F5 (Step Into)
- **B.** F6 (Step Over)
- **C.** F7 (Step Return)
- **D.** Shift + F12 (Jump to Line)

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **C**  
> **Conceito:** O comando **F7 (Step Return)** executa todas as instruções restantes do método atual sem pausar linha por linha e interrompe a execução exatamente na linha seguinte à chamada desse método na classe externa.

---

### Questão 10
Em qual cenário de depuração no Eclipse ADT a criação de um **Watchpoint** é a técnica mais produtiva em comparação com um *Breakpoint* convencional?

- **A.** Quando você já sabe a linha exata do código onde o erro acontece
- **B.** Quando você quer pausar a execução em uma linha específica apenas se `sy-index > 10`
- **C.** Quando o valor de uma variável é corrompido em algum ponto desconhecido de um fluxo longo e você quer que o depurador pare imediatamente no momento exato em que o valor dessa variável for alterado
- **D.** Quando você precisa reiniciar a sessão de depuração desde a primeira linha

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **C**  
> **Conceito:** Um **Watchpoint** não fica associado a uma linha de código, mas sim a uma área de memória (variável). O depurador monitora o conteúdo da variável e interrompe a execução na instrução que modificou o valor dela, sendo a ferramenta ideal para rastrear alterações inesperadas em lógicas complexas.
