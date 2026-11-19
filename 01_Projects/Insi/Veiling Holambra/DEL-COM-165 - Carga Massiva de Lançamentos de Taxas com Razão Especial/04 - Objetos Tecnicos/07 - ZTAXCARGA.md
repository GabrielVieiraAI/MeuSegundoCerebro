---
tipo: objeto-tecnico
tags:
  - projeto
  - veiling-holambra
  - sap
  - fi
  - su21
  - seguranca
  - abap-cloud
  - del-com-165
  - objeto-tecnico
id_demanda: DEL-COM-165
objeto: "ZTAXCARGA"
camada: "4 - Segurança e Mensagens"
data: 2026-11-11
aliases:
  - "ZTAXCARGA"
---

# 📦 `ZTAXCARGA` (Objeto de Autorização — SU21)

⬅️ [[00 - DEL-COM-165 - Visão Integrada e Infraestrutura|Visão Integrada]] | 📱 [[01 - DEL-COM-165 - Arquitetura (Carga Massiva de Taxas)|Arquitetura Carga Massiva de Taxas]] | ⚙️ [[02 - DEL-COM-165 - Arquitetura (Tipos de Movimento)|Arquitetura Tipos de Movimento]]

---

## 📌 Visão Geral do Objeto

O objeto de autorização `ZTAXCARGA` controla a segurança de acesso e segregação de funções nos dois aplicativos da demanda **DEL-COM-165**. Ele segue o [[00 - Padrão de Nomenclatura ABAP Veiling Holambra|Padrão de Nomenclatura ABAP Veiling Holambra]] (`Z<desc>`, máximo de 10 caracteres, contendo obrigatoriamente o campo `ACTVT`).

---

## ⚖️ Regras de Negócio Aplicadas

1. **Segregação por Empresa (`BUKRS`) e Atividade (`ACTVT`):**
   - `ACTVT = '01'` (*Criar / Gerar*): Permissão para realizar o upload de planilha Excel (`carregarArquivo`) no Aplicativo de Carga Massiva de Taxas (`ZFI_TAX_CARGA`) e criar novos Tipos de Movimento no Aplicativo de Tipos de Movimento (`ZFI_TAX_TPMOV`).
   - `ACTVT = '02'` (*Modificar*): Permissão para editar Tipos de Movimento na tabela `ZTFI_TAX_TPMOV` (Aplicativo de Tipos de Movimento (`ZFI_TAX_TPMOV`)).
   - `ACTVT = '03'` (*Exibir*): Permissão de leitura validada pelo controle de acesso DCL [[20 - ZI_FI_TAX_CARGA (DCL)|ZI_FI_TAX_CARGA]] e para download do modelo Excel (`baixarModelo`).
   - `ACTVT = '16'` (*Executar*): Permissão para acionar o botão **Contabilizar Lote** (`lancar`) no Aplicativo de Carga Massiva de Taxas (`ZFI_TAX_CARGA`), efetuando o lançamento contábil via BAPI.

---

## 🛠️ Passo a Passo da Criação do Objeto

### 🔖 Metadados ADT

```yaml
objectType: "SUSO (Manual - SU21)"
packageName: "ZFI_TAX_COMUM"
name: "ZTAXCARGA"
description: "DEL-COM-165: Autorização Carga de Taxas com Razão Especial"
extraParams:
  manualTransaction: "SU21"
```

1. **No Eclipse ADT (ou transação `SU21` no SAP GUI):** Conecte-se ao sistema e acesse o pacote `ZFI_TAX_COMUM`.
2. Clique com o botão direito -> **`New`** -> **`Other ABAP Repository Object`** -> **`Authorization Object`**.
3. Preencha as propriedades:
   - **Name:** `ZTAXCARGA`
   - **Description:** `DEL-COM-165: Autorização Carga de Taxas com Razão Especial`
   - **Object Class:** `FI` (ou `ZFI`)
