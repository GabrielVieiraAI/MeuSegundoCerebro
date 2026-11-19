---
tags:
  - projeto
  - insi
  - sap
  - abap
  - processo
  - arquitetura
data: 2026-11-09
---
# Processo de Desenvolvimento de Demandas

Este documento sintetiza o fluxo de trabalho padrão para conduzir qualquer demanda do início ao fim. A própria estrutura de pastas da demanda representa a ordem cronológica das etapas.

---
## Visão Geral da Estrutura

```text
<ID_DEMANDA> - <Nome da Demanda>/
├── 01 - Requisitos e Negocio/
│   ├── Anexos/
│   ├── Especificacao/
│   └── Reunioes/
├── 02 - Arquitetura e Design/
│   └── Imagens/
├── 03 - Guias de Execucao/
└── 04 - Objetos Tecnicos/
```

---
## Etapa 1 · `01 - Requisitos e Negocio`
**Objetivo:** Entender os requisitos de negócio, extrair as especificações sem ruídos do material bruto e alinhar todas as dúvidas com o consultor funcional antes de desenhar a solução.

| Subpasta             | Conteúdo e Finalidade                                                                                                                                                        | Comando (Skill)                                             | Templates Relacionados                                        |
| :------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------- | :------------------------------------------------------------ |
| **`Anexos/`**        | Arquivos originais recebidos do consultor (apresentação PowerPoint do DPS — *Desenho de Proposta de Solução*, planilhas de estimativa, templates de Especificação Técnica).  | [[iniciar-demanda-sap\|`/iniciar-demanda-sap`]]             | —                                                             |
| **`Especificacao/`** | Especificação funcional consolidada em alto nível nos 6 pilares essenciais (para desenvolvedores, consultores e key users), com rastreabilidade de slides e zero inferência. | [[extrair-especificacao-sap\|`/extrair-especificacao-sap`]] | —                                                             |
| **`Reunioes/`**      | Notas individuais por reunião (contendo resumo, tabela de decisões e transcrição) e uma nota consolidada que reúne apenas as decisões tomadas em todas as reuniões.          | [[registrar-reuniao-sap\|`/registrar-reuniao-sap`]]         | • [[Template_Reuniao]]<br>• [[Template_Consolidado_Decisoes]] |

---
## Etapa 2 · `02 - Arquitetura e Design`
**Objetivo:** Desenhar a arquitetura técnica da demanda após a consolidação da Etapa 1.

| Artefato | Finalidade | Comando (Skill) | Template Relacionado |
| :--- | :--- | :--- | :--- |
| **1. Documento de Arquitetura e Objetos**<br>(`<ID> - Arquitetura e Objetos.md`) | Visão técnica enxuta da solução: incorpora o diagrama visual, lista as decisões fundamentais de arquitetura e apresenta a tabela de objetos dividida por camadas (com link direto para cada objeto na pasta `04`). | [[arquitetar-demanda-sap\|`/arquitetar-demanda-sap`]] | [[Template_Arquitetura_e_Objetos]] |
| **2. Diagrama de Arquitetura Completa**<br>(`01 - <ID> - Arquitetura Técnica Completa.excalidraw.md`) | Representação visual no Excalidraw com os blocos de todas as camadas da solução e links (`Element Links`) apontando para as notas dos objetos técnicos. | [[arquitetar-demanda-sap\|`/arquitetar-demanda-sap`]] | [[Template_Arquitetura_Tecnica_Completa_Excalidraw]] |

---
## Etapa 3 · `03 - Guias de Execucao`
**Objetivo:** Transformar a arquitetura definida na Etapa 2 em roteiros práticos de implementação, testes e eventuais ajustes.

