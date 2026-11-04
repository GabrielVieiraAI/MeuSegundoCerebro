---
tipo: clippings
title: "Quiz: Getting Started with SAP S4HANA Cloud, Extensions, and Clean Core"
source: "https://learning.sap.com/courses/practicing-clean-core-extensibility-for-sap-s-4hana-cloud/getting-started-with-sap-s-4hana-cloud-extensions-and-clean-core_bff91eba-c2a3-3836-a939-8a3c8cb58060"
created: 2026-11-03
tags:
  - sap
  - abap
  - abap-cloud
  - quiz
  - clean-core
  - system-conversion
  - extensibility
---
**Roteiro de Estudos Relacionado:** [[Roteiro de Estudos SAP]]

# SAP Learning - Practicing Clean Core Extensibility for SAP S4HANA Cloud
## Quiz Oficial: Getting Started with SAP S4HANA Cloud, Extensions, and Clean Core

> [!NOTE] Instruções de Estudo Ativo
> Tente responder a cada uma das questões mentalmente ou registrando suas opções antes de expandir o bloco retrátil de **Gabarito e Explicação Oficial da SAP**.

---

### Pergunta 1
**Quais das seguintes ferramentas podem ser utilizadas para coletar dados de uso de código customizado (*custom code usage data*)?**  
*(Selecione todas as opções corretas - Múltipla Escolha - 2 respostas corretas)*

- **A.** Usage and procedure logging (UPL)
- **B.** Custom Code Migration app
- **C.** ABAP call monitor (`SCMON`)
- **D.** ABAP development tools for Eclipse Quick Fix

> [!success]- Gabarito e Explicação Oficial da SAP
> **Respostas Corretas:** **A e C**  
> 
> **Fundamentação Oficial da SAP:**  
> As seguintes ferramentas podem ser utilizadas para coletar dados de uso de código customizado: **Usage and procedure logging (UPL)** e **ABAP call monitor (`SCMON`)**.  
> O app *Custom Code Migration* é utilizado para analisar esses dados de uso e determinar o escopo de migração, enquanto os *Quick Fixes* do ADT servem para adaptar e corrigir o código de forma automatizada.

---

### Pergunta 2
**A quais das seguintes camadas da pilha (*stack layers*) a extensibilidade clássica se refere?**  
*(Selecione todas as opções corretas - Múltipla Escolha - 3 respostas corretas)*

- **A.** Visual
- **B.** Data
- **C.** Key User
- **D.** Middle

> [!success]- Gabarito e Explicação Oficial da SAP
> **Respostas Corretas:** **A, B e D**  
> 
> **Fundamentação Oficial da SAP:**  
> As camadas da pilha (*stack layers*) às quais a extensibilidade clássica se refere são: **visual** (telas e menus via *screen/menu exits*), **data** (estruturas de dados e tabelas via *table appends*) e **middle** (camada intermediária de código via *code exits* como User Exits e BAdIs).  
> A *Key User Extensibility* é um conceito moderno do SAP S4HANA Cloud, não pertencente ao modelo clássico.

---

### Pergunta 3
**Quais das seguintes alternativas são partes fundamentais do conceito de Clean Core?**  
*(Selecione todas as opções corretas - Múltipla Escolha - 3 respostas corretas)*

- **A.** Separação estrita entre as extensões e a aplicação subjacente (*Strict separation between extensions and the underlying application*)
- **B.** Utilização de APIs liberadas (*Usage of released APIs*)
- **C.** Eliminação de modificações (*Elimination of modifications*)
- **D.** Cópia (isto é, clonagem) de código standard em vez de modificações (*Copying of standard code in lieu of modifications*)

> [!success]- Gabarito e Explicação Oficial da SAP
> **Respostas Corretas:** **A, B e C**  
> 
> **Fundamentação Oficial da SAP:**  
> As partes fundamentais do conceito de Clean Core incluem: separação estrita entre as extensões e a aplicação subjacente da SAP, uso exclusivo de APIs liberadas com contratos estáveis para upgrades e eliminação completa de modificações diretas.  
> A clonagem (cópia) de código standard é uma forma de modificação indireta fortemente contraindicada pelo Clean Core.

---

### Pergunta 4
**Quais das seguintes ferramentas podem ser utilizadas para analisar a performance de comandos SQL individuais?**  
*(Selecione todas as opções corretas - Múltipla Escolha - 2 respostas corretas)*

- **A.** ABAP test cockpit (ATC) como parte do ABAP development tools for Eclipse
- **B.** SQL Trace (`ST05`)
- **C.** SQL Monitor (`SQLM`)
- **D.** ABAP call monitor (`SCMON`)

> [!success]- Gabarito e Explicação Oficial da SAP
> **Respostas Corretas:** **B e C**  
> 
> **Fundamentação Oficial da SAP:**  
> O **SQL Trace (`ST05`)** e o **SQL Monitor (`SQLM`)** podem ser utilizados para analisar o desempenho de instruções SQL individuais.  
> O *SQL Monitor* identifica comandos caros em execução de produção agregando-os por chamada ABAP, e o *SQL Trace* inspeciona instruções pontuais detalhando parâmetros e planos de execução. O *ABAP call monitor* monitora apenas a execução de blocos de rotinas ABAP, não queries SQL.

---

### Pergunta 5
**Quais das seguintes alternativas são frentes de trabalho recomendadas do Clean Core (*clean core workstreams*)?**  
*(Selecione todas as opções corretas - Múltipla Escolha - 3 respostas corretas)*

- **A.** Avaliação de código customizado (*Custom code evaluation*)
- **B.** Adaptação de código customizado (*Custom code adaptation*)
- **C.** Simplification item checks
- **D.** Revisão de cópias e modificações (*Review of copies*)

