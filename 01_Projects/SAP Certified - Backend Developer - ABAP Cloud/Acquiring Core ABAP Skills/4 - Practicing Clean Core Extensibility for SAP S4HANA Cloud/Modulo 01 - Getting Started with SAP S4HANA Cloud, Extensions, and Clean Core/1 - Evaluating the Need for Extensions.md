---
tipo: clippings
title: "Evaluating the Need for Extensions"
source: "https://learning.sap.com/courses/practicing-clean-core-extensibility-for-sap-s-4hana-cloud/evaluating-the-need-for-extensions_aaae6788-b141-45d3-9d3b-3ead49dba796"
created: 2026-11-03
tags:
  - sap
  - abap
  - abap-cloud
  - clean-core
  - extensibility
  - software-scope
  - goldilocks-approach
---
**Roteiro de Estudos Relacionado:** [[Roteiro de Estudos SAP]]

# Objetivos de Aprendizado

Após concluir esta lição, você será capaz de:
- Descrever o que é uma extensão de software e por que ela é necessária (*Describe what a software extension is and why they are needed*).

---

## 1. O que é uma Extensão de Software? (*What Is a Software Extension?*)

Iniciamos a discussão sobre extensões examinando o próprio termo **extensão** (*extension*):
- O que é uma extensão?
- O que exatamente estamos estendendo?
- E o mais importante: **por que estamos estendendo?**

Todo software é projetado com um **escopo** (*scope*) em mente. Esse escopo define duas dimensões essenciais:
1. **O resultado (*outcome*) entregue ao cliente:** O objetivo de negócio que o software cumpre.
2. **Como o software fornece esse resultado:** A mecânica funcional e técnica dos processos.

Do ponto de vista do cliente corporativo, é o cumprimento desses resultados práticos que gera valor tangível. Para um fornecedor de software de grande porte como a SAP, o escopo é o próprio alicerce da proposta de valor comercial e uma parte crítica do processo de design de arquitetura de software.

![[Extensions_001.png]]

Sem dúvida, uma das maiores vantagens históricas do **SAP ERP** sempre foi a amplitude de seu escopo:
- Entregar um produto concebido para cobrir praticamente todos os processos de negócio nas áreas de **Logística**, **Finanças** e **Recursos Humanos** é uma tarefa monumental.
- Some a isso o fato de que a base de clientes da SAP abrange mais de **30 indústrias diferentes** (ex: bancária, varejo, manufatura, óleo e gás, setor público e defesa). Cada indústria possui particularidades exclusivas (por exemplo, bancos executam aquisições de maneira completamente distinta de uma entidade governamental ou militar) — e mesmo dentro de uma mesma indústria, duas empresas concorrentes desenham seus processos com diferenciais competitivos próprios.

Esse desafio de escopo nunca foi evitado pela SAP; pelo contrário, foi abraçado com grande entusiasmo.

---

## 2. A Necessidade de Flexibilidade (*The Need for Flexibility*)

Embora a amplitude do escopo entregue seja um dos fatores primordiais para a adoção de soluções SAP, existe outro elemento tão valioso quanto: a **flexibilidade** (*flexibility*). Ou seja, a capacidade de o cliente ajustar o escopo padrão entregue para acomodar suas necessidades exclusivas de negócio.

Surgiu então o grande dilema de arquitetura: **Como oferecer um escopo gigantesco pronto para uso e, ao mesmo tempo, fornecer flexibilidade para customizá-lo sem quebrar a plataforma?**

Para resolver isso, a SAP analisou diferentes cenários no espectro de design:

### Abordagem A: Código Congelado (*Frozen Code*)
- **Conceito:** O fornecedor entrega o sistema e, após a instalação e entrada em produção (*Go-Live*), o código-fonte fica "congelado" e bloqueado.
- **Vantagem:** Upgrades, patches e manutenções técnicas de TI seriam triviais e indolores. A equipe de TI simplesmente aplicaria a atualização, rodaria um teste rápido e tudo funcionaria perfeitamente.
- **Problema:** Os usuários finais e os donos de processo de negócio (*process owners*) rejeitariam o produto, pois não teriam nenhuma capacidade de adaptar o software à realidade dinâmica da empresa. Essa abordagem foi completamente descartada.

### Abordagem B: Código como Sugestão (*Free-for-All*)
- **Conceito:** O sistema é entregue com um repositório básico de código, mas esse código é tratado meramente como uma "sugestão". Modificações livres, deleções completas e alterações arbitrárias no código-fonte padrão seriam permitidas.
- **Vantagem:** Máxima liberdade inicial para o desenvolvedor local alterar qualquer linha.
- **Problema:** Um pesadelo catastrófico de governança. A aplicação de uma simples correção de bug (*Note* ou *patch*) demoraria meses em vez de minutos; um upgrade de versão poderia demorar anos para ajustar o código modificado. Os custos financeiros e os custos de oportunidade por imobilidade do sistema seriam astronômicos. Essa abordagem também foi descartada.

### Abordagem C: O Equilíbrio "Cachinhos Dourados" (*The Goldilocks Approach*)
A SAP buscou o ponto de equilíbrio perfeito entre três grupos de interesse com prioridades distintas:

| Grupo de Interesse | Necessidade Primordial |
| :--- | :--- |
| **Usuários Finais (*End Users*)** | Querem um software intuitivo, simples de operar e com experiência de usuário (*User Experience - UX*) consistente. |
| **Stakeholders e Donos de Processo (*Business Stakeholders*)** | Querem estabilidade operacional para o negócio, mas exigem capacidade de customizar os processos para refletir seu diferencial competitivo. |
| **Equipe de TI (*IT Department*)** | Precisa instalar, manter e operar o sistema de maneira sustentável, com custos de manutenção e upgrades controlados (*Total Cost of Ownership - TCO*). |

---

## 3. O Nascimento dos Ajustes de Código do Cliente (*Customer-Initiated Code Adjustments*)

Esse equilíbrio gerou a arquitetura de **ajustes de código iniciados pelo cliente**:
- O sistema é implantado com funcionalidade padrão de fábrica fundamentada nas melhores práticas de mercado (*SAP Best Practices*).
- Paralelamente, fornece mecanismos claros, formais e controlados para que o cliente ajuste o comportamento dos processos sem desestabilizar o núcleo do sistema.

Essa abordagem — hoje considerada padrão — foi uma inovação revolucionária quando introduzida com o **SAP R/3** nos anos 1990 e tornou-se a mola propulsora do sucesso estrondoso do ecossistema SAP no mundo corporativo.
