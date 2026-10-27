---
tipo: teste-notebooklm
tags:
  - sap
  - abap
  - abap-cloud
  - teste
modulo: 3
dificuldade: medio
tentativa: 1
score: 0%
aprovado: false
data: 2026-10-27
---

# 📝 Bateria de Teste: Nível Médio - Módulo 3 (Working with Local Classes)

> [!NOTE] Instruções de Estudo Ativo
> Este teste avalia a compreensão prática de **assinaturas de métodos, passagem de parâmetros, encapsulamento de dados, construtores e gerenciamento de coleções de objetos** no ABAP OO.  
> Responda a todas as 10 questões antes de expandir o bloco de gabarito.  
> **Meta para aprovação:** ≥ 90% de acertos (mínimo de 9 em 10 questões).

---

### Questão 1
Considere a definição do método abaixo:

```abap
METHODS set_carrier
  IMPORTING
    i_carrier_id TYPE /dmo/carrier_id.
```

O que acontece se o desenvolvedor tentar modificar o valor de `i_carrier_id` dentro do bloco `METHOD ... ENDMETHOD` (por exemplo: `i_carrier_id = 'LH'.`)?

- **A.** O valor é alterado localmente e devolvido ao chamador automaticamente
- **B.** Ocorre um erro de sintaxe durante a compilação, pois parâmetros `IMPORTING` são somente leitura dentro do método
- **C.** O código compila normalmente, mas dispara uma exceção em tempo de execução
- **D.** O parâmetro só pode ser modificado se for do tipo `string`

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **B**  
> **Conceito:** No ABAP, parâmetros `IMPORTING` são estritamente protegidos contra escrita dentro da implementação do método. Qualquer tentativa de atribuir valor a um parâmetro de importação resulta em erro de sintaxe imediato do compilador. Para permitir alterações, deve-se usar um parâmetro do tipo `CHANGING`.

---

### Questão 2
Para que um método seja classificado formalmente como um **Método Funcional** (*Functional Method*) no ABAP, qual requisito de assinatura ele deve cumprir obrigatoriamente?

- **A.** Ter exatamente um parâmetro `IMPORTING` e nenhum parâmetro `EXPORTING`
- **B.** Ter exatamente um parâmetro `RETURNING` passado por valor (`VALUE(...)`)
- **C.** Não possuir nenhuma cláusula `RAISING`
- **D.** Ser declarado exclusivamente na `PUBLIC SECTION` com a instrução `CLASS-METHODS`

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **B**  
> **Conceito:** Um método funcional no ABAP é definido pela presença de exatamente um parâmetro `RETURNING VALUE(r_result)`. Isso permite que o método seja chamado diretamente no lado direito de atribuições ou como operando em expressões lógicas e aritméticas (ex: `DATA(lv_txt) = oref->get_output( ).`).

---

### Questão 3
Um desenvolvedor deseja declarar um atributo de instância público `total_amount`, mas quer impedir que programas externos alterem diretamente o seu valor, permitindo apenas que seja lido de fora. Qual é a forma correta de declarar esse atributo?

- **A.** `DATA total_amount TYPE p DECIMALS 2 PRIVATE.`
- **B.** `CONSTANTS total_amount TYPE p DECIMALS 2.`
- **C.** `DATA total_amount TYPE p DECIMALS 2 READ-ONLY.` na `PUBLIC SECTION.`
- **D.** `CLASS-DATA total_amount TYPE p DECIMALS 2 FINAL.`

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **C**  
> **Conceito:** A adição `READ-ONLY` só é permitida na `PUBLIC SECTION` da classe. Ela permite livre leitura externa do atributo, mas bloqueia tentativas de modificação vindas de fora da classe. O atributo só pode ter seu valor alterado pelos métodos internos da própria classe.

---

### Questão 4
Quais tipos de parâmetros são **estritamente permitidos** na assinatura de um **Construtor de Instância** (`METHODS constructor`) no ABAP? (Escolha duas opções)

- **A.** Parâmetros `IMPORTING`
- **B.** Parâmetros `EXPORTING`
- **C.** Parâmetros `CHANGING`
- **D.** Exceções (`RAISING`)

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **A, D**  
> **Conceito:** O construtor de instância é executado automaticamente durante a instanciação (`NEW #( )`). Por definição de arquitetura do ABAP, ele só pode receber dados de entrada para configurar o objeto inicial via parâmetros `IMPORTING` e sinalizar falhas de validação via `RAISING`. Parâmetros `EXPORTING`, `CHANGING` ou `RETURNING` são proibidos em construtores.

---

### Questão 5
Analise o trecho de código abaixo dentro de um método da classe `lcl_connection`:

```abap
METHOD set_data.
  carrier_id = carrier_id.
ENDMETHOD.
```

Sabendo que `carrier_id` é o nome de um atributo da classe e também o nome do parâmetro `IMPORTING` do método, como o desenvolvedor deve reescrever a linha para atribuir o valor do parâmetro ao atributo da instância?

