---
tags:
  - projeto
  - insi
  - veiling-holambra
  - sap
  - code-review
  - del-r2r-009
  - critico
id_demanda: DEL-R2R-009
revisao: Code Review 1
request: S4DK900952
tarefa: S4DK900953
item_cr: CR-101
prioridade: Obrigatório (Crítico)
status: concluido
data: 2026-11-18
---

# 🔴 CR-101: Chave Duplicada na CDS Raiz (Matriz com Múltiplas Filiais)

🗺️ [[00 - DEL-R2R-009 - Escada Code Review 1.excalidraw|Voltar para a Escada]] | 📄 [[Code Review 1.pdf|PDF Original]] | 🚀 [[CR-101 - Guia de Implementação|Guia de Implementação]] | ➡️ [[CR-102 - Cascata Altera Bloqueios Externos|Próximo: CR-102]]

---

## 1. O que foi apontado (Code Review)
* **Onde:** `[[05 - ZI_FI_PARCEIRO_CREDITO|ZI_FI_PARCEIRO_CREDITO]]` e `[[06 - ZI_FI_CLIENTE_INADIMPLENTE (CDS)|ZI_FI_CLIENTE_INADIMPLENTE (CDS)]]` (com reflexo no BDEF e projeção caso a chave mude).
* **Resumo do problema:**
  - A `ZI_FI_PARCEIRO_CREDITO` gera uma linha por vínculo `UKM001` (`PartnerMatriz + PartnerOrigem`), mas a view raiz declara como chave apenas `PartnerMatriz + CreditSegment`. Com 2 ou mais filiais, a chave repete na raiz, listando o cliente duplicado no app e tornando imprevisível o `READ` do BO (*Business Object*).
  - Além disso, o `coalesce` na CDS base substitui a Matriz pela filial quando existem filiais vinculadas, fazendo os títulos vencidos da própria Matriz serem ignorados *(ponto identificado por leitura de código, pois o DEV não tem relações `UKM001`)*.
* **Direcionamento do revisor:** Alinhar com o funcional se a regra na tela é **por grupo** (uma linha agregando vencidos da Matriz + filiais) ou **por parceiro** (incluindo `PartnerOrigem` na chave).

---

## 2. Entendimento em Alto Nível
### 2.1. O que está sendo apontado (Alto Nível)
* **Identificador repetido para linhas de filiais diferentes:** Quando uma matriz possui duas ou mais filiais vinculadas, o aplicativo lista uma linha para cada filial, mas usa apenas o código da matriz como identificador principal — fazendo várias linhas compartilharem a mesma identificação (como ocorreu na consulta real com *GARON FLORES*, *COMERCIAL REIS*, *COSTAZUL* e *COMPANHIA SULAMERICANA*).
* **Ações de bloqueio e desbloqueio com comportamento imprevisível:** Como linhas diferentes têm o mesmo identificador principal, ao clicar em **Bloquear** ou **Desbloquear** em uma linha, o sistema encontra múltiplos registros para o mesmo código, tornando o processamento e o retorno da ação imprevisíveis.
* **Títulos da própria matriz ignorados:** Sempre que uma matriz possui filiais vinculadas (mesmo que seja apenas uma, como no caso da *PET CENTER*), o sistema passa a olhar somente para as filiais e deixa de gerar a linha própria da matriz — ignorando os títulos vencidos emitidos diretamente contra o cadastro dela mesma.

### 2.2. O que eu preciso fazer
* **Regra de negócio definida com o funcional:** A tela deve adotar a **visão detalhada por empresa (Matriz e Filiais)**, mostrando uma linha para a matriz (com suas respectivas faturas) e uma linha para cada filial (com suas respectivas faturas), aplicando a régua de corte individualmente por empresa, sem somar os valores do grupo. *(Falhas nos dados cadastrais em testes, como cadastros de Matriz sem classe de risco preenchida, não fazem parte do escopo deste ajuste; já a proteção contra filiais com segmento `1000` próprio duplicado foi tratada diretamente na seleção.)*

1. **Incluir a própria matriz como linha de origem das suas faturas (blindando filiais com segmento próprio):**
   * Ajustar a busca dos dados para que a matriz sempre gere uma linha própria apontando para si mesma (mesmo quando possuir filiais vinculadas), garantindo que as faturas vencidas da própria matriz apareçam na tela e passem pela régua de corte.
   * Excluir desse ramo principal qualquer parceiro que já figure como filial subordinada (`partner2` em `UKM001`), impedindo que filiais com conta de crédito própria no segmento `1000` apareçam duplicadas como se fossem matrizes independentes.
2. **Tornar única a identificação de cada linha:**
   * Incluir a empresa de origem da dívida na identificação única de cada registro (na fonte de dados, nas ações e na exibição da tela), garantindo que a matriz e cada uma de suas filiais tenham identidades distintas e eliminando o conflito ao clicar em **Bloquear** ou **Desbloquear**.
