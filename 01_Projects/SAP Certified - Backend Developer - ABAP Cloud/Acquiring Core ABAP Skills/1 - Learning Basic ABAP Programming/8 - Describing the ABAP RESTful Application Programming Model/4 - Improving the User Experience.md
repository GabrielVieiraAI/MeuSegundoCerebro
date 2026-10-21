---
title: "Melhorando a Experiência do Usuário (Improving the User Experience)"
source: "https://learning.sap.com/courses/basic-abap-programming/improving-the-user-experience_d1088a29-1b1f-430b-ac0e-c21657567482"
author:
published:
created: 2026-10-21
description: "Após concluir esta lição, você será capaz de: Organizar campos na aplicação. Fornecer ajuda de pesquisa (input help)."
tags:
  - "clippings"
---

## Objetivos

Após concluir esta lição, você será capaz de:

- Organizar campos na aplicação.
- Fornecer ajuda de pesquisa (*Input Help* / *Value Help*).

## Ajuste de Interface (UI Adjustment)

Nesta seção, você aprenderá a controlar propriedades de campos na definição de comportamento e como ajustar a UI através de uma extensão de metadados (*Metadata Extension*).

### Organizando Campos na UI

<iframe 
    src="https://cdnapisec.kaltura.com/p/1921661/embedPlaykitJs/uiconf_id/50355372?iframeembed=true&entry_id=1_ojf3t7a3" 
    width="100%" 
    height="400" 
    allowfullscreen 
    frameborder="0">
</iframe>

### Tornando Campos Somente Leitura

<iframe 
    src="https://cdnapisec.kaltura.com/p/1921661/embedPlaykitJs/uiconf_id/50355372?iframeembed=true&entry_id=1_uwhq77ox" 
    width="100%" 
    height="400" 
    allowfullscreen 
    frameborder="0">
</iframe>

Após definir campos como somente leitura (*read-only*), faz sentido reorganizá-los na interface. Você faz isso anotando os campos correspondentes da projeção, mais comumente por meio de uma **Extensão de Metadados** (*Metadata Extension*).

![[05_Arranging_the__UI_004.png]]

Extensões de metadados são objetos de repositório independentes que armazenam as anotações pertencentes a uma determinada entidade CDS. O objetivo principal é manter a legibilidade e a separação de responsabilidades: a definição da entidade CDS fica focada na estrutura e modelagem dos dados, enquanto as anotações de layout e UI ficam isoladas na extensão. Caso contrário, a definição CDS se tornaria excessivamente extensa e difícil de manter.

Para que uma entidade CDS View possa utilizar uma extensão de metadados, ela deve conter a anotação `@Metadata.allowExtensions: true`. O gerador de objetos cuida disso automaticamente, criando a extensão de metadados para a visão de projeção e adicionando a anotação correspondente na própria projeção.

![[05_Arranging_the__UI_005.png]]

Existem duas anotações de UI essenciais que você frequentemente precisará ajustar na extensão de metadados:
1. `@UI.lineItem`: Um array no qual você define o atributo `position`. Isso determina a ordem da coluna na página de lista/relatório (*Report List Page*) da aplicação.
2. `@UI.identification`: Também um array com o atributo `position`. Ele determina a ordem do campo na página do objeto individual (*Object Page*), exibida durante as operações de visualização, criação ou alteração.

### Reorganizando os Campos

<iframe 
    src="https://cdnapisec.kaltura.com/p/1921661/embedPlaykitJs/uiconf_id/50355372?iframeembed=true&entry_id=1_atrjx1h0" 
    width="100%" 
    height="400" 
    allowfullscreen 
    frameborder="0">
</iframe>

## Como Controlar Propriedades de Campos

