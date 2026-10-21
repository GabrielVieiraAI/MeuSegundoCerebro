---
title: "Trabalhando com CDS Views"
source: "https://learning.sap.com/courses/basic-abap-programming/working-with-cds-view_c289f74d-675e-4084-9d90-5635958ec604"
author:
published:
created: 2026-10-21
description: "Após concluir esta lição, você será capaz de: Analisar a definição de uma CDS view. Ler dados utilizando uma CDS view."
tags:
  - "clippings"
---

## Objetivos

Após concluir esta lição, você será capaz de:

- Analisar a definição de uma CDS view.
- Ler dados utilizando uma CDS view.

## CDS Views

### Definições de Views no ABAP Core Data Services (ABAP CDS)

O ABAP Core Data Services, ou abreviadamente ABAP CDS, é uma infraestrutura para definir e consumir modelos de dados semanticamente ricos no ABAP. Ele utiliza uma CDS DDL (Data Definition Language) para definir entidades CDS que implementam um modelo de dados semântico. As entidades de modelagem mais importantes no CDS são as **CDS View Entities** (entidades de visão CDS).

![[14_-_Analyze_CDS_001.png]]

A definição de uma CDS View contém lógica SQL reutilizável; desde uma simples projeção de campos de uma tabela até construções sofisticadas com cálculos, agregações, junções (*joins*), uniões (*unions*) e muito mais.

Uma definição de CDS View pode conter **associações** (*associations*) para refletir os relacionamentos do modelo de dados. Os consumidores da visão podem utilizar essas associações para navegar e recuperar dados relacionados.

Por fim, as **anotações** (*annotations*) são utilizadas para enriquecer semanticamente a definição da visão. Esses metadados são avaliados por frameworks que operam sobre as definições de CDS Views, como o ABAP RESTful Application Programming Model (RAP), sobre o qual veremos exemplos mais adiante neste curso.

---

### Estrutura de uma Definição de CDS View

![[14_-_Analyze_CDS_002.png]]

As definições de CDS Views são mantidas em objetos de repositório do tipo **Data Definition**. Vejamos o código-fonte da definição de dados `/DMO/I_CONNECTION`:

- A parte principal é a instrução `DEFINE VIEW ENTITY`. Ela contém o nome da entidade de visão CDS e, após a palavra-chave `FROM`, a fonte de dados. Em nosso exemplo, o nome da entidade de visão é `/DMO/I_Connection` e a fonte de dados é a tabela de banco de dados `/dmo/connection`. A adição opcional `AS` define um alias (`Connection`) para referenciar a fonte de dados dentro da definição da visão.

> [!NOTE] Nota
> A fonte de dados de uma CDS View entity também pode ser outra CDS View.

- Um par de chaves `{ }` envolve a lista de elementos da visão. Em nosso exemplo, os elementos são campos da tabela de banco de dados `/dmo/connection`. A palavra-chave `KEY` antes dos dois primeiros elementos os define como campos-chave da CDS View entity. A adição opcional `AS` define um alias para cada elemento da visão.

---

### Associações em CDS Views

![[14_-_Analyze_CDS_003.png]]

A adição `association` define um relacionamento com outra entidade de CDS View. Em nosso exemplo, a visão relacionada é a CDS view entity `/DMO/I_Carrier` e o nome da associação é `_Airline`.

Essa associação fica disponível para os consumidores da visão ao ser adicionada à lista de elementos. Esse processo é chamado de **expor a associação** (*exposing the association*).

---

### Anotações em CDS Views

![[14_-_Analyze_CDS_004.png]]

As anotações começam com o caractere arroba (`@`) e são utilizadas para enriquecer semanticamente a definição da visão para seus consumidores:

- **Anotações de Entidade (*Entity Annotations*):** Localizadas antes da definição da visão (`DEFINE VIEW ENTITY`). Definem metadados para a visão como um todo.
- **Anotações de Elemento (*Element Annotations*):** Localizadas dentro do bloco de chaves `{ }`. Definem metadados específicos para os diferentes elementos da visão.

---

### Data Preview para CDS Views

![[14_-_Analyze_CDS_005.png]]

A ferramenta **Data Preview** também está disponível para entidades de CDS View:

1. Para abrir o *Data Preview* de uma entidade CDS, clique com o botão direito em qualquer local da definição de dados e escolha **Open With** → **Data Preview**, ou posicione o cursor na definição e pressione **F8**.
2. A ferramenta exibirá os dados retornados pela entidade CDS, com funções para ordenar, filtrar e ajustar a exibição.
3. Se a definição da visão contiver uma ou mais associações, você pode utilizá-las para exibir dados relacionados:
   1. Clique com o botão direito em uma linha do resultado.
   2. No menu de contexto, escolha **Follow Association**.
   3. Na lista de associações disponíveis, escolha a associação desejada.

