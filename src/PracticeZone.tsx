import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  RefreshCcw, 
  CheckCircle2, 
  XCircle, 
  ArrowRight,
  Brain,
  Star,
  X
} from 'lucide-react';
import { TENSE_CATEGORIES, TENSES } from './constants';
import { Tense, GameQuestion } from './types';

import SentenceBuilder from './SentenceBuilder';

interface PracticeZoneProps {
  onClose?: () => void;
}

export default function PracticeZone({ onClose }: PracticeZoneProps) {
  const allGames = useMemo(() => {
    return TENSES.flatMap(t => (t.games || []).map(g => ({ ...g, tenseName: t.name, uzTenseName: t.uzName })));
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const currentGame = allGames[currentIndex];

  const handleAnswer = (answer: string) => {
    if (showFeedback) return;
    
    const correct = Array.isArray(currentGame.answer) 
      ? currentGame.answer.includes(answer) 
      : currentGame.answer.toLowerCase() === answer.toLowerCase();

    setIsCorrect(correct);
    if (correct) setScore(s => s + 1);
    setShowFeedback(true);
  };

  const nextQuestion = () => {
    if (currentIndex < allGames.length - 1) {
      setCurrentIndex(i => i + 1);
      setShowFeedback(false);
    } else {
      setIsFinished(true);
    }
  };

  const restart = () => {
    setCurrentIndex(0);
    setScore(0);
    setIsFinished(false);
    setShowFeedback(false);
  };

  if (isFinished) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-300">
        <Trophy className="w-16 h-16 text-amber-400 mb-4" />
        <h2 className="text-3xl font-black uppercase italic text-white mb-2">Simulatsiya yakunlandi</h2>
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mb-6">Game Over / O'yin tugadi</p>
        <div className="space-y-1 mb-8">
          <p className="text-slate-400 font-mono text-sm uppercase tracking-widest">
            Score Stability / Natija barqarorligi
          </p>
          <div className="text-5xl font-black text-brand-primary italic">
            {Math.round((score / allGames.length) * 100)}%
          </div>
          <p className="text-slate-500 font-mono text-[10px]">
             {score} / {allGames.length} MODULES_VERIFIED
          </p>
        </div>
        <button 
          onClick={restart}
          className="px-8 py-3 bg-brand-primary text-white font-black uppercase text-xs tracking-widest rounded hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all"
        >
          Qayta boshlash / Restart
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto w-full p-6 md:p-10 bg-slate-900 border border-slate-800 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
      {onClose && (
        <button 
          onClick={onClose}
          className="absolute top-6 left-6 p-2 hover:bg-slate-800 rounded-full border border-slate-800 transition-colors z-50 bg-slate-900/50 backdrop-blur-sm"
        >
          <X className="w-4 h-4 text-slate-500" />
        </button>
      )}
      <div className="absolute top-0 right-0 p-6">
        <div className="flex items-center gap-2 text-slate-500 font-mono text-[10px] bg-slate-950/50 px-3 py-1.5 rounded-full border border-slate-800">
          <Star className="w-3 h-3 text-amber-400" />
          Bosqich_{currentIndex + 1}
        </div>
      </div>
      
      <div className="mb-8">
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-primary">
          {currentGame.tenseName} ({currentGame.uzTenseName})
        </span>
        <h3 className="text-xl md:text-2xl font-bold text-white mt-2">
          {currentGame.type === 'scramble' ? "Ketma-ketlikni tiklang" : 'Simulatsiya testi'}
        </h3>
        <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest">
          {currentGame.type === 'scramble' ? 'Reconstruct the Sequence' : 'Simulation Check'}
        </p>
      </div>

      <div className="space-y-6">
        {currentGame.type === 'scramble' ? (
          <SentenceBuilder 
            scrambled={currentGame.question}
            correct={currentGame.answer as string}
            onSuccess={() => {
              if (!showFeedback) {
                setIsCorrect(true);
                setScore(s => s + 1);
                setShowFeedback(true);
              }
            }}
          />
        ) : (
          <>
            <div className="p-6 bg-black/40 rounded-3xl border border-slate-800">
              <p className="text-lg md:text-xl font-medium text-slate-200 leading-relaxed">
                {currentGame.question}
              </p>
            </div>

            <div className="space-y-3">
              {currentGame.type === 'choice' && (
                <div className="grid gap-2">
                  {currentGame.options?.map(option => (
                    <button
                      key={option}
                      onClick={() => handleAnswer(option)}
                      disabled={showFeedback}
                      className={`p-5 rounded-2xl border text-left font-mono text-xs transition-all ${
                        showFeedback 
                          ? option === currentGame.answer ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-slate-950 border-slate-800 text-slate-500'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-600 hover:bg-slate-900'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}

              {currentGame.type === 'true-false' && (
                <div className="grid grid-cols-2 gap-4">
                  {['True', 'False'].map(choice => (
                    <button
                      key={choice}
                      onClick={() => handleAnswer(choice.toLowerCase())}
                      disabled={showFeedback}
                      className={`p-5 rounded-2xl border font-black uppercase text-xs tracking-widest transition-all ${
                        showFeedback
                          ? choice.toLowerCase() === currentGame.answer ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-slate-950 border-slate-800 text-slate-500'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-600 hover:bg-slate-900'
                      }`}
                    >
                      {choice}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* Feedback Area */}
        <AnimatePresence>
          {showFeedback && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="space-y-4"
            >
              <div className={`p-4 rounded-2xl border flex items-center gap-3 ${isCorrect ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-rose-500/10 border-rose-500/30 text-rose-400'}`}>
                {isCorrect ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                <div className="font-mono text-[10px] uppercase tracking-tight">
                  {isCorrect ? 'SYSTEM_STABLE: CORRECT_INPUT' : `SYSTEM_CORRUPTION: EXPECTED [${currentGame.answer}]`}
                </div>
              </div>
              {currentGame.explanation && (
                <div className="space-y-1 p-5 bg-black/20 rounded-2xl border border-slate-800">
                  <p className="text-slate-400 text-[11px] font-medium leading-relaxed">
                    {currentGame.explanation}
                  </p>
                  {currentGame.uzExplanation && (
                    <p className="text-slate-500 text-[10px] italic">
                      {currentGame.uzExplanation}
                    </p>
                  )}
                </div>
              )}
              <button 
                onClick={nextQuestion}
                className="w-full py-4 bg-slate-800 text-white font-black uppercase text-xs tracking-widest rounded-2xl hover:bg-slate-700 flex items-center justify-center gap-2 transition-all"
              >
                Keyingisi / Proceed <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-8 pt-8 border-t border-slate-800 flex justify-between items-center">
        <div className="flex gap-1">
          {allGames.map((_, i) => (
            <div 
              key={i} 
              className={`h-1 rounded-full transition-all ${i === currentIndex ? 'w-8 bg-brand-primary' : i < currentIndex ? 'w-4 bg-emerald-500/50' : 'w-4 bg-slate-800'}`} 
            />
          ))}
        </div>
        <div className="flex items-center gap-2 text-[10px] font-mono text-slate-600">
          <Brain className="w-3 h-3" /> PROGRESS: {Math.round(((currentIndex + 1) / allGames.length) * 100)}%
        </div>
      </div>
    </div>
  );
}
