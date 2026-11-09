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

aliases:
  - "ZUI_FI_CLIENTE_INAD"
---

# 🌐 `ZUI_FI_CLIENTE_INAD` (Service Definition)

⬅️ [[DEL-R2R-009 - Arquitetura e Objetos|Voltar para Arquitetura e Objetos]] | 🎨 [[01 - DEL-R2R-009 - Arquitetura da Camada CDS.excalidraw|Ver no Diagrama Excalidraw]]

---

## 📌 Visão Geral do Objeto

O **Service Definition** `ZUI_FI_CLIENTE_INAD` define o escopo do serviço de negócio que será exposto para fora do backend ABAP.

Ele funciona como um "cardápio" que declara quais CDS Views de Projeção fazem parte deste aplicativo, sendo consumido em seguida pelo Service Binding (`[[13 - ZUI_O2_FI_CLIENTE_INAD|ZUI_O2_FI_CLIENTE_INAD]]`).

---

## ⚖️ Regras de Negócio Aplicadas

1. **Exposição Enxuta (Sem Value Help de Motivo):** Como o motivo de bloqueio é fixo (`10`), o Service Definition precisa expor apenas a entidade principal `[[09 - ZC_FI_CLIENTE_INADIMPLENTE (CDS)|ZC_FI_CLIENTE_INADIMPLENTE]]`.

---

## 🛠️ Passo a Passo da Criação do Objeto

1. **No Eclipse ADT:** Clique com o botão direito sobre a CDS View de Projeção `ZC_FI_CLIENTE_INADIMPLENTE` (ou sobre o pacote `ZFI_BLOQ_INADIMPLENTES` na pasta `Business Services` -> `Service Definitions`) -> **`New Service Definition`**.
2. No assistente de criação:
   - **Name:** `ZUI_FI_CLIENTE_INAD`
   - **Description:** `DEL-R2R-009: Serviço Clientes Inadimp.`
3. Clique em **Next**, selecione a Ordem de Transporte (TR) do projeto e clique em **Finish**.
4. Substitua o código gerado pelo conteúdo da seção [Snippet de Código](file:///c:/Users/gabriel.vsouza/source/MeuSegundoCerebro/01_Projects/Insi/Veiling%20Holambra/DEL-R2R-009%20-%20Bloqueio%20e%20Desbloqueio%20massivo%20de%20clientes%20inadimplentes/Objetos/ZUI_FI_CLIENTE_INAD.md#L45-L55) abaixo.
   *(Nota técnica: A instrução `expose ZC_FI_CLIENTE_INADIMPLENTE as ClienteInadimplente;` publica a entidade no escopo do serviço, atribuindo o alias `ClienteInadimplente` que será o nome da coleção no OData).*
5. Ative o objeto pressionando **`Ctrl + F3`**.

---

## 💻 Snippet de Código

### 📝 Código Comentado (Para Estudo e Referência)
```abap
@EndUserText.label: 'DEL-R2R-009: Serviço Clientes Inadimp.'
define service ZUI_FI_CLIENTE_INAD {                                   // Declara o escopo do serviço de negócio exposto para fora do backend
  expose ZC_FI_CLIENTE_INADIMPLENTE as ClienteInadimplente;            // Expõe a CDS de projeção com alias amigável consumido pelo Fiori
}
```

---

### 🚀 Código Limpo (Sem Comentários - Para Copiar e Colar)

```abap
@EndUserText.label: 'DEL-R2R-009: Serviço Clientes Inadimp.'
define service ZUI_FI_CLIENTE_INAD {
  expose ZC_FI_CLIENTE_INADIMPLENTE as ClienteInadimplente;
}
```
