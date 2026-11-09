---
tipo: clippings
title: "Creating Metadata Extensions"
source: "https://learning.sap.com/courses/building-data-models-with-the-abap-dictionary-and-abap-core-data-services/creating-metadata-extensions_e9741689-4756-4528-a4b0-8e0ede0b14b0"
created: 2026-11-03
tags:
  - sap
  - abap
  - abap-cloud
  - cds
  - metadata-extensions
  - annotations
  - metadata-layer
  - rap
  - clean-core
---
**Roteiro de Estudos Relacionado:** [[Roteiro de Estudos SAP]]

# Objetivos de Aprendizado

Após concluir esta lição, você será capaz de:
- Adicionar e sobrescrever anotações em CDS Views sem modificar o código DDL utilizando **CDS Metadata Extensions** (`ANNOTATE VIEW`).
- Identificar as restrições e pré-requisitos para extensões de metadados (como `@Metadata.allowExtensions: true`).
- Dominar a hierarquia e as regras de prioridade das cinco camadas de metadados (`@Metadata.layer`).
- Aplicar ferramentas de refatoração no ADT para extrair anotações automaticamente (*Extract Metadata Extension*).
- Inspecionar a precedência e a origem efetiva de anotações utilizando a ferramenta **Active Annotations** no Eclipse ADT.

---

# 1. O que são CDS Metadata Extensions?

Enquanto as CDS View Extensions adicionam novos elementos e associações ao modelo de dados, as **CDS Metadata Extensions** têm como objetivo exclusivo adicionar ou sobrescrever **anotações de metadados** em elementos e parâmetros já existentes:

![[Metadata_Extensions_001.png]]

- **Sintaxe DDL:** Declaradas em um objeto próprio de repositório utilizando a instrução **`ANNOTATE VIEW`** (ou `ANNOTATE ENTITY`).
- **Desacoplamento Limpo:** Permitem desacoplar metadados pesados de interface com o usuário (anotações `@UI.*`), busca analítica e textos traduzíveis do código principal de álgebra relacional da visão.
- **Padrão Oficial no RAP:** No modelo de programação moderno **ABAP RESTful Application Programming Model (RAP)**, é uma diretriz de arquitetura oficial segregar todas as anotações visuais de tela em Metadata Extensions.

### Restrições Fundamentais:
1. **Sem Criação de Elementos:** Não é possível definir novos campos, aliases ou expressões dentro de uma Metadata Extension; ela apenas referencia elementos já existentes na visão base.
2. **Escopo de Anotações:** Apenas anotações permitidas para extensões podem ser mantidas (predominantemente anotações visuais `@UI.*`, analíticas `@Analytics.*`, de pesquisa `@Search.*` e de textos `@EndUserText.*`). Anotações semânticas de núcleo que alteram o comportamento do compilador (como tipo monetário) não devem ser alteradas por Metadata Extensions.
3. **Pré-requisito Obrigatório:** A CDS View Entity base deve permitir explicitamente extensões através da anotação:
```abap
@Metadata.allowExtensions: true
```

---

# 2. As Cinco Camadas de Metadados: Hierarquia e Prioridade

Para permitir que a SAP, parceiros e clientes configurem e personalizem metadados sem conflitos, cada Metadata Extension deve declarar obrigatoriamente a anotação **`@Metadata.layer`**:

![[Metadata_Extensions_002.png]]

Uma mesma CDS View Entity pode conter no máximo **cinco Metadata Extensions simultâneas**, desde que cada uma pertença a uma camada diferente. Quando valores de anotação colidem para o mesmo campo, o compilador adota a seguinte **ordem de precedência estrita (da maior para a menor prioridade)**:

| Camada (`@Metadata.layer`) | Prioridade | Capacidade de Sobrescrita |
| :--- | :---: | :--- |
| **`#CUSTOMER`** | 🥇 **1º (Mais Alta)** | **Sobrescreve todas as outras camadas.** As configurações definidas pelo cliente final sempre prevalecem sobre soluções prévias. |
| **`#PARTNER`** | 🥈 **2º** | Sobrescreve `#INDUSTRY`, `#LOCALIZATION` e `#CORE` (pode ser sobrescrita apenas por `#CUSTOMER`). |
| **`#INDUSTRY`** | 🥉 **3º** | Sobrescreve `#LOCALIZATION` e `#CORE` (para pacotes verticais de indústria). |
| **`#LOCALIZATION`** | 🏅 **4º** | Sobrescreve apenas `#CORE` (para requisitos fiscais ou locais de países). |
| **`#CORE`** | 🎖️ **5º (Mais Baixa)** | **Camada base de menor prioridade.** Pode ser sobrescrita por qualquer extensão de camadas superiores. É a camada onde a SAP entrega os layouts padrão de tela. |

