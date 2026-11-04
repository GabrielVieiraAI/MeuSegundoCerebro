---
tipo: clippings
title: "Setting Up For Clean Core Development"
source: "https://learning.sap.com/courses/practicing-clean-core-extensibility-for-sap-s-4hana-cloud/creating-tier-2-cloud-apis_a75bf2cd-815c-42bb-8d3b-2bba4931ecad"
created: 2026-11-03
tags:
  - sap
  - abap
  - abap-cloud
  - clean-core
  - atc
  - authorizations
  - software-components
  - c0
  - c1
---
**Roteiro de Estudos Relacionado:** [[Roteiro de Estudos SAP]]

# Objetivos de Aprendizado

Após concluir esta lição, você será capaz de:
- Executar os passos de pré-requisitos administrativos e arquiteturais para habilitar o desenvolvimento baseado em **Clean Core Levels** no SAP S/4HANA Cloud Private Edition e On-Premise.
- Criar e categorizar **Software Components** e pacotes de desenvolvimento com o report `RSMAINTAIN_SWCOMPONENTS`.
- Configurar perfis de autorização com o objeto **`S_ABPLNGVS`** para segregar desenvolvedores do Nível A em relação aos demais níveis.
- Configurar e executar variantes de checagem do **ABAP Test Cockpit (ATC)** para governança automática dos Níveis A, B, C e D.
- Definir **Release State**, contratos de liberação (**C0 - Extend** e **C1 - Use System-Internally**) e escopos de visibilidade no Eclipse ADT.

---

## 1. Roteiro de Configuração Inicial do Sistema

Para implementar a governança de Clean Core de forma efetiva em ambientes SAP S/4HANA Cloud Private Edition, administradores e arquitetos devem estruturar quatro pilares operacionais:

![[InitialSetup_Image.png]]

---

## 2. Componentes de Software e Estrutura de Pacotes

A partir da versão **ABAP Platform 2022**, a criação e configuração de componentes de software foi simplificada através do report executável **`RSMAINTAIN_SWCOMPONENTS`**:

1. **Classificação do Software Component:**
   - **`ABAP Cloud`:** Todo e qualquer artefato criado dentro desse componente é obrigado pelo compilador a seguir o modelo ABAP Cloud. Mapeia diretamente para o **Clean Core Nível A**.
   - **`ABAP Classic`:** Permite o desenvolvimento de artefatos tradicionais sem restrições de sintaxe de nuvem. Mapeia para os **Níveis B, C e D**.
2. **Propriedade de Transporte:**
   - O componente é marcado como *Transportable* (sujeito a ordens de transporte para a esteira DEV-QAS-PRD) ou *Local* (apenas para testes locais não transportáveis).
3. **Hierarquia de Pacotes:**
   - **Structure Package (Pacote Estrutural):** Criado como raiz organizacional do componente de software.
   - **Development Packages (Pacotes de Desenvolvimento):** Criados sob o pacote estrutural para acomodar os artefatos técnicos de cada projeto ou módulo funcional.

---

## 3. Governança de Autorizações para Desenvolvedores

Para garantir que desenvolvedores juniores ou terceiros não introduzam inadvertidamente código do Nível D ou Nível C no sistema, a SAP fornece mecanismos de restrição baseados em perfis de segurança:

- **Administradores:** O objeto de autorização **`S_CTS_ADMI`** é necessário para configurar componentes de software.
- **Desenvolvedores:** O controle de qual versão da linguagem ABAP o usuário pode utilizar é regulado pelo objeto de autorização **`S_ABPLNGVS`**:
  1. No código de transação **`SACF`**, ative as checagens de autorização para o objeto `S_ABPLNGVS`.
  2. Na transação **`PFCG`**, crie duas funções (*roles*), utilizando o template padrão da SAP **`SAP_BC_ABAP_DEVELOPER_5`** como modelo de cópia.
  3. No campo de autorização **`ABP_LNG_VS`**:
     - Para desenvolvedores restritos estritamente ao Nível A: atribua o valor **`ABAP For Cloud Development`**.
     - Para arquitetos e seniores autorizados a criar *wrappers* ou manutenção em níveis legados: atribua o valor **`All activities`** (abrangendo os níveis B, C e D).

---

## 4. Governança Automatizada com ABAP Test Cockpit (ATC)

O **ABAP Test Cockpit (ATC)** é o motor oficial de inspeção estática de código no ecossistema SAP.

