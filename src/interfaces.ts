// Interfaces
export interface ConfigQuizQuestion {
  question: string;
  answers: {
    A: any;
    B: any;
    C: any;
    D: any
    // .etc
  }
  answer: string;
}

export interface ConfigQuizRound {
  topic: string;
  questions: ConfigQuizQuestion[];
}

export interface ConfigQuiz {
  roles: {
    include: String[];
    contestant: number; // contestant role id
    exclude: String[];
    control: string;
  }
  "questions-per-round": number;
  contestants: number;
  rounds: ConfigQuizRound[];
}

export interface Config {
  token: string;
  quiz: ConfigQuiz;
}