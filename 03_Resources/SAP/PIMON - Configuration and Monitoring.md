---
aliases: ["PIMON", "NWA", "Runtime Workbench", "Message Monitoring"]
tags: [sap, pi, po, monitoramento, troubleshooting]
type: "concept"
status: "draft"
summary: "O painel de monitoramento do SAP PI/PO utilizado pela equipe de suporte para rastrear o tráfego de mensagens, identificar falhas e monitorar adaptadores."
---
# Configuration and Monitoring (PIMON)

**Relacionado:** [[PI - Process Intagration|SAP PI]], [[PO - Process Orquestration|SAP PO]]

## O que é o Configuration and Monitoring?

O **Configuration and Monitoring Home** (também amplamente conhecido pela sua URL/transação web **PIMON** - *Process Integration Monitoring*, ou no passado como *Runtime Workbench*) é o painel web de controle e monitoramento operacional do SAP PI e SAP PO.

Enquanto o [[ESR - Enterprise Services Repository|ESR]] e o [[Integration Builder (Integration Directory)|Integration Directory]] são as ferramentas usadas pelos *desenvolvedores* para construir e publicar as integrações, o **PIMON** é a ferramenta usada diariamente pela equipe de suporte (sustentação) para garantir que a operação está saudável no ambiente de Produção.

## Para que serve na prática?

Quando um usuário da área de negócios liga para a TI reclamando: *"O fornecedor alegou que não recebeu nosso arquivo de pedido de compra!"*, é no Configuration and Monitoring que o analista entra para investigar e realizar o *troubleshooting*.

As principais áreas de atuação dessa ferramenta são:

### 1. Message Monitoring (Monitoramento de Mensagens)
É o rastreador de pacotes estilo "Correios". Aqui você pesquisa por mensagens específicas e vê a trilha de auditoria:
- A mensagem entrou no PI com sucesso?
- Ocorreu um erro durante a conversão dos dados (*Mapping Error*)?
- O PI tentou entregar para o sistema de destino, mas ele estava fora do ar (*System Fault / Timeout*)?
- **Payload:** A ferramenta permite visualizar o conteúdo real do arquivo (ex: o XML da nota fiscal) antes e depois da transformação, o que é vital para investigar erros de dados.

### 2. Communication Channel Monitor
É a tela de "Saúde dos Adaptadores". 
- Você pode ver se um canal FTP está com erro de permissão de leitura de pasta.
- Pode descobrir se um canal de saída falhou porque a senha do Web Service expirou.
- Permite que o administrador inicie e pare (Start / Stop) os canais manualmente caso um sistema parceiro entre em manutenção programada e você precise segurar as mensagens.

### 3. Component Monitor
Foca em monitorar a saúde dos próprios motores (engines) internos do SAP PI/PO. Mostra se há filas presas nas engrenagens de banco de dados ou problemas diretos no motor de execução Java (o AAE).
