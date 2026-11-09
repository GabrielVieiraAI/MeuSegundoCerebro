---
tipo: teste-notebooklm
tags:
  - sap
  - abap
  - abap-cloud
  - teste
modulo: 3
dificuldade: facil
tentativa: 1
score: 0%
aprovado: false
data: 2026-10-27
---

# 📝 Bateria de Teste: Nível Fácil - Módulo 3 (Working with Local Classes)

> [!NOTE] Instruções de Estudo Ativo
> Este teste avalia o conhecimento direto de **anatomia de classes locais, seções de visibilidade, palavras-chave e seletores fundamentais** do módulo 3.  
> Responda a todas as 10 questões antes de expandir o bloco de gabarito.  
> **Meta para aprovação:** ≥ 90% de acertos (mínimo de 9 em 10 questões).

---

### Questão 1
Em qual aba do editor no Eclipse ADT (*ABAP Development Tools* — o ambiente de desenvolvimento oficial da SAP baseado em Eclipse) devem ser escritas as classes locais auxiliares de uma classe global?

- **A.** Global Class
- **B.** Local Types
- **C.** Test Classes
- **D.** Class Properties

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **B**  
> **Conceito:** No Eclipse ADT, uma classe global possui diferentes abas na barra inferior do editor. As classes e tipos locais auxiliares são escritos e mantidos na aba **Local Types**. A aba *Global Class* contém a definição/implementação da classe principal e *Test Classes* destina-se a testes unitários (ABAP Unit).

---

### Questão 2
Toda classe completa em ABAP possui dois blocos estruturais de código. Quais são eles e em qual ordem devem ser declarados?

- **A.** `INTERFACE` e `IMPLEMENTATION`
- **B.** `DEFINITION` e `EXECUTION`
- **C.** `DEFINITION` e `IMPLEMENTATION`
- **D.** `DECLARATION` e `DEFINITION`

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **C**  
> **Conceito:** Uma classe ABAP é composta pelo bloco de definição (`CLASS ... DEFINITION. ... ENDCLASS.`), onde são declarados tipos, atributos e assinaturas de métodos, seguido obrigatoriamente pelo bloco de implementação (`CLASS ... IMPLEMENTATION. ... ENDCLASS.`), onde o código executável dos métodos é escrito.

---

### Questão 3
Qual é a ordem **estritamente obrigatória** das seções de visibilidade no bloco de definição (`DEFINITION`) de uma classe ABAP?

- **A.** `PRIVATE SECTION.` $\rightarrow$ `PROTECTED SECTION.` $\rightarrow$ `PUBLIC SECTION.`
- **B.** `PUBLIC SECTION.` $\rightarrow$ `PRIVATE SECTION.` $\rightarrow$ `PROTECTED SECTION.`
- **C.** `PUBLIC SECTION.` $\rightarrow$ `PROTECTED SECTION.` $\rightarrow$ `PRIVATE SECTION.`
- **D.** O compilador ABAP permite qualquer ordem, desde que todas as seções estejam presentes.

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **C**  
> **Conceito:** O compilador ABAP impõe uma ordem decrescente rigorosa de visibilidade: `PUBLIC SECTION.` primeiro, seguida de `PROTECTED SECTION.` e, por fim, `PRIVATE SECTION.`. Qualquer inversão dessa ordem gera erro imediato de sintaxe.

---

### Questão 4
Qual é a instrução utilizada para declarar um **Atributo de Instância** e qual é a instrução para declarar um **Atributo Estático** dentro da definição de uma classe?

- **A.** `DATA` para atributos de instância e `CLASS-DATA` para atributos estáticos
- **B.** `INSTANCE-DATA` para atributos de instância e `STATIC-DATA` para atributos estáticos
- **C.** `VARIABLE` para atributos de instância e `CONSTANT` para atributos estáticos
- **D.** `DATA` para atributos de instância e `STATICS` para atributos estáticos

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **A**  
> **Conceito:** No ABAP OO (*Orientação a Objetos*), componentes de instância usam a palavra-chave padrão `DATA` (ou `METHODS`), enquanto componentes estáticos (compartilhados por todas as instâncias da classe) são declarados com o prefixo `CLASS-` (como `CLASS-DATA` e `CLASS-METHODS`).

---

### Questão 5
Qual seletor deve ser utilizado para acessar um componente **estático** da classe (como um atributo `CLASS-DATA` público) sem precisar instanciar nenhum objeto?

- **A.** `->`
- **B.** `::`
- **C.** **=>**
- **D.** `.`

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **C**  
> **Conceito:** O seletor de classe/estático é o sinal duplo de igualdade com maior que (**=>**), utilizado na forma `nome_da_classe**=>**componente`. A seta simples (`->`) é reservada para acesso a componentes de instâncias a partir de variáveis de referência (`referencia->componente`).

---

### Questão 6
No ABAP moderno, qual operador construtor substitui a instrução legada `CREATE OBJECT` para instanciar um novo objeto na memória?

- **A.** `MAKE #( )`
- **B.** `NEW #( )`
- **C.** `INSTANCE #( )`
- **D.** `BUILD #( )`

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **B**  
> **Conceito:** O operador `NEW #( )` é a sintaxe construtora padrão do ABAP moderno e ABAP Cloud. O caractere `#` indica inferência do tipo de dados a partir da variável receptora declarada com `TYPE REF TO`.

---

### Questão 7
Qual é o tipo técnico de variável utilizado para armazenar o ponteiro de um objeto em ABAP?

- **A.** `TYPE OBJECT`
- **B.** `TYPE POINTER TO`
- **C.** `TYPE REF TO`
- **D.** `TYPE INSTANCE OF`

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **C**  
> **Conceito:** Objetos não são armazenados diretamente como variáveis simples; eles são acessados através de referências declaradas com `DATA oref TYPE REF TO lcl_nome_da_classe.`.

---

### Questão 8
Qual atalho de teclado do Eclipse ADT pode ser usado sobre a declaração de um método com erro para criar automaticamente o esqueleto de implementação (`METHOD ... ENDMETHOD`) ausente?

- **A.** **Ctrl + Shift + F**
- **B.** **Ctrl + 1** (Quick Fix)
- **C.** **Alt + F8**
- **D.** **F3**

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **B**  
> **Conceito:** O atalho **Ctrl + 1** aciona o menu de correções rápidas (*Quick Fix*) no Eclipse ADT. Ao posicionar o cursor sobre a declaração de um método sem implementação, o Quick Fix oferece a opção *"Add implementation for..."*, gerando o código imediatamente.

---

### Questão 9
Um método definido na classe com a instrução `METHODS calc_total.` é classificado como:

- **A.** Um método estático
- **B.** Um método abstrato
- **C.** Um método de instância
- **D.** Uma função externa

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **C**  
> **Conceito:** A palavra-chave `METHODS` declara métodos de instância (que operam sobre dados individuais de cada objeto criado). Métodos estáticos exigem explicitamente a palavra-chave `CLASS-METHODS`.

---

### Questão 10
Qual comando limpa uma variável ou remove todos os registros de uma tabela interna de referências de objetos?

- **A.** `DELETE ALL`
- **B.** `RESET`
- **C.** `FREEZE`
- **D.** `CLEAR`

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **D**  
> **Conceito:** A instrução `CLEAR` restaura qualquer objeto de dados ao seu estado inicial. Aplicada a uma tabela interna, esvazia todas as suas linhas; aplicada a uma variável de referência, define o ponteiro como nulo (`null / initial`).

---
