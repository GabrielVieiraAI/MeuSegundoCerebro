---
tipo: clippings
title: "Describing ABAP Platform Reuse Services"
source: "https://learning.sap.com/courses/practicing-clean-core-extensibility-for-sap-s-4hana-cloud/describing-abap-platform-reuse-services_dfed68b3-33c9-4841-9804-ea7c27173828"
created: 2026-11-03
tags:
  - sap
  - abap
  - abap-cloud
  - reuse-services
  - btp
  - paas
  - clean-core
---
**Roteiro de Estudos Relacionado:** [[Roteiro de Estudos SAP]]

# Objetivos de Aprendizado

Após concluir esta lição, você será capaz de:
- Descrever os serviços técnicos de reutilização (*Technical Reuse Services*) oferecidos pela plataforma ABAP.
- Comparar os serviços integrados da plataforma ABAP com os serviços adicionais disponibilizados na **SAP BTP (Business Technology Platform)**.
- Entender como o modelo de computação em nuvem (**Platform as a Service - PaaS**) substitui chamadas clássicas de Basis por APIs liberadas e serviços nativos em nuvem.

---

## 1. O Conceito de Reuse Services no ABAP Cloud

Ao longo das últimas décadas, desenvolvedores ABAP habituaram-se a utilizar uma vasta gama de serviços técnicos disponibilizados na camada básica de sistema (**SAP Basis** e, posteriormente, **SAP NetWeaver**). Comandos clássicos, tabelas do dicionário e módulos de função legados (como `SO_DOCUMENT_SEND_API1` ou `NUMBER_GET_NEXT`) eram invocados diretamente para manipular tarefas cotidianas de infraestrutura de aplicação.

No desenvolvimento em nuvem e no modelo **ABAP Cloud**, a arquitetura de **Platform as a Service (PaaS)** reorganiza esses serviços essenciais. Em vez de chamadas diretas a tabelas internas ou funções obsoletas, a plataforma ABAP continua fornecendo esses mesmos recursos, mas agora empacotados como **APIs e frameworks públicos liberados (*Released APIs*)**, totalmente compatíveis com o princípio de **Clean Core** e estáveis para upgrades.

![[Reuse_Services_001.png]]

---

## 2. Serviços Técnicos de Reutilização da Plataforma ABAP

A plataforma ABAP (tanto no **SAP S/4HANA Cloud** quanto no **SAP BTP, ABAP Environment**) disponibiliza nativamente os seguintes serviços técnicos de reutilização para os desenvolvedores:

| Serviço Técnico de Reutilização | Descrição e Aplicação Prática | Exemplo no ABAP Cloud |
| :--- | :--- | :--- |
| **Email Service** | Envio de e-mails transacionais e notificações em HTML ou texto com anexos de forma assíncrona ou síncrona. | Classe liberada `CL_BCS_MAIL_MESSAGE` |
| **Number Ranges (Intervalos de Numeração)** | Geração atômica e sequencial de números de documentos de negócio (ex: pedidos, faturas, chamados). | Objeto de Numeração e APIs liberadas de Number Range |
| **Change Documents (Documentos de Modificação)** | Rastreamento e auditoria automática de alterações em campos de entidades de negócio (*quem alterou, o que alterou e quando*). | Framework de Change Documents integrado ao RAP |
| **Printing Queue (Fila de Impressão)** | Gerenciamento de saída de impressão (*Output Management*) com spool e renderização baseada em filas na nuvem. | Print Queue Service e APIs de Spool em Nuvem |
| **Application Jobs** | Execução agendada ou periódica de rotinas em segundo plano (*Background Jobs*), substituindo as transações clássicas `SM36`/`SM37`. | Framework `cl_apj_dt_create_content` / Application Jobs |
| **Application Logs** | Registro estruturado de logs técnicos e funcionais de execução, substituindo o legado `BAL*` / `SLG1`. | API BALI (Business Application Log Interface - `CL_BALI_LOG`) |
| **Translation (Tradução)** | Localização e tradução integrada de textos literais, rótulos de campos e documentação de objetos. | Text Pools e XCO Translation Tools |
| **Units of Measurement (Unidades de Medida)** | Conversão padronizada e cálculo entre diferentes unidades métricas e comerciais (ISO). | CDS Views e funções escalares liberadas |
| **Time Zones (Fusos Horários)** | Tratamento de carimbos de data/hora (*Timestamps* UTC) e conversões precisas para fusos horários locais. | Funções e métodos liberados de data/hora |
| **Exchange Rates & Currency Conversion** | Consulta a taxas de câmbio oficiais e conversão monetária automática entre moedas corporativas. | Funções de conversão em CDS (`CURRENCY_CONVERSION`) |
| **Knowledge Transfer Documents (KTD)** | Documentação rica em Markdown embutida diretamente nos artefatos no ADT, substituindo a documentação clássica via SE61. | Objeto KTD no Eclipse ADT |

