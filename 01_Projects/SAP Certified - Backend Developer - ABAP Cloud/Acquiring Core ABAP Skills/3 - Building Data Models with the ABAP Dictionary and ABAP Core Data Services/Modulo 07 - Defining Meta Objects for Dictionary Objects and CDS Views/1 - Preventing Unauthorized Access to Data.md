---
tipo: clippings
title: "Preventing Unauthorized Access to Data"
source: "https://learning.sap.com/courses/building-data-models-with-the-abap-dictionary-and-abap-core-data-services/preventing-unauthorized-access-to-data_e73ee8f7-8547-44d6-95a8-2675a62ee0cf"
created: 2026-11-03
tags:
  - sap
  - abap
  - abap-cloud
  - security
  - authorization-objects
  - authorization-fields
  - cds-access-control
  - dcl
  - pfcg-aspect
  - inherited-conditions
---
**Roteiro de Estudos Relacionado:** [[Roteiro de Estudos SAP]]

# Objetivos de Aprendizado

Após concluir esta lição, você será capaz de:
- Criar e configurar **Campos de Autorização** (*Authorization Fields*) e **Objetos de Autorização** (*Authorization Objects*).
- Implementar objetos de repositório **CDS Access Control** utilizando a sintaxe DCL (*Data Control Language*).
- Diferenciar os tipos de condições de acesso: Condições Literais/Simples, Aspectos PFCG (`aspect pfcg_auth`) e Condições de Herança (*Inheriting Conditions*).
- Controlar a obrigatoriedade e o comportamento da segurança no CDS através da anotação de entidade `@AccessControl.authorizationCheck`.

---

# 1. Segurança e Controle de Acesso no Modelo de Dados

Ao conceber um modelo de dados empresarial, garantir a proteção contra acessos não autorizados é tão vital quanto a integridade referencial:
- **Proteção contra Escrita Não Autorizada:** Tradicionalmente implementada de forma explícita na lógica do código ABAP utilizando o comando `AUTHORITY-CHECK`.
- **Proteção contra Leitura Não Autorizada:** No mundo moderno do ABAP Cloud e CDS, a primeira escolha deve ser sempre o uso de **CDS Access Controls**.

![[02AuthObjectsAndFields_001.png]]

### Elementos Básicos da Segurança SAP:
1. **Authorization Field (Campo de Autorização):** Objeto de desenvolvimento que define um atributo a ser checado (ex: filial, divisão, departamento). É tipificado com um Data Element do dicionário e possui nome limitado a **10 caracteres**.
2. **Authorization Object (Objeto de Autorização):** Agrupa de 1 até 10 campos de autorização correlatos que devem ser validados conjuntamente. Por padrão, todo novo objeto de autorização já inclui o campo padrão de atividade **`ACTVT`** (ex: `01` Criar, `02` Modificar, `03` Exibir, `06` Excluir).

![[02AuthObjectsAndFields_002.png]]
![[02AuthObjectsAndFields_003.png]]

---

# 2. Demonstração em Vídeo: How to Create an Authorization Object

Assista à demonstração oficial da SAP guiando a criação do campo de autorização `Z00DPMNT` vinculado à tabela de verificação `Z00_DEPMENT` e sua inclusão no objeto de autorização `Z00DEPMENT`:

<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%;">
  <iframe 
    src="https://cdnapisec.kaltura.com/p/1926081/sp/192608100/embedIframeJs/uiconf_id/27230482/partner_id/1926081?iframeembed=true&playerId=kaltura_player&entry_id=1_6z9cc7p9" 
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;" 
    allowfullscreen 
    webkitallowfullscreen 
    mozAllowFullScreen 
    allow="autoplay *; fullscreen *; encrypted-media *" 
    title="How to Create an Authorization Object">
  </iframe>
</div>

---

# 3. O Objeto de Repositório: CDS Access Control

Um **CDS Access Control** é um objeto de repositório ABAP que define uma **CDS Role** utilizando a sintaxe declarativa DCL (*Data Control Language*):

![[Repository_Object_Access_Control_001.png]]

```abap
define role Z##_R_EMPLOYEE {
  grant select on Z##_R_Employee
  where ( DepartmentId ) = aspect pfcg_auth( ... );
}
```

![[CDSAccessControlExample.png]]

### Como Funciona em Tempo de Execução:
- Quando qualquer programa ABAP ou serviço executa um `SELECT` contra a CDS View Entity protegida (`Z##_R_Employee`), a interface de banco de dados do kernel ABAP intercepta a consulta e **injeta automaticamente cláusulas `WHERE` de restrição** com base no perfil de autorização do usuário logado.
- Os registros que o usuário não tem permissão para visualizar são filtrados diretamente no banco de dados antes mesmo de trafegarem para a memória da aplicação.

