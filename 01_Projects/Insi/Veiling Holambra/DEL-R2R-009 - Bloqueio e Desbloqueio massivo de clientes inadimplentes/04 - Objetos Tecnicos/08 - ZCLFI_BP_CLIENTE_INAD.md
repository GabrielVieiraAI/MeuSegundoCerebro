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
7. **Tratamento Direcionado de Exceções e Geração Segura de UUID (`CR-109`):** A geração do identificador único de auditoria (`log_id`) é centralizada no método auxiliar `gerar_uuid_log`, que captura `cx_uuid_error` e propaga eventual falha diretamente em `reported` (mensagem `003` da `[[03 - ZFI_INADIMPLENCIA|ZFI_INADIMPLENCIA]]`) sem silenciar perdas de log. As chamadas ao **FSCM** validam previamente a existência da conta de crédito via `validar_conta_credito` (`io_account->check_existence` convertida em `cx_ukm_commons` com mensagens da classe `UKM_COMM`) e as consultas à `zclca_tabela_parametros` capturam especificamente `zcxca_tabela_parametros`, eliminando blocos `CATCH cx_root` genéricos.

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
"! <p class="shorttext synchronized">Behavior Implementation for ZI_FI_CLIENTE_INADIMPLENTE</p>
"! <p>Behavior Pool responsável pela implementação <em>unmanaged</em> do objeto
"! de negócio RAP <strong>ZI_FI_CLIENTE_INADIMPLENTE</strong>, orquestrando autorização,
"! bloqueio e desbloqueio de crédito em massa por grupo econômico no FSCM.</p>
CLASS zclfi_bp_cliente_inad DEFINITION PUBLIC ABSTRACT FINAL FOR BEHAVIOR OF zi_fi_cliente_inadimplente. " Casca pública do Behavior Pool com cabeçalho ABAP Doc (CR-116)
ENDCLASS.

CLASS zclfi_bp_cliente_inad IMPLEMENTATION.
ENDCLASS.
```

#### Aba: Local Types / CCIMP (`zclfi_bp_cliente_inad.clas.implementations.abap`)

```abap
"! <p class="shorttext synchronized">Behavior Handler para clientes inadimplentes</p>
"! <p>Controla autorizações por instância, leitura, bloqueio lógico e ações de
"! bloqueio/desbloqueio em massa por grupo econômico no FSCM, além da resolução
"! da estrutura Matriz/Filial na tabela BUT050.</p>
CLASS lhc_clienteinadimplente DEFINITION INHERITING FROM cl_abap_behavior_handler.
  PUBLIC SECTION.
    TYPES tt_partner TYPE STANDARD TABLE OF bu_partner WITH DEFAULT KEY.               " Tabela auxiliar para os BPs do grupo econômico (exposta na PUBLIC SECTION local para acesso em CCAU - CR-116)

    CLASS-DATA gt_log TYPE STANDARD TABLE OF ztfi_log_inadimp WITH DEFAULT KEY.        " Buffer compartilhado de auditoria entre ações e fase de save (CR-104)

    "! <p class="shorttext synchronized">Identifica matriz e membros do grupo econômico</p>
    "! <p>Resolve a hierarquia Matriz/Filial na tabela <strong>BUT050</strong> utilizando o tipo
    "! de relacionamento parametrizado em <em>RELTYP/GRUPO</em> (fallback 'UKM001'), com
    "! ordenação determinística pela relação mais recente quando consultado por uma filial,
    "! retornando o próprio parceiro como individual caso não possua vínculo.</p>
    "! @parameter iv_partner | Número do parceiro de negócios de entrada
    "! @parameter ev_matriz | Parceiro matriz identificado para o grupo econômico
    "! @parameter et_parceiros | Lista única e ordenada dos parceiros pertencentes ao grupo
    CLASS-METHODS obter_grupo_economico                                                " Método estático (CLASS-METHODS) para permitir teste direto em CCAU sem instanciar Behavior Handler (CR-116)
      IMPORTING
        iv_partner   TYPE bu_partner
      EXPORTING
        ev_matriz    TYPE bu_partner
        et_parceiros TYPE tt_partner.

  PRIVATE SECTION.
    TYPES:
      ty_reported_cli    TYPE TABLE FOR REPORTED EARLY zi_fi_cliente_inadimplente,     " Tabela tipada de retorno de mensagens RAP (CR-109)
      ty_reported_cli_ls TYPE STRUCTURE FOR REPORTED EARLY zi_fi_cliente_inadimplente, " Estrutura de linha de reported para extrair %tky (CR-109)
      ty_tky_cli         TYPE ty_reported_cli_ls-%tky,                                 " Tipo exato da chave transacional %tky (CR-109)
      BEGIN OF ty_resultado_membro,                                                    " Estrutura para guardar o desfecho real por parceiro e segmento (CR-103)
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

    "! <p class="shorttext synchronized">Valida autorizações de bloqueio e desbloqueio</p>
    "! <p>Verifica permissões no objeto <strong>ZFI_BLOQ</strong> (atividades 05 e 43)
    "! por empresa e segmento de crédito, usando empresa padrão parametrizada como
    "! fallback quando não houver empresa informada na instância.</p>
    "! @parameter keys | Chaves das instâncias a autorizar
    "! @parameter requested_authorizations | Ações solicitadas para verificação
    "! @parameter result | Tabela com o resultado de autorização por instância
    METHODS get_instance_authorizations FOR INSTANCE AUTHORIZATION
      IMPORTING keys REQUEST requested_authorizations FOR ClienteInadimplente RESULT result.

    "! <p class="shorttext synchronized">Bloqueia clientes inadimplentes no FSCM por grupo</p>
    "! <p>Executa o bloqueio de crédito em massa no FSCM com motivo '10', validando
    "! classes de risco excluídas, propagando o bloqueio em cascata no grupo econômico
    "! sem sobrescrever bloqueios externos, acumulando registros em <em>gt_log</em> e
    "! preenchendo os parâmetros implícitos <em>failed</em>, <em>reported</em> e <em>result</em>.</p>
    "! @parameter keys | Chaves dos clientes selecionados para bloqueio
    "! @parameter result | Instâncias atualizadas retornadas ao framework RAP
    METHODS bloquearCliente FOR MODIFY
      IMPORTING keys FOR ACTION ClienteInadimplente~bloquearCliente RESULT result.

    "! <p class="shorttext synchronized">Desbloqueia clientes por inadimplência em grupo</p>
    "! <p>Executa o desbloqueio de crédito em massa no FSCM em cascata no grupo econômico
    "! exclusivamente quando o motivo de bloqueio vigente é '10', preservando bloqueios
    "! externos, acumulando registros em <em>gt_log</em> e preenchendo os parâmetros
    "! implícitos <em>failed</em>, <em>reported</em> e <em>result</em>.</p>
    "! @parameter keys | Chaves dos clientes selecionados para desbloqueio
    "! @parameter result | Instâncias atualizadas retornadas ao framework RAP
    METHODS desbloquearCliente FOR MODIFY
      IMPORTING keys FOR ACTION ClienteInadimplente~desbloquearCliente RESULT result.

    "! <p class="shorttext synchronized">Lê dados atuais dos clientes inadimplentes</p>
    "! <p>Recupera os registros na CDS <strong>ZI_FI_CLIENTE_INADIMPLENTE</strong> pela chave
    "! tripla (PartnerMatriz, CreditSegment, PartnerOrigem), tratando chamadas com tabela
    "! vazia e sinalizando <em>failed</em> (cause-not_found) para chaves inexistentes.</p>
    "! @parameter keys | Chaves dos clientes solicitados para leitura
    "! @parameter result | Dados lidos retornados ao runtime RAP
    METHODS read FOR READ
      IMPORTING keys FOR READ ClienteInadimplente RESULT result.

    "! <p class="shorttext synchronized">Bloqueia logicamente os parceiros do grupo econômico</p>
    "! <p>Aplica enfileiramento transacional via <em>BUPA_ENQUEUE</em> para todos os
    "! membros do grupo econômico antes de modificações, executando <em>BUPA_DEQUEUE</em>
    "! e preenchendo <em>failed</em> (cause-locked) e <em>reported</em> em caso de contenção.</p>
    "! @parameter keys | Chaves das instâncias a bloquear logicamente
    METHODS lock FOR LOCK
      IMPORTING keys FOR LOCK ClienteInadimplente.

    "! <p class="shorttext synchronized">Gera UUID único para registro na tabela de log</p>
    "! <p>Cria identificador único de 16 bytes para auditoria e, em caso de falha na
    "! geração, registra a mensagem de erro 003 da classe <em>ZFI_INADIMPLENCIA</em>
    "! em <em>ct_reported</em>.</p>
    "! @parameter is_tky | Chave transacional da instância RAP associada
    "! @parameter iv_partner | Parceiro relacionado ao registro de log
    "! @parameter ct_reported | Tabela de mensagens RAP para reporte de falha na geração
    "! @parameter rv_log_id | UUID gerado ou valor inicial em caso de erro
    METHODS gerar_uuid_log
      IMPORTING
        is_tky           TYPE ty_tky_cli
        iv_partner       TYPE bu_partner
      CHANGING
        ct_reported      TYPE ty_reported_cli
      RETURNING
        VALUE(rv_log_id) TYPE sysuuid_x16.

    "! <p class="shorttext synchronized">Valida existência da conta de crédito no FSCM</p>
    "! <p>Verifica se a referência da conta de crédito está instanciada e confirma sua
    "! existência para o parceiro e segmento via <em>check_existence</em>, lançando
    "! exceção tipada em caso de inconsistência.</p>
    "! @parameter io_account | Instância da conta de crédito FSCM a validar
    "! @parameter iv_partner | Parceiro de negócios avaliado
    "! @parameter iv_credit_sgmnt | Segmento de crédito avaliado
    "! @raising cx_ukm_commons | Conta de crédito inexistente ou inválida no segmento informado
    METHODS validar_conta_credito
      IMPORTING
        io_account      TYPE REF TO cl_ukm_account
        iv_partner      TYPE bu_partner
        iv_credit_sgmnt TYPE ukm_credit_sgmnt
      RAISING
        cx_ukm_commons.
ENDCLASS.

