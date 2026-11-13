---
tipo: objeto-tecnico
tags:
  - projeto
  - veiling-holambra
  - sap
  - fi
  - fiori
  - ui5
  - odata-v4
  - abap-cloud
  - del-com-165
  - objeto-tecnico
id_demanda: DEL-COM-165
objeto: "taxascarga (App Fiori)"
camada: "6 - Frontend"
data: 2026-11-11
aliases:
  - "taxascarga (App Fiori)"
  - "taxascarga"
  - "ZZ1_TAXCARGA"
---

# 📦 `taxascarga` (Aplicativo 1 — SAP Fiori Elements + Controller Extension Excel)

⬅️ [[01 - DEL-COM-165 - Arquitetura App 1 (Carga Massiva de Taxas)|Voltar para Arquitetura App 1]] | 🎨 [[01 - DEL-COM-165 - Arquitetura Técnica App 1 (Carga Massiva).excalidraw|Ver no Diagrama Excalidraw App 1]]

---

## 📌 Visão Geral do Objeto

O aplicativo `taxascarga` (repositório BSP `ZZ1_TAXCARGA`) é o **Aplicativo 1 — Carga Massiva e Monitor de Taxas com Razão Especial**, gerado no template **SAP Fiori Elements for OData V4 (List Report + Object Page)** sobre o serviço [[34 - ZUI_O4_FI_TAX_CARGA|ZUI_O4_FI_TAX_CARGA]].

Para permitir o envio de arquivos `.xlsx` locais sem exigir infraestrutura externa e fazer o download direto do template gerado pela `XCO_CP_XLSX`, o aplicativo inclui uma **Controller Extension** enxuta (`webapp/ext/controller/ListReportExt.controller.js`) com dois botões customizados na barra da tabela:
1. **`Carregar Planilha (.xlsx)`:** Abre o seletor de arquivos nativo do navegador (`<input type="file" accept=".xlsx">`), converte o arquivo selecionado para `Base64`, chama a action OData V4 `carregarArquivo` e atualiza a lista automaticamente com o resultado da verificação (`BAPI_ACC_DOCUMENT_CHECK`).
2. **`Baixar Modelo Excel`:** Invoca a action OData V4 `baixarModelo`, recebe o `Base64` gerado pelo backend e dispara o download imediato do arquivo `DEL-COM-165_Modelo_Layout_Carga.xlsx` no navegador.

---

## ⚖️ Regras de Negócio Aplicadas

1. **Navegação em 3 Níveis no Fiori Elements:**
   - **Página 1 (List Report):** Lista de Lotes (`Carga`), com filtros por ID, Status e Usuário, e botões `Carregar Planilha (.xlsx)`, `Baixar Modelo Excel` e `Contabilizar Lote`.
   - **Página 2 (Object Page — Lote):** Cabeçalho com resumo do lote e tabela de documentos contábeis agrupados por `DOCSEQ` (`Documento`), exibindo status colorido, `BELNR` gerado e mensagem da BAPI.
   - **Página 3 (Sub-Object Page — Documento):** Detalhes do documento e tabela de partidas individuais (`Item`), incluindo a linha gerada automaticamente na conta `2205010002` para o movimento `DS-ATR`.
2. **Objetos de Publicação no SAP Fiori Launchpad:**
   - **Repositório BSP:** `ZZ1_TAXCARGA` (12 caracteres — respeita o limite máximo de 15 do padrão Veiling Holambra).
   - **Objeto Semântico:** `ZFI_TAXAS_CARGA` | **Ação:** `manage`.
   - **Catálogo Técnico:** `ZTC_FI_TAXAS` | **Catálogo de Negócio:** `ZBC_FI_TAXAS` | **Grupo:** `ZGP_FI_TAXAS`.

---

## 🛠️ Passo a Passo da Criação do Objeto

1. **No VS Code / SAP Business Application Studio (BAS):** Abra o **Template Wizard** (`Ctrl + Shift + P` -> `Fiori: Open Application Generator`).
2. Selecione **`SAP Fiori Elements`** -> **`List Report Page`**.
3. Conecte-se ao sistema S/4HANA e selecione o serviço OData V4 **`ZUI_O4_FI_TAX_CARGA`**.
4. Na seleção de entidades:
   - **Main Entity:** `Carga`
   - **Navigation Entity:** `_Documentos`
5. Preencha os atributos do projeto:
   - **Module name:** `taxascarga`
   - **Application title:** `Carga Massiva de Taxas com Razão Especial`
   - **Application namespace:** `br.com.veiling.fi`
6. Após gerar o projeto, crie o arquivo `webapp/ext/controller/ListReportExt.controller.js` e adicione o bloco `extends` e `customActions` no `webapp/manifest.json` conforme os snippets abaixo.
7. Execute `npm run deploy-config` e `npm run deploy` informando o pacote `ZFI_CARGA_TAXAS` e o nome BSP **`ZZ1_TAXCARGA`**.

