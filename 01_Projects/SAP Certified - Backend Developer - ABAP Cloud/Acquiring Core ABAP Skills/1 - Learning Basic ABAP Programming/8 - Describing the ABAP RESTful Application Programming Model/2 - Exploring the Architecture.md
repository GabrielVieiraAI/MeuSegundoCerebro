---
title: "Explorando a Arquitetura (Exploring the Architecture)"
source: "https://learning.sap.com/courses/basic-abap-programming/exploring-the-architecture-of-rap_cdfbb8b8-9d94-4c33-bc5d-3d29d8206724"
author:
published:
created: 2026-10-21
description: "Após concluir esta lição, você será capaz de: Criar uma tabela de banco de dados. Gerar os objetos de desenvolvimento para um serviço OData UI."
tags:
  - "clippings"
---

## Objetivos

Após concluir esta lição, você será capaz de:

- Criar uma tabela de banco de dados.
- Gerar os objetos de desenvolvimento para um serviço OData UI.

## Criação do Modelo de Dados

### Modelo de Dados de Exemplo

![[01_Creating_The_Data_Model_002.png]]

O modelo de dados neste exemplo é muito simples: há uma única tabela de banco de dados contendo detalhes de conexões de voo — companhia aérea, número do voo, detalhes do aeroporto de partida e do destino.

> [!NOTE] Nota
> Não estão incluídos na figura os campos adicionais necessários ao runtime para gerenciar o controle de concorrência (*concurrency control*). Veremos esses campos mais adiante.

### Criando uma Tabela de Banco de Dados

<iframe 
    src="https://cdnapisec.kaltura.com/p/1921661/embedPlaykitJs/uiconf_id/50355372?iframeembed=true&entry_id=1_co02vqg8" 
    width="100%" 
    height="400" 
    allowfullscreen 
    frameborder="0">
</iframe>

Primeiro, vejamos como criar uma tabela de banco de dados.

### Definindo Atributos Básicos da Tabela

<iframe 
    src="https://cdnapisec.kaltura.com/p/1921661/embedPlaykitJs/uiconf_id/50355372?iframeembed=true&entry_id=1_no9qo42i" 
    width="100%" 
    height="400" 
    allowfullscreen 
    frameborder="0">
</iframe>

Veremos agora como definir os atributos básicos da tabela.

### Adicionando a Definição da Tabela

<iframe 
    src="https://cdnapisec.kaltura.com/p/1921661/embedPlaykitJs/uiconf_id/50355372?iframeembed=true&entry_id=1_o1cwu3xf" 
    width="100%" 
    height="400" 
    allowfullscreen 
    frameborder="0">
</iframe>

O vídeo a seguir demonstra como adicionar a definição da tabela.

![[01_Creating_The_Data_Model_006.png]]

Se você não utilizar um tipo pré-definido do ABAP Dictionary para especificar o tipo de uma coluna de tabela, utilize um **Elemento de Dados** (*Data Element*). Elementos de dados são objetos do ABAP Dictionary que definem o tipo de um campo individual, como um UUID ou um código de companhia aérea. Eles contêm não apenas a descrição do tipo técnico, mas também informações semânticas, como rótulos de campo (*field labels*). Ao utilizar elementos de dados para definir os tipos das colunas da tabela, o sistema pode aplicar os rótulos de campo automaticamente na interface de usuário gerada.

O elemento de dados ilustrado na figura descreve o campo de companhia aérea. É um campo de caracteres com comprimento 3; o sistema utilizará os rótulos de campo automaticamente na UI gerada.

![[01_Creating_The_Data_Model_009.png]]

Para criar um novo elemento de dados, acesse *File* → *New* → *Other*, e digite `data element` no campo *Filter Text*. Informe o nome do pacote e o nome do elemento de dados e selecione *Next*. Selecione uma ordem de transporte (*transport request*) e selecione *Finish*.

Em seguida, você deve especificar um tipo de dado para o elemento de dados. Este deve ser um domínio (*domain*) — o exemplo reutiliza o domínio existente `/DMO/CITY`. Observe que ambos os elementos de dados utilizam o mesmo domínio. Isso significa que, se alguém alterar posteriormente o comprimento do domínio, essa modificação será aplicada a todos os elementos de dados que o utilizam.

