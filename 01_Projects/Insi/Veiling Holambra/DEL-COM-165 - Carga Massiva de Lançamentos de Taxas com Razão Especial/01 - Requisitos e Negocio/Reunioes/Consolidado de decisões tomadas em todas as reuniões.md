---
tags:
  - projeto
  - insi
  - veiling-holambra
  - sap
  - fi
  - del-com-165
  - decisoes
id_demanda: "DEL-COM-165"
tipo: consolidado-decisoes
data: 2026-11-10
aliases:
  - "Consolidado de decisões tomadas em todas as reuniões"
---

# Decisões das Reuniões · DEL-COM-165

### 1ª Reunião (`10/11/2026`) — [[01 - Primeira reunião com consultores|Ata da reunião]]
1. Serão **2 aplicativos Fiori independentes**: App 1 de Carga e App 2 de Parametrização dos Tipos de Movimento.
2. **Erros de dado são corrigidos no Excel** e reenviados. Não haverá edição de campos na tela.
3. **Lançamento parcial permitido**: um sítio com erro não impede o lançamento dos demais documentos da carga.
4. **Usar as mensagens nativas da BAPI de check**. Validações próprias apenas para o layout/modelo do arquivo e para as regras da parametrização.
5. **Liberdade do desenvolvedor na arquitetura** (tabelas, CDS, classes, nomes). Ao final, repassar ao consultor a tabela de objetos criados.
6. A alternativa de redução de escopo foi descartada: **a solução tem que ser Fiori**.
7. **Gravar em tabela** o histórico das cargas e o resultado dos lançamentos, sem criar um terceiro aplicativo de log.
8. **Draft não é necessário** no App de Carga.
9. **Nada foi desenvolvido ainda**. A EF do consultor é apenas apoio (no projeto, a EF é o DPS).
10. Os campos **débito/crédito** do App 2 provavelmente não são necessários: o essencial é o bloqueio por tipo e a obrigatoriedade da data base.
11. **Eliminação do botão Reprocessar (Decisão Gabriel Vieira):** Não haverá botão de reprocessamento em tela no App 1. Todo e qualquer erro na carga (seja inconsistência de planilha ou bloqueio cadastral externo no SAP) segue o fluxo único e padronizado: correção da causa raiz e nova importação da planilha contendo apenas os documentos pendentes, eliminando complexidade e duplicidade de caminhos de correção.
