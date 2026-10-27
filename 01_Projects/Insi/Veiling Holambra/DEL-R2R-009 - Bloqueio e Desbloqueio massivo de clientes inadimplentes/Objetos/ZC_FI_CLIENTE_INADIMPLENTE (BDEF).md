---
tags:
  - projeto
  - insi
  - veiling-holambra
  - sap
  - rap
  - bdef
  - abap-cloud
  - del-r2r-009
  - objeto-tecnico
id_demanda: DEL-R2R-009
objeto: ZC_FI_CLIENTE_INADIMPLENTE (BDEF)
camada: 3 - Comportamento de Negócio (RAP)
data: 2026-10-23
---

# 🔌 `ZC_FI_CLIENTE_INADIMPLENTE` (Behavior Definition Projection - BDEF)

⬅️ [[DEL-R2R-009 - Arquitetura e Objetos|Voltar para Arquitetura e Objetos]] | 🎨 [[DEL-R2R-009 - Arquitetura da Camada CDS.excalidraw|Ver no Diagrama Excalidraw]]

---

## 📌 Visão Geral do Objeto

O **Behavior Definition (BDEF) Projection** `ZC_FI_CLIENTE_INADIMPLENTE` faz par com a CDS de Projeção (`[[ZC_FI_CLIENTE_INADIMPLENTE (CDS)|ZC_FI_CLIENTE_INADIMPLENTE]]`).

No modelo RAP, nenhuma ação definida no BDEF Raiz (`[[ZI_FI_CLIENTE_INADIMPLENTE (BDEF)]]`) fica visível para o aplicativo Fiori a menos que seja explicitamente projetada (`use action`) neste objeto.

---

## ⚖️ Regras de Negócio Aplicadas

1. **Exposição das Ações em Massa para a UI:** Habilita as ações `bloquearCliente` e `desbloquearCliente` no serviço OData V2 (`[[ZUI_O2_FI_CLIENTE_INAD]]`), permitindo que os botões configurados na Metadata Extension (`[[ZC_FI_CLIENTE_INADIMPLENTE (MDE)]]`) fiquem ativos na tela do Fiori Elements.

---

## 💻 Snippet de Código

```abap
projection;                                                           // Define que este Behavior Definition é uma projeção de consumo
strict ( 2 );                                                          // Validação estrita de sintaxe do framework RAP versão 2

define behavior for ZC_FI_CLIENTE_INADIMPLENTE alias ClienteInadimplente // Projeção de comportamento para a tela Fiori Elements
{
  use action bloquearCliente;                                          // Habilita o botão 'Bloquear' na tela do Fiori Elements
  use action desbloquearCliente;                                        // Habilita o botão 'Desbloquear' na tela do Fiori Elements
}
```
