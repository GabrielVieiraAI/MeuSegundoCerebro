---
aliases: ["Core Data Services", "ABAP CDS Views", "CDS View"]
tags: [sap, abap, cds, fiori, odata]
type: "concept"
status: "draft"
summary: "Tecnologia de modelagem de dados do SAP que cria views reutilizáveis sobre o banco, com associações, anotações e Code Pushdown."
---
# CDS - Core Data Services

**Relacionado:** [[Como construir um app FIORI com RAP]], [[Roteiro de Estudos SAP]]
## 1. Introdução

**CDS** significa **Core Data Services**.

CDS View é uma tecnologia de modelagem de dados do SAP que permite criar uma visão estruturada dos dados a partir de tabelas do banco. Com ela podemos combinar informações de várias tabelas, realizar cálculos, definir relacionamentos e disponibilizar esses dados para programas ABAP, aplicações Fiori e serviços OData, aproveitando o processamento direto no banco de dados.

Principais características:

✅ Cria views com sintaxe SQL moderna (Open SQL)
✅ Definir relacionamentos entre entidades (associations)
✅ Adicionar metadados através de annotations
✅ Otimizar performance com pushdown para base de dados
✅ Integração nativa com Fiori e OData

### Sintaxe Moderna CDS View Entity

```abap
@AccessControl.authorizationCheck: #NOT_REQUIRED
@EndUserText.label: 'Customer View'
define view entity ZI_Customer
  as select from kna1
{
  key kunnr as CustomerId,
      name1 as CustomerName,
      land1 as Country,
      ort01 as City,
      @Semantics.amount.currencyCode: 'Currency'
      ktokd as AccountGroup
}
```

- Como uma CDS lê dados?
- Como fazer JOIN?
- Como funciona uma Association?
- Como uma CDS consome outra CDS?
- Como criar uma View Entity?

## 2. Anotações

Anotações são metadados escritos com `@` no início da linha. Elas informam ao framework como a CDS deve ser tratada ou consumida.

Exemplos de uso:

- Definir a descrição da CDS.
- Informar o nome da SQL View correspondente no dicionário ABAP.
- Definir textos exibidos na interface.
- Configurar comportamento analítico e elementos para gráficos.
- Expor a CDS como um serviço OData.

Exemplo de anotação para a SQL View clássica:

```abap
@AbapCatalog.sqlViewName: 'ZV_FLIGHT'
```

O nome informado deve seguir as regras de nomenclatura do dicionário ABAP. A SQL View é gerada e atualizada automaticamente quando a CDS é ativada.

## 3. Associações

Uma associação representa um relacionamento entre a entidade principal e uma entidade relacionada. Por exemplo, uma CDS de ordens de venda pode associar dados do cliente.

```abap
association [0..1] to scustom as _Customer
    on $projection.CustomerId = _Customer.id
```

Ao contrário de um `JOIN`, a associação pode deixar o acesso aos dados relacionados para o momento em que o consumidor solicitar esse relacionamento. Isso ajuda a evitar a leitura de dados que não serão utilizados, embora o comportamento final dependa da forma como a associação é consumida e da consulta gerada.

## 4. Tipos de views no SAP

| Tipo          | Camada              | Banco suportado                     | Ferramentas principais                      |
| ------------- | ------------------- | ----------------------------------- | ------------------------------------------- |
| View clássica | Banco de dados      | Praticamente todos                  | SAP GUI, por exemplo SE11                   |
| SAP HANA view | Banco de dados      | SAP HANA                            | SAP HANA Studio ou Eclipse com plugins HANA |
| HANA CDS View | Banco de dados      | SAP HANA                            | SAP HANA Studio ou Eclipse com plugins HANA |
| ABAP CDS View | Camada de aplicação | Todos os bancos suportados pelo SAP | Eclipse com ADT                             |

### View clássica

