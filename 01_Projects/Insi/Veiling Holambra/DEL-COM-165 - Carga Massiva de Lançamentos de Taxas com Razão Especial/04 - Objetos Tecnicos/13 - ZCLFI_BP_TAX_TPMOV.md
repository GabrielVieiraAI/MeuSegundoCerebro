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
objeto: "ZCLFI_BP_TAX_TPMOV"
camada: "3 - Comportamento RAP"
data: 2026-11-11
aliases:
  - "ZCLFI_BP_TAX_TPMOV"
---

# 📦 `ZCLFI_BP_TAX_TPMOV` (Behavior Pool — Manutenção de Tipos de Movimento)

⬅️ [[02 - DEL-COM-165 - Arquitetura App 2 (Tipos de Movimento)|Voltar para Arquitetura App 2]] | 🎨 [[02 - DEL-COM-165 - Arquitetura Técnica App 2 (Tipos de Movimento).excalidraw|Ver no Diagrama Excalidraw App 2]]

---

## 📌 Visão Geral do Objeto

A classe `ZCLFI_BP_TAX_TPMOV` é o **Behavior Pool** que implementa as regras de negócio declaradas no Behavior Definition [[12 - ZI_FI_TAX_TPMOV (BDEF)|ZI_FI_TAX_TPMOV]] para o **Aplicativo 2** (Manutenção de Tipos de Movimento).

---

## ⚖️ Regras de Negócio Aplicadas

1. **Verificação de Autorização (`get_global_authorizations`):** Checa o objeto [[07 - ZTAXCARGA|ZTAXCARGA]] com `ACTVT = '02'` (Modificar) para liberar a criação, alteração ou exclusão de Tipos de Movimento.
2. **Preenchimento de Valores Padrão (`preencherDefaults`):** Ao clicar em **Criar** no App 2, já sugere `blart = 'Z1'`, `zlspr = 'T'`, `ativo = 'X'`, `valido_de = data atual` e `valido_ate = '31.12.9999'`, reduzindo digitação manual.
3. **Validação de Consistência (`validarRegistro`):**
   - Impede salvar sem descrição (`ZFI_TAXAS 022`).
   - Impede `valido_de > valido_ate` (`ZFI_TAXAS 023`).
   - Exige que pelo menos um código de Razão Especial (`umskz_deb` ou `umskz_cred`) ou a conta de contrapartida (`hkont_contrapartida`) esteja preenchido (`ZFI_TAXAS 024`).

---

## 🛠️ Passo a Passo da Criação do Objeto

1. **No Eclipse ADT:** Abra o Behavior Definition [[12 - ZI_FI_TAX_TPMOV (BDEF)|ZI_FI_TAX_TPMOV]], posicione o cursor sobre `zclfi_bp_tax_tpmov` e pressione **`Ctrl + 1`** (*Quick Fix*) -> **`Create behavior implementation class zclfi_bp_tax_tpmov`**.
2. Selecione a Request (TR) de desenvolvimento e conclua o assistente.
3. Na aba **`Local Types`**, substitua o código gerado pelo snippet correspondente abaixo e ative com **`Ctrl + F3`**.

---

## 💻 Snippet de Código

### 📝 Código Comentado (Para Estudo e Referência)

```abap
" =========================================================================
" ABA: Global Class (Declaração principal da classe ZCLFI_BP_TAX_TPMOV)
" =========================================================================
CLASS zclfi_bp_tax_tpmov DEFINITION PUBLIC ABSTRACT FINAL FOR BEHAVIOR OF zi_fi_tax_tpmov.
ENDCLASS.

CLASS zclfi_bp_tax_tpmov IMPLEMENTATION.
ENDCLASS.
```

