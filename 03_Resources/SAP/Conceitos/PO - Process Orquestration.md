---
aliases: ["Process Orchestration", "SAP PO"]
tags: [sap, middleware, integracao, bpm, brm]
type: "concept"
status: "draft"
summary: "Plataforma de middleware on-premise (Java Single Stack) que atua como ESB, unificando roteamento de mensagens, workflows e regras de negócio."
---
# SAP PO - Process Orchestration

**Relacionado:** [[PI - Process Intagration]], [[Roteiro de Estudos SAP]]

## O que é o SAP PO?

Tecnicamente, o SAP Process Orchestration (SAP PO) é uma plataforma de middleware B2B  on-premise, baseada integralmente na pilha Java (*Java Single Stack*). Ele atua como um barramento de integração corporativo (Enterprise Service Bus - ESB) que unifica a troca de mensagens, o roteamento, a transformação de dados e a orquestração de processos de negócios complexos entre sistemas SAP e não-SAP.

Em termos mais práticos, quando uma empresa possui diversos sistemas diferentes (como o ERP da SAP, um CRM, portais web e sistemas bancários), conectá-los diretamente cria uma teia de integrações complexa e difícil de manter. O SAP PO entra no meio dessa arquitetura para centralizar a comunicação. Em vez de os sistemas conversarem diretamente entre si, eles enviam os dados para o PO, que se encarrega de traduzir a mensagem para o formato correto e entregá-la ao destino.

Ele é a evolução do [[PI - Process Intagration|SAP PI]], consolidando três ferramentas fundamentais em um único servidor:

1. **[[PI - Process Intagration|PI (Process Integration)]]:** O núcleo de mensageria e roteamento. É responsável por receber a mensagem, realizar o mapeamento (ex: transformar um arquivo XML estruturado em um JSON) e enviá-la utilizando diferentes protocolos através de adaptadores, como [[SOAP - Simple Object Access Protocol|SOAP]], REST ou FTP.
2. **BPM (Business Process Management):** O orquestrador de fluxos. É utilizado quando a integração não é apenas um envio de mensagem ponto a ponto, mas um processo que exige estados e etapas. Por exemplo: um fluxo onde uma ordem de compra chega de um sistema, aguarda a aprovação de um usuário em um portal, e só depois é enviada ao sistema financeiro.
3. **BRM (Business Rules Management):** O gerenciador de regras de negócio. Permite centralizar lógicas de decisão complexas fora do código-fonte (seja ele em Java ou em um [[ABAP Proxy - Advanced Business Application Programming Proxy|Proxy ABAP]]). Assim, parâmetros de negócios (como limites de valores e taxas) podem ser gerenciados e alterados facilmente sem a necessidade de recompilar e transportar novos códigos.

## Arquitetura e Componentes Principais

Para desenvolver uma integração no SAP PO, o ciclo de vida passa basicamente por duas fases: **Design** (modelagem técnica) e **Configuração** (roteamento).

### 1. Ferramentas de Design e Configuração
Estas são as interfaces de trabalho do desenvolvedor e do arquiteto de integração:
- **SLD (System Landscape Directory):** O registro central da paisagem de sistemas. É onde cadastramos os detalhes dos componentes de software e dos sistemas físicos e lógicos (SAP e terceiros) que compõem o ambiente da empresa.
- **ESR (Enterprise Services Repository):** O repositório de modelagem. Aqui não se define a origem e destino físico, mas sim as estruturas de dados. É no ESR que o desenvolvedor cria os *Data Types* (estruturas da mensagem), as *Service Interfaces* e desenvolve os *Message Mappings* (a lógica de transformação de dados, como mapear o campo `NOME` de um sistema para o campo `CustomerName` de outro).
- **ID (Integration Directory):** O ambiente de configuração. Aqui as peças do ESR são conectadas à realidade da empresa. É onde definimos as regras de roteamento (ex: *"Quando o Sistema A enviar uma mensagem X, direcione para o Sistema B"*) e configuramos os **Communication Channels** (canais de comunicação), especificando os detalhes técnicos dos adaptadores (como a URL, credenciais e portas de um serviço [[SOAP - Simple Object Access Protocol|SOAP]]).

### 2. O Motor de Execução (Runtime)
- **AEX (Advanced Adapter Engine Extended):** É o motor de processamento em tempo de execução. Uma vez que o desenvolvimento e a configuração estão publicados, o AEX é o serviço Java que fica ativamente recebendo as mensagens, aplicando as transformações criadas no ESR e abrindo as conexões com os adaptadores configurados no ID para realizar a entrega de fato.
