---
tipo: clippings
title: "Collecting Usage Data for Custom Code"
source: "https://learning.sap.com/courses/practicing-clean-core-extensibility-for-sap-s-4hana-cloud/collecting-usage-data-for-custom-code_e9bc634f-d673-49ce-a917-983ca50c4e47"
created: 2026-11-03
tags:
  - sap
  - abap
  - abap-cloud
  - scmon
  - upl
  - susg
  - custom-code-migration
  - clean-core
---
**Roteiro de Estudos Relacionado:** [[Roteiro de Estudos SAP]]

# Objetivos de Aprendizado

Após concluir esta lição, você será capaz de:
- Coletar dados de utilização real de código customizado utilizando o **ABAP Call Monitor (`SCMON`)** e **UPL** (*Collect usage data with ABAP call monitor*).
- Explicar as 5 etapas estruturadas da SAP para desativação e deleção segura de código legado.
- Conhecer a ferramenta de agregação de dados **`SUSG`** e o app Fiori **Custom Code Migration (CCM)**.

---

## 1. Por que Avaliar o Código Customizado?

Ao longo das décadas, os clientes acumularam milhares de saídas (*exits*), relatórios `Z` e modificações no SAP ERP. No entanto, o SAP S/4HANA redefine a experiência do usuário com o **SAP Fiori**, adota novos modelos de dados simplificados e entrega processos de negócio modernos nativamente.

Como resultado, uma grande parcela das extensões antigas torna-se desnecessária porque:
- O objetivo funcional original passou a ser coberto pela funcionalidade padrão do SAP S/4HANA.
- Os processos de negócio da empresa evoluíram e tornaram a função obsoleta.

Manter esse código legado geraria custos desnecessários de adaptação e suporte. A meta é eliminá-lo de forma sistemática e segura.

![[Transition_to_SAP_S4HANA_004.png]]

---

## 2. O Processo de 5 Etapas Recomendado pela SAP

A SAP recomenda um fluxo rigoroso para a esteira de avaliação e desativação:

```
1. Coleta e Agregação de Dados de Uso
   (SCMON / UPL em Produção -> Agregação com SUSG)
          ↓
2. Determinação do Escopo de Remoção
   (App Fiori Custom Code Migration / ATC)
          ↓
3. Procedimento de Backup e Restauração
   (Geração e Exportação de Ordem de Transporte)
          ↓
4. Verificação Funcional da Aplicação
   (Testes em Ambiente Sandbox sem a Extensão)
          ↓
5. Deleção Definitiva durante a Conversão
   (Software Update Manager - SUM elimina os objetos)
```

### Etapa 1: Coleta e Agregação de Dados de Uso
Duas ferramentas oficiais podem ser utilizadas no ambiente de produção:
1. **Usage and Procedure Logging (UPL):** Ferramenta clássica que registra a execução de blocos de procedimentos ABAP.
2. **ABAP Call Monitor (transação `SCMON`):** Ferramenta moderna que substitui o UPL. Além de registrar quais blocos de código foram executados, **identifica quem foi o chamador (*the caller*)** daquela rotina.

> [!WARNING] Regra de Ouro de Performance
> A SAP desencoraja formalmente a execução simultânea de `SCMON` e `UPL` no mesmo ambiente para evitar sobrecarga no banco de dados de produção. Se a empresa já utilizava o UPL com dados históricos no SAP Solution Manager, pode mantê-lo; caso contrário, prefira o `SCMON`.

- **Janela de Coleta Recomendada:** A ferramenta deve rodar no ambiente de **produção** por um período de **6 a 18 meses**, garantindo que capture ao menos **um fechamento contábil de final de ano (*year-end closing*)**.
- **Agregação com a Transação `SUSG`:** Como os dados detalhados do `SCMON` são descartados periodicamente para economizar espaço de armazenamento, a transação **`SUSG`** é utilizada para agregar e consolidar o histórico de longo prazo.

### Etapa 2: Determinação de Extensões a Remover via Análise de Código
Com os dados de uso agregados, a equipe utiliza:
- **App Fiori Custom Code Migration (CCM):** Pode ser executado em um sistema Sandbox do SAP S/4HANA ou a partir do **SAP BTP ABAP Environment** conectado ao SAP ERP via RFC e SAP Cloud Connector.
- O app cruza as estatísticas do `SCMON`/`UPL` com as regras de verificação do **ABAP Test Cockpit (ATC)**. Ele identifica com precisão as extensões que nunca foram executadas nos últimos 12 meses e cria o pacote de escopo para exclusão.

### Etapa 3: Preparação do Procedimento de Backup e Restauração
Para eliminar o receio corporativo de apagar código antigo que venha a ser solicitado futuramente:
- Todos os programas, classes e tabelas marcados para descarte são inseridos em uma **ordem de transporte (*Transport Request*)** no SAP ERP.
- A ordem é liberada e seus arquivos de dados e cofiles são arquivados no nível do sistema operacional ou no SAP Solution Manager.
- Se no futuro for identificado que uma rotina excluída é necessária, a ordem de transporte pode ser reimportada e adaptada.

### Etapa 4: Verificação Funcional da Aplicação
Antes de apagar definitivamente em produção, os cenários de negócio são testados no sistema de testes (*Sandbox*) para validar se a aplicação padrão atende aos usuários sem falhas.

### Etapa 5: Deleção da Extensão durante a Conversão do Sistema
Durante a execução do **Software Update Manager (SUM)** na janela de conversão, o arquivo de escopo de exclusão gerado pelo app Custom Code Migration é alimentado no SUM. O assistente deleta automaticamente todos os objetos customizados não utilizados, deixando o novo SAP S/4HANA limpo de "código zumbi".

---

## 3. Simulação Prática Oficial SAP (Enable Now)

Acesse a simulação interativa oficial da SAP para praticar a configuração do ABAP Call Monitor:

> [!TIP] Exercício Prático Interativo
> **Título:** *Collect Usage Data using the ABAP Call Monitor*  
> **Link Oficial:** [Iniciar Simulação no SAP Enable Now](https://learnsap.enable-now.cloud.sap/pub/mmcp/index.html?show=project!PR_4B22A228ADCC5AAC:uebung)  
> **Objetivo:** Utilizar a transação `SCMON` para ativar o monitoramento de chamadas de programas que serão posteriormente avaliados no app Fiori Custom Code Migration.
