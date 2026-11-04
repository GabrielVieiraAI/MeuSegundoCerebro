---
title: "Utilizando Textos Traduzíveis no ABAP"
source: "https://learning.sap.com/courses/deepening-your-abap-programming-knowledge/using-translatable-text-in-abap"
created: 2026-11-03
tags:
  - sap
  - abap
  - abap-cloud
  - i18n
  - text-elements
  - clean-core
  - adt
---
**Roteiro de Estudos Relacionado:** [[Roteiro de Estudos SAP]]

# Objetivos

Após concluir esta lição, você será capaz de:
- Explicar a importância da internacionalização (*i18n*) e da separação entre lógica de negócio e textos de interface.
- Identificar os elementos nativamente traduzíveis do dicionário de dados e do modelo de desenvolvimento.
- Definir e utilizar **Símbolos de Texto (*Text Symbols / Text Elements*)** no código-fonte através das sintaxes `TEXT-###` e literais vinculados `'texto'(###)`.
- Suprimir alertas de tradução do **ABAP Test Cockpit (ATC)** em literais técnicos intencionais utilizando o Pragma `##NO_TEXT`.
- Compreender o ciclo de tradução e transporte de idiomas via ferramentas do sistema (transações `SE63` e `SLXT`).

---

## 1. O Desafio das Aplicações Multilíngues

Soluções corporativas desenvolvidas em SAP operam em multinacionais distribuídas por diversos países. Usuários na Alemanha, Brasil, Japão ou Estados Unidos acessam a mesma base de dados simultaneamente, esperando que as telas e mensagens do sistema sejam renderizadas em seu próprio idioma de logon (*Logon Language*).

No ambiente SAP, muitos objetos já nascem preparados para múltiplos idiomas:
* **Elementos de Dados (*Data Elements*):** Os rótulos de campos de tela (*Field Labels: Short, Medium, Long, Heading*) são cadastrados com suporte a tradução.
* **Classes de Mensagens (*Message Classes*):** Os textos de mensagens de erro, aviso e sucesso são mantidos em tabelas independentes por código de idioma.
* **Core Data Services (CDS) & Metadata Extensions:** Anotações como `@EndUserText.label` armazenam textos localizáveis.

> [!WARNING] O Problema dos Literais Fixos no Código (*Hard-coded Literals*)
> Textos literais escritos diretamente entre aspas simples no código ABAP (ex: `DATA(lv_msg) = 'Por favor, informe uma data válida.'.`) **não são traduzíveis**. O conteúdo da string permanecerá em português mesmo que o usuário faça logon em inglês ou espanhol. Além disso, o **ABAP Test Cockpit (ATC)** sinaliza todo literal de texto solto com um aviso de qualidade (*Finding*).

---

## 2. Símbolos de Texto (*Text Symbols / Text Elements*)

Para tornar os textos do código-fonte traduzíveis sem perder a legibilidade, a SAP disponibiliza os **Símbolos de Texto (*Text Symbols*)**.

* Cada programa executável, classe global ou grupo de funções possui um repositório interno dedicado chamado **Text Pool**.
* No Text Pool, cada texto é identificado por uma chave única de **3 caracteres alfanuméricos** (letras de `A` a `Z`, números de `0` a `9` ou combinações, como `001`, `002`, `A01`, `ERR`).

### Formas de Referenciar Símbolos de Texto no Código

Existem duas formas sintáticas suportadas pelo ABAP:

#### Forma 1: Identificador Direto (`TEXT-###`)
Você faz referência direta ao identificador cadastrado no Text Pool:
```abap
DATA(lv_greeting) = TEXT-001. 
```
* **Vantagem:** Muito conciso.
* **Desvantagem:** Dificulta a leitura imediata do código por outros desenvolvedores, que precisam abrir o Text Pool para descobrir qual é a frase correspondente ao ID `001`.

