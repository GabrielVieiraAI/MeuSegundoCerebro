---
title: "Trabalhando com Expressões no ABAP SQL"
source: "https://learning.sap.com/courses/deepening-your-abap-programming-knowledge/working-with-expressions-in-abap-sql"
created: 2026-11-03
tags:
  - sap
  - abap
  - abap-cloud
  - abap-sql
  - expressoes
  - case
  - cast
  - code-pushdown
---
**Roteiro de Estudos Relacionado:** [[Roteiro de Estudos SAP]]

# Objetivos

Após concluir esta lição, você será capaz de:
- Integrar literais estáticos, constantes e variáveis locais (*Host Variables*) na lista de projeção do `SELECT`.
- Construir expressões aritméticas calculadas diretamente na camada de banco de dados.
- Implementar lógica condicional avançada em queries através de expressões **`CASE`** (*Simple Case* e *Searched Case*).
- Realizar conversões dinâmicas de tipos técnicos no banco de dados utilizando a expressão **`CAST`**.
- Descrever os benefícios de arquitetura do Code Pushdown ao eliminar loops procedurais de enriquecimento de dados no servidor de aplicação.

---

## 1. Expressões no Banco: A Evolução da Lista de Seleção

No ABAP clássico, a lista de seleção de um comando `SELECT` permitia apenas a leitura passiva de colunas físicas de tabelas. Toda regra de negócio (como atribuir uma descrição para um código de status, calcular uma porcentagem de desconto ou converter um tipo) exigia que os dados fossem lidos em seu estado bruto e posteriormente processados em memória através de loops `LOOP AT ... ENDLOOP`.

No ABAP SQL contemporâneo, a cláusula `FIELDS` suporta **expressões ricas de computação**:

> [!NOTE] Princípio Arquitetural
> Ao calcular expressões diretamente na instrução SQL, a carga de processamento é assumida pelo SAP HANA. O servidor de aplicação recebe as colunas finais já calculadas, formatadas e prontas para consumo, economizando ciclos de CPU e reduzindo o consumo de memória RAM do servidor ABAP.

---

## 2. Literais, Constantes e Variáveis Hospedeiras (*Host Variables*)

Você pode projetar valores fixos ou conteúdos de variáveis ABAP diretamente nas colunas retornadas pela query:

* **Literais de Texto e Numéricos:** Devem ser informados entre aspas simples comuns (ex: `'Ativo'`).
  > [!WARNING] Restrição de Sintaxe
  > Em comandos ABAP SQL, você **não pode utilizar crases (`` ` ``)** para literais de string! Utilize estritamente aspas simples `'...'`.
* **Constantes e Variáveis ABAP (*Host Variables*):** Qualquer objeto de dados do programa ABAP referenciado dentro do comando SQL deve ser **obrigatoriamente prefixado com o caractere de escape `@`**.

```abap
CONSTANTS lc_currency TYPE c LENGTH 3 VALUE 'BRL'.
DATA(lv_discount_pct) = 5.

SELECT FROM /lrn/flight
  FIELDS carrid,
         connid,
         price,
         @lc_currency      AS currency_code,    " Projeta a constante como coluna
         @lv_discount_pct  AS discount_applied  " Projeta o valor da variável
  WHERE carrid = 'LH'
  INTO TABLE @DATA(lt_flights_with_fixed_cols).
```

---

## 3. Expressões Aritméticas no Banco de Dados

Cálculos matemáticos diretos envolvendo colunas, literais e variáveis podem ser executados pelo SAP HANA na própria cláusula `FIELDS`:

```abap
SELECT FROM /lrn/flight
  FIELDS carrid,
         connid,
         fldate,
         price,
         " Multiplica o preço por 1.10 para adicionar 10% de margem diretamente no banco:
         ( price * 110 ) / 100 AS price_with_margin,
         " Calcula assentos disponíveis subtraindo ocupados de capacidade máxima:
         seatsmax - seatsocc   AS seats_available
  WHERE carrid = 'AA'
  INTO TABLE @DATA(lt_calculated_flights).
```

---

## 4. Lógica Condicional: Expressões `CASE`

A expressão condicional `CASE` permite avaliar condições e retornar valores dinâmicos sem recorrer a laços procedurais com comandos `IF` no ABAP. Divide-se em duas formas:

### A. Simple Case (Caso Simples)
Compara uma única coluna ou operando contra múltiplos valores fixos:

```abap
SELECT FROM /lrn/travel
  FIELDS travel_id,
         customer_id,
         status,
         CASE status
           WHEN 'B' THEN 'Reservado'
           WHEN 'P' THEN 'Pago'
           WHEN 'N' THEN 'Novo'
           WHEN 'C' THEN 'Cancelado'
           ELSE 'Indefinido'
         END AS status_text
  INTO TABLE @DATA(lt_travel_status).
```

---

### B. Searched Case (Caso com Condições Complexas)
Avalia condições booleanas livres em cada ramo `WHEN`, permitindo operadores lógicos (`AND`, `OR`, `<`, `>`, `BETWEEN`):

```abap
SELECT FROM /lrn/flight
  FIELDS carrid,
         connid,
         fldate,
         seatsmax,
         seatsocc,
         CASE
           WHEN seatsocc = 0 
             THEN 'Voo Vazio'
           WHEN seatsocc >= seatsmax 
             THEN 'Lotado'
           WHEN ( seatsocc * 100 ) / seatsmax >= 80 
             THEN 'Alta Ocupação'
           ELSE 'Ocupação Normal'
         END AS occupancy_rate
  WHERE carrid = 'LH'
  INTO TABLE @DATA(lt_flight_analysis).
```

---

## 5. Conversão Dinâmica de Tipos com a Expressão `CAST`

A expressão **`CAST`** converte o tipo de dado de uma coluna ou resultado de expressão em tempo de execução dentro do banco de dados:

```text
CAST( operando AS tipo_destino )
```

### Casos de Uso Mais Frequentes:
1. **Evitar Divisão Inteira Truncada:** Se você dividir dois números inteiros, o banco pode truncar o resultado. Converter um dos operandos para decimal com `CAST` preserva as casas decimais:
   ```abap
   CAST( seatsocc AS DEC( 10, 2 ) ) / CAST( seatsmax AS DEC( 10, 2 ) ) AS occupancy_percentage
   ```
2. **Ajuste de Tipos para União (`UNION`):** Compatibilizar o tipo de colunas que possuem definições ligeiramente diferentes antes de combiná-las.
3. **Conversão de Caracteres para Números:** Tratar campos de texto numéricos como inteiros diretamente na instrução SQL.

---

## Resumo da Lição

- Expressões no ABAP SQL transferem cálculos complexos para o motor in-memory do SAP HANA (*Code Pushdown*).
- Literais usam aspas simples (`'...'`); o uso de crases de string é estritamente proibido no SQL.
- Variáveis locais e constantes exigem o caractere de escape **`@`** (*Host Variables*).
- A expressão **`CASE`** (*Simple Case* e *Searched Case*) elimina a necessidade de comandos procedurais `IF/ELSE` em loops de aplicação.
- A expressão **`CAST`** altera dinamicamente o tipo técnico de colunas ou resultados aritméticos durante a execução da consulta.
