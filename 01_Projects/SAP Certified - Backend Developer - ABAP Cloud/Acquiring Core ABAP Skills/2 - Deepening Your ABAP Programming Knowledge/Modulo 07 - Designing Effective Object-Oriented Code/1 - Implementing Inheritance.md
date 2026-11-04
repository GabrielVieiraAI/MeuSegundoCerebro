---
tipo: clippings
source: "https://learning.sap.com/courses/deepening-your-abap-programming-knowledge"
created: 2026-11-03
tags:
  - sap
  - abap
  - abap-cloud
  - orientacao-a-objetos
  - heranca
  - clean-core
---

# 1 - Implementing Inheritance

> [!NOTE] Conexão com o Guia de Estudos
> Esta lição compõe o **Módulo 07: Designing Effective Object-Oriented Code** da jornada oficial *Deepening Your ABAP Programming Knowledge*. Consulte o [[Roteiro de Estudos SAP]] para o planejamento completo.

---

## 1. Visão Geral da Herança em ABAP OO

A **Herança** (*Inheritance*) é um dos pilares fundamentais da Programação Orientada a Objetos (OO). Ela permite criar uma nova classe (**subclasse** ou classe filha) a partir de uma classe existente (**superclasse** ou classe mãe).

A subclasse herda automaticamente todos os componentes não-privados (atributos, métodos, constantes e tipos) da superclasse, podendo:
1. Reutilizar o código já implementado na superclasse.
2. Adicionar novos atributos e métodos específicos.
3. **Redefinir** (*redefinition*) o comportamento de métodos herdados para adaptá-los à sua especialização.

```
       ┌────────────────────────┐
       │   lcl_vehicle (Super)  │
       └───────────▲────────────┘
                   │ INHERITING FROM
       ┌───────────┴────────────┐
       │   lcl_truck (Subclass) │
       └────────────────────────┘
```
> [!TIP] Diagrama Conceitual
> Consulte o fluxo visual completo em: ![[Heranca_Classes_ABAP.excalidraw]]

---

## 2. Regras Essenciais de Herança no ABAP

1. **Herança Simples (*Single Inheritance*):**
   - No ABAP, uma classe pode ter **apenas uma única superclasse direta**.
   - Não é permitida herança múltipla de classes (para múltiplos comportamentos, o ABAP utiliza **Interfaces**).
   - Uma superclasse pode ter infinitas subclasses.

2. **A Classe Raiz `object`:**
   - Toda classe ABAP que não declara explicitamente uma superclasse herda implicitamente da classe abstrata raiz do sistema: `object`.

3. **Sintaxe de Herança:**
   - A cláusula `INHERITING FROM` é especificada na definição da subclasse:

```abap
CLASS lcl_vehicle DEFINITION.
  PUBLIC SECTION.
    METHODS:
      start_engine,
      get_speed RETURNING VALUE(rv_speed) TYPE i.
  PROTECTED SECTION.
    DATA mv_speed TYPE i.
ENDCLASS.

CLASS lcl_truck DEFINITION INHERITING FROM lcl_vehicle.
  PUBLIC SECTION.
    METHODS:
      load_cargo IMPORTING iv_weight TYPE i.
ENDCLASS.
```

---

## 3. Seções de Visibilidade na Herança

A correta escolha da seção de visibilidade define o que a subclasse pode ou não enxergar:

| Seção | Acesso Externo | Acesso pela Subclasse | Finalidade |
| :--- | :---: | :---: | :--- |
| **`PUBLIC`** | Sim | Sim (Herdado) | Interface pública de comunicação da classe. |
| **`PROTECTED`** | Não | **Sim (Herdado)** | Componentes internos compartilhados apenas na árvore de herança. |
| **`PRIVATE`** | Não | **Não** | Detalhes de implementação exclusivos da própria classe. |

> [!WARNING] Atenção com a Seção `PRIVATE`
> Atributos e métodos definidos na seção `PRIVATE` da superclasse **não são visíveis nem acessíveis** pelas subclasses. Se você precisa que um componente seja visível apenas para os filhos sem expô-lo para o consumidor externo, declare-o na seção `PROTECTED`.

---

## 4. Redefinição de Métodos (`REDEFINITION`)

Uma subclasse pode alterar a implementação de métodos herdados da superclasse usando a palavra-chave `REDEFINITION`.

### Regras de Ouro da Redefinição:
- Apenas **métodos de instância** (`METHODS`) podem ser redefinidos. Métodos estáticos (`CLASS-METHODS`) **não** podem ser redefinidos.
- A declaração da redefinição deve ocorrer **na mesma seção de visibilidade** em que o método original foi declarado na superclasse (`PUBLIC` ou `PROTECTED`).
- A **assinatura** do método (parâmetros `IMPORTING`, `EXPORTING`, `CHANGING`, `RETURNING` e exceções) **não pode ser alterada**. Ela é mantida exatamente como definida na superclasse.
- Métodos privados não podem ser redefinidos.

