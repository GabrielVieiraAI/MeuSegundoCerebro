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

# Primeira Reunião com Consultores – Alinhamento Técnico DEL-R2R-009

⬅️ [[00 - Identificação da Solicitação e Sumário|Sumário da Demanda]] | 📄 [[03 - Detalhamento para Desenvolvimento|Detalhamento para Desenvolvimento]]

---

## 📌 Visão Geral da Reunião
* **Data:** 22/10/2026
* **Participantes:** 
  * **Gabriel Vieira de Souza** (Desenvolvedor ABAP)
  * **Karina Rangel da Costa** (Consultora Funcional / Lead)
  * **Maycon da Silva Nogueira** (Consultor Funcional / Especialista da Solução)
* **Objetivo:** Alinhar requisitos técnicos e regras de negócio do delta [[00 - Identificação da Solicitação e Sumário|DEL-R2R-009]] (Bloqueio e Desbloqueio Massivo de Clientes Inadimplentes) da Veiling Holambra, esclarecendo dúvidas sobre a arquitetura da solução, hierarquia de parceiros e escopo de automação.

---

## 📋 Resumo dos Tópicos Discutidos

### 1. Origem da Especificação e Situação do BPDD
* O desenho da solução (*Realize*) foi originalmente elaborado diretamente pela SAP em fases anteriores do projeto.
* A especificação formal (BPDD — *Business Process Design Document*, em formato de apresentação PowerPoint SAP.DPS.RLZ.ADC.R2R-009.FIAR-Bloq_Desbloq_Inad_v1.pptx) mesclou propositalmente conceitos técnicos com termos adaptados para a aprovação com a área de negócios e usuários-chave (*Key Users*).
* Por esse motivo, algumas terminologias (como a menção a um *Job* diário de identificação e bloqueio/desbloqueio) permaneceram no material formal mesmo após a simplificação técnica decidida pela equipe.

### 2. Regra de Negócio e Operação do Usuário
* **Sem Bloqueio Automático:** A usuária-chave (*Key User*, Silvana) rejeitou a execução de bloqueios automáticos sem intervenção humana. A operação exigida é a exibição diária de uma lista no aplicativo SAP Fiori (*List Report*) para que o usuário avalie as propostas e execute as ações em massa (**Bloquear** informando o motivo, ou **Desbloquear**).
* **Hierarquia Matriz e Filiais (BP de Origem):** As filiais da Veiling Holambra não possuem conta/perfil de crédito próprio. O controle de crédito (função UKM000) é centralizado exclusivamente na **Matriz**.
  * Se uma filial acumular títulos em aberto vencidos, ela será exibida como **BP de Origem** para fins de rastreabilidade, mas o bloqueio e o motivo de crédito são aplicados diretamente no BP da **Matriz**.

### 3. Integração e Fontes de Dados
* **Partidas em Aberto:** A busca dos títulos vencidos deve se basear na CDS standard de Contas a Receber (**I_OperationalAcctgDocItem**), cruzando com os dados de BP (BUT100), dados gerais de crédito (UKMBP_CMS) e segmento de crédito (UKMBP_CMS_SGM).
* **Código de Empresa (CVH1):** A Veiling Holambra opera com uma única empresa contábil (CVH1). Portanto, a restrição de empresa pode ser aplicada diretamente no código.

---

## ⚖️ Decisões Tomadas na Reunião

