---
aliases: ["ALV", "ABAP List Viewer", "SAP List Viewer"]
tags: [sap, abap, alv, relatorio, dynpro]
type: "concept"
status: "active"
summary: "Ferramenta padrão do SAP GUI para exibição de dados tabulares em ABAP com ordenação, filtros e exportação."
---
# ALV - ABAP List Viewer

**Relacionado:** [[CDS - Core Data Services|CDS]], [[RAP - ABAP RESTful Application Programming Model|RAP]], [[Roteiro de Estudos SAP]]

O **ALV (ABAP List Viewer)** é a ferramenta padrão do SAP GUI (*Graphical User Interface*, interface gráfica do SAP) para renderização de dados tabulares em relatórios e telas ABAP. A partir de uma tabela interna fornecida pelo desenvolvedor, o componente gera uma grade com recursos nativos de navegação.

---
## Árvore de Decisão: Qual Abordagem Utilizar?

| Abordagem                            | Objeto Principal                                    | Indicação de Uso                                                                                                                    |                                                                                              |
| :----------------------------------- | :-------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| **SALV (Padrão Moderno)**            | `CL_SALV_TABLE`                                     | Relatórios de exibição simples (somente leitura). Gera metadados automaticamente e exige o menor volume de código.                  |                                                                                              |
| **GUI ALV Grid**                     | `CL_GUI_ALV_GRID`                                   | Relatórios que exigem **edição direta de células** pelo usuário ou controle posicionado dentro de telas Dynpro (*Dynamic Program*). |                                                                                              |
| **ALV IDA (Integrated Data Access)** | `CL_SALV_GUI_TABLE_IDA`                             | Relatórios sobre SAP HANA ou [[CDS - Core Data Services                                                                             | CDS Views]] com grande volume de dados. Delega paginação, filtros e agregações para o banco. |
| **Funções Reutilizáveis (Legado)**   | `REUSE_ALV_GRID_DISPLAY` / `REUSE_ALV_LIST_DISPLAY` | Manutenção de programas legados. **Não utilizar em novos desenvolvimentos.**                                                        |                                                                                              |

---
## Componentes Essenciais

- **Tabela de Saída:** Tabela interna que contém os registros a serem renderizados.
- **Field Catalog (Catálogo de Campos):** Estrutura que define as propriedades técnicas de cada coluna (título, tipo, largura, alinhamento e se é editável). *Na `CL_SALV_TABLE`, é derivado automaticamente do tipo de dados.*
- **Layout:** Estrutura de configuração visual do grid (linhas alternadas/zebra, seleção de linha única ou múltipla, dimensionamento otimizado).
- **Eventos:** Tratamento de ações do usuário disparadas na tela (duplo clique na linha, botões personalizados na barra de ferramentas).

---

## Exemplo Mínimo: `CL_SALV_TABLE`

```abap
DATA: lt_flights TYPE STANDARD TABLE OF sflight,
      lo_alv     TYPE REF TO cl_salv_table.

SELECT * FROM sflight
  INTO TABLE @lt_flights
  UP TO 100 ROWS.

TRY.
    " Instanciação e vinculo com a tabela interna
    cl_salv_table=>factory(
      IMPORTING r_salv_table = lo_alv
      CHANGING  t_table      = lt_flights ).

    " Habilita a barra de ferramentas padrão (filtros, ordenação, exportação)
    lo_alv->get_functions( )->set_all( abap_true ).

    " Ajusta largura das colunas ao conteúdo
    lo_alv->get_columns( )->set_optimize( abap_true ).

    " Renderiza o grid na tela
    lo_alv->display( ).

  CATCH cx_salv_msg INTO DATA(lx_msg).
    MESSAGE lx_msg->get_text( ) TYPE 'E'.
ENDTRY.
```

---

## Limitações e Gotchas

- **`CL_SALV_TABLE` não suporta edição nativa:** Se o requisito de negócio exige que o usuário edite campos diretamente na tabela, a classe indicada é a `CL_GUI_ALV_GRID`. O `CL_SALV_TABLE` foi desenhado estritamente para relatórios de consulta (*read-only*).
- **Escopo de Tecnologia:** O ALV é restrito ao SAP GUI. Em arquiteturas modernas com [[RAP - ABAP RESTful Application Programming Model|RAP]] e SAP Fiori, a exibição tabular equivalente é feita via **List Report**, gerada pelas anotações da CDS.
