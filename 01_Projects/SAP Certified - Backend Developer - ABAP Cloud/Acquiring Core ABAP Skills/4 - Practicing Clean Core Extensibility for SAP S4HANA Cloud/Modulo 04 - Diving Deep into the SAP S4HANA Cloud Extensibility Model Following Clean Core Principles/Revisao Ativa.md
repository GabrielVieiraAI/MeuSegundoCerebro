---
tipo: revisao-ativa
tags:
  - sap
  - abap
  - abap-cloud
  - clean-core
  - revisao-ativa
  - modulo-04
  - extensibility-model
  - key-user
  - developer-extensibility
  - side-by-side
modulo: 4
nome_modulo: "Diving Deep into the SAP S/4HANA Cloud Extensibility Model Following Clean Core Principles"
status: em andamento
score_notebooklm: 0%
data_inicio: 2026-11-03
data_conclusao: 
---
# Caderno de Revisão Ativa: Módulo 4 - Extensibility Model Following Clean Core Principles

**Revisão Ativa Geral:** [[01_Projects/SAP Certified - Backend Developer - ABAP Cloud/Acquiring Core ABAP Skills/4 - Practicing Clean Core Extensibility for SAP S4HANA Cloud/00 - Revisão ativa|Revisão Ativa Geral do Curso]]  
**Quiz Oficial SAP:** [[01_Projects/SAP Certified - Backend Developer - ABAP Cloud/Acquiring Core ABAP Skills/4 - Practicing Clean Core Extensibility for SAP S4HANA Cloud/Modulo 04 - Diving Deep into the SAP S4HANA Cloud Extensibility Model Following Clean Core Principles/8 - Quiz|Quiz Oficial do Módulo 4]]

---

## Lições do Módulo (1:1 com Portal SAP)
* [[01_Projects/SAP Certified - Backend Developer - ABAP Cloud/Acquiring Core ABAP Skills/4 - Practicing Clean Core Extensibility for SAP S4HANA Cloud/Modulo 04 - Diving Deep into the SAP S4HANA Cloud Extensibility Model Following Clean Core Principles/1 - Evaluating the Necessity for a New Extensibility Model|1 - Evaluating the Necessity for a New Extensibility Model]]
* [[01_Projects/SAP Certified - Backend Developer - ABAP Cloud/Acquiring Core ABAP Skills/4 - Practicing Clean Core Extensibility for SAP S4HANA Cloud/Modulo 04 - Diving Deep into the SAP S4HANA Cloud Extensibility Model Following Clean Core Principles/2 - Introducing the SAP S4HANA Cloud Extensibility Model|2 - Introducing the SAP S4HANA Cloud Extensibility Model]]
* [[01_Projects/SAP Certified - Backend Developer - ABAP Cloud/Acquiring Core ABAP Skills/4 - Practicing Clean Core Extensibility for SAP S4HANA Cloud/Modulo 04 - Diving Deep into the SAP S4HANA Cloud Extensibility Model Following Clean Core Principles/3 - Explaining Key User Extensibility|3 - Explaining Key User Extensibility]]
* [[01_Projects/SAP Certified - Backend Developer - ABAP Cloud/Acquiring Core ABAP Skills/4 - Practicing Clean Core Extensibility for SAP S4HANA Cloud/Modulo 04 - Diving Deep into the SAP S4HANA Cloud Extensibility Model Following Clean Core Principles/4 - Explaining Developer Extensibility|4 - Explaining Developer Extensibility]]
* [[01_Projects/SAP Certified - Backend Developer - ABAP Cloud/Acquiring Core ABAP Skills/4 - Practicing Clean Core Extensibility for SAP S4HANA Cloud/Modulo 04 - Diving Deep into the SAP S4HANA Cloud Extensibility Model Following Clean Core Principles/5 - Explaining Side-By-Side Extensibility|5 - Explaining Side-By-Side Extensibility]]
* [[01_Projects/SAP Certified - Backend Developer - ABAP Cloud/Acquiring Core ABAP Skills/4 - Practicing Clean Core Extensibility for SAP S4HANA Cloud/Modulo 04 - Diving Deep into the SAP S4HANA Cloud Extensibility Model Following Clean Core Principles/6 - Exploring Released APIs in SAP S4HANA Cloud|6 - Exploring Released APIs in SAP S4HANA Cloud]]
* [[01_Projects/SAP Certified - Backend Developer - ABAP Cloud/Acquiring Core ABAP Skills/4 - Practicing Clean Core Extensibility for SAP S4HANA Cloud/Modulo 04 - Diving Deep into the SAP S4HANA Cloud Extensibility Model Following Clean Core Principles/7 - Evaluating Extensibility Options|7 - Evaluating Extensibility Options]]
* [[01_Projects/SAP Certified - Backend Developer - ABAP Cloud/Acquiring Core ABAP Skills/4 - Practicing Clean Core Extensibility for SAP S4HANA Cloud/Modulo 04 - Diving Deep into the SAP S4HANA Cloud Extensibility Model Following Clean Core Principles/8 - Quiz|8 - Quiz: Diving Deep into the SAP S/4HANA Cloud Extensibility Model Following Clean Core Principles]]

