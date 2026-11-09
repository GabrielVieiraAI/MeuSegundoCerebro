---
aliases: ["Enterprise Service Bus", "Barramento de Serviços"]
tags: [arquitetura, integracao, middleware, conceito]
type: "concept"
status: "draft"
summary: "Padrão de arquitetura de middleware que centraliza integrações (evitando o modelo ponto-a-ponto) através de roteamento e transformação de mensagens."
---
# ESB (Enterprise Service Bus)

**Relacionado:** [[SOA - Service-Oriented Architecture|SOA]], [[PI - Process Intagration|SAP PI]], [[PO - Process Orquestration|SAP PO]]

## O que é um ESB?

Tecnicamente, o ESB (Barramento de Serviço Corporativo) é um modelo de arquitetura de middleware distribuído, projetado para atuar como uma espinha dorsal de comunicação em uma **[[SOA - Service-Oriented Architecture|SOA]] (Service-Oriented Architecture)**. Em vez de permitir integrações *ponto-a-ponto*, o ESB centraliza a troca de mensagens, provendo serviços fundamentais de roteamento, orquestração, tradução de protocolos e transformação de dados (mapping).

## O Problema que o ESB resolve (Alto Nível)

Sem um ESB, quando uma empresa possui diversos sistemas (SAP, CRM, WMS, etc.), a tendência é que os desenvolvedores conectem o Sistema A diretamente à API do Sistema B (integração ponto-a-ponto). Com o crescimento da empresa, isso se transforma em uma teia incontrolável. Se um sistema muda de endereço ou de formato, todas as conexões diretas com ele quebram e precisam de manutenção.

Com a implantação de um ESB, cria-se uma regra central de arquitetura: **nenhum sistema se comunica diretamente com outro; todos se comunicam apenas com o barramento central (o ESB).**

### O Fluxo de Funcionamento:
1. O Sistema de Origem envia a informação da sua própria maneira (ex: via depósito de um arquivo FTP) para o ESB.
2. O ESB capta a mensagem.
3. O ESB aplica lógicas de roteamento (descobre quem deve receber), converte a estrutura da mensagem (ex: de um arquivo texto `.txt` para um `XML`) e faz a conversão de protocolo de comunicação.
4. O ESB entrega a mensagem ao Sistema de Destino no formato nativo que ele exige (ex: via [[SOAP - Simple Object Access Protocol|SOAP]] ou REST).

No ecossistema SAP, o **SAP PI** e o **SAP PO** são os middlewares que desempenham o papel tecnológico de ESB. No mercado aberto, outros exemplos famosos incluem MuleSoft, IBM App Connect e Apache Camel.
