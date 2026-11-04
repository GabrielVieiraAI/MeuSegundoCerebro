---
tipo: clippings
source: "https://learning.sap.com/courses/deepening-your-abap-programming-knowledge"
created: 2026-11-03
tags:
  - sap
  - abap
  - abap-cloud
  - orientacao-a-objetos
  - polimorfismo
  - casting
---

# 2 - Using Inheritance

> [!NOTE] Conexão com o Guia de Estudos
> Esta lição compõe o **Módulo 07: Designing Effective Object-Oriented Code** da jornada oficial *Deepening Your ABAP Programming Knowledge*. Consulte o [[Roteiro de Estudos SAP]] para o planejamento completo.

---

## 1. Polimorfismo e Tipos Estáticos vs. Dinâmicos

A maior vantagem da herança na engenharia de software é o **Polimorfismo** (*Polymorphism* — "muitas formas"). Ele permite que objetos de diferentes subclasses especializadas sejam manipulados de maneira uniforme através de uma referência comum de sua superclasse.

Para dominar o polimorfismo no ABAP, é indispensável entender a distinção entre:

1. **Tipo Estático (*Static Type*):**
   - É o tipo declarado em tempo de compilação na definição da variável de referência (ex: `DATA lo_vehicle TYPE REF TO lcl_vehicle`).
   - O tipo estático define **o que o compilador permite acessar**: você só pode chamar métodos e atributos que existam na classe `lcl_vehicle`.
2. **Tipo Dinâmico (*Dynamic Type*):**
   - É o tipo real da instância que reside na memória em tempo de execução (ex: um objeto de `lcl_truck` ou `lcl_bus`).
   - O tipo dinâmico define **qual implementação de código será executada** quando um método redefinido for invocado (*ligação dinâmica / dynamic binding*).

```
lo_vehicle (Tipo Estático: lcl_vehicle)
    │
    ▼ aponta em tempo de execução para:
[ Instância em Memória: lcl_truck ] (Tipo Dinâmico: lcl_truck)
```

> [!TIP] Diagrama de Polimorfismo e Casting
> Visualize a relação entre tipos estáticos, dinâmicos e conversões em: ![[Polimorfismo_Casting_ABAP.excalidraw]]

---

## 2. Narrowing Cast (Upcast)

O **Narrowing Cast** (ou *Upcast*) ocorre quando atribuímos uma referência de uma **subclasse** para uma variável de referência da sua **superclasse**:

```abap
DATA: lo_vehicle TYPE REF TO lcl_vehicle,
      lo_truck   TYPE REF TO lcl_truck.

lo_truck = NEW lcl_truck( ).

" Narrowing Cast (Upcast) - Atribuição padrão
lo_vehicle = lo_truck.
```

### Por que o termo "Narrowing" (Estreitamento)?
Embora a instância subjacente em memória continue sendo um caminhão completo (`lcl_truck`), a sua **visão** através da variável `lo_vehicle` é restrita ("estreitada") unicamente aos componentes da superclasse `lcl_vehicle`. O compilador bloqueia chamadas a métodos específicos do caminhão (como `load_cargo`).

### Características:
- **Segurança Absoluta:** O compilador valida isso com 100% de certeza em tempo de compilação, pois todo caminhão *é-um* veículo (*is-a relationship*).
- **Sintaxe Implícita:** Não exige operadores especiais; uma simples atribuição `=` é suficiente.

---

## 3. Widening Cast (Downcast)

O **Widening Cast** (ou *Downcast*) ocorre quando queremos recuperar a referência detalhada da subclasse a partir de uma variável genérica da superclasse:

```abap
DATA: lo_vehicle TYPE REF TO lcl_vehicle,
      lo_truck   TYPE REF TO lcl_truck.

lo_vehicle = NEW lcl_truck( ).

" Widening Cast (Downcast)
" 1. Sintaxe Clássica:
lo_truck ?= lo_vehicle.

" 2. Sintaxe Moderna (Operador CAST):
lo_truck = CAST #( lo_vehicle ).
```

