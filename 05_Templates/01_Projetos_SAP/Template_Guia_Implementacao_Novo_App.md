---
tipo: guia-implementacao
tipo_demanda: novo-app # [novo-app, evolutiva-custom, extensao-standard, interface-api]
tags:
  - projeto
  - cliente # ex: veiling-holambra
  - sap
  - modulo-sap # ex: fi, sd, mm, co, abap
  - tecnologia # ex: rap, cds, odata, fiori, abap-cloud
  - id-demanda # ex: del-com-165
  - guia-implementacao
id_demanda: "[ID-DEMANDA]"
data: {{date}}
sap_destination: "" # Destino SAP de Desenvolvimento (DEV)
transport_requests: [] # Transport Requests selecionadas pelo usuário ao longo da implementação
---

# 🚀 [ID-DEMANDA] · Guia Passo a Passo de Implementação (Ordem de Criação)

⬅️ [[[ID-DEMANDA] - Arquitetura e Objetos|Arquitetura e Objetos]] | 🧪 [[02 - [ID-DEMANDA] - Guia de Testes e Homologação|Guia de Testes e Homologação]] | 🎨 [[02 - [ID-DEMANDA] - Fluxo de Implementação.excalidraw|Fluxo de Implementação (Excalidraw)]] | 🎨 [[01 - [ID-DEMANDA] - Arquitetura Técnica Completa.excalidraw|Arquitetura Técnica Completa (Excalidraw)]] | 📋 [[Consolidado de decisões tomadas em todas as reuniões|Decisões Consolidadas]]

---

🎨 **Diagrama Visual do Fluxo (Passos de Implementação):**
[[02 - [ID-DEMANDA] - Fluxo de Implementação.excalidraw|Abrir fluxo no Excalidraw]]
![[02 - [ID-DEMANDA] - Fluxo de Implementação.excalidraw|Abrir fluxo no Excalidraw]]

---

## 🛠️ Detalhamento Passo a Passo por Fase

> [!NOTE] Guia de Execução e Classificação dos Passos (`[MCP]` vs. `[Manual]`)
> Esta checklist representa a **ordem cronológica exata de dependências técnicas** da demanda. Cada passo aponta diretamente para a nota individual do objeto na pasta `04 - Objetos Tecnicos`, onde constam os **Metadados ADT**, o passo a passo de criação e os snippets de código completos.
> - **`[MCP]`:** passo executável de forma automatizada no ambiente `DEV` via servidor **MCP** (*Model Context Protocol*) `sap-adt`.
> - **`[Manual]`:** passo 100% executado pelo desenvolvedor humano no **ADT** (*ABAP Development Tools*), **SAP GUI** ou **BAS** (*SAP Business Application Studio*).
> - **`[Ativação em Massa: Ctrl + Shift + F3]`:** sinaliza grupos com dependência circular mútua (como CDS pai e filho) que precisam ser criados/editados em conjunto antes da ativação em lote.

### Fase 0: Estrutura de Pacotes e Encapsulamento *(Condicional)*
> **Objetivo:** Criar a estrutura de pacotes (`DEVC/K`) e configurar encapsulamento (*Package Interface* e *Use Access*) quando a demanda exigir novo(s) pacote(s). **Remova esta fase se a demanda reutilizar pacotes já existentes.**

- [ ] Passo 0.1 `[MCP]` — Criar pacote de desenvolvimento [[00 - ZPACOTE_DEMANDA|ZPACOTE_DEMANDA]]
- [ ] Passo 0.2 `[Manual]` — Configurar *Package Interface*, *Elements*, *Use Access* e *API State `C1`* (quando aplicável ao padrão do projeto)

---

### Fase 1: Fundação, Segurança e Dicionário de Dados
> **Objetivo:** Criar todos os objetos de suporte independentes que serão consumidos pelo código ABAP e CDS mais adiante (Tabelas transparentes, classes de mensagem SE91 e objetos de autorização SU21).

