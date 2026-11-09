---
tipo: clippings
title: "Quiz: Defining Meta Objects for Dictionary Objects and CDS Views"
source: "https://learning.sap.com/courses/building-data-models-with-the-abap-dictionary-and-abap-core-data-services/defining-meta-objects-for-dictionary-objects-and-cds-views_53800c8f-1a58-3850-8dc4-d24bfe97b280"
created: 2026-11-03
tags:
  - sap
  - abap
  - abap-cloud
  - quiz
  - cds
  - security
  - extensibility
  - append-structures
  - metadata-extensions
---
**Roteiro de Estudos Relacionado:** [[Roteiro de Estudos SAP]]

# SAP Learning - Building Data Models with the ABAP Dictionary and ABAP Core Data Services
## Quiz Oficial: Defining Meta Objects for Dictionary Objects and CDS Views

> [!NOTE] Instruções de Estudo Ativo
> Tente responder a cada uma das questões mentalmente ou registrando suas opções antes de expandir o bloco retrátil de **Gabarito e Explicação Oficial**.

---

### Pergunta 1
**Todas as condições de acesso em CDS Roles são baseadas em autorizações de usuário.**  
*(Verdadeiro ou Falso)*

- **A.** Verdadeiro (*True*)
- **B.** Falso (*False*)

> [!success]- Gabarito e Explicação Oficial da SAP
> **Resposta Correta:** **B** (Falso)  
> 
> **Fundamentação Oficial da SAP:**  
> Além das condições baseadas em autorizações do usuário (aspectos PFCG com `aspect pfcg_auth`), as regras de CDS Access Control também suportam **condições literais/simples** (comparações fixas de valores ou checagens contra variáveis de sessão, como `DepartmentId = 'ADMIN'`) e **condições de herança** (*Inheriting Conditions*).

---

### Pergunta 2
**Uma CDS View Entity contém um elemento de visão com o nome `ID`. O valor ativo da anotação de elemento `@EndUserText.label` para esse elemento provém de uma Metadata Extension configurada na camada `#INDUSTRY`. Agora você deseja criar uma Metadata Extension adicional para sobrescrever esse texto de rótulo. Com quais valores para a anotação `@Metadata.layer` você pode alcançar esse objetivo?**  
*(Seleção Múltipla - Escolha as respostas corretas)*

- **A.** `#PARTNER`
- **B.** `#CUSTOMER`
- **C.** `#CORE`
- **D.** `#LOCALIZATION`

> [!success]- Gabarito e Explicação Oficial da SAP
> **Respostas Corretas:** **A** (`#PARTNER`) e **B** (`#CUSTOMER`)  
> 
> **Fundamentação Oficial da SAP:**  
> Metadados declarados nas camadas `#CUSTOMER` (1ª prioridade) e `#PARTNER` (2ª prioridade) possuem precedência superior à camada `#INDUSTRY` (3ª prioridade). Em contrapartida, as camadas `#LOCALIZATION` (4ª prioridade) e `#CORE` (5ª prioridade) possuem prioridade menor e não podem ser utilizadas para sobrescrever um valor ativo proveniente de `#INDUSTRY`.

---

### Pergunta 3
**Você deseja estender uma tabela de banco de dados do dicionário com um campo `ZZMYFIELD`. A definição da tabela contém a anotação `@AbapCatalog.enhancement.category`. Para quais dos seguintes valores dessa anotação o campo `ZZMYFIELD` pode possuir o tipo predefinido `INT4`?**  
*(Seleção Múltipla - Escolha as respostas corretas)*

- **A.** `#NOT_EXTENSIBLE`
- **B.** `#EXTENSIBLE_CHARACTER`
- **C.** `#EXTENSIBLE_CHARACTER_NUMERIC`
- **D.** `#EXTENSIBLE_ANY`

> [!success]- Gabarito e Explicação Oficial da SAP
> **Respostas Corretas:** **C** (`#EXTENSIBLE_CHARACTER_NUMERIC`) e **D** (`#EXTENSIBLE_ANY`)  
> 
> **Fundamentação Oficial da SAP:**  
> O tipo `INT4` é um tipo de dados numérico. A inclusão de campos numéricos exige que a tabela esteja classificada com `#EXTENSIBLE_ANY` ou pelo menos `#EXTENSIBLE_CHARACTER_NUMERIC`. A categoria `#EXTENSIBLE_CHARACTER` permite apenas campos alfanuméricos/texto, enquanto `#NOT_EXTENSIBLE` proíbe qualquer extensão na tabela.

---

### Pergunta 4
**Quais das seguintes extensões são permitidas em uma CDS View que NÃO contém a anotação `@AbapCatalog.viewEnhancementCategory`?**  
*(Seleção Múltipla - Escolha as respostas corretas)*

- **A.** Campos adicionais na lista de elementos (*Additional fields in the element list*).
- **B.** Expressões adicionais na lista de elementos (*Additional expressions in the element list*).
- **C.** Campos adicionais na cláusula `GROUP BY` (*Additional fields in the GROUP BY - clause*).
- **D.** Associações adicionais na lista de elementos (*Additional associations in the element list*).

> [!success]- Gabarito e Explicação Oficial da SAP
> **Respostas Corretas:** **A**, **B** e **D**  
> 
> **Fundamentação Oficial da SAP:**  
> Por padrão, quando uma CDS View Entity não especifica explicitamente a anotação `@AbapCatalog.viewEnhancementCategory`, a extensão permitida limita-se à lista de projeção/elementos, sendo possível adicionar novos campos, novas expressões SQL e novas associações. Modificações estruturais na cláusula `GROUP BY` exigem configuração explícita e compatível de ampliação.
