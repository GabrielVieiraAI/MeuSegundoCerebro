---
tags:
  - projeto
  - insi
  - veiling-holambra
  - sap
  - fi
  - del-com-165
  - reuniao
id_demanda: "DEL-COM-165"
tipo: reuniao
data: 2026-11-10
aliases:
  - "Primeira reunião com consultores"
---

# 01 Reunião com Consultores – Alinhamento Técnico DEL-COM-165

📋 [[Consolidado de decisões tomadas em todas as reuniões|Consolidado de Decisões]] | 📄 [[01 - Especificação Funcional (Visão da Solução)|Especificação Funcional]]

---

## 📌 Visão Geral da Reunião
* **Data:** `10/11/2026`
* **Participantes:**
  * **Gabriel Vieira de Souza** (Desenvolvedor ABAP)
  * **Fabricio Pereira Santana** (Consultor Funcional FI — autor do DPS e da EF preliminar)
  * **Matheus Freitas dos Santos** (Desenvolvedor ABAP)
* **Objetivo:** Alinhar requisitos técnicos e regras de negócio do delta `DEL-COM-165` (Carga Massiva de Lançamentos de Taxas com Razão Especial) da Veiling Holambra, esclarecendo dúvidas levantadas na leitura do DPS (*Desenho de Proposta de Solução*, a apresentação PowerPoint aprovada pelo cliente).

---

## 📋 Resumo dos Tópicos Discutidos

### 1. Por que um desenvolvimento e não o app standard
* Já existe um aplicativo standard da SAP para carga de lançamentos contábeis em massa (*Carregar lançamentos contábeis*), mas ele **não possui o campo de Código de Razão Especial** (*Special G/L Indicator* — indicador que desvia o lançamento do fornecedor para uma conta contábil específica). Por isso a necessidade do desenvolvimento.
* No momento da importação do Excel são chamadas **duas BAPIs** (*Business Application Programming Interface* — funções standard da SAP prontas para uso externo): uma de **check** (validação/simulação, `BAPI_ACC_DOCUMENT_CHECK`) e uma de **post** (lançamento efetivo, `BAPI_ACC_DOCUMENT_POST`).

### 2. Contexto do cliente (Cooperativa, Sítio e Sócio)
* A Veiling Holambra é uma cooperativa: não compra nem vende para obter lucro. Ela cobra **taxas** dos produtores, lançadas como fatura contra o fornecedor com um código de razão especial, para que a cobrança fique separada por natureza.
* Os fornecedores são chamados de **Sítio**. Cada sítio pode ter vários **Sócios**, com percentuais de participação definidos em um campo específico do **BP** (*Business Partner* — cadastro de parceiro de negócios). Exemplo dado: taxa de R\$ 1.000 em um sítio com 50% / 25% / 25% gera R\$ 500 / R\$ 250 / R\$ 250 para cada sócio.

### 3. Dois aplicativos separados
* **App 1 – Carga:** tela inicial com a lista de cargas (*List Report*), botões de **Baixar Modelo** e **Carregar Arquivo**. Ao carregar, o sistema roda o check e navega para uma **outra tela** (tela 2 / *Object Page*) com os lançamentos, status e mensagens de erro. Segue o mesmo formato do app standard.
* **App 2 – Parametrização:** aplicativo **independente** para manter os Tipos de Movimento (tipo de documento, código de bloqueio, se a data base é obrigatória etc.).
  * O consultor indicou que os campos de **débito/crédito** que aparecem no protótipo provavelmente **não são necessários**, pois essas informações vêm do BP no momento do preenchimento. O essencial é o **bloqueio por tipo** e a **obrigatoriedade da data base**. Para contas de fornecedor, basta a **conta de reconciliação**, sem cadastrar fornecedor por fornecedor.

### 4. Tratamento de erros e reprocessamento
* Cada linha/grupo do Excel vira um lançamento. Se em uma carga um documento dá certo (ex.: R\$ 700) e outro dá erro (ex.: R\$ 200), o correto é lançado normalmente e o com erro fica pendente.
* **Erro de dado do arquivo** (centro de custo errado, data inexistente, data base obrigatória não informada): o usuário **corrige no Excel** e sobe novamente apenas o que falhou. É o mesmo comportamento do processo standard, e o consultor alinha isso com os usuários.
* **Erro externo ao arquivo** (ex.: fornecedor bloqueado no SAP): após o desbloqueio no SAP, o usuário pode usar o botão **Reprocessar**, que refaz a chamada sem alterar os dados.
* Edição dos campos direto na tela 2 foi citada como "seria bom", mas **não faz parte do que foi considerado para o cliente**.

### 5. Lançamento parcial vs. lote tudo-ou-nada
* Foi sugerido só permitir o post quando 100% das linhas passassem no check. O consultor explicou que a carga é **massiva**, com vários sítios ao mesmo tempo, e **um sítio com problema não pode impedir o lançamento dos demais**.

### 6. Mensagens de erro (slides 28 e 29)
* A maioria das mensagens listadas no DPS (ex.: "valor deve ser maior que zero") **já é retornada pela própria BAPI de check**, de forma específica.
* Não será criado catálogo de mensagens customizado para essas regras. A validação que fica sob responsabilidade do app é a do **modelo/layout do arquivo** (se o usuário subir um Excel diferente do modelo baixado, a BAPI não detecta isso), além das validações vindas da parametrização do App 2.

### 7. Arquitetura, nomes de objetos e EF
* O DPS/EF trazia nomes de objetos, CDS (*Core Data Services* — visões de dados do SAP), behaviors e até a biblioteca de leitura de Excel. O consultor esclareceu que essa definição foi exigência do projeto, mas **o ABAP tem liberdade** para escolher a melhor arquitetura. Ao final, basta repassar a tabela de objetos criados (nome técnico, camada) para o consultor atualizar a documentação.
* A EF (*Especificação Funcional*) enviada pelo consultor foi feita por ele com base no DPS, **não é padrão do projeto** (nesse projeto, a EF é o próprio DPS) e serve apenas de apoio.
* As evidências do **ambiente 710** presentes na EF apenas registram a configuração existente (ex.: códigos de razão especial). **Nada foi desenvolvido ainda.**
* A **alternativa de redução de escopo** citada no DPS (caso o cliente priorize custos) foi descartada: **tem que ser Fiori**.

### 8. Histórico das cargas (log)
* A seção de linhas do documento na tela 2 funciona como um "log" da carga. Inicialmente foi tratado como algo exibido apenas na hora, mas foi decidido que **as informações devem ser gravadas em tabela**, para que o usuário consiga voltar e consultar a situação (ex.: queda de energia no meio da importação). **Não é necessário um terceiro aplicativo** de log: a consulta é feita no próprio App 1.

### 9. Draft (rascunho) no RAP
* O DPS indicava o uso de *Draft* (rascunho: os dados ficam em uma tabela temporária até o usuário confirmar o salvamento). Matheus apontou que o App 1 não tem ações de criar/editar manualmente, apenas upload, e o consultor concordou que **o Draft não é necessário**, nem mesmo para o reprocessamento.

### 10. Premissas do DPS
* As premissas listadas no final do DPS são majoritariamente funcionais (ex.: códigos de razão especial e tipos de documento criados no ambiente). Elas impactam o sucesso nos testes, mas **não impactam diretamente o desenvolvimento**.

---

## ⚖️ Decisões Tomadas na Reunião

| # | Tópico | Dúvida / Como constava no DPS | Decisão Final Acordada | Impacto no Desenvolvimento |
| :-: | :--- | :--- | :--- | :--- |
| **01** | **Separação de Aplicativos** | Dúvida se a carga e a manutenção de parâmetros (Tipos de Movimento) ficariam na mesma tela. | Serão **2 aplicativos Fiori independentes**: App 1 de Carga e App 2 de Parametrização dos Tipos de Movimento. | Dois serviços [[RAP - ABAP RESTful Application Programming Model\|RAP]] separados: um com upload e execução das BAPIs, outro de manutenção (CRUD) dos parâmetros. |
| **02** | **Correção de Erros da Carga** | Protótipo mostrava botão "Reprocessar"; dúvida se os erros seriam corrigidos na tela do app ou no Excel. | **Erros de dado são corrigidos no Excel** e reenviados. O **Reprocessar** vale apenas para erros externos ao arquivo (ex.: fornecedor bloqueado no SAP). | Não implementar edição de campos na tela 2. Reprocessar apenas refaz a chamada das BAPIs para os documentos pendentes, com os mesmos dados. |
| **03** | **Lançamento Parcial** | Sugestão de só permitir o post quando todas as linhas passassem no check. | **Lançamento parcial permitido**: um sítio com erro não impede o lançamento dos demais. | Post feito por documento: efetiva os válidos e mantém status de erro apenas nos rejeitados. |
| **04** | **Mensagens de Erro** | Slides 28 e 29 listavam mensagens de erro detalhadas, sugerindo um catálogo customizado. | **Usar as mensagens nativas retornadas pela BAPI de check**. Não criar catálogo de mensagens para regras standard. | Exibir o retorno (`RETURN`) das BAPIs. Validações próprias apenas para o **layout/modelo do arquivo** e para as regras da parametrização do App 2. |
| **05** | **Arquitetura e Nomes de Objetos** | DPS/EF definiam nomes de objetos, CDS, behaviors e biblioteca de leitura de Excel. | **Liberdade do desenvolvedor** para definir a arquitetura. Ao final, repassar a tabela de objetos criados ao consultor. | Modelar tabelas, [[CDS - Core Data Services\|CDS]] e classes pela melhor prática/performance. Entregar inventário de objetos (nome técnico e camada) para documentação. |
| **06** | **Tecnologia da Solução** | DPS citava alternativa de redução de escopo caso o cliente priorizasse custos. | **Alternativa descartada: a solução tem que ser Fiori.** | Desenvolvimento em RAP com interface Fiori. |
| **07** | **Persistência do Histórico (Log)** | Dúvida se o resultado da carga seria apenas exibido na hora ou gravado em tabela. | **Gravar em tabela** o histórico das cargas e o resultado de cada lançamento. **Não criar um terceiro app** de log. | Tabelas de cabeçalho e itens da carga com status, mensagens e documento contábil gerado. A consulta é feita no próprio App 1 (lista de cargas e tela 2). |
| **08** | **Uso de Draft** | DPS indicava RAP com Draft. | **Draft não é necessário** no App de Carga, pois não há criação/edição manual, apenas upload e ações. | Implementar o App 1 sem Draft. A forma de implementação fica para a etapa de arquitetura. |
| **09** | **Status do Ambiente e da EF** | EF trazia evidências do ambiente 710, o que gerou dúvida se o desenvolvimento já havia começado. | **Nada foi desenvolvido.** A EF foi feita pelo consultor como apoio, não é padrão do projeto (a EF é o DPS). | Desenvolvimento começa do zero. A EF serve apenas como referência, sem obrigação de seguir. |
| **10** | **Campos Débito/Crédito na Parametrização** | Protótipo do App 2 trazia campos de débito e crédito por tipo de movimento. | Consultor indicou que **provavelmente não são necessários**: o essencial é o bloqueio por tipo e a obrigatoriedade da data base. Para fornecedor, basta a conta de reconciliação. | Avaliar na arquitetura a remoção dos campos débito/crédito do App 2, priorizando tipo de documento, bloqueio e data base obrigatória. |

---

## 🎙️ Transcrição da Reunião

<details>
<summary><b>📜 Clique aqui para expandir a transcrição completa (WebVTT)</b></summary>

