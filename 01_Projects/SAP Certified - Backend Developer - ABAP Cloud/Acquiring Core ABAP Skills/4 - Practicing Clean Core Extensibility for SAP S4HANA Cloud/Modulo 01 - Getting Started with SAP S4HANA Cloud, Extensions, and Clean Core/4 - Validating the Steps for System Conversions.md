---
tipo: clippings
title: "Validating the Steps for System Conversions"
source: "https://learning.sap.com/courses/practicing-clean-core-extensibility-for-sap-s-4hana-cloud/validating-the-steps-for-system-conversions_a3d85f14-de46-4475-9b54-ab042e2d6b62"
created: 2026-11-03
tags:
  - sap
  - abap
  - abap-cloud
  - system-conversion
  - brownfield
  - sum
  - dmo
  - maintenance-planner
---
**Roteiro de Estudos Relacionado:** [[Roteiro de Estudos SAP]]

# Objetivos de Aprendizado

Após concluir esta lição, você será capaz de:
- Avaliar os passos técnicos essenciais para conversões de sistema bem-sucedidas (*Assess the steps necessary for successful system conversions*).
- Distinguir os cenários de conversão a partir de banco de dados tradicional (*AnyDB*) versus *SAP HANA*.
- Identificar as ferramentas oficiais e atividades executadas nas fases de **Preparação (*Preparation*)** e **Realização (*Realization*)**.

---

## 1. Cenários de Conversão de Sistema (*Conversion Scenarios*)

Na conversão de sistema (*System Conversion*), o cliente migra sua instalação existente do SAP ERP para uma arquitetura moderna SAP S/4HANA. Os passos exatos variam dependendo da base técnica de origem, diferenciando-se fundamentalmente em dois cenários:

```
Cenário 1: SAP ERP rodando sobre AnyDB (Oracle, SQL Server, DB2, etc.)
Cenário 2: SAP ERP rodando sobre SAP HANA (v1.0 ou v2.0 - Suite on HANA)
```

### Cenário 1: SAP ERP em Banco de Dados Tradicional (*AnyDB*)
1. O banco de dados relacional legado (não-HANA) é substituído pelo banco de dados em memória **SAP HANA (versão 2.0)**.
2. Ocorre a conversão do modelo de dados transacional do SAP ERP para o novo modelo simplificado do SAP S/4HANA (como unificação de tabelas financeiras na `ACDOCA` e de materiais na `MATDOC`).
3. O código-fonte de software do SAP S/4HANA é instalado, substituindo totalmente a base de código do antigo SAP ERP.

### Cenário 2: SAP ERP Já Rodando sobre SAP HANA
1. O sistema já utiliza a tecnologia SAP HANA, mas verifica-se se a versão é SAP HANA v1.0. Se for, é realizado o upgrade para **SAP HANA v2.0**.
2. Em seguida, executam-se a conversão do modelo de dados e o upgrade do código da aplicação, idênticos ao Cenário 1.

> [!IMPORTANT] Ponto Crítico para a Certificação SAP
> Em ambos os cenários, a conversão do **banco de dados**, do **modelo de dados** e do **software** é executada dentro do **mesmo processo técnico unificado** através do **Software Update Manager (SUM)** com a opção **Database Migration Option (DMO)**.  
> Por isso, **apenas uma única janela de parada (*single system downtime*) é necessária** para toda a conversão técnica do sistema.

---

## 2. As Fases de Preparação e Realização

Assista ao vídeo oficial da SAP para entender as atividades estruturadas de ponta a ponta:

<iframe 
    src="https://cdnapisec.kaltura.com/p/1921661/embedPlaykitJs/uiconf_id/50355372?iframeembed=true&entry_id=1_rvqr43k1" 
    width="100%" 
    height="400" 
    allowfullscreen 
    frameborder="0">
</iframe>

> [!NOTE] Síntese Estruturada do Vídeo: Fases de Conversão
> A conversão de sistema divide-se em duas grandes etapas obrigatórias:
> 
> ### 1. Fase de Preparação (*Preparation Phase*)
> Executada com antecedência no sistema produtivo sem causar indisponibilidade para os usuários:
> - **Determinar Requisitos de Sistema (*System Requirements*):** Validação de compatibilidade de arquitetura, sistema operacional, nível de patch de kernel e versão mínima do SAP NetWeaver.
> - **Utilizar o Maintenance Planner:** Ferramenta baseada em nuvem que calcula dependências, valida a compatibilidade de Add-ons de terceiros e verifica o status das *Business Functions* ativas.
> - **Executar os Simplification Item Checks:** Relatório executado no ERP para cruzar o sistema com o catálogo oficial de itens de simplificação (*Simplification Item Catalog*), apontando inconsistências funcionais e pré-requisitos mandatórios antes do início da migração.
> - **Realizar a Análise de Código Customizado (*Custom Code Analysis*):** Varredura de todo o código customizado legado através do **ABAP Test Cockpit (ATC)** utilizando a variante de checagem oficial `S4HANA_READINESS`.
> 
> ### 2. Fase de Realização (*Realization Phase*)
> - **Execução Técnica do SUM (com DMO):** Durante a janela de downtime, o SUM migra o banco de dados para SAP HANA v2.0, converte o dicionário de dados e atualiza o software da aplicação para o SAP S/4HANA.
> - **Atividades Pós-Conversão:** Ajustes de dados financeiros, migração contábil e adaptação do código customizado remanescente.

---

## 3. Resumo das Ferramentas da Conversão

| Ferramenta Oficial SAP | Fase do Projeto | Função Primordial |
| :--- | :---: | :--- |
| **Maintenance Planner** | Preparação | Validação de Add-ons, dependências de software e geração do arquivo de stack (*stack.xml*). |
| **Simplification Item Check** | Preparação | Identificação de incompatibilidades funcionais e requisitos de dados do SAP S/4HANA. |
| **ABAP Test Cockpit (ATC)** | Preparação | Análise de prontidão do código customizado com a variante `S4HANA_READINESS`. |
| **Software Update Manager (SUM + DMO)** | Realização | Migração do banco para HANA, conversão de dados e upgrade do software em janela única de parada. |
| **ABAP Development Tools (ADT)** | Realização / Pós | Adaptação automatizada de código ABAP via recursos de **Quick Fix**. |
