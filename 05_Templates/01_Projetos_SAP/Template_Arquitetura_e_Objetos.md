---
tags:
  - projeto
  - cliente # ex: veiling-holambra
  - sap
  - modulo-sap # ex: fi, sd, mm, co
  - rap
  - abap-cloud
  - id-demanda # ex: del-com-165
  - arquitetura
id_demanda: "[ID-DEMANDA]"
tipo: arquitetura-tecnica
data: {{date}}
aliases:
  - "[ID-DEMANDA] - Arquitetura e Objetos"
---

# [ID-DEMANDA] · Arquitetura Técnica e Lista de Objetos

📋 [[Consolidado de decisões tomadas em todas as reuniões|Decisões das Reuniões]] | 🚀 [[01 - [ID-DEMANDA] - Guia de Implementação|Guia de Implementação]] | 🧪 [[02 - [ID-DEMANDA] - Guia de Testes e Homologação|Guia de Testes e Homologação]]

---

## 📌 Visão Geral da Arquitetura

🎨 **Diagrama Visual:** [[01 - [ID-DEMANDA] - Arquitetura Técnica Completa.excalidraw|Visualizar no Excalidraw]]
![[01 - [ID-DEMANDA] - Arquitetura Técnica Completa.excalidraw]]

### Decisões Fundamentais de Arquitetura:
1. **[Decisão Técnica 1]:** [Descrição direta da escolha técnica].
2. **[Decisão Técnica 2]:** [Descrição direta da escolha técnica].
3. **[Decisão Técnica 3]:** [Descrição direta da escolha técnica].

---

## 🧱 Lista Consolidada de Objetos Técnicos

A nomenclatura segue estritamente o padrão de nomenclatura da empresa (ou o [[Padrão de Nomenclatura ABAP Geral]], caso a empresa não possua padrão específico).

### 1. Camada de Dicionário de Dados (ABAP Dictionary)

| Tipo de Objeto | Padrão | Nome do Objeto | Responsabilidade Técnica |
| :--- | :--- | :--- | :--- |
| **Tabela Transparente** | `ZT[MD]_<desc>` | [[01 - ZTXX_TABELA\|ZTXX_TABELA]] | [Responsabilidade direta da tabela e principais campos]. |

---

### 2. Camada de Modelagem de Dados (CDS Views)

| Tipo de Objeto | Padrão | Nome do Objeto | Responsabilidade Técnica |
| :--- | :--- | :--- | :--- |
| **CDS Interface (Basic/Composite)** | `ZI_[MD]_<desc>` | [[04 - ZI_XX_BASE\|ZI_XX_BASE]] | [Responsabilidade direta da CDS de base]. |
| **CDS Interface (Root)** | `ZI_[MD]_<desc>` | [[06 - ZI_XX_ROOT (CDS)\|ZI_XX_ROOT]] | [Responsabilidade direta da CDS raiz]. |
| **CDS Consumption (Projection)** | `ZC_[MD]_<desc>` | [[09 - ZC_XX_ROOT (CDS)\|ZC_XX_ROOT]] | [Responsabilidade direta da CDS de projeção]. |
| **Metadata Extension (MDE)** | Mesmo nome da CDS | [[10 - ZC_XX_ROOT (MDE)\|ZC_XX_ROOT]] | [Anotações de UI expostas para o Fiori Elements]. |

---

### 3. Camada de Comportamento de Negócio (RAP / Classes ABAP)

| Tipo de Objeto | Padrão | Nome do Objeto | Responsabilidade Técnica |
| :--- | :--- | :--- | :--- |
| **Behavior Definition (Interface)** | Mesmo nome da CDS | [[07 - ZI_XX_ROOT (BDEF)\|ZI_XX_ROOT]] | [Operações, validações e ações definidas na entidade raiz]. |
| **Behavior Definition (Projection)** | Mesmo nome da CDS | [[11 - ZC_XX_ROOT (BDEF)\|ZC_XX_ROOT]] | [Exposição das ações e operações para o consumo OData]. |
| **Classe ABAP (Behavior Pool / Motor)** | `ZCL[MD]_<desc>` | [[08 - ZCLXX_CLASSE\|ZCLXX_CLASSE]] | [Implementação das ações, validações e chamadas de APIs/BAPIs]. |

---

### 4. Camada de Segurança e Mensagens

| Tipo de Objeto | Padrão | Nome do Objeto | Responsabilidade Técnica |
| :--- | :--- | :--- | :--- |
| **Objeto de Autorização (SU21)** | `Z[MD]_<desc>` | [[02 - ZXX_AUTH\|ZXX_AUTH]] | [Controle de permissão por empresa/atividade]. |
| **Classe de Mensagens (SE91)** | `Z[MD]_<desc>` | [[03 - ZXX_MSG\|ZXX_MSG]] | [Mensagens estruturadas de validação, erro e sucesso]. |

---

### 5. Camada de Serviço e Exposição

| Tipo de Objeto | Padrão | Nome do Objeto | Responsabilidade Técnica |
| :--- | :--- | :--- | :--- |
| **Service Definition** | `ZUI_[MD]_<desc>` | [[12 - ZUI_XX_SERVICO\|ZUI_XX_SERVICO]] | [Expõe as entidades de projeção do serviço]. |
| **Service Binding** | `ZUI_O2_[MD]_<desc>` | [[13 - ZUI_O2_XX_SERVICO\|ZUI_O2_XX_SERVICO]] | [Publica o protocolo OData para consumo do aplicativo Fiori]. |

---

### 6. Camada Frontend (SAP Fiori & Launchpad)

| Tipo de Objeto | Padrão | Nome do Objeto | Responsabilidade Técnica |
| :--- | :--- | :--- | :--- |
| **Aplicativo SAP Fiori** | `<desc>` | [[14 - nome_app (App Fiori)\|nome_app]] | [Aplicativo Fiori, BSP e catálogos técnicos/negócio]. |
