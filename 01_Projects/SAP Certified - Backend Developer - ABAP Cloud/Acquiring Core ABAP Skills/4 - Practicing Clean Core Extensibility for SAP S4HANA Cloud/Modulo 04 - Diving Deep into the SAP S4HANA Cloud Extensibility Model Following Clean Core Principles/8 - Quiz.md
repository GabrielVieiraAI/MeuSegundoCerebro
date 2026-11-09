---
tipo: clippings
title: "Quiz - Diving Deep into the SAP S/4HANA Cloud Extensibility Model Following Clean Core Principles"
source: "https://learning.sap.com/courses/practicing-clean-core-extensibility-for-sap-s-4hana-cloud/diving-deep-into-the-sap-s-4hana-cloud-extensibility-model-following-clean-core-principles_39d083e8-c84f-3273-b1a2-f0c460f7c4af"
created: 2026-11-03
tags:
  - sap
  - abap
  - abap-cloud
  - extensibility-model
  - clean-core
  - quiz
  - certifiacao
---
**Roteiro de Estudos Relacionado:** [[Roteiro de Estudos SAP]]

# Avaliação do Módulo 04: Extensibility Model & Clean Core Principles

Teste seus conhecimentos sobre as regras do **SAP S/4HANA Cloud Extensibility Model**, os três pilares de extensão (**Key User**, **Developer** e **Side-by-Side**), as camadas de extensão do **RAP**, arquitetura de **BAdIs** e a governança de **Clean Core**.

---

### Questão 1
Which of the following are use cases for side-by-side extensions?
*(Selecione 2 respostas corretas)*

- [ ] A) Adding additional business logic to an SAP S/4HANA Cloud Business Object
- [ ] B) Creating custom fields in an SAP S/4HANA Cloud table
- [ ] C) A custom solution needing to be developed by a partner
- [ ] D) Creating custom applications integrating data from SAP S/4HANA Cloud and SAP Ariba

> [!success]- Gabarito e Explicação Oficial da SAP
> **Respostas Corretas: C, D**
> 
> A **Side-by-Side Extensibility** executada no **SAP BTP** é indicada para:
> - Soluções corporativas ou SaaS desenvolvidas por parceiros comerciais (ISVs) que precisam atender múltiplos clientes de forma desacoplada (*Multitenancy*).
> - Aplicações customizadas que integram dados de múltiplos produtos e soluções de nuvem heterogêneas (como SAP S/4HANA Cloud, SAP Ariba, Salesforce, etc.).
> 
> *Adicionar lógica a um Business Object existente* (A) e *criar campos customizados em tabelas do S/4HANA* (B) são extensões locais (**On-Stack**), atendidas respectivamente por Developer Extensibility e Key User Extensibility.

---

### Questão 2
Which of the following are key user extensibility tools?
*(Selecione 3 respostas corretas)*

- [ ] A) Custom Fields
- [ ] B) Custom Business Objects
- [ ] C) Custom Database Tables
- [ ] D) Custom CDS Views

> [!success]- Gabarito e Explicação Oficial da SAP
> **Respostas Corretas: A, B, D**
> 
> As ferramentas web oficiais de **Key User Extensibility** disponibilizadas no SAP Fiori incluem:
> - **Custom Fields:** Adição e propagação transparente de novos campos em tabelas, CDS Views e UIs.
> - **Custom Business Objects (CBO):** Criação de entidades de negócio completas com tabelas subjacentes gerenciadas pelo sistema e APIs CRUD.
> - **Custom CDS Views:** Modelagem gráfica de novas visões de dados sobre CDS Views liberadas pela SAP.
> 
> *Custom Database Tables* refere-se à transação clássica de desenvolvedor `SE11` (Dicionário ABAP tradicional), que não é uma ferramenta de usuário-chave e não está disponível no SAP Fiori.

---

### Questão 3
Which of the following are factors to consider in deciding what extensibility option to use?
*(Selecione 3 respostas corretas)*

- [ ] A) Extension use case
- [ ] B) Extension architecture
- [ ] C) Extension scope and size
- [ ] D) Extension uniqueness

> [!success]- Gabarito e Explicação Oficial da SAP
> **Respostas Corretas: A, B, C**
> 
> Ao planejar a arquitetura de uma extensão, a SAP define três fatores essenciais de decisão:
> 1. **Extension Use Case (Caso de uso):** Trata-se de uma adaptação de tela/regra em um app SAP existente ou da criação de uma nova solução autônoma?
> 2. **Extension Architecture (Arquitetura):** A extensão exige acoplamento rígido (mesma LUW e proximidade máxima dos dados no ERP) ou opera de forma frouxamente acoplada integrando múltiplos sistemas?
> 3. **Extension Scope and Size (Escopo e tamanho):** Quem desenvolve e qual a abrangência da solução (Key User departamental, desenvolvedor interno da TI ou parceiro SaaS global)?
> 
> *Extension uniqueness* não é um critério formal da matriz de decisão de extensibilidade da SAP.

---

### Questão 4
Which of the following are essential rules of the SAP S/4HANA Cloud extensibility model?
*(Selecione 3 respostas corretas)*

- [ ] A) No modifications of SAP objects
- [ ] B) Customer upgrade projects are to be done once per year
- [ ] C) Clear separation of extensions and SAP code
- [ ] D) Usage of released objects only

