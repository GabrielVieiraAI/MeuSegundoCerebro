---
tipo: teste-notebooklm
tags:
  - sap
  - abap
  - abap-cloud
  - teste
modulo: 1
dificuldade: dificil
tentativa: 1
score: 0%
aprovado: false
data: 2026-10-24
---

# 📝 Bateria de Teste: Nível Difícil (Tentativa 1) - Módulo 1 (Getting Started)

> [!NOTE] Instruções de Estudo Ativo
> Este teste simula o rigor da certificação oficial **SAP Certified Associate - Back-End Developer - ABAP Cloud (`C_ABAPD`)**, cobrindo **cenários de resolução de problemas (*troubleshooting*), restrições de [[Clean Core]] e arquitetura de nuvem**.  
> Atenção às questões de múltipla resposta (no padrão da prova oficial SAP, não há pontuação parcial: você deve acertar todas as alternativas pedidas na questão).  
> **Meta para aprovação:** ≥ 90% de acertos (mínimo de 9 em 10 questões).

---

### Questão 1
Uma empresa possui dois sistemas SAP distintos na sua paisagem:
1. Um sistema **SAP S/4HANA On-Premise** legado, onde a equipe dá manutenção em relatórios clássicos na transação `SE38`.
2. Uma nova instância do **SAP BTP ABAP Environment**, onde a equipe desenvolve extensões seguindo estritamente o modelo **[[ABAP Cloud]]**.

O arquiteto pede que você configure o seu **Eclipse ADT** (*ABAP Development Tools*) para trabalhar em ambos os sistemas. Qual configuração de projetos você deve realizar no Eclipse?

- **A.** Criar dois *ABAP Cloud Projects*, pois o ADT moderno converte automaticamente sistemas On-Premise para o modelo Cloud
- **B.** Criar um *ABAP Project* para conectar ao SAP S/4HANA On-Premise e um *ABAP Cloud Project* separado para conectar ao SAP BTP ABAP Environment
- **C.** Criar um único *ABAP Project* e adicionar as duas *Service Keys* dentro do mesmo pacote `ZLOCAL`
- **D.** Utilizar o SAP GUI para ambos os sistemas, pois o Eclipse ADT não permite conexões simultâneas a sistemas On-Premise e Cloud

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **B**  
> **Conceito:** No Eclipse ADT, cada conexão com um sistema ABAP é representada por um projeto independente. Sistemas tradicionais *On-Premise* (ou *S/4HANA Private Cloud* sem restrição de nuvem pública) utilizam **ABAP Project**, enquanto instâncias governadas nativamente pelo modelo de nuvem (**[[BTP - Business Technology Platform|SAP BTP ABAP Environment]]** ou **SAP S/4HANA Public Cloud**) exigem um **ABAP Cloud Project**.

---

### Questão 2
Você está revisando o código de um colega desenvolvedor júnior que tentou criar sua primeira aplicação no **ABAP Cloud** para imprimir uma mensagem de diagnóstico no console do Eclipse ADT:

```abap
CLASS zcl_diag$01 DEFINITION PUBLIC FINAL CREATE PUBLIC.
  PUBLIC SECTION.
    METHODS main.
ENDCLASS.

CLASS zcl_diag$01 IMPLEMENTATION.
  METHOD main.
    WRITE 'Diagnóstico concluído com sucesso'.
  ENDMETHOD.
ENDCLASS.
```

Ao tentar ativar e executar a classe com **F9**, o código falha. Quais são os **três erros** cometidos pelo desenvolvedor considerando as regras do ABAP Cloud? (Escolha três opções)

- **A.** O nome da classe `zcl_diag$01` contém o caractere cifrão (`$`), que é estritamente proibido em nomes de classes ABAP
- **B.** A classe declarou um método `main` próprio em vez de declarar e implementar a interface `if_oo_adt_classrun` (`INTERFACES if_oo_adt_classrun` e `METHOD if_oo_adt_classrun~main`)
- **C.** O comando procedural `WRITE` foi utilizado, o qual é proibido no ABAP Cloud por violar o *Clean Core* (deveria usar `out->write( ... )`)
- **D.** Nomes de classes no ABAP Cloud não podem conter números como `01`
- **E.** O código deveria ter sido escrito em letras maiúsculas, pois o ABAP diferencia maiúsculas de minúsculas (*case-sensitive*) em palavras-chave

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **A, B, C**  
> **Conceito:**  
> 1. **Nomenclatura (A):** Classes ABAP aceitam letras, dígitos (`0-9`) e sublinhado (`_`), mas proíbem o símbolo `$`.  
> 2. **Contrato de Console (B):** O ADT só reconhece uma classe como executável via `F9` se ela implementar explicitamente a interface `IF_OO_ADT_CLASSRUN` e seu método `if_oo_adt_classrun~main`.  
> 3. **Clean Core (C):** O comando `WRITE` pertence ao modelo clássico de listas do SAP GUI (banido no ABAP Cloud). A saída no console deve usar a referência `out->write( )`.

