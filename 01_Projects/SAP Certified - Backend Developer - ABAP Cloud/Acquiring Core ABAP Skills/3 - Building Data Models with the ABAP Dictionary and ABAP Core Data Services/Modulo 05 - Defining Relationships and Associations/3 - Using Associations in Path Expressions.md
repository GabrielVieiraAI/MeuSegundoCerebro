---
tipo: clippings
title: "Using Associations in Path Expressions"
source: "https://learning.sap.com/courses/building-data-models-with-the-abap-dictionary-and-abap-core-data-services/using-associations-in-path-expressions_daff758b-a544-4613-9a6e-aa1a2df73a33"
created: 2026-11-03
tags:
  - sap
  - abap
  - abap-cloud
  - cds
  - view-entities
  - path-expressions
  - associations
  - join-on-demand
  - abap-sql
  - filters
---
**Roteiro de Estudos Relacionado:** [[Roteiro de Estudos SAP]]

# Objetivos de Aprendizado

Após concluir esta lição, você será capaz de:
- Construir e utilizar expressões de caminho (*Path Expressions*) em **CDS View Entities**.
- Compreender como e quando as expressões de caminho convertem associações em operações físicas de **JOIN sob demanda** (*Join on Demand*) no banco de dados.
- Encadejar múltiplas associações (*Chained Associations*) para navegar por múltiplos nós relacionais.
- Tratar os impactos de cardinalidades "To-Many" utilizando agregações (`GROUP BY`) e condições de filtro (`[ 1: ... ]`).
- Aplicar expressões de caminho no **ABAP SQL moderno** dominando suas especificidades sintáticas (prefixo `\`, separador `-` e cláusulas `MANY TO ONE WHERE`).

---

# 1. Expressões de Caminho no ABAP CDS (*Path Expressions*)

Quando uma CDS View Entity consome uma fonte de dados que possui associações expostas, o desenvolvedor tem à disposição duas alternativas fundamentais:

![[01PathExprInCDS_001.png]]

1. **Propagar a Associação (*Propagating the Association*):** Adicionar o nome da associação diretamente à lista de elementos da view superior. Isso mantém a associação viva e visível para a próxima camada de consumo, sem ler campos adicionais de imediato.
2. **Utilizar a Associação (*Using the Association*):** Escrever o nome da associação seguido de um ponto (`.`) e do nome de um elemento da visão de destino (ex: `_Department.Description`). Esta construção sintática denomina-se **Expressão de Caminho** (*Path Expression*).

---

### A Mágica do JOIN sob Demanda (*Join on Demand*)

Na camada de banco de dados, o framework CDS traduz a expressão de caminho em um comando SQL **JOIN** entre a visão de origem e a visão de destino da associação:

![[01PathExprInCDS_002.png]]

A condição de junção (`ON`) do JOIN gerado é automaticamente extraída da condição `ON` definida na associação original.

> [!NOTE] Otimizações do Banco de Dados SAP HANA
> No banco de dados SAP HANA, o comando gerado utiliza tipos de junção especializados de alta performance:
> - `LEFT OUTER MANY TO ONE JOIN`: empregado quando a cardinalidade máxima de destino é `1`.
> - `LEFT OUTER MANY TO MANY JOIN`: empregado quando a cardinalidade máxima de destino é superior a `1` (`*`).

![[01PathExprInCDS_003.png]]

> [!IMPORTANT] Princípio Fundamental: Join on Demand
> O JOIN físico no banco de dados é **construído estritamente quando a associação é utilizada em uma expressão de caminho**. Declarar, expor ou propagar associações não cria nenhum JOIN nem degrada a performance da consulta.

---

### Encadeamento de Associações (*Chained Associations*) e Uso Ad-hoc

Uma expressão de caminho não está limitada a uma única associação; você pode encadear múltiplas associações em sequência:

![[01PathExprInCDS_004.png]]

- **Exemplo de Encadeamento:**  
  `_Department._Head.LastName`  
  A partir do funcionário corrente, navega-se até o seu departamento (`_Department`), deste até o gerente do setor (`_Head`) e obtém-se o sobrenome (`LastName`). O compilador CDS gera automaticamente a junção tripla correspondente no banco.

- **Uso Ad-hoc de Associações:**
  
  ![[01PathExprInCDS_005.png]]
  
  Uma CDS View Entity pode definir uma associação e utilizá-la diretamente na sua própria lista de elementos, sem necessariamente expô-la. O JOIN é embutido diretamente na consulta SQL daquela visão.

---

# 2. Demonstração em Vídeo: How to Write Path Expressions in CDS

Assista ao vídeo demonstrando como propagar associações, escrever expressões de caminho e inspecionar o comando `Show SQL CREATE Statement` para visualizar a junção gerada no banco:

<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%;">
  <iframe 
    src="https://cdnapisec.kaltura.com/p/1926081/sp/192608100/embedIframeJs/uiconf_id/27230482/partner_id/1926081?iframeembed=true&playerId=kaltura_player&entry_id=1_efp6bbxh" 
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;" 
    allowfullscreen 
    webkitallowfullscreen 
    mozAllowFullScreen 
    allow="autoplay *; fullscreen *; encrypted-media *" 
    title="How to Write Path Expressions in CDS">
  </iframe>
</div>

---

# 3. Influência da Cardinalidade em Expressões de Caminho

A cardinalidade declarada em uma associação determina restrições rígidas no verificador de sintaxe:

![[02CardinalityAndPathExpr_001.png]]

### O Risco das Associações "To-Many" ($max > 1$)
Quando uma associação possui cardinalidade para muitos (`0..*` ou `1..*`), sua utilização em uma expressão de caminho pode multiplicar a quantidade de registros retornados, gerando comportamentos inesperados:
- **Na cláusula `WHERE`:** É **terminantemente proibido** utilizar associações "To-Many" em expressões de caminho dentro da cláusula `WHERE`. O compilador acusa **erro de sintaxe**.
- **Na lista de elementos (*Element List*):** O compilador permite o uso, porém emite um **aviso de sintaxe (*Warning*)**, informando que a expressão pode alterar a granularidade do conjunto de resultados (ex: uma visão de departamentos passando a duplicar linhas por causa dos múltiplos funcionários).

---

### Como Solucionar a Multiplicação de Linhas?

Existem duas abordagens oficiais recomendadas pela SAP:

![[02CardinalityAndPathExpr_002.png]]

1. **Uso de Funções de Agregação com `GROUP BY`:**  
   Envolver a expressão de caminho dentro de funções como `SUM(...)`, `AVG(...)`, `COUNT(...)` ou `MAX(...)`. A presença obrigatória da cláusula `GROUP BY` garante que a granularidade original da entidade principal seja preservada.
2. **Aplicação de Filtros de Restrição:**  
   Reduzir a multiplicidade utilizando filtros em colchetes.

---

# 4. Filtros em Expressões de Caminho (*Filtered Associations*)

É possível aplicar filtros para restringir os registros da entidade de destino diretamente na expressão de caminho:

![[03ConditionsAndFilters_001.png]]

- **Sintaxe:** A condição é inserida entre colchetes logo após o nome da associação:  
  `_Flight[ OccupiedSeats > MaximumSeats ].FlightDate`
- **Operadores Suportados:** Operadores relacionais (`=`, `<>`, `<`, `>`, etc.) e lógicos (`AND`, `OR`, `NOT`), além de literais e funções integradas.
- **Implementação Física:** A condição de filtro é injetada diretamente na cláusula `ON` da junção SQL no banco de dados.

---

### Documentando a Cardinalidade Filtrada com `[ 1: ... ]`

Quando um filtro sobre uma associação "To-Many" garante que apenas **um único registro** será retornado (ex: filtrar por idioma fixo), o compilador ainda emitirá um aviso, pois não pode prever o volume de dados em tempo de execução.

![[03ConditionsAndFilters_002.png]]

Para declarar explicitamente ao verificador de sintaxe que o filtro converteu a relação em "To-One", adiciona-se o prefixo **`1:`** no início dos colchetes:

```abap
// Sem documentação de cardinalidade -> gera aviso de sintaxe:
_Airline._Currency._Text[ Language = 'E' ].CurrencyName

// Com documentação "1:" -> o aviso de sintaxe é eliminado:
_Airline._Currency._Text[ 1: Language = 'E' ].CurrencyName
```

---

# 5. Expressões de Caminho no ABAP SQL Moderno

No código ABAP (como métodos de classes e programas), o **ABAP SQL** moderno suporta expressões de caminho em comandos `SELECT`, aproveitando as associações expostas nas CDS Views.

![[04PathExprInABAPSQL_001.png]]

### Regras Sintáticas do ABAP SQL vs. CDS:

| Recurso | Sintaxe no ABAP CDS DDL | Sintaxe no ABAP SQL |
| :--- | :--- | :--- |
| **Prefixo da Associação** | Nenhum (apenas o nome `_Assoc`) | **Barra invertida (`\`)** obrigatória: `\_Assoc` |
| **Separador de Campo** | **Ponto (`.`)**: `_Assoc.Campo` | **Hífen (`-`)**: `\_Assoc-Campo` *(pois o ponto encerra comandos ABAP)* |
| **Encadeamento** | Separado por pontos: `_Assoc1._Assoc2.Campo` | Encadeamento direto com barras: `\_Assoc1\_Assoc2-Campo` |

![[04PathExprInABAPSQL_002.png]]
![[04PathExprInABAPSQL_003.png]]

---

### Filtros e Cardinalidade no ABAP SQL

Para aplicar filtros e declarar cardinalidade no ABAP SQL, a sintaxe substitui a notação `1:` por palavras-chave explícitas em inglês:

```abap
SELECT FROM /dmo/i_connection_R
  FIELDS AirlineId,
         ConnectionId,
         \_Airline\_Currency\_Text[ MANY TO ONE WHERE Language = 'E' ]-CurrencyShortName AS CurrencyName
  INTO TABLE @DATA(result).
```

- Adição **`MANY TO ONE WHERE`**: Garante que o retorno é restrito a uma linha, eliminando advertências do compilador ABAP.

---

# 6. Exercício Prático: Utilizando Associações em Path Expressions (*Hands-on*)

### Objetivos do Exercício
1. Criar a CDS View Entity de consumo/consulta **`Z##_C_EmployeeQuery`** consumindo `Z##_R_Employee`.
2. Utilizar expressões de caminho para buscar a descrição do departamento (`_Department.Description`) e o assistente via encadeamento (`_Department._Assistant.LastName`).
3. Analisar o comando `Show SQL CREATE Statement` confirmando a formação dos JOINs sob demanda.
4. Criar a classe ABAP executável **`ZCL_##_PATH_EXPR`** implementando consultas ABAP SQL com expressões de caminho (`\_department\_head-lastname`).

- **Objetos de Referência da SAP:**
  - `/LRN/C_EMPLOYEE_QRY` (Solução CDS Query)
  - `/LRN/CL_S4D430_RLS_PATH_EXP` (Solução da classe ABAP)

---

### Tarefa 1: Criar a CDS View de Consulta (`Z##_C_EmployeeQuery`)

1. No ADT, clique com o botão direito em `Z##_R_Employee` $\rightarrow$ **New Data Definition**.
2. Nome: **`Z##_C_EmployeeQuery`** | Descrição: **`Employee (Query)`**.
3. Selecione o template **Define View Entity** e confirme.
4. Ajuste a lista de elementos para selecionar os campos básicos, a descrição do departamento via associação simples e o nome do assistente via associação encadeada:

```abap
@AccessControl.authorizationCheck: #NOT_REQUIRED
@EndUserText.label: 'Employee (Query)'
@Metadata.ignorePropagatedAnnotations: true
@ObjectModel.usageType:{
  serviceQuality: #D,
  sizeCategory: #M,
  dataClass: #MASTER
}
define view entity Z##_C_EmployeeQuery
  as select from Z##_R_Employee
{
  key EmployeeId,
      FirstName,
      LastName,
      DepartmentId,

      /* Expressão de Caminho Simples */
      _Department.Description         as DepartmentDescription,

      /* Expressão de Caminho Encadeada */
      _Department._Assistant.LastName as AssistantName,

      /* Exposição da Associação */
      _Department
}
```

5. Salve com **Ctrl + S**.
6. Clique com o botão direito $\rightarrow$ **Show SQL CREATE Statement**:
   - Observe a presença dos comandos `LEFT OUTER MANY TO ONE JOIN` conectando as visões no banco de dados.
7. Ative a visão (**Ctrl + F3**) e pressione **F8** para visualizar os resultados com as colunas enriquecidas no *Data Preview*.

---

### Tarefa 2: Expressões de Caminho no ABAP SQL (`ZCL_##_PATH_EXPR`)

1. Duplique a classe modelo **`/LRN/CL_S4D430_RLT_PATH_EXP`** para o seu pacote com o nome **`ZCL_##_PATH_EXP`**.
2. No método `if_oo_adt_classrun~main`, monte a instrução `SELECT` consumindo a CDS View criada e aplicando a expressão de caminho para o chefe do setor:

```abap
CLASS zcl_##_path_exp DEFINITION
  PUBLIC
  FINAL
  CREATE PUBLIC.

  PUBLIC SECTION.
    INTERFACES if_oo_adt_classrun.
  PROTECTED SECTION.
  PRIVATE SECTION.
ENDCLASS.

CLASS zcl_##_path_exp IMPLEMENTATION.
  METHOD if_oo_adt_classrun~main.

    SELECT
      FROM z##_c_employeequery
      FIELDS employeeid,
             firstname,
             lastname,
             departmentid,
             departmentdescription,
             assistantname,
             \_department\_head-lastname AS headname
      INTO TABLE @DATA(result).

    out->write( data = result
                name = 'Resultado da Seleção com Path Expressions' ).

  ENDMETHOD.
ENDCLASS.
```

3. Ative a classe pressionando **Ctrl + F3**.
4. Execute a classe no console pressionando **F9**.
5. Verifique a tabela de saída exibindo perfeitamente os dados combinados do empregado, departamento, assistente e gerente em uma única chamada fluida e limpa!
