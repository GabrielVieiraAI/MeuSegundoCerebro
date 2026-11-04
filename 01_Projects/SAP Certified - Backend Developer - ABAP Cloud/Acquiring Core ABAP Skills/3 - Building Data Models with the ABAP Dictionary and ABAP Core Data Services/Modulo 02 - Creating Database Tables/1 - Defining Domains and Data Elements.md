---
tipo: clippings
title: "Defining Domains and Data Elements"
source: "https://learning.sap.com/courses/building-data-models-with-the-abap-dictionary-and-abap-core-data-services/defining-domains-and-data-elements_b65b511a-4ad1-4437-80f5-5ad689cab833"
created: 2026-11-03
tags:
  - sap
  - abap
  - abap-cloud
  - ddic
  - domains
  - data-elements
  - data-modeling
  - adt
---
**Roteiro de Estudos Relacionado:** [[Roteiro de Estudos SAP]]

# Objetivos de Aprendizado

Após concluir esta lição, você será capaz de:
- Descrever a utilização de elementos de dados (*Data Elements*) e domínios (*Domains*) na definição de tabelas de banco de dados.
- Criar domínios no **ABAP Development Tools (ADT)**.
- Criar elementos de dados e definir seus tipos técnicos e semânticos.

---

## 1. Tabelas de Banco de Dados, Elementos de Dados e Domínios

Um objeto de desenvolvimento do tipo tabela de banco de dados (*Database Table*) no ABAP Dictionary é a descrição de uma tabela no banco de dados. O nome do objeto de desenvolvimento e o nome da tabela física no banco são idênticos. Cada campo no objeto do dicionário corresponde a uma coluna na tabela do banco de dados.

<iframe 
    src="https://cdnapisec.kaltura.com/p/1921661/embedPlaykitJs/uiconf_id/50355372?iframeembed=true&entry_id=1_1agpaey5" 
    width="100%" 
    height="400" 
    allowfullscreen 
    frameborder="0">
</iframe>

> [!NOTE] Transcrição do Vídeo: Tabelas, Elementos de Dados e Domínios
> Em geral, você utiliza objetos do dicionário do tipo **Data Element** para descrever as propriedades dos campos da tabela, e faz com que os elementos de dados façam referência a objetos do tipo **Domain**.
> Enquanto o domínio especifica unicamente o **tipo técnico**, o elemento de dados adiciona **informações semânticas**, como rótulos de tela (*Field Labels*) e documentação.

![[01TableDataElementDomain_002.png]]

A relação entre os artefatos segue uma arquitetura em camadas bem definida:
- Uma tabela de banco de dados é composta por uma lista de campos.
- Cada campo faz referência a um elemento de dados.

![[01TableDataElementDomain_003.png]]

- O elemento de dados adiciona textos amigáveis ao usuário final, documentação e significado de negócio.
- O elemento de dados, por sua vez, aponta para um domínio.

![[01TableDataElementDomain_004.png]]

- O domínio contém a descrição puramente técnica: tipo básico de dado do dicionário, comprimento em caracteres/bytes, casas decimais e possíveis rotinas de conversão e valores fixos.

---

## 2. Como Criar um Domínio no ADT

<iframe 
    src="https://cdnapisec.kaltura.com/p/1921661/embedPlaykitJs/uiconf_id/50355372?iframeembed=true&entry_id=1_ipq78734" 
    width="100%" 
    height="400" 
    allowfullscreen 
    frameborder="0">
</iframe>

### Procedimento Passo a Passo:
1. No Eclipse, a partir da barra de menu, escolha **File $\rightarrow$ New $\rightarrow$ Other...**.
2. Na caixa de diálogo, selecione **ABAP Repository Object** e clique em **Next**.
3. Navegue até a pasta **Dictionary**, selecione **Domain** e clique em **Next**.
4. Informe o pacote de desenvolvimento, o nome (ex: `Z00_SALARY`) e a descrição do domínio. Avance em **Next**.
5. Selecione a requisição de transporte (*Transport Request*) necessária e clique em **Finish**.
6. No editor do domínio recém-criado, preencha:
   - **Data type:** Escolha o tipo de dados predefinido (ex: `CURR`).
   - **Length:** Comprimento do campo (ex: `15`).
   - **Decimals:** Quantidade de casas decimais (ex: `2`).
7. Ative o domínio pressionando **Ctrl + F3**.

> [!WARNING] Regra de Ouro
> Você **não pode** utilizar um domínio diretamente na definição dos campos de uma tabela de banco de dados. É obrigatório criar ao menos um elemento de dados que utilize esse domínio como tipo técnico.

---

## 3. Tipos Predefinidos no ABAP Dictionary

Ao criar um domínio, você deve escolher um entre os vários tipos predefinidos do dicionário (*Predefined Dictionary Types*). Alguns desses tipos destinam-se ao uso geral, enquanto outros possuem propósitos e semânticas especiais.

