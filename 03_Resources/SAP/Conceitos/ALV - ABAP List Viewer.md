---
aliases: ["ALV", "ABAP List Viewer", "SAP List Viewer", "O que é ALV"]
tags: [sap, abap, alv, relatorio, dynpro]
type: "concept"
status: "draft"
summary: "Ferramenta padrão do SAP para exibir dados tabulares em relatórios ABAP, com ordenação, filtros, totais e exportação prontos para o usuário."
---
# ALV - ABAP List Viewer

**Relacionado:** [[CDS - Core Data Services|CDS]], [[RAP - ABAP RESTful Application Programming Model|RAP]], [[Roteiro de Estudos SAP]]

## O que é o ALV?

O **ALV (ABAP List Viewer)**, também chamado de **SAP List Viewer**, é a ferramenta padrão do SAP para exibir dados em formato de tabela em relatórios e telas ABAP. O desenvolvedor entrega uma tabela interna e a descrição das colunas, e o ALV fornece automaticamente a interface com recursos que o usuário já conhece.

Em termos práticos, imagine o ALV como uma **planilha pronta**: o programa só preenche os dados, e o usuário ganha de graça ordenação, filtros, totais, escolha de colunas e exportação para Excel, sem que o desenvolvedor precise programar cada um desses recursos.

## Recursos que o ALV oferece

- Ordenação por uma ou mais colunas.
- Filtros por coluna.
- Totais e subtotais.
- Escolha, ocultação e reordenação de colunas.
- Layouts (variantes) salvos por usuário.
- Exportação para planilha (Excel), PDF e arquivo local.
- Impressão e visualização de impressão.
- Botões e funções customizadas na barra de ferramentas.
- Eventos de usuário, como duplo clique em linha ou clique em hyperlink.
- Edição direta de células, quando habilitada.

## Tipos de ALV

| Tipo | Como funciona | Observação |
| :--- | :--- | :--- |
| **ALV em lista (clássico)** | Funções `REUSE_ALV_LIST_DISPLAY` | Exibição em formato de lista simples. Considerado legado. |
| **ALV em grid (função)** | Função `REUSE_ALV_GRID_DISPLAY` | Mais usado no ABAP antigo. Exibe em grade, tela cheia. |
| **ALV orientado a objetos** | Classe `CL_GUI_ALV_GRID` | Exibe em um container e permite combinar o ALV com outros controles na tela. |
| **ALV com `CL_SALV_TABLE`** | Classe `CL_SALV_TABLE` | Modelo simplificado e recomendado para a maioria dos relatórios. |
| **ALV hierárquico** | Funções ou `CL_SALV_HIERSEQ_TABLE` | Exibe dados em cabeçalho e itens. |
| **ALV em árvore** | `CL_SALV_TREE` | Exibe dados em formato de árvore, com nós expansíveis. |
| **IDA (Integrated Data Access)** | Classe `CL_SALV_GUI_TABLE_IDA` | Lê os dados direto da CDS ou tabela no banco, com paginação, filtros e ordenação feitos no banco, sem carregar tudo na tabela interna. |

## Principais componentes

| Componente | Para que serve |
| :--- | :--- |
| **Tabela de saída** | Tabela interna com os dados que serão exibidos. |
| **Field catalog** | Descreve cada coluna: título, tamanho, tipo, formatação, se é somável. |
| **Layout** | Opções gerais de exibição, como zebra, largura otimizada e seleção de linhas. |
| **Eventos** | Respostas a ações do usuário, como duplo clique, clique em botão ou edição. |
| **Variante de layout** | Configuração de colunas, filtros e ordenação salva pelo usuário. |

## Exemplo mínimo com `CL_SALV_TABLE`

```abap
DATA: lt_flights TYPE STANDARD TABLE OF sflight,
      lo_alv     TYPE REF TO cl_salv_table.

SELECT * FROM sflight
  INTO TABLE @lt_flights
  UP TO 100 ROWS.

TRY.
    cl_salv_table=>factory(
      IMPORTING r_salv_table = lo_alv
      CHANGING  t_table      = lt_flights ).

    lo_alv->get_functions( )->set_all( abap_true ).
    lo_alv->get_columns( )->set_optimize( abap_true ).
    lo_alv->display( ).

  CATCH cx_salv_msg INTO DATA(lx_msg).
    MESSAGE lx_msg->get_text( ) TYPE 'E'.
ENDTRY.
```

## ALV e CDS

Com o ALV tradicional, o programa lê os dados para uma tabela interna e depois os exibe, o que pode ser pesado para grandes volumes. Combinado com o [[CDS - Core Data Services|Code Pushdown]], o **ALV IDA** delega para o banco a leitura, a ordenação, os filtros e a paginação, exibindo só o que o usuário precisa.

## ALV vs. Fiori

O ALV é uma tecnologia do **SAP GUI**: roda dentro de transações e programas ABAP clássicos. Em aplicações modernas baseadas em [[RAP - ABAP RESTful Application Programming Model|RAP]] e Fiori Elements, a tabela equivalente é a do **List Report**, gerada automaticamente a partir das anotações da CDS. Ainda assim, o ALV segue muito presente em relatórios de manutenção, consultas rápidas e sistemas legados.
