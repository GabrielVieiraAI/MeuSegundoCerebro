---
tipo: teste-notebooklm
tags:
  - sap
  - abap
  - abap-cloud
  - teste
modulo: 3
dificuldade: dificil
tentativa: 1
score: 0%
aprovado: false
data: 2026-10-27
---

# 📝 Bateria de Teste: Nível Difícil (Tentativa 1) - Módulo 3 (Working with Local Classes)

> [!NOTE] Instruções de Estudo Ativo
> Este teste avalia cenários complexos típicos da prova de certificação oficial da SAP: **comportamento de memória heap, atuação do Garbage Collector, exceções durante a instanciação, ordem de disparo de construtores e integridade de encapsulamento**.  
> Responda a todas as 10 questões antes de expandir o bloco de gabarito.  
> **Meta para aprovação:** ≥ 90% de acertos (mínimo de 9 em 10 questões).

---

### Questão 1
Analise a sequência de execução do código ABAP abaixo:

```abap
DATA ref1 TYPE REF TO lcl_connection.
DATA ref2 TYPE REF TO lcl_connection.

ref1 = NEW #( ).
ref1->carrier_id = 'LH'.

ref2 = ref1.
ref2->carrier_id = 'AA'.

ref1 = NEW #( ).
ref1->carrier_id = 'DL'.
```

Ao final da execução deste trecho, quantas instâncias da classe `lcl_connection` continuam ativas na memória RAM e qual é o valor de `ref2->carrier_id`?

- **A.** 1 instância ativa; `ref2->carrier_id` vale `'DL'`
- **B.** 2 instâncias ativas; `ref2->carrier_id` vale `'AA'`
- **C.** 2 instâncias ativas; `ref2->carrier_id` vale `'LH'`
- **D.** 3 instâncias ativas; `ref2->carrier_id` vale `'AA'`

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **B**  
> **Análise das Alternativas:**
> * **Por que a B é a correta:**  
>   1. `ref1 = NEW #( )` cria o **Objeto 1**.  
>   2. `ref2 = ref1` apenas copia o ponteiro; agora tanto `ref1` quanto `ref2` apontam para o **Objeto 1**. Ao alterar `ref2->carrier_id = 'AA'`, o atributo do **Objeto 1** passa a ser `'AA'`.  
>   3. `ref1 = NEW #( )` cria o **Objeto 2** e aponta `ref1` para ele. O **Objeto 1** NÃO é destruído pelo Garbage Collector porque `ref2` continua apontando para ele com valor `'AA'`.  
>   Portanto, existem exatamente **2 instâncias ativas**, e `ref2->carrier_id` é `'AA'`.

---

### Questão 2
Considere a classe `lcl_flight` que possui um construtor estático (`CLASS_CONSTRUCTOR`) e um construtor de instância (`CONSTRUCTOR`). Observe o código de consumo:

```abap
out->write( lcl_flight=>counter ).
DATA(conn1) = NEW lcl_flight( ).
DATA(conn2) = NEW lcl_flight( ).
```

Quantas vezes o método `CLASS_CONSTRUCTOR` e quantas vezes o método `CONSTRUCTOR` serão executados, respectivamente?

- **A.** `CLASS_CONSTRUCTOR` 1 vez; `CONSTRUCTOR` 2 vezes
- **B.** `CLASS_CONSTRUCTOR` 3 vezes; `CONSTRUCTOR` 2 vezes
- **C.** `CLASS_CONSTRUCTOR` 1 vez; `CONSTRUCTOR` 3 vezes
- **D.** `CLASS_CONSTRUCTOR` 0 vezes; `CONSTRUCTOR` 2 vezes

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **A**  
> **Análise das Alternativas:**
> * **`CLASS_CONSTRUCTOR`:** É executado automaticamente pelo runtime exatamente **uma única vez** no primeiro acesso a qualquer componente da classe (neste caso, na leitura de `lcl_flight=>counter`). Nas instanciações seguintes, o construtor estático não é mais invocado.
> * **`CONSTRUCTOR`:** É executado **uma vez para cada nova instância criada** via `NEW #( )`. Como foram criados dois objetos (`conn1` e `conn2`), ele é disparado 2 vezes.

---

### Questão 3
Considere o seguinte método construtor com validação de dados que pode disparar a exceção `cx_abap_invalid_value`:

