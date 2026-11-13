---
tipo: objeto-tecnico
tags:
  - projeto
  - veiling-holambra
  - sap
  - fi
  - abap
  - xco
  - excel
  - abap-cloud
  - del-com-165
  - objeto-tecnico
id_demanda: DEL-COM-165
objeto: "ZCLFI_TAX_EXCEL"
camada: "3 - Comportamento RAP"
data: 2026-11-11
aliases:
  - "ZCLFI_TAX_EXCEL"
---

# 📦 `ZCLFI_TAX_EXCEL` (Classe ABAP — Motor de Leitura e Geração Excel via `XCO_CP_XLSX`)

⬅️ [[01 - DEL-COM-165 - Arquitetura App 1 (Carga Massiva de Taxas)|Voltar para Arquitetura App 1]] | 🎨 [[01 - DEL-COM-165 - Arquitetura Técnica App 1 (Carga Massiva).excalidraw|Ver no Diagrama Excalidraw App 1]]

---

## 📌 Visão Geral do Objeto

A classe `ZCLFI_TAX_EXCEL` encapsula toda a manipulação de arquivos Excel (`.xlsx`) da solução utilizando exclusivamente a biblioteca standard **`XCO_CP_XLSX`** (*XCO XLSX Library*, confirmada no ambiente S/4HANA 2025). Ela provê dois métodos estáticos principais consumidos pelo *Behavior Pool* [[25 - ZCLFI_BP_TAX_CARGA|ZCLFI_BP_TAX_CARGA]]:
1. `ler_planilha_base64`: Recebe o conteúdo `Base64` enviado pelo Fiori, converte para `xstring`, abre a pasta de trabalho via `xco_cp_xlsx` (**`=>`** `document->for_file_content`), localiza a aba `Carga` (ou a primeira aba de dados) e lê as **15 colunas oficiais** a partir da **linha 6**.
2. `gerar_modelo_base64`: Cria dinamicamente um arquivo `.xlsx` em memória com as abas `Carga` (contendo os cabeçalhos técnicos na linha 4 e os rótulos amigáveis na linha 5) e `Tipos de Movimento` (listando os códigos ativos cadastrados em [[01 - ZTFI_TAX_TPMOV|ZTFI_TAX_TPMOV]]), retornando o arquivo codificado em `Base64` para download imediato no navegador.

---

## ⚖️ Regras de Negócio Aplicadas

1. **Aderência 100% ao Layout Oficial do Consultor (15 Colunas, Linha Inicial 6):**
   - **Linha 4:** Nomes técnicos dos campos SAP (`DOCSEQ`, `ZTPMOV`, `BUKRS`, `BLDAT`, `BUDAT`, `XBLNR`, `BKTXT`, `WAERS`, `LIFNR`, `WRSOL`, `WRHAB`, `ZFBDT`, `ZTERM`, `SGTXT`, `ZUONR`).
   - **Linha 5:** Rótulos descritivos para o usuário.
   - **Linha 6 em diante:** Dados efetivos de lançamento.
2. **Normalização de Datas e Valores Monetários:**
   - Os métodos internos `converter_data` e `converter_valor` tratam automaticamente datas vindas do Excel tanto no formato brasileiro (`DD/MM/AAAA` ou `DD.MM.AAAA`) quanto no formato interno `AAAAMMDD`, bem como valores numéricos com vírgula ou ponto decimal.

---

## 🛠️ Passo a Passo da Criação do Objeto

1. **No Eclipse ADT:** Conecte-se ao sistema e acesse o pacote `ZFI_CARGA_TAXAS`.
2. Clique com o botão direito -> **`New`** -> **`ABAP Class`**.
3. Preencha as propriedades:
   - **Name:** `ZCLFI_TAX_EXCEL`
   - **Description:** `DEL-COM-165: Leitura e Geração de Excel via XCO_CP_XLSX`
4. Selecione a Request (TR) de desenvolvimento e conclua o assistente.
5. Substitua o código gerado pelo snippet abaixo e ative com **`Ctrl + F3`**.

---

## 💻 Snippet de Código

### 📝 Código Comentado (Para Estudo e Referência)

