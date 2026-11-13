---
tags:
  - projeto
  - insi
  - veiling-holambra
  - sap
  - fi
  - del-com-165
  - especificacao
id_demanda: "DEL-COM-165"
tipo: especificacao-funcional
data: 2026-11-11
---
# 01 - Especificação Funcional — Visão da Solução (DEL-COM-165)

📋 [[Consolidado de decisões tomadas em todas as reuniões|Consolidado de Decisões]] | 🎙️ [[01 - Primeira reunião com consultores|1ª Reunião com Consultores]]

Este documento consolida a especificação funcional em alto nível da demanda **`DEL-COM-165` — Carga Massiva de Lançamentos de Taxas com Razão Especial**, estruturada para alinhar **Consultores Funcionais**, **Desenvolvedores ABAP** e **Key Users** com rastreabilidade direta aos slides do Desenho de Proposta de Solução (**DPS**) e às decisões acordadas em reunião de alinhamento técnico.

---

## 1. Contexto do Cliente

* **Modelo Cooperativo e Retenções :** A Cooperativa Veiling Holambra atua na intermediação e comercialização de flores e plantas. Por ser uma cooperativa, não compra nem vende mercadorias para auferir lucro próprio; sua operação é mantida por meio de **taxas** cobradas dos produtores cooperados. Parte dessas taxas funciona como uma **retenção financeira**: a cooperativa retém o valor do produtor por um prazo determinado para devolvê-lo no futuro (*Fundo Rotativo*, *Capital Social*, *Distribuição de Sobras*) ou o mantém como garantia operacional (*Fundo Patrimonial*, *Cotas de Material Circulante*).
* **Separação entre BP Sítio e BP Sócio :** No módulo **SAP FI** (*Financial Accounting* — Contabilidade Financeira), o produtor rural é cadastrado como fornecedor através do conceito de **BP** (*Business Partner* — Parceiro de Negócios), dividido em duas figuras distintas:
  * **BP Sítio:** Representa a propriedade rural que entrega a produção e sofre o desconto financeiro da taxa através da **Conta de Reconciliação** (*conta contábil do Razão Geral vinculada ao cadastro do parceiro*) de número `2101010001` (*Fornecedores – Produtores*).
  * **BP Sócio:** Representa a pessoa física proprietária do sítio. Um mesmo sítio pode ter múltiplos sócios, cada um com seu percentual de participação societária. O desconto sai do pagamento do **Sítio**, mas o saldo retido fica guardado e controlado individualmente em cada **Sócio**.
* **Por que o Aplicativo Standard não atende:**
  * Para que os valores de taxas e fundos retidos no nome do sócio não se misturem com faturas comerciais comuns de fornecedores, cada natureza de retenção exige um código de **Razão Especial** (*Special G/L Indicator* — indicador de 1 caractere no SAP que desvia o lançamento da conta padrão do fornecedor para uma conta contábil específica no plano de contas).
  * Além disso, todos esses lançamentos recebem o **Bloqueio de Pagamento `T`** (*Taxas, Fundos e Cotas de Material Circulante*), impedindo que a rotina automática de pagamentos do SAP (**transação `F110`**) pague esses valores por engano.
  * O SAP já possui um aplicativo padrão para carga de lançamentos contábeis em lote (*Carregar lançamentos contábeis* — `F2548`), porém **esse aplicativo standard não possui o campo de Código de Razão Especial**, tornando obrigatório o desenvolvimento de uma solução customizada.
* **Dor Operacional Atual — AS-IS :** As taxas manuais que exigem Razão Especial (*Capital Social*, *Distribuição de Sobras*, *Cotas de Material Circulante* e ajustes manuais de *Fundo Patrimonial* e *Fundo Rotativo*) são apuradas fora do SAP em planilhas Excel pelas áreas de Contabilidade, Faturamento e Qualidade. Sem uma ferramenta de carga massiva que suporte Razão Especial, o usuário teria que digitar manualmente cada documento contábil no SAP, sócio por sócio, todos os meses (Capital Social), anualmente para toda a base de cooperados (Distribuição de Sobras) e a cada movimentação de cotas, gerando alto risco de erro humano na escolha da Razão Especial, esquecimento do bloqueio `T` e perda de rastreabilidade.

---

## 2. O que precisa ser criado com Desenvolvimento ABAP

Nesta demanda, é necessário criar **2 aplicativos SAP Fiori independentes** construídos no modelo **[[RAP - ABAP RESTful Application Programming Model|RAP]]**, além das tabelas de persistência de dados e classes de processamento no backend:

