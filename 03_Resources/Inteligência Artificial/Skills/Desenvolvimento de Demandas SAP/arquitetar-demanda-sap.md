---
name: arquitetar-demanda-sap
description: >-
  Etapas 2 e 4 do Processo de Desenvolvimento de Demandas SAP. Cria o documento de Arquitetura e Objetos,
  o diagrama Excalidraw de Arquitetura Técnica Completa e todas as notas de código na pasta 04 - Objetos Tecnicos/.
  Ativada pelo comando `/arquitetar-demanda-sap`.
tags:
  - recurso
  - ia
  - skill
  - sap
---

# Skill: Arquitetar Demanda SAP (`/arquitetar-demanda-sap`)

Esta skill executa a **Etapa 2 (`02 - Arquitetura e Design/`)** e a **Etapa 4 (`04 - Objetos Tecnicos/`)** do [[Processo de Desenvolvimento de Demandas]], utilizando exclusivamente os templates neutros de `05_Templates/01_Projetos_SAP/`.

---

## 1. Portão de Aprovação Obrigatório (Explicar antes de Executar)

1. **Primeiro Passo (Leitura e Explicação no Chat):**
   * Leia todas as notas de `01 - Requisitos e Negocio/Especificacao/` e `01 - Requisitos e Negocio/Reunioes/Consolidado de decisões tomadas em todas as reuniões.md` (se houver).
   * Leia o padrão de nomenclatura na pasta de regras globais da empresa (`01_Projects/Insi/<Empresa>/Regras Globais*`). Caso a empresa não possua padrão próprio, leia [[Padrão de Nomenclatura ABAP Geral]].
   * Leia obrigatoriamente os 3 templates:
     * [[Template_Arquitetura_e_Objetos]]
     * [[Template_Arquitetura_Tecnica_Completa_Excalidraw]]
     * [[Template_Objeto_Tecnico]]
   * Responda no chat explicando de forma direta o que você entendeu que precisa fazer:
     * As **Decisões Fundamentais de Arquitetura** propostas.
     * A tabela resumida dos **Objetos Técnicos** que serão criados por camada (respeitando o padrão de nomenclatura da empresa) e a ordem numerada das notas na pasta `04 - Objetos Tecnicos/`.
     * Eventuais pontos técnicos que precisem de definição do usuário antes de gerar os arquivos.
   * **Não crie nem edite nenhum arquivo antes da autorização do usuário.**
2. **Segundo Passo (Execução após Autorização):**
   * Após a aprovação do usuário, gere os artefatos conforme a Seção 2.

---

## 2. Escopo Exato de Execução

1. **Criar o Documento de Arquitetura (`02 - Arquitetura e Design/<ID> - Arquitetura e Objetos.md`):**
   * Siga estritamente [[Template_Arquitetura_e_Objetos]].
   * Síntese sem omissão: direto ao ponto, contendo o link/incorporação do Excalidraw, as Decisões Fundamentais de Arquitetura e a Lista Consolidada de Objetos Técnicos separada pelas camadas (com links diretos para as notas da pasta `04 - Objetos Tecnicos/`).
2. **Criar o Diagrama Excalidraw (`02 - Arquitetura e Design/01 - <ID> - Arquitetura Técnica Completa.excalidraw.md`):**
   * Siga estritamente [[Template_Arquitetura_Tecnica_Completa_Excalidraw]].
   * Atualize os textos (`## Text Elements`), os links (`## Element Links`) e o bloco `%% ## Drawing ```compressed-json ... ``` %%` para que o desenho reflita os objetos reais da demanda e abra no Excalidraw sem erros.
3. **Criar as Notas dos Objetos Técnicos (`04 - Objetos Tecnicos/<NN> - <NOME_OBJETO>.md`):**
   * Siga estritamente [[Template_Objeto_Tecnico]].
   * Numere na ordem cronológica de criação (`01 - ...`, `02 - ...`). Quando objetos compartilharem o mesmo nome técnico (ex.: CDS, BDEF e MDE), diferencie com sufixo entre parênteses: `(CDS)`, `(BDEF)`, `(MDE)`.
   * Cada nota deve conter:
     1. **📌 Visão Geral do Objeto**
     2. **⚖️ Regras de Negócio Aplicadas**
     3. **🛠️ Passo a Passo da Criação do Objeto**
     4. **💻 Snippet de Código** dividido em **📝 Código Comentado (Para Estudo e Referência)** e **🚀 Código Limpo (Sem Comentários - Para Copiar e Colar)**.
   * Nunca utilize o seletor estático ABAP isolado entre crases; utilize sempre em negrito (**`**=>**`**) ou com escape (**`` `\=>` ``**).
