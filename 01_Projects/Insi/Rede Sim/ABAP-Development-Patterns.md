# ABAP Development Patterns - REDESIM

> Contexto de alto nível para GitHub Copilot. Padrões de desenvolvimento praticados na Rede Sim.

---

## 1. Estrutura Organizacional

### 1.1 Módulos SAP
Cada desenvolvimento deve estar associado a um módulo SAP:

| Sigla | Descrição |
|-------|-----------|
| AM | Assets Management |
| BC | Basis Component |
| CO | Cost Accounting |
| FI | Financial Accounting |
| FSCM | Financial Supply Chain Management |
| GL | Cross Applications |
| MM | Materials Management |
| PP | Production Planning |
| PS | Project System |
| SD | Sales and Distribution |
| WF | Workflow |
| WM | Warehouse Management |
| CA | Cross Application (objetos reutilizáveis) |

### 1.2 Pacotes
**Padrão:** `Z[MD]_PROCESSO_ESPECIFICIDADE`

```
Estrutura Hierárquica:
├── ZRDS (Super-Pacote Raiz)
│   ├── Z[MD] (Pacote por Módulo)
│   │   └── Z[MD]_PROCESSO (Pacote por Processo)
│   │       └── Z[MD]_ESPECIFICA (Pacote de Desenvolvimento)
│   
└── ZCA (Cross Application - Reutilizáveis)
    └── Sub-pacotes por processo (opcional)
```

**Exemplo:** `ZPP_PRODUCAO_ESTOQUE` → `ZPP_AJUSTE_INVENTARIO`

---

## 2. Nomenclatura de Objetos

### 2.1 Programas
**Padrão:** `Z[MD][TIPO]_DESCRICAO`

| Tipo | Código | Exemplo |
|------|--------|---------|
| Carga | C | `ZFIC_CALCULO_FISCAL` |
| Interface | I | `ZFII_INTEGRACAO_NF` |
| Formulário | F | `ZCOF_RELATORIO_CUSTOS` |
| Relatório | R | `ZPPR_PRODUCAO_MENSAL` |
| Workflow | W | `ZSDW_APROVACAO_PEDIDO` |

### 2.2 Classes, Interfaces e Exceções
**Padrão:** `Z[TIPO][MD]_DESCRICAO`

```abap
ZCL_MD_DescricaoClasse        ! Classe global
ZIF_MD_DescricaoInterface     ! Interface global
ZCX_MD_DescricaoExcecao       ! Classe de exceção
```

**Exemplo:**
```abap
ZCL_FI_CALCULO_IMPOSTO
ZIF_SD_PROCESSAMENTO_PEDIDO
ZCX_MM_ERRO_ESTOQUE
```

### 2.3 Módulo Pool
**Padrão:** `Z[MD][TIPO]_DESCRICAO`

Mesma estrutura de programas, utilizado para telas DYNPRO.

### 2.4 Includes
**Padrão:** `Z[MD][TIPO]_DESCRICAO_[SUFIXO]`

| Sufixo | Destino |
|--------|---------|
| TOP | Declarações globais |
| PBO | Process Before Output |
| PAI | Process After Input |
| F01, F02 | Funções específicas |
| E | Exit/Enhancement |

**Exemplo:** `ZFIP_RELATORIO_TOP`, `ZFIP_RELATORIO_PBO`

### 2.5 Funções
**Padrão:** `Z[MD]_DESCRICAO_ACAO`

```abap
ZFM_FI_CALCULA_IMPOSTO
ZFM_SD_VALIDA_CLIENTE
```

### 2.6 Transações
**Padrão:** `Z[MD][SEQUENCIAL]`

```abap
ZFI01 - Lançamento Fiscal
ZSD02 - Gestão de Pedidos
```

### 2.7 Tabelas Transparentes
**Padrão:** `ZT[MD]_DESCRICAO`

```abap
ZTTAX_ALIQUOTAS
ZTMLL_ESTOQUES
```

### 2.8 Estruturas
**Padrão:** `ZS[MD]_DESCRICAO`

```abap
ZSCL_CLIENTE
ZSPP_PRODUCAO
```

### 2.9 Domínios e Elementos de Dados
**Padrão:** `ZD_DESCRICAO`, `ZE_DESCRICAO`

