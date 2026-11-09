---
tipo: clippings
title: "Processing Data Sets in CDS Views"
source: "https://learning.sap.com/courses/building-data-models-with-the-abap-dictionary-and-abap-core-data-services/including-aggregations-joins-and-unions-in-cds-views_fa94fdc8-20e2-4fb4-b980-5323314a47bf"
created: 2026-11-03
tags:
  - sap
  - abap
  - abap-cloud
  - cds
  - data-sets
  - distinct
  - aggregations
  - group-by
  - joins
  - unions
---
**Roteiro de Estudos Relacionado:** [[Roteiro de Estudos SAP]]

# Objetivos de Aprendizado

Após concluir esta lição, você será capaz de:
- Identificar as principais técnicas SQL de processamento e combinação de conjuntos de dados suportadas e restritas no **ABAP CDS**.
- Aplicar a adição **`DISTINCT`** para eliminar registros duplicados no conjunto resultante.
- Implementar funções de agregação (`COUNT`, `MIN`, `MAX`, `SUM`, `AVG`) e estruturar a cláusula **`GROUP BY`**.
- Reconhecer a obrigatoriedade da especificação explícita de tipo numérico na função de média `AVG( ... AS abap.tipo )`.
- Modelar junções explícitas (**`INNER JOIN`**, **`LEFT OUTER JOIN`**, **`RIGHT OUTER JOIN`**) dominando as diferenças sintáticas em relação ao ABAP SQL.
- Combinar fluxos de dados utilizando **`UNION`** e **`UNION ALL`**, aplicando as regras obrigatórias de chaves, compatibilidade posicional e anotações.
- Compreender por que a cláusula **`ORDER BY` é proibida** na definição de CDS Views.

---

# 1. Visão Geral das Técnicas SQL no ABAP CDS

O ABAP CDS oferece suporte à maioria das técnicas consagradas da álgebra relacional SQL, porém com regras arquiteturais voltadas à semântica e integridade:

![[01DatasetsinCDSOverview_001.png]]

| Técnica SQL | Suportado em ABAP CDS? | Particularidades e Diferenças com o ABAP SQL |
| :--- | :---: | :--- |
| **`ORDER BY`** | ❌ **NÃO** | **Proibido em CDS Views.** Na teoria relacional, uma visão representa um conjunto não ordenado de tuplas. A ordenação deve ser realizada na camada de consumo (no `SELECT` do ABAP SQL ou no layout do SAP Fiori). |
| **`DISTINCT`** | ✔️ **SIM** | No CDS, é posicionado **imediatamente após o comando `SELECT`** (`SELECT DISTINCT FROM ...`), e não na lista de elementos. |
| **Agregações & `GROUP BY`** | ✔️ **SIM** | Suporte às funções padrão (`COUNT`, `MIN`, `MAX`, `SUM`, `AVG`). Na função `AVG()`, a tipagem de destino é **obrigatória** (`AVG( campo AS abap.fltp )`). O `GROUP BY` é gerado via Quick Fix (**Ctrl + 1**). |
| **`JOIN`** | ✔️ **SIM** | Suporte a `INNER JOIN`, `LEFT OUTER JOIN` e `RIGHT OUTER JOIN`. Utiliza o ponto (`.`) como seletor de campos (`alias.campo`) em vez do til (`~`), e exige a qualificação de fonte em todos os elementos. |
| **`UNION` / `UNION ALL`** | ✔️ **SIM** | Exige mesmo número e ordem de tipos de campos, nomes de elementos idênticos, chaves idênticas em todos os ramos e anotações declaradas **apenas no primeiro ramo `SELECT`**. |

---

# 2. Eliminando Duplicatas com `DISTINCT`

A adição `DISTINCT` instrui o mecanismo de banco de dados a descartar linhas completamente idênticas da projeção final:

![[02DDatasetsinCDSExamples_001.png]]

- **Sintaxe no ABAP CDS:**  
  Diferente do ABAP SQL (onde fica dentro da lista de campos), no CDS o termo fica colado ao comando `SELECT`:
```abap
define view entity Z##_C_DepartmentQuery
  as select distinct from Z##_C_EmployeeQuery
{
  DepartmentId,
  DepartmentDescription
}
```

---

# 3. Agregações e Agrupamentos (`GROUP BY`)

Funções de agregação colapsam múltiplos registros em valores escalares acumulados:

![[02DDatasetsinCDSExamples_002.png]]
![[02DDatasetsinCDSExamples_003.png]]

### Particularidade da Função de Média `AVG()`
No ABAP SQL, a função `AVG()` adota o tipo `FLTP` por padrão se nenhum tipo for especificado. No **ABAP CDS DDL**, é **estritamente obrigatório** definir o tipo numérico do resultado utilizando a adição `AS`:

