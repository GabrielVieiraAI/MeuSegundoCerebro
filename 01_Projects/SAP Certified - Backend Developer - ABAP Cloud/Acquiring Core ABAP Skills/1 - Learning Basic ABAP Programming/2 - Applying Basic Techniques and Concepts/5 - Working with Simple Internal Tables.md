---
title: "Trabalhando com Tabelas Internas Simples"
source: "https://learning.sap.com/courses/basic-abap-programming/working-with-simple-internal-tables_a4beb937-0c7b-45b9-92be-ff26a5159fad"
created: 2026-10-20
tags:
  - sap
  - abap
  - abap-cloud
  - adt
  - tabelas-internas
  - colecoes
---
**Roteiro de Estudos Relacionado:** [[Roteiro de Estudos SAP]]
# Objetivos
Após concluir esta lição, você será capaz de:
- Definir e declarar tabelas internas simples (*Simple Internal Tables*).
- Inserir dados com a instrução `APPEND` e limpar tabelas com `CLEAR`.
- Ler registros específicos utilizando expressões de tabela modernas (`itab[ index ]`).
- Percorrer tabelas em laços com `LOOP AT ... INTO DATA(...)` e formatar saídas no console.

---

## 1. O que são Tabelas Internas Simples?

Uma **Tabela Interna (*Internal Table / itab*)** é uma estrutura de dados dinâmica em memória RAM utilizada para armazenar uma coleção de múltiplos registros que compartilham o mesmo tipo técnico.

