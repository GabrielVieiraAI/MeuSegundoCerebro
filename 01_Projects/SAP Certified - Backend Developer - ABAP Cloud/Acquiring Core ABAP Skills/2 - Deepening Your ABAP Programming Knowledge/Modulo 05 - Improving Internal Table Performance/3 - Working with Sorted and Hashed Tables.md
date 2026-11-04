---
title: "Trabalhando com Tabelas Ordenadas e Tabelas Hash"
source: "https://learning.sap.com/courses/deepening-your-abap-programming-knowledge/working-with-sorted-and-hashed-tables"
created: 2026-11-03
tags:
  - sap
  - abap
  - abap-cloud
  - tabelas-internas
  - sorted-tables
  - hashed-tables
  - performance
  - complexidade-algoritmica
---
**Roteiro de Estudos Relacionado:** [[Roteiro de Estudos SAP]]

# Objetivos

Após concluir esta lição, você será capaz de:
- Identificar as características estruturais e as diferenças de acesso entre **Standard Tables**, **Sorted Tables** e **Hashed Tables**.
- Explicar a complexidade algorítmica de busca (Big-O: $O(N)$, $O(\log N)$ e $O(1)$) de cada categoria de tabela interna.
- Declarar e manipular tabelas ordenadas garantindo a manutenção automática de índices.
- Declarar tabelas hash com chave única e compreender as restrições de acesso (ausência de índice posicional e exigência de chave completa para acesso $O(1)$).
- Selecionar a categoria de tabela interna ideal para cada padrão de uso de negócio.

---

## 1. As Três Categorias de Tabelas Internas

No ABAP, a escolha da categoria de tabela interna dita a forma como os dados são organizados na memória RAM e a velocidade com que o sistema consegue localizar registros:

```text
+-------------------------------------------------------------------------------+
|                       Categorias de Tabelas Internas                          |
+-------------------------------------------------------------------------------+
| 1. STANDARD TABLE: Gerenciamento linear baseado em índice sequencial.         |
| 2. SORTED TABLE:   Mantida continuamente ordenada por uma chave primária.     |
| 3. HASHED TABLE:   Gerenciada por um algoritmo de hash de tempo constante.    |
+-------------------------------------------------------------------------------+
```

---

## 2. Standard Tables (Tabelas Padrão)

É a categoria padrão e mais flexível, porém a menos performática para pesquisas repetitivas por chave:
* **Chave:** Deve ser declarada como não única (`WITH NON-UNIQUE KEY` ou `WITH EMPTY KEY`).
* **Inserção:** Altamente eficiente via comando **`APPEND`**, adicionando registros no final da tabela com complexidade $O(1)$.
* **Busca por Chave:** Se acessada sem `BINARY SEARCH`, o sistema executa uma **varredura linear com complexidade $O(N)$**. Se a tabela possuir 1 milhão de linhas, o sistema pode percorrer 1 milhão de posições a cada leitura.

```abap
DATA lt_standard TYPE STANDARD TABLE OF /lrn/flight 
                 WITH NON-UNIQUE KEY carrid connid.
```

---

## 3. Sorted Tables (Tabelas Ordenadas)

Em uma **Sorted Table**, o kernel do ABAP garante que os registros permaneçam **sempre ordenados em memória** com base na chave primária:
* **Chave:** Pode ser única (`WITH UNIQUE KEY`) ou não única (`WITH NON-UNIQUE KEY`).
* **Busca por Chave:** Utiliza **busca binária automática com complexidade logarítmica $O(\log N)$**. O desenvolvedor **não** precisa (e nem deve) utilizar a instrução `BINARY SEARCH`.
* **Acesso Parcial:** Permite buscas eficientes mesmo que apenas a parte inicial da chave seja informada (*Prefix Key Access*).
* **Inserção:** Utiliza a instrução **`INSERT ... INTO TABLE`**. O sistema localiza a posição correta na árvore ordenada e insere o registro.
  > [!WARNING] Atenção ao Comando APPEND
  > Se você utilizar `APPEND` em uma Sorted Table e o registro fornecido violar a ordem alfabética/numérica da chave primária, o programa sofrerá um erro fatal em tempo de execução (*Short Dump* `ITAB_ILLEGAL_SORT_ORDER`).

