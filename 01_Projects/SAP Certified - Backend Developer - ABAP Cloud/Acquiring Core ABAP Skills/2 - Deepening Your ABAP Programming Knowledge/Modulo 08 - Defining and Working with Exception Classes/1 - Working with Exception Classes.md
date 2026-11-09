---
tipo: clippings
source: "https://learning.sap.com/courses/deepening-your-abap-programming-knowledge"
created: 2026-11-03
tags:
  - sap
  - abap
  - abap-cloud
  - orientacao-a-objetos
  - excecoes
  - clean-core
---

# 1 - Working with Exception Classes

> [!NOTE] Conexão com o Guia de Estudos
> Esta lição compõe o **Módulo 08: Defining and Working with Exception Classes** da jornada oficial *Deepening Your ABAP Programming Knowledge*. Consulte o [[Roteiro de Estudos SAP]] para o planejamento completo.

---

## 1. Evolução do Tratamento de Erros no ABAP

Nos sistemas legados, o controle de erros no ABAP era realizado primordialmente através de retornos numéricos (`sy-subrc = 4`) ou exceções não baseadas em classes declaradas em módulos de função (`EXCEPTIONS ...`). Essa abordagem clássica apresentava falhas graves:
- O desenvolvedor frequentemente esquecia de avaliar o `sy-subrc`.
- Erros não continham contexto detalhado, pilha de chamadas ou objetos rastreáveis.
- A propagação de falhas entre camadas era manual, repetitiva e propensa a interrupções abruptas (*short dumps* não tratados).

No desenvolvimento moderno orientado a objetos e no **ABAP Cloud**, o tratamento de erros é 100% fundamentado em **Exceções Baseadas em Classes** (*Class-Based Exceptions*). Elas são objetos reais instanciados no momento da anomalia, contendo informações ricas sobre a causa, mensagem amigável e histórico do erro.

---

## 2. A Árvore de Hierarquia de Exceções (`CX_ROOT`)

Todas as classes de exceção do ecossistema SAP — sejam exceções padrão do sistema (`CX_SY_...`) ou customizadas de negócio (`ZCX_...`) — herdam direta ou indiretamente da classe raiz abstrata **`CX_ROOT`**.

Contudo, nenhuma classe pode herdar diretamente de `CX_ROOT`. O ABAP divide a árvore em **três categorias fundamentais**, que determinam como o compilador e o runtime gerenciam a propagação do erro:

```
                          ┌─────────────┐
                          │   CX_ROOT   │
                          └──────▲──────┘
                                 │
         ┌───────────────────────┼───────────────────────┐
         │                       │                       │
┌────────┴────────┐     ┌────────┴────────┐     ┌────────┴────────┐
│ CX_STATIC_CHECK │     │ CX_DYNAMIC_CHECK│     │   CX_NO_CHECK   │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

> [!TIP] Diagrama da Árvore de Exceções
> Consulte a árvore genealógica de exceções detalhada em: ![[Hierarquia_Excecoes_ABAP.excalidraw]]

---

### As Três Categorias de Exceções em Detalhes

| Categoria | Verificação pelo Compilador | Obrigação na Assinatura (`RAISING`) | Uso Recomendado |
| :--- | :--- | :--- | :--- |
| **`CX_STATIC_CHECK`** | **Sim (Estática)** | **Obrigatória:** se não tratada no método com `TRY...CATCH`, o compilador força declarar `RAISING`. | **Padrão ouro para regras de negócio** customizadas (ex: cliente não encontrado, saldo insuficiente). |
| **`CX_DYNAMIC_CHECK`** | Não (Dinâmica) | **Opcional na compilação:** se escapar do método sem `RAISING`, converte-se em `CX_NO_HANDLER` em runtime. | Exceções padrão de runtime previsíveis da linguagem (ex: `CX_SY_ZERODIVIDE`, `CX_SY_ITAB_LINE_NOT_FOUND`). |
| **`CX_NO_CHECK`** | Não | **Proibida / Impossível:** propagada automaticamente pela pilha sem precisar de `RAISING`. | Falhas graves e irrecuperáveis de infraestrutura ou sistema (ex: `CX_SY_SYSTEM_ERROR`, estouro de memória). |

---

## 3. Disparando Exceções (`RAISE EXCEPTION` e `THROW`)

Existem três formas modernas de disparar uma exceção baseada em classe no ABAP:

### 1. Disparo Tradicional:
```abap
IF iv_amount <= 0.
  RAISE EXCEPTION TYPE zcx_financial_error
    EXPORTING
      textid = zcx_financial_error=>invalid_amount.
