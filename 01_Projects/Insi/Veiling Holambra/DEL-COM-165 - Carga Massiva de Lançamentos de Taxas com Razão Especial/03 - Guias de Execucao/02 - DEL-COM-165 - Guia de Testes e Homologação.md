---
tipo: guia-testes
tipo_demanda: novo-app
tags:
  - projeto
  - insi
  - veiling-holambra
  - sap
  - fi
  - fi-ap
  - rap
  - cds
  - fiori
  - abap-cloud
  - homologacao
  - plano-testes
  - etd
  - del-com-165
id_demanda: "DEL-COM-165"
status_geral: Planejado
executor_exclusivo: Gabriel Souza (Desenvolvedor)
data: 2026-11-17
aliases:
  - "DEL-COM-165 - Guia de Testes e Homologação"
  - "02 - DEL-COM-165 - Guia de Testes e Homologação"
---

# Guia de Execução e Homologação de Testes Técnicos

⬅️ [[01 - DEL-COM-165 - Guia de Implementação|Guia de Implementação]] | ⬅️ [[00 - DEL-COM-165 - Visão Integrada e Infraestrutura|Arquitetura e Objetos]] | 📄 [[01 - Especificação Funcional (Visão da Solução)|Especificação Funcional]]

---

## 1. Identificação do Teste

| Campo na ETD | Conteúdo Oficial para Transferência |
| :--- | :--- |
| **Título:** | Carga Massiva de Lançamentos de Taxas com Razão Especial |
| **Usuário Responsável pelo teste:** | **Gabriel Souza (Desenvolvedor)** |
| **ID GAP/Processo:** | `DEL-COM-165` |
| **Cenário/Gap:** | Carga massiva via Excel de lançamentos de taxas e fundos cooperativos para BPs (Business Partners — Parceiros de Negócios) Sítio e Sócio com derivação automática de Razão Especial (*Special G/L Indicator*), bloqueio de pagamento `T` e geração automática de contrapartida contábil no Razão. |
| **Módulo/Submódulo:** | `FI-AP` (Contabilidade Financeira — Contas a Pagar) |
| **Processo:** | Contas a Pagar / Contabilização de Taxas, Fundos e Cotas de Cooperados |
| **Mandante:** | `100` (`Veiling_S4D_100_GVSOUZA_PT`) |
| **Descrição do teste:** | Execução dos testes unitários e de homologação dos aplicativos SAP Fiori Elements (OData V4) **`taxascarga`** (repositório BSP `ZZ1_TAXCARGA`, serviço `ZUI_O4_FI_TAX_CARGA`) e **`taxastipomov`** (repositório BSP `ZZ1_TAXTPMOV`, serviço `ZUI_O4_FI_TAX_TPMOV`), validando o download do modelo Excel gerado via `XCO_CP_XLSX`, leitura de planilhas com agrupamento por `DOCSEQ`, regras de parametrização em `ZTFI_TAX_TPMOV`, simulação automática na carga via `BAPI_ACC_DOCUMENT_CHECK`, contabilização via `BAPI_ACC_DOCUMENT_POST` (com gravação de `XREF1` = `carga_id` e `XREF3` = `ZTPMOV`), controle de duplicidade, segurança (`ZTAXCARGA`), estorno na `FB08` e proteção na rotina de pagamento automático `F110`. |

---

## 2. Plano de Teste (Seção 3 da ETD)

### 2.1. Parâmetros de Entrada (Seção 3.1 da ETD)

* **Empresa Contábil:** `CVH1` (Cooperativa Veiling Holambra — valor assumido por padrão caso a coluna `BUKRS` esteja em branco na planilha).
* **Moeda Padrão:** `BRL` (assumida automaticamente caso a coluna `WAERS` esteja em branco).
* **Layout da Planilha de Carga (`.xlsx`):** Aba `Carga`, cabeçalhos técnicos na Linha 4, rótulos na Linha 5 e dados a partir da Linha 6, contendo as **15 colunas** oficiais (`DOCSEQ`, `ZTPMOV`, `BUKRS`, `BLDAT`, `BUDAT`, `XBLNR`, `BKTXT`, `WAERS`, `LIFNR`, `WRSOL`, `WRHAB`, `ZFBDT`, `ZTERM`, `SGTXT`, `ZUONR`).
* **Dados Mestres (BPs e Razão Geral):**
  * **BP Sítio:** Fornecedor com conta de reconciliação padrão `2101010001` (*Fornecedores – Produtores*).
  * **BP Sócio:** Fornecedor pessoa física habilitado para receber lançamentos nas Razões Especiais configuradas (`S`, `R`, `T`, `U`, `V`, `Z`, `N`, `O`, `J`).
  * **Conta de Contrapartida Automática (`DS-ATR`):** Conta do Razão `2205010002` (*Sobras a Distribuir*), parametrizada no campo `hkont_contrapartida` da tabela `ZTFI_TAX_TPMOV`.
