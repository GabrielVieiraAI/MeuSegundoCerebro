---
tipo: clippings
title: "Creating Database Tables"
source: "https://learning.sap.com/courses/building-data-models-with-the-abap-dictionary-and-abap-core-data-services/creating-database-tables_ebc1477d-96ed-414b-82d4-4171da43f4a6"
created: 2026-11-03
tags:
  - sap
  - abap
  - abap-cloud
  - ddic
  - database-tables
  - include-structures
  - annotations
  - clean-core
  - adt
---
**Roteiro de Estudos Relacionado:** [[Roteiro de Estudos SAP]]

# Objetivos de Aprendizado

Após concluir esta lição, você será capaz de:
- Criar a definição de uma tabela transparente de banco de dados no **ABAP Development Tools (ADT)**.
- Editar a lista de campos de uma tabela utilizando a sintaxe de código-fonte moderna.
- Configurar e manter propriedades adicionais e anotações técnicas da tabela (*Technical Settings*).
- Definir e utilizar estruturas de inclusão (*Include Structures*) para reutilização padronizada de campos.

---

## 1. Criação da Definição de uma Tabela

No Eclipse ADT, a definição de tabelas de banco de dados não utiliza mais telas gráficas da clássica transação `SE11`. Em vez disso, tabelas são criadas e mantidas diretamente através de um **editor baseado em código-fonte (*Source Code-based Editor*)**.

![[01CreatingTable_001.png]]

<iframe 
    src="https://cdnapisec.kaltura.com/p/1921661/embedPlaykitJs/uiconf_id/50355372?iframeembed=true&entry_id=1_6drfdd31" 
    width="100%" 
    height="400" 
    allowfullscreen 
    frameborder="0">
</iframe>

### Passos para Criação:
1. No *Project Explorer*, clique com o botão direito sobre o seu pacote e escolha: **New $\rightarrow$ Other... $\rightarrow$ Database Table** (ou atalho direto no menu de contexto).
2. Forneça o nome da tabela (em projetos de clientes, iniciado por `Z` ou `Y`, ou prefixo de namespace registrado) e a descrição.
3. Ao finalizar, o editor de código do ADT é aberto exibindo um template pré-preenchido com anotações e a estrutura básica da tabela.

---

## 2. Edição da Lista de Campos (*Field List*)

A definição dos campos de uma tabela no ADT é feita utilizando sintaxe declarativa em texto estruturado:

![[02EditingtheFieldList_001.png]]

<iframe 
    src="https://cdnapisec.kaltura.com/p/1921661/embedPlaykitJs/uiconf_id/50355372?iframeembed=true&entry_id=1_zxko0biv" 
    width="100%" 
    height="400" 
    allowfullscreen 
    frameborder="0">
</iframe>

![[02EditingtheFieldList_002.png]]

### Sintaxe Básica de Declaração de Campo:
```abap
[key] field_name : type_name [not null];
```

* **`key`**: Indica que o campo faz parte da chave primária da tabela. Todos os campos de chave primária devem ser agrupados no topo da lista de campos.
* **`field_name`**: Nome do campo no dicionário e na coluna física do banco de dados (máximo de 30 caracteres, sem diferenciação de maiúsculas/minúsculas).
* **`type_name`**: Nome do elemento de dados ou tipo predefinido.
* **`not null`**: Cláusula mandatória para todos os campos-chave e recomendada para os demais campos no modelo moderno, garantindo que o banco de dados inicialize a coluna com o valor inicial padrão do tipo, evitando valores `NULL`.

---

### Dependência de Mandante (*Client Dependency*)

![[02EditingtheFieldList_003.png]]

Para tornar uma tabela dependente de mandante, o primeiro campo-chave da tabela deve ser obrigatoriamente um campo de mandante:
```abap
key client : abap.clnt not null;
```
Quando o campo de mandante está presente, qualquer consulta ABAP SQL (`SELECT`) executada sobre essa tabela restringirá automaticamente o resultado ao mandante em que a sessão do usuário está autenticada, sem necessidade de cláusula `WHERE client = ...`.

---

### Campos de Moeda (`CURR`) e Quantidade (`QUAN`)

![[02EditingtheFieldList_004.png]]

