---
tipo: objeto-tecnico
tags:
  - projeto
  - veiling-holambra
  - sap
  - fi
  - se91
  - abap-cloud
  - del-com-165
  - objeto-tecnico
id_demanda: DEL-COM-165
objeto: "ZFI_TAXAS"
camada: "4 - Segurança e Mensagens"
data: 2026-11-11
aliases:
  - "ZFI_TAXAS"
---

# 📦 `ZFI_TAXAS` (Classe de Mensagens — SE91)

⬅️ [[00 - DEL-COM-165 - Visão Integrada e Infraestrutura|Visão Integrada]] | 📱 [[01 - DEL-COM-165 - Arquitetura (Carga Massiva de Taxas)|Arquitetura Carga Massiva de Taxas]] | ⚙️ [[02 - DEL-COM-165 - Arquitetura (Tipos de Movimento)|Arquitetura Tipos de Movimento]]

---

## 📌 Visão Geral do Objeto

A classe de mensagens `ZFI_TAXAS` centraliza todos os textos de validação funcional, alertas de consistência de planilha, erros de autorização e retornos de processamento exibidos tanto no **Aplicativo de Carga Massiva de Taxas (`ZFI_TAX_CARGA`)** (Carga Massiva de Taxas) quanto no **Aplicativo de Tipos de Movimento (`ZFI_TAX_TPMOV`)** (Manutenção de Tipos de Movimento).

---

## ⚖️ Regras de Negócio Aplicadas

1. **Padronização de Feedback na UI e no Monitor:** As mensagens ativas (mantendo a numeração original dentro do intervalo `001` a `025`, com a remoção das validações contábeis/cadastrais delegadas à BAPI) cobrem as regras de layout e parametrização da especificação funcional: leitura da planilha Excel, validação do Tipo de Movimento em [[01 - ZTFI_TAX_TPMOV|ZTFI_TAX_TPMOV]], exclusividade entre Débito (`WRSOL`) e Crédito (`WRHAB`), obrigatoriedade de `XBLNR`, `ZFBDT` e `ZUONR`, verificação de duplicidade (`XBLNR + LIFNR + ZTPMOV + Valor`) e retorno consolidado de contabilização. As validações cadastrais (`LFA1`/`LFB1`, `SKA1`/`SKB1`), de cabeçalho padrão e de saldo contábil são tratadas nativamente pela `BAPI_ACC_DOCUMENT_CHECK` (Decisão 04).

---

## 🛠️ Passo a Passo da Criação do Objeto

### 🔖 Metadados ADT

```yaml
objectType: "MSAG/N"
packageName: "ZFI_TAX_COMUM"
name: "ZFI_TAXAS"
description: "DEL-COM-165: Mensagens da Carga de Taxas c/ Razão Especial"
```

1. **No Eclipse ADT:** Conecte-se ao sistema e acesse o pacote `ZFI_TAX_COMUM`.
2. Clique com o botão direito -> **`New`** -> **`Other ABAP Repository Object`** -> pesquise por **`Message Class`**.
3. Preencha as propriedades:
   - **Name:** `ZFI_TAXAS`
   - **Description:** `DEL-COM-165: Mensagens da Carga de Taxas c/ Razão Especial`
4. Selecione a Request (TR) de desenvolvimento e conclua o assistente.
5. Cadastre os números de mensagem abaixo na aba **Messages** e salve/ative com **`Ctrl + S`** / **`Ctrl + F3`**.

---

## 💻 Snippet de Código

### 📝 Código Comentado (Para Estudo e Referência)

