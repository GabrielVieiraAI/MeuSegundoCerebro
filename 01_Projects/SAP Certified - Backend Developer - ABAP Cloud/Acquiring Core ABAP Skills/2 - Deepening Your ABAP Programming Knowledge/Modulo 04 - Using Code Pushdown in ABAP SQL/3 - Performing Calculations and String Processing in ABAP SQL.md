---
title: "Realizando Cálculos e Processamento de Strings no ABAP SQL"
source: "https://learning.sap.com/courses/deepening-your-abap-programming-knowledge/performing-calculations-and-string-processing-in-abap-sql"
created: 2026-11-03
tags:
  - sap
  - abap
  - abap-cloud
  - abap-sql
  - calculos
  - strings
  - funcoes-sql
  - code-pushdown
---
**Roteiro de Estudos Relacionado:** [[Roteiro de Estudos SAP]]

# Objetivos

Após concluir esta lição, você será capaz de:
- Aplicar funções numéricas avançadas no banco de dados, distinguindo divisão inteira (**`DIV`**) de divisão decimal com arredondamento (**`DIVISION`**).
- Concatenar campos e literais na camada de persistência com o operador **`&&`** e com a função **`CONCAT_WITH_SPACE`**.
- Transformar caixas de texto com **`UPPER`**, **`LOWER`** e capitalização de títulos com **`INITCAP`**.
- Extrair porções de texto diretamente no banco com as funções **`LEFT`**, **`RIGHT`** e **`SUBSTRING`**.
- Reduzir o tráfego de rede e o esforço de memória ao entregar dados devidamente higienizados e calculados pelo SAP HANA.

---

## 1. Otimização Numérica no Banco de Dados

Calcular valores na camada de banco de dados evita trazer colunas desnecessárias para a aplicação. Além dos operadores aritméticos básicos (`+`, `-`, `*`, `/`), o ABAP SQL oferece funções numéricas especializadas:

### A. Divisão Inteira vs. Divisão Decimal

| Função | Sintaxe | Comportamento Matemático | Exemplo de Aplicação |
| :--- | :--- | :--- | :--- |
| **`DIV`** | `DIV( x, y )` | Executa a divisão inteira e **descarta sumariamente o resto** fracionário (trunca o resultado). | Calcular quantos pacotes fechados de 12 unidades cabem em um lote de estoque. |
| **`DIVISION`** | `DIVISION( x, y, decimals )` | Executa a divisão precisa com casas decimais e aplica **arredondamento comercial padrão**. | Calcular preços unitários, médias de custos ou índices financeiros com 2 casas decimais. |
| **`MOD`** | `MOD( x, y )` | Retorna o **resto da divisão inteira**. | Verificar se um número é par/ímpar ou calcular sobras de caixas. |

```abap
SELECT FROM /lrn/flight
  FIELDS carrid,
         connid,
         seatsmax,
         seatsocc,
         " Divisão truncada inteira:
         DIV( seatsocc, 10 )                 AS tens_of_passengers,
         " Divisão com 2 casas decimais e arredondamento:
         DIVISION( seatsocc * 100, seatsmax, 2 ) AS occupancy_pct,
         " Resto da divisão:
         MOD( seatsocc, 10 )                 AS remainder_units
  WHERE carrid = 'LH'
  INTO TABLE @DATA(lt_flight_stats).
```

### B. Funções Numéricas Complementares
* **`ROUND( val, dec )`:** Arredonda o valor `val` para `dec` casas decimais.
* **`ABS( val )`:** Retorna o valor absoluto positivo (elimina o sinal negativo).
* **`CEIL( val )`:** Retorna o menor número inteiro maior ou igual a `val` (arredonda para cima).
* **`FLOOR( val )`:** Retorna o maior número inteiro menor ou igual a `val` (arredonda para baixo).

---

## 2. Processamento e Concatenação de Strings no Banco

Montar nomes completos, códigos formatados e padronizar textos diretamente na query SQL simplifica a arquitetura e entrega dados prontos para a interface SAP Fiori.

---

### A. Concatenação de Campos

#### 1. Operador de Concatenação (`&&`)
Combina sequências de caracteres de forma direta.
> [!IMPORTANT] Espaçamento com o Operador &&
> O operador `&&` não adiciona nenhum separador automático. Se você concatenar nome e sobrenome, deve injetar explicitamente o literal com espaço:
```abap
SELECT FROM /lrn/travel
  FIELDS travel_id,
         customer_id,
         " Injetando espaço manual entre literais:
         'Viagem nº ' && travel_id && ' - ' && description AS travel_label
  INTO TABLE @DATA(lt_travel_labels).
```

#### 2. Função `CONCAT_WITH_SPACE`
Concatena dois argumentos inserindo uma quantidade pré-definida de espaços em branco entre eles (muito útil para nomes próprios e endereços):

```abap
SELECT FROM /lrn/customer
  FIELDS customer_id,
         " Concatena primeiro nome e sobrenome com exatamente 1 espaço intermediário:
         CONCAT_WITH_SPACE( first_name, last_name, 1 ) AS full_customer_name
  INTO TABLE @DATA(lt_customers).
```

---

### B. Padronização de Caixa e Formatação

* **`UPPER( arg )`:** Converte todos os caracteres para letras MAIÚSCULAS.
* **`LOWER( arg )`:** Converte todos os caracteres para letras minúsculas.
* **`INITCAP( arg )`:** Converte todas as palavras para minúsculas com a **primeira letra de cada palavra em MAIÚSCULA** (ideal para higienização de nomes de cidades, clientes e ruas).

```abap
SELECT FROM /lrn/customer
  FIELDS customer_id,
         UPPER( email )     AS sanitized_email,   " GABRIEL@EMPRESA.COM
         INITCAP( city )    AS formatted_city     " 'são paulo' vira 'São Paulo'
  INTO TABLE @DATA(lt_formatted_customers).
```

---

### C. Fatiamento e Extração de Substrings

Ao contrário de fatiar arrays em memória ABAP, o SAP HANA pode extrair trechos de colunas durante o próprio escaneamento da tabela:

* **`LEFT( arg, n )`:** Extrai os primeiros $n$ caracteres da esquerda.
* **`RIGHT( arg, n )`:** Extrai os últimos $n$ caracteres da direita.
* **`SUBSTRING( arg, pos, len )`:** Extrai uma sequência a partir da posição `pos` com o comprimento `len`. *(Atenção: No SQL, o primeiro caractere está na **posição 1**).*
* **`LENGTH( arg )`:** Retorna a quantidade de caracteres da coluna.

```abap
SELECT FROM /lrn/carrier
  FIELDS carrid,
         carrname,
         LEFT( carrname, 3 )            AS short_code,
         SUBSTRING( carrname, 1, 10 )   AS first_ten_chars,
         LENGTH( carrname )             AS name_length
  INTO TABLE @DATA(lt_carrier_slices).
```

---

## Resumo da Lição

- A função **`DIV`** efetua divisão inteira (trunca o resultado), enquanto **`DIVISION`** efetua divisão decimal com arredondamento comercial preciso.
- O operador **`&&`** e a função **`CONCAT_WITH_SPACE( arg1, arg2, spaces )`** realizam junções de texto diretamente no SAP HANA.
- **`INITCAP`** higieniza dados de texto convertendo a primeira letra de cada palavra para maiúscula.
- Funções de fatiamento como **`LEFT`**, **`RIGHT`** e **`SUBSTRING`** (base 1) permitem extrair partes relevantes de colunas sem pós-processamento ABAP.
