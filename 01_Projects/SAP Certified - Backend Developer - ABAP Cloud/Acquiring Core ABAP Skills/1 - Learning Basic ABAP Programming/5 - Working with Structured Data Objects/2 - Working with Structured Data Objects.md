---
title: "Trabalhando com Objetos de Dados Estruturados"
source: "https://learning.sap.com/courses/basic-abap-programming/working-with-structured-data-objects_ca4e0b14-57ad-4993-a83b-cca17980399c"
author:
published:
created: 2026-10-21
description: "Após concluir esta lição, você será capaz de: Trabalhar com objetos de dados estruturados. Usar objetos de dados estruturados no ABAP SQL."
tags:
  - "clippings"
---

## Objetivos

Após concluir esta lição, você será capaz de:

- Trabalhar com objetos de dados estruturados.
- Utilizar objetos de dados estruturados no ABAP SQL.

## Objetos de Dados Estruturados

![[03-WorkWithStructDataObj_001.png]]

Para acessar um componente de uma estrutura, você deve posicionar um sinal de hífen (`-`) entre o nome da estrutura e o nome do componente:

```abap
connection-airport_from_id = 'ABC'.
```

> [!NOTE] Nota
> Não são permitidos espaços em branco antes ou depois do seletor de componente (`-`).

Ao acessar um componente de estrutura dessa forma, você pode utilizá-lo em qualquer posição de operando que aceite uma variável do mesmo tipo. No exemplo acima, o componente `airport_from_id` da estrutura `connection` é do tipo `/DMO/AIRPORT_FROM_ID`. Consequentemente, você pode utilizar esse componente em qualquer posição de operando onde uma variável simples desse tipo seria aceita: não apenas no lado esquerdo de uma atribuição, mas também no lado direito, na passagem de parâmetros de uma chamada de método, nas cláusulas `INTO` ou `WHERE` de uma instrução `SELECT`, e assim por diante.

![[03-WorkWithStructDataObj_002.png]]

Se o componente de uma estrutura for ele próprio uma estrutura, você acessa os subcomponentes utilizando o seletor de componente novamente após o nome do componente principal:

```abap
connection_nested-message-msgty = 'E'.
```

A primeira atribuição de valor no exemplo acessa o subcomponente `msgty` de `message`, que por sua vez é um componente da estrutura aninhada `connection_nested`.

> [!TIP] Dica
> Você pode utilizar o preenchimento automático de código (*code completion*) para acessar componentes de estrutura: posicione o cursor imediatamente após o seletor de componente (`-`) e pressione **Ctrl + Space** para exibir a lista de todos os componentes disponíveis.

---

### Preenchimento de Estruturas com a Expressão `VALUE #( )`

![[03-WorkWithStructDataObj_003.png]]

A expressão de construtor `VALUE #( )` é uma forma elegante e moderna de atribuir valores a um objeto de dados estruturado.

Para preencher uma estrutura inteira, você pode atribuir valores a cada componente individualmente, como visto no exemplo anterior. No entanto, você também pode utilizar a expressão `VALUE #( )`.

A expressão constrói uma estrutura, preenche-a com valores e atribui a estrutura preenchida a uma variável (neste caso, `connection`). O símbolo cerquilha (`#`) instrui o ambiente de tempo de execução do ABAP a construir uma estrutura com o mesmo tipo da variável de destino. Entre os parênteses, você lista os componentes que deseja preencher (não é obrigatório preencher todos) e atribui seus respectivos valores.

Quando você preenche uma estrutura dessa forma, o sistema em tempo de execução limpa todos os valores existentes na estrutura antes de preenchê-la com os novos valores da expressão.

> [!NOTE] Nota
> Uma atribuição no formato `connection = VALUE #( ).` (com apenas um espaço entre os parênteses) preenche todos os componentes da estrutura com o valor inicial específico de seus tipos. Isso produz o mesmo efeito da instrução `CLEAR connection.`.

---

### Atribuição Direta entre Estruturas

![[03-WorkWithStructDataObj_004.png]]

No ABAP, você só pode copiar os conteúdos de uma estrutura diretamente para outra utilizando a sintaxe `<estrutura_destino> = <estrutura_origem>` se os tipos de ambas as estruturas forem compatíveis. Isso ocorre, de modo geral, quando ambas possuem exatamente o mesmo tipo. Se as estruturas tiverem tipos diferentes, duas situações podem acontecer:

