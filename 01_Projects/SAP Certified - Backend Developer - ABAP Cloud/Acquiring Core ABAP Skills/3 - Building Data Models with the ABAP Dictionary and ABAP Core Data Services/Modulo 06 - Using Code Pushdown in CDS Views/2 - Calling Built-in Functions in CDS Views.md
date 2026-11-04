---
tipo: clippings
title: "Calling Built-in Functions in CDS Views"
source: "https://learning.sap.com/courses/building-data-models-with-the-abap-dictionary-and-abap-core-data-services/calling-built-in-functions-in-cds-views_ea117751-e9eb-45f0-bd46-8abb62f578dd"
created: 2026-11-03
tags:
  - sap
  - abap
  - abap-cloud
  - cds
  - built-in-functions
  - string-functions
  - date-functions
  - currency-conversion
  - session-variables
---
**Roteiro de Estudos Relacionado:** [[Roteiro de Estudos SAP]]

# Objetivos de Aprendizado

Após concluir esta lição, você será capaz de:
- Identificar a disponibilidade de funções integradas (*Built-in Functions*) no ABAP CDS comparando com o ABAP SQL.
- Executar manipulações de texto utilizando funções de string como `concat_with_space(...)`.
- Calcular intervalos de tempo com funções de data específicas de tipo como `dats_days_between(...)` e divisões decimais com `division(...)`.
- Realizar conversões cambiais no banco de dados através da função avançada `currency_conversion(...)`.
- Acessar variáveis de ambiente do sistema através de variáveis de sessão (*Session Variables*) como `$session.system_date` e `$session.system_language`.

---

# 1. Visão Geral das Funções Integradas no ABAP CDS

Nem todas as funções SQL nativas disponíveis no ABAP SQL podem ser chamadas dentro de uma definição de CDS View Entity. Compreender esse escopo é essencial para a certificação e para o design arquitetural:

![[01FunctionsinCDSOverview_001.png]]
![[01FunctionsinCDSOverview_002.png]]

### Panorama por Categoria:

1. **Funções Numéricas:**  
   Possuem paridade total! Todas as funções numéricas do ABAP SQL (como `abs()`, `ceil()`, `floor()`, `round()`, `division()`) são 100% suportadas no ABAP CDS.
2. **Processamento de Strings:**  
   A grande maioria é suportada (`concat()`, `concat_with_space()`, `length()`, `lower()`, `upper()`, `lpad()`, `rpad()`, `replace()`, etc.). Apenas algumas funções avançadas baseadas em expressões regulares (*RegEx*) permanecem exclusivas do ABAP SQL.
3. **Processamento de Data e Hora (*Date and Time Processing*):**  
   Aqui reside a maior diferença arquitetural:
   - As funções genéricas (como `is_valid()`, `add_days()`, `days_between()`) são exclusivas do ABAP SQL.
   - No **ABAP CDS**, você deve utilizar obrigatoriamente as **funções específicas de tipo de dicionário**, com prefixos explícitos: `DATS_*`, `DATN_*`, `TIMS_*`, `TIMN_*`, `TSTMP_*`. (Exemplo: `dats_days_between()`, `dats_add_days()`).
   - Funções de extração de partes de data (como `WEEKDAY()`, `EXTRACT_MONTH()`) **não** estão disponíveis no CDS DDL.

---

# 2. Funções de Conversão: Moedas e Unidades

Cálculos financeiros exigem conversão cambial dinâmica com base em tabelas de taxas de câmbio (tabelas TCUR*). A função `currency_conversion(...)` executa essa conversão pesada diretamente no banco de dados.

### Demonstração em Vídeo: Conversão de Moeda no ABAP SQL e CDS

Assista ao vídeo comparando as assinaturas e exigências de tipagem entre as linguagens:

<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%;">
  <iframe 
    src="https://cdnapisec.kaltura.com/p/1926081/sp/192608100/embedIframeJs/uiconf_id/27230482/partner_id/1926081?iframeembed=true&playerId=kaltura_player&entry_id=1_zl2khmov" 
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;" 
    allowfullscreen 
    webkitallowfullscreen 
    mozAllowFullScreen 
    allow="autoplay *; fullscreen *; encrypted-media *" 
    title="Understanding an Example of Currency Conversion in ABAP SQL and ABAP CDS">
  </iframe>