| Guia | Obrigatoriedade | Finalidade | Comando (Skill) | Template Relacionado |
| :--- | :---: | :--- | :--- | :--- |
| **1. Guia de Implementação**<br>(`01 - <ID> - Guia de Implementação.md`) | Obrigatório | Define a ordem cronológica (checklist em fases, incluindo **Fase 0 condicional** de pacotes/encapsulamento quando aplicável) com tags `[MCP]` / `[Manual]` por passo, marcação `[Ativação em Massa: Ctrl + Shift + F3]` em blocos circulares e campos YAML (`sap_destination`, `transport_requests`), acompanhado do diagrama de fluxo no Excalidraw. | [[gerar-guia-implementacao-sap\|`/gerar-guia-implementacao-sap`]] | • [[Template_Guia_Implementacao_Novo_App]]<br>• [[Template_Fluxo_Implementacao_Excalidraw]] |
| **2. Guia de Testes e Homologação**<br>(`02 - <ID> - Guia de Testes e Homologação.md`) | Obrigatório | Documenta os testes do PowerPoint já no formato das seções da Especificação Técnica (ETD), facilitando a validação e a geração futura do documento final. | [[gerar-guia-testes-sap\|`/gerar-guia-testes-sap`]] | [[Template_Guia_Testes_Homologacao]] |
| **3. Guia de Atualização**<br>(`03 - <ID> - Guia de Atualização (<Tema>).md`) | Opcional | Criado apenas se os testes exigirem correção ou mudança na arquitetura. Volta-se à Etapa 2 para ajustar o desenho e documenta-se aqui o passo a passo da atualização. | [[gerar-guia-atualizacao-sap\|`/gerar-guia-atualizacao-sap`]] | [[Template_Guia_Atualizacao]] |

---
## Etapa 4 · `04 - Objetos Tecnicos`
**Objetivo:** Guardar os objetos técnicos da demanda e seus códigos-fonte.

* **Funcionamento:** Já durante a **Etapa 2 (Arquitetura e Design)**, o comando [[arquitetar-demanda-sap|`/arquitetar-demanda-sap`]] cria uma nota para cada objeto previsto contendo a visão geral, regras aplicadas, **Metadados ADT** (*ABAP Development Tools* — `objectType`, `packageName`, `name`, `description` <= 60 caracteres e `extraParams`), passo a passo de criação, código comentado (para estudo) e código limpo (para copiar e colar), separando sub-blocos por arquivo/aba **AFF** (*ABAP File Format*) em objetos multi-arquivo.
* **Template Obrigatório:** [[Template_Objeto_Tecnico]]

---
## Etapa 5 · Execução no SAP (`DEV`)
**Objetivo:** Implementar no ambiente SAP de Desenvolvimento (`DEV`), passo a passo, os objetos planejados nas Etapas 3 e 4 mantendo o cofre sincronizado.

| Escopo | Finalidade | Comando (Skill) | Pré-Requisitos |
| :--- | :--- | :--- | :--- |
| **Passos `[MCP]` (ou bloco circular)** | Executa um **passo único** (direto no chat) ou uma **fase inteira** (via subagente isolado por passo/bloco com passagem do contexto prévio), exibindo apenas checklist sucinto (`🟢` ok / `🔴` ação humana, sem código no chat), executando criação/edição, checagem, ativação (em lote quando `[Ativação em Massa: Ctrl + Shift + F3]`), ações pós-ativação e **ATC** (*ABAP Test Cockpit*), sincronizando `📝 Código Comentado` e `🚀 Código Limpo` e marcando `[x]` no Guia automaticamente (parando em passos `[Manual]`, `🔴` ou erro Nível 2). | [[implementar-demanda-sap\|`/implementar-demanda-sap`]] | • Guia classificado com `[MCP]` / `[Manual]`<br>• Nota com **Metadados ADT**<br>• Destino `DEV` e **TR** (*Transport Request*) válidos |
| **Passos `[Manual]`** | Objetos não suportados pelo MCP (como `SU21`/`SUSO`, *Behavior Extension*, `SAJC`, app **SAPUI5**/deploy **BSP**, *Business Server Pages*, e `PFCG`/Launchpad) são executados diretamente pelo desenvolvedor humano no **ADT**, **SAP GUI** ou **BAS** (*SAP Business Application Studio*). | — *(execução humana)* | Nota técnica correspondente na pasta `04 - Objetos Tecnicos/` |

---
## 🤖 Diretrizes para IA (Contexto de Automação)

As instruções abaixo destinam-se exclusivamente a orientar agentes de IA ao criar ou editar notas dentro de uma demanda:

1. **Portão de Aprovação Obrigatório (Explicar antes de Executar):**
   * Antes de executar qualquer comando ou criar/editar arquivos, explique diretamente no chat o que você entendeu que precisa fazer (quais arquivos serão criados/alterados e o resumo do conteúdo) e aguarde a autorização ou ajustes do usuário.
