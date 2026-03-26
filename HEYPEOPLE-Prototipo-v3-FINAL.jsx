import React, { useState, useEffect } from 'react';

export default function HeyPeopleApp() {
  const [screen, setScreen] = useState('splash');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [streak, setStreak] = useState(0);
  const [vite, setVite] = useState(3);
  const [challenge, setChallenge] = useState(1);
  const [gameMode, setGameMode] = useState('playing');
  const [timeLeft, setTimeLeft] = useState(null);
  const [currentDate, setCurrentDate] = useState('');

  const fullName = `${firstName} ${lastName}`.trim();

  // Colori
  const NERO = '#070707';
  const NEON = '#DFFF00';
  const VERDE = '#4A5D3A';
  const GRIGIO = '#1a1a1a';

  // Frasi HEYBOT dinamiche
  const fraseHeybot = {
    win: [
      '"Questa volta hai vinto, ma la prossima challenge sarò diverso. Te lo garantisco." — HEYBOT',
      '"Interessante strategia. Non mi è piaciuta. Prepara un piano B." — HEYBOT',
      '"Ok, bravo. Ma ricordati: gli umani si stancano, io no." — HEYBOT',
      '"Non male per questa volta. Ma sappiamo entrambi chi vincerebbe se giocassimo 100 volte." — HEYBOT',
    ],
    winStreak: [
      '"Lo streak ti sta aiutando. Goditi il momento." — HEYBOT',
      '"Sei in formato oggi. Mi interessa vedere fino a che punto arrivi." — HEYBOT',
      '"Il tuo momentum è impressionante. Peccato che finisca sempre." — HEYBOT',
    ],
    loss: [
      '"Te l\'avevo detto. Torna domani, magari avrai più chance." — HEYBOT',
      '"Non è stata una competizione. È stato un tutorial." — HEYBOT',
      '"Riposa oggi. Domani sarò ancora più veloce." — HEYBOT',
    ],
    lossZeroVite: [
      '"Te l\'avevo avvertito. Adesso riposa e torna domani. Se osi." — HEYBOT',
      '"Troppo facile. Torna quando avrai imparato a giocare." — HEYBOT',
      '"Zero vite. Zero chance. Torna domani se hai coraggio." — HEYBOT',
    ]
  };

  // Get random frase
  const getRandomFrase = (type) => {
    const frases = fraseHeybot[type];
    return frases[Math.floor(Math.random() * frases.length)];
  };

  // Update current date
  useEffect(() => {
    const today = new Date();
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const formattedDate = today.toLocaleDateString('it-IT', options);
    setCurrentDate(formattedDate);
  }, []);

  // Countdown timer (quando vite = 0)
  useEffect(() => {
    if (vite === 0 && screen === 'gameResult' && gameMode === 'loss') {
      const interval = setInterval(() => {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        
        const diff = tomorrow - now;
        const hours = Math.floor(diff / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [vite, screen, gameMode]);

  // Custom Icons SVG (CENTERED)
  const LockIcon = () => (
    <div style={{display: 'flex', justifyContent: 'center', marginBottom: '16px'}}>
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="32" r="28" stroke={NEON} strokeWidth="2"/>
        <rect x="22" y="28" width="20" height="18" rx="2" stroke={NEON} strokeWidth="2" fill="none"/>
        <path d="M26 28V22C26 18.68 28.68 16 32 16C35.32 16 38 18.68 38 22V28" stroke={NEON} strokeWidth="2"/>
        <circle cx="32" cy="38" r="2" fill={NEON}/>
      </svg>
    </div>
  );

  const CheckIcon = () => (
    <div style={{display: 'flex', justifyContent: 'center', marginBottom: '16px'}}>
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="32" r="28" stroke={NEON} strokeWidth="2"/>
        <path d="M20 32L28 40L44 24" stroke={NEON} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );

  const BreakIcon = () => (
    <div style={{display: 'flex', justifyContent: 'center', marginBottom: '16px'}}>
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="32" r="28" stroke={NEON} strokeWidth="2"/>
        <path d="M20 20L44 44" stroke={NEON} strokeWidth="3" strokeLinecap="round"/>
        <path d="M44 20L20 44" stroke={NEON} strokeWidth="3" strokeLinecap="round"/>
      </svg>
    </div>
  );

  const FireIcon = () => (
    <div style={{display: 'flex', justifyContent: 'center', marginBottom: '8px'}}>
      <svg width="40" height="40" viewBox="0 0 48 48" fill={NEON} xmlns="http://www.w3.org/2000/svg">
        <path d="M24 2C24 2 14 18 14 26C14 33.732 18.477 40 24 40C29.523 40 34 33.732 34 26C34 18 24 2 24 2Z"/>
        <path d="M20 26C20 30.418 21.791 34 24 34C26.209 34 28 30.418 28 26" fill={NERO}/>
      </svg>
    </div>
  );

  const HeartIcon = () => (
    <div style={{display: 'flex', justifyContent: 'center', marginBottom: '8px'}}>
      <svg width="40" height="40" viewBox="0 0 48 48" fill={NEON} xmlns="http://www.w3.org/2000/svg">
        <path d="M24 41L4 25C2 23 0 19 0 15C0 8 5 3 11 3C14 3 17 4 19 6L24 11L29 6C31 4 34 3 37 3C43 3 48 8 48 15C48 19 46 23 44 25L24 41Z"/>
      </svg>
    </div>
  );

  const StarIcon = () => (
    <div style={{display: 'flex', justifyContent: 'center', marginBottom: '8px'}}>
      <svg width="40" height="40" viewBox="0 0 48 48" fill={NEON} xmlns="http://www.w3.org/2000/svg">
        <path d="M24 2L30.5 18H48L35.25 27L41.75 43L24 34L6.25 43L12.75 27L0 18H17.5L24 2Z"/>
      </svg>
    </div>
  );

  // SPLASH SCREEN
  if (screen === 'splash' && !isLoggedIn) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: NERO,
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        fontFamily: '"DM Sans", sans-serif',
      }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap');
          * { font-family: 'DM Sans', sans-serif; }
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          .animate-fade { animation: fadeIn 0.8s ease-out; }
        `}</style>

        <div className="animate-fade" style={{textAlign: 'center', maxWidth: '340px'}}>
          <div style={{fontSize: '72px', marginBottom: '24px', color: NEON, fontWeight: 'bold', letterSpacing: '2px'}}>●</div>
          
          <h1 style={{
            fontSize: '56px',
            fontWeight: 700,
            margin: '0 0 16px 0',
            letterSpacing: '1px',
          }}>
            <span style={{color: '#fff'}}>HEY</span>
            <span style={{color: NEON}}>PEOPLE</span>
          </h1>
          
          <div style={{width: '120px', height: '2px', backgroundColor: NEON, margin: '24px auto'}}></div>
          
          <p style={{fontSize: '13px', color: '#999', fontWeight: 500, margin: '20px 0', lineHeight: '1.6'}}>
            Sfida l'intelligenza artificiale.<br/>
            Scopri se sei ancora umano.
          </p>

          <button
            onClick={() => setScreen('login')}
            style={{
              marginTop: '48px',
              padding: '14px 32px',
              backgroundColor: NEON,
              color: NERO,
              border: 'none',
              fontSize: '13px',
              fontWeight: 700,
              letterSpacing: '1.5px',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'all 0.3s',
              width: '100%',
              maxWidth: '280px',
            }}
            onMouseEnter={(e) => e.target.style.opacity = '0.9'}
            onMouseLeave={(e) => e.target.style.opacity = '1'}
          >
            ENTRA IN HEYPEOPLE
          </button>

          <p style={{fontSize: '10px', color: '#666', marginTop: '32px', lineHeight: '1.5'}}>
            <button style={{background: 'none', border: 'none', color: NEON, cursor: 'pointer', fontSize: '10px', textDecoration: 'underline'}}>Condizioni d'uso</button> • <button style={{background: 'none', border: 'none', color: NEON, cursor: 'pointer', fontSize: '10px', textDecoration: 'underline'}}>Privacy</button>
          </p>
        </div>
      </div>
    );
  }

  // LOGIN SCREEN
  if (screen === 'login' && !isLoggedIn) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: NERO,
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        fontFamily: '"DM Sans", sans-serif',
      }}>
        <div style={{width: '100%', maxWidth: '340px'}}>
          <h2 style={{fontSize: '28px', fontWeight: 700, marginBottom: '32px', textAlign: 'center', letterSpacing: '0.5px'}}>
            ENTRA IN HEYPEOPLE
          </h2>

          <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
            <div>
              <label style={{display: 'block', fontSize: '11px', color: '#999', marginBottom: '6px', fontWeight: 600, letterSpacing: '0.5px'}}>
                NOME
              </label>
              <input
                type="text"
                placeholder="Nome"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: GRIGIO,
                  border: `1.5px solid ${NEON}`,
                  color: '#fff',
                  fontSize: '13px',
                  borderRadius: '4px',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label style={{display: 'block', fontSize: '11px', color: '#999', marginBottom: '6px', fontWeight: 600, letterSpacing: '0.5px'}}>
                COGNOME
              </label>
              <input
                type="text"
                placeholder="Cognome"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: GRIGIO,
                  border: `1.5px solid ${NEON}`,
                  color: '#fff',
                  fontSize: '13px',
                  borderRadius: '4px',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label style={{display: 'block', fontSize: '11px', color: '#999', marginBottom: '6px', fontWeight: 600, letterSpacing: '0.5px'}}>
                EMAIL
              </label>
              <input
                type="email"
                placeholder="tua@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: GRIGIO,
                  border: `1.5px solid ${NEON}`,
                  color: '#fff',
                  fontSize: '13px',
                  borderRadius: '4px',
                  boxSizing: 'border-box',
                }}
              />
              <p style={{fontSize: '10px', color: '#666', margin: '4px 0 0 0'}}>Non usiamo email temporanee. Tu sei una persona reale</p>
            </div>

            <button
              onClick={() => {
                if (!firstName.trim() || !lastName.trim() || !email.trim()) {
                  alert('Inserisci nome, cognome ed email.');
                  return;
                }
                setIsLoggedIn(true);
                setScreen('home');
              }}
              style={{
                padding: '12px',
                backgroundColor: NEON,
                color: NERO,
                border: 'none',
                fontSize: '13px',
                fontWeight: 700,
                borderRadius: '4px',
                cursor: 'pointer',
                letterSpacing: '1px',
                marginTop: '12px',
              }}
            >
              CONTINUA
            </button>

            <p style={{fontSize: '10px', color: '#666', textAlign: 'center', margin: '16px 0'}}>
              Riceverai un magic link via email per completare l'accesso.
            </p>
          </div>

          <div style={{
            marginTop: '32px',
            paddingTop: '20px',
            borderTop: `1px solid ${GRIGIO}`,
            textAlign: 'center',
            fontSize: '10px',
            color: '#666'
          }}>
            <button style={{background: 'none', border: 'none', color: NEON, cursor: 'pointer', fontSize: '10px', marginRight: '12px'}}>Condizioni</button>
            <button style={{background: 'none', border: 'none', color: NEON, cursor: 'pointer', fontSize: '10px'}}>Informativa</button>
          </div>
        </div>
      </div>
    );
  }

  // HOME SCREEN
  if (screen === 'home' && isLoggedIn) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: NERO,
        color: '#fff',
        padding: '20px',
        paddingBottom: '100px',
        fontFamily: '"DM Sans", sans-serif',
      }}>
        <div style={{marginBottom: '32px', marginTop: '20px'}}>
          <h2 style={{fontSize: '36px', fontWeight: 700, margin: '0 0 8px 0', letterSpacing: '0.5px'}}>
            HEY! <span style={{color: NEON}}>{fullName || 'HUMAN'}</span>
          </h2>
          <p style={{fontSize: '11px', color: '#666', margin: 0, letterSpacing: '0.5px'}}>SFIDA HEYBOT • SCALA I LIVELLI • DOMINA THEWALL</p>
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '12px',
          marginBottom: '28px'
        }}>
          <div style={{
            padding: '16px',
            backgroundColor: GRIGIO,
            border: `1.5px solid ${NEON}`,
            textAlign: 'center',
            borderRadius: '6px',
          }}>
            <FireIcon />
            <p style={{fontSize: '20px', fontWeight: 700, margin: 0, color: NEON}}>{streak}</p>
            <p style={{fontSize: '10px', color: '#666', margin: '4px 0 0 0', fontWeight: 500}}>STREAK</p>
          </div>
          <div style={{
            padding: '16px',
            backgroundColor: GRIGIO,
            border: `1.5px solid ${NEON}`,
            textAlign: 'center',
            borderRadius: '6px',
          }}>
            <HeartIcon />
            <p style={{fontSize: '20px', fontWeight: 700, margin: 0, color: NEON}}>{vite}</p>
            <p style={{fontSize: '10px', color: '#666', margin: '4px 0 0 0', fontWeight: 500}}>VITE</p>
          </div>
          <div style={{
            padding: '16px',
            backgroundColor: GRIGIO,
            border: `1.5px solid ${NEON}`,
            textAlign: 'center',
            borderRadius: '6px',
          }}>
            <StarIcon />
            <p style={{fontSize: '20px', fontWeight: 700, margin: 0, color: NEON}}>#{challenge}</p>
            <p style={{fontSize: '10px', color: '#666', margin: '4px 0 0 0', fontWeight: 500}}>CHALLENGE</p>
          </div>
        </div>

        {/* Play Button */}
        <button
          onClick={() => {
            setGameMode('playing');
            setScreen('game');
          }}
          style={{
            width: '100%',
            padding: '14px',
            backgroundColor: NEON,
            color: NERO,
            border: 'none',
            fontSize: '13px',
            fontWeight: 700,
            borderRadius: '4px',
            marginBottom: '16px',
            cursor: 'pointer',
            letterSpacing: '1px',
          }}
        >
          SFIDA HEYBOT
        </button>

        {/* Nav */}
        <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
          <button
            onClick={() => setScreen('ranking')}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: GRIGIO,
              border: `1.5px solid ${NEON}`,
              color: '#fff',
              fontSize: '12px',
              fontWeight: 700,
              borderRadius: '4px',
              cursor: 'pointer',
              letterSpacing: '0.5px'
            }}
          >
            THEWALL
          </button>
          <button
            onClick={() => setScreen('info')}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: GRIGIO,
              border: `1.5px solid ${VERDE}`,
              color: '#fff',
              fontSize: '12px',
              fontWeight: 700,
              borderRadius: '4px',
              cursor: 'pointer',
              letterSpacing: '0.5px'
            }}
          >
            INFO
          </button>
          <button
            onClick={() => {
              setIsLoggedIn(false);
              setScreen('splash');
            }}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: GRIGIO,
              border: '1.5px solid #333',
              color: '#666',
              fontSize: '12px',
              fontWeight: 700,
              borderRadius: '4px',
              cursor: 'pointer',
              letterSpacing: '0.5px'
            }}
          >
            ESCI
          </button>
        </div>
      </div>
    );
  }

  // GAME SCREEN
  if (screen === 'game' && isLoggedIn) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: NERO,
        color: '#fff',
        padding: '20px',
        paddingBottom: '80px',
        fontFamily: '"DM Sans", sans-serif',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <button
          onClick={() => setScreen('home')}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            color: NEON,
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
            marginBottom: '24px',
            letterSpacing: '1px',
            padding: 0
          }}
        >
          ← INDIETRO
        </button>

        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px'}}>
          <div>
            <p style={{fontSize: '11px', color: '#666', margin: 0, fontWeight: 600}}>CHALLENGE</p>
            <h3 style={{fontSize: '32px', fontWeight: 700, margin: '4px 0 0 0', color: NEON}}>#{challenge}</h3>
          </div>
          <div style={{textAlign: 'right'}}>
            <p style={{fontSize: '11px', color: '#666', margin: 0, fontWeight: 600}}>TIMER</p>
            <p style={{fontSize: '28px', fontWeight: 700, margin: '4px 0 0 0', color: NEON}}>00:30</p>
          </div>
        </div>

        {/* Board */}
        <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '28px'}}>
          <div style={{width: '100%', maxWidth: '300px'}}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: '6px',
              backgroundColor: GRIGIO,
              padding: '12px',
              borderRadius: '6px',
              border: `1.5px solid ${NEON}`
            }}>
              {Array(42).fill(null).map((_, idx) => (
                <div
                  key={idx}
                  style={{
                    aspectRatio: '1',
                    borderRadius: '50%',
                    border: `2px solid #333`,
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.borderColor = NEON}
                  onMouseLeave={(e) => e.target.style.borderColor = '#333'}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Pieces Info */}
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px'}}>
          <div style={{
            padding: '12px',
            backgroundColor: GRIGIO,
            border: `1.5px solid ${NEON}`,
            borderRadius: '4px',
            textAlign: 'center'
          }}>
            <p style={{fontSize: '10px', color: '#666', margin: 0, fontWeight: 600}}>TU</p>
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: NEON,
              margin: '6px auto',
            }}></div>
            <p style={{fontSize: '11px', fontWeight: 700, color: NEON, margin: 0}}>HUMAN</p>
          </div>
          <div style={{
            padding: '12px',
            backgroundColor: GRIGIO,
            border: `1.5px solid ${VERDE}`,
            borderRadius: '4px',
            textAlign: 'center'
          }}>
            <p style={{fontSize: '10px', color: '#666', margin: 0, fontWeight: 600}}>HEYBOT</p>
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: VERDE,
              margin: '6px auto',
            }}></div>
            <p style={{fontSize: '11px', fontWeight: 700, color: VERDE, margin: 0}}>AI</p>
          </div>
        </div>

        {/* Buttons - TEMP FOR MVP TESTING ONLY */}
        <div style={{display: 'flex', gap: '8px'}}>
          <button
            onClick={() => {
              setStreak(streak + 1);
              setGameMode('win');
              setScreen('gameResult');
            }}
            style={{
              flex: 1,
              padding: '12px',
              backgroundColor: NEON,
              color: NERO,
              border: 'none',
              fontWeight: 700,
              borderRadius: '4px',
              cursor: 'pointer',
              letterSpacing: '1px',
              fontSize: '12px'
            }}
            title="TEMP: Quando online, il gioco sarà automatico"
          >
            VINCI
          </button>
          <button
            onClick={() => {
              setGameMode('loss');
              setScreen('gameResult');
            }}
            style={{
              flex: 1,
              padding: '12px',
              backgroundColor: GRIGIO,
              color: '#fff',
              border: `1.5px solid ${VERDE}`,
              fontWeight: 700,
              borderRadius: '4px',
              cursor: 'pointer',
              letterSpacing: '1px',
              fontSize: '12px'
            }}
            title="TEMP: Quando online, il gioco sarà automatico"
          >
            PERDI
          </button>
        </div>
      </div>
    );
  }

  // GAME RESULT - WIN
  if (screen === 'gameResult' && gameMode === 'win' && isLoggedIn) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: NERO,
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        fontFamily: '"DM Sans", sans-serif'
      }}>
        <div style={{width: '100%', maxWidth: '340px'}}>
          <CheckIcon />
          <div style={{textAlign: 'center', marginBottom: '28px'}}>
            <h2 style={{fontSize: '32px', fontWeight: 700, margin: '0 0 8px 0', letterSpacing: '0.5px'}}>HAI VINTO!</h2>
            <p style={{fontSize: '13px', color: '#999', margin: 0}}>Challenge #{challenge} superata</p>
          </div>

          {streak > 0 && streak % 5 === 0 ? (
            <div style={{
              backgroundColor: '#' + NEON.slice(1) + '15',
              border: `1.5px solid ${NEON}`,
              borderRadius: '6px',
              padding: '16px',
              marginBottom: '16px',
              textAlign: 'center'
            }}>
              <p style={{fontSize: '12px', fontWeight: 700, color: NEON, margin: '0 0 12px 0', letterSpacing: '0.5px'}}>
                STREAK × {streak} 
              </p>
              <div style={{display: 'flex', gap: '8px'}}>
                <button
                  onClick={() => {
                    setChallenge(challenge + 1);
                    setScreen('home');
                  }}
                  style={{
                    flex: 1,
                    padding: '10px',
                    backgroundColor: NEON,
                    color: NERO,
                    border: 'none',
                    fontWeight: 700,
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '11px',
                    letterSpacing: '0.5px'
                  }}
                >
                  CONTINUA
                </button>
                <button
                  onClick={() => {
                    setVite(vite + (streak >= 20 ? 15 : streak >= 15 ? 10 : streak >= 10 ? 5 : 2));
                    setStreak(0);
                    setScreen('home');
                  }}
                  style={{
                    flex: 1,
                    padding: '10px',
                    backgroundColor: 'transparent',
                    color: NEON,
                    border: `1.5px solid ${NEON}`,
                    fontWeight: 700,
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '11px',
                    letterSpacing: '0.5px'
                  }}
                >
                  +{streak >= 20 ? 15 : streak >= 15 ? 10 : streak >= 10 ? 5 : 2} VITE
                </button>
              </div>
              <p style={{fontSize: '10px', color: '#666', margin: '8px 0 0 0'}}>Se scegli vite, lo streak si azzera. Più streak = più vite</p>
            </div>
          ) : (
            <button
              onClick={() => {
                setChallenge(challenge + 1);
                setScreen('home');
              }}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: NEON,
                color: NERO,
                border: 'none',
                fontWeight: 700,
                borderRadius: '4px',
                cursor: 'pointer',
                marginBottom: '8px',
                fontSize: '12px',
                letterSpacing: '0.5px'
              }}
            >
              PROSSIMA CHALLENGE
            </button>
          )}

          <div style={{
            padding: '12px',
            backgroundColor: GRIGIO,
            borderLeft: `3px solid ${NEON}`,
            borderRadius: '4px',
            marginTop: '16px'
          }}>
            <p style={{fontSize: '10px', color: '#999', margin: 0, fontStyle: 'italic'}}>
              {getRandomFrase('win')}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // GAME RESULT - LOSS
  if (screen === 'gameResult' && gameMode === 'loss' && isLoggedIn) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: NERO,
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        fontFamily: '"DM Sans", sans-serif'
      }}>
        <div style={{width: '100%', maxWidth: '340px'}}>
          <BreakIcon />
          <div style={{textAlign: 'center', marginBottom: '28px'}}>
            <h2 style={{fontSize: '32px', fontWeight: 700, margin: '0 0 8px 0', letterSpacing: '0.5px'}}>HEYBOT VINCE</h2>
            <p style={{fontSize: '13px', color: '#999', margin: 0}}>Vite rimaste: <span style={{color: NEON, fontWeight: 700}}>{vite - 1}</span></p>
          </div>

          {vite - 1 > 0 ? (
            <>
              <button
                onClick={() => {
                  setVite(vite - 1);
                  setScreen('home');
                }}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: NEON,
                  color: NERO,
                  border: 'none',
                  fontWeight: 700,
                  borderRadius: '4px',
                  cursor: 'pointer',
                  marginBottom: '8px',
                  fontSize: '12px',
                  letterSpacing: '0.5px'
                }}
              >
                RIVINCITA
              </button>

              <div style={{
                padding: '12px',
                backgroundColor: GRIGIO,
                borderLeft: `3px solid ${NEON}`,
                borderRadius: '4px',
              }}>
                <p style={{fontSize: '10px', color: '#999', margin: 0}}>
                  Hai ancora <span style={{color: NEON, fontWeight: 700}}>{vite - 1}</span> vite oggi
                </p>
              </div>

              <div style={{
                padding: '12px',
                backgroundColor: GRIGIO,
                borderLeft: `3px solid ${NEON}`,
                borderRadius: '4px',
                marginTop: '12px'
              }}>
                <p style={{fontSize: '10px', color: '#999', margin: 0, fontStyle: 'italic'}}>
                  {getRandomFrase('loss')}
                </p>
              </div>
            </>
          ) : (
            <>
              <LockIcon />
              <div style={{
                padding: '16px',
                backgroundColor: GRIGIO,
                borderLeft: `3px solid ${NEON}`,
                borderRadius: '4px',
                textAlign: 'center',
                marginBottom: '16px'
              }}>
                <p style={{fontWeight: 700, margin: '0 0 8px 0'}}>VITE ESAURITE</p>
                <p style={{fontSize: '11px', color: '#666', margin: '0 0 8px 0'}}>Torna domani alle 00:00 per 3 vite fresche</p>
                <p style={{fontSize: '12px', fontWeight: 700, color: NEON, margin: 0}}>
                  {timeLeft || 'Caricamento...'}
                </p>
              </div>

              <div style={{
                padding: '12px',
                backgroundColor: GRIGIO,
                borderLeft: `3px solid ${NEON}`,
                borderRadius: '4px',
                marginBottom: '16px'
              }}>
                <p style={{fontSize: '10px', color: '#999', margin: 0, fontStyle: 'italic'}}>
                  {getRandomFrase('lossZeroVite')}
                </p>
              </div>

              <button
                onClick={() => setScreen('home')}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: 'transparent',
                  color: '#fff',
                  border: `1.5px solid #333`,
                  fontWeight: 700,
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  letterSpacing: '0.5px'
                }}
              >
                TORNA HOME
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  // RANKING
  if (screen === 'ranking' && isLoggedIn) {
    const topPlayers = [
      { name: 'Marco', points: 2450, avatar: 'M' },
      { name: 'Giulia', points: 1890, avatar: 'G' },
      { name: 'Alessandro', points: 1200, avatar: 'A' },
      { name: 'Sofia', points: 980, avatar: 'S' },
      { name: fullName || 'Tu', points: 450, avatar: (fullName || 'T').charAt(0).toUpperCase() },
    ];

    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: NERO,
        color: '#fff',
        padding: '20px',
        paddingBottom: '80px',
        fontFamily: '"DM Sans", sans-serif'
      }}>
        <button
          onClick={() => setScreen('home')}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            color: NEON,
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
            marginBottom: '24px',
            letterSpacing: '1px',
            padding: 0
          }}
        >
          ← INDIETRO
        </button>

        <h2 style={{fontSize: '36px', fontWeight: 700, margin: '0 0 24px 0', letterSpacing: '0.5px'}}>THEWALL</h2>

        <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
          {topPlayers.map((player, idx) => (
            <div
              key={idx}
              style={{
                padding: '12px',
                backgroundColor: player.name === (fullName || 'Tu') ? '#' + NEON.slice(1) + '15' : GRIGIO,
                border: `1.5px solid ${player.name === (fullName || 'Tu') ? NEON : '#333'}`,
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: NERO,
                    border: `1.5px solid ${NEON}`,
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '12px'
                  }}
                >
                  {player.avatar}
                </div>
                <div>
                  <p style={{fontWeight: 700, margin: 0, fontSize: '13px'}}>{player.name}</p>
                  <p style={{fontSize: '10px', color: '#666', margin: '2px 0 0 0'}}>#{idx + 1}</p>
                </div>
              </div>
              <p style={{fontWeight: 700, fontSize: '16px', color: NEON, margin: 0}}>{player.points}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // INFO
  if (screen === 'info' && isLoggedIn) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: NERO,
        color: '#fff',
        padding: '20px',
        paddingBottom: '80px',
        fontFamily: '"DM Sans", sans-serif'
      }}>
        <button
          onClick={() => setScreen('home')}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            color: NEON,
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
            marginBottom: '24px',
            letterSpacing: '1px',
            padding: 0
          }}
        >
          ← INDIETRO
        </button>

        <h2 style={{fontSize: '28px', fontWeight: 700, margin: '0 0 24px 0', letterSpacing: '0.5px'}}>INFORMAZIONI</h2>

        <div style={{display: 'flex', flexDirection: 'column', gap: '16px', lineHeight: '1.5', fontSize: '12px', color: '#ccc'}}>
          <section style={{
            padding: '14px',
            backgroundColor: GRIGIO,
            borderLeft: `3px solid ${NEON}`,
            borderRadius: '4px'
          }}>
            <h3 style={{fontWeight: 700, margin: '0 0 8px 0', color: NEON, fontSize: '13px', letterSpacing: '0.5px'}}>👾 COS'È HEYBOT?</h3>
            <p style={{margin: '0 0 8px 0'}}>
              HEYBOT è un'intelligenza artificiale sviluppata e controllata interamente da HEYPEOPLE.
            </p>
            <p style={{margin: 0}}>
              L'algoritmo utilizza un sistema decisionale basato su valutazione di posizioni di gioco e calcolo di sequenze future. HEYBOT non apprende dalle tue mosse: ogni partita è indipendente.
            </p>
          </section>

          <section style={{
            padding: '14px',
            backgroundColor: GRIGIO,
            borderLeft: `3px solid ${NEON}`,
            borderRadius: '4px'
          }}>
            <h3 style={{fontWeight: 700, margin: '0 0 8px 0', color: NEON, fontSize: '13px', letterSpacing: '0.5px'}}>⚖️ RESPONSABILITÀ DELL'UTENTE</h3>
            <p style={{margin: '0 0 8px 0'}}>
              L'utilizzo di questa app è a scopo di intrattenimento. HEYPEOPLE non è responsabile per danni derivanti dall'utilizzo improprio del servizio.
            </p>
            <p style={{margin: 0}}>
              Se noti comportamenti anomali nell'app, contatta: bilsdolor@gmail.com
            </p>
          </section>

          <section style={{
            padding: '14px',
            backgroundColor: GRIGIO,
            borderLeft: `3px solid ${NEON}`,
            borderRadius: '4px'
          }}>
            <h3 style={{fontWeight: 700, margin: '0 0 8px 0', color: NEON, fontSize: '13px', letterSpacing: '0.5px'}}>🔒 SICUREZZA & PRIVACY</h3>
            <p style={{margin: '0 0 6px 0'}}>✓ I tuoi dati di login sono criptati end-to-end</p>
            <p style={{margin: '0 0 6px 0'}}>✓ Le partite sono memorizzate solo per ranking</p>
            <p style={{margin: '0 0 6px 0'}}>✓ Non vendiamo dati a terzi</p>
            <p style={{margin: 0}}>✓ Leggi la nostra Privacy Policy</p>
          </section>

          <section style={{
            padding: '14px',
            backgroundColor: GRIGIO,
            borderLeft: `3px solid ${NEON}`,
            borderRadius: '4px'
          }}>
            <h3 style={{fontWeight: 700, margin: '0 0 8px 0', color: NEON, fontSize: '13px', letterSpacing: '0.5px'}}>⏱️ LIMITI DI UTILIZZO</h3>
            <p style={{margin: '0 0 6px 0'}}>• 3 partite giornaliere (reset 00:00)</p>
            <p style={{margin: '0 0 6px 0'}}>• Limite di account: 1 per email</p>
            <p style={{margin: 0}}>• Partite semplificate ogni 24h per equilibrio</p>
          </section>

          <section style={{
            padding: '14px',
            backgroundColor: GRIGIO,
            borderLeft: `3px solid ${NEON}`,
            borderRadius: '4px'
          }}>
            <h3 style={{fontWeight: 700, margin: '0 0 8px 0', color: NEON, fontSize: '13px', letterSpacing: '0.5px'}}>📞 CONTATTI</h3>
            <p style={{margin: 0}}>FOUNDER: bilsdolor@gmail.com</p>
          </section>

          <p style={{fontSize: '10px', color: '#666', margin: '16px 0 0 0', textAlign: 'center'}}>
            Ultima modifica: {currentDate}
          </p>
        </div>
      </div>
    );
  }
}
