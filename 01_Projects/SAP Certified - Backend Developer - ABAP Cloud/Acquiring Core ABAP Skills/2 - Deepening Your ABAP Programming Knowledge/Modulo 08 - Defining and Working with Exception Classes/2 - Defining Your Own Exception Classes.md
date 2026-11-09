---
tipo: clippings
source: "https://learning.sap.com/courses/deepening-your-abap-programming-knowledge"
created: 2026-11-03
tags:
  - sap
  - abap
  - abap-cloud
  - orientacao-a-objetos
  - excecoes
  - mensagens
  - clean-core
---

# 2 - Defining Your Own Exception Classes

> [!NOTE] Conexão com o Guia de Estudos
> Esta lição compõe o **Módulo 08: Defining and Working with Exception Classes** da jornada oficial *Deepening Your ABAP Programming Knowledge*. Consulte o [[Roteiro de Estudos SAP]] para o planejamento completo.

---

## 1. Por que Criar Classes de Exceção Customizadas?

Em aplicações empresariais reais, exceções genéricas de sistema (como divisão por zero ou falta de memória) são insuficientes para modelar cenários de negócio.

Quando desenvolvemos soluções no **ABAP Cloud**, criamos **classes de exceção customizadas** (seguindo o prefixo `ZCX_` ou `YCX_`) para:
1. Notificar regras de negócio violadas com clareza (ex: `zcx_flight_fully_booked`, `zcx_credit_limit_exceeded`).
2. Transportar atributos de contexto (ex: ID do cliente, saldo atual, data da falha).
3. Integrar perfeitamente com mensagens do dicionário SAP (**SE91 / Message Classes**) com suporte multilíngue para o usuário final.

```
       ┌────────────────────────┐
       │    cx_static_check     │
       └───────────▲────────────┘
                   │ INHERITING FROM
       ┌───────────┴────────────┐
       │   zcx_business_error   │ (Superclasse abstrata do domínio)
       └───────────▲────────────┘
                   │
       ┌───────────┴────────────┐
       │   zcx_order_locked     │ (Exceção específica)
       └────────────────────────┘
```

> [!TIP] Diagrama de Criação de Exceções Customizadas
> Veja a arquitetura de classes, construtores e mensagens em: ![[Criacao_Excecoes_Customizadas_ABAP.excalidraw]]

---

## 2. Escolhendo a Superclasse e Assistentes no ADT

Ao criar uma classe de exceção no **ABAP Development Tools (ADT no Eclipse)** através do menu *New **`**=>**`** ABAP Class*:

1. **Nome da Classe:** Padronizado com `ZCX_<DOMINIO>_<ERRO>`.
2. **Superclasse:** O assistente define automaticamente **`CX_STATIC_CHECK`** como superclasse padrão.
   - Conforme estudado na lição anterior, `CX_STATIC_CHECK` é a escolha mandatória para erros de negócio previsíveis, pois obriga o consumidor a tratar a exceção com `TRY...CATCH` ou declará-la com `RAISING` na assinatura do método.

---

## 3. Integração com Classes de Mensagens (`IF_T100_MESSAGE`)

Para que a exceção apresente mensagens traduzíveis e amigáveis, a classe de exceção implementa a interface padrão **`IF_T100_MESSAGE`** (ou a extensão moderna **`IF_T100_DYN_MSG`**).

### A Estrutura `SCX_T100KEY`
A interface utiliza uma estrutura com 6 campos para mapear a mensagem da transação SE91 e associar seus espaços reservados (`&1`, `&2`, `&3`, `&4`) a atributos da própria classe:
- `msgid`: Nome da classe de mensagem (ex: `'Z_FLIGHTS'`).
- `msgno`: Número da mensagem na SE91 (ex: `'045'`).
- `attr1` até `attr4`: Nomes dos atributos da classe cujos valores preencherão os marcadores variáveis da mensagem.

---

## 4. Anatomia de uma Classe de Exceção Customizada

Abaixo está a estrutura oficial gerada e padronizada para uma classe de exceção completa:

```abap
CLASS zcx_booking_error DEFINITION
  PUBLIC
  INHERITING FROM cx_static_check
  FINAL
  CREATE PUBLIC.

  PUBLIC SECTION.
    INTERFACES if_t100_message.
    INTERFACES if_t100_dyn_msg.

    " 1. Constantes que mapeiam os identificadores de mensagens (SE91)
    CONSTANTS:
      BEGIN OF booking_failed,
        msgid TYPE symsgid VALUE 'Z_BOOKING',
        msgno TYPE symsgno VALUE '001',
        attr1 TYPE scx_attrname VALUE 'CARRIER_ID',
        attr2 TYPE scx_attrname VALUE 'FLIGHT_DATE',
        attr3 TYPE scx_attrname VALUE '',
        attr4 TYPE scx_attrname VALUE '',
      END OF booking_failed,

      BEGIN OF customer_blocked,
        msgid TYPE symsgid VALUE 'Z_BOOKING',
        msgno TYPE symsgno VALUE '002',
        attr1 TYPE scx_attrname VALUE 'CUSTOMER_ID',
        attr2 TYPE scx_attrname VALUE '',
        attr3 TYPE scx_attrname VALUE '',
        attr4 TYPE scx_attrname VALUE '',
      END OF customer_blocked.

    " 2. Atributos públicos que guardam as informações de contexto do erro
    DATA carrier_id   TYPE /dmo/carrier_id.
    DATA flight_date  TYPE /dmo/flight_date.
    DATA customer_id  TYPE /dmo/customer_id.

    " 3. Construtor gerado com suporte a encadeamento (PREVIOUS) e parâmetros
    METHODS constructor
      IMPORTING
        textid       LIKE if_t100_message=>t100key OPTIONAL
        previous     LIKE previous OPTIONAL
        carrier_id   TYPE /dmo/carrier_id OPTIONAL
        flight_date  TYPE /dmo/flight_date OPTIONAL
        customer_id  TYPE /dmo/customer_id OPTIONAL.

ENDCLASS.

CLASS zcx_booking_error IMPLEMENTATION.
  METHOD constructor ##ADT_SUPPRESS_GENERATION.
    super->constructor( previous = previous ).
    CLEAR me->textid.
    IF textid IS INITIAL.
      if_t100_message~t100key = if_t100_message=>default_textid.
    ELSE.
      if_t100_message~t100key = textid.
    ENDIF.

    me->carrier_id  = carrier_id.
    me->flight_date = flight_date.
    me->customer_id = customer_id.
  ENDMETHOD.
ENDCLASS.
```

---

## 5. Formas de Disparar a Exceção Customizada

No código consumidor, você pode instanciar e disparar a exceção de três maneiras:

### Opção 1: Passando a Chave `TEXTID` e Parâmetros
```abap
IF lv_seats_available = 0.
  RAISE EXCEPTION TYPE zcx_booking_error
    EXPORTING
      textid      = zcx_booking_error=>booking_failed
      carrier_id  = 'LH'
      flight_date = sy-datum.
ENDIF.
```

### Opção 2: Disparo Direto de Mensagem (ABAP 7.50+)
Permite especificar diretamente os parâmetros da mensagem no próprio comando `RAISE EXCEPTION`:

```abap
RAISE EXCEPTION TYPE zcx_booking_error
  MESSAGE ID 'Z_BOOKING'
  TYPE 'E'
  NUMBER '001'
  WITH 'LH' sy-datum.
```

### Opção 3: Disparo Integrado com `USING MESSAGE`
Muito utilizado após checagens com a instrução `MESSAGE ... INTO DATA(dummy)`:

```abap
MESSAGE e002(z_booking) WITH lv_customer_id INTO DATA(lv_dummy).
RAISE EXCEPTION TYPE zcx_booking_error USING MESSAGE.
```

---

## 6. Boas Práticas do Clean Core para Arquitetura de Exceções

1. **Nunca Silencie Exceções:**  
   Jamais escreva blocos `CATCH` vazios sem nenhuma ação (`CATCH cx_root. " faz nada`). Se uma exceção não pode ser recuperada, registre-a no log da aplicação ou deixe-a propagar.
2. **Preserve a Causa Raiz (*Chaining*):**  
   Ao capturar uma exceção técnica e relançar uma exceção de negócio, passe o objeto original para o parâmetro `previous`:
   ```abap
   CATCH cx_sy_zerodivide INTO DATA(lo_technical_ex).
     RAISE EXCEPTION TYPE zcx_pricing_calculation_error
       EXPORTING
         textid   = zcx_pricing_calculation_error=>division_by_zero
         previous = lo_technical_ex.
   ```
3. **Não Use `MESSAGE` do Tipo `X` (*Short Dump*):**  
   No ABAP Cloud, mensagens abortivas com terminação forçada (`MESSAGE x...`) violam o Clean Core. Toda falha deve ser comunicada por classes de exceção estruturadas, permitindo que a camada consumidora (como serviços OData do RAP) devolva uma resposta HTTP controlada.
