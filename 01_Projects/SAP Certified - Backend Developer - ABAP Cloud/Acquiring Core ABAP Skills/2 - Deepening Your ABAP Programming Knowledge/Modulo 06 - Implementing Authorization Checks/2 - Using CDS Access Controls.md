---
title: "Utilizando Controles de Acesso CDS"
source: "https://learning.sap.com/courses/deepening-your-abap-programming-knowledge/using-cds-access-controls"
created: 2026-11-03
tags:
  - sap
  - abap
  - abap-cloud
  - cds
  - dcl
  - access-control
  - row-level-security
  - clean-core
  - adt
---
**Roteiro de Estudos Relacionado:** [[Roteiro de Estudos SAP]]

# Objetivos

Após concluir esta lição, você será capaz de:
- Explicar o conceito de segurança a nível de linha (*Row-Level Security*) proporcionado pelos **Controles de Acesso CDS**.
- Criar e estruturar objetos de controle de acesso utilizando a **Linguagem de Controle de Dados (*DCL - Data Control Language*)** no Eclipse ADT.
- Mapear elementos da CDS View a objetos de autorização da PFCG através da cláusula `aspect pfcg_auth`.
- Configurar a anotação `@AccessControl.authorizationCheck` na definição da CDS View.
- Descrever as vantagens arquiteturais da Segurança por Padrão (*Security by Default*) com filtragem nativa no SAP HANA.
- Simular e inspecionar regras de autorização DCL no ambiente de desenvolvimento.

---

## 1. O que são Controles de Acesso CDS?

No modelo moderno de desenvolvimento com **Core Data Services (CDS)**, os dados de negócio são expostos através de CDS Views. Se a segurança dependesse de checagens imperativas em código ABAP, qualquer desenvolvedor que executasse uma consulta simples `SELECT * FROM ZI_Customer` poderia esquecer de aplicar a validação, expondo dados confidenciais.

> [!NOTE] Definição de CDS Access Control
> Um **Controle de Acesso CDS** é um artefato declarativo que implementa **segurança a nível de linha (*Row-Level Security*)**. Sempre que uma CDS View protegida é lida por qualquer instrução ABAP SQL, o sistema injeta **automaticamente** cláusulas de filtro `WHERE` invisíveis no comando enviado ao SAP HANA, garantindo que o usuário receba estritamente as linhas para as quais possui autorização em seu perfil PFCG!

---

## 2. A Linguagem de Controle de Dados (DCL)

Os controles de acesso são criados no **ABAP Development Tools (ADT)** no Eclipse através de objetos de repositório do tipo **DCLS** (*Access Control*):

1. No ADT, clique com o botão direito no pacote $\rightarrow$ **New $\rightarrow$ Access Control**.
2. O arquivo é redigido utilizando a sintaxe da **Linguagem de Controle de Dados (*DCL - Data Control Language*)**:

```dcl
@EndUserText.label: 'Controle de Acesso para Entidade de Viagens'
@MappingRole: true
define role Z_AccessControl_Travel {
  grant select on ZI_Travel_ViewEntity
    where ( AgencyCountry ) = aspect pfcg_auth( /DMO/TRVL, 
                                                /DMO/CNTRY, 
                                                actvt = '03' );
}
```

---

## 3. Anatomia de uma Regra DCL: O Papel de `aspect pfcg_auth`

* **`define role <Nome_Role>`:** Declara o nome do artefato de controle de acesso DCL.
* **`grant select on <CDS_Entity>`:** Associa a regra de segurança à entidade CDS protegida.
* **`where ( Elemento_CDS ) = aspect pfcg_auth( ... )`:** Cláusula mestra de mapeamento:
  - **`/DMO/TRVL`:** O objeto de autorização cadastrado na transação `SU21`.
  - **`/DMO/CNTRY`:** O campo de autorização específico do objeto que receberá o valor da coluna `AgencyCountry`.
  - **`actvt = '03'`:** Exige que o usuário possua a atividade de exibição/leitura (`03`) em seu perfil para aquele país.

### Como o SAP HANA Executa a Query
Se o usuário logado tiver autorização apenas para viagens no Brasil (`BR`) e executar:
```abap
SELECT * FROM ZI_Travel_ViewEntity INTO TABLE @DATA(lt_travels).
```
O kernel traduzirá a query enviada ao SAP HANA automaticamente para:
```sql
SELECT * FROM ZI_Travel_ViewEntity WHERE AgencyCountry = 'BR';
```
Linhas de outros países são descartadas diretamente na memória do banco de dados, sem consumir banda de rede nem sobrecarregar o servidor ABAP!

---

## 4. A Anotação Obrigatória na CDS View

Para que o controle de acesso DCL tenha validade legal no sistema, a CDS View deve declarar expressamente a anotação de governança no cabeçalho do seu código DDL:

```cds
@AccessControl.authorizationCheck: #CHECK
define view entity ZI_Travel_ViewEntity
  as select from /lrn/travel
{
  key travel_id,
      agency_id,
      country_code as AgencyCountry,
      description
}
```

### Valores Possíveis para `@AccessControl.authorizationCheck`

| Valor da Anotação | Comportamento do Sistema |
| :--- | :--- |
| **`#CHECK`** *(Obrigatório para Negócio)* | O sistema **exige e aplica** os controles de acesso DCL. Se não existir DCL ativo para a view, o ATC emite um alerta de qualidade. |
| **`#NOT_REQUIRED`** | Utilizado para CDS Views técnicas, tabelas de domínio ou parametrizações sem dados confidenciais (dispensa DCL). |
| **`#PRIVILEGED_ONLY`** | A view só pode ser lida se a instrução ABAP SQL utilizar a cláusula explícita de acesso privilegiado (`PRIVILEGED ASSOCIATIONS`), bloqueando acessos comuns. |
| **`#NOT_ALLOWED`** | Proíbe qualquer criação de DCL para a view. |

---

## 5. Vantagens Arquiteturais dos Controles de Acesso DCL

1. **Segurança por Padrão (*Security by Default*):** O desenvolvedor que consome a CDS View não precisa lembrar de escrever validações em cada relatório ou API; a proteção é inerente à entidade de dados.
2. **Code Pushdown de Segurança:** A filtragem acontece dentro do motor do SAP HANA, garantindo máxima performance.
3. **Desacoplamento de Funções:** Os administradores de segurança continuam utilizando a transação **`PFCG`** para conceder acessos a usuários, sem necessidade de reescrever códigos ABAP quando novos países ou filiais forem criados.

---

## Resumo da Lição

- **CDS Access Controls** aplicam segurança a nível de linha (*Row-Level Security*) diretamente na camada de dados.
- São construídos em **DCL (Data Control Language)** no Eclipse ADT, criando artefatos do tipo DCLS.
- O operador **`aspect pfcg_auth`** conecta uma coluna da CDS View a um objeto e campo de autorização da transação `SU21`.
- A CDS View protegida deve conter a anotação obrigatória **`@AccessControl.authorizationCheck: #CHECK`**.
- Garante **Segurança por Padrão**: consultas `SELECT` normais recebem filtros automáticos no SAP HANA sem necessidade de comandos imperativos adicionais no código ABAP.
