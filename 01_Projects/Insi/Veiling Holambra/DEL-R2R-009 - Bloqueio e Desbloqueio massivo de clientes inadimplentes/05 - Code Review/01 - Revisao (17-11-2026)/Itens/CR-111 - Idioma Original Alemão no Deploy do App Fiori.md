---
tags:
  - projeto
  - insi
  - veiling-holambra
  - sap
  - code-review
  - del-r2r-009
  - recomendado
id_demanda: DEL-R2R-009
revisao: Code Review 1
request: S4DK900952
tarefa: S4DK900953
item_cr: CR-111
prioridade: Recomendado (Ponto de Atenção)
status: concluido
data: 2026-11-18
sap_destination: ""
transport_requests: []
---

# 🟡 CR-111: Idioma Original Alemão (DE) no Deploy do App Fiori (ZZ1_BLOQ_INAD)

🗺️ [[00 - DEL-R2R-009 - Escada Code Review 1.excalidraw|Voltar para a Escada]] | 📄 [[Code Review 1.pdf|PDF Original]] | ⬅️ [[CR-110 - Retirar Interfaces de Outra Demanda da Request|CR-110]] | ➡️ [[CR-112 - Ajustes na Tabela ZTFI_LOG_INADIMP|CR-112]]

---

## 1. O que está sendo apontado (Linguagem de Negócio)

O aplicativo publicado no painel do usuário foi gerado com o idioma original configurado como **Alemão**, em vez do padrão **Português** exigido pela empresa:

* **Desconformidade com o padrão de idioma do ambiente:** Embora o nome do aplicativo esteja correto, ter o idioma original registrado em alemão foge à regra de governança do projeto e pode causar inconsistências na exibição de textos ou em futuras manutenções realizadas em português.

---

## 2. O que eu preciso fazer (Linguagem de Negócio)

Para adequar o aplicativo publicado no painel do usuário ao padrão oficial de governança da cooperativa e evitar divergências de idioma em textos e manutenções futuras, devem ser realizados os seguintes passos:

1. **Definir o Português como idioma original do aplicativo publicado e de seus componentes:**
   * Ajustar o cadastro do aplicativo publicado (ou republicá-lo estando conectado em português) para que o idioma original dele e de seus arquivos de interface passe de **Alemão** para **Português**.
2. **Validar a exibição da tela após o ajuste:**
   * Conferir a abertura do aplicativo em português garantindo que todos os títulos, colunas, filtros e botões continuem sendo apresentados normalmente ao usuário final.

---

## 3. Plano de Ação

### O que será feito em cada objeto