> [!NOTE]
> **Analogia:** Pense na tabela interna como uma lista dinâmica (como um `List<T>` em C# ou Java, ou um `array` dinâmico em JavaScript/Python). Ela começa com zero linhas e expande ou reduz conforme você adiciona ou remove elementos.

![[01_-_Define_Simple_itab_001.png]]

* **Tipo de Linha (*Row Type / Line Type*):** Define o formato técnico de cada elemento armazenado (ex: inteiros `i`, textos `string` ou estruturas complexas).
* **Capacidade:** O número de linhas não é fixado previamente; a tabela é limitada apenas pela memória disponível do servidor de aplicação.
* **Estado Inicial:** Uma tabela interna recém-declarada inicia vazia (com exatamente 0 linhas).

---

## 2. Declaração e Tipos de Tabela (*Table Types*)

Podemos declarar tabelas internas de três maneiras no ABAP:

![[01_-_Define_Simple_itab_002.png]]

| Abordagem | Como Declarar | Exemplo |
| :--- | :--- | :--- |
| **1. Direta na Variável** | Usa `TYPE TABLE OF <tipo>` no comando `DATA`. | `DATA numbers TYPE TABLE OF i.` |
| **2. Tipo de Tabela Local (`TYPES`)** | Cria um tipo reutilizável dentro da classe/programa. | `TYPES tt_strings TYPE TABLE OF string.`<br/>`DATA texts TYPE tt_strings.` |
| **3. Tipo Global do Dicionário de Dados** | Utiliza tipos de tabela pré-configurados globalmente no SAP (DDIC). | `DATA texts TYPE string_table.` |

---

## 3. Manipulação de Dados em Tabelas Internas

### 1. Inserir Linhas com `APPEND`

<iframe 
    src="https://cdnapisec.kaltura.com/p/1921661/embedPlaykitJs/uiconf_id/50355372?iframeembed=true&entry_id=1_d7ntsls8" 
    width="100%" 
    height="400" 
    allowfullscreen 
    frameborder="0">
</iframe>

A instrução **`APPEND`** adiciona uma nova linha no **final** da tabela interna:

```abap
DATA numbers TYPE TABLE OF i.

APPEND 10 TO numbers.
APPEND 20 TO numbers.
APPEND 30 TO numbers.
```

---

### 2. Limpar a Tabela com `CLEAR`
O comando **`CLEAR`** remove todos os registros da tabela interna, redefinindo o seu número de linhas para zero:

![[02_Process_data_simple_itab_002.png]]

```abap
CLEAR numbers. " Agora a tabela volta a ter 0 linhas
```

---

### 3. Leitura de Linha Única com Expressões de Tabela (*Table Expressions*)
Para acessar diretamente uma linha específica pelo seu índice numérico, utilizamos a sintaxe de colchetes `tabela[ indice ]`:

![[02_Process_data_simple_itab_003.png]]

```abap
DATA(valor_linha_2) = numbers[ 2 ].
out->write( |Conteúdo da Linha 1: { numbers[ 1 ] }| ).
```

> [!IMPORTANT]
> **Atenção aos Detalhes de Sintaxe e Exceções:**
> 1. **Espaçamento Obrigatório:** Deve haver pelo menos um espaço após o colchete de abertura `[` e antes do fechamento `]`: `numbers[ 1 ]`.
> 2. **Base 1:** A primeira linha de uma tabela interna é o índice **1** (e não 0).
> 3. **Risco de Erro:** Se você tentar ler um índice que não existe (ex: tentar ler a linha 5 de uma tabela que só possui 2 linhas), o sistema disparará a exceção **`cx_sy_itab_line_not_found`**.

---

### 4. Percorrer a Tabela em um Laço (`LOOP AT ... ENDLOOP`)

<iframe 
    src="https://cdnapisec.kaltura.com/p/1921661/embedPlaykitJs/uiconf_id/50355372?iframeembed=true&entry_id=1_g9c31mzw" 
    width="100%" 
    height="400" 
    allowfullscreen 
    frameborder="0">
</iframe>

![[02_Process_data_simple_itab_005.png]]

Para iterar por todas as linhas da tabela sequencialmente, utilizamos a estrutura `LOOP AT`. No ABAP moderno, podemos declarar a variável de trabalho (*work area*) diretamente na linha usando **`INTO DATA(...)`**:

```abap
LOOP AT numbers INTO DATA(number).
  out->write( |Linha { sy-tabix }: { number }| ).
ENDLOOP.
```

* **Vantagem de `INTO DATA(...)`:** O compilador infere o tipo da variável automaticamente a partir do tipo de linha da tabela interna, evitando declarações manuais redundantes.
* **Variável de Sistema `sy-tabix`:** Contém o número sequencial da linha que está sendo processada no ciclo atual (1, 2, 3...).

---

## 4. Prática Guiada: Testando Operações Básicas

Copie o código abaixo para o método `main` da sua classe de testes no Eclipse ADT para verificar o comportamento:

```abap
* Declarações
**********************************************************************
    DATA numbers TYPE TABLE OF i.
    DATA number  TYPE i VALUE 1234.

* Exemplo 1: Inserção com APPEND
**********************************************************************
    APPEND 4711       TO numbers.
    APPEND number     TO numbers.
    APPEND 2 * number TO numbers.

    out->write( |--- Exemplo 1: Inserção com APPEND ---| ).
    out->write( numbers ).

* Exemplo 2: Limpeza com CLEAR
**********************************************************************
    CLEAR numbers.
    out->write( |--- Exemplo 2: Tabela após CLEAR (vazia) ---| ).
    out->write( numbers ).

* Exemplo 3: Expressões de Tabela (Acesso por Índice)
**********************************************************************
    APPEND 4711       TO numbers.
    APPEND number     TO numbers.
    APPEND 2 * number TO numbers.

    out->write( |--- Exemplo 3: Expressão de Tabela ---| ).
    number = numbers[ 2 ].
    out->write( |Conteúdo da linha 2: { number }| ).
    out->write( |Acesso direto no template (linha 1): { numbers[ 1 ] }| ).

* Exemplo 4: Laço LOOP AT com Declaração Inline
**********************************************************************
    out->write( |--- Exemplo 4: LOOP AT com sy-tabix ---| ).
    LOOP AT numbers INTO DATA(item).
      out->write( |Linha: { sy-tabix } | Conteúdo: { item }| ).
    ENDLOOP.
```

---

## 5. Exercício Prático: Sequência de Fibonacci em Tabela Interna

Neste exercício, você calculará os primeiros números da sequência de Fibonacci utilizando um laço `DO` e armazenará os resultados em uma tabela interna, formatando a exibição final em uma segunda tabela interna de strings.

> [!NOTE]
> **Regra de Fibonacci:** Cada número é a soma dos dois anteriores. A sequência inicia com `0` e `1` ($0, 1, 1, 2, 3, 5, 8, 13, 21 \dots$).

### Passo a Passo da Solução:

1. No Eclipse ADT, crie a classe **`ZCL_##_ITERATE`** com a interface **`IF_OO_ADT_CLASSRUN`**.
2. No método `if_oo_adt_classrun~main`, insira a lógica completa:

```abap
METHOD if_oo_adt_classrun~main.
  * 1. Declarações
  ********************************************************************
  CONSTANTS max_count TYPE i VALUE 20.
  DATA numbers TYPE TABLE OF i.
  DATA output  TYPE TABLE OF string.

  * 2. Cálculo de Fibonacci e Preenchimento da Tabela
  ********************************************************************
  DO max_count TIMES.
    CASE sy-index.
      WHEN 1.
        APPEND 0 TO numbers.
      WHEN 2.
        APPEND 1 TO numbers.
      WHEN OTHERS.
        " Soma os dois termos anteriores usando expressões de tabela:
        APPEND numbers[ sy-index - 2 ] + numbers[ sy-index - 1 ]
            TO numbers.
    ENDCASE.
  ENDDO.

  * 3. Formatação da Saída com Alinhamento em String Template
  ********************************************************************
  DATA(counter) = 0.
  LOOP AT numbers INTO DATA(number).
    counter = counter + 1.
    
    " Formata o índice com 4 caracteres à esquerda e o valor com 10 à direita:
    APPEND |{ counter WIDTH = 4 ALIGN = LEFT }: { number WIDTH = 10 ALIGN = RIGHT }|
        TO output.
  ENDLOOP.

  * 4. Exibição no Console do Eclipse
  ********************************************************************
  out->write(
    data = output
    name = |Os primeiros { max_count } números de Fibonacci|
  ).
ENDMETHOD.
```

3. Ative com **Ctrl + F3** e execute com **F9**.
4. **Resultado no Console:**
   ```text
   Os primeiros 20 números de Fibonacci
   1   :          0
   2   :          1
   3   :          1
   4   :          2
   5   :          3
   6   :          5
   ...
   20  :       4181
   ```

---

