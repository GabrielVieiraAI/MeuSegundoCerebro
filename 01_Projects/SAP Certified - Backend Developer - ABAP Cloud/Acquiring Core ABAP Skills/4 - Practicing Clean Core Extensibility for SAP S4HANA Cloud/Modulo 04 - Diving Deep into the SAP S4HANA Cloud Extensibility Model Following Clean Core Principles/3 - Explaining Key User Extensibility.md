---
tipo: clippings
title: "Explaining Key User Extensibility"
source: "https://learning.sap.com/courses/practicing-clean-core-extensibility-for-sap-s-4hana-cloud/explaining-key-user-extensibility_c7f6cbcb-ed54-4f1d-8e76-4a6e311e3cfa"
created: 2026-11-03
tags:
  - sap
  - abap
  - key-user
  - clean-core
  - custom-fields
  - custom-logic
  - cbo
  - fiori
---
**Roteiro de Estudos Relacionado:** [[Roteiro de Estudos SAP]]

# Objetivos de Aprendizado

Após concluir esta lição, você será capaz de:
- Descrever os objetivos, o público-alvo e os benefícios da **Key User Extensibility** (antiga *In-App Extensibility*).
- Identificar e caracterizar as ferramentas web baseadas em **SAP Fiori** utilizadas para estender o sistema de forma declarativa e com baixo código (*Low-Code / No-Code*).
- Compreender como a extensibilidade de usuário-chave garante a conformidade com o **Clean Core** em todas as opções de implantação do SAP S/4HANA.

---

## 1. O Conceito e o Papel do Citizen Developer

A **Key User Extensibility** (anteriormente denominada *In-App Extensibility*) foi projetada especificamente para empoderar os **Citizen Developers** — especialistas de negócios (*Business Experts*), consultores funcionais e usuários-chave (*Key Users*).

![[Key_User_Extensibility_001.png]]

- **Objetivo Principal:** Permitir a implementação rápida, ágil e segura de extensões simples sem a dependência imediata de um desenvolvedor ABAP profissional e sem a necessidade de abrir chamados técnicos complexos.
- **Abstração Técnica Total:** As ferramentas não exigem que o usuário conheça os detalhes internos da arquitetura SAP, nomes de tabelas físicas legadas ou parâmetros de compilação.
- **Disponibilidade Universal:** Todas as ferramentas são aplicativos web nativos no **SAP Fiori**, disponíveis em todas as modalidades de implantação do SAP S/4HANA (Public Cloud, Private Cloud e On-Premise).
- **Garantia de Clean Core:** Qualquer extensão criada por meio dessas ferramentas consome apenas contratos estáveis e é automaticamente preservada durante as atualizações automáticas de versão promovidas pela SAP.

---

## 2. Catálogo de Ferramentas de Key User Extensibility

O ecossistema de ferramentas web de usuário-chave disponibiliza um conjunto completo de soluções para atender aos requisitos mais recorrentes de adaptação corporativa:

![[Key_User_Extensibility_002.png]]

Abaixo, detalhamos cada uma das ferramentas e suas respectivas finalidades práticas:

| Ferramenta (App Fiori) | O que faz na prática | Exemplo de Aplicação |
| :--- | :--- | :--- |
| **UI Adaptation at Runtime (RTA)** | Adapta telas em tempo de execução diretamente no navegador web. Permite renomear rótulos de campos, reordenar campos, ocultar seções desnecessárias ou exibir novos campos. | Renomear o campo "Tax Number" para "CNPJ" na tela de criação de clientes para atender à localização brasileira. |
| **Custom Fields** | Cria novos campos de dados vinculados a entidades de negócio padrão. A ferramenta propaga o campo automaticamente de ponta a ponta: tabela física, CDS Views, APIs OData e telas Fiori. | Adicionar o campo "Código de Rastreamento de Seguro" na ordem de venda (*Sales Order*). |
| **Custom Logic** | Permite adicionar lógica de negócio em pontos de extensão pré-configurados pela SAP (BAdIs). Possui um editor web com autocompletar, checagem de sintaxe e testes unitários integrados. | Bloquear a gravação de uma fatura caso o valor total exceda a alçada de crédito sem uma justificativa anexada. |
| **Custom Business Objects (CBO)** | Cria objetos de negócio inteiramente novos e independentes, gerando automaticamente a tabela de banco de dados subjacente, tela de manutenção e Web APIs CRUD. | Criar uma entidade corporativa para gerenciar o controle de crachás de visitantes ou veículos da frota corporativa. |
| **Custom CDS Views** | Permite modelar novas visões de dados (*Core Data Services*) combinando entidades liberadas pela SAP por meio de junções (*joins*) e associações visuais. | Criar uma visão combinando dados de Ordens de Venda e Dados Mestres de Clientes para alimentar um relatório específico. |
| **Custom Analytical Queries** | Construtor visual de consultas analíticas multidimensionais para relatórios gerenciais, definindo dimensões, medidas calculadas e filtros. | Construir uma query de análise de margem de contribuição por região e categoria de produto para a diretoria. |
| **Manage KPIs and Reports** | Criação e parametrização de indicadores-chave de desempenho (KPIs) exibidos em cards interativos no Fiori Launchpad com suporte a *Drill-down*. | Configurar um card analítico mostrando o percentual de entregas de pedidos no prazo (*On-Time Delivery*). |
| **Custom Forms & Email Templates** | Criação e personalização de templates de impressão (PDF via Adobe Forms) e modelos de e-mail corporativo alimentados por CDS Views. | Customizar o layout da confirmação de pedido de compra impresso com o logotipo corporativo e termos legais. |

---

## 3. A Linguagem ABAP para Key User (Restricted ABAP)

Na ferramenta **Custom Logic**, a SAP introduziu um subconjunto seguro da linguagem ABAP:
- O usuário programa diretamente pelo navegador em um ambiente seguro (*Sandboxed Environment*).
- **Sem Comandos Perigosos:** Instruções que poderiam comprometer a segurança, concorrência ou integridade do sistema (como `COMMIT WORK`, `ROLLBACK WORK`, `OPEN DATASET`, `CALL FUNCTION`, comandos SQL diretos `SELECT/INSERT/UPDATE` em tabelas do sistema) são estritamente bloqueadas pelo compilador web.
- **Acesso Controlado a Dados:** A manipulação de dados é realizada exclusivamente por meio das estruturas de dados e classes utilitárias liberadas disponibilizadas no contexto daquele ponto de extensão específico.

---

## Resumo da Lição

- A **Key User Extensibility** possibilita que usuários de negócios e analistas implementem adaptações rápidas via interface web sem necessidade de codificação pesada.
- Abrange desde modificações cosméticas de tela (**UI Adaptation at Runtime**) até criação de tabelas e APIs completas (**Custom Business Objects**) e regras de validação (**Custom Logic**).
- Opera sobre um compilador ABAP restrito em sandbox e consome exclusivamente artefatos liberados, sendo uma peça-chave para manter o núcleo do SAP S/4HANA **100% limpo (Clean Core)**.
