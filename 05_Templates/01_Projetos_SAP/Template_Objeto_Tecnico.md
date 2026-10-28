---
tipo: objeto-tecnico
tags:
  - projeto
  - [cliente] # ex: veiling-holambra, cliente-xyz
  - sap
  - [modulo-sap] # ex: fi-ar, sd, mm, co, abap
  - [tecnologia] # ex: cds, rap, bdef, abap, fscm, fiori, ddic
  - abap-cloud
  - [id-demanda] # ex: del-r2r-009, prj-sd-010
  - objeto-tecnico
id_demanda: "[ID-DEMANDA]"
objeto: "{{title}}"
camada: "[NUMERO] - [NOME_DA_CAMADA]" # 1 - Dicionário de Dados, 2 - Modelagem CDS, 3 - Comportamento RAP, 4 - Exposição OData, 6 - Frontend
data: {{date}}
---

# 📦 `{{title}}` ([Tipo do Objeto Técnico])

⬅️ [[DEL-XXX - Arquitetura e Objetos|Voltar para Arquitetura e Objetos]] | 🎨 [[DEL-XXX - Arquitetura da Camada CDS.excalidraw|Ver no Diagrama Excalidraw]]

---

## 📌 Visão Geral do Objeto

[Descreva de forma clara e acessível qual é o papel deste objeto na solução técnica: o que ele faz, quais dados ele manipula ou expõe e como se conecta com os demais artefatos da demanda].

> [!NOTE] Relacionamentos no Segundo Cérebro
> - **Consome dados de:** [[Nome_Objeto_Origem_1]], [[Nome_Objeto_Origem_2]]
> - **É consumido por:** [[Nome_Objeto_Destino_1]], [[Nome_Objeto_Destino_2]]

---

## ⚖️ Regras de Negócio Aplicadas

1. **[Regra de Negócio 1]:** [Explicação técnica e objetiva da regra de negócio atendida por este objeto, critérios de validação ou lógica de cálculo].
2. **[Regra de Negócio 2]:** [Critérios de filtro de seleção, exclusão de registros específicos ou parâmetros fixos].
3. **[Regra de Negócio 3]:** [Comportamentos operacionais, autorizações ou atualizações transacionais esperadas].

---

## 🛠️ Passo a Passo da Criação do Objeto

1. **Local e Ferramenta de Criação:**
   - **Ambiente:** [Eclipse ADT / SAP GUI / VS Code]
   - **Caminho / Menu:** Clique com o botão direito no pacote do projeto `[ZPACOTE_DEMANDA]` -> **`New`** -> **`[Tipo de Objeto]`** *(ou informe a transação no SAP GUI, ex.: `SE11`, `SE91`, `SU21`)*.
2. **Propriedades Iniciais do Assistente:**
   - **Name:** `{{title}}`
   - **Description:** `[Prefixo_Demanda]: [Descrição do Objeto com até 60 chars]`
   - **Template Sugerido:** Selecione **`[Nome do Template no ADT, ex: Define View Entity / Define Root View Entity / annotateEntity]`**.
3. **Transporte (TR):**
   - Selecione a Ordem de Transporte (TR) de desenvolvimento da demanda e confirme.
4. **Aplicação do Código e Ativação:**
   - Substitua o código padrão gerado pelo conteúdo da seção [Snippet de Código](#-snippet-de-código) abaixo.
   - Ative o objeto pressionando **`Ctrl + F3`**.
5. **Dicas de Validação e Cuidados Técnicos:**
   - [Instruções de validação para o desenvolvedor Júnior, ex.: pressionar `F8 - Data Preview` para validar os dados retornados, utilizar `Ctrl + 1` (Quick Fix) para classes locais, ou verificar warnings no Problems View].
   > [!WARNING] Atenção a Sintaxes e Compatibilidade
   > - Em classes ABAP, comentários inline devem obrigatoriamente utilizar aspas duplas (`"`); barras duplas (`//`) são válidas apenas em CDS.
   > - Para evitar falhas de parsing no plugin Dataview do Obsidian, nunca utilize seletores de chamada estática isolados entre crases. Utilize sempre em negrito (**=\>**) ou com escape (\=\>) para não interceptar como consulta dinâmica.

---

## 💻 Snippet de Código

### 📝 Código Comentado (Para Estudo e Referência)

```abap
// Cole aqui o código-fonte ABAP, DDL da CDS View, BDEF ou JSON de configuração
// Mantenha comentários inline claros explicando o propósito de cada anotação, junção ou comando crítico.
```

---

### 🚀 Código Limpo (Sem Comentários - Para Copiar e Colar)

```abap
// Cole aqui exatamente o mesmo código-fonte acima, porém sem nenhum comentário
```
