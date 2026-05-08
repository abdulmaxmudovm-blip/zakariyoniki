import React, { useState, useEffect, useMemo } from 'react';
import { motion, Reorder, AnimatePresence } from 'motion/react';
import { CheckCircle2, RotateCcw, AlertTriangle, ArrowRight } from 'lucide-react';

interface SentenceBuilderProps {
  scrambled: string;
  correct: string;
  onSuccess: () => void;
}

export default function SentenceBuilder({ scrambled, correct, onSuccess }: SentenceBuilderProps) {
  const initialWords = scrambled.split(' / ').map((w, i) => ({ id: `${w}-${i}`, text: w }));
  const correctSequence = correct.replace(/[.,!?;]$/, '').toLowerCase();
  
  const [words, setWords] = useState(initialWords);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const currentSentence = words.map(w => w.text).join(' ').replace(/[.,!?;]$/, '').toLowerCase();
  
  // Calculate completion percentage based on current order vs correct sentence string parts
  // A simple way is to check if the current joined string matches the target
  // But for a percentage, we can check how many words are in the right position if we split the target into the same number of chunks
  
  const completionPercentage = useMemo(() => {
    const targetChunks = correct.split(' '); // This might not match scrambled chunks
    // Let's use a simpler approach: check if current order matches the known correct one
    // We don't have the "correct order of chunks" explicitly, but we can infer it
    // Actually, let's just use the current match status for now or a simple heuristic
    if (currentSentence === correctSequence) return 100;
    
    // Heuristic: how many units are in the correct place?
    // We need the correct order of units. Let's find it once.
    return 0; // fallback
  }, [currentSentence, correctSequence]);

  // Better approach: Find the correct order of units at start
  const [correctOrder] = useState(() => {
    const units = scrambled.split(' / ');
    // Sort units based on their position in the correct sentence
    return [...units].sort((a, b) => {
      return correct.indexOf(a) - correct.indexOf(b);
    });
  });

  const progress = useMemo(() => {
    let matches = 0;
    words.forEach((w, i) => {
      if (w.text === correctOrder[i]) matches++;
    });
    return Math.round((matches / words.length) * 100);
  }, [words, correctOrder]);

  const checkSentence = () => {
    const currentSentence = words.map(w => w.text).join(' ');
    const cleanedCorrect = correct.replace(/[.,!?;]$/, '').toLowerCase();
    const cleanedCurrent = currentSentence.replace(/[.,!?;]$/, '').toLowerCase();
    
    // Exact match check (or normalized)
    const match = cleanedCurrent === cleanedCorrect;
    setIsCorrect(match);
    setShowResult(true);
    if (match) {
      setTimeout(onSuccess, 1500);
    }
  };

  const reset = () => {
    setWords([...initialWords].sort(() => Math.random() - 0.5));
    setShowResult(false);
  };

  return (
    <div className="w-full space-y-8 py-4">
      <div className="text-center relative">
        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-2">Sequence Reconstruction</h4>
        <p className="text-sm text-slate-400 mb-4">Drag word modules to repair the grammar architecture</p>
        
        {/* Progress Bar */}
        <div className="max-w-xs mx-auto space-y-2">
           <div className="flex justify-between items-end text-[9px] font-mono font-bold uppercase tracking-tighter">
             <span className="text-slate-500">Sync_Progress / Jarayon</span>
             <span className="text-brand-primary">{progress}%</span>
           </div>
           <div className="h-1 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
             <motion.div 
               initial={{ width: 0 }}
               animate={{ width: `${progress}%` }}
               className="h-full bg-brand-primary shadow-[0_0_10px_rgba(59,130,246,0.5)]"
             />
           </div>
        </div>
      </div>

      <div className="relative p-8 bg-black/40 border border-slate-800 rounded-3xl min-h-[120px] flex items-center justify-center">
        <Reorder.Group 
          axis="x" 
          values={words} 
          onReorder={setWords}
          className="flex flex-wrap justify-center gap-3"
        >
          {words.map((word) => (
            <Reorder.Item
              key={word.id}
              value={word}
              className="cursor-pointer"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileDrag={{ scale: 1.1, zIndex: 10, cursor: 'grabbing' }}
                className="px-5 py-3 bg-slate-800 border border-slate-700 rounded-2xl shadow-lg"
              >
                <span className="text-sm md:text-base font-mono font-bold text-white tracking-tight">
                  {word.text}
                </span>
              </motion.div>
            </Reorder.Item>
          ))}
        </Reorder.Group>
        
        {/* Placeholder hints if needed */}
        {words.length === 0 && (
          <div className="text-slate-700 font-mono text-xs uppercase tracking-widest">
            EMPTY_BUFFER
          </div>
        )}
      </div>

      <div className="flex flex-col items-center gap-4">
        {!showResult ? (
          <button
            onClick={checkSentence}
            className="group relative px-10 py-4 bg-brand-primary text-white font-black text-xs uppercase tracking-[0.2em] rounded-full hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] transition-all active:scale-95"
          >
            Tekshirish / Execute Verification
          </button>
        ) : (
          <AnimatePresence>
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex flex-col items-center gap-4 w-full`}
            >
              <div className={`flex items-center gap-3 px-6 py-4 rounded-3xl border w-full max-w-md ${isCorrect ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-rose-500/10 border-rose-500/30 text-rose-400'}`}>
                {isCorrect ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                <div className="flex-1">
                  <span className="block text-[10px] font-black uppercase tracking-widest mb-1">
                    {isCorrect ? 'VALID_INPUT' : 'SYNTAX_ERROR'}
                  </span>
                  <p className="text-sm font-medium">
                    {isCorrect ? 'Sentence structure verified.' : 'Sequence does not match architecture.'}
                  </p>
                </div>
              </div>
              
              {!isCorrect && (
                <button
                  onClick={reset}
                  className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-xs font-black uppercase tracking-widest"
                >
                  <RotateCcw className="w-3 h-3" /> Qayta urinish / Re-attempt
                </button>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