- Se uma das estruturas contiver um componente não caractere em uma posição onde a outra possui um componente caractere, a atribuição direta resultará em um **erro de sintaxe**.
- Se ambas as estruturas forem compostas exclusivamente por caracteres (*char-like*), a atribuição direta é tecnicamente permitida pelo compilador, mas geralmente o **resultado estará incorreto**: os dados serão copiados pelo alinhamento de bytes/posições, e não pelo significado dos campos.

No exemplo da imagem, a estrutura de origem e a de destino são formadas apenas por caracteres. Por isso, a atribuição direta é permitida, mas o resultado fica corrompido: o conteúdo do componente `carrier_name` é gravado dentro do componente `message` na estrutura de destino.

Por não gerar erro de sintaxe, deve-se ter atenção redobrada ao manipular estruturas não compatíveis baseadas em caracteres.

---

### Atribuição com o Operador `CORRESPONDING #( )`

![[03-WorkWithStructDataObj_005.png]]

Ao copiar dados entre estruturas diferentes, o objetivo geralmente é transferir a informação de um campo para o campo correspondente na estrutura de destino (`airport_from_id` para `airport_from_id`, `airport_to_id` para `airport_to_id`, etc.).

Para realizar essa operação no ABAP, utiliza-se a expressão **`CORRESPONDING #( )`**. Ela atribui valores da `<estrutura_origem>` para os componentes homônimos (com o mesmo nome) da `<estrutura_destino>`.

Regras importantes:
- Os campos devem ter **nomes idênticos**.
- Os componentes **não precisam estar na mesma posição ou ordem** nas duas estruturas.
- Se os campos possuírem tipos diferentes, o ABAP tentará realizar a conversão de tipo de acordo com as regras de conversão da linguagem.
- Componentes da estrutura de destino que não existirem na estrutura de origem permanecerão com seus valores iniciais.

A expressão `CORRESPONDING` no exemplo cria uma estrutura do tipo `st_connection_nested`, preenchendo os componentes com nomes coincidentes a partir da estrutura `connection`. O componente `message` permanece inicial.

---

## Faça Você Mesmo: Acesso a Objetos de Dados Estruturados

1. Como no primeiro exercício deste curso, crie uma nova classe global que implemente a interface `IF_OO_ADT_CLASSRUN`.
2. Copie o seguinte trecho de código para a parte de implementação do método `if_oo_adt_classrun~main( )`:
   ```abap
   TYPES: BEGIN OF st_connection,
            airport_from_id TYPE /dmo/airport_from_id,
            airport_to_id   TYPE /dmo/airport_to_id,
            carrier_name    TYPE /dmo/carrier_name,
          END OF st_connection.

   TYPES: BEGIN OF st_connection_nested,
            airport_from_id TYPE /dmo/airport_from_id,
            airport_to_id   TYPE /dmo/airport_to_id,
            message         TYPE symsg,
            carrier_name    TYPE /dmo/carrier_name,
          END OF st_connection_nested.

   DATA connection TYPE st_connection.
   DATA connection_nested TYPE st_connection_nested.

   * Example 1: Access to structure components
   **********************************************************************
   connection-airport_from_id = 'ABC'.
   connection-airport_to_id   = 'XYZ'.
   connection-carrier_name    = 'My Airline'.

   " Access to sub-components of nested structure
   connection_nested-message-msgty = 'E'.
   connection_nested-message-msgid = 'ABC'.
   connection_nested-message-msgno = '123'.

   * Example 2: Filling a structure with VALUE #( )
   **********************************************************************
   CLEAR connection.
   connection = VALUE #( airport_from_id = 'ABC'
                         airport_to_id   = 'XYZ'
                         carrier_name    = 'My Airline' ).

   " Nested VALUE to fill nested structure
   connection_nested = VALUE #( airport_from_id = 'ABC'
                                airport_to_id   = 'XYZ'
                                message         = VALUE #( msgty = 'E'
                                                           msgid = 'ABC'
                                                           msgno = '123' )
                                carrier_name    = 'My Airline' ).

   * Example 3: Wrong result after direct assignment
   **********************************************************************
   connection_nested = connection.
   out->write( `-------------------------------------------------------------` ).
   out->write( `Example 3: Wrong Result after direct assignment` ).
   out->write( data = connection
               name = `Source Structure:` ).
   out->write( |Component connection_nested-message-msgid: { connection_nested-message-msgid }| ).
   out->write( |Component connection_nested-carrier_name : { connection_nested-carrier_name  }| ).

   * Example 4: Assigning Structures using CORRESPONDING #( )
   **********************************************************************
   CLEAR connection_nested.
   connection_nested = CORRESPONDING #( connection ).
   out->write( `-------------------------------------------------------------` ).
   out->write( `Example 4: Correct Result after assignment with CORRESPONDING` ).
   out->write( data = connection
               name = `Source Structure:` ).
   out->write( |Component connection_nested-message-msgid: { connection_nested-message-msgid }| ).
   out->write( |Component connection_nested-carrier_name : { connection_nested-carrier_name  }| ).
   ```
