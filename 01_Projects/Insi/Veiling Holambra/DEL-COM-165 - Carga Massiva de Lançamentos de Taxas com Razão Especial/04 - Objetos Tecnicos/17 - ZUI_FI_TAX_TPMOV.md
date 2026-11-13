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
objeto: "ZUI_FI_TAX_TPMOV"
camada: "5 - Serviço e Exposição"
data: 2026-11-11
aliases:
  - "ZUI_FI_TAX_TPMOV"
---

# 📦 `ZUI_FI_TAX_TPMOV` (Service Definition — Tipos de Movimento)

⬅️ [[02 - DEL-COM-165 - Arquitetura App 2 (Tipos de Movimento)|Voltar para Arquitetura App 2]] | 🎨 [[02 - DEL-COM-165 - Arquitetura Técnica App 2 (Tipos de Movimento).excalidraw|Ver no Diagrama Excalidraw App 2]]

---

## 📌 Visão Geral do Objeto

A Service Definition `ZUI_FI_TAX_TPMOV` declara o escopo de entidades expostas para o serviço OData do **Aplicativo 2** (Manutenção de Tipos de Movimento), publicando a entidade de projeção [[14 - ZC_FI_TAX_TPMOV (CDS)|ZC_FI_TAX_TPMOV]] com o alias `TipoMovimento`.

---

## ⚖️ Regras de Negócio Aplicadas

1. **Isolamento de Serviço do App 2:** Permite publicar e autorizar o serviço de configuração de Tipos de Movimento separadamente do serviço de carga massiva (App 1).

---

## 🛠️ Passo a Passo da Criação do Objeto

1. **No Eclipse ADT:** Clique com o botão direito sobre [[14 - ZC_FI_TAX_TPMOV (CDS)|ZC_FI_TAX_TPMOV]] -> **`New Service Definition`**.
2. Preencha as propriedades:
   - **Name:** `ZUI_FI_TAX_TPMOV`
   - **Description:** `DEL-COM-165: Service Definition Tipos de Movimento`
3. Selecione a Request (TR) de desenvolvimento e conclua o assistente.
4. Substitua o código gerado pelo snippet abaixo e ative com **`Ctrl + F3`**.

---

## 💻 Snippet de Código

### 📝 Código Comentado (Para Estudo e Referência)

```abap
@EndUserText.label: 'DEL-COM-165: Serviço Tipos de Movimento'
define service ZUI_FI_TAX_TPMOV {
  // Expõe a entidade de projeção de Tipos de Movimento para o App 2
  expose ZC_FI_TAX_TPMOV as TipoMovimento;
}
```

---

### 🚀 Código Limpo (Sem Comentários - Para Copiar e Colar)

```abap
@EndUserText.label: 'DEL-COM-165: Serviço Tipos de Movimento'
define service ZUI_FI_TAX_TPMOV {
  expose ZC_FI_TAX_TPMOV as TipoMovimento;
}
```
