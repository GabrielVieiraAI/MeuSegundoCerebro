---
tags:
  - projeto
  - insi
  - veiling-holambra
  - sap
  - abap
  - padrao-nomenclatura
---

# Padrão de Nomenclatura ABAP
**Objetos de repositório, CDS, Fiori e prefixos de código · versão geral**

---
## 1. Objetivo

Este documento define os nomes de objetos e os prefixos de código usados nos desenvolvimentos ABAP dos projetos. É a mesma base usada no code review das requests: objeto novo fora deste padrão volta para ajuste antes da liberação.

Esta é a versão geral, sem regras específicas de cliente. Quando o cliente tiver padrão próprio, o padrão do cliente prevalece.

---

## 2. Convenções

| Item | Regra |
| :--- | :--- |
| `[MD]` | Sigla do módulo SAP, de 2 a 4 letras: `FI`, `CO`, `SD`, `MM`, `PP`, `PM`, `QM`, `HR`, `PS`, `TRM`... Para objetos de uso geral (cross-application), `CA`. |
| Módulo x pacote | A sigla do módulo no nome deve ser a mesma do pacote onde o objeto está. |
| Separador | `_` entre o prefixo e a descrição. |
| `<desc>` | Descrição abreviada, em português. |
| Idioma | Objetos criados com idioma original português (PT) e descrições em português. |
| Objeto local | Objetos locais (`$TMP`) usam o prefixo `Y`. Objeto `Y*` não deve ir em request. |

---

## 3. Pacotes

| Nível | Padrão | Exemplo |
| :--- | :--- | :--- |
| Superpacote do projeto | `Z<sigla do projeto>` | Descrição: Superpackage - Objetos de Desenvolvimento |
| Cross-application | `ZCA` | Objetos reutilizáveis por vários módulos, com CA no lugar do módulo |
| Pacote do módulo | `Z<módulo>` | `ZFIGL` — Contabilidade |
| Pacote do GAP | `Z<código do GAP>` | `ZFIGL01` — Agrupamento de documentos |

Os pacotes de GAP ficam dentro do pacote do módulo, e os pacotes de módulo dentro do superpacote do projeto. Antes de criar, verifique se o pacote do processo já existe.

---

## 4. Programas e includes

| Objeto | Padrão | Exemplo / observação |
| :--- | :--- | :--- |
| Programa (SE38) | `Z[MD][T]_<desc>` | `T` = `C` carga, `I` interface, `F` formulário, `R` relatório, `W` workflow. Ex.: `ZSDR_LISTA_REMESSAS` |
| Module pool | igual ao programa | `ZMMC_CARGA_MATERIAL` |
| Include | `Z[MD][T]_<desc>_<tipo>` | `T` = `C`/`I`/`F`/`R`/`W` ou `E` exit/enhancement. Tipo: `TOP`, `PBO`, `PAI`, `F01`, `F02`... ou sem tipo. Ex.: `ZSDR_LISTA_REMESSAS_TOP` |
| Include de exit / BAdI | `Z[MD]I_<desc>` ou `Z[MD]E_<desc>` | `ZMMI_EXIT`, chamado com `INCLUDE ... IF FOUND` |
| Tela (dynpro) | número de `9000` a `9999` | |

---

## 5. Classes, interfaces e funções

| Objeto | Padrão | Exemplo / observação |
| :--- | :--- | :--- |
| Classe | `ZCL[MD]_<desc>` | Vale para todas as classes: comum, AMDP/table function, classes geradas pela SEGW e behavior pool. Ex.: `ZCLSD_RETORNO_REMESSA`. `ZCL_SD_*` está fora do padrão |
| Interface | `ZIF[MD]_<desc>` | `ZIFSD_CONSTANTES` |
| Classe de exceção | `ZCX[MD]_<desc>` | `ZCXSD_ERRO_ENVIO` |
| Classe local | `LCL_<desc>` | |
| Grupo de funções | `ZFG[MD]_<desc>` | `ZFGSD_INTERFACES` |
| Módulo de função (inclui IDoc) | `ZFM[MD]_<desc>` | `ZFMSD_ENVIA_REMESSA` |

