const path = require('path');

module.exports = async (params) => {
    const vaultPath = params.app.vault.adapter.basePath;
    const gitManager = require(path.join(vaultPath, '.obsidian', 'scripts', 'git-manager.js'));
    gitManager.pullWithPrompt(params.app);
};