3. Pressione **Ctrl + F3** para ativar a classe e **F9** para executá-la como console app.
4. Analise a saída do console. Depure o programa e faça testes com o código-fonte para se familiarizar com os conceitos.

---

## Objetos de Dados Estruturados no ABAP SQL

![[04-UseStructDataObjInABAPSQL_001 (1).png]]

A cláusula `INTO` da instrução `SELECT` funcionará corretamente apenas se a quantidade e os tipos dos componentes da estrutura de destino corresponderem à quantidade e aos tipos das colunas especificadas na cláusula `FIELDS`. No exemplo acima, a instrução funciona porque a estrutura de destino `connection` possui três componentes com o mesmo tipo e comprimento das colunas `DepartureAirport`, `DestinationAirport` e `\_Airline-Name` listadas na cláusula `FIELDS`. 

Observe que, nesse caso, os nomes dos campos não precisam ser idênticos, pois o sistema preenche a estrutura de destino estritamente da esquerda para a direita (por posição). Se a lista na cláusula `FIELDS` não for compatível com a estrutura de destino no `INTO`, ocorrerá um erro de tempo de execução (*runtime error*).

---

### Leitura com `FIELDS *`

![[04-UseStructDataObjInABAPSQL_002.png]]

Uma técnica simples para garantir que a estrutura de destino coincida com os campos selecionados:

- A estrutura de destino é tipada diretamente com a CDS View `/DMO/I_Connection`, que é a mesma fonte de dados indicada na cláusula `FROM`.
- O caractere asterisco (`*`) após a palavra-chave `FIELDS` é uma notação resumida que garante que todos os campos da visão façam parte da seleção (associações expostas são desconsideradas).

> [!NOTE] Nota
> Essa técnica também está disponível ao ler diretamente de tabelas de banco de dados, pois as definições de tabelas também funcionam como tipos de estrutura globais no ABAP.

A principal vantagem dessa técnica é que o comando `SELECT` permanece sintaticamente intacto mesmo se novos campos forem adicionados à visão ou tabela. A principal desvantagem é que você sempre lê todos os campos do banco de dados, necessitando deles ou não.

> [!WARNING] Cuidado com o Desempenho
> Utilize `FIELDS *` apenas para tabelas ou visões com um número reduzido de campos e quando você realmente precisar de todas as colunas. A leitura desnecessária de campos é uma das causas mais comuns de problemas de performance.

---

### Cláusula `INTO CORRESPONDING FIELDS OF`

![[04-UseStructDataObjInABAPSQL_003.png]]

Outra forma de evitar divergências é utilizar a variante **`INTO CORRESPONDING FIELDS OF`**. Ela possui o mesmo comportamento do operador `CORRESPONDING #( )`, garantindo que os dados lidos sejam copiados exclusivamente para os componentes homônimos da estrutura.

Ao definir uma estrutura com apenas os componentes necessários para a sua lógica de negócio, você garante que apenas os dados pertinentes sejam transferidos, mesmo se a lista de campos for mais ampla. Os tipos dos campos homônimos devem ser compatíveis para evitar conversões indesejadas ou erros em tempo de execução.

---

### Utilizando Aliases para Campos no ABAP SQL

![[04-UseStructDataObjInABAPSQL_004.png]]

Se os nomes dos campos na fonte de dados forem diferentes dos nomes dos componentes na estrutura de destino, o `INTO CORRESPONDING FIELDS OF` não conseguirá vinculá-los diretamente.

Para resolver isso mantendo o `INTO CORRESPONDING FIELDS OF`, você pode definir nomes de **alias** para os campos na cláusula `FIELDS`, adicionando a palavra-chave `AS` seguida pelo nome do alias:

```abap
SELECT SINGLE
  FROM /DMO/I_Connection
  FIELDS DepartureAirport AS airport_from_id,
         \_Airline-Name   AS carrier_name
 WHERE AirlineID    = 'LH'
   AND ConnectionID = '0400'
  INTO CORRESPONDING FIELDS OF @connection.
```