---

### Questão 3
Em um projeto **ABAP Cloud**, os desenvolvedores **Ana** e **Bruno** estão trabalhando no mesmo ambiente de desenvolvimento (`DEV`):
- **Ana** edita a classe `ZCL_CALCULO_IMPOSTO`, salva a alteração com **Ctrl + S** (sem ativar) e sai para almoçar. A classe ficou vinculada à *Task* da Ana dentro da *Transport Request* `TRK900123`.
- Enquanto Ana está fora, **Bruno** abre o Eclipse ADT para testar o sistema e tentar corrigir um detalhe na mesma classe `ZCL_CALCULO_IMPOSTO`.

O que acontecerá com **Bruno** nesse cenário? (Escolha duas opções)

- **A.** Ao executar a classe `ZCL_CALCULO_IMPOSTO` com `F9`, Bruno verá o comportamento da **última versão ativa** (anterior à edição não ativada de Ana)
- **B.** Bruno será impedido de editar a classe em uma nova *Transport Request*, pois o objeto encontra-se bloqueado (*locked*) pela *Transport Request* `TRK900123` onde Ana está trabalhando
- **C.** A versão inativa de Ana será automaticamente ativada assim que Bruno abrir a classe com `Ctrl + Shift + A`
- **D.** Bruno poderá sobrescrever livremente o código de Ana desde que pressione `Ctrl + F3` antes dela voltar do almoço

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **A, B**  
> **Conceito:**  
> - **Isolamento Inativo vs. Ativo (A):** Alterações apenas salvas (`Ctrl + S`) ficam na área de trabalho inativa. Qualquer execução no sistema consome a versão **ativa** (`Ctrl + F3`).  
> - **Bloqueio de Transporte / Locking (B):** Assim que um objeto entra em uma *Transport Request*, o sistema aplica um *lock* exclusivo a essa request. Outro desenvolvedor não pode editá-lo em outra request até que a request original seja liberada (ou que ele seja adicionado como participante na mesma request).

---

### Questão 4
Você abriu uma classe complexa usando o atalho **Ctrl + Shift + A** (sem navegar pelas pastas manualmente). Agora você precisa descobrir duas informações rapidamente:
1. Qual é o **idioma original (*Original Language*)** e a **data da última modificação** daquela classe.
2. Em qual subpacote dentro da árvore do **Project Explorer** à esquerda essa classe está armazenada.

Qual combinação de recursos do Eclipse ADT resolve essas duas necessidades da forma mais direta?

- **A.** Pressionar `F1` no nome da classe e depois executar a classe com `F9`
- **B.** Consultar a aba **Properties** (abaixo do editor) para ver os metadados administrativos e clicar no ícone **Link with Editor** na barra do *Project Explorer* para localizar o objeto na árvore de pacotes
- **C.** Pressionar `F2` sobre a palavra `CLASS` e criar uma nova *Transport Request*
- **D.** Usar o atalho `Alt + ←` e exportar a *Service Key* do projeto

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **B**  
> **Conceito:** A aba **Properties** (Propriedades) exibe todos os dados administrativos do objeto de repositório (autor, idioma original, pacote, componente de software e carimbo de data/hora). Já o botão **Link with Editor** sincroniza automaticamente a árvore da visão *Project Explorer* com a aba de código aberta no momento.

---

### Questão 5
Durante a criação de um novo **Pacote ABAP (*ABAP Package*)** customizado para um projeto corporativo no **ABAP Cloud**, quais requisitos arquiteturais são exigidos pelo sistema para que seus objetos possam ser transportados até o ambiente de Produção (*PRD*)? (Escolha duas opções)

