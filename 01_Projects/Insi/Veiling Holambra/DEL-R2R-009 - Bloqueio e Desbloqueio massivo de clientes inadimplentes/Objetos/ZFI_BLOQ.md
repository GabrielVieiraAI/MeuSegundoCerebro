---
tags:
  - projeto
  - insi
  - veiling-holambra
  - sap
  - seguranca
  - su21
  - del-r2r-009
  - objeto-tecnico
id_demanda: DEL-R2R-009
objeto: ZFI_BLOQ
camada: 5 - Camada de Segurança e Mensagens
data: 2026-10-23
---

# 🔐 `ZFI_BLOQ` (Objeto de Autorização - SU21)

⬅️ [[DEL-R2R-009 - Arquitetura e Objetos|Voltar para Arquitetura e Objetos]] | 🎨 [[DEL-R2R-009 - Arquitetura da Camada CDS.excalidraw|Ver no Diagrama Excalidraw]]

---

## 📌 Visão Geral do Objeto

O **`ZFI_BLOQ`** é o **Objeto de Autorização** (transação `SU21` / Authorization Object no Eclipse ADT) responsável por garantir a segurança de acesso ao aplicativo de gestão de inadimplência.

Ele é verificado tanto na leitura dos dados quanto na execução dos botões **Bloquear** e **Desbloquear** dentro da classe `[[ZCLFI_BP_CLIENTE_INAD]]`.

---

## ⚖️ Regras de Negócio Aplicadas

1. **Controle por Empresa, Segmento de Crédito e Atividade:**
   - `BUKRS` (Empresa): ex. `CVH1`;
   - `UKM_SGMNT` (Segmento de Crédito): ex. `1000`;
   - `ACTVT` (Atividade):
     - `03` = Exibir lista de clientes;
     - `05` = Bloquear cliente (`bloquearCliente`);
     - `43` = Liberar / Desbloquear cliente (`desbloquearCliente`).
2. **Perfis de Negócio:** Atribuído à Role PFCG dedicada ao app, destinada aos operadores de Contas a Receber e Gestão de Crédito (`SAP_BR_AR_MANAGER` e `SAP_BR_CREDIT_CONTROLLER`).

---

## 🛠️ Passo a Passo da Criação do Objeto

1. **No SAP GUI:** Acesse a transação **`SU21`** (ou no Eclipse ADT: clique com o botão direito no pacote -> **`New`** -> **`Other ABAP Repository Object`** -> **`Authorization Object`**).
2. Localize a classe de objetos de autorização financeira (ex.: **`ZFI`**) ou crie-a se necessário.
3. Clique em **Criar Objeto de Autorização** e preencha:
   - **Objeto:** `ZFI_BLOQ`
   - **Texto Breve:** `DEL-R2R-009: Aut. Bloqueio Clientes Inadimplentes`
   - **Classe de Objetos:** `ZFI`
4. Na aba **Campos de Autorização**, adicione os três campos:
   - `BUKRS` (Empresa)
   - `UKM_SGMNT` (Segmento de Crédito FSCM)
   - `ACTVT` (Atividade)
5. Na configuração do campo `ACTVT` (Atividades Permitidas), marque:
   - `03` = Exibir
   - `05` = Bloquear
   - `43` = Liberar (Desbloquear)
6. Salve o objeto na sua ordem de transporte (TR) de desenvolvimento.

---

## 💻 Snippet de Código

### 📝 Código Comentado (Para Estudo e Referência)
```abap
" Exemplo de verificação do objeto ZFI_BLOQ dentro de ZCLFI_BP_CLIENTE_INAD:
AUTHORITY-CHECK OBJECT 'ZFI_BLOQ'                                      " Valida autorização de acesso ao objeto customizado ZFI_BLOQ
  ID 'BUKRS'     FIELD 'CVH1'                                          " Campo 1: Empresa contábil autorizada (Veiling Holambra)
  ID 'UKM_SGMNT' FIELD '1000'                                          " Campo 2: Segmento de crédito do FSCM avaliado
  ID 'ACTVT'     FIELD '05'.                                           " Campo 3: Operação autorizada (03 = Exibir | 05 = Bloquear | 43 = Liberar)

IF sy-subrc <> 0.                                                      " Retorno diferente de zero indica falta de autorização no perfil PFCG
  " Adiciona mensagem 004 ou 005 da classe ZFI_INADIMPLENCIA na estrutura reported/failed
ENDIF.
```

---

### 🚀 Código Limpo (Sem Comentários - Para Copiar e Colar)

```abap
AUTHORITY-CHECK OBJECT 'ZFI_BLOQ'
  ID 'BUKRS'     FIELD 'CVH1'
  ID 'UKM_SGMNT' FIELD '1000'
  ID 'ACTVT'     FIELD '05'.

IF sy-subrc <> 0.
ENDIF.
```
