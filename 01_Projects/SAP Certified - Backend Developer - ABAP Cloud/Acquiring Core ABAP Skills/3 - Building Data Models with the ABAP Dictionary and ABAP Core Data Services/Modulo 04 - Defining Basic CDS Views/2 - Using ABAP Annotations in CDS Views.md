---
tipo: clippings
title: "Using ABAP Annotations in CDS Views"
source: "https://learning.sap.com/courses/building-data-models-with-the-abap-dictionary-and-abap-core-data-services/using-abap-annotations-in-cds-views_fcda7ade-1bb7-4c79-8b1f-0f20c7f45a70"
created: 2026-11-03
tags:
  - sap
  - abap
  - abap-cloud
  - cds
  - annotations
  - active-annotations
  - semantics
  - translatable-texts
  - adt
---
**Roteiro de Estudos Relacionado:** [[Roteiro de Estudos SAP]]

# Objetivos de Aprendizado

Após concluir esta lição, você será capaz de:
- Utilizar anotações ABAP (*ABAP Annotations*) no nível de entidade e no nível de elementos em visões CDS.
- Aplicar variantes de sintaxe: anotações pontilhadas individuais e anotações agrupadas (*Grouped Annotations*).
- Trabalhar com textos traduzíveis (*Translatable Texts*) em anotações `@EndUserText`.
- Inspecionar e auditar as anotações efetivas em tempo de execução utilizando a visão **Active Annotations** do ADT.

---

## 1. Anotações ABAP no Nível de Entidade (*View-Level Annotations*)

Anotações no nível de entidade precedem a cláusula `define view entity` e configuram propriedades globais de comportamento técnico, autorização e documentação da visão.

![[ABAP_Annotations_for_Views_001.png]]

![[ABAP_Annos4Views_002a.png]]

### Anotações Mandatórias e Comuns no Nível de Visão:
* **`@AccessControl.authorizationCheck` (Mandatória):**
  Define como o motor de autorizações deve se comportar quando a visão for consultada:
  - **`#CHECK`**: Verifica e aplica ativamente as regras de controle de acesso (DCL / Access Control).
  - **`#NOT_REQUIRED`**: Dispensa a verificação de autorização (típico para tabelas de configuração ou visões sem dados confidenciais).
  - **`#MANDATORY`**: Exige obrigatoriamente a existência de um Access Control associado.
* **`@EndUserText.label` (Mandatória):**
  Define a descrição textual legível para a visão CDS.
* **`@Metadata.ignorePropagatedAnnotations`:**
  Controla se a visão herdará automaticamente anotações das visões subjacentes na cláusula `FROM` (estudado na lição seguinte).

---

## 2. Anotações no Nível de Elemento (*Element-Level Annotations*)

Anotações no nível de elemento qualificam propriedades de um campo específico na lista de seleção. Elas precedem imediatamente o campo ao qual se aplicam:

![[ABAP_Annotations_for_View_Elements_001.png]]

```abap
{
  key id            as DepartmentId,
  
      @EndUserText.label: 'Department Name'
      @EndUserText.quickInfo: 'Official Name of Department'
      description   as Description,

      @Semantics.amount.currencyCode: 'CurrencyCode'
      salary_amount as SalaryAmount,

      currency_code as CurrencyCode
}
```

### Anotações Semânticas Mandatórias:
Para qualquer campo que represente um montante financeiro (`CURR`) ou uma quantidade física (`QUAN`), a definição de uma CDS View Entity exige **obrigatoriamente** o vínculo ao campo de referência:
- `@Semantics.amount.currencyCode: 'CurrencyField'`
- `@Semantics.quantity.unitOfMeasure: 'UnitField'`

---

## 3. Variantes de Sintaxe: Notação Pontilhada vs. Anotações Agrupadas

Ao configurar anotações com múltiplos subcomponentes (muito comuns em anotações `@UI`), você pode utilizar duas sintaxes equivalentes:

### A. Notação Pontilhada Individual (*Dotted Syntax*)
Cada atributo é declarado separadamente repetindo o caminho completo:

![[Syntax_Variants_for_Annotations_002.png]]

```abap
@UI.lineItem.position: 10
@UI.lineItem.importance: #HIGH
description as Description
```

### B. Notação Agrupada (*Grouped Syntax*)
Os atributos são combinados em um bloco único utilizando colchetes e chaves `{ ... }`:

![[Syntax_Variants_for_Annotations_003.png]]

```abap
@UI.lineItem: [{ position: 10, importance: #HIGH }]
description as Description
```

A sintaxe agrupada com colchetes `[{ ... }]` permite ainda atribuir arrays de anotações (por exemplo, quando o mesmo campo deve aparecer em múltiplas posições ou facetas diferentes de tela).

---

## 4. Anotações para Textos Traduzíveis (*Translatable Texts*)

As anotações sob o nó `@EndUserText` (como `@EndUserText.label` e `@EndUserText.quickInfo`) definem literais de texto delimitados por apóstrofos:

![[ABAP_Annotations_for_Translatable_Texts_001.png]]

```abap
@EndUserText.label: 'Department'
```

* **Internacionalização:** Esses textos não são fixos para o usuário final; eles são registrados no repositório de traduções da SAP e podem ser traduzidos para diversos idiomas através das ferramentas padrão de localização (como a transação `SE63`). O usuário visualiza o texto correspondente ao idioma de logon de sua sessão.

---

## 5. Inspecionando Anotações na Visão *Active Annotations*

Em modelos complexos com anotações herdadas e extensões de metadados, pode ser difícil determinar quais anotações estão realmente em vigor em tempo de execução. O ADT disponibiliza a ferramenta **Active Annotations**:

![[Active_Annotations_View_001.png]]

<iframe 
    src="https://cdnapisec.kaltura.com/p/1921661/embedPlaykitJs/uiconf_id/50355372?iframeembed=true&entry_id=1_8u4yg15l" 
    width="100%" 
    height="400" 
    allowfullscreen 
    frameborder="0">
</iframe>

![[Active_Annotations_View_002.png]]

1. No editor da visão CDS, clique com o botão direito e escolha **Open With $\rightarrow$ Active Annotations**.
2. A visão exibe a árvore completa de anotações ativas consolidadas, indicando a origem de cada anotação (entidade atual, herança de fontes subjacentes ou Metadata Extensions).

---

## 6. Prática Hands-On: Aplicar Anotações em uma Data Definition

> [!NOTE] Objetivo do Exercício
> Neste laboratório, você enriquecerá semanticamente a visão `Z##_I_DEPARTMENT` com anotações de nível de visão e elemento, e inspecionará o resultado na visão Active Annotations.

---

### Passo 1: Adicionar Anotações Semânticas
Abra a visão `Z##_I_DEPARTMENT` e atualize o código:

```abap
@AccessControl.authorizationCheck: #NOT_REQUIRED
@EndUserText.label: 'Department View'
define view entity Z01_I_Department
  as select from /lrn/departmnt
{
  @EndUserText.label: 'Department Identifier'
  key id          as DepartmentId,

  @EndUserText.label: 'Department Name'
  @EndUserText.quickInfo: 'Full official name of department'
      description as Description
}
```

---

### Passo 2: Ativar e Inspecionar na Visão Active Annotations
1. Ative a visão pressionando **Ctrl + F3**.
2. Clique com o botão direito no editor e selecione **Open With $\rightarrow$ Active Annotations**.
3. Verifique como o sistema consolida os rótulos `@EndUserText.label` e o nível de autorização `@AccessControl.authorizationCheck`.
