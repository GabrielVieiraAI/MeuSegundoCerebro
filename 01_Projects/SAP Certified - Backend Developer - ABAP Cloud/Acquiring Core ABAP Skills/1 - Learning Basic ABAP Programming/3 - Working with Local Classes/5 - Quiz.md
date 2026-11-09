---
title: "Quiz - Working with Local Classes"
source: "https://learning.sap.com/courses/basic-abap-programming/working-with-local-classes_a9aded38-18bd-3b91-ba78-9eb4574fafe0"
created: 2026-10-21
tags:
  - sap
  - abap
  - abap-cloud
  - adt
  - quiz
---
**Roteiro de Estudos Relacionado:** [[Roteiro de Estudos SAP]]

# SAP Learning - Basic ABAP Programming
## Quiz: Trabalhando com Classes Locais (Working with Local Classes)

> [!NOTE] Instruções de Estudo Ativo
> Responda às questões marcando os checkboxes antes de expandir o gabarito.

---

### Pergunta 1
**Um método funcional (*functional method*) deve possuir:**

- **A.** Exatamente um parâmetro `IMPORTING`
- **B.** Exatamente um parâmetro `EXPORTING`
- **C.** Nenhum parâmetro `CHANGING`
- **D.** Exatamente um parâmetro `RETURNING`

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **D**  
> **Conceito:** Por definição fundamental no ABAP, um método funcional é caracterizado por possuir obrigatoriamente um único parâmetro de retorno (`RETURNING VALUE(...)`), permitindo seu uso direto em expressões.

---

### Pergunta 2
**O construtor estático é executado quando a classe é acessada pela primeira vez. Quando isso pode acontecer? (Escolha duas opções)**

- **A.** No início do programa
- **B.** Ao chamar um método estático da classe
- **C.** Ao instanciar a classe

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **B, C**  
> **Conceito:** O construtor estático (`CLASS_CONSTRUCTOR`) é disparado uma única vez pelo *runtime* assim que a classe é referenciada pela primeira vez durante a execução do programa (chamada a método estático ou instanciação).

---

### Pergunta 3
**Quais dos seguintes elementos podem fazer parte da assinatura de um construtor de instância? (Escolha duas opções)**

- **A.** Parâmetros `IMPORTING`
- **B.** Parâmetros `EXPORTING`
- **C.** Parâmetros `CHANGING`
- **D.** Exceções

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **A, D**  
> **Conceito:** Construtores de instância (`METHODS constructor`) só podem receber valores iniciais de entrada via parâmetros `IMPORTING` e disparar erros via declaração de exceções (`RAISING`). Parâmetros `EXPORTING` ou `CHANGING` são proibidos.

---

### Pergunta 4
**Você definiu uma classe contendo atributos de instância e atributos estáticos. Também declarou uma variável de referência, mas ainda não criou uma instância da classe. Quais componentes da classe podem ser acessados nesse momento e de que forma?**

- **A.** Componentes de instância usando a variável de referência
- **B.** Componentes de instância usando o nome da classe
- **C.** Componentes estáticos usando a variável de referência
- **D.** Componentes estáticos usando o nome da classe

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **D**  
> **Conceito:** Componentes estáticos pertencem à classe e não a uma instância individual, podendo ser acessados diretamente através do nome da classe (`lcl_class**=>**static_attr`) mesmo sem instanciar nenhum objeto.

---

### Pergunta 5
**Você declarou duas variáveis de referência, `ref1` e `ref2`. A variável `ref1` aponta para um objeto. Em seguida, você executa a instrução:**

```abap
ref2 = ref1.
```

**O que acontece?**

