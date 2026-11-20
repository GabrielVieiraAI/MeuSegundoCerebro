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
item_cr: CR-105
prioridade: Recomendado (Ponto de Atenção)
status: concluido
data: 2026-11-18
sap_destination: Veiling_S4D_100_GVSOUZA_PT
transport_requests:
  - S4DK900952 - DEL-R2R-009 - Bloqueio e Desbloqueio de Inadimplentes
---

# 🟡 CR-105: Valores Fixos (Hardcode) nas CDS Views e no Authority-Check

🗺️ [[00 - DEL-R2R-009 - Escada Code Review 1.excalidraw|Voltar para a Escada]] | 📄 [[Code Review 1.pdf|PDF Original]] | 🚀 [[CR-105 - Guia de Implementação|Guia de Implementação]] | ⬅️ [[CR-104 - Gravação Fora da Fase de Save e Sem Lock|CR-104]] | ➡️ [[CR-106 - Filtro de Partidas Memo e Validade da BUT050|CR-106]]

---

## 1. O que está sendo apontado (Linguagem de Negócio)

Algumas regras e critérios de negócio estão fixos internamente na solução em vez de serem lidos da configuração central de parâmetros da cooperativa:

* **Critérios fixos sem flexibilidade de manutenção:** A empresa avaliada, o segmento de crédito, as classes de risco de clientes à vista e a prazo, o valor mínimo da régua de corte (R$ 500,01) e o tipo de vínculo entre Matriz e Filial estão cravados diretamente na consulta do aplicativo. Se o negócio precisar ajustar qualquer um desses parâmetros no futuro, será necessário alterar o desenvolvimento em vez de apenas atualizar o cadastro de parâmetros.
* **Risco de divergência na regra de classes de risco excluídas:** A listagem da tela desconsidera apenas uma classe de risco fixa (contas internas), enquanto a ação do botão consulta a configuração central de parâmetros. Se uma nova classe de risco for adicionada na configuração de exceções, o cliente continuará aparecendo na tela com sugestão de bloqueio, mas será recusado na hora de clicar no botão.
* **Verificação de permissão presa a uma empresa fixa:** A validação de permissão do usuário para bloquear ou desbloquear está conferindo sempre uma empresa fixa, em vez de validar dinamicamente a empresa do registro selecionado.

---

## 2. O que eu preciso fazer (Linguagem de Negócio)

Para eliminar regras fixas internamente na solução e garantir que a listagem da tela e os botões de ação obedeçam exatamente aos mesmos critérios configuráveis pela cooperativa, devem ser realizados os seguintes ajustes:

1. **Centralizar todos os parâmetros de negócio no cadastro de configurações da empresa:**
   * Levar os critérios utilizados na apuração de inadimplência — empresa avaliada, área de crédito, perfis de risco (clientes à vista e a prazo), valor mínimo da régua de corte (R$ 500,01), tipo de vínculo societário de grupo econômico e perfis de risco excluídos (como contas internas) — para o cadastro central de parâmetros.
2. **Unificar a fonte de regras entre a listagem da tela e a execução dos botões:**
   * Fazer com que tanto a consulta que monta a lista de clientes e a coluna de ação proposta quanto a validação executada ao clicar em **Bloquear** ou **Desbloquear** leiam exatamente a mesma configuração centralizada.
   * Com isso, qualquer alteração futura nesses parâmetros passará a valer automaticamente em todo o aplicativo, sem risco de um cliente aparecer sugerido para bloqueio na lista e ser recusado ao acionar o botão.
3. **Validar a permissão de segurança pela empresa do cliente selecionado:**
   * Ajustar a conferência de autorização do usuário para validar dinamicamente a empresa do registro que está sendo bloqueado ou desbloqueado, em vez de consultar sempre uma empresa fixa.

---

## 3. Plano de Ação

### Mapa de Parâmetros Corporativos (`ZTCA_PARAM_PAR` / `ZTCA_PARAM_VAL` — Módulo `FI`, Chave 1 `DEL_R2R_009`)

