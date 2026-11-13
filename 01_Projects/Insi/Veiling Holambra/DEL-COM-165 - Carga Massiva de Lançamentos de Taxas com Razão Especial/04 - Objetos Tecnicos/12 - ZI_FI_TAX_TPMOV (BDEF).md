---
tipo: objeto-tecnico
tags:
  - projeto
  - veiling-holambra
  - sap
  - fi
  - bdef
  - rap
  - abap-cloud
  - del-com-165
  - objeto-tecnico
id_demanda: DEL-COM-165
objeto: "ZI_FI_TAX_TPMOV (BDEF)"
camada: "3 - Comportamento RAP"
data: 2026-11-11
aliases:
  - "ZI_FI_TAX_TPMOV (BDEF)"
---

# 📦 `ZI_FI_TAX_TPMOV (BDEF)` (Behavior Definition Root — Tipos de Movimento)

⬅️ [[02 - DEL-COM-165 - Arquitetura App 2 (Tipos de Movimento)|Voltar para Arquitetura App 2]] | 🎨 [[02 - DEL-COM-165 - Arquitetura Técnica App 2 (Tipos de Movimento).excalidraw|Ver no Diagrama Excalidraw App 2]]

---

## 📌 Visão Geral do Objeto

O Behavior Definition `ZI_FI_TAX_TPMOV` define o comportamento transacional **Managed com Draft** do **Aplicativo 2** (Manutenção de Tipos de Movimento), vinculando a entidade raiz [[11 - ZI_FI_TAX_TPMOV (CDS)|ZI_FI_TAX_TPMOV]] à tabela ativa [[01 - ZTFI_TAX_TPMOV|ZTFI_TAX_TPMOV]], à tabela de rascunho [[02 - ZTFI_TAX_TPMOV_D|ZTFI_TAX_TPMOV_D]] e à classe de implementação [[13 - ZCLFI_BP_TAX_TPMOV|ZCLFI_BP_TAX_TPMOV]].

---

## ⚖️ Regras de Negócio Aplicadas

1. **Operações Standard + Draft:** Habilita `create`, `update`, `delete` e as ações de rascunho (`Edit`, `Activate`, `Discard`, `Resume`, `Prepare`).
2. **Determinação de Valores Padrão (`preencherDefaults`):** Ao criar um novo Tipo de Movimento (`on modify { create; }`), preenche automaticamente `blart = 'Z1'`, `zlspr = 'T'`, `ativo = 'X'`, `valido_de = sy-datum` e `valido_ate = '99991231'`.
3. **Validações no Salvamento (`validarRegistro`):** Garante antes de gravar no banco (`on save`) que a descrição foi informada, que a data inicial não é superior à data final e que ao menos um código de Razão Especial (`umskz_deb`/`umskz_cred`) ou conta de contrapartida (`hkont_contrapartida`) foi parametrizado.

---

## 🛠️ Passo a Passo da Criação do Objeto

1. **No Eclipse ADT:** Clique com o botão direito sobre a CDS View [[11 - ZI_FI_TAX_TPMOV (CDS)|ZI_FI_TAX_TPMOV]] -> **`New Behavior Definition`**.
2. Preencha as propriedades:
   - **Implementation Type:** `Managed`
3. Selecione a Request (TR) de desenvolvimento e conclua o assistente.
4. Substitua o código gerado pelo snippet abaixo e ative com **`Ctrl + F3`**.

---

## 💻 Snippet de Código

### 📝 Código Comentado (Para Estudo e Referência)

```abap
managed implementation in class zclfi_bp_tax_tpmov unique;
strict ( 2 );
with draft;

define behavior for ZI_FI_TAX_TPMOV alias TipoMovimento
persistent table ztfi_tax_tpmov
draft table ztfi_tax_tpmov_d
lock master total etag alterado_em_total
authorization master ( global )
etag master alterado_em
{
  // Operações standard de CRUD habilitadas para manutenção da tabela
  create;
  update;
  delete;

  // Chave primária somente leitura após criação; campos administrativos gerenciados pelo RAP
  field ( mandatory : create, readonly : update ) ztpmov;
  field ( mandatory ) descricao;
  field ( readonly ) criado_por, criado_em, alterado_por, alterado_em, alterado_em_total;

  // Determinação automática de defaults ao iniciar a criação de um registro
  determination preencherDefaults on modify { create; }

  // Validação de integridade executada no momento de salvar o rascunho
  validation validarRegistro on save { create; update; field descricao, umskz_deb, umskz_cred, hkont_contrapartida, valido_de, valido_ate; }

  // Ações obrigatórias do ciclo de vida Draft no RAP
  draft action Edit;
  draft action Activate optimized;
  draft action Discard;
  draft action Resume;
  draft determine action Prepare
  {
    validation validarRegistro;
  }
}
```

---

### 🚀 Código Limpo (Sem Comentários - Para Copiar e Colar)

```abap
managed implementation in class zclfi_bp_tax_tpmov unique;
strict ( 2 );
with draft;

define behavior for ZI_FI_TAX_TPMOV alias TipoMovimento
persistent table ztfi_tax_tpmov
draft table ztfi_tax_tpmov_d
lock master total etag alterado_em_total
authorization master ( global )
etag master alterado_em
{
  create;
  update;
  delete;

  field ( mandatory : create, readonly : update ) ztpmov;
  field ( mandatory ) descricao;
  field ( readonly ) criado_por, criado_em, alterado_por, alterado_em, alterado_em_total;

  determination preencherDefaults on modify { create; }

  validation validarRegistro on save { create; update; field descricao, umskz_deb, umskz_cred, hkont_contrapartida, valido_de, valido_ate; }

  draft action Edit;
  draft action Activate optimized;
  draft action Discard;
  draft action Resume;
  draft determine action Prepare
  {
    validation validarRegistro;
  }
}
```
