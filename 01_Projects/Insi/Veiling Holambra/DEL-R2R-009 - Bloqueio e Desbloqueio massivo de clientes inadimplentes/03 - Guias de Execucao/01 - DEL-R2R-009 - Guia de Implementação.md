---
tags:
  - projeto
  - insi
  - veiling-holambra
  - sap
  - fi-ar
  - fscm
  - rap
  - abap-cloud
  - del-r2r-009
  - guia-implementacao
id_demanda: DEL-R2R-009
tipo: guia-implementacao
data: 2026-10-27

aliases:
  - "DEL-R2R-009 - Guia de Implementação"
---

# 🚀 DEL-R2R-009 · Guia Passo a Passo de Implementação (Ordem de Criação)

⬅️ [[DEL-R2R-009 - Arquitetura e Objetos|Arquitetura e Objetos]] | 🧪 [[03 - DEL-R2R-009 - Guia de Testes e Homologação|Guia de Testes e Homologação]] | 🎨 [[02 - DEL-R2R-009 - Fluxo de Implementação.excalidraw|Fluxo de Implementação (Excalidraw)]] | 🎨 [[01 - DEL-R2R-009 - Arquitetura da Camada CDS.excalidraw|Diagrama de Arquitetura (Excalidraw)]] | 📋 [[03 - Consolidado de decisões tomadas em todas as reuniões|Decisões Consolidadas]]

---

🎨 **Diagrama Visual do Fluxo (Passos 01 a 14):**
[[02 - DEL-R2R-009 - Fluxo de Implementação.excalidraw| Abrir fluxo no Excalidraw]]
![[02 - DEL-R2R-009 - Fluxo de Implementação.excalidraw| Abrir fluxo no Excalidraw]]

---

## 🛠️ Detalhamento Passo a Passo por Fase

###  Fase 1: Fundação, Segurança e Dicionário de Dados
> **Objetivo:** Criar todos os objetos de suporte que não dependem de ninguém, mas que serão chamados pelo código ABAP mais adiante.

- [x] Passo 1 — Criar a tabela de auditoria [[01 - ZTFI_LOG_INADIMP|ZTFI_LOG_INADIMP]] ✅ 2026-10-28
- [x] Passo 2 — Criar a classe de mensagens [[03 - ZFI_INADIMPLENCIA|ZFI_INADIMPLENCIA]] ✅ 2026-10-28
- [x] Passo 3 — Criar o objeto de autorização [[02 - ZFI_BLOQ|ZFI_BLOQ]] ✅ 2026-10-28

---

###  Fase 2: Camada de Modelagem de Dados — CDS Views de Base
> **Objetivo:** Construir e validar separadamente a extração financeira (FI-AR) e a extração de crédito/hierarquia (FSCM/BP).

- [x] Passo 4 — Criar a CDS de títulos [[04 - ZI_FI_TITULOS_VENCIDOS|ZI_FI_TITULOS_VENCIDOS]] ✅ 2026-10-27
- [x] Passo 5 — Criar a CDS de crédito [[05 - ZI_FI_PARCEIRO_CREDITO|ZI_FI_PARCEIRO_CREDITO]] ✅ 2026-10-27

---

###  Fase 3: Camada de Modelagem de Dados — CDS Raiz, Projeção e MDE
> **Objetivo:** Unificar as visões de base na entidade raiz do modelo RAP, aplicar a régua de sugestão (`AcaoProposta`) e configurar o layout da tela.

- [x] Passo 6 — Criar a CDS Raiz [[06 - ZI_FI_CLIENTE_INADIMPLENTE (CDS)|ZI_FI_CLIENTE_INADIMPLENTE]] ✅ 2026-10-27
- [x] Passo 7 — Criar a CDS de Projeção [[09 - ZC_FI_CLIENTE_INADIMPLENTE (CDS)|ZC_FI_CLIENTE_INADIMPLENTE]] ✅ 2026-10-27
- [x] Passo 8 — Criar a Metadata Extension [[10 - ZC_FI_CLIENTE_INADIMPLENTE (MDE)|ZC_FI_CLIENTE_INADIMPLENTE (MDE)]] ✅ 2026-10-27

---

###  Fase 4: Camada de Comportamento de Negócio (RAP - BDEF e ABAP)
> **Objetivo:** Declarar e programar os botões **Bloquear** e **Desbloquear** em massa.

- [x] Passo 9 — Criar o BDEF Raiz [[07 - ZI_FI_CLIENTE_INADIMPLENTE (BDEF)|ZI_FI_CLIENTE_INADIMPLENTE (BDEF)]] ✅ 2026-10-27
- [x] Passo 10 — Gerar e implementar a classe [[08 - ZCLFI_BP_CLIENTE_INAD|ZCLFI_BP_CLIENTE_INAD]] ✅ 2026-10-27
- [x] Passo 11 — Criar o BDEF de Projeção [[11 - ZC_FI_CLIENTE_INADIMPLENTE (BDEF)|ZC_FI_CLIENTE_INADIMPLENTE (BDEF)]] ✅ 2026-10-27