Ao adicionar um campo do tipo montante/moeda (`CURR`) ou do tipo quantidade (`QUAN`), o compilador do Dicionário exige obrigatoriamente um vínculo semântico a um campo de referência:
- Um campo `CURR` exige referência a uma coluna de código de moeda (tipo `CUKY`).
- Um campo `QUAN` exige referência a uma coluna de unidade de medida (tipo `UNIT`).

Esse vínculo é declarado através de anotações semânticas diretamente acima do campo:

```abap
@Semantics.amount.currencyCode : 'zemployee.currency_code'
annual_salary : /lrn/annual_salary not null;
currency_code : abap.cuky not null;
```

<iframe 
    src="https://cdnapisec.kaltura.com/p/1921661/embedPlaykitJs/uiconf_id/50355372?iframeembed=true&entry_id=1_po292i6e" 
    width="100%" 
    height="400" 
    allowfullscreen 
    frameborder="0">
</iframe>

![[02EditingtheFieldList_005.png]]

> [!TIP] Correção Rápida (*Quick Fix*) no Eclipse
> Se você esquecer de declarar a anotação para um campo de moeda ou quantidade, o ADT exibirá um sublinhado de erro. Posicione o cursor sobre o erro e pressione **`Ctrl + 1`** (*Quick Fix*) para que o Eclipse insira automaticamente o template da anotação `@Semantics`.

---

## 3. Propriedades Adicionais da Tabela (*Table Annotations*)

Acima da instrução `define table`, você configura as propriedades técnicas e operacionais da tabela utilizando anotações de catálogo:

![[03TableProperties_001.png]]

<iframe 
    src="https://cdnapisec.kaltura.com/p/1921661/embedPlaykitJs/uiconf_id/50355372?iframeembed=true&entry_id=1_uiuxxnou" 
    width="100%" 
    height="400" 
    allowfullscreen 
    frameborder="0">
</iframe>

```abap
@EndUserText.label : 'Employee Data Table'
@AbapCatalog.enhancement.category : #NOT_EXTENSIBLE
@AbapCatalog.tableCategory : #TRANSPARENT
@AbapCatalog.deliveryClass : #A
@AbapCatalog.dataMaintenance : #RESTRICTED
define table zemployee { ... }
```

<iframe 
    src="https://cdnapisec.kaltura.com/p/1921661/embedPlaykitJs/uiconf_id/50355372?iframeembed=true&entry_id=1_4eu9k1kc" 
    width="100%" 
    height="400" 
    allowfullscreen 
    frameborder="0">
</iframe>

### Principais Anotações Técnicas:

1. **Classe de Entrega (`@AbapCatalog.deliveryClass`):**
   ![[03TableProperties_004.png]]
   Controla a logística de transporte e a manutenção dos dados:
   - **`#A` (Tabela de Aplicação):** Para dados mestres e transacionais de negócio.
   - **`#C` (Tabela de Customizing):** Para tabelas de configuração do sistema mantidas por consultores funcionais.
   - **`#L` (Dados Temporários):** Tabelas de log ou buffers que não devem ser transportadas entre ambientes.

2. **Manutenção de Dados (`@AbapCatalog.dataMaintenance`):**
   ![[03TableProperties_003.png]]
   Determina se e como os dados podem ser editados manualmente por ferramentas de administração (como a transação `SM30` / Data Preview):
   - **`#NOT_ALLOWED`**: Edição direta proibida; dados só podem ser alterados via lógica programada em código ABAP.
   - **`#RESTRICTED`**: Manutenção permitida apenas com restrições ou por ferramentas autorizadas.
   - **`#ALLOWED`**: Manutenção manual livre permitida.

3. **Categoria de Extensibilidade (`@AbapCatalog.enhancement.category`):**
   Determina se a tabela pode ser ampliada por clientes ou parceiros através de estruturas de ampliação (*Appends*):
   - `#NOT_EXTENSIBLE`
   - `#EXTENSIBLE_CHARACTER` / `#EXTENSIBLE_NUMERIC` / `#EXTENSIBLE_ANY`

---

## 4. Tabelas de Banco de Dados com Estruturas de Inclusão (*Include Structures*)

