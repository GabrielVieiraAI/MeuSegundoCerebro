---
title: "Melhorando a Performance de Tabelas Internas com Chaves Secundárias"
source: "https://learning.sap.com/courses/deepening-your-abap-programming-knowledge/improving-internal-table-performance-using-secondary-keys"
created: 2026-11-03
tags:
  - sap
  - abap
  - abap-cloud
  - tabelas-internas
  - secondary-keys
  - lazy-evaluation
  - performance
---
**Roteiro de Estudos Relacionado:** [[Roteiro de Estudos SAP]]

# Objetivos

Após concluir esta lição, você será capaz de:
- Explicar a finalidade e a mecânica das **Chaves Secundárias (*Secondary Table Keys*)** em tabelas internas.
- Diferenciar chaves secundárias do tipo **Sorted Key** e **Hashed Key**.
- Compreender os diferentes comportamentos de manutenção do índice: **Avaliação Tardia (*Lazy Evaluation*)** para chaves não únicas vs. **Avaliação Imediata (*Eager Evaluation*)** para chaves únicas.
- Declarar e utilizar chaves secundárias em instruções `READ TABLE`, laços `LOOP AT` e Expressões de Tabela modernas (`USING KEY`).
- Avaliar a relação custo-benefício de consumo de memória vs. ganho de tempo de processamento antes de criar chaves secundárias.

---

## 1. O Problema dos Múltiplos Critérios de Busca

Imagine uma tabela interna com 100.000 ordens de venda. Sua chave primária é o número do documento (`vbeln`). Ela foi declarada como `SORTED TABLE` pela chave primária, garantindo leituras ultrarrápidas $O(\log N)$ quando buscada pelo número do pedido.

Porém, em determinada etapa do programa, você precisa consultar pedidos repetidamente pelo **código do cliente (`kunnr`)**. 
* Como a tabela não está ordenada por cliente, uma busca por cliente forçará o sistema a fazer uma **varredura linear custosa $O(N)$**.
* No passado, a solução era ordenar a tabela (`SORT lt_vendas BY kunnr`), fazer as buscas com `BINARY SEARCH` e depois reordená-la pelo pedido. Esse reordenamento contínuo em loops destruía a performance do sistema!

> [!NOTE] A Solução Moderna: Chaves Secundárias
> Assim como tabelas de banco de dados possuem índices secundários, tabelas internas ABAP podem ter **uma ou mais chaves secundárias declaradas**. A tabela mantém sua organização primária intacta, enquanto índices auxiliares em memória aceleram buscas por outros campos.

---

## 2. Tipos de Chaves Secundárias

Chaves secundárias podem ser associadas a **qualquer categoria** de tabela interna (`STANDARD`, `SORTED` ou `HASHED`):

1. **Sorted Secondary Key:**
   * Constrói um subíndice ordenado em árvore B*.
   * Pode ser declarada como única (`UNIQUE`) ou não única (`NON-UNIQUE`).
   * Permite buscas logarítmicas $O(\log N)$ e iterações parciais por chave.
2. **Hashed Secondary Key:**
   * Constrói uma tabela hash auxiliar em memória.
   * **Deve ser estritamente única (`UNIQUE`)**.
   * Garante tempo constante de busca **$O(1)$** para consultas pontuais pela chave secundária completa.

---

## 3. Comportamento do Sistema: Lazy Evaluation vs. Eager Evaluation

O kernel do ABAP adota estratégias distintas para a construção e manutenção dos índices secundários:

### A. Chaves Secundárias Não Únicas (*Lazy Evaluation / Avaliação Tardia*)
* **Criação sob Demanda:** Quando a tabela interna é carregada com milhares de registros pelo comando `SELECT`, o índice da chave secundária não única **NÃO é construído imediatamente**.
* **Primeiro Acesso:** O índice é gerado exclusivamente na primeira vez em que uma instrução do programa acessa a tabela utilizando expressamente aquela chave secundária.
* **Custo:** A primeira leitura sofre uma pequena penalidade de tempo para construir o índice; todas as leituras subsequentes tornam-se ultrarrápidas.
* **Atualizações:** Se novos registros forem inseridos na tabela, o índice é apenas marcado como "desatualizado" e ressicronizado de forma postergada no próximo acesso.

