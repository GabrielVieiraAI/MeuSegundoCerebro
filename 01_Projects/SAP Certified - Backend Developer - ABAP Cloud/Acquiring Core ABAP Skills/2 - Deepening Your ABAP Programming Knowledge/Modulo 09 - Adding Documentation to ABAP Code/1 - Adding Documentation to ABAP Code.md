---
tipo: clippings
source: "https://learning.sap.com/courses/deepening-your-abap-programming-knowledge"
created: 2026-11-03
tags:
  - sap
  - abap
  - abap-cloud
  - documentacao
  - abap-doc
  - clean-core
---

# 1 - Adding Documentation to ABAP Code

> [!NOTE] Conexão com o Guia de Estudos
> Esta lição compõe o **Módulo 09: Adding Documentation to ABAP Code** da jornada oficial *Deepening Your ABAP Programming Knowledge*. Consulte o [[Roteiro de Estudos SAP]] para o planejamento completo.

---

## 1. O Que É o ABAP Doc?

Nos primórdios do desenvolvimento SAP, a documentação técnica de código ficava dispersa em comentários livres (`*` ou `"`), documentos de Word externos ou em telas legadas da transação SE24/SE37. Essa documentação frequentemente ficava desatualizada, despadronizada e desconectada do dia a dia do desenvolvedor.

O **ABAP Doc** é o padrão oficial da SAP para criação de documentação técnica estruturada **diretamente no código-fonte**, inspirado em padrões consolidados como Javadoc (Java) e Docstrings (Python/TypeScript).

No **ABAP Development Tools (ADT no Eclipse)** e no **ABAP Cloud**, os blocos de ABAP Doc são analisados pelo compilador e convertidos dinamicamente em documentação visual em HTML, acessível instantaneamente durante a codificação.

```
[ Desenvolvedor escreve "! ] ───▶ [ Compilador ADT valida sintaxe ] ───▶ [ Pop-up F2 / Element Info em HTML ]
```

> [!TIP] Diagrama do Fluxo do ABAP Doc
> Visualize o ciclo de escrita, validação e exibição em: ![[ABAP_Doc_Arquitetura.excalidraw]]

---

## 2. A Sintaxe Fundamental: O Marcador `"!`

Um comentário padrão do ABAP começa com aspas duplas simples (`"`). No entanto, para ser reconhecido como **ABAP Doc**, a linha deve começar obrigatoriamente pela combinação de caracteres:

