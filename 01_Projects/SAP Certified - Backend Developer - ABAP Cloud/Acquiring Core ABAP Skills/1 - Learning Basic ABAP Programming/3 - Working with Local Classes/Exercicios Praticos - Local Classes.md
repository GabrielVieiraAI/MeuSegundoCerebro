---
tipo: exercicios-praticos
tags:
  - sap
  - abap
  - abap-cloud
  - orientacao-a-objetos
  - classes-locais
  - estudo-ativo
modulo: 3
nome_modulo: "Working with Local Classes"
status: disponivel
data_criacao: 2026-10-29
---

# 🛠️ Exercícios Práticos: Módulo 3 - Working with Local Classes

> [!NOTE] Metodologia de Execução Rápida
> Todos os exercícios abaixo foram projetados para serem executados de forma rápida no **Eclipse ADT** (*ABAP Development Tools* — a IDE oficial de desenvolvimento SAP baseada em Eclipse).
> 
> **Setup de Execução:** Utilize a sua classe executável de testes (ex: `ZCL_##_LOCAL_CLASS` com a interface `IF_OO_ADT_CLASSRUN`).
> * Defina as classes locais na aba **Local Types** (barra inferior do editor).
> * Instancie e execute os métodos dentro do método `if_oo_adt_classrun~main` na aba **Global Class**.
> * Execute com **F9** para ver o resultado no console do Eclipse.

---

## 📋 Trilha Rápida de Exercícios