![[02DictionaryPredefinedTypes_001.png]]

### A. Tipos de Uso Geral
- **`CHAR`**: Cadeias de caracteres de comprimento fixo (mapeado para o tipo ABAP `c`).
- **`INT4`**: Números inteiros de 4 bytes com sinal (mapeado para o tipo ABAP `i`).
- **`FLTP`**: Números de ponto flutuante binários de precisão dupla (mapeado para o tipo ABAP `f`).
- **`DEC`**: Números decimais compactados em formato BCD (*Binary Coded Decimal*), mapeado para o tipo ABAP `p`.

### B. Tipos Caractere com Semântica Especial
- **`NUMC`**: Cadeia de caracteres numéricos. Armazena apenas dígitos (`0-9`). Frameworks do ABAP frequentemente preenchem automaticamente com zeros à esquerda (*leading zeros*).
- **`CLNT`**: Campo de mandante (cliente). Um campo-chave do tipo `CLNT` em uma tabela de banco de dados torna a tabela **dependente de mandante (*client-dependent*)**. Por padrão, qualquer acesso via ABAP SQL a essa tabela é restrito automaticamente ao mandante em que o usuário está logado.
- **`LANG`**: Chave de idioma. Importante em tabelas que armazenam textos traduzíveis (denominadas tabelas de texto / *text tables*).

### C. Tipos Numéricos com Semântica Especial
- **`CURR`**: Valores monetários. Armazenado internamente como número compactado (`DEC`), exige obrigatoriamente um campo de referência com a moeda correspondente (tipo `CUKY`).
- **`QUAN`**: Valores de quantidade. Armazenado internamente como número compactado (`DEC`), exige obrigatoriamente um campo de referência com a unidade de medida correspondente (tipo `UNIT`).
- **`DECFLOAT16` e `DECFLOAT34`**: Números decimais de ponto flutuante IEEE 754r com 16 ou 34 dígitos de precisão. Ideais para cálculos financeiros exatos, evitando os erros de arredondamento inerentes aos números de ponto flutuante binários (`FLTP`).

![[02DictionaryPredefinedTypes_002.png]]

### Mapeamento Completo: Tipos do Dicionário vs. Tipos Embutidos ABAP

| Tipo do Dicionário (DDIC) | Tipo Embutido ABAP | Descrição Técnica |
| :--- | :---: | :--- |
| **`CHAR`** | `c` | Texto de comprimento fixo |
| **`NUMC`** | `n` | Sequência numérica em formato texto |
| **`CLNT`** | `c` | Identificador de mandante (3 caracteres) |
| **`LANG`** | `c` | Código de idioma de 1 caractere |
| **`DATS`** | `d` | Data no formato `YYYYMMDD` (8 caracteres) |
| **`TIMS`** | `t` | Hora no formato `HHMMSS` (6 caracteres) |
| **`INT1` / `INT2` / `INT4` / `INT8`** | `b` / `s` / `i` / `int8` | Inteiros de 1, 2, 4 e 8 bytes |
| **`DEC` / `CURR` / `QUAN`** | `p` | Número decimal compactado (*Packed Number*) |
| **`FLTP`** | `f` | Ponto flutuante binário (8 bytes) |
| **`DECFLOAT16` / `DECFLOAT34`** | `decfloat16` / `decfloat34` | Ponto flutuante decimal (8 ou 16 bytes) |
| **`RAW` / `LRAW`** | `x` | Cadeia de bytes brutos (*hexadecimal*) |
| **`STRING` / `RAWSTRING`** | `string` / `xstring` | Cadeias dinâmicas de caracteres ou bytes |

---

## 4. Criação de Elementos de Dados (*Data Elements*)

Ao criar um elemento de dados, você define duas partes fundamentais: o **tipo técnico** e as **informações semânticas/textuais**.

<iframe 
    src="https://cdnapisec.kaltura.com/p/1921661/embedPlaykitJs/uiconf_id/50355372?iframeembed=true&entry_id=1_rjcvzbrh" 
    width="100%" 
    height="400" 
    allowfullscreen 
    frameborder="0">
</iframe>

### Definição do Tipo Técnico do Elemento de Dados
Você pode definir o tipo técnico de um elemento de dados de duas maneiras:
1. **Referenciando um Domínio existente:** Opção tradicional e recomendada para campos reutilizáveis que compartilham validações e valores fixos.
2. **Definição Direta de Tipo (*Predefined Type*):** O desenvolvedor escolhe diretamente um tipo básico do dicionário, tamanho e decimais no próprio elemento de dados, sem criar um domínio auxiliar.

![[03DataElementCreation_002.png]]