- [ ] Passo 1 `[MCP]` — Criar a tabela [[01 - ZTXX_TABELA|ZTXX_TABELA]]
- [ ] Passo 2 `[Manual]` — Criar o objeto de autorização [[02 - ZXX_AUTH_OBJ|ZXX_AUTH_OBJ]]
- [ ] Passo 3 `[MCP]` — Criar a classe de mensagens [[03 - ZXX_MENSAGENS|ZXX_MENSAGENS]]

---

### Fase 2: Camada de Modelagem de Dados — CDS Views de Base
> **Objetivo:** Construir e validar separadamente as extrações de dados através de CDS Views de interface.
> **Bloco Circular (exemplo de sintaxe quando houver dependência mútua):** `[Ativação em Massa: Ctrl + Shift + F3]` — criar/editar todos os objetos do grupo abaixo antes de ativar em lote.

- [ ] Passo 4 `[MCP]` — Criar a CDS de base [[04 - ZI_XX_DADOS_BASE_1|ZI_XX_DADOS_BASE_1]]
- [ ] Passo 5 `[MCP]` — Criar a CDS de suporte [[05 - ZI_XX_DADOS_BASE_2|ZI_XX_DADOS_BASE_2]]

---

### Fase 3: Camada de Modelagem de Dados — CDS Raiz, Projeção e MDE
> **Objetivo:** Unificar as regras de negócio na entidade raiz do modelo RAP, definir a visão de consumo e isolar as anotações de interface na Metadata Extension.

- [ ] Passo 6 `[MCP]` — Criar a CDS Raiz [[06 - ZI_XX_ENTIDADE_ROOT (CDS)|ZI_XX_ENTIDADE_ROOT]]
- [ ] Passo 7 `[MCP]` — Criar a CDS de Projeção [[09 - ZC_XX_ENTIDADE_ROOT (CDS)|ZC_XX_ENTIDADE_ROOT]]
- [ ] Passo 8 `[MCP]` — Criar a Metadata Extension [[10 - ZC_XX_ENTIDADE_ROOT (MDE)|ZC_XX_ENTIDADE_ROOT (MDE)]]

---

### Fase 4: Camada de Comportamento de Negócio (RAP - BDEF e ABAP)
> **Objetivo:** Declarar o comportamento transacional no Behavior Definition e implementar as regras, validações e ações nas classes ABAP.

- [ ] Passo 9 `[MCP]` — Criar o BDEF Raiz [[07 - ZI_XX_ENTIDADE_ROOT (BDEF)|ZI_XX_ENTIDADE_ROOT (BDEF)]]
- [ ] Passo 10 `[MCP]` — Gerar e implementar a classe [[08 - ZCLXX_BP_ENTIDADE_ROOT|ZCLXX_BP_ENTIDADE_ROOT]]
- [ ] Passo 11 `[MCP]` — Criar o BDEF de Projeção [[11 - ZC_XX_ENTIDADE_ROOT (BDEF)|ZC_XX_ENTIDADE_ROOT (BDEF)]]

---

### Fase 5: Camada de Serviço e Exposição (OData V2 / V4)
> **Objetivo:** Publicar o serviço OData e testar a aplicação via Fiori Elements Preview antes de gerar o projeto frontend.

- [ ] Passo 12 `[MCP]` — Criar o Service Definition [[12 - ZUI_XX_ENTIDADE|ZUI_XX_ENTIDADE]]
- [ ] Passo 13 `[MCP]` — Criar e publicar o Service Binding [[13 - ZUI_O2_XX_ENTIDADE|ZUI_O2_XX_ENTIDADE]]

---

### Fase 6: Camada Frontend (SAP Fiori Elements & Launchpad)
> **Objetivo:** Gerar o aplicativo Fiori no BAS/VS Code, fazer deploy no servidor ABAP e liberar os catálogos no Launchpad.

- [ ] Passo 14 `[Manual]` — Gerar e publicar o App [[14 - app_fiori_nome (App Fiori)|app_fiori_nome]] e configurar permissões (`PFCG` / Launchpad)