- **A.** `THIS->carrier_id = carrier_id.`
- **B.** `SELF->carrier_id = carrier_id.`
- **C.** `me->carrier_id = carrier_id.`
- **D.** `lcl_connection=>carrier_id = carrier_id.`

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **C**  
> **Conceito:** Em ABAP Orientado a Objetos, o pseudo-atributo **`me->`** referencia a própria instância atual. Quando o nome do parâmetro coincide com o nome de um atributo de instância, utiliza-se `me->atributo = parametro.` para desambiguar e garantir a atribuição correta.

---

### Questão 6
Como se declara e popula adequadamente uma **coleção de múltiplos objetos** em memória RAM usando tabelas internas no ABAP moderno?

- **A.** `DATA lt_objs TYPE TABLE OF lcl_connection.`
- **B.** `DATA lt_objs TYPE TABLE OF REF TO lcl_connection.` seguido de `APPEND connection TO lt_objs.`
- **C.** `DATA lt_objs TYPE OBJECT_LIST OF lcl_connection.`
- **D.** `DATA lt_objs TYPE REF TO TABLE OF lcl_connection.`

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **B**  
> **Conceito:** Objetos não são armazenados por valor dentro de tabelas internas, mas sim por referência. A declaração padrão é `DATA <nome_tabela> TYPE TABLE OF REF TO <nome_da_classe>.`. Ao instanciar cada objeto, adiciona-se sua referência à tabela usando `APPEND <ref> TO <tabela>.`.

---

### Questão 7
Considere a chamada de método abaixo:

```abap
connection->set_attributes(
  EXPORTING
    i_carrier_id    = 'LH'
    i_connection_id = '0400'
).
```

Por que a palavra-chave `EXPORTING` é usada pelo chamador para preencher parâmetros que foram definidos como `IMPORTING` na assinatura do método?

- **A.** Porque houve um erro de digitação do programador e o código não compila
- **B.** Porque o chamador está "exportando" dados para dentro do método receptor
- **C.** Porque no ABAP Cloud a palavra `EXPORTING` substituiu a palavra `IMPORTING`
- **D.** Porque `set_attributes` é um método estático disfarçado

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **B**  
> **Conceito:** A perspectiva da assinatura inverte-se na chamada: o que para o método é entrada de dados (`IMPORTING`), para o programa chamador representa a entrega/saída de dados (`EXPORTING`). No ABAP moderno, quando o método só possui parâmetros de importação, a palavra-chave `EXPORTING` na chamada é inclusive opcional.

---

### Questão 8
Qual atalho no Eclipse ADT permite preencher automaticamente toda a assinatura de parâmetros de um método ao chamá-lo com o seletor `->`?

- **A.** Digitar `->`, pressionar **Ctrl + Espaço**, escolher o método e pressionar **Shift + Enter**
- **B.** Digitar `->` e pressionar **F2** duas vezes
- **C.** Pressionar **Alt + Shift + S**
- **D.** Pressionar **Ctrl + F11**

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **A**  
> **Conceito:** No Eclipse ADT, ao digitar o seletor `->` ou `**=>**` e acionar o preenchimento de código (**Ctrl + Espaço**), selecionar o método desejado e pressionar **Shift + Enter** insere automaticamente o nome do método com todos os seus parâmetros e bloco de tratamento de exceções esqueleto.

---

### Questão 9
Sobre o **Construtor Estático** (`CLASS_CONSTRUCTOR`) no ABAP, assinale a afirmação verdadeira:

- **A.** Pode ser invocado a qualquer momento usando `lcl_classe=>class_constructor( )`
- **B.** Pode receber parâmetros de importação obrigatórios configurados pelo chamador
- **C.** É disparado automaticamente pelo runtime exatamente uma vez, no primeiro acesso à classe durante a execução
- **D.** É executado toda vez que uma nova instância da classe é criada pelo comando `NEW #( )`

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **C**  
> **Conceito:** O construtor estático (`CLASS_CONSTRUCTOR`) inicializa o estado estático da classe. Ele não pode ser chamado explicitamente, não aceita parâmetros nem dispara exceções, e é executado automaticamente pelo runtime uma única vez quando a classe é acessada pela primeira vez (seja por chamada a método estático ou por instanciação).

---

### Questão 10
Ao instanciar uma classe com o operador moderno `NEW`, como parâmetros de inicialização são passados para o construtor da classe?

- **A.** `connection = NEW #( ) WITH ( i_carrier_id = 'AA' ).`
- **B.** `connection = NEW #( i_carrier_id = 'AA' i_connection_id = '0017' ).`
- **C.** `connection = NEW #( )->constructor( i_carrier_id = 'AA' ).`
- **D.** `connection = NEW #( USING i_carrier_id = 'AA' ).`

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **B**  
> **Conceito:** Os parâmetros de importação do método construtor são fornecidos diretamente entre os parênteses da expressão `NEW #( ... )`, separando os parâmetros por espaço. Não se chama o construtor explicitamente como método.

---
