---
tipo: flashcards
tags:
  - sap
  - abap
  - abap-cloud
  - flashcards
modulo: 2
curso: "Learning Basic ABAP Programming"
---

# 🗂️ Flashcards: Módulo 2 - Applying Basic Techniques and Concepts

**Deck Principal:** `#flashcards/sap/abap-cloud/modulo-02`  
**Painel de Revisão:** [[01_Projects/SAP Certified - Backend Developer - ABAP Cloud/Acquiring Core ABAP Skills/1 - Learning Basic ABAP Programming/2 - Applying Basic Techniques and Concepts/Revisao Ativa|Revisao Ativa - Modulo 02]]

---

#flashcards/sap/abap-cloud/modulo-02

### 1. Fundamentos da Linguagem e Regras de Sintaxe

Qual pontuação é obrigatória para encerrar qualquer instrução (statement) em ABAP?::Toda instrução ABAP deve ser obrigatoriamente finalizada com um ponto final (`.`).
<!--SR:!2026-10-30,4,270-->

Por que a instrução lv_total=lv_v1+lv_v2. causa erro de compilação em ABAP?::Porque o compilador ABAP exige obrigatoriamente espaços em branco separando operadores (`=`, `+`), operandos e parênteses. A forma correta é `lv_total = lv_v1 + lv_v2.`.
<!--SR:!2026-10-30,4,270-->

Como funciona a sensibilidade a maiúsculas/minúsculas (case-insensitivity) e o Pretty Printer no ABAP?::O ABAP é totalmente indiferente a maiúsculas e minúsculas (*case-insensitive*). No Eclipse ADT (*ABAP Development Tools*), o atalho **Shift + F1** executa o *Pretty Printer*, padronizando palavras-chave e indentação automaticamente.
<!--SR:!2026-10-29,3,250-->

Quais são as duas formas de comentar código em ABAP e qual a diferença entre elas?::Asterisco (`*`) na primeira coluna comenta a linha inteira. Aspas duplas (`"`) podem ser inseridas em qualquer posição da linha, comentando tudo à sua direita até o final da linha.
<!--SR:!2026-10-30,4,270-->

---

### 2. Objetos e Tipos de Dados Básicos

Qual a diferença entre Variáveis (DATA), Constantes (CONSTANTS) e Literais no ABAP?
?
* **Variáveis (`DATA`):** Áreas de memória identificadas por nome cujo valor pode mudar durante a execução (*runtime*).
* **Constantes (`CONSTANTS`):** Objetos identificados com valor fixo definido no código-fonte, imutáveis durante a execução.
* **Literais:** Valores anônimos digitados diretamente no código (ex: `'Texto'`, `10`, `` `String` ``), usados para inicializar variáveis ou constantes.
<!--SR:!2026-10-29,3,250-->

Por que o tipo Packed Decimal (p) é indispensável para cálculos financeiros em vez de números inteiros (i) ou ponto flutuante (f)?::Porque o tipo `p` (*Packed Decimal*) permite fixar tamanho e quantidade de casas decimais (`LENGTH l DECIMALS d`), evitando erros de arredondamento de ponto flutuante e preservando frações monetárias com alta precisão.
<!--SR:!2026-10-29,3,250-->

O que faz o comando CLEAR quando aplicado a uma variável ou a uma tabela interna?::O comando `CLEAR` restaura a variável ao seu valor inicial padrão (*initial value*: `0` para números, vazio `""` para textos, `'00000000'` para datas). Em tabelas internas, remove todos os registros, redefinindo o total de linhas para zero.
<!--SR:!2026-10-29,3,250-->

O que é declaração inline com DATA(...) e qual a sua principal vantagem?::Permite declarar uma variável diretamente no ponto de atribuição (ex: `DATA(lv_soma) = 5 + 3.`), inferindo o tipo técnico automaticamente a partir da expressão e dispensando declarações prévias no topo do método.
<!--SR:!2026-10-30,4,270-->

---

### 3. Cálculos e Processamento de Texto (Strings)

Qual a diferença entre calcular 2 / 3 e 2 DIV 3 atribuindo a uma variável inteira (i) no ABAP?::A barra `/` realiza divisão com arredondamento comercial (*half-up*), resultando em `1` (pois $0,666... \ge 0,5$). O operador `DIV` realiza divisão inteira com truncamento, resultando em `0`.
<!--SR:!2026-10-30,3,250-->

O que são String Templates (|...|) e expressões embutidas ({ ... }) no ABAP moderno?::Delimitados por barras verticais `|...|`, permitem interpolar variáveis e expressões lógicas diretamente dentro do texto usando chaves `{ expressao }`, substituindo comandos legados de concatenação com sintaxe limpa e legível.
<!--SR:!2026-10-29,3,250-->

Qual é o operador moderno de concatenação de strings em ABAP?::É o operador duplo e-comercial (**`&&`**), que une expressões textuais sem inserir espaços em branco adicionais.
<!--SR:!2026-10-30,4,270-->

---

### 4. Estruturas de Controle e Tratamento de Exceções

Para que serve a expressão lógica relacional IS INITIAL no ABAP?::Serve para verificar se uma variável ou objeto contém o valor inicial padrão do seu respectivo tipo de dados (ex: vazio `""` para caracteres/strings, `0` para números).
<!--SR:!2026-10-30,4,270-->

Qual a função da variável de sistema sy-index e em quais comandos ela é alimentada?::`sy-index` é uma variável de sistema que armazena o contador da iteração atual em laços de repetição controlados como `DO ... ENDDO` e `WHILE ... ENDWHILE`.
<!--SR:!2026-10-28,1,210-->

