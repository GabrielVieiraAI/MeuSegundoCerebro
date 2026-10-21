---
title: "Declarando uma Tabela Interna Complexa"
source: "https://learning.sap.com/courses/basic-abap-programming/declaring-a-complex-internal-table_e2463cb1-7806-46c5-8367-cff38681721f"
author:
published:
created: 2026-10-21
description: "Após concluir esta lição, você será capaz de: Declarar uma tabela interna complexa."
tags:
  - "clippings"
---

## Objetivo

Após concluir esta lição, você será capaz de declarar uma tabela interna complexa.

## Propriedades de Tabelas Internas Complexas

![[01-PropertiesOfComplexITABs_001.png]]

As tabelas internas que utilizamos até agora possuíam um tipo de dados escalar como tipo de linha. No exemplo da imagem, o tipo de linha da tabela interna `numbers` é o tipo predefinido ABAP `I` (inteiro).

Denominamos essas tabelas de **tabelas internas simples**.

![[01-PropertiesOfComplexITABs_002.png]]

Dizemos que se trata de uma **tabela interna complexa** quando o tipo de linha é um tipo de dados estruturado (*structured row type*).

Enquanto uma tabela interna simples possui apenas uma coluna sem nome, uma tabela interna complexa é composta por várias colunas, cada uma com o nome e o tipo do componente correspondente da estrutura de linha. No exemplo, o tipo de linha da tabela interna `connections` é um tipo estruturado com cinco componentes: `carrier_id`, `connection_id`, `airport_from_id`, `airport_to_id` e `carrier_name`. Consequentemente, a tabela interna `connections` possui cinco colunas com esses mesmos nomes.

> [!NOTE] Nota
> As colunas nos exemplos apresentados possuem tipos escalares. De forma mais ampla, uma coluna de uma tabela interna também pode ser do tipo estruturado ou até mesmo possuir um tipo de tabela. Neste último caso, falamos de uma **tabela interna aninhada** (*nested internal table*).

---

### Acesso por Índice vs. Acesso por Chave

![[01-PropertiesOfComplexITABs_003.png]]

Até agora, acessamos as linhas de uma tabela interna por sua posição numérica. Isso é chamado de **acesso por índice** (*index access*).

Com as colunas nomeadas de uma tabela interna complexa, o **acesso por chave** (*key access*) torna-se fundamental. O acesso por chave consiste em localizar uma linha da tabela interna buscando valores específicos em determinadas colunas. As colunas pesquisadas podem ser quaisquer colunas da tabela interna.

O acesso por índice a uma tabela interna é sempre extremamente rápido, mesmo que a tabela contenha milhares de linhas. O acesso por chave, por outro lado, pode se tornar lento se a tabela contiver muitos registros. Escolher o tipo de acesso correto para a tabela interna melhora significativamente a performance de acessos por chave.

---

### Tipos de Acesso de Tabelas Internas (Access Types)

<iframe 
    src="https://cdnapisec.kaltura.com/p/1921661/embedPlaykitJs/uiconf_id/50355372?iframeembed=true&entry_id=1_nsynvqn4" 
    width="100%" 
    height="400" 
    allowfullscreen 
    frameborder="0">
</iframe>

![[01-PropertiesOfComplexITABs_004.png]]

Toda tabela interna possui um dos três tipos de acesso. O tipo de acesso determina como os dados são organizados e armazenados na tabela e, com base nisso, como o sistema realiza a leitura para recuperar os dados:

#### Standard Table (Tabela Padrão)
Em uma tabela padrão, os registros não são armazenados em uma ordem de classificação específica. Por padrão, novas linhas são anexadas ao final da tabela. Para recuperar dados por chave, o sistema precisa realizar uma varredura sequencial (linear), o que pode resultar em tempos de busca elevados caso a tabela seja muito grande. As tabelas internas simples que usamos anteriormente eram tabelas padrão.

#### Sorted Table (Tabela Ordenada)
Em uma tabela ordenada, o conteúdo é mantido sempre classificado pelos campos-chave em ordem crescente. Ao inserir um novo registro, o sistema garante que ele seja alocado na posição correta. Como os dados estão sempre ordenados, o sistema realiza buscas binárias, recuperando registros de forma muito mais eficiente do que em uma tabela padrão.

#### Hashed Table (Tabela Hash)
Tabelas hash são gerenciadas internamente por um algoritmo de hash. Isso garante que o sistema consiga localizar registros em tempo constante $O(1)$, de forma extremamente rápida, mesmo que a tabela possua milhões de linhas. No entanto, esse ganho de desempenho funciona apenas ao fornecer todos os campos da chave na pesquisa.

---

### Chaves e Unicidade (Uniqueness)

![[01-PropertiesOfComplexITABs_005.png]]