### Por que o termo "Widening" (Alargamento)?
Você está expandindo ("alargando") a visão de volta para os componentes específicos da subclasse, permitindo acesso novamente a métodos exclusivos como `lo_truck->load_cargo( )`.

### O Risco do Downcast e a Exceção `CX_SY_MOVE_CAST_ERROR`:
O compilador não tem como prever em tempo de compilação o que estará dentro de `lo_vehicle` em tempo de execução. Se `lo_vehicle` contiver um objeto de outra classe (por exemplo, `lcl_bus`) ou estiver apontando para `INITIAL`, a atribuição falhará em tempo de execução gerando a exceção **`CX_SY_MOVE_CAST_ERROR`** (ou um *short dump* fatal se não for tratada).

---

## 4. Verificação Segura de Tipos (`IS INSTANCE OF` e `CASE TYPE OF`)

No ABAP moderno (7.40+), você não precisa envolver todo downcast em blocos pesados de `TRY ... CATCH cx_sy_move_cast_error`. A linguagem fornece construções declarativas e limpas:

### A. Predicado `IS INSTANCE OF`
Permite testar o tipo dinâmico antes de tentar a conversão:

```abap
IF lo_vehicle IS INSTANCE OF lcl_truck.
  " Conversão garantidamente segura:
  DATA(lo_truck) = CAST lcl_truck( lo_vehicle ).
  lo_truck->load_cargo( iv_weight = 3000 ).
ELSE.
  out->write( 'O objeto não é um caminhão!' ).
ENDIF.
```

### B. Estrutura `CASE TYPE OF`
Ideal para cenários onde uma superclasse tem múltiplas subclasses e você precisa tratar cada uma de forma especializada:

```abap
CASE TYPE OF lo_vehicle.
  WHEN TYPE lcl_truck INTO DATA(lo_truck).
    lo_truck->load_cargo( iv_weight = 5000 ).

  WHEN TYPE lcl_bus INTO DATA(lo_bus).
    lo_bus->board_passengers( iv_passengers = 35 ).

  WHEN OTHERS.
    out->write( 'Veículo não especializado.' ).
ENDCASE.
```
> [!NOTE] Vantagem do `INTO DATA(...)`
> O comando `WHEN TYPE ... INTO DATA(...)` já realiza o *downcast* e declara a variável com o tipo correto automaticamente, eliminando a necessidade de chamar o operador `CAST` manualmente.

---

## 5. Polimorfismo na Prática: Coleções Polimórficas

Uma das aplicações mais comuns do polimorfismo é processar coleções de objetos distintos em um único loop, delegando a cada objeto a responsabilidade pela sua própria execução:

```abap
" Tabela interna contendo referências genéricas da superclasse
DATA lt_fleet TYPE STANDARD TABLE OF REF TO lcl_vehicle WITH EMPTY KEY.

" Povoamento heterogêneo (Upcast implícito)
lt_fleet = VALUE #(
  ( NEW lcl_truck( iv_model = 'Volvo FH' iv_weight = 12000 ) )
  ( NEW lcl_bus( iv_model = 'Mercedes Tourismo' iv_seats = 50 ) )
  ( NEW lcl_truck( iv_model = 'Scania R500' iv_weight = 18000 ) )
).

" Execução polimórfica uniforme
LOOP AT lt_fleet INTO DATA(lo_current_vehicle).
  " A chamada dispara a versão redefinida correspondente a cada tipo real!
  out->write( lo_current_vehicle->describe_vehicle( ) ).
ENDLOOP.
```

### Resumo Comparativo: Upcast vs. Downcast

| Critério | Narrowing Cast (Upcast) | Widening Cast (Downcast) |
| :--- | :--- | :--- |
| **Sentido** | Subclasse **`**=>**`** Superclasse | Superclasse **`**=>**`** Subclasse |
| **Operador** | `=` (ou `CAST`) | `?=` ou `CAST #( )` |
| **Validação** | Em tempo de **compilação** (estático) | Em tempo de **execução** (dinâmico) |
| **Risco de Erro** | Risco zero (100% seguro) | Risco de `CX_SY_MOVE_CAST_ERROR` |
| **Uso Comum** | Guardar em listas genéricas | Acessar métodos específicos do filho |
