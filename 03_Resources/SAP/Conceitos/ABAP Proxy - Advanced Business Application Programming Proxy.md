---
aliases: ["Proxy ABAP", "SPROXY", "ABAP Proxy"]
tags: [sap, abap, integracao, pi, po]
type: "concept"
status: "draft"
summary: "Método de comunicação nativa (orientado a objetos) e de altíssima performance entre um backend SAP e o SAP PI/PO."
---
# ABAP Proxy - Advanced Business Application Programming Proxy

**Relacionado:** [[PI - Process Intagration|SAP PI]], [[PO - Process Orquestration|SAP PO]], [[ESR - Enterprise Services Repository|ESR]]

## O que é o ABAP Proxy?

O **ABAP Proxy** é o método de comunicação mais nativo e eficiente para integrar um sistema backend da SAP (como o ECC ou o S/4HANA) com o barramento de integração [[PI - Process Intagration|SAP PI]] / [[PO - Process Orquestration|SAP PO]]. 

Diferente de métodos mais antigos e genéricos baseados em arquivos, RFCs ou mesmo [[IDoc - Intermediate Document|IDocs]], o ABAP Proxy se comunica diretamente utilizando o protocolo nativo **XI Message Protocol** (ou SOAP nativo sobre HTTP). Isso significa que ele elimina a necessidade de configurar "Adaptadores" adicionais na entrada do PI, o que reduz o gargalo de rede e aumenta consideravelmente a performance da interface.

Ele é totalmente **Orientado a Objetos (OO)** e fortemente tipado. O desenvolvedor ABAP trabalha chamando classes e métodos diretamente no código, e o compilador garante que as estruturas de dados respeitem o formato correto antes mesmo de a mensagem sair do sistema.

## O Ciclo de Vida e a transação SPROXY

A mágica do ABAP Proxy está na sua forte integração (acoplamento de metadados) com o ambiente de design do PI, o [[ESR - Enterprise Services Repository|ESR]]. Funciona assim:

1. O arquiteto de integração projeta as estruturas de dados e as Interfaces lá no ESR do SAP PI.
2. O desenvolvedor entra no backend SAP, acessa a transação **`SPROXY`**, e se conecta online ao ESR.
3. O desenvolvedor encontra a Interface desenhada, clica com o botão direito e pede para gerar o Proxy.
4. O sistema ABAP **gera automaticamente** uma Classe ABAP (o Proxy em si) e todas as estruturas de DDIC (*Data Dictionary*) idênticas ao que foi feito no PI.

## Sentidos da Comunicação

- **Outbound Proxy (Saída):** O SAP é quem toma a iniciativa de enviar os dados. O programa ABAP instancia a classe Proxy gerada pela `SPROXY`, preenche os campos, e chama o método de disparo. A classe empacota os dados e os joga para o PI.
- **Inbound Proxy (Entrada):** O SAP é o receptor. O PI envia a mensagem para o SAP, o sistema desperta a classe ABAP gerada pela `SPROXY`, e o desenvolvedor escreve o código (dentro do método de implementação da classe) para processar os dados que chegaram.

## Exemplo Prático de Código (Outbound)

Veja como é limpo o código para chamar um Proxy de saída em ABAP:

```abap
DATA: lo_proxy TYPE REF TO zco_meu_proxy_saida,
      ls_input TYPE zmt_dados_cliente,
      lx_fault TYPE REF TO cx_root.

* 1. Preenche a estrutura de dados (Fortemente tipada)
ls_input-mt_dados_cliente-id_cliente = '12345'.
ls_input-mt_dados_cliente-nome = 'João da Silva'.

TRY.
    * 2. Instancia a classe proxy gerada automaticamente pela transação SPROXY
    CREATE OBJECT lo_proxy.

    * 3. Dispara o método enviando os dados para o SAP PI
    lo_proxy->execute_asynchronous( output = ls_input ).
    
    COMMIT WORK.

  CATCH cx_root INTO lx_fault.
    * Tratamento de erro caso o SAP PI esteja fora do ar, por exemplo
    WRITE: / 'Erro de comunicação no Proxy:', lx_fault->get_text( ).
ENDTRY.
```
