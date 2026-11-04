---
title: "Quiz - Analyzing and Testing Code"
source: "https://learning.sap.com/courses/deepening-your-abap-programming-knowledge/analyzing-and-testing-code_quiz"
created: 2026-11-03
tags:
  - sap
  - abap
  - abap-cloud
  - quiz
  - atc
  - abap-unit
  - profilier
  - sql-trace
---
**Roteiro de Estudos Relacionado:** [[Roteiro de Estudos SAP]]

# SAP Learning - Deepening Your ABAP Programming Knowledge
## Quiz: Analyzing and Testing Code

> [!NOTE] Instruções de Estudo Ativo
> Responda a cada questão mentalmente ou anotando sua resposta antes de abrir o bloco retrátil de gabarito e explicação técnica.

---

### Pergunta 1
**Qual ferramenta oficial deve ser utilizada no ambiente SAP moderno para realizar análises estáticas de qualidade de código, verificar aderência às regras do Clean Core, inspecionar segurança contra vulnerabilidades e validar diretrizes corporativas de desenvolvimento?**

- **A.** ABAP Profiler
- **B.** SQL Trace
- **C.** ABAP Test Cockpit (ATC)
- **D.** ABAP Debugger

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **C**  
> **Fundamentação Técnica:** O **ABAP Test Cockpit (ATC)** é o framework central e padrão da SAP para **análise estática de código (*Static Code Analysis*)**. Ele substitui ferramentas legadas como a `SLIN` (Extended Check) e a `SCI` (Code Inspector), garantindo a conformidade do código com regras de performance, Clean Core e segurança antes do transporte para ambientes produtivos.

---

### Pergunta 2
**No framework ABAP Unit, como uma classe é definida para que o compilador a reconheça formalmente como uma classe de testes e evite sua inclusão em pacotes de execução produtiva?**

- **A.** Implementando a interface padrão `IF_ABAP_UNIT_TEST`.
- **B.** Utilizando a cláusula `FOR TESTING` na declaração `CLASS ... DEFINITION`.
- **C.** Nomeando a classe obrigatoriamente com o prefixo `TEST_`.
- **D.** Atribuindo a classe a um tipo especial de pacote de desenvolvimento de testes.

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **B**  
> **Fundamentação Técnica:** A declaração `CLASS ltc_test_name DEFINITION ... FOR TESTING` sinaliza ao compilador e ao executor do ABAP Unit que a classe contém cenários de teste automatizados. A cláusula `FOR TESTING` também é utilizada na assinatura dos métodos de teste individuais.

---

### Pergunta 3
**Caso o desenvolvedor omita a adição `RISK LEVEL` ao declarar uma classe de teste ABAP Unit, qual é o nível de risco atribuído por padrão pelo framework?**

- **A.** `HARMLESS`
- **B.** `DANGEROUS`
- **C.** `CRITICAL`
- **D.** `SYSTEM_SAFE`

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **C**  
> **Fundamentação Técnica:** Por padrão de segurança estrito da SAP, se a adição `RISK LEVEL` não for explicitamente informada, o sistema assume **`CRITICAL`** (nível associado a alterações de configuração/customizing). Como muitos ambientes de desenvolvimento restringem ou bloqueiam testes com nível crítico, é essencial declarar explicitamente `RISK LEVEL HARMLESS` para testes unitários em memória.

---

### Pergunta 4
**Ao implementar uma classe de teste local com o ABAP Unit, qual método especial do ciclo de vida (*Fixture*) é invocado automaticamente pelo framework imediatamente antes da execução de CADA método de teste individual?**

- **A.** `class_setup`
- **B.** `setup`
- **C.** `constructor`
- **D.** `teardown`

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **B**  
> **Fundamentação Técnica:** O método **`setup`** é executado antes de cada método de teste individual da classe, garantindo que o objeto sob teste (*CUT*) e suas variáveis recebam um estado inicial limpo e isolado. O método `class_setup`, por sua vez, é estático e executa apenas uma vez antes de toda a classe.

---

### Pergunta 5
**Qual é o principal objetivo da funcionalidade de IA generativa do SAP Joule acessada via o comando *"Find test-unfriendly dependencies"* no ADT?**

