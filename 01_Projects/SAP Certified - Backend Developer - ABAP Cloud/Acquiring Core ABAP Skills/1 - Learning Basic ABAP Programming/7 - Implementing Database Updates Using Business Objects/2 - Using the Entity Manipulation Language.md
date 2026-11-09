---
title: "Usando a Entity Manipulation Language (EML)"
source: "https://learning.sap.com/courses/basic-abap-programming/using-the-entity-manipulation-language_b378f225-0471-45bf-8b7a-f48d00e1bccb"
author:
published:
created: 2026-10-21
description: "Após concluir esta lição, você será capaz de: Implementar instruções EML (Entity Manipulation Language)."
tags:
  - "clippings"
---

## Objetivo

Após concluir esta lição, você será capaz de implementar instruções EML (*Entity Manipulation Language*).

## Entity Manipulation Language (EML)

![[22_Using_EML_001.png]]

A **EML** (*Entity Manipulation Language*) é um conjunto de extensões da linguagem ABAP projetada especificamente para manipular dados e acionar a lógica de negócios de *Business Objects* no modelo [[RAP - ABAP RESTful Application Programming Model|RAP (ABAP RESTful Application Programming Model)]].

Você utiliza a instrução `READ ENTITIES` para ler dados; para todas as demais operações, utiliza a instrução `MODIFY ENTITIES` acompanhada da adição correspondente: `UPDATE`, `CREATE` ou `DELETE`.

> [!NOTE] Nota
> Você só pode utilizar as operações `CREATE`, `UPDATE` e `DELETE` se a definição de comportamento (*Behavior Definition* - BDEF) da interface do *Business Object* contiver a diretiva correspondente: `use create;`, `use update;` ou `use delete;`. Tentar utilizar uma operação não liberada gerará um erro de sintaxe.

![[22_Using_EML_002.png]]

Para ler dados de um *Business Object*, você utiliza a instrução `READ ENTITIES`. A instrução requer dois parâmetros fundamentais:
1. Uma tabela interna contendo as chaves dos registros que você deseja ler.
2. Outra tabela interna para receber os resultados retornados pela consulta.

Essas tabelas internas utilizam tipos de dados especiais chamados **tipos derivados de definição de comportamento** (*derived behavior definition types* ou *BDEF derived types*). O sistema cria esses tipos automaticamente quando o desenvolvedor ativa a definição de comportamento (*Behavior Definition*). Eles contêm alguns ou todos os campos do *Business Object*, além de campos de controle adicionais que orientam o framework durante o processamento da requisição.

Você declara essas tabelas internas utilizando a adição `TYPE TABLE FOR <operação>` na instrução `DATA`.

![[22_Using_EML_003.png]]

- O tipo `TABLE FOR READ IMPORT` contém o(s) campo(s)-chave do *Business Object*. A estrutura `*%control*` é gerada automaticamente para indicar quais campos do objeto de negócio estão sendo requisitados na operação atual. No nosso exemplo, o próprio framework preenche essa estrutura e você não precisa manipulá-la manualmente.
- O tipo `TABLE FOR READ RESULT` contém todos os campos do *Business Object*. Essa tabela armazena o conjunto de resultados após a execução da instrução de leitura.

![[22_Using_EML_004.png]]

A tabela de importação de leitura (*read import table*) possui uma coluna para cada campo-chave do *Business Object* (neste caso, `agencyID`). Para ler uma agência específica, você insere uma linha nessa tabela contendo sua chave primária.

Além dos campos-chave, a tabela contém as colunas de controle:
- `*%is_draft*`: Permite especificar se você deseja ler dados em rascunho (*draft data*) ou dados ativos (*active data*).
- `*%control*`: Usada para indicar quais campos devem ser lidos.

> [!NOTE] Nota
> Em nosso exemplo, lemos apenas dados ativos, e a estrutura `*%control*` é preenchida automaticamente pelo framework com base na lista de campos informada após a adição `FIELDS`.

![[22_Using_EML_005.png]]

Ao processar um *Business Object* usando as instruções `READ ENTITIES OF` ou `MODIFY ENTITIES OF`, você deve especificar primeiro o nome da definição de comportamento (*Behavior Definition*). Em seguida, insere a palavra-chave `ENTITY` e o nome da entidade com a qual deseja trabalhar. Se a entidade possuir um alias definido na BDEF, você deve utilizá-lo aqui.

> [!NOTE] Nota
> Você não pode utilizar o nome do alias logo após a adição `OF`. Do ponto de vista técnico, nesse ponto você especifica o nome do objeto de desenvolvimento da *Behavior Definition*, e não o nome da entidade. O alias deve ser usado após a palavra-chave `ENTITY`.

