---
title: "Introdução ao Modelo de Programação (RAP)"
source: "https://learning.sap.com/courses/basic-abap-programming/introducing-the-abap-restful-application-programming-model-rap-_e86bbfde-50be-4c7b-8716-53bacc94c5a0"
author:
published:
created: 2026-10-21
description: "Após concluir esta lição, você será capaz de: Descrever o processo de desenvolvimento de um serviço OData com o ABAP RESTful Application Programming Model (RAP)."
tags:
  - "clippings"
  - "sap"
  - "abap"
  - "abap-cloud"
  - "rap"
---
**Roteiro de Estudos Relacionado:** [[Roteiro de Estudos SAP]]

## Objetivo

Após concluir esta lição, você será capaz de descrever o processo de desenvolvimento de um serviço OData utilizando o [[RAP - ABAP RESTful Application Programming Model|ABAP RESTful Application Programming Model (RAP)]].

---

## Visão Geral

O **ABAP RESTful Application Programming Model (RAP)** é a arquitetura moderna padrão da SAP para desenvolver aplicações e serviços de negócio otimizados para SAP HANA, perfeitamente integrados ao padrão [[ABAP Cloud|Clean Core]] no SAP S/4HANA e SAP BTP.

Nesta unidade, você aprenderá as etapas sequenciais para construir um serviço [[OData - Open Data Protocol|OData]] funcional do início ao fim:

1. **Camada de Dados (*Data Model*):** Definição da tabela transparente no banco de dados e criação de CDS View Entities para modelagem estrutural.
2. **Camada de Comportamento (*Behavior*):** Criação da Definição de Comportamento (*Behavior Definition* - BDEF) para habilitar operações padrão (`create`, `update`, `delete`) e regras transacionais.
3. **Camada de Projeção (*Projection Layer*):** Criação da visão de projeção voltada ao consumo específico da interface com o usuário (*UI*).
4. **Serviços de Negócio (*Business Services*):**
   - **Service Definition:** Define quais entidades e operações do modelo serão expostas externamente.
   - **Service Binding:** Publica o serviço definindo o protocolo de comunicação (por exemplo, OData V4 - UI).
5. **Pré-visualização da Aplicação:** Teste interativo do serviço gerado por meio do *SAP Fiori Elements Preview* diretamente no Eclipse ADT.

> [!NOTE]
> Assista ao vídeo oficial da SAP abaixo para acompanhar a visão geral introdutória sobre o que você construirá e praticará ao longo desta unidade.

### Vídeo de Demonstração

<iframe 
    src="https://cdnapisec.kaltura.com/p/1921661/embedPlaykitJs/uiconf_id/50355372?iframeembed=true&entry_id=1_hb9c5hob" 
    width="100%" 
    height="400" 
    allowfullscreen 
    frameborder="0">
</iframe>

---