```abap
ZD_SITUACAO_PEDIDO
ZE_VALOR_IMPOSTO
```

### 2.10 Visões, Vistas e Clusters
**Padrão:** `ZV[MD]_DESCRICAO`, `ZCV[MD]_DESCRICAO`

```abap
ZVFI_SALDOS_CLIENTES
ZCVSD_PEDIDOS_ABERTOS
```

### 2.11 Banco de Dados Lógico
**Padrão:** `ZBD[MD]_TABELA_PRIMARIA`

### 2.12 SmartForms, SAP Script, Adobe Forms
**Padrão:** `ZSF[MD]_DESCRICAO`, `ZSS[MD]_DESCRICAO`, `ZAF[MD]_DESCRICAO`

```abap
ZSFFIC_NOTA_FISCAL
ZSSMM_ETIQUETA_MATERIAL
ZAFSD_CONTRATO
```

### 2.13 Classe de Mensagem
**Padrão:** `Z[MD]_DESCRICAO`

Usar transação `SE91` para criar mensagens estruturadas.

### 2.14 Enhancement e BADI
**Padrão:** `ZEI[MD]_DESCRICAO`, `Z[MD]_DESCRICAO`

```abap
ZEIFI_VALIDACAO_NOTA
ZBADI_SD_PROCESSAMENTO
```

### 2.15 Tipo de IDoc, Mensagem e Segmento
**Padrão:** `Z[MD]TI_DESCRICAO`, `Z[MD]TM_DESCRICAO`, `Z[MD]SI_DESCRICAO`

```abap
ZFITINF - Tipo de IDoc: Nota Fiscal
ZFITMN - Tipo de Mensagem
ZFTISEG - Segmento de IDoc
```

### 2.16 Telas (Screen)
**Padrão:** Numérico entre 9000-9999

```
Exemplo: 9100, 9200, 9300
```

### 2.17 CDS Views
**Padrão:** `ZI[MD]_DESCRICAO`, `ZC[MD]_DESCRICAO`

```abap
ZI_SD_CLIENTES           ! View Básica (Interface)
ZC_SD_CLIENTES           ! View de Consumo (Consumption)
ZI_SD_VH_CLIENTE         ! Value Help View
```

Access Control: usar mesmo nome da View com sufixo `_AC`

### 2.18 Service Definition e Binding
**Padrão:** `ZUI_DESCRICAO`, `ZAPI[MD]_DESCRICAO`

**Service Binding:**
```abap
ZUI_O2_DESCRICAO         ! OData V2 - Fiori
ZUI_O4_DESCRICAO         ! OData V4 - Fiori
ZAPI_O2_DESCRICAO        ! OData V2 - API
ZAPI_O4_DESCRICAO        ! OData V4 - API
```

### 2.19 SEGW (Projeto)
**Padrão:** `Z[MD]_DESCRICAO`

Alterar nomes das classes geradas para seguir padrão global.

### 2.20 Número Sequencial (SNRO)
**Padrão:** `Z_DESCRICAO_DO_INTERVALO`

### 2.21 Objeto e Sub-Objeto de Log
**Padrão:** `Z[MD]_DESCRICAO_LOG` / `DESCRICAO_DO_SUB_OBJETO`

Usar transação `SLG0` para definição.

### 2.22 Objeto de Autorização
**Padrão:** `Z_DESCRICAO_AUTORIZACAO`

Sempre incluir campo `ACTVT` (Atividades) com opções necessárias.

---

## 3. Convenção de Nomes - Prefixos

### 3.1 Escopo Global (Programas)
```abap
TYPES       TY_*           ! Tipo global
CONSTANTS   GC_*           ! Constante global
VARIABLES   GV_*           ! Variável global
TABELA      GT_*           ! Tabela interna global
ESTRUTURA   GS_*           ! Estrutura global
FIELD-SYMBOLS <GFS_*>      ! Field symbol global
TABLE CONTROL   TC_*       ! Table control
TABLE STRIP     TS_*       ! Table strip
PARAMETER   P_*            ! Parâmetro de entrada
SELECT-OPTIONS S_*         ! Opções de seleção
```

### 3.2 Escopo FORM
```abap
FORM F_*                   ! Nome da FORM
USING   UV_*, UT_*, US_*   ! Parâmetro USING
CHANGING CV_*, CT_*, CS_*  ! Parâmetro CHANGING
TABLES  LT_*               ! Tabelas (obsoleto, evitar)
```

