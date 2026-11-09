---
title: "Usando Encapsulamento para Garantir a Consistência"
source: "https://learning.sap.com/courses/basic-abap-programming/using-encapsulation-to-ensure-consistency_e3780ce0-2ba3-4d03-a09f-15ac109b0c03"
author:
published:
created: 2026-10-21
description: "Após concluir esta lição, você será capaz de: Explicar o encapsulamento. Definir e usar construtores."
tags:
  - "clippings"
---
## Objetivos

Após concluir esta lição, você será capaz de:

- Explicar o encapsulamento.
- Definir e usar construtores.

## Encapsulamento de Dados

![[01_-_Explain_encapsulation_001.png]]

Na programação orientada a objetos, um objeto corresponde a um objeto da vida real, como um funcionário, um veículo ou, no nosso caso, uma conexão de voo. Ele possui atributos que o descrevem; no caso de uma conexão de voo, são o ID da companhia aérea (*carrier ID*) e o número do voo (*flight number*).

Agora vamos considerar o que acontece quando um programa que está usando esse objeto deseja fornecer valores para esses atributos. É óbvio que apenas as combinações de ID da companhia aérea e número do voo que correspondem a uma conexão de voo no mundo real devem ser aceitas.

Na [[Orientação a Objetos no ABAP|orientação a objetos]], o programa cliente não deve ser capaz de alterar os valores dos atributos diretamente. Em vez disso, ele deve precisar chamar um método para realizar essa tarefa. O método, que faz parte do objeto, pode então verificar se a combinação de ID da companhia aérea e número do voo é válida e, caso não seja, rejeitar a alteração.

Como desenvolvedores da classe `lcl_connection`, podemos garantir o uso do método `set_attributes( )` tornando os atributos `carrier_id` e `connection_id` privados (*private*), ou pelo menos somente leitura (*read-only*).

Esse conceito é chamado de **encapsulamento de dados** (*data encapsulation*): as informações sobre a conexão de voo são gerenciadas pelo próprio objeto de conexão e não podem ser manipuladas por mais ninguém. Isso garante que a verificação de consistência não possa ser burlada — seja de forma intencional ou acidental. Essa é uma das principais vantagens da orientação a objetos.

Na programação orientada a objetos, recomenda-se usar o encapsulamento de dados o máximo possível!

![[01_-_Explain_encapsulation_002.png]]

Com os atributos públicos que definimos até agora, era possível ler e alterar os valores dos atributos em qualquer lugar dentro e fora da classe.

Para restringir o acesso aos atributos, você tem duas opções:

1. Manter a instrução `DATA` ou `CLASS-DATA` na seção pública (*public section*) e adicionar o complemento `READ-ONLY`. Ao fazer isso, o acesso de gravação (*write access*) ao atributo fica proibido fora da classe, mas o acesso de leitura (*read access*) continua sendo possível.
   > [!NOTE] Nota
   > O complemento `READ-ONLY` só é permitido na seção pública de uma classe.

2. Mover a instrução `DATA` ou `CLASS-DATA` da seção pública para uma das outras seções de visibilidade, por exemplo, a seção privada (*private section*). Ao fazer isso, tanto o acesso de leitura quanto o acesso de gravação ao atributo ficam proibidos fora da classe.
   > [!TIP] Dica
   > O ADT oferece um Quick Fix para alterar a visibilidade de um atributo. Para usá-lo, posicione o cursor no nome do atributo, pressione **Ctrl + 1** e escolha **Make \<attribute> private**.

## Como Usar Atributos Privados

