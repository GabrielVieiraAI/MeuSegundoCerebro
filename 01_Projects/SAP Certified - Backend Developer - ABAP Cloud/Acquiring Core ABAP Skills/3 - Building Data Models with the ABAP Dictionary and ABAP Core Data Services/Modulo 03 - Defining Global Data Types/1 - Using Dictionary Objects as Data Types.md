---
tipo: clippings
title: "Using Dictionary Objects as Data Types"
source: "https://learning.sap.com/courses/building-data-models-with-the-abap-dictionary-and-abap-core-data-services/using-dictionary-objects-as-data-types_e28df7c3-7686-414e-9827-673dceeb21fb"
created: 2026-11-03
tags:
  - sap
  - abap
  - abap-cloud
  - ddic
  - data-types
  - data-elements
  - structures
  - table-types
  - adt
---
**Roteiro de Estudos Relacionado:** [[Roteiro de Estudos SAP]]

# Objetivos de Aprendizado

Após concluir esta lição, você será capaz de:
- Descrever e exemplificar a utilização de objetos do **ABAP Dictionary** como tipos de dados no código ABAP.
- Diferenciar tipos globais do dicionário de tipos locais declarados com a instrução `TYPES`.
- Identificar as categorias de objetos do dicionário utilizáveis como tipos escalares, estruturados e tabulares.

---

## 1. Objetos do Dicionário como Tipos de Dados Globais

No desenvolvimento ABAP, tipos de dados podem ser definidos em dois níveis de visibilidade:
1. **Tipos Locais:** Declarados diretamente dentro de uma classe, programa ou interface utilizando a instrução ABAP `TYPES`. Sua visibilidade é restrita ao bloco ou classe onde foram declarados.
2. **Tipos Globais:** Definidos de forma centralizada no **ABAP Dictionary (DDIC)**. Estão disponíveis e visíveis em todo o repositório do sistema SAP.

![[01DictionaryObjectsAsDataTypes_001.png]]

A classificação dos objetos do dicionário utilizáveis após a cláusula `TYPE` em instruções `DATA` ou `TYPES` compreende três grandes grupos:

![[01DictionaryObjectsAsDataTypes_002.png]]

### A. Tipos Elementares / Escalares (*Elementary Data Types*)
* **Elemento de Dados (*Data Element*):**
  - Define tipos de variáveis de campo único (ex: identificador de funcionário, montante salarial, data).
  - Além das propriedades técnicas herdadas de um domínio ou tipo predefinido, agrega metadados semânticos de negócio (rótulos de campo *Short, Medium, Long, Heading* e documentação).

### B. Tipos Estruturados (*Structured Data Types*)
* **Estrutura do Dicionário (*Dictionary Structure*):**
  - Define um formato composto por múltiplos campos nomeados (uma linha de registro em memória).
  - É o padrão recomendado para declarar variáveis estruturadas no código ABAP (`DATA ls_record TYPE zstructure`).
* **Definição de Tabela de Banco de Dados (*Database Table Definition*):**
  - O objetivo primário de uma tabela do DDIC é definir a persistência física no banco relacional.
  - No entanto, a definição da tabela também pode atuar tecnicamente como um tipo estruturado no código ABAP (`DATA ls_row TYPE zemployee`), contendo campos que correspondem exatamente às colunas da tabela física.

> [!NOTE] Recomendação de Arquitetura
> Como diretriz de boas práticas, evite utilizar definições de tabelas transparentes como tipos de dados para variáveis no código. Prefira sempre utilizar estruturas dedicadas do Dicionário.

### C. Tipos de Tabela (*Table Types*)
* **Tipo de Tabela do Dicionário (*Dictionary Table Type*):**
  - Modela o tipo de uma **tabela interna** completa globalmente no sistema.
  - Especifica o formato das linhas (*Row Type*), a categoria de acesso (`STANDARD`, `SORTED`, `HASHED`) e a definição de chaves primárias e secundárias.

---

## 2. Prática: Experimentando Objetos do Dicionário como Tipos

Para comprovar a flexibilidade de tipagem do Dicionário no código-fonte ABAP:

```abap
CLASS zcl_demo_types DEFINITION
  PUBLIC
  FINAL
  CREATE PUBLIC .

  PUBLIC SECTION.
    INTERFACES if_oo_adt_classrun .
  PROTECTED SECTION.
  PRIVATE SECTION.
ENDCLASS.

CLASS zcl_demo_types IMPLEMENTATION.

  METHOD if_oo_adt_classrun~main.

    " 1. Tipo Escalar via Elemento de Dados
    DATA lv_employee_id TYPE /lrn/employee_id.

    " 2. Tipo Estruturado via Estrutura do Dicionário
    DATA ls_admin_data  TYPE z01_admin.

    " 3. Tipo Estruturado via Definição de Tabela de Banco de Dados
    DATA ls_emp_record  TYPE z01_employee.

    " 4. Tipo de Tabela Interna via Table Type do Dicionário
    DATA lt_employees   TYPE /lrn/s4d430_emp_t.

  ENDMETHOD.

ENDCLASS.
```

Todos os 4 exemplos acima compilam com sucesso, demonstrando como o compilador ABAP resolve as definições do DDIC durante o *Syntax Check*.

---

## 3. Elementos de Dados como Tipos de Dados

Ao utilizar um elemento de dados no código ABAP, o compilador e as ferramentas de desenvolvimento integram os metadados semânticos diretamente ao editor:

![[02DataElementAsDataType_001.png]]

- Ao posicionar o cursor sobre a variável e pressionar **`F2`** (*Element Info*) no ADT, uma janela suspensa exibe a descrição do elemento de dados, os rótulos de campo configurados (*Field Labels*) e o domínio técnico subjacente.
- Frameworks de saída, relatórios e telas que consomem essa variável utilizam automaticamente esses rótulos para gerar cabeçalhos de colunas padronizados sem exigir textos fixos codificados manualmente (*hardcoded*).