Por fim, insira os rótulos de campo curto, médio e longo, bem como o rótulo utilizado para cabeçalho de coluna (*heading*). Mais adiante, quando você gerar o aplicativo Fiori Elements, o sistema utilizará esses textos automaticamente.

![[01_Creating_The_Data_Model_010.png]]

Cada tabela definida deve possuir uma chave primária (*primary key*). Trata-se de uma sequência de campos no início da descrição da tabela que identifica cada registro de forma única.

O primeiro campo da tabela (e, portanto, também o primeiro campo na definição da chave) deve ser o campo mandante (*client*), e este deve possuir o tipo de dados `abap.clnt`. Além disso, para o nosso exemplo, é conveniente utilizar um UUID como chave única. Se você utilizar o elemento de dados `sysuuid_x16` para especificar o tipo desse campo, poderá deixar que o runtime atribua o UUID automaticamente ao criar um novo registro.

![[01_Creating_The_Data_Model_011.png]]

Por motivos de rastreabilidade, é recomendável armazenar algumas informações administrativas junto com os dados, como, por exemplo, o usuário que criou ou alterou o registro e timestamps de criação e da última alteração. A tabela de banco de dados criada deve conter os campos exibidos na figura.

> [!NOTE] Nota
> Estes campos são obrigatórios para o gerador que utilizaremos mais adiante. Para que o gerador funcione corretamente, os campos também devem ser definidos com os tipos de dados listados aqui.

Especialmente os campos `local_last_changed_at` e `last_changed_at` não são apenas campos administrativos. No ABAP RESTful Application Programming Model (RAP), eles também são utilizados para controle de concorrência (*concurrency control*).

Como as aplicações RESTful são *stateless* (sem estado), a consistência dos dados não pode ser garantida apenas por bloqueios exclusivos. O ABAP RESTful Application Programming Model utiliza uma combinação de bloqueios exclusivos e **ETags** para evitar inconsistências nos dados. Um ETag é um campo cujo valor é alterado sempre que um conjunto de dados é atualizado. Ao comparar o valor do campo ETag, o framework pode assegurar que o registro não foi modificado desde a última vez que foi lido. Timestamps da última alteração são ideais para atuar como campos de ETag.

![[01_Creating_The_Data_Model_012.png]]

Ao ativar uma tabela de banco de dados no ADT, o sistema cria a tabela física correspondente no banco de dados. Uma vez feito isso, você poderá gerar automaticamente os objetos adicionais necessários para a sua aplicação.

## Como Criar Elementos de Dados

