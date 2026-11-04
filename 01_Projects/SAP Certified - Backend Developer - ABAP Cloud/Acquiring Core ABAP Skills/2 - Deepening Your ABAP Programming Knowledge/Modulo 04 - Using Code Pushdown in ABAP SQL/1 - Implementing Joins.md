---
title: "Implementando Joins no ABAP SQL"
source: "https://learning.sap.com/courses/deepening-your-abap-programming-knowledge/implementing-joins"
created: 2026-11-03
tags:
  - sap
  - abap
  - abap-cloud
  - abap-sql
  - joins
  - code-pushdown
  - performance
  - adt
---
**Roteiro de Estudos Relacionado:** [[Roteiro de Estudos SAP]]

# Objetivos

Após concluir esta lição, você será capaz de:
- Explicar os fundamentos do paradigma **Code-to-Data (*Code Pushdown*)** e como ele revoluciona o acesso a dados no SAP HANA.
- Implementar consultas relacionais utilizando **`INNER JOIN`** para correlacionar múltiplas entidades.
- Utilizar **`LEFT OUTER JOIN`** para recuperar registros mestres mesmo quando não existirem dados correspondentes na tabela secundária.
- Construir junções encadeadas (*Nested Joins*) envolvendo três ou mais fontes de dados.
- Aplicar a sintaxe moderna do ABAP SQL: separação de campos por vírgula (`SELECT FIELDS`), escape de variáveis hospedeiras (`@`) e declarações em linha (`INTO TABLE @DATA(...)`).
- Contrastar o uso de Joins com o antipadrão destrutivo de comandos `SELECT` executados dentro de laços `LOOP AT`.

---

## 1. O Paradigma do Code Pushdown (Code-to-Data)

Na arquitetura clássica do SAP R/3, o banco de dados era encarado como um mero repositório de armazenamento de registros. Os desenvolvedores costumavam trazer tabelas inteiras para a memória do servidor de aplicação e realizar cruzamentos, filtros e cálculos através de loops e comandos procedurais.

Com o advento do **SAP HANA** e a evolução do **ABAP SQL**, essa lógica se inverteu:

> [!NOTE] O Conceito de Code Pushdown
> O princípio do **Code Pushdown** estabelece que qualquer processamento de dados intensivo (filtros, cruzamentos entre tabelas, somas, agregações e transformações) deve ser **empurrado para baixo**, sendo executado diretamente dentro do motor in-memory do banco de dados. Apenas o resultado final consolidado e enxuto é transferido pela rede para o servidor de aplicação ABAP.

---

## 2. A Morte do "SELECT em LOOP": Por que usar Joins?

Considere o cenário onde precisamos listar os dados de voos juntamente com o nome por extenso da companhia aérea responsável.

### ❌ O Antipadrão Histórico (Sequential Reads / N+1 Problem)
```abap
" O programa busca todos os voos:
SELECT carrid, connid, fldate 
  FROM /lrn/flight 
  INTO TABLE @DATA(lt_flights).

" Para CADA voo, realiza uma nova viagem de rede até o banco:
LOOP AT lt_flights INTO DATA(ls_flight).
  SELECT SINGLE carrname 
    FROM /lrn/carrier 
    WHERE carrid = @ls_flight-carrid 
    INTO @DATA(lv_carrname).
  " Processamento ineficiente...
ENDLOOP.
```
* **Impacto no Sistema:** Se a tabela de voos possuir 10.000 registros, o programa abrirá **10.001 conexões de leitura (*Network Round-Trips*)**, sobrecarregando a rede e gerando lentidão extrema.

### ✅ O Padrão Moderno com JOIN (Code Pushdown Nativo)
Com um único comando ABAP SQL, o banco de dados cruza as duas tabelas em memória na velocidade do hardware do SAP HANA e devolve a tabela final já montada em uma única viagem de rede:

```abap
SELECT FROM /lrn/flight AS f
  INNER JOIN /lrn/carrier AS c
    ON f~carrid = c~carrid
  FIELDS f~carrid,
         f~connid,
         f~fldate,
         c~carrname
  WHERE f~fldate >= @cl_abap_context_info=>get_system_date( )
  INTO TABLE @DATA(lt_combined_flights).
```

---

## 3. Tipos Fundamentais de Joins no ABAP SQL

