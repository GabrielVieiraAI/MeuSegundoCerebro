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
---

# 🚀 DEL-R2R-009 · Guia Passo a Passo de Implementação (Ordem de Criação)

⬅️ [[DEL-R2R-009 - Arquitetura e Objetos|Arquitetura e Objetos]] | 🎨 [[DEL-R2R-009 - Fluxo de Implementação.excalidraw|Fluxo de Implementação (Excalidraw)]] | 🎨 [[DEL-R2R-009 - Arquitetura da Camada CDS.excalidraw|Diagrama de Arquitetura (Excalidraw)]] | 📋 [[Consolidado de decisões tomadas em todas as reuniões|Decisões Consolidadas]]

---

🎨 **Diagrama Visual do Fluxo (Passos 01 a 14):**
[[DEL-R2R-009 - Fluxo de Implementação.excalidraw| Abrir fluxo no Excalidraw]]
![[DEL-R2R-009 - Fluxo de Implementação.excalidraw| Abrir fluxo no Excalidraw]]

---

## 🛠️ Detalhamento Passo a Passo por Fase

###  Fase 1: Fundação, Segurança e Dicionário de Dados
> **Objetivo:** Criar todos os objetos de suporte que não dependem de ninguém, mas que serão chamados pelo código ABAP mais adiante.

- [x] **Passo 1 — Criar a tabela de auditoria [[ZTFI_LOG_INADIMP]]** ✅ 2026-10-27
  - **Caminho no Eclipse ADT:** `New -> Other ABAP Repository Object -> Core Data Services -> Database Table`.
  - **Descrição no Assistente ADT:** `DEL-R2R-009: Log Auditoria Bloqueio Inadimplentes` *(49 chars)*
  - **Rótulo no Código (`@EndUserText.label`):** `'DEL-R2R-009: Log Auditoria Inadimplência'` *(39 chars)*
  - **Por que primeiro:** A classe de comportamento fará `INSERT ztfi_log_inadimp` diretamente nela. Como utiliza apenas tipos embutidos (`abap.char`, `abap.curr`, `abap.utclong`) e elementos standard (`sysuuid_x16`, `bu_partner`), ela ativa imediatamente sem dependências.
- [x] **Passo 2 — Criar a classe de mensagens [[ZFI_INADIMPLENCIA]]** ✅ 2026-10-27
  - **Caminho no Eclipse ADT:** `New -> Other ABAP Repository Object -> Texts -> Message Class` (ou transação `SE91` no SAP GUI).
  - **Descrição no Assistente / Short Text:** `DEL-R2R-009: Mensagens Bloqueio Inadimplentes` *(44 chars)*
  - **Por que agora:** Deixa prontas as mensagens `001` a `007` que serão referenciadas na classe ABAP.
- [x] **Passo 3 — Criar o objeto de autorização [[ZFI_BLOQ]]** ✅ 2026-10-27
  - **Caminho:** Transação `SU21` no SAP GUI (ou `New -> Authorization Object` no ADT).
  - **Descrição / Texto Breve:** `DEL-R2R-009: Aut. Bloqueio Clientes Inadimplentes` *(48 chars)*
  - **Classe de Objetos (Object Class):** `ZFI` (ou classe dedicada de autorizações financeiras)
  - **Por que agora:** Permite que o comando `AUTHORITY-CHECK OBJECT 'ZFI_BLOQ'` seja validado sem avisos pelo compilador ABAP.

---

###  Fase 2: Camada de Modelagem de Dados — CDS Views de Base
> **Objetivo:** Construir e validar separadamente a extração financeira (FI-AR) e a extração de crédito/hierarquia (FSCM/BP).

- [x] **Passo 4 — Criar a CDS de títulos [[ZI_FI_TITULOS_VENCIDOS]]** ✅ 2026-10-27
  - **Caminho no Eclipse ADT:** `New -> Data Definition` (Template: `Define View Entity`).
  - **Descrição no Assistente ADT:** `DEL-R2R-009: Agregação Títulos Vencidos por Cliente` *(51 chars)*
  - **Rótulo no Código (`@EndUserText.label`):** `'DEL-R2R-009: Agregação Títulos Vencidos'` *(39 chars)*
  - **O que validar (`F8 - Data Preview`):**
    1. Verificar se apenas partidas em aberto (`ClearingDate` vazio) e vencidas (`NetDueDate < data atual`) da empresa `CVH1` estão sendo somadas.
    2. Confirmar que o `GROUP BY` gera exatamente **1 linha por cliente** (`Customer`).