```abap
CLASS zclfi_tax_excel DEFINITION
  PUBLIC
  FINAL
  CREATE PUBLIC.

  PUBLIC SECTION.
    " Estrutura espelhando exatamente as 15 colunas (A..O) da aba 'Carga' do Excel
    TYPES: BEGIN OF ty_linha_excel_raw,
             docseq TYPE string, " Col A (1)  - Nº Doc na Carga
             ztpmov TYPE string, " Col B (2)  - Tipo de Movimento
             bukrs  TYPE string, " Col C (3)  - Empresa
             bldat  TYPE string, " Col D (4)  - Data do Documento
             budat  TYPE string, " Col E (5)  - Data de Lançamento
             xblnr  TYPE string, " Col F (6)  - Referência
             bktxt  TYPE string, " Col G (7)  - Texto do Cabeçalho
             waers  TYPE string, " Col H (8)  - Moeda
             lifnr  TYPE string, " Col I (9)  - Fornecedor / Cooperado
             wrsol  TYPE string, " Col J (10) - Valor Débito
             wrhab  TYPE string, " Col K (11) - Valor Crédito
             zfbdt  TYPE string, " Col L (12) - Data Base
             zterm  TYPE string, " Col M (13) - Condição de Pagamento
             sgtxt  TYPE string, " Col N (14) - Texto do Item
             zuonr  TYPE string, " Col O (15) - Atribuição / Nº Contrato
           END OF ty_linha_excel_raw.

    " Estrutura tipada ABAP pronta para processamento pelo Behavior Pool
    TYPES: BEGIN OF ty_linha_carga,
             linha_planilha TYPE i,
             docseq         TYPE ztfi_tax_doc-docseq,
             ztpmov         TYPE ztfi_tax_doc-ztpmov,
             bukrs          TYPE bukrs,
             bldat          TYPE bldat,
             budat          TYPE budat,
             xblnr          TYPE xblnr1,
             bktxt          TYPE bktxt,
             waers          TYPE waers,
             lifnr          TYPE lifnr,
             wrsol          TYPE ztfi_tax_item-wrsol,
             wrhab          TYPE ztfi_tax_item-wrhab,
             zfbdt          TYPE dzfbdt,
             zterm          TYPE dzterm,
             sgtxt          TYPE sgtxt,
             zuonr          TYPE dzuonr,
           END OF ty_linha_carga.

    TYPES tt_linhas_carga TYPE STANDARD TABLE OF ty_linha_carga WITH EMPTY KEY.

    " Lê o arquivo Excel em Base64 e retorna as linhas tipadas a partir da linha 6 da aba 'Carga'
    CLASS-METHODS ler_planilha_base64
      IMPORTING
        iv_conteudo_base64 TYPE string
      EXPORTING
        et_linhas          TYPE tt_linhas_carga
        ev_erro            TYPE abap_boolean
        ev_mensagem        TYPE string.

    " Gera dinamicamente a planilha modelo (.xlsx) em Base64 com as 15 colunas e Tipos de Movimento ativos
    CLASS-METHODS gerar_modelo_base64
      RETURNING
        VALUE(rv_conteudo_base64) TYPE string.

  PRIVATE SECTION.
    CLASS-METHODS converter_data
      IMPORTING
        iv_texto       TYPE string
      RETURNING
        VALUE(rv_data) TYPE d.

    CLASS-METHODS converter_valor
      IMPORTING
        iv_texto        TYPE string
      RETURNING
        VALUE(rv_valor) TYPE ztfi_tax_item-wrsol.
ENDCLASS.



CLASS zclfi_tax_excel IMPLEMENTATION.

  METHOD ler_planilha_base64.
    CLEAR: et_linhas, ev_erro, ev_mensagem.

    IF iv_conteudo_base64 IS INITIAL.
      ev_erro = abap_true.
      MESSAGE e002(zfi_taxas) INTO ev_mensagem.
      RETURN.
    ENDIF.

    " Remove eventual prefixo Data-URI ('data:application/...;base64,') enviado pelo navegador
    DATA(lv_base64_limpo) = iv_conteudo_base64.
    FIND FIRST OCCURRENCE OF ',' IN lv_base64_limpo MATCH OFFSET DATA(lv_off).
    IF sy-subrc = 0.
      lv_off += 1.
      lv_base64_limpo = lv_base64_limpo+lv_off.
    ENDIF.

    " Converte Base64 para XSTRING usando a biblioteca standard XCO
    DATA(lv_xlsx_xstring) = xco_cp=>string( lv_base64_limpo )->as_xstring( xco_cp_binary=>text_encoding->base64 )->value.
    IF lv_xlsx_xstring IS INITIAL.
      ev_erro = abap_true.
      MESSAGE e002(zfi_taxas) INTO ev_mensagem.
      RETURN.
    ENDIF.

    TRY.
        " Abre o documento XLSX via XCO_CP_XLSX
        DATA(lo_doc) = xco_cp_xlsx=>document->for_file_content( lv_xlsx_xstring )->read_access( ).
        DATA(lo_sheets) = lo_doc->get_workbook( )->worksheet.

        " Prioriza a aba 'Carga'; caso não exista com esse nome exato, utiliza a primeira aba disponível
        DATA lo_sheet TYPE REF TO if_xco_xlsx_ra_worksheet.
        IF lo_sheets->for_name( 'Carga' )->exists( ) = abap_true.
          lo_sheet = lo_sheets->for_name( 'Carga' ).
        ELSE.
          lo_sheet = lo_sheets->at_position( 1 ).
        ENDIF.

        " Define o padrão de seleção da coluna A (1) até O (15), iniciando na linha 6
        DATA(lo_pattern) = xco_cp_xlsx_selection=>pattern_builder->simple_from_to(
          )->from_column( xco_cp_xlsx=>coordinate->for_alphabetic_value( 'A' )
          )->to_column( xco_cp_xlsx=>coordinate->for_alphabetic_value( 'O' )
          )->from_row( xco_cp_xlsx=>coordinate->for_numeric_value( 6 )
          )->get_pattern( ).

        DATA lt_raw TYPE STANDARD TABLE OF ty_linha_excel_raw WITH EMPTY KEY.

        lo_sheet->select( lo_pattern
          )->row_stream(
          )->operation->write_to( REF #( lt_raw )
          )->set_value_transformation( xco_cp_xlsx_read_access=>value_transformation->string_value
          )->execute( ).

        DATA lv_num_linha TYPE i VALUE 5.

        LOOP AT lt_raw INTO DATA(ls_raw).
          lv_num_linha += 1.

          " Ignora linhas completamente em branco no final da planilha
          IF ls_raw-docseq IS INITIAL AND ls_raw-lifnr IS INITIAL AND
             ls_raw-wrsol  IS INITIAL AND ls_raw-wrhab IS INITIAL.
            CONTINUE.
          ENDIF.

          DATA ls_linha TYPE ty_linha_carga.
          CLEAR ls_linha.
          ls_linha-linha_planilha = lv_num_linha.
          ls_linha-docseq         = |{ condense( ls_raw-docseq ) ALPHA = IN }|.
          ls_linha-ztpmov         = to_upper( condense( ls_raw-ztpmov ) ).
          ls_linha-bukrs          = to_upper( condense( ls_raw-bukrs ) ).
          ls_linha-bldat          = converter_data( ls_raw-bldat ).
          ls_linha-budat          = converter_data( ls_raw-budat ).
          ls_linha-xblnr          = condense( ls_raw-xblnr ).
          ls_linha-bktxt          = condense( ls_raw-bktxt ).
          ls_linha-waers          = to_upper( condense( ls_raw-waers ) ).
          ls_linha-lifnr          = condense( ls_raw-lifnr ).
          ls_linha-wrsol          = converter_valor( ls_raw-wrsol ).
          ls_linha-wrhab          = converter_valor( ls_raw-wrhab ).
          ls_linha-zfbdt          = converter_data( ls_raw-zfbdt ).
          ls_linha-zterm          = to_upper( condense( ls_raw-zterm ) ).
          ls_linha-sgtxt          = condense( ls_raw-sgtxt ).
          ls_linha-zuonr          = condense( ls_raw-zuonr ).

          APPEND ls_linha TO et_linhas.
        ENDLOOP.

        IF et_linhas IS INITIAL.
          ev_erro = abap_true.
          MESSAGE e003(zfi_taxas) INTO ev_mensagem.
        ENDIF.

      CATCH cx_root INTO DATA(lx_err).
        ev_erro = abap_true.
        ev_mensagem = lx_err->get_text( ).
    ENDTRY.
  ENDMETHOD.


  METHOD gerar_modelo_base64.
    TYPES: BEGIN OF ty_tpmov_sheet,
             ztpmov              TYPE string,
             descricao           TYPE string,
             umskz_deb           TYPE string,
             umskz_cred          TYPE string,
             hkont_contrapartida TYPE string,
             blart               TYPE string,
             zlspr               TYPE string,
             zfbdt_obrig         TYPE string,
             zuonr_obrig         TYPE string,
           END OF ty_tpmov_sheet.

    DATA lt_carga_template TYPE STANDARD TABLE OF ty_linha_excel_raw WITH EMPTY KEY.
    DATA lt_tpmov_sheet    TYPE STANDARD TABLE OF ty_tpmov_sheet WITH EMPTY KEY.

    " Linha 1 a 3: Cabeçalho informativo institucional da planilha
    APPEND VALUE #( docseq = 'DEL-COM-165 - Carga Massiva de Lançamentos de Taxas com Razão Especial' ) TO lt_carga_template.
    APPEND VALUE #( docseq = 'Preencha os dados a partir da linha 6. Colunas A..H apenas na 1ª linha de cada DOCSEQ.' ) TO lt_carga_template.
    APPEND VALUE #( docseq = 'CABEÇALHO DO DOCUMENTO (1ª LINHA DO DOCSEQ)'
                    lifnr  = 'ITENS DO DOCUMENTO (TODAS AS LINHAS)' ) TO lt_carga_template.

    " Linha 4: Nomes técnicos das 15 colunas (A..O)
    APPEND VALUE #(
      docseq = 'DOCSEQ' ztpmov = 'ZTPMOV' bukrs = 'BUKRS' bldat = 'BLDAT'
      budat  = 'BUDAT'  xblnr  = 'XBLNR'  bktxt = 'BKTXT' waers = 'WAERS'
      lifnr  = 'LIFNR'  wrsol  = 'WRSOL'  wrhab = 'WRHAB' zfbdt = 'ZFBDT'
      zterm  = 'ZTERM'  sgtxt  = 'SGTXT'  zuonr = 'ZUONR'
    ) TO lt_carga_template.

    " Linha 5: Rótulos amigáveis das 15 colunas
    APPEND VALUE #(
      docseq = 'Nº Doc. na Carga *'
      ztpmov = 'Tipo de Movimento *'
      bukrs  = 'Empresa *'
      bldat  = 'Data do Documento *'
      budat  = 'Data de Lançamento *'
      xblnr  = 'Referência *'
      bktxt  = 'Texto Cabeçalho'
      waers  = 'Moeda *'
      lifnr  = 'Fornecedor / Cooperado *'
      wrsol  = 'Valor Débito (R$) **'
      wrhab  = 'Valor Crédito (R$) **'
      zfbdt  = 'Data Base *'
      zterm  = 'Cond. Pagamento'
      sgtxt  = 'Texto do Item *'
      zuonr  = 'Atribuição (Nº Contrato)'
    ) TO lt_carga_template.

    " Cria o documento XLSX em memória via XCO_CP_XLSX
    DATA(lo_write_doc) = xco_cp_xlsx=>document->empty( )->write_access( ).

    " Aba 1: Carga (renomeia a aba padrão ou seleciona a posição 1)
    DATA(lo_sheet_carga) = lo_write_doc->get_workbook( )->worksheet->at_position( 1 ).

    DATA(lo_pattern_carga) = xco_cp_xlsx_selection=>pattern_builder->simple_from_to(
      )->from_column( xco_cp_xlsx=>coordinate->for_alphabetic_value( 'A' )
      )->to_column( xco_cp_xlsx=>coordinate->for_alphabetic_value( 'O' )
      )->from_row( xco_cp_xlsx=>coordinate->for_numeric_value( 1 )
      )->get_pattern( ).

    lo_sheet_carga->select( lo_pattern_carga
      )->row_stream(
      )->operation->write_from( REF #( lt_carga_template )
      )->execute( ).

    " Aba 2: Tipos de Movimento vigentes (consulta ZTFI_TAX_TPMOV)
    APPEND VALUE #(
      ztpmov              = 'ZTPMOV'
      descricao           = 'Descrição'
      umskz_deb           = 'Razão Esp. Débito'
      umskz_cred          = 'Razão Esp. Crédito'
      hkont_contrapartida = 'Conta Contrapartida'
      blart               = 'Tipo Doc.'
      zlspr               = 'Bloq. Pgto.'
      zfbdt_obrig         = 'ZFBDT Obrig.'
      zuonr_obrig         = 'ZUONR Obrig.'
    ) TO lt_tpmov_sheet.

    SELECT *
      FROM ztfi_tax_tpmov
      WHERE ativo = @abap_true
      ORDER BY ztpmov
      INTO TABLE @DATA(lt_db_tpmov).

    LOOP AT lt_db_tpmov INTO DATA(ls_db).
      APPEND VALUE #(
        ztpmov              = ls_db-ztpmov
        descricao           = ls_db-descricao
        umskz_deb           = ls_db-umskz_deb
        umskz_cred          = ls_db-umskz_cred
        hkont_contrapartida = ls_db-hkont_contrapartida
        blart               = ls_db-blart
        zlspr               = ls_db-zlspr
        zfbdt_obrig         = ls_db-zfbdt_obrig
        zuonr_obrig         = ls_db-zuonr_obrig
      ) TO lt_tpmov_sheet.
    ENDLOOP.

    DATA(lo_sheet_tpmov) = lo_write_doc->get_workbook( )->worksheet->add( 'Tipos de Movimento' ).
    DATA(lo_pattern_tpmov) = xco_cp_xlsx_selection=>pattern_builder->simple_from_to(
      )->from_column( xco_cp_xlsx=>coordinate->for_alphabetic_value( 'A' )
      )->to_column( xco_cp_xlsx=>coordinate->for_alphabetic_value( 'I' )
      )->from_row( xco_cp_xlsx=>coordinate->for_numeric_value( 1 )
      )->get_pattern( ).

    lo_sheet_tpmov->select( lo_pattern_tpmov
      )->row_stream(
      )->operation->write_from( REF #( lt_tpmov_sheet )
      )->execute( ).

    DATA(lv_file_xstring) = lo_write_doc->get_file_content( ).
    rv_conteudo_base64 = xco_cp=>xstring( lv_file_xstring )->as_string( xco_cp_binary=>text_encoding->base64 )->value.
  ENDMETHOD.


  METHOD converter_data.
    CLEAR rv_data.
    DATA(lv_str) = condense( iv_texto ).
    IF lv_str IS INITIAL.
      RETURN.
    ENDIF.

    " Formato DD/MM/AAAA ou DD.MM.AAAA
    IF strlen( lv_str ) = 10 AND ( lv_str+2(1) = '/' OR lv_str+2(1) = '.' ).
      rv_data = |{ lv_str+6(4) }{ lv_str+3(2) }{ lv_str(2) }|.
    " Formato AAAA-MM-DD (ISO)
    ELSEIF strlen( lv_str ) >= 10 AND lv_str+4(1) = '-'.
      rv_data = |{ lv_str(4) }{ lv_str+5(2) }{ lv_str+8(2) }|.
    " Formato AAAAMMDD direto
    ELSEIF strlen( lv_str ) = 8 AND lv_str CO '0123456789'.
      rv_data = lv_str.
    " Número serial de data do Excel (ex: 46067)
    ELSEIF lv_str CO '0123456789'.
      DATA(lv_dias) = CONV i( lv_str ).
      IF lv_dias > 30000 AND lv_dias < 80000.
        rv_data = CONV d( '18991230' ) + lv_dias.
      ENDIF.
    ENDIF.
  ENDMETHOD.


  METHOD converter_valor.
    CLEAR rv_valor.
    DATA(lv_str) = condense( iv_texto ).
    IF lv_str IS INITIAL.
      RETURN.
    ENDIF.

    " Trata formatação brasileira (1.234,56 -> 1234.56) ou padrão internacional
    IF lv_str CS ',' AND lv_str CS '.'.
      REPLACE ALL OCCURRENCES OF '.' IN lv_str WITH ''.
      REPLACE ALL OCCURRENCES OF ',' IN lv_str WITH '.'.
    ELSEIF lv_str CS ','.
      REPLACE ALL OCCURRENCES OF ',' IN lv_str WITH '.'.
    ENDIF.

    TRY.
        rv_valor = CONV #( lv_str ).
      CATCH cx_root.
        CLEAR rv_valor.
    ENDTRY.
  ENDMETHOD.

ENDCLASS.
```