CLASS lhc_clienteinadimplente IMPLEMENTATION.

  METHOD get_instance_authorizations.
    DATA lv_bukrs_padrao TYPE bukrs.
    DATA lv_company_code TYPE bukrs.

    " Carrega empresa parametrizada apenas como fallback defensivo (captura específica CR-109)
    TRY.
        zclca_tabela_parametros=>get_instance( )->m_get_single(
          EXPORTING
            iv_modulo = 'FI'
            iv_chave1 = 'DEL_R2R_009'
            iv_chave2 = 'BUKRS'
            iv_chave3 = 'EMPRESA'
          IMPORTING
            ev_param  = lv_bukrs_padrao ).
      CATCH zcxca_tabela_parametros.
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
      READ TABLE lt_clientes INTO ls_cli_auth WITH KEY id COMPONENTS %tky = <ls_key>-%tky.
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

    " Obtém o tipo de vínculo Matriz x Filial na tabela corporativa de parâmetros (CR-105 / CR-109)
    TRY.
        zclca_tabela_parametros=>get_instance( )->m_get_range(
          EXPORTING
            iv_modulo = 'FI'
            iv_chave1 = 'DEL_R2R_009'
            iv_chave2 = 'RELTYP'
            iv_chave3 = 'GRUPO'
          IMPORTING
            et_range  = lr_reltyp ).
      CATCH zcxca_tabela_parametros.
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

    " Caso 2: O parceiro informado é uma filial (busca sua Matriz vigente mais recente de forma determinística e todas as irmãs — CR-115)
    SELECT partner1
      FROM but050
      WHERE partner2 = @iv_partner
        AND reltyp   IN @lr_reltyp
      ORDER BY date_to DESCENDING, date_from DESCENDING, partner1 ASCENDING
      INTO TABLE @DATA(lt_matrizes)
      UP TO 1 ROWS.

    IF lt_matrizes IS NOT INITIAL.
      DATA(lv_matriz_encontrada) = lt_matrizes[ 1 ]-partner1.
      IF lv_matriz_encontrada IS NOT INITIAL.
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
    ENDIF.

    " Caso 3: Parceiro individual sem vínculo de grupo econômico
    ev_matriz = iv_partner.
    APPEND iv_partner TO et_parceiros.
  ENDMETHOD.

  METHOD gerar_uuid_log.
    " Centraliza a criação do UUID e reporta falha técnica em ct_reported para eliminar CATCH vazio (CR-109)
    TRY.
        rv_log_id = cl_system_uuid=>create_uuid_x16_static( ).
      CATCH cx_uuid_error INTO DATA(lx_uuid_error).
        DATA(lv_msg_uuid) = CONV symsgv( lx_uuid_error->get_text( ) ).
        APPEND VALUE #(
          %tky = is_tky
          %msg = new_message(
            id       = 'ZFI_INADIMPLENCIA'
            number   = '003'
            severity = if_abap_behv_message=>severity-error
            v1       = iv_partner
            v2       = lv_msg_uuid
          )
        ) TO ct_reported.
    ENDTRY.
  ENDMETHOD.

  METHOD validar_conta_credito.
    " Confere existência de parceiro/conta de crédito no FSCM convertendo em exceção cx_ukm_commons (CR-109)
    IF io_account IS NOT BOUND.
      RAISE EXCEPTION TYPE cx_ukm_commons
        MESSAGE ID 'UKM_COMM' TYPE 'E' NUMBER '008'
        WITH iv_partner iv_credit_sgmnt.
    ENDIF.

    io_account->check_existence(
      EXCEPTIONS
        unknown_partner             = 1
        unknown_segment             = 2
        initial_master_data_partner = 3
        initial_master_data_segment = 4
        OTHERS                      = 5 ).

    CASE sy-subrc.
      WHEN 0.
        RETURN.
      WHEN 1.
        RAISE EXCEPTION TYPE cx_ukm_commons
          MESSAGE ID 'UKM_COMM' TYPE 'E' NUMBER '006'
          WITH iv_partner.
      WHEN 2.
        RAISE EXCEPTION TYPE cx_ukm_commons
          MESSAGE ID 'UKM_COMM' TYPE 'E' NUMBER '005'
          WITH iv_credit_sgmnt.
      WHEN 3.
        RAISE EXCEPTION TYPE cx_ukm_commons
          MESSAGE ID 'UKM_COMM' TYPE 'E' NUMBER '007'
          WITH iv_partner.
      WHEN OTHERS.
        RAISE EXCEPTION TYPE cx_ukm_commons
          MESSAGE ID 'UKM_COMM' TYPE 'E' NUMBER '008'
          WITH iv_partner iv_credit_sgmnt.
    ENDCASE.
  ENDMETHOD.

  METHOD bloquearCliente.
    DATA lt_log                TYPE STANDARD TABLE OF ztfi_log_inadimp. " Tabela interna para acúmulo dos logs de auditoria
    DATA lr_classes_excluidas  TYPE RANGE OF ukm_risk_class.            " Range para classes desconsideradas (ex: CVH Interna)
    DATA lt_resultados_membros TYPE tt_resultado_membro.                " Armazena o resultado real (sucesso/falha) de cada membro por segmento no lote (CR-103)
    DATA lv_risk_class_membro  TYPE ukm_risk_class.                    " Classe de risco individual do membro consultada na UKMBP_CMS
    DATA lv_bloqueio_ok        TYPE abap_bool.                         " Flag declarada fora do LOOP para evitar retenção estática entre iterações (CR-103)
    DATA lv_msg_log            TYPE ztfi_log_inadimp-mensagem.          " Texto formatado pela ZFI_INADIMPLENCIA para gravação no log (CR-108)
    DATA lv_msg_erro_det       TYPE symsgv.                            " Detalhe resumido da última falha técnica no grupo (CR-108)
    DATA lv_bp_motivo_dif      TYPE bu_partner.                        " Primeiro BP impedido por bloqueio de outro motivo (CR-108)
    DATA lv_motivo_dif         TYPE ukm_block_reason.                  " Código do motivo de bloqueio externo encontrado (CR-108)
    DATA lv_bp_classe_excl     TYPE bu_partner.                        " Primeiro BP impedido por classe de risco excluída (CR-108)
    DATA lv_classe_excl        TYPE ukm_risk_class.                    " Classe de risco excluída encontrada (CR-108)
    DATA lv_log_id             TYPE sysuuid_x16.                       " UUID gerado uma vez por linha de log via gerar_uuid_log (CR-109)

    " Lê a tabela de parâmetros corporativa da Veiling via instância oficial (captura específica CR-109)
    TRY.
        zclca_tabela_parametros=>get_instance( )->m_get_range(
          EXPORTING
            iv_modulo = 'FI'
            iv_chave1 = 'DEL_R2R_009'
            iv_chave2 = 'RISK_CLASS'
            iv_chave3 = 'EXCLUIR'
          IMPORTING
            et_range  = lr_classes_excluidas ).
      CATCH zcxca_tabela_parametros.
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
      CLEAR: lv_msg_log, lv_msg_erro_det, lv_bp_motivo_dif, lv_motivo_dif, lv_bp_classe_excl, lv_classe_excl.

      " Validação defensiva: se a classe de risco for excluída (ex: conta interna), não bloqueia
      IF <ls_cliente>-RiskClass IN lr_classes_excluidas.
        MESSAGE ID 'ZFI_INADIMPLENCIA' TYPE 'W' NUMBER '007'
          WITH <ls_cliente>-PartnerMatriz <ls_cliente>-RiskClass
          INTO lv_msg_log.

        lv_log_id = gerar_uuid_log(
          EXPORTING
            is_tky      = <ls_cliente>-%tky
            iv_partner  = <ls_cliente>-PartnerMatriz
          CHANGING
            ct_reported = reported-clienteinadimplente ).

        IF lv_log_id IS NOT INITIAL.
          APPEND VALUE #(
            log_id         = lv_log_id
            partner        = <ls_cliente>-partnermatriz
            partner_origem = <ls_cliente>-partnerorigem
            credit_sgmnt   = <ls_cliente>-creditsegment
            acao           = gc_acao_bloquear
            block_reason   = space
            status         = 'E'
            mensagem       = lv_msg_log
            risk_class     = <ls_cliente>-riskclass
            moeda          = <ls_cliente>-moeda
            vlr_vencido    = <ls_cliente>-valortotalvencido
            dias_atraso    = <ls_cliente>-diasatraso
            created_by     = sy-uname
            created_at     = utclong_current( )
          ) TO lt_log.
        ENDIF.

        APPEND VALUE #( %tky = <ls_cliente>-%tky ) TO failed-clienteinadimplente.
        APPEND VALUE #(
          %tky = <ls_cliente>-%tky
          %msg = new_message(
            id       = 'ZFI_INADIMPLENCIA'
            number   = '007'
            severity = if_abap_behv_message=>severity-warning
            v1       = <ls_cliente>-PartnerMatriz
            v2       = <ls_cliente>-RiskClass
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

        " Gera o UUID uma única vez para o registro de auditoria deste membro (CR-109)
        lv_log_id = gerar_uuid_log(
          EXPORTING
            is_tky      = <ls_cliente>-%tky
            iv_partner  = lv_bp_membro
          CHANGING
            ct_reported = reported-clienteinadimplente ).

        " Checagem individual da classe de risco do membro na UKMBP_CMS (CR-102)
        CLEAR lv_risk_class_membro.
        SELECT SINGLE risk_class
          FROM ukmbp_cms
          WHERE partner = @lv_bp_membro
          INTO @lv_risk_class_membro.

        IF lv_risk_class_membro IS NOT INITIAL AND lv_risk_class_membro IN lr_classes_excluidas.
          MESSAGE ID 'ZFI_INADIMPLENCIA' TYPE 'W' NUMBER '007'
            WITH lv_bp_membro lv_risk_class_membro
            INTO lv_msg_log.
          IF lv_bp_classe_excl IS INITIAL.
            lv_bp_classe_excl = lv_bp_membro.
            lv_classe_excl    = lv_risk_class_membro.
          ENDIF.

          IF lv_log_id IS NOT INITIAL.
            APPEND VALUE #(
              log_id         = lv_log_id
              partner        = lv_bp_membro
              partner_origem = <ls_cliente>-PartnerOrigem
              credit_sgmnt   = <ls_cliente>-CreditSegment
              acao           = gc_acao_bloquear
              block_reason   = space
              status         = 'E'
              mensagem       = lv_msg_log
              risk_class     = lv_risk_class_membro
              moeda          = <ls_cliente>-Moeda
              vlr_vencido    = <ls_cliente>-ValorTotalVencido
              dias_atraso    = <ls_cliente>-DiasAtraso
              created_by     = sy-uname
              created_at     = utclong_current( )
            ) TO lt_log.
          ENDIF.
          CONTINUE.
        ENDIF.

        TRY.
            DATA(lo_account) = lo_bupa_factory->get_credit_account(
              i_partner      = lv_bp_membro
              i_credit_sgmnt = <ls_cliente>-CreditSegment ).

            validar_conta_credito(
              io_account      = lo_account
              iv_partner      = lv_bp_membro
              iv_credit_sgmnt = <ls_cliente>-CreditSegment ).

            lo_account->get_bp_cms_sgm( IMPORTING es_bp_cms_sgm = DATA(ls_sgm) ).

            " Proteção contra sobrescrita: não altera membro que já esteja bloqueado no FSCM (CR-102)
            IF ls_sgm-xblocked = abap_true.
              IF ls_sgm-block_reason <> gc_motivo_inadimplencia.
                MESSAGE ID 'ZFI_INADIMPLENCIA' TYPE 'W' NUMBER '006'
                  WITH lv_bp_membro ls_sgm-block_reason
                  INTO lv_msg_log.
                IF lv_bp_motivo_dif IS INITIAL.
                  lv_bp_motivo_dif = lv_bp_membro.
                  lv_motivo_dif    = ls_sgm-block_reason.
                ENDIF.

                IF lv_log_id IS NOT INITIAL.
                  APPEND VALUE #(
                    log_id         = lv_log_id
                    partner        = lv_bp_membro
                    partner_origem = <ls_cliente>-PartnerOrigem
                    credit_sgmnt   = <ls_cliente>-CreditSegment
                    acao           = gc_acao_bloquear
                    block_reason   = ls_sgm-block_reason
                    status         = 'E'
                    mensagem       = lv_msg_log
                    risk_class     = COND #( WHEN lv_risk_class_membro IS NOT INITIAL
                                             THEN lv_risk_class_membro
                                             ELSE <ls_cliente>-RiskClass )
                    moeda          = <ls_cliente>-Moeda
                    vlr_vencido    = <ls_cliente>-ValorTotalVencido
                    dias_atraso    = <ls_cliente>-DiasAtraso
                    created_by     = sy-uname
                    created_at     = utclong_current( )
                  ) TO lt_log.
                ENDIF.
              ELSE.
                MESSAGE ID 'ZFI_INADIMPLENCIA' TYPE 'S' NUMBER '008'
                  WITH lv_bp_membro gc_motivo_inadimplencia
                  INTO lv_msg_log.

                IF lv_log_id IS NOT INITIAL.
                  APPEND VALUE #(
                    log_id         = lv_log_id
                    partner        = lv_bp_membro
                    partner_origem = <ls_cliente>-PartnerOrigem
                    credit_sgmnt   = <ls_cliente>-CreditSegment
                    acao           = gc_acao_bloquear
                    block_reason   = ls_sgm-block_reason
                    status         = 'S'
                    mensagem       = lv_msg_log
                    risk_class     = COND #( WHEN lv_risk_class_membro IS NOT INITIAL
                                             THEN lv_risk_class_membro
                                             ELSE <ls_cliente>-RiskClass )
                    moeda          = <ls_cliente>-Moeda
                    vlr_vencido    = <ls_cliente>-ValorTotalVencido
                    dias_atraso    = <ls_cliente>-DiasAtraso
                    created_by     = sy-uname
                    created_at     = utclong_current( )
                  ) TO lt_log.
                ENDIF.
                <ls_res_membro>-ok = abap_true.
                lv_bloqueio_ok     = abap_true.
              ENDIF.
              CONTINUE.
            ENDIF.

            ls_sgm-xblocked     = abap_true.
            ls_sgm-block_reason = gc_motivo_inadimplencia.
            lo_account->set_bp_cms_sgm( EXPORTING is_bp_cms_sgm = ls_sgm ).

            IF lv_bp_membro = <ls_cliente>-PartnerMatriz.
              MESSAGE ID 'ZFI_INADIMPLENCIA' TYPE 'S' NUMBER '001'
                WITH lv_bp_membro <ls_cliente>-CreditSegment
                INTO lv_msg_log.
            ELSE.
              MESSAGE ID 'ZFI_INADIMPLENCIA' TYPE 'S' NUMBER '009'
                WITH lv_bp_membro lv_matriz
                INTO lv_msg_log.
            ENDIF.

            IF lv_log_id IS NOT INITIAL.
              APPEND VALUE #(
                log_id         = lv_log_id
                partner        = lv_bp_membro
                partner_origem = <ls_cliente>-PartnerOrigem
                credit_sgmnt   = <ls_cliente>-CreditSegment
                acao           = gc_acao_bloquear
                block_reason   = gc_motivo_inadimplencia
                status         = 'S'
                mensagem       = lv_msg_log
                risk_class     = COND #( WHEN lv_risk_class_membro IS NOT INITIAL
                                         THEN lv_risk_class_membro
                                         ELSE <ls_cliente>-RiskClass )
                moeda          = <ls_cliente>-Moeda
                vlr_vencido    = <ls_cliente>-ValorTotalVencido
                dias_atraso    = <ls_cliente>-DiasAtraso
                created_by     = sy-uname
                created_at     = utclong_current( )
              ) TO lt_log.
            ENDIF.

            <ls_res_membro>-ok = abap_true.
            lv_bloqueio_ok     = abap_true.

          CATCH cx_ukm_commons INTO DATA(lx_erro_membro).
            lv_msg_erro_det = lx_erro_membro->get_text( ).
            MESSAGE ID 'ZFI_INADIMPLENCIA' TYPE 'E' NUMBER '003'
              WITH lv_bp_membro lv_msg_erro_det
              INTO lv_msg_log.

            IF lv_log_id IS NOT INITIAL.
              APPEND VALUE #(
                log_id         = lv_log_id
                partner        = lv_bp_membro
                partner_origem = <ls_cliente>-PartnerOrigem
                credit_sgmnt   = <ls_cliente>-CreditSegment
                acao           = gc_acao_bloquear
                block_reason   = gc_motivo_inadimplencia
                status         = 'E'
                mensagem       = lv_msg_log
                risk_class     = COND #( WHEN lv_risk_class_membro IS NOT INITIAL
                                         THEN lv_risk_class_membro
                                         ELSE <ls_cliente>-RiskClass )
                moeda          = <ls_cliente>-Moeda
                vlr_vencido    = <ls_cliente>-ValorTotalVencido
                dias_atraso    = <ls_cliente>-DiasAtraso
                created_by     = sy-uname
                created_at     = utclong_current( )
              ) TO lt_log.
            ENDIF.
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
        IF lv_bp_motivo_dif IS NOT INITIAL.
          APPEND VALUE #(
            %tky = <ls_cliente>-%tky
            %msg = new_message(
              id       = 'ZFI_INADIMPLENCIA'
              number   = '006'
              severity = if_abap_behv_message=>severity-error
              v1       = lv_bp_motivo_dif
              v2       = lv_motivo_dif
            )
          ) TO reported-clienteinadimplente.
        ELSEIF lv_bp_classe_excl IS NOT INITIAL.
          APPEND VALUE #(
            %tky = <ls_cliente>-%tky
            %msg = new_message(
              id       = 'ZFI_INADIMPLENCIA'
              number   = '007'
              severity = if_abap_behv_message=>severity-warning
              v1       = lv_bp_classe_excl
              v2       = lv_classe_excl
            )
          ) TO reported-clienteinadimplente.
        ELSE.
          APPEND VALUE #(
            %tky = <ls_cliente>-%tky
            %msg = new_message(
              id       = 'ZFI_INADIMPLENCIA'
              number   = '003'
              severity = if_abap_behv_message=>severity-error
              v1       = <ls_cliente>-PartnerMatriz
              v2       = lv_msg_erro_det
            )
          ) TO reported-clienteinadimplente.
        ENDIF.
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
    DATA lv_msg_log            TYPE ztfi_log_inadimp-mensagem.          " Texto formatado pela ZFI_INADIMPLENCIA para gravação no log (CR-108)
    DATA lv_msg_erro_det       TYPE symsgv.                            " Detalhe resumido da última falha técnica no grupo (CR-108)
    DATA lv_bp_motivo_dif      TYPE bu_partner.                        " Primeiro BP impedido por bloqueio de outro motivo (CR-108)
    DATA lv_motivo_dif         TYPE ukm_block_reason.                  " Código do motivo de bloqueio externo encontrado (CR-108)
    DATA lv_log_id             TYPE sysuuid_x16.                       " UUID gerado uma vez por linha de log via gerar_uuid_log (CR-109)

    READ ENTITIES OF zi_fi_cliente_inadimplente IN LOCAL MODE
      ENTITY ClienteInadimplente
      ALL FIELDS WITH CORRESPONDING #( keys )
      RESULT DATA(lt_clientes).

    DATA(lo_bupa_factory) = cl_ukm_bupa_factory=>create( ).

    LOOP AT lt_clientes ASSIGNING FIELD-SYMBOL(<ls_cliente>).
      lv_desbloqueio_ok = abap_false. " Reinicialização explícita a cada cliente selecionado (CR-103)
      CLEAR: lv_msg_log, lv_msg_erro_det, lv_bp_motivo_dif, lv_motivo_dif.

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

        " Gera o UUID uma única vez para o registro de auditoria deste membro (CR-109)
        lv_log_id = gerar_uuid_log(
          EXPORTING
            is_tky      = <ls_cliente>-%tky
            iv_partner  = lv_bp_membro_desb
          CHANGING
            ct_reported = reported-clienteinadimplente ).

        TRY.
            DATA(lo_account) = lo_bupa_factory->get_credit_account(
              i_partner      = lv_bp_membro_desb
              i_credit_sgmnt = <ls_cliente>-CreditSegment ).

            validar_conta_credito(
              io_account      = lo_account
              iv_partner      = lv_bp_membro_desb
              iv_credit_sgmnt = <ls_cliente>-CreditSegment ).

            lo_account->get_bp_cms_sgm( IMPORTING es_bp_cms_sgm = DATA(ls_sgm) ).

            " Preserva bloqueios de outros motivos (<> 10) e registra mensagem 006 no log (CR-102)
            IF ls_sgm-xblocked = abap_true AND ls_sgm-block_reason <> gc_motivo_inadimplencia.
              MESSAGE ID 'ZFI_INADIMPLENCIA' TYPE 'W' NUMBER '006'
                WITH lv_bp_membro_desb ls_sgm-block_reason
                INTO lv_msg_log.
              IF lv_bp_motivo_dif IS INITIAL.
                lv_bp_motivo_dif = lv_bp_membro_desb.
                lv_motivo_dif    = ls_sgm-block_reason.
              ENDIF.

              IF lv_log_id IS NOT INITIAL.
                APPEND VALUE #(
                  log_id         = lv_log_id
                  partner        = lv_bp_membro_desb
                  partner_origem = <ls_cliente>-PartnerOrigem
                  credit_sgmnt   = <ls_cliente>-CreditSegment
                  acao           = gc_acao_desbloquear
                  block_reason   = ls_sgm-block_reason
                  status         = 'E'
                  mensagem       = lv_msg_log
                  risk_class     = <ls_cliente>-RiskClass
                  moeda          = <ls_cliente>-Moeda
                  vlr_vencido    = <ls_cliente>-ValorTotalVencido
                  dias_atraso    = <ls_cliente>-DiasAtraso
                  created_by     = sy-uname
                  created_at     = utclong_current( )
                ) TO lt_log.
              ENDIF.
              CONTINUE.
            ENDIF.

            ls_sgm-xblocked     = abap_false.
            CLEAR ls_sgm-block_reason.
            lo_account->set_bp_cms_sgm( EXPORTING is_bp_cms_sgm = ls_sgm ).

            IF lv_bp_membro_desb = <ls_cliente>-PartnerMatriz.
              MESSAGE ID 'ZFI_INADIMPLENCIA' TYPE 'S' NUMBER '002'
                WITH lv_bp_membro_desb <ls_cliente>-CreditSegment
                INTO lv_msg_log.
            ELSE.
              MESSAGE ID 'ZFI_INADIMPLENCIA' TYPE 'S' NUMBER '010'
                WITH lv_bp_membro_desb lv_matriz_desb
                INTO lv_msg_log.
            ENDIF.

            IF lv_log_id IS NOT INITIAL.
              APPEND VALUE #(
                log_id         = lv_log_id
                partner        = lv_bp_membro_desb
                partner_origem = <ls_cliente>-PartnerOrigem
                credit_sgmnt   = <ls_cliente>-CreditSegment
                acao           = gc_acao_desbloquear
                block_reason   = space
                status         = 'S'
                mensagem       = lv_msg_log
                risk_class     = <ls_cliente>-RiskClass
                moeda          = <ls_cliente>-Moeda
                vlr_vencido    = <ls_cliente>-ValorTotalVencido
                dias_atraso    = <ls_cliente>-DiasAtraso
                created_by     = sy-uname
                created_at     = utclong_current( )
              ) TO lt_log.
            ENDIF.

            <ls_res_membro>-ok = abap_true.
            lv_desbloqueio_ok  = abap_true.

          CATCH cx_ukm_commons INTO DATA(lx_erro_desb).
            lv_msg_erro_det = lx_erro_desb->get_text( ).
            MESSAGE ID 'ZFI_INADIMPLENCIA' TYPE 'E' NUMBER '003'
              WITH lv_bp_membro_desb lv_msg_erro_det
              INTO lv_msg_log.

            IF lv_log_id IS NOT INITIAL.
              APPEND VALUE #(
                log_id         = lv_log_id
                partner        = lv_bp_membro_desb
                partner_origem = <ls_cliente>-PartnerOrigem
                credit_sgmnt   = <ls_cliente>-CreditSegment
                acao           = gc_acao_desbloquear
                block_reason   = space
                status         = 'E'
                mensagem       = lv_msg_log
                risk_class     = <ls_cliente>-RiskClass
                moeda          = <ls_cliente>-Moeda
                vlr_vencido    = <ls_cliente>-ValorTotalVencido
                dias_atraso    = <ls_cliente>-DiasAtraso
                created_by     = sy-uname
                created_at     = utclong_current( )
              ) TO lt_log.
            ENDIF.
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
        IF lv_bp_motivo_dif IS NOT INITIAL.
          APPEND VALUE #(
            %tky = <ls_cliente>-%tky
            %msg = new_message(
              id       = 'ZFI_INADIMPLENCIA'
              number   = '006'
              severity = if_abap_behv_message=>severity-error
              v1       = lv_bp_motivo_dif
              v2       = lv_motivo_dif
            )
          ) TO reported-clienteinadimplente.
        ELSE.
          APPEND VALUE #(
            %tky = <ls_cliente>-%tky
            %msg = new_message(
              id       = 'ZFI_INADIMPLENCIA'
              number   = '003'
              severity = if_abap_behv_message=>severity-error
              v1       = <ls_cliente>-PartnerMatriz
              v2       = lv_msg_erro_det
            )
          ) TO reported-clienteinadimplente.
        ENDIF.
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
    " Guarda obrigatória antes de FOR ALL ENTRIES: evita Full Table Scan caso keys chegue vazia (CR-113)
    IF keys IS INITIAL.
      RETURN.
    ENDIF.

    " Tabela ordenada pela chave tripla garante busca binária eficiente ao checar registros ausentes (CR-113)
    DATA lt_dados TYPE SORTED TABLE OF zi_fi_cliente_inadimplente
                  WITH NON-UNIQUE KEY PartnerMatriz CreditSegment PartnerOrigem.

    " Filtra pela chave tripla (PartnerMatriz, CreditSegment e PartnerOrigem) para retornar exclusivamente as linhas solicitadas
    SELECT *
      FROM zi_fi_cliente_inadimplente
      FOR ALL ENTRIES IN @keys
      WHERE PartnerMatriz = @keys-PartnerMatriz
        AND CreditSegment = @keys-CreditSegment
        AND PartnerOrigem = @keys-PartnerOrigem
      INTO TABLE @lt_dados.

    result = CORRESPONDING #( lt_dados ).

    " Sinaliza formalmente em failed-clienteinadimplente qualquer chave solicitada que não exista mais na visão (CR-113)
    LOOP AT keys ASSIGNING FIELD-SYMBOL(<ls_key>).
      IF NOT line_exists( lt_dados[ PartnerMatriz = <ls_key>-PartnerMatriz
                                    CreditSegment = <ls_key>-CreditSegment
                                    PartnerOrigem = <ls_key>-PartnerOrigem ] ).
        APPEND VALUE #( %tky        = <ls_key>-%tky
                        %fail-cause = if_abap_behv=>cause-not_found ) TO failed-clienteinadimplente.
      ENDIF.
    ENDLOOP.
  ENDMETHOD.