---
### Aplicativo 1: Carga Massiva de Lançamentos de Taxas com Razão Especial

* **Quem usa:** Analistas de **Contas a Pagar** (para realizar a carga, validação e contabilização) e equipe de **Auditoria/Consulta** (apenas para visualizar o histórico das cargas realizadas).
* **Qual é a função do aplicativo:**
  Funciona como um importador em lote de planilhas Excel, seguindo a mesma experiência visual do aplicativo padrão da SAP de carga contábil (`F2548`), estruturado em uma tela inicial de lista de cargas (*List Report*) que navega para uma segunda tela de detalhamento dos itens e mensagens da carga selecionada (*Object Page*). Nele, o usuário realiza o seguinte fluxo operacional:
  1. **Baixar Modelo:** Na tela inicial, baixa a planilha Excel vazia no formato padronizado esperado pelo sistema (15 colunas).
  2. **Carregar Arquivo:** Faz o upload da planilha preenchida com os valores apurados daquele período, gerando um registro de lote salvo no banco de dados (cabeçalho da carga e seus respectivos itens/documentos).
     * *Decisão Técnica (Gabriel Vieira):* Geração do modelo `.xlsx` e leitura do upload feitas 100% via código ABAP (XCO).
  3. **Verificar (Simular):** O sistema valida a estrutura do arquivo, aplica as regras parametrizadas no Aplicativo 2 e simula a criação de cada documento contábil chamando a função standard **`BAPI_ACC_DOCUMENT_CHECK`**, sem gravar o lançamento contábil ainda .
  4. **Lançar (Contabilizar):** Contabiliza efetivamente os documentos válidos utilizando a função standard **`BAPI_ACC_DOCUMENT_POST`**, gravando o número do documento contábil gerado no SAP (`BELNR`) em cada documento processado com sucesso.
  5. **Consultar Histórico e Tratar Erros:** Na tela de detalhes da carga (*Object Page*), o usuário visualiza o status de cada documento, o número do documento contábil gerado (`BELNR`) para os que deram certo e as mensagens de erro retornadas para os que falharam.
* **Regras de negócio aplicadas a este aplicativo:**
  * **Derivação contábil automática (usuário não digita contabilidade):** O usuário nunca preenche conta contábil, chave de lançamento ou código de Razão Especial no Excel. Ele informa apenas o **Tipo de Movimento** (ex.: `CS-INT`) e o aplicativo deriva automaticamente todas as regras contábeis a partir da parametrização do Aplicativo 2.
  * **Bloqueio de pagamento obrigatório:** Toda partida de fornecedor lançada com Razão Especial recebe automaticamente o bloqueio de pagamento `T` na chamada da BAPI, impedindo o pagamento acidental na `F110`.
  * **Agrupamento de documentos (`DOCSEQ`):** Várias linhas da planilha com o mesmo número sequencial (`DOCSEQ`) formam um único documento contábil no SAP (ex.: 1 linha de Sítio a débito contra 4 linhas de Sócios a crédito). Não é permitido misturar tipos de movimento diferentes dentro do mesmo documento .
  * **Lançamento parcial permitido:** Um arquivo pode conter lançamentos de diversos sítios diferentes. Se um lote tiver vários documentos e um deles apresentar erro, **esse erro não impede o lançamento dos demais documentos válidos**. O sistema contabiliza normalmente os documentos corretos e deixa apenas os documentos com falha pendentes.
  * **Correção de erros de dados sempre via Excel (sem edição em tela):** Caso um documento falhe por erro de preenchimento na planilha (ex.: centro de custo incorreto, data inválida, falta de data base obrigatória), **o usuário não edita os campos na tela do aplicativo**. Ele deve ajustar o arquivo Excel no computador, manter apenas os documentos que precisam ser enviados e realizar uma nova carga `(1ª Reunião - Decisão 02)`.
  * **Eliminação do botão Reprocessar (Decisão Técnica Gabriel Vieira):** Não haverá botão de reprocessamento em tela. Qualquer erro identificado na carga (seja de dado da planilha ou de cadastro externo no SAP) segue o fluxo único e padronizado: o usuário corrige a causa raiz e realiza um novo upload da planilha contendo apenas os documentos pendentes, eliminando complexidade e riscos de duplo fluxo de correção.
  * **Persistência em tabela e dispensa de Draft:** Todo o histórico das cargas e dos resultados por item deve ficar salvo em tabelas de banco de dados para que o usuário possa sair da tela ou recuperar a visualização caso caia a conexão, consultando tudo dentro do próprio Aplicativo 1 (sem necessidade de criar um 3º aplicativo exclusivo de log e sem necessidade de mecanismo de *Draft*/rascunho no RAP) `(1ª Reunião - Decisões 07 e 08)`.

