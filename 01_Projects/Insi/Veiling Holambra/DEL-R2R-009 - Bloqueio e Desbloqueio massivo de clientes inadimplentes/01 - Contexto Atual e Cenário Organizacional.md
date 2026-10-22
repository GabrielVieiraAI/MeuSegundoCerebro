---
tags:
  - projeto
  - insi
  - veiling-holambra
  - sap
  - fi-ar
  - del-r2r-009
id_demanda: DEL-R2R-009
secao: 01 - Contexto Atual e Cenário Organizacional
---

# 01 – Contexto Atual e Cenário Organizacional

⬅️ [[00 - Identificação da Solicitação e Sumário|Voltar ao Sumário]] | ➡️ [[02 - Estratégia da Solução|Próxima Seção: Estratégia da Solução]]

---

## Visão Geral do Negócio

O Veiling comercializa flores e plantas para uma ampla carteira de clientes, que compram pelo leilão KLOK, pelos canais de intermediação e plataformas online, além de alugarem Material Circulante (carrinhos e divisórias). Parte desses clientes compra à vista, mediante antecipação financeira, e parte compra a prazo, dentro de um limite de crédito concedido pela cooperativa.

Para evitar novas vendas a clientes com pendências financeiras, o Veiling mantém hoje, no sistema legado CVD, uma tela customizada que identifica os clientes inadimplentes, permite o bloqueio e o desbloqueio em massa e oferece a opção “Desbloquear Clientes Regularizados e/ou Reverter valores liberados provisoriamente”.

Conforme o BPDD de Contas a Receber (capítulo 3.8.11 – Bloqueio e Desbloqueio de inadimplentes), as regras de bloqueio são:
* **Clientes à vista** – bloqueio a partir de 1 dia de título vencido, qualquer valor.
* **Clientes a prazo** – bloqueio a partir de R$ 500,01 e 1 dia de título vencido (existem clientes que não devem ser bloqueados, como por exemplo, supermercados).

Para execução do bloqueio e desbloqueio massivo é necessário efetuar uma análise, feita através da seleção individual, pois existem clientes que, mesmo sem dívida, não podem ser liberados para novas compras, como nos casos de irregularidades fiscais.

---

Com o novo ERP da SAP, o Contas a Receber e o Controle de Crédito, passam a ser a fonte única dos títulos em aberto e dos dados de crédito dos clientes. O SAP disponibiliza no Controle de Crédito o indicador de bloqueio por Parceiro de Negócio e segmento de crédito, inclusive com o motivo do bloqueio, porém sua manutenção é individual: não existe no padrão uma rotina que identifique os clientes inadimplentes segundo as regras do Veiling e permita bloqueá-los ou desbloqueá-los em massa.

Além disso, conforme o BPDD de Controle de Crédito (capítulo 3.8.5), o SAP não bloqueia ordens de venda no Veiling: a decisão de permitir ou impedir uma compra é dos sistemas legados. O bloqueio registrado no SAP é, portanto, o dado mestre que os legados precisam receber para impedir novas compras.

Sem este desenvolvimento, a identificação dos inadimplentes seria manual, cliente a cliente, com risco de um cliente inadimplente continuar comprando no leilão e de um cliente regularizado permanecer bloqueado indevidamente.

É nesse contexto que se insere o desenvolvimento DEL-R2R-009, que tem como objetivo identificar os clientes que ultrapassam a régua de inadimplência definida para sua classificação de crédito e permitir à área de Contas a Receber/Crédito bloqueá-los ou desbloqueá-los em massa no SAP. Cada bloqueio e desbloqueio é gravado no indicador de bloqueio do Controle de Crédito, que mantém o histórico de alterações do cliente, e registrado em uma tabela de log para auditoria. A distribuição dessa informação aos sistemas legados, por meio da fila RabbitMQ, é feita pelo delta DEL-COM-051 a partir da alteração do bloqueio no SAP.
