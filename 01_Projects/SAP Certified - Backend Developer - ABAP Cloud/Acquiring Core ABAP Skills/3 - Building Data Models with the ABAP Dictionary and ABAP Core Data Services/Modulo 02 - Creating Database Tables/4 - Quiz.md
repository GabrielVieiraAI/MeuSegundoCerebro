---
tipo: clippings
title: "Quiz: Creating Database Tables"
source: "https://learning.sap.com/courses/building-data-models-with-the-abap-dictionary-and-abap-core-data-services/creating-database-tables_89bd5d44-a0c5-31ce-9ef0-94e5bf8ae667"
created: 2026-11-03
tags:
  - sap
  - abap
  - abap-cloud
  - quiz
  - ddic
  - database-tables
---
**Roteiro de Estudos Relacionado:** [[Roteiro de Estudos SAP]]

# SAP Learning - Building Data Models with the ABAP Dictionary and ABAP Core Data Services
## Quiz Oficial: Creating Database Tables

> [!NOTE] Instruções de Estudo Ativo
> Tente responder a cada uma das questões mentalmente ou registrando suas opções antes de expandir o bloco retrátil de **Gabarito e Explicação Oficial**.

---

### Pergunta 1
**Você define uma tabela de banco de dados no ABAP Dictionary. O que é necessário para tornar a tabela de banco de dados dependente de mandante (*client dependent*)?**  
*(Seleção Única)*

- **A.** A anotação `@ABAPCatalog.clientDependent: true`
- **B.** Um campo-chave do tipo `CLNT`
- **C.** Uma configuração correspondente nas Propriedades Técnicas da Tabela (*Technical Table Properties*)

> [!success]- Gabarito e Explicação Oficial da SAP
> **Resposta Correta:** **B**  
> 
> **Fundamentação Oficial da SAP:**  
> Uma tabela de banco de dados é dependente de mandante se possuir um campo-chave (*key field*) do tipo `CLNT`. O sistema ABAP reconhece automaticamente esse campo e restringe todas as consultas padrão ao mandante de logon do usuário.

---

### Pergunta 2
**Quais dos seguintes tipos do dicionário são mapeados para o tipo de dados ABAP P (*packed number*)?**  
*(Selecione todas as opções corretas - Múltipla Escolha)*

- **A.** `CLNT`
- **B.** `DEC`
- **C.** `CURR`
- **D.** `CUKY`

> [!success]- Gabarito e Explicação Oficial da SAP
> **Respostas Corretas:** **B e C**  
> 
> **Fundamentação Oficial da SAP:**  
> Os tipos do dicionário `DEC`, `QUAN` e `CURR` são mapeados para o tipo embutido ABAP `P` (número decimal compactado).  
> `CLNT` e `CUKY` são mapeados para o tipo ABAP `C` (caractere).

---

### Pergunta 3
**Você altera a definição de uma tabela de banco de dados. Em qual dos seguintes cenários você precisa ajustar manualmente a tabela de banco de dados?**  
*(Seleção Única)*

- **A.** A tabela de banco de dados contém dados e você adicionou um campo na tabela.
- **B.** A tabela de banco de dados está vazia e você adicionou um campo na tabela.
- **C.** A tabela de banco de dados contém dados e você excluiu um campo da tabela.
- **D.** A tabela de banco de dados está vazia e você excluiu um campo da tabela.

> [!success]- Gabarito e Explicação Oficial da SAP
> **Resposta Correta:** **C**  
> 
> **Fundamentação Oficial da SAP:**  
> O ajuste manual da tabela é necessário apenas quando existe perigo de perda de dados — ou seja, quando a tabela já contém dados persistidos e você excluiu um campo da tabela.  
> Quando a tabela está vazia, ela pode ser simplesmente excluída e criada novamente. A adição de um novo campo é tratada de forma automática pelo banco através da instrução `ALTER TABLE`.
