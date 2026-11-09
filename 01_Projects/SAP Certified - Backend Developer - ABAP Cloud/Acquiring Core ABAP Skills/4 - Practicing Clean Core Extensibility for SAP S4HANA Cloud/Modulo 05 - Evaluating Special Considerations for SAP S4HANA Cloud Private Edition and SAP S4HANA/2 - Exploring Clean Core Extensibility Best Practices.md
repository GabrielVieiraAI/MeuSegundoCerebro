---
tipo: clippings
title: "Exploring Clean Core Extensibility Best Practices"
source: "https://learning.sap.com/courses/practicing-clean-core-extensibility-for-sap-s-4hana-cloud/explaining-extensibility-model-best-practices_e290f382-800e-40ef-a203-85a13115f487"
created: 2026-11-03
tags:
  - sap
  - abap
  - clean-core
  - 3-tier
  - clean-core-levels
  - level-a
  - level-b
  - level-c
  - level-d
  - cloudification-repository
---
**Roteiro de Estudos Relacionado:** [[Roteiro de Estudos SAP]]

# Objetivos de Aprendizado

Após concluir esta lição, você será capaz de:
- Compreender a evolução histórica do modelo de governança: a transição do modelo original de três camadas (**3-Tier Extensibility Model**, agora descontinuado) para o novo **Clean Core Level Concept**.
- Explicar os quatro níveis de qualidade e risco arquitetural (**Níveis A, B, C e D**).
- Identificar os critérios de classificação de artefatos: **Released APIs**, **Classic APIs**, **Internal Objects** e **Not Recommended Objects (noAPI)**.
- Aplicar a regra do "menor denominador comum" para avaliar a conformidade de soluções customizadas.
- Utilizar o **Cloudification Repository Viewer** para pesquisar a classificação e o ciclo de vida de objetos SAP.

---

## 1. Primeira Geração: O Modelo de 3 Camadas (3-Tier Extensibility Model - Sunset)

Originalmente, a SAP introduziu o modelo de extensibilidade baseado em 3 camadas (*3-Tier Model*) para orientar desenvolvedores na segregação de código:

![[3_Tier_Extensibility_001.png]]

- **Tier 1 (ABAP Cloud):** O caminho preferencial e seguro para upgrades. Reservado para todo novo desenvolvimento, utilizando o compilador restrito ABAP Cloud e consumindo apenas APIs liberadas pela SAP.
- **Tier 2 (Cloud API Enablement):** A "ponte" (*Wrapper*). Usada para encapsular código customizado clássico ou objetos padrão da SAP ainda não liberados, expondo uma interface estável para o Tier 1.
- **Tier 3 (Classical ABAP):** O legado tradicional. Código fortemente acoplado ao sistema e sem restrições de sintaxe, recomendado estritamente como último recurso.

> [!NOTE] Status do 3-Tier Model
> Embora o modelo de 3 camadas tenha fornecido uma base inicial valiosa, **ele foi oficialmente descontinuado (*Sunset*)** em favor de um modelo mais flexível, granular e baseado em riscos: o **Clean Core Level Concept**. Códigos e wrappers desenvolvidos sob as diretrizes do Tier 2 continuam válidos e enquadram-se perfeitamente no novo modelo.

---

## 2. Segunda Geração: O Clean Core Level Concept (Níveis A a D)

A mensagem inicial de Clean Core foi frequentemente interpretada pelo mercado como uma regra binária e inflexível: *"Ou seu código é limpo, ou ele está sujo"*. 

Na prática de grandes corporações com milhões de linhas de código acumuladas ao longo de décadas, essa visão preto no branco mostrou-se irrealista: muitas APIs clássicas (como certas BAPIs consolidadas) são altamente estáveis e nunca quebram em upgrades, mesmo não possuindo o selo oficial de liberação para nuvem.

Para oferecer um mapa de ação viável e pragmático, a SAP desenhou o **Clean Core Level Concept**, estruturado em quatro níveis de maturidade:

![[S4D426_2510_U5L2_01.png]]

```
                  QUALIDADE E ESTABILIDADE DE UPGRADE
   ▲
   │   ┌─────────────────────────────────────────────────────────────┐
   │   │  NÍVEL A: Clean Extensions baseadas em Released APIs        │ ◄── Padrão Ouro (Clean Core)
   │   ├─────────────────────────────────────────────────────────────┤
   │   │  NÍVEL B: Uso de Classic APIs (BAPIs maduras, Wrappers)     │ ◄── Baixo Risco
   │   ├─────────────────────────────────────────────────────────────┤
   │   │  NÍVEL C: Uso de Internal Objects (Changelog Monitorado)    │ ◄── Risco Gerenciável
   │   ├─────────────────────────────────────────────────────────────┤
   │   │  NÍVEL D: Not Clean Core (Modificações, noAPI, Writes)      │ ◄── Alto Risco (Remediação)
   │   └─────────────────────────────────────────────────────────────┘
   └─────────────────────────────────────────────────────────────────► DÉBITO TÉCNICO
```

---

## 3. Detalhamento dos Quatro Níveis de Clean Core

### Nível A: Clean Extensions baseadas em Released APIs
O mais alto padrão de qualidade em extensibilidade SAP.

![[S4D426_2510_U5L2_02.png]]

