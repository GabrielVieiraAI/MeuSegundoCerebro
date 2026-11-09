---
title: "Quiz - Using Code Pushdown in ABAP SQL"
source: "https://learning.sap.com/courses/deepening-your-abap-programming-knowledge/using-code-pushdown-in-abap-sql_quiz"
created: 2026-11-03
tags:
  - sap
  - abap
  - abap-cloud
  - quiz
  - abap-sql
  - code-pushdown
  - joins
---
**Roteiro de Estudos Relacionado:** [[Roteiro de Estudos SAP]]

# SAP Learning - Deepening Your ABAP Programming Knowledge
## Quiz: Using Code Pushdown in ABAP SQL

> [!NOTE] Instruções de Estudo Ativo
> Responda mentalmente a cada uma das questões antes de expandir o bloco retrátil contendo o gabarito oficial e a explicação conceitual.

---

### Pergunta 1
**Qual é o principal benefício de arquitetura e desempenho obtido ao adotar o paradigma do Code Pushdown (Code-to-Data) em consultas ABAP SQL no SAP HANA?**

- **A.** Eliminar a necessidade de declarar chaves primárias nas tabelas do banco de dados.
- **B.** Transferir operações intensivas de filtragem, cálculos, junções e condensações para o banco de dados in-memory, minimizando o tráfego de rede e o consumo de memória no servidor de aplicação.
- **C.** Permitir o uso irrestrito de comandos obsoletos como `SELECT *`.
- **D.** Desabilitar automaticamente os logs do sistema.

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **B**  
> **Fundamentação Técnica:** O paradigma do *Code Pushdown* tem como premissa executar o processamento de dados o mais próximo possível de onde eles residem fisicamente (no SAP HANA). Ao delegar cruzamentos, cálculos e agregações para o motor in-memory, o sistema evita transferir milhões de linhas brutas pela rede (*Network Round-Trips*), entregando ao servidor ABAP apenas o resultado consolidado e final.

---

### Pergunta 2
**Se você precisar extrair todos os registros de uma tabela principal de clientes, garantindo que os clientes que ainda não possuem nenhuma ordem de venda emitida continuem aparecendo no resultado da consulta, qual tipo de junção relacional deve ser empregado no ABAP SQL?**

- **A.** `INNER JOIN`
- **B.** `CROSS JOIN`
- **C.** `LEFT OUTER JOIN`
- **D.** `RIGHT INNER JOIN`

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **C**  
> **Fundamentação Técnica:** O **`LEFT OUTER JOIN`** preserva todas as linhas da tabela situada à esquerda na cláusula, independentemente de haver ou não correspondência na tabela secundária à direita. Quando não houver registro correspondente, os campos da tabela à direita são preenchidos com valores nulos/iniciais, permitindo identificar clientes sem pedidos sem excluí-los do relatório.

---

### Pergunta 3
**No ABAP SQL moderno, ao referenciar uma constante ou variável local do programa ABAP dentro de uma cláusula `WHERE`, `FIELDS` ou `HAVING`, qual símbolo de escape deve preceder obrigatoriamente o nome da variável?**

- **A.** `#`
- **B.** `&`
- **C.** `:`
- **D.** `@`

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **D**  
> **Fundamentação Técnica:** No ABAP SQL contemporâneo, variáveis hospedeiras (*Host Variables*) devem ser precedidas obrigatoriamente pelo caractere de escape **`@`** (exemplo: `WHERE carrid = @lv_carrid`). Isso permite que o compilador distinga claramente os identificadores de colunas do banco de dados dos objetos de dados declarados no programa ABAP.

---

### Pergunta 4
**Qual é a diferença fundamental entre as funções numéricas embutidas do SQL `DIV( x, y )` e `DIVISION( x, y, decimals )`?**

- **A.** A função `DIV` realiza divisão decimal com arredondamento, enquanto `DIVISION` calcula apenas números negativos.
- **B.** A função `DIV` executa a divisão inteira e trunca/descarta o resto, enquanto `DIVISION` calcula o resultado decimal com o número especificado de casas decimais aplicando arredondamento comercial.
- **C.** Ambas possuem funcionamento idêntico e são sinônimas no kernel do SAP HANA.
- **D.** `DIV` só aceita inteiros de 8 bytes (`INT8`).

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **B**  
> **Fundamentação Técnica:** A função `DIV( x, y )` executa uma divisão inteira pura, descartando qualquer fração decimal restante (por exemplo, `DIV( 5, 2 ) = 2`). Já a função `DIVISION( x, y, dec )` preserva as casas decimais informadas no terceiro parâmetro e aplica arredondamento comercial padrão.

