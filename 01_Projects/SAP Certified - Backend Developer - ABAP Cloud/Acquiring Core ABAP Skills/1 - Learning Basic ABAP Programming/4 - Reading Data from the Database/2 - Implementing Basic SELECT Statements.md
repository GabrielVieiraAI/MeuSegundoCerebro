---
title: "Implementando Instruções Básicas de SELECT"
source: "https://learning.sap.com/courses/basic-abap-programming/implementing-basic-select-statements_a6d4effa-f6b0-4ef8-96c8-b79baa2da157"
author:
published:
created: 2026-10-21
description: "Após concluir esta lição, você será capaz de: Descrever recursos básicos do ABAP SQL. Ler valores individuais do banco de dados."
tags:
  - "clippings"
---

## Objetivos

Após concluir esta lição, você será capaz de:

- Descrever recursos básicos do ABAP SQL.
- Ler valores individuais do banco de dados.

## Sintaxe Básica do ABAP SQL

### Structured Query Language (SQL)

![[12_-Basic_ABAP_SQL_001.png]]

Todos os sistemas de banco de dados relacionais utilizam uma variante de Structured Query Language (SQL) para permitir a manipulação de dados. O padrão SQL é composto por três componentes principais:

#### Data Manipulation Language (DML)
A DML engloba as instruções necessárias para trabalhar com informações em tabelas de banco de dados:
- `INSERT`: para adicionar novos registros.
- `SELECT`: para ler dados.
- `UPDATE`: para alterar registros existentes.
- `DELETE`: para excluir conteúdos de tabelas.
Essas instruções são refletidas no ABAP na forma do **ABAP SQL**.

#### Data Definition Language (DDL)
A DDL fornece comandos que permitem criar e excluir tabelas de banco de dados e outros artefatos, como esquemas, índices de tabela e visões (*views*). Em um sistema SAP, essas tarefas são executadas por meio de editores dedicados no ADT, e não diretamente por programas ABAP (como vimos anteriormente no editor de definições de tabelas).

#### Data Control Language (DCL)
A DCL é utilizada em SQL para restringir o acesso a dados no banco de dados para usuários específicos. Ela não é utilizada em sua forma clássica no ABAP, pois os usuários a nível de banco de dados não correspondem de forma unívoca aos usuários finais da aplicação. Consequentemente, o ABAP possui seu próprio conceito integrado de autorizações.

---

### Arquitetura do ABAP SQL

![[12_-Basic_ABAP_SQL_002.png]]

No passado, os sistemas SAP precisavam suportar diversas plataformas de banco de dados, e cada plataforma possuía uma implementação ligeiramente diferente do padrão SQL. Isso exigia comandos específicos para cada fornecedor. Para evitar que o código ABAP dependesse de um banco de dados específico, a SAP criou o **ABAP SQL** (originalmente chamado de **Open SQL**).

> [!NOTE] Nota
> A mudança de nome de Open SQL para ABAP SQL também reflete que, a partir da versão 7.53, o ABAP passou a suportar apenas o SAP HANA como sistema de gerenciamento de banco de dados (SGBD).

O ABAP SQL é um conjunto abstrato de comandos SQL implementados no nível ABAP e totalmente integrados à linguagem ABAP. Em tempo de execução, o ABAP SQL é traduzido para a variante de SQL compreendida pelo banco de dados subjacente. Essa variante específica é chamada de **Native SQL**, diferenciando-se do ABAP SQL.

A tradução do ABAP SQL para Native SQL ocorre na **Interface de Banco de Dados** (*Database Interface*), um componente do sistema ABAP formado por uma parte geral e uma biblioteca específica para o banco de dados.

Mesmo com as versões mais recentes do ABAP suportando exclusivamente o SAP HANA, a SAP manteve o conceito do ABAP SQL e da interface de banco de dados pelas seguintes razões:

- **Compatibilidade de Arquitetura:** O ABAP SQL e a interface de banco de dados são partes fundamentais e consolidadas da arquitetura do sistema.
- **Compatibilidade de Código:** O código ABAP SQL de sistemas legados (incluindo desenvolvimentos customizados de clientes) deve continuar funcionando perfeitamente nos ambientes modernos baseados exclusivamente em SAP HANA.
- **Tarefas da Interface de Banco de Dados:** A interface de banco de dados não apenas traduz instruções, mas também assume responsabilidades específicas do ABAP, como a **gestão automática de mandantes** (*client handling*).

---

## Leitura de Registro Único do Banco de Dados

### A Instrução SELECT no ABAP

![[13_-_Read_single_record_001.png]]

Para ler dados do banco de dados, utiliza-se a instrução `SELECT`.

