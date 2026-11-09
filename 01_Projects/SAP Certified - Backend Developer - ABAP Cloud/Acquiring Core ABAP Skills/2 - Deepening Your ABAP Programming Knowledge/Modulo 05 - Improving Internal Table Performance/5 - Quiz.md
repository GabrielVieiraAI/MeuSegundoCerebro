---
title: "Quiz - Improving Internal Table Performance"
source: "https://learning.sap.com/courses/deepening-your-abap-programming-knowledge/improving-internal-table-performance_quiz"
created: 2026-11-03
tags:
  - sap
  - abap
  - abap-cloud
  - quiz
  - tabelas-internas
  - performance
  - secondary-keys
---
**Roteiro de Estudos Relacionado:** [[Roteiro de Estudos SAP]]

# SAP Learning - Deepening Your ABAP Programming Knowledge
## Quiz: Improving Internal Table Performance

> [!NOTE] Instruções de Estudo Ativo
> Tente responder a cada uma das perguntas antes de abrir o bloco retrátil de gabarito e fundamentação técnica.

---

### Pergunta 1
**Qual das seguintes categorias de tabelas internas garante complexidade de busca de tempo constante $O(1)$ ao realizar leituras utilizando a chave primária completa, independentemente se a tabela possui dez ou dez milhões de registros em memória?**

- **A.** Standard Table
- **B.** Sorted Table
- **C.** Hashed Table
- **D.** Any Table

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **C**  
> **Fundamentação Técnica:** Uma **Hashed Table** é gerenciada por um algoritmo de hash interno do kernel. Ao pesquisar informando a chave primária completa, o sistema calcula o valor de espalhamento e acessa diretamente a posição de memória correspondente em tempo constante **$O(1)$**, ao contrário de tabelas Standard ($O(N)$ em busca linear) e Sorted ($O(\log N)$ em busca binária).

---

### Pergunta 2
**Ao iterar sobre uma tabela interna que possui dezenas de colunas em sua estrutura e centenas de milhares de linhas, por que utilizar `ASSIGNING FIELD-SYMBOL(<fs>)` em vez de `INTO DATA(ls_workarea)` proporciona uma melhora substancial de desempenho?**

- **A.** O Field Symbol compacta os dados em disco antes de carregá-los.
- **B.** O Field Symbol atua como um ponteiro direto para a memória existente, eliminando o custo de cópia de bytes da linha para uma área de trabalho temporária a cada iteração do laço.
- **C.** O Field Symbol converte automaticamente a tabela para o tipo Hashed.
- **D.** A área de trabalho não suporta tipos de dados modernos.

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **B**  
> **Fundamentação Técnica:** A instrução `INTO wa` realiza uma cópia física completa de todos os campos da linha da tabela para a variável local a cada ciclo do loop. Para tabelas largas (*wide tables*) e volumosas, essa cópia consome massiva largura de banda de memória e tempo de CPU. O **Field Symbol** simplesmente aponta para o endereço já existente em memória, operando com custo de transferência virtualmente nulo.

---

### Pergunta 3
**Dentro de um laço `LOOP AT itab ASSIGNING FIELD-SYMBOL(<fs>)`, qual instrução deve ser executada para salvar as alterações feitas no registro `<fs>` de volta na tabela interna?**

- **A.** `MODIFY itab FROM <fs>.`
- **B.** `UPDATE itab FROM <fs>.`
- **C.** `COMMIT WORK.`
- **D.** Nenhuma instrução adicional é necessária; a alteração no Field Symbol reflete instantaneamente na tabela interna em memória.

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **D**  
> **Fundamentação Técnica:** Como o Field Symbol é um ponteiro direto para o registro em memória (*in-place pointer*), qualquer modificação de valor atribuída aos seus campos (ex: `<fs>-status = 'P'`) altera imediatamente a linha física da tabela interna. O comando `MODIFY itab` é desnecessário e prejudicial à performance.

---

### Pergunta 4
**Qual das seguintes restrições estruturais aplica-se OBRIGATORIAMENTE à declaração e ao uso de Hashed Tables no ABAP?**

