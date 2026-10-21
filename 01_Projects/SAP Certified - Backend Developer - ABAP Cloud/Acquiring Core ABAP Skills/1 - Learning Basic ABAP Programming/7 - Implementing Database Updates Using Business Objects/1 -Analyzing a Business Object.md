---
title: "Analisando um Objeto de Negócio (Business Object)"
source: "https://learning.sap.com/courses/basic-abap-programming/analyzing-a-business-object_e13b47d7-3cba-4cb4-a1f0-158b19ecf3b4"
author:
published:
created: 2026-10-21
description: "Após concluir esta lição, você será capaz de: Analisar um objeto de negócio."
tags:
  - "clippings"
---

## Objetivo

Após concluir esta lição, você será capaz de analisar um objeto de negócio (*Business Object*).

## Objetos de Negócio (Business Objects)

No **ABAP RESTful Application Programming Model (RAP)**, um objeto de negócio (*Business Object* - BO) define uma entidade específica do mundo real, como uma agência de viagens. Sua definição é composta por duas partes principais:
1. Uma ou mais **CDS Views**, que definem a estrutura de dados do objeto (isto é, os campos que ele contém).
2. Uma **Definição de Comportamento** (*Behavior Definition* - BDEF), que descreve quais operações e regras podem ser executadas com o objeto de negócio.

![[21_Analyzing_BO_001.png]]

A **Definição de Comportamento** (*Behavior Definition*) especifica quais operações padrão (`create`, `update`, `delete`) são permitidas. Ela também pode conter definições de:
- **Validações (*Validations*):** Verificam se os dados inseridos estão corretos no momento da criação ou alteração de um registro.
- **Determinações (*Determinations*):** Modificam instâncias do objeto de negócio automaticamente com base em condições de disparo (*trigger conditions*).
- **Ações (*Actions*):** Operações não padronizadas utilizadas para implementar comportamentos de lógica de negócio personalizados (por exemplo, aprovar um pedido de compras ou cancelar um voo).

A **Implementação de Comportamento** (*Behavior Implementation* - BIL) é composta por uma ou mais classes ABAP, onde as validações, determinações e ações são codificadas. Em relação às operações padrão, o modelo distingue dois cenários de implementação:
- **Managed (Gerenciado):** O próprio runtime do RAP cuida da execução das operações padrão (`create`, `update`, `delete`), gravando diretamente no banco de dados sem necessidade de código manual.
- **Unmanaged (Não Gerenciado):** O desenvolvedor é responsável por implementar manualmente a lógica de persistência das operações padrão na classe de implementação.

Objetos de negócio são comumente utilizados para fornecer a lógica transacional para aplicativos SAP Fiori Elements ou Web APIs. No entanto, você também pode acessá-los diretamente via código ABAP utilizando a **Entity Manipulation Language (EML)** — um conjunto integrado de instruções ABAP que permite criar, ler, atualizar e excluir dados através de Business Objects.

> [!NOTE] Nota
> A EML também é utilizada para acessar dados da aplicação dentro da própria classe de implementação de comportamento do objeto de negócio.

![[21_Analyzing_BO_002.png]]

Nesta unidade, você analisará uma classe e um objeto de negócio que manipula dados de agências de viagens. A entidade de visão CDS contém o campo-chave `AgencyID` e diversos outros campos com informações cadastrais da agência.

---

### Definição e Implementação de Comportamento

![[21_Analyzing_BO_003.png]]

O comportamento de um Business Object possui duas partes bem distintas:
- **Behavior Definition (BDEF):** Contém os metadados e declarações do que o objeto pode fazer.
- **Behavior Implementation (BIL):** Contém o código-fonte ABAP real que o sistema executa.

A implementação de comportamento é uma classe ABAP declarada na definição de comportamento através da instrução:
`managed implementation in class <classe> unique;`

O código real da implementação fica contido em classes locais dentro da aba *Local Types* da classe global especificada.

![[21_Analyzing_BO_004.png]]

A definição de comportamento descreve quais operações padrão são permitidas (`create`, `update`, `delete`) e define as validações executadas na manipulação dos dados.

No exemplo da agência de viagens, a definição de comportamento referencia a CDS View e estabelece um alias para ela. Esse alias é fundamental, pois é por meio dele que a entidade é referenciada nas instruções EML.

A BDEF também vincula a entidade CDS às tabelas de banco de dados onde os dados são persistidos: uma tabela para **dados ativos** e outra para **rascunhos (*drafts*)** (dados incompletos ainda não confirmados). Ela também define configurações para bloqueio de concorrência (*locking*), verificações de autorização e controle de concorrência (*ETag*).

![[21_Analyzing_BO_005.png]]

A classe global da implementação de comportamento (conhecida como **Behavior Pool**) é apenas uma definição de classe vazia com a adição especial `FOR BEHAVIOR OF <nome_da_bdef>`. 

A implementação real reside nas classes locais dentro da aba **Local Types**. Ela contém o código específico do Business Object (como métodos para validações, determinações e ações). No cenário *managed*, as operações padrão não exigem código manual, pois o runtime gerencia a persistência automaticamente.

![[21_Analyzing_BO_006.png]]

