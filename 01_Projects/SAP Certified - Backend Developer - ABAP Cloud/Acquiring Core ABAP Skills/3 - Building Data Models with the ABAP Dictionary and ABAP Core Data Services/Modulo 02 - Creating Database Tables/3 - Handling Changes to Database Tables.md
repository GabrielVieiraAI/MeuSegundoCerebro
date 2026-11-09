---
tipo: clippings
title: "Handling Changes to Database Tables"
source: "https://learning.sap.com/courses/building-data-models-with-the-abap-dictionary-and-abap-core-data-services/handling-changes-to-database-tables_d6d6d97a-979e-4efe-b5c3-f3e3d85332fb"
created: 2026-11-03
tags:
  - sap
  - abap
  - abap-cloud
  - ddic
  - database-tables
  - table-conversion
  - alter-table
  - adt
---
**Roteiro de Estudos Relacionado:** [[Roteiro de Estudos SAP]]

# Objetivos de Aprendizado

Após concluir esta lição, você será capaz de:
- Descrever o processo de ajuste de tabelas de banco de dados no **ABAP Dictionary**.
- Executar e analisar alterações diretas em definições de tabelas.
- Explicar as etapas, os impactos e os riscos do processo de **Conversão de Tabela (*Table Conversion*)**.
- Identificar e ajustar alterações indiretas decorrentes da modificação de domínios ou elementos de dados dependentes.

---

## 1. Ajuste de Tabelas de Banco de Dados: Mudanças Diretas vs. Indiretas

Ao modificar um objeto de desenvolvimento no ABAP Dictionary, o sistema precisa sincronizar a **definição lógica no dicionário** com a **estrutura física real da tabela no banco de dados**.

![[01AdjustingChangesOnDB_001.png]]

As alterações dividem-se em duas categorias:
1. **Alterações Diretas (*Direct Changes*):** Você edita diretamente a definição da tabela no editor do ADT (por exemplo: adiciona um novo campo, remove um campo ou altera anotações).
2. **Alterações Indiretas (*Indirect Changes*):** Você altera um objeto que é utilizado pela tabela (por exemplo: altera o comprimento ou o tipo de um domínio, ou modifica uma estrutura de inclusão). Como a tabela depende desse objeto, ela se torna tecnicamente inconsistente até ser reativada e ajustada.

### O Mecanismo de Ajuste na Ativação
Ao ativar a alteração no ADT, o ABAP Dictionary compara o estado ativo anterior com a nova definição. Três cenários operacionais podem ocorrer:

| Cenário de Ajuste | Ação no Banco de Dados | Impacto na Tabela / Dados |
| :--- | :--- | :--- |
| **1. Ativação Direta (Sem alteração no banco)** | Nenhuma alteração DDL física no banco (ex: mudança apenas de rótulo de texto ou anotação semântica). | Instantâneo e sem risco. |
| **2. Ajuste via Comando SQL (`ALTER TABLE`)** | O banco suporta a operação nativamente (ex: adicionar um novo campo no final da tabela). | Rápido, sem necessidade de cópia de dados. |
| **3. Conversão de Tabela (*Table Conversion*)** | O banco não pode ajustar a tabela diretamente (ex: alteração de chave primária, mudança drástica de tipo de dados ou exclusão de colunas). | **Crítico:** Cria tabela temporária, copia todos os dados, recria a tabela e devolve os dados. |

---

## 2. Executando e Analisando Alterações Diretas

<iframe 
    src="https://cdnapisec.kaltura.com/p/1921661/embedPlaykitJs/uiconf_id/50355372?iframeembed=true&entry_id=1_4v368qyw" 
    width="100%" 
    height="400" 
    allowfullscreen 
    frameborder="0">
</iframe>

![[02DirectChangeToDBTable_001.png]]

Quando você adiciona um novo campo à tabela e ativa o objeto:
1. O ADT envia a definição ao kernel ABAP.
2. O compilador gera a instrução SQL DDL `ALTER TABLE zemployee ADD department VARCHAR(30) ...`.
3. O comando é executado diretamente no banco de dados e a tabela é atualizada com sucesso.

![[02DirectChangeToDBTable_002.png]]

![[02DirectChangeToDBTable_003.png]]

Se a alteração for mais complexa, o log de ativação no painel **Problems / Console** do ADT sinalizará detalhadamente as etapas executadas.

![[02DirectChangeToDBTable_004.png]]

---

## 3. O Processo de Conversão de Tabela (*Table Conversion*)

Quando uma modificação não pode ser resolvida por um simples comando `ALTER TABLE` (por exemplo, ao inserir um campo no meio da chave primária, reduzir o tamanho de um campo de `CHAR 20` para `CHAR 10` ou alterar o tipo de dado de `CHAR` para `INT4`), o ABAP Dictionary aciona o processo clássico de **Conversão de Tabela**.

