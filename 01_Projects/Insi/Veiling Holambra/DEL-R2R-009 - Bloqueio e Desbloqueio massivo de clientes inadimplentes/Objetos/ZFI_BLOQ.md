---
tags:
  - projeto
  - insi
  - veiling-holambra
  - sap
  - seguranca
  - su21
  - del-r2r-009
  - objeto-tecnico
id_demanda: DEL-R2R-009
objeto: ZFI_BLOQ
camada: 5 - Camada de Segurança e Mensagens
data: 2026-10-23
---

# 🔐 `ZFI_BLOQ` (Objeto de Autorização - SU21)

⬅️ [[DEL-R2R-009 - Arquitetura e Objetos|Voltar para Arquitetura e Objetos]] | 🎨 [[DEL-R2R-009 - Arquitetura da Camada CDS.excalidraw|Ver no Diagrama Excalidraw]]

---

## 📌 Visão Geral do Objeto

O **`ZFI_BLOQ`** é o **Objeto de Autorização** (transação `SU21` / Authorization Object no Eclipse ADT) responsável por garantir a segurança de acesso ao aplicativo de gestão de inadimplência.

Ele é verificado tanto na leitura dos dados quanto na execução dos botões **Bloquear** e **Desbloquear** dentro da classe `[[ZCLFI_BP_CLIENTE_INAD]]`.

---

## ⚖️ Regras de Negócio Aplicadas

1. **Controle por Empresa, Segmento de Crédito e Atividade:**
   - `BUKRS` (Empresa): ex. `CVH1`;
   - `CREDIT_SGMNT` (Segmento de Crédito): ex. `1000`;
   - `ACTVT` (Atividade):
     - `03` = Exibir lista de clientes;
     - `05` = Bloquear cliente (`bloquearCliente`);
     - `43` = Liberar / Desbloquear cliente (`desbloquearCliente`).
2. **Perfis de Negócio:** Atribuído à Role PFCG dedicada ao app, destinada aos operadores de Contas a Receber e Gestão de Crédito (`SAP_BR_AR_MANAGER` e `SAP_BR_CREDIT_CONTROLLER`).

---

## 💻 Snippet de Código

```abap
" Exemplo de verificação do objeto ZFI_BLOQ dentro de ZCLFI_BP_CLIENTE_INAD:
AUTHORITY-CHECK OBJECT 'ZFI_BLOQ'
  ID 'BUKRS'        FIELD 'CVH1'
  ID 'CREDIT_SGMNT' FIELD '1000'
  ID 'ACTVT'        FIELD '05'. " 05 = Bloquear | 43 = Desbloquear | 03 = Exibir

IF sy-subrc <> 0.
  " Adiciona mensagem 004/005 da classe ZFI_INADIMPLENCIA na estrutura reported/failed
ENDIF.
```
