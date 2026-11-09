---
tipo: clippings
title: "Explaining Side-By-Side Extensibility"
source: "https://learning.sap.com/courses/practicing-clean-core-extensibility-for-sap-s-4hana-cloud/explaining-side-by-side-extensibility_a01bb1ac-1acb-434d-8458-7a36cf2bcb3b"
created: 2026-11-03
tags:
  - sap
  - abap
  - side-by-side
  - btp
  - steampunk
  - clean-core
  - remote-apis
---
**Roteiro de Estudos Relacionado:** [[Roteiro de Estudos SAP]]

# Objetivos de Aprendizado

Após concluir esta lição, você será capaz de:
- Explicar os fundamentos, objetivos e benefícios arquiteturais da **Side-by-Side Extensibility** no **SAP BTP (SAP Business Technology Platform)**.
- Identificar os principais casos de uso onde a extensibilidade desacoplada é superior à extensibilidade On-Stack.
- Compreender a comunicação segura entre o SAP BTP e o SAP S/4HANA Cloud por meio de **Remote APIs** e **Business Events**.
- Analisar o papel do **SAP BTP, ABAP Environment** como ambiente PaaS para desenvolvimento de aplicações autônomas e extensões em nuvem.

---

## 1. O Conceito de Side-by-Side Extensibility

A **Side-by-Side Extensibility** é uma abordagem arquitetural voltada para desenvolvedores profissionais em que a aplicação customizada **não é executada dentro do SAP S/4HANA Cloud**, mas sim externamente na plataforma de inovação e nuvem da SAP: o **SAP BTP (SAP Business Technology Platform)**.

![[Side-by-Side_Extensibility_001.png]]

- **Desacoplamento Total de Ciclo de Vida:** Como o código reside fisicamente no SAP BTP, os ciclos de desenvolvimento, testes, implantação contínua e escalabilidade da aplicação customizada são totalmente independentes do ciclo de atualizações do ERP.
- **Premissa Arquitetural:** O caso de negócio necessita de dados ou transações do SAP S/4HANA Cloud, mas **não precisa compartilhar o ambiente de runtime nem a mesma Unidade Lógica de Trabalho (SAP LUW)** do núcleo transacional.
- **Comunicação por Contratos Remotos:** A integração entre a aplicação no SAP BTP e o SAP S/4HANA Cloud é realizada exclusivamente por meio de:
  - **Remote APIs públicas liberadas:** Serviços OData (v2/v4) ou SOAP.
  - **Eventos Corporativos Assíncronos:** Mensagens e notificações de eventos trafegadas via **SAP Event Mesh**.

---

## 2. Casos de Uso Típicos para Side-by-Side Extensibility

A arquitetura desacoplada na SAP BTP é a recomendação primária para os seguintes cenários:

1. **Aplicações que Consomem Serviços Avançados de Nuvem da SAP BTP:**
   - Soluções que exigem recursos de inteligência artificial generativa (**SAP Generative AI Hub**), aprendizado de máquina (*Machine Learning*), processamento de documentos (*Document Information Extraction*) ou orquestração visual de processos (*SAP Build Process Automation*).
2. **Integração Heterogênea entre Múltiplos Sistemas:**
   - Aplicações que precisam conectar dados e orquestrar processos distribuídos entre diferentes sistemas legados, filiais com instâncias On-Premise distintas, bancos de dados externos e plataformas SaaS de terceiros (como Salesforce, ServiceNow ou SuccessFactors).
3. **Aplicações Voltadas a Usuários Externos ou Alto Tráfego:**
   - Portais de autoatendimento para fornecedores, parceiros comerciais ou clientes finais (B2C) com milhares de acessos concorrentes diários. Isolar essa carga no BTP protege o SAP S/4HANA contra picos de tráfego e riscos de indisponibilidade.
4. **Soluções SaaS Construídas por Parceiros (ISVs):**
   - Softwares desenvolvidos por empresas parceiras da SAP que precisam atender múltiplos clientes simultaneamente (*Multitenancy*), distribuindo o mesmo aplicativo para diferentes tenants de SAP S/4HANA com isolamento total de dados.

---

## 3. SAP BTP, ABAP Environment: O ABAP Cloud como PaaS

Para equipes com forte experiência no ecossistema SAP, a SAP disponibiliza o **SAP BTP, ABAP Environment** (historicamente conhecido pelo codinome de projeto *Steampunk*):

- **Plataforma como Serviço (PaaS) para ABAP:** Permite criar aplicações em nuvem escaláveis e multilocatárias (*Multitenant*) utilizando as habilidades existentes dos desenvolvedores ABAP.
- **Banco de Dados Dedicado:** Cada instância inclui nativamente um banco de dados **SAP HANA Cloud**.
- **Mesmo Modelo de Desenvolvimento (ABAP Cloud):**
  - Mesma ferramenta de desenvolvimento: **Eclipse com ADT (ABAP Development Tools)**.
  - Mesmo modelo de programação transacional: **ABAP RESTful Application Programming Model (RAP)**.
  - Mesma sintaxe e restrições: compilador configurado para **ABAP Language Version 5 (ABAP Cloud)**.
  - Mesmo princípio de governança: consumo exclusivo de interfaces liberadas (**Released APIs**).

> [!NOTE] Reutilização Integral de Conhecimento
> A padronização da linguagem em torno do **ABAP Cloud** elimina a barreira entre desenvolvimento interno e externo: o mesmo desenvolvedor que cria uma extensão On-Stack no SAP S/4HANA Cloud é capaz de criar uma aplicação autônoma Side-by-Side no SAP BTP sem precisar reaprender novos paradigmas conceituais.

---

## 4. Comparativo: On-Stack Developer vs Side-by-Side Extensibility

| Critério Arquitetural | Developer Extensibility (On-Stack) | Side-by-Side Extensibility (SAP BTP) |
| :--- | :--- | :--- |
| **Local de Execução** | No próprio SAP S/4HANA Cloud | No SAP BTP (Cloud Foundry, Kyma, ABAP Env) |
| **Proximidade com os Dados (*Data Proximity*)** | Máxima (acesso SQL local no banco HANA do ERP) | Média/Remota (chamadas de rede OData / SOAP) |
| **Unidade Transacional (LUW)** | Mesma SAP LUW da transação padrão | Desacoplada (execução assíncrona ou eventual consistency) |
| **Linguagens Suportadas** | Exclusivamente **ABAP Cloud** | Poliglota: Java, Node.js (CAP), Python, ABAP Cloud |
| **Público de Usuários** | Usuários corporativos internos com licença ERP | Usuários internos, parceiros, fornecedores ou clientes finais |
| **Impacto no Ciclo do ERP** | Compartilha a janela de transporte (3SL) | Ciclo de entrega contínua independente (CI/CD) |

---

## Resumo da Lição

- A **Side-by-Side Extensibility** executa o código fora do SAP S/4HANA Cloud, utilizando os recursos de infraestrutura e serviços avançados do **SAP BTP**.
- A comunicação é estabelecida exclusivamente por **APIs remotas públicas** (OData, SOAP) e **mensageria de eventos** (SAP Event Mesh).
- O **SAP BTP, ABAP Environment** viabiliza o desenvolvimento de extensões Side-by-Side reutilizando 100% dos conhecimentos de **ABAP Cloud**, **RAP** e **Eclipse ADT**.
- É a estratégia recomendada para aplicações multissistemas, soluções SaaS de parceiros, portais externos de alto tráfego e integrações com serviços de IA/ML.
