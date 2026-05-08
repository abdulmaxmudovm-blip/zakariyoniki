export enum TenseCategory {
  PRESENT = 'Present',
  PAST = 'Past',
  FUTURE = 'Future',
  PAST_FUTURE = 'Past Future',
  GRAMMAR = 'Grammar',
}

export interface TenseFormula {
  positive: string;
  negative: string;
  question: string;
}

export interface GameQuestion {
  id: string;
  type: 'scramble' | 'true-false' | 'matching' | 'choice' | 'error-hunt';
  question: string;
  answer: string | string[];
  options?: string[];
  explanation?: string;
  uzExplanation?: string;
}

export interface Tense {
  id: string;
  name: string;
  uzName: string;
  category: TenseCategory;
  formation: string;
  usage: string[];
  uzUsage: string[];
  examples: string[];
  formula?: TenseFormula;
  signalWords?: string[];
  games?: GameQuestion[];
}