1. **[[14 - bloqinadimplente (App Fiori)|bloqinadimplente (App Fiori)]] *(Aplicação SAPUI5 — SAP User Interface for HTML5 — e objetos do deploy — Ajustar `[Manual]`)*:**
   * **Escopo da correção (4 objetos na request `S4DK900952` / tarefa `S4DK900953`, pacote `ZFI_BLOQ_INADIMPLENTES`):**
     * `R3TR WAPA ZZ1_BLOQ_INAD` — objeto completo de transporte (`R3TR` — *Repository Object*) do tipo `WAPA` (aplicação **BSP** — *Business Server Pages*, contêiner do aplicativo no servidor **ABAP** — *Advanced Business Application Programming*).
     * Dois nós `R3TR SICF` (**SAP Internet Communication Framework** — serviços web em protocolo **HTTP** [*Hypertext Transfer Protocol*] gerados no deploy de `ZZ1_BLOQ_INAD`): `ZZ1_BLOQ_INAD  4SYHDG1LJB52DAKB11MPN5S07` e `ZZ1_BLOQ_INAD  907RM5PM0WS1BRG2HAYGJYC1N`.
     * `R3TR SMIM 02FC10E7A66F1FE1B4D99E490ACDC90A` — objeto do repositório **MIME** (*Multipurpose Internet Mail Extensions* — arquivos estáticos publicados do aplicativo).
   * **Caminho Recomendado (`[Manual]` — Ajuste direto na `SE03` sem redeploy):**
     1. Efetuar logon no **SAP GUI** (*SAP Graphical User Interface* — interface gráfica clássica do SAP) do ambiente **S4D** (sistema de desenvolvimento SAP S/4HANA, mandante `100`) em **Português (`PT`)** e acessar a transação **`SE03`** (*Transport Organizer Tools* — Ferramentas do Organizador de Transportes).
     2. Navegar até *Diretório de objetos* -> *Modificar entradas do diretório de objetos*, filtrando pela **TR** (*Transport Request* — ordem de transporte) **`S4DK900952`** ou pelo pacote **`ZFI_BLOQ_INADIMPLENTES`**.
     3. Localizar os 4 objetos (`R3TR WAPA ZZ1_BLOQ_INAD`, os 2 nós `R3TR SICF` de `ZZ1_BLOQ_INAD` e `R3TR SMIM 02FC10E7A66F1FE1B4D99E490ACDC90A`), alterar o campo **Idioma original** (`TADIR-MASTERLANG`, na tabela **TADIR** — *Directory of Repository Objects*) de **`DE`** (Alemão) para **`PT`** (Português) e gravar as alterações na tarefa **`S4DK900953`**.
     4. Conferir na própria **`SE03`**, na **`SE80`** (*Object Navigator* — navegador de objetos ABAP) ou na tabela **`TADIR`** via **`SE16N`** (*General Table Display* — visualizador geral de tabelas) que os 4 objetos constam com `MASTERLANG = 'PT'` no pacote `ZFI_BLOQ_INADIMPLENTES`.
   * **Caminho Alternativo (`[Manual]` — Redeploy em `PT`, apenas se algum objeto `SMIM`/`SICF` exigir recriação ou houver necessidade de *rebuild*):**
     1. No projeto frontend (`bloqinadimplente`, namespace `br.com.veiling`) aberto no **VS Code** (*Visual Studio Code*) com a extensão **SAP Fiori Tools**, revisar o arquivo `ui5-deploy.yaml` (destino `https://vhcvhs4dci.sap.cvh.com.br:44300`, mandante `100`) garantindo a configuração explícita de idioma em Português (`sap-language=PT`) e logon em **`PT`** na conexão do deploy.
     2. Executar o redeploy (`npm run deploy`) do aplicativo `bloqinadimplente` para o repositório BSP **`ZZ1_BLOQ_INAD`**, pacote **`ZFI_BLOQ_INADIMPLENTES`** e request **`S4DK900952`**.
     3. Conferir na **`SE03` / `SE80`** (ou tabela **`TADIR`** na **`SE16N`**) que todos os 4 objetos (`R3TR WAPA ZZ1_BLOQ_INAD`, os 2 `R3TR SICF` e `R3TR SMIM 02FC10E7A66F1FE1B4D99E490ACDC90A`) ficaram com `MASTERLANG = 'PT'`.
   * **Limpeza de cache e validação funcional em `PT` (`[Manual]`):**
     1. Caso ocorra redeploy pelo **Caminho Alternativo**, executar os programas **`/UI2/INVALIDATE_GLOBAL_CACHES`** (e, se necessário, **`/UI2/INVALIDATE_CLIENT_CACHES`**) pelas transações **`SE38`** ou **`SA38`** (execução de programas ABAP).
     2. Abrir o aplicativo `[[14 - bloqinadimplente (App Fiori)|bloqinadimplente (App Fiori)]]` no **SAP Fiori Launchpad** em **`PT`** e validar a exibição correta dos títulos, filtros, tabela e ações **Bloquear** / **Desbloquear**.

### Dependências / Decisões

