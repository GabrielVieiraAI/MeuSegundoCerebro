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
2. **Motivo de Bloqueio Fixo (`10`) e Proteção de Bloqueios Existentes:**
   - Na ação **Bloquear (`B`)**: grava `XBLOCKED = 'X'` e `BLOCK_REASON = '10'` no segmento `1000` apenas para os membros do grupo econômico que ainda não estejam bloqueados. Caso algum membro já possua bloqueio ativo (`xblocked = abap_true`), seja pelo motivo `'10'` ou por outro motivo externo (`<> '10'`), o motivo original é preservado sem sobrescrita (registrando a mensagem `006` da `[[03 - ZFI_INADIMPLENCIA|ZFI_INADIMPLENCIA]]` no log quando `block_reason <> '10'`).
   - Na ação **Desbloquear (`D`)**: limpa `XBLOCKED = ''` e `BLOCK_REASON = ''` no segmento `1000` apenas para os membros bloqueados por inadimplência. Caso algum membro possua bloqueio por outro motivo (`block_reason <> '10'`), o bloqueio é preservado sem alteração e registrado em `lt_log` (`status = 'E'`) com a mensagem `006` da `[[03 - ZFI_INADIMPLENCIA|ZFI_INADIMPLENCIA]]`.
3. **Processamento Independente Cliente a Cliente:** Se o usuário selecionar 50 clientes e 2 falharem (ex.: cliente sendo editado por outro usuário no momento), os outros 48 são processados e gravados normalmente, retornando um único resumo consolidado na tela (Message View).
4. **Gravação via Classes Standard + Auditoria (`ZTFI_LOG_INADIMP`):** Toda alteração de bloqueio utiliza `CL_UKM_BUPA_FACTORY` / `CL_UKM_ACCOUNT` (para gerar os documentos de modificação standard lidos pelas integrações legadas) e insere o registro correspondente na tabela `[[01 - ZTFI_LOG_INADIMP|ZTFI_LOG_INADIMP]]`.
5. **Validação Defensiva de Parâmetros Corporativos Clean Core (`zclca_tabela_parametros`):** Antes de bloquear o cliente selecionado e cada membro individual da cascata do grupo econômico (consultando `UKMBP_CMS`), o método `bloquearCliente` consulta a Tabela de Parâmetros corporativa da Veiling via **zclca_tabela_parametros\=>get_instance( )->m_get_range** (Módulo: `'FI'`, Chaves: `'DEL_R2R_009'` / `'RISK_CLASS'` / `'EXCLUIR'`). Se o parceiro pertencer a uma classe do range de exclusão (ex.: Classe 5 – CVH Interna), o bloqueio é rejeitado para aquele parceiro com gravação de status `'E'` no log, sem interromper os demais membros aptos do grupo ou os demais clientes selecionados.
6. **Leitura pela Chave Tripla e Cascata Segura no Grupo Econômico:** O método `obter_grupo_economico` resolve Matriz e filiais vinculadas (`BUT050` / `UKM001`) para aplicar o bloqueio/desbloqueio em cascata no grupo verificando individualmente a classe de risco (`UKMBP_CMS`) e o estado atual de crédito (`get_bp_cms_sgm`) de cada membro, enquanto o método `read` filtra estritamente por `PartnerMatriz`, `CreditSegment` e `PartnerOrigem` para evitar leitura ambígua entre linhas do mesmo grupo.

---

## 🛠️ Passo a Passo da Criação do Objeto

### 🔖 Metadados ADT (*ABAP Development Tools* — Obrigatório para MCP `sap-adt`)

```yaml
objectType: "CLAS/OC"
packageName: "ZFI_BLOQ_INADIMPLENTES"
name: "ZCLFI_BP_CLIENTE_INAD"
description: "Behavior Implementation for ZI_FI_CLIENTE_INADIMPLENTE"
extraParams: {}
```

### 📋 Passo a Passo no ADT / SAP GUI

1. **Geração Automática via Quick Fix no Eclipse ADT:**
   - Abra a Behavior Definition `[[07 - ZI_FI_CLIENTE_INADIMPLENTE (BDEF)|ZI_FI_CLIENTE_INADIMPLENTE (BDEF)]]`.
   - Posicione o cursor sobre o nome da classe `zclfi_bp_cliente_inad` (que estará sublinhado em amarelo indicando que a classe ainda não existe).
   - Pressione **`Ctrl + 1`** (atalho de Quick Fix) e selecione a opção **`Create behavior implementation class zclfi_bp_cliente_inad`**.
   - No assistente de criação, selecione a Ordem de Transporte (TR) do projeto e clique em **Finish**. O Eclipse criará a classe com a definição `FOR BEHAVIOR OF zi_fi_cliente_inadimplente`.
2. **Entendendo a Divisão de Abas no Eclipse:**
   - **Aba `Global Class` (`zclfi_bp_cliente_inad.clas.abap`):** É a casca pública do Behavior Pool contendo a declaração standard do compilador RAP (`FOR BEHAVIOR OF zi_fi_cliente_inadimplente`).
   - **Aba `Local Types` (Include `CCIMP` / `zclfi_bp_cliente_inad.clas.implementations.abap`):** É onde a lógica real é programada (classes locais `lhc_*` e `lsc_*`).
