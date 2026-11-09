---
tipo: clippings
title: "Explaining Developer Extensibility"
source: "https://learning.sap.com/courses/practicing-clean-core-extensibility-for-sap-s-4hana-cloud/explaining-developer-extensibility_f2683861-d69e-4a59-9e3e-01e3cc20fb0f"
created: 2026-11-03
tags:
  - sap
  - abap
  - abap-cloud
  - developer-extensibility
  - rap
  - badi
  - 3sl
  - clean-core
---
**Roteiro de Estudos Relacionado:** [[Roteiro de Estudos SAP]]

# Objetivos de Aprendizado

Após concluir esta lição, você será capaz de:
- Explicar as características, o público-alvo e os cenários de uso da **Developer Extensibility** (On-Stack) no SAP S/4HANA Cloud.
- Descrever a arquitetura de paisagem de sistemas de três camadas (**3-System Landscape - 3SL**) necessária para desenvolvimento ABAP profissional.
- Explorar a extensibilidade de Business Objects no **ABAP RESTful Application Programming Model (RAP)** em todas as camadas (modelo de dados, comportamento e nós).
- Analisar a arquitetura de **Business Add-Ins (BAdIs)** liberados sob as diretrizes de **Clean Core**.
- Diferenciar os conceitos de **Extensibility Enablement** (habilitado pela SAP) e **Extensibility Provisioning** (implementado pelo cliente).

---

## 1. O Papel da Developer Extensibility (On-Stack)

A **Developer Extensibility** (Extensibilidade de Desenvolvedor) é direcionada ao desenvolvedor ABAP profissional (*Pro-Code Persona*). Ela permite implementar casos de uso de alta complexidade diretamente no ambiente de execução do SAP S/4HANA Cloud (**On-Stack**), utilizando a linguagem **ABAP Cloud** e o ambiente **ABAP Development Tools (ADT)** no Eclipse.

![[Developer_Extensibility_001.png]]

### Casos de Uso Típicos
1. **Acesso Frequente e Complexo a Dados:** Cenários que demandam alto volume de leitura analítica ou processamento intensivo de dados via SQL (*Data Proximity*), onde mover os dados para fora do SAP S/4HANA causaria sobrecarga de rede.
2. **Mesma Unidade Lógica de Trabalho (Same LUW):** Extensões que precisam ser executadas de forma atômica e transacional na mesma **SAP LUW (Logical Unit of Work)** da transação padrão (ou tudo comita, ou tudo sofre rollback).
3. **Exposição de Novas APIs Remotas:** Criação de serviços OData customizados para serem consumidos por aplicações *Side-by-Side* no SAP BTP ou portais externos.

### Pilares de Extensão Disponíveis
A SAP fornece aos desenvolvedores duas possibilidades técnicas principais:
- **RAP Extensibility (Extensibilidade de Business Objects do RAP):** Mais de 125 *Business Object Interfaces* liberadas.
- **Business Add-Ins (BAdIs):** Mais de 800 BAdIs públicos liberados.

---

## 2. Paisagem de Sistemas: A Necessidade do 3-System Landscape (3SL)

Historicamente, o SAP S/4HANA Cloud Público era entregue em uma arquitetura de apenas dois ambientes (*2-Tenant Landscape*):
- Um ambiente de Qualidade/Configuração (onde eram feitas customizações leves de Key User e testes).
- Um ambiente de Produção.

Com o advento da **Developer Extensibility**, que envolve compilação de código ABAP, testes unitários automatizados (ABAP Unit) e governança rigorosa de ciclo de vida de desenvolvimento, a SAP introduziu o modelo padrão de três ambientes (**3-System Landscape - 3SL**):

```
┌─────────────────────────────────┐
│     Tenant de Desenvolvimento   │ ──(Ordem de Transporte)──► ┌─────────────────────────────────┐
│              (DEV)              │                             │      Tenant de Testes (QAS)     │
│ • Key User (Fiori Apps)         │                             │ • Testes integrados e aceitação │
│ • Developer Extensibility (ADT) │                             └────────────────┬────────────────┘
└─────────────────────────────────┘                                              │
                                                                                 ▼ (Import)
                                                                ┌─────────────────────────────────┐
                                                                │      Tenant de Produção (PRD)   │
                                                                │ • Operação produtiva de negócio │
                                                                └─────────────────────────────────┘
```

Tanto os artefatos criados por desenvolvedores no Eclipse ADT quanto as customizações feitas por Key Users no Fiori são encapsulados em **Ordens de Transporte (*Transport Requests*)**, garantindo rastreabilidade, versionamento e esteira de testes contínua.

---

## 3. Arquitetura de BAdIs no SAP S/4HANA Cloud

Os **Business Add-Ins (BAdIs)** são a espinha dorsal da extensão clássica e continuam plenamente suportados e evoluídos no modelo moderno:

![[Business_Add-Ins_001.png]]