* **Parametrização Prévia em `ZTFI_TAX_TPMOV` (via app `taxastipomov`):**
  * Tipos de movimento oficiais cadastrados e ativos (`CS-ADM`, `CS-INT`, `CS-DES`, `CS-LCP`, `DS-ATR`, `DS-LCP`, `CM-AQU`, `CM-DEV`, `FP-AJU`, `FR-AJU`), respeitando obrigatoriedade de Data Base (`zfbdt_obrig`) e Atribuição (`zuonr_obrig`).
* **Configurações Standard FI (Pré-requisitos):**
  * Razões Especiais cadastradas na `OBXY` para tipo de conta `K`.
  * Tipos de documento (`CS`, `DS`, `CM`, `FP`, `FR`) configurados na `OBA7` permitindo conta de fornecedor.
  * Bloqueio de pagamento `T` ativo na `OB27`.
  * Intervalo `01` (`0000000001` a `9999999999`) cadastrado no objeto `ZTAXCARNR` (`SNRO`).
* **Perfis de Autorização (`ZTAXCARGA`):**
  * **Operador Financeiro:** `ACTVT = '01'` (Upload), `'03'` (Exibir/Baixar modelo) e `'16'` (Contabilizar lote).
  * **Consulta / Auditoria:** `ACTVT = '03'` (Exibir apenas).

### 2.2. Resultados Esperados (Seção 3.2 da ETD)

1. **Geração Dinâmica de Modelo e Leitura Segura (Camada Excel / XCO):** O botão `Baixar Modelo Excel` gera dinamicamente o arquivo `DEL-COM-165_Modelo_Layout_Carga.xlsx` via `ZCLFI_TAX_EXCEL`. Ao subir a planilha via `Carregar Planilha (.xlsx)`, o Behavior Pool `[[25 - ZCLFI_BP_TAX_CARGA|ZCLFI_BP_TAX_CARGA]]` agrupa as linhas pelo campo `DOCSEQ`, valida o Tipo de Movimento em `[[01 - ZTFI_TAX_TPMOV|ZTFI_TAX_TPMOV]]` e persiste o lote imediatamente nas tabelas `[[03 - ZTFI_TAX_CARGA|ZTFI_TAX_CARGA]]`, `[[04 - ZTFI_TAX_DOC|ZTFI_TAX_DOC]]` e `[[05 - ZTFI_TAX_ITEM|ZTFI_TAX_ITEM]]` (sem uso de *Draft*).
2. **Simulação Automática no Upload e Mensageria Unificada:** Não existem botões de *Verificar* ou *Reprocessar* em tela. No próprio upload (`carregarArquivo`), após as validações de layout, parametrização e duplicidade (`XBLNR + LIFNR + ZTPMOV + Valor`), cada documento é simulado via `BAPI_ACC_DOCUMENT_CHECK` (encapsulada em `[[09 - ZCLFI_TAX_BAPI_WRAP|ZCLFI_TAX_BAPI_WRAP]]`). Documentos aptos recebem `status = 'V'` e documentos inconsistentes recebem `status = 'E'` com a mensagem da classe `[[06 - ZFI_TAXAS|ZFI_TAXAS]]` ou o texto nativo retornado pela BAPI.
3. **Derivação Contábil, Contrapartida Automática e Lançamento Parcial:** O acionamento de `Contabilizar Lote` (`lancar`) contabiliza apenas os documentos com `status = 'V'` dentro do método `save_modified` via `BAPI_ACC_DOCUMENT_POST`, gravando `BELNR` e `GJAHR` em `ZTFI_TAX_DOC`, atualizando `status_geral` do lote para `L` (Totalmente Lançado) ou `P` (Parcialmente Lançado) quando houver documentos com erro preservados no lote, aplicando bloqueio de pagamento `T` nas partidas com Razão Especial, gerando a contrapartida automática na conta `2205010002` no movimento `DS-ATR` e preenchendo `BSEG-XREF1` (`carga_id`) e `BSEG-XREF3` (`ZTPMOV`) para rastreabilidade.
4. **Segurança, Integração Financeira e Rastreabilidade Standard:** Partidas com Razão Especial e bloqueio `T` ficam protegidas contra pagamento automático na transação `F110`; usuários sem `ACTVT = '01'`/`'16'` são bloqueados pelo objeto `[[07 - ZTAXCARGA|ZTAXCARGA]]`; e documentos lançados podem ser consultados por `ZUONR` (Atribuição) e estornados isoladamente via `FB08` ou aplicativo *Gerenciar lançamentos contábeis*.

---

## 3. Sequenciamento dos Testes Unitários (Seção 3.3 da ETD)

Esta tabela reflete exatamente a estrutura de 4 colunas exigida pelo template oficial da ETD:

| Cod. Passo | Atividade | Dados de entrada | Resultado esperado |
| :---: | :--- | :--- | :--- |
| **`T01`** | Carga `CS-INT` com sucesso (1 Sítio a débito, 2 Sócios a crédito). | Planilha `.xlsx` baixada pelo botão `Baixar Modelo Excel` com 1 documento (`DOCSEQ = 0001`), `ZTPMOV = CS-INT`, `BUKRS = CVH1`, `XBLNR` preenchido, 3 linhas: Sítio a débito (`500,00`), Sócio A a crédito (`300,00`) e Sócio B a crédito (`200,00`); BPs cadastrados, RE `S` ativa e período aberto. | Upload cria lote em `ZTFI_TAX_CARGA` (`status_geral = 'V'`, msg `ZFI_TAXAS 004`). Após `Contabilizar Lote`, gera 1 documento contábil tipo `CS` (`BELNR` gravado em `ZTFI_TAX_DOC` e `status = 'L'`): Sítio a débito (`500,00`), Sócio A RE `S` (`300,00`) e Sócio B RE `S` (`200,00`), com bloqueio `T`, `BSEG-XREF1 = carga_id` e `BSEG-XREF3 = CS-INT`. |
| **`T02`** | Lançamento parcial (1 documento válido e 1 documento com erro de dado) e recarga após correção no Excel. | Planilha com 2 documentos (`DOCSEQ = 0001` válido com `CS-INT` e `DOCSEQ = 0002` com BP inexistente ou dado inválido). Em seguida, nova planilha corrigida contendo apenas o `DOCSEQ = 0002`. | No 1º upload, Doc 1 fica com `status = 'V'` e Doc 2 com `status = 'E'` (mensagem nativa da BAPI). Ao clicar em `Contabilizar Lote`, Doc 1 é contabilizado (`BELNR` gerado, `status = 'L'`), Doc 2 permanece `E` e o lote fica com `status_geral = 'P'`. Na 2ª carga apenas com o Doc 2 corrigido, Doc 2 é contabilizado com sucesso sem duplicar o Doc 1. |
| **`T03`** | Validação de Tipo de Movimento inativo/fora de vigência ou Data Base obrigatória ausente. | Cenário A: Planilha com Tipo de Movimento inativo ou com vigência expirada em relação à `BUDAT`. Cenário B: Planilha com movimento que exige Data Base (`zfbdt_obrig = 'X'`, ex.: `CS-DES`) com a coluna `ZFBDT` em branco. | No próprio upload (`carregarArquivo`), o documento é marcado com `status = 'E'` exibindo `ZFI_TAXAS 006` (inativo/fora de vigência) ou `ZFI_TAXAS 014` (Data Base obrigatória). Nenhum documento é contabilizado. |
| **`T04`** | Bloqueio de duplicidade de documento já lançado. | Reenvio exato do arquivo já contabilizado com sucesso no passo `T01` (mesma combinação `XBLNR + LIFNR + ZTPMOV + Valor`). | No upload, o sistema detecta a existência de registro com `status = 'L'` em `ZTFI_TAX_DOC` / `ZTFI_TAX_ITEM` e marca o documento com `status = 'E'` e mensagem `ZFI_TAXAS 016`. Ação `Contabilizar Lote` não gera lançamento duplicado. |
| **`T05`** | `DS-LCP`: Transferência de Longo Prazo para Curto Prazo no mesmo BP Sócio. | Planilha com `ZTPMOV = DS-LCP`, mesmo BP Sócio a débito e a crédito, Data Base (`ZFBDT`) preenchida, com Sócio possuindo saldo na Razão Especial `V`. | Upload valida com `status = 'V'`; após `Contabilizar Lote`, gera 1 documento tipo `DS` (`BELNR` gravado) com Débito no Sócio RE `V`, Crédito no Sócio RE `Z`, `ZFBDT` gravada e bloqueio de pagamento `T` em ambas as partidas. |
| **`T06`** | `CM-DEV`: Devolução de Cotas de Material Circulante. | Planilha com `ZTPMOV = CM-DEV`, `ZUONR` preenchido (ex.: `POTE11`), Débito no BP Sócio (com saldo em RE `N`) e Crédito no BP Sítio. | Upload valida com `status = 'V'`; após `Contabilizar Lote`, gera 1 documento tipo `CM` com Débito no Sócio em RE `N` (com bloqueio `T`) e Crédito no Sítio sem Razão Especial e sem bloqueio de pagamento (item livre/pagável). |
| **`T07`** | Fornecedor bloqueado no SAP no upload e nova carga após desbloqueio cadastral. | Planilha com BP marcado com bloqueio de lançamento no cadastro do fornecedor (`LFA1`/`LFB1`). Após visualização do erro, desbloqueio do BP no SAP (`BP`) e novo upload da planilha com o documento pendente. | Na 1ª carga, `BAPI_ACC_DOCUMENT_CHECK` aponta o erro nativo de fornecedor bloqueado e grava o documento com `status = 'E'`. Após desbloquear o BP no SAP e realizar novo upload da planilha (fluxo único sem botão Reprocessar), o documento é validado (`status = 'V'`) e contabilizado com geração de `BELNR`. |
| **`T08`** | Regressão: Execução da rotina de pagamento automático `F110`. | Documentos contábeis gerados nos testes `T01` e `T05` (partidas em aberto com Razão Especial e bloqueio `T` para os BPs utilizados). | Ao executar a proposta de pagamento na transação `F110` para a empresa `CVH1` e BPs testados, nenhuma partida com Razão Especial e bloqueio `T` é selecionada para pagamento. |
| **`T09`** | Controle de Autorização: Usuário com perfil de Consulta tenta carregar ou lançar. | Usuário de teste autenticado apenas com Role de Consulta (`ZTAXCARGA` com `ACTVT = '03'`, sem `'01'` e `'16'`). | O usuário consegue visualizar os lotes no monitor (`DCL ZI_FI_TAX_CARGA`), porém fica impedido de realizar upload (`ACTVT = '01'`) e contabilização (`ACTVT = '16'`), com ação bloqueada/desabilitada e retorno `ZFI_TAXAS 001` caso invocada. |
| **`T10`** | Aquisição de Cotas (`CM-AQU`) com múltiplos tipos de cota distintos (`ZUONR`). | Planilha com 1 documento `CM-AQU` (`DOCSEQ = 0001`): Sítio a débito (`3.500,00`), Sócio 01 com `ZUONR = POTE11` a crédito (`1.000,00`), Sócio 02 com `ZUONR = POTE11` a crédito (`2.000,00`) e Sócio 02 com `ZUONR = POTE13` a crédito (`500,00`). | Documento `CM` gerado com partidas de Sócio a crédito na RE `N`, bloqueio `T` e campo Atribuição (`ZUONR`) gravado com `POTE11` e `POTE13`; saldos individualizados consultáveis por Atribuição no aplicativo standard *Administrar partidas individuais de fornecedores* / `FBL1N`. |
| **`T11`** | Agrupamento de sócios, múltiplos tipos de movimento no mesmo arquivo (`CS-INT` + `DS-ATR`) e estorno isolado (`FB08`). | Única planilha contendo `DOCSEQ = 1234` (`CS-INT`: 1 Sítio a débito + 4 Sócios a crédito) e `DOCSEQ = 4321` (`DS-ATR`: apenas 4 linhas de Sócios a crédito, sem linha da conta do Razão). Após lançamento, estorno apenas do documento `1234` na `FB08`. | Para `DS-ATR` (`4321`), o app gera automaticamente a partida a débito na conta `2205010002` (`gerado_auto = 'X'`). Após `Contabilizar Lote`, gera 2 documentos contábeis independentes (`BELNR` distintos). O estorno do doc. `1234` na `FB08` desfaz os 4 sócios de Capital Social de uma só vez e mantém intacto o doc. `4321` de Distribuição de Sobras. |

