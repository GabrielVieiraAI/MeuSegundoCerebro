---
tipo: clippings
title: "Quiz: Using Code Pushdown in CDS Views"
source: "https://learning.sap.com/courses/building-data-models-with-the-abap-dictionary-and-abap-core-data-services/using-code-pushdown-in-cds-views_16f457fe-4be1-3906-82eb-3aed219cee58"
created: 2026-11-03
tags:
  - sap
  - abap
  - abap-cloud
  - quiz
  - cds
  - code-pushdown
  - sql-expressions
  - built-in-functions
  - input-parameters
  - aggregations
---
**Roteiro de Estudos Relacionado:** [[Roteiro de Estudos SAP]]

# SAP Learning - Building Data Models with the ABAP Dictionary and ABAP Core Data Services
## Quiz Oficial: Using Code Pushdown in CDS Views

> [!NOTE] Instruções de Estudo Ativo
> Tente responder a cada uma das questões mentalmente ou registrando suas opções antes de expandir o bloco retrátil de **Gabarito e Explicação Oficial**.

---

### Pergunta 1
**Conversões de tipo no ABAP CDS são realizadas utilizando a expressão `CONV( )`.**  
*(Verdadeiro ou Falso)*

- **A.** Verdadeiro (*True*)
- **B.** Falso (*False*)

> [!success]- Gabarito e Explicação Oficial da SAP
> **Resposta Correta:** **B** (Falso)  
> 
> **Fundamentação Oficial da SAP:**  
> No ABAP CDS, conversões de tipo técnicas e semânticas são realizadas exclusivamente através da expressão **`CAST( ... AS ... )`**. O operador de conversão `CONV( )` é uma construção da linguagem ABAP imperativa e não existe no compilador DDL do CDS.

---

### Pergunta 2
**Você define uma CDS View Entity com um parâmetro de entrada (*Input Parameter*). Em quais das seguintes posições de operando você pode utilizar esse parâmetro?**  
*(Seleção Múltipla - Escolha as respostas corretas)*

- **A.** Como valor de entrada para uma expressão SQL (*Input for an SQL expression*).
- **B.** Como valor de filtro em uma associação filtrada (*Filter value in a filtered association*).
- **C.** Como valor de filtro na cláusula `WHERE` (*Filter value in the WHERE clause*).
- **D.** Como valor de entrada para o parâmetro de outra CDS View Entity (*As value for the input parameter of another CDS view entity*).

> [!success]- Gabarito e Explicação Oficial da SAP
> **Respostas Corretas:** **A**, **B**, **C** e **D** (Todas as opções são válidas)  
> 
> **Fundamentação Oficial da SAP:**  
> Parâmetros de entrada no ABAP CDS (acessados com o prefixo `$parameters.`) possuem ampla flexibilidade sintática e podem ser utilizados como operandos em expressões SQL/CASE/funções, como filtros em expressões de caminho, na cláusula `WHERE` e para repassar valores a parâmetros de visões subjacentes (*Parameter Forwarding*).

---

### Pergunta 3
**Todas as funções integradas (*Built-in Functions*) que podem ser utilizadas no ABAP SQL também estão disponíveis para uso no ABAP CDS.**  
*(Verdadeiro ou Falso)*

- **A.** Verdadeiro (*True*)
- **B.** Falso (*False*)

> [!success]- Gabarito e Explicação Oficial da SAP
> **Resposta Correta:** **B** (Falso)  
> 
> **Fundamentação Oficial da SAP:**  
> Existem funções integradas suportadas no ABAP SQL que **não** estão disponíveis no ABAP CDS, especialmente funções de string baseadas em expressões regulares e funções genéricas de data/hora (como `IS_VALID`, `ADD_DAYS`, `DAYS_BETWEEN` e extratores como `WEEKDAY`). No CDS, exigem-se funções de data específicas de tipo como `DATS_DAYS_BETWEEN`.

---

### Pergunta 4
**Qual das seguintes técnicas SQL está disponível no ABAP SQL, mas NÃO é suportada em ABAP CDS Views?**  
*(Seleção Única)*

- **A.** `DISTINCT`
- **B.** `ORDER BY`
- **C.** `GROUP BY`
- **D.** `UNION`

> [!success]- Gabarito e Explicação Oficial da SAP
> **Resposta Correta:** **B** (`ORDER BY`)  
> 
> **Fundamentação Oficial da SAP:**  
> A cláusula `ORDER BY` **não** é suportada na definição de CDS Views. Por definição na teoria de bancos de dados relacionais, uma visão representa um conjunto desordenado de dados. A ordenação deve ser aplicada na camada de consumo (no comando `SELECT` do ABAP SQL ou na camada de apresentação do SAP Fiori). Em contrapartida, as técnicas `DISTINCT`, `GROUP BY` e `UNION` são plenamente suportadas no ABAP CDS.
