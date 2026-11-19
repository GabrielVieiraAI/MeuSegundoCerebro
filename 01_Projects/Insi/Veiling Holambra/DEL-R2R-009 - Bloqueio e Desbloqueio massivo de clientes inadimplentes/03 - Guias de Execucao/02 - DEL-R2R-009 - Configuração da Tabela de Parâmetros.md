---
tags:
  - projeto
  - insi
  - veiling-holambra
  - sap
  - fi-ar
  - fscm
  - tabela-parametros
  - del-r2r-009
  - configuracao
id_demanda: DEL-R2R-009
tipo: configuracao-parametros
data: 2026-10-28

aliases:
  - "DEL-R2R-009 - Configuração da Tabela de Parâmetros"
---

# ⚙️ DEL-R2R-009 · Configuração no App Tabela de Parâmetros

⬅️ [[01 - DEL-R2R-009 - Guia de Implementação|Guia de Implementação]] | ⬅️ [[DEL-R2R-009 - Arquitetura e Objetos|Arquitetura e Objetos]] | 📄 [[01 - APP Tabela de Parâmetros Veiling Holambra|Documentação Base do App Tabela de Parâmetros]]

---

## 📌 1. Finalidade e Contexto da Demanda

Esta nota documenta o procedimento de cadastro e manutenção dos parâmetros da demanda **DEL-R2R-009 (Bloqueio e Desbloqueio Massivo de Clientes Inadimplentes)** dentro do **App Tabela de Parâmetros** oficial da Veiling Holambra.

Para eliminar regras de negócio fixas no código (*hardcode*) e unificar a fonte de configuração entre as **CDS** (*Core Data Services*) e o *Behavior Pool*, todos os critérios operacionais ficam centralizados na tabela corporativa de parâmetros sob o módulo **`FI`** e Chave 1 **`DEL_R2R_009`**:
* **Empresa contábil avaliada (`BUKRS` / `EMPRESA`):** `CVH1`;
* **Segmento de crédito do FSCM (`CREDIT_SGMNT` / `SEGMENTO`):** `1000`;
* **Tipo de relação Matriz x Filial (`RELTYP` / `GRUPO`):** `UKM001`;
* **Perfis de classe de risco (`RISK_CLASS`):** À Vista (`A_VISTA` = `1A`), A Prazo (`A_PRAZO` = `2A`) e Excluídas (`EXCLUIR` = `5`);
* **Valor mínimo da régua de corte (`LIMITE_CORTE` / `A_PRAZO`):** `500.01`.

> [!NOTE] O que é o App Tabela de Parâmetros da Veiling?
> É um aplicativo SAP Fiori corporativo desenvolvido pela equipe de arquitetura da Veiling Holambra para substituir as antigas tabelas standard `STVARV` e `TVARVC`. Ele armazena configurações globais em 3 níveis: **Módulo (`ZTCA_PARAM_MOD`, campo `CHAR 4`) ➡️ Parâmetro (`ZTCA_PARAM_PAR`) ➡️ Valores em formato de Range (`ZTCA_PARAM_VAL`)**.

---

## 🔑 2. Pré-Requisitos e Acesso ao Aplicativo

Para realizar a configuração nos ambientes (`S4D` desenvolvimento, `S4Q` qualidade ou `S4P` produção):

* **Acesso ao Fiori Launchpad:** O usuário deve possuir a role `Z_CA` atribuída no perfil do usuário (`SU01`);
* **Objeto de Autorização:** A role deve conter o objeto **`Z_PARAM`** com autorização para o módulo `FI` (ou valor total `*`);
* **Identificação do Bloco (Tile) no Launchpad:**
  * **Título do Bloco:** App Tabela de Parâmetros
  * **Objeto Semântico:** `ZZ1_TAB_PARAM`
  * **Ação:** `manage`

---

## 🛠️ 3. Passo a Passo de Configuração

### 🔹 Etapa 1: Seleção do Módulo (Nível 1)

1. Acesse o **SAP Fiori Launchpad** e abra o aplicativo **App Tabela de Parâmetros**;
2. Na página inicial com a relação dos módulos da empresa, localize e clique sobre o módulo **`FI`** *(Financeiro — chave `CHAR 4` usada pelas CDS Views e pela classe ABAP)*;
3. A tela exibirá os parâmetros cadastrados para o módulo `FI`.

---

### 🔹 Etapa 2: Cadastro dos Parâmetros da Demanda (Nível 2)

A chave de parâmetros da Veiling é composta por 3 campos obrigatórios: `Chave 1 (CHAR 20)`, `Chave 2 (CHAR 20)` e `Chave 3 (CHAR 8)`.