> [!TIP] Pegadinha Clássica de Certificação
> Se um rótulo ativo vem da camada `#INDUSTRY`, você só conseguirá sobrescrevê-lo utilizando uma extensão nas camadas de prioridade superior: **`#CUSTOMER`** ou **`#PARTNER`**. Criar uma extensão em `#CORE` ou `#LOCALIZATION` não surtirá efeito!

---

# 3. Criando uma Metadata Extension no Eclipse ADT

No Project Explorer do ADT:
1. Clique com o botão direito na CDS Data Definition $\rightarrow$ **New Metadata Extension**.
2. Defina o nome e selecione o template **`Annotate View`** (ou *Annotate View with Parameters*):

![[05MetadataExtensionCreation_001.png]]

### Refatoração Automatizada (*Extract Metadata Extension*)
Você não precisa digitar todas as anotações do zero. O ADT oferece um assistente automatizado:
- No editor da CDS View Entity, acesse o menu **Source Code** $\rightarrow$ **Extract Metadata Extension**.
- O assistente varre a visão, seleciona todas as anotações elegíveis e as transfere para uma nova Metadata Extension gerada na camada `#CORE`, inserindo automaticamente `@Metadata.allowExtensions: true` na visão base!

---

# 4. Exercício Prático: Criando e Gerenciando Metadata Extensions (*Hands-on*)

### Objetivos do Exercício
1. Utilizar a ferramenta de refatoração do ADT para extrair as anotações de `Z##_C_EmployeeQueryP` para a Metadata Extension **`Z##_C_EmployeeQueryP`** na camada `#CORE`.
2. Habilitar a anotação `@Metadata.allowExtensions: true` na visão base via Quick Fix (**Ctrl + 1**).
3. Criar uma segunda Metadata Extension **`Z##_C_EMPLOYEE_QUERYP2`** na camada `#CUSTOMER` para sobrescrever o rótulo do parâmetro `p_date` e adicionar rótulo ao elemento `AssistantName`.
4. Inspecionar o resultado final na ferramenta **Active Annotations**.

- **Objetos Solução de Referência da SAP:**
  - `/LRN/C_EMPLOYEE_MDX` (Data Definition e Metadata Extension em `#CORE`)
  - `/LRN/C_EMPLOYEE_MDX2` (Metadata Extension em `#CUSTOMER`)

---

### Tarefa 1: Extrair Metadados para a Camada `#CORE`

1. Abra a visão **`Z##_C_EmployeeQueryP`** e certifique-se de que está ativa (**Ctrl + F3**).
2. No menu do Eclipse, acesse **Source Code** $\rightarrow$ **Extract Metadata Extension**.
3. No campo *Name*, use o mesmo nome da visão: **`Z##_C_EmployeeQueryP`**.
4. Descrição: **`Employee Query (Metadata)`** $\rightarrow$ clique em **Next**.
5. Na tela de seleção de anotações, clique em **Select All** $\rightarrow$ **Finish**.
6. No código gerado da Metadata Extension, defina a camada de menor prioridade:
```abap
@Metadata.layer: #CORE
annotate view Z##_C_EmployeeQueryP with
{ ... }
```
7. Posicione o cursor sobre o sublinhado na linha `annotate view` e pressione **Ctrl + 1** $\rightarrow$ execute o Quick Fix **`Add annotation 'Metadata.allowExtensions' to base view`**.
8. Ative todos os objetos pendentes (**Ctrl + Shift + F3**).
9. Clique com o botão direito no editor $\rightarrow$ **Open With** $\rightarrow$ **Active Annotations**: confira que na coluna **Origin Data Source**, várias anotações agora apontam diretamente para a sua extensão na camada `#CORE`!

---

### Tarefa 2: Criar Segunda Metadata Extension na Camada `#CUSTOMER`

1. No Project Explorer, clique com o botão direito em `Z##_C_EmployeeQueryP` $\rightarrow$ **New Metadata Extension**.
2. Nome: **`Z##_C_EMPLOYEE_QUERYP2`** | Descrição: **`Employee Query (Final Metadata)`**.
3. Escolha o template **Annotate View with Parameters** e clique em **Finish**.
4. Configure a anotação para a camada de maior prioridade (`#CUSTOMER`) e sobrescreva o rótulo do parâmetro de data e o rótulo do elemento do assistente:

```abap
@Metadata.layer: #CUSTOMER
annotate view Z##_C_EmployeeQueryP
  with parameters 
    @EndUserText.label: 'Currency Conversion Date'
    p_date 
{ 
  @EndUserText.label: 'Department Assistant'
  AssistantName;
}
```

5. Salve e ative a Metadata Extension (**Ctrl + F3**).
6. Abra novamente a visão base na aba **Active Annotations**:
   - Navegue até o parâmetro `p_date` $\rightarrow$ `@EndUserText.label`.
   - Comprove que o valor ativo agora é **`'Currency Conversion Date'`** e a coluna *Origin Data Source* exibe com orgulho **`Z##_C_EMPLOYEE_QUERYP2`**, comprovando que a camada `#CUSTOMER` sobrepôs com sucesso as camadas inferiores!
