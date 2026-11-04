---
tipo: clippings
title: "Quiz - Diving Deep into ABAP Cloud"
source: "https://learning.sap.com/courses/practicing-clean-core-extensibility-for-sap-s-4hana-cloud/diving-deep-into-the-abap-cloud-development-model_46da556c-4bc5-3980-9be4-18671aa9c25d"
created: 2026-11-03
tags:
  - sap
  - abap
  - abap-cloud
  - rap
  - rest
  - quiz
  - certifiacao
---
**Roteiro de Estudos Relacionado:** [[Roteiro de Estudos SAP]]

# Avaliação do Módulo 03: Diving Deep into ABAP Cloud

Teste seus conhecimentos sobre os conceitos fundamentais do **ABAP Cloud**, arquitetura **Cloud Native**, princípios **REST**, camadas do **RAP (ABAP RESTful Application Programming Model)**, **Reuse Services** e contratos de **Released APIs**.

---

### Questão 1
Which of the following are ABAP RESTful application programming model layers?
*(Selecione 3 respostas corretas)*

- [ ] A) Data Access
- [ ] B) Domain Model and Implementation
- [ ] C) CDS Annotations
- [ ] D) Business Service Exposure

> [!success]- Gabarito e Explicação Oficial da SAP
> **Respostas Corretas: A, B, D**
> 
> As três camadas arquiteturais que compõem o **ABAP RESTful Application Programming Model (RAP)** são:
> 1. **Data Access (Acesso a Dados):** Definida por meio de Core Data Services (CDS Views e CDS Entities) para leitura de dados com alto desempenho (*Code Pushdown* no SAP HANA).
> 2. **Domain Model and Implementation (Modelo de Domínio e Implementação):** Composta pela definição de comportamento (*Behavior Definition - BDEF*) e classes de implementação de comportamento (*Behavior Pools*) para regras de negócio, validações, determinações e controle de autorização.
> 3. **Business Service Exposure (Exposição de Serviços de Negócio):** Composta pela definição de serviço (*Service Definition*) e vinculação de serviço (*Service Binding*), publicando os modelos como serviços OData (v2/v4), InA ou Web APIs.
> 
> *CDS Annotations* são metadados declarativos usados em várias camadas, mas não constituem uma camada de arquitetura independente.

---

### Questão 2
Which of the following are currently available ABAP platform reuse services?
*(Selecione 3 respostas corretas)*

- [ ] A) Smartforms
- [ ] B) Email Service
- [ ] C) Knowledge Transfer Documents
- [ ] D) Change Documents

> [!success]- Gabarito e Explicação Oficial da SAP
> **Respostas Corretas: B, C, D**
> 
> Os serviços técnicos de reutilização atualmente fornecidos nativamente pela plataforma ABAP (*ABAP Platform Reuse Services*) incluem:
> - **Email Service:** Envio moderno de mensagens através da classe liberada `CL_BCS_MAIL_MESSAGE`.
> - **Knowledge Transfer Documents (KTD):** Documentação técnica em Markdown integrada diretamente aos artefatos no Eclipse ADT.
> - **Change Documents:** Rastreamento estruturado de modificações de dados integrado ao RAP.
> 
> *Smartforms* é uma tecnologia gráfica legada de formulários impressos que não é compatível com o modelo ABAP Cloud (em seu lugar, utiliza-se o **SAP BTP Forms by Adobe**).

---

### Questão 3
Which of the following are principles of REST architecture?
*(Selecione 3 respostas corretas)*

- [ ] A) Stateless
- [ ] B) Layered system
- [ ] C) Cacheable
- [ ] D) Virtualization

