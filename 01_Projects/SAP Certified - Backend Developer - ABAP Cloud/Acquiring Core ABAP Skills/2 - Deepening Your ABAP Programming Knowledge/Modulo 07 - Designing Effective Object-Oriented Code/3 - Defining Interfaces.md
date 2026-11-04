---
tipo: clippings
source: "https://learning.sap.com/courses/deepening-your-abap-programming-knowledge"
created: 2026-11-03
tags:
  - sap
  - abap
  - abap-cloud
  - orientacao-a-objetos
  - interfaces
  - clean-core
---

# 3 - Defining Interfaces

> [!NOTE] Conexão com o Guia de Estudos
> Esta lição compõe o **Módulo 07: Designing Effective Object-Oriented Code** da jornada oficial *Deepening Your ABAP Programming Knowledge*. Consulte o [[Roteiro de Estudos SAP]] para o planejamento completo.

---

## 1. O Conceito de Interfaces em ABAP OO

Enquanto a herança define uma relação de parentesco ("*é-um*", ex: um caminhão *é um* veículo), uma **Interface** define um **contrato de comportamento** ("*comporta-se como*", ex: uma classe *é imprimível*, *é auditável*, *é serializável*).

Uma interface estabelece uma assinatura padronizada de componentes sem se preocupar com os detalhes de como eles serão executados internamente. As classes que decidem implementar a interface assumem o compromisso formal de fornecer o código para todos os métodos declarados.

```
                  ┌──────────────────────┐
                  │ <<interface>>        │
                  │ zif_printable        │
                  │ + print_label( )     │
                  └──────────▲───────────┘
                             │ implements
              ┌──────────────┴──────────────┐
              │                             │
    ┌─────────┴──────────┐       ┌──────────┴─────────┐
    │  lcl_flight_ticket │       │  lcl_shipping_box  │
    └────────────────────┘       └────────────────────┘
```

> [!TIP] Diagrama de Arquitetura com Interfaces
> Visualize o desacoplamento e os contratos de componentes em: ![[Interfaces_Conceito_ABAP.excalidraw]]

---

## 2. Anatomia e Sintaxe de uma Interface

No ABAP, uma interface é declarada através do bloco de comandos `INTERFACE ... ENDINTERFACE`:

```abap
INTERFACE zif_log_writer PUBLIC.
  " Tipos reutilizáveis
  TYPES:
    tv_log_severity TYPE c LENGTH 1,
    BEGIN OF ty_log_entry,
      timestamp TYPE utclong,
      severity  TYPE tv_log_severity,
      message   TYPE string,
    END OF ty_log_entry.

  " Constantes padronizadas
  CONSTANTS:
    gc_severity_info  TYPE tv_log_severity VALUE 'I',
    gc_severity_warn  TYPE tv_log_severity VALUE 'W',
    gc_severity_error TYPE tv_log_severity VALUE 'E'.

  " Assinaturas de métodos (sem bloco de implementação!)
  METHODS:
    write_log
      IMPORTING
        is_entry TYPE ty_log_entry,
    get_entries
      RETURNING
        VALUE(rt_entries) TYPE STANDARD TABLE OF ty_log_entry WITH EMPTY KEY.
ENDINTERFACE.
```

### Regras Fundamentais de uma Interface:
1. **Sem Seções de Visibilidade:** Uma interface **não possui** `PUBLIC SECTION`, `PROTECTED SECTION` nem `PRIVATE SECTION`. Todos os seus componentes são **implicitamente públicos**.
2. **Sem Bloco de Implementação:** Não existe bloco `INTERFACE ... IMPLEMENTATION`. Interfaces definem assinaturas, jamais o corpo de métodos.
3. **Impossível Instanciar Diretamente:** Você não pode executar `NEW zif_log_writer( )`. É necessário instanciar uma classe concreta que implemente essa interface.

---

## 3. Componentes Permitidos em uma Interface

| Componente | Palavra-chave ABAP | Descrição |
| :--- | :--- | :--- |
| **Métodos de Instância** | `METHODS` | Assinatura de operações que cada classe implementará individualmente. |
| **Métodos Estáticos** | `CLASS-METHODS` | Métodos compartilhados que não dependem do estado de uma instância. |
| **Atributos de Instância** | `DATA` | Variáveis cujo valor pertencerá a cada objeto que implementar a interface. |
| **Atributos Estáticos** | `CLASS-DATA` | Variáveis globais no escopo da interface. |
| **Constantes** | `CONSTANTS` | Valores fixos acessíveis de forma pública por qualquer consumidor. |
| **Tipos** | `TYPES` | Definições de estruturas, tipos elementares e tabelas. |
| **Eventos** | `EVENTS` / `CLASS-EVENTS` | Declarações de disparadores para o padrão Observer. |
| **Interfaces Aninhadas** | `INTERFACES` | Inclusão de uma interface dentro de outra (*Compound Interfaces*). |

---

## 4. Superando a Limitação de Herança Simpla: Múltiplas Interfaces

Como vimos no Módulo 01 e 07, o ABAP adota **herança simples** para classes (evitando o clássico *Diamond Problem* do C++). No entanto, um único objeto do mundo real frequentemente desempenha múltiplos papéis.

Uma classe ABAP pode implementar **quantas interfaces forem necessárias**, separando responsabilidades com clareza:

```abap
CLASS lcl_cargo_flight DEFINITION INHERITING FROM lcl_flight.
  PUBLIC SECTION.
    " Implementa múltiplos contratos comportamentais independentes:
    INTERFACES:
      zif_printable,
      zif_trackable,
      zif_log_writer.
ENDCLASS.
```

---

## 5. Interfaces no Paradigma Clean Core e Testabilidade

No desenvolvimento moderno de software empresarial (ABAP Cloud e Clean Core), interfaces desempenham papel central em dois princípios fundamentais do **SOLID**:

### 1. Inversão de Dependência (*Dependency Inversion Principle - DIP*)
Módulos de alto nível não devem depender diretamente de implementações concretas de baixo nível; ambos devem depender de **interfaces abstratas**.
- *Antes:* Uma classe de faturamento criava diretamente instâncias de um leitor de banco de dados específico.
- *Depois:* A classe de faturamento recebe um `TYPE REF TO zif_invoice_reader`. O leitor real de produção ou um conector de nuvem podem ser trocados sem que o faturamento mude uma única linha.

### 2. Testabilidade e Mocks no ABAP Unit
Sem interfaces, testar classes isoladamente com **ABAP Unit** torna-se extremamente complexo porque a classe tenta acessar banco real ou serviços externos.
- Com interfaces, no ambiente de teste criamos uma classe substituta (*Test Double / Mock Class*) que implementa a mesma interface, respondendo dados simulados em memória sem tocar em dependências externas.
