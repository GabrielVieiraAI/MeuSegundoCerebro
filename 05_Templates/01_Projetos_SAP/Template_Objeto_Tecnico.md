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

### 🔖 Metadados ADT (*ABAP Development Tools* — Obrigatório para MCP `sap-adt`)

```yaml
objectType: "[Código técnico ADT, ex.: DEVC/K, DDLS/DF, BDEF/BDO, DDLX/EX, DCLS/DL, CLAS/OC, SRVD/SRV, SRVB/SVB]"
packageName: "[ZPACOTE_DEMANDA]"
name: "{{title}}"
description: "[Descrição curta com no máximo 60 caracteres]"
extraParams: {} # Campos extras exigidos pelo tipo no ADT (ex.: serviceDefinition, bindingType, rootEntity, parentObject, transportLayer, supportsRecordChanges)
```

> [!IMPORTANT] Regra de Limite e Consistência
> `description` não pode ultrapassar **60 caracteres** (limite padrão do dicionário SAP/ADT). Caso o objeto exija ação manual ou não seja criável via **MCP** (*Model Context Protocol*), mantenha o preenchimento para rastreabilidade e sinalize `[Manual]` no Guia de Implementação.

### 📋 Passo a Passo no ADT / SAP GUI

1. **No [Eclipse ADT / SAP GUI / BAS]:** Conecte-se ao sistema e acesse o pacote `[ZPACOTE_DEMANDA]`.
2. Clique com o botão direito -> **`New`** -> **`[Tipo do Objeto no ADT ou Transação SAP GUI]`**.
3. Preencha as propriedades:
   - **Name:** `{{title}}`
   - **Description:** `[Descrição curta com no máximo 60 caracteres]`
4. Selecione a Request (TR) de desenvolvimento e conclua o assistente.
5. Substitua o código gerado pelo snippet abaixo e ative com **`Ctrl + F3`**.

---

## 💻 Snippet de Código

> [!TIP] Objetos Multi-Arquivo (ex.: *Behavior Pool* `CLAS/OC`)
> Se o objeto possuir múltiplas abas/arquivos **AFF** (*ABAP File Format*, representação em arquivos do ADT), divida tanto `📝 Código Comentado` quanto `🚀 Código Limpo` em sub-blocos nomeados por aba e arquivo destino:
> - ``#### Aba: Global Class (`<nome>.clas.abap`)``
> - ``#### Aba: Local Types / CCIMP (`<nome>.clas.locals_imp.abap`)``
> - ``#### Aba: Local Definitions / CCDEF (`<nome>.clas.locals_def.abap`)``
> - ``#### Aba: Test Classes (`<nome>.clas.testclasses.abap`)``
>
> Para objetos de arquivo único (como CDS View, `BDEF`, `MDE` ou `SRVD`), mantenha um único bloco de código diretamente em cada seção.

### 📝 Código Comentado (Para Estudo e Referência)

```abap
// Código completo com comentários explicativos em cada linha ou bloco relevante
```

---

### 🚀 Código Limpo (Sem Comentários - Para Copiar e Colar)

```abap
// Mesmo código completo acima, porém sem comentários, pronto para colar e ativar no SAP
```