Ao escrever um comando `SELECT` em ABAP SQL, a verificação de sintaxe compara a instrução com as definições das tabelas e visões. Se você tentar acessar tabelas, visões ou campos que não existem, ocorrerá um erro de sintaxe.

A sintaxe básica da instrução `SELECT` é dividida em várias seções denominadas cláusulas:

- **`FROM`**: Especifica a fonte de dados que será lida (uma tabela de banco de dados ou uma view). Técnicas especiais de SQL permitem combinar dados de múltiplas fontes na mesma instrução `SELECT`.
- **`FIELDS`**: Lista as colunas da tabela de banco de dados que devem ser lidas. As colunas devem ser separadas por vírgulas. Para ler a linha inteira da tabela, pode-se usar `FIELDS *`, embora isso cause muito mais esforço de processamento ao banco de dados do que selecionar apenas as colunas necessárias.
- **`WHERE`**: Especifica uma condição que define quais linhas da tabela serão lidas (por exemplo, `WHERE carrier_id = 'LH'`). Várias condições podem ser vinculadas com os operadores `AND` e `OR`, ou negadas com `NOT`. A cláusula `WHERE` é a única opcional; no entanto, sem ela, serão lidos todos os dados da tabela (ou todos os dados pertencentes ao mandante de logon do usuário). Comandos `SELECT` sem `WHERE` podem causar sérios problemas de performance e devem ser evitados.
- **`INTO`**: Especifica a variável (ou variáveis) no programa ABAP onde os dados lidos serão alocados. Normalmente é uma estrutura ou tabela interna, e deve possuir a mesma sequência de tipos que a lista de colunas na cláusula `FIELDS`.

> [!NOTE] Nota
> É possível encontrar outras formas mais antigas de sintaxe SQL no ABAP, mantidas por razões de compatibilidade. Recomenda-se utilizar a sintaxe moderna (com vírgulas e escape `@`), pois ela oferece muito mais recursos e suporte a funções avançadas.

---

### Exemplo 1: Leitura de Campo Único de Registro Único

![[13_-_Read_single_record_002.png]]

O exemplo ilustra uma instrução `SELECT` que lê um único valor do banco de dados:

- A cláusula `FROM` define a leitura a partir da tabela `/DMO/CONNECTION`.
- A opção `SINGLE`, logo após a palavra-chave `SELECT`, indica que apenas uma linha (um único registro) será lida.
- Essa linha é filtrada na cláusula `WHERE` fornecendo os valores dos campos-chave `carrier_id` e `connection_id`. (A interface de banco de dados adiciona automaticamente o filtro para o campo-chave de mandante `client`).
- A cláusula `FIELDS` lista apenas uma coluna: `airport_from_id`.
- A cláusula `INTO` direciona o dado lido para a variável `@airport_from_id`.

> [!NOTE] Nota: O Símbolo de Escape `@`
> O caractere arroba (`@`) identifica que `airport_from_id` é o nome de um objeto de dados (variável ou constante) do programa ABAP, e não um campo da tabela de banco de dados. O uso de `@` é obrigatório para variáveis e constantes dentro de instruções modernas do ABAP SQL para evitar ambiguidades caso uma variável do programa tenha o mesmo nome de uma coluna da tabela.

---

### Exemplo 2: Leitura de Múltiplos Campos de Registro Único

![[13_-_Read_single_record_003.png]]

Neste exemplo, a instrução `SELECT` lê dois valores do mesmo registro:

- A cláusula `FIELDS` lista duas colunas separadas por vírgula: `airport_from_id, airport_to_id`.
- Para corresponder a essa lista, a cláusula `INTO` especifica as variáveis de destino separadas por vírgula e envolvidas por parênteses: `( @airport_from_id, @airport_to_id )`.

---

### Exemplo 3: Resultado Vazio e o Campo `sy-subrc`

![[13_-_Read_single_record_004.png]]

Ao implementar um comando `SELECT`, deve-se sempre prever a possibilidade de não haver resultados — seja porque a tabela está vazia ou porque nenhum registro atende às condições do `WHERE`.

O ABAP SQL utiliza o campo de sistema **`sy-subrc`** (tipo inteiro) para sinalizar o status de execução:
- **`sy-subrc = 0`**: Sucesso na execução (registro encontrado).
- **`sy-subrc = 4`**: O banco de dados retornou um resultado vazio (nenhum registro localizado).

> [!WARNING] Atenção ao Comportamento da Cláusula INTO em Falhas
> Se o banco de dados retornar um resultado vazio (`sy-subrc = 4`), o ABAP SQL **NÃO altera nem inicializa** a variável de destino especificada no `INTO`! Ela preservará exatamente o valor que possuía antes da execução da instrução.

