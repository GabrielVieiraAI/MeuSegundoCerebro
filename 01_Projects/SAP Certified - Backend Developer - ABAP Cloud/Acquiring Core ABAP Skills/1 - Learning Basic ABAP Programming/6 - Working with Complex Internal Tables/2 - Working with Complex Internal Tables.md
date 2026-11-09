---
title: "Trabalhando com Tabelas Internas Complexas"
source: "https://learning.sap.com/courses/basic-abap-programming/working-with-complex-internal-tables_f8c923f3-6f95-4b47-960f-557001f13977"
author:
published:
created: 2026-10-21
description: "Após concluir esta lição, você será capaz de: Preencher tabelas internas complexas com dados. Acessar o conteúdo de tabelas internas complexas. Utilizar tabelas internas complexas no ABAP SQL."
tags:
  - "clippings"
---

## Objetivos

Após concluir esta lição, você será capaz de:

- Preencher tabelas internas complexas com dados.
- Acessar o conteúdo de tabelas internas complexas.
- Utilizar tabelas internas complexas no ABAP SQL.

## Preenchimento de Tabelas Internas Complexas

![[03-FillComplexITABs_001.png]]

A forma mais simples de adicionar uma nova linha a uma tabela interna é a instrução `APPEND`, fornecendo um objeto de dados cujo tipo corresponda ao tipo de linha da tabela. Esse objeto de dados é frequentemente denominado **work area** (área de trabalho).

Para tabelas internas simples, a work area utilizada no `APPEND` pode ser uma variável escalar, uma constante ou um literal. Para tabelas internas complexas, a work area deve ser obrigatoriamente estruturada.

No exemplo, a variável estruturada `connection` é utilizada para preencher a tabela interna `connections`.

Existem duas formas principais de declarar a work area `connection`:
- Referenciar o tipo de linha `st_connection` diretamente (`DATA connection TYPE st_connection.`).
- Referenciar o tipo de linha indiretamente utilizando `LIKE LINE OF <tabela_interna>` (`DATA connection LIKE LINE OF connections.`).

Declarar work areas com `LIKE LINE OF` traz duas vantagens:
- Evidencia claramente o propósito da variável estruturada como work area daquela tabela interna específica.
- Garante que a work area permaneça sempre compatível com a tabela interna, mesmo que a definição da tabela venha a ser alterada futuramente.

![[03-FillComplexITABs_002.png]]

Se você não preencher a work area antes do comando `APPEND`, a nova linha da tabela interna será preenchida com os valores iniciais específicos de cada tipo.

> [!TIP] Dica
> Você obtém o mesmo resultado utilizando a variante `APPEND INITIAL LINE TO <tabela_interna>`. Essa sintaxe dispensa a declaração e o uso de uma work area.

Para preencher a work area estruturada, você pode atribuir valores aos componentes individuais ou utilizar a expressão `VALUE #( )`.

![[03-FillComplexITABs_003.png]]

Você também pode utilizar uma expressão `VALUE #( )` diretamente na instrução `APPEND`, sem precisar declarar uma variável intermediária de work area:

```abap
APPEND VALUE #( carrier_id      = 'NN'
                connection_id   = '1234'
                airport_from_id = 'ABC'
                airport_to_id   = 'XYZ'
                carrier_name    = 'My Airline' )
   TO connections.
```

> [!NOTE] Nota
> Omitir a work area e criar a linha diretamente no `APPEND` pode ter um impacto positivo no consumo geral de memória do programa.

![[03-FillComplexITABs_004.png]]

Existe uma variante da expressão `VALUE #( )` que permite preencher e atribuir múltiplas linhas diretamente a uma tabela interna. Nessa variante, pares de parênteses adicionais são utilizados para delimitar cada linha:

```abap
carriers = VALUE #( ( carrier_id = 'AA' carrier_name = 'American Airlines' )
                    ( carrier_id = 'JL' carrier_name = 'Japan Airlines' )
                    ( carrier_id = 'SQ' carrier_name = 'Singapore Airlines' ) ).
```

Colunas não mencionadas (como `currency_code`) são preenchidas automaticamente com seus valores iniciais.

> [!NOTE] Nota
> Essa atribuição direta com `VALUE #( )` apaga todas as linhas existentes na tabela antes de preenchê-la com as novas linhas.