---
### Aplicativo 2: Parametrização de Tipos de Movimento

* **Quem usa:** Usuários-chave (*Key Users*) da **Contabilidade** `(Slide 11, Slide 21 e Slide 31)`.
* **Qual é a função do aplicativo:**
  É um aplicativo SAP Fiori independente voltado para o cadastro e manutenção da tabela de regras dos **Tipos de Movimento** (ex.: `CS-INT` para Integralização de Capital Social, `DS-ATR` para Distribuição de Sobras, `CM-AQU` para Aquisição de Cotas). Permite que a Contabilidade mantenha os parâmetros determinantes de cada movimento sem precisar solicitar alterações de código ABAP.
* **Regras de negócio aplicadas a este aplicativo:**
  * **Definição da regra por Tipo de Movimento:** Para cada código de movimento, o aplicativo parametriza: descrição, **Tipo de Documento Contábil** (`CS`, `DS`, `CM`, `FP`, `FR`), o **Código de Bloqueio de Pagamento** (`T`), a **obrigatoriedade da Data Base de vencimento (`ZFBDT`)**, além do **Código de Razão Especial** e da natureza das partidas/conta contábil (como a conta de reconciliação de fornecedor ou conta do Razão Geral, sem necessidade de cadastrar fornecedores individualmente).
  * **Validação de integridade no cadastro:** Ao salvar um parâmetro, garante que o código de Razão Especial informado existe no SAP (`OBXY`), que o Tipo de Documento existe (`OBA7`) e que o código de bloqueio de pagamento é válido (`OB27`).
  * **Controle de vigência:** Permite definir se o tipo de movimento está ativo e seu período de vigência para uso nas cargas.

---

## 3. Escopo Negativo

Para total alinhamento entre área de negócios, consultoria funcional e desenvolvimento ABAP, a solução **explicitamente NÃO realiza** as seguintes atividades `(Slide 6, Slide 7, Slide 11, Slide 12, Slide 34, Slide 36 e 1ª Reunião)`:

* **Não possui botão de Reprocessar em tela `(Decisão Técnica Gabriel Vieira)`:** O aplicativo não terá ação de reprocessar registros com erro em tela. Todo e qualquer tratamento de erro (inclusive desbloqueios no SAP) segue o fluxo único de reenvio da planilha com os documentos pendentes.
* **Não permite edição inline de campos contábeis na tela de carga `(1ª Reunião - Decisão 02)`:** O Aplicativo 1 não permite editar valores, datas, BPs ou textos diretamente na tabela da tela para corrigir erros de planilha; toda correção de dados de entrada é feita no Excel.
* **Não calcula valores de taxas nem controla tetos `(Slide 11 e Slide 36 - P03)`:** O aplicativo não executa fórmulas de cálculo de Capital Social ou Sobras, nem controla o teto de integralização de R\$ 6.000,00 por sócio. Esses cálculos ocorrem previamente no Relatório de Faturamento (`DEL-COM-015`) ou em apurações externas.
* **Não faz rateio automático entre Sítio e Sócios `(Slide 12 e Slide 36 - P01)`:** O aplicativo não lê o percentual societário no cadastro do BP para dividir um valor cheio automaticamente; a planilha Excel já deve ser importada com as linhas e valores distribuídos para o Sítio e seus respectivos Sócios.
* **Não cria um terceiro aplicativo separado para relatório de logs `(1ª Reunião - Decisão 07)`:** A visualização dos documentos gerados e das mensagens de erro acontece dentro das próprias telas do Aplicativo 1.
* **Não realiza carga inicial de migração `(Slide 3 e Slide 12)`:** Saldos históricos de anos anteriores pertencem ao escopo de migração de dados (`DEL-COM-150`).
* **Não processa transferências automáticas ou pagamentos do Fundo Rotativo `(Slide 3 e Slide 12)`:** A transferência automática de longo para curto prazo do Fundo Rotativo pertence ao `DEL-COM-137`, e o pagamento efetivo aos sócios ocorre via `F110` (`DEL-COM-016A`).
* **Não realiza estorno em massa `(Slide 12, Slide 34 e Slide 38 - Q07)`:** Não há botão para estornar um lote inteiro de uma só vez. O estorno deve ser feito documento a documento pelo aplicativo padrão *Gerenciar lançamentos contábeis* (ou transação `FB08`).
* **Não possui workflow de aprovação `(Slide 17 e Slide 37 - P08)`:** Não há etapa de aprovação de 4 olhos antes da contabilização; o controle ocorre via perfil de autorização e etapa de verificação/simulação.
* **Não contempla taxas sem Razão Especial nem Funrural `(Slide 7 e 1ª Reunião)`:** Taxas manuais comuns contra receita seguem pelo app padrão `F3041`, faturamentos O2C (*Order to Cash* — Contas a Receber) seguem por nota fiscal, e o cálculo automático das 11 taxas/Funrural pertence ao Cockpit de Taxas (`DEL-COM-135`).