Todos os critérios de negócio da demanda ficam centralizados no **App Tabela de Parâmetros** sob `Modulo = 'FI'` e `Chave1 = 'DEL_R2R_009'` (documentados em [[02 - DEL-R2R-009 - Configuração da Tabela de Parâmetros|02 - DEL-R2R-009 - Configuração da Tabela de Parâmetros]]), sendo lidos tanto pelas **CDS** (*Core Data Services*) via visão `ZI_CA_GET_PARAMETER` quanto pelo *Behavior Pool* via **zclca_tabela_parametros\=>get_instance( )**:

| Módulo | Chave 1 | Chave 2 | Chave 3 | Sinal | Opção | Valor (`Low`) | Finalidade |
| :--- | :--- | :--- | :--- | :---: | :---: | :--- | :--- |
| `FI` | `DEL_R2R_009` | `BUKRS` | `EMPRESA` | `I` | `EQ` | `CVH1` | Empresa contábil avaliada nos títulos e na autorização |
| `FI` | `DEL_R2R_009` | `CREDIT_SGMNT` | `SEGMENTO` | `I` | `EQ` | `1000` | Segmento de crédito avaliado no **FSCM** (*SAP Credit Management*) |
| `FI` | `DEL_R2R_009` | `RELTYP` | `GRUPO` | `I` | `EQ` | `UKM001` | Tipo de vínculo Matriz x Filial na tabela `BUT050` |
| `FI` | `DEL_R2R_009` | `RISK_CLASS` | `A_VISTA` | `I` | `EQ` | `1A` | Classes de risco com régua de perfil À Vista (`> 0,00`) |
| `FI` | `DEL_R2R_009` | `RISK_CLASS` | `A_PRAZO` | `I` | `EQ` | `2A` | Classes de risco com régua de perfil A Prazo |
| `FI` | `DEL_R2R_009` | `RISK_CLASS` | `EXCLUIR` | `I` | `EQ` | `5` | Classes de risco excluídas da listagem e do bloqueio (contas internas) |
| `FI` | `DEL_R2R_009` | `LIMITE_CORTE` | `A_PRAZO` | `I` | `EQ` | `500.01` | Valor mínimo da régua de corte para clientes A Prazo |

### O que será feito em cada objeto

1. **[[04 - ZI_FI_TITULOS_VENCIDOS|ZI_FI_TITULOS_VENCIDOS]] *(CDS Interface — Ajustar)*:**
   * Substituir o filtro fixo `and Item.CompanyCode = 'CVH1'` por um `inner join` com `ZI_CA_GET_PARAMETER as ParamEmpresa` (`Modulo = 'FI'`, `Chave1 = 'DEL_R2R_009'`, `Chave2 = 'BUKRS'`, `Chave3 = 'EMPRESA'`, `Sign = 'I'`, `Opt = 'EQ'` e `Low = Item.CompanyCode`), garantindo que apenas partidas em aberto das empresas parametrizadas sejam agregadas.