![[03-FillComplexITABs_005.png]]

Para copiar dados entre campos homônimos (de mesmo nome) de duas tabelas internas, utiliza-se o operador **`CORRESPONDING`**. Para cada linha da tabela de origem, o sistema cria uma nova linha na tabela de destino e transfere os dados das colunas com nomes coincidentes:

- Campos da tabela de origem que não existem na tabela de destino são ignorados.
- Campos da tabela de destino que não existem na tabela de origem são preenchidos com valores iniciais.
- Se a tabela de destino já contiver registros antes da atribuição, todo o conteúdo prévio será substituído.

## Como Depurar Tabelas Internas Complexas

Demonstração: [Iniciar Demonstração](https://learnsap.enable-now.cloud.sap/pub/mmcp/index.html?library=library.txt&show=project!PR_9171F14114573EA8:demo)

---

## Faça Você Mesmo: Preenchimento de Tabelas Internas Complexas

1. Como no primeiro exercício deste curso, crie uma nova classe global que implemente a interface `IF_OO_ADT_CLASSRUN`.
2. Copie o seguinte trecho de código para a parte de implementação do método `if_oo_adt_classrun~main( )`:
   ```abap
   TYPES: BEGIN OF st_connection,
            carrier_id      TYPE /dmo/carrier_id,
            connection_id   TYPE /dmo/connection_id,
            airport_from_id TYPE /dmo/airport_from_id,
            airport_to_id   TYPE /dmo/airport_to_id,
            carrier_name    TYPE /dmo/carrier_name,
          END OF st_connection.

   TYPES tt_connections TYPE STANDARD TABLE OF st_connection
                             WITH NON-UNIQUE KEY carrier_id
                                                 connection_id.

   DATA connections TYPE tt_connections.

   TYPES: BEGIN OF st_carrier,
            carrier_id    TYPE /dmo/carrier_id,
            carrier_name  TYPE /dmo/carrier_name,
            currency_code TYPE /dmo/currency_code,
          END OF st_carrier.

   TYPES tt_carriers TYPE STANDARD TABLE OF st_carrier
                         WITH NON-UNIQUE KEY carrier_id.

   DATA carriers TYPE tt_carriers.

   * Example 1: APPEND with structured data object (work area)
   **********************************************************************
   " Declare the work area with LIKE LINE OF
   DATA connection LIKE LINE OF connections.

   " Use VALUE #( ) instead assignment to individual components
   connection = VALUE #( carrier_id      = 'NN'
                         connection_id   = '1234'
                         airport_from_id = 'ABC'
                         airport_to_id   = 'XYZ'
                         carrier_name    = 'My Airline' ).
   APPEND connection TO connections.

   out->write( `--------------------------------` ).
   out->write( `Example 1: APPEND with Work Area` ).
   out->write( connections ).

   * Example 2: APPEND with VALUE #( ) expression
   **********************************************************************
   APPEND VALUE #( carrier_id      = 'NN'
                   connection_id   = '1234'
                   airport_from_id = 'ABC'
                   airport_to_id   = 'XYZ'
                   carrier_name    = 'My Airline' )
      TO connections.

   out->write( `----------------------------` ).
   out->write( `Example 2: Append with VALUE` ).
   out->write( connections ).

   * Example 3: Filling an Internal Table with Several Rows
   **********************************************************************
   carriers = VALUE #( ( carrier_id = 'AA' carrier_name = 'American Airlines' )
                       ( carrier_id = 'JL' carrier_name = 'Japan Airlines' )
                       ( carrier_id = 'SQ' carrier_name = 'Singapore Airlines' ) ).

   out->write( `-----------------------------------------` ).
   out->write( `Example 3: Fill Internal Table with VALUE` ).
   out->write( carriers ).

   * Example 4: Filling one Internal Table from Another
   **********************************************************************
   connections = CORRESPONDING #( carriers ).

   out->write( `--------------------------------------------` ).
   out->write( `Example 4: CORRESPONDING for Internal Tables` ).
   out->write( data = carriers
               name = `Source Table CARRIERS:` ).
   out->write( data = connections
               name = `Target Table CONNECTIONS:` ).
   ```
3. Pressione **Ctrl + F3** para ativar a classe e **F9** para executá-la como console app.
4. Analise a saída no console. Depure o programa e faça testes com o código-fonte para se familiarizar com os conceitos.

---

## Acesso a Tabelas Internas Complexas

![[04-AccessComplexITABs_001.png]]

Para tabelas internas complexas, as **expressões de tabela interna** (*table expressions*) com acesso por chave são essenciais, permitindo localizar registros por seus valores:

```abap
connection = connections[ carrier_id    = 'SQ'
                          connection_id = '0001' ].
```

> [!NOTE] Nota
> Você pode utilizar quaisquer campos para a seleção, e não apenas os campos-chave da tabela. Se mais de uma linha atender aos critérios, tabelas do tipo `STANDARD` retornam a primeira linha encontrada (menor índice).

Lembre-se de que o runtime do ABAP dispara a exceção tratável **`CX_SY_ITAB_LINE_NOT_FOUND`** se nenhuma linha satisfizer a condição. Envolva a expressão em uma estrutura `TRY … CATCH … ENDTRY` para evitar erros de execução.

---

### Varredura com `LOOP AT ... WHERE`

![[04-AccessComplexITABs_002.png]]

Para processar múltiplas linhas de uma tabela interna com base em condições, utiliza-se a instrução:

```abap
LOOP AT connections INTO connection WHERE airport_from_id <> 'MIA'.
  ...
ENDLOOP.
```

A condição `WHERE` pode conter expressões combinadas com `AND` e `OR`, utilizando operadores como `=`, `>`, `>=`, `<`, `<=`, `<>` e `BETWEEN`.

---

### Modificação de Registros com `MODIFY TABLE`

![[04-AccessComplexITABs_003.png]]

Após ler o conteúdo de uma linha em uma work area e alterá-la, você pode gravar as alterações de volta na tabela interna utilizando a instrução **`MODIFY TABLE`**:

```abap
carrier = carriers[ carrier_id = 'JL' ].
carrier-currency_code = 'JPY'.
MODIFY TABLE carriers FROM carrier.
```

Essa instrução realiza um acesso por chave: o sistema utiliza o conteúdo dos campos-chave presentes na work area para localizar a linha correspondente na tabela interna e atualiza as colunas não-chave com os valores da work area.

> [!NOTE] Nota
> Apenas campos que **não fazem parte da chave** podem ser alterados com `MODIFY TABLE`. A instrução não suporta modificações nos campos-chave.

---

### Modificação por Índice com `MODIFY ... INDEX`

![[04-AccessComplexITABs_004.png]]

A instrução `MODIFY` (sem a palavra `TABLE`) não distingue campos-chave de não-chave: ela sobrescreve a linha inteira da tabela interna com os dados da work area. Essa instrução realiza um acesso posicional (por índice):

```abap
carrier-carrier_id    = 'LH'.
carrier-currency_code = 'EUR'.
MODIFY carriers FROM carrier INDEX 1.
```

---

### Modificação Dentro de um `LOOP`

![[04-AccessComplexITABs_005.png]]

Para atualizar várias linhas ou todas as linhas de uma tabela interna, implementa-se um loop `LOOP AT ... INTO` que posiciona cada linha sucessivamente na work area. Dentro do loop, altera-se a work area e grava-se a alteração com `MODIFY`:

```abap
LOOP AT carriers INTO carrier WHERE currency_code IS INITIAL.
  carrier-currency_code = 'USD'.
  MODIFY carriers FROM carrier.
ENDLOOP.
```

Nesse formato abreviado dentro de `LOOP … ENDLOOP`, a adição `INDEX` é omitida: o sistema identifica implicitamente a linha em processamento no momento da iteração.

> [!WARNING] Cuidado com o Uso Fora do Loop
> Se você utilizar `MODIFY <tabela> FROM <work_area>` sem a adição `INDEX` fora de um bloco `LOOP…ENDLOOP`, o sistema não saberá qual linha alterar e provocará um erro de tempo de execução (*runtime error*) não tratável.

---

## Faça Você Mesmo: Acesso a Tabelas Internas Complexas

1. Como no primeiro exercício deste curso, crie uma nova classe global que implemente a interface `IF_OO_ADT_CLASSRUN`.
2. Copie o seguinte trecho de código para a parte de implementação do método `if_oo_adt_classrun~main( )`:
   ```abap
   TYPES: BEGIN OF st_connection,
            carrier_id      TYPE /dmo/carrier_id,
            connection_id   TYPE /dmo/connection_id,
            airport_from_id TYPE /dmo/airport_from_id,
            airport_to_id   TYPE /dmo/airport_to_id,
            carrier_name    TYPE /dmo/carrier_name,
          END OF st_connection.

   TYPES tt_connections TYPE SORTED TABLE OF st_connection
                             WITH NON-UNIQUE KEY carrier_id
                                                 connection_id.

   DATA connections TYPE tt_connections.
   DATA connection  LIKE LINE OF connections.

   TYPES: BEGIN OF st_carrier,
            carrier_id    TYPE /dmo/carrier_id,
            currency_code TYPE /dmo/currency_code,
          END OF st_carrier.

   DATA carriers TYPE STANDARD TABLE OF st_carrier
                      WITH NON-UNIQUE KEY carrier_id.
   DATA carrier LIKE LINE OF carriers.

   * Preparation: Fill internal tables with data
   **********************************************************************
   connections = VALUE #( ( carrier_id      = 'JL'
                            connection_id   = '0408'
                            airport_from_id = 'FRA'
                            airport_to_id   = 'NRT'
                            carrier_name    = 'Japan Airlines' )
                          ( carrier_id      = 'AA'
                            connection_id   = '0017'
                            airport_from_id = 'MIA'
                            airport_to_id   = 'HAV'
                            carrier_name    = 'American Airlines' )
                          ( carrier_id      = 'SQ'
                            connection_id   = '0001'
                            airport_from_id = 'SFO'
                            airport_to_id   = 'SIN'
                            carrier_name    = 'Singapore Airlines' )
                          ( carrier_id      = 'UA'
                            connection_id   = '0078'
                            airport_from_id = 'SFO'
                            airport_to_id   = 'SIN'
                            carrier_name    = 'United Airlines' ) ).

   carriers = VALUE #( ( carrier_id    = 'SQ'
                         currency_code = ' ' )
                       ( carrier_id    = 'JL'
                         currency_code = ' ' )
                       ( carrier_id    = 'AA'
                         currency_code = ' ' )
                       ( carrier_id    = 'UA'
                         currency_code = ' ' ) ).

   * Example 1: Table Expression with Key Access
   **********************************************************************
   out->write( `--------------------------------------------` ).
   out->write( `Example 1: Table Expressions with Key Access` ).
   out->write( data = connections
               name = `Internal Table CONNECTIONS: ` ).

   " with key fields
   connection = connections[ carrier_id    = 'SQ'
                             connection_id = '0001' ].
   out->write( data = connection
               name = `CARRIER_ID = 'SQ' AND CONNECTION_ID = '001':` ).

   " with non-key fields
   connection = connections[ airport_from_id = 'SFO'
                             airport_to_id   = 'SIN' ].
   out->write( data = connection
               name = `AIRPORT_FROM_ID = 'SFO' AND AIRPORT_TO_ID = 'SIN':` ).

   * Example 2: LOOP with key access
   **********************************************************************
   out->write( `-------------------------------` ).
   out->write( `Example 2: LOOP with Key Access` ).
   LOOP AT connections INTO connection
                      WHERE airport_from_id <> 'MIA'.
     out->write( data = connection
                 name = |This is row number { sy-tabix }: | ).
   ENDLOOP.

   * Example 3: MODIFY TABLE (key access)
   **********************************************************************
   out->write( `-----------------------------------` ).
   out->write( `Example 3: MODIFY TABLE (key access)` ).
   out->write( data = carriers
               name = `Table CARRIERS before MODIFY TABLE:` ).

   carrier = carriers[ carrier_id = 'JL' ].
   carrier-currency_code = 'JPY'.
   MODIFY TABLE carriers FROM carrier.

   out->write( data = carriers
               name = `Table CARRIERS after MODIFY TABLE:` ).

   * Example 4: MODIFY (index access)
   **********************************************************************
   out->write( `--------------------------------` ).
   out->write( `Example 4: MODIFY (index access)` ).
   carrier-carrier_id    = 'LH'.
   carrier-currency_code = 'EUR'.
   MODIFY carriers FROM carrier INDEX 1.

   out->write( data = carriers
               name = `Table CARRIERS after MODIFY:` ).

   * Example 5: MODIFY in a LOOP
   **********************************************************************
   out->write( `----------------------------` ).
   out->write( `Example 5: MODIFY in a LOOP` ).
   LOOP AT carriers INTO carrier
                   WHERE currency_code IS INITIAL.
     carrier-currency_code = 'USD'.
     MODIFY carriers FROM carrier.
   ENDLOOP.

   out->write( data = carriers
               name = `Table CARRIERS after the LOOP:` ).
   ```
3. Pressione **Ctrl + F3** para ativar a classe e **F9** para executá-la como console app.
4. Analise a saída no console. Depure o programa e faça testes com o código-fonte para se familiarizar com os conceitos.

---

## Tabelas Internas Complexas no ABAP SQL

![[05-ComplexITABsInABAPSQL_001.png]]

A instrução `SELECT SINGLE` lê exatamente um registro do banco de dados e o direciona para uma variável estruturada após a palavra-chave `INTO`.

![[05-ComplexITABsInABAPSQL_002.png]]

Ao omitir a adição `SINGLE`, você indica o interesse em recuperar todos os registros que atendem às condições da cláusula `WHERE`. Para armazenar múltiplos registros, utiliza-se uma tabela interna complexa como destino, adicionando a palavra-chave **`TABLE`** após `INTO`:

```abap
SELECT
  FROM /DMO/I_Airport
FIELDS AirportID, Name, City, CountryCode
 WHERE City = 'London'
  INTO TABLE @airports_full.
```

![[05-ComplexITABsInABAPSQL_003.png]]

Você também pode combinar a cláusula `FIELDS *` com a instrução **`INTO CORRESPONDING FIELDS OF TABLE @airports`**: dessa forma, apenas os campos homônimos existentes na tabela interna de destino serão lidos do banco de dados.

![[05-ComplexITABsInABAPSQL_004.png]]

### Declarações Inline com `INTO TABLE @DATA(...)`

Ao utilizar `DATA(...)` após `INTO TABLE`, você declara uma tabela interna inline:

```abap
SELECT
  FROM /DMO/I_Airport
FIELDS AirportID, Name AS AirportName
 WHERE City = 'London'
  INTO TABLE @DATA(airports_inline).
```

O tipo de linha é derivado diretamente da cláusula `FIELDS`.

> [!NOTE] Nota
> - Declarações inline de tabelas internas são permitidas apenas após `INTO TABLE`. Não são suportadas com `INTO CORRESPONDING FIELDS OF TABLE`.
> - Tabelas geradas inline são sempre do tipo **Standard Table sem chave explícita**. Se você pretende realizar muitas buscas por chave nessa tabela, considere declarar explicitamente uma tabela do tipo Sorted ou Hashed para garantir alta performance.

---

### Diretiva `UNION` no ABAP SQL

![[05-ComplexITABsInABAPSQL_005.png]]
![[05-ComplexITABsInABAPSQL_006.png]]

A diretiva **`UNION`** permite combinar os resultados de várias instruções `SELECT` diretamente dentro do banco de dados:

- **`UNION`:** Combina os resultados e elimina linhas duplicadas antes de retornar ao ABAP.
- **`UNION ALL`:** Combina os resultados preservando todas as linhas, sem sobrecarregar o banco de dados com a eliminação de duplicatas.

Requisitos:
- As listas de seleção na cláusula `FIELDS` de cada consulta devem possuir a **mesma quantidade de campos** e os **mesmos nomes de campos ou aliases**.
- A cláusula `INTO TABLE` é posicionada uma única vez no final de toda a declaração combinada.

```abap
SELECT FROM /DMO/I_Carrier
       FIELDS 'Airline' AS type, AirlineID AS Id, Name
       WHERE CurrencyCode = 'GBP'
UNION ALL
SELECT FROM /DMO/I_Airport
       FIELDS 'Airport' AS type, AirportID AS Id, Name
       WHERE City = 'London'
INTO TABLE @DATA(names).
```

---

## Faça Você Mesmo: Tabelas Internas no ABAP SQL

1. Como no primeiro exercício deste curso, crie uma nova classe global que implemente a interface `IF_OO_ADT_CLASSRUN`.
2. Copie o seguinte trecho de código para a parte de implementação do método `if_oo_adt_classrun~main( )`:
   ```abap
   TYPES: BEGIN OF st_airport,
            airportid TYPE /dmo/airport_id,
            name      TYPE /dmo/airport_name,
          END OF st_airport.

   TYPES tt_airports TYPE STANDARD TABLE OF st_airport
                         WITH NON-UNIQUE KEY airportid.

   DATA airports TYPE tt_airports.

   * Example 1: Structured Variables in SELECT SINGLE ... INTO ...
   **********************************************************************
   DATA airport_full TYPE /dmo/i_airport.

   SELECT SINGLE
     FROM /DMO/I_Airport
   FIELDS AirportID, Name, City, CountryCode
    WHERE City = 'Zurich'
     INTO @airport_full.

   out->write( `-------------------------------------` ).
   out->write( `Example 1: SELECT SINGLE ... INTO ...` ).
   out->write( data = airport_full
               name = `One of the airports in Zurich (Structure):` ).

   * Example 2: Internal Tables in SELECT ... INTO TABLE ...
   **********************************************************************
   DATA airports_full TYPE STANDARD TABLE OF /dmo/i_airport
                           WITH NON-UNIQUE KEY AirportID.

   SELECT
     FROM /DMO/I_Airport
   FIELDS airportid, Name, City, CountryCode
    WHERE City = 'London'
     INTO TABLE @airports_full.

   out->write( `------------------------------------` ).
   out->write( `Example 2: SELECT ... INTO TABLE ...` ).
   out->write( data = airports_full
               name = `All airports in London (Internal Table):` ).

   * Example 3: FIELDS * and INTO CORRESPONDING FIELDS OF TABLE
   **********************************************************************
   SELECT
     FROM /DMO/I_Airport
   FIELDS *
    WHERE City = 'London'
     INTO CORRESPONDING FIELDS OF TABLE @airports.

   out->write( `----------------------------------------------------------` ).
   out->write( `Example 3: FIELDS * and INTO CORRESPONDING FIELDS OF TABLE` ).
   out->write( data = airports
               name = `Internal Table AIRPORTS:` ).

   * Example 4: Inline Declaration
   **********************************************************************
   SELECT
     FROM /DMO/I_Airport
   FIELDS AirportID, Name AS AirportName
    WHERE City = 'London'
    INTO TABLE @DATA(airports_inline).

   out->write( `----------------------------------------------------------` ).
   out->write( `Example 4: Inline Declaration after INTO TABLE` ).
   out->write( data = airports_inline
               name = `Internal Table AIRPORTS_INLINE:` ).

   * Example 5: UNION ALL
   **********************************************************************
   SELECT FROM /DMO/I_Carrier
          FIELDS 'Airline' AS type, AirlineID AS Id, Name
          WHERE CurrencyCode = 'GBP'
   UNION ALL
   SELECT FROM /DMO/I_Airport
          FIELDS 'Airport' AS type, AirportID AS Id, Name
          WHERE City = 'London'
   INTO TABLE @DATA(names).

   out->write( `----------------------------------------------` ).
   out->write( `Example 5: UNION ALL of Airlines and Airports ` ).
   out->write( data = names
               name = `ID and Name of Airlines and Airports:` ).
   ```
3. Pressione **Ctrl + F3** para ativar a classe e **F9** para executá-la como console app.
4. Analise a saída no console. Depure o programa e faça testes com o código-fonte para se familiarizar com os conceitos.

---

## Exercício Prático: Utilizar uma Tabela Interna Complexa

Neste exercício, você declarará um atributo com formato de tabela interna, irá preenchê-lo utilizando uma instrução `SELECT` e acessará seu conteúdo.

#### Modelo (Template):
- `/LRN/CL_S4D400_STS_STRUCTURE` (Classe global)

#### Solução (Solution):
- `/LRN/CL_S4D400_ITS_ITAB` (Classe global)

### Tarefa 1: Copiar Modelo

Copie a classe modelo. Alternativamente, continue a partir da sua solução do exercício anterior.

#### Passos

1. Copie a classe **/LRN/CL_S4D400_STS_STRUCTURE** para uma classe em seu próprio pacote (nome sugerido: **ZCL_##_ITAB**, onde `##` representa o número do seu grupo):
   1. Abra o código-fonte da classe global **/LRN/CL_S4D400_STS_STRUCTURE**.
   2. Vincule a visão *Project Explorer* ao editor (botão *Link with Editor*).
   3. Clique com o botão direito na classe **/LRN/CL_S4D400_STS_STRUCTURE** e escolha **Duplicate...**.
   4. Informe o nome do seu pacote no campo *Package* e **ZCL_##_ITAB** no campo *Name*.
   5. Ajuste a descrição, confirme a solicitação de transporte e clique em *Finish*.

---

### Tarefa 2: Declarar uma Tabela Interna

Na classe local, declare o atributo estático do tipo tabela **airports** para armazenar em buffer as informações de todos os aeroportos disponíveis. Comece definindo o tipo estruturado privado **st_airport** e o tipo de tabela **tt_airports**.

#### Passos

1. Alterne para a classe local **lcl_connection** (aba *Local Types*).
2. Defina o tipo de estrutura privado **st_airport**:

   | Nome do Componente | Tipo de Dados |
   | :--- | :--- |
   | **AirportId** | `/dmo/airport_id` |
   | **Name** | `/dmo/airport_name` |

   ```abap
   TYPES:
     BEGIN OF st_details,
       DepartureAirport   TYPE /dmo/airport_from_id,
       DestinationAirport TYPE /dmo/airport_to_id,
       AirlineName        TYPE /dmo/carrier_name,
     END OF st_details.

   TYPES:
     BEGIN OF st_airport,
       AirportId TYPE /dmo/airport_id,
       Name      TYPE /dmo/airport_name,
     END OF st_airport.
   ```
3. Defina o tipo de tabela privado **tt_airports**:

   | Propriedade | Valor |
   | :--- | :--- |
   | **Tipo de linha** | `st_airport` |
   | **Tipo de tabela** | `STANDARD TABLE` |
   | **Definição de chave** | `NON-UNIQUE DEFAULT KEY` |

   ```abap
   TYPES tt_airports TYPE STANDARD TABLE OF st_airport
                          WITH NON-UNIQUE DEFAULT KEY.
   ```
4. Declare o novo atributo estático privado **airports** tipado com **tt_airports**:
   ```abap
   CLASS-DATA airports TYPE tt_airports.
   ```

---

### Tarefa 3: Preencher o Atributo Estático no Construtor de Classe

Defina um construtor estático (`class_constructor`) e implemente uma instrução `SELECT` que leia todos os aeroportos disponíveis da CDS View entity **/DMO/I_Airport** diretamente para o atributo estático `airports`.

#### Passos

1. Adicione o construtor estático à classe local **lcl_connection** utilizando o Quick Fix: posicione o cursor sobre o nome da classe, pressione **Ctrl + 1** e selecione **Generate class constructor**.
2. Na implementação do método **class_constructor**, adicione o seguinte comando `SELECT`:
   ```abap
   METHOD class_constructor.
     SELECT FROM /DMO/I_Airport
          FIELDS AirportID, Name
            INTO TABLE @airports.
   ENDMETHOD.
   ```

---

### Tarefa 4: Acessar o Conteúdo da Tabela Interna

Utilize o conteúdo da tabela interna **airports** no método **get_output** para exibir os nomes dos aeroportos de partida e de destino.

#### Passos

1. Navegue até a implementação do método **get_output**.
2. No início do método, leia os detalhes do aeroporto de partida e do aeroporto de destino em objetos de dados estruturados utilizando expressões de tabela com declarações inline:
   ```abap
   DATA(departure)   = airports[ airportID = details-departureairport   ].
   DATA(destination) = airports[ airportID = details-destinationairport ].
   ```
3. Utilize os componentes `name` das duas estruturas nas linhas do `APPEND`:
   ```abap
   APPEND |Departure:   { details-departureairport   } { departure-name   }| TO r_output.
   APPEND |Destination: { details-destinationairport } { destination-name }| TO r_output.
   ```
4. *(Opcional)* Você pode omitir os objetos de dados intermediários e utilizar as expressões de tabela diretamente dentro dos templates de string:
   ```abap
   APPEND |Departure:   { details-departureairport   } { airports[ airportid = details-departureairport ]-name   }| TO r_output.
   APPEND |Destination: { details-destinationairport } { airports[ airportid = details-destinationairport ]-name }| TO r_output.
   ```
5. Ative a classe (**Ctrl + F3**) e execute-a (**F9**). Verifique se o console agora exibe os nomes completos dos aeroportos ao lado de seus respectivos códigos.