```abap
// Obrigatório especificar o tipo de destino:
avg( CompanyAffiliation as abap.dec(11,1) ) as AverageAffiliation
avg( OccupiedSeats      as abap.fltp )       as AverageOccupation
```

---

### A Cláusula `GROUP BY`
Sempre que a lista de elementos mesclar funções de agregação com campos normais ou expressões, o padrão SQL exige a cláusula **`GROUP BY`**, que deve listar todos os campos não agregados da fonte de dados:

> [!TIP] Produtividade no ADT com Quick Fix
> Não digite o bloco `GROUP BY` manualmente! Quando o editor sublinhar o erro de falta de agrupamento, posicione o cursor sobre o comando `select` e pressione **Ctrl + 1** para acionar a correção automática **`Add GROUP BY clause`** (ou **`Adjust GROUP BY clause`** após modificações).

---

# 4. Junções Explícitas (*Joins*)

Embora as Associações CDS com expressões de caminho (*Join on Demand*) sejam a técnica moderna recomendada, o ABAP CDS oferece suporte completo a junções físicas explícitas:

![[02DDatasetsinCDSExamples_004.png]]

### Diferenças de Sintaxe entre ABAP SQL e CDS DDL:
1. **Seletor de Colunas:**  
   - ABAP SQL usa o til: `c~customer_id`.
   - ABAP CDS segue o padrão ANSI SQL usando o ponto: `c.customer_id`.
2. **Qualificação Obrigatória:**  
   Em CDS View Entities com JOIN, **todos os campos** projetados na lista de elementos devem conter explicitamente o prefixo da fonte ou alias (`c.campo`, `t.campo`).

```abap
as select from Z##_C_EmployeeQueryP(...) as e
  right outer join Z##_R_Department as d
    on e.DepartmentId = d.Id
```

---

# 5. União de Conjuntos com `UNION` e `UNION ALL`

A instrução `UNION` combina horizontalmente os registros de dois ou mais comandos `SELECT` em uma única visão unificada:

![[02DDatasetsinCDSExamples_005.png]]

- **`UNION ALL`:** Concatena os registros mantendo duplicatas existentes.
- **`UNION` (sem `ALL`):** Concatena e executa uma eliminação implícita de linhas totalmente duplicadas.

### Regras Mandatórias de Validação no CDS:
1. **Compatibilidade Posicional e Quantitativa:** Todos os ramos do `SELECT` devem ter rigorosamente o **mesmo número de colunas**, e as colunas nas mesmas posições ordinais devem ter tipos de dados compatíveis.
2. **Nomes de Elementos:** Os nomes dos elementos (ou seus respectivos aliases `as Nome`) devem ser idênticos coluna por coluna em todos os ramos.
3. **Definição de Chaves Idêntica:** A lista de elementos marcados com a palavra-chave `key` deve coincidir rigorosamente entre todas as ramificações.
4. **Regra de Ouro das Anotações de Elementos:** Anotações de elementos (como `@EndUserText.label` ou `@Semantics.*`) **só podem ser declaradas na lista de elementos do PRIMEIRO comando `SELECT`**. Inserir anotações nos ramos subsequentes causa erro de compilação imediato.
5. **Anotação de Cabeçalho Obrigatória:** Visões CDS contendo `UNION` exigem obrigatoriamente a anotação `@Metadata.ignorePropagatedAnnotations: true` para evitar colisões semânticas.

---

# 6. Exercício Prático: Processando Conjuntos de Dados no CDS (*Hands-on*)

### Objetivos do Exercício
1. Criar a CDS View Entity **`Z##_C_DepartmentQuery`** para listar departamentos únicos utilizando `SELECT DISTINCT`.
2. Substituir `DISTINCT` por agregações (`AVG` e `SUM`), utilizando o Quick Fix (**Ctrl + 1**) para gerar a cláusula `GROUP BY`.
3. Repassar os parâmetros da visão de funcionários parametrizada (`Z##_C_EmployeeQueryP`).
4. Implementar um `RIGHT OUTER JOIN` com a visão mestre `Z##_R_Department` para garantir a exibição de todos os departamentos (mesmo aqueles sem funcionários alocados).

- **Objeto Solução de Referência da SAP:** `/LRN/C_DEPARTMENT_QRY`

---

### Tarefa 1: Criar a Visão de Departamentos com `DISTINCT`

