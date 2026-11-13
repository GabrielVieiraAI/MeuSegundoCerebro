---
tipo: objeto-tecnico
tags:
  - projeto
  - veiling-holambra
  - sap
  - fi
  - bdef
  - rap
  - abap-cloud
  - del-com-165
  - objeto-tecnico
id_demanda: DEL-COM-165
objeto: "ZI_FI_TAX_CARGA (BDEF)"
camada: "3 - Comportamento RAP"
data: 2026-11-11
aliases:
  - "ZI_FI_TAX_CARGA (BDEF)"
---

# 📦 `ZI_FI_TAX_CARGA (BDEF)` (Behavior Definition Root — Carga Massiva de Taxas)

⬅️ [[01 - DEL-COM-165 - Arquitetura App 1 (Carga Massiva de Taxas)|Voltar para Arquitetura App 1]] | 🎨 [[01 - DEL-COM-165 - Arquitetura Técnica App 1 (Carga Massiva).excalidraw|Ver no Diagrama Excalidraw App 1]]

---

## 📌 Visão Geral do Objeto

O Behavior Definition `ZI_FI_TAX_CARGA` define o comportamento transacional da hierarquia de 3 níveis (`Carga -> Documento -> Item`) do **Aplicativo 1**, implementado pela classe [[25 - ZCLFI_BP_TAX_CARGA|ZCLFI_BP_TAX_CARGA]]. Ele utiliza o modelo **Managed with additional save** (sem Draft), garantindo que a persistência das tabelas customizadas (`ZTFI_TAX_CARGA`, `ZTFI_TAX_DOC`, `ZTFI_TAX_ITEM`) seja gerenciada pelo RAP e que a contabilização efetiva via `BAPI_ACC_DOCUMENT_POST` ocorra dentro da fase `save_modified` em um único `COMMIT WORK`.

---

## ⚖️ Regras de Negócio Aplicadas

1. **Criação Exclusiva via Upload (`internal create`):**
   - As operações `create` e `update` das entidades são marcadas como `internal`, impedindo que o usuário crie ou edite documentos manualmente pela tela; todo lote nasce exclusivamente pelo upload da planilha Excel na ação estática `carregarArquivo`.
2. **Três Ações de Negócio (`carregarArquivo`, `baixarModelo` e `lancar`):**
   - `static action carregarArquivo parameter ZI_FI_TAX_ARQUIVO result [1] $self;`: Lê o Excel, aplica as regras de Tipo de Movimento, gera a contrapartida do `DS-ATR`, executa a verificação automática (`BAPI_ACC_DOCUMENT_CHECK`) e grava a carga completa.
   - `static action baixarModelo result [1] ZI_FI_TAX_ARQUIVO;`: Gera e devolve a planilha `.xlsx` oficial com as 15 colunas e os Tipos de Movimento ativos.
   - `action ( features : instance ) lancar result [1] $self;`: Habilitada apenas quando o lote possui documentos verificados com sucesso (`qtd_validos > 0` e `status_geral <> 'L'`). Marca os documentos válidos para contabilização na sequência de salvamento (`save_modified`).
   - Conforme decisão de arquitetura, **não existem ações de "Verificar" isolado nem de "Reprocessar"**.

---

## 🛠️ Passo a Passo da Criação do Objeto

1. **No Eclipse ADT:** Clique com o botão direito sobre a CDS View [[19 - ZI_FI_TAX_CARGA (CDS)|ZI_FI_TAX_CARGA]] -> **`New Behavior Definition`**.
2. Preencha as propriedades:
   - **Implementation Type:** `Managed`
3. Selecione a Request (TR) de desenvolvimento e conclua o assistente.
4. Substitua o código gerado pelo snippet abaixo e ative com **`Ctrl + F3`**.

---

## 💻 Snippet de Código

### 📝 Código Comentado (Para Estudo e Referência)

