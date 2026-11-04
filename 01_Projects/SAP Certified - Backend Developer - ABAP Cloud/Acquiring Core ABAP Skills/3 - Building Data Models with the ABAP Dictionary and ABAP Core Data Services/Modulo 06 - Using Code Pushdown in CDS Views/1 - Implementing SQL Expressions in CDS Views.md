---
tipo: clippings
title: "Implementing SQL Expressions in CDS Views"
source: "https://learning.sap.com/courses/building-data-models-with-the-abap-dictionary-and-abap-core-data-services/implementing-sql-expressions-in-cds-views_a9962c08-c5df-46a6-ba30-a74acf5c86b2"
created: 2026-11-03
tags:
  - sap
  - abap
  - abap-cloud
  - cds
  - code-pushdown
  - sql-expressions
  - literals
  - type-conversions
  - cast
  - case
  - arithmetic-expressions
---
**Roteiro de Estudos Relacionado:** [[Roteiro de Estudos SAP]]

# Objetivos de Aprendizado

Após concluir esta lição, você será capaz de:
- Compreender a motivação e os benefícios arquiteturais do **Code Pushdown** no ABAP CDS.
- Identificar as diferenças de tipagem entre literais no **ABAP SQL** e no **ABAP CDS** (como suporte a literais de ponto flutuante `FLTP`).
- Realizar conversões de tipos técnicas e semânticas utilizando a expressão `CAST( ... AS ... )` e a adição `PRESERVING TYPE`.
- Implementar distinções condicionais utilizando expressões `CASE` simples e complexas.
- Aplicar expressões aritméticas no CDS respeitando as restrições de divisão em ponto flutuante.

---

# 1. Code Pushdown no ABAP SQL e ABAP CDS

Com o poder computacional massivo em memória do **SAP HANA**, o paradigma de desenvolvimento oficial da SAP recomenda executar o máximo de processamento, agregações e cálculos diretamente na **camada de banco de dados** (*Code Pushdown*), evitando o tráfego desnecessário de grandes volumes de dados brutos para o servidor de aplicação.

![[01ABAPSQLAndCDS_001.png]]

Tradicionalmente, cálculos como o número de assentos livres em um voo podiam ser efetuados através de expressões aritméticas em comandos `SELECT` do ABAP SQL:

```abap
" Exemplo em ABAP SQL direto:
SELECT seats_max - seats_occ AS seats_free
  FROM /dmo/flight
  INTO TABLE @DATA(flights).
```

No modelo moderno, essa lógica SQL é transferida para dentro da própria definição da **CDS View Entity**:

![[01ABAPSQLAndCDS_002.png]]

```abap
" Na definição da CDS View Entity:
seats_max - seats_occ as SeatsFree
```

Para qualquer consumidor (programas ABAP, serviços OData ou ferramentas analíticas), o elemento calculado `SeatsFree` comporta-se e é consumido exatamente como se fosse um campo físico gravado na tabela do banco de dados!

---

### Vantagens Estratégicas de Mover a Lógica para CDS Views

![[01ABAPSQLAndCDS_004.png]]

1. **Encapsulamento (*Encapsulation*):** A complexidade da álgebra relacional fica isolada e organizada dentro da visão CDS, tornando os programas de aplicação ABAP consumidores muito mais limpos, legíveis e fáceis de manter.
2. **Reutilização Global (*Reuse*):** Uma vez definida na CDS View, a mesma regra de negócio é reaproveitada em todo o ecossistema SAP: transações ABAP Cloud, aplicações Fiori baseadas no **ABAP RESTful Application Programming Model (RAP)**, extratores de dados para SAP BW e relatórios analíticos (*Embedded Analytics*).
3. **Semântica e Metadados (*Semantics*):** É possível enriquecer o resultado do cálculo com nomes técnicos padronizados e anotações semânticas ricas (como `@Semantics.amount.currencyCode` ou rótulos multilíngues com `@EndUserText.label`).
4. **Governança e Controle de Acesso (*Authorization Rules*):** Os dados calculados podem ser protegidos diretamente na fonte através de objetos de autorização declarativos (*CDS Access Control / DCL*).

---

# 2. Literais no ABAP CDS vs. ABAP SQL

