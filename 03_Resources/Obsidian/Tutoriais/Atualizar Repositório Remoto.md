---
tags: [tutorial, obsidian, git, terminal]
type: "tutorial"
status: "published"
summary: "Guia direto com os comandos essenciais para salvar e enviar suas alterações locais para o repositório remoto no GitHub."
---
# Atualizar Repositório Remoto no GitHub

---

## 1. Comandos

Execute os comandos abaixo em sequência no seu terminal (PowerShell ou Git Bash) dentro da pasta do cofre:

```bash
git status
git add .
git commit -m "Atualiza notas e arquivos do cofre"
git push origin main
```

---

## 2. O que cada comando está fazendo 

* **`git status`**  
  **O que faz:**  Ele lista em vermelho tudo o que você modificou, criou ou apagou no Obsidian desde a última vez que salvou. Serve para você ter certeza do que está prestes a enviar.

* **`git add .`**  
  **O que faz: O ponto (`.`) representa a pasta atual inteira. Esse comando diz ao Git: *"Separe todas as notas criadas, editadas e deletadas para empacotar"*.

* **`git commit -m "Atualiza notas e arquivos do cofre"`**  
  **O que faz: É o equivalente a "salvar um checkpoint". O parâmetro `-m` permite colocar uma mensagem curta entre aspas explicando o que mudou. Esse registro fica salvo no seu computador.

* **`git push origin main`**  
  **O que faz:** Envia as suas alterações para a nuvem na branch principal (`main`). É este comando que atualiza o GitHub para que os outros computadores e dispositivos consigam receber a versão mais recente das suas notas.
