---
tipo: clippings
source: "https://learning.sap.com/courses/deepening-your-abap-programming-knowledge"
created: 2026-11-03
tags:
  - sap
  - abap
  - abap-cloud
  - quiz
  - certificacao
  - excecoes
---

# 3 - Quiz: Defining and Working with Exception Classes

> [!NOTE] Instruções
> Teste os seus conhecimentos sobre os conceitos do **Módulo 08: Defining and Working with Exception Classes**. Responda às perguntas e depois expanda a seção de gabarito para verificar a resposta correta e a explicação detalhada.

---

### Questão 1
Qual é a classe raiz da qual **todas** as classes de exceção no ABAP descendem, e qual é a regra sobre herança direta dessa classe?

A) `CX_EXCEPTION`; qualquer classe customizada pode herdá-la diretamente.  
B) `CX_ROOT`; nenhuma classe customizada pode herdá-la diretamente, devendo herdar de `CX_STATIC_CHECK`, `CX_DYNAMIC_CHECK` ou `CX_NO_CHECK`.  
C) `CL_MESSAGE_HANDLER`; herança permitida apenas para mensagens do tipo `E` ou `A`.  
D) `OBJECT`; todas as exceções herdam diretamente de `OBJECT` sem classes intermediárias.

> [!success]- Gabarito e Explicação
> **Resposta Correta: B**  
> **Explicação:** `CX_ROOT` é a superclasse abstrata raiz de toda a hierarquia de exceções no ABAP. No entanto, a sintaxe do ABAP proíbe que qualquer classe herde diretamente de `CX_ROOT`. Toda exceção (seja padrão do sistema ou customizada de negócio) deve derivar obrigatoriamente de uma das três subárvores: `CX_STATIC_CHECK`, `CX_DYNAMIC_CHECK` ou `CX_NO_CHECK`.

---

### Questão 2
Ao criar uma classe de exceção customizada para regras de negócio (como validação de estoque ou limite de crédito de clientes), qual superclasse é a **mais recomendada** e por quê?

A) `CX_NO_CHECK`, pois evita a necessidade de escrever blocos `TRY...CATCH` no código consumidor.  
B) `CX_DYNAMIC_CHECK`, porque ignora erros em tempo de desenvolvimento e resolve apenas em produção.  
C) `CX_STATIC_CHECK`, pois o compilador verifica estaticamente a propagação e obriga que ela seja tratada localmente ou declarada na assinatura com `RAISING`.  
D) `CX_SY_PROGRAM_ERROR`, para que o sistema gere automaticamente um short dump detalhado.

> [!success]- Gabarito e Explicação
> **Resposta Correta: C**  
> **Explicação:** `CX_STATIC_CHECK` é o padrão ouro para regras de negócio porque suas exceções são **verificadas pelo compilador** (*checked exceptions*). Isso garante segurança arquitetural: quem chamar o seu método é estritamente obrigado a tratar o erro ou declará-lo explicitamente com a cláusula `RAISING`, evitando que falhas de negócio passem despercebidas.

---

### Questão 3
Como podemos disparar uma exceção diretamente a partir de uma expressão condicional (`COND` ou `SWITCH`) no ABAP moderno?

A) Usando o comando `RAISE EXCEPTION` dentro da cláusula `THEN`.  
B) Utilizando a palavra-chave **`THROW`** seguida do nome da classe de exceção e seus parâmetros.  
C) Invocando o método estático `cx_root=>raise_inline( )`.  
D) Não é possível disparar exceções dentro de expressões condicionais, sendo obrigatório o uso de comandos `IF...ELSE`.

> [!success]- Gabarito e Explicação
> **Resposta Correta: B**  
> **Explicação:** O operador condicional **`THROW`** foi introduzido a partir do ABAP 7.40 para permitir o lançamento expressivo de exceções diretamente no interior de expressões construtoras, tais como `COND` e `SWITCH` (ex: `ELSE THROW zcx_invalid_parameter( )`).

---

### Questão 4
Por que a ordem dos blocos `CATCH` dentro de uma estrutura `TRY ... ENDTRY` é crucial para o correto tratamento de falhas?

A) Porque blocos `CATCH` são executados aleatoriamente em paralelo por diferentes threads.  
B) Porque o runtime avalia os blocos `CATCH` sequencialmente de cima para baixo; colocar uma superclasse genérica (como `CX_ROOT`) antes de uma subclasse específica impede que a subclasse seja executada.  
C) Porque o compilador acusa erro de sintaxe se as exceções não estiverem em ordem alfabética.  
D) Porque as exceções da superclasse só capturam erros se estiverem na última posição do método.