---

## 4. Detalhamento das Regras de Negócio e Dados

### 4.1. Regras de Agrupamento e Limites do Lote `(Slide 13 e Slide 14)`
* **Agrupamento por Documento (`DOCSEQ`) `(Slide 14)`:** Todas as linhas da planilha que compartilham o mesmo identificador na coluna `Nº do documento` (`DOCSEQ`) formam um **único documento contábil no SAP** (`BELNR`). Os dados de cabeçalho são informados na 1ª linha de cada documento, e as linhas subsequentes do mesmo agrupamento formam as partidas daquele documento (ex.: 1 linha de Sítio a débito de R\$ 24.000,00 e 4 linhas de Sócios a crédito de R\$ 6.000,00 geram 1 documento contábil com 5 partidas).
* **Impacto no Estorno `(Slide 14)`:** Como o documento contábil agrupa todas as partidas daquele `DOCSEQ`, estornar o documento no SAP desfaz todos os sócios daquele documento simultaneamente. Caso um sócio precise ser estornado isoladamente no futuro, ele deve ser carregado em um número de documento (`DOCSEQ`) próprio.
* **Múltiplos Tipos de Movimento no Mesmo Arquivo `(Slide 14 e Slide 16)`:** Um mesmo arquivo Excel pode conter documentos de tipos de movimento diferentes (ex.: documento `1234` com `CS-INT` e documento `4321` com `DS-ATR`), desde que em números de `DOCSEQ` separados. É proibido misturar tipos de movimento diferentes dentro do mesmo `DOCSEQ`.
* **Limites Operacionais `(Slide 13 e Slide 14)`:** Limite máximo de **999 documentos por arquivo** e **999 partidas (itens) por documento** (limite standard da BAPI contábil do SAP).

### 4.2. Tabela de Regras dos Tipos de Movimento `(Slide 22, Slide 30 e 1ª Reunião)`
Regras de negócio que devem ser suportadas pela parametrização dos Tipos de Movimento:

| Código | Descrição do Movimento | Natureza do Débito | Natureza do Crédito | Tipo Doc. | Bloqueio | Data Base (`ZFBDT`) |
| :--- | :--- | :--- | :--- | :---: | :---: | :--- |
| **`CS-ADM`** | Capital Social — Admissão do sócio (compromisso) | Sócio RE `S` (`2502010001` Cap. Social a Integralizar) | Sócio RE `R` (`2501010001` Cap. Social Subscrito) | `CS` | `T` | Não exigida |
| **`CS-INT`** | Capital Social — Integralização mensal (desconto sítio) | Sítio (reconciliação `2101010001`) | Sócio RE `S` (`2502010001`) | `CS` | `T` | Não exigida |
| **`CS-DES`** | Capital Social — Desligamento do sócio | Sócio RE `R` (`2501010001`) | Sócio RE `T` (`2201020001` Cap. Social a Restituir LP) | `CS` | `T` | **Obrigatória** (3ª segunda-feira de julho do ano seguinte) |
| **`CS-LCP`** | Capital Social — Transferência Longo p/ Curto Prazo | Sócio RE `T` (`2201020001`) | Sócio RE `U` (`2109010001` Cap. Social a Restituir CP) | `CS` | `T` | **Obrigatória** |
| **`DS-ATR`** | Distribuição de Sobras — Atribuição do exercício | Conta do Razão `2205010002` (*Sobras a Distribuir*) | Sócio RE `V` (`2205010001` Sobras a Distribuir LP) | `DS` | `T` | **Obrigatória** (Ano do lançamento + 10) |
| **`DS-LCP`** | Distribuição de Sobras — Transferência LP → CP | Sócio RE `V` (`2205010001`) | Sócio RE `Z` (`2107010001` Sobras a Distribuir CP) | `DS` | `T` | **Obrigatória** |
| **`CM-AQU`** | Cotas de Material Circulante — Aquisição | Sítio (reconciliação `2101010001`) | Sócio RE `N` (`2204010001` Cotas Mat. Circulante) | `CM` | `T` | Não exigida |
| **`CM-DEV`** | Cotas de Material Circulante — Devolução / restituição | Sócio RE `N` (`2204010001`) | Sítio (reconciliação `2101010001`) | `CM` | `T` (só no item do sócio) | Não exigida |
| **`FP-AJU`** | Fundo Patrimonial — Ajuste manual | Sítio (reconciliação `2101010001`) | Sócio RE `O` (`2201060001` Fundo Patrimonial LP) | `FP` | `T` | **Obrigatória** (Ano + 10) |
| **`FR-AJU`** | Fundo Rotativo — Ajuste manual | Sítio (reconciliação `2101010001`) | Sócio RE `J` (`2201050001` Fundo Rotativo LP) | `FR` | `T` | **Obrigatória** (Ano + 10) |
| **`FP-LCP`** | Fundo Patrimonial — Transferência LP → CP *(pendente de confirmação funcional)* | Sócio RE `O` (`2201060001`) | Sócio RE `1` (`2112010001` Fundo Patrimonial CP) | `FP` | `T` | **Obrigatória** |