Demonstração: [Iniciar Demonstração](https://learnsap.enable-now.cloud.sap/pub/mmcp/index.html?library=library.txt&show=project!PR_2EF94ED3881D7EAE:demo)

## Construtor de Instância

![[02-_Use_Constructors_001.png]]

Ao tornar seus atributos privados — ou pelo menos somente leitura —, você pode garantir que o programa cliente use o método disponível `set_attributes( )` para definir os valores dos atributos `carrier_id` e `connection_id`.

Mas ainda há potencial para inconsistências:

- Você não pode forçar o programa a chamar `set_attributes( )` para cada nova instância. Como resultado, podem existir instâncias com valores iniciais (vazios) para `carrier_id` e `connection_id`.
- O programa cliente pode chamar `set_attributes( )` várias vezes para a mesma instância. Isso também não deveria ser possível.

O que você precisa é de uma técnica para exigir valores não iniciais durante a instanciação e impedir alterações posteriores.

Para resolver esses problemas, as linguagens de programação orientadas a objetos usam **métodos construtores** (*constructor methods*).

![[02-_Use_Constructors_002.png]]

O sistema de tempo de execução (*runtime system*) chama o construtor automaticamente quando você cria uma nova instância da classe, mas você não pode chamá-lo explicitamente. Assim, é garantido que o construtor seja executado uma única vez para cada instância criada.

Do ponto de vista de sintaxe, um método construtor possui as seguintes propriedades:

- É um método de instância público com o nome reservado `constructor`.
- Pode ter parâmetros de importação (*importing parameters*), por exemplo, para obter valores iniciais para os atributos da nova instância.
- Pode disparar exceções (*raise exceptions*).

> [!NOTE] Nota
> No ABAP, não é possível definir mais de um método construtor na mesma classe.

> [!TIP] Dica
> No ADT, você pode usar um Quick Fix para gerar um método construtor. Para usar este Quick Fix, proceda da seguinte forma:
> 1. Na parte de definição ou de implementação, posicione o cursor no nome da classe e pressione **Ctrl + 1**.
> 2. Na lista de Quick Fixes disponíveis, escolha **Generate constructor**.
> 3. Na janela de diálogo exibida, selecione os atributos que deseja inicializar com o construtor e escolha **Finish**.

Depois de gerar o construtor, você pode ajustar sua definição e implementação conforme suas necessidades.

![[02-_Use_Constructors_003.png]]

O exemplo mostra o construtor da classe `lcl_connection`. A definição gerada contém um parâmetro de importação para cada um dos atributos `carrier_id` e `connection_id`.

A parte gerada da implementação contém uma atribuição de valor para cada um dos atributos com o respectivo parâmetro de importação à direita.

![[02-_Use_Constructors_005.png]]

O exemplo mostra algumas adições manuais ao construtor gerado da classe `lcl_connection`.

Para rejeitar a criação de instâncias com valores iniciais, uma verificação de consistência foi adicionada à implementação e uma cláusula `RAISING` foi adicionada à definição do construtor.

Como o construtor é executado uma única vez para cada nova instância da classe `lcl_connection`, a implementação do construtor é o lugar perfeito para incrementar o atributo estático `conn_counter`.

![[02-_Use_Constructors_006.png]]

Quando você instancia uma classe que possui um construtor, o sistema chama o método construtor automaticamente. Se o construtor tiver parâmetros de importação, você os passa na expressão `NEW` exatamente como passaria parâmetros para um método normal.

> [!NOTE] Nota
> Um construtor pode ter apenas parâmetros de importação. A palavra-chave `EXPORTING` não é necessária nem permitida na expressão `NEW`.

Se o construtor possuir exceções, você deve garantir que irá capturá-las envolvendo a instanciação em um bloco `TRY… CATCH... ENDTRY`. Se um construtor disparar uma exceção, o controle retorna imediatamente ao programa que contém a expressão `NEW`. Nesse caso, você não recebe uma nova instância da classe.

## Como Definir um Construtor de Instância

Demonstração: [Iniciar Demonstração](https://learnsap.enable-now.cloud.sap/pub/mmcp/index.html?library=library.txt&show=project!PR_AA201DE9A603868E:demo)

## Construtor Estático

![[02-_Use_Constructors_007.png]]

Enquanto o construtor de instância é chamado uma vez sempre que cada instância de uma classe é criada, às vezes você precisará executar ações uma única vez para a classe inteira. Para essa finalidade, o ABAP permite definir um **construtor estático** (*static constructor*), também conhecido como **construtor de classe** (*class constructor*).

O sistema de tempo de execução chama o construtor estático uma única vez quando a classe é referenciada pela primeira vez durante a execução de um programa.

O primeiro acesso a uma classe pode ocorrer por um dos seguintes motivos:

- Primeira instanciação da classe
- Primeira chamada de um método estático
- Primeiro acesso a um atributo estático público

> [!NOTE] Nota
> Esta lista não é exaustiva. Existem outras ações (relacionadas à herança) que podem fazer com que uma classe seja referenciada pela primeira vez.

Um caso de uso típico para o construtor estático é a inicialização dinâmica de atributos estáticos com valores não iniciais. Portanto, é importante que o tempo de execução chame o construtor estático antes de criar a instância, chamar o método estático ou acessar o atributo estático.

Do ponto de vista de sintaxe, um método construtor estático possui as seguintes propriedades:

- É um método estático público com o nome reservado `class_constructor`.
- Não possui parâmetros nem exceções.

> [!NOTE] Nota
> Um construtor estático não pode ter assinatura porque é impossível prever exatamente em que momento a classe será referenciada pela primeira vez.

> [!TIP] Dica
> No ADT, você pode usar um Quick Fix para gerar um método construtor de classe. Para usar este Quick Fix, proceda da seguinte forma:
> 1. Na parte de definição ou de implementação, posicione o cursor no nome da classe e pressione **Ctrl + 1**.
> 2. Na lista de Quick Fixes disponíveis, escolha **Generate class constructor**.

## Como Depurar a Execução de Construtores

Demonstração: [Iniciar Demonstração](https://learnsap.enable-now.cloud.sap/pub/mmcp/index.html?library=library.txt&show=project!PR_5189FB6B111ACAAE:demo)

## Usar Atributos Privados e um Construtor

Neste exercício, você tornará o atributo estático da sua classe somente leitura (*read-only*) e os atributos de instância privados (*private*). Você usará um construtor para definir seus valores.

#### Template:

- `/LRN/CL_S4D400_CLS_METHODS` (Classe Global)

#### Solução:

- `/LRN/CL_S4D400_CLS_CONSTRUCTOR` (Classe Global)

### Tarefa 1: Copiar Template (Opcional)

Copie a classe de template. Se você concluiu o exercício anterior, pode pular esta tarefa e continuar editando sua classe (**ZCL_##_METHODS**, **ZCL_##_LOCAL_CLASS** ou **ZCL_##_INSTANCES**).

#### Passos

1. Copie a classe **/LRN/CL_S4D400_CLS_METHODS** para uma classe em seu próprio pacote (nome sugerido: **ZCL_##_CONSTRUCTOR**, onde `##` representa o número do seu grupo).
   1. Abra o código-fonte da classe global **/LRN/CL_S4D400_CLS_METHODS**.
   2. Vincule a view *Project Explorer* ao editor.
   3. Na view *Project Explorer*, clique com o botão direito na classe **/LRN/CL_S4D400_CLS_METHODS** para abrir o menu de contexto.
   4. No menu de contexto, escolha *Duplicate...*.
   5. Insira o nome do seu pacote no campo *Package*. No campo *Name*, insira o nome **ZCL_##_CONSTRUCTOR**, onde `##` representa o número do seu grupo.
   6. Ajuste a descrição e escolha *Next*.
   7. Confirme a request de transporte e escolha *Finish*.

### Tarefa 2: Tornar os Atributos Privados

Altere a visibilidade dos atributos **carrier_id** e **connection_id** para exigir o uso dos métodos **set_attributes( )** e **get_output( )**.

#### Passos

1. Defina a visibilidade do atributo **carrier_id** como privada usando um Quick Fix.
   1. Mude para a aba *Local Types*.
   2. Vá para a declaração do atributo **carrier_id** na classe local **lcl_connection**.
   3. Posicione o cursor em **carrier_id** e pressione **Ctrl + 1**.
   4. Clique duas vezes na sugestão *Make carrier_id private*.
   5. Verifique se a declaração do atributo **carrier_id** foi movida para a seção privada (*private section*).
2. Defina a visibilidade do atributo **connection_id** como privada usando um Quick Fix.
   1. Vá para a declaração do atributo **connection_id** na classe local **lcl_connection**.
   2. Posicione o cursor em **connection_id** e pressione **Ctrl + 1**.
   3. Clique duas vezes na sugestão *Make connection_id private*.
   4. Verifique se a declaração do atributo **connection_id** foi movida para a seção privada (*private section*).

### Tarefa 3: Criar Construtor de Instância

Substitua o método público **set_attributes** por um construtor de instância para garantir que os atributos sejam definidos durante a criação de uma nova instância e que não sejam alterados posteriormente.

#### Passos

1. Comente a definição e a implementação do método **set_attributes**.
   1. Selecione todas as linhas que pertencem à instrução `METHODS set_attributes`, incluindo a linha com o ponto final (`.`).
   2. Pressione **Ctrl + <** para adicionar um asterisco (`*`) na frente de cada linha selecionada.
   3. Selecione todas as linhas que pertencem à implementação do método **set_attributes**, incluindo a instrução `ENDMETHOD.` correspondente, e pressione **Ctrl + <** novamente.
2. Adicione um construtor de instância à classe local **lcl_connection** usando um Quick Fix. Certifique-se de que o construtor possua parâmetros de importação correspondentes aos atributos **carrier_id** e **connection_id**.
   1. Posicione o cursor no nome da classe e pressione **Ctrl + 1**.
   2. Clique duas vezes em *Generate constructor*.
   3. Na caixa de diálogo, certifique-se de que **carrier_id** e **connection_id** estejam selecionados e escolha *Finish*.
3. Estenda a definição do construtor gerado. Adicione a exceção **CX_ABAP_INVALID_VALUE** à definição do método **constructor**.
   1. Navegue até a definição gerada do método **constructor**.
   2. Ajuste o código da seguinte forma:
      ```abap
      METHODS constructor
        IMPORTING
          i_connection_id TYPE /dmo/connection_id
          i_carrier_id    TYPE /dmo/carrier_id
        RAISING
          cx_abap_invalid_value.
      ```
4. Estenda a implementação do construtor gerado. Se qualquer um dos parâmetros de importação estiver inicial (vazio), dispare a exceção **CX_ABAP_INVALID_VALUE**.
   1. Navegue da definição para a implementação do método **constructor**, por exemplo, posicionando o cursor em **constructor** e pressionando **F3**.
   2. Ajuste o código da seguinte forma:
      ```abap
      METHOD constructor.

        IF i_carrier_id IS INITIAL OR i_connection_id IS INITIAL.
          RAISE EXCEPTION TYPE cx_abap_invalid_value.
        ENDIF.
        me->connection_id = i_connection_id.
        me->carrier_id    = i_carrier_id.
      ENDMETHOD.
      ```
5. Na implementação do construtor, adicione uma instrução para incrementar o valor do atributo estático **conn_counter** em um. Certifique-se de que a instrução só seja executada se nenhuma exceção for disparada.
   1. Ajuste o código da seguinte forma:
      ```abap
        me->connection_id = i_connection_id.
        me->carrier_id    = i_carrier_id.

        conn_counter = conn_counter + 1.
      ENDMETHOD.
      ```
6. Certifique-se de que não seja possível alterar o valor de **conn_counter** de fora da classe.
   1. Adicione `READ-ONLY` à declaração do atributo estático **conn_counter**.
   2. Ajuste o código da seguinte forma:
      ```abap
      CLASS-DATA conn_counter TYPE i READ-ONLY.
      ```

### Tarefa 4: Usar o Construtor

Ajuste a instanciação da classe **lcl_connection** para fornecer os parâmetros do construtor de instância e tratar a exceção.

#### Passos

1. No método **if_oo_adt_classrun~main**, vá até a expressão `NEW #( )` para a primeira instância de **lcl_connection**.
   1. Mude para a aba *Global Class*.
   2. Encontre a primeira linha com `connection = NEW #( ).`.
2. Na expressão `NEW`, forneça os parâmetros de importação de **constructor**.
   > [!TIP] Dica
   > Você pode copiar a passagem de parâmetros da chamada do método **set_attributes** para esta instância.
   1. Ajuste a expressão `NEW` da seguinte forma:
      ```abap
      connection = NEW #(
                          i_carrier_id    = 'LH'
                          i_connection_id = '0400'
                        ).
      ```
3. Remova ou comente todas as chamadas do método **set_attributes**.
   1. Selecione todas as linhas que pertencem à instrução `connection->set_attributes( ... ).`, incluindo a linha com o parêntese de fechamento e o ponto final (`.`).
   2. Pressione **Ctrl + <** para adicionar um asterisco (`*`) na frente de cada linha selecionada.
4. Mova a criação da instância para dentro do bloco `TRY` do tratamento de exceções.
   1. Mova a instrução `TRY.` para cima, antes da criação da instância.
   2. A criação da sua primeira instância agora deve ficar assim:
      ```abap
      TRY.
          connection = NEW #(
                              i_carrier_id    = 'LH'
                              i_connection_id = '0400'
                            ).

      *   connection->set_attributes(
      *     EXPORTING
      *       i_carrier_id    = 'LH'
      *       i_connection_id = '0400'
      *   ).
          APPEND connection TO connections.
        CATCH cx_abap_invalid_value.
          out->write( `Method call failed` ).
      ENDTRY.
      ```
5. Repita os passos anteriores para as outras instâncias da sua classe local.
   1. Após este passo, a implementação do método **if_oo_adt_classrun~main** deverá ser semelhante a:
      ```abap
      METHOD if_oo_adt_classrun~main.
        DATA connection TYPE REF TO lcl_connection.
        DATA connections TYPE TABLE OF REF TO lcl_connection.

      * First Instance
      **********************************************************************
        TRY.
            connection = NEW #(
                                i_carrier_id    = 'LH'
                                i_connection_id = '0400'
                              ).

      *     connection->set_attributes(
      *       EXPORTING
      *         i_carrier_id    = 'LH'
      *         i_connection_id = '0400'
      *     ).
            APPEND connection TO connections.
          CATCH cx_abap_invalid_value.
            out->write( `Method call failed` ).
        ENDTRY.

      * Second instance
      **********************************************************************
        TRY.
            connection = NEW #(
                                i_carrier_id    = 'AA'
                                i_connection_id = '0017'
                              ).
            APPEND connection TO connections.
          CATCH cx_abap_invalid_value.
            out->write( `Method call failed` ).
        ENDTRY.

      * Third instance
      **********************************************************************
        TRY.
            connection = NEW #(
                                i_carrier_id    = 'SQ'
                                i_connection_id = '0001'
                              ).
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
6. Ative a classe. Execute-a e depure a instanciação.
   1. Pressione **Ctrl + F3** para ativar a classe.
   2. Pressione **F9** para executar a classe.