![[22_Using_EML_006.png]]

A instrução `READ ENTITIES` lê os dados do *Business Object* de acordo com as chaves passadas na adição `WITH`. O resultado é retornado na tabela interna informada na adição `RESULT`.

Na instrução, você também pode especificar quais campos do *Business Object* necessita:
- Adição `ALL FIELDS`: Retorna todos os campos da entidade.
- Variante `FIELDS ( campo1 campo2 ... )`: Restringe a leitura aos campos listados, otimizando o tráfego de dados.

> [!NOTE] Nota
> Ao contrário da instrução `SELECT` do ABAP SQL, a lista de campos no EML **não** é separada por vírgulas.

![[22_Using_EML_007.png]]

A tabela de resultados contém todos os campos do *Business Object*, juntamente com o campo de controle `*%is_draft*`.
- Se a instrução `READ ENTITIES` utilizar a variante `ALL FIELDS`, o sistema preenche todos os campos.
- Se você utilizar a variante `FIELDS ( f1 ... fn )`, apenas os campos solicitados serão preenchidos.

> [!NOTE] Nota
> Os campos-chave da entidade sempre são preenchidos, mesmo quando não são explicitamente listados na variante `FIELDS ( f1 ... fn )`.

![[22_Using_EML_008.png]]

Para atualizar dados, você declara uma tabela interna com `TYPE TABLE FOR UPDATE`. Ela contém todos os campos do *Business Object* e também a estrutura de controle `*%control*`. Na nossa sintaxe da instrução `MODIFY ENTITIES`, o sistema preenche a estrutura `*%control*` de forma automática.

![[22_Using_EML_009.png]]

A instrução `MODIFY ENTITIES` atualiza os dados no buffer transacional (*transactional buffer*) em memória. Na adição `FIELDS`, você especifica quais campos devem ser modificados. Na adição `WITH`, você passa a tabela interna contendo os novos dados a serem gravados.

Ao utilizar EML **fora** do ciclo de vida nativo do *Business Object* (por exemplo, em um programa de teste ou classe de execução do ADT), você deve usar a instrução `COMMIT ENTITIES` para disparar a sequência de salvamento (*Save Sequence*) e persistir as alterações no banco de dados.

> [!NOTE] Nota
> Mais adiante, utilizaremos EML dentro da própria implementação de comportamento (*Behavior Implementation*) de um *Business Object*. Dentro da implementação de comportamento, **não é necessário nem permitido** disparar o commit via `COMMIT ENTITIES`, pois o framework RAP gerencia as fases transacionais de forma automática.

## Como Implementar uma Instrução EML