### 3.3 Escopo Classes/Interfaces
```abap
TYPE        TY_*           ! Tipo da classe
TABLE TYPE  TT_*           ! Tipo tabela da classe
CONSTANTS   GC_*           ! Constante da classe
RANGE       GR_*           ! Range da classe
VARIABLES   GV_*           ! Variável da classe
STRUCTURE   GS_*           ! Estrutura da classe
OBJECT      GO_*           ! Objeto da classe
REFERENCE   GRR_*          ! Referência da classe
```

### 3.4 Métodos - Parâmetros
```abap
IMPORTING   IV_*, IS_*, IT_*, IO_*, IR_*   ! Importando
EXPORTING   EV_*, ES_*, ET_*, EO_*, ER_*   ! Exportando
CHANGING    CV_*, CS_*, CT_*, CO_*, CR_*   ! Alterando
RETURNING   RV_*, RS_*, RT_*, RO_*, RR_*   ! Retornando
```

### 3.5 Escopo Local (Métodos/Forms/Funções)
```abap
TYPES       TY_*           ! Tipo local
TABLE TYPE  TT_*           ! Tipo tabela local
CONSTANTS   LC_*           ! Constante local
RANGE       LR_*           ! Range local
VARIABLES   LV_*           ! Variável local
TABLE       LT_*           ! Tabela interna local
OBJECT      LO_*           ! Objeto local
STRUCTURE   LS_*           ! Estrutura local
FIELD-SYMBOLS <FS_*>       ! Field symbol local
REFERENCE   LRF_*          ! Referência local
```

### 3.6 Tipo de Dados - Sufixos
```
V = Valor (simples)
S = Estrutura (structure)
T = Tabela (table)
O = Objeto (object)
R = Range / Referência (range/reference)
```

---

## 4. Criação de Aplicativos Front-End

### 4.1 Nome do APP (Module Name)
- Máximo 21 caracteres
- Descritivo e único
- Exemplo: `MaterialCostAnalysis`

### 4.2 Namespace (Application Namespace)
**Padrão Fixo:** `br.com.trescoracoes`

Concatenado com nome do APP: `br.com.trescoracoes.MaterialCostAnalysis`

### 4.3 Objeto BSP para Deploy
**Padrão:** `ZZ1_ABREVIADO` (máximo 12 caracteres)

```abap
ZZ1_MTRCCOST  ! Para MaterialCostAnalysis
ZZ1_CLNTMNGT  ! Para ClientManagement
```

### 4.4 IDE de Desenvolvimento
- VSCode ou BAS (livre escolha)
- Versionamento: GitLab da Rede Sim

---

## 5. Core Data Services (CDS)

### 5.1 View Básica (Interface)
**Padrão:** `ZI[MD]_DESCRICAO`

```abap
@AccessControl.authorizationCheck: #CHECK
define view ZI_SD_CLIENTES as select from kna1 {
  key kna1.kunnr as client_id,
  kna1.name1 as client_name,
  kna1.ort01 as city
}
```

### 5.2 View Composite
**Padrão:** `ZI[MD]_DESCRICAO_COMP`

Agregação de múltiplas views básicas.

### 5.3 View de Consumo (Projection)
**Padrão:** `ZC[MD]_DESCRICAO`

Camada de segurança e transformação para consumo.

### 5.4 Value Help / Help Search
**Padrão:** `ZI[MD]_VH_DESCRICAO`

```abap
define view ZI_SD_VH_CLIENTE as select from ZI_SD_CLIENTES {
  key client_id,
  client_name
}
```

### 5.5 Access Control
**Padrão:** Mesmo nome da View + sufixo `_AC`

```abap
@MappingRole: true
define role ZI_SD_CLIENTES_AC {
  grant select on ZI_SD_CLIENTES
    where client_id in (
      select client_id from zcl_clientes_auth
    );
}
```

---

## 6. HANA (Advanced Data Management Processing)

### 6.1 Table Function (AMDP)
**Padrão:** `ZTB[MD]_DESCRICAO`, `ZCL[MD]_IMPLEMENTACAO`

