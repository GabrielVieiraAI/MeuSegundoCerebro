---
title: "Analisando o Acesso ao Banco de Dados com o SQL Trace"
source: "https://learning.sap.com/courses/deepening-your-abap-programming-knowledge/analyzing-database-access-with-sql-trace"
created: 2026-11-03
tags:
  - sap
  - abap
  - abap-cloud
  - sql-trace
  - st05
  - banco-de-dados
  - sap-hana
  - performance
  - adt
---
**Roteiro de Estudos Relacionado:** [[Roteiro de Estudos SAP]]

# Objetivos

Após concluir esta lição, você será capaz de:
- Explicar a finalidade do **SQL Trace** e identificar o momento correto de utilizá-lo na investigação de desempenho.
- Descrever a transição da transação clássica `ST05` para a integração no Eclipse ADT e no **Technical Monitor Cockpit**.
- Interpretar os dados registrados pelo trace, incluindo a tradução de **ABAP SQL para Native SQL**, durações e contagem de registros.
- Reconhecer o impacto sistêmico do trace de banco de dados e aplicar os cuidados operacionais de ativação.
- Diagnosticar e solucionar os principais antipadrões de banco de dados, como o clássico problema do **N+1 SELECT** e acessos sem índice.

---

## 1. O que é o SQL Trace?

Quando o **ABAP Profiler** aponta que a maior parcela do tempo de resposta de uma aplicação é gasta em *Database Time* (tempo de banco de dados), a ferramenta de análise aprofundada a ser acionada é o **SQL Trace**.

> [!NOTE] Definição e Propósito
> O **SQL Trace** é uma ferramenta de auditoria de baixo nível que intercepta e registra toda a comunicação entre o servidor de aplicação ABAP e o sistema de gerenciamento de banco de dados (SGBD, comumente o **SAP HANA**).

### Do SAP GUI Clássico ao ABAP Cloud / ADT
* No SAP GUI tradicional, essa análise era feita quase que exclusivamente pela transação **`ST05`** (*Performance Trace*).
* No ambiente moderno do **ABAP Development Tools (ADT)** e em sistemas em nuvem (*SAP BTP ABAP Environment* e *SAP S/4HANA Cloud*), o gerenciamento do SQL Trace é disparado a partir do ADT e os relatórios analíticos detalhados são examinados via navegador através do **Technical Monitor Cockpit**.

---

## 2. O que o SQL Trace Permite Inspecionar?

Ao registrar uma sessão de SQL Trace, o desenvolvedor obtém acesso a detalhes técnicos que não são visíveis no editor de código:

### 1. Tradução de ABAP SQL para Native SQL
O desenvolvedor ABAP escreve código utilizando **ABAP SQL** (antigo *Open SQL*), que é independente de banco. O compilador do kernel traduz essa sintaxe para instruções em **Native SQL** específicas do banco de dados (como o dialeto SQL do SAP HANA). O SQL Trace mostra a query real executada pelo banco.

### 2. Duração Exata da Operação no Banco (*Duration*)
Registra o tempo que a consulta demorou para ser processada dentro do motor do SAP HANA (medido em microssegundos), distinguindo tempo de rede e tempo de CPU do banco.

### 3. Registros Acessados vs. Registros Transferidos (*Records Accessed / Transferred*)
Mostra quantas linhas o motor do banco teve que examinar internamente para devolver as linhas requisitadas pelo programa. 
* Se uma query examina 500.000 linhas para devolver apenas 10, há uma grave evidência de ausência de filtros indexados ou varredura de tabela completa (*Full Table Scan*).

### 4. Objeto de Banco e Código de Retorno
Indica qual tabela física, visão de Core Data Services (CDS) ou índice foi consultado, e qual foi o código de retorno da base (`SQL Code` / mapeado para `sy-subrc`).

---

## 3. Características Sistêmicas e Cuidados Operacionais

Diferente de um debugger ou de um teste unitário local, o SQL Trace possui características sistêmicas que exigem cautela:

| Característica | Detalhes e Recomendações |
| :--- | :--- |
| **Escopo Global** | O monitoramento ocorre na camada de conexão com o banco de dados. Qualquer operação disparada no sistema pode ser registrada se os filtros não forem rigorosos. |
| **Monopolização de Sessão** | Em muitos servidores corporativos, **apenas um usuário por vez** tem permissão de manter o SQL Trace ativo, evitando a sobrecarga de escrita em disco. |
| **Impacto de Performance** | Manter o trace ativo continuamente degrada o desempenho do servidor e consome imensas quantidades de espaço de log temporário. |

> [!IMPORTANT] Procedimento Padrão para Execução do Trace
> Siga rigorosamente este ciclo para não impactar o ambiente:
> 1. Prepare todo o cenário da aplicação (deixe as telas prontas ou a requisição formulada).
> 2. **Ative o SQL Trace** com filtro restrito ao seu próprio usuário.
> 3. Execute **imediatamente e apenas** a operação sob teste.
> 4. **Desative o SQL Trace imediatamente** após o término da execução.
> 5. Abra a visão analítica para inspecionar os registros gerados.

---

## 4. Principais Antipadrões Revelados pelo SQL Trace

Ao auditar o log do SQL Trace, você deve procurar imediatamente por quatro sintomas clássicos de código ineficiente:

### 1. O Problema do "N+1 SELECT" (SELECT dentro de LOOP)
É o erro mais destrutivo e recorrente em códigos ABAP legados:
```abap
" ❌ ANTIPADRÃO DETECTADO PELO SQL TRACE:
LOOP AT lt_sales_orders INTO DATA(ls_order).
  SELECT SINGLE customer_name 
    FROM ztcustomer 
    WHERE customer_id = @ls_order-customer_id
    INTO @DATA(lv_name).
ENDLOOP.
```
* **O que o SQL Trace revela:** Milhares de pequenas chamadas individuais `PREPARE`, `OPEN`, `FETCH` e `CLOSE` idênticas, sobrecarregando a camada de rede (*Network Round-Trips*).
* **Solução Moderna:** Substituir por um único comando ABAP SQL com **`INNER JOIN`**, **`LEFT OUTER JOIN`** ou cláusula **`FOR ALL ENTRIES`** (quando os dados já estiverem em tabela interna).

### 2. Full Table Scan (Varredura Completa de Tabela)
O trace revela que uma operação levou segundos para filtrar poucos registros porque as cláusulas `WHERE` não utilizaram campos que compõem a chave primária ou índices secundários da tabela.

### 3. Excesso de Projeção com `SELECT *`
Trazer dezenas de colunas do banco quando o programa utiliza apenas 2 ou 3 campos. Isso força a transferência inútil de dados pela memória do sistema.
* **Solução:** Especifique explicitamente apenas os campos necessários na lista de seleção: `SELECT customer_id, customer_name FROM ...`.

### 4. Falta de Code Pushdown (Processamento de Negócio no Servidor de Aplicação)
Trazer milhões de linhas para o ABAP com a finalidade exclusiva de somar um valor numérico em um laço `LOOP AT`.
* **Solução:** Delegar a conta para o banco de dados utilizando funções de agregação como `SUM()`, `AVG()`, `COUNT()` e cláusulas `GROUP BY` diretamente no comando `SELECT`.

---

## Resumo da Lição

- O **SQL Trace** é utilizado quando a análise de tempo de execução identifica o banco de dados como o principal gargalo de performance.
- Substitui a transação `ST05`, integrando-se ao Eclipse ADT e ao **Technical Monitor Cockpit**.
- Revela a tradução precisa de **ABAP SQL para Native SQL**, a contagem de registros acessados vs. transferidos e o tempo em microssegundos no SAP HANA.
- Possui escopo global: deve ser ativado imediatamente antes da operação e desligado logo em seguida.
- É a principal ferramenta para detectar e exterminar o antipadrão de comandos `SELECT` executados dentro de estruturas de repetição `LOOP`.
