---
tipo: clippings
title: "Defining Dictionary Structures"
source: "https://learning.sap.com/courses/building-data-models-with-the-abap-dictionary-and-abap-core-data-services/defining-dictionary-structures_f49fdfa0-b063-4697-a795-cbdcc38aff6a"
created: 2026-11-03
tags:
  - sap
  - abap
  - abap-cloud
  - ddic
  - structures
  - nested-structures
  - include-structures
  - named-includes
  - adt
---
**Roteiro de Estudos Relacionado:** [[Roteiro de Estudos SAP]]

# Objetivos de Aprendizado

Após concluir esta lição, você será capaz de:
- Definir estruturas no **ABAP Dictionary** utilizando a sintaxe baseada em código-fonte.
- Modelar e acessar estruturas aninhadas (*Nested Structures*).
- Aplicar estruturas de inclusão (*Include Structures*) e compreender o comportamento de inclusões nomeadas (*Named Includes*).

---

## 1. Estruturas no ABAP Dictionary

Uma estrutura no ABAP Dictionary define um tipo de dados estruturado global (um conjunto ordenado de campos com seus respectivos tipos e nomes). Diferente das tabelas de banco de dados, as estruturas **não possuem tabela física correspondente no banco de dados**, existindo exclusivamente como definições de tipos para o código ABAP.

![[01DictionaryStructures_001.png]]

### Sintaxe de Definição de Estrutura:
```abap
@EndUserText.label : 'Employee Name Structure'
@AbapCatalog.enhancement.category : #NOT_EXTENSIBLE
define structure zstructure_name {

  component_1 : type_1;
  component_2 : type_2;

}
```

Cada componente pode ser tipado referenciando um elemento de dados, um tipo predefinido, outra estrutura ou um tipo de tabela.

---

## 2. Estruturas Aninhadas (*Nested Structures*)

Uma estrutura aninhada é aquela em que um ou mais de seus componentes possui como tipo outra estrutura.

<iframe 
    src="https://cdnapisec.kaltura.com/p/1921661/embedPlaykitJs/uiconf_id/50355372?iframeembed=true&entry_id=1_vj8b6dpx" 
    width="100%" 
    height="400" 
    allowfullscreen 
    frameborder="0">
</iframe>

<iframe 
    src="https://cdnapisec.kaltura.com/p/1921661/embedPlaykitJs/uiconf_id/50355372?iframeembed=true&entry_id=1_0kokws3g" 
    width="100%" 
    height="400" 
    allowfullscreen 
    frameborder="0">
</iframe>

### Exemplo Conceitual:
Se a estrutura `ZPERSON` contém um componente `address` cujo tipo é a estrutura `ZADDRESS`:

```abap
define structure zperson {
  employee_id : /lrn/employee_id;
  address     : zaddress;
}
```

### Acesso aos Subcomponentes no Código ABAP:
No código-fonte, o desenvolvedor utiliza o **seletor de hífen (`-`)** encadeado para acessar campos internos em qualquer nível de profundidade:

```abap
DATA person TYPE zperson.

person-employee_id  = '00001001'.
person-address-city = 'Walldorf'.
```

---

## 3. Estruturas de Inclusão (*Include Structures*)

Em vez de criar um aninhamento em profundidade, você pode incorporar todos os componentes de uma estrutura existente diretamente no nível principal da nova estrutura utilizando a instrução `include`.

![[03IncludeStructures_001.png]]

```abap
define structure zperson {
  employee_id : /lrn/employee_id;
  include zname;
  address     : zaddress;
}
```

Quando você inclui `ZNAME` (que contém `first_name` e `last_name`), esses campos tornam-se componentes diretos de `ZPERSON`, sendo acessados como `person-first_name` e `person-last_name`.

---

## 4. Inclusões Nomeadas (*Named Includes*)

Uma inclusão nomeada adiciona um alias à estrutura incluída através da cláusula `as include_name`:

![[04NamedIncludes_001.png]]

<iframe 
    src="https://cdnapisec.kaltura.com/p/1921661/embedPlaykitJs/uiconf_id/50355372?iframeembed=true&entry_id=1_pkph3xjr" 
    width="100%" 
    height="400" 
    allowfullscreen 
    frameborder="0">