|   #    | Tópico                                         | Dúvida / Como constava no BPDD                                                                        | Decisão Final Acordada                                                                                                                 | Impacto no Desenvolvimento                                                                                                                            |
| :----: | :--------------------------------------------- | :---------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| **01** | **Job das 02:00 vs. Leitura Dinâmica via CDS** | Constava a criação de um job em background às 02:00 para gerar propostas em uma tabela Z de trabalho. | **Eliminação do Job.** A leitura dos títulos vencidos e aplicação da régua será feita **em tempo real** via [[CDS - Core Data Services | CDS View.                                                                                                                                             |
| **02** | **Fonte de Dados de Contas a Receber**         | Definir a fonte de dados para apuração de saldo vencido há 1 dia ou mais.                             | Consumo da CDS standard de partidas em aberto de Contas a Receber: **I_OperationalAcctgDocItem**.                                      | Criar CDS View customizada baseada em I_OperationalAcctgDocItem, filtrando CompanyCode = 'CVH1' e cruzando com as tabelas de crédito FSCM.            |
| **03** | **Código de Empresa (CVH1)**                   | Avaliar se a empresa deveria ser parametrizada para prever expansão de novas empresas.                | **Fixo no código (CVH1).** Não colocar na tabela de parâmetros. Se houver nova empresa futuramente, será tratado via novo projeto.     | Filtro direto na lógica da CDS View (CompanyCode = 'CVH1').                                                                                           |
| **04** | **Tabela Z de Log de Auditoria**               | Dúvida se a tabela de log já existia no ambiente.                                                     | A tabela Z de log (ex.: ZTFI_R2R009_LOG) **não existe** e deve ser criada do zero pelo desenvolvedor no dicionário ABAP.               | Criar tabela customizada para registrar: ID único, BP, BP de origem, segmento 1000, ação (Bloqueio/Desbloqueio), motivo, status, data/hora e usuário. |


---

## 💬 Transcrição Completa da Reunião

<details>
<summary><b>📜 Clique aqui para expandir a transcrição completa (WebVTT)</b></summary>

```webvtt
WEBVTT

63594080-d5d9-4402-bf33-1e5bf438cb98/12-0
00:00:18.875 --> 00:00:22.077
<v Karina Rangel Da Costa>Explore,
a gente vai colocando as melhorias,</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/12-1
00:00:22.077 --> 00:00:26.774
<v Karina Rangel Da Costa>os clientes vai falando,
a gente vai conseguindo dialogar ali com</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/12-2
00:00:26.774 --> 00:00:29.905
<v Karina Rangel Da Costa>o cliente,
mas com esse cliente específico,</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/12-3
00:00:29.905 --> 00:00:34.673
<v Karina Rangel Da Costa>ele que o realize foi feito pela SAP,
então já veio algo imputado,</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/12-4
00:00:34.673 --> 00:00:38.515
<v Karina Rangel Da Costa>porque eles passaram por vários logos,
então a SAP é.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/11-0
00:00:35.435 --> 00:00:36.035
<v Gabriel Vieira De Souza>Mm-hmm.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/13-0
00:00:38.515 --> 00:00:42.696
<v Karina Rangel Da Costa>Entrou no meio disso,
fez o realize e a gente recebeu a</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/13-1
00:00:42.696 --> 00:00:46.951
<v Karina Rangel Da Costa>nomenclatura chamada BPDD,
que é nada mais que o escopo.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/13-2
00:00:46.951 --> 00:00:50.235
<v Karina Rangel Da Costa>Como que a gente tinha que fazer o
projeto?</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/15-0
00:00:50.875 --> 00:00:53.947
<v Gabriel Vieira De Souza>Entendi, é,
eu fiquei na dúvida dessa sigla aí,</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/14-0
00:00:51.915 --> 00:00:52.795
<v Karina Rangel Da Costa>E dentro deste.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/15-1
00:00:53.947 --> 00:00:56.955
<v Gabriel Vieira De Souza>inclusive no detalhamento que foi passado
ali,</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/15-2
00:00:56.955 --> 00:00:59.835
<v Gabriel Vieira De Souza>mas só isso daí já me esclarece muita
coisa.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/17-0
00:00:57.835 --> 00:01:02.129
<v Karina Rangel Da Costa>É isso aí,
dentro desse escopo tem os deltas,</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/17-1
00:01:02.129 --> 00:01:06.329
<v Karina Rangel Da Costa>que nada mais aí, que é a especificação,
tá?</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/16-0
00:01:04.715 --> 00:01:05.115
<v Gabriel Vieira De Souza>Okay.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/17-2
00:01:06.329 --> 00:01:13.515
<v Karina Rangel Da Costa>Só que ela é uma especificação mais
detalhada. Ela vai trazer tanto a parte.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/20-0
00:01:13.835 --> 00:01:17.930
<v Karina Rangel Da Costa>Funcional,
que para o cliente entender ali quem não</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/20-1
00:01:17.930 --> 00:01:22.105
<v Karina Rangel Da Costa>é técnico e a parte técnica que vocês vão
construir.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/18-0
00:01:19.035 --> 00:01:19.395
<v Gabriel Vieira De Souza>Mhm.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/20-2
00:01:22.105 --> 00:01:27.854
<v Karina Rangel Da Costa>Então é esse delta que o Rafael que eu
estou demonstrando e que o Rafael</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/19-0
00:01:23.835 --> 00:01:24.315
<v Gabriel Vieira De Souza>Okay.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/20-3
00:01:27.854 --> 00:01:31.555
<v Karina Rangel Da Costa>compartilhou ali no grupo,
é basicamente isso.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/24-0
00:01:31.755 --> 00:01:38.364
<v Karina Rangel Da Costa>É a parte que eu explico o que é a
necessidade do cliente e depois eu</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/24-1
00:01:38.364 --> 00:01:44.502
<v Karina Rangel Da Costa>detalho o desenho. Está bom?
Então o Maicon passou ali com eles.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/21-0
00:01:40.235 --> 00:01:40.795
<v Gabriel Vieira De Souza>Okay.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/24-2
00:01:44.502 --> 00:01:47.995
<v Karina Rangel Da Costa>É esse Delta, tá? E o que esse Delta?</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/27-0
00:01:48.075 --> 00:01:53.214
<v Karina Rangel Da Costa>Basicamente ele faz,
ele tem as ele vai ser um aplicativo</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/27-1
00:01:53.214 --> 00:01:57.467
<v Karina Rangel Da Costa>Fiori,
tá que o cliente vai poder selecionar se</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/27-2
00:01:57.467 --> 00:02:03.403
<v Karina Rangel Da Costa>vai bloquear ou não aquele cliente,
porque aquele cliente pode ser</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/27-3
00:02:03.403 --> 00:02:04.555
<v Karina Rangel Da Costa>inadimplente.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/30-0
00:02:04.635 --> 00:02:08.955
<v Karina Rangel Da Costa>Aquele cliente pode ser, pode estar, é.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/31-0
00:02:09.995 --> 00:02:13.922
<v Karina Rangel Da Costa>Como eu posso dizer,
algo com algum problema fiscal,</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/31-1
00:02:13.922 --> 00:02:19.702
<v Karina Rangel Da Costa>alguma coisa assim, ele pode bloquear, tá?
Só que a gente tem algumas regras,</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/31-2
00:02:19.702 --> 00:02:24.073
<v Karina Rangel Da Costa>então aqui o Maicon,
ele detalha o cenário do cliente, tá?</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/31-3
00:02:24.073 --> 00:02:25.555
<v Karina Rangel Da Costa>Ele fala o contexto.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/34-0
00:02:25.755 --> 00:02:31.816
<v Karina Rangel Da Costa>Hoje que é a William, ela é uma,
ela faz o comércio de flores e plantas,</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/34-1
00:02:31.816 --> 00:02:35.884
<v Karina Rangel Da Costa>não é?
E aqui no BPDD ela vai ter essa regra que</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/34-2
00:02:35.884 --> 00:02:39.620
<v Karina Rangel Da Costa>é cliente à vista e cliente a prazo.
Karina,</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/34-3
00:02:39.620 --> 00:02:44.435
<v Karina Rangel Da Costa>aonde que eu busco esses Campos falando
de forma técnica?</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/39-0
00:02:44.795 --> 00:02:49.016
<v Karina Rangel Da Costa>Não vai estar aqui,
é só um detalhe mesmo para o pessoal</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/39-1
00:02:49.016 --> 00:02:52.496
<v Karina Rangel Da Costa>entender o que a gente estava construindo,
tá?</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/39-2
00:02:52.496 --> 00:02:57.235
<v Karina Rangel Da Costa>Então o Maycon até criou também aqui como
se fosse o protótipo,</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/39-3
00:02:57.235 --> 00:03:00.715
<v Karina Rangel Da Costa>como que a gente espera esse aplicativo
Fiori.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/43-0
00:03:01.035 --> 00:03:06.445
<v Karina Rangel Da Costa>Está, é, mas a parte de Desenvolvimento,
ela vai estar mais aqui,</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/43-1
00:03:06.445 --> 00:03:13.084
<v Karina Rangel Da Costa>então ele fala o campo que você vai pegar
o cliente à vista e o cliente a prazo,</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/43-2
00:03:13.084 --> 00:03:16.035
<v Karina Rangel Da Costa>então ele não deixa só de forma ali.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/42-0
00:03:13.115 --> 00:03:13.715
<v Gabriel Vieira De Souza>Mm-hmm.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/47-0
00:03:16.395 --> 00:03:22.079
<v Karina Rangel Da Costa>É, ele coloca ali uma forma também usual,
porque o usuário precisa entender,</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/47-1
00:03:22.079 --> 00:03:26.139
<v Karina Rangel Da Costa>mas ele deixa detalhado aonde que você
vai pegar isso.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/47-2
00:03:26.139 --> 00:03:30.715
<v Karina Rangel Da Costa>É se o cliente é à vista ou se o cliente
é a prazo, está bom?</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/46-0
00:03:30.555 --> 00:03:31.035
<v Gabriel Vieira De Souza>Okay.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/48-0
00:03:31.675 --> 00:03:38.418
<v Karina Rangel Da Costa>Então é na parte aqui de requisito de
Desenvolvimento, o que nada mais é,</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/48-1
00:03:38.418 --> 00:03:45.253
<v Karina Rangel Da Costa>a gente vai selecionar os parceiros que
tem essa função dentro então desse</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/48-2
00:03:45.253 --> 00:03:48.715
<v Karina Rangel Da Costa>aplicativo aqui você só vai trazer os.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/52-0
00:03:48.875 --> 00:03:53.573
<v Karina Rangel Da Costa>Parceiros de negócio que tem a função
crédito, tá bom?</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/51-0
00:03:52.555 --> 00:03:53.155
<v Gabriel Vieira De Souza>Mm-hmm.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/52-1
00:03:53.573 --> 00:04:00.235
<v Karina Rangel Da Costa>E vai classificar se ele é à vista ou se
ele é prazo pelo esse campo, beleza?</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/57-0
00:03:59.915 --> 00:04:04.623
<v Gabriel Vieira De Souza>É, posso só tirar uma dúvida?
Eu estava até lendo esse detalhamento.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/53-0
00:04:02.035 --> 00:04:02.875
<v Karina Rangel Da Costa>Pode, love.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/57-1
00:04:04.623 --> 00:04:10.081
<v Gabriel Vieira De Souza>Eu ainda não consegui terminar de ler ele
todo não. Mas é, eu fiquei na dúvida,</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/57-2
00:04:10.081 --> 00:04:15.129
<v Gabriel Vieira De Souza>é se a empresa se VH um é um código de
dentro do SAP ou é especificou uma</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/56-0
00:04:14.395 --> 00:04:14.795
<v Karina Rangel Da Costa>É.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/57-3
00:04:15.129 --> 00:04:15.675
<v Gabriel Vieira De Souza>empresa?</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/60-0
00:04:16.075 --> 00:04:21.685
<v Karina Rangel Da Costa>É uma empresa só, é cvh,
é só o código dela mesmo, é bile online,</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/58-0
00:04:21.515 --> 00:04:21.995
<v Gabriel Vieira De Souza>I think.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/60-1
00:04:21.685 --> 00:04:28.825
<v Karina Rangel Da Costa>mas é só o código está que nós colocamos.
Mas basicamente é porque eles não vão ter</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/59-0
00:04:24.075 --> 00:04:24.475
<v Gabriel Vieira De Souza>Entendi.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/60-2
00:04:28.825 --> 00:04:33.755
<v Karina Rangel Da Costa>outro demais, eles vão ter filiais,
mas empresa é só uma.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/61-0
00:04:34.555 --> 00:04:35.035
<v Karina Rangel Da Costa>So</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/65-0
00:04:34.555 --> 00:04:38.183
<v Gabriel Vieira De Souza>É outra outra pergunta também,
ou por exemplo, é,</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/65-1
00:04:38.183 --> 00:04:42.827
<v Gabriel Vieira De Souza>eu vi ali que a gente vai precisar usar a
tabela de parâmetros.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/62-0
00:04:42.755 --> 00:04:43.115
<v Maycon Da Silva Nogueira>Mhm.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/65-2
00:04:42.827 --> 00:04:46.600
<v Gabriel Vieira De Souza>E aí tem alguns campos igual esse daí,
por exemplo,</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/63-0
00:04:43.035 --> 00:04:43.275
<v Karina Rangel Da Costa>Uh-huh.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/65-3
00:04:46.600 --> 00:04:50.155
<v Gabriel Vieira De Souza>da eu vou ter que criar ali na CDS uma
consulta.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/67-0
00:04:50.395 --> 00:04:53.357
<v Gabriel Vieira De Souza>Aí,
supondo que no futuro a ver ele queira</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/64-0
00:04:51.115 --> 00:04:51.275
<v Karina Rangel Da Costa>Uh-huh.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/67-1
00:04:53.357 --> 00:04:58.661
<v Gabriel Vieira De Souza>alterar isso daí para colocar outras
outra empresa, outro código de empresa,</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/67-2
00:04:58.661 --> 00:05:03.138
<v Gabriel Vieira De Souza>esse daí eu também tenho que colocar lá
na tabela de parâmetros,</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/66-0
00:05:00.395 --> 00:05:00.795
<v Karina Rangel Da Costa>Oh.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/67-3
00:05:03.138 --> 00:05:05.755
<v Gabriel Vieira De Souza>ou esse daí eu posso colocar hardcode.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/68-0
00:05:04.715 --> 00:05:08.871
<v Karina Rangel Da Costa>Não hard code,
porque o que é tabela de parâmetro?</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/68-1
00:05:08.871 --> 00:05:15.553
<v Karina Rangel Da Costa>Pensa o seguinte, é tabela de parâmetro.
Ela funciona para que a gente coloque as</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/68-2
00:05:15.553 --> 00:05:20.442
<v Karina Rangel Da Costa>exceções, ou exemplo,
há uma conta que vai mudar, entendeu?</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/68-3
00:05:20.442 --> 00:05:22.235
<v Karina Rangel Da Costa>Exemplo que a William.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/71-0
00:05:22.475 --> 00:05:27.446
<v Karina Rangel Da Costa>Vai e faz um, abre uma nova empresa.
Ela vai ter que entender que vai ser</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/71-1
00:05:27.446 --> 00:05:32.819
<v Karina Rangel Da Costa>contratado um novo projeto para fazer
todos os outros envolvimentos, tá? Então,</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/71-2
00:05:32.819 --> 00:05:37.252
<v Karina Rangel Da Costa>pensando em consultoria,
a gente não está chegando nesse nível de</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/69-0
00:05:33.195 --> 00:05:33.835
<v Gabriel Vieira De Souza>Entendi.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/71-3
00:05:37.252 --> 00:05:38.595
<v Karina Rangel Da Costa>tabela de parâmetro.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/74-0
00:05:38.715 --> 00:05:41.606
<v Karina Rangel Da Costa>Tá bom,
a gente tá deixando mesmo que eles</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/70-0
00:05:39.155 --> 00:05:39.675
<v Gabriel Vieira De Souza>Entendi.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/74-1
00:05:41.606 --> 00:05:45.372
<v Karina Rangel Da Costa>solicitaram,
até porque a gente tem que seguir um BPDD,</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/74-2
00:05:45.372 --> 00:05:48.465
<v Karina Rangel Da Costa>né?
E o BPDD está dizendo ali que é só aquela</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/74-3
00:05:48.465 --> 00:05:51.625
<v Karina Rangel Da Costa>empresa.
Então a gente tá chegando em nível de</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/72-0
00:05:48.715 --> 00:05:49.035
<v Gabriel Vieira De Souza>Thank you.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/74-4
00:05:51.625 --> 00:05:55.995
<v Karina Rangel Da Costa>parâmetro quando a gente faz assim,
tipo de documento, entendeu?</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/76-0
00:05:56.155 --> 00:06:00.975
<v Karina Rangel Da Costa>Que é uma coisa que pode,
eles podem acrescentar durante o projeto,</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/73-0
00:05:56.395 --> 00:05:56.995
<v Gabriel Vieira De Souza>Mm-hmm.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/76-1
00:06:00.975 --> 00:06:06.434
<v Karina Rangel Da Costa>aí sim a gente coloca na tabela de
parâmetro. Fora isso, a gente não coloca,</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/76-2
00:06:06.434 --> 00:06:07.355
<v Karina Rangel Da Costa>não está bom.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/75-0
00:06:06.875 --> 00:06:07.275
<v Gabriel Vieira De Souza>Okay.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/77-0
00:06:08.555 --> 00:06:11.662
<v Karina Rangel Da Costa>É,
então é nessa parte aqui você vai</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/77-1
00:06:11.662 --> 00:06:16.533
<v Karina Rangel Da Costa>localizar se o cliente ele é à vista ou a
prazo. Por quê?</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/77-2
00:06:16.533 --> 00:06:21.824
<v Karina Rangel Da Costa>Porque você vai ter que colocar aqui na
CDS, na nessa criação,</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/77-3
00:06:21.824 --> 00:06:23.755
<v Karina Rangel Da Costa>nessa tela e essa tela.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/81-0
00:06:23.835 --> 00:06:28.900
<v Karina Rangel Da Costa>Basicamente, é a solução do cliente.
Então, se eu se ele for,</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/78-0
00:06:27.115 --> 00:06:27.355
<v Maycon Da Silva Nogueira>W.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/81-1
00:06:28.900 --> 00:06:32.902
<v Karina Rangel Da Costa>eu tiver a necessidade de bloquear,
desbloquear,</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/81-2
00:06:32.902 --> 00:06:39.355
<v Karina Rangel Da Costa>eu vou poder ter que selecionar mais de
um, entendeu? Eu não, eu não a Karina.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/82-0
00:06:39.595 --> 00:06:43.964
<v Karina Rangel Da Costa>É, eu vou não ter essa visualização?
É não. Ele tem que ter.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/82-1
00:06:43.964 --> 00:06:48.475
<v Karina Rangel Da Costa>Ele vai poder ter mais de um.
Quer complementar algo, Michael?</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/85-0
00:06:49.115 --> 00:06:53.308
<v Maycon Da Silva Nogueira>Acho que a parte do PP de origem ali,
só pra especificar, que o William,</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/85-1
00:06:53.308 --> 00:06:55.835
<v Maycon Da Silva Nogueira>ele trabalha com bom dia primeiramente,
né?</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/84-0
00:06:56.435 --> 00:06:56.555
<v Karina Rangel Da Costa>But</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/83-0
00:06:56.475 --> 00:06:57.035
<v Gabriel Vieira De Souza>Bom dia.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/89-0
00:06:57.675 --> 00:07:03.371
<v Maycon Da Silva Nogueira>E a partir do BP de origem, o William,
ele trabalha com vários BPS dentro do</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/89-1
00:07:03.371 --> 00:07:06.773
<v Maycon Da Silva Nogueira>mesmo,
então eles essa junção de parceiros de</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/89-2
00:07:06.773 --> 00:07:09.954
<v Maycon Da Silva Nogueira>negócio.
E aí um ponto importante que eles</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/89-3
00:07:09.954 --> 00:07:12.395
<v Maycon Da Silva Nogueira>solicitaram é que esse BP, o BPC.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/90-0
00:07:12.555 --> 00:07:15.801
<v Maycon Da Silva Nogueira>Qualquer um dos BPS que tiver bloqueado
que bloqueia o outro.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/90-1
00:07:15.801 --> 00:07:20.145
<v Maycon Da Silva Nogueira>Então ali o BP de origem ele meio que é
pra identificar qual que é o BP principal.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/90-2
00:07:20.145 --> 00:07:21.035
<v Maycon Da Silva Nogueira>Acho que só isso.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/91-0
00:07:20.395 --> 00:07:23.275
<v Karina Rangel Da Costa>Está, mas aí tem na tabela, não é?</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/94-0
00:07:23.355 --> 00:07:24.355
<v Maycon Da Silva Nogueira>Bing Bing a table.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/95-0
00:07:25.035 --> 00:07:26.715
<v Karina Rangel Da Costa>Você colocou aqui?</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/96-0
00:07:27.515 --> 00:07:28.155
<v Maycon Da Silva Nogueira>Acho que sim.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/100-0
00:07:28.955 --> 00:07:32.967
<v Karina Rangel Da Costa>Está bom,
é porque vou mais ou menos assim, Gabriel,</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/100-1
00:07:32.967 --> 00:07:38.644
<v Karina Rangel Da Costa>mas o seguinte, eu sou o Carrefour, está?
Eu tenho várias matrizes, não é?</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/97-0
00:07:34.555 --> 00:07:35.155
<v Gabriel Vieira De Souza>Mm-hmm.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/98-0
00:07:37.275 --> 00:07:37.875
<v Gabriel Vieira De Souza>Mm-hmm.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/100-2
00:07:38.644 --> 00:07:42.959
<v Karina Rangel Da Costa>Eu tenho vários Carrefour da vida,
mas é só um que paga,</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/100-3
00:07:42.959 --> 00:07:45.835
<v Karina Rangel Da Costa>é só um que é que ele vai ter crédito.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/99-0
00:07:43.435 --> 00:07:43.515
<v Maycon Da Silva Nogueira>No.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/101-0
00:07:46.155 --> 00:07:50.875
<v Karina Rangel Da Costa>Então por isso que o Michael colocou aqui
o nome VP de origem, tá bom?</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/105-0
00:07:50.555 --> 00:07:55.670
<v Gabriel Vieira De Souza>É, deixa eu só falar o que eu entendi,
que aí qualquer coisa vocês me corrigem,</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/102-0
00:07:55.435 --> 00:07:55.595
<v Maycon Da Silva Nogueira>Yeah.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/105-1
00:07:55.670 --> 00:07:58.547
<v Gabriel Vieira De Souza>tá?
Eu vou usar o mesmo exemplo do Carrefour</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/103-0
00:07:55.915 --> 00:07:55.995
<v Karina Rangel Da Costa>Uh-huh.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/105-2
00:07:58.547 --> 00:08:01.361
<v Gabriel Vieira De Souza>aí.
Então eu tenho um Carrefour matriz e eu</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/105-3
00:08:01.361 --> 00:08:05.964
<v Gabriel Vieira De Souza>tenho outros 10 Carrefour espalhados.
Então se eu entendi, por exemplo,</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/104-0
00:08:04.795 --> 00:08:04.875
<v Karina Rangel Da Costa>Uh-huh.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/105-4
00:08:05.964 --> 00:08:06.795
<v Gabriel Vieira De Souza>um Carrefour.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/106-0
00:08:06.955 --> 00:08:11.767
<v Gabriel Vieira De Souza>É, está com débito? É ao.
Se uma filial está ali devendo algo,</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/106-1
00:08:11.767 --> 00:08:15.968
<v Gabriel Vieira De Souza>ou seja, está inadimplente,
ela tem que ser bloqueada.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/106-2
00:08:15.968 --> 00:08:20.322
<v Gabriel Vieira De Souza>Pelo que entendi,
vai ter uma job também que vai rodar 2</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/106-3
00:08:20.322 --> 00:08:22.155
<v Gabriel Vieira De Souza>horas da manhã, além do.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/108-0
00:08:22.635 --> 00:08:26.752
<v Gabriel Vieira De Souza>Do aplicativo,
então ela vai ter que ser bloqueada e aí</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/107-0
00:08:26.235 --> 00:08:29.995
<v Karina Rangel Da Costa>Não, as filiais nem tem, não,
as filiais não tem crédito.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/108-1
00:08:26.752 --> 00:08:30.795
<v Gabriel Vieira De Souza>quando bloqueia ela,
eu bloqueio na verdade OA matriz.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/112-0
00:08:31.355 --> 00:08:37.214
<v Karina Rangel Da Costa>As filiais não tem crédito.
Quem vai ter crédito sempre é a matriz,</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/109-0
00:08:33.515 --> 00:08:34.395
<v Gabriel Vieira De Souza>Ah, entendi.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/112-1
00:08:37.214 --> 00:08:41.091
<v Karina Rangel Da Costa>entendeu?
Então eu vou bloquear só a matriz,</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/110-0
00:08:37.755 --> 00:08:38.155
<v Maycon Da Silva Nogueira>Yes.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/111-0
00:08:37.835 --> 00:08:38.315
<v Gabriel Vieira De Souza>Entendi.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/112-2
00:08:41.091 --> 00:08:45.140
<v Karina Rangel Da Costa>entendeu?
Então aqui para você vai aparecer AO</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/112-3
00:08:45.140 --> 00:08:47.035
<v Karina Rangel Da Costa>cliente matriz e aqui.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/113-0
00:08:47.275 --> 00:08:51.355
<v Karina Rangel Da Costa>Vai aparecer o BP original, que é a.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/114-0
00:08:50.555 --> 00:08:52.315
<v Gabriel Vieira De Souza>UBP original seria filial.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/115-0
00:08:52.795 --> 00:08:53.435
<v Karina Rangel Da Costa>Exact.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/116-0
00:08:53.635 --> 00:08:53.995
<v Maycon Da Silva Nogueira>Mhm.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/117-0
00:08:54.075 --> 00:08:54.395
<v Gabriel Vieira De Souza>That.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/120-0
00:08:55.275 --> 00:08:58.739
<v Karina Rangel Da Costa>Entendeu?
E aí você sempre vai bloquear a matriz,</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/120-1
00:08:58.739 --> 00:09:01.995
<v Karina Rangel Da Costa>porque a filial nem vai ter crédito,
entendeu?</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/118-0
00:08:59.435 --> 00:08:59.835
<v Gabriel Vieira De Souza>Okay.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/119-0
00:09:02.235 --> 00:09:02.835
<v Gabriel Vieira De Souza>Mm-hmm.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/121-0
00:09:04.075 --> 00:09:04.555
<v Gabriel Vieira De Souza>Entendi.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/122-0
00:09:04.315 --> 00:09:05.115
<v Karina Rangel Da Costa>Beleza.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/123-0
00:09:06.155 --> 00:09:09.627
<v Karina Rangel Da Costa>É aí o detalhamento,
você quer falar alguma coisa, Maicon?</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/123-1
00:09:09.627 --> 00:09:13.275
<v Karina Rangel Da Costa>Porque Eu Acredito que é mais quando ele
for construir mesmo.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/126-0
00:09:13.795 --> 00:09:17.197
<v Maycon Da Silva Nogueira>Acho que deixar ele tentar ler e ver se
traz dúvidas para gente,</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/126-1
00:09:17.197 --> 00:09:18.715
<v Maycon Da Silva Nogueira>qualquer coisa a gente volta.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/127-0
00:09:19.355 --> 00:09:25.595
<v Karina Rangel Da Costa>É, eu acho que seria melhor dessa forma,
Gabriel, o que você acha?</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/134-0
00:09:25.755 --> 00:09:30.795
<v Gabriel Vieira De Souza>É, eu tenho uma dúvida, é igual eu falei,
eu não. Eu comecei a ler,</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/128-0
00:09:28.075 --> 00:09:28.275
<v Karina Rangel Da Costa>No.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/134-1
00:09:30.795 --> 00:09:35.390
<v Gabriel Vieira De Souza>mas eu não li tudo.
Até mesmo porque é bastante conteúdo e eu</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/129-0
00:09:31.995 --> 00:09:32.075
<v Karina Rangel Da Costa>Uh-huh.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/132-0
00:09:35.115 --> 00:09:35.515
<v Maycon Da Silva Nogueira>Mhm.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/134-2
00:09:35.390 --> 00:09:37.835
<v Gabriel Vieira De Souza>recebi ontem, no final do dia, é.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/133-0
00:09:37.115 --> 00:09:37.595
<v Karina Rangel Da Costa>Tá.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/137-0
00:09:39.035 --> 00:09:44.523
<v Gabriel Vieira De Souza>Mas uma dúvida é referente à tabela de
log, não é que tem que ser criada,</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/135-0
00:09:42.875 --> 00:09:43.355
<v Karina Rangel Da Costa>Uh-huh.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/137-1
00:09:44.523 --> 00:09:49.195
<v Gabriel Vieira De Souza>é essa tabela de log já existe ou eu
tenho que criá-la, não é?</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/136-0
00:09:49.275 --> 00:09:49.915
<v Maycon Da Silva Nogueira>SZ.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/138-0
00:09:50.795 --> 00:09:51.195
<v Gabriel Vieira De Souza>Oi.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/139-0
00:09:50.795 --> 00:09:51.355
<v Karina Rangel Da Costa>Desi.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/140-0
00:09:51.675 --> 00:09:53.115
<v Maycon Da Silva Nogueira>Quer dizer, é criado.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/144-0
00:09:53.635 --> 00:09:56.235
<v Gabriel Vieira De Souza>criar né show entendi</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/141-0
00:09:54.755 --> 00:09:55.115
<v Maycon Da Silva Nogueira>Mhm.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/145-0
00:09:57.515 --> 00:09:57.595
<v Maycon Da Silva Nogueira>K.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/146-0
00:09:59.995 --> 00:10:00.155
<v Gabriel Vieira De Souza>With.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/147-0
00:10:13.355 --> 00:10:13.995
<v Gabriel Vieira De Souza>Entendi.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/150-0
00:10:14.075 --> 00:10:18.989
<v Karina Rangel Da Costa>É esse Delta,
esse Delta nada mais é do que eu ter uma</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/150-1
00:10:18.989 --> 00:10:23.545
<v Karina Rangel Da Costa>tela Fiori,
aonde que eu vou poder selecionar o os</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/150-2
00:10:23.545 --> 00:10:30.155
<v Karina Rangel Da Costa>clientes que estão inadimplente,
bloquear e desbloquear. Isso seria essa.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/153-0
00:10:30.235 --> 00:10:34.888
<v Karina Rangel Da Costa>Esse Delta está que seria uma
especificação.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/151-0
00:10:31.995 --> 00:10:32.235
<v Gabriel Vieira De Souza>It.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/153-1
00:10:34.888 --> 00:10:41.195
<v Karina Rangel Da Costa>A parte da classe aqui é vai ter
automatização ou o Michael?</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/155-0
00:10:42.155 --> 00:10:44.715
<v Karina Rangel Da Costa>Não vai ter não, né? Ou vai ter?</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/154-0
00:10:44.555 --> 00:10:44.795
<v Maycon Da Silva Nogueira>Mm.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/160-0
00:10:46.635 --> 00:10:51.115
<v Maycon Da Silva Nogueira>Não lembro. Calma, acho que vai.
Qual que é? Desculpa de novo.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/159-0
00:10:46.795 --> 00:10:50.555
<v Karina Rangel Da Costa>Vai ter, acho que vai ter, I.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/161-0
00:10:51.915 --> 00:10:52.315
<v Karina Rangel Da Costa>Hey.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/166-0
00:10:53.355 --> 00:10:58.392
<v Karina Rangel Da Costa>Vai ter. Então vamos lá.
Eu tenho um cadastro de BP,</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/162-0
00:10:55.595 --> 00:10:55.755
<v Maycon Da Silva Nogueira>E.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/166-1
00:10:58.392 --> 00:11:04.475
<v Karina Rangel Da Costa>está o Gabriel e eu sou a vista.
Eu tenho um título que venceu.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/163-0
00:10:59.355 --> 00:10:59.955
<v Gabriel Vieira De Souza>Mm-hmm.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/167-0
00:11:05.595 --> 00:11:12.891
<v Karina Rangel Da Costa>A tipo assim, eu tenho um titular venceu,
ele vai bloquear automaticamente,</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/167-1
00:11:12.891 --> 00:11:13.755
<v Karina Rangel Da Costa>entendeu?</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/168-0
00:11:14.955 --> 00:11:18.942
<v Karina Rangel Da Costa>É a Karina,
eu tenho um cliente que ele é a prazo,</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/168-1
00:11:18.942 --> 00:11:24.883
<v Karina Rangel Da Costa>então ele tem que olhar essa tabela.
E aí esse é o job de log que o Michael</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/168-2
00:11:24.883 --> 00:11:28.635
<v Karina Rangel Da Costa>falou, entendeu?
Que vai ter que olhar e fazer.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/170-0
00:11:29.835 --> 00:11:33.315
<v Gabriel Vieira De Souza>Eu tenho, desculpa, pode falar,
pode terminar.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/169-0
00:11:29.995 --> 00:11:31.995
<v Karina Rangel Da Costa>Mas pode falar.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/173-0
00:11:33.995 --> 00:11:37.531
<v Karina Rangel Da Costa>Não é basicamente é isso. É porque,
tipo assim, é,</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/173-1
00:11:37.531 --> 00:11:43.286
<v Karina Rangel Da Costa>eu tenho que falar mais ou menos como que
é para você entender, para porque assim,</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/173-2
00:11:43.286 --> 00:11:48.347
<v Karina Rangel Da Costa>se eu passar aqui slide a slide,
eu acho que não vai ficar tão objetivo,</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/173-3
00:11:48.347 --> 00:11:48.555
<v Karina Rangel Da Costa>né?</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/176-0
00:11:48.875 --> 00:11:55.784
<v Karina Rangel Da Costa>Mas o contexto do é de Desenvolvimento é
o que eu ter uma tela que eu vou ter</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/176-1
00:11:55.784 --> 00:12:01.895
<v Karina Rangel Da Costa>todos os meus clientes que são crédito,
tá que eles vão ter crédito,</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/176-2
00:12:01.895 --> 00:12:03.755
<v Karina Rangel Da Costa>só que um pode ser a.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/178-0
00:12:03.995 --> 00:12:08.413
<v Karina Rangel Da Costa>É o perfil à vista,
outro pode ser o perfil a prazo.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/177-0
00:12:08.395 --> 00:12:08.995
<v Gabriel Vieira De Souza>Mm-hmm.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/178-1
00:12:08.413 --> 00:12:12.414
<v Karina Rangel Da Costa>E aí o que acontece?
Esses esses que vão estar,</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/178-2
00:12:12.414 --> 00:12:16.915
<v Karina Rangel Da Costa>que vão estar selecionado,
vão estar como essa opção,</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/178-3
00:12:16.915 --> 00:12:19.915
<v Karina Rangel Da Costa>eles vão ter esse job que vai rodar.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/180-0
00:12:20.635 --> 00:12:26.140
<v Karina Rangel Da Costa>Que vai já deixar bloqueado ou
desbloqueado, tá?</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/179-0
00:12:25.955 --> 00:12:26.555
<v Gabriel Vieira De Souza>Mm-hmm.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/180-1
00:12:26.140 --> 00:12:31.195
<v Karina Rangel Da Costa>E os que tiver 5 ali não vai acontecer
nada.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/182-0
00:12:32.235 --> 00:12:32.875
<v Karina Rangel Da Costa>Beleza.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/181-0
00:12:32.475 --> 00:12:32.795
<v Gabriel Vieira De Souza>Yeah.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/186-0
00:12:33.595 --> 00:12:37.195
<v Maycon Da Silva Nogueira>A gente excluiu ele do job,
aí só uma coisa,</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/183-0
00:12:36.475 --> 00:12:37.595
<v Karina Rangel Da Costa>Isso.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/186-1
00:12:37.195 --> 00:12:42.155
<v Maycon Da Silva Nogueira>não é um bloqueio automático,
ele puxa para o aplicativo para</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/184-0
00:12:38.235 --> 00:12:38.475
<v Gabriel Vieira De Souza>Danger.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/186-2
00:12:42.155 --> 00:12:46.555
<v Maycon Da Silva Nogueira>apresentar naquela tela que a Karina
estava mostrando.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/185-0
00:12:45.675 --> 00:12:46.555
<v Karina Rangel Da Costa>Is.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/187-0
00:12:47.035 --> 00:12:49.355
<v Gabriel Vieira De Souza>Ah, isso daí é um diretórico.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/196-0
00:12:48.235 --> 00:12:53.310
<v Maycon Da Silva Nogueira>A seleção do bloqueio vai ser tudo eles
que querem escolher quando bloquear ou</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/196-1
00:12:53.310 --> 00:12:56.265
<v Maycon Da Silva Nogueira>não,
mas aí a gente roda esse job para trazer</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/196-2
00:12:56.265 --> 00:13:00.955
<v Maycon Da Silva Nogueira>a sugestão de quais são os que deveriam
ser bloqueados ou desbloqueados.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/192-0
00:12:59.355 --> 00:12:59.835
<v Karina Rangel Da Costa>Is that?</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/199-0
00:13:01.595 --> 00:13:04.723
<v Gabriel Vieira De Souza>Então,
pera aí que talvez aí já bugou a minha</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/195-0
00:13:01.755 --> 00:13:02.075
<v Karina Rangel Da Costa>Do that.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/199-1
00:13:04.723 --> 00:13:08.055
<v Gabriel Vieira De Souza>mente.
Eu tinha entendido que o job também faria</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/197-0
00:13:05.915 --> 00:13:06.235
<v Maycon Da Silva Nogueira>Yeah.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/199-2
00:13:08.055 --> 00:13:09.755
<v Gabriel Vieira De Souza>bloqueios automáticos. É.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/198-0
00:13:08.955 --> 00:13:09.515
<v Maycon Da Silva Nogueira>Não.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/201-0
00:13:09.355 --> 00:13:12.284
<v Karina Rangel Da Costa>Não,
é essa automatização que a gente entrou,</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/200-0
00:13:10.875 --> 00:13:11.475
<v Maycon Da Silva Nogueira>S S.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/201-1
00:13:12.284 --> 00:13:15.595
<v Karina Rangel Da Costa>tentou trazer e eles não aprovaram.
Fala a verdade.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/204-0
00:13:16.075 --> 00:13:18.836
<v Maycon Da Silva Nogueira>A Silvana Silvana aqui é a nossa,
nossa key user,</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/204-1
00:13:18.836 --> 00:13:23.418
<v Maycon Da Silva Nogueira>ela quer ter esse aplicativo na cara dela
e aí ela vai pegar ela todo dia de manhã</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/204-2
00:13:23.418 --> 00:13:26.840
<v Maycon Da Silva Nogueira>e vai olhar, olha só,
tem um cliente que foi que tá atrasado,</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/204-3
00:13:26.840 --> 00:13:29.435
<v Maycon Da Silva Nogueira>que é aquele o primeiro linha ali,
o final 31.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/205-0
00:13:29.835 --> 00:13:33.628
<v Maycon Da Silva Nogueira>A floricultura está atrasada,
eles não pagaram e eu devo bloquear.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/205-1
00:13:33.628 --> 00:13:37.025
<v Maycon Da Silva Nogueira>Aí está ali a situação do bloqueio,
está como desbloqueado.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/205-2
00:13:37.025 --> 00:13:41.441
<v Maycon Da Silva Nogueira>Então ela viu que está atrasado e ela
quer bloquear. Aí ela vai falar beleza.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/205-3
00:13:41.441 --> 00:13:44.555
<v Maycon Da Silva Nogueira>Aí ela clica ali no botãozinho que está
seleção e vai.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/206-0
00:13:44.995 --> 00:13:48.825
<v Maycon Da Silva Nogueira>Clicar no desbloquear é isso que eles
querem, só que fazer isso para vários.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/206-1
00:13:48.825 --> 00:13:51.063
<v Maycon Da Silva Nogueira>Então ele vai rodar uma sugestão para
todos,</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/206-2
00:13:51.063 --> 00:13:53.450
<v Maycon Da Silva Nogueira>vai pegar todos os que deveriam ser
bloqueados,</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/206-3
00:13:53.450 --> 00:13:56.533
<v Maycon Da Silva Nogueira>vai sugerir na tela do usuário,
o usuário vai pegar e clicar.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/206-4
00:13:56.533 --> 00:13:59.915
<v Maycon Da Silva Nogueira>Esse daqui está bloqueado e deveria ser
desbloqueado ou vice-versa.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/207-0
00:14:00.155 --> 00:14:01.675
<v Maycon Da Silva Nogueira>É isso que o aplicativo tem que fazer.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/208-0
00:14:02.635 --> 00:14:06.460
<v Gabriel Vieira De Souza>Tá, é só uma dúvida aqui que gerou,
então a job,</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/208-1
00:14:06.460 --> 00:14:12.391
<v Gabriel Vieira De Souza>ela vai fazer e vai rodar lá 2 horas da
manhã e vai listar ali quais são as</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/208-2
00:14:12.391 --> 00:14:18.635
<v Gabriel Vieira De Souza>indicações para bloquear e quais são as
que estão disponíveis para desbloquear.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/209-0
00:14:19.755 --> 00:14:19.795
<v Gabriel Vieira De Souza>A.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/210-0
00:14:21.515 --> 00:14:23.835
<v Gabriel Vieira De Souza>Aí a minha pergunta é, é?</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/212-0
00:14:25.915 --> 00:14:30.075
<v Gabriel Vieira De Souza>Pera aí, pera aí, deixa eu só tentando,
tô só tentando.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/211-0
00:14:26.075 --> 00:14:27.195
<v Karina Rangel Da Costa>Tem uma CDS.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/213-0
00:14:30.875 --> 00:14:30.955
<v Maycon Da Silva Nogueira>No.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/214-0
00:14:30.995 --> 00:14:32.955
<v Gabriel Vieira De Souza>Formular a pergunta para que fique claro.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/215-0
00:14:36.715 --> 00:14:41.087
<v Gabriel Vieira De Souza>Tá, eu vou fazer a CDS,
que vai trazer todas essas informações</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/215-1
00:14:41.087 --> 00:14:44.834
<v Gabriel Vieira De Souza>filtrando.
E não está fazendo muito sentido para mim.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/215-2
00:14:44.834 --> 00:14:50.524
<v Gabriel Vieira De Souza>É ter que fazer essa job 2 horas da manhã.
Por que que ele não faz no momento que</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/215-3
00:14:50.524 --> 00:14:52.675
<v Gabriel Vieira De Souza>ele abre a tela? Ele chama CDS.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/217-0
00:14:53.035 --> 00:14:56.038
<v Maycon Da Silva Nogueira>Pode fazer isso, tá?
Acho que a gente teve uma discussão.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/216-0
00:14:53.355 --> 00:14:53.835
<v Gabriel Vieira De Souza>And you.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/217-1
00:14:56.038 --> 00:14:58.574
<v Maycon Da Silva Nogueira>Eu só não.
Eu não acho que eu achei que eu tinha</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/217-2
00:14:58.574 --> 00:15:01.939
<v Maycon Da Silva Nogueira>trocado em todos os pontos,
mas aparentemente não pode ser dessa</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/217-3
00:15:01.939 --> 00:15:05.355
<v Maycon Da Silva Nogueira>forma sim, tá? A A CDS,
os pontos que ainda estão falando de job,</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/217-4
00:15:05.355 --> 00:15:07.943
<v Maycon Da Silva Nogueira>eu acho que eu só não atualizei por algum
motivo.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/217-5
00:15:07.943 --> 00:15:09.755
<v Maycon Da Silva Nogueira>Esse documento não está atualizado.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/220-0
00:15:10.875 --> 00:15:15.521
<v Karina Rangel Da Costa>É, pode ter sido, tá?
Porque a gente teve muito problema, tá?</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/220-1
00:15:15.521 --> 00:15:20.092
<v Karina Rangel Da Costa>Gabriel, você tá entrando agora.
Esse projeto é um caos, tá?</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/220-2
00:15:20.092 --> 00:15:25.038
<v Karina Rangel Da Costa>A gente teve muito problema em relação a
provar. Então, às vezes,</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/218-0
00:15:20.795 --> 00:15:21.155
<v Gabriel Vieira De Souza>Hhh.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/219-0
00:15:24.635 --> 00:15:25.115
<v Maycon Da Silva Nogueira>Uh-huh.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/220-3
00:15:25.038 --> 00:15:28.035
<v Karina Rangel Da Costa>o que a gente pudesse, o que eu pudesse.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/222-0
00:15:28.475 --> 00:15:33.164
<v Karina Rangel Da Costa>Fazer posteriormente só com ABAP,
só porque quando você viu esse DPS</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/222-1
00:15:33.164 --> 00:15:38.396
<v Karina Rangel Da Costa>precisava passar por usuários e termos
técnico. Às vezes eles não entendiam,</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/222-2
00:15:38.396 --> 00:15:41.454
<v Karina Rangel Da Costa>então a gente ficava parado com muito
tempo,</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/221-0
00:15:39.395 --> 00:15:39.755
<v Gabriel Vieira De Souza>Sing.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/222-3
00:15:41.454 --> 00:15:44.715
<v Karina Rangel Da Costa>porque eu normalmente é o eu apresento o
Delta.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/225-0
00:15:44.795 --> 00:15:49.487
<v Karina Rangel Da Costa>O claro entende e especificação é mais
técnico mesmo, né? Então,</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/223-0
00:15:49.275 --> 00:15:49.875
<v Gabriel Vieira De Souza>Mm-hmm.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/225-1
00:15:49.487 --> 00:15:52.952
<v Karina Rangel Da Costa>como os usuários estavam lendo a
especificação,</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/225-2
00:15:52.952 --> 00:15:57.572
<v Karina Rangel Da Costa>às vezes a gente colocava algumas
nomenclaturas para facilitar,</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/225-3
00:15:57.572 --> 00:16:03.058
<v Karina Rangel Da Costa>mas pode buscar direto, entendeu? A CDS,
eu indico você pegar a do contas a</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/224-0
00:15:59.835 --> 00:16:00.555
<v Gabriel Vieira De Souza>Entendi.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/225-4
00:16:03.058 --> 00:16:03.635
<v Karina Rangel Da Costa>receber.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/226-0
00:16:04.155 --> 00:16:08.888
<v Karina Rangel Da Costa>Já direto, entendeu?
Porque dou contas a receber,</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/226-1
00:16:08.888 --> 00:16:10.875
<v Karina Rangel Da Costa>tem a as informações.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/227-0
00:16:10.955 --> 00:16:14.151
<v Gabriel Vieira De Souza>É essa CDS,
está listado o nome dela certinho aí</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/227-1
00:16:14.151 --> 00:16:15.195
<v Gabriel Vieira De Souza>nesse documento.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/229-0
00:16:15.835 --> 00:16:18.235
<v Karina Rangel Da Costa>Eu não sei, Maicon está listada.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/228-0
00:16:16.235 --> 00:16:16.275
<v Gabriel Vieira De Souza>Oh.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/230-0
00:16:17.835 --> 00:16:20.155
<v Maycon Da Silva Nogueira>No, not a certeza.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/233-0
00:16:20.875 --> 00:16:23.035
<v Karina Rangel Da Costa>Tá bom, mas se não tiver</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/240-0
00:16:21.435 --> 00:16:25.344
<v Gabriel Vieira De Souza>É porque, como eu falei,
como nesse projeto, por exemplo,</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/234-0
00:16:24.555 --> 00:16:24.795
<v Karina Rangel Da Costa>Uh-huh.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/240-1
00:16:25.344 --> 00:16:29.995
<v Gabriel Vieira De Souza>é o primeiro que eu pego,
então eu não sei de cabeça nenhuma, aí se.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/235-0
00:16:26.795 --> 00:16:27.355
<v Karina Rangel Da Costa>Uh-huh.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/239-0
00:16:29.035 --> 00:16:29.675
<v Maycon Da Silva Nogueira>It's a problem.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/238-0
00:16:29.115 --> 00:16:29.995
<v Karina Rangel Da Costa>Paulo.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/247-0
00:16:31.275 --> 00:16:37.376
<v Karina Rangel Da Costa>Mas é, eu te passo ali, não tem problema,
tá? A CDS que você vai buscar clientes,</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/247-1
00:16:37.376 --> 00:16:41.468
<v Karina Rangel Da Costa>tipo assim,
já vou buscar clientes vencidos, entendeu?</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/247-2
00:16:41.468 --> 00:16:46.675
<v Karina Rangel Da Costa>E aí você consegue visualizar.
É porque eu não estou com a VPN ligada</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/245-0
00:16:45.435 --> 00:16:45.675
<v Gabriel Vieira De Souza>Yeah.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/247-3
00:16:46.675 --> 00:16:50.395
<v Karina Rangel Da Costa>aqui, mas senão eu já pegava para você,
entendeu?</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/246-0
00:16:47.835 --> 00:16:47.915
<v Gabriel Vieira De Souza>No.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/249-0
00:16:49.315 --> 00:16:52.955
<v Maycon Da Silva Nogueira>Você consegue dar um control F preço,
pesquisa pessoas?</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/252-0
00:16:49.435 --> 00:16:53.141
<v Gabriel Vieira De Souza>Não, tranquilo, não tem problema,
não tem problema.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/248-0
00:16:52.155 --> 00:16:52.315
<v Karina Rangel Da Costa>Okay.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/252-1
00:16:53.141 --> 00:16:58.058
<v Gabriel Vieira De Souza>Você não tem problema depois você passar
lá no chat, não tá de boas.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/252-2
00:16:58.058 --> 00:17:03.046
<v Gabriel Vieira De Souza>É outra pergunta, é possível?
Então é porque assim a gente vai fechar</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/252-3
00:17:03.046 --> 00:17:06.395
<v Gabriel Vieira De Souza>aqui e é meio que o que eu vou ter para
poder.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/256-0
00:17:07.115 --> 00:17:11.820
<v Gabriel Vieira De Souza>É, se caso lembrar, vai ser lógico,
vai ter a gravação aqui e tal,</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/256-1
00:17:11.820 --> 00:17:16.876
<v Gabriel Vieira De Souza>mas o principal na minha cabeça sempre
fica a especificação, né? Então,</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/255-0
00:17:15.035 --> 00:17:15.275
<v Karina Rangel Da Costa>Uh-huh.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/256-2
00:17:16.876 --> 00:17:22.423
<v Gabriel Vieira De Souza>como essa especificação não é atualizada,
é possível me enviar a especificação</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/256-3
00:17:22.423 --> 00:17:23.195
<v Gabriel Vieira De Souza>atualizada?</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/257-0
00:17:23.675 --> 00:17:29.195
<v Gabriel Vieira De Souza>E retirando essa questão da job é e os
outros detalhes.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/261-0
00:17:27.635 --> 00:17:31.435
<v Maycon Da Silva Nogueira>deixa eu ver se lancha</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/260-0
00:17:30.635 --> 00:17:31.595
<v Karina Rangel Da Costa>Eu não sei se ela.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/262-0
00:17:33.115 --> 00:17:36.795
<v Karina Rangel Da Costa>É porque o que o Rafa mandou ali foi essa.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/268-0
00:17:37.355 --> 00:17:43.377
<v Gabriel Vieira De Souza>Eu peço isso porque é muito de acordo com
o formato que eu aprendi a trabalhar,</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/263-0
00:17:38.115 --> 00:17:38.715
<v Maycon Da Silva Nogueira>Right now.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/268-1
00:17:43.377 --> 00:17:49.249
<v Gabriel Vieira De Souza>entendeu? É no sentido de tipo assim,
eu vou pegar essa especificação e aí eu</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/268-2
00:17:49.249 --> 00:17:54.744
<v Gabriel Vieira De Souza>meio que crio uma nova especificação,
mas qual a linguagem que o Gabriel</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/266-0
00:17:49.675 --> 00:17:50.715
<v Karina Rangel Da Costa>Here, for analisar.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/268-3
00:17:54.744 --> 00:17:56.475
<v Gabriel Vieira De Souza>entende com facilidade?</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/269-0
00:17:56.955 --> 00:18:01.435
<v Gabriel Vieira De Souza>E aí ela essa nova especificação.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/267-0
00:17:57.115 --> 00:17:57.595
<v Karina Rangel Da Costa>Uh-huh.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/271-0
00:17:59.915 --> 00:18:04.875
<v Karina Rangel Da Costa>Peres de acordo? Não,
você não está errado não está, Gabriel?</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/271-1
00:18:04.875 --> 00:18:10.475
<v Karina Rangel Da Costa>É porque Delta seria Delta,
especificação seria especificação, não é?</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/271-2
00:18:10.475 --> 00:18:15.275
<v Karina Rangel Da Costa>Mas misturaram os conceitos, tá?
E foi assim com o cliente.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/270-0
00:18:12.635 --> 00:18:13.435
<v Gabriel Vieira De Souza>Tá, desculpa.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/273-0
00:18:15.515 --> 00:18:19.579
<v Karina Rangel Da Costa>E a gente entrou e não conseguiu fazer
essa mudança.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/272-0
00:18:18.875 --> 00:18:19.355
<v Gabriel Vieira De Souza>Entendi.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/273-1
00:18:19.579 --> 00:18:24.717
<v Karina Rangel Da Costa>Eu entrei também na metade do projeto,
então acabou que foi assim,</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/273-2
00:18:24.717 --> 00:18:29.394
<v Karina Rangel Da Costa>porque precisava passar pelas áreas e
pelos técnicos. Então,</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/273-3
00:18:29.394 --> 00:18:33.995
<v Karina Rangel Da Costa>algumas coisas eles questionavam,
eles pediam para a gente.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/275-0
00:18:34.315 --> 00:18:39.236
<v Karina Rangel Da Costa>mudar o nome, entendeu?
Para ficar mais fácil para eles.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/275-1
00:18:39.236 --> 00:18:45.366
<v Karina Rangel Da Costa>Aí para a gente complicou, entendeu?
Então, mas se tiver, por exemplo,</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/274-0
00:18:41.595 --> 00:18:41.915
<v Gabriel Vieira De Souza>É.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/275-2
00:18:45.366 --> 00:18:51.755
<v Karina Rangel Da Costa>a gente não pode às vezes mexer em uma
coisa que já está citada por eles.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/276-0
00:18:52.075 --> 00:18:55.385
<v Karina Rangel Da Costa>Por isso que a gente fala que quando
acontece isso,</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/276-1
00:18:55.385 --> 00:18:59.649
<v Karina Rangel Da Costa>a gente vai falar ali no chat, tipo assim,
alteração no slide tal.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/276-2
00:18:59.649 --> 00:19:04.868
<v Karina Rangel Da Costa>É isso que está acontecendo com os outros
devs, tá? Em vez de job, vai ser assim,</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/276-3
00:19:04.868 --> 00:19:07.795
<v Karina Rangel Da Costa>a gente pode falar porque o Rafa está
ciente.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/278-0
00:19:08.155 --> 00:19:12.555
<v Karina Rangel Da Costa>E a gente também está ciente, entendeu?
Então pode acontecer isso.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/277-0
00:19:10.395 --> 00:19:11.115
<v Gabriel Vieira De Souza>Não, de boa.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/280-0
00:19:13.195 --> 00:19:20.012
<v Gabriel Vieira De Souza>Show de boa, que aí se tiver alteração,
vem aqui também no negócio e faça</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/279-0
00:19:17.435 --> 00:19:18.075
<v Karina Rangel Da Costa>Uh-huh.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/280-1
00:19:20.012 --> 00:19:22.315
<v Gabriel Vieira De Souza>alteração. É, então é se.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/281-0
00:19:21.595 --> 00:19:25.195
<v Karina Rangel Da Costa>Aí, Michael, se você tiver a final,
você manda para ele.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/282-0
00:19:26.395 --> 00:19:31.775
<v Karina Rangel Da Costa>É se não tem essa parte de job e caso
tiver mesmo assim na final,</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/282-1
00:19:31.775 --> 00:19:37.971
<v Karina Rangel Da Costa>você só seleciona e fala que conforme a
gente conversou, não precisa pegar,</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/282-2
00:19:37.971 --> 00:19:39.275
<v Karina Rangel Da Costa>aí eu pego ACDS.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/284-0
00:19:40.035 --> 00:19:44.315
<v Maycon Da Silva Nogueira>Está bom, eu estou olhando aqui,
mas eu acho que tem sim. A tem a CDS,</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/284-1
00:19:44.315 --> 00:19:47.329
<v Maycon Da Silva Nogueira>mas ainda sem fala de job.
Tem a CDS no slide 21.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/284-2
00:19:47.329 --> 00:19:48.715
<v Maycon Da Silva Nogueira>E se no seu também tem.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/283-0
00:19:48.155 --> 00:19:48.395
<v Karina Rangel Da Costa>Uh-huh.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/287-0
00:19:50.355 --> 00:19:53.467
<v Maycon Da Silva Nogueira>Acho que é essa, né? É,
mas eu acho que a gente não tirou tudo</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/285-0
00:19:50.475 --> 00:19:50.795
<v Karina Rangel Da Costa>Hey.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/287-1
00:19:53.467 --> 00:19:56.728
<v Maycon Da Silva Nogueira>que tinha esse job pra gente passar logo
pelo cliente pra provar.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/287-2
00:19:56.728 --> 00:20:00.235
<v Maycon Da Silva Nogueira>Eu acho que por isso que ainda tá falando
de job, se eu não me engano.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/286-0
00:19:58.155 --> 00:19:58.755
<v Karina Rangel Da Costa>Table.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/291-0
00:20:01.075 --> 00:20:05.885
<v Karina Rangel Da Costa>Está bom aqui. Oh, está vendo?
Tem acidência? O Gabriel,</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/290-0
00:20:05.755 --> 00:20:06.155
<v Gabriel Vieira De Souza>Yeah.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/291-1
00:20:05.885 --> 00:20:12.721
<v Karina Rangel Da Costa>então você pode pegar tudo que tiver em
aberto com aquelas informações aqui. Oh,</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/291-2
00:20:12.721 --> 00:20:14.155
<v Karina Rangel Da Costa>se o cliente for.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/292-0
00:20:15.835 --> 00:20:18.875
<v Karina Rangel Da Costa>Desse aqui, a prazo, interno, entendeu?</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/293-0
00:20:19.435 --> 00:20:20.795
<v Gabriel Vieira De Souza>Entendi. Entendi.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/298-0
00:20:21.155 --> 00:20:27.131
<v Karina Rangel Da Costa>Então é isso, mas aí não precisa de job.
Aí só coloca ali no chat o Michael para</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/294-0
00:20:22.395 --> 00:20:22.555
<v Maycon Da Silva Nogueira>Okay.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/298-1
00:20:27.131 --> 00:20:32.811
<v Karina Rangel Da Costa>ele que não vai ser job eSIM a leitura
automática para ele não se perder ele</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/298-2
00:20:32.811 --> 00:20:36.795
<v Karina Rangel Da Costa>quando ele estiver fazendo a
especificação dele, não.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/300-0
00:20:37.515 --> 00:20:38.275
<v Maycon Da Silva Nogueira>Someone thank you.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/299-0
00:20:38.075 --> 00:20:38.555
<v Karina Rangel Da Costa>A ball.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/305-0
00:20:40.075 --> 00:20:44.047
<v Karina Rangel Da Costa>Mas é isso, Gabriel. E assim,
aqui a gente não tem isso não, tá?</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/305-1
00:20:44.047 --> 00:20:49.118
<v Karina Rangel Da Costa>Qualquer coisa você pode no meio daqui,
você pode chamar a gente, a gente faz, tá?</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/305-2
00:20:49.118 --> 00:20:53.028
<v Karina Rangel Da Costa>A gente não tem nada disso,
não tem nada de burocracia, não. É,</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/301-0
00:20:51.115 --> 00:20:53.275
<v Maycon Da Silva Nogueira>Nem que seja para explicar de novo,
sem problema.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/305-3
00:20:53.028 --> 00:20:57.122
<v Karina Rangel Da Costa>tá bom? Sem problema não,
porque a gente sabe que esse projeto foi</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/302-0
00:20:54.075 --> 00:20:54.475
<v Gabriel Vieira De Souza>Show.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/305-4
00:20:57.122 --> 00:20:58.955
<v Karina Rangel Da Costa>bem assim, alguns delta só foi</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/306-0
00:20:59.755 --> 00:21:02.635
<v Karina Rangel Da Costa>Foi indo e a gente,
para aprovar com o cliente,</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/306-1
00:21:02.635 --> 00:21:06.655
<v Karina Rangel Da Costa>talvez colocou alguma coisa aqui que você
acha que está desacordo,</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/306-2
00:21:06.655 --> 00:21:09.415
<v Karina Rangel Da Costa>você pode chamar a gente.
E é o que eu falei,</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/306-3
00:21:09.415 --> 00:21:13.375
<v Karina Rangel Da Costa>a gente tentou automatizar,
mas o cliente não quis porque era uma</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/306-4
00:21:13.375 --> 00:21:13.795
<v Karina Rangel Da Costa>change.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/308-0
00:21:14.395 --> 00:21:18.855
<v Karina Rangel Da Costa>E aí não foi?
Então deixa eles fazer o processo manual</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/307-0
00:21:16.715 --> 00:21:17.115
<v Gabriel Vieira De Souza>Show.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/308-1
00:21:18.855 --> 00:21:20.395
<v Karina Rangel Da Costa>deles lá, está bom?</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/313-0
00:21:20.875 --> 00:21:25.896
<v Gabriel Vieira De Souza>Show é esse ponto aqui para mim, assim,
até o momento está claro.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/313-1
00:21:25.896 --> 00:21:29.929
<v Gabriel Vieira De Souza>Eu consegui tirar as dúvidas que eu tinha
até agora.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/313-2
00:21:29.929 --> 00:21:34.037
<v Gabriel Vieira De Souza>Eu vou esperar então você mandar o novo
detalhamento,</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/310-0
00:21:30.235 --> 00:21:30.395
<v Karina Rangel Da Costa>Uh-huh.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/313-3
00:21:34.037 --> 00:21:36.395
<v Gabriel Vieira De Souza>o novo PowerPoint que aí eu já.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/312-0
00:21:34.235 --> 00:21:36.715
<v Maycon Da Silva Nogueira>Eu acho que é isso mesmo, está,
acho que é isso mesmo.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/311-0
00:21:35.035 --> 00:21:35.195
<v Karina Rangel Da Costa>Uh-huh.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/316-0
00:21:37.755 --> 00:21:39.675
<v Karina Rangel Da Costa>É esse mesmo, é esse mesmo.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/314-0
00:21:37.915 --> 00:21:38.235
<v Gabriel Vieira De Souza>Okay.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/315-0
00:21:38.795 --> 00:21:39.395
<v Maycon Da Silva Nogueira>Mm-hmm.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/317-0
00:21:39.275 --> 00:21:40.315
<v Gabriel Vieira De Souza>Esse é o final.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/319-0
00:21:40.715 --> 00:21:41.835
<v Karina Rangel Da Costa>É, esse é o final.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/318-0
00:21:40.795 --> 00:21:41.035
<v Maycon Da Silva Nogueira>Okay.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/320-0
00:21:42.555 --> 00:21:45.275
<v Gabriel Vieira De Souza>Está, então eu vou,
eu já tenho esse daqui.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/322-0
00:21:43.835 --> 00:21:49.802
<v Karina Rangel Da Costa>Só vai é ele só. Ele só vai mandar.
Ele só vai mandar para você que não</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/322-1
00:21:49.802 --> 00:21:55.355
<v Karina Rangel Da Costa>precisa fazer por job. Pode fazer já,
tá bom? Refletir nessa aham.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/321-0
00:21:50.395 --> 00:21:51.195
<v Gabriel Vieira De Souza>No, but at that.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/329-0
00:21:52.955 --> 00:21:57.288
<v Gabriel Vieira De Souza>Só direto a tela, tá?
Eu vou então só terminar de ler e tal.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/323-0
00:21:56.555 --> 00:21:57.275
<v Karina Rangel Da Costa>Are you?</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/329-1
00:21:57.288 --> 00:22:01.196
<v Gabriel Vieira De Souza>Qualquer dúvida que eu tenho lá,
eu mando ali no chat.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/324-0
00:21:58.635 --> 00:21:58.755
<v Karina Rangel Da Costa>Yes.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/329-2
00:22:01.196 --> 00:22:07.092
<v Gabriel Vieira De Souza>Se não for possível tirar ali pelo chat,
a gente ou agenda uma reunião ou se vocês</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/327-0
00:22:05.595 --> 00:22:07.675
<v Karina Rangel Da Costa>A gente fala, sei.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/329-3
00:22:07.092 --> 00:22:10.075
<v Gabriel Vieira De Souza>tiverem disponível, a gente faz rapidinho.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/328-0
00:22:10.715 --> 00:22:11.115
<v Maycon Da Silva Nogueira>Santos.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/331-0
00:22:10.715 --> 00:22:15.718
<v Karina Rangel Da Costa>É, a gente faz, fechou. Não precisa ficar,
tem que ouvir a gravação. Não,</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/331-1
00:22:15.718 --> 00:22:20.315
<v Karina Rangel Da Costa>a gente não tem isso não.
A gente entra com vocês e fala, está bom?</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/330-0
00:22:18.195 --> 00:22:18.395
<v Gabriel Vieira De Souza>So.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/332-0
00:22:20.795 --> 00:22:21.675
<v Gabriel Vieira De Souza>Então tá joia.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/333-0
00:22:22.395 --> 00:22:23.995
<v Karina Rangel Da Costa>Obrigada, viu Gabriel?</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/334-0
00:22:23.435 --> 00:22:25.755
<v Gabriel Vieira De Souza>You can agradece, a you, ciao.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/335-0
00:22:24.835 --> 00:22:26.715
<v Maycon Da Silva Nogueira>Obrigado, gente. Tchau, tchau.</v>

63594080-d5d9-4402-bf33-1e5bf438cb98/337-0
00:22:26.075 --> 00:22:27.435
<v Karina Rangel Da Costa>Okay, tchau, tchau.</v>
```

</details>
