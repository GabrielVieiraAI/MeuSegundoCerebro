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
  - abap-cloud
  - del-r2r-009
  - guia-implementacao
id_demanda: DEL-R2R-009
revisao: Code Review 1
item_cr: CR-105
data: 2026-11-19
sap_destination: Veiling_S4D_100_GVSOUZA_PT
transport_requests:
  - S4DK900952 - DEL-R2R-009 - Bloqueio e Desbloqueio de Inadimplentes
aliases:
  - CR-105 - Guia de Implementação
  - DEL-R2R-009 - CR-105 - Guia de Implementação
---

# 🛠️ DEL-R2R-009 · CR-105: Guia Passo a Passo de Implementação (Code Review)

⬅️ [[CR-105 - Hardcode nas CDS Views e no Authority-Check|Voltar para o Item CR-105]] | 🗺️ [[00 - DEL-R2R-009 - Escada Code Review 1.excalidraw|Escada do Code Review]] | 🏛️ [[DEL-R2R-009 - Arquitetura e Objetos|Arquitetura e Objetos]]

---

## 📌 1. Resumo Técnico do Ajuste (CR-105)

* **Apontamento do Code Review:** As **CDS** (*Core Data Services*) e o *Behavior Pool* possuíam regras de negócio fixas no código (*hardcode*): empresa `'CVH1'` em `ZI_FI_TITULOS_VENCIDOS` e no `AUTHORITY-CHECK` da classe; segmento `'1000'`, classe excluída `'5'` (divergindo da classe ABAP, que já lia a tabela de parâmetros) e tipo de relação `'UKM001'` em `ZI_FI_PARCEIRO_CREDITO`; classes `'1A'`/`'2A'` e limite `500,01` na avaliação da régua em `ZI_FI_GRUPO_INADIMPLENTE`; relação `'UKM001'` em `obter_grupo_economico`; e a constante sem uso `gc_segmento_credito` declarada em `ZCLFI_BP_CLIENTE_INAD`.
* **Solução Técnica Aplicada:** Centralizados os 7 parâmetros no **App Tabela de Parâmetros** (`Modulo = 'FI'`, `Chave1 = 'DEL_R2R_009'`), consumidos via `ZI_CA_GET_PARAMETER` nas CDS Views (`ZI_FI_TITULOS_VENCIDOS`, `ZI_FI_PARCEIRO_CREDITO` e `ZI_FI_GRUPO_INADIMPLENTE`) e via **zclca_tabela_parametros\=>get_instance( )** na classe `ZCLFI_BP_CLIENTE_INAD`; exposto o atributo não-chave `CompanyCode` em `ZI_FI_PARCEIRO_CREDITO`, `ZI_FI_GRUPO_INADIMPLENTE`, `ZI_FI_CLIENTE_INADIMPLENTE` e `ZC_FI_CLIENTE_INADIMPLENTE` (`@UI.hidden: true`); ajustado o `AUTHORITY-CHECK` do objeto `ZFI_BLOQ` em `get_instance_authorizations` para validar dinamicamente o `CompanyCode` do registro selecionado; parametrizado o tipo de vínculo na `BUT050` em `obter_grupo_economico`; e removida a constante não utilizada `gc_segmento_credito`.

---

## 🚀 2. Detalhamento Passo a Passo por Fase

> [!NOTE] Guia de Execução e Classificação dos Passos (`[MCP]` vs. `[Manual]`)
> Esta checklist representa a **ordem cronológica exata de dependências técnicas** para aplicar o ajuste deste item de Code Review. Cada passo aponta diretamente para a nota individual do objeto na pasta `04 - Objetos Tecnicos`, já atualizada com os **Metadados ADT** e os snippets de código finais (`📝 Código Comentado` e `🚀 Código Limpo`).
> - **`[MCP]`:** passo executável de forma automatizada no ambiente `DEV` via servidor **MCP** (*Model Context Protocol*) `sap-adt`.
> - **`[Manual]`:** passo 100% executado pelo desenvolvedor humano no **ADT** (*ABAP Development Tools*), **SAP GUI** ou **BAS** (*SAP Business Application Studio*).
> - **`[Ativação em Massa: Ctrl + Shift + F3]`:** sinaliza grupos com dependência circular mútua (ou alterações simultâneas de chave/assinatura entre objetos dependentes) que precisam ser criados/editados em conjunto antes da ativação em lote.

