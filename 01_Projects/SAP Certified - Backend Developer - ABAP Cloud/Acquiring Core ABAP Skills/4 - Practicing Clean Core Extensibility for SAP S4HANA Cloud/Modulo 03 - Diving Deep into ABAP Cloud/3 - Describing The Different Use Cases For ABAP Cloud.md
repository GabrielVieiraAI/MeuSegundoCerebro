---
tipo: clippings
title: "Describing The Different Use Cases For ABAP Cloud"
source: "https://learning.sap.com/courses/practicing-clean-core-extensibility-for-sap-s-4hana-cloud/describing-the-different-aspects-of-the-abap-cloud-development-model_f1e03a57-f23a-493a-b36c-4838221678ad"
created: 2026-11-03
tags:
  - sap
  - abap
  - abap-cloud
  - rap
  - eml
  - analytics
  - integration
  - clean-core
---
**Roteiro de Estudos Relacionado:** [[Roteiro de Estudos SAP]]

# Objetivos de Aprendizado

Após concluir esta lição, você será capaz de:
- Descrever os três grandes cenários de uso do **ABAP Cloud**: **Transacional (OLTP)**, **Analítico (OLAP)** e **Integração**.
- Explicar as quatro camadas arquiteturais do **ABAP RESTful Application Programming Model (RAP)** e o papel da linguagem **EML (Entity Manipulation Language)**.
- Compreender a modelagem analítica multidimensional em CDS e sua exposição via protocolo **InA**.
- Identificar as opções de conectividade modernas da Empresa Inteligente e a governança via **Cloud Communication Management**.
- Diferenciar com clareza conceitual o **ABAP Cloud** do framework **RAP**.

---

## 1. Cenários Transacionais (OLTP): O Framework RAP

No desenvolvimento corporativo moderno, tecnologias procedurais clássicas como Dynpros do SAP GUI ou Web Dynpro são incompatíveis com nuvem. O padrão da indústria consolidou o protocolo **OData (Open Data Protocol)** — frequentemente chamado de *"ODBC para a Web"* — como a forma mais eficiente de trafegar dados de negócio sobre a web.

Para atender a essa demanda sobre o banco em memória SAP HANA, a SAP desenvolveu o **ABAP RESTful Application Programming Model (RAP)**:

![[RESTful_App_Prog_Model_001.png]]

> [!NOTE] Do Modelo Precursor ao RAP
> A primeira geração de serviços OData utilizava o *ABAP Programming Model for SAP Fiori* (com a transação `SEGW` e DPC/MPC). Esse modelo precursor apresentava limitações (ferramental disperso em várias transações no SAP GUI e menor suporte a migrações).  
> O **RAP é o sucessor oficial e definitivo**, consolidando todo o desenvolvimento no Eclipse ADT com um conjunto elegante e intuitivo de artefatos.

### As Quatro Camadas Arquiteturais do RAP

O RAP foi projetado desde a raiz alinhado à filosofia de microsserviços, estruturando-se em quatro camadas bem delimitadas:

```
┌─────────────────────────────────────────────────────────────┐
│ 4. Business Service Consumption (Fiori Apps, Web APIs, Eventos)│
└──────────────────────────────▲──────────────────────────────┘
                               │
┌──────────────────────────────┴──────────────────────────────┐
│ 3. Business Service Exposure (Service Definition & Binding) │
└──────────────────────────────▲──────────────────────────────┘
                               │
┌──────────────────────────────┴──────────────────────────────┐
│ 2. Domain Model & Implementation (CDS Entities, BDEF, EML)  │
└──────────────────────────────▲──────────────────────────────┘
                               │
┌──────────────────────────────┴──────────────────────────────┐
│ 1. Data Access (Tabelas de Banco de Dados no SAP HANA)      │
└─────────────────────────────────────────────────────────────┘
```

