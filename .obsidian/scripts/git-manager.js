const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Obtém as classes do Obsidian do contexto do aplicativo com fallback seguro
function getObsidianClasses() {
    let obs = {};
    if (typeof window !== 'undefined' && typeof window.require === 'function') {
        try {
            obs = window.require('obsidian') || {};
        } catch (e) {
            console.warn("[GitManager] Fallback para objetos globais do Obsidian:", e);
        }
    }
    return {
        Notice: obs.Notice || (typeof Notice !== 'undefined' ? Notice : globalThis.Notice),
        Modal: obs.Modal || (typeof Modal !== 'undefined' ? Modal : globalThis.Modal),
        Setting: obs.Setting || (typeof Setting !== 'undefined' ? Setting : globalThis.Setting)
    };
}

/**
 * Executa um comando do sistema de forma assíncrona com Promise.
 */
function runCommand(command, cwd) {
    return new Promise((resolve, reject) => {
        exec(command, { cwd, maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
            if (error) {
                const message = (stderr || stdout || error.message || "").trim();
                return reject(new Error(message));
            }
            resolve(stdout.trim());
        });
    });
}

/**
 * Obtém o caminho absoluto da pasta raiz do cofre ativo no Obsidian.
 */
function getVaultPath(app) {
    if (app && app.vault && app.vault.adapter) {
        if (typeof app.vault.adapter.getBasePath === 'function') {
            return app.vault.adapter.getBasePath();
        }
        if (app.vault.adapter.basePath) {
            return app.vault.adapter.basePath;
        }
    }
    return process.cwd();
}

/**
 * Envia alterações locais para o GitHub (Push).
 */
async function pushVault(app) {
    const { Notice } = getObsidianClasses();
    const vaultPath = getVaultPath(app);
    const notice = Notice ? new Notice("⏳ Preparando e enviando notas para o GitHub...", 0) : null;

    try {
        await runCommand("git add .", vaultPath);
        
        // Verifica se há modificações antes de criar commit
        const status = await runCommand("git status --porcelain", vaultPath);
        if (status) {
            const timestamp = new Date().toLocaleString("pt-BR").replace(/[\/:]/g, "-");
            await runCommand(`git commit -m "Vault sync: ${timestamp}"`, vaultPath);
        }

        await runCommand("git push origin main", vaultPath);

        if (notice && typeof notice.hide === 'function') notice.hide();
        if (Notice) new Notice("✅ Notas enviadas com sucesso para o GitHub!", 6000);
    } catch (err) {
        if (notice && typeof notice.hide === 'function') notice.hide();
        console.error("[GitManager] Erro no Push:", err);
        if (Notice) new Notice(`❌ Erro ao enviar para o GitHub:\n${err.message}`, 10000);
    }
}

/**
 * Localiza a próxima versão disponível e cria uma cópia de segurança em pasta irmã.
 */
function createBackupCopy(vaultPath) {
    const parentDir = path.resolve(vaultPath, "..");
    const vaultName = path.basename(vaultPath);
    const prefix = `${vaultName}_backup_versao_`;

    let maxVersion = 0;
    try {
        const files = fs.readdirSync(parentDir);
        for (const file of files) {
            if (file.startsWith(prefix)) {
                const verNum = parseInt(file.replace(prefix, ""), 10);
                if (!isNaN(verNum) && verNum > maxVersion) {
                    maxVersion = verNum;
                }
            }
        }
    } catch (e) {
        console.warn("[GitManager] Não foi possível listar diretório pai para versões antigas:", e);
    }

    const nextVersion = maxVersion + 1;
    const backupDirName = `${prefix}${nextVersion}`;
    const targetPath = path.join(parentDir, backupDirName);

    // Cópia recursiva do cofre, ignorando node_modules se existirem
    fs.cpSync(vaultPath, targetPath, {
        recursive: true,
        filter: (src) => {
            const relative = path.relative(vaultPath, src);
            if (relative.includes("node_modules")) return false;
            return true;
        }
    });

    return { targetPath, backupDirName };
}

/**
 * Executa o reset forçado e limpa travas de sincronização.
 */
async function forceResetVault(vaultPath) {
    await runCommand("git fetch origin", vaultPath);
    await runCommand("git checkout main", vaultPath);
    await runCommand("git reset --hard origin/main", vaultPath);
    await runCommand("git clean -fd", vaultPath);

    // Limpa estado do GitSync se existir para evitar falso alarme de exclusão em massa
    const syncStateFile = path.join(vaultPath, ".obsidian", "plugins", "gitsync-portal", "local-sync-state.json");
    if (fs.existsSync(syncStateFile)) {
        try {
            fs.unlinkSync(syncStateFile);
        } catch (e) {
            console.warn("[GitManager] Não foi possível remover local-sync-state.json:", e);
        }
    }
}