2. **Síntese sem Omissão (Zero Ruído):**
   * Escreva sempre direto ao ponto, sem textos longos e sem argumentações tentando convencer o leitor de decisões que já foram tomadas.
   * **Essencial ≠ Omitir:** Mantenha 100% das informações técnicas relevantes, eliminando apenas palavras desnecessárias e qualquer conteúdo fora do escopo da nota.
3. **Uso Obrigatório dos Templates Neutros (`05_Templates/01_Projetos_SAP/`):**
   * Nunca utilize demandas anteriores como referência para não contaminar a nova demanda com regras de negócio alheias.
   * Sempre leia o template correspondente listado nas tabelas acima antes de gerar qualquer arquivo das Etapas 1, 2, 3 ou 4.
4. **Regras Específicas da Etapa 1 (`Especificacao/`):**
   * Crie a nota unificada `01 - Especificação Funcional (Visão da Solução).md` estruturada nos **6 Pilares Essenciais**: (1) Contexto do Cliente, (2) O que precisa ser criado com Desenvolvimento ABAP (detalhando quantos e quais aplicativos/programas serão criados, quem usa, função e regras de cada um), (3) Escopo Negativo, (4) Detalhamento das Regras de Negócio e Dados, (5) Cenários de Testes e (6) Lacunas, Dúvidas e Ambiguidades.
   * **Zero Inferência e Citação Obrigatória:** Extraia apenas fatos presentes na apresentação com referência obrigatória do slide `(Slide X)`.
   * Remova capas divisórias, termos de aceite/assinaturas e seções administrativas/burocráticas (como "Identificação da Solicitação" e "Requerimentos dependentes e relacionados").
5. **Regras Específicas das Etapas 2, 3 e 4 (Nomenclatura, Classificação e Metadados ADT):**
   * **Padrão de Nomenclatura por Empresa:** Cada empresa possui uma pasta de regras globais (ex.: `Regras Globais da <Empresa>`). Os nomes de objetos ABAP/CDS/Fiori devem seguir estritamente o padrão de nomenclatura contido na pasta da empresa à qual a demanda pertence. Caso a empresa não possua um padrão próprio documentado, utilize o [[Padrão de Nomenclatura ABAP Geral]].
   * Na pasta `04 - Objetos Tecnicos/`, numere os arquivos na mesma sequência de criação do Guia de Implementação (`01 - <NOME_OBJETO>.md`, `02 - <NOME_OBJETO>.md`...). Quando objetos diferentes compartilharem o mesmo nome técnico (comum no RAP), diferencie o nome do arquivo com sufixo entre parênteses: `(CDS)`, `(BDEF)`, `(MDE)`.
   * Preencha obrigatoriamente o bloco **Metadados ADT** nas notas de objeto (`objectType`, `packageName`, `name`, `description` <= 60 caracteres e `extraParams`) e separe sub-blocos por arquivo/aba AFF em objetos multi-arquivo (como `CLAS/OC`).
   * No Guia de Implementação (`03 - Guias de Execucao/01 - <ID> - Guia de Implementação.md`), inclua **Fase 0 (condicional)** quando houver criação de novos pacotes, classifique todos os passos com **`[MCP]`** ou **`[Manual]`** e sinalize blocos circulares com **`[Ativação em Massa: Ctrl + Shift + F3]`**.
6. **Regras Específicas da Etapa 5 (Execução no SAP via `/implementar-demanda-sap`):**
   * Nunca grave credenciais SAP no cofre, em scripts ou nas skills; nunca crie objetos em `$TMP` sem autorização explícita; bloqueie automaticamente destinos `QAS`/`PRD`/`PROD`/`S4Q`/`S4P` e nunca autoselecione **TR**.
   * Exiba pré-checagens apenas em checklist sucinto de até 1 linha por item (`🟢` ok / `🔴` ação humana, sem colar código no chat), execute diretamente no SAP quando tudo estiver `🟢` (em modo **Passo único** direto no chat ou em modo **Fase** via subagente isolado por passo com passagem de contexto prévio, parando em `[Manual]`, `🔴` ou erro Nível 2), atualize o cofre (`📝 Código Comentado` e `🚀 Código Limpo`) somente após ativação com sucesso no SAP e marque `[x]` no Guia automaticamente ao concluir sem erros críticos.
   * **Isenção das demandas:** nunca grave nomes de skills ou comandos `/...-sap` dentro das notas das demandas nem nos templates em `05_Templates/01_Projetos_SAP/`.
