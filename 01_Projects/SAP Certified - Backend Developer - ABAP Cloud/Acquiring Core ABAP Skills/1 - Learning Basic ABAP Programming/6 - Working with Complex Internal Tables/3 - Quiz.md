---
title: "Quiz - Working with Complex Internal Tables"
source: "https://learning.sap.com/courses/basic-abap-programming/working-with-complex-internal-tables_f8c923f3-6f95-4b47-960f-557001f13977"
created: 2026-10-21
tags:
  - sap
  - abap
  - abap-cloud
  - adt
  - quiz
---
**Roteiro de Estudos Relacionado:** [[Roteiro de Estudos SAP]]

# SAP Learning - Basic ABAP Programming
## Quiz: Trabalhando com Tabelas Internas Complexas (Working with Complex Internal Tables)

> [!INFO] Desempenho
> **Aprovação:** 3 de 4 questões corretas

---

### Pergunta 1
**Quais das opções a seguir podem ser usadas para preencher uma tabela interna? (Escolha duas opções)**

- **A.** `READ`
- **B.** `VALUE #( )`
- **C.** `LOOP...ENDLOOP`
- **D.** `APPEND`

---

### Pergunta 2
**O tipo `tt_table` foi definido da seguinte forma:**

```abap
TYPES tt_table TYPE STANDARD TABLE OF st_connection
               WITH NON-UNIQUE KEY carrier_id connection_id.
```

**Qual instrução `DATA` você utilizaria para criar uma tabela interna com esse tipo?**

- **A.**
  ```abap
  DATA table TYPE tt_table.
  ```
- **B.**
  ```abap
  DATA table TYPE TABLE OF tt_table.
  ```
- **C.**
  ```abap
  DATA table TYPE REF TO tt_table.
  ```

---

### Pergunta 3
**Você deseja ler dados de duas tabelas de banco de dados para que a instrução `SELECT` retorne um único conjunto de resultados sem entradas duplicadas. Qual técnica você utilizaria?**

- **A.** `LEFT OUTER JOIN`
- **B.** `UNION`
- **C.** `INNER JOIN`
- **D.** `UNION ALL`

---

### Pergunta 4
**Qual das afirmações a seguir é verdadeira para uma tabela interna do tipo Standard Table?**

- **A.** A chave é sempre única.
- **B.** A chave é sempre não única.
- **C.** Você pode escolher se a chave será única ou não única.

---

## Gabarito e Justificativas

| Questão | Resposta | Justificativa / Conceito Técnico |
| :---: | :---: | :--- |
| **P1** | **B, D** | No ABAP moderno, o operador construtor `VALUE #( ... )` é utilizado para preenchimento declarativo (*inline*) de tabelas internas, enquanto a instrução clássica `APPEND` insere linhas no final da tabela. `READ TABLE` é para leitura e `LOOP...ENDLOOP` itera sobre os dados existentes. |
| **P2** | **A** | Como o tipo `tt_table` já foi declarado explicitamente como um tipo de tabela completa (`TYPE STANDARD TABLE OF ...`), a variável deve ser tipada diretamente com `TYPE tt_table`. Utilizar `TYPE TABLE OF tt_table` declararia uma tabela interna aninhada (tabela de tabelas). |
| **P3** | **B** | No ABAP SQL, a instrução `UNION` combina os resultados de duas ou mais consultas em um único conjunto de linhas, eliminando automaticamente registros duplicados. `UNION ALL` preserva duplicatas, enquanto `JOIN` realiza combinação horizontal de colunas. |
| **P4** | **B** | Em uma `STANDARD TABLE`, a chave primária é **sempre não única** (`WITH NON-UNIQUE KEY`). Se houver necessidade de impor chave única garantida pelo *runtime*, deve-se utilizar `SORTED TABLE` ou `HASHED TABLE` com `WITH UNIQUE KEY`. |

---

## Conceitos-Chave

- **Preenchimento de Tabelas Internas:** Operações como `APPEND linha TO tabela` e o operador construtor moderno `VALUE #( ... )` populam linhas em tabelas internas na memória.
- **Tipos de Tabela vs. Tipos de Linha:** Quando um tipo já é declarado com `TYPES ... TYPE [STANDARD|SORTED|HASHED] TABLE OF`, ele já representa a tabela completa; sua instânciação usa `DATA itab TYPE tipo_tabela.` diretamente.
- **Combinação de Resultados com `UNION`:** A cláusula `UNION` no ABAP SQL une verticalmente os registros retornados de dois ou mais comandos `SELECT`, eliminando automaticamente duplicatas. Utilize `UNION ALL` para manter registros duplicados com ganho de performance.
- **Propriedades da `STANDARD TABLE`:** Tabelas padrão utilizam acesso sequencial ou por índice (`INDEX`) e sua chave é estritamente **não única** (`NON-UNIQUE KEY`). Para chaves únicas (`UNIQUE KEY`), devem ser utilizadas `SORTED TABLE` ou `HASHED TABLE`.