Toda tabela interna possui uma chave. Em tabelas padrão, a chave não desempenha um papel determinante no armazenamento. Para tabelas ordenadas e hash, a chave é fundamental, pois define como os dados serão gerenciados. Tabelas ordenadas e hash só oferecem ganho de performance em buscas que utilizem os campos-chave definidos.

Outro atributo da chave de uma tabela é a sua **unicidade**:

- **Duplicatas são sempre permitidas** em tabelas padrão (`NON-UNIQUE KEY`).
- **Duplicatas nunca são permitidas** em tabelas hash (`UNIQUE KEY`).
- Em tabelas ordenadas, você **escolhe na definição** se a chave será única (`UNIQUE KEY`) ou não única (`NON-UNIQUE KEY`).

> [!NOTE] Nota
> Tabelas internas também podem ter chaves secundárias (*secondary keys*), que permitem otimizar buscas por outras combinações de colunas sem alterar a chave primária da tabela.

---

## Tipos de Tabela Complexos

<iframe 
    src="https://cdnapisec.kaltura.com/p/1921661/embedPlaykitJs/uiconf_id/50355372?iframeembed=true&entry_id=1_6upcy1qj" 
    width="100%" 
    height="400" 
    allowfullscreen 
    frameborder="0">
</iframe>

![[02-ComplexTableTypes_002.png]]

Uma boa prática de programação é definir o tipo de dados primeiro e, em seguida, declarar a variável referenciando o tipo.

Em vez de especificar o tipo de acesso e a chave diretamente na instrução `DATA`, você deve preferencialmente utilizar um tipo de tabela nomeado. Se o tipo de tabela for necessário apenas localmente em um método ou classe, defina-o com a instrução `TYPES`.

O exemplo define primeiro o tipo estruturado `st_connection`. Em seguida, com esse tipo estruturado como tipo de linha, define o tipo de tabela `tt_connections`. Por fim, a declaração da tabela interna `connections_5` faz referência direta ao tipo de tabela criado:

```abap
TYPES tt_connections TYPE SORTED TABLE OF st_connection
                          WITH UNIQUE KEY carrier_id
                                          connection_id.

DATA connections_5 TYPE tt_connections.
```

### Tipos de Tabela Globais

Se você precisar do tipo de tabela de forma global no sistema, pode utilizar um **tipo de tabela global** (*global table type*).

Um tipo de tabela global é um objeto de repositório que pode ser utilizado em qualquer parte do sistema. O ADT fornece um editor dedicado para esse tipo de desenvolvimento.

---

## Faça Você Mesmo: Tipos de Tabela Complexos

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

   * Example 1 : Simple and Complex Internal Table
   **********************************************************************
   " Tabela simples (tipo de linha escalar)
   DATA numbers TYPE TABLE OF i.

   " Tabela complexa (tipo de linha estruturado)
   DATA connections TYPE TABLE OF st_connection.

   out->write( `--------------------------------------------` ).
   out->write( `Example 1: Simple and Complex Internal Table` ).
   out->write( data = numbers
               name = `Simple Table NUMBERS:` ).
   out->write( data = connections
               name = `Complex Table CONNECTIONS:` ).

   * Example 2 : Complex Internal Tables
   **********************************************************************
   " Tabela padrão com chave padrão não-única (forma curta)
   DATA connections_1 TYPE TABLE OF st_connection.

   " Tabela padrão com chave padrão não-única (forma explícita)
   DATA connections_2 TYPE STANDARD TABLE OF st_connection
                           WITH NON-UNIQUE DEFAULT KEY.

   " Tabela ordenada com chave explícita não-única
   DATA connections_3 TYPE SORTED TABLE OF st_connection
                            WITH NON-UNIQUE KEY airport_from_id
                                                airport_to_id.

   " Tabela hash com chave explícita única
   DATA connections_4 TYPE HASHED TABLE OF st_connection
                            WITH UNIQUE KEY carrier_id
                                            connection_id.

   * Example 3 : Local Table Type
   **********************************************************************
   TYPES tt_connections TYPE SORTED TABLE OF st_connection
                             WITH UNIQUE KEY carrier_id
                                             connection_id.

   DATA connections_5 TYPE tt_connections.

   * Example 4 : Global Table Type
   **********************************************************************
   DATA flights TYPE /dmo/t_flight.

   out->write( `------------------------------------------` ).
   out->write( `Example 4: Global Table Type /DMO/T_FLIGHT` ).
   out->write( data = flights
               name = `Internal Table FLIGHTS:` ).
   ```
3. Pressione **Ctrl + F3** para ativar a classe e **F9** para executá-la como console app.
4. Analise a saída no console. Depure o programa e faça testes com o código-fonte para se familiarizar com os conceitos.