```abap
class ZCL_FI_CALCULO_IMPOSTO definition public.
  public section.
    class-methods: get_imposto_rates
      importing iv_tipo type string
      exporting table et_rates type tt_imposto
      using sqlscript.
endclass.

class ZCL_FI_CALCULO_IMPOSTO implementation.
  method get_imposto_rates by database procedure
    language sqlscript options read-only using ztax_rates.
    et_rates = select * from ztax_rates where tipo = iv_tipo;
  endmethod.
endclass.
```

### 6.2 Calculation View
**Padrão:** `ZEXV[MD]_DESCRICAO`

External View no dicionário de dados.

### 6.3 Método AMDP
**Padrão:** `GET_DESCRICAO_ACAO`

---

## 7. Padrões Fiori

### 7.1 Processo de Implementação
1. Verificar se existe APP standard no SAP App Library
2. Se atende parcialmente, avaliar possibilidade de ampliação
3. Se não existe, definir modelo de desenvolvimento
4. Implementar e disponibilizar no Launchpad

### 7.2 Modelos de Desenvolvimento

#### Modelo 1: ABAP Clássico
- Baseado em SEGW com DDIC
- Módulos de função e Search Help
- Function Imports
- **Quando usar:** Pequenas adaptações de transações existentes

#### Modelo 2: ABAP Programming Model
- CDS Views + BOPF/RDS
- Annotations para UI
- **Quando usar:** Aplicações medium-complexity com validações

#### Modelo 3: ABAP Restful Programming Model (RAP)
- CDS Views com Projection e Definition
- Behavior Definition e Implementation
- **Quando usar:** Aplicações modernas com lógica complexa

### 7.3 Launchpad Designer

#### Catálogo Técnico
**Padrão:** `ZTC[MD]ESCOPO`

```
ZTC_PP_BJ8
├── TC = Technical Catalog
├── MD = Módulo (PP)
└── ESCOPO = Scope Item ID
```

#### Catálogo de Negócios
**Padrão:** `ZBC[MD]ESCOPO`

```
ZBC_PP_BJ8
├── BC = Business Catalog
├── MD = Módulo
└── ESCOPO = Scope Item ID
```

#### Grupo de Catálogos
**Padrão:** `ZGP[MD]ESCOPO`

```
ZGP_PP_BJ8
├── GP = Group Catalog
├── MD = Módulo
└── ESCOPO = Scope Item ID
```

#### Target Mapping
- **Objeto Semântico:** Nome do APP
- **Ação:** Nome da ação do processo
- **Unicidade:** Combinação Objeto + Ação deve ser única

---

## 8. Requests e Transporte

### 8.1 Nomenclatura da Request
**Padrão:** `[GAP-ID]-DESCRICAO`

```
FIAA-01 - Inclusão de denominação no material
SD002 - Validação de cliente no pedido
```

### 8.2 Processo de Transporte
1. Líder Meta cria Request por GAP
2. Desenvolvedor libera TASK com validação ATC
3. Transporte automático para qualidade

### 8.3 Objetos Reutilizáveis
- Salvar em Request padrão: `S4DK900336 - [Equipe ABAP]-[Objetos Iniciais]`
- Após criar, objetos não podem sofrer alterações
- Verificar uso com `Ctrl+Shift+F12` no objeto

---

## 9. Regras de Desenvolvimento

### 9.1 Linguagem Padrão
- Todos os objetos e descrições em **português (PT)**
- Comentários de código em português
- Textos e mensagens em português

### 9.2 Priorizar Classes Globais
**Objetivos:**
- Orientação a Objetos
- Reutilização de código
- Evitar desenvolvimento estruturado
- Maximizar ABAP Doc

**Exemplo:**
```abap
! ❌ EVITAR - Lógica em programa
REPORT zprograma_principal.
PERFORM processar_nota.

! ✅ RECOMENDADO - Lógica em classe
REPORT zprograma_principal.
DATA: lo_nf_processor TYPE REF TO zcl_fi_nota_fiscal.
CREATE OBJECT lo_nf_processor.
lo_nf_processor->processar_documento( ).
```

### 9.3 Pretty Printer
**Aplicar:** em todos os códigos desenvolvidos
- Atalho Eclipse: `Shift+F1`
- Padroniza indentação, espaçamento e formatting

### 9.4 Evitar Hard Code
**Regra:** Usar constantes ao invés de valores literais