> [!success]- Gabarito e Explicação
> **Resposta Correta: B**  
> **Explicação:** A avaliação dos blocos `CATCH` ocorre em sequência, de cima para baixo. A primeira cláusula `CATCH` compatível com o tipo da exceção disparada captura o erro e encerra a avaliação. Portanto, as subclasses especializadas devem vir sempre antes de suas superclasses. Se `CATCH cx_root` for colocado no topo, ele capturará qualquer exceção, tornando todos os `CATCH` subsequentes código morto inalcançável.

---

### Questão 5
Qual é o propósito específico do bloco **`CLEANUP`** dentro de uma estrutura `TRY ... ENDTRY`?

A) Tratar o erro silenciosamente sem propagá-lo para quem chamou o método.  
B) Limpar a tela e fechar a sessão do usuário no SAP GUI.  
C) Executar rotinas de limpeza (como fechar conexões ou liberar bloqueios) caso ocorra uma exceção no bloco `TRY` que não seja capturada por nenhum `CATCH` local e precise ser propagada.  
D) Reinicializar todas as variáveis globais do programa para valores iniciais antes de chamar o próximo `SELECT`.

> [!success]- Gabarito e Explicação
> **Resposta Correta: C**  
> **Explicação:** O bloco `CLEANUP` não captura nem interrompe a propagação da exceção. Ele é disparado exclusivamente quando uma exceção é lançada dentro do `TRY` e nenhum `CATCH` local a trata, subindo a pilha de chamadas. Sua finalidade é restaurar o estado consistente do bloco local (por exemplo, liberando recursos ou fechando arquivos) antes que o controle saia da unidade atual.

---

### Questão 6
Ao capturar uma exceção técnica de baixo nível e relançar uma exceção de negócio para o chamador, como preservamos o rastreamento da causa raiz original (*Exception Chaining*)?

A) Gravando uma mensagem temporária na tabela interna `sy-msgv1`.  
B) Passando a instância da exceção original para o atributo/parâmetro **`previous`** da nova exceção.  
C) Copiando o conteúdo de `sy-subrc` para a variável `sy-tabix`.  
D) Chamando `cx_root=>preserve_stack( )`.

> [!success]- Gabarito e Explicação
> **Resposta Correta: B**  
> **Explicação:** Todas as exceções derivadas de `CX_ROOT` contêm o atributo público **`previous`**, que aceita uma referência a outro objeto `CX_ROOT`. Esse mecanismo de encadeamento (*Chaining*) permite associar a exceção original (causa raiz técnica) à nova exceção de negócio relançada, preservando a pilha de diagnóstico nos logs.

---

### Questão 7
Qual interface padrão do SAP deve ser implementada por uma classe de exceção para que ela possa utilizar textos traduzíveis configurados em uma **Classe de Mensagens (SE91)**?

A) `IF_MESSAGE_DISPLAY`  
B) `IF_T100_MESSAGE` (ou `IF_T100_DYN_MSG`)  
C) `IF_BAPI_RETURN`  
D) `IF_SY_MSG`

> [!success]- Gabarito e Explicação
> **Resposta Correta: B**  
> **Explicação:** A interface **`IF_T100_MESSAGE`** (e sua variante dinâmica moderna `IF_T100_DYN_MSG`) é o padrão da SAP para vincular classes de exceção a mensagens da tabela `T100` (transação SE91). Ela utiliza a estrutura `SCX_T100KEY` para preencher os identificadores da mensagem e mapear variáveis `&1` a `&4` para atributos da classe.

---

### Questão 8
O que ocorre em tempo de execução se uma exceção herdada de **`CX_DYNAMIC_CHECK`** for disparada, não for capturada localmente com `CATCH`, e o método chamador **não** a tiver declarado na sua assinatura com a cláusula `RAISING`?

A) O compilador bloqueia a execução antes mesmo de iniciar o programa.  
B) O sistema converte o erro na exceção de sistema **`CX_NO_HANDLER`**, resultando em um *short dump* imediato se não houver um tratador superior.  
C) A exceção é descartada e o método retorna o valor inicial sem sinalizar falha.  
D) O método entra em loop recursivo até encontrar uma classe abstrata.

> [!success]- Gabarito e Explicação
> **Resposta Correta: B**  
> **Explicação:** Exceções do tipo `CX_DYNAMIC_CHECK` não são verificadas pelo compilador. Por isso, se uma exceção dessa categoria escapar de um método cuja assinatura não contenha a cláusula `RAISING`, o runtime intercepta essa violação e dispara a exceção não tratável **`CX_NO_HANDLER`**, provocando a interrupção da execução (*short dump*).
