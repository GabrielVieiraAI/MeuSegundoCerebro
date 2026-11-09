---
title: "Classificando os Tipos Técnicos de Dados no ABAP"
source: "https://learning.sap.com/courses/deepening-your-abap-programming-knowledge/classifying-technical-data-types-in-abap"
created: 2026-11-03
tags:
  - sap
  - abap
  - abap-cloud
  - tipos-de-dados
  - sintaxe
  - adt
---
**Roteiro de Estudos Relacionado:** [[Roteiro de Estudos SAP]]

# Objetivos

Após concluir esta lição, você será capaz de:
- Diferenciar os tipos de dados elementares internos (*Built-in ABAP Types*) em **Completos** e **Incompletos**.
- Classificar os tipos de dados nas 4 categorias técnicas fundamentais: **Caracteres (*Character-like*)**, **Numéricos (*Numeric*)**, **Bytes (*Byte-like*)** e **Data/Hora (*Date and Time*)**.
- Selecionar o tipo numérico adequado para cada cenário de negócio (contadores, cálculos financeiros com casas decimais ou ponto flutuante de alta precisão).
- Compreender as restrições operacionais entre diferentes famílias de tipos de dados no ABAP moderno.

---

## 1. Tipos de Dados Completos vs. Incompletos

No ABAP, todo dado em memória possui um tipo técnico subjacente. Os tipos elementares pré-definidos pela linguagem (*built-in*) dividem-se em duas categorias quanto à definição de sua extensão física em memória:

| Categoria | Definição | Exigência na Declaração | Tipos Pertencentes |
| :--- | :--- | :--- | :--- |
| **Tipos Completos (*Complete Data Types*)** | Possuem comprimento fixado pelo kernel da linguagem ou gerenciam dinamicamente seu tamanho em memória. | O desenvolvedor **não** precisa (e muitas vezes não pode) informar a cláusula `LENGTH`. | `I`, `INT8`, `STRING`, `XSTRING`, `D`, `T`, `UTCLONG`, `F`, `DECFLOAT16`, `DECFLOAT34`. |
| **Tipos Incompletos (*Incomplete Data Types*)** | Não possuem tamanho fixo pré-definido pelo compilador. | O desenvolvedor **deve especificar explicitamente** o comprimento (`LENGTH`) e, no caso de decimais, a quantidade de frações (`DECIMALS`). | `C`, `N`, `P`, `X`. |

> [!WARNING] Cuidado com Valores Padrão em Tipos Incompletos
> Se você declarar uma variável com tipo incompleto sem explicitar o comprimento (por exemplo: `DATA lv_code TYPE c.`), o compilador assumirá o comprimento padrão de **apenas 1 caractere**! Isso causa truncamentos acidentais caso você tente atribuir textos maiores posteriormente.

---

## 2. As Quatro Categorias Técnicas Fundamentais

O ambiente de execução ABAP agrupa os tipos elementares em quatro categorias técnicas. As operações e funções da linguagem são estritamente delimitadas por essas categorias:

```text
               +---------------------------------------------------------+
               |        Tipos de Dados Elementares Built-in ABAP         |
               +---------------------------------------------------------+
                     |                 |                 |            |
             +-------+-------+  +------+------+  +-------+-----+  +---+----+
             | Caracteres    |  | Numéricos   |  | Byte-like   |  | Data e |
             | Character-like|  | Numeric     |  | (Hexa)      |  | Hora   |
             +---------------+  +-------------+  +-------------+  +--------+
             | - C (Fixo)    |  | - I (4 B)   |  | - X (Fixo)  |  | - D    |
             | - N (Num Text)|  | - INT8 (8 B)|  | - XSTRING   |  | - T    |
             | - STRING      |  | - P (Packed)|  |   (Dinâmico)|  | - UTCLONG|
             +---------------+  | - F (Float) |  +-------------+  +--------+
                                | - DECFLOAT  |
                                +-------------+
```

---

### A. Categoria de Caracteres (*Character-like Types*)
Armazena caracteres alfanuméricos segundo a codificação Unicode:

* **`C` (Character):** Texto de tamanho fixo. Caracteres não preenchidos à direita são completados automaticamente com espaços em branco (*trailing spaces*).
* **`N` (Numeric Text):** Campo de texto que aceita estritamente dígitos (`0` a `9`). Utilizado para códigos que não participam de contas matemáticas mas possuem zeros à esquerda (ex: CPF, CEP, número de cliente, códigos de pedido). Os dígitos não utilizados à esquerda são preenchidos com zeros (`0`).
* **`STRING`:** Sequência de caracteres de tamanho dinâmico. Aloca em memória estritamente a quantidade de caracteres necessária, sem preenchimento inútil com espaços.

