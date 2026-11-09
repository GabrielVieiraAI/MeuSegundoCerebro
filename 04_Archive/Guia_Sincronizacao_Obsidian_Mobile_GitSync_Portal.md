---
tipo: tutorial
tags:
  - tutorial
  - obsidian
  - git
  - gitsync-portal
  - mobile
status: concluido
data_criacao: 2026-11-05
resumo: "Passo a passo para sincronizar o cofre do Obsidian no celular com o repositório existente no GitHub utilizando o plugin GitSync Portal."
---

# Guia Prático: Sincronizar o Cofre do GitHub no Obsidian Mobile com GitSync Portal

Este guia foi elaborado para orientar o processo de trazer (fazer *pull* ou clonar) as notas do seu cofre do computador — que já se encontra armazenado em um repositório remoto no **GitHub** — para o cofre recém-criado no aplicativo **Obsidian** do seu celular, utilizando o plugin **GitSync Portal**.

---

## 1. Como o GitSync Portal Funciona no Celular?

Nos celulares (Android e iOS), o ambiente do sistema operacional não possui o comando `git` instalado por padrão na linha de comando. 

O **GitSync Portal** resolve esse problema comunicando-se diretamente com os servidores do GitHub por meio da **API REST** (*Application Programming Interface* com padrão REST, que é uma interface padronizada de comunicação web via requisições HTTP). Dessa forma, o plugin consegue ler, baixar e enviar notas de forma nativa e segura, sem depender de emuladores de terminal ou aplicativos externos.

---

## 2. Pré-requisitos

Antes de iniciar, certifique-se de que você possui:

1. **Repositório no GitHub:** Seu cofre do computador já comitadado e enviado para o GitHub (no seu caso: `GabrielVieiraAI/MeuSegundoCerebro`).
2. **Obsidian Mobile:** Aplicativo instalado no celular com um cofre criado (mesmo que vazio).
3. **Plugin Instalado:** O plugin comunitário **GitSync Portal** baixado e ativado no celular.

---

## 3. Passo a Passo de Configuração

### Passo 1: Gerar o Token de Acesso (PAT) no GitHub

Como o celular não usa chave SSH instalada, o GitHub exige um **PAT** (*Personal Access Token* — Token de Acesso Pessoal). O PAT funciona como uma chave de segurança digital com escopo limitado, autorizando o GitSync Portal a ler e gravar alterações no seu repositório.

Você pode criar esse token no navegador do computador ou no próprio navegador do celular:

1. Acesse sua conta no [GitHub](https://github.com/).
2. Clique na sua foto de perfil (canto superior direito) e vá em **Settings** (Configurações).
3. No menu lateral esquerdo, role até o final e clique em **Developer Settings** (Configurações do desenvolvedor).
4. No menu lateral, acesse **Personal access tokens** e escolha **Fine-grained tokens** (ou *Tokens classic*, se preferir):
   - **Opção Recomendada (Fine-grained token):**
     - Clique em **Generate new token**.
     - **Token name:** Dê um nome de identificação (exemplo: `Obsidian Mobile GitSync`).
     - **Expiration:** Defina a validade (ex: 90 dias, 1 ano ou conforme sua preferência).
     - **Repository access:** Selecione **Only select repositories** e escolha o repositório do seu cofre (`MeuSegundoCerebro`).
     - **Permissions (Permissões):** Expanda a opção **Repository permissions** e localize **Contents**. Altere para **Read and write** (Leitura e escrita).
     - Role até o final da página e clique em **Generate token**.
   - **Opção Alternativa (Tokens classic):**
     - Se preferir o modelo clássico, selecione **Tokens (classic)** > **Generate new token (classic)**.
     - No campo de escopo (*Scopes*), marque a caixa principal **repo** (concede acesso de leitura e escrita a repositórios privados).
     - Role até o final e clique em **Generate token**.
5. **Atenção:** Copie o código gerado imediatamente (ele começa com `github_pat_` ou `ghp_`). O GitHub não exibirá esse token novamente.

---

### Passo 2: Configurar o GitSync Portal no Celular

Com o token copiado, abra o Obsidian no celular:

1. Toque no ícone de engrenagem (**Configurações** / *Settings*).
2. Na seção lateral de **Plugins da comunidade** (*Community plugins*), toque em **GitSync Portal**.
3. Preencha os campos principais da seção de sincronização:
   - **GitHub token:** Cole o token de acesso (PAT) gerado no Passo 1.
   - **Repositório (*Repository*):** Preencha no formato `Usuário/Repositório`.
     - Exemplo: `GabrielVieiraAI/MeuSegundoCerebro`
   - **Branch:** Informe a branch principal do cofre, geralmente `main` (ou deixe em branco para assumir a branch padrão).
   - **Nome do dispositivo (*Device name*):** Mantenha ativada a opção automática (*Detect device automatically*). O plugin identificará se é um dispositivo Android ou iOS.

---

### Passo 3: Testar a Conexão e Fazer o Primeiro Download (Pull)

Agora que as credenciais estão salvas, faremos a importação de todas as pastas e notas do GitHub para o celular:

1. Ainda na página de configurações do GitSync Portal, role até a seção **Testar e sincronizar** (*Test and sync*).
2. Toque no botão **Testar conexão** (*Test connection*).
   - Uma notificação no topo da tela deverá confirmar: `Conexão bem-sucedida com o GitHub`.
3. Toque no botão **Sincronizar agora** (*Sync now* / *Run two-way sync now*).
   - *Alternativa via painel:* Você também pode abrir a barra lateral do Obsidian, tocar no ícone do GitSync Portal (ou abrir pelo comando do plugin) e tocar no botão com ícone de nuvem e seta para baixo: **Puxar apenas** (*Pull only*).
4. O GitSync Portal fará a leitura de toda a árvore de arquivos remota e começará a baixar as pastas (`00_Inbox`, `01_Projects`, `02_Areas`, `03_Resources`, `04_Archive`, etc.) diretamente para o armazenamento do celular.
5. Aguarde o aviso de conclusão da sincronização. Em seguida, feche as configurações e abra o explorador de arquivos: toda a sua estrutura estará disponível para uso offline.

---

### Passo 4: Configurar a Rotina Automática para o Dia a Dia

Para não precisar sincronizar manualmente toda vez, ative as automações recomendadas nas configurações do GitSync Portal:

| Configuração | O que faz | Recomendação |
| :--- | :--- | :--- |
| **Sincronizar ao iniciar** (*Sync on startup*) | Executa uma sincronização assim que o cofre é aberto no celular. | **Ativado** (garante que alterações feitas no PC apareçam logo ao abrir o app). |
| **Sincronizar depois de salvar** (*Sync after saving*) | Faz o envio automático (*push*) das notas alteradas para o GitHub. | **Ativado** (evita esquecer de subir alterações feitas no celular). |
| **Sincronização periódica** (*Periodic sync*) | Sincroniza em segundo plano em um intervalo de tempo fixo. | Opcional (ex: a cada 15 ou 30 minutos, se desejar sincronização contínua). |

---

## 4. Dicas e Boas Práticas

1. **Evitar Conflitos:** Antes de começar a editar intensamente no celular, certifique-se de que o cofre puxou as últimas alterações feitas no computador. Da mesma forma, antes de voltar para o PC, faça um sincronizar no celular.
2. **Resolução de Conflito Automática:** Caso você altere a mesma nota no computador e no celular simultaneamente, o GitSync Portal não apagará seus dados: a versão mais recente prevalece e a versão anterior é salva como uma cópia com sufixo `.conflict-[data]`.
3. **Arquivos Ignorados:** O plugin já vem pré-configurado com regras para não sincronizar lixo do sistema (como arquivos `.DS_Store`, cache e arquivos temporários de plugins).
4. **Armazenamento Seguro:** O GitSync Portal utiliza a API de armazenamento seguro do próprio Obsidian (*SecretStorage*) para guardar seu token do GitHub, não salvando a chave em texto puro dentro das notas ou arquivos de configuração pública.

---

## 5. Notas Relacionadas

- [[Guia_Metodo_PARA]]: Entenda como organizar as notas que agora estão sincronizadas no seu celular.