* **Geração Automática de Contrapartida no Razão (`DS-ATR`) `(Slide 16, Slide 24 e Slide 33)`:** Nos tipos de movimento em que um dos lados é uma **Conta do Razão Geral** (como `DS-ATR`), o usuário preenche na planilha apenas as linhas dos sócios. O aplicativo calcula a soma dos itens dos sócios e gera automaticamente a partida de contrapartida na conta do Razão (`2205010002`) para fechar o saldo do documento na BAPI.

### 4.3. Controle de Cotas de Material Circulante por Atribuição `(Slide 25 e Slide 26)`
* As Cotas de Material Circulante utilizam uma única Razão Especial (`N`) e uma única conta contábil (`2204010001`), mas exigem controle de saldo separado por tipo de material (vasos, cestos, suportes) e por sócio `(Slide 26)`.
* Para atender a essa exigência sem criar dezenas de contas contábeis, nos movimentos `CM-AQU` e `CM-DEV` o preenchimento do campo **Atribuição (`ZUONR`)** na linha do sócio é **obrigatório**, devendo conter o código do tipo de cota (ex.: `POTE11`, `POTE13`) `(Slide 25 e Slide 26)`.

### 4.4. Layout de Dados do Template Excel `(DEL-COM-165_Modelo_Layout_Carga 1.xlsx, Slide 23 e Slide 24)`
A planilha modelo oficial possui 3 abas (`Instruções`, `Carga` e `Tipos de Movimento`). Na aba principal de processamento (**`Carga`**), a **Linha 4** contém os **Nomes Técnicos** dos campos (chave de leitura do parser ABAP), a **Linha 5** contém os **Rótulos Amigáveis com tamanho máximo**, e os dados iniciam a partir da **Linha 6**.

O template é composto por **15 colunas** divididas entre Cabeçalho (Colunas A a H, informadas apenas na 1ª linha de cada documento) e Itens (Colunas I a O, informadas em todas as linhas):

