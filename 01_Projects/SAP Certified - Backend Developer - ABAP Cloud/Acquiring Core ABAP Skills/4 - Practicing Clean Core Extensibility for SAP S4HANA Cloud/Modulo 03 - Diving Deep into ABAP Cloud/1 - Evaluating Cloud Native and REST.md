---
tipo: clippings
title: "Evaluating Cloud Native and REST"
source: "https://learning.sap.com/courses/practicing-clean-core-extensibility-for-sap-s-4hana-cloud/evaluating-cloud-native-and-rest_a8437931-1c88-45f8-aee4-1f67df09aa44"
created: 2026-11-03
tags:
  - sap
  - abap
  - abap-cloud
  - cloud-native
  - rest
  - microservices
  - clean-core
---
**Roteiro de Estudos Relacionado:** [[Roteiro de Estudos SAP]]

# Objetivos de Aprendizado

Após concluir esta lição, você será capaz de:
- Explicar os princípios essenciais e as características da computação em nuvem e do paradigma **Cloud Native**.
- Avaliar os princípios arquiteturais fundamentais do **Representational State Transfer (REST)** e sua correlação com as operações CRUD sobre o protocolo HTTP.

---

## 1. Da Infraestrutura On-Premise à Computação em Nuvem

Para entender as origens e a necessidade do modelo de desenvolvimento **ABAP Cloud**, é indispensável revisitar o paradigma da computação em nuvem (*Cloud Computing*):
- No modelo tradicional em data centers locais (*On-Premise*), a organização cliente é responsável pela compra, instalação, refrigeração e manutenção de hardware físico (servidores, switches, roteadores e storages).
- Na computação em nuvem, a infraestrutura física é fornecida e mantida por um provedor externo (*Cloud Provider*), abrangendo: **Rede (*Network*)**, **Servidores (*Compute & Memory*)**, **Armazenamento (*Storage*)** e **Sistemas Operacionais / Camada de Virtualização**.

![[Cloud_Native_Principles_001.png]]

### Princípios da Computação em Nuvem
Esses componentes de infraestrutura são entregues com base em quatro características contratuais e técnicas:

1. **Elasticidade (*Elasticity*):** A capacidade de expandir ou contrair recursos computacionais dinamicamente. Por exemplo, em períodos de fechamento contábil mensal ou processamento de folha de pagamento, a carga do sistema exige picos temporários de processamento que são alocados sob demanda sem necessidade de compra permanente de hardware ocioso.
2. **Modelos de Precificação (*Pricing & Consumption*):** Pagamento baseado em consumo ou assinatura. Na **SAP BTP (Platform as a Service - PaaS)**, por exemplo, a SAP oferece planos por assinatura fixa e planos flexíveis baseados em créditos de consumo (*Cloud Platform Enterprise Agreement - CPEA* e *Pay-As-You-Go*).
3. **Disponibilidade (*Availability*):** Operação contínua 24x7 para suportar cadeias de suprimentos e processos de missão crítica distribuídos globalmente.
4. **Acordo de Nível de Serviço (*Service Level Agreement - SLA*):** Garantia formal de tempo de atividade contratual. Por exemplo, um SLA de 99,99% em um mês de 30 dias (43.200 minutos) admite uma indisponibilidade máxima acumulada de apenas aproximadamente 4,3 minutos em todo o período.

---

## 2. O Paradigma Cloud Native: Independência de Infraestrutura

A diferença real entre ter um data center próprio e usar a nuvem não reside apenas em "quem é o dono do hardware", mas em **como o software é projetado**:
- Uma aplicação corporativa em nuvem deve ser **independente de infraestrutura (*Infrastructure Independent*)**.
- O código de negócio não pode depender de detalhes específicos de uma placa de rede, sistema operacional subjacente ou fabricante de servidor. Para o desenvolvedor e para o usuário final, a infraestrutura é uma **abstração pura**.

![[CloudNative_Image.png]]

A abordagem **Cloud Native** fundamenta-se em três pilares essenciais:

### 1. Independência de Infraestrutura (*Infrastructure Independent*)
A aplicação executa de maneira idêntica e previsível independentemente do provedor de nuvem subjacente (Hyperscalers como AWS, Microsoft Azure, Google Cloud Platform) ou das variações de hardware físico.

