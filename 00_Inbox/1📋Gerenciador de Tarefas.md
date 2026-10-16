---
tags:
  - tarefas
  - gerenciador
---

# 📋 Central de Tarefas 

> ⚡ **Ações Rápidas:** `BUTTON[btn-add-tarefa]` `BUTTON[btn-nova-rotina]` 
> 📊 **Hábitos & Performance:** [[Dashboard_Habitos|Ver Dashboard Consolidado de Hábitos]]

---
## 🗓️ Agenda da Semana 

```fc-calendar
view: timeGridWeek
weather: false
height: 600px
slotMinTime: "07:00"
slotMaxTime: "22:00"
dayMaxEvents: false
```

---

## 🚨 Atrasadas 
```tasks
not done
tags do not include #agenda
due before today
sort by due
```

---

## 🎯 Prioridades de Hoje
```tasks
not done
tags do not include #agenda
due on or before today
sort by priority
group by tags
```

---

## 📅 Restante da Semana Atual 
```tasks
not done
tags do not include #agenda
due after today
due before next Monday
sort by due
group by due
hide backlink
```

---

## 📥 Backlog 
```tasks
not done
tags do not include #agenda
no due date
no scheduled date
path does not include 04_Archive
group by tags
```

---

## ✅ Concluídas Recentemente (Últimos 3 dias)
```tasks
done
done after 4 days ago
sort by done reverse
hide backlink
```

---

## 🔄 Tarefas Rotineiras

- [ ] 20:00 - 22:00 Culto PG Fornalha #agenda 🔁 every week on Tuesday 📅 2026-10-20
- [x] 20:00 - 22:00 Culto PG Fornalha #agenda 🔁 every week on Tuesday 📅 2026-10-13 ✅ 2026-10-13
- [ ] 20:00 - 22:00 Culto Fornalha #agenda 🔁 every week on Wednesday 📅 2026-10-21
- [x] 20:00 - 22:00 Culto Fornalha #agenda 🔁 every week on Wednesday 📅 2026-10-14 ✅ 2026-10-14
- [ ] 18:00 - 19:30 Culto Fornalha #agenda 📅 2026-10-18 🔁 every week on Sunday

---

## 📝 Tarefas Avulsas 

- [x] #pessoal Vistoria do Fiesta R$180,00 ⏫ 📅 2026-10-15 ⏳ 11:30 ✅ 2026-10-15
- [x] Assinar documentos do Fiesta no Gov.br ⏫ 📅 2026-10-13 ✅ 2026-10-13
- [ ] 11:30 - 13:30 Transferência do Fiesta no Detran 📅 2026-10-20
- [x] Enviar chave da API Primata para o Bruno Braga via e-mail 🔽 📅 2026-10-13 ✅ 2026-10-13
- [ ] Retirar provisionamento da CEFE 📅 2026-10-19 ⏫ 
- [x] Enviar Boleto Azure para o Paolo ⏫ 📅 2026-10-13 ✅ 2026-10-13
- [ ] Criar nota referente a **OData** através do **SAP GUI**  📅 2026-10-14
- [x] Presente da Ligia ⏫ 📅 2026-10-13 ✅ 2026-10-13
- [x] Criar sistema de gerenciamento de Tarefas 📅 2026-10-13 ✅ 2026-10-13
- [ ] Conseguir acesso de desenvolvimento no SAP GUI 🔺 📅 2026-10-19
- [ ] Liberar Request de ajuste da demanda de logs barramento 🔺 📅 2026-10-19
- [x] Criar Nota de receita de bolo de chocolate 📅 2026-10-13 ✅ 2026-10-14
- [x] Criar uma forma de metrificar as tarefas rotineiras. 📅 2026-10-14 ✅ 2026-10-15
- [x] Se cadastrar em vagas SAP ⏫ 📅 2026-10-15 ✅ 2026-10-15
- [x] Estudar SAP ⏫ 📅 2026-10-14 ✅ 2026-10-14
- [x] Comprar areia dos Gatos e ingredientes para bolo 📅 2026-10-14 ✅ 2026-10-14
- [ ] Estudar SAP 📅 2026-10-15

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
- [ ] Retirar provisionamento da Cefe 📅 2026-10-15