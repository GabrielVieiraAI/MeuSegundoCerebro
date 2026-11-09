---
tipo: clippings
title: "Extending CDS Views"
source: "https://learning.sap.com/courses/building-data-models-with-the-abap-dictionary-and-abap-core-data-services/extending-cds-views_fab548c5-6438-41e1-8384-c5190f13ea7b"
created: 2026-11-03
tags:
  - sap
  - abap
  - abap-cloud
  - cds
  - view-entities
  - view-extensions
  - extensibility
  - clean-core
  - e-views
---
**Roteiro de Estudos Relacionado:** [[Roteiro de Estudos SAP]]

# Objetivos de Aprendizado

Após concluir esta lição, você será capaz de:
- Estender **CDS View Entities** sem modificação de código-fonte utilizando o comando `EXTEND VIEW ENTITY`.
- Adicionar novos elementos, expressões calculadas e novas associações à lista de elementos da visão.
- Configurar as anotações de controle de extensibilidade em CDS (`@AbapCatalog.viewEnhancementCategory` e `@AbapCatalog.extensibility.*`).
- Compreender a arquitetura de **Extension Includes em CDS** através de visões especiais com prefixo `E_` (*E-Views*).
- Inspecionar entidades estendidas utilizando o tooltip descritivo (**F2**) no ADT.

---

# 1. Extensões de CDS View Entities

Assim como o ABAP Dictionary permite estender tabelas de banco de dados através de Append Structures, o **ABAP CDS** permite estender CDS View Entities através de **CDS View Extensions**:

![[CDS_View_Extensions_001.png]]

- Uma **CDS View Extension** é criada em um objeto independente do tipo **CDS Data Definition**, utilizando o comando **`EXTEND VIEW ENTITY`**.
- Ela não altera o arquivo fonte da visão original; o vínculo é estabelecido pelo nome da visão informada no comando de extensão.
- Uma CDS View Entity pode conter uma ou mais extensões de visão ativas simultaneamente.

![[CDS_View_Extensions_002.png]]

> [!NOTE] Qualificação Obrigatória da Fonte de Dados
> Dentro do bloco da extensão, ao referenciar campos da tabela ou entidade subjacente, é **obrigatório qualificar o nome da fonte de dados** (ou o alias definido na visão original, como `Employee.campo`).

---

### Adicionando Novas Associações via Extensão

Além de campos existentes e expressões SQL, uma extensão de CDS View pode declarar **novas associações**:

![[CDS_View_Extensions_004.png]]

```abap
extend view entity /DMO/E_Agency with
  association [0..*] to /DMO/I_AgencyText as _ZZTextZAG
    on $projection.AgencyId = _ZZTextZAG.AgencyId
{
  _ZZTextZAG
}
```

A nova associação pode ser exposta na lista de elementos ou utilizada em expressões de caminho para trazer dados adicionais.

---

# 2. Controle de Extensibilidade em CDS

O proprietário da CDS View Entity controla se e como a visão pode ser estendida utilizando anotações de catálogo:

![[02ExtensibilityControlCDS_001.png]]

### Principais Anotações de Extensibilidade:
1. **`@AbapCatalog.viewEnhancementCategory`:**  
   Especifica as técnicas permitidas na extensão.
   - Valores: `[#PROJECTION_LIST]`, `[#GROUP_BY]`, `[#UNION]`, `[#NONE]`.
   - *Comportamento Padrão:* Se omitida, a visão permite adicionar campos, expressões e associações à lista de elementos.
2. **`@AbapCatalog.extensibility.extensible`:** Booleano (`true`/`false`) para ligar ou desligar a extensibilidade geral.
3. **`@AbapCatalog.extensibility.elementSuffix`:** Define o sufixo obrigatório de 3 caracteres para elementos adicionados (ex: `'ZEM'`).
4. **`@AbapCatalog.extensibility.dataSources`:** Lista explícita de aliases de fontes de dados das quais as extensões têm permissão para ler.
5. **`@AbapCatalog.extensibility.allowNewDatasources`:** Booleano que define se a extensão pode acessar fontes de dados livres (`true`) ou se está restrita apenas às fontes autorizadas na lista `dataSources` (`false`).

---

# 3. Padrão Arquitetural SAP: Extension Includes em CDS (*E-Views*)

Como o ABAP CDS não possui uma instrução `INCLUDE` como o dicionário tradicional, a SAP adotou um padrão arquitetural consagrado utilizando **CDS Views de Extensão (identificadas pelo prefixo `E_`)**:

![[02ExtensibilityControlCDS_002.png]]
![[02ExtensibilityControlCDS_003.png]]

1. A CDS View principal (ex: `R_AgencyTP`) define uma associação fixa chamada `_Extension` apontando para a visão `E_Agency`.
2. A visão principal bloqueia extensões diretas (`allowNewDatasources: false`) e autoriza apenas campos vindos da associação `_Extension`.
3. A visão `E_Agency` permite extensões diretas lendo da tabela mestre.
4. **Fluxo do Desenvolvedor:**
   - **Passo 1:** Criar uma extensão para a visão `E_Agency` adicionando o novo campo da tabela física.
   - **Passo 2:** Criar uma extensão para a visão principal `R_AgencyTP` consumindo o novo campo via expressão de caminho (`_Extension.ZZNovoCampo`).

