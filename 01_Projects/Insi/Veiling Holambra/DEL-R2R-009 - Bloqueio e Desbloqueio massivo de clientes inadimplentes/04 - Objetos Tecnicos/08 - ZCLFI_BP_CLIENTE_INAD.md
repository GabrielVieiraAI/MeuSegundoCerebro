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

aliases:
  - "ZCLFI_BP_CLIENTE_INAD"
---

# 🧠 `ZCLFI_BP_CLIENTE_INAD` (Behavior Pool - Classe ABAP)

⬅️ [[DEL-R2R-009 - Arquitetura e Objetos|Voltar para Arquitetura e Objetos]] | 🎨 [[01 - DEL-R2R-009 - Arquitetura da Camada CDS.excalidraw|Ver no Diagrama Excalidraw]] | 💡 [[Mensageria e Feedback Visual em Ações do RAP (OData V2)|Padrão de Mensageria e Feedback]]

---

## 📌 Visão Geral do Objeto

A classe **`ZCLFI_BP_CLIENTE_INAD`** é o **Behavior Pool** (classe de implementação de comportamento) vinculada ao BDEF Raiz (`[[07 - ZI_FI_CLIENTE_INADIMPLENTE (BDEF)|ZI_FI_CLIENTE_INADIMPLENTE (BDEF)]]`).

É aqui que todo o código ABAP de execução das ações em massa (`bloquearCliente` e `desbloquearCliente`) reside: ela valida a autorização do usuário (`[[02 - ZFI_BLOQ|ZFI_BLOQ]]`), chama as classes standard do **SAP Credit Management (FSCM)** (`CL_UKM_BUPA_FACTORY` e `CL_UKM_ACCOUNT`) para aplicar ou retirar o bloqueio na Matriz, persiste a auditoria na tabela `[[01 - ZTFI_LOG_INADIMP|ZTFI_LOG_INADIMP]]` e alimenta a estrutura `reported` com as mensagens da classe `[[03 - ZFI_INADIMPLENCIA|ZFI_INADIMPLENCIA]]` para exibição consolidada no **Message View** do Fiori.

---

## ⚖️ Regras de Negócio Aplicadas

1. **Decisão Soberana do Usuário (Independência da Proposta):** A execução de `bloquearCliente` ou `desbloquearCliente` atua diretamente sobre os clientes selecionados pelo operador, **independentemente** de o cliente possuir títulos vencidos em aberto ou de qual era a sugestão da coluna `AcaoProposta`.
2. **Motivo de Bloqueio Fixo (`10`):**
   - Na ação **Bloquear (`B`)**: grava `XBLOCKED = 'X'` e `BLOCK_REASON = '10'` no segmento `1000` da Matriz.
   - Na ação **Desbloquear (`D`)**: limpa `XBLOCKED = ''` e `BLOCK_REASON = ''` no segmento `1000` da Matriz (desde que o cliente não tenha sido bloqueado por outro motivo fiscal/jurídico `<> '10'`).
3. **Processamento Independente Cliente a Cliente:** Se o usuário selecionar 50 clientes e 2 falharem (ex.: cliente sendo editado por outro usuário no momento), os outros 48 são processados e gravados normalmente, retornando um único resumo consolidado na tela (Message View).
4. **Gravação via Classes Standard + Auditoria (`ZTFI_LOG_INADIMP`):** Toda alteração de bloqueio utiliza `CL_UKM_BUPA_FACTORY` / `CL_UKM_ACCOUNT` (para gerar os documentos de modificação standard lidos pelas integrações legadas) e insere o registro correspondente na tabela `[[01 - ZTFI_LOG_INADIMP|ZTFI_LOG_INADIMP]]`.
5. **Validação Defensiva de Parâmetros Corporativos Clean Core (`zclca_tabela_parametros`):** Antes de bloquear, o método `bloquearCliente` consulta a Tabela de Parâmetros corporativa da Veiling via `zclca_tabela_parametros=>m_get_range` (Módulo: `'FI'`, Chaves: `'DEL_R2R_009'` / `'RISK_CLASS'` / `'EXCLUIR'`). Se o cliente pertencer a uma classe do range de exclusão (ex.: Classe 5 – CVH Interna), a ação é rejeitada para aquele parceiro com gravação de status `'E'` no log e aviso amigável, sem interromper os demais clientes.

