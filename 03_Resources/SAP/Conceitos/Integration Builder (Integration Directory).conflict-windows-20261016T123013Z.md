---
aliases: ["Integration Directory", "ID", "Integration Builder - Configuration"]
tags: [sap, pi, po, configuracao, roteamento]
type: "concept"
status: "draft"
summary: "O ambiente de configuração do SAP PI/PO onde as estruturas do ESR ganham endereços reais através das regras de roteamento e canais de comunicação."
---
# Integration Builder (Integration Directory)

**Relacionado:** [[PI - Process Intagration|SAP PI]], [[PO - Process Orquestration|SAP PO]], [[ESR - Enterprise Services Repository|ESR]], [[SLD - System Landscape Directory|SLD]]

## O que é o Integration Builder / Integration Directory?

No dia a dia do SAP PI/PO, quando os desenvolvedores falam em **Integration Builder**, eles geralmente estão se referindo à ferramenta Java completa que engloba as parametrizações, mas focam especificamente na parte do **Integration Directory (ID)**. 

Se o [[ESR - Enterprise Services Repository|ESR]] é a "prancheta de desenho" (onde criamos o formato da mensagem) e o [[SLD - System Landscape Directory|SLD]] é a "lista telefônica" (onde guardamos os IPs e servidores físicos), o **Integration Directory (ID)** é o seu **Painel de Controle de Roteamento**.

É no Integration Directory que a interface ganha vida. É aqui que você amarra as peças: pega o molde desenhado no ESR, cruza com o endereço listado no SLD e diz para o SAP PI exatamente o que fazer quando uma mensagem chegar.

## O que configuramos no Integration Directory?

No ID, o foco é 100% no roteamento (*Routing*) e na conectividade de ponta a ponta. As principais configurações clássicas (*Configuration Objects*) criadas aqui são:

1. **Communication Channels (Canais de Comunicação):** A peça mais famosa do ID. É onde configuramos os Adaptadores para conexão. 
   - *Exemplo:* Um canal *Sender* (Emissor) com adaptador FTP dizendo *"Leia o arquivo TXT desta pasta"*, e um canal *Receiver* (Receptor) com adaptador [[SOAP - Simple Object Access Protocol|SOAP]] dizendo *"Entregue essa mensagem no web service Z usando o usuário 'Admin'"*.
2. **Sender Agreement:** Acordo que liga o sistema de origem ao Canal de Comunicação Emissor.
3. **Receiver Determination:** A regra de roteamento lógica. *"Se a mensagem vier do sistema de RH, ela deve ir para a Folha de Pagamento. (Mas se o campo 'País' for EUA, mande também para o sistema Global)"*.
4. **Interface Determination:** Define qual Mapeamento (criado lá no ESR) deve ser usado para traduzir a mensagem nesta rota específica.
5. **Receiver Agreement:** Acordo que liga o sistema de destino ao Canal de Comunicação Receptor.

*(Nota importante: Nas versões mais modernas do PI/PO (no ambiente Single Stack / AEX), essas 4 etapas de regras foram unificadas em um único e poderoso objeto de tela única, chamado **Integrated Configuration Object - ICO**, facilitando muito a vida do desenvolvedor).*
