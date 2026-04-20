### 1. Stack Tecnológica Recomendada

Como o app não terá um backend em tempo de execução (dados em build-time e estado no LocalStorage), ele é o candidato perfeito para um **SPA (Single Page Application)** estático.

*   **Framework Core:** React + Vite (rápido, leve e ecossistema maduro).

*   **Linguagem:** TypeScript (essencial para tipar as estruturas complexas dos textos, frases e estatísticas).

*   **Gerenciamento de Estado:** Zustand (mais leve e simples que Redux, excelente integração com LocalStorage).

*   **Roteamento:** React Router DOM.

*   **Estilização:** Tailwind CSS (perfeito para o design limpo, mobile-first e componentes arredondados).

*   **PWA (Progressive Web App):** Usar o plugin do Vite para PWA (permite "instalar" no celular e usar offline).

---

### 2. Arquitetura e Modulação (Estrutura de Pastas)

Vamos adotar uma arquitetura modular. Em vez de agrupar por "tipo de arquivo" (todos os hooks juntos, todos os componentes juntos), vamos agrupar por **Feature (Funcionalidade)**. Isso torna o código mais previsível.

```text

/ 80-textos-app

├── /scripts                # 1. Scripts de Build-time (Executados via Node)

│   ├── scraper.js          # Extrai os textos do site

│   └── generate-data.js    # Formata e cospe o JSON/TS na pasta /src/data

│

├── /src

│   ├── /assets             # Ícones, imagens estáticas, sons de acerto/erro

│   │

│   ├── /components         # 2. UI Compartilhada (Dumb Components)

│   │   ├── /ui             # Botões, Cards, Inputs, Modais, Badges

│   │   └── /layout         # Header, Footer, BottomNavigation (mobile)

│   │

│   ├── /config             # 3. Configurações Globais

│   │   └── constants.ts    # Limiares de acerto (70%), XP por questão, etc.

│   │

│   ├── /data               # 4. Dados Estáticos (Gerados pelo script)

│   │   ├── texts.ts        # O array com os 80 objetos

│   │   └── types.ts        # Interfaces (Text, SentencePair, etc.)

│   │

│   ├── /features           # 5. O Coração do App (Lógica de Negócios separada)

│   │   │

│   │   ├── /audio          # Gerenciamento do Web Speech API (TTS)

│   │   │   ├── useTTS.ts   # Hook para tocar, pausar, alterar velocidade

│   │   │   └── TTSToggle.tsx

│   │   │

│   │   ├── /progress       # Lógica de Gamificação e LocalStorage

│   │   │   ├── progressStore.ts # Zustand store sincronizada com LocalStorage

│   │   │   └── progressUtils.ts # Cálculo de XP, verificação de ofensiva (streak)

│   │   │

│   │   ├── /quiz           # Lógica do Quiz e Tipos de Questões

│   │   │   ├── /components # Componentes específicos (MultipleChoice, GapFill...)

│   │   │   ├── /engine     # Lógica pura: gera as questões a partir do texto

│   │   │   └── useQuizSession.ts # Estado efêmero da sessão (vidas, questão atual)

│   │   │

│   │   └── /study          # Visualização e estudo do texto antes do quiz

│   │       ├── TextReader.tsx

│   │       └── LineByLine.tsx

│   │

│   ├── /pages              # 6. Telas/Rotas (Unem as features)

│   │   ├── Home.tsx        # (/)

│   │   ├── Library.tsx     # (/biblioteca)

│   │   ├── Trail.tsx       # (/trilha)

│   │   ├── TextDetail.tsx  # (/texto/:id)

│   │   ├── QuizSession.tsx # (/quiz/:id e /quiz-aleatorio)

│   │   └── Dashboard.tsx   # (/progresso)

│   │

│   ├── /utils              # 7. Funções Utilitárias Globais

│   │   ├── stringUtils.ts  # Normalização de strings (remover acentos, pontuação)

│   │   └── fuzzyMatch.ts   # Algoritmo de Levenshtein para checar tradução escrita

│   │

│   ├── App.tsx             # Setup de Rotas e Providers

│   └── main.tsx            # Ponto de entrada do React

```

---

### 3. Detalhamento de Módulos Críticos

#### A. O Gerador de Questões `src/features/quiz/engine/quizGenerator.ts`)

Esta é a parte mais inteligente do app. Em vez de salvar as questões prontas no JSON, o app deve gerá-las **sob demanda** sempre que uma sessão iniciar. Isso garante que o quiz seja sempre um pouco diferente.

*   **Entrada:** Objeto `Text` (contendo os pares de frases EN/PT).