2. **[[05 - ZI_FI_PARCEIRO_CREDITO|ZI_FI_PARCEIRO_CREDITO]] *(CDS Interface — Ajustar)*:**
   * **Empresa parametrizada (`CompanyCode`) e segmento de crédito (`CreditSegment`):** Em ambos os ramos do `union` (Matriz própria e filiais vinculadas), realizar `inner join` com `ZI_CA_GET_PARAMETER as ParamEmpresa` (`Chave2 = 'BUKRS'`, `Chave3 = 'EMPRESA'`, `Sign = 'I'`, `Opt = 'EQ'`) expondo `cast( ParamEmpresa.Low as bukrs ) as CompanyCode`, e substituir `Segmento.credit_sgmnt = '1000'` por `inner join` com `ZI_CA_GET_PARAMETER as ParamSegmento` (`Chave2 = 'CREDIT_SGMNT'`, `Chave3 = 'SEGMENTO'`, `Sign = 'I'`, `Opt = 'EQ'` e `Low = Segmento.credit_sgmnt`).
   * **Tipo de relação Matriz x Filial (`RELTYP` / `GRUPO`):** Substituir o literal `'UKM001'` por `inner join` com `ZI_CA_GET_PARAMETER as ParamRelacao` (`Chave2 = 'RELTYP'`, `Chave3 = 'GRUPO'`, `Sign = 'I'`, `Opt = 'EQ'`), vinculando `VinculoSuperior.reltyp = ParamRelacao.Low` no `left outer join` do 1º ramo e `Relacao.reltyp = ParamRelacao.Low` no `inner join` do 2º ramo.
   * **Unificação das classes de risco excluídas (`RISK_CLASS` / `EXCLUIR`):** Substituir `and CreditoGeral.risk_class <> '5'` nos dois ramos do `union` por `left outer join` com `ZI_CA_GET_PARAMETER as ClasseExcluida` (`Chave2 = 'RISK_CLASS'`, `Chave3 = 'EXCLUIR'`, `Sign = 'I'`, `Opt = 'EQ'` e `Low = CreditoGeral.risk_class`) combinado ao filtro `and ClasseExcluida.Low is null` na cláusula `where`. Como a chave de `ZI_CA_GET_PARAMETER` é única por valor `Low`, o `left outer join` com `is null` filtra qualquer quantidade de classes cadastradas em `EXCLUIR` sem risco de multiplicação de linhas e unifica a regra com o botão de bloqueio.

3. **[[15 - ZI_FI_GRUPO_INADIMPLENTE|ZI_FI_GRUPO_INADIMPLENTE]] *(CDS Interface Auxiliar — Ajustar)*:**
   * **Vínculo com títulos pela empresa e parceiro:** Ajustar o `left outer join` com `[[04 - ZI_FI_TITULOS_VENCIDOS|ZI_FI_TITULOS_VENCIDOS]]` para `Titulos.CompanyCode = Parceiro.CompanyCode and Titulos.Customer = Parceiro.PartnerOrigem`, mantendo `Parceiro.CompanyCode` no `select` e no `group by`.
   * **Perfis de risco (`A_VISTA` e `A_PRAZO`) e régua de corte (`500,01`) parametrizados:** Substituir os literais `'1A'`, `'2A'` e `500.01` por `left outer join` com `ZI_CA_GET_PARAMETER as ClasseAVista` (`Chave2 = 'RISK_CLASS'`, `Chave3 = 'A_VISTA'`, `Sign = 'I'`, `Opt = 'EQ'`, `Low = Parceiro.RiskClass`), `left outer join` com `ZI_CA_GET_PARAMETER as ClasseAPrazo` (`Chave2 = 'RISK_CLASS'`, `Chave3 = 'A_PRAZO'`, `Sign = 'I'`, `Opt = 'EQ'`, `Low = Parceiro.RiskClass`) e `inner join` com `ZI_CA_GET_PARAMETER as ParamLimite` (`Chave2 = 'LIMITE_CORTE'`, `Chave3 = 'A_PRAZO'`, `Sign = 'I'`, `Opt = 'EQ'`), avaliando:
     * Perfil À Vista: `ClasseAVista.Low is not null and Titulos.ValorTotalVencido > 0`.
     * Perfil A Prazo: `ClasseAPrazo.Low is not null` e `cast( Titulos.ValorTotalVencido as abap.dec( 15, 2 ) ) >= cast( cast( replace( replace( ParamLimite.Low, '.', '' ), ',', '' ) as abap.numc( 15 ) ) as abap.dec( 15, 2 ) ) / 100`.

