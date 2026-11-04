---
tipo: clippings
title: "Transitioning to SAP S4HANA Cloud"
source: "https://learning.sap.com/courses/practicing-clean-core-extensibility-for-sap-s-4hana-cloud/transitioning-to-sap-s-4hana-cloud_aa888600-4e9c-4e70-8665-5b7f7753c819"
created: 2026-11-03
tags:
  - sap
  - abap
  - abap-cloud
  - clean-core
  - brownfield
  - greenfield
  - selective-data-transition
---
**Roteiro de Estudos Relacionado:** [[Roteiro de Estudos SAP]]

# Objetivos de Aprendizado

Após concluir esta lição, você será capaz de:
- Diferenciar as opções estratégicas de transição para o SAP S4HANA Cloud (*Differentiate between the different options to transition to SAP S4HANA Cloud*).
- Avaliar os objetivos e características de uma **Conversão de Sistema (*Brownfield*)** versus uma **Nova Implementação (*Greenfield*)**.
- Explicar quando utilizar a **Transformação de Paisagem (*Landscape Transformation / Selective Data Transition*)**.

---

## 1. As Duas Grandes Decisões de Migração

Na jornada rumo ao SAP S/4HANA, todo cliente corporativo precisa tomar duas decisões estruturais interdependentes:

1. **Qual opção de implantação (*Deployment Option*) escolher:**
   - **SAP S4HANA Cloud Public Edition** (SaaS puro, multitenant)
   - **SAP S4HANA Cloud Private Edition** (Nuvem privada dedicada, gerenciada pela SAP)
   - **SAP S/4HANA** (Instalação tradicional *On-Premise*)

2. **Qual abordagem de transição técnica (*Transition Approach*) adotar:**
   - **Conversão de Sistema (*System Conversion / Brownfield*)**
   - **Nova Implementação (*New Implementation / Greenfield*)**
   - **Transformação de Paisagem (*Landscape Transformation / Selective Data Transition*)**

![[Transition_to_SAP_S4HANA_001.png]]

> [!IMPORTANT] Regra Crítica da Nuvem Pública (Public Edition)
> Para o **SAP S4HANA Cloud Public Edition**, a **Nova Implementação (*New Implementation*) é a única opção permitida**.  
> Não existe viabilidade técnica de realizar conversão de sistema (*System Conversion*) direta ou *Landscape Transformation* para o ambiente de Nuvem Pública.  
> Por outro lado, clientes migrando para **SAP S4HANA Cloud Private Edition** ou **On-Premise** podem escolher livremente entre qualquer uma das três estratégias.

Todas as três abordagens são perfeitamente compatíveis com a filosofia Clean Core, mas a forma de executá-la e a esteira de governança assumem dinâmicas muito diferentes em cada uma.

---

## 2. Conversão de Sistema (*System Conversion - Brownfield*)

Na conversão de sistema, o cliente pega sua instalação existente do SAP ERP (ECC 6.0) e a converte tecnicamente para SAP S4HANA Cloud Private Edition ou SAP S/4HANA On-Premise:
- O novo sistema inicia com a base operacional, histórico de transações e configurações o mais próximo possível do ERP legado, funcionando o sistema existente como um "modelo" ou *template*.
- Após a conversão técnica do banco de dados e do código padrão, inicia-se a esteira de retrabalho, modernização e adaptação do código customizado.
- **Foco Primordial do Clean Core:** **Tornar o core limpo** (*Get the Core Clean*).

---

## 3. Nova Implementação (*New Implementation - Greenfield*)

Em uma nova implementação, um ambiente virgem de SAP S/4HANA é provisionado (no Public Edition ou Private Edition) ou instalado (no On-Premise):
- Por definição, o sistema **não herda nenhuma linha de código legado** do antigo SAP ERP.
- A equipe de projeto não precisa se preocupar em reverter modificações históricas nem adaptar extensões legadas obsoletas.
- O sistema já **nasce com o Clean Core por padrão**. Isso não elimina a necessidade de construir extensões alinhadas ao negócio, mas elas serão desenvolvidas desde o primeiro dia utilizando o modelo moderno de extensibilidade da SAP.
- Permite um modelo de entrada em produção faseado (*Phased Rollout*), por exemplo, ativando uma empresa (*company code*) ou região geográfica por vez.
- **Foco Primordial do Clean Core:** **Manter o core limpo** (*Keep the Core Clean*).

---

## 4. Transformação de Paisagem (*Landscape Transformation*)

A abordagem de **Transformação de Paisagem** (também conhecida pelo mercado como *Selective Data Transition*):
- É especialmente recomendada para grandes corporações globais que possuem dezenas de sistemas ERP legados heterogêneos decorrentes de um histórico de fusões e aquisições (*Mergers & Acquisitions*).
- Permite selecionar, consolidar e harmonizar dados mestres, dados transacionais relevantes e configurações de múltiplos sistemas legados para uma única instância consolidada de SAP S4HANA Cloud Private Edition ou On-Premise.

---

## 5. Resumo Comparativo das Abordagens

| Critério de Comparação | Nova Implementação (*Greenfield*) | Conversão de Sistema (*Brownfield*) | Transformação de Paisagem (*Selective Data Transition*) |
| :--- | :--- | :--- | :--- |
| **Ponto de Partida** | Instalação limpa do zero | Sistema SAP ERP existente como template | Múltiplos sistemas legados consolidados |
| **Código Customizado Legado** | Não é herdado (começa do zero) | Herdado integralmente para adaptação técnica | Migrado seletivamente sob demanda |
| **Histórico de Transações** | Apenas dados abertos e saldos iniciais | Histórico completo retido no sistema | Histórico migrado de forma selecionada |
| **Meta no Clean Core** | **Manter o Core Limpo** (*Keep the Core Clean*) | **Tornar o Core Limpo** (*Get the Core Clean*) | **Harmonizar e Limpar o Core** |
| **Compatibilidade com Public Edition** | **Sim (Única opção permitida)** | **Não** | **Não** |
| **Compatibilidade com Private / On-Premise** | Sim | Sim | Sim |
