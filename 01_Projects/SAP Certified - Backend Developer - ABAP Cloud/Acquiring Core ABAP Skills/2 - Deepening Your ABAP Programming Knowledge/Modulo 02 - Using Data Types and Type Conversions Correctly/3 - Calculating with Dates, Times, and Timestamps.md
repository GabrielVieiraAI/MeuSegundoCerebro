---
title: "Calculando com Datas, Horas e Timestamps"
source: "https://learning.sap.com/courses/deepening-your-abap-programming-knowledge/calculating-with-dates-times-and-timestamps"
created: 2026-11-03
tags:
  - sap
  - abap
  - abap-cloud
  - datas-horas
  - utclong
  - timestamps
  - adt
---
**Roteiro de Estudos Relacionado:** [[Roteiro de Estudos SAP]]

# Objetivos

Após concluir esta lição, você será capaz de:
- Descrever os formatos internos dos tipos elementares de data (`D`) e hora (`T`).
- Realizar operações aritméticas diretas com datas e horas, compreendendo as unidades de medida implícitas (dias e segundos).
- Acessar componentes individuais de ano, mês, dia, hora e minutos utilizando a notação de deslocamento e comprimento (*Offset/Length*).
- Utilizar o tipo moderno de carimbo de data/hora universal de alta precisão **`UTCLONG`** e suas funções embutidas (`utclong_current`, `utclong_add`, `utclong_diff`).
- Comparar os novos padrões com técnicas legadas de carimbos empacotados (`TIMESTAMP` / `CL_ABAP_TSTMP`).
- Obter informações temporais no ABAP Cloud via APIs liberadas (`cl_abap_context_info`).

---

## 1. Tipos Clássicos: Data (`D`) e Hora (`T`)

O ABAP possui dois tipos elementares embutidos que armazenam valores de data civil e horário local de forma legível e compacta:

| Tipo | Formato Interno | Tamanho Fixo | Exemplo de Conteúdo em Memória |
| :--- | :--- | :---: | :--- |
| **`D` (Date)** | `YYYYMMDD` (Ano, Mês, Dia) | 8 caracteres | `'20261103'` (3 de novembro de 2026) |
| **`T` (Time)** | `HHMMSS` (Hora, Minuto, Segundo) | 6 caracteres | `'143000'` (14 horas e 30 minutos) |

---

## 2. Aritmética Direta com Datas e Horas

O kernel do ABAP possui regras matemáticas automáticas para operações diretas com variáveis do tipo `D` e `T`:

### A. Operações com Datas (Tipo `D`)
Quando você soma ou subtrai um número inteiro de uma variável do tipo `D`, a unidade de medida computada é sempre em **dias corridos**:

* **Como o ABAP processa:** Ele converte internamente a data em um número inteiro correspondente à quantidade de dias transcorridos desde o dia base `01.01.0001`.
* **Tratamento de calendário:** O motor trata automaticamente o fim de cada mês (28, 29, 30 ou 31 dias), viradas de ano e anos bissextos.

```abap
DATA lv_order_date TYPE d VALUE '20260225'.

" Somando 5 dias corridos (avança pelo fim de fevereiro com segurança)
DATA(lv_due_date) = lv_order_date + 5. 
" Resultado: '20260302' (2 de março de 2026)

" Diferença entre duas datas retorna o número de dias corridos entre elas:
DATA lv_start TYPE d VALUE '20260101'.
DATA lv_end   TYPE d VALUE '20260115'.
DATA(lv_days_diff) = lv_end - lv_start. " Resultado: 14 dias
```

---

### B. Operações com Horas (Tipo `T`)
Ao somar ou subtrair um número inteiro de uma variável do tipo `T`, a unidade de medida computada é sempre em **segundos**:

* O horário é processado como a quantidade de segundos decorridos desde a meia-noite (`00:00:00`).
* Ao atingir `24:00:00`, o relógio reinicia a contagem a partir de `00:00:00` (*modulo 86400* segundos).

```abap
DATA lv_start_time TYPE t VALUE '080000'. " 08:00:00

" Adicionando 1 hora e meia (90 minutos = 5400 segundos):
DATA(lv_end_time) = lv_start_time + 5400. 
" Resultado: '093000' (09:30:00)

" Diferença entre dois horários retorna o tempo transcorrido em segundos:
DATA(lv_elapsed_seconds) = lv_end_time - lv_start_time. " 5400 segundos
```

---

## 3. Acessando Componentes via Deslocamento e Comprimento (*Offset / Length*)

Como as variáveis dos tipos `D` e `T` possuem formatos fixos, você pode fatiar diretamente suas posições utilizando a sintaxe `variavel+offset(length)`:

```abap
DATA lv_current_date TYPE d VALUE '20261103'.

DATA(lv_year)  = lv_current_date(4).     " Deslocamento 0, comprimento 4 -> '2026'
DATA(lv_month) = lv_current_date+4(2).   " Deslocamento 4, comprimento 2 -> '11'
DATA(lv_day)   = lv_current_date+6(2).   " Deslocamento 6, comprimento 2 -> '03'

DATA lv_current_time TYPE t VALUE '143520'.
DATA(lv_hour)   = lv_current_time(2).    " '14'
DATA(lv_minute) = lv_current_time+2(2).  " '35'
DATA(lv_second) = lv_current_time+4(2).  " '20'
```

