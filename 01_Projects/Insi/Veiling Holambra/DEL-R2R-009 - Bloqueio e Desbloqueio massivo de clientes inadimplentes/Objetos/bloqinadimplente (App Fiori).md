---
tags:
  - projeto
  - insi
  - veiling-holambra
  - sap
  - fiori
  - ui5
  - del-r2r-009
  - objeto-tecnico
id_demanda: DEL-R2R-009
objeto: bloqinadimplente
camada: 6 - Camada Frontend (SAP Fiori Elements & Launchpad)
data: 2026-10-23
---

# 📱 `bloqinadimplente` (App SAP Fiori Elements & Launchpad)

⬅️ [[DEL-R2R-009 - Arquitetura e Objetos|Voltar para Arquitetura e Objetos]] | 🎨 [[DEL-R2R-009 - Arquitetura da Camada CDS.excalidraw|Ver no Diagrama Excalidraw]]

---

## 📌 Visão Geral do Objeto

O **`bloqinadimplente`** é a aplicação frontend gerada no template **SAP Fiori Elements (List Report)** a partir do serviço OData V2 `[[ZUI_O2_FI_CLIENTE_INAD]]` e publicada no repositório ABAP sob o contêiner BSP **`ZZ1_BLOQ_INAD`**.

Esta nota também documenta os objetos de configuração do **SAP Fiori Launchpad** que disponibilizam o bloco (Tile) do aplicativo para os usuários finais:
- **Catálogo Técnico:** `ZTC_FI_INADIMPLENCIA`
- **Catálogo de Negócio:** `ZBC_FI_INADIMPLENCIA`
- **Grupo / Espaço e Página:** `ZGP_FI_INADIMPLENCIA`

---
## ⚖️ Regras de Negócio Aplicadas

1. **List Report com Seleção Múltipla em Massa:** Habilita caixas de seleção (*checkboxes*) em todas as linhas da tabela (`multiSelect: true`), permitindo ao operador selecionar dezenas de clientes de uma só vez e acionar **Bloquear** ou **Desbloquear**.
2. **Ordenação Inicial por Ação Proposta (`Bloquear`):** Segue a anotação `@UI.presentationVariant` da Metadata Extension (`[[ZC_FI_CLIENTE_INADIMPLENTE (MDE)]]`), exibindo no topo os clientes com ação proposta **Bloquear**.
3. **Resumo Único em Lote (Message View):** Quando múltiplos clientes são processados em lote (`$batch`), o Fiori Elements OData V2 agrupa automaticamente as mensagens retornadas pela classe `[[ZCLFI_BP_CLIENTE_INAD]]` em um único componente **Message View** (evitando múltiplos pop-ups).

---
## 🛠️ Passo a Passo da Criação do Objeto

### 1. Criação do Projeto no VS Code (SAP Fiori Generator)

Esta seção detalha o fluxo completo de geração, configuração e deploy da aplicação utilizando o **Visual Studio Code** com a extensão oficial **SAP Fiori tools - Extension Pack**.
- Pré-Requisitos no VS Code
	* **Extensão Instalada:** `SAP Fiori tools - Extension Pack` (publicada pela SAP na Marketplace do VS Code);
	* **Node.js:** Versão LTS (v18 ou v20 recomendada);
	* **Backend Ativo:** O Service Binding [[ZUI_O2_FI_CLIENTE_INAD]] deve estar publicado e ativo no SAP.
-  Abrir o Assistente de Geração (Application Generator)
	1. No VS Code, abra a paleta de comandos: pressione **`Ctrl + Shift + P`** (ou `F1`).
	2. Digite e selecione: **`Fiori: Open Application Generator`**.
	3. Aguarde o carregamento da interface visual do gerador.

---
### 3. Passo a Passo do Wizard

#### 🔹 Etapa 1: Template Selection (Tipo de Aplicação)
* **Application Type:** `SAP Fiori elements`
* **Floorplan:** Selecione **`List Report Page`**
* Clique em **Next**.

