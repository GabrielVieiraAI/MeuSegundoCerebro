---
title: "Depurando um Programa ABAP (Debugging no Eclipse ADT)"
source: "https://learning.sap.com/courses/basic-abap-programming/debugging-an-abap-program_d070e545-efd5-4d87-8b75-20f18d7b7d3b"
created: 2026-10-20
tags:
  - sap
  - abap
  - abap-cloud
  - adt
  - debugging
  - troubleshooting
---
**Roteiro de Estudos Relacionado:** [[Roteiro de Estudos SAP]]
# Objetivos
Após concluir esta lição, você será capaz de:
- Entrar no modo de depuração (*Debug Mode*) e utilizar a perspectiva **ABAP Debug** no Eclipse ADT.
- Controlar a execução passo a passo do código com os principais comandos de navegação (**F5**, **F6**, **F7**, **F8**, **Shift+F8**, **Shift+F12**).
- Criar e gerenciar pontos de parada especiais: *Conditional Breakpoints*, *Statement Breakpoints*, *Exception Breakpoints* e *Watchpoints*.
- Analisar e alterar o conteúdo de variáveis e tabelas internas em tempo de execução.

---

## 1. O Modo de Depuração (*Debug Mode*)

A depuração (*debugging*) é o processo de executar o código de forma controlada, linha por linha, para entender o fluxo lógico da aplicação, validar cálculos e identificar a causa de comportamentos inesperados ou erros em tempo de execução (*Short Dumps*).

### Como Iniciar o Debugger no Eclipse ADT

![[01_-_Enter_debugging_mode_002.png]]

1. **Definir um Ponto de Parada (*Breakpoint*):**
   * Dê um duplo clique na régua da margem esquerda do editor (ao lado do número da linha desejada) ou clique com o botão direito e escolha **Toggle Breakpoint**.
   * > [!IMPORTANT]
     > O programa precisa estar **ativo (`Ctrl + F3`)** para que você possa inserir breakpoints.
2. **Executar a Aplicação:**
   * Execute o programa normalmente (tecla **F9** para aplicações console).
3. **Interrupção Automática:**
   * Quando o fluxo atinge a linha com o breakpoint, o sistema interrompe a execução e pergunta se você deseja alternar para a **Perspectiva ABAP Debug**.

> [!NOTE]
> **Persistência dos Breakpoints:** Breakpoints definidos no ADT são específicos do seu usuário e permanecem ativos mesmo após fechar o Eclipse ou deslogar do sistema, até que sejam removidos ou desativados manualmente.

---

## 2. Controle de Execução do Código

![[02_-_Control_Execution_001 (1).png]]

Uma vez dentro do Debugger, você controla a execução linha por linha utilizando as seguintes teclas de atalho:

| Tecla / Atalho | Nome da Ação | O que faz na prática? |
| :--- | :--- | :--- |
| **F5** | **Step Into** | Executa a instrução atual em passo simples. **Se a linha for a chamada de um método ou função, o debugger entra dentro desse código** para você depurá-lo. |
| **F6** | **Step Over** | Executa a linha atual sem entrar no código interno de métodos ou funções chamadas (trata a chamada como um bloco único e para na linha seguinte). |
| **F7** | **Step Return** | Executa todo o restante do método atual de uma vez e para na linha imediatamente seguinte à chamada do método. |
| **F8** | **Resume** | Continua a execução contínua da aplicação até o próximo breakpoint ou watchpoint. Se não houver mais paradas, o programa finaliza. |
| **Shift + F8** | **Run to Line** | Executa o programa direto até a linha onde o cursor do mouse está posicionado (evita ter que criar um breakpoint temporário). |
| **Shift + F12** | **Jump to Line** | Salta a execução diretamente para uma linha anterior ou posterior **sem executar as linhas intermediárias**. *(Atenção: pular linhas para trás não desfaz alterações em dados que já ocorreram na memória!)* |
| — | **Terminate** | Botão quadrado vermelho na barra de ferramentas: encerra imediatamente a sessão de depuração. |

---

## 3. Pontos de Parada Especiais (*Special Breakpoints*)

![[02_-_Control_Execution_002.png]]

Além dos breakpoints comuns de linha, o ADT oferece tipos avançados gerenciáveis na aba **Breakpoints**:

### 1. Ponto de Parada Condicional (*Conditional Breakpoint*)
Permite que o debugger pare apenas se uma condição lógica for verdadeira.
* *Exemplo:* Em um laço `DO` de 100 iterações, você pode configurar a condição `sy-index > 80`. O debugger ignorará as primeiras 80 repetições e só pausará nas últimas 20.
* *Como criar:* Na visualização **Breakpoints**, selecione o breakpoint existente e digite a expressão no campo **Condition**.

### 2. Ponto de Parada por Comando (*Statement Breakpoint*)
Faz o programa pausar sempre que uma instrução específica da linguagem ABAP for executada, independentemente de onde ela estiver no código (ex: pausar em todo comando `CLEAR`, `EXIT` ou `APPEND`).
* *Como criar:* Na aba **Breakpoints**, clique no menu suspenso e escolha **Add Statement Breakpoint...**.

### 3. Ponto de Parada por Exceção (*Exception Breakpoint*)
Faz o programa pausar no exato momento em que uma classe de exceção específica for levantada (ex: `cx_sy_zerodivide`), mesmo que o erro esteja protegido por um bloco `TRY-CATCH`.
* *Como criar:* Na aba **Breakpoints**, escolha **Add Exception Breakpoint...** e informe o nome da classe `CX_*`.

