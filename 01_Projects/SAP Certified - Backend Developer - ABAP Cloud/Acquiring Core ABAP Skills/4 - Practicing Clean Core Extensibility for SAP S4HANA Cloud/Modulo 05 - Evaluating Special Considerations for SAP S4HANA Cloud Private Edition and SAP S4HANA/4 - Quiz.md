---
tipo: clippings
title: "Quiz - Evaluating Special Considerations for SAP S/4HANA Cloud Private Edition and SAP S/4HANA"
source: "https://learning.sap.com/courses/practicing-clean-core-extensibility-for-sap-s-4hana-cloud/evaluating-special-considerations-for-sap-s-4hana-cloud-private-edition-and-sap-s-4hana_27a9eaaa-b2ca-3c33-bd2c-335bda2744fb"
created: 2026-11-03
tags:
  - sap
  - abap
  - clean-core
  - private-edition
  - on-premise
  - quiz
  - certifiacao
---
**Roteiro de Estudos Relacionado:** [[Roteiro de Estudos SAP]]

# Avaliação do Módulo 05: Private Edition, On-Premise & Clean Core Levels

Teste seus conhecimentos sobre as considerações especiais para o **SAP S/4HANA Cloud Private Edition** e ambientes locais, a governança do **Clean Core Level Concept (Níveis A a D)**, autorizações via **`S_ABPLNGVS`** e auditoria estática com o **ABAP Test Cockpit (ATC)**.

---

### Questão 1
Which of the following does clean core extensibility level B apply to?
*(Selecione 2 respostas corretas)*

- [ ] A) SAP S/4HANA Cloud Public Edition
- [ ] B) SAP S/4HANA Cloud Private Edition
- [ ] C) SAP S/4HANA
- [ ] D) SAP BTP, ABAP environment

> [!success]- Gabarito e Explicação Oficial da SAP
> **Respostas Corretas: B, C**
> 
> O **Clean Core Extensibility Level B (Uso de Classic APIs maduras e wrappers)** aplica-se exclusivamente ao **SAP S/4HANA Cloud Private Edition** e ao **SAP S/4HANA (On-Premise)**. 
> No **SAP S/4HANA Cloud Public Edition** e no **SAP BTP, ABAP Environment**, apenas o **Nível A (Released APIs sob o modelo ABAP Cloud)** é suportado e permitido pelo compilador da plataforma.

---

### Questão 2
Which of the following does the term "Released APIs" refer to?
*(Selecione 1 resposta correta)*

- [ ] A) Level A
- [ ] B) Level B
- [ ] C) Level C
- [ ] D) Level D

> [!success]- Gabarito e Explicação Oficial da SAP
> **Resposta Correta: A**
> 
> Na metodologia do **Clean Core Level Concept**, o termo **Released APIs** é o fundamento definidor do **Level A (Nível A)**. 
> Esse nível garante o padrão ouro de qualidade, compatibilidade total com o modelo ABAP Cloud e sustentabilidade absoluta para atualizações de versão sem quebras (*Release Stability*).

---

### Questão 3
Which of the following would "Internal Objects" fall under?
*(Selecione 1 resposta correta)*

- [ ] A) Level A
- [ ] B) Level B
- [ ] C) Level C
- [ ] D) Level D

> [!success]- Gabarito e Explicação Oficial da SAP
> **Resposta Correta: C**
> 
> O uso de **Internal Objects** (artefatos internos da SAP não catalogados como Classic APIs e sem contrato de liberação, como módulos de função internos ou leituras diretas via SQL em tabelas de sistema) enquadra-se no **Level C (Nível C)**. 
> Esse nível apresenta risco moderado/gerenciável e deve ser monitorado ativamente por meio do **Changelog for SAP Objects** e checagens periódicas no **ABAP Test Cockpit (ATC)**.
