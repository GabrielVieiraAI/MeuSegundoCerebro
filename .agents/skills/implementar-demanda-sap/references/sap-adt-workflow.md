# Referência Técnica · Fluxo e Esquemas do MCP `sap-adt`

Documento de apoio técnico para a skill `/implementar-demanda-sap`, detalhando pré-requisitos do ambiente, parâmetros exatos das ferramentas do servidor **MCP** (*Model Context Protocol*) **`sap-adt`**, tabela de tipos de objetos e mapeamento de arquivos **AFF** (*ABAP File Format*).

---

## 1. Pré-Requisitos Obrigatórios no VS Code (`sapse.adt-vscode`)

Antes de acionar o MCP, a extensão `sapse.adt-vscode` no VS Code precisa estar conectada ao sistema SAP de Desenvolvimento (`DEV`) e configurada no `settings.json`:

```json
{
  "adt.mcpServer.enableEditFileToolForABAPObjects": true,
  "adt.mcpServer.accessRestrictionsEnabled": true,
  "adt.mcpServer.accessRestrictions": {
    "destinations": ["<DESTINO_DEV>"],
    "packages-objectChanges": ["Z*", "<PREFIXO_AUTORIZADO*>"]
  }
}
```

- `adt.mcpServer.enableEditFileToolForABAPObjects`: expõe a ferramenta `abap_object_edit_file` no servidor MCP.
- `adt.mcpServer.accessRestrictionsEnabled` + `destinations` + `packages-objectChanges`: restringe gravações exclusivamente aos destinos `DEV` e aos pacotes customizados autorizados.

---

## 2. Classificação de Tipos de Objetos (MCP vs. `[Manual]`)

### 2.1. Tipos Criáveis via MCP (`creatableObjects`)

| Categoria | `objectType` | Descrição | Status de Edição / Pós-Ativação |
| :--- | :--- | :--- | :--- |
| Pacote | `DEVC/K` | Pacote de desenvolvimento | Criação suportada; propriedades de *Package Interface* / `Elements` exigem **validação empírica** no primeiro uso |
| Dicionário | `TABL/DT` | Tabela transparente | Criação suportada; código DDL/estrutura via AFF sujeito a **validação empírica** |
| Dicionário | `TABL/DS` | Estrutura (*Structure*) | Criação suportada |
| Dicionário | `DTEL/DE` | Elemento de dados (*Data Element*) | Criação suportada; propriedades AFF sujeitas a **validação empírica** |
| Mensagens | `MSAG/N` | Classe de mensagens (`SE91`) | Criação suportada; inclusão de mensagens via AFF sujeita a **validação empírica** |
| Numeração | `NROB/NRO` | Objeto de intervalo de numeração (`SNRO`) | Criação suportada; manutenção de intervalos sujeita a **validação empírica** |
| CDS / RAP | `DDLS/DF` | *Data Definition* (**CDS View**, *Core Data Services*) | Validado em uso real (criação, edição AFF, checagem, ativação simples e em lote) |
| CDS / RAP | `DDLX/EX` | *Metadata Extension* (`MDE`) | Validado em uso real |
| Segurança CDS | `DCLS/DL` | *Access Control* (`DCL`) | Validado em uso real |
| RAP Behavior | `BDEF/BDO` | *Behavior Definition* (criação base; não cobre extensão) | Validado em uso real |
| ABAP / OO | `CLAS/OC` | Classe global / *Behavior Pool* (com includes AFF) | Validado em uso real (principal + `locals_imp` / `locals_def` / `testclasses`) |
| ABAP / OO | `INTF/OI` | Interface global | Criação e edição suportadas |
| OData / RAP | `SRVD/SRV` | *Service Definition* | Validado em uso real |
| OData / RAP | `SRVB/SVB` | *Service Binding* | Criação suportada; publicação via `abap_object_list_actions` -> `abap_object_run_action` sujeita a **validação empírica** |
| Clássico | `PROG/P` | Programa executável / *Report* | Criação e edição suportadas |
| Clássico | `PROG/I` | *Include* de programa | Criação e edição suportadas |
| Clássico | `FUGR/F` | Grupo de funções | Criação e edição suportadas |
| Clássico | `FUGR/FF` | Módulo de funções (*Function Module*) | Criação e edição suportadas |
| Melhorias | `ENHO/XHB` | Implementação de **BAdI** (*Business Add-In*) | Criação suportada; configuração de filtros sujeita a **validação empírica** |

> [!NOTE] Regra de Validação Empírica Incremental
> Ao executar pela primeira vez um tipo sinalizado com **validação empírica** (ou ações como configurar *API State `C1`*, *Package Check*, *Elements* de *Package Interface*, intervalos `SNRO` ou publicação `SRVB/SVB`), se o servidor MCP retornar erro ou limitação estrutural de esquema/capacidade, interromper como erro de **Nível 2**, informar o usuário e propor reclassificação do passo para `[Manual]` no processo.

### 2.2. Tipos Exclusivamente Manuais (`[Manual]`)