É uma view nativa do banco de dados, normalmente baseada em um `SELECT` salvo com um nome. No SAP, pode ser criada e administrada no dicionário ABAP, por exemplo, pela transação `SE11`.

### HANA view

É específica do banco SAP HANA. Atualmente, a **Calculation View** é o tipo mais abrangente, pois cobre muitos cenários antes atendidos por Attribute Views e Analytical Views.

### ABAP CDS View

É a opção mais utilizada no desenvolvimento ABAP moderno. Sua definição fica na camada de aplicação, por isso sua sintaxe não depende diretamente do banco de dados.

## 5. Code Pushdown

**Code Pushdown** é a estratégia de mover para o banco de dados o processamento que pode ser executado de forma eficiente nele.

Em uma abordagem tradicional, o programa ABAP pode ler muitos registros, percorrer tabelas internas e realizar cálculos na aplicação. Com CDS, parte desse trabalho pode ser feita no banco por meio de:

- `JOIN`s e associações;
- filtros;
- agregações;
- concatenações;
- expressões matemáticas;
- expressões `CASE`;
- campos calculados.

O programa ABAP recebe um resultado mais pronto, reduzindo a transferência de dados pela rede, a complexidade do código e a carga no servidor de aplicação.

> Code Pushdown não significa mover todo o código para o banco. Somente a lógica adequada e suportada pela CDS deve ser transferida.

## 6. Criando uma ABAP CDS View simples

### Pré-requisitos

1. Ter o Eclipse instalado e configurado.
2. Ter o plugin ADT instalado.
3. Possuir acesso a um sistema ABAP.
4. Ter um pacote e uma request de transporte, ou utilizar o pacote local `$TMP` para testes.

### Passos no Eclipse

1. Abra o pacote no Project Explorer.
2. Clique com o botão direito no pacote e selecione **New > Core Data Services > Data Definition**.
3. Informe o nome da definição, por exemplo `ZDD_FLIGHT`.
4. Informe a descrição e a request.
5. Escolha o template **Define View**.
6. Informe a tabela de origem e os campos que serão expostos.
7. Salve e ative a definição.

Exemplo baseado na tabela de voos `SFLIGHT`:

```abap
@AbapCatalog.sqlViewName: 'ZV_FLIGHT'
@EndUserText.label: 'Lista de voos'
define view ZDD_FLIGHT
    as select from sflight
{
    key mandt,
    key carrid,
    key connid,
    key fldate,
            price,
            currency
}
```

### Campos-chave

Um campo é definido como chave pela palavra-chave `key`. É possível utilizar como referência as chaves da tabela de origem, mas a escolha deve refletir a unicidade lógica dos registros retornados pela CDS.

## 7. Como consumir a CDS

### Eclipse

Com a CDS aberta, use a opção de visualização dos dados, normalmente acessível pelo atalho `F8` ou pelo menu de contexto **Open With Data Preview**. A ferramenta mostra os registros e as colunas expostas.

### SAP GUI

O SAP GUI não consulta diretamente o nome da definição CDS. Para visualizar os dados na transação `SE16` ou `SE16N`, use o nome da SQL View gerada, neste exemplo `ZV_FLIGHT`.

Essa SQL View também pode ser visualizada no dicionário ABAP, mas sua definição deve ser editada no Eclipse com ADT.

### Programa ABAP

O consumo mais simples é feito com um `SELECT` sobre a entidade CDS ou sobre a SQL View, conforme a versão do ABAP e o tipo de definição utilizado:

```abap
SELECT carrid,
       connid,
       fldate,
       price,
       currency
  FROM zdd_flight
  INTO TABLE @DATA(flights).
```

O resultado pode ser processado em uma tabela interna ou exibido por um ALV. Também existem classes e ferramentas que permitem abrir uma visualização dos dados da CDS com opções como tela cheia e ALV.

## 8. Aplicando filtros com `WHERE`

O filtro é escrito na própria definição da CDS:

