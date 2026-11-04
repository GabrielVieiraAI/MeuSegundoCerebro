---
tipo: clippings
title: "Defining Relationships Between Database Tables"
source: "https://learning.sap.com/courses/building-data-models-with-the-abap-dictionary-and-abap-core-data-services/defining-relationships-between-database-tables_e55dbd61-6083-4747-bb5d-905ba29ab662"
created: 2026-11-03
tags:
  - sap
  - abap
  - abap-cloud
  - ddic
  - database-tables
  - foreign-keys
  - check-table
  - relationships
  - cardinality
---
**Roteiro de Estudos Relacionado:** [[Roteiro de Estudos SAP]]

# Objetivos de Aprendizado

Após concluir esta lição, você será capaz de:
- Compreender como relacionamentos e cardinalidades são modelados entre entidades de dados.
- Definir dependências de chave estrangeira (*Foreign Key Dependencies*) no código DDL de tabelas do **ABAP Dictionary**.
- Distinguir os papéis da tabela de chave estrangeira (*Foreign Key Table*), tabela de verificação (*Check Table*) e campo de verificação (*Check Field*).
- Configurar atributos semânticos e anotações técnicas (`@AbapCatalog.foreignKey.*`).
- Expressar cardinalidades precisas `[n, m]` na cláusula `WITH FOREIGN KEY`.

---

# 1. Relacionamentos em Modelos de Dados

Em qualquer modelo de dados empresarial, as entidades não existem isoladas: elas mantêm relacionamentos entre si. Definir um modelo de dados relacional sólido exige o mapeamento explícito dessas conexões.

![[01RelationsInDataModels_001.png]]

Considere o modelo corporativo com as entidades **Employee** (Empregado) e **Department** (Departamento):
- As duas entidades relacionam-se porque empregados são alocados a departamentos.
- Além dessa relação básica, podem existir relacionamentos adicionais: por exemplo, cada departamento é liderado por um dos empregados (*Department Head*).

---

### Cardinalidades e Multiplicidades

Uma das características mais críticas de um relacionamento é a sua **cardinalidade** (ou multiplicidade), que define quantas instâncias de uma entidade podem estar associadas a uma instância da outra entidade.

![[01RelationsInDataModels_002.png]]

> [!NOTE] Nota Terminológica
> No ABAP Dictionary e no ABAP CDS, os termos **cardinalidade** e **multiplicidade** são usados na prática como sinônimos. Rigorosamente falando, a cardinalidade é a contagem real de instâncias em um dado instante, enquanto a multiplicidade define a faixa de valores permitidos (mínimo..máximo).

Análise dos exemplos práticos:
1. **Empregados para Departamentos:**
   - Todo empregado deve estar alocado a exatamente um departamento: cardinalidade nesta direção é `1..1`.
   - Na direção oposta, um departamento pode ter qualquer quantidade de empregados alocados, inclusive nenhum (departamento recém-criado): cardinalidade `0..*`.
2. **Liderança de Departamento (*Head*):**
   - Cada departamento é liderado por exatamente um empregado: `1..1` (desconsiderando posições vagas ou co-liderança).
   - Na direção oposta, nem todo empregado é líder (mínimo 0) e um empregado não pode liderar mais de um departamento ao mesmo tempo (máximo 1): cardinalidade `0..1`.

---

### Diferenças Conceituais: ABAP Dictionary vs. ABAP CDS

O ABAP CDS e o ABAP Dictionary utilizam mecanismos distintos para expressar relacionamentos:

![[01RelationsInDataModels_003.png]]

| Conceito | Tecnologia | Como Funciona |
| :--- | :--- | :--- |
| **Foreign Keys (Chaves Estrangeiras)** | **ABAP Dictionary** | Define uma dependência a nível de campo de tabela (`WITH FOREIGN KEY`) apontando para uma tabela de verificação (*Check Table*). Cada dependência representa um relacionamento direcionado. |
| **Associations (Associações)** | **ABAP Core Data Services (CDS)** | Define relacionamentos entre CDS View Entities (`ASSOCIATION TO`). Tipicamente, um relacionamento bidirecional é modelado através de duas associações opostas. |

---

# 2. Definição de Chaves Estrangeiras no ABAP Dictionary