### Manutenção de Textos e Rótulos (*Field Labels*)
Existem dois locais onde você mantém textos em um elemento de dados:
1. **Seção *Field Labels*:** Quatro rótulos com comprimentos máximos recomendados:
   - **Short (Curto):** Até 10 caracteres.
   - **Medium (Médio):** Até 20 caracteres.
   - **Long (Longo):** Até 40 caracteres.
   - **Heading (Cabeçalho):** Até 55 caracteres (usado em cabeçalhos de colunas de tabelas/relatórios).
2. **Visão *Properties*:** Descrição do objeto de desenvolvimento, voltada para desenvolvedores que analisam o repositório.

---

## 5. Como Criar um Novo Elemento de Dados com um Novo Domínio

<iframe 
    src="https://cdnapisec.kaltura.com/p/1921661/embedPlaykitJs/uiconf_id/50355372?iframeembed=true&entry_id=1_kiw2dzhe" 
    width="100%" 
    height="400" 
    allowfullscreen 
    frameborder="0">
</iframe>

1. No Eclipse, clique com o botão direito sobre o subnó **Dictionary** do seu pacote e selecione **New $\rightarrow$ Data Element**.
2. Informe o nome (ex: `Z00_ANNUAL_SALARY`) e a descrição.
3. No campo **Type Name**, digite o nome do domínio desejado (ex: `Z00_SALARY`) e use **Ctrl + Space**.
4. Caso o domínio ainda não exista, o Eclipse sinalizará erro na visão *Problems*. Você pode clicar no link do erro para gerar o domínio diretamente a partir do elemento de dados (*Forward Navigation*).
5. Na seção **Field Labels**, preencha os valores para *Short*, *Medium*, *Long* e *Heading*.
6. Ative ambos os objetos (**Ctrl + F3**).

---

## 6. Prática Hands-On: Criar Domínios e Elementos de Dados

> [!NOTE] Objetivo do Exercício
> Você começará a construir seu próprio modelo de dados. Neste exercício, você definirá domínios e elementos de dados para números de empregado e dados de salário anual.

### Template & Solução Oficial SAP:
- **Domínios:** `/LRN/AMOUNT` e `/LRN/EMPLOYEE_ID`
- **Elementos de Dados:** `/LRN/ANNUAL_SALARY` e `/LRN/EMPLOYEE_ID`

---

### Tarefa 1: Criar o Domínio `Z##_AMOUNT`
1. No *Project Explorer*, clique com o botão direito sobre o seu pacote pessoal `ZS4D430_##` e escolha:
   **New $\rightarrow$ Other... $\rightarrow$ Domain**.
2. Preencha os dados:
   - **Name:** `Z##_AMOUNT` *(substitua `##` pelo seu número de grupo, ex: `Z01_AMOUNT`)*
   - **Description:** `Amount with 2 decimals`
3. Defina os atributos técnicos:
   - **Data type:** `CURR`
   - **Length:** `15`
   - **Decimals:** `2`
4. Pressione **Ctrl + S** para salvar e **Ctrl + F3** para ativar.

---

### Tarefa 2: Criar o Domínio `Z##_EMPLOYEE_ID`
1. Crie um novo domínio no seu pacote:
   - **Name:** `Z##_EMPLOYEE_ID`
   - **Description:** `Employee ID`
2. Defina os atributos técnicos:
   - **Data type:** `NUMC`
   - **Length:** `8`
3. Ative o domínio (**Ctrl + F3**).

---

### Tarefa 3: Criar o Elemento de Dados `Z##_ANNUAL_SALARY`
1. Clique com o botão direito sobre o seu pacote e escolha:
   **New $\rightarrow$ Other... $\rightarrow$ Data Element**.
2. Preencha os campos iniciais:
   - **Name:** `Z##_ANNUAL_SALARY`
   - **Description:** `Annual Salary`
3. Na seção de definição de tipo, selecione a categoria **Domain** e informe:
   - **Domain Name:** `Z##_AMOUNT`
4. Na seção **Field Labels**, mantenha os comprimentos padrão e preencha:
   - **Short (10):** `Salary`
   - **Medium (20):** `Annual salary`
   - **Long (40):** `Annual salary`
   - **Heading (55):** `Annual salary`
5. Salve e ative o elemento de dados (**Ctrl + F3**).

---

### Tarefa 4: Criar o Elemento de Dados `Z##_EMPLOYEE_ID`
1. Crie um novo elemento de dados:
   - **Name:** `Z##_EMPLOYEE_ID`
   - **Description:** `Employee ID`
2. Tipo técnico:
   - **Category:** `Domain`
   - **Domain Name:** `Z##_EMPLOYEE_ID`
3. Na seção **Field Labels**, informe:
   - **Short (10):** `Emp. No.`
   - **Medium (20):** `Employee No.`
   - **Long (40):** `Employee Number`
   - **Heading (55):** `Employee Number`
4. Salve e ative o elemento de dados (**Ctrl + F3**).