---

## 6. Dicionário de dados

| Objeto | Padrão | Exemplo / observação |
| :--- | :--- | :--- |
| Tabela transparente | `ZT[MD]_<desc>` | `ZTSD_LOG_ENVIO` |
| Estrutura | `ZS[MD]_<desc>` | `ZSSD_DADOS_NF` |
| Categoria de tabela | `ZCTG[MD]_<desc>` | `ZCTGSD_DADOS_NF` |
| Visão (SE11) | `ZV[MD]_<desc>` | |
| Cluster de visão | `ZCV[MD]_<desc>` | |
| Elemento de dados | `ZE_<desc>` | Sem módulo. Ex.: `ZE_STATUS_ENVIO` |
| Domínio | `ZD_<desc>` | Sem módulo. Ex.: `ZD_STATUS_ENVIO` |
| Ajuda de pesquisa | `ZH[MD]_<desc>` | |
| Banco de dados lógico | `ZBD[MD]_<desc>` | Descrição da tabela primária |

---

## 7. Formulários, mensagens e imagens

| Objeto | Padrão | Exemplo / observação |
| :--- | :--- | :--- |
| Smart Form | `ZSF[MD]_<desc>` | |
| SAPscript | `ZSS[MD]_<desc>` | |
| Adobe Form | `ZAF[MD]_<desc>` | `ZAFMM_CONT_INVENTARIO` |
| Smart Style | `ZST[MD]_<desc>` | |
| Classe de mensagens | `Z[MD]_<desc>` | `ZSD_RETORNO` |
| Logo bitmap (SE78) | `Z<empresa>_<desc>` | Código da empresa |
| Imagem bitmap | `Z_<desc>` | |

---

## 8. Ampliações

| Objeto | Padrão | Exemplo / observação |
| :--- | :--- | :--- |
| Enhancement implementation | `ZEI[MD]_<desc>` | `ZEISD_PRECO_LIQUIDO` |
| Implementação de BAdI | `Z[MD]_<desc>` | |
| Projeto CMOD | `Z[MD]_<desc>` | |

---

## 9. Integração

| Objeto | Padrão | Exemplo / observação |
| :--- | :--- | :--- |
| Tipo de IDoc (WE30) | `Z[MD]TI_<desc>` | `TI` = tipo de IDoc |
| Tipo de mensagem (WE81) | `Z[MD]TM_<desc>` | `TM` = tipo de mensagem |
| Segmento de IDoc (WE31) | `Z[MD]SI_<desc>` | `SI` = segmento de IDoc |
| Projeto SEGW | `Z[MD]_<desc>` | Renomear as classes geradas (MPC/DPC e extensões) para `ZCL[MD]_<desc>` |
| Objetos SPROXY | prefixo `Z[MD]` na geração | Gerar a partir da interface de serviço; os nomes gerados pelo SPROXY não seguem o restante do padrão |

---

## 10. Outros objetos

| Objeto | Padrão | Exemplo / observação |
| :--- | :--- | :--- |
| Transação | `Z[MD]<sequencial>` | `ZSD001` |
| Área de menu | `Z[MD]_<desc>` | |
| Range de números (SNRO) | `Z<desc>` | |
| Objeto de log (SLG0) | `Z[MD]_<desc>` | Subobjeto com nome livre |
| Objeto de autorização (SU21) | `Z<desc>` | Sempre com o campo `ACTVT`; os demais campos conforme a necessidade |

---

## 11. CDS, RAP e HANA

