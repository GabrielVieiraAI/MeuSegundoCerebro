---
tipo: objeto-tecnico
tags:
  - projeto
  - cliente # ex: veiling-holambra
  - sap
  - modulo-sap # ex: fi, sd, mm, co, abap
  - tecnologia # ex: cds, rap, bdef, abap, fiori, ddic
  - abap-cloud
  - id-demanda # ex: del-com-165
  - objeto-tecnico
id_demanda: "[ID-DEMANDA]"
objeto: "{{title}}"
camada: "[NUMERO] - [NOME_DA_CAMADA]" # 1 - Dicionário de Dados, 2 - Modelagem CDS, 3 - Comportamento RAP, 4 - Segurança e Mensagens, 5 - Serviço e Exposição, 6 - Frontend
data: {{date}}
aliases:
  - "{{title}}"
---

# 📦 `{{title}}` ([Tipo do Objeto Técnico])

⬅️ [[[ID-DEMANDA] - Arquitetura e Objetos|Voltar para Arquitetura e Objetos]] | 🎨 [[01 - [ID-DEMANDA] - Arquitetura Técnica Completa.excalidraw|Ver no Diagrama Excalidraw]]

---

## 📌 Visão Geral do Objeto

[Descreva de forma direta qual é o papel deste objeto na solução técnica: o que ele faz, quais dados manipula ou expõe e como se conecta aos demais objetos da demanda].

---

## ⚖️ Regras de Negócio Aplicadas

1. **[Regra de Negócio 1]:** [Explicação técnica e direta da regra de negócio atendida por este objeto].
2. **[Regra de Negócio 2]:** [Critérios de filtro, validação ou comportamento transacional].

---

## 🛠️ Passo a Passo da Criação do Objeto

1. **No [Eclipse ADT / SAP GUI / BAS]:** Conecte-se ao sistema e acesse o pacote `[ZPACOTE_DEMANDA]`.
2. Clique com o botão direito -> **`New`** -> **`[Tipo do Objeto no ADT ou Transação SAP GUI]`**.
3. Preencha as propriedades:
   - **Name:** `{{title}}`
   - **Description:** `[ID-DEMANDA]: [Descrição em português]`
4. Selecione a Request (TR) de desenvolvimento e conclua o assistente.
5. Substitua o código gerado pelo snippet abaixo e ative com **`Ctrl + F3`**.

---

## 💻 Snippet de Código

### 📝 Código Comentado (Para Estudo e Referência)

```abap
// Código completo com comentários explicativos em cada linha ou bloco relevante
```

---

### 🚀 Código Limpo (Sem Comentários - Para Copiar e Colar)

```abap
// Mesmo código completo acima, porém sem comentários, pronto para colar e ativar no SAP
```