> [!success]- Gabarito e Explicação Oficial da SAP
> **Respostas Corretas: A, C, D**
> 
> O modelo de extensibilidade do SAP S/4HANA Cloud é fundamentado em três regras inegociáveis para manter o núcleo limpo (**Clean Core**):
> 1. **No modifications of SAP objects:** Proibição absoluta de modificações diretas no código padrão da SAP.
> 2. **Clear separation of extensions and SAP code:** Separação física e lógica estrita entre o código do cliente e o software padrão da SAP.
> 3. **Usage of released objects only:** Consumo restrito e auditado exclusivamente de interfaces públicas liberadas (*Released APIs/BAdIs*).
> 
> No SAP S/4HANA Cloud, *não existem projetos anuais manuais de upgrade conduzidos pelo cliente*; as atualizações de versão são automatizadas e aplicadas simultaneamente pela SAP.

---

### Questão 5
Which of the following are "public released interfaces" under the SAP S/4HANA Cloud extensibility model?
*(Selecione 3 respostas corretas)*

- [ ] A) Remote APIs
- [ ] B) Classical user exits
- [ ] C) Local APIs
- [ ] D) Extension Points

> [!success]- Gabarito e Explicação Oficial da SAP
> **Respostas Corretas: A, C, D**
> 
> Sob o modelo oficial de extensibilidade do SAP S/4HANA Cloud, as interfaces públicas liberadas (**Public Released Interfaces**) abrangem:
> - **Remote APIs:** Endpoints OData e SOAP com garantia formal de estabilidade para integrações externas.
> - **Local APIs:** CDS Views de interface liberadas e classes utilitárias para consumo local On-Stack.
> - **Extension Points:** BAdIs liberados e interfaces de extensibilidade de Business Objects do RAP.
> 
> *Classical user exits* (sub-rotinas clássicas legadas como `USEREXIT_*` em includes do SAP R/3) pertencem ao modelo clássico obsoleto e violam os princípios de Clean Core, não sendo interfaces liberadas em nuvem.

---

### Questão 6
Which of the following are ABAP RESTful application programming model extensibility options?
*(Selecione 3 respostas corretas)*

- [ ] A) Domain
- [ ] B) Data Model
- [ ] C) Field
- [ ] D) Behavior

> [!success]- Gabarito e Explicação Oficial da SAP
> **Respostas Corretas: B, C, D**
> 
> A extensibilidade de Business Objects no **RAP** é estruturada nas seguintes dimensões:
> 1. **Data Model (Modelo de Dados):** Extensão de tabelas de banco de dados por meio de estruturas de extensão liberadas e extensão correspondente das CDS Views associadas.
> 2. **Field (Campos e Mapeamento):** Inclusão de novos campos de dados no modelo e configuração dos seus mapeamentos.
> 3. **Behavior (Comportamento):** Adição de novas Actions, Determinations, Validations e rotinas de gravação adicional (*Additional Save*).
> 
> *Domain* é um elemento elementar do Dicionário ABAP clássico e não representa uma camada de extensibilidade de Business Object do RAP.

---

### Questão 7
Which of the following are challenges with trying to use classical extensibility in SAP S/4HANA Cloud?
*(Selecione 2 respostas corretas)*

- [ ] A) In SAP S/4HANA Cloud, there are no customer-specific customer update projects
- [ ] B) Classical extensibility does not enable customers to have flexible processes
- [ ] C) Classical extensibility does not enable customers to have competitive advantage
- [ ] D) In SAP S/4HANA Cloud, all software updates run simultaneously

> [!success]- Gabarito e Explicação Oficial da SAP
> **Respostas Corretas: A, D**
> 
> As técnicas da extensibilidade clássica (modificações no padrão, dependências de tabelas internas) são inviáveis no SAP S/4HANA Cloud porque:
> - **Não existem projetos manuais de upgrade específicos por cliente:** No modelo tradicional, o cliente parava seu sistema por meses para ajustar código quebrado via `SPAU`/`SPDD`. No Cloud, isso não é tolerado.
> - **Todas as atualizações de software ocorrem de forma simultânea e automatizada:** O software é atualizado de maneira transparente para todos os clientes ao mesmo tempo, exigindo que o código customizado dependa exclusivamente de contratos estáveis que nunca quebrem na entrega de novos releases.

---

### Questão 8
BAdIs are classified under which of the following extension types in SAP S/4HANA Cloud?
*(Selecione 1 resposta correta)*

- [ ] A) Key User Extension
- [ ] B) Developer Extension
- [ ] C) Side-By-Side Extension
- [ ] D) Classical user exit

> [!success]- Gabarito e Explicação Oficial da SAP
> **Resposta Correta: B**
> 
> Os **Business Add-Ins (BAdIs)** são classificados oficialmente como **Developer Extensions (Tipo 2 - On-Stack)**. 
> Embora a ferramenta web de Key User (*Custom Logic*) utilize internamente um BAdI pré-configurado sob uma casca simplificada, a implementação formal, completa e programática de BAdIs em ABAP Cloud é uma capacidade central da **Developer Extensibility** realizada dentro do Eclipse com **ABAP Development Tools (ADT)**.
