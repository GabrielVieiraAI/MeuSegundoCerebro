---
tags: [tutorial, obsidian, git, setup, plugins]
type: "tutorial"
status: "concluido"
summary: "Passo a passo completo e à prova de falhas para adicionar e configurar este vault em um novo computador, garantindo que todos os plugins, botões, calendários e automações funcionem perfeitamente."
---

# Guia: Como Adicionar e Configurar o Vault em um Novo Computador

Este guia contém o procedimento exato para clonar e configurar o **MeuSegundoCerebro** em um novo computador (desktop ou notebook), garantindo que **todos os plugins** (Tasks, Meta Bind, Full Calendar, QuickAdd, GitSync Portal) e estilos visuais funcionem de imediato.

---

## 🧭 Visão Geral do Cofre e Plugins Utilizados

Este cofre possui uma estrutura integrada e depende dos seguintes componentes para funcionar corretamente:

| Plugin / Recurso | Função no Cofre | Arquivo de Configuração |
| :--- | :--- | :--- |
| **GitSync Portal** | Sincronização automática com o GitHub | `.obsidian/plugins/gitsync-portal/` |
| **Tasks** | Renderização e filtragem de tarefas (`tasks`) | `.obsidian/plugins/obsidian-tasks-plugin/` |
| **Meta Bind** | Renderiza botões interativos (`BUTTON[...]`) | `.obsidian/plugins/obsidian-meta-bind-plugin/` |
| **QuickAdd** | Dispara automações e formulários pelos botões | `.obsidian/plugins/quickadd/data.json` |
| **Full Calendar Remastered** | Renderiza a grade semanal do calendário (`fc-calendar`) | `.obsidian/plugins/full-calendar-remastered/` |
| **CSS Snippets** | Alinhamento e estilização dos botões (`button-align.css`) | `.obsidian/snippets/button-align.css` |

---

## ⚠️ PASSO ZERO (Obrigatório: No Computador Atual Antes de Ir para o Novo)

> [!IMPORTANT]
> Os plugins **Tasks**, **Meta Bind**, **Full Calendar Remastered** e **QuickAdd** foram instalados no seu computador atual. Para que o novo computador receba esses plugins prontos, a pasta `.obsidian` com os plugins deve estar salva e enviada para o repositório no GitHub.

No seu computador atual (onde tudo já está funcionando):

1. Abra o terminal (PowerShell ou Bash) na pasta do cofre (`MeuSegundoCerebro`).
2. Execute os seguintes comandos para subir todas as configurações e plugins pendentes:

```bash
# 1. Adicionar os plugins instalados, configurações e snippets
git add .obsidian/plugins/ .obsidian/snippets/ .obsidian/community-plugins.json .obsidian/appearance.json

# 2. Criar o commit
git commit -m "feat: sincronizar plugins comunitarios e configuracoes"

# 3. Enviar para o GitHub
git push origin main
```

*(Ou garanta que o plugin **GitSync Portal** fez o envio completo de todos os arquivos sem erros antes de desligar).*

---

## 🛠️ FASE 1: Pré-Requisitos no Novo Computador

Antes de abrir o cofre no novo computador, instale os softwares básicos:

