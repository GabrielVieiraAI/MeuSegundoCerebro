---
tags:
  - projeto
  - insi
  - veiling-holambra
  - sap
  - abap
  - fiori
  - tabela-parametros
versao: "1.0"
classificacao: Restrito
---

# App Tabela de parâmetros
* **Versão:** 1.0
* **Classificação:** Restrito

---

## Histórico de Modificações

| Versão | Data | Descrição | Modificado por |
| :--- | :--- | :--- | :--- |
| 1.0 | 07/10/2025 | Criação do documento | Raphael Rocha |
| 2.0 | 08/10/2025 | Revisão do documento | Marcela Radael |

---

## Sumário

1. [Finalidade do Documento](#1-finalidade-do-documento)
2. [Planejamento do Projeto](#2-planejamento-do-projeto)
3. [Pontos importantes](#3-pontos-importantes)
4. [Estrutura do app e dados cadastrados](#4-estrutura-do-app-e-dados-cadastrados)
5. [Aplicativo](#5-aplicativo)

---

## 1. Finalidade do Documento

O objetivo desse documento será de orientar a utilização do App tabela de Parâmetros.

---

## 2. Planejamento do Projeto

O aplicativo é estruturado sobre três tabelas relacionadas: módulos, parâmetros e valores.

Para criar um valor, é necessário que exista um parâmetro, e para criar um parâmetro, é preciso que exista um módulo.

Os parâmetros funcionam como constantes globais utilizadas em diversos processos e, por isso, são organizados por módulos. A criação de parâmetros nesta transação substitui o uso da [[STVARV e TVARVC - Variaveis de Selecao e Parametros|TVARV]].

Os módulos são exibidos apenas aos usuários que possuem permissão de acesso, portanto, se um módulo não aparecer na tela, isso não significa que o registro não exista, mas sim que o usuário não possui autorização para visualizá-lo.

---

## 3. Pontos importantes

1. Sempre que utilizar uma nova variável, solicitar ao funcional a criação nos ambientes, para aqueles que não tem conhecimento, informando e atribuindo a responsabilidade do cadastro nos ambientes de destino conforme as requests das soluções são transportadas.

2. Para acesso ao App temos a role **ZS:ABAP_APPS** e o objeto de autorização **Z_PARAM** utilizado no aplicativo para gerenciar os acessos.

   **Observações controle de acesso:**
   Com ele vai ser possível definir quais módulos e ações os usuários de cada perfil vão possuir acesso.
   Se o usuário deve acessar todos os módulos, deve ser inserido o valor de “`*`” na configuração do objeto no perfil.
   O objeto de autorização é utilizado na CDS Access Control, que já filtra direto na CDS de Interface os dados que o usuário vai ter acesso, assim como na implementação do Behavior para verificar a quais ações o usuário possui acesso.

3. A classe para selecionar os dados na tabela de parâmetros o Abap deve utilizar a classe **`zclca_tabela_parametros`**.

   **Método a utilizar:**
   **`m_get_range`**: retorna os valores cadastrados no formato de range.
   * Considera todos os campos Sinal, Opção, Valor mínimo e máximo para montar o range.
   * Dispara uma Exception se o parâmetro não estiver cadastrado. Deve ser tratado no código que chama o método utilizando Try...Catch, para não ocorrer *dump*.

---

## 4. Estrutura do app e dados cadastrados

**Módulo:** neste temos uma chave única sendo o campo do módulo.
`[Módulo: CHAR 4]`

**Parâmetro:** possui uma chave composta com os seguintes campos.
`[Chave1: CHAR 20]`
`[Chave2: CHAR 20]`
`[Chave3: CHAR 8]`

**Valor:** possui tamanho `CHAR 255`.

**Tabelas:**
* `ZTCA_PARAM_MOD` – Tabela de Parâmetros - Módulos
* `ZTCA_PARAM_PAR` – Tabela de Parâmetros - Parâmetros
* `ZTCA_PARAM_VAL` – Tabela de Parâmetros – Valores

**Dados:**
Os dados cadastrados na tela dos valores vão ser consumidos via código ABAP, que vai montar um RANGE para uso, por isso ao cadastrar os valores considere:

**Sinal:** Valores disponíveis.

| SIGN | Descrição breve |
| :--- | :--- |
| `I` | Delimitação de área incluída (inclusivo) |
| `E` | Delimitação de área excluída (exclusivo) |

**Opções de comparação dos valores disponíveis.**

| OPÇÃO | Descrição breve |
| :--- | :--- |
| `EQ` | igual |
| `BT` | entre ... e ... |
| `CP` | contém o modelo |
| `LE` | menor ou igual |
| `GE` | maior ou igual |
| `NE` | diferente |
| `NB` | não entre ... e ... |
| `NP` | não contém o modelo |
| `GT` | maior |
| `LT` | menor |

---

## 5. Aplicativo

* **Objeto Semântico:** `ZZ1_TAB_PARAM`
* **Ação Semântica:** `manage`

Na página inicial temos os módulos.

*(Exemplo ilustrado na tela inicial – Módulos)*:

| Módulo | Descrição |
| :--- | :--- |
| `TM` | Transportation Management |
| `SD` | Sales and Distribution |
| `QM` | Administração da Qualidade |
| `MM` | Administração de Materiais |
| `FI-AR` | Contas a Receber |
| `FI-AP` | Contas a Pagar |
| `FI` | Financeiro |
| `DMS` | Document Management System |
| `BP` | Parceiro de negócios |

Ao seguir pressionando a linha do módulo adentramos nos parâmetros e valores.

*(Exemplo ilustrado na tela do Módulo `FI` – Financeiro)*:

| Chave 1 | Chave 2 | Chave 3 | Descrição |
| :--- | :--- | :--- | :--- |
| `VAN_BANCARIA` | `ENTRADA` | `SERVER` | Servidor para JOB |
| `VAN_BANCARIA` | `ENTRADA` | `PAGAMENTOS` | Entrada de Pagamentos |
| `VAN_BANCARIA` | `ENTRADA` | `EXTRATOS_ERRO` | Entrada extratos - ERRO |
| `VAN_BANCARIA` | `ENTRADA` | `EXTRATOS_BACKUP` | Entrada Extratos - Backup |

Pressionando a linha do parâmetro adentramos nos valores.

*(Exemplo ilustrado na tela de Valores do parâmetro `VAN_BANCARIA` / `ENTRADA` / `SERVER`)*:

| Sinal | Opção | Valor Mínimo | Valor Máximo |
| :--- | :--- | :--- | :--- |
| `I (Delimitação de área incluída (inclusivo))` | `EQ (igual)` | `vhshqs4ci_QS4_400` | |

> [!WARNING] OBSERVAÇÃO IMPORTANTE:
> **Nunca eliminar um módulo, visto que com esta eliminação serão eliminados todos os parâmetros e valores cadastrados.**
