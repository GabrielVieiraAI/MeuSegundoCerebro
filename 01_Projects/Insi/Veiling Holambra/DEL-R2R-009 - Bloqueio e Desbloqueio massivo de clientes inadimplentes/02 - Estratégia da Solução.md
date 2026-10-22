---
tags:
  - projeto
  - insi
  - veiling-holambra
  - sap
  - fi-ar
  - del-r2r-009
id_demanda: DEL-R2R-009
secao: 02 - Estratégia da Solução
---

# 02 – Estratégia da Solução

⬅️ [[01 - Contexto Atual e Cenário Organizacional|Seção Anterior]] | 🏠 [[00 - Identificação da Solicitação e Sumário|Sumário]] | ➡️ [[03 - Detalhamento para Desenvolvimento|Próxima Seção: Detalhamento para Desenvolvimento]]

---

## Proposta da Solução

A proposta de solução consiste em um aplicativo Fiori de gestão em massa, no qual o usuário seleciona vários clientes de uma só vez e efetiva o bloqueio ou o desbloqueio.

- **Aplicativo de Gestão em Massa:** Diferente do app standard da SAP (que só altera um cliente por vez), o novo app Fiori permite selecionar múltiplos clientes para bloquear ou desbloquear em lote. O usuário pode filtrar a lista (inclusive para identificar supermercados/Autosserviço) e deve sempre confirmar a ação informando o motivo, nenhum bloqueio é feito de forma automática.
	- Regra para propor o bloqueio:
		- “Clientes a vista – bloqueio a partir de 1 dia de título vencido, qualquer valor (seja por aluguel de material circulante, qualquer outra cobrança avulsa ou compras realizadas no KLOK durante as janelas de atualização de crédito que podem liberar vendas, mesmo com saldo já consumido).
		- Clientes a prazo – bloqueio a partir de R$ 500,01 e 1 dia de título vencido (existem clientes que não devem ser bloqueados, como por exemplo, supermercados)”

* **Escopo restrito a inadimplentes:** bloqueios por outros motivos, como problemas fiscais, continuam sendo feitos individualmente no app standard e não são propostos nem alterados por este desenvolvimento. Esses bloqueios também chegam aos legados pelo DEL-COM-051.

* **Gravação do bloqueio:** O Indicador de Bloqueio de Crédito e o motivo de bloqueio no SAP são campos standard compartilhados, podendo ser alterados manualmente por outros motivos (exemplo: pendências fiscais ou jurídicas). Sem um controle de origem, o aplicativo correria o risco de desbloquear indevidamente clientes que possuem outras restrições além da inadimplência.
	* ==🟡Caso o key user queira desbloquear um cliente que foi bloqueado por motivo diferente de inadimplência será recusado e mostrado a ele na tela correto?==
	* ==🟢A CDS deverá listar apenas os bp's com inadimplência. ==

* **Tabela de log – auditoria e reconhecimento dos bloqueios do app:** cada bloqueio e desbloqueio efetivado pelo app é registrado em uma tabela de log, com cliente, ação, motivo, usuário, data e hora e a situação do cliente naquele momento. Essa tabela garante a rastreabilidade das ações e permite ao App Fiori reconhecer os bloqueios feitos pelo próprio app.

* **Como o app reconhece os seus próprios bloqueios:** o motivo de inadimplência não é exclusivo deste app e pode ser utilizado em outros pontos do SAP. Por isso, ==🟢o reconhecimento é feito pela tabela de log==: ==o cliente só é considerado bloqueado pelo DEL-R2R-009 quando o último registro dele no log é um bloqueio, ele continua bloqueado e o motivo atual é o mesmo registrado pelo app. Se o bloqueio for alterado ou refeito no app standard, o cliente deixa de ser proposto para desbloqueio e passa à gestão individual.
	* Não entendi essa parte, por favor  explicar novamente

- **Clientes Vinculados (Matriz e Filiais):**  
  Na Veiling Holambra, o crédito é centralizado exclusivamente na **Matriz** (as filiais não possuem conta de crédito própria). A **CDS View** avalia essa hierarquia standard em tempo real:
	- Se qualquer filial ficar inadimplente, a proposta de bloqueio é gerada para a **Matriz**, exibindo a filial devedora no campo **BP de Origem** para rastreabilidade.
	- A Matriz só é proposta para desbloqueio quando **todo o grupo** (a matriz e todas as filiais) estiver regularizado.

* **Distribuição aos legados:** o DEL-R2R-009 não envia mensagens; sua responsabilidade termina na gravação do bloqueio e do log. O DEL-COM-051 identifica qualquer alteração no indicador de bloqueio, feita por este app ou pelo app standard Administrar contas de crédito, e publica a situação do cliente na fila RabbitMQ mantida pelo time de legados. 

* **Crédito sazonal fora do escopo:** o DEL-R2R-009 não altera, reverte nem consulta o limite de crédito sazonal (crédito adicional) do cliente, nem no bloqueio nem no desbloqueio. A gestão do crédito sazonal permanece integralmente no DEL-COM-064.

---

## Resultados Esperados

Com a implementação deste desenvolvimento, espera-se entregar à área de Contas a Receber/Crédito os seguintes ganhos:

* Identificação automática dos clientes inadimplentes conforme a classe de risco, substituindo a apuração manual feita hoje no CVD (O que é CVD?).
* Bloqueio e desbloqueio em massa, mantendo a decisão final do usuário cliente a cliente.
* Desbloqueio ágil de clientes regularizados, reduzindo o tempo em que um cliente adimplente permanece impedido de comprar.
* Status de bloqueio centralizado no SAP, consultável pelas APIs de crédito e distribuído aos legados pelo DEL-COM-051.
* Rastreabilidade de cada bloqueio e desbloqueio (quem, quando, por qual motivo e com qual saldo vencido), atendendo à auditoria. Será necessário criar um app Fiori para consultar a tabela de log e auditoria?
* Redução do risco de vendas a clientes inadimplentes, especialmente nas janelas de atualização de crédito do leilão KLOK.

---

## Fluxo do Processo

### Fluxo de identificação, bloqueio e desbloqueio de clientes inadimplentes

> Foi totalmente alterado visto que não usaremos mais a job.

---

## Protótipo do Aplicativo

### Tela 1 – List Report: filtro por segmento, seleção múltipla e ações Bloquear / Desbloquear

![[Imagens/prototipo-tela-1-list-report.png]]

### Tela 2 – Diálogo padrão da ação Bloquear, com o motivo informado pelo usuário

![[Imagens/prototipo-tela-2-dialogo-bloquear.png]]