---

###  Fase 5: Camada de Serviço e Exposição (OData V2)
> **Objetivo:** Publicar o serviço OData V2 e testar toda a aplicação no navegador antes mesmo de criar o projeto Fiori no BAS.

- [x] Passo 12 — Criar o Service Definition [[12 - ZUI_FI_CLIENTE_INAD|ZUI_FI_CLIENTE_INAD]] ✅ 2026-10-27
- [x] Passo 13 — Criar e publicar o Service Binding [[13 - ZUI_O2_FI_CLIENTE_INAD|ZUI_O2_FI_CLIENTE_INAD]] ✅ 2026-10-27

---

###  Fase 6: Camada Frontend (SAP Fiori Elements & Launchpad)
> **Objetivo:** Gerar o aplicativo Fiori definitivo no BAS, fazer deploy no servidor ABAP e liberar os catálogos para os usuários.

- [x] Passo 14 — Gerar e publicar o App [[14 - bloqinadimplente (App Fiori)|bloqinadimplente]] ✅ 2026-10-28

---

## 📌 Anexo: Parâmetro do App Solicitado pelo Consultor (Tabela de Parâmetros)

> **Objetivo desta seção:** Registrar a parametrização formal solicitada pela consultoria no documento de especificação (BPDD / Slide 19 do delta) e alinhada com o consultor Maycon para validação com o supervisor técnico da criação da **Tabela Z de Parâmetros de Classes de Risco**.
> 📖 **Procedimento Passo a Passo no App:** Veja o guia detalhado de cadastro na nota [**`DEL-R2R-009 - Configuração da Tabela de Parâmetros.md`**](file:///c:/Users/gabriel.vsouza/source/MeuSegundoCerebro/01_Projects/Insi/Veiling%20Holambra/DEL-R2R-009%20-%20Bloqueio%20e%20Desbloqueio%20massivo%20de%20clientes%20inadimplentes/DEL-R2R-009%20-%20Configura%C3%A7%C3%A3o%20da%20Tabela%20de%20Par%C3%A2metros.md).

### 📋 Mapeamento do Parâmetro Exclusivo da Especificação

|   #    | Parâmetro de Negócio                                          | Valor Atual no Código                                             | Onde está localizado hoje                                                           | Requisito do BPDD & Impacto / Por que parametrizar?                                                                                                                                                                          |
| :----: | :------------------------------------------------------------ | :---------------------------------------------------------------- | :---------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **01** | **Relação Classe de Risco x Perfil e Exclusões da Avaliação** | Avalia `1A` (À Vista), `2A` (A Prazo)<br>Exclui `5` (CVH Interna) | `ZI_FI_PARCEIRO_CREDITO` (linha 92) e `ZI_FI_CLIENTE_INADIMPLENTE` (linhas 104-111) | **Requisito formal do Slide 19 do BPDD:** A Veiling já alterou as classes no passado (tinham 9) e pode cadastrar novas classes (ex.: `3A` A Prazo Premium) ou novas contas internas sem exigir alteração de código ABAP/CDS. |

---

### 💡 Sugestão de Estrutura para Discutir com o Supervisor

Para atender estritamente ao requisito do consultor, a tabela de parâmetros deve gerenciar apenas o **de-para de classes de risco, seu perfil operacional e o indicador de avaliação**:

* **Tabela Customizada Sugerida:** `ZTFI_PARAM_RISCO` (ou `ZTFI_CLASSE_RISCO`)
* **Campos da Tabela:**
  * `MANDT` *(Chave)*: Mandante do sistema;
  * `RISK_CLASS` *(Chave)*: Código da classe de risco do FSCM (ex.: `'1A'`, `'2A'`, `'5'`);
  * `PERFIL`: Perfil operacional do cliente (`'V'` = À Vista, `'P'` = A Prazo, `' '` = Sem perfil de compra);
  * `AVALIAR_INAD`: Flag de elegibilidade (`'X'` = Avalia inadimplência no app, `' '` = Desconsidera do app, como a classe interna `'5'`);
  * `DESCRICAO`: Texto breve descritivo (ex.: *"À Vista"*, *"A Prazo"*, *"CVH Interna"*).

> [!NOTE] Funcionamento na Arquitetura CDS
> 1. A CDS `ZI_FI_PARCEIRO_CREDITO` faz um `INNER JOIN` com esta tabela filtrando apenas onde `AVALIAR_INAD = 'X'`, eliminando a classe `'5'` (ou qualquer nova conta interna cadastrada) de forma 100% dinâmica.
> 2. A CDS Raiz `ZI_FI_CLIENTE_INADIMPLENTE` avalia o campo `PERFIL` (`'V'` ou `'P'`) para aplicar a régua de bloqueio (R$ 0,00 ou R$ 500,01 fixos no código conforme o BPDD), desacoplando o código dos códigos literais `'1A'` e `'2A'`.