*   **Processo:**

    1. Filtra frases muito curtas ou muito longas.

    2. Sorteia aleatoriamente ~10 pares.

    3. Para cada par, atribui aleatoriamente um dos 5 tipos de questão (Enum: `MULTIPLE_CHOICE`, `GAP_FILL`, etc.).

    4. *Para Múltipla Escolha:* Pega a tradução correta e sorteia 3 traduções falsas de outras frases do *mesmo texto* (para manter o contexto).

    5. *Para Completar Lacuna:* Encontra a palavra mais longa/relevante da frase e a substitui por `___`.

*   **Saída:** Array de objetos `Question`.

#### B. O Motor de Similaridade `src/utils/fuzzyMatch.ts`)

Para o exercício **"Traduzir por escrito"**, o usuário vai errar vírgulas, apóstrofos e letras maiúsculas.

Você precisa de uma função que:

1. Converta as duas strings (resposta do usuário e resposta esperada) para minúsculas.

2. Remova pontuação `,`, `.`, `?`, `!`, `'`).

3. Use o algoritmo de **Distância de Levenshtein** para aceitar a resposta se a precisão for `>= 85%`.

*(Exemplo: Se a resposta é "I like apples" e o usuário digita "i liek apples", o app considera como acerto com um aviso de "quase lá").*

#### C. Gerenciamento de Estado de Progresso `src/features/progress/progressStore.ts`)

Use o middleware `persist` do Zustand. O formato do estado global salvo no navegador deve ser algo como:

```typescript

interface ProgressState {

  global: {

    xp: number;

    streak: number;

    lastActiveDate: string; // Para calcular o streak

    totalAnswered: number;

    totalCorrect: number;

  };

  texts: Record<string, {

    status: 'LOCKED' | 'UNLOCKED' | 'COMPLETED';

    stars: 0 | 1 | 2 | 3;

    highScore: number;

    attempts: number;

    mistakes: Record<string, number>; // ID da frase -> contagem de erros (para revisão)

  }>;

}

```

---

### 4. Fluxo de Execução (O Ciclo de Vida do App)

1. **Build-Time (Ocorreu no PC do Dev/Servidor CI):** O `scraper.js` varreu o site, gerou o `texts.ts`. O Vite compila tudo em HTML/JS estático.

2. **First Load:** O usuário abre o app. O Zustand lê o `localStorage`. Se for a primeira vez, o Texto 1 está `UNLOCKED` e o resto `LOCKED`.

3. **Página de Estudo:** Usuário entra no Texto 1. Lê, ouve via TTS gerenciado pelo `useTTS.ts`.

4. **Sessão de Quiz:**

   * Usuário clica em "Começar".

   * O `quizGenerator.ts` gera as 10 questões em milissegundos.

   * O estado local do componente `QuizSession.tsx` assume o controle (controla o índice da questão atual, animações de entrada/saída do framer-motion ou css transitions).

   * A cada resposta, toca um som (Acerto/Erro) e mostra o Bottom Sheet com feedback.

5. **Fim do Quiz:**

   * Uma função consolida os resultados.

   * O `progressStore.ts` é atualizado (Soma XP, atualiza estrelas, desbloqueia o Texto 2 se pontuação > 70%).

   * Salva no LocalStorage automaticamente.

---

### 5. Melhorias de Arquitetura e UX Sugeridas

*   **PWA (Progressive Web App):** Como o app não faz requisições externas para funcionar, transformar em PWA é obrigatório. O usuário pode adicionar à tela inicial do celular como um app nativo, e ele funcionará 100% offline (incluindo o TTS de muitos dispositivos modernos).

*   **Tratamento de Erros de Áudio:** O TTS do navegador `window.speechSynthesis`) é notoriamente instável em alguns navegadores mobile (especialmente iOS Safari se o usuário estiver em modo silencioso). Adicione um aviso visual na UI (um ícone de sino cortado) informando ao usuário para aumentar o volume ou que a voz não pôde ser carregada.

*   **"Graceful Degradation" no Áudio:** Se a voz `en-US` não carregar de jeito nenhum, o app deve remover automaticamente as questões do tipo "Listen & type" da sessão gerada, para não travar o progresso do usuário.

*   **Acessibilidade (a11y):** Garanta que os botões do quiz possam ser navegados por `Tab` e respondidos com `Enter` (você já sugeriu atalhos 1-4, o que é excelente).

Com essa arquitetura de arquivos e separação de responsabilidades, você pode começar construindo o app inteiro apenas com Múltipla Escolha e o Texto 1. Depois, basta adicionar os novos tipos de questão no `quizGenerator` sem quebrar o fluxo do aplicativo.