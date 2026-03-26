# HEYPEOPLE - Documentazione Tecnica Completa

**Versione**: 2.0  
**Data**: Marzo 2026  
**Stato**: MVP in evoluzione  
**Stack target**: React + Supabase + Vercel  
**Stack attuale repo live**: HTML/CSS/JS + Supabase + Vercel

> Nota importante: in questo momento la versione pubblicata che stai testando su iPhone parte da `files/index.html` (non da una build React).  
> Il file `HEYPEOPLE-Prototipo-v3-FINAL.jsx` resta un prototipo utile come riferimento per evolvere il prodotto.

---

## 📋 INDICE

1. [Vision & Manifesto](#vision--manifesto)
2. [Architettura Generale](#architettura-generale)
3. [Stack Tecnologico](#stack-tecnologico)
4. [Database Schema (Supabase)](#database-schema-supabase)
5. [Componenti React](#componenti-react)
6. [Logica del Gioco (Minimax)](#logica-del-gioco-minimax)
7. [Sistema Autenticazione](#sistema-autenticazione)
8. [Sistema Vite/Streak/Challenge](#sistema-vitestreakchallenge)
9. [Ranking System (THEWALL)](#ranking-system-thewall)
10. [Monetizzazione](#monetizzazione)
11. [Deploy su Vercel](#deploy-su-vercel)
12. [Roadmap](#roadmap)
13. [Stato Reale e Allineamento](#stato-reale-e-allineamento)
14. [Procedura Aggiornamento Produzione](#procedura-aggiornamento-produzione)

---

## 🎯 Vision & Manifesto

### Missione
HEYPEOPLE è una piattaforma anti-AI dove gli umani sfidano un'intelligenza artificiale ogni giorno. L'obiettivo è provare che gli umani sono ancora essenziali, creativi e superiori alla macchina.

### Tagline
> "L'AI è stata creata dall'uomo. Non l'AI che sta creando l'uomo. Siamo ancora noi."

### Core Values
- **Niente AI generata**: Ogni contenuto viene da persone reali
- **Niente algoritmo invisibile**: Trasparenza totale
- **Niente foto obbligatorie**: Privacy rispettata
- **Solo umani**: Registrazione verificata via email

---

## 🏗️ Architettura Generale

```
┌─────────────────────────────────────────────────────────┐
│                    HEYPEOPLE APP                        │
│                  (React + DM Sans)                      │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │ Login    │  │ Game     │  │ Ranking  │             │
│  │ (Magic   │  │ (Forza 4 │  │ (THE     │             │
│  │  Link)   │  │  + AI)   │  │ WALL)    │             │
│  └──────────┘  └──────────┘  └──────────┘             │
│                                                          │
├─────────────────────────────────────────────────────────┤
│           SUPABASE (Backend + Database)                 │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────┐  ┌──────────────┐                    │
│  │  Auth        │  │  Database    │                    │
│  │ (Magic Link) │  │ (Users,      │                    │
│  │              │  │  Games,      │                    │
│  │              │  │  Rankings)   │                    │
│  └──────────────┘  └──────────────┘                    │
│                                                          │
├─────────────────────────────────────────────────────────┤
│           VERCEL (Hosting + CI/CD)                      │
└─────────────────────────────────────────────────────────┘
```

---

## 🔄 Stato Reale e Allineamento

### Cosa è già reale e funzionante
- Login con email (magic link Supabase)
- Onboarding base con nome/cognome/email
- Accesso da iPhone su URL Vercel
- Banner cookie custom in UI con link policy

### Cosa è ancora prototipo
- Parte feed con alcuni contenuti placeholder
- Timer domanda del giorno (ora collegabile a tabella `daily_questions`)
- Formati risposta foto/disegno/musica non ancora persistiti completamente

### File chiave in uso oggi
- `files/index.html` (app principale live)
- `files/supabase.js` (client auth/database)
- `files/manifest.json` (PWA)
- `files/supabase_profiles.sql` (profili)
- `files/supabase_feed.sql` (domanda + risposte testo)

---

## 🚀 Procedura Aggiornamento Produzione

Quando modifichi l'app e vuoi vedere i cambi su Vercel:

1. Aggiorna i file locali (soprattutto in `files/`)
2. Carica i file aggiornati sul repository GitHub collegato
3. Vercel fa deploy automatico dal branch principale
4. Apri URL Vercel da iPhone e fai hard refresh
5. Verifica login + domanda del giorno + risposta

### Nota deployment
- Modificare i file in Cursor **non aggiorna automaticamente** Vercel.
- Serve sempre passare da GitHub (o upload/deploy manuale su Vercel).

---

## 🛠️ Stack Tecnologico

### Frontend
- **React** 18+
- **Styling**: Inline CSS (DM Sans + Colori custom)
- **State Management**: React hooks (useState)
- **Deployment**: Vercel

### Backend
- **Supabase** (PostgreSQL + Auth + Real-time)
  - Autenticazione Magic Link
  - Database relazionale
  - Policies (RLS - Row Level Security)

### AI/Gioco
- **Minimax Algorithm** (JavaScript puro)
- **Alpha-Beta Pruning** (ottimizzazione)
- **Seed-based Randomness** (per variety)

### DevOps
- **GitHub**: Version control
- **Vercel**: Deploy automatico da main branch
- **Supabase CLI**: Schema management

---

## 💾 Database Schema (Supabase)

### Tabella: `users`
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  nickname VARCHAR(50) UNIQUE NOT NULL,
  avatar_color VARCHAR(7) DEFAULT '#DFFF00',
  created_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP,
  is_verified BOOLEAN DEFAULT FALSE,
  bio TEXT,
  
  UNIQUE(email),
  UNIQUE(nickname)
);

-- Index per ricerche veloci
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_nickname ON users(nickname);
```

### Tabella: `games`
```sql
CREATE TABLE games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  challenge_number INT NOT NULL,
  difficulty_level INT (1-5) NOT NULL,
  result VARCHAR(10) CHECK (result IN ('win', 'loss', 'draw')),
  ai_moves TEXT, -- JSON array di mosse IA
  user_moves TEXT, -- JSON array di mosse utente
  duration_seconds INT,
  created_at TIMESTAMP DEFAULT NOW(),
  
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_games_user_id ON games(user_id);
CREATE INDEX idx_games_created_at ON games(created_at);
```

### Tabella: `user_stats`
```sql
CREATE TABLE user_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  total_wins INT DEFAULT 0,
  total_losses INT DEFAULT 0,
  current_streak INT DEFAULT 0,
  max_streak INT DEFAULT 0,
  total_games INT DEFAULT 0,
  current_vite INT DEFAULT 3,
  current_challenge INT DEFAULT 1,
  highest_challenge INT DEFAULT 1,
  last_game_date DATE,
  total_points INT DEFAULT 0,
  updated_at TIMESTAMP DEFAULT NOW(),
  
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_user_stats_user_id ON user_stats(user_id);
```

### Tabella: `daily_questions`
```sql
CREATE TABLE daily_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_text TEXT NOT NULL,
  date_published DATE UNIQUE NOT NULL,
  difficulty_level INT (1-5) NOT NULL,
  created_by_user_id UUID REFERENCES users(id),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  
  FOREIGN KEY (created_by_user_id) REFERENCES users(id)
);

CREATE INDEX idx_daily_questions_date ON daily_questions(date_published);
```

### RLS Policies (Supabase)

```sql
-- Users: Tutti possono leggere, solo owner può modificare
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all profiles" ON users
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Games: Tutti possono leggere, solo owner può creare
ALTER TABLE games ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all games" ON games
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own games" ON games
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User Stats: Tutti possono leggere, sistema aggiorna
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all stats" ON user_stats
  FOR SELECT USING (true);

CREATE POLICY "System can update stats" ON user_stats
  FOR UPDATE USING (true); -- Controllare da backend
```

---

## ⚛️ Componenti React

### Struttura Directory
```
/src
├── components/
│   ├── SplashScreen.jsx
│   ├── LoginScreen.jsx
│   ├── HomeScreen.jsx
│   ├── GameScreen.jsx
│   ├── ResultScreen.jsx
│   ├── RankingScreen.jsx
│   └── InfoScreen.jsx
├── utils/
│   ├── minimax.js (Logica AI)
│   ├── auth.js (Magic Link)
│   └── api.js (Supabase calls)
├── icons/
│   ├── LockIcon.jsx
│   ├── FireIcon.jsx
│   ├── HeartIcon.jsx
│   └── [altri SVG minimal]
├── styles/
│   └── theme.js (Colori + Font)
└── App.jsx (Main)
```

### Component: SplashScreen

```javascript
export function SplashScreen({ onEnter }) {
  return (
    <div style={styles.splashContainer}>
      <div style={styles.logo}>●</div>
      <h1 style={styles.title}>
        <span style={styles.white}>HEY</span>
        <span style={styles.neon}>PEOPLE</span>
      </h1>
      <p style={styles.tagline}>
        Sfida l'intelligenza artificiale.<br/>
        Scopri se sei ancora umano.
      </p>
      <button onClick={onEnter} style={styles.ctaButton}>
        ENTRA IN HEYPEOPLE
      </button>
    </div>
  );
}
```

### Component: GameScreen (Core)

```javascript
export function GameScreen({ challenge, onWin, onLoss }) {
  const [board, setBoard] = useState(Array(42).fill(null));
  const [isAIThinking, setIsAIThinking] = useState(false);

  const handleUserMove = (column) => {
    // Valida colonna
    if (board[column] !== null) return;

    // User move (giallo = 1)
    const newBoard = dropPiece(board, column, 1);
    setBoard(newBoard);

    // Controlla win
    if (checkWin(newBoard, 1)) {
      onWin();
      return;
    }

    // AI move (verde = 2)
    setIsAIThinking(true);
    setTimeout(() => {
      const aiColumn = getAIMove(newBoard, challenge);
      const aiBoard = dropPiece(newBoard, aiColumn, 2);
      setBoard(aiBoard);

      if (checkWin(aiBoard, 2)) {
        onLoss();
      }
      setIsAIThinking(false);
    }, 800);
  };

  return (
    <div style={styles.gameContainer}>
      <GameBoard board={board} onMove={handleUserMove} disabled={isAIThinking} />
      {isAIThinking && <p>HEYBOT sta pensando...</p>}
    </div>
  );
}
```

---

## 🧠 Logica del Gioco (Minimax)

### Minimax Algorithm + Alpha-Beta Pruning

```javascript
/**
 * Minimax con alpha-beta pruning
 * @param {Array} board - Stato del board (42 elementi)
 * @param {number} depth - Profondità ricerca
 * @param {boolean} isMaximizing - AI (true) o Utente (false)
 * @param {number} alpha - Pruning alpha
 * @param {number} beta - Pruning beta
 * @returns {number} Valutazione posizione
 */
function minimax(board, depth, isMaximizing, alpha = -Infinity, beta = Infinity) {
  const result = checkGameEnd(board);
  
  // Terminal nodes
  if (result === 'AI_WIN') return 1000 - depth;
  if (result === 'HUMAN_WIN') return -1000 + depth;
  if (result === 'DRAW') return 0;
  if (depth === 0) return evaluateBoard(board);

  const validMoves = getValidMoves(board);
  
  if (isMaximizing) { // AI (Verde = 2)
    let maxEval = -Infinity;
    for (const col of validMoves) {
      const newBoard = dropPiece(board, col, 2);
      const evaluation = minimax(newBoard, depth - 1, false, alpha, beta);
      maxEval = Math.max(maxEval, evaluation);
      alpha = Math.max(alpha, evaluation);
      if (beta <= alpha) break; // Prune
    }
    return maxEval;
  } else { // Utente (Giallo = 1)
    let minEval = Infinity;
    for (const col of validMoves) {
      const newBoard = dropPiece(board, col, 1);
      const evaluation = minimax(newBoard, depth - 1, true, alpha, beta);
      minEval = Math.min(minEval, evaluation);
      beta = Math.min(beta, evaluation);
      if (beta <= alpha) break; // Prune
    }
    return minEval;
  }
}

/**
 * Scegli mossa migliore per AI
 * @param {Array} board
 * @param {number} challenge - Livello 1-5 (determina profondità)
 * @returns {number} Colonna scelta
 */
function getAIMove(board, challenge) {
  const depths = { 1: 4, 2: 6, 3: 8, 4: 10, 5: 12 };
  const depth = depths[Math.min(challenge, 5)];
  
  const validMoves = getValidMoves(board);
  let bestMove = validMoves[0];
  let bestScore = -Infinity;

  for (const col of validMoves) {
    const newBoard = dropPiece(board, col, 2);
    const score = minimax(newBoard, depth - 1, false);
    if (score > bestScore) {
      bestScore = score;
      bestMove = col;
    }
  }

  // Randomness per variety (challenge basso = più random)
  const randomChance = Math.max(0.1, 0.5 - challenge * 0.08);
  if (Math.random() < randomChance && validMoves.length > 1) {
    return validMoves[Math.floor(Math.random() * validMoves.length)];
  }

  return bestMove;
}

/**
 * Evaluation function per posizioni non-terminali
 * Valuta: linee, potenziale, centrality
 */
function evaluateBoard(board) {
  let score = 0;

  // Valuta ogni posizione
  for (let i = 0; i < 42; i++) {
    if (board[i] === 2) score += 10; // AI piece
    if (board[i] === 1) score -= 10; // Utente piece
  }

  // Bonus per linee potenziali
  score += countThreats(board, 2) * 100;
  score -= countThreats(board, 1) * 100;

  // Bonus per centro (controllo medio)
  const centerCols = [2, 3, 4];
  for (let row = 0; row < 6; row++) {
    for (const col of centerCols) {
      if (board[row * 7 + col] === 2) score += 5;
      if (board[row * 7 + col] === 1) score -= 5;
    }
  }

  return score;
}

/**
 * Conta minacce (linee di 3)
 */
function countThreats(board, player) {
  let count = 0;
  // Controlla orizzontali, verticali, diagonali
  // ... (implementazione completa)
  return count;
}

/**
 * Controlla se gioco è finito
 * @returns {'AI_WIN' | 'HUMAN_WIN' | 'DRAW' | null}
 */
function checkGameEnd(board) {
  if (checkWin(board, 2)) return 'AI_WIN';
  if (checkWin(board, 1)) return 'HUMAN_WIN';
  if (getValidMoves(board).length === 0) return 'DRAW';
  return null;
}
```

### Funzioni Ausiliarie

```javascript
/**
 * Inserisci pezzo in colonna (gravity)
 */
function dropPiece(board, column, player) {
  const newBoard = [...board];
  for (let row = 5; row >= 0; row--) {
    const index = row * 7 + column;
    if (newBoard[index] === null) {
      newBoard[index] = player;
      return newBoard;
    }
  }
  return board; // Colonna piena
}

/**
 * Ottieni colonne valide (non piene)
 */
function getValidMoves(board) {
  const validMoves = [];
  for (let col = 0; col < 7; col++) {
    if (board[col] === null) validMoves.push(col);
  }
  return validMoves;
}

/**
 * Controlla se ci sono 4 in fila
 */
function checkWin(board, player) {
  // Orizzontali
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 4; col++) {
      const idx = row * 7 + col;
      if (
        board[idx] === player &&
        board[idx + 1] === player &&
        board[idx + 2] === player &&
        board[idx + 3] === player
      ) return true;
    }
  }

  // Verticali
  for (let col = 0; col < 7; col++) {
    for (let row = 0; row < 3; row++) {
      const idx = row * 7 + col;
      if (
        board[idx] === player &&
        board[idx + 7] === player &&
        board[idx + 14] === player &&
        board[idx + 21] === player
      ) return true;
    }
  }

  // Diagonali (↘)
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 4; col++) {
      const idx = row * 7 + col;
      if (
        board[idx] === player &&
        board[idx + 8] === player &&
        board[idx + 16] === player &&
        board[idx + 24] === player
      ) return true;
    }
  }

  // Diagonali (↙)
  for (let row = 0; row < 3; row++) {
    for (let col = 3; col < 7; col++) {
      const idx = row * 7 + col;
      if (
        board[idx] === player &&
        board[idx + 6] === player &&
        board[idx + 12] === player &&
        board[idx + 18] === player
      ) return true;
    }
  }

  return false;
}
```

---

## 🔐 Sistema Autenticazione

### Magic Link Flow

```
┌────────────┐
│   User     │
└─────┬──────┘
      │ 1. Inserisce email
      ▼
┌────────────────────────┐
│  Supabase Auth         │
│  (Magic Link)          │
│  - Genera token        │
│  - Invia email         │
└─────┬──────────────────┘
      │ 2. Email inviata
      ▼
┌────────────┐
│  User      │
│  (Inbox)   │
└─────┬──────┘
      │ 3. Clicca magic link
      ▼
┌────────────────────────┐
│  App redirect          │
│  + Token verificato    │
└─────┬──────────────────┘
      │ 4. Session salvata
      ▼
┌────────────────────────┐
│  Home Screen           │
│  (Loggato)             │
└────────────────────────┘
```

### Codice Auth

```javascript
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

/**
 * Invia magic link
 */
export async function sendMagicLink(email) {
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) throw new Error(error.message);
  return data;
}

/**
 * Verifica session e recupera user
 */
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

/**
 * Crea profilo utente dopo signup
 */
export async function createUserProfile(userId, nickname) {
  const { data, error } = await supabase
    .from('users')
    .insert({
      id: userId,
      nickname,
      email: (await getCurrentUser()).email,
      is_verified: true,
    })
    .select();

  if (error) throw new Error(error.message);
  
  // Crea stats entry
  await supabase
    .from('user_stats')
    .insert({ user_id: userId });

  return data[0];
}

/**
 * Logout
 */
export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}
```

---

## 📊 Sistema Vite/Streak/Challenge

### Logica Daily Reset

```javascript
/**
 * Controlla se vite devono resettarsi
 * (ogni giorno alle 00:00)
 */
export async function checkDailyReset(userId) {
  const stats = await getUserStats(userId);
  const lastGameDate = new Date(stats.last_game_date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (lastGameDate < today) {
    // Reset vite
    await supabase
      .from('user_stats')
      .update({
        current_vite: 3,
        last_game_date: today.toISOString(),
      })
      .eq('user_id', userId);

    return true; // Vite resettate
  }

  return false;
}

/**
 * Registra risultato game
 */
export async function saveGameResult(userId, result, challenge, difficulty) {
  const stats = await getUserStats(userId);

  let newStreak = stats.current_streak;
  let newVite = stats.current_vite;
  let newChallenge = stats.current_challenge;

  if (result === 'win') {
    newStreak += 1;
    newChallenge += 1;
  } else {
    newStreak = 0;
    newVite -= 1;
  }

  // Aggiorna stats
  const { error } = await supabase
    .from('user_stats')
    .update({
      current_streak: newStreak,
      current_vite: Math.max(newVite, 0),
      current_challenge: newChallenge,
      max_streak: Math.max(stats.max_streak, newStreak),
      total_wins: result === 'win' ? stats.total_wins + 1 : stats.total_wins,
      total_losses: result === 'loss' ? stats.total_losses + 1 : stats.total_losses,
      total_games: stats.total_games + 1,
      total_points: stats.total_points + calculatePoints(result, challenge),
      last_game_date: new Date().toISOString(),
    })
    .eq('user_id', userId);

  if (error) throw new Error(error.message);

  return {
    streak: newStreak,
    vite: newVite,
    challenge: newChallenge,
  };
}

/**
 * Bonus vite da streak
 */
export async function claimStreakBonus(userId, streak) {
  const bonus = {
    5: 2,
    10: 5,
    15: 10,
    20: 15,
  }[streak] || 0;

  if (bonus === 0) return;

  const stats = await getUserStats(userId);
  
  await supabase
    .from('user_stats')
    .update({
      current_vite: stats.current_vite + bonus,
      current_streak: 0, // Reset streak
    })
    .eq('user_id', userId);
}

/**
 * Calcola punti da risultato
 */
function calculatePoints(result, challenge) {
  if (result === 'loss') return 0;
  return challenge * 10; // Challenge #5 = 50 pts
}
```

---

## 🏆 Ranking System (THEWALL)

### Leaderboard Query

```javascript
/**
 * Ottieni top 100 players
 */
export async function getTopPlayers(limit = 100) {
  const { data, error } = await supabase
    .from('user_stats')
    .select(`
      user_id,
      total_points,
      total_wins,
      current_streak,
      users (nickname, email)
    `)
    .order('total_points', { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);

  return data.map((entry, idx) => ({
    rank: idx + 1,
    nickname: entry.users.nickname,
    points: entry.total_points,
    wins: entry.total_wins,
    streak: entry.current_streak,
  }));
}

/**
 * Ottieni rank di un utente
 */
export async function getUserRank(userId) {
  const { data, error } = await supabase
    .from('user_stats')
    .select('total_points')
    .eq('user_id', userId)
    .single();

  if (error) throw new Error(error.message);

  const userPoints = data.total_points;

  // Conta quanti hanno più punti
  const { data: topData, error: topError } = await supabase
    .from('user_stats')
    .select('id')
    .gt('total_points', userPoints);

  if (topError) throw new Error(topError.message);

  return topData.length + 1;
}
```

### Scoring System

```
Challenge #1 win   = 10 pts
Challenge #5 win   = 50 pts
Challenge #10 win  = 100 pts
Challenge #20 win  = 200 pts

Streak Bonus:
  Streak x5  = +50 pts (una tantum)
  Streak x10 = +200 pts
  Streak x15 = +500 pts
  Streak x20 = +1000 pts
```

---

## 💰 Monetizzazione

### Modelli Revenue

#### 1. **Premium Subscription** (Futuro)
- $4.99/mese
  - +3 vite giornaliere (totale 6)
  - Challenge infiniti (oltre lvl 20)
  - Statistiche avanzate
  
#### 2. **In-App Purchases** (Futuro)
- Emergency Vite Pack: 5 vite = $0.99
- Weekend Boost: +5 vite per 48h = $1.99

#### 3. **Brand Partnership** (Futuro)
- "Domanda del Giorno" sponsorizzata da brand
- Native ads (no pop-up)
- Revenue sharing con creatore domanda

#### 4. **Enterprise** (Futuro)
- Corporate challenges (team building)
- White-label API
- Custom tournaments

### MVP Strategy (No Revenue)
Focus su growth + engagement. Revenue dopo 10k MAU.

---

## 🚀 Deploy su Vercel

### Setup Iniziale

```bash
# 1. Clona repo
git clone https://github.com/tuouser/heypeople.git
cd heypeople

# 2. Installa dipendenze
npm install

# 3. Configura env
cp .env.example .env.local
# Riempi con:
# REACT_APP_SUPABASE_URL=...
# REACT_APP_SUPABASE_ANON_KEY=...
# REACT_APP_VERCEL_URL=...

# 4. Deploy a Vercel
npm i -g vercel
vercel login
vercel --prod
```

### Environment Variables

```
REACT_APP_SUPABASE_URL=https://xxxxx.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGc...
REACT_APP_API_BASE=https://heypeople.vercel.app
REACT_APP_MAGIC_LINK_REDIRECT=https://heypeople.vercel.app/auth/callback
```

### Vercel Config (vercel.json)

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "react",
  "env": [
    "REACT_APP_SUPABASE_URL",
    "REACT_APP_SUPABASE_ANON_KEY"
  ],
  "functions": {
    "api/**/*.js": {
      "maxDuration": 60
    }
  }
}
```

### CI/CD Pipeline

```
GitHub Push (main branch)
        ↓
Vercel Auto-Deploy
        ↓
Build & Test
        ↓
Preview URL (se branch)
        ↓
Prod Deploy (se main)
        ↓
Slack Notification ✓
```

---

## 📈 Roadmap

### Week 1-2: MVP Launch
- ✅ Autenticazione Magic Link
- ✅ Game Forza 4 + Minimax AI
- ✅ Vite/Streak/Challenge system
- ✅ Basic Ranking (THEWALL)
- ✅ Deploy su Vercel

### Week 3-4: Polish v1.1
- Animazioni smooth (win/loss)
- Share streak su social
- Daily notification
- Bug fixes e performance

### Week 5-6: Multiplayer Alpha
- Real-time PvP (Supabase Realtime)
- Matchmaking simple
- Anti-cheat básico

### Week 7-8: Social Features
- Seguire giocatori
- Commenti su partite
- Replay video

### Week 9-10: Premium
- Subscription launch
- In-app purchases
- Analytics dashboard

### Month 3+: Scale
- API public (partner)
- Mobile app native (React Native)
- Tournaments official
- Brand partnerships

---

## 📚 Documentazione Aggiuntiva

### Supabase Setup
1. Crea progetto su supabase.com
2. Esegui SQL schema (vedi Database Schema)
3. Configura Magic Link email template
4. Abilita RLS policies
5. Backup automatico (default)

### Testing
```bash
# Unit tests (Jest)
npm run test

# E2E tests (Cypress)
npm run test:e2e

# Performance
npm run lighthouse
```

### Monitoring
- Vercel Analytics: Performance + Errors
- Supabase Logs: Database + Auth
- Sentry (futuro): Error tracking

---

## 🎯 Success Metrics (KPIs)

### North Star Metric
**DAU (Daily Active Users)** con goal 10k in 3 mesi

### Retention
- Day 1 Retention: > 40%
- Day 7 Retention: > 20%
- Day 30 Retention: > 10%

### Engagement
- Avg games/giorno: > 2
- Avg session length: > 8 min
- THEWALL check frequency: > 30% DAU

### Acquisition
- Cost per install: < $1 (organic)
- Viral coefficient: > 1.2 (referral)

---

## ✅ Checklist Deploy

- [ ] Database Supabase configurato
- [ ] Auth Magic Link testato
- [ ] Minimax AI funzionante
- [ ] All screens testate (mobile)
- [ ] Env variables settate
- [ ] RLS policies abilitate
- [ ] GitHub repo privato
- [ ] Vercel account connesso
- [ ] Build passa senza errori
- [ ] Performance Lighthouse > 90
- [ ] Monitora errori (Sentry optional)
- [ ] Backup database schedulato

---

## 📞 Support & Contatti

**Email**: support@heypeople.it  
**GitHub Issues**: https://github.com/tuouser/heypeople/issues  
**Discord Community** (futuro): https://discord.gg/heypeople

---

**HEYPEOPLE v2.0 — Let's prove humans still matter.** 🚀
