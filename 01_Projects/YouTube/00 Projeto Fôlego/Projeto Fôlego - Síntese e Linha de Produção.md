---
tipo: projeto
tags:
  - projeto
  - youtube
  - canal-dark
  - financas
  - motion-graphics
  - claude
status: planejamento
data_criacao: 2026-11-03
nicho: "Finanças Pessoais, Desendividamento e Princípios Econômicos"
---

# Projeto Fôlego: Síntese e Linha de Produção

## Parâmetros Operacionais do Canal

- **Nome do Canal:** Projeto Fôlego
- **Formato:** Canal Dark (sem exibição de imagem pessoal).
- **Proposta Central:** Ensino de princípios de matemática financeira e desendividamento por meio de narrativas curtas com personagens fictícios submetidos a condições econômicas reais.
- **Motor de Animação:** Geração procedural via JavaScript, HTML5 Canvas e SVG executada no sandbox do [[Criação de Motion Graphics com Claude via Código (Artifacts)|Claude Artifacts]].
- **Motor de Áudio:** Locução sintetizada via ElevenLabs atuando como relógio mestre (*Master Clock*) da linha do tempo.
- **Engenharia de Roteiro:** Estrutura dos 4 Ps baseada no [[Framework de Vídeos Virais - Ideia, Embalagem e Roteiro (4 Ps)]].

---

## Arquitetura de Roteiro (180 a 300 Segundos)

### Bloco 1: Abertura e Retenção (0 a 45s)
- **Promessa (0 a 10s):** Apresentação do benefício quantitativo direto (ex.: eliminação de juros compostos negativos, redução do saldo devedor em prazo fixo).
- **Prova (10 a 20s):** Exibição em tela de gráfico comparativo de taxas nominais de juros, Custo Efetivo Total (CET) ou cálculo de amortização.
- **Persona (20 a 35s):** Apresentação do personagem fictício com renda, despesas fixas e dívidas delimitadas em valores absolutos.
- **Plano (35 a 45s):** Rota dividida em 3 passos técnicos para a resolução do passivo financeiro.

### Bloco 2: Mecânica do Erro Financeiro (45 a 120s)
- Dissecção do mecanismo contratual que causou a inadimplência ou a rolagem de dívida (ex.: juros rotativos de cartão acima de 14% a.m., incidência de IOF em atraso, amortização negativa no cheque especial).
- Exibição de gráficos em Canvas com barras acumulativas de juros vs. principal.

### Bloco 3: Aplicação do Princípio Econômico (120 a 220s)
- Implementação da estratégia pelo personagem.
- Modificação dos parâmetros visuais no código: redução do volume de dívida, realocação de fluxo de caixa e reestruturação de contratos.

### Bloco 4: Síntese e Protocolo de Execução (220 a 300s)
- Exibição do resultado final (saldo devedor liquidado ou reduzido a custo operacional mínimo).
- Checklist de 3 passos acionáveis para o espectador aplicar em seus próprios contratos bancários.

---

## Padronização Técnica Visual (Claude Artifacts)

- **Linguagem Visual:** Vetores 2D (*Flat Vector*) com sobreposições estruturadas (*Paper Cutout*).
- **Codificação de Cores:**
  - `#EF4444` (Vermelho): Passivo financeiro, juros de mora, déficit orçamentário.
  - `#10B981` (Verde): Amortização do saldo principal, reserva de liquidez, saldo positivo.
  - `#64748B` (Cinza neutro): Custos fixos e despesas essenciais.
  - `#2563EB` (Azul técnico): Fluxo de entrada de receita e aportes de quitação.
- **Componentes Paramétricos em Código:**
  - Gráficos de barras proporcionais aos valores monetários da narrativa.
  - Linha do tempo acionada por eventos fonéticos extraídos do arquivo `SRT`.
  - Contadores numéricos interpolados via `requestAnimationFrame` para atualização contínua de valores.

---

## Fluxo Operacional de Produção

O processo segue 6 fases lineares, com duração total estimada de 2 horas e 55 minutos por vídeo:

| Fase | Ação Técnica | Ferramenta | Entrada | Saída | SLA |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1. Estruturação** | Seleção de princípio e modelagem matemática do personagem | Obsidian | Matriz de Conteúdo | Roteiro estruturado nos 4 Ps | 30 min |
| **2. Áudio Mestre** | Síntese de voz e marcação temporal | ElevenLabs | Roteiro final | Arquivo `.mp3` + Timestamps `SRT` | 10 min |
| **3. Storyboard** | Quebra cena a cena e alinhamento visual | Claude (Chat) | Prompt de Storyboard + Tema | Decupagem validada | 15 min |
| **4. Código Visual** | Geração do script JS/Canvas via Artifact | Claude Artifacts | Arquivo `.mp3` + Prompt de Estilo | Código interpretável funcional | 50 min |
| **5. Refatoração** | Ajustes cirúrgicos de coordenadas, cores e transições | Claude Artifacts | Código gerado | Aplicação web final sem falhas visuais | 20 min |
| **6. Embalagem** | Criação de Thumbnail (Dúvida) e Título (Solução) | Figma / Photoshop | Diretriz dos 4 Ps | Arquivo `.png` 1280x720 + Título validado | 50 min |

---

## Cronograma de Lançamento (Piloto: Primeiros 3 Episódios)

### Episódio 01: Método Bola de Neve (Amortização por Menor Saldo)
- **Princípio:** Alocação de excedente financeiro exclusivamente na menor dívida absoluta para encerramento de contratos e liberação de fluxo de caixa operacional.
- **Personagem:** Mariana. Renda líquida de R$ 3.200. Quatro cartões de crédito somando R$ 16.500 em passivos com taxas nominais entre 9% e 15% a.m.
- **Gráfico Principal:** Quatro retângulos horizontais decrescentes com efeito de encerramento em cascata.

### Episódio 02: Custo Efetivo Total (CET) e o Rotativo do Cartão
- **Princípio:** Comparação de CET para substituição de linhas de crédito de alta frequência (rotativo de 430% a.a.) por linhas estruturadas de juros controlados (consignado ou CDC a 35% a.a.).
- **Personagem:** Roberto. Renda líquida de R$ 4.500. Dívida de R$ 8.000 acumulando juros sobre pagamento de valor mínimo.
- **Gráfico Principal:** Curva exponencial de juros compostos comparada à curva linear de amortização parcelada fixa.

### Episódio 03: Reserva de Liquidez Técnica como Isolador de Dívida
- **Princípio:** Formação de reserva de curto prazo alocada em títulos de liquidez diária (100% CDI) para evitar recurso a crédito emergencial de alto custo.
- **Personagem:** Lucas. Renda de R$ 2.800. Ausência de liquidez imediata transformando um conserto veicular de R$ 1.100 em endividamento de 24 meses via cheque especial.
- **Gráfico Principal:** Diagrama de barreira orçamentária atuando como separador entre imprevisto financeiro e fluxo de caixa mensal.