```text
// =========================================================================
// TABELA DE MENSAGENS DA CLASSE ZFI_TAXAS (SE91 / ADT Message Class Editor)
// Limite oficial SAP (T100 / AFF msag-v1): máximo 73 caracteres por mensagem
// As variáveis &1, &2, &3 e &4 são substituídas dinamicamente em tempo de execução
// =========================================================================

// --- Mensagens de Autorização e Arquivo (001 a 004) ---
001 : Sem autorização na empresa &1 para a atividade solicitada.
002 : O arquivo enviado está vazio ou não pôde ser lido como planilha XLSX.
003 : A aba 'Carga' ou os dados a partir da linha 6 não foram encontrados.
004 : Planilha processada no lote &1: &2 doc(s) válido(s) e &3 com erro.

// --- Mensagens de Validação de Cabeçalho e Tipo de Movimento (005 a 011, exceto 008 e 010) ---
005 : Doc &1: Tipo de Movimento &2 não existe na tabela ZTFI_TAX_TPMOV.
006 : Doc &1: Tipo de Movimento &2 está inativo ou fora da vigência na data &3.
007 : Doc &1: Campo Referência (XBLNR) é obrigatório.
009 : Doc &1: Movimento &2 exige só crédito (contrapartida &3 automática).
011 : Doc &1: Verificado com sucesso na simulação BAPI (apto p/ lançamento).

// --- Mensagens de Validação de Item e Duplicidade (013 a 016) ---
013 : Doc &1 Item &2: Não informe Débito (WRSOL) e Crédito (WRHAB) juntos.
014 : Doc &1 Item &2: Data Base (ZFBDT) é obrigatória para o movimento &3.
015 : Doc &1 Item &2: Atribuição/Contrato (ZUONR) obrigatória p/ mov. &3.
016 : Doc &1 Item &2: Duplicidade (XBLNR &3, Forn. &4 já lançado no Doc &2).

// --- Mensagens de Contabilização e Tipos de Movimento (`ZFI_TAX_TPMOV`) (019 a 025) ---
019 : Lote &1 já contabilizado ou sem documentos válidos (Status V).
020 : Contabilização do lote &1 concluída: &2 doc(s) lançado(s), &3 erro(s).
021 : Documento contabilizado com sucesso: BELNR &1 / Exercício &2.
022 : Código do Tipo de Movimento e Descrição são obrigatórios.
023 : Data inicial de vigência (&1) não pode ser maior que a data final (&2).
024 : Informe ao menos 1 Razão Especial (Déb./Créd.) ou Conta Contrapartida.
025 : Modelo de planilha Excel gerado com sucesso.
```

---

### 🚀 Código Limpo (Sem Comentários - Para Copiar e Colar)

```text
001	Sem autorização na empresa &1 para a atividade solicitada.
002	O arquivo enviado está vazio ou não pôde ser lido como planilha XLSX.
003	A aba 'Carga' ou os dados a partir da linha 6 não foram encontrados.
004	Planilha processada no lote &1: &2 doc(s) válido(s) e &3 com erro.
005	Doc &1: Tipo de Movimento &2 não existe na tabela ZTFI_TAX_TPMOV.
006	Doc &1: Tipo de Movimento &2 está inativo ou fora da vigência na data &3.
007	Doc &1: Campo Referência (XBLNR) é obrigatório.
009	Doc &1: Movimento &2 exige só crédito (contrapartida &3 automática).
011	Doc &1: Verificado com sucesso na simulação BAPI (apto p/ lançamento).
013	Doc &1 Item &2: Não informe Débito (WRSOL) e Crédito (WRHAB) juntos.
014	Doc &1 Item &2: Data Base (ZFBDT) é obrigatória para o movimento &3.
015	Doc &1 Item &2: Atribuição/Contrato (ZUONR) obrigatória p/ mov. &3.
016	Doc &1 Item &2: Duplicidade (XBLNR &3, Forn. &4 já lançado no Doc &2).
019	Lote &1 já contabilizado ou sem documentos válidos (Status V).
020	Contabilização do lote &1 concluída: &2 doc(s) lançado(s), &3 erro(s).
021	Documento contabilizado com sucesso: BELNR &1 / Exercício &2.
022	Código do Tipo de Movimento e Descrição são obrigatórios.
023	Data inicial de vigência (&1) não pode ser maior que a data final (&2).
024	Informe ao menos 1 Razão Especial (Déb./Créd.) ou Conta Contrapartida.
025	Modelo de planilha Excel gerado com sucesso.
```