---

## 4. Monitoramento com Watchpoints

Um **Watchpoint** é utilizado para monitorar o valor de uma variável ou tabela interna. Em vez de pausar em uma linha de código específica, o programa roda livremente e **pausa automaticamente no momento exato em que o valor dessa variável for alterado na memória**.

* *Como criar um Watchpoint:* Na aba **Variables**, clique com o botão direito sobre a variável desejada e selecione **Set Watchpoint**.

---

## 5. Inspeção e Modificação de Dados em Tempo de Execução

![[03_-_Analyze_data_objects_003.png]]

Durante a sessão de depuração, você pode inspecionar e até alterar os dados em memória para testar cenários hipotéticos sem precisar recompilar o código:

### Variáveis Simples (*Variables View*)
* Dê um duplo clique em qualquer variável no código-fonte para trazê-la para a aba **Variables**.
* Clique com o botão direito $\rightarrow$ **Change Value...** para alterar o valor numérico ou textual em memória.

### Tabelas Internas (*ABAP Internal Table View*)
Quando a variável inspecionada é uma tabela interna, o Eclipse abre uma aba dedicada abaixo do editor com as seguintes opções (ao clicar com o botão direito):
* **Change value...:** Modifica o conteúdo de uma célula da linha selecionada.
* **Insert Row...:** Insere um novo registro (na posição atual ou no fim da tabela).
* **Delete Selected Rows:** Remove as linhas selecionadas na tabela.
* **Delete Rows...:** Remove um intervalo completo de linhas.

---

## 6. Exercício Prático: Depurando a Classe de Empréstimo

Neste exercício, você duplicará uma classe modelo de simulação de plano de pagamento de empréstimo (*loan repayment*) e utilizará todos os recursos do Debugger para analisar o fluxo de execução e o preenchimento de variáveis.

### Tarefa 1: Duplicar a Classe Modelo
1. Pressione **Ctrl + Shift + A** e procure pela classe **/LRN/CL_S4D400_BTT_DEBUG**.
2. No **Project Explorer**, clique com o botão direito sobre a classe e escolha **Duplicate...**.
3. No campo de pacote, informe seu pacote (**`ZS4D400_##`**) e nomeie a nova classe como **`ZCL_##_DEBUG`**.
4. Confirme a Transport Request e clique em **Finish**.
5. Ative (**Ctrl + F3**) e execute (**F9**) para ver a saída padrão no console.

---

### Tarefa 2: Inserir Breakpoint e Iniciar a Sessão
1. Localize a linha de código executável:
   ```abap
   loan_remaining = loan_total.
   ```
2. Dê um duplo clique na margem esquerda da linha para definir o **Breakpoint**.
3. Execute a classe com **F9**. O Eclipse perguntará se deseja alternar para a perspectiva **ABAP Debug**; confirme clicando em **OK**.
4. Dê um duplo clique nas variáveis `loan_remaining` e `loan_total` para exibi-las na aba **Variables**.

---

### Tarefa 3: Navegação Passo a Passo e Watchpoints
1. Pressione **F5 (Step Into)** para executar a atribuição. Observe que o valor de `loan_remaining` muda de `0.00` para `5000.00`.
2. Dê um duplo clique em `spec_repay_mode` e pressione **F5** para ver o salto dentro do `CASE` até o ramo correspondente (`WHEN 'Q'`).
3. **Criar Watchpoint:** Na aba *Variables*, clique com o botão direito em `LOAN_REMAINING` e escolha **Set Watchpoint**.
4. Pressione **F8 (Resume)**: o debugger executará em alta velocidade e parará sozinho na linha onde o saldo do empréstimo é debitado.
5. Dê um duplo clique na tabela interna `repayment_plan` e pressione **F5** no comando `APPEND` para ver a primeira linha sendo inserida na aba *ABAP Internal Table*.
6. **Criar Statement Breakpoint:** Na aba **Breakpoints**, selecione **Add Statement Breakpoint...**, digite `EXIT` e clique em **OK**.
7. Remova os watchpoints anteriores na aba *Breakpoints* (botão direito $\rightarrow$ *Remove*).
8. Pressione **F8** para avançar direto até a instrução de saída `EXIT`.
9. Desmarque o Statement Breakpoint na lista e pressione **F5** até alcançar a linha `out->write(...)`.
10. **Atenção ao Step Over (F6):** Na linha `out->write(...)`, utilize **F6** (e não F5), para evitar entrar nos métodos internos do framework de console da SAP.
11. Ao finalizar a execução, volte para a perspectiva clássica clicando no botão **ABAP** no canto superior direito do Eclipse.

---

## 📌 Termos e Conceitos para Adicionar em `03_Resources/SAP/Conceitos`

Abaixo estão os conceitos fundamentais apresentados nesta lição recomendados para criação de notas dedicadas na pasta `03_Resources/SAP/Conceitos`:

- `[[Depuração no ABAP (Debugger no Eclipse ADT)]]` — Operação da perspectiva Debug, inspeção de variáveis e controle do fluxo em tempo de execução.
- `[[Navegação no Debugger (F5, F6, F7, F8)]]` — Diferença prática entre Step Into (F5), Step Over (F6), Step Return (F7) e Resume (F8).
- `[[Breakpoints Especiais e Watchpoints]]` — Configuração de paradas condicionais, por comando (Statement), por exceção e monitoramento de variáveis com Watchpoints.
- `[[Inspeção e Alteração de Tabelas Internas no Debugger]]` — Visualização detalhada e edição dinâmica de linhas em memória no ambiente de testes.
