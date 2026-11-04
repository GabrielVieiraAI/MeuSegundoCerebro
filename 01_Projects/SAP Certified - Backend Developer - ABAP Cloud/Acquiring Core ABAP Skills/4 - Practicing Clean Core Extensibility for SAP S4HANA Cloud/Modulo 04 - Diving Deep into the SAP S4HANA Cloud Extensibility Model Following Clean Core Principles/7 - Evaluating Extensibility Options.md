---
tipo: clippings
title: "Evaluating Extensibility Options"
source: "https://learning.sap.com/courses/practicing-clean-core-extensibility-for-sap-s-4hana-cloud/evaluating-extensibility-options_d4ed3486-230a-464d-9c0e-7b544ed30440"
created: 2026-11-03
tags:
  - sap
  - abap
  - extensibility-options
  - clean-core
  - key-user
  - developer-extensibility
  - side-by-side
  - decision-tree
---
**Roteiro de Estudos Relacionado:** [[Roteiro de Estudos SAP]]

# Objetivos de Aprendizado

Após concluir esta lição, você será capaz de:
- Avaliar os critérios técnicos e de negócio para selecionar a abordagem ideal de extensibilidade (**Key User**, **Developer** ou **Side-by-Side**).
- Analisar os fatores de arquitetura: grau de acoplamento (*Tightly Coupled* vs. *Loosely Coupled*), proximidade de dados (*Data Proximity*) e exigências transacionais (SAP LUW).
- Compreender que as opções de extensibilidade não são mutuamente exclusivas e frequentemente operam de forma combinada em cenários do mundo real.

---

## 1. Guia de Decisão Arquitetural para Extensibilidade

Diante de um novo requisito de negócio, como arquitetos e desenvolvedores decidem qual padrão de extensão adotar? A SAP define três dimensões avaliativas essenciais:

![[ABAP_Public_Cloud_APIs_002.png]]

---

## 2. As Três Dimensões de Avaliação

### 1. Caso de Uso da Extensão (Extension Use Case)
- **Adaptação de Aplicativo Padrão Existente:** Se a necessidade consiste em alterar rótulos de tela, incluir campos adicionais de cabeçalho ou configurar uma validação simples de formulário, a escolha natural é a **Key User Extensibility**.
- **Nova Aplicação Corporativa no Core:** Se o requisito demanda uma nova transação com processamento intensivo no ERP e lógica transacional completa, adota-se a **Developer Extensibility (On-Stack)** com RAP.
- **Aplicação Externa ou Portal Autônomo:** Se o requisito envolve uma nova solução para usuários sem acesso ao ERP ou automação de esteiras multi-sistemas, utiliza-se a **Side-by-Side Extensibility (SAP BTP)**.

### 2. Arquitetura e Grau de Acoplamento (Extension Architecture)
- **Acoplamento Rígido (*Tightly Coupled*) e Mesma Transação (LUW):**
  - A extensão precisa ser confirmada ou desfeita em conjunto com a gravação padrão do SAP S/4HANA?
  - A extensão exige leitura em tempo real de milhões de registros com baixíssima latência (*Data Proximity*)?
  - **Recomendação:** **Developer Extensibility (On-Stack)**.
- **Acoplamento Frouxo (*Loosely Coupled*) e Desacoplado:**
  - A aplicação consome dados de múltiplos produtos (ex: S/4HANA + Salesforce + SuccessFactors)?
  - A aplicação opera de maneira orientada a eventos assíncronos?
  - A aplicação atende milhares de consumidores externos sem conta de usuário no SAP?
  - **Recomendação:** **Side-by-Side Extensibility (SAP BTP)**.

### 3. Escopo, Tamanho e Persona Responsável (Extension Scope and Size)
- **Usuário-Chave / Citizen Developer:** Pequenas customizações departamentais, relatórios analíticos visuais e ajustes rápidos de tela.
- **Equipe de TI Interna / Desenvolvedor ABAP:** Customizações profundas de regras de negócio, integrações transacionais e fluxos críticos da empresa.
- **Parceiro de Software (ISV):** Soluções verticais SaaS multilocatárias distribuídas globalmente para múltiplos clientes via SAP Store.

---

## 3. Matriz Comparativa de Decisão

| Critério de Avaliação | Key User Extensibility | Developer Extensibility | Side-by-Side Extensibility |
| :--- | :--- | :--- | :--- |
| **Persona Principal** | Usuário-Chave / Consultor Funcional | Desenvolvedor ABAP Profissional | Desenvolvedor Full-Stack / ABAP Cloud |
| **Ferramenta Principal** | SAP Fiori Apps (Browser) | Eclipse ADT | SAP Business Application Studio / ADT / VS Code |
| **Ambiente de Runtime** | SAP S/4HANA Cloud (On-Stack) | SAP S/4HANA Cloud (On-Stack) | SAP BTP (Cloud Foundry, Kyma, ABAP) |
| **Grau de Acoplamento** | Rígido (In-App) | Rígido (Local) | Desacoplado (Loosely Coupled) |
| **Unidade Transacional** | Integrada à tela padrão | Mesma SAP LUW padrão | Transação remota / Assíncrona |
| **Acesso a Dados** | CDS Views liberadas (via Apps) | SQL local sobre CDS Views liberadas | Chamadas OData / SOAP / Eventos |
| **Melhor Caso de Uso** | Campos customizados, UIs e KPIs simples | Processamento SQL massivo, BAdIs complexos | Portais B2C, IA/ML, apps multi-sistemas, SaaS |

---

## 4. Abordagem Híbrida: Extensões Combinadas no Mundo Real

> [!IMPORTANT] As Três Opções Não São Mutuamente Exclusivas
> Projetos modernos de transformação digital raramente utilizam apenas um tipo de extensão isolado. Em cenários reais de ponta a ponta, os três modelos trabalham em sinergia:
> 
> 1. Um usuário-chave cria um campo customizado "Código de Rastreamento de Carga" no SAP Fiori (**Key User Extensibility**).
> 2. Um desenvolvedor ABAP utiliza o Eclipse ADT para criar um Business Object RAP que calcula a rota ideal e expõe uma API OData liberada (**Developer Extensibility**).
> 3. Uma aplicação mobile no SAP BTP consome essa API OData, integrando-se a um leitor de código de barras e a um serviço de inteligência artificial de reconhecimento ótico na nuvem (**Side-by-Side Extensibility**).

---

## Resumo da Lição

- A escolha da estratégia de extensibilidade depende do **caso de uso**, da **arquitetura de acoplamento** e do **escopo/persona**.
- Use **Key User** para modificações rápidas de baixo código na camada de apresentação e dados simples.
- Use **Developer Extensibility (On-Stack)** quando for imperativo compartilhar a **SAP LUW**, proximidade máxima com o banco HANA e lógica transacional densa.
- Use **Side-by-Side (SAP BTP)** para desacoplamento de ciclo de vida, integrações multi-sistemas, portais externos e serviços avançados de nuvem.
- Os modelos operam de maneira complementar para garantir 100% de flexibilidade sob os pilares do **Clean Core**.