---

## 💻 Snippet de Código

### 📝 Código Comentado (Para Estudo e Referência)

```javascript
// =========================================================================
// ARQUIVO 1: webapp/ext/controller/ListReportExt.controller.js
// Controller Extension OData V4 para Upload e Download de Excel em Base64
// =========================================================================
sap.ui.define([
    "sap/ui/core/mvc/ControllerExtension",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], function (ControllerExtension, MessageToast, MessageBox) {
    "use strict";

    return ControllerExtension.extend("br.com.veiling.fi.taxascarga.ext.controller.ListReportExt", {

        // Handler do botão "Carregar Planilha (.xlsx)"
        onCarregarPlanilha: function () {
            var oExtensionAPI = this.base.getExtensionAPI();
            var oModel = oExtensionAPI.getModel();

            // Cria um seletor de arquivos HTML5 invisível restrito a .xlsx
            var oFileInput = document.createElement("input");
            oFileInput.type = "file";
            oFileInput.accept = ".xlsx";

            oFileInput.onchange = function (oEvent) {
                var oFile = oEvent.target.files[0];
                if (!oFile) {
                    return;
                }

                var oReader = new FileReader();
                oReader.onload = function (e) {
                    // Extrai apenas a string Base64 após a vírgula do Data-URI
                    var sDataUrl = e.target.result;
                    var sBase64 = sDataUrl.split(",")[1] || sDataUrl;

                    // Invoca a static action carregarArquivo definida no BDEF OData V4
                    var oOperation = oModel.bindContext("/Carga/com.sap.gateway.srvd.zui_fi_tax_carga.v0001.carregarArquivo(...)");
                    oOperation.setParameter("nome_arquivo", oFile.name);
                    oOperation.setParameter("mime_type", oFile.type || "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
                    oOperation.setParameter("conteudo_base64", sBase64);

                    oOperation.execute().then(function () {
                        MessageToast.show("Planilha carregada e verificada com sucesso!");
                        oExtensionAPI.refresh();
                    }).catch(function (oError) {
                        MessageBox.error(oError.message || "Erro ao processar a planilha Excel.");
                    });
                };
                oReader.readAsDataURL(oFile);
            };

            oFileInput.click();
        },

        // Handler do botão "Baixar Modelo Excel"
        onBaixarModelo: function () {
            var oExtensionAPI = this.base.getExtensionAPI();
            var oModel = oExtensionAPI.getModel();

            // Invoca a static action baixarModelo no backend ABAP
            var oOperation = oModel.bindContext("/Carga/com.sap.gateway.srvd.zui_fi_tax_carga.v0001.baixarModelo(...)");

            oOperation.execute().then(function () {
                var oResult = oOperation.getBoundContext().getObject();
                if (!oResult || !oResult.conteudo_base64) {
                    MessageBox.error("Não foi possível gerar o modelo Excel.");
                    return;
                }

                // Converte o Base64 retornado pela XCO_CP_XLSX em Blob e dispara o download no navegador
                var sByteChars = atob(oResult.conteudo_base64);
                var aByteNumbers = new Array(sByteChars.length);
                for (var i = 0; i < sByteChars.length; i++) {
                    aByteNumbers[i] = sByteChars.charCodeAt(i);
                }
                var oByteArray = new Uint8Array(aByteNumbers);
                var oBlob = new Blob([oByteArray], {
                    type: oResult.mime_type || "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                });

                var sUrl = window.URL.createObjectURL(oBlob);
                var oLink = document.createElement("a");
                oLink.href = sUrl;
                oLink.download = oResult.nome_arquivo || "DEL-COM-165_Modelo_Layout_Carga.xlsx";
                document.body.appendChild(oLink);
                oLink.click();
                document.body.removeChild(oLink);
                window.URL.revokeObjectURL(sUrl);

                MessageToast.show("Download do modelo iniciado.");
            }).catch(function (oError) {
                MessageBox.error(oError.message || "Erro ao baixar o modelo de planilha.");
            });
        }
    });
});
```

