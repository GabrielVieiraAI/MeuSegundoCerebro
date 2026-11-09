---
title: "Descrevendo o Conceito de Autorização no ABAP"
source: "https://learning.sap.com/courses/deepening-your-abap-programming-knowledge/describing-the-authorization-concept-in-abap"
created: 2026-11-03
tags:
  - sap
  - abap
  - abap-cloud
  - autorizacao
  - seguranca
  - pfcg
  - su21
---
**Roteiro de Estudos Relacionado:** [[Roteiro de Estudos SAP]]

# Objetivos

Após concluir esta lição, você será capaz de:
- Explicar por que aplicações empresariais exigem um framework lógico de autorizações no nível de aplicação ABAP.
- Descrever a hierarquia de segurança da SAP: **Campos de Autorização**, **Objetos de Autorização**, **Perfis** e **Papéis (*Roles*)**.
- Diferenciar os dois pilares modernos de segurança: **Controles de Acesso Declarativos (CDS DCL)** e **Verificações Procedurais Explícitas (`AUTHORITY-CHECK`)**.
- Compreender a responsabilidade do desenvolvedor na proteção de dados sensíveis e operações transacionais (CRUD).

---

## 1. Por que Autorizações são Necessárias no Nível ABAP?

Quando um programa ABAP se comunica com o banco de dados (SAP HANA), a conexão técnica subjacente é estabelecida por meio de um usuário técnico privilegiado do sistema operacional/banco de dados (como `SAPHANADB`). Esse usuário possui privilégios irrestritos de leitura e escrita sobre as tabelas físicas.

> [!IMPORTANT] A Falácia da Segurança de Banco de Dados
> Se o sistema dependesse apenas das permissões de banco de dados, qualquer usuário final conectado poderia ler folhas de pagamento de diretores, alterar preços de passagens ou excluir ordens de compra da concorrência! Portanto, a SAP delega a governança de acesso para o **Framework de Autorizações da Camada de Aplicação ABAP**.

---

## 2. A Hierarquia Estrutural do Modelo de Autorizações

O controle de acesso no ecossistema SAP é estruturado em quatro níveis hierárquicos:

```text
[Usuário Final (User Master Record)]
             |
             v  (Atribuído a)
[Papéis de Usuário (PFCG Roles)]
             |
             v  (Contém)
[Objetos de Autorização (Authorization Objects - SU21)]
             |
             v  (Agrupa até 10)
[Campos de Autorização (Authorization Fields)]
(Ex: BUKRS = '1000', ACTVT = '03')
```

### 1. Campos de Autorização (*Authorization Fields*)
São as menores unidades de segurança. Cada campo representa um atributo mensurável de negócio ou ação do sistema:
* **`ACTVT` (Activity):** Campo padrão global que define a ação pretendida (`01` = Criar, `02` = Modificar, `03` = Exibir, `06` = Excluir).
* **Campos Organizacionais:** Delimitam a abrangência territorial ou contábil dos dados (ex: `BUKRS` para Empresa, `WERKS` para Centro/Planta, `CARRID` para Companhia Aérea).

### 2. Objetos de Autorização (*Authorization Objects*)
Cadastrados e mantidos na transação **`SU21`**, agrupam **até 10 campos de autorização** correlacionados logicamente para compor uma blindagem completa sobre determinada transação ou entidade de negócio (ex: o objeto `S_CARRID` agrupa os campos `CARRID` e `ACTVT`).

### 3. Papéis (*PFCG Roles*)
Criados e mantidos pelos administradores de segurança através da transação **`PFCG`** (*Role Maintenance*). Um papel reúne múltiplos objetos de autorização com valores permitidos concretos (ex: o papel de Consultor Financeiro Brasil permite `BUKRS = 'BR10'` e `ACTVT = '03'`). Os papéis são então atribuídos aos usuários finais (*User Master Records* na `SU01`).

---

## 3. Os Dois Pilares de Verificação no Desenvolvimento Moderno

No ABAP contemporâneo e no modelo **ABAP RESTful Application Programming Model (RAP)**, a aplicação de segurança divide-se em duas abordagens complementares:

| Abordagem | Tecnologia Empregada | Momento de Uso Típico | Responsabilidade do Desenvolvedor |
| :--- | :--- | :--- | :--- |
| **Declarativa (*Implicit Row-Level Security*)** | **CDS Access Controls (DCL)** | Operações de **Leitura de Dados** via ABAP CDS Views. | **Automática e Segura por Padrão.** O SAP HANA filtra as linhas no próprio banco antes de devolver à aplicação. |
| **Procedural (*Explicit Check*)** | Instrução **`AUTHORITY-CHECK`** | Operações **Transacionais de Modificação** (Create, Update, Delete) e execuções de ações (*Actions*). | **Manual.** O desenvolvedor deve invocar o comando, avaliar o retorno `sy-subrc` e interromper o fluxo se o usuário não for autorizado. |

---

## 4. O Princípio de Defesa Prematura (*Check Early*)

Em fluxos procedurais, uma das diretrizes fundamentais da SAP é posicionar a checagem de autorização **o mais cedo possível no fluxo de execução**:
* Nunca execute seleções massivas de banco de dados, cálculos pesados de inteligência artificial ou chamadas remotas a APIs externas antes de verificar se o usuário solicitante possui a autorização necessária (`ACTVT = '03'` ou `'02'`).
* Executar verificações tardiamente consome recursos inúteis do servidor e abre brechas de segurança para ataques de negação de serviço (*DoS*).

---

## Resumo da Lição

- A conexão técnica ao banco de dados utiliza um usuário com privilégios plenos; a restrição lógica de acesso de usuários de negócio é governada pelo **Framework de Autorizações ABAP**.
- A segurança é hierárquica: **Campos** $\rightarrow$ agrupados em **Objetos de Autorização** (transação `SU21`, até 10 campos) $\rightarrow$ atribuídos a **Papéis** (transação `PFCG`) $\rightarrow$ vinculados ao **Usuário**.
- O campo padrão **`ACTVT`** governa ações do CRUD (`01` Criar, `02` Modificar, `03` Exibir, `06` Excluir).
- **CDS Access Controls (DCL)** protegem leituras automaticamente no banco; o comando **`AUTHORITY-CHECK`** protege mutações e ações imperativas no código.
- As validações de autorização devem ser executadas logo no início do processamento (*Check Early*).
