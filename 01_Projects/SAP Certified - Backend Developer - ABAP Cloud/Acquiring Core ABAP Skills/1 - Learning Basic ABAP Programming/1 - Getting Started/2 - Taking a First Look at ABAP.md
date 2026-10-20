---
title: Dando uma Primeira Olhada no ABAP
source: https://learning.sap.com/courses/basic-abap-programming/taking-a-first-look-at-abap_deb518e7-5030-48b9-9389-6507b48cf524
created: 2026-10-16
tags:
  - sap
  - abap
  - abap-cloud
  - adt
---
**Roteiro de Estudos Relacionado:** [[Roteiro de Estudos SAP]]
# Objetivo
Após concluir esta lição, você será capaz de trabalhar com um objeto de desenvolvimento (*development object*).

---
## Investigação de Código ABAP

### Trabalhando no Project Explorer

Para trabalhar com objetos de desenvolvimento ABAP, normalmente você exibe o conteúdo de um pacote (*package*) no **Project Explorer**. Pacotes são contêineres para objetos de desenvolvimento que pertencem logicamente ao mesmo contexto.

![[02_Analyzing_ABAP_Coding_001.png]]

Para adicionar um pacote aos seus favoritos, clique com o botão direito no nó **Favorite Packages** no Project Explorer e escolha **Add Package...**. Uma caixa de diálogo será exibida, onde você pode inserir um termo de filtro. O sistema exibirá apenas os pacotes que contêm esse termo. Dê um duplo clique no pacote que deseja adicionar aos seus favoritos.

---
### Abrindo Objetos de Desenvolvimento

Existem duas maneiras de abrir um objeto de desenvolvimento no ADT (*ABAP Development Tools*).

![[02_Analyzing_ABAP_Coding_002.png]]

A primeira é localizar o nome do objeto no **Project Explorer** e dar um duplo clique sobre ele. A outra é utilizar o atalho de teclado **Ctrl + Shift + A**. Isso abre uma caixa de diálogo na qual você pode digitar parte do nome do objeto para pesquisá-lo e abri-lo rapidamente.

---
### Investigando um Objeto de Desenvolvimento

Ao trabalhar com código ABAP, existem certas teclas de função no ADT que serão muito úteis.

Vamos analisar essas teclas de função:

![[02_Analyzing_ABAP_Coding_003.png]]

- **F1 (ABAP Language Help)**:
  Exibe a ajuda da linguagem ABAP para o comando atual (*statement*). Uma instrução (*statement*) é o nome dado a um comando em ABAP.
- **F2 (Quick Info / Informações do Elemento)**:
  Exibe informações detalhadas sobre o elemento onde o cursor está posicionado (tipos, assinaturas de métodos, documentação rápida).
- **F3 (Navegação para Definição)**:
  Navega até a definição do objeto onde o cursor está posicionado. Para retornar de lá para o objeto de origem, utilize a combinação de teclas **Alt + Seta para a Esquerda** (`Alt + ←`) no teclado.

---

## Exercício Prático: Criar um Projeto ABAP Cloud e Investigar Código ABAP

Neste exercício, você iniciará seu projeto ABAP Cloud e analisará alguns códigos ABAP existentes para se familiarizar com recursos básicos do ambiente de desenvolvimento ABAP.

### Pré-requisitos

