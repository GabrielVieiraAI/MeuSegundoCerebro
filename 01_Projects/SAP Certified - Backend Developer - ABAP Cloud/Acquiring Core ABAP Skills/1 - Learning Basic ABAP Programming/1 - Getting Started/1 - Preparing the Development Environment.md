---
title: Preparando o Ambiente de Desenvolvimento
source: https://learning.sap.com/courses/basic-abap-programming/preparing-the-development-environment_bc84941b-b4e6-4a6a-9b71-bb5b80e4a4ce
created: 2026-10-16
tags:
  - sap
  - abap
  - abap-cloud
  - btp
---
**Roteiro de Estudos Relacionado:** [[Roteiro de Estudos SAP]]
# Objetivo
Após concluir esta lição, você será capaz de criar um projeto **ABAP Cloud**.

---
## Projeto ABAP Cloud
Para desenvolver aplicações ABAP para o SAP BTP, você precisa primeiro instalar e preparar o ambiente de desenvolvimento Eclipse. Assista ao vídeo da lição para aprender o passo a passo.
### Diferentes Tipos de Projetos ABAP

![[01_-_SAP_BTP_ABAP_003.png]]

O Eclipse, como ambiente de desenvolvimento, não é incorporado diretamente dentro do sistema ABAP. Em vez disso, você precisa se conectar a cada sistema ABAP no qual deseja trabalhar, e cada conexão é representada no Eclipse por um **projeto**.

Existem dois tipos de projetos no **ADT (ABAP Development Tools)**:
- **ABAP Projects (*Projetos ABAP*)**: utilizados para se conectar a um sistema ABAP *on-premise* ou ao SAP S/4HANA Private Cloud.
- **ABAP Cloud Projects (*Projetos ABAP Cloud*)**: utilizados para se conectar ao ambiente SAP BTP ABAP ou ao SAP S/4HANA Public Cloud.

> [!NOTE]
> No decorrer deste curso, abordaremos exclusivamente como acessar e trabalhar em um sistema em nuvem (*Cloud*).

---
### Localizando o Ambiente ABAP

![[01_-_SAP_BTP_ABAP_004.png]]

A plataforma **SAP Business Technology Platform (SAP BTP)** é a Plataforma como Serviço (*Platform as a Service - PaaS*) da SAP. Para acessá-la, você precisa criar uma **Conta Global (*Global Account*)**. Existem diversos modelos de assinatura disponíveis, dependendo se você precisa operar ambientes produtivos de grande escala ou apenas um ambiente de usuário individual para seu desenvolvimento profissional contínuo.

Dentro de uma Conta Global, existem uma ou mais **Subcontas (*Subaccounts*)**. Cada subconta pode ser configurada de forma independente, permitindo que uma mesma empresa gerencie diferentes plataformas e soluções enquanto centraliza sua assinatura sob uma única conta global.

Dentro da subconta, você provisiona um ambiente de execução (*runtime*), como **Cloud Foundry** ou **Kyma**. Uma vez configurado esse runtime, é possível instanciar um ambiente ABAP (*ABAP instance*).

> [!NOTE]
> Neste curso, utilizamos uma instância ABAP provisionada no **SAP Business Technology Platform (SAP BTP)**. No entanto, este conteúdo também é aplicável a outras implementações ABAP modernas, como sistemas *on-premise* SAP S/4HANA ou SAP S/4HANA Cloud.

---
## Como Criar um Projeto ABAP Cloud

Demonstração prática: [Iniciar Demonstração (Start Demo)](https://learnsap.enable-now.cloud.sap/pub/mmcp/index.html?show=project!PR_45E9553478ED05A1:uebung)
