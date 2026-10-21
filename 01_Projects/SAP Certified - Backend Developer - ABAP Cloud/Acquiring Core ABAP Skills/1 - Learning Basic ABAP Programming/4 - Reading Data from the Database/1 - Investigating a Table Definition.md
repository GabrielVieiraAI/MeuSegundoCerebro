---
title: "Investigando a Definição de uma Tabela"
source: "https://learning.sap.com/courses/basic-abap-programming/investigating-a-table-definition_f5b25669-42e0-437a-9cbc-90a655e746d8"
author:
published:
created: 2026-10-21
description: "Após concluir esta lição, você será capaz de: Investigar a definição de uma tabela."
tags:
  - "clippings"
---

## Objetivo

Após concluir esta lição, você será capaz de investigar a definição de uma tabela.

## Definições de Tabelas de Banco de Dados

<iframe 
    src="https://cdnapisec.kaltura.com/p/1921661/embedPlaykitJs/uiconf_id/50355372?iframeembed=true&entry_id=1_rg4l8f02" 
    width="100%" 
    height="400" 
    allowfullscreen 
    frameborder="0">
</iframe>

Todo sistema ABAP é executado em um sistema de gerenciamento de banco de dados relacional (SGBD / DBMS). Originalmente, o ABAP suportava diferentes sistemas de gerenciamento de banco de dados de múltiplos fornecedores. Por essa razão, a definição de objetos de banco de dados, como tabelas e visões (views), é feita de forma independente de banco de dados.

> [!NOTE] Nota
> Versões mais recentes do ABAP suportam apenas o SAP HANA como banco de dados. O ABAP Environment no SAP BTP é executado sempre sobre o SAP HANA.

![[11_analyze_table_001.png]]

Em um banco de dados relacional, as informações são armazenadas em tabelas bidimensionais, nas quais cada linha representa um registro de dados cujos conteúdos são divididos em colunas. O banco de dados é chamado de relacional porque também existem relacionamentos entre as tabelas. Por exemplo, a tabela na imagem contém um código de companhia aérea. Na tabela de banco de dados, existiria um relacionamento com outra tabela contendo a informação de que AA representa a American Airlines, JL representa a Japanese Airlines, LH representa a Lufthansa, e assim por diante.

Uma sequência de colunas no início de cada tabela de banco de dados forma a sua chave primária (*key*). A chave é uma combinação de valores que assegura que cada linha na tabela possa ser identificada de forma exclusiva e unívoca.

Nos sistemas SAP, as definições de tabelas de banco de dados são objetos de desenvolvimento e, como tais, são independentes de mandante (*cross-client*). No entanto, a grande maioria das tabelas armazena dados de negócios, que são específicos por mandante (*client-specific*). Para manter os dados separados, as tabelas específicas de mandante possuem um campo de mandante (frequentemente chamado de `CLIENT` ou `MANDT`) como seu primeiro campo-chave. O banco de dados acessa as instruções por meio do ABAP SQL para garantir que cada comando manipule exclusivamente os dados do mandante atual.

### Definições de Tabelas no ADT

O ADT fornece um editor dedicado para definições de tabelas de banco de dados baseadas em código.

### Pré-visualização de Dados para Tabelas de Banco de Dados (Data Preview)

<iframe 
    src="https://cdnapisec.kaltura.com/p/1921661/embedPlaykitJs/uiconf_id/50355372?iframeembed=true&entry_id=1_urgn6id2" 
    width="100%" 
    height="400" 
    allowfullscreen 
    frameborder="0">
</iframe>

Você pode utilizar a ferramenta **Data Preview** para visualizar e analisar o conteúdo de uma tabela de banco de dados:

1. Clique com o botão direito em qualquer ponto da definição da tabela e escolha **Open With** → **Data Preview**.
2. Alternativamente, posicione o cursor em qualquer local da definição da tabela de banco de dados e pressione **F8**.

A ferramenta exibirá os registros armazenados na tabela de banco de dados.

## Como Analisar uma Tabela de Banco de Dados

Demonstração: [Iniciar Demonstração](https://learnsap.enable-now.cloud.sap/pub/mmcp/index.html?library=library.txt&show=project!PR_44B67792CC5AACB1:demo)
