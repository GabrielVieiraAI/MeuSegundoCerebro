---
title: "Medindo o Consumo em Tempo de Execução com o ABAP Profiling"
source: "https://learning.sap.com/courses/deepening-your-abap-programming-knowledge/measuring-runtime-consumption-with-abap-profiling"
created: 2026-11-03
tags:
  - sap
  - abap
  - abap-cloud
  - abap-profiler
  - performance
  - analise-runtime
  - adt
---
**Roteiro de Estudos Relacionado:** [[Roteiro de Estudos SAP]]

# Objetivos

Após concluir esta lição, você será capaz de:
- Explicar os princípios e casos de uso do **ABAP Profiler** no Eclipse ADT (evolução da transação legada `SAT`).
- Configurar e executar sessões de medição em tempo de execução via atalhos e pela visão **ABAP Trace Requests**.
- Compreender o impacto dos diferentes níveis de agregação (*Aggregation*) no tamanho do arquivo de trace e na disponibilidade de ferramentas.
- Interpretar as métricas de tempo bruto (*Gross Time*) e tempo líquido (*Net Time*) na **Hit List**.
- Analisar a hierarquia e o fluxo de execução através da **Call Sequence** e da **Call Timeline**.
- Aplicar o ciclo estruturado de otimização de código baseado em evidências de medição.

---

## 1. O que é o ABAP Profiler?

Ao desenvolver soluções em larga escala para o ecossistema SAP, "adivinhar" onde o código está perdendo desempenho é uma abordagem ineficiente. O **ABAP Profiler** é a ferramenta oficial integrada ao **ABAP Development Tools (ADT)** no Eclipse projetada para realizar a **análise quantitativa de tempo de execução (*Runtime Analysis*)**.

> [!NOTE] Evolução Tecnológica
> No ambiente clássico SAP GUI, a análise de desempenho era conduzida pela transação `SAT` (e antigamente pela `SE30`). No desenvolvimento moderno e no **ABAP Cloud**, o ABAP Profiler substitui essas transações com uma interface rica, visualizações interativas e capacidade de profiling assíncrono.

### As Três Dimensões de Diagnóstico
O Profiler permite dissecar a execução de qualquer aplicação executável (classes com a interface `if_oo_adt_classrun`, programas ou baterias de testes unitários) em 3 frentes:

1. **Performance:** Identificar com precisão de microssegundos quais instruções ou métodos consomem a maior fatia do tempo de CPU e isolar gargalos (*Hot Spots*).
2. **Fluxo do Programa (*Program Flow*):** Visualizar a sequência cronológica exata de chamadas de métodos, detecção de laços iterativos desnecessários ou chamadas recursivas não intencionais.
3. **Acesso ao Banco de Dados (*Database Access*):** Mensurar o percentual de tempo despendido na camada de banco de dados e evidenciar anomalias, como o antipadrão de comandos `SELECT` executados repetidamente dentro de loops (`LOOP AT ... ENDLOOP`).

---

## 2. Como Disparar o Profiling no ADT

Existem duas formas principais de iniciar uma análise de tempo de execução:

### Modo 1: Execução Direta no Editor (Mais Comum)
1. Abra a classe executável ou classe de teste no editor do ADT.
2. Utilize o atalho oficial: `Ctrl + F9`.
3. Ou clique com o botão direito no código $\rightarrow$ **Profile As $\rightarrow$ ABAP Application**.
4. O programa será executado no backend enquanto o ADT grava o arquivo de trace. Ao término, a perspectiva **ABAP Profiling** se abrirá automaticamente.

### Modo 2: Pela Visão *ABAP Trace Requests*
Para cenários onde a execução é disparada por outro usuário, processo em segundo plano (*background job*), serviço OData/RAP ou chamada remota (RFC):
1. Abra a visão **ABAP Trace Requests** no Eclipse (`Window -> Show View -> Other -> ABAP Trace Requests`).
2. Crie uma nova requisição de trace especificando os filtros desejados (nome de usuário, processo ou objeto).
3. Execute o cenário no frontend Fiori ou aplicação externa.
4. O trace capturado ficará disponível na lista da visão para abertura imediata.

---

## 3. Configuração de Parâmetros de Medição

Ao criar ou configurar um trace, dois parâmetros afetam diretamente a qualidade e o volume dos dados coletados:

### Níveis de Agregação (*Aggregation*)
Controla como as chamadas repetidas a um mesmo método ou instrução são computadas no arquivo de trace:

| Nível de Agregação | Detalhamento do Trace | Impacto nas Ferramentas | Tamanho do Arquivo |
| :--- | :--- | :--- | :--- |
| **No Aggregation *(Sem Agregação)*** | **Máximo.** Grava cada chamada individualmente com seu timestamp exato. | **Todas as visões ativas**, incluindo a visualização cronológica exata da **Call Sequence**. | Grande (pode atingir o limite de quota em medições longas). |
| **Partial Aggregation *(Agregação Parcial)*** | **Médio.** Agrupa chamadas idênticas por instrução de origem. | A visão **Call Sequence fica desabilitada**; apenas Hit List e resumos ficam disponíveis. | Médio. |
| **Full Aggregation *(Agregação Total)*** | **Mínimo.** Consolida todas as execuções de um método em uma única linha cumulativa. | Apenas métricas globais e a Hit List básica funcionam. | Muito pequeno. |

