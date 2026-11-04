---
tipo: clippings
title: "Evaluating Between a System Conversion or a New Implementation"
source: "https://learning.sap.com/courses/practicing-clean-core-extensibility-for-sap-s-4hana-cloud/evaluating-between-a-system-conversion-or-a-new-implementation_d8ae2a25-1a52-43fc-8977-51b2ac714026"
created: 2026-11-03
tags:
  - sap
  - abap
  - abap-cloud
  - system-conversion
  - new-implementation
  - compatibility-packs
  - lift-and-shift
  - clean-core
---
**Roteiro de Estudos Relacionado:** [[Roteiro de Estudos SAP]]

# Objetivos de Aprendizado

Após concluir esta lição, você será capaz de:
- Avaliar os fatores críticos de decisão entre **Conversão de Sistema (*System Conversion / Brownfield*)** e **Nova Implementação (*New Implementation / Greenfield*)** (*Evaluate factors to consider in choosing the appropriate SAP S4HANA Cloud adoption approach*).
- Descrever o propósito e o funcionamento dos **Compatibility Packs**.
- Compreender por que a SAP contraindica veementemente a prática de *"Lift and Shift"* de código customizado legado.

---

## 1. O Dilema Decisório: Brownfield vs Greenfield

A escolha entre realizar uma conversão de sistema ou começar uma nova implementação do zero é uma das decisões arquiteturais e executivas de maior impacto em uma organização.

> [!NOTE] Estatística Oficial do Mercado SAP
> Pesquisas conduzidas pela SAP indicam que a divisão de mercado entre clientes que escolhem **System Conversion** e clientes que optam por **New Implementation** é historicamente equilibrada em **50% / 50%**.  
> Não existe uma resposta única ou "bala de prata"; a decisão correta depende estritamente dos fatores de negócio, arquitetura técnica e apetite a mudanças da organização.

---

## 2. Fatores Críticos de Decisão

Assista ao vídeo oficial da SAP que detalha as principais considerações avaliadas pelas equipes de liderança e arquitetura:

<iframe 
    src="https://cdnapisec.kaltura.com/p/1921661/embedPlaykitJs/uiconf_id/50355372?iframeembed=true&entry_id=1_ff7rqd9d" 
    width="100%" 
    height="400" 
    allowfullscreen 
    frameborder="0">
</iframe>

> [!NOTE] Síntese Estruturada do Vídeo: Fatores Decisórios
> Na escolha do caminho de migração, os seguintes fatores centrais devem ser ponderados:
> 
> 1. **Patrocínio e Alinhamento Executivo (*Sponsorship*):**
>    - Se a diretoria patrocina uma reinvenção completa da empresa, quebra de paradigmas e adoção integral de processos de melhores práticas mundiais (*Fit-to-Standard*), o caminho natural é **New Implementation (Greenfield)**.
>    - Se a prioridade estratégica é preservar os processos consolidados, minimizar o impacto cultural sobre os usuários e reduzir o tempo de transição técnica, a preferência é **System Conversion (Brownfield)**.
> 
> 2. **Dados Transacionais e Histórico (*Transactional Data*):**
>    - Em indústrias altamente reguladas onde há exigência de manter todo o histórico transacional de 10 a 20 anos acessível e auditável na mesma base operacional, a **Conversão de Sistema** é a solução indicada, pois retém todas as tabelas históricas convertidas.
>    - Em contrapartida, na **Nova Implementação**, apenas dados cadastrais (mestres) e partidas abertas/saldos contábeis iniciais são migrados; o histórico antigo é arquivado em sistemas de consulta legados ou *data lakes*.
> 
> 3. **Interfaces e Paisagem de Integração (*Interfaces*):**
>    - Clientes com centenas de interfaces legadas ponto a ponto em operação estável podem achar proibitivo reescrever todas as conexões simultaneamente, favorecendo a conversão.
>    - Se o objetivo for modernizar a arquitetura corporativa adotando APIs padronizadas e desacopladas no SAP Integration Suite, a nova implementação torna-se um acelerador.
> 
> 4. **Código Customizado e Dívida Técnica Acumulada:**
>    - Bases de ERP com décadas de modificações descontroladas, clones não documentados e alto custo de manutenção representam forte indicativo para Greenfield, cortando a dívida técnica na raiz.
> 
> 5. **Estratégia de Entrada em Produção (*Rollout*):**
>    - A conversão de sistema é tipicamente um evento de *"Big Bang"* (toda a instância é convertida na mesma data).
>    - A nova implementação permite um modelo de implantação progressivo (*Phased Rollout*), ativando uma filial, unidade de negócio ou país por etapa.

---

## 3. Compatibility Packs (Pacotes de Compatibilidade)

Para viabilizar uma transição suave e não disruptiva para os clientes que escolhem a conversão de sistema, a SAP disponibiliza os **Compatibility Packs**:
- Concedem direitos de uso temporários que permitem a execução de certas funcionalidades clássicas do SAP ERP dentro do ambiente SAP S/4HANA.
- Os processos de negócio legados continuam operando enquanto a organização planeja e implementa as rotinas modernas nativas do S/4HANA em fases planejadas.
- Dessa forma, a empresa não precisa mudar 100% de seus processos no exato momento da conversão técnica.

---

## 4. O Alerta contra o *"Lift and Shift"*

Uma armadilha comum observada em projetos é a tentativa de combinar os dois mundos de forma inadequada: contratar uma **Nova Implementação (*Greenfield*)**, mas simplesmente "copiar e colar" (*Lift and Shift*) os milhares de programas `Z`, relatórios e funções legadas para dentro do novo sistema sem nenhuma triagem prévia.

> [!CAUTION] Alerta Formal da SAP
> A SAP **recomenda fortemente que os clientes NUNCA façam *"Lift and Shift"* de código customizado** para uma nova implementação.  
> Se o cliente importar o código antigo às cegas, perderá o benefício do Clean Core nativo e ainda terá que arcar com todo o custo de remoção, adaptação manual e otimização de performance, elevando os custos do projeto a níveis muito superiores aos de uma conversão normal.
