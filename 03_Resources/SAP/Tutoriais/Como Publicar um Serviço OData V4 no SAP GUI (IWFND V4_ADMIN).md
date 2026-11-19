---
tipo: tutorial
tipo_conteudo: guia-pratico
tags:
  - sap
  - rap
  - odata-v4
  - gateway
  - service-binding
  - fiori
  - sap-gui
  - iwfnd-v4-admin
data: 2026-11-16
aliases:
  - "Como Publicar um Serviço OData V4 no SAP GUI"
  - "Publicação de Serviço OData V4 via /IWFND/V4_ADMIN"
  - "Tutorial /IWFND/V4_ADMIN"
---

# Como Publicar um Serviço OData V4 no SAP GUI (`/IWFND/V4_ADMIN`)

---

## 1. Quando utilizar este procedimento?

Ao desenvolver serviços no modelo **RAP** (*ABAP RESTful Application Programming Model*), a exposição dos dados para o frontend **SAP Fiori** é feita por meio de um **Service Binding** com protocolo **OData V4** (*Open Data Protocol* versão 4).

Normalmente, a publicação local pode ser feita diretamente pelo botão **Publish** no Eclipse **ADT** (*ABAP Development Tools*). Porém, quando o mandante de desenvolvimento não permite publicação local ou quando é necessário gerenciar e testar o grupo de serviços diretamente no **SAP GUI** (*SAP Graphical User Interface*), utiliza-se a transação **`/IWFND/V4_ADMIN`** (*SAP Gateway Service Administration for OData V4*).

> [!NOTE] Diferença entre OData V2 e OData V4 no SAP GUI
> Enquanto serviços **OData V2** são registrados e publicados na transação **`/IWFND/MAINT_SERVICE`**, serviços **OData V4** possuem uma administração própria na transação **`/IWFND/V4_ADMIN`**, organizada por **Service Groups** (*Grupos de Serviços*).

> [!IMPORTANT] Mandante de execução
> Em ambientes SAP onde o mandante de desenvolvimento é restrito contra alterações locais (*Customizing Client*), realize a publicação em um **mandante de testes/aplicação** autorizado do sistema.

---

## 2. Pré-requisitos

Antes de iniciar a publicação no SAP GUI, certifique-se de que:
1. A **Service Definition** (*Definição de Serviço*) está criada e ativa no sistema.
2. O **Service Binding** (tipo **OData V4 - UI** ou **OData V4 - Web API**) já foi criado e ativado no Eclipse ADT.
3. Você está logado no mandante onde o serviço será publicado e testado.

---

## 3. Passo a Passo na Transação `/IWFND/V4_ADMIN`

### 3.1. Acessar a transação
1. Na barra de comandos do SAP GUI (canto superior esquerdo), digite **`/n/IWFND/V4_ADMIN`** e pressione **Enter**.

### 3.2. Localizar o Service Group
1. Na barra de ferramentas superior da tela inicial, clique no botão **`Publish Service Groups`** (*Publicar grupos de serviços*).
2. Preencha os filtros de busca:
   - **`System Alias`** (*Alias de sistema*): informe **`LOCAL`** para cenários *Embedded* (quando o serviço RAP reside no próprio S/4HANA).
   - **`Service Group ID`**: informe o nome do seu **Service Binding** (por exemplo, `ZUI_O4_...`). No protocolo OData V4 do RAP, o *Service Group* recebe o mesmo nome do *Service Binding*.
3. Clique em **`Get Service Groups`** (ou pressione **F8**) para carregar o resultado.

### 3.3. Publicar o Service Group
1. Na grade exibida, selecione a linha correspondente ao seu **Service Group**.
2. Clique no botão **`Publish Service Groups`** na barra de ações da lista.
3. Na caixa de diálogo de confirmação exibida pelo SAP, clique em **OK / Continuar** para concluir a publicação local do grupo de serviços no mandante atual.

### 3.4. Conferir o status da publicação
1. Retorne à tela principal da **`/IWFND/V4_ADMIN`**.
2. No painel esquerdo (**`Service Groups`**), localize o grupo recém-publicado.
3. Verifique se o grupo e o serviço vinculado constam como publicados (status ativo/verde) e com as rotas de serviço disponíveis.

---

## 4. Como Testar o Serviço OData V4 Após a Publicação

### 4.1. Teste rápido via Gateway Client (`/IWFND/GW_CLIENT`)
1. Ainda na **`/IWFND/V4_ADMIN`**, selecione o serviço publicado e clique no botão **`Service Test`** (*Teste de serviço*). O SAP abrirá automaticamente a transação **`/IWFND/GW_CLIENT`** (*SAP Gateway Client*) com a **URI** (*Uniform Resource Identifier* — caminho do serviço) preenchida.
2. Mantenha o método **HTTP** (*Hypertext Transfer Protocol*) como **`GET`**.
3. Para validar diferentes pontos do serviço, ajuste o final da URI conforme necessário:
   - Raiz do serviço: exibe o documento de serviço e os *Entity Sets* expostos.
   - `/$metadata`: retorna a estrutura completa de entidades, campos e anotações.
   - `/<NomeDaEntidade>`: consulta os registros reais retornados pela **CDS View** (*Core Data Services*).
4. Clique em **`Execute`** (**F8**).
5. Um código de retorno **HTTP `200 OK`** confirma que o serviço OData V4 está publicado e respondendo corretamente.

### 4.2. Teste visual via Fiori Preview (Eclipse ADT)
1. Caso tenha conexão configurada no Eclipse ADT para o mesmo mandante onde o serviço foi publicado, abra o **Service Binding**.
2. Na seção **Entity Set and Association**, selecione a entidade principal.
3. Clique no botão **`Preview...`** para abrir o aplicativo **SAP Fiori Elements** gerado automaticamente no navegador e validar a interface visual.