- [x] **Passo 5 — Criar a CDS de crédito [[ZI_FI_PARCEIRO_CREDITO]]** ✅ 2026-10-27
  - **Caminho no Eclipse ADT:** `New -> Data Definition` (Template: `Define View Entity`).
  - **Descrição no Assistente ADT:** `DEL-R2R-009: Parceiro e Crédito FSCM Segmento 1000` *(50 chars)*
  - **Rótulo no Código (`@EndUserText.label`):** `'DEL-R2R-009: Parceiro e Crédito FSCM'` *(37 chars)*
  - **O que validar (`F8 - Data Preview`):**
    1. Verificar se clientes da classe `5` (CVH Interna) foram filtrados.
    2. Conferir se para filiais o campo `PartnerMatriz` traz a Matriz e `PartnerOrigem` traz a filial, e se para matrizes ambos trazem o código da própria Matriz.

---

###  Fase 3: Camada de Modelagem de Dados — CDS Raiz, Projeção e MDE
> **Objetivo:** Unificar as visões de base na entidade raiz do modelo RAP, aplicar a régua de sugestão (`AcaoProposta`) e configurar o layout da tela.

- [x] **Passo 6 — Criar a CDS Raiz [[ZI_FI_CLIENTE_INADIMPLENTE (CDS)|ZI_FI_CLIENTE_INADIMPLENTE]]** ✅ 2026-10-27
  - **Caminho no Eclipse ADT:** `New -> Data Definition` (Template: `Define Root View Entity`).
  - **Descrição no Assistente ADT:** `DEL-R2R-009: Clientes Inadimplentes e Régua Crédito` *(51 chars)*
  - **Rótulo no Código (`@EndUserText.label`):** `'DEL-R2R-009: Clientes Inadimplentes'` *(36 chars)*
  - **O que validar (`F8 - Data Preview`):**
    1. Verificar se clientes bloqueados por outros motivos (`BlockReason <> ''` e `BlockReason <> '10'`) não aparecem na lista.
    2. Conferir se a coluna `AcaoProposta` exibe `Bloquear` (para não bloqueados que atingiram a régua `1A`/`2A`) e `Desbloquear` (para bloqueados com motivo `10` sem atraso).
- [x] **Passo 7 — Criar a CDS de Projeção [[ZC_FI_CLIENTE_INADIMPLENTE (CDS)|ZC_FI_CLIENTE_INADIMPLENTE]]** ✅ 2026-10-27
  - **Caminho no Eclipse ADT:** `New -> Data Definition` (Template: `Define Root View Entity` / `Projection`).
  - **Descrição no Assistente ADT:** `DEL-R2R-009: Projeção de Clientes Inadimplentes` *(46 chars)*
  - **Rótulo no Código (`@EndUserText.label`):** `'DEL-R2R-009: Projeção Inadimplentes'` *(35 chars)*
  - **Dica técnica para Júnior:** Se ao ativar a Projection View no Passo 7 o Eclipse exibir erro na linha `provider contract transactional_query` dizendo que a Root ainda não tem Behavior Definition, basta comentar essa linha para ativar o Passo 7 e descomentá-la logo após o Passo 9.
- [x] **Passo 8 — Criar a Metadata Extension [[ZC_FI_CLIENTE_INADIMPLENTE (MDE)|ZC_FI_CLIENTE_INADIMPLENTE (MDE)]]** ✅ 2026-10-27
  - **Caminho no Eclipse ADT:** Clique com o botão direito sobre `ZC_FI_CLIENTE_INADIMPLENTE` -> `New Metadata Extension`.
  - **Descrição no Assistente ADT:** `DEL-R2R-009: Metadados UI Clientes Inadimplentes` *(48 chars)*
  - **Extended Entity:** `ZC_FI_CLIENTE_INADIMPLENTE`
  - **Template:** `annotateEntity`
  - **Por que aqui:** Mantém todas as anotações `@UI` separadas da CDS de projeção, definindo colunas, filtros e os dois botões de ação na barra da tabela.

---

###  Fase 4: Camada de Comportamento de Negócio (RAP - BDEF e ABAP)
> **Objetivo:** Declarar e programar os botões **Bloquear** e **Desbloquear** em massa.

- [x] **Passo 9 — Criar o BDEF Raiz [[ZI_FI_CLIENTE_INADIMPLENTE (BDEF)|ZI_FI_CLIENTE_INADIMPLENTE (BDEF)]]** ✅ 2026-10-27
  - **Caminho no Eclipse ADT:** Clique com o botão direito sobre a CDS Raiz `ZI_FI_CLIENTE_INADIMPLENTE` -> `New Behavior Definition` (Tipo: `Managed` ou padrão).
  - **Descrição no Assistente ADT:** `DEL-R2R-009: Comportamento Clientes Inadimplentes` *(48 chars)*
  - **O que fazer:** Copiar o snippet da nota [[ZI_FI_CLIENTE_INADIMPLENTE (BDEF)]] (definindo cenário `unmanaged`) e ativar (`Ctrl + F3`).
