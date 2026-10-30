---
tipo: tutorial-resolucao
tipo_conteudo: problema-solucao
tags:
  - sap
  - abap-cloud
  - rap
  - odata-v2
  - fiori-elements
  - mensageria
  - feedback-visual
  - troubleshooting
  - clean-core
data: 2026-10-30

aliases:
  - "Mensageria e Feedback Visual em Ações do RAP (OData V2)"
  - "Como resolver mensagens de feedback em ações do RAP OData V2"
---

# Mensageria e Feedback Visual em Ações Transacionais no RAP (OData V2)

---

## 1. O Problema: Ações sem Retorno Visual no Fiori Elements

Em aplicações construídas com o framework **RAP** (*ABAP RESTful Application Programming Model*) expostas via **OData V2** para interfaces **SAP Fiori Elements** (como *List Report* ou *Object Page*), é muito comum desenvolvedores enfrentarem o seguinte comportamento:

* O usuário clica em um botão de ação customizada (individual ou em lote);
* O backend ABAP processa a ação perfeitamente (grava no banco, chama APIs, etc.);
* **Porém, na tela do Fiori, nada acontece visualmente:**
  * Não aparece o aviso verde de sucesso (*Message Toast*);
  * Em caso de erro, a tela não exibe o diálogo com a lista de falhas (*Message View Dialog*);
  * A tabela não recarrega os dados alterados, dando ao operador a falsa impressão de que o clique falhou.

---

## 2. Diagnóstico Técnico e Causa Raiz

A raiz desse problema está na forma como o SAP Fiori Elements interpreta as mensagens vindas de serviços **OData V2**:

### A. Diferença entre State Messages e Transition Messages
No padrão SAP, existem duas categorias fundamentais de mensagens:

1. **State Messages (Mensagens de Estado):** Ficam vinculadas permanentemente a um campo ou entidade (ex.: validação de campo obrigatório na tela).
2. **Transition Messages (Mensagens de Transição):** Representam o resultado transitório de uma operação pontual (ex.: "Cliente bloqueado com sucesso" ou "Falha ao comunicar com o FSCM").

### B. O Header HTTP `sap-message` no OData V2
Em serviços OData V2, o SAP Fiori Elements **ignora mensagens no corpo da resposta (payload)** para ações que não recarregam entidades completas. O frontend espera que as mensagens de transição venham serializadas no cabeçalho HTTP **`sap-message`**:

```http
sap-message: {
  "code": "ZFI_MSG/001",
  "message": "Cliente 1000020 bloqueado com sucesso.",
  "severity": "success",
  "target": "",
  "transition": true,
  "details": []
}
```

Se o seu código ABAP não preencher a estrutura `reported` com o tipo de severidade correto ou não vincular a chave `%tky` da linha processada, o **SAP Gateway** não gera o cabeçalho `sap-message`, deixando a interface do Fiori completamente "muda".

### C. Ausência do Refresh Global no Frontend
Mesmo quando a mensagem aparece, se o arquivo de configuração do Fiori (`manifest.json`) não estiver instruído para atualizar os dados após a ação, a tabela continua mostrando os valores desatualizados.

---

## 3. Arquitetura da Solução

O diagrama abaixo ilustra o ciclo completo de resolução: o backend reporta os status de cada instância no RAP, o SAP Gateway serializa no header HTTP e o Fiori Elements apresenta o feedback correto na UI:

[[03 - DEL-R2R-009 - Fluxo de Mensagens e Feedback.excalidraw|Abrir Fluxo Visual no Excalidraw]]

![[03 - DEL-R2R-009 - Fluxo de Mensagens e Feedback.excalidraw|Fluxo de Mensagens e Feedback Visual]]

---

## 4. A Solução Técnica Passo a Passo

### 4.1 Backend: Padrão de Preenchimento no Behavior Pool (RAP)

