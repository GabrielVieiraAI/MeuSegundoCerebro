---
tipo: objeto-tecnico
tags:
  - projeto
  - veiling-holambra
  - sap
  - fi
  - fiori
  - odata-v4
  - abap-cloud
  - del-com-165
  - objeto-tecnico
id_demanda: DEL-COM-165
objeto: "taxastipomov (App Fiori)"
camada: "6 - Frontend"
data: 2026-11-11
aliases:
  - "taxastipomov (App Fiori)"
  - "taxastipomov"
  - "ZZ1_TAXTPMOV"
---

# 📦 `taxastipomov` (Aplicativo de Tipos de Movimento (`ZFI_TAX_TPMOV`) — SAP Fiori Elements Manutenção de Tipos de Movimento)

⬅️ [[02 - DEL-COM-165 - Arquitetura (Tipos de Movimento)|Voltar para Arquitetura (Tipos de Movimento)]] | 🎨 [[02 - DEL-COM-165 - Arquitetura Técnica (Tipos de Movimento).excalidraw|Ver no Diagrama Excalidraw (Tipos de Movimento)]]

---

## 📌 Visão Geral do Objeto

O aplicativo `taxastipomov` (repositório BSP `ZZ1_TAXTPMOV`) é o **Aplicativo de Tipos de Movimento (`ZFI_TAX_TPMOV`)**, gerado 100% no padrão **SAP Fiori Elements for OData V4 (List Report + Object Page com Draft)** sobre o serviço [[18 - ZUI_O4_FI_TAX_TPMOV|ZUI_O4_FI_TAX_TPMOV]], sem necessidade de código JavaScript customizado.

---

## ⚖️ Regras de Negócio Aplicadas

1. **Autonomia para Usuários Chave (Key Users de FI):** Permite criar, editar, inativar ou ajustar regras de Razão Especial (`umskz_deb`, `umskz_cred`), conta de contrapartida (`hkont_contrapartida`), bloqueio de pagamento (`zlspr`) e obrigatoriedade de campos (`zfbdt_obrig`, `zuonr_obrig`) diretamente no Fiori Launchpad, sem necessidade de abrir transporte ABAP para cada novo tipo de taxa.
2. **Objetos de Publicação no SAP Fiori Launchpad:**
   - **Repositório BSP:** `ZZ1_TAXTPMOV` (12 caracteres — dentro do limite máximo de 15 caracteres do padrão Veiling Holambra).
   - **Objeto Semântico:** `ZFI_TAXAS_TPMOV` | **Ação:** `manage`.
   - **Catálogo Técnico:** `ZTC_FI_TAXAS` | **Catálogo de Negócio:** `ZBC_FI_TAXAS_CFG` | **Grupo:** `ZGP_FI_TAXAS`.

---

## 🛠️ Passo a Passo da Criação do Objeto

### 🔖 Metadados ADT

```yaml
objectType: "BSP / SAPUI5 (Manual)"
packageName: "ZFI_TAX_TPMOV"
name: "ZZ1_TAXTPMOV"
description: "DEL-COM-165: App Fiori Tipos de Movimento de Taxas"
extraParams:
  fioriModule: "taxastipomov"
  odataService: "ZUI_O4_FI_TAX_TPMOV"
  semanticObject: "ZFI_TAXAS_TPMOV"
```

### 1. Pré-requisitos no VS Code

* **Extensão instalada:** `SAP Fiori tools - Extension Pack` (extensão oficial da SAP no VS Code).
* **Node.js:** Versão LTS (Long Term Support, ex.: v18 ou v20).
* **Backend ativo:** O *Service Binding* (*vínculo de serviço*) [[18 - ZUI_O4_FI_TAX_TPMOV|ZUI_O4_FI_TAX_TPMOV]] deve estar publicado e ativo no sistema `S4D`.

### 2. Geração do Projeto (SAP Fiori Application Generator)

1. **No VS Code ou SAP Business Application Studio (BAS):** Abra a paleta de comandos (`Ctrl + Shift + P`) e selecione **`Fiori: Open Application Generator`**.
2. Em **Template Selection**, selecione **`SAP Fiori Elements`** -> **`List Report Page`** e clique em **Next**.
3. Em **Data Source and Service Selection**:
   - **Data source:** `Connect to a System`
   - **System:** Selecione a conexão do S/4HANA de desenvolvimento (ex.: `S4D, client 100 Veiling [GVSOUZA]`).
   - **Service:** Selecione o serviço OData V4 **`ZUI_O4_FI_TAX_TPMOV`** e clique em **Next**.
4. Em **Entity Selection**:
   - **Main entity:** `TipoMovimento`
   - Clique em **Next**.
5. Em **Project Attributes**, preencha os atributos do projeto:
   - **Module name:** `taxastipomov`
   - **Application title:** `Configuração de Tipos de Movimento - Taxas`
   - **Application namespace:** `br.com.veiling.fi` *(forma o ID UI5 completo `br.com.veiling.fi.taxastipomov`)*
   - **Add deployment configuration:** Selecione **`Yes`** se quiser configurar o deploy imediatamente durante a criação (ou deixe `No` para configurar depois pela aba *Application Info*, conforme o passo 3 abaixo).
   - Clique em **Next** (ou **Finish**, caso não tenha marcado `Add deployment configuration` ainda).

### 3. Configuração do Deploy pela Extensão Fiori (`Deployment Configuration Generator`)

