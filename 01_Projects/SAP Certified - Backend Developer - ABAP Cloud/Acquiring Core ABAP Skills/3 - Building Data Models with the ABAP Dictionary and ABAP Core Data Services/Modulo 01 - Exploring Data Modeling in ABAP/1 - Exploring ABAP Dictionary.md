---
tipo: clippings
title: "Exploring ABAP Dictionary"
source: "https://learning.sap.com/courses/building-data-models-with-the-abap-dictionary-and-abap-core-data-services/exploring-abap-dictionary_af8fdedf-0a10-43ab-aa1b-20abbece9d8b"
created: 2026-11-03
tags:
  - sap
  - abap
  - abap-cloud
  - ddic
  - data-modeling
  - data-elements
  - domains
  - structures
  - table-types
  - adt
---
**Roteiro de Estudos Relacionado:** [[Roteiro de Estudos SAP]]

# Objetivos de Aprendizado

Após concluir esta lição, você será capaz de:
- Descrever as tarefas fundamentais do **ABAP Dictionary (DDIC)**.
- Nomear e classificar os objetos mais importantes do ABAP Dictionary.

---

## 1. O ABAP Dictionary no Mundo ABAP Clássico

O **ABAP Dictionary** sempre desempenhou um papel central na programação ABAP e continua desempenhando até hoje.

<iframe 
    src="https://cdnapisec.kaltura.com/p/1921661/embedPlaykitJs/uiconf_id/50355372?iframeembed=true&entry_id=1_qpyeud5m" 
    width="100%" 
    height="400" 
    allowfullscreen 
    frameborder="0">
</iframe>

> [!NOTE] Transcrição do Vídeo: Tarefas do ABAP Dictionary
> O ABAP Dictionary cumpre as seguintes tarefas:
> 1. **Definição de objetos no banco de dados:** Tabelas de banco de dados e visões, de forma independente do sistema de banco de dados real, para uso no ABAP SQL.
> 2. **Fornecimento de tipos de dados para o código ABAP:** Elementos de dados (*Data Elements*), estruturas (*Structures*) e tipos de tabelas (*Table Types*), para uso em declarações de dados e definições de parâmetros de interface, globalmente visíveis em todo o sistema.
> 3. **Fornecimento de serviços adicionais para interfaces de usuário clássicas:** Rótulos (*Field Labels*), documentação, ajudas de pesquisa (*Value Helps / F4*) e verificações automáticas de valores de entrada.

---

## 2. Tarefa 1: Definição de Objetos no Banco de Dados

Uma definição de tabela de banco de dados no ABAP Dictionary é uma representação da tabela no banco de dados. Ela é independente dos detalhes técnicos específicos do banco de dados relacional subjacente. Como exemplo, ela utiliza seus próprios tipos embutidos (*built-in types*) e não os tipos específicos do SGBD (HANA, Oracle, SQL Server, etc.). A definição contém a lista de campos da tabela e propriedades adicionais da tabela.

![[01DictionaryFunctions_002.png]]

- Quando o código ABAP acessa a tabela do banco de dados em uma instrução **ABAP SQL**, a verificação de sintaxe (*ABAP Syntax Check*) analisa a definição no ABAP Dictionary para garantir, entre outras coisas, que a tabela e as colunas referenciadas existam.
- Em tempo de execução (*runtime*), a **Database Interface** do kernel ABAP traduz a instrução ABAP SQL na sintaxe SQL específica do banco de dados e a envia ao banco. Para isso, ela também consulta a definição da tabela no ABAP Dictionary.

> [!NOTE] Nota da SAP sobre Visões de Banco de Dados
> No passado, as visões de banco de dados (*Database Views*) eram manipuladas exatamente da mesma forma. No entanto, essas visões do dicionário ABAP tornaram-se obsoletas e as visões do **ABAP Core Data Services (CDS)** são utilizadas em seu lugar (conforme estudado na próxima lição).

---

## 3. Tarefa 2: Fornecimento de Tipos de Dados para o Código ABAP

A segunda tarefa do ABAP Dictionary é fornecer tipos de dados para o código-fonte ABAP. Os tipos de dados definidos no ABAP Dictionary são visíveis em **todo o sistema**. Isso os diferencia dos tipos de dados locais definidos com a palavra-chave ABAP `TYPES`.

![[01DictionaryFunctions_003.png]]

Os tipos do Dicionário podem ser:
- **Tipos Escalares:** Elementos de Dados (*Data Elements*).
- **Tipos de Estrutura:** Estruturas (*Structures*).
- **Tipos de Tabela:** Tipos de Tabelas Internas (*Table Types*).

As definições de tabelas de banco de dados possuem um papel duplo: em primeiro lugar, definem um objeto de banco de dados; adicionalmente, também podem atuar como tipos de dados no código ABAP.

> [!NOTE] Nota da SAP sobre o Uso de Tabelas como Tipos
> De forma geral, o uso de definições de tabelas de banco de dados diretamente como tipos de dados no código ABAP não é recomendado. Em vez disso, utilize tipos de estrutura dedicados.

---

## 4. Tarefa 3: Serviços para Interfaces de Usuário Clássicas vs. ABAP Cloud

Nas tecnologias clássicas de interface de usuário (UI) do ABAP, o ABAP Dictionary cumpria uma terceira tarefa. Os objetos do dicionário, principalmente tipos de estrutura e definições de tabelas de banco de dados, eram enriquecidos com informações semânticas, como relações de chave estrangeira (*Foreign Key Relations*) e vinculações a ajudas de pesquisa (*Search Help Bindings*). Quando os elementos de UI referenciavam esses objetos do dicionário, as informações adicionais eram usadas para fornecer textos de tela ao usuário final, ajudas de valor (F4), validações de entrada e assim por diante.

![[01DictionaryFunctions_004.png]]

Esta tarefa do ABAP Dictionary **não é relevante para tecnologias modernas de interface de usuário**, nomeadamente o **ABAP RESTful Application Programming Model (RAP)**. O modelo ABAP RAP utiliza metadados presentes em entidades CDS para fornecer serviços para a interface do usuário.

> [!IMPORTANT] Diretriz Oficial do Curso
> Neste treinamento, não abordaremos recursos do ABAP Dictionary relacionados à programação de interface de usuário ABAP clássica. As técnicas clássicas de UI ABAP estão obsoletas e não são suportadas no **ABAP Cloud**.

---

## 5. Objetos do ABAP Dictionary

A seguir, apresentamos uma visão geral dos objetos mais importantes do ABAP Dictionary:

![[02DictionaryObjects_001.png]]

* **Domínios (*Domains*):** Não definem objetos de banco de dados e **não** são tipos de dados ABAP. Eles são utilizados apenas indiretamente, no interior de elementos de dados.
* **Elementos de Dados (*Data Elements*), Estruturas (*Structures*) e Tipos de Tabela (*Table Types*):** Definem tipos de dados ABAP. Eles não definem objetos de banco de dados próprios.
* **Definições de Tabelas de Banco de Dados e Visões de Banco de Dados:** O propósito principal de ambos é a definição de um objeto correspondente no banco de dados. Você também pode utilizá-los como tipos de dados, mas isso não é recomendado. Visões do dicionário são obsoletas e você deve utilizar visões CDS em seu lugar.

---

## 6. Objetos do Dicionário no Project Explorer do ADT

No **Project Explorer** do **ABAP Development Tools (ADT)** no Eclipse, você encontra os objetos do dicionário sob o pacote de desenvolvimento correspondente, em um nó dedicado denominado **Dictionary**.

![[02DictionaryObjects_002.png]]
