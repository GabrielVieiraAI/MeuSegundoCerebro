---
tipo: teste-notebooklm
tags:
  - sap
  - abap
  - abap-cloud
  - teste
modulo: 2
dificuldade: dificil
tentativa: 2
score: 0%
aprovado: false
data: 2026-10-27
---

# 📝 Bateria de Teste: Nível Difícil (Tentativa 2) - Módulo 2 (Applying Basic Techniques and Concepts)

> [!NOTE] Instruções de Estudo Ativo
> Este simulado de **segunda tentativa** reforça os conceitos críticos da certificação oficial **SAP Certified Associate - Back-End Developer - ABAP Cloud (`C_ABAPD`)**, com foco em **tratamento avançado de exceções, coleções em memória, manipulação de tabelas internas, precedência lógica e depuração no Eclipse ADT**.  
> Responda a todas as 10 questões mentalmente ou marcando as alternativas antes de expandir o bloco de gabarito.  
> **Meta para aprovação:** ≥ 90% de acertos (mínimo de 9 em 10 questões).

---

### Questão 1
Considere a ordem dos blocos `CATCH` no tratamento de exceções baseadas em classes no código a seguir:

```abap
TRY.
    result = 10 / divisor.
  CATCH cx_root.
    out->write( 'Erro genérico capturado' ).
  CATCH cx_sy_zerodivide.
    out->write( 'Divisão por zero capturada' ).
ENDTRY.
```

Ao tentar ativar (`Ctrl + F3`) esta classe no Eclipse ADT, qual será a reação do compilador ABAP?

- **A.** A classe é ativada normalmente e o bloco `cx_sy_zerodivide` será executado com prioridade em runtime
- **B.** Ocorre um erro de compilação porque classes mais genéricas (como a raiz `cx_root`) não podem preceder classes mais específicas derivadas dela
- **C.** O compilador inverte automaticamente a ordem dos blocos em tempo de execução
- **D.** O código é ativado, mas o sistema gera um *Short Dump* assim que o bloco `TRY` é aberto

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **B**  
> **Conceito:** No ABAP, os blocos `CATCH` são avaliados sequencialmente de cima para baixo. Como todas as exceções tratáveis herdam de **`cx_root`**, colocar `CATCH cx_root` no topo interceptaria qualquer exceção, tornando o bloco subsequente `CATCH cx_sy_zerodivide` inalcançável (*código morto*). O compilador detecta isso estaticamente e emite um erro de sintaxe, exigindo que classes específicas venham sempre **antes** de suas superclasses mais genéricas.

---

### Questão 2
Ao consultar um registro específico em uma tabela interna simples de clientes através de uma *Table Expression*, você deseja que o comando retorne o valor inicial padrão do tipo caso o índice solicitado não exista, **sem disparar a exceção `cx_sy_itab_line_not_found`** e sem usar blocos `TRY ... CATCH`.

Qual expressão atende exatamente a essa necessidade?

- **A.** `DATA(cliente) = clientes[ 10 ] OPTIONAL.`
- **B.** `DATA(cliente) = clientes[ 10 ] IF FOUND.`
- **C.** `DATA(cliente) = OPTIONAL( clientes[ 10 ] ).`
- **D.** `DATA(cliente) = clientes[ 10 ] CATCH INITIAL.`

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **A**  
> **Conceito:** A adição da palavra-chave **`OPTIONAL`** ao final de uma expressão de tabela (`tabela[ indice ] OPTIONAL`) instrui o runtime ABAP a suprimir a exceção `cx_sy_itab_line_not_found` caso o registro não exista. Em vez de abortar o programa, a variável receptora recebe silenciosamente o valor inicial padrão (*initial value*) correspondente ao tipo de linha da tabela.

---

### Questão 3
Você precisa percorrer uma tabela interna de salários (`salarios`) contendo 5.000 registros e aplicar um reajuste de 10% diretamente em cada linha armazenada.

Qual das seguintes estruturas de código realiza a alteração **direta** dos registros dentro da tabela interna em memória com alta performance e sem cópia desnecessária de dados?