```abap
DATA connection TYPE REF TO lcl_connection.

TRY.
    connection = NEW #( i_carrier_id = '' ). " ID vazio dispara exceção!
  CATCH cx_abap_invalid_value.
    out->write( 'Falha na criacao' ).
ENDTRY.

out->write( connection->carrier_id ).
```

O que acontece quando o comando `out->write( connection->carrier_id ).` for executado após o bloco `TRY ... CATCH`?

- **A.** Imprime uma string vazia no console
- **B.** O compilador impede a ativação da classe acusando erro de tipagem
- **C.** Dispara um Runtime Error fatal (`OBJECTS_OBJREF_NOT_ASSIGNED`), pois `connection` permaneceu com referência nula
- **D.** O objeto é criado com valores padrão e o programa prossegue sem erros

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **C**  
> **Análise das Alternativas:**
> * Quando uma exceção é disparada dentro do construtor durante a avaliação de `NEW #( )`, a criação do objeto é abortada antes que o ponteiro seja atribuído à variável receptora `connection`.
> * Como `connection` nunca recebeu uma instância válida, ela permanece com valor nulo (`null / initial`).
> * Ao tentar acessar `connection->carrier_id` fora do bloco de tratamento, o sistema tenta desreferenciar um ponteiro nulo, provocando o dump fatal **`OBJECTS_OBJREF_NOT_ASSIGNED`**.

---

### Questão 4
Analise o trecho de código abaixo que popula uma tabela interna de referências:

```abap
DATA connection  TYPE REF TO lcl_connection.
DATA connections TYPE TABLE OF REF TO lcl_connection.

connection = NEW #( ).
connection->carrier_id = 'LH'.
APPEND connection TO connections.

connection->carrier_id = 'AA'.
APPEND connection TO connections.
```

Quantos objetos distintos foram criados na memória e qual será o valor de `carrier_id` ao ler a primeira linha da tabela interna (`connections[ 1 ]->carrier_id`)?

- **A.** 2 objetos distintos; a primeira linha vale `'LH'`
- **B.** 1 único objeto; a primeira linha vale `'AA'`
- **C.** 1 único objeto; a primeira linha vale `'LH'`
- **D.** Ocorre erro de compilação por duplicidade de registro

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **B**  
> **Análise das Alternativas:**
> * O operador `NEW #( )` foi invocado apenas **uma vez**. Portanto, apenas **um objeto** foi alocado no heap.
> * A tabela interna armazena **duas referências que apontam exatamente para a mesma instância**.
> * Quando a linha `connection->carrier_id = 'AA'` é executada, o atributo desse único objeto é sobrescrito.
> * Ao ler `connections[ 1 ]`, acessa-se esse mesmo objeto cujo `carrier_id` agora contém `'AA'`. Para ter objetos independentes, seria necessário invocar `connection = NEW #( )` antes do segundo `APPEND`.

---

### Questão 5
Sobre a cláusula `CREATE PRIVATE` na instrução de definição de classe (`CLASS lcl_classe DEFINITION CREATE PRIVATE.`): qual é o efeito prático dessa declaração?

- **A.** Impede que a classe tenha atributos na seção pública
- **B.** Impede que métodos estáticos sejam chamados por classes externas
- **C.** Impede que qualquer consumidor externo instancie a classe com `NEW`, permitindo que apenas a própria classe (ou subclasses) crie instâncias
- **D.** Torna todos os métodos da classe privados automaticamente

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **C**  
> **Análise das Alternativas:**
> * Por padrão, toda classe é `CREATE PUBLIC`.
> * Ao definir `CREATE PRIVATE`, nenhum programa ou classe externa consegue instanciá-la diretamente via `NEW lcl_classe( )`. Essa técnica é essencial para implementar padrões de projeto como o **Singleton** ou **Factory**, onde métodos estáticos internos da classe controlam a criação de instâncias.

---

### Questão 6
Considere que um atributo estático foi declarado com:

```abap
CLASS-DATA conn_counter TYPE i READ-ONLY.
```

Onde é permitido incrementar ou modificar o valor de `conn_counter`?

- **A.** Apenas nos métodos de instância da classe
- **B.** Apenas nos métodos estáticos da classe
- **C.** Em qualquer método (de instância ou estático) implementado dentro da própria classe
- **D.** Em qualquer classe que esteja dentro do mesmo pacote de desenvolvimento

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **C**  
> **Análise das Alternativas:**
> * A restrição imposta por `READ-ONLY` afeta estritamente o código que está **fora da classe**.
> * Métodos implementados dentro da própria classe (sejam eles métodos de instância declarados com `METHODS` ou métodos estáticos com `CLASS-METHODS`) possuem privilégio irrestrito de leitura e escrita sobre os atributos da classe, podendo modificar `conn_counter` livremente.

