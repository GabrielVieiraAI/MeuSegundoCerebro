---
tipo: clippings
title: "Introducing the Clean Core Approach"
source: "https://learning.sap.com/courses/practicing-clean-core-extensibility-for-sap-s-4hana-cloud/introducing-the-clean-core-approach_fcb6c662-7041-4c99-88bd-345636fae7f3"
created: 2026-11-03
tags:
  - sap
  - abap
  - abap-cloud
  - clean-core
  - classic-extensibility
  - released-apis
  - zero-modifications
---
**Roteiro de Estudos Relacionado:** [[Roteiro de Estudos SAP]]

# Objetivos de Aprendizado

Após concluir esta lição, você será capaz de:
- Explorar o modelo clássico de exits e modificações anterior ao SAP S4HANA Cloud (*Explore exits and modifications prior to SAP S4HANA Cloud*).
- Definir os fundamentos e dimensões do conceito de **Clean Core**.
- Explicar os benefícios e as práticas recomendadas de **Clean Core Extensibility**.

---

## 1. Abordagens Clássicas de Extensibilidade (*Classic Extensibility Approaches*)

No mundo tradicional anterior à computação em nuvem (*On-Premise*), a extensibilidade do SAP ERP funcionava de forma comparável a um contrato bem delineado entre a SAP e o cliente.

![[Extensions_002.png]]

Imagine um cenário prático: uma tela de aplicação exibe dois campos: `revenue` (receita) e `cost` (custo). É perfeitamente comum que o usuário de negócios requisite um novo campo: `profit` (lucro), calculado com base em um fator numérico exclusivo da empresa. Como esse fator é específico do cliente, não existia na base padrão da SAP um campo para armazená-lo.

Para atender a esses requisitos, a SAP entregava **pontos de saída** (*exits*) distribuídos pelas diferentes camadas da pilha (*stack*):

| Camada da Pilha (*Stack Layer*) | Tipo de Recurso Clássico | Exemplo de Aplicação Prática |
| :--- | :--- | :--- |
| **Camada de Dados (*Data Layer*)** | **`Table Append`** (Estruturas de Acréscimo no DDIC) | Adiciona o campo numérico exclusivo diretamente na tabela padrão de banco de dados do SAP ERP. |
| **Camada Visual (*Visual Layer*)** | **`Screen Exits`** e **`Menu Exits`** | O campo `profit` é desenhado na tela via *Screen Exit* e um novo botão é adicionado à barra de ferramentas via *Menu Exit*. |
| **Camada de Código / Negócio (*Middle / Code Layer*)** | **`Code Exits`** (User Exits, Customer Exits, BAdIs) | Implementa o cálculo em linguagem ABAP para ler, validar, calcular e gravar o novo valor no banco de dados. |

### Liberdade Total e seus Efeitos Colaterais no Modelo Clássico
No modelo clássico, o desenvolvedor tinha acesso irrestrito ao sistema:
- Qualquer tabela de banco de dados da SAP podia ser lida ou gravada diretamente.
- Qualquer módulo de função ou método de classe da SAP podia ser invocado, mesmo sem garantia formal de estabilidade.
- Quando não existia um *exit* pronto, o cliente adotava duas opções agressivas:
  1. **Modificação Direta (*Direct Modification*):** Alteração direta no código-fonte padrão da SAP (gerando chaves de modificação e registros no repositório).
  2. **Cópias e Clones (*Copies of SAP Objects*):** Copiar o programa da SAP para o namespace `Z` ou `Y` e modificá-lo localmente.

Esse modelo funcionou durante décadas no SAP R/3 e SAP ECC porque os sistemas residiam em data centers privados dos próprios clientes, mantidos 100% por suas próprias equipes de TI. No entanto, os custos de atualização de pacotes de suporte (*Support Packages*) e upgrades exigiam semanas de testes intensivos e ajustes nas transações `SPDD` e `SPAU`.

---

## 2. A Virada de Chave: A Chegada do SAP S4HANA Cloud

Com o advento do **SAP S4HANA Cloud**, o paradigma mudou radicalmente:
- Em uma nuvem pública (*Public Cloud*), todos os clientes compartilham a mesma linha de base de software (*single baseline code*), recebendo inovações e manutenções de forma contínua e automatizada.
- Não é tecnicamente viável nem seguro permitir modificações locais que possam quebrar atualizações automatizadas ou corromper o ambiente operacional compartilhado.
- A necessidade de extensões permanece legítima, mas as regras e a arquitetura precisaram ser completamente reinventadas.

Assim nasceu a filosofia do **Clean Core**.

---

## 3. O Conceito de Clean Core (*The Clean Core Concept*)

![[CleanCore_Image.png]]

O **Clean Core** é simultaneamente um conceito arquitetural e uma abordagem prática para construir e manter uma paisagem de SAP S/4HANA moderna, flexível e totalmente compatível com a nuvem (*cloud-compliant*).

