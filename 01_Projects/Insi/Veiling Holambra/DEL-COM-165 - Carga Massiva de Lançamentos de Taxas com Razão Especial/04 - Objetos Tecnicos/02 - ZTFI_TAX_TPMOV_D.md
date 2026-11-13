---
tipo: objeto-tecnico
tags:
  - projeto
  - veiling-holambra
  - sap
  - fi
  - ddic
  - rap
  - abap-cloud
  - del-com-165
  - objeto-tecnico
id_demanda: DEL-COM-165
objeto: "ZTFI_TAX_TPMOV_D"
camada: "1 - Dicionário de Dados"
data: 2026-11-11
aliases:
  - "ZTFI_TAX_TPMOV_D"
---

# 📦 `ZTFI_TAX_TPMOV_D` (Tabela Transparente de Draft — Tipos de Movimento)

⬅️ [[02 - DEL-COM-165 - Arquitetura App 2 (Tipos de Movimento)|Voltar para Arquitetura App 2]] | 🎨 [[02 - DEL-COM-165 - Arquitetura Técnica App 2 (Tipos de Movimento).excalidraw|Ver no Diagrama Excalidraw App 2]]

---

## 📌 Visão Geral do Objeto

A tabela `ZTFI_TAX_TPMOV_D` é a tabela de **Draft** (rascunho) exigida pelo framework **RAP** para suportar a edição concorrente, salvamento automático temporário e bloqueio otimista no **Aplicativo 2** ([[36 - taxastipomov (App Fiori)|taxastipomov]]). Ela espelha exatamente os campos da entidade raiz [[11 - ZI_FI_TAX_TPMOV (CDS)|ZI_FI_TAX_TPMOV]] e adiciona a estrutura administrativa standard `sych_bdl_draft_admin_inc`.

---

## ⚖️ Regras de Negócio Aplicadas

1. **Persistência Temporária de Rascunho:** Enquanto o usuário chave cria ou altera um Tipo de Movimento na interface Fiori Elements, os dados ficam gravados em `ZTFI_TAX_TPMOV_D` até que ele clique em **Salvar**, momento em que o RAP executa as validações do [[13 - ZCLFI_BP_TAX_TPMOV|ZCLFI_BP_TAX_TPMOV]] e transfere o registro para a tabela ativa [[01 - ZTFI_TAX_TPMOV|ZTFI_TAX_TPMOV]].

---

## 🛠️ Passo a Passo da Criação do Objeto

1. **No Eclipse ADT:** Conecte-se ao sistema e acesse o pacote `ZFI_CARGA_TAXAS`.
2. Clique com o botão direito -> **`New`** -> **`Database Table`** (ou utilize o *Quick Fix* `Ctrl + 1` na linha `draft table ztfi_tax_tpmov_d` dentro do Behavior Definition [[12 - ZI_FI_TAX_TPMOV (BDEF)|ZI_FI_TAX_TPMOV]]).
3. Preencha as propriedades:
   - **Name:** `ZTFI_TAX_TPMOV_D`
   - **Description:** `DEL-COM-165: Draft de Tipos de Movimento de Taxas`
4. Selecione a Request (TR) de desenvolvimento e conclua o assistente.
5. Substitua o código gerado pelo snippet abaixo e ative com **`Ctrl + F3`**.

---

## 💻 Snippet de Código

### 📝 Código Comentado (Para Estudo e Referência)

```abap
@EndUserText.label : 'DEL-COM-165: Draft Tipos de Movimento'
@AbapCatalog.enhancement.category : #EXTENSIBLE_ANY
@AbapCatalog.tableCategory : #TRANSPARENT
@AbapCatalog.deliveryClass : #A
@AbapCatalog.dataMaintenance : #RESTRICTED
define table ztfi_tax_tpmov_d {

  // Mandante e chave primária idênticos à entidade raiz ZI_FI_TAX_TPMOV
  key mandt               : mandt not null;
  key ztpmov              : abap.char(6) not null;
  // Campos de negócio espelhados da CDS View
  descricao               : abap.char(60);
  umskz_deb               : umskz;
  umskz_cred              : umskz;
  hkont_contrapartida     : hkont;
  blart                   : blart;
  zlspr                   : dzlspr;
  zfbdt_obrig             : abap_boolean;
  zuonr_obrig             : abap_boolean;
  ativo                   : abap_boolean;
  valido_de               : abap.dats;
  valido_ate              : abap.dats;
  // Campos de controle de auditoria
  criado_por              : abp_creation_user;
  criado_em               : abp_creation_tstmpl;
  alterado_por            : abp_locinst_lastchange_user;
  alterado_em             : abp_locinst_lastchange_tstmpl;
  alterado_em_total       : abp_lastchange_tstmpl;
  // Estrutura administrativa obrigatória de Draft do RAP
  "%admin"                : include sych_bdl_draft_admin_inc;

}
```

---

### 🚀 Código Limpo (Sem Comentários - Para Copiar e Colar)

```abap
@EndUserText.label : 'DEL-COM-165: Draft Tipos de Movimento'
@AbapCatalog.enhancement.category : #EXTENSIBLE_ANY
@AbapCatalog.tableCategory : #TRANSPARENT
@AbapCatalog.deliveryClass : #A
@AbapCatalog.dataMaintenance : #RESTRICTED
define table ztfi_tax_tpmov_d {

  key mandt               : mandt not null;
  key ztpmov              : abap.char(6) not null;
  descricao               : abap.char(60);
  umskz_deb               : umskz;
  umskz_cred              : umskz;
  hkont_contrapartida     : hkont;
  blart                   : blart;
  zlspr                   : dzlspr;
  zfbdt_obrig             : abap_boolean;
  zuonr_obrig             : abap_boolean;
  ativo                   : abap_boolean;
  valido_de               : abap.dats;
  valido_ate              : abap.dats;
  criado_por              : abp_creation_user;
  criado_em               : abp_creation_tstmpl;
  alterado_por            : abp_locinst_lastchange_user;
  alterado_em             : abp_locinst_lastchange_tstmpl;
  alterado_em_total       : abp_lastchange_tstmpl;
  "%admin"                : include sych_bdl_draft_admin_inc;

}
```
