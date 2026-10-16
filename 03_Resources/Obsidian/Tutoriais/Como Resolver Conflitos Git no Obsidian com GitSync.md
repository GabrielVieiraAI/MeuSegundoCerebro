---
tags: [tutorial, obsidian, git, gitsync, conflitos]
type: "tutorial"
status: "published"
summary: "Guia completo e descomplicado para desenvolvedores juniores entenderem e resolverem conflitos de sincronização no Obsidian com o plugin GitSync e via terminal."
---
# Como Resolver Conflitos Git no Obsidian Utilizando o GitSync

> **Nota para iniciantes:** Conflitos de sincronização entre dispositivos não significam que suas anotações foram perdidas! O plugin **GitSync** (e o próprio Git) foi projetado para nunca apagar dados sem o seu consentimento. Este guia explica exatamente por que os conflitos acontecem e como resolvê-los de forma prática e rápida.

---

## 📌 Sumário
1. [Por que ocorrem conflitos no Obsidian?](#1-por-que-ocorrem-conflitos-no-obsidian)
2. [Como o GitSync lida com conflitos (A estratégia das cópias)](#2-como-o-gitsync-lida-com-conflitos-a-estratégia-das-cópias)
3. [Como resolver conflitos do GitSync na prática](#3-como-resolver-conflitos-do-gitsync-na-prática)
   - [Cenário 1: Conflito em Notas Pessoais (`.md`)](#cenário-1-conflito-em-notas-pessoais-md)
   - [Cenário 2: Conflito em Massa de Plugins e Configurações (Via Terminal)](#cenário-2-conflito-em-massa-de-plugins-e-configurações-via-terminal)
4. [E se ocorrer um conflito nativo do Git (Marcadores `<<<<<<< HEAD`)?](#4-e-se-ocorrer-um-conflito-nativo-do-git-marcadores--head)
5. [Como evitar novos conflitos no dia a dia](#5-como-evitar-novos-conflitos-no-dia-a-dia)

---

## 1. Por que ocorrem conflitos no Obsidian?

O Obsidian é um sistema de arquivos local. Quando você sincroniza suas notas entre diferentes dispositivos (por exemplo, seu **Computador** e seu **Celular**), o conflito ocorre quando:

1. Você alterou ou criou uma nota no Celular.
2. O Celular não sincronizou com o GitHub de imediato (ou você editou offline).
3. Você abriu o Computador e também fez alterações na mesma nota (ou arquivos internos do Obsidian foram atualizados simultaneamente por plugins).
4. Ao tentar sincronizar, o sistema encontra **duas versões concorrentes** e não sabe qual é a definitiva.

---

## 2. Como o GitSync lida com conflitos (A estratégia das cópias)

Diferente do Git tradicional, que insere códigos estranhos dentro do texto (como `<<<<<<< HEAD`), o plugin **GitSync Portal** adota o método **Safe Conflict** (Conflito Seguro):

* Ele **preserva o arquivo original** e cria uma **cópia duplicada** com o padrão:
  ```text
  [Nome-do-Arquivo].conflict-[dispositivo]-[data-e-hora].[extensão]
  ```
* *Exemplo real no cofre:*
  - Arquivo original: `Trans.md`
  - Cópia do GitSync: `Trans.conflict-windows-20261016T123015Z.md`

Dessa forma, suas anotações nunca são apagadas nem corrompidas por automações.

---

## 3. Como resolver conflitos do GitSync na prática

### Cenário 1: Conflito em Notas Pessoais (`.md`)

Quando o conflito ocorrer em uma anotação de texto sua:

1. **Abra o Obsidian** e localize as duas notas na barra lateral:
   - A nota original (`MinhaNota.md`)
   - A nota com sufixo (`MinhaNota.conflict-...md`)
2. **Abra ambas lado a lado**:
   - Segure `Ctrl` (ou `Cmd` no Mac) e clique na cópia para abrir em uma nova aba dividida.
3. **Compare e Consolide**:
   - Transfira da cópia de conflito para a nota original os tópicos ou ideias que estejam faltando.
4. **Exclua o arquivo de conflito**:
   - Clique com o botão direito na nota `...conflict...` > **Excluir** (Delete).
5. **Sincronize novamente** no GitSync clicando no botão de sincronização.

---

### Cenário 2: Conflito em Massa de Plugins e Configurações (Via Terminal)

Muitas vezes, plugins como Copilot, QuickAdd ou arquivos internos da pasta `.obsidian/` geram dezenas ou centenas de arquivos `.conflict-*` ao mesmo tempo (como aconteceu neste repositório).

> 💡 **Dica Júnior:** Nunca tente apagar centenas de arquivos de plugins manualmente um a um pelo Obsidian. Use o terminal!

#### Passo 1: Abrir o Terminal na pasta raiz do Cofre
Abra o PowerShell (no Windows) ou o Git Bash/Terminal na pasta do seu repositório:
```text
c:\Users\seu-usuario\source\MeuSegundoCerebro
```

#### Passo 2: Listar todos os arquivos de conflito
Antes de apagar, confira quais arquivos de conflito existem:

* **No PowerShell (Windows):**
  ```powershell
  Get-ChildItem -Recurse -Filter "*conflict*"
  ```
* **No Git Bash / Linux / macOS:**
  ```bash
  find . -name "*conflict*"
  ```

#### Passo 3: Excluir todos os arquivos `.conflict-*` de uma vez

* **No PowerShell (Windows):**
  ```powershell
  Get-ChildItem -Recurse -Filter "*conflict*" | Remove-Item -Force
  ```
* **No Git Bash / Linux / macOS:**
  ```bash
  find . -name "*conflict*" -type f -delete
  ```

#### Passo 4: Registrar e enviar a limpeza para o GitHub
Após remover os arquivos de conflito, confira o estado com `git status` e envie as alterações:

```bash
# 1. Veja o que foi modificado e limpo
git status

# 2. Adicione as alterações ao stage
git add .

# 3. Crie o commit
git commit -m "chore: remove copias de conflito geradas pelo GitSync"

# 4. Envie para o GitHub
git push origin main
```

Após isso, o GitSync voltará a sincronizar suavemente em todos os dispositivos.

---

## 4. E se ocorrer um conflito nativo do Git (Marcadores `<<<<<<< HEAD`)?

Se em algum momento você executar `git pull` ou `git merge` diretamente no terminal e o Git encontrar alterações conflitantes no mesmo arquivo, ele não criará arquivos `.conflict`, mas inserirá marcadores dentro do arquivo:

```markdown
<<<<<<< HEAD
Meu texto escrito no Computador.
=======
Texto que foi escrito no Celular e baixado do GitHub.
>>>>>>> origin/main
```

### Como resolver no terminal:
1. **Identifique o arquivo conflitante**:
   ```bash
   git status
   ```
   Ele aparecerá listado sob `Unmerged paths: both modified: [nome-do-arquivo].md`.

2. **Abra a nota no editor ou Obsidian**:
   - Escolha o conteúdo que deseja manter (ou combine os dois).
   - **Remova obrigatoriamente** as linhas:
     - `<<<<<<< HEAD`
     - `=======`
     - `>>>>>>> origin/main`

3. **Marque como resolvido e comite**:
   ```bash
   git add caminho/do/arquivo.md
   git commit -m "fix: resolve conflito de merge na nota"
   git push origin main
   ```

4. **Se algo der errado e quiser cancelar o merge**:
   ```bash
   git merge --abort
   ```

---

## 5. Como evitar novos conflitos no dia a dia

Seguir este pequeno fluxo de rotina elimina 99% dos conflitos:

1. **Sincronize antes de começar a escrever:**
   - Ao abrir o Obsidian no computador ou no celular, clique no botão de Sync para baixar as últimas alterações.
2. **Sincronize ao terminar:**
   - Terminou de anotar? Dê um Sync antes de fechar o app.
3. **Configure o `.gitignore` e os padrões de exclusão do GitSync:**
   - No GitSync Portal (**Configurações do Plugin** > **Sync Ignore Patterns**), certifique-se de que arquivos de cache e voláteis estão ignorados:
     ```text
     *.conflict-*
     **/*.conflict-*
     .obsidian/workspace*.json
     .obsidian/page-preview.json
     ```
   - Isso impede que arquivos temporários gerem ruído entre os dispositivos.