4. **[[06 - ZI_FI_CLIENTE_INADIMPLENTE (CDS)|ZI_FI_CLIENTE_INADIMPLENTE (CDS)]] e [[09 - ZC_FI_CLIENTE_INADIMPLENTE (CDS)|ZC_FI_CLIENTE_INADIMPLENTE (CDS)]] *(CDS Raiz e Projeção — Ajustar)*:**
   * Expor o campo `Parceiro.CompanyCode` como atributo não-chave na entidade raiz e na projeção (`@UI.hidden: true`), preservando a chave tripla (`PartnerMatriz + CreditSegment + PartnerOrigem`) definida no [[CR-101 - Chave Duplicada na CDS Raiz|CR-101]], e incluir `Titulos.CompanyCode = Parceiro.CompanyCode` nos `left outer joins` com `ZI_FI_TITULOS_VENCIDOS` e `ZI_FI_GRUPO_INADIMPLENTE`.
   * Dessa forma, todo registro listado (mesmo quando não houver títulos vencidos em aberto) possui `CompanyCode` preenchido para validação dinâmica no `AUTHORITY-CHECK` e para a futura **DCL** (*Data Control Language*) do [[CR-107 - Falta de Controle de Acesso (DCL) nas CDS Views|CR-107]].

5. **[[08 - ZCLFI_BP_CLIENTE_INAD|ZCLFI_BP_CLIENTE_INAD]] *(Behavior Pool — Aba `Local Types` / `CCIMP` — Ajustar)*:**
   * **Eliminação de constante sem uso:** Remover a constante privada `gc_segmento_credito TYPE ukm_credit_sgmnt VALUE '1000'` de `lhc_clienteinadimplente`.
   * **`AUTHORITY-CHECK` dinâmico pela empresa do registro (`get_instance_authorizations`):** Ler o atributo `CompanyCode` das linhas selecionadas via `READ ENTITIES OF zi_fi_cliente_inadimplente IN LOCAL MODE ENTITY ClienteInadimplente FIELDS ( CompanyCode ) WITH CORRESPONDING #( keys ) RESULT DATA(lt_clientes)` (com *fallback* para **zclca_tabela_parametros\=>get_instance( )->m_get_single** em `FI` / `DEL_R2R_009` / `BUKRS` / `EMPRESA`) e passar a empresa do registro (`lv_company_code`) no campo `ID 'BUKRS'` das duas verificações do objeto `[[02 - ZFI_BLOQ|ZFI_BLOQ]]` (atividades `'05'` e `'43'`), eliminando o literal `'CVH1'`.
   * **Tipo de relação parametrizado na cascata (`obter_grupo_economico`):** Consultar o *range* do tipo de vínculo na tabela de parâmetros via **zclca_tabela_parametros\=>get_instance( )->m_get_range** (`iv_modulo = 'FI'`, `iv_chave1 = 'DEL_R2R_009'`, `iv_chave2 = 'RELTYP'`, `iv_chave3 = 'GRUPO'`, mantendo *fallback* seguro para `'UKM001'`) e substituir `AND reltyp = 'UKM001'` por `AND reltyp IN @lr_reltyp` nas três consultas à tabela `BUT050`.

6. **[[02 - DEL-R2R-009 - Configuração da Tabela de Parâmetros|02 - DEL-R2R-009 - Configuração da Tabela de Parâmetros]] *(Guia de Configuração — Atualizar)*:**
   * Atualizar a documentação de cadastro de parâmetros da demanda para refletir o módulo `FI` e os 7 parâmetros sob a chave `DEL_R2R_009` (`BUKRS/EMPRESA`, `CREDIT_SGMNT/SEGMENTO`, `RELTYP/GRUPO`, `RISK_CLASS/A_VISTA`, `RISK_CLASS/A_PRAZO`, `RISK_CLASS/EXCLUIR` e `LIMITE_CORTE/A_PRAZO`).

### Dependências / Decisões