#### 🔹 Etapa 2: Data Source and Service Selection (Fonte de Dados)
* **Data source:** Selecione **`Connect to a System`**
* **System:** Selecione o sistema SAP de desenvolvimento conectado (ex.: `S4D`).
  *(Caso conecte via URL direta do Gateway, escolha `Connect to an OData Service` e informe o endpoint: `/sap/opu/odata/sap/ZUI_O2_FI_CLIENTE_INAD/`)*.
* **Service:** Localize e selecione o serviço **`ZUI_O2_FI_CLIENTE_INAD`**.
* Clique em **Next**.

#### 🔹 Etapa 3: Entity Selection (Entidade Principal)
* **Main entity:** Selecione **`ClienteInadimplente`** (entidade raiz exposta pelo Service Definition).
* **Table Type:** Selecione **`Responsive`** (Tabela responsiva padrão SAPUI5 com suporte nativo a seleção múltipla e ações em lote).
* **Navigation entity:** Se exibido, deixe como **`None`** (a aplicação opera em lista direta, sem página de detalhes secundária).
* Clique em **Next**.

#### 🔹 Etapa 4: Project Attributes (Identificação do Projeto)
* **Module name:** `bloqinadimplente`
* **Application title:** `Bloquear/Desbloquear Clientes Inadimplentes`
* **Application namespace:** `br.com.veiling`
* **Description:** `DEL-R2R-009: Bloqueio e Desbloqueio massivo de clientes inadimplentes`
* **Project folder path:** Selecione a pasta do seu computador onde o projeto será criado.
* **Minimum SAPUI5 version:** Selecione a versão recomendada compatível com o S/4HANA da Veiling (ex.: `1.108.x` ou superior).
* **Add deployment configuration:** Marque **`Yes`** (para configurar o deploy ABAP de imediato).
* **Add FLP configuration:** Marque **`Yes`** (para testar em ambiente sandbox do Fiori Launchpad).
* Clique em **Next**.

#### 🔹 Etapa 5: Deployment Configuration (Destino no Servidor ABAP)
* **Please choose the target:** `ABAP`
* **Select Target System:** Selecione o sistema conectado (ex.: `S4D, client 100 [GVSOUZA] (Source system)`).
* **SAPUI5 ABAP Repository:** **`ZZ1_BLOQ_INAD`** *(Nome técnico da aplicação BSP no SAP, máximo de 15 caracteres)*.
* **Deployment Description:** `DEL-R2R-009: Bloqueio Inadimplentes` *(Descrição breve do artefato no repositório)*.
* **Select How You Want to Enter the Package:** `Enter Manually`
* **Package:** **`ZFI_BLOQ_INADIMPLENTES`** *(Substitua o `$TMP` padrão pelo pacote de transporte oficial da demanda)*.
* **Transport Request (TR):** *(Exibido após informar o pacote não-temporário)* Selecione ou informe a sua ordem de transporte de desenvolvimento (`S4DK900...`).
* Clique em **Next**.

#### 🔹 Etapa 6: Fiori Launchpad Configuration (Navegação FLP)
* **Semantic Object:** `Cliente` (ou `ZClienteInad`)
* **Action:** `bloquear` (ou `manage`)
* **Title:** `Bloquear/Desbloquear Clientes Inadimplentes`
* Clique em **Finish**. O assistente iniciará o download dos pacotes via `npm install`.

---

### 4. Ajuste Crítico Pós-Geração: Habilitar Seleção Múltipla (`manifest.json`)

Por padrão, o gerador cria a tabela configurada com seleção única (`single`). Como a nossa demanda exige **bloqueio em lote**, é obrigatório habilitar a seleção múltipla:

1. No explorador de arquivos do VS Code, abra o arquivo:
   `webapp/manifest.json`
