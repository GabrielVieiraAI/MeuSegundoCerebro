---
aliases:
  - "Currículo Gabriel Vieira"
  - "Portfólio SAP"
  - "Currículo SAP ABAP"
  - "Experiências Profissionais SAP"
  - "Perfil Profissional Gabriel"
tags:
  - carreira
  - sap
  - abap
  - rap
  - fiori
  - btp
  - curriculo
  - portfolio
  - clean-core
tipo: carreira
status: atualizado
summary: "Mapeamento detalhado das competências técnicas, histórico profissional, portfólio de aplicativos Fiori/RAP/BTP e currículo consolidado de Gabriel Vieira de Souza."
---

# Perfil Profissional & Portfólio SAP — Gabriel Vieira de Souza

**Relacionado:** [[RAP - ABAP RESTful Application Programming Model|RAP]], [[BTP - Business Technology Platform|SAP BTP]], [[Como construir um app FIORI com RAP]], [[CDS - Core Data Services|CDS Views]], [[Clean Core]], [[ABAP Cloud]], [[RICEFW - Reports Interfaces Conversions Enhancements Forms Workflows|RICEF]], [[Roteiro de Estudos SAP]]

---

##  1. Visão Geral & Posicionamento

* **Posição:** Consultor & Desenvolvedor SAP ABAP | Especialista em ABAP Cloud, SAP Fiori / RAP e S/4HANA
* **Localização:** Vila Velha, ES (Atuação Remota)
* **Tempo de Experiência:** +3 anos em desenvolvimento de software e ecossistema SAP (SAP ECC 6.0 e SAP S/4HANA)
* **Formação Acadêmica:** Bacharelado em Análise e Desenvolvimento de Sistemas (Conclusão: 2026) e Bacharelado em Administração de Empresas (2020)
* **Diferencial Competitivo:** Combinação estratégica entre **entendimento profundo de processos de negócio** (Administração), domínio das tecnologias **SAP clássicas e modernas** (ABAP OO, CDS, RAP, Fiori Elements) e uma sólida bagagem prévia como desenvolvedor **Full Stack (.NET / C#, Angular, TypeScript, APIs RESTful e Cloud)**.

---

##  2. Foco no 'Por Quê': Evolução do Modelo Clássico para o Modelo Moderno

No desenvolvimento SAP contemporâneo, a transição do ambiente legado para soluções modernas orientadas ao **[[Clean Core]]** é a principal diretriz de arquitetura.

| Aspecto | Modelo Antigo (SAP ECC / R/3 Clássico) | Modelo Moderno ([[Clean Core]] / SAP S/4HANA & [[BTP - Business Technology Platform\|BTP]]) |
| :--- | :--- | :--- |
| **Arquitetura de Telas** | Telas clássicas SAP GUI (Dynpro / Module Pool), relatórios ALV estáticos (`SE38`, `SE80`). Difíceis de usar em dispositivos móveis e fora da rede local. | Aplicações web modernas e responsivas em **SAP Fiori Elements** (List Report e Object Page), acessíveis por qualquer navegador via **SAP Fiori Launchpad**. |
| **Camada de Negócio** | Código transacional espalhado em Includes, User-Exits, BAPIs e tabelas Z criadas sem governança centralizada. | **[[RAP - ABAP RESTful Application Programming Model\|RAP (ABAP RESTful Application Programming Model)]]**: arquitetura padronizada em camadas com Behavior Definitions e Implementações desacopladas (`ZBP_...`). |
| **Modelagem de Dados** | Visões do Dicionário de Dados (`SE11`) e consultas Open SQL pesadas que sobrecarregavam a aplicação. | **[[CDS - Core Data Services\|CDS Views (Core Data Services)]]** com *Code Pushdown*: o banco de dados executa a agregação e os cálculos em tempo real, sem necessidade de jobs noturnos em lote. |
| **Protocolo de Integração** | Arquivos locais, RFCs diretas e IDocs proprietários. | Serviços padronizados **OData (Open Data Protocol)** versões V2 e V4, expondo APIs RESTful consumíveis por web, mobile e sistemas externos. |
| **Manutenibilidade & Upgrades** | Modificações intrusivas no núcleo do ERP que quebravam o sistema a cada atualização (*Upgrade*). | Princípio de **[[Clean Core]] (Tier 1 ABAP Cloud & BTP)**: utiliza apenas APIs standard liberadas pela SAP (`I_...`), garantindo que atualizações futuras não quebrem as customizações. |

---

## 3. Matriz de Competências Técnicas

### 3.1. ABAP Moderno, RAP & Clean Core
* **[[RAP - ABAP RESTful Application Programming Model|RAP]]:** Implementação de cenários *Managed* (onde o framework gerencia o ciclo de persistência e bloqueio) e *Unmanaged* (para reaproveitamento de rotinas legadas e BAPIs).
* **Behavior Definition & Implementation:** Implementação de operações CRUD padrão, ações de negócio customizadas em lote (*Mass Actions*), validações (*Validations*), determinações (*Determinations*) e tratamento de rascunhos (*Drafts*).
* **[[CDS - Core Data Services|CDS Views]]:** Modelagem em múltiplas camadas (Basic/Interface `ZI_`, Composite e Consumption/Projection `ZC_`), associações, agregações analíticas e anotações `@UI`.
* **Segurança e DCL:** Controle de acesso a nível de linha de dados (*Data Control Language* - DCL) vinculado a objetos de autorização customizados e perfis de segurança PFCG.
* **Extensibilidade Clean Core:** Conhecimento prático da taxonomia de extensibilidade (Tier 1 - ABAP Cloud no S/4HANA; Tier 2 - Cloud BAdIs; Tier 3 - Side-by-Side no SAP BTP).

### 3.2. SAP Fiori Elements & Frontend SAP
* **Criação de Apps Fiori:** Desenvolvimento de aplicações corporativas baseadas em metadados (List Report e Object Page) com desacoplamento de interface via **Metadata Extensions (MDE)**.
* **Ferramental:** Uso do **SAP Business Application Studio (BAS)** e **VS Code** com extensão *SAP Fiori Tools*.
* **Configuração & Deploy:** Configuração do `manifest.json`, empacotamento e deploy de pacotes para o repositório SAPUI5 ABAP Repository (**WAPA/BSP**).
* **SAP Fiori Launchpad (FLP):** Criação e parametrização de Objetos Semânticos, Ações Semânticas, Mapeamento de Destino (*Target Mapping*), Catálogos Técnicos/Negociais, Grupos, Espaços e Páginas, além de Tiles de acesso.

### 3.3. SAP BTP & Nuvem
* **Fundamentos BTP:** Estrutura de contas corporativas (Global Account, Subaccounts, Entitlements e Quotas).
* **Ambientes de Execução:** Compreensão dos ambientes Cloud Foundry, ABAP Environment (*Steampunk*) e Kyma.
* **Integração & Conectividade:** Exposição e consumo de serviços OData V2/V4, publicação de endpoints via Service Binding, SAP Cloud Connector e destinos de comunicação (*Destinations*).

### 3.4. ABAP Clássico & RICEF (SAP ECC & S/4HANA)
* **Reports:** Relatórios em [[ALV - ABAP List Viewer|ALV (ABAP List Viewer)]] Grid e ALV Orientado a Objetos (ALV OO), telas de seleção dinâmicas e relatórios interativos.
* **Interfaces:** BAPIs, chamadas RFC síncronas/assíncronas, [[IDoc - Intermediate Document|IDocs (Intermediate Documents)]], ALE, Web Services SOAP e REST.
* **Conversions:** Rotinas de migração de dados mestres e transacionais utilizando LSMW e BDC (Call Transaction / Session).
* **Enhancements:** Ampliações do standard via BADIs (Classic e New Kernel), User-Exits, Customer Exits e Enhancement Spots.
* **Forms:** Criação e manutenção de formulários em SmartForms e Adobe Forms com driver programs associados.
* **Troubleshooting:** Diagnóstico e análise de erros via `ST22` (Dumps), análise de performance e rastreamento via `ST05` (SQL Trace) e `SAT` (Runtime Analysis).

### 3.5. Engenharia de Software Complementar (Full Stack)
* **Back-end:** C#, .NET Core, ASP.NET Core APIs, Entity Framework, Dapper, Injeção de Dependência, princípios SOLID e Padrões GoF.
* **Front-end:** Angular, TypeScript, JavaScript, RxJS, HTML5, CSS3, Bootstrap.
* **Bancos de Dados Externos & Cloud:** SQL Server, Azure SQL, MySQL, Azure (App Services, Key Vault, Storage), Git e abapGit.

---

## 💼 4. Portfólio de Projetos & Casos Reais Entregues

### 🚀 Caso 1: Aplicativo Fiori — Gestão da Tabela de Parâmetros Corporativos
* **Nota Técnica Detalhada:** [[APP Tabela de Parametros]]
* **Cliente / Contexto:** Insi / Veiling Holambra
* **Problema Resolvido:** Parametrizações corporativas eram feitas de maneira arcaica através da transação standard [[STVARV e TVARVC - Variaveis de Selecao e Parametros|TVARVC/STVARV]], sem governança de acesso por departamento e propensa a erros manuais operacionais.
* **Solução Técnica Implementada:**
  - Criação de uma aplicação Fiori hierárquica baseada em três entidades relacionais: **Módulos → Parâmetros → Valores (Ranges)**.
  - Segurança granular: integração de **CDS Access Control (DCL)** utilizando o objeto de autorização `Z_PARAM`, permitindo que cada usuário visualize e modifique apenas os módulos pertinentes à sua alçada.
  - Lógica de consumo padronizada: desenvolvimento da classe utilitária `zclca_tabela_parametros` com método estático `m_get_range`, eliminando queries repetitivas e fornecendo ranges prontos para códigos ABAP.
  - Publicação no Launchpad via Objeto Semântico `ZZ1_TAB_PARAM` e ação semântica `manage`.

### 🚀 Caso 2: Aplicativo Fiori/RAP — Bloqueio e Desbloqueio Massivo de Clientes Inadimplentes
* **Notas Técnicas Detalhadas:** [[00 - Identificação da Solicitação e Sumário|DEL-R2R-009 Sumário]] | [[DEL-R2R-009 - Arquitetura e Objetos|DEL-R2R-009 Arquitetura Técnica]]
* **Cliente / Contexto:** Insi / Veiling Holambra (Módulo FI-AR & FSCM)
* **Problema Resolvido:** O processo de bloqueio comercial e financeiro de clientes inadimplentes dependia de jobs batch noturnos pesados e conferências manuais morosas, gerando risco financeiro e atrasos na liberação de clientes regularizados.
* **Solução Técnica Implementada:**
  - Solução construída no padrão **ABAP Cloud Lean (Tier 1)** utilizando **RAP (ABAP RESTful Application Programming Model)**.
  - Modelagem CDS em tempo real: consumo da visão standard liberada `I_OperationalAcctgDocItem` para identificar títulos vencidos e cruzamento com perfil de crédito FSCM (`UKMBP_CMS`), sem necessidade de jobs em background.
  - Entidade raiz (`ZI_FI_CLIENTE_INADIMPLENTE`) e visão de projeção (`ZC_FI_CLIENTE_INADIMPLENTE`) com Metadata Extensions (`MDE`) para geração automática do Fiori Elements List Report.
  - Ações transacionais em lote (*Mass Actions*): implementação de métodos no Behavior Pool (`ZBP_...`) para bloquear e desbloquear clientes de forma desacoplada com retorno estruturado de mensagens (*Message View*).
  - Tabela Z exclusiva para log e auditoria histórica (`ZTFI_LOG_INADIMP`), mantendo o núcleo dos dados 100% dinâmico e vivo.

### 🚀 Caso 3: Middleware de Integração Híbrida (.NET + SAP RFC / OData)
* **Empresa / Contexto:** Virtus Soluções Tecnológicas / Projetos Independentes
* **Problema Resolvido:** Necessidade de sincronização bidirecional de pedidos, estoques e dados financeiros entre aplicações web externas e a retaguarda SAP ECC / S/4HANA.
* **Solução Técnica Implementada:**
  - Desenvolvimento de APIs RESTful intermediárias em ASP.NET Core consumindo conectores SAP (.NET Connector / RFC) e endpoints OData.
  - Tratamento de idempotência, logs de integração transacional e controle de filas para envio assíncrono.

---

## 📄 5. Currículo Formatado para Exportação (Markdown)

```markdown
# GABRIEL VIEIRA DE SOUZA
Consultor SAP ABAP | ABAP Cloud · SAP Fiori / RAP · SAP S/4HANA & ECC

Idade: 30 anos | Localização: Vila Velha, ES | Inglês: A2
Telefone: (27) 99716-8869 | E-mail: gabriel.884@hotmail.com | LinkedIn: linkedin.com/in/gabriel-vieira-virtus

--------------------------------------------------------------------------------

RESUMO PROFISSIONAL
Consultor e Desenvolvedor SAP ABAP com mais de 3 anos de experiência em desenvolvimento de software e projetos SAP nos ambientes SAP ECC 6.0 e SAP S/4HANA, atendendo aos módulos SD, MM, FI e CO.

Experiência consolidada tanto no ciclo clássico de desenvolvimento de objetos RICEF (Reports, Interfaces, Conversions, Enhancements e Forms) quanto no desenvolvimento moderno orientado ao Clean Core:
- Aplicações SAP Fiori & RAP: Desenvolvimento ponta a ponta com SAP Fiori Elements (List Report e Object Page) utilizando o modelo RAP (ABAP RESTful Application Programming Model), CDS Views, Metadata Extensions (MDE) e serviços OData V2/V4.
- SAP BTP & Nuvem: Vivência com conceitos da plataforma SAP BTP (Business Technology Platform), ambientes Cloud Foundry e ABAP Environment (Steampunk), extensibilidade Clean Core Tier 1, Destinations e Cloud Connector.
- RICEF & Sustentação: Relatórios ALV (Grid e OO), integrações via BAPIs, RFCs, IDocs e OData, migração via LSMW/BDC, ampliações via BADIs, User-Exits e formulários SmartForms.
- Diferencial: Graduação em Administração de Empresas combinada a uma sólida bagagem técnica em engenharia de software full stack (.NET / C#, Angular, TypeScript e APIs RESTful).

--------------------------------------------------------------------------------

HABILIDADES TÉCNICAS
- SAP Moderno: RAP (Managed/Unmanaged), Behavior Definitions & Implementations, CDS View Entities, Metadata Extensions, OData V2/V4, Service Bindings, CDS Access Control (DCL), Clean Core Tier 1.
- SAP Fiori & Frontend: SAP Fiori Elements, SAP Business Application Studio (BAS), VS Code (SAP Fiori Tools), manifest.json, deploy em WAPA/BSP, configuração de Fiori Launchpad (Objetos Semânticos, Catálogos, Target Mappings e Tiles).
- SAP BTP: Fundamentos da arquitetura BTP, Subaccounts, Cloud Foundry, ABAP Environment, Destinations, Cloud Connector.
- SAP Clássico: ALV Grid/OO, BAPIs, RFCs, IDocs, ALE, LSMW, BDC, BADIs, User-Exits, Enhancement Spots, SmartForms, Dicionário de Dados (DDIC), ST05, ST22, SAT.
- Full Stack: C#, .NET Core, ASP.NET Core, APIs RESTful, Angular, TypeScript, SQL Server, Azure, Git, abapGit, Scrum/Kanban.

--------------------------------------------------------------------------------

EXPERIÊNCIA PROFISSIONAL

Consultor / Desenvolvedor SAP ABAP — Insi (Consultoria de TI)
Período Recente / Atual | Remoto
- Atuação em projetos de implementação e sustentação em clientes corporativos nos ambientes SAP ECC 6.0 e SAP S/4HANA (módulos SD, MM, FI e CO).
- Arquitetura e desenvolvimento de aplicativos SAP Fiori Elements (List Report e Object Page) com framework RAP no SAP S/4HANA.
- Modelagem de dados com CDS View Entities estruturadas em camadas (Interface, Composição e Consumo), com Metadata Extensions (MDE) e consumo de visões standard liberadas.
- Implementação de regras transacionais em Behavior Pools (ZBP_...), abrangendo operações CRUD, ações customizadas em lote (Mass Actions), validações e determinações.
- Governança de segurança com controle de acesso dinâmico via CDS Access Control (DCL) e objetos de autorização customizados.
- Publicação de serviços OData V2/V4 via Service Definitions/Bindings e configuração completa no SAP Fiori Launchpad (Objetos Semânticos, Catálogos, Mapeamento de Destino e Tiles).
- Entrega de soluções de destaque: App de Gestão de Parâmetros Corporativos (substituindo TVARVC com segurança por módulo) e App de Bloqueio/Desbloqueio Massivo de Inadimplentes (cálculo dinâmico em tempo real via CDS, sem jobs batch).
- Desenvolvimento e suporte a objetos RICEF clássicos, relatórios ALV, integrações via BAPIs/RFCs/IDocs e ampliações via BADIs e User-Exits.

Consultor SAP ABAP & Desenvolvedor de Software — Virtus Soluções Tecnológicas
Dez/2024 – Presente | Vila Velha, ES (Remoto)
- Projetos independentes de desenvolvimento SAP ABAP e integrações corporativas.
- Arquitetura de APIs em C# / .NET atuando como middleware de integração entre bancos corporativos e o SAP via RFCs e serviços OData.
- Criação de rotinas de carga/migração via BDC/LSMW e confecção de formulários SmartForms.

Desenvolvedor de Software — Grupo Autoglass
Dez/2020 – Dez/2025 | Vila Velha, ES
- Desenvolvimento de APIs RESTful escaláveis em C# e .NET Core, aplicando SOLID, padrões GoF e Clean Code.
- Construção de interfaces responsivas em Angular (TypeScript, RxJS) para sistemas corporativos internos.
- Otimização de queries SQL e modelagem de banco de dados relacional.

--------------------------------------------------------------------------------

FORMAÇÃO ACADÊMICA & ESTUDOS
- Bacharelado em Análise e Desenvolvimento de Sistemas — Multivix (Previsão: Dez/2026)
- Bacharelado em Administração de Empresas — Multivix (Concluído: 2020)
- Preparação para Certificação Oficial: SAP Certified - Backend Developer - ABAP Cloud
```

---

## 🎯 6. Metas de Carreira & Próximos Passos

- [ ] Obter a certificação oficial **SAP Certified - Backend Developer - ABAP Cloud**.
- [ ] Concluir a revisão ativa das notas do curso preparatório de ABAP Cloud no cofre.
- [ ] Aprofundar práticas com **SAP Build Apps** e **SAP Build Process Automation** no ambiente [[BTP - Business Technology Platform|SAP BTP]].
- [ ] Explorar desenvolvimento no modelo **CAP (Cloud Application Programming Model)** com Node.js e TypeScript para extensibilidade *Side-by-Side*.
- [ ] Manter atualizado o portfólio de entregas e os registros de novas demandas no Segundo Cérebro.
