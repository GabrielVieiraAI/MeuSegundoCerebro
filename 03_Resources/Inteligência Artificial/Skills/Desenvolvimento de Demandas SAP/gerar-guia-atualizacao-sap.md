---
name: gerar-guia-atualizacao-sap
description: >-
  Etapa 3 (Guia 3 - Opcional) do Processo de Desenvolvimento de Demandas SAP. Atualiza a Arquitetura e
  os Objetos Técnicos afetados por um ajuste identificado nos testes e cria o Guia de Atualização comparando
  Código Atual vs Como Deve Ficar. Ativada pelo comando `/gerar-guia-atualizacao-sap`.
tags:
  - recurso
  - ia
  - skill
  - sap
---

# Skill: Gerar Guia de Atualização SAP (`/gerar-guia-atualizacao-sap`)

Esta skill trata ajustes técnicos ou de regra de negócio identificados durante os testes de homologação, atualizando a Arquitetura/Objetos Técnicos e gerando o **Guia de Atualização** (`03 - Guias de Execucao/03 - <ID> - Guia de Atualização (<Tema>).md`), seguindo o [[Processo de Desenvolvimento de Demandas]].

---

## 1. Portão de Aprovação Obrigatório (Explicar antes de Executar)

1. **Primeiro Passo (Diagnóstico e Explicação no Chat):**
   * Analise o problema ou mudança de regra relatado pelo usuário e leia as notas dos objetos afetados em `04 - Objetos Tecnicos/` e `02 - Arquitetura e Design/<ID> - Arquitetura e Objetos.md`.
   * Leia obrigatoriamente o template:
     * [[Template_Guia_Atualizacao]]
   * Responda no chat explicando de forma direta o que você entendeu que precisa fazer:
     * O diagnóstico técnico da causa e a solução arquitetural proposta.
     * Quais notas existentes em `02 - Arquitetura e Design/` e `04 - Objetos Tecnicos/` serão atualizadas.
     * O nome do Guia de Atualização que será criado em `03 - Guias de Execucao/`.
   * **Não crie nem edite nenhum arquivo antes da autorização do usuário.**
2. **Segundo Passo (Execução após Autorização):**
   * Após a aprovação do usuário, execute os passos da Seção 2.

---

## 2. Escopo Exato de Execução

1. **Atualizar a Arquitetura e as Notas dos Objetos Afetados:**
   * Caso a responsabilidade ou estrutura de algum objeto mude, atualize `02 - Arquitetura e Design/<ID> - Arquitetura e Objetos.md` e as notas correspondentes em `04 - Objetos Tecnicos/` (mantendo tanto o Código Comentado quanto o Código Limpo atualizados).
2. **Criar o Guia de Atualização (`03 - Guias de Execucao/03 - <ID> - Guia de Atualização (<Tema>).md`):**
   * Siga estritamente [[Template_Guia_Atualizacao]].
   * Documente o diagnóstico direto ao ponto e o passo a passo por objeto mostrando **🔴 Código Atual** e **🟢 Como Deve Ficar**.
   * É proibido utilizar diagramas Mermaid.