Caso tenha selecionado `Add deployment configuration: Yes` na criação, o wizard já abrirá esta etapa automaticamente. Se o projeto já foi gerado e você está com ele aberto no VS Code:

1. **Abra o configurador de deploy** de uma das três formas:
   - Na aba **`Application Info`** (que abre após gerar o projeto, ou via `Ctrl + Shift + P` -> **`Fiori: Open Application Info`**), clique em **`Add Deployment Configuration`**; **ou**
   - Pela paleta de comandos (`Ctrl + Shift + P`), execute **`Fiori: Add Deployment Configuration`**; **ou**
   - Pelo terminal integrado do VS Code (`Ctrl + '`), execute `npm run deploy-config`.
2. Na tela **`Deployment Configuration Generator`**, preencha os campos na ordem abaixo:
   - **Please choose the target (Target Type):** Selecione **`ABAP`**.
   - **Select Target System:** Selecione o sistema SAP conectado (ex.: **`S4D, client 100 Veiling [GVSOUZA] (Source system)`**).
   - **SAPUI5 ABAP Repository (`*`):** Digite **`ZZ1_TAXTPMOV`** *(nome técnico da aplicação **BSP** — Business Server Pages — no repositório ABAP; obrigatório ter no máximo **15 caracteres**, usando apenas letras, números ou `_`, e ser único no servidor)*.
   - **Deployment Description:** Digite **`DEL-COM-165: Manutenção Tipos de Movimento Taxas`** *(descrição breve exibida no repositório BSP do SAP)*.
   - **Select How You Want to Enter the Package (`*`):** Selecione **`Enter Manually`** *(ou `List Existing Packages`, caso prefira selecionar da lista)*.
   - **Package (`*`):** Apague o valor padrão **`$TMP`** (pacote local que não permite transporte entre ambientes) e informe **`ZFI_TAX_TPMOV`**.
   - **Configuração da Ordem de Transporte — TR (*Transport Request*):** Assim que você substituir `$TMP` por `ZFI_TAX_TPMOV`, a tela exibirá os campos de transporte logo abaixo de *Package*:
     - **Select How You Want to Enter the Transport Request:** Selecione **`Enter Manually`** *(ou `Choose from Existing` para escolher uma TR aberta no seu usuário)*.
     - **Transport Request:** Informe a TR da demanda (**`S4DK901042`** ou a TR de desenvolvimento ativa no momento).
3. Confira se todos os campos obrigatórios (`*`) estão preenchidos e clique no botão **`Finish`** no rodapé da tela.
4. A extensão Fiori criará/atualizará automaticamente o arquivo **`ui5-deploy.yaml`** na raiz do projeto e configurará o script `"deploy"` no arquivo **`package.json`**.

### 4. Execução do Deploy e Validação no SAP

1. *(Opcional, mas recomendado)* Antes do deploy, teste o app localmente executando **`npm start`** no terminal integrado (`Ctrl + '`) para validar se os dados da tabela carregam e se a criação/edição com *Draft* funciona.
2. Com o projeto validado, execute o comando de deploy no terminal integrado do VS Code:
   ```bash
   npm run deploy
   ```
3. Se o terminal pedir confirmação com o resumo do pacote, BSP e TR (*Start deployment (y/N)*), digite **`y`** e pressione **`Enter`**.
4. Aguarde o término do *build* (compilação da pasta `dist`) e o envio dos arquivos para o SAP até visualizar a mensagem de conclusão (ex.: **`Deployment Successful.`**).
5. **Validação no Eclipse ADT (*ABAP Development Tools*):** No *Project Explorer*, atualize (`F5`) o pacote **`ZFI_TAX_TPMOV`** e confirme que o objeto **`ZZ1_TAXTPMOV`** aparece em **`BSP Library -> BSP Applications`**.

---

## 💻 Snippet de Código

### 📝 Código Comentado (Para Estudo e Referência)

```yaml
# =========================================================================
# ARQUIVO: ui5-deploy.yaml (Configuração de Deploy no Repositório ABAP)
# =========================================================================
specVersion: "3.0"
metadata:
  name: br.com.veiling.fi.taxastipomov
type: application
resources:
  configuration:
    propertiesFileSourceEncoding: UTF-8
builder:
  resources:
    excludes:
      - /test/**
      - /localService/**
  customTasks:
    - name: deploy-to-abap
      afterTask: generateCachebusterInfo
      configuration:
        target:
          destination: S4HANA_VH
        app:
          # Nome do objeto BSP limitado a 15 caracteres conforme padrão Veiling Holambra
          name: ZZ1_TAXTPMOV
          description: "DEL-COM-165: Manutenção Tipos de Movimento Taxas"
          package: ZFI_TAX_TPMOV
          transport: S4DK901042
        exclude:
          - /test/
```

---

### 🚀 Código Limpo (Sem Comentários - Para Copiar e Colar)

```yaml
specVersion: "3.0"
metadata:
  name: br.com.veiling.fi.taxastipomov
type: application
resources:
  configuration:
    propertiesFileSourceEncoding: UTF-8
builder:
  resources:
    excludes:
      - /test/**
      - /localService/**
  customTasks:
    - name: deploy-to-abap
      afterTask: generateCachebusterInfo
      configuration:
        target:
          destination: S4HANA_VH
        app:
          name: ZZ1_TAXTPMOV
          description: "DEL-COM-165: Manutenção Tipos de Movimento Taxas"
          package: ZFI_TAX_TPMOV
          transport: S4DK901042
        exclude:
          - /test/
```