```abap
" Exemplos de declaração de campos de caracteres
DATA lv_status       TYPE c LENGTH 2.        " Comprimento fixo de 2 caracteres
DATA lv_postal_code  TYPE n LENGTH 8.        " CEP: 8 dígitos com zeros à esquerda
DATA lv_description  TYPE string.            " String dinâmica sem tamanho pré-fixado
```

---

### B. Categoria Numérica (*Numeric Types*)
Destinada a operações matemáticas e contagens:

| Tipo | Descrição Técnica | Faixa de Valores / Precisão | Quando Utilizar? |
| :--- | :--- | :--- | :--- |
| **`I` (Integer)** | Inteiro de 4 bytes com sinal. | $-2.147.483.648$ a $+2.147.483.647$ | Contadores de loops, índices de tabelas e quantidades inteiras nominais. |
| **`INT8`** | Inteiro longo de 8 bytes com sinal. | Aproximadamente $\pm 9 \times 10^{18}$ | Identificadores únicos numéricos gigantescos que excedem 2 bilhões. |
| **`P` (Packed / BCD)** | Número decimal compactado (*Binary Coded Decimal*). | Comprimento de 1 a 16 bytes (até 31 dígitos), suportando até 14 casas decimais. | **Obrigatório para finanças, preços, valores monetários e contabilidade.** Evita erros de arredondamento. |
| **`F` (Binary Float)** | Ponto flutuante binário de 8 bytes (padrão IEEE 754). | Faixa imensa ($\pm 2,23 \times 10^{-308}$ a $\pm 1,79 \times 10^{+308}$). | Cálculos científicos ou aproximações físicas. **Nunca use para moedas!** |
| **`DECFLOAT16` / `DECFLOAT34`** | Ponto flutuante decimal (16 ou 34 dígitos de precisão). | Suporte a cálculos exatos em base 10 com altíssima precisão decimal. | Cálculos de engenharia de precisão e cenários analíticos avançados. |

> [!IMPORTANT] Por que NÃO usar Tipo `F` em Cálculos Financeiros?
> O tipo `F` armazena números internamente em base binária fracionária. Assim como em quase todas as linguagens de computação, valores triviais em base decimal (como `0.10` ou `0.70`) não possuem representação binária exata finita, gerando dízimas como `0.09999999999999998`. Em cálculos de impostos ou fechamentos fiscais, isso provoca centavos fantasmas e quebras de balanço. Para qualquer valor monetário, utilize sempre **`TYPE p DECIMALS 2`** (ou `DECFLOAT`).

```abap
" Exemplos numéricos
DATA lv_counter TYPE i.
DATA lv_amount  TYPE p LENGTH 8 DECIMALS 2.  " 15 dígitos totais, 2 decimais
```

---

### C. Categoria de Bytes (*Byte-like Types*)
Destinada ao tratamento de dados binários brutos (arquivos, imagens, hashes criptográficos, tokens serializados):

* **`X` (Hexadecimal / Byte Field):** Comprimento fixo em bytes. Cada byte é expresso por 2 dígitos hexadecimais (`00` a `FF`).
* **`XSTRING` (Byte String):** Sequência dinâmica de bytes binários em memória.

> [!CAUTION] Restrição de Operações entre Categorias
> O compilador ABAP proíbe expressamente a mistura direta de tipos `X`/`XSTRING` com tipos de texto `C`/`STRING` em funções de caracteres comuns. Você não pode, por exemplo, concatenar uma string de texto diretamente com um byte field sem antes convertê-lo ou decodificá-lo através de classes de suporte de conversão de codificação (como `CL_ABAP_CONV_CODEPAGE`).

---

### D. Categoria de Data e Hora (*Date and Time Types*)
Projetada para armazenar valores temporais de forma compacta:

* **`D` (Date):** Data civil com 8 caracteres no formato fixo `YYYYMMDD`.
* **`T` (Time):** Hora civil com 6 caracteres no formato de 24 horas `HHMMSS`.
* **`UTCLONG`:** Carimbo de data/hora (*Timestamp*) moderno universal UTC de alta precisão (precisão de frações de segundos até 100 nanossegundos no formato `YYYY-MM-DD HH:MM:SS.sssssss`).

---

## Resumo da Lição

- Tipos **Completos** (`I`, `INT8`, `STRING`, `XSTRING`, `D`, `T`, `UTCLONG`, `DECFLOAT`) têm tamanho intrínseco e não exigem `LENGTH`.
- Tipos **Incompletos** (`C`, `N`, `P`, `X`) exigem definição expressa de `LENGTH` (e `DECIMALS` para o tipo `P`).
- Para códigos numéricos com zeros à esquerda (ex: CEP, CPF), utilize `TYPE n`.
- Para cálculos financeiros e valores com moedas, utilize **`TYPE p DECIMALS ...`** ou `DECFLOAT`, jamais o tipo de ponto flutuante binário `F`.
- Dados binários puros são gerenciados exclusivamente por tipos da família byte-like (`X` e `XSTRING`).
