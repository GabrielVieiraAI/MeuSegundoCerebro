---
tipo: objeto-tecnico
tags:
  - projeto
  - veiling-holambra
  - sap
  - fi
  - cds
  - rap
  - abap-cloud
  - del-com-165
  - objeto-tecnico
id_demanda: DEL-COM-165
objeto: "ZC_FI_TAX_TPMOV (CDS)"
camada: "2 - Modelagem CDS"
data: 2026-11-11
aliases:
  - "ZC_FI_TAX_TPMOV (CDS)"
  - "ZC_FI_TAX_TPMOV"
---

# 📦 `ZC_FI_TAX_TPMOV (CDS)` (CDS Projection View — Tipos de Movimento)

⬅️ [[02 - DEL-COM-165 - Arquitetura App 2 (Tipos de Movimento)|Voltar para Arquitetura App 2]] | 🎨 [[02 - DEL-COM-165 - Arquitetura Técnica App 2 (Tipos de Movimento).excalidraw|Ver no Diagrama Excalidraw App 2]]

---

## 📌 Visão Geral do Objeto

A CDS View `ZC_FI_TAX_TPMOV` é a visão de consumo (*Projection View*) da entidade raiz [[11 - ZI_FI_TAX_TPMOV (CDS)|ZI_FI_TAX_TPMOV]], responsável por expor os campos de parametrização dos Tipos de Movimento para o serviço OData V4 do **Aplicativo 2** ([[18 - ZUI_O4_FI_TAX_TPMOV|ZUI_O4_FI_TAX_TPMOV]]).

---

## ⚖️ Regras de Negócio Aplicadas

1. **Busca Textual (`@Search.searchable: true`):** Permite pesquisar diretamente na barra de busca do Fiori tanto pelo código do Tipo de Movimento (`ztpmov`, ex.: `DS-ATR`) quanto por parte da descrição (`descricao`, ex.: `Sobras`).
2. **Rótulos Semânticos (`@EndUserText.label`):** Define os nomes de coluna em português voltados ao usuário chave de FI, mantendo a separação entre banco de dados e camada de apresentação (vinculada ao Metadata Extension [[15 - ZC_FI_TAX_TPMOV (MDE)|ZC_FI_TAX_TPMOV]]).

---

## 🛠️ Passo a Passo da Criação do Objeto

1. **No Eclipse ADT:** Conecte-se ao sistema e acesse o pacote `ZFI_CARGA_TAXAS`.
2. Clique com o botão direito -> **`New`** -> **`Data Definition`**.
3. Preencha as propriedades:
   - **Name:** `ZC_FI_TAX_TPMOV`
   - **Description:** `DEL-COM-165: Projection CDS Tipos de Movimento de Taxas`
   - **Referenced Object:** `ZI_FI_TAX_TPMOV`
4. Selecione o template **`Define Projection View`** e conclua o assistente.
5. Substitua o código gerado pelo snippet abaixo e ative com **`Ctrl + F3`**.

---

## 💻 Snippet de Código

### 📝 Código Comentado (Para Estudo e Referência)

```abap
@AccessControl.authorizationCheck: #NOT_REQUIRED
@EndUserText.label: 'DEL-COM-165: Manutenção de Tipos de Movimento'
@Metadata.allowExtensions: true
@Search.searchable: true
define root view entity ZC_FI_TAX_TPMOV
  provider contract transactional_query
  as projection on ZI_FI_TAX_TPMOV
{
      @EndUserText.label: 'Tipo de Movimento'
      @Search.defaultSearchElement: true
      @Search.fuzzinessThreshold: 0.8
  key ztpmov,

      @EndUserText.label: 'Descrição do Movimento'
      @Search.defaultSearchElement: true
      @Search.fuzzinessThreshold: 0.8
      descricao,

      @EndUserText.label: 'Razão Esp. Débito'
      umskz_deb,

      @EndUserText.label: 'Razão Esp. Crédito'
      umskz_cred,

      @EndUserText.label: 'Conta Contrapartida (G/L)'
      hkont_contrapartida,

      @EndUserText.label: 'Tipo de Documento'
      blart,

      @EndUserText.label: 'Bloqueio Pagamento'
      zlspr,

      @EndUserText.label: 'Data Base (ZFBDT) Obrig.'
      zfbdt_obrig,

      @EndUserText.label: 'Atribuição (ZUONR) Obrig.'
      zuonr_obrig,

      @EndUserText.label: 'Ativo'
      ativo,

      @EndUserText.label: 'Válido De'
      valido_de,

      @EndUserText.label: 'Válido Até'
      valido_ate,

      @EndUserText.label: 'Criado Por'
      criado_por,

      @EndUserText.label: 'Criado Em'
      criado_em,

      @EndUserText.label: 'Alterado Por'
      alterado_por,

      @EndUserText.label: 'Alterado Em'
      alterado_em,

      alterado_em_total
}
```

---

### 🚀 Código Limpo (Sem Comentários - Para Copiar e Colar)

```abap
@AccessControl.authorizationCheck: #NOT_REQUIRED
@EndUserText.label: 'DEL-COM-165: Manutenção de Tipos de Movimento'
@Metadata.allowExtensions: true
@Search.searchable: true
define root view entity ZC_FI_TAX_TPMOV
  provider contract transactional_query
  as projection on ZI_FI_TAX_TPMOV
{
      @EndUserText.label: 'Tipo de Movimento'
      @Search.defaultSearchElement: true
      @Search.fuzzinessThreshold: 0.8
  key ztpmov,

      @EndUserText.label: 'Descrição do Movimento'
      @Search.defaultSearchElement: true
      @Search.fuzzinessThreshold: 0.8
      descricao,

      @EndUserText.label: 'Razão Esp. Débito'
      umskz_deb,

      @EndUserText.label: 'Razão Esp. Crédito'
      umskz_cred,

      @EndUserText.label: 'Conta Contrapartida (G/L)'
      hkont_contrapartida,

      @EndUserText.label: 'Tipo de Documento'
      blart,

      @EndUserText.label: 'Bloqueio Pagamento'
      zlspr,

      @EndUserText.label: 'Data Base (ZFBDT) Obrig.'
      zfbdt_obrig,

      @EndUserText.label: 'Atribuição (ZUONR) Obrig.'
      zuonr_obrig,

      @EndUserText.label: 'Ativo'
      ativo,

      @EndUserText.label: 'Válido De'
      valido_de,

      @EndUserText.label: 'Válido Até'
      valido_ate,

      @EndUserText.label: 'Criado Por'
      criado_por,

      @EndUserText.label: 'Criado Em'
      criado_em,

      @EndUserText.label: 'Alterado Por'
      alterado_por,

      @EndUserText.label: 'Alterado Em'
      alterado_em,

      alterado_em_total
}
```
