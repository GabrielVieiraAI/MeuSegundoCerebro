---
tipo: guia-testes
tipo_demanda: novo-app # [novo-app, evolutiva-custom, extensao-standard, interface-api]
tags:
  - projeto
  - [cliente] # ex: veiling-holambra, cliente-xyz
  - sap
  - [modulo-sap] # ex: fi-ar, sd, mm, co, abap
  - [tecnologia] # ex: rap, cds, fiori, fscm, abap-cloud
  - [id-demanda] # ex: del-r2r-009, prj-sd-010
  - homologacao
  - plano-testes
id_demanda: "[ID-DEMANDA]"
status_geral: Em Execução # [Planejado, Em Execução, Aprovado com Ressalvas, Homologado]
data: {{date}}
---

# 🧪 [ID-DEMANDA] · Guia de Execução e Homologação de Testes

⬅️ [[DEL-XXX - Guia de Implementação|Guia de Implementação]] | ⬅️ [[DEL-XXX - Arquitetura e Objetos|Arquitetura e Objetos]] | 📄 [[DEL-XXX - BPDD / Especificação Funcional|Especificação Funcional]]

---

## 📌 Visão Geral do Plano de Testes

[Descreva aqui o objetivo desta rodada de testes, ambiente utilizado (ex.: S4D Mandante 100 / S4Q Mandante 200), responsáveis pela execução e critérios gerais de aceite definidos no projeto].

> [!NOTE] Diretrizes de Execução
> - Cada cenário de teste deve ser executado rigorosamente na ordem de pré-condições estabelecida.
> - Toda evidência visual (prints do Fiori Launchpad e conferências em transações do SAP GUI como `SE16N`, `BP`, `F-28`) deve ser anexada no bloco correspondente do teste.
> - Em caso de divergência ou comportamento não esperado, registre o log do erro e marque o status como `[!] Falha / Ajuste`.

---

## 📊 1. Painel de Controle de Homologação (Dashboard)

| ID | Cenário de Teste | Tipo | Responsável | Status Atual | Data Execução | Observações |
| :-: | :--- | :---: | :---: | :---: | :---: | :--- |
| **`T01`** | [Nome do Cenário 01] | Funcional | [Dev / Funcional] | `[ ] Pendente` | --/--/---- | [Breve nota] |
| **`T02`** | [Nome do Cenário 02] | Funcional | [Dev / Funcional] | `[ ] Pendente` | --/--/---- | [Breve nota] |
| **`T03`** | [Nome do Cenário 03] | Integrado | [Dev / Funcional] | `[ ] Pendente` | --/--/---- | [Breve nota] |

---

## 🛠️ 2. Roteiro Detalhado de Execução por Cenário

### 🔹 [ID Cenário] — [Nome do Cenário]
- **Objetivo do Teste:** [O que estamos testando tecnicamente e funcionalmente].
- **Tipo de Teste:** Funcional / Integrado / Exceção / Fronteira.

#### 📋 Pré-Condições de Dados no SAP:
* **Dados Mestres:** [Clientes, Segmentos, Classes, Fornecedores cadastrados].
* **Dados Transacionais:** [Faturas, partidas em aberto, pedidos criados].
* **Parâmetros de Configuração:** [Configurações em tabelas Z ou TVARV].

#### 🚀 Passo a Passo de Execução:
1. Acesse o **SAP Fiori Launchpad** e abra o aplicativo `[Nome do App]`;
2. No painel de filtros, informe `[Filtros]` e clique no botão **Iniciar**;
3. Verifique na tabela se o registro aparece com `[Valores esperados]`;
4. Selecione a linha correspondente e clique na ação `[Nome do Botão]`;
5. Confirme o diálogo de confirmação / preencha os parâmetros de ação;
6. No SAP GUI, abra a transação `[SE16N / BP / FB03]` e valide a persistência no banco.

#### 🎯 Critério de Aceite (Resultado Esperado):
* [Descreva exatamente o que deve acontecer na tela do Fiori e no banco de dados para o teste ser considerado aprovado].

#### 📝 Registro de Resultados:
- [ ] **Status do Teste:** `[x] Aprovado` / `[ ] Reprovado`
- **Data da Execução:** `YYYY-MM-DD`
- **Executado por:** `[Nome do Desenvolvedor / Consultor]`

#### 📸 Evidências do Teste:
```carousel
![Print da Tela no Fiori](/caminho/para/print_fiori.png)
<!-- slide -->
![Print da Conferência no SAP GUI](/caminho/para/print_sapgui.png)
```

#### ⚠️ Apontamentos e Ajustes Identificados:
* [Registre aqui dúvidas, bugs, dumps ST22 ou ajustes de código necessários identificados durante o teste].

---

## 🏁 3. Parecer Final e Aceite Formal

| Papel | Nome do Responsável | Parecer | Assinatura / Data |
| :--- | :--- | :---: | :---: |
| **Desenvolvedor ABAP** | [Seu Nome] | `[ ] Homologado` | ____/____/________ |
| **Consultor Funcional** | [Nome do Consultor] | `[ ] Homologado` | ____/____/________ |
| **Key User / Negócio** | [Nome do Usuário Chave] | `[ ] Aceite Final` | ____/____/________ |
