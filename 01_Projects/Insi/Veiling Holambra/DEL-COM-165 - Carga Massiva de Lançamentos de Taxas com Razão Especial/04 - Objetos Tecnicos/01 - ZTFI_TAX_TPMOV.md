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
objeto: "ZTFI_TAX_TPMOV"
camada: "1 - Dicionário de Dados"
data: 2026-11-11
aliases:
  - "ZTFI_TAX_TPMOV"
---

# 📦 `ZTFI_TAX_TPMOV` (Tabela Transparente — Tipos de Movimento)

⬅️ [[02 - DEL-COM-165 - Arquitetura App 2 (Tipos de Movimento)|Voltar para Arquitetura App 2]] | 🎨 [[02 - DEL-COM-165 - Arquitetura Técnica App 2 (Tipos de Movimento).excalidraw|Ver no Diagrama Excalidraw App 2]]

---

## 📌 Visão Geral do Objeto

A tabela transparente `ZTFI_TAX_TPMOV` armazena a parametrização dos **Tipos de Movimento** utilizados na carga massiva de taxas e retenções da Veiling Holambra. Ela é mantida diretamente pelos usuários chave no **Aplicativo 2** ([[36 - taxastipomov (App Fiori)|taxastipomov]]) via modelo **RAP** (*ABAP RESTful Application Programming Model*) com suporte a rascunho (*Draft* na tabela [[02 - ZTFI_TAX_TPMOV_D|ZTFI_TAX_TPMOV_D]]) e consumida pelo motor de validação e contabilização do **Aplicativo 1** ([[25 - ZCLFI_BP_TAX_CARGA|ZCLFI_BP_TAX_CARGA]]).

Seguindo a diretriz **ABAP Cloud Lean**, a tabela combina tipos primitivos embutidos (`abap.char`, `abap.dats`) e elementos de dados standard liberados (`umskz`, `hkont`, `blart`, `dzlspr`, `abap_boolean`), sem criação de elementos de dados ou domínios customizados redundantes.

---

## ⚖️ Regras de Negócio Aplicadas

1. **Indicadores de Razão Especial por Natureza Contábil (`umskz_deb` e `umskz_cred`):**
   - Nos movimentos padrão de repasse entre cooperados (`TX-COM`, `TX-CON`, `RT-CON`, `EM-SOC`, `DV-SOC`, `DP-SOC`), tanto a partida a débito quanto a partida a crédito são lançadas em fornecedores com o mesmo código de **Razão Especial** (indicador `UMSKZ` que direciona o lançamento para uma conta conciliação alternativa no SAP, como `I`, `M`, `E`, `O`, `J`, `T`).
   - No movimento `CM-DEV` (*Cessão de Mudas*), apenas a linha a crédito do Sócio recebe Razão Especial (`umskz_cred = 'N'`), enquanto a linha a débito do Sítio é lançada na conta normal do fornecedor (`umskz_deb` em branco).
2. **Contrapartida Contábil Automática (`hkont_contrapartida`):**
   - No movimento `DS-ATR` (*Distribuição de Sobras*), o usuário informa no Excel apenas as linhas de crédito dos cooperados (`umskz_cred = 'U'`). O sistema lê o campo `hkont_contrapartida` (`2205010002` — *Sobras a Distribuir*) para gerar automaticamente a partida única de débito pela soma dos créditos do documento.
3. **Derivação de Tipo de Documento (`blart`) e Bloqueio de Pagamento (`zlspr`):**
   - Define o tipo de documento contábil (`Z1` por padrão) e o código de bloqueio de pagamento (`T` por padrão), que será aplicado automaticamente em todas as partidas de fornecedor que possuírem código de Razão Especial preenchido.
4. **Regras de Obrigatoriedade e Vigência:**
   - Os indicadores `zfbdt_obrig` (Data Base `ZFBDT` obrigatória) e `zuonr_obrig` (Atribuição `ZUONR` obrigatória), além do flag `ativo` e do período `valido_de` / `valido_ate`, governam a validação de cada linha do Excel durante o upload.

---

## 🛠️ Passo a Passo da Criação do Objeto

