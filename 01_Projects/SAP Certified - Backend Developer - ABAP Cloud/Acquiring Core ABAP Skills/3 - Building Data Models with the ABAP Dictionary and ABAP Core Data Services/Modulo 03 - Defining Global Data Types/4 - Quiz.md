---
tipo: clippings
title: "Quiz: Defining Global Data Types"
source: "https://learning.sap.com/courses/building-data-models-with-the-abap-dictionary-and-abap-core-data-services/defining-global-data-types_c89cbd3e-2259-329d-bb55-9f9d5843389e"
created: 2026-11-03
tags:
  - sap
  - abap
  - abap-cloud
  - quiz
  - ddic
  - data-types
  - structures
  - table-types
---
**Roteiro de Estudos Relacionado:** [[Roteiro de Estudos SAP]]

# SAP Learning - Building Data Models with the ABAP Dictionary and ABAP Core Data Services
## Quiz Oficial: Defining Global Data Types

> [!NOTE] Instruções de Estudo Ativo
> Tente responder a cada uma das questões mentalmente ou registrando suas opções antes de expandir o bloco retrátil de **Gabarito e Explicação Oficial**.

---

### Pergunta 1
**Uma classe ABAP define um atributo com a seguinte declaração:**  
`DATA the_attribute TYPE /DMO/AGENCY.`  
**O objeto do dicionário `/DMO/AGENCY` é uma definição de tabela de banco de dados. Que tipo de objeto de dados é `the_attribute`?**  
*(Seleção Única)*

- **A.** Uma tabela interna (*An internal table*)
- **B.** Uma referência a uma tabela de banco de dados (*A reference to a database table*)
- **C.** Um objeto de dados estruturado (*A structured data object*)
- **D.** Um objeto de dados elementar (*An elementary data object*)

> [!success]- Gabarito e Explicação Oficial da SAP
> **Resposta Correta:** **C**  
> 
> **Fundamentação Oficial da SAP:**  
> Uma definição de tabela de banco de dados pode atuar como um tipo de dado estruturado no código ABAP. Portanto, o objeto de dados resultante é um objeto de dados estruturado (uma linha única em memória), contendo componentes cujos nomes e tipos correspondem exatamente aos nomes das colunas da tabela de banco de dados.

---

### Pergunta 2
**Você define um tipo de tabela do dicionário (*Table Type*) utilizando um tipo do dicionário como tipo de linha (*Row Type*). Quando a tabela interna resultante possui colunas que você pode endereçar diretamente pelos nomes das colunas?**  
*(Seleção Única)*

- **A.** Sempre (*Always*)
- **B.** Apenas se você definir uma lista explícita de componentes (*Only if you define an explicit component list*)
- **C.** Quando o tipo de linha é uma estrutura ou uma tabela de banco de dados (*When the row type is a structure or a database table*)
- **D.** Quando o tipo de linha é um elemento de dados (*When the row type is a data element*)

> [!success]- Gabarito e Explicação Oficial da SAP
> **Resposta Correta:** **C**  
> 
> **Fundamentação Oficial da SAP:**  
> A tabela interna resultante possui colunas nomeadas apenas quando o tipo de linha é uma estrutura ou uma definição de tabela de banco de dados. Se o tipo de linha for um elemento de dados (ou tipo predefinido), a tabela interna possui apenas uma coluna única anônima, a qual não pode ser endereçada por um nome de coluna específico (sendo acessada via `table_line`).

---

### Pergunta 3
**Em uma classe ABAP, você trabalha com um objeto de dados estruturado denominado `struct`. O tipo de estrutura de `struct` contém uma inclusão nomeada (*Named Include*) `%tky` e a estrutura incluída contém um componente `airlineid`. Qual das seguintes instruções provoca um erro de sintaxe?**  
*(Seleção Única)*

- **A.** `struct-airlineid = 'LH'.`
- **B.** `struct-%tky-airlineid = 'LH'.`
- **C.** `struct-%tky = 'LH'.`
- **D.** Nenhuma das anteriores (*None of the above*)

> [!success]- Gabarito e Explicação Oficial da SAP
> **Resposta Correta:** **C**  
> 
> **Fundamentação Oficial da SAP:**  
> Com uma inclusão nomeada (*Named Include*), você pode endereçar os componentes internos tanto diretamente sem o nome do include (`struct-airlineid`) quanto com o nome do include qualificando o caminho (`struct-%tky-airlineid`). No entanto, você não pode endereçar o include nomeado como se fosse um componente estruturado isolado por si só (`struct-%tky`), o que gera um erro de sintaxe.
