---
aliases: ["Service-Oriented Architecture", "Arquitetura Orientada a Serviços"]
tags: [arquitetura, design-pattern, conceito]
type: "concept"
status: "draft"
summary: "Estilo arquitetural onde as lógicas e funcionalidades da aplicação são disponibilizadas como serviços independentes e reutilizáveis na rede."
---
# SOA (Service-Oriented Architecture)

**Relacionado:** [[ESB - Enterprise Service Bus|ESB]]

## O que é SOA?

Tecnicamente, SOA (Arquitetura Orientada a Serviços) é um padrão de design de arquitetura de software focado na criação de componentes de negócios independentes, fracamente acoplados (*loosely coupled*) e altamente reutilizáveis, conhecidos como **Serviços**. Esses serviços comunicam-se entre si por meio de protocolos padrão através de uma rede corporativa, frequentemente orquestrados por um [[ESB - Enterprise Service Bus|ESB]] (Enterprise Service Bus).

## Entendendo a SOA (Alto Nível)

Antes da SOA, a maioria dos softwares corporativos era construída como aplicações monolíticas ou em silos. Se o Sistema de Vendas precisasse checar o crédito de um cliente e o Sistema de Logística precisasse fazer a mesma checagem, a lógica de "Checar Crédito" muitas vezes era desenvolvida (e duplicada) dentro de cada sistema.

A mentalidade SOA propõe extrair essas lógicas e transformá-las em "Serviços Independentes". A empresa desenvolve um único serviço padronizado chamado `ConsultarCreditoCliente`. 

A partir daí, esse serviço fica disponível na rede da empresa como um utilitário:
- O Sistema de Vendas consome o serviço.
- O Sistema de Logística consome o mesmo serviço.
- Um aplicativo mobile recém-criado pode consumir o mesmo serviço sem precisar de recodificação.

### Características Principais de um Serviço SOA:
1. **Caixa Preta (Black Box):** Quem consome o serviço não precisa (e nem deve) saber em qual linguagem ele foi escrito (Java, ABAP, C#) ou qual banco de dados ele consulta. O consumidor apenas envia uma requisição (ex: Número do CPF) e recebe uma resposta estruturada (ex: Limite de Crédito aprovado).
2. **Alta Reutilização:** Desenvolvido uma única vez, consumido por múltiplos clientes e cenários.
3. **Contratos Claros:** Todo serviço SOA expõe um contrato rigoroso (como um arquivo WSDL no caso de serviços [[SOAP - Simple Object Access Protocol|SOAP]]), que dita as regras exatas do formato da pergunta e do formato da resposta.