O que acontece se uma exceção não for tratada dentro de um bloco TRY ... CATCH ... ENDTRY?::O programa aborta imediatamente com erro crítico em tempo de execução (*Runtime Error / Short Dump ST22*). O bloco `TRY ... CATCH` intercepta exceções tratáveis, permitindo tratá-las sem derrubar a aplicação.
<!--SR:!2026-10-30,4,270-->

Qual a diferença entre as estruturas condicionais IF e CASE no ABAP?::O `IF ... ELSEIF ... ENDIF` avalia múltiplas expressões booleanas arbitrárias e complexas. O `CASE ... WHEN ... ENDCASE` compara uma única variável contra valores específicos discretos, sendo mais limpo e performático para múltiplos ramos de uma mesma variável.
<!--SR:!2026-10-29,3,250-->

---

### 5. Tabelas Internas Simples (Coleções)

O que é uma Tabela Interna Simples e quantas linhas ela contém quando declarada?::É uma coleção dinâmica em memória RAM que armazena múltiplos registros de mesmo tipo técnico. Toda tabela interna recém-declarada inicia vazia (com exatamente zero linhas).
<!--SR:!2026-10-30,4,270-->

Como ler uma linha de uma tabela interna usando Table Expressions e qual exceção é gerada se o índice não existir?::Utiliza-se a sintaxe de colchetes `tabela[ indice ]`. Se o índice numérico não existir na tabela, o sistema dispara a exceção tratável `cx_sy_itab_line_not_found`.
<!--SR:!2026-10-28,2,230-->

Qual variável de sistema armazena o índice da linha processada durante um laço LOOP AT em uma tabela interna?::A variável de sistema **`sy-tabix`**, que reflete o número da linha atual da tabela interna durante a iteração.
<!--SR:!2026-10-28,1,210-->

---

### 6. Depuração (Debugging) no Eclipse ADT

Quais as funções práticas das teclas F5, F6, F7 e F8 no Debugger do Eclipse ADT?
?
* **F5 (Step Into):** Executa em passo simples; se a linha chamar um método ou função, entra dentro do código para depurá-lo.
* **F6 (Step Over):** Executa a linha atual sem entrar no código interno dos métodos chamados.
* **F7 (Step Return):** Executa todo o restante do método atual de uma vez e para na linha imediatamente seguinte à chamada.
* **F8 (Resume):** Continua a execução contínua até o próximo ponto de parada ou final do programa.
<!--SR:!2026-10-29,2,230-->

Qual a diferença fundamental entre um Conditional Breakpoint e um Watchpoint no Eclipse ADT?::Um **Conditional Breakpoint** fica preso a uma linha específica e só interrompe a execução se uma condição lógica for verdadeira. Já um **Watchpoint** monitora uma variável específica e pausa o programa em qualquer ponto onde o conteúdo dessa variável for modificado.
<!--SR:!2026-10-29,3,250-->

Para que serve o atalho Shift + F12 (Jump to Line) no Debugger e qual cuidado crítico ele exige?::Permite saltar a execução diretamente para uma linha específica sem executar os comandos intermediários. **Cuidado:** saltar o ponteiro para trás não restaura variáveis na memória que já tenham sido alteradas.
<!--SR:!2026-10-29,3,250-->

---

### 7. Reforço de Erros: Bateria Difícil (Tentativa 1)

Quais são as regras fundamentais da hierarquia e do tratamento de exceções baseadas em classes no ABAP?
?
* **Raiz Comum:** Todas as exceções tratáveis derivam direta ou indiretamente da superclasse abstrata **`cx_root`**.
* **Não Tratadas:** Toda exceção não capturada por um bloco `CATCH` aborta o programa gerando um **Runtime Error / Short Dump** (ST22).
* **Tratáveis vs Não Tratáveis:** Nem toda exceção pode ser capturada (exceções críticas de sistema/memória não são capturáveis).
* **Blocos CATCH:** Um bloco `TRY` pode conter apenas um `CATCH` (não é obrigatório ter dois ou mais).

Como ler com segurança um índice de tabela interna que pode não existir sem disparar a exceção cx_sy_itab_line_not_found e sem usar TRY...CATCH?::Utiliza-se a expressão de construtor `VALUE #( itab[ index ] DEFAULT valor_padrao )` (ou `itab[ index ] OPTIONAL` para obter o valor inicial do tipo de forma silenciosa).

Por que modificar o campo de trabalho em LOOP AT itab INTO DATA(wa) não altera o dado na tabela interna e como resolver?::Porque `INTO DATA(wa)` cria uma variável independente que recebe uma cópia do registro. Para alterar a tabela real em memória, deve-se usar um Field Symbol (`LOOP AT itab ASSIGNING FIELD-SYMBOL(<fs>).`) ou a instrução `MODIFY itab FROM wa`.

Qual é a ordem de precedência dos operadores booleanos no ABAP quando não há parênteses?::A ordem estrita é: **`NOT`** (maior precedência) **`>`** **`AND`** **`>`** **`OR`** (menor precedência). Exemplo: `NOT a = 1 AND b = 2` é avaliado como `( NOT ( a = 1 ) ) AND ( b = 2 )`.

Qual a diferença conceitual entre tipos locais declarados com TYPES e tipos do Dicionário de Dados (DDIC)?::Tipos criados com `TYPES` têm escopo estritamente local (dentro do programa/classe). Tipos do Dicionário de Dados (DDIC) são globais no repositório e agregam metadados semânticos de negócio (rótulos de tela, documentação, ajudas de pesquisa e validações).

Por que o atalho Shift + F12 (Jump to Line) para trás no depurador ADT não equivale a um "desfazer" ou máquina do tempo?::Porque ele apenas altera o apontador da próxima linha a ser executada. Ele **não reverte** valores de variáveis na memória, registros já inseridos em tabelas internas nem alterações no banco de dados.
