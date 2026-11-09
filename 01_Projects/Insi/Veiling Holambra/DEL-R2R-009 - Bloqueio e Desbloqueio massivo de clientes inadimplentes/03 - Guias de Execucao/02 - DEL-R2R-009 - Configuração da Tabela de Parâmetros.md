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

⬅️ [[01 - DEL-R2R-009 - Guia de Implementação|Guia de Implementação]] | ⬅️ [[DEL-R2R-009 - Arquitetura e Objetos|Arquitetura e Objetos]] | 📄 [[APP Tabela de Parametros|Documentação Base do App Tabela de Parâmetros]]

---

## 📌 1. Finalidade e Contexto da Demanda

Esta nota documenta o procedimento de cadastro e manutenção dos parâmetros da demanda **DEL-R2R-009 (Bloqueio e Desbloqueio Massivo de Clientes Inadimplentes)** dentro do **App Tabela de Parâmetros** oficial da Veiling Holambra.

Conforme a especificação formal do projeto (BPDD — *Business Process Design Document*, Slide 19 do delta) e os alinhamentos técnicos com o consultor funcional Maycon Nogueira:
* A régua de bloqueio em si (valores R$ 0,00 e R$ 500,01) permanece fixa no código;
* A **relação entre Classe de Risco do FSCM (*Financial Supply Chain Management*), Perfil Operacional (À Vista ou A Prazo) e as Classes Excluídas da avaliação (ex.: Classe 5 – CVH Interna)** deve residir na tabela corporativa de parâmetros, permitindo que a Veiling inclua ou altere classes de risco no futuro sem necessidade de abrir chamados ou transportar novas Ordens de Transporte (TRs) com código ABAP/CDS.

> [!NOTE] O que é o App Tabela de Parâmetros da Veiling?
> É um aplicativo SAP Fiori corporativo desenvolvido pela equipe de arquitetura da Veiling Holambra para substituir as antigas tabelas standard `STVARV` e `TVARVC`. Ele armazena configurações globais em 3 níveis: **Módulo (`ZTCA_PARAM_MOD`) ➡️ Parâmetro (`ZTCA_PARAM_PAR`) ➡️ Valores em formato de Range (`ZTCA_PARAM_VAL`)**.

---

## 🔑 2. Pré-Requisitos e Acesso ao Aplicativo

Para realizar a configuração nos ambientes (`S4D` desenvolvimento, `S4Q` qualidade ou `S4P` produção):

* **Acesso ao Fiori Launchpad:** O usuário deve possuir a role `Z_CA` atribuída no perfil do usuário (`SU01`);
* **Objeto de Autorização:** A role deve conter o objeto **`Z_PARAM`** com autorização para o módulo `FI-AR` (ou valor total `*`);
* **Identificação do Bloco (Tile) no Launchpad:**
  * **Título do Bloco:** App Tabela de Parâmetros
  * **Objeto Semântico:** `ZZ1_TAB_PARAM`
  * **Ação:** `manage`

---

## 🛠️ 3. Passo a Passo de Configuração

### 🔹 Etapa 1: Seleção do Módulo (Nível 1)

1. Acesse o **SAP Fiori Launchpad** e abra o aplicativo **App Tabela de Parâmetros**;
2. Na página inicial com a relação dos módulos da empresa, localize o módulo de Contas a Receber: **`FI-AR`**;
3. Clique sobre a linha do módulo `FI-AR` para carregar a lista de parâmetros cadastrados.

---

### 🔹 Etapa 2: Cadastro dos Parâmetros da Demanda (Nível 2)

A chave de parâmetros da Veiling é composta por 3 campos obrigatórios: `Chave 1 (CHAR 20)`, `Chave 2 (CHAR 20)` e `Chave 3 (CHAR 8)`.

Cadastre **3 parâmetros distintos** clicando no botão de adição/criação (**`+`** / **Criar**):

#### 📌 Parâmetro 1: Classes com Perfil À Vista
* **Chave 1:** `DEL_R2R_009` *(Identificador oficial do delta)*
* **Chave 2:** `RISK_CLASS` *(Agrupador do domínio de classes de risco)*
* **Chave 3:** `A_VISTA` *(Perfil à vista - máx. 8 caracteres)*
* **Descrição:** `Classes de Risco - Perfil À Vista`

#### 📌 Parâmetro 2: Classes com Perfil A Prazo
* **Chave 1:** `DEL_R2R_009`
* **Chave 2:** `RISK_CLASS`
* **Chave 3:** `A_PRAZO` *(Perfil a prazo)*
* **Descrição:** `Classes de Risco - Perfil A Prazo`

#### 📌 Parâmetro 3: Classes Excluídas da Avaliação (Contas Internas)
* **Chave 1:** `DEL_R2R_009`
* **Chave 2:** `RISK_CLASS`
* **Chave 3:** `EXCLUIR` *(Classes internas desconsideradas)*
* **Descrição:** `Classes de Risco Excluídas (CVH Interna)`

---

### 🔹 Etapa 3: Cadastro dos Valores em Formato Range (Nível 3)

Com os 3 parâmetros criados, clique sobre cada um deles para cadastrar as classes de risco correspondentes:

#### 1. No parâmetro `A_VISTA`:
Clique em **Criar / Inserir Valor**:
* **Sinal (SIGN):** `I` *(Inclusivo / Delimitação de área incluída)*
* **Opção (OPTION):** `EQ` *(Igual)*
* **Valor Mínimo (LOW):** `1A`
* **Valor Máximo (HIGH):** *(deixar em branco)*