### Os 5 Pilares do "Core"
O núcleo do sistema engloba cinco aspectos vitais:
1. **Processos (*Processes*):** A sequência ponta a ponta (*End-to-End - E2E*) que cumpre as atividades de negócio orientadas a resultados.
2. **Dados (*Data*):** Os dados mantidos e consumidos pelo sistema, categorizados em **Configuração**, **Dados Mestres (*Master Data*)** e **Dados Transacionais (*Transactional Data*)**.
3. **Integração (*Integration*):** A comunicação e troca de dados entre o SAP S/4HANA e sistemas externos por meio de protocolos padronizados.
4. **Operações (*Operations*):** Atividades contínuas de governança, incluindo gerenciamento de releases, jobs em background, matriz de autorizações, monitoramento e alertas.
5. **Extensibilidade (*Extensibility*):** Recursos criados especificamente para cobrir requisitos de negócios que vão além das funções entregues no produto padrão.

### O Significado de "Clean"
Significa que cada um desses cinco pilares é mantido atualizado no release mais recente, em conformidade com as regras da nuvem, otimizado tecnicamente e governado por padrões rigorosos de qualidade.

---

## 4. Benefícios do Clean Core

| Público | Principais Benefícios |
| :--- | :--- |
| **Clientes** | - **Upgrades como "Não-Eventos" (*Non-Events*):** Atualizações regulares e automáticas sem quebras de código customizado.<br>- **Adoção Ágil de Inovação:** Acesso imediato a recursos de Inteligência Artificial, automações e novas interfaces.<br>- **Segurança e Continuidade Operacional E2E.**<br>- **Menor Custo Total de Propriedade (*Lower TCO*):** Redução drástica de esforço de sustentação e retrabalho de código. |
| **Parceiros / Consultorias** | - **Soluções Prontas para a Nuvem (*Future-Proof*):** Extensões reutilizáveis e estáveis.<br>- **Aderência ao Fit-to-Standard:** Foco em diferenciais reais de negócio em vez de reinventar a roda.<br>- **Consumo Simplificado de Novas Tecnologias.** |

---

## 5. Extensibilidade Clean Core (*Clean Core Extensibility*)

A SAP resume formalmente a Extensibilidade Clean Core da seguinte forma:

> [!IMPORTANT] Definição Oficial da SAP
> *"A extensibilidade Clean Core pode ser resumida como uma metodologia de extensão na qual as extensões são mantidas estritamente separadas da aplicação SAP. As extensões acessam os Business Objects da SAP exclusivamente por meio de interfaces bem definidas e com garantia de estabilidade para upgrades."*

### O Framework de Melhores Práticas Clean Core
Para implementar o Clean Core com sucesso no SAP S4HANA Cloud, a organização adota:
1. **Política de Zero Modificações (*Zero Modifications*):** Proibição terminante de alterar o código standard da SAP.
2. **Eliminação de Redundâncias e Clones:** Desativação de códigos customizados que duplicam funcionalidades já entregues no SAP S/4HANA standard e remoção de cópias/clones.
3. **Uso Exclusivo de APIs Liberadas (*Released APIs*):** Extensões consom apenas contratos de estabilidade formalmente garantidos pela SAP (como interfaces C1).
4. **Aproveitamento Máximo da Key User Extensibility:** Uso de ferramentas no-code/low-code embutidas no SAP Fiori para customizações pontuais por usuários-chave.
5. **Uso da SAP Business Technology Platform (SAP BTP):** Para aplicações de extensão complexas desacopladas (*Side-by-Side Extensibility*).
6. **Integrações Via SAP Integration Suite:** Comunicação governada e monitorada.

---

## 6. Modelos de Implantação e Transição

O caminho para o Clean Core varia conforme a escolha de implantação e a abordagem de migração:

### Opções de Implantação (*Deployment Options*)
- **SAP S4HANA Cloud Public Edition:** SaaS puro, multitenant, 100% gerido pela SAP, onde o Clean Core é obrigatório por padrão.
- **SAP S4HANA Cloud Private Edition:** Nuvem privada com flexibilidade estendida, suporte ao modelo 3-Tier e transição progressiva para Clean Core.
- **SAP S/4HANA (On-Premise):** Instalação tradicional gerenciada pelo cliente em seu próprio data center.

### Abordagens de Migração
- **Nova Implementação (*New Implementation / Greenfield*):** O sistema nasce limpo e sem legado ("manter o core limpo" — *Keep the Core Clean*).
- **Conversão de Sistema (*System Conversion / Brownfield*):** O sistema existente é convertido tecnicamente e passa por uma esteira de modernização ("tornar o core limpo" — *Get the Core Clean*).
- **Transformação de Paisagem (*Landscape Transformation / Selective Data Transition*):** Abordagem híbrida consolidando múltiplas instâncias ERP.
