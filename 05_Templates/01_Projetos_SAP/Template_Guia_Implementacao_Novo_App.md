---
tipo: guia-implementacao
tipo_demanda: novo-app # [novo-app, evolutiva-custom, extensao-standard, interface-api]
tags:
  - projeto
  - [cliente] # ex: veiling-holambra, cliente-xyz
  - sap
  - [modulo-sap] # ex: fi-ar, sd, mm, co, abap
  - [tecnologia] # ex: rap, cds, odata, fiori, abap-cloud
  - [id-demanda] # ex: del-r2r-009, prj-sd-010
  - guia-implementacao
id_demanda: "[ID-DEMANDA]"
data: {{date}}
---

# 🚀 [ID-DEMANDA] · Guia Passo a Passo de Implementação (Ordem de Criação)

⬅️ [[DEL-XXX - Arquitetura e Objetos|Arquitetura e Objetos]] | 🎨 [[DEL-XXX - Fluxo de Implementação.excalidraw|Fluxo de Implementação (Excalidraw)]] | 🎨 [[DEL-XXX - Arquitetura da Camada CDS.excalidraw|Diagrama de Arquitetura (Excalidraw)]] | 📋 [[Consolidado de decisões tomadas em todas as reuniões|Decisões Consolidadas]]

---

🎨 **Diagrama Visual do Fluxo (Passos de Implementação):**
[[DEL-XXX - Fluxo de Implementação.excalidraw| Abrir fluxo no Excalidraw]]
![[DEL-XXX - Fluxo de Implementação.excalidraw| Abrir fluxo no Excalidraw]]

---

## 🛠️ Detalhamento Passo a Passo por Fase

> [!NOTE] Guia de Execução
> Esta checklist representa a **ordem cronológica exata de dependências técnicas** da demanda. Cada passo aponta diretamente para a nota individual do objeto, onde constam o passo a passo prático de criação (no Eclipse ADT, SAP GUI ou VS Code) e os snippets de código completos.

### Fase 1: Fundação, Segurança e Dicionário de Dados
> **Objetivo:** Criar todos os objetos de suporte independentes que serão consumidos pelo código ABAP e CDS mais adiante (Tabelas transparentes de auditoria/log, classes de mensagem SE91 e objetos de autorização SU21).

- [ ] Passo 1 — Criar a tabela de auditoria/log [[ZTXX_LOG_DEMANDA]]
- [ ] Passo 2 — Criar a classe de mensagens [[ZXX_MENSAGENS]]
- [ ] Passo 3 — Criar o objeto de autorização [[ZXX_AUTH_OBJ]]

---

### Fase 2: Camada de Modelagem de Dados — CDS Views de Base
> **Objetivo:** Construir e validar separadamente as extrações contábeis/financeiras e cadastrais através de CDS View Entities básicas (`Define View Entity`).

- [ ] Passo 4 — Criar a CDS de agregação/dados base [[ZI_XX_DADOS_BASE_1]]
- [ ] Passo 5 — Criar a CDS de suporte/hierarquia [[ZI_XX_DADOS_BASE_2]]

---

### Fase 3: Camada de Modelagem de Dados — CDS Raiz, Projeção e MDE
> **Objetivo:** Unificar as regras de negócio na entidade raiz do RAP (`Define Root View Entity`), definir a visão de consumo (`as projection on`) e isolar os metadados de UI na Metadata Extension (`annotate entity`).

- [ ] Passo 6 — Criar a CDS Raiz [[ZI_XX_ENTIDADE_ROOT (CDS)|ZI_XX_ENTIDADE_ROOT]]
- [ ] Passo 7 — Criar a CDS de Projeção [[ZC_XX_ENTIDADE_ROOT (CDS)|ZC_XX_ENTIDADE_ROOT]]
- [ ] Passo 8 — Criar a Metadata Extension [[ZC_XX_ENTIDADE_ROOT (MDE)|ZC_XX_ENTIDADE_ROOT (MDE)]]

---

### Fase 4: Camada de Comportamento de Negócio (RAP - BDEF e ABAP)
> **Objetivo:** Declarar o contrato transacional no Behavior Definition (`managed` ou `unmanaged`) e implementar a lógica das ações customizadas e checagem de autorizações na classe Behavior Pool (`Local Types`).

- [ ] Passo 9 — Criar o BDEF Raiz [[ZI_XX_ENTIDADE_ROOT (BDEF)|ZI_XX_ENTIDADE_ROOT (BDEF)]]
- [ ] Passo 10 — Gerar e implementar a classe Behavior Pool [[ZCLXX_BP_ENTIDADE_ROOT]]
- [ ] Passo 11 — Criar o BDEF de Projeção [[ZC_XX_ENTIDADE_ROOT (BDEF)|ZC_XX_ENTIDADE_ROOT (BDEF)]]

---

### Fase 5: Camada de Serviço e Exposição (OData V2 / V4)
> **Objetivo:** Publicar o escopo das entidades através do Service Definition e habilitar o endpoint no Service Binding para teste funcional imediato via Fiori Elements App Preview no Eclipse.

- [ ] Passo 12 — Criar o Service Definition [[ZUI_XX_ENTIDADE]]
- [ ] Passo 13 — Criar e publicar o Service Binding [[ZUI_O2_XX_ENTIDADE]]

---

### Fase 6: Camada Frontend (SAP Fiori Elements & Launchpad)
> **Objetivo:** Gerar o projeto frontend no VS Code (SAP Fiori Generator), ajustar propriedades de tabela e navegação no `manifest.json`, executar o deploy no repositório BSP ABAP e solicitar a liberação no Fiori Launchpad.

- [ ] Passo 14 — Gerar e publicar o App [[app_fiori_nome (App Fiori)|app_fiori_nome]]

---

## 📌 Anexo: Parâmetros do App para Validação com o Supervisor (Tabela de Parâmetros)

> **Objetivo desta seção:** Identificar antecipadamente regras de negócio, limites numéricos ou códigos de processo que ficariam fixos (*hardcoded*) no código, avaliando a necessidade de parametrizá-los em tabelas customizadas (Princípios *Clean Core*).

### 📋 Mapeamento de Parâmetros da Demanda

| # | Parâmetro de Negócio | Valor Proposto | Onde estará localizado | Impacto / Por que parametrizar? |
| :-: | :--- | :--- | :--- | :--- |
| **01** | **[Nome do Parâmetro 1]** | `[Valor]` | `[[Nome_CDS]]` | [Explicação técnica do motivo da flexibilização] |
| **02** | **[Nome do Parâmetro 2]** | `[Valor]` | `[[Nome_Classe]]` | [Explicação técnica do motivo da flexibilização] |

---

### 💡 Sugestão de Estrutura para Discutir com o Supervisor

Caso a parametrização seja recomendada pelo líder técnico:
* **Tabela Z Sugerida:** `ZTXX_PARAMETROS`
* **Campos Principais:** `MANDT`, `CHAVE_NEGOCIO`, `VALOR_REGRA`, `ATIVO`.
