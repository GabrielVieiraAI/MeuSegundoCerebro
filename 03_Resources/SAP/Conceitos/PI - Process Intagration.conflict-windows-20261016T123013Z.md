---
aliases:
  - Process Integration
  - SAP XI
  - Exchange Infrastructure
  - PI-PO
  - SAP PI
tags:
  - sap
  - middleware
  - integracao
  - arquitetura
  - mensageria
type: concept
status: draft
summary: O middleware de integração pioneiro da SAP, responsável pelo roteamento, transformação (mapping) e conectividade clássica (A2A e B2B).
---
# PI - Process Integration

**Relacionado:** [[PO - Process Orquestration|SAP PO]], [[Roteiro de Estudos SAP]]

## O que é o SAP PI?

Tecnicamente, o SAP Process Integration (antigamente conhecido como SAP XI - *Exchange Infrastructure*) é uma plataforma de integração de classe empresarial baseada nos princípios de SOA (Service Oriented Architecture). Ele atua como um *Message Broker* corporativo que provê roteamento lógico, transformação de estrutura e conectividade nativa para cenários A2A (Application-to-Application) e B2B (Business-to-Business) entre ambientes heterogêneos. 

De forma mais didática, antes de o [[PO - Process Orquestration|SAP PO]] nascer com ferramentas extras como workflows e motores de regras, o SAP PI era (e ainda é, dentro do PO) o grande responsável por garantir que sistemas com tecnologias completamente diferentes conversem entre si. Ele faz isso recebendo uma mensagem em um formato (ex: um arquivo de texto num FTP), convertendo-a para um formato padrão intermediário (XML no padrão SAP), aplicando regras de tradução de dados e, por fim, entregando a mensagem pelo protocolo nativo do destino (como um [[ABAP Proxy - Advanced Business Application Programming Proxy|Proxy ABAP]] ou um [[SOAP - Simple Object Access Protocol|Web Service SOAP]]).

## A Evolução da Arquitetura: Dual Stack vs Single Stack

Um dos conceitos mais importantes para entender o ecossistema SAP PI é a forma como seus servidores foram desenhados ao longo dos anos:

- **Dual Stack (A arquitetura Clássica):** Nas versões mais antigas (PI 7.0 e 7.1), o sistema exigia duas pilhas rodando simultaneamente: uma em **ABAP** (Integration Engine - responsável pelo processamento pesado e roteamento central) e outra em **Java** (Adapter Engine - responsável por prover os adaptadores modernos de comunicação com a internet). Isso tornava o sistema pesado, lento em certas pontas (por ficar trafegando os dados entre a base ABAP e a Java) e caro de manter.
- **Single Stack / AEX (A arquitetura Moderna):** A SAP resolveu esse gargalo criando o **AEX (Advanced Adapter Engine Extended)**. Basicamente, ela recriou todas as funcionalidades de roteamento do ABAP diretamente no lado Java. A partir do PI 7.3, a arquitetura passou a ser 100% **Java** (Single Stack), muito mais veloz e barata de operar. É justamente essa versão ágil do PI (o AEX) que serve como o pilar estrutural do moderno [[PO - Process Orquestration|SAP PO]].

## Componentes Centrais

O desenvolvimento de uma interface no SAP PI orbita três pilares de ferramentas. Note como eles são idênticos aos que formam a base do SAP PO:

- **SLD (System Landscape Directory):** O mapa da infraestrutura. É um registro central que lista os dados técnicos (IPs, portas, versões de software) de todos os sistemas de negócio envolvidos nas integrações da empresa.
- **ESR (Enterprise Services Repository):** O estúdio de *Design*. É o ambiente focado nas estruturas, onde o desenvolvedor cria:
  - **Data Types e Message Types:** A "árvore" de campos das mensagens que vão trafegar.
  - **Service Interfaces:** Os contratos, definindo se a comunicação será Síncrona (espera resposta imediata) ou Assíncrona.
  - **Message Mappings:** A transformação de fato (ex: unir nome e sobrenome do sistema A em um único campo no sistema B).
- **ID (Integration Directory):** O estúdio de *Configuração*. É aqui que as peças criadas no ESR ganham vida. No ID você define acordos de entrega (quem manda e quem recebe) e cria os **Communication Channels** (os canais que definem se o sistema vai usar [[SOAP - Simple Object Access Protocol|SOAP]], REST, SFTP, JDBC, etc.).
