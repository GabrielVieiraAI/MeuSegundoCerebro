---
name: iniciar-code-review-sap
description: >-
  Inicia uma rodada de Code Review de uma demanda SAP a partir do documento/PDF de revisão técnica.
  Cria a pasta 05 - Code Review/0<R> - Revisao (DD-MM-AAAA)/ com subpastas Itens/ e Guias/, arquiva o
  documento original da revisão, gera o diagrama Excalidraw da Escada de Ajustes e cria todas as notas
  individuais CR-XXX seguindo o Template_Item_Code_Review.md com a Seção 1 preenchida em Linguagem de Negócio.
  Ativada pelo comando `/iniciar-code-review-sap`.
---

# Skill: Iniciar Code Review SAP (`/iniciar-code-review-sap`)

Esta skill estrutura uma nova rodada de **Code Review** dentro de uma demanda SAP (`05 - Code Review/0<R> - Revisao (DD-MM-AAAA)/`), organizando o documento recebido do revisor, o mapa visual de prioridades no Excalidraw ("Escada do Code Review") e todas as notas individuais `CR-XXX` em `Itens/`.

- **100% agnóstica de demanda:** opera exclusivamente sobre a estrutura padrão de pastas das demandas SAP e o template neutro `05_Templates/01_Projetos_SAP/Template_Item_Code_Review.md`, sem assumir nomes de clientes, pacotes ou objetos específicos.
- **Padrão de numeração `CR-XXX`:** os dígitos anteriores aos 2 últimos identificam o número da revisão `<R>` (ex.: `CR-101`, `CR-102`... para a `01 - Revisao`; `CR-201`, `CR-202`... para a `02 - Revisao`).

---

## 1. Portão de Aprovação Obrigatório (Explicar antes de Executar)

1. **Primeiro Passo (Leitura e Explicação no Chat):**
   * Leia o documento/PDF de Code Review fornecido pelo usuário (anexado no chat ou localizado no workspace).
   * Leia obrigatoriamente o template neutro:
     * `05_Templates/01_Projetos_SAP/Template_Item_Code_Review.md`
   * Identifique a pasta da demanda em `01_Projects/Insi/<Empresa>/<ID_DEMANDA> - <Nome da Demanda>/` e verifique se já existem revisões anteriores em `05 - Code Review/` para determinar o número sequencial `<R>` da revisão e a data da revisão (`DD-MM-AAAA`).
   * Responda no chat explicando de forma direta o que você entendeu que precisa fazer:
     * Resumo da revisão identificada (ID da demanda, número da revisão `Code Review <R>`, *Request* / *Tarefa* avaliada, data e resultado geral).
     * O caminho da pasta que será criada: `05 - Code Review/0<R> - Revisao (DD-MM-AAAA)/` (com as subpastas `Itens/` e `Guias/`), onde o PDF original será arquivado (`Code Review <R>.pdf`) e o diagrama Excalidraw da Escada será gerado.
     * A lista completa de notas `CR-<R>XX` que serão criadas em `Itens/`, agrupadas por prioridade:
       * `🔴 Obrigatório (Crítico)`
       * `🟡 Recomendado (Ponto de Atenção)`
       * `🔵 Melhoria Opcional`
       * `🟢 Checklist Final (QAS)` *(quando o documento de revisão contiver um checklist consolidado de testes pré-liberação)*
   * **Não crie nem mova nenhum arquivo antes da autorização explícita do usuário.**
2. **Segundo Passo (Execução após Autorização):**
   * Assim que o usuário autorizar (ou solicitar ajustes), execute os passos da Seção 2.

---

## 2. Escopo Exato de Execução

### Passo 1: Criar a Estrutura de Pastas e Arquivar o Documento Original
Dentro da pasta da demanda (`01_Projects/Insi/<Empresa>/<ID_DEMANDA> - <Nome da Demanda>/`), crie a estrutura da revisão:
```text
05 - Code Review/
└── 0<R> - Revisao (DD-MM-AAAA)/
    ├── Guias/
    ├── Itens/
    ├── 00 - <ID_DEMANDA> - Escada Code Review <R>.excalidraw.md
    └── Code Review <R>.pdf
```
* Copie ou mova o arquivo original do Code Review fornecido pelo usuário para `05 - Code Review/0<R> - Revisao (DD-MM-AAAA)/Code Review <R>.pdf`.

