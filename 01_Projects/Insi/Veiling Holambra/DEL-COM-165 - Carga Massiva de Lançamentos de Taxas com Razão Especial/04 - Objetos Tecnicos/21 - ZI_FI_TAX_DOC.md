---
tipo: objeto-tecnico
tags:
  - projeto
  - veiling-holambra
  - sap
  - fi
  - cds
  - rap
  - abap-cloud
  - del-com-165
  - objeto-tecnico
id_demanda: DEL-COM-165
objeto: "ZI_FI_TAX_DOC"
camada: "2 - Modelagem CDS"
data: 2026-11-11
aliases:
  - "ZI_FI_TAX_DOC"
---

# 📦 `ZI_FI_TAX_DOC` (CDS Child View Entity — Documentos do Lote)

⬅️ [[01 - DEL-COM-165 - Arquitetura App 1 (Carga Massiva de Taxas)|Voltar para Arquitetura App 1]] | 🎨 [[01 - DEL-COM-165 - Arquitetura Técnica App 1 (Carga Massiva).excalidraw|Ver no Diagrama Excalidraw App 1]]

---

## 📌 Visão Geral do Objeto

A CDS View `ZI_FI_TAX_DOC` representa o **nível 2 (Entidade Filha — Documento Contábil)** dentro da hierarquia do Aplicativo 1. Ela lê os dados da tabela [[04 - ZTFI_TAX_DOC|ZTFI_TAX_DOC]], conecta-se ao cabeçalho do lote via `association to parent ZI_FI_TAX_CARGA as _Carga`, compõe suas partidas contábeis via `composition [0..*] of ZI_FI_TAX_ITEM as _Itens` e associa a tabela de configuração [[11 - ZI_FI_TAX_TPMOV (CDS)|ZI_FI_TAX_TPMOV]] para exibir a descrição do Tipo de Movimento.

---

## ⚖️ Regras de Negócio Aplicadas

1. **Status Individual e Criticidade Visual por Documento (`DOCSEQ`):**
   - `L` (*Lançado*): Criticidade `3` (Verde), exibe o `belnr` e `gjahr` gerados pela BAPI.
   - `V` (*Verificado OK*): Criticidade `3` (Verde), pronto para contabilização quando o usuário acionar o botão **Contabilizar Lote**.
   - `E` (*Erro*): Criticidade `1` (Vermelho), exibe a mensagem detalhada da falha no campo `mensagem`.

---

## 🛠️ Passo a Passo da Criação do Objeto

1. **No Eclipse ADT:** Conecte-se ao sistema e acesse o pacote `ZFI_CARGA_TAXAS`.
2. Clique com o botão direito -> **`New`** -> **`Data Definition`**.
3. Preencha as propriedades:
   - **Name:** `ZI_FI_TAX_DOC`
   - **Description:** `DEL-COM-165: CDS Child Documentos Contábeis do Lote`
4. Selecione o template **`Define View Entity`** e conclua o assistente.
5. Substitua o código gerado pelo snippet abaixo e ative com **`Ctrl + F3`**.

---

## 💻 Snippet de Código

### 📝 Código Comentado (Para Estudo e Referência)

```abap
@AccessControl.authorizationCheck: #NOT_REQUIRED
@EndUserText.label: 'DEL-COM-165: Documentos Contábeis do Lote'
@Metadata.ignorePropagatedAnnotations: true
define view entity ZI_FI_TAX_DOC
  as select from ztfi_tax_doc
  association        to parent ZI_FI_TAX_CARGA as _Carga         on $projection.carga_id = _Carga.carga_id
  composition [0..*] of ZI_FI_TAX_ITEM         as _Itens
  association [0..1] to ZI_FI_TAX_TPMOV        as _TipoMovimento on $projection.ztpmov   = _TipoMovimento.ztpmov
{
      // Chave composta: ID do Lote + Sequencial do Documento na planilha (DOCSEQ)
  key carga_id,
  key docseq,
      // Dados de cabeçalho do documento contábil (colunas A..H do Excel)
      ztpmov,
      bukrs,
      bldat,
      budat,
      xblnr,
      bktxt,
      waers,
      // Totalizadores de Débito e Crédito do documento
      @Semantics.amount.currencyCode: 'waers'
      total_debito,
      @Semantics.amount.currencyCode: 'waers'
      total_credito,
      // Status individual do documento: V=Verificado OK, E=Erro, L=Lançado
      status,
      case status
        when 'V' then 'Verificado OK'
        when 'E' then 'Erro na Verificação'
        when 'L' then 'Contabilizado'
        else 'Pendente'
      end as status_texto,
      case status
        when 'L' then 3
        when 'V' then 3
        when 'E' then 1
        else 0
      end as criticidade_status,
      // Número do documento contábil (BELNR) e Exercício (GJAHR) gerados na contabilização
      belnr,
      gjahr,
      // Mensagem principal de validação ou retorno da BAPI
      mensagem,

      // Navegação para o cabeçalho do lote, partidas e cadastro de Tipo de Movimento
      _Carga,
      _Itens,
      _TipoMovimento
}
```

---

### 🚀 Código Limpo (Sem Comentários - Para Copiar e Colar)

```abap
@AccessControl.authorizationCheck: #NOT_REQUIRED
@EndUserText.label: 'DEL-COM-165: Documentos Contábeis do Lote'
@Metadata.ignorePropagatedAnnotations: true
define view entity ZI_FI_TAX_DOC
  as select from ztfi_tax_doc
  association        to parent ZI_FI_TAX_CARGA as _Carga         on $projection.carga_id = _Carga.carga_id
  composition [0..*] of ZI_FI_TAX_ITEM         as _Itens
  association [0..1] to ZI_FI_TAX_TPMOV        as _TipoMovimento on $projection.ztpmov   = _TipoMovimento.ztpmov
{
  key carga_id,
  key docseq,
      ztpmov,
      bukrs,
      bldat,
      budat,
      xblnr,
      bktxt,
      waers,
      @Semantics.amount.currencyCode: 'waers'
      total_debito,
      @Semantics.amount.currencyCode: 'waers'
      total_credito,
      status,
      case status
        when 'V' then 'Verificado OK'
        when 'E' then 'Erro na Verificação'
        when 'L' then 'Contabilizado'
        else 'Pendente'
      end as status_texto,
      case status
        when 'L' then 3
        when 'V' then 3
        when 'E' then 1
        else 0
      end as criticidade_status,
      belnr,
      gjahr,
      mensagem,

      _Carga,
      _Itens,
      _TipoMovimento
}
```