ENDCLASS.

"! <p class="shorttext synchronized">Behavior Saver para persistência e log no FSCM</p>
"! <p>Efetiva as atualizações de crédito no FSCM, persiste os registros acumulados
"! na tabela de auditoria <strong>ZTFI_LOG_INADIMP</strong> durante a fase de save
"! e limpa os buffers transacionais ao encerramento da LUW.</p>
CLASS lsc_zi_fi_cliente_inadimplente DEFINITION INHERITING FROM cl_abap_behavior_saver.
  PROTECTED SECTION.
    " Persiste alterações de crédito no FSCM via save_all e grava registros de log em ZTFI_LOG_INADIMP. (Comentário padrão porque REDEFINITION não aceita ABAP Doc)
    METHODS save REDEFINITION.

    " Limpa buffers do FSCM (free_all) e a tabela estática gt_log do handler.
    METHODS cleanup REDEFINITION.

    " Finaliza a transação delegando a limpeza de buffers ao método cleanup( ).
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

#### Aba: Test Classes / CCAU (`zclfi_bp_cliente_inad.clas.testclasses.abap`)

```abap
*"* use this source file for your ABAP unit test classes

CLASS lcl_test_grupo_economico DEFINITION FINAL FOR TESTING " Suíte ABAP Unit isolada para resolução do grupo econômico (CR-116)
  DURATION SHORT
  RISK LEVEL HARMLESS.

  PRIVATE SECTION.
    TYPES tt_but050 TYPE STANDARD TABLE OF but050 WITH EMPTY KEY.

    CLASS-DATA go_osql_env TYPE REF TO if_osql_test_environment. " Ambiente de doubles SQL em memória (padrão ativo no S4D)

    CLASS-METHODS class_setup.    " Cria doubles de BUT050 e ZI_CA_GET_PARAMETER uma única vez antes da suíte
    CLASS-METHODS class_teardown. " Destrói doubles e restaura redirecionamento OSQL ao final da execução
    METHODS setup.                " Limpa doubles entre testes e garante o parâmetro RELTYP/GRUPO = UKM001

    METHODS test_consulta_pela_matriz FOR TESTING.     " Cenário 1: consulta partindo da Matriz com 2 filiais
    METHODS test_consulta_pela_filial FOR TESTING.     " Cenário 2: consulta partindo de uma Filial retorna Matriz + irmãs
    METHODS test_parceiro_individual FOR TESTING.      " Cenário 3: parceiro sem vínculo UKM001 retorna apenas a si mesmo
    METHODS test_desempate_deterministico FOR TESTING. " Cenário 4: vínculo vigente prevalece sobre histórico encerrado (CR-115)
    METHODS test_ignorar_outro_reltyp FOR TESTING.     " Cenário 5: vínculos diferentes de UKM001 (ex.: BUR001) são ignorados
ENDCLASS.

CLASS lcl_test_grupo_economico IMPLEMENTATION.

  METHOD class_setup.
    " Dobra a tabela de vínculos (BUT050) e a CDS lida pelo singleton de parâmetros (ZI_CA_GET_PARAMETER)
    go_osql_env = cl_osql_test_environment=>create(
      i_dependency_list = VALUE #( ( 'BUT050' ) ( 'ZI_CA_GET_PARAMETER' ) ) ).
  ENDMETHOD.

  METHOD class_teardown.
    IF go_osql_env IS BOUND.
      go_osql_env->destroy( ).
    ENDIF.
  ENDMETHOD.

  METHOD setup.
    DATA lt_param TYPE STANDARD TABLE OF zi_ca_get_parameter WITH EMPTY KEY.

    go_osql_env->clear_doubles( ).

    " Popula parâmetro controlado antes do primeiro acesso ao cache estático de zclca_tabela_parametros
    lt_param = VALUE #(
      ( modulo = 'FI'
        chave1 = 'DEL_R2R_009'
        chave2 = 'RELTYP'
        chave3 = 'GRUPO'
        sign   = 'I'
        opt    = 'EQ'
        low    = 'UKM001' ) ).
    go_osql_env->insert_test_data( lt_param ).
  ENDMETHOD.

  METHOD test_consulta_pela_matriz.
    DATA lt_but050 TYPE tt_but050.

    " Simula grupo Matriz (1000) com duas filiais (2001 e 2002) usando relnr distinto para cada chave
    lt_but050 = VALUE #(
      ( client    = sy-mandt
        relnr     = '000000000001'
        partner1  = '0000001000'
        partner2  = '0000002001'
        reltyp    = 'UKM001'
        date_from = '20240101'
        date_to   = '99991231' )
      ( client    = sy-mandt
        relnr     = '000000000002'
        partner1  = '0000001000'
        partner2  = '0000002002'
        reltyp    = 'UKM001'
        date_from = '20240101'
        date_to   = '99991231' ) ).
    go_osql_env->insert_test_data( lt_but050 ).

    lhc_clienteinadimplente=>obter_grupo_economico(
      EXPORTING
        iv_partner   = '0000001000'
      IMPORTING
        ev_matriz    = DATA(lv_matriz)
        et_parceiros = DATA(lt_parceiros) ).

    DATA(lt_esperado) = VALUE lhc_clienteinadimplente=>tt_partner(
      ( '0000001000' )
      ( '0000002001' )
      ( '0000002002' ) ).

    cl_abap_unit_assert=>assert_equals(
      act = lv_matriz
      exp = CONV bu_partner( '0000001000' )
      msg = 'A matriz retornada deve corresponder ao parceiro matriz consultado.' ).
    cl_abap_unit_assert=>assert_equals(
      act = lines( lt_parceiros )
      exp = 3
      msg = 'O grupo deve conter matriz e 2 filiais sem duplicidade.' ).
    cl_abap_unit_assert=>assert_equals(
      act = lt_parceiros
      exp = lt_esperado
      msg = 'Os parceiros do grupo devem corresponder a matriz e suas filiais.' ).
  ENDMETHOD.

  METHOD test_consulta_pela_filial.
    DATA lt_but050 TYPE tt_but050.

    lt_but050 = VALUE #(
      ( client    = sy-mandt
        relnr     = '000000000001'
        partner1  = '0000001000'
        partner2  = '0000002001'
        reltyp    = 'UKM001'
        date_from = '20240101'
        date_to   = '99991231' )
      ( client    = sy-mandt
        relnr     = '000000000002'
        partner1  = '0000001000'
        partner2  = '0000002002'
        reltyp    = 'UKM001'
        date_from = '20240101'
        date_to   = '99991231' ) ).
    go_osql_env->insert_test_data( lt_but050 ).

    " Consulta pela Filial 1 (2001) deve descobrir a Matriz (1000) e listar Matriz + Filial 1 + Filial 2
    lhc_clienteinadimplente=>obter_grupo_economico(
      EXPORTING
        iv_partner   = '0000002001'
      IMPORTING
        ev_matriz    = DATA(lv_matriz)
        et_parceiros = DATA(lt_parceiros) ).

    DATA(lt_esperado) = VALUE lhc_clienteinadimplente=>tt_partner(
      ( '0000001000' )
      ( '0000002001' )
      ( '0000002002' ) ).

    cl_abap_unit_assert=>assert_equals(
      act = lv_matriz
      exp = CONV bu_partner( '0000001000' )
      msg = 'A consulta pela filial deve identificar a matriz correta.' ).
    cl_abap_unit_assert=>assert_equals(
      act = lines( lt_parceiros )
      exp = 3
      msg = 'A consulta pela filial deve retornar matriz e todas as filiais irmãs sem duplicidade.' ).
    cl_abap_unit_assert=>assert_equals(
      act = lt_parceiros
      exp = lt_esperado
      msg = 'Os parceiros retornados devem conter todo o grupo econômico.' ).
  ENDMETHOD.

  METHOD test_parceiro_individual.
    " Sem vínculos cadastrados em BUT050 para o parceiro 3000
    lhc_clienteinadimplente=>obter_grupo_economico(
      EXPORTING
        iv_partner   = '0000003000'
      IMPORTING
        ev_matriz    = DATA(lv_matriz)
        et_parceiros = DATA(lt_parceiros) ).

    DATA(lt_esperado) = VALUE lhc_clienteinadimplente=>tt_partner(
      ( '0000003000' ) ).

    cl_abap_unit_assert=>assert_equals(
      act = lv_matriz
      exp = CONV bu_partner( '0000003000' )
      msg = 'Parceiro sem vínculo deve retornar ele mesmo como matriz.' ).
    cl_abap_unit_assert=>assert_equals(
      act = lt_parceiros
      exp = lt_esperado
      msg = 'Parceiro individual deve retornar lista com apenas 1 elemento.' ).
  ENDMETHOD.

  METHOD test_desempate_deterministico.
    DATA lt_but050 TYPE tt_but050.

    " Valida a CR-115: vínculo encerrado (1001, menor alfabeticamente) x vínculo vigente (1002)
    lt_but050 = VALUE #(
      ( client    = sy-mandt
        relnr     = '000000000001'
        partner1  = '0000001001'
        partner2  = '0000002001'
        reltyp    = 'UKM001'
        date_from = '20200101'
        date_to   = '20241231' )
      ( client    = sy-mandt
        relnr     = '000000000002'
        partner1  = '0000001002'
        partner2  = '0000002001'
        reltyp    = 'UKM001'
        date_from = '20250101'
        date_to   = '99991231' )
      ( client    = sy-mandt
        relnr     = '000000000003'
        partner1  = '0000001002'
        partner2  = '0000002002'
        reltyp    = 'UKM001'
        date_from = '20250101'
        date_to   = '99991231' ) ).
    go_osql_env->insert_test_data( lt_but050 ).

    lhc_clienteinadimplente=>obter_grupo_economico(
      EXPORTING
        iv_partner   = '0000002001'
      IMPORTING
        ev_matriz    = DATA(lv_matriz)
        et_parceiros = DATA(lt_parceiros) ).

    DATA(lt_esperado) = VALUE lhc_clienteinadimplente=>tt_partner(
      ( '0000001002' )
      ( '0000002001' )
      ( '0000002002' ) ).

    cl_abap_unit_assert=>assert_equals(
      act = lv_matriz
      exp = CONV bu_partner( '0000001002' )
      msg = 'O desempate determinístico deve selecionar sempre a matriz do vínculo vigente.' ).
    cl_abap_unit_assert=>assert_equals(
      act = lt_parceiros
      exp = lt_esperado
      msg = 'O grupo econômico deve corresponder ao da matriz vigente.' ).
  ENDMETHOD.

  METHOD test_ignorar_outro_reltyp.
    DATA lt_but050 TYPE tt_but050.

    " Vínculos com reltyp BUR001 não devem compor grupo econômico de crédito (UKM001)
    lt_but050 = VALUE #(
      ( client    = sy-mandt
        relnr     = '000000000001'
        partner1  = '0000004000'
        partner2  = '0000004001'
        reltyp    = 'BUR001'
        date_from = '20240101'
        date_to   = '99991231' )
      ( client    = sy-mandt
        relnr     = '000000000002'
        partner1  = '0000004002'
        partner2  = '0000004000'
        reltyp    = 'BUR001'
        date_from = '20240101'
        date_to   = '99991231' ) ).
    go_osql_env->insert_test_data( lt_but050 ).

    lhc_clienteinadimplente=>obter_grupo_economico(
      EXPORTING
        iv_partner   = '0000004000'
      IMPORTING
        ev_matriz    = DATA(lv_matriz)
        et_parceiros = DATA(lt_parceiros) ).

    DATA(lt_esperado) = VALUE lhc_clienteinadimplente=>tt_partner(
      ( '0000004000' ) ).

    cl_abap_unit_assert=>assert_equals(
      act = lv_matriz
      exp = CONV bu_partner( '0000004000' )
      msg = 'Vínculos de outros tipos de relação devem ser ignorados.' ).
    cl_abap_unit_assert=>assert_equals(
      act = lt_parceiros
      exp = lt_esperado
      msg = 'Apenas o parceiro consultado deve ser retornado quando não há vínculo UKM001.' ).
  ENDMETHOD.

ENDCLASS.
```