---

## 3. Serviços Técnicos Adicionais no SAP BTP

Além dos serviços embutidos diretamente na plataforma ABAP (*On-Stack*), a plataforma de inovação e extensão da SAP — **SAP BTP (SAP Business Technology Platform)** — complementa a arquitetura corporativa com serviços avançados executados *Side-by-Side*:

1. **SAP BTP Forms by Adobe (Adobe Document Services - ADS):**
   - Serviço em nuvem de alta fidelidade para renderização, montagem e geração de formulários interativos e estáticos em PDF a partir de templates XML/XDP.
2. **SAP BTP Document Management Service (DMS):**
   - Serviço corporativo de gerenciamento de documentos e anexos baseado no padrão internacional CMIS (*Content Management Interoperability Services*), permitindo conectar repositórios como AWS S3, Azure Blob ou Google Cloud Storage sem sobrecarregar o banco SAP HANA.
3. **SAP Workflow Management (SAP Build Process Automation):**
   - Orquestração de fluxos de aprovação, esteiras de validação multi-etapas e processos de negócio com baixa codificação (*Low-Code*), orquestrando decisões humanas e integrações entre múltiplos sistemas.
4. **SAP BTP Rules (Decisões de Negócio / Business Rules):**
   - Motor de regras de negócio independente que permite aos analistas e usuários-chave alterar políticas corporativas (ex: tabelas de descontos, alçadas de aprovação) sem necessidade de alterar o código-fonte ABAP.

---

## 4. Arquitetura de Reutilização: Comparativo de Modelos

```
                  ┌─────────────────────────────────────────────────────────┐
                  │                   Clean Core Application                │
                  │              (ABAP RESTful Application Model)           │
                  └────────────────────────────┬────────────────────────────┘
                                               │
               ┌───────────────────────────────┴───────────────────────────────┐
               ▼                                                               ▼
┌──────────────────────────────────────────────┐ ┌──────────────────────────────────────────────┐
│        ABAP Platform Reuse Services          │ │         SAP BTP Cloud Reuse Services         │
│             (On-Stack / Local)               │ │             (Side-by-Side / Remote)          │
├──────────────────────────────────────────────┤ ├──────────────────────────────────────────────┤
│ • Email Service (CL_BCS_MAIL_MESSAGE)        │ │ • SAP BTP Forms by Adobe (ADS)               │
│ • Number Ranges & Change Documents           │ │ • SAP BTP Document Management Service (DMS)  │
│ • Application Jobs & Application Logs (BALI) │ │ • SAP Build Process Automation (Workflow)    │
│ • Print Queue & Cloud Spooling               │ │ • SAP BTP Business Rules Engine              │
│ • Currency Conversion & Units of Measure     │ │ • SAP Event Mesh (Event-Driven Broker)       │
└──────────────────────────────────────────────┘ └──────────────────────────────────────────────┘
```

> [!NOTE] Referência Visual do Cofre
> ![[Mapa Mental - Modulo 03 - ABAP Platform Reuse Services.excalidraw]]

---

## Resumo da Lição

- No desenvolvimento **Cloud Native** em **ABAP Cloud**, a SAP mantém a riqueza funcional dos serviços técnicos herdados do SAP NetWeaver, porém abstraídos sob a camada **PaaS** por meio de **APIs liberadas**.
- Serviços como envio de e-mails (`CL_BCS_MAIL_MESSAGE`), logs de aplicação (`CL_BALI_LOG`), intervalos de numeração e agendamento de jobs são nativos da plataforma ABAP local.
- Serviços com alta demanda de armazenamento ou orquestração complexa multi-sistemas (como **Forms by Adobe**, **Document Management Service** e **Process Automation**) são fornecidos pela **SAP BTP** para consumo *Side-by-Side*.