1. **Obsidian**: Baixe e instale a versão mais recente em [obsidian.md](https://obsidian.md/).
2. **Git** *(Recomendado)*: Baixe e instale o [Git para Windows](https://git-scm.com/) (ou instale o GitHub Desktop caso prefira interface gráfica).
3. **Personal Access Token (PAT) do GitHub**:
   - Acesse `GitHub > Configurações (Settings) > Developer Settings > Personal Access Tokens > Tokens (classic)`.
   - Caso já tenha um token salvo, tenha-o em mãos. Caso precise gerar um novo:
     - Marque a permissão principal: **`repo`** (acesso completo a repositórios privados).
     - Guarde o código gerado.

---

## 📥 FASE 2: Baixar o Cofre no Novo Computador

### Opção A (Recomendada: Via Terminal Git / Rápida e Direta)

1. Abra o terminal (PowerShell ou Prompt de Comando) na pasta onde deseja guardar seus projetos (ex: `C:\Users\<SeuUsuario>\source\` ou `Documentos`).
2. Execute o comando de clone:
   ```bash
   git clone https://github.com/GabrielVieiraAI/MeuSegundoCerebro.git
   ```
3. Abra o **Obsidian**.
4. Na tela inicial do Obsidian, clique em **"Abrir pasta como cofre"** (*Open folder as vault*).
5. Selecione a pasta clonada `MeuSegundoCerebro`.

---

### Opção B (Alternativa: 100% pelo Obsidian via GitSync Portal)

Caso o novo computador não permita instalar o Git por linha de comando:

1. Abra o **Obsidian** e clique em **"Criar novo cofre"** (*Create new vault*).
2. Dê o nome de `MeuSegundoCerebro` e escolha o diretório desejado.
3. No cofre vazio, vá em `Configurações (Engrenagem) > Plugins da comunidade` e clique em **"Desativar modo restrito"** (*Turn off Restricted Mode*).
4. Clique em **Explorar** (*Browse*), busque por **GitSync Portal**, instale e ative.
5. Nas opções do GitSync Portal:
   - **Repository:** `GabrielVieiraAI/MeuSegundoCerebro`
   - **Branch:** `main`
   - **Personal Access Token:** Cole seu token do GitHub.
6. Clique no botão de sincronização para baixar todo o repositório.

---

## ⚙️ FASE 3: Configurar os Plugins e Ativações no Obsidian

Quando o Obsidian abre um cofre pela primeira vez em um novo computador, por questões de segurança ele mantém o **Modo Restrito** ativo. Siga os passos abaixo para destravar os recursos:

### 1. Desativar o Modo Restrito (Restricted Mode)
1. Clique no ícone de **Configurações** (engrenagem no canto inferior esquerdo).
2. Vá na aba **Plugins da comunidade** (*Community plugins*).
3. Se o Modo Restrito estiver ativado, clique em **"Desativar modo restrito"** (*Turn off Restricted Mode*).

### 2. Verificar a Lista de Plugins Ativados
Na mesma tela de **Plugins da comunidade**, certifique-se de que os seguintes plugins estão listados e com o botão **ativado (ligado)**:

- [x] **GitSync Portal**
- [x] **Tasks**
- [x] **Meta Bind**
- [x] **Full Calendar Remastered**
- [x] **QuickAdd**

> [!TIP]
> Se algum plugin aparecer na lista mas estiver desativado, basta clicar no interruptor para ativá-lo. Se não aparecer na lista, clique no botão de recarregar a lista (ícone de setas circulares ao lado de "Plugins instalados").

### 3. Configurar o GitSync Portal no Novo Computador
Se você baixou via Git (Opção A), o plugin já estará instalado, mas precisa do token para sincronizar pelo Obsidian:
1. Em `Configurações > Opções dos Plugins > GitSync Portal`.
2. Insira o seu **Personal Access Token (PAT)** do GitHub.
3. Altere o **Device Name** para identificar este computador (ex: `Notebook-Trabalho` ou `PC-Casa`).
4. Verifique se o repositório está preenchido como `GabrielVieiraAI/MeuSegundoCerebro` e branch `main`.
5. *(Opcional)* Ative as opções automáticas desejadas (como *Sync on Startup* ou *Auto Sync*).

### 4. Verificar o Snippet de CSS (Alinhamento dos Botões)
1. Vá em `Configurações > Aparência` (*Appearance*).
2. Role até a seção **Snippets CSS**.
3. Verifique se o snippet `button-align` está **ativado**.

### 5. Recarregar o Obsidian
Após ativar os plugins, dê um recarregamento completo para que todas as instâncias e comandos sejam registrados na memória:
- Pressione o atalho: **`Ctrl + R`** (ou feche e reabra o Obsidian).

---

## ✅ FASE 4: Checklist de Validação

Para confirmar que tudo está 100% funcional, abra a nota principal:

📄 **`00_Inbox/1📋Gerenciador de Tarefas.md`**

Verifique os 4 pontos abaixo:

1. **Botões Interativos (Meta Bind):**
   - Os botões `[btn-add-tarefa]` e `[btn-nova-rotina]` devem aparecer como botões clicáveis e estilizados (e **não** como código em texto puro).
2. **Formulário de Tarefa (QuickAdd):**
   - Ao clicar no botão de adicionar tarefa, uma janela do QuickAdd deve surgir solicitando os dados da tarefa.
3. **Filtro de Tarefas (Tasks):**
   - A seção `Tarefas de Hoje` deve renderizar a lista com checkboxes e ícones de data/prioridade.
4. **Grade Semanal (Full Calendar):**
   - A seção `Visão Semanal` deve renderizar o calendário com os dias da semana.

---

## 🔍 Resolução de Dúvidas e Problemas Frequentes

### 1. Os botões aparecem como texto cru `BUTTON[btn-add-tarefa]`
- **Causa:** O plugin **Meta Bind** está desativado ou o Obsidian ainda não inicializou os renderizadores.
- **Solução:** Vá em `Configurações > Plugins da comunidade`, ative o **Meta Bind** e pressione `Ctrl + R`.

### 2. O bloco do calendário ou de tarefas mostra uma caixa de código preta
- **Causa:** Os plugins **Full Calendar Remastered** ou **Tasks** estão desativados.
- **Solução:** Ative-os em `Plugins da comunidade` e reinicie a nota.

### 3. O botão é clicado mas não acontece nada
- **Causa:** O plugin **QuickAdd** precisa estar ativo para processar a ação vinculada ao ID do botão.
- **Solução:** Confirme se o **QuickAdd** está ativado nas configurações.

### 4. Erro de autenticação no GitSync Portal
- **Causa:** Token PAT expirado ou sem a permissão `repo`.
- **Solução:** Gere um novo token no GitHub marcando a caixinha `repo` e atualize no plugin.
