---
data: "{{date:YYYY-MM-DD}}"
tags:
  - diario
  - habitos
orar: false
leitura_biblica: false
leitura_literaria: false
leitura_paginas: 0
malhar: false
correr: false
corrida_km: 0
sono_horas: 0
---

> [!INFO] Navegação Rápida
> 📊 [[Dashboard Hábitos|Ver Dashboard Consolidado]] | 📋 [[Gerenciador de Tarefas|Gerenciador de Tarefas]]

---

## ⚡ Registro Rápido de Hábitos

> [!TIP] Dica
> Você pode alternar os hábitos clicando diretamente nos botões abaixo ou alterando as **Propriedades (Properties)** no topo da nota.

### 🙏 Espiritual
* **Orar:** `INPUT[toggle:orar]`
* **Leitura Bíblica:** `INPUT[toggle:leitura_biblica]`

### 📚 Intelectual
* **Leitura Literária:** `INPUT[toggle:leitura_literaria]`
* **Páginas Lidas:** `INPUT[number(class(meta-bind-small-input)):leitura_paginas]` pág

### 🏃 Saúde & Exercício
* **Malhar:** `INPUT[toggle:malhar]`
* **Correr:** `INPUT[toggle:correr]`
* **Distância Corrida:** `INPUT[number(class(meta-bind-small-input)):corrida_km]` km
* **Sono:** `INPUT[number(class(meta-bind-small-input)):sono_horas]` horas

---

## 🎯 Prioridades & Ações de Hoje

```tasks
not done
tags do not include #agenda
due on or before {{date:YYYY-MM-DD}}
sort by priority
group by tags
hide backlink
hide task count
```

---

## ✅ Concluídas Hoje

```tasks
done
done on {{date:YYYY-MM-DD}}
sort by done reverse
hide backlink
hide task count
```

---

## 📝 Diário de Bordo & Reflexões

* 
