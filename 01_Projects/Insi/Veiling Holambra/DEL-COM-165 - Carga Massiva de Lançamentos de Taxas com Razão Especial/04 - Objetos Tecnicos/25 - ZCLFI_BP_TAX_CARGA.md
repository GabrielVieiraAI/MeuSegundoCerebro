---
tipo: objeto-tecnico
tags:
  - projeto
  - veiling-holambra
  - sap
  - fi
  - abap
  - rap
  - abap-cloud
  - del-com-165
  - objeto-tecnico
id_demanda: DEL-COM-165
objeto: "ZCLFI_BP_TAX_CARGA"
camada: "3 - Comportamento RAP"
data: 2026-11-11
aliases:
  - "ZCLFI_BP_TAX_CARGA"
---

# 📦 `ZCLFI_BP_TAX_CARGA` (Behavior Pool — Motor de Carga Massiva e Contabilização)

⬅️ [[01 - DEL-COM-165 - Arquitetura App 1 (Carga Massiva de Taxas)|Voltar para Arquitetura App 1]] | 🎨 [[01 - DEL-COM-165 - Arquitetura Técnica App 1 (Carga Massiva).excalidraw|Ver no Diagrama Excalidraw App 1]]

---

## 📌 Visão Geral do Objeto

A classe `ZCLFI_BP_TAX_CARGA` é o coração da demanda **DEL-COM-165**. Ela implementa o Behavior Definition [[24 - ZI_FI_TAX_CARGA (BDEF)|ZI_FI_TAX_CARGA]] através de duas classes locais no `Local Types`:
1. **`lhc_Carga` (*Interaction Phase Handler*):**
   - Controla a habilitação dinâmica dos botões (`get_instance_features`) e autorizações (`get_global_authorizations`).
   - Implementa `baixarModelo`: invoca [[10 - ZCLFI_TAX_EXCEL|ZCLFI_TAX_EXCEL]] (**`=>`** `gerar_modelo_base64`) e devolve o arquivo `.xlsx` pronto.
   - Implementa `carregarArquivo`: decodifica a planilha via [[10 - ZCLFI_TAX_EXCEL|ZCLFI_TAX_EXCEL]], agrupa as linhas por `DOCSEQ`, valida o Tipo de Movimento em [[01 - ZTFI_TAX_TPMOV|ZTFI_TAX_TPMOV]], deriva os códigos de Razão Especial (`umskz_deb` e `umskz_cred`) e o bloqueio de pagamento (`zlspr = 'T'`), gera automaticamente a linha de contrapartida na conta `2205010002` para o movimento `DS-ATR`, verifica duplicidade (`XBLNR + LIFNR + ZTPMOV + Valor`), executa a simulação contábil imediata (`BAPI_ACC_DOCUMENT_CHECK`) via [[09 - ZCLFI_TAX_BAPI_WRAP|ZCLFI_TAX_BAPI_WRAP]] e grava o lote completo nas 3 tabelas (`ZTFI_TAX_CARGA`, `ZTFI_TAX_DOC`, `ZTFI_TAX_ITEM`) via EML (`MODIFY ENTITIES`).
   - Implementa `lancar`: valida autorização `ACTVT = '16'`, registra o `carga_id` no buffer estático de contabilização da transação e retorna feedback ao monitor.
2. **`lsc_ZI_FI_TAX_CARGA` (*Save Sequence Handler — `save_modified`*):**
   - Durante a fase de gravação (`save_modified`), percorre os lotes acionados pela action `lancar`, chama `zclfi_tax_bapi_wrap` (**`=>`** `contabilizar_documento`) (`BAPI_ACC_DOCUMENT_POST` sem `COMMIT` interno) para cada documento com `status = 'V'`, grava o `BELNR` e `GJAHR` gerados em `ZTFI_TAX_DOC` e atualiza os contadores e o `status_geral` (`L` ou `P`) em `ZTFI_TAX_CARGA` dentro do commit único do RAP.

---

## ⚖️ Regras de Negócio Aplicadas

1. **Agrupamento por `DOCSEQ` e Tratamento de Linhas Secundárias:**
   - A 1ª linha de cada `DOCSEQ` define o cabeçalho do documento (`ZTPMOV`, `BUKRS`, `BLDAT`, `BUDAT`, `XBLNR`, `BKTXT`, `WAERS`). Se `BUKRS` vier em branco, assume `CVH1`; se `WAERS` vier em branco, assume `BRL`.
2. **Derivação Diferenciada por Tipo de Movimento (`ZTFI_TAX_TPMOV`):**
   - **Movimentos padrão (`TX-COM`, `TX-CON`, `RT-CON`, `EM-SOC`, `DV-SOC`, `DP-SOC`):** Partidas a débito recebem `umskz_deb` e partidas a crédito recebem `umskz_cred` (ambos iguais), com bloqueio `zlspr = 'T'`.
   - **Movimento `CM-DEV` (*Cessão de Mudas*):** Como `umskz_deb` é vazio e `umskz_cred = 'N'`, a linha de débito (Sítio) fica sem Razão Especial e sem bloqueio de pagamento, enquanto a linha de crédito (Sócio) recebe Razão Especial `N` e bloqueio `T`.
   - **Movimento `DS-ATR` (*Distribuição de Sobras*):** Possui `hkont_contrapartida = '2205010002'`. O sistema valida que o usuário enviou apenas linhas de crédito (`wrhab > 0`), soma os créditos do `DOCSEQ` e cria automaticamente o último item do documento a débito (`shkzg = 'S'`, `wrsol = soma_creditos`, `hkont = '2205010002'`, `gerado_auto = 'X'`).
3. **Prevenção de Duplicidade (`XBLNR + LIFNR + ZTPMOV + Valor`):**
   - Antes de chamar a BAPI, verifica se já existe documento contabilizado (`ZTFI_TAX_DOC-status = 'L'`) com a mesma combinação de Referência (`xblnr`), Tipo de Movimento (`ztpmov`), Fornecedor (`lifnr`) e Valor (`wrsol` ou `wrhab`).

---

## 🛠️ Passo a Passo da Criação do Objeto

1. **No Eclipse ADT:** Abra o Behavior Definition [[24 - ZI_FI_TAX_CARGA (BDEF)|ZI_FI_TAX_CARGA]], posicione o cursor sobre `zclfi_bp_tax_carga` e pressione **`Ctrl + 1`** -> **`Create behavior implementation class zclfi_bp_tax_carga`**.
2. Selecione a Request (TR) de desenvolvimento e conclua o assistente.
3. Na aba **`Local Types`**, substitua o código gerado pelo snippet abaixo e ative com **`Ctrl + F3`**.

---

## 💻 Snippet de Código

### 📝 Código Comentado (Para Estudo e Referência)

```abap
" =========================================================================
" ABA: Global Class (ZCLFI_BP_TAX_CARGA)
" =========================================================================
CLASS zclfi_bp_tax_carga DEFINITION PUBLIC ABSTRACT FINAL FOR BEHAVIOR OF zi_fi_tax_carga.
ENDCLASS.

CLASS zclfi_bp_tax_carga IMPLEMENTATION.
ENDCLASS.
```