---

## Podcast de Revisão

![[Audio_Modulo_04_Extensibility_Model_Clean_Core.m4a]]

---

## Apresentação em Slides (Técnica Feynman)

![[Slides_Modulo_04_Extensibility_Model_Clean_Core.pdf]]

---

## Flashcards  

* **Nota de Flashcards:** [[01_Projects/SAP Certified - Backend Developer - ABAP Cloud/Acquiring Core ABAP Skills/4 - Practicing Clean Core Extensibility for SAP S4HANA Cloud/Flashcards/Flashcards - Modulo 04 - Extensibility Model|🗂️ Flashcards - Módulo 04]]
* **Deck no Plugin:** `#flashcards/sap/abap-cloud/modulo-04-extensibility-model`
* **Quantidade de Cartões:** 25 cartões ativos
* **Tópicos Críticos:** Incompatibilidade da extensibilidade clássica com Cloud Native (atualizações simultâneas e automatizadas pela SAP), 3 regras essenciais do modelo (sem modificações, separação estrita de código, uso exclusivo de objetos liberados), os 3 padrões de extensibilidade: **Key User** (Tipo 1: Fiori, Low-code/No-code, UI Adaptation, Custom Fields, Custom Logic, CBOs), **Developer Extensibility** (Tipo 2: On-Stack, ABAP Cloud, ADT, RAP Extensibility, BAdIs liberados, paisagem de 3 tenants 3SL), e **Side-by-Side Extensibility** (Tipo 3: SAP BTP, OData/SOAP Remote APIs, SAP Event Mesh, BTP ABAP Environment), distinção arquitetural entre *Extensibility Enablement* (SAP) e *Extensibility Provisioning* (Cliente), camadas de extensibilidade do RAP (Data Model, Field/Behavior, Node/Service Definition), regra de fronteira física de runtime (BTP não acessa CDS Views ou tabelas locais do S/4HANA diretamente), matriz de decisão (acoplamento rígido vs frouxo, LUW, proximidade com dados, escopo e persona) e coexistência sinérgica dos três modelos.

---

## Baterias de Testes

| Nível | Arquivo do Teste | Data | Score Obtido | Status |
| :--- | :--- | :---: | :---: | :---: |
| **Fácil** | [[01_Projects/SAP Certified - Backend Developer - ABAP Cloud/Acquiring Core ABAP Skills/4 - Practicing Clean Core Extensibility for SAP S4HANA Cloud/Modulo 04 - Diving Deep into the SAP S4HANA Cloud Extensibility Model Following Clean Core Principles/Testes/01 - Teste Nivel Facil\|01 - Teste Nivel Facil]] | 03/11 | % | ⚪ Pendente |
| **Médio** | [[01_Projects/SAP Certified - Backend Developer - ABAP Cloud/Acquiring Core ABAP Skills/4 - Practicing Clean Core Extensibility for SAP S4HANA Cloud/Modulo 04 - Diving Deep into the SAP S4HANA Cloud Extensibility Model Following Clean Core Principles/Testes/02 - Teste Nivel Medio\|02 - Teste Nivel Medio]] | | % | ⚪ Pendente |
| **Difícil** | [[01_Projects/SAP Certified - Backend Developer - ABAP Cloud/Acquiring Core ABAP Skills/4 - Practicing Clean Core Extensibility for SAP S4HANA Cloud/Modulo 04 - Diving Deep into the SAP S4HANA Cloud Extensibility Model Following Clean Core Principles/Testes/03 - Teste Nivel Dificil\|03 - Teste Nivel Dificil]] | | % | ⚪ Pendente |
| **Simulado** | [[01_Projects/SAP Certified - Backend Developer - ABAP Cloud/Acquiring Core ABAP Skills/4 - Practicing Clean Core Extensibility for SAP S4HANA Cloud/Modulo 04 - Diving Deep into the SAP S4HANA Cloud Extensibility Model Following Clean Core Principles/Testes/04 - Simulado Final\|04 - Simulado Final]] | | % | ⚪ Pendente |

---

## Mapa Mental do Módulo

![[Mapa Mental - Modulo 04 - Extensibility Model Following Clean Core.excalidraw]]