Com base nesses aliases, o `INTO CORRESPONDING FIELDS OF` identifica com precisão em quais componentes da estrutura os dados devem ser armazenados.

---

### Declarações Inline na Cláusula INTO

![[04-UseStructDataObjInABAPSQL_005.png]]

A técnica mais prática para evitar incompatibilidades entre a lista de campos e a estrutura de destino é utilizar uma **declaração inline** (`@DATA(...)`) na cláusula `INTO`:

```abap
SELECT SINGLE
  FROM /DMO/I_Connection
  FIELDS DepartureAirport,
         DestinationAirport AS ArrivalAirport,
         \_Airline-Name     AS carrier_name
 WHERE AirlineID    = 'LH'
   AND ConnectionID = '0400'
  INTO @DATA(connection_inline).
```

A estrutura é criada em tempo de compilação com a sequência, tipos e nomes correspondentes exatamente à lista da cláusula `FIELDS`. Caso um campo possua um alias (como `DestinationAirport AS ArrivalAirport`), o nome do alias será utilizado como o nome do componente na estrutura gerada.

> [!NOTE] Nota
> Declarações inline são suportadas apenas após `INTO @DATA(...)`. Não é possível usar declarações inline após `INTO CORRESPONDING FIELDS OF`.

---

### Junções no ABAP SQL (SQL Joins)

![[04-UseStructDataObjInABAPSQL_006.png]]

Ao trabalhar com bancos de dados relacionais, frequentemente é necessário ler dados relacionados distribuídos em tabelas diferentes. Já vimos que associações em CDS Views são uma forma muito elegante de realizar essa tarefa. Caso não exista uma CDS View com as associações necessárias, você pode implementar **Joins SQL** diretamente no ABAP SQL.

Um Join é composto pelos seguintes blocos:

- **Fontes de Dados (*Data Sources*):** As tabelas ou visões combinadas entre si. Um join simples combina uma fonte de dados à esquerda com uma fonte de dados à direita. O ABAP SQL também suporta joins aninhados (*nested joins*).
- **Condição de Junção (*Join Condition*):** Especifica quais registros da fonte à direita correspondem a um registro da fonte à esquerda (cláusula `ON`).
- **Tipo de Junção (*Join Type*):** Define como o resultado é tratado caso não haja correspondência em uma das fontes (`INNER JOIN`, `LEFT OUTER JOIN`, `RIGHT OUTER JOIN`, `CROSS JOIN`). O mais comum no desenvolvimento de aplicações de negócio é o **`LEFT OUTER JOIN`**.

![[04-UseStructDataObjInABAPSQL_007.png]]

Na cláusula `FROM`, o tipo de junção é definido pelas palavras-chave `LEFT OUTER JOIN` entre a tabela à esquerda (`/dmo/connection`) e a tabela à direita (`/dmo/airport`). Aliases (`c` e `f`) podem ser definidos para simplificar o código.

A condição de junção segue a palavra-chave `ON`. O separador entre o alias (ou nome da tabela) e o campo é o caractere til (`~`):

```abap
SELECT SINGLE
  FROM /dmo/connection AS c
  LEFT OUTER JOIN /dmo/airport AS f
    ON c~airport_from_id = f~airport_id
FIELDS c~airport_from_id, c~airport_to_id, f~name AS airport_from_name
 WHERE c~carrier_id    = 'LH'
   AND c~connection_id = '0400'
  INTO @DATA(connection_join).
```

> [!NOTE] Gestão Automática de Mandantes em Joins
> No ABAP SQL, não é necessário incluir os campos de mandante (`client`) na condição de junção (`ON`). A interface de banco de dados adiciona automaticamente a condição de mandante antes de enviar a consulta ao banco de dados.

![[04-UseStructDataObjInABAPSQL_008.png]]

Quando você precisa ler dados de aeroportos tanto para a origem quanto para o destino, a mesma tabela `/dmo/airport` precisa ser consultada duas vezes. Para isso, utiliza-se um **Join Aninhado** (*nested join*), onde o uso de aliases distintos (`f` para *from* e `t` para *to*) é fundamental para diferenciar as duas participações da mesma tabela.

---

## Faça Você Mesmo: Objetos de Dados Estruturados no ABAP SQL

