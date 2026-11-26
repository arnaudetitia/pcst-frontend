export interface Question {
  id: number;
  question: string;
  motIndice: string;
  bonneReponse: number;
  reponses: number[];
}

export interface QuestionVo {
  question: string;
  motIndice: string;
  bonneReponse: number;
  reponses: number[];
}
