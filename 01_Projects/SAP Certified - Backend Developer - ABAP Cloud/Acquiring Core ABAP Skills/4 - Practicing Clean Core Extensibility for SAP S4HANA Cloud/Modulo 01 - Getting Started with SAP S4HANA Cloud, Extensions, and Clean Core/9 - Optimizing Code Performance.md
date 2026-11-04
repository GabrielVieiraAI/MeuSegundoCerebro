---
tipo: clippings
title: "Optimizing Code Performance"
source: "https://learning.sap.com/courses/practicing-clean-core-extensibility-for-sap-s-4hana-cloud/optimizing-code-performance_f546330d-6c06-46d4-a3f9-36b5b3d09234"
created: 2026-11-03
tags:
  - sap
  - abap
  - abap-cloud
  - sql-monitor
  - sqlm
  - st05
  - sql-trace
  - performance-optimization
  - clean-core
---
**Roteiro de Estudos Relacionado:** [[Roteiro de Estudos SAP]]

# Objetivos de Aprendizado

Após concluir esta lição, você será capaz de:
- Descrever a função e a aplicação do **SQL Monitor (`SQLM`)** (*Describe the SQL monitor tool*).
- Distinguir entre o monitoramento amplo de consultas do **SQL Monitor** e a inspeção pontual do **SQL Trace (`ST05`)**.
- Utilizar verificações de desempenho no **ABAP Test Cockpit (ATC)**.

---

## 1. Otimização de Performance no Clean Core

A quarta e última frente de trabalho oficial do Clean Core é a **Otimização de Performance (*Performance Optimization*)**.

Não basta apenas adaptar sintaticamente o código legado para que ele compile e rode sem erros (*dump*). O código customizado que foi retido após a conversão precisa ser otimizado para tirar proveito pleno da arquitetura de processamento massivo em memória (*In-Memory Computing*) e colunar do **SAP HANA**.

![[Transition_to_SAP_S4HANA_007.png]]

---

## 2. O Arsenal de Ferramentas de Análise de Desempenho

A SAP disponibiliza ferramentas complementares para diagnóstico estático e dinâmico de performance:

### 1. ABAP Test Cockpit (ATC) - Verificações Estáticas de Performance
Integrado ao **ABAP Development Tools (ADT)** no Eclipse:
- Analisa o código estaticamente antes mesmo de ele ser executado.
- Identifica más práticas consagradas de codificação ABAP, tais como:
  - Comandos `SELECT` executados repetidamente no interior de loops (`LOOP AT ... ENDLOOP`).
  - Consultas com `SELECT *` sem necessidade em tabelas de grande volume.
  - Comandos que transferem grandes volumes de dados brutos para a camada de aplicação em vez de delegar agregações e filtros para o banco de dados (*Code Pushdown*).

### 2. SQL Monitor (Transação `SQLM`) - Monitoramento Dinâmico em Produção
O **SQL Monitor** é uma das ferramentas mais avançadas da plataforma ABAP para diagnóstico de banco de dados:
- Executa continuamente em ambiente de **produção** com overhead praticamente nulo (desprezível para a carga operacional).
- Monitora e quantifica todas as instruções SQL executadas no sistema, registrando:
  - Tempo total e tempo médio de execução no banco de dados.
  - Número de execuções acumuladas.
  - Quantidade de registros transferidos.
- **Diferencial Crítico:** O SQL Monitor vincula de forma transparente cada consulta SQL diretamente ao **objeto de desenvolvimento ABAP responsável** (programa, classe, método ou função) e à linha de código exata da chamada.
- Permite que os desenvolvedores foquem seus esforços de otimização nas consultas que realmente têm o maior impacto acumulado sobre o sistema (o princípio de Pareto).

### 3. SQL Trace (Transação `ST05`) - Inspeção Pontual Detalhada
Enquanto o `SQLM` fornece uma visão macro e contínua do sistema como um todo, o **SQL Trace (`ST05`)** é uma ferramenta de inspeção cirúrgica:
- O desenvolvedor ou administrador ativa o trace para uma transação ou usuário específico em tempo real.
- Captura cada instrução SQL individual com todos os seus parâmetros reais preenchidos, tempos de resposta ao nível de microssegundos e códigos de retorno (`sy-subrc`).
- Permite exibir o **Plano de Execução (*Explain Plan / Execution Plan*)** detalhado do SAP HANA, revelando exatamente se o otimizador realizou varreduras completas (*Table Scans*) ou aproveitou índices e filtros de partição.

---

## 3. Comparativo entre as Ferramentas de Performance

| Recurso | ABAP Test Cockpit (ATC) | SQL Monitor (`SQLM`) | SQL Trace (`ST05`) |
| :--- | :--- | :--- | :--- |
| **Tipo de Análise** | Estática (análise do código-fonte) | Dinâmica contínua (estatísticas de runtime) | Dinâmica pontual (sessão específica) |
| **Ambiente de Uso** | Desenvolvimento / QA | Produção (em regime 24/7) | Qualquer ambiente durante teste dirigido |
| **Escopo** | Padrões de código e regras de sintaxe | Todas as queries de todos os usuários | Instruções disparadas em um intervalo delimitado |
| **Mapeamento ABAP** | Aponta o arquivo e linha no ADT | Mapeia query ao método/programa ABAP exato | Mostra call stack da instrução tracejada |