![[13_-_Read_single_record_005.png]]

Recomenda-se avaliar o conteúdo do campo de sistema `sy-subrc` imediatamente após cada comando `SELECT`.

---

## Faça Você Mesmo: Exemplos de SELECT

1. Como no primeiro exercício deste curso, crie uma nova classe global que implemente a interface `IF_OO_ADT_CLASSRUN`.
2. Copie o seguinte trecho de código para a parte de implementação do método `if_oo_adt_classrun~main( )`:
   ```abap
   DATA airport_from_id TYPE /dmo/airport_from_id.
   DATA airport_to_id   TYPE /dmo/airport_to_id.
   DATA airports TYPE TABLE OF /dmo/airport_from_id.

   * Example 1: Single field from Single Record
   **********************************************************************
   SELECT SINGLE
     FROM /dmo/connection
     FIELDS airport_from_id
     WHERE carrier_id    = 'LH'
       AND connection_id = '0400'
     INTO @airport_from_id.

   out->write( `----------`  ).
   out->write( `Example 1:`  ).
   out->write( |Flight LH 400 departs from { airport_from_id }.| ).

   * Example 2: Multiple Fields from Single Record
   **********************************************************************
   SELECT SINGLE
     FROM /dmo/connection
     FIELDS airport_from_id, airport_to_id
     WHERE carrier_id    = 'LH'
       AND connection_id = '0400'
     INTO ( @airport_from_id, @airport_to_id ).

   out->write( `----------`  ).
   out->write( `Example 2:`  ).
   out->write( |Flight LH 400 flies from { airport_from_id } to { airport_to_id }| ).

   * Example 3: Empty Result and sy-subrc
   **********************************************************************
   SELECT SINGLE
     FROM /dmo/connection
     FIELDS airport_from_id
     WHERE carrier_id    = 'XX'
       AND connection_id = '1234'
     INTO @airport_from_id.

   IF sy-subrc = 0.
     out->write( `----------`  ).
     out->write( `Example 3:`  ).
     out->write( |Flight XX 1234 departs from { airport_from_id }.| ).
   ELSE.
     out->write( `----------`  ).
     out->write( `Example 3:`  ).
     out->write( |There is no flight XX 1234, but still airport_from_id = { airport_from_id }!| ).
   ENDIF.
   ```
3. Pressione **Ctrl + F3** para ativar a classe e **F9** para executá-la como console app.
4. Analise a saída do console. Depure o programa e faça testes com o código-fonte para se familiarizar com os conceitos.

---

## Exercício Prático: Ler Dados de uma Tabela de Banco de Dados

Neste exercício, você estenderá sua classe local com atributos para o aeroporto de partida e o aeroporto de destino, lendo os valores desses atributos a partir de uma tabela de banco de dados.

#### Modelo (Template):
- `/LRN/CL_S4D400_CLS_CONSTRUCTOR` (Classe global)

#### Solução (Solution):
- `/LRN/CL_S4D400_DBS_SELECT` (Classe global)

### Tarefa 1: Copiar Modelo

Copie a classe modelo. Alternativamente, continue a partir da sua solução do exercício anterior.

#### Passos

