---
tags: [tutorial, obsidian, git, sincronizacao]
type: "tutorial"
status: "draft"
summary: "Passo a passo completo e acessível para sincronizar o cofre do Obsidian entre o Computador e o Android utilizando o plugin Git Sync e o GitHub."
---
# Sincronização do Obsidian com GitHub e Android

Este é um guia prático para sincronizar o seu cofre (vault) do Obsidian entre o seu computador e o seu celular Android utilizando o GitHub, de forma gratuita. Utilizaremos o plugin **Git Sync**, que oferece uma configuração simples, direta e à prova de falhas em ambas as plataformas.

## Requisitos Iniciais
Antes de começar, certifique-se de ter:
1. Uma conta gratuita no site [GitHub](https://github.com/).
2. O Obsidian instalado no computador e o aplicativo do Obsidian instalado no seu celular Android.

---

## Fase 1: Configuração no GitHub

Para que o plugin funcione de forma autônoma nos seus dispositivos, ele precisará de um repositório para guardar os arquivos e uma senha especial (Token) para acessá-los com segurança.

### Passo 1: Criar o Repositório no GitHub
1. Acesse sua conta no GitHub através do navegador.
2. Clique no botão **New** para criar um novo repositório.
3. Defina um nome para o repositório (exemplo: `meu-obsidian`).
4. Marque obrigatoriamente a opção **Private** (Privado) para que apenas você tenha acesso aos seus arquivos.
5. Clique em **Create repository**. Salve o link gerado (ex: `https://github.com/SeuUsuario/meu-obsidian.git`).

### Passo 2: Gerar o Token de Acesso (PAT)
1. Clique na sua foto de perfil (canto superior direito) > **Settings** (Configurações).
2. No menu lateral esquerdo, vá até o final e clique em **Developer settings**.
3. Clique em **Personal access tokens** > **Tokens (classic)**.
4. Clique em **Generate new token (classic)**.
5. Preencha o campo de nome para identificação. Na validade (Expiration), selecione **No expiration** (Sem expiração).
6. Na lista de permissões, marque apenas a caixa principal **repo** (Isso dá acesso total aos seus repositórios privados).
7. Vá até o final da página e clique em **Generate token**.
8. **Copie o código gerado imediatamente.** Ele atua como sua senha e o GitHub não o exibirá novamente.

---

## Fase 2: Configuração no Computador e no Celular

A enorme vantagem do **Git Sync** é que o processo de instalação e configuração é exatamente o mesmo, tanto no PC quanto no smartphone.

### Passo 3: Instalando e Configurando o Git Sync
1. Abra o Obsidian. *(No celular, caso seja o primeiro acesso, crie um "Novo Cofre" em branco numa pasta qualquer)*.
2. Vá em **Configurações** (ícone de engrenagem) > **Community Plugins** (Plugins da comunidade).
3. Desative a opção **Safe Mode** (Modo seguro).
4. Clique em **Browse**, busque pelo plugin **Git Sync**, clique em **Install** e depois em **Enable** (Ativar).
5. Acesse as opções do plugin que você acabou de instalar.
6. Na tela de configuração do Git Sync, preencha as informações que preparamos na Fase 1:
   - **Repository URL:** Cole o link do seu repositório (do Passo 1).
   - **GitHub Username:** O seu nome de usuário.
   - **Personal Access Token:** Cole o Token de segurança (do Passo 2).
7. Nas opções de automação do plugin (como *Auto Sync*, *Sync on Startup* ou Intervalo de Backup), ative e defina os minutos de acordo com a sua preferência. Isso garantirá que o backup e o download das notas ocorram de forma totalmente automática.
8. Após salvar as configurações, o plugin começará a sincronização. No celular, aquele cofre em branco será automaticamente preenchido com as notas que já estavam salvas no seu GitHub!

---

## A Rotina de Uso

Após essa configuração única, o processo se torna invisível:
- Ao abrir o Obsidian em qualquer dispositivo, o aplicativo buscará automaticamente as notas mais recentes na nuvem.
- Ao redigir ou editar uma nota, o plugin **Git Sync** enviará as atualizações para o GitHub em segundo plano, garantindo que o seu outro dispositivo já receba as novidades na próxima vez que for aberto.
