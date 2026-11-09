---
title: "Adicionando Lógica ABAP (Adding ABAP logic)"
source: "https://learning.sap.com/courses/basic-abap-programming/adding-abap-logic_eb483817-4954-44a6-9551-c3214778b5d1"
author:
published:
created: 2026-10-21
description: "Após concluir esta lição, você será capaz de: Implementar o comportamento de um Objeto de Negócio (Business Object)."
tags:
  - "clippings"
---

## Objetivos

Após concluir esta lição, você será capaz de:

- Implementar o comportamento de um Objeto de Negócio (*Business Object*).

## Validações (Validations)

### Verificando a Chave Semântica

![[03_Creating_Validations_002.png]]

No ABAP RESTful Application Programming Model (RAP), a chave técnica de uma tabela de banco de dados frequentemente é composta pelo campo mandante (*client*) e um campo UUID, cujo valor é atribuído automaticamente pelo runtime no momento em que uma nova instância do objeto de negócio é criada. Essa combinação de campos é suficiente para assegurar que o sistema identifique cada registro de forma única. No entanto, além dessa chave técnica, nosso objeto também possui uma **chave semântica** — neste caso, a combinação de companhia aérea (*airline*) e número do voo (*flight number*), que também deve ser única de acordo com as regras de negócio. Para garantir a unicidade dessa combinação de campos, você deve implementar sua própria verificação na forma de uma **validação** (*validation*).

Você declara as validações na definição de comportamento (*Behavior Definition* - BDEF) da entidade CDS View e as implementa na classe de implementação de comportamento (*Behavior Implementation*).

### Verificações de Entrada na Aplicação

Além de validar a chave semântica, há outras verificações necessárias. Por exemplo, embora a aplicação gerada permita criar, ler, atualizar e excluir dados, ela ainda não contém verificações de consistência de negócio. Consequentemente, o usuário poderia criar conexões de voo para companhias aéreas inexistentes ou onde os aeroportos de partida e destino fossem os mesmos.

![[03_Creating_Validations_003.png]]

Para evitar esse tipo de inconsistência, você define validações adicionais na definição de comportamento e as implementa na classe de comportamento.

### Criando Textos de Mensagens

Antes de criar a validação, você deve criar os textos de mensagem que deseja exibir ao usuário. Isso é feito utilizando uma **Classe de Mensagens** (*Message Class*). Uma classe de mensagens é uma coleção de até 1.000 mensagens pertencentes a uma determinada área de aplicação. Conforme ilustrado na figura, cada texto possui um número que identifica a mensagem exclusivamente dentro da classe de mensagens.

![[03_Creating_Validations_004.png]]

Para criar uma nova classe de mensagens, proceda da seguinte forma:

1. Escolha *File* → *New* → *Other…* e digite `message` no campo de filtro.
2. Dê um duplo clique na entrada *Message Class* na lista de resultados; em seguida, informe o pacote, nome e descrição da nova classe de mensagens. Escolha *Next*.
3. Atribua a classe de mensagens a uma ordem de transporte (*transport request*) e selecione *Finish*.

As mensagens também podem conter marcadores de posição (*placeholders*), que são substituídos por valores concretos quando a mensagem é exibida em tempo de execução. Os marcadores de posição são representados pelo caractere `&` seguido por um número (ex: `&1`, `&2`). Você pode usar até quatro marcadores de posição em cada mensagem.

### Definindo a Validação

Para definir uma validação, você adiciona a declaração de validação à definição de comportamento do seu objeto de negócio. Neste exemplo, a validação deve ser executada sempre que o usuário gravar um registro, o que pode ocorrer na criação do registro ou em uma alteração posterior.

![[03_Creating_Validations_005.png]]

Ao definir a validação na definição de comportamento, um aviso informará que o método correspondente ainda não existe. Utilize um *quick fix* (combinação de teclas **Ctrl + 1**) para adicionar a declaração do método à implementação de comportamento. A implementação de comportamento é uma classe local dentro do seu *Behavior Pool*. A definição do método contém a adição `FOR VALIDATE ON SAVE`, que o identifica como a implementação da validação. O método possui o parâmetro de importação `KEYS`, que é uma tabela interna contendo as chaves dos objetos criados ou alterados. Você utiliza essas chaves para ler os dados reais inseridos pelo usuário.

