---
title: "Utilizando a Instrução AUTHORITY-CHECK"
source: "https://learning.sap.com/courses/deepening-your-abap-programming-knowledge/using-the-authority-check-statement"
created: 2026-11-03
tags:
  - sap
  - abap
  - abap-cloud
  - authority-check
  - sy-subrc
  - actvt
  - seguranca
  - adt
---
**Roteiro de Estudos Relacionado:** [[Roteiro de Estudos SAP]]

# Objetivos

Após concluir esta lição, você será capaz de:
- Implementar a sintaxe formal da instrução **`AUTHORITY-CHECK OBJECT`** utilizando as cláusulas `ID ... FIELD` e `ID ... DUMMY`.
- Interpretar com rigor os diferentes códigos de retorno do sistema em **`sy-subrc`** (`0`, `4`, `12`).
- Identificar e aplicar os códigos de atividade padrão do campo **`ACTVT`** (`'01'`, `'02'`, `'03'`, `'06'`).
- Reconhecer a responsabilidade mandatória do desenvolvedor em tratar o retorno `sy-subrc` e barrar fluxos não autorizados.
- Rastrear falhas de segurança utilizando ferramentas de trace de autorização.

---

## 1. O Papel da Instrução `AUTHORITY-CHECK`

Enquanto os Controles de Acesso CDS (DCL) atuam silenciosamente protegendo leituras de banco de dados, o comando imperativo **`AUTHORITY-CHECK`** é o mecanismo oficial do ABAP para validar se o usuário conectado tem permissão para:
* Executar mutações de dados no banco (Criar, Alterar ou Excluir registros).
* Disparar ações críticas de negócio (*Actions*, como aprovar faturamento ou liberar crédito).
* Acessar telas, relatórios ou transações corporativas.

---

## 2. Sintaxe Estruturada da Instrução

```abap
AUTHORITY-CHECK OBJECT 'S_CARRID'
  ID 'CARRID' FIELD lv_carrid
  ID 'ACTVT'  FIELD '03'.
```

### Componentes da Sintaxe:
1. **`OBJECT '<NOME_OBJETO>'`:** Especifica o objeto de autorização cadastrado na transação `SU21`.
2. **`ID '<NOME_CAMPO>' FIELD <variavel_ou_literal>`:** Informa o valor que está sendo testado contra o perfil do usuário.
3. **`ID '<NOME_CAMPO>' DUMMY`:** Se o objeto de autorização possuir um campo que você **não deseja validar** naquele contexto específico, utilize a palavra-chave `DUMMY`. Isso informa ao kernel para ignorar aquele campo sem gerar erro de sintaxe por parâmetros incompletos.

---

## 3. Os Códigos de Atividade Padrão (`ACTVT`)

O campo de autorização **`ACTVT`** é um padrão universal da SAP utilizado em praticamente todos os objetos de negócio. Seus valores mais comuns são:

| Código de Atividade | Ação Correspondente no Sistema | Quando Validar? |
| :---: | :--- | :--- |
| **`'01'`** | **Criar (*Create*)** | Antes de persistir um novo registro no sistema (`INSERT`). |
| **`'02'`** | **Modificar (*Change*)** | Antes de atualizar registros existentes (`UPDATE` ou `MODIFY`). |
| **`'03'`** | **Exibir (*Display*)** | Antes de exibir dados confidenciais ou abrir relatórios de leitura. |
| **`'06'`** | **Excluir (*Delete*)** | Antes de remover registros do banco de dados (`DELETE`). |

---

## 4. Interpretando os Retornos de `sy-subrc`

> [!CAUTION] O AUTHORITY-CHECK Não Para o Programa Sozinho!
> A instrução `AUTHORITY-CHECK` **apenas avalia as permissões e preenche a variável de sistema `sy-subrc`**. Ela **NÃO** interrompe a execução, não bloqueia o comando seguinte e não emite mensagens automaticamente. O desenvolvedor é 100% responsável por avaliar `IF sy-subrc <> 0` e impedir o processamento indevido!

