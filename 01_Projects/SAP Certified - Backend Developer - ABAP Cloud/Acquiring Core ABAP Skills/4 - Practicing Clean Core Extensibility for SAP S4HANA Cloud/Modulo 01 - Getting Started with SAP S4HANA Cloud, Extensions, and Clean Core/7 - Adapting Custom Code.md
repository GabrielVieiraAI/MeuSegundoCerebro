---
tipo: clippings
title: "Adapting Custom Code"
source: "https://learning.sap.com/courses/practicing-clean-core-extensibility-for-sap-s-4hana-cloud/adapting-custom-code_bc14533d-afca-497f-9924-d6457822f2e3"
created: 2026-11-03
tags:
  - sap
  - abap
  - abap-cloud
  - custom-code-adaptation
  - quick-fix
  - adt
  - retrofit
  - clean-core
---
**Roteiro de Estudos Relacionado:** [[Roteiro de Estudos SAP]]

# Objetivos de Aprendizado

Após concluir esta lição, você será capaz de:
- Compreender por que a adaptação de código customizado é necessária na transição para o SAP S/4HANA.
- Distinguir e aplicar a **adaptação automatizada (*Automated Adaptation*)** via Quick Fixes do ADT e a **adaptação manual (*Manual Adaptation*)**.
- Resolver o dilema de sincronização de código entre o ambiente Sandbox de teste e o ambiente produtivo utilizando o recurso de **Retrofit**.

---

## 1. Por que Adaptar o Código Customizado?

A frente de trabalho de **Adaptação de Código Customizado (*Custom Code Adaptation*)** existe devido a mudanças profundas na base técnica do SAP S/4HANA:
- **Simplificação do Modelo de Dados:** Eliminação de tabelas agregadas históricas (ex: tabelas financeiras `GLT0`, `KNC1`, `LFC1`), substituídas por CDS Views de compatibilidade ou pela tabela universal `ACDOCA`.
- **Extensão de Comprimento de Campos:** Aumento de campos estruturais, como o número do material (`MATNR`) de 18 para 40 caracteres alfanuméricos.
- **Diferenças de Sintaxe no Banco de Dados:** Instruções SQL que dependiam do comportamento implícito de bancos relacionais antigos (como ausência de cláusula `ORDER BY` explícita gerando ordenação arbitrária) precisam ser ajustadas para o SAP HANA.

As extensões ativas que a empresa decidiu manter precisam passar por um processo formal de adaptação.

![[Transition_to_SAP_S4HANA_005.png]]

---

## 2. O Dilema do Sandbox e a Sincronização de Código

Na preparação para a conversão, a equipe de projeto cria uma cópia fiel da produção em um ambiente **Sandbox** para testar os passos de conversão e realizar as adaptações de código customizado.

No entanto, surge uma complicação natural: enquanto o projeto de migração dura vários meses no Sandbox, o ambiente de produção do SAP ERP continua vivo e ativo, recebendo manutenções corretivas diárias, chamados de sustentação e mudanças fiscais urgentes.

Quando o projeto atinge o momento da conversão real da produção, existe uma defasagem técnica (*gap*) entre o código adaptado no Sandbox e a produção real.

A SAP analisa três possíveis caminhos para lidar com esse problema:

| Opção Analisada | Como Funciona | Avaliação Técnica da SAP |
| :--- | :--- | :--- |
| **1. Congelamento de Desenvolvimento (*Development Freeze*)** | Interromper completamente qualquer alteração de código ou manutenção no SAP ERP legado até o fim do projeto. | **Inviável para o negócio.** A área de negócios e os usuários não podem ficar meses sem correções críticas ou exigências legais. |
| **2. Trabalho Duplo (*Double Work*)** | Refazer manualmente todo o trabalho de adaptação de código no novo ambiente produtivo durante a janela de conversão. | **Arriscado e custoso.** Altíssima probabilidade de erros humanos e aumento no tempo de indisponibilidade. |
| **3. Sincronização via Retrofit (*Solution Manager Retrofit*)** | Utilizar a funcionalidade de **Retrofit** do **SAP Solution Manager** (versão 7.2 Ehp 8 ou superior) para gerenciar o transporte e sincronização automática das ordens. | **Abordagem recomendada e preferida pela SAP.** Garante que qualquer manutenção feita no legado seja incorporada ao ambiente de conversão com rastreabilidade total. |

---

## 3. Adaptação Automatizada de Código (*Automated Adaptation*)

A abordagem automatizada aproveita a inteligência do compilador e do verificador de qualidade da SAP:
- As análises do **App Fiori Custom Code Migration** e do **ABAP Test Cockpit (ATC)** no Eclipse comunicam-se nativamente.
- O desenvolvedor abre os resultados do ATC dentro do **ABAP Development Tools (ADT)** no Eclipse.
- O recurso oficial **Quick Fix (Ctrl + 1)** detecta automaticamente incompatibilidades sintáticas e semânticas conhecidas e propõe a correção instantânea (inclusive em lote com *Mass Quick Fix*).

### Exemplos Típicos Corrigidos via Quick Fix Automático:
1. Declarações e referências a tabelas do dicionário que foram substituídas por CDS Views de compatibilidade.
2. Inclusão obrigatória de cláusula `ORDER BY` em comandos `SELECT` onde a lógica de negócio dependia de ordenação física de registros no disco.
3. Ajustes de tipos de dados para campos de comprimento estendido (como extensões de domínios e estruturas associadas a materiais).

---

## 4. Adaptação Manual de Código (*Manual Adaptation*)

Códigos com desvios arquiteturais profundos que não possuem uma regra de substituição unívoca devem ser adaptados manualmente por desenvolvedores.

A SAP recomenda estruturar esse esforço com o seguinte processo:
1. **Utilizar o SAP Readiness Check:** O relatório gera a lista completa das **Notas SAP (*SAP Notes*)** mandatórias que explicam o impacto funcional de cada objeto de simplificação.
2. **Triagem Técnica vs Funcional:** Separar as Notas SAP entre correções puramente técnicas de sintaxe ABAP e alterações que demandam especialistas nos processos de negócio da aplicação (ex: finanças, compras, faturamento).
3. **Especialização de Desenvolvedores:** Alocar desenvolvedores dedicados a padrões específicos de Notas SAP, aumentando a velocidade e reduzindo curvas de aprendizado.
4. **Estimativas por Faixas (*Time Ranges*):** Definir prazos por faixas estimadas de esforço (em vez de prazos pontuais e inflexíveis), dada a complexidade inerente de depurar código legado de terceiros.