A adição `FOR Connection~CheckSemanticKey` vincula o método à validação `CheckSemanticKey` declarada na definição de comportamento, onde `Connection` é o alias da entidade CDS View `Z_R_CONNECTION`.

![[03_Creating_Validations_006.png]]

Ao definir uma validação, você também deve criar sua implementação no *Behavior Pool*. A forma mais simples de fazer isso é através de um *quick fix*: posicione o cursor sobre o nome da validação e pressione **Ctrl + 1**. O ADT sugerirá a criação automática do método. Dê um duplo clique na sugestão para criá-lo.

### O Processo de Validação

> [!NOTE] Nota
> Alguns exemplos de código nesta seção utilizam instruções `SELECT` dentro de loops para manter a didática simples. Lembre-se de que instruções `SELECT` dentro de loops geram gargalos de desempenho e devem ser evitadas em código produtivo.

![[03_Creating_Validations_007.png]]

Quando o sistema dispara uma validação, ele executa a implementação correspondente. O parâmetro de importação `KEYS` contém as chaves dos registros de dados que foram alterados. Você utiliza essas chaves para ler os campos necessários por meio da **Entity Manipulation Language (EML)**. A EML é um conjunto especializado de instruções ABAP que permite manipular diretamente objetos de negócio do RAP.

Após ler os dados, você executa as verificações de negócio necessárias. Se a verificação falhar, você deve emitir a mensagem de erro apropriada e, crucialmente, instruir o framework a **não** gravar as alterações no banco de dados.

![[03_Creating_Validations_008.png]]

A primeira etapa em uma validação é ler os dados inseridos pelo usuário. Isso é feito com a instrução EML `READ ENTITIES`. As chaves dos registros correspondentes são passadas para o método através do parâmetro de importação `keys`.

Os campos necessários para validar a chave semântica são `CarrierID` (companhia aérea) e `ConnectionID` (número do voo).

O exemplo de código a seguir demonstra o uso da palavra-chave `CORRESPONDING` com declarações explícitas de variáveis, facilitando a visualização e o entendimento dos tipos de dados derivados envolvidos:

```abap
DATA read_keys   TYPE TABLE FOR READ IMPORT zs4d400_r_connection.
DATA connections TYPE TABLE FOR READ RESULT zs4d400_r_connection. 

read_keys = CORRESPONDING #( keys ). 

READ ENTITIES OF zs4d400_r_connection IN LOCAL MODE
       ENTITY Connection
       FIELDS ( CarrierID ConnectionID ) 
         WITH read_keys
       RESULT connections.
```

Após ler as entradas do usuário, você utiliza os valores de `CarrierID` e `ConnectionID` para verificar se essa mesma chave semântica já está em uso em outro registro além daquele em processamento no momento. Como a combinação de chaves pode estar presente tanto na tabela ativa (*active table*) quanto na tabela de rascunho (*draft table*), é necessário consultar ambas. A forma mais eficiente de realizar essa verificação simultânea é utilizando um comando `UNION`.

![[03_Creating_Validations_009.png]]

O resultado retornado por essa consulta deve ser sempre vazio. Caso contenha registros, significa que já existem outros registros com a mesma combinação de `CarrierID` e `ConnectionID`. Isso indica que o registro que o usuário está tentando criar é uma duplicata e deve ser rejeitado.

![[03_Creating_Validations_012.png]]

Se a combinação de companhia aérea e número de voo já existir, haverá registros na tabela `check_result`. Nesse caso, você deve emitir uma mensagem de erro.

A primeira etapa é instanciar um objeto de mensagem. Isso é realizado utilizando a autorreferência `me` e chamando o método `new_message( )`. Os parâmetros `id`, `number` e `severity` são obrigatórios:
- `id`: Nome da classe de mensagens.
- `number`: Número da mensagem.
- `severity`: Classifica a severidade da mensagem (sucesso, informação, aviso ou erro). A classe de implementação de comportamento contém a constante estruturada `ms`, cujos componentes representam os diferentes níveis de severidade (neste caso, `ms-error`).

