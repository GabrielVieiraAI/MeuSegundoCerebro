---
tipo: clippings
title: "Quiz: Defining Basic CDS Views"
source: "https://learning.sap.com/courses/building-data-models-with-the-abap-dictionary-and-abap-core-data-services/defining-basic-cds-views_44d04348-d743-3ad4-b581-44e37262ddc3"
created: 2026-11-03
tags:
  - sap
  - abap
  - abap-cloud
  - quiz
  - cds
  - view-entities
  - annotations
  - annotation-propagation
---
**Roteiro de Estudos Relacionado:** [[Roteiro de Estudos SAP]]

# SAP Learning - Building Data Models with the ABAP Dictionary and ABAP Core Data Services
## Quiz Oficial: Defining Basic CDS Views

> [!NOTE] Instruções de Estudo Ativo
> Tente responder a cada uma das questões mentalmente ou registrando suas opções antes de expandir o bloco retrátil de **Gabarito e Explicação Oficial**.

---

### Pergunta 1
**Quais das seguintes opções são formas corretas de adicionar comentários em uma definição de dados CDS (*Data Definition*)?**  
*(Seleção Múltipla - Escolha as respostas corretas)*

- **A.** `/*…/*`
- **B.** `//`
- **C.** `/*...*/`
- **D.** `"`

> [!success]- Gabarito e Explicação Oficial da SAP
> **Respostas Corretas:** **B** e **C**  
> 
> **Fundamentação Oficial da SAP:**  
> `//` (comentário de linha única) e `/* ... */` (comentário em bloco ou multilinha) são formas sintaticamente corretas de adicionar comentários no código-fonte DDL de uma Data Definition no ABAP CDS. As aspas duplas (`"`) são usadas para comentários no código clássico ABAP, mas **não** são válidas na sintaxe DDL do CDS.

---

### Pergunta 2
**Quais das seguintes anotações podem ser obrigatórias na definição de uma CDS View Entity?**  
*(Seleção Única)*

- **A.** `@AccessControl.authorizationCheck`
- **B.** `@EndUserText.label`
- **C.** `@Semantics.quantity.unitOfMeasure`

> [!success]- Gabarito e Explicação Oficial da SAP
> **Resposta Correta:** **C**  
> 
> **Fundamentação Oficial da SAP:**  
> Apenas as anotações `@Semantics.amount.currencyCode` e `@Semantics.quantity.unitOfMeasure` são exigidas obrigatoriamente pelo verificador de sintaxe (*Syntax Check*) para campos que utilizam tipos de dados monetários (`CURR`) e quantitativos (`QUAN`). Embora anotações como `@AccessControl.authorizationCheck` e `@EndUserText.label` sejam incluídas pelos templates do ADT e recomendadas, a compilação de uma View Entity só é bloqueada com erro de sintaxe pela ausência das anotações semânticas de unidade/moeda.

---

### Pergunta 3
**Você define uma CDS View Entity que lê a partir de outra CDS View Entity. Que tipo de anotações CDS você pode herdar da fonte de dados subjacente (*Data Source*)?**  
*(Seleção Única)*

- **A.** Anotações de entidade (*Entity annotations*)
- **B.** Anotações de elementos (*Element annotations*)

> [!success]- Gabarito e Explicação Oficial da SAP
> **Resposta Correta:** **B**  
> 
> **Fundamentação Oficial da SAP:**  
> O mecanismo de propagação de anotações (*Annotation Propagation*) é suportado exclusivamente para anotações de elementos (*Element Annotations*). Anotações de nível de entidade (*Entity Annotations*) pertencem unicamente à visão onde foram declaradas e nunca são propagadas para visões superiores.
