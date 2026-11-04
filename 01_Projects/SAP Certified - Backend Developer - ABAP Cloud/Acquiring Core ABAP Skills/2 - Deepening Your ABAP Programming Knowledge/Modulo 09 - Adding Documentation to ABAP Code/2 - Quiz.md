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
  - abap-doc
  - documentacao
---

# 2 - Quiz: Adding Documentation to ABAP Code

> [!NOTE] Instruções
> Teste os seus conhecimentos sobre os conceitos do **Módulo 09: Adding Documentation to ABAP Code**. Responda às perguntas e depois expanda a seção de gabarito para verificar a resposta correta e a explicação detalhada.

---

### Questão 1
Qual sequência de caracteres identifica formalmente uma linha de comentário como **ABAP Doc** para que o compilador e as ferramentas do Eclipse a processem como documentação estruturada?

A) `/*` no início da linha.  
B) `"` (apenas aspas duplas simples).  
C) `"!` (aspas duplas seguidas imediatamente de um ponto de exclamação).  
D) `*!` na primeira coluna do código.

> [!success]- Gabarito e Explicação
> **Resposta Correta: C**  
> **Explicação:** No padrão ABAP Doc, cada linha de documentação técnica deve iniciar obrigatoriamente pela combinação **`"!`** (aspas duplas seguidas de exclamação). Comentários com `"` ou `*` são tratados como comentários comuns de código e são ignorados pelo motor de geração de documentação e pelo visualizador de informações do elemento.

---

### Questão 2
Onde um bloco de comentários do **ABAP Doc** deve ser posicionado no código-fonte para que seja associado corretamente a um método de classe?

A) Dentro do bloco `METHOD ... ENDMETHOD` na seção de implementação.  
B) Posicionado imediatamente antes da instrução declarativa `METHODS` na seção de definição, sem linhas em branco entre eles.  
C) No final da definição da classe, dentro de uma seção especial chamada `DOCUMENTATION SECTION`.  
D) Em um arquivo separado de include com terminação `.doc`.

> [!success]- Gabarito e Explicação
> **Resposta Correta: B**  
> **Explicação:** O ABAP Doc deve ser posicionado **imediatamente antes** da declaração do elemento (`METHODS`, `CLASS`, `DATA`, etc.) na parte de definição da classe ou interface. Se houver linhas em branco ou comentários comuns intermediários, o vínculo é quebrado e o bloco perde a associação com o elemento.

---

### Questão 3
Qual tag padronizada do ABAP Doc é utilizada para descrever os parâmetros de entrada (`IMPORTING`), saída (`EXPORTING`), modificação (`CHANGING`) ou retorno (`RETURNING`) de um método?

A) `@input` e `@output`  
B) `@param`  
C) `@parameter <nome> | <descrição>`  
D) `@var <nome>`

> [!success]- Gabarito e Explicação
> **Resposta Correta: C**  
> **Explicação:** A tag padronizada para parâmetros em ABAP Doc é **`@parameter`**, seguida do nome exato do parâmetro, uma barra vertical (`|`) separadora e a descrição explicativa. Exemplo: `"! @parameter iv_flight_date | Data do voo desejado`.

---

### Questão 4
Para documentar as **exceções baseadas em classes** que um método pode disparar e propagar (declaradas na cláusula `RAISING`), qual tag deve ser inserida no bloco de ABAP Doc?

A) `@catch`  
B) `@error`  
C) `@raising <classe_excecao> | <descrição>`  
D) `@throw`

> [!success]- Gabarito e Explicação
> **Resposta Correta: C**  
> **Explicação:** A tag **`@raising`** é usada para documentar exceções baseadas em classes. Caso o método utilize exceções clássicas legadas (em módulos de função ou métodos legados com a adição `EXCEPTIONS`), utiliza-se a tag `@exception`.

---

### Questão 5
No ambiente **ABAP Development Tools (ADT no Eclipse)**, qual atalho de teclado você pode acionar com o cursor sobre o nome de um método para gerar automaticamente o esqueleto completo do ABAP Doc preenchido com suas tags?

A) `Ctrl + Shift + F` (Pretty Printer)  
B) `F8` (Executar)  
C) `Ctrl + 1` (Quick Assist) selecionando a opção "Add ABAP Doc"  
D) `Alt + Shift + D`

> [!success]- Gabarito e Explicação
> **Resposta Correta: C**  
> **Explicação:** O recurso de *Quick Assist* do Eclipse é disparado pelo atalho **`Ctrl + 1`**. Ao acioná-lo sobre um método, o ADT sugere a ação "Add ABAP Doc", insere o bloco `"!` e insere todas as tags `@parameter` e `@raising` com os nomes exatos correspondentes aos argumentos da assinatura.

---

### Questão 6
Ao navegar pelo código no ADT, qual tecla de atalho permite ao desenvolvedor abrir a janela flutuante **Element Info**, que renderiza o ABAP Doc formatado em HTML com tipagem e hiperlinks?

A) `F1`  
B) `F2`  
C) `F3`  
D) `F11`

> [!success]- Gabarito e Explicação
> **Resposta Correta: B**  
> **Explicação:** A tecla **`F2`** no ADT (ou posicionar o cursor do mouse sobre o identificador) abre a janela *Element Info*. Nela, o Eclipse renderiza todo o conteúdo do ABAP Doc com estilo visual enriquecido em HTML, permitindo leitura rápida sem precisar navegar para a classe original.

---

### Questão 7
Qual das seguintes opções apresenta recursos de formatação HTML válidos e suportados pelo renderizador de ABAP Doc no ADT?

A) Tags de formulário e scripts como `<form>`, `<input>` e `<script>`.  
B) Folhas de estilo CSS externas com a tag `<link rel="stylesheet">`.  
C) Tags semânticas de texto como `<p>`, `<b>`, `<i>`, cabeçalhos `<h1>` até `<h3>` e listas com marcadores `<ul>` e `<li>`.  
D) Animações em SVG interativas.

> [!success]- Gabarito e Explicação
> **Resposta Correta: C**  
> **Explicação:** O renderizador do ABAP Doc suporta um subconjunto de tags HTML de formatação textual e estrutural, tais como parágrafos (`<p>`), formatação (`<b>`, `<i>`, `<em>`), títulos (`<h1>` a `<h3>`) e listas (`<ul>`, `<ol>`, `<li>`), permitindo uma apresentação organizada no *Element Info*.

---

### Questão 8
O que o compilador do ADT faz se você incluir no ABAP Doc uma tag `@parameter iv_carrier_id`, mas a assinatura do método **não** tiver nenhum parâmetro com esse nome?

A) O compilador ignora completamente e publica a documentação com o nome incorreto.  
B) O compilador aborta a sessão do Eclipse com um erro de memória.  
C) O ADT acusa um aviso (*warning*) durante a verificação de sintaxe alertando que o parâmetro documentado não existe na assinatura do método.  
D) O sistema cria automaticamente o parâmetro no método com tipo genérico `ANY`.

> [!success]- Gabarito e Explicação
> **Resposta Correta: C**  
> **Explicação:** Diferente de comentários convencionais que não são validados, o ABAP Doc é integrado ao compilador ABAP. Quando uma tag `@parameter` ou `@raising` faz referência a um identificador inexistente na assinatura do método, o ADT sinaliza um aviso (*warning* de sintaxe), garantindo que a documentação permaneça sempre sincronizada com o código real.