```abap
define view ZDD_FLIGHT
    as select from sflight
{
    key mandt,
    key carrid,
    key connid,
    key fldate,
            price,
            currency
}
where carrid = 'AA'
```

É possível combinar condições com `and` e `or`. O filtro deve ser colocado de acordo com a regra de negócio e, quando fizer sentido, pode ser substituído por um parâmetro para evitar valores fixos.

### Parâmetros

Parâmetros permitem que o consumidor informe valores durante a execução. Eles são úteis quando o filtro precisa ser dinâmico.

```abap
define view ZDD_FLIGHT
    with parameters p_carrier : s_carr_id
    as select from sflight
{
    key carrid,
    key connid,
    key fldate,
            price
}
where carrid = $parameters.p_carrier
```

## 9. Classificações das CDS

Uma CDS pode ser classificada de duas formas diferentes: pela **finalidade dentro do modelo de dados** e pela **forma técnica como foi implementada**. Essas classificações não são excludentes. Por exemplo, uma CDS pode ser uma CDS de consumo implementada como uma CDS View Entity de projeção.

### 9.1 Classificação por finalidade

Essa classificação indica o papel da CDS na arquitetura da solução, normalmente seguindo o conceito de **VDM (Virtual Data Model)**, ou Modelo de Dados Virtual.

#### CDS de interface

A CDS de interface é uma camada reutilizável que representa dados e regras de negócio de forma genérica. Ela esconde a complexidade das tabelas de origem e serve como base para diferentes consumidores.

Características:

- Combina tabelas ou outras CDS Views;
- Define campos, chaves e associações de negócio;
- Padroniza os dados para reutilização;
- Deve evitar detalhes específicos de uma única tela ou relatório;
- Pode ser utilizada por várias CDS de consumo, relatórios ou serviços.

Sua pergunta principal é:

> Como os dados de negócio devem ser estruturados para serem reutilizados?

Normalmente, utiliza-se o prefixo `ZI_` para indicar uma CDS de interface.

#### CDS de composição

A CDS de composição combina outras CDS de interface para formar um modelo de negócio mais completo. Ela é útil quando o cenário precisa reunir dados de diferentes áreas ou entidades relacionadas.

Por exemplo, uma CDS de composição pode combinar dados de cabeçalho, itens, cliente e status de um documento de venda. Ela ainda é uma camada de modelagem, e não necessariamente a tela final do usuário.

#### CDS de consumo

A CDS de consumo adapta os dados para uma necessidade específica, como uma aplicação Fiori, um relatório, um serviço OData ou uma transação.

Características:

- Seleciona somente os campos necessários;
- Pode aplicar filtros e organizar os dados para o cenário;
- Pode conter anotações de UI, OData ou analytics;
- É direcionada a um consumidor específico;
- Normalmente depende de uma CDS de interface ou de composição.

Sua pergunta principal é:

> Como esta aplicação, relatório ou serviço precisa consumir os dados?

Normalmente, utiliza-se o prefixo `ZC_` para indicar uma CDS de consumo.

Fluxo comum da classificação por finalidade:

```text
Tabelas
     |
     v
CDS de interface (ZI_)
     |
     v
CDS de composição (quando necessário)
     |
     v
CDS de consumo (ZC_)
     |
     v
Aplicação, relatório ou serviço
```

### 9.2 Classificação por implementação técnica

Essa classificação indica qual recurso da linguagem ou da plataforma foi utilizado para construir a CDS.

#### CDS View clássica

É criada com `define view` e normalmente utiliza a anotação `@AbapCatalog.sqlViewName` para gerar uma SQL View correspondente no dicionário ABAP.

```abap
@AbapCatalog.sqlViewName: 'ZV_FLIGHT'
define view ZI_FLIGHT
    as select from sflight
{
    key carrid,
    key connid,
    key fldate
}
```

