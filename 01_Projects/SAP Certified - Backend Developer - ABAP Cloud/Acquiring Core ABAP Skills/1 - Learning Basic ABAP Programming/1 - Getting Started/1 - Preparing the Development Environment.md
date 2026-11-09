---
title: "Preparando o Ambiente de Desenvolvimento"
source: "https://learning.sap.com/courses/basic-abap-programming/preparing-the-development-environment_bc84941b-b4e6-4a6a-9b71-bb5b80e4a4ce"
created: 2026-10-16
tags:
  - sap
  - abap
  - abap-cloud
  - btp
  - adt
---
**Roteiro de Estudos Relacionado:** [[Roteiro de Estudos SAP]]

## Objetivo

Após concluir esta lição, você será capaz de criar um projeto **[[ABAP Cloud]]** utilizando o **ABAP Development Tools (ADT)** no Eclipse.

---

## Projeto ABAP Cloud

Para desenvolver aplicações ABAP para o [[BTP - Business Technology Platform|SAP BTP]], você precisa primeiro instalar e preparar o ambiente de desenvolvimento Eclipse com o plugin ADT (*ABAP Development Tools*).

<iframe 
    src="https://cdnapisec.kaltura.com/p/1921661/embedPlaykitJs/uiconf_id/50355372?iframeembed=true&entry_id=1_nrpijxj2" 
    width="100%" 
    height="400" 
    allowfullscreen 
    frameborder="0">
</iframe>

### Diferentes Tipos de Projetos ABAP

![[01_-_SAP_BTP_ABAP_003.png]]

O Eclipse, como ambiente de desenvolvimento, não é incorporado diretamente dentro do sistema ABAP. Em vez disso, você precisa se conectar a cada sistema ABAP no qual deseja trabalhar, e cada conexão é representada no Eclipse por um **projeto**.

Existem dois tipos de projetos no **ADT (ABAP Development Tools)**:

| Tipo de Projeto | Finalidade e Ambiente de Conexão |
| :--- | :--- |
| **ABAP Projects (*Projetos ABAP*)** | Utilizados para se conectar a sistemas ABAP *On-Premise* tradicionais ou ao SAP S/4HANA Private Cloud. |
| **ABAP Cloud Projects (*Projetos ABAP Cloud*)** | Utilizados para se conectar ao ambiente [[BTP - Business Technology Platform\|SAP BTP ABAP Environment]] ou ao SAP S/4HANA Public Cloud (Clean Core). |

> [!NOTE]
> No decorrer deste curso, abordaremos exclusivamente como acessar e trabalhar em um sistema em nuvem (*Cloud*).

---

### Localizando o Ambiente ABAP

![[01_-_SAP_BTP_ABAP_004.png]]

A plataforma **[[BTP - Business Technology Platform|SAP Business Technology Platform (SAP BTP)]]** é a Plataforma como Serviço (*Platform as a Service - PaaS*) da SAP. Para acessá-la, você precisa criar uma **Conta Global (*Global Account*)**. Existem diversos modelos de assinatura disponíveis, desde ambientes corporativos produtivos até modelos de avaliação (*Trial / Free Tier*) para capacitação e testes.

- **Contas Globais e Subcontas:** Dentro de uma Conta Global, existem uma ou mais **Subcontas (*Subaccounts*)**. Cada subconta pode ser configurada de forma independente, permitindo que uma mesma empresa gerencie diferentes plataformas e soluções enquanto centraliza sua governança e assinatura sob uma única conta global.
- **Runtimes e Instâncias ABAP:** Dentro da subconta, você provisiona um ambiente de execução (*runtime*), como **Cloud Foundry** ou **Kyma**. Uma vez configurado esse runtime, é possível instanciar um ambiente ABAP (*ABAP instance*).

> [!NOTE]
> Neste curso, utilizamos uma instância ABAP provisionada no **SAP Business Technology Platform (SAP BTP)**. No entanto, este conteúdo também é aplicável a outras implementações ABAP modernas, como sistemas *on-premise* SAP S/4HANA ou SAP S/4HANA Cloud.

---

## Como Criar um Projeto ABAP Cloud

Demonstração prática: [Iniciar Demonstração (Start Demo)](https://learnsap.enable-now.cloud.sap/pub/mmcp/index.html?show=project!PR_45E9553478ED05A1:uebung)

---