| Objeto | Padrão | Exemplo / observação |
| :--- | :--- | :--- |
| CDS basic / composite | `ZI_[MD]_<desc>` | |
| CDS consumption / projection | `ZC_[MD]_<desc>` | |
| CDS de value help | `ZI_[MD]_VH_<desc>` | `ZI_SD_VH_CLIENTE` |
| SQL view da CDS | `ZV[MD]_<desc>` | `@AbapCatalog.sqlViewName` |
| Access control (DCL) | mesmo nome da CDS | |
| Metadata extension | mesmo nome da CDS | |
| BDEF | mesmo nome da CDS raiz | |
| Behavior pool | `ZCL[MD]_<desc>` | Regra única de classe |
| Service definition | `ZUI_[MD]_<desc>` ou `ZAPI_[MD]_<desc>` | `ZUI_MM_TRANSF` |
| Service binding | `ZUI_<O2\|O4>_[MD]_<desc>` ou `ZAPI_<O2\|O4>_[MD]_<desc>` | `O2` = OData V2, `O4` = OData V4, conforme o binding. Ex.: `ZUI_O4_MM_TRANSF` |
| Table function (AMDP) | `ZTB_[MD]_<desc>` | Classe de implementação: `ZCL[MD]_<desc>`; métodos `GET_<ação>` |
| Método AMDP | `AMDP_<ação>` | |
| Calculation view (external view) | `ZEXV[MD]_<desc>` | |

---

## 12. Fiori

| Objeto | Padrão | Exemplo / observação |
| :--- | :--- | :--- |
| Nome do app (module name) | até 21 caracteres | |
| Namespace da aplicação | `br.com.<identificador>` | Deve começar com `br.com.`; o identificador depois dele é definido por projeto |
| Objeto BSP (deploy) | `ZZ1_<nome abreviado>` | Até 15 caracteres no total (12 depois do prefixo) |
| Catálogo técnico | `ZTC_[MD]_<scope item>` | `ZTC_PP_BJ8` |
| Catálogo de negócio | `ZBC_[MD]_<scope item>` | `ZBC_PP_4B5` |
| Grupo de catálogos | `ZGP_[MD]_<scope item>` | `ZGP_PP_BJ8` |
| Target mapping | objeto semântico = nome do app | A combinação objeto + ação deve ser única |

---

## 13. Prefixos no código

### Declarações

| Declaração | Programa (global) | Atributo de classe / interface | Local (método, FORM, função) |
| :--- | :--- | :--- | :--- |
| `TYPES` | `TY_` | `TY_` | `TY_` |
| `TYPE TABLE` | `TT_` | `TT_` | `TT_` |
| `CONSTANTS` | `GC_` | `GC_` | `LC_` |
| Variável | `GV_` | `GV_` | `LV_` |
| Estrutura | `GS_` | `GS_` | `LS_` |
| Tabela interna | `GT_` | `GT_` | `LT_` |
| Range | `GR_` | `GR_` | `LR_` |
| Objeto | `GO_` | `GO_` | `LO_` |
| Referência | `GRR_` | `GRR_` | `LRF_` |
| Field-symbol | `<GFS_` | — | `<FS_` |

*Em programa, `TYPE TABLE`, range, objeto e referência usam os mesmos prefixos dos atributos de classe.*

### Tela de seleção, telas e FORM

| Declaração | Prefixo |
| :--- | :--- |
| `PARAMETERS` | `P_` |
| `SELECT-OPTIONS` | `S_` |
| Table control | `TC_` |
| Tabstrip | `TS_` |
| Nome do FORM | `F_` |
| Parâmetro `USING` | `UV_` / `UT_` / `US_` |
| Parâmetro `CHANGING` | `CV_` / `CT_` / `CS_` |

### Parâmetros de método e de função

| Tipo | Prefixo |
| :--- | :--- |
| `IMPORTING` | `IV_` / `IS_` / `IT_` / `IO_` / `IR_` |
| `EXPORTING` | `EV_` / `ES_` / `ET_` / `EO_` / `ER_` |
| `CHANGING` | `CV_` / `CS_` / `CT_` / `CO_` / `CR_` |
| `RETURNING` (método) | `RV_` / `RS_` / `RT_` / `RO_` / `RR_` |
| `TABLES` (função) | Obsoleto: não usar |

*Letra depois do tipo: `V` variável, `S` estrutura, `T` tabela, `O` objeto, `R` range ou referência.*
