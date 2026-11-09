---
tipo: clippings
title: "Defining Dictionary Table Types"
source: "https://learning.sap.com/courses/building-data-models-with-the-abap-dictionary-and-abap-core-data-services/defining-dictionary-table-types_df502cc6-441f-4fdc-aa9e-cc81caf6919c"
created: 2026-11-03
tags:
  - sap
  - abap
  - abap-cloud
  - ddic
  - table-types
  - internal-tables
  - deep-structures
  - adt
---
**Roteiro de Estudos Relacionado:** [[Roteiro de Estudos SAP]]

# Objetivos de Aprendizado

Após concluir esta lição, você será capaz de:
- Definir tipos de tabelas internas globais (*Table Types*) no **ABAP Dictionary**.
- Compreender as opções de configuração do tipo de linha (*Row Type*), categoria de acesso e chaves primárias e secundárias.
- Definir e utilizar tipos de tabelas aninhadas em estruturas profundas (*Deep Structures*).

---

## 1. O que é um Table Type no ABAP Dictionary?

Um **Table Type** no ABAP Dictionary é um objeto de repositório que define globalmente o tipo de uma **tabela interna**.

![[01TableTypes_002.png]]

Diferente de tabelas transparentes de banco de dados (que existem fisicamente no SGBD para persistência em disco), um Table Type existe unicamente na memória durante a execução do programa ABAP.

Ao definir um Table Type no ADT, você configura três propriedades essenciais:
1. **Tipo de Linha (*Row Type / Line Type*):** A estrutura de cada registro contido na tabela.
2. **Categoria de Acesso (*Access Category*):** Como as linhas são organizadas e acessadas na memória (`STANDARD`, `SORTED` ou `HASHED`).
3. **Definição de Chave (*Key Definition*):** Campos que compõem a chave primária e eventuais chaves secundárias, além da unicidade (`UNIQUE` ou `NON-UNIQUE`).

![[01TableTypes_003.png]]

No *Project Explorer* do ADT, esses objetos são gerenciados sob o nó **Dictionary $\rightarrow$ Table Types**.

---

## 2. Opções para Definição do Tipo de Linha (*Row Type*)

O tipo de linha determina quais colunas a tabela interna possuirá:

![[02RowTypeOptions_001.png]]

<iframe 
    src="https://cdnapisec.kaltura.com/p/1921661/embedPlaykitJs/uiconf_id/50355372?iframeembed=true&entry_id=1_8dapgcrl" 
    width="100%" 
    height="400" 
    allowfullscreen 
    frameborder="0">
</iframe>

![[02RowTypeOptions_002.png]]

Existem duas categorias principais de tipos de linha:

| Categoria do Tipo de Linha | Tipo Utilizado | Estrutura Resultante da Tabela Interna |
| :--- | :--- | :--- |
| **Linha Estruturada (*Structured Row Type*)** | Estrutura do Dicionário ou Definição de Tabela de Banco de Dados | A tabela interna possui **colunas nomeadas** (`col1`, `col2`, etc.) que podem ser endereçadas diretamente pelo nome em comandos ABAP. |
| **Linha Elementar (*Elementary Row Type*)** | Elemento de Dados ou Tipo Predefinido | A tabela interna possui uma **única coluna anônima**, cujos valores são endereçados pela pseudo-instrução `table_line`. |

---

## 3. Categorias de Acesso e Chaves (*Access Category and Keys*)

![[03AccessCategoryAndKeys_001.png]]

<iframe 
    src="https://cdnapisec.kaltura.com/p/1921661/embedPlaykitJs/uiconf_id/50355372?iframeembed=true&entry_id=1_74wznkxa" 
    width="100%" 
    height="400" 
    allowfullscreen 
    frameborder="0">
</iframe>

<iframe 
    src="https://cdnapisec.kaltura.com/p/1921661/embedPlaykitJs/uiconf_id/50355372?iframeembed=true&entry_id=1_9dcyd3dp" 
    width="100%" 
    height="400" 
    allowfullscreen 
    frameborder="0">
</iframe>

A categoria de acesso define o algoritmo interno utilizado pela máquina virtual ABAP para indexar e recuperar registros:

### A. Tabela Padrão (*Standard Table*)
- Gerenciada por índice sequencial linear.
- Chave primária é sempre **não-única (*Non-Unique Key*)**.
- Acesso por chave possui complexidade linear $O(n)$, mas permite inserções muito rápidas (`APPEND`).