Cadastre os **7 parâmetros** abaixo clicando no botão **`+` / Criar**:

1. **Empresa Avaliada:** Chave 1 `DEL_R2R_009` | Chave 2 `BUKRS` | Chave 3 `EMPRESA` | Descrição: `Empresa avaliada na inadimplência`
2. **Segmento de Crédito:** Chave 1 `DEL_R2R_009` | Chave 2 `CREDIT_SGMNT` | Chave 3 `SEGMENTO` | Descrição: `Segmento de crédito FSCM`
3. **Tipo de Vínculo de Grupo Econômico:** Chave 1 `DEL_R2R_009` | Chave 2 `RELTYP` | Chave 3 `GRUPO` | Descrição: `Tipo de relação Matriz x Filial`
4. **Classes com Perfil À Vista:** Chave 1 `DEL_R2R_009` | Chave 2 `RISK_CLASS` | Chave 3 `A_VISTA` | Descrição: `Classes de Risco - Perfil À Vista`
5. **Classes com Perfil A Prazo:** Chave 1 `DEL_R2R_009` | Chave 2 `RISK_CLASS` | Chave 3 `A_PRAZO` | Descrição: `Classes de Risco - Perfil A Prazo`
6. **Classes Excluídas da Avaliação:** Chave 1 `DEL_R2R_009` | Chave 2 `RISK_CLASS` | Chave 3 `EXCLUIR` | Descrição: `Classes de Risco Excluídas (CVH Interna)`
7. **Limite de Corte A Prazo:** Chave 1 `DEL_R2R_009` | Chave 2 `LIMITE_CORTE` | Chave 3 `A_PRAZO` | Descrição: `Valor mínimo da régua A Prazo`

---

### 🔹 Etapa 3: Cadastro dos Valores em Formato Range (Nível 3)

Com os 7 parâmetros criados, clique sobre cada um deles para inserir os valores correspondentes (Sinal `I`, Opção `EQ` e Valor Máximo em branco):

1. **`BUKRS` / `EMPRESA`:** Valor Mínimo (`LOW`) = `CVH1`
2. **`CREDIT_SGMNT` / `SEGMENTO`:** Valor Mínimo (`LOW`) = `1000`
3. **`RELTYP` / `GRUPO`:** Valor Mínimo (`LOW`) = `UKM001`
4. **`RISK_CLASS` / `A_VISTA`:** Valor Mínimo (`LOW`) = `1A`
5. **`RISK_CLASS` / `A_PRAZO`:** Valor Mínimo (`LOW`) = `2A`
6. **`RISK_CLASS` / `EXCLUIR`:** Valor Mínimo (`LOW`) = `5`
7. **`LIMITE_CORTE` / `A_PRAZO`:** Valor Mínimo (`LOW`) = `500.01`

Clique em **Salvar** para confirmar as alterações.

---

## 📋 4. Tabela Resumo dos Dados Cadastrados

Abaixo está o mapa consolidado dos 7 registros persistidos nas tabelas `ZTCA_PARAM_PAR` e `ZTCA_PARAM_VAL`:

| Módulo | Chave 1       | Chave 2        | Chave 3    | Sinal | Opção | Valor Mínimo (`LOW`) | Valor Máximo (`HIGH`) | Descrição do Parâmetro                   |
| :----- | :------------ | :------------- | :--------- | :---: | :---: | :------------------: | :-------------------: | :--------------------------------------- |
| `FI`   | `DEL_R2R_009` | `BUKRS`        | `EMPRESA`  |  `I`  | `EQ`  |        `CVH1`        |       *(vazio)*       | Empresa avaliada na inadimplência        |
| `FI`   | `DEL_R2R_009` | `CREDIT_SGMNT` | `SEGMENTO` |  `I`  | `EQ`  |        `1000`        |       *(vazio)*       | Segmento de crédito FSCM                 |
| `FI`   | `DEL_R2R_009` | `RELTYP`       | `GRUPO`    |  `I`  | `EQ`  |       `UKM001`       |       *(vazio)*       | Tipo de relação Matriz x Filial          |
| `FI`   | `DEL_R2R_009` | `RISK_CLASS`   | `A_VISTA`  |  `I`  | `EQ`  |         `1A`         |       *(vazio)*       | Classes de Risco - Perfil À Vista        |
| `FI`   | `DEL_R2R_009` | `RISK_CLASS`   | `A_PRAZO`  |  `I`  | `EQ`  |         `2A`         |       *(vazio)*       | Classes de Risco - Perfil A Prazo        |
| `FI`   | `DEL_R2R_009` | `RISK_CLASS`   | `EXCLUIR`  |  `I`  | `EQ`  |         `5`          |       *(vazio)*       | Classes de Risco Excluídas (CVH Interna) |
| `FI`   | `DEL_R2R_009` | `LIMITE_CORTE` | `A_PRAZO`  |  `I`  | `EQ`  |       `500.01`       |       *(vazio)*       | Valor mínimo da régua A Prazo            |