Em arquiteturas corporativas, é muito comum que múltiplos tipos de tabelas compartilhem grupos idênticos de campos (por exemplo, campos de auditoria como `created_by`, `created_at`, `last_changed_by`, `last_changed_at`).

![[04TablesWithIncludes_001.png]]

Para evitar a repetição manual desses campos em dezenas de tabelas, o ABAP Dictionary permite criar uma **Estrutura (*Structure*)** e incluí-la diretamente na definição da tabela.

![[04TablesWithIncludes_002.png]]

<iframe 
    src="https://cdnapisec.kaltura.com/p/1921661/embedPlaykitJs/uiconf_id/50355372?iframeembed=true&entry_id=1_fuoi9idr" 
    width="100%" 
    height="400" 
    allowfullscreen 
    frameborder="0">
</iframe>

### Sintaxe de Inclusão:
```abap
include structure_name [as suffix_name [renaming with suffix suffix_name]];
```

![[04TablesWithIncludes_003.png]]

* Se houver risco de colisão de nomes entre campos da tabela e campos da estrutura incluída, a cláusula `renaming with suffix` adiciona automaticamente um sufixo a todos os campos da estrutura.

![[04TablesWithIncludes_004.png]]

---

## 5. Prática Hands-On: Criar uma Tabela de Banco de Dados com Include

> [!NOTE] Objetivo do Exercício
> Neste laboratório prático, você criará uma estrutura de inclusão com campos de auditoria/administração e em seguida criará a tabela transparente `Z##_EMPLOYEE` incorporando essa estrutura.

---

### Tarefa 1: Criar a Estrutura de Inclusão `Z##_ADMIN`
1. No *Project Explorer*, clique com o botão direito no nó **Dictionary** do seu pacote `ZS4D430_##` e selecione:
   **New $\rightarrow$ Structure**.
2. Preencha os atributos:
   - **Name:** `Z##_ADMIN` *(ex: `Z01_ADMIN`)*
   - **Description:** `Administrative Data Include`
3. No editor de código, defina os campos de auditoria:

```abap
@EndUserText.label : 'Administrative Data'
@AbapCatalog.enhancement.category : #NOT_EXTENSIBLE
define structure z01_admin {
  created_by            : abp_creation_user;
  created_at            : abp_creation_tstmpl;
  last_changed_by       : abp_locinst_lastchange_user;
  last_changed_at       : abp_locinst_lastchange_tstmpl;
}
```
4. Salve (**Ctrl + S**) e ative a estrutura (**Ctrl + F3**).

---

### Tarefa 2: Criar a Tabela Transparente `Z##_EMPLOYEE`
1. No seu pacote, escolha **New $\rightarrow$ Database Table**.
2. Preencha os dados:
   - **Name:** `Z##_EMPLOYEE` *(ex: `Z01_EMPLOYEE`)*
   - **Description:** `Employee Table`
3. Configure o código completo da tabela, adicionando a dependência de mandante, os campos de negócio criados na lição anterior, as referências de moeda e o include da estrutura administrativa:

```abap
@EndUserText.label : 'Employee Table'
@AbapCatalog.enhancement.category : #NOT_EXTENSIBLE
@AbapCatalog.tableCategory : #TRANSPARENT
@AbapCatalog.deliveryClass : #A
@AbapCatalog.dataMaintenance : #RESTRICTED
define table z01_employee {

  key client            : abap.clnt not null;
  key employee_id       : z01_employee_id not null;
  first_name            : /lrn/first_name;
  last_name             : /lrn/last_name not null;
  
  @Semantics.amount.currencyCode : 'z01_employee.currency_code'
  annual_salary         : z01_annual_salary;
  currency_code         : abap.cuky;

  include z01_admin;

}
```

---

### Tarefa 3: Ativar e Verificar no Banco de Dados
1. Ative a tabela pressionando **Ctrl + F3**.
2. No painel de navegação ou no editor, abra o menu de contexto da tabela e selecione **Open With $\rightarrow$ Data Preview** (ou atalho **F8**) para verificar as colunas geradas no banco de dados.
3. Observe que as colunas da estrutura `Z01_ADMIN` aparecem integradas à tabela física como se tivessem sido declaradas diretamente nela.