```abap
! ❌ EVITAR
IF sy-tcode = 'VA01'.

! ✅ RECOMENDADO
CONSTANTS lc_tcode_create TYPE sy-tcode VALUE 'VA01'.
IF sy-tcode = lc_tcode_create.
```

**Exceção:** Apenas em SHDB (Batch Input Recording)

### 9.5 Alterações em Código Standard
**Ordem de Prioridade:**
1. BADI (Business Add-In)
2. Exit's (User Exits / SMOD)
3. Enhancement (último recurso)

### 9.6 Implementar BADI
Para BADI's sem múltiplas implementações:

```abap
! BADI Method
METHOD if_ex_my_badi~process.
  INCLUDE ZMMI_BADI IF FOUND.
ENDMETHOD.

! Arquivo: ZMMI_BADI
* Toda lógica dentro deste include
DATA: lv_valor TYPE i VALUE 100.
* Implementação completa
```

### 9.7 Exit's e Enhancement
Sempre utilizar INCLUDE com IF FOUND:

```abap
* Exit na transação VA01
INCLUDE ZMMI_EXIT IF FOUND.

* Arquivo: ZMMI_EXIT
* Implementação do exit
PERFORM validar_documento.
```

**⚠️ Evitar Enhancement Implícita** - Alinhar com frente técnica antes.

### 9.8 Comandos a Evitar

| Comando | Contexto | Motivo |
|---------|----------|---------|
| COMMIT WORK | Exits, BADIs, Enhancement | Pode quebrar transação pai |
| CHECK | Fora de LOOP | Usa EXIT ao invés |
| SELECT single | Em loop | Usar tabela hash |
| OPEN CURSOR | Com número fixo | Usar variável |

### 9.9 Exportar/Importar Dados em Memória
**Padrão:** Sempre informar o objeto de origem/destino

```abap
! ❌ EVITAR
EXPORT gv_cliente TO MEMORY ID 'ID'.
IMPORT gv_cliente FROM MEMORY ID 'ID'.

! ✅ RECOMENDADO
CONSTANTS lc_memory_id TYPE string VALUE 'ZFI_CLIENTE'.
EXPORT gv_cliente TO MEMORY ID lc_memory_id.
IMPORT gv_cliente FROM MEMORY ID lc_memory_id.

! Comentar origem
* Importa registro de cliente do Include ZMMI_EXIT
IMPORT gv_cliente FROM MEMORY ID lc_memory_id.
```

### 9.10 Interfaces com PO
Usar direto: **SXI_MONITOR** com Integration Engine

### 9.11 Interfaces sem PO
Sempre criar Log usando BOPF:

```abap
! Padrão BOPF para logging
DATA: lo_bopf_manager TYPE REF TO zcl_bopf_logger.
CREATE OBJECT lo_bopf_manager.

lo_bopf_manager->log_interface_event(
  iv_object = 'INTERFACE_01'
  iv_event = 'PROCESSAMENTO'
  iv_status = 'SUCESSO'
  iv_message = 'Documento processado com sucesso'
).
```

---

## 10. Diretrizes de Desenvolvimento

### 10.1 Validações de Transação
**❌ Não usar código da transação:**
```abap
IF sy-tcode = 'VA01' OR sy-tcode = 'VA02'.
  PERFORM validar_pedido.
ENDIF.
```

**✅ Usar objetos de negócio:**
```abap
IF lr_pedido->is_novo_pedido( ) = abap_true.
  lr_pedido->validar( ).
ENDIF.
```

### 10.2 Validações de Usuário
**❌ Não usar nome de usuário:**
```abap
IF sy-uname NE 'WEBAPPREMOTE'.
  PERFORM autorizar_acao.
ENDIF.
```

**✅ Usar objeto de autorização:**
```abap
AUTHORITY-CHECK OBJECT 'Z_ENTRADA_MANUAL'
  ID 'ACTVT' FIELD '03'
  ID 'TABELA' FIELD 'ZTAB_PEDIDOS'.
IF sy-subrc NE 0.
  MESSAGE E001 RAISING error_no_authority.
ENDIF.
```

### 10.3 Variáveis de Seleção (STVARV)
**⚠️ Evitar para cenários de negócio** - Inseguro, principalmente com interação do usuário

**Alternativas:**
1. **Tabela de Parâmetros** (Recomendado)
   - Aplicativo dedicado com autorização
   - Manutenção segura pelo usuário
   
