---
tipo: guia-testes
tipo_demanda: novo-app
tags:
  - projeto
  - insi
  - veiling-holambra
  - sap
  - fi-ar
  - fscm
  - rap
  - homologacao
  - plano-testes
  - etd
  - del-r2r-009
id_demanda: DEL-R2R-009
status_geral: Em Execução
executor_exclusivo: Gabriel Souza (Desenvolvedor)
data: 2026-10-30

aliases:
  - "DEL-R2R-009 - Guia de Testes e Homologação"
  - "03 - DEL-R2R-009 - Guia de Testes e Homologação"
---

# Guia de Execução e Homologação de Testes Técnicos 

[[01 - DEL-R2R-009 - Guia de Implementação|Guia de Implementação]] | [[DEL-R2R-009 - Arquitetura e Objetos|Arquitetura e Objetos]] | [[Mensageria e Feedback Visual em Ações do RAP (OData V2)|Padrão de Mensageria e Feedback]]

---
## 1. Identificação do Teste 

| Campo na ETD                        | Conteúdo Oficial para Transferência                                                                                                                                                                                                                                                                                                                                 |
| :---------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Título:**                         | Bloqueio e Desbloqueio Massivo de Clientes Inadimplentes                                                                                                                                                                                                                                                                                                            |
| **Usuário Responsável pelo teste:** | **Gabriel Souza (Desenvolvedor)**                                                                                                                                                                                                                                                                                                                                   |
| **ID GAP/Processo:**                | DEL-R2R-009                                                                                                                                                                                                                                                                                                                                                         |
| **Cenário/Gap:**                    | Bloqueio e Desbloqueio massivo de clientes inadimplentes                                                                                                                                                                                                                                                                                                            |
| **Módulo/Submódulo:**               | FI-AR / FSCM-CR                                                                                                                                                                                                                                                                                                                                                     |
| **Processo:**                       | Record to Report (R2R) - Gestão de Crédito e Cobrança                                                                                                                                                                                                                                                                                                               |
| **Mandante:**                       | 120 (`Veiling_S4D_120_GVSOUZA_PT`)                                                                                                                                                                                                                                                                                                                                  |
| **Descrição do teste:**             | Execução de testes unitários técnicos e funcionais da solução Clean Core / RAP para apuração analítica em tempo real de clientes inadimplentes, execução em lote das ações de bloqueio e desbloqueio no FSCM (segmento de crédito 1000) com trava centralizada na conta da Matriz e persistência do histórico de auditoria na tabela transparente ZTFI_LOG_INADIMP. |

---

## 2. Plano de Teste (Seção 3 da ETD)

### 2.1. Parâmetros de Entrada (Seção 3.1 da ETD)

* **Empresa Contábil:** `CVH1` (Cooperativa Veiling Holambra).
* **Segmento de Crédito FSCM:** `1000` (Segmento operacional avaliado).
* **Moeda Padrão:** `BRL` (Real Brasileiro).
* **Classes de Risco Avaliadas:**
  * `1A` (Clientes à Vista): Régua estrita (qualquer saldo vencido > R$ 0,00 e atraso >= 1 dia).
  * `2A` (Clientes a Prazo): Régua de tolerância (saldo vencido >= R$ 500,01 e atraso >= 1 dia).
* **Regras de Exclusão e Proteção Cadastral:**
  * Classe de Risco `5` (Contas internas da própria Veiling Holambra - filtradas no SQL da CDS View).
  * Clientes bloqueados por motivos externos (`XBLOCKED = 'X'` e `BLOCK_REASON <> '10'`, como bloqueios fiscais ou jurídicos).
  * Segmento de Atuação (`BP001-GROUP_FEATURE`): Autosserviço / Supermercados (identificados para controle).
* **Relacionamento de Grupo Econômico:** Relação `UKM001` (*Conta de crédito de nível superior*) via tabela `BUT050`, vinculando faturas de Filiais devedoras à conta de crédito da Matriz.

### 2.2. Resultados Esperados (Seção 3.2 da ETD)

