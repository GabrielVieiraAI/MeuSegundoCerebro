---
title: "Declarando um Objeto de Dados Estruturado"
source: "https://learning.sap.com/courses/basic-abap-programming/declaring-a-structured-data-object_cd245e79-eb25-4099-a5b4-9ad46b1659b6"
author:
published:
created: 2026-10-21
description: "Após concluir esta lição, você será capaz de: Declarar um objeto de dados estruturado."
tags:
  - "clippings"
---

## Objetivo

Após concluir esta lição, você será capaz de declarar um objeto de dados estruturado.

## Objetos de Dados Estruturados

![[01-StructuredDataObjects_001.png]]

Até agora, você utilizou variáveis simples, cada uma capaz de armazenar uma única informação. No exemplo acima, por exemplo, há duas variáveis: uma para o aeroporto de partida e outra para o aeroporto de chegada.

Ao ler um registro do banco de dados, você precisa manter todas essas informações agrupadas. As duas variáveis do exemplo são completamente independentes entre si e, portanto, não são ideais para armazenar dados distintos que pertencem ao mesmo contexto.

No ABAP, a solução para esse cenário é utilizar uma variável estruturada — ou simplesmente uma **estrutura** (*structure*).

![[01-StructuredDataObjects_002.png]]

Uma estrutura é um objeto de dados ABAP variável, com um nome próprio e um tipo estruturado.

No exemplo, o objeto de dados `connection_full` é uma estrutura. Ela é subdividida em oito componentes, cada qual possuindo seu próprio nome e tipo. Você pode manipular tanto a estrutura como um todo quanto seus componentes individuais. É importante destacar que cada componente pode ser utilizado exatamente da mesma forma que uma variável simples independente.

Existem diversas formas de declarar uma estrutura:
- Definir tipos estruturados locais com a instrução `TYPES`.
- Utilizar um objeto de repositório global do tipo *Structure*.
- Utilizar definições de visões (como CDS Views) ou de tabelas de banco de dados como tipos estruturados. O exemplo utiliza a CDS View `/DMO/I_Connection` como tipo estruturado.

![[01-StructuredDataObjects_003.png]]

Na perspectiva de **Debugger**, existem duas formas de analisar a estrutura e o conteúdo de uma variável estruturada:

- **Pré-visualização da Variável (Mouse-Over):** Posicione o cursor sobre o nome da variável no editor de código-fonte. Após um instante, uma janela se abrirá com detalhes sobre a estrutura e o conteúdo do objeto de dados.
- **Exibição na Visão Variables (Duplo-clique):** Para exibir a variável na aba *Variables*, insira o nome da variável no campo *\<Enter variable>* ou dê um duplo clique sobre o nome da variável no editor de código. Em seguida, expanda o nó da estrutura para visualizar a lista de seus componentes.

## Como Analisar Objetos de Dados Estruturados Usando a Perspectiva de Debug