Esse modelo é comum em versões mais antigas do SAP. A SQL View pode ser consultada no dicionário ABAP, mas a definição deve ser editada no Eclipse com ADT.

#### CDS View Entity

É criada com `define view entity` e representa o modelo moderno recomendado pela SAP. Diferentemente da CDS View clássica, não precisa gerar uma SQL View clássica por meio de `@AbapCatalog.sqlViewName`.

```abap
define view entity ZI_FLIGHT
    as select from sflight
{
    key carrid,
    key connid,
    key fldate
}
```

#### CDS de projeção

É criada sobre outra CDS e expõe somente os elementos necessários para um cenário. É muito usada como CDS de consumo, pois permite limitar a interface pública sem duplicar a lógica da CDS de origem.

```abap
define view entity ZC_FLIGHT
    as projection on ZI_FLIGHT
{
    key carrid,
    key connid,
    key fldate
}
```

#### CDS abstrata

Define uma estrutura de dados sem depender diretamente de uma tabela de banco como fonte. Pode ser usada em cenários que precisam descrever parâmetros ou estruturas para ações e operações de negócio.

```abap
define abstract entity ZABS_FLIGHT
{
    carrid : s_carr_id;
    connid : s_conn_id;
}
```

#### CDS Table Function

É uma função de tabela cuja implementação é feita em uma classe AMDP. Deve ser utilizada quando a lógica necessária não pode ser expressa adequadamente com a sintaxe normal de CDS.

É um recurso mais avançado, normalmente associado a cenários específicos do SAP HANA e ao Code Pushdown.

#### Extensão de CDS

Uma extensão permite adicionar campos ou associações a uma CDS existente sem modificar diretamente sua definição original. É útil quando a CDS foi criada por outro componente ou quando a customização deve ficar separada.

```abap
extend view entity ZI_FLIGHT with
{
    association [0..1] to scarr as _Company
        on $projection.carrid = _Company.carrid
}
```

Além desses tipos, uma CDS pode utilizar recursos como parâmetros, associações, agregações e expressões calculadas. Esses recursos descrevem capacidades da CDS, mas não necessariamente representam classificações independentes.

### 9.3 Diferença entre as duas classificações

| Classificação     | O que explica             | Exemplos                                              |
| ----------------- | ------------------------- | ----------------------------------------------------- |
| Por finalidade    | O papel da CDS na solução | Interface, composição e consumo                       |
| Por implementação | Como a CDS foi construída | View clássica, View Entity, projeção e Table Function |

Portanto, `ZI_` e `ZC_` representam principalmente uma convenção arquitetural. Já `define view`, `define view entity` e `as projection on` indicam a implementação técnica utilizada.

## 10. Limitações mencionadas

Em uma CDS View básica, alguns recursos não ficam disponíveis da mesma forma que em um `SELECT` ABAP:

- `ORDER BY` normalmente deve ser aplicado pelo consumidor.
- `LIMIT` não é usado como regra geral na definição básica.
- `OFFSET` não é usado como regra geral na definição básica.

Assim, a ordenação, a paginação e a limitação da quantidade de registros podem precisar ser implementadas no programa, serviço ou ferramenta que consome a CDS. Sempre confirme as possibilidades da versão do ABAP e do tipo específico de CDS utilizado.

## 11. Resumo

ABAP CDS Views são um recurso de modelagem de dados que combina uma definição reutilizável, metadados por anotações, filtros, associações e integração com o desenvolvimento ABAP. Elas apoiam o Code Pushdown, diminuindo o volume de dados transferido para a aplicação e simplificando programas que antes precisariam executar muitos loops e cálculos manualmente.

Fluxo básico:

1. Criar a Data Definition no Eclipse com ADT.
2. Informar a fonte de dados e os campos.
3. Definir chaves, filtros, parâmetros e associações quando necessário.
4. Salvar e ativar.
5. Testar no Eclipse, na `SE16`/`SE16N` ou em um programa ABAP.