---

## 4. Evidências dos Testes e das Etapas do Processo (Seção 3.4 da ETD)

> **Instruções de Preenchimento:**
> Cada subseção abaixo corresponde a um tópico numerado da **Seção 3.4 da ETD**. Ao executar os testes no ambiente, cole os prints nas etapas indicadas.

---

### 3.4.1. Passo 1 - T01: Carga `CS-INT` com sucesso (1 Sítio a débito, 2 Sócios a crédito)

* **Objetivo:** Validar o fluxo completo de ponta a ponta (download do modelo, upload com simulação automática, contabilização via `BAPI_ACC_DOCUMENT_POST` e gravação dos campos de rastreabilidade) para um lançamento de integralização de Capital Social (`CS-INT`).
* **Dados de Entrada:** Planilha Excel preenchida na aba `Carga` (a partir da linha 6) com `DOCSEQ = 0001`, `ZTPMOV = CS-INT`, `BUKRS = CVH1`, `BLDAT`/`BUDAT` no período aberto, `XBLNR` único, `BKTXT` e `SGTXT` preenchidos; 1 linha de Sítio a débito (`WRSOL = 500,00`) e 2 linhas de Sócios a crédito (`WRHAB = 300,00` e `WRHAB = 200,00`).
* **Resultado Esperado:** Lote criado com `status_geral = 'V'`; após `Contabilizar Lote`, status atualizado para `'L'`, `BELNR` exibido no monitor e documento contábil tipo `CS` gravado no SAP com RE `S` nos sócios, bloqueio `T`, `BSEG-XREF1 = carga_id` e `BSEG-XREF3 = CS-INT`.
* **Executor:** Gabriel Souza (Desenvolvedor)
* **Status:** `[x] Pendente` | `[ ] Aprovado` | `[ ] Reprovado`

