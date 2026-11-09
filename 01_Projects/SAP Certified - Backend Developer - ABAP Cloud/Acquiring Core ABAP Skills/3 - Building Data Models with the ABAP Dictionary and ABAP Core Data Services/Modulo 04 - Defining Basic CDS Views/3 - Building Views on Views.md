---
tipo: clippings
title: "Building Views on Views"
source: "https://learning.sap.com/courses/building-data-models-with-the-abap-dictionary-and-abap-core-data-services/building-views-on-views_fa49f0cf-c38f-481f-86e0-a520f254924a"
created: 2026-11-03
tags:
  - sap
  - abap
  - abap-cloud
  - cds
  - data-definitions
  - view-entities
  - views-on-views
  - annotations
  - annotation-propagation
  - vdm
---
**Roteiro de Estudos Relacionado:** [[Roteiro de Estudos SAP]]

# Objetivos de Aprendizado

Após concluir esta lição, você será capaz de:
- Definir uma CDS View Entity que lê a partir de outra CDS View Entity (*View on View*).
- Controlar a propagação de anotações de elementos (*Annotation Propagation*).
- Utilizar a anotação `@Metadata.ignorePropagatedAnnotations` para ativar ou desativar a herança de anotações.
- Inspecionar a origem e os valores efetivos de metadados utilizando a visão *Active Annotations* no ADT.

---

# 1. Motivação para Views sobre Views (*Views on Views*)

Ao definir uma **CDS View Entity**, a fonte de dados na cláusula `FROM` não precisa ser restrita a tabelas transparentes do banco de dados. Você também pode utilizar outras CDS Views como fontes de dados.

Mas por que empilhar visões em camadas (*Views on Views*)?

![[01Motivation_001.png]]

A construção de visões sobre visões apoia-se em três pilares fundamentais de arquitetura:

1. **Reuso e Manutenibilidade (Semelhante à Programação Orientada a Objetos):**
   - Reutilizar lógica de dados e cálculos existentes já testados e aprovados.
   - Evitar redundância de código em consultas complexas.
   - Facilitar o isolamento de erros, manutenção contínua e modularização.

2. **Superação de Restrições Técnicas de SQL:**
   - Existem certas limitações no CDS DDL quando se trata de aninhamento excessivo de expressões SQL complexas e funções SQL dentro de uma única view. Visões aninhadas em camadas permitem quebrar cálculos complexos em etapas intermediárias limpas.

3. **Estratificação Arquitetural do Modelo de Dados (VDM - Virtual Data Model):**
   - No modelo de programação moderno **ABAP RESTful Application Programming Model (RAP)**, é uma recomendação oficial e padrão arquitetural separar os modelos em camadas:
     - **Camada Básica / Modelo de Dados (ex: Basic/Interface Views - `R_...` ou `I_...`):** Encapsula a lógica central de negócio, relacionamentos de chave e campos da base.
     - **Camada de Consumo (ex: Consumption Views - `C_...`):** Definida sobre a camada básica, projeta apenas os campos relevantes para uma aplicação ou API específica, adicionando metadados analíticos, filtros e anotações direcionadas à interface do usuário.

---

# 2. Propagação de Anotações (*Annotation Propagation*)

Quando uma CDS View Entity lê de outra view entity, ela pode herdar os metadados da view de origem. Esse mecanismo oficial do framework CDS chama-se **Propagação de Anotações** (*Annotation Propagation*).

![[02AnnotationPropagation_001.png]]

### Regras Fundamentais de Propagação:
- **Apenas Anotações de Elementos são Propagadas:** Apenas anotações associadas a campos individuais (como `@Semantics.amount.currencyCode`, `@EndUserText.label`, etc.) podem ser herdadas da view subjacente.
- **Anotações de Entidade NUNCA são Propagadas:** Anotações que definem características do cabeçalho da visão inteira (como `@AccessControl.authorizationCheck` ou `@ObjectModel.usageType`) pertencem exclusivamente àquela entidade e **nunca** são herdadas por views que a utilizam na cláusula `FROM`.

No exemplo ilustrado:
- A view entity `C_Employee` consome a view `R_Employee`.
- Por padrão, a anotação `@Semantics.amount.currencyCode: 'CurrencyCode'` definida no elemento `AnnualSalary` de `R_Employee` é propagada automaticamente para `C_Employee`.
- Consequentemente, não é necessário redigitar a anotação obrigatória de montante em `C_Employee`.

---

# 3. Controlando a Propagação com `@Metadata.ignorePropagatedAnnotations`

A anotação de nível de entidade `@Metadata.ignorePropagatedAnnotations` permite ao desenvolvedor ligar ou desligar a herança de anotações de elementos:

![[02AnnotationPropagation_002.png]]

| Valor da Anotação | Comportamento no CDS |
| :--- | :--- |
| **`false`** (ou ausente na view clássica) | **Propagação Ativa:** A view herda todas as anotações de elementos da fonte de dados subjacente. |
| **`true`** | **Propagação Desativada:** A view ignora todas as anotações vindas da visão de origem. Todas as anotações de elementos devem ser especificadas explicitamente na própria view caso sejam requeridas pelo compilador. |

> [!WARNING] Atenção ao Desativar a Propagação
> Se `C_Employee` estiver configurada com `@Metadata.ignorePropagatedAnnotations: true`, o elemento `AnnualSalary` (que possui tipo de dados `CURR`) deixará de herdar o vínculo com a moeda. O verificador de sintaxe do ADT emitirá um **erro de sintaxe imediato**, pois campos de montante exigem obrigatoriamente a anotação semântica explícita associada.

