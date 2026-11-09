---
tipo: clippings
title: "Evaluating SAP Build"
source: "https://learning.sap.com/courses/practicing-clean-core-extensibility-for-sap-s-4hana-cloud/evaluating-sap-build_d6aca950-1bda-4d3f-abd6-337924f5a802"
created: 2026-11-03
tags:
  - sap
  - abap
  - abap-cloud
  - sap-build
  - sap-build-apps
  - sap-build-process-automation
  - sap-build-work-zone
  - citizen-developer
  - lcnc
---
**Roteiro de Estudos Relacionado:** [[Roteiro de Estudos SAP]]

# Objetivos de Aprendizado

Após concluir esta lição, você será capaz de:
- Comparar o desenvolvimento conduzido por desenvolvedores cidadãos (*Citizen Development*) versus o desenvolvimento tradicional (*Pro-Code Development*).
- Explicar as diferenças conceituais entre ferramentas **Low-Code** e **No-Code**.
- Diferenciar os três produtos oficiais que compõem o portfólio **SAP Build** na SAP BTP: **SAP Build Apps**, **SAP Build Process Automation** e **SAP Build Work Zone**.

---

## 1. A Emergência do Construtor (*The Emergence of the Builder*)

A computação em nuvem permite que inovações e atualizações sejam entregues com rapidez sem precedentes. Por consequência, os requisitos de negócios das empresas evoluem a um ritmo acelerado, exigindo que aplicações sejam criadas e modificadas quase que instantaneamente.

No entanto, as organizações enfrentam uma restrição severa de recursos: a **capacidade finita da equipe de TI**. Enquanto a capacidade de infraestrutura física (processamento, memória, armazenamento) escala com facilidade na nuvem, **pessoas (especificamente desenvolvedores de software profissionais) não escalam na mesma velocidade**, gerando uma escassez global de desenvolvedores (*developer shortage*).

![[Builder_Image.png]]

Para resolver essa tensão, surgiu a figura do **Desenvolvedor Cidadão (*Citizen Developer*)**, a quem a SAP se refere oficialmente pelo termo **Builder** (Construtor):
- Um **Builder** é um colaborador do negócio (frequentemente especialista em uma Linha de Negócio específica - *Line of Business / LoB*) que constrói aplicações, automações e portais utilizando ferramentas especializadas pré-aprovadas e governadas pela TI.
- Isso abre um novo caminho para as empresas: além de comprar softwares prontos de prateleira ou programar aplicações do zero (ambas as opções dependentes de programadores seniores), o próprio departamento de negócio passa a co-criar soluções.

### Diferenças entre Ferramentas Pro-Code e LCNC

| Categoria | Público-Alvo | Tipos de Ferramentas Utilizadas |
| :--- | :--- | :--- |
| **Desenvolvimento Tradicional (*Pro-Code*)** | Desenvolvedores Profissionais de Software | IDEs avançadas (Eclipse ADT, BAS), sintaxe formal de linguagens tipadas (ABAP, Java, TypeScript), depuradores integrados (*integrated debuggers*) e frameworks de testes unitários automatizados. |
| **Low-Code / No-Code (LCNC)** | Desenvolvedores Cidadãos (*Builders*) | Interfaces gráficas visuais e intuitivas, criação por arrastar e soltar (*drag-and-drop*), assistentes inteligentes com IA e geração automatizada de código. |

- **Low-Code:** Método de design e desenvolvimento que utiliza recursos visuais e componentes pré-fabricados para reduzir significativamente a necessidade de escrita manual de código tradicional (*pro-code*).
- **No-Code:** Leva a simplificação ao nível máximo, permitindo que especialistas de negócios sem nenhum conhecimento técnico de programação construam aplicações funcionais sem escrever **uma única linha de código**.

---

## 2. A Solução SAP Build na SAP BTP

![[SAPBuild_Image.png]]