---

## 🛠️ Passo a Passo da Criação do Objeto

1. **Geração Automática via Quick Fix no Eclipse ADT:**
   - Abra a Behavior Definition `[[07 - ZI_FI_CLIENTE_INADIMPLENTE (BDEF)|ZI_FI_CLIENTE_INADIMPLENTE (BDEF)]]`.
   - Posicione o cursor sobre o nome da classe `zclfi_bp_cliente_inad` (que estará sublinhado em amarelo indicando que a classe ainda não existe).
   - Pressione **`Ctrl + 1`** (atalho de Quick Fix) e selecione a opção **`Create behavior implementation class zclfi_bp_cliente_inad`**.
   - No assistente de criação, selecione a Ordem de Transporte (TR) do projeto e clique em **Finish**. O Eclipse criará a classe com a definição `FOR BEHAVIOR OF zi_fi_cliente_inadimplente`.
2. **Entendendo a Divisão de Abas no Eclipse:**
   - **Aba `Global Class`:** É a casca pública do Behavior Pool. Ela deve conter apenas a declaração vazia standard do compilador RAP:
     ```abap
     CLASS zclfi_bp_cliente_inad DEFINITION PUBLIC ABSTRACT FINAL FOR BEHAVIOR OF zi_fi_cliente_inadimplente.
     ENDCLASS.

     CLASS zclfi_bp_cliente_inad IMPLEMENTATION.
     ENDCLASS.
     ```
   - **Aba `Local Types` (Include `CCIMP`):** É onde a lógica real é programada. Clique na aba inferior **`Local Types`** para inserir as classes locais de manipulação (`lhc_*`) e salvamento (`lsc_*`).
