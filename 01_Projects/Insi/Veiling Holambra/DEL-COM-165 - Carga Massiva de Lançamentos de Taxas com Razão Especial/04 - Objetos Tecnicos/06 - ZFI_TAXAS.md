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

⬅️ [[00 - DEL-COM-165 - Visão Integrada e Infraestrutura|Visão Integrada]] | 📱 [[01 - DEL-COM-165 - Arquitetura App 1 (Carga Massiva de Taxas)|Arquitetura App 1]] | ⚙️ [[02 - DEL-COM-165 - Arquitetura App 2 (Tipos de Movimento)|Arquitetura App 2]]

---

## 📌 Visão Geral do Objeto

A classe de mensagens `ZFI_TAXAS` centraliza todos os textos de validação funcional, alertas de consistência de planilha, erros de autorização e retornos de processamento exibidos tanto no **Aplicativo 1** (Carga Massiva de Taxas) quanto no **Aplicativo 2** (Manutenção de Tipos de Movimento).

---

## ⚖️ Regras de Negócio Aplicadas

1. **Padronização de Feedback na UI e no Monitor:** As mensagens de `001` a `025` cobrem todas as regras de negócio da especificação funcional: validação do Tipo de Movimento em [[01 - ZTFI_TAX_TPMOV|ZTFI_TAX_TPMOV]], exclusividade entre Débito (`WRSOL`) e Crédito (`WRHAB`), balanceamento contábil por `DOCSEQ`, obrigatoriedade de `ZFBDT` e `ZUONR`, verificação de duplicidade (`XBLNR + LIFNR + ZTPMOV + Valor`), checagem cadastral de fornecedor (`LFA1`/`LFB1`) e retorno consolidado de contabilização.

---

## 🛠️ Passo a Passo da Criação do Objeto

1. **No Eclipse ADT:** Conecte-se ao sistema e acesse o pacote `ZFI_CARGA_TAXAS`.
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
// As variáveis &1, &2, &3 e &4 são substituídas dinamicamente em tempo de execução
// =========================================================================

// --- Mensagens de Autorização e Arquivo (001 a 004) ---
001 : Sem autorização na empresa &1 para a atividade solicitada.
002 : O arquivo enviado está vazio ou não pôde ser lido como planilha XLSX.
003 : A aba 'Carga' ou os dados a partir da linha 6 não foram encontrados.
004 : Planilha processada no lote &1: &2 doc(s) válido(s) e &3 com erro.

// --- Mensagens de Validação de Cabeçalho e Tipo de Movimento (005 a 011) ---
005 : Doc &1: Tipo de Movimento &2 não existe na tabela ZTFI_TAX_TPMOV.
006 : Doc &1: Tipo de Movimento &2 está inativo ou fora da vigência na data &3.
007 : Doc &1: Campos de cabeçalho (BUKRS, BLDAT, BUDAT, XBLNR) são obrigatórios.
008 : Doc &1: Soma de débitos (&2) difere da soma de créditos (&3). Saldo deve ser zero.
009 : Doc &1: Movimento &2 exige apenas linhas de crédito (contrapartida &3 é automática).
010 : Doc &1: Conta de contrapartida &2 não cadastrada na empresa &3.
011 : Doc &1: Documento verificado com sucesso na simulação BAPI (Apto para lançamento).

// --- Mensagens de Validação de Item e Duplicidade (012 a 018) ---
012 : Doc &1 Item &2: Informe Fornecedor (LIFNR) válido e existente na empresa &3.
013 : Doc &1 Item &2: Informe exclusivamente Débito (WRSOL) ou Crédito (WRHAB) maior que zero.
014 : Doc &1 Item &2: Data Base (ZFBDT) é obrigatória para o movimento &3.
015 : Doc &1 Item &2: Atribuição/Contrato (ZUONR) é obrigatória para o movimento &3.
016 : Doc &1 Item &2: Duplicidade detectada (XBLNR &3, Forn. &4 já lançado no Doc &2).
017 : Doc &1 Item &2: Linha do Excel possui campos de cabeçalho em linha secundária; ignorados.
018 : Doc &1: Nenhuma partida válida encontrada para o documento.

// --- Mensagens de Contabilização e App 2 (019 a 025) ---
019 : Lote &1 já está totalmente contabilizado ou não possui documentos válidos (Status V).
020 : Contabilização concluída no lote &1: &2 documento(s) lançado(s), &3 erro(s).
021 : Documento contabilizado com sucesso: BELNR &1 / Exercício &2.
022 : Código do Tipo de Movimento e Descrição são obrigatórios.
023 : Data inicial de vigência (&1) não pode ser maior que a data final (&2).
024 : Informe ao menos um Razão Especial (Débito/Crédito) ou Conta de Contrapartida.
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
007	Doc &1: Campos de cabeçalho (BUKRS, BLDAT, BUDAT, XBLNR) são obrigatórios.
008	Doc &1: Soma de débitos (&2) difere da soma de créditos (&3). Saldo deve ser zero.
009	Doc &1: Movimento &2 exige apenas linhas de crédito (contrapartida &3 é automática).
010	Doc &1: Conta de contrapartida &2 não cadastrada na empresa &3.
011	Doc &1: Documento verificado com sucesso na simulação BAPI (Apto para lançamento).
012	Doc &1 Item &2: Informe Fornecedor (LIFNR) válido e existente na empresa &3.
013	Doc &1 Item &2: Informe exclusivamente Débito (WRSOL) ou Crédito (WRHAB) maior que zero.
014	Doc &1 Item &2: Data Base (ZFBDT) é obrigatória para o movimento &3.
015	Doc &1 Item &2: Atribuição/Contrato (ZUONR) é obrigatória para o movimento &3.
016	Doc &1 Item &2: Duplicidade detectada (XBLNR &3, Forn. &4 já lançado no Doc &2).
017	Doc &1 Item &2: Linha do Excel possui campos de cabeçalho em linha secundária; ignorados.
018	Doc &1: Nenhuma partida válida encontrada para o documento.
019	Lote &1 já está totalmente contabilizado ou não possui documentos válidos (Status V).
020	Contabilização concluída no lote &1: &2 documento(s) lançado(s), &3 erro(s).
021	Documento contabilizado com sucesso: BELNR &1 / Exercício &2.
022	Código do Tipo de Movimento e Descrição são obrigatórios.
023	Data inicial de vigência (&1) não pode ser maior que a data final (&2).
024	Informe ao menos um Razão Especial (Débito/Crédito) ou Conta de Contrapartida.
025	Modelo de planilha Excel gerado com sucesso.
```
