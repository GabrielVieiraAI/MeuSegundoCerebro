---
tags:
  - projeto
  - insi
  - veiling-holambra
  - sap
  - fiori
  - cds
  - mde
  - abap-cloud
  - del-r2r-009
  - objeto-tecnico
id_demanda: DEL-R2R-009
objeto: ZC_FI_CLIENTE_INADIMPLENTE (MDE)
camada: 2 - Modelagem de Dados (CDS Views)
data: 2026-10-23

aliases:
  - "ZC_FI_CLIENTE_INADIMPLENTE (MDE)"
---

# 🎨 `ZC_FI_CLIENTE_INADIMPLENTE` (Metadata Extension - MDE)

⬅️ [[DEL-R2R-009 - Arquitetura e Objetos|Voltar para Arquitetura e Objetos]] | 🎨 [[01 - DEL-R2R-009 - Arquitetura da Camada CDS.excalidraw|Ver no Diagrama Excalidraw]]

---

## 📌 Visão Geral do Objeto

A **Metadata Extension (MDE)** `ZC_FI_CLIENTE_INADIMPLENTE` é um artefato separado de código que guarda exclusivamente as **anotações de interface de usuário (`@UI.*`)** da CDS de projeção `[[09 - ZC_FI_CLIENTE_INADIMPLENTE (CDS)|ZC_FI_CLIENTE_INADIMPLENTE]]`.

É ela quem "desenha" automaticamente a tela do **SAP Fiori Elements (List Report)** sem precisarmos programar telas manualmente em JavaScript/UI5: define quais campos viram filtros no topo da tela (`@UI.selectionField`), quais colunas aparecem na tabela (`@UI.lineItem`), qual é a ordenação padrão da lista (`@UI.presentationVariant`) e onde ficam os botões de ação em massa (**Bloquear** e **Desbloquear**).

---

## ⚖️ Regras de Negócio Aplicadas

1. **Ordenação Automática pela Ação Proposta (`Bloquear` Primeiro):** Através da anotação `@UI.presentationVariant.sortOrder`, a lista já abre ordenada pelo campo `OrdemProposta` crescente (mostrando todos os clientes com proposta **Bloquear** no topo, seguidos de **Desbloquear**).
2. **Filtros Obrigatórios na Barra Superior (`@UI.selectionField`):**
   - `AcaoProposta` (permite filtrar rapidamente quem tem sugestão de Bloquear ou Desbloquear);
   - `GroupFeature` (permite filtrar se o cliente é **Autosserviço** ou não, conforme exigido pela consultora);
   - `RiskClass` (permite filtrar por perfil `1A` ou `2A`);
   - `PartnerMatriz` (filtro por cliente específico).
3. **Botões de Ação em Massa na Barra da Tabela:** Expõe os botões **Bloquear** (`bloquearCliente`) e **Desbloquear** (`desbloquearCliente`) vinculados ao Behavior Definition (`[[11 - ZC_FI_CLIENTE_INADIMPLENTE (BDEF)|ZC_FI_CLIENTE_INADIMPLENTE (BDEF)]]`).

---

## 🛠️ Passo a Passo da Criação do Objeto

1. **No Eclipse ADT:** Clique com o botão direito sobre a CDS View de Projeção `ZC_FI_CLIENTE_INADIMPLENTE` (ou sobre o pacote `ZFI_BLOQ_INADIMPLENTES` na pasta `Core Data Services` -> `Metadata Extensions`) -> **`New`** -> **`Metadata Extension`**.
2. Preencha os campos do assistente:
   - **Name:** `ZC_FI_CLIENTE_INADIMPLENTE` *(por convenção SAP, utiliza-se exatamente o mesmo nome da CDS que ela estende)*.
   - **Description:** `DEL-R2R-009: Metadados UI Inadimplentes`
   - **Extended Entity:** Certifique-se de que está preenchido com `ZC_FI_CLIENTE_INADIMPLENTE`.