O método também aceita parâmetros opcionais de importação (`v1`, `v2`, `v3` e `v4`), utilizados para preencher os marcadores de posição da mensagem. Neste exemplo, o marcador `&1` é substituído pelo código da companhia aérea e `&2` pelo número do voo.

O resultado da chamada ao método é uma referência de objeto. Na etapa seguinte, você passa essa referência ao runtime do RAP para que a mensagem de erro seja retornada ao serviço OData e exibida na interface da aplicação.

![[03_Creating_Validations_013.png]]

Para que o runtime exiba a mensagem na aplicação, você deve reportá-la através da estrutura `reported`. Esta estrutura é um parâmetro `CHANGING` implícito de todos os métodos de validação e possui tipagem profunda (*deep structure*). Ela contém um componente com o nome do alias da entidade, o qual é uma tabela interna.

Para reportar a mensagem adequadamente, você deve executar três ações:

1. **Adicionar a chave do registro afetado:** Insira a chave na tabela interna utilizando o grupo de campos `%tky` (*Transactional Key*). Ao agrupar os campos de chave com `%tky`, você manipula a chave transacional inteira de uma só vez, sem precisar tratar cada campo separadamente.
2. **Vincular o objeto de mensagem:** Atribua a referência do objeto de mensagem criada anteriormente ao componente `%msg` da tabela interna.
3. **Associar a mensagem ao campo afetado:** Vincule o erro aos campos de tela específicos para destacá-los em vermelho no app, facilitando a correção pelo usuário. Isso é feito através do componente `%element`.

![[03_Creating_Validations_014.png]]

Neste exemplo, `reported_record` é uma estrutura do tipo de linha da tabela interna `reported-connection`. Você preenche o componente `%tky` com o conteúdo do grupo de campos `%tky` da estrutura de trabalho `connection`. Em seguida, atribui o objeto de mensagem retornado pelo método `new_message( )` ao componente `%msg`. Finalmente, para associar o erro aos campos `CarrierID` e `ConnectionID`, você utiliza a estrutura `%element`. A estrutura `%element` possui um componente para cada campo da entidade: ao marcar um componente como verdadeiro, o campo correspondente é destacado visualmente na aplicação. Essa marcação é feita utilizando a constante estruturada `if_abap_behv=>mk`, que possui as adições `on` (marcado/verdadeiro) e `off` (desmarcado/falso).

> [!NOTE] Nota
> As constantes globais padrão `abap_true` e `abap_false` não podem ser utilizadas para preencher `%element`, pois seus tipos de dados internos são incompatíveis com o framework RAP.

![[03_Creating_Validations_015.png]]

Além de emitir a mensagem visual, você deve informar ao runtime que a operação foi rejeitada e que os dados inválidos **não** devem ser gravados no banco de dados. Para isso, utiliza-se a estrutura `failed`. A estrutura `failed` também é um parâmetro implícito do tipo `CHANGING` disponível em todos os métodos de validação.

Para marcar um registro como reprovado (*failed*), basta adicionar seu grupo de campos `%tky` ao componente `%tky` da tabela interna `failed-Connection`.

![[03_Creating_Validations_016.png]]

A validação seguinte verifica se a companhia aérea informada pelo usuário realmente existe no banco de dados. O primeiro passo é ler o valor informado via EML com `READ ENTITIES`, lendo especificamente o campo `CarrierID`.

![[03_Creating_Validations_017.png]]

A instrução `SELECT SINGLE` lê dados da entidade CDS View `/dmo/i_carrier` para checar a existência da companhia aérea informada. Caso exista, o valor da constante global `abap_true` (`'X'`) é gravado no campo auxiliar `exists`. Se o campo `exists` permanecer inicial após o `SELECT`, a companhia aérea é inexistente: o método cria a mensagem de erro, preenche a estrutura `reported` e adiciona o registro à estrutura `failed`.