- **A.** Corrigir automaticamente os erros de sintaxe de um programa ABAP.
- **B.** Analisar a lógica do método produtivo para identificar dependências fortemente acopladas (como acessos diretos ao banco de dados) e orientar o isolamento via dublês de teste (*Test Doubles*).
- **C.** Executar o profiling de consumo de memória do método.
- **D.** Excluir comentários desnecessários do código-fonte.

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **B**  
> **Fundamentação Técnica:** O assistente Joule avalia a assinatura e o corpo do método para detectar "dependências hostis a testes unitários" (ex: leituras diretas em tabelas transparentes ou chamadas a funções remotas), sugerindo a refatoração do código com interfaces e a injeção de dublês de teste via *ABAP Test Double Framework*.

---

### Pergunta 6
**Na perspectiva ABAP Profiling do Eclipse ADT, ao analisar a tabela Hit List com o intuito de localizar o verdadeiro gargalo de processamento (*Hot Spot*) de CPU da sua aplicação, qual métrica deve ser usada como critério principal de ordenação?**

- **A.** Gross Time (Tempo Bruto)
- **B.** Net Time (Tempo Líquido)
- **C.** Quantidade total de invocações (Execution Count)
- **D.** Tamanho em bytes da classe

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **B**  
> **Fundamentação Técnica:** O **Net Time *(Tempo Líquido)*** contabiliza estritamente o tempo consumido pelo algoritmo interno daquele método específico, excluindo o tempo consumido pelos métodos chamados por ele. O método com maior tempo líquido é o verdadeiro consumidor de CPU e o candidato número um para refatoração. O *Gross Time* inclui chamadas filhas, ficando frequentemente distorcido no método orquestrador principal.

---

### Pergunta 7
**Ao configurar os parâmetros de uma medição no ABAP Profiler, qual é o impacto direto no ambiente ao selecionar o nível de agregação `Partial Aggregation` em comparação com `No Aggregation`?**

- **A.** O trace passa a gravar exclusivamente acessos ao banco de dados.
- **B.** O tamanho do arquivo de trace é reduzido, porém a visualização cronológica detalhada da sequência de chamadas (*Call Sequence / Call Tree*) fica indisponível.
- **C.** Os testes unitários associados são cancelados por timeout.
- **D.** O compilador impede a execução de métodos privados.

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **B**  
> **Fundamentação Técnica:** A opção `No Aggregation` grava cada evento e chamada individualmente, fornecendo o nível máximo de detalhes e permitindo reconstruir a árvore cronológica completa (*Call Sequence*). Ao optar por `Partial Aggregation`, chamadas idênticas são resumidas por instrução para economizar memória e tamanho de arquivo, desabilitando a visão cronológica detalhada.

---

### Pergunta 8
**Qual ferramenta de diagnóstico é a mais indicada para analisar detalhadamente como um comando ABAP SQL é convertido em Native SQL pelo compilador, além de quantificar o tempo gasto no banco de dados e a proporção de linhas acessadas versus retornadas?**

- **A.** ABAP Unit
- **B.** ABAP Test Cockpit
- **C.** SQL Trace (integrado ao ADT e Technical Monitor Cockpit / ST05)
- **D.** ABAP Doc

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **C**  
> **Fundamentação Técnica:** O **SQL Trace** registra a comunicação entre o servidor de aplicação ABAP e o banco de dados (SAP HANA). Ele permite visualizar o comando Native SQL exato enviado à base, a duração de processamento em microssegundos e a contagem de registros processados (*Records Accessed vs. Transferred*), permitindo diagnosticar antipadrões como leituras em loop e varreduras completas (*Full Table Scans*).

---

### Pergunta 9
**No desenvolvimento ABAP moderno e alinhado ao Clean Core, como o desenvolvedor deve suprimir intencionalmente um aviso do ABAP Test Cockpit (ATC), por exemplo, informando que uma variável declarada é necessária embora não seja lida no método atual?**

- **A.** Inserindo o pseudo-comentário `"#EC NEEDED` após o ponto final da linha.
- **B.** Inserindo o Pragma `##NEEDED` antes do ponto final da instrução.
- **C.** Declarando a variável na seção pública da classe.
- **D.** Utilizando a instrução `SET WARNING OFF`.

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **B**  
> **Fundamentação Técnica:** No ABAP contemporâneo e no ABAP Cloud, pseudo-comentários com `"#EC` são considerados sintaxe obsoleta. A supressão oficial e padronizada é realizada por meio de **Pragmas** iniciados por dois sinais de cerquilha (como `##NEEDED` ou `##NO_TEXT`), que devem ser posicionados obrigatoriamente **antes do ponto final (`.`)** que conclui a instrução ABAP.
