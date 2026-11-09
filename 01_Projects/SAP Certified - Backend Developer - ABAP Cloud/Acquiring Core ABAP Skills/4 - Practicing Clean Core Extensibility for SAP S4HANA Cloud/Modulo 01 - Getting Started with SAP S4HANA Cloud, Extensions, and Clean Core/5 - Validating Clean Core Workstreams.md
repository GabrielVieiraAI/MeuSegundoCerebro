---
tipo: clippings
title: "Validating Clean Core Workstreams"
source: "https://learning.sap.com/courses/practicing-clean-core-extensibility-for-sap-s-4hana-cloud/validating-clean-core-workstreams_f7022a5b-f184-44f4-b57c-8554313b1d62"
created: 2026-11-03
tags:
  - sap
  - abap
  - abap-cloud
  - clean-core
  - workstreams
  - evaluate
  - adapt
  - review
  - optimize
---
**Roteiro de Estudos Relacionado:** [[Roteiro de Estudos SAP]]

# Objetivos de Aprendizado

Após concluir esta lição, você será capaz de:
- Avaliar e estruturar as quatro frentes de trabalho (*workstreams*) recomendadas pela SAP para alcançar o Clean Core (*Assess clean core workstreams*).
- Identificar as ferramentas associadas a cada frente de trabalho na jornada de modernização.

---

## 1. O Desafio do Clean Core em Conversões de Sistema

Enquanto uma nova implementação (*New Implementation / Greenfield*) nasce com o Clean Core por padrão, em uma conversão de sistema (*System Conversion / Brownfield*) o sistema herda todo o repositório de código customizado desenvolvido ao longo dos anos.

Para conseguir **tornar o core limpo** (*Get the core clean*) e mantê-lo assim, a SAP recomenda que as equipes de projeto organizem suas atividades em **quatro frentes de trabalho estruturadas (*Clean Core Workstreams*)**:

![[SuggestedCleanCore_Image.png]]

---

## 2. As Quatro Frentes de Trabalho (*Workstreams*) Oficiais da SAP

### 1. Avaliar (*Evaluate*)
- **Objetivo:** Mapear o código customizado existente e determinar quais extensões são realmente utilizadas no dia a dia da operação e quais estão obsoletas.
- **Ferramentas Oficiais:**
  - **ABAP Call Monitor (transação `SCMON`)** ou **Usage and Procedure Logging (UPL)**: Coleta dados de execução real no ambiente de produção.
  - **App Fiori Custom Code Migration (CCM):** Analisa o inventário de código e identifica objetos não utilizados para exclusão sistemática.

### 2. Adaptar (*Adapt*)
- **Objetivo:** Adequar as extensões ativas e necessárias às regras de sintaxe, tipos de dados e novos modelos relacionais do SAP S/4HANA.
- **Abordagens:**
  - **Adaptação Automatizada:** Utilização dos recursos de **Quick Fix** do **ABAP Development Tools (ADT)** no Eclipse (integrado ao **ABAP Test Cockpit - ATC**), corrigindo centenas de apontamentos com um clique.
  - **Adaptação Manual:** Conduzida por desenvolvedores para apontamentos técnicos complexos que exigem redesenho de lógica de negócio guiados pelas Notas SAP (*SAP Notes*).

### 3. Revisar (*Review*)
- **Objetivo:** Conduzir uma auditoria técnica profunda sobre todo o legado de **modificações diretas**, **cópias/clones de programas da SAP**, *implicit enhancements* e sobrescritas de métodos de classes standard.
- **Diretriz Clean Core:** Adotar uma postura de eliminação completa de modificações, classificando os objetos como obsoletos, não utilizados, irrelevantes ou substituíveis pelo modelo moderno de Key User Extensibility.
- **Ferramentas Oficiais:** Transações de ajuste `SPDD`, `SPAU`, `SPAU_ENH` e ferramentas localizadoras de clones (*Clone Finder*).

### 4. Otimizar (*Optimize*)
- **Objetivo:** Assegurar que todo o código customizado mantido aproveite ao máximo o poder do banco de dados em memória SAP HANA, eliminando gargalos de desempenho e consultas SQL ineficientes (*Code Pushdown*).
- **Ferramentas Oficiais:**
  - **SQL Monitor (transação `SQLM`):** Monitora comandos SQL caros e os mapeia de volta ao código-fonte ABAP no ambiente de produção.
  - **SQL Trace (transação `ST05`):** Análise detalhada de comandos SQL individuais em tempo de execução.
  - **Performance Monitor e ATC Performance Checks.**

---

## 3. Matriz de Frentes de Trabalho Clean Core

| Workstream | Propósito Principal | Ferramentas Principais | Meta Clean Core |
| :--- | :--- | :--- | :--- |
| **1. Evaluate** | Identificar código não utilizado e mapear escopo de migração | `SCMON`, `UPL`, `SUSG`, App Fiori Custom Code Migration | Eliminar "código zumbi" antes da conversão |
| **2. Adapt** | Corrigir incompatibilidades funcionais e de sintaxe do S/4HANA | ADT Quick Fixes, ATC (`S4HANA_READINESS`), SAP Readiness Check | Código customizado 100% funcional no S/4HANA |
| **3. Review** | Eliminar modificações legadas, clones e *implicit enhancements* | `SPAU`, `SPDD`, `SPAU_ENH`, *Clone Finder* | Política de Zero Modificações (*Zero Modifications*) |
| **4. Optimize** | Analisar e acelerar o desempenho de queries no SAP HANA | `SQLM`, `ST05`, ATC Performance Checks | Execução enxuta aproveitando a arquitetura in-memory |
