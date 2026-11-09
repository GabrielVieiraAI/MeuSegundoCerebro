---
title: "Processando Strings com Funções e Expressões Regulares"
source: "https://learning.sap.com/courses/deepening-your-abap-programming-knowledge/processing-strings-using-functions-and-regular-expressions"
created: 2026-11-03
tags:
  - sap
  - abap
  - abap-cloud
  - strings
  - regex
  - pcre
  - funcoes-embutidas
  - adt
---
**Roteiro de Estudos Relacionado:** [[Roteiro de Estudos SAP]]

# Objetivos

Após concluir esta lição, você será capaz de:
- Contrastar comandos procedurais legados (`CONCATENATE`, `SPLIT`) com expressões de string modernas e modelos literais (*String Templates*).
- Aplicar o operador de encadeamento de strings `&&`.
- Utilizar funções embutidas de string categorizadas em **Descrição**, **Manipulação** e **Relação** diretamente em posições de operandos.
- Configurar parâmetros essenciais como `val`, `sub`, `case`, `off`, `len` e `occ`.
- Aplicar expressões regulares no padrão moderno **PCRE (Perl Compatible Regular Expressions)** para validação, extração e substituição de padrões complexos.
- Utilizar as classes orientadas a objetos `CL_ABAP_REGEX` e `CL_ABAP_MATCHER`.

---

## 1. A Evolução do Tratamento de Strings no ABAP

Historicamente, o ABAP manipulava textos através de instruções procedurais rígidas que exigiam múltiplas variáveis temporárias:
```abap
" ❌ PADRÃO LEGADO (Evitar no ABAP Moderno e ABAP Cloud):
DATA lv_full_name TYPE string.
CONCATENATE 'Sr.' 'Gabriel' 'Souza' INTO lv_full_name SEPARATED BY space.
TRANSLATE lv_full_name TO UPPER CASE.
```

No desenvolvimento moderno, todas essas operações foram substituídas por **expressões funcionais inline**, operadores de concatenação direta e modelos de texto (*String Templates*):

```abap
" ✅ PADRÃO MODERNO (ABAP Cloud & Clean Core):
DATA(lv_first_name) = 'Gabriel'.
DATA(lv_last_name)  = 'Souza'.

" Concatenação funcional com operador &&
DATA(lv_full_name) = 'Sr. ' && lv_first_name && ' ' && lv_last_name.

" Interpolação elegante com String Templates (|...|):
DATA(lv_greeting) = |Prezado { lv_first_name } { lv_last_name }, seja bem-vindo!|.
```

---

## 2. Funções Embutidas de String (*Built-in Functions*)

As funções embutidas do ABAP operam diretamente sobre tipos de texto (`C`, `N`, `STRING`) e podem ser empregadas em qualquer posição onde uma expressão seja aceita (dentro de cláusulas `IF`, argumentos de métodos ou atribuições diretas).

Classificam-se em 3 categorias:

---

### A. Funções de Descrição (Retornam Inteiros)
Retornam métricas numéricas e índices de posição:

| Função | Finalidade | Comportamento com Espaços Finais |
| :--- | :--- | :--- |
| **`strlen( val )`** | Retorna o comprimento da cadeia em caracteres. | Em variáveis `TYPE c`, **ignora os espaços em branco à direita** (*trailing blanks*). Em `TYPE string`, conta todos os caracteres. |
| **`numofchar( val )`** | Retorna a contagem exata de caracteres. | Comportamento similar ao `strlen`, utilizado para medir o comprimento visual do texto. |
| **`find( val = ... sub = ... )`** | Localiza a primeira ocorrência da substring. | Retorna o índice baseado em zero (**0** para o primeiro caractere). Se não encontrar, retorna **`-1`**. |
| **`count( val = ... sub = ... )`** | Conta quantas vezes uma substring ocorre no texto. | Retorna a quantidade absoluta de repetições encontradas. |

```abap
DATA(lv_email) = 'contato@empresa.com.br'.

" Localiza a posição do caractere '@':
DATA(lv_at_pos) = find( val = lv_email sub = '@' ). " Retorna 7

" Conta quantos pontos existem no e-mail:
DATA(lv_dot_count) = count( val = lv_email sub = '.' ). " Retorna 2
```

---

### B. Funções de Manipulação (Retornam `STRING`)
Transformam o conteúdo do texto e retornam sempre um objeto dinâmico do tipo `STRING`:

* **`to_upper( val )` / `to_lower( val )`:** Converte todos os caracteres para maiúsculas ou minúsculas.
* **`substring( val = ... off = ... len = ... )`:** Extrai uma fatia de texto a partir do deslocamento `off` com o comprimento `len`.
* **`shift_left( val = ... places = ... )`:** Desloca caracteres para a esquerda.
* **`condense( val = ... )`:** Remove espaços duplicados intermediários e elimina espaços nas extremidades.
* **`replace( val = ... sub = ... with = ... occ = ... )`:** Substitui ocorrências da substring `sub` pelo texto `with` (com `occ = 0` para substituir todas as ocorrências, ou `occ = 1` para apenas a primeira).

```abap
DATA(lv_raw_code) = '   sap-abap-cloud   '.

" Limpeza e conversão encadeada em uma única linha:
DATA(lv_clean_code) = to_upper( condense( lv_raw_code ) ). 
" Resultado: 'SAP-ABAP-CLOUD'

" Substituindo todos os hifens por barras:
DATA(lv_formatted) = replace( val = lv_clean_code sub = '-' with = '/' occ = 0 ).
" Resultado: 'SAP/ABAP/CLOUD'
```