3. **Inserção do Código em `Local Types`:**
   - Cole o código das classes `lhc_clienteinadimplente` e `lsc_zi_fi_cliente_inadimplente` fornecido na seção [Snippet de Código](file:///c:/Users/gabriel.vsouza/source/MeuSegundoCerebro/01_Projects/Insi/Veiling%20Holambra/DEL-R2R-009%20-%20Bloqueio%20e%20Desbloqueio%20massivo%20de%20clientes%20inadimplentes/Objetos/ZCLFI_BP_CLIENTE_INAD.md#L65-L290) abaixo.
   - *(Atenção à sintaxe de comentários)*: Em classes ABAP, comentários inline devem obrigatoriamente utilizar aspas duplas (`"`), pois o uso de barras duplas (`//`) causa erro de compilação.
   - *(Redefinição obrigatória do Saver)*: Em cenários `unmanaged`, a classe `lsc_...` que herda de `cl_abap_behavior_saver` exige a redefinição do método `save` (`METHODS save REDEFINITION.` e `METHOD save. ENDMETHOD.`), mesmo que o salvamento das APIs seja imediato. Sem isso, o compilador exibirá o erro fatal *"The BEHAVIOR method SAVE must be redefined"*.
   - *(Instanciação da Factory)*: Para instanciar a factory do FSCM, utilize o método singleton correto `cl_ukm_bupa_factory=>create( )` (o método `get_instance` não existe nesta classe standard).
4. **Ativação:** Pressione **`Ctrl + F3`** para ativar a classe `ZCLFI_BP_CLIENTE_INAD`. Em seguida, retorne ao BDEF `ZI_FI_CLIENTE_INADIMPLENTE` e pressione **`Ctrl + F3`** para garantir que a amarração entre o BDEF e o Behavior Pool esteja 100% ativa.

---

## 💻 Snippet de Código

### 📝 Código Comentado (Para Estudo e Referência)
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
    DATA lt_log               TYPE STANDARD TABLE OF ztfi_log_inadimp. " Tabela interna para acúmulo dos logs de auditoria
    DATA lr_classes_excluidas TYPE RANGE OF ukm_risk_class.            " Range para classes desconsideradas (ex: CVH Interna)

    " 🟢 LÊ A TABELA DE PARÂMETROS DA VEILING VIA MÉTODO OFICIAL
    TRY.
        zclca_tabela_parametros=>m_get_range(
          EXPORTING
            iv_modulo = 'FI'
            iv_chave1 = 'DEL_R2R_009'
            iv_chave2 = 'RISK_CLASS'
            iv_chave3 = 'EXCLUIR'
          IMPORTING
            et_range  = lr_classes_excluidas ).
      CATCH cx_root.
        " Fallback de segurança caso a tabela de parâmetros não esteja preenchida
        lr_classes_excluidas = VALUE #( ( sign = 'I' option = 'EQ' low = '5' ) ).
    ENDTRY.

    " Lê os dados atuais dos clientes selecionados pelo operador na tela do Fiori
    READ ENTITIES OF ZI_FI_CLIENTE_INADIMPLENTE IN LOCAL MODE
      ENTITY ClienteInadimplente
      ALL FIELDS WITH CORRESPONDING #( keys )
      RESULT DATA(lt_clientes).

    DATA(lo_bupa_factory) = cl_ukm_bupa_factory=>create( ).       " Factory singleton do SAP Credit Management (FSCM)

    " Processa cliente por cliente de forma independente (resiliência em lote)
    LOOP AT lt_clientes ASSIGNING FIELD-SYMBOL(<ls_cliente>).

      " 🟢 VALIDAÇÃO DEFENSIVA: Se a classe de risco for excluída (ex: conta interna), não bloqueia!
      IF <ls_cliente>-RiskClass IN lr_classes_excluidas.
        APPEND VALUE #(
          log_id         = cl_system_uuid=>create_uuid_x16_static( )
          partner        = <ls_cliente>-PartnerMatriz
          partner_origem = <ls_cliente>-PartnerOrigem
          credit_sgmnt   = <ls_cliente>-CreditSegment
          acao           = gc_acao_bloquear
          block_reason   = space
          status         = 'E'                                    " E = Erro/Rejeitado
          mensagem       = |Cliente { <ls_cliente>-PartnerMatriz } pertence à classe { <ls_cliente>-RiskClass } (excluída) e não pode ser bloqueado.|
          risk_class     = <ls_cliente>-RiskClass
          moeda          = <ls_cliente>-Moeda
          vlr_vencido    = <ls_cliente>-ValorTotalVencido
          dias_atraso    = <ls_cliente>-DiasAtraso
          created_by     = sy-uname
          created_at     = utclong_current( )
        ) TO lt_log.

        APPEND VALUE #( %tky   = <ls_cliente>-%tky
                        %param = <ls_cliente> ) TO result.
        CONTINUE.
      ENDIF.

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

CLASS lsc_zi_fi_cliente_inadimplente DEFINITION INHERITING FROM cl_abap_behavior_saver.
  PROTECTED SECTION.
    " Redefinição obrigatória do método save exigida pelo compilador em unmanaged RAP
    METHODS save REDEFINITION.
    METHODS cleanup REDEFINITION.
    METHODS cleanup_finalize REDEFINITION.
ENDCLASS.

CLASS lsc_zi_fi_cliente_inadimplente IMPLEMENTATION.
  METHOD save.
    " As gravações já foram executadas e persistidas diretamente nos métodos das ações
  ENDMETHOD.

  METHOD cleanup.
  ENDMETHOD.

  METHOD cleanup_finalize.
  ENDMETHOD.
ENDCLASS.
```

---

### 🚀 Código Limpo (Sem Comentários - Para Copiar e Colar)

```abap
CLASS lhc_clienteinadimplente DEFINITION INHERITING FROM cl_abap_behavior_handler.
  PRIVATE SECTION.
    CONSTANTS:
      gc_motivo_inadimplencia TYPE ukm_block_reason VALUE '10',
      gc_segmento_credito     TYPE ukm_credit_sgmnt VALUE '1000',
      gc_acao_bloquear        TYPE c LENGTH 1       VALUE 'B',
      gc_acao_desbloquear     TYPE c LENGTH 1       VALUE 'D'.

    METHODS get_instance_authorizations FOR INSTANCE AUTHORIZATION
      IMPORTING keys REQUEST requested_authorizations FOR ClienteInadimplente RESULT result.

    METHODS bloquearCliente FOR MODIFY
      IMPORTING keys FOR ACTION ClienteInadimplente~bloquearCliente RESULT result.

    METHODS desbloquearCliente FOR MODIFY
      IMPORTING keys FOR ACTION ClienteInadimplente~desbloquearCliente RESULT result.