- [x] **Passo 10 — Gerar e implementar a classe [[ZCLFI_BP_CLIENTE_INAD]]** ✅ 2026-10-27
  - **Dica de Ouro no Eclipse ADT:** Não crie a classe manualmente pelo menu *New ABAP Class*! Dentro do editor do BDEF Raiz (Passo 9), posicione o cursor sobre o nome `zclfi_bp_cliente_inad` e pressione **`Ctrl + 1` (Quick Fix)** -> clique duas vezes em **"Create behavior implementation class zclfi_bp_cliente_inad"**.
  - **Descrição no Assistente / Propriedades:** `DEL-R2R-009: Handler Bloqueio/Desbloqueio Inad.` *(47 chars)*
  - **Vantagem:** O próprio Eclipse cria a classe global e a aba *Local Types* já com a declaração exata da classe `lhc_clienteinadimplente` e dos métodos `get_instance_authorizations`, `bloquearCliente` e `desbloquearCliente`. Depois, basta colar a implementação dos métodos conforme a nota [[ZCLFI_BP_CLIENTE_INAD]].
- [x] **Passo 11 — Criar o BDEF de Projeção [[ZC_FI_CLIENTE_INADIMPLENTE (BDEF)|ZC_FI_CLIENTE_INADIMPLENTE (BDEF)]]** ✅ 2026-10-27
  - **Caminho no Eclipse ADT:** Clique com o botão direito sobre a CDS de Projeção `ZC_FI_CLIENTE_INADIMPLENTE` -> `New Behavior Definition` (Tipo: `Projection`).
  - **Descrição no Assistente ADT:** `DEL-R2R-009: Projeção Comportamento Inadimplentes` *(48 chars)*
  - **O que fazer:** Declarar `use action bloquearCliente;` e `use action desbloquearCliente;` e ativar.

---

###  Fase 5: Camada de Serviço e Exposição (OData V2)
> **Objetivo:** Publicar o serviço OData V2 e testar toda a aplicação no navegador antes mesmo de criar o projeto Fiori no BAS.

- [x] **Passo 12 — Criar o Service Definition [[ZUI_FI_CLIENTE_INAD]]** ✅ 2026-10-27
  - **Caminho no Eclipse ADT:** Clique com o botão direito sobre `ZC_FI_CLIENTE_INADIMPLENTE` -> `New Service Definition`.
  - **Descrição no Assistente ADT:** `DEL-R2R-009: Serviço UI Clientes Inadimplentes` *(45 chars)*
  - **Rótulo no Código (`@EndUserText.label`):** `'DEL-R2R-009: Serviço Clientes Inadimp.'` *(38 chars)*
- [x] **Passo 13 — Criar e publicar o Service Binding [[ZUI_O2_FI_CLIENTE_INAD]]** ✅ 2026-10-27
  - **Caminho no Eclipse ADT:** Clique com o botão direito sobre `ZUI_FI_CLIENTE_INAD` -> `New Service Binding`.
  - **Descrição no Assistente ADT:** `DEL-R2R-009: Service Binding OData V2 Inadimplentes` *(50 chars)*
  - **Importante:** Selecionar **Binding Type: `OData V2 - UI`**.
  - **Como testar tudo agora:**
    1. Ative o Service Binding (`Ctrl + F3`).
    2. Clique no botão **Publish** (aguarde o status mudar para *Published*).
    3. Selecione a entidade `ClienteInadimplente` na lista e clique no botão **Preview...**.
    4. O navegador abrirá o aplicativo Fiori Elements conectado ao backend: teste os filtros, a ordenação por `Ação Proposta` e clique nos botões **Bloquear** e **Desbloquear**, conferindo em seguida na tabela [[ZTFI_LOG_INADIMP]] se o log foi gravado!

---

###  Fase 6: Camada Frontend (SAP Fiori Elements & Launchpad)
> **Objetivo:** Gerar o aplicativo Fiori definitivo no BAS, fazer deploy no servidor ABAP e liberar os catálogos para os usuários.

