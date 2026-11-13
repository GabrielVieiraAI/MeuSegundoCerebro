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
objeto: "ZC_FI_TAX_TPMOV (BDEF)"
camada: "3 - Comportamento RAP"
data: 2026-11-11
aliases:
  - "ZC_FI_TAX_TPMOV (BDEF)"
---

# 📦 `ZC_FI_TAX_TPMOV (BDEF)` (Behavior Definition Projection — Tipos de Movimento)

⬅️ [[02 - DEL-COM-165 - Arquitetura App 2 (Tipos de Movimento)|Voltar para Arquitetura App 2]] | 🎨 [[02 - DEL-COM-165 - Arquitetura Técnica App 2 (Tipos de Movimento).excalidraw|Ver no Diagrama Excalidraw App 2]]

---

## 📌 Visão Geral do Objeto

O Behavior Definition de Projeção `ZC_FI_TAX_TPMOV` expõe as operações transacionais (`create`, `update`, `delete`) e as ações de gerenciamento de *Draft* definidas em [[12 - ZI_FI_TAX_TPMOV (BDEF)|ZI_FI_TAX_TPMOV]] para consumo pelo serviço OData V4 do **Aplicativo 2**.

---

## ⚖️ Regras de Negócio Aplicadas

1. **Exposição de CRUD + Draft:** Habilita na interface Fiori Elements os botões standard **Criar**, **Editar**, **Excluir**, **Salvar** e **Cancelar**.

---

## 🛠️ Passo a Passo da Criação do Objeto

1. **No Eclipse ADT:** Clique com o botão direito sobre a CDS View [[14 - ZC_FI_TAX_TPMOV (CDS)|ZC_FI_TAX_TPMOV]] -> **`New Behavior Definition`**.
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
use draft;

define behavior for ZC_FI_TAX_TPMOV alias TipoMovimento
use etag
{
  // Expõe as operações standard de manutenção da tabela para o Fiori Elements
  use create;
  use update;
  use delete;

  // Expõe as ações de controle de rascunho (Draft)
  use action Edit;
  use action Activate;
  use action Discard;
  use action Resume;
  use action Prepare;
}
```

---

### 🚀 Código Limpo (Sem Comentários - Para Copiar e Colar)

```abap
projection;
strict ( 2 );
use draft;

define behavior for ZC_FI_TAX_TPMOV alias TipoMovimento
use etag
{
  use create;
  use update;
  use delete;

  use action Edit;
  use action Activate;
  use action Discard;
  use action Resume;
  use action Prepare;
}
```
