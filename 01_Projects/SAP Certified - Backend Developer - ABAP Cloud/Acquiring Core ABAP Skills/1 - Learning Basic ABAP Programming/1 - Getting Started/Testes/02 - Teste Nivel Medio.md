---
tipo: teste-notebooklm
tags:
  - sap
  - abap
  - abap-cloud
  - teste
modulo: 1
dificuldade: medio
tentativa: 1
score: 0%
aprovado: false
data: 2026-10-24
---

# 📝 Bateria de Teste: Nível Médio - Módulo 1 (Getting Started)

> [!NOTE] Instruções de Estudo Ativo
> Este teste avalia a compreensão do **comportamento de execução, logística de software e ferramentas do Eclipse ADT** (*ABAP Development Tools* — o ambiente oficial de desenvolvimento no Eclipse).  
> Responda a todas as 10 questões antes de expandir o bloco de gabarito.  
> **Meta para aprovação:** ≥ 90% de acertos (mínimo de 9 em 10 questões).

---

### Questão 1
No **[[BTP - Business Technology Platform|SAP BTP]]** (*Business Technology Platform* — a Plataforma como Serviço, ou *PaaS*, em nuvem da SAP), qual é a ordem hierárquica correta desde o contrato corporativo até o ambiente onde o código ABAP é executado?

- **A.** Subaccount → Global Account → ABAP Instance → Runtime
- **B.** Global Account → Subaccount → Runtime (Cloud Foundry / Kyma) → ABAP Instance
- **C.** Global Account → Runtime → Subaccount → Software Component
- **D.** Software Component → Global Account → Subaccount → ABAP Instance

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **B**  
> **Conceito:** A governança inicia na **Global Account** (conta global que representa o contrato com a SAP), divide-se em **Subaccounts** (subcontas independentes, geralmente separadas por ambiente ou projeto), onde se provisiona um **Runtime** (motor de execução como *Cloud Foundry* ou *Kyma*) que hospeda a **ABAP Instance** (instância do servidor ABAP).

---

### Questão 2
Um desenvolvedor está criando um projeto **[[ABAP Cloud]]** no Eclipse ADT para se conectar a uma instância no SAP BTP, mas o administrador do sistema não enviou a URL direta da instância (*ABAP Service Instance URL*). Em vez disso, enviou um arquivo JSON chamado **Service Key** (Chave de Serviço com credenciais e endereços técnicos da instância). Como o desenvolvedor deve proceder na janela de criação do projeto?

- **A.** Abrir o SAP GUI, importar o arquivo JSON na transação SM59 e copiar a conexão RFC
- **B.** Usar a opção **Extract** na janela do ADT para importar o arquivo da *Service Key* e copiar a *Service Instance URL* gerada
- **C.** Renomear o arquivo JSON para `.abap` e arrastá-lo para dentro da aba *Project Explorer*
- **D.** Criar um *ABAP Project* tradicional, pois o *ABAP Cloud Project* não suporta autenticação via *Service Key*

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **B**  
> **Conceito:** O assistente de criação do *ABAP Cloud Project* no ADT possui o link **Extract**, que permite importar o arquivo de *Service Key* (*Import...*) para extrair automaticamente a **ABAP Service Instance URL**, seguido da autenticação no navegador (*Open Logon Page in Browser*).

---

### Questão 3
Durante a análise da classe `/DMO/CL_FLIGHT_LEGACY` no Eclipse ADT, você posiciona o cursor sobre uma chamada de método, pressiona **F3** para inspecionar sua implementação e, após a leitura, deseja voltar exatamente para a linha de código onde estava antes. Qual combinação de teclas realiza esse retorno imediato?

- **A.** Ctrl + Shift + A
- **B.** Alt + Seta para a Esquerda (`Alt + ←`)
- **C.** Ctrl + F3
- **D.** F2

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **B**  
> **Conceito:** Enquanto **F3** navega para a definição ou implementação do elemento selecionado, o atalho **`Alt + ←`** funciona como o botão "Voltar" do histórico de navegação do editor no Eclipse ADT. `Ctrl + Shift + A` abre a busca de objetos, `F2` exibe informações rápidas (*Quick Info*) e `Ctrl + F3` ativa o objeto.

---

### Questão 4
Qual é a diferença prática entre utilizar as teclas **F1** e **F2** ao posicionar o cursor sobre uma instrução como `SELECT FROM /dmo/travel` no editor do Eclipse ADT?