### Passo 2: Criar as Notas Individuais (`Itens/CR-<R>XX - <Título Curto>.md`)
Para cada apontamento identificado no documento de Code Review, crie uma nota em `05 - Code Review/0<R> - Revisao (DD-MM-AAAA)/Itens/CR-<R>XX - <Título Curto>.md` seguindo estritamente `05_Templates/01_Projetos_SAP/Template_Item_Code_Review.md`:

1. **Cabeçalho YAML e Navegação:**
   * Preencha `id_demanda`, `revisao` (`Code Review <R>`), `request`, `tarefa`, `item_cr` (`CR-<R>XX`), `prioridade`, `status: Pendente` e `data`, mantendo obrigatoriamente vazios `sap_destination: ""` e `transport_requests: []` conforme o template (sem consultar nem preencher destino ou TR na inicialização).
   * Configure a barra de navegação superior com links para a Escada (`00 - <ID_DEMANDA> - Escada Code Review <R>.excalidraw`), para o PDF original (`Code Review <R>.pdf`) e para os itens anterior (`⬅️`) e próximo (`➡️`).
2. **Estrutura Obrigatória de 4 Seções:**
   * **`## 1. O que está sendo apontado (Linguagem de Negócio)`:** Já entregue **preenchida** traduzindo o problema apontado pelo revisor para **Linguagem de Negócio** (explicando exclusivamente a regra de negócio, o processo, o comportamento visível e o impacto operacional/financeiro, **sem citar** nomes técnicos de objetos, tabelas, classes, métodos, campos, códigos ou instruções de programação — pois os detalhes técnicos literais já constam no PDF original).
   * **`## 2. O que eu preciso fazer (Linguagem de Negócio)`:** Mantenha com `*(A preencher na análise individual do item)*`.
   * **`## 3. Plano de Ação`:** Mantenha a estrutura `### O que será feito em cada objeto` com o placeholder padrão do template para preenchimento após a etapa 2 (registrando eventuais dependências diretas entre itens, se aplicável).
   * **`## 4. Teste Pós-Ajuste`:** Mantenha com os placeholders padrão do template para preenchimento após o plano de ação.
3. **Item Final de Checklist de Testes no QAS (Condicional):**
   * Quando o documento de Code Review trouxer uma seção consolidada de checklist de testes em ambiente de qualidade (QAS) e roteiro de devolução da *request*, crie o último item `CR-<R>XX - Checklist de Testes no QAS.md` com emoji `🟢`, estrutura própria de checklist (`## 📌 Contexto Importante do Code Review`, `## ✅ Checklist de Testes Obrigatórios no QAS (Antes da Liberação)`, `## 🧭 Roteiro para Devolução e Aprovação da Request` e `## 📋 Registro de Escopo e Status ATC da Revisão`), vinculando cada teste ao respectivo `[[CR-<R>XX - ...|CR-<R>XX]]`.

### Passo 3: Criar o Diagrama Excalidraw da Escada (`00 - <ID_DEMANDA> - Escada Code Review <R>.excalidraw.md`)
* Crie o arquivo Excalidraw na pasta da revisão organizando visualmente os cartões dos itens `CR-<R>XX` em raias/degraus por prioridade (`1. OBRIGATÓRIOS (CRÍTICOS)`, `2. RECOMENDADOS (PONTOS DE ATENÇÃO)`, `3. MELHORIAS OPCIONAIS` e `4. CHECKLIST FINAL QAS`).
* Inclua `## Element Links` apontando cada cartão diretamente para a respectiva nota `[[CR-<R>XX - <Título Curto>]]` e gere o bloco `compressed-json` válido para abertura imediata no Excalidraw.
* **Proibição de Mermaid:** Nunca utilize blocos Mermaid em nenhuma nota gerada.
