---
title: "Layout Mockup - Gravação Simultânea OBS (Horizontal x Vertical)"
tags:
  - recursos
  - obs
  - setup
  - youtube
  - shorts
  - branding
created: 2026-11-07
updated: 2026-11-07
---

# Layout Mockup: Padrão Estúdio Profissional 2.0 (Zero Manutenção & Autenticidade)

> [!NOTE] Propósito
> Este documento registra o refinamento visual definitivo para o **OBS Studio**:
> 1. **Títulos 100% Genéricos e Perenes:** Sem "Episódio 1" e sem "Gravando" (configura uma única vez e funciona para todos os vídeos).
> 2. **Autenticidade Técnica no Shorts:** Substituição de "caiu na prova oficial" por "Desafio Técnico / Quiz de Fixação com IA".
> 3. **Aproveitamento Total da Tela Vertical:** Integração da **Logo Oficial do canal** (`marca_dagua_gv_badge.png`) e **Card de Engajamento/CTA** no rodapé.
>
> 🌐 **Mockup Visual Interativo Atualizado:** [layouts_mockup.html](layouts_mockup.html)

---

## 1. Mockup Visual: Horizontal (YouTube Pro • 16:9 • 1920x1080)

* **Barra Superior HUD Permanente:** Sem numeração de episódios (zero manutenção entre vídeos) e sem a palavra "Gravando" (ruído desnecessário para o espectador).
* **Camada de Fundo:** Fundo escuro com micro-grid tech (`#0b0f19`) amarrando a tela.
* **Obsidian em Tela Cheia:** Barra de título do Windows e botões `✕` cortados; foco total no estudo/código.
* **Webcam PiP com Moldura:** Cantos arredondados, borda ciano e badge com o nome do Gabriel.

```text
┌────────────────────────────────────────────────────────────────────────┐ 0px
│ [GV] GABRIEL VIEIRA | SAP ABAP CLOUD   Clean Core • Modern ABAP   [BUILD IN PUBLIC] │ <- Topo HUD
├────────────────────────────────────────────────────────────────────────┤ 48px
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │ <- Fundo Tech
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │ # Resolução de Questões • Core Data Services (CDS Views)       │   │
│   │                                                                │   │
│   │ Ao modelar CDS View Entities no ABAP Cloud, certifique-se de   │   │
│   │ aplicar a anotação de controle de acesso correta.              │   │
│   │                                                                │   │
│   │ ┌───────────────────────────────────────┐                      │   │
│   │ │ define view entity Z_DemoCDS ...      │   ╭──────────────╮   │   │
│   │ │ @AccessControl.authorizationCheck ... │   │ 📷 WEBCAM    │   │   │
│   │ └───────────────────────────────────────┘   │ (Bordas      │   │   │
│   │                                             │  Arredondadas│   │   │
│   │ [Modo Foco • Sem menus do Windows]          │  + Glow Azul)│   │   │
│   │                                             ╰──────────────╯   │   │
│   └────────────────────────────────────────────────────────────────┘   │ 1044px
├────────────────────────────────────────────────────────────────────────┤
│ Gabriel Vieira • Estude Comigo & Documentação Técnica   YouTube: @GabrielVieira
└────────────────────────────────────────────────────────────────────────┘ 1080px
```

---

## 2. Mockup Visual: Vertical (Shorts • 9:16 • 1080x1920)

* **Topo (Y: 0 a 230px):** Badge `⚡ SAP ABAP CLOUD` (limpo, sem "simulado") + Logo oficial do canal + Gancho autêntico de desafio.
* **Card Central (Y: 230 a 1320px):** Bloco do Obsidian emoldurado com cantos arredondados e leitura nítida.
* **Card de Engajamento / CTA (Y: 1330 a 1600px):** Aproveitamento do espaço inferior com incentivo a comentários e salvamento do vídeo.
* **Safe Zone (Y: 1600 a 1920px):** Espaço livre reservado para a interface do Shorts.

```text
┌────────────────────────────────────────┐ 0px
│  [⚡ SAP ABAP CLOUD]     (GV) @GabrielVieira │ <- Topo: Nicho + Logo Oficial
│  Desafio Técnico: Você sabe a resposta?│
│  Teste seus conhecimentos em ABAP 🧠   │ <- Gancho autêntico de curiosidade
├────────────────────────────────────────┤ 230px
│                                     │  │
│  ╭───────────────────────────────╮  │  │
│  │ # Questão de Estudo • CDS     │  │  │ <- Card Central Estilizado
│  │                               │  │  │    (Y: 230 a 1320px):
│  │ "Qual anotação define uma     │  │👍│    Texto nítido, sem quebras
│  │ View Entity no ABAP Cloud?"   │  │  │    e sem vazar da tela.
│  │ ┌───────────────────────────┐ │  │💬│
│  │ │ @AccessControl.auth...    │ │  │  │
│  │ └───────────────────────────┘ │  │↗️│
│  │ [A] define view               │  │  │
│  │ [B] define view entity  ✓     │  │🎵│
│  │ [C] define table function     │  │  │
│  ╰───────────────────────────────╯  │  │
│                                     │  │
├────────────────────────────────────────┤ 1330px
│  ╭───────────────────────────────────╮ │ <- Card de CTA & Engajamento:
│  │ 💬 Qual marcaria? Comente A, B ou C│ │    Incentivo a comentários e
│  │ 📌 Salve para revisar antes do exame│ │    salvamento para o algoritmo
│  ╰───────────────────────────────────╯ │
├────────────────────────────────────────┤ 1600px
│  [ Área reservada para botões Shorts ] │ <- Safe Zone Inferior (320px livres)
└────────────────────────────────────────┘ 1920px
```

---

## 3. Sugestões de Textos & Variações Estratégicas

### Para a Barra Superior Horizontal:
* **Opção 1 (Autoridade Técnica - Recomendada):**
  `[GV] GABRIEL VIEIRA | SAP ABAP CLOUD • Clean Core • Modern ABAP [BUILD IN PUBLIC]`
* **Opção 2 (Foco em Estudo Contínuo):**
  `GABRIEL VIEIRA | STUDY WITH ME • SAP ABAP CLOUD & S/4HANA [DEV LOG]`
* **Opção 3 (Minimalismo Puro):**
  `[GV] GABRIEL VIEIRA • SAP ABAP Cloud Developer`

### Para o Gancho do Shorts Vertical:
* **Opção 1 (Desafio Autêntico - Recomendada):**
  * Título: `Desafio Técnico: Você sabe a resposta?`
  * Subtítulo: `Teste seus conhecimentos em ABAP Moderno 🧠`
* **Opção 2 (Focado no Clean Core):**
  * Título: `Clean Core Quiz: Consegue acertar essa?`
  * Subtítulo: `Conceito essencial de CDS Views & RAP`
* **Opção 3 (Pílula Rápida):**
  * Título: `Pílula Técnica • 60 Segundos`
  * Subtítulo: `Quiz rápido de fixação de conceitos`