```abap
" =========================================================================
" ABA: Local Types (Buffer Transacional + Handler lhc_Carga + Saver lsc_ZI_FI_TAX_CARGA)
" =========================================================================
CLASS lcl_buffer_contabilizacao DEFINITION FINAL CREATE PRIVATE.
  PUBLIC SECTION.
    CLASS-DATA gt_cargas_para_lancar TYPE SORTED TABLE OF ztfi_tax_carga-carga_id WITH UNIQUE KEY table_line.
ENDCLASS.


CLASS lhc_Carga DEFINITION INHERITING FROM cl_abap_behavior_handler.
  PRIVATE SECTION.

    METHODS get_instance_features FOR INSTANCE FEATURES
      IMPORTING keys REQUEST requested_features FOR Carga RESULT result.

    METHODS get_global_authorizations FOR GLOBAL AUTHORIZATION
      IMPORTING REQUEST requested_authorizations FOR Carga RESULT result.

    METHODS carregarArquivo FOR MODIFY
      IMPORTING keys FOR ACTION Carga~carregarArquivo RESULT result.

    METHODS baixarModelo FOR MODIFY
      IMPORTING keys FOR ACTION Carga~baixarModelo RESULT result.

    METHODS lancar FOR MODIFY
      IMPORTING keys FOR ACTION Carga~lancar RESULT result.

ENDCLASS.


CLASS lhc_Carga IMPLEMENTATION.

  METHOD get_instance_features.
    READ ENTITIES OF zi_fi_tax_carga IN LOCAL MODE
      ENTITY Carga
      FIELDS ( status_geral qtd_validos qtd_lancados )
      WITH CORRESPONDING #( keys )
      RESULT DATA(lt_cargas).

    result = VALUE #( FOR ls_carga IN lt_cargas (
      %tky = ls_carga-%tky
      %action-lancar = COND #( WHEN ls_carga-qtd_validos > 0 AND ls_carga-status_geral <> 'L'
                               THEN if_abap_behv=>fc-o-enabled
                               ELSE if_abap_behv=>fc-o-disabled )
      %delete        = COND #( WHEN ls_carga-qtd_lancados = 0 AND ls_carga-status_geral <> 'L' AND ls_carga-status_geral <> 'P'
                               THEN if_abap_behv=>fc-o-enabled
                               ELSE if_abap_behv=>fc-o-disabled )
    ) ).
  ENDMETHOD.


  METHOD get_global_authorizations.
    AUTHORITY-CHECK OBJECT 'ZTAXCARGA'
      ID 'ACTVT' FIELD '01'.
    DATA(lv_auth_create) = COND #( WHEN sy-subrc = 0
                                   THEN if_abap_behv=>auth-allowed
                                   ELSE if_abap_behv=>auth-unauthorized ).

    result-%delete                 = lv_auth_create.
    result-%action-carregarArquivo = lv_auth_create.

    AUTHORITY-CHECK OBJECT 'ZTAXCARGA'
      ID 'ACTVT' FIELD '03'.
    result-%action-baixarModelo = COND #( WHEN sy-subrc = 0
                                          THEN if_abap_behv=>auth-allowed
                                          ELSE if_abap_behv=>auth-unauthorized ).

    AUTHORITY-CHECK OBJECT 'ZTAXCARGA'
      ID 'ACTVT' FIELD '16'.
    result-%action-lancar = COND #( WHEN sy-subrc = 0
                                    THEN if_abap_behv=>auth-allowed
                                    ELSE if_abap_behv=>auth-unauthorized ).
  ENDMETHOD.


  METHOD baixarModelo.
    DATA(lv_base64) = zclfi_tax_excel=>gerar_modelo_base64( ).

    result = VALUE #( FOR ls_key IN keys (
      %cid   = ls_key-%cid
      %param = VALUE #(
        nome_arquivo    = 'DEL-COM-165_Modelo_Layout_Carga.xlsx'
        mime_type       = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        conteudo_base64 = lv_base64
      )
    ) ).
  ENDMETHOD.


  METHOD carregarArquivo.
    READ TABLE keys INTO DATA(ls_key) INDEX 1.
    IF sy-subrc <> 0.
      RETURN.
    ENDIF.

    " 1. Decodifica e lê as 15 colunas da aba 'Carga' (a partir da linha 6)
    zclfi_tax_excel=>ler_planilha_base64(
      EXPORTING
        iv_conteudo_base64 = ls_key-%param-conteudo_base64
      IMPORTING
        et_linhas          = DATA(lt_linhas)
        ev_erro            = DATA(lv_erro_excel)
        ev_mensagem        = DATA(lv_msg_excel)
    ).

    IF lv_erro_excel = abap_true OR lt_linhas IS INITIAL.
      APPEND VALUE #( %cid = ls_key-%cid ) TO failed-carga.
      APPEND VALUE #(
        %cid = ls_key-%cid
        %msg = new_message_with_text( severity = if_abap_behv_message=>severity-error
                                      text     = lv_msg_excel )
      ) TO reported-carga.
      RETURN.
    ENDIF.

    " 2. Obtém o próximo número de lote (ZTAXCARNR) e lê os Tipos de Movimento (ZTFI_TAX_TPMOV)
    DATA(lv_carga_id)  = zclfi_tax_bapi_wrap=>obter_proximo_carga_id( ).
    DATA(lv_cid_carga) = COND string( WHEN ls_key-%cid IS NOT INITIAL THEN ls_key-%cid ELSE 'CID_CARGA_1' ).

    SELECT *
      FROM ztfi_tax_tpmov
      INTO TABLE @DATA(lt_tpmov).
    SORT lt_tpmov BY ztpmov.

    DATA lt_create_carga TYPE TABLE FOR CREATE zi_fi_tax_carga.
    DATA lt_create_doc   TYPE TABLE FOR CREATE zi_fi_tax_carga\_Documentos.
    DATA lt_create_item  TYPE TABLE FOR CREATE zi_fi_tax_doc\_Itens.

    APPEND VALUE #( %cid_ref = lv_cid_carga ) TO lt_create_doc.

    DATA lv_qtd_docs     TYPE i VALUE 0.
    DATA lv_qtd_validos  TYPE i VALUE 0.
    DATA lv_qtd_erros    TYPE i VALUE 0.
    DATA lv_lote_debito  TYPE ztfi_tax_carga-total_debito VALUE 0.
    DATA lv_lote_credito TYPE ztfi_tax_carga-total_credito VALUE 0.
    DATA lv_waers_lote   TYPE waers VALUE 'BRL'.

    " 3. Agrupa por DOCSEQ e processa cada documento contábil do lote
    LOOP AT lt_linhas INTO DATA(ls_grp_head)
      GROUP BY ( docseq = ls_grp_head-docseq )
      ASCENDING ASSIGNING FIELD-SYMBOL(<fs_grupo>).

      lv_qtd_docs += 1.

      DATA ls_doc_db   TYPE ztfi_tax_doc.
      DATA lt_itens_db TYPE zclfi_tax_bapi_wrap=>tt_tax_item.
      DATA lv_erro_doc TYPE abap_boolean VALUE abap_false.
      DATA lv_msg_doc  TYPE ztfi_tax_doc-mensagem.
      DATA lv_item_num TYPE ztfi_tax_item-item_num VALUE 0.
      DATA lv_prim_lin TYPE abap_boolean VALUE abap_true.

      CLEAR: ls_doc_db, lt_itens_db, lv_msg_doc.
      ls_doc_db-carga_id = lv_carga_id.
      ls_doc_db-docseq   = <fs_grupo>-docseq.

      LOOP AT GROUP <fs_grupo> INTO DATA(ls_lin).
        IF lv_prim_lin = abap_true.
          lv_prim_lin      = abap_false.
          ls_doc_db-ztpmov = ls_lin-ztpmov.
          ls_doc_db-bukrs  = COND #( WHEN ls_lin-bukrs IS NOT INITIAL THEN ls_lin-bukrs ELSE 'CVH1' ).
          ls_doc_db-bldat  = ls_lin-bldat.
          ls_doc_db-budat  = ls_lin-budat.
          ls_doc_db-xblnr  = ls_lin-xblnr.
          ls_doc_db-bktxt  = ls_lin-bktxt.
          ls_doc_db-waers  = COND #( WHEN ls_lin-waers IS NOT INITIAL THEN ls_lin-waers ELSE 'BRL' ).
          lv_waers_lote    = ls_doc_db-waers.
        ENDIF.

        READ TABLE lt_tpmov INTO DATA(ls_tpmov) WITH KEY ztpmov = ls_doc_db-ztpmov BINARY SEARCH.
        DATA(lv_tpmov_existe) = xsdbool( sy-subrc = 0 ).

        lv_item_num += 1.
        DATA ls_item_db TYPE ztfi_tax_item.
        CLEAR ls_item_db.
        ls_item_db-carga_id    = lv_carga_id.
        ls_item_db-docseq      = ls_doc_db-docseq.
        ls_item_db-item_num    = lv_item_num.
        ls_item_db-lifnr       = |{ ls_lin-lifnr ALPHA = IN }|.
        ls_item_db-waers       = ls_doc_db-waers.
        ls_item_db-wrsol       = ls_lin-wrsol.
        ls_item_db-wrhab       = ls_lin-wrhab.
        ls_item_db-zfbdt       = ls_lin-zfbdt.
        ls_item_db-zterm       = ls_lin-zterm.
        ls_item_db-sgtxt       = ls_lin-sgtxt.
        ls_item_db-zuonr       = ls_lin-zuonr.
        ls_item_db-gerado_auto = abap_false.

        IF ls_item_db-wrsol > 0 AND ls_item_db-wrhab = 0.
          ls_item_db-shkzg = 'S'.
          IF lv_tpmov_existe = abap_true.
            ls_item_db-umskz = ls_tpmov-umskz_deb.
          ENDIF.
        ELSEIF ls_item_db-wrhab > 0 AND ls_item_db-wrsol = 0.
          ls_item_db-shkzg = 'H'.
          IF lv_tpmov_existe = abap_true.
            ls_item_db-umskz = ls_tpmov-umskz_cred.
          ENDIF.
        ENDIF.

        IF ls_item_db-umskz IS NOT INITIAL AND lv_tpmov_existe = abap_true.
          ls_item_db-zlspr = COND #( WHEN ls_tpmov-zlspr IS NOT INITIAL THEN ls_tpmov-zlspr ELSE 'T' ).
        ENDIF.

        ls_doc_db-total_debito  += ls_item_db-wrsol.
        ls_doc_db-total_credito += ls_item_db-wrhab.

        IF lv_erro_doc = abap_false.
          IF ( ls_item_db-wrsol <= 0 AND ls_item_db-wrhab <= 0 ) OR
             ( ls_item_db-wrsol > 0  AND ls_item_db-wrhab > 0 ).
            lv_erro_doc = abap_true.
            MESSAGE e013(zfi_taxas) WITH ls_doc_db-docseq ls_item_db-item_num INTO lv_msg_doc.
          ELSEIF ls_item_db-lifnr IS INITIAL OR
                 zclfi_tax_bapi_wrap=>validar_fornecedor( iv_lifnr = ls_item_db-lifnr
                                                          iv_bukrs = ls_doc_db-bukrs ) = abap_false.
            lv_erro_doc = abap_true.
            MESSAGE e012(zfi_taxas) WITH ls_doc_db-docseq ls_item_db-item_num ls_doc_db-bukrs INTO lv_msg_doc.
          ELSEIF lv_tpmov_existe = abap_true AND ls_tpmov-zfbdt_obrig = abap_true AND ls_item_db-zfbdt IS INITIAL.
            lv_erro_doc = abap_true.
            MESSAGE e014(zfi_taxas) WITH ls_doc_db-docseq ls_item_db-item_num ls_doc_db-ztpmov INTO lv_msg_doc.
          ELSEIF lv_tpmov_existe = abap_true AND ls_tpmov-zuonr_obrig = abap_true AND ls_item_db-zuonr IS INITIAL.
            lv_erro_doc = abap_true.
            MESSAGE e015(zfi_taxas) WITH ls_doc_db-docseq ls_item_db-item_num ls_doc_db-ztpmov INTO lv_msg_doc.
          ELSEIF lv_tpmov_existe = abap_true AND ls_tpmov-hkont_contrapartida IS NOT INITIAL AND ls_item_db-wrsol > 0.
            lv_erro_doc = abap_true.
            MESSAGE e009(zfi_taxas) WITH ls_doc_db-docseq ls_doc_db-ztpmov ls_tpmov-hkont_contrapartida INTO lv_msg_doc.
          ELSE.
            SELECT SINGLE d~belnr
              FROM ztfi_tax_doc AS d
              INNER JOIN ztfi_tax_item AS i
                ON  i~carga_id = d~carga_id
                AND i~docseq   = d~docseq
              WHERE d~status = 'L'
                AND d~xblnr  = @ls_doc_db-xblnr
                AND d~ztpmov = @ls_doc_db-ztpmov
                AND i~lifnr  = @ls_item_db-lifnr
                AND i~wrsol  = @ls_item_db-wrsol
                AND i~wrhab  = @ls_item_db-wrhab
              INTO @DATA(lv_belnr_dup).
            IF sy-subrc = 0.
              lv_erro_doc = abap_true.
              MESSAGE e016(zfi_taxas) WITH ls_doc_db-docseq lv_belnr_dup ls_doc_db-xblnr ls_item_db-lifnr INTO lv_msg_doc.
            ENDIF.
          ENDIF.
        ENDIF.

        APPEND ls_item_db TO lt_itens_db.
      ENDLOOP.

      " 4. Contrapartida automática para o movimento DS-ATR (conta 2205010002)
      READ TABLE lt_tpmov INTO ls_tpmov WITH KEY ztpmov = ls_doc_db-ztpmov BINARY SEARCH.
      lv_tpmov_existe = xsdbool( sy-subrc = 0 ).

      IF lv_tpmov_existe = abap_true AND ls_tpmov-hkont_contrapartida IS NOT INITIAL AND ls_doc_db-total_credito > 0.
        lv_item_num += 1.
        CLEAR ls_item_db.
        ls_item_db-carga_id    = lv_carga_id.
        ls_item_db-docseq      = ls_doc_db-docseq.
        ls_item_db-item_num    = lv_item_num.
        ls_item_db-hkont       = |{ ls_tpmov-hkont_contrapartida ALPHA = IN }|.
        ls_item_db-shkzg       = 'S'.
        ls_item_db-waers       = ls_doc_db-waers.
        ls_item_db-wrsol       = ls_doc_db-total_credito.
        ls_item_db-sgtxt       = COND #( WHEN ls_doc_db-bktxt IS NOT INITIAL
                                         THEN ls_doc_db-bktxt
                                         ELSE ls_tpmov-descricao ).
        ls_item_db-gerado_auto = abap_true.

        ls_doc_db-total_debito += ls_item_db-wrsol.
        APPEND ls_item_db TO lt_itens_db.
      ENDIF.

      " 5. Validações de Cabeçalho do Documento
      IF lv_erro_doc = abap_false.
        IF lv_tpmov_existe = abap_false.
          lv_erro_doc = abap_true.
          MESSAGE e005(zfi_taxas) WITH ls_doc_db-docseq ls_doc_db-ztpmov INTO lv_msg_doc.
        ELSEIF ls_tpmov-ativo = abap_false OR
               ( ls_tpmov-valido_de  IS NOT INITIAL AND ls_doc_db-budat < ls_tpmov-valido_de ) OR
               ( ls_tpmov-valido_ate IS NOT INITIAL AND ls_doc_db-budat > ls_tpmov-valido_ate ).
          lv_erro_doc = abap_true.
          MESSAGE e006(zfi_taxas) WITH ls_doc_db-docseq ls_doc_db-ztpmov ls_doc_db-budat INTO lv_msg_doc.
        ELSEIF ls_doc_db-bukrs IS INITIAL OR ls_doc_db-bldat IS INITIAL OR
               ls_doc_db-budat IS INITIAL OR ls_doc_db-xblnr IS INITIAL.
          lv_erro_doc = abap_true.
          MESSAGE e007(zfi_taxas) WITH ls_doc_db-docseq INTO lv_msg_doc.
        ELSEIF ls_tpmov-hkont_contrapartida IS NOT INITIAL AND
               zclfi_tax_bapi_wrap=>validar_conta_razao( iv_hkont = ls_tpmov-hkont_contrapartida
                                                         iv_bukrs = ls_doc_db-bukrs ) = abap_false.
          lv_erro_doc = abap_true.
          MESSAGE e010(zfi_taxas) WITH ls_doc_db-docseq ls_tpmov-hkont_contrapartida ls_doc_db-bukrs INTO lv_msg_doc.
        ELSEIF ls_doc_db-total_debito <> ls_doc_db-total_credito OR ls_doc_db-total_debito <= 0.
          lv_erro_doc = abap_true.
          MESSAGE e008(zfi_taxas) WITH ls_doc_db-docseq ls_doc_db-total_debito ls_doc_db-total_credito INTO lv_msg_doc.
        ENDIF.
      ENDIF.

      " 6. Simulação contábil imediata via BAPI_ACC_DOCUMENT_CHECK
      IF lv_erro_doc = abap_false.
        zclfi_tax_bapi_wrap=>simular_documento(
          EXPORTING
            is_doc      = ls_doc_db
            is_tpmov    = ls_tpmov
            it_itens    = lt_itens_db
          IMPORTING
            ev_sucesso  = DATA(lv_bapi_ok)
            ev_mensagem = lv_msg_doc
        ).
        IF lv_bapi_ok = abap_true.
          ls_doc_db-status = 'V'.
          lv_qtd_validos  += 1.
        ELSE.
          ls_doc_db-status = 'E'.
          lv_qtd_erros    += 1.
        ENDIF.
      ELSE.
        ls_doc_db-status = 'E'.
        lv_qtd_erros    += 1.
      ENDIF.

      ls_doc_db-mensagem = lv_msg_doc.
      lv_lote_debito    += ls_doc_db-total_debito.
      lv_lote_credito   += ls_doc_db-total_credito.

      " 7. Monta payloads EML para Documento e Itens
      DATA(lv_cid_doc) = |DOC_{ ls_doc_db-docseq }|.

      APPEND VALUE #(
        %cid          = lv_cid_doc
        carga_id      = ls_doc_db-carga_id
        docseq        = ls_doc_db-docseq
        ztpmov        = ls_doc_db-ztpmov
        bukrs         = ls_doc_db-bukrs
        bldat         = ls_doc_db-bldat
        budat         = ls_doc_db-budat
        xblnr         = ls_doc_db-xblnr
        bktxt         = ls_doc_db-bktxt
        waers         = ls_doc_db-waers
        total_debito  = ls_doc_db-total_debito
        total_credito = ls_doc_db-total_credito
        status        = ls_doc_db-status
        mensagem      = ls_doc_db-mensagem
        %control = VALUE #(
          carga_id      = if_abap_behv=>mk-on
          docseq        = if_abap_behv=>mk-on
          ztpmov        = if_abap_behv=>mk-on
          bukrs         = if_abap_behv=>mk-on
          bldat         = if_abap_behv=>mk-on
          budat         = if_abap_behv=>mk-on
          xblnr         = if_abap_behv=>mk-on
          bktxt         = if_abap_behv=>mk-on
          waers         = if_abap_behv=>mk-on
          total_debito  = if_abap_behv=>mk-on
          total_credito = if_abap_behv=>mk-on
          status        = if_abap_behv=>mk-on
          mensagem      = if_abap_behv=>mk-on
        )
      ) TO lt_create_doc[ 1 ]-%target.

      DATA ls_cba_item LIKE LINE OF lt_create_item.
      CLEAR ls_cba_item.
      ls_cba_item-%cid_ref = lv_cid_doc.

      LOOP AT lt_itens_db INTO DATA(ls_itm_row).
        APPEND VALUE #(
          %cid        = |ITM_{ ls_itm_row-docseq }_{ ls_itm_row-item_num }|
          carga_id    = ls_itm_row-carga_id
          docseq      = ls_itm_row-docseq
          item_num    = ls_itm_row-item_num
          lifnr       = ls_itm_row-lifnr
          hkont       = ls_itm_row-hkont
          shkzg       = ls_itm_row-shkzg
          umskz       = ls_itm_row-umskz
          waers       = ls_itm_row-waers
          wrsol       = ls_itm_row-wrsol
          wrhab       = ls_itm_row-wrhab
          zfbdt       = ls_itm_row-zfbdt
          zterm       = ls_itm_row-zterm
          zlspr       = ls_itm_row-zlspr
          sgtxt       = ls_itm_row-sgtxt
          zuonr       = ls_itm_row-zuonr
          gerado_auto = ls_itm_row-gerado_auto
          %control = VALUE #(
            carga_id    = if_abap_behv=>mk-on
            docseq      = if_abap_behv=>mk-on
            item_num    = if_abap_behv=>mk-on
            lifnr       = if_abap_behv=>mk-on
            hkont       = if_abap_behv=>mk-on
            shkzg       = if_abap_behv=>mk-on
            umskz       = if_abap_behv=>mk-on
            waers       = if_abap_behv=>mk-on
            wrsol       = if_abap_behv=>mk-on
            wrhab       = if_abap_behv=>mk-on
            zfbdt       = if_abap_behv=>mk-on
            zterm       = if_abap_behv=>mk-on
            zlspr       = if_abap_behv=>mk-on
            sgtxt       = if_abap_behv=>mk-on
            zuonr       = if_abap_behv=>mk-on
            gerado_auto = if_abap_behv=>mk-on
          )
        ) TO ls_cba_item-%target.
      ENDLOOP.

      APPEND ls_cba_item TO lt_create_item.
    ENDLOOP.

    " 8. Cria a hierarquia completa (Carga -> Documentos -> Itens) via EML
    DATA(lv_status_lote) = COND ztfi_tax_carga-status_geral(
      WHEN lv_qtd_erros = 0 THEN 'V'
      ELSE 'E'
    ).

    lt_create_carga = VALUE #( (
      %cid          = lv_cid_carga
      carga_id      = lv_carga_id
      nome_arquivo  = COND #( WHEN ls_key-%param-nome_arquivo IS NOT INITIAL
                              THEN ls_key-%param-nome_arquivo
                              ELSE 'Planilha_Taxas.xlsx' )
      status_geral  = lv_status_lote
      qtd_docs      = lv_qtd_docs
      qtd_validos   = lv_qtd_validos
      qtd_erros     = lv_qtd_erros
      qtd_lancados  = 0
      waers         = lv_waers_lote
      total_debito  = lv_lote_debito
      total_credito = lv_lote_credito
      %control = VALUE #(
        carga_id      = if_abap_behv=>mk-on
        nome_arquivo  = if_abap_behv=>mk-on
        status_geral  = if_abap_behv=>mk-on
        qtd_docs      = if_abap_behv=>mk-on
        qtd_validos   = if_abap_behv=>mk-on
        qtd_erros     = if_abap_behv=>mk-on
        qtd_lancados  = if_abap_behv=>mk-on
        waers         = if_abap_behv=>mk-on
        total_debito  = if_abap_behv=>mk-on
        total_credito = if_abap_behv=>mk-on
      )
    ) ).

    MODIFY ENTITIES OF zi_fi_tax_carga IN LOCAL MODE
      ENTITY Carga
        CREATE FROM lt_create_carga
      ENTITY Carga
        CREATE BY \_Documentos FROM lt_create_doc
      ENTITY Documento
        CREATE BY \_Itens FROM lt_create_item
      MAPPED DATA(ls_mapped)
      FAILED DATA(ls_failed)
      REPORTED DATA(ls_reported).

    " Lê a entidade recém-criada para devolver ao Fiori Elements
    READ ENTITIES OF zi_fi_tax_carga IN LOCAL MODE
      ENTITY Carga
      ALL FIELDS WITH VALUE #( ( carga_id = lv_carga_id ) )
      RESULT DATA(lt_carga_criada).

    result = VALUE #( FOR ls_c IN lt_carga_criada (
      %cid   = ls_key-%cid
      %param = ls_c
    ) ).

    APPEND VALUE #(
      carga_id = lv_carga_id
      %msg     = new_message( id       = 'ZFI_TAXAS'
                              number   = '004'
                              severity = COND #( WHEN lv_qtd_erros = 0
                                                 THEN if_abap_behv_message=>severity-success
                                                 ELSE if_abap_behv_message=>severity-warning )
                              v1       = lv_carga_id
                              v2       = |{ lv_qtd_validos }|
                              v3       = |{ lv_qtd_erros }| )
    ) TO reported-carga.
  ENDMETHOD.


  METHOD lancar.
    READ ENTITIES OF zi_fi_tax_carga IN LOCAL MODE
      ENTITY Carga
      ALL FIELDS WITH CORRESPONDING #( keys )
      RESULT DATA(lt_cargas).

    LOOP AT lt_cargas INTO DATA(ls_carga).
      IF ls_carga-qtd_validos <= 0 OR ls_carga-status_geral = 'L'.
        APPEND VALUE #( %tky = ls_carga-%tky ) TO failed-carga.
        APPEND VALUE #(
          %tky = ls_carga-%tky
          %msg = new_message( id       = 'ZFI_TAXAS'
                              number   = '019'
                              severity = if_abap_behv_message=>severity-error
                              v1       = ls_carga-carga_id )
        ) TO reported-carga.
        CONTINUE.
      ENDIF.

      " Registra a carga no buffer transacional para execução da BAPI_ACC_DOCUMENT_POST no save_modified
      INSERT ls_carga-carga_id INTO TABLE lcl_buffer_contabilizacao=>gt_cargas_para_lancar.

      " Atualiza o timestamp na entidade para acionar o ciclo de save do RAP
      MODIFY ENTITIES OF zi_fi_tax_carga IN LOCAL MODE
        ENTITY Carga
        UPDATE FIELDS ( status_geral )
        WITH VALUE #( ( %tky         = ls_carga-%tky
                        status_geral = ls_carga-status_geral ) ).

      APPEND VALUE #( %tky   = ls_carga-%tky
                      %param = ls_carga ) TO result.
    ENDLOOP.
  ENDMETHOD.

ENDCLASS.


" =========================================================================
" CLASSE SAVER: Execução da BAPI_ACC_DOCUMENT_POST na fase save_modified
" =========================================================================
CLASS lsc_ZI_FI_TAX_CARGA DEFINITION INHERITING FROM cl_abap_behavior_saver.
  PROTECTED SECTION.
    METHODS save_modified REDEFINITION.
ENDCLASS.


CLASS lsc_ZI_FI_TAX_CARGA IMPLEMENTATION.

  METHOD save_modified.
    IF lcl_buffer_contabilizacao=>gt_cargas_para_lancar IS INITIAL.
      RETURN.
    ENDIF.

    SELECT *
      FROM ztfi_tax_tpmov
      INTO TABLE @DATA(lt_tpmov).
    SORT lt_tpmov BY ztpmov.

    LOOP AT lcl_buffer_contabilizacao=>gt_cargas_para_lancar INTO DATA(lv_carga_id).
      " Seleciona todos os documentos do lote
      SELECT *
        FROM ztfi_tax_doc
        WHERE carga_id = @lv_carga_id
        ORDER BY docseq
        INTO TABLE @DATA(lt_docs).

      IF lt_docs IS INITIAL.
        CONTINUE.
      ENDIF.

      DATA lv_validos  TYPE i VALUE 0.
      DATA lv_erros    TYPE i VALUE 0.
      DATA lv_lancados TYPE i VALUE 0.

      LOOP AT lt_docs ASSIGNING FIELD-SYMBOL(<fs_doc>).
        " Contabiliza apenas documentos com status 'V' (Verificado OK)
        IF <fs_doc>-status = 'V'.
          SELECT *
            FROM ztfi_tax_item
            WHERE carga_id = @<fs_doc>-carga_id
              AND docseq   = @<fs_doc>-docseq
            ORDER BY item_num
            INTO TABLE @DATA(lt_itens).

          READ TABLE lt_tpmov INTO DATA(ls_tpmov) WITH KEY ztpmov = <fs_doc>-ztpmov BINARY SEARCH.

          zclfi_tax_bapi_wrap=>contabilizar_documento(
            EXPORTING
              is_doc      = <fs_doc>
              is_tpmov    = ls_tpmov
              it_itens    = lt_itens
            IMPORTING
              ev_sucesso  = DATA(lv_post_ok)
              ev_belnr    = DATA(lv_belnr)
              ev_gjahr    = DATA(lv_gjahr)
              ev_mensagem = DATA(lv_msg_post)
          ).

          IF lv_post_ok = abap_true.
            <fs_doc>-status   = 'L'. " Lançado
            <fs_doc>-belnr    = lv_belnr.
            <fs_doc>-gjahr    = lv_gjahr.
            <fs_doc>-mensagem = lv_msg_post.
          ELSE.
            <fs_doc>-status   = 'E'. " Erro na Contabilização
            <fs_doc>-mensagem = lv_msg_post.
          ENDIF.

          UPDATE ztfi_tax_doc FROM @<fs_doc>.
        ENDIF.

        " Reconta os status atualizados para consolidar o cabeçalho do lote
        CASE <fs_doc>-status.
          WHEN 'L'. lv_lancados += 1.
          WHEN 'V'. lv_validos  += 1.
          WHEN 'E'. lv_erros    += 1.
        ENDCASE.
      ENDLOOP.

      " Determina o novo status geral do lote: L (Totalmente Lançado), P (Parcialmente Lançado) ou E (Com Erros)
      DATA(lv_novo_status) = COND ztfi_tax_carga-status_geral(
        WHEN lv_lancados > 0 AND lv_erros = 0 AND lv_validos = 0 THEN 'L'
        WHEN lv_lancados > 0 AND ( lv_erros > 0 OR lv_validos > 0 ) THEN 'P'
        WHEN lv_erros > 0 THEN 'E'
        ELSE 'V'
      ).

      UPDATE ztfi_tax_carga
        SET status_geral = @lv_novo_status,
            qtd_validos  = @lv_validos,
            qtd_erros    = @lv_erros,
            qtd_lancados = @lv_lancados
        WHERE carga_id = @lv_carga_id.
    ENDLOOP.

    CLEAR lcl_buffer_contabilizacao=>gt_cargas_para_lancar.
  ENDMETHOD.

ENDCLASS.
```

