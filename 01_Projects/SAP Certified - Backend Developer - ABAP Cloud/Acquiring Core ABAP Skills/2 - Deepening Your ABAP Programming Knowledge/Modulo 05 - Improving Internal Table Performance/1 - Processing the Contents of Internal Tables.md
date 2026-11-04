---
title: "Processando o Conteúdo de Tabelas Internas"
source: "https://learning.sap.com/courses/deepening-your-abap-programming-knowledge/processing-the-contents-of-internal-tables"
created: 2026-11-03
tags:
  - sap
  - abap
  - abap-cloud
  - tabelas-internas
  - table-expressions
  - reduce
  - performance
---
**Roteiro de Estudos Relacionado:** [[Roteiro de Estudos SAP]]

# Objetivos

Após concluir esta lição, você será capaz de:
- Contrastar o acesso posicional por índice numérico (*Index Access*) com o acesso relacional por chave (*Key Access*).
- Aplicar o comando `SORT` em tabelas padrão para viabilizar buscas binárias de alta performance (`BINARY SEARCH`).
- Utilizar Expressões de Tabela (*Table Expressions*) modernas em substituição a comandos procedurais `READ TABLE`.
- Capturar e tratar a exceção `CX_SY_ITAB_LINE_NOT_FOUND` ou aplicar o operador `OPTIONAL`.
- Construir totalizações e condensações de dados em memória utilizando Expressões de Redução (**`REDUCE`**).

---

## 1. Técnicas de Acesso: Índice vs. Chave

Tabelas internas são as estruturas em memória mais utilizadas em programas ABAP. A eficiência do acesso depende da técnica de busca empregada:

| Forma de Acesso | Sintaxe Clássica | Sintaxe Moderna (*Table Expression*) | Complexidade em Tabela Standard |
| :--- | :--- | :--- | :---: |
| **Acesso por Índice (*Index Access*)** | `READ TABLE itab INDEX 5 INTO wa.` | `DATA(wa) = itab[ 5 ].` | **$O(1)$** (Instantâneo) |
| **Busca Sequencial por Chave** | `READ TABLE itab WITH KEY id = 'A' INTO wa.` | `DATA(wa) = itab[ id = 'A' ].` | **$O(N)$** (Degrada com o volume) |
| **Busca Binária por Chave** | `READ TABLE itab WITH KEY id = 'A' BINARY SEARCH INTO wa.` | *Requer chave secundária ou tabela Sorted* | **$O(\log N)$** (Logarítmica e veloz) |

---

## 2. A Busca Binária em Tabelas Padrão (`BINARY SEARCH`)

Por padrão, a leitura por chave em uma tabela standard realiza uma **varredura linear (*Linear Search*)**, testando linha por linha desde a primeira até encontrar o registro ou atingir o fim da tabela. Se a tabela possuir 100.000 linhas, a busca pode testar 100.000 registros!

Para acelerar buscas em tabelas standard, utiliza-se a técnica de **Busca Binária (*Binary Search*)**:

```abap
" 1. A tabela DEVE ser previamente ordenada exatamente pelos campos da chave:
SORT lt_flights BY carrid connid.

" 2. A leitura utiliza a adição BINARY SEARCH:
READ TABLE lt_flights WITH KEY carrid = 'LH' 
                               connid = '0400' 
                      BINARY SEARCH 
                      INTO DATA(ls_flight).
IF sy-subrc = 0.
  " Registro localizado em fração de milissegundos
ENDIF.
```

> [!CAUTION] O Perigo da Busca Binária com Ordenação Divergente
> Se a tabela interna **não** estiver ordenada exatamente pelos mesmos campos especificados na cláusula `WITH KEY`, a busca binária falhará silenciosamente, retornando `sy-subrc = 4` mesmo quando o registro existir na tabela!

---

## 3. Expressões de Tabela Modernas (*Table Expressions*)

No ABAP contemporâneo, a leitura procedural `READ TABLE ... INTO ...` foi substituída por expressões compactas utilizando colchetes `itab[ ... ]`:

```abap
" Leitura por índice:
DATA(ls_first_row) = lt_customers[ 1 ].

" Leitura por chave com condição de busca:
DATA(ls_customer)  = lt_customers[ customer_id = '00000100' ].

" Acesso encadeado direto a um campo específico da linha:
DATA(lv_city)      = lt_customers[ customer_id = '00000100' ]-city.
```

### Tratamento de Linhas Inexistentes
Se a linha pesquisada não existir:
1. **Comportamento Padrão:** O sistema dispara a exceção tratável **`CX_SY_ITAB_LINE_NOT_FOUND`**.
2. **Uso do Operador `OPTIONAL` com `VALUE`:** Para evitar dumps sem precisar de blocos `TRY/CATCH`, utilize `VALUE #( itab[ ... ] OPTIONAL )`. Se a linha não for encontrada, a variável recebe o valor inicial padrão:

```abap
DATA(ls_safe_read) = VALUE #( lt_customers[ customer_id = '99999999' ] OPTIONAL ).
IF ls_safe_read IS NOT INITIAL.
  " Linha localizada com sucesso
ENDIF.
```

---

## 4. Totalizações Elegantes com Expressões de Redução (`REDUCE`)

Em vez de abrir um laço procedural `LOOP AT itab INTO wa` apenas para acumular a soma de um campo numérico, o ABAP moderno fornece o operador funcional **`REDUCE`**:

```abap
" Calcula o faturamento total somando a coluna 'price' de todos os registros:
DATA(lv_total_revenue) = REDUCE /lrn/total_amount(
  INIT lv_sum = 0
  FOR ls_flight IN lt_flights
  WHERE ( carrid = 'LH' )
  NEXT lv_sum = lv_sum + ls_flight-price ).
```

* **`INIT lv_sum = 0`:** Declara e inicializa a variável acumuladora em memória.
* **`FOR ls_flight IN lt_flights`:** Itera sobre as linhas da tabela interna (com suporte opcional a filtros `WHERE`).
* **`NEXT lv_sum = lv_sum + ...`:** Define a regra de acumulação matemática a cada iteração.

---

## Resumo da Lição

- A busca linear em tabelas standard possui complexidade $O(N)$, degradando a performance em grandes volumes.
- A adição `BINARY SEARCH` reduz a busca para complexidade logarítmica $O(\log N)$, mas exige que a tabela esteja estritamente ordenada pelos campos da chave.
- **Expressões de Tabela (`itab[ ... ]`)** simplificam leituras inline; utilize `VALUE #( itab[...] OPTIONAL )` para evitar a exceção `CX_SY_ITAB_LINE_NOT_FOUND`.
- O operador funcional **`REDUCE`** consolida somatórios e métricas em tabelas internas de forma declarativa e concisa.