---

### C. Funções Relacionais / Lógicas (Retornam Booleano)
Utilizadas diretamente em estruturas condicionais `IF` ou atribuições booleanas:

* **`contains( val = ... sub = ... [case = ...] )`:** Retorna verdadeiro se a substring for encontrada dentro da cadeia.
* **`matches( val = ... pcre = ... )`:** Retorna verdadeiro se a cadeia **obedecer integralmente** ao padrão de expressão regular fornecido.

```abap
IF contains( val = lv_email sub = '@' ) AND contains( val = lv_email sub = '.' ).
  " Possui estrutura básica de e-mail
ENDIF.
```

---

## 3. Expressões Regulares com o Padrão Moderno PCRE

Uma **Expressão Regular (*Regex*)** é um padrão formal utilizado para validar formatos complexos, buscar sequências dinâmicas e substituir trechos com base em regras sintáticas.

> [!NOTE] Transição Tecnológica: De POSIX para PCRE no SAP Kernel
> Versões mais antigas do ABAP utilizavam a sintaxe POSIX (`regex = ...`). No desenvolvimento contemporâneo no SAP S/4HANA e ABAP Cloud, o kernel adota o padrão **PCRE (Perl Compatible Regular Expressions)** através da biblioteca PCRE2, que é incomparavelmente mais rápida, robusta e compatível com a indústria de software global. Nos parâmetros modernos, utiliza-se a adição **`pcre = ...`**.

---

### 1. Validação de Formatos com `matches( )`
Para verificar se uma entrada do usuário atende estritamente a um formato (ex: validação de CEP brasileiro no formato `#####-###`):

```abap
DATA(lv_cep_valido)   = '13080-000'.
DATA(lv_cep_invalido) = '1308-ABC'.

" Padrão PCRE: ^\d{5}-\d{3}$ (exatamente 5 dígitos, hífen, 3 dígitos)
DATA(lv_regex_cep) = '^\d{5}-\d{3}$'.

IF matches( val = lv_cep_valido pcre = lv_regex_cep ).
  " CEP é matematicamente e estruturalmente válido!
ENDIF.

IF NOT matches( val = lv_cep_invalido pcre = lv_regex_cep ).
  " Identifica que o CEP está fora do padrão esperado
ENDIF.
```

---

### 2. Validação de Endereço de E-mail
```abap
DATA(lv_user_email) = 'gabriel.souza@empresa.com'.

" Padrão regex para validação básica de e-mail corporativo:
DATA(lv_pcre_email) = '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'.

IF matches( val = lv_user_email pcre = lv_pcre_email ).
  " E-mail aprovado
ENDIF.
```

---

### 3. Extração e Substituição com Expressões Regulares
* **Extrair o trecho que atendeu ao padrão com `match( )`:**
  ```abap
  DATA(lv_log_entry) = 'ERROR: [ID=8492] Falha de conexão com gateway'.
  
  " Extrai o número entre colchetes (\d+)
  DATA(lv_extracted_id) = match( val = lv_log_entry pcre = '\d+' ).
  " Resultado em lv_extracted_id: '8492'
  ```

---

## 4. Manipulação Avançada com as Classes `CL_ABAP_REGEX` e `CL_ABAP_MATCHER`

Quando uma mesma expressão regular precisa ser executada repetidamente dentro de um laço de repetição (*loop*) sobre milhares de registros, compilar o padrão em cada linha gera sobrecarga de CPU. A SAP fornece a abordagem orientada a objetos para compilação prévia:

1. **`CL_ABAP_REGEX`:** Compila e armazena o padrão regex em memória uma única vez.
2. **`CL_ABAP_MATCHER`:** Aplica o padrão compilado sobre as strings alvo de forma ultraveloz.

```abap
" 1. Compilação da expressão regular (apenas uma vez fora do loop):
DATA(lo_regex) = NEW cl_abap_regex( 
  pattern     = '\b[A-Z]{3}-\d{4}\b' " Padrão de placa antiga: ABC-1234
  ignore_case = abap_false ).

" 2. Criação do matcher e validação no loop:
DATA(lo_matcher) = lo_regex->create_matcher( text = lv_input_text ).

IF lo_matcher->matches( ) = abap_true.
  " O texto corresponde ao padrão de placa veicular
ENDIF.
```

---

## Resumo da Lição

- Expressões de string modernas (`&&`, `|...|`, funções embutidas) substituem comandos procedurais obsoletos (`CONCATENATE`, `REPLACE`).
- As funções de **Descrição** (`strlen`, `find`, `count`) medem tamanhos e posições (base 0); `find` retorna `-1` caso não encontre.
- As funções de **Manipulação** (`to_upper`, `substring`, `condense`, `replace`) devolvem sempre instâncias do tipo `STRING`.
- O padrão moderno oficial para expressões regulares no ABAP contemporâneo é o **PCRE** (`pcre = ...`).
- A função **`matches( val = ... pcre = ... )`** é a forma mais limpa e eficiente para validações de formato (e-mails, documentos, chaves).
- Para loops massivos, compile o padrão regex utilizando **`CL_ABAP_REGEX`** e **`CL_ABAP_MATCHER`** para máxima eficiência de processamento.
