---
tipo: clippings
title: "Defining CDS Views with Input Parameters"
source: "https://learning.sap.com/courses/building-data-models-with-the-abap-dictionary-and-abap-core-data-services/defining-cds-views-with-input-parameters_bccd42ca-1dcb-4dfa-9ca7-903d4030e855"
created: 2026-11-03
tags:
  - sap
  - abap
  - abap-cloud
  - cds
  - input-parameters
  - system-fields
  - abap-sql
  - data-preview
---
**Roteiro de Estudos Relacionado:** [[Roteiro de Estudos SAP]]

# Objetivos de Aprendizado

Após concluir esta lição, você será capaz de:
- Compreender a motivação arquitetural para a utilização de **Parâmetros de Entrada** (*Input Parameters*) em CDS Views.
- Declarar parâmetros de entrada na cláusula `WITH PARAMETERS` tipificados com tipos elementares ou Data Elements.
- Acessar parâmetros em todas as posições de operando válidas utilizando o prefixo **`$parameters.`**.
- Fornecer valores de parâmetros em ferramentas de teste (*Data Preview*), em visões sobre visões (*View-on-View*) e em instruções `SELECT` do **ABAP SQL**.
- Vincular parâmetros a campos de sistema ABAP através da anotação `@Environment.systemField`.

---

# 1. Por que utilizar Parâmetros de Entrada?

Ao realizar cálculos sofisticados na camada de banco de dados, frequentemente o consumidor da visão necessita influenciar dinamicamente como esse processamento é executado. A cláusula `WHERE` do SQL apenas filtra os dados após o cálculo, mas não permite injetar variáveis no cálculo em si.

![[Input_Parameter_Declaration_001.png]]

Os **Parâmetros de Entrada** (*Input Parameters*) preenchem essa lacuna fundamental. Casos de uso típicos:
- **Moeda Alvo Dinâmica:** O consumidor define em tempo de execução para qual moeda o relatório financeiro deve ser convertido.
- **Data de Corte / Posição:** Definir uma data limite para cálculos de saldo, faturamento acumulado ou tempo de casa.
- **Filtros Obrigatórios:** Em SQL clássico, condições na cláusula `WHERE` são sempre opcionais para o chamador. Com um parâmetro de entrada, a CDS View **força o consumidor** a fornecer um critério indispensável de negócio (como idioma, código de filial ou data de avaliação) antes que a consulta seja executada.

---

# 2. Declaração de Parâmetros de Entrada

Os parâmetros são declarados na cláusula **`WITH PARAMETERS`**, posicionada imediatamente após o nome da CDS View Entity e antes da cláusula `AS SELECT FROM`:

![[Input_Parameter_Declaration_002.png]]

```abap
define view entity Z##_C_EmployeeQueryP
  with parameters
    p_target_curr : /dmo/currency_code,
    @EndUserText.label: 'Date of evaluation'
    p_date        : abap.dats
  as select from Z##_R_Employee
```

### Regras de Declaração e Tipagem:
- **Lista Separada por Vírgulas:** Cada parâmetro possui um nome próprio e um tipo, separados por dois pontos (`:`).
- **Tipagem Estritamente Elementar:** O tipo deve ser um tipo de dicionário predefinido (com prefixo `abap.`, como `abap.dats`, `abap.cuky`, `abap.char(10)`) ou um **Data Element** global do dicionário.
- **Proibições:** Estruturas, tabelas internas e referências a objetos **não** são permitidas como parâmetros de CDS.

---

# 3. Posições de Operando Válidas no Código CDS

Para consumir o valor de um parâmetro dentro da própria CDS View Entity, utiliza-se o prefixo **`$parameters.`** seguido do nome do parâmetro.

![[03_AccessToParameters_001.png]]

O parâmetro pode ser utilizado em múltiplas posições sintáticas:

| Posição de Operando | Exemplo de Aplicação Prática | Imagem |
| :--- | :--- | :--- |
| **Projeção Direta** | Projetado como uma coluna na lista de elementos para servir de referência em anotações `@Semantics`. | ![[03_AccessToParameters_002.png]] |
| **Expressões CASE** | Utilizado em ramificações condicionais para alternar lógicas de cálculo com base na escolha do usuário. | ![[03_AccessToParameters_003.png]] |
| **Funções Integradas** | Passado como argumento para funções como `currency_conversion`, `division` ou `concat`. | ![[03_AccessToParameters_004.png]] |
| **Filtros de Caminho** | Inserido em colchetes de associações filtradas: `_Text[ Language = $parameters.p_lang ]`. | ![[03_AccessToParameters_005.png]] |
| **Cláusula WHERE** | Utilizado no lado direito de comparações para forçar restrições obrigatórias de seleção. | ![[03_AccessToParameters_006.png]] |

---

# 4. Fornecimento de Valores para Parâmetros

