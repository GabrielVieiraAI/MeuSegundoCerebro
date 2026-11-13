---
tipo: objeto-tecnico
tags:
  - projeto
  - veiling-holambra
  - sap
  - fi
  - ddic
  - abap-cloud
  - del-com-165
  - objeto-tecnico
id_demanda: DEL-COM-165
objeto: "ZTFI_TAX_DOC"
camada: "1 - Dicionário de Dados"
data: 2026-11-11
aliases:
  - "ZTFI_TAX_DOC"
---

# 📦 `ZTFI_TAX_DOC` (Tabela Transparente — Documentos Contábeis do Lote)

⬅️ [[01 - DEL-COM-165 - Arquitetura App 1 (Carga Massiva de Taxas)|Voltar para Arquitetura App 1]] | 🎨 [[01 - DEL-COM-165 - Arquitetura Técnica App 1 (Carga Massiva).excalidraw|Ver no Diagrama Excalidraw App 1]]

---

## 📌 Visão Geral do Objeto

A tabela transparente `ZTFI_TAX_DOC` representa o **nível 2 (Entidade Filha / Documento Contábil)** na hierarquia do Aplicativo 1. Cada valor distinto da coluna `DOCSEQ` (Sequencial de Documento) na planilha Excel origina um registro em `ZTFI_TAX_DOC`, contendo os dados de cabeçalho do documento contábil (`BKPF`), os somatórios de débito e crédito das suas partidas, o status individual (`V`, `E` ou `L`), o número do documento contábil gerado (`belnr` + `gjahr`) e a mensagem principal retornada pela validação ou pela BAPI (`mensagem`).

---

## ⚖️ Regras de Negócio Aplicadas

1. **Agrupamento por `DOCSEQ` (Colunas A a H do Excel):**
   - Armazena os campos de cabeçalho informados na primeira linha de cada `DOCSEQ`: Tipo de Movimento (`ztpmov`), Empresa (`bukrs`, padrão `CVH1`), Data do Documento (`bldat`), Data de Lançamento (`budat`), Referência (`xblnr`), Texto do Cabeçalho (`bktxt`) e Moeda (`waers`, padrão `BRL`).
2. **Controle Individual de Status e Mensagem Única:**
   - `status = 'V'` (*Verificado OK*): Documento validado e aprovado na simulação `BAPI_ACC_DOCUMENT_CHECK`, apto para contabilização.
   - `status = 'E'` (*Erro*): Documento com erro de regra de negócio ou erro na BAPI. O motivo exato fica gravado no campo `mensagem` (`abap.char(220)`).
   - `status = 'L'` (*Lançado*): Documento contabilizado com sucesso pela `BAPI_ACC_DOCUMENT_POST`, com `belnr` e `gjahr` preenchidos.
3. **Base para Verificação de Duplicidade:**
   - Durante o upload de novas cargas, o sistema consulta os documentos já contabilizados (`ZTFI_TAX_DOC-status = 'L'`) cruzando com `ZTFI_TAX_ITEM` pela chave `XBLNR + LIFNR + ZTPMOV + Valor` para impedir lançamentos duplicados.

---

## 🛠️ Passo a Passo da Criação do Objeto

1. **No Eclipse ADT:** Conecte-se ao sistema e acesse o pacote `ZFI_CARGA_TAXAS`.
2. Clique com o botão direito -> **`New`** -> **`Database Table`**.
3. Preencha as propriedades:
   - **Name:** `ZTFI_TAX_DOC`
   - **Description:** `DEL-COM-165: Documentos Contábeis do Lote de Carga`
4. Selecione a Request (TR) de desenvolvimento e conclua o assistente.
5. Substitua o código gerado pelo snippet abaixo e ative com **`Ctrl + F3`**.

---

## 💻 Snippet de Código

### 📝 Código Comentado (Para Estudo e Referência)

```abap
@EndUserText.label : 'DEL-COM-165: Documentos do Lote de Carga'
@AbapCatalog.enhancement.category : #NOT_EXTENSIBLE
@AbapCatalog.tableCategory : #TRANSPARENT
@AbapCatalog.deliveryClass : #A
@AbapCatalog.dataMaintenance : #RESTRICTED
define table ztfi_tax_doc {

  // Mandante e chave composta (ID da Carga + Sequencial do Documento na planilha)
  key client        : abap.clnt not null;
  key carga_id      : abap.numc(10) not null;
  key docseq        : abap.numc(4) not null;
  // Dados de cabeçalho do documento lidos das colunas A..H do Excel
  ztpmov            : abap.char(6);
  bukrs             : bukrs;
  bldat             : bldat;
  budat             : budat;
  xblnr             : xblnr1;
  bktxt             : bktxt;
  waers             : waers;
  // Somatórios de débito e crédito das partidas deste documento (para conferência de saldo zero)
  @Semantics.amount.currencyCode : 'ztfi_tax_doc.waers'
  total_debito      : abap.curr(13,2);
  @Semantics.amount.currencyCode : 'ztfi_tax_doc.waers'
  total_credito     : abap.curr(13,2);
  // Status individual do documento: V=Verificado OK, E=Erro, L=Lançado
  status            : abap.char(1);
  // Documento contábil (BELNR) e Exercício (GJAHR) gerados após BAPI_ACC_DOCUMENT_POST
  belnr             : belnr_d;
  gjahr             : gjahr;
  // Mensagem principal de validação ou retorno da BAPI
  mensagem          : abap.char(220);

}
```

---

### 🚀 Código Limpo (Sem Comentários - Para Copiar e Colar)

```abap
@EndUserText.label : 'DEL-COM-165: Documentos do Lote de Carga'
@AbapCatalog.enhancement.category : #NOT_EXTENSIBLE
@AbapCatalog.tableCategory : #TRANSPARENT
@AbapCatalog.deliveryClass : #A
@AbapCatalog.dataMaintenance : #RESTRICTED
define table ztfi_tax_doc {

  key client        : abap.clnt not null;
  key carga_id      : abap.numc(10) not null;
  key docseq        : abap.numc(4) not null;
  ztpmov            : abap.char(6);
  bukrs             : bukrs;
  bldat             : bldat;
  budat             : budat;
  xblnr             : xblnr1;
  bktxt             : bktxt;
  waers             : waers;
  @Semantics.amount.currencyCode : 'ztfi_tax_doc.waers'
  total_debito      : abap.curr(13,2);
  @Semantics.amount.currencyCode : 'ztfi_tax_doc.waers'
  total_credito     : abap.curr(13,2);
  status            : abap.char(1);
  belnr             : belnr_d;
  gjahr             : gjahr;
  mensagem          : abap.char(220);

}
```
