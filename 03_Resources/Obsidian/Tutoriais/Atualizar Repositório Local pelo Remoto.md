---
tags: [tutorial, obsidian, git, terminal]
type: "tutorial"
status: "published"
summary: "Guia direto com os comandos para sobrescrever e atualizar o repositório local, deixando-o exatamente idêntico ao remoto (GitHub como fonte da verdade)."
---
# Atualizar Repositório Local com o Remoto (GitHub como Fonte da Verdade)

> ⚠️ **Aviso antes de começar:** 
> 1. Certifique-se de que o computador principal já enviou as alterações para o GitHub (`git push`).
> 2. **Feche o Obsidian** no computador desatualizado antes de rodar os comandos para evitar que plugins travem arquivos em segundo plano.

---

## 1. Comandos

Execute os comandos abaixo em sequência no seu terminal (PowerShell ou Git Bash) dentro da pasta do cofre desatualizado:

```bash
git fetch origin
git checkout main
git reset --hard origin/main
git clean -fd
```

---

## 2. O que cada comando está fazendo (Para Iniciantes)

* **`git fetch origin`**  
  **O que faz:** Consulta o GitHub e baixa todo o histórico e alterações mais recentes para a memória local do Git.  
  **Para iniciantes:** É como fazer o download da versão mais recente na nuvem, mas sem alterar seus arquivos da pasta ainda.

* **`git checkout main`**  
  **O que faz:** Garante que você está posicionado na branch principal.  
  **Para iniciantes:** Evita o erro comum de tentar atualizar uma branch errada ou desvinculada. Garante que seu terminal está apontado para a branch `main`.

* **`git reset --hard origin/main`**  
  **O que faz:** Força os arquivos locais a ficarem rigorosamente idênticos ao que está no GitHub.  
  **Para iniciantes:** Este comando diz: *"Descarte qualquer alteração ou divergência deste computador e faça tudo ficar exatamente como está no `origin/main` do GitHub"*. Ele restaura notas modificadas e baixa o conteúdo novo do remoto.

* **`git clean -fd`**  
  **O que faz:** Remove arquivos (`-f` de force) e pastas (`-d` de directory) que não estão rastreados pelo Git.  
  **Para iniciantes:** Limpa qualquer sobra, lixo ou notas antigas que só existiam localmente nessa máquina e que não fazem parte do repositório no GitHub, evitando arquivos órfãos ou duplicados.