- **Características:** Garante soluções preparadas para o futuro com estabilidade máxima de upgrade (*Zero Disruption*).
- **Escopo Técnico:** Consome exclusivamente APIs liberadas e pontos de extensão oficiais sob contratos formais de estabilidade (**C0/C1**).
- **Ambientes:** Aplica-se tanto a extensões *Side-by-Side* no SAP BTP (Node.js/Java via CAP e ABAP Cloud) quanto a extensões *On-Stack* no SAP S/4HANA (Key User Apps e Developer Extensibility com a linguagem ABAP Cloud).
- **Alinhamento:** Representa 100% da conformidade com o SAP S/4HANA Cloud Public Edition.

### Nível B: Uso de Classic APIs
Atende a requisitos de negócio que ainda não possuem APIs liberadas equivalentes no Nível A.

![[S4D426_2510_U5L2_03.png]]

- **Características:** Utiliza artefatos do ABAP clássico amplamente estabelecidos, consolidados e recomendados por especialistas da SAP, embora desprovidos de um contrato formal de nuvem.
- **Escopo Técnico:**
  - *Wrappers* em torno de Classic APIs (por exemplo, encapsular a função `BAPI_PO_CREATE1` para ser consumida de forma limpa por uma classe moderna).
  - Implementações clássicas de relatórios utilizando `CL_GUI_ALV_GRID` em ambientes Dynpro ou Web Dynpro.
  - Artefatos desenvolvidos com a versão de linguagem ABAP "Standard", sem referenciar objetos bloqueados.
- **Segurança:** Apresenta baixo risco operacional e alta estabilidade de upgrade.

### Nível C: Uso de Internal Objects
Uso de objetos internos do sistema SAP não concebidos para consumo externo.

![[S4D426_2510_U5L2_04.png]]

- **Características:** Objetos que não foram homologados como liberados (Nível A) nem nomeados como Classic APIs maduras (Nível B). A documentação pode ser escassa e não há garantias de estabilidade a longo prazo.
- **Escopo Técnico:** Chamada direta de módulos de função internos da SAP, classes do sistema sem release ou leitura via SQL (*Read-Only*) de tabelas de banco de dados não catalogadas como APIs.
- **Ferramenta de Mitigação — Changelog for SAP Objects:** Para gerenciar o risco do Nível C, a SAP disponibiliza o *Changelog* de objetos. Ele é integrado ao **ABAP Test Cockpit (ATC)**, alertando proativamente a equipe de desenvolvimento com antecedência caso um objeto interno utilizado sofra alterações incompatíveis em versões futuras.

### Nível D: Not Clean Core (Objetos Não Recomendados)
Representa a categoria de maior risco e acúmulo severo de débito técnico.

![[S4D426_2510_U5L2_05.png]]

- **Características:** Compromete a integridade transacional, a segurança dos dados e impede a inovação contínua. **Remediação imediata é fortemente recomendada**.
- **Escopo Técnico:**
  - Modificações diretas no código-fonte padrão da SAP (`SE38`, `SE80`).
  - Utilização de *Implicit Enhancements* (injeções arbitrárias de código em rotinas padrão).
  - Operações de escrita direta não autorizada (*Direct SQL INSERT/UPDATE/DELETE*) em tabelas do núcleo SAP (ex: gravar diretamente na `BKPF`, `VBAK` ou `MARA`).
  - Consumo de objetos rotulados formalmente com o estado **`noAPI`** no Cloudification Repository.

---

## 4. A Regra do Menor Denominador Comum

> [!IMPORTANT] Como uma Extensão é Avaliada no Todo?
> Uma extensão customizada é sempre classificada pelo **nível da tecnologia mais baixa utilizada dentro dela**.
> 
> *Exemplo Prático:* Se um programa utiliza 95% de CDS Views liberadas (Nível A) e consome uma BAPI clássica madura (Nível B), mas executa uma escrita direta via SQL em uma tabela interna do sistema (Nível D), a extensão inteira é classificada como **Nível D (Not Clean Core)**.

---

## 5. Simulação Prática Oficial (SAP Enable Now)

> [!TIP] Simulação Interativa: Utilizar os Recursos de Pesquisa do Cloudification Repository Viewer
> Pratique a consulta de estados de release, contratos e identificação de objetos `noAPI` no portal oficial da SAP:
> [Acessar Exercício no SAP Enable Now](https://learnsap.enable-now.cloud.sap/wa/mmcp/index.html?show=project!PR_B21FE28DFA71A891:uebung#2)

---

## Resumo da Lição

- A SAP substituiu o modelo original de 3 camadas (**3-Tier Extensibility Model**, agora descontinuado) pelo **Clean Core Level Concept (Níveis A a D)**.
- **Nível A:** Extensões limpas sobre Released APIs (máxima estabilidade).
- **Nível B:** Uso de Classic APIs maduras e wrappers (baixo risco).
- **Nível C:** Uso de Internal Objects, auditados via ATC e monitorados pelo *Changelog for SAP Objects* (risco gerenciável).
- **Nível D:** Modificações, gravações diretas em tabelas e uso de objetos `noAPI` (alto risco / Not Clean Core).
- Toda solução é avaliada pela tecnologia de menor nível empregada.