```abap
managed implementation in class zclfi_bp_tax_carga unique;
strict ( 2 );

// =========================================================================
// 1. ENTIDADE RAIZ: Cabeçalho do Lote de Carga (ZI_FI_TAX_CARGA)
// =========================================================================
define behavior for ZI_FI_TAX_CARGA alias Carga
persistent table ztfi_tax_carga
with additional save
lock master
authorization master ( global )
etag master alterado_em
{
  // Criação e atualização realizadas internamente pelas actions de upload e contabilização
  internal create;
  internal update;
  delete ( features : instance );

  field ( readonly ) carga_id, nome_arquivo, status_geral, status_texto, criticidade_status,
                     qtd_docs, qtd_validos, qtd_erros, qtd_lancados, waers,
                     total_debito, total_credito, criado_por, criado_em, alterado_por, alterado_em;

  // Criação interna dos documentos filhos durante o upload da planilha
  internal association _Documentos { internal create; }

  // Action estática 1: Upload da planilha Excel (.xlsx) + Validação + BAPI_ACC_DOCUMENT_CHECK automático
  static action carregarArquivo parameter ZI_FI_TAX_ARQUIVO result [1] $self;

  // Action estática 2: Download do modelo oficial (.xlsx) com 15 colunas e Tipos de Movimento ativos
  static action baixarModelo result [1] ZI_FI_TAX_ARQUIVO;

  // Action de instância 3: Contabiliza os documentos com status 'V' via BAPI_ACC_DOCUMENT_POST no save_modified
  action ( features : instance ) lancar result [1] $self;
}

// =========================================================================
// 2. ENTIDADE FILHA: Documentos Contábeis do Lote (ZI_FI_TAX_DOC)
// =========================================================================
define behavior for ZI_FI_TAX_DOC alias Documento
persistent table ztfi_tax_doc
lock dependent by _Carga
authorization dependent by _Carga
{
  internal update;
  internal delete;

  field ( readonly ) carga_id, docseq, ztpmov, bukrs, bldat, budat, xblnr, bktxt, waers,
                     total_debito, total_credito, status, status_texto, criticidade_status,
                     belnr, gjahr, mensagem;

  association _Carga;
  internal association _Itens { internal create; }
}

// =========================================================================
// 3. ENTIDADE NETA: Partidas Individuais do Documento (ZI_FI_TAX_ITEM)
// =========================================================================
define behavior for ZI_FI_TAX_ITEM alias Item
persistent table ztfi_tax_item
lock dependent by _Carga
authorization dependent by _Carga
{
  internal update;
  internal delete;

  field ( readonly ) carga_id, docseq, item_num, lifnr, hkont, shkzg, umskz, waers,
                     wrsol, wrhab, zfbdt, zterm, zlspr, sgtxt, zuonr, gerado_auto;

  association _Documento;
  association _Carga;
}
```

---

### 🚀 Código Limpo (Sem Comentários - Para Copiar e Colar)

```abap
managed implementation in class zclfi_bp_tax_carga unique;
strict ( 2 );

define behavior for ZI_FI_TAX_CARGA alias Carga
persistent table ztfi_tax_carga
with additional save
lock master
authorization master ( global )
etag master alterado_em
{
  internal create;
  internal update;
  delete ( features : instance );

  field ( readonly ) carga_id, nome_arquivo, status_geral, status_texto, criticidade_status,
                     qtd_docs, qtd_validos, qtd_erros, qtd_lancados, waers,
                     total_debito, total_credito, criado_por, criado_em, alterado_por, alterado_em;

  internal association _Documentos { internal create; }

  static action carregarArquivo parameter ZI_FI_TAX_ARQUIVO result [1] $self;
  static action baixarModelo result [1] ZI_FI_TAX_ARQUIVO;
  action ( features : instance ) lancar result [1] $self;
}

define behavior for ZI_FI_TAX_DOC alias Documento
persistent table ztfi_tax_doc
lock dependent by _Carga
authorization dependent by _Carga
{
  internal update;
  internal delete;

  field ( readonly ) carga_id, docseq, ztpmov, bukrs, bldat, budat, xblnr, bktxt, waers,
                     total_debito, total_credito, status, status_texto, criticidade_status,
                     belnr, gjahr, mensagem;

  association _Carga;
  internal association _Itens { internal create; }
}

define behavior for ZI_FI_TAX_ITEM alias Item
persistent table ztfi_tax_item
lock dependent by _Carga
authorization dependent by _Carga
{
  internal update;
  internal delete;

  field ( readonly ) carga_id, docseq, item_num, lifnr, hkont, shkzg, umskz, waers,
                     wrsol, wrhab, zfbdt, zterm, zlspr, sgtxt, zuonr, gerado_auto;

  association _Documento;
  association _Carga;
}
```
