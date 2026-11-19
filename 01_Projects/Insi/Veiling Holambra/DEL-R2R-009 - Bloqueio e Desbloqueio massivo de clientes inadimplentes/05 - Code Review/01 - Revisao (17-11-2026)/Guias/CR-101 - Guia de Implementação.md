---
tipo: guia-implementacao-code-review
tags:
  - projeto
  - insi
  - veiling-holambra
  - sap
  - code-review
  - fi-ar
  - fscm
  - rap
  - cds
  - odata
  - abap-cloud
  - del-r2r-009
  - guia-implementacao
id_demanda: DEL-R2R-009
revisao: Code Review 1
item_cr: CR-101
data: 2026-11-18
sap_destination: Veiling_S4D_100_GVSOUZA_PT
transport_requests:
  - S4DK900952 - DEL-R2R-009 - Bloqueio e Desbloqueio de Inadimplentes
aliases:
  - CR-101 - Guia de Implementação
  - DEL-R2R-009 - CR-101 - Guia de Implementação
---

# 🛠️ DEL-R2R-009 · CR-101: Guia Passo a Passo de Implementação (Code Review)

⬅️ [[CR-101 - Chave Duplicada na CDS Raiz|Voltar para o Item CR-101]] | 🗺️ [[00 - DEL-R2R-009 - Escada Code Review 1.excalidraw|Escada do Code Review]] | 🏛️ [[DEL-R2R-009 - Arquitetura e Objetos|Arquitetura e Objetos]] | 🎨 [[01 - DEL-R2R-009 - Comparativo Arquitetura CR-101.excalidraw|Comparativo Arquitetura CR-101]]

---

## 📌 1. Resumo Técnico do Ajuste (CR-101)

* **Apontamento do Code Review:** A view de base `ZI_FI_PARCEIRO_CREDITO` gera uma linha por vínculo `UKM001`, mas a CDS raiz `ZI_FI_CLIENTE_INADIMPLENTE` declarava como chave apenas `PartnerMatriz` + `CreditSegment` (causando repetição de chave na lista e `READ` imprevisível no Business Object para matrizes com 2 ou mais filiais), além de o uso de `coalesce` ocultar os títulos vencidos da própria Matriz quando existem filiais vinculadas.
* **Solução Técnica Aplicada:** Substituído o `coalesce` em `ZI_FI_PARCEIRO_CREDITO` por `union` que garante sempre uma linha da própria Matriz somada a uma linha por filial vinculada (`PartnerMatriz + CreditSegment + PartnerOrigem`); criada a CDS auxiliar `ZI_FI_GRUPO_INADIMPLENTE` para avaliar a régua individualmente por empresa sem somar saldos; promovido `PartnerOrigem` para chave primária nas CDSs Raiz e Projeção com regra 100% simétrica de `AcaoProposta`/`OrdemProposta` pelo grupo; reativados os BDEFs; incluído filtro por `PartnerOrigem` no método `read` de `ZCLFI_BP_CLIENTE_INAD`; e prevista a republicação do Service Binding OData V2 `ZUI_O2_FI_CLIENTE_INAD`.

---

## 🚀 2. Detalhamento Passo a Passo por Fase

> [!NOTE] Guia de Execução e Classificação dos Passos (`[MCP]` vs. `[Manual]`)
> Esta checklist representa a **ordem cronológica exata de dependências técnicas** para aplicar o ajuste deste item de Code Review. Cada passo aponta diretamente para a nota individual do objeto na pasta `04 - Objetos Tecnicos`, já atualizada com os **Metadados ADT** e os snippets de código finais (`📝 Código Comentado` e `🚀 Código Limpo`).
> - **`[MCP]`:** passo executável de forma automatizada no ambiente `DEV` via servidor **MCP** (*Model Context Protocol*) `sap-adt`.
> - **`[Manual]`:** passo 100% executado pelo desenvolvedor humano no **ADT** (*ABAP Development Tools*), **SAP GUI** ou **BAS** (*SAP Business Application Studio*).
> - **`[Ativação em Massa: Ctrl + Shift + F3]`:** sinaliza grupos com dependência circular mútua (ou alterações simultâneas de chave/assinatura entre objetos dependentes) que precisam ser criados/editados em conjunto antes da ativação em lote.