ENDIF.
```

### 2. Disparo Moderno com Construtor Expressivo (ABAP 7.40+):
```abap
IF iv_discount > 100.
  RAISE EXCEPTION NEW zcx_discount_error( iv_rate = iv_discount ).
ENDIF.
```

### 3. Operador Condicional `THROW`
O operador `THROW` permite lançar exceções diretamente de dentro de expressões como `COND` ou `SWITCH`:

```abap
DATA(lv_discount) = COND f(
  WHEN iv_customer_tier = 'GOLD'   THEN '0.20'
  WHEN iv_customer_tier = 'SILVER' THEN '0.10'
  ELSE THROW zcx_invalid_customer_tier( iv_tier = iv_customer_tier )
).
```

---

## 4. Capturando Exceções (`TRY ... CATCH ... CLEANUP`)

A captura e recuperação de exceções ocorre através da estrutura de blocos `TRY ... ENDTRY`:

```abap
TRY.
    DATA(lo_invoice) = lcl_billing=>generate_invoice( iv_order_id = '10023' ).
    lo_invoice->post_to_accounting( ).

  CATCH zcx_invalid_order INTO DATA(lo_order_ex).
    " Tratamento específico para pedido inválido
    out->write( |Erro no Pedido: { lo_order_ex->get_text( ) }| ).

  CATCH zcx_financial_error INTO DATA(lo_fin_ex).
    " Tratamento específico financeiro
    out->write( |Erro Financeiro: { lo_fin_ex->get_text( ) }| ).

  CATCH cx_root INTO DATA(lo_unexpected).
    " Rede de segurança genérica (polimórfica)
    out->write( |Falha inesperada no processamento: { lo_unexpected->get_text( ) }| ).

ENDTRY.
```

### Regras Vitais de Ordem dos Blocos `CATCH`:
- O ABAP avalia os blocos `CATCH` de **cima para baixo**.
- Portanto, você **deve colocar as exceções mais específicas (subclasses) primeiro**, e as exceções mais genéricas (superclasses como `CX_ROOT`) por último.
- Se você colocar `CATCH cx_root` logo no início, nenhum outro bloco `CATCH` abaixo dele será executado!

---

## 5. O Bloco Especial `CLEANUP`

O bloco `CLEANUP` é um dos recursos mais elegantes e menos compreendidos do ABAP.

### Qual o papel do `CLEANUP`?
Ele **não** trata a exceção (a exceção continua subindo para a chamada superior). O `CLEANUP` é executado **apenas se** uma exceção disparada dentro do bloco `TRY` **não** for capturada por nenhum `CATCH` local e precisar ser propagada para a rotina chamadora.

Sua utilidade principal é garantir que recursos locais abertos (arquivos temporários, locks ou objetos) sejam liberados antes de o contexto ser destruído:

```abap
METHOD perform_file_processing.
  TRY.
      open_exclusive_file( ).
      process_records( ). " Pode disparar zcx_processing_error
      close_file( ).

    " Nenhum CATCH aqui: a exceção sobe para quem chamou o método!
    CLEANUP.
      " Executado apenas se process_records( ) disparar exceção:
      close_file( ).
      release_file_lock( ).
  ENDTRY.
ENDMETHOD.
```

---

## 6. Métodos e Atributos Herdados de `CX_ROOT`

Como todas as exceções herdam de `CX_ROOT`, qualquer objeto de exceção capturado via `INTO DATA(lo_ex)` expõe recursos padronizados:

- **`lo_ex->get_text( )`**: Retorna a mensagem de erro formatada como string legível para o usuário ou log.
- **`lo_ex->get_longtext( )`**: Retorna a documentação detalhada ou texto explicativo ampliado.
- **`lo_ex->get_source_position( )`**: Retorna o programa, include e número exato da linha onde a exceção explodiu.
- **Atributo `lo_ex->previous`**: Referência a uma exceção anterior (*Exception Chaining*). Quando capturamos um erro técnico de baixo nível (ex: `CX_SY_ZERODIVIDE`) e lançamos uma exceção de negócio amigável (`ZCX_CALCULATION_ERROR`), passamos a exceção original no parâmetro `previous` para preservar a causa raiz nos logs de auditoria.