</div>

---

### Diferenças Críticas de Sintaxe: ABAP SQL vs. ABAP CDS

| Característica | ABAP SQL | ABAP CDS DDL |
| :--- | :--- | :--- |
| **Operador de Atribuição** | Sinal de igual (`=`) | Sinal de atribuição com seta (**`=>`**) |
| **Tipagem de Literais** | Aceita literal de texto direto: `target_currency = 'EUR'` | **Exige tipo estrito:** o literal deve ser convertido explicitamente usando `cast( 'EUR' as abap.cuky )` ou associado a um Data Element compatível. |
| **Parâmetros Obrigatórios** | Possui 4 parâmetros obrigatórios e 6 opcionais. | Mesmos parâmetros obrigatórios (`amount`, `source_currency`, `target_currency`, `exchange_rate_date`), com parâmetros passados usando **`=>`**. |

![[03UnitandCurrencyConversion_002.png]]

> [!NOTE] Funções com Parâmetros Posicionais
> Algumas funções (como `TSTMP_TO_DATS`) possuem parâmetros nomeados e opcionais no ABAP SQL, mas no ABAP CDS exigem a passagem estritamente posicional de **todos** os parâmetros sem nomes, tornando parâmetros que seriam opcionais em obrigatórios.

---

# 3. Variáveis de Sessão (*Session Variables*)

Dentro do código de uma CDS View Entity, é possível acessar informações contextuais do ambiente de execução através de **variáveis de sessão** (*Session Variables*).

![[Session_Variables_002.png]]

A sintaxe de leitura utiliza o prefixo **`$session.`** seguido do nome da variável:

```abap
// Exemplo em filtro de caminho ou cláusula WHERE:
_Text[ Language = $session.system_language ].Description
```

![[Session_Variables_001.png]]

O ABAP CDS oferece **seis variáveis de sessão padrão integradas**:

| Variável de Sessão CDS | Campo de Sistema ABAP Equivalente | Significado |
| :--- | :--- | :--- |
| **`$session.user`** | `sy-uname` | Nome do usuário logado na sessão |
| **`$session.client`** | `sy-mandt` | Número do mandante corrente |
| **`$session.system_language`** | `sy-langu` | Código de idioma da sessão |
| **`$session.system_date`** | `sy-datum` | Data do servidor de aplicação |
| **`$session.user_date`** | Data local do usuário | Data considerando o fuso do usuário |
| **`$session.user_timezone`** | `sy-zonlo` | Fuso horário (*Time Zone*) do usuário |

> [!CAUTION] Alerta de Arquitetura: Limitação das Variáveis de Sessão
> As variáveis de sessão **só são preenchidas se a chamada de leitura se originar do runtime ABAP**. Em acessos externos diretos (ex: conexões ODBC/JDBC de ferramentas BI de terceiros direto ao banco HANA sem passar pelo NetWeaver/ABAP), essas variáveis ficam **indefinidas (nulas)**!  
> Para garantir robustez universal, a SAP recomenda fortemente utilizar **Parâmetros de Entrada (*Input Parameters*)** para transmitir dados de data e idioma.

---

# 4. Exercício Prático: Aplicando Funções Integradas em CDS (*Hands-on*)

### Objetivos do Exercício
1. Atualizar o campo `AssistantName` em **`Z##_C_EmployeeQuery`** utilizando a função de string `concat_with_space(...)` para unir nome e sobrenome com um espaço.
2. Criar o campo `CompanyAffiliation` utilizando as funções de data `dats_days_between(...)` e `division(...)` para calcular o tempo de empresa em anos com precisão de 1 casa decimal.
3. Projetar a moeda alvo `CurrencyCodeUSD`, converter o salário anual para dólares na data do sistema (`$session.system_date`) utilizando `currency_conversion(...)`, e recalcular o salário mensal a partir do valor convertido usando a referência de projeção local **`$projection.`**.

