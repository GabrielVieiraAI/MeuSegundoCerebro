---
name: iniciar-demanda-sap
description: >-
  Etapa 1 do Processo de Desenvolvimento de Demandas SAP. Cria a estrutura de 4 macro-pastas da demanda,
  move os anexos (PowerPoint/DPS) para Anexos/ e extrai as notas limpas da subpasta Especificacao/.
  Ativada quando o usuário usar o comando `/iniciar-demanda-sap`.
---

# Skill: Iniciar Demanda SAP (`/iniciar-demanda-sap`)

Esta skill executa exclusivamente o pontapé inicial (**Etapa 1 — Especificação**) do [[Processo de Desenvolvimento de Demandas]].

---

## 1. Portão de Aprovação Obrigatório (Explicar antes de Executar)

1. **Primeiro Passo (Análise e Explicação no Chat):**
   * Leia o PowerPoint (`.pptx`) da demanda informada pelo usuário.
   * Responda no chat explicando de forma direta o que você entendeu que precisa fazer:
     * O caminho da pasta da demanda em `01_Projects/Insi/<Empresa>/<ID_DEMANDA> - <Nome da Demanda>/` e a estrutura das 4 macro-pastas que será criada.
     * Quais arquivos brutos serão movidos para `01 - Requisitos e Negocio/Anexos/`.
     * Quais notas Markdown serão criadas dentro de `01 - Requisitos e Negocio/Especificacao/` (listando os nomes exatos dos arquivos conforme as seções do PowerPoint e um resumo de 1 linha de cada seção).
   * **Não crie nem mova nenhum arquivo antes da autorização do usuário.**
2. **Segundo Passo (Execução após Autorização):**
   * Assim que o usuário autorizar (ou pedir ajustes), execute os passos da Seção 2 abaixo.

---

## 2. Escopo Exato de Execução

### Passo 1: Criar a Estrutura Completa de Pastas
Dentro de `01_Projects/Insi/<Empresa>/<ID_DEMANDA> - <Nome da Demanda>/` (reutilizando a pasta raiz caso já exista), crie toda a árvore de diretórios:
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

### Passo 2: Organizar os Anexos
Mova o arquivo PowerPoint (`.pptx`) e quaisquer outros documentos brutos da raiz da demanda para `01 - Requisitos e Negocio/Anexos/`.

### Passo 3: Extrair as Notas de `Especificacao/`
Extraia o conteúdo do PowerPoint em arquivos Markdown dentro de `01 - Requisitos e Negocio/Especificacao/`:
* **Divisão de arquivos:** Adapte a quantidade de notas conforme as seções do PowerPoint (ex.: `01 - Contexto Atual e Cenário Organizacional.md`, `02 - Estratégia da Solução.md`, `03 - Detalhamento para Desenvolvimento.md`, `04 - Governança Técnica da Solução.md`).
* **Sem Nota de Sumário:** Não crie nota `00` de Sumário.
* **Filtro de Ruído (Síntese sem Omissão):** Remova capas divisórias e slides de Termo de Aceite / Assinaturas. Mantenha 100% das informações técnicas, regras de negócio, tabelas, pré-requisitos e parâmetros do documento de forma limpa e direta.
* **Sem Adição de Dúvidas pela IA:** Extraia apenas a especificação limpa do documento original; não insira marcações de dúvidas por conta própria.

### Passo 4: Parar na Etapa 1
* Não crie nenhuma nota dentro de `Reunioes/`, `02 - Arquitetura e Design/`, `03 - Guias de Execucao/` ou `04 - Objetos Tecnicos/`.