Nunca tentar criar ou editar via MCP; exigir execução humana no ADT, **SAP GUI** ou **BAS** (*SAP Business Application Studio*):
- Objeto de Autorização (`SU21` / `SUSO`);
- Extensão de *Behavior Definition* (*Behavior Extension* em `unsupportedObjects`);
- Catálogo/Template de Job de Aplicação (`SAJC`);
- Objetos `UIAD/TYP`, `SRVC/SVM` e *Function Group Include* (`FUGR/I`);
- Aplicação frontend **SAPUI5** / **Fiori Elements** (geração, edição e deploy **BSP**, *Business Server Pages*, via BAS/VS Code);
- Configurações de segurança e publicação no *SAP Fiori Launchpad* (*Target Mapping*, *Tiles*, *Catalogs*, *Groups*, *Spaces/Pages*) e Perfis de Acesso (*Roles*) na transação `PFCG`.

---

## 3. Contrato Exato de Chamadas e Parâmetros `sap-adt`

### 3.1. Descoberta de Destinos e Pesquisa de Objetos

1. **`abap_destination_list`** (`{}`):
   - Retorna apenas uma lista de nomes de conexões ativas (não informa papel do sistema).
   - Aplicar filtro de bloqueio automático caso o nome contenha `QAS`, `PRD`, `PROD`, `S4Q` ou `S4P` (sem distinguir maiúsculas/minúsculas).
2. **`abap_repository_search_object`**:
   - Obrigatórios: `destination`, `pattern`.
   - Opcionais: `maximumResults` (1 a 50), `objectTypes` (`string[]`), `packages` (`string[]`).
   - Usar antes da criação para checar idempotência.

### 3.2. Cadeia Obrigatória de Pré-Criação e Criação

As ferramentas abaixo exigem estrita ordem de dependência entre chamadas:

1. **`abap_repository_list_creatable_types`**:
   - Parâmetros: `{ "destination": "<DEST_DEV>" }`.
2. **`abap_object_get_creatable_type_detail`**:
   - Obrigatórios: `destination`, `objectType`. Opcionais: `name`, `description`.
   - **Obrigatório chamar antes de validar ou criar** para descobrir campos adicionais exigidos pelo tipo no servidor (ex.: `parentObject`, `bindingType`, `serviceDefinition`, `rootEntity`, `supportsRecordChanges`, `transportLayer`).
3. **`abap_object_validate_creation`**:
   - Obrigatórios: `destination`, `objectType`, `objectContent` (string **JSON**, *JavaScript Object Notation*, contendo **apenas os metadados** do passo anterior, **nunca o código-fonte ABAP/CDS**).
4. **Consulta e Seleção de Transport Request (`TR`)**:
   - **Nunca autoselecionar TR.**
   - **`abap_transport_get_request`**:
     - Obrigatórios: `destination`, `isCreation`, `objectIdentifier`.
     - **Atenção ao formato de `objectIdentifier`:**
       - Quando **`isCreation: true`**, passar objeto plano com o tipo de criação principal (`CLAS/OC`, `DEVC/K`, etc.):
         ```json
         {
           "objectName": "ZCL_EXEMPLO",
           "objectType": "CLAS/OC",
           "developmentPackage": "ZPACOTE_EXEMPLO"
         }
         ```
         *(Para pacotes `DEVC/K`, pode aceitar `supportsRecordChanges` e `transportLayer`; para subobjetos, `parentObject`.)*
       - Quando **`isCreation: false`**, passar objeto encapsulado em **`objectIdentifier` interno**:
         ```json
         {
           "objectIdentifier": {
             "objectName": "ZCL_EXEMPLO",
             "objectType": "CLAS"
           }
         }
         ```
         *(Aceita alternativamente `"uri"` ou `"affFileName"` dentro do `objectIdentifier` interno.)*
   - **`abap_transport_create_request`** *(somente se o usuário escolher criar uma nova TR após `abap_transport_get_request`)*:
     - Obrigatórios: `destination`, `objectIdentifier` (mesmo contrato acima), `isCreation`, `shortDescription` (1 a 60 caracteres).
     - Opcionais: `changeGuid`, `ctsProject`.
5. **`abap_object_create`**:
   - Obrigatórios: `destination`, `objectType`, `objectContent` (JSON validado em `validate_creation`), `transportRequestNumber` (`""` **apenas** se `$TMP` autorizado explicitamente pelo usuário).
   - Cria somente o esqueleto/metadados no SAP; **não grava o código-fonte completo**.

---

## 4. Leitura e Edição Multi-Arquivo (**AFF**)

Após criar o objeto (ou ao atualizar objeto já existente):

1. **`abap_object_list_file_uris`**:
   - Parâmetros: `{ "destination": "<DEST_DEV>", "objectIdentifier": { "objectName": "...", "objectType": "..." } }`.
   - Lista todos os arquivos **AFF** que compõem o objeto, incluindo a definição principal, arquivo de propriedades `.json` e *includes* secundários.
