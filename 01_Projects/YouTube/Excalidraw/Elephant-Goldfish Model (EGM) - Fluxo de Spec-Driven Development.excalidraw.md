---

excalidraw-plugin: parsed
tags: [excalidraw, youtube, inteligencia-artificial, engenharia-de-software, egm]

aliases:
  - "Elephant-Goldfish Model (EGM) - Fluxo de Spec-Driven Development.excalidraw"
---
==Switch to EXCALIDRAW VIEW in the MORE OPTIONS menu of this document.== You can decompress Drawing data with the command palette: 'Decompress current Excalidraw file'. For more info check in plugin settings under 'Saving'


# Excalidraw Data

## Text Elements
FLUXO DE SPEC-DRIVEN DEVELOPMENT (SDD) - ELEPHANT-GOLDFISH MODEL (EGM) ^title

FASE 1: O ELEFANTE (DEEP CONTEXT)
Memoria Cumulativa de Longo Prazo
Comandos: /egm-bootstrap e /egm-brainstorm
Entrevista tecnica interativa e analise de requisitos
Regra Absoluta: Nenhuma linha de codigo nesta etapa ^txt_fase1

FASE 2: CONTRATO FORMAL (SPEC.MD)
Comando: /egm-draft
Sintese da visao arquitetural em documento estruturado
Modelagem de dados, endpoints, componentes e restricoes ^txt_fase2

FASE 3: OS PEIXINHOS (ZERO CONTEXT)
Subagentes com Memoria Zerada (Stateless)
Comando: /egm-review
Leitura fria e imparcial do documento e do repositorio
Auditoria adversarial: busca de lacunas, falhas e premissas nao ditas ^txt_fase3

FASE 4: RESOLUCAO E GOVERNANCA HUMANA
Comandos: /egm-resolve e /egm-review-loop
O Desenvolvedor Humano como arbitro final das criticas
Ajuste cirurgico da especificacao tecnica ate consenso ^txt_fase4

FASE 5: CODIFICACAO ORIENTADA
Implementacao de codigo guiada estritamente pela spec aprovada
Execucao deterministica em pequenos blocos testaveis ^txt_fase5

FASE 6: AUDITORIA POS-IMPLEMENTACAO
Comando: /egm-drift-report
Comparacao matematica do Diff final contra o spec.md
Prevencao de desvio de escopo (Scope Creep) e alucinacao ^txt_fase6

CADEIA DE EXECUCAO DO EGM:
[Entrevista do Elefante] -> [Draft da Spec] -> [Critica Fria dos Peixinhos] -> [Arbitragem Humana] -> [Codigo] -> [Drift Report] ^txt_chain

