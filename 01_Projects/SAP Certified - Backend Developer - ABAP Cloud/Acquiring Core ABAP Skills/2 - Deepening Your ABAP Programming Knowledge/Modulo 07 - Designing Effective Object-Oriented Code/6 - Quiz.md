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
  - orientacao-a-objetos
---

# 6 - Quiz: Designing Effective Object-Oriented Code

> [!NOTE] Instruções
> Teste os seus conhecimentos sobre os conceitos do **Módulo 07: Designing Effective Object-Oriented Code**. Responda às perguntas e depois expanda a seção de gabarito para verificar a resposta correta e a explicação detalhada.

---

### Questão 1
Qual das seguintes afirmações sobre a implementação de **Herança** em ABAP OO está **correta**?

A) Uma classe ABAP pode herdar simultaneamente de duas ou mais superclasses distintas usando vírgulas na cláusula `INHERITING FROM`.  
B) O ABAP suporta apenas herança simples para classes, o que significa que uma subclasse pode ter no máximo uma única superclasse direta.  
C) Toda classe ABAP que não declara `INHERITING FROM` herda automaticamente da classe do sistema `cl_root_node`.  
D) Métodos estáticos (`CLASS-METHODS`) podem ser redefinidos em subclasses utilizando a instrução `CLASS-METHODS ... REDEFINITION`.

> [!success]- Gabarito e Explicação
> **Resposta Correta: B**  
> **Explicação:** No ABAP, a herança entre classes é estritamente **simples** (*single inheritance*). Uma classe só pode ter uma única superclasse direta. Para suportar múltiplos contratos de comportamento, o ABAP utiliza **Interfaces**. Além disso, a classe raiz implícita de todas as classes é a classe abstrata `object` (e não `cl_root_node`), e métodos estáticos não podem ser redefinidos.

---

### Questão 2
Ao **redefinir um método** (`METHODS ... REDEFINITION`) em uma subclasse, quais regras devem ser rigorosamente respeitadas?

A) O método pode ser transferido da seção `PROTECTED` para a seção `PUBLIC` a fim de aumentar sua visibilidade.  
B) A subclasse pode adicionar novos parâmetros opcionais do tipo `IMPORTING` na redefinição.  
C) A redefinição deve ocorrer na mesma seção de visibilidade em que o método foi declarado na superclasse, e sua assinatura original não pode ser modificada.  
D) Apenas métodos declarados como `FINAL` na superclasse podem ser marcados com `REDEFINITION`.

> [!success]- Gabarito e Explicação
> **Resposta Correta: C**  
> **Explicação:** A redefinição de um método no ABAP exige que a instrução ocorra na **mesma seção de visibilidade** (`PUBLIC` ou `PROTECTED`) do método original da superclasse. A assinatura de parâmetros (`IMPORTING`, `EXPORTING`, `CHANGING`, `RETURNING` e exceções) deve ser preservada rigorosamente idêntica. Métodos `FINAL` não podem ser redefinidos de forma alguma.

---

### Questão 3
Você redefiniu um método na subclasse `lcl_truck`, mas deseja que ele execute a implementação original da superclasse `lcl_vehicle` antes de executar a sua própria lógica. Como essa chamada deve ser feita dentro do método da subclasse?

A) `CALL METHOD parent->display_info( ).`  
B) `ME->display_info( ).`  
C) `SUPER->display_info( ).`  
D) `lcl_vehicle=>display_info( ).`

> [!success]- Gabarito e Explicação
> **Resposta Correta: C**  
> **Explicação:** A pseudo-referência **`SUPER->`** é o mecanismo oficial e padronizado em ABAP OO para invocar a implementação do método da superclasse a partir de um método redefinido em uma subclasse. Chamar `ME->` provocaria uma chamada recursiva infinita à própria implementação da subclasse.

---

### Questão 4
Considere o seguinte trecho de código:
```abap
DATA lo_vehicle TYPE REF TO lcl_vehicle. " Superclasse
DATA lo_truck   TYPE REF TO lcl_truck.   " Subclasse que herda de lcl_vehicle

lo_truck = NEW lcl_truck( ).
lo_vehicle = lo_truck.
```
Qual conceito e tipo de atribuição é demonstrado na linha `lo_vehicle = lo_truck.`?

A) Widening Cast (Downcast), que requer obrigatoriamente o operador `?=`.  
B) Narrowing Cast (Upcast), que é sempre seguro em tempo de compilação e pode ser feito por atribuição simples (`=`).  
C) Cópia profunda de atributos por valor.  
D) Instanciação polimórfica tardia.

> [!success]- Gabarito e Explicação
> **Resposta Correta: B**  
> **Explicação:** Atribuir uma referência de uma subclasse para uma variável de referência da superclasse é um **Narrowing Cast** (ou *Upcast*). Como todo `lcl_truck` *é-um* `lcl_vehicle`, essa operação é 100% segura e validada estaticamente em tempo de compilação, permitindo o uso da atribuição direta `=`.

---