A última validação verifica se os aeroportos de origem e destino são diferentes entre si. O primeiro passo é ler os campos `AirportFromID` e `AirportToID` com `READ ENTITIES`.

![[03_Creating_Validations_018.png]]

![[03_Creating_Validations_019.png]]

Se o aeroporto de partida e o de destino forem idênticos, a mensagem de erro correspondente é criada e as estruturas `reported` e `failed` são preenchidas exatamente como nos exemplos anteriores.

## Como Validar a Chave Semântica

Demonstração: [Start Demo](https://learnsap.enable-now.cloud.sap/pub/mmcp/index.html?library=library.txt&show=project!PR_560AA21E57073699:demo)

## Determinações (Determinations)

### Determinar Cidades com Base nos Códigos dos Aeroportos

Na aplicação de exemplo, a entidade de conexão de voo armazena o aeroporto, a cidade e o país de partida, bem como o aeroporto, a cidade e o país de chegada. Embora fosse possível exigir que o usuário digitasse todas essas informações manualmente, a melhor prática de experiência do usuário (UX) e integridade de dados consiste em solicitar apenas o código dos aeroportos e fazer com que a aplicação determine e preencha automaticamente a cidade e o país correspondentes a partir do banco de dados. No ABAP RESTful Application Programming Model, essa automação é implementada por meio de uma **determinação** (*determination*).

![[04_Creating_Determinations_002.png]]

Primeiro, você implementará a determinação. Em seguida, verá como desabilitar a edição manual dos campos que passam a ser preenchidos de forma automática.

### Definindo a Determinação

Você define a determinação na definição de comportamento (*Behavior Definition*) de um objeto de negócio. A determinação deste exemplo é chamada `getCities` e será acionada sempre que o objeto de negócio for salvo e pelo menos um dos campos `AirportFromID` ou `AirportToID` tiver sido modificado. Você pode utilizar um *quick fix* na definição de comportamento para gerar a assinatura do método correspondente na implementação de comportamento.

![[04_Creating_Determinations_003.png]]

### O Processo de Determinação

Vejamos cada etapa do fluxo de processamento de uma determinação.

![[04_Creating_Determinations_004.png]]

Quando o sistema dispara uma determinação, o método correspondente é executado. O parâmetro de importação `KEYS` contém as chaves dos registros que foram modificados. No método de determinação, você utiliza a EML para ler os dados a partir das chaves da mesma forma realizada nas validações. No entanto, em uma determinação você também calcula ou deriva novos valores e deve salvar esses dados no buffer transacional gerenciado pelo framework através da instrução EML `MODIFY ENTITIES`.

> [!NOTE] Nota
> Alguns exemplos de código nesta seção utilizam instruções `SELECT` dentro de loops para manter a didática simples. Lembre-se de que `SELECT`s em loops degradam a performance e devem ser evitados em cenários produtivos.

![[04_Creating_Determinations_005.png]]

No início da determinação, você lê as entradas do usuário utilizando EML. São lidos os campos `AirportFromID` e `AirportToID`, que servirão como base para buscar os dados de cidade e país.

![[04_Creating_Determinations_006.png]]

O modelo de dados didático disponibiliza a CDS View Entity `/dmo/i_airport`, utilizada para consultar a cidade e o país em que um determinado aeroporto está situado. O exemplo utiliza a variante da cláusula `INTO` na qual os campos da estrutura de trabalho são mapeados explicitamente. Lembre-se de que as alterações ocorrem na estrutura de trabalho (*work area*) da tabela interna e devem ser transferidas de volta para a própria tabela através da instrução `MODIFY`.

![[04_Creating_Determinations_007.png]]

A instrução `READ ENTITIES` retorna uma tabela interna com o tipo derivado `FOR READ RESULT`. Para alterar os dados no buffer transacional, utiliza-se a instrução `MODIFY ENTITIES`. Os dados a serem modificados são passados a essa instrução por meio de uma tabela interna com o tipo derivado `FOR UPDATE`. Embora os campos de negócio sejam idênticos em ambos os tipos, a tabela `FOR UPDATE` possui uma estrutura técnica adicional chamada `%control`, que contém informações administrativas indicando quais campos foram alterados.

Por esse motivo, não é possível repassar diretamente a tabela resultante do `READ ENTITIES` para o comando `MODIFY ENTITIES`. Você deve transferir seus dados para uma tabela interna tipada apropriadamente (`connections_upd`) antes de executar a modificação.

![[04_Creating_Determinations_008.png]]

Para atualizar os dados com os campos derivados pela determinação, executa-se o comando `MODIFY ENTITIES`. Nele, especifica-se na cláusula `FIELDS` quais colunas devem ser atualizadas e passam-se os dados através da adição `WITH`. Essa tabela interna deve possuir o tipo de dados derivado correto (neste caso, `TYPE TABLE FOR UPDATE zsd4d400_r_connection`).

A instrução `MODIFY ENTITIES` também pode retornar mensagens, capturadas através da cláusula `REPORTED`. Essas mensagens podem ser propagadas para o objeto de negócio atribuindo o conteúdo da tabela interna à estrutura `reported` do próprio método de determinação.

## Como Determinar Cidades e Países

Demonstração: [Start Demo](https://learnsap.enable-now.cloud.sap/pub/mmcp/index.html?library=library.txt&show=project!PR_8D5D08FDC9FDAF8A:demo)

## Validar o Preço do Voo

Neste exercício, você definirá e implementará uma validação para o preço do voo.

#### Modelo (Template):

- Nenhum (*none*)

#### Solução:

- `/LRN/S4D400_R_FLIGHT` (Definição de Comportamento - BDEF)
- `/LRN/BP_S4D400_R_FLIGHT` (Classe Global - Behavior Pool)

### Pré-requisitos

Você concluiu os exercícios anteriores. Você criou e populou a tabela de banco de dados **Z##FLIGHT** (onde `##` é o número do seu grupo) e gerou os objetos de desenvolvimento para um serviço OData UI.

### Tarefa 1: Validar o Preço

Defina e implemente uma validação para verificar se o campo **Price** possui um valor positivo (nome sugerido: **validatePrice**). Se o valor for negativo ou igual a zero, rejeite a alteração e reporte uma mensagem de erro apropriada da classe de mensagens **/LRN/S4D400**.

#### Passos

1. Na definição de comportamento **ZR_##FLIGHT**, defina uma nova validação **validatePrice**. Garanta que a validação seja sempre executada durante a operação padrão **create**, e somente se o valor de **Price** tiver sido modificado nas demais operações.
	1. Abra a definição de comportamento **ZR_##FLIGHT**.
	2. Ajuste o código adicionando a validação:
		```abap
		create;
		update;
		delete;
		validation validatePrice on save { create; field Price; }
		```
2. Ative a definição de comportamento.
	1. Pressione **Ctrl + F3** para ativar a definição de comportamento.
3. Utilize um *quick fix* para criar o método de implementação da validação na classe manipuladora de comportamento (*behavior handler class*).
	1. Posicione o cursor sobre o nome da validação e pressione **Ctrl + 1**.
	2. Dê um duplo clique na opção *Add method for validation...*.
4. No início do método **validatePrice**, declare um objeto de dados estruturado com o tipo de linha de **failed-flight** (nome sugerido: **failed_record**). Da mesma forma, declare um objeto de dados estruturado com o tipo de linha de **reported-flight** (nome sugerido: **reported_record**).
	> [!NOTE] Nota
	> Essas estruturas serão utilizadas para inserir linhas em **failed-flight** e **reported-flight** caso a validação identifique erros.
	1. Adicione a seguinte declaração:
		```abap
		DATA failed_record   LIKE LINE OF failed-flight.
		DATA reported_record LIKE LINE OF reported-flight.
		```
5. Utilize uma instrução `READ ENTITIES` para ler os dados inseridos pelo usuário a partir do buffer transacional. Utilize a adição `IN LOCAL MODE` e certifique-se de que apenas os campos-chave e o campo **Price** sejam lidos. Utilize uma declaração inline para a tabela de resultados (nome sugerido: **flights**).
	> [!NOTE] Nota
	> Não é necessário listar os campos de chave após a adição `FIELDS`, pois a instrução `READ ENTITIES` sempre inclui as chaves automaticamente.
	1. Após as declarações, adicione o seguinte trecho de código, substituindo **##** pelo número do seu grupo:
		```abap
		READ ENTITIES OF ZR_##Flight IN LOCAL MODE
		  ENTITY Flight
		    FIELDS ( Price )
		    WITH CORRESPONDING #( keys )
		    RESULT DATA(flights).
		```
6. Implemente um loop sobre os dados lidos. Utilize uma declaração inline para a área de trabalho (nome sugerido: **flight**).
	1. Após a instrução EML, adicione a estrutura de repetição:
		```abap
		LOOP AT flights INTO DATA(flight).
		  
		ENDLOOP.
		```
7. Dentro do loop, verifique se o componente **Price** é maior que zero. Caso não seja, preencha a estrutura **failed_record** com a chave do voo atual e insira-a na tabela **failed-flight**. Da mesma forma, preencha a estrutura **reported_record** com a chave do voo e insira-a na tabela **reported-flight**.
	> [!TIP] Dica
	> Em objetos de negócio habilitados para rascunho (*draft-enabled*), utilize o componente **%tky** para repassar a chave transacional completa.
	1. Dentro do loop, insira o código:
		```abap
		IF flight-price <= 0.
		  failed_record-%tky = flight-%tky.
		  APPEND failed_record TO failed-flight.
		  reported_record-%tky = flight-%tky.
		  APPEND reported_record TO reported-flight.
		ENDIF.
		```
8. Antes do comando `APPEND` em `reported-flight`, preencha o componente **%msg** da estrutura **reported_record** com uma referência para um objeto de mensagem. Para instanciar o objeto de mensagem, chame o método **new_message** com os seguintes parâmetros:

	| Nome do Parâmetro | Valor |
	| --- | --- |
	| **id** | `'/LRN/S4D400'` |
	| **number** | `'101'` |
	| **severity** | `ms-error` |

	1. Ajuste o código do loop conforme abaixo:
		```abap
		LOOP AT flights INTO DATA(flight).
		  IF flight-price <= 0.
		    failed_record-%tky = flight-%tky.
		    APPEND failed_record TO failed-flight.
		    reported_record-%tky = flight-%tky.
		    reported_record-%msg = new_message(
		                      id       = '/LRN/S4D400'
		                      number   = '101'
		                      severity = ms-error ).
		    APPEND reported_record TO reported-flight.
		  ENDIF.
		ENDLOOP.
		```
9. Ative a classe.
	1. Pressione **Ctrl + F3** para ativar a classe.

### Tarefa 2: Testar e Depurar

Defina um breakpoint na implementação da validação. Reinicie a pré-visualização do serviço OData UI e altere o preço de um voo existente. Realize entradas válidas e inválidas para analisar a validação no depurador.

#### Passos

1. Defina um breakpoint na instrução `READ ENTITIES` do método **validatePrice**.
	1. Na implementação do método **validatePrice**, localize a instrução `READ ENTITIES` e dê um duplo clique na barra cinza à esquerda do número da linha para inserir um breakpoint.
2. Reinicie a pré-visualização do serviço OData UI.
	1. Feche a aba ou janela do navegador onde a aplicação de preview está aberta.
	2. Abra o *Service Binding* **ZUI_##FLIGHT_O4**. Na lista *Entity Set and Association* à direita, selecione a entidade **Flight** e clique em *Preview...*.
3. Na aplicação, exiba a lista de voos, abra os detalhes de um deles e mude para o modo de edição.
	1. Proceda como nas etapas dos exercícios anteriores (clique em *Go*, escolha um voo e clique em *Edit*).
4. Faça alterações no preço do voo e selecione *Save*. Analise a validação no depurador (*Debugger*).
	1. Observe a parada no breakpoint, inspecione as tabelas `keys`, `flights`, `failed` e `reported`, e finalize a execução com **F8**.
