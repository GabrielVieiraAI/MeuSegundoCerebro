---
tags:
  - projeto
  - insi
  - veiling-holambra
  - sap
  - fi-ar
  - del-r2r-009
  - reuniao
id_demanda: DEL-R2R-009
tipo: reuniao
data: 2026-10-22
---

# Segunda Reunião com Consultor – Esclarecimento de Dúvidas DEL-R2R-009

⬅️ [[00 - Identificação da Solicitação e Sumário|Sumário da Demanda]] | 📄 [[03 - Detalhamento para Desenvolvimento|Detalhamento para Desenvolvimento]] | 🔙 [[Primeira reunião com consultores|Primeira Reunião]]

---

## 📌 Visão Geral da Reunião
* **Data:** 22/10/2026
* **Participantes:** 
  * **Gabriel Vieira de Souza** (Desenvolvedor ABAP)
  * **Maycon da Silva Nogueira** (Consultor Funcional / Especialista da Solução)
* **Objetivo:** Esclarecer os pontos ambíguos do delta [[00 - Identificação da Solicitação e Sumário|DEL-R2R-009]] identificados durante a leitura da documentação, validar o que continua valendo após a eliminação do *Job* (decidida na [[Primeira reunião com consultores|primeira reunião]]) e definir o que fica fora do escopo do desenvolvimento.

---

## 📋 Resumo dos Tópicos Discutidos

### 1. Como o App Reconhece os Bloqueios (Standard x Tabela de Log)
* O texto do delta (PR-12) dizia que o cliente só é considerado "bloqueado pelo app" quando o último registro na tabela Z de log é um bloqueio. O consultor reconheceu que essa redação ficou confusa.
* **Entendimento final:** quem define se o cliente está bloqueado é o **campo standard** do segmento de crédito (`UKMBP_CMS_SGM-XBLOCKED` e `BLOCK_REASON`). A tabela de log **não define** o status; ela apenas registra quem bloqueou/desbloqueou, quando e por qual motivo.
* Clientes bloqueados por **outros motivos** (ex.: pendência fiscal ou jurídica, feitos manualmente no app standard) **não aparecem na listagem** do app.
* O único motivo de bloqueio utilizado no app é **Inadimplência** — o usuário-chave não sugeriu outros motivos.

### 2. Clientes Vinculados (Matriz e Filiais)
* Confirmado: o crédito é centralizado exclusivamente na **Matriz**. As filiais não possuem conta de crédito própria.
* A CDS avalia a hierarquia standard em tempo real. Se uma filial ficar inadimplente, a proposta de bloqueio é gerada para a **Matriz**, exibindo a filial como **BP de Origem**.

### 3. Itens Fora do Escopo do Desenvolvedor
* **Integração com legados:** o DEL-R2R-009 não envia mensagens. O `DEL-COM-051` (ainda **não desenvolvido**) vai usar *Event Mesh* (serviço de eventos da SAP) para detectar as alterações gravadas no sistema e publicar na fila. O desenvolvedor pode **ignorar** qualquer comunicação com legados.
* **Crédito sazonal:** totalmente fora do escopo; ignorar.
* **CVD:** é o sistema legado da Veiling (apenas informativo).
* **Volume e frequência do GAP:** desconsiderar (eram referências ao Job eliminado).
* **"Gravação do bloqueio e do motivo pelas classes standard" (item do detalhamento):** segundo o consultor, esse trecho pertencia ao `DEL-COM-051` e foi colocado por engano no 009. Pode ser desconsiderado como requisito deste delta.

### 4. Rastreabilidade e Tabela de Log
* A rastreabilidade (quem, quando, motivo) será feita pela tabela Z de log.
* **Ponto em aberto:** a tabela de log não fica visível para o usuário final (ele só acessa o Launchpad). Não ficou definido **como** o usuário vai consultar essa auditoria. O consultor vai levantar a questão com o cliente.
* Até a resposta, o desenvolvimento segue o que está no delta: apenas gravar a tabela de log, sem app de consulta.
* A "tabela Z de lista de trabalho" citada no detalhamento era uma herança do Job. O consultor explicou que a necessidade real é ter salvo o histórico do que foi bloqueado/desbloqueado — o que já é atendido pela tabela de log.

### 5. Retorno do Processamento em Massa
* "Processar cada cliente de forma independente" significa que um erro em um cliente **não impede** o processamento dos demais.
* **Não** deve ser exibido um pop-up por cliente (ex.: 100 clientes = 100 pop-ups). O retorno deve ser **consolidado**, mostrando claramente quais clientes foram processados com sucesso, quais falharam e o motivo do erro, para o usuário poder refazer a tentativa.
* A forma de apresentação é livre. O desenvolvedor vai pesquisar e propor a solução mais viável.

### 6. Navegação para Apps Standard
* A navegação para *Administrar Contas de Crédito* e *Administrar Itens de Cliente* é **opcional**. A busca do próprio Launchpad já atende.

### 7. Tabela de Parâmetros
* Vai armazenar a relação entre **classe de risco e perfil** do cliente: `1A` = à vista, `2A` = a prazo, `5` = CVH Interna (excluída da avaliação).
* Motivo: o cliente já mudou essa classificação antes (tinha 9 classes) e pode incluir novas no futuro.

### 8. Objeto de Autorização
* Confirmado: é a permissão que precisa estar no perfil do usuário para acessar e alterar dados no app. Campos: Empresa (`BUKRS` = `CVH1`), Segmento de Crédito e Atividade (Exibir / Bloquear / Desbloquear).
* A criação fica a cargo do desenvolvedor.

### 9. Premissas Revisadas
* **PR-03 (juros e multas):** não serão considerados. O valor inadimplente é o valor cravado no título, sem juros ou multa agregados. É uma premissa mais para a Veiling do que para o desenvolvimento.
* **PR-08 (supermercados):** os clientes de Autosserviço **são exibidos** na lista, pois existem exceções em que eles podem ser bloqueados. O app deve oferecer um **filtro por segmento de atuação** para o usuário incluir ou remover esses clientes manualmente. Não há controle automático.
* **PR-13 (carga inicial no go-live):** era uma sugestão gerada por IA. Como o status do bloqueio vem do campo standard, a carga inicial na tabela de log é **desnecessária**. Consultor concordou.

### 10. Próximos Passos
* **Gabriel:** iniciar a especificação técnica com base no que já foi alinhado (sem esperar atualização do delta). A especificação é enviada ao **Rafa** (líder ABAP); os consultores apenas acompanham. Depois, alinhar com o Rafa a estimativa de horas.
* **Gabriel:** propor a forma de exibir o retorno consolidado do processamento em massa.
* **Maycon:** atualizar o **Plano de Testes** do delta, removendo os cenários baseados no Job, para evitar divergências na fase de testes.
* **Maycon:** levantar com o cliente como a auditoria da tabela de log será consultada.
* **Maycon:** alinhar o `DEL-COM-051` com o ABAP responsável.

---

## ⚖️ Decisões Tomadas na Reunião

|   #    | Tópico | Dúvida / Como constava no Delta | Decisão Final Acordada | Impacto no Desenvolvimento |
| :----: | :----- | :------------------------------ | :--------------------- | :------------------------- |
| **01** | **Reconhecimento do bloqueio (PR-12)** | Cliente só seria "bloqueado pelo app" se o último registro no log fosse um bloqueio com o mesmo motivo. | O status vem do **campo standard** (`XBLOCKED` / `BLOCK_REASON`). O log é apenas registro de auditoria. Bloqueios por outros motivos não aparecem no app. | A CDS lê o bloqueio direto de `UKMBP_CMS_SGM`. Não usar a tabela de log como regra de status. |
| **02** | **Motivo do bloqueio** | Motivo informado pelo usuário via *match code*, com possibilidade de outros motivos. | O único motivo utilizado é **Inadimplência**. | Avaliar se o diálogo de seleção de motivo continua necessário (confirmar na especificação). |
| **03** | **Matriz e Filiais** | Bloqueio do BP principal e de todos os BPs vinculados. | Bloqueio aplicado **somente na Matriz**; filial devedora exibida como **BP de Origem**. | CDS resolve a hierarquia em tempo real e aponta a Matriz como alvo da ação. |
| **04** | **Integração com legados** | Distribuição aos legados citada em vários trechos. | Responsabilidade 100% do `DEL-COM-051` (via *Event Mesh*), ainda não desenvolvido. | Ignorar qualquer comunicação com legados. |
| **05** | **Crédito sazonal, volume e frequência** | Citados no delta. | Fora do escopo / obsoletos com a eliminação do Job. | Ignorar. |
| **06** | **Gravação pelas classes standard para o DEL-COM-051** | Item do detalhamento da implementação. | Trecho pertencia ao `DEL-COM-051`, colocado por engano. | Desconsiderar como requisito do 009. |
| **07** | **Tabela Z de lista de trabalho** | Tabela com as propostas da última execução do Job. | Substituída pelo histórico já gravado na **tabela de log**. | Não criar tabela de lista de trabalho. |
| **08** | **Consulta da auditoria pelo usuário** | Delta não define onde o usuário vê o log. | **Em aberto.** Por ora, apenas gravar a tabela de log. | Não criar app de consulta do log até a resposta do consultor. |
| **09** | **Retorno do processamento em massa** | "Mensagem de sucesso ou erro por cliente". | Processamento independente com **retorno consolidado** (sucesso / erro / motivo por cliente), sem um pop-up por cliente. | Desenvolvedor propõe o formato de exibição. |
| **10** | **Navegação para apps standard** | Navegação para *Administrar Contas de Crédito* e *Itens de Cliente*. | **Opcional.** | Implementar apenas se for simples. |
| **11** | **Tabela de parâmetros** | Relação classe de risco x perfil e classes excluídas. | Mantido: `1A` à vista, `2A` a prazo, `5` excluída. | Ler o mapeamento da tabela de parâmetros, não fixar no código. |
| **12** | **Objeto de autorização** | Objeto customizado `Z_FI_BLOQ`. | Confirmado. | Criação pelo desenvolvedor. |
| **13** | **Juros e multas (PR-03)** | Saldo vencido não considera juros e multas. | Confirmado: valor cravado do título, sem acréscimos. | Não somar juros/multas no cálculo da CDS. |
| **14** | **Supermercados / Autosserviço (PR-08)** | Clientes que não devem ser bloqueados. | São exibidos; o usuário decide manualmente. | Disponibilizar **filtro por segmento de atuação** no app. |
| **15** | **Carga inicial no go-live (PR-13)** | Registro inicial na tabela de log para clientes migrados. | **Descartado.** | Não criar programa de carga inicial. |
| **16** | **Plano de testes** | Cenários baseados no Job. | Consultor vai atualizar. | Aguardar novos cenários para os testes unitários. |

---

## 💬 Transcrição Completa da Reunião

<details>
<summary><b>📜 Clique aqui para expandir a transcrição completa (WebVTT)</b></summary>

