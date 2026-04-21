Aqui está o plano melhorado e reestruturado, focado em segurança da refatoração e polimento de UI/UX:

Plano de Implementação Aprimorado: Refatoração, Tema "Premium Tech" e Conclusão de Dados

1. Remoção do Áudio (Safe Deletion & Type Cleanup)

O plano de apagar os arquivos e remover imports está correto, mas requer limpeza na fundação.

Deletar arquivos: Apagar pasta src/features/audio e ListenType.tsx.

Limpeza de Tipos (src/data/types.ts ou similar):

Remover LISTEN_TYPE do Enum/Type literal de QuestionKind.

Garantir que a remoção dessa interface não deixe outros componentes acusando erro de tipagem no TypeScript.

Proteção de Estado (LocalStorage Migration):

Se um usuário pausou um quiz aleatório no meio e uma das próximas questões era do tipo Listen & Type, o app vai quebrar ao carregar a sessão.

Ação: Na inicialização do app (App.tsx ou store do Zustand), criar um verificador rápido. Se a sessão de quiz em andamento contiver LISTEN_TYPE, limpar a sessão ativa (forçar restart da sessão) para evitar crashes de UI. Limpar a chave inativa mv80-tts-rate.

2. Implementação do Design "Futurista Prata" (Dark/Glassmorphism)

O uso de variáveis HSL e remoção do Light Mode é perfeito. Vamos adicionar profundidade visual e animação para sustentar a promessa de um visual "Premium Tech".

CSS Global & Tailwind:

Mover as paletas HSL propostas estritamente para o seletor :root no index.css. Isso forçará o tema de forma nativa sem depender de detecção de classes (.dark).

Aplicar cor de fundo bg-background text-foreground diretamente no <body>.

Tipografia e FOUT (Flash of Unstyled Text):

Como importaremos Orbitron/Space Grotesk, adicione font-display: swap no Google Fonts para evitar que a tela pisque enquanto a fonte pesada futurista carrega.

Efeitos Premium (Glassmorphism & Neon):

Adicionar no tailwind.config.ts um padrão de box-shadow customizado, ex: box-shadow: neon: '0 0 24px hsl(var(--primary) / 0.25)'.

Para os cards de exercícios não parecerem blocos achatados, usar: bg-card/70 backdrop-blur-md border border-border/60.

Acessibilidade (Contraste): Textos secundários em --muted-foreground contra o fundo muito escuro devem respeitar contraste de 4.5:1. As cores de Acerto/Erro (Verde/Vermelho) precisam de leve brilho/luminosidade para ficarem nítidas no dark mode.

Microinterações: Adicionar uma classe de transição global nos botões (transition-all duration-300 ease-in-out hover:shadow-neon hover:-translate-y-1).

3. Scraping dos Textos #068 ao #080 (Tooling Interno)

Em vez de rodar o script em /tmp, traga o script para o ciclo de vida do repositório para manutenção futura.

Script de Automação: Criar scripts/fetch-missing.mjs (modulo nativo Node) na raiz do projeto.

Parse e Limpeza Resiliente:

Os sites de blogs costumam variar levemente as tags ao longo dos anos (Mairo Vergara pode ter usado <p><strong> no texto 30 e <p><b> no texto 75).

Usar o cheerio no Node. Implementar regras de fallback no regex/parser para capturar a tradução caso o HTML da linha a linha varie.

Validação (Safety Check): Antes do script anexar no texts.ts, ele deve fazer um "Sanity Check": O texto 70 tem conteúdo no campo english? Os pares geraram arrays maiores que 0? Se sim, faz o append via fs.writeFileSync.

4. O Footer "Inteligente" Contextual

O Footer tem links muito úteis, mas ele NÃO pode atrapalhar a experiência imersiva ("Foco") de aprendizado.

Layout: Renderizar dentro de um <LayoutBase>.

Condicional de Visibilidade (Crucial): O Footer não deve aparecer nas rotas de quiz (ex: /quiz/:id, /quiz-aleatorio). Mostrar o footer em telas de exercício gera rolagem indesejada, atrapalha botões "Próximo" fixados no rodapé mobile e polui a interface de estudo.

Ação: Usar o hook useLocation do React Router. Se location.pathname.includes('/quiz'), retorne null no componente Footer.

Design do Footer: Adicionar a borda luminosa sutil border-t border-border shadow-[0_-5px_15px_rgba(0,0,0,0.3)] para separá-lo visualmente das listas de textos.

5. Ajustes Finais e Balanceamento de Gamificação

A exclusão do "Listen & Type" causa impacto silencioso no jogo.

Rebalanceamento do Quiz: Cada texto gerava ~10-15 questões usando 5 tipos. Agora temos 4 tipos. Em quizGenerator.ts, garanta que a distribuição aleatória continue gerando, no mínimo, 10 questões, redistribuindo o peso entre Múltipla Escolha e Completar Lacuna.

Avisos (Tooltips/Onboarding): Aos usuários antigos que abrirem a nova versão, exibir um toast ou pequeno modal na Home: "Bem-vindo à Nova Versão! Focamos agora exclusivamente em leitura, vocabulário e tradução escrita, com um novo visual." (Garante que eles não achem que a função de áudio quebrou e, sim, que foi uma decisão de design).

Ajuste do Header TextDetail: Removido os botões de áudio, certifique-se de centralizar os botões restantes ("Linha a linha" e "Começar Quiz") para evitar que o layout fique "quebrado" ou vazio no lado onde ficavam os ícones de áudio.