No ABAP Dictionary, você utiliza dependências de chave estrangeira para conectar tabelas de banco de dados.

![[02ForeignKeysInDDICTables_001.png]]

> [!IMPORTANT] Propósito Moderno vs. Clássico
> - **No desenvolvimento ABAP moderno (ABAP Cloud / CDS):** A finalidade principal das chaves estrangeiras no ABAP Dictionary é **documentação e consistência semântica** do modelo de dados.
> - **No desenvolvimento ABAP clássico:** Essas dependências eram usadas pelo runtime do Dynpro para gerar verificações implícitas de tela (*Input Checks*) e ajudas de pesquisa automáticas (*Search Helps*).
> - **Camada de Banco de Dados:** As definições de chave estrangeira do ABAP Dictionary permanecem na **camada ABAP**. Elas **NÃO** são passadas para o banco de dados relacional como restrições físicas de integridade referencial (*Foreign Key Constraints* de banco). Portanto, não geram checagens implícitas durante comandos SQL diretos.

---

### Componentes de uma Relação de Chave Estrangeira

Uma relação de chave estrangeira envolve dois papéis fundamentais:

![[02ForeignKeysInDDICTables_002.png]]

1. **Foreign Key Table (Tabela de Chave Estrangeira):** A tabela dependente que contém o campo a ser validado.
2. **Check Table (Tabela de Verificação):** A tabela mestre referenciada cujos valores de chave primária determinam as entradas válidas.
3. **Foreign Key (Chave Estrangeira):** O conjunto de campos na *Foreign Key Table* mapeados para os campos de chave primária da *Check Table*. Pode ser composto por qualquer combinação de campos chave ou não-chave.
4. **Check Field (Campo de Verificação):** O último campo da chave estrangeira, correspondente ao último campo da chave primária da *Check Table*. É o campo específico onde a restrição de valor é aplicada.

---

# 3. Demonstração em Vídeo: Understanding an Example for a Foreign Key Relationship

Assista ao vídeo explicativo detalhando como os registros da tabela `EMPLOYEE` são comparados com a chave primária da tabela `DEPARTMENT`, ilustrando validações dependentes do mandante (*Client / MANDT*):

<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%;">
  <iframe 
    src="https://cdnapisec.kaltura.com/p/1926081/sp/192608100/embedIframeJs/uiconf_id/27230482/partner_id/1926081?iframeembed=true&playerId=kaltura_player&entry_id=1_vokpjj5w" 
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;" 
    allowfullscreen 
    webkitallowfullscreen 
    mozAllowFullScreen 
    allow="autoplay *; fullscreen *; encrypted-media *" 
    title="Understanding an Example for a Foreign Key Relationship">
  </iframe>
</div>

---

# 4. Atributos Semânticos e Sintaxe de Chaves Estrangeiras

No código-fonte DDL de uma tabela transparente, a definição da chave estrangeira é inserida diretamente na declaração do campo de verificação (*Check Field*).

![[03SemanticAttrOfForeignKeys_001.png]]

A maioria das propriedades semânticas é configurada através de anotações técnicas `@AbapCatalog.foreignKey.*`, enquanto a cardinalidade é informada diretamente na cláusula `WITH FOREIGN KEY [n, m]`.

---

### Anotações de Chave Estrangeira

![[03SemanticAttrOfForeignKeys_002.png]]

- **Texto Descritivo (`@AbapCatalog.foreignKey.label`):** Texto explicativo que descreve o relacionamento.
- **Tipo de Campo da Chave Estrangeira (`@AbapCatalog.foreignKey.keyType`):** Descreve a natureza dos campos na tabela dependente:
  - `#KEY`: Todos os campos da chave estrangeira fazem parte da chave primária da tabela dependente.
  - `#NON_KEY`: Ao menos um dos campos da chave estrangeira não faz parte da chave primária da tabela dependente (caso do campo `department_id` na tabela `EMPLOYEE`).
  - `#TEXT_KEY`: Utilizado quando a tabela dependente atua como tabela de textos traduzíveis (*Text Table*).
