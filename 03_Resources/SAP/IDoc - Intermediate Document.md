---
aliases: ["Intermediate Document", "IDoc Adapter"]
tags: [sap, idoc, abap, integracao, edi]
type: "concept"
status: "draft"
summary: "Contêiner padrão de dados do SAP utilizado para trocar informações estruturadas (assíncronas) entre sistemas SAP e não-SAP."
---
# IDoc (Intermediate Document)

**Relacionado:** [[PI - Process Intagration|SAP PI]], [[PO - Process Orquestration|SAP PO]], [[Roteiro de Estudos SAP]]

## O que é o SAP IDoc?

Tecnicamente, o **IDoc (Intermediate Document)** é uma estrutura padrão de dados do sistema SAP utilizada para transferir informações corporativas em formato de arquivo texto estruturado entre o SAP e outros sistemas (sejam eles outro SAP ou sistemas legados de terceiros). Ele é o alicerce das integrações assíncronas do SAP e foi fortemente baseado nos padrões globais de mercado **EDI** (Electronic Data Interchange).

Em termos práticos, imagine o IDoc como um **Contêiner de Navio**. O SAP precisa enviar as informações de "100 Notas Fiscais" para um fornecedor. Em vez de enviar campo por campo, o SAP empacota todos esses dados de forma organizada dentro desse contêiner padrão (o IDoc). O [[PO - Process Orquestration|SAP PO]] ou [[PI - Process Intagration]] pega esse contêiner, lê as instruções do lado de fora, traduz o conteúdo para o formato que o fornecedor entende (como um XML ou JSON) e faz a entrega.

## A Estrutura de um IDoc

Assim como um contêiner tem suas documentações e a carga interna, um arquivo IDoc gerado no SAP é estritamente dividido em 3 partes físicas (que no banco de dados do SAP correspondem a tabelas específicas):

### 1. Control Record (Registro de Controle)
É a "nota de despacho" colada na porta do contêiner. Existe **apenas um** por IDoc.
- **O que faz:** Contém as informações de cabeçalho e roteamento.
- **O que guarda:** Quem é o remetente (Sender), quem é o destinatário (Receiver), qual é o tipo de mensagem (ex: `ORDERS` para pedidos de compra) e a direção (Inbound/Entrada ou Outbound/Saída).
- *Tabela no SAP: `EDIDC`*

### 2. Data Records (Registros de Dados)
É a "carga" em si, separada em caixas. Podem existir milhares de registros dentro de um único IDoc.
- **O que faz:** Armazena os dados de negócio reais estruturados em "Segmentos". Um segmento é como uma linha de uma tabela (ex: um segmento para o Cabeçalho da Nota, e vários segmentos filhos para os Itens da Nota).
- *Tabela no SAP: `EDID4`*

### 3. Status Records (Registros de Status)
É o "histórico de rastreio dos correios". 
- **O que faz:** Toda vez que o IDoc muda de estado (ex: foi criado, foi processado, deu erro no meio do caminho, foi entregue com sucesso), um novo registro de status é adicionado. Códigos entre `01` e `49` geralmente significam Outbound (Saída), e `50` a `75` significam Inbound (Entrada).
- *Tabela no SAP: `EDIDS`*

## Monitoramento (Transações Úteis)

Se o [[PIMON - Configuration and Monitoring]] é onde monitoramos a mensagem no PI/PO, dentro do ambiente ABAP (ECC ou S/4HANA), o desenvolvedor lida com os IDocs usando transações específicas:
- **WE02 / WE05:** Monitoramento e busca de IDocs (Para ver se deu erro ou sucesso).
- **WE20:** Perfis de Parceiro (*Partner Profiles* - define quem pode mandar/receber o quê).
- **WE19:** Ferramenta de testes. Permite pegar um IDoc existente, editar os valores na mão e reenviá-lo para debugar um erro.
