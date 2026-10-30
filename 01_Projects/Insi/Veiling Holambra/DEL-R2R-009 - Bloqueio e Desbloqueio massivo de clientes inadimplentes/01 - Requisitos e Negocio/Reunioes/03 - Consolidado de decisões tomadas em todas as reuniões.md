## **Decisões das reuniões do DEL-R2R-009**

### **1ª reunião (22/10/2026)**

1. O Job das 02:00 foi eliminado: a lista de clientes é calculada em tempo real por uma CDS View (Core Data Services) quando o usuário abre o app.
2. Nenhum cliente é bloqueado automaticamente: o usuário revisa a lista no Fiori e confirma cada ação.
3. A fonte dos títulos vencidos é a CDS standard `I_OperationalAcctgDocItem`.
4. ==🟡 A empresa `CVH1` fica fixa no código, fora da tabela de parâmetros.
	1. Pelas regras do Clean core eu não posso colocar essa variável direto no código teremos que usar a tabela de parâmetros.

### **2ª reunião (22/10/2026)**
6. O  status de bloqueio vem do campo standard (`XBLOCKED` / `BLOCK_REASON`), e a tabela de log serve apenas para auditoria.
7. Clientes bloqueados por outros motivos (fiscal ou jurídico) não aparecem no app.
8. O único motivo de bloqueio usado no app é "Inadimplência".
9. O crédito fica só na Matriz: o bloqueio é aplicado nela e a filial devedora aparece como "BP de Origem".
10. O trecho "gravação pelas classes standard para o DEL-COM-051" foi incluído por engano e deve ser desconsiderado.
11. Não será criada tabela Z de lista de trabalho: o histórico fica na tabela de log.
12. Por enquanto só se grava a tabela de log; ainda não está definido como o usuário vai consultá-la.
13. ==🟡No processamento em massa, cada cliente é tratado de forma independente e o resultado aparece em um único resumo, sem um pop-up por cliente.
		1. Proponho utilizar o  Componente do Fiori Design Message View![[Pasted image 20261023080429.png]]
14. A navegação para os apps standard de crédito e de itens do cliente é opcional.
15. Clientes de Autosserviço (supermercados) aparecem na lista, e o app terá um filtro por segmento de atuação.
16. Não haverá carga inicial na tabela de log no go-live (Go-Live = entrada em produção).
17. O consultor vai atualizar o plano de testes, retirando os cenários do Job.

### **Alinhamento Consolidado da Consultora (23/10/2026)**
18. **Chave da CDS de Títulos (`ZI_FI_TITULOS_VENCIDOS`):** A leitura da `I_OperationalAcctgDocItem` considera a chave no nível de parcela (`CompanyCode`, `AccountingDocument`, `FiscalYear`, `AccountingDocumentItem`), pois um mesmo documento contábil pode ter parcelas com vencimentos distintos.
19. **Filtros estritos dos títulos vencidos:** Serão aplicados estritamente os 4 filtros definidos pela consultora (sem filtros adicionais de razão especial ou juros/multas):
	- `FinancialAccountType = 'D'` (Contas de clientes)
	- `CompanyCode = 'CVH1'` (parametrizado via tabela de parâmetros para aderência ao Clean Core)
	- `ClearingDate` vazio/inicial (somente títulos em aberto)
	- `NetDueDate < $session.system_date` (somente títulos vencidos)
20. **Campos do Parceiro de Negócio (BP) na CDS e na tela:**
	- `BP001-GROUP_FEATURE`: identifica se o cliente é Autosserviço ou não (exibido na lista e disponível como filtro na tela).
	- `UKMBP_CMS-RISK_CLASS`: identifica o perfil do cliente para aplicação da régua de inadimplência.
21. **Motivo de bloqueio fixo (`10`):** O motivo de bloqueio considerado para inadimplência é exclusivamente o **`10`**. Clientes bloqueados com `BLOCK_REASON` diferente de `10` (ex.: fiscal ou jurídico) não aparecem no aplicativo.
22. **Simplificação da tela e da CDS Raiz:**
	- Como o motivo é fixo (`10`), não há necessidade de caixa de diálogo (pop-up) ou Value Help para seleção de motivo ao bloquear.
	- A CDS raiz do aplicativo (`ZI_FI_CLIENTE_INADIMPLENTE`) consolida os dados por **Cliente** (com títulos vencidos ou não), ordenados pela coluna de **Ação Proposta** iniciando por "Bloquear".
23. **Diferença entre Proposta de Bloqueio e Execução do Bloqueio/Desbloqueio:**
	- **Proposta de Bloqueio/Desbloqueio (Coluna na Tela):** As regras de títulos vencidos e régua por classe de risco (`1A` / `2A`) servem exclusivamente para calcular a coluna de sugestão (**Ação Proposta**) e ordenar a lista na tela.
	- **Bloqueio/Desbloqueio Efetivo (Botões de Ação):** A decisão final é sempre do usuário. As ações de **Bloquear** e **Desbloquear** executadas pelos botões funcionam de forma soberana para qualquer cliente selecionado na lista, **independentemente** de o cliente possuir títulos em atraso ou não, e independentemente do que estiver sugerido na coluna de ação proposta.