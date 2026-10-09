---
aliases: ["Enterprise Services Repository", "ESR"]
tags: [sap, pi, po, desenvolvimento, mapping]
type: "concept"
status: "draft"
summary: "O ambiente de design do SAP PI/PO onde são desenhadas as estruturas de dados e as lógicas de transformação (mappings) das mensagens, independente da origem e destino."
---
# ESR - Enterprise Services Repository

**Relacionado:** [[PI - Process Intagration|SAP PI]], [[PO - Process Orquestration|SAP PO]], [[SLD - System Landscape Directory|SLD]]

## O que é o ESR?

O **Enterprise Services Repository (ESR)** é o "Estúdio de Design" ou a "Prancheta do Arquiteto" dentro da arquitetura do SAP PI/PO. 

A regra de ouro para entender o ESR é: **no ESR, nós NÃO lidamos com roteamento (origens e destinos físicos).** Nele, você não aponta para IPs nem diz que o RH está mandando algo para o Financeiro. Nele, nós projetamos apenas *como* a mensagem deve ser estruturada e *como* os dados devem ser traduzidos de um formato para outro. O foco é estritamente no formato do arquivo e nas regras de negócio da tradução.

### A Analogia do Molde
O desenvolvimento no ESR é como projetar um "adaptador de tomada" (recebe 3 pinos redondos de um lado e transforma em 2 pinos chatos do outro). Você desenha a regra da transformação (o mapeamento), mas o seu projeto não diz em qual casa o adaptador será ligado. *(Dizer onde o adaptador será usado e conectá-lo na parede é o trabalho feito no Integration Directory - ID).*

## O que o desenvolvedor cria no ESR?

Através do *Enterprise Services Builder*, o desenvolvedor constrói 4 peças essenciais que compõem o design de uma interface:

1. **Data Types (Tipos de Dados):** As menores estruturas. É onde são criados os campos individuais (ex: criar o campo `Primeiro_Nome`, `Ultimo_Nome` e `Data_Nascimento`).
2. **Message Types (Tipos de Mensagem):** O agrupamento dos Data Types para formar a estrutura completa (o "envelope") da mensagem que irá trafegar.
3. **Service Interfaces (Interfaces de Serviço):** O "contrato" da integração. Define a direção da mensagem (Entrada/Inbound ou Saída/Outbound) e o modo de operação (Síncrono ou Assíncrono).
4. **Message Mappings (Mapeamento de Mensagens):** O coração da transformação. É a ferramenta gráfica (ou feita via Java/XSLT) onde o desenvolvedor liga os campos do *Message Type de Origem* aos campos do *Message Type de Destino*, aplicando regras (ex: uma lógica dizendo que `Primeiro_Nome` + `Ultimo_Nome` devem ser enviados juntos para o campo `NomeCompleto` no destino).