> [!TIP] Recomendação Prática de Agregação
> Para a grande maioria das investigações pontuais de desempenho em desenvolvimento, utilize **`No Aggregation`**. Caso o programa processe centenas de milhares de registros e o arquivo estoure o tamanho máximo permitido pelo servidor, utilize **`Partial Aggregation`** ou refine os filtros de medição.

---

## 4. Análise dos Resultados na Perspectiva *ABAP Profiling*

Ao carregar o resultado da medição, o ADT apresenta a perspectiva dividida em ferramentas analíticas essenciais:

### 1. A Visão Hit List (Ponto de Partida Obrigatório)
A **Hit List** lista todas as instruções e métodos executados, ordenados pelo tempo de consumo. Ela apresenta duas métricas cruciais que todo desenvolvedor precisa saber distinguir:

```text
+--------------------------------------------------------------------------+
| Objeto / Método              | Execuções | Gross Time (%) | Net Time (%) |
+--------------------------------------------------------------------------+
| ZCL_PROCESSOR->RUN           | 1         | 95.4 %         | 1.2 %        |
| ZCL_PROCESSOR->CALCULATE     | 50.000    | 88.0 %         | 84.5 %  <--! |
| ZCL_DATABASE_ACCESS->READ    | 1         | 6.2 %          | 6.2 %        |
+--------------------------------------------------------------------------+
```

* **Gross Time *(Tempo Bruto)***: Representa o tempo total gasto na execução de um bloco de código, **somado ao tempo de todos os outros métodos que ele chamou**. Por isso, o método principal de uma aplicação quase sempre tem próximo de 100% de Gross Time.
* **Net Time *(Tempo Líquido)***: Representa o tempo gasto **exclusivamente dentro daquele bloco específico**, desconsiderando as chamadas externas.

> [!IMPORTANT] Regra de Ouro da Otimização
> **Sempre ordene a Hit List pela coluna *Net Time***! O método que possuir o maior tempo líquido é o verdadeiro responsável pelo consumo de CPU da sua aplicação (o gargalo ou *Hot Spot* real).

---

### 2. A Visão Call Sequence / Call Tree (Árvore de Chamadas)
Enquanto a Hit List fornece uma visão estática consolidada, a **Call Sequence** reconstrói a árvore genealógica da execução:
* Mostra a hierarquia: `Método A` $\rightarrow$ chamou `Método B` $\rightarrow$ que chamou o `Método C`.
* Permite descobrir *quem* foi o responsável por disparar aquele método custoso 50.000 vezes dentro de um laço indevido.

### 3. A Visão Call Timeline (Linha do Tempo Visual)
Apresenta um gráfico visual estilo diagrama de Gantt ao longo do tempo (em milissegundos):
* Blocos longos horizontais indicam métodos que prenderam a execução.
* Cores distinguem processamento ABAP puro de tempos de espera de comunicação e acessos a banco de dados.

---

## 5. Metodologia Estruturada de Otimização

A prática profissional de engenharia de software na SAP segue o ciclo de 4 etapas:

1. **Medir (*Measure*):** Execute o Profiler com uma massa de dados realista para estabelecer a linha de base (*baseline*).
2. **Identificar (*Identify*):** Localize na Hit List o método com maior tempo líquido (*Net Time*) ou verifique se o tempo de banco de dados domina a execução.
3. **Refatorar (*Refactor*):**
   - Se o gargalo for em processamento interno: utilize tabelas com chave secundária (*Secondary Keys*) ou tabelas hash/sorted.
   - Se o gargalo for banco de dados: elimine `SELECT` em loop e aplique **Code Pushdown** (agrupando operações em consultas ABAP SQL consolidadas).
4. **Validar (*Verify*):** Execute um novo profiling sob as mesmas condições e compare os resultados matematicamente para comprovar o ganho de performance.

---

## Resumo da Lição

- O **ABAP Profiler** substitui as transações legadas `SAT` e `SE30` no ambiente Eclipse ADT.
- Pode ser disparado instantaneamente pelo atalho `Ctrl + F9` em classes com `if_oo_adt_classrun`.
- A opção de agregação **`No Aggregation`** fornece o nível máximo de detalhes e habilita a visão de sequência de chamadas (**Call Sequence**).
- Na **Hit List**, avalie sempre o **Net Time** (tempo líquido exclusivo) para localizar o verdadeiro gargalo de CPU.
- O ciclo profissional de performance é: Medir $\rightarrow$ Identificar $\rightarrow$ Refatorar $\rightarrow$ Validar.