### B. Tabela Ordenada (*Sorted Table*)
- Os registros são mantidos fisicamente ordenados na memória de acordo com os campos da chave primária.
- A chave primária pode ser **única (*Unique*)** ou **não-única (*Non-Unique*)**.
- Acesso por chave utiliza busca binária com complexidade logarítmica $O(\log n)$.

### C. Tabela Hash (*Hashed Table*)
- Os registros são distribuídos em memória através de um algoritmo de espalhamento (*hash code*).
- A chave primária deve ser **obrigatoriamente única (*Unique Key*)**.
- O tempo de busca por chave completa é constante $O(1)$, independentemente do número de registros na tabela.

![[03AccessCategoryAndKeys_002.png]]

Além da chave primária, você pode configurar **chaves secundárias (*Secondary Keys*)** — ordenadas (*Sorted Keys*) ou não-ordenadas (*Hash Keys*) — para otimizar pesquisas frequentes por critérios alternativos de busca sem duplicar os dados.

---

## 4. Tipos de Tabelas Aninhadas (*Nested Table Types / Deep Structures*)

Uma estrutura que contém um componente cujo tipo de dado é um Table Type é chamada de **Estrutura Profunda (*Deep Structure*)**.

![[04NestedTableTypes_001.png]]

![[04NestedTableTypes_002.png]]

### Exemplo de Modelagem:
Imagine um modelo para empresas onde cada empresa possui múltiplos endereços:
1. `ZADDRESS`: Estrutura com os campos de endereço.
2. `ZADDRESS_TTY`: Table Type cujo tipo de linha é `ZADDRESS`.
3. `ZCOMPANY`: Estrutura contendo o código da empresa e um componente `addresses` tipado com `ZADDRESS_TTY`.

### Acesso no Código ABAP:
```abap
DATA company TYPE zcompany.

company-company_id = 'COMP01'.

" Inserindo linhas na tabela interna aninhada
APPEND VALUE #( street = 'Rua A' city = 'Campinas' ) TO company-addresses.
APPEND VALUE #( street = 'Rua B' city = 'Paulínia' ) TO company-addresses.

" Lendo dados da tabela aninhada
LOOP AT company-addresses INTO DATA(address).
  " Processa cada endereço individual
ENDLOOP.
```

---

## 5. Prática Hands-On: Criar e Utilizar Table Types

> [!NOTE] Objetivo do Exercício
> Neste laboratório prático, você criará um tipo de tabela para armazenar funcionários e outro para múltiplos endereços, consumindo-os em uma classe executável.

---

### Tarefa 1: Criar o Table Type `Z##_EMPLOYEES`
1. No *Project Explorer*, clique com o botão direito no nó **Dictionary** do seu pacote `ZS4D430_##` e selecione:
   **New $\rightarrow$ Table Type**.
2. Preencha os atributos:
   - **Name:** `Z##_EMPLOYEES` *(ex: `Z01_EMPLOYEES`)*
   - **Description:** `Employee Table Type`
3. No editor do Table Type:
   - **Row Type:** Informe o elemento estruturado `Z01_EMPLOYEE` (ou a estrutura correspondente).
   - **Access Category:** Selecione `Standard Table`.
   - **Key Definition:** Selecione `Standard Key` (ou especifique componentes como `employee_id`).
   - **Key Uniqueness:** `Non-Unique`.
4. Salve (**Ctrl + S**) e ative (**Ctrl + F3**).

---

### Tarefa 2: Criar o Table Type `Z##_ADDRESSES`
1. Crie outro Table Type:
   - **Name:** `Z##_ADDRESSES`
   - **Description:** `Addresses Table Type`
2. Configure:
   - **Row Type:** `Z01_ADDRESS`
   - **Access Category:** `Standard Table`
   - **Key Definition:** `Standard Key`, `Non-Unique`.
3. Salve e ative (**Ctrl + F3**).

---

### Tarefa 3: Consumir os Table Types no Código ABAP
Na sua classe executável `ZCL_##_INTRO`, instancie e popule tabelas internas utilizando os Table Types globais do Dicionário:

```abap
  METHOD if_oo_adt_classrun~main.

    DATA employees TYPE z01_employees.

    " Inserindo dados na tabela interna tipada globalmente
    employees = VALUE #(
      ( employee_id = '10000001' first_name = 'Ana'   last_name = 'Souza'  annual_salary = '85000' currency_code = 'EUR' )
      ( employee_id = '10000002' first_name = 'Bruno' last_name = 'Lima'   annual_salary = '92000' currency_code = 'EUR' )
    ).

    out->write( employees ).

  ENDMETHOD.
```
Execute com **F9** para verificar a saída tabular gerada no console.