3. Clique em **Next**, selecione a Ordem de Transporte (TR) do projeto e clique em **Next** para a tela de templates.
4. Escolha o template **`annotate entity`** (ou `annotate view`) e clique em **Finish**.
5. Substitua o conteúdo pelo código exibido na seção [Snippet de Código](file:///c:/Users/gabriel.vsouza/source/MeuSegundoCerebro/01_Projects/Insi/Veiling%20Holambra/DEL-R2R-009%20-%20Bloqueio%20e%20Desbloqueio%20massivo%20de%20clientes%20inadimplentes/Objetos/ZC_FI_CLIENTE_INADIMPLENTE%20(MDE).md#L60-L125) abaixo.
6. Ative o objeto com **`Ctrl + F3`**.
   *(Importante: Assegure-se de que a CDS `ZC_FI_CLIENTE_INADIMPLENTE` possua a anotação `@Metadata.allowExtensions: true` para que os metadados visuais de filtros e botões sejam devidamente reconhecidos no Fiori).*

---

## 💻 Snippet de Código

### 📝 Código Comentado (Para Estudo e Referência)
```abap
@Metadata.layer: #CORE
@UI: {
  headerInfo: {
    typeName: 'Cliente',
    typeNamePlural: 'Clientes',
    title: { type: #STANDARD, value: 'NomeCliente' },
    description: { type: #STANDARD, value: 'PartnerMatriz' }
  },
  presentationVariant: [{
    sortOrder: [
      { by: 'OrdemProposta', direction: #ASC },
      { by: 'ValorTotalVencido', direction: #DESC }
    ],
    visualizations: [{ type: #AS_LINEITEM }]
  }]
}
annotate entity ZC_FI_CLIENTE_INADIMPLENTE with                      // Estende a CDS de projeção com o layout visual do Fiori Elements
{
  @UI.lineItem: [
    { position: 10, importance: #HIGH },
    { type: #FOR_ACTION, dataAction: 'bloquearCliente',    label: 'Bloquear' },
    { type: #FOR_ACTION, dataAction: 'desbloquearCliente', label: 'Desbloquear' }
  ]
  @UI.selectionField: [{ position: 10 }]
  AcaoProposta;                                                        // Coluna 10: Sugestão da régua com os botões de ação e filtro de tela

  @UI.lineItem: [{ position: 20, importance: #HIGH }]
  @UI.selectionField: [{ position: 20 }]
  PartnerMatriz;                                                       // Coluna 20: Código do cliente Matriz com campo de filtro na tela

  @UI.lineItem: [{ position: 30, importance: #HIGH }]
  NomeCliente;                                                         // Coluna 30: Razão social / Nome do cliente

  @UI.lineItem: [{ position: 40, importance: #MEDIUM }]
  PartnerOrigem;                                                       // Coluna 40: BP de Origem (filial que originou a dívida)

  @UI.lineItem: [{ position: 50, importance: #HIGH }]
  @UI.selectionField: [{ position: 30 }]
  GroupFeature;                                                        // Coluna 50: Segmento de atuação (Autosserviço) com filtro de tela

  @UI.lineItem: [{ position: 60, importance: #HIGH }]
  @UI.selectionField: [{ position: 40 }]
  RiskClass;                                                           // Coluna 60: Classe de risco do cliente com filtro de tela

  @UI.lineItem: [{ position: 70, importance: #HIGH }]
  ValorTotalVencido;                                                   // Coluna 70: Montante financeiro total vencido

  @UI.lineItem: [{ position: 80, importance: #MEDIUM }]
  DiasAtraso;                                                          // Coluna 80: Maior quantidade de dias em atraso

  @UI.lineItem: [{ position: 90, importance: #HIGH }]
  IsBlocked;                                                           // Coluna 90: Status atual de bloqueio de crédito (Sim/Não)

  @UI.lineItem: [{ position: 100, importance: #MEDIUM }]
  BlockReason;                                                         // Coluna 100: Motivo do bloqueio registrado no FSCM

  @UI.hidden: true
  OrdemProposta;                                                       // Campo técnico oculto na tabela (utilizado no sortOrder inicial)
}
```

---

### 🚀 Código Limpo (Sem Comentários - Para Copiar e Colar)

```abap
@Metadata.layer: #CORE
@UI: {
  headerInfo: {
    typeName: 'Cliente',
    typeNamePlural: 'Clientes',
    title: { type: #STANDARD, value: 'NomeCliente' },
    description: { type: #STANDARD, value: 'PartnerMatriz' }
  },
  presentationVariant: [{
    sortOrder: [
      { by: 'OrdemProposta', direction: #ASC },
      { by: 'ValorTotalVencido', direction: #DESC }
    ],
    visualizations: [{ type: #AS_LINEITEM }]
  }]
}
annotate entity ZC_FI_CLIENTE_INADIMPLENTE with
{
  @UI.lineItem: [
    { position: 10, importance: #HIGH },
    { type: #FOR_ACTION, dataAction: 'bloquearCliente',    label: 'Bloquear' },
    { type: #FOR_ACTION, dataAction: 'desbloquearCliente', label: 'Desbloquear' }
  ]
  @UI.selectionField: [{ position: 10 }]
  AcaoProposta;

  @UI.lineItem: [{ position: 20, importance: #HIGH }]
  @UI.selectionField: [{ position: 20 }]
  PartnerMatriz;

  @UI.lineItem: [{ position: 30, importance: #HIGH }]
  NomeCliente;

  @UI.lineItem: [{ position: 40, importance: #MEDIUM }]
  PartnerOrigem;

  @UI.lineItem: [{ position: 50, importance: #HIGH }]
  @UI.selectionField: [{ position: 30 }]
  GroupFeature;

  @UI.lineItem: [{ position: 60, importance: #HIGH }]
  @UI.selectionField: [{ position: 40 }]
  RiskClass;

  @UI.lineItem: [{ position: 70, importance: #HIGH }]
  ValorTotalVencido;

  @UI.lineItem: [{ position: 80, importance: #MEDIUM }]
  DiasAtraso;

  @UI.lineItem: [{ position: 90, importance: #HIGH }]
  IsBlocked;

  @UI.lineItem: [{ position: 100, importance: #MEDIUM }]
  BlockReason;

  @UI.hidden: true
  OrdemProposta;
}
```