1. Como no primeiro exercício deste curso, crie uma nova classe global que implemente a interface `IF_OO_ADT_CLASSRUN`.
2. Copie o seguinte trecho de código para a parte de implementação do método `if_oo_adt_classrun~main( )`:
   ```abap
   TYPES: BEGIN OF st_connection,
            airport_from_id TYPE /dmo/airport_from_id,
            airport_to_id   TYPE /dmo/airport_to_id,
            carrier_name    TYPE /dmo/carrier_name,
          END OF st_connection.

   TYPES: BEGIN OF st_connection_short,
            DepartureAirport   TYPE /dmo/airport_from_id,
            DestinationAirport TYPE /dmo/airport_to_id,
          END OF st_connection_short.

   DATA connection TYPE st_connection.
   DATA connection_short TYPE st_connection_short.
   DATA connection_full TYPE /dmo/i_connection.

   * Example 1: Correspondence between FIELDS and INTO
   **********************************************************************
   SELECT SINGLE
      FROM /DMO/I_Connection
    FIELDS DepartureAirport, DestinationAirport, \_Airline-Name
     WHERE AirlineID = 'LH'
       AND ConnectionID = '0400'
      INTO @connection.

   out->write( `------------------------------` ).
   out->write( `Example 1: Field List and INTO` ).
   out->write( connection ).

   * Example 2: FIELDS *
   **********************************************************************
   SELECT SINGLE
     FROM /DMO/I_Connection
   FIELDS *
    WHERE AirlineID = 'LH'
      AND ConnectionID = '0400'
     INTO @connection_full.

   out->write( `----------------------------` ).
   out->write( `Example 2: FIELDS * and INTO` ).
   out->write( connection_full ).

   * Example 3: INTO CORRESPONDING FIELDS
   **********************************************************************
   SELECT SINGLE
     FROM /DMO/I_Connection
   FIELDS *
    WHERE AirlineID    = 'LH'
      AND ConnectionID = '0400'
     INTO CORRESPONDING FIELDS OF @connection_short.

   out->write( `----------------------------------------------------` ).
   out->write( `Example 3: FIELDS * and INTO CORRESPONDING FIELDS OF` ).
   out->write( connection_short ).

   * Example 4: Alias Names for Fields
   **********************************************************************
   CLEAR connection.
   SELECT SINGLE
     FROM /DMO/I_Connection
   FIELDS DepartureAirport AS airport_from_id,
          \_Airline-Name   AS carrier_name
    WHERE AirlineID    = 'LH'
      AND ConnectionID = '0400'
     INTO CORRESPONDING FIELDS OF @connection.

   out->write( `---------------------------------------------------` ).
   out->write( `Example 4: Aliases and INTO CORRESPONDING FIELDS OF` ).
   out->write( connection ).

   * Example 5: Inline Declaration
   **********************************************************************
   SELECT SINGLE
     FROM /DMO/I_Connection
   FIELDS DepartureAirport,
          DestinationAirport AS ArrivalAirport,
          \_Airline-Name     AS carrier_name
    WHERE AirlineID    = 'LH'
      AND ConnectionID = '0400'
     INTO @DATA(connection_inline).

   out->write( `-----------------------------------------` ).
   out->write( `Example 5: Aliases and Inline Declaration` ).
   out->write( connection_inline ).

   * Example 6: Joins
   **********************************************************************
   SELECT SINGLE
     FROM ( /dmo/connection AS c
     LEFT OUTER JOIN /dmo/airport AS f
       ON c~airport_from_id = f~airport_id )
     LEFT OUTER JOIN /dmo/airport AS t
       ON c~airport_to_id = t~airport_id
   FIELDS c~airport_from_id, c~airport_to_id,
          f~name AS airport_from_name, t~name AS airport_to_name
    WHERE c~carrier_id    = 'LH'
      AND c~connection_id = '0400'
     INTO @DATA(connection_join).

   out->write( `------------------------------------------` ).
   out->write( `Example 6: Join of Connection and Airports` ).
   out->write( connection_join ).
   ```
3. Pressione **Ctrl + F3** para ativar a classe e **F9** para executá-la como console app.
4. Analise a saída no console. Depure o programa e faça testes com o código-fonte para se familiarizar com os conceitos.

---

## Exercício Prático: Utilizar um Objeto de Dados Estruturado

Neste exercício, você declarará um atributo estruturado, irá preenchê-lo utilizando uma instrução `SELECT` e acessará seus componentes.

#### Modelo (Template):
- `/LRN/CL_S4D400_DBS_CDS` (Classe global)