- **Orientação a Objetos Pura:** O BAdI desacopla formalmente a definição (interface ABAP) da sua implementação concreta (classe ABAP).
- **Isolamento de Ciclo de Vida:** A implementação do cliente reside em seu próprio pacote e namespace. Atualizações de versão do SAP S/4HANA Cloud não afetam o código da implementação do BAdI, e a SAP garante que a assinatura da interface não sofrerá quebras (*Stability Contract*).

---

## 4. Extensibilidade em Camadas no RAP (RAP Extensibility)

O **ABAP RESTful Application Programming Model (RAP)** foi projetado desde sua concepção para ser modular e extensível em cada nível de sua pilha arquitetural:

![[Business_Object_Interfaces_001.png]]

### A. Extensibilidade do Modelo de Dados (Data Model Extensions)
- **Database Table Extensions:** A SAP libera tabelas específicas como extensíveis via anotação de dicionário e fornece uma estrutura de extensão dedicada (*Extension Structure*). O desenvolvedor adiciona novos campos a essa estrutura, sem alterar o cabeçalho físico da tabela padrão.
- **CDS View Extensions:** Se a tabela de banco de dados for estendida, as entidades Core Data Services dependentes devem ser atualizadas. A SAP fornece CDS Views associadas a visões de extensão (*Extension Include Views*), permitindo que os novos campos e associações sejam automaticamente projetados na camada de leitura.

### B. Extensibilidade de Comportamento (Field Behavior and Behavior Extensions)
Permite enriquecer a lógica transacional do Business Object RAP padrão:
- Mapeamento de novos campos customizados para o modelo transacional.
- Adição de novas **Ações (*Actions*)**, **Determinações (*Determinations*)** e **Validações (*Validations*)**.
- Implementação de rotinas de gravação adicional (**Additional Save**).
- Para BOs com suporte a rascunho (*Draft-Enabled*), adição de ações de determinação e extensão da ação nativa de preparação (`Prepare`).

### C. Extensibilidade de Nós e Serviços (Node and Service Definition Extensions)
- **Node Extensibility:** Permite plugar uma entidade filha inteiramente nova (ex: uma tabela customizada de histórico ou anexos específicos do cliente) na árvore hierárquica de um Business Object RAP existente.
- **Service Definition Extensions:** Permite estender a definição de serviço para expor o novo nó ou as novas entidades na camada externa OData.

### Vocabulário Arquitetural Obrigatório
- **Extensibility Enablement (Habilitação de Extensibilidade):** Prerrogativa exclusiva da SAP. Define formalmente *se* um artefato pode ser estendido e *quais* tipos de extensão são permitidos em sua interface.
- **Extensibility Provisioning (Provisionamento de Extensibilidade):** O ato prático do cliente ou parceiro de implementar a extensão concreta utilizando os pontos previamente habilitados.

---

## 5. Simulações Práticas Oficiais (SAP Enable Now)

> [!TIP] Simulação 1: Estender um BO do RAP adicionando um novo campo
> [Acessar Exercício no SAP Enable Now](https://learnsap.enable-now.cloud.sap/pub/mmcp/index.html?show=project!PR_C4129427A6E10880:uebung)

> [!TIP] Simulação 2: Estender um BO do RAP adicionando uma nova Action
> [Acessar Exercício no SAP Enable Now](https://learnsap.enable-now.cloud.sap/pub/mmcp/index.html?show=project!PR_8C70C0B4D34D9CB6:uebung)

> [!TIP] Simulação 3: Estender um BO do RAP adicionando uma nova Validation
> [Acessar Exercício no SAP Enable Now](https://learnsap.enable-now.cloud.sap/pub/mmcp/index.html?show=project!PR_2B778AD125AAFBB5:uebung)

> [!TIP] Simulação 4: Estender um BO do RAP adicionando um novo Nó (Node)
> [Acessar Exercício no SAP Enable Now](https://learnsap.enable-now.cloud.sap/pub/mmcp/index.html?show=project!PR_52697900929AF293:uebung)

> [!TIP] Simulação 5: Implementar um BAdI Liberado no Eclipse ADT
> [Acessar Exercício no SAP Enable Now](https://learnsap.enable-now.cloud.sap/pub/mmcp/index.html?show=project!PR_F5C8FF6C8EB37D99:uebung)

---

## Resumo da Lição

- A **Developer Extensibility** atende a requisitos avançados de desenvolvimento ABAP profissional executados diretamente no SAP S/4HANA Cloud (**On-Stack**).
- Opera obrigatoriamente sob o modelo **ABAP Cloud** e exige uma paisagem de três tenants (**3-System Landscape - 3SL: DEV, QAS, PRD**).
- As extensões são ancoradas em dois mecanismos formais:
  - **BAdIs liberados:** pontos de extensão orientados a objetos com desacoplamento de ciclo de vida.
  - **RAP Extensibility:** extensão estruturada de modelos de dados (CDS Views), comportamentos transacionais (Actions, Validations, Determinations, Additional Save) e inclusão de novos nós relacionais.
- A SAP define a habilitação (**Enablement**), enquanto o desenvolvedor do cliente executa o provisionamento (**Provisioning**).
