---
name: gerar-guia-implementacao-sap
description: >-
  Etapa 3 (Guia 1) do Processo de Desenvolvimento de Demandas SAP. Cria exclusivamente o Guia de Implementação
  (checklist em fases por dependência técnica) e o diagrama Excalidraw de Fluxo de Implementação.
  Ativada pelo comando `/gerar-guia-implementacao-sap`.
tags:
  - recurso
  - ia
  - skill
  - sap
---

# Skill: Gerar Guia de Implementação SAP (`/gerar-guia-implementacao-sap`)

Esta skill cria exclusivamente o **Guia de Implementação** (`03 - Guias de Execucao/01 - <ID> - Guia de Implementação.md`) e o seu diagrama visual (`02 - Arquitetura e Design/02 - <ID> - Fluxo de Implementação.excalidraw.md`), seguindo o [[Processo de Desenvolvimento de Demandas]]. **Nunca gere o Guia de Testes junto com este comando.**

---

## 1. Portão de Aprovação Obrigatório (Explicar antes de Executar)

1. **Primeiro Passo (Leitura e Explicação no Chat):**
   * Leia o documento `02 - Arquitetura e Design/<ID> - Arquitetura e Objetos.md` e a lista de notas em `04 - Objetos Tecnicos/`.
   * Leia obrigatoriamente os templates:
     * [[Template_Guia_Implementacao_Novo_App]]
     * [[Template_Fluxo_Implementacao_Excalidraw]]
   * Responda no chat explicando de forma direta o que você entendeu que precisa fazer:
     * Os 2 arquivos que serão criados (`01 - <ID> - Guia de Implementação.md` e `02 - <ID> - Fluxo de Implementação.excalidraw.md`).
     * A sequência exata de Passos dividida pelas Fases de implementação (incluindo **Fase 0 / Passo 0** de pacotes e encapsulamento quando a demanda exigir novo pacote, até o último objeto), já sinalizando quais passos são **`[MCP]`**, quais são **`[Manual]`** e eventuais blocos **`[Ativação em Massa: Ctrl + Shift + F3]`**.
   * **Não crie nem edite nenhum arquivo antes da autorização do usuário.**
2. **Segundo Passo (Execução após Autorização):**
   * Após a autorização do usuário, crie os 2 arquivos conforme a Seção 2.

---

## 2. Escopo Exato de Execução

1. **Criar o Diagrama de Fluxo (`02 - Arquitetura e Design/02 - <ID> - Fluxo de Implementação.excalidraw.md`):**
   * Siga estritamente [[Template_Fluxo_Implementacao_Excalidraw]], atualizando os passos, links (`## Element Links`) e o bloco `compressed-json` válido.
2. **Criar o Guia de Implementação (`03 - Guias de Execucao/01 - <ID> - Guia de Implementação.md`):**
   * Siga estritamente [[Template_Guia_Implementacao_Novo_App]].
   * Mantenha no YAML do topo os campos `sap_destination: ""` e `transport_requests: []`.
   * Inclua a **Fase 0 (Estrutura de Pacotes e Encapsulamento)** com Passo 0 sempre que a demanda exigir criação de novo pacote (`DEVC/K`) ou configuração de encapsulamento (*Package Interface*).
   * Organize os checkboxes incluindo obrigatoriamente a tag de execução **`[MCP]`** ou **`[Manual]`** em **todos os passos** (`- [ ] Passo X [MCP] — Criar ... [[Link da Nota do Objeto]]`), respeitando rigorosamente a ordem de dependência de ativação no SAP. Use `[Manual]` para objetos fora do MCP (ex.: `SU21`/`SUSO`, *Behavior Extension*, `SAJC`, configurações de *Package Interface*/*Use Access*/*API State `C1`*, app **UI5**/deploy **BSP** e `PFCG`/Launchpad).
   * Sinalize blocos com dependência circular mútua (como CDS pai e filho) com a marcação explícita **`[Ativação em Massa: Ctrl + Shift + F3]`**.
