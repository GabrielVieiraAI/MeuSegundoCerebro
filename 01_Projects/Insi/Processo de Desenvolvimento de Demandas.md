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

| Subpasta | Conteúdo e Finalidade | Comando (Skill) | Templates Relacionados |
| :--- | :--- | :--- | :--- |
| **`Anexos/`** | Arquivos originais recebidos do consultor (apresentação PowerPoint do DPS — *Desenho de Proposta de Solução*, planilhas de estimativa, templates de Especificação Técnica). | [[iniciar-demanda-sap\|`/iniciar-demanda-sap`]] | — |
| **`Especificacao/`** | Notas em Markdown divididas conforme as seções do PowerPoint, mantendo apenas a especificação limpa (sem capa, sem sumário e sem termos de aceite). | [[iniciar-demanda-sap\|`/iniciar-demanda-sap`]] | — |
| **`Reunioes/`** | Notas individuais por reunião (contendo resumo, tabela de decisões e transcrição) e uma nota consolidada que reúne apenas as decisões tomadas em todas as reuniões. | [[registrar-reuniao-sap\|`/registrar-reuniao-sap`]] | • [[Template_Reuniao]]<br>• [[Template_Consolidado_Decisoes]] |

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
| **1. Guia de Implementação**<br>(`01 - <ID> - Guia de Implementação.md`) | Obrigatório | Define a ordem cronológica (checklist em fases) para criar no SAP tudo o que foi arquitetado na Etapa 2, acompanhado do seu diagrama de fluxo no Excalidraw. | [[gerar-guia-implementacao-sap\|`/gerar-guia-implementacao-sap`]] | • [[Template_Guia_Implementacao_Novo_App]]<br>• [[Template_Fluxo_Implementacao_Excalidraw]] |
| **2. Guia de Testes e Homologação**<br>(`02 - <ID> - Guia de Testes e Homologação.md`) | Obrigatório | Documenta os testes do PowerPoint já no formato das seções da Especificação Técnica (ETD), facilitando a validação e a geração futura do documento final. | [[gerar-guia-testes-sap\|`/gerar-guia-testes-sap`]] | [[Template_Guia_Testes_Homologacao]] |
| **3. Guia de Atualização**<br>(`03 - <ID> - Guia de Atualização (<Tema>).md`) | Opcional | Criado apenas se os testes exigirem correção ou mudança na arquitetura. Volta-se à Etapa 2 para ajustar o desenho e documenta-se aqui o passo a passo da atualização. | [[gerar-guia-atualizacao-sap\|`/gerar-guia-atualizacao-sap`]] | [[Template_Guia_Atualizacao]] |

---
## Etapa 4 · `04 - Objetos Tecnicos`
**Objetivo:** Guardar os objetos técnicos da demanda e seus códigos-fonte.

* **Funcionamento:** Já durante a **Etapa 2 (Arquitetura e Design)**, o comando [[arquitetar-demanda-sap|`/arquitetar-demanda-sap`]] cria uma nota para cada objeto previsto contendo a visão geral, regras aplicadas, passo a passo de criação, código comentado (para estudo) e código limpo (para copiar e colar).
* **Template Obrigatório:** [[Template_Objeto_Tecnico]]

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
   * Adapte a quantidade de notas conforme as seções do PowerPoint (ex.: `01 - Contexto Atual...md`, `02 - Estratégia da Solução.md`, `03 - Detalhamento para Desenvolvimento.md`, `04 - Governança Técnica...md`).
   * **Não crie** nota `00` de Sumário.
   * Remova capas divisórias e termos de aceite/assinaturas.
   * **Não adicione** marcações de dúvidas por conta própria na extração; extraia apenas a especificação limpa do documento.
5. **Regras Específicas da Etapa 2 e 4 (Nomenclatura de Objetos e Arquivos):**
   * **Padrão de Nomenclatura por Empresa:** Cada empresa possui uma pasta de regras globais (ex.: `Regras Globais da <Empresa>`). Os nomes de objetos ABAP/CDS/Fiori devem seguir estritamente o padrão de nomenclatura contido na pasta da empresa à qual a demanda pertence. Caso a empresa não possua um padrão próprio documentado, utilize o [[Padrão de Nomenclatura ABAP Geral]].
   * Na pasta `04 - Objetos Tecnicos/`, numere os arquivos na mesma sequência de criação do Guia de Implementação (`01 - <NOME_OBJETO>.md`, `02 - <NOME_OBJETO>.md`...). Quando objetos diferentes compartilharem o mesmo nome técnico (comum no RAP), diferencie o nome do arquivo com sufixo entre parênteses: `(CDS)`, `(BDEF)`, `(MDE)`.