### B. Chaves Secundárias Únicas (*Eager Evaluation / Avaliação Imediata*)
* **Manutenção Contínua:** Como o sistema precisa assegurar em tempo de execução que não existam registros duplicados para a combinação de campos, o índice secundário **é mantido permanentemente atualizado**.
* **Custo em Escritas:** Qualquer operação de modificação na tabela (`INSERT`, `APPEND`, `MODIFY`, `DELETE`) atualiza imediatamente o índice secundário único. As leituras são sempre instantâneas.

---

## 4. Sintaxe e Exemplos de Implementação

### Declaração da Tabela com Chave Secundária
```abap
DATA lt_flights TYPE STANDARD TABLE OF /lrn/flight
  WITH NON-UNIQUE KEY carrid connid fldate           " Chave Primária
  WITH NON-UNIQUE SORTED KEY by_plane               " Chave Secundária
    COMPONENTS planetype seatsmax.
```

---

### Utilizando a Chave Secundária no Código

#### 1. Em Expressões de Tabela Modernas
```abap
" Busca utilizando explicitamente a chave secundária 'by_plane':
DATA(ls_flight) = lt_flights[ KEY by_plane 
                              COMPONENTS planetype = '747-400' 
                                         seatsmax  = 400 ].
```

#### 2. Em Laços `LOOP AT` Ordenados por Chave Alternativa
Você pode iterar sobre a tabela na sequência exata da chave secundária, sem precisar executar o comando `SORT`:
```abap
LOOP AT lt_flights USING KEY by_plane 
  WHERE planetype = 'A380' 
  ASSIGNING FIELD-SYMBOL(<fs_flight>).
  " Processamento ordenado por tipo de aeronave e capacidade...
ENDLOOP.
```

#### 3. Na Instrução Clássica `READ TABLE`
```abap
READ TABLE lt_flights 
  USING KEY by_plane 
  WITH TABLE KEY by_plane 
  COMPONENTS planetype = '747-400' 
             seatsmax  = 400 
  ASSIGNING FIELD-SYMBOL(<fs_found>).
```

---

## 5. Boas Práticas e Custos de Memória

Embora acelerem pesquisas consideravelmente, chaves secundárias não devem ser criadas indiscriminadamente:

1. **Overhead de Memória:** Cada chave secundária consome memória RAM adicional para manter os nós de árvore ou tabelas de hash associadas aos ponteiros das linhas.
2. **Impacto em Inserções Massivas:** Tabelas que sofrem constantes inserções linha a linha pagam o preço de atualização do índice a cada registro adicionado.
3. **Regra Prática da SAP:** Crie chaves secundárias exclusivamente para tabelas internas de médio a grande porte que sejam submetidas a **múltiplas leituras repetitivas por chaves alternativas** ao longo do ciclo de vida da transação.

---

## Resumo da Lição

- **Chaves Secundárias** fornecem caminhos de acesso otimizados adicionais sobre tabelas Standard, Sorted ou Hashed sem quebrar sua organização original.
- Chaves secundárias não únicas utilizam **avaliação tardia (*Lazy Evaluation*)**, criando e sincronizando o índice apenas quando a chave é consultada.
- Chaves secundárias únicas utilizam **avaliação imediata (*Eager Evaluation*)**, mantendo o índice constantemente sincronizado para garantir unicidade.
- A adição **`USING KEY nome_chave`** deve ser declarada no `READ TABLE`, `LOOP AT` ou Expressões de Tabela para forçar o uso do índice secundário.
- Chaves secundárias substituem os antigos comandos procedurais `SORT itab BY ...` e `BINARY SEARCH` em cenários com múltiplos caminhos de consulta.