- **A.**
```abap
LOOP AT salarios INTO DATA(salario).
  salario = salario * '1.10'.
ENDLOOP.
```
- **B.**
```abap
LOOP AT salarios ASSIGNING FIELD-SYMBOL(<salario>).
  <salario> = <salario> * '1.10'.
ENDLOOP.
```
- **C.**
```abap
LOOP AT salarios INTO FINAL(salario).
  UPDATE salarios SET valor = salario * '1.10'.
ENDLOOP.
```
- **D.**
```abap
DO lines( salarios ) TIMES.
  salarios[ sy-index ] = salarios[ sy-index ] * '1.10'.
ENDDO.
```

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **B**  
> **Conceito:** A cláusula `ASSIGNING FIELD-SYMBOL(<fs>)` vincula um ponteiro de memória (*Field Symbol*) diretamente ao endereço da linha física da tabela interna durante a iteração. Qualquer modificação em `<salario>` reflete instantaneamente no registro da tabela sem criar cópias intermediárias na memória. A alternativa A falha porque `INTO DATA(salario)` altera apenas uma variável cópia local (*work area*), deixando a tabela intacta.

---

### Questão 4
Analise a condição lógica composta abaixo, executada sem parênteses:

```abap
IF flag_bloqueio = abap_true OR status = 'A' AND canal_venda = 'ONLINE'.
  out->write( 'Acesso Concedido' ).
ENDIF.
```

De acordo com as regras oficiais de precedência do compilador ABAP, qual é a fórmula lógica equivalente avaliada pelo sistema?

- **A.** `IF ( flag_bloqueio = abap_true OR status = 'A' ) AND canal_venda = 'ONLINE'.`
- **B.** `IF flag_bloqueio = abap_true OR ( status = 'A' AND canal_venda = 'ONLINE' ).`
- **C.** A avaliação ocorre estritamente da esquerda para a direita, sem prioridade entre operadores booleanos
- **D.** O compilador recusa a instrução porque o ABAP proíbe a mistura de `AND` e `OR` sem o uso de parênteses delimitadores

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **B**  
> **Conceito:** Na hierarquia de precedência de operadores booleanos em ABAP, o operador **`AND`** tem prioridade estritamente superior ao operador **`OR`** (ordem: `NOT > AND > OR`). Portanto, a expressão é avaliada agrupando primeiro a conjunção: `flag_bloqueio = abap_true OR ( status = 'A' AND canal_venda = 'ONLINE' )`.

---

### Questão 5
Um arquiteto de software solicita que você defina o tipo de dado de um campo de documento fiscal chamado `identificador_fiscal`. Esse tipo precisa conter rótulos de tela traduzidos (*Field Labels* em PT e EN), documentação técnica integrada e ajuda de pesquisa (*Search Help*) para reutilização em várias aplicações e CDS Views.

Onde esse tipo de dado **deve** ser criado para atender a esses requisitos semânticos de negócio?

- **A.** Declarado localmente como `TYPES ty_identificador TYPE c LENGTH 14.` na seção privada da classe
- **B.** No Dicionário de Dados ABAP (*DDIC / Global Types*), criando um **Elemento de Dados (*Data Element*)** no repositório
- **C.** No arquivo `.env` do projeto Eclipse ADT
- **D.** Diretamente dentro do método `if_oo_adt_classrun~main` através de declaração inline `DATA(...)`

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **B**  
> **Conceito:** Apenas os tipos do **Dicionário de Dados (DDIC)**, como os *Elementos de Dados (Data Elements)*, carregam informações semânticas e metadados de negócio (rótulos curtos/médios/longos de tela, documentação, ajudas de pesquisa e associações de domínio). A instrução `TYPES` local em classes define puramente a estrutura técnica (tipo e tamanho) sem suporte a metadados globais de interface e tradução.

---

### Questão 6
Durante a execução de um programa de faturamento com mais de 10.000 linhas de código distribuídas em várias classes, o desenvolvedor suspeita que a instrução de inserção em tabela `APPEND` está sendo disparada indevidamente para pedidos cancelados. Como o desenvolvedor não sabe exatamente em qual classe ou linha o `APPEND` suspeito se encontra, qual tipo de ponto de parada avançado ele deve configurar no Eclipse ADT?

- **A.** *Line Breakpoint* comum na primeira linha do método `main`
- **B.** *Conditional Breakpoint* configurado com a expressão `status = 'CANCELADO'`
- **C.** *Statement Breakpoint* na instrução `APPEND`
- **D.** *Watchpoint* no comando `CLEAR`

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **C**  
> **Conceito:** Um **Statement Breakpoint** interrompe a execução do programa toda vez que uma instrução ABAP específica (como `APPEND`, `CLEAR`, `SELECT` ou `RAISE EXCEPTION`) é executada pelo runtime, independentemente de qual classe, método ou include a instrução esteja localizada. É a ferramenta de depuração recomendada quando a linha exata é desconhecida.

---

