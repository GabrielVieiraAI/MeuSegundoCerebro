---
title: "Definindo e Chamando Métodos"
source: "https://learning.sap.com/courses/basic-abap-programming/defining-and-calling-methods_bc2d0d2a-d7f4-41bf-84f2-65de61c408ed"
author:
published:
created: 2026-10-21
description: "Após concluir esta lição, você será capaz de: Definir e chamar métodos."
tags:
  - "clippings"
---
## Objetivo

Após concluir esta lição, você será capaz de definir e chamar métodos.

## Definição de Métodos

![[02_-_Define_and_Call_Methods_001.png]]

Na parte de definição de uma classe, você usa `METHODS` para definir um método de instância e `CLASS-METHODS` para definir um método estático. O nome do método é seguido pela sua assinatura; isto é, o conjunto de valores que o método troca com o chamador e as exceções que podem ocorrer durante a execução do método.

A assinatura de um método consiste em parâmetros e exceções. Cada parâmetro possui um nome e um tipo.

O ABAP conhece os seguintes tipos de parâmetros:

### Parâmetros de Importação (Importing Parameters)

Parâmetros de importação são valores que o método recebe do chamador. Um método pode ter qualquer quantidade de parâmetros de importação.

Por padrão, os parâmetros de importação são obrigatórios, mas existem duas maneiras de torná-los opcionais:

- Usando a adição `OPTIONAL`. O parâmetro torna-se opcional e seu valor padrão é o valor inicial correspondente ao tipo do parâmetro.
- Usando a adição `DEFAULT <val>`. O parâmetro torna-se opcional e seu valor padrão é o valor especificado em `<val>`.

Dentro de um método, você não pode alterar os parâmetros de importação. Se tentar fazer isso, ocorrerá um erro de sintaxe.

### Parâmetros de Exportação (Exporting Parameters)

Parâmetros de exportação são resultados retornados pelo método. Um método pode ter qualquer quantidade de parâmetros de exportação. Todos os parâmetros de exportação são opcionais — o programa chamador utiliza apenas os valores que realmente necessita.

### Parâmetros de Modificação (Changing Parameters)

Parâmetros de modificação são valores que o método recebe do chamador. Ao contrário dos parâmetros de importação, o método pode alterar os valores desses parâmetros. Eles são então devolvidos ao chamador sob o mesmo identificador. Um método pode ter qualquer quantidade de parâmetros de modificação. Por padrão, são obrigatórios; você pode torná-los opcionais da mesma forma que os parâmetros de importação.

### Parâmetros de Retorno (Returning Parameters)

Um parâmetro de retorno é um resultado do método que pode ser usado diretamente em uma expressão. Um método só pode ter um único parâmetro de retorno. Os parâmetros de retorno devem usar uma forma especial de passagem de parâmetros chamada passagem por valor (*pass-by-value*). Essa forma de passagem é definida envolvendo o nome do parâmetro entre parênteses (sem espaços!) e precedendo-o com a palavra-chave `VALUE`.

A palavra-chave `RAISING` é utilizada para listar as exceções que o método pode disparar para indicar uma situação de erro. O programa chamador pode então reagir ao erro.

![[02_-_Define_and_Call_Methods_002.png]]

Como exemplo, adicione dois métodos à nossa classe `lcl_connection`:

Um método `set_attributes( )` para definir os valores dos atributos `carrier_id` e `connection_id`, e um método `get_attributes( )` para retornar os valores desses atributos. Onde `set_attributes( )` precisa de dois parâmetros de importação (um para cada atributo), o método `get_attributes( )` precisa de dois parâmetros de exportação.

Para cada método definido, você também deve criar uma implementação na parte de implementação da classe. Enquanto não fizer isso, verá erros de sintaxe na sua classe, informando que a implementação do método está ausente.

> [!TIP] Dica
> O ADT oferece um Quick Fix para adicionar a implementação ausente. Para usar este Quick Fix:
> 1. Posicione o cursor na declaração `METHODS` com erro e pressione **Ctrl + 1**.
> 2. Na lista de Quick Fixes disponíveis, escolha **Add implementation for …** e pressione **Enter**. Se a implementação estiver ausente para vários métodos, o título do Quick Fix será **Add … unimplemented methods**.

## Como Definir Métodos

