---
tipo: clippings
title: "Defining Associations Between CDS Views"
source: "https://learning.sap.com/courses/building-data-models-with-the-abap-dictionary-and-abap-core-data-services/defining-associations-between-cds-views_b325f87f-ff81-4bbe-a5c3-06d0c3ba5def"
created: 2026-11-03
tags:
  - sap
  - abap
  - abap-cloud
  - cds
  - view-entities
  - associations
  - cardinality
  - exposed-associations
  - data-preview
---
**Roteiro de Estudos Relacionado:** [[Roteiro de Estudos SAP]]

# Objetivos de Aprendizado

Após concluir esta lição, você será capaz de:
- Definir associações entre **CDS View Entities** no código-fonte DDL.
- Compreender a anatomia de uma associação: entidade de destino (*Target*), identificador com prefixo underscore (*Association Name*) e condição de junção (`ON`).
- Configurar e interpretar cardinalidades em CDS (`[min..max]`), reconhecendo o padrão `[0..1]` e os avisos do verificador de sintaxe.
- Expor associações na lista de elementos (*Exposed Associations*) tornando-as disponíveis para consumidores.
- Navegar interativamente através de associações expostas utilizando a ferramenta **Data Preview** no ADT.

---

# 1. O que são Associações no ABAP CDS?

Enquanto no ABAP Dictionary as dependências de chave estrangeira conectam tabelas físicas de forma estática, no mundo **ABAP Core Data Services (CDS)** os relacionamentos entre entidades são estabelecidos por meio de **Associações** (*Associations*).

![[01AssociationsiInCDSView_001.png]]

### Vantagens e Flexibilidade das Associações:
- **Relacionamentos Bidirecionais:** Uma dependência de chave estrangeira no dicionário sempre liga uma tabela dependente à sua tabela de verificação. No CDS, modela-se o relacionamento de forma bidirecional definindo duas associações independentes entre as duas CDS View Entities:
  - De `R_Employee` para `R_Department` (cada funcionário aponta para o seu departamento de lotação).
  - De `R_Department` para `R_Employee` (cada departamento aponta para o conjunto de funcionários que nele trabalham).
- **Desacoplamento e JOIN sob Demanda (*Join on Demand*):** Declarar uma associação **não** executa um JOIN imediato no banco de dados. A associação funciona como uma declaração de intenção de relacionamento; o JOIN real só é compilado e executado se e quando o consumidor acessar campos da visão de destino através de uma expressão de caminho (*Path Expression*).

---

### Anatomia de uma Associação no Código DDL

As associações são declaradas na cláusula `FROM` da entidade de origem, logo após a definição da fonte de dados:

![[01AssociationsiInCDSView_002.png]]

Uma declaração completa de associação é composta por:

```abap
define view entity Z##_R_Employee
  as select from z##employ
  association [1..1] to Z##_R_Department as _Department
    on $projection.DepartmentId = _Department.Id
{ ... }
```

1. **Palavra-chave e Cardinalidade:** `association [min..max] to`.
2. **Entidade de Destino (*Association Target*):** Nome da CDS View Entity de destino (ex: `Z##_R_Department`). Deve ser preferencialmente uma entidade CDS (embora tabelas do dicionário sejam aceitas, não são recomendadas pelas práticas modernas).
3. **Identificador da Associação (*Association Name*):** Especificado após a adição `as`. Por convenção oficial da SAP, o nome deve **obrigatoriamente iniciar com um sublinhado (`_`)** (ex: `_Department`, `_Employee`, `_Head`).
4. **Condição de Ligação (*Association Condition*):** Especificada após a palavra-chave `on`. Compara os elementos da visão de origem com os elementos da visão de destino.
   - **Lado Esquerdo:** Utiliza o prefixo **`$projection.`** para referenciar o elemento correspondente na lista de elementos da própria visão de origem.
   - **Lado Direito:** Utiliza o prefixo do nome da associação (ex: **`_Department.`**) para referenciar os campos da visão de destino.
   - **Mandante (*Client*):** Não é necessário incluir comparações de mandante (`MANDT`/`client`), pois as CDS View Entities realizam o tratamento automático e transparente de isolamento de clientes.

---

# 2. Cardinalidades em Associações CDS

A cardinalidade define quantos registros da visão de destino podem corresponder a um único registro da visão de origem:

![[02Cardinality_001.png]]

- **Sintaxe:** Informada entre colchetes logo após `association`, nos formatos `[min..max]` ou abreviada como `[max]`.
  - Se omitir o valor mínimo (`[max]`), assume-se implicitamente `min = 0`.
  - **Cardinalidade Padrão:** Se **nenhuma** cardinalidade for declarada, o compilador adota por padrão **`[0..1]`**.