- **A.** O nome do pacote deve respeitar o *namespace* de cliente, iniciando com a letra **Z** ou **Y** (ou um namespace de parceiro registrado `/.../`)
- **B.** O pacote deve ser associado obrigatoriamente a um **Software Component** (Componente de Software) válido e registrado a uma **Transport Request**
- **C.** O pacote deve conter exclusivamente tabelas de banco de dados, sendo proibido misturar classes e interfaces no mesmo pacote
- **D.** O pacote deve iniciar obrigatoriamente com o prefixo `SAP_` para herdar as permissões do *Clean Core*

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **A, B**  
> **Conceito:** Todo desenvolvimento customizado de cliente exige o namespace `Z` ou `Y` para evitar colisões em upgrades da SAP. Além disso, para fazer parte da logística de software (`DEV -> TST -> PRD`), o pacote precisa pertencer a um **Software Component** (unidade de entrega) e sua criação deve ser gravada em uma **Transport Request**.

---

### Questão 6
Por que a SAP bloqueou o uso da transação `SE38` (programas executáveis procedurais / *Reports*) e das telas clássicas (*Dynpros*) no modelo **[[ABAP Cloud]]**, exigindo o uso de classes globais e **[[RAP - ABAP RESTful Application Programming Model|RAP]]** / SAP Fiori?

- **A.** Porque o comando `REPORT` consome mais memória RAM no navegador do usuário final do que o Eclipse
- **B.** Para garantir o princípio de **[[Clean Core]]** (desacoplamento estrito entre customizações e o núcleo padrão da SAP, orientação a objetos, APIs liberadas e prontidão para atualizações automáticas na nuvem sem quebras)
- **C.** Porque o banco de dados SAP HANA não consegue executar instruções `SELECT` originadas de programas procedurais
- **D.** Apenas por uma mudança estética, já que o código interno de um *Report* clássico e de uma classe global `IF_OO_ADT_CLASSRUN` é idêntico

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **B**  
> **Conceito:** No modelo clássico (*On-Premise* antigo), relatórios procedurais acoplavam regras de negócio, acesso direto a tabelas internas da SAP e lógica de tela (*Dynpro*) no mesmo arquivo, quebrando o sistema a cada atualização (*upgrade*). O **ABAP Cloud** impõe o **[[Clean Core]]**: código 100% orientado a objetos (**[[Orientação a Objetos no ABAP]]**), uso exclusivo de objetos/APIs liberados pela SAP e separação clara entre back-end e interface web (**SAP Fiori**).

---

### Questão 7
Analise a assinatura e implementação padrão gerada pelo Eclipse ADT ao adicionar a interface `IF_OO_ADT_CLASSRUN` em uma classe:

```abap
CLASS zcl_teste_console DEFINITION PUBLIC FINAL CREATE PUBLIC.
  PUBLIC SECTION.
    INTERFACES if_oo_adt_classrun.
ENDCLASS.

CLASS zcl_teste_console IMPLEMENTATION.
  METHOD if_oo_adt_classrun~main.
    out->write( 'Teste de Execução' ).
  ENDMETHOD.
ENDCLASS.
```

De onde vem o identificador `out` utilizado dentro do método `if_oo_adt_classrun~main`, já que ele não foi declarado com `DATA` dentro do método?

- **A.** `out` é uma variável global do sistema ABAP disponível em qualquer classe ou tabela desde a versão R/3
- **B.** `out` é um parâmetro de importação (*Importing Parameter*) definido na assinatura do método `main` pela própria interface `IF_OO_ADT_CLASSRUN` (do tipo `REF TO if_oo_adt_classrun_out`), que o runtime injeta automaticamente ao pressionar `F9`
- **C.** `out` é uma palavra-chave da linguagem ABAP que substituiu o comando `WRITE` em todos os métodos do sistema
- **D.** `out` é o nome do pacote onde a classe foi salva

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **B**  
> **Conceito:** Quando uma classe implementa uma interface, ela herda a assinatura exata dos métodos definidos no "contrato" daquela interface. Na interface `IF_OO_ADT_CLASSRUN`, o método `main` já declara o parâmetro `out` (uma referência para a interface auxiliar `IF_OO_ADT_CLASSRUN_OUT`). Ao pressionar `F9`, o framework do ADT instancia o controlador do console e passa a referência `out` para o seu método.

