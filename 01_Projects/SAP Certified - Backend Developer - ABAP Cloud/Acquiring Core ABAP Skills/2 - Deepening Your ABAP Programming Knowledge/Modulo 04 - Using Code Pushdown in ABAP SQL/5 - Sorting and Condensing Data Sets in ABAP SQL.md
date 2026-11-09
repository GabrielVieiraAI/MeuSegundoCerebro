---
title: "Ordenando e Condensando Conjuntos de Dados no ABAP SQL"
source: "https://learning.sap.com/courses/deepening-your-abap-programming-knowledge/sorting-and-condensing-data-sets-in-abap-sql"
created: 2026-11-03
tags:
  - sap
  - abap
  - abap-cloud
  - abap-sql
  - order-by
  - distinct
  - group-by
  - having
  - agregacao
  - code-pushdown
---
**Roteiro de Estudos Relacionado:** [[Roteiro de Estudos SAP]]

# Objetivos

Após concluir esta lição, você será capaz de:
- Enforçar a ordenação dos dados diretamente na camada de banco utilizando a cláusula **`ORDER BY`** (`ASC` / `DESC`), compreendendo seus ganhos em relação à instrução `SORT itab`.
- Eliminar registros redundantes e duplicados na origem com a cláusula **`DISTINCT`**.
- Aplicar funções de agregação nativas do SAP HANA: **`SUM`**, **`COUNT`**, **`AVG`**, **`MAX`** e **`MIN`**.
- Agrupar métricas por dimensões de negócio através da cláusula **`GROUP BY`**.
- Filtrar resultados agregados pós-processamento utilizando a cláusula **`HAVING`**, diferenciando-a claramente da cláusula `WHERE`.

---

## 1. Ordenação na Origem: A Cláusula `ORDER BY`

No paradigma clássico, era comum ler dados sem ordenação e executar o comando procedural `SORT lt_tabela BY campo.` no servidor de aplicação. 

No ambiente SAP S/4HANA, a ordenação deve ser transferida para o banco de dados:

```abap
SELECT FROM /lrn/flight
  FIELDS carrid,
         connid,
         fldate,
         price
  WHERE carrid = 'LH'
  ORDER BY carrid ASCENDING,
           price DESCENDING
  INTO TABLE @DATA(lt_sorted_flights).
```

### Por que ordenar no banco é mais eficiente?
1. **Otimização Colunar do SAP HANA:** O SAP HANA armazena tabelas em formato colunar indexado, permitindo que a ordenação seja executada em frações de microssegundos em múltiplos núcleos de CPU.
2. **Dados Pré-ordenados:** A tabela interna ABAP já é populada exatamente na sequência exigida pela tela ou pelo algoritmo de processamento posterior, economizando tempo de CPU do servidor de aplicação.

---

## 2. Eliminando Duplicatas com `DISTINCT`

Quando você deseja descobrir valores únicos presentes em uma tabela (por exemplo: quais companhias aéreas possuem voos cadastrados para determinado destino), trazer todas as linhas repetidas e usar `DELETE ADJACENT DUPLICATES` na tabela interna é um desperdício de banda de rede.

O modificador **`DISTINCT`** filtra as duplicatas diretamente no motor do banco de dados:

```abap
SELECT DISTINCT FROM /lrn/flight
  FIELDS carrid,
         countryfr,
         cityfrom
  WHERE countryfr = 'US'
  ORDER BY cityfrom
  INTO TABLE @DATA(lt_unique_cities).
```

---

## 3. Funções de Agregação no SAP HANA

As **Funções de Agregação (*Aggregate Functions*)** realizam condensações matemáticas sobre múltiplos registros, devolvendo métricas consolidadas:

| Função de Agregação | Descrição | Exemplo de Aplicação |
| :--- | :--- | :--- |
| **`SUM( col )`** | Calcula o somatório total da coluna numérica. | Faturamento total de reservas. |
| **`AVG( col )`** | Calcula a média aritmética da coluna. | Preço médio de passagens vendidas. |
| **`MAX( col )` / `MIN( col )`** | Localiza o maior e o menor valor da coluna. | Passagem mais cara e mais barata de um voo. |
| **`COUNT( * )`** | Conta o total absoluto de linhas atendidas pelo filtro. | Quantidade total de voos operados. |
| **`COUNT( DISTINCT col )`** | Conta a quantidade de valores distintos únicos daquela coluna. | Quantidade de clientes únicos que compraram passagens. |

---

## 4. Agrupamento com `GROUP BY`

Quando você combina colunas descritivas (dimensões) com funções de agregação (métricas), a cláusula **`GROUP BY`** é mandatória:

> [!IMPORTANT] Regra de Ouro do GROUP BY
> **Toda coluna presente na lista de projeção do `SELECT` que NÃO seja uma função de agregação DEVE, obrigatoriamente, constar na cláusula `GROUP BY`.**

```abap
SELECT FROM /lrn/booking
  FIELDS carrid,
         currency_code,
         COUNT( * )                 AS total_bookings,
         SUM( flight_price )        AS total_revenue,
         AVG( flight_price )        AS average_price,
         MAX( flight_price )        AS highest_ticket
  GROUP BY carrid, currency_code
  ORDER BY carrid, currency_code
  INTO TABLE @DATA(lt_revenue_summary).
```

---

## 5. Filtrando Agrupamentos: `WHERE` vs. `HAVING`

Um dos tópicos conceituais mais importantes do ABAP SQL é a distinção temporal e lógica entre as cláusulas de restrição:

```text
  [Tabela Bruta no Banco]
            |
            v
  +-------------------+
  | Cláusula WHERE    |  <-- Filtra LINHAS INDIVIDUAIS antes da agregação
  +-------------------+
            |
            v
  +-------------------+
  | GROUP BY & SUM/AVG|  <-- SAP HANA consolida os grupos
  +-------------------+
            |
            v
  +-------------------+
  | Cláusula HAVING   |  <-- Filtra os GRUPOS CONSOLIDADOS após a agregação
  +-------------------+
            |
            v
  [Resultado Final Transferido ao ABAP]
```

### Exemplo Comparativo Prático
Queremos calcular o total faturado por companhia aérea, considerando **apenas voos do ano de 2026** (filtro pré-agregação: `WHERE`), e exibir **apenas as companhias cujo faturamento total tenha ultrapassado \$ 100.000** (filtro pós-agregação: `HAVING`):

```abap
SELECT FROM /lrn/flight
  FIELDS carrid,
         currency_code,
         COUNT( * )          AS number_of_flights,
         SUM( price )        AS total_revenue
  WHERE fldate BETWEEN '20260101' AND '20261231' " Linhas individuais de 2026
  GROUP BY carrid, currency_code
  HAVING SUM( price ) > 100000                   " Grupos com faturamento > 100k
  ORDER BY total_revenue DESCENDING
  INTO TABLE @DATA(lt_top_airlines).
```

---

## Resumo da Lição

- A cláusula **`ORDER BY`** executa a ordenação no SAP HANA, entregando tabelas já estruturadas ao servidor ABAP.
- **`DISTINCT`** descarta duplicatas na própria leitura da base de dados.
- Funções de agregação (**`SUM`**, **`COUNT`**, **`AVG`**, **`MAX`**, **`MIN`**) condensam milhares de linhas em resumos de negócio no banco de dados.
- Ao utilizar agregações com colunas normais, a cláusula **`GROUP BY`** é estritamente obrigatória para todas as colunas não agregadas.
- **`WHERE`** filtra registros individuais antes da agregação; **`HAVING`** filtra os grupos consolidados após a aplicação das funções de agregação.