1. **Apuração Analítica em Tempo Real:** Listagem dinâmica das faturas vencidas através da hierarquia de CDS Views (`ZI_FI_TITULOS_VENCIDOS` → `ZI_FI_PARCEIRO_CREDITO` → `ZI_FI_CLIENTE_INADIMPLENTE`), sem uso de jobs noturnos ou tabelas Z temporárias.
2. **Determinação da Ação Proposta:** Sugestão visual automática de `'Bloquear'` (para inadimplentes desbloqueados) ou `'Desbloquear'` (para clientes bloqueados com motivo `10` que regularizaram seus débitos).
3. **Execução Transacional Segura via RAP:** Processamento individualizado no Behavior Pool `[[08 - ZCLFI_BP_CLIENTE_INAD|ZCLFI_BP_CLIENTE_INAD]]`, chamando as APIs standard `CL_UKM_ACCOUNT` e `CL_UKM_BUPA_FACTORY` para atualizar os campos `XBLOCKED` e `BLOCK_REASON` exclusivamente na conta da Matriz.
4. **Rastreabilidade e Auditoria:** Gravação automática de cada ação na tabela transparente `[[01 - ZTFI_LOG_INADIMP|ZTFI_LOG_INADIMP]]` com status de execução `S` (Sucesso) ou `E` (Erro), registrando BP Matriz, BP Origem, valor em aberto, dias de atraso, usuário e timestamp UTC.
5. **Feedback Visual Fiori:** Resposta via header HTTP `sap-message` (OData V2), renderizando Message Toast verde para operações pontuais, Message View Dialog consolidado para lotes e atualização imediata da tela (`forceGlobalRefresh = true`).

---

## 3. Sequenciamento dos Testes Unitários (Seção 3.3 da ETD)

Esta tabela reflete exatamente a estrutura de 4 colunas exigida pelo template oficial da ETD:

| Cod. Passo | Atividade | Dados de entrada | Resultado esperado |
| :---: | :--- | :--- | :--- |
| **`T01`** | Bloqueio de cliente classe 1A (À Vista) com título de baixo valor. | Cliente classe 1A no segmento 1000, desbloqueado, com fatura vencida de R$ 45,90 na empresa CVH1 há >= 1 dia. | App propõe 'Bloquear'; clique em Bloquear grava `XBLOCKED = 'X'` e `BLOCK_REASON = '10'` no FSCM da Matriz e gera log com status 'S' na ZTFI_LOG_INADIMP. |
| **`T02`** | Validação da régua de corte para classe 2A (A Prazo: R$ 500,00 vs R$ 500,01). | Dois clientes classe 2A desbloqueados no segmento 1000: Cliente A com R$ 500,00 vencido; Cliente B com R$ 500,01 vencido. | Apenas o Cliente B (R$ 500,01) recebe proposta 'Bloquear'; Cliente A (R$ 500,00) não é proposto para bloqueio pela régua. |
| **`T03`** | Bloqueio em massa com desmarcação individual e resiliência de processamento. | Múltiplos clientes inadimplentes selecionados na lista; desmarcação manual de um cliente antes da confirmação da ação. | Clientes selecionados são bloqueados com sucesso no FSCM e logados; o cliente desmarcado permanece desbloqueado e inalterado. |
| **`T04`** | Desbloqueio de cliente previamente bloqueado após compensação de títulos. | Cliente com trava no app (motivo 10) cujas faturas foram integralmente compensadas/baixadas no financeiro (saldo zerado). | App exibe Ação Proposta = 'Desbloquear'; clique em Desbloquear limpa `XBLOCKED` e `BLOCK_REASON` no FSCM e gera log de ação 'D' na ZTFI_LOG_INADIMP. |
| **`T05`** | Proteção cadastral de cliente com bloqueio de crédito externo (Fiscal / Jurídico). | Cliente no segmento 1000 bloqueado manualmente na `/nBP` com motivo diferente de 10 (ex.: `02` - Fiscal), sem faturas vencidas. | Conforme cláusula WHERE da CDS raiz, o cliente não é listado no app e não recebe proposta de desbloqueio, preservando a decisão externa. |
| **`T06`** | Preservação de limites de crédito sazonais e datas de validade temporária. | Cliente no segmento 1000 com limite sazonal cadastrado (`CREDIT_LIMIT` e `LIMIT_VALID_DATE`), desbloqueado e com fatura vencida. | Bloqueio e posterior desbloqueio no app afetam somente as travas; os valores de limite e datas sazonais permanecem 100% inalterados no FSCM. |
| **`T07`** | Soberania da gestão manual (bloqueio alterado no SAP GUI). | Cliente bloqueado com motivo 10 que teve o motivo alterado manualmente para outro código (ex.: `02`), com faturas compensadas. | App não propõe 'Desbloquear', respeitando a alteração manual realizada diretamente no cadastro do parceiro. |
| **`T08`** | Consolidação e bloqueio em estruturas vinculadas (Matriz x Filiais). | Estrutura Matriz vinculada à Filial via relação `UKM001`; fatura vencida de R$ 600,00 na empresa CVH1 no BP da Filial (1000195). | App exibe a Matriz no campo principal e a filial no BP de Origem; bloqueio no FSCM é gravado na Matriz; log ZTFI_LOG_INADIMP registra Matriz e Origem. |
| **`T09`** | Gestão de grupo econômico parcialmente regularizado. | Grupo com Matriz e 2 filiais bloqueado; títulos da Filial 1 compensados, mas Filial 2 mantendo pendência vencida. | App não propõe desbloqueio para a Matriz enquanto qualquer uma das filiais do grupo mantiver títulos vencidos. |
| **`T10`** | Filtro dinâmico por segmento de atuação (Autosserviço / Supermercados). | Base de clientes com segmentos distintos (`BP001-GROUP_FEATURE`), incluindo Autosserviço. | O filtro de segmento de atuação no Fiori isola com precisão apenas os clientes da categoria selecionada. |