```abap
" =========================================================================
" ABA: Local Types (Implementação do Handler lhc_TipoMovimento)
" =========================================================================
CLASS lhc_TipoMovimento DEFINITION INHERITING FROM cl_abap_behavior_handler.
  PRIVATE SECTION.

    METHODS get_global_authorizations FOR GLOBAL AUTHORIZATION
      IMPORTING REQUEST requested_authorizations FOR TipoMovimento RESULT result.

    METHODS preencherDefaults FOR DETERMINE ON MODIFY
      IMPORTING keys FOR TipoMovimento~preencherDefaults.

    METHODS validarRegistro FOR VALIDATE ON SAVE
      IMPORTING keys FOR TipoMovimento~validarRegistro.

ENDCLASS.

CLASS lhc_TipoMovimento IMPLEMENTATION.

  METHOD get_global_authorizations.
    " Verifica se o usuário possui permissão de manutenção (ACTVT = '02') no objeto ZTAXCARGA
    IF requested_authorizations-%create = if_abap_behv=>mk-on OR
       requested_authorizations-%update = if_abap_behv=>mk-on OR
       requested_authorizations-%delete = if_abap_behv=>mk-on.

      AUTHORITY-CHECK OBJECT 'ZTAXCARGA'
        ID 'ACTVT' FIELD '02'.

      DATA(lv_auth) = COND #( WHEN sy-subrc = 0
                              THEN if_abap_behv=>auth-allowed
                              ELSE if_abap_behv=>auth-unauthorized ).

      result-%create = lv_auth.
      result-%update = lv_auth.
      result-%delete = lv_auth.
    ENDIF.
  ENDMETHOD.


  METHOD preencherDefaults.
    " Lê as instâncias recém-criadas via EML (Entity Manipulation Language)
    READ ENTITIES OF zi_fi_tax_tpmov IN LOCAL MODE
      ENTITY TipoMovimento
      FIELDS ( blart zlspr ativo valido_de valido_ate )
      WITH CORRESPONDING #( keys )
      RESULT DATA(lt_registros).

    LOOP AT lt_registros ASSIGNING FIELD-SYMBOL(<fs_reg>).
      MODIFY ENTITIES OF zi_fi_tax_tpmov IN LOCAL MODE
        ENTITY TipoMovimento
        UPDATE FIELDS ( blart zlspr ativo valido_de valido_ate )
        WITH VALUE #( (
          %tky       = <fs_reg>-%tky
          blart      = COND #( WHEN <fs_reg>-blart IS INITIAL THEN 'Z1' ELSE <fs_reg>-blart )
          zlspr      = COND #( WHEN <fs_reg>-zlspr IS INITIAL THEN 'T'  ELSE <fs_reg>-zlspr )
          ativo      = abap_true
          valido_de  = COND #( WHEN <fs_reg>-valido_de IS INITIAL
                               THEN cl_abap_context_info=>get_system_date( )
                               ELSE <fs_reg>-valido_de )
          valido_ate = COND #( WHEN <fs_reg>-valido_ate IS INITIAL
                               THEN '99991231'
                               ELSE <fs_reg>-valido_ate )
        ) ).
    ENDLOOP.
  ENDMETHOD.


  METHOD validarRegistro.
    READ ENTITIES OF zi_fi_tax_tpmov IN LOCAL MODE
      ENTITY TipoMovimento
      ALL FIELDS WITH CORRESPONDING #( keys )
      RESULT DATA(lt_registros).

    LOOP AT lt_registros INTO DATA(ls_reg).
      APPEND VALUE #( %tky        = ls_reg-%tky
                      %state_area = 'VALIDAR_TPMOV' ) TO reported-tipomovimento.

      " 1. Valida código e descrição obrigatórios
      IF ls_reg-ztpmov IS INITIAL OR ls_reg-descricao IS INITIAL.
        APPEND VALUE #( %tky = ls_reg-%tky ) TO failed-tipomovimento.
        APPEND VALUE #(
          %tky                 = ls_reg-%tky
          %state_area          = 'VALIDAR_TPMOV'
          %element-descricao   = if_abap_behv=>mk-on
          %msg                 = new_message( id       = 'ZFI_TAXAS'
                                              number   = '022'
                                              severity = if_abap_behv_message=>severity-error )
        ) TO reported-tipomovimento.
      ENDIF.

      " 2. Valida intervalo de datas de vigência
      IF ls_reg-valido_de IS NOT INITIAL AND
         ls_reg-valido_ate IS NOT INITIAL AND
         ls_reg-valido_de > ls_reg-valido_ate.
        APPEND VALUE #( %tky = ls_reg-%tky ) TO failed-tipomovimento.
        APPEND VALUE #(
          %tky                 = ls_reg-%tky
          %state_area          = 'VALIDAR_TPMOV'
          %element-valido_de   = if_abap_behv=>mk-on
          %element-valido_ate  = if_abap_behv=>mk-on
          %msg                 = new_message( id       = 'ZFI_TAXAS'
                                              number   = '023'
                                              severity = if_abap_behv_message=>severity-error
                                              v1       = ls_reg-valido_de
                                              v2       = ls_reg-valido_ate )
        ) TO reported-tipomovimento.
      ENDIF.

      " 3. Exige ao menos um código de Razão Especial ou Conta de Contrapartida
      IF ls_reg-umskz_deb IS INITIAL AND
         ls_reg-umskz_cred IS INITIAL AND
         ls_reg-hkont_contrapartida IS INITIAL.
        APPEND VALUE #( %tky = ls_reg-%tky ) TO failed-tipomovimento.
        APPEND VALUE #(
          %tky                 = ls_reg-%tky
          %state_area          = 'VALIDAR_TPMOV'
          %element-umskz_cred  = if_abap_behv=>mk-on
          %msg                 = new_message( id       = 'ZFI_TAXAS'
                                              number   = '024'
                                              severity = if_abap_behv_message=>severity-error )
        ) TO reported-tipomovimento.
      ENDIF.
    ENDLOOP.
  ENDMETHOD.

ENDCLASS.
```

---

### 🚀 Código Limpo (Sem Comentários - Para Copiar e Colar)

