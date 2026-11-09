---
tags:
  - git
  - dashboard
  - sincronizacao
  - backup
type: dashboard
status: active
summary: Painel interativo para sincronização rápida com GitHub, salvamento em nuvem e atualização segura com backup incremental.
---

# 🚀 Painel de Controle Git

> ⚡ **Central de Operações do Cofre:** Utilize os botões abaixo para gerenciar a sincronização com o GitHub com segurança e sem riscos de conflitos.

---

```dataviewjs
const isMobile = app.isMobile || typeof require === 'undefined';
let gitManager = null;
let loadError = null;

if (!isMobile) {
    try {
        const path = require('path');
        const vaultPath = (app.vault.adapter.getBasePath ? app.vault.adapter.getBasePath() : app.vault.adapter.basePath) || "";
        const scriptPath = path.join(vaultPath, '.obsidian', 'scripts', 'git-manager.js');
        if (require.cache && require.resolve && require.cache[require.resolve(scriptPath)]) {
            delete require.cache[require.resolve(scriptPath)];
        }
        gitManager = require(scriptPath);
    } catch (e) {
        loadError = e;
        console.error("Erro ao carregar git-manager:", e);
    }
}

const wrapper = dv.el('div', '', { cls: 'git-panel-card' });
wrapper.style.display = 'flex';
wrapper.style.flexDirection = 'column';
wrapper.style.gap = '16px';
wrapper.style.padding = '20px';
wrapper.style.backgroundColor = 'var(--background-secondary)';
wrapper.style.borderRadius = '12px';
wrapper.style.border = '1px solid var(--background-modifier-border)';
wrapper.style.margin = '15px 0';

const title = wrapper.createEl('h3', { 
    text: isMobile ? '📱 Ações de Sincronização (Mobile - GitSync Portal)' : '⚡ Ações de Sincronização (Desktop)' 
});
title.style.marginTop = '0';
title.style.marginBottom = '5px';

const subtitle = wrapper.createEl('p', { 
    text: isMobile 
        ? 'Sincronização mobile integrada via GitSync Portal (API GitHub):' 
        : 'Clique no botão desejado para executar a sincronização em tempo real:' 
});
subtitle.style.margin = '0 0 10px 0';
subtitle.style.color = 'var(--text-muted)';
subtitle.style.fontSize = '14px';

const btnRow = wrapper.createDiv();
btnRow.style.display = 'flex';
btnRow.style.gap = '14px';
btnRow.style.flexWrap = 'wrap';

// --- Botão 1: Push ---
const btnPush = btnRow.createEl('button', {
    text: '⬆️ Salvar no GitHub (Push)',
    cls: 'mod-cta'
});
btnPush.style.padding = '12px 22px';
btnPush.style.fontSize = '14px';
btnPush.style.fontWeight = '600';
btnPush.style.cursor = 'pointer';
btnPush.style.borderRadius = '8px';
btnPush.style.transition = 'transform 0.1s ease';

btnPush.onclick = async () => {
    btnPush.disabled = true;
    try {
        if (isMobile) {
            const executed = app.commands.executeCommandById("gitsync-portal:push-github-now");
            if (executed) {
                new Notice("⏳ Enviando alterações para o GitHub via GitSync Portal...");
            } else {
                new Notice("⚠️ Plugin GitSync Portal não encontrado. Ative-o nas configurações.");
            }
        } else if (gitManager) {
            await gitManager.pushVault(app);
        } else {
            new Notice("❌ Erro ao carregar git-manager.js:\n" + (loadError ? loadError.message : "Arquivo não encontrado"));
        }
    } finally {
        btnPush.disabled = false;
    }
};

// --- Botão 2: Pull ---
const btnPull = btnRow.createEl('button', {
    text: isMobile ? '🔄 Atualizar do GitHub (Pull)' : '🔄 Atualizar do GitHub (Smart Pull)',
    cls: 'mod-warning'
});
btnPull.style.padding = '12px 22px';
btnPull.style.fontSize = '14px';
btnPull.style.fontWeight = '600';
btnPull.style.cursor = 'pointer';
btnPull.style.borderRadius = '8px';
btnPull.style.transition = 'transform 0.1s ease';

btnPull.onclick = () => {
    if (isMobile) {
        const executed = app.commands.executeCommandById("gitsync-portal:pull-github-now");
        if (executed) {
            new Notice("⏳ Puxando atualizações do GitHub via GitSync Portal...");
        } else {
            new Notice("⚠️ Plugin GitSync Portal não encontrado. Ative-o nas configurações.");
        }
    } else if (gitManager) {
        gitManager.pullWithPrompt(app);
    } else {
        new Notice("❌ Erro ao carregar git-manager.js:\n" + (loadError ? loadError.message : "Arquivo não encontrado"));
    }
};

// --- Botão 3: Two-Way Sync (Exclusivo Mobile) ---
if (isMobile) {
    const btnSync = btnRow.createEl('button', {
        text: '⚡ Sincronização Dupla (Sync)',
        cls: 'mod-primary'
    });
    btnSync.style.padding = '12px 22px';
    btnSync.style.fontSize = '14px';
    btnSync.style.fontWeight = '600';
    btnSync.style.cursor = 'pointer';
    btnSync.style.borderRadius = '8px';

    btnSync.onclick = () => {
        const executed = app.commands.executeCommandById("gitsync-portal:sync-github-now");
        if (executed) {
            new Notice("⏳ Executando sincronização bidirecional...");
        } else {
            new Notice("⚠️ Plugin GitSync Portal não encontrado.");
        }
    };
}
```

---

## 📖 Como funciona cada botão?

### 1. ⬆️ Salvar no GitHub (Push)
* **Quando usar:** Ao terminar de escrever suas notas ou antes de trocar de computador/fechar o Obsidian.
* **O que ele faz:**
  1. Identifica todas as notas novas, modificadas e apagadas.
  2. Cria um commit de salvamento com a data e horário atuais.
  3. Envia com segurança para o repositório remoto no GitHub (`main`).

---

### 2. 🔄 Atualizar do GitHub (Smart Pull)
* **Quando usar:** Ao ligar um computador que está desatualizado em relação ao que você fez em outros dispositivos.
* **O que ele faz:** Ao clicar, ele abre uma janela interativa para você escolher:
  * 💾 **Fazer Backup e Atualizar:** O sistema cria uma cópia completa do seu cofre na pasta irmã `MeuSegundoCerebro_backup_versao_X` e, em seguida, alinha tudo com a nuvem. Suas notas antigas ficam 100% salvas caso você queira consultá-las depois.
  * ⚡ **Sobrescrever Direto:** Descarta diferenças locais antigas e puxa a versão oficial do GitHub imediatamente.
  * ❌ **Cancelar:** Aborta sem alterar nada.

---

## 📚 Guias e Tutoriais Rápidos
* [[Atualizar Repositório Remoto|Como Enviar Manualmente via Terminal]]
* [[Atualizar Repositório Local pelo Remoto|Como Atualizar Manualmente via Terminal]]

```meta-bind-button
id: btn-git-push
hidden: true
label: "⬆️ Salvar no GitHub (Push)"
style: default
action:
  type: command
  command: quickadd:choice:git-push
```

```meta-bind-button
id: btn-git-pull-smart
hidden: true
label: "🔄 Atualizar do GitHub (Smart Pull)"
style: default
action:
  type: command
  command: quickadd:choice:git-pull-smart
```