- **A.** `F1` abre a documentação oficial da linguagem ABAP (*ABAP Language Help*) para o comando `SELECT`, enquanto `F2` exibe informações rápidas de tipagem e estrutura (*Quick Info*) do elemento sob o cursor (como a tabela `/dmo/travel`)
- **B.** `F1` executa o comando SQL no console, enquanto `F2` verifica erros de sintaxe no código
- **C.** `F1` exibe os dados administrativos do autor da classe, enquanto `F2` navega para a definição do pacote
- **D.** `F1` aciona o assistente de IA Joule, enquanto `F2` salva uma versão inativa do código

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **A**  
> **Conceito:** No ADT, **F1** (*ABAP Language Help*) consulta a documentação sintática da linguagem ABAP para a palavra-chave atual. Já **F2** (*Quick Info*) inspeciona os metadados técnicos do identificador selecionado (como colunas de uma tabela, tipo de uma variável ou parâmetros de um método) sem precisar sair da tela atual.

---

### Questão 5
Para que uma classe global possa ser executada diretamente no console do Eclipse ADT (atalho **F9**) sem a necessidade de criar uma interface gráfica SAP Fiori, quais elementos técnicos são obrigatórios? (Escolha duas opções)

- **A.** Declarar um evento `START-OF-SELECTION` dentro da classe
- **B.** Implementar a interface `IF_OO_ADT_CLASSRUN` na definição da classe
- **C.** Utilizar o método `out->write( ... )` dentro da implementação do método `if_oo_adt_classrun~main`
- **D.** Utilizar o comando clássico `WRITE: / 'Texto'.` dentro do construtor da classe

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **B, C**  
> **Conceito:** No **[[ABAP Cloud]]**, relatórios procedurais (`START-OF-SELECTION`) e o comando `WRITE` foram descontinuados para manter o **[[Clean Core]]** (núcleo limpo). Para testes rápidos em console, a classe deve implementar a interface **`IF_OO_ADT_CLASSRUN`** e usar o objeto de referência `out` (parâmetro recebido no método `main`) através da chamada `out->write( )`.

---

### Questão 6
Um desenvolvedor alterou o texto dentro de `out->write( 'Versão 2' )` na sua classe `ZCL_01_HELLO_WORLD`, pressionou **Ctrl + S** para salvar e imediatamente pressionou **F9** para executar no console. No entanto, o console continuou exibindo `'Versão 1'`. Por que isso aconteceu?

- **A.** O Eclipse ADT exige que o projeto seja fechado e reaberto após qualquer edição em strings
- **B.** O atalho `Ctrl + S` apenas grava uma versão inativa (rascunho) no repositório; o runtime ABAP continua executando a última versão ativa até que o desenvolvedor pressione `Ctrl + F3`
- **C.** O atalho `F9` só funciona após a liberação da *Transport Request* para o ambiente de qualidade (QAS)
- **D.** O método `out->write( )` armazena dados em cache por 24 horas no SAP BTP

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **B**  
> **Conceito:** O repositório ABAP separa a versão **Inativa** (salva com `Ctrl + S`, visível apenas para quem está editando) da versão **Ativa** (compilada com `Ctrl + F3`). Ao executar um programa com `F9`, o servidor executa a versão ativa vigente.

---

### Questão 7
Na estrutura logística do ABAP, qual é a relação correta entre **Repository Objects** (Objetos de Repositório, como classes e tabelas), **Packages** (Pacotes) e **Software Components** (Componentes de Software)?

- **A.** Todo *Software Component* é criado dentro de uma classe, que por sua vez pertence a um *Package* opcional
- **B.** Os *Repository Objects* são agrupados dentro de um *Package* lógico, e cada *Package* pertence obrigatoriamente a um *Software Component* (que representa a unidade maior de entrega)
- **C.** *Packages* e *Software Components* são sinônimos e usados apenas em sistemas On-Premise legados
- **D.** Um objeto customizado `ZCL_TESTE` pode ser transportado para produção sem pacote, desde que possua um *Software Component*

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **B**  
> **Conceito:** A hierarquia organizacional vai do macro para o micro: **Software Component** (unidade de entrega e versionamento, ex: `ZSTUDENTS`) → **Superpackage / Subpackage** (contêiner lógico funcional, ex: `ZS4D400_01`) → **Repository Objects** (classes, tabelas, CDS Views). Todo objeto transportável exige um pacote.

