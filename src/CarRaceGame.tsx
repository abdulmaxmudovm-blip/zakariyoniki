import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Car, Trophy, AlertTriangle, CheckCircle2, X } from 'lucide-react';
import { TENSES } from './constants';
import { GameQuestion } from './types';

interface PlayerState {
  score: number;
  currentQuestion: GameQuestion | null;
  feedback: 'correct' | 'wrong' | null;
}

interface CarRaceGameProps {
  onClose: () => void;
}

export default function CarRaceGame({ onClose }: CarRaceGameProps) {
  const allQuestions = useMemo(() => {
    return TENSES.flatMap(t => (t.games || []).filter(g => g.type === 'error-hunt').map(g => ({ ...g, tenseName: t.name })));
  }, []);

  const [p1, setP1] = useState<PlayerState>({ score: 0, currentQuestion: null, feedback: null });
  const [p2, setP2] = useState<PlayerState>({ score: 0, currentQuestion: null, feedback: null });
  const [tugBalance, setTugBalance] = useState(0); // -50 to 50
  const [gameState, setGameState] = useState<'lobby' | 'playing' | 'end'>('lobby');
  const [winner, setWinner] = useState<number | null>(null);

  const WIN_THRESHOLD = 50;
  const PULL_FORCE = 10;

  const getRandomQuestion = useCallback(() => {
    return allQuestions[Math.floor(Math.random() * allQuestions.length)];
  }, [allQuestions]);

  const startGame = () => {
    setP1({ score: 0, currentQuestion: getRandomQuestion(), feedback: null });
    setP2({ score: 0, currentQuestion: getRandomQuestion(), feedback: null });
    setTugBalance(0);
    setGameState('playing');
    setWinner(null);
  };

  const handleAnswer = (playerNum: 1 | 2, selected: string) => {
    if (gameState !== 'playing') return;

    const player = playerNum === 1 ? p1 : p2;
    const setPlayer = playerNum === 1 ? setP1 : setP2;

    if (player.feedback) return;

    const isCorrect = selected === player.currentQuestion?.answer;

    if (isCorrect) {
      setPlayer(prev => ({ ...prev, feedback: 'correct', score: prev.score + 1 }));
      
      const newBalance = tugBalance + (playerNum === 1 ? -PULL_FORCE : PULL_FORCE);
      setTugBalance(newBalance);

      if (Math.abs(newBalance) >= WIN_THRESHOLD) {
        setWinner(newBalance <= -WIN_THRESHOLD ? 1 : 2);
        setGameState('end');
      }

      setTimeout(() => {
        setPlayer(prev => ({ 
          ...prev, 
          feedback: null, 
          currentQuestion: getRandomQuestion() 
        }));
      }, 800);
    } else {
      setPlayer(prev => ({ ...prev, feedback: 'wrong' }));
      // Push back slightly on wrong answer
      setTugBalance(prev => {
        const next = prev + (playerNum === 1 ? 5 : -5);
        // Clamp to thresholds
        return Math.max(-WIN_THRESHOLD, Math.min(WIN_THRESHOLD, next));
      });
      setTimeout(() => {
        setPlayer(prev => ({ ...prev, feedback: null }));
      }, 800);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'playing') return;
      
      const key = e.key.toLowerCase();
      
      // P1: A, S, D
      if (key === 'a' && p1.currentQuestion?.options?.[0]) handleAnswer(1, p1.currentQuestion.options[0]);
      if (key === 's' && p1.currentQuestion?.options?.[1]) handleAnswer(1, p1.currentQuestion.options[1]);
      if (key === 'd' && p1.currentQuestion?.options?.[2]) handleAnswer(1, p1.currentQuestion.options[2]);

      // P2: J, K, L
      if (key === 'j' && p2.currentQuestion?.options?.[0]) handleAnswer(2, p2.currentQuestion.options[0]);
      if (key === 'k' && p2.currentQuestion?.options?.[1]) handleAnswer(2, p2.currentQuestion.options[1]);
      if (key === 'l' && p2.currentQuestion?.options?.[2]) handleAnswer(2, p2.currentQuestion.options[2]);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, p1, p2, handleAnswer]);

  if (gameState === 'lobby') {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-slate-900 border border-slate-800 rounded-[2.5rem] shadow-2xl h-full w-full max-w-4xl mx-auto">
        <div className="w-24 h-24 bg-brand-primary/20 rounded-full flex items-center justify-center mb-8">
          <Car className="w-12 h-12 text-brand-primary" />
        </div>
        <h2 className="text-4xl font-black italic uppercase text-white mb-4 tracking-tighter">Tug_Of_War / Arqon Tortish</h2>
        <p className="text-slate-400 mb-8 max-w-md">Ikki kishi uchun grammatik kurash. Gapdagi xatoni toping va raqibingizni o'z tomoningizga torting!</p>
        
        <div className="grid grid-cols-2 gap-8 mb-12 w-full max-w-2xl">
          <div className="p-6 bg-slate-950/50 rounded-3xl border border-slate-800 text-left">
            <h4 className="text-xs font-black uppercase text-blue-400 mb-3">Player 01 (Left)</h4>
            <div className="flex gap-2 mb-2">
              <span className="px-2 py-1 bg-slate-800 rounded text-[10px] font-bold">A</span>
              <span className="px-2 py-1 bg-slate-800 rounded text-[10px] font-bold">S</span>
              <span className="px-2 py-1 bg-slate-800 rounded text-[10px] font-bold">D</span>
            </div>
            <p className="text-[10px] text-slate-500 uppercase">Use keys A, S, D</p>
          </div>
          <div className="p-6 bg-slate-950/50 rounded-3xl border border-slate-800 text-right">
            <h4 className="text-xs font-black uppercase text-rose-400 mb-3">Player 02 (Right)</h4>
            <div className="flex gap-2 mb-2 justify-end">
              <span className="px-2 py-1 bg-slate-800 rounded text-[10px] font-bold">J</span>
              <span className="px-2 py-1 bg-slate-800 rounded text-[10px] font-bold">K</span>
              <span className="px-2 py-1 bg-slate-800 rounded text-[10px] font-bold">L</span>
            </div>
            <p className="text-[10px] text-slate-500 uppercase">Use keys J, K, L</p>
          </div>
        </div>

        <button 
          onClick={startGame}
          className="px-10 py-5 bg-brand-primary text-white font-black uppercase tracking-[0.2em] rounded-full hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] transition-all active:scale-95"
        >
          Start Engine / Poygani boshlash
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full bg-slate-950 relative overflow-hidden rounded-[2.5rem] border border-slate-800 max-w-5xl mx-auto shadow-2xl">
      <button 
        onClick={onClose}
        className="absolute top-4 left-4 z-50 p-3 bg-slate-900 border border-slate-800 rounded-full hover:bg-slate-800 transition-all shadow-xl"
      >
        <X className="w-4 h-4 text-slate-500" />
      </button>

      {/* RACE TRACK AREA (TUG OF WAR) */}
      <div className="h-1/3 bg-slate-900/50 relative overflow-hidden border-b border-slate-800">
        {/* Track Markings */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-20 flex justify-between px-10 opacity-20 pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
             <div key={i} className="w-1 h-full bg-slate-700" />
          ))}
        </div>
        
        {/* Center Line (Lose Zone) */}
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-8 bg-rose-500/10 blur-2xl" />
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-1 bg-white/40 z-10" />

        {/* Rope Visual */}
        <div className="absolute top-1/2 left-0 right-0 h-1.5 bg-amber-900/40 -translate-y-1/2" />
        <motion.div 
          animate={{ x: tugBalance * 4 }}
          className="absolute top-1/2 left-0 right-0 h-1.5 bg-amber-600 shadow-[0_0_15px_rgba(217,119,6,0.6)] -translate-y-1/2" 
        />

        {/* Cars */}
        <div className="absolute inset-0 flex items-center justify-center px-32">
          {/* P1 Car */}
          <motion.div 
            animate={{ x: (tugBalance * 4) - 100 }}
            transition={{ type: 'spring', damping: 15 }}
            className="relative z-20"
          >
            <Car className="w-20 h-20 text-blue-400 rotate-90 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-black text-blue-400 uppercase tracking-widest">P1</div>
          </motion.div>

          {/* P2 Car */}
          <motion.div 
            animate={{ x: (tugBalance * 4) + 100 }}
            transition={{ type: 'spring', damping: 15 }}
            className="relative z-20"
          >
            <Car className="w-20 h-20 text-rose-400 -rotate-90 drop-shadow-[0_0_10px_rgba(244,63,94,0.5)]" />
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-black text-rose-400 uppercase tracking-widest">P2</div>
          </motion.div>
        </div>
      </div>

      {/* GAMEPLAY BOXES */}
      <div className="flex-1 flex overflow-hidden">
        {/* PLAYER 1 (LEFT) */}
        <div className={`flex-1 border-r border-slate-800 flex flex-col p-8 transition-colors duration-500 ${p1.feedback === 'correct' ? 'bg-emerald-500/5' : p1.feedback === 'wrong' ? 'bg-rose-500/5' : ''}`}>
           <div className="flex justify-between items-center mb-6">
              <div className="px-4 py-1.5 bg-blue-500/10 border border-blue-500/30 rounded-full">
                <span className="text-[10px] font-black uppercase text-blue-400 tracking-widest">Player 01</span>
              </div>
              <div className="text-2xl font-black text-white italic tracking-tighter">{p1.score}</div>
           </div>
           
           <div className="flex-1 flex flex-col gap-6">
              <div className="p-6 bg-slate-950 border border-slate-800 rounded-3xl text-center shadow-inner">
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-4">Find the error:</p>
                <p className="text-base font-medium text-white italic leading-relaxed">
                  {p1.currentQuestion?.question}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {p1.currentQuestion?.options?.map((opt, idx) => (
                  <button
                    key={opt}
                    onClick={() => handleAnswer(1, opt)}
                    disabled={p1.feedback !== null || gameState !== 'playing'}
                    className={`p-4 rounded-2xl border transition-all text-left flex justify-between items-center group
                      ${p1.feedback === null 
                        ? 'border-slate-800 bg-slate-900/50 hover:border-blue-500/50 hover:bg-slate-900' 
                        : 'opacity-50 border-slate-800 cursor-not-allowed'
                      }
                    `}
                  >
                    <span className="text-xs font-bold text-slate-300 group-hover:text-white transition-colors">{opt}</span>
                    <span className="text-[9px] font-black px-2 py-1 bg-slate-800 rounded text-slate-500 uppercase">{['A', 'S', 'D'][idx]}</span>
                  </button>
                ))}
              </div>
           </div>
        </div>

        {/* PLAYER 2 (RIGHT) */}
        <div className={`flex-1 flex flex-col p-8 transition-colors duration-500 ${p2.feedback === 'correct' ? 'bg-emerald-500/5' : p2.feedback === 'wrong' ? 'bg-rose-500/5' : ''}`}>
           <div className="flex justify-between items-center mb-6">
              <div className="text-2xl font-black text-white italic tracking-tighter">{p2.score}</div>
              <div className="px-4 py-1.5 bg-rose-500/10 border border-rose-500/30 rounded-full">
                <span className="text-[10px] font-black uppercase text-rose-400 tracking-widest">Player 02</span>
              </div>
           </div>
           
           <div className="flex-1 flex flex-col gap-6">
              <div className="p-6 bg-slate-950 border border-slate-800 rounded-3xl text-center shadow-inner">
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-4">Find the error:</p>
                <p className="text-base font-medium text-white italic leading-relaxed">
                  {p2.currentQuestion?.question}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {p2.currentQuestion?.options?.map((opt, idx) => (
                  <button
                    key={opt}
                    onClick={() => handleAnswer(2, opt)}
                    disabled={p2.feedback !== null || gameState !== 'playing'}
                    className={`p-4 rounded-2xl border transition-all text-left flex justify-between items-center group
                      ${p2.feedback === null 
                        ? 'border-slate-800 bg-slate-900/50 hover:border-rose-500/50 hover:bg-slate-900' 
                        : 'opacity-50 border-slate-800 cursor-not-allowed'
                      }
                    `}
                  >
                    <span className="text-xs font-bold text-slate-300 group-hover:text-white transition-colors">{opt}</span>
                    <span className="text-[9px] font-black px-2 py-1 bg-slate-800 rounded text-slate-500 uppercase">{['J', 'K', 'L'][idx]}</span>
                  </button>
                ))}
              </div>
           </div>
        </div>
      </div>

      {/* RESULT OVERLAY */}
      <AnimatePresence>
        {gameState === 'end' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center"
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-slate-900 p-12 rounded-[3rem] border border-slate-800 shadow-2xl"
            >
              <Trophy className={`w-24 h-24 mb-6 mx-auto ${winner === 1 ? 'text-blue-400' : 'text-rose-400'}`} />
              <h2 className="text-4xl font-black italic uppercase text-white mb-2 tracking-tighter">PLAYER 0{winner} WINS!</h2>
              <p className="text-slate-500 font-mono mb-10 uppercase tracking-[0.4em] text-[10px]">Victory_Protocol_Active</p>
              <button 
                onClick={startGame}
                className="px-12 py-5 bg-brand-primary text-white font-black uppercase tracking-[0.2em] rounded-full hover:scale-105 transition-transform"
              >
                Rematch / Yana o'ynash
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
