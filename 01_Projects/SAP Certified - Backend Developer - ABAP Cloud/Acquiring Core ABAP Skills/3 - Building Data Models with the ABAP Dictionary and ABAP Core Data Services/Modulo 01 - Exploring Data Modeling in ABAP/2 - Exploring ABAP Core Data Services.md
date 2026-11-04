---
tipo: clippings
title: "Exploring ABAP Core Data Services"
source: "https://learning.sap.com/courses/building-data-models-with-the-abap-dictionary-and-abap-core-data-services/exploring-abap-core-data-services_f6b58d1f-ca51-461b-8355-aef95aa3864e"
created: 2026-11-03
tags:
  - sap
  - abap
  - abap-cloud
  - cds
  - data-modeling
  - code-pushdown
  - rap
  - annotations
  - hands-on
  - adt
---
**Roteiro de Estudos Relacionado:** [[Roteiro de Estudos SAP]]

# Objetivos de Aprendizado

Após concluir esta lição, você será capaz de:
- Descrever as tarefas fundamentais do **ABAP Core Data Services (ABAP CDS)**.
- Nomear e classificar os objetos ABAP CDS mais importantes.

---

## 1. O que é o ABAP Core Data Services (ABAP CDS)?

O **ABAP Core Data Services (ABAP CDS)** é a implementação do conceito geral de *Core Data Services* voltada para o ambiente ABAP.

<iframe 
    src="https://cdnapisec.kaltura.com/p/1921661/embedPlaykitJs/uiconf_id/50355372?iframeembed=true&entry_id=1_bgvu5fb1" 
    width="100%" 
    height="400" 
    allowfullscreen 
    frameborder="0">
</iframe>

> [!NOTE] Transcrição do Vídeo: Tarefas do ABAP CDS
> O ABAP CDS cumpre as seguintes tarefas essenciais:
> 1. **Definição de modelos de dados no banco de dados:** Objetos CDS (visões e funções de tabela), incluindo lógica SQL para transferência do processamento ao banco de dados (*Code Pushdown*), para uso no ABAP SQL.
> 2. **Fornecimento de metadados para consumidores:** Modelos de dados semanticamente enriquecidos, oferecendo suporte a tecnologias modernas de interface do usuário como **SAP Fiori**, protocolos **OData** e ferramentas de análise (*SAP S/4HANA Embedded Analytics*).
> 3. **Suporte ao ABAP RESTful Application Programming Model (RAP):** Objetos CDS especiais que definem a estrutura e o comportamento de *Business Objects*.

---

## 2. A Evolução das Visões: Do DDIC ao Code Pushdown

Por muito tempo, desenvolvedores ABAP definiram visões no ABAP Dictionary da mesma forma que definiam tabelas de banco de dados. No entanto, essas visões do dicionário eram muito limitadas em termos de lógica SQL: suportavam apenas junções internas (*Inner Joins*), seleção de campos (projeção) e condições simples de filtro. Vale destacar que a definição de visões do dicionário não é suportada em ambientes ABAP baseados em nuvem (*ABAP Cloud*).

Um dos motivos pelos quais a SAP introduziu o Core Data Services no ABAP foi a exigência de execução de lógica diretamente no banco de dados (*Code Pushdown*). As visões ABAP CDS suportam uma ampla variedade de expressões e funções SQL para empurrar a lógica de processamento para a camada de persistência.

![[01CDSFunctions_002.png]]

Existem dois tipos de visões CDS:

* **CDS DDIC-based Views (Obsoletas):** Esse tipo obsoleto de visão CDS utiliza uma visão gerada no dicionário como representação técnica para o objeto do banco de dados. As visões baseadas em DDIC são definidas com a instrução `DEFINE VIEW`.
* **CDS View Entities:** Esta nova geração de visões CDS é definida com a instrução `DEFINE VIEW ENTITY`. As *CDS View Entities* definem o objeto de banco de dados diretamente, sem gerar um objeto auxiliar no dicionário previamente.

> [!NOTE] Foco do Treinamento
> Neste treinamento, abordaremos exclusivamente as **CDS View Entities**. Para detalhes sobre os tipos legados de visões, consulte a documentação de palavras-chave do ABAP (*ABAP Keyword Documentation*).

---

## 3. Enriquecimento Semântico com Anotações (@)

O ABAP CDS não apenas suporta a definição técnica de objetos de banco de dados, mas também permite enriquecer as definições técnicas com **informações semânticas**.

![[01CDSFunctions_003.png]]

Vejamos um exemplo:
A entidade CDS `Z00_C_Employee` é definida com uma instrução `define view entity` dentro de uma *CDS Data Definition*. Essa é a definição técnica da visão, utilizada para criar uma visão com o nome `Z00_C_EMPLOYEE` no banco de dados. Além da instrução `define view entity`, o código-fonte contém **anotações (*Annotations*)**. As anotações são elementos de código que enriquecem a definição técnica da visão com informações semânticas e começam sempre com o caractere arroba (`@`).

