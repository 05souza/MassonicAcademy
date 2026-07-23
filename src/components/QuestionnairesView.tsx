import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Award, 
  HelpCircle, 
  Trophy, 
  Clock, 
  RotateCcw, 
  Upload, 
  Play, 
  Sliders, 
  Plus, 
  Trash2, 
  Settings, 
  Edit, 
  Shield, 
  Check, 
  X, 
  ChevronRight, 
  Info, 
  Search, 
  SlidersHorizontal,
  ThumbsUp,
  FileText,
  Sparkles,
  Eye
} from 'lucide-react';
import { Questionnaire, QuestionnaireQuestion, SimulationAttempt, AccessUser, ExecutiveReport } from '../types';
import { getDegreeLabel } from '../utils/degrees';
import { initializeFirebase, cleanObjectForFirestore } from '../firebase';
import { doc, collection, getDocs, setDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import { APRENDIZ_QUESTIONS } from '../data/aprendizQuestions';
import { COMPANHEIRO_QUESTIONS } from '../data/companheiroQuestions';

// Initial default questionnaires to seed the database
const DEFAULT_QUESTIONNAIRES: Questionnaire[] = [
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

interface QuestionnairesViewProps {
  currentUser: AccessUser;
  isAdmin: boolean;
  questionnaires?: Questionnaire[];
  onOpenCertificate?: (recipientName: string, title: string, type: 'course' | 'quiz', date: string, score?: string, grade?: string) => void;
  reports?: ExecutiveReport[];
}

export default function QuestionnairesView({ 
  currentUser, 
  isAdmin: isGlobalAdmin, 
  questionnaires: propQuestionnaires,
  onOpenCertificate,
  reports = []
}: QuestionnairesViewProps) {
  // Database core state
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
  const [simulationAttempts, setSimulationAttempts] = useState<SimulationAttempt[]>([]);
  const [sheetsUrl, setSheetsUrl] = useState<string>('');

  useEffect(() => {
    if (propQuestionnaires && propQuestionnaires.length > 0) {
      setQuestionnaires(propQuestionnaires);
    }
  }, [propQuestionnaires]);
  
  // Dashboard states
  const [selectedQuizId, setSelectedQuizId] = useState<string>(() => localStorage.getItem('masonic_selected_quiz_id') || 'quiz-grau-1');
  const [simulationMode, setSimulationMode] = useState<'Completo' | 'Amostra' | 'Por Tema'>('Completo');
  const [studyQuestionsCount, setStudyQuestionsCount] = useState<10 | 20>(10);
  const [selectedTheme, setSelectedTheme] = useState<string>('');
  const [shuffleQuestions, setShuffleQuestions] = useState<boolean>(true);
  const [studyModeFeedback, setStudyModeFeedback] = useState<boolean>(true);
  
  // Active simulation engines
  const [isSimulationRunning, setIsSimulationRunning] = useState<boolean>(false);
  const [activeQuestions, setActiveQuestions] = useState<QuestionnaireQuestion[]>([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [userSelectedAnswers, setUserSelectedAnswers] = useState<Record<number, string | number>>({}); // { questionIdx: optionIdx | responsesText }
  const [answeredFeedback, setAnsweredFeedback] = useState<Record<number, boolean>>({}); // { questionIdx: true } (whether user clicked confirm on that question in study mode)
  const [activeSelectionIdx, setActiveSelectionIdx] = useState<number | null>(null);
  const [secondsElapsed, setSecondsElapsed] = useState<number>(0);
  const [showResultPanel, setShowResultPanel] = useState<boolean>(false);
  const [finishedAttempt, setFinishedAttempt] = useState<SimulationAttempt | null>(null);
  const [interactiveSelfScore, setInteractiveSelfScore] = useState<number>(100);
  const [showSendEarlyConfirm, setShowSendEarlyConfirm] = useState<boolean>(false);
  
  // Admin Screen states
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const [adminSubTab, setAdminSubTab] = useState<'editor' | 'relatorio'>('editor');
  const [reportSearchQuery, setReportSearchQuery] = useState<string>('');
  const [reportQuizFilter, setReportQuizFilter] = useState<string>('Todos');
  const [reportStatusFilter, setReportStatusFilter] = useState<string>('Todos');
  const [selectedAttemptForDetails, setSelectedAttemptForDetails] = useState<SimulationAttempt | null>(null);

  const [adminSelectedQuizId, setAdminSelectedQuizId] = useState<string>('quiz-grau-1');
  const [adminNameInput, setAdminNameInput] = useState<string>('');
  const [adminApprovalInput, setAdminApprovalInput] = useState<number>(70);
  const [adminDegreeRequiredInput, setAdminDegreeRequiredInput] = useState<number>(1);
  const [adminOnlyFullForCertificateInput, setAdminOnlyFullForCertificateInput] = useState<boolean>(false);
  const [adminSelectedQuestionId, setAdminSelectedQuestionId] = useState<string | null>(null);
  const [searchQuestionQuery, setSearchQuestionQuery] = useState<string>('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('Todas as Categorias');
  
  // Question editor states
  const [editQuestionText, setEditQuestionText] = useState<string>('');
  const [editQuestionCategory, setEditQuestionCategory] = useState<string>('Ritualística e Símbolos');
  const [editQuestionOptions, setEditQuestionOptions] = useState<string[]>(['', '', '', '']);
  const [editCorrectOptionIdx, setEditCorrectOptionIdx] = useState<number>(0);
  const [editQuestionExplanation, setEditQuestionExplanation] = useState<string>('');
  const [editIsFreeResponse, setEditIsFreeResponse] = useState<boolean>(false);

  // Status logs
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [isSendingToSheets, setIsSendingToSheets] = useState<boolean>(false);

  // New Quiz Book custom modal states
  const [isNewQuizModalOpen, setIsNewQuizModalOpen] = useState<boolean>(false);
  const [newQuizTitleInput, setNewQuizTitleInput] = useState<string>('');

  // Load database on start
  useEffect(() => {
    loadDatabase();
    const saved = localStorage.getItem('masonic_selected_quiz_id');
    if (saved) {
      setSelectedQuizId(saved);
      localStorage.removeItem('masonic_selected_quiz_id');
    }
  }, []);

  // Timer loop for active simulation
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isSimulationRunning && !showResultPanel) {
      interval = setInterval(() => {
        setSecondsElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isSimulationRunning, showResultPanel]);

  // Handle auto-selected theme list depending on the selected quiz
  const currentQuiz = questionnaires.find(q => q.id === selectedQuizId);
  const currentLinkedCourse = reports ? reports.find(r => r.linkedQuestionnaireId === selectedQuizId) : undefined;
  const isCurrentQuizTiedToCourse = !!currentLinkedCourse;

  const questionnaireThemes = currentQuiz 
    ? Array.from(new Set(currentQuiz.questions.map(q => q.category))) 
    : [];

  useEffect(() => {
    if (questionnaireThemes.length > 0 && !questionnaireThemes.includes(selectedTheme)) {
      setSelectedTheme(questionnaireThemes[0]);
    }
  }, [selectedQuizId, questionnaires]);

  // Load core structures
  const loadDatabase = async () => {
    try {
      const userLodgeId = currentUser?.lodgeId || 'lodge-cavaleiros';

      // 1. Read Sheets settings
      const localSheets = localStorage.getItem('masonic_questionnaire_sheets_v1');
      if (localSheets) {
        setSheetsUrl(localSheets);
      } else {
        const fallbackUrl = 'https://script.google.com/macros/s/AKfycbx80_2w9P5RKrd1vn4tLMZzvt-USbrWcI3zgx4645UHzMzdX6eyuCZUcq4ldZQu3cI/exec';
        setSheetsUrl(fallbackUrl);
        localStorage.setItem('masonic_questionnaire_sheets_v1', fallbackUrl);
      }

      // 2. Read simulation logs
      const localAttempts = localStorage.getItem('masonic_attempts_v1');
      let parsedAttempts: SimulationAttempt[] = [];
      if (localAttempts) {
        parsedAttempts = JSON.parse(localAttempts).filter((a: SimulationAttempt) => {
          const aLodge = a.lodgeId || 'lodge-cavaleiros';
          return aLodge === userLodgeId;
        });
        setSimulationAttempts(parsedAttempts);
      }

      // 3. Read Questionnaires from LocalStorage or seed defaults
      const localQuizzes = localStorage.getItem('masonic_questionnaires_v1');
      let loadedQuizzes: Questionnaire[] = [];
      if (localQuizzes) {
        loadedQuizzes = JSON.parse(localQuizzes);
        let updatedLocal = false;
        // Force-upgrade check for quiz-grau-1 questions if it contains old/fewer questions (less than 110):
        const g1 = loadedQuizzes.find(q => q.id === 'quiz-grau-1');
        if (g1 && g1.questions.length < 110) {
          g1.questions = APRENDIZ_QUESTIONS;
          updatedLocal = true;
        }
        // Force-upgrade check for quiz-grau-2 questions if it contains old/fewer questions (less than 60):
        const g2 = loadedQuizzes.find(q => q.id === 'quiz-grau-2');
        if (g2 && (!g2.questions || g2.questions.length < 60)) {
          g2.questions = COMPANHEIRO_QUESTIONS;
          updatedLocal = true;
        }
        if (updatedLocal) {
          localStorage.setItem('masonic_questionnaires_v1', JSON.stringify(loadedQuizzes));
        }
      } else {
        loadedQuizzes = DEFAULT_QUESTIONNAIRES;
        localStorage.setItem('masonic_questionnaires_v1', JSON.stringify(DEFAULT_QUESTIONNAIRES));
      }

      // 4. Firestore integration (sync if available)
      const { db } = initializeFirebase();
      if (db) {
        try {
          const quizSnap = await getDocs(collection(db, 'questionnaires'));
          const cloudQuizzes: Questionnaire[] = [];
          
          if (!quizSnap.empty) {
            quizSnap.forEach(doc => {
              const q = doc.data() as Questionnaire;
              if (q.lodgeId === userLodgeId || (!q.lodgeId && userLodgeId === 'lodge-cavaleiros')) {
                cloudQuizzes.push(q);
              }
            });
          }

          if (cloudQuizzes.length > 0) {
            // Check & upgrade within cloudQuizzes
            if (userLodgeId === 'lodge-cavaleiros') {
              const g1 = cloudQuizzes.find(q => q.id === 'quiz-grau-1');
              if (g1 && g1.questions.length < 110) {
                g1.questions = APRENDIZ_QUESTIONS;
                // Save upgraded quiz back to Firestore
                setDoc(doc(db, 'questionnaires', 'quiz-grau-1'), cleanObjectForFirestore(g1))
                  .catch(err => console.warn('Error upgrading firestore quiz-grau-1:', err));
              }

              const g2 = cloudQuizzes.find(q => q.id === 'quiz-grau-2');
              if (g2 && (!g2.questions || g2.questions.length < 60)) {
                g2.questions = COMPANHEIRO_QUESTIONS;
                // Save upgraded quiz back to Firestore
                setDoc(doc(db, 'questionnaires', 'quiz-grau-2'), cleanObjectForFirestore(g2))
                  .catch(err => console.warn('Error upgrading firestore quiz-grau-2:', err));
              }
            }

            loadedQuizzes = cloudQuizzes;
            localStorage.setItem('masonic_questionnaires_v1', JSON.stringify(cloudQuizzes));
          } else {
            if (userLodgeId === 'lodge-cavaleiros') {
              // Seed cloud with defaults
              const seededDefaults = DEFAULT_QUESTIONNAIRES.map(q => ({
                ...q,
                lodgeId: 'lodge-cavaleiros'
              }));
              const batchPromises = seededDefaults.map(q => 
                setDoc(doc(db, 'questionnaires', q.id), cleanObjectForFirestore(q))
              );
              await Promise.all(batchPromises);
              loadedQuizzes = seededDefaults;
              localStorage.setItem('masonic_questionnaires_v1', JSON.stringify(seededDefaults));
            } else {
              loadedQuizzes = [];
              localStorage.setItem('masonic_questionnaires_v1', JSON.stringify([]));
            }
          }

          // Attempts Sync
          const attemptSnap = await getDocs(collection(db, 'simulation_attempts'));
          if (!attemptSnap.empty) {
            const cloudAttempts: SimulationAttempt[] = [];
            attemptSnap.forEach(doc => {
              const a = doc.data() as SimulationAttempt;
              if (a.lodgeId === userLodgeId || (!a.lodgeId && userLodgeId === 'lodge-cavaleiros')) {
                cloudAttempts.push(a);
              }
            });
            parsedAttempts = cloudAttempts;
            setSimulationAttempts(cloudAttempts);
            localStorage.setItem('masonic_attempts_v1', JSON.stringify(cloudAttempts));
          } else {
            parsedAttempts = [];
            setSimulationAttempts([]);
            localStorage.setItem('masonic_attempts_v1', JSON.stringify([]));
          }

          // Settings Sync
          const settingsSnap = await getDocs(collection(db, 'settings'));
          const qSettings = settingsSnap.docs.find(d => d.id === 'questionnaire_settings');
          if (qSettings) {
            const sData = qSettings.data();
            if (sData && sData.googleSheetsUrl) {
              setSheetsUrl(sData.googleSheetsUrl);
              localStorage.setItem('masonic_questionnaire_sheets_v1', sData.googleSheetsUrl);
            }
          }
        } catch (e) {
          console.warn('Silent warning on Firestore sync, using LocalStorage fallback:', e);
        }
      }

      // Filter locally in case Firestore was bypassed or is not synced
      const finalQuizzes = loadedQuizzes.filter(q => {
        const qLodge = q.lodgeId || 'lodge-cavaleiros';
        return qLodge === userLodgeId;
      });
      setQuestionnaires(finalQuizzes);
    } catch (e) {
      console.error('Error loading questionnaire database:', e);
    }
  };

  const showToast = (text: string, type: 'success' | 'error') => {
    setStatusMessage({ text, type });
    setTimeout(() => {
      setStatusMessage(null);
    }, 5000);
  };

  const handleSaveSheetsUrl = async () => {
    try {
      localStorage.setItem('masonic_questionnaire_sheets_v1', sheetsUrl);
      
      const { db } = initializeFirebase();
      if (db) {
        await setDoc(doc(db, 'settings', 'questionnaire_settings'), { googleSheetsUrl: sheetsUrl });
      }
      showToast('Configuração de Integração de Planilhas salva com sucesso!', 'success');
    } catch (e) {
      showToast('Erro ao salvar configuração no servidor, mas salva localmente.', 'error');
    }
  };

  const handleRestoreDefaults = async () => {
    if (!window.confirm('Tem certeza que deseja restaurar os questionários padrões? Todas as alterações manuais serão resetadas.')) {
      return;
    }
    try {
      setQuestionnaires(DEFAULT_QUESTIONNAIRES);
      localStorage.setItem('masonic_questionnaires_v1', JSON.stringify(DEFAULT_QUESTIONNAIRES));

      const { db } = initializeFirebase();
      if (db) {
        const batchPromises = DEFAULT_QUESTIONNAIRES.map(q => 
          setDoc(doc(db, 'questionnaires', q.id), cleanObjectForFirestore(q))
        );
        await Promise.all(batchPromises);
      }
      showToast('Modelos de simulados padrões restaurados com sucesso!', 'success');
      loadDatabase();
    } catch (e) {
      showToast('Erro ao sincronizar restauração de simulados no servidor.', 'error');
    }
  };

  // Calculations for current user statistics
  const currentQuizAttempts = simulationAttempts.filter(
    a => a.questionnaireId === selectedQuizId && a.userEmail === currentUser.email
  );
  
  const simulationsCount = currentQuizAttempts.length;
  const bestAttempt = currentQuizAttempts.reduce<SimulationAttempt | null>(
    (best, cur) => (!best || cur.scorePercentage > best.scorePercentage) ? cur : best, 
    null
  );
  const bestScore = bestAttempt ? `${Math.round(bestAttempt.scorePercentage)}%` : '0%';
  const maxCorrect = bestAttempt ? `${bestAttempt.correctAnswersCount} acertos` : '0 acertos';

  const userAccessLevel = currentUser ? parseInt(String(currentUser.nivelAcesso || (isGlobalAdmin ? '33' : '1')), 10) : 1;
  const requiredLevel = currentQuiz?.degreeRequired || 1;
  const isAccessBlocked = userAccessLevel < requiredLevel;

  // Filter and sort the attempts for the admin report
  const filteredAttempts = simulationAttempts.filter(attempt => {
    const query = reportSearchQuery.toLowerCase().trim();
    const matchSearch = !query || 
      (attempt.userName || '').toLowerCase().includes(query) ||
      (attempt.userEmail || '').toLowerCase().includes(query) ||
      (attempt.questionnaireTitle || '').toLowerCase().includes(query);

    const matchQuiz = reportQuizFilter === 'Todos' || attempt.questionnaireId === reportQuizFilter;

    const matchStatus = reportStatusFilter === 'Todos' ||
      (reportStatusFilter === 'Aprovados' && attempt.approved) ||
      (reportStatusFilter === 'Reprovados' && !attempt.approved);

    return matchSearch && matchQuiz && matchStatus;
  });

  // --- START SIMULATION ACTIVE ---
  const handleStartSimulation = () => {
    if (!currentQuiz) return;

    if (currentQuiz.questions.length === 0 && !currentQuiz.interactiveHtml) {
      showToast('Este questionário selecionado não possui questões ou módulo interativo habilitado.', 'error');
      return;
    }

    const userAccessLevel = currentUser ? parseInt(String(currentUser.nivelAcesso || (isGlobalAdmin ? '33' : '1')), 10) : 1;
    const requiredLevel = currentQuiz.degreeRequired || 1;
    if (userAccessLevel < requiredLevel) {
      showToast('Acesso Restrito ao Grau: este material ainda não é do seu Grau.', 'error');
      return;
    }

    // Filter questions depending on selected simulation mode
    let baseList = [...(currentQuiz.questions || [])];
    
    if (simulationMode === 'Amostra') {
      // Pick random studyQuestionsCount questions or total if less
      baseList = baseList.sort(() => 0.5 - Math.random()).slice(0, Math.min(studyQuestionsCount, baseList.length));
    } else if (simulationMode === 'Por Tema') {
      baseList = baseList.filter(q => q.category === selectedTheme);
      if (baseList.length === 0 && !currentQuiz.interactiveHtml) {
        showToast('Nenhuma questão encontrada para este tema.', 'error');
        return;
      }
    }

    // Shuffle inside list if toggled on
    if (shuffleQuestions) {
      baseList = baseList.sort(() => 0.5 - Math.random());
    }

    // Reset loop engines
    setActiveQuestions(baseList);
    setCurrentQuestionIdx(0);
    setUserSelectedAnswers({});
    setAnsweredFeedback({});
    setActiveSelectionIdx(null);
    setSecondsElapsed(0);
    setShowResultPanel(false);
    setFinishedAttempt(null);
    setInteractiveSelfScore(100);
    setShowSendEarlyConfirm(false);
    
    setIsSimulationRunning(true);
  };

  // Handle clicking on a draft answer index
  const handleSelectOptionDraft = (optIdx: number) => {
    if (studyModeFeedback && answeredFeedback[currentQuestionIdx]) {
      // Answer already frozen, prevent click changes
      return;
    }
    setActiveSelectionIdx(optIdx);
    
    // Save draft
    setUserSelectedAnswers(prev => ({
      ...prev,
      [currentQuestionIdx]: optIdx
    }));

    // If study mode, immediately confirm/freeze and show feedback
    if (studyModeFeedback) {
      setAnsweredFeedback(prev => ({
        ...prev,
        [currentQuestionIdx]: true
      }));
    }
  };

  // Perform feedback or jump to next question
  const handleConfirmNextStep = async () => {
    const isFeedbackModeOnAndNotDone = studyModeFeedback && !answeredFeedback[currentQuestionIdx];

    if (activeSelectionIdx === null) {
      showToast('Por favor, selecione uma alternativa antes de prosseguir.', 'error');
      return;
    }

    if (isFeedbackModeOnAndNotDone) {
      // Mark as answered to show immediate visual checks
      setAnsweredFeedback(prev => ({
        ...prev,
        [currentQuestionIdx]: true
      }));
      return;
    }

    // Otherwise, transition forward
    if (currentQuestionIdx < activeQuestions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
      // Retrieve next if already answered or reset draft
      const nextAnswer = userSelectedAnswers[currentQuestionIdx + 1];
      setActiveSelectionIdx(nextAnswer !== undefined ? nextAnswer : null);
    } else {
      // Finished simulation!
      await handleFinishSimulation();
    }
  };

  const handleFinishSimulation = async () => {
    let correctCount = 0;
    activeQuestions.forEach((q, idx) => {
      const userAns = userSelectedAnswers[idx];
      if (q.isFreeResponse) {
        if (userAns !== undefined && String(userAns).trim() !== '') {
          correctCount++;
        }
      } else {
        if (userAns !== undefined && userAns === q.correctOptionIndex) {
          correctCount++;
        }
      }
    });

    const totalQuizQuestions = currentQuiz?.questions?.length || activeQuestions.length || 1;
    const scorePct = (correctCount / totalQuizQuestions) * 100;
    const isApproved = scorePct >= (currentQuiz?.approvalScore || 70);

    const respostasText = activeQuestions.map((q, idx) => {
      const ans = userSelectedAnswers[idx];
      let ansLabel = 'Sem resposta';
      if (ans !== undefined) {
        if (q.isFreeResponse) {
          ansLabel = String(ans);
        } else {
          const letter = ['A', 'B', 'C', 'D'][ans as number] || '';
          ansLabel = `${letter}) ${q.options[ans as number] || ''}`;
        }
      }
      return `${idx + 1}. ${q.questionText}: [${ansLabel}]`;
    }).join(' | ');

    const newAttempt: SimulationAttempt = {
      id: `att-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: currentUser.id,
      userEmail: currentUser.email,
      userName: currentUser.name,
      questionnaireId: currentQuiz?.id || 'id',
      questionnaireTitle: currentQuiz?.title || 'Título',
      scorePercentage: scorePct,
      correctAnswersCount: correctCount,
      totalQuestionsCount: totalQuizQuestions,
      simulationMode: simulationMode,
      timeSpentSeconds: secondsElapsed,
      dateTime: new Date().toLocaleString('pt-BR'),
      approved: isApproved,
      diplomaSent: false,
      respostas: respostasText,
      lodgeId: currentUser?.lodgeId || 'lodge-cavaleiros'
    };

    // Save locally
    const updatedAttempts = [newAttempt, ...simulationAttempts];
    setSimulationAttempts(updatedAttempts);
    localStorage.setItem('masonic_attempts_v1', JSON.stringify(updatedAttempts));

    // Save cloud
    const { db } = initializeFirebase();
    if (db) {
      try {
        await setDoc(doc(db, 'simulation_attempts', newAttempt.id), cleanObjectForFirestore(newAttempt));
      } catch (e) {
        console.error('Error syncing attempt to Firestore:', e);
      }
    }

    setFinishedAttempt(newAttempt);
    setShowResultPanel(true);
  };

  const handleCompleteInteractiveQuiz = async (scorePct: number) => {
    if (!currentQuiz) return;
    const isApproved = scorePct >= (currentQuiz.approvalScore || 70);

    const newAttempt: SimulationAttempt = {
      id: `att-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: currentUser.id,
      userEmail: currentUser.email,
      userName: currentUser.name,
      questionnaireId: currentQuiz.id,
      questionnaireTitle: currentQuiz.title,
      scorePercentage: scorePct,
      correctAnswersCount: scorePct >= 100 ? 1 : 0,
      totalQuestionsCount: 1,
      simulationMode: 'Completo',
      timeSpentSeconds: secondsElapsed,
      dateTime: new Date().toLocaleString('pt-BR'),
      approved: isApproved,
      diplomaSent: false,
      respostas: `Concluído via questionário interativo HTML com nota ${scorePct}%`,
      lodgeId: currentUser?.lodgeId || 'lodge-cavaleiros'
    };

    // Save locally
    const updatedAttempts = [newAttempt, ...simulationAttempts];
    setSimulationAttempts(updatedAttempts);
    localStorage.setItem('masonic_attempts_v1', JSON.stringify(updatedAttempts));

    // Save cloud
    const { db } = initializeFirebase();
    if (db) {
      try {
        await setDoc(doc(db, 'simulation_attempts', newAttempt.id), cleanObjectForFirestore(newAttempt));
      } catch (e) {
        console.error('Error syncing attempt to Firestore:', e);
      }
    }

    setFinishedAttempt(newAttempt);
    setShowResultPanel(true);
    setIsSimulationRunning(false);
    showToast(`Questionário interativo concluído com sucesso! Desempenho: ${scorePct}%`, 'success');
  };

  useEffect(() => {
    const handleIframeMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'quiz-finished') {
        const receivedScore = typeof event.data.score === 'number' ? event.data.score : 100;
        handleCompleteInteractiveQuiz(receivedScore);
      }
    };
    window.addEventListener('message', handleIframeMessage);
    return () => window.removeEventListener('message', handleIframeMessage);
  }, [currentQuiz, isSimulationRunning, secondsElapsed]);

  // Submit record to Google Sheets Script URL
  const handleRequestDiploma = async () => {
    if (!finishedAttempt) return;
    setIsSendingToSheets(true);

    try {
      const queryParams = new URLSearchParams({
        nome: finishedAttempt.userName,
        email: finishedAttempt.userEmail,
        questionario: finishedAttempt.questionnaireTitle,
        nota: `${Math.round(finishedAttempt.scorePercentage)}%`,
        porcentagem: `${Math.round(finishedAttempt.scorePercentage)}%`, // Compatibilidade com script que lê e.parameter.porcentagem
        acertos: `${finishedAttempt.correctAnswersCount}/${finishedAttempt.totalQuestionsCount}`,
        modo: finishedAttempt.simulationMode,
        tempo: `${Math.floor(finishedAttempt.timeSpentSeconds / 60)}m ${finishedAttempt.timeSpentSeconds % 60}s`,
        status: finishedAttempt.approved ? 'Aprovado' : 'Reprovado',
        data: finishedAttempt.dateTime
      });

      if (finishedAttempt.respostas) {
        queryParams.append('respostas', finishedAttempt.respostas);
      }

      const endpoint = sheetsUrl || 'https://script.google.com/macros/s/AKfycbx80_2w9P5RKrd1vn4tLMZzvt-USbrWcI3zgx4645UHzMzdX6eyuCZUcq4ldZQu3cI/exec';
      
      const fullUrl = `${endpoint}?${queryParams.toString()}`;
      
      // Perform as fetch inside try catch, if it blocks due to CORS (Google Apps Script is prone to redirect CORS), we still treat it gracefully
      // and let the user know we sent it.
      await fetch(fullUrl, { mode: 'no-cors', method: 'GET' });

      // Update local attempt diploma status
      const updated = simulationAttempts.map(a => 
        a.id === finishedAttempt.id ? { ...a, diplomaSent: true } : a
      );
      setSimulationAttempts(updated);
      localStorage.setItem('masonic_attempts_v1', JSON.stringify(updated));

      const { db } = initializeFirebase();
      if (db) {
        await setDoc(doc(db, 'simulation_attempts', finishedAttempt.id), cleanObjectForFirestore({ ...finishedAttempt, diplomaSent: true }));
      }

      setFinishedAttempt(prev => prev ? { ...prev, diplomaSent: true } : prev);
      showToast('Comprovante de aprovação enviado com sucesso para a planilha integradora!', 'success');

    } catch (e) {
      console.error('Exception on sheets fetch:', e);
      showToast('Ocorreu uma resposta ao registrar na planilha, verifique as permissões do script.', 'error');
    } finally {
      setIsSendingToSheets(false);
    }
  };


  // --- ADMIN PANEL CONTROLS ---

  const adminQuiz = questionnaires.find(q => q.id === adminSelectedQuizId);
  const categoriesOfAdminQuiz = adminQuiz 
    ? Array.from(new Set(adminQuiz.questions.map(q => q.category)))
    : [];

  // Filter administration list based on search and category
  const adminFilteredQuestions = adminQuiz ? adminQuiz.questions.filter(q => {
    const qSearch = (searchQuestionQuery || '').toLowerCase();
    const matchSearch = (q.questionText || '').toLowerCase().includes(qSearch) ||
                        (q.explanation || '').toLowerCase().includes(qSearch);
    const matchCategory = selectedCategoryFilter === 'Todas as Categorias' || q.category === selectedCategoryFilter;
    return matchSearch && matchCategory;
  }) : [];

  const handleSelectAdminQuestion = (qId: string) => {
    const qDetails = adminQuiz?.questions.find(item => item.id === qId);
    if (!qDetails) return;

    setAdminSelectedQuestionId(qId);
    setEditQuestionText(qDetails.questionText);
    setEditQuestionCategory(qDetails.category);
    setEditQuestionOptions(qDetails.options && qDetails.options.length > 0 ? [...qDetails.options] : ['', '', '', '']);
    setEditCorrectOptionIdx(qDetails.correctOptionIndex);
    setEditQuestionExplanation(qDetails.explanation || '');
    setEditIsFreeResponse(!!qDetails.isFreeResponse);
  };

  const handleStartCreateNewQuestion = () => {
    setAdminSelectedQuestionId('NOT_SAVED_NEW_Q');
    setEditQuestionText('');
    setEditQuestionCategory(categoriesOfAdminQuiz[0] || 'Geral');
    setEditQuestionOptions(['', '', '', '']);
    setEditCorrectOptionIdx(0);
    setEditQuestionExplanation('');
    setEditIsFreeResponse(false);
  };

  const handleSaveQuestion = async () => {
    if (!editQuestionText.trim()) {
      showToast('O texto da pergunta não pode estar vazio.', 'error');
      return;
    }
    if (!editIsFreeResponse && editQuestionOptions.some(opt => !opt.trim())) {
      showToast('Por favor, preencha todas as 4 alternativas possíveis.', 'error');
      return;
    }
    if (!adminQuiz) return;

    let updatedQuestionsList = [...adminQuiz.questions];

    if (adminSelectedQuestionId === 'NOT_SAVED_NEW_Q') {
      // Create new
      const newQuestion: QuestionnaireQuestion = {
        id: `q-custom-${Date.now()}`,
        questionText: editQuestionText.trim(),
        category: editQuestionCategory,
        options: editIsFreeResponse ? [] : editQuestionOptions.map(o => o.trim()),
        correctOptionIndex: editIsFreeResponse ? 0 : editCorrectOptionIdx,
        explanation: editQuestionExplanation.trim(),
        isFreeResponse: editIsFreeResponse
      };
      updatedQuestionsList.push(newQuestion);
      setAdminSelectedQuestionId(newQuestion.id);
    } else {
      // Modify existing
      updatedQuestionsList = updatedQuestionsList.map(item => {
        if (item.id === adminSelectedQuestionId) {
          return {
            ...item,
            questionText: editQuestionText.trim(),
            category: editQuestionCategory,
            options: editIsFreeResponse ? [] : editQuestionOptions.map(o => o.trim()),
            correctOptionIndex: editIsFreeResponse ? 0 : editCorrectOptionIdx,
            explanation: editQuestionExplanation.trim(),
            isFreeResponse: editIsFreeResponse
          };
        }
        return item;
      });
    }

    await saveAdminQuizQuestions(updatedQuestionsList);
    showToast('Questão gravada com sucesso!', 'success');
  };

  const handleDeleteQuestion = async (qId: string) => {
    if (!window.confirm('Excluir esta questão permanentemente?')) return;
    if (!adminQuiz) return;

    const updated = adminQuiz.questions.filter(item => item.id !== qId);
    await saveAdminQuizQuestions(updated);
    setAdminSelectedQuestionId(null);
    showToast('Questão removida com sucesso!', 'success');
  };

  const saveAdminQuizQuestions = async (newQsList: QuestionnaireQuestion[]) => {
    const updatedQuizzes = questionnaires.map(q => {
      if (q.id === adminSelectedQuizId) {
        return {
          ...q,
          questions: newQsList
        };
      }
      return q;
    });

    setQuestionnaires(updatedQuizzes);
    localStorage.setItem('masonic_questionnaires_v1', JSON.stringify(updatedQuizzes));

    const { db } = initializeFirebase();
    if (db) {
      try {
        const quizToSave = updatedQuizzes.find(q => q.id === adminSelectedQuizId);
        if (quizToSave) {
          await setDoc(doc(db, 'questionnaires', adminSelectedQuizId), cleanObjectForFirestore(quizToSave));
        }
      } catch (e) {
        console.error('Error syncing questions to Firestore:', e);
      }
    }
  };

  const handleUpdateQuizMeta = async () => {
    if (!adminQuiz) return;
    if (!adminNameInput.trim()) {
      showToast('O título do questionário não pode estar vazio.', 'error');
      return;
    }

    const updatedQuizzes = questionnaires.map(q => {
      if (q.id === adminSelectedQuizId) {
        return {
          ...q,
          title: adminNameInput.trim(),
          approvalScore: adminApprovalInput,
          degreeRequired: adminDegreeRequiredInput,
          onlyFullForCertificate: adminOnlyFullForCertificateInput
        };
      }
      return q;
    });

    setQuestionnaires(updatedQuizzes);
    localStorage.setItem('masonic_questionnaires_v1', JSON.stringify(updatedQuizzes));

    const { db } = initializeFirebase();
    if (db) {
      try {
        const quizToSave = updatedQuizzes.find(q => q.id === adminSelectedQuizId);
        if (quizToSave) {
          await setDoc(doc(db, 'questionnaires', adminSelectedQuizId), cleanObjectForFirestore(quizToSave));
        }
      } catch (e) {
        console.error('Error updating questionnaire master settings:', e);
      }
    }
    showToast('Configurações principais do simulado atualizadas!', 'success');
  };

  const handleCreateNewQuizBook = () => {
    setNewQuizTitleInput('');
    setIsNewQuizModalOpen(true);
  };

  const handleConfirmCreateNewQuizBook = async () => {
    const title = newQuizTitleInput.trim();
    if (!title) {
      showToast('O título do caderno não pode estar vazio.', 'error');
      return;
    }

    const newId = `quiz-custom-${Date.now()}`;
    const newQuiz: Questionnaire = {
      id: newId,
      title: title,
      degreeRequired: 1,
      approvalScore: 70,
      status: 'Ativo',
      questions: [],
      onlyFullForCertificate: false,
      lodgeId: currentUser?.lodgeId || 'lodge-cavaleiros'
    };

    const updated = [...questionnaires, newQuiz];
    setQuestionnaires(updated);
    localStorage.setItem('masonic_questionnaires_v1', JSON.stringify(updated));

    const { db } = initializeFirebase();
    if (db) {
      try {
        await setDoc(doc(db, 'questionnaires', newId), cleanObjectForFirestore(newQuiz));
      } catch (e) {
        console.error('Error creating quiz on Firestore:', e);
      }
    }

    setAdminSelectedQuizId(newId);
    setAdminSelectedQuestionId(null);
    setIsNewQuizModalOpen(false);
    setNewQuizTitleInput('');
    showToast(`Dossiê "${title}" cadastrado com sucesso! Use o painel à direita para adicionar questões.`, 'success');
  };

  const handleDeleteQuizBook = async () => {
    if (!adminQuiz) return;
    if (questionnaires.length <= 1) {
      showToast('Não é possível excluir o único caderno de simulados ativo do sistema.', 'error');
      return;
    }
    if (!window.confirm(`Tem certeza absoluta de que deseja excluir permanentemente o caderno \"${adminQuiz.title}\" e todas as suas questões?`)) {
      return;
    }

    const updated = questionnaires.filter(q => q.id !== adminSelectedQuizId);
    setQuestionnaires(updated);
    localStorage.setItem('masonic_questionnaires_v1', JSON.stringify(updated));

    const { db } = initializeFirebase();
    if (db) {
      try {
        await deleteDoc(doc(db, 'questionnaires', adminSelectedQuizId));
      } catch (e) {
        console.error('Error deleting quiz on Firestore:', e);
      }
    }

    setAdminSelectedQuizId(updated[0].id);
    setAdminSelectedQuestionId(null);
    showToast('Dossiê de estudos removido com sucesso!', 'success');
  };

  const handleDeleteAttempt = async (attemptId: string) => {
    if (!window.confirm('Tem certeza absoluta de que deseja excluir este registro de nota permanentemente?')) return;
    try {
      const updated = simulationAttempts.filter(a => a.id !== attemptId);
      setSimulationAttempts(updated);
      localStorage.setItem('masonic_attempts_v1', JSON.stringify(updated));

      const { db } = initializeFirebase();
      if (db) {
        await deleteDoc(doc(db, 'simulation_attempts', attemptId));
      }
      showToast('Registro de nota excluído com sucesso!', 'success');
    } catch (e) {
      console.error('Error deleting attempt:', e);
      showToast('Erro ao sincronizar exclusão com o servidor, mas removido localmente.', 'error');
    }
  };

  useEffect(() => {
    if (adminQuiz) {
      setAdminNameInput(adminQuiz.title);
      setAdminApprovalInput(adminQuiz.approvalScore);
      setAdminDegreeRequiredInput(adminQuiz.degreeRequired || 1);
      setAdminOnlyFullForCertificateInput(!!adminQuiz.onlyFullForCertificate);
    }
  }, [adminSelectedQuizId, questionnaires]);


  // Format elapsed seconds for timer indicators
  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // UI ACTIVE SCREEN RENDERER
  if (isSimulationRunning) {
    const activeQuestion = activeQuestions[currentQuestionIdx];
    const isFeedbackDoneForQuestion = studyModeFeedback && answeredFeedback[currentQuestionIdx];
    const questionSelectedAnswer = userSelectedAnswers[currentQuestionIdx];

    return (
      <div className="bg-[#04141d] rounded-2xl border border-[#1c2c36] min-h-[600px] shadow-2xl overflow-hidden flex flex-col max-w-4xl mx-auto my-4 animate-fade-in text-left">
        {/* Top Header Banner */}
        <div className="bg-[#06273a] border-b-2 border-[#D4AF37] px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-[#D4AF37]/15 p-2 rounded-lg border border-[#D4AF37]/35">
              <BookOpen className="w-5 h-5 text-[#E9C349]" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-[#66d9cc] uppercase tracking-wide font-bold">
                Grau {currentQuiz?.degreeRequired} — {currentQuiz?.title}
              </span>
              <h2 className="text-[#d4e5f2] font-sans font-bold text-base leading-tight">
                Instruções de Avaliação
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto md:justify-end">
            {/* Timer state */}
            <div className="flex items-center gap-1.5 bg-[#04141d] rounded-full px-3 py-1 border border-[#1c2c36]">
              <Clock className="w-3.5 h-3.5 text-[#E9C349]" />
              <span className="font-mono text-xs text-[#d4e5f2] font-semibold">
                {formatTime(secondsElapsed)}
              </span>
            </div>

            {/* Questions tracker */}
            {currentQuiz?.interactiveHtml ? (
              <div className="font-mono text-[10px] text-[#E9C349] bg-[#0c1d27]/70 py-1 px-3 rounded-full border border-[#D4AF37]/30 uppercase font-black">
                Simulador Interativo HTML
              </div>
            ) : (
              <div className="font-mono text-[10px] text-[#99907c] bg-[#0c1d27]/70 py-1 px-3 rounded-full border border-[#1c2c36]">
                Questão <span className="text-[#66d9cc] font-bold">{currentQuestionIdx + 1}</span> de <span className="text-white font-bold">{activeQuestions.length}</span>
              </div>
            )}

            {/* Force Exit Button */}
            <button
              onClick={() => {
                const isCompleto = simulationMode === 'Completo';
                if (window.confirm(isCompleto ? 'Deseja interromper o questionário ativo? Suas respostas não serão salvas.' : 'Deseja interromper o simulado ativo? Suas respostas não serão salvas.')) {
                  setIsSimulationRunning(false);
                }
              }}
              className="text-[#99907c] hover:text-rose-400 p-1.5 rounded transition-colors ml-auto md:ml-0 cursor-pointer"
              title={simulationMode === 'Completo' ? "Cancelar Questionário" : "Cancelar Simulado"}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="w-full bg-[#11212b] h-1.5">
          <div 
            className="bg-gradient-to-r from-[#66d9cc] to-[#E9C349] h-full transition-all duration-300"
            style={{ width: currentQuiz?.interactiveHtml ? '100%' : `${((currentQuestionIdx + 1) / activeQuestions.length) * 100}%` }}
          />
        </div>

        {/* Main interactive area */}
        <div className="p-6 md:p-8 flex-1 space-y-6">
          {!showResultPanel ? (
            currentQuiz?.interactiveHtml ? (
              <div className="space-y-6 animate-fadeIn">
                <div className="bg-white border border-[#1c2c36] rounded-xl overflow-hidden shadow-inner">
                  <iframe
                    title="Módulo Interativo"
                    srcDoc={currentQuiz.interactiveHtml}
                    sandbox="allow-scripts allow-same-origin allow-modals allow-popups"
                    className="w-full h-[520px] bg-white border-none rounded-lg"
                  />
                </div>

                <div className="bg-[#0c1d27] border border-[#1c2c36] p-5 rounded-xl space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <h4 className="font-sans font-bold text-sm text-[#E9C349]">Painel de Controle e Autoavaliação</h4>
                      <p className="text-[11px] text-[#9cbfd5] leading-relaxed mt-0.5">
                        Interaja com o simulador acima. Ao concluir todas as etapas, registre seu progresso e sua autoavaliação de acertos para homologação.
                      </p>
                    </div>
                    <div className="bg-[#04141d] px-3 py-2 rounded-lg border border-[#1c2c36] text-center shrink-0 min-w-[120px]">
                      <span className="text-[9px] font-mono text-[#99907c] uppercase block">Desempenho</span>
                      <strong className="text-base font-extrabold text-[#66d9cc] font-mono">{interactiveSelfScore}%</strong>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row items-center gap-4 bg-[#04141d] p-4 rounded-xl border border-[#1c2c36]/70">
                    <div className="w-full space-y-1 text-left">
                      <label className="font-mono text-[10px] text-[#99907c] uppercase font-bold block">
                        Nota Autoavaliada / Aproveitamento (0% a 100%)
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          step="5"
                          value={interactiveSelfScore}
                          onChange={(e) => setInteractiveSelfScore(Number(e.target.value))}
                          className="w-full accent-[#E9C349] bg-[#0c1d27] rounded-lg h-1.5 cursor-pointer"
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => handleCompleteInteractiveQuiz(interactiveSelfScore)}
                      className="w-full md:w-auto md:min-w-[220px] bg-[#E9C349] text-[#241a00] hover:bg-[#ffe088] font-sans font-extrabold text-xs uppercase py-3 px-5 rounded-lg tracking-wider active:scale-95 transition-all text-center cursor-pointer shadow"
                    >
                      Gravar Nota e Concluir
                    </button>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] font-mono text-[#99907c] bg-[#04141d]/40 p-2.5 rounded border border-[#1c2c36]/40">
                    <Info className="w-4 h-4 text-[#66d9cc] shrink-0" />
                    <span>
                      Dica técnica: Se o simulador interativo possuir envio programático de nota (chamando window.parent.postMessage com type "quiz-finished" e score correspondente), ele registrará seu desempenho de forma 100% automatizada.
                    </span>
                  </div>
                </div>
              </div>
            ) : activeQuestions.length > 0 && activeQuestion ? (
              <div className="space-y-6">
                {/* Visual Category badge */}
                <div className="inline-flex items-center gap-1.5 text-[8px] font-mono leading-none bg-[#11212b] text-[#66d9cc] border border-[#1c2c36] px-3 py-1.5 rounded-full uppercase tracking-wider font-bold">
                  <HelpCircle className="w-2.5 h-2.5" />
                  {activeQuestion.category}
                </div>

                {/* Substantial Question Card */}
                <div className="bg-[#0c1d27] border-l-4 border-[#E9C349] rounded-r-xl rounded-l-md p-5 md:p-6 shadow-inner relative">
                  <span className="absolute -top-3.5 right-4 font-mono font-bold text-4xl text-[#1c2c36] select-none pointer-events-none">
                    #{currentQuestionIdx + 1}
                  </span>
                  <h3 className="font-sans font-bold text-base md:text-lg text-[#d4e5f2] leading-relaxed relative z-10">
                    {activeQuestion.questionText}
                  </h3>
                </div>

                {/* Alternatives List or Free text input */}
                {activeQuestion.isFreeResponse ? (
                  <div className="space-y-3 animate-fadeIn">
                    <label className="font-mono text-[10px] text-[#E9C349] uppercase tracking-wider font-extrabold block">
                      Sua Resposta Escrita (Resposta Livre)
                    </label>
                    <textarea
                      value={String(questionSelectedAnswer || '')}
                      onChange={(e) => {
                        const val = e.target.value;
                        setUserSelectedAnswers(prev => ({
                          ...prev,
                          [currentQuestionIdx]: val
                        }));
                        setActiveSelectionIdx(val.trim() !== '' ? 0 : null);
                      }}
                      disabled={isFeedbackDoneForQuestion}
                      className="w-full bg-[#04141d] text-xs text-white border border-[#1c2c36] p-4 rounded-xl focus:outline-none min-h-[140px] focus:border-[#E9C349] transition-all placeholder-[#99907c]/50"
                      placeholder="Espaço para digitar livremente sobre a questão proposta..."
                    />
                    <p className="text-[10px] text-[#99907c] font-mono leading-relaxed mt-1">
                      💡 Esta questão permite resposta livre. Digite sua resposta livremente no campo acima para que ela seja pontuada e integrada à planilha.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    {activeQuestion.options.map((option, idx) => {
                      const letters = ['A', 'B', 'C', 'D'];
                      const isSelectedVal = questionSelectedAnswer === idx;
                      const isCorrectAnswer = idx === activeQuestion.correctOptionIndex;

                      // Compute options styling depending on current simulation mode (study response / regular)
                      let borderClass = 'border-[#1c2c36] hover:border-[#66d9cc]/40 bg-[#0c1d27]/45 hover:bg-[#0c1d27]/85';
                      let badgeClass = 'bg-[#11212b] text-[#99907c] border-[#1c2c36]';
                      let textClass = 'text-[#a5b8c7]';

                      if (isSelectedVal) {
                        borderClass = 'border-[#E9C349] bg-[#E9C349]/5 hover:bg-[#E9C349]/10';
                        badgeClass = 'bg-[#E9C349]/20 text-[#E9C349] border-[#E9C349]/40';
                        textClass = 'text-white font-medium';
                      }

                      // Strict Study-Feedback mode coloring once response is validated
                      if (isFeedbackDoneForQuestion) {
                        if (isCorrectAnswer) {
                          borderClass = 'border-emerald-500/80 bg-emerald-950/15';
                          badgeClass = 'bg-emerald-500 text-white border-emerald-500';
                          textClass = 'text-emerald-300 font-medium';
                        } else if (isSelectedVal) {
                          borderClass = 'border-rose-500/80 bg-rose-950/15';
                          badgeClass = 'bg-rose-500 text-white border-rose-500';
                          textClass = 'text-rose-300';
                        } else {
                          borderClass = 'border-[#1c2c36] bg-[#0c1d27]/20 opacity-55';
                          badgeClass = 'bg-[#11212b]/60 text-[#99907c]/65 border-[#1c2c36]/60';
                          textClass = 'text-[#a5b8c7]/65';
                        }
                      }

                      return (
                        <button
                          key={idx}
                          onClick={() => handleSelectOptionDraft(idx)}
                          disabled={isFeedbackDoneForQuestion}
                          className={`w-full rounded-xl border p-4 transition-all duration-200 cursor-pointer flex items-start gap-4 text-left ${borderClass}`}
                        >
                          <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-mono font-extrabold text-xs shrink-0 border uppercase ${badgeClass}`}>
                            {letters[idx]}
                          </span>
                          <div className={`text-xs md:text-sm pt-0.5 leading-relaxed ${textClass}`}>
                            {option}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Show immediate validation check explanations in study mode */}
                {isFeedbackDoneForQuestion && (
                  <div className="bg-[#11212b] border border-[#1c2c36] rounded-xl p-4 md:p-5 mt-4 space-y-2 animate-fadeIn text-xs leading-relaxed">
                    <div className="flex items-center gap-2 font-mono font-bold text-[10px] uppercase tracking-wider">
                      {activeQuestion.isFreeResponse ? (
                        <div className="text-emerald-400 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Resposta Registrada (Livre)
                        </div>
                      ) : questionSelectedAnswer === activeQuestion.correctOptionIndex ? (
                        <div className="text-emerald-400 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Alternativa Correta
                        </div>
                      ) : (
                        <div className="text-rose-400 flex items-center gap-1">
                          <X className="w-3.5 h-3.5" /> Alternativa Incorreta
                        </div>
                      )}
                    </div>
                    {activeQuestion.explanation && (
                      <p className="text-[#a5b8c7] font-sans">
                        <strong className="text-white font-mono font-semibold">Gabarito Comentado:</strong> {activeQuestion.explanation}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ) : null
          ) : (
            // Results evaluation Panel
            finishedAttempt && (
              <div className="space-y-8 py-4 animate-fade-in text-center max-w-2xl mx-auto">
                <div className="space-y-3">
                  <div className="w-20 h-20 rounded-full bg-[#11212b] flex items-center justify-center mx-auto border-2 border-[#E9C349]/40 relative">
                    {finishedAttempt.approved ? (
                      <Trophy className="w-10 h-10 text-[#E9C349]" />
                    ) : (
                      <Award className="w-10 h-10 text-[#99907c] opacity-50" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-sans font-black text-xl text-white">
                      {finishedAttempt.approved ? '🎉 Parabéns, meu Amado Irmão!' : 'Obreiro em Estudos'}
                    </h3>
                    <p className="text-xs font-mono text-[#9cbfd5] max-w-md mx-auto mt-1 leading-relaxed">
                      {finishedAttempt.approved 
                        ? `Você foi aprovado com sucesso nas instruções do ${finishedAttempt.simulationMode === 'Completo' ? 'Questionário Oficial' : 'Simulado'} do ${finishedAttempt.questionnaireTitle}.`
                        : `Sua performance atingiu o limite de aprendizados para o ${finishedAttempt.simulationMode === 'Completo' ? 'Questionário Oficial' : 'Simulado'} do ${finishedAttempt.questionnaireTitle}. Continue a lapidação da Pedra Bruta!`}
                    </p>
                  </div>
                </div>

                {/* Statistics Circle card layout */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-[#0c1d27] border border-[#1c2c36] rounded-xl p-4 text-center">
                    <span className="text-[9px] font-mono font-bold text-[#99907c] uppercase tracking-wider block">Nota do Exame</span>
                    <strong className={`text-2xl font-black block mt-1.5 ${finishedAttempt.approved ? 'text-[#e9c349]' : 'text-rose-400'}`}>
                      {Math.round(finishedAttempt.scorePercentage)}%
                    </strong>
                    <span className="text-[8px] font-mono text-[#99907c] block mt-1">Mínimo: {currentQuiz?.approvalScore}%</span>
                  </div>

                  <div className="bg-[#0c1d27] border border-[#1c2c36] rounded-xl p-4 text-center">
                    <span className="text-[9px] font-mono font-bold text-[#99907c] uppercase tracking-wider block">Acertos Totais</span>
                    <strong className="text-2xl font-black text-white block mt-1.5">
                      {finishedAttempt.correctAnswersCount}
                    </strong>
                    <span className="text-[8px] font-mono text-[#9a9280] block mt-1">de {finishedAttempt.totalQuestionsCount} questões</span>
                  </div>

                  <div className="bg-[#0c1d27] border border-[#1c2c36] rounded-xl p-4 text-center">
                    <span className="text-[9px] font-mono font-bold text-[#99907c] uppercase tracking-wider block">Tempo Decorrido</span>
                    <strong className="text-2xl font-black text-[#66d9cc] block mt-1.5 font-mono">
                      {formatTime(finishedAttempt.timeSpentSeconds)}
                    </strong>
                    <span className="text-[8px] font-mono text-[#9cbfd5] block mt-1">Ritmo constante</span>
                  </div>

                  <div className="bg-[#0c1d27] border border-[#1c2c36] rounded-xl p-4 text-center col-span-2 sm:col-span-1">
                    <span className="text-[9px] font-mono font-bold text-[#99907c] uppercase tracking-wider block">Status Moral</span>
                    <div className="mt-2.5">
                      <span className={`inline-block text-[9px] font-mono font-bold py-1 px-3.5 rounded-full border ${
                        finishedAttempt.approved 
                          ? 'bg-[#185347]/20 border-[#26a69a]/40 text-[#66d9cc]' 
                          : 'bg-rose-950/20 border-rose-900/40 text-rose-400'
                      }`}>
                        {finishedAttempt.approved ? 'APROVADO' : 'EXAME DE REVISÃO'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Submitting Certificate action blocks */}
                {finishedAttempt.approved && (isGlobalAdmin || finishedAttempt.simulationMode === 'Completo') && (
                  <div className="bg-gradient-to-r from-[#E9C349]/15 via-[#0c1d27] to-[#E9C349]/5 border-2 border-[#E9C349] rounded-2xl p-6 text-left md:flex md:items-center justify-between gap-6 space-y-4 md:space-y-0 shadow-[0_0_15px_rgba(233,195,73,0.15)]">
                    <div className="space-y-1.5 md:max-w-md">
                      <h4 className="font-sans font-extrabold text-base text-[#E9C349] flex items-center gap-2 uppercase tracking-wider">
                        <Award className="w-6 h-6 text-[#E9C349] drop-shadow-[0_0_6px_rgba(233,195,73,0.5)]" /> Certificado Disponível!
                      </h4>
                      <p className="text-[11px] text-[#d4e5f2] leading-relaxed">
                        Parabéns pela sua excelente performance! Sua aprovação qualifica você para obter o certificado oficial.
                      </p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                      {/* New View Certificate local button */}
                      <button
                        type="button"
                        onClick={() => {
                          if (onOpenCertificate) {
                            const userName = finishedAttempt.userName || currentUser?.name || 'Membro';
                            const dateStr = finishedAttempt.dateTime ? finishedAttempt.dateTime.split(',')[0] : new Date().toLocaleDateString('pt-BR');
                            const scoreVal = `${Math.round(finishedAttempt.scorePercentage)}%`;
                            const gradeLabel = currentQuiz?.degreeRequired ? `Grau ${currentQuiz.degreeRequired}` : undefined;
                            onOpenCertificate(userName, finishedAttempt.questionnaireTitle, 'quiz', dateStr, scoreVal, gradeLabel);
                          }
                        }}
                        className="px-6 py-3 rounded-xl text-xs font-sans font-extrabold uppercase transition-all flex items-center justify-center gap-2 cursor-pointer bg-[#E9C349] hover:bg-[#ffe088] text-[#241a00] hover:shadow-[0_0_12px_rgba(233,195,73,0.4)] active:scale-95 text-center select-none font-bold border-none"
                      >
                        <Award className="w-4 h-4 fill-current" /> Obter Certificado
                      </button>
                    </div>
                  </div>
                )}

                {/* Detailed Questions Review Accordion */}
                <div className="space-y-3 pt-4 text-left">
                  <h4 className="font-sans font-bold text-xs text-[#d4e5f2] uppercase tracking-wider font-mono">
                    Conferência Completa de Enunciados
                  </h4>
                  
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                    {activeQuestions.map((q, idx) => {
                      const ans = userSelectedAnswers[idx];
                      const isCorrect = q.isFreeResponse 
                        ? (ans !== undefined && String(ans).trim() !== '')
                        : (ans !== undefined && ans === q.correctOptionIndex);
                      
                      return (
                        <div key={idx} className="bg-[#0c1d27]/40 border border-[#1c2c36]/70 rounded-xl p-3.5 space-y-2">
                          <div className="flex items-start gap-2.5">
                            <span className="mt-0.5 shrink-0">
                              {isCorrect ? (
                                <Check className="w-4 h-4 text-emerald-400" />
                              ) : (
                                <X className="w-4 h-4 text-rose-400" />
                              )}
                            </span>
                            <div>
                              <p className="text-xs font-bold text-[#d4e5f2] leading-relaxed">
                                {idx + 1}. {q.questionText}
                              </p>
                              <p className="text-[10px] font-mono text-[#99907c] mt-1.5">
                                Sua Resposta: <span className={isCorrect ? 'text-emerald-400' : 'text-rose-400 font-semibold'}>
                                  {q.isFreeResponse ? (ans ? String(ans) : 'Nenhuma') : (q.options[ans as number] || 'Nenhuma')}
                                </span>
                              </p>
                              {!isCorrect && !q.isFreeResponse && (
                                <p className="text-[10px] font-mono text-[#66d9cc] mt-0.5">
                                  Gabarito: <span className="font-semibold">{q.options[q.correctOptionIndex]}</span>
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )
          )}
        </div>

        {/* Floating actions footer */}
        <div className="bg-[#081721] p-5 border-t border-[#1c2c36] flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="font-mono text-[9px] text-[#99907c]">
            Masonic Academy Simulator
          </span>

          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            {!showResultPanel ? (
              <>
                {showSendEarlyConfirm ? (
                  <div className="flex flex-col sm:flex-row items-center gap-3 bg-[#0d212d] border border-[#E9C349]/40 p-3 rounded-xl text-left max-w-md w-full sm:w-auto">
                    <span className="text-[10px] text-[#d4e5f2] leading-tight font-sans">
                      Deseja mesmo enviar? Questões não respondidas serão computadas como incorretas.
                    </span>
                    <div className="flex gap-2 w-full sm:w-auto shrink-0 justify-end mt-2 sm:mt-0">
                      <button
                        type="button"
                        onClick={() => setShowSendEarlyConfirm(false)}
                        className="text-[10px] uppercase font-bold text-[#9cbfd5] hover:text-white px-3 py-2 rounded-lg bg-[#1c2c36] hover:bg-[#253945] transition-colors cursor-pointer"
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          setShowSendEarlyConfirm(false);
                          await handleFinishSimulation();
                        }}
                        className="text-[10px] uppercase font-bold bg-[#E9C349] text-[#241a00] hover:bg-yellow-400 px-3 py-2 rounded-lg transition-all active:scale-95 cursor-pointer"
                      >
                        Confirmar e Enviar
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {activeQuestions.length > 10 && currentQuestionIdx < activeQuestions.length - 1 && (
                      <button
                        type="button"
                        onClick={() => setShowSendEarlyConfirm(true)}
                        className="bg-transparent text-[#E9C349] hover:bg-[#E9C349]/10 font-sans font-extrabold text-[11px] uppercase px-4 py-2.5 rounded-lg border border-[#E9C349]/40 hover:border-[#E9C349] transition-all w-full sm:w-auto text-center cursor-pointer"
                      >
                        Enviar sem responder tudo
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={handleConfirmNextStep}
                      className="bg-[#E9C349] text-[#241a00] font-sans font-extrabold text-[11px] uppercase px-6 py-2.5 rounded-lg active:scale-95 transition-all w-full sm:w-auto tracking-wider text-center cursor-pointer font-bold"
                    >
                      {currentQuestionIdx === activeQuestions.length - 1 
                        ? (simulationMode === 'Completo' ? 'Finalizar Questionário' : 'Finalizar Simulado') 
                        : 'Próxima Questão'}
                    </button>
                  </>
                )}
              </>
            ) : (
              <button
                type="button"
                onClick={() => setIsSimulationRunning(false)}
                className="bg-[#11212b] text-[#d4e5f2] font-mono text-[10px] uppercase px-6 py-2.5 rounded-md border border-[#1c2c36] hover:bg-[#1c2c36] transition-all w-full sm:w-auto text-center cursor-pointer"
              >
                Retornar ao Menu
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left relative max-w-7xl mx-auto">
      {/* Toast Alert logs */}
      {statusMessage && (
        <div className={`fixed top-16 right-4 z-50 p-4 rounded-xl border shadow-xl flex items-center gap-2 text-xs font-semibold animate-slide-in ${
          statusMessage.type === 'success' 
            ? 'bg-[#185347]/90 border-[#26a69a] text-[#66d9cc]' 
            : 'bg-rose-950/90 border-rose-900 text-rose-300'
        }`}>
          <Info className="w-4 h-4 shrink-0" />
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* ADMIN OR STUDENT VIEW SPLITTER CONTROLLER */}
      {!isAdminMode ? (
        // ==========================================
        //  STUDENT ACTIVE EVALUATION VIEW
        // ==========================================
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Left instructions block */}
          <div className="md:col-span-7 bg-[#0c1d27] rounded-xl p-5 border border-[#1c2c36] space-y-6 shadow-md animate-fade-in">
            <div className="flex items-center gap-3 border-b border-[#1c2c36] pb-4">
              <div className="p-2.5 bg-[#D4AF37]/10 border border-[#D4AF37]/35 rounded-lg">
                <Sliders className="w-5 h-5 text-[#E9C349]" />
              </div>
              <div>
                <span className="text-[9px] font-mono text-[#66d9cc] uppercase tracking-wider font-bold">ESTUDO ATIVO</span>
                <h3 className="font-sans font-bold text-base text-[#d4e5f2] tracking-wide">
                  Questionário de Avaliação
                </h3>
              </div>
            </div>

            <p className="text-xs text-[#9cbfd5] leading-relaxed">
              Avalie o seu aprendizado com as instruções do grau do Rito Adonhiramita de forma dinâmica, com modo estudo para revisão detalhada antes da outorga de diplomas.
            </p>

            {/* Simulated Statistics Panel */}
            <div className="grid grid-cols-3 gap-3 bg-[#04141d] rounded-lg p-3.5 border border-[#1c2c36]/80 text-center shadow-inner">
              <div className="space-y-0.5">
                <span className="text-[8px] font-mono text-[#99907c] uppercase tracking-wider block">Melhor Nota</span>
                <strong className="text-base font-extrabold text-[#E9C349] block font-mono">{bestScore}</strong>
              </div>
              <div className="space-y-0.5 border-x border-[#1c2c36]/90">
                <span className="text-[8px] font-mono text-[#99907c] uppercase tracking-wider block">Pontos Máximos</span>
                <strong className="text-base font-extrabold text-white block font-sans">{maxCorrect}</strong>
              </div>
              <div className="space-y-0.5">
                <span className="text-[8px] font-mono text-[#99907c] uppercase tracking-wider block">Simulações</span>
                <strong className="text-base font-extrabold text-[#66d9cc] block font-mono">{simulationsCount}</strong>
              </div>
            </div>

            {/* AJUSTES DE OFICINA SELECTORS */}
            <div className="space-y-4 bg-[#04141d]/50 p-4 rounded-xl border border-[#1c2c36]/70">
              <span className="text-[10px] font-mono text-[#E9C349] font-black uppercase tracking-widest block">
                ◆ Ajustes de Oficina
              </span>

              {/* Questionnaire list selector */}
              <div className="space-y-2">
                <label className="text-[10.5px] font-mono text-[#99907c] block uppercase font-bold">
                  Selecionar Questionário / Livro de Estudos
                </label>
                {!isGlobalAdmin && isCurrentQuizTiedToCourse ? (
                  <select
                    disabled
                    value={selectedQuizId}
                    className="w-full bg-[#04141d]/50 text-xs text-[#99907c] border border-[#1c2c36]/60 py-2.5 px-3 rounded-lg font-mono cursor-not-allowed opacity-75"
                  >
                    <option value={selectedQuizId}>
                      {currentQuiz?.title} (Grau Requerido: {currentQuiz?.degreeRequired || 1}) — ({currentQuiz?.questions.length} questões)
                    </option>
                  </select>
                ) : (
                  <select
                    value={selectedQuizId}
                    onChange={(e) => setSelectedQuizId(e.target.value)}
                    className="w-full bg-[#04141d] text-xs text-[#d4e5f2] border border-[#1c2c36] hover:border-[#66d9cc]/40 py-2.5 px-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#E9C349] font-mono"
                  >
                    {questionnaires
                      .filter(q => q.status !== 'Inativo')
                      .filter(q => {
                        if (isGlobalAdmin) return true;
                        // For students, hide questionnaires that are linked/tied to a course, 
                        // unless it is the currently selected one itself.
                        const isTied = reports ? reports.some(r => r.linkedQuestionnaireId === q.id) : false;
                        return !isTied || q.id === selectedQuizId;
                      })
                      .map(q => (
                        <option key={q.id} value={q.id}>
                          {q.title} (Grau Requerido: {q.degreeRequired || 1}) — ({q.questions.length} questões)
                        </option>
                      ))}
                  </select>
                )}
              </div>

              {/* Simulation Mode button-group Selection */}
              <div className="space-y-2">
                <label className="text-[10.5px] font-mono text-[#99907c] block uppercase font-bold">
                  Modo de Simulação
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Completo', 'Amostra', 'Por Tema'] as const).map(mode => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setSimulationMode(mode)}
                      className={`py-2 px-1 text-[10px] font-mono font-bold tracking-wider rounded border cursor-pointer select-none transition-all ${
                        simulationMode === mode
                          ? 'border-[#E9C349] bg-[#E9C349]/15 text-[#E9C349]'
                          : 'border-[#1c2c36] text-[#99907c] bg-[#04141d] hover:text-[#d4e5f2] hover:bg-[#11212b]'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>

                {/* Info Text explanation helper */}
                <div className="text-[9.5px] font-mono text-[#9cbfd5] leading-relaxed pt-1 flex items-start gap-1.5">
                  <Info className="w-3.5 h-3.5 text-[#E9C349] shrink-0 mt-0.5" />
                  <span>
                    {simulationMode === 'Completo' && `No questionário oficial você irá praticar todas as ${currentQuiz?.questions.length || 0} questões do banco de dados. Perfeito para auto-exame.`}
                    {simulationMode === 'Amostra' && `No simulado de amostra você responderá uma seleção rápida de ${studyQuestionsCount} questões de forma aleatória, ideal para treinos rápidos diários.`}
                    {simulationMode === 'Por Tema' && 'Escolha responder apenas questões filtradas abaixo por uma determinada área temática da instrução do grau.'}
                  </span>
                </div>
              </div>

              {/* Optional size selector if amostra mode is selected */}
              {simulationMode === 'Amostra' && (
                <div className="space-y-2 animate-fadeIn pt-1">
                  <label className="text-[10.5px] font-mono text-[#99907c] block uppercase font-bold">
                    Quantidade de Questões (Amostra de Estudo)
                  </label>
                  <div className="flex gap-2">
                    {([10, 20] as const).map(size => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setStudyQuestionsCount(size)}
                        className={`flex-1 py-1.5 px-3 text-xs font-mono font-bold tracking-wider rounded border cursor-pointer select-none transition-all ${
                          studyQuestionsCount === size
                            ? 'border-[#E9C349] bg-[#E9C349]/15 text-[#E9C349]'
                            : 'border-[#1c2c36] text-[#99907c] bg-[#04141d] hover:text-[#d4e5f2] hover:bg-[#11212b]'
                        }`}
                      >
                        {size} Questões
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Optional category selector if theme mode selected */}
              {simulationMode === 'Por Tema' && questionnaireThemes.length > 0 && (
                <div className="space-y-2 animate-fadeIn pt-1">
                  <label className="text-[10px] font-mono text-[#99907c] block uppercase font-bold">
                    Selecionar Categoria Temática
                  </label>
                  <select
                    value={selectedTheme}
                    onChange={(e) => setSelectedTheme(e.target.value)}
                    className="w-full bg-[#04141d] text-xs text-[#d4e5f2] border border-[#1c2c36] hover:border-[#66d9cc]/40 py-2.5 px-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#E9C349] font-mono"
                  >
                    {questionnaireThemes.map((theme, i) => (
                      <option key={i} value={theme}>{theme}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {/* Shuffle toggle */}
                <label className="flex items-center gap-3 bg-[#04141d] border border-[#1c2c36]/90 rounded-lg p-3 cursor-pointer hover:border-[#1c2c36] select-none">
                  <input
                    type="checkbox"
                    checked={shuffleQuestions}
                    onChange={(e) => setShuffleQuestions(e.target.checked)}
                    className="rounded bg-[#04141d] border-[#1c2c36] text-[#E9C349] focus:ring-0 focus:ring-offset-0 focus:outline-none cursor-pointer"
                  />
                  <div className="text-left">
                    <span className="text-[10.5px] font-mono font-bold text-[#d4e5f2] block leading-tight">Embaralhar Perguntas</span>
                    <span className="text-[9px] font-mono text-[#99907c]">Tornar a ordem dinâmica</span>
                  </div>
                </label>

                {/* Study mode toggle */}
                <label className="flex items-center gap-3 bg-[#04141d] border border-[#1c2c36]/90 rounded-lg p-3 cursor-pointer hover:border-[#1c2c36] select-none">
                  <input
                    type="checkbox"
                    checked={studyModeFeedback}
                    onChange={(e) => setStudyModeFeedback(e.target.checked)}
                    className="rounded bg-[#04141d] border-[#1c2c36] text-[#E9C349] focus:ring-0 focus:ring-offset-0 focus:outline-none cursor-pointer"
                  />
                  <div className="text-left">
                    <span className="text-[10.5px] font-mono font-bold text-[#d4e5f2] block leading-tight">Modo Estudo (Feedback)</span>
                    <span className="text-[9px] font-mono text-[#99907c]">Ver gabarito a cada resposta</span>
                  </div>
                </label>
              </div>

              {/* Access Check and Start Button */}
              {isAccessBlocked ? (
                <div className="space-y-3 pt-2">
                  <div id="access-blocked-warning" className="flex items-start gap-2.5 bg-rose-950/40 border border-rose-900/60 text-rose-300 p-3 rounded-lg text-[11px] leading-relaxed font-mono">
                    <Shield className="w-4 h-4 text-rose-400 shrink-0 mt-0.5 animate-pulse" />
                    <span>
                      <strong className="text-rose-400">Acesso Restrito ao Grau:</strong> este material ainda não é do seu Grau.
                    </span>
                  </div>
                  <button
                    id="btn-iniciar-simulado-bloqueado"
                    type="button"
                    disabled
                    className="w-full bg-[#1c2c36] text-[#99907c] font-sans font-extrabold text-xs uppercase py-3.5 rounded-lg tracking-widest cursor-not-allowed flex items-center justify-center gap-2 opacity-60 shadow-md select-none border-none"
                  >
                    <Shield className="w-4 h-4 text-rose-400" /> Requer {getDegreeLabel(requiredLevel)}
                  </button>
                </div>
              ) : (
                <div className="space-y-3 pt-1">
                  {currentQuiz?.interactiveHtml && (
                    <div className="flex items-start gap-2.5 bg-[#66d9cc]/10 border border-[#66d9cc]/30 text-[#83f7eb] p-3 rounded-lg text-[10.5px] leading-relaxed font-mono">
                      <Sparkles className="w-4 h-4 text-[#66d9cc] shrink-0 mt-0.5 animate-pulse" />
                      <span>
                        Este questionário possui um <strong>Módulo Interativo de Autoavaliação HTML</strong>. A atividade tradicional de múltipla escolha será substituída por um simulador integrado dinâmico.
                      </span>
                    </div>
                  )}
                  <button
                    id="btn-iniciar-simulado"
                    type="button"
                    onClick={handleStartSimulation}
                    className="w-full bg-[#E9C349] text-[#241a00] font-sans font-extrabold text-xs uppercase py-3.5 rounded-lg hover:bg-[#ffe088] tracking-widest active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 select-none shadow-md font-bold"
                  >
                    <Play className="w-4 h-4 fill-current" /> {currentQuiz?.interactiveHtml ? 'Iniciar Atividade Interativa' : (simulationMode === 'Completo' ? 'Iniciar Questionário Oficial' : 'Iniciar Simulado Ativo')}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Side: History logs or general requirements */}
          <div className="md:col-span-5 space-y-6">
            {/* Enter Admin area shortcut (Only for Masters / Admins!) */}
            {isGlobalAdmin && (
              <div className="bg-[#0c1d27] border border-[#1c2c36] rounded-xl p-5 text-center space-y-4 shadow-md animate-fade-in">
                <Shield className="w-8 h-8 text-[#66d9cc] mx-auto opacity-75" />
                <div className="space-y-1">
                  <h4 className="font-sans font-bold text-sm text-[#d4e5f2]">Painel de Instrução do Simulado</h4>
                  <p className="text-[10px] text-[#99907c] max-w-xs mx-auto leading-relaxed">
                    Você possui privilégios de Administrador. Acesse a área administrativa para cadastrar, editar, duplicar cadernos de simulados e conferir dados.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAdminMode(true)}
                  className="bg-[#11212b] text-[#66d9cc] border border-[#26a69a]/40 text-[10px] font-mono uppercase font-bold py-2 px-5 rounded-md hover:bg-[#1c2c36] cursor-pointer transition-colors active:scale-95 text-center"
                >
                  🔑 Acessar Área Administrativa
                </button>
              </div>
            )}

            {/* Attempts Study Ledger */}
            <div className="bg-[#0c1d27] rounded-xl p-5 border border-[#1c2c36] space-y-4 shadow-md">
              <span className="text-[9.5px] font-mono text-[#99907c] block uppercase tracking-wider font-extrabold pb-1.5 border-b border-[#1c2c36]/60">
                ◆ Histórico de Avaliações
              </span>

              {currentQuizAttempts.length === 0 ? (
                <div className="py-8 text-center space-y-2 text-[#99907c] font-mono text-[10px]">
                  <HelpCircle className="w-8 h-8 mx-auto opacity-20" />
                  <p>Nenhuma simulação anterior registrada para este caderno.</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[290px] overflow-y-auto pr-1">
                  {currentQuizAttempts.slice(0, 5).map((log, i) => (
                    <div key={i} className="bg-[#04141d] border border-[#1c2c36] rounded-lg p-3 text-xs flex justify-between items-center gap-4 transition-all">
                      <div className="space-y-1">
                        <div className="font-mono text-[10px] text-[#9cbfd5] font-bold">
                          {log.simulationMode} — {log.dateTime.split(' ')[0]}
                        </div>
                        <div className="text-[9px] font-mono text-[#99907c]">
                          Acertos: {log.correctAnswersCount}/{log.totalQuestionsCount} ({Math.round(log.scorePercentage)}%) • Tempo: {formatTime(log.timeSpentSeconds)}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {log.approved && (
                          <button
                            type="button"
                            onClick={() => {
                              if (onOpenCertificate) {
                                const userName = log.userName || currentUser?.name || 'Membro';
                                const dateStr = log.dateTime ? log.dateTime.split(',')[0] : new Date().toLocaleDateString('pt-BR');
                                const scoreVal = `${Math.round(log.scorePercentage)}%`;
                                const gradeLabel = currentQuiz?.degreeRequired ? `Grau ${currentQuiz.degreeRequired}` : undefined;
                                onOpenCertificate(userName, log.questionnaireTitle, 'quiz', dateStr, scoreVal, gradeLabel);
                              }
                            }}
                            className="bg-[#E9C349]/10 text-[#E9C349] border border-[#E9C349]/30 hover:bg-[#E9C349]/20 hover:border-[#E9C349]/60 px-2.5 py-1 rounded text-[9px] font-sans font-extrabold uppercase transition-all flex items-center gap-1 cursor-pointer select-none"
                            title="Regerar Certificado"
                          >
                            <Award className="w-3.5 h-3.5" /> Regerar
                          </button>
                        )}
                        <span className={`inline-block text-[8px] font-mono py-0.5 px-2 rounded font-bold uppercase ${
                          log.approved 
                            ? 'bg-emerald-950/20 text-emerald-400 border border-emerald-900/40' 
                            : 'bg-rose-950/20 text-rose-400 border border-rose-900/40'
                        }`}>
                          {log.approved ? 'Aprovado' : 'Estudo'}
                        </span>
                      </div>
                    </div>
                  ))}
                  {currentQuizAttempts.length > 5 && (
                    <p className="text-center text-[9px] font-mono text-[#99907c] pt-2 italic">
                      ...exibindo os 5 registros mais recentes do histórico.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        // ==========================================
        //  ADMIN MANAGEMENT VIEW
        // ==========================================
        <div className="space-y-6 animate-fadeIn">
          {/* Top Admin Nav Buttons */}
          <div className="bg-[#0c1d27] border border-[#1c2c36] rounded-xl p-4 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm">
            <div>
              <span className="text-[9px] font-mono text-[#E9C349] uppercase tracking-widest font-black block">ÁREA ADMINISTRATIVA</span>
              <h3 className="font-sans font-black text-sm text-[#d4e5f2]">Administração do Simulado</h3>
            </div>

            <div className="flex items-center gap-1.5 w-full sm:w-auto shrink-0 justify-end">
              <button
                type="button"
                onClick={handleRestoreDefaults}
                className="bg-[#11212b] text-white hover:bg-rose-950/20 hover:text-rose-400 border border-[#1c2c36] px-3.5 py-1.5 rounded text-[10px] font-mono font-bold transition-all cursor-pointer flex items-center justify-center gap-1"
                title="Restaurar cadernos do modelo inicial"
              >
                <RotateCcw className="w-3 h-3" /> Restaurar Padrão
              </button>
              <button
                type="button"
                onClick={() => setIsAdminMode(false)}
                className="bg-[#E9C349] hover:bg-[#ffe088] text-[#241a00] px-4 py-1.5 rounded text-[10px] font-mono font-extrabold uppercase transition-all select-none cursor-pointer flex items-center justify-center gap-1"
              >
                Menu Principal
              </button>
            </div>
          </div>

          {/* Sub Tab Navigation */}
          <div className="flex border-b border-[#1c2c36] gap-2">
            <button
              type="button"
              onClick={() => setAdminSubTab('editor')}
              className={`py-2 px-4 text-xs font-mono font-bold uppercase transition-all border-b-2 cursor-pointer ${
                adminSubTab === 'editor'
                  ? 'border-[#E9C349] text-[#E9C349]'
                  : 'border-transparent text-[#99907c] hover:text-white'
              }`}
            >
              📝 Editor de Cadernos e Questões
            </button>
            <button
              type="button"
              onClick={() => setAdminSubTab('relatorio')}
              className={`py-2 px-4 text-xs font-mono font-bold uppercase transition-all border-b-2 cursor-pointer ${
                adminSubTab === 'relatorio'
                  ? 'border-[#E9C349] text-[#E9C349]'
                  : 'border-transparent text-[#99907c] hover:text-white'
              }`}
            >
              📊 Relatório de Notas (Questionários)
            </button>
          </div>

          {adminSubTab === 'editor' ? (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Left selector and list of questions */}
            <div className="md:col-span-5 bg-[#0c1d27] rounded-xl p-4 border border-[#1c2c36] space-y-4 shadow-md">
              {/* Questionnaire meta configuration input */}
              <div className="bg-[#04141d] rounded-lg p-3 border border-[#1c2c36] space-y-3">
                <div className="flex items-center justify-between border-b border-[#1c2c36] pb-2">
                  <span className="text-[9.5px] font-mono text-[#E9C349] font-bold uppercase tracking-wider">
                    Dossiê de Simulado Ativo
                  </span>
                  
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={handleCreateNewQuizBook}
                      className="text-[#66d9cc] hover:text-[#83f7eb] text-[9px] font-mono font-bold cursor-pointer"
                      title="Adicionar Novo Livro de Provas"
                    >
                      + Novo
                    </button>
                    <button
                      type="button"
                      onClick={handleDeleteQuizBook}
                      className="text-rose-400 hover:text-rose-300 text-[9px] font-mono font-bold cursor-pointer"
                      title="Excluir livro de provas atual"
                    >
                      Excluir
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  {/* Select controller */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono text-[#99907c] block uppercase whitespace-nowrap">SELECIONE CADERNO</label>
                    <select
                      value={adminSelectedQuizId}
                      onChange={(e) => {
                        setAdminSelectedQuizId(e.target.value);
                        setAdminSelectedQuestionId(null);
                      }}
                      className="w-full bg-[#04141d] text-[11px] text-[#d4e5f2] border border-[#1c2c36] py-1.5 px-2 rounded focus:outline-none font-mono"
                    >
                      {questionnaires.map(q => (
                        <option key={q.id} value={q.id}>{q.title}</option>
                      ))}
                    </select>
                  </div>

                  {/* Rename text input & slider score approval */}
                  {adminQuiz && (
                    <div className="space-y-3 pt-1 border-t border-[#1c2c36]/55">
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono text-[#99907c] block uppercase">EDITAR NOME DO QUESTIONÁRIO SELECIONADO</label>
                        <input
                          type="text"
                          value={adminNameInput}
                          onChange={(e) => setAdminNameInput(e.target.value)}
                          className="w-full bg-[#0c1d27] text-xs text-[#d4e5f2] border border-[#1c2c36] p-2 rounded focus:outline-none"
                          placeholder="Ex: Grau 1 - Aprendiz Maçom"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-mono text-[#99907c] block uppercase">NÍVEL DE ACESSO REQUERIDO (GRAU 1 A 33)</label>
                        <select
                          value={adminDegreeRequiredInput}
                          onChange={(e) => setAdminDegreeRequiredInput(parseInt(e.target.value, 10))}
                          className="w-full bg-[#0c1d27] text-xs text-[#d4e5f2] border border-[#1c2c36] p-2 rounded focus:outline-none font-mono"
                        >
                          {Array.from({ length: 33 }, (_, i) => i + 1).map((degree) => (
                            <option key={degree} value={degree}>
                              {getDegreeLabel(degree)}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-[9px] font-mono text-[#99907c]">
                          <span>NOTA DE APROVAÇÃO (%)</span>
                          <span className="text-[#E9C349] font-bold">{adminApprovalInput}%</span>
                        </div>
                        <input
                          type="range"
                          min="5"
                          max="95"
                          step="5"
                          value={adminApprovalInput}
                          onChange={(e) => setAdminApprovalInput(parseInt(e.target.value, 10))}
                          className="w-full accent-[#E9C349]"
                        />
                      </div>

                      <div className="space-y-1.5 pt-1 border-t border-[#1c2c36]/40">
                        <label className="flex items-start gap-2.5 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={adminOnlyFullForCertificateInput}
                            onChange={(e) => setAdminOnlyFullForCertificateInput(e.target.checked)}
                            className="mt-0.5 w-4 h-4 bg-[#04141d] border-[#1c2c36] rounded text-[#E9C349] focus:ring-0 cursor-pointer"
                          />
                          <div className="space-y-0.5">
                            <span className="text-[10px] font-mono font-bold text-[#d4e5f2] leading-tight block">
                              EMITIR CERTIFICADO APENAS PARA CONTEÚDO COMPLETO
                            </span>
                            <span className="text-[9px] text-[#9a9280] block leading-relaxed">
                              Se ativo e o irmão escolher as opções "Amostra" ou "por Tema", ao término do questionário será exibido apenas o feedback em tela.
                            </span>
                          </div>
                        </label>
                      </div>

                      <button
                        type="button"
                        onClick={handleUpdateQuizMeta}
                        className="w-full bg-[#11212b] text-[#E9C349] border border-[#E9C349]/35 hover:bg-[#1a2d3b] text-[9.5px] font-mono uppercase font-black py-1.5 rounded block cursor-pointer transition-colors"
                      >
                        Salvar Ajuste Master
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Filtering questions list */}
              <div className="space-y-3.5 pt-1 border-t border-[#1c2c36]/55">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#99907c] font-black uppercase tracking-wider">
                    PERGUNTAS CADASTRADAS ({adminFilteredQuestions.length})
                  </span>
                  <button
                    type="button"
                    onClick={handleStartCreateNewQuestion}
                    className="bg-[#66d9cc] text-[#02332e] text-[9.5px] font-mono font-bold px-2.5 py-1 rounded hover:bg-[#83f7eb] transition-colors flex items-center gap-1 cursor-pointer select-none border-none"
                  >
                    <Plus className="w-3 h-3" /> Adicionar
                  </button>
                </div>

                {/* Filter and quick search */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-[#99907c]" />
                    <input
                      type="text"
                      placeholder="Pesquisar..."
                      value={searchQuestionQuery}
                      onChange={(e) => setSearchQuestionQuery(e.target.value)}
                      className="bg-[#04141d] text-[10px] text-[#d4e5f2] border border-[#1c2c36] rounded py-2 pl-8 pr-2 w-full focus:outline-none"
                    />
                  </div>

                  <select
                    value={selectedCategoryFilter}
                    onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                    className="bg-[#04141d] text-[10px] text-[#d4e5f2] border border-[#1c2c36] rounded p-2 focus:outline-none font-mono"
                  >
                    <option value="Todas as Categorias">Todos os Temas</option>
                    {categoriesOfAdminQuiz.map((cat, idx) => (
                      <option key={idx} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Scrollable grid list */}
                <div className="space-y-1.5 max-h-[350px] overflow-y-auto pr-1">
                  {adminFilteredQuestions.length === 0 ? (
                    <div className="py-12 text-center text-[#99907c] font-mono text-[10px] bg-[#04141d] rounded-lg border border-dashed border-[#1c2c36]">
                      Sem perguntas cadastradas. Clique em "Adicionar" acima para começar.
                    </div>
                  ) : (
                    adminFilteredQuestions.map((q, index) => (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => handleSelectAdminQuestion(q.id)}
                        className={`w-full text-left rounded-lg p-3 text-xs border transition-all cursor-pointer block ${
                          adminSelectedQuestionId === q.id
                            ? 'border-[#E9C349] bg-[#E9C349]/5'
                            : 'border-[#1c2c36] hover:border-[#99907c]/30 bg-[#04141d]/70'
                        }`}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <span className="font-mono text-[9px] text-[#66d9cc] uppercase font-bold shrink-0">
                            Grau {adminQuiz?.degreeRequired} • Q#{index + 1}
                          </span>
                          <span className="text-[8px] font-mono bg-[#11212b] px-2 py-0.5 rounded border border-[#1c2c36] text-[#99907c]">
                            {q.category}
                          </span>
                        </div>
                        <p className="text-[#a5b8c7] font-sans mt-2 line-clamp-2">
                          {q.questionText || '(Nova Questão)'}
                        </p>
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Right Question Editing form Panel */}
            <div className="md:col-span-7 space-y-4">
              {adminSelectedQuestionId === null ? (
                <div className="bg-[#0c1d27]/40 rounded-xl p-16 border border-dashed border-[#1c2c36] text-center space-y-4 shadow-sm">
                  <SlidersHorizontal className="w-12 h-12 text-[#99907c] mx-auto opacity-40 animate-pulse" />
                  <div className="max-w-md mx-auto space-y-2">
                    <h3 className="font-sans font-bold text-sm text-[#d4e5f2]">Nenhuma Questão Selecionada</h3>
                    <p className="text-xs text-[#99907c] leading-relaxed">
                      Selecione uma pergunta cadastrada ao lado para revisar suas alternativas, gabaritos e anotações, ou clique em "Adicionar" para incluir.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-[#0c1d27] border border-[#1c2c36] rounded-xl overflow-hidden shadow-md animate-fadeIn text-xs text-left">
                  <div className="bg-[#04141d] p-4 border-b border-[#1c2c36] flex items-center justify-between">
                    <div>
                      <span className="text-[9px] font-mono text-[#66d9cc] uppercase font-bold tracking-wider">
                        Editor de Enunciados e Tópicos
                      </span>
                      <h4 className="font-sans font-bold text-white text-sm mt-0.5">
                        {adminSelectedQuestionId === 'NOT_SAVED_NEW_Q' ? 'Adicionando Nova Questão' : 'Editando Registro de Questão'}
                      </h4>
                    </div>

                    {adminSelectedQuestionId !== 'NOT_SAVED_NEW_Q' && (
                      <button
                        type="button"
                        onClick={() => handleDeleteQuestion(adminSelectedQuestionId)}
                        className="text-rose-400 hover:text-rose-300 p-1.5 hover:bg-rose-950/20 rounded cursor-pointer transition-colors"
                        title="Remover Questão permanentemente"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Form inputs */}
                  <div className="p-5 md:p-6 space-y-4">
                    {/* Question text */}
                    <div className="space-y-1.5">
                      <label className="font-mono text-[10px] text-[#99907c] uppercase font-bold block">Texto / Enunciado da Pergunta</label>
                      <textarea
                        value={editQuestionText}
                        onChange={(e) => setEditQuestionText(e.target.value)}
                        className="w-full bg-[#04141d] text-xs text-white border border-[#1c2c36] p-3 rounded-lg focus:outline-none min-h-[75px] max-h-[160px]"
                        placeholder="Ex: Qual o significado dos três degraus na entrada do templo?"
                      />
                    </div>

                    {/* Category thematic selection */}
                    <div className="space-y-1.5">
                      <label className="font-mono text-[10px] text-[#99907c] uppercase font-bold block">Tema / Categoria de Estudos</label>
                      <input
                        type="text"
                        value={editQuestionCategory}
                        onChange={(e) => setEditQuestionCategory(e.target.value)}
                        className="w-full bg-[#04141d] text-xs text-white border border-[#1c2c36] p-2.5 rounded-lg focus:outline-none"
                        placeholder="Ex: Ritualística e Símbolos, História, Filosofia..."
                      />
                    </div>

                    {/* Allow free response option */}
                    <div className="space-y-1.5 pt-2 border-t border-[#1c2c36]/40 flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="editIsFreeResponse"
                        checked={editIsFreeResponse}
                        onChange={(e) => setEditIsFreeResponse(e.target.checked)}
                        className="mt-1 w-4.5 h-4.5 bg-[#04141d] border-[#1c2c36] rounded text-[#E9C349] focus:ring-0 cursor-pointer"
                      />
                      <div className="space-y-1">
                        <label htmlFor="editIsFreeResponse" className="font-mono text-xs font-bold text-white cursor-pointer select-none">
                          Permitir resposta livre
                        </label>
                        <p className="text-[10px] text-[#9a907c] leading-relaxed">
                          Esta pergunta não conterá alternativas pré-definidas. O estudante digitará a resposta livremente usando um campo de digitação, e ela será considerada correta para pontuação e integrada à planilha.
                        </p>
                      </div>
                    </div>

                    {/* Grid options choices */}
                    {!editIsFreeResponse ? (
                      <div className="space-y-3.5 pt-2 border-t border-[#1c2c36]/40">
                        <label className="font-mono text-[10px] text-[#E9C349] uppercase tracking-wider font-extrabold block">
                          Alternativas de Respostas (4 Opções)
                        </label>
                        
                        <p className="text-[10px] text-[#99907c] font-mono leading-none">
                          Marque o círculo correspondente à alternativa correta (gabarito).
                        </p>

                        <div className="space-y-2.5">
                          {editQuestionOptions.map((opt, optIndex) => {
                            const letters = ['A', 'B', 'C', 'D'];
                            return (
                              <div key={optIndex} className="flex items-center gap-3">
                                <label className="flex items-center justify-center cursor-pointer select-none shrink-0" title="Definir como Gabarito Correto">
                                  <input
                                    type="radio"
                                    name="correctOptionRadio"
                                    checked={editCorrectOptionIdx === optIndex}
                                    onChange={() => setEditCorrectOptionIdx(optIndex)}
                                    className="w-4 h-4 bg-[#04141d] border-[#1c2c36] accent-[#E9C349] cursor-pointer"
                                  />
                                  <span className="ml-2 font-mono font-black text-xs text-[#99907c] bg-[#11212b] border border-[#1c2c36] rounded w-6 h-6 flex items-center justify-center uppercase">
                                    {letters[optIndex]}
                                  </span>
                                </label>

                                <input
                                  type="text"
                                  value={opt}
                                  onChange={(e) => {
                                    const copy = [...editQuestionOptions];
                                    copy[optIndex] = e.target.value;
                                    setEditQuestionOptions(copy);
                                  }}
                                  className="w-full bg-[#04141d] text-xs text-[#d4e5f2] border border-[#1c2c36] p-2.5 rounded-lg focus:outline-none placeholder-[#99907c]/70"
                                  placeholder={`Insira a alternativa da letra ${letters[optIndex]}`}
                                />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 bg-[#0c1d27]/60 border border-[#1c2c36]/40 rounded-xl space-y-1">
                        <p className="text-[10px] text-[#E9C349] font-mono font-bold uppercase tracking-wider block">
                          Modo Resposta Livre Ativo
                        </p>
                        <p className="text-[10px] text-[#9a907c] leading-relaxed">
                          Nenhuma alternativa de múltipla escolha é necessária para esta pergunta. O estudante visualizará apenas um campo de entrada de texto e qualquer resposta digitada será pontuada como correta.
                        </p>
                      </div>
                    )}

                    {/* Explanation */}
                    <div className="space-y-1.5 pt-2 border-t border-[#1c2c36]/40">
                      <label className="font-mono text-[10px] text-[#99907c] uppercase font-bold block">
                        Justificativa / Comentário Literário do Professor
                      </label>
                      <textarea
                        value={editQuestionExplanation}
                        onChange={(e) => setEditQuestionExplanation(e.target.value)}
                        className="w-full bg-[#04141d] text-xs text-white border border-[#1c2c36] p-3 rounded-lg focus:outline-none min-h-[60px]"
                        placeholder="Insira dados históricos, referências ou explicações complementares que serão exibidas em Modo Estudo."
                      />
                    </div>
                  </div>

                  {/* Actions save footer */}
                  <div className="bg-[#04141d] p-4 border-t border-[#1c2c36] flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setAdminSelectedQuestionId(null)}
                      className="bg-[#11212b] border border-[#1c2c36] text-[#99907c] hover:text-[#d4e5f2] px-4 py-2 rounded text-[10px] font-mono uppercase cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveQuestion}
                      className="bg-[#E9C349] text-[#241a00] hover:bg-[#ffe088] font-mono px-5 py-2 rounded text-[10px] font-extrabold uppercase transition-all active:scale-95 cursor-pointer"
                    >
                      Gravar Questão no Dossiê
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          ) : (
            // ==========================================
            //  GRADES REPORT VIEW
            // ==========================================
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-[#0c1d27] rounded-xl p-5 border border-[#1c2c36] space-y-4 shadow-md text-xs text-left">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#1c2c36]/60 pb-3">
                  <div>
                    <span className="text-[9px] font-mono text-[#E9C349] uppercase tracking-widest font-black block">DADOS DE DESEMPENHO</span>
                    <h4 className="font-sans font-black text-sm text-[#d4e5f2] mt-0.5">Relatório de Notas dos Questionários</h4>
                  </div>
                  <span className="text-[10px] font-mono text-[#99907c]">
                    Total de {filteredAttempts.length} registros encontrados
                  </span>
                </div>

                {/* Filters Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Search bar */}
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-[#99907c]" />
                    <input
                      type="text"
                      placeholder="Buscar por irmão, email ou prova..."
                      value={reportSearchQuery}
                      onChange={(e) => setReportSearchQuery(e.target.value)}
                      className="bg-[#04141d] text-xs text-[#d4e5f2] border border-[#1c2c36] rounded-lg py-2 pl-8 pr-3 w-full focus:outline-none focus:ring-1 focus:ring-[#E9C349]"
                    />
                  </div>

                  {/* Questionnaire selection */}
                  <div>
                    <select
                      value={reportQuizFilter}
                      onChange={(e) => setReportQuizFilter(e.target.value)}
                      className="bg-[#04141d] text-xs text-[#d4e5f2] border border-[#1c2c36] rounded-lg p-2 w-full focus:outline-none font-mono"
                    >
                      <option value="Todos">Todos os Simulados</option>
                      {questionnaires.map(q => (
                        <option key={q.id} value={q.id}>{q.title}</option>
                      ))}
                    </select>
                  </div>

                  {/* Status Selection */}
                  <div>
                    <select
                      value={reportStatusFilter}
                      onChange={(e) => setReportStatusFilter(e.target.value)}
                      className="bg-[#04141d] text-xs text-[#d4e5f2] border border-[#1c2c36] rounded-lg p-2 w-full focus:outline-none font-mono"
                    >
                      <option value="Todos">Todos os Status</option>
                      <option value="Aprovados">Aprovados</option>
                      <option value="Reprovados">Estudo / Reprovados</option>
                    </select>
                  </div>
                </div>

                {/* Desktop View Table */}
                <div className="hidden sm:block overflow-x-auto border border-[#1c2c36] rounded-xl bg-[#04141d]/40">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#1c2c36] bg-[#04141d] text-slate-400 font-mono text-[10px] uppercase font-bold tracking-wider">
                        <th className="py-3 px-4">Irmão / Usuário</th>
                        <th className="py-3 px-4">Questionário</th>
                        <th className="py-3 px-4 text-center">Tipo</th>
                        <th className="py-3 px-4 text-center">Data e Hora</th>
                        <th className="py-3 px-4 text-center">Desempenho</th>
                        <th className="py-3 px-4 text-center">Status</th>
                        <th className="py-3 px-4 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1c2c36]/60">
                      {filteredAttempts.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-12 text-center text-[#99907c] font-mono text-xs">
                            <HelpCircle className="w-8 h-8 mx-auto opacity-30 mb-2" />
                            Nenhum registro de nota condizente com os filtros aplicados.
                          </td>
                        </tr>
                      ) : (
                        filteredAttempts.map((attempt) => (
                          <tr key={attempt.id} className="hover:bg-[#11212b]/30 transition-colors">
                            <td className="py-3.5 px-4">
                              <div className="font-sans font-bold text-[#d4e5f2] text-xs">
                                {attempt.userName || 'Membro'}
                              </div>
                              <div className="font-mono text-[10px] text-[#99907c] mt-0.5">
                                {attempt.userEmail}
                              </div>
                            </td>
                            <td className="py-3.5 px-4 font-sans text-xs text-[#9cbfd5]">
                              {attempt.questionnaireTitle}
                            </td>
                            <td className="py-3.5 px-4 text-center">
                              <span className={`inline-block text-[8px] font-mono py-0.5 px-2 rounded font-bold uppercase tracking-wider ${
                                attempt.simulationMode === 'Completo'
                                  ? 'bg-sky-950/40 text-sky-400 border border-sky-900/40' 
                                  : 'bg-amber-950/20 text-[#E9C349] border border-amber-900/40'
                              }`}>
                                {attempt.simulationMode === 'Completo' ? 'Padrão' : 'Simulado'}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-center font-mono text-[11px] text-[#9cbfd5]">
                              {attempt.dateTime}
                            </td>
                            <td className="py-3.5 px-4 text-center">
                              <div className="font-mono font-bold text-[#E9C349] text-xs">
                                {Math.round(attempt.scorePercentage)}%
                              </div>
                              <div className="font-mono text-[9px] text-[#99907c] mt-0.5">
                                {attempt.correctAnswersCount}/{attempt.totalQuestionsCount} acertos
                              </div>
                            </td>
                            <td className="py-3.5 px-4 text-center">
                              <span className={`inline-block text-[8px] font-mono py-0.5 px-2 rounded font-bold uppercase ${
                                attempt.approved 
                                  ? 'bg-emerald-950/20 text-emerald-400 border border-emerald-900/40' 
                                  : 'bg-rose-950/20 text-rose-400 border border-rose-900/40'
                              }`}>
                                {attempt.approved ? 'Aprovado' : 'Estudo'}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => setSelectedAttemptForDetails(attempt)}
                                  className="bg-[#11212b] hover:bg-[#1c2c36] text-[#66d9cc] border border-[#26a69a]/30 p-1.5 rounded transition-all cursor-pointer"
                                  title="Ver Respostas Detalhadas"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                                {attempt.approved && onOpenCertificate && (isGlobalAdmin || attempt.simulationMode === 'Completo') && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const userName = attempt.userName || 'Membro';
                                      const dateStr = attempt.dateTime ? attempt.dateTime.split(',')[0] : new Date().toLocaleDateString('pt-BR');
                                      const scoreVal = `${Math.round(attempt.scorePercentage)}%`;
                                      const quiz = questionnaires.find(q => q.id === attempt.questionnaireId);
                                      const gradeLabel = quiz?.degreeRequired ? `Grau ${quiz.degreeRequired}` : undefined;
                                      onOpenCertificate(userName, attempt.questionnaireTitle, 'quiz', dateStr, scoreVal, gradeLabel);
                                    }}
                                    className="bg-[#E9C349]/10 hover:bg-[#E9C349]/20 text-[#E9C349] border border-[#E9C349]/30 p-1.5 rounded transition-all cursor-pointer"
                                    title="Regerar/Imprimir Certificado"
                                  >
                                    <Award className="w-3.5 h-3.5" />
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => handleDeleteAttempt(attempt.id)}
                                  className="bg-rose-950/20 hover:bg-rose-950/40 text-rose-400 border border-rose-900/40 p-1.5 rounded transition-all cursor-pointer"
                                  title="Excluir Registro de Nota"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Mobile View - Cards List */}
                <div className="sm:hidden space-y-3">
                  {filteredAttempts.length === 0 ? (
                    <div className="bg-[#04141d]/40 border border-[#1c2c36] rounded-xl p-8 text-center text-[#99907c] font-mono text-xs">
                      <HelpCircle className="w-8 h-8 mx-auto opacity-30 mb-2" />
                      Nenhum registro de nota condizente com os filtros aplicados.
                    </div>
                  ) : (
                    filteredAttempts.map((attempt) => (
                      <div key={attempt.id} className="bg-[#0c1d27] border border-[#1c2c36] rounded-xl p-4 space-y-3 text-left shadow-sm">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="font-sans font-bold text-[#d4e5f2] text-xs">
                              {attempt.userName || 'Membro'}
                            </div>
                            <div className="font-mono text-[10px] text-[#99907c] mt-0.5">
                              {attempt.userEmail}
                            </div>
                          </div>
                          <span className={`shrink-0 inline-block text-[8px] font-mono py-0.5 px-2 rounded font-bold uppercase tracking-wider ${
                            attempt.simulationMode === 'Completo'
                              ? 'bg-sky-950/40 text-sky-400 border border-sky-900/40' 
                              : 'bg-amber-950/20 text-[#E9C349] border border-amber-900/40'
                          }`}>
                            {attempt.simulationMode === 'Completo' ? 'Padrão' : 'Simulado'}
                          </span>
                        </div>

                        <div className="text-xs font-semibold text-[#9cbfd5] bg-[#04141d] p-2.5 rounded-lg border border-[#1c2c36]/60">
                          {attempt.questionnaireTitle}
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-[11px] font-mono bg-[#04141d]/50 p-2 rounded-lg">
                          <div>
                            <span className="text-[#99907c] text-[9px] uppercase block">Data e Hora</span>
                            <span className="text-[#9cbfd5] font-semibold">{attempt.dateTime}</span>
                          </div>
                          <div>
                            <span className="text-[#99907c] text-[9px] uppercase block">Desempenho</span>
                            <span className="font-bold text-[#E9C349]">
                              {Math.round(attempt.scorePercentage)}% ({attempt.correctAnswersCount}/{attempt.totalQuestionsCount})
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <span className={`inline-block text-[9px] font-mono py-0.5 px-2.5 rounded font-bold uppercase ${
                            attempt.approved 
                              ? 'bg-emerald-950/20 text-emerald-400 border border-emerald-900/40' 
                              : 'bg-rose-950/20 text-rose-400 border border-rose-900/40'
                          }`}>
                            {attempt.approved ? 'Aprovado' : 'Estudo'}
                          </span>

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => setSelectedAttemptForDetails(attempt)}
                              className="bg-[#11212b] hover:bg-[#1c2c36] text-[#66d9cc] border border-[#26a69a]/30 p-2 rounded transition-all cursor-pointer"
                              title="Ver Respostas Detalhadas"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            {attempt.approved && onOpenCertificate && (isGlobalAdmin || attempt.simulationMode === 'Completo') && (
                              <button
                                type="button"
                                onClick={() => {
                                  const userName = attempt.userName || 'Membro';
                                  const dateStr = attempt.dateTime ? attempt.dateTime.split(',')[0] : new Date().toLocaleDateString('pt-BR');
                                  const scoreVal = `${Math.round(attempt.scorePercentage)}%`;
                                  const quiz = questionnaires.find(q => q.id === attempt.questionnaireId);
                                  const gradeLabel = quiz?.degreeRequired ? `Grau ${quiz.degreeRequired}` : undefined;
                                  onOpenCertificate(userName, attempt.questionnaireTitle, 'quiz', dateStr, scoreVal, gradeLabel);
                                }}
                                className="bg-[#E9C349]/10 hover:bg-[#E9C349]/20 text-[#E9C349] border border-[#E9C349]/30 p-2 rounded transition-all cursor-pointer"
                                title="Regerar/Imprimir Certificado"
                              >
                                <Award className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleDeleteAttempt(attempt.id)}
                              className="bg-rose-950/20 hover:bg-rose-950/40 text-rose-400 border border-rose-900/40 p-2 rounded transition-all cursor-pointer"
                              title="Excluir Registro de Nota"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

      {/* Detail view modal for a specific attempt */}
      {selectedAttemptForDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#0c1d27] border border-[#1c2c36] rounded-xl w-full max-w-2xl p-6 space-y-4 shadow-2xl relative text-left">
            <div className="flex items-center justify-between border-b border-[#1c2c36] pb-3">
              <div>
                <span className="text-[9px] font-mono text-[#E9C349] uppercase tracking-widest font-black block">REVISÃO DETALHADA</span>
                <h3 className="font-sans font-black text-sm text-[#d4e5f2] uppercase tracking-wider">
                  Respostas do Simulado
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAttemptForDetails(null)}
                className="text-[#99907c] hover:text-[#d4e5f2] transition-colors cursor-pointer p-1 rounded-md hover:bg-[#11212b]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {/* Attempt Meta Info */}
              <div className="grid grid-cols-2 gap-4 bg-[#04141d] p-3 rounded-lg border border-[#1c2c36]/80 text-[11px] font-mono">
                <div>
                  <span className="text-[#99907c] block uppercase text-[9px]">Irmão</span>
                  <strong className="text-[#d4e5f2]">{selectedAttemptForDetails.userName || 'Membro'}</strong> ({selectedAttemptForDetails.userEmail})
                </div>
                <div>
                  <span className="text-[#99907c] block uppercase text-[9px]">Simulado</span>
                  <strong className="text-[#d4e5f2]">{selectedAttemptForDetails.questionnaireTitle}</strong>
                </div>
                <div>
                  <span className="text-[#99907c] block uppercase text-[9px]">Data e Hora</span>
                  <strong className="text-[#d4e5f2]">{selectedAttemptForDetails.dateTime}</strong>
                </div>
                <div>
                  <span className="text-[#99907c] block uppercase text-[9px]">Nota / Desempenho</span>
                  <strong className="text-[#E9C349]">{Math.round(selectedAttemptForDetails.scorePercentage)}%</strong> ({selectedAttemptForDetails.correctAnswersCount}/{selectedAttemptForDetails.totalQuestionsCount} acertos)
                </div>
              </div>

              {/* Answers Grid */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-[#99907c] uppercase font-bold block">
                  Respostas Registradas:
                </span>
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                  {selectedAttemptForDetails.respostas ? (
                    selectedAttemptForDetails.respostas.split(' | ').map((resp, idx) => (
                      <div key={idx} className="bg-[#04141d] border border-[#1c2c36] p-2.5 rounded-lg font-mono text-[10.5px] leading-relaxed text-[#d4e5f2] break-words">
                        {resp}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-[#99907c] font-mono italic">
                      Nenhuma resposta detalhada foi gravada para este simulado.
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedAttemptForDetails(null)}
                className="bg-[#11212b] border border-[#1c2c36] text-[#99907c] hover:text-[#d4e5f2] px-5 py-2 rounded text-[10px] font-mono uppercase cursor-pointer"
              >
                Fechar Detalhes
              </button>
            </div>
          </div>
        </div>
      )}

          {/* GOOGLE SHEETS INTEGRATIONS SECTION */}
          <div className="bg-[#0c1d27] rounded-xl p-5 border border-[#1c2c36] space-y-4 shadow-md text-xs text-left">
            <div className="flex items-center gap-2 border-b border-[#1c2c36] pb-3">
              <FileText className="w-5 h-5 text-[#E9C349]" />
              <span className="font-sans font-bold text-sm text-[#d4e5f2] uppercase tracking-wider">
                Integração Google Planilhas (URL do Script Web App)
              </span>
            </div>

            <p className="text-[10px] text-[#9cbfd5] leading-relaxed">
              Insira o link de ativação gerado pelo seu Google Apps Script para consolidar logs de diploma e aprovação em sua planilha oficial de irmãos. Caso deixado em branco, o sistema utilizará um endereço padrão de testes.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={sheetsUrl}
                onChange={(e) => setSheetsUrl(e.target.value)}
                className="w-full bg-[#04141d] text-xs text-[#d4e5f2] border border-[#1c2c36] hover:border-[#66d9cc]/40 p-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#E9C349]"
                placeholder="https://script.google.com/macros/s/.../exec"
              />
              <button
                type="button"
                onClick={handleSaveSheetsUrl}
                className="bg-[#E9C349] hover:bg-[#ffe088] text-[#241a00] text-[10px] font-mono font-extrabold uppercase py-2 px-5 rounded-lg hover:shadow-lg active:scale-95 transition-all w-full sm:w-auto shrink-0 cursor-pointer select-none"
              >
                Salvar Integração
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Modal for New Quiz Book */}
      {isNewQuizModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#0c1d27] border border-[#1c2c36] rounded-xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#1c2c36] pb-3">
              <h3 className="font-sans font-black text-sm text-[#d4e5f2] uppercase tracking-wider">
                Novo Caderno de Simulados
              </h3>
              <button
                type="button"
                onClick={() => setIsNewQuizModalOpen(false)}
                className="text-[#99907c] hover:text-[#d4e5f2] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="font-mono text-[10px] text-[#99907c] uppercase font-bold block">
                Título do Caderno
              </label>
              <input
                type="text"
                value={newQuizTitleInput}
                onChange={(e) => setNewQuizTitleInput(e.target.value)}
                className="w-full bg-[#04141d] text-xs text-white border border-[#1c2c36] p-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#E9C349]"
                placeholder="Ex: Grau 3 - Mestre Maçom"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleConfirmCreateNewQuizBook();
                  }
                }}
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsNewQuizModalOpen(false)}
                className="bg-[#11212b] border border-[#1c2c36] text-[#99907c] hover:text-[#d4e5f2] px-4 py-2 rounded text-[10px] font-mono uppercase cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmCreateNewQuizBook}
                className="bg-[#E9C349] text-[#241a00] hover:bg-[#ffe088] font-mono px-5 py-2 rounded text-[10px] font-extrabold uppercase transition-all active:scale-95 cursor-pointer"
              >
                Criar Caderno
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