```webvtt
WEBVTT

8e6b48b1-e73b-48b4-b800-97065696ee59/8-0
00:00:03.727 --> 00:00:06.870
<v Gabriel Vieira De Souza>Que estão bloqueados somente por
inadimplência,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/8-1
00:00:06.870 --> 00:00:11.977
<v Gabriel Vieira De Souza>se for pendências fiscais ou jurídicas,
eles não vão nem sequer ser mostrados</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/8-2
00:00:11.977 --> 00:00:16.167
<v Gabriel Vieira De Souza>para ela ter a possibilidade de tentar um
desbloqueio, correto?</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/7-0
00:00:16.087 --> 00:00:17.287
<v Maycon Da Silva Nogueira>Perfeito, isso mesmo.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/9-0
00:00:18.447 --> 00:00:21.207
<v Gabriel Vieira De Souza>Deixa eu só escrever aqui para não
esquecer deverá.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/13-0
00:00:22.727 --> 00:00:26.327
<v Gabriel Vieira De Souza>Here's the Pendências, babies.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/14-0
00:00:33.207 --> 00:00:35.607
<v Gabriel Vieira De Souza>Lens, eita, que palavra grande.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/15-0
00:00:36.407 --> 00:00:36.767
<v Maycon Da Silva Nogueira>Mhm.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/16-0
00:00:37.047 --> 00:00:38.407
<v Gabriel Vieira De Souza>Inadimplência.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/17-0
00:00:40.567 --> 00:00:42.487
<v Gabriel Vieira De Souza>I do. Nice. Bill is.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/18-0
00:00:43.687 --> 00:00:46.727
<v Gabriel Vieira De Souza>Aqui eu já vou lembrar outra outro ponto
aqui, né?</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/19-0
00:00:48.327 --> 00:00:49.367
<v Gabriel Vieira De Souza>É.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/20-0
00:00:51.607 --> 00:00:55.818
<v Gabriel Vieira De Souza>Cadê, cadê, cadê aqui?
Como é porque teve algumas partes assim</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/20-1
00:00:55.818 --> 00:01:00.898
<v Gabriel Vieira De Souza>que até ficou claro, eu achei assim,
igual eu estava comentando com a minha</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/20-2
00:01:00.898 --> 00:01:06.045
<v Gabriel Vieira De Souza>esposa que foi uma das propostas de uns
deltas mais detalhados que eu já vi,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/20-3
00:01:06.045 --> 00:01:06.647
<v Gabriel Vieira De Souza>entendeu?</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/22-0
00:01:06.887 --> 00:01:11.186
<v Gabriel Vieira De Souza>É, então está ótimo.
Delta é só teve alguns pontos que eu acho</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/22-1
00:01:11.186 --> 00:01:15.416
<v Gabriel Vieira De Souza>que eu não consegui.
É sintetizar o que de fato vocês querem,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/22-2
00:01:15.416 --> 00:01:18.351
<v Gabriel Vieira De Souza>tá?
Então aí às vezes eu vou perguntar uma</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/21-0
00:01:17.967 --> 00:01:18.567
<v Maycon Da Silva Nogueira>Mm-hmm.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/22-3
00:01:18.351 --> 00:01:23.127
<v Gabriel Vieira De Souza>coisa que já está escrito aqui,
mas é porque de fato eu não consegui.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/23-0
00:01:23.367 --> 00:01:26.992
<v Gabriel Vieira De Souza>É entender, ficou um pouco ambíguo,
beleza?</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/23-1
00:01:26.992 --> 00:01:33.911
<v Gabriel Vieira De Souza>É essa parte aqui de como o app reconhece
os próprios bloqueios. É essa parte aqui.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/23-2
00:01:33.911 --> 00:01:40.007
<v Gabriel Vieira De Souza>O cliente só é considerado bloqueado pelo
Delta que a gente está criando.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/24-0
00:01:40.247 --> 00:01:44.881
<v Gabriel Vieira De Souza>Quando o último registro dele no log é um
bloqueio,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/24-1
00:01:44.881 --> 00:01:51.207
<v Gabriel Vieira De Souza>ele continua bloqueado e o motivo atual é
o mesmo registrado pelo app.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/25-0
00:01:52.087 --> 00:01:56.022
<v Gabriel Vieira De Souza>Se o bloqueio for alterado ou refeito no
app standard,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/25-1
00:01:56.022 --> 00:02:01.316
<v Gabriel Vieira De Souza>o cliente deixa de ser proposto para
desbloqueio e passa a ser uma gestão</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/25-2
00:02:01.316 --> 00:02:04.964
<v Gabriel Vieira De Souza>individual.
Eu confesso que eu não entendi nada do</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/25-3
00:02:04.964 --> 00:02:06.967
<v Gabriel Vieira De Souza>que está escrito aqui, cara.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/28-0
00:02:09.287 --> 00:02:12.586
<v Maycon Da Silva Nogueira>Eu acho, cara,
é a parte que eu falei para você do</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/28-1
00:02:12.586 --> 00:02:16.015
<v Maycon Da Silva Nogueira>bloqueio por conta do Fiscal.
Imagina que o cliente,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/28-2
00:02:16.015 --> 00:02:19.832
<v Maycon Da Silva Nogueira>ele ficou inadimplente. Olha só, eu,
você tem sua empresa,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/28-3
00:02:19.832 --> 00:02:23.196
<v Maycon Da Silva Nogueira>eu deixei de te pagar 10 reais. Você fala,
olha só,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/28-4
00:02:23.196 --> 00:02:27.207
<v Maycon Da Silva Nogueira>eu não vou vender para você até você me
pagar esses 10 reais.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/30-0
00:02:27.247 --> 00:02:32.141
<v Maycon Da Silva Nogueira>Beleza. Aí, ao mesmo tempo,
eu peguei e também não paguei o imposto.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/30-1
00:02:32.141 --> 00:02:36.467
<v Maycon Da Silva Nogueira>Então eu estou com alguma irregularidade
fiscal no meu CNPJ.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/30-2
00:02:36.467 --> 00:02:40.722
<v Maycon Da Silva Nogueira>Não consigo fazer a emissão de notas
fiscais. Aí você pega,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/30-3
00:02:40.722 --> 00:02:45.687
<v Maycon Da Silva Nogueira>você tem essa visualização. Olha só,
o CNPJ do Maicon está bloqueado.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/31-0
00:02:46.167 --> 00:02:49.079
<v Maycon Da Silva Nogueira>Então você também bloqueia é manualmente
no app standard.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/29-0
00:02:46.327 --> 00:02:46.927
<v Gabriel Vieira De Souza>Mm-hmm.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/31-1
00:02:49.079 --> 00:02:52.794
<v Maycon Da Silva Nogueira>Eu acho difícil acontecer esse cenário
porque eles vão olhar e vão estar.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/31-2
00:02:52.794 --> 00:02:56.007
<v Maycon Da Silva Nogueira>Olha só, já está bloqueado,
não tem porque a gente desbloquear.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/32-0
00:02:57.607 --> 00:03:02.241
<v Maycon Da Silva Nogueira>Só que aí é uma questão mais aí é exceção.
Não dá pra gente cobrir todo todas as</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/32-1
00:03:02.241 --> 00:03:06.303
<v Maycon Da Silva Nogueira>possibilidades do mundo também, né?
Mas enfim, é. E aí o que acontece?</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/32-2
00:03:06.303 --> 00:03:10.364
<v Maycon Da Silva Nogueira>Eu peguei, cheguei em você,
paguei os 10 reais. Só que você vai olhar,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/32-3
00:03:10.364 --> 00:03:12.767
<v Maycon Da Silva Nogueira>olha só, Marcos, eu não consigo continuar.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/33-0
00:03:13.607 --> 00:03:15.995
<v Maycon Da Silva Nogueira>Ainda não consigo fazer os lançamentos
para você,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/33-1
00:03:15.995 --> 00:03:18.621
<v Maycon Da Silva Nogueira>porque ainda está com o seu CNPJ ainda
está bloqueado.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/33-2
00:03:18.621 --> 00:03:21.343
<v Maycon Da Silva Nogueira>Você não vai conseguir fazer a emissão,
então vou ficar.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/33-3
00:03:21.343 --> 00:03:23.921
<v Maycon Da Silva Nogueira>Eu não consigo fazer por fora, sabe?
Não existe isso.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/33-4
00:03:23.921 --> 00:03:25.927
<v Maycon Da Silva Nogueira>A gente precisa das informações certinhas.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/34-0
00:03:27.607 --> 00:03:30.567
<v Maycon Da Silva Nogueira>É justamente para esse cenário,
deu para entender um pouco melhor?</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/35-0
00:03:31.847 --> 00:03:35.527
<v Gabriel Vieira De Souza>Eu ainda fiquei um pouco na dúvida.
Desculpa, Michael, é.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/36-0
00:03:34.647 --> 00:03:35.447
<v Maycon Da Silva Nogueira>Sem problema.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/37-0
00:03:36.887 --> 00:03:42.720
<v Gabriel Vieira De Souza>deixa eu tentar falar o que que eu
entendi e aí você vai corrigindo acho que</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/37-1
00:03:42.720 --> 00:03:45.447
<v Gabriel Vieira De Souza>vai ser proveitoso que que você acha</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/38-0
00:03:46.247 --> 00:03:48.007
<v Maycon Da Silva Nogueira>Like say,
this is all India Port Happy June.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/39-0
00:03:48.567 --> 00:03:49.527
<v Gabriel Vieira De Souza>Ah, fica à vontade.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/40-0
00:03:49.847 --> 00:03:50.727
<v Maycon Da Silva Nogueira>John, I'll be you.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/49-0
00:04:24.007 --> 00:04:25.287
<v Maycon Da Silva Nogueira>Vitor, pode falar.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/55-0
00:04:26.167 --> 00:04:29.290
<v Gabriel Vieira De Souza>Beleza,
eu estou colocando aqui só para mim</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/55-1
00:04:29.290 --> 00:04:33.478
<v Gabriel Vieira De Souza>conseguir riscar.
Depois vou baixar aquele aplicativozinho</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/55-2
00:04:33.478 --> 00:04:39.157
<v Gabriel Vieira De Souza>para poder ficar riscando que fica melhor.
Eu tenho uma dúvida referente a essa</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/54-0
00:04:35.687 --> 00:04:35.807
<v Maycon Da Silva Nogueira>Right.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/55-3
00:04:39.157 --> 00:04:42.990
<v Gabriel Vieira De Souza>parte aqui.
O cliente só é considerado bloqueado pelo</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/55-4
00:04:42.990 --> 00:04:45.687
<v Gabriel Vieira De Souza>Delta quando o último registro do log.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/60-0
00:04:45.847 --> 00:04:52.131
<v Gabriel Vieira De Souza>É um bloqueio pelo que está escrito em
outros locais do delta.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/60-1
00:04:52.131 --> 00:04:59.812
<v Gabriel Vieira De Souza>É o que vai de fato definir que um
cliente está bloqueado ou não é direto lá</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/58-0
00:04:59.007 --> 00:04:59.127
<v Maycon Da Silva Nogueira>Yes.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/60-2
00:04:59.812 --> 00:05:02.007
<v Gabriel Vieira De Souza>na tabela do standard.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/59-0
00:05:00.807 --> 00:05:00.847
<v Maycon Da Silva Nogueira>Oh.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/62-0
00:05:02.327 --> 00:05:05.773
<v Gabriel Vieira De Souza>E não no log. O log é um registro. Ele,
na verdade,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/62-1
00:05:05.773 --> 00:05:08.954
<v Gabriel Vieira De Souza>ele não define se o cara está bloqueado
ou não.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/62-2
00:05:08.954 --> 00:05:13.990
<v Gabriel Vieira De Souza>Ele registra quando que ele foi bloqueado,
quem bloqueou, quem desbloqueou,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/62-3
00:05:13.990 --> 00:05:18.762
<v Gabriel Vieira De Souza>quando desbloqueou, essas coisas.
Mas o que de fato vai definir é o que</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/61-0
00:05:16.807 --> 00:05:17.207
<v Maycon Da Silva Nogueira>Perfect.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/62-4
00:05:18.762 --> 00:05:20.087
<v Gabriel Vieira De Souza>está lá no standard.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/63-0
00:05:20.487 --> 00:05:23.607
<v Gabriel Vieira De Souza>Então, essa afirmação aqui é.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/65-0
00:05:24.887 --> 00:05:30.332
<v Gabriel Vieira De Souza>É, já para mim já não está muito claro,
entendeu? Aí ele fala assim,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/64-0
00:05:29.767 --> 00:05:29.927
<v Maycon Da Silva Nogueira>Okay.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/65-1
00:05:30.332 --> 00:05:36.567
<v Gabriel Vieira De Souza>ele continua bloqueado e o motivo atual é
registrado pelo app. Então, pera aí.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/66-0
00:05:35.527 --> 00:05:38.327
<v Maycon Da Silva Nogueira>ou mesmo agitado que é justamente a parte
da</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/67-0
00:05:39.687 --> 00:05:44.236
<v Gabriel Vieira De Souza>Então, espera aí, o cliente foi,
deixa eu ver se eu entendi o cenário.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/67-1
00:05:44.236 --> 00:05:47.696
<v Gabriel Vieira De Souza>O cliente foi lá, é o cliente não,
o que user foi lá,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/67-2
00:05:47.696 --> 00:05:50.836
<v Gabriel Vieira De Souza>clicou para desbloquear o cara,
não abriu o app.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/67-3
00:05:50.836 --> 00:05:53.847
<v Gabriel Vieira De Souza>Aí ele está considerado como bloqueio,
porque.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/69-0
00:05:54.487 --> 00:06:00.120
<v Gabriel Vieira De Souza>tá mostrando lá no standard e tem um log
falando que o último log lá de bloqueio</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/68-0
00:05:59.807 --> 00:06:00.167
<v Maycon Da Silva Nogueira>Mhm.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/69-1
00:06:00.120 --> 00:06:05.753
<v Gabriel Vieira De Souza>né ele continua bloqueado porque o motivo
atual é o mesmo registrado pelo app aí</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/69-2
00:06:05.753 --> 00:06:09.647
<v Gabriel Vieira De Souza>entrou aquele negócio então espera aí o
cara vai tentar</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/70-0
00:06:09.767 --> 00:06:10.127
<v Gabriel Vieira De Souza>Tides.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/71-0
00:06:12.047 --> 00:06:14.887
<v Gabriel Vieira De Souza>Bloquear um cara que já está bloqueado?</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/72-0
00:06:15.967 --> 00:06:16.567
<v Gabriel Vieira De Souza>Entendeu?</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/74-0
00:06:17.367 --> 00:06:20.055
<v Maycon Da Silva Nogueira>É isso, isso realmente não deve acontecer,
tá?</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/74-1
00:06:20.055 --> 00:06:24.288
<v Maycon Da Silva Nogueira>Acho que posso ter viajado também
enquanto eu escrevia, porque se cansei,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/74-2
00:06:24.288 --> 00:06:28.749
<v Maycon Da Silva Nogueira>né? Cansei de escrever esse documento,
mas enfim, você tem razão nesse ponto,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/73-0
00:06:27.247 --> 00:06:27.527
<v Gabriel Vieira De Souza>Sim.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/74-3
00:06:28.749 --> 00:06:29.607
<v Maycon Da Silva Nogueira>você tem razão.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/75-0
00:06:30.887 --> 00:06:33.340
<v Maycon Da Silva Nogueira>É,
mas é o que eu estou tentando te explicar,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/75-1
00:06:33.340 --> 00:06:36.327
<v Maycon Da Silva Nogueira>é o que eu queria,
o que eu quis dizer quando eu estava</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/75-2
00:06:36.327 --> 00:06:38.727
<v Maycon Da Silva Nogueira>escrevendo essa parte,
é justamente isso de.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/76-0
00:06:40.327 --> 00:06:43.605
<v Maycon Da Silva Nogueira>Se a pessoa for bloqueada pela nova,
em resumo é isso.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/76-1
00:06:43.605 --> 00:06:47.121
<v Maycon Da Silva Nogueira>Se a pessoa tiver sido bloqueada pelo
aplicativo Standard,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/76-2
00:06:47.121 --> 00:06:51.412
<v Maycon Da Silva Nogueira>provavelmente foi uma questão fiscal.
Então a gente não deve fazer essa</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/76-3
00:06:51.412 --> 00:06:54.392
<v Maycon Da Silva Nogueira>alteração,
essa sugestão de desbloqueio dentro do</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/76-4
00:06:54.392 --> 00:06:55.047
<v Maycon Da Silva Nogueira>aplicativo.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/77-0
00:06:55.607 --> 00:06:56.727
<v Maycon Da Silva Nogueira>Em resumo, é isso.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/79-0
00:06:57.207 --> 00:07:03.505
<v Gabriel Vieira De Souza>Entendi, então, ou seja, se ele tiver,
entra no que a gente falou anteriormente</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/79-1
00:07:03.505 --> 00:07:07.126
<v Gabriel Vieira De Souza>ali,
se ele for bloqueado por um outro motivo</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/79-2
00:07:07.126 --> 00:07:12.007
<v Gabriel Vieira De Souza>que não seja inadimplência,
ele nem vai aparecer na listagem.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/78-0
00:07:10.007 --> 00:07:10.727
<v Maycon Da Silva Nogueira>Exatamente.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/81-0
00:07:12.407 --> 00:07:17.623
<v Gabriel Vieira De Souza>E se caso ele tiver sido bloqueado por
inadimplência, seguindo as regras,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/81-1
00:07:17.623 --> 00:07:20.795
<v Gabriel Vieira De Souza>ou porque o queueuser foi lá e bloqueou
ele,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/81-2
00:07:20.795 --> 00:07:25.024
<v Gabriel Vieira De Souza>ele já vai aparecer ali na opção que ele
está bloqueado já,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/81-3
00:07:25.024 --> 00:07:28.407
<v Gabriel Vieira De Souza>então também já é um erro do próprio
queueuser.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/80-0
00:07:25.607 --> 00:07:26.087
<v Maycon Da Silva Nogueira>Is it?</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/82-0
00:07:28.967 --> 00:07:30.567
<v Gabriel Vieira De Souza>Se ele tentar fazer o negócio dele?</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/83-0
00:07:32.007 --> 00:07:34.407
<v Gabriel Vieira De Souza>Show de bola então esclareceu essa parte
aqui</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/84-0
00:07:35.367 --> 00:07:36.087
<v Gabriel Vieira De Souza>Eh.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/87-0
00:07:37.207 --> 00:07:39.287
<v Gabriel Vieira De Souza>Uma outra parte aqui, deixa eu ver aqui.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/88-0
00:07:41.007 --> 00:07:41.607
<v Gabriel Vieira De Souza>Ready.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/94-0
00:07:42.887 --> 00:07:47.029
<v Gabriel Vieira De Souza>Essa parte do clientes vinculados
matrizes filiais,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/94-1
00:07:47.029 --> 00:07:51.331
<v Gabriel Vieira De Souza>a gente até comentou na última reunião,
eu queria só,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/94-2
00:07:51.331 --> 00:07:56.509
<v Gabriel Vieira De Souza>eu escrevi que sintetizei o que eu
entendi e queria só que vocês</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/94-3
00:07:56.509 --> 00:08:01.607
<v Gabriel Vieira De Souza>confirmassem mais uma vez que isso aqui
vai ser bem importante.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/93-0
00:08:02.007 --> 00:08:02.607
<v Maycon Da Silva Nogueira>Mm-hmm.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/96-0
00:08:02.167 --> 00:08:07.532
<v Gabriel Vieira De Souza>É aqui na veil,
o crédito é centralizado exclusivamente</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/96-1
00:08:07.532 --> 00:08:12.418
<v Gabriel Vieira De Souza>na matriz.
As filiais não possuem conta de crédito</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/95-0
00:08:08.487 --> 00:08:09.047
<v Maycon Da Silva Nogueira>Perfect.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/96-2
00:08:12.418 --> 00:08:17.687
<v Gabriel Vieira De Souza>próprio, então a CDS,
ela vai avaliar essa hierarquia.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/97-0
00:08:17.847 --> 00:08:22.394
<v Gabriel Vieira De Souza>Do standard em tempo real,
então a gente se ela vai verificar na</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/97-1
00:08:22.394 --> 00:08:27.290
<v Gabriel Vieira De Souza>hora ali que aquela aquele BP é,
ela está vinculado a uma matriz e se</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/97-2
00:08:27.290 --> 00:08:31.767
<v Gabriel Vieira De Souza>aquela é aquela matriz lá que ela tem que
ser bloqueada ou não.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/98-0
00:08:34.247 --> 00:08:40.620
<v Gabriel Vieira De Souza>Se a filial ficar inadimplente,
a proposta de bloqueio é gerado para a</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/98-1
00:08:40.620 --> 00:08:46.005
<v Gabriel Vieira De Souza>matriz, ou seja, aí que entra o negócio.
As filiais, então,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/98-2
00:08:46.005 --> 00:08:48.967
<v Gabriel Vieira De Souza>podem ficar ou não inadimplentes.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/100-0
00:08:49.367 --> 00:08:53.847
<v Gabriel Vieira De Souza>Mas quem é bloqueado é a matriz.
Essa afirmação está certa?</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/99-0
00:08:52.167 --> 00:08:52.727
<v Maycon Da Silva Nogueira>Yes, so.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/101-0
00:08:54.087 --> 00:08:54.647
<v Maycon Da Silva Nogueira>A certain.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/102-0
00:08:55.447 --> 00:08:55.847
<v Gabriel Vieira De Souza>Cool.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/103-0
00:08:57.207 --> 00:08:59.767
<v Gabriel Vieira De Souza>Exibindo a filial do BP, beleza.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/104-0
00:09:01.087 --> 00:09:04.767
<v Gabriel Vieira De Souza>Beleza, o restante está seguindo.
É outro ponto aqui,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/104-1
00:09:04.767 --> 00:09:09.332
<v Gabriel Vieira De Souza>essa questão aqui que você apontou da
distribuição dos legados. É,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/104-2
00:09:09.332 --> 00:09:14.852
<v Gabriel Vieira De Souza>ele falou aqui que o esse Delta que a
gente vai desenvolver não envia mensagens.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/104-3
00:09:14.852 --> 00:09:16.487
<v Gabriel Vieira De Souza>Isso é responsabilidade.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/105-0
00:09:17.447 --> 00:09:19.127
<v Gabriel Vieira De Souza>De outro delta.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/106-0
00:09:19.447 --> 00:09:20.087
<v Maycon Da Silva Nogueira>Perfeito.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/107-0
00:09:21.207 --> 00:09:26.850
<v Gabriel Vieira De Souza>Aí a pergunta é,
e eu vi muito sobre essa questão de</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/107-1
00:09:26.850 --> 00:09:35.155
<v Gabriel Vieira De Souza>informar para o legado durante o Delta,
mas sempre atribuindo a esse Delta 0,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/107-2
00:09:35.155 --> 00:09:36.007
<v Gabriel Vieira De Souza>51 aqui.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/108-0
00:09:36.407 --> 00:09:39.794
<v Gabriel Vieira De Souza>Com zero 51 é esse Delta,
pelo que eu vi também,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/108-1
00:09:39.794 --> 00:09:44.149
<v Gabriel Vieira De Souza>ele já foi desenvolvido,
que ele é uma premissa para acontecer</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/108-2
00:09:44.149 --> 00:09:47.674
<v Gabriel Vieira De Souza>esse daqui que a gente vai desenvolver.
É no caso,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/108-3
00:09:47.674 --> 00:09:52.167
<v Gabriel Vieira De Souza>então aqui eu olhando como desenvolvedor,
eu posso simplesmente.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/110-0
00:09:52.487 --> 00:09:58.345
<v Gabriel Vieira De Souza>Ignorar é qualquer tipo de comunicação
com os sistemas legados,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/110-1
00:09:58.345 --> 00:10:03.287
<v Gabriel Vieira De Souza>porque esse Delta aqui está fazendo já,
é isso mesmo?</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/109-0
00:10:00.087 --> 00:10:00.487
<v Maycon Da Silva Nogueira>Boys.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/111-0
00:10:03.527 --> 00:10:06.435
<v Maycon Da Silva Nogueira>É isso mesmo,
ele ainda não foi desenvolvido,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/111-1
00:10:06.435 --> 00:10:09.597
<v Maycon Da Silva Nogueira>tá o zero 51.
Eu estou para conversar com o abap,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/111-2
00:10:09.597 --> 00:10:14.971
<v Maycon Da Silva Nogueira>inclusive acho que amanhã, provavelmente.
Mas é isso mesmo que você falou para você,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/111-3
00:10:14.971 --> 00:10:18.891
<v Maycon Da Silva Nogueira>para esse Delta 009,
o importante é a parte do é o aplicativo</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/111-4
00:10:18.891 --> 00:10:21.167
<v Maycon Da Silva Nogueira>mesmo, é a construção do aplicativo.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/113-0
00:10:21.487 --> 00:10:24.966
<v Maycon Da Silva Nogueira>Toda a informação que a gente for enviar
para fila, para as filas,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/113-1
00:10:24.966 --> 00:10:27.250
<v Maycon Da Silva Nogueira>aí vai ficar com a responsabilidade do
051,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/113-2
00:10:27.250 --> 00:10:29.327
<v Maycon Da Silva Nogueira>que vai ser o outro que vai desenvolver.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/114-0
00:10:29.927 --> 00:10:35.332
<v Gabriel Vieira De Souza>Entendi aí deixa eu ver se eu entendi.
Então ele vai utilizar a minha tabela de</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/114-1
00:10:35.332 --> 00:10:39.927
<v Gabriel Vieira De Souza>registro de log para poder verificar
quando quando tem um bloqueio.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/115-0
00:10:40.287 --> 00:10:44.746
<v Maycon Da Silva Nogueira>Ele vai o zero 51 ele tá com ele vai usar
o event mesh aí toda vez que tiver uma</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/115-1
00:10:44.746 --> 00:10:49.316
<v Maycon Da Silva Nogueira>alteração que isso que gravou no sistema
ele vai fazer uma atualização da tabela e</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/115-2
00:10:49.316 --> 00:10:53.830
<v Maycon Da Silva Nogueira>aí essa atualização da tabela vai vai vai
reconhecer que aconteceu um evento e aí</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/115-3
00:10:53.830 --> 00:10:55.647
<v Maycon Da Silva Nogueira>ele envia a informação lá para o.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/116-0
00:10:56.047 --> 00:10:56.767
<v Maycon Da Silva Nogueira>pra fila.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/118-0
00:10:56.047 --> 00:10:59.602
<v Gabriel Vieira De Souza>Beleza, beleza.
Então isso mata o fato ali de que eu</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/118-1
00:10:59.602 --> 00:11:03.626
<v Gabriel Vieira De Souza>realmente não preciso pensar sobre essa
questão de legados.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/118-2
00:11:03.626 --> 00:11:08.790
<v Gabriel Vieira De Souza>Essa questão de crédito sazonal fora do
escopo aqui também eu percebi que eu</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/117-0
00:11:08.607 --> 00:11:09.407
<v Maycon Da Silva Nogueira>É pra ignorar.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/118-3
00:11:08.790 --> 00:11:11.607
<v Gabriel Vieira De Souza>também não preciso nem pensar nisso daqui.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/122-0
00:11:10.767 --> 00:11:13.865
<v Maycon Da Silva Nogueira>É, exatamente,
é porque a gente deixou tudo bem do que</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/122-1
00:11:13.865 --> 00:11:16.569
<v Maycon Da Silva Nogueira>escrito,
porque eu vi que a gente comentou, né?</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/122-2
00:11:16.569 --> 00:11:20.005
<v Maycon Da Silva Nogueira>Tudo foi muito chato,
tudo foi muito chato pra gente fazer a</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/119-0
00:11:18.647 --> 00:11:18.687
<v Gabriel Vieira De Souza>I.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/122-3
00:11:20.005 --> 00:11:23.722
<v Maycon Da Silva Nogueira>construção. Então, cara,
deixar bem explícito que esse aplicativo</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/122-4
00:11:23.722 --> 00:11:27.327
<v Maycon Da Silva Nogueira>não dá para a gente fazer essa
visualização do crédito sazonal.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/124-0
00:11:28.167 --> 00:11:33.354
<v Gabriel Vieira De Souza>Entendi é porque eu entendi depois
enquanto estava lendo inclusive parabéns</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/124-1
00:11:33.354 --> 00:11:38.882
<v Gabriel Vieira De Souza>ficou muito bem escrito esse esse Delta
velho da empresa que eu trabalhava antes</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/123-0
00:11:36.087 --> 00:11:36.767
<v Maycon Da Silva Nogueira>Obrigado.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/124-2
00:11:38.882 --> 00:11:40.247
<v Gabriel Vieira De Souza>cara era uma loucura</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/125-0
00:11:41.407 --> 00:11:43.007
<v Maycon Da Silva Nogueira>Eu imagino.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/128-0
00:11:42.487 --> 00:11:46.549
<v Gabriel Vieira De Souza>Então eu disse assim, pô, eu estou, pô,
eu até eu falei assim, cara,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/128-1
00:11:46.549 --> 00:11:51.258
<v Gabriel Vieira De Souza>eu tenho que ler isso daqui porque ficou
tão bem explicado que eu não vou ficar</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/128-2
00:11:51.258 --> 00:11:55.850
<v Gabriel Vieira De Souza>gastando tempo também perguntando coisa
que já está explicado aqui, entendeu?</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/127-0
00:11:54.447 --> 00:11:55.447
<v Maycon Da Silva Nogueira>Marque, eu agradeço.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/128-3
00:11:55.850 --> 00:11:58.087
<v Gabriel Vieira De Souza>Mas está show. É então essa parte que.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/130-0
00:11:58.247 --> 00:12:02.045
<v Gabriel Vieira De Souza>Foi certinho,
deixa eu até desmarcar aqui as coisas que</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/130-1
00:12:02.045 --> 00:12:04.487
<v Gabriel Vieira De Souza>eu coloquei uma colinha aqui, né? É.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/129-0
00:12:03.927 --> 00:12:04.007
<v Maycon Da Silva Nogueira>No.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/131-0
00:12:05.527 --> 00:12:07.367
<v Gabriel Vieira De Souza>Eu estou desmarcando aqui o que?</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/132-0
00:12:08.487 --> 00:12:10.087
<v Gabriel Vieira De Souza>Já foi tirado de dúvida?</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/133-0
00:12:12.847 --> 00:12:13.527
<v Gabriel Vieira De Souza>Beleza.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/134-0
00:12:14.487 --> 00:12:19.527
<v Gabriel Vieira De Souza>É, eu tenho uma outra dúvida aqui,
justamente nesse resultados esperados, é,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/134-1
00:12:19.527 --> 00:12:21.687
<v Gabriel Vieira De Souza>o que é esse CVD aqui? Oh, volta.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/135-0
00:12:20.847 --> 00:12:23.807
<v Maycon Da Silva Nogueira>É o sistema deles,
é o sistema legado deles.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/138-0
00:12:24.567 --> 00:12:25.287
<v Gabriel Vieira De Souza>Ah, tá.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/139-0
00:12:26.247 --> 00:12:30.091
<v Gabriel Vieira De Souza>Rita, você vê a data,
então deixa eu marcar isso aqui também,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/139-1
00:12:30.091 --> 00:12:31.207
<v Gabriel Vieira De Souza>que é bem simples.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/140-0
00:12:34.807 --> 00:12:35.167
<v Gabriel Vieira De Souza>Sure.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/145-0
00:12:39.127 --> 00:12:43.067
<v Gabriel Vieira De Souza>Essa questão da rastreabilidade de cada
desbloqueio,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/143-0
00:12:40.567 --> 00:12:40.687
<v Maycon Da Silva Nogueira>Right.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/145-1
00:12:43.067 --> 00:12:47.751
<v Gabriel Vieira De Souza>eu até coloquei um pouco mais à frente,
mas aqui já tem a ver.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/145-2
00:12:47.751 --> 00:12:52.807
<v Gabriel Vieira De Souza>Essa rastreabilidade vai ser feita
através da tabela de log, então.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/144-0
00:12:52.287 --> 00:12:54.207
<v Maycon Da Silva Nogueira>Isso, essa família, pelo menos.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/146-0
00:12:55.047 --> 00:12:59.780
<v Gabriel Vieira De Souza>Aí, por exemplo, eu tenho uma tabela,
a tabela do banco de dados.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/146-1
00:12:59.780 --> 00:13:04.873
<v Gabriel Vieira De Souza>Como que um usuário, sei lá,
eu quero ver lá quem foi que desbloqueou,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/146-2
00:13:04.873 --> 00:13:09.391
<v Gabriel Vieira De Souza>qual o motivo, etc, etc.
Ele vai acessar direto na tabela ou a</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/146-3
00:13:09.391 --> 00:13:13.407
<v Gabriel Vieira De Souza>gente vai fazer um aplicativo Fiscal para
poder mostrar</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/147-0
00:13:13.527 --> 00:13:15.847
<v Gabriel Vieira De Souza>A essa auditoria.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/148-0
00:13:16.647 --> 00:13:19.208
<v Maycon Da Silva Nogueira>Cara,
se o usuário quiser realmente essa</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/148-1
00:13:19.208 --> 00:13:23.956
<v Maycon Da Silva Nogueira>informação e a gente puder deixar essa
informação somente como algo técnico</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/148-2
00:13:23.956 --> 00:13:26.830
<v Maycon Da Silva Nogueira>mesmo,
a gente pode deixar na própria tabela,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/148-3
00:13:26.830 --> 00:13:31.203
<v Maycon Da Silva Nogueira>porque aí o time de TI deles tem essa
responsabilidade de passar essa</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/148-4
00:13:31.203 --> 00:13:33.327
<v Maycon Da Silva Nogueira>informação caso eles precisem, tá?</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/149-0
00:13:33.727 --> 00:13:37.800
<v Maycon Da Silva Nogueira>Acho que não precisa fazer a criação de
um aplicativo para fazer essa exibição</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/149-1
00:13:37.800 --> 00:13:40.327
<v Maycon Da Silva Nogueira>mais simples.
Pelo que você está querendo supor,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/149-2
00:13:40.327 --> 00:13:44.607
<v Maycon Da Silva Nogueira>a gente pode deixar de uma forma técnica
e o time de TI deles fica responsável por</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/149-3
00:13:44.607 --> 00:13:46.927
<v Maycon Da Silva Nogueira>pegar essa informação quando for
necessária.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/152-0
00:13:48.087 --> 00:13:53.464
<v Gabriel Vieira De Souza>É agora que eu não entendi. É, espera aí,
deixa eu ver se eu estou entendendo aqui</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/150-0
00:13:48.927 --> 00:13:50.847
<v Maycon Da Silva Nogueira>Faz sentido? Tá.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/152-1
00:13:53.464 --> 00:13:57.027
<v Gabriel Vieira De Souza>o que você disse.
Você disse que então a gente poderia</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/152-2
00:13:57.027 --> 00:14:01.367
<v Gabriel Vieira De Souza>deixar essa informação de log no
aplicativo que a gente vai criar.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/151-0
00:13:58.687 --> 00:13:59.567
<v Maycon Da Silva Nogueira>Exactly mention.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/153-0
00:14:03.727 --> 00:14:05.807
<v Maycon Da Silva Nogueira>É, na própria tabela de log.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/155-0
00:14:04.887 --> 00:14:08.664
<v Gabriel Vieira De Souza>E como que você e como que você então a
tabela de log?</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/155-1
00:14:08.664 --> 00:14:11.754
<v Gabriel Vieira De Souza>Ela não fica disponibilizada para o
cliente.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/155-2
00:14:11.754 --> 00:14:17.316
<v Gabriel Vieira De Souza>Ela fica dentro do banco de dados. Ponto.
O cliente não tem acesso a isso a ver,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/155-3
00:14:17.316 --> 00:14:20.818
<v Gabriel Vieira De Souza>entendeu? É,
eu consigo porque eu sei abrir aqui o</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/154-0
00:14:17.727 --> 00:14:18.287
<v Maycon Da Silva Nogueira>Entendi.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/155-4
00:14:20.818 --> 00:14:21.367
<v Gabriel Vieira De Souza>negócio.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/157-0
00:14:21.607 --> 00:14:25.660
<v Gabriel Vieira De Souza>Fazer uma query,
ou se não acessar o SAPGI e ver aqui os</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/157-1
00:14:25.660 --> 00:14:31.136
<v Gabriel Vieira De Souza>dados, o cliente não vai ter acesso,
ele vai ter acesso só lá o Loudpad, né?</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/157-2
00:14:31.136 --> 00:14:35.474
<v Gabriel Vieira De Souza>Então, meio que o log,
ele vai ficar sendo gravado de forma,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/156-0
00:14:32.007 --> 00:14:32.367
<v Maycon Da Silva Nogueira>Mhm.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/157-3
00:14:35.474 --> 00:14:37.607
<v Gabriel Vieira De Souza>vamos dizer assim, silenciosa.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/158-0
00:14:38.087 --> 00:14:42.342
<v Gabriel Vieira De Souza>O cliente não vai ver,
então a pergunta é justamente essa,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/158-1
00:14:42.342 --> 00:14:48.327
<v Gabriel Vieira De Souza>se a gente está fazendo uma tabela de log
que um dos motivos é o cliente ver é ter</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/158-2
00:14:48.327 --> 00:14:53.087
<v Gabriel Vieira De Souza>essa rastreabilidade do bloqueio,
desbloqueio, quem, motivo, etc.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/159-0
00:14:54.007 --> 00:14:58.247
<v Gabriel Vieira De Souza>É aonde que ele vai ver isso, não é?
Eu não encontrei aqui no Delta. Se é,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/159-1
00:14:58.247 --> 00:15:02.714
<v Gabriel Vieira De Souza>como que a gente vai mostrar isso para o
cliente? E aí eu quero saber de você,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/159-2
00:15:02.714 --> 00:15:05.767
<v Gabriel Vieira De Souza>como que você quer que eu mostre isso
para o cliente?</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/160-0
00:15:08.287 --> 00:15:10.622
<v Maycon Da Silva Nogueira>Tá,
talvez eu não tenha resposta pra essa</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/160-1
00:15:10.622 --> 00:15:11.567
<v Maycon Da Silva Nogueira>pergunta, beleza?</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/161-0
00:15:11.927 --> 00:15:12.567
<v Gabriel Vieira De Souza>Tranquilo.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/164-0
00:15:13.767 --> 00:15:18.771
<v Gabriel Vieira De Souza>De boa, é, depois você me passa,
não tem problema não, que para mim assim,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/162-0
00:15:15.207 --> 00:15:15.887
<v Maycon Da Silva Nogueira>Santos Santos.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/164-1
00:15:18.771 --> 00:15:22.707
<v Gabriel Vieira De Souza>de boa, para mim,
o mais fácil é criar uma tabela de log e</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/164-2
00:15:22.707 --> 00:15:28.312
<v Gabriel Vieira De Souza>acabou a minha vida, é muito mais rápido.
Eu estou meio que arrumando problema para</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/163-0
00:15:25.887 --> 00:15:26.487
<v Maycon Da Silva Nogueira>Mm-hmm.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/164-3
00:15:28.312 --> 00:15:31.047
<v Gabriel Vieira De Souza>mim, se eu tiver que criar um aplicativo.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/165-0
00:15:31.367 --> 00:15:34.327
<v Gabriel Vieira De Souza>Só para poder mostrar os dados dessa
tabela, entendeu?</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/166-0
00:15:32.207 --> 00:15:35.782
<v Maycon Da Silva Nogueira>Então eu também acho que é arrumar
problema pra cabeça se a gente fosse</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/166-1
00:15:35.782 --> 00:15:39.407
<v Maycon Da Silva Nogueira>fazer essa parte da criação de um num
outro aplicativo excedente a esse.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/167-0
00:15:40.567 --> 00:15:41.047
<v Gabriel Vieira De Souza>Sim.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/168-0
00:15:40.687 --> 00:15:43.170
<v Maycon Da Silva Nogueira>Aí,
por isso que eu até prefiro evitar a</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/168-1
00:15:43.170 --> 00:15:46.681
<v Maycon Da Silva Nogueira>gente ir pra essa linha.
Quando eu falo da linha técnica,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/168-2
00:15:46.681 --> 00:15:51.162
<v Maycon Da Silva Nogueira>é tipo assim, você falou, olha só,
o cliente não tem acesso ao banco, ok?</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/168-3
00:15:51.162 --> 00:15:56.127
<v Maycon Da Silva Nogueira>Nem a equipe técnica deles consegue ter
esse aprendizado de como acessar o banco.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/169-0
00:15:57.447 --> 00:15:58.327
<v Gabriel Vieira De Souza>Ah, eu não sei.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/170-0
00:15:58.767 --> 00:16:02.127
<v Maycon Da Silva Nogueira>Não, eu também não.
Vou levantar essa pergunta então depois.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/172-0
00:16:01.687 --> 00:16:06.670
<v Gabriel Vieira De Souza>Que é esse daí,
essa parte técnica aí que você fala,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/172-1
00:16:06.670 --> 00:16:14.003
<v Gabriel Vieira De Souza>o cara tem que ter alguém que no mínimo
sabe ABAP, né? Ou fazer um consultor,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/171-0
00:16:11.727 --> 00:16:12.607
<v Maycon Da Silva Nogueira>All right, thank you.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/172-2
00:16:14.003 --> 00:16:18.327
<v Gabriel Vieira De Souza>que às vezes um consultor que sabe mexer
ali.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/175-0
00:16:18.407 --> 00:16:21.706
<v Gabriel Vieira De Souza>Entendeu?
Eu sou novo também no mundo do ABAP. É,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/173-0
00:16:19.407 --> 00:16:19.967
<v Maycon Da Silva Nogueira>Entendi.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/175-1
00:16:21.706 --> 00:16:25.730
<v Gabriel Vieira De Souza>eu vim construindo aplicativos em outras
tecnologias, não é?</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/175-2
00:16:25.730 --> 00:16:30.084
<v Gabriel Vieira De Souza>Então no ABAP eu sou novo,
então eu não sei muito bem como que as</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/174-0
00:16:26.887 --> 00:16:27.487
<v Maycon Da Silva Nogueira>Mm-hmm.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/175-3
00:16:30.084 --> 00:16:32.327
<v Gabriel Vieira De Souza>empresas fazem isso daí, entendeu?</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/176-0
00:16:32.847 --> 00:16:36.315
<v Maycon Da Silva Nogueira>Perfeito,
eu vou levar essa pergunta para você</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/176-1
00:16:36.315 --> 00:16:41.407
<v Maycon Da Silva Nogueira>porque não tenho uma resposta de verdade,
mas provavelmente é exato.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/177-0
00:16:38.727 --> 00:16:44.167
<v Gabriel Vieira De Souza>Até lá eu sigo só o que está aqui de
salvar só a tabela. Deixa eu quieto aqui.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/178-0
00:16:43.087 --> 00:16:47.102
<v Maycon Da Silva Nogueira>Talvez a gente pode ir para a linha D.
Essa rastreabilidade não vai ser</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/178-1
00:16:47.102 --> 00:16:49.723
<v Maycon Da Silva Nogueira>apresentada para o usuário, tá?
Se ele quiser,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/178-2
00:16:49.723 --> 00:16:53.404
<v Maycon Da Silva Nogueira>ele vai ter que arrumar um jeito de pegar
na tabela de log. E aí,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/178-3
00:16:53.404 --> 00:16:56.527
<v Maycon Da Silva Nogueira>como que eles fazem isso?
Eu também não sei também, tá?</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/181-0
00:16:57.207 --> 00:17:03.790
<v Gabriel Vieira De Souza>Beleza, então, beleza, aí, vamos lá,
deixa eu ver aqui, tá acabando.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/179-0
00:17:00.207 --> 00:17:00.687
<v Maycon Da Silva Nogueira>Issue.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/181-1
00:17:03.790 --> 00:17:11.327
<v Gabriel Vieira De Souza>Já é outra coisa é referente a esse fluxo
aqui, ele meio que acabou-se porque.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/180-0
00:17:04.407 --> 00:17:04.847
<v Maycon Da Silva Nogueira>Yeah.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/182-0
00:17:11.607 --> 00:17:15.095
<v Gabriel Vieira De Souza>Está totalmente diferente,
a gente faz totalmente pelo app,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/182-1
00:17:15.095 --> 00:17:19.047
<v Gabriel Vieira De Souza>eu excluo a ideia de job aqui e posso
ignorar completamente, não é?</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/185-0
00:17:19.247 --> 00:17:21.567
<v Maycon Da Silva Nogueira>Mm-hmm, yeah, sort of a missing.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/183-0
00:17:20.327 --> 00:17:20.967
<v Gabriel Vieira De Souza>Show the ball.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/187-0
00:17:22.407 --> 00:17:25.767
<v Gabriel Vieira De Souza>É outro ponto aqui é.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/191-0
00:17:27.527 --> 00:17:32.450
<v Gabriel Vieira De Souza>Referente a essa tabela aqui,
você acredita que seria interessante?</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/191-1
00:17:32.450 --> 00:17:37.518
<v Gabriel Vieira De Souza>É igual botei lá de bom tom,
a gente colocar talvez uma coluna a mais</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/191-2
00:17:37.518 --> 00:17:42.296
<v Gabriel Vieira De Souza>naqueles que estão bloqueados,
igual esses dois que, por exemplo,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/191-3
00:17:42.296 --> 00:17:43.527
<v Gabriel Vieira De Souza>estão bloqueados.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/190-0
00:17:43.727 --> 00:17:44.327
<v Maycon Da Silva Nogueira>Mm-hmm.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/193-0
00:17:44.007 --> 00:17:46.806
<v Gabriel Vieira De Souza>Aí tem uma coluna aqui,
motivo do bloqueio,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/193-1
00:17:46.806 --> 00:17:50.559
<v Gabriel Vieira De Souza>aí ele consegue ver quem,
apesar que também sempre vai ser</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/192-0
00:17:50.527 --> 00:17:51.247
<v Maycon Da Silva Nogueira>Exato.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/193-2
00:17:50.559 --> 00:17:54.566
<v Gabriel Vieira De Souza>inadimplência, né? Quando eu pensei,
seria outros motivos, né?</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/193-3
00:17:54.566 --> 00:17:57.047
<v Gabriel Vieira De Souza>Mas aqui é sempre inadimplência, né? É.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/194-0
00:17:56.207 --> 00:18:01.172
<v Maycon Da Silva Nogueira>Eu acho que tem até os comentários nesse
slide de possível sugestões e aí acabou</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/194-1
00:18:01.172 --> 00:18:05.586
<v Maycon Da Silva Nogueira>que o próprio usuário também não sugeriu
nada, sabe? De outros motivos.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/194-2
00:18:05.586 --> 00:18:09.387
<v Maycon Da Silva Nogueira>Eu não consigo também pensar em outros
motivos para bloqueio,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/194-3
00:18:09.387 --> 00:18:11.287
<v Maycon Da Silva Nogueira>então é só inadimplência mesmo.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/197-0
00:18:11.847 --> 00:18:15.556
<v Gabriel Vieira De Souza>Beleza,
é porque na hora que eu pensei eu não</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/195-0
00:18:14.567 --> 00:18:16.607
<v Maycon Da Silva Nogueira>Estava considerando os fiscais.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/197-1
00:18:15.556 --> 00:18:20.556
<v Gabriel Vieira De Souza>sabia se a é exatamente mais show,
deixa eu ver aqui o outro,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/196-0
00:18:17.847 --> 00:18:18.207
<v Maycon Da Silva Nogueira>Mhm.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/197-2
00:18:20.556 --> 00:18:21.927
<v Gabriel Vieira De Souza>qual é o próximo?</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/200-0
00:18:22.967 --> 00:18:28.327
<v Gabriel Vieira De Souza>Que já em detalhamento,
agora na parte de Desenvolvimento, é.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/201-0
00:18:29.087 --> 00:18:29.247
<v Maycon Da Silva Nogueira>Okay.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/202-0
00:18:29.847 --> 00:18:34.232
<v Gabriel Vieira De Souza>Cadê bloqueia?
Considerar como bloqueado pelo Delta</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/202-1
00:18:34.232 --> 00:18:39.207
<v Gabriel Vieira De Souza>somente o cliente cuja ação na tabela Z
de log é bloqueio.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/204-0
00:18:39.807 --> 00:18:43.007
<v Maycon Da Silva Nogueira>É aquela questão lá que a gente conversou,
uhum.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/207-0
00:18:41.287 --> 00:18:48.192
<v Gabriel Vieira De Souza>É a mesma questão, então tipo assim,
vou não vou considerar referente ao log,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/207-1
00:18:48.192 --> 00:18:52.087
<v Gabriel Vieira De Souza>vou considerar a tabela AO standard,
não é?</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/206-0
00:18:52.287 --> 00:18:52.767
<v Maycon Da Silva Nogueira>Perfect.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/210-0
00:18:53.527 --> 00:18:58.523
<v Gabriel Vieira De Souza>Show é não propor aqui não propor
desbloqueio para clientes bloqueados por</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/210-1
00:18:58.523 --> 00:19:02.319
<v Gabriel Vieira De Souza>outro motivo, não é?
Então aqui também eu tinha anotado,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/210-2
00:19:02.319 --> 00:19:07.448
<v Gabriel Vieira De Souza>mas meio que já se solucionou que de fato
ele nem vai aparecer para o para o</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/208-0
00:19:06.287 --> 00:19:06.327
<v Maycon Da Silva Nogueira>I.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/210-3
00:19:07.448 --> 00:19:08.447
<v Gabriel Vieira De Souza>usuário, não é?</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/209-0
00:19:08.927 --> 00:19:09.527
<v Maycon Da Silva Nogueira>Mm-hmm.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/211-0
00:19:10.167 --> 00:19:13.287
<v Gabriel Vieira De Souza>Entendi. Show, deixa eu ver aqui outro.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/213-0
00:19:14.327 --> 00:19:19.277
<v Gabriel Vieira De Souza>Aqui é pfiori a job,
eu simplesmente a paguei isso daqui do</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/212-0
00:19:18.927 --> 00:19:19.487
<v Maycon Da Silva Nogueira>Tranquilo.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/213-1
00:19:19.277 --> 00:19:19.607
<v Gabriel Vieira De Souza>meu.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/216-0
00:19:22.727 --> 00:19:27.623
<v Gabriel Vieira De Souza>processar cada cliente de forma
independente é aqui é um ponto né é por</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/216-1
00:19:27.623 --> 00:19:32.723
<v Gabriel Vieira De Souza>exemplo o que eu entendi aqui processar
cada cliente de forma independente</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/216-2
00:19:32.723 --> 00:19:35.647
<v Gabriel Vieira De Souza>retornar a mensagem de sucesso ou erro
por</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/218-0
00:19:35.727 --> 00:19:39.283
<v Gabriel Vieira De Souza>Cliente,
esse por cliente aqui é um pouco complexo,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/218-1
00:19:39.283 --> 00:19:43.592
<v Gabriel Vieira De Souza>porque se a gente está falando de gestão
em massa de clientes,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/218-2
00:19:43.592 --> 00:19:48.927
<v Gabriel Vieira De Souza>vamos supor lá que o cara selecionou 100
clientes, e aí, desses 100 clientes,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/217-0
00:19:46.527 --> 00:19:47.127
<v Maycon Da Silva Nogueira>Mm-hmm.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/218-3
00:19:48.927 --> 00:19:51.047
<v Gabriel Vieira De Souza>vai ter que ter 100 pop-ups de.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/219-0
00:19:51.207 --> 00:19:56.833
<v Gabriel Vieira De Souza>Sucesso, entendeu? É,
e se supondo no cenário onde que o cara é</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/219-1
00:19:56.833 --> 00:20:01.580
<v Gabriel Vieira De Souza>25 desses desses clientes,
por algum motivo deu erro,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/219-2
00:20:01.580 --> 00:20:06.327
<v Gabriel Vieira De Souza>vai aparecer 75 pop-ups de sucesso e 25
de insucesso.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/220-0
00:20:06.887 --> 00:20:11.221
<v Maycon Da Silva Nogueira>Não necessariamente. Aí vai ser um log,
um pop-up,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/220-1
00:20:11.221 --> 00:20:17.254
<v Maycon Da Silva Nogueira>só que com todas as informações.
Então um pop-up de beleza bloqueados.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/220-2
00:20:17.254 --> 00:20:23.287
<v Maycon Da Silva Nogueira>Aí eu não sei se eu não vou ter a telinha
fácil aqui, mas tem os logs.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/221-0
00:20:23.447 --> 00:20:25.047
<v Maycon Da Silva Nogueira>Deixa eu ver se eu consigo pegar rápido
aqui.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/222-0
00:20:26.647 --> 00:20:27.607
<v Maycon Da Silva Nogueira>Me dá um minuto.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/223-0
00:20:32.087 --> 00:20:32.247
<v Maycon Da Silva Nogueira>Okay.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/224-0
00:20:33.367 --> 00:20:33.927
<v Maycon Da Silva Nogueira>Desculpa.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/225-0
00:20:34.807 --> 00:20:35.367
<v Gabriel Vieira De Souza>True.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/230-0
00:21:00.247 --> 00:21:02.287
<v Maycon Da Silva Nogueira>Será que esse aqui tem? Deixa eu ver.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/241-0
00:21:52.647 --> 00:21:53.607
<v Maycon Da Silva Nogueira>Mostly can all.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/242-0
00:21:55.127 --> 00:21:56.167
<v Maycon Da Silva Nogueira>Shipping on my queue.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/243-0
00:22:02.407 --> 00:22:02.567
<v Maycon Da Silva Nogueira>Okay.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/253-0
00:22:45.447 --> 00:22:48.247
<v Maycon Da Silva Nogueira>I don't want to achei.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/254-0
00:22:54.567 --> 00:22:58.727
<v Maycon Da Silva Nogueira>So I have this of you so call with this.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/258-0
00:23:18.847 --> 00:23:20.948
<v Maycon Da Silva Nogueira>Aqui,
acho que dá para dizer uma ideia com isso</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/258-1
00:23:20.948 --> 00:23:22.567
<v Maycon Da Silva Nogueira>aqui. Deixa eu apresentar minha tela.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/259-0
00:23:23.767 --> 00:23:25.447
<v Gabriel Vieira De Souza>Pode ficar à vontade,
vou tirar aqui a minha.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/260-0
00:23:28.407 --> 00:23:28.807
<v Gabriel Vieira De Souza>So that.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/263-0
00:23:28.927 --> 00:23:35.084
<v Maycon Da Silva Nogueira>OK, vai ser meio que dessa forma, né?
Então os aplicativos, eles vão,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/263-1
00:23:35.084 --> 00:23:40.361
<v Maycon Da Silva Nogueira>vai ter o status,
então o status aqui deu tipo concluído ou</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/263-2
00:23:40.361 --> 00:23:43.087
<v Maycon Da Silva Nogueira>então não concluído, incorreto.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/264-0
00:23:43.567 --> 00:23:47.767
<v Maycon Da Silva Nogueira>Algum tipo de advertência?
Eu queria algum que apresentasse mais</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/269-0
00:23:50.367 --> 00:23:54.410
<v Maycon Da Silva Nogueira>Um pop-up também,
mas isso aqui só para você ter uma ideia,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/269-1
00:23:54.410 --> 00:23:57.576
<v Maycon Da Silva Nogueira>meio que uma lista com todos os que deu
certo.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/269-2
00:23:57.576 --> 00:24:02.967
<v Maycon Da Silva Nogueira>E aí tem um teria um botãozinho ou então
alguma forma de alterar a visualização</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/269-3
00:24:02.967 --> 00:24:06.807
<v Maycon Da Silva Nogueira>para os que não deram certo.
E aí mostraria dessa forma.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/270-0
00:24:08.327 --> 00:24:08.887
<v Maycon Da Silva Nogueira>Cannot take.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/280-0
00:24:10.327 --> 00:24:17.009
<v Gabriel Vieira De Souza>eu fiquei na dúvida é mais porque eu
falei sou novo nesse mundo abaixo né É no</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/273-0
00:24:12.487 --> 00:24:12.647
<v Maycon Da Silva Nogueira>So.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/276-0
00:24:16.247 --> 00:24:16.967
<v Maycon Da Silva Nogueira>Sem problema.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/280-1
00:24:17.009 --> 00:24:23.606
<v Gabriel Vieira De Souza>caso o cliente foi lá selecionou as
opções e apertou lá para poder bloquear o</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/280-2
00:24:23.606 --> 00:24:29.527
<v Gabriel Vieira De Souza>desbloquear em massa e aí jogou ele
parece outra tela aí que mostra o</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/279-0
00:24:30.087 --> 00:24:30.687
<v Maycon Da Silva Nogueira>Mm-hmm.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/283-0
00:24:30.327 --> 00:24:32.087
<v Gabriel Vieira De Souza>uma lista do que que aconteceu.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/284-0
00:24:32.167 --> 00:24:34.647
<v Maycon Da Silva Nogueira>É porque sabe que a gente vê que ele é
outra coisa.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/287-0
00:24:36.967 --> 00:24:38.407
<v Maycon Da Silva Nogueira>Eu tenho um aplicativo.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/289-0
00:24:41.647 --> 00:24:42.007
<v Maycon Da Silva Nogueira>Cust</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/293-0
00:24:48.327 --> 00:24:50.407
<v Maycon Da Silva Nogueira>I só não tenho pronto.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/298-0
00:24:51.447 --> 00:24:56.534
<v Maycon Da Silva Nogueira>Aqui, tipo isso, processado, validado,
processado como erro ou qualquer forma do</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/298-1
00:24:56.534 --> 00:25:00.427
<v Maycon Da Silva Nogueira>cliente ter essa visualização de beleza,
esse daqui bloqueou,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/298-2
00:25:00.427 --> 00:25:05.326
<v Maycon Da Silva Nogueira>esse daqui não bloqueou, entendeu?
A gente só precisa ter essa informação aí.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/298-3
00:25:05.326 --> 00:25:08.465
<v Maycon Da Silva Nogueira>Como cara,
o que você conseguir apresentar para a</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/298-4
00:25:08.465 --> 00:25:09.847
<v Maycon Da Silva Nogueira>gente que seja viável?</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/299-0
00:25:10.647 --> 00:25:15.447
<v Maycon Da Silva Nogueira>Tá, beleza. Agora, tipo 75 pop-ups,
aí fica realmente ruim, entende?</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/299-1
00:25:15.447 --> 00:25:20.942
<v Maycon Da Silva Nogueira>Mas quando eu coloco que ele tem que ser
processado de uma forma independente,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/299-2
00:25:20.942 --> 00:25:26.367
<v Maycon Da Silva Nogueira>é justamente isso. Se ele desse só um, ok,
coloquei 10 pessoas para bloquear.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/300-0
00:25:26.647 --> 00:25:30.526
<v Maycon Da Silva Nogueira>E 5 bloquearam, 5 não.
E aí ele apresenta um bloqueio concluído.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/300-1
00:25:30.526 --> 00:25:34.286
<v Maycon Da Silva Nogueira>Vai bem na cabeça do usuário,
parece que bloqueou os 10, sabe?</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/300-2
00:25:34.286 --> 00:25:38.822
<v Maycon Da Silva Nogueira>Só que aí no final tem 5 que não.
E aí a gente precisa ter essa visão dos 5</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/300-3
00:25:38.822 --> 00:25:41.687
<v Maycon Da Silva Nogueira>que não bloqueou pra gente permanecer
bloqueou.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/301-0
00:25:42.087 --> 00:25:46.007
<v Maycon Da Silva Nogueira>a refazer a tentativa de bloqueio.
Deu pra entender mais ou menos?</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/304-0
00:25:47.127 --> 00:25:50.995
<v Gabriel Vieira De Souza>Eu entendi o que como deve ser o
comportamento,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/302-0
00:25:50.807 --> 00:25:51.167
<v Maycon Da Silva Nogueira>Mhm.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/304-1
00:25:50.995 --> 00:25:56.878
<v Gabriel Vieira De Souza>o que não ficou claro para mim é
justamente como que eu vou mostrar isso</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/303-0
00:25:55.687 --> 00:25:56.727
<v Maycon Da Silva Nogueira>ou como apresentar.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/304-2
00:25:56.878 --> 00:25:58.087
<v Gabriel Vieira De Souza>para o cliente.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/305-0
00:26:00.407 --> 00:26:02.407
<v Gabriel Vieira De Souza>Tá, no caso, você ainda.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/306-0
00:26:00.607 --> 00:26:02.887
<v Maycon Da Silva Nogueira>Em resumo, da forma que fica mais viável.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/307-0
00:26:03.807 --> 00:26:06.007
<v Gabriel Vieira De Souza>Tá, eu vou pensar numa solução.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/308-0
00:26:04.407 --> 00:26:05.527
<v Maycon Da Silva Nogueira>Varejo que tickets.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/310-0
00:26:07.687 --> 00:26:09.527
<v Gabriel Vieira De Souza>Pode falar se você tiver algo.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/311-0
00:26:10.007 --> 00:26:12.415
<v Maycon Da Silva Nogueira>Não,
aqui são vários aplicativos que mostram</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/311-1
00:26:12.415 --> 00:26:16.858
<v Maycon Da Silva Nogueira>de formas diferentes. Então, por exemplo,
eu estou mostrando esse aqui que ele tem</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/311-2
00:26:16.858 --> 00:26:19.801
<v Maycon Da Silva Nogueira>essa carinha.
Tem um outro aplicativo que é por botão,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/311-3
00:26:19.801 --> 00:26:22.423
<v Maycon Da Silva Nogueira>então tipo,
tem um botãozinho do verdinho que tá</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/311-4
00:26:22.423 --> 00:26:25.367
<v Maycon Da Silva Nogueira>todos os que foram concluídos que foram
que foi feito.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/312-0
00:26:25.607 --> 00:26:28.374
<v Maycon Da Silva Nogueira>E tem o vermelhinho que todos os que não
aconteceram,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/312-1
00:26:28.374 --> 00:26:30.167
<v Maycon Da Silva Nogueira>qualquer forma que você apresentar.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/315-0
00:26:28.887 --> 00:26:32.556
<v Gabriel Vieira De Souza>A minha única dúvida é a única dúvida
igual, por exemplo,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/315-1
00:26:32.556 --> 00:26:35.973
<v Gabriel Vieira De Souza>que você está mostrando aí,
me parece que tipo assim,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/315-2
00:26:35.973 --> 00:26:40.021
<v Gabriel Vieira De Souza>nesse aplicativo aí de exemplo,
você tem uma lista que ele está</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/313-0
00:26:37.367 --> 00:26:37.967
<v Maycon Da Silva Nogueira>Mm-hmm.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/315-3
00:26:40.021 --> 00:26:44.007
<v Gabriel Vieira De Souza>consultando do banco,
você entende bem e ele vai lá e importa.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/316-0
00:26:44.087 --> 00:26:46.407
<v Gabriel Vieira De Souza>E mostra ali, é isso.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/314-0
00:26:44.407 --> 00:26:44.807
<v Maycon Da Silva Nogueira>Mhm.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/319-0
00:26:47.607 --> 00:26:48.287
<v Maycon Da Silva Nogueira>Face to mism.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/328-0
00:26:49.047 --> 00:26:53.226
<v Gabriel Vieira De Souza>Então, no nosso caso,
a gente já vai ter a nossa CDS,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/328-1
00:26:53.226 --> 00:26:58.178
<v Gabriel Vieira De Souza>que ela vai mostrar uma lista. Então,
o nosso aplicativo Fiori,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/322-0
00:26:53.847 --> 00:26:54.447
<v Maycon Da Silva Nogueira>Mm-hmm.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/328-2
00:26:58.178 --> 00:27:02.666
<v Gabriel Vieira De Souza>o objetivo dele já é mostrar uma lista.
E aí, tipo assim,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/325-0
00:27:01.247 --> 00:27:01.767
<v Maycon Da Silva Nogueira>Perfect.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/328-3
00:27:02.666 --> 00:27:05.607
<v Gabriel Vieira De Souza>eu não sei como que eu vou depois que.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/332-0
00:27:05.927 --> 00:27:11.847
<v Gabriel Vieira De Souza>Eu clico lá para enviar em massa,
eu meio que crio uma outra tela dizendo</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/332-1
00:27:11.847 --> 00:27:18.087
<v Gabriel Vieira De Souza>ali igual esse daí que você está fazendo,
mas eu vou fazer uma pesquisa aqui,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/331-0
00:27:17.727 --> 00:27:18.087
<v Maycon Da Silva Nogueira>Mhm.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/332-2
00:27:18.087 --> 00:27:20.647
<v Gabriel Vieira De Souza>conversar com outros ABAPs aqui.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/333-0
00:27:21.047 --> 00:27:25.951
<v Gabriel Vieira De Souza>É e propor para vocês o que eu acredito
que dá para fazer.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/333-1
00:27:25.951 --> 00:27:31.354
<v Gabriel Vieira De Souza>Não sei se vai ser o ideal,
se é o que o cliente quer, mas show,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/333-2
00:27:31.354 --> 00:27:32.767
<v Gabriel Vieira De Souza>posso fazer isso.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/334-0
00:27:32.167 --> 00:27:36.390
<v Maycon Da Silva Nogueira>Não perfeito é que o cliente ele também
não conhece muito do SAP, tá?</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/334-1
00:27:36.390 --> 00:27:39.527
<v Maycon Da Silva Nogueira>Então é por isso que eu estou falando
para você, é.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/335-0
00:27:40.967 --> 00:27:46.304
<v Maycon Da Silva Nogueira>Tendo a visão de que aconteceu o bloqueio
ou não, tá okay, sabe? É o que ele,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/335-1
00:27:46.304 --> 00:27:50.066
<v Maycon Da Silva Nogueira>a informação que ele precisa é quais
foram bloqueados,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/335-2
00:27:50.066 --> 00:27:54.240
<v Maycon Da Silva Nogueira>quais não foram bloqueados e se tem um
motivo, sabe? É isso.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/335-3
00:27:54.240 --> 00:27:56.087
<v Maycon Da Silva Nogueira>Você deve tentar novamente.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/338-0
00:27:56.247 --> 00:27:59.504
<v Maycon Da Silva Nogueira>Que que aconteceu?
É essa informação que a gente precisa ter,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/338-1
00:27:59.504 --> 00:27:59.767
<v Maycon Da Silva Nogueira>sabe?</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/339-0
00:28:01.207 --> 00:28:06.007
<v Gabriel Vieira De Souza>tá é show deixa eu ver se tem alguma
outra dúvida aqui espera aí</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/340-0
00:28:06.487 --> 00:28:07.127
<v Maycon Da Silva Nogueira>Beleza.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/341-0
00:28:09.527 --> 00:28:10.567
<v Maycon Da Silva Nogueira>T</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/344-0
00:28:14.087 --> 00:28:18.420
<v Gabriel Vieira De Souza>Ah tá, teve uma outra parte aqui.
Ah tá vou esperar você terminar aí para</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/344-1
00:28:18.420 --> 00:28:19.767
<v Gabriel Vieira De Souza>mim poder compartilhar.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/345-0
00:28:20.167 --> 00:28:24.287
<v Maycon Da Silva Nogueira>Só tava querendo te mostrar mesmo se a
ponte que eu baixei isso.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/346-0
00:28:27.607 --> 00:28:28.527
<v Maycon Da Silva Nogueira>I wish a little hot.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/351-0
00:28:39.007 --> 00:28:39.367
<v Maycon Da Silva Nogueira>Go on.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/356-0
00:28:44.567 --> 00:28:49.722
<v Maycon Da Silva Nogueira>O plug concluído, site linhas importadas,
é alguma coisa desse tipo, sabe?</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/356-1
00:28:49.722 --> 00:28:54.327
<v Maycon Da Silva Nogueira>Que a gente consiga ter informação do que
aconteceu, pode mostrar.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/357-0
00:28:56.487 --> 00:28:56.887
<v Gabriel Vieira De Souza>Yeah.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/359-0
00:28:58.087 --> 00:29:00.767
<v Gabriel Vieira De Souza>O nosso cenário,
ele é um pouco diferente desse que você</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/358-0
00:29:00.567 --> 00:29:01.607
<v Maycon Da Silva Nogueira>Sing, sing, sing.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/359-1
00:29:00.767 --> 00:29:02.647
<v Gabriel Vieira De Souza>mostrou, mas eu entendi o que você quer.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/362-0
00:29:04.007 --> 00:29:06.207
<v Gabriel Vieira De Souza>Cadê compartilhar isso daqui que eu quero?</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/367-0
00:29:08.247 --> 00:29:14.119
<v Gabriel Vieira De Souza>Outra coisa que eu fiquei na dúvida é
essa questão logo seguida aqui,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/367-1
00:29:14.119 --> 00:29:18.566
<v Gabriel Vieira De Souza>permitir navegação do cliente para os
apps standard,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/367-2
00:29:18.566 --> 00:29:23.767
<v Gabriel Vieira De Souza>administrar contas de crédito e
administrar itens de cliente.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/369-0
00:29:23.887 --> 00:29:28.442
<v Gabriel Vieira De Souza>Para consulta individual,
eu não consegui enxergar isso daqui</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/369-1
00:29:28.442 --> 00:29:33.510
<v Gabriel Vieira De Souza>naquele mockup, no mockup,
o template lá que vocês mostraram, não é?</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/368-0
00:29:31.687 --> 00:29:31.767
<v Maycon Da Silva Nogueira>No.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/369-2
00:29:33.510 --> 00:29:35.567
<v Gabriel Vieira De Souza>O que exatamente seria isso?</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/370-0
00:29:36.567 --> 00:29:40.680
<v Maycon Da Silva Nogueira>Seria algum tipo de algum botão,
algum momento em que desse para ele</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/370-1
00:29:40.680 --> 00:29:45.569
<v Maycon Da Silva Nogueira>visitar esses aplicativos com facilidade?
Mas de fato eu não coloquei ele no pedi</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/370-2
00:29:45.569 --> 00:29:50.278
<v Maycon Da Silva Nogueira>aquela imagem que eu fiz com IA e ela não
adicionou. Isso não é essencial, tá?</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/370-3
00:29:50.278 --> 00:29:52.007
<v Maycon Da Silva Nogueira>Isso de fato não é essencial.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/371-0
00:29:52.407 --> 00:29:57.867
<v Maycon Da Silva Nogueira>Se tiver algum botãozinho,
algum momento em que envie para eles,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/371-1
00:29:57.867 --> 00:30:03.747
<v Maycon Da Silva Nogueira>envie o usuário para essa consulta dos
aplicativos, ok? Se não tiver,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/371-2
00:30:03.747 --> 00:30:05.847
<v Maycon Da Silva Nogueira>não é algo que vai fazer.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/372-0
00:30:07.927 --> 00:30:09.887
<v Maycon Da Silva Nogueira>Que não vai, não vai ser essencial, sabe?
É isso.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/375-0
00:30:10.447 --> 00:30:13.921
<v Gabriel Vieira De Souza>Entendi. Então tá bom,
porque eu imagino assim, cara,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/375-1
00:30:13.921 --> 00:30:16.751
<v Gabriel Vieira De Souza>no ali no Launchpad,
em cima tem a lupinha,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/375-2
00:30:16.751 --> 00:30:21.705
<v Gabriel Vieira De Souza>tu escreve o nome do aplicativo e
pesquisa, né? Acho que já atende isso daí,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/373-0
00:30:17.007 --> 00:30:17.407
<v Maycon Da Silva Nogueira>Mhm.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/374-0
00:30:20.407 --> 00:30:20.847
<v Maycon Da Silva Nogueira>Perfect.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/375-3
00:30:21.705 --> 00:30:24.664
<v Gabriel Vieira De Souza>entendeu?
Eu achei que talvez você queria que</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/375-4
00:30:24.664 --> 00:30:29.167
<v Gabriel Vieira De Souza>tivesse alguns botões para aplicativos
específicos, mas show de bola.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/376-0
00:30:30.687 --> 00:30:32.367
<v Gabriel Vieira De Souza>A frequency.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/377-0
00:30:31.207 --> 00:30:32.927
<v Maycon Da Silva Nogueira>Completamente opcional essa parte, cara.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/379-0
00:30:33.647 --> 00:30:40.367
<v Gabriel Vieira De Souza>Tá,
frequência do gap acaba sendo meio que é.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/380-0
00:30:38.207 --> 00:30:41.007
<v Maycon Da Silva Nogueira>Vai ficar por conta do job, vai ser morta.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/383-0
00:30:41.727 --> 00:30:45.121
<v Gabriel Vieira De Souza>Deixa eu ver aqui outra coisa,
é aqui tem alguns detalhes,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/383-1
00:30:45.121 --> 00:30:46.847
<v Gabriel Vieira De Souza>detalhamento da implementação.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/389-0
00:31:13.167 --> 00:31:15.247
<v Maycon Da Silva Nogueira>Se você tiver falando alguma coisa,
tá mudado, tá?</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/390-0
00:31:23.807 --> 00:31:24.927
<v Gabriel Vieira De Souza>Aí, tá ouvindo agora?</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/391-0
00:31:24.847 --> 00:31:25.407
<v Maycon Da Silva Nogueira>Agora eu tô.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/395-0
00:31:26.367 --> 00:31:32.593
<v Gabriel Vieira De Souza>É, desculpa, é essa parte aqui.
Eu fiquei também não foi uma daquelas que</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/394-0
00:31:28.967 --> 00:31:29.647
<v Maycon Da Silva Nogueira>Rangel Rangel.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/395-1
00:31:32.593 --> 00:31:37.221
<v Gabriel Vieira De Souza>eu não entendi nada.
Você colocou aqui detalhamento da</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/395-2
00:31:37.221 --> 00:31:41.007
<v Gabriel Vieira De Souza>implementação tabela z de lista de
trabalho.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/399-0
00:31:41.487 --> 00:31:46.929
<v Gabriel Vieira De Souza>Com as propostas da última execução e o
BP de origem de tanana tanana,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/399-1
00:31:46.929 --> 00:31:52.371
<v Gabriel Vieira De Souza>eu não entendi o que é essa lista de
trabalho. É essa última execução.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/399-2
00:31:52.371 --> 00:31:56.127
<v Gabriel Vieira De Souza>Acredito que esteja se referindo a de ób,
então.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/398-0
00:31:55.327 --> 00:31:55.687
<v Maycon Da Silva Nogueira>Mhm.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/400-0
00:31:56.287 --> 00:31:58.287
<v Gabriel Vieira De Souza>Que é exatamente isso daqui?</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/401-0
00:31:59.327 --> 00:32:02.847
<v Maycon Da Silva Nogueira>Acho que já falou mais do job,
é trazer aquela lista, uma lista com.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/402-0
00:32:03.887 --> 00:32:10.176
<v Maycon Da Silva Nogueira>Todas as informações do que dos clientes
que foram captados para serem bloqueados</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/402-1
00:32:10.176 --> 00:32:15.007
<v Maycon Da Silva Nogueira>ou desbloqueados é meio que a gente
trazer uma esse histórico.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/403-0
00:32:19.167 --> 00:32:20.047
<v Gabriel Vieira De Souza>Não entendi.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/406-0
00:32:21.167 --> 00:32:24.335
<v Gabriel Vieira De Souza>Aí depois que o cara clicou,
é o que a gente estava falando de</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/404-0
00:32:21.567 --> 00:32:21.647
<v Maycon Da Silva Nogueira>No.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/406-1
00:32:24.335 --> 00:32:26.648
<v Gabriel Vieira De Souza>anterior,
o cara clicou lá para poder enviar,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/405-0
00:32:24.607 --> 00:32:25.887
<v Maycon Da Silva Nogueira>Eso, eso.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/406-2
00:32:26.648 --> 00:32:28.207
<v Gabriel Vieira De Souza>então tem que trazer uma lista.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/407-0
00:32:28.927 --> 00:32:34.674
<v Maycon Da Silva Nogueira>Fiz o bloqueio de 10 clientes, eu quero.
Eu preciso ter salvo em algum momento que</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/407-1
00:32:34.674 --> 00:32:39.521
<v Maycon Da Silva Nogueira>esses 10 clientes foram bloqueados.
Quando foi o que aconteceu, sabe?</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/407-2
00:32:39.521 --> 00:32:40.767
<v Maycon Da Silva Nogueira>E o porquê é isso.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/408-0
00:32:42.367 --> 00:32:45.245
<v Gabriel Vieira De Souza>Cara,
eu estou quase voltando para a gente</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/408-1
00:32:45.245 --> 00:32:48.927
<v Gabriel Vieira De Souza>poder fazer o aplicativo Fiori da tabela
de log, cara.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/409-0
00:32:51.167 --> 00:32:51.527
<v Maycon Da Silva Nogueira>Mhm.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/411-0
00:32:52.127 --> 00:32:58.231
<v Gabriel Vieira De Souza>porque meio que tipo assim mostrar isso
daí é justamente o que esse aplicativo</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/411-1
00:32:58.231 --> 00:33:04.181
<v Gabriel Vieira De Souza>mostraria mas mas eu vou ver aqui ainda
pera aí não vou decidir só nem pisar</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/410-0
00:32:58.447 --> 00:32:58.927
<v Maycon Da Silva Nogueira>Danger.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/411-2
00:33:04.181 --> 00:33:07.967
<v Gabriel Vieira De Souza>nesse ponto aí agora não acho que talvez
dê para</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/412-0
00:33:08.047 --> 00:33:08.687
<v Gabriel Vieira De Souza>Is over.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/413-0
00:33:10.127 --> 00:33:15.966
<v Gabriel Vieira De Souza>É outro ponto aqui,
cadê gravação do bloqueio do motivo pelas</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/413-1
00:33:15.966 --> 00:33:17.567
<v Gabriel Vieira De Souza>classes standard?</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/415-0
00:33:19.727 --> 00:33:26.064
<v Gabriel Vieira De Souza>Aí eu não entendi essas classes aí tipo
assim gravação do bloqueio do motivo</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/415-1
00:33:26.064 --> 00:33:32.401
<v Gabriel Vieira De Souza>pelas classes standard eu tenho que
quando alguém for é sei lá foi bloqueado</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/415-2
00:33:32.401 --> 00:33:36.927
<v Gabriel Vieira De Souza>por outro motivo lá seja por juris
qualquer nome era é</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/414-0
00:33:34.927 --> 00:33:37.567
<v Maycon Da Silva Nogueira>Programas locais, só jurídicos.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/416-0
00:33:37.807 --> 00:33:41.912
<v Gabriel Vieira De Souza>Exato,
eu também tenho que salvar na tabela de</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/416-1
00:33:41.912 --> 00:33:46.541
<v Gabriel Vieira De Souza>log? Se sim,
é onde que eu vou conseguir fazer isso,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/416-2
00:33:46.541 --> 00:33:47.327
<v Gabriel Vieira De Souza>entendeu?</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/418-0
00:33:49.567 --> 00:33:54.588
<v Gabriel Vieira De Souza>Porque até a questão da inadimplência
está totalmente vinculada aqui a esse</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/417-0
00:33:49.847 --> 00:33:50.007
<v Maycon Da Silva Nogueira>Okay.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/418-1
00:33:54.588 --> 00:34:00.138
<v Gabriel Vieira De Souza>aplicativo, o jurídico, ele já está e é,
por exemplo, problemas fiscais, jurídicos,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/418-2
00:34:00.138 --> 00:34:02.847
<v Gabriel Vieira De Souza>se eu não me engano, é de outros módulos.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/419-0
00:34:04.847 --> 00:34:08.145
<v Maycon Da Silva Nogueira>Agora, eu acho que esse daí,
essa linha eu coloquei que era dos 50 mil,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/419-1
00:34:08.145 --> 00:34:11.398
<v Maycon Da Silva Nogueira>eu coloquei no 09. Deixa eu ver,
a gravação do bloqueio do motivo pela</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/419-2
00:34:11.398 --> 00:34:13.047
<v Maycon Da Silva Nogueira>casa está under a mostrar o correct.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/420-0
00:34:18.847 --> 00:34:21.327
<v Maycon Da Silva Nogueira>Eu acho que esse daí era dos 51 e eu
coloquei aí, tá?</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/421-0
00:34:22.927 --> 00:34:25.647
<v Gabriel Vieira De Souza>Então eu posso só desconsiderar</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/422-0
00:34:24.447 --> 00:34:26.607
<v Maycon Da Silva Nogueira>I'll just consider all.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/423-0
00:34:28.287 --> 00:34:32.812
<v Gabriel Vieira De Souza>Tá, deixa eu ver aqui outra coisa aqui.
Ah, essa aqui é boa.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/423-1
00:34:32.812 --> 00:34:38.449
<v Gabriel Vieira De Souza>Detalhamento da tabela de parâmetros aqui.
Essa tabela de parâmetros, cara,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/423-2
00:34:38.449 --> 00:34:43.567
<v Gabriel Vieira De Souza>eu fiquei um pouco na dúvida o que de
fato a gente vai utilizar ela.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/425-0
00:34:43.687 --> 00:34:49.763
<v Gabriel Vieira De Souza>Entendeu?
Porque o que pelo que a gente conversou</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/424-0
00:34:44.687 --> 00:34:45.047
<v Maycon Da Silva Nogueira>Mhm.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/425-1
00:34:49.763 --> 00:34:50.127
<v Gabriel Vieira De Souza>na.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/426-0
00:34:51.287 --> 00:34:55.326
<v Gabriel Vieira De Souza>Reunião mais cedo,
os principais dados ali que de fato</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/426-1
00:34:55.326 --> 00:35:00.099
<v Gabriel Vieira De Souza>poderiam ser alterados,
pelo menos pelo que eu entendi do Delta,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/426-2
00:35:00.099 --> 00:35:04.505
<v Gabriel Vieira De Souza>eles vão ser hardcode.
E aí o que eu vou de fato guardar na</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/426-3
00:35:04.505 --> 00:35:06.047
<v Gabriel Vieira De Souza>tabela de parâmetros?</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/427-0
00:35:09.407 --> 00:35:13.057
<v Maycon Da Silva Nogueira>Basicamente,
a informação desse desse CVH do CVH</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/427-1
00:35:13.057 --> 00:35:16.633
<v Maycon Da Silva Nogueira>interno,
que é a chave de a classe de risco que</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/427-2
00:35:16.633 --> 00:35:20.433
<v Maycon Da Silva Nogueira>eles chamam de chave 5.
Ela não vai ser utilizado,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/427-3
00:35:20.433 --> 00:35:23.487
<v Maycon Da Silva Nogueira>então ela é uma é uma classe de risco em.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/428-0
00:35:23.607 --> 00:35:28.944
<v Maycon Da Silva Nogueira>Interno que vai ser usado para
classificar os BPS que não devem ser</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/428-1
00:35:28.944 --> 00:35:29.807
<v Maycon Da Silva Nogueira>bloqueados.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/429-0
00:35:31.007 --> 00:35:36.160
<v Maycon Da Silva Nogueira>E a parte dos do perfil,
então ela vai ser uma classificação se</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/429-1
00:35:36.160 --> 00:35:41.797
<v Maycon Da Silva Nogueira>olha só, um é perfil à vista,
2 é o perfil a prazo e o 5 é o interno.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/429-2
00:35:41.797 --> 00:35:43.407
<v Maycon Da Silva Nogueira>Essa é a informação.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/431-0
00:35:43.967 --> 00:35:49.807
<v Gabriel Vieira De Souza>Esses perfis tem que estar,
tem que estar na tabela de parâmetros.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/430-0
00:35:46.767 --> 00:35:48.847
<v Maycon Da Silva Nogueira>Vai ser na tabela tipo.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/432-0
00:35:50.127 --> 00:35:54.453
<v Maycon Da Silva Nogueira>Sim, porque é, por exemplo,
atualmente eles já mudaram isso, tá?</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/432-1
00:35:54.453 --> 00:35:59.244
<v Maycon Da Silva Nogueira>Porque eles tinham uma outra
classificação, então tipo, tinha 12345678.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/432-2
00:35:59.244 --> 00:36:03.437
<v Maycon Da Silva Nogueira>Acho que era um 9 no total.
E aí agora eles estão mudando para</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/432-3
00:36:03.437 --> 00:36:05.167
<v Maycon Da Silva Nogueira>somente a vista e a prazo.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/433-0
00:36:05.887 --> 00:36:10.219
<v Maycon Da Silva Nogueira>e o 5, que é o interno.
E aí pode ser que a gente deixe na tabela</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/433-1
00:36:10.219 --> 00:36:15.471
<v Maycon Da Silva Nogueira>de parâmetros justamente por conta dessa
informação ser algo meio interno deles</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/433-2
00:36:15.471 --> 00:36:16.127
<v Maycon Da Silva Nogueira>alterável.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/435-0
00:36:17.647 --> 00:36:22.018
<v Maycon Da Silva Nogueira>Não vai ser alterado com frequência de
fato, mas pode ser que altere, sim,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/434-0
00:36:17.887 --> 00:36:18.087
<v Gabriel Vieira De Souza>The.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/435-1
00:36:22.018 --> 00:36:25.807
<v Maycon Da Silva Nogueira>que eles incluam, sei lá, um 3,
que é um atraso premium, sei lá.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/437-0
00:36:26.767 --> 00:36:35.057
<v Gabriel Vieira De Souza>Tá, tá bom, é isso aí já já foi entendido.
Deixa eu ver outro aqui. Feio, é, fez,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/436-0
00:36:32.167 --> 00:36:32.927
<v Maycon Da Silva Nogueira>Faz sentido?</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/437-1
00:36:35.057 --> 00:36:35.967
<v Gabriel Vieira De Souza>fez, fez.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/438-0
00:36:36.527 --> 00:36:37.407
<v Maycon Da Silva Nogueira>Luiz a preferred.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/440-0
00:36:37.247 --> 00:36:41.533
<v Gabriel Vieira De Souza>Tem algumas coisas que, tipo assim,
eu sei que é mais a questão do cliente lá</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/440-1
00:36:41.533 --> 00:36:42.687
<v Gabriel Vieira De Souza>mesmo, não tenho que.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/439-0
00:36:41.567 --> 00:36:42.167
<v Maycon Da Silva Nogueira>Mm-hmm.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/441-0
00:36:43.647 --> 00:36:47.910
<v Gabriel Vieira De Souza>É outra coisa aqui essa questão de
objetos de autorização,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/441-1
00:36:47.910 --> 00:36:50.367
<v Gabriel Vieira De Souza>objeto de autorização customizado.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/443-0
00:36:51.327 --> 00:36:56.428
<v Gabriel Vieira De Souza>Exemplos ZF block como campo empresa,
segmento de crédito,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/443-1
00:36:56.428 --> 00:37:02.047
<v Gabriel Vieira De Souza>eu não entendi muito bem que seria esses
objetos de autorização.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/442-0
00:36:58.487 --> 00:36:59.087
<v Maycon Da Silva Nogueira>Mm-hmm.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/444-0
00:37:00.527 --> 00:37:04.568
<v Maycon Da Silva Nogueira>É a autorização,
é a chave para a função que deve que tem</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/444-1
00:37:04.568 --> 00:37:09.166
<v Maycon Da Silva Nogueira>que ser acionada no perfil para ele ter
acesso a esse aplicativo,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/444-2
00:37:09.166 --> 00:37:14.669
<v Maycon Da Silva Nogueira>fazer alterações no aplicativo. É isso.
E aí está especificando que a empresa,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/444-3
00:37:14.669 --> 00:37:17.247
<v Maycon Da Silva Nogueira>a empresa, o campo técnico, book RSE.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/445-0
00:37:17.567 --> 00:37:22.229
<v Maycon Da Silva Nogueira>Vai ser a empresa deles, CVH1,
o segmento de crédito tem que estar</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/445-1
00:37:22.229 --> 00:37:26.195
<v Maycon Da Silva Nogueira>disponível no BP,
a atividade que tem que ser permitida,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/445-2
00:37:26.195 --> 00:37:30.927
<v Maycon Da Silva Nogueira>então tem que ser permitido exibir,
bloquear e desbloquear. É isso.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/446-0
00:37:31.767 --> 00:37:36.367
<v Gabriel Vieira De Souza>Está essa parte aqui é uma configuração
que eu faço também.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/447-0
00:37:36.847 --> 00:37:40.287
<v Maycon Da Silva Nogueira>É, acredito que sim. Acredito não. É. É.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/449-0
00:37:38.287 --> 00:37:44.604
<v Gabriel Vieira De Souza>Tá, vou, vou, vou, vou ver isso daqui,
pode ficar tranquilo, volume,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/449-1
00:37:44.604 --> 00:37:47.167
<v Gabriel Vieira De Souza>eu vou desconsiderar, que é.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/448-0
00:37:46.687 --> 00:37:47.327
<v Maycon Da Silva Nogueira>Perfeito.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/450-0
00:37:48.447 --> 00:37:48.927
<v Gabriel Vieira De Souza>Jovem.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/451-0
00:37:50.127 --> 00:37:54.967
<v Gabriel Vieira De Souza>Cara, eu acredito que é isso aí.
Outras coisas que eu fiquei na dúvida foi.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/452-0
00:37:55.967 --> 00:37:58.047
<v Gabriel Vieira De Souza>É aqui o premissas de.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/455-0
00:37:59.407 --> 00:38:02.127
<v Gabriel Vieira De Souza>Cadê premissas e restrições, né?</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/456-0
00:38:03.327 --> 00:38:08.494
<v Gabriel Vieira De Souza>Saldo premissa 3,
o saldo vencido não considera juros e</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/456-1
00:38:08.494 --> 00:38:10.247
<v Gabriel Vieira De Souza>multas já lançados.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/460-0
00:38:11.327 --> 00:38:15.468
<v Gabriel Vieira De Souza>Que o juros e multas aqui vai entrar no
nosso caso, entendeu?</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/460-1
00:38:15.468 --> 00:38:18.207
<v Gabriel Vieira De Souza>Como que isso vai impactar na nossa tela?</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/459-0
00:38:16.047 --> 00:38:16.447
<v Maycon Da Silva Nogueira>Então.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/462-0
00:38:18.687 --> 00:38:21.193
<v Maycon Da Silva Nogueira>É justamente isso,
não vai ser considerado.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/462-1
00:38:21.193 --> 00:38:24.268
<v Maycon Da Silva Nogueira>É porque no primeiro momento a gente iria
considerar.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/462-2
00:38:24.268 --> 00:38:28.767
<v Maycon Da Silva Nogueira>Então tem um outro delta que ele faz o
cálculo desse juros e multa com base no</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/462-3
00:38:28.767 --> 00:38:32.753
<v Maycon Da Silva Nogueira>atraso do cliente da inadimplência.
Então ele tá atrasado há 10 dias,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/462-4
00:38:32.753 --> 00:38:36.967
<v Maycon Da Silva Nogueira>tem o juros de 10% e aí teria que ser
agregado ao valor da inadimplência.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/463-0
00:38:38.527 --> 00:38:41.745
<v Maycon Da Silva Nogueira>Eles já decidiram que isso não vai ser
considerado,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/461-0
00:38:38.807 --> 00:38:38.927
<v Gabriel Vieira De Souza>But</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/463-1
00:38:41.745 --> 00:38:45.025
<v Maycon Da Silva Nogueira>então a gente vai pegar a CDS,
vai lá no aplicativo,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/463-2
00:38:45.025 --> 00:38:50.037
<v Maycon Da Silva Nogueira>fazer a verificação do da quantia que tá
lá cravada. Então, se ele tá 200 reais,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/463-3
00:38:50.037 --> 00:38:54.369
<v Maycon Da Silva Nogueira>tá inadimplente de 200 reais,
ele vai ficar inadimplente de 200 reais</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/463-4
00:38:54.369 --> 00:38:56.287
<v Maycon Da Silva Nogueira>sem multa, sem juros, sem nada.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/464-0
00:38:56.607 --> 00:38:57.727
<v Maycon Da Silva Nogueira>sem nenhum valor agregado.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/465-0
00:38:59.167 --> 00:39:01.968
<v Gabriel Vieira De Souza>Tá,
então aqui eu posso simplesmente</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/465-1
00:39:01.968 --> 00:39:04.087
<v Gabriel Vieira De Souza>desconsiderar essa premissa.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/466-0
00:39:03.647 --> 00:39:06.666
<v Maycon Da Silva Nogueira>É,
é que é uma premissa muito mais do pro</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/466-1
00:39:06.666 --> 00:39:08.607
<v Maycon Da Silva Nogueira>Vaing do que pra gente, tá?</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/467-0
00:39:09.487 --> 00:39:12.858
<v Gabriel Vieira De Souza>Tá,
é outra premissa aqui que eu fiquei na</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/467-1
00:39:12.858 --> 00:39:13.407
<v Gabriel Vieira De Souza>dúvida.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/471-0
00:39:17.567 --> 00:39:22.441
<v Gabriel Vieira De Souza>Clientes que não devem ser bloqueados,
exemplo supermercados.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/471-1
00:39:22.441 --> 00:39:28.651
<v Gabriel Vieira De Souza>Lá naquele exemplozinho que você deixou,
tem lá o E como a gente não vai fazer</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/470-0
00:39:27.647 --> 00:39:28.287
<v Maycon Da Silva Nogueira>No mockup.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/471-2
00:39:28.651 --> 00:39:34.153
<v Gabriel Vieira De Souza>bloqueio automático também,
isso aqui também é mais uma premissa para</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/471-3
00:39:34.153 --> 00:39:35.647
<v Gabriel Vieira De Souza>o cliente, correto?</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/472-0
00:39:36.527 --> 00:39:40.485
<v Maycon Da Silva Nogueira>Essa ela é principalmente para o cliente,
mas ela envolve um pouquinho você só para</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/472-1
00:39:40.485 --> 00:39:44.255
<v Maycon Da Silva Nogueira>te explicar. Ele tem alguns clientes,
então aí eu estou colocando o exemplo dos</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/472-2
00:39:44.255 --> 00:39:46.847
<v Maycon Da Silva Nogueira>supermercados,
porque no geral eles são supermercados.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/473-0
00:39:47.887 --> 00:39:54.339
<v Maycon Da Silva Nogueira>E aí, o que a gente vai ter que fazer?
Um dos pedidos deles foi que, no geral,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/473-1
00:39:54.339 --> 00:40:00.220
<v Maycon Da Silva Nogueira>eles não fazem o bloqueio desse desses
parceiros, desses supermercados.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/473-2
00:40:00.220 --> 00:40:03.487
<v Maycon Da Silva Nogueira>E como que a gente faz a verificação de?</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/474-0
00:40:03.567 --> 00:40:06.127
<v Maycon Da Silva Nogueira>Quais são esses clientes? Quais são esses?</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/475-0
00:40:17.327 --> 00:40:20.167
<v Gabriel Vieira De Souza>Então, se eu se se.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/476-0
00:40:20.647 --> 00:40:23.713
<v Maycon Da Silva Nogueira>Só para terminar,
eles podem ser apresentados porque</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/476-1
00:40:23.713 --> 00:40:27.994
<v Maycon Da Silva Nogueira>existem situações que são excessivas em
que eles podem sim bloquear esses</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/476-2
00:40:27.994 --> 00:40:31.985
<v Maycon Da Silva Nogueira>parceiros. Só que no geral,
seria interessante a gente ter um filtro</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/476-3
00:40:31.985 --> 00:40:35.167
<v Maycon Da Silva Nogueira>que desse para remover esses parceiros
desse segmento.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/477-0
00:40:35.847 --> 00:40:36.447
<v Maycon Da Silva Nogueira>Anything to do?</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/479-0
00:40:38.087 --> 00:40:42.567
<v Gabriel Vieira De Souza>Espera aí, é, eu entendi,
mas parece um pouco controverso, porque.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/478-0
00:40:42.327 --> 00:40:42.527
<v Maycon Da Silva Nogueira>So.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/481-0
00:40:43.847 --> 00:40:48.807
<v Gabriel Vieira De Souza>É, eu não devo mostrar esse parceiro.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/483-0
00:40:50.007 --> 00:40:55.091
<v Gabriel Vieira De Souza>E só que existe um cenário onde que eu
tenho que mostrar porque é a exceção da</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/483-1
00:40:55.091 --> 00:40:57.986
<v Gabriel Vieira De Souza>exceção,
como que eu vou saber quando é esse</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/482-0
00:40:56.927 --> 00:40:57.247
<v Maycon Da Silva Nogueira>Yeah.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/483-2
00:40:57.986 --> 00:40:58.887
<v Gabriel Vieira De Souza>cenário e não?</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/485-0
00:40:59.447 --> 00:41:02.000
<v Maycon Da Silva Nogueira>Vai ser, vai ser uma ação manual, tá?
Então,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/485-1
00:41:02.000 --> 00:41:05.972
<v Maycon Da Silva Nogueira>qual que é a ação que a gente tem que
deixar dentro desse aplicativo?</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/485-2
00:41:05.972 --> 00:41:08.695
<v Maycon Da Silva Nogueira>Que é importante a gente incluir no
aplicativo?</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/485-3
00:41:08.695 --> 00:41:12.667
<v Maycon Da Silva Nogueira>É a gente ter algum tipo de filtro que
capte esse código do segmento.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/485-4
00:41:12.667 --> 00:41:15.447
<v Maycon Da Silva Nogueira>E aí eles podem tirar ou incluir o
autosserviço.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/487-0
00:41:15.967 --> 00:41:17.887
<v Maycon Da Silva Nogueira>Que é para facilitar a visualização deles.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/486-0
00:41:16.407 --> 00:41:17.007
<v Gabriel Vieira De Souza>Então, I know.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/488-0
00:41:18.327 --> 00:41:23.422
<v Gabriel Vieira De Souza>Então eu, na verdade, não tenho controle.
A gente não tem controle nenhum sobre</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/488-1
00:41:23.422 --> 00:41:26.607
<v Gabriel Vieira De Souza>isso. É 100% do usuário lá. Então eu vou,
eu vou.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/490-0
00:41:24.767 --> 00:41:27.490
<v Maycon Da Silva Nogueira>Exatamente,
a única coisa que a gente tem que dar</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/490-1
00:41:27.490 --> 00:41:31.902
<v Maycon Da Silva Nogueira>esse controle para eles é esse filtro,
que é para eles removerem quando eles não</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/490-2
00:41:31.902 --> 00:41:35.007
<v Maycon Da Silva Nogueira>forem e não tiver esse caso excessivo
acontecendo, sabe?</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/489-0
00:41:36.567 --> 00:41:36.887
<v Gabriel Vieira De Souza>Yeah.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/491-0
00:41:37.407 --> 00:41:38.047
<v Maycon Da Silva Nogueira>É isso.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/493-0
00:41:37.847 --> 00:41:43.767
<v Gabriel Vieira De Souza>É, vamos lá, tu terminou. Eu falei,
eu li um negócio todo, é, vamos lá.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/492-0
00:41:42.847 --> 00:41:44.127
<v Maycon Da Silva Nogueira>É bom sim.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/495-0
00:41:45.207 --> 00:41:51.931
<v Gabriel Vieira De Souza>É bloqueio o PR3 ali bloqueios por
inadimplências migrados para migrados no</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/495-1
00:41:51.931 --> 00:41:58.743
<v Gabriel Vieira De Souza>Google live recebem um registro inicial
de tabela Z é carga inicial é eu não</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/495-2
00:41:58.743 --> 00:42:00.247
<v Gabriel Vieira De Souza>entendi muito bem</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/497-0
00:42:00.327 --> 00:42:03.631
<v Gabriel Vieira De Souza>Essa parte, então, tipo assim,
se já tiver,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/494-0
00:42:00.527 --> 00:42:00.647
<v Maycon Da Silva Nogueira>Yeah.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/497-1
00:42:03.631 --> 00:42:08.286
<v Gabriel Vieira De Souza>eu vou antes de iniciar o que antes de
jogar para a produção,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/496-0
00:42:04.127 --> 00:42:04.207
<v Maycon Da Silva Nogueira>No.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/497-2
00:42:08.286 --> 00:42:13.767
<v Gabriel Vieira De Souza>a gente vai ter que fazer uma carga nessa
nessa tabela depois de criada.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/499-0
00:42:15.167 --> 00:42:18.453
<v Maycon Da Silva Nogueira>Essa parte eu confesso que foi uma
sugestão da IA, tá?</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/499-1
00:42:18.453 --> 00:42:23.413
<v Maycon Da Silva Nogueira>Que é justamente a parte do Google Live.
É um momento importante e a gente tem que</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/498-0
00:42:21.207 --> 00:42:21.687
<v Gabriel Vieira De Souza>PG.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/499-2
00:42:23.413 --> 00:42:26.580
<v Maycon Da Silva Nogueira>pensar em como que os clientes que estão
bloqueados,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/499-3
00:42:26.580 --> 00:42:29.567
<v Maycon Da Silva Nogueira>eles vão nascer bloqueados no ambiente
produtivo.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/501-0
00:42:30.127 --> 00:42:32.772
<v Maycon Da Silva Nogueira>Eles vão ter sido feitos com carga de
dados, né?</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/500-0
00:42:30.407 --> 00:42:30.807
<v Gabriel Vieira De Souza>I.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/501-1
00:42:32.772 --> 00:42:36.659
<v Maycon Da Silva Nogueira>Só que como que a gente vai ter?
Como que a gente vai ter informação de</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/501-2
00:42:36.659 --> 00:42:39.844
<v Maycon Da Silva Nogueira>que esse cliente está bloqueado? Não,
aí seria a sugestão.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/501-3
00:42:39.844 --> 00:42:41.247
<v Maycon Da Silva Nogueira>Foi justamente essa parte.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/504-0
00:42:42.327 --> 00:42:47.950
<v Gabriel Vieira De Souza>Assim, a minha visão de como deve, não é?
Eu entendo também quando a IA faz isso,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/502-0
00:42:46.007 --> 00:42:46.367
<v Maycon Da Silva Nogueira>Hello.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/504-1
00:42:47.950 --> 00:42:51.241
<v Gabriel Vieira De Souza>porque de fato é uma sugestão muito
importante.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/504-2
00:42:51.241 --> 00:42:55.287
<v Gabriel Vieira De Souza>Só que que eu que eu tenho de experiência
até aqui, não é?</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/503-0
00:42:54.167 --> 00:42:54.527
<v Maycon Da Silva Nogueira>Mhm.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/507-0
00:42:56.727 --> 00:43:01.588
<v Gabriel Vieira De Souza>No nosso caso, especificamente,
o que vai definir que o cliente está</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/507-1
00:43:01.588 --> 00:43:07.575
<v Gabriel Vieira De Souza>bloqueado ou não é a tabela de log. Então,
ter ou não ter uma carga inicial indifere</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/505-0
00:43:03.567 --> 00:43:04.167
<v Maycon Da Silva Nogueira>Mm-hmm.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/507-2
00:43:07.575 --> 00:43:12.224
<v Gabriel Vieira De Souza>para a gente, entendeu?
É quando a gente vai olhar para o cliente</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/506-0
00:43:09.727 --> 00:43:10.447
<v Maycon Da Silva Nogueira>Perfeito, cara.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/507-3
00:43:12.224 --> 00:43:12.647
<v Gabriel Vieira De Souza>final.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/508-0
00:43:13.127 --> 00:43:16.622
<v Gabriel Vieira De Souza>É,
ele entende que antes do antes da gente</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/508-1
00:43:16.622 --> 00:43:20.848
<v Gabriel Vieira De Souza>desenvolver isso daqui,
de fato não existia. Então,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/508-2
00:43:20.848 --> 00:43:26.537
<v Gabriel Vieira De Souza>esse primeiro momento ali, de fato,
a tabela de log não vai ter esses</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/508-3
00:43:26.537 --> 00:43:28.487
<v Gabriel Vieira De Souza>registros anteriores ou.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/510-0
00:43:28.967 --> 00:43:32.192
<v Gabriel Vieira De Souza>O chat,
ele fala isso daí porque na dúvida é</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/510-1
00:43:32.192 --> 00:43:35.774
<v Gabriel Vieira De Souza>sempre melhor meter essa carga inicial,
entendeu?</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/510-2
00:43:35.774 --> 00:43:40.647
<v Gabriel Vieira De Souza>Mas eu acho que não se aplica muito ao
nosso caso. O que você acha?</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/509-0
00:43:35.887 --> 00:43:36.487
<v Maycon Da Silva Nogueira>Mm-hmm.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/511-0
00:43:41.447 --> 00:43:45.167
<v Maycon Da Silva Nogueira>Eu acho que pelo que você me falou,
faz sentido, tá? Eu concordo.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/512-0
00:43:46.487 --> 00:43:54.838
<v Gabriel Vieira De Souza>Tá, é agora a última questão que aí já é,
eu acho que tem que ser revisado tudo</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/512-1
00:43:54.838 --> 00:44:03.085
<v Gabriel Vieira De Souza>essa questão aqui do plano de testes.
Como foi tirada essa questão da job toda</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/512-2
00:44:03.085 --> 00:44:03.607
<v Gabriel Vieira De Souza>aqui?</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/516-0
00:44:04.247 --> 00:44:08.658
<v Gabriel Vieira De Souza>Testes é uma parada que dá muito,
como que eu vou falar?</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/516-1
00:44:08.658 --> 00:44:13.688
<v Gabriel Vieira De Souza>Não é conflito a palavra,
mas vamos dizer ruído, dá muito ruído,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/516-2
00:44:13.688 --> 00:44:19.028
<v Gabriel Vieira De Souza>principalmente entre o desenvolvedor e no
nosso caso aqui consultor,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/516-3
00:44:19.028 --> 00:44:23.207
<v Gabriel Vieira De Souza>no outro contexto era pior,
no caso aqui é consultor.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/515-0
00:44:20.047 --> 00:44:20.647
<v Maycon Da Silva Nogueira>Mm-hmm.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/520-0
00:44:23.447 --> 00:44:27.824
<v Gabriel Vieira De Souza>Porque, de fato,
na hora de fazer o teste tem que ficar</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/517-0
00:44:25.567 --> 00:44:25.727
<v Maycon Da Silva Nogueira>Nota.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/520-1
00:44:27.824 --> 00:44:31.889
<v Gabriel Vieira De Souza>muito bem alinhado,
até porque pelo que eu vi aqui,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/518-0
00:44:28.287 --> 00:44:28.887
<v Maycon Da Silva Nogueira>Mm-hmm.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/520-2
00:44:31.889 --> 00:44:37.986
<v Gabriel Vieira De Souza>a gente precisa fazer testes unitários,
baseados nos testes que vocês passam.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/519-0
00:44:37.247 --> 00:44:37.887
<v Maycon Da Silva Nogueira>Tada.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/520-3
00:44:37.986 --> 00:44:40.487
<v Gabriel Vieira De Souza>Então, eu queria pedir um favor.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/521-0
00:44:40.647 --> 00:44:43.555
<v Gabriel Vieira De Souza>Mesmo que não vai atualizar o Delta
inteiro,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/521-1
00:44:43.555 --> 00:44:48.401
<v Gabriel Vieira De Souza>se possível atualizar essa questão do
plano de testes para me ajudar aqui,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/521-2
00:44:48.401 --> 00:44:51.373
<v Gabriel Vieira De Souza>porque senão de fato vai ficar muito de
fato,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/521-3
00:44:51.373 --> 00:44:55.767
<v Gabriel Vieira De Souza>vai gerar ruído na hora de fazer executar
os testes lá, afinal, aí.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/526-0
00:44:56.007 --> 00:44:59.478
<v Gabriel Vieira De Souza>Por exemplo, você vai encontrar um erro.
Eu falei assim, pô,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/526-1
00:44:59.478 --> 00:45:03.746
<v Gabriel Vieira De Souza>mas está no cenário de teste que você
levantou. Aí, pô, você vai olhar lá,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/526-2
00:45:03.746 --> 00:45:07.160
<v Gabriel Vieira De Souza>não está, entendeu?
Porque é completamente diferente do que</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/522-0
00:45:07.007 --> 00:45:07.567
<v Maycon Da Silva Nogueira>Thank you.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/526-3
00:45:07.160 --> 00:45:10.289
<v Gabriel Vieira De Souza>está aqui. Aí esse daqui,
se puder atualizar para mim,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/526-4
00:45:10.289 --> 00:45:12.167
<v Gabriel Vieira De Souza>eu ia agradecer muito, meu amigo.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/523-0
00:45:12.447 --> 00:45:13.007
<v Maycon Da Silva Nogueira>Fiscal.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/529-0
00:45:13.847 --> 00:45:20.005
<v Gabriel Vieira De Souza>Os outros aqui eu acho que é mais de boa
mesmo, não tem muito o que fazer.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/529-1
00:45:20.005 --> 00:45:24.685
<v Gabriel Vieira De Souza>E por último aqui, a gente precisa,
pelo que eu entendi,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/529-2
00:45:24.685 --> 00:45:29.447
<v Gabriel Vieira De Souza>o próximo passo é eu criar ali uma
especificação técnica.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/532-0
00:45:29.767 --> 00:45:35.290
<v Gabriel Vieira De Souza>É compilando tudo que a gente viu até
agora e propor para vocês,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/532-1
00:45:35.290 --> 00:45:41.069
<v Gabriel Vieira De Souza>inclusive questão de quais são os
artefatos que vão se precisar ser</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/532-2
00:45:41.069 --> 00:45:45.402
<v Gabriel Vieira De Souza>artefatos,
não objetos que precisarão ser criados,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/532-3
00:45:45.402 --> 00:45:46.167
<v Gabriel Vieira De Souza>como CDF.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/534-0
00:45:46.327 --> 00:45:50.728
<v Gabriel Vieira De Souza>CDS, behavior e etc, etc. Aí,
antes de criar isso daqui,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/533-0
00:45:49.887 --> 00:45:50.367
<v Maycon Da Silva Nogueira>Mhm.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/534-1
00:45:50.728 --> 00:45:55.516
<v Gabriel Vieira De Souza>eu não sei se é o ideal.
Eu não sei se eu já posso ir criando</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/534-2
00:45:55.516 --> 00:46:01.847
<v Gabriel Vieira De Souza>baseado no que a gente já falou aqui ou
se é melhor esperar essa atualização sua.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/536-0
00:46:02.407 --> 00:46:03.607
<v Gabriel Vieira De Souza>O que você acha melhor?</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/535-0
00:46:02.727 --> 00:46:02.847
<v Maycon Da Silva Nogueira>Up.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/538-0
00:46:04.127 --> 00:46:08.544
<v Maycon Da Silva Nogueira>Pelo que eu tô vendo no projeto,
pode seguir, pode mandar bala, tá? Isso,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/538-1
00:46:08.544 --> 00:46:12.961
<v Maycon Da Silva Nogueira>inclusive essa especificação técnica,
a gente não tá recebendo não, cara.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/538-2
00:46:12.961 --> 00:46:17.437
<v Maycon Da Silva Nogueira>A gente até acompanha o passo a passo,
mas você tá mandando mais pro Rafa,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/538-3
00:46:17.437 --> 00:46:19.407
<v Maycon Da Silva Nogueira>tá que é o líder de vocês. Ele é.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/537-0
00:46:19.127 --> 00:46:19.687
<v Gabriel Vieira De Souza>Ah, tá.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/539-0
00:46:19.887 --> 00:46:23.326
<v Maycon Da Silva Nogueira>Vocês ABAPs em si que estão que estão
dando OK um para o outro.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/539-1
00:46:23.326 --> 00:46:26.927
<v Maycon Da Silva Nogueira>A gente só vai fazendo acompanhamento de
como que está o processo.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/540-0
00:46:27.927 --> 00:46:32.467
<v Gabriel Vieira De Souza>Show, show de bola, então tá joia.
Então eu vou, vou, vou seguir aqui.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/540-1
00:46:32.467 --> 00:46:35.857
<v Gabriel Vieira De Souza>Próximo passo,
vou escrever a especificação técnica,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/540-2
00:46:35.857 --> 00:46:39.118
<v Gabriel Vieira De Souza>já dá início,
é dar início assim na especificação,</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/540-3
00:46:39.118 --> 00:46:43.147
<v Gabriel Vieira De Souza>mas definir hora e etc.
O Rafa pediu para mim trocar uma ideia</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/540-4
00:46:43.147 --> 00:46:46.792
<v Gabriel Vieira De Souza>com ele depois,
e aí eu consigo definir essa hora depois</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/540-5
00:46:46.792 --> 00:46:47.367
<v Gabriel Vieira De Souza>de fazer.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/542-0
00:46:47.767 --> 00:46:51.687
<v Gabriel Vieira De Souza>a especificação. Tá bom? Valeu, meu amigo.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/541-0
00:46:49.327 --> 00:46:49.727
<v Maycon Da Silva Nogueira>Sure.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/543-0
00:46:52.007 --> 00:46:52.607
<v Maycon Da Silva Nogueira>Hello!</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/544-0
00:46:53.447 --> 00:46:54.007
<v Gabriel Vieira De Souza>Tchau, tchau.</v>

8e6b48b1-e73b-48b4-b800-97065696ee59/546-0
00:46:54.127 --> 00:46:54.607
<v Maycon Da Silva Nogueira>Chuck Chuck.</v>
```

</details>
