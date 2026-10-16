const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Sistema de notificação resiliente
let activeNotice = null;
function notify(message, timeout = 5000) {
    try {
        if (activeNotice && typeof activeNotice.hide === 'function') {
            activeNotice.hide();
            activeNotice = null;
        }
        const NoticeConstructor = typeof Notice !== 'undefined' 
            ? Notice 
            : (typeof window !== 'undefined' && window.Notice ? window.Notice : null);

        if (NoticeConstructor) {
            activeNotice = new NoticeConstructor(message, timeout);
            return activeNotice;
        }
    } catch (e) {
        console.warn("[GitManager] Fallback console notice:", e);
    }
    console.log(`[GitManager] ${message}`);
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
    const vaultPath = getVaultPath(app);
    notify("⏳ Preparando e enviando notas para o GitHub...", 0);

    try {
        await runCommand("git add .", vaultPath);
        
        // Verifica se há modificações antes de criar commit
        const status = await runCommand("git status --porcelain", vaultPath);
        if (status) {
            const timestamp = new Date().toLocaleString("pt-BR").replace(/[\/:]/g, "-");
            await runCommand(`git commit -m "Vault sync: ${timestamp}"`, vaultPath);
        }

        // Tenta enviar diretamente
        await runCommand("git push origin main", vaultPath);

        notify("✅ Notas enviadas com sucesso para o GitHub!", 6000);
    } catch (err) {
        console.error("[GitManager] Erro no Push:", err);
        notify(`❌ Erro ao enviar para o GitHub:\n${err.message}`, 10000);
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
 * Renderiza modal nativo do Obsidian com layout de cards (sem quebras de texto e 100% responsivo).
 */
function openSmartPullModal(vaultPath) {
    if (typeof document === 'undefined') {
        notify("❌ Ambiente sem suporte a interface gráfica.", 5000);
        return;
    }

    // Remove qualquer modal prévio
    const oldModal = document.querySelector('.git-smart-pull-modal');
    if (oldModal) oldModal.remove();

    const container = document.createElement('div');
    container.className = 'modal-container mod-dim git-smart-pull-modal';

    const bg = document.createElement('div');
    bg.className = 'modal-bg';
    container.appendChild(bg);

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.position = 'relative';
    modal.style.maxWidth = '520px';
    modal.style.width = '100%';
    modal.style.boxSizing = 'border-box';
    modal.style.padding = '24px';
    modal.style.borderRadius = '12px';
    container.appendChild(modal);

    const closeBtn = document.createElement('div');
    closeBtn.className = 'modal-close-button';
    modal.appendChild(closeBtn);

    const title = document.createElement('h2');
    title.innerText = '🔄 Atualizar Repositório Local';
    title.style.margin = '0 0 8px 0';
    title.style.fontSize = '20px';
    modal.appendChild(title);

    const desc = document.createElement('p');
    desc.innerText = 'O repositório do GitHub será a fonte absoluta da verdade. Como você gostaria de proceder?';
    desc.style.color = 'var(--text-muted)';
    desc.style.margin = '0 0 20px 0';
    desc.style.fontSize = '14px';
    desc.style.lineHeight = '1.5';
    modal.appendChild(desc);

    const cardContainer = document.createElement('div');
    cardContainer.style.display = 'flex';
    cardContainer.style.flexDirection = 'column';
    cardContainer.style.gap = '12px';
    modal.appendChild(cardContainer);

    function closeModal() {
        container.remove();
        document.removeEventListener('keydown', onKeyDown);
    }

    function onKeyDown(e) {
        if (e.key === 'Escape') closeModal();
    }
    document.addEventListener('keydown', onKeyDown);
    bg.onclick = closeModal;
    closeBtn.onclick = closeModal;

    // Card 1: Fazer Backup e Atualizar
    const card1 = document.createElement('div');
    card1.style.padding = '14px 16px';
    card1.style.borderRadius = '10px';
    card1.style.border = '1.5px solid var(--interactive-accent)';
    card1.style.backgroundColor = 'var(--background-primary-alt)';
    card1.style.cursor = 'pointer';
    card1.style.transition = 'all 0.15s ease';
    card1.style.display = 'flex';
    card1.style.flexDirection = 'column';
    card1.style.gap = '4px';
    card1.onmouseenter = () => { card1.style.backgroundColor = 'var(--background-modifier-hover)'; };
    card1.onmouseleave = () => { card1.style.backgroundColor = 'var(--background-primary-alt)'; };

    card1.innerHTML = `
        <div style="font-weight: 600; font-size: 15px; color: var(--text-accent);">💾 Fazer Backup e Atualizar <span style="font-size: 12px; font-weight: normal; opacity: 0.85;">(Recomendado)</span></div>
        <div style="font-size: 13px; color: var(--text-muted); line-height: 1.4; white-space: normal;">Cria uma cópia integral do estado atual em pasta de backup antes de alinhar com o GitHub.</div>
    `;
    card1.onclick = async () => {
        closeModal();
        notify("⏳ Criando cópia de backup do cofre...", 0);
        try {
            const { backupDirName } = createBackupCopy(vaultPath);
            notify(`💾 Backup criado em '${backupDirName}'. Sincronizando com GitHub...`, 0);
            await forceResetVault(vaultPath);
            notify(`✅ Sucesso! Cofre atualizado com o GitHub.\n📁 Backup preservado em: ${backupDirName}`, 8000);
        } catch (err) {
            console.error("[GitManager] Erro no Backup e Pull:", err);
            notify(`❌ Erro durante o processo:\n${err.message}`, 10000);
        }
    };
    cardContainer.appendChild(card1);

    // Card 2: Sobrescrever Direto
    const card2 = document.createElement('div');
    card2.style.padding = '14px 16px';
    card2.style.borderRadius = '10px';
    card2.style.border = '1.5px solid var(--text-error)';
    card2.style.backgroundColor = 'var(--background-primary-alt)';
    card2.style.cursor = 'pointer';
    card2.style.transition = 'all 0.15s ease';
    card2.style.display = 'flex';
    card2.style.flexDirection = 'column';
    card2.style.gap = '4px';
    card2.onmouseenter = () => { card2.style.backgroundColor = 'var(--background-modifier-hover)'; };
    card2.onmouseleave = () => { card2.style.backgroundColor = 'var(--background-primary-alt)'; };

    card2.innerHTML = `
        <div style="font-weight: 600; font-size: 15px; color: var(--text-error);">⚡ Sobrescrever Direto <span style="font-size: 12px; font-weight: normal; opacity: 0.85;">(Sem Backup)</span></div>
        <div style="font-size: 13px; color: var(--text-muted); line-height: 1.4; white-space: normal;">Descarta divergências locais e força o cofre a ficar idêntico ao GitHub.</div>
    `;
    card2.onclick = async () => {
        closeModal();
        notify("⏳ Sobrescrevendo cofre com versão do GitHub...", 0);
        try {
            await forceResetVault(vaultPath);
            notify("✅ Cofre atualizado 100% com o GitHub!", 6000);
        } catch (err) {
            console.error("[GitManager] Erro no Reset Direto:", err);
            notify(`❌ Erro ao atualizar do GitHub:\n${err.message}`, 10000);
        }
    };
    cardContainer.appendChild(card2);

    // Botão Cancelar
    const btnCancel = document.createElement('button');
    btnCancel.innerText = 'Cancelar';
    btnCancel.style.padding = '10px 16px';
    btnCancel.style.cursor = 'pointer';
    btnCancel.style.borderRadius = '8px';
    btnCancel.style.border = '1px solid var(--background-modifier-border)';
    btnCancel.style.width = '100%';
    btnCancel.style.marginTop = '6px';
    btnCancel.onclick = () => {
        closeModal();
        notify("Operação cancelada.", 3000);
    };
    cardContainer.appendChild(btnCancel);

    document.body.appendChild(container);
}

/**
 * Dispara o fluxo de atualização inteligente com modal interativo.
 */
function pullWithPrompt(app) {
    const vaultPath = getVaultPath(app);
    openSmartPullModal(vaultPath);
}

module.exports = {
    pushVault,
    pullWithPrompt,
    createBackupCopy,
    forceResetVault,
    getVaultPath
};