Demonstração: [Iniciar Demonstração](https://learnsap.enable-now.cloud.sap/pub/mmcp/index.html?library=library.txt&show=project!PR_3AD00A7871CEE7A8:demo)

## Modificar Dados Usando EML

Neste exercício, você usará EML para executar a operação padrão *update* na entidade raiz do *Business Object* **/DMO/R_AGENCYTP**. Para evitar inconsistências e garantir aderência ao princípio de [[ABAP Cloud|Clean Core]], você não acessará o objeto de negócio diretamente, mas sim através de sua interface pública liberada e estável: **/DMO/I_AGENCYTP**.

#### Template:
- Nenhum

#### Solução:
- `/LRN/CL_S4D400_BOS_EML` (Classe Global)

### Tarefa 1: Analisar os Dados Atuais

Utilize a ferramenta *Data Preview* para verificar o nome atual da agência de viagens com ID "0700##", onde `##` representa o número do seu grupo.

#### Passos

1. Abra a definição da CDS View Entity **/DMO/I_AgencyTP**.
   1. Se a definição de dados **/DMO/I_AGENCYTP** ainda estiver aberta do exercício anterior, alterne para a aba correspondente. Caso contrário, pressione **Ctrl + Shift + A** para abrir o objeto de desenvolvimento ABAP.
2. Abra a ferramenta *Data Preview*.
   1. Clique com o botão direito em qualquer local do código-fonte para abrir o menu de contexto.
   2. No menu de contexto, selecione *Open With* → *Data Preview* (ou pressione **F8**).
3. Verifique o nome atual da agência com ID "0700##" (`##` é o número do seu grupo).
   1. Role a lista até a linha com o valor "0700##" na coluna **AgencyID** e anote o valor exibido na coluna **Name**.

### Tarefa 2: Criar uma Classe Global

Crie uma nova classe ABAP em seu próprio pacote de desenvolvimento.

#### Passos

1. Crie uma nova classe ABAP chamada **ZCL_##_EML**, onde `##` representa o número do seu grupo. Certifique-se de que a classe implemente a interface **IF_OO_ADT_CLASSRUN**.
   1. No Eclipse, selecione *File* → *New* → *ABAP Class*.
   2. Digite o nome do seu pacote no campo *Package*. No campo *Name*, informe **ZCL_##_EML** (substituindo `##` pelo seu grupo). Insira uma descrição.
   3. No quadro *Interfaces*, clique em *Add*.
   4. Digite **IF_OO_ADT_CLASSRUN**. Quando a interface aparecer na lista, dê um duplo clique para adicioná-la à definição da classe.
   5. Escolha *Next*.
   6. Selecione sua request de transporte (*Transport Request*) e clique em *Finish*.

### Tarefa 3: Atualizar Dados

Implemente uma instrução EML para alterar o nome da agência de viagens com o ID "0700##".

#### Passos

1. No método **IF_OO_ADT_CLASSRUN~MAIN**, declare uma tabela interna com o tipo derivado correto para atualização via EML da entidade **/DMO/I_AgencyTP** (sugestão de nome: **agencies_upd**).
   1. Adicione a seguinte linha de código:
      ```abap
      DATA agencies_upd TYPE TABLE FOR UPDATE /dmo/i_agencytp.
      ```
2. Preencha a tabela interna com uma única linha contendo "0700##" na coluna **AGENCYID** e qualquer novo nome desejado na coluna **NAME**.
   1. Após a declaração de dados, insira um código semelhante a:
      ```abap
      agencies_upd = VALUE #( ( agencyid = '0700##' name = 'Some fancy new name' ) ).
      ```
3. Implemente a instrução EML `MODIFY ENTITIES` para a interface de *Business Object* **/DMO/I_AgencyTP**. Atualize os dados da entidade raiz garantindo que apenas o campo **NAME** seja modificado.
   > [!TIP] Dica
   > Lembre-se de que o comportamento da interface define o alias **/DMO/Agency** para a entidade raiz **/DMO/I_AgencyTP**.
   1. No final do método, adicione a instrução:
      ```abap
      MODIFY ENTITIES OF /dmo/i_agencytp
        ENTITY /dmo/agency
        UPDATE FIELDS ( name )
          WITH agencies_upd.
      ```
4. Para obter um feedback visual na execução da aplicação, exiba um texto no console usando o método **out->write**.
   1. Após a instrução `MODIFY ENTITIES`, adicione:
      ```abap
      out->write( `Method execution finished!` ).
      ```
5. Ative e execute a classe.
   1. Pressione **Ctrl + F3** para ativar a classe.
   2. Pressione **F9** para executar a classe no console ADT.
6. Verifique se o novo nome foi gravado no banco de dados.
   1. Retorne à aba de *Data Preview* da CDS View Entity **/DMO/I_AgencyTP**.
   2. Na barra de ferramentas da visualização, clique em *Refresh* (ou pressione **F5**). Observe que o nome ainda **não** mudou, pois a transação não foi persistida.
7. Adicione a instrução `COMMIT ENTITIES` ao seu código para efetivar a gravação das alterações.
   1. Retorne ao método **IF_OO_ADT_CLASSRUN~MAIN** na sua classe global **ZCL_##_EML**.
   2. Ajuste o código para incluir o commit:
      ```abap
      METHOD if_oo_adt_classrun~main.
        DATA agencies_upd TYPE TABLE FOR UPDATE /dmo/i_agencytp.

        agencies_upd = VALUE #( ( agencyid = '0700##' name = 'Some fancy new name' ) ).

        MODIFY ENTITIES OF /dmo/i_agencytp
          ENTITY /dmo/agency
          UPDATE FIELDS ( name )
            WITH agencies_upd.

        COMMIT ENTITIES.

        out->write( `Method execution finished!` ).
      ENDMETHOD.
      ```
8. Ative e execute a classe novamente. Confirme que as alterações agora foram gravadas no banco de dados.
   1. Pressione **Ctrl + F3** para ativar a classe.
   2. Pressione **F9** para executar a classe.
   3. Retorne ao *Data Preview* da CDS View Entity **/DMO/I_AgencyTP**.
   4. Na barra de ferramentas, clique em *Refresh* e confira a persistência do novo nome.

---

## 📌 Termos e Conceitos para Adicionar em `03_Resources/SAP/Conceitos`
- `[[EML - Entity Manipulation Language]]` — Extensão da linguagem ABAP com sintaxe específica para operações de leitura, criação, atualização e exclusão em instâncias de Business Objects do modelo RAP.
- `[[BDEF - Behavior Definition]]` — Objeto de desenvolvimento no RAP que formaliza as operações permitidas, validações, determinações, ações e características transacionais de uma entidade CDS.
