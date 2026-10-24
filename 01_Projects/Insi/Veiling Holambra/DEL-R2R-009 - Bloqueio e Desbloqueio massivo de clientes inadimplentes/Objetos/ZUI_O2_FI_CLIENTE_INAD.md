---
tags:
  - projeto
  - insi
  - veiling-holambra
  - sap
  - rap
  - odata
  - abap-cloud
  - del-r2r-009
  - objeto-tecnico
id_demanda: DEL-R2R-009
objeto: ZUI_O2_FI_CLIENTE_INAD
camada: 4 - Camada de Serviço e Exposição
data: 2026-10-23
---

# 🔗 `ZUI_O2_FI_CLIENTE_INAD` (Service Binding - OData V2 UI)

⬅️ [[DEL-R2R-009 - Arquitetura e Objetos|Voltar para Arquitetura e Objetos]] | 🎨 [[DEL-R2R-009 - Arquitetura da Camada CDS.excalidraw|Ver no Diagrama Excalidraw]]

---

## 📌 Visão Geral do Objeto

O **Service Binding** `ZUI_O2_FI_CLIENTE_INAD` vincula o Service Definition (`[[ZUI_FI_CLIENTE_INAD]]`) ao protocolo de comunicação **OData V2 - UI** (seguindo o padrão de nomenclatura `ZUI_O2_[MD]_<desc>`).

É este objeto que publica o endpoint HTTP/REST no SAP Gateway (`/sap/opu/odata/sap/ZUI_O2_FI_CLIENTE_INAD/`) utilizado pelo aplicativo **SAP Fiori Elements** (`[[bloqinadimplente (App Fiori)|bloqinadimplente]]`) e também permite testar a tela diretamente pelo botão **Preview (Fiori Elements App Preview)** dentro do Eclipse ADT antes mesmo de gerar o aplicativo no BAS (*Business Application Studio*).

---

## ⚖️ Regras de Negócio Aplicadas

1. **Protocolo OData V2 (UI):** Segue o padrão corporativo OData V2 para aplicações Fiori Elements (*List Report*), garantindo suporte a seleção múltipla em lote (`multiSelect: true`), execução de ações do RAP via Function Imports gerados automaticamente e exibição consolidada das mensagens de retorno no componente **Message View** do Fiori Elements.

---

## 💻 Snippet de Código

> *Nota: O Service Binding é um objeto criado via assistente visual no Eclipse ADT (New -> Service Binding), não possuindo código-fonte textual editável. Abaixo estão os parâmetros exatos de configuração do objeto:*

```yaml
Nome do Objeto: ZUI_O2_FI_CLIENTE_INAD
Descrição: "DEL-R2R-009: Service Binding OData V2 - Clientes Inadimplentes"
Service Definition: ZUI_FI_CLIENTE_INAD
Binding Type: OData V2 - UI
Entidade Principal: ClienteInadimplente (ZC_FI_CLIENTE_INADIMPLENTE)
Status de Publicação: Local Service Endpoint Published
```