> [!success]- Gabarito e Explicação Oficial da SAP
> **Respostas Corretas:** **A, B e D**  
> 
> **Fundamentação Oficial da SAP:**  
> As quatro frentes de trabalho recomendadas do Clean Core pós-conversão técnica são: **Avaliar (*Custom code evaluation*)**, **Adaptar (*Custom code adaptation*)**, **Revisar (*Review of copies and modifications*)** e **Otimizar (*Performance optimization*)**.  
> O *Simplification item check* é uma etapa de preparação técnica pré-conversão, não uma das quatro frentes de governança do Clean Core.

---

### Pergunta 6
**Quais das seguintes alternativas representam as três possibilidades que um cliente possui para implementar o SAP S/4HANA?**  
*(Selecione todas as opções corretas - Múltipla Escolha - 3 respostas corretas)*

- **A.** Nova implementação (*New implementation / Greenfield*)
- **B.** Nuvem de terceiros (*Third-party cloud*)
- **C.** Conversão de sistema (*System conversion / Brownfield*)
- **D.** Transformação de paisagem do sistema (*System landscape transformation*)

> [!success]- Gabarito e Explicação Oficial da SAP
> **Respostas Corretas:** **A, C e D**  
> 
> **Fundamentação Oficial da SAP:**  
> Para implementar o SAP S/4HANA, as três possibilidades de transição técnica são: **Nova implementação (*New implementation*)**, **Conversão de sistema (*System conversion*)** ou **Transformação de paisagem do sistema (*System landscape transformation / Selective Data Transition*)**.

---

### Pergunta 7
**Quais das seguintes opções são tipos de modificações indiretas (*indirect modifications*)?**  
*(Selecione todas as opções corretas - Múltipla Escolha - 3 respostas corretas)*

- **A.** Clones de objetos da SAP (*Clones of SAP objects*)
- **B.** Ampliações implícitas (*Implicit enhancements*)
- **C.** Sobrescrita de métodos de classe (*Class method overwrites*)
- **D.** Alterações em conformidade com uma Nota SAP (*Changes pursuant to an SAP Note*)

> [!success]- Gabarito e Explicação Oficial da SAP
> **Respostas Corretas:** **A, B e C**  
> 
> **Fundamentação Oficial da SAP:**  
> Clones de objetos SAP (cópias para o namespace Z), ampliações implícitas (*implicit enhancements* no início ou fim de blocos) e sobrescritas de métodos de classe standard são exemplos clássicos de modificações indiretas.  
> Alterações manuais guiadas por uma Nota SAP em objetos standard são classificadas como modificações diretas (*direct modifications*).

---

### Pergunta 8
**Quais das seguintes alternativas são motivos pelos quais as extensões de software são necessárias?**  
*(Selecione todas as opções corretas - Múltipla Escolha - 3 respostas corretas)*

- **A.** Otimização de performance (*Performance optimization*)
- **B.** Obtenção de resultados desejados pelo cliente (*Desired customer outcomes*)
- **C.** Processos de negócio customizados e diferenciados (*Customized business processes*)
- **D.** Flexibilidade (*Flexibility*)

> [!success]- Gabarito e Explicação Oficial da SAP
> **Respostas Corretas:** **B, C e D**  
> 
> **Fundamentação Oficial da SAP:**  
> Extensões de software são necessárias para atender aos resultados desejados pelos clientes, permitir processos de negócio customizados que trazem diferenciais competitivos e fornecer flexibilidade de ajuste sobre o escopo entregue.  
> Otimização de performance é uma prática de qualidade técnica do código, não a razão de existência de uma extensão funcional.

---

### Pergunta 9
**Quais dos seguintes fatores devem ser considerados ao escolher entre uma conversão de sistema (*System Conversion*) e uma nova implementação (*New Implementation*)?**  
*(Selecione todas as opções corretas - Múltipla Escolha - 3 respostas corretas)*

- **A.** Patrocínio executivo (*Sponsorship*)
- **B.** Herança (*Inheritance*)
- **C.** Dados transacionais e histórico (*Transactional Data*)
- **D.** Interfaces e integrações (*Interfaces*)

> [!success]- Gabarito e Explicação Oficial da SAP
> **Respostas Corretas:** **A, C e D**  
> 
> **Fundamentação Oficial da SAP:**  
> Ao decidir entre conversão de sistema e nova implementação, a liderança deve considerar: **patrocínio executivo (*Sponsorship*)**, necessidade de retenção de **dados transacionais históricos (*Transactional Data*)** e o impacto na malha de **interfaces (*Interfaces*)**.  
> "Herança" (*Inheritance*) é um conceito de programação orientada a objetos, não um critério de decisão de migração de ERP.

---

### Pergunta 10
**Durante a fase de Preparação (*Preparation phase*) de uma conversão de sistema, quais das seguintes tarefas são executadas?**  
*(Selecione todas as opções corretas - Múltipla Escolha - 3 respostas corretas)*

- **A.** Executar a adaptação do código customizado (*Perform custom code adaptation*)
- **B.** Determinar os requisitos do sistema (*Determine system requirements*)
- **C.** Utilizar o planejamento de manutenção (*Utilize maintenance planning*)
- **D.** Realizar a análise de código customizado (*Perform custom code analysis*)

> [!success]- Gabarito e Explicação Oficial da SAP
> **Respostas Corretas:** **B, C e D**  
> 
> **Fundamentação Oficial da SAP:**  
> Durante a fase de Preparação de uma conversão de sistema, realizam-se a determinação dos requisitos de sistema, o planejamento de manutenção no **Maintenance Planner** e a **análise de código customizado** via ATC (`S4HANA_READINESS`).  
> A execução da adaptação do código customizado é conduzida primariamente na fase de Realização / Pós-conversão.
