---
tipo: clippings
title: "Extending Dictionary Objects"
source: "https://learning.sap.com/courses/building-data-models-with-the-abap-dictionary-and-abap-core-data-services/extending-dictionary-objects_b0c9bfa6-d415-408c-baed-2f15fb3a977f"
created: 2026-11-03
tags:
  - sap
  - abap
  - abap-cloud
  - ddic
  - append-structures
  - extensibility
  - enhancement-category
  - clean-core
---
**Roteiro de Estudos Relacionado:** [[Roteiro de Estudos SAP]]

# Objetivos de Aprendizado

Após concluir esta lição, você será capaz de:
- Estender tabelas de banco de dados e tipos de estrutura sem modificação direta utilizando **Append Structures**.
- Compreender os princípios de extensibilidade estável e alinhada ao **Clean Core** durante ciclos de upgrade.
- Aplicar as regras de nomenclatura do *Customer Namespace* (prefixos `ZZ` e `YY`).
- Configurar anotações de controle de extensibilidade no dicionário (`@AbapCatalog.enhancement.*`).
- Compreender o uso arquitetural de **Extension Includes** pela SAP.

---

# 1. O que são Append Structures?

No desenvolvimento corporativo, clientes e parceiros frequentemente precisam adicionar novos campos de negócio a tabelas de banco de dados e estruturas fornecidas pela SAP.

![[01AppendStructures_001.png]]

Alterar diretamente a definição da tabela entregue pela SAP é uma prática proibida que quebra a estabilidade e viola o paradigma **Clean Core**. A solução oficial da plataforma são as **Append Structures**:

![[01AppendStructures_002.png]]

- Uma **Append Structure** é um objeto do ABAP Dictionary independente, pertencente e mantido no pacote do cliente ou parceiro.
- Ela conecta-se logicamente à tabela de banco de dados ou estrutura de destino através da instrução `extend type`.
- Durante a ativação da Append Structure, o compilador adiciona suas colunas à tabela física no banco de dados via comando SQL `ALTER TABLE`.
- A tabela no banco de dados passa a ser definida conjuntamente por dois objetos do repositório: a definição da tabela base e a(s) Append Structure(s).

> [!NOTE] Cardinalidade de Extensão
> Uma Append Structure pertence a exatamente uma tabela de banco de dados. No entanto, uma mesma tabela pode conter múltiplas Append Structures criadas por diferentes soluções ou parceiros.

---

### Blindagem de Upgrades (*Upgrade-Safe Extensibility*)

![[01AppendStructures_003.png]]

Quando a SAP disponibiliza uma nova versão do sistema (upgrade ou atualização de release) com novos campos na tabela padrão, os campos customizados do cliente mantidos nas Append Structures não são sobrescritos nem perdidos. O mecanismo de ajuste do banco incorpora as novas colunas da SAP preservando integralmente os campos de extensão do cliente.

---

### Namespace de Cliente: Prefixos `ZZ` e `YY`

![[01AppendStructures_004.png]]

Para evitar conflitos de nomes (*Naming Clashes*) caso a SAP decida criar um campo com o mesmo nome em lançamentos futuros:
- Todos os campos adicionados em Append Structures devem **obrigatoriamente iniciar com os prefixos `ZZ` ou `YY`** (espaço reservado exclusivamente para clientes).
- A SAP compromete-se formalmente a nunca criar campos de produto padrão que comecem com `ZZ` ou `YY`.

---

# 2. Controle de Extensibilidade no ABAP Dictionary

O proprietário de uma tabela ou estrutura do dicionário pode restringir ou proibir extensões através de anotações técnicas sob o grupo **`@AbapCatalog.enhancement.*`**:

![[02ExtensibilityControlDDIC_001.png]]

| Anotação | Finalidade Técnica | Valores Possíveis |
| :--- | :--- | :--- |
| **`category`** | Define a categoria de extensão permitida para o objeto. | • **`#NOT_EXTENSIBLE`**: Proíbe qualquer extensão.<br>• **`#EXTENSIBLE_CHARACTER`**: Permite apenas campos alfanuméricos/texto.<br>• **`#EXTENSIBLE_CHARACTER_NUMERIC`**: Permite campos de texto e tipos numéricos (como `INT4`, `DEC`, etc.).<br>• **`#EXTENSIBLE_ANY`**: Permite qualquer tipo de dados.<br>• **`#NOT_CLASSIFIED`**: Não classificado. |
| **`fieldSuffix`** | Define um **sufixo obrigatório de 3 caracteres** para todos os campos adicionados por extensões (ex: `'ZEM'`). | Exige que o campo termine com o sufixo (ex: `ZZTITLE_ZEM`), garantindo que extensões de múltiplos parceiros não colidam. |
| **`quotaMaximumFields`** | Limite máximo numérico de campos que podem ser adicionados por extensões. | Reserva uma cota controlada de campos na tabela. |
| **`quotaMaximumBytes`** | Limite máximo em bytes da capacidade adicional permitida para extensões. | Evita estouro de largura máxima de linha no banco de dados. |

---

# 3. Uso de Extension Includes pela SAP