Apenas algumas anotações são avaliadas diretamente pelo sistema ABAP. As demais são repassadas aos consumidores da entidade CDS (ou seja, os frameworks que utilizam a entidade CDS para ler dados). Os consumidores decidem por conta própria quais anotações avaliam e quais ignoram.

Os consumidores mais importantes das entidades ABAP CDS são tecnologias modernas de interface de usuário como o **SAP Fiori** e o **SAP S/4HANA Embedded Analytics**.

---

## 4. O CDS no Modelo ABAP RAP (RESTful Application Programming Model)

O coração do **ABAP RESTful Application Programming Model (RAP)** é o **Business Object (BO)**.

![[01CDSFunctions_004.png]]

* A estrutura de dados do Business Object é modelada através de uma ou mais **CDS View Entities**.
* Uma **CDS Behavior Definition** é utilizada para adicionar a lógica transacional.
* A lógica transacional é implementada em um **ABAP Behavior Pool** (uma classe ABAP especial na biblioteca de código).

Os Business Objects são frequentemente consumidos por serviços corporativos (*Business Services*), como serviços OData. Além disso, você também pode acessá-los diretamente em código ABAP utilizando a linguagem **Entity Manipulation Language (EML)**.

> [!NOTE] Nota Oficial
> Os detalhes de modelagem, implementação e utilização de Business Objects não fazem parte deste treinamento; eles são discutidos em um curso dedicado ao ABAP RESTful Application Programming Model.

---

## 5. Objetos de Desenvolvimento do ABAP CDS

Os objetos de desenvolvimento CDS mais importantes são:

![[02CDSObjects_001.png]]

### CDS Data Definition
Uma *CDS Data Definition* contém a definição de uma entidade CDS. As entidades CDS mais importantes são as **CDS View Entities** e suas predecessoras, as hoje obsoletas *DDIC-based views*. Além delas, outros tipos de entidades podem ser definidos:
- **CDS Projection Views:** Baseadas em uma visão CDS subjacente, projetando um subconjunto de seus elementos.
- **CDS Abstract Entities:** Descrevem apenas propriedades de tipagem, sem instanciar nenhum objeto físico no banco de dados.
- **CDS Table Functions:** Implementadas em funções de banco de dados (via AMDP) e retornam um conjunto de dados tabular.
- **CDS Custom Entities:** Implementadas manualmente, por exemplo, através de classes de código ABAP.
- **CDS Hierarchies:** Definem hierarquias SQL nativas a partir de uma fonte SQL.

### CDS Access Control
Contém a definição de uma **CDS Role**. Quando entidades SQL CDS atribuídas a uma role CDS são acessadas, condições adicionais de acesso e filtros em nível de linha (*Row-Level Security*) são avaliados por padrão.

### CDS Metadata Extension
Utilizadas para armazenar anotações CDS de uma entidade fora de sua *Data Definition* principal, facilitando a governança e extensibilidade sem modificação.

### CDS Behavior Definition
Define o comportamento transacional (operações permitidas, bloqueios, ações) de um Business Object no modelo RAP.

---

## 6. Objetos CDS no Project Explorer do ADT

No **Project Explorer** do **ABAP Development Tools (ADT)**, você encontra os objetos CDS sob o pacote de desenvolvimento, em um nó dedicado denominado **Core Data Services**.

![[02CDSObjects_002.png]]

---

## 7. Prática Hands-On: Analisando Objetos do Dicionário e CDS

> [!NOTE] Objetivo do Exercício Prático
> Você deseja aprender como definir objetos no ABAP Dictionary e no ABAP Core Data Services. No primeiro passo, você preparará o ambiente de desenvolvimento ABAP, criará um novo pacote e analisará alguns objetos existentes.

### Pré-requisitos
Para realizar os exercícios descritos nesta jornada de aprendizagem, é necessário acesso a um sistema dedicado de treinamento (*Hands-on practice system*) e uma instalação local do **Eclipse IDE** com o plug-in **ABAP Development Tools (ADT)** configurado.

---

### Tarefa 1: Preparar o Projeto