2. **`abap_object_get_aff_specification`** *(quando precisar editar arquivo `.json` de metadados/propriedades AFF ou conferir estrutura de arquivos)*:
   - Parâmetros: `{ "destination": "<DEST_DEV>", "objectIdentifier": ... }`.
   - Retorna `affJsonSchema`, `affConfiguration` e `files`.
3. **Mapeamento típico de arquivos AFF para `CLAS/OC` (*Behavior Pool* / Classe Global):**

| Aba / Sub-bloco na Nota (`04 - Objetos Tecnicos`) | Arquivo / Sufixo AFF típico | Finalidade |
| :--- | :--- | :--- |
| Global Class (`Definition` / `Implementation`) | `<nome>.clas.abap` | Classe global principal (`PUBLIC SECTION`, `BEHAVIOR OF`, etc.) |
| Local Types (`CCIMP`) | `<nome>.clas.locals_imp.abap` | Implementação de classes locais (*handler* / *saver* RAP) |
| Local Definitions (`CCDEF`) | `<nome>.clas.locals_def.abap` | Definições de tipos e classes auxiliares locais |
| Test Classes (`CCAU`) | `<nome>.clas.testclasses.abap` | Classes de teste unitário **ABAP Unit** |
| Propriedades / Metadados | `<nome>.clas.json` | Metadados AFF (editar somente se necessário e validado contra `affJsonSchema`) |

> [!IMPORTANT] Regra de Segurança em `abap_object_read_file` e `abap_object_edit_file`
> - Leia o arquivo alvo completo via `abap_object_read_file` (`version: "WORKING_AREA"` ou `"INACTIVE"`). Se houver paginação (`offset` / `limit`), leia todas as páginas antes de montar `oldString`. Nunca use trecho truncado como `oldString`.
> - Para inserir conteúdo em arquivo recém-criado e vazio, passe `oldString: ""` e `newString` não vazio.
> - Para arquivos que já possuem esqueleto padrão gerado pelo SAP, substitua exatamente o conteúdo retornado por `abap_object_read_file`.
> - Passe `transportNumber` sempre que aplicável. `abap_object_edit_file` salva versão inativa e **não ativa automaticamente**.

---

## 5. Checagem, Ativação, Ações Pós-Ativação, **ATC** e Diff

1. **`abap_object_check`**:
   - Parâmetros: `{ "destination": "<DEST_DEV>", "objectIdentifiers": [ ... ] }`.
   - Em blocos circulares, incluir todos os identificadores do grupo no array `objectIdentifiers`.
2. **`abap_object_activate`**:
   - Parâmetros: `{ "destination": "<DEST_DEV>", "objectIdentifiers": [ ... ] }`.
   - Para blocos circulares marcados com **`[Ativação em Massa: Ctrl + Shift + F3]`**, enviar todos os objetos do grupo em **uma única chamada** após editar todos eles.
3. **Ações Pós-Ativação (quando aplicável, ex.: publicar `SRVB/SVB`)**:
   - Primeiro chamar `abap_object_list_actions` (`destination`, `objectType`, `objectName`) para descobrir `actionId` e o esquema do `payload`.
   - Executar via `abap_object_run_action` (`destination`, `objectType`, `objectName`, `actionId`, `payload`) quando a ação/payload for inequívoca para o passo; se houver ambiguidade ou erro, parar como **Nível 2** e confirmar com o usuário.
4. **ATC Obrigatório (`ABAP Test Cockpit`)**:
   - Pré-condição: objeto(s) sem erros de sintaxe e já ativado(s).
   - **`abap_atc_run_start`**: `{ "destination": "<DEST_DEV>", "objects": [ ... ] }`. **Não especificar `checkVariant`** (usa a variante padrão do sistema).
   - **`abap_atc_run_get_result`**: `{ "destination": "<DEST_DEV>", "worklistId": "<ID>", "cursor": "0" }`. Consultar novamente caso a execução ainda esteja em andamento e paginar usando `nextCursor` até finalizar.
   - Tratar achados Prioridade 1 (erro crítico) conforme fluxo Nível 1 / Nível 2; apenas listar Prioridades 2 e 3 no relatório final.
5. **Diff Unificado da TR (Opcional — somente sob solicitação explícita)**:
   - **`abap_transport_get_unified_diff`**: `{ "destination": "<DEST_DEV>", "transportNumber": "<TR>", "pageSize": 40 }`, paginando por `cursor` até `status` completo. Nunca executar por padrão ao final de cada passo.

### 5.1. Outras Ferramentas MCP e Limites de Escopo

- **Testes unitários e correções ATC (`abap_unit_run_tests`, `abap_atc_quickfixes_apply`, `abap_atc_ai_*`):** podem ser acionados apenas quando solicitados pelo usuário ou aprovados no tratamento de achados ATC.
- **Inspeção de serviços (`abap_business_service_*`) e feeds (`abap_feed_*`):** uso auxiliar somente para consulta diagnóstica.
- **Geradores automáticos (`abap_objects_generator_*`):** **fora do fluxo padrão** de `/implementar-demanda-sap`, pois geram objetos RAP padrão SAP em vez de aplicar o código customizado documentado em `04 - Objetos Tecnicos/`.