#### Etapa 1: Download do modelo e seleção da planilha no app `taxascarga`
*Print da tela inicial (List Report) do aplicativo `taxascarga` exibindo os botões `Baixar Modelo Excel` e `Carregar Planilha (.xlsx)` e a planilha preenchida.*
<!-- Cole o print aqui -->

#### Etapa 2: Upload com simulação automática (`status = 'V'`) e contabilização (`Contabilizar Lote`)
*Print da Object Page do lote exibindo a mensagem `ZFI_TAXAS 004` após o upload e, em seguida, o status `'L'` com o número do documento `BELNR` gerado após clicar em `Contabilizar Lote`.*
<!-- Cole o print aqui -->

#### Etapa 3: Conferência do documento contábil e rastreabilidade no SAP (`FB03` / *Gerenciar lançamentos contábeis*)
*Print do documento contábil tipo `CS` gerado, comprovando as 3 partidas (Sítio `500,00`, Sócio A RE `S` `300,00`, Sócio B RE `S` `200,00`), o bloqueio de pagamento `T` e os campos `XREF1` (`carga_id`) e `XREF3` (`CS-INT`).*
<!-- Cole o print aqui -->

---

### 3.4.2. Passo 2 - T02: Lançamento parcial e recarga do documento corrigido

* **Objetivo:** Comprovar que um erro em um documento não impede a contabilização dos demais documentos válidos do mesmo lote e que a correção via novo upload de Excel não duplica o documento já contabilizado.
* **Dados de Entrada:** 1ª planilha contendo `DOCSEQ = 0001` (`CS-INT` válido) e `DOCSEQ = 0002` (`CS-INT` com BP inexistente/inválido). 2ª planilha contendo apenas `DOCSEQ = 0002` com o BP corrigido.
* **Resultado Esperado:** Na 1ª carga, Doc 1 é contabilizado (`status = 'L'`, `BELNR` gravado) enquanto Doc 2 permanece com `status = 'E'` (mensagem nativa da BAPI) e o lote assume `status_geral = 'P'`. Na 2ª carga, Doc 2 é contabilizado com sucesso sem duplicar Doc 1.
* **Executor:** Gabriel Souza (Desenvolvedor)
* **Status:** `[x] Pendente` | `[ ] Aprovado` | `[ ] Reprovado`

#### Etapa 1: Upload da 1ª planilha com 1 documento válido e 1 inválido
*Print da Object Page do lote exibindo Doc 1 com `status = 'V'` e Doc 2 com `status = 'E'` e a mensagem de erro retornada pela `BAPI_ACC_DOCUMENT_CHECK`.*
<!-- Cole o print aqui -->

#### Etapa 2: Contabilização parcial do lote (`status_geral = 'P'`)
*Print após acionar `Contabilizar Lote`, comprovando que Doc 1 recebeu `BELNR` (`status = 'L'`) e Doc 2 manteve `status = 'E'`.*
<!-- Cole o print aqui -->

#### Etapa 3: Upload e contabilização da 2ª planilha contendo apenas o Doc 2 corrigido
*Print do novo lote gerado exclusivamente para o Doc 2 corrigido, comprovando sua contabilização (`status = 'L'` e `BELNR` próprio) sem reenvio ou duplicidade do Doc 1.*
<!-- Cole o print aqui -->

---

### 3.4.3. Passo 3 - T03: Tipo de Movimento inativo/fora de vigência ou Data Base obrigatória ausente

* **Objetivo:** Validar as travas de parametrização da tabela `ZTFI_TAX_TPMOV` aplicadas automaticamente durante o upload da planilha.
* **Dados de Entrada:**
  * Subcenário A: Planilha utilizando Tipo de Movimento marcado como inativo (`ativo = ''`) ou com `BUDAT` fora do intervalo `valido_de`–`valido_ate`.
  * Subcenário B: Planilha com Tipo de Movimento parametrizado com `zfbdt_obrig = 'X'` (ex.: `CS-DES`) e coluna `ZFBDT` em branco.
* **Resultado Esperado:** Ambos os documentos recebem `status = 'E'` imediatamente após o upload, exibindo respectivamente as mensagens `ZFI_TAXAS 006` e `ZFI_TAXAS 014`, sem geração de lançamento contábil.
* **Executor:** Gabriel Souza (Desenvolvedor)
* **Status:** `[x] Pendente` | `[ ] Aprovado` | `[ ] Reprovado`

#### Etapa 1: Upload com Tipo de Movimento inativo ou fora da vigência
*Print da Object Page do lote exibindo o documento com `status = 'E'` e o texto da mensagem `ZFI_TAXAS 006`.*
<!-- Cole o print aqui -->

#### Etapa 2: Upload com Data Base (`ZFBDT`) obrigatória em branco
*Print da Object Page do lote exibindo o documento com `status = 'E'` e o texto da mensagem `ZFI_TAXAS 014`.*
<!-- Cole o print aqui -->