Demonstração: [Iniciar Demonstração](https://learnsap.enable-now.cloud.sap/pub/mmcp/index.html?library=library.txt&show=project!PR_D41C6BBE46D32482:demo)

## Implementação de Métodos

![[02_-_Define_and_Call_Methods_004.png]]

Você deve implementar todos os métodos definidos. Isso é feito na parte de implementação da classe, adicionando o par de instruções `METHOD <nome_do_metodo>` e `ENDMETHOD`.

A implementação do método contém instruções ABAP que podem acessar os parâmetros do método (não é permitido alterar parâmetros de importação) e todos os tipos, atributos e constantes declarados na classe, independentemente de sua visibilidade. Métodos de instância podem acessar tanto atributos de instância quanto atributos estáticos. Métodos estáticos podem acessar apenas componentes estáticos.

Dentro da parte de implementação de uma classe, você pode acessar os atributos dessa classe sem uma variável de referência e `->` (ou sem o nome da classe e **=>**, no caso de atributos estáticos).

![[02_-_Define_and_Call_Methods_005.png]]

Apenas na implementação de métodos de instância, o ABAP disponibiliza a variável predefinida `ME`. `ME` é uma variável de referência tipada com a classe atual e preenchida em tempo de execução com o endereço da instância atual. O uso de `ME` é opcional e deve ser evitado, a menos que o nome de um atributo colida com o nome de outro objeto de dados, por exemplo, o nome de um parâmetro.

No exemplo, os parâmetros de importação do método `set_attributes( )` possuem os mesmos nomes dos atributos correspondentes. Nessa situação, o nome sozinho referencia o parâmetro. Apenas colocando `me->` na frente fica claro que se trata do acesso a um atributo da instância atual.

![[02_-_Define_and_Call_Methods_006.png]]

Se ocorrer um erro durante a execução de um método, o método pode disparar uma exceção usando a instrução `RAISE EXCEPTION TYPE`, seguida pelo nome da exceção.

> [!NOTE] Nota
> Tecnicamente, nomes de exceções são nomes de classes ABAP especiais e a instrução `RAISE EXCEPTION TYPE` cria uma instância da classe referenciada. Essa instância é chamada de objeto de exceção e essas classes especiais são chamadas de classes de exceção.

No momento em que uma exceção é disparada, a execução do método é interrompida.

O controle é devolvido ao programa chamador se todos os pré-requisitos forem atendidos. Caso contrário, o programa inteiro termina com um erro de tempo de execução (*runtime error*).

Os pré-requisitos para a continuidade do programa são:

- A exceção disparada está declarada na cláusula `RAISING` da assinatura do método.
- A chamada do método está envolvida por uma estrutura de controle `TRY … ENDTRY`.
- A estrutura de controle `TRY … ENDTRY` contém um bloco `CATCH` para a exceção.

> [!NOTE] Nota
> Para algumas exceções, o editor ABAP exibe um aviso de sintaxe com um Quick Fix quando você dispara uma exceção que ainda não foi declarada na cláusula `RAISING` do método.

## Como Implementar Métodos

Demonstração: [Iniciar Demonstração](https://learnsap.enable-now.cloud.sap/pub/mmcp/index.html?library=library.txt&show=project!PR_6BF8538B5A617BA1:demo)

## Chamadas de Métodos

![[02_-_Define_and_Call_Methods_007.png]]

Você chama um método de instância usando uma variável de referência e o seletor de componente de instância (`->`). O seletor de componente é seguido pelo nome do método que você deseja chamar. Para métodos estáticos, você usa o nome da classe e o seletor de componente estático (**=>**). Em ambos os casos, a passagem de parâmetros ocorre dentro de um par de parênteses. Os parênteses são necessários em qualquer situação; eles permanecem vazios se nenhum parâmetro precisar ser passado.

> [!NOTE] Nota
> Nenhum espaço em branco é permitido entre o nome do método e o parêntese de abertura. Por outro lado, você precisa de pelo menos um espaço em branco após o parêntese de abertura e antes do parêntese de fechamento.

Parâmetros de importação são listados após a palavra-chave `EXPORTING`, porque os valores importados pelo método chamado são exportados pelo programa chamador. Os nomes dos parâmetros são listados no lado esquerdo de um sinal de igual (**=**) e uma expressão no lado direito. Essa expressão pode ser simples como um literal, constante ou variável, mas qualquer outra expressão também é permitida, desde que o tipo da expressão seja compatível com o tipo do parâmetro.

Parâmetros de exportação são listados após a palavra-chave `IMPORTING`. Observe que, para parâmetros de exportação, o nome do parâmetro também fica no lado esquerdo do sinal de igual. A variável do lado direito deve ter o mesmo tipo do parâmetro.

Parâmetros de modificação são listados após a palavra-chave `CHANGING`. O tipo da variável no lado direito deve ser compatível com o tipo do parâmetro no lado esquerdo.

![[02_-_Define_and_Call_Methods_008.png]]

O exemplo ilustra a chamada dos métodos de instância `set_attributes( )` e `get_attributes( )`. Os nomes dos parâmetros ficam sempre no lado esquerdo do sinal de igual (**=**).

> [!TIP] Dica
> Você pode usar o preenchimento de código (code completion) no ADT para gerar a chamada do método, incluindo a passagem de parâmetros:
> 1. Digite a variável de referência (ou nome da classe) e o seletor de componente.
> 2. Após digitar o seletor de componente, pressione **Ctrl + Space** para exibir uma lista de componentes disponíveis.
> 3. Escolha um método e pressione **Shift + Enter** para inserir o nome do método e sua assinatura completa no código. Parâmetros opcionais são listados em linhas comentadas.

![[02_-_Define_and_Call_Methods_010.png]]

Ao chamar um método, a palavra-chave `IMPORTING` é sempre necessária para receber o valor de parâmetros de exportação. Porém, a palavra-chave `EXPORTING` torna-se opcional se você estiver fornecendo apenas parâmetros de importação.

Para métodos com apenas um parâmetro de importação obrigatório, você pode até omitir a atribuição explícita do parâmetro. No exemplo, o parâmetro `i_carrier_id` é opcional com valor padrão `'LH'`. Portanto, o valor entre os parênteses é atribuído diretamente ao parâmetro de importação obrigatório restante `i_connection_id`.

## Como Chamar Métodos

Demonstração: [Iniciar Demonstração](https://learnsap.enable-now.cloud.sap/pub/mmcp/index.html?library=library.txt&show=project!PR_2DEC8B2FBF8684A2:demo)

## Tratamento de Exceções

![[02_-_Define_and_Call_Methods_011.png]]

Em uma seção anterior deste curso, você aprendeu como tratar erros de tempo de execução com estruturas de controle `TRY … ENDTRY`.

Exceções declaradas na cláusula `RAISING` de uma definição de método são tratadas exatamente da mesma maneira:

- Coloque a chamada do método no bloco `TRY` da estrutura de controle `TRY … ENDTRY`.
- Defina um bloco `CATCH` com o nome da exceção que deseja tratar.

> [!NOTE] Nota
> Se houver código que você deseja ignorar caso a chamada do método falhe, você pode colocá-lo dentro do bloco `TRY`, após a chamada do método.

## Faça Você Mesmo: Chamadas de Métodos e Tratamento de Exceções

1. Assim como no primeiro exercício deste curso, crie uma nova classe global que implemente a interface `IF_OO_ADT_CLASSRUN`.
2. Copie o seguinte trecho de código para a parte de implementação do método `if_oo_adt_classrun~main( )`:
   ```abap
   CONSTANTS c_carrier_id TYPE /dmo/carrier_id       VALUE 'LH'.
   CONSTANTS c_connection_id TYPE /dmo/connection_id VALUE '0400'.
   DATA connection  TYPE REF TO lcl_connection.
   DATA connections  TYPE TABLE OF REF TO lcl_connection.

   * Create Instance
   **********************************************************************
   connection = NEW #(  ).

   * Call Method and Handle Exception
   **********************************************************************
   out->write(  |i_carrier_id    = '{ c_carrier_id }' | ).
   out->write(  |i_connection_id = '{ c_connection_id }'| ).
   TRY.
       connection->set_attributes(
         EXPORTING
           i_carrier_id    = c_carrier_id
           i_connection_id = c_connection_id
       ).
       APPEND connection TO connections.
       out->write( `Method call successful` ).
     CATCH cx_abap_invalid_value.
       out->write( `Method call failed`     ).
   ENDTRY.
   ```
3. Navegue até a aba **Local Types** e insira o seguinte trecho de código lá:
   ```abap
   CLASS lcl_connection DEFINITION.
     PUBLIC SECTION.
   * Attributes
       DATA carrier_id    TYPE /dmo/carrier_id.
       DATA connection_id TYPE /dmo/connection_id.
   * Methods
       METHODS set_attributes
         IMPORTING
           i_carrier_id    TYPE /dmo/carrier_id  DEFAULT 'LH'
           i_Connection_id TYPE /dmo/connection_id
         RAISING
           cx_abap_invalid_value.
   ENDCLASS.

   CLASS lcl_connection IMPLEMENTATION.
     METHOD set_attributes.
       IF i_carrier_id IS INITIAL OR i_connection_id IS INITIAL.
         RAISE EXCEPTION TYPE cx_abap_invalid_value.
       ENDIF.
       carrier_id    = i_carrier_id.
       connection_id = i_connection_id.
     ENDMETHOD.
   ENDCLASS.
   ```
4. Pressione **Ctrl + F3** para ativar a classe e **F9** para executá-la como um aplicativo de console.
5. Analise a saída do console. Depure o programa e faça testes com o código-fonte para se familiarizar com os conceitos. Em particular, altere os valores das duas constantes para depurar o disparo da exceção.

## Métodos Funcionais

![[02_-_Define_and_Call_Methods_013.png]]

Métodos que possuem um parâmetro de retorno são chamados de métodos funcionais. Não é possível definir mais de um parâmetro de retorno para o mesmo método. É obrigatório definir o parâmetro de retorno no formato `VALUE(<nome_do_parametro>)`. Além do parâmetro de retorno, um método funcional pode ter qualquer combinação de outros parâmetros. O mais comum, no entanto, é adicionar apenas parâmetros de importação. O motivo é que, com parâmetros adicionais de exportação ou modificação, você perde a maior vantagem dos métodos funcionais, que é a capacidade de usar o resultado diretamente em outras expressões ABAP.

A figura mostra dois exemplos de como usar métodos funcionais em expressões; o primeiro é um exemplo simples onde o parâmetro de retorno é atribuído diretamente a uma variável. O segundo exemplo mostra como a chamada do método funcional é usada como entrada para outro método. O sistema executa o método funcional e, em seguida, utiliza o valor do parâmetro de retorno como entrada para o método `write( )`.

## Faça Você Mesmo: Métodos Funcionais

1. Como no primeiro exercício deste curso, crie uma nova classe global que implemente a interface `IF_OO_ADT_CLASSRUN`.
2. Copie o seguinte trecho de código para a parte de implementação do método `if_oo_adt_classrun~main( )`:
   ```abap
   DATA connection  TYPE REF TO lcl_connection.
   DATA connections  TYPE TABLE OF REF TO lcl_connection.

   * Create Instance
   **********************************************************************
   connection = NEW #(  ).
   connection->set_attributes(
     EXPORTING
       i_carrier_id    = 'LH'
       i_connection_id = '0400'
   ).
   APPEND connection TO connections.

   * Calling Functional Method
   **********************************************************************
   " in a value assignment (with inline declaration for result)
   DATA(result) = connection->get_output( ).

   " in logical expression
   IF connection->get_output(  ) IS NOT INITIAL.
     " as operand in a statement
     LOOP AT connection->get_output(  ) INTO DATA(line).
     ENDLOOP.
     " to supply input parameter of another method
     out->write( data = connection->get_output( )
                 name = `  ` ).
   ENDIF.
   ```
3. Navegue até a aba **Local Types** e insira o seguinte trecho de código lá:
   ```abap
   CLASS lcl_connection DEFINITION.
     PUBLIC SECTION.
   * Attributes
       DATA carrier_id    TYPE /dmo/carrier_id.
       DATA connection_id TYPE /dmo/connection_id.
   * Methods
       METHODS set_attributes
         IMPORTING
           i_carrier_id    TYPE /dmo/carrier_id  DEFAULT 'LH'
           i_Connection_id TYPE /dmo/connection_id.
       " Functional Method
       METHODS get_output
         RETURNING VALUE(r_output) TYPE string_table.
   *  PROTECTED SECTION.
   *  PRIVATE SECTION.
   ENDCLASS.

   CLASS lcl_connection IMPLEMENTATION.
     METHOD set_attributes.
       carrier_id    = i_carrier_id.
       connection_id = i_connection_id.
     ENDMETHOD.
     METHOD get_output.
       APPEND |------------------------------| TO r_output.
       APPEND |Carrier:     { carrier_id    }| TO r_output.
       APPEND |Connection:  { connection_id }| TO r_output.
     ENDMETHOD.
   ENDCLASS.
   ```
4. Pressione **Ctrl + F3** para ativar a classe e **F9** para executá-la como console app.
5. Analise a saída do console. Depure o programa e faça testes com o código-fonte para se familiarizar com os conceitos. Em particular, depure as diferentes chamadas do método funcional `get_output( )`.

## Definir e Chamar Métodos

Neste exercício, você definirá e implementará métodos em sua classe local `lcl_connection`. Em seguida, chamará esses métodos a partir do método `main( )` da sua classe global.

#### Modelo (Template):
- `/LRN/CL_S4D400_CLS_INSTANCES` (Classe global)

#### Solução (Solution):
- `/LRN/CL_S4D400_CLS_METHODS` (Classe global)

### Tarefa 1: Copiar Modelo (Opcional)

Copie a classe modelo. Se você concluiu o exercício anterior, pode ignorar esta tarefa e continuar editando sua classe **ZCL_##_LOCAL_CLASS** ou sua classe **ZCL_##_INSTANCES**.

#### Passos

1. Abra o código-fonte da classe global **/LRN/CL_S4D400_CLS_INSTANCES** no editor ABAP.
   1. Na barra de ferramentas do Eclipse, escolha *Open ABAP Development Object*. Alternativamente, pressione **Ctrl + Shift + A**.
   2. Digite `/LRN/CL_S4D400_CLS` como texto de busca.
   3. Na lista de objetos de desenvolvimento, escolha `/LRN/CL_S4D400_CLS_INSTANCES` e selecione *OK*.
2. Vincule a visão *Project Explorer* ao editor.
   1. Na barra de ferramentas do *Project Explorer*, localize o botão *Link with Editor*. Se ainda não estiver pressionado, selecione-o. Como resultado, o objeto de desenvolvimento aberto no editor será destacado no *Project Explorer*.
3. Copie a classe **/LRN/CL_S4D400_CLS_INSTANCES** para uma classe em seu próprio pacote (nome sugerido: **ZCL_##_METHODS**, onde `##` representa o número do seu grupo).
   1. Na visão *Project Explorer*, clique com o botão direito na classe **/LRN/CL_S4D400_CLS_INSTANCES** para abrir o menu de contexto.
   2. No menu de contexto, escolha *Duplicate...*.
   3. Digite o nome do seu pacote no campo *Package*. No campo *Name*, digite o nome **ZCL_##_METHODS**, onde `##` é o número do seu grupo.
   4. Ajuste a descrição e escolha *Next*.
   5. Confirme a solicitação de transporte (*transport request*) e escolha *Finish*.

### Tarefa 2: Definir Métodos

Na sua classe local **lcl_connection**, defina os métodos de instância **get_output** e **set_attributes**.

#### Passos

1. Navegue até a definição da classe local **lcl_connection**.
   1. Na classe global, selecione a aba *Local Types*.
2. Adicione um método **get_output** na seção pública da classe. Ele deve ter um parâmetro de retorno **r_output** do tipo de tabela global **STRING_TABLE**.
   > [!NOTE] Nota
   > Lembre-se de envolver o nome do parâmetro de retorno com `VALUE( )`.
   1. Ajuste o código da seguinte forma:
      ```abap
      PUBLIC SECTION.
        DATA carrier_id    TYPE /dmo/carrier_id.
        DATA connection_id TYPE /DMO/Connection_id.
        CLASS-DATA conn_counter TYPE i.
        METHODS get_output
          RETURNING
            VALUE(r_output) TYPE string_table.
      PROTECTED SECTION.
      ```
      > [!NOTE] Nota
      > Por enquanto, ignore o erro de sintaxe *Implementation missing for method "GET_OUTPUT"*.
3. Adicione um método **set_attributes** na seção pública da classe. Ele deve ter um parâmetro de importação para cada atributo de instância da classe. Use os mesmos tipos para os parâmetros usados para tipar os atributos. Para distinguir os parâmetros dos atributos, adicione o prefixo **i_** aos nomes dos parâmetros. Além disso, o método deve disparar a exceção **CX_ABAP_INVALID_VALUE**.
   1. Ajuste o código da seguinte forma:
      ```abap
      PUBLIC SECTION.
        DATA carrier_id    TYPE /dmo/carrier_id.
        DATA connection_id TYPE /DMO/Connection_id.
        CLASS-DATA conn_counter TYPE i.
        METHODS set_attributes
          IMPORTING
            i_carrier_id    TYPE /dmo/carrier_id
            i_connection_id TYPE /dmo/connection_id
          RAISING
            cx_abap_invalid_value.
        METHODS get_output
          RETURNING
            VALUE(r_output) TYPE string_table.
      PROTECTED SECTION.
      ```
      > [!NOTE] Nota
      > Por enquanto, ignore o erro de sintaxe *Implementation missing for method "SET_ATTRIBUTES"*.

### Tarefa 3: Implementar Métodos

#### Passos

1. Use um Quick Fix para adicionar as implementações dos métodos à classe.
   1. Posicione o cursor sobre o nome de um dos métodos no editor e pressione **Ctrl + 1**.
   2. Dê um duplo clique na sugestão *Add 2 unimplemented methods*.
2. Implemente o método **get_output**. Adicione alguns templates de string ao parâmetro de retorno **r_output**. Nos templates de string, use expressões incorporadas para adicionar os valores dos atributos **carrier_id** e **connection_id**.
   1. Na classe local, adicione o seguinte código entre as instruções `METHOD get_output.` e `ENDMETHOD.`:
      ```abap
      APPEND |------------------------------| TO r_output.
      APPEND |Carrier:     { carrier_id    }| TO r_output.
      APPEND |Connection:  { connection_id }| TO r_output.
      ```
3. Implemente o método **set_attributes**. Se qualquer um dos dois parâmetros de importação estiver vazio (`IS INITIAL`), dispare a exceção **CX_ABAP_INVALID_VALUE**. Caso contrário, preencha os dois atributos de instância com os valores dos parâmetros de importação.
   1. Ajuste o código da seguinte forma:
      ```abap
      METHOD set_attributes.
        IF i_carrier_id IS INITIAL OR i_connection_id IS INITIAL.
          RAISE EXCEPTION TYPE cx_abap_invalid_value.
        ENDIF.
        carrier_id    = i_carrier_id. 
        connection_id = i_connection_id.
      ENDMETHOD.
      ```
4. Ative sua classe.
   1. Pressione **Ctrl + F3** para ativar a classe.

### Tarefa 4: Chamar um Método Funcional

No método **main** da sua classe global, chame o método funcional **get_output**.

#### Passos

1. Alterne para a implementação do método **if_oo_adt_classrun~main** na classe global.
   1. Na classe global, selecione a aba principal (*Global Class*) e role até a implementação do método **if_oo_adt_classrun~main**.
2. No final do método, adicione um loop sobre a tabela interna **connections** usando a variável de referência **connection** como work area.
   1. Adicione o seguinte código antes de `ENDMETHOD.`:
      ```abap
      LOOP AT connections INTO connection.
      ENDLOOP.
      ```
3. No loop, chame o método funcional **get_output** para cada instância por vez e escreva o resultado no console.
   > [!TIP] Dica
   > Você pode usar a chamada do método **get_output** diretamente como entrada para **out->write( )**.
   1. Ajuste o código da seguinte forma:
      ```abap
      LOOP AT connections INTO connection.
        out->write( connection->get_output( ) ).
      ENDLOOP.
      ```
4. Ative a classe. Execute-a como aplicativo de console e analise a saída no console.
   1. Pressione **Ctrl + F3** para ativar a classe.
   2. Pressione **F9** para executar a classe.
   3. Analise a saída na janela *Console*.

### Tarefa 5: Usar Preenchimento Automático de Código e Tratar Exceções

Use o code completion para chamar o método **set_attributes** e trate a exceção disparada pelo método.

#### Passos

1. Para a primeira instância da classe **lcl_connection**, substitua o acesso direto aos atributos **carrier_id** e **connection_id** por uma chamada do método de instância **set_attributes( )**. Use o preenchimento automático para inserir a assinatura completa do método.
   > [!TIP] Dica
   > Pressione **Ctrl + Space** após digitar o seletor de componente (`->`) para exibir a lista de atributos e métodos disponíveis. Escolha o método e pressione **Shift + Enter** para inserir a assinatura completa do método.
   1. Posicione o cursor na linha seguinte após o primeiro `connection = NEW #( ).`.
   2. Digite `connection->` e pressione **Ctrl + Space**.
   3. Escolha *set_attributes* e pressione **Shift + Enter**.
   4. Passe os valores para os parâmetros de importação. Use os mesmos literais utilizados anteriormente para definir os atributos dessa instância.
   5. Remova ou comente o acesso direto aos atributos dessa instância.
2. Trate a exceção. Envolva a chamada do método com `TRY.` e `ENDTRY.`. Adicione um bloco `CATCH` para tratar a exceção **CX_ABAP_INVALID_VALUE**. Certifique-se de que a nova instância só seja adicionada à tabela interna **connections** se a chamada do método for bem-sucedida.
   1. Descomente a linha gerada `CATCH cx_abap_invalid_value.`.
   2. Adicione `TRY.` antes da chamada do método.
   3. Adicione `ENDTRY.` após a instrução `CATCH`.
   4. Entre a instrução `CATCH` e a instrução `ENDTRY`, adicione `out->write( `Method call failed` ).`.
   5. Mova a instrução `APPEND` para cima, entre a chamada do método e a instrução `CATCH`.
   6. A chamada de método completa deve agora ficar assim:
      ```abap
      TRY.
          connection->set_attributes(
            EXPORTING
              i_carrier_id    = 'LH'
              i_connection_id = '0400'
          ).
      *   connection->carrier_id    = 'LH'.
      *   connection->connection_id = '0400'. 
          APPEND connection TO connections.
        CATCH cx_abap_invalid_value.
          out->write( `Method call failed` ).
      ENDTRY.
      ```
3. Repita o passo anterior para as outras duas instâncias da classe **lcl_connection**.
   1. Após este passo, a implementação do método **if_oo_adt_classrun~main** deverá ser semelhante a:
      ```abap
      METHOD if_oo_adt_classrun~main.
        DATA connection TYPE REF TO lcl_connection.
        DATA connections TYPE TABLE OF REF TO lcl_connection.

      * First Instance
      **********************************************************************
        connection = NEW #(  ).
        TRY.
            connection->set_attributes(
              EXPORTING
                i_carrier_id    = 'LH'
                i_connection_id = '0400'
            ).
      *     connection->carrier_id    = 'LH'.
      *     connection->connection_id = '0400'.
            APPEND connection TO connections.
          CATCH cx_abap_invalid_value.
            out->write( `Method call failed` ).
        ENDTRY.

      * Second instance
      **********************************************************************
        connection = NEW #(  ).
        TRY.
            connection->set_attributes(
              EXPORTING
                i_carrier_id    = 'AA'
                i_connection_id = '0017'
            ).
      *     connection->carrier_id    = 'AA'.
      *     connection->connection_id = '0017'.
            APPEND connection TO connections.
          CATCH cx_abap_invalid_value.
            out->write( `Method call failed` ).
        ENDTRY.

      * Third instance
      **********************************************************************
        connection = NEW #(  ).
        TRY.
            connection->set_attributes(
              EXPORTING
                i_carrier_id    = 'SQ'
                i_connection_id = '0001'
            ).
      *     connection->carrier_id    = 'SQ'.
      *     connection->connection_id = '0001'.
            APPEND connection TO connections.
          CATCH cx_abap_invalid_value.
            out->write( `Method call failed` ).
        ENDTRY.

      * Output
      **********************************************************************
        LOOP AT connections INTO connection.
          out->write( connection->get_output( ) ).
        ENDLOOP.
      ENDMETHOD.
      ```
4. Ative a classe. Execute-a e depure as chamadas de método.
   1. Pressione **Ctrl + F3** para ativar a classe.
   2. Pressione **F9** para executar a classe.