| # | Coluna | Rótulo no Modelo | Nome Técnico | Nível | Obrigatório? | Tipo / Tamanho | Regra / Destino na BAPI `(Slide 23, Slide 24 e Slide 33)` |
| :---: | :---: | :--- | :--- | :---: | :---: | :--- | :--- |
| **1** | **A** | `*Nº do documento (4)` | `DOCSEQ` | Cabeçalho | Sim (1ª linha) | `Num(4)` | Agrupa as linhas que formam o mesmo documento contábil dentro da carga. |
| **2** | **B** | `*Tipo de movimento (6)` | `ZTPMOV` | Cabeçalho | Sim (1ª linha) | `Char(6)` | Código do movimento parametrizado no App 2. Gravado também em `BSEG-XREF3` (`REF_KEY_3`) em cada item para rastreabilidade. |
| **3** | **C** | `*Empresa (4)` | `BUKRS` | Cabeçalho | Sim (1ª linha) | `Char(4)` | Empresa do lançamento (padrão `CVH1` — `DOCUMENTHEADER-COMP_CODE`). |
| **4** | **D** | `*Data do documento` | `BLDAT` | Cabeçalho | Sim (1ª linha) | `Data` | Data da apuração/planilha (`DOCUMENTHEADER-DOC_DATE`). |
| **5** | **E** | `*Data de lançamento` | `BUDAT` | Cabeçalho | Sim (1ª linha) | `Data` | Data contábil (`DOCUMENTHEADER-PSTNG_DATE`). |
| **6** | **F** | `*Referência (16)` | `XBLNR` | Cabeçalho | Sim (1ª linha) | `Char(16)` | Identificação da apuração (`DOCUMENTHEADER-REF_DOC_NO`). Compõe a verificação de duplicidade. |
| **7** | **G** | `*Texto de cabeçalho (25)` | `BKTXT` | Cabeçalho | Sim (1ª linha) | `Char(25)` | Texto livre do cabeçalho (`DOCUMENTHEADER-HEADER_TXT`). Obrigatório no template por definição do cliente. |
| **8** | **H** | `Moeda (5)` | `WAERS` | Cabeçalho | Não (padrão `BRL`) | `Char(5)` | Moeda da operação (`DOCUMENTHEADER-CURRENCY`). Se em branco, o sistema assume `BRL`. |
| **9** | **I** | `*Fornecedor (BP) (10)` | `LIFNR` | Item | Sim (todas) | `Char(10)` | Código do parceiro Sítio ou Sócio (`ACCOUNTPAYABLE-VENDOR_NO`). |
| **10** | **J** | `Débito` | `WRSOL` | Item | Condicional | `Moeda(13,2)` | Valor a débito (`CURRENCYAMOUNT-AMT_DOCCUR`). Exatamente um entre Débito e Crédito deve estar preenchido na linha. |
| **11** | **K** | `Crédito` | `WRHAB` | Item | Condicional | `Moeda(13,2)` | Valor a crédito (`CURRENCYAMOUNT-AMT_DOCCUR`). |
| **12** | **L** | `Data base` | `ZFBDT` | Item | Condicional | `Data` | Data base de vencimento (`ACCOUNTPAYABLE-BLINE_DATE`). Obrigatória conforme a parametrização do Tipo de Movimento. |
| **13** | **M** | `Condição de pagamento (4)` | `ZTERM` | Item | Não | `Char(4)` | Condição de pagamento (`ACCOUNTPAYABLE-PMNTTRMS`). Se vazia, assume a condição do cadastro do BP. |
| **14** | **N** | `*Texto do item (50)` | `SGTXT` | Item | Sim (todas) | `Char(50)` | Histórico do item (`ACCOUNTPAYABLE-ITEM_TEXT`). Obrigatório no template por definição do cliente. |
| **15** | **O** | `Atribuição (18)` | `ZUONR` | Item | Condicional | `Char(18)` | Campo de atribuição (`ACCOUNTPAYABLE-ALLOC_NMBR`). Obrigatório nos movimentos `CM-*` com o código do tipo de cota. |

* **Rastreabilidade Adicional Automática `(Slide 24, Slide 30 e Slide 33)`:** O aplicativo preenche automaticamente o **ID da Carga** no campo `BSEG-XREF1` (`REF_KEY_1`) e o **Tipo de Movimento** em `BSEG-XREF3` (`REF_KEY_3`) de todas as partidas geradas.

### 4.5. Regras de Validação, Simulação e Mensagens de Erro `(Slide 27, Slide 28, Slide 29, Slide 34 e 1ª Reunião - Decisão 04)`

Conforme alinhado na [[01 - Primeira reunião com consultores|1ª Reunião (Decisão 04)]], **não será criado um catálogo de mensagens customizadas para duplicar validações que o próprio SAP já faz**. As validações dividem-se em duas camadas claras:

1. **Validações Próprias do Aplicativo (Layout e Parametrização Customizada):**
   * **Validação do Modelo do Arquivo Excel `(Slide 27 e 1ª Reunião)`:** Antes de chamar a BAPI, o aplicativo verifica se o arquivo enviado corresponde às colunas do template oficial e se contém linhas de dados. Caso o usuário suba uma planilha com layout inválido, o arquivo é rejeitado imediatamente.
   * **Validação contra a Parametrização do App 2 `(Slide 27, Slide 28, Slide 29 e 1ª Reunião)`:**
     * Verifica se o **Tipo de Movimento** (`ZTPMOV`) existe e está ativo na tabela de parâmetros, e se todos os itens de um mesmo `DOCSEQ` possuem o mesmo Tipo de Movimento.
     * Verifica a **obrigatoriedade da Data Base (`ZFBDT`)** quando exigida pelo Tipo de Movimento parametrizado (ex.: se o documento exige data base e a coluna vier em branco no Excel, aponta erro).
     * Verifica a obrigatoriedade do campo **Atribuição (`ZUONR`)** para movimentos de Cotas de Material Circulante (`CM-AQU` e `CM-DEV`).
     * Verifica **duplicidade de lançamento** para impedir que a mesma combinação de `Referência (XBLNR) + Fornecedor (LIFNR) + Tipo de Movimento (ZTPMOV) + Valor` já contabilizada com sucesso seja lançada novamente em duplicidade.

2. **Validações Contábeis e Cadastrais Standard via `BAPI_ACC_DOCUMENT_CHECK` `(Slide 27, Slide 33 e 1ª Reunião - Decisão 04)`:**
   * Todas as validações standard de contabilidade e cadastro — como existência do fornecedor na empresa, bloqueio de lançamento no BP, período contábil aberto, valores maiores que zero, datas válidas, equilíbrio de débito e crédito, existência de conta contábil e código de Razão Especial — **são executadas diretamente pela `BAPI_ACC_DOCUMENT_CHECK`**.
   * O aplicativo captura e exibe ao usuário **as próprias mensagens nativas retornadas pela tabela `RETURN` da BAPI**, garantindo precisão contábil sem retrabalho de manutenção de mensagens.

---

## 5. Cenários de Testes

Cenários funcionais especificados para homologação da solução em ambiente de qualidade (`QAS`) `(Slide 40, Slide 41 e 1ª Reunião)`:

| ID | Cenário de Teste | Tipo | Pré-condições | Passos Resumidos | Resultado Esperado `(Slide 40, Slide 41 e 1ª Reunião)` |
| :---: | :--- | :--- | :--- | :--- | :--- |
| **`CT-01`** | Carga `CS-INT` com sucesso (1 sítio a débito, 2 sócios a crédito) | Sucesso | BPs cadastrados; RE `S` ativa; período aberto | Baixar template, preencher 3 linhas no mesmo doc (`DOCSEQ`), carregar, verificar e lançar. | 1 documento `CS` gerado: Sítio a débito (500) contra Sócio A RE `S` (300) e Sócio B RE `S` (200); bloqueio `T` e `XREF3 = CS-INT`; tela exibe o `BELNR` gerado. |
| **`CT-02`** | Lançamento parcial (1 documento válido e 1 documento com erro de dado) | Erro + Parcial | Arquivo com 2 documentos, sendo o 2º com dado inválido | Carregar e processar o arquivo; depois corrigir apenas o documento que falhou no Excel e subir novamente. | Doc 1 é contabilizado normalmente (`BELNR` gerado); Doc 2 fica com erro. Após corrigir o Doc 2 no Excel e importar novamente, o Doc 2 é contabilizado sem duplicar o Doc 1. |
| **`CT-03`** | Tipo de movimento inativo ou Data Base obrigatória ausente | Erro | Tipo de movimento exigindo Data Base (ex.: `CS-DES`) sem preenchimento no Excel | Carregar arquivo sem a Data Base e acionar a verificação. | Aplicativo aponta erro de validação de parâmetro (Data Base obrigatória não informada); documento não é contabilizado. |
| **`CT-04`** | Duplicidade de documento já lançado | Erro | `CT-01` já lançado com sucesso no sistema | Importar novamente o mesmo arquivo do `CT-01`. | Sistema bloqueia por duplicidade (`XBLNR + LIFNR + ZTPMOV + Valor` já lançado); nenhum lançamento duplicado é efetuado. |
| **`CT-05`** | `DS-LCP`: Transferência LP → CP no mesmo BP Sócio | Sucesso | Sócio com saldo na Razão Especial `V` | Carregar documento `DS-LCP`, verificar e lançar. | Documento `DS` gerado: Débito Sócio RE `V` / Crédito Sócio RE `Z`; data base gravada e bloqueio `T`. |
| **`CT-06`** | `CM-DEV`: Devolução de cotas de material circulante | Sucesso | Sócio com saldo na Razão Especial `N` | Carregar documento `CM-DEV` e lançar. | Documento `CM` gerado: Débito Sócio RE `N` (com bloqueio `T`) / Crédito Sítio (item do sítio livre/pagável). |
| **`CT-07`** | Fornecedor bloqueado no SAP e reenvio após desbloqueio | Erro + Recarga | BP bloqueado para lançamento no cadastro do SAP | Carregar arquivo (BAPI aponta erro de fornecedor bloqueado); desbloquear o BP no cadastro SAP e realizar nova carga da planilha com os pendentes. | Na 1ª execução exibe a mensagem nativa da BAPI de fornecedor bloqueado; após desbloqueio no SAP e novo upload da planilha, o documento é contabilizado com sucesso gerando o `BELNR`. |
| **`CT-08`** | Regressão: Programa de pagamento automático `F110` | Regressão | Documentos de `CT-01` e `CT-05` lançados | Executar proposta de pagamento na `F110` para os BPs utilizados. | Partidas lançadas com Razão Especial e bloqueio `T` não são selecionadas para pagamento na proposta da `F110`. |
| **`CT-09`** | Controle de Autorização: Perfil Consulta tenta lançar | Autorização | Usuário apenas com perfil de Consulta | Abrir carga existente e tentar acionar o lançamento. | Ação indisponível ou bloqueada por falta de autorização. |
| **`CT-10`** | Aquisição de Cotas (`CM-AQU`) com tipos de cota distintos | Sucesso | RE `N` ativa; códigos `POTE11` e `POTE13` informados | Carregar 1 doc `CM-AQU` com Sócio 01/`POTE11` (1.000), Sócio 02/`POTE11` (2.000) e Sócio 02/`POTE13` (500), verificar e lançar. | Documento `CM` gerado com campo Atribuição (`ZUONR`) preenchido com `POTE11`/`POTE13`; saldo consultável por atribuição no app standard de partidas de fornecedor. |
| **`CT-11`** | Agrupamento de sócios e múltiplos tipos de movimento no mesmo arquivo | Sucesso + Estorno | Doc `1234` = `CS-INT` (1 sítio + 4 sócios) e Doc `4321` = `DS-ATR` (4 sócios) na mesma planilha | Carregar, verificar, lançar e em seguida estornar apenas o documento `1234` na transação standard (`FB08`). | Dois documentos contábeis independentes gerados; o estorno do `1234` desfaz os 4 sócios de Capital Social de uma só vez e não afeta o documento `4321` de Sobras. |