#### 2. No parâmetro `A_PRAZO`:
Clique em **Criar / Inserir Valor**:
* **Sinal (SIGN):** `I` *(Inclusivo)*
* **Opção (OPTION):** `EQ` *(Igual)*
* **Valor Mínimo (LOW):** `2A`
* **Valor Máximo (HIGH):** *(deixar em branco)*

#### 3. No parâmetro `EXCLUIR`:
Clique em **Criar / Inserir Valor**:
* **Sinal (SIGN):** `I` *(Inclusivo)*
* **Opção (OPTION):** `EQ` *(Igual)*
* **Valor Mínimo (LOW):** `5`
* **Valor Máximo (HIGH):** *(deixar em branco)*

Clique em **Salvar** para confirmar as alterações.

---

## 📋 4. Tabela Resumo dos Dados Cadastrados

Abaixo está o mapa consolidado dos registros persistidos nas tabelas `ZTCA_PARAM_PAR` e `ZTCA_PARAM_VAL`:

| Módulo | Chave 1 | Chave 2 | Chave 3 | Sinal | Opção | Valor Mínimo (LOW) | Valor Máximo (HIGH) | Descrição do Parâmetro |
| :--- | :--- | :--- | :--- | :---: | :---: | :---: | :---: | :--- |
| `FI-AR` | `DEL_R2R_009` | `RISK_CLASS` | `A_VISTA` | `I` | `EQ` | `1A` | *(vazio)* | Classes de Risco - Perfil À Vista |
| `FI-AR` | `DEL_R2R_009` | `RISK_CLASS` | `A_PRAZO` | `I` | `EQ` | `2A` | *(vazio)* | Classes de Risco - Perfil A Prazo |
| `FI-AR` | `DEL_R2R_009` | `RISK_CLASS` | `EXCLUIR` | `I` | `EQ` | `5` | *(vazio)* | Classes de Risco Excluídas (CVH Interna) |

---

## 💻 5. Como o Código ABAP Consome esses Parâmetros

No backend ABAP (na classe Behavior Pool `[[08 - ZCLFI_BP_CLIENTE_INAD|ZCLFI_BP_CLIENTE_INAD]]` ou nas rotinas de validação), os valores são recuperados através da classe global padrão da Veiling **`zclca_tabela_parametros`** utilizando o método estático **`m_get_range`**:

```abap
DATA: lr_classes_excluidas TYPE RANGE OF ukm_risk_class,
      lr_classes_a_vista   TYPE RANGE OF ukm_risk_class,
      lr_classes_a_prazo   TYPE RANGE OF ukm_risk_class.

TRY.
    " 1. Carrega as classes internas desconsideradas (Classe 5)
    zclca_tabela_parametros=>m_get_range(
      EXPORTING
        iv_modulo = 'FI'
        iv_chave1 = 'DEL_R2R_009'
        iv_chave2 = 'RISK_CLASS'
        iv_chave3 = 'EXCLUIR'
      IMPORTING
        et_range  = lr_classes_excluidas ).

    " 2. Carrega as classes de perfil À Vista (Classe 1A)
    zclca_tabela_parametros=>m_get_range(
      EXPORTING
        iv_modulo = 'FI'
        iv_chave1 = 'DEL_R2R_009'
        iv_chave2 = 'RISK_CLASS'
        iv_chave3 = 'A_VISTA'
      IMPORTING
        et_range  = lr_classes_a_vista ).

    " 3. Carrega as classes de perfil A Prazo (Classe 2A)
    zclca_tabela_parametros=>m_get_range(
      EXPORTING
        iv_modulo = 'FI'
        iv_chave1 = 'DEL_R2R_009'
        iv_chave2 = 'RISK_CLASS'
        iv_chave3 = 'A_PRAZO'
      IMPORTING
        et_range  = lr_classes_a_prazo ).

  CATCH cx_root INTO DATA(lx_erro).
    " Tratamento obrigatório: previne dump no sistema caso a variável ainda não exista no ambiente
    MESSAGE lx_erro->get_text( ) TYPE 'E'.
ENDTRY.
```

---

## 🔄 6. Procedimento de Manutenção Futura (Sustentação)

Caso a Veiling Holambra altere sua classificação de crédito no FSCM (transação `SPRO`), o time de sustentação ou usuário-chave deve seguir o procedimento abaixo:

### 🔹 Cenário A: Inclusão de Nova Classe de Compra (ex.: `3A` A Prazo Especial)
1. Abrir o **App Tabela de Parâmetros** no Launchpad;
2. Navegar em `FI-AR` ➡️ `DEL_R2R_009` / `RISK_CLASS` / `A_PRAZO`;
3. Inserir uma nova linha na tabela de valores:
   * **Sinal:** `I` | **Opção:** `EQ` | **Valor Mínimo:** `3A`
4. Clicar em **Salvar**.
5. *Resultado:* O aplicativo de inadimplência passa a considerar clientes com classe `3A` na régua de corte de A Prazo (R$ 500,01) imediatamente, sem transporte de TR.

### 🔹 Cenário B: Inclusão de Nova Conta Interna da Veiling (ex.: `6` Filial Administrativa)
1. Abrir o **App Tabela de Parâmetros**;
2. Navegar em `FI-AR` ➡️ `DEL_R2R_009` / `RISK_CLASS` / `EXCLUIR`;
3. Inserir uma nova linha:
   * **Sinal:** `I` | **Opção:** `EQ` | **Valor Mínimo:** `6`
4. Clicar em **Salvar**.
5. *Resultado:* Clientes com classe `6` serão automaticamente desconsiderados e omitidos do aplicativo Fiori.