---

## 4. Evidências dos Testes e das Etapas do Processo (Seção 3.4 da ETD)

> **Instruções de Preenchimento:**
> Cada subseção abaixo corresponde exatamente a um tópico numerado da **Seção 3.4 da ETD**.
> Ao executar os testes no ambiente mandante 100, cole os prints nos slots indicados em cada Etapa.

---

### ==🟢3.4.1. Passo 1 - T01: Cliente à Vista com Título Vencido de Baixo Valor

* **Objetivo:** Validar a régua estrita da classe `1A` (À Vista) para qualquer valor vencido > R$ 0,00 com atraso >= 1 dia.
* **Dados de Entrada:** Parceiro classe 1A no segmento `1000`, desbloqueado, com fatura de R$ 45,90 na empresa `CVH1` vencida há pelo menos 1 dia.
* **Resultado Esperado:** Proposta = 'Bloquear'. Ação grava `XBLOCKED = 'X'` e `BLOCK_REASON = '10'` na conta do cliente e persiste auditoria em `ZTFI_LOG_INADIMP`.
* **Executor:** Gabriel Souza (Desenvolvedor)
* **Status:** `[ ] Pendente` | `[x] Aprovado` | `[ ] Reprovado`

#### Etapa 1: Consulta no App Fiori Elements (Antes do Clique)
*Valida se o cliente aparece com Ação Proposta = 'Bloquear', Valor Vencido = R$ 45,90 e Bloqueado = 'Não'.*
![[Pasted image 20261030085047.png]]

#### Etapa 2: Execução do Bloqueio e Feedback Visual (Message Toast)
*Valida a notificação verde de sucesso e a atualização da linha para Bloqueado = 'Sim' e Motivo = '10'.*
![[Pasted image 20261030085249.png]]


#### Etapa 3: Confirmação da Trava no FSCM (`/nBP` ou `SE16N` em `UKMBP_CMS_SGM`)
*Valida se no segmento 1000 os campos `XBLOCKED = 'X'` e `BLOCK_REASON = '10'` foram gravados.*
![[Pasted image 20261030085606.png]]
#### Etapa 4: Auditoria na Tabela de Log (`SE16N` em `ZTFI_LOG_INADIMP`)
*Valida o registro persistido com ACAO = 'B', STATUS_EXEC = 'S', MOTIVO = '10' e usuário.*
![[Pasted image 20261030085713.png]]

---

### ==🟢3.4.2. Passo 2 - T02: Cliente a Prazo no Limite da Régua (R$ 500,00 vs R$ 500,01)

* **Objetivo:** Validar a régua de corte da classe `2A` (A Prazo), garantindo que saldos <= R$ 500,00 não sejam bloqueados e saldos >= R$ 500,01 sejam propostos.
* **Dados de Entrada:** Cliente A (classe 2A, desbloqueado, fatura de exatamente R$ 500,00); Cliente B (classe 2A, desbloqueado, fatura de exatamente R$ 500,01).
* **Resultado Esperado:** Cliente A não recebe proposta de bloqueio; Cliente B recebe proposta 'Bloquear'.
* **Executor:** Gabriel Souza (Desenvolvedor)
* **Status:** `[ ] Pendente` | `[x] Aprovado` | `[ ] Reprovado`

#### Etapa 1: Comparativo da Régua na Listagem do App Fiori
*Valida lado a lado os Clientes A e B, comprovando que apenas o Cliente B ultrapassou o corte.*
![[Pasted image 20261030091704.png]]

