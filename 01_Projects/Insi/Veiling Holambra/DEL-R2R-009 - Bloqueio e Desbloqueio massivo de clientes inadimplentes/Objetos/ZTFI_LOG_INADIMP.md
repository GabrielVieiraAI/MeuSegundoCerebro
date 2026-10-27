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
  - objeto-tecnico
  - ddic
id_demanda: DEL-R2R-009
objeto: ZTFI_LOG_INADIMP
camada: 1 - Dicionário de Dados
data: 2026-10-23
---

# 🗄️ `ZTFI_LOG_INADIMP` (Tabela Transparente de Log)

⬅️ [[DEL-R2R-009 - Arquitetura e Objetos|Voltar para Arquitetura e Objetos]] | 🎨 [[DEL-R2R-009 - Arquitetura da Camada CDS.excalidraw|Ver no Diagrama Excalidraw]]

---

## 📌 Visão Geral do Objeto

A **`ZTFI_LOG_INADIMP`** é uma **Tabela Transparente** do Dicionário de Dados ABAP (DDIC — *ABAP Data Dictionary*, o repositório central de tabelas do SAP), criada via código DDL (*Data Definition Language*) no Eclipse ADT (*ABAP Development Tools*).

Sua única responsabilidade é guardar o **histórico de auditoria (log)** de todas as ações de **Bloqueio (`B`)** e **Desbloqueio (`D`)** executadas pelos usuários dentro do aplicativo Fiori da demanda **DEL-R2R-009**.

Seguindo a abordagem **ABAP Cloud Lean**, esta tabela reutiliza elementos de dados standard liberados pela SAP (como `sysuuid_x16` e `bu_partner`) combinados com tipos primitivos embutidos (`abap.char`, `abap.curr`, `abap.utclong`), evitando a criação desnecessária de Domínios (`ZD_*`) e Elementos de Dados (`ZE_*`) customizados.

---

## ⚖️ Regras de Negócio Aplicadas

1. **Exclusiva para Auditoria:** A tabela não é lida pelas CDS Views para determinar o status atual de bloqueio (que vem direto da tabela standard `UKMBP_CMS_SGM`). Ela existe unicamente para rastreabilidade de *quem* bloqueou/desbloqueou, *quando* e em *qual situação financeira* o cliente estava naquele exato momento.
2. **Um Registro por Ação e por Cliente:** Cada clique em "Bloquear" ou "Desbloquear" gera uma linha única identificada por um UUID (*Universally Unique Identifier* — identificador único universal de 16 bytes gerado automaticamente pelo SAP).
3. **Rastreabilidade de Grupo (Matriz vs. BP de Origem):** Grava tanto o código do BP da **Matriz** (`partner`, onde o bloqueio de crédito acontece) quanto o **BP de Origem** (`partner_origem`, a filial que originou a dívida ou o próprio BP caso não haja filial).
4. **Fotografia Financeira no Momento da Ação:** Registra a classe de risco (`risk_class`), o valor total vencido (`vlr_vencido`) e os dias em atraso (`dias_atraso`) que o cliente apresentava quando o operador clicou no botão, além do status da gravação (`S` = Sucesso ou `E` = Erro) e mensagem de retorno.
5. **Sem Carga Inicial no Go-Live:** Conforme alinhado em reunião, a tabela entrará em produção vazia e passará a registrar os eventos a partir do uso do aplicativo.

---

## 💻 Snippet de Código

```abap
@EndUserText.label : 'DEL-R2R-009: Log Clientes Inadimplentes'
@AbapCatalog.enhancement.category : #NOT_EXTENSIBLE
@AbapCatalog.tableCategory : #TRANSPARENT
@AbapCatalog.deliveryClass : #A
@AbapCatalog.dataMaintenance : #RESTRICTED
define table ztfi_log_inadimp {

  key client         : abap.clnt not null;          // Mandante SAP: isola os registros e evita compartilhamento de dados entre mandantes
  key log_id         : sysuuid_x16 not null;        // Chave primária: UUID de 16 bytes gerado automaticamente a cada execução
  partner            : bu_partner not null;         // BP da Matriz: cliente principal onde o bloqueio de crédito no FSCM é efetivado
  partner_origem     : bu_partner;                  // BP de Origem: filial que originou a dívida (ou a própria Matriz se não houver filial)
  credit_sgmnt       : ukm_credit_sgmnt;            // Segmento de Crédito: identifica a área de crédito avaliada (ex.: 1000)
  acao               : abap.char(1);                // Ação realizada: registra se o operador clicou em 'B' (Bloquear) ou 'D' (Desbloquear)
  block_reason       : ukm_block_reason;            // Motivo do bloqueio: código gravado no FSCM no momento da ação (ex.: 10 = Inadimplência)
  status             : abap.char(1);                // Status da execução: 'S' (Sucesso ao chamar APIs) ou 'E' (Erro durante o processamento)
  mensagem           : abap.char(220);              // Mensagem de retorno: texto descritivo do resultado ou detalhe do erro retornado
  risk_class         : ukm_risk_class;              // Classe de risco: fotografia do perfil do cliente (1A, 2A) no instante do bloqueio
  moeda              : waers_curc;                  // Moeda de referência: código da moeda (ex.: BRL) associado ao montante vencido
  @Semantics.amount.currencyCode : 'ztfi_log_inadimp.moeda'
  vlr_vencido        : abap.curr(15,2);             // Montante vencido: fotografia do saldo total em atraso no momento em que a ação foi disparada
  dias_atraso        : abap.int4;                   // Dias em atraso: maior quantidade de dias vencidos que o cliente possuía no momento
  created_by         : abp_creation_user;           // Usuário executor: login SAP (sy-uname) do operador que confirmou a ação no Fiori
  created_at         : abap.utclong;                // Timestamp de auditoria: data, hora, minuto e segundo exatos (UTC) da gravação

}
```
