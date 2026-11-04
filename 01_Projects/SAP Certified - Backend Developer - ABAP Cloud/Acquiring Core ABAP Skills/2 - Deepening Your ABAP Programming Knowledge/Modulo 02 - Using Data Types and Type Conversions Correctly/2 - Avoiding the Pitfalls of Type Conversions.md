---
title: "Evitando as Armadilhas de Conversões de Tipos"
source: "https://learning.sap.com/courses/deepening-your-abap-programming-knowledge/avoiding-the-pitfalls-of-type-conversions"
created: 2026-11-03
tags:
  - sap
  - abap
  - abap-cloud
  - conversao-de-tipos
  - casting
  - conv
  - exact
  - excecoes
---
**Roteiro de Estudos Relacionado:** [[Roteiro de Estudos SAP]]

# Objetivos

Após concluir esta lição, você será capaz de:
- Compreender a filosofia permissiva de conversões implícitas de dados do ABAP.
- Identificar as principais armadilhas de conversão: truncamento silencioso de dados, perda de precisão e falhas catastróficas em tempo de execução.
- Capturar e tratar exceções clássicas da família `CX_SY_CONVERSION_*`.
- Aplicar o operador de conversão explícita `CONV #( ... )`.
- Utilizar o operador sem perdas `EXACT #( ... )` (*Lossless Assignment*) para assegurar integridade matemática e lógica.

---

## 1. A Filosofia Permissiva do ABAP: Liberdade vs. Risco

Ao contrário de linguagens estritamente tipadas (como Rust ou Go), o ABAP possui um motor de tempo de execução altamente complacente. É possível realizar atribuições de valores entre praticamente quaisquer tipos de dados elementares incompatíveis:

```abap
DATA lv_text   TYPE string VALUE '1234'.
DATA lv_number TYPE i.

" O compilador permite e o kernel tenta converter silenciosamente
lv_number = lv_text. 
```

Embora essa flexibilidade histórica traga agilidade na escrita de códigos simples, ela é uma das maiores fontes de **erros silenciosos de negócio e dumps inesperados em produção**.

---

## 2. As Principais Armadilhas de Conversão

### A. Falhas em Tempo de Execução: Exceções `CX_SY_CONVERSION_*`
Quando o valor contido na variável de origem é incompatível com o formato técnico esperado pelo tipo de destino, o sistema não consegue converter o dado e dispara uma exceção tratável:

1. **`CX_SY_CONVERSION_NO_NUMBER`**: Disparada ao tentar converter uma cadeia de caracteres alfabética ou com pontuações inválidas para um tipo numérico (`I`, `P`, `F`, etc.).
   ```abap
   DATA(lv_input) = 'SAP_100'.
   DATA lv_int TYPE i.

   TRY.
       lv_int = lv_input. " Causa dump se não for capturada!
     CATCH cx_sy_conversion_no_number INTO DATA(lx_error).
       " Tratar o erro adequadamente
   ENDTRY.
   ```

2. **`CX_SY_CONVERSION_OVERFLOW`**: Disparada quando o valor a ser atribuído excede o limite numérico físico suportado pela variável de destino (por exemplo, atribuir o número `3.000.000.000` a um inteiro de 4 bytes `TYPE i`, cujo teto é `2.147.483.647`).

---

### B. Truncamento Silencioso de Dados (*Silent Data Loss*)
O perigo mais traiçoeiro ocorre quando a conversão **não dispara exceção alguma**, mas corrompe silenciosamente os dados:

#### 1. Truncamento à Direita em Caracteres
Se você atribuir uma `STRING` de 20 caracteres a uma variável `TYPE c LENGTH 10`, os 10 caracteres excedentes são simplesmente descartados pelo sistema sem aviso:
```abap
DATA lv_full_name TYPE string VALUE 'Gabriel Vinicius Souza'.
DATA lv_short     TYPE c LENGTH 7.

lv_short = lv_full_name. 
" Resultado em lv_short: 'Gabriel' (o restante foi perdido silenciosamente!)
```

#### 2. Perda de Decimais
Atribuir um número com frações a uma variável inteira faz com que o ABAP arredonde o valor para o inteiro mais próximo (arredondamento comercial), perdendo os centavos sem notificação de erro.

---

## 3. Estratégias Modernas de Proteção

Para garantir códigos resilientes e alinhados às diretrizes do **Clean Core**, utilize as seguintes práticas estruturadas:

### 1. Tratamento com Blocos `TRY ... CATCH`
Sempre que receber dados vindos de fontes externas (APIs HTTP, arquivos CSV/JSON, parâmetros de tela ou mensagens de parceiros), nunca confie na integridade dos tipos. Envolva as conversões em blocos protegidos:

```abap
TRY.
    DATA(lv_target_qty) = cl_abap_format=>to_integer( lv_raw_payload_field ).
  CATCH cx_sy_conversion_error INTO DATA(lx_conv_err).
    " Logar mensagem clara ou retornar erro sem quebrar a sessão
ENDTRY.
```

---

### 2. Conversão Explícita com o Operador `CONV`
O operador construtor moderno **`CONV`** realiza a conversão explícita de um tipo de dado para outro, sendo amplamente utilizado para ajustar o tipo de um parâmetro de entrada ao chamar um método:

```abap
" O método espera um parâmetro IMPORTING do tipo específico ZTYPE_DISCOUNT (packed)
" Passando um número literal ou inteiro convertido explicitamente:
mo_service->apply_discount( 
  iv_discount = CONV #( 15 ) 
).
```

---

### 3. Atribuições Sem Perdas com o Operador `EXACT` (*Lossless Assignment*)
Introduzido nas versões modernas do ABAP, o operador **`EXACT`** foi concebido especificamente para eliminar o truncamento silencioso:

> [!IMPORTANT] O Papel do Operador EXACT
> O operador `EXACT #( ... )` executa uma verificação estrita em tempo de execução:
> - Se a conversão puder ser realizada com 100% de preservação dos dados, a atribuição é concluída.
> - **Se houver qualquer perda de informação, arredondamento ou truncamento de caracteres**, o operador impede a atribuição e dispara a exceção tratável **`CX_SY_CONVERSION_DATA_LOSS`**.

```abap
DATA lv_long_text  TYPE string VALUE '1234567890'.
DATA lv_short_text TYPE c LENGTH 5.

TRY.
    " Utilizando EXACT para impedir truncamento inadvertido:
    lv_short_text = EXACT #( lv_long_text ).
  CATCH cx_sy_conversion_data_loss.
    " Cai aqui imediatamente! Nenhuma perda silenciosa de dados acontece.
ENDTRY.
```

---

## Resumo da Lição

- A flexibilidade de conversão implícita do ABAP pode gerar truncamento silencioso de dados e exceções em tempo de execução.
- Erros de compatibilidade em valores numéricos disparam exceções tratáveis como `CX_SY_CONVERSION_NO_NUMBER` e `CX_SY_CONVERSION_OVERFLOW`.
- O operador **`CONV #( ... )`** é a ferramenta moderna padrão para conversões explícitas seguras na chamada de métodos e expressões.
- O operador **`EXACT #( ... )`** protege contra perdas silenciosas, disparando a exceção `CX_SY_CONVERSION_DATA_LOSS` se qualquer caractere ou dígito decimal for descartado na conversão.