- **Valores Permitidos:**
  - `min`: `0`, `1` ou qualquer número inteiro positivo.
  - `max`: `1`, qualquer inteiro positivo ou o asterisco (`*`) representando cardinalidade ilimitada (*To-Many*).

---

### Checagens de Plausibilidade do Verificador de Sintaxe

O compilador CDS do ADT analisa a condição `ON` e confronta com os campos que formam a **chave primária** da visão de destino:

![[02Cardinality_002.png]]
![[02Cardinality_003.png]]

| Cenário de Validação | Situação no Editor ADT |
| :--- | :--- |
| **Condição ON cobre totalmente a chave de destino:** | O compilador espera uma associação de no máximo 1 (`0..1` ou `1..1`). Se o desenvolvedor declarar `[0..*]`, o ADT emitirá um **aviso de sintaxe (*Warning*)**, alertando sobre inconsistência lógica. |
| **Condição ON NÃO cobre totalmente a chave de destino:** | Podem existir múltiplos registros no destino. Se o desenvolvedor declarar `[1..1]`, o compilador emitirá um **aviso de sintaxe**, alertando que a consulta pode retornar mais de uma linha. |

> [!TIP] Supressão de Avisos Justificados
> Em modelos analíticos ou de agregação complexos onde uma cardinalidade específica é intencional apesar de violar a heurística automática, o desenvolvedor pode ignorar o aviso ou aplicar um pseudo-comentário oficial do compilador.

---

# 3. Associações Expostas (*Exposed Associations*)

Quando você declara uma associação na cláusula `FROM`, o editor exibirá um aviso informando que a associação foi declarada mas ainda não foi utilizada.

![[03ExposedAssociation_001.png]]

Existem duas formas de utilizar uma associação declarada:
1. Empregá-la localmente em uma **Expressão de Caminho** (*Path Expression*) para buscar campos específicos.
2. **Expor a Associação (*Expose Association*):** Incluir o nome da associação diretamente na lista de elementos (*Element List*) da CDS View Entity.

```abap
{
  key EmployeeId,
      FirstName,
      LastName,
      DepartmentId,
      
      /* Exposição da Associação para Consumidores */
      _Department
}
```

Ao expor a associação, você a torna **pública** e acessível para qualquer consumidor da view (como outras CDS Views superiores, comandos ABAP SQL ou serviços OData / RAP), permitindo que eles naveguem até a entidade relacionada quando precisarem.

> [!IMPORTANT] Requisito Obrigatório para Exposição
> Para expor uma associação, **todos os campos da visão de origem utilizados na condição `ON` devem fazer parte da lista de elementos**. O uso do prefixo `$projection.` na condição garante essa conformidade automaticamente.

---

# 4. Navegação por Associações no Data Preview do ADT

Associações expostas habilitam uma navegação relacional interativa dentro do **Data Preview** do Eclipse ADT:

![[Exposed_Associations_in_Data_Preview_001.png]]

### Como Navegar:
1. Abra a CDS View Entity no *Data Preview* pressionando **F8**.
2. Selecione qualquer registro na grade de resultados.
3. Clique com o botão direito e escolha **Follow Association** (ou pressione o atalho **Ctrl + G**).
4. O ADT exibirá a lista de todas as associações expostas (ex: `_Department`, `_Employee`, `_Head`).
5. Ao selecionar uma associação, o *Data Preview* carrega instantaneamente os registros correspondentes da entidade de destino, exibindo uma barra de navegação estilo *Breadcrumb* no topo para retornar ou prosseguir entre níveis do modelo de dados.

---

# 5. Demonstração em Vídeo: How to Define and Expose an Association

Assista à demonstração oficial da SAP ensinando como adicionar a associação `_Department`, configurar a condição `ON` com `$projection`, expor na lista de elementos e navegar no *Data Preview*:

<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%;">
  <iframe 
    src="https://cdnapisec.kaltura.com/p/1926081/sp/192608100/embedIframeJs/uiconf_id/27230482/partner_id/1926081?iframeembed=true&playerId=kaltura_player&entry_id=1_3x54rudz" 
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;" 
    allowfullscreen 
    webkitallowfullscreen 
    mozAllowFullScreen 
    allow="autoplay *; fullscreen *; encrypted-media *" 
    title="How to Define and Expose an Association">
  </iframe>
</div>

---

# 6. Exercício Prático: Definindo CDS Views com Associações (*Hands-on*)

### Objetivos do Exercício
1. Criar a CDS View Entity básica para departamentos (`Z##_R_Department`).
2. Adicionar e expor a associação `_Department` em `Z##_R_Employee`.
3. Na visão `Z##_R_Department`, modelar e expor três associações relacionais: `_Employee` (para todos os funcionários do setor), `_Head` (para o gerente do setor) e `_Assistant` (para o assistente administrativo).
4. Analisar o comando `Show SQL CREATE Statement` e testar a navegação relacional no *Data Preview*.

