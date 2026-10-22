---
tags:
  - projeto
  - insi
  - veiling-holambra
  - sap
  - fi-ar
  - fscm
  - rap
  - del-r2r-009
  - arquitetura
id_demanda: DEL-R2R-009
tipo: alinhamento-tecnico-provisorio
data: 2026-10-22
---
## **Decisões das reuniões do DEL-R2R-009**

### **1ª reunião (22/10/2026)**

1. O Job das 02:00 foi eliminado: a lista de clientes é calculada em tempo real por uma CDS View (Core Data Services) quando o usuário abre o app.
2. Nenhum cliente é bloqueado automaticamente: o usuário revisa a lista no Fiori e confirma cada ação.
3. A fonte dos títulos vencidos é a CDS standard `I_OperationalAcctgDocItem`.
4. A empresa `CVH1` fica fixa no código, fora da tabela de parâmetros.
5. A tabela Z de log não existe e deve ser criada do zero.

### **2ª reunião (22/10/2026)**

6. O status de bloqueio vem do campo standard (`XBLOCKED` / `BLOCK_REASON`), e a tabela de log serve apenas para auditoria.
7. Clientes bloqueados por outros motivos (fiscal ou jurídico) não aparecem no app.
8. O único motivo de bloqueio usado no app é "Inadimplência".
9. O crédito fica só na Matriz: o bloqueio é aplicado nela e a filial devedora aparece como "BP de Origem".
10. A integração com sistemas legados é responsabilidade do `DEL-COM-051` (via Event Mesh) e está fora do escopo.
11. O crédito sazonal está fora do escopo.
12. Volume e frequência do GAP são desconsiderados, porque dependiam do Job.
13. O trecho "gravação pelas classes standard para o DEL-COM-051" foi incluído por engano e deve ser desconsiderado.
14. Não será criada tabela Z de lista de trabalho: o histórico fica na tabela de log.
15. Por enquanto só se grava a tabela de log; ainda não está definido como o usuário vai consultá-la.
16. No processamento em massa, cada cliente é tratado de forma independente e o resultado aparece em um único resumo, sem um pop-up por cliente.
17. O formato desse resumo de resultado será proposto pelo desenvolvedor.
18. A navegação para os apps standard de crédito e de itens do cliente é opcional.
19. A tabela de parâmetros guarda a relação classe de risco × perfil: `1A` à vista, `2A` a prazo e `5` excluída.
20. O objeto de autorização `Z_FI_BLOQ` está confirmado e será criado pelo desenvolvedor.
21. Juros e multas não entram no cálculo: vale o valor original do título.
22. Clientes de Autosserviço (supermercados) aparecem na lista, e o app terá um filtro por segmento de atuação.
23. Não haverá carga inicial na tabela de log no go-live (Go-Live = entrada em produção).
24. O consultor vai atualizar o plano de testes, retirando os cenários do Job.
25. A especificação técnica começa já e será enviada ao Rafa, líder ABAP.