3. **Aplicar a regra 100% simétrica pelo grupo na coluna de sugestão (mantendo as linhas na mesma tela):**
   * Manter a régua de corte avaliada individualmente por empresa (sem somar valores de matriz e filiais).
   * Na coluna de sugestão de ação na tela, refletir a decisão do **grupo econômico inteiro** de forma simétrica (sem criar colunas ou indicadores extras na tela):
     * Se **qualquer empresa** do grupo ultrapassar a régua de corte, **todas as linhas** daquele grupo sugerem **Bloquear**.
     * Enquanto **qualquer empresa** do grupo ainda ultrapassar a régua, **nenhuma linha** do grupo sugere **Desbloquear**.
     * Somente quando **todas as empresas** do grupo estiverem abaixo da régua é que todas as linhas do grupo passam a sugerir **Desbloquear**.
4. **Validar em ambiente de testes com grupos econômicos reais:**
   * Testar uma matriz com duas ou mais filiais, incluindo títulos vencidos na matriz e em apenas uma ou mais filiais, confirmando que todas as linhas aparecem sem conflito de identificação, com sugestão coerente para o grupo e ações funcionando de forma previsível.

---

## 4. Plano de Ação (Alto Nível)

🎨 **Comparativo de Arquitetura:** [[01 - DEL-R2R-009 - Comparativo Arquitetura CR-101.excalidraw|Visualizar Arquitetura Atual vs. Nova Arquitetura no Excalidraw]]

### O que será feito em cada objeto

1. **[[05 - ZI_FI_PARCEIRO_CREDITO|ZI_FI_PARCEIRO_CREDITO]] *(CDS Interface — Ajustar)*:**
   * Eliminar o comportamento atual que substitui a Matriz pela filial sempre que existem filiais vinculadas (`UKM001`).
   * Ajustar a seleção para gerar **sempre uma linha da própria Matriz** (apontando para si mesma) somada a **uma linha para cada filial vinculada**, garantindo que o segmento de crédito também componha a chave e que a Matriz nunca perca suas próprias faturas.
   * Aplicar `left outer join` na `BUT050` (`VinculoSuperior.partner2 = Segmento.partner and VinculoSuperior.reltyp = 'UKM001'`) com filtro `VinculoSuperior.partner2 is null` no primeiro ramo (`SELECT`), garantindo que filiais subordinadas (`UKM001`) nunca sejam emitidas como `PartnerMatriz` avulsa mesmo que possuam registro próprio no segmento `1000`.

2. **`ZI_FI_GRUPO_INADIMPLENTE` *(Nova CDS Auxiliar — Criar)*:**
   * Nova **CDS** (*Core Data Services* — visão de dados no banco) intermediária criada para consolidar a situação de inadimplência do grupo econômico sem somar valores entre empresas.
   * Cruza os parceiros da `ZI_FI_PARCEIRO_CREDITO` com os títulos vencidos da [[04 - ZI_FI_TITULOS_VENCIDOS|ZI_FI_TITULOS_VENCIDOS]], avalia a régua de corte individualmente por empresa (acima de zero para à vista ou a partir de R$ 500,01 para a prazo) e devolve, por Matriz e segmento de crédito, apenas uma sinalização única informando se existe **ao menos uma empresa inadimplente** no grupo.

3. **[[06 - ZI_FI_CLIENTE_INADIMPLENTE (CDS)|ZI_FI_CLIENTE_INADIMPLENTE (CDS)]] *(CDS Raiz — Ajustar)*:**
   * Promover a empresa de origem da dívida (`PartnerOrigem`) para campo chave da entidade raiz, formando a chave única **Matriz (`PartnerMatriz`) + Segmento de Crédito (`CreditSegment`) + Origem (`PartnerOrigem`)**.
   * Manter em cada linha os valores vencidos, o vencimento mais antigo e os dias em atraso exclusivos daquela empresa.
   * Consumir a sinalização da nova CDS auxiliar (`ZI_FI_GRUPO_INADIMPLENTE`) para calcular a ação proposta e a ordenação com a **regra 100% simétrica pelo grupo**:
     * Grupo desbloqueado com ao menos uma empresa acima do corte: todas as linhas do grupo sugerem **Bloquear**.
     * Grupo bloqueado por inadimplência sem nenhuma empresa acima do corte: todas as linhas do grupo sugerem **Desbloquear**.
     * Demais casos (inclusive grupo bloqueado que ainda possui empresa acima do corte): sugestão em branco.

4. **[[09 - ZC_FI_CLIENTE_INADIMPLENTE (CDS)|ZC_FI_CLIENTE_INADIMPLENTE (CDS)]] *(CDS de Projeção — Ajustar)*:**
   * Promover também o campo `PartnerOrigem` para chave primária na visão de projeção exposta ao aplicativo Fiori.

1. **[[07 - ZI_FI_CLIENTE_INADIMPLENTE (BDEF)|ZI_FI_CLIENTE_INADIMPLENTE (BDEF)]] e [[11 - ZC_FI_CLIENTE_INADIMPLENTE (BDEF)|ZC_FI_CLIENTE_INADIMPLENTE (BDEF)]] *(BDEFs — Reativar)*:**
   * Reativar as definições de comportamento (**BDEF** — *Behavior Definition*) da raiz e da projeção após a mudança de chave, para que o modelo **RAP** (*ABAP RESTful Application Programming Model*) passe a trafegar os três campos na chave das ações.

