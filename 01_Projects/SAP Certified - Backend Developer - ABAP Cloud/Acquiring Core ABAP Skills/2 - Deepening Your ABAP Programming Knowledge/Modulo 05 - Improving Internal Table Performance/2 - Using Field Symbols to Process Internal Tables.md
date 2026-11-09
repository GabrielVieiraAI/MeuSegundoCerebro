---
title: "Utilizando Field Symbols no Processamento de Tabelas Internas"
source: "https://learning.sap.com/courses/deepening-your-abap-programming-knowledge/using-field-symbols-to-process-internal-tables"
created: 2026-11-03
tags:
  - sap
  - abap
  - abap-cloud
  - field-symbols
  - performance
  - ponteiros
  - tabelas-internas
---
**Roteiro de Estudos Relacionado:** [[Roteiro de Estudos SAP]]

# Objetivos

Após concluir esta lição, você será capaz de:
- Explicar o funcionamento de **Símbolos de Campo (*Field Symbols*)** como ponteiros de memória direta no ABAP.
- Comparar os impactos de consumo de CPU e memória entre o uso de áreas de trabalho (*Work Areas - INTO wa*) e ponteiros (*ASSIGNING <fs>*).
- Implementar alterações diretas em linha (*In-place Modification*) sem a necessidade do comando redundante `MODIFY itab`.
- Aplicar referências a dados (*Data References*) com a adição `REFERENCE INTO`.
- Adotar as práticas de segurança obrigatórias (`IS ASSIGNED` e `UNASSIGN`).

---

## 1. O que são Field Symbols?

Um **Field Symbol (*Símbolo de Campo*)** é um marcador simbólico ou **ponteiro tipado** (delimitado pelos caracteres `< >`, como `<fs_flight>`). Ao contrário de uma variável convencional, um field symbol não reserva espaço físico próprio para armazenar dados; ele simplesmente **aponta para a área de memória de outro objeto de dados pré-existente**.

---

## 2. O Custo Oculto da Cópia: Work Area vs. Field Symbol

Ao iterar sobre uma tabela interna, o desenvolvedor dispõe de duas estratégias fundamentais:

```text
Estratégia 1: Cópia por Área de Trabalho (INTO wa)
[Tabela Interna na Memória] --- Copia byte a byte ---> [Work Area Privada]
(Se a linha tiver 200 colunas e a tabela tiver 50.000 linhas = 50.000 cópias em memória!)

Estratégia 2: Apontamento Direto por Field Symbol (ASSIGNING <fs>)
[Tabela Interna na Memória] <--- Aponta diretamente --- <fs_line>
(Nenhuma cópia de dados é realizada! O ponteiro simplesmente referencia a linha física.)
```

### O Impacto na Performance de Aplicações
* **Tabelas Largas (*Wide Tables*):** Tabelas que possuem dezenas ou centenas de campos (como visões de clientes, ordens de vendas ou mestres de materiais) sofrem penalizações drásticas quando iteradas com `INTO wa`, pois a CPU gasta grande parte do tempo apenas copiando bytes de memória de um lado para o outro.
* **Ganho com Field Symbol:** Ao utilizar `ASSIGNING FIELD-SYMBOL(<fs>)`, o tempo de iteração do laço cai drasticamente, pois a operação de atribuição de ponteiro é quase instantânea.

---

## 3. Modificação Direta em Linha (*In-place Modification*)

A maior vantagem prática no dia a dia do desenvolvedor reside na forma como os dados são atualizados dentro de um laço de repetição:

### ❌ Método Tradicional e Lento com Work Area
```abap
LOOP AT lt_flights INTO DATA(ls_flight).
  IF ls_flight-currency = 'USD'.
    ls_flight-price = ls_flight-price * '1.10'.
    
    " Custo extra: O comando MODIFY precisa relocalizar a linha na tabela
    " e copiar toda a estrutura ls_flight de volta para a memória da tabela:
    MODIFY lt_flights FROM ls_flight.
  ENDIF.
ENDLOOP.
```

### ✅ Método Moderno de Alta Performance com Field Symbol
```abap
LOOP AT lt_flights ASSIGNING FIELD-SYMBOL(<fs_flight>).
  IF <fs_flight>-currency = 'USD'.
    " Modificação DIRETA e INSTANTÂNEA em memória:
    <fs_flight>-price = <fs_flight>-price * '1.10'.
    
    " NENHUM comando MODIFY é necessário! A tabela já está alterada!
  ENDIF.
ENDLOOP.
```

---

## 4. Field Symbols em Leituras Pontuais

O benefício não se restringe a loops. Em leituras pontuais de linhas individuais, o field symbol oferece a mesma vantagem de modificação imediata:

```abap
" Leitura pontual atribuindo a um ponteiro:
READ TABLE lt_travels 
  WITH KEY travel_id = '00000042' 
  ASSIGNING FIELD-SYMBOL(<fs_travel>).

IF sy-subrc = 0.
  " Altera o status da viagem diretamente na tabela interna:
  <fs_travel>-status = 'B'.
ENDIF.
```

Com Expressões de Tabela modernas:
```abap
ASSIGN lt_travels[ travel_id = '00000042' ] TO FIELD-SYMBOL(<fs_travel_expr>).
IF sy-subrc = 0.
  <fs_travel_expr>-status = 'B'.
ENDIF.
```

---

## 5. A Alternativa Orientada a Objetos: `REFERENCE INTO`

O ABAP moderno também permite iterar gerando uma **referência a dados (*Data Reference*)**, que se comporta de forma análoga a ponteiros de linguagens orientadas a objetos como C++ ou Java:

```abap
LOOP AT lt_flights REFERENCE INTO DATA(lr_flight).
  " Acesso aos componentes utilizando a seta dereferenciadora (->):
  IF lr_flight->currency = 'EUR'.
    lr_flight->price = lr_flight->price * '1.05'.
  ENDIF.
ENDLOOP.
```

---

## 6. Cuidados Operacionais e Boas Práticas

> [!CAUTION] Dumps por Ponteiro Desconectado
> Acessar qualquer campo de um Field Symbol antes que ele aponte para um endereço válido gera o erro em tempo de execução fatal **`GETWA_NOT_ASSIGNED`**.

Para programar defensivamente:
1. Ao realizar leituras que possam falhar, verifique sempre se o ponteiro está vinculado utilizando o predicado **`IF <fs> IS ASSIGNED.`**.
2. Ao reutilizar um field symbol em escopos diferentes, desvincule o ponteiro anterior através da instrução **`UNASSIGN <fs>.`**.

---

## Resumo da Lição

- **Field Symbols (`<fs>`)** são ponteiros que referenciam o endereço real da memória sem realizar cópias de dados.
- O uso de `ASSIGNING FIELD-SYMBOL(...)` elimina a sobrecarga de cópia de memória, acelerando substancialmente loops sobre tabelas com estruturas largas ou alto volume de registros.
- Alterações em campos do ponteiro atualizam a linha da tabela interna instantaneamente em memória, dispensando o comando `MODIFY itab`.
- A alternativa orientada a objetos é o uso de **`REFERENCE INTO DATA(lr_line)`**, acessando componentes via operador seta `->`.
- Sempre garanta que o ponteiro está conectado com a verificação **`IF <fs> IS ASSIGNED`** para evitar o dump `GETWA_NOT_ASSIGNED`.
