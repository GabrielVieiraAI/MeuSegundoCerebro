---
tipo: objeto-tecnico
tags:
  - projeto
  - veiling-holambra
  - sap
  - fi
  - abap
  - bapi
  - abap-cloud
  - del-com-165
  - objeto-tecnico
id_demanda: DEL-COM-165
objeto: "ZCLFI_TAX_BAPI_WRAP"
camada: "3 - Comportamento RAP"
data: 2026-11-11
aliases:
  - "ZCLFI_TAX_BAPI_WRAP"
---

# 📦 `ZCLFI_TAX_BAPI_WRAP` (Classe ABAP Wrapper C1 — BAPI e Validações Standard)

⬅️ [[01 - DEL-COM-165 - Arquitetura App 1 (Carga Massiva de Taxas)|Voltar para Arquitetura App 1]] | 🎨 [[01 - DEL-COM-165 - Arquitetura Técnica App 1 (Carga Massiva).excalidraw|Ver no Diagrama Excalidraw App 1]]

---

## 📌 Visão Geral do Objeto

A classe `ZCLFI_TAX_BAPI_WRAP` é a ponte arquitetural (*Wrapper* com contrato de liberação **C1 - Use System-Internally**) entre o mundo **ABAP Cloud (RAP)** e as funções clássicas do S/4HANA que ainda não possuem equivalente nativo liberado para lançamentos de fornecedor com **Razão Especial** (`UMSKZ`).

Ela é criada com a versão de linguagem **Standard ABAP (Unicode)** e liberada internamente via *API State C1*, expondo métodos limpos e tipados com tabelas do dicionário (`ZTFI_TAX_DOC`, `ZTFI_TAX_ITEM` e `ZTFI_TAX_TPMOV`) para:
1. Obter o próximo número sequencial do lote (`ZTAXCARNR`).
2. Validar existência e bloqueios básicos de Fornecedor (`LFA1`/`LFB1`) e Conta do Razão (`SKA1`/`SKB1`).
3. Simular o documento contábil via `BAPI_ACC_DOCUMENT_CHECK`.
4. Contabilizar efetivamente o documento via `BAPI_ACC_DOCUMENT_POST` (sem executar `COMMIT WORK` interno, respeitando a transação única do `save_modified` do RAP).

---

## ⚖️ Regras de Negócio Aplicadas

1. **Mapeamento para `BAPI_ACC_DOCUMENT_CHECK` e `BAPI_ACC_DOCUMENT_POST`:**
   - **Cabeçalho (`DOCUMENTHEADER`):**
     - `BUS_ACT = 'RFBU'` (Transação contábil standard de FI).
     - `USERNAME = sy-uname`.
     - `COMP_CODE = is_doc-bukrs` (`CVH1`).
     - `DOC_DATE = is_doc-bldat`.
     - `PSTNG_DATE = is_doc-budat`.
     - `DOC_TYPE = is_tpmov-blart` (`Z1`).
     - `REF_DOC_NO = is_doc-xblnr`.
     - `HEADER_TXT = is_doc-bktxt`.
   - **Partidas de Fornecedor (`ACCOUNTPAYABLE`):**
     - Preenchidas quando `lifnr IS NOT INITIAL`.
     - `VENDOR_NO = lv_lifnr_alpha` (com conversão `ALPHA = IN` para 10 caracteres).
     - `SP_GL_IND = ls_item-umskz` (Indicador de Razão Especial: `I`, `N`, `U`, `M`, `E`, `O`, `J`, `T` ou espaço na linha do Sítio do `CM-DEV`).
     - `PMNTTRMS = ls_item-zterm`, `BLINE_DATE = ls_item-zfbdt`, `PMNT_BLOCK = ls_item-zlspr` (`T` nas linhas com Razão Especial), `ALLOC_NMBR = ls_item-zuonr`, `ITEM_TEXT = ls_item-sgtxt`.
     - **Rastreabilidade Obrigatória:** `REF_KEY_1 = is_doc-carga_id` (`BSEG-XREF1`) e `REF_KEY_3 = is_doc-ztpmov` (`BSEG-XREF3`).
   - **Partida de Conta do Razão (`ACCOUNTGL`):**
     - Preenchida na linha gerada automaticamente para o movimento `DS-ATR` (`hkont = '2205010002'`).
     - `GL_ACCOUNT = lv_hkont_alpha`, `ITEM_TEXT = ls_item-sgtxt`, `ALLOC_NMBR = ls_item-zuonr`, `REF_KEY_1 = is_doc-carga_id`, `REF_KEY_3 = is_doc-ztpmov`.
   - **Valores Monetários (`CURRENCYAMOUNT`):**
     - Na BAPI contábil, partidas a **Débito** (`shkzg = 'S'`, `wrsol > 0`) recebem sinal **positivo** (`+wrsol`), enquanto partidas a **Crédito** (`shkzg = 'H'`, `wrhab > 0`) recebem sinal **negativo** (`-wrhab`).