1. **No Eclipse ADT (*ABAP Development Tools*):** Conecte-se ao sistema S/4HANA e acesse o pacote `ZFI_CARGA_TAXAS`.
2. Clique com o botão direito sobre a pasta **`Dictionary`** (ou diretamente no pacote) -> **`New`** -> **`Database Table`**.
3. Preencha as propriedades:
   - **Name:** `ZTFI_TAX_TPMOV`
   - **Description:** `DEL-COM-165: Configuração de Tipos de Movimento de Taxas`
4. Selecione a Request (TR) de desenvolvimento e conclua o assistente.
5. Substitua o código gerado pelo snippet abaixo e ative com **`Ctrl + F3`**.

---

## 💻 Snippet de Código

### 📝 Código Comentado (Para Estudo e Referência)

```abap
@EndUserText.label : 'DEL-COM-165: Tipos de Movimento de Taxas'
@AbapCatalog.enhancement.category : #NOT_EXTENSIBLE
@AbapCatalog.tableCategory : #TRANSPARENT
@AbapCatalog.deliveryClass : #C
@AbapCatalog.dataMaintenance : #ALLOWED
define table ztfi_tax_tpmov {

  // Mandante do sistema SAP
  key client              : abap.clnt not null;
  // Código do Tipo de Movimento (ex: TX-COM, CM-DEV, DS-ATR)
  key ztpmov              : abap.char(6) not null;
  // Descrição funcional exibida no Fiori e na aba de apoio do Excel
  descricao               : abap.char(60);
  // Código de Razão Especial aplicado nas partidas a Débito (vazio no CM-DEV e DS-ATR)
  umskz_deb               : umskz;
  // Código de Razão Especial aplicado nas partidas a Crédito (ex: I, N, U, M, E, O, J, T)
  umskz_cred              : umskz;
  // Conta do Razão (G/L) para contrapartida automática a débito (ex: 2205010002 no DS-ATR)
  hkont_contrapartida     : hkont;
  // Tipo de documento contábil na BAPI (padrão: Z1)
  blart                   : blart;
  // Bloqueio de pagamento automático para linhas com Razão Especial (padrão: T)
  zlspr                   : dzlspr;
  // Indica se o campo Data Base (ZFBDT) é obrigatório na planilha (X = Sim)
  zfbdt_obrig             : abap_boolean;
  // Indica se o campo Atribuição (ZUONR) é obrigatório na planilha (X = Sim)
  zuonr_obrig             : abap_boolean;
  // Status de ativação do Tipo de Movimento (X = Ativo)
  ativo                   : abap_boolean;
  // Data de início de vigência do Tipo de Movimento
  valido_de               : abap.dats;
  // Data de fim de vigência do Tipo de Movimento
  valido_ate              : abap.dats;
  // Campos administrativos gerenciados automaticamente pelo framework RAP
  criado_por              : abp_creation_user;
  criado_em               : abp_creation_tstmpl;
  alterado_por            : abp_locinst_lastchange_user;
  alterado_em             : abp_locinst_lastchange_tstmpl;
  alterado_em_total       : abp_lastchange_tstmpl;

}
```

---

### 🚀 Código Limpo (Sem Comentários - Para Copiar e Colar)

```abap
@EndUserText.label : 'DEL-COM-165: Tipos de Movimento de Taxas'
@AbapCatalog.enhancement.category : #NOT_EXTENSIBLE
@AbapCatalog.tableCategory : #TRANSPARENT
@AbapCatalog.deliveryClass : #C
@AbapCatalog.dataMaintenance : #ALLOWED
define table ztfi_tax_tpmov {

  key client              : abap.clnt not null;
  key ztpmov              : abap.char(6) not null;
  descricao               : abap.char(60);
  umskz_deb               : umskz;
  umskz_cred              : umskz;
  hkont_contrapartida     : hkont;
  blart                   : blart;
  zlspr                   : dzlspr;
  zfbdt_obrig             : abap_boolean;
  zuonr_obrig             : abap_boolean;
  ativo                   : abap_boolean;
  valido_de               : abap.dats;
  valido_ate              : abap.dats;
  criado_por              : abp_creation_user;
  criado_em               : abp_creation_tstmpl;
  alterado_por            : abp_locinst_lastchange_user;
  alterado_em             : abp_locinst_lastchange_tstmpl;
  alterado_em_total       : abp_lastchange_tstmpl;

}
```