#### Etapa 2: Bloqueio do Cliente Elegível (R$ 500,01)
*Valida o bloqueio aplicado no Cliente B e a gravação na tabela de log.*
![[Pasted image 20261030091757.png]]
![[Pasted image 20261030091848.png]]

---

### ==🟢3.4.3. Passo 3 - T03: Bloqueio em Massa com Desmarcação Individual

* **Objetivo:** Validar o processamento em lote resiliente, permitindo desmarcar registros e aplicando a trava apenas aos selecionados.
* **Dados de Entrada:** Lista com múltiplos clientes inadimplentes; seleção em massa ("Marcar todos") e desmarcação manual de 1 cliente.
* **Resultado Esperado:** Clientes selecionados são bloqueados com status 'Sim' e log gerado; cliente desmarcado permanece inalterado com status 'Não'.
* **Executor:** Gabriel Souza (Desenvolvedor)
* **Status:** `[ ] Pendente` | `[x] Aprovado` | `[ ] Reprovado`

#### Etapa 1: Seleção em Massa e Desmarcação na Lista Fiori
*Mostra os registros marcados e o registro desmarcado intencionalmente.*
![[Pasted image 20261030092216.png]]
#### Etapa 2: Retorno Consolidado e Confirmação de Estados
*Valida as linhas atualizadas para 'Sim' e a linha desmarcada permanecendo como 'Não'.*
![[Pasted image 20261030092240.png]]
#### Etapa 3: Rastreabilidade de Todos os Registros Processados na `ZTFI_LOG_INADIMP`
*Mostra os logs gerados em lote com o mesmo timestamp para os clientes selecionados.*
![[Pasted image 20261030092353.png]]

---

### ==🟢3.4.4. Passo 4 - T04: Desbloqueio de Cliente Regularizado (Títulos Compensados)

* **Objetivo:** Validar a proposta automática de desbloqueio para clientes bloqueados pelo app (motivo 10) que quitaram suas pendências.
* **Dados de Entrada:** Cliente bloqueado com motivo 10 cujas faturas foram compensadas no financeiro (saldo em aberto zerado).
* **Resultado Esperado:** Ação Proposta exibe 'Desbloquear'. O clique em Desbloquear limpa `XBLOCKED` e `BLOCK_REASON` no FSCM e grava ação 'D' com status 'S'.
* **Executor:** Gabriel Souza (Desenvolvedor)
* **Status:** `[ ] Pendente` | `[x] Aprovado` | `[ ] Reprovado`

#### Etapa 1: Cliente sem Faturas com Proposta 'Desbloquear' no Fiori
*Valida cliente bloqueado (Sim / 10), Valor Vencido = 0,00 e Ação Proposta = 'Desbloquear'.*
![[Pasted image 20261030093155.png]]
#### Etapa 2: Execução do Desbloqueio no Fiori (Feedback Visual)
*Valida o toast de sucesso e a linha atualizada para Bloqueado = 'Não' e Motivo vazio.*
![[Pasted image 20261030093208.png]]


#### Etapa 3: Limpeza da Conta de Crédito no FSCM (`/nBP` ou `SE16N` em `UKMBP_CMS_SGM`)
*Comprova que os campos `XBLOCKED` e `BLOCK_REASON` foram esvaziados no segmento 1000.*
![[Pasted image 20261030093309.png]]
#### Etapa 4: Auditoria da Ação de Desbloqueio na `ZTFI_LOG_INADIMP`
*Valida a gravação com ACAO = 'D' e STATUS_EXEC = 'S'.*
![[Pasted image 20261030093411.png]]

---

### ==🟢3.4.5. Passo 5 - T05: Cliente Bloqueado por Outro Motivo (Fiscal / Jurídico)

* **Objetivo:** Garantir que o aplicativo respeite travas externas de crédito (motivo <> 10), não interferindo nem propondo desbloqueio.
* **Dados de Entrada:** Cliente no segmento 1000 bloqueado manualmente na `/nBP` com motivo diferente de 10 (ex.: `02` - Fiscal), sem títulos vencidos.
* **Resultado Esperado:** O cliente NÃO é listado no aplicativo (filtrado pela cláusula WHERE da CDS raiz), protegendo a decisão manual de outras áreas.
* **Executor:** Gabriel Souza (Desenvolvedor)
* **Status:** `[ ] Pendente` | `[x] Aprovado` | `[ ] Reprovado`

