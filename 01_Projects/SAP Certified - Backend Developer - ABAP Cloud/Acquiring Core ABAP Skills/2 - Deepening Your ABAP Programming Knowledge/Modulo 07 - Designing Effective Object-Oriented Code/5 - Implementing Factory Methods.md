---
tipo: clippings
source: "https://learning.sap.com/courses/deepening-your-abap-programming-knowledge"
created: 2026-11-03
tags:
  - sap
  - abap
  - abap-cloud
  - orientacao-a-objetos
  - design-patterns
  - factory-method
  - singleton
  - clean-core
---

# 5 - Implementing Factory Methods

> [!NOTE] Conexão com o Guia de Estudos
> Esta lição compõe o **Módulo 07: Designing Effective Object-Oriented Code** da jornada oficial *Deepening Your ABAP Programming Knowledge*. Consulte o [[Roteiro de Estudos SAP]] para o planejamento completo.

---

## 1. O Padrão de Projeto Factory Method

No início do aprendizado de ABAP OO, é comum instanciar objetos diretamente onde precisamos deles usando o operador `NEW`:
```abap
DATA(lo_invoice) = NEW lcl_invoice_service( ).
```

Embora simples, essa abordagem causa **acoplamento forte**: quem consome o código precisa conhecer exatamente a classe concreta, seus parâmetros de construtor e suas dependências.

O **Factory Method** (Método Fábrica) é um padrão de projeto criacional (*Creational Design Pattern*) amplamente utilizado pela SAP. Em vez de permitir que o código cliente crie o objeto diretamente com `NEW`, a responsabilidade pela criação da instância é delegada a um **método estático público** (`CLASS-METHODS`), que encapsula toda a complexidade de instanciação e retorna a referência pronta.

```
[ Código Consumidor ]
        │
        │ 1. Solicita objeto: get_instance( )
        ▼
┌──────────────────────────────┐
│     Classe Fábrica           │
│ + get_instance( )            │
└──────────────┬───────────────┘
               │ 2. Cria e valida com NEW privado
               ▼
┌──────────────────────────────┐
│    Instância Concreta        │
│ << CREATE PRIVATE >>         │
└──────────────────────────────┘
```

> [!TIP] Diagrama do Factory Method
> Veja o fluxo de encapsulamento e injeção em: ![[Factory_Method_ABAP.excalidraw]]

---

## 2. Restringindo a Instanciação: `CREATE PRIVATE`

Para garantir que o código externo não contorne o Factory Method usando `NEW`, a definição da classe deve incluir a adição **`CREATE PRIVATE`** (ou `CREATE PROTECTED` se permitir criação por subclasses):

```abap
CLASS lcl_flight_service DEFINITION CREATE PRIVATE.
  PUBLIC SECTION.
    " 1. O método de fábrica estático é o único ponto de entrada público:
    CLASS-METHODS get_instance
      IMPORTING
        iv_agency_id       TYPE /dmo/agency_id
      RETURNING
        VALUE(ro_instance) TYPE REF TO lcl_flight_service.

    METHODS get_available_flights.

  PRIVATE SECTION.
    " 2. O construtor é movido para a seção privada:
    METHODS constructor
      IMPORTING
        iv_agency_id TYPE /dmo/agency_id.

    DATA mv_agency_id TYPE /dmo/agency_id.
ENDCLASS.
```

### Implementação da Fábrica:

```abap
CLASS lcl_flight_service IMPLEMENTATION.
  METHOD constructor.
    mv_agency_id = iv_agency_id.
  ENDMETHOD.

  METHOD get_instance.
    " Apenas os métodos da própria classe podem instanciar um objeto com CREATE PRIVATE:
    ro_instance = NEW lcl_flight_service( iv_agency_id = iv_agency_id ).
  ENDMETHOD.

  METHOD get_available_flights.
    " Lógica de negócio
  ENDMETHOD.
ENDCLASS.
```

### Consumo no Programa Cliente:
```abap
" Tentativa com NEW falha em tempo de compilação:
" DATA(lo_fail) = NEW lcl_flight_service( '000001' ). " ERRO: Instantiation not allowed!

" Forma correta via Factory Method:
DATA(lo_service) = lcl_flight_service=>get_instance( iv_agency_id = '000001' ).
lo_service->get_available_flights( ).
```

---

## 3. Combinando Factory Methods com Interfaces

O padrão atinge seu ápice arquitetural quando o Factory Method retorna uma **Interface** em vez da classe concreta.