---

### 🚀 Código Limpo (Sem Comentários - Para Copiar e Colar)

```abap
CLASS zclfi_tax_excel DEFINITION
  PUBLIC
  FINAL
  CREATE PUBLIC.

  PUBLIC SECTION.
    TYPES: BEGIN OF ty_linha_excel_raw,
             docseq TYPE string,
             ztpmov TYPE string,
             bukrs  TYPE string,
             bldat  TYPE string,
             budat  TYPE string,
             xblnr  TYPE string,
             bktxt  TYPE string,
             waers  TYPE string,
             lifnr  TYPE string,
             wrsol  TYPE string,
             wrhab  TYPE string,
             zfbdt  TYPE string,
             zterm  TYPE string,
             sgtxt  TYPE string,
             zuonr  TYPE string,
           END OF ty_linha_excel_raw.

    TYPES: BEGIN OF ty_linha_carga,
             linha_planilha TYPE i,
             docseq         TYPE ztfi_tax_doc-docseq,
             ztpmov         TYPE ztfi_tax_doc-ztpmov,
             bukrs          TYPE bukrs,
             bldat          TYPE bldat,
             budat          TYPE budat,
             xblnr          TYPE xblnr1,
             bktxt          TYPE bktxt,
             waers          TYPE waers,
             lifnr          TYPE lifnr,
             wrsol          TYPE ztfi_tax_item-wrsol,
             wrhab          TYPE ztfi_tax_item-wrhab,
             zfbdt          TYPE dzfbdt,
             zterm          TYPE dzterm,
             sgtxt          TYPE sgtxt,
             zuonr          TYPE dzuonr,
           END OF ty_linha_carga.

    TYPES tt_linhas_carga TYPE STANDARD TABLE OF ty_linha_carga WITH EMPTY KEY.

    CLASS-METHODS ler_planilha_base64
      IMPORTING
        iv_conteudo_base64 TYPE string
      EXPORTING
        et_linhas          TYPE tt_linhas_carga
        ev_erro            TYPE abap_boolean
        ev_mensagem        TYPE string.

    CLASS-METHODS gerar_modelo_base64
      RETURNING
        VALUE(rv_conteudo_base64) TYPE string.

  PRIVATE SECTION.
    CLASS-METHODS converter_data
      IMPORTING
        iv_texto       TYPE string
      RETURNING
        VALUE(rv_data) TYPE d.

    CLASS-METHODS converter_valor
      IMPORTING
        iv_texto        TYPE string
      RETURNING
        VALUE(rv_valor) TYPE ztfi_tax_item-wrsol.
ENDCLASS.



CLASS zclfi_tax_excel IMPLEMENTATION.

  METHOD ler_planilha_base64.
    CLEAR: et_linhas, ev_erro, ev_mensagem.

    IF iv_conteudo_base64 IS INITIAL.
      ev_erro = abap_true.
      MESSAGE e002(zfi_taxas) INTO ev_mensagem.
      RETURN.
    ENDIF.

    DATA(lv_base64_limpo) = iv_conteudo_base64.
    FIND FIRST OCCURRENCE OF ',' IN lv_base64_limpo MATCH OFFSET DATA(lv_off).
    IF sy-subrc = 0.
      lv_off += 1.
      lv_base64_limpo = lv_base64_limpo+lv_off.
    ENDIF.

    DATA(lv_xlsx_xstring) = xco_cp=>string( lv_base64_limpo )->as_xstring( xco_cp_binary=>text_encoding->base64 )->value.
    IF lv_xlsx_xstring IS INITIAL.
      ev_erro = abap_true.
      MESSAGE e002(zfi_taxas) INTO ev_mensagem.
      RETURN.
    ENDIF.

    TRY.
        DATA(lo_doc) = xco_cp_xlsx=>document->for_file_content( lv_xlsx_xstring )->read_access( ).
        DATA(lo_sheets) = lo_doc->get_workbook( )->worksheet.

        DATA lo_sheet TYPE REF TO if_xco_xlsx_ra_worksheet.
        IF lo_sheets->for_name( 'Carga' )->exists( ) = abap_true.
          lo_sheet = lo_sheets->for_name( 'Carga' ).
        ELSE.
          lo_sheet = lo_sheets->at_position( 1 ).
        ENDIF.

        DATA(lo_pattern) = xco_cp_xlsx_selection=>pattern_builder->simple_from_to(
          )->from_column( xco_cp_xlsx=>coordinate->for_alphabetic_value( 'A' )
          )->to_column( xco_cp_xlsx=>coordinate->for_alphabetic_value( 'O' )
          )->from_row( xco_cp_xlsx=>coordinate->for_numeric_value( 6 )
          )->get_pattern( ).

        DATA lt_raw TYPE STANDARD TABLE OF ty_linha_excel_raw WITH EMPTY KEY.

        lo_sheet->select( lo_pattern
          )->row_stream(
          )->operation->write_to( REF #( lt_raw )
          )->set_value_transformation( xco_cp_xlsx_read_access=>value_transformation->string_value
          )->execute( ).

        DATA lv_num_linha TYPE i VALUE 5.

        LOOP AT lt_raw INTO DATA(ls_raw).
          lv_num_linha += 1.

          IF ls_raw-docseq IS INITIAL AND ls_raw-lifnr IS INITIAL AND
             ls_raw-wrsol  IS INITIAL AND ls_raw-wrhab IS INITIAL.
            CONTINUE.
          ENDIF.

          DATA ls_linha TYPE ty_linha_carga.
          CLEAR ls_linha.
          ls_linha-linha_planilha = lv_num_linha.
          ls_linha-docseq         = |{ condense( ls_raw-docseq ) ALPHA = IN }|.
          ls_linha-ztpmov         = to_upper( condense( ls_raw-ztpmov ) ).
          ls_linha-bukrs          = to_upper( condense( ls_raw-bukrs ) ).
          ls_linha-bldat          = converter_data( ls_raw-bldat ).
          ls_linha-budat          = converter_data( ls_raw-budat ).
          ls_linha-xblnr          = condense( ls_raw-xblnr ).
          ls_linha-bktxt          = condense( ls_raw-bktxt ).
          ls_linha-waers          = to_upper( condense( ls_raw-waers ) ).
          ls_linha-lifnr          = condense( ls_raw-lifnr ).
          ls_linha-wrsol          = converter_valor( ls_raw-wrsol ).
          ls_linha-wrhab          = converter_valor( ls_raw-wrhab ).
          ls_linha-zfbdt          = converter_data( ls_raw-zfbdt ).
          ls_linha-zterm          = to_upper( condense( ls_raw-zterm ) ).
          ls_linha-sgtxt          = condense( ls_raw-sgtxt ).
          ls_linha-zuonr          = condense( ls_raw-zuonr ).

          APPEND ls_linha TO et_linhas.
        ENDLOOP.

        IF et_linhas IS INITIAL.
          ev_erro = abap_true.
          MESSAGE e003(zfi_taxas) INTO ev_mensagem.
        ENDIF.

      CATCH cx_root INTO DATA(lx_err).
        ev_erro = abap_true.
        ev_mensagem = lx_err->get_text( ).
    ENDTRY.
  ENDMETHOD.


  METHOD gerar_modelo_base64.
    TYPES: BEGIN OF ty_tpmov_sheet,
             ztpmov              TYPE string,
             descricao           TYPE string,
             umskz_deb           TYPE string,
             umskz_cred          TYPE string,
             hkont_contrapartida TYPE string,
             blart               TYPE string,
             zlspr               TYPE string,
             zfbdt_obrig         TYPE string,
             zuonr_obrig         TYPE string,
           END OF ty_tpmov_sheet.

    DATA lt_carga_template TYPE STANDARD TABLE OF ty_linha_excel_raw WITH EMPTY KEY.
    DATA lt_tpmov_sheet    TYPE STANDARD TABLE OF ty_tpmov_sheet WITH EMPTY KEY.

    APPEND VALUE #( docseq = 'DEL-COM-165 - Carga Massiva de Lançamentos de Taxas com Razão Especial' ) TO lt_carga_template.
    APPEND VALUE #( docseq = 'Preencha os dados a partir da linha 6. Colunas A..H apenas na 1ª linha de cada DOCSEQ.' ) TO lt_carga_template.
    APPEND VALUE #( docseq = 'CABEÇALHO DO DOCUMENTO (1ª LINHA DO DOCSEQ)'
                    lifnr  = 'ITENS DO DOCUMENTO (TODAS AS LINHAS)' ) TO lt_carga_template.

    APPEND VALUE #(
      docseq = 'DOCSEQ' ztpmov = 'ZTPMOV' bukrs = 'BUKRS' bldat = 'BLDAT'
      budat  = 'BUDAT'  xblnr  = 'XBLNR'  bktxt = 'BKTXT' waers = 'WAERS'
      lifnr  = 'LIFNR'  wrsol  = 'WRSOL'  wrhab = 'WRHAB' zfbdt = 'ZFBDT'
      zterm  = 'ZTERM'  sgtxt  = 'SGTXT'  zuonr = 'ZUONR'
    ) TO lt_carga_template.

    APPEND VALUE #(
      docseq = 'Nº Doc. na Carga *'
      ztpmov = 'Tipo de Movimento *'
      bukrs  = 'Empresa *'
      bldat  = 'Data do Documento *'
      budat  = 'Data de Lançamento *'
      xblnr  = 'Referência *'
      bktxt  = 'Texto Cabeçalho'
      waers  = 'Moeda *'
      lifnr  = 'Fornecedor / Cooperado *'
      wrsol  = 'Valor Débito (R$) **'
      wrhab  = 'Valor Crédito (R$) **'
      zfbdt  = 'Data Base *'
      zterm  = 'Cond. Pagamento'
      sgtxt  = 'Texto do Item *'
      zuonr  = 'Atribuição (Nº Contrato)'
    ) TO lt_carga_template.

    DATA(lo_write_doc) = xco_cp_xlsx=>document->empty( )->write_access( ).
    DATA(lo_sheet_carga) = lo_write_doc->get_workbook( )->worksheet->at_position( 1 ).

    DATA(lo_pattern_carga) = xco_cp_xlsx_selection=>pattern_builder->simple_from_to(
      )->from_column( xco_cp_xlsx=>coordinate->for_alphabetic_value( 'A' )
      )->to_column( xco_cp_xlsx=>coordinate->for_alphabetic_value( 'O' )
      )->from_row( xco_cp_xlsx=>coordinate->for_numeric_value( 1 )
      )->get_pattern( ).

    lo_sheet_carga->select( lo_pattern_carga
      )->row_stream(
      )->operation->write_from( REF #( lt_carga_template )
      )->execute( ).

    APPEND VALUE #(
      ztpmov              = 'ZTPMOV'
      descricao           = 'Descrição'
      umskz_deb           = 'Razão Esp. Débito'
      umskz_cred          = 'Razão Esp. Crédito'
      hkont_contrapartida = 'Conta Contrapartida'
      blart               = 'Tipo Doc.'
      zlspr               = 'Bloq. Pgto.'
      zfbdt_obrig         = 'ZFBDT Obrig.'
      zuonr_obrig         = 'ZUONR Obrig.'
    ) TO lt_tpmov_sheet.

    SELECT *
      FROM ztfi_tax_tpmov
      WHERE ativo = @abap_true
      ORDER BY ztpmov
      INTO TABLE @DATA(lt_db_tpmov).

    LOOP AT lt_db_tpmov INTO DATA(ls_db).
      APPEND VALUE #(
        ztpmov              = ls_db-ztpmov
        descricao           = ls_db-descricao
        umskz_deb           = ls_db-umskz_deb
        umskz_cred          = ls_db-umskz_cred
        hkont_contrapartida = ls_db-hkont_contrapartida
        blart               = ls_db-blart
        zlspr               = ls_db-zlspr
        zfbdt_obrig         = ls_db-zfbdt_obrig
        zuonr_obrig         = ls_db-zuonr_obrig
      ) TO lt_tpmov_sheet.
    ENDLOOP.

    DATA(lo_sheet_tpmov) = lo_write_doc->get_workbook( )->worksheet->add( 'Tipos de Movimento' ).
    DATA(lo_pattern_tpmov) = xco_cp_xlsx_selection=>pattern_builder->simple_from_to(
      )->from_column( xco_cp_xlsx=>coordinate->for_alphabetic_value( 'A' )
      )->to_column( xco_cp_xlsx=>coordinate->for_alphabetic_value( 'I' )
      )->from_row( xco_cp_xlsx=>coordinate->for_numeric_value( 1 )
      )->get_pattern( ).

    lo_sheet_tpmov->select( lo_pattern_tpmov
      )->row_stream(
      )->operation->write_from( REF #( lt_tpmov_sheet )
      )->execute( ).

    DATA(lv_file_xstring) = lo_write_doc->get_file_content( ).
    rv_conteudo_base64 = xco_cp=>xstring( lv_file_xstring )->as_string( xco_cp_binary=>text_encoding->base64 )->value.
  ENDMETHOD.


  METHOD converter_data.
    CLEAR rv_data.
    DATA(lv_str) = condense( iv_texto ).
    IF lv_str IS INITIAL.
      RETURN.
    ENDIF.

    IF strlen( lv_str ) = 10 AND ( lv_str+2(1) = '/' OR lv_str+2(1) = '.' ).
      rv_data = |{ lv_str+6(4) }{ lv_str+3(2) }{ lv_str(2) }|.
    ELSEIF strlen( lv_str ) >= 10 AND lv_str+4(1) = '-'.
      rv_data = |{ lv_str(4) }{ lv_str+5(2) }{ lv_str+8(2) }|.
    ELSEIF strlen( lv_str ) = 8 AND lv_str CO '0123456789'.
      rv_data = lv_str.
    ELSEIF lv_str CO '0123456789'.
      DATA(lv_dias) = CONV i( lv_str ).
      IF lv_dias > 30000 AND lv_dias < 80000.
        rv_data = CONV d( '18991230' ) + lv_dias.
      ENDIF.
    ENDIF.
  ENDMETHOD.


  METHOD converter_valor.
    CLEAR rv_valor.
    DATA(lv_str) = condense( iv_texto ).
    IF lv_str IS INITIAL.
      RETURN.
    ENDIF.

    IF lv_str CS ',' AND lv_str CS '.'.
      REPLACE ALL OCCURRENCES OF '.' IN lv_str WITH ''.
      REPLACE ALL OCCURRENCES OF ',' IN lv_str WITH '.'.
    ELSEIF lv_str CS ','.
      REPLACE ALL OCCURRENCES OF ',' IN lv_str WITH '.'.
    ENDIF.

    TRY.
        rv_valor = CONV #( lv_str ).
      CATCH cx_root.
        CLEAR rv_valor.
    ENDTRY.
  ENDMETHOD.

ENDCLASS.
```
