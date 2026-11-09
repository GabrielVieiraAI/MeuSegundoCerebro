---
tipo: flashcards
tags:
  - sap
  - abap
  - abap-cloud
  - flashcards
modulo: 3
curso: "Learning Basic ABAP Programming"
data_criacao: 2026-10-27
---

# 🗂️ Flashcards: Módulo 3 - Working with Local Classes

**Deck Principal:** `#flashcards/sap/abap-cloud/modulo-03`  
**Painel de Revisão:** [[01_Projects/SAP Certified - Backend Developer - ABAP Cloud/Acquiring Core ABAP Skills/1 - Learning Basic ABAP Programming/3 - Working with Local Classes/Revisao Ativa|Revisao Ativa - Modulo 03]]  
**Quiz Oficial:** [[01_Projects/SAP Certified - Backend Developer - ABAP Cloud/Acquiring Core ABAP Skills/1 - Learning Basic ABAP Programming/3 - Working with Local Classes/5 - Quiz|Quiz Oficial do Módulo 3]]

---

#flashcards/sap/abap-cloud/modulo-03

### 1. Definição e Estrutura de Classes Locais

Qual a diferença de visibilidade e escopo entre uma Classe Global e uma Classe Local no ABAP?
?
* **Classe Global (`ZCL_*`):** Armazenada no repositório central (*Class Pool*), visível e reutilizável por todo o sistema.
* **Classe Local (`lcl_*`):** Declarada na aba **Local Types** de uma classe global, visível exclusivamente no arquivo/programa em que foi criada (ideal para classes auxiliares e testes unitários).

Quais são os dois blocos estruturais obrigatórios de uma classe completa em ABAP?::O bloco de **Definição** (`CLASS ... DEFINITION. ... ENDCLASS.`), que declara tipos, atributos e métodos; e o bloco de **Implementação** (`CLASS ... IMPLEMENTATION. ... ENDCLASS.`), que contém o código executável dos métodos.

Qual é a ordem estrita e obrigatória das seções de visibilidade no bloco DEFINITION de uma classe ABAP?::A ordem deve ser rigorosamente decrescente de visibilidade: **`PUBLIC SECTION.`** $\rightarrow$ **`PROTECTED SECTION.`** $\rightarrow$ **`PRIVATE SECTION.`**. Nenhuma declaração de componente é permitida fora dessas seções.

Qual a diferença entre um Atributo de Instância (DATA) e um Atributo Estático (CLASS-DATA)?
?
* **Atributo de Instância (`DATA`):** Cada objeto criado na memória possui sua própria cópia independente do valor.
* **Atributo Estático (`CLASS-DATA`):** Existe uma única cópia compartilhada por todas as instâncias da classe. Alterações no valor refletem para todos os objetos.

Qual atalho e template no Eclipse ADT geram rapidamente o esqueleto de uma classe local na aba Local Types?::Na aba **Local Types**, digite **`lcl`**, pressione **Ctrl + Espaço** e selecione o template **`lcl - Local class`**.

---

### 2. Instanciação, Variáveis de Referência e Ciclo de Vida

O que é uma Variável de Referência (TYPE REF TO) e qual seu valor inicial antes da instanciação?::É uma variável que não guarda os dados do objeto diretamente, mas sim um ponteiro para o endereço de memória alocado. Seu estado inicial é nulo (`initial / null`).

O que acontece em tempo de execução se você tentar acessar atributos ou métodos usando uma referência nula?::O programa aborta imediatamente com erro fatal de execução (*Runtime Error / Short Dump*) do tipo **`OBJECTS_OBJREF_NOT_ASSIGNED`**.