Demonstração: [Start Demo](https://learnsap.enable-now.cloud.sap/pub/mmcp/index.html?library=library.txt&show=project!PR_64D8208310F6C3A7:demo)

## Como Criar uma Tabela de Banco de Dados

Demonstração: [Start Demo](https://learnsap.enable-now.cloud.sap/pub/mmcp/index.html?library=library.txt&show=project!PR_40AB455BABB1E6AD:demo)

## Copiar uma Tabela de Banco de Dados

Nos exercícios desta unidade, você criará um serviço OData UI. Esse serviço de UI servirá como base para uma aplicação que permite alterar os preços de voos. Primeiro, você criará um pacote dedicado para os objetos de desenvolvimento necessários. Em seguida, copiará uma tabela de banco de dados e a preencherá com dados.

#### Modelo (Template):

- `/LRN/S4D400_APT` (Tabela de Banco de Dados)
- `/LRN/CL_S4D400_APT_COPY` (Classe Global)

#### Solução:

- `/LRN/S4D400AFLGT` (Tabela de Banco de Dados)
- `/LRN/CL_S4D400_APS_COPY` (Classe Global)

### Tarefa 1: Criar Subpacote

Crie um novo subpacote sob o seu próprio pacote `ZS4D400_##` (onde `##` representa o número do seu grupo).

O subpacote deve ter os seguintes atributos:

| Atributo | Valor |
| --- | --- |
| Nome (*Name*) | **ZS4D400_##_RAP**, onde **##** é o número do seu grupo |
| Descrição (*Description*) | Objetos para Serviço OData UI |
| Adicionar aos Pacotes Favoritos (*Add to Favorite Packages*) | Marcado |
| Superpacote (*Superpackage*) | **ZS4D400_##**, onde **##** é o número do seu grupo |

#### Passos

1. Crie um subpacote sob o seu pacote `ZS4D400_##` (onde `##` representa o número do seu grupo).
	1. No *Project Explorer*, clique com o botão direito no seu pacote ABAP *ZS4D400_##* e selecione *New* → *ABAP Package*.
	2. Insira o nome do pacote **ZS4D400_##_RAP**, onde **##** representa o número do seu grupo.
	3. Insira a descrição **Objetos para Serviço OData UI** (*Objects for OData UI Service*).
	4. Marque a caixa de seleção *Add to favorite packages*.
	5. Certifique-se de que o campo *Superpackage* contenha o nome do seu pacote já existente.
	6. Selecione *Next*.
	7. Verifique se o *Software Component* está definido como *ZSTUDENTS*.
	8. Selecione *Next*.
	9. Confirme a ordem de transporte (*transport request*) e selecione *Finish*.

### Tarefa 2: Copiar Tabela de Banco de Dados

No novo pacote, crie uma cópia da tabela de banco de dados **/LRN/S4D400_APT**. Nomeie a nova tabela como **Z##FLIGHT**, onde `##` representa o número do seu grupo.

#### Passos

1. Copie a tabela de banco de dados **/LRN/S4D400_APT** para o seu próprio pacote **ZS4D400_##_RAP**, onde `##` é o número do seu grupo.
	1. Abra a definição da tabela de banco de dados **/LRN/S4D400_APT**.
	2. Vincule a visualização do *Project Explorer* com o editor (ícone *Link with Editor*).
	3. No *Project Explorer*, clique com o botão direito na tabela **/LRN/S4D400_APT** para abrir o menu de contexto.
	4. No menu de contexto, selecione *Duplicate...*.
	5. Insira o nome do seu pacote **ZS4D400_##_RAP** no campo *Package*. No campo *Name*, digite **Z##FLIGHT**, onde `##` representa o número do seu grupo.
	6. Selecione *Next*.
	7. Confirme a ordem de transporte e selecione *Finish*.
2. Ative a definição da tabela de banco de dados.
	1. Pressione **Ctrl + F3** para ativar o objeto de desenvolvimento.

### Tarefa 3: Preencher a Tabela de Banco de Dados

No seu pacote *ZS4D400_##*, crie uma cópia da classe global **/LRN/CL_S4D400_APT_COPY** (nome sugerido: **ZCL_##_COPY**). Nessa cópia, altere o valor da constante **table_name** para o nome da sua própria tabela de banco de dados. Em seguida, execute a classe como uma aplicação de console. Isso preencherá sua tabela com dados.

#### Passos

1. Copie a classe **/LRN/CL_S4D400_APT_COPY** para uma classe no seu pacote **ZS4D400_##**.
	1. Abra o código-fonte da classe global **/LRN/CL_S4D400_APT_COPY**.
	2. Se necessário, vincule a visualização do *Project Explorer* com o editor.
	3. No *Project Explorer*, clique com o botão direito na classe **/LRN/CL_S4D400_APT_COPY** para abrir o menu de contexto.
	4. No menu de contexto, selecione *Duplicate...*.
	5. Insira **ZS4D400_##** no campo *Package*. No campo *Name*, insira **ZCL_##_COPY**, onde `##` é o número do seu grupo.
	6. Selecione *Next*.
	7. Confirme a ordem de transporte e selecione *Finish*.
2. Na cópia, ajuste o código-fonte do método **IF_OO_ADT_CLASSRUN~MAIN**. Altere o valor da constante **table_name** para o nome da sua própria tabela de banco de dados.
	1. Certifique-se de que o valor da constante seja exatamente igual ao nome da sua tabela.
3. Ative e execute a classe como uma aplicação de console.
	1. Pressione **Ctrl + F3** para ativar a classe.
	2. Pressione **F9** para executar a classe.
	3. Verifique a aba *Console*. A última saída exibida deve ser: `... was filled with data`. Se a saída indicar `... is not a table of the right type.`, certifique-se de que a tabela de banco de dados com esse nome existe, está ativa e é uma cópia idêntica da tabela modelo.

## O Gerador de Objetos (The Object Generator)

### Gerando Objetos Adicionais

Acabamos de definir uma tabela de banco de dados para armazenar nossos dados, mas o aplicativo que criaremos necessita de mais objetos além dessa tabela. Podemos gerar esses objetos utilizando um assistente (*wizard*) no ADT.

![[02_Generating_Further_Objects_002.png]]

Os objetos gerados contêm todas as informações necessárias para fornecer uma aplicação funcional com recursos completos de criação, leitura, atualização e exclusão (CRUD). Mais adiante, também ajustaremos e estenderemos alguns desses objetos para modificar a aparência da interface de usuário e implementar verificações e cálculos de negócio.

Assista a este vídeo para aprender como gerar os objetos adicionais:

<iframe 
    src="https://cdnapisec.kaltura.com/p/1921661/embedPlaykitJs/uiconf_id/50355372?iframeembed=true&entry_id=1_5hbnucbe" 
    width="100%" 
    height="400" 
    allowfullscreen 
    frameborder="0">
</iframe>

## Como Gerar os Objetos Adicionais

Demonstração: [Start Demo](https://learnsap.enable-now.cloud.sap/pub/mmcp/index.html?library=library.txt&show=project!PR_C5F2D28BA24C47B7:demo)

## Pré-visualização do Serviço OData UI

### Publicar e Pré-visualizar o Serviço

Utilizando sua tabela de banco de dados e o gerador de objetos, você pode gerar todos os artefatos necessários para obter uma aplicação Fiori Elements em funcionamento. O único passo manual é publicar o serviço.

![[02_Generating_Further_Objects_009.png]]

Você deve publicar o serviço antes de testar a aplicação. Para fazer isso, abra a vinculação de serviço (*Service Binding*) e selecione *Publish*. Feito isso, a entidade criada (neste caso, `Connection`) aparecerá na lista de entidades. Selecione-a e clique em *Preview* para testar o aplicativo.

### Testar a Aplicação

![[02_Generating_Further_Objects_010.png]]

Ao selecionar *Preview*, uma janela do navegador é aberta e você pode criar uma nova conexão de voo. No entanto, neste momento a aplicação não implementa nenhuma validação além das verificações de tipo (por exemplo, apenas dígitos são permitidos no campo *Flight Number*).

## Gerar e Pré-visualizar um Serviço OData UI

Neste exercício, você gerará os objetos de repositório para um serviço OData UI e pré-visualizará o serviço como uma aplicação SAP Fiori.

#### Modelo (Template):

- Nenhum (*none*)

#### Solução:

- Os objetos de desenvolvimento gerados no pacote **/LRN/S4D400_EXERCISE_RAP**.

> [!NOTE] Nota
> Observe que a implementação do gerador utilizado pode mudar com novas versões. Portanto, os objetos de desenvolvimento gerados no exercício podem diferir ligeiramente daqueles apresentados na solução.

### Pré-requisitos

Você concluiu o exercício anterior. Você criou a tabela de banco de dados **Z##FLIGHT** (onde `##` é o seu número de grupo) e a tabela contém dados carregados.

### Tarefa 1: Utilizar o Gerador

Utilize o gerador *ABAP RESTful Application Programming Model* → *OData UI Service* para gerar os objetos de desenvolvimento necessários no seu subpacote **ZS4D400_##_RAP**. Para isso, informe os seguintes valores no assistente:

| Campo | Valor |
| --- | --- |
| *General* → *Referenced Object* | **Z##FLIGHT** |
| *General* → *Project Name* | *\<vazio\>* |
| *General* → *Artifacts Prefix* | *\<vazio\>* |
| *General* → *Artifacts Suffix* | *\<vazio\>* |
|  |  |
| *Business Object* → *Data Model* → *CDS Entity Name* | **ZR_##Flight** |
| *Business Object* → *Data Model* → *CDS Entity Alias* | **Flight** |
| *Business Object* → *Behavior* → *Behavior Implementation Class* | **ZBP_R_##FLIGHT** |
| *Business Object* → *Behavior* → *Draft Table Name* | **Z##FLIGHT_D** |
|  |  |
| *Service Projection* → *Service Projection Entity* → *CDS Entity Name* | **ZC_##Flight** |
| *Service Projection* → *Service Projection Behavior* → *Behavior Implementation Class* | **ZBP_C_##FLIGHT** |
|  |  |
| *Business Service* → *Service Definition* → *Service Definition Name* | **ZUI_##FLIGHT_O4** |
| *Business Service* → *Service Binding* → *Service Binding Name* | **ZUI_##FLIGHT_O4** |
| *Business Service* → *Service Binding* → *Binding Type* | **OData V4 - UI** |

#### Passos

1. Inicie o gerador de objetos para a sua tabela de banco de dados **Z##FLIGHT** (onde `##` é o número do seu grupo).
	1. No *Project Explorer*, expanda o caminho: *Favorite Packages* → *ZS4D400_##* → *ZS4D400_##_RAP* → *Dictionary* → *Database Tables* (onde `##` é o seu número de grupo). Como alternativa, abra a definição da tabela **Z##FLIGHT** e, se necessário, ative o *Link with Editor*.
	2. No *Project Explorer*, clique com o botão direito na tabela **Z##FLIGHT** para abrir o menu de contexto.
	3. No menu de contexto, selecione *Generate ABAP Repository Objects...*.
2. Na caixa de diálogo, selecione o gerador.
	1. No painel esquerdo da caixa de diálogo, selecione *ABAP RESTful Application Programming Model* → *OData UI Service*.
	2. Selecione *Next* para ir para a próxima etapa.
3. Certifique-se de que os objetos de desenvolvimento sejam criados no seu subpacote **ZS4D400_##_RAP**.
	1. Quando o cabeçalho da janela exibir *Enter Package*, confirme se o campo *Package* contém **ZS4D400_##_RAP**.
	2. Selecione *Next* para avançar.
4. Configure o gerador com os dados da tabela de referência.
	> [!CAUTION] Atenção
	> Não selecione *Next* antes de preencher todos os dados.
	1. Selecione os itens no painel esquerdo da caixa de diálogo um a um e preencha os campos correspondentes no painel direito. Os valores requeridos estão listados na tabela acima.
	2. Após inserir todos os dados, selecione *Next*.
5. Revise os objetos de repositório que serão gerados e conclua a geração.
	> [!NOTE] Nota
	> Seja paciente. A geração dos objetos leva algum tempo. Ao término do processo de geração, será exibida uma caixa de diálogo perguntando se deseja abrir o *Service Binding* gerado no editor. Confirme clicando em *Open*.
	1. Verifique a lista de objetos de repositório exibidos.
	2. Quando tiver certeza de que digitou todos os nomes corretamente, selecione *Next*.
	3. Confirme a ordem de transporte e selecione *Finish*.
	4. Confirme a janela de diálogo ao final da geração selecionando *Open*.
6. Analise a saída do gerador no *Project Explorer*.
	1. No *Project Explorer*, posicione o cursor sobre o subpacote **ZS4D400_##_RAP** e pressione **F5** para atualizar o conteúdo do pacote.
	2. Expanda todos os subnós do pacote para inspecionar os nomes e tipos dos objetos de desenvolvimento gerados.

### Tarefa 2: Pré-visualizar a Aplicação

Publique o serviço OData UI e pré-visualize o resultado como uma aplicação SAP Fiori.

#### Passos

1. Publique o endpoint do serviço local.
	1. Se ainda não estiver aberto, abra o *Service Binding* gerado **ZUI_##FLIGHT_O4**.
	2. Se o *Service Binding* estiver inativo, pressione **Ctrl + F3** para ativá-lo.
	3. Para publicar o serviço, clique no botão *Publish* localizado na parte central do editor.
2. Pré-visualize o serviço OData UI como uma aplicação SAP Fiori.
	1. Na seção *Service Version Details* (no painel direito), selecione a entidade **Flight** e clique em *Preview...*.
		#### Resultado
		Uma janela do navegador será aberta com a aplicação SAP Fiori. Se solicitado, faça o login com o seu usuário do sistema ABAP.
3. Exiba a lista de voos.
	1. Clique em *Go* para carregar e exibir a lista de voos gravados na sua tabela de banco de dados **Z##FLIGHT**.
4. Para um dos voos, navegue até a visão detalhada (*Object Page*).
	1. Clique em uma das linhas da lista para navegar para a página do objeto (*Object Page*) com os detalhes desse voo.
5. Para este voo, mude para o modo de edição.
	1. Clique em *Edit*.
6. Insira texto no campo de preço do voo (*Flight Price*), por exemplo: **a**.
7. Insira um valor negativo para o preço do voo (*Flight Price*).
