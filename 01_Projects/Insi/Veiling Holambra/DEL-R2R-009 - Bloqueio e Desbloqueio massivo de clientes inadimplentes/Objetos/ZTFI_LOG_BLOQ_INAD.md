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
objeto: ZTFI_LOG_BLOQ_INAD
camada: 1 - Dicionário de Dados
data: 2026-10-23
---

# 🗄️ `ZTFI_LOG_BLOQ_INAD` (Tabela Transparente de Log)

⬅️ [[DEL-R2R-009 - Arquitetura e Objetos|Voltar para Arquitetura e Objetos]] | 🎨 [[DEL-R2R-009 - Arquitetura da Camada CDS.excalidraw|Ver no Diagrama Excalidraw]]

---

## 📌 Visão Geral do Objeto

A **`ZTFI_LOG_BLOQ_INAD`** é uma **Tabela Transparente** do Dicionário de Dados ABAP (DDIC — *ABAP Data Dictionary*, o repositório central de tabelas do SAP), criada via código DDL (*Data Definition Language*) no Eclipse ADT (*ABAP Development Tools*).

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
@EndUserText.label : 'DEL-R2R-009: Log de Bloqueio e Desbloqueio de Inadimplentes'
@AbapCatalog.enhancement.category : #NOT_EXTENSIBLE
@AbapCatalog.tableCategory : #TRANSPARENT
@AbapCatalog.deliveryClass : #A
@AbapCatalog.dataMaintenance : #RESTRICTED
define table ztfi_log_bloq_inad {

  key client         : abap.clnt not null;
  key log_id         : sysuuid_x16 not null;
  partner            : bu_partner not null;
  partner_origem     : bu_partner;
  credit_sgmnt       : ukm_credit_sgmnt;
  acao               : abap.char(1);
  block_reason       : ukm_block_reason;
  status             : abap.char(1);
  mensagem           : abap.char(220);
  risk_class         : ukm_risk_class;
  moeda              : waers_curc;
  @Semantics.amount.currencyCode : 'ztfi_log_bloq_inad.moeda'
  vlr_vencido        : abap.curr(15,2);
  dias_atraso        : abap.int4;
  created_by         : abp_creation_user;
  created_at         : abap.utclong;

}
```