Demonstração: [Iniciar Demonstração](https://learnsap.enable-now.cloud.sap/pub/mmcp/index.html?library=library.txt&show=project!PR_3A36CFBA3590F685:demo)

---

## Tipos de Dados Estruturados

![[02-StructuredDataTypes_005.png]]

Um tipo de estrutura global é um objeto de repositório que pode ser utilizado como tipo de dados em qualquer parte do sistema. No exemplo, o tipo estruturado global `SYMSG` é utilizado para declarar a variável `message`.

- Ao pressionar **F2** sobre o tipo, são exibidos os detalhes do tipo de dados: você pode verificar que se trata de uma estrutura com sete componentes, incluindo nomes, tipos técnicos e descrições.
- Ao pressionar **F3**, o ADT navega até a definição do tipo, abrindo o editor dedicado para tipos estruturados globais.

A definição de uma estrutura global é muito semelhante à de uma tabela de banco de dados: consiste em uma instrução `DEFINE STRUCTURE` com o nome da estrutura, seguida pela lista de componentes entre chaves `{ }`, cada um acompanhado de seu respectivo tipo. 

Os tipos de componentes frequentemente são elementos de dados (*data elements*), mas também é possível utilizar outros tipos estruturados como componentes. Estruturas que contêm componentes estruturados são denominadas **estruturas aninhadas** (*Nested Structures*). Linhas adicionais de código antes da instrução `DEFINE STRUCTURE` definem propriedades complementares, como rótulos descritivos (*labels*).

![[02-StructuredDataTypes_006.png]]

Você também pode definir tipos estruturados em um programa ABAP utilizando a instrução `TYPES`. A definição começa com a instrução `TYPES BEGIN OF <nome_do_tipo>` e termina com `TYPES END OF <nome_do_tipo>`. Entre elas, cada componente é declarado e tipado por uma instrução `TYPES` adicional.

Uma forma compacta utiliza a instrução encadeada (*chain statement*): a palavra-chave `TYPES` aparece uma única vez seguida de dois-pontos (`:`), e as cláusulas `BEGIN OF`, `END OF` e as declarações de componentes são separadas por vírgulas.

> [!NOTE] Nota
> No passado, instruções encadeadas (*chain statements*) eram amplamente utilizadas no ABAP. Atualmente, seu uso é recomendado apenas para agrupar comandos que possuam forte ligação conceitual entre si.

![[02-StructuredDataTypes_007.png]]

Neste exemplo, uma instrução encadeada `TYPES:` é utilizada para definir o tipo estruturado local `st_connection`, composto por três componentes: `airport_from_id`, `airport_to_id` e `carrier_name`. Cada componente é tipado com um elemento de dados iniciado por `/dmo/`.

O tipo estruturado local `st_connection` é então utilizado em uma instrução `DATA` para tipar a variável estruturada `connection`.

![[02-StructuredDataTypes_008.png]]

Neste exemplo, a variável `connection` possui um tipo estruturado aninhado. O tipo `st_nested` define quatro componentes: três são tipados com elementos de dados (componentes simples), enquanto o componente `message` é tipado com uma estrutura (`symsg`). Por conter um componente estruturado, a variável `connection` torna-se uma estrutura aninhada (*nested structure*).

![[02-StructuredDataTypes_009.png]]

O ABAP suporta não apenas variáveis estruturadas, mas também **constantes estruturadas**. Para definir uma constante estruturada, utilizam-se as adições `BEGIN OF` e `END OF` dentro de uma instrução `CONSTANTS`. O exemplo apresenta uma constante estruturada definida na seção pública da classe global `CL_ABAP_BEHV`, onde todos os cinco componentes são tipados com o elemento de dados `SECKEYNAME`. Lembre-se de que a adição `VALUE` é obrigatória ao definir constantes.

---

## Faça Você Mesmo: Tipos de Dados Estruturados

1. Como no primeiro exercício deste curso, crie uma nova classe global que implemente a interface `IF_OO_ADT_CLASSRUN`.
2. Copie o seguinte trecho de código para a parte de implementação do método `if_oo_adt_classrun~main( )`:
   ```abap
   * Example 1 : Motivation for Structured Variables
   **********************************************************************

   DATA connection_full TYPE /dmo/i_connection.

   SELECT SINGLE
     FROM /dmo/i_connection
     FIELDS AirlineID, ConnectionID, DepartureAirport, DestinationAirport,
            DepartureTime, ArrivalTime, Distance, DistanceUnit
    WHERE AirlineId    = 'LH'
      AND ConnectionId = '0400'
     INTO @connection_full.

   out->write(  `--------------------------------------` ).
   out->write(  `Example 1: CDS View as Structured Type` ).
   out->write( connection_full ).

   * Example 2: Global Structured Type
   **********************************************************************

   DATA message TYPE symsg.

   out->write(  `---------------------------------` ).
   out->write(  `Example 2: Global Structured Type` ).
   out->write( message ).

   * Example 3 : Local Structured Type
   **********************************************************************

   TYPES: BEGIN OF st_connection,
            airport_from_id TYPE /dmo/airport_from_id,
            airport_to_id   TYPE /dmo/airport_to_id,
            carrier_name    TYPE /dmo/carrier_name,
          END OF st_connection.

   DATA connection TYPE st_connection.

   SELECT SINGLE
     FROM /dmo/i_connection
     FIELDS DepartureAirport, DestinationAirport, \_Airline-Name
    WHERE AirlineID    = 'LH'
      AND ConnectionID = '0400'
     INTO @connection.

   out->write(  `---------------------------------------` ).
   out->write(  `Example 3: Local Structured Type` ).
   out->write( connection ).

   * Example 4 : Nested Structured Type
   **********************************************************************

   TYPES: BEGIN OF st_nested,
            airport_from_id TYPE /dmo/airport_from_id,
            airport_to_id   TYPE /dmo/airport_to_id,
            message         TYPE symsg,
            carrier_name    TYPE /dmo/carrier_name,
          END OF st_nested.

   DATA connection_nested TYPE st_nested.

   out->write(  `---------------------------------` ).
   out->write(  `Example 4: Nested Structured Type` ).
   out->write( connection_nested ).
   ```
3. Pressione **Ctrl + F3** para ativar a classe e **F9** para executar como aplicativo de console.
4. Analise a saída no console. Depure o programa e faça testes com o código-fonte para se familiarizar com os conceitos.
