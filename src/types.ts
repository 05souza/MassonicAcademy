export interface ExecutiveReport {
  id: string;
  title: string;
  category: string;
  tags: string[];
  department: string;
  summary: string;
  fullMarkdown: string;
  leftBorderColor: 'gold' | 'teal' | 'blue' | 'purple';
  lastUpdated: string;
  owner: string;
  confidentiality: string;
  thumbnailUrl?: string;
  additionalLink?: string;
  customAccessUrl?: string;
  material1Link?: string;
  material1Name?: string;
  material2Link?: string;
  material2Name?: string;
  material3Link?: string;
  material3Name?: string;
  material4Link?: string;
  material4Name?: string;
  material5Link?: string;
  material5Name?: string;
  material6Link?: string;
  material6Name?: string;
  nivelCurso?: number;
  conteudoSemProva?: boolean;
  hasCertificate?: boolean;
  htmlContent?: string;
  status?: 'Ativo' | 'Inativo';
  linkedQuestionnaireId?: string;
  prerequisiteId?: string;
  lodgeId?: string;
  itemType?: 'curso' | 'trilha';
}

export interface SystemAlert {
  id: string;
  title: string;
  description: string;
  time: string;
  reportId?: string;
  type: 'update' | 'critical' | 'access';
  read: boolean;
  createdAt?: number;
  lodgeId?: string;
}

export interface AccessUser {
  id: string;
  name: string;
  email: string;
  allowedReportIds: string;
  blockedReportIds?: string;
  status: 'Ativo' | 'Inativo';
  tipoUsuario?: 'admin' | 'padrao';
  password?: string;
  nivelAcesso?: string;
  telefone?: string;
  loja?: string;
  potencia?: string;
  cidadeLoja?: string;
  userAcesso?: string;
  avatarUrl?: string;
  lodgeId?: string;
  lastActiveAt?: string;
}

export interface Lodge {
  id: string;
  nome: string;
  potencia: string;
  cidade: string;
  numero?: string;
  estado?: string;
  tema: 'cavaleiros' | 'templo' | 'ecletico' | 'carbono';
  logoUrl?: string;
}

export interface QuestionnaireQuestion {
  id: string;
  questionText: string;
  category: string;
  options: string[]; // typically 4 options: A, B, C, D
  correctOptionIndex: number; // 0 for A, 1 for B, 2 for C, 3 for D
  explanation?: string;
  isFreeResponse?: boolean;
}

export interface Questionnaire {
  id: string;
  title: string;
  degreeRequired: number; // e.g. 1 for Apprentice (Grau 1)
  approvalScore: number; // default e.g. 70 (%)
  questions: QuestionnaireQuestion[];
  status?: 'Ativo' | 'Inativo';
  onlyFullForCertificate?: boolean;
  lodgeId?: string;
  interactiveHtml?: string;
}

export interface SimulationAttempt {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  questionnaireId: string;
  questionnaireTitle: string;
  scorePercentage: number;
  correctAnswersCount: number;
  totalQuestionsCount: number;
  simulationMode: 'Completo' | 'Amostra' | 'Por Tema';
  timeSpentSeconds: number;
  dateTime: string;
  approved: boolean;
  diplomaSent?: boolean;
  respostas?: string;
  lodgeId?: string;
}

export interface QuestionnaireSettings {
  id: string;
  googleSheetsUrl: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  categories?: string[];
  nivelAcesso: number;
  status: 'Ativo' | 'Inativo';
  tags: string[];
  thumbnailUrl: string;
  link: string;
  publicationYear?: number;
  lodgeId?: string;
}

export interface Trilha {
  id: string;
  name: string;
  imageUrl?: string;
  courseIds?: string[];
  lodgeId?: string;
  status?: 'Ativo' | 'Inativo' | 'Em Construção';
}