2. Navegue até a seção `sap.ui.generic.app` -> `pages` -> `ListReport|ClienteInadimplente` -> `component` -> `settings`.
3. Localize ou adicione o bloco `tableSettings`:
   ```json
   "tableSettings": {
     "type": "ResponsiveTable",
     "multiSelect": true
   }
   ```
4. Adicione também no nível de `settings` a propriedade para layout compacto:
   ```json
   "condensedTableLayout": true
   ```
5. Salve o arquivo (`Ctrl + S`).

---

### 5. Como Testar Localmente no VS Code

1. Abra o terminal integrado do VS Code (`Ctrl + '` ou menu *Terminal -> New Terminal*).
2. Execute o comando de inicialização local:
   ```bash
   npm start
   ```
   *(Nota: Nas versões atuais das SAP Fiori Tools, o comando `npm start` inicializa o servidor local com o sandbox do Launchpad. Caso utilize o script explícito, execute `npm run start-noflp`).*
3. O navegador abrirá automaticamente a página de teste (Fiori Launchpad Sandbox).
4. **O que conferir no teste local:**
   - As caixas de seleção (*checkboxes*) aparecem ao lado de cada cliente na tabela;
   - Os filtros do topo (`Ação Proposta`, `Cliente`, `Segmento de Atuação`, `Classe de Risco`) filtram os dados corretamente;
   - Os botões **Bloquear** e **Desbloquear** aparecem na barra da tabela e disparam as ações no backend.

---

### 6. Como Fazer o Deploy no Servidor ABAP

Quando os testes locais estiverem validados:

1. No terminal integrado do VS Code, execute:
   ```bash
   npm run deploy
   ```
2. O script do Fiori Tools compilará a aplicação (gerando a pasta `dist`), se conectará ao SAP e criará o objeto BSP **`ZZ1_BLOQ_INAD`** associado à TR informada.
3. Ao finalizar com sucesso, o terminal exibirá:
   `Deployment Successful.`
   E o aplicativo estará fisicamente publicado no servidor ABAP!

---

### 7. Solicitação de Publicação no Launchpad (Envio de E-mail ao Basis)

Após a conclusão bem-sucedida do deploy, o aplicativo BSP já existe no servidor, mas precisa ser publicado no **SAP Fiori Launchpad** pelo time de **Basis / Segurança** para que o bloco (*Tile*) apareça na tela inicial dos usuários e na sua conta de desenvolvedor para testes.

Envie um e-mail / chamado para o responsável de Basis com as informações técnicas estruturadas:

#### 📧 Modelo do E-mail Enviado

* **Assunto:** `Veiling - DEL-R2R-009 - Bloquear/Desbloquear Clientes Inadimplentes`
* **Destinatário:** `@Bruno Zastrow`

> Bom dia!
> 
> @Bruno Zastrow Por gentileza, publique o app a seguir no Launchpad, Preciso testa-lo no ambiente de desenvolvimento (S4D)?

| Campo | Valor |
| :--- | :--- |
| **Título:** | Bloquear/Desbloquear Clientes Inadimplentes |
| **Subtítulo:** | Bloqueio/Desbloqueio massivo de Inadimplentes |
| **Ícone:** | `sap-icon://user-settings` |
| **Objeto Semântico:** | `ZClienteInad` |
| **Ação:** | `manage` |
| **URL:** | `/sap/bc/ui5_ui5/sap/zz1_bloq_inad` |
| **ID:** | `br.com.veiling.bloqinadimplente` |
| **Catálogo:** | `ZTC_FI_INADIMPLENCIA` |
| **Role:** | `FI` |

---

## 💻 Snippet de Código

### 📝 Código Comentado (Para Estudo e Referência)

Trecho principal de configuração do `manifest.json` da aplicação Fiori Elements (OData V2 List Report com seleção múltipla e navegação interna configuradas):