| # | Exercício | Princípios Praticados | Tempo Estimado |
| :-: | :--- | :--- | :--: |
| **01** | [[#Exercício 1: Esqueleto de Classe Local & Seletores\|Esqueleto & Seletores]] | `DEFINITION`, `IMPLEMENTATION`, `DATA` vs `CLASS-DATA`, seletores `->` e **`=>`** | 5 min |
| **02** | [[#Exercício 2: Assinaturas de Métodos & Método Funcional\|Métodos & Assinatura]] | `IMPORTING`, `EXPORTING`, `RETURNING VALUE(...)`, `me->`, chamadas inline | 7 min |
| **03** | [[#Exercício 3: Encapsulamento, Construtor & Exceções\|Encapsulamento & Construtor]] | Atributos privados, `READ-ONLY`, `CONSTRUCTOR`, `RAISING`, `TRY ... CATCH` | 8 min |
| **04** | [[#Exercício 4: Ponteiros de Memória & Tabela Interna de Objetos\|Ponteiros & Coleções]] | `TYPE REF TO`, cópia de ponteiro (`ref2 = ref1`), `TABLE OF REF TO`, `APPEND` | 6 min |
| **05** | [[#Exercício 5: Construtor Estático & Padrão Factory com CREATE PRIVATE\|Construtor Estático & Factory]] | `CLASS_CONSTRUCTOR`, `CREATE PRIVATE`, método estático de instanciação | 6 min |

---

## Exercício 1: Esqueleto de Classe Local & Seletores

### 🎯 Objetivo
Diferenciar na prática o comportamento de um **Atributo de Instância** (`DATA`) e de um **Atributo Estático** (`CLASS-DATA`), aplicando a regra de sintaxe dos seletores `->` e **`=>`**.

### 📝 Desafio Passo a Passo
1. Na aba **Local Types**, crie a classe local `lcl_item`:
   * Na `PUBLIC SECTION`, declare:
     * `item_name` do tipo `string` (instância).
     * `total_items` do tipo `i` (estático).
2. Na aba **Global Class** (método `main`):
   * Incremente `total_items` diretamente através do nome da classe (sem instanciar).
   * Crie uma instância com `NEW #( )`, atribua o nome `'Teclado'` a `item_name` e incremente `total_items`.
   * Crie uma segunda instância, atribua `'Mouse'` a `item_name` e incremente `total_items`.
   * Imprima os nomes de cada item e o valor final de `total_items`.

> [!TIP] Dica de Sintaxe
> Lembre-se: o seletor estático **`=>`** e o seletor de instância `->` **não aceitam espaços em branco** colados no símbolo.

> [!check]- Ver Solução Esperada
> **Aba Local Types:**
> ```abap
> CLASS lcl_item DEFINITION.
>   PUBLIC SECTION.
>     DATA item_name TYPE string.
>     CLASS-DATA total_items TYPE i.
> ENDCLASS.
> 
> CLASS lcl_item IMPLEMENTATION.
> ENDCLASS.
> ```
> 
> **Aba Global Class (`if_oo_adt_classrun~main`):**
> ```abap
> lcl_item=>total_items = lcl_item=>total_items + 1. " Acesso estático direto
> 
> DATA(item1) = NEW lcl_item( ).
> item1->item_name = 'Teclado'.
> lcl_item=>total_items = lcl_item=>total_items + 1.
> 
> DATA(item2) = NEW lcl_item( ).
> item2->item_name = 'Mouse'.
> lcl_item=>total_items = lcl_item=>total_items + 1.
> 
> out->write( |Item 1: { item1->item_name }| ).
> out->write( |Item 2: { item2->item_name }| ).
> out->write( |Total Geral de Itens: { lcl_item=>total_items }| ). " Saída esperada: 3
> ```

---

## Exercício 2: Assinaturas de Métodos & Método Funcional

### 🎯 Objetivo
Praticar parâmetros `IMPORTING`, `EXPORTING`, entender por que `IMPORTING` é protegido contra escrita, usar o pseudo-atributo `me->` e criar um **Método Funcional** para uso em expressões inline.

### 📝 Desafio Passo a Passo
1. Crie a classe `lcl_calculator` na aba **Local Types**:
   * Atributo de instância privado: `last_result` tipo `decfloat16`.
   * Método de instância tradicional `divide`:
     * Recebe `i_num1` e `i_num2` tipo `decfloat16` (`IMPORTING`).
     * Devolve `e_result` tipo `decfloat16` (`EXPORTING`).
     * Salva o resultado no atributo `me->last_result`.
   * Método de instância **funcional** `multiply`:
     * Recebe `i_num1` e `i_num2` tipo `decfloat16`.
     * Retorna o resultado via `RETURNING VALUE(r_result)` tipo `decfloat16`.
2. No método `main`:
   * Chame `divide` passando 10 e 2.
   * Chame `multiply` diretamente no lado direito de uma expressão inline com `DATA(calc) = ...`.

> [!check]- Ver Solução Esperada
> **Aba Local Types:**
> ```abap
> CLASS lcl_calculator DEFINITION.
>   PUBLIC SECTION.
>     METHODS divide
>       IMPORTING
>         i_num1   TYPE decfloat16
>         i_num2   TYPE decfloat16
>       EXPORTING
>         e_result TYPE decfloat16.
> 
>     METHODS multiply
>       IMPORTING
>         i_num1          TYPE decfloat16
>         i_num2          TYPE decfloat16
>       RETURNING
>         VALUE(r_result) TYPE decfloat16.
> 
>   PRIVATE SECTION.
>     DATA last_result TYPE decfloat16.
> ENDCLASS.
> 
> CLASS lcl_calculator IMPLEMENTATION.
>   METHOD divide.
>     e_result = i_num1 / i_num2.
>     me->last_result = e_result.
>   ENDMETHOD.
> 
>   METHOD multiply.
>     r_result = i_num1 * i_num2.
>     me->last_result = r_result.
>   ENDMETHOD.
> ENDCLASS.
> ```
> 
> **Aba Global Class (`if_oo_adt_classrun~main`):**
> ```abap
> DATA(calc) = NEW lcl_calculator( ).
> 
> " Chamada com parâmetro de exportação:
> calc->divide(
>   EXPORTING
>     i_num1   = 10
>     i_num2   = 2
>   IMPORTING
>     e_result = DATA(res_div)
> ).
> out->write( |Divisão: { res_div }| ).
> 
> " Chamada funcional direta (inline):
> DATA(res_mult) = calc->multiply( i_num1 = 4 i_num2 = 5 ).
> out->write( |Multiplicação: { res_mult }| ).
> ```

---

## Exercício 3: Encapsulamento, Construtor & Exceções

### 🎯 Objetivo
Blindar a consistência dos dados impedindo que um objeto nasça com valores inválidos através do **Construtor de Instância** (`CONSTRUCTOR`), uso da adição `READ-ONLY` e disparo de exceção com `RAISING`.

### 📝 Desafio Passo a Passo
1. Crie a classe `lcl_flight`:
   * Atributos públicos:
     * `carrier_id` tipo `string` `READ-ONLY`.
     * `connection_id` tipo `string` `READ-ONLY`.
   * Construtor de instância `constructor`:
     * Recebe `i_carrier_id` e `i_connection_id` (`IMPORTING`).
     * Dispara exceção via `RAISING cx_abap_invalid_value`.
     * Validação interna: se `i_carrier_id` ou `i_connection_id` forem vazios (`IS INITIAL`), dispare a exceção com `RAISE EXCEPTION NEW cx_abap_invalid_value( ).`.
2. No método `main`:
   * Tente instanciar com valores válidos dentro de um bloco `TRY ... CATCH`.
   * Tente instanciar um segundo objeto passando companhia aérea vazia `''`, tratando a exceção e confirmando que o programa não aborta com Short Dump.

> [!check]- Ver Solução Esperada
> **Aba Local Types:**
> ```abap
> CLASS lcl_flight DEFINITION.
>   PUBLIC SECTION.
>     DATA carrier_id    TYPE string READ-ONLY.
>     DATA connection_id TYPE string READ-ONLY.
> 
>     METHODS constructor
>       IMPORTING
>         i_carrier_id    TYPE string
>         i_connection_id TYPE string
>       RAISING
>         cx_abap_invalid_value.
> ENDCLASS.
> 
> CLASS lcl_flight IMPLEMENTATION.
>   METHOD constructor.
>     IF i_carrier_id IS INITIAL OR i_connection_id IS INITIAL.
>       RAISE EXCEPTION NEW cx_abap_invalid_value( ).
>     ENDIF.
> 
>     me->carrier_id    = i_carrier_id.
>     me->connection_id = i_connection_id.
>   ENDMETHOD.
> ENDCLASS.
> ```
> 
> **Aba Global Class (`if_oo_adt_classrun~main`):**
> ```abap
> " 1. Instanciação Válida
> TRY.
>     DATA(flight_ok) = NEW lcl_flight(
>       i_carrier_id    = 'LH'
>       i_connection_id = '0400'
>     ).
>     out->write( |Voo criado: { flight_ok->carrier_id } { flight_ok->connection_id }| ).
>   CATCH cx_abap_invalid_value.
>     out->write( 'Erro ao criar voo válido!' ).
> ENDTRY.
> 
> " 2. Instanciação Inválida (Dispara Exceção)
> TRY.
>     DATA(flight_error) = NEW lcl_flight(
>       i_carrier_id    = ''
>       i_connection_id = '0001'
>     ).
>   CATCH cx_abap_invalid_value.
>     out->write( 'Exceção capturada com sucesso: Companhia aérea não pode ser vazia.' ).
> ENDTRY.
> ```

---

## Exercício 4: Ponteiros de Memória & Tabela Interna de Objetos

### 🎯 Objetivo
Visualizar na prática que variáveis de referência guardam apenas endereços de memória, compreendendo a pegadinha da instrução `ref2 = ref1` e como coleções são mantidas vivas com `TYPE TABLE OF REF TO`.

### 📝 Desafio Passo a Passo
1. Crie a classe simples `lcl_passenger`:
   * Atributo público: `name` tipo `string`.
2. No método `main`:
   * **Parte A (Cópia de Referência):**
     * Crie `p1` com `NEW #( )` e defina `p1->name = 'Gabriel'`.
     * Declare `DATA(p2) = p1.`.
     * Altere `p2->name = 'Lucas'`.
     * Imprima `p1->name`. *(Observe: `p1->name` mudou para 'Lucas' porque ambos apontam para o mesmo objeto na memória!)*
   * **Parte B (Coleção em Tabela Interna):**
     * Declare uma tabela interna de objetos: `DATA lt_passengers TYPE TABLE OF REF TO lcl_passenger.`.
     * Adicione 3 passageiros distintos à tabela usando `APPEND NEW lcl_passenger( ) TO lt_passengers.`.
     * Percorra a tabela com `LOOP AT lt_passengers INTO DATA(ref_passenger)` e exiba os nomes.

> [!check]- Ver Solução Esperada
> **Aba Local Types:**
> ```abap
> CLASS lcl_passenger DEFINITION.
>   PUBLIC SECTION.
>     DATA name TYPE string.
> ENDCLASS.
> 
> CLASS lcl_passenger IMPLEMENTATION.
> ENDCLASS.
> ```
> 
> **Aba Global Class (`if_oo_adt_classrun~main`):**
> ```abap
> " PARTE A: Cópia de ponteiros
> DATA(p1) = NEW lcl_passenger( ).
> p1->name = 'Gabriel'.
> 
> DATA(p2) = p1. " p2 aponta para o MESMO objeto que p1
> p2->name = 'Lucas'.
> 
> out->write( |Nome via p1: { p1->name }| ). " Imprime 'Lucas'!
> 
> " PARTE B: Tabela Interna de Referências
> DATA lt_passengers TYPE TABLE OF REF TO lcl_passenger.
> 
> DATA(p_a) = NEW lcl_passenger( ). p_a->name = 'Ana'.    APPEND p_a TO lt_passengers.
> DATA(p_b) = NEW lcl_passenger( ). p_b->name = 'Bruno'.  APPEND p_b TO lt_passengers.
> DATA(p_c) = NEW lcl_passenger( ). p_c->name = 'Carlos'. APPEND p_c TO lt_passengers.
> 
> out->write( |Total na lista: { lines( lt_passengers ) }| ).
> 
> LOOP AT lt_passengers INTO DATA(ref_p).
>   out->write( |Passageiro da lista: { ref_p->name }| ).
> ENDLOOP.
> ```

---

## Exercício 5: Construtor Estático & Padrão Factory com CREATE PRIVATE

### 🎯 Objetivo
Dominar o ciclo de vida do **Construtor Estático** (`CLASS_CONSTRUCTOR`), que roda automaticamente no primeiro acesso à classe, e aplicar a cláusula `CREATE PRIVATE` com um método de fábrica (*Factory Method*).

### 📝 Desafio Passo a Passo
1. Crie a classe `lcl_singleton_config` com a cláusula `CREATE PRIVATE`:
   * Atributos estáticos:
     * `system_env` tipo `string` `READ-ONLY`.
     * `init_timestamp` tipo `string` `READ-ONLY`.
   * Construtor estático `CLASS_CONSTRUCTOR`:
     * Define `system_env = 'S/4HANA Cloud (Clean Core)'`.
     * Define `init_timestamp = 'Inicializado com sucesso'`.
   * Método estático `get_environment`:
     * Retorna o valor de `system_env` via `RETURNING VALUE(r_env) TYPE string`.
2. No método `main`:
   * Chame o método estático `lcl_singleton_config=>get_environment( )`.
   * Observe que o construtor estático foi disparado sem que nenhuma instância precisasse ser criada!

> [!check]- Ver Solução Esperada
> **Aba Local Types:**
> ```abap
> CLASS lcl_singleton_config DEFINITION CREATE PRIVATE.
>   PUBLIC SECTION.
>     CLASS-DATA system_env     TYPE string READ-ONLY.
>     CLASS-DATA init_timestamp TYPE string READ-ONLY.
> 
>     CLASS-METHODS class_constructor.
>     CLASS-METHODS get_environment
>       RETURNING
>         VALUE(r_env) TYPE string.
> ENDCLASS.
> 
> CLASS lcl_singleton_config IMPLEMENTATION.
>   METHOD class_constructor.
>     system_env     = 'S/4HANA Cloud (Clean Core)'.
>     init_timestamp = 'Executado automaticamente no primeiro acesso'.
>   ENDMETHOD.
> 
>   METHOD get_environment.
>     r_env = system_env.
>   ENDMETHOD.
> ENDCLASS.
> ```
> 
> **Aba Global Class (`if_oo_adt_classrun~main`):**
> ```abap
> " O primeiro acesso dispara automaticamente o CLASS_CONSTRUCTOR:
> DATA(env) = lcl_singleton_config=>get_environment( ).
> 
> out->write( |Ambiente: { env }| ).
> out->write( |Status: { lcl_singleton_config=>init_timestamp }| ).
> ```

---

## 🔗 Conexões com o Segundo Cérebro
* [[01_Projects/SAP Certified - Backend Developer - ABAP Cloud/Acquiring Core ABAP Skills/1 - Learning Basic ABAP Programming/3 - Working with Local Classes/Revisao Ativa|Revisao Ativa - Módulo 3]]
* [[01_Projects/SAP Certified - Backend Developer - ABAP Cloud/Acquiring Core ABAP Skills/1 - Learning Basic ABAP Programming/Flashcards/Flashcards - Modulo 03 - Working with Local Classes|Flashcards - Módulo 3]]
* [[Clean Core]]
* [[Orientao a Objetos no ABAP|Orientação a Objetos no ABAP]]
