---
name: gerar-guia-testes-sap
description: >-
  Etapa 3 (Guia 2) do Processo de Desenvolvimento de Demandas SAP. Cria exclusivamente o Guia de Testes e
  Homologação no formato das seções da Especificação Técnica (ETD). Ativada pelo comando `/gerar-guia-testes-sap`.
---

# Skill: Gerar Guia de Testes e Homologação SAP (`/gerar-guia-testes-sap`)

Esta skill cria exclusivamente o **Guia de Testes e Homologação** (`03 - Guias de Execucao/02 - <ID> - Guia de Testes e Homologação.md`) já estruturado no padrão das seções 3.1 a 3.4 da Especificação Técnica (ETD).

---

## 1. Portão de Aprovação Obrigatório (Explicar antes de Executar)

1. **Primeiro Passo (Leitura e Explicação no Chat):**
   * Leia os cenários de teste contidos no PowerPoint original (`01 - Requisitos e Negocio/Anexos/*.pptx`) ou nas notas de `Especificacao/`, as decisões de `Reunioes/Consolidado de decisões tomadas em todas as reuniões.md` e a arquitetura em `02 - Arquitetura e Design/<ID> - Arquitetura e Objetos.md`.
   * Leia obrigatoriamente o template:
     * `05_Templates/01_Projetos_SAP/Template_Guia_Testes_Homologacao.md`
   * Responda no chat explicando de forma direta o que você entendeu que precisa fazer:
     * O arquivo que será criado (`03 - Guias de Execucao/02 - <ID> - Guia de Testes e Homologação.md`).
     * A lista resumida dos cenários de teste (`T01`, `T02`...) que serão documentados na nota.
   * **Não crie nem edite nenhum arquivo antes da autorização do usuário.**
2. **Segundo Passo (Execução após Autorização):**
   * Após a autorização do usuário, crie a nota conforme a Seção 2.

---

## 2. Escopo Exato de Execução

1. **Criar o Guia de Testes e Homologação (`03 - Guias de Execucao/02 - <ID> - Guia de Testes e Homologação.md`):**
   * Siga estritamente `05_Templates/01_Projetos_SAP/Template_Guia_Testes_Homologacao.md`, preenchendo as 4 seções obrigatórias:
     1. **1. Identificação do Teste** (Tabela de cabeçalho da ETD).
     2. **2. Plano de Teste (Seção 3 da ETD)** (*2.1. Parâmetros de Entrada* e *2.2. Resultados Esperados*).
     3. **3. Sequenciamento dos Testes Unitários (Seção 3.3 da ETD)** (Tabela de 4 colunas: `Cod. Passo | Atividade | Dados de entrada | Resultado esperado`).
     4. **4. Evidências dos Testes e das Etapas do Processo (Seção 3.4 da ETD)** (Subseções detalhadas para cada cenário `T01`, `T02`... com etapas numeradas para inserção futura dos prints).