$$\text{Aspas duplas + Ponto de exclamação: } \mathbf{"!}$$

### Regras Mandatórias de Posicionamento:
1. **Posicionamento Imediato:** O bloco de comentário `"!` deve ser posicionado **imediatamente antes** da declaração do elemento (`CLASS`, `INTERFACE`, `METHODS`, `DATA`, `TYPES`, `CONSTANTS`).
2. **Sem Linhas em Branco:** Não pode haver linhas em branco ou comentários comuns (`"`) entre o bloco `"!` e a instrução declarativa do elemento.
3. **Multi-linhas:** Cada linha do bloco de documentação deve começar com `"!`.

```abap
"! Representa a entidade central de reservas de voo da companhia aérea.
"! Permite emissão, cancelamento e revalidação de bilhetes.
CLASS zcl_booking_manager DEFINITION
  PUBLIC
  FINAL
  CREATE PUBLIC.
```

---

## 3. Documentando Métodos: Tags `@parameter` e `@raising`

A maior utilidade prática do ABAP Doc é documentar a interface de comunicação de procedimentos (métodos de classe, métodos de interface ou módulos de função).

Para isso, o ABAP Doc disponibiliza **tags especiais**:

| Tag | Sintaxe | Finalidade |
| :--- | :--- | :--- |
| **`@parameter`** | `"! @parameter <nome_param> \| <descrição>` | Documenta parâmetros `IMPORTING`, `EXPORTING`, `CHANGING` ou `RETURNING`. |
| **`@raising`** | `"! @raising <classe_excecao> \| <descrição>` | Documenta exceções baseadas em classes que o método pode lançar. |
| **`@exception`** | `"! @exception <nome_excecao> \| <descrição>` | Usado exclusivamente para exceções clássicas legadas não-baseadas em classes. |

### Exemplo Completo de Método Documentado:

```abap
CLASS zcl_flight_calculator DEFINITION PUBLIC FINAL CREATE PUBLIC.
  PUBLIC SECTION.

    "! Calcula o valor final da passagem com aplicação de taxas e descontos.
    "!
    "! @parameter iv_base_fare   | Tarifa base do trecho em moeda local
    "! @parameter iv_discount    | Percentual de desconto a aplicar (0 a 100)
    "! @parameter rv_total_price | Retorna o valor final consolidado da passagem
    "! @raising   zcx_fare_error | Disparada se o desconto exceder o limite permitido
    METHODS calculate_fare
      IMPORTING
        iv_base_fare        TYPE /dmo/flight_price
        iv_discount         TYPE i DEFAULT 0
      RETURNING
        VALUE(rv_total_price) TYPE /dmo/flight_price
      RAISING
        zcx_fare_error.

ENDCLASS.
```

> [!WARNING] Validação Estrita de Identificadores
> O ADT **valida** os nomes passados após `@parameter` e `@raising`. Se você documentar um parâmetro chamado `@parameter iv_tax` e alterar o nome do parâmetro para `iv_tax_rate` no método sem atualizar o ABAP Doc, o ADT sinalizará um aviso (*warning*) de que o parâmetro documentado não existe!

---

## 4. Atalhos e Produtividade no ADT (Eclipse)

Você não precisa digitar todos os parâmetros manualmente. O ADT oferece assistentes automáticos que geram o esqueleto do ABAP Doc em segundos:

### 1. Atalho `Ctrl + 1` (Quick Assist)
- Posicione o cursor sobre o nome do método ou classe na seção de definição.
- Pressione **`Ctrl + 1`**.
- Selecione a opção **"Add ABAP Doc"**.
- O Eclipse lerá a assinatura completa do método e gerará automaticamente o cabeçalho com todas as tags `@parameter` e `@raising` prontas para preenchimento.

### 2. Tecla `F2` (Element Info)
- Ao posicionar o cursor sobre qualquer classe, método, tipo ou atributo e pressionar **`F2`**, o ADT abre uma janela pop-up (*Element Info*) renderizando o ABAP Doc formatado em HTML com tipos, links de navegação e descrições.

---

## 5. Formatação Avançada com Tags HTML

O renderizador do ABAP Doc suporta um subconjunto seguro de tags HTML/XHTML para enriquecer visualmente a documentação no Eclipse:

- **`<p> ... </p>`**: Cria parágrafos separados.
- **`<b> ... </b>`** ou **`<strong>`**: Destaca termos em negrito.
- **`<i> ... </i>`** ou **`<em>`**: Destaca termos em itálico.
- **`<ul><li> ... </li></ul>`**: Cria listas com marcadores (*bullet points*).
- **`<ol><li> ... </li></ol>`**: Cria listas numeradas ordenadas.
- **`<h1>` até `<h3>`**: Cabeçalhos e subtítulos hierárquicos.

```abap
"! <p>Serviço responsável pela <b>emissão em lote</b> de faturas.</p>
"! <h3>Regras de Negócio:</h3>
"! <ul>
"!   <li>Verifica se a fatura não está bloqueada financeiramente.</li>
"!   <li>Aplica alíquotas fiscais conforme a UF de destino.</li>
"! </ul>
METHODS execute_batch_billing.
```

---

## 6. O Que Deve e o Que Não Deve Ser Documentado

No desenvolvimento Clean Code e Clean Core, comentários excessivos ou redundantes são considerados poluentes (*Code Smell*).

| O que documentar com ABAP Doc | O que evitar |
| :--- | :--- |
| **Por que** a regra existe (intenção arquitetural). | Repetir o óbvio que o código já expressa (ex: `"! Define o ID do cliente DATA mv_customer_id...`). |
| Limitações, efeitos colaterais e pré-requisitos de métodos públicos. | Comentários dentro da implementação explicando comandos simples de `IF` ou `LOOP`. |
| Significado dos parâmetros de entrada e exceções possíveis. | Código morto comentado (apague-o e confie no controle de versão Git). |
| Interfaces públicas de bibliotecas e serviços de domínio reutilizáveis. | Classes de teste unitário locais com nomes autoexplicativos. |