> [!IMPORTANT] Acesso Direto vs. Indireto
> O controle de acesso do CDS só tem efeito quando a visão é acessada **diretamente no código ABAP**. Em acessos indiretos (quando a visão é lida na cláusula `FROM` de outra CDS View), a regra da visão interna é ignorada, devendo a visão de consumo superior definir suas próprias regras ou utilizar condições herdadas.

---

# 4. Tipos de Condições de Acesso (*Access Conditions*)

![[03AccessConditions_001.png]]

Um CDS Access Control suporta três categorias essenciais de condições na cláusula `WHERE`:

### 1. Condições Literais / Simples (*Literal Conditions*)
Comparam um elemento da visão diretamente contra um valor literal fixo ou uma variável de sessão do usuário. Não dependem de perfis PFCG.

![[03AccessConditions_002.png]]

```abap
// Restringe a exibição apenas aos registros do departamento ADMIN:
where DepartmentId = 'ADMIN'

// Restringe a exibição aos registros criados pelo próprio usuário logado:
where CreatedBy = $session.user
```

---

### 2. Condições PFCG (*PFCG Conditions / PFCG Aspect*)
Conectam elementos da CDS View aos perfis de autorização atribuídos ao usuário mestre (transação PFCG / Business Roles):

```abap
where ( DepartmentId ) = aspect pfcg_auth(
                           /LRN/DPMNT,
                           /LRN/DPMNT,
                           ACTVT = '03'
                         );
```
- Mapeia o elemento `DepartmentId` da visão contra o campo de autorização `/LRN/DPMNT` do objeto de autorização `/LRN/DPMNT`.
- Filtra estritamente operações de exibição (`ACTVT = '03'`).

---

### 3. Condições de Herança (*Inheritance Conditions*)
Reutilizam integralmente as regras de controle de acesso já definidas para uma CDS View Entity subjacente. É a técnica padrão e recomendada para cenários de **visões sobre visões (*View-on-View*)**:

```abap
define role Z##_C_EMPLOYEEQUERYP {
  grant select on Z##_C_EmployeeQueryP
  where inheriting conditions from entity Z##_R_Employee;
}
```

---

# 5. Demonstração em Vídeo: Exemplos de CDS Roles

Assista ao vídeo explorando a sintaxe de aspectos PFCG com múltiplos campos e a reutilização elegante de regras via condições de herança:

<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%;">
  <iframe 
    src="https://cdnapisec.kaltura.com/p/1926081/sp/192608100/embedIframeJs/uiconf_id/27230482/partner_id/1926081?iframeembed=true&playerId=kaltura_player&entry_id=1_gv367ssi" 
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;" 
    allowfullscreen 
    webkitallowfullscreen 
    mozAllowFullScreen 
    allow="autoplay *; fullscreen *; encrypted-media *" 
    title="Understanding an Example of a CDS role with PFCG Conditions and Inheritance Conditions">
  </iframe>
</div>

---

# 6. Criação de Access Control e a Anotação `@AccessControl.authorizationCheck`

No ADT, para criar uma regra de segurança, clique com o botão direito sobre a CDS Data Definition $\rightarrow$ **New Access Control**:

![[Create_a_new_Access_Control_001.png]]
![[Create_a_new_Access_Control_002.png]]
![[Create_Access_Control_003.png]]

A anotação de cabeçalho **`@AccessControl.authorizationCheck`** na visão CDS define o comportamento de governança de segurança:

![[05AnnotationAccessControl_001.png]]

| Valor da Anotação | Comportamento no CDS |
| :--- | :--- |
| **`#NOT_REQUIRED`** | Se um Access Control existir, ele é avaliado. O verificador de sintaxe não exige que uma regra exista. *(Padrão de desenvolvimento inicial)* |
| **`#CHECK`** | Igual a `#NOT_REQUIRED`, porém emite um **aviso de sintaxe (*Warning*)** se a CDS View não possuir um Access Control associado. |
| **`#MANDATORY`** | Exigência absoluta: se a visão for acessada em tempo de execução sem uma CDS Role protegendo-a, ocorre um **Short Dump (Runtime Error)**. |
| **`#NOT_ALLOWED`** | Bloqueia controles de acesso. Se alguém criar uma CDS Role para esta visão, a regra será ignorada em tempo de execução. |
| **`#PRIVILEGED_ONLY`** | A entidade só pode ser consumida por chamadas especiais com a cláusula `WITH PRIVILEGED ACCESS` no ABAP SQL. |

---

# 7. Demonstração em Vídeo: How to Implement a CDS Access Control

Assista ao passo a passo de implementação de uma CDS Role com aspecto PFCG e outra com condições herdadas:

<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%;">
  <iframe 
    src="https://cdnapisec.kaltura.com/p/1926081/sp/192608100/embedIframeJs/uiconf_id/27230482/partner_id/1926081?iframeembed=true&playerId=kaltura_player&entry_id=1_p45lbnzp" 
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;" 
    allowfullscreen 
    webkitallowfullscreen 
    mozAllowFullScreen 
    allow="autoplay *; fullscreen *; encrypted-media *" 
    title="How to Implement a CDS Access Control">
  </iframe>
