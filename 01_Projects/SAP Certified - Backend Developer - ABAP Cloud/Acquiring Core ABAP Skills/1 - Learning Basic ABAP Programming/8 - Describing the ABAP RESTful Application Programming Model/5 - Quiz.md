---
title: "Quiz - Descrevendo o ABAP RESTful Application Programming Model (RAP)"
source: "https://learning.sap.com/courses/basic-abap-programming/describing-the-abap-restful-application-programming-model"
created: 2026-10-21
tags:
  - sap
  - abap
  - abap-cloud
  - rap
  - adt
  - quiz
---
**Roteiro de Estudos Relacionado:** [[Roteiro de Estudos SAP]]

# SAP Learning - Basic ABAP Programming
## Quiz: Descrevendo o ABAP RESTful Application Programming Model (RAP)

> [!INFO] Desempenho
> **Aprovação:** 8 de 9 questões corretas

---

### Pergunta 1
**Você precisa exibir uma mensagem de erro. Onde ela deve ser criada?**

- **A.** Em um Text Pool
- **B.** Em uma Classe Global
- **C.** Em uma Classe de Mensagens (*Message Class*)

---

### Pergunta 2
**Onde você declara campos como somente leitura (*read-only*)?**

- **A.** Na Metadata Extension
- **B.** Na Behavior Implementation
- **C.** Na Behavior Definition

---

### Pergunta 3
**Quais das seguintes partes de uma Behavior Definition são geradas automaticamente? (Escolha duas opções)**

- **A.** Habilitação de Draft (*Draft Enabling*)
- **B.** Validações (*Validations*)
- **C.** Determinações (*Determinations*)
- **D.** Operações de Criação, Atualização e Exclusão (*Create, Update e Delete*)

---

### Pergunta 4
**Você deseja gerar os objetos de desenvolvimento para uma aplicação simples utilizando o ABAP RESTful Application Programming Model. Ao definir a tabela de banco de dados, é necessário criar um campo de cliente (*client field*). Qual tipo de dado ele deve possuir?**

- **A.** O tipo embutido do ABAP Dictionary `abap.char(3)`
- **B.** O tipo embutido do ABAP Dictionary `abap.clnt`
- **C.** O elemento de dados `MANDT`

---

### Pergunta 5
**Qual dos seguintes objetos pode ser utilizado para especificar o tipo de dado de uma coluna em uma tabela de banco de dados?**

- **A.** Domain
- **B.** Data Element
- **C.** Local Type

---

### Pergunta 6
**Ao criar uma validação (*Validation*), o que o sistema gera automaticamente?**

- **A.** Um método vazio na classe local da Behavior Implementation
- **B.** Um método vazio na classe global da Behavior Implementation
- **C.** Um método totalmente implementado na classe local da Behavior Implementation
- **D.** Um método totalmente implementado na classe global da Behavior Implementation

---

### Pergunta 7
**Na validação, você utiliza a instrução `READ ENTITIES` para ler os dados informados pelo usuário. Qual parâmetro do método de validação deve ser utilizado para garantir que os dados corretos sejam recuperados?**

- **A.** `REPORTED`
- **B.** `FAILED`
- **C.** `KEYS`

---

### Pergunta 8
**O que a anotação `@Consumption.ValueHelpDefinition` especifica? (Escolha duas opções)**

- **A.** Uma lista de valores possíveis
- **B.** Uma CDS View que fornece a lista de resultados
- **C.** Uma lista de campos exibidos na ajuda de pesquisa
- **D.** O campo que fornece o valor selecionado

---

### Pergunta 9
**Você deseja criar uma aplicação utilizando o ABAP RESTful Application Programming Model por meio do Object Generator. Qual objeto de desenvolvimento é necessário como ponto de partida?**

- **A.** Database Table
- **B.** CDS Entity
- **C.** Behavior Definition
- **D.** Metadata Extension
- **E.** Service Definition
- **F.** Service Binding

---

## Gabarito e Justificativas