> [!success]- Gabarito e Explicação Oficial da SAP
> **Respostas Corretas: A, B, C**
> 
> De acordo com a dissertação original de Roy Fielding, os princípios arquiteturais fundamentais do **Representational State Transfer (REST)** são:
> 1. **Stateless (Sem Estado):** Cada requisição do cliente para o servidor deve conter todas as informações necessárias para ser compreendida e processada; nenhum contexto de sessão é retido no servidor entre requisições.
> 2. **Layered System (Sistema em Camadas):** O cliente não consegue identificar se está conectado diretamente ao servidor final ou a intermediários (como proxies, balanceadores de carga ou gateways de cache).
> 3. **Cacheable (Capacidade de Armazenamento em Cache):** As respostas devem ser explicitamente marcadas como armazenáveis em cache (*cacheable*) ou não (*non-cacheable*), melhorando a eficiência e a latência.
> 
> *Virtualization* é uma tecnologia de infraestrutura de computação em nuvem, não um princípio da arquitetura de software REST.

---

### Questão 4
Which of the following are essential aspects of ABAP Cloud?
*(Selecione 3 respostas corretas)*

- [ ] A) ABAP Cloud language
- [ ] B) ABAP RESTful application programming model
- [ ] C) ABAP development tools for Eclipse
- [ ] D) .NET & SOAP

> [!success]- Gabarito e Explicação Oficial da SAP
> **Respostas Corretas: A, B, C**
> 
> O modelo de desenvolvimento **ABAP Cloud** é sustentado por três pilares essenciais:
> 1. **ABAP Cloud Language:** Versão otimizada da linguagem ABAP (ABAP Language Version 5), que elimina declarações e instruções obsoletas que quebram o Clean Core.
> 2. **ABAP RESTful Application Programming Model (RAP):** O modelo de programação padrão para a construção de serviços OData e aplicações corporativas em nuvem.
> 3. **ABAP Development Tools (ADT) for Eclipse:** A única ferramenta oficial de desenvolvimento (IDE) suportada para criar e manter artefatos ABAP Cloud (o SAP GUI / SE80 não suporta desenvolvimento ABAP Cloud).
> 
> *.NET & SOAP* não são aspectos estruturais do modelo ABAP Cloud.

---

### Questão 5
Which of the following are principles of cloud native?
*(Selecione 3 respostas corretas)*

- [ ] A) REST and CRUD
- [ ] B) Infrastructure Independent
- [ ] C) Microservices
- [ ] D) Application Programming Interfaces (APIs)

> [!success]- Gabarito e Explicação Oficial da SAP
> **Respostas Corretas: B, C, D**
> 
> Os princípios fundamentais que definem uma arquitetura **Cloud Native** são:
> 1. **Infrastructure Independent (Independência de Infraestrutura):** O software opera sobre camadas abstratas sem acoplamento a servidores físicos específicos ou sistemas operacionais de baixo nível.
> 2. **Microservices (Microsserviços):** Arquiteturas modulares e componentes decompostos em serviços autônomos e facilmente escaláveis.
> 3. **Application Programming Interfaces (APIs):** Toda a integração e consumo entre sistemas e serviços é realizada por meio de contratos bem definidos e padronizados.
> 
> Embora REST e CRUD sejam padrões comuns de implementação de APIs web, eles representam protocolos/operações e não os princípios conceituais fundamentais do paradigma Cloud Native descritos na lição.

---

### Questão 6
The term "Local Platform APIs" is directly associated with which of the following?
*(Selecione 2 respostas corretas)*

- [ ] A) SAP HANA
- [ ] B) SAP S/4HANA Cloud, ABAP environment
- [ ] C) SAP HANA Cloud
- [ ] D) SAP BTP, ABAP environment

> [!success]- Gabarito e Explicação Oficial da SAP
> **Respostas Corretas: B, D**
> 
> O termo **Local Platform APIs** refere-se ao conjunto compartilhado e liberado de APIs da plataforma ABAP disponíveis tanto no **SAP S/4HANA Cloud, ABAP environment** quanto no **SAP BTP, ABAP environment**. 
> Ambos os ambientes compartilham a **mesma linha de código da plataforma (*ABAP Platform Cloud Codeline*)**, permitindo que o desenvolvedor utilize a mesma sintaxe e os mesmos contratos de bibliotecas técnicas locais em qualquer uma das plataformas.
> 
> *SAP HANA* e *SAP HANA Cloud* são sistemas gerenciadores de banco de dados subjacentes, não plataformas de execução de Local Platform APIs ABAP.