---

### 🚀 Código Limpo (Sem Comentários - Para Copiar e Colar)

#### Aba: Global Class (`zclfi_bp_cliente_inad.clas.abap`)

```abap
"! <p class="shorttext synchronized">Behavior Implementation for ZI_FI_CLIENTE_INADIMPLENTE</p>
"! <p>Behavior Pool responsável pela implementação <em>unmanaged</em> do objeto
"! de negócio RAP <strong>ZI_FI_CLIENTE_INADIMPLENTE</strong>, orquestrando autorização,
"! bloqueio e desbloqueio de crédito em massa por grupo econômico no FSCM.</p>
CLASS zclfi_bp_cliente_inad DEFINITION PUBLIC ABSTRACT FINAL FOR BEHAVIOR OF zi_fi_cliente_inadimplente.
ENDCLASS.

CLASS zclfi_bp_cliente_inad IMPLEMENTATION.
ENDCLASS.
```

#### Aba: Local Types / CCIMP (`zclfi_bp_cliente_inad.clas.implementations.abap`)

```abap
"! <p class="shorttext synchronized">Behavior Handler para clientes inadimplentes</p>
"! <p>Controla autorizações por instância, leitura, bloqueio lógico e ações de
"! bloqueio/desbloqueio em massa por grupo econômico no FSCM, além da resolução
"! da estrutura Matriz/Filial na tabela BUT050.</p>
CLASS lhc_clienteinadimplente DEFINITION INHERITING FROM cl_abap_behavior_handler.
  PUBLIC SECTION.
    TYPES tt_partner TYPE STANDARD TABLE OF bu_partner WITH DEFAULT KEY.

    CLASS-DATA gt_log TYPE STANDARD TABLE OF ztfi_log_inadimp WITH DEFAULT KEY.

    "! <p class="shorttext synchronized">Identifica matriz e membros do grupo econômico</p>
    "! <p>Resolve a hierarquia Matriz/Filial na tabela <strong>BUT050</strong> utilizando o tipo
    "! de relacionamento parametrizado em <em>RELTYP/GRUPO</em> (fallback 'UKM001'), com
    "! ordenação determinística pela relação mais recente quando consultado por uma filial,
    "! retornando o próprio parceiro como individual caso não possua vínculo.</p>
    "! @parameter iv_partner | Número do parceiro de negócios de entrada
    "! @parameter ev_matriz | Parceiro matriz identificado para o grupo econômico
    "! @parameter et_parceiros | Lista única e ordenada dos parceiros pertencentes ao grupo
    CLASS-METHODS obter_grupo_economico
      IMPORTING
        iv_partner   TYPE bu_partner
      EXPORTING
        ev_matriz    TYPE bu_partner
        et_parceiros TYPE tt_partner.

  PRIVATE SECTION.
    TYPES:
      ty_reported_cli    TYPE TABLE FOR REPORTED EARLY zi_fi_cliente_inadimplente,
      ty_reported_cli_ls TYPE STRUCTURE FOR REPORTED EARLY zi_fi_cliente_inadimplente,
      ty_tky_cli         TYPE ty_reported_cli_ls-%tky,
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

    "! <p class="shorttext synchronized">Valida autorizações de bloqueio e desbloqueio</p>
    "! <p>Verifica permissões no objeto <strong>ZFI_BLOQ</strong> (atividades 05 e 43)
    "! por empresa e segmento de crédito, usando empresa padrão parametrizada como
    "! fallback quando não houver empresa informada na instância.</p>
    "! @parameter keys | Chaves das instâncias a autorizar
    "! @parameter requested_authorizations | Ações solicitadas para verificação
    "! @parameter result | Tabela com o resultado de autorização por instância
    METHODS get_instance_authorizations FOR INSTANCE AUTHORIZATION
      IMPORTING keys REQUEST requested_authorizations FOR ClienteInadimplente RESULT result.

    "! <p class="shorttext synchronized">Bloqueia clientes inadimplentes no FSCM por grupo</p>
    "! <p>Executa o bloqueio de crédito em massa no FSCM com motivo '10', validando
    "! classes de risco excluídas, propagando o bloqueio em cascata no grupo econômico
    "! sem sobrescrever bloqueios externos, acumulando registros em <em>gt_log</em> e
    "! preenchendo os parâmetros implícitos <em>failed</em>, <em>reported</em> e <em>result</em>.</p>
    "! @parameter keys | Chaves dos clientes selecionados para bloqueio
    "! @parameter result | Instâncias atualizadas retornadas ao framework RAP
    METHODS bloquearCliente FOR MODIFY
      IMPORTING keys FOR ACTION ClienteInadimplente~bloquearCliente RESULT result.

    "! <p class="shorttext synchronized">Desbloqueia clientes por inadimplência em grupo</p>
    "! <p>Executa o desbloqueio de crédito em massa no FSCM em cascata no grupo econômico
    "! exclusivamente quando o motivo de bloqueio vigente é '10', preservando bloqueios
    "! externos, acumulando registros em <em>gt_log</em> e preenchendo os parâmetros
    "! implícitos <em>failed</em>, <em>reported</em> e <em>result</em>.</p>
    "! @parameter keys | Chaves dos clientes selecionados para desbloqueio
    "! @parameter result | Instâncias atualizadas retornadas ao framework RAP
    METHODS desbloquearCliente FOR MODIFY
      IMPORTING keys FOR ACTION ClienteInadimplente~desbloquearCliente RESULT result.

    "! <p class="shorttext synchronized">Lê dados atuais dos clientes inadimplentes</p>
    "! <p>Recupera os registros na CDS <strong>ZI_FI_CLIENTE_INADIMPLENTE</strong> pela chave
    "! tripla (PartnerMatriz, CreditSegment, PartnerOrigem), tratando chamadas com tabela
    "! vazia e sinalizando <em>failed</em> (cause-not_found) para chaves inexistentes.</p>
    "! @parameter keys | Chaves dos clientes solicitados para leitura
    "! @parameter result | Dados lidos retornados ao runtime RAP
    METHODS read FOR READ
      IMPORTING keys FOR READ ClienteInadimplente RESULT result.

    "! <p class="shorttext synchronized">Bloqueia logicamente os parceiros do grupo econômico</p>
    "! <p>Aplica enfileiramento transacional via <em>BUPA_ENQUEUE</em> para todos os
    "! membros do grupo econômico antes de modificações, executando <em>BUPA_DEQUEUE</em>
    "! e preenchendo <em>failed</em> (cause-locked) e <em>reported</em> em caso de contenção.</p>
    "! @parameter keys | Chaves das instâncias a bloquear logicamente
    METHODS lock FOR LOCK
      IMPORTING keys FOR LOCK ClienteInadimplente.

    "! <p class="shorttext synchronized">Gera UUID único para registro na tabela de log</p>
    "! <p>Cria identificador único de 16 bytes para auditoria e, em caso de falha na
    "! geração, registra a mensagem de erro 003 da classe <em>ZFI_INADIMPLENCIA</em>
    "! em <em>ct_reported</em>.</p>
    "! @parameter is_tky | Chave transacional da instância RAP associada
    "! @parameter iv_partner | Parceiro relacionado ao registro de log
    "! @parameter ct_reported | Tabela de mensagens RAP para reporte de falha na geração
    "! @parameter rv_log_id | UUID gerado ou valor inicial em caso de erro
    METHODS gerar_uuid_log
      IMPORTING
        is_tky           TYPE ty_tky_cli
        iv_partner       TYPE bu_partner
      CHANGING
        ct_reported      TYPE ty_reported_cli
      RETURNING
        VALUE(rv_log_id) TYPE sysuuid_x16.

    "! <p class="shorttext synchronized">Valida existência da conta de crédito no FSCM</p>
    "! <p>Verifica se a referência da conta de crédito está instanciada e confirma sua
    "! existência para o parceiro e segmento via <em>check_existence</em>, lançando
    "! exceção tipada em caso de inconsistência.</p>
    "! @parameter io_account | Instância da conta de crédito FSCM a validar
    "! @parameter iv_partner | Parceiro de negócios avaliado
    "! @parameter iv_credit_sgmnt | Segmento de crédito avaliado
    "! @raising cx_ukm_commons | Conta de crédito inexistente ou inválida no segmento informado
    METHODS validar_conta_credito
      IMPORTING
        io_account      TYPE REF TO cl_ukm_account
        iv_partner      TYPE bu_partner
        iv_credit_sgmnt TYPE ukm_credit_sgmnt
      RAISING
        cx_ukm_commons.
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
      CATCH zcxca_tabela_parametros.
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
      READ TABLE lt_clientes INTO ls_cli_auth WITH KEY id COMPONENTS %tky = <ls_key>-%tky.
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
      CATCH zcxca_tabela_parametros.
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

    SELECT partner1
      FROM but050
      WHERE partner2 = @iv_partner
        AND reltyp   IN @lr_reltyp
      ORDER BY date_to DESCENDING, date_from DESCENDING, partner1 ASCENDING
      INTO TABLE @DATA(lt_matrizes)
      UP TO 1 ROWS.

    IF lt_matrizes IS NOT INITIAL.
      DATA(lv_matriz_encontrada) = lt_matrizes[ 1 ]-partner1.
      IF lv_matriz_encontrada IS NOT INITIAL.
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
    ENDIF.

    ev_matriz = iv_partner.
    APPEND iv_partner TO et_parceiros.
  ENDMETHOD.

  METHOD gerar_uuid_log.
    TRY.
        rv_log_id = cl_system_uuid=>create_uuid_x16_static( ).
      CATCH cx_uuid_error INTO DATA(lx_uuid_error).
        DATA(lv_msg_uuid) = CONV symsgv( lx_uuid_error->get_text( ) ).
        APPEND VALUE #(
          %tky = is_tky
          %msg = new_message(
            id       = 'ZFI_INADIMPLENCIA'
            number   = '003'
            severity = if_abap_behv_message=>severity-error
            v1       = iv_partner
            v2       = lv_msg_uuid
          )
        ) TO ct_reported.
    ENDTRY.
  ENDMETHOD.

  METHOD validar_conta_credito.
    IF io_account IS NOT BOUND.
      RAISE EXCEPTION TYPE cx_ukm_commons
        MESSAGE ID 'UKM_COMM' TYPE 'E' NUMBER '008'
        WITH iv_partner iv_credit_sgmnt.
    ENDIF.

    io_account->check_existence(
      EXCEPTIONS
        unknown_partner             = 1
        unknown_segment             = 2
        initial_master_data_partner = 3
        initial_master_data_segment = 4
        OTHERS                      = 5 ).

    CASE sy-subrc.
      WHEN 0.
        RETURN.
      WHEN 1.
        RAISE EXCEPTION TYPE cx_ukm_commons
          MESSAGE ID 'UKM_COMM' TYPE 'E' NUMBER '006'
          WITH iv_partner.
      WHEN 2.
        RAISE EXCEPTION TYPE cx_ukm_commons
          MESSAGE ID 'UKM_COMM' TYPE 'E' NUMBER '005'
          WITH iv_credit_sgmnt.
      WHEN 3.
        RAISE EXCEPTION TYPE cx_ukm_commons
          MESSAGE ID 'UKM_COMM' TYPE 'E' NUMBER '007'
          WITH iv_partner.
      WHEN OTHERS.
        RAISE EXCEPTION TYPE cx_ukm_commons
          MESSAGE ID 'UKM_COMM' TYPE 'E' NUMBER '008'
          WITH iv_partner iv_credit_sgmnt.
    ENDCASE.
  ENDMETHOD.

  METHOD bloquearCliente.
    DATA lt_log                TYPE STANDARD TABLE OF ztfi_log_inadimp.
    DATA lr_classes_excluidas  TYPE RANGE OF ukm_risk_class.
    DATA lt_resultados_membros TYPE tt_resultado_membro.
    DATA lv_risk_class_membro  TYPE ukm_risk_class.
    DATA lv_bloqueio_ok        TYPE abap_bool.
    DATA lv_msg_log            TYPE ztfi_log_inadimp-mensagem.
    DATA lv_msg_erro_det       TYPE symsgv.
    DATA lv_bp_motivo_dif      TYPE bu_partner.
    DATA lv_motivo_dif         TYPE ukm_block_reason.
    DATA lv_bp_classe_excl     TYPE bu_partner.
    DATA lv_classe_excl        TYPE ukm_risk_class.
    DATA lv_log_id             TYPE sysuuid_x16.

    TRY.
        zclca_tabela_parametros=>get_instance( )->m_get_range(
          EXPORTING
            iv_modulo = 'FI'
            iv_chave1 = 'DEL_R2R_009'
            iv_chave2 = 'RISK_CLASS'
            iv_chave3 = 'EXCLUIR'
          IMPORTING
            et_range  = lr_classes_excluidas ).
      CATCH zcxca_tabela_parametros.
        lr_classes_excluidas = VALUE #( ( sign = 'I' option = 'EQ' low = '5' ) ).
    ENDTRY.

    READ ENTITIES OF zi_fi_cliente_inadimplente IN LOCAL MODE
      ENTITY ClienteInadimplente
      ALL FIELDS WITH CORRESPONDING #( keys )
      RESULT DATA(lt_clientes).

    DATA(lo_bupa_factory) = cl_ukm_bupa_factory=>create( ).

    LOOP AT lt_clientes ASSIGNING FIELD-SYMBOL(<ls_cliente>).
      lv_bloqueio_ok = abap_false.
      CLEAR: lv_msg_log, lv_msg_erro_det, lv_bp_motivo_dif, lv_motivo_dif, lv_bp_classe_excl, lv_classe_excl.

      IF <ls_cliente>-RiskClass IN lr_classes_excluidas.
        MESSAGE ID 'ZFI_INADIMPLENCIA' TYPE 'W' NUMBER '007'
          WITH <ls_cliente>-PartnerMatriz <ls_cliente>-RiskClass
          INTO lv_msg_log.

        lv_log_id = gerar_uuid_log(
          EXPORTING
            is_tky      = <ls_cliente>-%tky
            iv_partner  = <ls_cliente>-PartnerMatriz
          CHANGING
            ct_reported = reported-clienteinadimplente ).

        IF lv_log_id IS NOT INITIAL.
          APPEND VALUE #(
            log_id         = lv_log_id
            partner        = <ls_cliente>-partnermatriz
            partner_origem = <ls_cliente>-partnerorigem
            credit_sgmnt   = <ls_cliente>-creditsegment
            acao           = gc_acao_bloquear
            block_reason   = space
            status         = 'E'
            mensagem       = lv_msg_log
            risk_class     = <ls_cliente>-riskclass
            moeda          = <ls_cliente>-moeda
            vlr_vencido    = <ls_cliente>-valortotalvencido
            dias_atraso    = <ls_cliente>-diasatraso
            created_by     = sy-uname
            created_at     = utclong_current( )
          ) TO lt_log.
        ENDIF.

        APPEND VALUE #( %tky = <ls_cliente>-%tky ) TO failed-clienteinadimplente.
        APPEND VALUE #(
          %tky = <ls_cliente>-%tky
          %msg = new_message(
            id       = 'ZFI_INADIMPLENCIA'
            number   = '007'
            severity = if_abap_behv_message=>severity-warning
            v1       = <ls_cliente>-PartnerMatriz
            v2       = <ls_cliente>-RiskClass
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

        lv_log_id = gerar_uuid_log(
          EXPORTING
            is_tky      = <ls_cliente>-%tky
            iv_partner  = lv_bp_membro
          CHANGING
            ct_reported = reported-clienteinadimplente ).

        CLEAR lv_risk_class_membro.
        SELECT SINGLE risk_class
          FROM ukmbp_cms
          WHERE partner = @lv_bp_membro
          INTO @lv_risk_class_membro.

        IF lv_risk_class_membro IS NOT INITIAL AND lv_risk_class_membro IN lr_classes_excluidas.
          MESSAGE ID 'ZFI_INADIMPLENCIA' TYPE 'W' NUMBER '007'
            WITH lv_bp_membro lv_risk_class_membro
            INTO lv_msg_log.
          IF lv_bp_classe_excl IS INITIAL.
            lv_bp_classe_excl = lv_bp_membro.
            lv_classe_excl    = lv_risk_class_membro.
          ENDIF.

          IF lv_log_id IS NOT INITIAL.
            APPEND VALUE #(
              log_id         = lv_log_id
              partner        = lv_bp_membro
              partner_origem = <ls_cliente>-PartnerOrigem
              credit_sgmnt   = <ls_cliente>-CreditSegment
              acao           = gc_acao_bloquear
              block_reason   = space
              status         = 'E'
              mensagem       = lv_msg_log
              risk_class     = lv_risk_class_membro
              moeda          = <ls_cliente>-Moeda
              vlr_vencido    = <ls_cliente>-ValorTotalVencido
              dias_atraso    = <ls_cliente>-DiasAtraso
              created_by     = sy-uname
              created_at     = utclong_current( )
            ) TO lt_log.
          ENDIF.
          CONTINUE.
        ENDIF.

        TRY.
            DATA(lo_account) = lo_bupa_factory->get_credit_account(
              i_partner      = lv_bp_membro
              i_credit_sgmnt = <ls_cliente>-CreditSegment ).

            validar_conta_credito(
              io_account      = lo_account
              iv_partner      = lv_bp_membro
              iv_credit_sgmnt = <ls_cliente>-CreditSegment ).

            lo_account->get_bp_cms_sgm( IMPORTING es_bp_cms_sgm = DATA(ls_sgm) ).

            IF ls_sgm-xblocked = abap_true.
              IF ls_sgm-block_reason <> gc_motivo_inadimplencia.
                MESSAGE ID 'ZFI_INADIMPLENCIA' TYPE 'W' NUMBER '006'
                  WITH lv_bp_membro ls_sgm-block_reason
                  INTO lv_msg_log.
                IF lv_bp_motivo_dif IS INITIAL.
                  lv_bp_motivo_dif = lv_bp_membro.
                  lv_motivo_dif    = ls_sgm-block_reason.
                ENDIF.

                IF lv_log_id IS NOT INITIAL.
                  APPEND VALUE #(
                    log_id         = lv_log_id
                    partner        = lv_bp_membro
                    partner_origem = <ls_cliente>-PartnerOrigem
                    credit_sgmnt   = <ls_cliente>-CreditSegment
                    acao           = gc_acao_bloquear
                    block_reason   = ls_sgm-block_reason
                    status         = 'E'
                    mensagem       = lv_msg_log
                    risk_class     = COND #( WHEN lv_risk_class_membro IS NOT INITIAL
                                             THEN lv_risk_class_membro
                                             ELSE <ls_cliente>-RiskClass )
                    moeda          = <ls_cliente>-Moeda
                    vlr_vencido    = <ls_cliente>-ValorTotalVencido
                    dias_atraso    = <ls_cliente>-DiasAtraso
                    created_by     = sy-uname
                    created_at     = utclong_current( )
                  ) TO lt_log.
                ENDIF.
              ELSE.
                MESSAGE ID 'ZFI_INADIMPLENCIA' TYPE 'S' NUMBER '008'
                  WITH lv_bp_membro gc_motivo_inadimplencia
                  INTO lv_msg_log.

                IF lv_log_id IS NOT INITIAL.
                  APPEND VALUE #(
                    log_id         = lv_log_id
                    partner        = lv_bp_membro
                    partner_origem = <ls_cliente>-PartnerOrigem
                    credit_sgmnt   = <ls_cliente>-CreditSegment
                    acao           = gc_acao_bloquear
                    block_reason   = ls_sgm-block_reason
                    status         = 'S'
                    mensagem       = lv_msg_log
                    risk_class     = COND #( WHEN lv_risk_class_membro IS NOT INITIAL
                                             THEN lv_risk_class_membro
                                             ELSE <ls_cliente>-RiskClass )
                    moeda          = <ls_cliente>-Moeda
                    vlr_vencido    = <ls_cliente>-ValorTotalVencido
                    dias_atraso    = <ls_cliente>-DiasAtraso
                    created_by     = sy-uname
                    created_at     = utclong_current( )
                  ) TO lt_log.
                ENDIF.
                <ls_res_membro>-ok = abap_true.
                lv_bloqueio_ok     = abap_true.
              ENDIF.
              CONTINUE.
            ENDIF.

            ls_sgm-xblocked     = abap_true.
            ls_sgm-block_reason = gc_motivo_inadimplencia.
            lo_account->set_bp_cms_sgm( EXPORTING is_bp_cms_sgm = ls_sgm ).

            IF lv_bp_membro = <ls_cliente>-PartnerMatriz.
              MESSAGE ID 'ZFI_INADIMPLENCIA' TYPE 'S' NUMBER '001'
                WITH lv_bp_membro <ls_cliente>-CreditSegment
                INTO lv_msg_log.
            ELSE.
              MESSAGE ID 'ZFI_INADIMPLENCIA' TYPE 'S' NUMBER '009'
                WITH lv_bp_membro lv_matriz
                INTO lv_msg_log.
            ENDIF.

            IF lv_log_id IS NOT INITIAL.
              APPEND VALUE #(
                log_id         = lv_log_id
                partner        = lv_bp_membro
                partner_origem = <ls_cliente>-PartnerOrigem
                credit_sgmnt   = <ls_cliente>-CreditSegment
                acao           = gc_acao_bloquear
                block_reason   = gc_motivo_inadimplencia
                status         = 'S'
                mensagem       = lv_msg_log
                risk_class     = COND #( WHEN lv_risk_class_membro IS NOT INITIAL
                                         THEN lv_risk_class_membro
                                         ELSE <ls_cliente>-RiskClass )
                moeda          = <ls_cliente>-Moeda
                vlr_vencido    = <ls_cliente>-ValorTotalVencido
                dias_atraso    = <ls_cliente>-DiasAtraso
                created_by     = sy-uname
                created_at     = utclong_current( )
              ) TO lt_log.
            ENDIF.

            <ls_res_membro>-ok = abap_true.
            lv_bloqueio_ok     = abap_true.

          CATCH cx_ukm_commons INTO DATA(lx_erro_membro).
            lv_msg_erro_det = lx_erro_membro->get_text( ).
            MESSAGE ID 'ZFI_INADIMPLENCIA' TYPE 'E' NUMBER '003'
              WITH lv_bp_membro lv_msg_erro_det
              INTO lv_msg_log.

            IF lv_log_id IS NOT INITIAL.
              APPEND VALUE #(
                log_id         = lv_log_id
                partner        = lv_bp_membro
                partner_origem = <ls_cliente>-PartnerOrigem
                credit_sgmnt   = <ls_cliente>-CreditSegment
                acao           = gc_acao_bloquear
                block_reason   = gc_motivo_inadimplencia
                status         = 'E'
                mensagem       = lv_msg_log
                risk_class     = COND #( WHEN lv_risk_class_membro IS NOT INITIAL
                                         THEN lv_risk_class_membro
                                         ELSE <ls_cliente>-RiskClass )
                moeda          = <ls_cliente>-Moeda
                vlr_vencido    = <ls_cliente>-ValorTotalVencido
                dias_atraso    = <ls_cliente>-DiasAtraso
                created_by     = sy-uname
                created_at     = utclong_current( )
              ) TO lt_log.
            ENDIF.
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
        IF lv_bp_motivo_dif IS NOT INITIAL.
          APPEND VALUE #(
            %tky = <ls_cliente>-%tky
            %msg = new_message(
              id       = 'ZFI_INADIMPLENCIA'
              number   = '006'
              severity = if_abap_behv_message=>severity-error
              v1       = lv_bp_motivo_dif
              v2       = lv_motivo_dif
            )
          ) TO reported-clienteinadimplente.
        ELSEIF lv_bp_classe_excl IS NOT INITIAL.
          APPEND VALUE #(
            %tky = <ls_cliente>-%tky
            %msg = new_message(
              id       = 'ZFI_INADIMPLENCIA'
              number   = '007'
              severity = if_abap_behv_message=>severity-warning
              v1       = lv_bp_classe_excl
              v2       = lv_classe_excl
            )
          ) TO reported-clienteinadimplente.
        ELSE.
          APPEND VALUE #(
            %tky = <ls_cliente>-%tky
            %msg = new_message(
              id       = 'ZFI_INADIMPLENCIA'
              number   = '003'
              severity = if_abap_behv_message=>severity-error
              v1       = <ls_cliente>-PartnerMatriz
              v2       = lv_msg_erro_det
            )
          ) TO reported-clienteinadimplente.
        ENDIF.
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
    DATA lv_msg_log            TYPE ztfi_log_inadimp-mensagem.
    DATA lv_msg_erro_det       TYPE symsgv.
    DATA lv_bp_motivo_dif      TYPE bu_partner.
    DATA lv_motivo_dif         TYPE ukm_block_reason.
    DATA lv_log_id             TYPE sysuuid_x16.

    READ ENTITIES OF zi_fi_cliente_inadimplente IN LOCAL MODE
      ENTITY ClienteInadimplente
      ALL FIELDS WITH CORRESPONDING #( keys )
      RESULT DATA(lt_clientes).

    DATA(lo_bupa_factory) = cl_ukm_bupa_factory=>create( ).

    LOOP AT lt_clientes ASSIGNING FIELD-SYMBOL(<ls_cliente>).
      lv_desbloqueio_ok = abap_false.
      CLEAR: lv_msg_log, lv_msg_erro_det, lv_bp_motivo_dif, lv_motivo_dif.

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

        lv_log_id = gerar_uuid_log(
          EXPORTING
            is_tky      = <ls_cliente>-%tky
            iv_partner  = lv_bp_membro_desb
          CHANGING
            ct_reported = reported-clienteinadimplente ).

        TRY.
            DATA(lo_account) = lo_bupa_factory->get_credit_account(
              i_partner      = lv_bp_membro_desb
              i_credit_sgmnt = <ls_cliente>-CreditSegment ).

            validar_conta_credito(
              io_account      = lo_account
              iv_partner      = lv_bp_membro_desb
              iv_credit_sgmnt = <ls_cliente>-CreditSegment ).

            lo_account->get_bp_cms_sgm( IMPORTING es_bp_cms_sgm = DATA(ls_sgm) ).

            IF ls_sgm-xblocked = abap_true AND ls_sgm-block_reason <> gc_motivo_inadimplencia.
              MESSAGE ID 'ZFI_INADIMPLENCIA' TYPE 'W' NUMBER '006'
                WITH lv_bp_membro_desb ls_sgm-block_reason
                INTO lv_msg_log.
              IF lv_bp_motivo_dif IS INITIAL.
                lv_bp_motivo_dif = lv_bp_membro_desb.
                lv_motivo_dif    = ls_sgm-block_reason.
              ENDIF.

              IF lv_log_id IS NOT INITIAL.
                APPEND VALUE #(
                  log_id         = lv_log_id
                  partner        = lv_bp_membro_desb
                  partner_origem = <ls_cliente>-PartnerOrigem
                  credit_sgmnt   = <ls_cliente>-CreditSegment
                  acao           = gc_acao_desbloquear
                  block_reason   = ls_sgm-block_reason
                  status         = 'E'
                  mensagem       = lv_msg_log
                  risk_class     = <ls_cliente>-RiskClass
                  moeda          = <ls_cliente>-Moeda
                  vlr_vencido    = <ls_cliente>-ValorTotalVencido
                  dias_atraso    = <ls_cliente>-DiasAtraso
                  created_by     = sy-uname
                  created_at     = utclong_current( )
                ) TO lt_log.
              ENDIF.
              CONTINUE.
            ENDIF.

            ls_sgm-xblocked     = abap_false.
            CLEAR ls_sgm-block_reason.
            lo_account->set_bp_cms_sgm( EXPORTING is_bp_cms_sgm = ls_sgm ).

            IF lv_bp_membro_desb = <ls_cliente>-PartnerMatriz.
              MESSAGE ID 'ZFI_INADIMPLENCIA' TYPE 'S' NUMBER '002'
                WITH lv_bp_membro_desb <ls_cliente>-CreditSegment
                INTO lv_msg_log.
            ELSE.
              MESSAGE ID 'ZFI_INADIMPLENCIA' TYPE 'S' NUMBER '010'
                WITH lv_bp_membro_desb lv_matriz_desb
                INTO lv_msg_log.
            ENDIF.

            IF lv_log_id IS NOT INITIAL.
              APPEND VALUE #(
                log_id         = lv_log_id
                partner        = lv_bp_membro_desb
                partner_origem = <ls_cliente>-PartnerOrigem
                credit_sgmnt   = <ls_cliente>-CreditSegment
                acao           = gc_acao_desbloquear
                block_reason   = space
                status         = 'S'
                mensagem       = lv_msg_log
                risk_class     = <ls_cliente>-RiskClass
                moeda          = <ls_cliente>-Moeda
                vlr_vencido    = <ls_cliente>-ValorTotalVencido
                dias_atraso    = <ls_cliente>-DiasAtraso
                created_by     = sy-uname
                created_at     = utclong_current( )
              ) TO lt_log.
            ENDIF.

            <ls_res_membro>-ok = abap_true.
            lv_desbloqueio_ok  = abap_true.

          CATCH cx_ukm_commons INTO DATA(lx_erro_desb).
            lv_msg_erro_det = lx_erro_desb->get_text( ).
            MESSAGE ID 'ZFI_INADIMPLENCIA' TYPE 'E' NUMBER '003'
              WITH lv_bp_membro_desb lv_msg_erro_det
              INTO lv_msg_log.

            IF lv_log_id IS NOT INITIAL.
              APPEND VALUE #(
                log_id         = lv_log_id
                partner        = lv_bp_membro_desb
                partner_origem = <ls_cliente>-PartnerOrigem
                credit_sgmnt   = <ls_cliente>-CreditSegment
                acao           = gc_acao_desbloquear
                block_reason   = space
                status         = 'E'
                mensagem       = lv_msg_log
                risk_class     = <ls_cliente>-RiskClass
                moeda          = <ls_cliente>-Moeda
                vlr_vencido    = <ls_cliente>-ValorTotalVencido
                dias_atraso    = <ls_cliente>-DiasAtraso
                created_by     = sy-uname
                created_at     = utclong_current( )
              ) TO lt_log.
            ENDIF.
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
        IF lv_bp_motivo_dif IS NOT INITIAL.
          APPEND VALUE #(
            %tky = <ls_cliente>-%tky
            %msg = new_message(
              id       = 'ZFI_INADIMPLENCIA'
              number   = '006'
              severity = if_abap_behv_message=>severity-error
              v1       = lv_bp_motivo_dif
              v2       = lv_motivo_dif
            )
          ) TO reported-clienteinadimplente.
        ELSE.
          APPEND VALUE #(
            %tky = <ls_cliente>-%tky
            %msg = new_message(
              id       = 'ZFI_INADIMPLENCIA'
              number   = '003'
              severity = if_abap_behv_message=>severity-error
              v1       = <ls_cliente>-PartnerMatriz
              v2       = lv_msg_erro_det
            )
          ) TO reported-clienteinadimplente.
        ENDIF.
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
    IF keys IS INITIAL.
      RETURN.
    ENDIF.

    DATA lt_dados TYPE SORTED TABLE OF zi_fi_cliente_inadimplente
                  WITH NON-UNIQUE KEY PartnerMatriz CreditSegment PartnerOrigem.

    SELECT *
      FROM zi_fi_cliente_inadimplente
      FOR ALL ENTRIES IN @keys
      WHERE PartnerMatriz = @keys-PartnerMatriz
        AND CreditSegment = @keys-CreditSegment
        AND PartnerOrigem = @keys-PartnerOrigem
      INTO TABLE @lt_dados.

    result = CORRESPONDING #( lt_dados ).

    LOOP AT keys ASSIGNING FIELD-SYMBOL(<ls_key>).
      IF NOT line_exists( lt_dados[ PartnerMatriz = <ls_key>-PartnerMatriz
                                    CreditSegment = <ls_key>-CreditSegment
                                    PartnerOrigem = <ls_key>-PartnerOrigem ] ).
        APPEND VALUE #( %tky        = <ls_key>-%tky
                        %fail-cause = if_abap_behv=>cause-not_found ) TO failed-clienteinadimplente.
      ENDIF.
    ENDLOOP.
  ENDMETHOD.

ENDCLASS.

"! <p class="shorttext synchronized">Behavior Saver para persistência e log no FSCM</p>
"! <p>Efetiva as atualizações de crédito no FSCM, persiste os registros acumulados
"! na tabela de auditoria <strong>ZTFI_LOG_INADIMP</strong> durante a fase de save
"! e limpa os buffers transacionais ao encerramento da LUW.</p>
CLASS lsc_zi_fi_cliente_inadimplente DEFINITION INHERITING FROM cl_abap_behavior_saver.
  PROTECTED SECTION.
    " Persiste alterações de crédito no FSCM via save_all e grava registros de log em ZTFI_LOG_INADIMP.
    METHODS save REDEFINITION.

    " Limpa buffers do FSCM (free_all) e a tabela estática gt_log do handler.
    METHODS cleanup REDEFINITION.

    " Finaliza a transação delegando a limpeza de buffers ao método cleanup( ).
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

#### Aba: Test Classes / CCAU (`zclfi_bp_cliente_inad.clas.testclasses.abap`)

```abap
*"* use this source file for your ABAP unit test classes

