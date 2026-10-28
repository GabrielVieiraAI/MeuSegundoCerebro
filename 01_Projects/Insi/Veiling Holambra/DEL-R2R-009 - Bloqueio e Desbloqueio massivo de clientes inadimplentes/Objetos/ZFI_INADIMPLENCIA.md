---
tags:
  - projeto
  - insi
  - veiling-holambra
  - sap
  - mensagens
  - se91
  - del-r2r-009
  - objeto-tecnico
id_demanda: DEL-R2R-009
objeto: ZFI_INADIMPLENCIA
camada: 5 - Camada de Segurança e Mensagens
data: 2026-10-23
---

# 💬 `ZFI_INADIMPLENCIA` (Classe de Mensagens - SE91)

⬅️ [[DEL-R2R-009 - Arquitetura e Objetos|Voltar para Arquitetura e Objetos]] | 🎨 [[DEL-R2R-009 - Arquitetura da Camada CDS.excalidraw|Ver no Diagrama Excalidraw]]

---

## 📌 Visão Geral do Objeto

A **`ZFI_INADIMPLENCIA`** é a **Classe de Mensagens** (transação `SE91` / Message Class no Eclipse ADT) que armazena todos os textos padronizados de sucesso, alerta e erro disparados pela classe de comportamento `[[ZCLFI_BP_CLIENTE_INAD]]`.

---

## ⚖️ Regras de Negócio Aplicadas

1. **Retorno Consolidado por Cliente (Message View):** Quando o operador seleciona múltiplos clientes e clica em **Bloquear** ou **Desbloquear**, cada cliente processado gera uma mensagem individual identificada pelo código do BP (ex.: *"Cliente 1000234 bloqueado com sucesso"* ou *"Erro ao bloquear cliente 1000235: parceiro em edição por outro usuário"*), permitindo que o Fiori exiba tudo em uma única janela de resumo (Message View), sem abrir um pop-up para cada cliente.
2. **Mensagens de Autorização:** Informa claramente caso o usuário não possua permissão no objeto `[[ZFI_BLOQ]]` para executar a ação na empresa/segmento.

---

## 🛠️ Passo a Passo da Criação do Objeto

1. **No Eclipse ADT** (ou transação `SE91` no SAP GUI):
   - Clique com o botão direito sobre o pacote de desenvolvimento `ZFI_BLOQ_INADIMPLENTES` -> **`New`** -> **`Other ABAP Repository Object`**.
   - Na caixa de pesquisa, digite **`Message Class`** (na categoria *Texts* ou *Dictionary*) e clique em **Next**.
2. Preencha as propriedades da classe de mensagens:
   - **Name:** `ZFI_INADIMPLENCIA`
   - **Description:** `DEL-R2R-009: Mensagens Bloqueio Inadimplentes`
3. Selecione a sua ordem de transporte (TR) de desenvolvimento e clique em **Finish**.
4. No editor de mensagens, cadastre os números de mensagem de `001` a `006` com seus respectivos textos e marcadores de posição (`&1`, `&2`) conforme detalhado no snippet abaixo.
5. Salve e ative o objeto com **`Ctrl + F3`**.

---

## 💻 Snippet de Código

### 📝 Código Comentado (Para Estudo e Referência)
```yaml
Message Class: ZFI_INADIMPLENCIA                                    # Nome técnico da Classe de Mensagens (SE91 / Eclipse ADT)
Descrição: "DEL-R2R-009: Mensagens de Bloqueio/Desbloqueio de Inad."# Descrição curta da classe de mensagens

Mensagens Previstas:
  001: "Cliente &1 bloqueado com sucesso no segmento &2 (Motivo 10)." # Mensagem de sucesso após bloquear o BP no FSCM
  002: "Cliente &1 desbloqueado com sucesso no segmento &2."          # Mensagem de sucesso após desbloquear o BP no FSCM
  003: "Erro ao atualizar bloqueio do cliente &1: &2"                 # Falha técnica ou exceção ao chamar as APIs do FSCM
  004: "Sem autorização para bloquear clientes na empresa &1 / segmento &2."   # Falha no AUTHORITY-CHECK ZFI_BLOQ (Atividade 05)
  005: "Sem autorização para desbloquear clientes na empresa &1 / segmento &2." # Falha no AUTHORITY-CHECK ZFI_BLOQ (Atividade 43)
  006: "Cliente &1 possui bloqueio por motivo &2 (diferente de 10 - Inadimplência)." # Alerta quando cliente já tem outro bloqueio
```

---

### 🚀 Código Limpo (Sem Comentários - Para Copiar e Colar)

```yaml
Message Class: ZFI_INADIMPLENCIA
Descrição: "DEL-R2R-009: Mensagens de Bloqueio/Desbloqueio de Inad."

Mensagens Previstas:
  001: "Cliente &1 bloqueado com sucesso no segmento &2 (Motivo 10)."
  002: "Cliente &1 desbloqueado com sucesso no segmento &2."
  003: "Erro ao atualizar bloqueio do cliente &1: &2"
  004: "Sem autorização para bloquear clientes na empresa &1 / segmento &2."
  005: "Sem autorização para desbloquear clientes na empresa &1 / segmento &2."
  006: "Cliente &1 possui bloqueio por motivo &2 (diferente de 10 - Inadimplência)."
```