| Questão | Resposta | Justificativa / Conceito Técnico                                                                                                                                                                                                                                                                                                    |
| :-----: | :------: | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **P1**  |  **C**   | No ABAP, mensagens do sistema para os usuários (erros, avisos, informações) são centralizadas e gerenciadas em Classes de Mensagens (*Message Classes*, transação SE91 ou no Eclipse ADT), sendo referenciadas por classes de exceção ou estruturas de mensagens do RAP.                                                            |
| **P2**  |  **C**   | O controle formal de mutabilidade de campos (como `field ( readonly ) campo;` ou `field ( mandatory ) campo;`) é declarado diretamente na Definição de Comportamento (*Behavior Definition* - BDEF) da entidade.                                                                                                                    |
| **P3**  | **A, D** | Ao utilizar o gerador de objetos RAP (*Object Generator*), o framework cria automaticamente as operações padrão CRUD (`create`, `update`, `delete`) e os comandos de suporte a rascunho (*Draft Enabling*). Validações e determinações exigem lógica de negócio específica e devem ser declaradas e codificadas pelo desenvolvedor. |
| **P4**  |  **C**   | Para tabelas dependentes de mandante (*client-specific*) que serão utilizadas com os geradores de código do RAP, o campo de cliente deve utilizar o elemento de dados padrão `MANDT`.                                                                                                                                               |
| **P5**  |  **B**   | No ABAP Dictionary, as colunas de uma tabela transparente são definidas por meio de Elementos de Dados (*Data Elements*), que encapsulam a tipagem técnica, rótulos de tela (*field labels*) e regras semânticas. Tipos locais não existem no Dicionário e Domínios não podem ser diretamente vinculados ao campo da tabela.        |
| **P6**  |  **A**   | Ao adicionar uma validação na BDEF, o Quick Fix do Eclipse ADT gera automaticamente o protótipo com a assinatura e o corpo vazio do método na classe local de tratamento (*Local Handler Class*) da *Behavior Implementation* (`lhc_<entidade>`).                                                                                   |
| **P7**  |  **C**   | Métodos de validação e determinação recebem o parâmetro de entrada implícito `KEYS`, que contém as chaves primárias dos registros afetados na transação atual. Esse parâmetro é repassado na cláusula `WITH` da instrução `READ ENTITIES`.                                                                                          |
| **P8**  | **B, D** | A anotação `@Consumption.ValueHelpDefinition` define a ajuda de pesquisa (*Value Help*) vinculando uma entidade CDS de referência (`entity.name`) e mapeando o campo de retorno (`entity.element`) para o atributo anotado.                                                                                                         |
| **P9**  |  **B**   | No fluxo do assistente de geração de repositório (*RAP Object Generator* / *Generate ABAP Repository Objects*), a entidade CDS (*CDS Entity*) atua como objeto de desenvolvimento de partida a partir do qual a estrutura de comportamento, projeções e serviços são gerados.                                                         |

---

## Conceitos-Chave

- **Gestão de Mensagens:** Mensagens de erro e feedback são centralizadas em *Message Classes* (Classes de Mensagens).
- **Controle de Atributos na BDEF:** Regras estruturais de campos (ex: `field ( readonly )`) são definidas na *Behavior Definition*.
- **Recursos Nativos Gerados:** O gerador do RAP automatiza a infraestrutura de *Draft* e as operações CRUD padrão (`create`, `update`, `delete`).
- **Padrão de Mandante:** O elemento de dados `MANDT` é o padrão utilizado para identificar tabelas dependentes de cliente em aplicações RAP.
- **Tipagem no ABAP Dictionary:** Elementos de Dados (*Data Elements*) conferem significado semântico e tipagem às colunas das tabelas de banco de dados.
- **Arquitetura da Behavior Implementation:** A lógica de validações e determinações é implementada nas classes locais (*Local Handler Classes*) da classe global de comportamento (*Behavior Pool*).
- **Parâmetro `KEYS`:** Parâmetro implícito de entrada que fornece as chaves primárias das instâncias modificadas a serem lidas via EML (`READ ENTITIES`).
- **Value Help com Anotações CDS:** A anotação `@Consumption.ValueHelpDefinition` vincula uma CDS View auxiliar e seu elemento de retorno para fornecer a lista de valores em interfaces Fiori.
- **Ponto de Partida no Object Generator:** A entidade CDS (*CDS Entity*) é o objeto de desenvolvimento utilizado como base inicial para disparar a geração dos objetos de repositório RAP via assistente.
