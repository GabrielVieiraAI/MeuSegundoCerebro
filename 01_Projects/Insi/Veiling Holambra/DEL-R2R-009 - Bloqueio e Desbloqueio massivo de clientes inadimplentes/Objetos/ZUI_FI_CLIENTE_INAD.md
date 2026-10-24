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
objeto: ZUI_FI_CLIENTE_INAD
camada: 4 - Camada de Serviço e Exposição
data: 2026-10-23
---

# 🌐 `ZUI_FI_CLIENTE_INAD` (Service Definition)

⬅️ [[DEL-R2R-009 - Arquitetura e Objetos|Voltar para Arquitetura e Objetos]] | 🎨 [[DEL-R2R-009 - Arquitetura da Camada CDS.excalidraw|Ver no Diagrama Excalidraw]]

---

## 📌 Visão Geral do Objeto

O **Service Definition** `ZUI_FI_CLIENTE_INAD` define o escopo do serviço de negócio que será exposto para fora do backend ABAP.

Ele funciona como um "cardápio" que declara quais CDS Views de Projeção fazem parte deste aplicativo, sendo consumido em seguida pelo Service Binding (`[[ZUI_O2_FI_CLIENTE_INAD]]`).

---

## ⚖️ Regras de Negócio Aplicadas

1. **Exposição Enxuta (Sem Value Help de Motivo):** Como o motivo de bloqueio é fixo (`10`), o Service Definition precisa expor apenas a entidade principal `[[ZC_FI_CLIENTE_INADIMPLENTE (CDS)|ZC_FI_CLIENTE_INADIMPLENTE]]`.

---

## 💻 Snippet de Código

```abap
@EndUserText.label: 'DEL-R2R-009: Definição de Serviço de Clientes Inadimplentes'
define service ZUI_FI_CLIENTE_INAD {
  expose ZC_FI_CLIENTE_INADIMPLENTE as ClienteInadimplente;
}
```
