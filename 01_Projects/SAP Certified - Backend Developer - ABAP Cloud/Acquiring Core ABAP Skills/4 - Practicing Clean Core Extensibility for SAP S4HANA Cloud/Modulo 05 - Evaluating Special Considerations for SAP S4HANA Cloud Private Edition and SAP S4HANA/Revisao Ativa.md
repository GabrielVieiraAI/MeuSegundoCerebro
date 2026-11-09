---
tipo: revisao-ativa
tags:
  - sap
  - abap
  - abap-cloud
  - clean-core
  - revisao-ativa
  - modulo-05
  - private-edition
  - on-premise
  - clean-core-levels
  - atc
modulo: 5
nome_modulo: "Evaluating Special Considerations for SAP S/4HANA Cloud Private Edition and SAP S/4HANA"
status: em andamento
score_notebooklm: 0%
data_inicio: 2026-11-03
data_conclusao: 
---
# Caderno de Revisão Ativa: Módulo 5 - Private Edition, On-Premise & Clean Core Levels

**Revisão Ativa Geral:** [[01_Projects/SAP Certified - Backend Developer - ABAP Cloud/Acquiring Core ABAP Skills/4 - Practicing Clean Core Extensibility for SAP S4HANA Cloud/00 - Revisão ativa|Revisão Ativa Geral do Curso]]  
**Quiz Oficial SAP:** [[01_Projects/SAP Certified - Backend Developer - ABAP Cloud/Acquiring Core ABAP Skills/4 - Practicing Clean Core Extensibility for SAP S4HANA Cloud/Modulo 05 - Evaluating Special Considerations for SAP S4HANA Cloud Private Edition and SAP S4HANA/4 - Quiz|Quiz Oficial do Módulo 5]]

---

## Lições do Módulo (1:1 com Portal SAP)
* [[01_Projects/SAP Certified - Backend Developer - ABAP Cloud/Acquiring Core ABAP Skills/4 - Practicing Clean Core Extensibility for SAP S4HANA Cloud/Modulo 05 - Evaluating Special Considerations for SAP S4HANA Cloud Private Edition and SAP S4HANA/1 - Evaluating Use Cases for SAP S4HANA Cloud Private Edition and SAP S4HANA|1 - Evaluating Use Cases for SAP S4HANA Cloud Private Edition and SAP S4HANA]]
* [[01_Projects/SAP Certified - Backend Developer - ABAP Cloud/Acquiring Core ABAP Skills/4 - Practicing Clean Core Extensibility for SAP S4HANA Cloud/Modulo 05 - Evaluating Special Considerations for SAP S4HANA Cloud Private Edition and SAP S4HANA/2 - Exploring Clean Core Extensibility Best Practices|2 - Exploring Clean Core Extensibility Best Practices]]
* [[01_Projects/SAP Certified - Backend Developer - ABAP Cloud/Acquiring Core ABAP Skills/4 - Practicing Clean Core Extensibility for SAP S4HANA Cloud/Modulo 05 - Evaluating Special Considerations for SAP S4HANA Cloud Private Edition and SAP S4HANA/3 - Setting Up For Clean Core Development|3 - Setting Up For Clean Core Development]]
* [[01_Projects/SAP Certified - Backend Developer - ABAP Cloud/Acquiring Core ABAP Skills/4 - Practicing Clean Core Extensibility for SAP S4HANA Cloud/Modulo 05 - Evaluating Special Considerations for SAP S4HANA Cloud Private Edition and SAP S4HANA/4 - Quiz|4 - Quiz: Evaluating Special Considerations for SAP S4HANA Cloud Private Edition and SAP S/4HANA]]

---

## Podcast de Revisão

![[Audio_Modulo_05_Private_Edition_Clean_Core_Levels.m4a]]

---

## Apresentação em Slides (Técnica Feynman)

![[Slides_Modulo_05_Private_Edition_Clean_Core_Levels.pdf]]

---

## Flashcards  

