---
tipo: mapa-mental
tags:
  - sap
  - abap
  - abap-cloud
  - mindmap
modulo: 1
---

# Programação ABAP Cloud

## Preparação do Ambiente e Conexão (Environment Setup)
- Eclipse IDE + Plug-in ADT (ABAP Development Tools)
- Tipos de Projetos no ADT
  - ABAP Projects: On-Premise e SAP S/4HANA Private Cloud
  - ABAP Cloud Projects: SAP BTP ABAP Environment e SAP S/4HANA Public Cloud (Clean Core)
- Estrutura de Plataforma no SAP BTP (PaaS)
  - Global Account (Governança e assinatura corporativa)
  - Subaccounts (Subcontas independentes de ambiente)
  - Runtimes (Cloud Foundry / Kyma)
  - ABAP Instance (Ambiente de execução ABAP)

## Navegação e Produtividade no Eclipse ADT
- Visão Project Explorer e Favorite Packages
- Abertura de Objetos de Desenvolvimento
  - Navegação em árvore (duplo clique no objeto)
  - Busca Rápida de Objetos: **Ctrl + Shift + A**
- Teclas de Atalho Vitais
  - **F1:** ABAP Language Help (documentação de comandos)
  - **F2:** Quick Info (tipagem e documentação rápida)
  - **F3:** Navegação para a Definição do Objeto
  - **Alt + ←:** Voltar ao ponto de origem da navegação
  - **Ctrl + F:** Localizar e substituir
  - **Ctrl + S:** Salvar rascunho inativo (Draft)
  - **Ctrl + F3:** Ativar objeto de desenvolvimento
  - **F9:** Executar classe no ABAP Console

## Estrutura de Software e Logística
- Pacotes ABAP (Packages)
  - Contêiner obrigatório para organização lógica
  - Prefixos **Z** ou **Y** obrigatórios para clientes
  - Proteção contra sobrescrita em upgrades da SAP
- Software Components
  - Unidade maior de entrega e transporte (ex: `ZLOCAL`)
  - Todo pacote pertence obrigatoriamente a um componente
- Paisagem de Sistemas e Logística de Transporte
  - Ciclo de Vida: DEV → TST → PRD
  - Transport Requests (Ordens de Transporte)
  - Bloqueio de Objetos (Object Locking)
  - Liberação de Tarefas (Task Release)

## Desenvolvimento Moderno e Primeira Aplicação (Hello World)
- Mudança de Paradigma
  - Fim do SAP GUI (SE38/SE80) e do comando `WRITE`
  - Modelo 100% Orientado a Objetos (Clean Core)
- Execução no Console (Console-based Execution)
  - Interface `IF_OO_ADT_CLASSRUN`
  - Método `main` com parâmetro `out` (`TYPE REF TO if_oo_adt_classrun_out`)
  - Comando `out->write()` para impressão de resultados
  - Execução direta com a tecla **F9**
- Ciclo de Compilação
  - Estado Inativo (Draft): Salvo com **Ctrl + S**
  - Estado Ativo (Active): Compilado e executável com **Ctrl + F3**
- Regras e Restrições Técnicas
  - Proibição do caractere cifrão (`$`) em nomes de classes

## Assistência e Inteligência Artificial no ADT
- Joule (Assistente SAP)
  - Recurso *Explain* para explicação de código em linguagem natural
  - Conclusão preditiva de código
- ABAP AI SDK
  - Desenvolvimento de soluções de negócio customizadas com IA Generativa