Uma **validação** é uma verificação disparada automaticamente pelo runtime:
- No exemplo, a validação é disparada sempre que um novo registro é criado (`trigger create;`).
- Ao alterar um registro existente, a validação é executada apenas se o campo `Name` tiver sido modificado (`trigger field Name;`).

Para cada validação declarada na BDEF, existe um método correspondente na classe de implementação de comportamento.

---

## Como Analisar um Objeto de Negócio

Demonstração: [Iniciar Demonstração](https://learnsap.enable-now.cloud.sap/pub/mmcp/index.html?show=project!PR_6DC14C585665F186:demo)

---

## Projeções e Interfaces de BO (BO Projections e BO Interfaces)

![[02BOProjectionsAndInterfaces_001.png]]

No ABAP RESTful Application Programming Model, existem duas formas principais de consumir um Business Object:
1. Por meio de um **Business Service** (por exemplo, um serviço OData UI para uma aplicação SAP Fiori).
2. A partir de código ABAP, utilizando a **Entity Manipulation Language (EML)**.

Embora tecnicamente possível, **um Business Object não deve ser consumido diretamente**. Em vez disso, os consumidores devem acessar **BO Projections** ou **BO Interfaces**:

- **BO Projection (Projeção de BO):** Business Services devem sempre definir uma projeção específica para o serviço. A projeção de BO especifica qual subconjunto de dados e operações do objeto de negócio estará disponível para aquele serviço específico.
- **BO Interface (Interface de BO):** Uma Interface de Business Object fornece um contrato de acesso estável aos dados e operações do objeto de negócio. Interfaces de BO são tipicamente liberadas para consumo por outros componentes de software. Se existir uma BO Interface para um determinado Business Object, o código ABAP com EML deve sempre consumi-la em vez de acessar o objeto base diretamente.

![[02BOProjectionsAndInterfaces_002.png]]

Assim como um Business Object básico, uma BO Projection e uma BO Interface são formadas por duas partes: uma ou mais entidades de CDS View e uma Behavior Definition:

- Definições de comportamento para projeções iniciam com a palavra-chave **`projection`**.
- Definições de comportamento para interfaces iniciam com a palavra-chave **`interface`**.

As CDS Views de projeções e interfaces são sempre **CDS Projection Views**, caracterizadas pela adição `as projection on` (ao invés de `as select from`). Nas versões modernas, a finalidade é indicada pela adição `provider contract`:
- `provider contract transactional_interface`: para Interfaces de BO.
- `provider contract transactional_query`: para Projeções de BO.

---

## Exercício Prático: Analisar um Objeto de Negócio

Neste exercício, você analisará a interface de objeto de negócio `/DMO/I_AgencyTP` para conhecer sua estrutura e as operações de manipulação de dados que ela oferece.

### Tarefa 1: Analisar o Comportamento da Interface

Analise a definição de comportamento da interface de objeto de negócio **/DMO/I_AGENCYTP**.

#### Passos

1. Abra a definição de comportamento **/DMO/I_AGENCYTP** no editor do ADT.
2. Analise o código-fonte e abra a ajuda da linguagem ABAP para obter mais detalhes sobre as instruções.

---

### Tarefa 2: Analisar a Estrutura de Dados

Analise a CDS view entity que define a estrutura de dados da interface do objeto de negócio. Navegue pela fonte de dados até alcançar a CDS view entity raiz que não seja uma projeção.

#### Passos

1. Navegue até a CDS view entity **/DMO/I_AgencyTP** e analise o código-fonte:
   1. Localize a instrução `define behavior for /DMO/I_AgencyTP`.
   2. Pressione a tecla **Ctrl** e clique com o botão esquerdo em `/DMO/I_AgencyTP` (ou posicione o cursor sobre o nome e pressione **F3**).
2. Navegue até a fonte de dados da entidade `/DMO/I_AgencyTP`:
   1. Localize o trecho de código `as projection on /DMO/R_AgencyTP`.
   2. Pressione a tecla **Ctrl** e clique com o botão esquerdo em `/DMO/R_AgencyTP` (ou posicione o cursor sobre o nome e pressione **F3**).

---

### Tarefa 3: Analisar o Comportamento do Objeto de Negócio

Analise a definição de comportamento do objeto de negócio **/DMO/R_AGENCYTP**, localizado sob a interface `/DMO/I_AGENCYTP`.

#### Passos

1. Abra a definição de comportamento **/DMO/R_AGENCYTP** no editor.
2. Analise o código-fonte e verifique as operações permitidas, tabelas mapeadas e validações definidas.

---

### Tarefa 4: Analisar a Implementação de Comportamento

Analise a implementação de comportamento do objeto de negócio **/DMO/R_AGENCYTP**.

#### Passos

1. Navegue até a classe ABAP **/DMO/BP_R_AGENCYTP** que contém a implementação de comportamento:
   1. Na definição de comportamento, localize a instrução `managed implementation in class /dmo/bp_r_agencytp unique;`.
   2. Segure **Ctrl** e clique em `/dmo/bp_r_agencytp` (ou pressione **F3**).
2. Acesse a classe local **lhc_agency** e analise sua definição:
   1. Abra a aba **Local Types** da classe global (ou expanda o nó raiz `/DMO/BP_R_AGENCYTP` na visão *Outline* e selecione `LHC_AGENCY`).
   2. Analise a declaração dos métodos de validação e implementação de regras de negócio.