Demonstração: [Start Demo](https://learnsap.enable-now.cloud.sap/pub/mmcp/index.html?library=library.txt&show=project!PR_E81E62C6D6EA70A4:demo)

## Ajuda de Pesquisa (Input Help)

<iframe 
    src="https://cdnapisec.kaltura.com/p/1921661/embedPlaykitJs/uiconf_id/50355372?iframeembed=true&entry_id=1_elzcv6k4" 
    width="100%" 
    height="400" 
    allowfullscreen 
    frameborder="0">
</iframe>

Nesta seção, você verá como fornecer ajuda de valores (*Value Help*) para os usuários.

## Ajustar a Interface do Usuário

Neste exercício, você explorará a ajuda de pesquisa fornecida na aplicação e ajustará a interface de usuário da aplicação gerada: diretamente editando os metadados de UI ou indiretamente ajustando o comportamento do objeto de negócio.

#### Modelo (Template):

- Nenhum (*none*)

#### Solução:

- `/LRN/S4D400_C_FLIGHT` (Projeção de Comportamento - BDEF)
- `/LRN/S4D400_C_FLIGHT` (Extensão de Metadados - MDE)

### Pré-requisitos

Você concluiu os exercícios anteriores. Você criou e populou a tabela de banco de dados **Z##FLIGHT** (onde `##` é o número do seu grupo) e gerou os objetos de desenvolvimento para um serviço OData UI.

### Tarefa 1: Analisar a Ajuda de Pesquisa (Value Help)

Verifique se a ajuda de pesquisa está disponível para o campo *Currency* na *Object Page*. Examine onde e como essa ajuda de pesquisa foi definida.

#### Passos

1. Inicie a pré-visualização do serviço OData UI.
	1. Proceda como realizado nos exercícios anteriores.
2. Abra a *Object Page* de um voo no modo de edição.
	1. Proceda como realizado nos exercícios anteriores.
3. Verifique se o recurso de ajuda de valores está ativo no campo de moeda (*Currency*).
	1. Abra o *Value Help* para o campo de moeda associado ao preço do voo.
4. Retorne ao ambiente de desenvolvimento e explore a definição técnica da ajuda de pesquisa.

### Tarefa 2: Ajustar o Comportamento

Desative as operações padrão *create* e *delete*, e defina o campo **PlaneTypeID** como somente leitura (*read-only*).

> [!NOTE] Nota
> Essas alterações devem ser aplicadas apenas ao seu serviço OData UI (camada de projeção). O objeto de negócio subjacente ainda deve suportar a criação e exclusão de voos e a alteração do tipo de aeronave.

#### Passos

1. Na **projeção** de comportamento do seu serviço, desative as operações padrão *create* e *delete*.
	1. Abra a projeção de comportamento **ZC_##FLIGHT** (onde **##** é o número do seu grupo).
	2. Comente as instruções `use create;` e `use delete;`.
		Para adicionar os marcadores de comentário, selecione as linhas de código e pressione **Ctrl + <**.
		Seu código deverá ficar assim:
		```abap
		//  use create;
		use update;
		//  use delete;
		```
2. Na **projeção** de comportamento, defina o campo **PlaneTypeID** como somente leitura.
	1. Na projeção de comportamento, adicione a instrução:
		```abap
		field ( readonly ) PlaneTypeID;
		```
		> [!NOTE] Nota
		> A posição exata da instrução não é rígida, mas recomenda-se posicioná-la antes das declarações `use...`.
3. Ative a projeção de comportamento.
	1. Pressione **Ctrl + F3** para ativar a projeção de comportamento.

### Tarefa 3: Ajustar os Metadados de UI

Oculte os campos administrativos da interface. Certifique-se de que apenas **CarrierID** e **ConnectionID** sejam exibidos como campos de seleção na página de lista. Altere a sequência de campos na *Object Page* para que **PlaneTypeID** apareça antes de **Price**.

#### Passos

1. Edite a extensão de metadados da visão de projeção **ZC_##Flight**. Remova todas as anotações de UI para os campos **LocalCreatedBy**, **LocalCreatedAt**, **LocalLastChangedBy**, **LocalLastChangedAt** e **LastChangedAt**, substituindo-as por `@UI.hidden: true`.
	1. Abra a extensão de metadados **ZC_##FLIGHT** (onde **##** é o número do seu grupo).
	2. Ajuste o código conforme abaixo:
		```cds
		@UI.hidden: true
		LocalCreatedBy;
		  
		@UI.hidden: true
		LocalCreatedAt;
		  
		@UI.hidden: true
		LocalLastChangedBy;
		  
		@UI.hidden: true
		LocalLastChangedAt;
		  
		@UI.hidden: true
		LastChangedAt;
		```
2. Remova a anotação `@UI.selectionField` de todos os elementos, exceto dos campos **CarrierID** e **ConnectionID**.
	1. Ajuste o código para os campos subsequentes:
		```cds
		@UI.identification: [ {
		  position: 30
		} ]
		@UI.lineItem: [ {
		  position: 30
		} ]
		FlightDate;
		  
		@UI.identification: [ {
		  position: 40
		} ]
		@UI.lineItem: [ {
		  position: 40
		} ]
		Price;
		  
		@UI.identification: [ {
		  position: 50
		} ]
		@UI.lineItem: [ {
		  position: 50
		} ]
		PlaneTypeID;
		```
3. Altere a posição do campo **PlaneTypeID** na *Object Page*, posicionando-o entre **FlightDate** e **Price**.
	> [!TIP] Dica
	> A posição de exibição na *Object Page* é determinada pela anotação `@UI.identification`.
	1. Altere o valor do atributo `position` da anotação `@UI.identification` no elemento **PlaneTypeID**, escolhendo um valor intermediário entre os valores de **FlightDate** (30) e **Price** (40).
	2. Ajuste o código para:
		```cds
		@UI.identification: [ {
		  position: 35
		} ]
		@UI.lineItem: [ {
		  position: 50
		} ]
		PlaneTypeID;
		```
4. Ative a extensão de metadados.
	1. Pressione **Ctrl + F3** para ativar a extensão de metadados.

### Tarefa 4: Verificar o Resultado

Reinicie a pré-visualização do serviço OData UI e valide as modificações na interface da aplicação.

#### Passos

1. Reinicie a pré-visualização do serviço OData UI.
	1. Feche a janela ou aba do navegador com o preview anterior.
	2. Abra o *Service Binding* **ZUI_##FLIGHT_O4**. Na lista à direita, selecione a entidade **Flight** e clique em *Preview...*.
2. Na página de lista (*Report List Page*), verifique que os botões *Create* e *Delete* foram removidos.
	1. Proceda conforme realizado nos testes anteriores.
3. Confirme que nenhum campo administrativo é exibido na tabela da página de lista.
	1. Proceda conforme realizado nos testes anteriores.
4. Verifique que — além do campo *Editing Status* — apenas dois campos de seleção estão disponíveis no topo da página (*Carrier ID* e *Connection ID*). Teste sua funcionalidade.
	> [!TIP] Dica
	> Os campos de seleção suportam múltiplos valores e intervalos (*ranges*).
	1. Insira um valor no campo de seleção *Airline ID* (por exemplo: **LH**) e clique em *Go*.
	2. Teste outros filtros.
5. Para qualquer registro, navegue para a *Object Page*. Verifique que o botão *Delete* foi removido.
	1. Proceda conforme realizado nos testes anteriores.
6. Confirme que os campos administrativos não estão visíveis na *Object Page*.
	1. Proceda conforme realizado nos testes anteriores.
7. Verifique que o campo *Plane Type* agora é exibido após o campo *Flight Date* e antes do campo *Flight Price*.
	1. Proceda conforme realizado nos testes anteriores.
8. Mude para o modo de edição e certifique-se de que o campo *Plane Type* está bloqueado como somente leitura (*read-only*).
	1. Proceda conforme realizado nos testes anteriores.