- **Objetos de Referência da SAP:**
  - `/LRN/R_DEPARTMENT_REL` (Solução CDS para departamentos)
  - `/LRN/R_EMPLOYEE_REL` (Solução CDS para funcionários com associações)

---

### Tarefa 1: Criar a CDS View Entity de Departamentos (`Z##_R_Department`)

1. No ADT, clique com o botão direito sobre a tabela `Z##DEPMENT` $\rightarrow$ **New Data Definition**.
2. Nome: **`Z##_R_Department`** | Descrição: **`Department (Entity)`**.
3. Selecione o template **Define View Entity** e clique em **Finish**.
4. Formate o código com **Shift + F1** e ative a visão com **Ctrl + F3**.

---

### Tarefa 2: Definir e Expor a Associação em `Z##_R_Employee`

1. Abra a definição de dados **`Z##_R_Employee`**.
2. Após a cláusula `as select from z##employ`, adicione a associação com cardinalidade `[1..1]`:

```abap
define view entity Z##_R_Employee
  as select from z##employ
  association [1..1] to Z##_R_Department as _Department
    on $projection.DepartmentId = _Department.Id
{
  key employee_id       as EmployeeId,
      first_name        as FirstName,
      last_name         as LastName,
      department_id     as DepartmentId,
      entry_date        as EntryDate,
      @Semantics.amount.currencyCode: 'CurrencyCode'
      annual_salary     as AnnualSalary,
      currency_code     as CurrencyCode,
      created_by        as CreatedBy,
      created_at        as CreatedAt,
      last_changed_by   as LastChangedBy,
      last_changed_at   as LastChangedAt,

      /* Associação Exposta */
      _Department
}
```

3. Salve e ative a visão pressionando **Ctrl + F3**.

---

### Tarefa 3: Modelar as Associações em `Z##_R_Department`

1. Retorne ao código de **`Z##_R_Department`**.
2. Adicione as três associações baseadas nas regras de negócio e nas cardinalidades do modelo:
   - `_Employee`: cardinalidade `[0..*]` (um departamento pode ter múltiplos empregados).
   - `_Head`: cardinalidade `[0..1]` (um departamento pode ter no máximo um chefe ou nenhum).
   - `_Assistant`: cardinalidade `[1..1]` (um departamento deve ter exatamente um assistente).

```abap
@AccessControl.authorizationCheck: #NOT_REQUIRED
@EndUserText.label: 'Department (Entity)'
@Metadata.ignorePropagatedAnnotations: true
@ObjectModel.usageType:{
  serviceQuality: #D,
  sizeCategory: #M,
  dataClass: #MASTER
}
define view entity Z##_R_Department
  as select from z##depment
  association [0..*] to Z##_R_Employee as _Employee
    on $projection.Id = _Employee.DepartmentId
  association [0..1] to Z##_R_Employee as _Head
    on $projection.HeadId = _Head.EmployeeId
  association [1..1] to Z##_R_Employee as _Assistant
    on $projection.AssistantId = _Assistant.EmployeeId
{
  key id                  as Id,
      description         as Description,
      head_id             as HeadId,
      assistant_id        as AssistantId,
      created_by          as CreatedBy,
      created_at          as CreatedAt,
      last_changed_by     as LastChangedBy,
      last_changed_at     as LastChangedAt,

      /* Associações Expostas */
      _Employee,
      _Head,
      _Assistant
}
```

3. Salve e ative a visão com **Ctrl + F3**.

---

### Tarefa 4: Inspecionar o SQL no Banco e Navegar no Data Preview

1. **Inspeção do SQL Gerado:**
   - Clique com o botão direito no editor de `Z##_R_Department` $\rightarrow$ **Show SQL CREATE Statement**.
   - Observe a cláusula `FROM`: a visão no banco lê **apenas** da tabela física `Z##DEPMENT`. **Nenhum JOIN foi criado**, comprovando que definir e expor associações não sobrecarrega o banco de dados.
2. **Navegação Interativa no Data Preview:**
   - Pressione **F8** em `Z##_R_Department`.
   - Selecione a linha do departamento de vendas (`SALE`).
   - Pressione **Ctrl + G** (ou botão direito $\rightarrow$ *Follow Association*) e selecione **`_Employee`**: o sistema exibirá todos os colaboradores daquele setor.
   - Use o *Breadcrumb* no topo para voltar à lista de departamentos.
   - Selecione o departamento de administração (`ADMIN`), pressione **Ctrl + G** e selecione **`_Assistant`**.
   - Na linha única do assistente que aparecer, pressione **Ctrl + G** $\rightarrow$ `_Department` $\rightarrow$ **Ctrl + G** $\rightarrow$ `_Head` para navegar em cadeia entre funcionários e departamentos sem digitar uma única linha de código SQL!