- **Validação em Interfaces Clássicas (`@AbapCatalog.foreignKey.screenCheck`):** Define se telas clássicas (Dynpro/SAP GUI) executam validação de entrada baseada nesta chave. No desenvolvimento moderno (ABAP Cloud / Fiori), deve ser mantido como `false`.

---

### Sintaxe de Cardinalidade no ABAP Dictionary: `[ n , m ]`

A cardinalidade é declarada em colchetes imediatamente após a palavra-chave `KEY`:

![[03SemanticAttrOfForeignKeys_003.png]]

```abap
with foreign key [ n , m ] check_table
  where client = foreign_table.client
    and id     = foreign_table.check_field;
```

O formato `[ n , m ]` possui uma lógica específica de duas partes:

![[03SemanticAttrOfForeignKeys_004.png]]
![[03SemanticAttrOfForeignKeys_005.png]]

| Posição | Representação | Valores Permitidos | Regra de Decisão Prática |
| :--- | :--- | :--- | :--- |
| **Lado Direito ($m$)** | Registros da **Check Table** para cada registro da **Foreign Key Table** | `1` ou `0..1` | • Se o campo de verificação for **obrigatório**, use $m = 1$.<br>• Se o campo de verificação for **opcional**, use $m = 0..1$. |
| **Lado Esquerdo ($n$)** | Registros da **Foreign Key Table** para cada registro da **Check Table** | `1`, `0..1`, `1..*` ou `0..*` | • $n = 1$: Exatamente 1 registro dependente por registro de verificação.<br>• $n = 0..1$: No máximo 1 registro dependente.<br>• $n = 1..*$: Pelo menos 1 registro dependente.<br>• $n = 0..*$: Qualquer quantidade de registros dependentes (zero, um ou muitos). |

---

# 5. Demonstração em Vídeo: How to Define a Foreign Key Relationship

Veja o passo a passo prático no editor de tabelas do ADT, utilizando o assistente de autocompletar (**Ctrl + Space**) para montar as cláusulas `WITH FOREIGN KEY`, atribuir anotações e formatar o código:

<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%;">
  <iframe 
    src="https://cdnapisec.kaltura.com/p/1926081/sp/192608100/embedIframeJs/uiconf_id/27230482/partner_id/1926081?iframeembed=true&playerId=kaltura_player&entry_id=1_4xghc8zs" 
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;" 
    allowfullscreen 
    webkitallowfullscreen 
    mozAllowFullScreen 
    allow="autoplay *; fullscreen *; encrypted-media *" 
    title="How to Define a Foreign Key Relationship">
  </iframe>
</div>

---

# 6. Exercício Prático: Definindo Relacionamentos de Chave Estrangeira (*Hands-on*)

### Objetivos do Exercício
1. Criar uma nova tabela de banco de dados para armazenar departamentos (`Z##DEPMENT`).
2. Estabelecer o relacionamento de chave estrangeira em `Z##EMPLOY` validando o campo `department_id` contra `Z##DEPMENT`.
3. Estender `Z##DEPMENT` com campos para chefe do departamento (`head_id`) e assistente (`assistant_id`), vinculando-os por chave estrangeira de volta à tabela de empregados `Z##EMPLOY`.
4. Executar a classe geradora de carga de dados.

- **Objetos de Referência da SAP:**
  - `/LRN/EMPLOY_DEP` (Template inicial de empregados)
  - `/LRN/DEPMENT_REL` (Solução da tabela de departamentos)
  - `/LRN/EMPLOY_REL` (Solução da tabela de empregados com FK)
  - `/LRN/CL_S4D430_CHECK_AND_FILL` (Classe geradora de dados)

---

### Tarefa 1: Criar a Tabela de Departamentos (`Z##DEPMENT`)

1. No ADT, clique com o botão direito no nó **Dictionary** do seu pacote $\rightarrow$ **New** $\rightarrow$ **Database Table**.
2. Nome: **`Z##DEPMENT`** | Descrição: **`Department`**.
3. Defina os campos da tabela conforme a especificação técnica:

```abap
@EndUserText.label : 'Department'
@AbapCatalog.enhancement.category : #NOT_EXTENSIBLE
@AbapCatalog.tableCategory : #TRANSPARENT
@AbapCatalog.deliveryClass : #A
@AbapCatalog.dataMaintenance : #RESTRICTED
define table z##depment {

  key client          : abap.clnt not null;
  key id              : z##_department_id not null;
      description     : /lrn/depment_description;
      include           /lrn/s_admin;

}
```