---

## 💻 5. Como as CDS Views e o Código ABAP Consomem esses Parâmetros

1. **Na camada de CDS Views (`ZI_FI_TITULOS_VENCIDOS`, `ZI_FI_PARCEIRO_CREDITO` e `ZI_FI_GRUPO_INADIMPLENTE`):**
   * Consomem diretamente a visão corporativa `ZI_CA_GET_PARAMETER` filtrando `Modulo = 'FI'`, `Chave1 = 'DEL_R2R_009'`, `Sign = 'I'` e `Opt = 'EQ'`.
2. **No backend ABAP (`[[08 - ZCLFI_BP_CLIENTE_INAD|ZCLFI_BP_CLIENTE_INAD]]`):**
   * Recupera ranges e valores únicos por meio da instância **zclca_tabela_parametros\=>get_instance( )**:

```abap
DATA: lr_classes_excluidas TYPE RANGE OF ukm_risk_class,
      lr_reltyp            TYPE RANGE OF bu_reltyp,
      lv_bukrs_padrao      TYPE bukrs.

TRY.
    zclca_tabela_parametros=>get_instance( )->m_get_range(
      EXPORTING
        iv_modulo = 'FI'
        iv_chave1 = 'DEL_R2R_009'
        iv_chave2 = 'RISK_CLASS'
        iv_chave3 = 'EXCLUIR'
      IMPORTING
        et_range  = lr_classes_excluidas ).

    zclca_tabela_parametros=>get_instance( )->m_get_range(
      EXPORTING
        iv_modulo = 'FI'
        iv_chave1 = 'DEL_R2R_009'
        iv_chave2 = 'RELTYP'
        iv_chave3 = 'GRUPO'
      IMPORTING
        et_range  = lr_reltyp ).

    zclca_tabela_parametros=>get_instance( )->m_get_single(
      EXPORTING
        iv_modulo = 'FI'
        iv_chave1 = 'DEL_R2R_009'
        iv_chave2 = 'BUKRS'
        iv_chave3 = 'EMPRESA'
      IMPORTING
        ev_param  = lv_bukrs_padrao ).
  CATCH cx_root.
    " Tratamento defensivo com fallback seguro
ENDTRY.
```

---

## 🔄 6. Procedimento de Manutenção Futura (Sustentação)

Caso a Veiling Holambra altere sua classificação de crédito no FSCM (transação `SPRO`) ou o limite mínimo da régua de inadimplência, o time de sustentação ou usuário-chave deve seguir o procedimento abaixo:

### 🔹 Cenário A: Inclusão de Nova Classe de Compra (ex.: `3A` A Prazo Especial)
1. Abrir o **App Tabela de Parâmetros** no Launchpad;
2. Navegar em `FI` ➡️ `DEL_R2R_009` / `RISK_CLASS` / `A_PRAZO`;
3. Inserir uma nova linha na tabela de valores:
   * **Sinal:** `I` | **Opção:** `EQ` | **Valor Mínimo:** `3A`
4. Clicar em **Salvar**.
5. *Resultado:* O aplicativo de inadimplência passa a considerar clientes com classe `3A` na régua de corte de A Prazo imediatamente, sem transporte de TR.

### 🔹 Cenário B: Inclusão de Nova Conta Interna da Veiling (ex.: `6` Filial Administrativa)
1. Abrir o **App Tabela de Parâmetros**;
2. Navegar em `FI` ➡️ `DEL_R2R_009` / `RISK_CLASS` / `EXCLUIR`;
3. Inserir uma nova linha:
   * **Sinal:** `I` | **Opção:** `EQ` | **Valor Mínimo:** `6`
4. Clicar em **Salvar**.
5. *Resultado:* Clientes com classe `6` serão automaticamente omitidos na listagem do aplicativo e recusados na ação de bloqueio, sem divergência entre tela e botão.

### 🔹 Cenário C: Ajuste do Limite de Corte A Prazo
1. Abrir o **App Tabela de Parâmetros**;
2. Navegar em `FI` ➡️ `DEL_R2R_009` / `LIMITE_CORTE` / `A_PRAZO`;
3. Atualizar o campo **Valor Mínimo (`LOW`)** mantendo o ponto decimal (ex.: `750.00`) e clicar em **Salvar**.