/**
 * Dispara o fluxo de atualização inteligente com modal interativo.
 */
function pullWithPrompt(app) {
    const { Notice, Modal, Setting } = getObsidianClasses();
    const vaultPath = getVaultPath(app);

    if (!Modal || !Setting) {
        if (Notice) new Notice("❌ Interface do Obsidian não disponível para abrir o diálogo.", 6000);
        return;
    }

    class SmartPullModal extends Modal {
        constructor(appInstance) {
            super(appInstance);
        }

        onOpen() {
            const { contentEl } = this;
            contentEl.empty();

            contentEl.createEl("h2", { text: "🔄 Atualizar Repositório Local" });
            contentEl.createEl("p", {
                text: "O repositório do GitHub será a fonte absoluta da verdade. Como você gostaria de proceder?",
                cls: "mod-warning"
            });

            // Opção 1: Backup e Atualizar
            const opt1 = contentEl.createDiv({ cls: "git-manager-opt" });
            opt1.style.marginBottom = "15px";
            opt1.style.padding = "10px";
            opt1.style.border = "1px solid var(--interactive-accent)";
            opt1.style.borderRadius = "8px";

            new Setting(opt1)
                .setName("💾 Fazer Backup e Atualizar (Recomendado)")
                .setDesc("Cria uma cópia integral do estado atual em uma pasta '_backup_versao_X' antes de alinhar com o GitHub.")
                .addButton(btn => btn
                    .setButtonText("Fazer Backup e Atualizar")
                    .setCta()
                    .onClick(async () => {
                        this.close();
                        const notice = Notice ? new Notice("⏳ Criando cópia de backup do cofre...", 0) : null;
                        try {
                            const { backupDirName } = createBackupCopy(vaultPath);
                            if (notice && typeof notice.setMessage === 'function') {
                                notice.setMessage(`💾 Backup criado em '${backupDirName}'. Sincronizando com GitHub...`);
                            }
                            await forceResetVault(vaultPath);
                            if (notice && typeof notice.hide === 'function') notice.hide();
                            if (Notice) new Notice(`✅ Sucesso! Cofre atualizado com o GitHub.\n📁 Backup preservado em: ${backupDirName}`, 8000);
                        } catch (err) {
                            if (notice && typeof notice.hide === 'function') notice.hide();
                            console.error("[GitManager] Erro no Backup e Pull:", err);
                            if (Notice) new Notice(`❌ Erro durante o processo:\n${err.message}`, 10000);
                        }
                    }));

            // Opção 2: Sobrescrever Direto
            const opt2 = contentEl.createDiv({ cls: "git-manager-opt" });
            opt2.style.marginBottom = "15px";
            opt2.style.padding = "10px";
            opt2.style.border = "1px solid var(--background-modifier-border)";
            opt2.style.borderRadius = "8px";

            new Setting(opt2)
                .setName("⚡ Sobrescrever Direto (Sem Backup)")
                .setDesc("Descarta imediatamente divergências locais e força o cofre a ficar idêntico ao GitHub.")
                .addButton(btn => btn
                    .setButtonText("Sobrescrever Direto")
                    .setWarning()
                    .onClick(async () => {
                        this.close();
                        const notice = Notice ? new Notice("⏳ Sobrescrevendo cofre com versão do GitHub...", 0) : null;
                        try {
                            await forceResetVault(vaultPath);
                            if (notice && typeof notice.hide === 'function') notice.hide();
                            if (Notice) new Notice("✅ Cofre atualizado 100% com o GitHub!", 6000);
                        } catch (err) {
                            if (notice && typeof notice.hide === 'function') notice.hide();
                            console.error("[GitManager] Erro no Reset Direto:", err);
                            if (Notice) new Notice(`❌ Erro ao atualizar do GitHub:\n${err.message}`, 10000);
                        }
                    }));

            // Opção 3: Cancelar
            const opt3 = contentEl.createDiv({ cls: "git-manager-opt" });
            new Setting(opt3)
                .addButton(btn => btn
                    .setButtonText("Cancelar")
                    .onClick(() => {
                        this.close();
                        if (Notice) new Notice("Operação cancelada.");
                    }));
        }

        onClose() {
            const { contentEl } = this;
            contentEl.empty();
        }
    }

    new SmartPullModal(app).open();
}

module.exports = {
    pushVault,
    pullWithPrompt,
    createBackupCopy,
    forceResetVault,
    getVaultPath
};
