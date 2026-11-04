---
tipo: clippings
title: "Introducing the SAP S/4HANA Cloud Extensibility Model"
source: "https://learning.sap.com/courses/practicing-clean-core-extensibility-for-sap-s-4hana-cloud/introducing-the-sap-s-4hana-cloud-extensibility-model_ccb4be88-d66d-47e1-96a0-3341dc007416"
created: 2026-11-03
tags:
  - sap
  - abap
  - abap-cloud
  - clean-core
  - extensibility-model
  - on-stack
  - side-by-side
  - key-user
  - developer-extensibility
---
**Roteiro de Estudos Relacionado:** [[Roteiro de Estudos SAP]]

# Objetivos de Aprendizado

Após concluir esta lição, você será capaz de:
- Identificar e explicar os três princípios fundamentais que ancoram o modelo de extensibilidade do **SAP S/4HANA Cloud**.
- Diferenciar as duas categorias de execução: extensões locais (**On-Stack**) e desacopladas (**Side-by-Side**).
- Reconhecer os três padrões de extensibilidade (**Key User Extensibility**, **Developer Extensibility** e **Side-by-Side Extensibility**).

---

## 1. Os Três Princípios Estruturais do Modelo de Extensibilidade

O **SAP S/4HANA Cloud Extensibility Model** foi construído sobre três diretrizes fundamentais que norteiam qualquer desenvolvimento, desde uma alteração de tela por um analista funcional até a construção de um microsserviço corporativo complexo:

1. **Localização Estrita das Extensões:**
   - Extensões só podem ser implementadas internamente no próprio stack do SAP S/4HANA Cloud (extensões **On-Stack**) ou externamente em uma plataforma em nuvem desacoplada, especificamente a **SAP BTP (Business Technology Platform)** (extensões **Side-by-Side**).
2. **Uso Exclusivo de Interfaces e Pontos Públicos Liberados:**
   - Extensões só podem interagir com o software padrão através de **APIs públicas liberadas** (locais ou remotas), **BAdIs liberados** e pontos formais de extensão em **Business Objects do RAP (ABAP RESTful Application Programming Model)**.
3. **Tecnologias Habilitadas e Liberadas para Nuvem:**
   - Todo o código e artefato deve ser construído utilizando ferramentas e recursos formalmente liberados para a nuvem (*Cloud-Enabled and Released Technologies*), como o compilador ABAP Cloud e o Eclipse ADT.

![[Extensibility_Model_002.png]]

---

## 2. Categorias e Padrões de Extensão

O modelo agrupa as extensões em **duas categorias arquiteturais**, que se desdobram em **três padrões técnicos (tipos)**:

```
                           SAP S/4HANA Cloud Extensibility Model
                                             │
                   ┌─────────────────────────┴─────────────────────────┐
                   ▼                                                   ▼
         On-Stack Extensions                                Side-by-Side Extensions
         (Executadas no S/4HANA)                                (Executadas no BTP)
                   │                                                   │
        ┌──────────┴──────────┐                                        │
        ▼                     ▼                                        ▼
┌──────────────┐      ┌──────────────┐                         ┌──────────────┐
│    Tipo 1    │      │    Tipo 2    │                         │    Tipo 3    │
│   Key User   │      │  Developer   │                         │ Side-by-Side │
│Extensibility │      │Extensibility │                         │Extensibility │
└──────────────┘      └──────────────┘                         └──────────────┘
```

### Categoria 1: On-Stack Extensions (Extensões no Próprio Sistema)
Executadas diretamente no mesmo ambiente de runtime e no mesmo banco de dados do SAP S/4HANA Cloud. São ideais para operações que demandam proximidade máxima com os dados corporativos (*Data Proximity*) e transações em tempo real com baixo atraso de rede. Subdivide-se em:

1. **Key User Extensibility (Tipo 1):**
   - Voltada para analistas de negócios, consultores funcionais e usuários-chave (*Citizen Developers*).
   - Realizada diretamente pela interface web (SAP Fiori) usando ferramentas visuais *No-Code / Low-Code*.
   - Exemplo: criação de campos adicionais em telas, regras de validação simples e relatórios rápidos.
2. **Developer Extensibility (Tipo 2):**
   - Voltada para desenvolvedores ABAP profissionais (*Pro-Code*).
   - Realizada dentro do **ABAP Development Tools (ADT)** no Eclipse utilizando a linguagem **ABAP Cloud** e o framework **RAP**.
   - Permite a implementação de lógica de negócio complexa, novos objetos transacionais e implementações profundas de BAdIs.

### Categoria 2: Side-by-Side Extensions (Extensões Externas / Desacopladas)
3. **Side-by-Side Extensibility (Tipo 3):**
   - Executada fora do SAP S/4HANA, na **SAP BTP**.
   - Totalmente desacoplada do ciclo de vida do ERP.
   - Ideal para aplicações voltadas para o consumidor final (B2C), portais com milhares de acessos concorrentes externos, integrações com sistemas legados ou desenvolvimento poliglota (Java, Node.js, Python, ABAP Cloud via BTP ABAP Environment).

---

## Resumo da Lição

- O modelo de extensibilidade do SAP S/4HANA Cloud estrutura o desenvolvimento corporativo em 3 princípios inegociáveis: localização controlada (On-Stack ou Side-by-Side), consumo exclusivo de APIs/BAdIs liberados e tecnologias Cloud-ready.
- Há duas categorias físicas: **On-Stack** (executadas no próprio ERP) e **Side-by-Side** (executadas na SAP BTP).
- Essas categorias contemplam 3 tipos de extensões: **Key User** (Tipo 1), **Developer** (Tipo 2) e **Side-by-Side** (Tipo 3).
