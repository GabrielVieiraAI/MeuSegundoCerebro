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

A proposta de solução consiste em duas etapas: um job de identificação, que apura quais clientes inadimplentes devem ser bloqueados ou desbloqueados, e um aplicativo Fiori de gestão em massa, no qual o usuário seleciona vários clientes de uma só vez e efetiva o bloqueio ou o desbloqueio.

* **Job de identificação:** executado diariamente às 02:00, em background, após o cálculo de juros e multas (executado pelo delta DEL-COM-068), avalia os Parceiros de Negócio com função de crédito UKM000 na empresa CVH1, exceto os da classe de risco “5 – CVH Interna”. Para cada cliente, identifica pela classe de risco se o cliente é à vista ou a prazo, apura os títulos vencidos em Contas a Receber e compara o resultado com as regras estabelecidas no BPDD:
  > “Clientes a vista – bloqueio a partir de 1 dia de título vencido, qualquer valor (seja por aluguel de material circulante, qualquer outra cobrança avulsa ou compras realizadas no KLOK durante as janelas de atualização de crédito que podem liberar vendas, mesmo com saldo já consumido)
  > Clientes a prazo – bloqueio a partir de R$ 500,01 e 1 dia de título vencido (existem clientes que não devem ser bloqueados, como por exemplo, supermercados)”

* **Lista de clientes:** o resultado do job é gravado com a ação proposta para cada cliente: bloquear (inadimplente que ainda está desbloqueado) ou desbloquear clientes regularizados.

* **Aplicativo de gestão em massa:** hoje o app standard Administrar contas de crédito já permite bloquear e desbloquear, porém um cliente por vez. O novo app apresenta a lista gerada pelo job no padrão Fiori: o usuário filtra (inclusive pelo segmento de atuação, que identifica supermercados e similares como Autosserviço), seleciona vários clientes, aciona Bloquear ou Desbloquear e informa o motivo. Nenhum bloqueio é efetivado sem essa confirmação.

* **Escopo restrito a inadimplentes:** bloqueios por outros motivos, como problemas fiscais, continuam sendo feitos individualmente no app standard e não são propostos nem alterados por este desenvolvimento. Esses bloqueios também chegam aos legados pelo DEL-COM-051.

* **Gravação do bloqueio:** o bloqueio é gravado no mesmo campo utilizado pelo app standard, o indicador de bloqueio do segmento de crédito do cliente, acompanhado do motivo informado pelo usuário via seleção match code. O bloqueio é único e vale tanto para a Comercialização quanto para o Material Circulante. Assim, o bloqueio fica visível no app Administrar contas de crédito, é retornado pelas APIs de consulta de crédito (DEL-COM-168 e DEL-COM-068) e fica registrado no histórico de alterações standard do cliente, que é o ponto de leitura do DEL-COM-051.

* **Tabela de log – auditoria e reconhecimento dos bloqueios do app:** cada bloqueio e desbloqueio efetivado pelo app é registrado em uma tabela de log, com cliente, ação, motivo, usuário, data e hora e a situação do cliente naquele momento. Essa tabela garante a rastreabilidade das ações e permite ao job reconhecer os bloqueios feitos pelo próprio app.

* **Como o app reconhece os seus próprios bloqueios:** o motivo de inadimplência não é exclusivo deste app e pode ser utilizado em outros pontos do SAP. Por isso, o reconhecimento é feito pela tabela de log: o cliente só é considerado bloqueado pelo DEL-R2R-009 quando o último registro dele no log é um bloqueio, ele continua bloqueado e o motivo atual é o mesmo registrado pelo app. Se o bloqueio for alterado ou refeito no app standard, o cliente deixa de ser proposto para desbloqueio e passa à gestão individual.

* **Clientes vinculados (matriz e filiais):** o SAP permite relacionar Parceiros de Negócio em uma hierarquia de crédito, com o crédito controlado a partir do BP principal. O job utiliza essa relação standard: quando um BP do grupo ficar inadimplente, o BP principal e todos os BPs vinculados são propostos para bloqueio, e só voltam a ser propostos para desbloqueio quando todo o grupo estiver regularizado.

* **Distribuição aos legados:** o DEL-R2R-009 não envia mensagens; sua responsabilidade termina na gravação do bloqueio e do log. O DEL-COM-051 identifica qualquer alteração no indicador de bloqueio, feita por este app ou pelo app standard Administrar contas de crédito, e publica a situação do cliente na fila RabbitMQ mantida pelo time de legados.

* **Crédito sazonal fora do escopo:** o DEL-R2R-009 não altera, reverte nem consulta o limite de crédito sazonal (crédito adicional) do cliente, nem no bloqueio nem no desbloqueio. A gestão do crédito sazonal permanece integralmente no DEL-COM-064.

---

## Resultados Esperados

Com a implementação deste desenvolvimento, espera-se entregar à área de Contas a Receber/Crédito os seguintes ganhos:

* Identificação automática dos clientes inadimplentes conforme a classe de risco, substituindo a apuração manual feita hoje no CVD.
* Bloqueio e desbloqueio em massa, mantendo a decisão final do usuário cliente a cliente.
* Desbloqueio ágil de clientes regularizados, reduzindo o tempo em que um cliente adimplente permanece impedido de comprar.
* Status de bloqueio centralizado no SAP, consultável pelas APIs de crédito e distribuído aos legados pelo DEL-COM-051.
* Rastreabilidade de cada bloqueio e desbloqueio (quem, quando, por qual motivo e com qual saldo vencido), atendendo à auditoria.
* Redução do risco de vendas a clientes inadimplentes, especialmente nas janelas de atualização de crédito do leilão KLOK.

---

## Fluxo do Processo

### Fluxo de identificação, bloqueio e desbloqueio de clientes inadimplentes

![[Imagens/fluxo-processo-del-r2r-009.png]]

---

## Protótipo do Aplicativo

### Tela 1 – List Report: filtro por segmento, seleção múltipla e ações Bloquear / Desbloquear

![[Imagens/prototipo-tela-1-list-report.png]]

### Tela 2 – Diálogo padrão da ação Bloquear, com o motivo informado pelo usuário

![[Imagens/prototipo-tela-2-dialogo-bloquear.png]]
