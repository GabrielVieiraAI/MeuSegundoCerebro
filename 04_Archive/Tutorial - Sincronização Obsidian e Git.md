---
tags: [tutorial, obsidian, git, sincronizacao]
type: "tutorial"
status: "draft"
summary: "Passo a passo completo e acessível para sincronizar o cofre do Obsidian entre o Computador e o Android utilizando o GitHub."
---
# Sincronização do Obsidian com GitHub e Android

Este é um guia prático para sincronizar o seu cofre (vault) do Obsidian entre o seu computador e o seu celular Android utilizando o GitHub, de forma gratuita. O processo permite que você tenha um backup automático na nuvem e o histórico detalhado de todas as alterações das suas notas.

## Requisitos Iniciais
Antes de começar, certifique-se de ter:
1. Uma conta gratuita no site [GitHub](https://github.com/).
2. O programa **Git** instalado no seu computador.
3. O Obsidian instalado no computador e o aplicativo do Obsidian instalado no seu celular Android.

---

## Fase 1: Configuração no Computador e no GitHub

### Passo 1: Criar o Repositório no GitHub
1. Acesse sua conta no GitHub através do navegador.
2. Clique no botão **New** para criar um novo repositório.
3. Defina um nome para o repositório (exemplo: `meu-obsidian`).
4. Marque obrigatoriamente a opção **Private** (Privado) para que apenas você tenha acesso aos seus arquivos.
5. Clique em **Create repository**. Não feche a página, você precisará do link gerado (ex: `https://github.com/SeuUsuario/meu-obsidian.git`).

### Passo 2: Enviar seus arquivos do PC para o GitHub
1. No seu computador, abra o **Prompt de Comando** (ou Terminal).
2. Navegue até a pasta onde estão os arquivos do seu cofre do Obsidian. 
3. Digite os seguintes comandos, pressionando "Enter" após cada um deles:
   - `git init` (Inicia o controle de versão na sua pasta).
   - `git add .` (Prepara todos os arquivos para serem salvos).
   - `git commit -m "Primeiro backup"` (Cria o registro do salvamento).
   - `git branch -M main` (Define a ramificação principal do projeto).
   - `git remote add origin [COLE_O_LINK_DO_SEU_REPOSITORIO_AQUI]` (Conecta a pasta local ao GitHub).
   - `git push -u origin main` (Envia os arquivos para a nuvem).

### Passo 3: Automatizar a sincronização no Obsidian (PC)
Para que você não precise usar o terminal diariamente, o Obsidian fará isso sozinho:
1. Abra o Obsidian no seu computador.
2. Vá em **Configurações** (ícone de engrenagem) > **Community Plugins** (Plugins da comunidade).
3. Desative a opção **Safe Mode** (Modo seguro).
4. Clique em **Browse** e busque por **Obsidian Git**.
5. Clique em **Install** e depois em **Enable** (Ativar).
6. Nas opções (Options) do plugin Obsidian Git, procure pelo campo **Vault backup interval** (Intervalo de backup em minutos). Defina um tempo, por exemplo, `10` (para salvar a cada 10 minutos).
7. Mais abaixo, ative a opção **Push changes on backup**. A partir deste momento, o Obsidian do computador enviará e receberá atualizações do GitHub automaticamente.

---

## Fase 2: Configuração no Celular (Android)

O aplicativo do celular precisará de uma senha especial (Token) para se conectar ao GitHub com segurança.

### Passo 4: Gerar o Token de Acesso (PAT) no GitHub
1. Pelo navegador (no PC ou celular), acesse o GitHub.
2. Clique na sua foto de perfil (canto superior direito) > **Settings** (Configurações).
3. No menu lateral esquerdo, vá até o final e clique em **Developer settings**.
4. Clique em **Personal access tokens** > **Tokens (classic)**.
5. Clique em **Generate new token (classic)**.
6. Preencha o campo de nome para identificação. Na validade (Expiration), selecione **No expiration** (Sem expiração) para não precisar repetir este processo no futuro.
7. Na lista de permissões, marque apenas a caixa principal **repo** (Isso dá acesso aos seus repositórios privados).
8. Vá até o final da página e clique em **Generate token**.
9. **Copie o código gerado imediatamente.** Ele atua como sua senha e o GitHub não o exibirá novamente.

### Passo 5: Baixar o cofre para o Celular
1. Abra o aplicativo do **Obsidian no Android**.
2. Na tela inicial, selecione **Create new vault** (Criar novo cofre). Dê um nome temporário, como `Cofre Temporario`, e salve em qualquer pasta do aparelho.
3. Abra as **Configurações** (ícone de engrenagem no canto inferior) > **Community plugins**. Desative o *Safe mode*.
4. Clique em **Browse**, busque por **Obsidian Git**, instale e ative o plugin.
5. Feche as configurações. Na tela principal, deslize o dedo do topo da tela para baixo (ou clique no ícone de Comandos / Command Palette).
6. Digite e selecione a opção: `Obsidian Git: Clone an existing repository`.
7. O aplicativo solicitará o endereço do repositório. Cole a URL do seu GitHub (a mesma do Passo 1).
8. Quando pedir autenticação, digite o seu Nome de Usuário do GitHub e, no campo de senha, **cole o Token (PAT)** gerado no Passo 4.
9. O Obsidian fará o download de todos os seus arquivos. Ao finalizar, feche o aplicativo e abra-o novamente. Selecione "Open folder as vault" e aponte para a pasta que acabou de ser baixada. (Você pode excluir a pasta `Cofre Temporario` original).

---

## A Rotina de Uso

Após a configuração, a sincronização funciona de forma autônoma:
- Ao abrir o Obsidian no Android, o aplicativo buscará automaticamente as notas criadas ou alteradas no computador.
- Ao redigir uma nota no celular, o plugin enviará as atualizações para o GitHub em segundo plano.
- O computador fará o mesmo processo. Seus arquivos estarão constantemente sincronizados e com histórico completo salvo no repositório.
