---
aliases: ["SOAP Adapter", "Web Services"]
tags: [sap, protocolo, pi, po, integracao]
type: "concept"
status: "draft"
summary: "Uso do protocolo padrão SOAP e do SOAP Adapter no SAP PI para atuar como Emissor (Sender) ou Receptor (Receiver) de Web Services."
---
# SOAP no SAP PI

**Tópico pai:** [[PI - Process Intagration]]

## O que é?
O **SOAP** (Simple Object Access Protocol) é um protocolo padrão de mercado para troca de mensagens estruturadas (em XML) baseadas em Web Services.

## SOAP Adapter no SAP PI
No contexto do SAP PI, o protocolo SOAP é manipulado principalmente através do **SOAP Adapter**. Ele possui dois papéis principais:
- **Sender (Emissor):** Quando o SAP PI expõe um serviço para que um sistema externo o consuma (O SAP PI funciona como provedor do Web Service).
- **Receiver (Receptor):** Quando o SAP PI consome um Web Service disponibilizado por um sistema externo.

## Entendendo a Estrutura (O Envelope SOAP)

Uma mensagem SOAP nunca trafega como um texto solto ou um XML desorganizado. Ela é sempre estruturada dentro de um formato extremamente rígido e padronizado. 

Pense em uma mensagem SOAP como uma **carta física tradicional** enviada pelos correios. A estrutura é dividida nas seguintes partes:

1. **Envelope (`<soapenv:Envelope>`):** É o pacote externo propriamente dito. É a tag raiz do XML que sinaliza ao sistema que o recebe: *"Atenção, este arquivo é uma mensagem SOAP oficial"*. Absolutamente tudo precisa estar dentro dessa tag.
2. **Header (`<soapenv:Header>`):** É o cabeçalho (Opcional). Usado para enviar informações de "controle" ou infraestrutura que não fazem parte do dado de negócio. É frequentemente usado para trafegar autenticação (tokens, usuários), assinaturas digitais ou IDs de roteamento do SAP PI.
3. **Body (`<soapenv:Body>`):** É o corpo da carta. É aqui que vai o *Payload* (os dados reais que importam para o negócio, como um Cadastro de Cliente). 
   - *Nota de erro:* Se o servidor processar a mensagem e der erro, é dentro do Body que ele retorna uma tag especial chamada **`<soapenv:Fault>`** explicando o que quebrou.

### Exemplo Prático de Código

Aqui está um exemplo clássico de um Envelope SOAP de requisição (pedindo a cotação de uma ação de mercado a um Web Service):

```xml
<?xml version="1.0" encoding="utf-8"?>
<!-- 1. O ENVELOPE (O invólucro obrigatório) -->
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:web="http://www.exemplo.com/webservices">
                  
   <!-- 2. O HEADER (Controle - Ex: passando um Token de segurança) -->
   <soapenv:Header>
      <web:Autenticacao>
         <web:TokenAtivo>ABC-123456-XYZ</web:TokenAtivo>
      </web:Autenticacao>
   </soapenv:Header>
   
   <!-- 3. O BODY (O pedido real de negócio) -->
   <soapenv:Body>
      <web:ConsultarCotacaoRequest>
         <!-- O dado de negócio que queremos consultar -->
         <web:SimboloEmpresa>SAP</web:SimboloEmpresa>
      </web:ConsultarCotacaoRequest>
   </soapenv:Body>
   
</soapenv:Envelope>
```
