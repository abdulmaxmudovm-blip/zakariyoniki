import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Search, 
  Info, 
  CheckCircle2, 
  Clock,
  ArrowRight,
  Maximize2,
  X,
  Activity,
  Layers,
  Gamepad2,
  Car
} from 'lucide-react';
import { TENSE_CATEGORIES, TENSES, DICTIONARY_DATA } from './constants';
import { Tense, TenseCategory } from './types';

import PracticeZone from './PracticeZone';
import CarRaceGame from './CarRaceGame';
import SentenceBuilder from './SentenceBuilder';

export default function App() {
  const [viewMode, setViewMode] = useState<'matrix' | 'practice' | 'race' | 'dictionary'>('matrix');
  const [selectedCategory, setSelectedCategory] = useState<TenseCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTense, setSelectedTense] = useState<Tense | null>(null);
  const [activeMission, setActiveMission] = useState(false);

  useEffect(() => {
    setSearchQuery('');
  }, [viewMode]);

  const filteredTenses = useMemo(() => {
    return TENSES.filter(tense => {
      const matchesCategory = selectedCategory === 'All' || tense.category === selectedCategory;
      const matchesSearch = tense.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           tense.formation.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const getCategoryStyles = (category: TenseCategory) => {
    switch (category) {
      case TenseCategory.PRESENT:
        return 'text-blue-400 border-blue-500/30 bg-blue-900/20';
      case TenseCategory.PAST:
        return 'text-emerald-400 border-emerald-500/30 bg-emerald-900/20';
      case TenseCategory.FUTURE:
        return 'text-amber-400 border-amber-500/30 bg-amber-900/20';
      case TenseCategory.PAST_FUTURE:
        return 'text-indigo-400 border-indigo-500/30 bg-indigo-900/20';
      case TenseCategory.GRAMMAR:
        return 'text-fuchsia-400 border-fuchsia-500/30 bg-fuchsia-900/20';
      default:
        return 'text-slate-400 border-slate-700 bg-slate-900/50';
    }
  };

  const getTitleColor = (category: TenseCategory) => {
    switch (category) {
      case TenseCategory.PRESENT: return 'text-blue-300';
      case TenseCategory.PAST: return 'text-emerald-300';
      case TenseCategory.FUTURE: return 'text-amber-300';
      case TenseCategory.PAST_FUTURE: return 'text-indigo-300';
      case TenseCategory.GRAMMAR: return 'text-fuchsia-300';
      default: return 'text-slate-300';
    }
  };

  const getExampleColor = (category: TenseCategory) => {
    switch (category) {
      case TenseCategory.PRESENT: return 'text-blue-200';
      case TenseCategory.PAST: return 'text-emerald-200';
      case TenseCategory.FUTURE: return 'text-amber-200';
      case TenseCategory.PAST_FUTURE: return 'text-indigo-200';
      case TenseCategory.GRAMMAR: return 'text-fuchsia-200';
      default: return 'text-slate-200';
    }
  };

  const handleTenseClick = (tense: Tense, practice: boolean = false) => {
    setSelectedTense(tense);
    setActiveMission(practice);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-950 text-slate-200 p-4 md:p-6 font-sans">
      {/* Search Header */}
      <div className="absolute top-6 right-6 hidden lg:flex items-center gap-4 z-20">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input 
            type="text"
            placeholder="FILTER ARCHITECTURE..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-1.5 bg-slate-900 border border-slate-800 rounded text-[10px] font-mono tracking-widest uppercase focus:outline-hidden focus:border-brand-primary transition-all w-48"
          />
        </div>
      </div>

      {/* Header Section */}
      <header className="flex justify-between items-end mb-6 border-b border-slate-800 pb-4 shrink-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-white uppercase italic leading-none">
            englishengzo'r
          </h1>
          <p className="text-slate-400 text-[10px] md:text-xs mt-1 font-mono tracking-widest uppercase">
            zakariyoninig loyihasi
          </p>
        </div>
        <div className="flex gap-4 md:gap-8 items-center">
          <div className="flex bg-slate-900 border border-slate-800 rounded-full p-1">
            <button 
              onClick={() => setViewMode('matrix')}
              className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full transition-all ${viewMode === 'matrix' ? 'bg-brand-primary text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Masterlar uchun
            </button>
            <button 
              onClick={() => setViewMode('practice')}
              className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full transition-all flex items-center gap-2 ${viewMode === 'practice' ? 'bg-brand-primary text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <Gamepad2 className="w-3.5 h-3.5" />
              O'yinlar
            </button>
            <button 
              onClick={() => setViewMode('race')}
              className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full transition-all flex items-center gap-2 ${viewMode === 'race' ? 'bg-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.5)]' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <Car className="w-3.5 h-3.5" />
              Poyga
            </button>
            <button 
              onClick={() => setViewMode('dictionary')}
              className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full transition-all flex items-center gap-2 ${viewMode === 'dictionary' ? 'bg-amber-500 text-white shadow-[0_0_15px_rgba(245,158,11,0.5)]' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Lug'at
            </button>
          </div>
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-[10px] uppercase text-slate-500 font-bold tracking-tighter">Complexity</span>
            <span className="text-xs md:text-sm text-blue-400 font-mono">B1 — C2</span>
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="text-[10px] uppercase text-slate-500 font-bold tracking-tighter">Real-time</span>
            <span className="text-xs md:text-sm text-emerald-400 font-mono flex items-center gap-1">
              <Activity className="w-3 h-3" /> Enabled
            </span>
          </div>
        </div>
      </header>

      {/* Masterlar uchun Body */}
      {viewMode === 'matrix' ? (
        <div className="flex-1 overflow-hidden flex flex-col min-h-0">
          <div className="grid grid-cols-4 gap-2 mb-2 shrink-0">
            {T_CATEGORIES_LIST.map(cat => (
                <div 
                  key={cat}
                  onClick={() => setSelectedCategory(selectedCategory === cat ? 'All' : cat)}
                  className={`text-center font-black text-[10px] tracking-[0.2em] uppercase py-2.5 rounded-t-2xl border-t border-x cursor-pointer transition-all ${
                    selectedCategory === cat ? 'brightness-125' : 'opacity-60'
                  } ${getCategoryStyles(cat)}`}
                >
                {cat}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 overflow-y-auto no-scrollbar pr-1 content-start flex-1">
            <AnimatePresence mode="popLayout">
              {filteredTenses.map((tense) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={tense.id}
                  onClick={() => handleTenseClick(tense)}
                  className="bg-slate-900/40 border border-slate-800/60 p-5 rounded-3xl hover:border-slate-700 hover:bg-slate-900/60 transition-all cursor-pointer group flex flex-col relative"
                >
                  <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleTenseClick(tense, true); }}
                      className="p-2 hover:bg-brand-primary/20 text-brand-primary rounded-xl border border-slate-800 hover:border-brand-primary/30 transition-all"
                      title="O'yinni boshlash"
                    >
                      <Gamepad2 className="w-3.5 h-3.5" />
                    </button>
                    <div className="p-2 text-slate-600 rounded-xl border border-transparent">
                      <Maximize2 className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <h4 className={`text-base font-black uppercase tracking-tight mb-0.5 ${getTitleColor(tense.category)}`}>
                    {tense.name}
                  </h4>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter mb-3">
                    {tense.uzName}
                  </p>
                  <div className="bg-black/40 border border-slate-800 rounded-xl px-3 py-2 mb-4">
                    <code className="text-xs font-mono text-white leading-none">
                      {tense.formation}
                    </code>
                  </div>
                  <p className="text-[9px] text-slate-500 uppercase italic font-bold tracking-tight mb-2 line-clamp-2">
                    {tense.usage[0]}
                  </p>
                  <div className="mt-auto pt-2 border-t border-slate-800/50">
                    <p className={`text-[11px] font-mono italic truncate ${getExampleColor(tense.category)}`}>
                      “{tense.examples[0]}”
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      ) : viewMode === 'practice' ? (
        <div className="flex-1 flex items-center justify-center overflow-y-auto no-scrollbar">
          <PracticeZone onClose={() => setViewMode('matrix')} />
        </div>
      ) : viewMode === 'race' ? (
        <div className="flex-1 flex items-center justify-center overflow-hidden">
          <CarRaceGame onClose={() => setViewMode('matrix')} />
        </div>
      ) : (
        <div className="flex-1 overflow-hidden flex flex-col min-h-0">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input 
                type="text"
                placeholder="So'z qidirish (English or Uzbek)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-slate-900 border border-slate-800 rounded-2xl text-base font-medium focus:outline-hidden focus:border-brand-primary transition-all shadow-inner"
              />
            </div>
            <div className="px-5 py-4 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col items-center justify-center min-w-[90px] shadow-lg">
              <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest leading-none mb-1">Total</span>
              <span className="text-xl font-black text-white italic leading-none">{DICTIONARY_DATA.length}</span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto pr-1 no-scrollbar grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 content-start">
            <AnimatePresence mode="popLayout">
              {DICTIONARY_DATA.filter(item => 
                item.en.toLowerCase().includes(searchQuery.toLowerCase()) || 
                item.uz.toLowerCase().includes(searchQuery.toLowerCase())
              ).map((item, idx) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  key={item.en}
                  className="bg-slate-900/40 border border-slate-800/60 p-4 rounded-2xl flex items-center justify-between hover:border-brand-primary/30 group transition-all"
                >
                  <div className="flex flex-col">
                    <span className="text-lg font-bold text-white tracking-tight">{item.en}</span>
                    <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1 opacity-50 group-hover:opacity-100 transition-opacity">VOCAB_{idx + 1}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-slate-400 group-hover:text-brand-primary transition-colors">{item.uz}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Footer Controls */}
      <footer className="mt-4 flex flex-col md:flex-row items-center justify-between border-t border-slate-800 pt-4 shrink-0 gap-4">
        <div className="flex flex-wrap items-center justify-center gap-4">
          {[
            { label: 'Real Current', color: 'bg-blue-500 shadow-blue-500/50' },
            { label: 'Historical', color: 'bg-emerald-500 shadow-emerald-500/50' },
            { label: 'Predictive', color: 'bg-amber-500 shadow-amber-500/50' },
            { label: 'Conditional', color: 'bg-indigo-500 shadow-indigo-500/50' }
          ].map(legend => (
            <div key={legend.label} className="flex items-center gap-2 group cursor-default">
              <div className={`w-1.5 h-1.5 rounded-full ${legend.color} shadow-[0_0_8px_rgba(var(--tw-shadow-color),0.5)]`} />
              <span className="text-[9px] uppercase text-slate-500 font-black tracking-widest group-hover:text-slate-300 transition-colors">
                {legend.label}
              </span>
            </div>
          ))}
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-[9px] font-mono text-slate-600 bg-slate-900 px-3 py-1.5 rounded border border-slate-800 tracking-tight uppercase">
            S=SUBJ | V1-3=VERBS | V-ing=PRES.PART
          </div>
          <button 
            onClick={() => setSelectedCategory('All')}
            className="p-1 px-3 bg-brand-primary text-white text-[9px] font-black uppercase rounded hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all flex items-center gap-2"
          >
            <Layers className="w-3 h-3" /> Reset Grid
          </button>
        </div>
      </footer>

      {/* Detailed Modal */}
      <AnimatePresence>
        {selectedTense && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTense(null)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-8 md:p-10 overflow-y-auto max-h-[85vh]">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-slate-800 pb-8">
                  <div className="flex items-center gap-5">
                    <div className={`p-4 rounded-3xl bg-black/40 border ${getTitleColor(selectedTense.category)} border-current/20`}>
                      <Layers className="w-7 h-7" />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">
                        {selectedTense.category} Segment
                      </span>
                      <h2 className="text-3xl md:text-4xl font-black uppercase italic text-white tracking-tight">
                        {selectedTense.name}
                      </h2>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                        {selectedTense.uzName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex bg-slate-950 border border-slate-800 rounded-full p-1">
                      <button 
                        onClick={() => setActiveMission(false)}
                        className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-full transition-all ${!activeMission ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                      >
                        Theory
                      </button>
                      <button 
                        onClick={() => setActiveMission(true)}
                        className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-full transition-all ${activeMission ? 'bg-brand-primary text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'text-slate-500 hover:text-slate-300'}`}
                      >
                        O'yinlar
                      </button>
                    </div>
                    <button 
                      onClick={() => { setSelectedTense(null); setActiveMission(false); }}
                      className="p-3 hover:bg-slate-800 rounded-full border border-slate-800 transition-colors"
                    >
                      <X className="w-5 h-5 text-slate-500" />
                    </button>
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {activeMission ? (
                    <motion.div
                      key="mission"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="py-4"
                    >
                      <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-start gap-4">
                        <Activity className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="block text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-1">Mission Objective / Missiya maqsadi</span>
                          <p className="text-xs text-white/80 font-medium">
                            Reconstruct the grammar sequence below to stabilize the neural link for {selectedTense.name}.
                          </p>
                          <p className="text-[10px] text-slate-500 italic mt-1">
                            {selectedTense.name} uchun grammatik ketma-ketlikni tiklang.
                          </p>
                        </div>
                      </div>
                      {selectedTense.games?.[0].type === 'scramble' && (
                        <SentenceBuilder 
                          scrambled={selectedTense.games[0].question}
                          correct={selectedTense.games[0].answer as string}
                          onSuccess={() => {
                            // Maybe add confetti or sound effect here
                          }}
                        />
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="details"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="grid gap-8"
                    >
                      {/* Formation */}
                      <section>
                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">
                          <Clock className="w-3 h-3" /> Structural Formation
                        </div>
                        <div className="p-5 bg-black/40 rounded-2xl border border-slate-800 border-l-4 border-l-brand-primary">
                          <p className="text-lg font-mono text-white tracking-tight">{selectedTense.formation}</p>
                        </div>
                      </section>

                      {/* Formula Grid */}
                      {selectedTense.formula && (
                        <section>
                          <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">
                            <ArrowRight className="w-3 h-3" /> Syntax Branches
                          </div>
                          <div className="grid gap-2">
                            {[
                              { label: 'POS', icon: '+', color: 'text-emerald-400 bg-emerald-400/10 border-emerald-500/20', text: selectedTense.formula.positive },
                              { label: 'NEG', icon: '-', color: 'text-rose-400 bg-rose-400/10 border-rose-500/20', text: selectedTense.formula.negative },
                              { label: 'QUE', icon: '?', color: 'text-brand-primary bg-brand-primary/10 border-brand-primary/20', text: selectedTense.formula.question }
                            ].map(branch => (
                              <div key={branch.label} className={`flex items-center gap-4 p-4 rounded-xl border font-mono text-xs ${branch.color}`}>
                                <span className="w-5 flex justify-center font-bold">{branch.icon}</span>
                                <span className="opacity-40">{branch.label}</span>
                                <span className="font-medium tracking-tight overflow-x-auto no-scrollbar">{branch.text}</span>
                              </div>
                            ))}
                          </div>
                        </section>
                      )}

                      {/* Usage & Examples */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <section>
                          <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">
                            <Info className="w-3 h-3" /> Semantic Use
                          </div>
                          <ul className="space-y-4">
                            {selectedTense.usage.map((u, i) => (
                              <li key={i} className="flex flex-col gap-1 text-xs font-medium leading-relaxed">
                                <div className="flex gap-3 text-slate-400">
                                  <span className="text-brand-primary font-mono select-none">0{i+1}.</span>
                                  {u}
                                </div>
                                <div className="pl-8 text-[10px] text-slate-500 italic">
                                  {selectedTense.uzUsage[i]}
                                </div>
                              </li>
                            ))}
                          </ul>
                        </section>

                        <section>
                          <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">
                            <CheckCircle2 className="w-3 h-3" /> Context Samples
                          </div>
                          <div className="space-y-2">
                            {selectedTense.examples.map((ex, i) => (
                              <div key={i} className="p-4 bg-slate-950/50 border border-slate-800 rounded-xl font-mono text-[11px]">
                                <span className="text-slate-600 block mb-1">SAMPLE_DATA_{i+1}</span>
                                <p className="text-slate-200">“{ex}”</p>
                              </div>
                            ))}
                          </div>
                        </section>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
               <div className="p-8 border-t border-slate-800 bg-slate-950/30">
                <button 
                  onClick={() => { setSelectedTense(null); setActiveMission(false); }}
                  className="w-full py-4 bg-white text-slate-950 font-black text-xs uppercase tracking-[0.2em] rounded-full hover:bg-slate-200 transition-all active:scale-[0.98]"
                >
                  Confirm View & Exit
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

const T_CATEGORIES_LIST = Object.values(TenseCategory);