### Questão 5
O que acontece em tempo de execução se você tentar realizar um **Widening Cast** (Downcast) para uma subclasse incompatível com o objeto armazenado na variável, sem tratar exceções?
*(Exemplo: tentar converter um objeto de `lcl_bus` para `lo_truck = CAST lcl_truck( lo_vehicle )`)*

A) A variável de destino recebe o valor nulo (`INITIAL`) silenciosamente sem erro.  
B) O compilador acusa erro de sintaxe e impede a ativação do programa.  
C) É disparada a exceção de tempo de execução **`CX_SY_MOVE_CAST_ERROR`**, gerando um *short dump* caso não seja capturada.  
D) O sistema converte automaticamente os atributos do ônibus para caminhão preenchendo os campos faltantes com valor padrão.

> [!success]- Gabarito e Explicação
> **Resposta Correta: C**  
> **Explicação:** O *Downcast* (Widening Cast) é verificado dinamicamente em tempo de execução. Se o tipo dinâmico do objeto em memória não for compatível com o tipo estático da variável de destino, o runtime ABAP dispara a exceção tratável **`CX_SY_MOVE_CAST_ERROR`**. Para evitar erros inesperados, o desenvolvedor deve usar a verificação segura com `IS INSTANCE OF` ou envolver a instrução em um bloco `TRY ... CATCH`.

---

### Questão 6
Sobre as características de uma **Interface** (`INTERFACE ... ENDINTERFACE`) em ABAP OO, assinale a opção **correta**:

A) Uma interface deve conter implementações padrão de código para métodos que as subclasses não quiserem sobrescrever.  
B) Todos os componentes declarados dentro de uma interface são implicitamente públicos (`PUBLIC`), não existindo seções protegida ou privada.  
C) Interfaces podem ser instanciadas diretamente utilizando o operador `NEW zif_interface( )`.  
D) Uma classe só pode implementar no máximo uma única interface por vez.

> [!success]- Gabarito e Explicação
> **Resposta Correta: B**  
> **Explicação:** Em ABAP OO, interfaces não possuem seções de visibilidade: todos os componentes (métodos, constantes, tipos, eventos) são **implicitamente públicos**. Interfaces nunca possuem bloco de implementação (`IMPLEMENTATION`) nem podem ser instanciadas diretamente com `NEW`. Uma classe pode implementar múltiplas interfaces.

---

### Questão 7
Dado que a classe `lcl_flight_ticket` implementa a interface `zif_printable`, analise as duas formas de chamada abaixo:
```abap
" Trecho 1:
DATA lo_ticket TYPE REF TO lcl_flight_ticket.
lo_ticket = NEW #( ).
lo_ticket->zif_printable~print_document( ).

" Trecho 2:
DATA lo_printer TYPE REF TO zif_printable.
lo_printer = NEW lcl_flight_ticket( ).
lo_printer->print_document( ).
```
Qual afirmação sobre esses trechos está **correta**?

A) O Trecho 2 apresenta erro de sintaxe, pois é obrigatório usar o operador til (`~`) mesmo através de uma referência de interface.  
B) O Trecho 1 não compila porque métodos de interface nunca podem ser acessados através de referências de classe.  
C) Ambos os trechos compilam perfeitamente; no Trecho 2, como a referência é do tipo da interface, o método é invocado diretamente sem o operador de resolução (`~`).  
D) O Trecho 2 viola o encapsulamento e executa mais lentamente que o Trecho 1.

> [!success]- Gabarito e Explicação
> **Resposta Correta: C**  
> **Explicação:** Ambos os trechos são sintaticamente válidos. Quando consumimos um método através de uma referência da própria interface (`TYPE REF TO zif_printable`), o nome do método é chamado diretamente (`lo_printer->print_document( )`). Quando consumimos através de uma referência de classe, o operador de resolução de interface (`~`) é obrigatório (`lo_ticket->zif_printable~print_document( )`), a menos que um `ALIAS` tenha sido definido.

---

### Questão 8
Qual é o objetivo principal de projetar uma classe com a adição **`CREATE PRIVATE`** combinada com um **Factory Method** público (`CLASS-METHODS get_instance`)?

A) Impedir que qualquer programa ou classe externa utilize o operador `NEW` diretamente, centralizando o controle da instanciação, permitindo padrões como *Singleton* e facilitando a injeção de dependências em testes.  
B) Tornar a classe invisível no repositório de objetos e impedir seu uso em pacotes de desenvolvimento.  
C) Garantir que todos os métodos da classe sejam estáticos e não dependam de memória de instância.  
D) Forçar que a classe só possa ser herdada por subclasses do mesmo pacote.

> [!success]- Gabarito e Explicação
> **Resposta Correta: A**  
> **Explicação:** A cláusula `CREATE PRIVATE` na definição da classe proíbe a instanciação externa direta através de `NEW`. Isso obriga os consumidores a utilizarem o Factory Method (`CLASS-METHODS`), que passa a ter controle total sobre a criação de instâncias (por exemplo, retornando uma única instância compartilhada no padrão *Singleton*, selecionando a subclasse correta ou injetando *mocks* em testes unitários com ABAP Unit).