#### Etapa 1: Evidência do Bloqueio Fiscal no SAP GUI (`/nBP` ou `SE16N`)
*Comprova que no segmento 1000 o parceiro tem `XBLOCKED = 'X'` e `BLOCK_REASON <> '10'` (ex.: '02').*
![[Pasted image 20261030093649.png]]
#### Etapa 2: Busca no App Fiori Comprovando Omissão do Cliente
*Mostra a busca pelo código do cliente no Fiori retornando "Nenhum dado encontrado" ou sem proposta.*
![[Pasted image 20261030093703.png]]

---

### ==🟢3.4.6. Passo 6 - T06: Preservação de Limite e Datas de Crédito Sazonal

* **Objetivo:** Validar a integridade dos dados mestres, assegurando que o bloqueio e o desbloqueio afetem unicamente as travas, sem alterar limites sazonais temporários (`DEL-COM-064`).
* **Dados de Entrada:** Cliente no segmento 1000 com limite sazonal ativo (`CREDIT_LIMIT` preenchido e `LIMIT_VALID_DATE` futura), desbloqueado e com fatura vencida.
* **Resultado Esperado:** Os campos `CREDIT_LIMIT` e `LIMIT_VALID_DATE` permanecem idênticos antes do bloqueio, após o bloqueio e após o desbloqueio.
* **Executor:** Gabriel Souza (Desenvolvedor)
* **Status:** `[ ] Pendente` | `[x] Aprovado` | `[ ] Reprovado`

#### Etapa 1: Evidência dos Dados de Limite Sazonal Iniciais no SAP GUI (`/nBP` ou `SE16N`)
*Anota os valores de `CREDIT_LIMIT` e `LIMIT_VALID_DATE` antes de qualquer ação.*
![[Pasted image 20261030095153.png]]

#### Etapa 2: Bloqueio no Fiori e Verificação da Preservação do Limite
*Comprova que o cliente foi bloqueado no app e que o limite sazonal continua inalterado.*
![[Pasted image 20261030095311.png]]
![[Pasted image 20261030095355.png]]
#### Etapa 3: Desbloqueio no Fiori e Confirmação Final de não regressão
*Comprova que após o desbloqueio o limite e as datas continuam 100% preservados.*
![[Pasted image 20261030095440.png]]
![[Pasted image 20261030095457.png]]

---

### ==🟢3.4.7. Passo 7 - T07: Bloqueio Alterado no SAP GUI (Soberania da Gestão Manual)

* **Objetivo:** Garantir a soberania de alterações cadastrais manuais realizadas diretamente no SAP GUI (`/nBP`).
* **Dados de Entrada:** Cliente bloqueado inicialmente com motivo 10 pelo app, cujo motivo foi alterado manualmente na `/nBP` para outro código (ex.: `02`), com faturas compensadas.
* **Resultado Esperado:** O app não propõe 'Desbloquear', mantendo o cliente sob gestão manual externa.
* **Executor:** Gabriel Souza (Desenvolvedor)
* **Status:** `[ ] Pendente` | `[x] Aprovado` | `[ ] Reprovado`

#### Etapa 1: Alteração Manual do Motivo de Bloqueio no SAP GUI (`/nBP`)
*Comprova a alteração manual do motivo 10 para o motivo 02 na conta de crédito do parceiro.*
![[Pasted image 20261030100855.png]]
#### Etapa 2: Validação no App Fiori sem Proposta de Desbloqueio
*Comprova que o app respeitou a alteração manual e não exibiu o cliente para desbloqueio.*
![[Pasted image 20261030101108.png]]

---

### 3.4.8. Passo 8 - T08: Bloqueio de Clientes Vinculados (Matriz x Filiais)

* **Objetivo:** Validar a consolidação da dívida originada em filial e a aplicação centralizada da trava na conta de crédito da Matriz via relação `UKM001`.
* **Dados de Entrada:** BP Matriz vinculado à Filial (1000195 - Pet Center) via `UKM001`; fatura vencida de R$ 600,00 na empresa `CVH1` lançada exclusivamente no BP da Filial.
* **Resultado Esperado:** O app exibe a Matriz no campo principal e a Filial no BP de Origem; o bloqueio no FSCM é aplicado na Matriz; o log grava a Matriz em `PARTNER` e a Filial em `PARTNER_ORIGEM`.
* **Executor:** Gabriel Souza (Desenvolvedor)
* **Status:** `[ ] Pendente` | `[ ] Aprovado` | `[ ] Reprovado`