```abap
DATA lt_sorted TYPE SORTED TABLE OF /lrn/carrier 
               WITH UNIQUE KEY carrid.

" Inserção na posição ordenada correta:
INSERT VALUE #( carrid = 'LH' carrname = 'Lufthansa' ) INTO TABLE lt_sorted.
```

---

## 4. Hashed Tables (Tabelas Hash)

Uma **Hashed Table** é a estrutura mais poderosa da SAP para lookups e pesquisas pontuais em grandes volumes de dados (equivalente a uma *HashMap / Dictionary* de outras linguagens):

* **Chave Obrigatória:** A chave primária **DEVE ser estritamente ÚNICA** (`WITH UNIQUE KEY`).
* **Algoritmo de Hash Interno:** O kernel calcula um código hash a partir dos valores da chave primária e mapeia a linha diretamente em uma tabela de espalhamento em memória.
* **Complexidade Absoluta $O(1)$:** A busca por chave possui **tempo constante**. Encontrar um cliente em uma Hashed Table demora exatamente o mesmo tempo quer ela tenha 10 clientes ou 5.000.000 de clientes!

### Restrições Críticas das Tabelas Hash:
1. **Sem Índice Numérico Posicional:** Hashed tables **não possuem índice linear**. Comandos como `READ TABLE itab INDEX 5` ou `itab[ 5 ]` causam erro de sintaxe no compilador!
2. **Exigência da Chave Completa:** Para usufruir da busca instantânea $O(1)$, a leitura deve fornecer **todos os campos que compõem a chave primária**. Se você omitir um dos campos da chave, o sistema será forçado a fazer uma busca linear custosa.
3. **Inserção:** Realizada exclusivamente via **`INSERT ... INTO TABLE`**. Comandos `APPEND` são proibidos pelo compilador.

```abap
DATA lt_hashed_customers TYPE HASHED TABLE OF /lrn/customer
                         WITH UNIQUE KEY customer_id.

" Leitura instantânea O(1) com a chave completa:
DATA(ls_customer) = lt_hashed_customers[ customer_id = '00000042' ].
```

---

## 5. Matriz Comparativa de Complexidade (Big-O)

| Critério de Comparação | Standard Table | Sorted Table | Hashed Table |
| :--- | :---: | :---: | :---: |
| **Tipo de Chave Permitido** | Apenas `NON-UNIQUE` (ou `EMPTY`) | `UNIQUE` ou `NON-UNIQUE` | **Obrigatoriamente `UNIQUE`** |
| **Acesso por Índice (`INDEX i`)** | Sim ($O(1)$) | Sim ($O(1)$) | **Não permitido** |
| **Acesso por Chave Primária** | Linear $O(N)$ *(ou $O(\log N)$ com BINARY SEARCH)* | Logarítmico **$O(\log N)$** | Tempo Constante **$O(1)$** |
| **Inserção Rápida** | `APPEND` ($O(1)$) | `INSERT` ($O(\log N)$) | `INSERT` ($O(1)$) |
| **Melhor Cenário de Uso** | Carregamento sequencial em massa, tabelas pequenas ou leitura por índice numérico. | Dados que precisam ser iterados ordenadamente ou acessados por partes da chave. | **Lookups e pesquisas pontuais repetitivas por chave em tabelas com grande volume de dados.** |

---

## Resumo da Lição

- **Standard Tables** são ideais para carregar dados sequencialmente no fim com `APPEND`, mas lentas para buscas por chave ($O(N)$).
- **Sorted Tables** mantêm dados permanentemente ordenados, com busca binária nativa automática de complexidade $O(\log N)$.
- **Hashed Tables** utilizam algoritmo de hash com complexidade de tempo constante **$O(1)$**, independentemente do tamanho da tabela.
- Hashed Tables exigem chave única (`WITH UNIQUE KEY`), não suportam acesso por índice numérico e requerem o preenchimento de toda a chave primária para garantir o tempo $O(1)$.
- Em tabelas Sorted e Hashed, a inserção deve ser realizada com **`INSERT ... INTO TABLE`**.
