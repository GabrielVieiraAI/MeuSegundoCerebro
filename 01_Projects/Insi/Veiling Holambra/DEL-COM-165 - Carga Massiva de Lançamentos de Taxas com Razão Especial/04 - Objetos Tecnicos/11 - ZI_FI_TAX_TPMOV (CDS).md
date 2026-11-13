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
objeto: "ZI_FI_TAX_TPMOV (CDS)"
camada: "2 - Modelagem CDS"
data: 2026-11-11
aliases:
  - "ZI_FI_TAX_TPMOV (CDS)"
  - "ZI_FI_TAX_TPMOV"
---

# 📦 `ZI_FI_TAX_TPMOV (CDS)` (CDS Root View Entity — Tipos de Movimento)

⬅️ [[02 - DEL-COM-165 - Arquitetura App 2 (Tipos de Movimento)|Voltar para Arquitetura App 2]] | 🎨 [[02 - DEL-COM-165 - Arquitetura Técnica App 2 (Tipos de Movimento).excalidraw|Ver no Diagrama Excalidraw App 2]]

---

## 📌 Visão Geral do Objeto

A CDS View `ZI_FI_TAX_TPMOV` é a **Entidade Raiz (*Root View Entity*)** do modelo de dados do **Aplicativo 2** (Manutenção de Tipos de Movimento), construída diretamente sobre a tabela transparente [[01 - ZTFI_TAX_TPMOV|ZTFI_TAX_TPMOV]]. Além de servir como base para o serviço OData V4 de configuração, ela também fornece ajuda de pesquisa (*Value Help*) para o campo `ztpmov` no Aplicativo 1.

---

## ⚖️ Regras de Negócio Aplicadas

1. **Alinhamento Direto 1:1 com a Tabela Ativa e Draft:** Os nomes dos campos da CDS View (`ztpmov`, `descricao`, `umskz_deb`, `umskz_cred`, `hkont_contrapartida`, `blart`, `zlspr`, `zfbdt_obrig`, `zuonr_obrig`, `ativo`, `valido_de`, `valido_ate`) preservam os nomes da tabela [[01 - ZTFI_TAX_TPMOV|ZTFI_TAX_TPMOV]] e da tabela de rascunho [[02 - ZTFI_TAX_TPMOV_D|ZTFI_TAX_TPMOV_D]], dispensando mapeamento manual e facilitando a manutenção.
2. **Controle Concorrente e Auditoria Automática (`@Semantics`):** As anotações `@Semantics.user.*` e `@Semantics.systemDateTime.*` instruem o framework RAP a preencher automaticamente quem criou e quem alterou cada regra de movimento, além de controlar o *ETag* (`alterado_em` e `alterado_em_total`).

---

## 🛠️ Passo a Passo da Criação do Objeto

1. **No Eclipse ADT:** Conecte-se ao sistema e acesse o pacote `ZFI_CARGA_TAXAS`.
2. Clique com o botão direito -> **`New`** -> **`Data Definition`**.
3. Preencha as propriedades:
   - **Name:** `ZI_FI_TAX_TPMOV`
   - **Description:** `DEL-COM-165: Root CDS Tipos de Movimento de Taxas`
4. Selecione o template **`Define Root View Entity`** e conclua o assistente.
5. Substitua o código gerado pelo snippet abaixo e ative com **`Ctrl + F3`**.

---

## 💻 Snippet de Código

### 📝 Código Comentado (Para Estudo e Referência)

```abap
@AccessControl.authorizationCheck: #NOT_REQUIRED
@EndUserText.label: 'DEL-COM-165: Root Tipos de Movimento de Taxas'
@Metadata.ignorePropagatedAnnotations: true
define root view entity ZI_FI_TAX_TPMOV
  as select from ztfi_tax_tpmov
{
      // Chave primária: Código do Tipo de Movimento (ex: TX-COM, CM-DEV, DS-ATR)
      @ObjectModel.text.element: ['descricao']
  key ztpmov,
      // Descrição funcional do Tipo de Movimento
      @Semantics.text: true
      descricao,
      // Indicador de Razão Especial para partidas a Débito
      umskz_deb,
      // Indicador de Razão Especial para partidas a Crédito
      umskz_cred,
      // Conta do Razão para contrapartida automática (ex: 2205010002 no DS-ATR)
      hkont_contrapartida,
      // Tipo de Documento Contábil (ex: Z1)
      blart,
      // Bloqueio de Pagamento padrão (ex: T)
      zlspr,
      // Obrigatoriedade de Data Base (ZFBDT) na planilha
      zfbdt_obrig,
      // Obrigatoriedade de Atribuição/Contrato (ZUONR) na planilha
      zuonr_obrig,
      // Flag de registro ativo
      ativo,
      // Período de vigência da regra
      valido_de,
      valido_ate,
      // Campos administrativos preenchidos pelo framework RAP
      @Semantics.user.createdBy: true
      criado_por,
      @Semantics.systemDateTime.createdAt: true
      criado_em,
      @Semantics.user.localInstanceLastChangedBy: true
      alterado_por,
      @Semantics.systemDateTime.localInstanceLastChangedAt: true
      alterado_em,
      @Semantics.systemDateTime.lastChangedAt: true
      alterado_em_total
}
```

---

### 🚀 Código Limpo (Sem Comentários - Para Copiar e Colar)

```abap
@AccessControl.authorizationCheck: #NOT_REQUIRED
@EndUserText.label: 'DEL-COM-165: Root Tipos de Movimento de Taxas'
@Metadata.ignorePropagatedAnnotations: true
define root view entity ZI_FI_TAX_TPMOV
  as select from ztfi_tax_tpmov
{
      @ObjectModel.text.element: ['descricao']
  key ztpmov,
      @Semantics.text: true
      descricao,
      umskz_deb,
      umskz_cred,
      hkont_contrapartida,
      blart,
      zlspr,
      zfbdt_obrig,
      zuonr_obrig,
      ativo,
      valido_de,
      valido_ate,
      @Semantics.user.createdBy: true
      criado_por,
      @Semantics.systemDateTime.createdAt: true
      criado_em,
      @Semantics.user.localInstanceLastChangedBy: true
      alterado_por,
      @Semantics.systemDateTime.localInstanceLastChangedAt: true
      alterado_em,
      @Semantics.systemDateTime.lastChangedAt: true
      alterado_em_total
}
```
