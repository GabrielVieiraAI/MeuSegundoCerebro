---
tipo: projeto
tags:
  - youtube
  - canal-sap
  - sap
  - abap-cloud
  - checklist
  - esteira-de-producao
  - lancamento
status: em-andamento
data_criacao: 2026-11-04
---

# Checklist de Lançamento e Tarefas: Gabriel Vieira | ABAP Cloud

> Roteiro prático com todas as etapas necessárias para configurar a infraestrutura, preparar o ambiente de gravação e publicar os primeiros conteúdos sobre SAP e certificação técnica, sem mostrar o rosto e com o menor atrito operacional possível.

---

## Fase 1: Criação e Configuração da Conta no YouTube

- [x] **1.1. Criar o Canal de Marca (*Brand Account*)** ✅ 2026-11-05
  - Acessar o YouTube logado na sua conta Google existente.
  - Ir em **Configurações > Adicionar ou gerenciar seus canais > Criar um canal**.
  - *Vantagem técnica:* Cria um canal isolado do seu e-mail pessoal, permitindo nome personalizado e preservando a segurança da sua conta principal.
- [x] **1.2. Definir o Nome e Identificador (@handle)** ✅ 2026-11-05
  - **Nome Definido:** `Gabriel Vieira | ABAP Cloud`
  - **@handle sugerido:** `@gabrielvieira.abap` (ou `@gabrielvieira.abapcloud`)