---

## 4. O Tipo Moderno de Alta Precisão: `UTCLONG`

Em arquiteturas globais em nuvem, separar data civil e hora local gera inconsistências decorrentes de fusos horários (*Time Zones*) e horários de verão. Para resolver essa complexidade, a SAP introduziu o tipo nativo **`UTCLONG`**.

> [!NOTE] Características do Tipo UTCLONG
> - Representa um carimbo universal UTC (*Coordinated Universal Time*) independente de fusos horários locais.
> - Formato legível ISO-8601: `YYYY-MM-DD HH:MM:SS.sssssss`.
> - **Altíssima Precisão:** Suporta frações de segundo até **100 nanossegundos** (7 casas decimais na fração de segundo).
> - É um tipo elementar completo imutável diretamente por concatenação de strings ordinárias.

### Funções Embutidas para Manipulação de `UTCLONG`

O ABAP fornece funções de kernel nativas para operar com esse tipo:

```abap
" 1. Obter o carimbo UTC corrente do sistema:
DATA(lv_now) = utclong_current( ).

" 2. Somar períodos (adicionar 2 dias e 3600 segundos):
DATA(lv_future) = utclong_add( 
  val     = lv_now 
  days    = 2 
  seconds = 3600 
).

" 3. Calcular a diferença exata entre dois timestamps (retorna segundos com decimais):
DATA(lv_diff_seconds) = utclong_diff( 
  high = lv_future 
  low  = lv_now 
).
```

---

## 5. Comparativo: Timestamps Antigos vs. Modernos

| Característica | Padrão Legado (`TIMESTAMP` / `TIMESTAMPL`) | Padrão Moderno (`UTCLONG`) |
| :--- | :--- | :--- |
| **Tipo Técnico Subjacente** | Número empacotado (`P LENGTH 8` ou `P LENGTH 11 DECIMALS 7`). | Tipo nativo completo dedicado (`UTCLONG`). |
| **Comando de Captura** | `GET TIME STAMP FIELD ...` | Função embutida `utclong_current( )`. |
| **Manipulação Matemática** | Métodos estáticos da classe utilitária `CL_ABAP_TSTMP`. | Funções de kernel integradas (`utclong_add`, `utclong_diff`). |
| **Adequação Clean Core** | Suportado para compatibilidade, mas desaconselhado em novas soluções. | **Padrão oficial recomendado** no ABAP Cloud e SAP S/4HANA. |

---

## 6. Obtendo a Data e Hora no ABAP Cloud

No desenvolvimento ABAP clássico, utilizavam-se variáveis globais da estrutura de sistema `sy` (`sy-datum` e `sy-uzeit`). 

No **ABAP Cloud**, para garantir o princípio do Clean Core e isolamento de contratos, a SAP disponibiliza a classe utilitária liberada **`CL_ABAP_CONTEXT_INFO`**:

```abap
" Modo moderno e liberado para recuperar data e hora do sistema:
DATA(lv_today) = cl_abap_context_info=>get_system_date( ).
DATA(lv_time)  = cl_abap_context_info=>get_system_time( ).
DATA(lv_user)  = cl_abap_context_info=>get_user_technical_name( ).
```

---

## 7. Validação Estrita de Datas Válidas com `EXACT`

Um problema histórico do tipo `D` é que o compilador não impede que você monte strings que não existem no calendário (como `'20260230'` para 30 de fevereiro):

```abap
" Atribuição sem proteção aceita datas inexistentes:
DATA lv_bad_date TYPE d.
lv_bad_date = '20260230'. " O ABAP aceita, gerando inconsistências futuras!

" Protegendo com o operador EXACT (Lossless Validation):
TRY.
    DATA(lv_safe_date) = EXACT d( '20260230' ).
  CATCH cx_sy_conversion_data_loss.
    " A exceção é disparada imediatamente, denunciando a data inválida!
ENDTRY.
```

---

## Resumo da Lição

- O tipo `D` armazena 8 caracteres no formato `YYYYMMDD`; somar um inteiro representa **dias corridos**.
- O tipo `T` armazena 6 caracteres no formato `HHMMSS`; somar um inteiro representa **segundos**.
- Fatiamento de componentes de data e hora é realizado pela sintaxe de offset e comprimento: `campo+offset(tamanho)`.
- O tipo **`UTCLONG`** é o padrão moderno universal da SAP, com precisão de 100 nanossegundos e funções próprias de kernel (`utclong_current`, `utclong_add`, `utclong_diff`).
- No ABAP Cloud, prefira **`cl_abap_context_info`** para consultar a data e o horário do sistema operacional.
- O operador **`EXACT`** impede que datas civis inválidas (ex: 30 de fevereiro) passem despercebidas pela lógica da aplicação.