---

# 4. Criando uma CDS View Extension no ADT

No Project Explorer do Eclipse ADT:
1. Clique com o botão direito na CDS Data Definition a ser estendida $\rightarrow$ **New Data Definition**.
2. Forneça o nome (ex: `Z##EXT_R_EMPLOYEE`) e selecione o seu próprio pacote de trabalho.
3. Na lista de templates, selecione **`Extend View Entity`**:

![[03CDSViewExtensionCreation_001.png]]

> [!WARNING] Atenção ao Template Correto
> Selecione sempre o template moderno **`Extend View Entity`**. O template antigo *Extend View* utiliza o comando legado `EXTEND VIEW` (voltado exclusivamente para CDS Views clássicas que geravam SQL Views obsoletas no dicionário).

---

# 5. Exercício Prático: Estendendo CDS Views (*Hands-on*)

### Objetivos do Exercício
1. Configurar as anotações de extensibilidade nas visões `Z##_R_Employee` e `Z##_C_EmployeeQueryP` restringindo o sufixo a `'ZEM'`.
2. Criar a extensão **`Z##EXT_R_EMPLOYEE`** estendendo a visão básica com os campos da tabela append (`ZZTitleZem` e `ZZCountryZem`).
3. Criar a extensão **`Z##EXT_C_EMPLOYEE`** estendendo a visão de consulta com os campos herdados, a função `concat_with_space(...)` para o nome completo (`ZZFullNameZem`) e uma nova associação para `I_Country` trazendo o indicador `ZZEUBasedZem`.

- **Objetos Solução de Referência da SAP:**
  - `/LRN/EXT_R_EMPLOYEE` (CDS View Extension Básica)
  - `/LRN/EXT_C_EMPLOYEE` (CDS View Extension de Consulta)

---

### Tarefa 1: Habilitar Extensibilidade nas Visões

1. Abra a visão básica **`Z##_R_Employee`** e declare as anotações de catálogo:

```abap
@AbapCatalog: {
   dataMaintenance: #RESTRICTED,
   viewEnhancementCategory: [#PROJECTION_LIST],
   extensibility.dataSources: [ 'Employee' ],
   extensibility.elementSuffix: 'ZEM'
}
define view entity Z##_R_Employee
  as select from z##employ as Employee
```

2. Ative (**Ctrl + F3**).
3. Abra a visão de consulta **`Z##_C_EmployeeQueryP`** e aplique a mesma configuração:

```abap
@AbapCatalog: {
   dataMaintenance: #RESTRICTED,
   viewEnhancementCategory: [#PROJECTION_LIST],
   extensibility.dataSources: [ 'Employee' ],
   extensibility.elementSuffix: 'ZEM'
}
define view entity Z##_C_EmployeeQueryP
  with parameters ...
  as select from Z##_R_Employee as Employee
```

4. Ative (**Ctrl + F3**).

---

### Tarefa 2: Criar Extensão para a Visão Básica (`Z##EXT_R_EMPLOYEE`)

1. Crie uma nova Data Definition chamada **`Z##EXT_R_EMPLOYEE`** utilizando o template **Extend View Entity**.
2. Adicione os campos da tabela física qualificados com o alias `Employee`:

```abap
extend view entity Z##_R_Employee with
{
  Employee.zztitle_zem   as ZZTitleZem,
  Employee.zzcountry_zem as ZZCountryZem
}
```

3. Salve e ative (**Ctrl + F3**).
4. Posicione o cursor sobre `Z##_R_Employee` e pressione **F2**: confirme na seção *Extended With* a presença da extensão.

---

### Tarefa 3: Criar Extensão para a Visão de Consulta (`Z##EXT_C_EMPLOYEE`)

1. Crie uma nova Data Definition chamada **`Z##EXT_C_EMPLOYEE`** utilizando o template **Extend View Entity**.
2. Projete os campos da visão básica, concatene o nome completo e declare uma nova associação para `I_Country` lendo o campo `IsEuropeanUnionMember`:

```abap
extend view entity Z##_C_EmployeeQueryP with
association [1..1] to I_Country as _ZZCountryZem
  on $projection.ZZCountryZem = _ZZCountryZem.Country
{
  Employee.ZZTitleZem,
  Employee.ZZCountryZem,

  @EndUserText.label: 'Full Name'
  concat_with_space( Employee.FirstName, 
                     Employee.LastName, 
                     1 )                as ZZFullNameZem,

  _ZZCountryZem.IsEuropeanUnionMember   as ZZEUBasedZem
}
```

3. Salve e ative (**Ctrl + F3**).
4. Abra `Z##_C_EmployeeQueryP` no Data Preview (**F8**): os novos campos de extensão e o flag de união europeia serão exibidos perfeitamente integrados ao resultado final da visão!