4. Adicione os campos de autorização `BUKRS` e `ACTVT`.
5. Em **Permitted Activities**, marque `01` (Create), `02` (Change), `03` (Display) e `16` (Execute).
6. Salve e ative com **`Ctrl + F3`**.

---

## 💻 Snippet de Código

### 📝 Código Comentado (Para Estudo e Referência)

```text
// =========================================================================
// DEFINIÇÃO DO OBJETO DE AUTORIZAÇÃO ZTAXCARGA (SU21 / Eclipse ADT)
// =========================================================================
Object Name        : ZTAXCARGA
Description        : DEL-COM-165: Autorização Carga de Taxas com Razão Especial
Authorization Class: FI
Package            : ZFI_TAX_COMUM

// Campos de Autorização (Authorization Fields):
1. BUKRS (Empresa / Company Code)
2. ACTVT (Atividade / Activity)

// Atividades Permitidas (Permitted Activities for ACTVT):
- 01 : Criar ou gerar (Upload de planilha no Aplicativo de Carga Massiva de Taxas (`ZFI_TAX_CARGA`) / Criar Tipo Mov. no Aplicativo de Tipos de Movimento (`ZFI_TAX_TPMOV`))
- 02 : Modificar (Alterar Tipo de Movimento no Aplicativo de Tipos de Movimento (`ZFI_TAX_TPMOV`))
- 03 : Exibir (Visualizar cargas no monitor / Baixar modelo Excel)
- 16 : Executar (Contabilizar documentos válidos no Aplicativo de Carga Massiva de Taxas (`ZFI_TAX_CARGA`))
```

```abap
" Exemplo de verificação via AUTHORITY-CHECK nos Behavior Pools:
AUTHORITY-CHECK OBJECT 'ZTAXCARGA'
  ID 'BUKRS' FIELD 'CVH1'
  ID 'ACTVT' FIELD '16'.
IF sy-subrc <> 0.
  " Dispara mensagem E001(ZFI_TAXAS)
ENDIF.
```

---

### 🚀 Código Limpo (Sem Comentários - Para Copiar e Colar)

```text
Object Name: ZTAXCARGA
Description: DEL-COM-165: Autorização Carga de Taxas com Razão Especial
Class      : FI
Fields     : BUKRS, ACTVT
Activities : 01, 02, 03, 16
```

---

## 📚 Origem da Regra de Negócio (Rastreabilidade Funcional)

A regra de controle de segurança e segregação de perfis foi definida pelo consultor funcional (**Fabrício Santana**, revisada por **Lívia Barcelos**) no **DPS** (*Desenho de Proposta de Solução* — [[DEL-COM-165 - Carga Massiva de Lançamentos de Taxas com Razão Especial.pptx]]), que equivale à Especificação Funcional (**EF**) oficial do projeto (conforme **Decisão 09** em [[Consolidado de decisões tomadas em todas as reuniões]]).

### Onde está especificado no PowerPoint (DPS)