2. **Tabela Customizada Z**
   - Quando tabela de parâmetros for insuficiente
   - Incluir campos de auditoria (usuário, data/hora)

3. **Objeto de Autorização**
   - Para validações de perfil/função

### 10.4 Tabela de Parâmetros
Usar aplicativo padrão para cadastro de parâmetros:
- Inclui objeto de autorização
- Interface amigável
- Histórico de alterações

Consultar documento: "Utilização da tabela de Parâmetros"

---

## 11. Code Inspector (ABAP Test Cockpit)

### 11.1 Variante Padrão: ZREDESIM
Executar em todos os desenvolvimentos antes de liberar TASK.

**Não são aceitos códigos com erros** no resultado desta validação.

### 11.2 Áreas de Validação
- ✅ Verificações de Performance
- ✅ Core Data Services (CDS)
- ✅ Verificação de Sintaxe
- ✅ Programação Robusta
- ✅ Convenções de Programação (nomes)

### 11.3 Como Executar (Eclipse)
```
1. Abrir objeto no Eclipse
2. Clicar com botão direito → Run As → ABAP Test Cockpit
3. Inserir variante: ZREDESIM
4. Verificar aba: ATC problems
```

---

## 12. Documentação ABAP Doc

### 12.1 Padrão de Documentação
Documentar classes com ABAP Doc para gerar documentação automática.

**Exemplo:**
```abap
"! <p class="shorttext synchronized" lang="en">Class for financial document processing</p>
"!
"! <p>Responsible for:</p>
"! <ul>
"!   <li>Reading financial documents</li>
"!   <li>Validating amounts and dates</li>
"!   <li>Posting to ledger</li>
"! </ul>
"!
"! @parameter iv_document_id | Document ID to process
"! @parameter ev_result | Result of processing (SUCCESS/ERROR)
"! @raises ZCX_FI_INVALID_DOCUMENT | When document format is invalid

class ZCL_FI_DOCUMENT_PROCESSOR definition public final create public.
  public section.
    methods: process_document
      importing
        iv_document_id type string
      exporting
        ev_result type string
      raising
        ZCX_FI_INVALID_DOCUMENT.
endclass.
```

### 12.2 Benefícios
- Documentação automática
- Hover info no editor
- Geração de documentos externos
- Melhor manutenibilidade

---

## 13. Comentário de Controle Padrão

Inserir bloco de comentário em todo programa criado:

```abap
"*******************************************************************************
"* © REDE SIM
"*******************************************************************************
"*
"* DESCRIÇÃO: [DESCRIÇÃO DO PROGRAMA]
"* AUTOR : [NOME DO DESENVOLVEDOR] – [CONSULTORIA]
"* FUNCIONAL: [NOME DO FUNCIONAL] – [CONSULTORIA]
"* DATA : [DATA]
"*
"*******************************************************************************
"* HISTÓRICO DAS MODIFICAÇÕES
"*---------------------------------------------------------------------
"* DATA       | AUTOR        | DESCRIÇÃO
"*---------------------------------------------------------------------
"* XX/XX/XXXX | [AUTOR]      | [DESCRIÇÃO DA ALTERAÇÃO]
"*
"*******************************************************************************
```

---

## 14. Resumo de Checkpoints

### Antes de Liberar Código
-  Nomenclatura segue padrão (programa, classe, pacote, etc)
-  Prefixos de variáveis aplicados corretamente
-  Executado Pretty Printer (Shift+F1)
-  Sem hard code (apenas constantes)
-  Lógica em classes globais (não estruturado)
-  Passado Code Inspector (variante ZREDESIM)
-  ABAP Doc nas classes públicas
-  Bloco de comentário de controle preenchido
-  Sem COMMIT WORK em Exit/BADI/Enhancement
-  Seguiu prioridade: BADI → Exit → Enhancement
-  Language check passou

### Antes de Transportar
-  Request nomeada corretamente `[GAP-ID]-DESCRICAO`
-  Objetos reutilizáveis em `S4DK900336`
-  TASK liberada com ATC validado
-  Pacote correto (Z[MD]_PROCESSO_ESPECIFICA)
-  Todos os objetos dependentes inclusos

---

**Versão:** 1.0 | **Data:** 03/04/2022 | **Atualizado:** 2026-08-19