### 2. Microsserviços e Arquitetura em Camadas (*Microservices*)
As aplicações são divididas em camadas modulares e desacopladas que operam de forma autônoma:
- **Camada de Usuário / Consumo (*User/Consumption Layer*):** Renderização visual da interface de usuário com a qual as pessoas interagem.
- **Camada de Serviço (*Service Layer*):** Responde a requisições do frontend e orquestra as operações transacionais sobre os dados.
- **Camada de Dados (*Data Layer*):** Persistência segura em banco de dados relacional.

A comunicação entre a camada de usuário e os dados é governada pelas operações padrão de negócio conhecidas como **CRUD**:
- **C**reate (Criação de novos registros)
- **R**ead (Leitura e consulta de dados)
- **U**pdate (Atualização de registros existentes)
- **D**elete (Exclusão de registros)

### 3. Interfaces de Programação de Aplicações (*APIs*)
Mecanismo padronizado pelo qual diferentes componentes de software trocam dados e manipulam recursos sob contratos previsíveis. No mundo moderno, as APIs evoluíram para o padrão **REST**.

---

## 3. Princípios Arquiteturais do REST (*Representational State Transfer*)

O **REST** é o estilo arquitetural predominante para construção de APIs em ambientes de nuvem e microsserviços.

![[REST_Arch_Principles_001.png]]

### Desconstruindo o Termo REST
- **Recurso (*Resource*):** O objeto de negócio manipulado (ex: uma Conta Bancária ou uma Ordem de Vendas).
- **Estado (*State*):** O valor dos atributos do recurso em um instante do tempo (ex: o saldo atual da conta bancária).
- **Representação (*Representation*):** O formato estruturado no qual esse estado é transmitido (tipicamente JSON ou XML).
- **Transferência (*Transfer*):** A movimentação dessa representação entre o cliente e o servidor via internet: **[Resource] Representational State Transfer**.

### Os 6 Princípios Oficiais da Arquitetura REST

| Princípio REST | Descrição Técnica e Aplicação Prática |
| :--- | :--- |
| **1. Identificação Uniforme de Recursos (*Uniform Resource Interface*)** | Cada recurso é endereçado de maneira exclusiva através de uma URI/URL padronizada (ex: `https://api.empresa.com/v1/Accounts/12345`). |
| **2. Cliente-Servidor (*Client-Server*)** | Separação rigorosa entre a interface frontend (cliente) e a lógica de armazenamento e processamento backend (servidor). |
| **3. Sem Estado (*Stateless*)** | **Cada requisição HTTP do cliente ao servidor deve conter toda a informação necessária para ser processada.** O servidor não armazena contexto de sessão entre chamadas. Se duas requisições consecutivas de saldo forem enviadas, a segunda é tratada como uma requisição 100% nova. |
| **4. Capacidade de Cache (*Cacheable*)** | As respostas devem explicitar se podem ser cacheadas pelo cliente ou por proxies intermediários, otimizando performance e diminuindo latência de rede. |
| **5. Sistema em Camadas (*Layered System*)** | A arquitetura permite sistemas intermediários (balanceadores de carga, firewalls, gateways de API e servidores de autenticação) sem que o cliente precise ter ciência disso. |
| **6. Código sob Demanda (*Code on Demand - Opcional*)** | Permite que o servidor transfira scripts executáveis (como código JavaScript) para estender temporariamente as funcionalidades do cliente. |

---

## 4. Mapeamento entre Verbos HTTP e Operações CRUD

Por adotar o protocolo **HTTP** (que é inerentemente *stateless*), as requisições REST utilizam os métodos HTTP padrão para representar as intenções de manipulação de recursos:

| Verbo HTTP | Operação CRUD | Ação sobre o Recurso de Negócio |
| :---: | :---: | :--- |
| **`POST`** | **Create** | Cria uma nova instância do recurso no banco de dados. |
| **`GET`** | **Read** | Consulta e recupera a representação do recurso (ou lista de recursos). |
| **`PUT` / `PATCH`** | **Update** | Atualiza os atributos de um recurso existente. |
| **`DELETE`** | **Delete** | Remove o recurso da base de dados. |

Esse modelo fundamenta o protocolo **OData (Open Data Protocol)** e serve de alicerce para todo o modelo transacional do **ABAP Cloud** e do framework **RAP**.
