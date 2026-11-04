---
title: "Quiz - Implementing Authorization Checks"
source: "https://learning.sap.com/courses/deepening-your-abap-programming-knowledge/implementing-authorization-checks_quiz"
created: 2026-11-03
tags:
  - sap
  - abap
  - abap-cloud
  - quiz
  - autorizacao
  - authority-check
  - dcl
  - cds
---
**Roteiro de Estudos Relacionado:** [[Roteiro de Estudos SAP]]

# SAP Learning - Deepening Your ABAP Programming Knowledge
## Quiz: Implementing Authorization Checks

> [!NOTE] Instruções de Estudo Ativo
> Tente responder a cada questão antes de expandir o bloco retrátil contendo o gabarito oficial e a fundamentação técnica.

---

### Pergunta 1
**O que acontece imediatamente após a execução da instrução `AUTHORITY-CHECK OBJECT 'S_CARRID' ...` caso o usuário conectado NÃO possua a autorização solicitada?**

- **A.** O programa é abortado imediatamente com um erro em tempo de execução (*Short Dump*).
- **B.** O sistema fecha automaticamente a sessão do usuário.
- **C.** A instrução apenas atualiza a variável de sistema `sy-subrc` com um valor diferente de zero (`<> 0`), cabendo inteiramente ao desenvolvedor verificar o retorno e interromper o processamento indevido.
- **D.** Uma mensagem de erro padrão é exibida na barra de status sem necessidade de código adicional.

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **C**  
> **Fundamentação Técnica:** A instrução `AUTHORITY-CHECK` atua exclusivamente como um avaliador de permissões em memória. Ela não bloqueia comandos posteriores e não para a aplicação por conta própria. O desenvolvedor é 100% responsável por incluir uma verificação condicional (`IF sy-subrc <> 0`) para lançar uma exceção, exibir uma mensagem e interromper o fluxo de execução.

---

### Pergunta 2
**Ao avaliar o retorno da instrução `AUTHORITY-CHECK`, qual é o significado técnico específico quando a variável de sistema retorna `sy-subrc = 4`?**

- **A.** O usuário possui autorização plena para o objeto e todos os valores requisitados.
- **B.** O usuário possui o objeto de autorização atribuído em seus papéis, mas NÃO possui permissão para os valores específicos passados em um dos campos testados.
- **C.** O objeto de autorização não existe em nenhum papel do usuário.
- **D.** Ocorreu um erro de sintaxe no comando.

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **B**  
> **Fundamentação Técnica:** No retorno do `AUTHORITY-CHECK`:
> - `sy-subrc = 0`: Sucesso total.
> - **`sy-subrc = 4`**: O usuário tem o objeto em seu perfil, mas o valor do campo fornecido na consulta (ex: filial `'DE01'`) não consta na lista de valores permitidos para ele.
> - `sy-subrc = 12`: O usuário não possui o objeto de autorização em nenhum de seus papéis da PFCG.

---

### Pergunta 3
**No padrão universal de autorizações da SAP, qual é o valor padrão atribuído ao campo de atividade (`ACTVT`) para verificar se um usuário possui permissão de apenas EXIBIÇÃO / LEITURA de dados?**

- **A.** `'01'`
- **B.** `'02'`
- **C.** `'03'`
- **D.** `'06'`

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **C**  
> **Fundamentação Técnica:** Os códigos de atividade (`ACTVT`) são padronizados globalmente no SAP:
> - `'01'`: Criar (*Create*)
> - `'02'`: Modificar (*Change*)
> - **`'03'`: Exibir (*Display / Read*)**
> - `'06'`: Excluir (*Delete*)

---

### Pergunta 4
**Qual tecnologia e linguagem declarativa é utilizada no ABAP Development Tools (ADT) para criar regras de controle de acesso e segurança a nível de linha (*Row-Level Security*) diretamente sobre Core Data Services (CDS Views)?**

- **A.** ABAP Unit
- **B.** DDL (Data Definition Language)
- **C.** DCL (Data Control Language)
- **D.** SQLScript

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **C**  
> **Fundamentação Técnica:** Os controles de acesso para CDS Views são redigidos em **DCL (Data Control Language)**, gerando artefatos de repositório do tipo DCLS (`define role`). Eles mapeiam elementos da view para objetos de autorização da PFCG através da cláusula `aspect pfcg_auth`.

---

### Pergunta 5
**Qual é a principal vantagem de segurança e desempenho ao utilizar Controles de Acesso CDS (DCL) em vez de programar comandos `AUTHORITY-CHECK` manuais para proteger operações de leitura?**

- **A.** O DCL permite excluir dados do banco permanentemente.
- **B.** O DCL implementa Segurança por Padrão (*Security by Default*), aplicando filtros de autorização diretamente no SAP HANA (Code Pushdown) em qualquer `SELECT`, impedindo que linhas não autorizadas trafeguem pela rede ou que o desenvolvedor esqueça de checar permissões.
- **C.** O DCL não requer o uso de papéis na transação PFCG.
- **D.** O DCL substitui o compilador ABAP.

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **B**  
> **Fundamentação Técnica:** Com Controles de Acesso CDS, a segurança é inerente à entidade de dados. Toda instrução `SELECT` que consulta a CDS View recebe filtros `WHERE` automáticos no banco de dados. O desenvolvedor consumidor não precisa se lembrar de escrever checagens manuais, eliminando o risco de exposição inadvertida de dados confidenciais.

---

### Pergunta 6
**Ao definir um novo Objeto de Autorização na transação `SU21`, qual é a quantidade máxima de Campos de Autorização que podem ser agrupados para compor esse objeto?**

- **A.** Até 3 campos
- **B.** Até 5 campos
- **C.** Até 10 campos
- **D.** Campos ilimitados

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **C**  
> **Fundamentação Técnica:** Um objeto de autorização no repositório SAP (transação `SU21`) pode agregar no máximo **10 campos de autorização** simultâneos para definir um critério de segurança complexo de negócio.

---

### Pergunta 7
**No comando `AUTHORITY-CHECK`, caso um objeto de autorização possua múltiplos campos cadastrados, mas você queira intencionalmente DISPENSAR a verificação de um campo específico naquele contexto, qual cláusula deve ser utilizada?**

- **A.** `ID 'CAMPO' FIELD '*'`
- **B.** `ID 'CAMPO' DUMMY`
- **C.** `ID 'CAMPO' IGNORE`
- **D.** `ID 'CAMPO' OPTIONAL`

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **B**  
> **Fundamentação Técnica:** A sintaxe oficial do ABAP utiliza a adição **`DUMMY`** (exemplo: `ID 'WERKS' DUMMY`). Isso sinaliza ao kernel que o campo faz parte do objeto de autorização, mas que o desenvolvedor optou por não impor restrições sobre ele naquela checagem específica.

---

### Pergunta 8
**Qual anotação de cabeçalho DEVE ser declarada na definição de uma CDS View Entity para instruir o sistema a aplicar ativamente os Controles de Acesso DCL existentes?**

- **A.** `@AccessControl.authorizationCheck: #CHECK`
- **B.** `@Security.enforce: true`
- **C.** `@Authorization.active: #YES`
- **D.** `@AccessControl.mode: #MANDATORY`

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **A**  
> **Fundamentação Técnica:** A anotação padrão oficial é **`@AccessControl.authorizationCheck: #CHECK`**. Ela estabelece que qualquer consulta ABAP SQL direcionada a essa CDS View Entity deve avaliar e impor obrigatoriamente os filtros de segurança a nível de linha definidos nos artefatos DCL.