Em tabelas padrão de grande porte (como tabelas do cenário de viagens e agências `/DMO/*`), a SAP costuma bloquear extensões diretas na tabela transparente e direcionar o desenvolvedor para um **Extension Include**:

![[02ExtensibilityControlDDIC_002.png]]
![[02ExtensibilityControlDDIC_003.png]]

1. A tabela física transparente inclui uma estrutura intermediária de extensão (ex: `/DMO/S_EXT_INCL_AGENCY`).
2. O desenvolvedor cria a Append Structure estendendo **não a tabela**, mas sim a estrutura de extensão include.
3. Isso garante que a SAP possa reutilizar o mesmo conjunto de campos de extensão em múltiplas tabelas e estruturas correlatas de forma consistente.

---

# 4. Demonstrações em Vídeo

### Vídeo 1: How to Extend a Database Table Definition
Veja a análise das anotações de extensibilidade, restrição de sufixo e validações no ADT:

<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%;">
  <iframe 
    src="https://cdnapisec.kaltura.com/p/1926081/sp/192608100/embedIframeJs/uiconf_id/27230482/partner_id/1926081?iframeembed=true&playerId=kaltura_player&entry_id=1_gjm6mbef" 
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;" 
    allowfullscreen 
    webkitallowfullscreen 
    mozAllowFullScreen 
    allow="autoplay *; fullscreen *; encrypted-media *" 
    title="How to Extend a Database Table Definition">
  </iframe>
</div>

---

### Vídeo 2: Creating an Append Structure
Passo a passo rápido para disparar a criação de Append Structures pelo Project Explorer e inspecionar tabelas estendidas através do tooltip **F2**:

<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%;">
  <iframe 
    src="https://cdnapisec.kaltura.com/p/1926081/sp/192608100/embedIframeJs/uiconf_id/27230482/partner_id/1926081?iframeembed=true&playerId=kaltura_player&entry_id=1_hc7gpe26" 
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;" 
    allowfullscreen 
    webkitallowfullscreen 
    mozAllowFullScreen 
    allow="autoplay *; fullscreen *; encrypted-media *" 
    title="Creating an Append Structure">
  </iframe>
</div>

---

# 5. Exercício Prático: Estendendo uma Tabela de Banco de Dados (*Hands-on*)

### Objetivos do Exercício
1. Configurar as anotações de extensibilidade na tabela `Z##EMPLOY` permitindo campos numéricos e alfanuméricos e exigindo o sufixo `'ZEM'`.
2. Criar a Append Structure **`Z##_S_EXT_EMPLOYEE`** adicionando os campos `zztitle_zem` e `zzcountry_zem`.
3. Atualizar a carga de dados executando a classe `Z##_S4D430_CHECK_AND_FILL` com a versão `with_extensions`.

- **Objeto Solução de Referência da SAP:** `/LRN/S_EXT_EMPLOYEE` (Structure Type)

---

### Tarefa 1: Habilitar Extensibilidade em `Z##EMPLOY`

1. Abra a definição da tabela de dados de empregados **`Z##EMPLOY`**.
2. Altere o valor de `@AbapCatalog.enhancement.category` e adicione o sufixo de campo obrigatório:

```abap
@AbapCatalog.enhancement.category    : #EXTENSIBLE_CHARACTER_NUMERIC
@AbapCatalog.enhancement.fieldSuffix : 'ZEM'
```

3. Salve e ative a tabela pressionando **Ctrl + F3**.

---

### Tarefa 2: Criar a Append Structure (`Z##_S_EXT_EMPLOYEE`)

1. Na tabela `Z##EMPLOY`, posicione o cursor sobre o nome da tabela e pressione **Ctrl + 1** $\rightarrow$ selecione **Create append structure for...**.
2. Nome: **`Z##_S_EXT_EMPLOYEE`** | Descrição: **`Employee (Append Structure)`**.
3. No editor DDL da estrutura, adicione os componentes respeitando os prefixos de namespace de cliente (`ZZ`) e o sufixo obrigatório (`_ZEM`):

```abap
extend type z##employ with z##_s_ext_employee {
  zztitle_zem   : /dmo/title;
  zzcountry_zem : land1;
}
```

4. Salve e ative com **Ctrl + F3**.
5. Retorne ao código de `Z##EMPLOY`, posicione o cursor no nome da tabela e pressione **F2**: confira na seção **Extended With** que a sua nova estrutura foi acoplada com sucesso à tabela de banco de dados!

---

### Tarefa 3: Preencher os Novos Campos de Extensão

1. Abra a classe executável **`Z##_S4D430_CHECK_AND_FILL`**.
2. Altere a constante `c_version` para ativar a rotina com campos de extensão:

```abap
* CONSTANTS c_version TYPE t_version VALUE lcl_generator=>employee_table_only.
* CONSTANTS c_version TYPE t_version VALUE lcl_generator=>with_relationships.
  CONSTANTS c_version TYPE t_version VALUE lcl_generator=>with_extensions.
```

3. Ative (**Ctrl + F3**) e execute a classe (**F9**).
4. Abra a tabela `Z##EMPLOY` no Data Preview (**F8**) e comprove que os novos campos `ZZTITLE_ZEM` e `ZZCOUNTRY_ZEM` foram devidamente populados sem qualquer alteração na definição original da tabela!
