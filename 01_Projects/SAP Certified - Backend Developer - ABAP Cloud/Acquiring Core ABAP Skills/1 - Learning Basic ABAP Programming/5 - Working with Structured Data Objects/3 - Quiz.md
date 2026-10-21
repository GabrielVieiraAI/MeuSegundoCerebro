---
title: "Quiz - Working with Structured Data Objects"
source: "https://learning.sap.com/courses/basic-abap-programming/working-with-structured-data-objects_ca4e0b14-57ad-4993-a83b-cca17980399c"
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
## Quiz: Trabalhando com Objetos de Dados Estruturados (Working with Structured Data Objects)

> [!INFO] Desempenho
> **Aprovação:** 3 de 3 questões corretas

---

### Pergunta 1
**Uma estrutura `struct` contém um componente `comp`. Como você acessa esse componente?**

- **A.** `struct.comp`
- **B.** `struct-comp`
- **C.** `struct->comp`
- **D.** `struct=>comp`

---

### Pergunta 2
**O que você deve lembrar ao copiar dados entre estruturas usando a expressão `CORRESPONDING`?**

- **A.** Apenas componentes com nomes idênticos são copiados.
- **B.** Os componentes são copiados de acordo com suas posições.
- **C.** Apenas componentes com tipos idênticos são copiados.

---

### Pergunta 3
**Você declara uma variável usando a instrução abaixo:**

```abap
DATA struct TYPE ...
```

**Quais das opções a seguir podem ser usadas para declarar uma estrutura? (Escolha duas opções)**

- **A.** Uma tabela de banco de dados
- **B.** Um elemento de dados (*Data Element*)
- **C.** Uma CDS View
- **D.** Um tipo ABAP predefinido

---

## Gabarito e Justificativas

| Questão | Resposta | Justificativa / Conceito Técnico |
| :---: | :---: | :--- |
| **P1** | **B** | No ABAP, o operador hífen (`-`) é o seletor padrão de componentes para acessar campos de estruturas (`struct-comp`). O operador `->` é o seletor de componentes de instância de classes e **`=>`** é o seletor de componentes estáticos de classes. |
| **P2** | **A** | A expressão construtora `CORRESPONDING #( ... )` transfere dados mapeando exclusivamente componentes que compartilham o mesmo nome (*mapping by name*). A ordem posicional dos campos na estrutura é desconsiderada. |
| **P3** | **A, C** | Tabelas de banco de dados e CDS Views fornecem tipos estruturados compostos no repositório de dados. Já os *Data Elements* e tipos predefinidos da linguagem ABAP (como `i`, `c`, `string`) definem tipos elementares, não estruturas completas. |

---

## Conceitos-Chave

- **Acesso a Componentes de Estruturas:** Utiliza-se exclusivamente o caractere hífen (`-`) como seletor de componentes (ex: `struct-componente`).
- **Expressão `CORRESPONDING`:** Realiza atribuição de dados entre estruturas baseada estritamente na correspondência de nomes idênticos (*mapping by name*), ignorando posições físicas relativas.
- **Fontes de Tipos Estruturados:** Tabelas de banco de dados e entidades CDS View possuem formato de linha com múltiplos campos e podem ser referenciadas diretamente na tipagem de estruturas (`DATA struct TYPE ...`).
- **Tipos Elementares vs. Estruturados:** Elementos de dados (*Data Elements*) e tipos elementares do ABAP representam campos atômicos individuais, e não estruturas completas.