---

### Pergunta 5
**Qual função embutida de string do ABAP SQL permite concatenar dois campos de texto inserindo automaticamente uma quantidade definida de espaços em branco entre eles diretamente no banco de dados?**

- **A.** `CONCAT`
- **B.** `CONCAT_WITH_SPACE`
- **C.** `SPLIT_AND_MERGE`
- **D.** `APPEND_SPACE`

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **B**  
> **Fundamentação Técnica:** Enquanto a função `CONCAT( a, b )` e o operador `&&` unem strings sem inserir nenhum espaçamento, a função **`CONCAT_WITH_SPACE( arg1, arg2, spaces )`** injeta a quantidade informada no terceiro parâmetro de espaços entre os dois textos, sendo ideal para montar nomes completos (`CONCAT_WITH_SPACE( first_name, last_name, 1 )`).

---

### Pergunta 6
**Ao realizar um `LEFT OUTER JOIN`, colunas da tabela à direita que não possuem correspondência retornam o valor `NULL` na base de dados. Qual função do ABAP SQL deve ser utilizada para substituir esse valor nulo por um valor padrão seguro (como zero ou uma descrição fixa)?**

- **A.** `IS_NULL`
- **B.** `NULLIF`
- **C.** `COALESCE`
- **D.** `DEFAULT`

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **C**  
> **Fundamentação Técnica:** A função **`COALESCE( arg1, arg2, ... )`** avalia a lista de argumentos da esquerda para a direita e retorna o primeiro valor que **não seja nulo**. No caso de um outer join, `COALESCE( b~flight_price, 0 )` garante que, caso o preço venha nulo por ausência de reserva, o número zero seja adotado na expressão.

---

### Pergunta 7
**Qual é a distinção lógica e cronológica correta entre a cláusula `WHERE` e a cláusula `HAVING` em uma consulta ABAP SQL que utiliza agrupamento (`GROUP BY`) e funções de agregação?**

- **A.** `WHERE` filtra os registros consolidados após a agregação, enquanto `HAVING` filtra antes.
- **B.** `WHERE` filtra linhas individuais antes que as agregações e agrupamentos ocorram; `HAVING` filtra os grupos de resultados consolidados após a execução das funções de agregação.
- **C.** A cláusula `HAVING` é opcional e pode ser utilizada em substituição ao `ON` de um join.
- **D.** Não há diferença prática; ambas atuam no mesmo momento de execução.

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **B**  
> **Fundamentação Técnica:** A cláusula **`WHERE`** restringe quais registros individuais participam do processamento da query antes do agrupamento. Após as linhas serem agrupadas e as métricas calculadas pelo `GROUP BY` e funções de agregação (`SUM`, `COUNT`, etc.), a cláusula **`HAVING`** entra em ação para filtrar quais grupos atendem à condição final (ex: `HAVING SUM( price ) > 50000`).

---

### Pergunta 8
**Em uma consulta ABAP SQL que combina colunas descritivas normais com funções de agregação (como `SUM` ou `AVG`), qual regra é mandatória em relação à cláusula `GROUP BY`?**

- **A.** Apenas a chave primária da tabela deve constar na cláusula `GROUP BY`.
- **B.** Todas as colunas presentes na lista de projeção do `SELECT` que NÃO sejam funções de agregação DEVEM constar obrigatoriamente na cláusula `GROUP BY`.
- **C.** O `GROUP BY` é opcional se a tabela possuir menos de 1000 registros.
- **D.** Não é permitido utilizar colunas normais e funções de agregação na mesma consulta.

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **B**  
> **Fundamentação Técnica:** É uma regra sintática e relacional estrita do SQL: se houver funções de agregação na lista de seleção ao lado de colunas comuns, **todas as colunas não agregadas devem ser listadas na cláusula `GROUP BY`**, definindo as dimensões exatas pelas quais o banco de dados consolidará as métricas.