</iframe>

```abap
define structure zperson {
  employee_id : /lrn/employee_id;
  include zname as name;
}
```

### O Comportamento Duplo de Endereçamento em Inclusões Nomeadas:
Em um *Named Include*, o compilador ABAP permite endereçar os campos de **duas formas simultâneas e válidas**:
1. **Sem o nome do include (acesso direto):** `person-first_name = 'John'.`
2. **Com o nome do include:** `person-name-first_name = 'John'.`

> [!CAUTION] Regra de Sintaxe Crítica
> Embora você possa acessar `person-name-first_name` e `person-first_name`, você **NÃO pode** tratar o próprio nome do include como se fosse uma variável estruturada única (ex: `person-name = ...` gera erro de sintaxe imediato). O include nomeado atua apenas como um prefixo opcional de qualificação de caminho.

---

## 5. Prática Hands-On: Definir e Utilizar Estruturas do Dicionário

> [!NOTE] Objetivo do Exercício
> Neste laboratório, você modelará estruturas para dados de nome e endereço, combinará ambas dentro de uma estrutura `Z##_PERSON` utilizando tanto include nomeado quanto aninhamento e consumirá os dados em uma classe ABAP.

---

### Tarefa 1: Criar a Estrutura `Z##_NAME`
1. No *Project Explorer*, clique com o botão direito no nó **Dictionary** do seu pacote `ZS4D430_##` e selecione:
   **New $\rightarrow$ Structure**.
2. Preencha:
   - **Name:** `Z##_NAME` *(ex: `Z01_NAME`)*
   - **Description:** `Person Name`
3. Defina o código:

```abap
@EndUserText.label : 'Person Name'
@AbapCatalog.enhancement.category : #NOT_EXTENSIBLE
define structure z01_name {

  first_name : /lrn/first_name;
  last_name  : /lrn/last_name;

}
```
4. Salve (**Ctrl + S**) e ative (**Ctrl + F3**).

---

### Tarefa 2: Criar a Estrutura `Z##_ADDRESS`
1. Crie uma nova estrutura:
   - **Name:** `Z##_ADDRESS`
   - **Description:** `Address Data`
2. Defina os campos:

```abap
@EndUserText.label : 'Address Data'
@AbapCatalog.enhancement.category : #NOT_EXTENSIBLE
define structure z01_address {

  street      : /lrn/street;
  city        : /lrn/city;
  postal_code : /lrn/postal_code;
  country     : /lrn/country;

}
```
3. Ative a estrutura (**Ctrl + F3**).

---

### Tarefa 3: Criar a Estrutura Composta `Z##_PERSON`
1. Crie a estrutura principal:
   - **Name:** `Z##_PERSON`
   - **Description:** `Person Data with Nested and Include Structures`
2. Defina a composição:

```abap
@EndUserText.label : 'Person Data'
@AbapCatalog.enhancement.category : #NOT_EXTENSIBLE
define structure z01_person {

  person_id : /lrn/employee_id;
  
  " 1. Include Nomeado
  include z01_name as name;
  
  " 2. Estrutura Aninhada
  address   : z01_address;

}
```
3. Ative a estrutura (**Ctrl + F3**).

---

### Tarefa 4: Testar o Endereçamento no Código ABAP
Na sua classe executável `ZCL_##_INTRO`, teste o acesso a todos os componentes:

```abap
  METHOD if_oo_adt_classrun~main.

    DATA person TYPE z01_person.

    person-person_id         = '10000001'.
    
    " Acesso direto ao include
    person-first_name        = 'Carlos'.
    
    " Acesso qualificado pelo nome do include
    person-name-last_name    = 'Silva'.
    
    " Acesso à estrutura aninhada
    person-address-street    = 'Av. Paulista, 1000'.
    person-address-city      = 'São Paulo'.
    person-address-country   = 'BR'.

    out->write( person ).

  ENDMETHOD.
```
Execute com **F9** e observe a impressão estruturada no console do Eclipse.