### Questão 7
Considere a execução das duas expressões aritméticas abaixo atribuídas a variáveis inteiras (`TYPE i`):

```abap
DATA: res_div_padrao  TYPE i,
      res_div_inteira TYPE i.

res_div_padrao  = 5 / 2.
res_div_inteira = 5 DIV 2.
```

Quais serão os valores finais armazenados em `res_div_padrao` e `res_div_inteira`, respectivamente?

- **A.** `res_div_padrao = 2` e `res_div_inteira = 2`
- **B.** `res_div_padrao = 3` e `res_div_inteira = 2`
- **C.** `res_div_padrao = 2.5` e `res_div_inteira = 2`
- **D.** O programa gera uma exceção de conversão aritmética

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **B**  
> **Conceito:** O cálculo com a barra `/` resulta em `2.5`. Ao atribuir para o tipo inteiro `i`, o ABAP aplica **arredondamento comercial** (*half-up*): como a fração é $\ge 0.5$, o valor é arredondado para cima (**`3`**). Já o operador **`DIV`** efetua a divisão inteira com truncamento imediato do quociente, descartando a fração e resultando em **`2`**.

---

### Questão 8
Em uma sessão de depuração no ADT, o desenvolvedor está posicionado na linha 50. Ele percebe que na linha 35 uma variável `lv_total` foi somada com o valor 100 (`lv_total = lv_total + 100`). O desenvolvedor usa o atalho **Shift + F12 (Jump to Line)** para voltar a execução para a linha 30.

O que acontece com o valor da variável `lv_total` na memória após o salto para trás?

- **A.** A variável `lv_total` tem seu valor desfeito automaticamente para o estado que possuía antes da linha 35
- **B.** O valor de `lv_total` permanece com a soma já efetuada (+100); ao passar novamente pela linha 35, o valor será somado uma segunda vez
- **C.** O Eclipse ADT acusa um erro de violação de ponteiro e fecha a perspectiva de Debug
- **D.** O runtime executa um rollback de memória e redefine todas as variáveis para seus valores iniciais

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **B**  
> **Conceito:** O comando **Shift + F12 (Jump to Line)** apenas move o cursor da próxima instrução a ser processada pela CPU do servidor ABAP. Ele **não é uma máquina do tempo** e não desfaz alterações em memória já processadas. Logo, o valor já somado é mantido, e se a instrução for executada novamente, ocorrerá um efeito colateral cumulativo indesejado.

---

### Questão 9
No modelo de desenvolvimento **[[ABAP Cloud]]** (*ABAP for Cloud Development*), quais das seguintes práticas ou comandos são estritamente **proibidos** pelo compilador por violarem o conceito de *Clean Core*? (Escolha duas opções)

- **A.** Utilização de classes globais implementando a interface `if_oo_adt_classrun`
- **B.** Acesso direto a tabelas transparentes do sistema standard (como `MARA` ou `KNA1`) sem uso de CDS Views liberadas (*Released APIs*)
- **C.** Criação de tabelas internas utilizando a sintaxe `DATA itab TYPE TABLE OF string.`
- **D.** Criação de programas executáveis procedurais clássicos (*Reports na SE38*) e uso do comando de impressão `WRITE`

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **B, D**  
> **Conceito:** No modelo ABAP Cloud, todo desenvolvimento clássico procedural baseado em SAP GUI (`SE38`, telas dynpro, comando `WRITE`) foi descontinuado. Além disso, o princípio do **Clean Core** proíbe expressamente consultas diretas via Open SQL a tabelas standard da SAP sem intermediação de uma interface estável e liberada (*Released CDS Views / Released APIs*).

---

### Questão 10
Analise a declaração e o uso de uma tabela interna simples no trecho abaixo:

```abap
DATA codigos TYPE TABLE OF string.
CLEAR codigos.
APPEND 'BR' TO codigos.
CLEAR codigos.
```

Qual é o número de linhas contidas na tabela interna `codigos` ao final da execução desse bloco?

- **A.** 1 linha (contendo uma string vazia)
- **B.** 0 linhas (a tabela está completamente vazia em memória)
- **C.** A tabela é desalocada e qualquer acesso dispara `cx_sy_ref_is_initial`
- **D.** 2 linhas

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **B**  
> **Conceito:** Quando aplicado a uma tabela interna, o comando **`CLEAR`** remove todos os registros armazenados, fazendo com que a tabela retorne ao seu estado inicial de declaração, que possui exatamente **zero linhas** (`lines( codigos ) = 0`). Ele não deixa "linhas vazias" na coleção.
