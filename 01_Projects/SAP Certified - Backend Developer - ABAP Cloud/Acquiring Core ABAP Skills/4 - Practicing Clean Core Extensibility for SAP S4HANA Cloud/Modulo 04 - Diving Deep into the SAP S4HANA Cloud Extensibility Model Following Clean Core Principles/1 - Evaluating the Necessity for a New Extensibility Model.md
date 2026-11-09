---
tipo: clippings
title: "Evaluating the Necessity for a New Extensibility Model"
source: "https://learning.sap.com/courses/practicing-clean-core-extensibility-for-sap-s-4hana-cloud/evaluating-the-necessity-for-a-new-extensibility-model_d0073ae1-b57d-4c2e-9782-9f944369b933"
created: 2026-11-03
tags:
  - sap
  - abap
  - abap-cloud
  - clean-core
  - extensibility
  - s4hana-cloud
---
**Roteiro de Estudos Relacionado:** [[Roteiro de Estudos SAP]]

# Objetivos de Aprendizado

Após concluir esta lição, você será capaz de:
- Avaliar o modelo clássico de extensibilidade (*Classic Extensibility*) e os desafios técnicos que ele impõe no ambiente em nuvem.
- Compreender por que a atualização contínua e automatizada de software no **SAP S/4HANA Cloud** exige a superação de modificações legadas.
- Explicar a necessidade de um novo modelo de extensibilidade estruturado para preservar o **Clean Core** sem abrir mão da diferenciação competitiva do negócio.

---

## 1. O Conflito Entre a Extensibilidade Clássica e o Paradigma Cloud Native

No modelo tradicional On-Premise (como no SAP ECC e nas primeiras versões do SAP S/4HANA), as atualizações de versão de software (*Upgrades*) eram projetos corporativos gigantescos, com duração de meses ou até anos. Nesses projetos, centenas de horas de consultoria eram dedicadas a testes manuais de regressão e ajustes de código (`SPDD`/`SPAU`) para corrigir rotinas customizadas (*Z/Y*) que haviam quebrado após a atualização da base SAP.

Com o **SAP S/4HANA Cloud**, construído desde a base em conformidade com os princípios da arquitetura **Cloud Native**, a dinâmica de ciclo de vida do software mudou radicalmente:
- **Atualizações Contínuas e Simultâneas:** As correções e atualizações de versão (*Release Updates*) são distribuídas pela SAP para todos os clientes de forma automatizada e simultânea.
- **Inexistência de Projetos de Upgrade Tradicionais:** O cliente não possui a opção de "congelar" a versão por anos para acomodar correções manuais de código legado.

![[Extensibility_Model_001.png]]

---

## 2. A Necessidade Contínua de Extensibilidade

Embora as atualizações contínuas sejam essenciais para a segurança, escalabilidade e inovação rápida em nuvem, a capacidade de estender o ERP continua sendo um requisito indispensável:
- **Diferenciação Competitiva:** Processos de negócios padrão cobrem as melhores práticas de mercado (*SAP Best Practices*), mas empresas líderes necessitam de regras de precificação customizadas, integrações proprietárias e fluxos de aprovação específicos para sustentar sua vantagem competitiva.
- **Ecossistema de Parceiros (ISVs):** Parceiros e integradores SAP precisam enriquecer o ERP com soluções verticais e funcionais sob medida para diferentes segmentos industriais.

Portanto, o desafio central não é "eliminar customizações", mas sim **mudar a forma como as customizações são arquitetadas**.

---

## 3. O Surgimento do SAP S/4HANA Cloud Extensibility Model

As técnicas da **Extensibilidade Clássica** (como modificações diretas no código padrão da SAP, *User Exits*, *Customer Exits*, *Implicit Enhancements* e leituras diretas de tabelas do banco de dados) geram acoplamento rígido com a infraestrutura interna da SAP, tornando as atualizações automáticas impossíveis.

Para resolver esse dilema entre **estabilidade para upgrades contínuos** e **flexibilidade para inovação customizada**, a SAP projetou o **SAP S/4HANA Cloud Extensibility Model**:
- Cria uma barreira clara e auditável entre o código padrão da SAP e o código do cliente.
- Permite que extensões sejam desenvolvidas com alta eficiência e segurança, garantindo que qualquer upgrade seja executado de maneira suave e transparente (*zero disruption*).
- Viabiliza a manutenção contínua de um **Clean Core**.

| Dimensão | Extensibilidade Clássica (Legado) | Novo Modelo de Extensibilidade (Clean Core) |
| :--- | :--- | :--- |
| **Ponto de Injeção** | Modificações diretas, exits clássicos, tabelas internas | Pontos de extensão estáveis (BAdIs liberados, RAP) |
| **Acesso a Dados** | Acesso direto via SQL a tabelas físicas (ex: `T001`, `VBAK`) | Apenas CDS Views liberadas com contrato de estabilidade |
| **Ferramenta de Criação** | SAP GUI clássico (`SE38`, `SE80`, `CMOD`) | SAP Fiori (Key User) e Eclipse ADT (Developer) |
| **Impacto no Upgrade** | Alto esforço de remediação (`SPAU`/`SPDD`), quebras frequentes | **Zero esforço no upgrade:** contratos garantidos pela SAP |

---

## Resumo da Lição

- A computação em nuvem exige entregas contínuas e simultâneas de software pela SAP, incompatíveis com a extensibilidade clássica baseada em modificações e acoplamento rígido.
- A extensibilidade é vital para a competitividade dos clientes e para o ecossistema de soluções parceiras.
- O **SAP S/4HANA Cloud Extensibility Model** é o framework oficial que viabiliza o desenvolvimento de customizações avançadas sem comprometer a estabilidade do sistema e assegurando a manutenção de um **Clean Core**.