---

### 3.4.4. Passo 4 - T04: Bloqueio de duplicidade de documento já lançado

* **Objetivo:** Garantir que o mecanismo anti-duplicidade impeça o lançamento repetido de um documento com mesma combinação `XBLNR + LIFNR + ZTPMOV + Valor` já contabilizada (`status = 'L'`).
* **Dados de Entrada:** Reenvio exato da planilha Excel utilizada e contabilizada com sucesso no teste `T01`.
* **Resultado Esperado:** No upload, o documento recebe `status = 'E'` com a mensagem `ZFI_TAXAS 016` informando o `BELNR` original já lançado, bloqueando nova contabilização.
* **Executor:** Gabriel Souza (Desenvolvedor)
* **Status:** `[x] Pendente` | `[ ] Aprovado` | `[ ] Reprovado`

#### Etapa 1: Novo upload do arquivo já lançado em `T01`
*Print da Object Page do novo lote exibindo o documento bloqueado com `status = 'E'` e a mensagem `ZFI_TAXAS 016`.*
<!-- Cole o print aqui -->

#### Etapa 2: Tentativa de acionar `Contabilizar Lote`
*Print comprovando que o lote sem documentos válidos (`qtd_validos = 0`) não permite lançamento (`ZFI_TAXAS 019` / botão desabilitado) e nenhum novo `BELNR` é criado.*
<!-- Cole o print aqui -->

---

### 3.4.5. Passo 5 - T05: `DS-LCP` — Transferência Longo Prazo para Curto Prazo no mesmo BP Sócio

* **Objetivo:** Validar a contabilização entre duas Razões Especiais distintas no mesmo BP Sócio (`V` → `Z`) com gravação da Data Base (`ZFBDT`) e bloqueio `T`.
* **Dados de Entrada:** Planilha com `ZTPMOV = DS-LCP`, BP Sócio com saldo prévio em RE `V`, linha a débito e linha a crédito no mesmo `LIFNR`, com `ZFBDT` preenchida.
* **Resultado Esperado:** Documento `DS` contabilizado (`BELNR` gravado), debitando o Sócio na RE `V` e creditando o mesmo Sócio na RE `Z`, com `ZFBDT` e bloqueio `T` gravados nas partidas.
* **Executor:** Gabriel Souza (Desenvolvedor)
* **Status:** `[x] Pendente` | `[ ] Aprovado` | `[ ] Reprovado`

#### Etapa 1: Upload e conferência dos itens derivados no app `taxascarga`
*Print da Sub-Object Page do documento (`ZC_FI_TAX_DOC` → `ZC_FI_TAX_ITEM`) mostrando a derivação automática de `umskz = 'V'` no débito, `umskz = 'Z'` no crédito e `zlspr = 'T'`.*
<!-- Cole o print aqui -->

#### Etapa 2: Contabilização e conferência do documento `DS` no SAP (`FB03`)
*Print do documento contábil tipo `DS` exibindo as partidas nas Razões Especiais `V` e `Z`, a Data Base (`ZFBDT`) e o bloqueio de pagamento `T`.*
<!-- Cole o print aqui -->

---

### 3.4.6. Passo 6 - T06: `CM-DEV` — Devolução de Cotas de Material Circulante

* **Objetivo:** Comprovar a derivação assimétrica do movimento `CM-DEV`, onde apenas a partida do Sócio recebe Razão Especial (`N`) e bloqueio `T`, mantendo a partida do Sítio livre para pagamento.
* **Dados de Entrada:** Planilha com `ZTPMOV = CM-DEV`, `ZUONR` preenchido (ex.: `POTE11`), Débito no BP Sócio (com saldo em RE `N`) e Crédito no BP Sítio.
* **Resultado Esperado:** Documento `CM` gerado com Débito no Sócio em RE `N` (com bloqueio `T`) e Crédito no Sítio em conta normal de reconciliação (sem Razão Especial e sem bloqueio `T`, ou seja, pagável).
* **Executor:** Gabriel Souza (Desenvolvedor)
* **Status:** `[x] Pendente` | `[ ] Aprovado` | `[ ] Reprovado`

#### Etapa 1: Upload e conferência das partidas derivadas no app `taxascarga`
*Print da Sub-Object Page do documento mostrando o item do Sócio a débito com `umskz = 'N'` e `zlspr = 'T'`, e o item do Sítio a crédito com `umskz` e `zlspr` em branco.*
<!-- Cole o print aqui -->

#### Etapa 2: Contabilização e conferência do documento `CM` no SAP (`FB03`)
*Print das duas partidas do documento `CM` gerado no SAP comprovando o bloqueio `T` exclusivamente na linha do Sócio (`N`) e o campo de bloqueio vazio na linha do Sítio.*
<!-- Cole o print aqui -->