```webvtt
WEBVTT

51d20ce7-9e40-428c-9800-c6a4bb5e2273/6-0
00:00:03.403 --> 00:00:06.806
<v Fabricio Pereira Santana>Esse é um aplicativo de lançamento de
fatura em massa,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/6-1
00:00:06.806 --> 00:00:10.703
<v Fabricio Pereira Santana>então hoje a gente já tem um aplicativo
standard que faz isso,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/6-2
00:00:10.703 --> 00:00:15.529
<v Fabricio Pereira Santana>só que a gente não tem, por exemplo,
campos dentro desse aplicativo de código</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/6-3
00:00:15.529 --> 00:00:16.643
<v Fabricio Pereira Santana>de razão especial.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/7-0
00:00:17.923 --> 00:00:20.501
<v Fabricio Pereira Santana>Então,
por isso que a gente está partindo para</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/7-1
00:00:20.501 --> 00:00:21.763
<v Fabricio Pereira Santana>um desenvolvimento, né?</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/8-0
00:00:23.443 --> 00:00:23.683
<v Fabricio Pereira Santana>E.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/10-0
00:00:24.763 --> 00:00:28.163
<v Fabricio Pereira Santana>Então basicamente é,
ele vai ter uns campos ali dentro do</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/10-1
00:00:28.163 --> 00:00:32.853
<v Fabricio Pereira Santana>Excel, que ele vai ter que preencher.
E aí o que que vai ser chamado na hora de</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/10-2
00:00:32.853 --> 00:00:36.019
<v Fabricio Pereira Santana>importar esse Excel?
É uma BAP de lançamento, normal,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/10-3
00:00:36.019 --> 00:00:40.182
<v Fabricio Pereira Santana>é um motor, vai ser uma BAP dele que vai,
vai, ele faz ali, tem algum.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/10-4
00:00:40.182 --> 00:00:44.403
<v Fabricio Pereira Santana>São duas BAPs na verdade, né?
Tem uma que é o check, né? E tem aqui uma</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/11-0
00:00:44.483 --> 00:00:47.123
<v Fabricio Pereira Santana>post lá para poder fazer o lançamento do
documento.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/12-0
00:00:48.403 --> 00:00:49.683
<v Fabricio Pereira Santana>É.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/13-0
00:00:50.643 --> 00:00:56.127
<v Fabricio Pereira Santana>E aí basicamente é isso, está?
Só que a gente precisa de um segundo</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/13-1
00:00:56.127 --> 00:01:00.563
<v Fabricio Pereira Santana>aplicativo,
que é onde que a gente faz é a manutenção.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/14-0
00:01:01.523 --> 00:01:05.879
<v Fabricio Pereira Santana>Tá, porque é,
acho que cada código de razão especial</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/14-1
00:01:05.879 --> 00:01:07.523
<v Fabricio Pereira Santana>ele meio que tem, é.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/15-0
00:01:08.723 --> 00:01:12.261
<v Fabricio Pereira Santana>Um valor de cota.
É isso que eu estou vendo aqui.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/15-1
00:01:12.261 --> 00:01:16.083
<v Fabricio Pereira Santana>Eu estou lendo aqui o documento aqui só
um minutinho.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/16-0
00:01:17.603 --> 00:01:21.252
<v Fabricio Pereira Santana>E aí esse aplicativo seria mesmo um
aplicativo de parâmetro para atualizar</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/16-1
00:01:21.252 --> 00:01:22.323
<v Fabricio Pereira Santana>essas cotas, entendeu?</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/17-0
00:01:24.643 --> 00:01:24.963
<v Fabricio Pereira Santana>Okay.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/19-0
00:01:35.203 --> 00:01:39.797
<v Gabriel Vieira De Souza>Queria entender um pouco,
se você pudesse falar também do contexto</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/19-1
00:01:39.797 --> 00:01:43.157
<v Gabriel Vieira De Souza>do cliente,
abordar um pouco mais do contexto do</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/19-2
00:01:43.157 --> 00:01:46.380
<v Gabriel Vieira De Souza>cliente,
porque isso ajuda a entender um pouco</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/19-3
00:01:46.380 --> 00:01:48.643
<v Gabriel Vieira De Souza>para que vai ser esse aplicativo.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/20-0
00:01:51.443 --> 00:01:57.310
<v Fabricio Pereira Santana>então é porque é o seguinte tá lá é como
é uma cooperativa eles não podem ter</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/20-1
00:01:57.310 --> 00:02:03.629
<v Fabricio Pereira Santana>nenhum capital eles não compram nem vende
nada tá então o que que eles fazem quanto</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/20-2
00:02:03.629 --> 00:02:08.443
<v Fabricio Pereira Santana>a isso tá eles pegam esse valor aí é meio
que como se fosse uma</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/21-0
00:02:08.523 --> 00:02:13.764
<v Fabricio Pereira Santana>Taxa que o cara paga para eles, entendeu?
Então eles lançam essa fatura para o cara</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/21-1
00:02:13.764 --> 00:02:16.323
<v Fabricio Pereira Santana>lá, para o fornecedor teoricamente deles.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/22-0
00:02:17.923 --> 00:02:23.824
<v Fabricio Pereira Santana>E aí eles colocam um código de razão
especial porque quando eles forem cobrar</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/22-1
00:02:23.824 --> 00:02:29.953
<v Fabricio Pereira Santana>ele tem essa taxa lá já lançada para o
cara separado por razão especial entendeu</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/22-2
00:02:29.953 --> 00:02:33.963
<v Fabricio Pereira Santana>então não é uma fatura de fornecedor
referente a uma</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/24-0
00:02:34.083 --> 00:02:38.069
<v Fabricio Pereira Santana>Compras ou qualquer outra coisa que ele
tenha feito, não.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/24-1
00:02:38.069 --> 00:02:42.879
<v Fabricio Pereira Santana>E aí tem um problema que quando ele lança
isso a nível de fornecedor,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/24-2
00:02:42.879 --> 00:02:46.865
<v Fabricio Pereira Santana>pensa o seguinte,
lá os fornecedores dele são chamados de</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/24-3
00:02:46.865 --> 00:02:49.683
<v Fabricio Pereira Santana>sítio, tá? Como se você tivesse um sítio.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/23-0
00:02:48.443 --> 00:02:48.803
<v Gabriel Vieira De Souza>Mhm.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/26-0
00:02:50.083 --> 00:02:55.026
<v Fabricio Pereira Santana>Só que dentro do sítio você tem sócios,
então ele tem que fazer essa divisão.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/25-0
00:02:54.483 --> 00:02:54.723
<v Gabriel Vieira De Souza>Mm.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/26-1
00:02:55.026 --> 00:03:00.413
<v Fabricio Pereira Santana>Por isso que esse aplicativo de parâmetro,
ele faz essa divisão para os sócios desse</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/26-2
00:03:00.413 --> 00:03:04.723
<v Fabricio Pereira Santana>sítio. Então, por exemplo,
ele lança uma taxa de R$ 1000 lá, certo?</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/31-0
00:03:05.203 --> 00:03:10.519
<v Fabricio Pereira Santana>E aí, num sítio, tem eu,
tem você e tem o Matheus, certo?</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/31-1
00:03:10.519 --> 00:03:15.743
<v Fabricio Pereira Santana>Só que nesse sítio aí,
50% de tudo que tanto que compra,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/31-2
00:03:15.743 --> 00:03:21.701
<v Fabricio Pereira Santana>que paga ou recebe é meu.
E o restante é dividido entre você e o</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/31-3
00:03:21.701 --> 00:03:22.893
<v Fabricio Pereira Santana>Matheus e 25.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/34-0
00:03:22.963 --> 00:03:28.153
<v Fabricio Pereira Santana>Por cento de cada um, entendeu? Então,
quando eu lanço um valor lá,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/34-1
00:03:28.153 --> 00:03:33.343
<v Fabricio Pereira Santana>que seja de 1000 Bernardo,
500 seria pagamento que o Fabricio teria</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/34-2
00:03:33.343 --> 00:03:37.923
<v Fabricio Pereira Santana>que fazer ou pagar,
e 250 seria seu e do Matheus, entendeu?</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/36-0
00:03:38.723 --> 00:03:41.923
<v Fabricio Pereira Santana>E isso está determinado num campo
específico lá do BP.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/35-0
00:03:39.363 --> 00:03:39.723
<v Gabriel Vieira De Souza>Okay.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/38-0
00:03:44.163 --> 00:03:51.400
<v Gabriel Vieira De Souza>Eu estou compartilhando aqui AO slide ali
que mostra mais ou menos ali AO Excel que</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/38-1
00:03:51.400 --> 00:03:53.123
<v Gabriel Vieira De Souza>tem que ser enviado.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/39-0
00:03:52.483 --> 00:03:55.466
<v Fabricio Pereira Santana>Eu não sei,
eu não sei se eu cheguei a colocar, pô,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/39-1
00:03:55.466 --> 00:03:58.163
<v Fabricio Pereira Santana>não tô conseguindo colocar,
eu tinha feito no.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/40-0
00:04:02.323 --> 00:04:04.563
<v Fabricio Pereira Santana>Como é que ficaria o aplicativo? Pera aí.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/41-0
00:04:05.403 --> 00:04:08.003
<v Gabriel Vieira De Souza>Não, não tem. Não tem protótipo dele, não.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/42-0
00:04:08.083 --> 00:04:08.803
<v Fabricio Pereira Santana>Não tem não?</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/43-0
00:04:09.443 --> 00:04:09.643
<v Gabriel Vieira De Souza>No.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/44-0
00:04:10.563 --> 00:04:11.763
<v Fabricio Pereira Santana>Você vai carregar aí.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/45-0
00:04:12.803 --> 00:04:16.803
<v Fabricio Pereira Santana>Pô, não está possível colocar. Olá,
a imagem está aparecendo.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/46-0
00:04:18.723 --> 00:04:20.643
<v Fabricio Pereira Santana>possível, tente novamente.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/47-0
00:04:28.403 --> 00:04:29.283
<v Gabriel Vieira De Souza>Martins.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/48-0
00:04:30.203 --> 00:04:32.083
<v Fabricio Pereira Santana>Have you mandei notings aí agora?</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/49-0
00:04:37.563 --> 00:04:38.963
<v Gabriel Vieira De Souza>Victor Jefferson.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/50-0
00:04:45.803 --> 00:04:51.603
<v Gabriel Vieira De Souza>Eu fiquei um pouco confuso aqui.
São dois aplicativos diferentes.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/52-0
00:04:52.643 --> 00:04:56.483
<v Fabricio Pereira Santana>São é porque um é o da carga e o outro é
o dos parâmetros.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/51-0
00:04:56.003 --> 00:04:56.163
<v Gabriel Vieira De Souza>A.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/54-0
00:05:02.963 --> 00:05:06.181
<v Fabricio Pereira Santana>Aí,
está vendo esse primeiro lista de cargas?</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/54-1
00:05:06.181 --> 00:05:09.538
<v Fabricio Pereira Santana>Nesse lista de cargas,
que é o que eu faço ali,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/53-0
00:05:07.523 --> 00:05:07.683
<v Gabriel Vieira De Souza>Uh-huh.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/54-2
00:05:09.538 --> 00:05:12.896
<v Fabricio Pereira Santana>eu verifico os lançamentos. Então,
por exemplo,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/54-3
00:05:12.896 --> 00:05:18.003
<v Fabricio Pereira Santana>eu tenho na primeira opção a lista de
carga, eu baixo o modelo do Excel.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/56-0
00:05:17.883 --> 00:05:22.556
<v Gabriel Vieira De Souza>Entendi, entendi. Então o aplicativo,
deixa eu ver se eu entendi,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/55-0
00:05:19.683 --> 00:05:20.323
<v Fabricio Pereira Santana>Entendeu?</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/56-1
00:05:22.556 --> 00:05:28.221
<v Gabriel Vieira De Souza>o cara vai ter ali clicar, baixar modelo,
que é mais ou menos esse que eu estou</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/56-2
00:05:28.221 --> 00:05:29.283
<v Gabriel Vieira De Souza>compartilhando.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/60-0
00:05:30.683 --> 00:05:35.637
<v Gabriel Vieira De Souza>Deixa eu botar aqui pra ficar mais fácil.
Ele vai lá, baixa o modelo,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/60-1
00:05:35.637 --> 00:05:40.944
<v Gabriel Vieira De Souza>preenche o modelo e aí na hora que ele
tenta fazer o lançamento, o cheque,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/60-2
00:05:40.944 --> 00:05:44.483
<v Gabriel Vieira De Souza>ele vai vir para esse list report,
digamos assim.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/57-0
00:05:44.843 --> 00:05:45.603
<v Fabricio Pereira Santana>Perfeito.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/61-0
00:05:47.203 --> 00:05:52.384
<v Gabriel Vieira De Souza>E aqui ele vai mostrar o erro e os status,
aí eu tenho uma dúvida referente ao erro,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/61-1
00:05:52.384 --> 00:05:53.603
<v Gabriel Vieira De Souza>pelo que eu entendi.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/65-0
00:05:54.803 --> 00:06:00.285
<v Gabriel Vieira De Souza>ele vai pegar o Excel aqui cada linha é
um como se fosse um lançamento E aí por</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/62-0
00:05:59.603 --> 00:06:00.203
<v Fabricio Pereira Santana>Mm-hmm.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/65-1
00:06:00.285 --> 00:06:05.972
<v Gabriel Vieira De Souza>exemplo a essa linha que deu erro mas as
outras foram feitas com sucesso aí quando</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/65-2
00:06:05.972 --> 00:06:10.563
<v Gabriel Vieira De Souza>ele tentar de novo ele vai ele pode
mandar o mesmo Excel mesmo com</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/66-0
00:06:10.683 --> 00:06:11.843
<v Gabriel Vieira De Souza>Estão com sucesso.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/68-0
00:06:14.043 --> 00:06:16.768
<v Fabricio Pereira Santana>Não, pera aí, não entendi. Vamos lá.
Ele pegou o que tava,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/67-0
00:06:15.923 --> 00:06:16.483
<v Gabriel Vieira De Souza>Three Zem.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/68-1
00:06:16.768 --> 00:06:17.923
<v Fabricio Pereira Santana>ele pegou o que deu erro.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/71-0
00:06:18.963 --> 00:06:25.623
<v Gabriel Vieira De Souza>Ele montou um Excel, baixou o template,
preencheu o template e ele mandou três</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/71-1
00:06:25.623 --> 00:06:32.535
<v Gabriel Vieira De Souza>linhas. A carga dele era de três linhas.
Uma linha deu errado e duas deram certo.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/69-0
00:06:26.723 --> 00:06:27.043
<v Fabricio Pereira Santana>Yeah.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/70-0
00:06:32.003 --> 00:06:32.083
<v Fabricio Pereira Santana>Uh-huh.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/71-2
00:06:32.535 --> 00:06:34.643
<v Gabriel Vieira De Souza>A que deram certo foi lá.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/72-0
00:06:34.803 --> 00:06:41.603
<v Gabriel Vieira De Souza>Imputada no sistema é essa que deu errado.
Ele tem que editar o Excel para mandar só</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/72-1
00:06:41.603 --> 00:06:46.083
<v Gabriel Vieira De Souza>a que deu errada,
ou ele pode mandar as que deram certo</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/72-2
00:06:46.083 --> 00:06:49.603
<v Gabriel Vieira De Souza>também.
E o sistema ele subentende ali que.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/73-0
00:06:49.763 --> 00:06:54.424
<v Fabricio Pereira Santana>Não, ele não consegue.
Ele não vai conseguir subentender, não.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/73-1
00:06:54.424 --> 00:06:59.972
<v Fabricio Pereira Santana>Então, tipo assim, é, por exemplo,
eu subi, eu estou subindo 2 linhas, tá?</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/73-2
00:06:59.972 --> 00:07:05.003
<v Fabricio Pereira Santana>E um deu errado ali, subindo 3 linhas,
uma dessas 3 ali deu errado.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/74-0
00:07:05.123 --> 00:07:08.163
<v Fabricio Pereira Santana>Que nem aí está o 700 e o 200, está vendo?</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/75-0
00:07:09.123 --> 00:07:12.260
<v Fabricio Pereira Santana>A ideia é que o 700 ele consiga lançar
ali normal.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/75-1
00:07:12.260 --> 00:07:16.627
<v Fabricio Pereira Santana>Ele vai lançar e o 200 deu erro.
Esse erro ele não consegue fazer mais</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/75-2
00:07:16.627 --> 00:07:20.503
<v Fabricio Pereira Santana>nada para ele poder fazer de novo.
Ele tem que ir lá no Excel,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/75-3
00:07:20.503 --> 00:07:23.763
<v Fabricio Pereira Santana>limpar o 700 e mandar só o 200 novamente,
tá ligado?</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/76-0
00:07:24.803 --> 00:07:27.683
<v Gabriel Vieira De Souza>E de onde você está vendo de 700 e 200?
Eu não estou vendo.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/78-0
00:07:28.683 --> 00:07:29.283
<v Fabricio Pereira Santana>Cortana.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/80-0
00:07:30.963 --> 00:07:34.563
<v Fabricio Pereira Santana>tipo tá no ó na tela 2 carga</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/85-0
00:07:36.963 --> 00:07:42.403
<v Gabriel Vieira De Souza>Aqui na no é porque eu achei que você
estava olhando no compartilhamento que eu</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/85-1
00:07:42.403 --> 00:07:43.763
<v Gabriel Vieira De Souza>estava fazendo aqui.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/86-0
00:07:43.123 --> 00:07:45.003
<v Fabricio Pereira Santana>Ah, tá, não, pera aí, calma aí, calma.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/90-0
00:07:48.483 --> 00:07:53.843
<v Fabricio Pereira Santana>Aí, oh, isso aí, oh, aí mesmo, aí mesmo,
all lá, 700 e 200, tá vendo? Oh.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/88-0
00:07:48.803 --> 00:07:49.523
<v Gabriel Vieira De Souza>Thank you.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/93-0
00:07:55.283 --> 00:07:58.789
<v Fabricio Pereira Santana>É, ele foi lançado, tá vendo?
Esse 200 é um outro lançamento,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/93-1
00:07:58.789 --> 00:08:03.255
<v Fabricio Pereira Santana>tanto que o lançamento que deu certo aí,
linha do documento um aí, o de baixo,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/93-2
00:08:03.255 --> 00:08:04.443
<v Fabricio Pereira Santana>na parte de baixo aí.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/95-0
00:08:05.443 --> 00:08:07.919
<v Fabricio Pereira Santana>Aí,
isso aí é o lançamento de do da linha</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/94-0
00:08:05.923 --> 00:08:06.243
<v Gabriel Vieira De Souza>Ohh.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/95-1
00:08:07.919 --> 00:08:08.803
<v Fabricio Pereira Santana>online de cima.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/100-0
00:08:11.003 --> 00:08:14.198
<v Fabricio Pereira Santana>Entendeu?
Tá vendo que tem até um reprocessar ali,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/96-0
00:08:12.243 --> 00:08:12.563
<v Gabriel Vieira De Souza>Yeah.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/100-1
00:08:14.198 --> 00:08:17.330
<v Fabricio Pereira Santana>mas tipo assim,
esse reprocessar não funcionaria.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/100-2
00:08:17.330 --> 00:08:22.341
<v Fabricio Pereira Santana>Eu coloquei tipo, tá, foi no protótipo,
porque esses erros de bap eu preciso ir</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/100-3
00:08:22.341 --> 00:08:24.283
<v Fabricio Pereira Santana>ajustar. Eu preciso ajustar no.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/103-0
00:08:26.403 --> 00:08:28.637
<v Fabricio Pereira Santana>Lançamento,
anão ser que os Campos fiquem ali em</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/99-0
00:08:27.123 --> 00:08:27.283
<v Gabriel Vieira De Souza>Okay.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/103-1
00:08:28.637 --> 00:08:30.963
<v Fabricio Pereira Santana>aberto,
mas eu acho que não vale a pena não, cara.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/104-0
00:08:31.283 --> 00:08:36.359
<v Gabriel Vieira De Souza>Aí esse tipo de coisa, por exemplo,
o usuário sabe disso ou a gente tem que</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/104-1
00:08:36.359 --> 00:08:38.163
<v Gabriel Vieira De Souza>informar ele no aplicativo?</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/105-0
00:08:41.443 --> 00:08:44.123
<v Fabricio Pereira Santana>Tipo de coisa o que que ele precisa in?</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/106-0
00:08:43.203 --> 00:08:47.205
<v Gabriel Vieira De Souza>Por exemplo,
ele precisa voltar lá e editar só os que</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/106-1
00:08:47.205 --> 00:08:48.243
<v Gabriel Vieira De Souza>estão errados.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/108-0
00:08:49.203 --> 00:08:53.790
<v Fabricio Pereira Santana>Não, isso aí eu consigo alinhar com eles,
porque já é um processo standard.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/108-1
00:08:53.790 --> 00:08:58.679
<v Fabricio Pereira Santana>Do mesmo jeito que se eu faço uma subida
hoje de um documento aqui, se der erro,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/107-0
00:08:57.043 --> 00:08:57.163
<v Gabriel Vieira De Souza>Yeah.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/108-2
00:08:58.679 --> 00:09:02.723
<v Fabricio Pereira Santana>eu preciso ir lá ajustar o que está dando
errado para poder subir.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/110-0
00:09:04.443 --> 00:09:10.762
<v Gabriel Vieira De Souza>Eu estou fazendo algumas perguntas mesmo
mais para poder entender que normalmente</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/109-0
00:09:10.043 --> 00:09:10.643
<v Fabricio Pereira Santana>Oh, tranquil.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/110-1
00:09:10.762 --> 00:09:16.618
<v Gabriel Vieira De Souza>eu estou acostumada a criar aplicativos
também que às vezes não são do SAP.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/110-2
00:09:16.618 --> 00:09:20.163
<v Gabriel Vieira De Souza>E aí acaba que a gente vê muitos cenários
de.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/111-0
00:09:20.243 --> 00:09:25.337
<v Gabriel Vieira De Souza>Como é que fazer o cliente só ter a opção
de usar do jeito que a gente quer mesmo,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/111-1
00:09:25.337 --> 00:09:28.283
<v Gabriel Vieira De Souza>não é? Tirar um pouco da Liberdade dele,
não é?</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/112-0
00:09:27.523 --> 00:09:31.313
<v Fabricio Pereira Santana>Agora, tipo assim,
eu não sei em nível de esforço,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/112-1
00:09:31.313 --> 00:09:35.920
<v Fabricio Pereira Santana>por exemplo, nesse caso aqui,
eu estou subindo naquele Excel.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/112-2
00:09:35.920 --> 00:09:39.859
<v Fabricio Pereira Santana>São 2 linhas.
Eu sei que a primeira vai dar sucesso,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/112-3
00:09:39.859 --> 00:09:43.203
<v Fabricio Pereira Santana>que eu importei e lançou,
a segunda dá erro.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/113-0
00:09:43.523 --> 00:09:48.870
<v Fabricio Pereira Santana>Anão ser que eu consiga ali no selecionar
o item 2 e fazer uma edição, entendeu?</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/113-1
00:09:48.870 --> 00:09:50.323
<v Fabricio Pereira Santana>Para ele poder lançar.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/114-0
00:09:49.683 --> 00:09:51.363
<v Gabriel Vieira De Souza>Não, mas aí é no Excel, né?</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/115-0
00:09:52.163 --> 00:09:56.158
<v Fabricio Pereira Santana>Então é isso, mano, no aplicativo,
se eu conseguisse fazer isso no</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/115-1
00:09:56.158 --> 00:09:59.677
<v Fabricio Pereira Santana>aplicativo, beleza,
que aí já eu acho que não funcionaria,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/115-2
00:09:59.677 --> 00:10:02.003
<v Fabricio Pereira Santana>mas eu teria que ir para o Excel mesmo.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/116-0
00:10:02.083 --> 00:10:06.194
<v Gabriel Vieira De Souza>Que o Excel é o aplicativo,
ele não vai conseguir mudar o Excel do</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/116-1
00:10:06.194 --> 00:10:08.403
<v Gabriel Vieira De Souza>computador do cliente ali, entendeu?</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/118-0
00:10:07.603 --> 00:10:11.363
<v Fabricio Pereira Santana>É isso aí,
então é então teria que o cara ajustar lá.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/117-0
00:10:10.243 --> 00:10:10.803
<v Gabriel Vieira De Souza>É.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/122-0
00:10:12.483 --> 00:10:15.249
<v Gabriel Vieira De Souza>Um ponto que eu tenho que eu estou
pensando,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/122-1
00:10:15.249 --> 00:10:19.123
<v Gabriel Vieira De Souza>eu vi ali que no documento eu tenho 2
WAPs que você sinalizou.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/120-0
00:10:16.723 --> 00:10:18.323
<v Matheus Freitas Dos Santos>O Fabricio.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/121-0
00:10:18.803 --> 00:10:19.203
<v Fabricio Pereira Santana>Okay.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/124-0
00:10:21.043 --> 00:10:28.600
<v Matheus Freitas Dos Santos>Rapidinho, mas no caso, por exemplo,
você fala de quando a pessoa importar o</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/124-1
00:10:28.600 --> 00:10:32.723
<v Matheus Freitas Dos Santos>Excel, os campos ficarem habilitados para.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/125-0
00:10:33.923 --> 00:10:35.603
<v Matheus Freitas Dos Santos>Para editar.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/126-0
00:10:36.443 --> 00:10:36.643
<v Fabricio Pereira Santana>Up.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/127-0
00:10:37.683 --> 00:10:40.181
<v Fabricio Pereira Santana>Tá, é só sugestão, por exemplo,
nesse caso aqui,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/127-1
00:10:40.181 --> 00:10:42.323
<v Fabricio Pereira Santana>tá vendo que ele deu fornecedor bloqueado?</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/128-0
00:10:43.043 --> 00:10:43.203
<v Matheus Freitas Dos Santos>Uh-huh.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/130-0
00:10:44.043 --> 00:10:47.025
<v Fabricio Pereira Santana>Beleza,
esse fornecedor bloqueado aqui eu poderia</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/130-1
00:10:47.025 --> 00:10:51.736
<v Fabricio Pereira Santana>selecionar aqui e reprocessar. Beleza?
Mas digamos que tenha sido um centro de</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/130-2
00:10:51.736 --> 00:10:56.388
<v Fabricio Pereira Santana>custo que eu coloquei e que eu coloquei
um centro de custo diferente. Sei lá,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/130-3
00:10:56.388 --> 00:10:58.893
<v Fabricio Pereira Santana>era um centro de custo 11, eu coloquei 12.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/131-0
00:10:59.523 --> 00:11:04.862
<v Fabricio Pereira Santana>Eu meio que conseguiria editar aqui para
ele mudar para 11 para aí depois eu fazer</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/131-1
00:11:04.862 --> 00:11:09.108
<v Fabricio Pereira Santana>esse reprocessar, entendeu?
Só que eu acho que fica muito aberto,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/131-2
00:11:09.108 --> 00:11:13.933
<v Fabricio Pereira Santana>porque você seria o cara ir lá na
planilha de Excel e ajustar como é feito</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/131-3
00:11:13.933 --> 00:11:14.963
<v Fabricio Pereira Santana>hoje no SAP, tá?</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/132-0
00:11:15.363 --> 00:11:18.603
<v Fabricio Pereira Santana>Toda vez que eu faço algum erro,
que eu tenho algum erro lá,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/132-1
00:11:18.603 --> 00:11:22.163
<v Fabricio Pereira Santana>que o sistema identifica,
eu não consigo fazer essa edição, não é?</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/133-0
00:11:23.363 --> 00:11:27.706
<v Fabricio Pereira Santana>Era mais tecnicamente, isso é possível.
Se não for possível, não tem problema.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/133-1
00:11:27.706 --> 00:11:31.610
<v Fabricio Pereira Santana>Não estava nem considerando isso, não.
O que eu estava considerando é,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/133-2
00:11:31.610 --> 00:11:35.624
<v Fabricio Pereira Santana>deu erro aqui, não nesse caso.
Está vendo que eu tenho erros aqui que eu</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/133-3
00:11:35.624 --> 00:11:38.703
<v Fabricio Pereira Santana>posso reprocessar,
que é o cara fazer de novo a chamada</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/133-4
00:11:38.703 --> 00:11:39.363
<v Fabricio Pereira Santana>daquilo ali.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/134-0
00:11:39.763 --> 00:11:42.653
<v Fabricio Pereira Santana>Beleza,
que eu consigo fazer porque está</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/134-1
00:11:42.653 --> 00:11:47.093
<v Fabricio Pereira Santana>bloqueado no sistema.
Agora é um campo que eu preciso alterar,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/134-2
00:11:47.093 --> 00:11:52.239
<v Fabricio Pereira Santana>que é um centro de custo errado,
uma data de vencimento aqui no, sei lá,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/134-3
00:11:52.239 --> 00:11:55.763
<v Fabricio Pereira Santana>o sistema não colocou, sei lá,
coloquei 30 do do.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/135-0
00:11:56.403 --> 00:12:00.210
<v Fabricio Pereira Santana>Pô, não existe, né?
Então como é que eu vou levar isso para o</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/135-1
00:12:00.210 --> 00:12:03.281
<v Fabricio Pereira Santana>sistema?
Eu tenho que ir lá ajustar no Excel e aí</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/135-2
00:12:03.281 --> 00:12:05.123
<v Fabricio Pereira Santana>fazer uma nova importação, né?</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/136-0
00:12:06.243 --> 00:12:09.227
<v Matheus Freitas Dos Santos>Entendi,
mas isso daí seriam validações dentro do</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/136-1
00:12:09.227 --> 00:12:10.003
<v Matheus Freitas Dos Santos>sistema, não?</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/137-0
00:12:11.763 --> 00:12:14.163
<v Matheus Freitas Dos Santos>Essa isso daí nesse exemplo que você deu.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/138-0
00:12:13.363 --> 00:12:16.041
<v Fabricio Pereira Santana>É validação, é,
mas é validação do sistema.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/138-1
00:12:16.041 --> 00:12:18.963
<v Fabricio Pereira Santana>Esse é o ponto, entendeu?
Validação do sistema.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/139-0
00:12:18.083 --> 00:12:23.683
<v Gabriel Vieira De Souza>ele tá falando a edição não não não seria
dentro do sistema a edição seria no Excel</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/140-0
00:12:24.683 --> 00:12:27.813
<v Fabricio Pereira Santana>Então, que é o que eu estou considerando.
Aí eu falo,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/140-1
00:12:27.813 --> 00:12:32.045
<v Fabricio Pereira Santana>se você puder editar o documento nessa
tela dois para poder reprocessar,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/140-2
00:12:32.045 --> 00:12:34.712
<v Fabricio Pereira Santana>seria uma boa,
mas não é o que eu considerei,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/140-3
00:12:34.712 --> 00:12:38.364
<v Fabricio Pereira Santana>o que eu estava considerando para
precisar para o cliente, tá?</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/140-4
00:12:38.364 --> 00:12:41.843
<v Fabricio Pereira Santana>Qualquer erro é edição no Excel e fazer a
subida novamente.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/141-0
00:12:42.403 --> 00:12:42.643
<v Fabricio Pereira Santana>Yeah.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/142-0
00:12:45.443 --> 00:12:51.248
<v Gabriel Vieira De Souza>É, eu fiquei numa dúvida, desculpa,
se esse se essa janela de dúvida foi</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/142-1
00:12:51.248 --> 00:12:57.450
<v Gabriel Vieira De Souza>fechada, eu queria levantar uma outra,
posso levantar ou tem mais situações a</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/142-2
00:12:57.450 --> 00:12:58.723
<v Gabriel Vieira De Souza>falar sobre ela?</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/146-0
00:13:00.483 --> 00:13:04.785
<v Fabricio Pereira Santana>Não sei, tem mais algum aí Matheus,
mas não sei se você conseguiu entender,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/143-0
00:13:02.843 --> 00:13:03.203
<v Matheus Freitas Dos Santos>Hello.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/146-1
00:13:04.785 --> 00:13:06.483
<v Fabricio Pereira Santana>mas pegou e o pegou os também.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/144-0
00:13:04.803 --> 00:13:05.363
<v Matheus Freitas Dos Santos>Entendi.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/145-0
00:13:06.963 --> 00:13:07.363
<v Matheus Freitas Dos Santos>Same.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/149-0
00:13:07.923 --> 00:13:12.864
<v Gabriel Vieira De Souza>Eu vi ali no documento que tem 2 BAPs que
você citou,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/149-1
00:13:12.864 --> 00:13:20.092
<v Gabriel Vieira De Souza>uma BAP é de cheque e a outra é de post.
De fato é enviar essa de cheque. Ela,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/147-0
00:13:15.363 --> 00:13:15.443
<v Fabricio Pereira Santana>Uh-huh.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/148-0
00:13:17.243 --> 00:13:17.683
<v Fabricio Pereira Santana>Post.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/149-2
00:13:20.092 --> 00:13:23.843
<v Gabriel Vieira De Souza>no caso, é para verificar se o documento.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/150-0
00:13:23.923 --> 00:13:24.723
<v Gabriel Vieira De Souza>Está correto?</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/152-0
00:13:25.043 --> 00:13:27.523
<v Fabricio Pereira Santana>Isso é onde faz a validação.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/151-0
00:13:26.563 --> 00:13:26.883
<v Gabriel Vieira De Souza>Show.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/153-0
00:13:28.243 --> 00:13:34.663
<v Gabriel Vieira De Souza>Aí eu fico, eu pensei na seguinte lógica,
porque que ao invés de já lançar os que</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/153-1
00:13:34.663 --> 00:13:35.603
<v Gabriel Vieira De Souza>funcionaram?</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/154-0
00:13:36.803 --> 00:13:42.432
<v Gabriel Vieira De Souza>Segue pelo fluxo de primeiro faz o check
e informa para ele quais são as linhas</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/154-1
00:13:42.432 --> 00:13:46.655
<v Gabriel Vieira De Souza>que estão com erro.
Ele faz o ajuste e só conseguir enviar,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/154-2
00:13:46.655 --> 00:13:52.003
<v Gabriel Vieira De Souza>só conseguir fazer o post uma vez que o
que o documento está completamente.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/156-0
00:13:52.163 --> 00:13:55.675
<v Gabriel Vieira De Souza>Correto, entendeu? Tipo,
todas as linhas estão corretas.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/155-0
00:13:53.403 --> 00:13:54.003
<v Fabricio Pereira Santana>Go ahead.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/156-1
00:13:55.675 --> 00:13:56.723
<v Gabriel Vieira De Souza>Isso faz sentido?</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/157-0
00:13:56.083 --> 00:14:00.219
<v Fabricio Pereira Santana>Entendo, faz. Só que tem um porém,
pensa o seguinte, quando ele tá,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/157-1
00:14:00.219 --> 00:14:04.781
<v Fabricio Pereira Santana>quando o cara vai fazer esse lançamento,
ele tá mandando tudo um documento</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/157-2
00:14:04.781 --> 00:14:08.856
<v Fabricio Pereira Santana>completo. Então, por exemplo,
ele tá mandando do sítio do Matheus,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/157-3
00:14:08.856 --> 00:14:12.323
<v Fabricio Pereira Santana>do sítio do Gabriel, do meu sítio,
e aí o sítio, sei lá.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/159-0
00:14:12.563 --> 00:14:17.310
<v Fabricio Pereira Santana>Do Rafael Rafael Arquiteto está com
problema, o Rafael Arquiteto,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/158-0
00:14:17.043 --> 00:14:17.403
<v Gabriel Vieira De Souza>Mhm.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/159-1
00:14:17.310 --> 00:14:21.123
<v Fabricio Pereira Santana>ele não pode ser um impeditivo para eu
poder lançar.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/160-0
00:14:21.923 --> 00:14:22.523
<v Gabriel Vieira De Souza>Thank you.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/161-0
00:14:22.123 --> 00:14:22.563
<v Fabricio Pereira Santana>Entendeu?</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/162-0
00:14:23.443 --> 00:14:23.843
<v Gabriel Vieira De Souza>Entendi.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/163-0
00:14:25.203 --> 00:14:28.883
<v Gabriel Vieira De Souza>Bom, beleza, então faz sentido,
não tinha pensado nessa situação.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/166-0
00:14:28.883 --> 00:14:32.198
<v Fabricio Pereira Santana>É porque, tipo assim,
aqui é o ele é o massivo mesmo,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/166-1
00:14:32.198 --> 00:14:35.820
<v Fabricio Pereira Santana>aqui a gente usou pouco,
mas eu posso estar fazendo vários</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/166-2
00:14:35.820 --> 00:14:39.443
<v Fabricio Pereira Santana>lançamentos de vários sítios ali ao mesmo
tempo, entendeu?</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/170-0
00:14:40.323 --> 00:14:43.518
<v Gabriel Vieira De Souza>Entendi.
Eu tenho uma outra pergunta referente a</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/170-1
00:14:43.518 --> 00:14:46.844
<v Gabriel Vieira De Souza>essa questão aqui dessa tela 2, aqui,
essa tela 1,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/170-2
00:14:46.844 --> 00:14:51.735
<v Gabriel Vieira De Souza>eu entendi que você está querendo passar
como se fosse ali a tela inicial,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/170-3
00:14:51.735 --> 00:14:55.843
<v Gabriel Vieira De Souza>onde que eu vou ter a lista de todas as
cargas ali que já foi.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/169-0
00:14:52.723 --> 00:14:53.123
<v Fabricio Pereira Santana>Sim.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/172-0
00:14:56.243 --> 00:15:03.795
<v Gabriel Vieira De Souza>É lançadas ou que o cliente tentou lançar
e tem alguns filtros para essa para essa</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/172-1
00:15:03.795 --> 00:15:09.800
<v Gabriel Vieira De Souza>carga nessa tela 2 aqui,
ela aparece uma vez que ele clicou ali a</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/172-2
00:15:09.800 --> 00:15:12.803
<v Gabriel Vieira De Souza>carregar o arquivo, vai download.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/171-0
00:15:12.643 --> 00:15:12.883
<v Fabricio Pereira Santana>Michelle.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/173-0
00:15:13.443 --> 00:15:17.836
<v Gabriel Vieira De Souza>E aí seria como se fosse ali um pop-up
mostrando,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/173-1
00:15:17.836 --> 00:15:23.283
<v Gabriel Vieira De Souza>ou senão vai para uma outra tela.
Como que você pensou nisso?</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/174-0
00:15:21.603 --> 00:15:24.211
<v Fabricio Pereira Santana>Vai para uma outra tela,
vai para outra tela.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/174-1
00:15:24.211 --> 00:15:27.329
<v Fabricio Pereira Santana>Eu pensei do mesmo formato,
deixa eu abrir aqui, cara,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/174-2
00:15:27.329 --> 00:15:28.803
<v Fabricio Pereira Santana>que logo é na VPN deles é.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/175-0
00:15:30.003 --> 00:15:31.043
<v Fabricio Pereira Santana>É um saco aqui para mim.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/176-0
00:15:31.523 --> 00:15:35.968
<v Matheus Freitas Dos Santos>É um object page, não isso daí.
A primeira tela é o header e depois,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/176-1
00:15:35.968 --> 00:15:38.803
<v Matheus Freitas Dos Santos>quando você clica nela, abre a tela 2,
não.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/186-0
00:15:41.283 --> 00:15:44.724
<v Fabricio Pereira Santana>Isso é como funciona,
é como funciona hoje, tá? Tipo assim,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/177-0
00:15:41.523 --> 00:15:42.403
<v Gabriel Vieira De Souza>That's all.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/186-1
00:15:44.724 --> 00:15:48.337
<v Fabricio Pereira Santana>no standard do SAP,
eu tenho lá a primeira tela do SAP do SAP,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/180-0
00:15:45.203 --> 00:15:45.603
<v Gabriel Vieira De Souza>Yeah.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/186-2
00:15:48.337 --> 00:15:51.319
<v Fabricio Pereira Santana>ele vem o seguinte,
é carregado com muito contábil,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/186-3
00:15:51.319 --> 00:15:54.530
<v Fabricio Pereira Santana>só basicamente isso,
que é o baixar modelo, na verdade,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/183-0
00:15:53.843 --> 00:15:54.243
<v Gabriel Vieira De Souza>Yeah.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/186-4
00:15:54.530 --> 00:15:57.283
<v Fabricio Pereira Santana>do mesmo jeito que está aí,
só que é diferente.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/190-0
00:15:57.683 --> 00:16:00.214
<v Fabricio Pereira Santana>Carregar arquivo.
Quando eu carrego o arquivo,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/190-1
00:16:00.214 --> 00:16:03.444
<v Fabricio Pereira Santana>ele vai lá e ele roda que ele vai,
faz o check, ele vai lá.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/190-2
00:16:03.444 --> 00:16:06.406
<v Fabricio Pereira Santana>Na hora que ele roda,
ele vai abrir essa tela para mim</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/190-3
00:16:06.406 --> 00:16:08.883
<v Fabricio Pereira Santana>mostrando quais são os lançamentos,
entendeu?</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/187-0
00:16:10.083 --> 00:16:10.163
<v Gabriel Vieira De Souza>So.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/198-0
00:16:11.603 --> 00:16:15.753
<v Gabriel Vieira De Souza>Essa questão, esse app 2 aqui,
tipo de movimento,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/198-1
00:16:15.753 --> 00:16:21.480
<v Gabriel Vieira De Souza>ele tem que estar no mesmo,
ele tem que estar meio que na mesma tela</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/198-2
00:16:21.480 --> 00:16:24.883
<v Gabriel Vieira De Souza>ou eu posso, ou é um aplicativo separado.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/195-0
00:16:22.243 --> 00:16:24.083
<v Fabricio Pereira Santana>Não é um outro aplicativo.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/199-0
00:16:25.123 --> 00:16:29.113
<v Fabricio Pereira Santana>É um aplicativo separado,
esse aplicativo é de parametrização,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/199-1
00:16:29.113 --> 00:16:29.683
<v Fabricio Pereira Santana>entendeu?</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/202-0
00:16:30.563 --> 00:16:32.483
<v Gabriel Vieira De Souza>Tá e.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/206-0
00:16:31.683 --> 00:16:37.232
<v Fabricio Pereira Santana>Não, porque tipo assim,
eu tenho o tipo de DOC aqui, CSDS, CMFR,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/206-1
00:16:37.232 --> 00:16:41.501
<v Fabricio Pereira Santana>FR, tá vendo?
E aí aqui é meio que eu defino aqui</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/203-0
00:16:38.323 --> 00:16:38.723
<v Gabriel Vieira De Souza>Mhm.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/206-2
00:16:41.501 --> 00:16:47.563
<v Fabricio Pereira Santana>código de bloqueio, se é esses parâmetros,
entendeu? Que eu não posso.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/207-0
00:16:47.923 --> 00:16:52.808
<v Fabricio Pereira Santana>Colocar de parâmetro de tela aqui na no
aplicativo Stand Light,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/207-1
00:16:52.808 --> 00:16:57.769
<v Fabricio Pereira Santana>parâmetro que existe. Então, tipo,
o cara define, se for CS, CS,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/207-2
00:16:57.769 --> 00:17:02.883
<v Fabricio Pereira Santana>tipo de documento CS, aí o débito,
no caso aqui é débito no sítio.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/209-0
00:17:03.763 --> 00:17:09.496
<v Fabricio Pereira Santana>Eu não preciso, isso aqui eu ainda não vi,
eu preciso colocar a informação, porque,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/209-1
00:17:09.496 --> 00:17:12.772
<v Fabricio Pereira Santana>por exemplo,
o sítio é um código de fornecedor.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/209-2
00:17:12.772 --> 00:17:16.253
<v Fabricio Pereira Santana>Eu não preciso colocar todos os
fornecedores aqui.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/208-0
00:17:13.363 --> 00:17:13.603
<v Gabriel Vieira De Souza>Mm.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/209-3
00:17:16.253 --> 00:17:20.963
<v Fabricio Pereira Santana>Eu posso só colocar a conta do razão de
reconciliação de fornecedor.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/210-0
00:17:22.323 --> 00:17:22.363
<v Fabricio Pereira Santana>Uh.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/211-0
00:17:24.643 --> 00:17:25.203
<v Fabricio Pereira Santana>Tá vendo?</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/213-0
00:17:26.403 --> 00:17:29.523
<v Fabricio Pereira Santana>Porque o que importa para ele é essa
parada aqui, Oh.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/212-0
00:17:27.123 --> 00:17:27.283
<v Gabriel Vieira De Souza>Okay.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/217-0
00:17:31.523 --> 00:17:34.806
<v Fabricio Pereira Santana>Desculpa,
é isso mesmo que você estava mostrando.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/214-0
00:17:31.923 --> 00:17:33.923
<v Gabriel Vieira De Souza>É no caso, eu não estou vendo sua tela,
não.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/217-1
00:17:34.806 --> 00:17:39.468
<v Fabricio Pereira Santana>É isso mesmo que você está mostrando.
Está vendo? Tem um sítio, razão,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/217-2
00:17:39.468 --> 00:17:43.999
<v Fabricio Pereira Santana>sócio R e sítio. Isso aqui, esse débito,
esse crédito, teoricamente,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/217-3
00:17:43.999 --> 00:17:46.363
<v Fabricio Pereira Santana>eu nem preciso colocar, tá? Por quê?</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/220-0
00:17:46.883 --> 00:17:51.043
<v Fabricio Pereira Santana>É na hora que ele faz o lançamento,
lá na hora que ele faz o preenchimento do</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/220-1
00:17:51.043 --> 00:17:51.363
<v Fabricio Pereira Santana>Excel.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/221-0
00:17:53.363 --> 00:17:58.403
<v Fabricio Pereira Santana>Eu tenho, eu tenho essas informações,
porque ele coloca através do BP lá.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/227-0
00:18:00.323 --> 00:18:04.834
<v Fabricio Pereira Santana>não precisaria desse campo débito e
crédito eu não seria coloquei no</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/227-1
00:18:04.834 --> 00:18:09.999
<v Fabricio Pereira Santana>protótipo aí mas eu não lembro porque que
eu botei esse critério tá para mim o</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/227-2
00:18:09.999 --> 00:18:13.203
<v Fabricio Pereira Santana>essencial eu bloqueio aí o bloqueio pelo
tipo né</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/233-0
00:18:14.403 --> 00:18:17.493
<v Fabricio Pereira Santana>De baixo, é na linha de baixo,
também no bloqueio,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/226-0
00:18:14.523 --> 00:18:14.883
<v Gabriel Vieira De Souza>Mhm.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/230-0
00:18:17.403 --> 00:18:17.763
<v Gabriel Vieira De Souza>Mhm.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/233-1
00:18:17.493 --> 00:18:21.008
<v Fabricio Pereira Santana>ele tem ligação com o tipo de dock lá e
as data base ali,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/233-2
00:18:21.008 --> 00:18:24.583
<v Fabricio Pereira Santana>se ele é data base obrigatório ou não.
Então, por exemplo,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/233-3
00:18:24.583 --> 00:18:28.704
<v Fabricio Pereira Santana>se na hora do preenchimento lá eu
coloquei um tipo de documento CS,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/233-4
00:18:28.704 --> 00:18:30.643
<v Fabricio Pereira Santana>eu botei que é a data CS não DS.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/236-0
00:18:31.203 --> 00:18:34.275
<v Fabricio Pereira Santana>Eu não coloquei a data base que está como
obrigatória.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/236-1
00:18:34.275 --> 00:18:37.683
<v Fabricio Pereira Santana>Esse é um dos motivos de erro para o cara
ajustar, entendeu?</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/238-0
00:18:38.643 --> 00:18:42.530
<v Fabricio Pereira Santana>Que ele fez essa validação no parâmetro,
além das verificações do parâmetro</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/237-0
00:18:38.723 --> 00:18:39.123
<v Gabriel Vieira De Souza>Entendi.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/238-1
00:18:42.530 --> 00:18:44.883
<v Fabricio Pereira Santana>standard da ABAP lá que faz através do
check.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/244-0
00:18:47.203 --> 00:18:50.338
<v Fabricio Pereira Santana>E quando eu faço,
quando ele roda o check ali na BAP,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/241-0
00:18:47.403 --> 00:18:47.763
<v Gabriel Vieira De Souza>Yeah.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/244-1
00:18:50.338 --> 00:18:53.299
<v Fabricio Pereira Santana>ele tem,
ele faz uma rodagem ali para verificar os</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/244-2
00:18:53.299 --> 00:18:57.363
<v Fabricio Pereira Santana>Campos que teoricamente são obrigatórios
mesmo é de formato standard.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/247-0
00:19:00.163 --> 00:19:06.115
<v Gabriel Vieira De Souza>eu acho que eu entendi essa essa parte
aqui é essa eu fiquei também na dúvida</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/247-1
00:19:06.115 --> 00:19:11.763
<v Gabriel Vieira De Souza>aproveitando que tem essa questão aqui do
negócio eu vi lá no documento é</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/251-0
00:19:13.203 --> 00:19:16.480
<v Gabriel Vieira De Souza>algumas orientações sobre o
Desenvolvimento,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/251-1
00:19:16.480 --> 00:19:21.504
<v Gabriel Vieira De Souza>principalmente a questão da criação de
tabelas, de objetos técnicos,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/251-2
00:19:21.504 --> 00:19:27.402
<v Gabriel Vieira De Souza>e ali define os nomes de objetos e também
quase que a arquitetura do aplicativo.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/251-3
00:19:27.402 --> 00:19:31.043
<v Gabriel Vieira De Souza>Eu queria entender se aquilo dali é uma
sugestão.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/250-0
00:19:28.363 --> 00:19:28.723
<v Fabricio Pereira Santana>Mhm.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/252-0
00:19:31.603 --> 00:19:35.123
<v Gabriel Vieira De Souza>Ou se eu tenho que seguir aquela aquela
arquitetura ali?</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/254-0
00:19:37.043 --> 00:19:40.243
<v Gabriel Vieira De Souza>There's any play queue. Ness a particular.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/253-0
00:19:37.123 --> 00:19:38.163
<v Fabricio Pereira Santana>Well, sure.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/257-0
00:19:45.443 --> 00:19:46.283
<v Gabriel Vieira De Souza>Aqui, por exemplo.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/260-0
00:19:46.003 --> 00:19:49.185
<v Fabricio Pereira Santana>Ah, entendi, cara, então pra mim tá,
vamos lá.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/260-1
00:19:49.185 --> 00:19:54.331
<v Fabricio Pereira Santana>Eu nunca trabalhei dessa forma de eu
tendo que colocar o nome do objeto pro</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/260-2
00:19:54.331 --> 00:19:59.138
<v Fabricio Pereira Santana>cara, tá ligado? Tipo assim,
pra mim o ABAP define ele do melhor jeito</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/260-3
00:19:59.138 --> 00:20:00.763
<v Fabricio Pereira Santana>que é o formato pra ele.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/261-0
00:20:14.603 --> 00:20:14.963
<v Gabriel Vieira De Souza>Mhm.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/263-0
00:20:15.003 --> 00:20:18.836
<v Fabricio Pereira Santana>A gente está fazendo isso porque em
outros desenvolvimentos é,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/263-1
00:20:18.836 --> 00:20:22.061
<v Fabricio Pereira Santana>eles estão olhando para essas informações,
esse meu,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/262-0
00:20:21.363 --> 00:20:21.723
<v Gabriel Vieira De Souza>It.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/263-2
00:20:22.061 --> 00:20:25.043
<v Fabricio Pereira Santana>ele teoricamente eu acho que ele não tem
nenhum.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/265-0
00:20:26.163 --> 00:20:31.964
<v Fabricio Pereira Santana>Nenhum outro que vá fazer menção a esse
aqui está. Não vá olhar esses nomes aqui,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/265-1
00:20:31.964 --> 00:20:34.723
<v Fabricio Pereira Santana>mas tem que seguir, cara, infelizmente.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/269-0
00:20:35.443 --> 00:20:39.830
<v Gabriel Vieira De Souza>Só tirar uma dúvida aqui,
só essa questão de que isso aqui é muito</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/266-0
00:20:35.803 --> 00:20:36.163
<v Matheus Freitas Dos Santos>Us.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/269-1
00:20:39.830 --> 00:20:44.807
<v Gabriel Vieira De Souza>importante na hora do Desenvolvimento.
Isso pode definir se uma demanda vai</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/267-0
00:20:42.403 --> 00:20:42.483
<v Fabricio Pereira Santana>Uh-huh.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/269-2
00:20:44.807 --> 00:20:50.176
<v Gabriel Vieira De Souza>demorar meses ou uma semana. Por exemplo,
aqui você está definindo a modelagem de</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/268-0
00:20:46.803 --> 00:20:47.203
<v Fabricio Pereira Santana>Sim.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/269-3
00:20:50.176 --> 00:20:53.123
<v Gabriel Vieira De Souza>dados que a gente estava falando aqui
sobre.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/272-0
00:20:53.443 --> 00:21:00.510
<v Gabriel Vieira De Souza>tabelas, está definindo os behaviors, etc.
Eu ainda não parei para poder pensar na</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/272-1
00:21:00.510 --> 00:21:07.577
<v Gabriel Vieira De Souza>melhor arquitetura para esse aplicativo,
mas é igual você falou ali que utilizou o</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/271-0
00:21:02.683 --> 00:21:03.443
<v Fabricio Pereira Santana>Perfeito.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/272-2
00:21:07.577 --> 00:21:08.003
<v Gabriel Vieira De Souza>chat.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/273-0
00:21:08.243 --> 00:21:12.620
<v Gabriel Vieira De Souza>O chat ele com toda certeza é muito bom e
etc,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/273-1
00:21:12.620 --> 00:21:17.370
<v Gabriel Vieira De Souza>mas eu não sei como que você pediu para
ele criar,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/273-2
00:21:17.370 --> 00:21:22.492
<v Gabriel Vieira De Souza>pensando na questão da CDS que a gente
precisa montar,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/273-3
00:21:22.492 --> 00:21:26.963
<v Gabriel Vieira De Souza>pensando na forma de como entregar esses
dados.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/275-0
00:21:27.563 --> 00:21:33.060
<v Gabriel Vieira De Souza>quais campos vão ter em cada tabela e
também a questão dos nomes,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/275-1
00:21:33.060 --> 00:21:37.807
<v Gabriel Vieira De Souza>se eles estão de acordo com o padrão que
a William pede.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/275-2
00:21:37.807 --> 00:21:43.554
<v Gabriel Vieira De Souza>Ele tem um PDF lá que ele coloca os nomes.
Eu não cheguei a avaliar,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/274-0
00:21:39.523 --> 00:21:39.603
<v Fabricio Pereira Santana>A.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/275-3
00:21:43.554 --> 00:21:45.803
<v Gabriel Vieira De Souza>só estou perguntando mesmo.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/279-0
00:21:45.843 --> 00:21:49.570
<v Fabricio Pereira Santana>Tá, não beleza, não. Mas tipo assim,
questão de campo, tá?</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/276-0
00:21:46.723 --> 00:21:46.763
<v Gabriel Vieira De Souza>A.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/279-1
00:21:49.570 --> 00:21:54.182
<v Fabricio Pereira Santana>Campo eu trabalhei só com os Campos do
SAP mesmo. Eu falo em questão do,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/277-0
00:21:52.563 --> 00:21:52.883
<v Gabriel Vieira De Souza>Oh.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/279-2
00:21:54.182 --> 00:21:59.363
<v Fabricio Pereira Santana>por exemplo, de objeto aqui. No caso é,
por exemplo, lá para o tipo de movimento.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/278-0
00:22:00.083 --> 00:22:00.323
<v Gabriel Vieira De Souza>Okay.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/280-0
00:22:00.563 --> 00:22:05.850
<v Fabricio Pereira Santana>Beleza, Ztax, MMT, tipo assim,
tudo aquilo que é standard tá do formato</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/280-1
00:22:05.850 --> 00:22:10.476
<v Fabricio Pereira Santana>standard permanece, tá?
É mais pra pra essas informações aqui.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/280-2
00:22:10.476 --> 00:22:15.763
<v Fabricio Pereira Santana>Então, por exemplo, pra CDS,
eu coloquei esse Z, acho que foi ZI ou ZL.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/281-0
00:22:16.803 --> 00:22:19.363
<v Fabricio Pereira Santana>Zi, taxi, tipo de móveis, entendeu?</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/282-0
00:22:20.083 --> 00:22:20.683
<v Gabriel Vieira De Souza>Mm-hmm.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/283-0
00:22:20.563 --> 00:22:24.618
<v Fabricio Pereira Santana>É só para você fazer,
colocar essa informação lá do para poder</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/283-1
00:22:24.618 --> 00:22:28.803
<v Fabricio Pereira Santana>fazer o consumo lá do Fiori. Mas, cara,
eu acho, está, vamos lá.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/284-0
00:22:30.483 --> 00:22:34.860
<v Fabricio Pereira Santana>Isso aí eu acho que não tem problema
nenhum se você identificar. Pô,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/284-1
00:22:34.860 --> 00:22:40.125
<v Fabricio Pereira Santana>para mim é mais fácil ser desse jeito, tá?
O que a gente vai precisar é que depois</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/284-2
00:22:40.125 --> 00:22:44.376
<v Fabricio Pereira Santana>essa informação seja passada,
porque aí eu posso fazer essa edição</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/284-3
00:22:44.376 --> 00:22:46.723
<v Fabricio Pereira Santana>dentro dos documentos ali para poder.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/285-0
00:22:47.363 --> 00:22:50.963
<v Fabricio Pereira Santana>até passar,
porque precisa disso registrado, entendeu?</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/290-0
00:22:50.403 --> 00:22:55.614
<v Gabriel Vieira De Souza>Eu acho que o melhor seria fazer
justamente esse ponto aí que você colocou,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/290-1
00:22:55.614 --> 00:23:00.414
<v Gabriel Vieira De Souza>depois a gente faz a alteração,
porque o que eu falo é porque é tipo,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/286-0
00:22:57.363 --> 00:22:58.523
<v Fabricio Pereira Santana>Alteração, beleza.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/290-2
00:23:00.414 --> 00:23:03.431
<v Gabriel Vieira De Souza>por exemplo,
aqui é uma demanda que eu fiz,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/290-3
00:23:03.431 --> 00:23:05.763
<v Gabriel Vieira De Souza>esse tipo de isso aqui meio que a.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/289-0
00:23:03.603 --> 00:23:04.203
<v Fabricio Pereira Santana>Mm-hmm.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/296-0
00:23:05.843 --> 00:23:11.777
<v Gabriel Vieira De Souza>de arquitetura dos objetos.
E tem o motivo pelo qual, por exemplo,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/296-1
00:23:11.777 --> 00:23:16.649
<v Gabriel Vieira De Souza>nesse daqui,
eu escolhi fazer três CDS ao invés de uma</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/293-0
00:23:15.523 --> 00:23:16.283
<v Fabricio Pereira Santana>Perfeito.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/296-2
00:23:16.649 --> 00:23:21.254
<v Gabriel Vieira De Souza>única CDS.
E o motivo é para a gente ter uma melhor</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/296-3
00:23:21.254 --> 00:23:23.203
<v Gabriel Vieira De Souza>performance dos dados.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/297-0
00:23:23.763 --> 00:23:27.452
<v Gabriel Vieira De Souza>dela não ficar travando nem carregando
muito. É um exemplo bem simples,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/297-1
00:23:27.452 --> 00:23:28.323
<v Gabriel Vieira De Souza>então tipo assim.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/302-0
00:23:29.363 --> 00:23:34.683
<v Gabriel Vieira De Souza>Quando eu pego e já deixo antes do cara
programar ou desenhar arquitetura</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/302-1
00:23:34.683 --> 00:23:39.787
<v Gabriel Vieira De Souza>pré-estabelecido isso daqui,
você pode estar amarrando o desenvolvedor</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/298-0
00:23:39.603 --> 00:23:40.083
<v Fabricio Pereira Santana>Steam.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/302-2
00:23:39.787 --> 00:23:44.963
<v Gabriel Vieira De Souza>de às vezes entregar um aplicativo do
jeito que você precisa, entendeu?</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/306-0
00:23:45.763 --> 00:23:50.987
<v Gabriel Vieira De Souza>É isso que eu estou perguntando,
se eu puder fazer e aí depois eu do mesmo</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/301-0
00:23:45.843 --> 00:23:45.923
<v Fabricio Pereira Santana>Uh-huh.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/306-1
00:23:50.987 --> 00:23:54.400
<v Gabriel Vieira De Souza>jeito que eu faço aqui o desenho da
arquitetura,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/306-2
00:23:54.400 --> 00:24:00.112
<v Gabriel Vieira De Souza>eu consigo depois chegar aqui e te passar
essa tabelinha aqui com os nomes que eu</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/306-3
00:24:00.112 --> 00:24:01.923
<v Gabriel Vieira De Souza>coloquei, a camada que ela</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/305-0
00:24:00.643 --> 00:24:01.363
<v Fabricio Pereira Santana>Perfect.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/307-0
00:24:02.243 --> 00:24:05.283
<v Gabriel Vieira De Souza>Foi utilizada o nome técnico,
tudo certinho, entendeu?</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/308-0
00:24:05.523 --> 00:24:06.883
<v Fabricio Pereira Santana>Sem problemas, sem call.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/309-0
00:24:07.803 --> 00:24:08.403
<v Gabriel Vieira De Souza>Go, então.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/313-0
00:24:08.163 --> 00:24:11.654
<v Fabricio Pereira Santana>Cara, na verdade, velho, é porque,
tipo assim, esse projetinho aí,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/313-1
00:24:11.654 --> 00:24:15.562
<v Fabricio Pereira Santana>não sei se é o Matheus que já tá aí,
porque acho que a primeira vez que eu</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/313-2
00:24:15.562 --> 00:24:19.626
<v Fabricio Pereira Santana>falo com você, acho que o Matheus,
eu já vi ele aqui nos outros grupos, cara,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/313-3
00:24:19.626 --> 00:24:22.335
<v Fabricio Pereira Santana>o pessoal fica batendo muito,
não é que tá escrito,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/313-4
00:24:22.335 --> 00:24:24.003
<v Fabricio Pereira Santana>ele escreve na Pedra, tá ligado?</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/315-0
00:24:24.723 --> 00:24:29.559
<v Fabricio Pereira Santana>Só que para mim não é assim, velho.
Vamos lá. Eu sou consultor funcional,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/312-0
00:24:25.283 --> 00:24:25.523
<v Gabriel Vieira De Souza>Mm.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/315-1
00:24:29.559 --> 00:24:34.919
<v Fabricio Pereira Santana>tenho um pouco de conhecimento técnico em
questões de desenvolvimento e vocês são</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/314-0
00:24:30.083 --> 00:24:30.323
<v Gabriel Vieira De Souza>Mm.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/315-2
00:24:34.919 --> 00:24:37.794
<v Fabricio Pereira Santana>base.
Então eu não posso ficar fazendo essa</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/315-3
00:24:37.794 --> 00:24:39.363
<v Fabricio Pereira Santana>definição. Eu nunca fiz.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/318-0
00:24:40.083 --> 00:24:42.557
<v Fabricio Pereira Santana>Tá,
eu nunca fiz de inventário técnico de</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/316-0
00:24:40.283 --> 00:24:40.643
<v Gabriel Vieira De Souza>Mhm.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/318-1
00:24:42.557 --> 00:24:46.268
<v Fabricio Pereira Santana>objeto, eu não faço.
Eu passo de Desenvolvimento ABAP e Chima,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/318-2
00:24:46.268 --> 00:24:51.158
<v Fabricio Pereira Santana>ele vai para a linha de Desenvolvimento
dele e falou, pronto, chegou no resultado,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/318-3
00:24:51.158 --> 00:24:55.222
<v Fabricio Pereira Santana>é isso que eu quero e acabou.
Então aqui a gente teve que fazer isso</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/317-0
00:24:51.803 --> 00:24:52.163
<v Gabriel Vieira De Souza>Mhm.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/318-4
00:24:55.222 --> 00:24:56.283
<v Fabricio Pereira Santana>para esse projeto.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/319-0
00:24:56.363 --> 00:25:00.723
<v Fabricio Pereira Santana>Pra poder andar. O porquê é, né?
Eu não sei se é por.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/320-0
00:25:01.883 --> 00:25:06.582
<v Fabricio Pereira Santana>Por ter dado 8 no gol já,
então eles quiseram eliminar todo esse</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/320-1
00:25:06.582 --> 00:25:11.210
<v Fabricio Pereira Santana>processo e deixou isso na mão do
Funcional. Mas para mim, cara,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/320-2
00:25:11.210 --> 00:25:16.704
<v Fabricio Pereira Santana>o que eu for melhor para o ABAP em si,
para mim é o caminho que tem que ser</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/320-3
00:25:16.704 --> 00:25:17.283
<v Fabricio Pereira Santana>seguido.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/326-0
00:25:18.083 --> 00:25:22.605
<v Fabricio Pereira Santana>Mas eu acho que tipo assim, se mudar,
não tem problema, tá? Não tem problema.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/326-1
00:25:22.605 --> 00:25:26.258
<v Fabricio Pereira Santana>Isso aqui eu vou lá,
ajusto depois eu documento e é o de menos</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/326-2
00:25:26.258 --> 00:25:28.809
<v Fabricio Pereira Santana>para mim.
Eu só preciso das informações ali</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/326-3
00:25:28.809 --> 00:25:30.723
<v Fabricio Pereira Santana>realmente do que mudou, entendeu?</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/323-0
00:25:29.203 --> 00:25:29.323
<v Gabriel Vieira De Souza>Yeah.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/329-0
00:25:31.043 --> 00:25:34.489
<v Gabriel Vieira De Souza>Essa é,
eu estou alinhado justamente com o seu</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/329-1
00:25:34.489 --> 00:25:39.256
<v Gabriel Vieira De Souza>seu formato de trabalho,
até mesmo com as outras demandas que eu</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/329-2
00:25:39.256 --> 00:25:43.656
<v Gabriel Vieira De Souza>peguei aqui na índice.
Eu tive uma certa Liberdade ali para</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/329-3
00:25:43.656 --> 00:25:46.443
<v Gabriel Vieira De Souza>poder fazer. Eu achei até um pouco, é.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/331-0
00:25:47.283 --> 00:25:53.449
<v Gabriel Vieira De Souza>diferente né essa esse detalhamento aqui
porque por exemplo ele por exemplo desse</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/331-1
00:25:53.449 --> 00:25:59.315
<v Gabriel Vieira De Souza>negócio aqui ele até define aqui não que
eu não vá usar essa entendeu mas ele</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/330-0
00:25:58.803 --> 00:25:58.883
<v Fabricio Pereira Santana>Uh-huh.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/331-2
00:25:59.315 --> 00:26:02.323
<v Gabriel Vieira De Souza>define qual é a biblioteca de leitura de</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/332-0
00:26:02.643 --> 00:26:03.283
<v Gabriel Vieira De Souza>G.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/334-0
00:26:04.403 --> 00:26:07.546
<v Gabriel Vieira De Souza>De Excel.
E qual é a versão que tem que estar?</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/334-1
00:26:07.546 --> 00:26:12.362
<v Gabriel Vieira De Souza>Eu não estou dizendo que eu não vá usar
essa, provavelmente eu vá usar,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/333-0
00:26:10.803 --> 00:26:11.283
<v Fabricio Pereira Santana>Sim.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/334-2
00:26:12.362 --> 00:26:16.643
<v Gabriel Vieira De Souza>talvez de fato seja melhor,
mas a impressão que eu tenho é que.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/335-0
00:26:18.083 --> 00:26:22.359
<v Gabriel Vieira De Souza>O chat acabou escrevendo certas coisas e
a pessoa só aceitou.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/335-1
00:26:22.359 --> 00:26:25.531
<v Gabriel Vieira De Souza>E o medo que eu tenho é só tipo assim,
de pô,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/335-2
00:26:25.531 --> 00:26:31.048
<v Gabriel Vieira De Souza>talvez eu tenho que é seguir uma igual
você falou, uma regra alinhada na Pedra,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/335-3
00:26:31.048 --> 00:26:34.083
<v Gabriel Vieira De Souza>porque às vezes o chat que falou,
entendeu?</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/336-0
00:26:34.643 --> 00:26:36.643
<v Gabriel Vieira De Souza>E aí eu não tenho essa Liberdade de.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/337-0
00:26:34.963 --> 00:26:41.468
<v Fabricio Pereira Santana>é é porque na verdade nem foi tanto chat
tá é porque essas informações também</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/337-1
00:26:41.468 --> 00:26:47.557
<v Fabricio Pereira Santana>estavam nos BPD que a própria SAP
escreveu só que aquilo né quando a SAP</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/337-2
00:26:47.557 --> 00:26:50.643
<v Fabricio Pereira Santana>ela fez a o acesso Manoel ela não viu</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/342-0
00:26:50.883 --> 00:26:57.848
<v Fabricio Pereira Santana>Parte tanto do Desenvolvimento,
ela viu pela área, pelo pelo negócio ali,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/338-0
00:26:53.523 --> 00:26:53.883
<v Gabriel Vieira De Souza>Mhm.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/339-0
00:26:57.563 --> 00:26:57.923
<v Gabriel Vieira De Souza>Mhm.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/342-1
00:26:57.848 --> 00:26:58.883
<v Fabricio Pereira Santana>entendeu a.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/343-0
00:26:58.483 --> 00:26:59.683
<v Matheus Freitas Dos Santos>A funcionalidade.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/345-0
00:26:59.843 --> 00:27:03.087
<v Fabricio Pereira Santana>É,
e aí no final eu não O que importa é como</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/345-1
00:27:03.087 --> 00:27:08.062
<v Fabricio Pereira Santana>é que está sendo construído.
Vou chegar no resultado para o cliente,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/344-0
00:27:07.123 --> 00:27:07.443
<v Gabriel Vieira De Souza>Yeah.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/345-2
00:27:08.062 --> 00:27:13.398
<v Fabricio Pereira Santana>vou chegar, beleza, tá bacana. Só que, né,
eu vendo um sonho. Só que, pô,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/345-3
00:27:13.398 --> 00:27:17.003
<v Fabricio Pereira Santana>qual é o meu sonho? Pô,
meu sonho é ter um carro.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/349-0
00:27:17.523 --> 00:27:20.412
<v Fabricio Pereira Santana>Beleza,
como é que você vai chegar lá para poder</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/349-1
00:27:20.412 --> 00:27:25.188
<v Fabricio Pereira Santana>ter um carro? Vou roubar, vou comprar,
vou trabalhar. Isso aí não dá para saber,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/348-0
00:27:25.003 --> 00:27:25.363
<v Gabriel Vieira De Souza>Mhm.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/349-2
00:27:25.188 --> 00:27:29.080
<v Fabricio Pereira Santana>tá ligado? Então isso aí,
só depois que vai do processo ali que a</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/349-3
00:27:29.080 --> 00:27:32.323
<v Fabricio Pereira Santana>gente vai chegar lá para chegar no
resultado final. É.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/359-0
00:27:32.723 --> 00:27:36.318
<v Fabricio Pereira Santana>Mas, cara, pode trabalhar. Eu,
sinceramente, para mim, cara,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/359-1
00:27:36.318 --> 00:27:40.914
<v Fabricio Pereira Santana>eu não tenho esse problema nenhum, né?
Tipo, o ABAP vai, precisou fazer isso,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/359-2
00:27:40.914 --> 00:27:44.391
<v Fabricio Pereira Santana>disso e disso. O irmão,
chegou no resultado final? Chegou.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/359-3
00:27:44.391 --> 00:27:49.283
<v Fabricio Pereira Santana>Para mim é lindo, livre, acabou, entendeu?
Eu já tenho uma visão mais direcionada.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/356-0
00:27:47.883 --> 00:27:48.243
<v Gabriel Vieira De Souza>Mhm.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/366-0
00:27:49.523 --> 00:27:54.141
<v Fabricio Pereira Santana>Ah, mas é porque o ABAP teve que fazer,
sei lá, pensar numa coisa mais selfie, pô,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/366-1
00:27:54.141 --> 00:27:57.479
<v Fabricio Pereira Santana>abrir esse botão aqui para poder buscar
informação na BKPF,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/366-2
00:27:57.479 --> 00:28:00.818
<v Fabricio Pereira Santana>depois vai para a Batista e da Batista,
eu vou lá na M Seg,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/366-3
00:28:00.818 --> 00:28:04.323
<v Fabricio Pereira Santana>na M Seg da vida lá para poder chegar no
meu número de pedido.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/369-0
00:28:04.883 --> 00:28:07.626
<v Fabricio Pereira Santana>Não,
mas o ABAP viu que se ele for na MR não</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/369-1
00:28:07.626 --> 00:28:10.673
<v Fabricio Pereira Santana>sei o que,
ele já pega o número do pedido direto,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/369-2
00:28:10.673 --> 00:28:11.283
<v Fabricio Pereira Santana>meu irmão.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/370-0
00:28:12.323 --> 00:28:13.683
<v Fabricio Pereira Santana>Vida que segue para mim.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/374-0
00:28:15.763 --> 00:28:18.643
<v Fabricio Pereira Santana>O que é mais fácil para o cara, entendeu?</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/373-0
00:28:15.923 --> 00:28:16.483
<v Gabriel Vieira De Souza>Thank you.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/377-0
00:28:18.563 --> 00:28:24.481
<v Gabriel Vieira De Souza>Eu estou alinhado contigo nessa visão.
Eu acho que o cliente em si,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/377-1
00:28:24.481 --> 00:28:29.268
<v Gabriel Vieira De Souza>se ele está contratando uma consultoria
de tecnologia,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/377-2
00:28:29.268 --> 00:28:34.403
<v Gabriel Vieira De Souza>porque de fato ele não tem braço ali para
poder tratar da.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/379-0
00:28:34.643 --> 00:28:41.423
<v Gabriel Vieira De Souza>da melhor forma possível essa essa
criação né então é que a gente vira um</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/379-1
00:28:41.423 --> 00:28:48.752
<v Gabriel Vieira De Souza>canal de transformação então ele entra é
como se fosse um chat ali né ele entra</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/378-0
00:28:45.483 --> 00:28:45.843
<v Fabricio Pereira Santana>Mhm.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/379-2
00:28:48.752 --> 00:28:51.043
<v Gabriel Vieira De Souza>com o prompt dele ou seja</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/380-0
00:28:51.203 --> 00:28:55.891
<v Gabriel Vieira De Souza>pede para gente,
a gente faz todo o aplicativo da forma</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/380-1
00:28:55.891 --> 00:29:02.085
<v Gabriel Vieira De Souza>que a gente acredita que é o melhor e ele
só vai validar no final se está</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/380-2
00:29:02.085 --> 00:29:07.443
<v Gabriel Vieira De Souza>respeitando o cenário de teste. Agora,
como que é feito em ser?</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/381-0
00:29:07.483 --> 00:29:08.483
<v Gabriel Vieira De Souza>Por nossa conta.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/382-0
00:29:09.123 --> 00:29:09.523
<v Fabricio Pereira Santana>Sim.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/383-0
00:29:09.683 --> 00:29:10.403
<v Gabriel Vieira De Souza>Hey.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/384-0
00:29:11.603 --> 00:29:15.988
<v Gabriel Vieira De Souza>Aí só para a gente conseguir avançar em
outra dúvida também que eu tive,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/384-1
00:29:15.988 --> 00:29:18.992
<v Gabriel Vieira De Souza>é eu assim,
pelo que a gente conversou até agora,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/384-2
00:29:18.992 --> 00:29:23.737
<v Gabriel Vieira De Souza>acredito que a gente vai seguir pelo frio,
mas como ainda tem aqui no negócio,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/384-3
00:29:23.737 --> 00:29:28.243
<v Gabriel Vieira De Souza>eu queria entender sobre essa questão de
alternativa de redução de escopo.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/385-0
00:29:28.723 --> 00:29:33.286
<v Gabriel Vieira De Souza>Caso o cliente priorize custos,
os mesmos componentes pode ser como o</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/389-0
00:29:31.443 --> 00:29:35.761
<v Fabricio Pereira Santana>É, não vai ter que ser Fiori,
vai ter que ser Fiori, tá? É isso aí.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/385-1
00:29:33.286 --> 00:29:34.003
<v Gabriel Vieira De Souza>ABAP Class.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/386-0
00:29:35.403 --> 00:29:35.763
<v Gabriel Vieira De Souza>So.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/389-1
00:29:35.761 --> 00:29:40.143
<v Fabricio Pereira Santana>Eu coloquei as cliente também nem
percebeu, porque quando eu montei,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/389-2
00:29:40.143 --> 00:29:45.159
<v Fabricio Pereira Santana>eu não estava entendendo como é que era a
questão da dinâmica do cliente aqui,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/389-3
00:29:45.159 --> 00:29:47.763
<v Fabricio Pereira Santana>mas que não tem essa parte de curso, não.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/391-0
00:29:47.923 --> 00:29:52.711
<v Fabricio Pereira Santana>É Fiori mesmo, entendeu? No caso,
só vai ter esforço maior da sua parte aí,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/390-0
00:29:50.283 --> 00:29:50.643
<v Gabriel Vieira De Souza>So.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/391-1
00:29:52.711 --> 00:29:52.963
<v Fabricio Pereira Santana>mas.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/394-0
00:29:54.883 --> 00:29:58.219
<v Gabriel Vieira De Souza>Tá,
é uma outra dúvida aqui que é que eu</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/394-1
00:29:58.219 --> 00:30:01.799
<v Gabriel Vieira De Souza>tinha notado antes,
a gente já falou sobre,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/394-2
00:30:01.799 --> 00:30:07.738
<v Gabriel Vieira De Souza>mas só para poder meio que bater o
martelo é referente a questões da das</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/394-3
00:30:07.738 --> 00:30:09.203
<v Gabriel Vieira De Souza>validações ali do.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/395-0
00:30:10.483 --> 00:30:12.803
<v Gabriel Vieira De Souza>É do documento, né?</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/398-0
00:30:14.403 --> 00:30:21.626
<v Gabriel Vieira De Souza>Espera aí que essa validação ela vai ser
feita ali pela pela bap ou ela vai ser</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/398-1
00:30:21.626 --> 00:30:26.411
<v Gabriel Vieira De Souza>feita é por nós?
Então a validação de linha é linha,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/398-2
00:30:26.411 --> 00:30:30.203
<v Gabriel Vieira De Souza>qual que é a diferença? A bap já é ali do.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/399-0
00:30:30.683 --> 00:30:36.639
<v Gabriel Vieira De Souza>Standard do SAP, ele tem as suas regras,
é um código que o SAP criou ou eu vou ter</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/399-1
00:30:36.639 --> 00:30:40.443
<v Gabriel Vieira De Souza>que fazer essa validação antes de mandar
para o SAP?</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/400-0
00:30:42.603 --> 00:30:45.213
<v Fabricio Pereira Santana>Então,
essa validação vai ter a validação da</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/400-1
00:30:45.213 --> 00:30:48.809
<v Fabricio Pereira Santana>ABAP, que é o check,
e a outra validação é daquele aplicativo</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/400-2
00:30:48.809 --> 00:30:49.563
<v Fabricio Pereira Santana>de parâmetro.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/401-0
00:30:51.883 --> 00:30:52.763
<v Fabricio Pereira Santana>David volta lá.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/402-0
00:30:52.043 --> 00:30:55.243
<v Gabriel Vieira De Souza>Ah sim sim sim de</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/409-0
00:30:53.963 --> 00:30:59.619
<v Fabricio Pereira Santana>Isso então a validação do do SAP ela tem
que manter porque ele faz toda a</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/409-1
00:30:59.619 --> 00:31:02.523
<v Fabricio Pereira Santana>validação ali né então ele já consegue</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/406-0
00:31:01.483 --> 00:31:02.163
<v Gabriel Vieira De Souza>Santos a test.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/410-0
00:31:03.323 --> 00:31:04.203
<v Gabriel Vieira De Souza>It's exact, you know.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/411-0
00:31:03.923 --> 00:31:08.603
<v Fabricio Pereira Santana>Espera aí, isso. E aí, calma aí, calma aí,
espera aí.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/415-0
00:31:17.083 --> 00:31:20.861
<v Gabriel Vieira De Souza>Eu acho que 2 negócio de parâmetro que
você falou isso dos tipos de movimento e</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/415-1
00:31:20.861 --> 00:31:23.883
<v Gabriel Vieira De Souza>também tem os outros parâmetros que está
lá no início do slide.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/416-0
00:31:25.403 --> 00:31:27.723
<v Fabricio Pereira Santana>Isso aí, oh, se você for olhar ali.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/417-0
00:31:30.363 --> 00:31:30.403
<v Fabricio Pereira Santana>Uh</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/418-0
00:31:32.283 --> 00:31:36.283
<v Fabricio Pereira Santana>Por exemplo, na linha, no slide 28 aí.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/419-0
00:31:40.043 --> 00:31:40.603
<v Gabriel Vieira De Souza>Thank you.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/420-0
00:31:41.563 --> 00:31:42.123
<v Fabricio Pereira Santana>Is.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/423-0
00:31:43.483 --> 00:31:49.210
<v Fabricio Pereira Santana>O que acontece, tá, cara?
A gente colocou esses retornos aqui na</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/423-1
00:31:49.210 --> 00:31:53.615
<v Fabricio Pereira Santana>mensagem de erro,
porque o cliente ele precisava,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/423-2
00:31:53.615 --> 00:31:56.523
<v Fabricio Pereira Santana>ele queria essa descrição, então.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/425-0
00:31:57.643 --> 00:32:03.160
<v Fabricio Pereira Santana>Muita mensagem de erro dessa aqui,
OA própria SAP, ela retorna, tá? Então,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/425-1
00:32:03.160 --> 00:32:04.043
<v Fabricio Pereira Santana>por exemplo.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/424-0
00:32:03.163 --> 00:32:03.523
<v Gabriel Vieira De Souza>Mhm.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/426-0
00:32:05.083 --> 00:32:06.683
<v Fabricio Pereira Santana>valor deve ser mais do que zero.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/429-0
00:32:08.203 --> 00:32:11.796
<v Fabricio Pereira Santana>Entendeu? Quando eu faço na ABAP,
quando eu passo na ABAP,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/427-0
00:32:11.123 --> 00:32:11.483
<v Gabriel Vieira De Souza>Mhm.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/429-1
00:32:11.796 --> 00:32:15.390
<v Fabricio Pereira Santana>ele tem esse retorno, é 28 não, desculpa,
eu tô no 29, tá?</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/429-2
00:32:15.390 --> 00:32:19.166
<v Fabricio Pereira Santana>É que eu tô falando do 28 mais zero é
tanto no 28 como no 29,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/429-3
00:32:19.166 --> 00:32:23.003
<v Fabricio Pereira Santana>valores deve ser maior que zero na linha
zero 60 aí, tá vendo?</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/428-0
00:32:19.483 --> 00:32:19.883
<v Gabriel Vieira De Souza>Mhm.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/436-0
00:32:23.963 --> 00:32:28.864
<v Fabricio Pereira Santana>Esse erro a SAP retorna, normal,
tanto pela minha BAP ali.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/436-1
00:32:28.864 --> 00:32:34.347
<v Fabricio Pereira Santana>Então a maioria desses erros aqui vão
acontecer, tá? Já é padrão,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/436-2
00:32:34.347 --> 00:32:39.083
<v Fabricio Pereira Santana>a própria SAP ela já retorna através da
BAP de check lá.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/440-0
00:32:40.843 --> 00:32:43.540
<v Fabricio Pereira Santana>É,
o que a gente vai precisar mesmo é só</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/439-0
00:32:42.363 --> 00:32:43.483
<v Gabriel Vieira De Souza>That's about a Ponce.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/440-1
00:32:43.540 --> 00:32:47.225
<v Fabricio Pereira Santana>criar os isso,
é o que a gente precisa mesmo é só criar</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/440-2
00:32:47.225 --> 00:32:50.383
<v Fabricio Pereira Santana>os erros da tela de parâmetro, né?
Por exemplo,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/440-3
00:32:50.383 --> 00:32:54.923
<v Fabricio Pereira Santana>quando for fazer a validação de parâmetro,
aí identifiquei lá que é.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/443-0
00:32:56.443 --> 00:33:00.008
<v Fabricio Pereira Santana>Que bem cara,
que eu tô achando que nem vai precisar,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/443-1
00:33:00.008 --> 00:33:03.243
<v Fabricio Pereira Santana>velho, porque eu faço o check,
porque todos, ah.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/446-0
00:33:00.043 --> 00:33:05.974
<v Gabriel Vieira De Souza>É porque assim, o que acontece?
O retorno de erro que a bapcheck ela traz,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/446-1
00:33:05.974 --> 00:33:10.718
<v Gabriel Vieira De Souza>esse daí já é a mensagem padrão,
não tenho muito que mudar.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/444-0
00:33:10.363 --> 00:33:12.443
<v Fabricio Pereira Santana>Sim, não vai precisar.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/446-2
00:33:10.718 --> 00:33:17.203
<v Gabriel Vieira De Souza>Eu até tenho esse poder de passar a vou
interceptar esse erro e mudar a mensagem.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/445-0
00:33:14.203 --> 00:33:14.523
<v Fabricio Pereira Santana>No.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/447-0
00:33:17.403 --> 00:33:21.630
<v Gabriel Vieira De Souza>Mas eu acho que é um trabalho,
é tanto quanto desnecessário e a gente</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/447-1
00:33:21.630 --> 00:33:23.563
<v Gabriel Vieira De Souza>tentar mudar o que ficar padrão.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/448-0
00:33:21.803 --> 00:33:27.138
<v Fabricio Pereira Santana>Não, nem precisa, nem precisa. Eu acho.
É porque eu acho que é do parâmetro.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/448-1
00:33:27.138 --> 00:33:29.563
<v Fabricio Pereira Santana>Eu conseguiria, mas eu não preciso.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/453-0
00:33:30.683 --> 00:33:33.643
<v Fabricio Pereira Santana>Não, eu acho que não vou precisar, porque,
cara,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/449-0
00:33:31.003 --> 00:33:31.243
<v Gabriel Vieira De Souza>A.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/453-1
00:33:33.643 --> 00:33:38.598
<v Fabricio Pereira Santana>eu não vou precisar criar esse catálogo
de mensagem não, velho. O retorno da BAP,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/453-2
00:33:38.598 --> 00:33:43.552
<v Fabricio Pereira Santana>ele é bem específico quanto a erro, tá?
Ele consegue sinalizar exatamente o ponto</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/452-0
00:33:41.963 --> 00:33:42.363
<v Gabriel Vieira De Souza>Yeah.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/453-3
00:33:43.552 --> 00:33:47.359
<v Fabricio Pereira Santana>AO arquivo está com erro,
ele vai identificar se o arquivo não</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/453-4
00:33:47.359 --> 00:33:47.963
<v Fabricio Pereira Santana>bater ali.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/456-0
00:33:48.003 --> 00:33:51.453
<v Fabricio Pereira Santana>Por exemplo,
o modelo que está diferente é como você</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/456-1
00:33:51.453 --> 00:33:55.163
<v Fabricio Pereira Santana>está fazendo Z.
Eu acho que esse sim você vai ter que é.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/457-0
00:33:56.283 --> 00:33:58.864
<v Fabricio Pereira Santana>Tem que validar,
que é o modelo do arquivo,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/457-1
00:33:58.864 --> 00:33:59.803
<v Fabricio Pereira Santana>simplesmente só.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/463-0
00:34:01.003 --> 00:34:04.747
<v Fabricio Pereira Santana>Porque, por exemplo,
ele vai baixar um modelo lá e aí se ele</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/463-1
00:34:04.747 --> 00:34:08.307
<v Fabricio Pereira Santana>subir um outro modelo,
ABAP ela não vai fazer esse check,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/463-2
00:34:08.307 --> 00:34:11.191
<v Fabricio Pereira Santana>porque quem está fazendo é o aplicativo
em si.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/460-0
00:34:08.763 --> 00:34:09.003
<v Gabriel Vieira De Souza>Then.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/463-3
00:34:11.191 --> 00:34:13.953
<v Fabricio Pereira Santana>Aí depois ABAP vai fazer só nos
lançamentos,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/463-4
00:34:13.953 --> 00:34:16.163
<v Fabricio Pereira Santana>se o modelo está certinho ali do do.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/464-0
00:34:16.603 --> 00:34:16.643
<v Fabricio Pereira Santana>Oh.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/466-0
00:34:18.043 --> 00:34:21.643
<v Fabricio Pereira Santana>Do Excel, os outros erros ali,
o próprio ABAP ela retorna.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/465-0
00:34:19.523 --> 00:34:19.923
<v Gabriel Vieira De Souza>Mhm.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/467-0
00:34:22.363 --> 00:34:23.403
<v Gabriel Vieira De Souza>É exatamente.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/469-0
00:34:24.523 --> 00:34:31.148
<v Gabriel Vieira De Souza>Então aí a gente segue então com essa
questão de validação sendo feita pela</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/469-1
00:34:31.148 --> 00:34:35.419
<v Gabriel Vieira De Souza>ABAPE, e a gente retorna os valores,
os valores,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/468-0
00:34:31.403 --> 00:34:31.963
<v Fabricio Pereira Santana>Is.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/469-2
00:34:35.419 --> 00:34:39.603
<v Gabriel Vieira De Souza>não as mensais padrões da própria ABAPE
do SAP.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/471-0
00:34:40.443 --> 00:34:45.349
<v Fabricio Pereira Santana>Isso aí é, eu tenho uma f aqui,
eu vou te mandar aqui depois,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/470-0
00:34:42.043 --> 00:34:45.043
<v Gabriel Vieira De Souza>É uma dúvida também, desculpa, pode falar.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/471-1
00:34:45.349 --> 00:34:47.723
<v Fabricio Pereira Santana>mas pode falar, pode falar aí.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/474-0
00:34:48.523 --> 00:34:55.872
<v Gabriel Vieira De Souza>uma dúvida aqui é referente a esse slide
aqui 17 se eu não me engano 19 aqui o</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/474-1
00:34:55.872 --> 00:35:03.501
<v Gabriel Vieira De Souza>último passo aqui né vamos lá fizemos o
post da Barbosa perfeito esse blog do que</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/474-2
00:35:03.501 --> 00:35:05.083
<v Gabriel Vieira De Souza>é Francisco sócio</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/477-0
00:35:05.563 --> 00:35:09.825
<v Gabriel Vieira De Souza>Eu confesso que, cara,
são quase 50 slides, velho.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/477-1
00:35:09.825 --> 00:35:14.923
<v Gabriel Vieira De Souza>Eu não consegui ler todos e eu passei
duas horas lendo eles.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/478-0
00:35:10.763 --> 00:35:17.083
<v Fabricio Pereira Santana>não é slide para caramba mas esse aí esse
aí é aquela Abre lá o que ele aquele</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/478-1
00:35:17.083 --> 00:35:18.923
<v Fabricio Pereira Santana>printinho que eu mandei</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/482-0
00:35:23.083 --> 00:35:28.683
<v Fabricio Pereira Santana>É o outro, isso esse aí é essa linha,
essa nessa nessa tela 2 aí, está vendo?</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/481-0
00:35:24.483 --> 00:35:25.163
<v Gabriel Vieira De Souza>This aqui.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/485-0
00:35:29.883 --> 00:35:30.123
<v Gabriel Vieira De Souza>Uh-huh.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/487-0
00:35:29.883 --> 00:35:32.843
<v Fabricio Pereira Santana>Aí, ó, aí embaixo, ó, aí, é.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/486-0
00:35:31.523 --> 00:35:31.883
<v Gabriel Vieira De Souza>I see.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/488-0
00:35:34.043 --> 00:35:35.163
<v Gabriel Vieira De Souza>Seria isso daqui?</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/489-0
00:35:34.043 --> 00:35:37.803
<v Fabricio Pereira Santana>É basicamente isso, isso aí é o logzinho,
entendeu?</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/490-0
00:35:37.003 --> 00:35:40.862
<v Gabriel Vieira De Souza>Então não é um log que eu vou ter que
salvar numa tabela,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/490-1
00:35:40.862 --> 00:35:44.323
<v Gabriel Vieira De Souza>é só um log do que foi lançado e que não
foi então.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/493-0
00:35:44.523 --> 00:35:45.883
<v Fabricio Pereira Santana>Do you say perfect?</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/494-0
00:35:46.923 --> 00:35:50.382
<v Gabriel Vieira De Souza>Entendi esse log,
ele não precisa ser salvo em lugar nenhum,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/494-1
00:35:50.382 --> 00:35:52.083
<v Gabriel Vieira De Souza>só mostrar ali na hora, não é?</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/495-0
00:35:53.243 --> 00:35:54.683
<v Fabricio Pereira Santana>Não, não precisa, cara.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/496-0
00:35:54.283 --> 00:35:55.403
<v Matheus Freitas Dos Santos>Não precisa.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/497-0
00:35:56.123 --> 00:35:57.963
<v Fabricio Pereira Santana>Eu acho que não, porque, cara.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/498-0
00:35:58.443 --> 00:36:00.123
<v Matheus Freitas Dos Santos>Porque de acordo com o que está.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/499-0
00:36:02.123 --> 00:36:06.758
<v Fabricio Pereira Santana>Não, mas porque se aí se eu fizer isso,
eu vou ter que criar um outro aplicativo</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/499-1
00:36:06.758 --> 00:36:10.363
<v Fabricio Pereira Santana>de log só para esse,
para ver do que os caras importaram, não?</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/500-0
00:36:13.563 --> 00:36:19.963
<v Gabriel Vieira De Souza>então pelo que eu entendo aqui ele mostra
qual é a carga que foi é</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/504-0
00:36:21.003 --> 00:36:26.859
<v Gabriel Vieira De Souza>Foi lançado ou não é agora, por exemplo,
uma tela que vai olhar o que,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/501-0
00:36:22.003 --> 00:36:22.843
<v Fabricio Pereira Santana>Lançado.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/504-1
00:36:26.859 --> 00:36:32.798
<v Gabriel Vieira De Souza>qual é o sítio que sítio e sócio,
débito e crédito não está nesse nessa</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/504-2
00:36:32.798 --> 00:36:36.923
<v Gabriel Vieira De Souza>demanda aí não, pelo menos que eu entendi,
não é?</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/506-0
00:36:37.243 --> 00:36:40.372
<v Gabriel Vieira De Souza>A gente pode adicionar,
mas eu acho que não é isso que ele está</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/505-0
00:36:37.723 --> 00:36:38.123
<v Fabricio Pereira Santana>I think.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/506-1
00:36:40.372 --> 00:36:40.763
<v Gabriel Vieira De Souza>pedindo.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/507-0
00:36:41.803 --> 00:36:45.963
<v Fabricio Pereira Santana>Eu estou vendo aqui se você falou alguma
coisa de ter um relatório disso aqui.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/508-0
00:36:49.083 --> 00:36:50.763
<v Fabricio Pereira Santana>Agrupamento.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/509-0
00:36:50.443 --> 00:36:53.083
<v Gabriel Vieira De Souza>Ele já teria que ser um terceiro APP no
caso.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/510-0
00:36:54.083 --> 00:36:54.443
<v Fabricio Pereira Santana>Sim.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/511-0
00:36:58.843 --> 00:37:01.963
<v Fabricio Pereira Santana>A modelo usuário em forma intensamente.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/512-0
00:37:01.163 --> 00:37:05.993
<v Matheus Freitas Dos Santos>Então, não necessariamente, porque,
por exemplo, se é log,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/512-1
00:37:05.993 --> 00:37:12.789
<v Matheus Freitas Dos Santos>provavelmente você vai ter que armazenar,
porque como é que você vai visualizar um</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/512-2
00:37:12.789 --> 00:37:15.163
<v Matheus Freitas Dos Santos>log sem os dados armazenados?</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/515-0
00:37:16.043 --> 00:37:19.984
<v Gabriel Vieira De Souza>Então é justamente essa dúvida que eu
trouxe,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/515-1
00:37:19.984 --> 00:37:26.753
<v Gabriel Vieira De Souza>se eu preciso armazenar ele numa tabela
ou se esse log aqui é como se fosse só</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/515-2
00:37:26.753 --> 00:37:30.523
<v Gabriel Vieira De Souza>ali um pop-up mostrando o que foi feito
na.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/518-0
00:37:31.323 --> 00:37:34.843
<v Gabriel Vieira De Souza>No final da de quando carregou, entendeu?</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/519-0
00:37:36.283 --> 00:37:38.443
<v Fabricio Pereira Santana>Mas aí volta lá, quer ver? Volta lá.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/522-0
00:37:39.003 --> 00:37:42.923
<v Matheus Freitas Dos Santos>É só criar uma tabela e colocar ali nessa.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/523-0
00:37:42.203 --> 00:37:45.803
<v Fabricio Pereira Santana>É porque é, vamos lá,
ele quando ele vai conseguir.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/526-0
00:37:44.443 --> 00:37:49.336
<v Gabriel Vieira De Souza>Mas aí não é só criar uma tabela,
é criar uma tabela,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/524-0
00:37:47.163 --> 00:37:47.963
<v Matheus Freitas Dos Santos>Let's sing it.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/526-1
00:37:49.336 --> 00:37:53.323
<v Gabriel Vieira De Souza>é criar um app para poder listar o os
logs.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/529-0
00:37:52.563 --> 00:37:56.910
<v Matheus Freitas Dos Santos>Não, não precisa.
Do mesmo jeito que esse segundo,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/529-1
00:37:56.910 --> 00:38:03.643
<v Matheus Freitas Dos Santos>esse segundo você vai ter que fazer
também, vai ser a mesma coisa do de baixo.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/530-0
00:38:05.923 --> 00:38:09.163
<v Gabriel Vieira De Souza>O de baixo com o de baixo,
lap 2 ou tela 2?</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/533-0
00:38:08.123 --> 00:38:13.907
<v Matheus Freitas Dos Santos>O não a tela 2, porque a tela 2, a tela 2,
esse documentos aí você vai ter que</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/533-1
00:38:13.907 --> 00:38:18.520
<v Matheus Freitas Dos Santos>querer. É uma tabela.
Isso daí vai ficar armazenado na tabela.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/531-0
00:38:16.563 --> 00:38:17.003
<v Gabriel Vieira De Souza>Sing.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/533-2
00:38:18.520 --> 00:38:21.083
<v Matheus Freitas Dos Santos>Esse segundo vai ser a mesma coisa.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/532-0
00:38:19.123 --> 00:38:19.483
<v Gabriel Vieira De Souza>Sing.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/534-0
00:38:22.043 --> 00:38:23.803
<v Gabriel Vieira De Souza>Esse segundo o que? Eu não entendi.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/536-0
00:38:25.083 --> 00:38:29.388
<v Matheus Freitas Dos Santos>Essa é essa segunda linha que é o log,
porque pelo que eu entendi,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/536-1
00:38:29.388 --> 00:38:32.923
<v Matheus Freitas Dos Santos>essa linha linhas do documentos é log,
certo Fabricio?</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/535-0
00:38:30.123 --> 00:38:30.443
<v Gabriel Vieira De Souza>Look.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/538-0
00:38:32.763 --> 00:38:37.578
<v Gabriel Vieira De Souza>Não, o log é um registro.
O que que é o log?</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/537-0
00:38:33.563 --> 00:38:33.803
<v Fabricio Pereira Santana>You.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/538-1
00:38:37.578 --> 00:38:45.069
<v Gabriel Vieira De Souza>A palavra no contexto geral,
quando a gente vai falar em programação,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/538-2
00:38:45.069 --> 00:38:49.243
<v Gabriel Vieira De Souza>é um registro de que o código fez algo.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/539-0
00:38:49.483 --> 00:38:53.458
<v Gabriel Vieira De Souza>Então, por exemplo,
se você tem lá seu aplicativo de banco e</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/539-1
00:38:53.458 --> 00:38:58.606
<v Gabriel Vieira De Souza>o banco por acaso quer quer criar um
relatório de quantas vezes você acessou o</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/539-2
00:38:58.606 --> 00:39:02.125
<v Gabriel Vieira De Souza>seu extrato,
ele vai adicionar ali para ser criado um</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/539-3
00:39:02.125 --> 00:39:05.123
<v Gabriel Vieira De Souza>log. Toda vez que você clica em extrato,
ele.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/541-0
00:39:05.723 --> 00:39:11.256
<v Gabriel Vieira De Souza>guardar algumas informações como horário,
etc, etc. Isso que é uma geração de log.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/541-1
00:39:11.256 --> 00:39:15.656
<v Gabriel Vieira De Souza>E aí passou-se, sei lá,
um mês ele vai conseguir ter uma cacetada</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/541-2
00:39:15.656 --> 00:39:19.389
<v Gabriel Vieira De Souza>de informações sobre você sem você nem
saber, entendeu?</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/541-3
00:39:19.389 --> 00:39:21.123
<v Gabriel Vieira De Souza>Isso é um registro de log.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/540-0
00:39:20.763 --> 00:39:20.803
<v Fabricio Pereira Santana>Oh.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/542-0
00:39:21.803 --> 00:39:27.795
<v Gabriel Vieira De Souza>isso daqui que mostra na tela dois não é
um log é de fato um dado que vai ser</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/542-1
00:39:27.795 --> 00:39:33.403
<v Gabriel Vieira De Souza>mostrado para o cliente entendeu É só
questão de conceito mesmo entendeu</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/544-0
00:39:31.123 --> 00:39:35.083
<v Fabricio Pereira Santana>Mas tipo assim, eu, mas por exemplo,
mas vamos lá, por exemplo, aqui eu fiz,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/544-1
00:39:35.083 --> 00:39:38.683
<v Fabricio Pereira Santana>eu fui lá e importei o arquivo,
baixei o modelo e importei o arquivo.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/543-0
00:39:39.163 --> 00:39:39.483
<v Gabriel Vieira De Souza>Oh.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/546-0
00:39:39.883 --> 00:39:46.311
<v Fabricio Pereira Santana>Ele ficou ali lançado como lançado.
Digamos que ele está como lançado ali</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/546-1
00:39:46.311 --> 00:39:50.481
<v Fabricio Pereira Santana>normal.
Aí está ali o lançado 700 aí tem o 200,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/545-0
00:39:47.163 --> 00:39:47.403
<v Gabriel Vieira De Souza>Mm.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/546-2
00:39:50.481 --> 00:39:54.043
<v Fabricio Pereira Santana>porque são 2 documentos em um arquivo só.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/547-0
00:39:55.483 --> 00:40:01.712
<v Fabricio Pereira Santana>E aí esse primeiro é, eu tenho,
eu tenho essa informação que o 700 ficou</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/547-1
00:40:01.712 --> 00:40:03.163
<v Fabricio Pereira Santana>desse jeito aqui.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/548-0
00:40:04.363 --> 00:40:08.276
<v Fabricio Pereira Santana>Eu não necessariamente, por exemplo,
digamos que eu saia da tela,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/548-1
00:40:08.276 --> 00:40:09.403
<v Fabricio Pereira Santana>se eu sair da tela,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/550-0
00:40:10.363 --> 00:40:14.949
<v Fabricio Pereira Santana>É, eu. Ele soma essa informação para mim.
Seria isso? Ele não vai,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/549-0
00:40:13.643 --> 00:40:14.243
<v Gabriel Vieira De Souza>Mm-hmm.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/550-1
00:40:14.949 --> 00:40:17.003
<v Fabricio Pereira Santana>não vai estar aparecendo mais.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/551-0
00:40:17.723 --> 00:40:22.076
<v Gabriel Vieira De Souza>Eu tenho as 2 opções igual o Matheus
falou e de guardar,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/551-1
00:40:22.076 --> 00:40:27.192
<v Gabriel Vieira De Souza>aí eu teria que guardar essas informações
numa tabela, é ou é não,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/551-2
00:40:27.192 --> 00:40:31.163
<v Gabriel Vieira De Souza>ou além de ele sumir e não aparecer mais,
entendeu?</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/552-0
00:40:31.203 --> 00:40:34.662
<v Fabricio Pereira Santana>Não guarda, guarda, cara, porque vamos lá,
vai chegar lá.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/552-1
00:40:34.662 --> 00:40:38.837
<v Fabricio Pereira Santana>Daqui a pouco o cliente vai.
Eu não lembro de ter colocado esse aqui.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/552-2
00:40:38.837 --> 00:40:42.833
<v Fabricio Pereira Santana>Eu coloquei o log, está,
mas eu não coloquei um log para ele poder</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/552-3
00:40:42.833 --> 00:40:46.710
<v Fabricio Pereira Santana>tirar esse relatório de log dele e
verificar o que ele importou,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/552-4
00:40:46.710 --> 00:40:47.963
<v Fabricio Pereira Santana>que ele não importou.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/553-0
00:40:48.763 --> 00:40:51.803
<v Fabricio Pereira Santana>Mas deixa, Mano, tipo,
considera o esforço a mais.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/554-0
00:40:53.203 --> 00:40:55.003
<v Fabricio Pereira Santana>Entendeu? E armazena isso.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/557-0
00:40:56.283 --> 00:41:00.523
<v Fabricio Pereira Santana>Mas eu não preciso necessariamente ter um
outro aplicativo para isso, entendeu?</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/556-0
00:40:56.763 --> 00:40:57.083
<v Gabriel Vieira De Souza>Tá.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/558-0
00:41:01.803 --> 00:41:02.363
<v Gabriel Vieira De Souza>Tá bom?</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/559-0
00:41:03.643 --> 00:41:07.716
<v Fabricio Pereira Santana>Porque pensa o seguinte, eu fui lá,
fiz a importação, sei lá, caiu a energia,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/559-1
00:41:07.716 --> 00:41:11.163
<v Fabricio Pereira Santana>o cara quer voltar para ver como é que
está a situação, entendeu?</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/560-0
00:41:12.123 --> 00:41:12.603
<v Gabriel Vieira De Souza>Entendi.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/565-0
00:41:14.683 --> 00:41:21.035
<v Gabriel Vieira De Souza>ficou claro para mim esse ponto então eu
vou eu tô tirando dúvidas aqui né mas eu</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/565-1
00:41:21.035 --> 00:41:27.231
<v Gabriel Vieira De Souza>tenho certeza que vão surgir mais porque
eu vou depois dessa reunião é desenhar</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/564-0
00:41:24.243 --> 00:41:25.483
<v Fabricio Pereira Santana>Não, tranquilo, pô.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/565-2
00:41:27.231 --> 00:41:29.323
<v Gabriel Vieira De Souza>arquitetura atualizar assim</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/568-0
00:41:29.603 --> 00:41:34.947
<v Gabriel Vieira De Souza>Desenhar também a meio que o protótipo da
tela que eu vou entregar para vocês,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/568-1
00:41:34.947 --> 00:41:39.886
<v Gabriel Vieira De Souza>fazer algumas pesquisas um pouco mais
aprofundadas para depois até mesmo</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/568-2
00:41:39.886 --> 00:41:45.163
<v Gabriel Vieira De Souza>conseguir definir quanto tempo eu consigo
entregar esse aplicativo, entendeu?</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/569-0
00:41:45.803 --> 00:41:46.443
<v Fabricio Pereira Santana>Entendi.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/570-0
00:41:46.043 --> 00:41:46.603
<v Gabriel Vieira De Souza>É.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/571-0
00:41:47.643 --> 00:41:53.321
<v Gabriel Vieira De Souza>Então aí provavelmente, talvez eu pare,
depois ligue para vocês ou a gente marca</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/572-0
00:41:52.763 --> 00:41:57.723
<v Fabricio Pereira Santana>Não tem problema não. Eu fiz uma EF aqui,
eu te vou te mandar EF aqui.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/571-1
00:41:53.321 --> 00:41:55.003
<v Gabriel Vieira De Souza>outra reunião, está bom?</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/574-0
00:42:03.483 --> 00:42:05.826
<v Gabriel Vieira De Souza>Tá, é,
deixa eu ver aqui se eu tinha anotado</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/574-1
00:42:05.826 --> 00:42:06.763
<v Gabriel Vieira De Souza>mais alguma coisa.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/578-0
00:42:13.323 --> 00:42:18.339
<v Matheus Freitas Dos Santos>O Fabricio,
no caso ali lá em cima tava dizendo que</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/578-1
00:42:18.339 --> 00:42:23.645
<v Matheus Freitas Dos Santos>precisa ser com draft o aplicativo,
mas precisa mesmo,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/578-2
00:42:23.645 --> 00:42:26.443
<v Matheus Freitas Dos Santos>porque ele não tem ações, né?</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/579-0
00:42:26.923 --> 00:42:31.723
<v Fabricio Pereira Santana>Não, não precisa não. Na verdade tem, né?
Eu posso aquele esquema lá.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/581-0
00:42:30.683 --> 00:42:37.003
<v Matheus Freitas Dos Santos>Não, ação de criar não, criar, deletar,
de criar não tem, não é só upload.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/583-0
00:42:36.203 --> 00:42:40.633
<v Fabricio Pereira Santana>Não de criar, não, eu tenho o upload, mas,
por exemplo, eu tenho,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/582-0
00:42:39.403 --> 00:42:40.363
<v Matheus Freitas Dos Santos>E uma dele.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/583-1
00:42:40.633 --> 00:42:42.043
<v Fabricio Pereira Santana>eu tenho reprocessar.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/585-0
00:42:43.003 --> 00:42:48.363
<v Fabricio Pereira Santana>vamos lá pensa o seguinte o código do
fornecedor tá é tá lá bloqueado abrir</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/584-0
00:42:43.403 --> 00:42:43.763
<v Matheus Freitas Dos Santos>Mhm.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/589-0
00:42:51.403 --> 00:42:54.658
<v Fabricio Pereira Santana>Olha lá no item 2 lá,
está vendo que está bloqueado o</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/589-1
00:42:54.658 --> 00:42:57.733
<v Fabricio Pereira Santana>fornecedor?
O fornecedor é uma ação que eu faço no</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/589-2
00:42:57.733 --> 00:42:59.723
<v Fabricio Pereira Santana>SAP, não é o erro no meu arquivo.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/591-0
00:43:02.203 --> 00:43:03.083
<v Fabricio Pereira Santana>That is.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/594-0
00:43:04.643 --> 00:43:07.188
<v Fabricio Pereira Santana>Tá vendo?
O fornecedor ele não é um erro no meu</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/594-1
00:43:07.188 --> 00:43:09.893
<v Fabricio Pereira Santana>arquivo,
ele é um erro que ele tá bloqueado porque</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/594-2
00:43:09.893 --> 00:43:11.643
<v Fabricio Pereira Santana>no SAP o fornecedor tá bloqueado.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/595-0
00:43:12.443 --> 00:43:12.523
<v Matheus Freitas Dos Santos>Uh-huh.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/596-0
00:43:14.203 --> 00:43:18.843
<v Matheus Freitas Dos Santos>Não, sim,
mas no o draft não influencia nisso não.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/601-0
00:43:19.083 --> 00:43:23.963
<v Fabricio Pereira Santana>Influencia, não? Então aí é,
não é falta de conhecimento meu, tá, cara?</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/597-0
00:43:20.363 --> 00:43:20.763
<v Matheus Freitas Dos Santos>No.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/601-1
00:43:23.963 --> 00:43:28.843
<v Fabricio Pereira Santana>Eu botei porque pra mim ele influenciaria
no caso para essa parte aqui,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/601-2
00:43:28.843 --> 00:43:33.723
<v Fabricio Pereira Santana>tanto mesmo de reprocessar, né?
Depois que tá ali, não influencia, não.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/600-0
00:43:31.883 --> 00:43:33.483
<v Matheus Freitas Dos Santos>Não influencia, não.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/602-0
00:43:34.123 --> 00:43:35.083
<v Fabricio Pereira Santana>Alright, I'm sure.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/603-0
00:43:36.283 --> 00:43:42.755
<v Gabriel Vieira De Souza>Desculpa, é só porque de fato eu é,
eu não sei se eu já comentei com vocês,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/603-1
00:43:42.755 --> 00:43:48.802
<v Gabriel Vieira De Souza>mas eu sou um desenvolvedor que eu sou
senior em .net, Angular, front,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/603-2
00:43:48.802 --> 00:43:52.123
<v Gabriel Vieira De Souza>back end e eu estou fazendo mudança de.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/605-0
00:43:53.003 --> 00:43:56.014
<v Gabriel Vieira De Souza>De carreira aqui pro SAP e eu peguei
algumas demandas,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/605-1
00:43:56.014 --> 00:43:58.806
<v Gabriel Vieira De Souza>já entreguei algumas demandas,
alguns aplicativos,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/605-2
00:43:58.806 --> 00:44:01.598
<v Gabriel Vieira De Souza>mas ainda tem algumas coisas que eu ainda
não sei,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/605-3
00:44:01.598 --> 00:44:05.485
<v Gabriel Vieira De Souza>tô pegando de acordo com as demandas.
Essa questão de draft aí é o que</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/604-0
00:44:02.363 --> 00:44:02.963
<v Fabricio Pereira Santana>Mm-hmm.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/605-4
00:44:05.485 --> 00:44:08.003
<v Gabriel Vieira De Souza>exatamente?
Só para mim poder aprender mesmo.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/606-0
00:44:08.843 --> 00:44:14.882
<v Matheus Freitas Dos Santos>É como se fosse o rascunho. É rascunho.
No SAP tem uma,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/606-1
00:44:14.882 --> 00:44:19.843
<v Matheus Freitas Dos Santos>tem alguns aplicativos que quando você
edita,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/606-2
00:44:19.843 --> 00:44:25.883
<v Matheus Freitas Dos Santos>ele não salva diretamente na tabela,
anão ser que você.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/608-0
00:44:26.523 --> 00:44:32.546
<v Matheus Freitas Dos Santos>Execute ele até o final. Salve, salva.
Ele fica guardado numa tabela,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/607-0
00:44:29.323 --> 00:44:29.723
<v Gabriel Vieira De Souza>Entendi.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/608-1
00:44:32.546 --> 00:44:38.397
<v Matheus Freitas Dos Santos>como se fosse tabela de rascunho,
esperando a confirmação para você</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/608-2
00:44:38.397 --> 00:44:41.323
<v Matheus Freitas Dos Santos>efetivar. Aí quando você confirma.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/609-0
00:44:41.563 --> 00:44:44.363
<v Matheus Freitas Dos Santos>Aí sim, ele grava na tabela principal.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/610-0
00:44:45.683 --> 00:44:46.763
<v Gabriel Vieira De Souza>Tá okay.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/614-0
00:44:47.803 --> 00:44:50.203
<v Fabricio Pereira Santana>É, eu mandei ver se você recebeu aí.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/611-0
00:44:47.883 --> 00:44:48.683
<v Gabriel Vieira De Souza>Eh.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/612-0
00:44:48.083 --> 00:44:48.643
<v Matheus Freitas Dos Santos>Francisco.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/613-0
00:44:51.323 --> 00:44:51.403
<v Gabriel Vieira De Souza>So.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/621-0
00:45:02.043 --> 00:45:04.946
<v Matheus Freitas Dos Santos>E Fabricio? Cara, me passaram uma bomba,
cara.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/621-1
00:45:04.946 --> 00:45:09.825
<v Matheus Freitas Dos Santos>Mas essa bomba eu não tô conseguindo.
Eu não consegui parar para ver ela ainda</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/621-2
00:45:09.825 --> 00:45:10.443
<v Matheus Freitas Dos Santos>não, cara.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/622-0
00:45:11.403 --> 00:45:11.963
<v Fabricio Pereira Santana>Cool.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/625-0
00:45:12.843 --> 00:45:17.563
<v Matheus Freitas Dos Santos>O 135</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/628-0
00:45:17.723 --> 00:45:19.803
<v Fabricio Pereira Santana>Isso, a sa, a sa, a sa, a big.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/632-0
00:45:21.403 --> 00:45:24.960
<v Matheus Freitas Dos Santos>Então,
eu não consegui parar ainda para ver esse</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/629-0
00:45:22.523 --> 00:45:23.083
<v Fabricio Pereira Santana>Is.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/633-0
00:45:24.283 --> 00:45:29.083
<v Fabricio Pereira Santana>Não, esse é bagulho doido, está?</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/632-1
00:45:24.960 --> 00:45:25.323
<v Matheus Freitas Dos Santos>cara.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/639-0
00:45:30.283 --> 00:45:34.901
<v Fabricio Pereira Santana>Só que Mano,
eu fui contra começar o 135 está o 135</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/634-0
00:45:30.563 --> 00:45:30.923
<v Matheus Freitas Dos Santos>Mhm.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/639-1
00:45:34.901 --> 00:45:39.963
<v Fabricio Pereira Santana>depende de todos os desenvolvimentos que
está dentro do.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/642-0
00:45:38.923 --> 00:45:43.403
<v Matheus Freitas Dos Santos>É, então isso que * ****,
porque tem vários gaps meu parado</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/642-1
00:45:43.403 --> 00:45:46.763
<v Matheus Freitas Dos Santos>justamente por por pendência de outros
gaps.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/647-0
00:45:46.523 --> 00:45:52.156
<v Fabricio Pereira Santana>É esse o ponto. E aí eu até falei,
isso é uma parada que eu falei, cara,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/647-1
00:45:52.156 --> 00:45:57.095
<v Fabricio Pereira Santana>eu não sei. Tipo assim,
eu não sou o melhor consultor do mundo,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/647-2
00:45:57.095 --> 00:46:00.799
<v Fabricio Pereira Santana>não. Sou sênior,
sou sênior há pouco tempo, né?</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/647-3
00:46:00.799 --> 00:46:03.963
<v Fabricio Pereira Santana>Sou sênior há 2 anos só. Mas, cara, é eu.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/654-0
00:46:04.443 --> 00:46:08.460
<v Fabricio Pereira Santana>Fabricio, tá? Eu não tiraria esforço,
por exemplo,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/654-1
00:46:08.460 --> 00:46:12.320
<v Fabricio Pereira Santana>no caso você está com um Monte de gap
parado aí.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/654-2
00:46:12.320 --> 00:46:18.149
<v Fabricio Pereira Santana>Pra que que eu vou colocar o Matheus no
esforço de um gap que é o sei lá,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/654-3
00:46:18.149 --> 00:46:19.803
<v Fabricio Pereira Santana>135 que está gigante?</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/662-0
00:46:20.603 --> 00:46:23.678
<v Fabricio Pereira Santana>Sendo que está dependendo de um monte de
outro.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/662-1
00:46:23.678 --> 00:46:28.932
<v Fabricio Pereira Santana>Não é melhor colocar o Matheus para poder
tentar finalizar aqueles gaps que estão</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/662-2
00:46:28.932 --> 00:46:32.456
<v Fabricio Pereira Santana>de dependência lá,
que são os mandatórios das paradas,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/659-0
00:46:32.443 --> 00:46:33.043
<v Matheus Freitas Dos Santos>Okay, so.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/662-3
00:46:32.456 --> 00:46:35.403
<v Fabricio Pereira Santana>entendeu? Então, tipo assim,
a minha visão é.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/667-0
00:46:35.563 --> 00:46:41.199
<v Fabricio Pereira Santana>Vamos fazer tudo que tem que fazer. Então,
por exemplo, o 135 ele olha gap de SD,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/667-1
00:46:41.199 --> 00:46:45.530
<v Fabricio Pereira Santana>gap de MM, gap de FI,
ele olha gap de tudo que é lugar. Então,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/667-2
00:46:45.530 --> 00:46:50.891
<v Fabricio Pereira Santana>para que que eu vou iniciar uma coisa
sendo que os gap de Fi nem finalizaram,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/667-3
00:46:50.891 --> 00:46:54.603
<v Fabricio Pereira Santana>gap de SD tá lá na metade,
de MM nem iniciou, sei lá.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/668-0
00:46:56.043 --> 00:46:56.763
<v Fabricio Pereira Santana>Entendeu?</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/669-0
00:46:57.123 --> 00:46:57.483
<v Matheus Freitas Dos Santos>Mhm.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/676-0
00:46:58.283 --> 00:47:03.608
<v Fabricio Pereira Santana>É, a gente pode conversar, tá?
O bom é que o 135 ele vai ser, cara,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/676-1
00:47:03.608 --> 00:47:09.639
<v Fabricio Pereira Santana>ele vai ser uma telinha de parâmetro,
que eu vou colocar as informações ali,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/676-2
00:47:09.639 --> 00:47:13.163
<v Fabricio Pereira Santana>e ele vai pegar essas informações da
tabela.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/679-0
00:47:13.883 --> 00:47:15.563
<v Fabricio Pereira Santana>Desses outros gaps, então tipo assim.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/680-0
00:47:16.843 --> 00:47:21.097
<v Fabricio Pereira Santana>Eu tenho uma venda lá,
que ele vai armazenar na tabela lá,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/680-1
00:47:21.097 --> 00:47:21.963
<v Fabricio Pereira Santana>sei lá, GFP.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/688-0
00:47:22.923 --> 00:47:27.393
<v Fabricio Pereira Santana>Eu vou pegar esse valor para eu poder
calcular a taxa. Então, tipo assim,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/688-1
00:47:27.393 --> 00:47:31.077
<v Fabricio Pereira Santana>o valor que está lá é 1000 R$,
show de bola, 1000 R$. Então,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/688-2
00:47:31.077 --> 00:47:35.124
<v Fabricio Pereira Santana>desses 1000 R$ que eu tenho aqui,
eu vou calcular a taxa para esse</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/688-3
00:47:35.124 --> 00:47:37.963
<v Fabricio Pereira Santana>fornecedor, entendeu? Tipo assim,
ele é chato.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/687-0
00:47:36.923 --> 00:47:37.483
<v Matheus Freitas Dos Santos>Jesus.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/691-0
00:47:38.363 --> 00:47:42.421
<v Fabricio Pereira Santana>Mas ele é mais simples,
mas ele precisa de todo mundo bonitinho</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/691-1
00:47:42.421 --> 00:47:43.563
<v Fabricio Pereira Santana>lá para ele rodar.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/699-0
00:47:44.763 --> 00:47:47.715
<v Fabricio Pereira Santana>Entendeu?
O dele é calcular as paradinhas para eu</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/699-1
00:47:47.715 --> 00:47:51.139
<v Fabricio Pereira Santana>poder criar um documento,
para eu poder chamar uma BAP de</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/699-2
00:47:51.139 --> 00:47:54.268
<v Fabricio Pereira Santana>lançamento, entendeu?
Só que para eu poder calcular,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/699-3
00:47:54.268 --> 00:47:58.460
<v Fabricio Pereira Santana>eu preciso que as tabelas lá outras
estejam construídas do outro lado,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/699-4
00:47:58.460 --> 00:48:00.763
<v Fabricio Pereira Santana>como a gente acredita que é para estar.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/696-0
00:48:00.043 --> 00:48:00.083
<v Matheus Freitas Dos Santos>He.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/700-0
00:48:02.843 --> 00:48:03.403
<v Matheus Freitas Dos Santos>Entendi.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/701-0
00:48:04.283 --> 00:48:04.523
<v Fabricio Pereira Santana>No.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/707-0
00:48:05.083 --> 00:48:08.977
<v Matheus Freitas Dos Santos>Oha, eu nem parei ainda pra ver, cara.
Na verdade,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/704-0
00:48:07.403 --> 00:48:07.963
<v Fabricio Pereira Santana>Yeah.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/707-1
00:48:08.977 --> 00:48:14.323
<v Matheus Freitas Dos Santos>o eu vi que ele era que foi dividido,
acho que em várias, vários DPS,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/712-0
00:48:13.963 --> 00:48:17.815
<v Fabricio Pereira Santana>É a gente, porque são 11 taxas,
aí tipo assim,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/707-2
00:48:14.323 --> 00:48:15.163
<v Matheus Freitas Dos Santos>aí no puni.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/712-1
00:48:17.815 --> 00:48:24.043
<v Fabricio Pereira Santana>como cada taxa eu tenho um cálculo,
aí a gente eu tive que separar isso aí.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/720-0
00:48:24.363 --> 00:48:31.012
<v Matheus Freitas Dos Santos>é então aí eu eu abri o primeiro já na
primeira tela lá tem tinha os os</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/720-1
00:48:31.012 --> 00:48:38.584
<v Matheus Freitas Dos Santos>dependentes né aí eu vi uma caralhada de
dependente aí eu falei a cara esquece ou</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/718-0
00:48:34.203 --> 00:48:35.883
<v Fabricio Pereira Santana>É o que se abriu um núcleo.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/717-0
00:48:35.483 --> 00:48:35.523
<v Gabriel Vieira De Souza>Oh.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/719-0
00:48:38.363 --> 00:48:39.403
<v Fabricio Pereira Santana>Você abriu o novo?</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/720-2
00:48:38.584 --> 00:48:39.323
<v Matheus Freitas Dos Santos>deixa eu</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/724-0
00:48:40.843 --> 00:48:44.116
<v Fabricio Pereira Santana>Isso o núcleo é porque no núcleo que eu
coloquei, tipo assim,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/721-0
00:48:41.163 --> 00:48:41.523
<v Matheus Freitas Dos Santos>Eric.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/724-1
00:48:44.116 --> 00:48:48.499
<v Fabricio Pereira Santana>eu preciso desses e nos outros lá é mais
a fórmula de cálculo do que eu vou pegar,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/725-0
00:48:48.203 --> 00:48:57.517
<v Matheus Freitas Dos Santos>entendi aí eu nem nem olhei cara porque
eu também tô com tô com um gueto lá do</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/724-2
00:48:48.499 --> 00:48:51.403
<v Fabricio Pereira Santana>porque eu vou pegar as tabelas e aí eu
faço o cálculo.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/725-1
00:48:57.517 --> 00:48:59.403
<v Matheus Freitas Dos Santos>descarte de MM e</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/729-0
00:49:02.963 --> 00:49:08.624
<v Matheus Freitas Dos Santos>E também relatório do relatório já está
no finalmente, cara, creio eu.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/728-0
00:49:03.523 --> 00:49:03.643
<v Fabricio Pereira Santana>Right.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/729-1
00:49:08.624 --> 00:49:14.364
<v Matheus Freitas Dos Santos>Depois eu te mostro como está,
como está o relatório lá de faturamento,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/729-2
00:49:14.364 --> 00:49:14.683
<v Matheus Freitas Dos Santos>mas.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/731-0
00:49:15.723 --> 00:49:20.837
<v Matheus Freitas Dos Santos>Aí eu falei, ah cara, deixa eu liberar,
porque o Yan Yan liberou.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/731-1
00:49:20.837 --> 00:49:25.873
<v Matheus Freitas Dos Santos>Eu acho que foi ontem, algum,
algumas dependências lá que tinha.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/731-2
00:49:25.873 --> 00:49:31.761
<v Matheus Freitas Dos Santos>Aí eu estou ajustando aqui o gap do
descarte. Aí depois eu volto nesses aí.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/731-3
00:49:31.761 --> 00:49:35.403
<v Matheus Freitas Dos Santos>Aí só depois que eu vejo essa parte aí do
135.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/732-0
00:49:35.563 --> 00:49:35.683
<v Matheus Freitas Dos Santos>Yeah.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/730-0
00:49:36.843 --> 00:49:37.563
<v Fabricio Pereira Santana>Beleza.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/734-0
00:49:38.683 --> 00:49:39.963
<v Fabricio Pereira Santana>Me chama aí qualquer coisa.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/735-0
00:49:38.843 --> 00:49:39.883
<v Matheus Freitas Dos Santos>Mas é isso.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/733-0
00:49:39.163 --> 00:49:39.203
<v Gabriel Vieira De Souza>A.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/738-0
00:49:41.563 --> 00:49:46.203
<v Gabriel Vieira De Souza>Eu dei uma olhada aqui nessa nessa F aqui,
eu fiquei na dúvida, cara.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/744-0
00:49:47.483 --> 00:49:50.734
<v Gabriel Vieira De Souza>É,
ele tem aqui evidências do ambiente 7 do</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/744-1
00:49:50.734 --> 00:49:55.759
<v Gabriel Vieira De Souza>10. Aí eu fiquei na dúvida,
começaram a fazer desenvolvimento disso</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/741-0
00:49:52.523 --> 00:49:52.923
<v Fabricio Pereira Santana>Yes.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/744-2
00:49:55.759 --> 00:49:56.203
<v Gabriel Vieira De Souza>daqui?</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/745-0
00:49:56.683 --> 00:49:59.264
<v Fabricio Pereira Santana>Não, isso é evidências, tipo, por exemplo,
no caso,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/745-1
00:49:59.264 --> 00:50:03.335
<v Fabricio Pereira Santana>como é que tá lá o ambiente em questão de
conta? Eu já fui colocando aqui, então,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/745-2
00:50:03.335 --> 00:50:05.916
<v Fabricio Pereira Santana>por exemplo,
aqui são os códigos de razão especial,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/745-3
00:50:05.916 --> 00:50:06.363
<v Fabricio Pereira Santana>entendeu?</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/754-0
00:50:08.363 --> 00:50:13.539
<v Fabricio Pereira Santana>Por exemplo, está vendo esse CE aí? Se é,
sobe, sobe mais um. Esse um, não, não,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/754-1
00:50:13.539 --> 00:50:18.842
<v Fabricio Pereira Santana>volta, volta aí. É isso, um, dois, três,
só o código de razão especial, né? Então,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/748-0
00:50:14.123 --> 00:50:14.923
<v Gabriel Vieira De Souza>Aqui.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/754-2
00:50:18.842 --> 00:50:23.763
<v Fabricio Pereira Santana>um dos parâmetros que você tem lá é o
código de razão especial, uma telinha.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/751-0
00:50:19.443 --> 00:50:20.043
<v Gabriel Vieira De Souza>Mm-hmm.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/757-0
00:50:24.043 --> 00:50:28.123
<v Fabricio Pereira Santana>Eu só coloquei aí para poder ficar tipo
para poder registrar.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/758-0
00:50:31.083 --> 00:50:31.283
<v Fabricio Pereira Santana>Okay.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/761-0
00:50:36.763 --> 00:50:37.923
<v Fabricio Pereira Santana>Tá não de boa.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/764-0
00:50:37.963 --> 00:50:44.016
<v Gabriel Vieira De Souza>Certo, nas outras demandas que eu fiz,
que estava sendo o processo,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/764-1
00:50:44.016 --> 00:50:50.781
<v Gabriel Vieira De Souza>tinha uma reunião que a gente está tendo,
tirava dúvidas sobre o Delta ali,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/764-2
00:50:50.781 --> 00:50:53.363
<v Gabriel Vieira De Souza>montava ali a minha, a minha.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/768-0
00:50:54.563 --> 00:50:58.392
<v Gabriel Vieira De Souza>digamos assim,
o meu desenho de como que eu ia criar</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/768-1
00:50:58.392 --> 00:51:02.582
<v Gabriel Vieira De Souza>aquele aplicativo, estimava as horas,
fazia o aplicativo,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/768-2
00:51:02.582 --> 00:51:07.278
<v Gabriel Vieira De Souza>depois de fazer o aplicativo,
eu criava a especificação técnica,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/768-3
00:51:07.278 --> 00:51:13.203
<v Gabriel Vieira De Souza>e aí ele de fato ficava na especificação
técnica, o que foi criado no aplicativo.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/766-0
00:51:08.963 --> 00:51:09.043
<v Fabricio Pereira Santana>Uh-huh.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/767-0
00:51:13.123 --> 00:51:13.603
<v Fabricio Pereira Santana>Sim.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/775-0
00:51:14.083 --> 00:51:20.435
<v Gabriel Vieira De Souza>e eu vi que essa especificação já tem
muita coisa né até mesmo falando sobre</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/775-1
00:51:20.435 --> 00:51:26.788
<v Gabriel Vieira De Souza>como criar o aplicativo aí eu queria
entender o quem fez isso daqui o que já</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/775-2
00:51:26.788 --> 00:51:31.243
<v Gabriel Vieira De Souza>pode que já foi criado no ambiente de
Desenvolvimento</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/776-0
00:51:28.283 --> 00:51:34.003
<v Fabricio Pereira Santana>Rapaz, fui eu, fui eu,
fui eu com base no DPS, tá?</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/782-0
00:51:35.203 --> 00:51:39.031
<v Fabricio Pereira Santana>Mas não tem nada desenvolvido.
Eu fiz porque, tipo assim,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/782-1
00:51:39.031 --> 00:51:43.322
<v Fabricio Pereira Santana>teve uns outros deltas, porque cara,
esse formato de não ter EF,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/782-2
00:51:43.322 --> 00:51:48.603
<v Fabricio Pereira Santana>eu acho que é uma parada muito vaga,
entendeu? Tipo assim, porque a EF é o DPS.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/788-0
00:51:49.763 --> 00:51:52.614
<v Fabricio Pereira Santana>Entendeu?
A especificação Funcional é o DPS para</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/788-1
00:51:52.614 --> 00:51:56.279
<v Fabricio Pereira Santana>vocês. Só que cara,
você não consegue colocar muita coisa ali,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/783-0
00:51:53.323 --> 00:51:53.683
<v Gabriel Vieira De Souza>Mhm.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/788-2
00:51:56.279 --> 00:51:59.770
<v Fabricio Pereira Santana>até porque quem valida aquela DPS,
quem aprova é o cliente.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/784-0
00:51:59.523 --> 00:51:59.923
<v Gabriel Vieira De Souza>Mhm.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/788-3
00:51:59.770 --> 00:52:02.970
<v Fabricio Pereira Santana>A gente coloca informação técnica lá,
mas tá separado,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/788-4
00:52:02.970 --> 00:52:05.879
<v Fabricio Pereira Santana>não dá para poder separar.
Aí com base no DPS lá,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/788-5
00:52:05.879 --> 00:52:07.043
<v Fabricio Pereira Santana>eu construo isso aí.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/791-0
00:52:07.283 --> 00:52:09.403
<v Fabricio Pereira Santana>Por isso que eu falei que eu tinha até F
já,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/787-0
00:52:08.403 --> 00:52:09.123
<v Gabriel Vieira De Souza>Entendi.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/791-1
00:52:09.403 --> 00:52:11.712
<v Fabricio Pereira Santana>porque acho que foi o Carlos que tinha
iniciado,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/791-2
00:52:11.712 --> 00:52:14.163
<v Fabricio Pereira Santana>eu tinha iniciado a conversa com o Carlos
lá atrás.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/796-0
00:52:14.963 --> 00:52:19.185
<v Gabriel Vieira De Souza>Entendi, entendi.
É porque nas outras eu não recebi essa EF.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/794-0
00:52:16.643 --> 00:52:18.643
<v Fabricio Pereira Santana>Entendeu? Está 7 do 10, aí?</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/796-1
00:52:19.185 --> 00:52:23.754
<v Gabriel Vieira De Souza>Agora entendi o contexto.
Aqui é meio que o consolidado do que eu</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/795-0
00:52:19.843 --> 00:52:22.243
<v Fabricio Pereira Santana>Não, isso aí, isso aí é por fora, está?</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/796-2
00:52:23.754 --> 00:52:24.723
<v Gabriel Vieira De Souza>preciso fazer.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/799-0
00:52:25.123 --> 00:52:28.536
<v Fabricio Pereira Santana>É, isso aí é por fora, tá?
Isso aí é fonte da minha cabeça, Mano.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/799-1
00:52:28.536 --> 00:52:32.724
<v Fabricio Pereira Santana>Não quer dizer que você precisa seguir,
não. Se pelo que a gente conversou hoje,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/799-2
00:52:32.724 --> 00:52:33.603
<v Fabricio Pereira Santana>você já entendeu.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/800-0
00:52:34.723 --> 00:52:38.272
<v Fabricio Pereira Santana>Está,
eu fiz mesmo por fazer para poder mandar,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/800-1
00:52:38.272 --> 00:52:44.261
<v Fabricio Pereira Santana>até para facilitar a vida de vocês aí.
Mas não é padrão. Tipo assim, não tem EF.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/800-2
00:52:44.261 --> 00:52:46.923
<v Fabricio Pereira Santana>Está nesse projeto. EF é ODPS mesmo.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/807-0
00:52:49.043 --> 00:52:54.043
<v Gabriel Vieira De Souza>Tá, é uma outra. Acho que já está,
já estamos chegando para o final.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/807-1
00:52:54.043 --> 00:52:59.839
<v Gabriel Vieira De Souza>Eu acho que eu vou. Se tiver mais dúvidas,
eu deixo para um segundo momento. É,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/807-2
00:52:59.839 --> 00:53:02.883
<v Gabriel Vieira De Souza>teve alguns slides aqui mais para o final.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/808-0
00:53:04.243 --> 00:53:05.363
<v Gabriel Vieira De Souza>So acho aqui.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/813-0
00:53:06.723 --> 00:53:12.565
<v Gabriel Vieira De Souza>É tanto slide que eu me perco.
Cadê alinhado com arquiteto, definido,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/813-1
00:53:12.565 --> 00:53:13.483
<v Gabriel Vieira De Souza>confirmado.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/814-0
00:53:16.083 --> 00:53:19.498
<v Gabriel Vieira De Souza>Coisas assim, cara,
tem em outros momentos também tem,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/814-1
00:53:19.498 --> 00:53:20.243
<v Gabriel Vieira De Souza>por exemplo.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/826-0
00:53:21.763 --> 00:53:24.734
<v Fabricio Pereira Santana>Ah, não,
esse aí são as premissas para mim, tá?</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/817-0
00:53:22.123 --> 00:53:24.963
<v Gabriel Vieira De Souza>Mas não é bem as coisas que.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/826-1
00:53:24.734 --> 00:53:29.686
<v Fabricio Pereira Santana>São as premissas que eu que eu coloco ali
que tanto que a gente precisa colocar</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/826-2
00:53:29.686 --> 00:53:34.204
<v Fabricio Pereira Santana>essa informação para o usuário lá,
mas são premissas que são necessárias</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/820-0
00:53:32.563 --> 00:53:32.963
<v Gabriel Vieira De Souza>Oh.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/826-3
00:53:34.204 --> 00:53:36.742
<v Fabricio Pereira Santana>para mim,
para você não impacta tanto no</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/826-4
00:53:36.742 --> 00:53:38.723
<v Fabricio Pereira Santana>desenvolvimento, entendeu? É aí.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/823-0
00:53:38.163 --> 00:53:38.563
<v Gabriel Vieira De Souza>Yeah.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/830-0
00:53:38.803 --> 00:53:43.788
<v Fabricio Pereira Santana>Pacto é quando eu tenho, por exemplo,
uma dependência que nem, por exemplo,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/830-1
00:53:43.788 --> 00:53:48.773
<v Fabricio Pereira Santana>Matheus ali, ele vai fazer o ct35.
Ele tem uma premissa que eu preciso que,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/827-0
00:53:45.643 --> 00:53:46.003
<v Gabriel Vieira De Souza>Mhm.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/830-2
00:53:48.773 --> 00:53:53.889
<v Fabricio Pereira Santana>sei lá, tabela de GFP esteja configurada.
Aí o que eu tenho mais de premissa?</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/830-3
00:53:53.889 --> 00:53:55.923
<v Fabricio Pereira Santana>Eu preciso que o campo, sei lá.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/831-0
00:53:56.363 --> 00:54:00.193
<v Fabricio Pereira Santana>Campo Z term da tabela GFP,
ele esteja preenchido,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/831-1
00:54:00.193 --> 00:54:05.901
<v Fabricio Pereira Santana>ele esteja tendo alguma informação,
senão para o desenvolvimento do Matheus</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/831-2
00:54:05.901 --> 00:54:09.807
<v Fabricio Pereira Santana>vai funcionar,
mas vai trazer sem resultado nenhum,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/831-3
00:54:09.807 --> 00:54:10.483
<v Fabricio Pereira Santana>entendeu?</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/834-0
00:54:11.763 --> 00:54:15.591
<v Fabricio Pereira Santana>É meio que essa premissas para poder
seguir com o desenvolvimento,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/832-0
00:54:12.483 --> 00:54:12.883
<v Gabriel Vieira De Souza>Eric.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/834-1
00:54:15.591 --> 00:54:19.134
<v Fabricio Pereira Santana>aí a gente coloca ali,
mas a maioria acho que para esse aqui,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/834-2
00:54:19.134 --> 00:54:22.620
<v Fabricio Pereira Santana>para o seu aqui em si,
são premissas de eu ter os códigos de</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/834-3
00:54:22.620 --> 00:54:25.477
<v Fabricio Pereira Santana>razão especial,
que são aquelas evidências que eu</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/834-4
00:54:25.477 --> 00:54:26.163
<v Fabricio Pereira Santana>coloquei lá.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/835-0
00:54:27.523 --> 00:54:30.596
<v Fabricio Pereira Santana>Então eu preciso do código de razão
especial criado,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/833-0
00:54:28.043 --> 00:54:28.403
<v Gabriel Vieira De Souza>Mhm.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/835-1
00:54:30.596 --> 00:54:35.351
<v Fabricio Pereira Santana>tipo de documento para poder dar sucesso.
Mas isso aí, na hora que eu for testar,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/835-2
00:54:35.351 --> 00:54:38.830
<v Fabricio Pereira Santana>é ele consegue mudar.
Então qual é a premissa? Pô, cheguei,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/835-3
00:54:38.830 --> 00:54:42.483
<v Fabricio Pereira Santana>coloquei um tipo de documento que não
existe. Então eu já sei.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/836-0
00:54:42.723 --> 00:54:46.430
<v Fabricio Pereira Santana>Mas o seu desenvolvimento ali,
o qual do seu desenvolvimento,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/836-1
00:54:46.430 --> 00:54:48.643
<v Fabricio Pereira Santana>ele não vai impactar tanto, entendeu?</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/838-0
00:54:48.883 --> 00:54:54.279
<v Gabriel Vieira De Souza>Show, show. Eu vou, igual eu falei,
é que para pelo menos a reunião aqui,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/838-1
00:54:54.279 --> 00:54:57.706
<v Gabriel Vieira De Souza>as dúvidas que eu tinha,
eu consegui levantar.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/838-2
00:54:57.706 --> 00:55:03.102
<v Gabriel Vieira De Souza>Se vocês quiserem levantar mais algum
ponto de boa também. Mas é isso aí,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/838-3
00:55:03.102 --> 00:55:05.363
<v Gabriel Vieira De Souza>eu vou fazer uma pesquisa aqui.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/839-0
00:55:05.443 --> 00:55:10.321
<v Gabriel Vieira De Souza>Começar a desenhar arquitetura e se
surgir dúvidas, vou agrupando elas aqui,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/837-0
00:55:06.403 --> 00:55:06.963
<v Fabricio Pereira Santana>William is.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/839-1
00:55:10.321 --> 00:55:13.552
<v Gabriel Vieira De Souza>a gente faz uma outra reunião ali e gera
mais uso,</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/839-2
00:55:13.552 --> 00:55:16.403
<v Gabriel Vieira De Souza>senão eu acabo tirando muito tempo de
vocês.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/840-0
00:55:17.683 --> 00:55:20.883
<v Fabricio Pereira Santana>Tranquilo, cara.
Pode ligar a qualquer momento aí.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/841-0
00:55:21.883 --> 00:55:22.323
<v Fabricio Pereira Santana>Fechou.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/843-0
00:55:22.163 --> 00:55:24.323
<v Gabriel Vieira De Souza>show de bola vem fechou</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/842-0
00:55:24.083 --> 00:55:24.643
<v Fabricio Pereira Santana>William.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/844-0
00:55:25.163 --> 00:55:26.203
<v Matheus Freitas Dos Santos>William Santos Santos.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/847-0
00:55:25.763 --> 00:55:26.323
<v Gabriel Vieira De Souza>Valeu.</v>

51d20ce7-9e40-428c-9800-c6a4bb5e2273/848-0
00:55:26.123 --> 00:55:27.443
<v Fabricio Pereira Santana>Follow up. Follow up.</v>
```

</details>