### Fase 1: Camada de Modelagem de Dados — CDS Views de Base e Auxiliar
> **Objetivo:** Garantir que a visão de parceiros emita sempre a linha própria da Matriz junto às filiais com chave tripla e disponibilizar a CDS auxiliar de consolidação da régua por grupo econômico.

- [x] Passo 1 `[MCP]` — Atualizar [[05 - ZI_FI_PARCEIRO_CREDITO|ZI_FI_PARCEIRO_CREDITO]] (Substituir `coalesce` por `union` entre Matriz própria e filiais `UKM001`, definindo chave tripla `PartnerMatriz` + `CreditSegment` + `PartnerOrigem`) ✅ 2026-11-18
- [x] Passo 2 `[MCP]` — Criar [[15 - ZI_FI_GRUPO_INADIMPLENTE|ZI_FI_GRUPO_INADIMPLENTE]] (Nova CDS auxiliar que avalia a régua individual por empresa sem somar saldos e consolida a flag `GrupoInadimplente` por `PartnerMatriz` e `CreditSegment`) ✅ 2026-11-18

---

### Fase 2: Camada RAP — CDS Raiz, Projeção, BDEFs e Behavior Pool
> **Objetivo:** Promover `PartnerOrigem` para chave primária em toda a pilha RAP (`[Ativação em Massa: Ctrl + Shift + F3]` nas CDSs e BDEFs dependentes), aplicar a regra simétrica de sugestão pelo grupo econômico e ajustar a leitura por chave tripla no Behavior Pool.

- [x] Passo 3 `[MCP]` — Atualizar [[06 - ZI_FI_CLIENTE_INADIMPLENTE (CDS)|ZI_FI_CLIENTE_INADIMPLENTE (CDS)]] (Promover `PartnerOrigem` para chave primária e consumir `ZI_FI_GRUPO_INADIMPLENTE` na regra simétrica de `AcaoProposta` e `OrdemProposta`) `[Ativação em Massa: Ctrl + Shift + F3]` ✅ 2026-11-18
- [x] Passo 4 `[MCP]` — Atualizar [[09 - ZC_FI_CLIENTE_INADIMPLENTE (CDS)|ZC_FI_CLIENTE_INADIMPLENTE (CDS)]] (Promover `PartnerOrigem` para chave primária na projeção) `[Ativação em Massa: Ctrl + Shift + F3]` ✅ 2026-11-18
- [x] Passo 5 `[MCP]` — Reativar [[07 - ZI_FI_CLIENTE_INADIMPLENTE (BDEF)|ZI_FI_CLIENTE_INADIMPLENTE (BDEF)]] (Sincronizar chave tripla em `%tky` no BDEF Raiz) `[Ativação em Massa: Ctrl + Shift + F3]` ✅ 2026-11-18
- [x] Passo 6 `[MCP]` — Reativar [[11 - ZC_FI_CLIENTE_INADIMPLENTE (BDEF)|ZC_FI_CLIENTE_INADIMPLENTE (BDEF)]] (Sincronizar chave tripla no BDEF de Projeção) `[Ativação em Massa: Ctrl + Shift + F3]` ✅ 2026-11-18
- [x] Passo 7 `[MCP]` — Atualizar [[08 - ZCLFI_BP_CLIENTE_INAD|ZCLFI_BP_CLIENTE_INAD]] (Incluir filtro `AND PartnerOrigem = @keys-PartnerOrigem` no método `read` da aba `Local Types`) ✅ 2026-11-18

---

### Fase 3: Camada de Serviço e Exposição (OData V2)
> **Objetivo:** Atualizar os metadados (`$metadata`) do serviço OData V2 exposto ao aplicativo Fiori para refletir a nova chave tripla nas entidades e Function Imports.

- [x] Passo 8 `[MCP]` — Republicar [[13 - ZUI_O2_FI_CLIENTE_INAD|ZUI_O2_FI_CLIENTE_INAD]] (Executar `Unpublish` e `Publish` no Service Binding OData V2 para atualizar o `$metadata` com a chave tripla) ✅ 2026-11-18