No Eclipse, crie um projeto ABAP Cloud e adicione o pacote **/LRN/S4D430_EXERCISE** à lista de pacotes favoritos (*Favorite Packages*). No projeto ABAP Cloud, crie um novo pacote sob o superpacote **ZLOCAL** (nome sugerido: **ZS4D430_##**, onde ## é o número do seu grupo) e adicione-o também aos favoritos.

#### Passos de Execução:
1. Abra o Eclipse, mude para a perspectiva ABAP (*Window* $\rightarrow$ *Perspective* $\rightarrow$ *Open Perspective* $\rightarrow$ *Other...* $\rightarrow$ *ABAP*) e crie um projeto *ABAP Cloud Project* via menu *File* $\rightarrow$ *New* $\rightarrow$ *ABAP Cloud Project*.
   - Cole a URL da instância de serviço (*ABAP Service Instance URL*), avance e faça o logon via navegador.
   - Ao concluir a autenticação, retorne ao Eclipse e clique em *Finish*.
2. Adicione o pacote **/LRN/S4D430_EXERCISE** aos favoritos:
   - No painel *Project Explorer*, clique com o botão direito sobre *Favorite Packages* e selecione *Add Package...*.
   - Digite **/LRN/S4D430** e selecione */LRN/S4D430_EXERCISE*. Clique em *OK*.
3. No seu projeto ABAP Cloud, crie um novo pacote com os atributos listados abaixo:

| Campo | Valor Configurado |
| :--- | :--- |
| **Name** | `ZS4D430_##` *(onde ## é o seu número de grupo)* |
| **Description** | `Modeling in ABAP` |
| **Add to favorite packages** | Marcado |
| **Superpackage** | `ZLOCAL` |
| **Package Type** | `Development` |
| **Software Component** | `ZLOCAL` |
| **Application Component** | *(Deixe em branco)* |
| **Transport Layer** | *(Deixe em branco)* |

4. Escolha uma requisição de transporte (*Transport Request*) existente na qual você esteja envolvido ou crie uma nova com a descrição `ABAP Exercises`. Clique em *Finish*.

---

### Tarefa 2: Analisar Objetos Existentes

Analise o conteúdo do pacote **/LRN/S4D430_INTRO** (subpacote de `/LRN/S4D430_EXERCISE`):

#### Passos de Execução:
1. No *Project Explorer*, expanda `/LRN/S4D430_EXERCISE` $\rightarrow$ `/LRN/S4D430_INTRO` $\rightarrow$ **Dictionary** e analise os objetos lá definidos (domínios, elementos de dados, estruturas e tabelas de banco).
2. De forma similar, expanda `/LRN/S4D430_EXERCISE` $\rightarrow$ `/LRN/S4D430_INTRO` $\rightarrow$ **Core Data Services** e analise o conteúdo existente em *Data Definitions*.

---

### Tarefa 3: Explorar o Uso no Código ABAP

Crie uma classe ABAP que implemente a interface **IF_OO_ADT_CLASSRUN** (nome sugerido: **ZCL_##_INTRO**, onde ## é o seu número de grupo). Use o recurso de autocompletar código (*Code Completion*) para explorar quais objetos do pacote **/LRN/S4D430_INTRO** você pode utilizar como tipos de dados e quais pode utilizar como fonte de dados em uma instrução `SELECT`.

#### Passos de Execução:
1. No seu pacote pessoal, clique com o botão direito e selecione *New* $\rightarrow$ *ABAP Class*.
   - Nome: `ZCL_##_INTRO`
   - Descrição: `Analyze dictionary and CDS`
   - Na seção de interfaces, adicione: `IF_OO_ADT_CLASSRUN`
   - Confirme a requisição de transporte e clique em *Finish*.
2. No método `if_oo_adt_classrun~main`, declare uma variável do tipo `string`:

```abap
METHOD if_oo_adt_classrun~main.

  DATA var TYPE string.

ENDMETHOD.
```

3. Substitua o tipo `string` por objetos do pacote **/LRN/S4D430_INTRO**.
   - Apague `string`, digite `/LRN/S4D430_IND` e pressione **Ctrl + Space** para acionar o autocompletar.
   - Observe quais objetos aparecem disponíveis como tipos de dados válidos: Elementos de dados, estruturas e tabelas de banco aparecem como opções aceitas. Domínios não podem ser utilizados como tipos de dados.
4. Implemente uma instrução `SELECT` que realize a leitura a partir da tabela de banco de dados **/LRN/S4D430_IND**:

```abap
  METHOD if_oo_adt_classrun~main.

    SELECT FROM /lrn/s4d430_ind         
         FIELDS *
           INTO TABLE @DATA(result).

  ENDMETHOD.
```

5. Substitua `/lrn/s4d430_ind` na cláusula `FROM` por outro objeto do pacote **/LRN/S4D430_INTRO**.
   - Posicione o cursor imediatamente após `/LRN/S4D430_IND` e pressione **Ctrl + Space**.
   - Observe quais objetos podem ser utilizados como fonte de dados: apenas tabelas de banco de dados e entidades CDS (*Data Definitions*) são aceitas na cláusula `FROM`. Estruturas, domínios e elementos de dados geram erro de sintaxe.