---

### Questão 8
Sobre o funcionamento de uma **Ordem de Transporte (*Transport Request*)** em um trabalho em equipe no ambiente de desenvolvimento (*DEV*), quais afirmações estão corretas? (Escolha duas opções)

- **A.** Quando um desenvolvedor edita um objeto e o vincula a uma *Transport Request*, o objeto recebe um bloqueio (*lock*), impedindo que outro desenvolvedor o altere simultaneamente em outra request
- **B.** O proprietário (*Owner*) da request deve liberar a *Transport Request* principal antes que os desenvolvedores participantes liberem suas tarefas individuais (*Tasks*)
- **C.** Cada desenvolvedor participante possui uma *Task* (tarefa) dentro da *Transport Request* e deve liberá-la (*Task Release*) ao concluir suas alterações, antes da liberação final da request principal
- **D.** O bloqueio (*lock*) dos objetos permanece ativo mesmo após a *Transport Request* principal ser liberada e exportada

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **A, C**  
> **Conceito:** O mecanismo de *locking* protege contra sobrescrita simultânea em equipe. Na hora de entregar, a ordem obrigatória é de baixo para cima: primeiro cada membro libera sua **Task** individual (*Task Release*); somente quando todas as tasks estão liberadas é que o proprietário consegue liberar a **Request** principal (*Request Release*), momento em que os objetos são desbloqueados e exportados.

---

### Questão 9
Ao explorar códigos existentes no seu projeto, você encontra três objetos: `CL_ABAP_CONTEXT_INFO`, `/DMO/CL_FLIGHT_LEGACY` e `ZCL_01_HELLO_WORLD`. Com base nas regras de **Namespaces** (Espaços de Nomes) do SAP, o que cada prefixo indica respectivamente?

- **A.** Objeto de parceiro certificado; Objeto padrão da SAP; Objeto customizado de cliente
- **B.** Objeto padrão da SAP; Objeto registrado em namespace de parceiro/demonstração delimitado por barras; Objeto customizado de cliente
- **C.** Todos os três são objetos customizados do cliente, variando apenas a versão do ABAP
- **D.** Objeto temporário sem transporte; Objeto de banco de dados; Objeto de interface gráfica

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **B**  
> **Conceito:** A separação de *Namespaces* evita colisões de nomes durante atualizações (*upgrades*) da SAP:
> - **Sem prefixo `Z/Y` ou `/.../`** (ex: `CL_...`): reservado ao padrão oficial da **SAP**.
> - **Delimitado por barras `/NOME/`** (ex: `/DMO/` ou `/LRN/`): namespace exclusivo registrado por parceiros ou pacotes de treinamento/certificados.
> - **Iniciado por `Z` ou `Y`** (ex: `ZCL_...`): reservado para criações customizadas do **cliente**.

---

### Questão 10
A SAP incorporou recursos de Inteligência Artificial (IA) ao ecossistema ABAP moderno. Qual é a distinção fundamental entre o recurso **Explain do Joule** e o **ABAP AI SDK** (*Software Development Kit* — Kit de Desenvolvimento de Software)?

- **A.** O *Joule Explain* serve para criar relatórios financeiros para o usuário final, enquanto o *ABAP AI SDK* substitui o Eclipse ADT
- **B.** O *Joule Explain* é um assistente integrado à IDE que explica trechos de código ABAP em linguagem natural para o desenvolvedor, enquanto o *ABAP AI SDK* permite programar aplicações de negócio ABAP que consomem modelos de IA generativa
- **C.** O *Joule Explain* converte código Java para ABAP automaticamente, enquanto o *ABAP AI SDK* gerencia senhas de usuários no SAP BTP
- **D.** Não há diferença; ambos são nomes comerciais para o atalho `F1` do Eclipse ADT

> [!success]- Gabarito e Explicação
> **Resposta Correta:** **B**  
> **Conceito:** Existem duas frentes de IA no ABAP:
> 1. **IA para produtividade do desenvolvedor (Joule no ADT):** analisa código complexo (recurso *Explain*) e oferece autocompletar preditivo enquanto você programa.
> 2. **IA embarcada no produto de negócio (ABAP AI SDK):** biblioteca que você chama dentro do seu código ABAP para que a sua aplicação corporativa utilize capacidades de IA generativa.
