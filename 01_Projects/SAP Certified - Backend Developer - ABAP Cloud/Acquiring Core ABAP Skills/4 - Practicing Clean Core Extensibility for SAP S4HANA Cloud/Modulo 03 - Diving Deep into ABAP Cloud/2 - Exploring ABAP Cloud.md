---
tipo: clippings
title: "Exploring ABAP Cloud"
source: "https://learning.sap.com/courses/practicing-clean-core-extensibility-for-sap-s-4hana-cloud/exploring-the-abap-cloud-development-model_cd64db9d-409e-4f09-8ffa-3597a3cf3960"
created: 2026-11-03
tags:
  - sap
  - abap
  - abap-cloud
  - adt
  - rap
  - language-versions
  - clean-core
---
**Roteiro de Estudos Relacionado:** [[Roteiro de Estudos SAP]]

# Objetivos de Aprendizado

Após concluir esta lição, você será capaz de:
- Avaliar as características exclusivas do modelo de desenvolvimento **ABAP Cloud** (*Evaluate the distinct features of ABAP Cloud*).
- Compreender a estratégia da SAP de *"Evolução, não revolução"* no ecossistema ABAP.
- Identificar os cinco pilares arquiteturais do ABAP Cloud e suas versões de linguagem.
- Mapear a disponibilidade do ABAP Cloud entre as edições *Public*, *Private* e *On-Premise*.

---

## 1. Do ABAP Clássico ao ABAP Cloud: "Evolução, Não Revolução"

A transformação digital e a consolidação do paradigma *Cloud Native* exigiram uma reestruturação profunda da linguagem e dos modelos de programação ABAP. No entanto, a estratégia da SAP sempre foi guiada pelo princípio de **"Evolução, não revolução" (*Evolution not revolution*)**:

![[Cloud-Optimized_ABAP_001.png]]

- **Anos 1980 (SAP R/2):** O ABAP nasceu como uma linguagem de quarta geração (4GL) voltada primariamente à elaboração de relatórios (*Allgemeiner Berichts-Aufbereitungs-Prozessor*).
- **Anos 1990 (SAP R/3):** Evoluiu para uma linguagem completa de desenvolvimento procedural de transações de negócios e extensões.
- **Fim dos anos 1990:** Adicionou conceitos de Orientação a Objetos (**ABAP Objects**) de maneira retrocompatível, permitindo que códigos procedurais antigos continuassem executando enquanto novos projetos adotavam classes e interfaces.
- **Era Atual (ABAP Cloud):** Uma evolução estruturada e controlada para adequar a linguagem aos padrões de microsserviços, desacoplamento e estabilidade para upgrades exigidos pelo **Clean Core**.

---

## 2. A Evolução Tecnológica dos Últimos Dez Anos

O **ABAP Cloud** é o ápice da convergência de quatro grandes inovações introduzidas na última década:

![[Cloud-Optimized_ABAP_002.png]]

1. **ABAP Development Tools (ADT) no Eclipse (2012):** Substituição progressiva do antigo ABAP Workbench (`SE80`) por uma IDE moderna com suporte a refatoração, testes unitários automatizados e integração com Git (`abapGit`).
2. **Core Data Services - CDS (2014):** Linguagem declarativa avançada de modelagem de dados executada diretamente no banco em memória SAP HANA (*Code Pushdown*).
3. **ABAP RESTful Application Programming Model - RAP (2018):** Framework moderno para construção de serviços REST/OData e aplicações transacionais com arquitetura limpa.
4. **Linguagem ABAP for Cloud Development:** Subconjunto seguro e moderno da sintaxe ABAP que restringe comandos obsoletos e garante o uso de APIs liberadas.

Como dita a máxima, *"O todo é maior que a soma de suas partes"*: o ABAP Cloud unifica todas essas inovações em uma esteira única de engenharia de software corporativa.

---

## 3. Os Cinco Pilares do Modelo ABAP Cloud

O modelo ABAP Cloud entrega aos desenvolvedores tudo o que é necessário para construir aplicações de classe mundial:

| Pilar Arquitetural | Componentes e Tecnologias Principais |
| :--- | :--- |
| **1. Linguagem Otimizada para Nuvem** | Versão de linguagem **`ABAP for Cloud Development`**: sintaxe limpa, orientada a objetos, onde instruções arcaicas e acessos diretos não governados são bloqueados. |
| **2. Modelos de Programação Cloud Native** | **RAP (ABAP RESTful Application Programming Model)** para cenários transacionais (OLTP) e **ABAP Analytics** para cenários analíticos multidimensionais (OLAP). |
| **3. Recursos PaaS da Plataforma ABAP** | Serviços técnicos reutilizáveis embutidos: *Application Jobs*, *Change Documents*, *Number Ranges*, serviço de envio de e-mails, gerenciamento de identidades e conectividade segura. |
| **4. Recursos Integrados do SAP S/4HANA Cloud** | Acesso auditado a **APIs de Negócio Liberadas (*Released Business APIs*)**, pontos formais de extensão (**BAdIs**) e arquitetura orientada a eventos (**Business Events**). |
| **5. Ferramental Moderno de Desenvolvimento** | Uso exclusivo do **Eclipse com o plug-in ABAP Development Tools (ADT)**, garantindo análise estática de qualidade com o **ABAP Test Cockpit (ATC)**. |

---

## 4. Disponibilidade do ABAP Cloud nos Ambientes

A adoção do ABAP Cloud respeita a realidade arquitetural de cada cliente:

![[Cloud-Optimized_ABAP_003.png]]

| Ambiente de Execução | Status e Disponibilidade do ABAP Cloud |
| :--- | :--- |
| **SAP BTP, ABAP environment** | **Padrão e Única Opção:** Apenas a linguagem `ABAP for Cloud Development` é permitida. |
| **SAP S/4HANA Cloud Public Edition** | **Padrão e Única Opção:** O Clean Core é mandatório; código clássico é bloqueado. |
| **SAP S/4HANA Cloud Private Edition** | **Coexistência Híbrida:** O ABAP Cloud coexiste lado a lado com o ABAP Clássico, permitindo modernização gradual através da arquitetura de 3 camadas (*3-Tier Extensibility Model*). |
| **SAP S/4HANA (On-Premise)** | **Coexistência Híbrida:** Disponível nas versões modernas (S/4HANA 2022+), permitindo evitar nova dívida técnica. |

---

## 5. Personas de Extensibilidade e Versões da Linguagem ABAP

![[Cloud-Optimized_ABAP_004.png]]

Enquanto as ferramentas do **SAP Build** atendem aos *Citizen Developers / Builders* (cenários *Low-Code / No-Code*), o **ABAP Cloud é voltado especificamente para a persona do desenvolvedor profissional (*Pro-Code Developer*)**.

Para garantir governança absoluta, todo objeto de desenvolvimento criado no repositório recebe explicitamente uma **Versão de Linguagem ABAP (*ABAP Language Version*)**:

![[Cloud-Optimized_ABAP_005.png]]

1. **Standard ABAP (Classic ABAP):** Sintaxe legada completa sem restrições. Permite chamadas a qualquer tabela do banco e comandos obsoletos (disponível apenas no Private Edition e On-Premise).
2. **ABAP for Cloud Development (ABAP Cloud):** Sintaxe restrita e protegida para o modelo moderno de nuvem. Comandos procedurais antigos (como `TABLES`, `CALL TRANSACTION` direto ou Dynpros) são estritamente proibidos pelo compilador.
3. **ABAP for Key Users:** Subconjunto simplificado e com sandbox de segurança estrito, utilizado por usuários-chave para escrever validações e pequenas lógicas de negócio em apps Fiori de Key User Extensibility.

---

## 6. O Papel Central do ABAP Development Tools (ADT)

![[Cloud-Optimized_ABAP_006.png]]

No modelo ABAP Cloud, a transação clássica `SE80` (ABAP Workbench) não pode ser utilizada:
- Todo o ciclo de vida (criação, edição, testes unitários com ABAP Unit, depuração e medição de desempenho) ocorre no **Eclipse ADT**.
- O compilador do ADT, em conjunto com as verificações automáticas do **ABAP Test Cockpit (ATC)**, intercepta em tempo real qualquer tentativa de consumo de APIs não liberadas ou sintaxes obsoletas, guiando o desenvolvedor para o caminho em conformidade com o Clean Core.
