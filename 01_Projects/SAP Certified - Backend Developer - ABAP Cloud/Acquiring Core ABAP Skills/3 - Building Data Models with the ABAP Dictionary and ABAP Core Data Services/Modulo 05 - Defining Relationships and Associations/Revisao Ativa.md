---
tipo: revisao-ativa
tags:
  - sap
  - abap
  - abap-cloud
  - revisao-ativa
  - modulo-05
  - relationships
  - foreign-keys
  - associations
  - path-expressions
  - cardinality
modulo: 5
nome_modulo: "Defining Relationships and Associations"
status: em andamento
score_notebooklm: 0%
data_inicio: 2026-11-03
data_conclusao: 
---
# Caderno de Revisão Ativa: Módulo 5 - Defining Relationships and Associations

**Revisão Ativa Geral:** [[01_Projects/SAP Certified - Backend Developer - ABAP Cloud/Acquiring Core ABAP Skills/3 - Building Data Models with the ABAP Dictionary and ABAP Core Data Services/00 - Revisão ativa|Revisão Ativa Geral do Curso]]  
**Quiz Oficial SAP:** [[01_Projects/SAP Certified - Backend Developer - ABAP Cloud/Acquiring Core ABAP Skills/3 - Building Data Models with the ABAP Dictionary and ABAP Core Data Services/Modulo 05 - Defining Relationships and Associations/4 - Quiz|Quiz Oficial do Módulo 5]]

---

## Lições do Módulo (1:1 com Portal SAP)
* [[01_Projects/SAP Certified - Backend Developer - ABAP Cloud/Acquiring Core ABAP Skills/3 - Building Data Models with the ABAP Dictionary and ABAP Core Data Services/Modulo 05 - Defining Relationships and Associations/1 - Defining Relationships Between Database Tables|1 - Defining Relationships Between Database Tables]]
* [[01_Projects/SAP Certified - Backend Developer - ABAP Cloud/Acquiring Core ABAP Skills/3 - Building Data Models with the ABAP Dictionary and ABAP Core Data Services/Modulo 05 - Defining Relationships and Associations/2 - Defining Associations Between CDS Views|2 - Defining Associations Between CDS Views]]
* [[01_Projects/SAP Certified - Backend Developer - ABAP Cloud/Acquiring Core ABAP Skills/3 - Building Data Models with the ABAP Dictionary and ABAP Core Data Services/Modulo 05 - Defining Relationships and Associations/3 - Using Associations in Path Expressions|3 - Using Associations in Path Expressions]]
* [[01_Projects/SAP Certified - Backend Developer - ABAP Cloud/Acquiring Core ABAP Skills/3 - Building Data Models with the ABAP Dictionary and ABAP Core Data Services/Modulo 05 - Defining Relationships and Associations/4 - Quiz|4 - Quiz: Defining Relationships and Associations]]

---

## Podcast de Revisão

![[Audio_Modulo_05_Defining_Relationships_and_Associations.m4a]]

---
## Apresentação em Slides (Técnica Feynman)

![[Slides_Modulo_05_Defining_Relationships_and_Associations.pdf]]

---
## Flashcards  

* **Nota de Flashcards:** [[01_Projects/SAP Certified - Backend Developer - ABAP Cloud/Acquiring Core ABAP Skills/3 - Building Data Models with the ABAP Dictionary and ABAP Core Data Services/Flashcards/Flashcards - Modulo 05 - Defining Relationships and Associations|🗂️ Flashcards - Módulo 05]]
* **Deck no Plugin:** `#flashcards/sap/abap-cloud/modulo-05-associations`
* **Quantidade de Cartões:** 16 cartões ativos
* **Tópicos Críticos:** Papéis na relação DDIC (*Foreign Key Table*, *Check Table*, *Check Field*), sintaxe de cardinalidade no dicionário `[n, m]`, anotações semânticas de chave estrangeira (`@AbapCatalog.foreignKey.*`), comportamento de chaves estrangeiras na camada ABAP vs. banco de dados, Associações CDS (`ASSOCIATION TO`) e relacionamentos bidirecionais, convenção de prefixo com underscore (`_`), condição `ON` com `$projection`, cardinalidade padrão `[0..1]`, checagens de plausibilidade do compilador, Associações Expostas (*Exposed Associations*), navegação no *Data Preview* do ADT (`Ctrl + G`), conceito fundamental de **Join on Demand** (JOIN físico gerado estritamente na *Path Expression*), expressões de caminho encadeadas, uso Ad-hoc vs. propagação, restrições e riscos de associações "To-Many" na cláusula `WHERE`, uso de agregações (`GROUP BY`) e documentação de filtros com `[ 1: ... ]`, e sintaxe específica do ABAP SQL moderno (prefixo `\`, separador `-` e cláusula `MANY TO ONE WHERE`).

---
## Baterias de Testes

| Nível | Arquivo do Teste | Data | Score Obtido | Status |
| :--- | :--- | :---: | :---: | :---: |
| **Fácil** | [[01_Projects/SAP Certified - Backend Developer - ABAP Cloud/Acquiring Core ABAP Skills/3 - Building Data Models with the ABAP Dictionary and ABAP Core Data Services/Modulo 05 - Defining Relationships and Associations/Testes/01 - Teste Nivel Facil\|01 - Teste Nivel Facil]] | 03/11 | % | ⚪ Pendente |
| **Médio** | [[01_Projects/SAP Certified - Backend Developer - ABAP Cloud/Acquiring Core ABAP Skills/3 - Building Data Models with the ABAP Dictionary and ABAP Core Data Services/Modulo 05 - Defining Relationships and Associations/Testes/02 - Teste Nivel Medio\|02 - Teste Nivel Medio]] | | % | ⚪ Pendente |
| **Difícil (T1)** | [[01_Projects/SAP Certified - Backend Developer - ABAP Cloud/Acquiring Core ABAP Skills/3 - Building Data Models with the ABAP Dictionary and ABAP Core Data Services/Modulo 05 - Defining Relationships and Associations/Testes/03 - Teste Nivel Dificil (Tentativa 1)\|03 - Teste Nivel Dificil (T1)]] | | % | ⚪ Pendente |

---
## Mapa Mental (Excalidraw)

* **Mapa Mental Interativo:** [[Mapa Mental - Modulo 05 - Defining Relationships and Associations.excalidraw|🧠 Abrir Mapa Mental no Excalidraw]]  
  *(Abra no modo Excalidraw para navegar, dar zoom e editar os nós interativamente)*

![[Mapa Mental - Modulo 05 - Defining Relationships and Associations.excalidraw]]