Para capacitar os *Builders* com segurança corporativa e governança, a SAP disponibiliza o **SAP Build**. Hospedada na **SAP Business Technology Platform (SAP BTP)**, a suíte unifica desenvolvimento de aplicações, automações e pontos de acesso em uma plataforma no-code integrada, composta por três ferramentas que trabalham em conjunto:

```
                  ┌─────────────────────────────────────────┐
                  │          SAP Build Work Zone            │
                  │   (Portal Único e Espaço de Trabalho)   │
                  └────────────────────┬────────────────────┘
                                       │
                 ┌─────────────────────┴─────────────────────┐
                 │                                           │
  ┌──────────────┴──────────────┐             ┌──────────────┴──────────────┐
  │       SAP Build Apps        │             │ SAP Build Process Automation│
  │ (Criação de Apps No-Code)   │             │   (Workflows, RPA e IA)     │
  └──────────────┬──────────────┘             └──────────────┬──────────────┘
                 │                                           │
                 └─────────────────────┬─────────────────────┘
                                       │
                  ┌────────────────────┴────────────────────┐
                  │    Conexão com SAP S/4HANA Cloud        │
                  │    via APIs Liberadas (Released APIs)   │
                  └─────────────────────────────────────────┘
```

---

### A. SAP Build Apps

![[SAPBuildApps_Image.png]]

O **SAP Build Apps** é a solução no-code para criação de aplicações web e móveis corporativas:
- **Design Visual Drag-and-Drop:** Construtores montam interfaces ricas posicionando componentes de tela visualmente.
- **Lógica e Modelagem de Dados sem Código:** Definição de fluxos condicionais, validações e transformações através de blocos lógicos conectados graficamente.
- **Conectividade Segura:** Conecta-se nativamente ao **SAP S/4HANA Cloud** utilizando conectores pré-construídos e **APIs Públicas Liberadas (*Released APIs*)**, com autenticação e governança gerenciadas pelo SAP BTP.

---

### B. SAP Build Process Automation

![[SAPBuildProcessAuto_Image.png]]

O **SAP Build Process Automation** combina gerenciamento de fluxos de trabalho (*Workflow Management*) com automação robótica de processos (*Robotic Process Automation - RPA*):
- Permite desenhar fluxos de aprovação de ponta a ponta, roteamentos de formulários e orquestrações de tarefas sem codificação manual.
- Incorpora recursos de **Inteligência Artificial (IA)** para leitura inteligente de documentos (como faturas e pedidos) e tomada de decisão preditiva.
- Consome eventos e APIs padrão do SAP S/4HANA Cloud para disparar tarefas em segundo plano e sincronizar dados com sistemas externos.

---

### C. SAP Build Work Zone

![[SAPBuildWorkZone_Image.png]]

O **SAP Build Work Zone** é a ferramenta de criação de locais de trabalho digitais e portais corporativos unificados:
- Toda empresa necessita de uma porta de entrada padronizada para que seus colaboradores acessem as aplicações e informações pertinentes aos seus papéis.
- Enquanto o **SAP Fiori Launchpad** é o ponto de entrada primário padrão para aplicações operacionais do SAP Fiori, o **SAP Build Work Zone** eleva essa experiência a um portal colaborativo completo, agregando aplicações SAPUI5, apps do SAP Build, relatórios analíticos, documentos corporativos e canais de comunicação em um único local acessível por qualquer dispositivo.

---

## 3. Simulação Prática Oficial SAP (Enable Now)

Pratique a construção visual de interfaces sem código na simulação oficial:

> [!TIP] Exercício Prático Interativo
> **Título:** *Create a UX using SAP Build Apps*  
> **Link Oficial:** [Iniciar Simulação no SAP Enable Now](https://learnsap.enable-now.cloud.sap/pub/mmcp/index.html?show=project!PR_B483C3DF4A2E1B9A:uebung)  
> **Objetivo:** Experimentar o ambiente do SAP Build Apps para desenhar uma interface de usuário no-code integrada utilizando a técnica de arrastar e soltar.