* **Nota de Flashcards:** [[01_Projects/SAP Certified - Backend Developer - ABAP Cloud/Acquiring Core ABAP Skills/4 - Practicing Clean Core Extensibility for SAP S4HANA Cloud/Flashcards/Flashcards - Modulo 05 - Clean Core Levels|🗂️ Flashcards - Módulo 05]]
* **Deck no Plugin:** `#flashcards/sap/abap-cloud/modulo-05-clean-core-levels`
* **Quantidade de Cartões:** 20 cartões ativos
* **Tópicos Críticos:** Diferenças de upgrade entre Public Edition (simultâneo/automático) e Private Edition/On-Premise (projetos tradicionais), por que usar ABAP Cloud mesmo no Private Edition (portabilidade e redução de esforço de upgrade), descontinuação (*Sunset*) do modelo original 3-Tier em favor do **Clean Core Level Concept**, definição detalhada dos 4 níveis (**Nível A:** Released APIs, máxima estabilidade; **Nível B:** Classic APIs maduras como `BAPI_PO_CREATE1` e wrappers; **Nível C:** Internal Objects e monitoramento via *Changelog for SAP Objects*; **Nível D:** Not Clean Core, modificações, implicit enhancements, writes diretos e objetos `noAPI`), a regra do menor denominador comum, configuração de Software Components (`RSMAINTAIN_SWCOMPONENTS`: ABAP Cloud vs ABAP Classic), autorizações de desenvolvedor (`S_ABPLNGVS`, `SACF`, `PFCG`, campo `ABP_LNG_VS`), variantes de checagem do ATC (`ABAP_CLOUD_DEVELOPMENT_DEFAULT`, `ABAP_CLOUD_READINESS` e mapeamento das prioridades 1 a 3 para os níveis A a D), e contratos de liberação no ADT (**C0** - Extend, **C1** - Use System-Internally, visibilidade para Key User ou Cloud Development).

---

## Baterias de Testes

| Nível | Arquivo do Teste | Data | Score Obtido | Status |
| :--- | :--- | :---: | :---: | :---: |
| **Fácil** | [[01_Projects/SAP Certified - Backend Developer - ABAP Cloud/Acquiring Core ABAP Skills/4 - Practicing Clean Core Extensibility for SAP S4HANA Cloud/Modulo 05 - Evaluating Special Considerations for SAP S4HANA Cloud Private Edition and SAP S4HANA/Testes/01 - Teste Nivel Facil\|01 - Teste Nivel Facil]] | 03/11 | % | ⚪ Pendente |
| **Médio** | [[01_Projects/SAP Certified - Backend Developer - ABAP Cloud/Acquiring Core ABAP Skills/4 - Practicing Clean Core Extensibility for SAP S4HANA Cloud/Modulo 05 - Evaluating Special Considerations for SAP S4HANA Cloud Private Edition and SAP S4HANA/Testes/02 - Teste Nivel Medio\|02 - Teste Nivel Medio]] | | % | ⚪ Pendente |
| **Difícil** | [[01_Projects/SAP Certified - Backend Developer - ABAP Cloud/Acquiring Core ABAP Skills/4 - Practicing Clean Core Extensibility for SAP S4HANA Cloud/Modulo 05 - Evaluating Special Considerations for SAP S4HANA Cloud Private Edition and SAP S4HANA/Testes/03 - Teste Nivel Dificil\|03 - Teste Nivel Dificil]] | | % | ⚪ Pendente |
| **Simulado** | [[01_Projects/SAP Certified - Backend Developer - ABAP Cloud/Acquiring Core ABAP Skills/4 - Practicing Clean Core Extensibility for SAP S4HANA Cloud/Modulo 05 - Evaluating Special Considerations for SAP S4HANA Cloud Private Edition and SAP S4HANA/Testes/04 - Simulado Final\|04 - Simulado Final]] | | % | ⚪ Pendente |

---

## Mapa Mental do Módulo

![[Mapa Mental - Modulo 05 - Clean Core Levels.excalidraw]]