* **Classificação e forma de execução (`[Manual]`):** Item exclusivamente **`[Manual]`**, não elegível para `/implementar-cr-simples` nem para `/gerar-guia-code-review-sap` via servidor **MCP** (*Model Context Protocol*) `sap-adt`, pois a alteração de entradas da tabela `TADIR` (`WAPA`, `SICF` e `SMIM`) na `SE03` e o eventual redeploy via VS Code (`npm run deploy`) estão fora do escopo das ferramentas **ADT** (*ABAP Development Tools*).
* **Janela de execução na request `S4DK900952`:** O ajuste deve ser concluído no **S4D** **antes da liberação** da request `S4DK900952` (e da tarefa `S4DK900953`) para o **QAS** (*Quality Assurance System* — ambiente de qualidade), evitando o transporte de objetos com idioma original `DE`.
* **Sequenciamento em caso de redeploy:** Caso seja necessário optar pelo **Caminho Alternativo (redeploy)**, ele deve ser executado somente **após** qualquer alteração eventual em **BDEF** (*Behavior Definition* — definição de comportamento, como `[[07 - ZI_FI_CLIENTE_INADIMPLENTE (BDEF)|ZI_FI_CLIENTE_INADIMPLENTE (BDEF)]]` e `[[11 - ZC_FI_CLIENTE_INADIMPLENTE (BDEF)|ZC_FI_CLIENTE_INADIMPLENTE (BDEF)]]`) ou no serviço **OData** (*Open Data Protocol* — `[[13 - ZUI_O2_FI_CLIENTE_INAD|ZUI_O2_FI_CLIENTE_INAD]]`). Ressalta-se que a diretriz recomendada na [[CR-114 - Habilitação Dinâmica dos Botões (Features Instance)|CR-114]] é **não alterar o BDEF** (preservando a soberania do usuário sobre os botões conforme decisão funcional), tornando o **Caminho Recomendado via `SE03`** a opção mais segura e direta.
* **Atualização documental pós-execução:** Caso seja executado o **Caminho Alternativo** com inclusão explícita de `sap-language=PT` no `ui5-deploy.yaml`, atualizar posteriormente a nota `[[14 - bloqinadimplente (App Fiori)|bloqinadimplente (App Fiori)]]` com essa configuração de deploy.

---

## 4. Teste Pós Ajuste

> Além do roteiro geral de testes do revisor em [[CR-117 - Checklist de Testes no QAS|CR-117]], os cenários abaixo validam diretamente no **S4D** e no **QAS** (*Quality Assurance System* — ambiente de qualidade) a correção de idioma recomendada pelo supervisor técnico referente ao **CR-111**.

### Teste solicitado pelo Supervisor Técnico (ref. ao CR-111)

* **1. Ajuste do idioma original para Português (`PT`) no deploy do app** *(item 11 da Seção 3 e Tabela de Conformidade do [[Code Review 1.pdf|Code Review 1]])* — **Registro:** —
  - [x] **1.1. Conferência na `SE03` / `SE80`:** Inspecionar o idioma original da aplicação **BSP** (*Business Server Pages*) `WAPA ZZ1_BLOQ_INAD`, dos dois nós `SICF` gerados pelo deploy e do objeto `SMIM 02FC10E7A66F1FE1B4D99E490ACDC90A`, confirmando que todos estão configurados com idioma original **`PT`**. ✅ 2026-11-19
  - [x] **1.2. Abertura do aplicativo no QAS em Português:** Após transportar a alteração ao QAS, abrir o aplicativo `[[14 - bloqinadimplente (App Fiori)|bloqinadimplente]]` no Fiori Launchpad com logon em português e validar a exibição correta dos títulos, filtros e botões. ✅ 2026-11-19

### Testes adicionais do que foi implementado aqui (além do pedido pelo supervisor)

* **1. Integridade visual e atualização de cache pós-redeploy** — **Registro:** —
  - [x] **1.1. Regressão das funcionalidades do app:** Confirmar que seleção múltipla (`multiSelect`), barra de ações (**Bloquear** / **Desbloquear**) e exibição do *Message View* continuam operando normalmente após o ajuste de idioma / redeploy. ✅ 2026-11-19
