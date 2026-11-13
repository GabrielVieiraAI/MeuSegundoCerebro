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

# 📦 `taxastipomov` (Aplicativo 2 — SAP Fiori Elements Manutenção de Tipos de Movimento)

⬅️ [[02 - DEL-COM-165 - Arquitetura App 2 (Tipos de Movimento)|Voltar para Arquitetura App 2]] | 🎨 [[02 - DEL-COM-165 - Arquitetura Técnica App 2 (Tipos de Movimento).excalidraw|Ver no Diagrama Excalidraw App 2]]

---

## 📌 Visão Geral do Objeto

O aplicativo `taxastipomov` (repositório BSP `ZZ1_TAXTPMOV`) é o **Aplicativo 2 — Manutenção da Tabela de Tipos de Movimento**, gerado 100% no padrão **SAP Fiori Elements for OData V4 (List Report + Object Page com Draft)** sobre o serviço [[18 - ZUI_O4_FI_TAX_TPMOV|ZUI_O4_FI_TAX_TPMOV]], sem necessidade de código JavaScript customizado.

---

## ⚖️ Regras de Negócio Aplicadas

1. **Autonomia para Usuários Chave (Key Users de FI):** Permite criar, editar, inativar ou ajustar regras de Razão Especial (`umskz_deb`, `umskz_cred`), conta de contrapartida (`hkont_contrapartida`), bloqueio de pagamento (`zlspr`) e obrigatoriedade de campos (`zfbdt_obrig`, `zuonr_obrig`) diretamente no Fiori Launchpad, sem necessidade de abrir transporte ABAP para cada novo tipo de taxa.
2. **Objetos de Publicação no SAP Fiori Launchpad:**
   - **Repositório BSP:** `ZZ1_TAXTPMOV` (12 caracteres — dentro do limite máximo de 15 caracteres do padrão Veiling Holambra).
   - **Objeto Semântico:** `ZFI_TAXAS_TPMOV` | **Ação:** `manage`.
   - **Catálogo Técnico:** `ZTC_FI_TAXAS` | **Catálogo de Negócio:** `ZBC_FI_TAXAS_CFG` | **Grupo:** `ZGP_FI_TAXAS`.

---

## 🛠️ Passo a Passo da Criação do Objeto

1. **No VS Code / SAP Business Application Studio (BAS):** Abra o **Template Wizard** (`Ctrl + Shift + P` -> `Fiori: Open Application Generator`).
2. Selecione **`SAP Fiori Elements`** -> **`List Report Page`**.
3. Conecte-se ao sistema S/4HANA e selecione o serviço OData V4 **`ZUI_O4_FI_TAX_TPMOV`**.
4. Na seleção de entidades:
   - **Main Entity:** `TipoMovimento`
5. Preencha os atributos do projeto:
   - **Module name:** `taxastipomov`
   - **Application title:** `Configuração de Tipos de Movimento - Taxas`
   - **Application namespace:** `br.com.veiling.fi`
6. Execute `npm run deploy-config` e `npm run deploy` informando o pacote `ZFI_CARGA_TAXAS` e o nome BSP **`ZZ1_TAXTPMOV`**.

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
          package: ZFI_CARGA_TAXAS
          transport: S4HK900001
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
          package: ZFI_CARGA_TAXAS
          transport: S4HK900001
        exclude:
          - /test/
```