---

### 3.4.7. Passo 7 - T07: Fornecedor bloqueado no SAP e nova carga após desbloqueio

* **Objetivo:** Validar o tratamento de erro cadastral nativo da `BAPI_ACC_DOCUMENT_CHECK` para fornecedor bloqueado e a execução do fluxo padrão pós-reunião (correção da causa raiz no SAP e novo upload da planilha, sem botão Reprocessar).
* **Dados de Entrada:** Planilha válida contendo BP previamente bloqueado para lançamento no cadastro SAP (`BP`). Após o erro, o BP é desbloqueado no SAP e a mesma planilha com o documento pendente é carregada novamente.
* **Resultado Esperado:** Na 1ª carga, o documento recebe `status = 'E'` com a mensagem nativa da BAPI sobre bloqueio de lançamento do fornecedor. Após o desbloqueio no cadastro e o novo upload da planilha, o documento passa a `status = 'V'` e é contabilizado gerando o `BELNR`.
* **Executor:** Gabriel Souza (Desenvolvedor)
* **Status:** `[x] Pendente` | `[ ] Aprovado` | `[ ] Reprovado`

#### Etapa 1: 1ª carga com BP bloqueado para lançamento no SAP
*Print do bloqueio no cadastro do BP e da Object Page do lote exibindo `status = 'E'` com a mensagem nativa da BAPI.*
<!-- Cole o print aqui -->

#### Etapa 2: Desbloqueio do BP no cadastro SAP e novo upload da planilha
*Print do desbloqueio do BP no SAP GUI (`BP`) e da 2ª carga da planilha no app `taxascarga` agora com `status = 'V'`.*
<!-- Cole o print aqui -->

#### Etapa 3: Contabilização do documento após desbloqueio
*Print confirmando o status `'L'` e o `BELNR` gerado após acionar `Contabilizar Lote` na 2ª carga.*
<!-- Cole o print aqui -->

---

### 3.4.8. Passo 8 - T08: Regressão — Programa de pagamento automático `F110`

* **Objetivo:** Garantir que as partidas de fornecedores lançadas com Razão Especial e bloqueio de pagamento `T` pelos aplicativos não sejam pagas automaticamente pela transação `F110`.
* **Dados de Entrada:** Documentos contabilizados nos testes `T01` (`CS-INT`) e `T05` (`DS-LCP`), em aberto para os BPs utilizados na empresa `CVH1`.
* **Resultado Esperado:** Na simulação/proposta da `F110`, os itens com Razão Especial e bloqueio `T` são ignorados ou marcados como bloqueados na lista de exceções, não sendo incluídos para pagamento.
* **Executor:** Gabriel Souza (Desenvolvedor)
* **Status:** `[x] Pendente` | `[ ] Aprovado` | `[ ] Reprovado`

#### Etapa 1: Execução dos parâmetros e proposta de pagamento na `F110`
*Print dos parâmetros da `F110` informando a empresa `CVH1` e os BPs utilizados em `T01` e `T05`.*
<!-- Cole o print aqui -->

#### Etapa 2: Conferência da lista de proposta / exceções na `F110`
*Print da proposta de pagamento e/ou log da `F110` comprovando que os lançamentos com Razão Especial e bloqueio `T` não foram selecionados para pagamento.*
<!-- Cole o print aqui -->

---

### 3.4.9. Passo 9 - T09: Controle de Autorização (`ZTAXCARGA`) — Perfil Consulta

* **Objetivo:** Validar a segregação de acesso pelo objeto de autorização `ZTAXCARGA`, garantindo que um usuário com perfil somente de Consulta (`ACTVT = '03'`) visualize os lotes sem poder carregar novas planilhas nem contabilizar lotes existentes.
* **Dados de Entrada:** Usuário com atribuição apenas da Role de Consulta/Auditoria (`ACTVT = '03'`) tentando acessar um lote em aberto (`status_geral = 'V'`) no app `taxascarga`.
* **Resultado Esperado:** O usuário visualiza o histórico na tela (DCL `ZI_FI_TAX_CARGA`), mas não possui permissão para subir arquivos (`ACTVT = '01'`) nem contabilizar (`ACTVT = '16'`), com ação bloqueada/desabilitada ou retorno da mensagem `ZFI_TAXAS 001`.
* **Executor:** Gabriel Souza (Desenvolvedor)
* **Status:** `[x] Pendente` | `[ ] Aprovado` | `[ ] Reprovado`

#### Etapa 1: Acesso ao monitor com usuário de Consulta (`ACTVT = '03'`)
*Print da tela inicial / Object Page do app `taxascarga` acessada pelo usuário de Consulta, comprovando a visualização dos dados e o bloqueio/indisponibilidade da ação de contabilização.*
<!-- Cole o print aqui -->