1. Copie a classe **/LRN/CL_S4D400_CLS_CONSTRUCTOR** para uma classe em seu próprio pacote (nome sugerido: **ZCL_##_SELECT**, onde `##` representa o número do seu grupo).
   1. Abra o código-fonte da classe global **/LRN/CL_S4D400_CLS_CONSTRUCTOR**.
   2. Vincule a visão *Project Explorer* ao editor (botão *Link with Editor*).
   3. No *Project Explorer*, clique com o botão direito na classe **/LRN/CL_S4D400_CLS_CONSTRUCTOR** e selecione **Duplicate...**.
   4. Informe o nome do seu pacote no campo *Package* e o nome **ZCL_##_SELECT** no campo *Name*.
   5. Ajuste a descrição, selecione *Next*, confirme a solicitação de transporte e clique em *Finish*.

---

### Tarefa 2: Declarar Atributos Adicionais

Estenda a classe local **lcl_connection** com os atributos de instância privados **airport_from_id** e **airport_to_id**. Adicione a exibição desses novos atributos na implementação do método **get_output**.

> [!NOTE] Nota
> Os novos atributos ainda não estão preenchidos. Para alimentá-los, adicionaremos um comando SELECT ao construtor em uma das tarefas seguintes.

#### Passos

1. Alterne para a classe local **lcl_connection** (aba *Local Types*).
2. Adicione os seguintes atributos **privados** à definição da classe:

   | Nome do Atributo | Escopo | Tipo de Dados |
   | :--- | :--- | :--- |
   | **airport_from_id** | Instância | `/DMO/AIRPORT_FROM_ID` |
   | **airport_to_id** | Instância | `/DMO/AIRPORT_TO_ID` |

   Ajuste o código na `PRIVATE SECTION`:
   ```abap
   PRIVATE SECTION.
     DATA carrier_id      TYPE /dmo/carrier_id.
     DATA connection_id   TYPE /dmo/connection_id.
     DATA airport_from_id TYPE /dmo/airport_from_id.
     DATA airport_to_id   TYPE /dmo/airport_to_id.
   ENDCLASS.
   ```
3. Estenda a implementação do método **get_output**, adicionando os novos atributos aos templates de string:
   ```abap
   APPEND |--------------------------------| TO r_output.
   APPEND |Carrier:     { carrier_id      }| TO r_output.
   APPEND |Connection:  { connection_id   }| TO r_output.
   APPEND |Departure:   { airport_from_id }| TO r_output.
   APPEND |Destination: { airport_to_id   }| TO r_output.
   ```
4. Ative a classe (**Ctrl + F3**), execute-a (**F9**) e analise a saída no console.

---

### Tarefa 3: Analisar a Tabela de Banco de Dados

Analise a definição da tabela de banco de dados **/DMO/CONNECTION**.

#### Passos

1. Abra o objeto de desenvolvimento que contém a definição da tabela **/DMO/CONNECTION**:
   1. Na barra de ferramentas do Eclipse, escolha *Open ABAP Development Object* ou pressione **Ctrl + Shift + A**.
   2. Digite `/dmo/con` no campo de busca.
   3. Na lista de itens encontrados, selecione `/DMO/CONNECTION (Database Table)` e clique em *OK*.
2. Abra o *Element Information* (**F2**) para a tabela `/DMO/CONNECTION`:
   1. Clique em `/dmo/connection` após a palavra-chave `define table` e pressione **F2** para exibir as informações dos elementos.

---

### Tarefa 4: Ler Dados do Banco de Dados

No método **constructor** da classe local **lcl_connection**, implemente um comando `SELECT` que leia os valores para os novos atributos da tabela de banco de dados **/DMO/CONNECTION**.

#### Passos

1. Retorne à classe local **lcl_connection** na sua classe global (aba *Local Types*).
2. Navegue até a implementação do método **constructor**.
3. Após a instrução `ENDIF.` da validação de consistência, adicione um comando `SELECT` para ler um único registro da tabela `/DMO/CONNECTION`:
   ```abap
   IF i_carrier_id IS INITIAL OR i_connection_id IS INITIAL.
     RAISE EXCEPTION TYPE cx_abap_invalid_value.
   ENDIF.

   SELECT SINGLE
     FROM /dmo/connection
   ```
4. Implemente a cláusula `FIELDS` lendo os campos **airport_from_id** e **airport_to_id** (dica: use **Ctrl + Space** para autocompletar os campos):
   ```abap
     FIELDS airport_from_id, airport_to_id
   ```
5. Implemente a condição `WHERE`, restringindo todos os campos-chave da tabela (exceto o campo de mandante) com os parâmetros de importação **i_carrier_id** e **i_connection_id** (lembre-se de prefixar as variáveis com `@`):
   ```abap
     WHERE carrier_id    = @i_carrier_id
       AND connection_id = @i_connection_id
   ```
6. Implemente a cláusula `INTO`, armazenando o resultado nos atributos correspondentes da classe (também prefixados com `@`):
   ```abap
     INTO ( @airport_from_id, @airport_to_id ).
   ```
   A instrução `SELECT` completa deve ficar assim:
   ```abap
   SELECT SINGLE
     FROM /dmo/connection
     FIELDS airport_from_id, airport_to_id
     WHERE carrier_id    = @i_carrier_id
       AND connection_id = @i_connection_id
     INTO ( @airport_from_id, @airport_to_id ).
   ```
7. Implemente o tratamento de erro após o `SELECT`. Verifique o campo de sistema **sy-subrc**. Se for diferente de zero, dispare a exceção **CX_ABAP_INVALID_VALUE**:
   ```abap
   IF sy-subrc <> 0.
     RAISE EXCEPTION TYPE cx_abap_invalid_value.
   ENDIF.
   ```
8. Ative a classe (**Ctrl + F3**) e execute-a (**F9**). Verifique se a saída no console agora exibe os aeroportos de partida e destino preenchidos com os dados lidos do banco de dados.