#### Forma 2: Literal com ID Vinculado (`'Texto Padrão'(###)`) - Padrão Mais Recomendado
Você escreve o texto literal no idioma original do objeto e anexa o ID do símbolo de texto entre parênteses:
```abap
DATA(lv_error_message) = 'Valor informado inválido'(002).
```
* **Como o sistema se comporta:**
  - Se o usuário estiver logado em um idioma traduzido (ex: Inglês) e existir uma tradução para o ID `002` no Text Pool, o runtime carrega o texto traduzido (*"Invalid entered value"*).
  - Se o usuário estiver logado no idioma original ou se a tradução para o idioma dele não existir, o runtime utiliza o texto literal escrito entre aspas como fallback seguro.

---

## 3. Gerenciando Símbolos de Texto no Eclipse ADT

No **ABAP Development Tools (ADT)**, a manutenção do Text Pool é integrada ao editor:

1. No editor da classe global, navegue até a aba **Text Elements** no rodapé (ou clique no menu de contexto $\rightarrow$ **Show Text Elements**).
2. O ADT lista todos os IDs, seus textos definidos no idioma mestre e o comprimento máximo permitido.
3. Se você escrever `'Meu Texto'(101)` diretamente no código ABAP e o ID `101` ainda não existir no Text Pool, o ADT exibirá uma lâmpada amarela. Pressione `Ctrl + 1` (*Quick Fix*) e selecione **Create Text Element '101'** para sincronizar automaticamente!

---

## 4. O Pragma `##NO_TEXT` para Literais Técnicos

Em muitas situações de programação, uma string literal entre aspas simples **não é uma mensagem para o usuário final**, mas sim um valor técnico de controle interno que jamais deve ser traduzido:
* Constantes técnicas de status (ex: `'ACTV'`, `'CANC'`).
* Nomes de campos técnicos, identificadores de formatos, chaves JSON ou URLs.

Para essas situações, se você deixar a string sem identificador de texto, o ATC reportará um aviso de prioridade 2 ou 3 (*"Text literal is not language-dependent"*).

> [!TIP] Como Suprimir o Alerta com Pragma
> Adicione o Pragma oficial **`##NO_TEXT`** antes do ponto final da instrução. Isso informa ao compilador e ao ATC que aquele literal é estritamente técnico e intencional:
> ```abap
> CONSTANTS lc_active_status TYPE c LENGTH 4 VALUE 'ACTV' ##NO_TEXT.
> DATA(lv_endpoint_url)     = 'https://api.sap.com/v1'   ##NO_TEXT.
> ```

---

## 5. Fluxo de Tradução e Transporte no Sistema

Após cadastrar os símbolos de texto no idioma original do desenvolvimento (geralmente inglês ou o idioma padrão da empresa):

1. **Tradução (*Transaction SE63*):** Tradutores e consultores utilizam a transação padrão **`SE63`** (*Translation: Initial Screen*). A ferramenta compara o idioma original com o idioma de destino e permite preencher os termos lado a lado.
2. **Coleta de Traduções para Transporte (*Transaction SLXT*):** Textos traduzidos via SE63 não geram automaticamente tarefas em ordens de transporte (*Transport Requests*). Utiliza-se a transação utilitária **`SLXT`** (*Translation Transport*) para varrer as traduções criadas em um intervalo de datas e empacotá-las em uma Workbench Request para envio aos ambientes de Qualidade (QAS) e Produção (PRD).

---

## Resumo da Lição

- Literais de texto fixos (*hard-coded*) não mudam com o idioma de logon e violam as regras do Clean Core e do ATC.
- **Símbolos de Texto (*Text Symbols*)** residem no *Text Pool* e são indexados por chaves de 3 caracteres alfanuméricos.
- A sintaxe recomendada `'Texto padrão'(001)` exibe a tradução cadastrada ou utiliza o literal original como fallback seguro.
- Para literais técnicos e constantes que não devem ser traduzidos, utilize o Pragma **`##NO_TEXT`** antes do ponto final da linha para eliminar avisos do ATC.
- A manutenção multilíngue oficial é realizada via transação **`SE63`** e o transporte de idiomas é consolidado pela **`SLXT`**.