```json
// =========================================================================
// ARQUIVO 2: Trecho de configuração em webapp/manifest.json (sap.ui5)
// Registra a navegação em 3 níveis e os 2 botões customizados de Excel
// =========================================================================
{
  "sap.ui5": {
    "routing": {
      "targets": {
        "CargaList": {
          "type": "Component",
          "id": "CargaList",
          "name": "sap.fe.templates.ListReport",
          "options": {
            "settings": {
              "contextPath": "/Carga",
              "navigation": {
                "Carga": {
                  "detail": {
                    "route": "CargaObjectPage"
                  }
                }
              },
              "controlConfiguration": {
                "@com.sap.vocabularies.UI.v1.LineItem": {
                  "actions": {
                    "ActionCarregarPlanilha": {
                      "press": ".extension.br.com.veiling.fi.taxascarga.ext.controller.ListReportExt.onCarregarPlanilha",
                      "visible": true,
                      "enabled": true,
                      "text": "Carregar Planilha (.xlsx)"
                    },
                    "ActionBaixarModelo": {
                      "press": ".extension.br.com.veiling.fi.taxascarga.ext.controller.ListReportExt.onBaixarModelo",
                      "visible": true,
                      "enabled": true,
                      "text": "Baixar Modelo Excel"
                    }
                  }
                }
              }
            }
          }
        },
        "CargaObjectPage": {
          "type": "Component",
          "id": "CargaObjectPage",
          "name": "sap.fe.templates.ObjectPage",
          "options": {
            "settings": {
              "contextPath": "/Carga",
              "navigation": {
                "_Documentos": {
                  "detail": {
                    "route": "DocumentoObjectPage"
                  }
                }
              }
            }
          }
        },
        "DocumentoObjectPage": {
          "type": "Component",
          "id": "DocumentoObjectPage",
          "name": "sap.fe.templates.ObjectPage",
          "options": {
            "settings": {
              "contextPath": "/Carga/_Documentos"
            }
          }
        }
      }
    },
    "extends": {
      "extensions": {
        "sap.ui.controllerExtensions": {
          "sap.fe.templates.ListReport.ListReportController": {
            "controllerName": "br.com.veiling.fi.taxascarga.ext.controller.ListReportExt"
          }
        }
      }
    }
  }
}
```

---

### 🚀 Código Limpo (Sem Comentários - Para Copiar e Colar)

```javascript
sap.ui.define([
    "sap/ui/core/mvc/ControllerExtension",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], function (ControllerExtension, MessageToast, MessageBox) {
    "use strict";

    return ControllerExtension.extend("br.com.veiling.fi.taxascarga.ext.controller.ListReportExt", {

        onCarregarPlanilha: function () {
            var oExtensionAPI = this.base.getExtensionAPI();
            var oModel = oExtensionAPI.getModel();

            var oFileInput = document.createElement("input");
            oFileInput.type = "file";
            oFileInput.accept = ".xlsx";

            oFileInput.onchange = function (oEvent) {
                var oFile = oEvent.target.files[0];
                if (!oFile) {
                    return;
                }

                var oReader = new FileReader();
                oReader.onload = function (e) {
                    var sDataUrl = e.target.result;
                    var sBase64 = sDataUrl.split(",")[1] || sDataUrl;

                    var oOperation = oModel.bindContext("/Carga/com.sap.gateway.srvd.zui_fi_tax_carga.v0001.carregarArquivo(...)");
                    oOperation.setParameter("nome_arquivo", oFile.name);
                    oOperation.setParameter("mime_type", oFile.type || "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
                    oOperation.setParameter("conteudo_base64", sBase64);

                    oOperation.execute().then(function () {
                        MessageToast.show("Planilha carregada e verificada com sucesso!");
                        oExtensionAPI.refresh();
                    }).catch(function (oError) {
                        MessageBox.error(oError.message || "Erro ao processar a planilha Excel.");
                    });
                };
                oReader.readAsDataURL(oFile);
            };

            oFileInput.click();
        },

        onBaixarModelo: function () {
            var oExtensionAPI = this.base.getExtensionAPI();
            var oModel = oExtensionAPI.getModel();

            var oOperation = oModel.bindContext("/Carga/com.sap.gateway.srvd.zui_fi_tax_carga.v0001.baixarModelo(...)");

            oOperation.execute().then(function () {
                var oResult = oOperation.getBoundContext().getObject();
                if (!oResult || !oResult.conteudo_base64) {
                    MessageBox.error("Não foi possível gerar o modelo Excel.");
                    return;
                }

                var sByteChars = atob(oResult.conteudo_base64);
                var aByteNumbers = new Array(sByteChars.length);
                for (var i = 0; i < sByteChars.length; i++) {
                    aByteNumbers[i] = sByteChars.charCodeAt(i);
                }
                var oByteArray = new Uint8Array(aByteNumbers);
                var oBlob = new Blob([oByteArray], {
                    type: oResult.mime_type || "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                });

                var sUrl = window.URL.createObjectURL(oBlob);
                var oLink = document.createElement("a");
                oLink.href = sUrl;
                oLink.download = oResult.nome_arquivo || "DEL-COM-165_Modelo_Layout_Carga.xlsx";
                document.body.appendChild(oLink);
                oLink.click();
                document.body.removeChild(oLink);
                window.URL.revokeObjectURL(sUrl);

                MessageToast.show("Download do modelo iniciado.");
            }).catch(function (oError) {
                MessageBox.error(oError.message || "Erro ao baixar o modelo de planilha.");
            });
        }
    });
});
```
