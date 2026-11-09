---
tipo: clippings
title: "Exploring Released APIs in SAP S/4HANA Cloud"
source: "https://learning.sap.com/courses/practicing-clean-core-extensibility-for-sap-s-4hana-cloud/exploring-released-apis-in-sap-s-4hana-cloud_e80220ec-00e5-490d-80ba-00edab846d29"
created: 2026-11-03
tags:
  - sap
  - abap
  - abap-cloud
  - released-apis
  - local-apis
  - remote-apis
  - clean-core
---
**Roteiro de Estudos Relacionado:** [[Roteiro de Estudos SAP]]

# Objetivos de Aprendizado

Após concluir esta lição, você será capaz de:
- Diferenciar as APIs liberadas da **camada de plataforma ABAP (*ABAP Platform APIs*)** das APIs de negócio da **camada de produto (*SAP S/4HANA Cloud Business APIs*)**.
- Explicar as regras de acessibilidade e fronteiras de runtime entre extensões **On-Stack** (Key User e Developer) e extensões **Side-by-Side** (SAP BTP).
- Compreender por que o SAP BTP, ABAP Environment não possui acesso direto a APIs locais do SAP S/4HANA e depende obrigatoriamente de **Remote APIs**.

---

## 1. O Conceito de Extensões à Prova de Futuro (Future-Proof Extensions)

O objetivo central do modelo de extensibilidade do **SAP S/4HANA Cloud** é garantir que qualquer customização desenvolvida seja **à prova de futuro (*Future-Proof*)**. Isso é viabilizado por uma política rigorosa:
- Extensões só têm permissão para consumir uma lista cuidadosamente homologada de artefatos com o status formal de **Public Released Interfaces**.
- A SAP estabelece um contrato formal de estabilidade (*Stability Contract*): uma vez que um objeto é liberado para uso em nuvem, sua assinatura pública, parâmetros de entrada/saída e comportamento não podem sofrer alterações incompatíveis (*no breaking changes*) nas versões subsequentes.

![[ABAP_Public_Cloud_APIs_001.png]]

---

## 2. Camadas de Interfaces Liberadas: Plataforma vs. Produto

As interfaces liberadas originam-se em duas camadas arquiteturais distintas do ecossistema SAP:

### 1. Camada da Plataforma ABAP (Local ABAP Platform APIs)
- **Origem:** Serviços e recursos técnicos fornecidos pela plataforma técnica subjacente (o runtime ABAP).
- **Escopo de Disponibilidade:** Como o **SAP S/4HANA Cloud, ABAP Environment** e o **SAP BTP, ABAP Environment** compartilham a mesma linha de código da plataforma (*Codeline*), essas APIs técnicas estão presentes em ambos os ambientes de forma sincronizada.
- **Exemplos:**
  - Elementos de dados técnicos e domínios do sistema.
  - Classes utilitárias da biblioteca padrão (ex: manipulação de strings, serialização de JSON com XCO, parsing XML, conversão de fusos horários).
  - Objetos e métodos de verificação de autorização técnica.
  - Serviços de envio de e-mails (`CL_BCS_MAIL_MESSAGE`) e log de aplicação (`CL_BALI_LOG`).

### 2. Camada de Aplicação SAP S/4HANA Cloud (Business APIs)
- **Origem:** Artefatos funcionais e de domínio de negócio específicos dos módulos do SAP S/4HANA (Finanças, Vendas, Compras, Manufatura, Controladoria).
- **Subdivisão por Tipo de Consumo:**
  1. **Public Local APIs & Public Extension Points:**
     - Consumíveis **exclusivamente de forma local (On-Stack)** dentro do próprio SAP S/4HANA Cloud.
     - Utilizadas por **Key User Extensions** (no Fiori) e por **Developer Extensions** (no Eclipse ADT).
     - Exemplos: CDS Interface Views (`I_SalesOrder`, `I_Customer`, `I_JournalEntry`), Business Object Interfaces do RAP e Business Add-Ins (BAdIs).
  2. **Public Remote APIs:**
     - Endpoints de comunicação externa baseados em protocolos web abertos (**OData v2/v4** e **SOAP**).
     - Projetados para consumo por aplicações externas e, fundamentalmente, por **Side-by-Side Extensions** em execução no SAP BTP.

---

## 3. A Regra de Isolamento de Runtime entre S/4HANA e BTP

Uma das dúvidas mais comuns de desenvolvedores iniciantes diz respeito ao acesso do **SAP BTP, ABAP Environment** aos objetos do SAP S/4HANA Cloud:

> [!IMPORTANT] Fronteira de Runtime entre BTP e S/4HANA
> O **SAP BTP, ABAP Environment** possui as mesmas APIs técnicas da plataforma ABAP, mas **NÃO possui acesso direto às APIs locais de negócio do SAP S/4HANA Cloud**.
> 
> Um programa executado no SAP BTP **não pode** executar comandos SQL diretos sobre a CDS View `I_SalesOrder` localizada no banco de dados do S/4HANA. Para acessar ou manipular ordens de venda a partir do BTP, o desenvolvedor é obrigado a consumir a **Remote API** correspondente (ex: API OData `/sap/opu/odata4/sap/api_salesorder/srvd_a2x/sap/salesorder/0001/`).

Essa separação estrita garante que a plataforma na nuvem permaneça completamente desacoplada do banco de dados físico do ERP, prevenindo bloqueios de tabela, contenção de memória e dependências de runtime indesejadas.

---

## 4. Matriz de Acessibilidade das APIs por Tipo de Extensão

| Tipo de Interface Liberada | Key User Extensibility (On-Stack) | Developer Extensibility (On-Stack) | Side-by-Side Extensibility (SAP BTP) |
| :--- | :---: | :---: | :---: |
| **Local Platform APIs** (Técnicas) | Acesso Indireto (Sandbox) | Sim (Acesso Direto no ADT) | Sim (Acesso Direto no ADT) |
| **Public Local APIs** (CDS Views `I_*`) | Sim (Custom CDS Views / Logic) | Sim (Acesso Direto via SQL no ADT) | **Não** (Acesso bloqueado por fronteira física) |
| **Public Extension Points** (BAdIs, RAP) | Sim (Custom Logic App) | Sim (Implementações no ADT) | **Não** (Extensões locais do S/4HANA) |
| **Public Remote APIs** (OData, SOAP) | N/A (Consumo interno) | Sim (Consumo via Web Service / Destination) | **Sim (Mecanismo primário de integração)** |

---

## Resumo da Lição

- A garantia de **Clean Core** exige o uso exclusivo de **Public Released Interfaces**, divididas em contratos de plataforma (*ABAP Platform APIs*) e contratos funcionais de produto (*SAP S/4HANA Cloud APIs*).
- As **Local APIs** e **Extension Points** (CDS Views de interface e BAdIs) só podem ser consumidas localmente (**On-Stack**) no SAP S/4HANA Cloud.
- Extensões **Side-by-Side** rodando na **SAP BTP** não têm acesso direto às tabelas ou CDS Views locais do SAP S/4HANA e integram-se exclusivamente por meio de **Remote APIs** (OData/SOAP) e eventos corporativos.
