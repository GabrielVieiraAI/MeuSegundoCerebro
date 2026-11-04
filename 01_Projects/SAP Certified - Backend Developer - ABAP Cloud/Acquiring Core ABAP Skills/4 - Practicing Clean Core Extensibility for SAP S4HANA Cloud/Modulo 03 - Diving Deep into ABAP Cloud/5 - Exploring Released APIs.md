---
tipo: clippings
title: "Exploring Released APIs"
source: "https://learning.sap.com/courses/practicing-clean-core-extensibility-for-sap-s-4hana-cloud/exploring-released-apis_d80ce197-097e-4e7b-8696-b960738089c7"
created: 2026-11-03
tags:
  - sap
  - abap
  - abap-cloud
  - released-apis
  - badi
  - event-mesh
  - business-accelerator-hub
  - adt
  - clean-core
---
**Roteiro de Estudos Relacionado:** [[Roteiro de Estudos SAP]]

# Objetivos de Aprendizado

Após concluir esta lição, você será capaz de:
- Identificar e classificar os diferentes tipos de interfaces e APIs públicas liberadas (**Released APIs**) pela SAP.
- Compreender a sincronização entre as APIs locais da plataforma ABAP no **SAP S/4HANA Cloud** e no **SAP BTP, ABAP Environment**.
- Diferenciar os cenários de consumo remoto (**Remote APIs** e **Events**) dos cenários de consumo local (**Local APIs** e **Local Extension Points / BAdIs**).
- Utilizar o **SAP Business Accelerator Hub** e a árvore de **Released Objects** no ABAP Development Tools (ADT) para localizar contratos estáveis para upgrades.

---

## 1. O Papel das Interfaces Estáveis no Clean Core

Como introduzido no Módulo 1, o pilar fundamental da estratégia **Clean Core** é o isolamento estrito entre o código customizado do cliente e os artefatos internos padrão da SAP. Para viabilizar upgrades automáticos e sem interrupções de versão (*Release Updates*), a SAP e os clientes atuam sob um contrato mútuo:

1. **Compromisso da SAP:**
   - A SAP disponibiliza publicamente interfaces e objetos com o status formal de **Released** (Liberados para uso em desenvolvimento).
   - A SAP garante contratualmente a **estabilidade de compatibilidade (*Stability Contract*)** dessas interfaces de release para release. Uma interface liberada para ABAP Cloud não sofre alterações que quebrem os consumidores existentes (*no breaking changes*).
2. **Compromisso do Cliente:**
   - O cliente e seus desenvolvedores concordam em consumir **exclusivamente** interfaces públicas liberadas em novos desenvolvimentos e em extensões.
   - Esse acordo não depende apenas de boas práticas manuais: ele é **ativamente bloqueado e forçado** pelo compilador ABAP e pelo **ABAP Test Cockpit (ATC)** dentro do Eclipse ADT sob o modelo **ABAP Cloud**.

---

## 2. APIs Locais da Plataforma ABAP (Local Platform APIs)

A primeira grande fonte de contratos liberados são as **APIs Locais da Plataforma ABAP (*Local ABAP Platform APIs*)**.

![[APIs_Ext_Points_and_Events_001.png]]

- Tanto o **SAP S/4HANA Cloud, ABAP Environment** quanto o **SAP BTP, ABAP Environment** utilizam a **mesma linha de código da plataforma (*ABAP Platform Cloud Codeline*)**.
- Isso significa que qualquer objeto técnico nativo liberado pela plataforma (como elementos de dados, classes de utilidades, estruturas ou objetos de autorização) possui comportamento idêntico em ambos os ambientes.
- Para o desenvolvedor, isso oferece flexibilidade total: uma biblioteca ou regra de validação construída sobre essas APIs locais pode ser executada tanto diretamente no núcleo (*On-Stack*) quanto em uma extensão desacoplada na nuvem (*Side-by-Side* no BTP).
- Reconhecendo que muitos objetos clássicos do SAP NetWeaver não eram adequados para a arquitetura nativa em nuvem, a SAP os substituiu sistematicamente por equivalentes modernos e orientados a cloud.

---

## 3. Tipos de APIs de Negócio do SAP S/4HANA Cloud

As interfaces de negócio liberadas dividem-se em categorias conforme o seu propósito arquitetural:

![[APIs_Ext_Points_and_Events_002.png]]

### A. Consumo Remoto (Remote APIs)
Interfaces projetadas para serem consumidas por fontes externas ao SAP S/4HANA Cloud (como aplicações customizadas rodando no SAP BTP, sistemas legados ou portais de terceiros):
- **Protocolos e Tecnologias:** Serviços **OData** (v2 ou v4) criados pelo **ABAP RESTful Application Programming Model (RAP)** e serviços **SOAP**.
- **Comunicação Síncrona (Direta):** Aplicações frontend (SAP Fiori, SAP Build Apps) chamam diretamente os endpoints OData via HTTP(S).
- **Comunicação Assíncrona (Indireta via Middleware):** Cenários de integração onde a comunicação não pode depender de resposta imediata em tempo real. O **SAP Cloud Integration** (reurso do **SAP Integration Suite** no SAP BTP) atua como intermediário, fornecendo adaptadores OData e SOAP nativos para transformar, orquestrar e garantir a entrega de mensagens.