* **Dependências:** Construído sobre a arquitetura pós-[[CR-101 - Chave Duplicada na CDS Raiz|CR-101]] (que introduziu a CDS auxiliar `[[15 - ZI_FI_GRUPO_INADIMPLENTE|ZI_FI_GRUPO_INADIMPLENTE]]` e a chave tripla) e sobre o código ativo da `[[08 - ZCLFI_BP_CLIENTE_INAD|ZCLFI_BP_CLIENTE_INAD]]` pós-[[CR-102 - Cascata Altera Bloqueios Externos|CR-102]], [[CR-103 - Flag de Sucesso Não Reinicia na Seleção Múltipla|CR-103]] e [[CR-104 - Gravação Fora da Fase de Save e Sem Lock|CR-104]].
* **Pré-requisito funcional no ambiente (`S4D` / `S4Q`):** Como as CDS Views passam a fazer `inner join` com `ZI_CA_GET_PARAMETER`, os 7 parâmetros sob `Modulo = 'FI'` e `Chave1 = 'DEL_R2R_009'` devem estar cadastrados no **App Tabela de Parâmetros** do ambiente para que a listagem retorne registros.
* **Preparação para o [[CR-107 - Falta de Controle de Acesso (DCL) nas CDS Views|CR-107]]:** A exposição de `CompanyCode` como atributo não-chave em `ZI_FI_CLIENTE_INADIMPLENTE` e `ZC_FI_CLIENTE_INADIMPLENTE` preserva os BDEFs e metadados OData de chave intactos, além de disponibilizar o campo exigido pela futura DCL de leitura no objeto `ZFI_BLOQ`.

---

## 4. Teste Pós Ajuste

> Além do roteiro geral de testes do revisor em [[CR-117 - Checklist de Testes no QAS|CR-117]], os cenários abaixo validam diretamente no **QAS** (*Quality Assurance System* — ambiente de qualidade) o ajuste recomendado pelo supervisor técnico referente ao **CR-105**.

### Teste solicitado pelo Supervisor Técnico (ref. ao CR-105)

