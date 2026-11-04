---
tipo: clippings
title: "Evaluating SAP Fiori"
source: "https://learning.sap.com/courses/practicing-clean-core-extensibility-for-sap-s-4hana-cloud/evaluating-sap-fiori_ea5722e6-9c73-4d9d-b0f4-544b36fc56d2"
created: 2026-11-03
tags:
  - sap
  - abap
  - abap-cloud
  - sap-fiori
  - sapui5
  - fiori-elements
  - bas
  - clean-core
  - floorplans
---
**Roteiro de Estudos Relacionado:** [[Roteiro de Estudos SAP]]

# Objetivos de Aprendizado

Após concluir esta lição, você será capaz de:
- Descrever a importância de uma experiência do usuário de nível de consumidor (*Consumer-Grade User Experience - UX*).
- Explicar os benefícios e os blocos de construção arquiteturais do **SAP Fiori**, **SAPUI5** e **SAP Business Application Studio (BAS)**.
- Diferenciar os modelos de design (*floorplans*) do **SAP Fiori Elements** e sua integração com o modelo de anotações do ABAP CDS.
- Enumerar os cinco princípios fundamentais de design do SAP Fiori.

---

## 1. A Importância de uma UX de Nível de Consumidor (*Consumer-Grade UX*)

Por mais inovadora e potente que seja uma aplicação corporativa de backend, é a **adoção bem-sucedida pelos usuários finais** que define, em última análise, o sucesso ou fracasso do software. E nenhum aspecto influencia mais essa adoção do que a **Experiência do Usuário (*User Experience - UX*)**.

![[ConsumerGradeUX_Image.png]]

Hoje, ao contrário do passado, os usuários esperam que as aplicações corporativas de trabalho tenham a mesma elegância visual, fluidez e facilidade de uso dos aplicativos que utilizam diariamente em seus smartphones, tablets e navegadores web pessoais.

O equilíbrio entre as necessidades dos usuários finais, do negócio e da equipe de TI gera um cenário de ganho mútuo (*win-win*):
- **Aumento de Produtividade (*Productivity Gains*):** Usuários concluem tarefas transacionais mais rapidamente com interfaces limpas.
- **Redução nos Custos de Treinamento (*Training Cost Savings*):** Interfaces intuitivas demandam muito menos tempo de capacitação e manuais complexos.
- **Redução Drástica de Erros Operacionais (*Reduction in User Errors*):** Menos campos desnecessários resultam em menos falhas de digitação e dados corrompidos.
- **Menos Chamados de Suporte na TI:** A equipe de TI gasta significativamente menos tempo processando tickets de suporte técnico.
- **Maior Índice de Satisfação (*Net Promoter Score - NPS*):** Menos frustração e melhor relacionamento corporativo.

### O que é UX segundo a ISO e a SAP?
A norma internacional **ISO 9241** define a experiência do usuário como:
> *"As percepções e respostas de um usuário resultantes do uso e/ou da antecipação do uso de um sistema, produto ou serviço."*

Para a SAP, essa definição molda o conceito estratégico de **Consumer-Grade UX** — um dos pilares centrais da proposta de valor do **SAP S/4HANA Cloud**, materializado primordialmente no **SAP Fiori**.

> [!NOTE] Conexão com o Clean Core
> O SAP Fiori é parte essencial da estratégia de **Clean Core**: as aplicações frontend nunca acessam tabelas de banco de dados diretamente; elas consomem exclusivamente **interfaces de dados estáveis e bem definidas (APIs remotas baseadas no protocolo OData)** expostas pelo backend.

---

## 2. Benefícios e Blocos de Construção do SAP Fiori

![[SAPFiori_Image.png]]

### Consistência Visual com SAPUI5
Tanto os aplicativos desenvolvidos manualmente quanto os gerados automaticamente são construídos sobre o **SAPUI5**, o framework de UI da SAP baseado em tecnologias web abertas:
- **Tecnologias Base:** HTML5, CSS3 e JavaScript, além das bibliotecas consagradas LESS e jQuery.
- **Controles Padronizados:** Oferece cerca de 200 controles de interface prontos (tabelas, campos de entrada, gráficos analíticos, seletores de data) que se comportam e possuem aparência idêntica em qualquer módulo — seja no app *Cash Flow Analyzer* (utilizado por especialistas de finanças) ou no app *Count Physical Inventory* (utilizado por operadores de armazém).

### SAP Business Application Studio (BAS)
Ambiente de desenvolvimento integrado (IDE) moderno baseado em nuvem, disponibilizado como serviço na **SAP Business Technology Platform (SAP BTP)**:
- Fornece assistentes passo a passo (*wizards*), ferramentas gráficas de modelagem e geradores de código.
- Permite gerar toda a estrutura do projeto, arquivos de configuração e boilerplates de código em poucos cliques, acelerando dramaticamente o tempo de desenvolvimento em comparação à criação manual do zero.