---

## 🛠️ Passo a Passo da Criação do Objeto

1. **No Eclipse ADT:** Conecte-se ao sistema e acesse o pacote `ZFI_CARGA_TAXAS`.
2. Clique com o botão direito -> **`New`** -> **`ABAP Class`**.
3. Preencha as propriedades:
   - **Name:** `ZCLFI_TAX_BAPI_WRAP`
   - **Description:** `DEL-COM-165: Wrapper C1 para BAPI_ACC_DOCUMENT e Cadastros`
4. Na etapa de propriedades da classe (ou na aba **Properties** -> **ABAP Language Version** após criar), selecione **`Standard ABAP`** (necessário para chamar `BAPI_ACC_DOCUMENT_CHECK` e `BAPI_ACC_DOCUMENT_POST`).
5. Cole o código abaixo e ative com **`Ctrl + F3`**.
6. **Liberação do Contrato C1:** Na aba **`Properties`** -> **`API State`**, clique em **`Add Release Contract`** -> marque **`Use System-Internally (Contract C1)`** com visibilidade **`Use in Cloud Development`** e conclua.

---

## 💻 Snippet de Código

### 📝 Código Comentado (Para Estudo e Referência)

```abap
CLASS zclfi_tax_bapi_wrap DEFINITION
  PUBLIC
  FINAL
  CREATE PUBLIC.

  PUBLIC SECTION.
    " Tipo de tabela para receber os itens de um documento na simulação/contabilização
    TYPES tt_tax_item TYPE STANDARD TABLE OF ztfi_tax_item WITH EMPTY KEY.

    " Obtém o próximo número sequencial de lote no objeto SNRO ZTAXCARNR
    CLASS-METHODS obter_proximo_carga_id
      RETURNING
        VALUE(rv_carga_id) TYPE ztfi_tax_carga-carga_id.

    " Verifica se o fornecedor (LIFNR) existe na empresa (LFA1 / LFB1)
    CLASS-METHODS validar_fornecedor
      IMPORTING
        iv_lifnr         TYPE lifnr
        iv_bukrs         TYPE bukrs
      RETURNING
        VALUE(rv_valido) TYPE abap_boolean.

    " Verifica se a conta contábil de contrapartida (HKONT) existe na empresa (SKB1)
    CLASS-METHODS validar_conta_razao
      IMPORTING
        iv_hkont         TYPE hkont
        iv_bukrs         TYPE bukrs
      RETURNING
        VALUE(rv_valido) TYPE abap_boolean.

    " Executa a simulação contábil via BAPI_ACC_DOCUMENT_CHECK
    CLASS-METHODS simular_documento
      IMPORTING
        is_doc      TYPE ztfi_tax_doc
        is_tpmov    TYPE ztfi_tax_tpmov
        it_itens    TYPE tt_tax_item
      EXPORTING
        ev_sucesso  TYPE abap_boolean
        ev_mensagem TYPE ztfi_tax_doc-mensagem.

    " Executa a contabilização efetiva via BAPI_ACC_DOCUMENT_POST (sem COMMIT interno)
    CLASS-METHODS contabilizar_documento
      IMPORTING
        is_doc      TYPE ztfi_tax_doc
        is_tpmov    TYPE ztfi_tax_tpmov
        it_itens    TYPE tt_tax_item
      EXPORTING
        ev_sucesso  TYPE abap_boolean
        ev_belnr    TYPE belnr_d
        ev_gjahr    TYPE gjahr
        ev_mensagem TYPE ztfi_tax_doc-mensagem.

  PRIVATE SECTION.
    " Monta as estruturas internas da BAPI para reutilização entre o CHECK e o POST
    CLASS-METHODS montar_dados_bapi
      IMPORTING
        is_doc            TYPE ztfi_tax_doc
        is_tpmov          TYPE ztfi_tax_tpmov
        it_itens          TYPE tt_tax_item
      EXPORTING
        es_doc_header     TYPE bapiache09
        et_accountgl      TYPE bapiacgl09_tab
        et_accountpayable TYPE bapiacap09_tab
        et_currencyamount TYPE bapiaccr09_tab.

    " Extrai a mensagem principal de erro (ou sucesso) da tabela RETURN da BAPI
    CLASS-METHODS extrair_mensagem_bapi
      IMPORTING
        it_return   TYPE bapiret2_t
      EXPORTING
        ev_sucesso  TYPE abap_boolean
        ev_mensagem TYPE ztfi_tax_doc-mensagem.
ENDCLASS.



CLASS zclfi_tax_bapi_wrap IMPLEMENTATION.

  METHOD obter_proximo_carga_id.
    DATA lv_nr_num TYPE n LENGTH 10.

    " Chama a função standard de numeração para o intervalo 01 do objeto ZTAXCARNR
    CALL FUNCTION 'NUMBER_GET_NEXT'
      EXPORTING
        nr_range_nr             = '01'
        object                  = 'ZTAXCARNR'
      IMPORTING
        number                  = lv_nr_num
      EXCEPTIONS
        interval_not_found      = 1
        number_range_not_intern = 2
        object_not_found        = 3
        quantity_is_0           = 4
        quantity_is_not_1       = 5
        interval_overflow       = 6
        buffer_overflow         = 7
        OTHERS                  = 8.

    IF sy-subrc = 0 AND lv_nr_num IS NOT INITIAL.
      rv_carga_id = lv_nr_num.
    ELSE.
      " Fallback seguro por timestamp caso o intervalo 01 ainda não tenha sido criado na SNRO
      GET TIME STAMP FIELD DATA(lv_ts).
      DATA(lv_ts_str) = |{ lv_ts }|.
      rv_carga_id = lv_ts_str+4(10).
    ENDIF.
  ENDMETHOD.


  METHOD validar_fornecedor.
    DATA lv_lifnr_in TYPE lifnr.
    lv_lifnr_in = |{ iv_lifnr ALPHA = IN }|.

    SELECT SINGLE lifnr
      FROM lfb1
      WHERE lifnr = @lv_lifnr_in
        AND bukrs = @iv_bukrs
      INTO @DATA(lv_found).

    rv_valido = xsdbool( sy-subrc = 0 ).
  ENDMETHOD.


  METHOD validar_conta_razao.
    DATA lv_hkont_in TYPE hkont.
    lv_hkont_in = |{ iv_hkont ALPHA = IN }|.

    SELECT SINGLE saknr
      FROM skb1
      WHERE saknr = @lv_hkont_in
        AND bukrs = @iv_bukrs
      INTO @DATA(lv_found).

    rv_valido = xsdbool( sy-subrc = 0 ).
  ENDMETHOD.


  METHOD simular_documento.
    DATA ls_header         TYPE bapiache09.
    DATA lt_accountgl      TYPE bapiacgl09_tab.
    DATA lt_accountpayable TYPE bapiacap09_tab.
    DATA lt_currencyamount TYPE bapiaccr09_tab.
    DATA lt_return         TYPE bapiret2_t.

    montar_dados_bapi(
      EXPORTING
        is_doc            = is_doc
        is_tpmov          = is_tpmov
        it_itens          = it_itens
      IMPORTING
        es_doc_header     = ls_header
        et_accountgl      = lt_accountgl
        et_accountpayable = lt_accountpayable
        et_currencyamount = lt_currencyamount
    ).

    CALL FUNCTION 'BAPI_ACC_DOCUMENT_CHECK'
      EXPORTING
        documentheader = ls_header
      TABLES
        accountgl      = lt_accountgl
        accountpayable = lt_accountpayable
        currencyamount = lt_currencyamount
        return         = lt_return.

    extrair_mensagem_bapi(
      EXPORTING
        it_return   = lt_return
      IMPORTING
        ev_sucesso  = ev_sucesso
        ev_mensagem = ev_mensagem
    ).
  ENDMETHOD.


  METHOD contabilizar_documento.
    DATA ls_header         TYPE bapiache09.
    DATA lt_accountgl      TYPE bapiacgl09_tab.
    DATA lt_accountpayable TYPE bapiacap09_tab.
    DATA lt_currencyamount TYPE bapiaccr09_tab.
    DATA lt_return         TYPE bapiret2_t.
    DATA lv_obj_type       TYPE bapiache09-obj_type.
    DATA lv_obj_key        TYPE bapiache09-obj_key.
    DATA lv_obj_sys        TYPE bapiache09-obj_sys.

    CLEAR: ev_sucesso, ev_belnr, ev_gjahr, ev_mensagem.

    montar_dados_bapi(
      EXPORTING
        is_doc            = is_doc
        is_tpmov          = is_tpmov
        it_itens          = it_itens
      IMPORTING
        es_doc_header     = ls_header
        et_accountgl      = lt_accountgl
        et_accountpayable = lt_accountpayable
        et_currencyamount = lt_currencyamount
    ).

    " Chama a BAPI de contabilização (o COMMIT WORK será feito pelo RAP após save_modified)
    CALL FUNCTION 'BAPI_ACC_DOCUMENT_POST'
      EXPORTING
        documentheader = ls_header
      IMPORTING
        obj_type       = lv_obj_type
        obj_key        = lv_obj_key
        obj_sys        = lv_obj_sys
      TABLES
        accountgl      = lt_accountgl
        accountpayable = lt_accountpayable
        currencyamount = lt_currencyamount
        return         = lt_return.

    extrair_mensagem_bapi(
      EXPORTING
        it_return   = lt_return
      IMPORTING
        ev_sucesso  = ev_sucesso
        ev_mensagem = ev_mensagem
    ).

    " Em caso de sucesso, OBJ_KEY(10) contém o BELNR, OBJ_KEY+10(4) o BUKRS e OBJ_KEY+14(4) o GJAHR
    IF ev_sucesso = abap_true AND lv_obj_key IS NOT INITIAL AND lv_obj_key <> '$'.
      ev_belnr = lv_obj_key(10).
      ev_gjahr = lv_obj_key+14(4).
      MESSAGE s021(zfi_taxas) WITH ev_belnr ev_gjahr INTO ev_mensagem.
    ENDIF.
  ENDMETHOD.


  METHOD montar_dados_bapi.
    CLEAR: es_doc_header, et_accountgl, et_accountpayable, et_currencyamount.

    " 1. Montagem do cabeçalho contábil (BKPF)
    es_doc_header-bus_act    = 'RFBU'.
    es_doc_header-username   = sy-uname.
    es_doc_header-comp_code  = is_doc-bukrs.
    es_doc_header-doc_date   = is_doc-bldat.
    es_doc_header-pstng_date = is_doc-budat.
    es_doc_header-fisc_year  = is_doc-budat(4).
    es_doc_header-doc_type   = COND #( WHEN is_tpmov-blart IS NOT INITIAL
                                       THEN is_tpmov-blart
                                       ELSE 'Z1' ).
    es_doc_header-ref_doc_no = is_doc-xblnr.
    es_doc_header-header_txt = is_doc-bktxt.

    " 2. Montagem das partidas (BSEG)
    DATA lv_itemno TYPE posnr_acc VALUE 0.

    LOOP AT it_itens INTO DATA(ls_item).
      lv_itemno += 1.

      IF ls_item-lifnr IS NOT INITIAL.
        " Partida de Fornecedor / Cooperado (com ou sem Razão Especial)
        DATA ls_ap TYPE bapiacap09.
        CLEAR ls_ap.
        ls_ap-itemno_acc = lv_itemno.
        ls_ap-vendor_no  = |{ ls_item-lifnr ALPHA = IN }|.
        ls_ap-comp_code  = is_doc-bukrs.
        ls_ap-sp_gl_ind  = ls_item-umskz.
        ls_ap-bline_date = ls_item-zfbdt.
        ls_ap-pmnttrms   = ls_item-zterm.
        ls_ap-pmnt_block = ls_item-zlspr.
        ls_ap-alloc_nmbr = ls_item-zuonr.
        ls_ap-item_text  = ls_item-sgtxt.
        " Rastreabilidade obrigatória da demanda: XREF1 = ID Carga, XREF3 = Tipo Mov.
        ls_ap-ref_key_1  = is_doc-carga_id.
        ls_ap-ref_key_3  = is_doc-ztpmov.
        APPEND ls_ap TO et_accountpayable.

      ELSEIF ls_item-hkont IS NOT INITIAL.
        " Partida de Conta do Razão (Contrapartida automática 2205010002 para DS-ATR)
        DATA ls_gl TYPE bapiacgl09.
        CLEAR ls_gl.
        ls_gl-itemno_acc = lv_itemno.
        ls_gl-gl_account = |{ ls_item-hkont ALPHA = IN }|.
        ls_gl-comp_code  = is_doc-bukrs.
        ls_gl-pstng_date = is_doc-budat.
        ls_gl-doc_type   = es_doc_header-doc_type.
        ls_gl-alloc_nmbr = ls_item-zuonr.
        ls_gl-item_text  = ls_item-sgtxt.
        ls_gl-ref_key_1  = is_doc-carga_id.
        ls_gl-ref_key_3  = is_doc-ztpmov.
        APPEND ls_gl TO et_accountgl.
      ENDIF.

      " 3. Montagem do valor monetário (Débito = positivo, Crédito = negativo na BAPI)
      DATA ls_curr TYPE bapiaccr09.
      CLEAR ls_curr.
      ls_curr-itemno_acc = lv_itemno.
      ls_curr-curr_type  = '00'. " Moeda do documento
      ls_curr-currency   = COND #( WHEN is_doc-waers IS NOT INITIAL
                                   THEN is_doc-waers
                                   ELSE 'BRL' ).
      IF ls_item-shkzg = 'S' OR ls_item-wrsol > 0.
        ls_curr-amt_doccur = ls_item-wrsol.
      ELSE.
        ls_curr-amt_doccur = ls_item-wrhab * -1.
      ENDIF.
      APPEND ls_curr TO et_currencyamount.
    ENDLOOP.
  ENDMETHOD.


  METHOD extrair_mensagem_bapi.
    ev_sucesso = abap_true.
    CLEAR ev_mensagem.

    " Procura mensagens de erro (E) ou aborto (A), ignorando a mensagem genérica RW 609 se houver outra mais específica
    LOOP AT it_return INTO DATA(ls_ret) WHERE type = 'E' OR type = 'A'.
      ev_sucesso = abap_false.
      IF ls_ret-id = 'RW' AND ( ls_ret-number = '609' OR ls_ret-number = '614' ).
        IF ev_mensagem IS INITIAL.
          ev_mensagem = ls_ret-message.
        ENDIF.
        CONTINUE.
      ENDIF.
      ev_mensagem = |[{ ls_ret-id }-{ ls_ret-number }] { ls_ret-message }|.
      EXIT.
    ENDLOOP.

    IF ev_sucesso = abap_true.
      MESSAGE s011(zfi_taxas) WITH is_doc-docseq INTO ev_mensagem.
    ENDIF.
  ENDMETHOD.

ENDCLASS.
```

