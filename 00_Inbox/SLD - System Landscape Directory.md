---
aliases: ["System Landscape Directory", "SLD"]
tags: [sap, pi, po, arquitetura, infraestrutura]
type: "concept"
status: "draft"
summary: "O diretório central (o 'catálogo telefônico') que cadastra e mapeia todos os sistemas físicos e lógicos da paisagem corporativa."
---
# SLD - System Landscape Directory

**Relacionado:** [[PI - Process Intagration|SAP PI]], [[PO - Process Orquestration|SAP PO]], [[ESR - Enterprise Services Repository|ESR]]

## O que é o SLD?

O **System Landscape Directory (SLD)** é o repositório central de informações sobre a paisagem de sistemas de uma empresa. Ele funciona como um **catálogo oficial e lista telefônica** de todos os softwares, versões e servidores (SAP e não-SAP) instalados na infraestrutura corporativa.

O SAP PI/PO não tem como "adivinhar" o IP ou o nome de um servidor para rotear uma mensagem. Ele consulta essas informações no SLD. Sem o SLD configurado, o barramento de integração fica completamente "cego".

## Categorias do SLD

Quando acessamos o SLD, os administradores de integração configuram basicamente duas grandes áreas:

### 1. Software Catalog (Catálogo de Softwares)
Cadastra **o que** a empresa possui, em um nível abstrato (focado no software, não na máquina física).
- **Products & Software Components:** Define quais sistemas e versões existem (ex: *SAP S/4HANA 2022*). É a partir daqui que o [[ESR - Enterprise Services Repository|ESR]] importa os componentes lógicos para organizar onde os desenvolvimentos serão salvos.

### 2. System Landscape (Infraestrutura Real)
Cadastra as máquinas de verdade e seus "apelidos" (focado no roteamento).
- **Technical System (Sistema Técnico):** O cadastro real e físico do servidor. Armazena o IP (host), porta, sistema operacional e banco de dados. Ex: *Máquina IP 192.168.10.50*.
- **Business System (Sistema de Negócio):** O nome lógico ("apelido") dado ao Technical System. O desenvolvedor nunca usa o IP direto para configurar uma integração no ID (*Integration Directory*); ele usa exclusivamente o Business System (ex: `SISTEMA_RH_PROD`).
  - *Vantagem Arquitetural:* Se o servidor físico queimar e for substituído por outro IP, basta atualizar o Technical System no SLD. O Business System permanece o mesmo e, consequentemente, nenhuma integração da empresa precisa ser reescrita ou reconfigurada.