6. **[[08 - ZCLFI_BP_CLIENTE_INAD|ZCLFI_BP_CLIENTE_INAD]] *(Classe de Comportamento — Ajustar)*:**
   * Ajustar o método de leitura (`read`) para filtrar também pelo campo `PartnerOrigem`, garantindo que as ações **Bloquear** e **Desbloquear** leiam exclusivamente a linha selecionada pelo usuário (sem retornar outras linhas da mesma Matriz).
   * Validar que o processamento em cascata, as autorizações e o registro na tabela [[01 - ZTFI_LOG_INADIMP|ZTFI_LOG_INADIMP]] funcionam normalmente com a nova chave composta.

7. **[[13 - ZUI_O2_FI_CLIENTE_INAD|ZUI_O2_FI_CLIENTE_INAD]] *(Service Binding — Republicar)*:**
   * Republicar o serviço **OData** (*Open Data Protocol*) V2 para atualizar os metadados com a nova chave tripla, garantindo que o aplicativo [[14 - bloqinadimplente (App Fiori)|bloqinadimplente]] reconheça cada linha como registro único na seleção em massa.

---

## 5. Teste Pós Ajuste

> Além do roteiro geral de testes do revisor em [[CR-117 - Checklist de Testes no QAS|CR-117]], os cenários abaixo validam diretamente no **QAS** (*Quality Assurance System* — ambiente de qualidade) o teste exigido pelo supervisor técnico referente ao **CR-101** e os comportamentos adicionais desenhados nesta solução.

### Teste solicitado pelo Supervisor Técnico (ref. ao CR-101)

* **1. Matriz com 2 ou mais filiais** *(itens 1 e 2 do [[Code Review 1.pdf|Code Review 1]], adaptados à visão por empresa)* — **Registro:** —
  - [x] **1.1. Listagem do grupo:** Consultar matriz com 2 ou mais filiais e validar se a tela exibe 1 linha própria para a matriz e 1 para cada filial, com seus respectivos títulos vencidos e sem repetições. ✅ 2026-11-19
  - [x] **1.2. Sugestão de bloqueio:** Em grupo com **Classe de Risco** preenchida na matriz e ao menos uma empresa acima da régua, validar se todas as linhas do grupo sugerem **Bloquear**. ✅ 2026-11-19
  - [x] **1.3. Bloqueio e histórico:** Acionar **Bloquear** em uma linha do grupo (testando também por uma filial) e validar se matriz e filiais foram bloqueadas por inadimplência, gerando 1 registro de histórico por empresa. ✅ 2026-11-19

### Testes adicionais do que foi implementado aqui (além do pedido pelo supervisor)

* **1. Títulos vencidos da própria Matriz em grupo com filiais vinculadas** — **Registro:** —
  - [x] **1.1. Linha própria da Matriz:** Consultar grupo econômico com pelo menos 1 filial vinculada em que a Matriz tenha títulos vencidos (mesmo com filiais em dia) e validar se a tela exibe a linha própria da Matriz. ✅ 2026-11-19
  - [x] **1.2. Exibição dos débitos da Matriz:** Validar se o valor vencido, o vencimento mais antigo e os dias em atraso da própria Matriz são exibidos sem serem ocultados pelas filiais. ✅ 2026-11-19

* **2. Régua de corte avaliada individualmente por empresa (sem somar saldos do grupo)** — **Registro:** —
  - [x] **2.1. Abaixo do corte individual (soma acima):** Em grupo na **Classe de Risco** `2A` (corte a partir de R$ 500,01) onde matriz e filial devem abaixo de R$ 500,01 individualmente, mas cuja soma ultrapassa R$ 500,01 (ex.: R$ 300,00 cada), validar que nenhuma linha sugere **Bloquear**. ✅ 2026-11-19
  - [x] **2.2. Acima do corte individual:** Quando ao menos uma empresa do grupo ultrapassar R$ 500,01 sozinha, validar se o grupo passa a sugerir **Bloquear**. ✅ 2026-11-19

* **3. Regra 100% simétrica de sugestão no grupo** — **Registro:** —
  - [x] **3.1. Bloqueio simétrico:** Em grupo desbloqueado onde apenas uma empresa ultrapassa a régua e as demais estão em dia (R$ 0,00), validar se **todas** as linhas do grupo sugerem **Bloquear**. ✅ 2026-11-19
  - [x] **3.2. Proteção contra desbloqueio parcial:** Em grupo já bloqueado por inadimplência onde uma filial está em dia (R$ 0,00), mas outra empresa do grupo segue acima da régua, validar que **nenhuma** linha (nem a filial em dia) sugere **Desbloquear**. ✅ 2026-11-19
  - [x] **3.3. Liberação simétrica:** Após a regularização da última empresa devedora (todas abaixo da régua), validar se **todas** as linhas do grupo passam a sugerir **Desbloquear**. ✅ 2026-11-19

---