---

## 6. Status de Dúvidas e Decisões Técnicas (Pós-1ª Reunião)

Todos os pontos levantados na leitura inicial do DPS foram formalmente esclarecidos e decididos com o consultor funcional na [[01 - Primeira reunião com consultores|1ª Reunião (10/11/2026)]]:

* ✅ **Fiori (RAP) vs. ABAP Clássico (ALV):** Confirmado que a solução será **100% SAP Fiori (RAP)**. A alternativa de redução de escopo em ALV citada no Slide 17 foi descartada `(Decisão 06)`.
* ✅ **Motor de Contabilização:** Confirmado o uso do par de BAPIs standard **`BAPI_ACC_DOCUMENT_CHECK`** e **`BAPI_ACC_DOCUMENT_POST`** `(Decisões 01 e 04)`.
* ✅ **Forma de Correção de Erros e Eliminação do Reprocessar:** Confirmado o lançamento parcial por documento e definido que não haverá botão de reprocessamento em tela nem edição de campos no aplicativo. Todo erro é tratado corrigindo a causa raiz e reimportando a planilha com os pendentes `(Decisão Técnica Gabriel Vieira)`.
* ✅ **Catálogo de Mensagens Customizadas:** Descartada a criação de catálogo de mensagens Z para regras contábeis standard; serão exibidas as mensagens nativas da BAPI `(Decisão 04)`.
* ✅ **Persistência do Histórico e Uso de Draft:** O histórico das cargas será persistido em tabelas de banco de dados consultáveis no próprio Aplicativo 1, e o uso de *Draft* no Aplicativo 1 foi dispensado `(Decisões 07 e 08)`.
* ✅ **Autonomia de Arquitetura e Status do Ambiente:** Confirmado que nada foi desenvolvido no ambiente ainda e que o desenvolvedor ABAP tem total liberdade para definir a arquitetura técnica, tabelas e CDS Views `(Decisões 05 e 09)`.
* ✅ **Geração e Leitura do Excel via Código:** Modelo `.xlsx` e parsing do upload implementados 100% via código ABAP com biblioteca XCO, sem dependência de arquivos estáticos em transações (MIME/SMW0) `(Decisão Técnica Gabriel Vieira)`.