3. **Inserção do Código em `Local Types`:**
   - Cole o código das classes `lhc_clienteinadimplente` e `lsc_zi_fi_cliente_inadimplente` fornecido na seção [Snippet de Código](file:///c:/Users/gabriel.vsouza/source/MeuSegundoCerebro/01_Projects/Insi/Veiling%20Holambra/DEL-R2R-009%20-%20Bloqueio%20e%20Desbloqueio%20massivo%20de%20clientes%20inadimplentes/04%20-%20Objetos%20Tecnicos/08%20-%20ZCLFI_BP_CLIENTE_INAD.md) abaixo.
   - *(Atenção à sintaxe de comentários)*: Em classes ABAP, comentários inline devem obrigatoriamente utilizar aspas duplas (`"`), pois o uso de barras duplas (`//`) causa erro de compilação.
   - *(Redefinição obrigatória do Saver)*: Em cenários `unmanaged`, a classe `lsc_...` que herda de `cl_abap_behavior_saver` exige a redefinição do método `save` (`METHODS save REDEFINITION.` e `METHOD save. ENDMETHOD.`), mesmo que o salvamento das APIs seja imediato. Sem isso, o compilador exibirá o erro fatal *"The BEHAVIOR method SAVE must be redefined"*.
   - *(Instanciação da Factory)*: Para instanciar a factory do FSCM, utilize o método singleton correto **cl_ukm_bupa_factory\=>create( )** (o método `get_instance` não existe nesta classe standard).
4. **Ativação:** Pressione **`Ctrl + F3`** para ativar a classe `ZCLFI_BP_CLIENTE_INAD`. Em seguida, retorne ao BDEF `ZI_FI_CLIENTE_INADIMPLENTE` e pressione **`Ctrl + F3`** para garantir que a amarração entre o BDEF e o Behavior Pool esteja 100% ativa.

---

## 💻 Snippet de Código

### 📝 Código Comentado (Para Estudo e Referência)

#### Aba: Global Class (`zclfi_bp_cliente_inad.clas.abap`)

```abap
CLASS zclfi_bp_cliente_inad DEFINITION PUBLIC ABSTRACT FINAL FOR BEHAVIOR OF zi_fi_cliente_inadimplente. " Casca pública do Behavior Pool
ENDCLASS.

CLASS zclfi_bp_cliente_inad IMPLEMENTATION.
ENDCLASS.
```

#### Aba: Local Types / CCIMP (`zclfi_bp_cliente_inad.clas.implementations.abap`)

```abap
CLASS lhc_clienteinadimplente DEFINITION INHERITING FROM cl_abap_behavior_handler.
  PUBLIC SECTION.
    CLASS-DATA gt_log TYPE STANDARD TABLE OF ztfi_log_inadimp WITH DEFAULT KEY. " Buffer compartilhado de auditoria entre ações e fase de save (CR-104)

  PRIVATE SECTION.
    TYPES:
      tt_partner TYPE STANDARD TABLE OF bu_partner WITH DEFAULT KEY, " Tabela auxiliar para os BPs do grupo econômico
      BEGIN OF ty_resultado_membro,                                  " Estrutura para guardar o desfecho real por parceiro e segmento (CR-103)
        partner      TYPE bu_partner,
        credit_sgmnt TYPE ukm_credit_sgmnt,
        ok           TYPE abap_bool,
      END OF ty_resultado_membro,
      tt_resultado_membro TYPE HASHED TABLE OF ty_resultado_membro
                            WITH UNIQUE KEY partner credit_sgmnt.

    CONSTANTS:
      gc_motivo_inadimplencia TYPE ukm_block_reason VALUE '10',   " Motivo fixo alinhado com a consultora (10 = Inadimplência)
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

    " Leitura de instâncias pelo framework RAP (suporte à chave tripla PartnerMatriz + CreditSegment + PartnerOrigem)
    METHODS read FOR READ
      IMPORTING keys FOR READ ClienteInadimplente RESULT result.

    " Bloqueio otimista/lógico exigido pelo lock master no BDEF
    METHODS lock FOR LOCK
      IMPORTING keys FOR LOCK ClienteInadimplente.

    " Resolve Matriz e todas as filiais vinculadas (BUT050 / UKM001) para bloqueio/desbloqueio em cascata
    METHODS obter_grupo_economico
      IMPORTING
        iv_partner   TYPE bu_partner
      EXPORTING
        ev_matriz    TYPE bu_partner
        et_parceiros TYPE tt_partner.
ENDCLASS.

CLASS lhc_clienteinadimplente IMPLEMENTATION.

  METHOD get_instance_authorizations.
    DATA lv_bukrs_padrao TYPE bukrs.
    DATA lv_company_code TYPE bukrs.

    " Carrega empresa parametrizada apenas como fallback defensivo
    TRY.
        zclca_tabela_parametros=>get_instance( )->m_get_single(
          EXPORTING
            iv_modulo = 'FI'
            iv_chave1 = 'DEL_R2R_009'
            iv_chave2 = 'BUKRS'
            iv_chave3 = 'EMPRESA'
          IMPORTING
            ev_param  = lv_bukrs_padrao ).
      CATCH cx_root.
        lv_bukrs_padrao = 'CVH1'.
    ENDTRY.

    " Lê o campo CompanyCode de cada instância exibida na tela para validação dinâmica (CR-105)
    READ ENTITIES OF zi_fi_cliente_inadimplente IN LOCAL MODE
      ENTITY ClienteInadimplente
      FIELDS ( CompanyCode )
      WITH CORRESPONDING #( keys )
      RESULT DATA(lt_clientes).

    DATA ls_cli_auth LIKE LINE OF lt_clientes.

    " Itera sobre as linhas selecionadas na tela para checar a autorização do usuário no ZFI_BLOQ
    LOOP AT keys ASSIGNING FIELD-SYMBOL(<ls_key>).
      CLEAR ls_cli_auth.
      READ TABLE lt_clientes INTO ls_cli_auth WITH KEY %tky = <ls_key>-%tky.
      IF sy-subrc = 0 AND ls_cli_auth-CompanyCode IS NOT INITIAL.
        lv_company_code = ls_cli_auth-CompanyCode.
      ELSE.
        lv_company_code = lv_bukrs_padrao.
      ENDIF.

      " 1. Checa autorização para a ação de Bloquear (Atividade 05) pela empresa do registro
      AUTHORITY-CHECK OBJECT 'ZFI_BLOQ'
        ID 'BUKRS'     FIELD lv_company_code
        ID 'UKM_SGMNT' FIELD <ls_key>-CreditSegment
        ID 'ACTVT'     FIELD '05'.

      DATA(lv_pode_bloquear) = COND #( WHEN sy-subrc = 0
                                       THEN if_abap_behv=>auth-allowed
                                       ELSE if_abap_behv=>auth-unauthorized ).

      " 2. Checa autorização para a ação de Desbloquear (Atividade 43) pela empresa do registro
      AUTHORITY-CHECK OBJECT 'ZFI_BLOQ'
        ID 'BUKRS'     FIELD lv_company_code
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

  METHOD obter_grupo_economico.
    DATA lr_reltyp TYPE RANGE OF bu_reltyp.

    CLEAR: ev_matriz, et_parceiros.

    " Obtém o tipo de vínculo Matriz x Filial na tabela corporativa de parâmetros (CR-105)
    TRY.
        zclca_tabela_parametros=>get_instance( )->m_get_range(
          EXPORTING
            iv_modulo = 'FI'
            iv_chave1 = 'DEL_R2R_009'
            iv_chave2 = 'RELTYP'
            iv_chave3 = 'GRUPO'
          IMPORTING
            et_range  = lr_reltyp ).
      CATCH cx_root.
        lr_reltyp = VALUE #( ( sign = 'I' option = 'EQ' low = 'UKM001' ) ).
    ENDTRY.

    " Caso 1: O parceiro informado é a Matriz (possui filiais vinculadas em partner2)
    SELECT partner2
      FROM but050
      WHERE partner1 = @iv_partner
        AND reltyp   IN @lr_reltyp
      INTO TABLE @DATA(lt_filiais).

    IF sy-subrc = 0 AND lt_filiais IS NOT INITIAL.
      ev_matriz = iv_partner.
      APPEND iv_partner TO et_parceiros.
      LOOP AT lt_filiais ASSIGNING FIELD-SYMBOL(<lv_filial>).
        APPEND <lv_filial> TO et_parceiros.
      ENDLOOP.
      SORT et_parceiros.
      DELETE ADJACENT DUPLICATES FROM et_parceiros.
      RETURN.
    ENDIF.

    " Caso 2: O parceiro informado é uma filial (busca sua Matriz em partner1 e todas as irmãs)
    SELECT SINGLE partner1
      FROM but050
      WHERE partner2 = @iv_partner
        AND reltyp   IN @lr_reltyp
      INTO @DATA(lv_matriz_encontrada).

    IF sy-subrc = 0 AND lv_matriz_encontrada IS NOT INITIAL.
      ev_matriz = lv_matriz_encontrada.
      APPEND lv_matriz_encontrada TO et_parceiros.

      SELECT partner2
        FROM but050
        WHERE partner1 = @lv_matriz_encontrada
          AND reltyp   IN @lr_reltyp
        INTO TABLE @lt_filiais.

      LOOP AT lt_filiais ASSIGNING FIELD-SYMBOL(<lv_f>).
        APPEND <lv_f> TO et_parceiros.
      ENDLOOP.
      SORT et_parceiros.
      DELETE ADJACENT DUPLICATES FROM et_parceiros.
      RETURN.
    ENDIF.

    " Caso 3: Parceiro individual sem vínculo de grupo econômico
    ev_matriz = iv_partner.
    APPEND iv_partner TO et_parceiros.
  ENDMETHOD.

  METHOD bloquearCliente.
    DATA lt_log                TYPE STANDARD TABLE OF ztfi_log_inadimp. " Tabela interna para acúmulo dos logs de auditoria
    DATA lr_classes_excluidas  TYPE RANGE OF ukm_risk_class.            " Range para classes desconsideradas (ex: CVH Interna)
    DATA lt_resultados_membros TYPE tt_resultado_membro.                " Armazena o resultado real (sucesso/falha) de cada membro por segmento no lote (CR-103)
    DATA lv_risk_class_membro  TYPE ukm_risk_class.                    " Classe de risco individual do membro consultada na UKMBP_CMS
    DATA lv_bloqueio_ok        TYPE abap_bool.                         " Flag declarada fora do LOOP para evitar retenção estática entre iterações (CR-103)

    " Lê a tabela de parâmetros corporativa da Veiling via instância oficial
    TRY.
        zclca_tabela_parametros=>get_instance( )->m_get_range(
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

    " Lê os dados atuais das linhas selecionadas pelo operador na tela do Fiori (chave tripla)
    READ ENTITIES OF zi_fi_cliente_inadimplente IN LOCAL MODE
      ENTITY ClienteInadimplente
      ALL FIELDS WITH CORRESPONDING #( keys )
      RESULT DATA(lt_clientes).

    DATA(lo_bupa_factory) = cl_ukm_bupa_factory=>create( ).       " Factory singleton do SAP Credit Management (FSCM)

    " Processa linha a linha com resiliência e cascata no grupo econômico
    LOOP AT lt_clientes ASSIGNING FIELD-SYMBOL(<ls_cliente>).
      lv_bloqueio_ok = abap_false. " Reinicialização explícita a cada cliente selecionado (CR-103)

      " Validação defensiva: se a classe de risco for excluída (ex: conta interna), não bloqueia
      IF <ls_cliente>-RiskClass IN lr_classes_excluidas.
        TRY.
            APPEND VALUE #(
              log_id         = cl_system_uuid=>create_uuid_x16_static( )
              partner        = <ls_cliente>-partnermatriz
              partner_origem = <ls_cliente>-partnerorigem
              credit_sgmnt   = <ls_cliente>-creditsegment
              acao           = gc_acao_bloquear
              block_reason   = space
              status         = 'E'
              mensagem       = |Cliente { <ls_cliente>-partnermatriz } pertence à classe { <ls_cliente>-riskclass } (excluída) e não pode ser bloqueado.|
              risk_class     = <ls_cliente>-riskclass
              moeda          = <ls_cliente>-moeda
              vlr_vencido    = <ls_cliente>-valortotalvencido
              dias_atraso    = <ls_cliente>-diasatraso
              created_by     = sy-uname
              created_at     = utclong_current( )
            ) TO lt_log.
          CATCH cx_uuid_error.
        ENDTRY.

        APPEND VALUE #( %tky = <ls_cliente>-%tky ) TO failed-clienteinadimplente.
        APPEND VALUE #(
          %tky = <ls_cliente>-%tky
          %msg = new_message_with_text(
            severity = if_abap_behv_message=>severity-warning
            text     = |Cliente { <ls_cliente>-partnermatriz } pertence à classe { <ls_cliente>-riskclass } (excluída) e não pode ser bloqueado.|
          )
        ) TO reported-clienteinadimplente.

        APPEND VALUE #( %tky   = <ls_cliente>-%tky
                        %param = <ls_cliente> ) TO result.
        CONTINUE.
      ENDIF.

      obter_grupo_economico(
        EXPORTING
          iv_partner   = <ls_cliente>-PartnerMatriz
        IMPORTING
          ev_matriz    = DATA(lv_matriz)
          et_parceiros = DATA(lt_grupo) ).

      LOOP AT lt_grupo INTO DATA(lv_bp_membro).
        " Verifica se o membro + segmento já foi avaliado neste lote e respeita seu desfecho real (CR-103)
        READ TABLE lt_resultados_membros ASSIGNING FIELD-SYMBOL(<ls_res_existente>)
          WITH TABLE KEY partner      = lv_bp_membro
                         credit_sgmnt = <ls_cliente>-CreditSegment.
        IF sy-subrc = 0.
          IF <ls_res_existente>-ok = abap_true.
            lv_bloqueio_ok = abap_true.
          ENDIF.
          CONTINUE.
        ENDIF.

        " Registra o membro inicialmente com ok = abap_false até que o bloqueio seja efetivado (CR-103)
        INSERT VALUE #(
          partner      = lv_bp_membro
          credit_sgmnt = <ls_cliente>-CreditSegment
          ok           = abap_false
        ) INTO TABLE lt_resultados_membros ASSIGNING FIELD-SYMBOL(<ls_res_membro>).

        " Checagem individual da classe de risco do membro na UKMBP_CMS (CR-102)
        CLEAR lv_risk_class_membro.
        SELECT SINGLE risk_class
          FROM ukmbp_cms
          WHERE partner = @lv_bp_membro
          INTO @lv_risk_class_membro.

        IF lv_risk_class_membro IS NOT INITIAL AND lv_risk_class_membro IN lr_classes_excluidas.
          TRY.
              APPEND VALUE #(
                log_id         = cl_system_uuid=>create_uuid_x16_static( )
                partner        = lv_bp_membro
                partner_origem = <ls_cliente>-PartnerOrigem
                credit_sgmnt   = <ls_cliente>-CreditSegment
                acao           = gc_acao_bloquear
                block_reason   = space
                status         = 'E'
                mensagem       = |Cliente { lv_bp_membro } pertence à classe { lv_risk_class_membro } (excluída) e não pode ser bloqueado.|
                risk_class     = lv_risk_class_membro
                moeda          = <ls_cliente>-Moeda
                vlr_vencido    = <ls_cliente>-ValorTotalVencido
                dias_atraso    = <ls_cliente>-DiasAtraso
                created_by     = sy-uname
                created_at     = utclong_current( )
              ) TO lt_log.
            CATCH cx_uuid_error.
          ENDTRY.
          CONTINUE.
        ENDIF.

        TRY.
            DATA(lo_account) = CAST cl_ukm_account(
              lo_bupa_factory->get_credit_account(
                i_partner      = lv_bp_membro
                i_credit_sgmnt = <ls_cliente>-CreditSegment ) ).

            lo_account->get_bp_cms_sgm( IMPORTING es_bp_cms_sgm = DATA(ls_sgm) ).

            " Proteção contra sobrescrita: não altera membro que já esteja bloqueado no FSCM (CR-102)
            IF ls_sgm-xblocked = abap_true.
              IF ls_sgm-block_reason <> gc_motivo_inadimplencia.
                MESSAGE ID 'ZFI_INADIMPLENCIA' TYPE 'W' NUMBER '006'
                  WITH lv_bp_membro ls_sgm-block_reason
                  INTO DATA(lv_msg_bloq_006).

                APPEND VALUE #(
                  log_id         = cl_system_uuid=>create_uuid_x16_static( )
                  partner        = lv_bp_membro
                  partner_origem = <ls_cliente>-PartnerOrigem
                  credit_sgmnt   = <ls_cliente>-CreditSegment
                  acao           = gc_acao_bloquear
                  block_reason   = ls_sgm-block_reason
                  status         = 'E'
                  mensagem       = lv_msg_bloq_006
                  risk_class     = COND #( WHEN lv_risk_class_membro IS NOT INITIAL
                                           THEN lv_risk_class_membro
                                           ELSE <ls_cliente>-RiskClass )
                  moeda          = <ls_cliente>-Moeda
                  vlr_vencido    = <ls_cliente>-ValorTotalVencido
                  dias_atraso    = <ls_cliente>-DiasAtraso
                  created_by     = sy-uname
                  created_at     = utclong_current( )
                ) TO lt_log.
              ELSE.
                APPEND VALUE #(
                  log_id         = cl_system_uuid=>create_uuid_x16_static( )
                  partner        = lv_bp_membro
                  partner_origem = <ls_cliente>-PartnerOrigem
                  credit_sgmnt   = <ls_cliente>-CreditSegment
                  acao           = gc_acao_bloquear
                  block_reason   = ls_sgm-block_reason
                  status         = 'S'
                  mensagem       = |Cliente { lv_bp_membro } já se encontra bloqueado por inadimplência (Motivo { gc_motivo_inadimplencia }).|
                  risk_class     = COND #( WHEN lv_risk_class_membro IS NOT INITIAL
                                           THEN lv_risk_class_membro
                                           ELSE <ls_cliente>-RiskClass )
                  moeda          = <ls_cliente>-Moeda
                  vlr_vencido    = <ls_cliente>-ValorTotalVencido
                  dias_atraso    = <ls_cliente>-DiasAtraso
                  created_by     = sy-uname
                  created_at     = utclong_current( )
                ) TO lt_log.
                <ls_res_membro>-ok = abap_true.
                lv_bloqueio_ok     = abap_true.
              ENDIF.
              CONTINUE.
            ENDIF.

            ls_sgm-xblocked     = abap_true.
            ls_sgm-block_reason = gc_motivo_inadimplencia.
            lo_account->set_bp_cms_sgm( EXPORTING is_bp_cms_sgm = ls_sgm ).

            APPEND VALUE #(
              log_id         = cl_system_uuid=>create_uuid_x16_static( )
              partner        = lv_bp_membro
              partner_origem = <ls_cliente>-PartnerOrigem
              credit_sgmnt   = <ls_cliente>-CreditSegment
              acao           = gc_acao_bloquear
              block_reason   = gc_motivo_inadimplencia
              status         = 'S'
              mensagem       = COND #( WHEN lv_bp_membro = <ls_cliente>-PartnerMatriz
                                       THEN 'Cliente bloqueado com sucesso.'
                                       ELSE |Bloqueio em cascata (Grupo Matriz { lv_matriz }).| )
              risk_class     = COND #( WHEN lv_risk_class_membro IS NOT INITIAL
                                       THEN lv_risk_class_membro
                                       ELSE <ls_cliente>-RiskClass )
              moeda          = <ls_cliente>-Moeda
              vlr_vencido    = <ls_cliente>-ValorTotalVencido
              dias_atraso    = <ls_cliente>-DiasAtraso
              created_by     = sy-uname
              created_at     = utclong_current( )
            ) TO lt_log.

            <ls_res_membro>-ok = abap_true.
            lv_bloqueio_ok     = abap_true.

          CATCH cx_root INTO DATA(lx_erro_membro).
            TRY.
                APPEND VALUE #(
                  log_id         = cl_system_uuid=>create_uuid_x16_static( )
                  partner        = lv_bp_membro
                  partner_origem = <ls_cliente>-PartnerOrigem
                  credit_sgmnt   = <ls_cliente>-CreditSegment
                  acao           = gc_acao_bloquear
                  block_reason   = gc_motivo_inadimplencia
                  status         = 'E'
                  mensagem       = lx_erro_membro->get_text( )
                  risk_class     = COND #( WHEN lv_risk_class_membro IS NOT INITIAL
                                           THEN lv_risk_class_membro
                                           ELSE <ls_cliente>-RiskClass )
                  moeda          = <ls_cliente>-Moeda
                  vlr_vencido    = <ls_cliente>-ValorTotalVencido
                  dias_atraso    = <ls_cliente>-DiasAtraso
                  created_by     = sy-uname
                  created_at     = utclong_current( )
                ) TO lt_log.
              CATCH cx_uuid_error.
            ENDTRY.
        ENDTRY.
      ENDLOOP.

      IF lv_bloqueio_ok = abap_true.
        <ls_cliente>-IsBlocked   = abap_true.
        <ls_cliente>-BlockReason = gc_motivo_inadimplencia.

        APPEND VALUE #(
          %tky = <ls_cliente>-%tky
          %msg = new_message(
            id       = 'ZFI_INADIMPLENCIA'
            number   = '001'
            severity = if_abap_behv_message=>severity-success
            v1       = <ls_cliente>-PartnerMatriz
            v2       = <ls_cliente>-CreditSegment
          )
        ) TO reported-clienteinadimplente.
      ELSE.
        APPEND VALUE #( %tky = <ls_cliente>-%tky ) TO failed-clienteinadimplente.
        APPEND VALUE #(
          %tky = <ls_cliente>-%tky
          %msg = new_message_with_text(
            severity = if_abap_behv_message=>severity-error
            text     = |Erro ao bloquear cliente { <ls_cliente>-PartnerMatriz } ou filiais do grupo.|
          )
        ) TO reported-clienteinadimplente.
      ENDIF.

      APPEND VALUE #( %tky   = <ls_cliente>-%tky
                      %param = <ls_cliente> ) TO result.
    ENDLOOP.

    APPEND LINES OF lt_log TO gt_log. " Acumula os logs para persistência coordenada na fase de save (CR-104)
  ENDMETHOD.

  METHOD desbloquearCliente.
    DATA lt_log                TYPE STANDARD TABLE OF ztfi_log_inadimp.
    DATA lt_resultados_membros TYPE tt_resultado_membro.                " Armazena o resultado real (sucesso/falha) de cada membro por segmento no lote (CR-103)
    DATA lv_desbloqueio_ok     TYPE abap_bool.                         " Flag declarada fora do LOOP para evitar retenção estática entre iterações (CR-103)

    READ ENTITIES OF zi_fi_cliente_inadimplente IN LOCAL MODE
      ENTITY ClienteInadimplente
      ALL FIELDS WITH CORRESPONDING #( keys )
      RESULT DATA(lt_clientes).

    DATA(lo_bupa_factory) = cl_ukm_bupa_factory=>create( ).

    LOOP AT lt_clientes ASSIGNING FIELD-SYMBOL(<ls_cliente>).
      lv_desbloqueio_ok = abap_false. " Reinicialização explícita a cada cliente selecionado (CR-103)

      obter_grupo_economico(
        EXPORTING
          iv_partner   = <ls_cliente>-PartnerMatriz
        IMPORTING
          ev_matriz    = DATA(lv_matriz_desb)
          et_parceiros = DATA(lt_grupo_desb) ).

      LOOP AT lt_grupo_desb INTO DATA(lv_bp_membro_desb).
        " Verifica se o membro + segmento já foi avaliado neste lote e respeita seu desfecho real (CR-103)
        READ TABLE lt_resultados_membros ASSIGNING FIELD-SYMBOL(<ls_res_existente>)
          WITH TABLE KEY partner      = lv_bp_membro_desb
                         credit_sgmnt = <ls_cliente>-CreditSegment.
        IF sy-subrc = 0.
          IF <ls_res_existente>-ok = abap_true.
            lv_desbloqueio_ok = abap_true.
          ENDIF.
          CONTINUE.
        ENDIF.

        " Registra o membro inicialmente com ok = abap_false até que o desbloqueio seja efetivado (CR-103)
        INSERT VALUE #(
          partner      = lv_bp_membro_desb
          credit_sgmnt = <ls_cliente>-CreditSegment
          ok           = abap_false
        ) INTO TABLE lt_resultados_membros ASSIGNING FIELD-SYMBOL(<ls_res_membro>).

        TRY.
            DATA(lo_account) = CAST cl_ukm_account(
              lo_bupa_factory->get_credit_account(
                i_partner      = lv_bp_membro_desb
                i_credit_sgmnt = <ls_cliente>-CreditSegment ) ).

            lo_account->get_bp_cms_sgm( IMPORTING es_bp_cms_sgm = DATA(ls_sgm) ).

            " Preserva bloqueios de outros motivos (<> 10) e registra mensagem 006 no log (CR-102)
            IF ls_sgm-xblocked = abap_true AND ls_sgm-block_reason <> gc_motivo_inadimplencia.
              MESSAGE ID 'ZFI_INADIMPLENCIA' TYPE 'W' NUMBER '006'
                WITH lv_bp_membro_desb ls_sgm-block_reason
                INTO DATA(lv_msg_desb_006).

              APPEND VALUE #(
                log_id         = cl_system_uuid=>create_uuid_x16_static( )
                partner        = lv_bp_membro_desb
                partner_origem = <ls_cliente>-PartnerOrigem
                credit_sgmnt   = <ls_cliente>-CreditSegment
                acao           = gc_acao_desbloquear
                block_reason   = ls_sgm-block_reason
                status         = 'E'
                mensagem       = lv_msg_desb_006
                risk_class     = <ls_cliente>-RiskClass
                moeda          = <ls_cliente>-Moeda
                vlr_vencido    = <ls_cliente>-ValorTotalVencido
                dias_atraso    = <ls_cliente>-DiasAtraso
                created_by     = sy-uname
                created_at     = utclong_current( )
              ) TO lt_log.
              CONTINUE.
            ENDIF.

            ls_sgm-xblocked     = abap_false.
            CLEAR ls_sgm-block_reason.
            lo_account->set_bp_cms_sgm( EXPORTING is_bp_cms_sgm = ls_sgm ).

            APPEND VALUE #(
              log_id         = cl_system_uuid=>create_uuid_x16_static( )
              partner        = lv_bp_membro_desb
              partner_origem = <ls_cliente>-PartnerOrigem
              credit_sgmnt   = <ls_cliente>-CreditSegment
              acao           = gc_acao_desbloquear
              block_reason   = space
              status         = 'S'
              mensagem       = COND #( WHEN lv_bp_membro_desb = <ls_cliente>-PartnerMatriz
                                       THEN 'Cliente desbloqueado com sucesso.'
                                       ELSE |Desbloqueio em cascata (Grupo Econômico Matriz { lv_matriz_desb }).| )
              risk_class     = <ls_cliente>-RiskClass
              moeda          = <ls_cliente>-Moeda
              vlr_vencido    = <ls_cliente>-ValorTotalVencido
              dias_atraso    = <ls_cliente>-DiasAtraso
              created_by     = sy-uname
              created_at     = utclong_current( )
            ) TO lt_log.

            <ls_res_membro>-ok = abap_true.
            lv_desbloqueio_ok  = abap_true.

          CATCH cx_root INTO DATA(lx_erro_desb).
            TRY.
                APPEND VALUE #(
                  log_id         = cl_system_uuid=>create_uuid_x16_static( )
                  partner        = lv_bp_membro_desb
                  partner_origem = <ls_cliente>-PartnerOrigem
                  credit_sgmnt   = <ls_cliente>-CreditSegment
                  acao           = gc_acao_desbloquear
                  block_reason   = space
                  status         = 'E'
                  mensagem       = lx_erro_desb->get_text( )
                  risk_class     = <ls_cliente>-RiskClass
                  moeda          = <ls_cliente>-Moeda
                  vlr_vencido    = <ls_cliente>-ValorTotalVencido
                  dias_atraso    = <ls_cliente>-DiasAtraso
                  created_by     = sy-uname
                  created_at     = utclong_current( )
                ) TO lt_log.
              CATCH cx_uuid_error.
            ENDTRY.
        ENDTRY.
      ENDLOOP.

      IF lv_desbloqueio_ok = abap_true.
        <ls_cliente>-IsBlocked   = abap_false.
        CLEAR <ls_cliente>-BlockReason.

        APPEND VALUE #(
          %tky = <ls_cliente>-%tky
          %msg = new_message(
            id       = 'ZFI_INADIMPLENCIA'
            number   = '002'
            severity = if_abap_behv_message=>severity-success
            v1       = <ls_cliente>-PartnerMatriz
            v2       = <ls_cliente>-CreditSegment
          )
        ) TO reported-clienteinadimplente.
      ELSE.
        APPEND VALUE #( %tky = <ls_cliente>-%tky ) TO failed-clienteinadimplente.
        APPEND VALUE #(
          %tky = <ls_cliente>-%tky
          %msg = new_message_with_text(
            severity = if_abap_behv_message=>severity-error
            text     = |Erro ao desbloquear cliente { <ls_cliente>-PartnerMatriz } ou filiais do grupo.|
          )
        ) TO reported-clienteinadimplente.
      ENDIF.

      APPEND VALUE #( %tky   = <ls_cliente>-%tky
                      %param = <ls_cliente> ) TO result.
    ENDLOOP.

    APPEND LINES OF lt_log TO gt_log. " Acumula os logs para persistência coordenada na fase de save (CR-104)
  ENDMETHOD.

  METHOD lock.
    " Trava logicamente Matriz e todas as filiais do grupo econômico antes de executar ações (CR-104)
    DATA lt_return    TYPE bapiret2_t.
    DATA ls_erro      TYPE bapiret2.
    DATA lv_enq_subrc TYPE sy-subrc.

    LOOP AT keys ASSIGNING FIELD-SYMBOL(<ls_key>).
      obter_grupo_economico(
        EXPORTING
          iv_partner   = <ls_key>-PartnerMatriz
        IMPORTING
          et_parceiros = DATA(lt_grupo) ).

      LOOP AT lt_grupo INTO DATA(lv_bp_membro).
        CLEAR: lt_return, ls_erro.
        CALL FUNCTION 'BUPA_ENQUEUE'
          EXPORTING
            iv_partner      = lv_bp_membro
          TABLES
            et_return       = lt_return
          EXCEPTIONS
            blocked_partner = 1
            OTHERS          = 2.
        lv_enq_subrc = sy-subrc.

        READ TABLE lt_return INTO ls_erro WITH KEY type = 'E'.
        IF sy-subrc <> 0.
          READ TABLE lt_return INTO ls_erro WITH KEY type = 'A'.
        ENDIF.

        IF ls_erro IS NOT INITIAL OR lv_enq_subrc <> 0.
          " Desfaz eventuais travas já aplicadas ao grupo para não deixar lock órfão na SM12
          LOOP AT lt_grupo INTO DATA(lv_bp_unlock).
            CLEAR lt_return.
            CALL FUNCTION 'BUPA_DEQUEUE'
              EXPORTING
                iv_partner = lv_bp_unlock
              TABLES
                et_return  = lt_return.
          ENDLOOP.

          APPEND VALUE #( %tky        = CORRESPONDING #( <ls_key> )
                          %fail-cause = if_abap_behv=>cause-locked ) TO failed-clienteinadimplente.

          IF ls_erro-id IS NOT INITIAL AND ls_erro-number IS NOT INITIAL.
            APPEND VALUE #( %tky = CORRESPONDING #( <ls_key> )
                            %msg = new_message(
                              id       = ls_erro-id
                              number   = ls_erro-number
                              severity = if_abap_behv_message=>severity-error
                              v1       = ls_erro-message_v1
                              v2       = ls_erro-message_v2
                              v3       = ls_erro-message_v3
                              v4       = ls_erro-message_v4 ) ) TO reported-clienteinadimplente.
          ELSE.
            APPEND VALUE #( %tky = CORRESPONDING #( <ls_key> )
                            %msg = new_message(
                              id       = 'ZFI_INADIMPLENCIA'
                              number   = '003'
                              severity = if_abap_behv_message=>severity-error
                              v1       = <ls_key>-PartnerMatriz
                              v2       = lv_bp_membro ) ) TO reported-clienteinadimplente.
          ENDIF.
          EXIT.
        ENDIF.
      ENDLOOP.
    ENDLOOP.
  ENDMETHOD.

  METHOD read.
    " Filtra também por PartnerOrigem (chave tripla) para retornar exclusivamente a linha selecionada
    SELECT *
      FROM zi_fi_cliente_inadimplente
      FOR ALL ENTRIES IN @keys
      WHERE PartnerMatriz = @keys-PartnerMatriz
        AND CreditSegment = @keys-CreditSegment
        AND PartnerOrigem = @keys-PartnerOrigem
      INTO TABLE @DATA(lt_dados).
    result = CORRESPONDING #( lt_dados ).
  ENDMETHOD.

ENDCLASS.

CLASS lsc_zi_fi_cliente_inadimplente DEFINITION INHERITING FROM cl_abap_behavior_saver.
  PROTECTED SECTION.
    " Redefinição dos métodos de salvamento e limpeza transacional (CR-104)
    METHODS save REDEFINITION.
    METHODS cleanup REDEFINITION.
    METHODS cleanup_finalize REDEFINITION.
ENDCLASS.

CLASS lsc_zi_fi_cliente_inadimplente IMPLEMENTATION.
  METHOD save.
    " Efetiva as alterações de crédito via Update Task e persiste os logs na fase de Save (CR-104)
    IF lhc_clienteinadimplente=>gt_log IS NOT INITIAL.
      cl_ukm_bupa_factory=>create( )->save_all(
        EXPORTING
          i_upd_task = abap_true
        EXCEPTIONS
          failed     = 1
          OTHERS     = 2 ).
      IF sy-subrc = 0.
        DATA(lt_log_save) = lhc_clienteinadimplente=>gt_log.
        INSERT ztfi_log_inadimp FROM TABLE @lt_log_save.
      ENDIF.
    ENDIF.
  ENDMETHOD.

  METHOD cleanup.
    " Libera o buffer da factory standard e limpa o buffer estático de auditoria ao fim da LUW
    cl_ukm_bupa_factory=>create( )->free_all( ).
    CLEAR lhc_clienteinadimplente=>gt_log.
  ENDMETHOD.

  METHOD cleanup_finalize.
    " Garante limpeza mesmo em cenários de falha/cancelamento antes do save
    cleanup( ).
  ENDMETHOD.
ENDCLASS.
```

---

### 🚀 Código Limpo (Sem Comentários - Para Copiar e Colar)

#### Aba: Global Class (`zclfi_bp_cliente_inad.clas.abap`)

```abap
CLASS zclfi_bp_cliente_inad DEFINITION PUBLIC ABSTRACT FINAL FOR BEHAVIOR OF zi_fi_cliente_inadimplente.
ENDCLASS.

CLASS zclfi_bp_cliente_inad IMPLEMENTATION.
ENDCLASS.
```

#### Aba: Local Types / CCIMP (`zclfi_bp_cliente_inad.clas.implementations.abap`)

```abap
CLASS lhc_clienteinadimplente DEFINITION INHERITING FROM cl_abap_behavior_handler.
  PUBLIC SECTION.
    CLASS-DATA gt_log TYPE STANDARD TABLE OF ztfi_log_inadimp WITH DEFAULT KEY.

  PRIVATE SECTION.
    TYPES:
      tt_partner TYPE STANDARD TABLE OF bu_partner WITH DEFAULT KEY,
      BEGIN OF ty_resultado_membro,
        partner      TYPE bu_partner,
        credit_sgmnt TYPE ukm_credit_sgmnt,
        ok           TYPE abap_bool,
      END OF ty_resultado_membro,
      tt_resultado_membro TYPE HASHED TABLE OF ty_resultado_membro
                            WITH UNIQUE KEY partner credit_sgmnt.

    CONSTANTS:
      gc_motivo_inadimplencia TYPE ukm_block_reason VALUE '10',
      gc_acao_bloquear        TYPE c LENGTH 1       VALUE 'B',
      gc_acao_desbloquear     TYPE c LENGTH 1       VALUE 'D'.

    METHODS get_instance_authorizations FOR INSTANCE AUTHORIZATION
      IMPORTING keys REQUEST requested_authorizations FOR ClienteInadimplente RESULT result.

    METHODS bloquearCliente FOR MODIFY
      IMPORTING keys FOR ACTION ClienteInadimplente~bloquearCliente RESULT result.

    METHODS desbloquearCliente FOR MODIFY
      IMPORTING keys FOR ACTION ClienteInadimplente~desbloquearCliente RESULT result.

    METHODS read FOR READ
      IMPORTING keys FOR READ ClienteInadimplente RESULT result.

    METHODS lock FOR LOCK
      IMPORTING keys FOR LOCK ClienteInadimplente.

    METHODS obter_grupo_economico
      IMPORTING
        iv_partner   TYPE bu_partner
      EXPORTING
        ev_matriz    TYPE bu_partner
        et_parceiros TYPE tt_partner.
ENDCLASS.

CLASS lhc_clienteinadimplente IMPLEMENTATION.

  METHOD get_instance_authorizations.
    DATA lv_bukrs_padrao TYPE bukrs.
    DATA lv_company_code TYPE bukrs.

    TRY.
        zclca_tabela_parametros=>get_instance( )->m_get_single(
          EXPORTING
            iv_modulo = 'FI'
            iv_chave1 = 'DEL_R2R_009'
            iv_chave2 = 'BUKRS'
            iv_chave3 = 'EMPRESA'
          IMPORTING
            ev_param  = lv_bukrs_padrao ).
      CATCH cx_root.
        lv_bukrs_padrao = 'CVH1'.
    ENDTRY.

    READ ENTITIES OF zi_fi_cliente_inadimplente IN LOCAL MODE
      ENTITY ClienteInadimplente
      FIELDS ( CompanyCode )
      WITH CORRESPONDING #( keys )
      RESULT DATA(lt_clientes).

    DATA ls_cli_auth LIKE LINE OF lt_clientes.

    LOOP AT keys ASSIGNING FIELD-SYMBOL(<ls_key>).
      CLEAR ls_cli_auth.
      READ TABLE lt_clientes INTO ls_cli_auth WITH KEY %tky = <ls_key>-%tky.
      IF sy-subrc = 0 AND ls_cli_auth-CompanyCode IS NOT INITIAL.
        lv_company_code = ls_cli_auth-CompanyCode.
      ELSE.
        lv_company_code = lv_bukrs_padrao.
      ENDIF.

      AUTHORITY-CHECK OBJECT 'ZFI_BLOQ'
        ID 'BUKRS'     FIELD lv_company_code
        ID 'UKM_SGMNT' FIELD <ls_key>-CreditSegment
        ID 'ACTVT'     FIELD '05'.

      DATA(lv_pode_bloquear) = COND #( WHEN sy-subrc = 0
                                       THEN if_abap_behv=>auth-allowed
                                       ELSE if_abap_behv=>auth-unauthorized ).

      AUTHORITY-CHECK OBJECT 'ZFI_BLOQ'
        ID 'BUKRS'     FIELD lv_company_code
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

  METHOD obter_grupo_economico.
    DATA lr_reltyp TYPE RANGE OF bu_reltyp.

    CLEAR: ev_matriz, et_parceiros.

    TRY.
        zclca_tabela_parametros=>get_instance( )->m_get_range(
          EXPORTING
            iv_modulo = 'FI'
            iv_chave1 = 'DEL_R2R_009'
            iv_chave2 = 'RELTYP'
            iv_chave3 = 'GRUPO'
          IMPORTING
            et_range  = lr_reltyp ).
      CATCH cx_root.
        lr_reltyp = VALUE #( ( sign = 'I' option = 'EQ' low = 'UKM001' ) ).
    ENDTRY.

    SELECT partner2
      FROM but050
      WHERE partner1 = @iv_partner
        AND reltyp   IN @lr_reltyp
      INTO TABLE @DATA(lt_filiais).

    IF sy-subrc = 0 AND lt_filiais IS NOT INITIAL.
      ev_matriz = iv_partner.
      APPEND iv_partner TO et_parceiros.
      LOOP AT lt_filiais ASSIGNING FIELD-SYMBOL(<lv_filial>).
        APPEND <lv_filial> TO et_parceiros.
      ENDLOOP.
      SORT et_parceiros.
      DELETE ADJACENT DUPLICATES FROM et_parceiros.
      RETURN.
    ENDIF.

    SELECT SINGLE partner1
      FROM but050
      WHERE partner2 = @iv_partner
        AND reltyp   IN @lr_reltyp
      INTO @DATA(lv_matriz_encontrada).

    IF sy-subrc = 0 AND lv_matriz_encontrada IS NOT INITIAL.
      ev_matriz = lv_matriz_encontrada.
      APPEND lv_matriz_encontrada TO et_parceiros.

      SELECT partner2
        FROM but050
        WHERE partner1 = @lv_matriz_encontrada
          AND reltyp   IN @lr_reltyp
        INTO TABLE @lt_filiais.

      LOOP AT lt_filiais ASSIGNING FIELD-SYMBOL(<lv_f>).
        APPEND <lv_f> TO et_parceiros.
      ENDLOOP.
      SORT et_parceiros.
      DELETE ADJACENT DUPLICATES FROM et_parceiros.
      RETURN.
    ENDIF.

    ev_matriz = iv_partner.
    APPEND iv_partner TO et_parceiros.
  ENDMETHOD.

  METHOD bloquearCliente.
    DATA lt_log                TYPE STANDARD TABLE OF ztfi_log_inadimp.
    DATA lr_classes_excluidas  TYPE RANGE OF ukm_risk_class.
    DATA lt_resultados_membros TYPE tt_resultado_membro.
    DATA lv_risk_class_membro  TYPE ukm_risk_class.
    DATA lv_bloqueio_ok        TYPE abap_bool.

    TRY.
        zclca_tabela_parametros=>get_instance( )->m_get_range(
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

    READ ENTITIES OF zi_fi_cliente_inadimplente IN LOCAL MODE
      ENTITY ClienteInadimplente
      ALL FIELDS WITH CORRESPONDING #( keys )
      RESULT DATA(lt_clientes).

    DATA(lo_bupa_factory) = cl_ukm_bupa_factory=>create( ).

    LOOP AT lt_clientes ASSIGNING FIELD-SYMBOL(<ls_cliente>).
      lv_bloqueio_ok = abap_false.

      IF <ls_cliente>-RiskClass IN lr_classes_excluidas.
        TRY.
            APPEND VALUE #(
              log_id         = cl_system_uuid=>create_uuid_x16_static( )
              partner        = <ls_cliente>-partnermatriz
              partner_origem = <ls_cliente>-partnerorigem
              credit_sgmnt   = <ls_cliente>-creditsegment
              acao           = gc_acao_bloquear
              block_reason   = space
              status         = 'E'
              mensagem       = |Cliente { <ls_cliente>-partnermatriz } pertence à classe { <ls_cliente>-riskclass } (excluída) e não pode ser bloqueado.|
              risk_class     = <ls_cliente>-riskclass
              moeda          = <ls_cliente>-moeda
              vlr_vencido    = <ls_cliente>-valortotalvencido
              dias_atraso    = <ls_cliente>-diasatraso
              created_by     = sy-uname
              created_at     = utclong_current( )
            ) TO lt_log.
          CATCH cx_uuid_error.
        ENDTRY.

        APPEND VALUE #( %tky = <ls_cliente>-%tky ) TO failed-clienteinadimplente.
        APPEND VALUE #(
          %tky = <ls_cliente>-%tky
          %msg = new_message_with_text(
            severity = if_abap_behv_message=>severity-warning
            text     = |Cliente { <ls_cliente>-partnermatriz } pertence à classe { <ls_cliente>-riskclass } (excluída) e não pode ser bloqueado.|
          )
        ) TO reported-clienteinadimplente.

        APPEND VALUE #( %tky   = <ls_cliente>-%tky
                        %param = <ls_cliente> ) TO result.
        CONTINUE.
      ENDIF.

      obter_grupo_economico(
        EXPORTING
          iv_partner   = <ls_cliente>-PartnerMatriz
        IMPORTING
          ev_matriz    = DATA(lv_matriz)
          et_parceiros = DATA(lt_grupo) ).

      LOOP AT lt_grupo INTO DATA(lv_bp_membro).
        READ TABLE lt_resultados_membros ASSIGNING FIELD-SYMBOL(<ls_res_existente>)
          WITH TABLE KEY partner      = lv_bp_membro
                         credit_sgmnt = <ls_cliente>-CreditSegment.
        IF sy-subrc = 0.
          IF <ls_res_existente>-ok = abap_true.
            lv_bloqueio_ok = abap_true.
          ENDIF.
          CONTINUE.
        ENDIF.

        INSERT VALUE #(
          partner      = lv_bp_membro
          credit_sgmnt = <ls_cliente>-CreditSegment
          ok           = abap_false
        ) INTO TABLE lt_resultados_membros ASSIGNING FIELD-SYMBOL(<ls_res_membro>).

        CLEAR lv_risk_class_membro.
        SELECT SINGLE risk_class
          FROM ukmbp_cms
          WHERE partner = @lv_bp_membro
          INTO @lv_risk_class_membro.

        IF lv_risk_class_membro IS NOT INITIAL AND lv_risk_class_membro IN lr_classes_excluidas.
          TRY.
              APPEND VALUE #(
                log_id         = cl_system_uuid=>create_uuid_x16_static( )
                partner        = lv_bp_membro
                partner_origem = <ls_cliente>-PartnerOrigem
                credit_sgmnt   = <ls_cliente>-CreditSegment
                acao           = gc_acao_bloquear
                block_reason   = space
                status         = 'E'
                mensagem       = |Cliente { lv_bp_membro } pertence à classe { lv_risk_class_membro } (excluída) e não pode ser bloqueado.|
                risk_class     = lv_risk_class_membro
                moeda          = <ls_cliente>-Moeda
                vlr_vencido    = <ls_cliente>-ValorTotalVencido
                dias_atraso    = <ls_cliente>-DiasAtraso
                created_by     = sy-uname
                created_at     = utclong_current( )
              ) TO lt_log.
            CATCH cx_uuid_error.
          ENDTRY.
          CONTINUE.
        ENDIF.

        TRY.
            DATA(lo_account) = CAST cl_ukm_account(
              lo_bupa_factory->get_credit_account(
                i_partner      = lv_bp_membro
                i_credit_sgmnt = <ls_cliente>-CreditSegment ) ).

            lo_account->get_bp_cms_sgm( IMPORTING es_bp_cms_sgm = DATA(ls_sgm) ).

            IF ls_sgm-xblocked = abap_true.
              IF ls_sgm-block_reason <> gc_motivo_inadimplencia.
                MESSAGE ID 'ZFI_INADIMPLENCIA' TYPE 'W' NUMBER '006'
                  WITH lv_bp_membro ls_sgm-block_reason
                  INTO DATA(lv_msg_bloq_006).

                APPEND VALUE #(
                  log_id         = cl_system_uuid=>create_uuid_x16_static( )
                  partner        = lv_bp_membro
                  partner_origem = <ls_cliente>-PartnerOrigem
                  credit_sgmnt   = <ls_cliente>-CreditSegment
                  acao           = gc_acao_bloquear
                  block_reason   = ls_sgm-block_reason
                  status         = 'E'
                  mensagem       = lv_msg_bloq_006
                  risk_class     = COND #( WHEN lv_risk_class_membro IS NOT INITIAL
                                           THEN lv_risk_class_membro
                                           ELSE <ls_cliente>-RiskClass )
                  moeda          = <ls_cliente>-Moeda
                  vlr_vencido    = <ls_cliente>-ValorTotalVencido
                  dias_atraso    = <ls_cliente>-DiasAtraso
                  created_by     = sy-uname
                  created_at     = utclong_current( )
                ) TO lt_log.
              ELSE.
                APPEND VALUE #(
                  log_id         = cl_system_uuid=>create_uuid_x16_static( )
                  partner        = lv_bp_membro
                  partner_origem = <ls_cliente>-PartnerOrigem
                  credit_sgmnt   = <ls_cliente>-CreditSegment
                  acao           = gc_acao_bloquear
                  block_reason   = ls_sgm-block_reason
                  status         = 'S'
                  mensagem       = |Cliente { lv_bp_membro } já se encontra bloqueado por inadimplência (Motivo { gc_motivo_inadimplencia }).|
                  risk_class     = COND #( WHEN lv_risk_class_membro IS NOT INITIAL
                                           THEN lv_risk_class_membro
                                           ELSE <ls_cliente>-RiskClass )
                  moeda          = <ls_cliente>-Moeda
                  vlr_vencido    = <ls_cliente>-ValorTotalVencido
                  dias_atraso    = <ls_cliente>-DiasAtraso
                  created_by     = sy-uname
                  created_at     = utclong_current( )
                ) TO lt_log.
                <ls_res_membro>-ok = abap_true.
                lv_bloqueio_ok     = abap_true.
              ENDIF.
              CONTINUE.
            ENDIF.

            ls_sgm-xblocked     = abap_true.
            ls_sgm-block_reason = gc_motivo_inadimplencia.
            lo_account->set_bp_cms_sgm( EXPORTING is_bp_cms_sgm = ls_sgm ).

            APPEND VALUE #(
              log_id         = cl_system_uuid=>create_uuid_x16_static( )
              partner        = lv_bp_membro
              partner_origem = <ls_cliente>-PartnerOrigem
              credit_sgmnt   = <ls_cliente>-CreditSegment
              acao           = gc_acao_bloquear
              block_reason   = gc_motivo_inadimplencia
              status         = 'S'
              mensagem       = COND #( WHEN lv_bp_membro = <ls_cliente>-PartnerMatriz
                                       THEN 'Cliente bloqueado com sucesso.'
                                       ELSE |Bloqueio em cascata (Grupo Matriz { lv_matriz }).| )
              risk_class     = COND #( WHEN lv_risk_class_membro IS NOT INITIAL
                                       THEN lv_risk_class_membro
                                       ELSE <ls_cliente>-RiskClass )
              moeda          = <ls_cliente>-Moeda
              vlr_vencido    = <ls_cliente>-ValorTotalVencido
              dias_atraso    = <ls_cliente>-DiasAtraso
              created_by     = sy-uname
              created_at     = utclong_current( )
            ) TO lt_log.

            <ls_res_membro>-ok = abap_true.
            lv_bloqueio_ok     = abap_true.

          CATCH cx_root INTO DATA(lx_erro_membro).
            TRY.
                APPEND VALUE #(
                  log_id         = cl_system_uuid=>create_uuid_x16_static( )
                  partner        = lv_bp_membro
                  partner_origem = <ls_cliente>-PartnerOrigem
                  credit_sgmnt   = <ls_cliente>-CreditSegment
                  acao           = gc_acao_bloquear
                  block_reason   = gc_motivo_inadimplencia
                  status         = 'E'
                  mensagem       = lx_erro_membro->get_text( )
                  risk_class     = COND #( WHEN lv_risk_class_membro IS NOT INITIAL
                                           THEN lv_risk_class_membro
                                           ELSE <ls_cliente>-RiskClass )
                  moeda          = <ls_cliente>-Moeda
                  vlr_vencido    = <ls_cliente>-ValorTotalVencido
                  dias_atraso    = <ls_cliente>-DiasAtraso
                  created_by     = sy-uname
                  created_at     = utclong_current( )
                ) TO lt_log.
              CATCH cx_uuid_error.
            ENDTRY.
        ENDTRY.
      ENDLOOP.

      IF lv_bloqueio_ok = abap_true.
        <ls_cliente>-IsBlocked   = abap_true.
        <ls_cliente>-BlockReason = gc_motivo_inadimplencia.

        APPEND VALUE #(
          %tky = <ls_cliente>-%tky
          %msg = new_message(
            id       = 'ZFI_INADIMPLENCIA'
            number   = '001'
            severity = if_abap_behv_message=>severity-success
            v1       = <ls_cliente>-PartnerMatriz
            v2       = <ls_cliente>-CreditSegment
          )
        ) TO reported-clienteinadimplente.
      ELSE.
        APPEND VALUE #( %tky = <ls_cliente>-%tky ) TO failed-clienteinadimplente.
        APPEND VALUE #(
          %tky = <ls_cliente>-%tky
          %msg = new_message_with_text(
            severity = if_abap_behv_message=>severity-error
            text     = |Erro ao bloquear cliente { <ls_cliente>-PartnerMatriz } ou filiais do grupo.|
          )
        ) TO reported-clienteinadimplente.
      ENDIF.

      APPEND VALUE #( %tky   = <ls_cliente>-%tky
                      %param = <ls_cliente> ) TO result.
    ENDLOOP.

    APPEND LINES OF lt_log TO gt_log.
  ENDMETHOD.

  METHOD desbloquearCliente.
    DATA lt_log                TYPE STANDARD TABLE OF ztfi_log_inadimp.
    DATA lt_resultados_membros TYPE tt_resultado_membro.
    DATA lv_desbloqueio_ok     TYPE abap_bool.

    READ ENTITIES OF zi_fi_cliente_inadimplente IN LOCAL MODE
      ENTITY ClienteInadimplente
      ALL FIELDS WITH CORRESPONDING #( keys )
      RESULT DATA(lt_clientes).

    DATA(lo_bupa_factory) = cl_ukm_bupa_factory=>create( ).

    LOOP AT lt_clientes ASSIGNING FIELD-SYMBOL(<ls_cliente>).
      lv_desbloqueio_ok = abap_false.

      obter_grupo_economico(
        EXPORTING
          iv_partner   = <ls_cliente>-PartnerMatriz
        IMPORTING
          ev_matriz    = DATA(lv_matriz_desb)
          et_parceiros = DATA(lt_grupo_desb) ).

      LOOP AT lt_grupo_desb INTO DATA(lv_bp_membro_desb).
        READ TABLE lt_resultados_membros ASSIGNING FIELD-SYMBOL(<ls_res_existente>)
          WITH TABLE KEY partner      = lv_bp_membro_desb
                         credit_sgmnt = <ls_cliente>-CreditSegment.
        IF sy-subrc = 0.
          IF <ls_res_existente>-ok = abap_true.
            lv_desbloqueio_ok = abap_true.
          ENDIF.
          CONTINUE.
        ENDIF.

        INSERT VALUE #(
          partner      = lv_bp_membro_desb
          credit_sgmnt = <ls_cliente>-CreditSegment
          ok           = abap_false
        ) INTO TABLE lt_resultados_membros ASSIGNING FIELD-SYMBOL(<ls_res_membro>).

        TRY.
            DATA(lo_account) = CAST cl_ukm_account(
              lo_bupa_factory->get_credit_account(
                i_partner      = lv_bp_membro_desb
                i_credit_sgmnt = <ls_cliente>-CreditSegment ) ).

            lo_account->get_bp_cms_sgm( IMPORTING es_bp_cms_sgm = DATA(ls_sgm) ).

            IF ls_sgm-xblocked = abap_true AND ls_sgm-block_reason <> gc_motivo_inadimplencia.
              MESSAGE ID 'ZFI_INADIMPLENCIA' TYPE 'W' NUMBER '006'
                WITH lv_bp_membro_desb ls_sgm-block_reason
                INTO DATA(lv_msg_desb_006).

              APPEND VALUE #(
                log_id         = cl_system_uuid=>create_uuid_x16_static( )
                partner        = lv_bp_membro_desb
                partner_origem = <ls_cliente>-PartnerOrigem
                credit_sgmnt   = <ls_cliente>-CreditSegment
                acao           = gc_acao_desbloquear
                block_reason   = ls_sgm-block_reason
                status         = 'E'
                mensagem       = lv_msg_desb_006
                risk_class     = <ls_cliente>-RiskClass
                moeda          = <ls_cliente>-Moeda
                vlr_vencido    = <ls_cliente>-ValorTotalVencido
                dias_atraso    = <ls_cliente>-DiasAtraso
                created_by     = sy-uname
                created_at     = utclong_current( )
              ) TO lt_log.
              CONTINUE.
            ENDIF.

            ls_sgm-xblocked     = abap_false.
            CLEAR ls_sgm-block_reason.
            lo_account->set_bp_cms_sgm( EXPORTING is_bp_cms_sgm = ls_sgm ).

            APPEND VALUE #(
              log_id         = cl_system_uuid=>create_uuid_x16_static( )
              partner        = lv_bp_membro_desb
              partner_origem = <ls_cliente>-PartnerOrigem
              credit_sgmnt   = <ls_cliente>-CreditSegment
              acao           = gc_acao_desbloquear
              block_reason   = space
              status         = 'S'
              mensagem       = COND #( WHEN lv_bp_membro_desb = <ls_cliente>-PartnerMatriz
                                       THEN 'Cliente desbloqueado com sucesso.'
                                       ELSE |Desbloqueio em cascata (Grupo Econômico Matriz { lv_matriz_desb }).| )
              risk_class     = <ls_cliente>-RiskClass
              moeda          = <ls_cliente>-Moeda
              vlr_vencido    = <ls_cliente>-ValorTotalVencido
              dias_atraso    = <ls_cliente>-DiasAtraso
              created_by     = sy-uname
              created_at     = utclong_current( )
            ) TO lt_log.

            <ls_res_membro>-ok = abap_true.
            lv_desbloqueio_ok  = abap_true.

          CATCH cx_root INTO DATA(lx_erro_desb).
            TRY.
                APPEND VALUE #(
                  log_id         = cl_system_uuid=>create_uuid_x16_static( )
                  partner        = lv_bp_membro_desb
                  partner_origem = <ls_cliente>-PartnerOrigem
                  credit_sgmnt   = <ls_cliente>-CreditSegment
                  acao           = gc_acao_desbloquear
                  block_reason   = space
                  status         = 'E'
                  mensagem       = lx_erro_desb->get_text( )
                  risk_class     = <ls_cliente>-RiskClass
                  moeda          = <ls_cliente>-Moeda
                  vlr_vencido    = <ls_cliente>-ValorTotalVencido
                  dias_atraso    = <ls_cliente>-DiasAtraso
                  created_by     = sy-uname
                  created_at     = utclong_current( )
                ) TO lt_log.
              CATCH cx_uuid_error.
            ENDTRY.
        ENDTRY.
      ENDLOOP.

      IF lv_desbloqueio_ok = abap_true.
        <ls_cliente>-IsBlocked   = abap_false.
        CLEAR <ls_cliente>-BlockReason.

        APPEND VALUE #(
          %tky = <ls_cliente>-%tky
          %msg = new_message(
            id       = 'ZFI_INADIMPLENCIA'
            number   = '002'
            severity = if_abap_behv_message=>severity-success
            v1       = <ls_cliente>-PartnerMatriz
            v2       = <ls_cliente>-CreditSegment
          )
        ) TO reported-clienteinadimplente.
      ELSE.
        APPEND VALUE #( %tky = <ls_cliente>-%tky ) TO failed-clienteinadimplente.
        APPEND VALUE #(
          %tky = <ls_cliente>-%tky
          %msg = new_message_with_text(
            severity = if_abap_behv_message=>severity-error
            text     = |Erro ao desbloquear cliente { <ls_cliente>-PartnerMatriz } ou filiais do grupo.|
          )
        ) TO reported-clienteinadimplente.
      ENDIF.

      APPEND VALUE #( %tky   = <ls_cliente>-%tky
                      %param = <ls_cliente> ) TO result.
    ENDLOOP.

    APPEND LINES OF lt_log TO gt_log.
  ENDMETHOD.

  METHOD lock.
    DATA lt_return    TYPE bapiret2_t.
    DATA ls_erro      TYPE bapiret2.
    DATA lv_enq_subrc TYPE sy-subrc.

    LOOP AT keys ASSIGNING FIELD-SYMBOL(<ls_key>).
      obter_grupo_economico(
        EXPORTING
          iv_partner   = <ls_key>-PartnerMatriz
        IMPORTING
          et_parceiros = DATA(lt_grupo) ).

      LOOP AT lt_grupo INTO DATA(lv_bp_membro).
        CLEAR: lt_return, ls_erro.
        CALL FUNCTION 'BUPA_ENQUEUE'
          EXPORTING
            iv_partner      = lv_bp_membro
          TABLES
            et_return       = lt_return
          EXCEPTIONS
            blocked_partner = 1
            OTHERS          = 2.
        lv_enq_subrc = sy-subrc.

        READ TABLE lt_return INTO ls_erro WITH KEY type = 'E'.
        IF sy-subrc <> 0.
          READ TABLE lt_return INTO ls_erro WITH KEY type = 'A'.
        ENDIF.

        IF ls_erro IS NOT INITIAL OR lv_enq_subrc <> 0.
          LOOP AT lt_grupo INTO DATA(lv_bp_unlock).
            CLEAR lt_return.
            CALL FUNCTION 'BUPA_DEQUEUE'
              EXPORTING
                iv_partner = lv_bp_unlock
              TABLES
                et_return  = lt_return.
          ENDLOOP.

          APPEND VALUE #( %tky        = CORRESPONDING #( <ls_key> )
                          %fail-cause = if_abap_behv=>cause-locked ) TO failed-clienteinadimplente.

          IF ls_erro-id IS NOT INITIAL AND ls_erro-number IS NOT INITIAL.
            APPEND VALUE #( %tky = CORRESPONDING #( <ls_key> )
                            %msg = new_message(
                              id       = ls_erro-id
                              number   = ls_erro-number
                              severity = if_abap_behv_message=>severity-error
                              v1       = ls_erro-message_v1
                              v2       = ls_erro-message_v2
                              v3       = ls_erro-message_v3
                              v4       = ls_erro-message_v4 ) ) TO reported-clienteinadimplente.
          ELSE.
            APPEND VALUE #( %tky = CORRESPONDING #( <ls_key> )
                            %msg = new_message(
                              id       = 'ZFI_INADIMPLENCIA'
                              number   = '003'
                              severity = if_abap_behv_message=>severity-error
                              v1       = <ls_key>-PartnerMatriz
                              v2       = lv_bp_membro ) ) TO reported-clienteinadimplente.
          ENDIF.
          EXIT.
        ENDIF.
      ENDLOOP.
    ENDLOOP.
  ENDMETHOD.

  METHOD read.
    SELECT *
      FROM zi_fi_cliente_inadimplente
      FOR ALL ENTRIES IN @keys
      WHERE PartnerMatriz = @keys-PartnerMatriz
        AND CreditSegment = @keys-CreditSegment
        AND PartnerOrigem = @keys-PartnerOrigem
      INTO TABLE @DATA(lt_dados).
    result = CORRESPONDING #( lt_dados ).
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
    IF lhc_clienteinadimplente=>gt_log IS NOT INITIAL.
      cl_ukm_bupa_factory=>create( )->save_all(
        EXPORTING
          i_upd_task = abap_true
        EXCEPTIONS
          failed     = 1
          OTHERS     = 2 ).
      IF sy-subrc = 0.
        DATA(lt_log_save) = lhc_clienteinadimplente=>gt_log.
        INSERT ztfi_log_inadimp FROM TABLE @lt_log_save.
      ENDIF.
    ENDIF.
  ENDMETHOD.

  METHOD cleanup.
    cl_ukm_bupa_factory=>create( )->free_all( ).
    CLEAR lhc_clienteinadimplente=>gt_log.
  ENDMETHOD.

  METHOD cleanup_finalize.
    cleanup( ).
  ENDMETHOD.
ENDCLASS.
```