```abap
CLASS lhc_TipoMovimento DEFINITION INHERITING FROM cl_abap_behavior_handler.
  PRIVATE SECTION.

    METHODS get_global_authorizations FOR GLOBAL AUTHORIZATION
      IMPORTING REQUEST requested_authorizations FOR TipoMovimento RESULT result.

    METHODS preencherDefaults FOR DETERMINE ON MODIFY
      IMPORTING keys FOR TipoMovimento~preencherDefaults.

    METHODS validarRegistro FOR VALIDATE ON SAVE
      IMPORTING keys FOR TipoMovimento~validarRegistro.

ENDCLASS.

CLASS lhc_TipoMovimento IMPLEMENTATION.

  METHOD get_global_authorizations.
    IF requested_authorizations-%create = if_abap_behv=>mk-on OR
       requested_authorizations-%update = if_abap_behv=>mk-on OR
       requested_authorizations-%delete = if_abap_behv=>mk-on.

      AUTHORITY-CHECK OBJECT 'ZTAXCARGA'
        ID 'ACTVT' FIELD '02'.

      DATA(lv_auth) = COND #( WHEN sy-subrc = 0
                              THEN if_abap_behv=>auth-allowed
                              ELSE if_abap_behv=>auth-unauthorized ).

      result-%create = lv_auth.
      result-%update = lv_auth.
      result-%delete = lv_auth.
    ENDIF.
  ENDMETHOD.


  METHOD preencherDefaults.
    READ ENTITIES OF zi_fi_tax_tpmov IN LOCAL MODE
      ENTITY TipoMovimento
      FIELDS ( blart zlspr ativo valido_de valido_ate )
      WITH CORRESPONDING #( keys )
      RESULT DATA(lt_registros).

    LOOP AT lt_registros ASSIGNING FIELD-SYMBOL(<fs_reg>).
      MODIFY ENTITIES OF zi_fi_tax_tpmov IN LOCAL MODE
        ENTITY TipoMovimento
        UPDATE FIELDS ( blart zlspr ativo valido_de valido_ate )
        WITH VALUE #( (
          %tky       = <fs_reg>-%tky
          blart      = COND #( WHEN <fs_reg>-blart IS INITIAL THEN 'Z1' ELSE <fs_reg>-blart )
          zlspr      = COND #( WHEN <fs_reg>-zlspr IS INITIAL THEN 'T'  ELSE <fs_reg>-zlspr )
          ativo      = abap_true
          valido_de  = COND #( WHEN <fs_reg>-valido_de IS INITIAL
                               THEN cl_abap_context_info=>get_system_date( )
                               ELSE <fs_reg>-valido_de )
          valido_ate = COND #( WHEN <fs_reg>-valido_ate IS INITIAL
                               THEN '99991231'
                               ELSE <fs_reg>-valido_ate )
        ) ).
    ENDLOOP.
  ENDMETHOD.


  METHOD validarRegistro.
    READ ENTITIES OF zi_fi_tax_tpmov IN LOCAL MODE
      ENTITY TipoMovimento
      ALL FIELDS WITH CORRESPONDING #( keys )
      RESULT DATA(lt_registros).

    LOOP AT lt_registros INTO DATA(ls_reg).
      APPEND VALUE #( %tky        = ls_reg-%tky
                      %state_area = 'VALIDAR_TPMOV' ) TO reported-tipomovimento.

      IF ls_reg-ztpmov IS INITIAL OR ls_reg-descricao IS INITIAL.
        APPEND VALUE #( %tky = ls_reg-%tky ) TO failed-tipomovimento.
        APPEND VALUE #(
          %tky                 = ls_reg-%tky
          %state_area          = 'VALIDAR_TPMOV'
          %element-descricao   = if_abap_behv=>mk-on
          %msg                 = new_message( id       = 'ZFI_TAXAS'
                                              number   = '022'
                                              severity = if_abap_behv_message=>severity-error )
        ) TO reported-tipomovimento.
      ENDIF.

      IF ls_reg-valido_de IS NOT INITIAL AND
         ls_reg-valido_ate IS NOT INITIAL AND
         ls_reg-valido_de > ls_reg-valido_ate.
        APPEND VALUE #( %tky = ls_reg-%tky ) TO failed-tipomovimento.
        APPEND VALUE #(
          %tky                 = ls_reg-%tky
          %state_area          = 'VALIDAR_TPMOV'
          %element-valido_de   = if_abap_behv=>mk-on
          %element-valido_ate  = if_abap_behv=>mk-on
          %msg                 = new_message( id       = 'ZFI_TAXAS'
                                              number   = '023'
                                              severity = if_abap_behv_message=>severity-error
                                              v1       = ls_reg-valido_de
                                              v2       = ls_reg-valido_ate )
        ) TO reported-tipomovimento.
      ENDIF.

      IF ls_reg-umskz_deb IS INITIAL AND
         ls_reg-umskz_cred IS INITIAL AND
         ls_reg-hkont_contrapartida IS INITIAL.
        APPEND VALUE #( %tky = ls_reg-%tky ) TO failed-tipomovimento.
        APPEND VALUE #(
          %tky                 = ls_reg-%tky
          %state_area          = 'VALIDAR_TPMOV'
          %element-umskz_cred  = if_abap_behv=>mk-on
          %msg                 = new_message( id       = 'ZFI_TAXAS'
                                              number   = '024'
                                              severity = if_abap_behv_message=>severity-error )
        ) TO reported-tipomovimento.
      ENDIF.
    ENDLOOP.
  ENDMETHOD.

ENDCLASS.
```
