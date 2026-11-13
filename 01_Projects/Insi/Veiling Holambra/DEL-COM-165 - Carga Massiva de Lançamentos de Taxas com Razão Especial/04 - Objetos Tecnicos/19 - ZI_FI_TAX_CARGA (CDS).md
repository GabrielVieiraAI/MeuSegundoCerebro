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
objeto: "ZI_FI_TAX_CARGA (CDS)"
camada: "2 - Modelagem CDS"
data: 2026-11-11
aliases:
  - "ZI_FI_TAX_CARGA (CDS)"
  - "ZI_FI_TAX_CARGA"
---

# 📦 `ZI_FI_TAX_CARGA (CDS)` (CDS Root View Entity — Lote de Carga)

⬅️ [[01 - DEL-COM-165 - Arquitetura App 1 (Carga Massiva de Taxas)|Voltar para Arquitetura App 1]] | 🎨 [[01 - DEL-COM-165 - Arquitetura Técnica App 1 (Carga Massiva).excalidraw|Ver no Diagrama Excalidraw App 1]]

---

## 📌 Visão Geral do Objeto

A CDS View `ZI_FI_TAX_CARGA` é a **Entidade Raiz (*Root View Entity*)** da hierarquia de 3 níveis do **Aplicativo 1** (Carga Massiva de Lançamentos de Taxas com Razão Especial). Ela seleciona os dados da tabela [[03 - ZTFI_TAX_CARGA|ZTFI_TAX_CARGA]], declara a relação de composição `composition [0..*] of ZI_FI_TAX_DOC as _Documentos` e calcula o texto descritivo (`status_texto`) e o código de cor (`criticidade_status`) exibidos no monitor Fiori.

---

## ⚖️ Regras de Negócio Aplicadas

1. **Criticidade Visual (`criticidade_status`) e Texto de Status (`status_texto`):**
   - `L` (*Totalmente Lançado*): Criticidade `3` (Verde — Sucesso).
   - `V` (*Verificado OK - Pronto p/ Lançar*): Criticidade `3` (Verde — Apto).
   - `P` (*Parcialmente Lançado*): Criticidade `2` (Amarelo — Atenção, possui documentos lançados e documentos pendentes com erro).
   - `E` (*Com Erros na Verificação*): Criticidade `1` (Vermelho — Erro).
2. **Controle de Acesso via DCL:** A anotação `@AccessControl.authorizationCheck: #CHECK` ativa a verificação automática definida em [[20 - ZI_FI_TAX_CARGA (DCL)|ZI_FI_TAX_CARGA]].

---

## 🛠️ Passo a Passo da Criação do Objeto

1. **No Eclipse ADT:** Conecte-se ao sistema e acesse o pacote `ZFI_CARGA_TAXAS`.
2. Clique com o botão direito -> **`New`** -> **`Data Definition`**.
3. Preencha as propriedades:
   - **Name:** `ZI_FI_TAX_CARGA`
   - **Description:** `DEL-COM-165: Root CDS Cabeçalho do Lote de Carga`
4. Selecione o template **`Define Root View Entity`** e conclua o assistente.
5. Substitua o código gerado pelo snippet abaixo e ative com **`Ctrl + F3`** (em conjunto com [[21 - ZI_FI_TAX_DOC|ZI_FI_TAX_DOC]] e [[22 - ZI_FI_TAX_ITEM|ZI_FI_TAX_ITEM]]).

---

## 💻 Snippet de Código

### 📝 Código Comentado (Para Estudo e Referência)

```abap
@AccessControl.authorizationCheck: #CHECK
@EndUserText.label: 'DEL-COM-165: Root Lote de Carga de Taxas'
@Metadata.ignorePropagatedAnnotations: true
define root view entity ZI_FI_TAX_CARGA
  as select from ztfi_tax_carga
  composition [0..*] of ZI_FI_TAX_DOC as _Documentos
{
      // Identificador único sequencial do lote de carga
  key carga_id,
      // Nome do arquivo Excel (.xlsx) carregado pelo usuário
      nome_arquivo,
      // Status geral: V=Verificado OK, E=Com Erros, P=Parcialmente Lançado, L=Totalmente Lançado
      status_geral,
      // Texto legível do status para exibição no monitor Fiori
      case status_geral
        when 'V' then 'Verificado OK (Pronto p/ Lançar)'
        when 'E' then 'Com Erros na Verificação'
        when 'P' then 'Parcialmente Lançado'
        when 'L' then 'Totalmente Lançado'
        else 'Em Processamento'
      end as status_texto,
      // Criticidade semântica UI5: 1=Vermelho, 2=Amarelo, 3=Verde, 0=Neutro
      case status_geral
        when 'L' then 3
        when 'V' then 3
        when 'P' then 2
        when 'E' then 1
        else 0
      end as criticidade_status,
      // Contadores consolidados do lote
      qtd_docs,
      qtd_validos,
      qtd_erros,
      qtd_lancados,
      // Moeda e somatórios financeiros do lote
      waers,
      @Semantics.amount.currencyCode: 'waers'
      total_debito,
      @Semantics.amount.currencyCode: 'waers'
      total_credito,
      // Campos de auditoria RAP
      @Semantics.user.createdBy: true
      criado_por,
      @Semantics.systemDateTime.createdAt: true
      criado_em,
      @Semantics.user.localInstanceLastChangedBy: true
      alterado_por,
      @Semantics.systemDateTime.localInstanceLastChangedAt: true
      alterado_em,

      // Associação composicional para os documentos contábeis do lote
      _Documentos
}
```

---

### 🚀 Código Limpo (Sem Comentários - Para Copiar e Colar)

```abap
@AccessControl.authorizationCheck: #CHECK
@EndUserText.label: 'DEL-COM-165: Root Lote de Carga de Taxas'
@Metadata.ignorePropagatedAnnotations: true
define root view entity ZI_FI_TAX_CARGA
  as select from ztfi_tax_carga
  composition [0..*] of ZI_FI_TAX_DOC as _Documentos
{
  key carga_id,
      nome_arquivo,
      status_geral,
      case status_geral
        when 'V' then 'Verificado OK (Pronto p/ Lançar)'
        when 'E' then 'Com Erros na Verificação'
        when 'P' then 'Parcialmente Lançado'
        when 'L' then 'Totalmente Lançado'
        else 'Em Processamento'
      end as status_texto,
      case status_geral
        when 'L' then 3
        when 'V' then 3
        when 'P' then 2
        when 'E' then 1
        else 0
      end as criticidade_status,
      qtd_docs,
      qtd_validos,
      qtd_erros,
      qtd_lancados,
      waers,
      @Semantics.amount.currencyCode: 'waers'
      total_debito,
      @Semantics.amount.currencyCode: 'waers'
      total_credito,
      @Semantics.user.createdBy: true
      criado_por,
      @Semantics.systemDateTime.createdAt: true
      criado_em,
      @Semantics.user.localInstanceLastChangedBy: true
      alterado_por,
      @Semantics.systemDateTime.localInstanceLastChangedAt: true
      alterado_em,

      _Documentos
}
```