| Valor de `sy-subrc` | Significado Técnico | Ação do Desenvolvedor |
| :---: | :--- | :--- |
| **`0`** | **Autorização Plena Concedida.** O usuário possui o objeto e todos os valores requisitados em seus papéis. | Prosseguir com a execução normal da lógica de negócio. |
| **`4`** | **Valores Não Autorizados.** O usuário possui o objeto de autorização atribuído em seu perfil, mas **não para o valor específico do campo testado** (ex: tem acesso para exibir empresas do Brasil, mas a variável contém empresa da Alemanha). | **Interromper a execução!** Emitir mensagem de erro ou lançar exceção. |
| **`12`** | **Objeto Inexistente no Perfil.** O usuário **não possui o objeto de autorização** em nenhum de seus papéis da PFCG (ou não foram passados campos suficientes). | **Interromper a execução!** |
| **Outro `<> 0`** | Erro genérico ou falta de parâmetros na validação. | **Interromper a execução!** |

---

## 5. Exemplo de Implementação Defensiva no ABAP Cloud

```abap
CLASS zcl_travel_manager DEFINITION PUBLIC FINAL CREATE PUBLIC.
  PUBLIC SECTION.
    INTERFACES if_oo_adt_classrun.
    METHODS cancel_travel
      IMPORTING iv_travel_id TYPE /lrn/travel_id
      RAISING   cx_no_authorization.
ENDCLASS.

CLASS zcl_travel_manager IMPLEMENTATION.

  METHOD cancel_travel.
    " 1. Recupera os dados da viagem para identificar os valores organizacionais
    SELECT SINGLE FROM /lrn/travel
      FIELDS agency_id, country_code
      WHERE travel_id = @iv_travel_id
      INTO @DATA(ls_travel).
    
    " 2. Executa a checagem com o código de atividade '02' (Modificar)
    AUTHORITY-CHECK OBJECT '/DMO/TRVL'
      ID '/DMO/CNTRY' FIELD ls_travel-country_code
      ID 'ACTVT'      FIELD '02'.

    " 3. Bloqueia o fluxo se o usuário não for autorizado
    IF sy-subrc <> 0.
      RAISE EXCEPTION NEW cx_no_authorization(
        textid = cx_no_authorization=>access_denied ).
    ENDIF.

    " 4. Executa a ação transacional apenas após validação formal
    UPDATE /lrn/travel 
      SET status = 'C' 
      WHERE travel_id = @iv_travel_id.
  ENDMETHOD.

ENDCLASS.
```

---

## 6. Diagnóstico e Rastreamento de Autorizações

Quando um usuário reclama que "não consegue executar determinada ação", o desenvolvedor deve investigar o motivo exato da falha do `AUTHORITY-CHECK`:
* **Transação `ST01` (System Trace):** No SAP GUI, permite habilitar o trace de autorização (*Authorization Trace*) para capturar qual objeto, campo e valor específico resultaram em `sy-subrc = 4` ou `12`.
* No ADT / SAP Fiori: Utilizam-se ferramentas do **Security & Identity Cockpit** para inspecionar os logs de segurança e apoiar a equipe de Basis/PFCG na concessão dos papéis adequados.

---

## Resumo da Lição

- A instrução **`AUTHORITY-CHECK OBJECT`** valida permissões do usuário em trechos de código procedurais antes de mutações ou ações de negócio.
- O campo **`ACTVT`** padroniza ações: `'01'` (Criar), `'02'` (Modificar), `'03'` (Exibir) e `'06'` (Excluir).
- O campo pode ser dispensado intencionalmente utilizando a adição **`DUMMY`**.
- Um retorno **`sy-subrc = 0`** significa permissão aprovada; **`4`** indica valor de campo não autorizado; **`12`** indica ausência do objeto no perfil do usuário.
- O desenvolvedor DEVE tratar o retorno e barrar o fluxo (`IF sy-subrc <> 0. RAISE ...`), pois o comando não para o programa automaticamente.