| Slide | Seção | O que o DPS solicita |
| :--- | :--- | :--- |
| **Slide 31** *(principal)* | Detalhamento da Implementação (2/2) — *Objetos de autorização* | Define os campos `BUKRS` (Empresa) e `ACTVT` (Atividade), separando *Carregar/Validar/Simular*, *Lançar*, *Reprocessar* e *Consultar*, além da manutenção de tipos de movimento, em **3 perfis**: **Analista de Contas a Pagar** (carga, simulação, lançamento e reprocessamento), **Contabilidade** (parametrização de tipos de movimento) e **Consulta** (log e exportação). Complementam a *role* padrão `SAP_BR_AP_ACCOUNTANT` prevista no **BPDD** (*Business Process Design Document*). |
| **Slide 32** | Inventário Técnico de Objetos | Lista a camada **Autorização** (`BUKRS + ACTVT` e *Roles por perfil*), sugerindo os nomes `ZTAXM_CARG` e `ZTAXM_PARM`, com a ressalva no topo de que *"podem ser ajustados pela equipe ABAP sem impacto funcional"*. |
| **Slide 21** | Requisitos do desenvolvimento | Exige: *"Controlar o acesso por perfil: carga e lançamento (Contas a Pagar), parametrização de tipos de movimento (Contabilidade) e consulta (auditoria)."* |
| **Slide 23** | Layout do Template Excel (1/2) | No campo `BUKRS` (Empresa), define: *"Autorização do usuário por empresa."* |
| **Slide 17** | Configurações SAP / Objetos RICEFW | Justifica a ausência de Workflow: *"Não há etapa de aprovação: o controle é feito por autorização (quem carrega, quem lança) e pela simulação obrigatória antes do lançamento."* |
| **Slide 37** | Premissas e Restrições (**Premissa `P08`**) | Registra como premissa do Veiling que não há workflow de aprovação antes do lançamento, mantendo controle por autorização e simulação obrigatória. |
| **Slides 38 e 39** | Pontos a Validar (**`Q05`** e **`Q08`**) | **`Q05`:** *"Contas a Pagar carrega e lança; Contabilidade parametriza"* (observação: *"Só roles"*).<br>**`Q08`:** descarta aprovação em 4 olhos, mantendo *"autorização + simulação"*. |
| **Slide 41** | Plano de Testes (**`CT-09`**) | Define o **CT** (*Caso de Teste*) **`CT-09`** (*"Autorização: perfil Consulta tenta lançar"*): usuário com *role* de consulta recebe ação indisponível / erro de autorização e mantém o log intacto. |
| **Slide 42** | *Cutover* Técnico (Tarefas 4, 6 e 7) | Prevê transporte dos objetos de autorização (`STMS`), configuração de *roles* via **`PFCG`** (transação SAP de manutenção de perfis e autorizações) e atribuição aos usuários de Contas a Pagar, Contabilidade e Consulta via **`SU01`** (cadastro de usuários) / **`PFCG`**. |

### Mapeamento da sugestão do DPS para o objeto técnico `ZTAXCARGA`

- **Autonomia para renomear e consolidar:** Tanto o **Slide 32** quanto a **Decisão 05** em [[01 - Primeira reunião com consultores]] autorizaram a equipe ABAP a ajustar os nomes sugeridos e definir a arquitetura técnica sem impacto funcional (repassando a lista final de objetos ao final).
- **Adequação ao padrão do cliente:** Os dois objetos sugeridos (`ZTAXM_CARG` e `ZTAXM_PARM`) foram consolidados em um único objeto compartilhado (`ZTAXCARGA`) no pacote `ZFI_TAX_COMUM`, seguindo o [[00 - Padrão de Nomenclatura ABAP Veiling Holambra]] (`Z<desc>` na `SU21`, limite de 10 caracteres e campo obrigatório `ACTVT`), conforme documentado em [[00 - DEL-COM-165 - Visão Integrada e Infraestrutura]].
- **Cobertura dos 3 perfis pedidos:**
  - `ACTVT = '01'`, `'03'` e `'16'` (no app `ZFI_TAX_CARGA`): atendem ao perfil **Analista de Contas a Pagar** (upload de planilha, visualização/download de modelo e contabilização do lote);
  - `ACTVT = '01'` e `'02'` (no app `ZFI_TAX_TPMOV`): atendem ao perfil **Contabilidade** (criação e edição de Tipos de Movimento);
  - `ACTVT = '03'` (leitura via DCL `ZI_FI_TAX_CARGA` e download do modelo Excel): atende ao perfil **Consulta** (sem permissão de carga `'01'` nem lançamento `'16'`, cobrindo o cenário `CT-09`).
- **Remoção do Reprocessamento:** A ação *Reprocessar* citada no Slide 31 deixou de existir por decisão posterior de reunião registrada em [[Consolidado de decisões tomadas em todas as reuniões]] e [[01 - Especificação Funcional (Visão da Solução)]].