- [x] **1.3. Identidade Visual Básica (feita em 10 minutos)** ✅ 2026-11-05
  - **Foto de Perfil:** Foto oficial com fundo Dark Mode Tech e iluminação rim light em ciano ([foto_perfil_gabriel_vieira.jpg](file:///C:/Users/gabriel.vsouza/source/MeuSegundoCerebro/01_Projects/YouTube/GabrielVieira_ABAPCloud/foto_perfil_gabriel_vieira.jpg)).
  - **Banner do Canal:** Resolução otimizada 2560x1440 e 2048x1152 com o título e proposta central ([banner_canal_gabriel_vieira_2560x1440.jpg](file:///C:/Users/gabriel.vsouza/source/MeuSegundoCerebro/01_Projects/YouTube/GabrielVieira_ABAPCloud/banner_canal_gabriel_vieira_2560x1440.jpg)).
  - **Marca d'Água:** Ícones de 150x150 em PNG transparente prontos para o player de vídeo ([marca_dagua_gv_badge.png](file:///C:/Users/gabriel.vsouza/source/MeuSegundoCerebro/01_Projects/YouTube/GabrielVieira_ABAPCloud/marca_dagua_gv_badge.png)).
- [x] **1.4. Redigir a Descrição do Canal (SEO)** ✅ 2026-11-05
  - Copiar e colar o texto base no campo "Sobre" do canal:
    > *"Desenvolvedor focado em SAP ABAP Cloud, arquitetura moderna e certificação técnica. Documento aqui meus estudos diários, resolução de cenários de certificação e práticas de Clean Core no S/4HANA. Conecte-se comigo no LinkedIn: [seu link]."*
  - Inserir link para seu LinkedIn profissional.
- [x] **1.5. Ativar Recursos Intermediários (CRÍTICO)** ✅ 2026-11-05
  - No YouTube Studio, acessar **Configurações > Canal > Qualificação para recursos**.
  - Validar o número de telefone por SMS para ativar os **Recursos Intermediários**.
  - *Por que é obrigatório:* Sem essa validação, o YouTube bloqueia o upload de miniaturas personalizadas (*thumbnails*) e limita vídeos a menos de 15 minutos.

---

## Fase 2: Setup do Ambiente de Gravação (OBS Studio)

- [x] **2.1. Instalar o OBS Studio** ✅ 2026-11-06
  - Baixar a versão oficial gratuita do OBS Studio para Windows.
- [ ] **2.2. Configurar o Perfil de Shorts (Vertical: 1080x1920)**
  - Ir em **Configurações > Vídeo**:
    - Resolução de Base (Tela): `1080x1920` (proporção 9:16).
    - Resolução de Saída: `1080x1920`.
    - Taxa de Quadros (FPS): 60 fps.
  - Em **Fontes**, adicionar uma **Captura de Janela** apontando para a janela do Obsidian.
- [ ] **2.3. Configurar o Perfil Horizontal (Vídeos Longos: 1920x1080)**
  - Criar um segundo perfil de vídeo com resolução padrão `1920x1080` para gravação de sessões completas de estudo (*Estude Comigo*).
- [ ] **2.4. Configurar Teclas de Atalho de Gravação**
  - Em **Configurações > Teclas de Atalho**, definir:
    - *Iniciar Gravação:* Tecla de atalho (ex: `F9`).
    - *Parar Gravação:* Mesma tecla (`F9`).
  - *Objetivo:* Você não precisa alternar janelas nem mostrar o OBS na gravação; basta pressionar a tecla para começar a gravar a tela do Obsidian.

---

## Fase 3: Padronização Visual do Obsidian para Gravação

- [ ] **3.1. Ajuste de Tela do Obsidian**
  - Ocultar barras laterais esquerda e direita (`Ctrl + B`).
  - Ativar o modo de leitura ou foco para eliminar barras de ferramentas desnecessárias.
  - Aumentar o zoom do texto (`Ctrl + +`) em 1 ou 2 níveis para garantir que o enunciado e o código fiquem perfeitamente legíveis na tela pequena do celular.
- [ ] **3.2. Deixar as Notas-Mestras Prontas**
  - Localizar a nota [[Template_Estudo_Diario_SAP]] para extração das questões diárias.
  - Testar a renderização do bloco dinâmico em DataviewJS para garantir que o painel de acertos/erros atualize sem falhas.

---

## Fase 4: Setup do Editor de Vídeo

- [ ] **4.1. Instalação e Criação de Projeto Modelo**
  - Instalar o CapCut Desktop (gratuito).
  - Criar um projeto na proporção vertical `9:16`.
- [ ] **4.2. Salvar Músicas de Fundo Livres de Direitos**
  - Baixar 2 ou 3 faixas instrumentais suaves (*Lo-fi* ou música eletrônica ambiente) da Biblioteca de Áudio do YouTube ou do próprio CapCut.
  - Deixar o volume da trilha configurado entre `-20 dB` e `-25 dB` para não atrapalhar a leitura ou a narração.
- [ ] **4.3. Predefinição de Legendas Dinâmicas**
  - Configurar estilo padrão de texto: fonte sem serifa limpa (ex: Montserrat, Inter ou Roboto), cor branca com contorno preto espesso (`Stroke` preto). Esse contraste garante leitura instantânea sobre fundos escuros ou claros.

---

## Fase 5: O "Piloto de Teste" 

- [ ] **5.1. Gravar um Teste de 30 Segundos**
  - Abrir o Obsidian em uma questão de simulado.
  - Pressionar `F9`, rolar suavemente a tela mostrando o enunciado e o gabarito analítico, e pressionar `F9` para encerrar.
- [ ] **5.2. Checagem de Qualidade no Celular**
  - Importar o vídeo teste no CapCut, exportar e enviar para o celular via WhatsApp ou nuvem.
  - Assistir na vertical:
    - O texto das alternativas está legível sem precisar forçar a vista?
    - A rolagem do mouse foi suave, sem movimentos bruscos?
    - O contraste das cores está bom?

---

## Fase 6: Publicação do Vídeo Oficial #01

- [ ] **6.1. Selecionar a Questão do Dia**
  - Ao fazer a revisão diária no [[Template_Estudo_Diario_SAP]], escolher a questão mais interessante ou capciosa que você resolveu hoje.
- [ ] **6.2. Gravar os 40 Segundos da Questão**
  - 10s para o enunciado da questão.
  - 15s para leitura das 4 alternativas com contagem de 3 segundos na tela.
  - 15s rolando para o gabarito analítico mostrando a regra de ouro de *Clean Core*.
- [ ] **6.3. Renderizar no CapCut**
  - Adicionar música ambiente suave e texto de gancho no topo da tela: *"Você acertaria essa questão de Certificação SAP ABAP Cloud?"*.
- [ ] **6.4. Publicar no YouTube Studio**
  - **Título sugerido:** `Questão de Certificação SAP ABAP Cloud #01 | Você acertaria? #shorts #sap`
  - **Descrição:** Breve explicação com link para o seu LinkedIn profissional.
  - **Tags:** `sap`, `abap cloud`, `certificação sap`, `clean core`, `s4hana`, `simulado sap`.

---

## Fase 7: Checklist da Rotina Contínua (5 Minutos Diários)

Após o canal estar configurado e o primeiro vídeo no ar, este é o ciclo diário que você repete após sua sessão de estudos:

- [ ] Terminar a resolução das 20 questões do simulado no Obsidian.
- [ ] Escolher 1 questão que achou marcante.
- [ ] Ligar o OBS (`F9`), gravar 40 segundos da tela e desligar (`F9`).
- [ ] Jogar o clipe no modelo salvo do CapCut, exportar e subir no YouTube Shorts.
- [ ] Marcar a tarefa diária como concluída e voltar ao trabalho principal sem sobrecarga mental.