#### Etapa 2: Tentativa de upload ou contabilização sem autorização
*Print comprovando o impedimento da execução (botão desabilitado ou erro `ZFI_TAXAS 001` — Sem autorização na empresa `CVH1` para a atividade solicitada).*
<!-- Cole o print aqui -->

---

### 3.4.10. Passo 10 - T10: Aquisição de Cotas (`CM-AQU`) com múltiplos tipos de cota (`ZUONR`)

* **Objetivo:** Validar a obrigatoriedade e a gravação correta do campo Atribuição (`ZUONR`) na aquisição de Cotas de Material Circulante (`CM-AQU`) e a possibilidade de consulta de saldo por tipo de cota e sócio.
* **Dados de Entrada:** Planilha com 1 documento `CM-AQU` (`DOCSEQ = 0001`): Sítio a débito (`3.500,00`), Sócio 01 com `ZUONR = POTE11` a crédito (`1.000,00`), Sócio 02 com `ZUONR = POTE11` a crédito (`2.000,00`) e Sócio 02 com `ZUONR = POTE13` a crédito (`500,00`).
* **Resultado Esperado:** Documento `CM` contabilizado com os créditos dos sócios em RE `N`, bloqueio `T` e campo `ZUONR` preenchido com `POTE11` e `POTE13`; saldos por sócio e tipo de cota filtráveis no aplicativo standard *Administrar partidas individuais de fornecedores* (ou `FBL1N`).
* **Executor:** Gabriel Souza (Desenvolvedor)
* **Status:** `[x] Pendente` | `[ ] Aprovado` | `[ ] Reprovado`

#### Etapa 1: Upload e contabilização do documento `CM-AQU` no app `taxascarga`
*Print da Sub-Object Page do documento exibindo as partidas com os respectivos valores em `ZUONR` (`POTE11` e `POTE13`) e o `BELNR` gerado.*
<!-- Cole o print aqui -->

#### Etapa 2: Conferência de saldos filtrados por Atribuição (`ZUONR`)
*Print do relatório standard de partidas de fornecedores (*Administrar itens de fornecedor* ou `FBL1N`) filtrado por Atribuição `POTE11` / `POTE13`, evidenciando a separação dos saldos do Sócio 02.*
<!-- Cole o print aqui -->

---

### 3.4.11. Passo 11 - T11: Agrupamento de sócios, múltiplos tipos de movimento no mesmo arquivo e estorno (`FB08`)

* **Objetivo:** Validar o processamento de dois tipos de movimento diferentes no mesmo arquivo Excel (`CS-INT` e `DS-ATR`), a geração automática da contrapartida contábil na conta `2205010002` para o `DS-ATR` e o comportamento do estorno isolado de um documento na `FB08`.
* **Dados de Entrada:** Uma única planilha Excel contendo dois documentos:
  * `DOCSEQ = 1234`: `CS-INT` (1 linha de Sítio a débito + 4 linhas de Sócios a crédito).
  * `DOCSEQ = 4321`: `DS-ATR` (apenas 4 linhas de Sócios a crédito; sem linha de débito manual).
  * Após contabilização de ambos, execução do estorno apenas do `BELNR` referente ao `DOCSEQ = 1234` na transação `FB08` (ou app *Gerenciar lançamentos contábeis*).
* **Resultado Esperado:** O aplicativo gera automaticamente a linha a débito na conta `2205010002` (`gerado_auto = 'X'`) no documento `4321` totalizando a soma dos 4 sócios; dois documentos contábeis independentes são criados no SAP; e o estorno do documento `1234` desfaz simultaneamente as 4 partidas de Sócios do Capital Social sem afetar o documento `4321` de Distribuição de Sobras.
* **Executor:** Gabriel Souza (Desenvolvedor)
* **Status:** `[x] Pendente` | `[ ] Aprovado` | `[ ] Reprovado`

#### Etapa 1: Upload e conferência da contrapartida automática do `DS-ATR`
*Print da Object Page do lote exibindo os dois documentos (`1234` e `4321`) e da Sub-Object Page do documento `4321` (`DS-ATR`) comprovando a linha gerada automaticamente na conta `2205010002` com o somatório exato dos créditos.*
<!-- Cole o print aqui -->

#### Etapa 2: Contabilização dos dois documentos independentes
*Print confirmando o `status = 'L'` e os dois `BELNR` distintos gerados para `1234` (`CS`) e `4321` (`DS`), além da visualização do documento `DS` no SAP.*
<!-- Cole o print aqui -->

#### Etapa 3: Estorno isolado do documento `1234` na transação `FB08`
*Print do estorno realizado na `FB08` (ou app *Gerenciar lançamentos contábeis*) para o `BELNR` do `1234`, comprovando que os 4 sócios de Capital Social foram estornados juntos enquanto o `BELNR` do `4321` (`DS-ATR`) permaneceu ativo e intacto.*
<!-- Cole o print aqui -->