1. No ADT, clique com o botão direito em `Z##_C_EmployeeQuery` $\rightarrow$ **New Data Definition**.
2. Nome: **`Z##_C_DepartmentQuery`** | Descrição: **`Department (Query)`**.
3. Selecione o template **Define View Entity**.
4. Projete apenas `DepartmentId` e `DepartmentDescription` adicionando o modificador `distinct`:

```abap
@AccessControl.authorizationCheck: #NOT_REQUIRED
@EndUserText.label: 'Department (Query)'
@Metadata.ignorePropagatedAnnotations: true
@ObjectModel.usageType:{
  serviceQuality: #D,
  sizeCategory:   #M,
  dataClass:      #MASTER
}
define view entity Z##_C_DepartmentQuery
  as select distinct from Z##_C_EmployeeQuery
{
  DepartmentId,
  DepartmentDescription
}
```

5. Ative (**Ctrl + F3**) e teste no *Data Preview* (**F8**), comprovando que cada setor aparece apenas uma vez.

---

### Tarefa 2: Adicionar Agregações e Cláusula `GROUP BY`

1. Remova a palavra-chave `distinct`.
2. Adicione os cálculos de média de tempo de casa (`AverageAffiliation`) e folha salarial total anual (`TotalSalary`):

```abap
define view entity Z##_C_DepartmentQuery
  as select from Z##_C_EmployeeQuery
{
  DepartmentId,
  DepartmentDescription,
  avg( CompanyAffiliation as abap.dec(11,1) ) as AverageAffiliation,
  @Semantics.amount.currencyCode: 'CurrencyCodeUSD'
  sum( AnnualSalaryConverted )                as TotalSalary,
  CurrencyCodeUSD
}
```

3. Posicione o cursor na palavra `select` e pressione **Ctrl + 1** $\rightarrow$ selecione **Add GROUP BY clause**. O ADT gerará:
```abap
group by
  DepartmentId,
  DepartmentDescription,
  CurrencyCodeUSD
```
4. Salve e ative (**Ctrl + F3**).

---

### Tarefa 3: Repassar Parâmetros de Entrada (*Parameter Forwarding*)

1. Altere a fonte de dados para **`Z##_C_EmployeeQueryP`**.
2. Adicione os parâmetros no cabeçalho e repasse-os na cláusula `FROM`:

```abap
define view entity Z##_C_DepartmentQuery
  with parameters
    p_target_curr : /dmo/currency_code,
    @EndUserText.label: 'Date of evaluation'
    @Environment.systemField: #SYSTEM_DATE
    p_date        : abap.dats
  as select from Z##_C_EmployeeQueryP(
                   p_target_curr: $parameters.p_target_curr,
                   p_date:        $parameters.p_date )
```

---

### Tarefa 4: Incluir Departamentos sem Funcionários com `RIGHT OUTER JOIN`

1. Para exibir departamentos sem funcionários cadastrados, conecte a fonte com um `RIGHT OUTER JOIN` apontando para a visão mestre `Z##_R_Department`:
2. Qualifique os campos com os aliases `e` (empregado) e `d` (departamento).
3. Leia `Id` e `Description` da visão de departamentos (`d`).

---

### Código Final Completo da CDS View Entity (`Z##_C_DepartmentQuery`)

```abap
@AccessControl.authorizationCheck: #NOT_REQUIRED
@EndUserText.label: 'Department (Query)'
@Metadata.ignorePropagatedAnnotations: true
@ObjectModel.usageType:{
  serviceQuality: #D,
  sizeCategory:   #M,
  dataClass:      #MASTER
}
define view entity Z##_C_DepartmentQuery
  with parameters
    p_target_curr : /dmo/currency_code,
    @EndUserText.label: 'Date of evaluation'
    @Environment.systemField: #SYSTEM_DATE
    p_date        : abap.dats
  as select from Z##_C_EmployeeQueryP(
                   p_target_curr: $parameters.p_target_curr,
                   p_date:        $parameters.p_date ) as e
    right outer join Z##_R_Department                  as d
      on e.DepartmentId = d.Id
{
  key d.Id                                          as DepartmentId,
      d.Description                                 as DepartmentDescription,

      avg( e.CompanyAffiliation as abap.dec(11,1) ) as AverageAffiliation,

      @Semantics.amount.currencyCode: 'CurrencyCode'
      sum( e.AnnualSalaryConverted )                as TotalSalary,

      e.CurrencyCode                                as CurrencyCode
}
group by
  d.Id,
  d.Description,
  e.CurrencyCode
```

4. Salve com **Ctrl + S** e ative com **Ctrl + F3**.
5. Pressione **F8** para abrir o **Data Preview**: observe que departamentos sem colaboradores aparecem com valores nulos nas agregações, enquanto todos os demais setores exibem médias e totais perfeitamente consolidados no banco de dados!
