---
title: "Utilizando Funções Embutidas Especiais no ABAP SQL"
source: "https://learning.sap.com/courses/deepening-your-abap-programming-knowledge/using-special-built-in-functions-in-abap-sql"
created: 2026-11-03
tags:
  - sap
  - abap
  - abap-cloud
  - abap-sql
  - datas
  - horas
  - coalesce
  - code-pushdown
---
**Roteiro de Estudos Relacionado:** [[Roteiro de Estudos SAP]]

# Objetivos

Após concluir esta lição, você será capaz de:
- Executar validações e operações aritméticas com tipos temporais (`DATS`) diretamente dentro da consulta SQL.
- Validar se um campo de data armazena um dia de calendário válido utilizando **`DATS_IS_VALID`**.
- Adicionar ou subtrair períodos e calcular intervalos entre datas no banco com **`DATS_ADD_DAYS`**, **`DATS_ADD_MONTHS`** e **`DATS_DAYS_BETWEEN`**.
- Tratar e prevenir valores nulos (*NULL Values*) decorrentes de junções externas através da função **`COALESCE`**.

---

## 1. Funções Especiais de Data no SAP HANA

Historicamente, cálculos com datas no banco de dados eram limitados, forçando os desenvolvedores a ler as informações e manipular calendários em variáveis ABAP. O ABAP SQL moderno conta com funções de kernel específicas para a semântica do tipo de dicionário `DATS` (`YYYYMMDD`):

### A. Validação de Calendário: `DATS_IS_VALID`
Avalia se a string contida na coluna representa uma data civil válida (verificando limites de dias de cada mês e ano bissexto):
* Retorna **`1`** se a data for válida.
* Retorna **`0`** se a data for inválida ou inicial (ex: `'00000000'` ou `'20260230'`).

```abap
SELECT FROM /lrn/travel
  FIELDS travel_id,
         begin_date,
         DATS_IS_VALID( begin_date ) AS is_valid_start_date
  WHERE DATS_IS_VALID( begin_date ) = 1
  INTO TABLE @DATA(lt_clean_travels).
```

---

### B. Aritmética e Intervalos de Datas no Banco

| Função SQL | Parâmetros | Finalidade |
| :--- | :--- | :--- |
| **`DATS_DAYS_BETWEEN`** | `( date1, date2 )` | Calcula o número exato de dias corridos entre `date1` e `date2`. Se `date2 > date1`, o resultado é positivo. |
| **`DATS_ADD_DAYS`** | `( date, days )` | Soma (ou subtrai se for negativo) um número determinado de dias à data, tratando viradas de mês e ano. |
| **`DATS_ADD_MONTHS`** | `( date, months )` | Avança ou recua meses inteiros, ajustando automaticamente o último dia útil caso o mês alvo seja menor. |

```abap
SELECT FROM /lrn/travel
  FIELDS travel_id,
         begin_date,
         end_date,
         " Quantos dias dura a viagem:
         DATS_DAYS_BETWEEN( begin_date, end_date ) AS duration_days,
         " Data limite de cancelamento gratuito (30 dias antes do início):
         DATS_ADD_DAYS( begin_date, -30 )          AS cancel_deadline,
         " Data de renovação de contrato (6 meses após início):
         DATS_ADD_MONTHS( begin_date, 6 )          AS renewal_date
  WHERE DATS_IS_VALID( begin_date ) = 1
  INTO TABLE @DATA(lt_travel_intervals).
```

---

## 2. Tratamento de Valores Nulos com a Função `COALESCE`

No banco de dados relacional, quando você executa um **`LEFT OUTER JOIN`** e uma linha da tabela à esquerda não possui correspondente na tabela à direita, as colunas da direita resultam no valor especial **`NULL`**.

Embora o compilador ABAP mapeie valores nulos para valores iniciais ao preencher tabelas internas, a presença de `NULL` dentro de expressões SQL pode corromper operações matemáticas (qualquer cálculo com `NULL` resulta em `NULL`!).

> [!IMPORTANT] A Função COALESCE
> A função `COALESCE( arg1, arg2, ... )` recebe uma lista de argumentos e **retorna o primeiro argumento que NÃO for nulo**. Se o primeiro for nulo, ela utiliza o segundo como valor substituto padrão (*Fallback Value*).

### Exemplo Prático com Outer Join
Suponha uma listagem de viagens com a soma de suas reservas. Caso uma viagem não possua reservas, `booking_price` será nulo. O `COALESCE` garante que o valor assuma zero (`0`):

```abap
SELECT FROM /lrn/travel AS t
  LEFT OUTER JOIN /lrn/booking AS b
    ON t~travel_id = b~travel_id
  FIELDS t~travel_id,
         t~description,
         " Se b~flight_price for NULL, substitui por 0.00:
         COALESCE( b~flight_price, 0 ) AS safe_flight_price,
         " Se a moeda da reserva não existir, assume 'BRL':
         COALESCE( b~currency_code, 'BRL' ) AS safe_currency
  INTO TABLE @DATA(lt_safe_travel_bookings).
```

---

## Resumo da Lição

- A função **`DATS_IS_VALID`** avalia a validade civil de datas, eliminando registros inconsistentes diretamente na base.
- **`DATS_DAYS_BETWEEN`**, **`DATS_ADD_DAYS`** e **`DATS_ADD_MONTHS`** executam cálculos de calendário complexos no SAP HANA.
- A função **`COALESCE`** é fundamental em consultas com *Outer Joins*, garantindo que valores `NULL` sejam substituídos por padrões seguros e protegendo expressões de cálculo posteriores.
