---
tipo: clippings
source: "https://learning.sap.com/courses/deepening-your-abap-programming-knowledge"
created: 2026-11-03
tags:
  - sap
  - abap
  - abap-cloud
  - orientacao-a-objetos
  - interfaces
  - casting
---

# 4 - Using Interfaces

> [!NOTE] Conexão com o Guia de Estudos
> Esta lição compõe o **Módulo 07: Designing Effective Object-Oriented Code** da jornada oficial *Deepening Your ABAP Programming Knowledge*. Consulte o [[Roteiro de Estudos SAP]] para o planejamento completo.

---

## 1. Implementando uma Interface em uma Classe

Para que uma classe adote um contrato definido por uma interface, ela deve declarar a instrução `INTERFACES <nome_da_interface>` em sua seção pública (`PUBLIC SECTION`):

```abap
CLASS lcl_console_logger DEFINITION.
  PUBLIC SECTION.
    INTERFACES zif_log_writer.
ENDCLASS.

CLASS lcl_console_logger IMPLEMENTATION.
  " Toda implementação de método de interface exige o seletor til (~)
  METHOD zif_log_writer~write_log.
    " Lógica para registrar o log no console
  ENDMETHOD.

  METHOD zif_log_writer~get_entries.
    " Lógica para retornar as entradas registradas
  ENDMETHOD.
ENDCLASS.
```

### Regras Mandatórias de Implementação:
1. **Obrigação Contratual:** A classe que implementa a interface **deve** implementar **todos** os métodos declarados nela (a menos que a própria classe seja declarada como `ABSTRACT`).
2. **O Seletor de Componente Til (`~`):** No bloco de implementação da classe (`IMPLEMENTATION`), o nome do método é obrigatoriamente prefixado com o nome da interface e o til: `<nome_interface>~<nome_metodo>`.

---

## 2. As Duas Formas de Consumir Componentes de Interface

Existem duas maneiras arquiteturais de consumir métodos e atributos de uma interface:

### Forma 1: Através de uma Referência de Classe (*Class Reference*)
A variável é tipada apontando diretamente para a classe concreta:

```abap
DATA lo_logger TYPE REF TO lcl_console_logger.
lo_logger = NEW lcl_console_logger( ).

" Para chamar o método, o prefixo com til (~) é obrigatório:
lo_logger->zif_log_writer~write_log( is_entry = ... ).
```
- **Visibilidade:** O consumidor enxerga **todos** os métodos da classe concreta, além dos métodos da interface (prefixados com `~`).

---

### Forma 2: Através de uma Referência de Interface (*Interface Reference*) — **Recomendada**
A variável é tipada diretamente com o tipo da interface:

```abap
" Variável tipada com a interface:
DATA lo_writer TYPE REF TO zif_log_writer.

" Instanciação da classe concreta atribuída à interface (Narrowing Cast implícito):
lo_writer = NEW lcl_console_logger( ).

" Chamada direta sem prefixo de til!
lo_writer->write_log( is_entry = ... ).
```
- **Visibilidade Estrita:** O consumidor **só enxerga** os métodos previstos no contrato da interface `zif_log_writer`. Quaisquer métodos internos da classe `lcl_console_logger` ficam invisíveis.
- **Código Limpo:** A sintaxe dispensa o seletor `~`, tornando o código muito mais legível e padronizado.

> [!TIP] Diagrama do Consumo de Interfaces
> Veja como a visão do consumidor muda dependendo do tipo estático em: ![[Consumo_Interfaces_ABAP.excalidraw]]

---

## 3. Casting com Interfaces

A relação entre uma classe e uma interface funciona de forma idêntica à relação entre subclasse e superclasse:

### A. Narrowing Cast (Upcast) para Interface
- Atribuir uma referência de classe concreta para uma referência de interface.
- É **implícito** e 100% seguro em tempo de compilação:
```abap
DATA lo_ticket TYPE REF TO lcl_flight_ticket.
DATA lo_printable TYPE REF TO zif_printable.

lo_ticket = NEW lcl_flight_ticket( ).
lo_printable = lo_ticket. " Narrowing Cast implícito
```

### B. Widening Cast (Downcast) a partir de Interface
- Atribuir uma referência genérica de interface de volta para uma referência de classe concreta.
- Exige o operador **`CAST`** ou **`?=`**:
```abap
" Se lo_printable contiver de fato um lcl_flight_ticket:
DATA(lo_ticket_recuperado) = CAST lcl_flight_ticket( lo_printable ).

" Verificação segura com IS INSTANCE OF:
IF lo_printable IS INSTANCE OF lcl_flight_ticket.
  DATA(lo_safe_ticket) = CAST lcl_flight_ticket( lo_printable ).
  lo_safe_ticket->calculate_taxes( ).
ENDIF.
```

---

## 4. O Recurso de Atalho: Aliases (`ALIASES`)

Para evitar a digitação repetitiva do nome da interface com o til (`zif_log_writer~write_log`) quando se utiliza uma referência de classe ou dentro da própria implementação, o ABAP oferece a instrução **`ALIASES`**:

```abap
CLASS lcl_console_logger DEFINITION.
  PUBLIC SECTION.
    INTERFACES zif_log_writer.

    " Define um apelido amigável no escopo da classe:
    ALIASES write_log FOR zif_log_writer~write_log.
ENDCLASS.

CLASS lcl_console_logger IMPLEMENTATION.
  " Agora você pode usar o alias diretamente no código:
  METHOD zif_log_writer~write_log.
    " Implementação
  ENDMETHOD.
ENDCLASS.

" No código consumidor com referência de classe:
DATA(lo_log) = NEW lcl_console_logger( ).
lo_log->write_log( is_entry = ... ). " Não precisa de til!
```

---

## 5. Polimorfismo Baseado em Interfaces

Diferente da herança, onde as classes devem pertencer à mesma árvore genealógica, interfaces permitem criar coleções polimórficas de **classes completamente heterogêneas**:

```abap
" Coleção de objetos que sabem se imprimir:
DATA lt_print_queue TYPE STANDARD TABLE OF REF TO zif_printable WITH EMPTY KEY.

lt_print_queue = VALUE #(
  ( NEW lcl_flight_ticket( iv_ticket_no = 'T1001' ) )
  ( NEW lcl_cargo_manifest( iv_manifest_id = 'M992' ) )
  ( NEW lcl_boarding_pass( iv_seat = '12A' ) )
).

" Disparo uniforme do contrato:
LOOP AT lt_print_queue INTO DATA(lo_item).
  lo_item->print_document( ).
ENDLOOP.
```

### Quadro Comparativo: Herança vs. Interfaces

| Característica | Herança (`INHERITING FROM`) | Interfaces (`INTERFACES`) |
| :--- | :--- | :--- |
| **Relacionamento** | É-um (*is-a*) | Comporta-se como (*acts-as / can-do*) |
| **Multiplicidade** | **Simples apenas** (1 superclasse direta) | **Múltipla** (várias interfaces por classe) |
| **Implementação de Código** | A superclasse pode fornecer lógica pronta | **Apenas assinatura** (nenhum código pronto) |
| **Seções de Visibilidade** | `PUBLIC`, `PROTECTED`, `PRIVATE` | **Apenas `PUBLIC`** (implícito) |
| **Acoplamento** | Acoplamento forte entre classes | **Acoplamento fraco** (alta flexibilidade) |