---

### Localizando CDS Views: Where-Used List

![[14_-_Analyze_CDS_006.png]]

Se você deseja encontrar todas as CDS Views que utilizam uma determinada tabela de banco de dados como fonte, pode usar a ferramenta **Where-used List** do ADT:

1. Abra a definição da tabela de banco de dados.
2. Clique com o botão direito em qualquer ponto do código-fonte e escolha **Get Where-used List** no menu de contexto (ou pressione **Ctrl + Shift + G**).
3. A visão *Search* exibirá uma lista de todos os objetos de desenvolvimento que utilizam diretamente a tabela.

![[14_-_Analyze_CDS_007.png]]

Você pode aplicar filtros à lista para restringir a busca a pacotes específicos ou a tipos específicos de objetos (como filtrar exclusivamente por CDS views que utilizam a tabela).

---

## Como Analisar uma CDS View

Demonstração: [Iniciar Demonstração](https://learnsap.enable-now.cloud.sap/pub/mmcp/index.html?library=library.txt&show=project!PR_3E120CA182A03BAE:demo)

---

## CDS Views no ABAP SQL

![[15_-_Read_using_CDS_001.png]]

Ao implementar um comando `SELECT` em ABAP, você pode utilizar uma entidade de CDS View como fonte de dados em vez de ler diretamente da tabela de banco de dados. Isso traz diversas vantagens:

- **Reutilização da lógica SQL** já contida na CDS View.
- **Leitura concisa e legível** de dados relacionados por meio de associações.
- **Nomes mais amigáveis e expressivos:** os nomes das visões e dos elementos do CDS frequentemente são mais claros do que os nomes técnicos tradicionais das tabelas e colunas de banco de dados.

O comando `SELECT` do exemplo utiliza a CDS view entity `/DMO/I_Connection` como fonte de dados:

> [!NOTE] Nota
> Observe que os nomes utilizados na cláusula `FIELDS` e nas condições do `WHERE` são os nomes de alias dos elementos da visão (em formato CamelCase, como `DepartureAirport` e `AirlineID`).

O terceiro elemento na cláusula `FIELDS` faz uso da associação exposta `_Airline`. Ele lê o elemento `Name` a partir da entidade CDS associada `/DMO/I_Carrier`. Esse tipo de elemento é denominado **expressão de caminho** (*path expression*). A barra invertida (`\`) é um prefixo obrigatório para nomes de associações em expressões de caminho no ABAP SQL.

---

## Exercício Prático: Analisar e Utilizar uma Entidade de CDS View

Neste exercício, você lerá dados a partir de uma entidade de CDS View em vez de ler diretamente da tabela de banco de dados. Isso permitirá acessar de forma direta e confortável o nome da companhia aérea.

#### Modelo (Template):
- `/LRN/CL_S4D400_DBS_SELECT` (Classe global)

#### Solução (Solution):
- `/LRN/CL_S4D400_DBS_CDS` (Classe global)

---

### Tarefa 1: Copiar Modelo (Opcional)

Copie a classe modelo. Se você concluiu o exercício anterior, pode ignorar esta tarefa e continuar editando sua classe **ZCL_##_SELECT**.

#### Passos

1. Copie a classe **/LRN/CL_S4D400_DBS_SELECT** para uma classe em seu próprio pacote (nome sugerido: **ZCL_##_CDS**, onde `##` representa o número do seu grupo):
   1. Abra o código-fonte da classe global **/LRN/CL_S4D400_DBS_SELECT**.
   2. Vincule a visão *Project Explorer* ao editor (botão *Link with Editor*).
   3. No *Project Explorer*, clique com o botão direito na classe **/LRN/CL_S4D400_DBS_SELECT** e escolha **Duplicate...**.
   4. Informe o nome do seu pacote no campo *Package* e **ZCL_##_CDS** no campo *Name*.
   5. Ajuste a descrição, confirme a solicitação de transporte e clique em *Finish*.

---

### Tarefa 2: Analisar a Entidade de CDS View

Analise a definição da CDS view entity **/DMO/I_Connection**.

#### Passos

1. Abra o objeto de desenvolvimento que contém a definição da CDS view entity **/DMO/I_Connection**:
   1. Na barra de ferramentas do Eclipse, escolha *Open ABAP Development Object* ou pressione **Ctrl + Shift + A**.
   2. Digite `/DMO/I_Con` no campo de busca.
   3. Na lista de itens correspondentes, selecione `/DMO/I_CONNECTION (Data Definition)` e escolha *OK*.
2. Analise a lista de elementos da entidade CDS:
   1. Navegue até a lista separada por vírgulas entre as chaves `{ }`.
   2. Observe os nomes de alias após a palavra-chave `AS`.
3. Abra o *Element Information* (**F2**) para o destino da associação **_Airline**:
   1. Posicione o cursor sobre `/DMO/I_Carrier` antes de `as _Airline` e pressione **F2** para exibir as informações do elemento.

---

### Tarefa 3: Declarar Atributo Adicional

Estenda a classe local **lcl_connection** com o atributo de instância privado **carrier_name**. Adicione a exibição desse novo atributo na implementação do método **get_output( )**.

> [!NOTE] Nota
> O novo atributo ainda não está preenchido. Nós o alimentaremos ajustando o comando SELECT na próxima tarefa deste exercício.

#### Passos

1. Retorne à classe local **lcl_connection** na sua classe global (aba *Local Types*).
2. Adicione o seguinte atributo **privado** à definição da classe:

   | Nome do Atributo | Escopo | Tipo de Dados |
   | :--- | :--- | :--- |
   | **carrier_name** | Instância | `/DMO/CARRIER_NAME` |

   Ajuste a `PRIVATE SECTION`:
   ```abap
   PRIVATE SECTION.
     DATA carrier_id      TYPE /dmo/carrier_id.
     DATA connection_id   TYPE /dmo/connection_id.
     DATA airport_from_id TYPE /dmo/airport_from_id.
     DATA airport_to_id   TYPE /dmo/airport_to_id.
     DATA carrier_name    TYPE /dmo/carrier_name.
   ENDCLASS.
   ```
3. Estenda a implementação do método **get_output**, adicionando o nome da companhia aérea ao template de string:
   Substitua a linha:
   ```abap
   APPEND |Carrier:     { carrier_id }| TO r_output.
   ```
   pelo seguinte comando:
   ```abap
   APPEND |Carrier:     { carrier_id } { carrier_name }| TO r_output.
   ```
4. Ative a classe (**Ctrl + F3**) e execute-a (**F9**).

---

### Tarefa 4: Utilizar a Entidade de CDS View

Na implementação do método **constructor**, substitua o comando `SELECT` que lê da tabela de banco de dados `/dmo/connection` por um comando `SELECT` que lê da CDS view entity **/DMO/I_Connection**.

#### Passos

1. Na implementação do método **constructor**, comente o comando `SELECT` anterior selecionando suas linhas e pressionando **Ctrl + <**.
2. Logo após o código comentado, adicione a instrução `SELECT` lendo da CDS view `/DMO/I_Connection`:
   ```abap
   *    SELECT SINGLE
   *      FROM /dmo/connection
   *    FIELDS airport_from_id, airport_to_id
   *     WHERE carrier_id    = @i_carrier_id
   *       AND connection_id = @i_connection_id
   *      INTO ( @airport_from_id, @airport_to_id ).
   SELECT SINGLE
     FROM /DMO/I_Connection
   ```
3. Implemente a cláusula `FIELDS` lendo os elementos **DepartureAirport**, **DestinationAirport** e, utilizando a associação exposta **_Airline**, o elemento **Name** (dica: digite `\_Airline-` e use **Ctrl + Space** para selecionar `Name`):
   ```abap
     FIELDS DepartureAirport, DestinationAirport, \_Airline-Name
   ```
4. Implemente a cláusula `WHERE` restringindo os elementos-chave da CDS view entity (`AirlineID` e `ConnectionID`) com os parâmetros de importação (com prefixo `@`):
   ```abap
     WHERE AirlineID    = @i_carrier_id
       AND ConnectionID = @i_connection_id
   ```
5. Implemente a cláusula `INTO` armazenando os resultados nos atributos correspondentes da classe:
   ```abap
     INTO ( @airport_from_id, @airport_to_id, @carrier_name ).
   ```
   O comando `SELECT` completo deve ficar assim:
   ```abap
   SELECT SINGLE
     FROM /DMO/I_Connection
     FIELDS DepartureAirport, DestinationAirport, \_Airline-Name
     WHERE AirlineID    = @i_carrier_id
       AND ConnectionID = @i_connection_id
     INTO ( @airport_from_id, @airport_to_id, @carrier_name ).
   ```
6. Ative a classe (**Ctrl + F3**) e execute-a (**F9**). Verifique se o console agora exibe o nome da companhia aérea preenchido a partir da CDS view associada.