* **1. Consumo centralizado dos parâmetros nas CDS Views e na classe** *(item 5 da Seção 3 do [[Code Review 1.pdf|Code Review 1]])* — **Registro:** —
  - [x] **1.1. Consistência entre tela, parâmetros e ação dos botões:** ✅ 2026-11-19
    * **Passo a passo (Tutorial):**
      1. **Conferir os parâmetros no Fiori Launchpad (mais simples):**
         * Abra o **SAP Fiori Launchpad** no ambiente **QAS** e clique no bloco **App Tabela de Parâmetros**.
         * Na primeira tela (lista de módulos), clique na linha do módulo **`FI`** (Financeiro).
         * Confira na lista se existem exatamente estes 7 parâmetros com **Chave 1** igual a `DEL_R2R_009`, clicando em cada linha para ver o valor cadastrado (**Sinal** = `I`, **Opção** = `EQ`):
           * `BUKRS` / `EMPRESA` → `CVH1`
           * `CREDIT_SGMNT` / `SEGMENTO` → `1000`
           * `RELTYP` / `GRUPO` → `UKM001`
           * `RISK_CLASS` / `A_VISTA` → `1A`
           * `RISK_CLASS` / `A_PRAZO` → `2A`
           * `RISK_CLASS` / `EXCLUIR` → `5`
           * `LIMITE_CORTE` / `A_PRAZO` → `500.01`
         * *(Opcional via **SAP GUI** — caso prefira olhar direto no banco de dados):* na tela inicial do SAP GUI, clique na caixa branca de comando no canto superior esquerdo (ao lado do botão verde de confirmar), digite **`SE16N`** (*General Table Display* — visualizador de tabelas) e aperte `Enter`. Em **Tabela**, digite `ZTCA_PARAM_PAR`, preencha `CHAVE1` = `DEL_R2R_009` e aperte **`F8`** (ou clique no ícone do relógio **Executar**). Anote os `ID_PAR` e consulte a tabela `ZTCA_PARAM_VAL` na mesma `SE16N` filtrando por `ID_PAR` para ver os valores em `LOW`.
      2. **Validar a lista e os botões no aplicativo de inadimplência:**
         * No **SAP Fiori Launchpad** do QAS, abra o aplicativo de **Bloqueio e Desbloqueio de Clientes Inadimplentes** (`bloqinadimplente`) e clique no botão **Iniciar** (ou **Ir**) para carregar a lista.
         * No filtro **Classe de Risco**, tente pesquisar ou filtrar por clientes da classe excluída (`5`).
         * Confira alguns clientes das classes `1A` (À Vista) e `2A` (A Prazo) com valores acima e abaixo de R$ 500,01.
         * Selecione um cliente válido da lista e clique em **Bloquear** (e depois em **Desbloquear**) para confirmar que a operação funciona normalmente com a regra lida dos parâmetros.
    * **Como validar o sucesso:** O teste está aprovado quando: (a) todos os 7 parâmetros acima estão cadastrados em `FI` / `DEL_R2R_009`, (b) a lista do aplicativo carrega normalmente sem mostrar nenhum cliente da classe de risco `5`, (c) a coluna **Ação Proposta** sugere `Bloquear` para clientes `1A` com qualquer valor vencido (> R$ 0,00) e para clientes `2A` a partir de R$ 500,01, e (d) os botões **Bloquear** e **Desbloquear** executam com mensagem verde de sucesso sem divergência com o que aparece na lista.

  - [x] **1.2. `AUTHORITY-CHECK` dinâmico por empresa:** ✅ 2026-11-19
    * **Passo a passo (Tutorial no SAP GUI + Fiori):**
      1. **Ligar o rastreador de permissões no SAP GUI (transação `STAUTHTRACE`):**
         * Abra o **SAP GUI** no ambiente **QAS**, clique na caixa branca de comando no canto superior esquerdo, digite **`STAUTHTRACE`** (*System Trace for Authorization Checks* — rastreador de verificações de permissão) e aperte **`Enter`**.
         * Caso apareça o campo de usuário/filtro, deixe o seu usuário SAP preenchido (ou marque a opção para rastrear o seu usuário no servidor atual) e clique no botão **Trace On** (Ligar Rastreamento). *Dica:* mantenha essa janela do SAP GUI aberta enquanto faz o clique no Fiori.
      2. **Executar o aplicativo no Fiori:**
         * Vá ao **SAP Fiori Launchpad** do QAS, abra o aplicativo de inadimplência e clique em **Iniciar** para carregar os clientes (nesse momento o sistema já executa a verificação dos botões para as linhas da tela).
         * Selecione uma linha de cliente e clique em **Bloquear** (ou **Desbloquear**).
      3. **Analisar o resultado do rastreador no SAP GUI:**
         * Volte à janela da transação **`STAUTHTRACE`** no SAP GUI, clique em **Trace Off** (Desligar Rastreamento) e em seguida clique em **Evaluate** (Avaliar / Exibir Logs) — ou aperte **`F8`**.
         * Na tabela exibida, procure na coluna **Object** (Objeto de Autorização) pelas linhas com o valor **`ZFI_BLOQ`**.
         * Clique sobre uma linha de `ZFI_BLOQ` (ou role para a direita na tabela) para visualizar os valores verificados nos campos `BUKRS` (Empresa), `UKM_SGMNT` (Segmento de Crédito) e `ACTVT` (Atividade `05` e `43`).
         * *(Alternativa se não tiver acesso à `STAUTHTRACE`):* teste com um usuário de QAS que possua `[[02 - ZFI_BLOQ|ZFI_BLOQ]]` liberado apenas para outra empresa (diferente de `CVH1`) e tente abrir/acionar o botão em um cliente de `CVH1`; em seguida, no SAP GUI desse usuário, digite **`SU53`** na caixa de comando superior esquerda e aperte `Enter` para ver a última falha de autorização registrada.
    * **Como validar o sucesso:** O teste está aprovado quando o registro da verificação de `[[02 - ZFI_BLOQ|ZFI_BLOQ]]` (no `STAUTHTRACE` ou na `SU53`) mostrar que o campo `BUKRS` foi validado com a empresa do registro carregado (`CVH1`, vinda da tabela de parâmetros no campo `CompanyCode` da linha) para as atividades `05` (Bloquear) e `43` (Desbloquear) — e, no teste negativo com usuário sem permissão em `CVH1`, os botões **Bloquear** e **Desbloquear** permanecerem desabilitados na tela.