ENDCLASS.

CLASS lhc_clienteinadimplente IMPLEMENTATION.

  METHOD get_instance_authorizations.
    LOOP AT keys ASSIGNING FIELD-SYMBOL(<ls_key>).

      AUTHORITY-CHECK OBJECT 'ZFI_BLOQ'
        ID 'BUKRS'     FIELD 'CVH1'
        ID 'UKM_SGMNT' FIELD <ls_key>-CreditSegment
        ID 'ACTVT'     FIELD '05'.

      DATA(lv_pode_bloquear) = COND #( WHEN sy-subrc = 0
                                       THEN if_abap_behv=>auth-allowed
                                       ELSE if_abap_behv=>auth-unauthorized ).

      AUTHORITY-CHECK OBJECT 'ZFI_BLOQ'
        ID 'BUKRS'     FIELD 'CVH1'
        ID 'UKM_SGMNT' FIELD <ls_key>-CreditSegment
        ID 'ACTVT'     FIELD '43'.

      DATA(lv_pode_desbloquear) = COND #( WHEN sy-subrc = 0
                                          THEN if_abap_behv=>auth-allowed
                                          ELSE if_abap_behv=>auth-unauthorized ).

      APPEND VALUE #(
        %tky                        = <ls_key>-%tky
        %action-bloquearCliente    = lv_pode_bloquear
        %action-desbloquearCliente  = lv_pode_desbloquear
      ) TO result.
    ENDLOOP.
  ENDMETHOD.

  METHOD bloquearCliente.
    DATA lt_log               TYPE STANDARD TABLE OF ztfi_log_inadimp.
    DATA lr_classes_excluidas TYPE RANGE OF ukm_risk_class.

    TRY.
        zclca_tabela_parametros=>m_get_range(
          EXPORTING
            iv_modulo = 'FI'
            iv_chave1 = 'DEL_R2R_009'
            iv_chave2 = 'RISK_CLASS'
            iv_chave3 = 'EXCLUIR'
          IMPORTING
            et_range  = lr_classes_excluidas ).
      CATCH cx_root.
        lr_classes_excluidas = VALUE #( ( sign = 'I' option = 'EQ' low = '5' ) ).
    ENDTRY.

    READ ENTITIES OF ZI_FI_CLIENTE_INADIMPLENTE IN LOCAL MODE
      ENTITY ClienteInadimplente
      ALL FIELDS WITH CORRESPONDING #( keys )
      RESULT DATA(lt_clientes).

    DATA(lo_bupa_factory) = cl_ukm_bupa_factory=>create( ).

    LOOP AT lt_clientes ASSIGNING FIELD-SYMBOL(<ls_cliente>).

      IF <ls_cliente>-RiskClass IN lr_classes_excluidas.
        APPEND VALUE #(
          log_id         = cl_system_uuid=>create_uuid_x16_static( )
          partner        = <ls_cliente>-PartnerMatriz
          partner_origem = <ls_cliente>-PartnerOrigem
          credit_sgmnt   = <ls_cliente>-CreditSegment
          acao           = gc_acao_bloquear
          block_reason   = space
          status         = 'E'
          mensagem       = |Cliente { <ls_cliente>-PartnerMatriz } pertence à classe { <ls_cliente>-RiskClass } (excluída) e não pode ser bloqueado.|
          risk_class     = <ls_cliente>-RiskClass
          moeda          = <ls_cliente>-Moeda
          vlr_vencido    = <ls_cliente>-ValorTotalVencido
          dias_atraso    = <ls_cliente>-DiasAtraso
          created_by     = sy-uname
          created_at     = utclong_current( )
        ) TO lt_log.

        APPEND VALUE #( %tky   = <ls_cliente>-%tky
                        %param = <ls_cliente> ) TO result.
        CONTINUE.
      ENDIF.

      TRY.
          DATA(lo_account) = CAST cl_ukm_account(
            lo_bupa_factory->get_credit_account(
              i_partner      = <ls_cliente>-PartnerMatriz
              i_credit_sgmnt = <ls_cliente>-CreditSegment ) ).

          lo_account->get_bp_cms_sgm( IMPORTING es_bp_cms_sgm = DATA(ls_sgm) ).
          ls_sgm-xblocked     = abap_true.
          ls_sgm-block_reason = gc_motivo_inadimplencia.
          lo_account->set_bp_cms_sgm( EXPORTING is_bp_cms_sgm = ls_sgm ).

          APPEND VALUE #(
            log_id         = cl_system_uuid=>create_uuid_x16_static( )
            partner        = <ls_cliente>-PartnerMatriz
            partner_origem = <ls_cliente>-PartnerOrigem
            credit_sgmnt   = <ls_cliente>-CreditSegment
            acao           = gc_acao_bloquear
            block_reason   = gc_motivo_inadimplencia
            status         = 'S'
            mensagem       = 'Cliente bloqueado com sucesso.'
            risk_class     = <ls_cliente>-RiskClass
            moeda          = <ls_cliente>-Moeda
            vlr_vencido    = <ls_cliente>-ValorTotalVencido
            dias_atraso    = <ls_cliente>-DiasAtraso
            created_by     = sy-uname
            created_at     = utclong_current( )
          ) TO lt_log.

          <ls_cliente>-IsBlocked   = abap_true.
          <ls_cliente>-BlockReason = gc_motivo_inadimplencia.

        CATCH cx_root INTO DATA(lx_erro).
          APPEND VALUE #(
            log_id         = cl_system_uuid=>create_uuid_x16_static( )
            partner        = <ls_cliente>-PartnerMatriz
            partner_origem = <ls_cliente>-PartnerOrigem
            credit_sgmnt   = <ls_cliente>-CreditSegment
            acao           = gc_acao_bloquear
            block_reason   = gc_motivo_inadimplencia
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

  METHOD desbloquearCliente.
    DATA lt_log TYPE STANDARD TABLE OF ztfi_log_inadimp.

    READ ENTITIES OF ZI_FI_CLIENTE_INADIMPLENTE IN LOCAL MODE
      ENTITY ClienteInadimplente
      ALL FIELDS WITH CORRESPONDING #( keys )
      RESULT DATA(lt_clientes).

    DATA(lo_bupa_factory) = cl_ukm_bupa_factory=>create( ).

    LOOP AT lt_clientes ASSIGNING FIELD-SYMBOL(<ls_cliente>).
      TRY.
          DATA(lo_account) = CAST cl_ukm_account(
            lo_bupa_factory->get_credit_account(
              i_partner      = <ls_cliente>-PartnerMatriz
              i_credit_sgmnt = <ls_cliente>-CreditSegment ) ).

          lo_account->get_bp_cms_sgm( IMPORTING es_bp_cms_sgm = DATA(ls_sgm) ).
          ls_sgm-xblocked     = abap_false.
          CLEAR ls_sgm-block_reason.
          lo_account->set_bp_cms_sgm( EXPORTING is_bp_cms_sgm = ls_sgm ).

          APPEND VALUE #(
            log_id         = cl_system_uuid=>create_uuid_x16_static( )
            partner        = <ls_cliente>-PartnerMatriz
            partner_origem = <ls_cliente>-PartnerOrigem
            credit_sgmnt   = <ls_cliente>-CreditSegment
            acao           = gc_acao_desbloquear
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

CLASS lsc_zi_fi_cliente_inadimplente DEFINITION INHERITING FROM cl_abap_behavior_saver.
  PROTECTED SECTION.
    METHODS save REDEFINITION.
    METHODS cleanup REDEFINITION.
    METHODS cleanup_finalize REDEFINITION.
ENDCLASS.

CLASS lsc_zi_fi_cliente_inadimplente IMPLEMENTATION.
  METHOD save.
  ENDMETHOD.

  METHOD cleanup.
  ENDMETHOD.

  METHOD cleanup_finalize.
  ENDMETHOD.
ENDCLASS.
```