### 1. No Data Preview do ADT
Ao pressionar **F8** em uma CDS View parametrizada, o Eclipse ADT exibe uma janela modal exigindo o preenchimento de todos os parâmetros obrigatórios (identificados com um asterisco `*`) antes de liberar a visualização dos dados:

![[Input_Parameters_in_Data_Preview_001.png]]

---

### 2. Em Visões sobre Visões (*View-on-View*)
Ao consumir uma visão com parâmetros na cláusula `FROM`, deve-se passar a lista de valores entre parênteses utilizando o operador **dois-pontos (`:`)**:

![[Input_Parameters_in_CDS_DDL_001.png]]

```abap
// Exemplo em CDS DDL (repassando parâmetros superiores - Parameter Forwarding):
as select from Z##_C_EmployeeQueryP(
  p_target_curr : $parameters.p_target_curr,
  p_date        : $parameters.p_date
)
```

---

### 3. No ABAP SQL Moderno
Em comandos `SELECT` no código ABAP, os parâmetros são informados entre parênteses utilizando o **operador de igualdade (`=`)**:

![[Input_Parameters_in_ABAP_SQL_001.png]]

```abap
SELECT FROM Z##_C_EmployeeQueryP(
         p_target_curr = 'USD',
         p_date        = @sy-datum )
  FIELDS employeeid,
         MonthlySalaryConverted
  INTO TABLE @DATA(result).
```

- **Literais:** Literais diretos de texto ou números.
- **Variáveis Host:** Variáveis ou constantes ABAP precedidas de arroba (ex: `@sy-datum`, `@lv_currency`).
- **Expressões Host:** Expressões ABAP completas entre parênteses precedidas de arroba (ex: `@( cl_abap_context_info=>get_system_date( ) )`).

---

# 5. Demonstrações em Vídeo

### Vídeo 1: How to Define and Use a CDS View with an Input Parameter
Assista ao fluxo de inclusão de parâmetros, substituição de literais hard-coded e consumo no Data Preview:

<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%;">
  <iframe 
    src="https://cdnapisec.kaltura.com/p/1926081/sp/192608100/embedIframeJs/uiconf_id/27230482/partner_id/1926081?iframeembed=true&playerId=kaltura_player&entry_id=1_ji7xd8fj" 
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;" 
    allowfullscreen 
    webkitallowfullscreen 
    mozAllowFullScreen 
    allow="autoplay *; fullscreen *; encrypted-media *" 
    title="How to Define and Use a CDS View with an Input Parameter">
  </iframe>
</div>

---

# 6. Vinculação com Campos de Sistema: `@Environment.systemField`

Para automatizar o preenchimento de parâmetros que representam variáveis de sistema em chamadas ABAP, a SAP disponibiliza a anotação **`@Environment.systemField`**:

![[Default_Value_for_Parameters_in_Open_SQL_001.png]]

```abap
with parameters
  p_target_curr : /dmo/currency_code,
  @Environment.systemField: #SYSTEM_DATE
  p_date        : abap.dats
```

Quando um parâmetro recebe essa anotação:
- No código **ABAP SQL**, a passagem do parâmetro torna-se **opcional**: se omitido, o runtime ABAP preenche o parâmetro automaticamente com o valor do respectivo campo de sistema (como `sy-datum` ou `sy-langu`).
- No entanto, a nível de definição de banco de dados e CDS, o parâmetro continua tecnicamente obrigatório.

![[Default_Value_for_Parameters_in_Open_SQL_002.png]]

Valores suportados para `@Environment.systemField`:
- `#SYSTEM_DATE` (`sy-datum`)
- `#SYSTEM_TIME` (`sy-uzeit`)
- `#SYSTEM_LANGUAGE` (`sy-langu`)
- `#CLIENT` (`sy-mandt`)
- `#USER` (`sy-uname`)

---

### Vídeo 2: How to Access an ABAP System Field in ABAP CDS

Veja a comparação ao vivo entre variáveis de sessão (`$session.system_date`) e a vinculação de parâmetros de entrada via `@Environment.systemField: #SYSTEM_DATE`:

<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%;">
  <iframe 
    src="https://cdnapisec.kaltura.com/p/1926081/sp/192608100/embedIframeJs/uiconf_id/27230482/partner_id/1926081?iframeembed=true&playerId=kaltura_player&entry_id=1_zkqqg1rt" 
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;" 
    allowfullscreen 
    webkitallowfullscreen 
    mozAllowFullScreen 
    allow="autoplay *; fullscreen *; encrypted-media *" 
    title="How to Access an ABAP System Field in ABAP CDS">
  </iframe>
</div>

---

# 7. Exercício Prático: Definindo Parâmetros de Entrada (*Hands-on*)