Se desejar realizar os exercícios práticos conforme descritos nesta jornada de aprendizado, é necessário reservar o sistema de prática dedicado (*hands-on practice system*). Acesse o link para detalhes: [https://learning.sap.com/practice-systems/basic-abap-programming](https://learning.sap.com/practice-systems/basic-abap-programming).

Além da **ABAP Service Instance URL** (URL da Instância de Serviço ABAP), recebida durante a reserva, você precisará de uma instalação local da **Eclipse IDE** com o plug-in **ABAP Development Tools (ADT)** instalado. Siga as instruções passo a passo em: [https://developers.sap.com/tutorials/abap-install-adt.html](https://developers.sap.com/tutorials/abap-install-adt.html).

---

### Tarefa 1: Criar um Projeto ABAP Cloud

Abra o Eclipse, mude para a perspectiva ABAP e crie um projeto ABAP Cloud (*ABAP Cloud Project*).

#### Passo a Passo

1. **Abrir o Eclipse e alternar para a perspectiva ABAP:**
	1. Abra o Eclipse.
	2. Escolha **Window** → **Perspective** → **Open Perspective** → **Other...**.
	3. Na caixa de diálogo, dê um duplo clique em **ABAP**.
2. **Criar um *ABAP Cloud Project*:**
	1. Escolha **File** → **New** → **ABAP Cloud Project**.
	2. Prossiga da seguinte forma na janela *New ABAP Cloud Project* que surgir:
		- **Se você recebeu a *ABAP Service Instance URL*:**
			1. Copie e cole essa URL no campo correspondente na janela.
			2. Clique em **Next**.
		- **Se você recebeu um arquivo contendo a *Service Key*:**
			1. Selecione o link **Extract** na janela.
			2. Clique em **Import...** e selecione o arquivo com a chave de serviço (*Service Key*).
			3. Após a importação, clique em **Copy to Clipboard** para copiar a URL da instância de serviço (*Service Instance URL*).
			4. Clique em **Close**.
			5. No topo da janela, no campo **ABAP Service Instance URL:\***, cole a URL com o atalho **Ctrl + V**.
			6. Clique em **Next**.
	3. Clique em **Open Logon Page in Browser**.
	4. Você será solicitado a fazer login no sistema. Insira o usuário e a senha utilizados no cadastro do SAP Learning Hub.
	5. Ao visualizar a mensagem *"You have been successfully logged on"*, feche a janela do navegador e retorne ao Eclipse.
	6. Para finalizar a criação do projeto, clique em **Finish**.

---

### Tarefa 2: Analisar a Classe ABAP `/DMO/CL_FLIGHT_LEGACY`

Utilize algumas funções do *ABAP Development Tools* para analisar o código-fonte da classe ABAP **/DMO/CL_FLIGHT_LEGACY**.

> [!NOTE]
> Você não precisa compreender toda a lógica do código neste exercício. Em vez disso, concentre-se nas funções de navegação e visualização do ambiente de desenvolvimento.

#### Passo a Passo

1. **Adicionar o pacote `/DMO/FLIGHT` aos seus *Favorite Packages*:**
	1. Na visualização **Project Explorer**, clique com o botão direito na pasta **Favorite Packages** sob o nó do seu projeto.
	2. Escolha **Add Package...** no menu de contexto.
	3. No campo de entrada, digite **/DMO/FLIGHT** como termo de busca.
	4. Na lista de itens correspondentes, clique na entrada **/DMO/FLIGHT** e selecione **OK**.
2. **Abrir a classe ABAP `/DMO/CL_FLIGHT_LEGACY` no editor:**
	1. No menu do Eclipse, escolha **Navigate** → **Open ABAP Development Object...** ou pressione **Ctrl + Shift + A**.
	2. No campo de entrada, digite **/DMO/CL_FLIGHT** como termo de busca.
	3. Na lista de itens correspondentes, clique em **/DMO/CL_FLIGHT_LEGACY (Class)** e selecione **OK**.
3. **Abrir a aba *Properties* para exibir os dados administrativos do objeto de desenvolvimento `/DMO/CL_FLIGHT_LEGACY`:**
	1. Posicione o cursor em qualquer local dentro do código-fonte da classe **/DMO/CL_FLIGHT_LEGACY**.
	2. Na barra de abas abaixo da área do editor, navegue até a aba **Properties**.
	3. Analise os dados administrativos exibidos (por exemplo: idioma original (*Original Language*) ou a data/hora da última alteração).
4. **Localizar a classe ABAP `/DMO/CL_FLIGHT_LEGACY` na visualização *Project Explorer* à esquerda da tela:**
	1. Posicione o cursor em qualquer local dentro do código-fonte da classe **/DMO/CL_FLIGHT_LEGACY**.
	2. Na barra de ferramentas do **Project Explorer**, clique no ícone **Link with Editor**. Isso expandirá a árvore sob seu projeto ABAP destacando a classe **/DMO/CL_FLIGHT_LEGACY** como ponto final.
5. **Localizar a string `get_instance( )->get` no código-fonte da classe ABAP `/DMO/CL_FLIGHT_LEGACY`:**
	> [!NOTE]
	> Deve haver exatamente um espaço em branco entre os parênteses: `get_instance( )->get`.
	1. Posicione o cursor na primeira linha do código-fonte da classe **/DMO/CL_FLIGHT_LEGACY**.
	2. Pressione **Ctrl + F** para abrir o diálogo de busca (*Find/Replace*).
	3. No campo de entrada *Find* que aparecer, digite `get_instance( )->get` e localize o termo.
6. **Navegar para a implementação do elemento de código `get` na linha atual:**
	1. Pressione a tecla **Ctrl** e clique em **get**. No menu exibido, escolha **Navigate to Implementation**. Como alternativa, posicione o cursor na palavra **get** e pressione **F3**.
7. **Exibir informações sobre o elemento `/dmo/travel` após a palavra-chave `FROM`:**
	1. Algumas linhas abaixo, há uma linha que se inicia com `SELECT`. Sem navegar para fora da tela, posicione o cursor sobre o elemento `/dmo/travel` (após a palavra-chave `FROM`) e pressione **F2**.
8. **Exibir a Ajuda da Linguagem ABAP (*ABAP Language Help*) para a palavra-chave `SELECT`:**
	1. No início da linha de código atual, posicione o cursor sobre a palavra-chave **SELECT** e pressione **F1**.
	> [!TIP]
	> Se a visualização do *ABAP Language Help* que se abrir indicar que os resultados da consulta de busca não são suportados na versão de linguagem ABAP atual, digite **SELECT** no campo *search term* da própria aba de ajuda e pressione **Enter**. Essa busca exibirá a ajuda desejada.
	> 
	> Não há necessidade de ler ou compreender toda a documentação da instrução neste momento.