### B. Eventos Corporativos (Business Events & SAP Event Mesh)
A arquitetura orientada a eventos (*Event-Driven Architecture*) permite que sistemas se comuniquem por meio de disparos assíncronos:
- Um **Event Provider** (provedor do evento) notifica que algo ocorreu no negócio (por exemplo: `SalesOrder.Created` ou `PurchaseOrder.Approved`).
- Um **Event Consumer** (consumidor do evento) reage ao evento de forma totalmente desacoplada.
- O **SAP Event Mesh** (serviço de mensageria gerenciado no SAP BTP) atua como o mediador (*Broker*) de mensagens.
- Os Business Objects no **RAP** suportam eventos nativamente: um objeto de negócio RAP pode disparar eventos ou assinar eventos de negócio diretamente.

### C. Consumo Local (Local APIs)
Interfaces consumidas internamente no próprio stack do SAP S/4HANA Cloud (por exemplo, dentro de um Business Object RAP customizado ou na implementação de um BAdI):
- Desenvolvedores utilizam **CDS Views liberadas**, classes de biblioteca e interfaces fornecidas pela SAP.
- **Exemplo Prático de Substituição:**
  - *Modelo Legado (Não permitido):* Um desenvolvedor executava um comando SQL direto na tabela física de países: `SELECT * FROM T005 INTO TABLE @lt_countries`.
  - *Modelo ABAP Cloud (Clean Core):* A tabela física `T005` **não é liberada**. Em seu lugar, a SAP disponibiliza a Core Data Services View liberada **`I_Country`** (CDS View básica / Interface View).

### D. Pontos de Extensão Locais (Local Extension Points)
Mecanismos oficiais para estender o comportamento do software padrão sem modificar seu código-fonte:
- **Business Add-Ins (BAdIs):** Introduzidos originalmente no SAP R/3 4.6C, os BAdIs continuam sendo o principal mecanismo de pontos de extensão no SAP S/4HANA Cloud, operando sob contratos de estabilidade rigorosos.
- **RAP Extensibility:** O modelo RAP foi desenhado desde sua concepção com capacidades de extensibilidade embutidas, permitindo estender nós de entidades, comportamentos (*actions*, *validations*) e contratos de serviço.

---

## 4. Descoberta e Verificação de APIs Liberadas

Como o desenvolvedor descobre quais APIs e objetos estão liberados para uso?

![[APIs_Ext_Points_and_Events_003.png]]

Existem duas ferramentas complementares principais:

### 1. SAP Business Accelerator Hub (api.sap.com)
- Portal web corporativo público da SAP voltado para arquitetos e desenvolvedores.
- Permite pesquisar, inspecionar esquemas, testar chamadas em sandbox e conferir documentação de:
  - APIs remotas (OData, REST, SOAP).
  - Eventos de negócio do SAP Event Mesh.
  - CDS Views liberadas.
  - Interfaces de Business Objects do RAP.
  - BAdIs disponíveis para extensão.

### 2. Visão de Objetos Liberados (Released Objects Tree) no Eclipse ADT
- Integrada diretamente ao **ABAP Development Tools (ADT)** no Eclipse.
- Apresenta uma árvore hierárquica completa categorizando cada artefato técnico com base no seu contrato de liberação (**Release State**):
  - Elementos de Dados (*Data Elements*) e Domínios.
  - Objetos de Autorização (*Authorization Objects*).
  - CDS Entities e Views de Sistema.
  - Classes ABAP e Interfaces da Plataforma.
- **Aviso e Bloqueio em Tempo Real:** O compilador ABAP detecta imediatamente a tentativa de utilização de artefatos não liberados. Se um substituto oficial existir, o Eclipse ADT gera um erro de sintaxe explícito com a recomendação direta:
  ```text
  The use of table T005 is not permitted. Use CDS Entity I_COUNTRY instead.
  ```

---

## 5. Exercícios Práticos em Simulações Oficiais

> [!TIP] Simulação Interativa 1: Utilizar o SAP Business Accelerator Hub
> Explore as APIs públicas da SAP no portal oficial:
> [Acessar Exercício no SAP Enable Now](https://learnsap.enable-now.cloud.sap/pub/mmcp/index.html?show=project!PR_B9A11D1014CB1FA0:uebung)

> [!TIP] Simulação Interativa 2: Utilizar a Visão de Released APIs no Eclipse ADT
> Explore a árvore de objetos liberados e pratique o desenvolvimento ABAP Cloud com contratos de API estáveis:
> [Acessar Exercício no SAP Enable Now](https://learnsap.enable-now.cloud.sap/pub/mmcp/index.html?show=project!PR_156649D76ABBCFB2:uebung)

---

## Resumo da Lição

- As **APIs Liberadas (*Released APIs*)** constituem a garantia formal do **Clean Core**, assegurando que os upgrades do SAP S/4HANA Cloud ocorram sem quebras no código customizado.
- As APIs dividem-se em:
  - **Local Platform APIs:** sincronizadas entre SAP S/4HANA Cloud e SAP BTP, ABAP Environment.
  - **Remote APIs:** OData e SOAP para integrações externas diretas ou assíncronas via SAP Cloud Integration.
  - **Business Events:** comunicação assíncrona orientada a eventos através do SAP Event Mesh.
  - **Local APIs & Extension Points:** CDS Views liberadas (ex: `I_Country` substituindo `T005`) e BAdIs integrados ao RAP.
- O catálogo de APIs pode ser explorado publicamente via **SAP Business Accelerator Hub** e inspecionado tecnicamente dentro do Eclipse ADT pela árvore **Released Objects Tree**.