### SAP Fiori Elements e Fiori Tools
Ao criar um aplicativo, a equipe de projeto escolhe entre duas estratégias de implementação:
1. **Desenvolvimento Freestyle (*SAPUI5 Freestyle*):** Máxima liberdade de layout, onde o desenvolvedor desenha cada tela e programa o código JavaScript manualmente.
2. **SAP Fiori Elements (Abordagem Guiada por Metadados):** O framework gera o frontend dinamicamente a partir de metadados e anotações XML/CDS. O desenvolvedor não precisa escrever código HTML5 ou JavaScript para desenhar telas comuns.

| Característica | SAPUI5 Freestyle | SAP Fiori Elements |
| :--- | :--- | :--- |
| **Abordagem de Construção** | Programação visual direta em código | Baseada em templates e metadados (*Metadata-driven*) |
| **Velocidade de Entrega** | Menor (requer escrita de código de tela) | Altíssima (esforço concentrado no backend) |
| **Recursos Corporativos Nativos** | Devem ser codificados manualmente | Entregues prontos (acessibilidade, gestão de variantes, modo de rascunho/draft) |
| **Padrão de Consistência** | Depende do rigor do desenvolvedor | 100% aderente às diretrizes de design da SAP |

### Modelos de Páginas (*Floorplans*) do SAP Fiori Elements
O SAP Fiori Elements agrupa os casos de uso de negócio em padrões de tela pré-definidos (*Floorplans*):
- **List Report:** Apresentação de grandes volumes de itens com filtros avançados e exportação.
- **Object Page:** Exibição e edição detalhada de uma instância de negócio (ex: cabeçalho e itens de uma ordem de venda).
- **Worklist:** Gestão orientada a tarefas pendentes de processamento pelo operador.
- **Analytical List Page:** Combinação integrada de gráficos dinâmicos com relatórios em tabela para tomada de decisão analítica.
- **Overview Page:** Dashboard interativo com múltiplos cartões (*cards*) sintetizando informações vitais.
- **Initial Page e Wizard:** Fluxos sequenciais e guiados passo a passo para preenchimento de dados complexos.

### Acoplamento Inteligente: Anotações no ABAP CDS vs BAS
No modelo moderno de desenvolvimento (**Flexible Programming Model**), o SAP Fiori conecta-se a um serviço OData publicado a partir de **CDS View Entities** no ABAP:
- **Anotações Globais no ABAP CDS:** Metadados semânticos de escopo geral (como rótulos de campos `@EndUserText.label`, conversões de unidades e ajudas de pesquisa) são declarados diretamente na camada ABAP, garantindo reutilização automática em todos os apps que consomem a entidade.
- **Anotações Específicas no BAS:** Anotações locais de layout e visibilidade de tela particulares de um app são configuradas no próprio projeto do Business Application Studio.

---

## 3. Os Cinco Princípios Fundamentais de Design do SAP Fiori

![[SAPFioriDesignGuidelines_Scr.png]]

A experiência do usuário no SAP Fiori é norteada por cinco pilares conceituais:

| Princípio Oficial SAP | Conceito e Implementação Prática |
| :--- | :--- |
| **1. Baseado em Papéis (*Role-Based*)** | Cada usuário visualiza exclusivamente as aplicações e os dados necessários para sua função corporativa. A distribuição é gerenciada por meio de **Catálogos (*Catalogs*)** e **Grupos (*Groups*)** vinculados a perfis de autorização na transação `PFCG`. |
| **2. Adaptativo (*Adaptive*)** | As aplicações adaptam seu layout dinamicamente a qualquer dispositivo (smartphones, tablets, notebooks e desktops). O recurso de **Rascunho (*Draft Handling*)** do modelo ABAP permite que o usuário inicie uma transação no celular e conclua a gravação no computador mais tarde sem perda de dados. |
| **3. Simples (*Simple*)** | Aplicação do **"Princípio de Um" (*Principle of One*)**: 1 usuário, 1 caso de uso delimitado, em até 3 telas simples. Adeus às telas do SAP GUI sobrecarregadas de dezenas de abas e botões não utilizados. |
| **4. Coerente (*Coherent*)** | Interação padronizada em toda a organização corporativa. Se o usuário aprende a filtrar uma tabela em compras, sabe intuitivamente operar o app de contas a pagar. |
| **5. Agradável (*Delightful*)** | A interface agrega valor emocional e profissional ao usuário, permitindo que execute suas metas de trabalho sem atrito tecnológico. |

---

## 4. Simulação Prática Oficial SAP (Enable Now)

Experimente a criação de um aplicativo SAP Fiori na prática através do ambiente guiado oficial da SAP:

> [!TIP] Exercício Prático Interativo
> **Título:** *Create an SAP Fiori Application*  
> **Link Oficial:** [Iniciar Simulação no SAP Enable Now](https://learnsap.enable-now.cloud.sap/pub/mmcp/index.html?show=project!PR_E638047297BCDEB3:uebung)  
> **Objetivo:** Conhecer o fluxo prático de criação e configuração de um aplicativo SAP Fiori utilizando o assistente guiado no ambiente de ferramentas da SAP.