### Objetivos do Exercício
1. Duplicar `Z##_C_EmployeeQuery` para criar a versão parametrizada **`Z##_C_EmployeeQueryP`**.
2. Declarar os parâmetros `p_target_curr` e `p_date`, substituindo as variáveis de sessão e literais hard-coded anteriores.
3. Consumir a nova visão parametrizada através de uma classe ABAP executável (**`ZCL_##_PARAMETER`**).
4. Anotar o parâmetro de data com `@Environment.systemField: #SYSTEM_DATE` e comprovar o preenchimento automático no ABAP SQL.

- **Objetos de Referência da SAP:**
  - `/LRN/C_EMPLOYEE_PAR` (Solução CDS com parâmetros)
  - `/LRN/CL_S4D430_CPS_PARAMETER` (Solução da classe ABAP)

---

### Tarefa 1: Criar a CDS View Parametrizada (`Z##_C_EmployeeQueryP`)

1. No ADT, clique com o botão direito em `Z##_C_EmployeeQuery` $\rightarrow$ **Duplicate...**.
2. Nome: **`Z##_C_EmployeeQueryP`** | Descrição: **`Employee (Query with Parameters)`**.
3. Adicione a cláusula `with parameters` logo após o nome da entidade:

```abap
@AccessControl.authorizationCheck: #NOT_REQUIRED
@EndUserText.label: 'Employee (Query with Parameters)'
@Metadata.ignorePropagatedAnnotations: true
@ObjectModel.usageType:{
  serviceQuality: #D,
  sizeCategory:   #M,
  dataClass:      #MASTER
}
define view entity Z##_C_EmployeeQueryP
  with parameters
    p_target_curr : /dmo/currency_code,
    @EndUserText.label: 'Date of evaluation'
    @Environment.systemField: #SYSTEM_DATE
    p_date        : abap.dats
  as select from Z##_R_Employee
{
  key EmployeeId,
      FirstName,
      LastName,
      DepartmentId,

      _Department.Description                  as DepartmentDescription,
      concat_with_space( _Department._Assistant.FirstName,
                         _Department._Assistant.LastName,
                         1 )                   as AssistantName,

      @EndUserText.label: 'Employee Role'
      case EmployeeId
        when _Department.HeadId      then 'H'
        when _Department.AssistantId then 'A'
        else ' '
      end                                      as EmployeeRole,

      @EndUserText.label: 'Annual Salary'
      @Semantics.amount.currencyCode: 'CurrencyCode'
      currency_conversion( amount             => AnnualSalary,
                           source_currency    => CurrencyCode,
                           target_currency    => $parameters.p_target_curr,
                           exchange_rate_date => $parameters.p_date
                         )                     as AnnualSalaryConverted,

      @EndUserText.label: 'Monthly Salary'
      @Semantics.amount.currencyCode: 'CurrencyCode'
      cast( $projection.AnnualSalaryConverted as abap.fltp ) 
      / 12.0                                   as MonthlySalaryConverted,

      $parameters.p_target_curr                as CurrencyCode,

      division( dats_days_between( EntryDate,
                                   $parameters.p_date ),
                365,
                1 )                            as CompanyAffiliation,

      /* Associações */
      _Department
}
```

4. Salve e ative (**Ctrl + F3**). Pressione **F8** para testar no Data Preview informando a moeda alvo (ex: `EUR`).

---

### Tarefa 2: Consumir no ABAP SQL (`ZCL_##_PARAMETER`)

1. Duplique a classe `ZCL_##_PATH_EXP` para **`ZCL_##_PARAMETER`**.
2. No método `main`, ajuste o comando `SELECT` passando os parâmetros com a sintaxe do ABAP SQL:

```abap
CLASS zcl_##_parameter DEFINITION
  PUBLIC
  FINAL
  CREATE PUBLIC.

  PUBLIC SECTION.
    INTERFACES if_oo_adt_classrun.
  PROTECTED SECTION.
  PRIVATE SECTION.
ENDCLASS.

CLASS zcl_##_parameter IMPLEMENTATION.
  METHOD if_oo_adt_classrun~main.

    SELECT
      FROM z##_c_employeequeryp(
             p_target_curr = 'JPY'
             " p_date é opcional no ABAP SQL devido à anotação @Environment.systemField: #SYSTEM_DATE
           )
      FIELDS employeeid,
             firstname,
             lastname,
             departmentid,
             departmentdescription,
             assistantname,
             \_department\_head-lastname AS headname,
             MonthlySalaryConverted,
             CurrencyCode,
             CompanyAffiliation
      INTO TABLE @DATA(result).

    out->write( data = result
                name = 'Resultado da Consulta Parametrizada em JPY' ).

  ENDMETHOD.
ENDCLASS.
```

3. Ative (**Ctrl + F3**) e execute a classe (**F9**). Verifique no console que a data do sistema foi assumida automaticamente e todos os salários foram convertidos com sucesso para ienes japoneses (`JPY`)!
