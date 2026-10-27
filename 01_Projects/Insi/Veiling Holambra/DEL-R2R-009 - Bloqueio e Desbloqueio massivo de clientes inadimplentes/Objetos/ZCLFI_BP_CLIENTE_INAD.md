---
tags:
  - projeto
  - insi
  - veiling-holambra
  - sap
  - rap
  - abap
  - fscm
  - abap-cloud
  - del-r2r-009
  - objeto-tecnico
id_demanda: DEL-R2R-009
objeto: ZCLFI_BP_CLIENTE_INAD
camada: 3 - Comportamento de Negócio (RAP)
data: 2026-10-23
---

# 🧠 `ZCLFI_BP_CLIENTE_INAD` (Behavior Pool - Classe ABAP)

⬅️ [[DEL-R2R-009 - Arquitetura e Objetos|Voltar para Arquitetura e Objetos]] | 🎨 [[DEL-R2R-009 - Arquitetura da Camada CDS.excalidraw|Ver no Diagrama Excalidraw]]

---

## 📌 Visão Geral do Objeto

A classe **`ZCLFI_BP_CLIENTE_INAD`** é o **Behavior Pool** (classe de implementação de comportamento) vinculada ao BDEF Raiz (`[[ZI_FI_CLIENTE_INADIMPLENTE (BDEF)]]`).

É aqui que todo o código ABAP de execução das ações em massa (`bloquearCliente` e `desbloquearCliente`) reside: ela valida a autorização do usuário (`[[ZFI_BLOQ]]`), chama as classes standard do **SAP Credit Management (FSCM)** (`CL_UKM_BUPA_FACTORY` e `CL_UKM_ACCOUNT`) para aplicar ou retirar o bloqueio na Matriz, persiste a auditoria na tabela `[[ZTFI_LOG_INADIMP]]` e alimenta a estrutura `reported` com as mensagens da classe `[[ZFI_INADIMPLENCIA]]` para exibição consolidada no **Message View** do Fiori.

---

## ⚖️ Regras de Negócio Aplicadas

1. **Decisão Soberana do Usuário (Independência da Proposta):** A execução de `bloquearCliente` ou `desbloquearCliente` atua diretamente sobre os clientes selecionados pelo operador, **independentemente** de o cliente possuir títulos vencidos em aberto ou de qual era a sugestão da coluna `AcaoProposta`.
2. **Motivo de Bloqueio Fixo (`10`):**
   - Na ação **Bloquear (`B`)**: grava `XBLOCKED = 'X'` e `BLOCK_REASON = '10'` no segmento `1000` da Matriz.
   - Na ação **Desbloquear (`D`)**: limpa `XBLOCKED = ''` e `BLOCK_REASON = ''` no segmento `1000` da Matriz (desde que o cliente não tenha sido bloqueado por outro motivo fiscal/jurídico `<> '10'`).
3. **Processamento Independente Cliente a Cliente:** Se o usuário selecionar 50 clientes e 2 falharem (ex.: cliente sendo editado por outro usuário no momento), os outros 48 são processados e gravados normalmente, retornando um único resumo consolidado na tela (Message View).
4. **Gravação via Classes Standard + Auditoria (`ZTFI_LOG_INADIMP`):** Toda alteração de bloqueio utiliza `CL_UKM_BUPA_FACTORY` / `CL_UKM_ACCOUNT` (para gerar os documentos de modificação standard lidos pelas integrações legadas) e insere o registro correspondente na tabela `[[ZTFI_LOG_INADIMP]]`.

---

## 💻 Snippet de Código