</div>

---

# 8. Exercício Prático: Criando Objetos de Autorização e CDS Access Controls (*Hands-on*)

### Objetivos do Exercício
1. Criar o Campo de Autorização **`Z##DPMNT`** associado ao Data Element de departamentos e tabela de verificação `Z##DEPMENT`.
2. Criar o Objeto de Autorização **`Z##DPMNT`** incluindo `Z##DPMNT` e o campo padrão `ACTVT`.
3. Implementar CDS Access Controls para as visões básicas **`Z##_R_Department`** e **`Z##_R_Employee`** utilizando o template *Define Role with PFCG Aspect*.
4. Implementar CDS Access Controls com condições de herança (*Inheriting Conditions*) para as visões de consumo **`Z##_C_EmployeeQueryP`** e **`Z##_C_DepartmentQuery`**.

- **Objetos de Solução da SAP:**
  - `/LRN/DPMNT` (Authorization Field e Object)
  - `/LRN/R_DEPARTMENT_AUT` e `/LRN/R_EMPLOYEE_AUT` (Access Controls Básicos)
  - `/LRN/C_DEPARTMENT_AUT` e `/LRN/C_EMPLOYEE_AUT` (Access Controls de Consumo)

---

### Tarefa 1: Criar Campo e Objeto de Autorização

1. No ADT, clique com o botão direito no seu pacote $\rightarrow$ **New** $\rightarrow$ **Other ABAP Repository Object** $\rightarrow$ filtre por `Authorization Field`.
2. Nome: **`Z##DPMNT`** | Data Element: **`Z##_DEPARTMENT_ID`**.
3. Na tela de manutenção, informe o campo *Check Table*: **`Z##DEPMENT`** e salve (**Ctrl + S**).
4. Na seção *What's next?*, clique em **Create a New Authorization Object and assign the Authorization Field to it**.
5. Nome: **`Z##DPMNT`** | Descrição: **`Authorization per department`**.
6. Confirme que o objeto contém os campos `Z##DPMNT` e `ACTVT` (com atividade `03 - Display` habilitada) e salve (**Ctrl + S**).

---

### Tarefa 2: Criar CDS Access Control Básico para Departamentos (`Z##_R_Department`)

1. Localize a Data Definition **`Z##_R_DEPARTMENT`** $\rightarrow$ clique com o botão direito $\rightarrow$ **New Access Control**.
2. Nome: **`Z##_R_DEPARTMENT`** | Descrição: **`Department (Access Control)`**.
3. Escolha o template **Define Role with PFCG Aspect** e clique em **Finish**.
4. Configure a verificação utilizando o objeto da SAP para o qual seu usuário já possui autorizações pré-configuradas:

```abap
define role Z##_R_DEPARTMENT {
  grant select on Z##_R_Department
  where ( Id ) = aspect pfcg_auth(
                   /LRN/DPMNT, 
                   /LRN/DPMNT, 
                   ACTVT = '03'
                 );
}
```

5. Ative (**Ctrl + F3**) e teste no Data Preview (**F8**): a listagem agora exibe apenas os departamentos para os quais você possui autorização expressa.

---

### Tarefa 3: Criar CDS Access Control Básico para Empregados (`Z##_R_Employee`)

1. Crie o Access Control **`Z##_R_EMPLOYEE`** apontando para `Z##_R_Employee`:

```abap
define role Z##_R_EMPLOYEE {
  grant select on Z##_R_Employee
  where ( DepartmentId ) = aspect pfcg_auth(
                             /LRN/DPMNT, 
                             /LRN/DPMNT, 
                             ACTVT = '03'
                           );
}
```

2. Ative com **Ctrl + F3**.

---

### Tarefa 4: Criar Access Controls com Herança para as Visões de Consumo

1. **Para `Z##_C_EmployeeQueryP`:**
   - Crie o Access Control **`Z##_C_EMPLOYEEQUERYP`** escolhendo o template **Define Role with Inherited Conditions**:

```abap
define role Z##_C_EMPLOYEEQUERYP {
  grant select on Z##_C_EmployeeQueryP
  where inheriting conditions from entity Z##_R_Employee;
}
```

2. **Para `Z##_C_DepartmentQuery`:**
   - Crie o Access Control **`Z##_C_DEPARTMENTQUERY`** herdando de `Z##_R_Department`:

```abap
define role Z##_C_DEPARTMENTQUERY {
  grant select on Z##_C_DepartmentQuery
  where inheriting conditions from entity Z##_R_Department;
}
```

3. Ative ambos os objetos (**Ctrl + F3**). Agora todas as camadas da sua arquitetura estão 100% blindadas e protegidas a nível de registro!
