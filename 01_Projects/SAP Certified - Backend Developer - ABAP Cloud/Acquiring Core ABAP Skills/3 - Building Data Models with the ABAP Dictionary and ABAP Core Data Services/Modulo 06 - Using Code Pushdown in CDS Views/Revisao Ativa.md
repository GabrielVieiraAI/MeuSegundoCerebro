---
tipo: revisao-ativa
tags:
  - sap
  - abap
  - abap-cloud
  - revisao-ativa
  - modulo-06
  - cds
  - code-pushdown
  - sql-expressions
  - built-in-functions
  - input-parameters
  - aggregations
modulo: 6
nome_modulo: "Using Code Pushdown in CDS Views"
status: em andamento
score_notebooklm: 0%
data_inicio: 2026-11-03
data_conclusao: 
---
# Caderno de Revisão Ativa: Módulo 6 - Using Code Pushdown in CDS Views

**Revisão Ativa Geral:** [[01_Projects/SAP Certified - Backend Developer - ABAP Cloud/Acquiring Core ABAP Skills/3 - Building Data Models with the ABAP Dictionary and ABAP Core Data Services/00 - Revisão ativa|Revisão Ativa Geral do Curso]]  
**Quiz Oficial SAP:** [[01_Projects/SAP Certified - Backend Developer - ABAP Cloud/Acquiring Core ABAP Skills/3 - Building Data Models with the ABAP Dictionary and ABAP Core Data Services/Modulo 06 - Using Code Pushdown in CDS Views/5 - Quiz|Quiz Oficial do Módulo 6]]

---

## Lições do Módulo (1:1 com Portal SAP)
* [[01_Projects/SAP Certified - Backend Developer - ABAP Cloud/Acquiring Core ABAP Skills/3 - Building Data Models with the ABAP Dictionary and ABAP Core Data Services/Modulo 06 - Using Code Pushdown in CDS Views/1 - Implementing SQL Expressions in CDS Views|1 - Implementing SQL Expressions in CDS Views]]
* [[01_Projects/SAP Certified - Backend Developer - ABAP Cloud/Acquiring Core ABAP Skills/3 - Building Data Models with the ABAP Dictionary and ABAP Core Data Services/Modulo 06 - Using Code Pushdown in CDS Views/2 - Calling Built-in Functions in CDS Views|2 - Calling Built-in Functions in CDS Views]]
* [[01_Projects/SAP Certified - Backend Developer - ABAP Cloud/Acquiring Core ABAP Skills/3 - Building Data Models with the ABAP Dictionary and ABAP Core Data Services/Modulo 06 - Using Code Pushdown in CDS Views/3 - Defining CDS Views with Input Parameters|3 - Defining CDS Views with Input Parameters]]
* [[01_Projects/SAP Certified - Backend Developer - ABAP Cloud/Acquiring Core ABAP Skills/3 - Building Data Models with the ABAP Dictionary and ABAP Core Data Services/Modulo 06 - Using Code Pushdown in CDS Views/4 - Processing Data Sets in CDS Views|4 - Processing Data Sets in CDS Views]]
* [[01_Projects/SAP Certified - Backend Developer - ABAP Cloud/Acquiring Core ABAP Skills/3 - Building Data Models with the ABAP Dictionary and ABAP Core Data Services/Modulo 06 - Using Code Pushdown in CDS Views/5 - Quiz|5 - Quiz: Using Code Pushdown in CDS Views]]

---

## Podcast de Revisão

![[Audio_Modulo_06_Using_Code_Pushdown_in_CDS_Views.m4a]]

---
## Apresentação em Slides (Técnica Feynman)

![[Slides_Modulo_06_Using_Code_Pushdown_in_CDS_Views.pdf]]

---
## Flashcards  

* **Nota de Flashcards:** [[01_Projects/SAP Certified - Backend Developer - ABAP Cloud/Acquiring Core ABAP Skills/3 - Building Data Models with the ABAP Dictionary and ABAP Core Data Services/Flashcards/Flashcards - Modulo 06 - Using Code Pushdown in CDS Views|🗂️ Flashcards - Módulo 06]]
* **Deck no Plugin:** `#flashcards/sap/abap-cloud/modulo-06-code-pushdown`
* **Quantidade de Cartões:** 18 cartões ativos
* **Tópicos Críticos:** Paradigma Code Pushdown no SAP HANA, tipagem de literais no CDS (dígitos puros viram `NUMC`, inteiros adotam menor tipo em bytes, decimais viram `FLTP`), conversões explícitas com `CAST( ... AS abap.tipo )` (proibição de `CONV` no CDS), cast para Data Element e adição `PRESERVING TYPE`, distinções `CASE` simples e complexas, divisão aritmética `/` permitida exclusivamente em ponto flutuante (`FLTP`), escopo de funções integradas (paridade numérica, restrição em funções de data/hora que exigem prefixos como `DATS_*`), função `currency_conversion` com operador `=>` e tipagem estrita de moeda (`abap.cuky`), variáveis de sessão (`$session.*`) e limitações fora do NetWeaver, Parâmetros de Entrada (`WITH PARAMETERS`), acesso via `$parameters.`, posições de operando de parâmetros, passagem em View-on-View (`:`) e em ABAP SQL (`=`), preenchimento automático com `@Environment.systemField: #SYSTEM_DATE`, processamento de conjuntos com `DISTINCT` (colado ao `SELECT`), agregação `AVG` com tipo numérico obrigatório (`AS abap.fltp / abap.dec`), geração automática de `GROUP BY` via Quick Fix (**Ctrl + 1**), sintaxe de `JOIN` (qualificação obrigatória e seletor ponto `.`), regras estritas de `UNION` (anotações permitidas apenas no 1º ramo), e **proibição absoluta de `ORDER BY` em CDS Views**.

---
## Baterias de Testes

| Nível | Arquivo do Teste | Data | Score Obtido | Status |
| :--- | :--- | :---: | :---: | :---: |
| **Fácil** | [[01_Projects/SAP Certified - Backend Developer - ABAP Cloud/Acquiring Core ABAP Skills/3 - Building Data Models with the ABAP Dictionary and ABAP Core Data Services/Modulo 06 - Using Code Pushdown in CDS Views/Testes/01 - Teste Nivel Facil\|01 - Teste Nivel Facil]] | 03/11 | % | ⚪ Pendente |
| **Médio** | [[01_Projects/SAP Certified - Backend Developer - ABAP Cloud/Acquiring Core ABAP Skills/3 - Building Data Models with the ABAP Dictionary and ABAP Core Data Services/Modulo 06 - Using Code Pushdown in CDS Views/Testes/02 - Teste Nivel Medio\|02 - Teste Nivel Medio]] | | % | ⚪ Pendente |
| **Difícil (T1)** | [[01_Projects/SAP Certified - Backend Developer - ABAP Cloud/Acquiring Core ABAP Skills/3 - Building Data Models with the ABAP Dictionary and ABAP Core Data Services/Modulo 06 - Using Code Pushdown in CDS Views/Testes/03 - Teste Nivel Dificil (Tentativa 1)\|03 - Teste Nivel Dificil (T1)]] | | % | ⚪ Pendente |

---
## Mapa Mental (Excalidraw)

* **Mapa Mental Interativo:** [[Mapa Mental - Modulo 06 - Using Code Pushdown in CDS Views.excalidraw|🧠 Abrir Mapa Mental no Excalidraw]]  
  *(Abra no modo Excalidraw para navegar, dar zoom e editar os nós interativamente)*

![[Mapa Mental - Modulo 06 - Using Code Pushdown in CDS Views.excalidraw]]
