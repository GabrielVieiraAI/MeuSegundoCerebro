---
tipo: clippings
title: "Defining a Basic CDS View"
source: "https://learning.sap.com/courses/building-data-models-with-the-abap-dictionary-and-abap-core-data-services/defining-a-basic-cds-view_b94f4075-778b-4311-b28b-f9f46b870c5e"
created: 2026-11-03
tags:
  - sap
  - abap
  - abap-cloud
  - cds
  - data-definitions
  - view-entities
  - from-clause
  - element-list
  - adt
---
**Roteiro de Estudos Relacionado:** [[Roteiro de Estudos SAP]]

# Objetivos de Aprendizado

Após concluir esta lição, você será capaz de:
- Criar um objeto de desenvolvimento do tipo **CDS Data Definition** no **ABAP Development Tools (ADT)**.
- Escolher e aplicar o template moderno oficial de **CDS View Entity**.
- Manter a cláusula `FROM` e definir fontes de dados relacionais.
- Estruturar a lista de elementos (*Element List*), definir campos-chave e aplicar apelidos (*Aliases*).
- Formatar código CDS e utilizar os diferentes tipos de comentários da linguagem DDL.

---

## 1. Criação de uma Data Definition no Eclipse ADT

No ecossistema ABAP moderno, visões CDS são definidas dentro de um objeto de desenvolvimento denominado **Data Definition**:

![[Create_new_Data_Definition_001.png]]

1. No *Project Explorer*, clique com o botão direito sobre o seu pacote de desenvolvimento (ou subpasta de CDS) e selecione:
   **New $\rightarrow$ Other... $\rightarrow$ Core Data Services $\rightarrow$ Data Definition**.
2. No assistente de criação, informe o pacote, o nome do objeto (ex: `Z00_I_DEPARTMENT`) e a descrição:

![[Create_new_Data_Definition_002.png]]

3. Selecione a requisição de transporte (*Transport Request*) associada e clique em **Next**.

---

## 2. Templates de Data Definition: Foco em CDS View Entities

Ao avançar no assistente, o Eclipse ADT apresenta uma lista de templates de código:

![[Data_Definition_Templates_001.png]]

![[Data_Definition_Templates_002.png]]

* **Template Obrigatório:** Selecione **`Define View Entity`**.
* Este template gera o esqueleto de código utilizando a instrução padrão moderna `define view entity`.

> [!WARNING] Evite o Template Obsoleto "Define View"
> O template clássico *Define View* utiliza a sintaxe obsoleta baseada em DDIC (`DEFINE VIEW`) com a anotação `@AbapCatalog.sqlViewName`. Essa abordagem está descontinuada e **bloqueada no ABAP Cloud**. Sempre utilize **`Define View Entity`**.

---

## 3. A Cláusula FROM: Definindo Fontes de Dados

A cláusula `FROM` especifica a fonte primária de onde a visão lerá os registros:

![[03FromClause_001.png]]

```abap
define view entity Z00_I_Department
  as select from /lrn/departmnt as Department
{ ... }
```

* **Fontes Válidas:** A fonte de dados pode ser uma tabela transparente de banco de dados do DDIC ou outra visão CDS existente.
* **Apelidos de Fonte (*Data Source Alias*):** Você pode opcionalmente definir um apelido para a fonte através da cláusula `as AliasName`, o que facilita a legibilidade e a qualificação de campos quando múltiplas fontes ou associações forem utilizadas.

---

## 4. A Lista de Elementos (*Element List*)

A lista de elementos fica delimitada por chaves `{ ... }` e lista separada por vírgulas os campos projetados pela visão:

![[04ElementList_002.png]]

<iframe 
    src="https://cdnapisec.kaltura.com/p/1921661/embedPlaykitJs/uiconf_id/50355372?iframeembed=true&entry_id=1_q1kwaz18" 
    width="100%" 
    height="400" 
    allowfullscreen 
    frameborder="0">
</iframe>

![[04ElementList_003.png]]

### Regras Fundamentais da Lista de Elementos:
1. **Elementos-Chave (`key`):**
   - Os campos que formam a chave primária da entidade CDS devem ser marcados com a palavra-chave `key` (ex: `key id as DepartmentId`).
   - Todos os elementos `key` devem ser agrupados obrigatoriamente no início da lista.
