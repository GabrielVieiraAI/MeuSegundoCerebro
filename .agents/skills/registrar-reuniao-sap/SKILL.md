---
name: registrar-reuniao-sap
description: >-
  Etapa 1 (Reuniões) do Processo de Desenvolvimento de Demandas SAP. Registra uma ata de reunião com
  consultores em Reunioes/ (resumo, tabela de decisões e transcrição) e atualiza a nota Consolidado de
  decisões tomadas em todas as reuniões. Ativada pelo comando `/registrar-reuniao-sap`.
---

# Skill: Registrar Reunião SAP (`/registrar-reuniao-sap`)

Esta skill documenta reuniões de alinhamento funcional/técnico dentro de `01 - Requisitos e Negocio/Reunioes/`, seguindo estritamente os templates neutros da pasta `05_Templates/01_Projetos_SAP/`.

---

## 1. Portão de Aprovação Obrigatório (Explicar antes de Executar)

1. **Primeiro Passo (Análise e Explicação no Chat):**
   * Leia a transcrição ou anotações da reunião enviadas pelo usuário, bem como os templates:
     * `05_Templates/01_Projetos_SAP/Template_Reuniao.md`
     * `05_Templates/01_Projetos_SAP/Template_Consolidado_Decisoes.md`
   * Responda no chat explicando de forma direta o que você entendeu que precisa fazer:
     * O nome da nota da reunião que será criada (ex.: `01 - Primeira reunião com consultores.md`).
     * A prévia das decisões identificadas na reunião (Tópico, Decisão Acordada e Impacto no Desenvolvimento) que entrarão na nota da reunião e atualizarão o `Consolidado de decisões tomadas em todas as reuniões.md`.
   * **Não crie nem edite nenhum arquivo antes da autorização do usuário.**
2. **Segundo Passo (Execução após Autorização):**
   * Após a autorização ou ajustes do usuário, crie/atualize os dois arquivos conforme a Seção 2.

---

## 2. Escopo Exato de Execução

1. **Criar a Nota da Reunião (`01 - Requisitos e Negocio/Reunioes/<NN> - <Título da Reunião>.md`):**
   * Utilize estritamente o `05_Templates/01_Projetos_SAP/Template_Reuniao.md`.
   * Preencha:
     1. **Visão Geral da Reunião** (Data, participantes e objetivo).
     2. **Resumo dos Tópicos Discutidos** (síntese direta ao ponto).
     3. **Decisões Tomadas na Reunião** (tabela de 5 colunas: `# | Tópico | Dúvida / Como constava no DPS | Decisão Final Acordada | Impacto no Desenvolvimento`).
     4. **Transcrição da Reunião** (texto integral enviado pelo usuário).
2. **Criar ou Atualizar a Nota Consolidada (`01 - Requisitos e Negocio/Reunioes/Consolidado de decisões tomadas em todas as reuniões.md`):**
   * Utilize estritamente o `05_Templates/01_Projetos_SAP/Template_Consolidado_Decisoes.md`.
   * Contém **apenas** a lista numerada e direta das decisões tomadas em todas as reuniões, agrupadas por reunião.
