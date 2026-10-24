---
tipo: flashcards
tags:
  - sap
  - abap
  - abap-cloud
  - flashcards
modulo: 1
curso: "Learning Basic ABAP Programming"
---

# 🗂️ Flashcards: Módulo 1 - Getting Started

**Deck Principal:** `#flashcards/sap/abap-cloud/modulo-01`  
**Painel de Revisão:** [[01_Projects/SAP Certified - Backend Developer - ABAP Cloud/Acquiring Core ABAP Skills/1 - Learning Basic ABAP Programming/1 - Getting Started/🎯 Revisao Ativa - Modulo 01|🎯 Revisao Ativa - Modulo 01]]

---

#flashcards/sap/abap-cloud/modulo-01

### 1. Ambiente e Conexão (Eclipse ADT & SAP BTP)

Qual a diferença entre um ABAP Project e um ABAP Cloud Project no Eclipse ADT?::O ABAP Project conecta-se a sistemas ABAP On-Premise clássicos ou SAP S/4HANA Private Cloud. O ABAP Cloud Project conecta-se exclusivamente a ambientes em nuvem com Clean Core (SAP BTP ABAP Environment ou SAP S/4HANA Cloud).

Como é estruturada a hierarquia de infraestrutura no SAP BTP para hospedar um ambiente ABAP?::Global Account (contrato corporativo) -> Subaccounts (ambientes DEV/QAS/PRD) -> Runtime (Cloud Foundry / Kyma) -> Instância do ambiente ABAP.

---

### 2. Navegação e Atalhos no Eclipse ADT

Qual é o atalho do Eclipse ADT para localizar e abrir rapidamente qualquer objeto de desenvolvimento por nome?::**Ctrl + Shift + A**

Para que servem os atalhos F1, F2, F3 e Alt + ← no ADT?
?
* **F1:** Abre a ajuda oficial da linguagem (*ABAP Language Help*) para o comando sob o cursor.
* **F2:** Exibe documentação rápida (*Quick Info*) sobre o elemento selecionado.
* **F3 (ou duplo clique):** Navega até a definição do objeto de desenvolvimento.
* **Alt + ←:** Retorna ao ponto de origem após realizar a navegação.
<!--SR:!2026-10-27,3,250-->

---

### 3. Estrutura de Software e Logística ABAP

O que é um Pacote ABAP (Package) e a qual estrutura ele deve obrigatoriamente pertencer no Cloud?::É um contêiner lógico que agrupa objetos de desenvolvimento afins. No ABAP Cloud, todo pacote deve obrigatoriamente estar associado a um **Software Component** (unidade de entrega, ex: `ZLOCAL`).

Quais são as regras de Namespaces para desenvolvimentos customizados de clientes no SAP?::Todo objeto ou pacote customizado criado pelo cliente deve iniciar obrigatoriamente com a letra **Z** ou **Y**, evitando que upgrades da SAP sobrescrevam o código.

O que é uma Ordem de Transporte (Transport Request) e qual o papel do bloqueio (locking)?::Mecanismo que empacota objetos alterados para migração entre ambientes (DEV -> QAS -> PRD). Ao editar um objeto, o sistema gera um *lock* vinculado à request, impedindo edições concorrentes de outros desenvolvedores.

---

### 4. Primeira Aplicação e Padrões ABAP Cloud

Por que os programas executáveis procedurais (Reports na SE38) e o comando WRITE foram banidos no ABAP Cloud?::Porque violam a arquitetura moderna orientada a objetos e os princípios de *Clean Core*. No ABAP Cloud, toda lógica de negócio é encapsulada em classes globais.

Como executar e visualizar a saída de uma classe ABAP sem criar telas gráficas?::Implementando a interface **`if_oo_adt_classrun`** (método `main` com parâmetro `out->write()`) e executando com o atalho **F9** (*ABAP Console*).

Qual a diferença entre salvar (Ctrl + S) e ativar (Ctrl + F3) um objeto no Eclipse ADT?::Salvar (**Ctrl + S**) cria apenas uma versão inativa (rascunho). O código só é compilado e executado pelo sistema após a ativação explícita com **Ctrl + F3**.

---

### 5. Regras Técnicas e Funcionalidades de IA

Qual caractere especial é estritamente proibido na nomenclatura de uma classe ABAP?::O caractere cifrão (**\$**). Permitidos apenas letras, dígitos e sublinhado (`_`).

Qual a diferença entre a função Explain do assistente Joule e o ABAP AI SDK?::O **Joule (Explain)** é o assistente generativo da IDE para explicar trechos de código ao programador. O **ABAP AI SDK** é uma biblioteca de desenvolvimento para criar lógicas de negócio em ABAP que consomem modelos de Inteligência Artificial.