### Exemplo de Sintaxe de Redefinição:

```abap
CLASS lcl_vehicle DEFINITION.
  PUBLIC SECTION.
    METHODS describe_vehicle RETURNING VALUE(rv_desc) TYPE string.
ENDCLASS.

CLASS lcl_vehicle IMPLEMENTATION.
  METHOD describe_vehicle.
    rv_desc = 'Sou um veículo genérico.'.
  ENDMETHOD.
ENDCLASS.

" Subclasse redefinindo o método
CLASS lcl_truck DEFINITION INHERITING FROM lcl_vehicle.
  PUBLIC SECTION.
    METHODS describe_vehicle REDEFINITION.
ENDCLASS.

CLASS lcl_truck IMPLEMENTATION.
  METHOD describe_vehicle.
    rv_desc = 'Sou um caminhão de transporte pesado.'.
  ENDMETHOD.
ENDCLASS.
```

---

## 5. Invocando a Lógica da Superclasse (`SUPER->`)

Quando você redefine um método, a implementação da subclasse substitui por completo a lógica do pai. Contudo, na maioria dos casos práticos de engenharia, queremos apenas **estender** ou complementar o comportamento anterior.

Para chamar a implementação da superclasse de dentro do método redefinido, utiliza-se a pseudo-referência **`SUPER->`**:

```abap
CLASS lcl_truck IMPLEMENTATION.
  METHOD describe_vehicle.
    " 1. Executa primeiro a lógica padrão da superclasse
    DATA(lv_parent_desc) = SUPER->describe_vehicle( ).

    " 2. Concatena com a especialização do caminhão
    rv_desc = |{ lv_parent_desc } Carga máxima suportada: 25 toneladas.|.
  ENDMETHOD.
ENDCLASS.
```

### Diferença entre `ME->` e `SUPER->`:
- **`ME->`**: Referência à instância atual. Chama a implementação do próprio objeto (se o método foi redefinido, chama a versão da subclasse).
- **`SUPER->`**: Pseudo-referência que força o compilador a executar a implementação da superclasse direta.

---

## 6. Construtores em Hierarquias de Herança

O construtor de instância (`METHODS constructor`) possui regras estritas em árvores de herança:

1. Se a subclasse define um construtor explícito, ela **é obrigada** a chamar o construtor da superclasse como **primeira instrução** executável:
   ```abap
   CALL METHOD super->constructor( ... ).
   " ou forma moderna:
   super->constructor( ... ).
   ```
2. A assinatura do construtor na subclasse **não precisa ser idêntica** à do construtor da superclasse (o filho pode ter parâmetros adicionais).
3. Atributos da subclasse só devem ser manipulados após a execução bem-sucedida do construtor da superclasse.

```abap
CLASS lcl_truck DEFINITION INHERITING FROM lcl_vehicle.
  PUBLIC SECTION.
    METHODS constructor
      IMPORTING
        iv_model  TYPE string
        iv_weight TYPE i.
    DATA mv_weight TYPE i.
ENDCLASS.

CLASS lcl_truck IMPLEMENTATION.
  METHOD constructor.
    " Chamada obrigatória ao construtor do pai:
    super->constructor( iv_model = iv_model ).
    
    " Atribuições específicas da subclasse:
    mv_weight = iv_weight.
  ENDMETHOD.
ENDCLASS.
```

---

## 7. Classes e Métodos Abstratos e Finais

O ABAP oferece modificadores para controlar a extensibilidade do design orientado a objetos:

### A. Modificador `ABSTRACT`
- **`CLASS ... ABSTRACT`**: Uma classe abstrata **não pode ser instanciada** diretamente com `NEW`. Ela serve como modelo base para outras classes.
- **`METHODS ... ABSTRACT`**: Um método abstrato possui apenas a assinatura na definição, sem bloco `METHOD ... ENDMETHOD` na implementação da classe abstrata. As subclasses não-abstratas são **obrigadas** a redefinir e implementar o método.

### B. Modificador `FINAL`
- **`CLASS ... FINAL`**: A classe **não pode ser herdada**. Nenhuma outra classe pode usar `INHERITING FROM` nela.
- **`METHODS ... FINAL`**: O método não pode mais ser redefinido por subclasses subsequentes na árvore de herança.

> [!TIP] Boas Práticas do Clean Core
> Segundo as diretrizes oficiais de desenvolvimento ABAP Cloud e Clean Core, classes que não foram explicitamente projetadas para permitir herança devem ser marcadas como **`FINAL`** por padrão. Isso protege a arquitetura contra acoplamento indevido e alterações acidentais de comportamento.