CLASS lcl_test_grupo_economico DEFINITION FINAL FOR TESTING
  DURATION SHORT
  RISK LEVEL HARMLESS.

  PRIVATE SECTION.
    TYPES tt_but050 TYPE STANDARD TABLE OF but050 WITH EMPTY KEY.

    CLASS-DATA go_osql_env TYPE REF TO if_osql_test_environment.

    CLASS-METHODS class_setup.
    CLASS-METHODS class_teardown.
    METHODS setup.

    METHODS test_consulta_pela_matriz FOR TESTING.
    METHODS test_consulta_pela_filial FOR TESTING.
    METHODS test_parceiro_individual FOR TESTING.
    METHODS test_desempate_deterministico FOR TESTING.
    METHODS test_ignorar_outro_reltyp FOR TESTING.
ENDCLASS.

CLASS lcl_test_grupo_economico IMPLEMENTATION.

  METHOD class_setup.
    go_osql_env = cl_osql_test_environment=>create(
      i_dependency_list = VALUE #( ( 'BUT050' ) ( 'ZI_CA_GET_PARAMETER' ) ) ).
  ENDMETHOD.

  METHOD class_teardown.
    IF go_osql_env IS BOUND.
      go_osql_env->destroy( ).
    ENDIF.
  ENDMETHOD.

  METHOD setup.
    DATA lt_param TYPE STANDARD TABLE OF zi_ca_get_parameter WITH EMPTY KEY.

    go_osql_env->clear_doubles( ).

    lt_param = VALUE #(
      ( modulo = 'FI'
        chave1 = 'DEL_R2R_009'
        chave2 = 'RELTYP'
        chave3 = 'GRUPO'
        sign   = 'I'
        opt    = 'EQ'
        low    = 'UKM001' ) ).
    go_osql_env->insert_test_data( lt_param ).
  ENDMETHOD.

  METHOD test_consulta_pela_matriz.
    DATA lt_but050 TYPE tt_but050.

    lt_but050 = VALUE #(
      ( client    = sy-mandt
        relnr     = '000000000001'
        partner1  = '0000001000'
        partner2  = '0000002001'
        reltyp    = 'UKM001'
        date_from = '20240101'
        date_to   = '99991231' )
      ( client    = sy-mandt
        relnr     = '000000000002'
        partner1  = '0000001000'
        partner2  = '0000002002'
        reltyp    = 'UKM001'
        date_from = '20240101'
        date_to   = '99991231' ) ).
    go_osql_env->insert_test_data( lt_but050 ).

    lhc_clienteinadimplente=>obter_grupo_economico(
      EXPORTING
        iv_partner   = '0000001000'
      IMPORTING
        ev_matriz    = DATA(lv_matriz)
        et_parceiros = DATA(lt_parceiros) ).

    DATA(lt_esperado) = VALUE lhc_clienteinadimplente=>tt_partner(
      ( '0000001000' )
      ( '0000002001' )
      ( '0000002002' ) ).

    cl_abap_unit_assert=>assert_equals(
      act = lv_matriz
      exp = CONV bu_partner( '0000001000' )
      msg = 'A matriz retornada deve corresponder ao parceiro matriz consultado.' ).
    cl_abap_unit_assert=>assert_equals(
      act = lines( lt_parceiros )
      exp = 3
      msg = 'O grupo deve conter matriz e 2 filiais sem duplicidade.' ).
    cl_abap_unit_assert=>assert_equals(
      act = lt_parceiros
      exp = lt_esperado
      msg = 'Os parceiros do grupo devem corresponder a matriz e suas filiais.' ).
  ENDMETHOD.

  METHOD test_consulta_pela_filial.
    DATA lt_but050 TYPE tt_but050.

    lt_but050 = VALUE #(
      ( client    = sy-mandt
        relnr     = '000000000001'
        partner1  = '0000001000'
        partner2  = '0000002001'
        reltyp    = 'UKM001'
        date_from = '20240101'
        date_to   = '99991231' )
      ( client    = sy-mandt
        relnr     = '000000000002'
        partner1  = '0000001000'
        partner2  = '0000002002'
        reltyp    = 'UKM001'
        date_from = '20240101'
        date_to   = '99991231' ) ).
    go_osql_env->insert_test_data( lt_but050 ).

    lhc_clienteinadimplente=>obter_grupo_economico(
      EXPORTING
        iv_partner   = '0000002001'
      IMPORTING
        ev_matriz    = DATA(lv_matriz)
        et_parceiros = DATA(lt_parceiros) ).

    DATA(lt_esperado) = VALUE lhc_clienteinadimplente=>tt_partner(
      ( '0000001000' )
      ( '0000002001' )
      ( '0000002002' ) ).

    cl_abap_unit_assert=>assert_equals(
      act = lv_matriz
      exp = CONV bu_partner( '0000001000' )
      msg = 'A consulta pela filial deve identificar a matriz correta.' ).
    cl_abap_unit_assert=>assert_equals(
      act = lines( lt_parceiros )
      exp = 3
      msg = 'A consulta pela filial deve retornar matriz e todas as filiais irmãs sem duplicidade.' ).
    cl_abap_unit_assert=>assert_equals(
      act = lt_parceiros
      exp = lt_esperado
      msg = 'Os parceiros retornados devem conter todo o grupo econômico.' ).
  ENDMETHOD.

  METHOD test_parceiro_individual.
    lhc_clienteinadimplente=>obter_grupo_economico(
      EXPORTING
        iv_partner   = '0000003000'
      IMPORTING
        ev_matriz    = DATA(lv_matriz)
        et_parceiros = DATA(lt_parceiros) ).

    DATA(lt_esperado) = VALUE lhc_clienteinadimplente=>tt_partner(
      ( '0000003000' ) ).

    cl_abap_unit_assert=>assert_equals(
      act = lv_matriz
      exp = CONV bu_partner( '0000003000' )
      msg = 'Parceiro sem vínculo deve retornar ele mesmo como matriz.' ).
    cl_abap_unit_assert=>assert_equals(
      act = lt_parceiros
      exp = lt_esperado
      msg = 'Parceiro individual deve retornar lista com apenas 1 elemento.' ).
  ENDMETHOD.

  METHOD test_desempate_deterministico.
    DATA lt_but050 TYPE tt_but050.

    lt_but050 = VALUE #(
      ( client    = sy-mandt
        relnr     = '000000000001'
        partner1  = '0000001001'
        partner2  = '0000002001'
        reltyp    = 'UKM001'
        date_from = '20200101'
        date_to   = '20241231' )
      ( client    = sy-mandt
        relnr     = '000000000002'
        partner1  = '0000001002'
        partner2  = '0000002001'
        reltyp    = 'UKM001'
        date_from = '20250101'
        date_to   = '99991231' )
      ( client    = sy-mandt
        relnr     = '000000000003'
        partner1  = '0000001002'
        partner2  = '0000002002'
        reltyp    = 'UKM001'
        date_from = '20250101'
        date_to   = '99991231' ) ).
    go_osql_env->insert_test_data( lt_but050 ).

    lhc_clienteinadimplente=>obter_grupo_economico(
      EXPORTING
        iv_partner   = '0000002001'
      IMPORTING
        ev_matriz    = DATA(lv_matriz)
        et_parceiros = DATA(lt_parceiros) ).

    DATA(lt_esperado) = VALUE lhc_clienteinadimplente=>tt_partner(
      ( '0000001002' )
      ( '0000002001' )
      ( '0000002002' ) ).

    cl_abap_unit_assert=>assert_equals(
      act = lv_matriz
      exp = CONV bu_partner( '0000001002' )
      msg = 'O desempate determinístico deve selecionar sempre a matriz do vínculo vigente.' ).
    cl_abap_unit_assert=>assert_equals(
      act = lt_parceiros
      exp = lt_esperado
      msg = 'O grupo econômico deve corresponder ao da matriz vigente.' ).
  ENDMETHOD.

  METHOD test_ignorar_outro_reltyp.
    DATA lt_but050 TYPE tt_but050.

    lt_but050 = VALUE #(
      ( client    = sy-mandt
        relnr     = '000000000001'
        partner1  = '0000004000'
        partner2  = '0000004001'
        reltyp    = 'BUR001'
        date_from = '20240101'
        date_to   = '99991231' )
      ( client    = sy-mandt
        relnr     = '000000000002'
        partner1  = '0000004002'
        partner2  = '0000004000'
        reltyp    = 'BUR001'
        date_from = '20240101'
        date_to   = '99991231' ) ).
    go_osql_env->insert_test_data( lt_but050 ).

    lhc_clienteinadimplente=>obter_grupo_economico(
      EXPORTING
        iv_partner   = '0000004000'
      IMPORTING
        ev_matriz    = DATA(lv_matriz)
        et_parceiros = DATA(lt_parceiros) ).

    DATA(lt_esperado) = VALUE lhc_clienteinadimplente=>tt_partner(
      ( '0000004000' ) ).

    cl_abap_unit_assert=>assert_equals(
      act = lv_matriz
      exp = CONV bu_partner( '0000004000' )
      msg = 'Vínculos de outros tipos de relação devem ser ignorados.' ).
    cl_abap_unit_assert=>assert_equals(
      act = lt_parceiros
      exp = lt_esperado
      msg = 'Apenas o parceiro consultado deve ser retornado quando não há vínculo UKM001.' ).
  ENDMETHOD.

ENDCLASS.
```
