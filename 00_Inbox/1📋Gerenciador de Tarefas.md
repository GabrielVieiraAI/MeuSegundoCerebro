---
tags: [tarefas, gerenciador]
---
## 🎯 Tarefas de Hoje `BUTTON[btn-add-tarefa]`

```tasks
not done
happens before tomorrow
hide toolbar
hide backlink
group by priority
hide task count
```

---
## 🗓️ Visão Semanal 

```fc-calendar
view: dayGridWeek
weather: false
height: fit
dayMaxEvents: false
```

---
## 🔄 Tarefas Rotineiras `BUTTON[btn-nova-rotina]`

- [ ] Orar #espiritual 🔁 every day 📅 2026-10-14
- [x] Orar #espiritual 🔁 every day 📅 2026-10-13 ✅ 2026-10-13
- [ ] Leitura Literária #leitura 🔁 every day 📅 2026-10-13
- [ ] Correr #saude 🔁 every week on Tuesday, Thursday 📅 2026-10-13
- [ ] Malhar #saude 🔁 every week on Monday, Wednesday, Friday 📅 2026-10-14
- [ ] Culto PG Fornalha ⏫ 🔁 every week on Tuesday 📅 2026-10-13 
- [ ] Culto Fornalha eve 🔁 every week 📅 2026-10-14
- [ ] Culto Fornalha ⏫🔁 every week on Sunday 📅 2026-10-18  
---
## 📝 Tarefas Avulsas `BUTTON[btn-nova-tarefa-avulsa]`

- [ ] #pessoal Vistoria do Fiesta R$180,00 ⏫ 📅 2026-10-15
- [x] Assinar documentos do Fiesta no Gov.br ⏫ 📅 2026-10-13 ✅ 2026-10-13
- [ ] #pessoal Transferência do Fiesta no Detran ⏫ 📅 2026-10-20 ⏳11:30
- [x] Enviar chave da API Primata para o Bruno Braga via e-mail 🔽 📅 2026-10-13 ✅ 2026-10-13
- [ ] #cefe Retirar provisionamento da CEFE📅 2026-10-19 ⏫ 
- [x] Enviar Boleto Azure para o Paolo ⏫ 📅 2026-10-13 ✅ 2026-10-13
- [ ] #insi #sap Criar nota referente a **OData** através do **SAP GUI** ⏬ 📅 2026-10-14
- [x] Presente da Ligia ⏫ 📅 2026-10-13 ✅ 2026-10-13
- [x] Criar sistema de gerenciamento de Tarefas 📅 2026-10-13 ✅ 2026-10-13
- [ ] #insi Conseguir acesso de desenvolvimento no SAP GUI 📅 2026-10-14
- [ ]  #insi Liberar Request de ajuste da demanda de logs barramento  📅 2026-10-13
- [ ] Criar Nota de receita de bolo de chocolate 📅 2026-10-13




```meta-bind-button
id: btn-add-tarefa
hidden: true
label: "➕ Adicionar Tarefa"
style: default
action:
  type: command
  command: quickadd:choice:adicionar-tarefa
```

```meta-bind-button
id: btn-nova-rotina
hidden: true
label: "➕ Nova Rotina"
style: default
action:
  type: command
  command: quickadd:choice:menu-rotinas
```

```meta-bind-button
id: btn-nova-tarefa-avulsa
hidden: true
label: "➕ Nova Tarefa Avulsa"
style: default
action:
  type: command
  command: quickadd:choice:tarefa-avulsa
```
