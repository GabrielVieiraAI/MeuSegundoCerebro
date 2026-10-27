---
tipo: teste-notebooklm
tags:
  - sap
  - abap
  - abap-cloud
  - teste
modulo: 2
dificuldade: dificil
tentativa: 1
score: 40%
aprovado: false
data: 2026-10-26
---

# 📝 Bateria de Teste: Nível Difícil (Tentativa 1) - Módulo 2 (Applying Basic Techniques and Concepts)

> [!NOTE] Instruções de Estudo Ativo
> Este teste simula o nível de exigência da certificação oficial **SAP Certified Associate - Back-End Developer - ABAP Cloud (`C_ABAPD`)**.  
> Ele avalia **resolução de problemas (*troubleshooting*), comportamento do runtime sob exceções, regras estritas do [[ABAP Cloud]] e armadilhas de sintaxe**.  
> Nas questões com múltiplas alternativas corretas, assinale todas as opções válidas (no exame oficial não há pontuação parcial).  
> **Meta para aprovação:** ≥ 90% de acertos (mínimo de 9 em 10 questões).

---

### Questão 1
Um desenvolvedor júnior que acabou de migrar de um ambiente SAP ECC legado tenta ativar uma classe de processamento no **SAP BTP ABAP Environment** (configurada sob a versão de linguagem *ABAP for Cloud Development*). O código-fonte contém as seguintes declarações e comandos:

```abap
CLASS zcl_payroll DEFINITION PUBLIC FINAL CREATE PUBLIC.
  PUBLIC SECTION.
    INTERFACES if_oo_adt_classrun.
ENDCLASS.

CLASS zcl_payroll IMPLEMENTATION.
  METHOD if_oo_adt_classrun~main.
    DATA lv_salario TYPE p LENGTH 8 DECIMALS 2 VALUE '5000.00'.
    WRITE: / 'Salário Base:', lv_salario.
  ENDMETHOD.
ENDCLASS.
```

Ao acionar a ativação (`Ctrl + F3`), qual comportamento é esperado do compilador ABAP?

- **A.** A classe é ativada normalmente, pois o comando `WRITE` é compatível com todas as versões de ABAP
- **B.** A classe falha na compilação porque a instrução clássica `WRITE` é proibida no modelo **[[ABAP Cloud]]**
- **C.** O compilador ativa o código, mas converte silenciosamente a instrução `WRITE` para `out->write( )`
- **D.** A compilação falha porque o tipo packed decimal (`p`) não é suportado no ambiente em nuvem

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **B**  
> **Conceito:** No modelo arquitetural do **ABAP Cloud** (*ABAP for Cloud Development*), comandos procedurais clássicos baseados em telas e relatórios do SAP GUI (como `WRITE`, `PARAMETERS`, `SELECT-OPTIONS`, `AT SELECTION-SCREEN`) foram completamente removidos da sintaxe permitida. A saída de dados para teste deve utilizar o método `out->write( )` da interface `if_oo_adt_classrun`.

---

### Questão 2
Considere a conversão e atribuição implícita de tipos de dados no trecho de código abaixo:

```abap
DATA lv_origem  TYPE string VALUE 'SAP_BTP_CLOUD'.
DATA lv_destino TYPE c LENGTH 5.

lv_destino = lv_origem.
out->write( lv_destino ).
```

Qual será a saída exibida no console e qual regra de conversão o compilador aplicou?

- **A.** `'CLOUD'` (o compilador trunca os primeiros caracteres à esquerda)
- **B.** `'SAP_B'` (o valor é truncado à direita pelo comprimento definido sem gerar erro em tempo de execução)
- **C.** O programa é abortado com a exceção `cx_sy_conversion_overflow`
- **D.** `'SAP_BTP_CLOUD'` (o tipo `c` expande dinamicamente a sua alocação de memória)

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **B**  
> **Conceito:** Ao atribuir uma cadeia de caracteres mais longa para uma variável do tipo caractere de comprimento fixo (`c LENGTH n`), o runtime ABAP copia os dados da esquerda para a direita até atingir o comprimento fixo definido (`5` posições: `S-A-P-_-B`), truncando silenciosamente os caracteres excedentes sem disparar erro de tempo de execução.

---

### ==🟡Questão 3
Quais das seguintes afirmações sobre o **tratamento de exceções baseadas em classes** no ABAP são verdadeiras? (Escolha duas opções)

