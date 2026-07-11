import { Questionnaire } from '../types';
import { APRENDIZ_QUESTIONS } from './aprendizQuestions';
import { COMPANHEIRO_QUESTIONS } from './companheiroQuestions';

export const DEFAULT_QUESTIONNAIRES: Questionnaire[] = [
  {
    id: 'quiz-grau-1',
    title: 'Grau 1 - Aprendiz Maçom',
    degreeRequired: 1,
    approvalScore: 70,
    status: 'Ativo',
    questions: APRENDIZ_QUESTIONS
  },
  {
    id: 'quiz-grau-2',
    title: 'Grau 2 - Companheiro Maçom',
    degreeRequired: 2,
    approvalScore: 70,
    status: 'Ativo',
    questions: COMPANHEIRO_QUESTIONS
  }
];