---

### Questão 7
Qual das seguintes instruções ABAP causa um **erro de compilação (Syntax Error)** devido a regras de sintaxe estritas da linguagem?

- **A.** `out->write( lcl_connection=>conn_counter ).`
- **B.** `out->write( lcl_connection => conn_counter ).`
- **C.** `connection = NEW #( i_carrier_id = 'LH' ).`
- **D.** `DATA(conn) = NEW lcl_connection( ).`

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **B**  
> **Análise das Alternativas:**
> * O seletor de componente estático (**`=>`**) e o seletor de instância (`->`) **não aceitam nenhum espaço em branco** antes ou depois do símbolo. A instrução `lcl_connection => conn_counter` causa erro imediato de sintaxe pelo compilador ABAP.
> * A opção A está correta (`classe**=>**componente` sem espaços).
> * As opções C e D utilizam sintaxes válidas com espaços adequados dentro dos parênteses.

---

### Questão 8
Em programação orientada a objetos no ABAP, qual das seguintes afirmativas expressa com precisão o princípio do **Encapsulamento** e sua vantagem técnica?

- **A.** Encapsulamento significa dividir o programa em várias classes para reduzir o tempo de compilação
- **B.** Encapsulamento consiste em ocultar os atributos internos e garantir que o estado de um objeto só possa ser modificado através de métodos que realizem validações de consistência
- **C.** Encapsulamento significa que todos os métodos devem ser estáticos para evitar consumo de memória RAM
- **D.** Encapsulamento permite que classes herdem métodos privados de outras classes sem restrição

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **B**  
> **Análise das Alternativas:**
> * O objetivo primordial do encapsulamento é proteger a integridade dos dados (*data consistency*). Ao restringir o acesso a atributos (`PRIVATE` ou `READ-ONLY`) e expor métodos com validações, evita-se que consumidores externos insiram o objeto em um estado inconsistente ou inválido.

---

### Questão 9
Considere o seguinte trecho em que um desenvolvedor declara um método:

```abap
METHODS get_total
  IMPORTING
    i_val1 TYPE i
    i_val2 TYPE i
  RETURNING
    VALUE(r_total) TYPE i.
```

Como esse método funcional pode ser chamado de forma compacta e moderna no ABAP?

- **A.** `oref->get_total( EXPORTING i_val1 = 10 i_val2 = 20 IMPORTING r_total = DATA(res) ).`
- **B.** `CALL METHOD oref->get_total EXPORTING i_val1 = 10 i_val2 = 20 RECEIVING r_total = DATA(res).`
- **C.** `DATA(res) = oref->get_total( i_val1 = 10 i_val2 = 20 ).`
- **D.** `oref->get_total( i_val1 = 10 i_val2 = 20 ) INTO DATA(res).`

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **C**  
> **Análise das Alternativas:**
> * Por ser um método funcional (possui parâmetro `RETURNING`), sua invocação pode ser atribuída diretamente no lado direito com `DATA(res) = oref->get_total( ... ).`.
> * Como o método só possui parâmetros de importação, a palavra-chave `EXPORTING` é opcional na chamada funcional moderna.

---

### Questão 10
Considere a atuação do **Garbage Collector (GC)** do SAP NetWeaver / ABAP Platform. Sob qual condição exata um objeto instanciado na memória heap é marcado como elegível para coleta e liberação de memória?

- **A.** Imediatamente após o método que o instanciou alcançar o comando `ENDMETHOD`
- **B.** Apenas quando o usuário faz logoff do sistema SAP GUI ou Eclipse
- **C.** Quando não resta nenhuma variável de referência ou elemento de tabela interna apontando para o endereço de memória do objeto
- **D.** Quando o desenvolvedor executa o comando `FREE OBJECT` obrigatoriamente

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **C**  
> **Análise das Alternativas:**
> * O *Garbage Collector* opera com base na alcançabilidade (*reachability*). Uma instância permanece viva na memória enquanto houver pelo menos uma referência válida apontando para ela.
> * Assim que a última referência para o objeto for limpa (`CLEAR`), sobrescrita com outro `NEW #( )` ou sair de escopo sem ser salva em uma coleção viva, o objeto torna-se órfão (inalcançável) e é desalocado pelo coletor de lixo.

---