- **A.** A chave primária deve ser declarada como `NON-UNIQUE`.
- **B.** A tabela não suporta acesso por índice numérico posicional (`INDEX`), exigindo que todas as leituras sejam realizadas por chave.
- **C.** A tabela não pode possuir mais de 1000 registros.
- **D.** É obrigatório o uso do comando `APPEND` para inserção de dados.

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **B**  
> **Fundamentação Técnica:** Tabelas Hash não possuem organização linear indexada em memória. Instruções como `READ TABLE itab INDEX 1` ou `itab[ 1 ]` resultam em erro de sintaxe. Além disso, sua chave primária é **obrigatoriamente única (`WITH UNIQUE KEY`)** e a inserção é realizada via `INSERT ... INTO TABLE`.

---

### Pergunta 5
**Como o kernel do ABAP gerencia a criação e a manutenção do índice de uma Chave Secundária NÃO ÚNICA (*Non-Unique Secondary Key*) declarada em uma tabela interna?**

- **A.** O índice é construído imediatamente no momento em que a tabela é preenchida pelo comando `SELECT`.
- **B.** O índice adota a estratégia de Avaliação Tardia (*Lazy Evaluation*), sendo construído apenas na primeira vez em que a tabela for acessada utilizando expressamente aquela chave secundária.
- **C.** O índice é reconstruído do zero a cada execução de um laço `LOOP AT`.
- **D.** O compilador impede a criação de chaves secundárias não únicas.

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **B**  
> **Fundamentação Técnica:** Chaves secundárias não únicas operam sob o modelo **Lazy Evaluation** (construção sob demanda). O sistema posterga o custo computacional de criação do índice ordenado até o momento exato em que uma instrução no código executa uma leitura utilizando a chave (`USING KEY`). Caso o programa nunca consulte a chave secundária, o índice sequer é gerado.

---

### Pergunta 6
**Por que Chaves Secundárias ÚNICAS (*Unique Secondary Keys*) utilizam a estratégia de Avaliação Imediata (*Eager Evaluation*), mantendo o índice constantemente sincronizado a cada inserção ou modificação na tabela?**

- **A.** Porque o sistema precisa garantir a qualquer instante que nenhum registro violou a regra de unicidade da chave.
- **B.** Porque chaves únicas só podem ser aplicadas em tabelas com menos de 10 linhas.
- **C.** Para permitir o uso do comando `SORT` automático.
- **D.** Porque o SAP HANA não suporta avaliação tardia em memória.

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **A**  
> **Fundamentação Técnica:** Em chaves declaradas como `UNIQUE`, a integridade relacional de unicidade não pode ser postergada. Toda operação de escrita (`INSERT`, `APPEND`, `MODIFY`) deve validar imediatamente se a nova linha causará duplicidade, forçando a sincronização contínua do índice (*Eager Evaluation*).

---

### Pergunta 7
**Qual é a consequência em tempo de execução se o seu programa tentar acessar um campo de um Field Symbol antes que ele tenha sido associado a uma variável ou linha de tabela válida?**

- **A.** O campo retorna o valor padrão inicial sem interrupção.
- **B.** Ocorre um erro em tempo de execução fatal (*Short Dump*) decorrente da exceção `GETWA_NOT_ASSIGNED`.
- **C.** A variável é automaticamente instanciada pelo coletor de lixo.
- **D.** O programa entra em loop infinito.

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **B**  
> **Fundamentação Técnica:** Um Field Symbol não aloca memória própria. Acessar `<fs>-campo` quando o ponteiro está solto (não inicializado ou após um `UNASSIGN`) gera o dump clássico **`GETWA_NOT_ASSIGNED`**. Para evitar essa falha, utilize a verificação defensiva `IF <fs> IS ASSIGNED.`.

---

### Pergunta 8
**Qual adição deve ser informada em uma instrução `LOOP AT` ou Expressão de Tabela para forçar explicitamente a utilização de uma Chave Secundária específica criada sobre uma tabela interna?**

- **A.** `BY PASSING KEY`
- **B.** `USING KEY nome_chave`
- **C.** `WITH INDEX nome_chave`
- **D.** `FORCE KEY nome_chave`

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **B**  
> **Fundamentação Técnica:** A adição oficial é **`USING KEY nome_chave`** (exemplo: `LOOP AT lt_flights USING KEY by_plane WHERE planetype = 'A380'`). Ela instrui o compilador e o otimizador do kernel a percorrer a tabela na ordem e através do índice da chave secundária indicada.