Dessa forma, o consumidor só conhece o contrato abstrato (`zif_payment_processor`), enquanto a fábrica decide qual subclasse concreta instanciar com base em parâmetros de negócio:

```abap
CLASS lcl_payment_factory DEFINITION FINAL CREATE PRIVATE.
  PUBLIC SECTION.
    CLASS-METHODS get_processor
      IMPORTING
        iv_payment_method TYPE string
      RETURNING
        VALUE(ro_processor) TYPE REF TO zif_payment_processor.
ENDCLASS.

CLASS lcl_payment_factory IMPLEMENTATION.
  METHOD get_processor.
    ro_processor = SWITCH #( iv_payment_method
      WHEN 'CREDIT_CARD' THEN NEW lcl_credit_card_processor( )
      WHEN 'PIX'         THEN NEW lcl_pix_processor( )
      WHEN 'PAYPAL'      THEN NEW lcl_paypal_processor( )
      ELSE THROW cx_invalid_payment_method( )
    ).
  ENDMETHOD.
ENDCLASS.
```

---

## 4. O Padrão Singleton (*Single Instance*)

Um uso clássico do Factory Method em ABAP é o **Singleton**, que assegura que **apenas uma única instância** da classe exista na memória durante toda a execução da transação ou requisição (*Internal Session*):

```abap
CLASS lcl_system_configuration DEFINITION FINAL CREATE PRIVATE.
  PUBLIC SECTION.
    CLASS-METHODS get_instance
      RETURNING VALUE(ro_instance) TYPE REF TO lcl_system_configuration.

    METHODS get_api_endpoint RETURNING VALUE(rv_url) TYPE string.

  PRIVATE SECTION.
    " Atributo estático que armazena a instância única
    CLASS-DATA go_singleton TYPE REF TO lcl_system_configuration.

    METHODS constructor.
ENDCLASS.

CLASS lcl_system_configuration IMPLEMENTATION.
  METHOD constructor.
    " Carga pesada de configurações realizada uma única vez
  ENDMETHOD.

  METHOD get_instance.
    " Se ainda não existe, cria a primeira vez; senão, reaproveita a existente:
    IF go_singleton IS NOT BOUND.
      go_singleton = NEW #( ).
    ENDIF.
    ro_instance = go_singleton.
  ENDMETHOD.

  METHOD get_api_endpoint.
    rv_url = 'https://api.gateway.sap.corp/v1'.
  ENDMETHOD.
ENDCLASS.
```

---

## 5. Factory Methods no Clean Core e Testes Unitários

Em ambientes empresariais modernos, os Factory Methods são a chave para permitir a **Injeção de Dependências** (*Dependency Injection*) no **ABAP Unit**:

1. Em **tempo de execução padrão (produção)**, o Factory Method instancia a classe real que conecta no banco de dados e consome serviços remotos.
2. Em **tempo de teste unitário**, a classe de teste injeta um objeto simulado (*Test Double / Mock*) através de um método de injeção na fábrica (`inject_test_instance`):

```abap
CLASS lcl_payment_factory DEFINITION FINAL CREATE PRIVATE.
  PUBLIC SECTION.
    CLASS-METHODS get_processor
      RETURNING VALUE(ro_processor) TYPE REF TO zif_payment_processor.

    " Método de suporte a testes (visível para classes de teste locais):
    CLASS-METHODS inject_test_instance
      IMPORTING io_test_mock TYPE REF TO zif_payment_processor.

  PRIVATE SECTION.
    CLASS-DATA go_injected_mock TYPE REF TO zif_payment_processor.
ENDCLASS.

CLASS lcl_payment_factory IMPLEMENTATION.
  METHOD inject_test_instance.
    go_injected_mock = io_test_mock.
  ENDMETHOD.

  METHOD get_processor.
    " Se houver mock injetado pelo teste unitário, devolve o mock:
    IF go_injected_mock IS BOUND.
      ro_processor = go_injected_mock.
      RETURN.
    ENDIF.

    " Caso contrário, instancia o processador real de produção:
    ro_processor = NEW lcl_real_payment_processor( ).
  ENDMETHOD.
ENDCLASS.
```

> [!NOTE] Resumo dos Benefícios do Factory Method
> - **Ocultação de Construtores:** O cliente não precisa saber quais parâmetros ou dependências o objeto necessita.
> - **Controle de Ciclo de Vida:** Facilita a implementação de *caching*, *object pooling* e *singletons*.
> - **Desacoplamento e Testabilidade:** O código cliente depende de interfaces, permitindo a substituição por mocks no ABAP Unit sem alterar a regra de negócio.