<iframe 
    src="https://cdnapisec.kaltura.com/p/1921661/embedPlaykitJs/uiconf_id/50355372?iframeembed=true&entry_id=1_gze0u3ky" 
    width="100%" 
    height="400" 
    allowfullscreen 
    frameborder="0">
</iframe>

<iframe 
    src="https://cdnapisec.kaltura.com/p/1921661/embedPlaykitJs/uiconf_id/50355372?iframeembed=true&entry_id=1_s5u7x0di" 
    width="100%" 
    height="400" 
    allowfullscreen 
    frameborder="0">
</iframe>

### As 8 Etapas do Processo de Conversão:
1. **Bloqueio da Tabela:** A tabela original é bloqueada contra qualquer gravação concorrente para garantir a consistência transacional.
2. **Criação da Tabela Temporária (`QCM`):** O sistema cria uma tabela temporária no banco com o prefixo `QCM<nome_tabela>` utilizando a estrutura antiga.
3. **Cópia dos Dados para a Tabela Temporária:** Todos os registros da tabela original são copiados para a tabela `QCM`.
4. **Exclusão da Tabela Original:** A tabela original é eliminada fisicamente do banco de dados (`DROP TABLE`).
5. **Criação da Nova Tabela:** A tabela é recriada no banco com a nova estrutura física atualizada.
6. **Restauração dos Dados com Conversão:** Os dados são lidos da tabela temporária `QCM` e inseridos na nova tabela (aplicando truncamentos ou conversões necessárias).
7. **Exclusão da Tabela Temporária:** A tabela `QCM` é descartada do banco.
8. **Liberação do Bloqueio:** A tabela é desbloqueada e liberada para uso normal.

<iframe 
    src="https://cdnapisec.kaltura.com/p/1921661/embedPlaykitJs/uiconf_id/50355372?iframeembed=true&entry_id=1_qg0tsn51" 
    width="100%" 
    height="400" 
    allowfullscreen 
    frameborder="0">
</iframe>

> [!CAUTION] Riscos e Boas Práticas em Produção
> Em tabelas produtivas com milhões de registros, uma conversão de tabela pode demorar várias horas e consumir recursos substanciais de disco e memória temporária. Além disso, se uma coluna for encurtada, pode ocorrer **perda irreversível de dados por truncamento**. Em ambientes produtivos, mudanças estruturais que exigem conversão são planejadas em janelas dedicadas de manutenção.

---

## 4. Ajustando Alterações Indiretas

Uma alteração indireta ocorre quando um objeto reutilizado por várias tabelas é modificado na sua raiz.

![[04IndirectChangesToDBTable_001.png]]

Por exemplo, se o domínio `S_CUST_ID` tiver seu tamanho alterado de `NUMC 6` para `NUMC 10`:
- Todos os elementos de dados que utilizam esse domínio tornam-se desatualizados.
- Todas as tabelas de banco de dados que contêm colunas baseadas nesses elementos de dados precisam ser ajustadas.

<iframe 
    src="https://cdnapisec.kaltura.com/p/1921661/embedPlaykitJs/uiconf_id/50355372?iframeembed=true&entry_id=1_s4wf2d3l" 
    width="100%" 
    height="400" 
    allowfullscreen 
    frameborder="0">
</iframe>

![[04IndirectChangesToDBTable_002.png]]

![[04IndirectChangesToDBTable_003.png]]

No Eclipse ADT, ferramentas integradas de ativação em massa (*Mass Activation*) e logs de consistência do Dicionário garantem que todas as tabelas dependentes sejam identificadas e ajustadas em cascata.

---

## 5. Prática Hands-On: Tratar Alterações em uma Tabela de Banco de Dados

> [!NOTE] Objetivo do Exercício
> Você aprenderá a adicionar campos a uma tabela existente, analisar o impacto da ativação no log do ADT e verificar como o Dicionário ajusta a tabela física no banco.

---

### Tarefa 1: Adicionar um Campo à Tabela `Z##_EMPLOYEE`
1. No *Project Explorer*, abra a tabela `Z##_EMPLOYEE` no editor do ADT.
2. Adicione um novo campo `department` utilizando o elemento de dados padrão `/LRN/DEPARTMENT`:

```abap
  department : /lrn/department;
```

3. Salve (**Ctrl + S**) e ative a tabela (**Ctrl + F3**).
4. Abra o painel **Console** ou **Problems** no Eclipse para verificar que o sistema executou um comando `ALTER TABLE ... ADD` sem necessidade de conversão.

---

### Tarefa 2: Analisar Alterações Estruturais no Data Preview
1. Abra o **Data Preview** pressionando **F8**.
2. Verifique que a nova coluna `DEPARTMENT` agora aparece disponível e preenchida com valores iniciais padrão para os registros existentes.