2. **Apelidos de Elementos (`as Alias`):**
   - Você pode renomear qualquer campo para dar um nome semântico mais amigável em CamelCase (ex: `id as DepartmentId`).
3. **Tratamento Automático de Mandante (*Client Handling*):**
   - Em **CDS View Entities**, o tratamento de mandante (*client handling*) é **100% automático**.
   - **Regra de Sintaxe Mandatória:** Você **NÃO DEVE** incluir o campo de mandante (`client` ou `mandt`) na lista de elementos de uma CDS View Entity! Se incluí-lo, o compilador emitirá um erro de sintaxe.
4. **Inserção em Massa com Autocompletar:**
   - Ao posicionar o cursor dentro das chaves `{ }` e pressionar **`Ctrl + Space`**, o assistente oferece a opção **Insert all elements** para preencher automaticamente todos os campos da tabela fonte.

---

## 5. Formatador DDL e Sintaxe de Comentários

Para manter o código limpo e padronizado:

![[05FormatAndComments_001.png]]

* **Formatador Automático:** Pressione **`Shift + F1`** no Eclipse para formatar e alinhar a instrução DDL automaticamente.

<iframe 
    src="https://cdnapisec.kaltura.com/p/1921661/embedPlaykitJs/uiconf_id/50355372?iframeembed=true&entry_id=1_l2306891" 
    width="100%" 
    height="400" 
    allowfullscreen 
    frameborder="0">
</iframe>

### Sintaxe de Comentários no CDS DDL:
A linguagem DDL do CDS utiliza uma sintaxe própria de comentários, diferente do código ABAP tradicional:
* **Comentário de Linha Única:** Utiliza barras duplas `// Comentário` ou dois traços `-- Comentário`.
* **Comentário de Múltiplas Linhas:** Utiliza barra e asterisco `/* Comentário em bloco */`.

> [!NOTE] Diferença do ABAP Clássico
> As notações clássicas de comentário do ABAP (asterisco `*` na primeira coluna ou aspas duplas `"`) **não são suportadas** em arquivos de Data Definition CDS.

---

## 6. Procedimento de Definição no ADT

<iframe 
    src="https://cdnapisec.kaltura.com/p/1921661/embedPlaykitJs/uiconf_id/50355372?iframeembed=true&entry_id=1_3caxy0gx" 
    width="100%" 
    height="400" 
    allowfullscreen 
    frameborder="0">
</iframe>

---

## 7. Prática Hands-On: Definir uma CDS View Básica

> [!NOTE] Objetivo do Exercício
> Neste laboratório prático, você criará sua primeira CDS View Entity para ler dados cadastrais de departamentos a partir da tabela `/LRN/DEPARTMNT`.

---

### Passo 1: Criar a Data Definition `Z##_I_DEPARTMENT`
1. No *Project Explorer*, clique com o botão direito no nó **Core Data Services** do seu pacote `ZS4D430_##` e escolha:
   **New $\rightarrow$ Data Definition**.
2. Preencha os campos:
   - **Name:** `Z##_I_DEPARTMENT` *(ex: `Z01_I_DEPARTMENT`)*
   - **Description:** `Department View`
3. Selecione a Transport Request e avance.
4. Na tela de templates, selecione **`Define View Entity`** e clique em **Finish**.

---

### Passo 2: Implementar a Instrução DDL
Ajuste o código da visão conforme o exemplo abaixo:

```abap
@AccessControl.authorizationCheck: #NOT_REQUIRED
@EndUserText.label: 'Department View'
define view entity Z01_I_Department
  as select from /lrn/departmnt
{
  key id          as DepartmentId,
      description as Description
}
```

---

### Passo 3: Ativar e Visualizar os Dados
1. Salve (**Ctrl + S**) e ative a visão (**Ctrl + F3**).
2. Pressione **`F8`** (ou clique com o botão direito $\rightarrow$ **Open With $\rightarrow$ Data Preview**).
3. O painel *Data Preview* do Eclipse exibirá os registros de departamentos retornados diretamente do banco de dados SAP HANA.