No método da ação (na aba *Local Types* do Behavior Pool), você deve manipular adequadamente as estruturas de retorno **`reported`** e **`failed`**:

#### Regra 1: Para Linhas Processadas com Sucesso
1. Preencha a tabela `result` para que o framework saiba que a ação foi concluída para aquela instância.
2. Adicione uma entrada na tabela **`reported-<entidade>`** com a chave `%tky` e um objeto de mensagem implementando a interface `if_abap_behv_message` com severidade de sucesso:

```abap
" 1. Confirma o resultado para a linha
APPEND VALUE #( %tky   = <ls_instancia>-%tky
                %param = <ls_instancia> ) TO result.

" 2. Emite a mensagem de sucesso que será convertida em Message Toast
APPEND VALUE #(
  %tky = <ls_instancia>-%tky
  %msg = new_message_with_text(
           severity = if_abap_behv_message=>severity-success
           text     = |Cliente { <ls_instancia>-ID } processado com sucesso.|
         )
) TO reported-minhaentidade.
```

#### Regra 2: Para Linhas Rejeitadas por Validação (Avisos/Alertas)
Se um registro não puder ser processado por regra de negócio (ex.: cadastro inválido), registre em `failed` para que o sistema saiba que a ação foi cancelada para aquela linha, mas use severidade de **aviso** (*warning*):

```abap
" Informa que a linha falhou
APPEND VALUE #( %tky = <ls_instancia>-%tky ) TO failed-minhaentidade.

" Envia o alerta explicativo para o operador
APPEND VALUE #(
  %tky = <ls_instancia>-%tky
  %msg = new_message_with_text(
           severity = if_abap_behv_message=>severity-warning
           text     = |Cliente { <ls_instancia>-ID } rejeitado: classe de risco excluída.|
         )
) TO reported-minhaentidade.
```

#### Regra 3: Para Exceções e Erros Técnicos (`CATCH cx_root`)
Em caso de erro técnico na chamada de APIs, capture a exceção, registre o erro no log e repasse a mensagem para a interface:

```abap
CATCH cx_root INTO DATA(lx_erro).
  " Registra falha na instância
  APPEND VALUE #( %tky = <ls_instancia>-%tky ) TO failed-minhaentidade.

  " Envia mensagem com severidade de erro
  APPEND VALUE #(
    %tky = <ls_instancia>-%tky
    %msg = new_message_with_text(
             severity = if_abap_behv_message=>severity-error
             text     = |Erro técnico no cliente { <ls_instancia>-ID }: { lx_erro->get_text( ) }|
           )
  ) TO reported-minhaentidade.
```

---

### 4.2 Frontend: Configuração do Refresh Automático (`manifest.json`)

Para que a tabela do Fiori Elements atualize seus dados automaticamente após a execução da ação (sem exigir que o usuário clique manualmente em "Iniciar" ou "Atualizar"), declare a propriedade **`forceGlobalRefresh: true`** no arquivo `manifest.json` do aplicativo:

```json
"targets": {
  "MinhaListaReport": {
    "type": "Component",
    "id": "MinhaListaReport",
    "name": "sap.suite.ui.generic.template.ListReport",
    "options": {
      "settings": {
        "entitySet": "ZC_MINHA_ENTIDADE",
        "tableSettings": {
          "type": "ResponsiveTable"
        }
      }
    },
    "component": {
      "name": "sap.suite.ui.generic.template.ListReport",
      "settings": {
        "tableSettings": {
          "type": "ResponsiveTable"
        }
      }
    }
  }
}
```

Nas anotações de ação no manifest, defina:

```json
"Actions": {
  "minhaAcao": {
    "id": "minhaAcaoBtn",
    "text": "Executar Ação",
    "press": "minhaAcao",
    "requiresSelection": true,
    "forceGlobalRefresh": true
  }
}
```

---

## 5. Comportamento Visual Resultante no Fiori Elements