#### Solução (Solution):
- `/LRN/CL_S4D400_STS_STRUCTURE` (Classe global)

### Tarefa 1: Copiar Modelo

Copie a classe modelo. Alternativamente, continue a partir da sua solução do exercício anterior.

#### Passos

1. Copie a classe **/LRN/CL_S4D400_DBS_CDS** para uma classe em seu próprio pacote (nome sugerido: **ZCL_##_STRUCTURE**, onde `##` representa o número do seu grupo):
   1. Abra o código-fonte da classe global **/LRN/CL_S4D400_DBS_CDS**.
   2. Vincule a visão *Project Explorer* ao editor (botão *Link with Editor*).
   3. Clique com o botão direito na classe **/LRN/CL_S4D400_DBS_CDS** e escolha **Duplicate...**.
   4. Informe o nome do seu pacote no campo *Package* e **ZCL_##_STRUCTURE** no campo *Name*.
   5. Ajuste a descrição, selecione *Next*, confirme a solicitação de transporte e clique em *Finish*.

---

### Tarefa 2: Declarar um Objeto de Dados Estruturado

Na classe local, declare o atributo estruturado **details** para substituir os atributos escalares individuais `airport_from_id`, `airport_to_id` e `carrier_name`. Comece definindo o tipo de estrutura privado **st_details** dentro da classe local.

#### Passos

1. Alterne para a classe local **lcl_connection** (aba *Local Types*).
2. Defina o tipo de estrutura **privado** **st_details** com os seguintes componentes:

   | Nome do Componente | Tipo de Dados |
   | :--- | :--- |
   | **DepartureAirport** | `/dmo/airport_from_id` |
   | **DestinationAirport** | `/dmo/airport_to_id` |
   | **AirlineName** | `/dmo/carrier_name` |

   Após a linha `PRIVATE SECTION.`, adicione o seguinte código:
   ```abap
   TYPES:
     BEGIN OF st_details,
       DepartureAirport   TYPE /dmo/airport_from_id,
       DestinationAirport TYPE /dmo/airport_to_id,
       AirlineName        TYPE /dmo/carrier_name,
     END OF st_details.
   ```
3. Comente ou remova a declaração dos atributos escalares `airport_from_id`, `airport_to_id` e `carrier_name` (selecione as linhas e pressione **Ctrl + <**).
4. Declare o novo atributo de instância privado **details**, tipando-o com o tipo de estrutura **st_details**:
   ```abap
   DATA details TYPE st_details.
   ```

---

### Tarefa 3: Acessar Componentes da Estrutura

Utilize os componentes do atributo estruturado **details** na implementação do método **get_output**.

#### Passos

1. Navegue até a implementação do método **get_output**.
2. Substitua o acesso aos antigos atributos escalares pelos componentes correspondentes do atributo `details` (use **Ctrl + Space** após o hífen para autocompletar):
   ```abap
   APPEND |--------------------------------|                    TO r_output.
   APPEND |Carrier:     { carrier_id } { details-airlinename }| TO r_output.
   APPEND |Connection:  { connection_id   }|                    TO r_output.
   APPEND |Departure:   { details-departureairport     }|       TO r_output.
   APPEND |Destination: { details-destinationairport   }|       TO r_output.
   ```

---

### Tarefa 4: Preencher o Atributo Estruturado no Comando SELECT

Utilize o atributo estruturado como destino da instrução `SELECT` no método **constructor**.

#### Passos

1. Navegue até a implementação do método **constructor**.
2. Substitua a lista de objetos de dados na cláusula `INTO` pelo atributo estruturado `@details`:
   ```abap
   SELECT SINGLE
     FROM /DMO/I_Connection
     FIELDS DepartureAirport, DestinationAirport, \_Airline-Name 
    WHERE AirlineID    = @i_carrier_id
      AND ConnectionID = @i_connection_id
     INTO @details.
   ```
3. *(Opcional)* Utilize a variante sintática `INTO CORRESPONDING FIELDS OF @details.` com o alias `AirlineName` para a associação exposta:
   ```abap
   SELECT SINGLE
     FROM /DMO/I_Connection
     FIELDS DepartureAirport, DestinationAirport, \_Airline-Name AS AirlineName
    WHERE AirlineID    = @i_carrier_id
      AND ConnectionID = @i_connection_id
     INTO CORRESPONDING FIELDS OF @details.
   ```
4. Ative a classe (**Ctrl + F3**) e execute-a (**F9**). Verifique se todos os dados continuam sendo exibidos corretamente no console.
