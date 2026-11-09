---
tipo: teste-notebooklm
tags:
  - sap
  - abap
  - abap-cloud
  - teste
modulo: 1
dificuldade: facil
tentativa: 1
score: 0%
aprovado: false
data: 2026-10-21
---

# 📝 Bateria de Teste: Nível Fácil - Módulo 1 (Getting Started)

> [!NOTE] Instruções de Estudo Ativo
> Responda a todas as questões mentalmente ou marcando as caixas antes de expandir o bloco de gabarito.  
> **Meta para aprovação:** ≥ 90% de acertos.

---

### Questão 1
Qual ferramenta de desenvolvimento é a interface oficial e obrigatória para criação de aplicações no modelo **ABAP Cloud**?

- **A.** SAP GUI (transação SE80)
- **B.** ABAP Development Tools (ADT) no Eclipse
- **C.** Visual Studio Code com extensão SAP
- **D.** SAP Web IDE

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **B**  
> **Conceito:** O ambiente clássico SAP GUI não é compatível com o desenvolvimento em nuvem (ABAP Cloud). O Eclipse com o plugin ADT é a IDE homologada pela SAP.

---

### Questão 2
Para executar uma classe ABAP diretamente como um programa de console no Eclipse ADT, qual atalho de teclado deve ser utilizado?

- **A.** F8
- **B.** Ctrl + F3
- **C.** F9
- **D.** F3

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **C**  
> **Conceito:** No ADT, o atalho `F9` executa a classe no console (*Run As ABAP Application (Console)*), desde que a classe implemente a interface `if_oo_adt_classrun`. O atalho `F8` executa no ambiente gráfico tradicional ou Web.

---

### Questão 3
Qual das seguintes opções representa uma regra válida para atribuição de nomes de **classes ABAP**?

- **A.** O nome pode conter o símbolo de cifrão (`$`)
- **B.** O nome deve ter no máximo 10 caracteres
- **C.** O nome pode conter letras, dígitos e sublinhado (`_`), mas não caracteres especiais como `$`
- **D.** O nome não pode conter números

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **C**  
> **Conceito:** Classes ABAP aceitam letras (A-Z), números (0-9) e sublinhado (`_`). O caractere cifrão (`$`) é estritamente proibido.

---

### Questão 4
O que é necessário fazer no Eclipse ADT para que as alterações feitas em um objeto de desenvolvimento entrem em vigor no sistema?

- **A.** Apenas salvar o arquivo com Ctrl + S
- **B.** Ativar o objeto explicitamente (Ctrl + F3)
- **C.** Reiniciar o Eclipse
- **D.** Liberar a Transport Request

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **B**  
> **Conceito:** Salvar o arquivo apenas grava uma **versão inativa** no repositório. Para que a lógica seja compilada e executada pelo runtime, é obrigatório ativar o objeto (`Ctrl + F3`).

---

### Questão 5
Um projeto do tipo **ABAP Cloud Project** no ADT é utilizado para se conectar a quais ambientes? (Escolha duas opções)

- **A.** SAP Business Technology Platform (SAP BTP ABAP Environment)
- **B.** SAP R/3 versão 4.6C On-Premise
- **C.** SAP S/4HANA Cloud (com princípios de Clean Core)
- **D.** Banco de dados Oracle autônomo

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **A, C**  
> **Conceito:** Projetos ABAP Cloud conectam-se a instâncias governadas pelo modelo de desenvolvimento em nuvem: SAP BTP e SAP S/4HANA Cloud. Sistemas legados on-premise utilizam o tipo *ABAP Project* tradicional.