1. **Acesso a Dados (*Data Access*):** Camada de persistência física em tabelas de banco de dados do SAP HANA, usufruindo de processamento colunar, velocidade em memória e paralelismo massivo.
2. **Modelo de Domínio e Implementação (*Domain Model and Implementation*):**
   - **Business Object (BO):** Representação estruturada da entidade de negócio no mundo real (ex: Ordem de Venda, Cliente), estruturada em nós com relacionamento pai-filho (*parent-child*) iniciando sempre em um **nó raiz (*Root Node*)**.
   - **ABAP Core Data Services (CDS):** Define o modelo semântico de dados através de *CDS View Entities* e linguagens dedicadas (DDL, DCL para autorizações, SDL e anotações).
   - **CDS Behavior Definition (BDEF):** Define os comportamentos transacionais do BO (operações CRUD standard, ações de negócio customizadas, validações, determinações e controle de rascunho/*draft*).
   - **Entity Manipulation Language (EML):** Extensão nativa da linguagem ABAP (`MODIFY ENTITIES`, `READ ENTITIES`) que permite controlar programaticamente o ciclo transacional dos Business Objects com segurança e consistência.
3. **Exposição de Serviços de Negócio (*Business Service Exposure*):**
   - **Service Definition:** Declara quais entidades do modelo de dados e comportamentos transacionais farão parte do serviço.
   - **Service Binding:** Associa a definição a um protocolo de comunicação específico (ex: OData V2 para Fiori clássico, OData V4 para aplicações modernas ou Web API para consumo puro entre sistemas).
4. **Consumo de Serviços de Negócio (*Business Service Consumption*):**
   - Aplicações web modernas em SAP Fiori.
   - Integrações sistema a sistema (*App-to-App* / *System-to-System*), onde metadados visuais de UI são ignorados.
   - Arquitetura orientada a eventos através do **SAP Event Mesh** no SAP BTP, permitindo que um Business Object do RAP atue como produtor ou consumidor de eventos assíncronos.

---

## 2. Cenários Analíticos (OLAP): ABAP Analytics

O ABAP Cloud não se restringe a operações transacionais; ele oferece capacidade analítica embarcada para avaliação multidimensional de dados em tempo real:

![[RESTful_App_Prog_Model_002.png]]

- **Modelagem Multidimensional em CDS:** Desenvolvedores criam esquemas estrela (*Star Schema*) ou floco de neve (*Snowflake Schema*) baseados em **Cubos (*Cubes*)**, **Dimensões (*Dimensions*)** e **Hierarquias**.
- **Provedores Analíticos em CDS:** A lógica de cálculo analítico executa diretamente no banco SAP HANA via *Code Pushdown*.
- **Exposição Analítica:**
  - Via protocolo **SAP Information Access (InA)** para ferramentas dedicadas de Business Intelligence, como **SAP Analytics Cloud (SAC)** e **SAP Analysis for Microsoft Office**.
  - Via protocolo **OData** para exibição em cartões analíticos de aplicativos SAP Fiori (*Overview Pages* e *Analytical List Pages*).

---

## 3. Cenários de Integração: A Empresa Inteligente e Sustentável

A visão da SAP para a **Empresa Inteligente e Sustentável (*Intelligent, Sustainable Enterprise*)** integra processos de ponta a ponta através das soluções em nuvem:

![[RESTful_App_Prog_Model_003.png]]

### Os 4 Macroprocessos Ponta a Ponta da SAP:
1. **Lead to Cash** (Do prospecto ao recebimento financeiro)
2. **Design to Operate** (Do projeto do produto à operação fabril)
3. **Source to Pay** (Do suprimento ao pagamento do fornecedor)
4. **Recruit to Retire** (Da contratação à aposentadoria do colaborador)

### Tecnologias de Conectividade Permitidas no ABAP Cloud
Para garantir o Clean Core, protocolos obsoletos e inseguros (como **IDoc** ou acessos RFC clássicos desregulados) **não podem ser utilizados no ABAP Cloud**. Em seu lugar, utilizam-se apenas frameworks oficiais liberados:

- **Serviços OData** (V2 e V4)
- **Business Events** (Mensageria orientada a eventos com SAP Event Mesh)
- **Serviços HTTP** gerenciados
- **WebSocket RFC** habilitado para nuvem
- **Consumo de serviços SOAP** padronizados
- **SQL Service** para leitura analítica externa via clientes ODBC
- **SAP InA** para clientes analíticos
- **SAP Cloud Connector** para conectar de forma segura a sistemas on-premise internos

> [!IMPORTANT] Governança com Cloud Communication Management
> No SAP S/4HANA Cloud, desenvolvedores não utilizam transações clássicas de configuração de conexões como `SM59` (destinos RFC) ou `SOAMANAGER`.  
> Toda a conectividade é configurada via aplicativos SAP Fiori de **Cloud Communication Management**:
> - **Communication Systems:** Representa o sistema parceiro remoto e suas configurações de rede.
> - **Communication Users:** Usuários técnicos autenticados para a comunicação.
> - **Communication Arrangements:** Associa o cenário de comunicação com o sistema e credenciais aprovadas.

---

## 4. Diferenciação Conceitual: ABAP Cloud versus RAP

É comum que desenvolvedores iniciantes confundam os termos. A distinção de escopo é nítida:

| Dimensão | ABAP Cloud | RAP (ABAP RESTful Application Programming Model) |
| :--- | :--- | :--- |
| **Escopo** | **Modelo de Desenvolvimento Abrangente** | **Framework de Programação Transacional Específico** |
| **O que Engloba?** | Toda a governança da linguagem (`ABAP for Cloud Development`), ferramentas (ADT), APIs liberadas, regras Clean Core, IAM, conectividade e arquitetura. | Conjunto específico de artefatos (CDS View Entities, BDEF, classes de comportamento, EML e Service Bindings) para construir Business Objects. |
| **Relação** | O ABAP Cloud **contém** o RAP como seu modelo primário para construção de aplicações transacionais. | O RAP é um **componente** de desenvolvimento executado dentro do ecossistema ABAP Cloud. |

---

## 5. Simulação Prática Oficial SAP (Enable Now)

Explore na prática a construção de artefatos RESTful com o RAP:

> [!TIP] Exercício Prático Interativo
> **Título:** *Explore ABAP RESTful Application Programming Model Objects*  
> **Link Oficial:** [Iniciar Simulação no SAP Enable Now](https://learnsap.enable-now.cloud.sap/pub/mmcp/index.html?show=project!PR_9B0C1017F903CE90:uebung)  
> **Objetivo:** Navegar pela estrutura de um Business Object construído no Eclipse ADT utilizando as quatro camadas arquiteturais do framework RAP.
