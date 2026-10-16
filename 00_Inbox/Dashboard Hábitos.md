---
tags:
  - dashboard
  - habitos
---
# 📊 Dashboard de Hábitos
---

## 📅 Desempenho da Semana (Últimos 7 Dias)

### Diário Recente
```dataview
TABLE 
  choice(orar, "✅", "❌") AS "🙏 Orar",
  choice(leitura_biblica, "✅", "❌") AS "📖 Bíblia",
  choice(leitura_literaria, "✅", "❌") AS "📚 Leitura",
  default(leitura_paginas, 0) + " pág" AS "Páginas",
  choice(malhar, "✅", "❌") AS "💪 Malhar",
  choice(correr, "✅", "❌") AS "🏃 Correr",
  default(corrida_km, 0) + " km" AS "Distância",
  default(sono_horas, "-") + " h" AS "Sono"
FROM "00_Inbox/Daily"
WHERE default(file.day, date(data)) >= date(today) - dur(7 days)
SORT default(file.day, date(data)) DESC
```

### 🎯 Scorecard da Semana
```dataview
TABLE
  sum(map(rows, (r) => choice(r.orar, 1, 0))) + " / " + length(rows) + " dias" AS "🙏 Oração",
  sum(map(rows, (r) => choice(r.leitura_biblica, 1, 0))) + " / " + length(rows) + " dias" AS "📖 Bíblia",
  sum(map(rows, (r) => choice(r.malhar, 1, 0))) + " dias" AS "💪 Treinos",
  sum(map(rows, (r) => choice(r.correr, 1, 0))) + " dias (" + default(sum(nonnull(rows.corrida_km)), 0) + " km)" AS "🏃 Corrida",
  sum(map(rows, (r) => choice(r.leitura_literaria, 1, 0))) + " dias (" + default(sum(nonnull(rows.leitura_paginas)), 0) + " pág)" AS "📚 Leitura"
FROM "00_Inbox/Daily"
WHERE default(file.day, date(data)) >= date(today) - dur(7 days)
GROUP BY true
```

---

## 📈 Consolidado do Mês Atual

```dataview
TABLE
  sum(map(rows, (r) => choice(r.orar, 1, 0))) + " dias" AS "🙏 Oração",
  sum(map(rows, (r) => choice(r.leitura_biblica, 1, 0))) + " dias" AS "📖 Bíblia",
  sum(map(rows, (r) => choice(r.malhar, 1, 0))) + " dias" AS "💪 Treinos",
  default(sum(nonnull(rows.corrida_km)), 0) + " km (" + sum(map(rows, (r) => choice(r.correr, 1, 0))) + " corridas)" AS "🏃 Corrida",
  default(sum(nonnull(rows.leitura_paginas)), 0) + " pág (" + sum(map(rows, (r) => choice(r.leitura_literaria, 1, 0))) + " dias)" AS "📚 Leitura",
  default(round(average(nonnull(rows.sono_horas)), 1), 0) + " h" AS "Média Sono"
FROM "00_Inbox/Daily"
WHERE default(file.day, date(data)).month = date(today).month AND default(file.day, date(data)).year = date(today).year
GROUP BY true
```

---

## 🗓️ Mapas de Constância Anual (Heatmaps 365 Dias)

### 🙏 Oração
```contributionGraph
title: "Oração Diária"
graphType: default
dateRangeType: LATEST_DAYS
dateRangeValue: 365
startOfWeek: 1
fillTheScreen: false
enableMainContainerShadow: false
dataSource:
  type: PAGE
  value: '"00_Inbox/Daily"'
  dateField:
    type: PAGE_PROPERTY
    value: data
  countField:
    type: PAGE_PROPERTY
    value: orar
cellStyleRules:
  - id: orar_done
    color: "#2ecc71"
    min: 1
    max: 9999
```

### 📖 Leitura Bíblica
```contributionGraph
title: "Leitura Bíblica"
graphType: default
dateRangeType: LATEST_DAYS
dateRangeValue: 365
startOfWeek: 1
fillTheScreen: false
enableMainContainerShadow: false
dataSource:
  type: PAGE
  value: '"00_Inbox/Daily"'
  dateField:
    type: PAGE_PROPERTY
    value: data
  countField:
    type: PAGE_PROPERTY
    value: leitura_biblica
cellStyleRules:
  - id: biblia_done
    color: "#3498db"
    min: 1
    max: 9999
```

### 💪 Musculação / Malhar
```contributionGraph
title: "Treinos de Força"
graphType: default
dateRangeType: LATEST_DAYS
dateRangeValue: 365
startOfWeek: 1
fillTheScreen: false
enableMainContainerShadow: false
dataSource:
  type: PAGE
  value: '"00_Inbox/Daily"'
  dateField:
    type: PAGE_PROPERTY
    value: data
  countField:
    type: PAGE_PROPERTY
    value: malhar
cellStyleRules:
  - id: malhar_done
    color: "#e67e22"
    min: 1
    max: 9999
```

### 🏃 Corrida
```contributionGraph
title: "Corrida (Intensidade por km)"
graphType: default
dateRangeType: LATEST_DAYS
dateRangeValue: 365
startOfWeek: 1
fillTheScreen: false
enableMainContainerShadow: false
dataSource:
  type: PAGE
  value: '"00_Inbox/Daily"'
  dateField:
    type: PAGE_PROPERTY
    value: data
  countField:
    type: PAGE_PROPERTY
    value: corrida_km
cellStyleRules:
  - id: run_light
    color: "#a8e6cf"
    min: 0.1
    max: 3
  - id: run_medium
    color: "#3bba9c"
    min: 3
    max: 7
  - id: run_hard
    color: "#1b4d3e"
    min: 7
    max: 9999
```

### 📚 Leitura Literária
```contributionGraph
title: "Leitura Literária (Páginas)"
graphType: default
dateRangeType: LATEST_DAYS
dateRangeValue: 365
startOfWeek: 1
fillTheScreen: false
enableMainContainerShadow: false
dataSource:
  type: PAGE
  value: '"00_Inbox/Daily"'
  dateField:
    type: PAGE_PROPERTY
    value: data
  countField:
    type: PAGE_PROPERTY
    value: leitura_paginas
cellStyleRules:
  - id: read_light
    color: "#d7bde2"
    min: 1
    max: 15
  - id: read_medium
    color: "#9b59b6"
    min: 15
    max: 35
  - id: read_hard
    color: "#512e5f"
    min: 35
    max: 9999
```

---

## 🏆 Consolidado Geral do Ano

```dataview
TABLE
  sum(map(rows, (r) => choice(r.orar, 1, 0))) + " dias" AS "Total Oração",
  sum(map(rows, (r) => choice(r.leitura_biblica, 1, 0))) + " dias" AS "Total Bíblia",
  sum(map(rows, (r) => choice(r.malhar, 1, 0))) + " treinos" AS "Total Musculação",
  sum(map(rows, (r) => choice(r.correr, 1, 0))) + " corridas" AS "Dias de Corrida",
  default(sum(nonnull(rows.corrida_km)), 0) + " km" AS "Distância Acumulada",
  default(sum(nonnull(rows.leitura_paginas)), 0) + " pág" AS "Páginas Lidas",
  default(round(average(nonnull(rows.sono_horas)), 1), 0) + " h/noite" AS "Média Sono Anual"
FROM "00_Inbox/Daily"
WHERE default(file.day, date(data)).year = date(today).year
GROUP BY true
```