---

### 🚀 Código Limpo (Sem Comentários - Para Copiar e Colar)

```abap
CLASS zclfi_tax_bapi_wrap DEFINITION
  PUBLIC
  FINAL
  CREATE PUBLIC.

  PUBLIC SECTION.
    TYPES tt_tax_item TYPE STANDARD TABLE OF ztfi_tax_item WITH EMPTY KEY.

    CLASS-METHODS obter_proximo_carga_id
      RETURNING
        VALUE(rv_carga_id) TYPE ztfi_tax_carga-carga_id.

    CLASS-METHODS validar_fornecedor
      IMPORTING
        iv_lifnr         TYPE lifnr
        iv_bukrs         TYPE bukrs
      RETURNING
        VALUE(rv_valido) TYPE abap_boolean.

    CLASS-METHODS validar_conta_razao
      IMPORTING
        iv_hkont         TYPE hkont
        iv_bukrs         TYPE bukrs
      RETURNING
        VALUE(rv_valido) TYPE abap_boolean.

    CLASS-METHODS simular_documento
      IMPORTING
        is_doc      TYPE ztfi_tax_doc
        is_tpmov    TYPE ztfi_tax_tpmov
        it_itens    TYPE tt_tax_item
      EXPORTING
        ev_sucesso  TYPE abap_boolean
        ev_mensagem TYPE ztfi_tax_doc-mensagem.

    CLASS-METHODS contabilizar_documento
      IMPORTING
        is_doc      TYPE ztfi_tax_doc
        is_tpmov    TYPE ztfi_tax_tpmov
        it_itens    TYPE tt_tax_item
      EXPORTING
        ev_sucesso  TYPE abap_boolean
        ev_belnr    TYPE belnr_d
        ev_gjahr    TYPE gjahr
        ev_mensagem TYPE ztfi_tax_doc-mensagem.

  PRIVATE SECTION.
    CLASS-METHODS montar_dados_bapi
      IMPORTING
        is_doc            TYPE ztfi_tax_doc
        is_tpmov          TYPE ztfi_tax_tpmov
        it_itens          TYPE tt_tax_item
      EXPORTING
        es_doc_header     TYPE bapiache09
        et_accountgl      TYPE bapiacgl09_tab
        et_accountpayable TYPE bapiacap09_tab
        et_currencyamount TYPE bapiaccr09_tab.

    CLASS-METHODS extrair_mensagem_bapi
      IMPORTING
        it_return   TYPE bapiret2_t
      EXPORTING
        ev_sucesso  TYPE abap_boolean
        ev_mensagem TYPE ztfi_tax_doc-mensagem.
ENDCLASS.



CLASS zclfi_tax_bapi_wrap IMPLEMENTATION.

  METHOD obter_proximo_carga_id.
    DATA lv_nr_num TYPE n LENGTH 10.

    CALL FUNCTION 'NUMBER_GET_NEXT'
      EXPORTING
        nr_range_nr             = '01'
        object                  = 'ZTAXCARNR'
      IMPORTING
        number                  = lv_nr_num
      EXCEPTIONS
        interval_not_found      = 1
        number_range_not_intern = 2
        object_not_found        = 3
        quantity_is_0           = 4
        quantity_is_not_1       = 5
        interval_overflow       = 6
        buffer_overflow         = 7
        OTHERS                  = 8.

    IF sy-subrc = 0 AND lv_nr_num IS NOT INITIAL.
      rv_carga_id = lv_nr_num.
    ELSE.
      GET TIME STAMP FIELD DATA(lv_ts).
      DATA(lv_ts_str) = |{ lv_ts }|.
      rv_carga_id = lv_ts_str+4(10).
    ENDIF.
  ENDMETHOD.


  METHOD validar_fornecedor.
    DATA lv_lifnr_in TYPE lifnr.
    lv_lifnr_in = |{ iv_lifnr ALPHA = IN }|.

    SELECT SINGLE lifnr
      FROM lfb1
      WHERE lifnr = @lv_lifnr_in
        AND bukrs = @iv_bukrs
      INTO @DATA(lv_found).

    rv_valido = xsdbool( sy-subrc = 0 ).
  ENDMETHOD.


  METHOD validar_conta_razao.
    DATA lv_hkont_in TYPE hkont.
    lv_hkont_in = |{ iv_hkont ALPHA = IN }|.

    SELECT SINGLE saknr
      FROM skb1
      WHERE saknr = @lv_hkont_in
        AND bukrs = @iv_bukrs
      INTO @DATA(lv_found).

    rv_valido = xsdbool( sy-subrc = 0 ).
  ENDMETHOD.


  METHOD simular_documento.
    DATA ls_header         TYPE bapiache09.
    DATA lt_accountgl      TYPE bapiacgl09_tab.
    DATA lt_accountpayable TYPE bapiacap09_tab.
    DATA lt_currencyamount TYPE bapiaccr09_tab.
    DATA lt_return         TYPE bapiret2_t.

    montar_dados_bapi(
      EXPORTING
        is_doc            = is_doc
        is_tpmov          = is_tpmov
        it_itens          = it_itens
      IMPORTING
        es_doc_header     = ls_header
        et_accountgl      = lt_accountgl
        et_accountpayable = lt_accountpayable
        et_currencyamount = lt_currencyamount
    ).

    CALL FUNCTION 'BAPI_ACC_DOCUMENT_CHECK'
      EXPORTING
        documentheader = ls_header
      TABLES
        accountgl      = lt_accountgl
        accountpayable = lt_accountpayable
        currencyamount = lt_currencyamount
        return         = lt_return.

    extrair_mensagem_bapi(
      EXPORTING
        it_return   = lt_return
      IMPORTING
        ev_sucesso  = ev_sucesso
        ev_mensagem = ev_mensagem
    ).
  ENDMETHOD.


  METHOD contabilizar_documento.
    DATA ls_header         TYPE bapiache09.
    DATA lt_accountgl      TYPE bapiacgl09_tab.
    DATA lt_accountpayable TYPE bapiacap09_tab.
    DATA lt_currencyamount TYPE bapiaccr09_tab.
    DATA lt_return         TYPE bapiret2_t.
    DATA lv_obj_type       TYPE bapiache09-obj_type.
    DATA lv_obj_key        TYPE bapiache09-obj_key.
    DATA lv_obj_sys        TYPE bapiache09-obj_sys.

    CLEAR: ev_sucesso, ev_belnr, ev_gjahr, ev_mensagem.

    montar_dados_bapi(
      EXPORTING
        is_doc            = is_doc
        is_tpmov          = is_tpmov
        it_itens          = it_itens
      IMPORTING
        es_doc_header     = ls_header
        et_accountgl      = lt_accountgl
        et_accountpayable = lt_accountpayable
        et_currencyamount = lt_currencyamount
    ).

    CALL FUNCTION 'BAPI_ACC_DOCUMENT_POST'
      EXPORTING
        documentheader = ls_header
      IMPORTING
        obj_type       = lv_obj_type
        obj_key        = lv_obj_key
        obj_sys        = lv_obj_sys
      TABLES
        accountgl      = lt_accountgl
        accountpayable = lt_accountpayable
        currencyamount = lt_currencyamount
        return         = lt_return.

    extrair_mensagem_bapi(
      EXPORTING
        it_return   = lt_return
      IMPORTING
        ev_sucesso  = ev_sucesso
        ev_mensagem = ev_mensagem
    ).

    IF ev_sucesso = abap_true AND lv_obj_key IS NOT INITIAL AND lv_obj_key <> '$'.
      ev_belnr = lv_obj_key(10).
      ev_gjahr = lv_obj_key+14(4).
      MESSAGE s021(zfi_taxas) WITH ev_belnr ev_gjahr INTO ev_mensagem.
    ENDIF.
  ENDMETHOD.


  METHOD montar_dados_bapi.
    CLEAR: es_doc_header, et_accountgl, et_accountpayable, et_currencyamount.

    es_doc_header-bus_act    = 'RFBU'.
    es_doc_header-username   = sy-uname.
    es_doc_header-comp_code  = is_doc-bukrs.
    es_doc_header-doc_date   = is_doc-bldat.
    es_doc_header-pstng_date = is_doc-budat.
    es_doc_header-fisc_year  = is_doc-budat(4).
    es_doc_header-doc_type   = COND #( WHEN is_tpmov-blart IS NOT INITIAL
                                       THEN is_tpmov-blart
                                       ELSE 'Z1' ).
    es_doc_header-ref_doc_no = is_doc-xblnr.
    es_doc_header-header_txt = is_doc-bktxt.

    DATA lv_itemno TYPE posnr_acc VALUE 0.

    LOOP AT it_itens INTO DATA(ls_item).
      lv_itemno += 1.

      IF ls_item-lifnr IS NOT INITIAL.
        DATA ls_ap TYPE bapiacap09.
        CLEAR ls_ap.
        ls_ap-itemno_acc = lv_itemno.
        ls_ap-vendor_no  = |{ ls_item-lifnr ALPHA = IN }|.
        ls_ap-comp_code  = is_doc-bukrs.
        ls_ap-sp_gl_ind  = ls_item-umskz.
        ls_ap-bline_date = ls_item-zfbdt.
        ls_ap-pmnttrms   = ls_item-zterm.
        ls_ap-pmnt_block = ls_item-zlspr.
        ls_ap-alloc_nmbr = ls_item-zuonr.
        ls_ap-item_text  = ls_item-sgtxt.
        ls_ap-ref_key_1  = is_doc-carga_id.
        ls_ap-ref_key_3  = is_doc-ztpmov.
        APPEND ls_ap TO et_accountpayable.

      ELSEIF ls_item-hkont IS NOT INITIAL.
        DATA ls_gl TYPE bapiacgl09.
        CLEAR ls_gl.
        ls_gl-itemno_acc = lv_itemno.
        ls_gl-gl_account = |{ ls_item-hkont ALPHA = IN }|.
        ls_gl-comp_code  = is_doc-bukrs.
        ls_gl-pstng_date = is_doc-budat.
        ls_gl-doc_type   = es_doc_header-doc_type.
        ls_gl-alloc_nmbr = ls_item-zuonr.
        ls_gl-item_text  = ls_item-sgtxt.
        ls_gl-ref_key_1  = is_doc-carga_id.
        ls_gl-ref_key_3  = is_doc-ztpmov.
        APPEND ls_gl TO et_accountgl.
      ENDIF.

      DATA ls_curr TYPE bapiaccr09.
      CLEAR ls_curr.
      ls_curr-itemno_acc = lv_itemno.
      ls_curr-curr_type  = '00'.
      ls_curr-currency   = COND #( WHEN is_doc-waers IS NOT INITIAL
                                   THEN is_doc-waers
                                   ELSE 'BRL' ).
      IF ls_item-shkzg = 'S' OR ls_item-wrsol > 0.
        ls_curr-amt_doccur = ls_item-wrsol.
      ELSE.
        ls_curr-amt_doccur = ls_item-wrhab * -1.
      ENDIF.
      APPEND ls_curr TO et_currencyamount.
    ENDLOOP.
  ENDMETHOD.


  METHOD extrair_mensagem_bapi.
    ev_sucesso = abap_true.
    CLEAR ev_mensagem.

    LOOP AT it_return INTO DATA(ls_ret) WHERE type = 'E' OR type = 'A'.
      ev_sucesso = abap_false.
      IF ls_ret-id = 'RW' AND ( ls_ret-number = '609' OR ls_ret-number = '614' ).
        IF ev_mensagem IS INITIAL.
          ev_mensagem = ls_ret-message.
        ENDIF.
        CONTINUE.
      ENDIF.
      ev_mensagem = |[{ ls_ret-id }-{ ls_ret-number }] { ls_ret-message }|.
      EXIT.
    ENDLOOP.

    IF ev_sucesso = abap_true.
      MESSAGE s011(zfi_taxas) WITH '' INTO ev_mensagem.
    ENDIF.
  ENDMETHOD.

ENDCLASS.
```