- **A.** Todas as exceções do sistema ABAP podem ser capturadas por blocos `CATCH`
- **B.** Todas as exceções que não forem capturadas por um bloco `CATCH` resultam em erros críticos de execução (*Runtime Errors / Short Dumps*)
- **C.** As classes de exceção tratáveis derivam direta ou indiretamente da superclasse abstrata de sistema `cx_root`
- **D.** Um bloco `TRY` deve conter obrigatoriamente pelo menos duas instruções `CATCH` distintas

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **B, C**  
> **Conceito:** Toda exceção não tratada aborta o processo gerando um *Runtime Error* no sistema (consultável via transação ST22 em sistemas On-Premise ou via *ABAP Cross Trace* no BTP). No ABAP Objects, todas as exceções tratáveis fazem parte de uma hierarquia que descende da raiz comum **`cx_root`**. A opção A está errada porque existem exceções de sistema não tratáveis (como violações graves de memória), e a opção D está errada pois um único `CATCH` (ou até mesmo `CLEANUP`) é suficiente.
> - **Questão 3:** [[01_Projects/SAP Certified - Backend Developer - ABAP Cloud/Acquiring Core ABAP Skills/1 - Learning Basic ABAP Programming/2 - Applying Basic Techniques and Concepts/4 - Using Control Structures in ABAP#3. Tratamento de Exceções (*Exception Handling*)|4 - Using Control Structures in ABAP]] — Linhas 184 a 219.

---

### ==🟡Questão 4
Você precisa acessar o quarto elemento de uma tabela interna simples (`numbers[ 4 ]`), mas sabe que em alguns cenários essa tabela pode possuir menos de 4 linhas cadastradas. Você deseja evitar que a leitura dispare a exceção `cx_sy_itab_line_not_found` caso a linha não exista, definindo um valor padrão `0` de fallback.

Qual sintaxe moderna de expressão de tabela (*Table Expression*) atende a esse requisito sem necessitar de um bloco `TRY ... CATCH` explícito?

- **A.** `DATA(val) = numbers[ 4 ] DEFAULT 0.`
- **B.** `DATA(val) = VALUE #( numbers[ 4 ] DEFAULT 0 ).`
- **C.** `DATA(val) = numbers[ 4 ] OPTIONAL.`
- **D.** `DATA(val) = IF numbers[ 4 ] EXISTS THEN numbers[ 4 ] ELSE 0.`

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **B**  
> **Conceito:** A expressão de construção `VALUE #( itab[ index ] DEFAULT valor_padrao )` avalia a leitura da tabela interna e, caso o índice não exista, atribui com segurança o valor especificado em `DEFAULT` sem lançar exceção. (A sintaxe `numbers[ 4 ] OPTIONAL` atribui o valor inicial do tipo, mas não aceita a cláusula `DEFAULT 0` diretamente fora de uma expressão de construtor `VALUE`).
> - **Questão 4:** [[01_Projects/SAP Certified - Backend Developer - ABAP Cloud/Acquiring Core ABAP Skills/1 - Learning Basic ABAP Programming/2 - Applying Basic Techniques and Concepts/5 - Working with Simple Internal Tables#3. Leitura de Linha Única com Expressões de Tabela (*Table Expressions*)|5 - Working with Simple Internal Tables]] — Linhas 87 a 102.

---

### ==🟡Questão 5
Analise o laço de repetição abaixo que percorre uma tabela interna de preços:

```abap
DATA precos TYPE TABLE OF i.
APPEND 100 TO precos.
APPEND 200 TO precos.

LOOP AT precos INTO DATA(linha).
  linha = linha * 2.
ENDLOOP.
```

Após o encerramento do laço `LOOP AT`, qual será o conteúdo dos elementos dentro da tabela interna `precos`?

- **A.** `[ 200, 400 ]` (os elementos foram atualizados na tabela)
- **B.** `[ 100, 200 ]` (os elementos permanecem inalterados porque `linha` é apenas uma cópia de trabalho / *work area*)
- **C.** O código não compila porque declarações inline `DATA(...)` são proibidas dentro de `LOOP AT`
- **D.** O laço gera uma exceção de modificação concorrente de coleções

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **B**  
> **Conceito:** A cláusula `INTO DATA(linha)` cria uma variável de estrutura de trabalho (*work area*) independente que recebe uma cópia do valor da linha atual. Modificar `linha` altera unicamente essa variável local em memória, sem impactar o registro armazenado na tabela interna `precos`. Para modificar a tabela diretamente durante o laço, deve-se utilizar um *Field Symbol* (`LOOP AT precos ASSIGNING FIELD-SYMBOL(<linha>). <linha> = <linha> * 2. ENDLOOP.`) ou a instrução `MODIFY`.
> - **Questão 5:** [[01_Projects/SAP Certified - Backend Developer - ABAP Cloud/Acquiring Core ABAP Skills/1 - Learning Basic ABAP Programming/2 - Applying Basic Techniques and Concepts/5 - Working with Simple Internal Tables#4. Percorrer a Tabela em um Laço (`LOOP AT ... ENDLOOP`)|5 - Working with Simple Internal Tables]] — Linhas 117 a 126.

---

### ==🟡Questão 6
Considere a avaliação da seguinte expressão lógica condicional em ABAP:

```abap
IF NOT status = 'A' AND tipo = 1.
  out->write( 'Condição Satisfeita' ).
ENDIF.
```

Como o compilador ABAP resolve a ordem de precedência dos operadores booleanos sem o uso explícito de parênteses?

- **A.** O `NOT` tem maior precedência e se aplica apenas a `status = 'A'`; em seguida avalia-se o operador `AND` com `tipo = 1`
- **B.** O operador `NOT` inverte todo o resultado da expressão conjunta `( status = 'A' AND tipo = 1 )`
- **C.** O operador `AND` é processado antes do `NOT`
- **D.** A sintaxe é inválida; o compilador exige parênteses obrigatórios sempre que a instrução contiver o operador `NOT`

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **A**  
> **Conceito:** No ABAP, a ordem de precedência padrão dos operadores booleanos (na ausência de parênteses) é estritamente: **`NOT`** (maior precedência) **`>`** **`AND`** **`>`** **`OR`** (menor precedência). Portanto, a condição é avaliada exatamente como `( NOT ( status = 'A' ) ) AND ( tipo = 1 )`.
> - **Questão 6:** [[01_Projects/SAP Certified - Backend Developer - ABAP Cloud/Acquiring Core ABAP Skills/1 - Learning Basic ABAP Programming/2 - Applying Basic Techniques and Concepts/4 - Using Control Structures in ABAP#Condições e Operadores Lógicos|4 - Using Control Structures in ABAP]] — Linhas 75 a 79.

---

### ==🟡Questão 7
Quais são as diferenças conceituais fundamentais entre tipos de dados declarados localmente com a palavra-chave **`TYPES`** e tipos de dados definidos no **Dicionário de Dados ABAP (*DDIC / Global Types*)**? (Escolha duas opções)

- **A.** Tipos declarados com `TYPES` possuem escopo estritamente local (dentro da classe ou programa onde foram definidos)
- **B.** Tipos do Dicionário de Dados agregam metadados semânticos de negócio, como rótulos de campos de tela (*Field Labels*), textos de ajuda (*Quick Info*) e ajuda de pesquisa (*Search Helps*)
- **C.** Tipos declarados com `TYPES` são gravados em tabelas de catálogo do banco de dados e sincronizados entre todas as instâncias do sistema
- **D.** O modelo ABAP Cloud aboliu o uso de tipos globais do Dicionário de Dados

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **A, B**  
> **Conceito:** Declarações `TYPES` criam estruturas técnicas reutilizáveis apenas no contexto local da classe ou unidade de compilação. Já os tipos do Dicionário de Dados (Elementos de Dados, Estruturas e Tipos de Tabela) são objetos globais do repositório que, além da definição técnica de tipo, carregam semântica de negócio para interfaces de usuário (*UI*), documentação e governança de dados.
> - **Questão 7:** [[01_Projects/SAP Certified - Backend Developer - ABAP Cloud/Acquiring Core ABAP Skills/1 - Learning Basic ABAP Programming/2 - Applying Basic Techniques and Concepts/2 - Working With Basic Data Objects and Data Types#3. Fontes de Tipos de Dados no ABAP|2 - Working With Basic Data Objects and Data Types]] — Linhas 75 a 82.

---

### ==🟡Questão 8
Durante uma sessão crítica de depuração (*debugging*) no Eclipse ADT, um consultor utiliza o recurso **Jump to Line (Shift + F12)** para retroceder o apontador de execução em 10 linhas, retornando a um ponto anterior do método para reavaliar uma fórmula de cálculo.

Qual cuidado crítico de arquitetura e consistência o desenvolvedor deve ter ao realizar essa operação?

- **A.** O Eclipse trava e desativa automaticamente todos os breakpoints do projeto
- **B.** O comando `Jump to Line` para trás não reverte nem desfaz alterações de dados que já foram gravadas nas variáveis de memória ou em tabelas internas durante a primeira passagem
- **C.** O comando retrocede a execução e efetua um `ROLLBACK WORK` automático no banco de dados
- **D.** Não há restrições nem riscos, pois o runtime restaura o *call stack* exatamente ao estado que se encontrava no início

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **B**  
> **Conceito:** O comando **Jump to Line (Shift + F12)** apenas altera o cursor da próxima instrução a ser processada pelo processador ABAP. Ele **não** é uma operação de máquina do tempo: qualquer variável cujo conteúdo tenha sido recalculado, ou qualquer registro inserido em tabelas internas durante a execução anterior, permanece no estado atualizado. Repassar pelas mesmas instruções pode causar efeitos colaterais como duplicação de dados em tabelas ou cálculos cumulativos incorretos.
> - **Questão 8:** [[01_Projects/SAP Certified - Backend Developer - ABAP Cloud/Acquiring Core ABAP Skills/1 - Learning Basic ABAP Programming/2 - Applying Basic Techniques and Concepts/6 - Debugging an ABAP Program#2. Controle de Execução do Código|6 - Debugging an ABAP Program]] — Linha 74.

---

### Questão 9
Considere a utilização de instruções encadeadas (*chained statements*) com a instrução `DATA` e atribuições de valores iniciais:

```abap
DATA: gv_codigo TYPE c LENGTH 4 VALUE 'A100',
      gv_limite TYPE i VALUE 500,
      gv_status TYPE c LENGTH 1.
```

Sobre essa sintaxe, quais afirmações estão corretas? (Escolha duas opções)

- **A.** O dois-pontos (`:`) define a palavra-chave comum inicial (`DATA`), as vírgulas (`,`) separam os identificadores e o ponto final (`.`) encerra a instrução completa
- **B.** O encadeamento reduz o número de instruções geradas pelo compilador, tornando a execução 30% mais rápida em tempo de execução
- **C.** Cada elemento encadeado pode ter seu próprio tipo técnico e sua própria cláusula `VALUE` independente
- **D.** O encadeamento de instruções é exclusivo do comando `DATA`, sendo proibido em instruções como `TYPES` ou `CLEAR`

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **A, C**  
> **Conceito:** As instruções em cadeia (*chained statements*) funcionam com dois-pontos (`:`) após a palavra-chave comum, separando as cláusulas individuais por vírgula (`,`) e finalizando com ponto (`.`). Cada variável encadeada é independente e pode possuir seu tipo e seu `VALUE` inicial. Não há ganho de performance em runtime (é apenas uma comodidade sintática e de legibilidade para o desenvolvedor) e ela pode ser usada com outras instruções, como `TYPES:`, `CLEAR:`, `WRITE:` etc.

---

### Questão 10
Qual das seguintes construções de **String Templates** é válida no ABAP moderno para concatenar um texto fixo com o resultado dinâmico de um cálculo aritmético e a data corrente do sistema?

- **A.**
```abap
out->write( |Pedido aprovado com { 10 * 5 } unidades na data { cl_abap_context_info=>get_system_date( ) DATE = USER }| ).
```
- **B.**
```abap
out->write( 'Pedido aprovado com ' + ( 10 * 5 ) + ' unidades na data ' + cl_abap_context_info=>get_system_date( ) ).
```
- **C.**
```abap
out->write( |Pedido aprovado com $(10 * 5) unidades na data ${ cl_abap_context_info=>get_system_date() }| ).
```
- **D.**
```abap
out->write( [Pedido aprovado com { 10 * 5 } unidades na data { cl_abap_context_info=>get_system_date( ) }] ).
```

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **A**  
> **Conceito:** No ABAP, expressões delimitadas por `|...|` permitem embutir dentro de chaves `{ ... }` cálculos aritméticos diretos (como `{ 10 * 5 }`), chamadas de métodos (como `cl_abap_context_info=>get_system_date( )`) e parâmetros de formatação como `DATE = USER` ou `DATE = ISO`, compondo textos dinâmicos de maneira limpa e moderna. As sintaxes com `+` ou `$()` pertencem a outras linguagens como JavaScript/C#.

---