---

### 🚀 Código Limpo (Sem Comentários - Para Copiar e Colar)

```abap
CLASS lcl_buffer_contabilizacao DEFINITION FINAL CREATE PRIVATE.
  PUBLIC SECTION.
    CLASS-DATA gt_cargas_para_lancar TYPE SORTED TABLE OF ztfi_tax_carga-carga_id WITH UNIQUE KEY table_line.
ENDCLASS.


CLASS lhc_Carga DEFINITION INHERITING FROM cl_abap_behavior_handler.
  PRIVATE SECTION.

    METHODS get_instance_features FOR INSTANCE FEATURES
      IMPORTING keys REQUEST requested_features FOR Carga RESULT result.

    METHODS get_global_authorizations FOR GLOBAL AUTHORIZATION
      IMPORTING REQUEST requested_authorizations FOR Carga RESULT result.

    METHODS carregarArquivo FOR MODIFY
      IMPORTING keys FOR ACTION Carga~carregarArquivo RESULT result.

    METHODS baixarModelo FOR MODIFY
      IMPORTING keys FOR ACTION Carga~baixarModelo RESULT result.

    METHODS lancar FOR MODIFY
      IMPORTING keys FOR ACTION Carga~lancar RESULT result.

ENDCLASS.


CLASS lhc_Carga IMPLEMENTATION.

  METHOD get_instance_features.
    READ ENTITIES OF zi_fi_tax_carga IN LOCAL MODE
      ENTITY Carga
      FIELDS ( status_geral qtd_validos qtd_lancados )
      WITH CORRESPONDING #( keys )
      RESULT DATA(lt_cargas).

    result = VALUE #( FOR ls_carga IN lt_cargas (
      %tky = ls_carga-%tky
      %action-lancar = COND #( WHEN ls_carga-qtd_validos > 0 AND ls_carga-status_geral <> 'L'
                               THEN if_abap_behv=>fc-o-enabled
                               ELSE if_abap_behv=>fc-o-disabled )
      %delete        = COND #( WHEN ls_carga-qtd_lancados = 0 AND ls_carga-status_geral <> 'L' AND ls_carga-status_geral <> 'P'
                               THEN if_abap_behv=>fc-o-enabled
                               ELSE if_abap_behv=>fc-o-disabled )
    ) ).
  ENDMETHOD.


  METHOD get_global_authorizations.
    AUTHORITY-CHECK OBJECT 'ZTAXCARGA'
      ID 'ACTVT' FIELD '01'.
    DATA(lv_auth_create) = COND #( WHEN sy-subrc = 0
                                   THEN if_abap_behv=>auth-allowed
                                   ELSE if_abap_behv=>auth-unauthorized ).

    result-%delete                 = lv_auth_create.
    result-%action-carregarArquivo = lv_auth_create.

    AUTHORITY-CHECK OBJECT 'ZTAXCARGA'
      ID 'ACTVT' FIELD '03'.
    result-%action-baixarModelo = COND #( WHEN sy-subrc = 0
                                          THEN if_abap_behv=>auth-allowed
                                          ELSE if_abap_behv=>auth-unauthorized ).

    AUTHORITY-CHECK OBJECT 'ZTAXCARGA'
      ID 'ACTVT' FIELD '16'.
    result-%action-lancar = COND #( WHEN sy-subrc = 0
                                    THEN if_abap_behv=>auth-allowed
                                    ELSE if_abap_behv=>auth-unauthorized ).
  ENDMETHOD.


  METHOD baixarModelo.
    DATA(lv_base64) = zclfi_tax_excel=>gerar_modelo_base64( ).

    result = VALUE #( FOR ls_key IN keys (
      %cid   = ls_key-%cid
      %param = VALUE #(
        nome_arquivo    = 'DEL-COM-165_Modelo_Layout_Carga.xlsx'
        mime_type       = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        conteudo_base64 = lv_base64
      )
    ) ).
  ENDMETHOD.


  METHOD carregarArquivo.
    READ TABLE keys INTO DATA(ls_key) INDEX 1.
    IF sy-subrc <> 0.
      RETURN.
    ENDIF.

    zclfi_tax_excel=>ler_planilha_base64(
      EXPORTING
        iv_conteudo_base64 = ls_key-%param-conteudo_base64
      IMPORTING
        et_linhas          = DATA(lt_linhas)
        ev_erro            = DATA(lv_erro_excel)
        ev_mensagem        = DATA(lv_msg_excel)
    ).

    IF lv_erro_excel = abap_true OR lt_linhas IS INITIAL.
      APPEND VALUE #( %cid = ls_key-%cid ) TO failed-carga.
      APPEND VALUE #(
        %cid = ls_key-%cid
        %msg = new_message_with_text( severity = if_abap_behv_message=>severity-error
                                      text     = lv_msg_excel )
      ) TO reported-carga.
      RETURN.
    ENDIF.

    DATA(lv_carga_id)  = zclfi_tax_bapi_wrap=>obter_proximo_carga_id( ).
    DATA(lv_cid_carga) = COND string( WHEN ls_key-%cid IS NOT INITIAL THEN ls_key-%cid ELSE 'CID_CARGA_1' ).

    SELECT *
      FROM ztfi_tax_tpmov
      INTO TABLE @DATA(lt_tpmov).
    SORT lt_tpmov BY ztpmov.

    DATA lt_create_carga TYPE TABLE FOR CREATE zi_fi_tax_carga.
    DATA lt_create_doc   TYPE TABLE FOR CREATE zi_fi_tax_carga\_Documentos.
    DATA lt_create_item  TYPE TABLE FOR CREATE zi_fi_tax_doc\_Itens.

    APPEND VALUE #( %cid_ref = lv_cid_carga ) TO lt_create_doc.

    DATA lv_qtd_docs     TYPE i VALUE 0.
    DATA lv_qtd_validos  TYPE i VALUE 0.
    DATA lv_qtd_erros    TYPE i VALUE 0.
    DATA lv_lote_debito  TYPE ztfi_tax_carga-total_debito VALUE 0.
    DATA lv_lote_credito TYPE ztfi_tax_carga-total_credito VALUE 0.
    DATA lv_waers_lote   TYPE waers VALUE 'BRL'.

    LOOP AT lt_linhas INTO DATA(ls_grp_head)
      GROUP BY ( docseq = ls_grp_head-docseq )
      ASCENDING ASSIGNING FIELD-SYMBOL(<fs_grupo>).

      lv_qtd_docs += 1.

      DATA ls_doc_db   TYPE ztfi_tax_doc.
      DATA lt_itens_db TYPE zclfi_tax_bapi_wrap=>tt_tax_item.
      DATA lv_erro_doc TYPE abap_boolean VALUE abap_false.
      DATA lv_msg_doc  TYPE ztfi_tax_doc-mensagem.
      DATA lv_item_num TYPE ztfi_tax_item-item_num VALUE 0.
      DATA lv_prim_lin TYPE abap_boolean VALUE abap_true.

      CLEAR: ls_doc_db, lt_itens_db, lv_msg_doc.
      ls_doc_db-carga_id = lv_carga_id.
      ls_doc_db-docseq   = <fs_grupo>-docseq.

      LOOP AT GROUP <fs_grupo> INTO DATA(ls_lin).
        IF lv_prim_lin = abap_true.
          lv_prim_lin      = abap_false.
          ls_doc_db-ztpmov = ls_lin-ztpmov.
          ls_doc_db-bukrs  = COND #( WHEN ls_lin-bukrs IS NOT INITIAL THEN ls_lin-bukrs ELSE 'CVH1' ).
          ls_doc_db-bldat  = ls_lin-bldat.
          ls_doc_db-budat  = ls_lin-budat.
          ls_doc_db-xblnr  = ls_lin-xblnr.
          ls_doc_db-bktxt  = ls_lin-bktxt.
          ls_doc_db-waers  = COND #( WHEN ls_lin-waers IS NOT INITIAL THEN ls_lin-waers ELSE 'BRL' ).
          lv_waers_lote    = ls_doc_db-waers.
        ENDIF.

        READ TABLE lt_tpmov INTO DATA(ls_tpmov) WITH KEY ztpmov = ls_doc_db-ztpmov BINARY SEARCH.
        DATA(lv_tpmov_existe) = xsdbool( sy-subrc = 0 ).

        lv_item_num += 1.
        DATA ls_item_db TYPE ztfi_tax_item.
        CLEAR ls_item_db.
        ls_item_db-carga_id    = lv_carga_id.
        ls_item_db-docseq      = ls_doc_db-docseq.
        ls_item_db-item_num    = lv_item_num.
        ls_item_db-lifnr       = |{ ls_lin-lifnr ALPHA = IN }|.
        ls_item_db-waers       = ls_doc_db-waers.
        ls_item_db-wrsol       = ls_lin-wrsol.
        ls_item_db-wrhab       = ls_lin-wrhab.
        ls_item_db-zfbdt       = ls_lin-zfbdt.
        ls_item_db-zterm       = ls_lin-zterm.
        ls_item_db-sgtxt       = ls_lin-sgtxt.
        ls_item_db-zuonr       = ls_lin-zuonr.
        ls_item_db-gerado_auto = abap_false.

        IF ls_item_db-wrsol > 0 AND ls_item_db-wrhab = 0.
          ls_item_db-shkzg = 'S'.
          IF lv_tpmov_existe = abap_true.
            ls_item_db-umskz = ls_tpmov-umskz_deb.
          ENDIF.
        ELSEIF ls_item_db-wrhab > 0 AND ls_item_db-wrsol = 0.
          ls_item_db-shkzg = 'H'.
          IF lv_tpmov_existe = abap_true.
            ls_item_db-umskz = ls_tpmov-umskz_cred.
          ENDIF.
        ENDIF.

        IF ls_item_db-umskz IS NOT INITIAL AND lv_tpmov_existe = abap_true.
          ls_item_db-zlspr = COND #( WHEN ls_tpmov-zlspr IS NOT INITIAL THEN ls_tpmov-zlspr ELSE 'T' ).
        ENDIF.

        ls_doc_db-total_debito  += ls_item_db-wrsol.
        ls_doc_db-total_credito += ls_item_db-wrhab.

        IF lv_erro_doc = abap_false.
          IF ( ls_item_db-wrsol <= 0 AND ls_item_db-wrhab <= 0 ) OR
             ( ls_item_db-wrsol > 0  AND ls_item_db-wrhab > 0 ).
            lv_erro_doc = abap_true.
            MESSAGE e013(zfi_taxas) WITH ls_doc_db-docseq ls_item_db-item_num INTO lv_msg_doc.
          ELSEIF ls_item_db-lifnr IS INITIAL OR
                 zclfi_tax_bapi_wrap=>validar_fornecedor( iv_lifnr = ls_item_db-lifnr
                                                          iv_bukrs = ls_doc_db-bukrs ) = abap_false.
            lv_erro_doc = abap_true.
            MESSAGE e012(zfi_taxas) WITH ls_doc_db-docseq ls_item_db-item_num ls_doc_db-bukrs INTO lv_msg_doc.
          ELSEIF lv_tpmov_existe = abap_true AND ls_tpmov-zfbdt_obrig = abap_true AND ls_item_db-zfbdt IS INITIAL.
            lv_erro_doc = abap_true.
            MESSAGE e014(zfi_taxas) WITH ls_doc_db-docseq ls_item_db-item_num ls_doc_db-ztpmov INTO lv_msg_doc.
          ELSEIF lv_tpmov_existe = abap_true AND ls_tpmov-zuonr_obrig = abap_true AND ls_item_db-zuonr IS INITIAL.
            lv_erro_doc = abap_true.
            MESSAGE e015(zfi_taxas) WITH ls_doc_db-docseq ls_item_db-item_num ls_doc_db-ztpmov INTO lv_msg_doc.
          ELSEIF lv_tpmov_existe = abap_true AND ls_tpmov-hkont_contrapartida IS NOT INITIAL AND ls_item_db-wrsol > 0.
            lv_erro_doc = abap_true.
            MESSAGE e009(zfi_taxas) WITH ls_doc_db-docseq ls_doc_db-ztpmov ls_tpmov-hkont_contrapartida INTO lv_msg_doc.
          ELSE.
            SELECT SINGLE d~belnr
              FROM ztfi_tax_doc AS d
              INNER JOIN ztfi_tax_item AS i
                ON  i~carga_id = d~carga_id
                AND i~docseq   = d~docseq
              WHERE d~status = 'L'
                AND d~xblnr  = @ls_doc_db-xblnr
                AND d~ztpmov = @ls_doc_db-ztpmov
                AND i~lifnr  = @ls_item_db-lifnr
                AND i~wrsol  = @ls_item_db-wrsol
                AND i~wrhab  = @ls_item_db-wrhab
              INTO @DATA(lv_belnr_dup).
            IF sy-subrc = 0.
              lv_erro_doc = abap_true.
              MESSAGE e016(zfi_taxas) WITH ls_doc_db-docseq lv_belnr_dup ls_doc_db-xblnr ls_item_db-lifnr INTO lv_msg_doc.
            ENDIF.
          ENDIF.
        ENDIF.

        APPEND ls_item_db TO lt_itens_db.
      ENDLOOP.

      READ TABLE lt_tpmov INTO ls_tpmov WITH KEY ztpmov = ls_doc_db-ztpmov BINARY SEARCH.
      lv_tpmov_existe = xsdbool( sy-subrc = 0 ).

      IF lv_tpmov_existe = abap_true AND ls_tpmov-hkont_contrapartida IS NOT INITIAL AND ls_doc_db-total_credito > 0.
        lv_item_num += 1.
        CLEAR ls_item_db.
        ls_item_db-carga_id    = lv_carga_id.
        ls_item_db-docseq      = ls_doc_db-docseq.
        ls_item_db-item_num    = lv_item_num.
        ls_item_db-hkont       = |{ ls_tpmov-hkont_contrapartida ALPHA = IN }|.
        ls_item_db-shkzg       = 'S'.
        ls_item_db-waers       = ls_doc_db-waers.
        ls_item_db-wrsol       = ls_doc_db-total_credito.
        ls_item_db-sgtxt       = COND #( WHEN ls_doc_db-bktxt IS NOT INITIAL
                                         THEN ls_doc_db-bktxt
                                         ELSE ls_tpmov-descricao ).
        ls_item_db-gerado_auto = abap_true.

        ls_doc_db-total_debito += ls_item_db-wrsol.
        APPEND ls_item_db TO lt_itens_db.
      ENDIF.

      IF lv_erro_doc = abap_false.
        IF lv_tpmov_existe = abap_false.
          lv_erro_doc = abap_true.
          MESSAGE e005(zfi_taxas) WITH ls_doc_db-docseq ls_doc_db-ztpmov INTO lv_msg_doc.
        ELSEIF ls_tpmov-ativo = abap_false OR
               ( ls_tpmov-valido_de  IS NOT INITIAL AND ls_doc_db-budat < ls_tpmov-valido_de ) OR
               ( ls_tpmov-valido_ate IS NOT INITIAL AND ls_doc_db-budat > ls_tpmov-valido_ate ).
          lv_erro_doc = abap_true.
          MESSAGE e006(zfi_taxas) WITH ls_doc_db-docseq ls_doc_db-ztpmov ls_doc_db-budat INTO lv_msg_doc.
        ELSEIF ls_doc_db-bukrs IS INITIAL OR ls_doc_db-bldat IS INITIAL OR
               ls_doc_db-budat IS INITIAL OR ls_doc_db-xblnr IS INITIAL.
          lv_erro_doc = abap_true.
          MESSAGE e007(zfi_taxas) WITH ls_doc_db-docseq INTO lv_msg_doc.
        ELSEIF ls_tpmov-hkont_contrapartida IS NOT INITIAL AND
               zclfi_tax_bapi_wrap=>validar_conta_razao( iv_hkont = ls_tpmov-hkont_contrapartida
                                                         iv_bukrs = ls_doc_db-bukrs ) = abap_false.
          lv_erro_doc = abap_true.
          MESSAGE e010(zfi_taxas) WITH ls_doc_db-docseq ls_tpmov-hkont_contrapartida ls_doc_db-bukrs INTO lv_msg_doc.
        ELSEIF ls_doc_db-total_debito <> ls_doc_db-total_credito OR ls_doc_db-total_debito <= 0.
          lv_erro_doc = abap_true.
          MESSAGE e008(zfi_taxas) WITH ls_doc_db-docseq ls_doc_db-total_debito ls_doc_db-total_credito INTO lv_msg_doc.
        ENDIF.
      ENDIF.

      IF lv_erro_doc = abap_false.
        zclfi_tax_bapi_wrap=>simular_documento(
          EXPORTING
            is_doc      = ls_doc_db
            is_tpmov    = ls_tpmov
            it_itens    = lt_itens_db
          IMPORTING
            ev_sucesso  = DATA(lv_bapi_ok)
            ev_mensagem = lv_msg_doc
        ).
        IF lv_bapi_ok = abap_true.
          ls_doc_db-status = 'V'.
          lv_qtd_validos  += 1.
        ELSE.
          ls_doc_db-status = 'E'.
          lv_qtd_erros    += 1.
        ENDIF.
      ELSE.
        ls_doc_db-status = 'E'.
        lv_qtd_erros    += 1.
      ENDIF.

      ls_doc_db-mensagem = lv_msg_doc.
      lv_lote_debito    += ls_doc_db-total_debito.
      lv_lote_credito   += ls_doc_db-total_credito.

      DATA(lv_cid_doc) = |DOC_{ ls_doc_db-docseq }|.

      APPEND VALUE #(
        %cid          = lv_cid_doc
        carga_id      = ls_doc_db-carga_id
        docseq        = ls_doc_db-docseq
        ztpmov        = ls_doc_db-ztpmov
        bukrs         = ls_doc_db-bukrs
        bldat         = ls_doc_db-bldat
        budat         = ls_doc_db-budat
        xblnr         = ls_doc_db-xblnr
        bktxt         = ls_doc_db-bktxt
        waers         = ls_doc_db-waers
        total_debito  = ls_doc_db-total_debito
        total_credito = ls_doc_db-total_credito
        status        = ls_doc_db-status
        mensagem      = ls_doc_db-mensagem
        %control = VALUE #(
          carga_id      = if_abap_behv=>mk-on
          docseq        = if_abap_behv=>mk-on
          ztpmov        = if_abap_behv=>mk-on
          bukrs         = if_abap_behv=>mk-on
          bldat         = if_abap_behv=>mk-on
          budat         = if_abap_behv=>mk-on
          xblnr         = if_abap_behv=>mk-on
          bktxt         = if_abap_behv=>mk-on
          waers         = if_abap_behv=>mk-on
          total_debito  = if_abap_behv=>mk-on
          total_credito = if_abap_behv=>mk-on
          status        = if_abap_behv=>mk-on
          mensagem      = if_abap_behv=>mk-on
        )
      ) TO lt_create_doc[ 1 ]-%target.

      DATA ls_cba_item LIKE LINE OF lt_create_item.
      CLEAR ls_cba_item.
      ls_cba_item-%cid_ref = lv_cid_doc.

      LOOP AT lt_itens_db INTO DATA(ls_itm_row).
        APPEND VALUE #(
          %cid        = |ITM_{ ls_itm_row-docseq }_{ ls_itm_row-item_num }|
          carga_id    = ls_itm_row-carga_id
          docseq      = ls_itm_row-docseq
          item_num    = ls_itm_row-item_num
          lifnr       = ls_itm_row-lifnr
          hkont       = ls_itm_row-hkont
          shkzg       = ls_itm_row-shkzg
          umskz       = ls_itm_row-umskz
          waers       = ls_itm_row-waers
          wrsol       = ls_itm_row-wrsol
          wrhab       = ls_itm_row-wrhab
          zfbdt       = ls_itm_row-zfbdt
          zterm       = ls_itm_row-zterm
          zlspr       = ls_itm_row-zlspr
          sgtxt       = ls_itm_row-sgtxt
          zuonr       = ls_itm_row-zuonr
          gerado_auto = ls_itm_row-gerado_auto
          %control = VALUE #(
            carga_id    = if_abap_behv=>mk-on
            docseq      = if_abap_behv=>mk-on
            item_num    = if_abap_behv=>mk-on
            lifnr       = if_abap_behv=>mk-on
            hkont       = if_abap_behv=>mk-on
            shkzg       = if_abap_behv=>mk-on
            umskz       = if_abap_behv=>mk-on
            waers       = if_abap_behv=>mk-on
            wrsol       = if_abap_behv=>mk-on
            wrhab       = if_abap_behv=>mk-on
            zfbdt       = if_abap_behv=>mk-on
            zterm       = if_abap_behv=>mk-on
            zlspr       = if_abap_behv=>mk-on
            sgtxt       = if_abap_behv=>mk-on
            zuonr       = if_abap_behv=>mk-on
            gerado_auto = if_abap_behv=>mk-on
          )
        ) TO ls_cba_item-%target.
      ENDLOOP.

      APPEND ls_cba_item TO lt_create_item.
    ENDLOOP.

    DATA(lv_status_lote) = COND ztfi_tax_carga-status_geral(
      WHEN lv_qtd_erros = 0 THEN 'V'
      ELSE 'E'
    ).

    lt_create_carga = VALUE #( (
      %cid          = lv_cid_carga
      carga_id      = lv_carga_id
      nome_arquivo  = COND #( WHEN ls_key-%param-nome_arquivo IS NOT INITIAL
                              THEN ls_key-%param-nome_arquivo
                              ELSE 'Planilha_Taxas.xlsx' )
      status_geral  = lv_status_lote
      qtd_docs      = lv_qtd_docs
      qtd_validos   = lv_qtd_validos
      qtd_erros     = lv_qtd_erros
      qtd_lancados  = 0
      waers         = lv_waers_lote
      total_debito  = lv_lote_debito
      total_credito = lv_lote_credito
      %control = VALUE #(
        carga_id      = if_abap_behv=>mk-on
        nome_arquivo  = if_abap_behv=>mk-on
        status_geral  = if_abap_behv=>mk-on
        qtd_docs      = if_abap_behv=>mk-on
        qtd_validos   = if_abap_behv=>mk-on
        qtd_erros     = if_abap_behv=>mk-on
        qtd_lancados  = if_abap_behv=>mk-on
        waers         = if_abap_behv=>mk-on
        total_debito  = if_abap_behv=>mk-on
        total_credito = if_abap_behv=>mk-on
      )
    ) ).

    MODIFY ENTITIES OF zi_fi_tax_carga IN LOCAL MODE
      ENTITY Carga
        CREATE FROM lt_create_carga
      ENTITY Carga
        CREATE BY \_Documentos FROM lt_create_doc
      ENTITY Documento
        CREATE BY \_Itens FROM lt_create_item
      MAPPED DATA(ls_mapped)
      FAILED DATA(ls_failed)
      REPORTED DATA(ls_reported).

    READ ENTITIES OF zi_fi_tax_carga IN LOCAL MODE
      ENTITY Carga
      ALL FIELDS WITH VALUE #( ( carga_id = lv_carga_id ) )
      RESULT DATA(lt_carga_criada).

    result = VALUE #( FOR ls_c IN lt_carga_criada (
      %cid   = ls_key-%cid
      %param = ls_c
    ) ).

    APPEND VALUE #(
      carga_id = lv_carga_id
      %msg     = new_message( id       = 'ZFI_TAXAS'
                              number   = '004'
                              severity = COND #( WHEN lv_qtd_erros = 0
                                                 THEN if_abap_behv_message=>severity-success
                                                 ELSE if_abap_behv_message=>severity-warning )
                              v1       = lv_carga_id
                              v2       = |{ lv_qtd_validos }|
                              v3       = |{ lv_qtd_erros }| )
    ) TO reported-carga.
  ENDMETHOD.


  METHOD lancar.
    READ ENTITIES OF zi_fi_tax_carga IN LOCAL MODE
      ENTITY Carga
      ALL FIELDS WITH CORRESPONDING #( keys )
      RESULT DATA(lt_cargas).

    LOOP AT lt_cargas INTO DATA(ls_carga).
      IF ls_carga-qtd_validos <= 0 OR ls_carga-status_geral = 'L'.
        APPEND VALUE #( %tky = ls_carga-%tky ) TO failed-carga.
        APPEND VALUE #(
          %tky = ls_carga-%tky
          %msg = new_message( id       = 'ZFI_TAXAS'
                              number   = '019'
                              severity = if_abap_behv_message=>severity-error
                              v1       = ls_carga-carga_id )
        ) TO reported-carga.
        CONTINUE.
      ENDIF.

      INSERT ls_carga-carga_id INTO TABLE lcl_buffer_contabilizacao=>gt_cargas_para_lancar.

      MODIFY ENTITIES OF zi_fi_tax_carga IN LOCAL MODE
        ENTITY Carga
        UPDATE FIELDS ( status_geral )
        WITH VALUE #( ( %tky         = ls_carga-%tky
                        status_geral = ls_carga-status_geral ) ).

      APPEND VALUE #( %tky   = ls_carga-%tky
                      %param = ls_carga ) TO result.
    ENDLOOP.
  ENDMETHOD.

ENDCLASS.


CLASS lsc_ZI_FI_TAX_CARGA DEFINITION INHERITING FROM cl_abap_behavior_saver.
  PROTECTED SECTION.
    METHODS save_modified REDEFINITION.
ENDCLASS.


CLASS lsc_ZI_FI_TAX_CARGA IMPLEMENTATION.

  METHOD save_modified.
    IF lcl_buffer_contabilizacao=>gt_cargas_para_lancar IS INITIAL.
      RETURN.
    ENDIF.

    SELECT *
      FROM ztfi_tax_tpmov
      INTO TABLE @DATA(lt_tpmov).
    SORT lt_tpmov BY ztpmov.

    LOOP AT lcl_buffer_contabilizacao=>gt_cargas_para_lancar INTO DATA(lv_carga_id).
      SELECT *
        FROM ztfi_tax_doc
        WHERE carga_id = @lv_carga_id
        ORDER BY docseq
        INTO TABLE @DATA(lt_docs).

      IF lt_docs IS INITIAL.
        CONTINUE.
      ENDIF.

      DATA lv_validos  TYPE i VALUE 0.
      DATA lv_erros    TYPE i VALUE 0.
      DATA lv_lancados TYPE i VALUE 0.

      LOOP AT lt_docs ASSIGNING FIELD-SYMBOL(<fs_doc>).
        IF <fs_doc>-status = 'V'.
          SELECT *
            FROM ztfi_tax_item
            WHERE carga_id = @<fs_doc>-carga_id
              AND docseq   = @<fs_doc>-docseq
            ORDER BY item_num
            INTO TABLE @DATA(lt_itens).

          READ TABLE lt_tpmov INTO DATA(ls_tpmov) WITH KEY ztpmov = <fs_doc>-ztpmov BINARY SEARCH.

          zclfi_tax_bapi_wrap=>contabilizar_documento(
            EXPORTING
              is_doc      = <fs_doc>
              is_tpmov    = ls_tpmov
              it_itens    = lt_itens
            IMPORTING
              ev_sucesso  = DATA(lv_post_ok)
              ev_belnr    = DATA(lv_belnr)
              ev_gjahr    = DATA(lv_gjahr)
              ev_mensagem = DATA(lv_msg_post)
          ).

          IF lv_post_ok = abap_true.
            <fs_doc>-status   = 'L'.
            <fs_doc>-belnr    = lv_belnr.
            <fs_doc>-gjahr    = lv_gjahr.
            <fs_doc>-mensagem = lv_msg_post.
          ELSE.
            <fs_doc>-status   = 'E'.
            <fs_doc>-mensagem = lv_msg_post.
          ENDIF.

          UPDATE ztfi_tax_doc FROM @<fs_doc>.
        ENDIF.

        CASE <fs_doc>-status.
          WHEN 'L'. lv_lancados += 1.
          WHEN 'V'. lv_validos  += 1.
          WHEN 'E'. lv_erros    += 1.
        ENDCASE.
      ENDLOOP.

      DATA(lv_novo_status) = COND ztfi_tax_carga-status_geral(
        WHEN lv_lancados > 0 AND lv_erros = 0 AND lv_validos = 0 THEN 'L'
        WHEN lv_lancados > 0 AND ( lv_erros > 0 OR lv_validos > 0 ) THEN 'P'
        WHEN lv_erros > 0 THEN 'E'
        ELSE 'V'
      ).

      UPDATE ztfi_tax_carga
        SET status_geral = @lv_novo_status,
            qtd_validos  = @lv_validos,
            qtd_erros    = @lv_erros,
            qtd_lancados = @lv_lancados
        WHERE carga_id = @lv_carga_id.
    ENDLOOP.

    CLEAR lcl_buffer_contabilizacao=>gt_cargas_para_lancar.
  ENDMETHOD.

ENDCLASS.
```