- **A.** O sistema ABAP cria uma cópia do objeto para o qual `ref1` aponta e atribui seu endereço a `ref2`. Agora existem dois objetos.
- **B.** O sistema ABAP atribui a `ref2` o endereço do objeto para o qual `ref1` aponta. Continua existindo apenas um objeto.

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **B**  
> **Conceito:** Variáveis de referência armazenam apenas ponteiros para endereços de memória. A atribuição `ref2 = ref1` apenas copia o ponteiro; continua existindo exatamente uma instância alocada.

---

### Pergunta 6
**Em qual ordem as seções de visibilidade de uma classe devem ser definidas?**

- **A.** ```abap
  PUBLIC SECTION.
  PROTECTED SECTION.
  PRIVATE SECTION.
  ```
- **B.** ```abap
  PRIVATE SECTION.
  PROTECTED SECTION.
  PUBLIC SECTION.
  ```
- **C.** Não importa a ordem.

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **A**  
> **Conceito:** Na definição de classes ABAP (`CLASS ... DEFINITION`), o compilador exige estritamente a declaração das seções nessa ordem decrescente de visibilidade: `PUBLIC SECTION` -> `PROTECTED SECTION` -> `PRIVATE SECTION`.

---

### Pergunta 7
**Sua classe contém um atributo público de instância chamado `attr`. Como você pode garantir que seu valor só possa ser alterado dentro da própria classe? (Escolha duas opções)**

- **A.** Torná-lo um atributo privado
- **B.** Convertê-lo em uma constante
- **C.** Mantê-lo na seção pública utilizando a adição `READ-ONLY`
- **D.** Movê-lo para outra classe local

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **A, C**  
> **Conceito:** O encapsulamento pode ser garantido tornando o atributo `PRIVATE` (acessível só internamente) ou mantendo-o público com `READ-ONLY` (leitura livre externa, mas escrita bloqueada fora da classe).

---

### Pergunta 8
**Uma classe `my_class` contém o método estático público `my_method`. Qual é o código correto para chamar esse método?**

- **A.** ```abap
  my_class->my_method().
  ```
- **B.** ```abap
  my_class=>my_method().
  ```
- **C.** ```abap
  my_class->my_method( ).
  ```
- **D.** ```abap
  my_class=>my_method( ).
  ```

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **D**  
> **Conceito:** Métodos estáticos exigem o seletor de classe **`=>`** e o compilador ABAP exige espaços obrigatórios separando os delimitadores de parênteses dos parâmetros (`my_class=>my_method( ).`).

---

## Conceitos-Chave

- **Métodos Funcionais:** Devem possuir exatamente um parâmetro `RETURNING` (passado por valor), permitindo sua chamada como operando em expressões (`DATA(res) = oref->meth( )`).
- **Construtor Estático (`CLASS_CONSTRUCTOR`):** Executado automaticamente uma única vez quando a classe é acessada pela primeira vez (chamada a método estático ou primeira instanciação). Não possui parâmetros nem exceções.
- **Construtor de Instância (`CONSTRUCTOR`):** Pode receber parâmetros `IMPORTING` e disparar exceções (`RAISING`). Não aceita `EXPORTING` nem `CHANGING`.
- **Acesso Estático:** Componentes estáticos (`CLASS-DATA`, `CLASS-METHODS`) são acessados diretamente pelo nome da classe (`classe**=>**componente`) sem necessidade de criar instâncias.
- **Variáveis de Referência:** Guardam apenas o endereço de memória do objeto. A atribuição `ref2 = ref1` copia a referência, mantendo um único objeto alocado.
- **Hierarquia de Visibilidade:** Ordem estrita do compilador: `PUBLIC SECTION.` $\rightarrow$ `PROTECTED SECTION.` $\rightarrow$ `PRIVATE SECTION.`.
- **Encapsulamento e Proteção:** Para proteger atributos contra alterações indevidas, utilize a seção `PRIVATE` ou a adição `READ-ONLY` na seção `PUBLIC`.
- **Sintaxe de Chamada:** Seletor de classe **=>** para estáticos e espaços obrigatórios internos aos parênteses `( )`.