%%
## Drawing
```json
{
  "type": "excalidraw",
  "version": 2,
  "source": "https://excalidraw.com",
  "elements": [
    {
      "id": "title",
      "type": "text",
      "x": 100,
      "y": 40,
      "width": 800,
      "height": 30,
      "angle": 0,
      "strokeColor": "#1e1e1e",
      "backgroundColor": "transparent",
      "fillStyle": "hachure",
      "strokeWidth": 1,
      "strokeStyle": "solid",
      "roughness": 1,
      "opacity": 100,
      "groupIds": [],
      "roundness": null,
      "seed": 101,
      "version": 1,
      "versionNonce": 1,
      "isDeleted": false,
      "text": "FLUXO DE SPEC-DRIVEN DEVELOPMENT (SDD) - ELEPHANT-GOLDFISH MODEL (EGM)",
      "fontSize": 20,
      "fontFamily": 1,
      "textAlign": "left",
      "verticalAlign": "top"
    },
    {
      "id": "box_fase1",
      "type": "rectangle",
      "x": 80,
      "y": 100,
      "width": 380,
      "height": 140,
      "angle": 0,
      "strokeColor": "#2b8a3e",
      "backgroundColor": "#ebfbee",
      "fillStyle": "solid",
      "strokeWidth": 2,
      "strokeStyle": "solid",
      "roughness": 1,
      "opacity": 100,
      "groupIds": [],
      "roundness": { "type": 3 }
    },
    {
      "id": "txt_fase1_elem",
      "type": "text",
      "x": 95,
      "y": 115,
      "width": 350,
      "height": 110,
      "angle": 0,
      "strokeColor": "#2b8a3e",
      "backgroundColor": "transparent",
      "fillStyle": "hachure",
      "strokeWidth": 1,
      "strokeStyle": "solid",
      "roughness": 1,
      "opacity": 100,
      "groupIds": [],
      "roundness": null,
      "text": "1. O ELEFANTE (DEEP CONTEXT)\n- Memoria de longo prazo\n- Comandos: /egm-bootstrap e /egm-brainstorm\n- Entrevista tecnica e arquitetura\n- REGRA: Zero linhas de codigo",
      "fontSize": 14,
      "fontFamily": 1,
      "textAlign": "left",
      "verticalAlign": "top"
    },
    {
      "id": "arrow1",
      "type": "arrow",
      "x": 460,
      "y": 170,
      "width": 60,
      "height": 0,
      "angle": 0,
      "strokeColor": "#1e1e1e",
      "backgroundColor": "transparent",
      "fillStyle": "hachure",
      "strokeWidth": 2,
      "strokeStyle": "solid",
      "roughness": 1,
      "opacity": 100,
      "groupIds": [],
      "roundness": { "type": 2 },
      "points": [[0, 0], [60, 0]]
    },
    {
      "id": "box_fase2",
      "type": "rectangle",
      "x": 520,
      "y": 100,
      "width": 380,
      "height": 140,
      "angle": 0,
      "strokeColor": "#1971c2",
      "backgroundColor": "#e7f5ff",
      "fillStyle": "solid",
      "strokeWidth": 2,
      "strokeStyle": "solid",
      "roughness": 1,
      "opacity": 100,
      "groupIds": [],
      "roundness": { "type": 3 }
    },
    {
      "id": "txt_fase2_elem",
      "type": "text",
      "x": 535,
      "y": 115,
      "width": 350,
      "height": 110,
      "angle": 0,
      "strokeColor": "#1971c2",
      "backgroundColor": "transparent",
      "fillStyle": "hachure",
      "strokeWidth": 1,
      "strokeStyle": "solid",
      "roughness": 1,
      "opacity": 100,
      "groupIds": [],
      "roundness": null,
      "text": "2. ESPECIFICACAO FORMAL (SPEC.MD)\n- Comando: /egm-draft\n- Contrato tecnico estruturado\n- Mapeamento de endpoints e regras\n- Documento auditavel e versionado",
      "fontSize": 14,
      "fontFamily": 1,
      "textAlign": "left",
      "verticalAlign": "top"
    },
    {
      "id": "arrow2",
      "type": "arrow",
      "x": 710,
      "y": 240,
      "width": 0,
      "height": 60,
      "angle": 0,
      "strokeColor": "#1e1e1e",
      "backgroundColor": "transparent",
      "fillStyle": "hachure",
      "strokeWidth": 2,
      "strokeStyle": "solid",
      "roughness": 1,
      "opacity": 100,
      "groupIds": [],
      "roundness": { "type": 2 },
      "points": [[0, 0], [0, 60]]
    },
    {
      "id": "box_fase3",
      "type": "rectangle",
      "x": 520,
      "y": 300,
      "width": 380,
      "height": 140,
      "angle": 0,
      "strokeColor": "#c92a2a",
      "backgroundColor": "#ffe3e3",
      "fillStyle": "solid",
      "strokeWidth": 2,
      "strokeStyle": "solid",
      "roughness": 1,
      "opacity": 100,
      "groupIds": [],
      "roundness": { "type": 3 }
    },
    {
      "id": "txt_fase3_elem",
      "type": "text",
      "x": 535,
      "y": 315,
      "width": 350,
      "height": 110,
      "angle": 0,
      "strokeColor": "#c92a2a",
      "backgroundColor": "transparent",
      "fillStyle": "hachure",
      "strokeWidth": 1,
      "strokeStyle": "solid",
      "roughness": 1,
      "opacity": 100,
      "groupIds": [],
      "roundness": null,
      "text": "3. OS PEIXINHOS (ZERO CONTEXT)\n- Subagentes stateless (sem memoria previa)\n- Comando: /egm-review\n- Leitura fria e estritamente critica\n- Exposicao de contradicoes e lacunas",
      "fontSize": 14,
      "fontFamily": 1,
      "textAlign": "left",
      "verticalAlign": "top"
    },
    {
      "id": "arrow3",
      "type": "arrow",
      "x": 520,
      "y": 370,
      "width": -60,
      "height": 0,
      "angle": 0,
      "strokeColor": "#1e1e1e",
      "backgroundColor": "transparent",
      "fillStyle": "hachure",
      "strokeWidth": 2,
      "strokeStyle": "solid",
      "roughness": 1,
      "opacity": 100,
      "groupIds": [],
      "roundness": { "type": 2 },
      "points": [[0, 0], [-60, 0]]
    },
    {
      "id": "box_fase4",
      "type": "rectangle",
      "x": 80,
      "y": 300,
      "width": 380,
      "height": 140,
      "angle": 0,
      "strokeColor": "#e67700",
      "backgroundColor": "#fff4e6",
      "fillStyle": "solid",
      "strokeWidth": 2,
      "strokeStyle": "solid",
      "roughness": 1,
      "opacity": 100,
      "groupIds": [],
      "roundness": { "type": 3 }
    },
    {
      "id": "txt_fase4_elem",
      "type": "text",
      "x": 95,
      "y": 315,
      "width": 350,
      "height": 110,
      "angle": 0,
      "strokeColor": "#e67700",
      "backgroundColor": "transparent",
      "fillStyle": "hachure",
      "strokeWidth": 1,
      "strokeStyle": "solid",
      "roughness": 1,
      "opacity": 100,
      "groupIds": [],
      "roundness": null,
      "text": "4. GOVERNANCA E RESOLUCAO\n- Comandos: /egm-resolve e /egm-review-loop\n- Arbitragem humana de cada apontamento\n- Refinamento iterativo da especificacao\n- Aprovacao final do contrato",
      "fontSize": 14,
      "fontFamily": 1,
      "textAlign": "left",
      "verticalAlign": "top"
    },
    {
      "id": "arrow4",
      "type": "arrow",
      "x": 270,
      "y": 440,
      "width": 0,
      "height": 60,
      "angle": 0,
      "strokeColor": "#1e1e1e",
      "backgroundColor": "transparent",
      "fillStyle": "hachure",
      "strokeWidth": 2,
      "strokeStyle": "solid",
      "roughness": 1,
      "opacity": 100,
      "groupIds": [],
      "roundness": { "type": 2 },
      "points": [[0, 0], [0, 60]]
    },
    {
      "id": "box_fase5",
      "type": "rectangle",
      "x": 80,
      "y": 500,
      "width": 380,
      "height": 140,
      "angle": 0,
      "strokeColor": "#5f3dc4",
      "backgroundColor": "#f3f0ff",
      "fillStyle": "solid",
      "strokeWidth": 2,
      "strokeStyle": "solid",
      "roughness": 1,
      "opacity": 100,
      "groupIds": [],
      "roundness": { "type": 3 }
    },
    {
      "id": "txt_fase5_elem",
      "type": "text",
      "x": 95,
      "y": 515,
      "width": 350,
      "height": 110,
      "angle": 0,
      "strokeColor": "#5f3dc4",
      "backgroundColor": "transparent",
      "fillStyle": "hachure",
      "strokeWidth": 1,
      "strokeStyle": "solid",
      "roughness": 1,
      "opacity": 100,
      "groupIds": [],
      "roundness": null,
      "text": "5. CODIFICACAO DETERMINISTICA\n- Execucao estrita orientada pelo spec.md\n- Geracao modular de componentes e testes\n- Fim das mudancas aleatorias de escopo",
      "fontSize": 14,
      "fontFamily": 1,
      "textAlign": "left",
      "verticalAlign": "top"
    },
    {
      "id": "arrow5",
      "type": "arrow",
      "x": 460,
      "y": 570,
      "width": 60,
      "height": 0,
      "angle": 0,
      "strokeColor": "#1e1e1e",
      "backgroundColor": "transparent",
      "fillStyle": "hachure",
      "strokeWidth": 2,
      "strokeStyle": "solid",
      "roughness": 1,
      "opacity": 100,
      "groupIds": [],
      "roundness": { "type": 2 },
      "points": [[0, 0], [60, 0]]
    },
    {
      "id": "box_fase6",
      "type": "rectangle",
      "x": 520,
      "y": 500,
      "width": 380,
      "height": 140,
      "angle": 0,
      "strokeColor": "#0b7285",
      "backgroundColor": "#e3fafc",
      "fillStyle": "solid",
      "strokeWidth": 2,
      "strokeStyle": "solid",
      "roughness": 1,
      "opacity": 100,
      "groupIds": [],
      "roundness": { "type": 3 }
    },
    {
      "id": "txt_fase6_elem",
      "type": "text",
      "x": 535,
      "y": 515,
      "width": 350,
      "height": 110,
      "angle": 0,
      "strokeColor": "#0b7285",
      "backgroundColor": "transparent",
      "fillStyle": "hachure",
      "strokeWidth": 1,
      "strokeStyle": "solid",
      "roughness": 1,
      "opacity": 100,
      "groupIds": [],
      "roundness": null,
      "text": "6. AUDITORIA POS-CODIGO (DRIFT)\n- Comando: /egm-drift-report\n- Comparacao do Diff do Git contra spec.md\n- Identificacao de codigo nao planejado\n- Garantia de conformidade arquitetural",
      "fontSize": 14,
      "fontFamily": 1,
      "textAlign": "left",
      "verticalAlign": "top"
    }
  ],
  "appState": {
    "viewBackgroundColor": "#ffffff",
    "gridSize": null
  }
}
```
%%