Ao comparar o tratamento de literais constantes entre o ABAP SQL e o ABAP CDS, observa-se que o ABAP CDS oferece um leque muito mais rico e refinado de tipos de dados:

![[02LiteralsinCDS_001.png]]

| Categoria | Comportamento no ABAP SQL | Comportamento no ABAP CDS DDL |
| :--- | :--- | :--- |
| **Literais de Caracteres** | Apenas tipo genérico `C` (equivalente ao tipo do dicionário `CHAR`). | Se o literal contiver **exclusivamente dígitos numéricos** (ex: `'1000'`), o CDS tipifica automaticamente como **`NUMC`**; caso contrário, utiliza `CHAR`. |
| **Literais Inteiros** | Todos os inteiros (positivos ou negativos) recebem o tipo padrão ABAP `I` (`INT4`). | O compilador adota o **menor tipo inteiro** capaz de acomodar o valor em bytes: `INT1` (até 255), `INT2` (até 32.767) ou `INT4`. |
| **Literais Decimais / Ponto Flutuante** | **Não suportados** (pois o ponto `.` é o delimitador de encerramento de comandos no ABAP). | **Totalmente suportados!** Qualquer número com ponto decimal (ex: `100.0`, `0.5`) é reconhecido nativamente como tipo de ponto flutuante **`FLTP`**. |

---

# 3. Conversões de Tipos: Expressão `CAST`

No ABAP CDS, as conversões explícitas de tipos são realizadas exclusivamente através da expressão **`CAST( ... AS ... )`** (o operador de conversão `CONV` pertence à linguagem imperativa ABAP e **não** existe na sintaxe DDL do CDS).

![[Type_Conversions_002.png]]

### Estrutura do `CAST`
- **Operando:** Pode ser um campo da fonte de dados, um literal, o resultado de uma expressão aritmética, uma expressão `CASE` ou uma função SQL.
- **Tipo de Destino:** Especificado utilizando tipos predefinidos do dicionário com o **prefixo obrigatório `abap.`** (ex: `abap.int4`, `abap.fltp`, `abap.dats`, `abap.dec(15,2)`, `abap.cuky`).

```abap
cast( AnnualSalary as abap.fltp )
```

> [!WARNING] Restrições de Conversão
> Nem todas as combinações de tipos de origem e destino são suportadas pelo banco. Por exemplo, converter diretamente operandos do tipo `FLTP` para determinados tipos inteiros requer atenção à documentação de matriz de tipos da SAP.

---

### Conversão para Data Elements e a Adição `PRESERVING TYPE`

Uma funcionalidade exclusiva e extremamente poderosa do `CAST` no ABAP CDS é a possibilidade de utilizar um **Data Element** global do dicionário como tipo de destino:

![[Type_Conversions_003.png]]

```abap
cast( 'USD' as /dmo/currency_code ) as CurrencyCodeUSD
```

- **Herança Semântica:** Essa conversão não apenas ajusta o tipo técnico, mas também transfere todos os metadados do Data Element para o elemento da view (como rótulos de tela curtos, médios e longos, ajudas de pesquisa e textos traduzíveis).
- **Adição `PRESERVING TYPE`:** Quando o tipo técnico do operando e o tipo técnico do Data Element já são idênticos (servindo o cast apenas para injetar semântica nova), o compilador emitirá um aviso de sintaxe. Para suprimir esse aviso, utilize a adição `PRESERVING TYPE`:

```abap
cast( carrier_id as /dmo/carrier_id preserving type ) as CarrierId
```

---

# 4. Distinções Condicionais: Expressão `CASE`

O ABAP CDS oferece suporte completo às expressões `CASE`, seguindo a exata mesma lógica funcional do ABAP SQL:

![[03CASEDistinctions_001.png]]
![[03CASEDistinctions_002.png]]

Podemos empregar duas variantes sintáticas:

1. **Simple CASE (Caso Simples):** Compara um único operando contra valores fixos ou campos:
```abap
case EmployeeId
  when _Department.HeadId      then 'H'
  when _Department.AssistantId then 'A'
  else ' '
end as EmployeeRole
```

2. **Searched CASE (Caso Complexo):** Avalia expressões lógicas e booleanas distintas em cada ramo:
```abap
case
  when SeatsOccupied > SeatsMax then 'OVERBOOKED'
  when SeatsOccupied = SeatsMax then 'FULL'
  else 'AVAILABLE'
end as FlightStatus
```