Com essa arquitetura implementada, o SAP Fiori Elements reage de forma nativa e inteligente dependendo da quantidade de itens selecionados:

| Quantidade de Itens | Comportamento na Interface | O que o Usuário Vê |
| :--- | :--- | :--- |
| **1 Item Processado** | **Message Toast** (Rodapé) | Barra verde flutuante no canto inferior da tela: *"Cliente X processado com sucesso."* Não interrompe a navegação. |
| **Múltiplos Itens (Em Lote)** | **Message View Dialog** (Pop-up) | Janela modal consolidada com a lista de todos os registros processados, agrupando sucessos, avisos e eventuais falhas. |
| **Após o Fechamento** | **Auto-Refresh** | A lista é recarregada automaticamente via backend, exibindo os novos valores sem necessidade de F5. |

---

## 6. Template de Código Reutilizável (Pattern ABAP Cloud)

Abaixo está o esqueleto padronizado para qualquer ação customizada em Behavior Pool:

```abap
CLASS lhc_sua_entidade DEFINITION INHERITING FROM cl_abap_behavior_handler.
  PRIVATE SECTION.
    METHODS executarAcao FOR MODIFY
      IMPORTING keys FOR ACTION suaEntidade~executarAcao RESULT result.
ENDCLASS.

CLASS lhc_sua_entidade IMPLEMENTATION.

  METHOD executarAcao.
    " 1. Lê as instâncias selecionadas
    READ ENTITIES OF zi_sua_entidade IN LOCAL MODE
      ENTITY suaEntidade
      ALL FIELDS WITH CORRESPONDING #( keys )
      RESULT DATA(lt_instancias).

    " 2. Processa cada instância individualmente
    LOOP AT lt_instancias ASSIGNING FIELD-SYMBOL(<ls_item>).
      TRY.
          " Validação de Regra de Negócio
          IF <ls_item>-Status = 'BLOQUEADO'.
            APPEND VALUE #( %tky = <ls_item>-%tky ) TO failed-suaentidade.
            APPEND VALUE #(
              %tky = <ls_item>-%tky
              %msg = new_message_with_text(
                       severity = if_abap_behv_message=>severity-warning
                       text     = |Registro { <ls_item>-Codigo } já está bloqueado.|
                     )
            ) TO reported-suaentidade.
            CONTINUE.
          ENDIF.

          " Executa a lógica da ação / Chamada de API
          ...

          " Confirma sucesso da linha
          APPEND VALUE #( %tky   = <ls_item>-%tky
                          %param = <ls_item> ) TO result.

          APPEND VALUE #(
            %tky = <ls_item>-%tky
            %msg = new_message_with_text(
                     severity = if_abap_behv_message=>severity-success
                     text     = |Registro { <ls_item>-Codigo } atualizado com sucesso.|
                   )
          ) TO reported-suaentidade.

        CATCH cx_root INTO DATA(lx_erro).
          APPEND VALUE #( %tky = <ls_item>-%tky ) TO failed-suaentidade.
          APPEND VALUE #(
            %tky = <ls_item>-%tky
            %msg = new_message_with_text(
                     severity = if_abap_behv_message=>severity-error
                     text     = |Falha técnica no registro { <ls_item>-Codigo }: { lx_erro->get_text( ) }|
                   )
          ) TO reported-suaentidade.
      ENDTRY.
    ENDLOOP.
  ENDMETHOD.

ENDCLASS.
```

---

## 7. Referências e Conexões

* Objeto de Caso Real: [[08 - ZCLFI_BP_CLIENTE_INAD|ZCLFI_BP_CLIENTE_INAD]]
* Diagrama do Fluxo: [[03 - DEL-R2R-009 - Fluxo de Mensagens e Feedback.excalidraw|Fluxo de Mensagens e Feedback]]
* Conceito do Framework: [[RAP - ABAP RESTful Application Programming|ABAP RESTful Application Programming Model]]