```jsonc
{
  "_version": "1.59.0",
  "sap.app": {
    "id": "br.com.veiling.bloqinadimplente",                           // Identificador único da aplicação UI5 no repositório BSP
    "type": "application",                                            // Tipo de artefato: aplicação executável
    "title": "{{appTitle}}",                                          // Título da aplicação referenciado no i18n
    "description": "{{appDescription}}",                              // Descrição da demanda no i18n
    "dataSources": {
      "mainService": {
        "uri": "/sap/opu/odata/sap/ZUI_O2_FI_CLIENTE_INAD/",           // Endpoint do serviço OData V2 publicado no SAP Gateway
        "type": "OData",                                               // Protocolo de comunicação baseado em padrões abertos OData
        "settings": {
          "odataVersion": "2.0"                                        // Versão do protocolo OData consumida pelo List Report
        }
      }
    },
    "crossNavigation": {
      "inbounds": {
        "ZClienteInad-manage": {
          "semanticObject": "ZClienteInad",                            // Objeto semântico para navegação no Fiori Launchpad
          "action": "manage",                                          // Ação de gerenciamento do aplicativo
          "title": "{{ZClienteInad-manage.flpTitle}}",
          "subTitle": "{{ZClienteInad-manage.flpSubtitle}}"
        }
      }
    }
  },
  "sap.ui.generic.app": {
    "_version": "1.3.0",
    "settings": {
      "forceGlobalRefresh": true                                       // Recarrega os dados da tela após a execução de ações em massa
    },
    "pages": {
      "ListReport|ClienteInadimplente": {
        "entitySet": "ClienteInadimplente",                            // Entidade raiz exposta pelo Service Definition
        "component": {
          "name": "sap.suite.ui.generic.template.ListReport",          // Template padrão SAP Fiori Elements List Report
          "list": true,
          "settings": {
            "condensedTableLayout": true,                              // Layout compacto da tabela para visualizar mais linhas
            "smartVariantManagement": true,                            // Habilita salvar variantes de filtro/visão por usuário
            "enableTableFilterInPageVariant": true,                    // Sincroniza a barra de filtros com a variante da página
            "tableSettings": {
              "type": "ResponsiveTable",                               // Tabela responsiva padrão SAPUI5
              "multiSelect": true                                      // Habilita checkboxes para seleção e processamento em lote
            }
          }
        }
      }
    }
  }
}
```

---

### 🚀 Código Limpo (Sem Comentários - Para Copiar e Colar)

```jsonc
{
  "_version": "1.59.0",
  "sap.app": {
    "id": "br.com.veiling.bloqinadimplente",
    "type": "application",
    "title": "{{appTitle}}",
    "description": "{{appDescription}}",
    "dataSources": {
      "mainService": {
        "uri": "/sap/opu/odata/sap/ZUI_O2_FI_CLIENTE_INAD/",
        "type": "OData",
        "settings": {
          "odataVersion": "2.0"
        }
      }
    },
    "crossNavigation": {
      "inbounds": {
        "ZClienteInad-manage": {
          "semanticObject": "ZClienteInad",
          "action": "manage",
          "title": "{{ZClienteInad-manage.flpTitle}}",
          "subTitle": "{{ZClienteInad-manage.flpSubtitle}}"
        }
      }
    }
  },
  "sap.ui.generic.app": {
    "_version": "1.3.0",
    "settings": {
      "forceGlobalRefresh": true
    },
    "pages": {
      "ListReport|ClienteInadimplente": {
        "entitySet": "ClienteInadimplente",
        "component": {
          "name": "sap.suite.ui.generic.template.ListReport",
          "list": true,
          "settings": {
            "condensedTableLayout": true,
            "smartVariantManagement": true,
            "enableTableFilterInPageVariant": true,
            "tableSettings": {
              "type": "ResponsiveTable",
              "multiSelect": true
            }
          }
        }
      }
    }
  }
}
```
