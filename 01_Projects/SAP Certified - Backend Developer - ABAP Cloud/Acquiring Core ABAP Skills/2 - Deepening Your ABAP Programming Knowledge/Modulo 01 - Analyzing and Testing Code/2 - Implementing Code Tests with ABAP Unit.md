---
title: "Implementando Testes de Código com ABAP Unit"
source: "https://learning.sap.com/courses/deepening-your-abap-programming-knowledge/implementing-code-tests-with-abap-unit"
created: 2026-11-03
tags:
  - sap
  - abap
  - abap-cloud
  - abap-unit
  - test-driven-development
  - adt
  - qualidade-codigo
---
**Roteiro de Estudos Relacionado:** [[Roteiro de Estudos SAP]]

# Objetivos

Após concluir esta lição, você será capaz de:
- Compreender os fundamentos, objetivos e o fluxo do framework **ABAP Unit**.
- Definir classes locais de teste utilizando as cláusulas `FOR TESTING`, `DURATION` e `RISK LEVEL`.
- Implementar métodos de ciclo de vida (*Test Fixtures*) como `setup`, `teardown`, `class_setup` e `class_teardown`.
- Aplicar métodos estáticos de asserção da classe global `CL_ABAP_UNIT_ASSERT`.
- Isolar a unidade de código sob teste (*Code Under Test - CUT*) utilizando conceitos de dublês de teste (*Test Doubles*).
- Executar testes unitários no Eclipse (ADT) e interpretar a visão **ABAP Unit Results**.

---

## 1. O que é o ABAP Unit?

O **ABAP Unit** é o framework de testes unitários automatizado e nativo do ambiente SAP, projetado segundo os padrões da família **xUnit** (como JUnit no Java ou NUnit no .NET).

> [!NOTE] Propósito do Teste Unitário
> O teste unitário valida a **menor porção testável de uma aplicação** (geralmente um método de uma classe) de forma completamente isolada. Ele assegura que o algoritmo produz as saídas esperadas para entradas específicas, sem depender de banco de dados real, integrações ativas ou intervenção humana.

### Benefícios Primordiais
* **Prevenção de Regressão:** Garante que alterações em uma parte do código não quebrem funcionalidades já consolidadas.
* **Refatoração Segura:** Permite modernizar algoritmos para o Clean Core com a certeza de que a lógica de negócio foi preservada.
* **Desenvolvimento Orientado a Testes (*TDD - Test-Driven Development*):** Técnica ágil onde os casos de teste são escritos *antes* da implementação da lógica produtiva.

---

## 2. Onde Residem os Testes Unitários no ADT?

No **ABAP Development Tools (ADT)** no Eclipse, o código de teste não se mistura com o código produtivo principal:

* Cada classe global no ADT possui uma aba dedicada chamada **Test Classes** (acessível no rodapé do editor ou pela combinação de teclas de atalho).
* As classes de teste declaradas nesta aba são **classes locais** (*Local Test Classes*).
* O compilador ABAP remove automaticamente essas classes ao compilar o executável para produção em ambientes onde o transporte de testes estiver configurado para isolamento.

---

## 3. Estrutura de uma Classe de Teste Local

Para que o compilador ABAP e o executor do ABAP Unit identifiquem uma classe como unidade de teste, deve-se adicionar a instrução `FOR TESTING` na sua definição:

```abap
CLASS ltc_discount_calculator DEFINITION FINAL FOR TESTING
  DURATION SHORT
  RISK LEVEL HARMLESS.

  PRIVATE SECTION.
    DATA mo_cut TYPE REF TO zcl_discount_calculator. " Code Under Test (CUT)

    " Métodos de ciclo de vida (Fixtures)
    METHODS setup.
    METHODS teardown.

    " Métodos de teste reais
    METHODS test_valid_discount   FOR TESTING.
    METHODS test_zero_amount      FOR TESTING.
    METHODS test_invalid_category FOR TESTING.
ENDCLASS.
```

---

## 4. Atributos Fundamentais: DURATION e RISK LEVEL

A definição de uma classe de teste requer atenção especial a duas propriedades:

### DURATION (Duração Esperada da Execução)
Classifica o tempo esperado para que todos os testes da classe sejam executados. Ajuda o sistema a monitorar timeouts e agendamentos de regressão:
* `SHORT` *(Padrão)*: Execução rápida, normalmente em fração de segundos.
* `MEDIUM`: Para baterias que consomem poucos segundos.
* `LONG`: Para testes mais extensos ou com cálculos matemáticos complexos.

### RISK LEVEL (Nível de Risco ao Sistema)
Informa se a execução do teste altera o estado persistente do sistema:
* `HARMLESS` *(Inofensivo)*: Não realiza nenhuma alteração em tabelas de banco de dados, nem modifica configurações do sistema. **É o nível obrigatório para testes unitários puros.**
* `DANGEROUS` *(Perigoso)*: Altera dados operacionais em tabelas transparentes de persistência.
* `CRITICAL` *(Crítico)*: Modifica tabelas de configuração (*Customizing*) ou parâmetros do sistema.

> [!CAUTION] Atenção ao Valor Padrão de RISK LEVEL!
> Se a cláusula `RISK LEVEL` for **omitida** na definição da classe, o framework assumirá automaticamente o nível **`CRITICAL`**. Muitos sistemas corporativos e ambientes de desenvolvimento bloqueiam a execução de testes marcados como `CRITICAL` por motivos de segurança, fazendo com que seus testes sequer iniciem! Portanto, declare explicitamente `RISK LEVEL HARMLESS`.

---

## 5. Ciclo de Vida do Teste: Métodos Fixture

Testes unitários confiáveis exigem um ambiente controlado (*Test Fixture*). O ABAP Unit fornece 4 métodos especiais executados automaticamente pelo framework:

| Método Especial | Momento da Invocação | Finalidade Principal |
| :--- | :--- | :--- |
| **`class_setup`** | Executado **uma única vez** antes de qualquer método de teste da classe iniciar. | Inicializar recursos caros e estáticos (deve ser um método estático: `CLASS-METHODS class_setup`). |
| **`setup`** | Executado automaticamente **imediatamente antes de CADA** método de teste. | Instanciar o objeto sob teste (*CUT*) e criar valores de entrada limpos para garantir independência entre testes. |
| **`teardown`** | Executado automaticamente **imediatamente após CADA** método de teste. | Limpar instâncias, liberar memória ou restaurar estados. |
| **`class_teardown`** | Executado **uma única vez** após a conclusão de todos os métodos de teste da classe. | Finalização de recursos estáticos (`CLASS-METHODS class_teardown`). |

---

## 6. A Classe de Asserções `CL_ABAP_UNIT_ASSERT`

Dentro de um método de teste, as validações entre o valor gerado pelo código e o valor esperado são realizadas através da classe de utilitários `CL_ABAP_UNIT_ASSERT`:

### Métodos Mais Utilizados

```abap
CLASS ltc_discount_calculator IMPLEMENTATION.

  METHOD setup.
    mo_cut = NEW zcl_discount_calculator( ).
  ENDMETHOD.

  METHOD teardown.
    CLEAR mo_cut.
  ENDMETHOD.

  METHOD test_valid_discount.
    " 1. Preparação (Given)
    DATA(lv_price) = 100.
    DATA(lv_percentage) = 10.

    " 2. Execução (When)
    DATA(lv_result) = mo_cut->calculate( iv_price = lv_price iv_rate = lv_percentage ).

    " 3. Verificação (Then / Assertion)
    cl_abap_unit_assert=>assert_equals(
      act = lv_result
      exp = 90
      msg = 'O cálculo do desconto com valores válidos falhou!' ).
  ENDMETHOD.

  METHOD test_zero_amount.
    DATA(lv_result) = mo_cut->calculate( iv_price = 0 iv_rate = 10 ).

    cl_abap_unit_assert=>assert_initial(
      act = lv_result
      msg = 'O valor final para preço zero deveria ser inicial/zero.' ).
  ENDMETHOD.

  METHOD test_invalid_category.
    TRY.
        mo_cut->set_category( 'INVALIDO' ).
        " Se não disparou exceção esperada, força falha
        cl_abap_unit_assert=>fail( msg = 'Deveria ter ocorrido a exceção cx_invalid_category' ).
      CATCH cx_invalid_category.
        " Teste passou com sucesso
    ENDTRY.
  ENDMETHOD.

ENDCLASS.
```

### Principais Métodos de Validação
* `assert_equals( exp = ... act = ... msg = ... )`: Valida se o valor real (`act`) é idêntico ao esperado (`exp`).
* `assert_differs( exp = ... act = ... msg = ... )`: Valida se o valor real é diferente do valor inesperado.
* `assert_true( act = ... )` / `assert_false( act = ... )`: Valida condições booleanas (`abap_true` / `abap_false`).
* `assert_initial( act = ... )` / `assert_not_initial( act = ... )`: Valida se uma variável está vazia/inicial ou preenchida.
* `assert_subrc( exp = 0 act = sy-subrc )`: Valida se o código de retorno da operação foi o previsto.
* `fail( msg = ... )`: Força a interrupção e reprovação imediata do teste caso um fluxo indevido ocorra.

---

## 7. Isolamento de Dependências: O Conceito de Test Doubles

Em cenários reais, as classes de negócio realizam leituras no banco de dados, emitem mensagens ou acionam serviços externos. Se um teste unitário tentar acessar o banco real:
1. Ele deixará de ser um teste unitário puro (tornando-se teste de integração).
2. Ficará lento.
3. Poderá falhar porque outro desenvolvedor alterou a base de dados compartilhada de testes.

> [!TIP] Princípio da Inversão de Dependência e Dublês de Teste
> Para manter o código desacoplado e 100% testável:
> 1. Desenvolva voltado para **Interfaces** (`IF_...`).
> 2. Injete a dependência via método construtor (*Constructor Injection*).
> 3. No teste unitário, utilize o **ABAP Test Double Framework** ou implemente uma classe local que implementa a interface e devolve dados fictícios estáticos em memória.

---

## 8. Execução e Análise no ADT

Para rodar os testes da sua classe:
1. Com o editor aberto na classe global:
   - Pressione o atalho: `Ctrl + Shift + F10`.
   - Ou clique com o botão direito $\rightarrow$ **Run As $\rightarrow$ ABAP Unit Test**.
2. A visão **ABAP Unit Results** será aberta:
   - **Barra Verde:** Todos os métodos de teste executaram com sucesso e todas as asserções foram atendidas.
   - **Barra Vermelha:** Pelo menos uma asserção falhou ou uma exceção não tratada foi disparada. O painel inferior (*Failure Trace*) indicará exatamente a linha que falhou, o valor esperado e o valor real obtido.

---

## Resumo da Lição

- O **ABAP Unit** permite automação de testes rápidos e confiáveis diretamente no ambiente ABAP.
- Classes de teste residem na aba **Test Classes** do ADT e usam a instrução `FOR TESTING`.
- Sempre defina explicitamente `DURATION SHORT` e `RISK LEVEL HARMLESS`.
- O método `setup` é executado antes de cada teste unitário, preparando o cenário limpo (*Fixture*).
- As asserções são avaliadas via métodos estáticos da classe `CL_ABAP_UNIT_ASSERT` (como `assert_equals`).
- O atalho `Ctrl + Shift + F10` executa todos os testes da unidade no Eclipse.
