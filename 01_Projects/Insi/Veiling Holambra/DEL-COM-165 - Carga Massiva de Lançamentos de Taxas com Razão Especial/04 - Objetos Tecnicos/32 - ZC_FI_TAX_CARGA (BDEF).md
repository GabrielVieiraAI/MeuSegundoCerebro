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
objeto: "ZC_FI_TAX_CARGA (BDEF)"
camada: "3 - Comportamento RAP"
data: 2026-11-11
aliases:
  - "ZC_FI_TAX_CARGA (BDEF)"
---

# 📦 `ZC_FI_TAX_CARGA (BDEF)` (Behavior Definition Projection — Carga Massiva de Taxas)

⬅️ [[01 - DEL-COM-165 - Arquitetura App 1 (Carga Massiva de Taxas)|Voltar para Arquitetura App 1]] | 🎨 [[01 - DEL-COM-165 - Arquitetura Técnica App 1 (Carga Massiva).excalidraw|Ver no Diagrama Excalidraw App 1]]

---

## 📌 Visão Geral do Objeto

O Behavior Definition de Projeção `ZC_FI_TAX_CARGA` projeta para o serviço OData V4 do **Aplicativo 1** as ações `carregarArquivo`, `baixarModelo` e `lancar`, a operação `delete` (para lotes ainda não contabilizados) e as navegações composicionais `_Documentos` e `_Itens`.

---

## ⚖️ Regras de Negócio Aplicadas

1. **Exposição Enxuta e Segura:** Expõe apenas as 3 ações de negócio aprovadas na arquitetura (`carregarArquivo`, `baixarModelo` e `lancar`), sem botões de edição manual de linhas ou reprocessamento.

---

## 🛠️ Passo a Passo da Criação do Objeto

1. **No Eclipse ADT:** Clique com o botão direito sobre a CDS View [[26 - ZC_FI_TAX_CARGA (CDS)|ZC_FI_TAX_CARGA]] -> **`New Behavior Definition`**.
2. Preencha as propriedades:
   - **Implementation Type:** `Projection`
3. Selecione a Request (TR) de desenvolvimento e conclua o assistente.
4. Substitua o código gerado pelo snippet abaixo e ative com **`Ctrl + F3`**.

---

## 💻 Snippet de Código

### 📝 Código Comentado (Para Estudo e Referência)

```abap
projection;
strict ( 2 );

define behavior for ZC_FI_TAX_CARGA alias Carga
use etag
{
  // Permite excluir lotes que ainda não tiveram nenhum documento contabilizado
  use delete;

  // Expõe as 3 ações de negócio do App 1 para o serviço OData V4
  use action carregarArquivo;
  use action baixarModelo;
  use action lancar;

  use association _Documentos;
}

define behavior for ZC_FI_TAX_DOC alias Documento
{
  use association _Carga;
  use association _Itens;
}

define behavior for ZC_FI_TAX_ITEM alias Item
{
  use association _Documento;
  use association _Carga;
}
```

---

### 🚀 Código Limpo (Sem Comentários - Para Copiar e Colar)

```abap
projection;
strict ( 2 );

define behavior for ZC_FI_TAX_CARGA alias Carga
use etag
{
  use delete;

  use action carregarArquivo;
  use action baixarModelo;
  use action lancar;

  use association _Documentos;
}

define behavior for ZC_FI_TAX_DOC alias Documento
{
  use association _Carga;
  use association _Itens;
}

define behavior for ZC_FI_TAX_ITEM alias Item
{
  use association _Documento;
  use association _Carga;
}
```