### Fase 0: Pré-Requisito Funcional — Cadastro no App Tabela de Parâmetros
> **Objetivo:** Garantir que os 7 parâmetros corporativos sob `Modulo = 'FI'` e `Chave1 = 'DEL_R2R_009'` estejam cadastrados no ambiente antes da consulta das CDS Views.

- [x] Passo 1 `[Manual]` — Conferir/Cadastrar os 7 parâmetros da demanda (`BUKRS/EMPRESA`, `CREDIT_SGMNT/SEGMENTO`, `RELTYP/GRUPO`, `RISK_CLASS/A_VISTA`, `RISK_CLASS/A_PRAZO`, `RISK_CLASS/EXCLUIR` e `LIMITE_CORTE/A_PRAZO`) no App Tabela de Parâmetros conforme [[02 - DEL-R2R-009 - Configuração da Tabela de Parâmetros|02 - DEL-R2R-009 - Configuração da Tabela de Parâmetros]] ✅ 2026-11-19

---

### Fase 1: Camada de Modelagem de Dados — CDS Views de Base, Auxiliar, Raiz e Projeção
> **Objetivo:** Substituir todos os literais fixos das CDS Views pela leitura centralizada de `ZI_CA_GET_PARAMETER` e propagar o atributo `CompanyCode` até a camada de consumo sem alterar a chave tripla do modelo **RAP** (*ABAP RESTful Application Programming Model*).

- [x] Passo 2 `[MCP]` — Atualizar [[04 - ZI_FI_TITULOS_VENCIDOS|ZI_FI_TITULOS_VENCIDOS]] (Substituir o filtro fixo `CompanyCode = 'CVH1'` por `inner join` com `ZI_CA_GET_PARAMETER` em `FI` / `DEL_R2R_009` / `BUKRS` / `EMPRESA`) ✅ 2026-11-19
- [x] Passo 3 `[MCP]` — Atualizar [[05 - ZI_FI_PARCEIRO_CREDITO|ZI_FI_PARCEIRO_CREDITO]] (Expor `CompanyCode` parametrizado e substituir segmento `'1000'`, relação `'UKM001'` e exclusão da classe `'5'` por junções com `ZI_CA_GET_PARAMETER` nos dois ramos do `union`) ✅ 2026-11-19
- [x] Passo 4 `[MCP]` — Atualizar [[15 - ZI_FI_GRUPO_INADIMPLENTE|ZI_FI_GRUPO_INADIMPLENTE]] (Incluir `CompanyCode` no cruzamento com títulos e parametrizar as classes `A_VISTA`, `A_PRAZO` e o limite de corte `LIMITE_CORTE/A_PRAZO` via `ZI_CA_GET_PARAMETER`) `[Ativação em Massa: Ctrl + Shift + F3]` ✅ 2026-11-19
- [x] Passo 5 `[MCP]` — Atualizar [[06 - ZI_FI_CLIENTE_INADIMPLENTE (CDS)|ZI_FI_CLIENTE_INADIMPLENTE (CDS)]] (Expor `Parceiro.CompanyCode` como atributo não-chave e incluir `CompanyCode` nos `left outer joins` com `ZI_FI_TITULOS_VENCIDOS` e `ZI_FI_GRUPO_INADIMPLENTE`) `[Ativação em Massa: Ctrl + Shift + F3]` ✅ 2026-11-19
- [x] Passo 6 `[MCP]` — Atualizar [[09 - ZC_FI_CLIENTE_INADIMPLENTE (CDS)|ZC_FI_CLIENTE_INADIMPLENTE (CDS)]] (Projetar o atributo `CompanyCode` com `@UI.hidden: true`) `[Ativação em Massa: Ctrl + Shift + F3]` ✅ 2026-11-19

---

### Fase 2: Camada de Comportamento de Negócio (RAP — Behavior Pool)
> **Objetivo:** Eliminar a constante sem uso `gc_segmento_credito`, validar o objeto de autorização `ZFI_BLOQ` usando dinamicamente o `CompanyCode` do registro selecionado e parametrizar o tipo de relação na `BUT050` em `obter_grupo_economico`.

- [x] Passo 7 `[MCP]` — Atualizar [[08 - ZCLFI_BP_CLIENTE_INAD|ZCLFI_BP_CLIENTE_INAD]] (Remover `gc_segmento_credito`, ler `CompanyCode` da instância selecionada para o `AUTHORITY-CHECK` de `ZFI_BLOQ` em `get_instance_authorizations` e ler o *range* `RELTYP/GRUPO` via `zclca_tabela_parametros` em `obter_grupo_economico` na aba `Local Types`) ✅ 2026-11-19