- [ ] **Passo 14 — Gerar e publicar o App [[bloqinadimplente (App Fiori)|bloqinadimplente]]**
  - **No SAP Business Application Studio (BAS) / VS Code:**
    1. Abrir o *Application Generator* -> selecionar template **List Report Page**.
    2. Selecionar o sistema SAP e o serviço OData V2 **`ZUI_O2_FI_CLIENTE_INAD`**.
    3. **Título da Aplicação (Título do Bloco / Tile):** `Bloquear/Desbloquear Clientes Inadimplentes`
    4. No `manifest.json`, garantir que `"multiSelect": true` está configurado na tabela para permitir seleção de múltiplos clientes em lote.
    5. Executar o comando de deploy (`npm run deploy`) gerando a aplicação BSP **`ZZ1_BLOQ_INAD`** no pacote de transporte.
    6. Configurar no Fiori Launchpad Designer / Maintenance os catálogos `ZTC_FI_INADIMPLENCIA`, `ZBC_FI_INADIMPLENCIA`, o grupo `ZGP_FI_INADIMPLENCIA` e associar à Role `PFCG` contendo o objeto [[ZFI_BLOQ]].

---

## 📌 Anexo: Parâmetros do App para Validação com o Supervisor (Tabela de Parâmetros)

> **Objetivo desta seção:** Registrar todos os valores e regras que atualmente estão fixos (*hardcoded*) nas CDS Views e Classes ABAP para você validar com seu supervisor/líder técnico a viabilidade ou necessidade de criar uma **Tabela Z de Parâmetros / Regras de Crédito** no projeto.

### 📋 Mapeamento de Parâmetros Atuais do Aplicativo

| # | Parâmetro de Negócio | Valor Atual no Código | Onde está localizado hoje | Impacto / Por que parametrizar? |
| :-: | :--- | :--- | :--- | :--- |
| **01** | **Valor de corte para Classe `2A` (A Prazo)** | `R$ 500,01` | `ZI_FI_CLIENTE_INADIMPLENTE` (linha 87 e 93) | Se a diretoria mudar a tolerância de R$ 500,01 para outro valor, hoje exige alteração de código CDS e transporte de TR. |
| **02** | **Valor de corte para Classe `1A` (À Vista)** | `> R$ 0,00` | `ZI_FI_CLIENTE_INADIMPLENTE` (linha 86 e 92) | Permite ajustar o valor mínimo de corte para clientes que compram à vista. |
| **03** | **Dias de atraso mínimos para bloqueio** | `1 dia` (`> 0 dias`) | `ZI_FI_TITULOS_VENCIDOS` (filtro `NetDueDate < sy-datum`) | Caso o negócio queira dar 2 ou 3 dias de tolerância bancária antes de propor o bloqueio. |
| **04** | **Motivo de Bloqueio de Inadimplência** | `'10'` | `ZI_FI_CLIENTE_INADIMPLENTE` (linha 90) e `ZCLFI_BP_CLIENTE_INAD` | Código standard do FSCM atribuído no bloqueio e validado no desbloqueio. |
| **05** | **Segmento de Crédito Avaliado** | `'1000'` | `ZI_FI_PARCEIRO_CREDITO` (linha 77) e `ZCLFI_BP_CLIENTE_INAD` | Segmento de crédito do FSCM da Veiling Holambra. |
| **06** | **Empresa Contábil Padrão (Bukrs)** | `'CVH1'` | `ZI_FI_TITULOS_VENCIDOS` (filtro WHERE) e `ZCLFI_BP_CLIENTE_INAD` (Authority-Check) | Caso a cooperativa adote uma nova empresa contábil no grupo no futuro. |
| **07** | **Classes de Risco Avaliadas vs. Excluídas** | Avalia `1A`, `2A`<br>Exclui `5` | `ZI_FI_PARCEIRO_CREDITO` (filtro WHERE `risk_class <> '5'`) | Se forem criadas novas classes de risco (`3A`, `1B`, etc.) ou novas contas internas a desconsiderar. |
| **08** | **Categoria de Relação Matriz x Filial** | `'UKM001'` | `ZI_FI_PARCEIRO_CREDITO` (join com `BUT050`) | Categoria standard de crédito utilizada na hierarquia de parceiros. |

---

### 💡 Sugestão de Estrutura para Discutir com o Supervisor

Se o supervisor aprovar a criação de uma tabela de parametrização, a sugestão mais limpa e moderna (*Clean Core*) é criar a tabela **`ZTFI_REGRA_RISCO`**:
* **Chave:** `MANDT`, `RISK_CLASS` (ex.: `1A`, `2A`);
* **Campos:** `VALOR_MINIMO` (ex.: `0.01` ou `500.01`), `DIAS_MINIMO` (ex.: `1`), `BLOCK_REASON` (ex.: `'10'`).

Isso tornaria a CDS View totalmente dinâmica via um simples `LEFT OUTER JOIN` nessa tabela, permitindo ao time funcional gerenciar a régua de inadimplência pela manutenção da tabela sem depender de novas manutenções no código ABAP.