- **Modelo Inicial:** `Z##_C_EmployeeQuery` (ou `/LRN/C_EMPLOYEE_EXP`)
- **Objeto Solução de Referência da SAP:** `/LRN/C_EMPLOYEE_FCT`

---

### Tarefa 1: Utilizar Função de String (`concat_with_space`)

1. Abra a definição de dados **`Z##_C_EmployeeQuery`**.
2. Comente o elemento anterior de `AssistantName`.
3. Adicione a função para concatenar o primeiro nome e o sobrenome do assistente do departamento:

```abap
  // _Department._Assistant.LastName as AssistantName,
  concat_with_space( _Department._Assistant.FirstName,
                     _Department._Assistant.LastName,
                     1 ) as AssistantName,
```

---

### Tarefa 2: Calcular Tempo de Empresa com Funções de Data

1. Antes da declaração das associações expostas, adicione o cálculo do tempo de empresa (`CompanyAffiliation`):
   - A função `dats_days_between( EntryDate, $session.system_date )` calcula o número de dias trabalhados até hoje.
   - A função `division( ..., 365, 1 )` divide os dias por 365, fixando o resultado em 1 casa decimal.

```abap
  division( dats_days_between( EntryDate,
                               $session.system_date ),
            365,
            1 ) as CompanyAffiliation,
```

---

### Tarefa 3: Executar a Conversão Cambial (`currency_conversion`)

1. Comente a projeção simples anterior de `CurrencyCode`.
2. Projete a nova moeda alvo convertida (`CurrencyCodeUSD`) tipificada pelo Data Element de moedas:
```abap
  // CurrencyCode,
  cast( 'USD' as /dmo/currency_code ) as CurrencyCodeUSD,
```
3. Adicione a função `currency_conversion` para converter o salário anual para dólares:
```abap
  @EndUserText.label: 'Annual Salary'
  @Semantics.amount.currencyCode: 'CurrencyCodeUSD'
  currency_conversion( amount             => AnnualSalary,
                       source_currency    => CurrencyCode,
                       target_currency    => $projection.CurrencyCodeUSD,
                       exchange_rate_date => $session.system_date
                     ) as AnnualSalaryConverted,
```
4. Recalcule o salário mensal aproveitando o valor já convertido através de `$projection.AnnualSalaryConverted`:
```abap
  @EndUserText.label: 'Monthly Salary'
  @Semantics.amount.currencyCode: 'CurrencyCodeUSD'
  cast( $projection.AnnualSalaryConverted as abap.fltp ) 
  / 12.0 as MonthlySalaryConverted,
```

---

### Código Completo da CDS View Entity (`Z##_C_EmployeeQuery`)

```abap
@AccessControl.authorizationCheck: #NOT_REQUIRED
@EndUserText.label: 'Employee (Query)'
@Metadata.ignorePropagatedAnnotations: true
@ObjectModel.usageType:{
  serviceQuality: #D,
  sizeCategory:   #M,
  dataClass:      #MASTER
}
define view entity Z##_C_EmployeeQuery
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
      @Semantics.amount.currencyCode: 'CurrencyCodeUSD'
      currency_conversion( amount             => AnnualSalary,
                           source_currency    => CurrencyCode,
                           target_currency    => $projection.CurrencyCodeUSD,
                           exchange_rate_date => $session.system_date
                         )                     as AnnualSalaryConverted,

      @EndUserText.label: 'Monthly Salary'
      @Semantics.amount.currencyCode: 'CurrencyCodeUSD'
      cast( $projection.AnnualSalaryConverted as abap.fltp ) 
      / 12.0                                   as MonthlySalaryConverted,

      cast( 'USD' as /dmo/currency_code )      as CurrencyCodeUSD,

      division( dats_days_between( EntryDate,
                                   $session.system_date ),
                365,
                1 )                            as CompanyAffiliation,

      /* Associações */
      _Department
}
```

5. Salve e ative (**Ctrl + F3**).
6. Pressione **F8** para abrir o *Data Preview* e validar as conversões dinâmicas de texto, moeda e datas processadas integralmente na base de dados!