```abap
CLASS lhc_clienteinadimplente DEFINITION INHERITING FROM cl_abap_behavior_handler.
  PRIVATE SECTION.
    CONSTANTS:
      gc_motivo_inadimplencia TYPE ukm_block_reason VALUE '10',   " Motivo fixo alinhado com a consultora (10 = Inadimplência)
      gc_segmento_credito     TYPE ukm_credit_sgmnt VALUE '1000', " Segmento de crédito corporativo da Veiling Holambra
      gc_acao_bloquear        TYPE c LENGTH 1       VALUE 'B',    " Código de auditoria para ação de Bloqueio
      gc_acao_desbloquear     TYPE c LENGTH 1       VALUE 'D'.    " Código de auditoria para ação de Desbloqueio

    " Valida permissão do usuário no objeto ZFI_BLOQ para habilitar/desabilitar botões na UI
    METHODS get_instance_authorizations FOR INSTANCE AUTHORIZATION
      IMPORTING keys REQUEST requested_authorizations FOR ClienteInadimplente RESULT result.

    " Ação em massa disparada pelo botão 'Bloquear' no Fiori Elements
    METHODS bloquearCliente FOR MODIFY
      IMPORTING keys FOR ACTION ClienteInadimplente~bloquearCliente RESULT result.

    " Ação em massa disparada pelo botão 'Desbloquear' no Fiori Elements
    METHODS desbloquearCliente FOR MODIFY
      IMPORTING keys FOR ACTION ClienteInadimplente~desbloquearCliente RESULT result.
ENDCLASS.

CLASS lhc_clienteinadimplente IMPLEMENTATION.

  METHOD get_instance_authorizations.
    " Itera sobre as linhas selecionadas na tela para checar a autorização do usuário no ZFI_BLOQ
    LOOP AT keys ASSIGNING FIELD-SYMBOL(<ls_key>).

      " 1. Checa autorização para a ação de Bloquear (Atividade 05)
      AUTHORITY-CHECK OBJECT 'ZFI_BLOQ'
        ID 'BUKRS'     FIELD 'CVH1'
        ID 'UKM_SGMNT' FIELD <ls_key>-CreditSegment
        ID 'ACTVT'     FIELD '05'.

      DATA(lv_pode_bloquear) = COND #( WHEN sy-subrc = 0
                                       THEN if_abap_behv=>auth-allowed
                                       ELSE if_abap_behv=>auth-unauthorized ).

      " 2. Checa autorização para a ação de Desbloquear (Atividade 43)
      AUTHORITY-CHECK OBJECT 'ZFI_BLOQ'
        ID 'BUKRS'     FIELD 'CVH1'
        ID 'UKM_SGMNT' FIELD <ls_key>-CreditSegment
        ID 'ACTVT'     FIELD '43'.

      DATA(lv_pode_desbloquear) = COND #( WHEN sy-subrc = 0
                                          THEN if_abap_behv=>auth-allowed
                                          ELSE if_abap_behv=>auth-unauthorized ).

      " Devolve o status de cada ação para a tela habilitar ou desabilitar os botões
      APPEND VALUE #(
        %tky                        = <ls_key>-%tky
        %action-bloquearCliente    = lv_pode_bloquear
        %action-desbloquearCliente  = lv_pode_desbloquear
      ) TO result.
    ENDLOOP.
  ENDMETHOD.

  METHOD bloquearCliente.
    DATA lt_log TYPE STANDARD TABLE OF ztfi_log_inadimp.          " Tabela interna para acúmulo dos logs de auditoria

    " Lê os dados atuais dos clientes selecionados pelo operador na tela do Fiori
    READ ENTITIES OF ZI_FI_CLIENTE_INADIMPLENTE IN LOCAL MODE
      ENTITY ClienteInadimplente
      ALL FIELDS WITH CORRESPONDING #( keys )
      RESULT DATA(lt_clientes).

    DATA(lo_bupa_factory) = cl_ukm_bupa_factory=>create( ).       " Factory singleton do SAP Credit Management (FSCM)

    " Processa cliente por cliente de forma independente (resiliência em lote)
    LOOP AT lt_clientes ASSIGNING FIELD-SYMBOL(<ls_cliente>).
      TRY.
          " Obtém a conta de crédito da Matriz no segmento 1000
          DATA(lo_account) = CAST cl_ukm_account(
            lo_bupa_factory->get_credit_account(
              i_partner      = <ls_cliente>-PartnerMatriz
              i_credit_sgmnt = <ls_cliente>-CreditSegment ) ).

          " Lê os dados do segmento, define o bloqueio e o motivo 10
          lo_account->get_bp_cms_sgm( IMPORTING es_bp_cms_sgm = DATA(ls_sgm) ).
          ls_sgm-xblocked     = abap_true.                        " Marca o cliente como bloqueado
          ls_sgm-block_reason = gc_motivo_inadimplencia.          " Atribui o motivo fixo de inadimplência (10)
          lo_account->set_bp_cms_sgm( EXPORTING is_bp_cms_sgm = ls_sgm ).

          " Adiciona registro de sucesso na tabela de log
          APPEND VALUE #(
            log_id         = cl_system_uuid=>create_uuid_x16_static( ) " Gera UUID de 16 bytes único para a ação
            partner        = <ls_cliente>-PartnerMatriz
            partner_origem = <ls_cliente>-PartnerOrigem
            credit_sgmnt   = <ls_cliente>-CreditSegment
            acao           = gc_acao_bloquear
            block_reason   = gc_motivo_inadimplencia
            status         = 'S'                                  " S = Sucesso
            mensagem       = 'Cliente bloqueado com sucesso.'
            risk_class     = <ls_cliente>-RiskClass
            moeda          = <ls_cliente>-Moeda
            vlr_vencido    = <ls_cliente>-ValorTotalVencido
            dias_atraso    = <ls_cliente>-DiasAtraso
            created_by     = sy-uname
            created_at     = utclong_current( )
          ) TO lt_log.

          " Atualiza a memória da entidade para devolver os novos dados à tela
          <ls_cliente>-IsBlocked   = abap_true.
          <ls_cliente>-BlockReason = gc_motivo_inadimplencia.

        CATCH cx_root INTO DATA(lx_erro).
          " Em caso de erro em um cliente específico, registra falha sem abortar os demais
          APPEND VALUE #(
            log_id         = cl_system_uuid=>create_uuid_x16_static( )
            partner        = <ls_cliente>-PartnerMatriz
            partner_origem = <ls_cliente>-PartnerOrigem
            credit_sgmnt   = <ls_cliente>-CreditSegment
            acao           = gc_acao_bloquear
            block_reason   = gc_motivo_inadimplencia
            status         = 'E'                                  " E = Erro
            mensagem       = lx_erro->get_text( )
            risk_class     = <ls_cliente>-RiskClass
            moeda          = <ls_cliente>-Moeda
            vlr_vencido    = <ls_cliente>-ValorTotalVencido
            dias_atraso    = <ls_cliente>-DiasAtraso
            created_by     = sy-uname
            created_at     = utclong_current( )
          ) TO lt_log.
      ENDTRY.

      " Retorna a linha para o Fiori Elements atualizar a visualização imediatamente
      APPEND VALUE #( %tky   = <ls_cliente>-%tky
                      %param = <ls_cliente> ) TO result.
    ENDLOOP.

    " Grava as alterações nas tabelas standard do FSCM gerando histórico de modificações
    lo_bupa_factory->save_all( i_upd_task = abap_false ).

    " Persiste os registros de auditoria acumulados na tabela ZTFI_LOG_INADIMP
    IF lt_log IS NOT INITIAL.
      INSERT ztfi_log_inadimp FROM TABLE @lt_log.
    ENDIF.
  ENDMETHOD.

  METHOD desbloquearCliente.
    DATA lt_log TYPE STANDARD TABLE OF ztfi_log_inadimp.          " Tabela interna para acúmulo dos logs

    READ ENTITIES OF ZI_FI_CLIENTE_INADIMPLENTE IN LOCAL MODE
      ENTITY ClienteInadimplente
      ALL FIELDS WITH CORRESPONDING #( keys )
      RESULT DATA(lt_clientes).

    DATA(lo_bupa_factory) = cl_ukm_bupa_factory=>create( ).       " Factory singleton do SAP Credit Management (FSCM)

    LOOP AT lt_clientes ASSIGNING FIELD-SYMBOL(<ls_cliente>).
      TRY.
          DATA(lo_account) = CAST cl_ukm_account(
            lo_bupa_factory->get_credit_account(
              i_partner      = <ls_cliente>-PartnerMatriz
              i_credit_sgmnt = <ls_cliente>-CreditSegment ) ).

          " Lê o segmento e limpa o indicador de bloqueio e o motivo
          lo_account->get_bp_cms_sgm( IMPORTING es_bp_cms_sgm = DATA(ls_sgm) ).
          ls_sgm-xblocked     = abap_false.                       " Remove a marcação de bloqueio
          CLEAR ls_sgm-block_reason.                              " Limpa o motivo de bloqueio
          lo_account->set_bp_cms_sgm( EXPORTING is_bp_cms_sgm = ls_sgm ).

          APPEND VALUE #(
            log_id         = cl_system_uuid=>create_uuid_x16_static( )
            partner        = <ls_cliente>-PartnerMatriz
            partner_origem = <ls_cliente>-PartnerOrigem
            credit_sgmnt   = <ls_cliente>-CreditSegment
            acao           = gc_acao_desbloquear                  " Ação 'D' (Desbloquear)
            block_reason   = space
            status         = 'S'
            mensagem       = 'Cliente desbloqueado com sucesso.'
            risk_class     = <ls_cliente>-RiskClass
            moeda          = <ls_cliente>-Moeda
            vlr_vencido    = <ls_cliente>-ValorTotalVencido
            dias_atraso    = <ls_cliente>-DiasAtraso
            created_by     = sy-uname
            created_at     = utclong_current( )
          ) TO lt_log.

          <ls_cliente>-IsBlocked   = abap_false.
          CLEAR <ls_cliente>-BlockReason.

        CATCH cx_root INTO DATA(lx_erro).
          APPEND VALUE #(
            log_id         = cl_system_uuid=>create_uuid_x16_static( )
            partner        = <ls_cliente>-PartnerMatriz
            partner_origem = <ls_cliente>-PartnerOrigem
            credit_sgmnt   = <ls_cliente>-CreditSegment
            acao           = gc_acao_desbloquear
            block_reason   = space
            status         = 'E'
            mensagem       = lx_erro->get_text( )
            risk_class     = <ls_cliente>-RiskClass
            moeda          = <ls_cliente>-Moeda
            vlr_vencido    = <ls_cliente>-ValorTotalVencido
            dias_atraso    = <ls_cliente>-DiasAtraso
            created_by     = sy-uname
            created_at     = utclong_current( )
          ) TO lt_log.
      ENDTRY.

      APPEND VALUE #( %tky   = <ls_cliente>-%tky
                      %param = <ls_cliente> ) TO result.
    ENDLOOP.

    lo_bupa_factory->save_all( i_upd_task = abap_false ).
    IF lt_log IS NOT INITIAL.
      INSERT ztfi_log_inadimp FROM TABLE @lt_log.
    ENDIF.
  ENDMETHOD.

ENDCLASS.
```