> [!TIP] Cuidados com Apelidos (*Aliases*)
> Ao atribuir um alias a um campo de referência monetária (ex: `CurrencyCode as CurrCode`), se as anotações forem propagadas automaticamente da visão inferior, a anotação herdada continuará apontando para o nome original (`CurrencyCode`), que já não existe mais com esse nome na lista de elementos da view superior. Nesses cenários, desativar a propagação ou sobrepor a anotação localmente evita inconsistências semânticas.

---

# 4. Demonstração em Vídeo: How to Define a View on Top of a View

Assista à demonstração oficial da SAP exibindo o processo de criação de uma CDS View de consumo, alteração de templates no ADT e a inspeção ao vivo da herança de metadados na aba **Active Annotations**.

<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%;">
  <iframe 
    src="https://cdnapisec.kaltura.com/p/1926081/sp/192608100/embedIframeJs/uiconf_id/27230482/partner_id/1926081?iframeembed=true&playerId=kaltura_player&entry_id=1_0n6fizwg" 
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;" 
    allowfullscreen 
    webkitallowfullscreen 
    mozAllowFullScreen 
    allow="autoplay *; fullscreen *; encrypted-media *" 
    title="How to Define a View on Top of a View">
  </iframe>
</div>

---

# 5. Exercício Prático: Definindo uma View on View (*Hands-on*)

### Objetivo do Exercício
Separar a definição básica do modelo de dados (`Z##_R_Employee`) de sua utilização para consumo (`Z##_C_Employee`). Você criará a nova view entity, ativará a propagação de anotações para análise na ferramenta *Active Annotations* e, em seguida, desativará a propagação para adicionar manualmente a anotação obrigatória de semântica.

- **Modelo Inicial:** `Z##_R_EMPLOYEE` (ou cópia de `/LRN/R_EMPLOYEE_ANN`)
- **Objeto Solução de Referência da SAP:** `/LRN/C_EMPLOYEE_ANN`

---

### Tarefa 1: Definir a CDS View Entity de Consumo

1. No **Project Explorer** do ADT, navegue até o seu pacote e expanda **Core Data Services** $\rightarrow$ **Data Definitions**.
2. Clique com o botão direito sobre a sua definição de dados existente **`Z##_R_EMPLOYEE`** e escolha **New Data Definition**.
3. Confirme que:
   - O campo **Package** contém o nome do seu pacote de trabalho.
   - O campo **Referenced Object** está preenchido com **`Z##_R_EMPLOYEE`**.
4. No campo **Name**, digite **`Z##_C_Employee`** (substituindo `##` pelo seu identificador).
5. No campo **Description**, digite **`Employee (Consumption)`** e clique em **Next**.
6. Selecione a solicitação de transporte (**Transport Request**) apropriada e clique em **Next**.
   > [!CAUTION] Cuidado
   > **Não** clique em *Finish* nesta tela! Se você clicar em *Finish* antes da hora, o assistente usará o template padrão e não exibirá a lista para escolha.
7. Na lista de templates, selecione **Define View Entity** e clique em **Finish**.
8. Ajuste o bloco de anotações `@ObjectModel.usageType` para manter as mesmas características da visão de base:
```abap
  @ObjectModel.usageType:{
    serviceQuality: #D,
    sizeCategory:   #M,
    dataClass:      #MASTER
  }
```
9. Formate o código-fonte utilizando o atalho **Shift + F1** (ou menu *Source Code* $\rightarrow$ *Format*).

---

### Tarefa 2: Analisar e Controlar a Propagação de Anotações

1. Na sua nova Data Definition, altere temporariamente a anotação para permitir a propagação de elementos:
   - Modifique o valor de `@Metadata.ignorePropagatedAnnotations` de `true` para **`false`**.
2. Salve e ative a Data Definition pressionando **Ctrl + F3**.
3. Abra a ferramenta **Active Annotations**:
   - Clique com o botão direito em qualquer linha do editor de código-fonte.
   - No menu de contexto, selecione **Open With** $\rightarrow$ **Active Annotations**.
   - A visão *Active Annotations* será exibida em uma aba inferior no Eclipse ADT.
   - Clique no ícone **Collapse All** na barra de ferramentas da visualização.
   - Navegue por **`Z##_C_EMPLOYEE`** $\rightarrow$ **`AnnualSalary`** $\rightarrow$ **`@Semantics`** $\rightarrow$ **`Amount`**.
   - Observe a coluna **Origin Data Source**: ela aponta explicitamente para a visão básica **`Z##_R_EMPLOYEE`**, demonstrando a herança ativa dos metadados.
4. Agora, teste a desativação da propagação:
   - Altere o valor de `@Metadata.ignorePropagatedAnnotations` de volta para **`true`**.
   - Observe que o editor acusará erro de sintaxe imediato no elemento `AnnualSalary`, pois a anotação obrigatória de referência de moeda deixou de ser propagada.
5. Corrija o erro de sintaxe adicionando a anotação de semântica diretamente sobre o elemento `AnnualSalary`:
```abap
  DepartmentId,
  @Semantics.amount.currencyCode: 'CurrencyCode'
  AnnualSalary,
  CurrencyCode
```
6. Salve e ative a Data Definition pressionando **Ctrl + F3**.

---

### Código Final Completo da Solução (`Z##_C_Employee`)

```abap
@AccessControl.authorizationCheck: #NOT_REQUIRED
@EndUserText.label: 'Employee (Consumption)'
@Metadata.ignorePropagatedAnnotations: true
@ObjectModel.usageType:{
  serviceQuality: #D,
  sizeCategory:   #M,
  dataClass:      #MASTER
}
define view entity Z##_C_Employee
  as select from Z##_R_Employee
{
  key EmployeeId,
      FirstName,
      LastName,
      DepartmentId,
      @Semantics.amount.currencyCode: 'CurrencyCode'
      AnnualSalary,
      CurrencyCode
}
```