4. Configure as Configurações Técnicas (*Technical Settings*):
   - Clique com o botão direito $\rightarrow$ **Open Others** $\rightarrow$ **Technical Settings**.
   - **Data Class:** `APPL0` (*Master Data, Transparent Table*).
   - **Size Category:** `0` (*Expected records 0 - 2.600*).
   - Ative as configurações técnicas e a tabela (**Ctrl + F3**).

---

### Tarefa 2: Adicionar a Chave Estrangeira na Tabela de Empregados (`Z##EMPLOY`)

1. Abra a definição de `Z##EMPLOY`.
2. Localize o campo `department_id` e configure a chave estrangeira apontando para `Z##DEPMENT`:
   - Cardinalidade: `[0..*,1]` (um departamento pode ter muitos empregados `0..*`, mas cada empregado deve ter um departamento válido `1`).

```abap
  entry_date      : z##_entry_date;
  @AbapCatalog.foreignKey.screenCheck : false
  department_id   : z##_department_id
    with foreign key [0..*,1] z##depment
      where client = z##employ.client
        and id     = z##employ.department_id;
```

3. Salve e ative a tabela `Z##EMPLOY` (**Ctrl + F3**).

---

### Tarefa 3: Estender `Z##DEPMENT` com Chefe e Assistente

1. Na tabela `Z##DEPMENT`, antes da instrução `include /lrn/s_admin;`, adicione os campos:
   - `department_head : z##_depment_head;`
   - `department_assistant : z##_depment_assistant;`
2. Utilize o Quick Fix (**Ctrl + 1**) para criar os Data Elements:
   - Ambos devem utilizar o domínio existente **`Z##_EMPLOYEE_ID`** (ou `/LRN/EMPLOYEE_ID`).
   - Rótulos (*Field Labels*):
     - `Z##_DEPMENT_HEAD`: "Department Head" / "Dep. Head".
     - `Z##_DEPMENT_ASSISTANT`: "Department Assistant" / "Dep. Assistant".
3. Adicione as chaves estrangeiras com as seguintes regras de negócio e cardinalidades:
   - **Head (`head_id`):** Cardinalidade `[0..1,0..1]` (um empregado pode liderar no máximo um departamento; um departamento pode existir temporariamente sem líder).
   - **Assistant (`assistant_id`):** Cardinalidade `[0..1,1]` (um empregado pode ser assistente de no máximo um departamento; todo departamento deve obrigatoriamente ter um assistente).

```abap
  @AbapCatalog.foreignKey.screenCheck : false
  head_id      : z##_depment_head
    with foreign key [0..1,0..1] z##employ
      where client      = z##depment.client
        and employee_id = z##depment.head_id;

  @AbapCatalog.foreignKey.screenCheck : false
  assistant_id : z##_depment_assistant
    with foreign key [0..1,1] z##employ
      where client      = z##depment.client
        and employee_id = z##depment.assistant_id;
```

4. Salve e ative a tabela `Z##DEPMENT` (**Ctrl + F3**).

---

### Tarefa 4: Carga e Verificação dos Dados

1. Abra a classe executável **`Z##_S4D430_CHECK_AND_FILL`** criada anteriormente.
2. Altere o valor da constante `c_version` para ativar o gerador com relacionamentos:

```abap
* CONSTANTS c_version TYPE t_version VALUE lcl_generator=>employee_table_only.
  CONSTANTS c_version TYPE t_version VALUE lcl_generator=>with_relationships.
* CONSTANTS c_version TYPE t_version VALUE lcl_generator=>with_extensions.
```

3. Assegure que as constantes `c_employ_table` e `c_depment_table` apontam para as suas tabelas `z##employ` e `z##depment`.
4. Ative (**Ctrl + F3**) e execute a classe (**F9**).
5. Certifique-se de que o console exiba as mensagens de sucesso preenchendo ambas as tabelas:
   - `Filled table Z##DEPMENT ...`
   - `Filled table Z##EMPLOY ...`