---

# 5. Expressões Aritméticas no ABAP CDS

Assim como no ABAP SQL, você pode utilizar os quatro operadores matemáticos básicos (`+`, `-`, `*`, `/`) na lista de elementos da view:

![[04ArithmExprinCDS_001.png]]
![[04ArithmExprinCDS_002.png]]

> [!CAUTION] Regra Crítica: A Divisão (`/`) Exige Ponto Flutuante (`FLTP`)
> Em ABAP CDS, o operador de divisão **`/` só é permitido em expressões de ponto flutuante**! Tentar dividir valores inteiros ou decimais brutos causará um erro imediato de compilação.
> 
> **Como proceder:**
> 1. Converta o dividendo para ponto flutuante usando `cast( Campo as abap.fltp )`.
> 2. Utilize divisores literais com notação de ponto decimal (ex: `12.0` em vez de `12`).

```abap
// Forma Correta:
cast( AnnualSalary as abap.fltp ) / 12.0 as MonthlySalary
```

---

# 6. Exercício Prático: Utilizando Expressões em CDS Views (*Hands-on*)

### Objetivos do Exercício
1. Estender a CDS View Entity **`Z##_C_EmployeeQuery`** criada anteriormente com lógica SQL embutida.
2. Implementar uma distinção `CASE` para identificar dinamicamente a função do empregado no departamento (`EmployeeRole`: 'H' para Head/Gerente, 'A' para Assistant/Assistente e ' ' para demais).
3. Calcular o salário mensal estimado (`MonthlySalary`) utilizando uma expressão aritmética de divisão em ponto flutuante, vinculando a anotação obrigatória de semântica de moeda.

- **Modelo Inicial:** `Z##_C_EmployeeQuery` (ou `/LRN/C_EMPLOYEE_QRY`)
- **Objeto Solução de Referência da SAP:** `/LRN/C_EMPLOYEE_EXP`

---

### Tarefa 1: Implementar a Distinção `CASE` para o Papel do Empregado

1. Abra a definição de dados **`Z##_C_EmployeeQuery`**.
2. Na lista de elementos, antes das associações expostas, adicione a expressão `CASE` comparando o `EmployeeId` com os campos `HeadId` e `AssistantId` obtidos via associação `_Department`:

```abap
  @EndUserText.label: 'Employee Role'
  case EmployeeId
    when _Department.HeadId      then 'H'
    when _Department.AssistantId then 'A'
    else ' '
  end                             as EmployeeRole,
```

---

### Tarefa 2: Implementar o Cálculo do Salário Mensal

1. Logo abaixo do campo `EmployeeRole`, adicione o cálculo do salário mensal:
   - Aplique o `CAST` de `AnnualSalary` para `abap.fltp`.
   - Efetue a divisão pelo literal decimal `12.0`.
   - Adicione o rótulo de texto `@EndUserText.label: 'Monthly Salary'`.
   - Adicione a anotação semântica obrigatória `@Semantics.amount.currencyCode: 'CurrencyCode'`.
   - Mantenha o campo `CurrencyCode` projetado na lista.

```abap
  @EndUserText.label: 'Monthly Salary'
  @Semantics.amount.currencyCode: 'CurrencyCode'
  cast( AnnualSalary as abap.fltp ) / 12.0 as MonthlySalary,

  CurrencyCode,
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
      _Department._Assistant.LastName          as AssistantName,

      @EndUserText.label: 'Employee Role'
      case EmployeeId
        when _Department.HeadId      then 'H'
        when _Department.AssistantId then 'A'
        else ' '
      end                                      as EmployeeRole,

      @EndUserText.label: 'Monthly Salary'
      @Semantics.amount.currencyCode: 'CurrencyCode'
      cast( AnnualSalary as abap.fltp ) / 12.0 as MonthlySalary,

      CurrencyCode,

      /* Associações */
      _Department
}
```

2. Salve e ative a visão com **Ctrl + F3**.
3. Pressione **F8** para abrir a ferramenta **Data Preview** e verifique os novos campos calculados (`EmployeeRole` e `MonthlySalary`) processados com altíssima performance no banco!