---

### Questão 8
Uma equipe de 3 desenvolvedores finalizou a construção de uma funcionalidade no ambiente de desenvolvimento (`DEV`). Todos os objetos estão salvos, ativados (`Ctrl + F3`) e testados. No entanto, o administrador responsável pelo transporte informa que **não consegue importar** a *Transport Request* principal para o ambiente de Testes/Qualidade (`TST/QAS`).

Qual é a sequência exata de ações que deve ser verificada e concluída no ADT antes que a request possa ser importada em `TST/QAS`?

- **A.** Os objetos devem ser desativados com `Ctrl + S`, copiados manualmente via arquivo `.zip` e colados na subconta de Qualidade
- **B.** Todos os 3 desenvolvedores devem primeiro liberar suas respectivas **Tasks** (*Task Release*) e, em seguida, o proprietário (*Owner*) deve liberar a **Transport Request** principal (*Request Release*)
- **C.** O proprietário deve excluir as *Tasks* dos outros 2 desenvolvedores para remover o bloqueio (*lock*) antes de liberar a request principal
- **D.** Os pacotes `ZS4D400_##` precisam ser renomeados para `/SAP/S4D400` antes da exportação

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **B**  
> **Conceito:** Uma *Transport Request* só fica disponível para exportação/importação entre ambientes quando muda seu status para **Liberada (*Released*)**. Regra de ouro da logística SAP: a Request principal **não pode** ser liberada enquanto houver qualquer *Task* (tarefa filha) aberta. Portanto: 1º Todos os membros liberam suas *Tasks* → 2º O *Owner* libera a *Request* → 3º O bloqueio (*lock*) é removido e o pacote de transporte segue para `TST`.

---

### Questão 9
Ao posicionar o cursor sobre a palavra-chave `SELECT` em uma classe no Eclipse ADT e pressionar **F1** para abrir a *ABAP Language Help*, você recebe uma mensagem na aba de ajuda informando que *"os resultados da consulta não são suportados na versão de linguagem ABAP atual"*. Como você contorna esse comportamento no próprio ADT para visualizar a documentação oficial do comando?

- **A.** Alterar o projeto de *ABAP Cloud Project* para *ABAP Project* nas configurações do Windows
- **B.** Digitar a palavra-chave `SELECT` diretamente no campo de busca (*search term*) dentro da própria aba *ABAP Language Help* e pressionar **Enter**
- **C.** Pressionar `Ctrl + F3` para forçar a atualização do dicionário de ajuda da SAP
- **D.** Substituir `F1` pelo atalho `Ctrl + F`, que busca na documentação online da SAP

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **B**  
> **Conceito:** Conforme abordado no exercício prático de investigação de código no ADT, caso o disparo contextual do **F1** avise que o termo não retornou resultado direto para a versão da linguagem, basta digitar a instrução (ex: `SELECT`) diretamente na caixa de pesquisa interna da visualização *ABAP Language Help* e pressionar *Enter*.

---

### Questão 10
Qual das alternativas abaixo descreve um cenário onde você deve utilizar o **ABAP AI SDK** em vez dos recursos nativos do assistente **Joule** no Eclipse ADT?

- **A.** Você recebeu uma classe legada de 800 linhas sem comentários e precisa de um resumo rápido em português do que aquele método faz
- **B.** Você está digitando um bloco de código repetitivo no editor do Eclipse e deseja que a IDE complete as próximas linhas de forma preditiva
- **C.** Você precisa desenvolver uma classe de negócio ABAP que, ao ser executada no sistema produtivo, envia o texto de uma reclamação de cliente para um modelo de linguagem (LLM) classificar o sentimento e gravar o resultado no banco de dados
- **D.** Você quer descobrir qual é o tipo de dados da tabela `/dmo/travel` sem sair do editor de código

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **C**  
> **Conceito:**  
> - **Alternativas A e B** são funções do **Joule no ADT** (*Explain* e conclusão preditiva de código), voltadas para ajudar o *programador* em tempo de desenvolvimento (*design time*).  
> - **Alternativa D** é função do atalho **F2** (*Quick Info*).  
> - **Alternativa C** é o propósito exato do **ABAP AI SDK**: permitir que você construa aplicações corporativas em ABAP que consomem Inteligência Artificial em tempo de execução (*runtime*).
