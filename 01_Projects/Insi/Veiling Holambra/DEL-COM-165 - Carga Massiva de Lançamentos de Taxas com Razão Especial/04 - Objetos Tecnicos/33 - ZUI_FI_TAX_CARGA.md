---
tipo: objeto-tecnico
tags:
  - projeto
  - veiling-holambra
  - sap
  - fi
  - rap
  - odata
  - abap-cloud
  - del-com-165
  - objeto-tecnico
id_demanda: DEL-COM-165
objeto: "ZUI_FI_TAX_CARGA"
camada: "5 - Serviço e Exposição"
data: 2026-11-11
aliases:
  - "ZUI_FI_TAX_CARGA"
---

# 📦 `ZUI_FI_TAX_CARGA` (Service Definition — Carga Massiva de Taxas)

⬅️ [[01 - DEL-COM-165 - Arquitetura App 1 (Carga Massiva de Taxas)|Voltar para Arquitetura App 1]] | 🎨 [[01 - DEL-COM-165 - Arquitetura Técnica App 1 (Carga Massiva).excalidraw|Ver no Diagrama Excalidraw App 1]]

---

## 📌 Visão Geral do Objeto

A Service Definition `ZUI_FI_TAX_CARGA` declara o escopo do serviço OData V4 do **Aplicativo 1** (Carga Massiva e Monitor de Taxas), expondo a hierarquia completa de projeção (`ZC_FI_TAX_CARGA`, `ZC_FI_TAX_DOC`, `ZC_FI_TAX_ITEM`) e a entidade de ajuda de pesquisa [[11 - ZI_FI_TAX_TPMOV (CDS)|ZI_FI_TAX_TPMOV]].

---

## ⚖️ Regras de Negócio Aplicadas

1. **Exposição Completa da Hierarquia em 3 Níveis:** Disponibiliza os Entity Sets `Carga`, `Documento`, `Item` e `TipoMovimento` para navegação *drill-down* no SAP Fiori Elements.

---

## 🛠️ Passo a Passo da Criação do Objeto

1. **No Eclipse ADT:** Clique com o botão direito sobre [[26 - ZC_FI_TAX_CARGA (CDS)|ZC_FI_TAX_CARGA]] -> **`New Service Definition`**.
2. Preencha as propriedades:
   - **Name:** `ZUI_FI_TAX_CARGA`
   - **Description:** `DEL-COM-165: Service Definition Carga Massiva de Taxas`
3. Selecione a Request (TR) de desenvolvimento e conclua o assistente.
4. Substitua o código gerado pelo snippet abaixo e ative com **`Ctrl + F3`**.

---

## 💻 Snippet de Código

### 📝 Código Comentado (Para Estudo e Referência)

```abap
@EndUserText.label: 'DEL-COM-165: Serviço Carga Massiva de Taxas'
define service ZUI_FI_TAX_CARGA {
  // Entidade Raiz (Nível 1): Cabeçalho do Lote de Carga
  expose ZC_FI_TAX_CARGA as Carga;
  // Entidade Filha (Nível 2): Documentos Contábeis agrupados por DOCSEQ
  expose ZC_FI_TAX_DOC   as Documento;
  // Entidade Neta (Nível 3): Partidas Individuais do Documento
  expose ZC_FI_TAX_ITEM  as Item;
  // Entidade de Apoio (Value Help): Tipos de Movimento configurados
  expose ZI_FI_TAX_TPMOV as TipoMovimento;
}
```

---

### 🚀 Código Limpo (Sem Comentários - Para Copiar e Colar)

```abap
@EndUserText.label: 'DEL-COM-165: Serviço Carga Massiva de Taxas'
define service ZUI_FI_TAX_CARGA {
  expose ZC_FI_TAX_CARGA as Carga;
  expose ZC_FI_TAX_DOC   as Documento;
  expose ZC_FI_TAX_ITEM  as Item;
  expose ZI_FI_TAX_TPMOV as TipoMovimento;
}
```
