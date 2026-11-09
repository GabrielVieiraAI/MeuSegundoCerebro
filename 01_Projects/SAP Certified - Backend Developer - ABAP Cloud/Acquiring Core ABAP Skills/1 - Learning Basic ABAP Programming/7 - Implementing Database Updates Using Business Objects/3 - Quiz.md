---
title: "Quiz - Implementing Database Updates Using Business Objects"
source: "https://learning.sap.com/courses/basic-abap-programming/using-the-entity-manipulation-language_b378f225-0471-45bf-8b7a-f48d00e1bccb"
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
## Quiz: Implementando Atualizações no Banco de Dados Usando Objetos de Negócio (Implementing Database Updates Using Business Objects)

> [!NOTE] Instruções de Estudo Ativo
> Responda às questões marcando os checkboxes antes de expandir o gabarito.

---

### Pergunta 1
**Na instrução `READ ENTITIES`, você utiliza uma tabela interna com um tipo especial (`TYPE TABLE FOR READ RESULT`). Como esse tipo é criado?**

- **A.** O desenvolvedor do objeto de negócio o cria como um tipo global.
- **B.** O desenvolvedor do objeto de negócio o cria na implementação do comportamento (*Behavior Implementation*).
- **C.** O sistema o cria automaticamente.

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **C**  
> **Conceito:** O compilador ABAP e o framework RAP geram automaticamente os tipos derivados do BOBJ (como `TYPE TABLE FOR READ RESULT`, `TYPE TABLE FOR ACTION IMPORT`, etc.) com base na definição de comportamento (*Behavior Definition - BDEF*). O desenvolvedor não precisa criar esses tipos manualmente.

---

### Pergunta 2
**No cenário apresentado, o que é codificado em uma implementação de comportamento (*Behavior Implementation*)? (Escolha duas opções)**

- **A.** Validações (*Validations*)
- **B.** Determinações (*Determinations*)
- **C.** Atualização (*Update*)

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **A, B**  
> **Conceito:** No framework RAP com implementação gerenciada (*Managed BO*), operações CRUD padrão como *Update* são fornecidas e tratadas automaticamente pelo framework. O desenvolvedor implementa manualmente nas classes de comportamento (*Behavior Pool*) a lógica de negócio personalizada, como Validações (*Validations*) e Determinações (*Determinations*).

---

## Conceitos-Chave

- **Tipos Derivados de BDEF (EML):** O compilador ABAP gera tipos derivados em tempo de design/compilação especificamente para operações EML (ex: `TYPE TABLE FOR READ RESULT ...`), eliminando a necessidade de declaração manual de estruturas ou tipos de tabela.
- **Lógica de Negócio Customizada vs. Framework:** Em cenários RAP gerenciados (*Managed*), operações padrão de modificação (Create, Update, Delete) são executadas diretamente pelo motor do framework RAP.
- **Validações (*Validations*):** Rotinas disparadas em pontos do ciclo de vida para verificar a consistência e integridade das entidades, rejeitando gravações inválidas com mensagens de erro.
- **Determinações (*Determinations*):** Rotinas automáticas executadas para preencher, calcular ou derivar campos e valores de negócio em resposta a alterações de estado ou criação de instâncias.
