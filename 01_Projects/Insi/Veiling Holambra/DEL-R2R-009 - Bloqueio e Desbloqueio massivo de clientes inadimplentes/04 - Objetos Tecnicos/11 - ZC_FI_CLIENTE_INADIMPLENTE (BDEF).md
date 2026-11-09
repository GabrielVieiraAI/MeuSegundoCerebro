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

aliases:
  - "ZC_FI_CLIENTE_INADIMPLENTE (BDEF)"
---

# 🔌 `ZC_FI_CLIENTE_INADIMPLENTE` (Behavior Definition Projection - BDEF)

⬅️ [[DEL-R2R-009 - Arquitetura e Objetos|Voltar para Arquitetura e Objetos]] | 🎨 [[01 - DEL-R2R-009 - Arquitetura da Camada CDS.excalidraw|Ver no Diagrama Excalidraw]]

---

## 📌 Visão Geral do Objeto

O **Behavior Definition (BDEF) Projection** `ZC_FI_CLIENTE_INADIMPLENTE` faz par com a CDS de Projeção (`[[09 - ZC_FI_CLIENTE_INADIMPLENTE (CDS)|ZC_FI_CLIENTE_INADIMPLENTE]]`).

No modelo RAP, nenhuma ação definida no BDEF Raiz (`[[07 - ZI_FI_CLIENTE_INADIMPLENTE (BDEF)|ZI_FI_CLIENTE_INADIMPLENTE (BDEF)]]`) fica visível para o aplicativo Fiori a menos que seja explicitamente projetada (`use action`) neste objeto.

---

## ⚖️ Regras de Negócio Aplicadas

1. **Exposição das Ações em Massa para a UI:** Habilita as ações `bloquearCliente` e `desbloquearCliente` no serviço OData V2 (`[[13 - ZUI_O2_FI_CLIENTE_INAD|ZUI_O2_FI_CLIENTE_INAD]]`), permitindo que os botões configurados na Metadata Extension (`[[10 - ZC_FI_CLIENTE_INADIMPLENTE (MDE)|ZC_FI_CLIENTE_INADIMPLENTE (MDE)]]`) fiquem ativos na tela do Fiori Elements.

---

## 🛠️ Passo a Passo da Criação do Objeto

1. **No Eclipse ADT:** Clique com o botão direito sobre a CDS View de Projeção `ZC_FI_CLIENTE_INADIMPLENTE` -> **`New Behavior Definition`**.
2. No assistente de criação:
   - **Root Entity:** `ZC_FI_CLIENTE_INADIMPLENTE` *(preenchido automaticamente)*.
   - **Description:** `DEL-R2R-009: Behavior Projeção Inadimplentes`
   - O ADT detecta que a CDS é uma projeção e sugere o tipo **Projection**.
3. Clique em **Next**, selecione a Ordem de Transporte (TR) do projeto e clique em **Finish**.
4. Substitua o código gerado pelo conteúdo da seção [Snippet de Código](file:///c:/Users/gabriel.vsouza/source/MeuSegundoCerebro/01_Projects/Insi/Veiling%20Holambra/DEL-R2R-009%20-%20Bloqueio%20e%20Desbloqueio%20massivo%20de%20clientes%20inadimplentes/Objetos/ZC_FI_CLIENTE_INADIMPLENTE%20(BDEF).md#L45-L65) abaixo.
   *(Nota técnica: A palavra-chave `projection;` informa que este artefato projeta comportamentos do BDEF base. Os comandos `use action bloquearCliente;` e `use action desbloquearCliente;` conectam os botões da tela Fiori diretamente aos métodos implementados no Behavior Pool).*
5. Ative o objeto com **`Ctrl + F3`**.

---

## 💻 Snippet de Código

### 📝 Código Comentado (Para Estudo e Referência)
```abap
projection;                                                           // Define que este Behavior Definition é uma projeção de consumo
strict ( 2 );                                                          // Validação estrita de sintaxe do framework RAP versão 2

define behavior for ZC_FI_CLIENTE_INADIMPLENTE alias ClienteInadimplente // Projeção de comportamento para a tela Fiori Elements
{
  use action bloquearCliente;                                          // Habilita o botão 'Bloquear' na tela do Fiori Elements
  use action desbloquearCliente;                                        // Habilita o botão 'Desbloquear' na tela do Fiori Elements
}
```

---

### 🚀 Código Limpo (Sem Comentários - Para Copiar e Colar)

```abap
projection;
strict ( 2 );

define behavior for ZC_FI_CLIENTE_INADIMPLENTE alias ClienteInadimplente
{
  use action bloquearCliente;
  use action desbloquearCliente;
}
```