O ABAP SQL suporta duas categorias principais de junções relacionais:

### A. INNER JOIN (Junção Interna)
Retorna **estritamente as linhas que encontram correspondência exata** em todas as tabelas participantes com base na condição expressa na cláusula `ON`:

* Se um voo referenciar uma companhia aérea que não existe na tabela de operadoras, essa linha de voo **será omitida** do resultado final.
* É a escolha ideal quando a integridade relacional entre as entidades for mandatória para o negócio.

```abap
SELECT FROM /lrn/travel AS t
  INNER JOIN /lrn/booking AS b
    ON t~travel_id = b~travel_id
  FIELDS t~travel_id,
         t~customer_id,
         b~booking_id,
         b~booking_date
  INTO TABLE @DATA(lt_active_bookings).
```

---

### B. LEFT OUTER JOIN (Junção Externa à Esquerda)
Garante que **todos os registros da tabela situada à esquerda** (`LEFT`) sejam preservados no conjunto de resultados, mesmo que **não exista nenhum registro correspondente** na tabela à direita:

* **Quando há correspondência:** Os campos da tabela à direita são preenchidos com os dados reais encontrados.
* **Quando NÃO há correspondência:** A linha da tabela à esquerda continua presente no resultado, e todos os campos originários da tabela à direita são preenchidos com **valores iniciais / nulos** (zeros para números, espaços para textos).

> [!TIP] Cenário Típico de Negócio para LEFT OUTER JOIN
> Listar **todas as viagens cadastradas**, exibindo suas reservas associadas caso existam, mas sem ocultar as viagens recém-criadas que ainda não possuem nenhuma reserva emitida!

```abap
SELECT FROM /lrn/travel AS t
  LEFT OUTER JOIN /lrn/booking AS b
    ON t~travel_id = b~travel_id
  FIELDS t~travel_id,
         t~description,
         b~booking_id,
         b~flight_price
  INTO TABLE @DATA(lt_all_travels).
```

---

## 4. Junções Encadeadas (*Nested Joins*)

Em aplicações corporativas reais, o relacionamento frequentemente conecta mais de duas tabelas em cadeia (por exemplo: Viagem $\rightarrow$ Reserva $\rightarrow$ Suplemento da Reserva):

```abap
SELECT FROM /lrn/travel AS t
  INNER JOIN /lrn/booking AS b
    ON t~travel_id = b~travel_id
  LEFT OUTER JOIN /lrn/booksuppl AS s
    ON b~travel_id  = s~travel_id
   AND b~booking_id = s~booking_id
  FIELDS t~travel_id,
         t~agency_id,
         b~booking_id,
         b~customer_id,
         s~booking_supplement_id,
         s~price AS supplement_price
  WHERE t~agency_id = @lv_my_agency
  ORDER BY t~travel_id, b~booking_id
  INTO TABLE @DATA(lt_full_details).
```

---

## 5. Boas Práticas Sintáticas do ABAP SQL Moderno

1. **Definição de Aliases (`AS`):** Sempre atribua apelidos curtos e representativos para as tabelas envolvidas (ex: `AS t`, `AS b`). Utilize o caractere til (`~`) para qualificar cada coluna: `t~travel_id`.
2. **Escape Obrigatório de Variáveis (`@`):** Toda variável, constante ou método ABAP referenciado dentro do comando SQL deve ser precedido pelo caractere `@` (*Host Variable*).
3. **Lista de Seleção Explícita (`FIELDS`):** Jamais utilize `SELECT *` em joins! Projete explicitamente apenas os campos estritamente necessários para a lógica do programa.

---

## Resumo da Lição

- O **Code Pushdown** transfere o esforço computacional e relacional para o SAP HANA, eliminando tráfego desnecessário de rede.
- Joins substituem com imenso ganho de performance o antipadrão de comandos `SELECT` executados dentro de estruturas `LOOP AT`.
- **`INNER JOIN`** requer correspondência em ambas as tabelas; registros órfãos são descartados.
- **`LEFT OUTER JOIN`** mantém todas as linhas da tabela à esquerda, preenchendo os campos não correspondentes da direita com valores iniciais/nulos.
- No ABAP SQL moderno, apelidos de tabelas usam `AS`, campos usam til (`t~campo`) e variáveis locais exigem escape com `@`.
