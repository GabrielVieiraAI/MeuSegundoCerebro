---
aliases: ["System Landscape Directory", "SLD"]
tags: [sap, pi, po, arquitetura, infraestrutura]
type: "concept"
status: "draft"
summary: "O diretório central (o 'catálogo telefônico') que cadastra e mapeia todos os sistemas físicos e lógicos da paisagem corporativa."
---
# SLD - System Landscape Directory

**Relacionado:** [[PI - Process Intagration|SAP PI]], [[PO - Process Orquestration|SAP PO]], [[ESR - Enterprise Services Repository|ESR]]

## O que é o SLD?

O **System Landscape Directory (SLD)** é o repositório central de informações sobre a paisagem de sistemas de uma empresa. Ele funciona como um **catálogo oficial e lista telefônica** de todos os softwares, versões e servidores (SAP e não-SAP) instalados na infraestrutura corporativa.

O SAP PI/PO não tem como "adivinhar" o IP ou o nome de um servidor para rotear uma mensagem. Ele consulta essas informações no SLD. Sem o SLD configurado, o barramento de integração fica completamente "cego".

## Categorias do SLD

Quando acessamos o SLD, os administradores de integração configuram basicamente duas grandes áreas:

### 1. Software Catalog (Catálogo de Softwares)
Cadastra **o que** a empresa possui, em um nível abstrato (focado no software e suas versões, não na máquina física onde ele roda).

#### O Modelo Mental: Produto x Componente x Versão
Para entender como o SAP organiza o catálogo de software, pense na analogia do **Microsoft Office**:
* **O Produto:** É o **"Microsoft Office"** — a caixa/nome comercial do pacote. Ele não é um programa executável em si, apenas o conjunto organizador.
* **O Componente de Software:** São as peças que fazem o produto funcionar: o **Word**, o **Excel**, o **PowerPoint**.
* **A Versão do Componente:** É o **"Word 2016"** ou **"Word 2021"** — a versão real e instalada com arquivos e código executável.

No SAP SLD, a estrutura segue exatamente essa hierarquia:

```text
📦 PRODUTO (Product) - Ex: SISTEMA_ECOMMERCE
   │
   └── 🧩 COMPONENTE DE SOFTWARE (Software Component) - Ex: SWC_VENDAS
          │
          └── 🏷️ VERSÃO DO COMPONENTE (SWCV) - Ex: 1.0 of SWC_VENDAS
                 └── (É aqui dentro que o ESR armazena as interfaces e códigos!)
```

#### Definição de cada Nível

1. **Produto (Product):**
   * O nível mais alto do catálogo. É um agrupador ou contêiner puramente conceitual.
   * Não contém código, mensagens ou tabelas diretamente.
   * *Exemplos:* `SAP S/4HANA`, ou um produto customizado criado pela sua empresa como `PORTAL_DO_CLIENTE`.

2. **Componente de Software (Software Component):**
   * Representa uma peça técnica ou subsistema funcional do Produto.
   * Um produto pode ter um ou vários componentes de software (ex: um módulo de Folha e um módulo de Ponto dentro de um Produto de RH).

3. **Versão do Componente (Software Component Version - SWCV):**
   * O componente existindo em um momento específico do tempo (ex: `1.0`, `2.0`, `2022`).
   * **Regra de Ouro:** Você **nunca** cria interfaces ou código solto em um Produto. Tudo no [[ESR - Enterprise Services Repository|ESR]] fica guardado dentro de uma **Software Component Version específica**. Ela é a unidade que é importada do SLD para o ESR e transportada entre os ambientes (Dev $\rightarrow$ Qas $\rightarrow$ Prd).

| Nível | Exemplo Prático | Papel no Mundo Real |
| :--- | :--- | :--- |
| **Produto** | `PORTAL_RH` | O nome da solução que o negócio e a diretoria conhecem. |
| **Componente** | `INTEGRACOES_FOLHA` | A peça técnica responsável pelas interfaces da folha de pagamento. |
| **Versão (SWCV)** | `1.0 of INTEGRACOES_FOLHA` | **A pasta de trabalho real**. É isso que você importa no ESR para criar tipos de mensagens, interfaces e mappings. |

- 🛠️ **Passo a Passo Prático:** [[Criando um Produto no SAP NetWeaver SLD|Tutorial: Como Criar um Produto no SLD do SAP NetWeaver]]

### 2. System Landscape (Infraestrutura Real)
Cadastra as máquinas de verdade e seus "apelidos" (focado no roteamento).
- **Technical System (Sistema Técnico):** O cadastro real e físico do servidor. Armazena o IP (host), porta, sistema operacional e banco de dados. Ex: *Máquina IP 192.168.10.50*.
- **Business System (Sistema de Negócio):** O nome lógico ("apelido") dado ao Technical System. O desenvolvedor nunca usa o IP direto para configurar uma integração no ID (*Integration Directory*); ele usa exclusivamente o Business System (ex: `SISTEMA_RH_PROD`).
  - *Vantagem Arquitetural:* Se o servidor físico queimar e for substituído por outro IP, basta atualizar o Technical System no SLD. O Business System permanece o mesmo e, consequentemente, nenhuma integração da empresa precisa ser reescrita ou reconfigurada.