![[S4D426_2510_U5L3_01.png]]

### Variantes Padrão Fornecidas pela SAP:
1. **`ABAP_CLOUD_DEVELOPMENT_DEFAULT`:** Aplica as regras fundamentais do modelo ABAP Cloud diretamente no Eclipse ADT.
2. **`ABAP_CLOUD_READINESS`:** Analisa códigos legados existentes para verificar se estão preparados para nuvem, gerando uma lista de apontamentos (*Findings*) com suporte a correções automáticas (*Quick Fixes*).

### Configuração de Variante Customizada para os Níveis de Clean Core (A a D)
As empresas podem configurar uma variante customizada no ATC para auditar e priorizar mensagens conforme os níveis do Clean Core:

| Nível de Clean Core | Tipo de Artefato Consumido | Severidade / Mensagem no ATC |
| :---: | :--- | :--- |
| **Nível A** | **Released APIs** (Contratos C0/C1) | **Nenhum apontamento** (*Pass / Clean*) |
| **Nível B** | **Classic APIs** (BAPIs maduras, Wrappers) | **Prioridade 3** (Mensagem Informativa / *Info*) |
| **Nível C** | **Internal Objects** (Objetos internos não liberados) | **Prioridade 2** (Mensagem de Aviso / *Warning*) |
| **Nível D** | **Not Recommended** (Modificações, Writes diretos, `noAPI`) | **Prioridade 1** (Mensagem de Erro / *Error*) |

---

## 5. Contratos de Liberação e Escopo de Visibilidade

Para que um artefato criado por um desenvolvedor possa ser consumido legitimamente no **Nível A**, ele deve ser formalmente liberado nas propriedades do objeto no Eclipse ADT:

![[Tier2_2_Image.png]]

A liberação exige a manutenção simultânea de três parâmetros:

1. **Release State (Estado de Liberação):** Marcado formalmente como **Released**.
2. **Release Contracts (Contratos de Liberação):**
   - **`Extend (C0)`:** Indica que o artefato foi habilitado para extensibilidade (permite que consumidores definam pontos de extensão sobre ele).
   - **`Use System-Internally (C1)`:** Indica que o artefato está liberado para consumo interno. **O contrato C1 é pré-requisito mandatório para conformidade com o Nível A**.
3. **Usage Visibility (Visibilidade de Uso):**
   - **`Use In Key User Apps`:** Torna o objeto visível para as ferramentas de baixo código no SAP Fiori (Custom Fields, Custom Logic).
   - **`Use In Cloud Development`:** Torna o objeto acessível para desenvolvimento profissional no Eclipse ADT com a linguagem ABAP Cloud.

---

## 6. Simulações Práticas Oficiais (SAP Enable Now)

> [!TIP] Simulação 1: Configurar Software Components para ABAP Cloud e Classic
> [Acessar Exercício no SAP Enable Now](https://learnsap.enable-now.cloud.sap/wa/mmcp/index.html?show=project!PR_AC4D43D592CB95A1:uebung#2)

> [!TIP] Simulação 2: Configurar Autorizações de Desenvolvedor (S_ABPLNGVS / SACF / PFCG)
> [Acessar Exercício no SAP Enable Now](https://learnsap.enable-now.cloud.sap/pub/mmcp/index.html?show=project!PR_E795479B3AE3D8F:uebung)

> [!TIP] Simulação 3: Atribuir Versões de Linguagem ABAP e Verificar Prontidão via ATC
> [Acessar Exercício no SAP Enable Now](https://learnsap.enable-now.cloud.sap/pub/mmcp/index.html?show=project!PR_DC8A1E5D4F326888:uebung)

---

## Resumo da Lição

- A governança de Clean Core no Private Edition apoia-se em **Software Components** classificados como *ABAP Cloud* ou *ABAP Classic* via report `RSMAINTAIN_SWCOMPONENTS`.
- O objeto de autorização **`S_ABPLNGVS`** e o campo **`ABP_LNG_VS`** restringem perfis de desenvolvedores ao Nível A ou autorizam atividades nos níveis B, C e D.
- O **ABAP Test Cockpit (ATC)** automatiza a auditoria contínua dos Níveis A (Sem erros), B (Info), C (Warning) e D (Error).
- Artefatos liberados para Nível A exigem contrato de consumo **`Use System-Internally (C1)`** ou extensão **`Extend (C0)`**, associados à visibilidade adequada (*Key User* ou *Cloud Development*).
