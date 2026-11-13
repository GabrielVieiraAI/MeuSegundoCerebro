---
tipo: objeto-tecnico
tags:
  - projeto
  - veiling-holambra
  - sap
  - fi
  - dcl
  - seguranca
  - abap-cloud
  - del-com-165
  - objeto-tecnico
id_demanda: DEL-COM-165
objeto: "ZI_FI_TAX_CARGA (DCL)"
camada: "4 - Segurança e Mensagens"
data: 2026-11-11
aliases:
  - "ZI_FI_TAX_CARGA (DCL)"
---

# 📦 `ZI_FI_TAX_CARGA (DCL)` (Access Control DCL — Lote de Carga)

⬅️ [[01 - DEL-COM-165 - Arquitetura App 1 (Carga Massiva de Taxas)|Voltar para Arquitetura App 1]] | 🎨 [[01 - DEL-COM-165 - Arquitetura Técnica App 1 (Carga Massiva).excalidraw|Ver no Diagrama Excalidraw App 1]]

---

## 📌 Visão Geral do Objeto

O objeto de Controle de Acesso (**DCL** — *Data Control Language*) `ZI_FI_TAX_CARGA` protege a leitura da entidade raiz [[19 - ZI_FI_TAX_CARGA (CDS)|ZI_FI_TAX_CARGA]] e da sua projeção [[26 - ZC_FI_TAX_CARGA (CDS)|ZC_FI_TAX_CARGA]] exigindo que o usuário possua autorização de exibição (`ACTVT = '03'`) no objeto de autorização [[07 - ZTAXCARGA|ZTAXCARGA]].

---

## ⚖️ Regras de Negócio Aplicadas

1. **Verificação Nativa em Banco de Dados (`PFCG_AUTH`):** Restringe a visualização dos lotes de carga apenas a usuários que possuam uma função (Role PFCG) contendo o objeto `ZTAXCARGA` com atividade `03` (Exibir).

---

## 🛠️ Passo a Passo da Criação do Objeto

1. **No Eclipse ADT:** Clique com o botão direito sobre a CDS View [[19 - ZI_FI_TAX_CARGA (CDS)|ZI_FI_TAX_CARGA]] -> **`New Access Control`**.
2. Preencha as propriedades:
   - **Name:** `ZI_FI_TAX_CARGA`
   - **Description:** `DEL-COM-165: Controle de Acesso DCL Lote de Carga`
3. Selecione a Request (TR) de desenvolvimento e conclua o assistente.
4. Substitua o código gerado pelo snippet abaixo e ative com **`Ctrl + F3`**.

---

## 💻 Snippet de Código

### 📝 Código Comentado (Para Estudo e Referência)

```abap
@EndUserText.label: 'DEL-COM-165: DCL Lote de Carga de Taxas'
@MappingRole: true
define role ZI_FI_TAX_CARGA {
  // Concede leitura à CDS raiz se o usuário possuir ACTVT = '03' no objeto ZTAXCARGA
  grant select on ZI_FI_TAX_CARGA
    where ( ) = aspect pfcg_auth( ZTAXCARGA, ACTVT = '03' );
}
```

---

### 🚀 Código Limpo (Sem Comentários - Para Copiar e Colar)

```abap
@EndUserText.label: 'DEL-COM-165: DCL Lote de Carga de Taxas'
@MappingRole: true
define role ZI_FI_TAX_CARGA {
  grant select on ZI_FI_TAX_CARGA
    where ( ) = aspect pfcg_auth( ZTAXCARGA, ACTVT = '03' );
}
```