Como instanciar um objeto no ABAP moderno usando o operador construtor NEW e o que significa o caractere cerquilha (#)?::Utiliza-se a sintaxe `connection = NEW #( ).`. O símbolo **`#`** indica inferência de tipo: o compilador consulta o tipo declarado da variável de referência e instancia a classe correspondente.

Qual a regra obrigatória de espaçamento para o seletor estático (**`=>`**) e de instância (->)?::Não são permitidos espaços em branco antes ou depois dos seletores. Exemplos válidos: `lcl_classe**=>**atributo` e `oref->metodo( )`.

O que acontece na memória ao executar a instrução ref2 = ref1 quando ref1 já aponta para um objeto?::O sistema apenas copia o endereço de memória (ponteiro). Continua existindo **um único objeto alocado**, agora referenciado por duas variáveis distintas.

Como funciona a atuação do Garbage Collector no ABAP para desalocar instâncias de objetos órfãos?::Quando uma instância perde todas as suas variáveis de referência (por exemplo, quando o ponteiro é sobrescrito por `NEW #( )`), ela se torna inalcançável. O *Garbage Collector* varre periodicamente a memória e destrói esses objetos órfãos, liberando memória RAM.

Como manter múltiplos objetos vivos na memória RAM sem perder suas referências para o Garbage Collector?::Armazenando as referências em uma tabela interna de objetos declarada com: `DATA connections TYPE TABLE OF REF TO lcl_classe.`, adicionando cada nova referência com `APPEND connection TO connections.`.

---

### 3. Métodos: Assinatura, Parâmetros e Execução

Quais instruções são utilizadas para definir métodos de instância e métodos estáticos?::Utiliza-se **`METHODS`** para métodos de instância e **`CLASS-METHODS`** para métodos estáticos.

Quais são os 4 tipos de parâmetros que podem compor a assinatura de um método no ABAP?
?
* **`IMPORTING`:** Valores de entrada fornecidos pelo chamador (read-only por padrão dentro do método).
* **`EXPORTING`:** Resultados calculados e devolvidos pelo método para o chamador.
* **`CHANGING`:** Valores recebidos que o método pode modificar e devolver sob o mesmo identificador.
* **`RETURNING`:** Resultado único devolvido por valor para uso direto em expressões.

Como tornar parâmetros de entrada (IMPORTING) opcionais em um método ABAP?
?
* **Adição `OPTIONAL`:** Torna o parâmetro opcional; se não informado, assume o valor inicial padrão do tipo.
* **Adição `DEFAULT <val>`:** Torna o parâmetro opcional e define um valor padrão caso o chamador não o envie.

O que caracteriza tecnicamente um Método Funcional (Functional Method) no ABAP?::É um método que possui obrigatoriamente **exatamente um único parâmetro de retorno** (`RETURNING VALUE(...)`), permitindo sua invocação direta como operando dentro de expressões (ex: `DATA(res) = oref->calcular( ).`).

Qual cláusula é utilizada na assinatura do método para declarar que ele pode disparar exceções tratáveis?::A palavra-chave **`RAISING`** seguida pelo nome das classes de exceção (ex: `RAISING cx_abap_invalid_value`).

Para que serve o pseudo-atributo me-> dentro da implementação de um método?::Serve como referência explícita à própria instância atual do objeto, sendo indispensável para resolver ambiguidades quando um parâmetro possui o mesmo nome de um atributo da classe (`me->carrier_id = carrier_id.`).

---

### 4. Encapsulamento, Construtores e Consistência

O que é Encapsulamento de Dados e qual sua principal vantagem prática na programação orientada a objetos?::É a prática de ocultar atributos internos do objeto para impedir acessos e alterações diretas externas descontroladas, forçando que as mudanças passem por métodos que validam regras de negócio e integridade.

Como proteger um atributo público contra alterações externas sem ocultá-lo completamente da leitura?::Adicionando o complemento **`READ-ONLY`** na declaração dentro da `PUBLIC SECTION` (ex: `DATA attr TYPE string READ-ONLY.`). A leitura externa permanece permitida, mas a escrita só é aceita dentro dos métodos da própria classe.

Quando e quantas vezes o Construtor de Instância (METHODS constructor) é executado?::É invocado automaticamente pelo sistema de tempo de execução (*runtime*) **uma única vez** no momento exato em que a instância é criada (`NEW #( )`). Ele não pode ser chamado explicitamente.

Quais tipos de parâmetros são permitidos e quais são proibidos na assinatura do Construtor de Instância?
?
* **Permitidos:** Parâmetros de entrada (**`IMPORTING`**) e exceções (**`RAISING`**).
* **Proibidos:** Parâmetros **`EXPORTING`** e **`CHANGING`** não são suportados na assinatura do construtor de instância.

Quando o Construtor Estático (CLASS_CONSTRUCTOR) é executado e quais parâmetros ele aceita?::É executado automaticamente uma única vez quando a classe é acessada pela primeira vez durante a execução do programa (seja ao chamar um método estático ou na primeira instanciação). Ele **não aceita nenhum parâmetro nem exceções**.

Como passar parâmetros de inicialização ao construtor usando o operador moderno NEW?::Passam-se os parâmetros de importação diretamente entre os parênteses da expressão construtora: `connection = NEW #( i_carrier_id = 'LH' i_connection_id = '0400' ).`.

Qual a forma correta de invocar o método estático my_method da classe my_class respeitando as regras de sintaxe do ABAP?::`my_class**=>**my_method( ).` — utilizando o seletor estático (**`=>`**) sem espaços colados e mantendo os espaços em branco obrigatórios dentro dos parênteses.
