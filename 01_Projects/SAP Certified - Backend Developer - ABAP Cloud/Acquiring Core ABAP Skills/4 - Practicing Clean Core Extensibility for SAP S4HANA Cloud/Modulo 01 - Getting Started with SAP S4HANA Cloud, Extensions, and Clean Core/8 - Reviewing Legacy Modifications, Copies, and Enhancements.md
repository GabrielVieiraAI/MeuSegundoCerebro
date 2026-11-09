---
tipo: clippings
title: "Reviewing Legacy Modifications, Copies, and Enhancements"
source: "https://learning.sap.com/courses/practicing-clean-core-extensibility-for-sap-s-4hana-cloud/reviewing-legacy-modifications-copies-and-enhancements_f55306cd-c7bc-4a91-a4ae-9dfa2ce610d1"
created: 2026-11-03
tags:
  - sap
  - abap
  - abap-cloud
  - clean-core
  - legacy-code-review
  - modifications
  - clones
  - implicit-enhancements
  - spau
  - spdd
---
**Roteiro de Estudos Relacionado:** [[Roteiro de Estudos SAP]]

# Objetivos de Aprendizado

Após concluir esta lição, você será capaz de:
- Conduzir uma revisão rigorosa de código legado (*Perform a legacy code review*).
- Classificar e diferenciar **modificações diretas** e **modificações indiretas** (clones, *implicit enhancements* e sobrescritas de métodos).
- Aplicar a estratégia de eliminação fundamentada nos 4 critérios de descarte do Clean Core.
- Conhecer as ferramentas oficiais de auditoria (`SPDD`, `SPAU`, `SPAU_ENH` e *Clone Finder*).

---

## 1. Classificação de Modificações no Modelo Legado

Ao longo dos anos, clientes recorreram a técnicas invasivas para ajustar o comportamento do sistema. Para planejar o Clean Core, é fundamental classificar essas modificações:

![[Transition_to_SAP_S4HANA_006.png]]

### Modificações Diretas (*Direct Modifications*)
Uma modificação direta é qualquer alteração efetuada diretamente no código-fonte ou na definição técnica de um objeto entregue pela SAP no repositório standard:
- Em alguns casos, a alteração foi instruída formalmente por uma Nota SAP emergencial (*SAP Note directive*).
- Na maioria dos casos, a alteração foi feita pelo desenvolvedor local para forçar a mudança de comportamento de uma rotina standard.

### Modificações Indiretas (*Indirect Modifications*)
Cobrem técnicas que, embora não alterem diretamente o código-fonte original do programa SAP, causam acoplamento perigoso:
1. **Cópias e Clones de Objetos SAP (*Clones*):** Programas, telas e includes standard copiados para o namespace do cliente (`Z` ou `Y`). Como o objeto é do cliente, ele deixa de receber correções e inovações do fornecedor.
2. **Ampliações Implícitas (*Implicit Enhancements*):** Código injetado nos pontos implícitos do compilador ABAP, especificamente no início (`BEGIN`) ou no fim (`END`) de rotinas, subrotinas e métodos standard.
3. **Sobrescrita de Métodos de Classes (*Class-Method Overwrites*):** Uso de *Pre-Methods*, *Post-Methods* ou *Overwrite-Methods* para alterar a execução de classes standard.

---

## 2. Ferramentas Oficiais de Auditoria e Ajuste

| Ferramenta / Transação | Momento de Execução | Função Técnica na Conversão |
| :--- | :---: | :--- |
| **`SPDD`** | Durante a execução do SUM | Ajuste de modificações no **Dicionário ABAP (DDIC)** (tabelas, estruturas, elementos de dados e domínios) antes da conversão de dados. |
| **`SPAU`** | Pós-conversão do SUM | Ajuste de objetos do repositório de desenvolvimento (programas, classes, funções e telas). |
| **`SPAU_ENH`** | Pós-conversão do SUM | Ajuste e validação de pontos de ampliação (*Enhancements* e *Implicit Enhancements*). |
| **Clone Finder** | Pré-conversão / Preparação | Varredura de programas `Z` que possuem alto grau de similaridade (duplicação) com código standard da SAP. |

---

## 3. A Postura de Eliminação do Clean Core: Os 4 Critérios de Descarte

O princípio basilar do Clean Core é a política inegociável de **Zero Modificações (*Zero Modifications*)**. Por isso, a equipe de migração deve abordar o código legado partindo da premissa de que **toda modificação deve ser eliminada**.

A experiência prática da SAP demonstra que praticamente 100% das modificações legadas se enquadram em uma das seguintes categorias:

| Categoria de Descarte | Motivo Técnico da Eliminação | Ação Recomendada |
| :--- | :--- | :--- |
| **1. Obsoleta (*Obsolete*)** | A SAP incorporou a mesma funcionalidade ou cálculo no código padrão do SAP S/4HANA. | **Reverter para o standard puro da SAP.** |
| **2. Não Utilizada (*Unused*)** | As métricas reais do `SCMON`/`UPL` comprovam que ninguém executa a função há mais de 12 meses. | **Descartar e deletar o objeto.** |
| **3. Irrelevante (*Irrelevant*)** | O ajuste perdeu o sentido técnico na nova arquitetura (ex: criação de índices secundários no banco de dados, que são desnecessários no banco colunar SAP HANA). | **Eliminar sem substituição.** |
| **4. Substituível (*Replaceable*)** | A necessidade de negócio ainda existe, mas pode ser facilmente atendida pelo modelo de **Key User Extensibility** (in-app no Fiori) ou por BAdIs liberadas. | **Redesenhar utilizando recursos Clean Core.** |

> [!NOTE] E se uma modificação for estritamente indispensável?
> Se após a análise for comprovado que uma modificação é essencial para a operação do negócio e não pode ser atendida pelo standard nem pelo modelo de extensibilidade do S/4HANA, a orientação formal da SAP é que o cliente abra um chamado oficial de arquitetura junto à SAP para obter orientações específicas de roadmap e viabilidade.

---

## 4. Simulação Prática Oficial SAP (Enable Now)

Pratique a definição do escopo de migração de código customizado na simulação oficial:

> [!TIP] Exercício Prático Interativo
> **Título:** *Specify a Migration Scope using the Custom Code Migration App*  
> **Link Oficial:** [Iniciar Simulação no SAP Enable Now](https://learnsap.enable-now.cloud.sap/pub/mmcp/index.html?show=project!PR_E165B7FA0EA0A0A5:uebung)  
> **Objetivo:** Conduzir uma análise de código customizado utilizando o app Fiori Custom Code Migration para definir os pacotes que serão adaptados versus eliminados no SUM.