#### Etapa 1: Identificação da Matriz e da Filial Devedora no Fiori (Antes da Ação)
*Comprova a coluna Cliente (Matriz), BP de Origem = 0001000195, Valor Vencido = R$ 600,00 e Ação Proposta = 'Bloquear'.*
```markdown
[Cole aqui o print da listagem Fiori com a Matriz e o BP de Origem]
```

#### Etapa 2: Execução do Bloqueio no App Fiori
*Comprova a notificação de sucesso e a atualização de status.*
```markdown
[Cole aqui o print da execução do bloqueio no Fiori]
```

#### Etapa 3: Confirmação da Trava FSCM na Conta de Crédito da Matriz (`/nBP`)
*Comprova que a conta que recebeu a trava física `XBLOCKED = 'X'` e `BLOCK_REASON = '10'` foi a Matriz.*
```markdown
[Cole aqui o print da /nBP da Matriz mostrando o bloqueio gravado]
```

#### Etapa 4: Auditoria com Rastreabilidade de Matriz e Origem na `ZTFI_LOG_INADIMP`
*Comprova PARTNER = Matriz e PARTNER_ORIGEM = 0001000195 na SE16N da tabela de log.*
```markdown
[Cole aqui o print da SE16N na ZTFI_LOG_INADIMP evidenciando Matriz e Origem]
```

---

### 3.4.9. Passo 9 - T09: Grupo Econômico Parcialmente Regularizado

* **Objetivo:** Garantir a segurança de crédito do grupo econômico, mantendo a Matriz bloqueada enquanto qualquer filial ainda possuir pendências financeiras.
* **Dados de Entrada:** Grupo econômico com Matriz e 2 filiais bloqueado; faturas da Filial 1 são compensadas, mas Filial 2 permanece com títulos vencidos.
* **Resultado Esperado:** O app NÃO propõe desbloqueio para a Matriz, exibindo a pendência residual da Filial 2.
* **Executor:** Gabriel Souza (Desenvolvedor)
* **Status:** `[ ] Pendente` | `[ ] Aprovado` | `[ ] Reprovado`

#### Etapa 1: Evidência da Compensação Parcial da Filial 1
*Mostra que a Filial 1 regularizou a sua dívida no financeiro.*
```markdown
[Cole aqui o print comprovando a baixa dos títulos da Filial 1]
```

#### Etapa 2: Consulta da Matriz no App Fiori Mantendo a Proposta Residual
*Comprova que o app mantém a Matriz bloqueada devido ao saldo vencido da Filial 2.*
```markdown
[Cole aqui o print do Fiori comprovando que não há proposta de desbloqueio para a Matriz]
```

---

### 3.4.10. Passo 10 - T10: Filtro Dinâmico por Segmento de Atuação (Autosserviço)

* **Objetivo:** Validar o filtro por característica de agrupamento (`BP001-GROUP_FEATURE`), permitindo isolar canais específicos como Autosserviço / Supermercados.
* **Dados de Entrada:** Base de clientes com segmentos variados cadastrados; seleção do filtro "Segmento de Atuação" na barra superior do Fiori.
* **Resultado Esperado:** A tabela exibe exclusivamente os clientes correspondentes ao segmento filtrado.
* **Executor:** Gabriel Souza (Desenvolvedor)
* **Status:** `[ ] Pendente` | `[ ] Aprovado` | `[ ] Reprovado`

#### Etapa 1: Aplicação do Filtro de Segmento de Atuação no Fiori
*Mostra o filtro preenchido na barra de seleção e os clientes retornados.*
```markdown
[Cole aqui o print do filtro de segmento de atuação no Fiori]
```

#### Etapa 2: Validação dos Registros Retornados
*Comprova que todos os registros exibidos pertencem à categoria filtrada.*
```markdown
[Cole aqui o print dos resultados filtrados]
```

---

## 5. Termo de Aceite Técnico do Desenvolvedor

Após a conclusão e aprovação de todos os 10 passos acima no mandante 100, este desenvolvimento é considerado formalmente validado no nível unitário/técnico e liberado para homologação integrada junto à consultoria funcional e aos usuários-chave da Cooperativa Veiling Holambra.

| Responsabilidade         | Nome Completo               | Papel no Projeto                             | Status da Validação |        Data        |
| :----------------------- | :-------------------------- | :------------------------------------------- | :-----------------: | :----------------: |
| **Executor dos Testes:** | **Gabriel Souza**           | Desenvolvedor ABAP Cloud / Clean Core (Insi) |   `[ ] Concluído`   | ____/____/________ |

