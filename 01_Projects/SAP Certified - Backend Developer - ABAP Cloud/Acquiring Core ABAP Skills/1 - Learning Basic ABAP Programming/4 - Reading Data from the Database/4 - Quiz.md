---
title: "Quiz - Reading Data from the Database"
source: "https://learning.sap.com/courses/basic-abap-programming/reading-data-from-the-database"
created: 2026-10-21
tags:
  - sap
  - abap
  - abap-cloud
  - adt
  - quiz
---
**Roteiro de Estudos Relacionado:** [[Roteiro de Estudos SAP]]

# SAP Learning - Basic ABAP Programming
## Quiz: Lendo Dados do Banco de Dados (Reading Data from the Database)

> [!NOTE] Instruções de Estudo Ativo
> Responda às questões marcando os checkboxes antes de expandir o gabarito.

---

### Pergunta 1
**Quais das seguintes opções são fontes de dados válidas para uma entidade CDS View? (Escolha duas opções)**

- **A.** Uma tabela interna
- **B.** Uma tabela de banco de dados
- **C.** Outra entidade CDS View
- **D.** Uma estrutura

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **B, C**  
> **Conceito:** CDS View Entities podem ser construídas consumindo tabelas transparentes de banco de dados ou outras CDS Views/Entities como fontes de dados (*data sources*). Tabelas internas e estruturas existem apenas na memória da aplicação ABAP.

---

### Pergunta 2
**Qual parte do SQL é representada pelo ABAP SQL?**

- **A.** Data Control Language (DCL)
- **B.** Data Definition Language (DDL)
- **C.** Data Manipulation Language (DML)

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **C**  
> **Conceito:** O ABAP SQL representa a camada DML (*Data Manipulation Language*), permitindo operações de consulta e manipulação de dados (`SELECT`, `INSERT`, `UPDATE`, `MODIFY`, `DELETE`).

---

### Pergunta 3
**Qual é a sequência correta de cláusulas em uma instrução `SELECT SINGLE`?**

- **A.** ```abap
  SELECT SINGLE FIELDS ...
  FROM ...
  INTO ...
  WHERE ...
  ```
- **B.** ```abap
  SELECT SINGLE
  FROM ...
  FIELDS ...
  WHERE ...
  INTO ...
  ```
- **C.** ```abap
  SELECT SINGLE
  FROM ...
  FIELDS ...
  INTO ...
  WHERE ...
  ```
- **D.** As cláusulas podem ser escritas em qualquer ordem.

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **B**  
> **Conceito:** Na sintaxe moderna do ABAP SQL, a ordem estrita obrigatória para `SELECT SINGLE` é `FROM ... FIELDS ... WHERE ... INTO ...`.

---

### Pergunta 4
**Você está escrevendo uma instrução `SELECT` que lê dados utilizando uma entidade CDS View. Na lista de campos, você deseja ler um campo de uma tabela associada. O que deve utilizar?**

- **A.** Uma expressão lógica
- **B.** Uma expressão de caminho (*Path Expression*)
- **C.** Uma expressão regular

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **B**  
> **Conceito:** Para navegar por associações declaradas em uma CDS View e acessar campos da entidade alvo na lista de campos ou cláusula `WHERE`, utiliza-se uma *Path Expression* (ex: `\_Association-field`).

---

### Pergunta 5
**Qual é o atalho para visualizar o conteúdo de uma tabela de banco de dados?**

- **A.** F1
- **B.** F2
- **C.** F3
- **D.** F8

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **D**  
> **Conceito:** No ABAP Development Tools (ADT), a tecla de atalho **F8** executa a ferramenta de pré-visualização de dados (*Data Preview*) para tabelas ou CDS Views.

---

## Conceitos-Chave

- **Fontes de Dados em CDS Views:** Entidades CDS consom tabelas de banco de dados e outras CDS Views como fontes de dados, operando diretamente no nível de banco de dados.
- **ABAP SQL e DML:** O ABAP SQL atua estritamente na manipulação de dados (*Data Manipulation Language*), delegando a definição estrutural (DDL) e o controle de autorizações (DCL) aos objetos correspondentes do ABAP Core Data Services e ABAP Dictionary.
- **Sequência de Cláusulas no `SELECT SINGLE`:** A sintaxe estrita moderna do ABAP SQL exige a sequência: `SELECT SINGLE` -> `FROM` -> `FIELDS` -> `WHERE` -> `INTO`.
- **Expressões de Caminho (*Path Expressions*):** Sintaxe baseada em associações que permite percorrer relacionamentos entre CDS Views de forma declarativa e sob demanda sem escrever `JOIN`s manuais.
- **Data Preview no ADT:** O atalho **F8** no Eclipse ADT permite abrir instantaneamente a visualização de registros de tabelas transparentes e CDS Views.
