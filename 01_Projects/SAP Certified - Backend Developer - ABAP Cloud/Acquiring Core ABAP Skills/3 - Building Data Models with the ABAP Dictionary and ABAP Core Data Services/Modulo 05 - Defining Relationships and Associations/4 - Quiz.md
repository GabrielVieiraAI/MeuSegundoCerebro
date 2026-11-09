---
tipo: clippings
title: "Quiz: Defining Relationships and Associations"
source: "https://learning.sap.com/courses/building-data-models-with-the-abap-dictionary-and-abap-core-data-services/defining-relationships-and-associations_b1fe4a16-895d-3a64-b660-0a8fdcb9f8f0"
created: 2026-11-03
tags:
  - sap
  - abap
  - abap-cloud
  - quiz
  - ddic
  - foreign-keys
  - cds
  - associations
  - path-expressions
  - cardinality
---
**Roteiro de Estudos Relacionado:** [[Roteiro de Estudos SAP]]

# SAP Learning - Building Data Models with the ABAP Dictionary and ABAP Core Data Services
## Quiz Oficial: Defining Relationships and Associations

> [!NOTE] Instruções de Estudo Ativo
> Tente responder a cada uma das questões mentalmente ou registrando suas opções antes de expandir o bloco retrátil de **Gabarito e Explicação Oficial**.

---

### Pergunta 1
**Qual das seguintes opções representa a cardinalidade padrão de uma associação CDS se nenhuma cardinalidade for especificada?**  
*(Seleção Única)*

- **A.** `[0..1]`
- **B.** `[0..*]`
- **C.** `[1..1]`
- **D.** Nenhuma (*none*)

> [!success]- Gabarito e Explicação Oficial da SAP
> **Resposta Correta:** **A** (`[0..1]`)  
> 
> **Fundamentação Oficial da SAP:**  
> A cardinalidade padrão de uma associação no ABAP CDS, quando omitida na cláusula `association to`, é `[0..1]`. Se apenas o valor máximo for informado (como `[1]`), o limite inferior assume implicitamente `0`, resultando em `[0..1]`.

---

### Pergunta 2
**Você define uma dependência de chave estrangeira (*Foreign Key Dependency*) no ABAP Dictionary. Qual é o efeito real dessa definição?**  
*(Seleção Múltipla - Escolha as respostas corretas)*

- **A.** Integridade e consistência de dados forçada diretamente na camada de banco de dados (*Enforced data consistency on database level*).
- **B.** Verificações de entrada automáticas geradas em diálogos clássicos de usuário (*Generated input checks in classical user dialogues*).
- **C.** Verificações de entrada geradas automaticamente em uma aplicação SAP Fiori (*Generated input checks in a SAP Fiori application*).
- **D.** O relacionamento entre as tabelas é documentado formalmente na camada do ABAP Dictionary (*The relationship is documented on ABAP dictionary level*).

> [!success]- Gabarito e Explicação Oficial da SAP
> **Respostas Corretas:** **B** e **D**  
> 
> **Fundamentação Oficial da SAP:**  
> No desenvolvimento ABAP clássico, dependências de chave estrangeira eram utilizadas pelas telas Dynpro para gerar validações implícitas de entrada (*Input Checks*). No desenvolvimento ABAP moderno (ABAP Cloud / CDS / Fiori), essas dependências funcionam primordialmente para documentar as relações entre tabelas na camada de dicionário. As chaves estrangeiras do ABAP Dictionary **não** são repassadas ao banco de dados relacional físico como restrições de integridade (*Foreign Key Constraints*) e são ignoradas pelas técnicas de desenvolvimento baseadas em ABAP CDS e Fiori Elements.

---

### Pergunta 3
**Você define uma CDS View Entity com uma associação. Em qual momento essa associação é traduzida e executada como um JOIN na camada de banco de dados?**  
*(Seleção Única)*

- **A.** Assim que você define a associação na cláusula `FROM` (*As soon as you define the association*).
- **B.** No momento em que você adiciona e expõe a associação na lista de elementos (*When you add the association to the element list*).
- **C.** Quando você utiliza a associação em uma expressão de caminho (*When you use the association in a path expression*).

> [!success]- Gabarito e Explicação Oficial da SAP
> **Resposta Correta:** **C**  
> 
> **Fundamentação Oficial da SAP:**  
> A associação é convertida fisicamente em um JOIN de banco de dados **apenas** quando é utilizada em uma expressão de caminho (*Path Expression*), seja na própria CDS View, em uma visão de nível superior ou em um comando `SELECT` do ABAP SQL. Apenas definir e expor a associação na lista de elementos não provoca a criação de junções na camada física de dados (*Join on Demand*).
