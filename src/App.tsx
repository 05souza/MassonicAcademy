import React, { useState, useEffect, useMemo } from 'react';
import { INITIAL_REPORTS, INITIAL_ALERTS, INITIAL_BOOKS } from './data';
import { SENDA_VIRTUDE_COURSE } from './data/sendaVirtudeCourse';
import { ExecutiveReport, SystemAlert, AccessUser, Book, Lodge, Trilha, Questionnaire } from './types';
import { getDegreeLabel, getDegreeName } from './utils/degrees';
import { initializeFirebase, handleFirestoreError, OperationType, cleanObjectForFirestore } from './firebase';
import { collection, doc, getDoc, getDocs, setDoc, deleteDoc, onSnapshot, query, where } from 'firebase/firestore';
import Header from './components/Header';
import ReportCard from './components/ReportCard';
import ReportDetail from './components/ReportDetail';
import StatsOverview from './components/StatsOverview';
import BottomNav from './components/BottomNav';
import AlertsView from './components/AlertsView';
import ProfileView from './components/ProfileView';
import LoginGate from './components/LoginGate';
import QuestionnairesView from './components/QuestionnairesView';
import UserManualView from './components/UserManualView';
import LibraryView from './components/LibraryView';
import SecureViewerModal from './components/SecureViewerModal';
import { DEFAULT_QUESTIONNAIRES } from './data/defaultQuestionnaires';
import { Search, Info, LogIn, ChevronRight, BookOpen, Layers, Shield, Image as ImageIcon, LayoutGrid, List, Upload, Lock, Play, ThumbsUp, Heart, ArrowLeft, ChevronDown, CheckCircle2, Plus, Trash2, Edit, MoveUp, MoveDown, Check, Construction } from 'lucide-react';
import InlineEditable from './components/InlineEditable';
import { compressImage, isCourseCompleted } from './utils';
import { CertificateModal, CertificateData } from './components/CertificateModal';

export const isAdmin = (email: string | undefined): boolean => {
  if (!email) return false;
  const lower = email.toLowerCase().trim();
  if (lower === 'dani.nanda.lucas@gmail.com' || lower === 'daniel') return true;
  
  try {
    const saved = localStorage.getItem('masonic_current_user_v1');
    if (saved) {
      const parsed = JSON.parse(saved) as AccessUser;
      const uEmail = (parsed.email || '').toLowerCase().trim();
      const uAcesso = (parsed.userAcesso || '').toLowerCase().trim();
      if (parsed && (uEmail === lower || uAcesso === lower || (lower === 'daniel' && uEmail === 'dani.nanda.lucas@gmail.com')) && (parsed.tipoUsuario === 'admin' || uEmail === 'dani.nanda.lucas@gmail.com' || uAcesso === 'daniel')) {
        return true;
      }
    }
  } catch (e) {}

  try {
    const savedUsers = localStorage.getItem('masonic_access_users_v1');
    if (savedUsers) {
      const usersList = JSON.parse(savedUsers) as AccessUser[];
      const found = usersList.find(u => {
        const uEmail = (u.email || '').toLowerCase().trim();
        const uAcesso = (u.userAcesso || '').toLowerCase().trim();
        return uEmail === lower || uAcesso === lower || (lower === 'daniel' && uEmail === 'dani.nanda.lucas@gmail.com');
      });
      if (found && (found.tipoUsuario === 'admin' || (found.email || '').toLowerCase().trim() === 'dani.nanda.lucas@gmail.com' || (found.userAcesso || '').toLowerCase().trim() === 'daniel')) {
        return true;
      }
    }
  } catch (e) {}

  return false;
};

export default function App() {
  // Navigation tabs of bottom bar
  const [activeTab, setActiveTab] = useState<'inicio' | 'biblioteca' | 'alertas' | 'perfil' | 'questionarios' | 'manual'>('inicio');

  // Dynamic Dashboard Title & Stats
  const [dashboardTitle, setDashboardTitle] = useState(() => localStorage.getItem('masonic_dashboard_title') || 'Portal de Ensino');
  const [statsData, setStatsData] = useState(() => {
    const saved = localStorage.getItem('masonic_stats_v1');
    if (saved) return JSON.parse(saved);
    return [
      {
        title: 'EBITDA Consolidado',
        value: 'R$ 1.58 Bilhões',
        change: '+14.2%',
        trend: 'up',
        desc: 'Resultado de Negócios YTD',
        iconName: 'TrendingUp',
        color: 'text-[#E9C349]'
      },
      {
        title: 'Clientes Ativos',
        value: '12,410 corporativo',
        change: '+8.7%',
        trend: 'up',
        desc: 'Contratos vigentes ERP',
        iconName: 'Users',
        color: 'text-[#66D9CC]'
      },
      {
        title: 'Adoção SaaS / Cloud',
        value: '64.1% Base',
        change: '+12.4%',
        trend: 'up',
        desc: 'Migração RM legada',
        iconName: 'Cloud',
        color: 'text-[#3B82F6]'
      },
      {
        title: 'SLA Atendimento',
        value: '96.2%',
        change: '+0.8%',
        trend: 'up',
        desc: 'Média de suporte crítica',
        iconName: 'Award',
        color: 'text-[#A855F7]'
      }
    ];
  });
  
  // Reports and Alerts states with immediate LocalStorage cache / static fallback
  const [reports, setReports] = useState<ExecutiveReport[]>(() => {
    const saved = localStorage.getItem('masonic_reports_v1');
    return saved ? JSON.parse(saved) : INITIAL_REPORTS;
  });
  const [alerts, setAlerts] = useState<SystemAlert[]>(() => {
    const saved = localStorage.getItem('masonic_alerts_v1');
    return saved ? JSON.parse(saved) : INITIAL_ALERTS;
  });

  const [books, setBooks] = useState<Book[]>(() => {
    const saved = localStorage.getItem('masonic_books_v5');
    return saved ? JSON.parse(saved) : INITIAL_BOOKS;
  });

  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>(() => {
    const saved = localStorage.getItem('masonic_questionnaires_v1');
    if (saved) {
      try {
        let parsed: Questionnaire[] = JSON.parse(saved);
        let updated = false;
        parsed = parsed.map(q => {
          const defMatch = DEFAULT_QUESTIONNAIRES.find(dq => dq.id === q.id);
          const hasOldOptions = q.questions?.some(qu => qu.options?.some(opt => /opinião|resposta pessoal/i.test(opt)));
          if (defMatch && (hasOldOptions || q.questions?.length !== defMatch.questions.length)) {
            updated = true;
            return { ...q, questions: defMatch.questions };
          }
          return q;
        });
        for (const defQ of DEFAULT_QUESTIONNAIRES) {
          if (!parsed.some(q => q.id === defQ.id)) {
            parsed.push(defQ);
            updated = true;
          }
        }
        if (updated) {
          localStorage.setItem('masonic_questionnaires_v1', JSON.stringify(parsed));
        }
        return parsed;
      } catch (e) {
        return DEFAULT_QUESTIONNAIRES;
      }
    }
    return DEFAULT_QUESTIONNAIRES;
  });

  const [accessLogs, setAccessLogs] = useState<any[]>(() => {
    const saved = localStorage.getItem('masonic_access_logs_v1');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [lodges, setLodges] = useState<Lodge[]>(() => {
    const saved = localStorage.getItem('masonic_lodges_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      {
        id: 'lodge-cavaleiros',
        nome: 'Loja Cavaleiros da Ordem',
        potencia: 'GOB',
        cidade: 'São Paulo',
        numero: '1234',
        estado: 'SP',
        tema: 'cavaleiros'
      }
    ];
  });
  
  const [sortBy, setSortBy] = useState<'id' | 'titulo' | 'grau' | 'atualizacao'>('grau');

  // Simulated active user & accesses database
  const [currentUser, setCurrentUser] = useState<AccessUser | null>(null);
  const [isSessionLoaded, setIsSessionLoaded] = useState(false);

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('masonic_theme_v1') as 'dark' | 'light') || 'dark';
  });

  useEffect(() => {
    const userLodgeId = currentUser?.lodgeId || 'lodge-cavaleiros';
    const userLodge = lodges.find(l => l.id === userLodgeId);
    const lodgeThemeClass = userLodge?.tema ? `theme-${userLodge.tema}` : '';
    
    // Combine light/dark theme with the lodge's custom theme class
    const finalClasses = [theme, lodgeThemeClass].filter(Boolean).join(' ');
    document.body.className = finalClasses;
    document.documentElement.className = finalClasses;
    localStorage.setItem('masonic_theme_v1', theme);
  }, [theme, currentUser, lodges]);
  const [accessUsers, setAccessUsers] = useState<AccessUser[]>(() => {
    const saved = localStorage.getItem('masonic_access_users_v1');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((u: AccessUser) => {
            if ((u.email || '').toLowerCase().trim() === 'dani.nanda.lucas@gmail.com' || u.id === 'usr-nanda') {
              return { ...u, userAcesso: u.userAcesso || 'daniel', tipoUsuario: u.tipoUsuario || 'admin' };
            }
            return u;
          });
        }
      } catch (e) {
        console.error('Error parsing cached access users', e);
      }
    }
    // Default fallback access users
    return [
      {
        id: 'usr-nanda',
        name: 'Daniel Luciano',
        email: 'dani.nanda.lucas@gmail.com',
        userAcesso: 'daniel',
        allowedReportIds: '*, todos_do_grau',
        status: 'Ativo',
        nivelAcesso: '33',
        tipoUsuario: 'admin'
      },
      {
        id: 'usr-gisela',
        name: 'Gisela S. (CEO)',
        email: 'gisela.ceo@masonicacademy.com.br',
        allowedReportIds: 'rep-estrategia-segmentos, todos_do_grau',
        status: 'Ativo',
        nivelAcesso: '15'
      },
      {
        id: 'usr-rodrigo',
        name: 'Rodrigo M. (Produtos)',
        email: 'rodrigo.rm@masonicacademy.com.br',
        allowedReportIds: 'rep-visao-uso-rm, todos_do_grau',
        status: 'Ativo',
        nivelAcesso: '10'
      },
      {
        id: 'usr-fabio',
        name: 'Fábio T. (Serviços)',
        email: 'fabio.sve@masonicacademy.com.br',
        allowedReportIds: 'rep-servico-praticas, todos_do_grau',
        status: 'Inativo',
        nivelAcesso: '5'
      }
    ];
  });
  const [completedStateVersion, setCompletedStateVersion] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(() => {
    return (localStorage.getItem('masonic_view_mode') as 'grid' | 'list') || 'grid';
  });

  const handleToggleViewMode = (mode: 'grid' | 'list') => {
    setViewMode(mode);
    localStorage.setItem('masonic_view_mode', mode);
  };
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('TODOS');
  const [progressFilter, setProgressFilter] = useState<'todos' | 'concluidos' | 'andamento' | 'não-iniciados'>('todos');
  const [itemTypeFilter, setItemTypeFilter] = useState<'todos' | 'curso' | 'trilha'>('todos');
  const [selectedReport, setSelectedReport] = useState<ExecutiveReport | null>(null);

  // Catalog layout switcher (Cursos / Trilhas)
  const [catalogTab, setCatalogTab] = useState<'cursos' | 'trilhas'>('cursos');
  const [selectedTrilha, setSelectedTrilha] = useState<string | null>(null);
  const [expandedCourseId, setExpandedCourseId] = useState<string | null>(null);

  // Secure Document/Link Viewer Modal states
  const [secureViewerOpen, setSecureViewerOpen] = useState(false);
  const [secureViewerUrl, setSecureViewerUrl] = useState('');
  const [secureViewerTitle, setSecureViewerTitle] = useState('');
  const [secureViewerHtmlContent, setSecureViewerHtmlContent] = useState('');

  // Trilha management states
  const [trilhas, setTrilhas] = useState<Trilha[]>(() => {
    const saved = localStorage.getItem('masonic_trilhas_v1');
    return saved ? JSON.parse(saved) : [];
  });
  const [isEditingTrilha, setIsEditingTrilha] = useState(false);
  const [editingTrilha, setEditingTrilha] = useState<Trilha | null>(null);
  const [trilhaFormName, setTrilhaFormName] = useState('');
  const [trilhaFormImage, setTrilhaFormImage] = useState('');
  const [trilhaFormCourses, setTrilhaFormCourses] = useState<string[]>([]);
  const [trilhaFormStatus, setTrilhaFormStatus] = useState<'Ativo' | 'Inativo' | 'Em Construção'>('Ativo');
  const [isSavingTrilha, setIsSavingTrilha] = useState(false);
  const [trilhaToDelete, setTrilhaToDelete] = useState<any | null>(null);
  const [isDeletingTrilha, setIsDeletingTrilha] = useState(false);

  // Custom access level verification state for degree lock screen modal
  const [accessBlockedCourseTitle, setAccessBlockedCourseTitle] = useState<string | null>(null);
  const [accessBlockedRequiredLevel, setAccessBlockedRequiredLevel] = useState<number | null>(null);

  // Custom prerequisite verification states
  const [prereqBlockedCourse, setPrereqBlockedCourse] = useState<ExecutiveReport | null>(null);
  const [prereqRequiredCourse, setPrereqRequiredCourse] = useState<ExecutiveReport | null>(null);

  const handleAccessCourse = (report: ExecutiveReport) => {
    const isUserAdmin = isAdmin(currentUser?.email);
    const userLevel = currentUser ? parseInt(String(currentUser.nivelAcesso || (isUserAdmin ? '33' : '1')), 10) : 1;
    const courseLevel = report.nivelCurso || 1;

    if (!isUserAdmin && userLevel < courseLevel) {
      setAccessBlockedCourseTitle(report.title);
      setAccessBlockedRequiredLevel(courseLevel);
      return;
    }

    const prereqCourse = report.prerequisiteId ? reports.find(r => r.id === report.prerequisiteId) : undefined;
    const isPrereqLocked = !isUserAdmin && prereqCourse && !isCourseCompleted(prereqCourse, currentUser?.email || 'guest');
    if (isPrereqLocked) {
      setPrereqBlockedCourse(report);
      setPrereqRequiredCourse(prereqCourse || null);
      return;
    }

    setSelectedReport(report);
  };

  const handleBlockedAccess = (courseTitle: string, requiredLevel: number) => {
    setAccessBlockedCourseTitle(courseTitle);
    setAccessBlockedRequiredLevel(requiredLevel);
  };
  
  // Mobile search toggle state
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  // Quick Inline image linker modal
  const [linkingReportId, setLinkingReportId] = useState<string | null>(null);
  const [quickImageInput, setQuickImageInput] = useState('');

  // Banner image states
  const [bannerImage, setBannerImage] = useState(() => 
    localStorage.getItem('masonic_banner_image_v3') || 
    'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80'
  );
  const [isEditingBanner, setIsEditingBanner] = useState(false);
  const [bannerImageInput, setBannerImageInput] = useState('');
  const [bannerUploadError, setBannerUploadError] = useState<string | null>(null);
  const [activeCertificate, setActiveCertificate] = useState<CertificateData | null>(null);

  // Helper to log user accesses (logins, courses, books)
  const logAccess = async (
    type: 'login' | 'course' | 'book', 
    targetId: string, 
    targetTitle: string, 
    userToLog?: AccessUser | null
  ) => {
    const targetUser = userToLog !== undefined ? userToLog : currentUser;
    if (!targetUser) return;
    const { db } = initializeFirebase();
    const logId = `log_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const logData = {
      id: logId,
      userId: targetUser.id || 'master',
      userEmail: targetUser.email,
      userName: targetUser.name,
      type,
      targetId,
      targetTitle,
      timestamp: new Date().toISOString()
    };

    // 1. Update state & localStorage
    setAccessLogs(prev => {
      const updated = [logData, ...prev];
      localStorage.setItem('masonic_access_logs_v1', JSON.stringify(updated));
      return updated;
    });

    // 2. Save to Firestore
    if (db) {
      try {
        await setDoc(doc(db, 'access_logs', logId), cleanObjectForFirestore(logData));
      } catch (err) {
        console.error('Error saving access log to Firestore:', err);
      }
    }
  };

  // Periodic heartbeat to track active user sessions in Firestore
  useEffect(() => {
    if (!currentUser || !currentUser.id) return;
    const { db } = initializeFirebase();
    if (!db) return;

    const updateHeartbeat = async () => {
      try {
        const userDocRef = doc(db, 'accessUsers', currentUser.id);
        await setDoc(userDocRef, { lastActiveAt: new Date().toISOString() }, { merge: true });
      } catch (err) {
        console.error('Error updating heartbeat:', err);
      }
    };

    updateHeartbeat();
    const intervalId = setInterval(updateHeartbeat, 60000);

    return () => clearInterval(intervalId);
  }, [currentUser]);

  // One-time migration to grant "Acesso a Todos os Cursos do Grau" to all existing users
  useEffect(() => {
    if (accessUsers && accessUsers.length > 0) {
      const hasMigrated = localStorage.getItem('masonic_todos_do_grau_migrated_v5') === 'true';
      if (!hasMigrated) {
        const { db } = initializeFirebase();
        
        const updatedUsers = accessUsers.map(user => {
          const list = user.allowedReportIds 
            ? user.allowedReportIds.split(',').map(s => s.trim().toLowerCase()) 
            : [];
          if (!list.includes('todos_do_grau') && !list.includes('all_of_degree')) {
            const currentIds = user.allowedReportIds ? user.allowedReportIds.trim() : '';
            const newAllowed = currentIds ? `${currentIds}, todos_do_grau` : 'todos_do_grau';
            return {
              ...user,
              allowedReportIds: newAllowed
            };
          }
          return user;
        });

        const wasUpdated = updatedUsers.some((u, idx) => u.allowedReportIds !== accessUsers[idx].allowedReportIds);
        if (wasUpdated) {
          setAccessUsers(updatedUsers);
          localStorage.setItem('masonic_access_users_v1', JSON.stringify(updatedUsers));

          if (currentUser) {
            const updatedMe = updatedUsers.find(u => u.id === currentUser.id);
            if (updatedMe) {
              setCurrentUser(updatedMe);
              localStorage.setItem('masonic_current_user_v1', JSON.stringify(updatedMe));
            }
          }

          if (db) {
            updatedUsers.forEach(async (u) => {
              if (!u || !u.id) {
                console.warn('Skipping user migration: user has no valid ID', u);
                return;
              }
              try {
                await setDoc(doc(db, 'accessUsers', u.id), cleanObjectForFirestore(u), { merge: true });
              } catch (e) {
                console.error('Error migrating Firestore user:', e);
              }
            });
          }
        }
        localStorage.setItem('masonic_todos_do_grau_migrated_v5', 'true');
      }
    }
  }, [accessUsers, currentUser]);

  // One-time migration to seed Senda da Virtude course
  useEffect(() => {
    if (reports && reports.length > 0) {
      const hasSenda = reports.some(r => r.id === 'rep-senda-virtude-adonhiramita');
      if (!hasSenda) {
        const { db } = initializeFirebase();
        const updatedReports = [SENDA_VIRTUDE_COURSE, ...reports];
        setReports(updatedReports);
        localStorage.setItem('masonic_reports_v1', JSON.stringify(updatedReports));

        if (db) {
          try {
            setDoc(doc(db, 'reports', SENDA_VIRTUDE_COURSE.id), cleanObjectForFirestore(SENDA_VIRTUDE_COURSE));
          } catch (e) {
            console.error('Error seeding Senda da Virtude to Firestore:', e);
          }
        }
      }
    }
  }, [reports]);

  // Load from Firestore (if configured) or LocalStorage fallback
  useEffect(() => {
    const savedCurrentUser = localStorage.getItem('masonic_current_user_v1');
    if (savedCurrentUser) {
      const parsedUser = JSON.parse(savedCurrentUser);
      if ((parsedUser.email || '').toLowerCase().trim() === 'dani.nanda.lucas@gmail.com' || (parsedUser.userAcesso || '').toLowerCase().trim() === 'daniel') {
        parsedUser.userAcesso = parsedUser.userAcesso || 'daniel';
        parsedUser.tipoUsuario = parsedUser.tipoUsuario || 'admin';
      }
      setCurrentUser(parsedUser);
      // Only log login once per browser tab session to avoid duplicate logs during page refreshes/HMR
      const loggedThisSession = sessionStorage.getItem('masonic_logged_this_session');
      if (!loggedThisSession) {
        logAccess('login', 'session_restore', 'Sessão Ativa (Restauração)', parsedUser);
        sessionStorage.setItem('masonic_logged_this_session', 'true');
      }
    } else {
      setCurrentUser(null);
    }

    let unsubReports: () => void = () => {};
    let unsubAlerts: () => void = () => {};
    let unsubUsers: () => void = () => {};
    let unsubBanner: () => void = () => {};
    let unsubBooks: () => void = () => {};
    let unsubLogs: () => void = () => {};
    let unsubLodges: () => void = () => {};
    let unsubTrilhas: () => void = () => {};
    let unsubQuestionnaires: () => void = () => {};

    const loadInitialData = async () => {
      const { db } = initializeFirebase();
      if (db) {
        try {
          // One-time migration to seed the new 150+ books cleanly to Firestore (v5)
          // To prevent incognito windows or other devices from clearing user-created books,
          // we check a global settings document in Firestore to see if seeding has been completed.
          const hasClearedV5Local = localStorage.getItem('masonic_books_cleared_v5') === 'true';
          if (!hasClearedV5Local) {
            try {
              const migrationDocRef = doc(db, 'settings', 'migration_v5');
              const migrationSnap = await getDoc(migrationDocRef);
              const isSeededGlobally = migrationSnap.exists() && migrationSnap.data()?.books_seeded === true;

              if (!isSeededGlobally) {
                const booksCol = collection(db, 'books');
                const currentBooksSnapshot = await getDocs(booksCol);
                const existingIds = new Set(currentBooksSnapshot.docs.map(docSnap => docSnap.id));

                // Instead of blindly deleting everything and wiping out custom/saved books,
                // we only insert default books that do not already exist in the database.
                const booksToSeed = INITIAL_BOOKS.filter(book => !existingIds.has(book.id));
                if (booksToSeed.length > 0) {
                  const chunkSize = 20;
                  for (let i = 0; i < booksToSeed.length; i += chunkSize) {
                    const chunk = booksToSeed.slice(i, i + chunkSize);
                    await Promise.all(chunk.map(book => 
                      setDoc(doc(db, 'books', book.id), cleanObjectForFirestore(book))
                    ));
                  }
                }

                // Register global migration completion
                await setDoc(migrationDocRef, { books_seeded: true });
              }
              localStorage.setItem('masonic_books_cleared_v5', 'true');
            } catch (e) {
              console.error('Error during global books v5 migration:', e);
            }
          }

          let reportsReady = false;
          let alertsReady = false;
          let usersReady = false;
          let booksReady = false;

          const checkReady = () => {
            if (reportsReady && alertsReady && usersReady && booksReady) {
              setIsSessionLoaded(true);
            }
          };

          // 1. Fetch courses (reports) in real-time
          const reportsCol = collection(db, 'reports');
          unsubReports = onSnapshot(reportsCol, async (reportsSnapshot) => {
            if (reportsSnapshot.empty) {
              setReports(INITIAL_REPORTS);
              localStorage.setItem('masonic_reports_v1', JSON.stringify(INITIAL_REPORTS));
              // Seed defaults to Firestore!
              for (const rep of INITIAL_REPORTS) {
                await setDoc(doc(db, 'reports', rep.id), cleanObjectForFirestore(rep));
              }
            } else {
              const loadedReports: ExecutiveReport[] = [];
              reportsSnapshot.forEach(docSnap => {
                loadedReports.push(docSnap.data() as ExecutiveReport);
              });
              setReports(loadedReports);
              localStorage.setItem('masonic_reports_v1', JSON.stringify(loadedReports));
            }
            reportsReady = true;
            checkReady();
          }, (err) => {
            console.error('Erro de permissão ou rede no onSnapshot reports:', err);
            const saved = localStorage.getItem('masonic_reports_v1');
            if (saved) {
              try {
                setReports(JSON.parse(saved));
              } catch (e) {
                setReports(INITIAL_REPORTS);
              }
            }
            reportsReady = true;
            checkReady();
          });

          // 2. Fetch alerts in real-time
          const alertsCol = collection(db, 'alerts');
          unsubAlerts = onSnapshot(alertsCol, async (alertsSnapshot) => {
            if (alertsSnapshot.empty) {
              setAlerts(INITIAL_ALERTS);
              localStorage.setItem('masonic_alerts_v1', JSON.stringify(INITIAL_ALERTS));
              for (const al of INITIAL_ALERTS) {
                await setDoc(doc(db, 'alerts', al.id), cleanObjectForFirestore(al));
              }
            } else {
              const loadedAlerts: SystemAlert[] = [];
              alertsSnapshot.forEach(docSnap => {
                loadedAlerts.push(docSnap.data() as SystemAlert);
              });
              // Chronological sort descending (newest first)
              loadedAlerts.sort((a, b) => {
                const timeA = a.createdAt || 0;
                const timeB = b.createdAt || 0;
                return timeB - timeA;
              });
              setAlerts(loadedAlerts);
              localStorage.setItem('masonic_alerts_v1', JSON.stringify(loadedAlerts));
            }
            alertsReady = true;
            checkReady();
          }, (err) => {
            console.error('Erro de permissão ou rede no onSnapshot alerts:', err);
            const saved = localStorage.getItem('masonic_alerts_v1');
            if (saved) {
              try {
                const parsed = JSON.parse(saved) as SystemAlert[];
                parsed.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
                setAlerts(parsed);
              } catch (e) {
                setAlerts(INITIAL_ALERTS);
              }
            }
            alertsReady = true;
            checkReady();
          });

          // 3. Fetch accessUsers in real-time
          const usersCol = collection(db, 'accessUsers');
          unsubUsers = onSnapshot(usersCol, async (usersSnapshot) => {
            let loadedUsers: AccessUser[] = [];
            
            const defaultUsers: AccessUser[] = [
              {
                id: 'usr-nanda',
                name: 'Daniel Luciano',
                email: 'dani.nanda.lucas@gmail.com',
                userAcesso: 'daniel',
                allowedReportIds: '*, todos_do_grau',
                status: 'Ativo',
                nivelAcesso: '33',
                tipoUsuario: 'admin'
              },
              {
                id: 'usr-gisela',
                name: 'Gisela S. (CEO)',
                email: 'gisela.ceo@masonicacademy.com.br',
                allowedReportIds: 'rep-estrategia-segmentos, todos_do_grau',
                status: 'Ativo',
                nivelAcesso: '15'
              },
              {
                id: 'usr-rodrigo',
                name: 'Rodrigo M. (Produtos)',
                email: 'rodrigo.rm@masonicacademy.com.br',
                allowedReportIds: 'rep-visao-uso-rm, todos_do_grau',
                status: 'Ativo',
                nivelAcesso: '10'
              },
              {
                id: 'usr-fabio',
                name: 'Fábio T. (Serviços)',
                email: 'fabio.sve@masonicacademy.com.br',
                allowedReportIds: 'rep-servico-praticas, todos_do_grau',
                status: 'Inativo',
                nivelAcesso: '5'
              }
            ];

            if (usersSnapshot.empty) {
              setAccessUsers(defaultUsers);
              localStorage.setItem('masonic_access_users_v1', JSON.stringify(defaultUsers));
              for (const u of defaultUsers) {
                await setDoc(doc(db, 'accessUsers', u.id), cleanObjectForFirestore(u));
              }
            } else {
              usersSnapshot.forEach(docSnap => {
                const data = docSnap.data();
                loadedUsers.push({
                  id: docSnap.id,
                  ...data
                } as AccessUser);
              });
              setAccessUsers(loadedUsers);
              localStorage.setItem('masonic_access_users_v1', JSON.stringify(loadedUsers));
            }
            usersReady = true;
            checkReady();
          }, (err) => {
            console.error('Erro de permissão ou rede no onSnapshot accessUsers:', err);
            const saved = localStorage.getItem('masonic_access_users_v1');
            if (saved) {
              try {
                setAccessUsers(JSON.parse(saved));
              } catch (e) {
                console.error('Failed to parse cached access users on fallback', e);
              }
            }
            usersReady = true;
            checkReady();
          });

          // 4. Fetch custom banner settings in real-time
          unsubBanner = onSnapshot(doc(db, 'settings', 'general'), (docSnap) => {
            if (docSnap.exists()) {
              const data = docSnap.data();
              if (data && data.bannerImage) {
                setBannerImage(data.bannerImage);
                localStorage.setItem('masonic_banner_image_v3', data.bannerImage);
              }
            }
          }, (err) => {
            console.error('Erro de permissão ou rede no onSnapshot settings/general:', err);
          });

          // 5. Fetch books in real-time
          const booksCol = collection(db, 'books');
          unsubBooks = onSnapshot(booksCol, (booksSnapshot) => {
            if (booksSnapshot.empty) {
              // If completely empty on Firestore, fallback to local INITIAL_BOOKS
              // but DO NOT write to Firestore inside onSnapshot to avoid loops
              setBooks(INITIAL_BOOKS);
              localStorage.setItem('masonic_books_v5', JSON.stringify(INITIAL_BOOKS));
            } else {
              const loadedBooks: Book[] = [];
              booksSnapshot.forEach(docSnap => {
                loadedBooks.push(docSnap.data() as Book);
              });
              setBooks(loadedBooks);
              localStorage.setItem('masonic_books_v5', JSON.stringify(loadedBooks));
            }
            booksReady = true;
            checkReady();
          }, (err) => {
            console.error('Erro de permissão ou rede no onSnapshot books:', err);
            const saved = localStorage.getItem('masonic_books_v5');
            if (saved) {
              try {
                setBooks(JSON.parse(saved));
              } catch (e) {
                setBooks(INITIAL_BOOKS);
              }
            } else {
              setBooks(INITIAL_BOOKS);
            }
            booksReady = true;
            checkReady();
          });

          // 6. Fetch access_logs in real-time
          const logsCol = collection(db, 'access_logs');
          unsubLogs = onSnapshot(logsCol, (logsSnapshot) => {
            const loadedLogs: any[] = [];
            logsSnapshot.forEach(docSnap => {
              loadedLogs.push(docSnap.data());
            });
            // Sort by timestamp descending (newest first)
            loadedLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
            setAccessLogs(loadedLogs);
            localStorage.setItem('masonic_access_logs_v1', JSON.stringify(loadedLogs));
          }, (err) => {
            console.error('Erro de permissão ou rede no onSnapshot access_logs:', err);
            const saved = localStorage.getItem('masonic_access_logs_v1');
            if (saved) {
              try {
                setAccessLogs(JSON.parse(saved));
              } catch (e) {
                console.error('Failed to parse cached access logs:', e);
              }
            }
          });

          // 7. Fetch lodges in real-time
          const lodgesCol = collection(db, 'lodges');
          unsubLodges = onSnapshot(lodgesCol, async (lodgesSnapshot) => {
            const defaultLodgesList: Lodge[] = [
              {
                id: 'lodge-cavaleiros',
                nome: 'Loja Cavaleiros da Ordem',
                potencia: 'GOB',
                cidade: 'São Paulo',
                numero: '1234',
                estado: 'SP',
                tema: 'cavaleiros'
              }
            ];
            if (lodgesSnapshot.empty) {
              setLodges(defaultLodgesList);
              localStorage.setItem('masonic_lodges_v1', JSON.stringify(defaultLodgesList));
              for (const l of defaultLodgesList) {
                await setDoc(doc(db, 'lodges', l.id), cleanObjectForFirestore(l));
              }
            } else {
              const loadedLodges: Lodge[] = [];
              lodgesSnapshot.forEach(docSnap => {
                loadedLodges.push(docSnap.data() as Lodge);
              });
              setLodges(loadedLodges);
              localStorage.setItem('masonic_lodges_v1', JSON.stringify(loadedLodges));
            }
          }, (err) => {
            console.error('Erro de permissão ou rede no onSnapshot lodges:', err);
            const saved = localStorage.getItem('masonic_lodges_v1');
            if (saved) {
              try {
                setLodges(JSON.parse(saved));
              } catch (e) {
                console.error('Failed to parse cached lodges:', e);
              }
            }
          });

          // 8. Fetch trilhas in real-time
          const trilhasCol = collection(db, 'trilhas');
          unsubTrilhas = onSnapshot(trilhasCol, (trilhasSnapshot) => {
            const loadedTrilhas: Trilha[] = [];
            trilhasSnapshot.forEach(docSnap => {
              loadedTrilhas.push(docSnap.data() as Trilha);
            });
            setTrilhas(loadedTrilhas);
            localStorage.setItem('masonic_trilhas_v1', JSON.stringify(loadedTrilhas));
          }, (err) => {
            console.error('Erro de permissão ou rede no onSnapshot trilhas:', err);
            const saved = localStorage.getItem('masonic_trilhas_v1');
            if (saved) {
              try {
                setTrilhas(JSON.parse(saved));
              } catch (e) {
                console.error('Failed to parse cached trilhas:', e);
              }
            }
          });

          // 9. Fetch questionnaires in real-time
          const questionnairesCol = collection(db, 'questionnaires');
          unsubQuestionnaires = onSnapshot(questionnairesCol, (questionnairesSnapshot) => {
            if (questionnairesSnapshot.empty) {
              setQuestionnaires(DEFAULT_QUESTIONNAIRES);
              localStorage.setItem('masonic_questionnaires_v1', JSON.stringify(DEFAULT_QUESTIONNAIRES));
            } else {
              const loadedQuizzes: Questionnaire[] = [];
              questionnairesSnapshot.forEach(docSnap => {
                loadedQuizzes.push(docSnap.data() as Questionnaire);
              });
              for (const defQ of DEFAULT_QUESTIONNAIRES) {
                if (!loadedQuizzes.some(q => q.id === defQ.id)) {
                  loadedQuizzes.push(defQ);
                }
              }
              setQuestionnaires(loadedQuizzes);
              localStorage.setItem('masonic_questionnaires_v1', JSON.stringify(loadedQuizzes));
            }
          }, (err) => {
            console.error('Erro de permissão ou rede no onSnapshot questionnaires:', err);
            const saved = localStorage.getItem('masonic_questionnaires_v1');
            if (saved) {
              try {
                setQuestionnaires(JSON.parse(saved));
              } catch (e) {
                setQuestionnaires(DEFAULT_QUESTIONNAIRES);
              }
            } else {
              setQuestionnaires(DEFAULT_QUESTIONNAIRES);
            }
          });

          return; // Skip local storage fallback
        } catch (err) {
          console.error('Falha de inicialização em tempo real do Firestore:', err);
        }
      }

      // Fallback: LocalStorage loading
      const savedReports = localStorage.getItem('masonic_reports_v1');
      const savedAlerts = localStorage.getItem('masonic_alerts_v1');
      const savedAccessUsers = localStorage.getItem('masonic_access_users_v1');
      const savedBooks = localStorage.getItem('masonic_books_v5');

      if (savedReports) {
        setReports(JSON.parse(savedReports));
      } else {
        setReports(INITIAL_REPORTS);
        localStorage.setItem('masonic_reports_v1', JSON.stringify(INITIAL_REPORTS));
      }

      if (savedAlerts) {
        setAlerts(JSON.parse(savedAlerts));
      } else {
        setAlerts(INITIAL_ALERTS);
        localStorage.setItem('masonic_alerts_v1', JSON.stringify(INITIAL_ALERTS));
      }

      if (savedBooks) {
        setBooks(JSON.parse(savedBooks));
      } else {
        setBooks(INITIAL_BOOKS);
        localStorage.setItem('masonic_books_v5', JSON.stringify(INITIAL_BOOKS));
      }

      const savedQuestionnaires = localStorage.getItem('masonic_questionnaires_v1');
      if (savedQuestionnaires) {
        setQuestionnaires(JSON.parse(savedQuestionnaires));
      } else {
        setQuestionnaires(DEFAULT_QUESTIONNAIRES);
        localStorage.setItem('masonic_questionnaires_v1', JSON.stringify(DEFAULT_QUESTIONNAIRES));
      }

      if (savedAccessUsers) {
        setAccessUsers(JSON.parse(savedAccessUsers));
      } else {
        const defaultUsers: AccessUser[] = [
          {
            id: 'usr-nanda',
            name: 'Daniel Luciano',
            email: 'dani.nanda.lucas@gmail.com',
            userAcesso: 'daniel',
            allowedReportIds: '*, todos_do_grau',
            status: 'Ativo',
            nivelAcesso: '33',
            tipoUsuario: 'admin'
          },
          {
            id: 'usr-gisela',
            name: 'Gisela S. (CEO)',
            email: 'gisela.ceo@masonicacademy.com.br',
            allowedReportIds: 'rep-estrategia-segmentos, todos_do_grau',
            status: 'Ativo',
            nivelAcesso: '15'
          },
          {
            id: 'usr-rodrigo',
            name: 'Rodrigo M. (Produtos)',
            email: 'rodrigo.rm@masonicacademy.com.br',
            allowedReportIds: 'rep-visao-uso-rm, todos_do_grau',
            status: 'Ativo',
            nivelAcesso: '10'
          },
          {
            id: 'usr-fabio',
            name: 'Fábio T. (Serviços)',
            email: 'fabio.sve@masonicacademy.com.br',
            allowedReportIds: 'rep-servico-praticas, todos_do_grau',
            status: 'Inativo',
            nivelAcesso: '5'
          }
        ];
        setAccessUsers(defaultUsers);
        localStorage.setItem('masonic_access_users_v1', JSON.stringify(defaultUsers));
      }

      const savedLogs = localStorage.getItem('masonic_access_logs_v1');
      if (savedLogs) {
        setAccessLogs(JSON.parse(savedLogs));
      }

      const savedTrilhas = localStorage.getItem('masonic_trilhas_v1');
      if (savedTrilhas) {
        setTrilhas(JSON.parse(savedTrilhas));
      }

      setIsSessionLoaded(true);
    };

    loadInitialData();

    return () => {
      unsubReports();
      unsubAlerts();
      unsubUsers();
      unsubBanner();
      unsubBooks();
      unsubLogs();
      unsubLodges();
      unsubTrilhas();
      unsubQuestionnaires();
    };
  }, []);

  // Log course views when a report/course is selected
  useEffect(() => {
    if (selectedReport && currentUser) {
      logAccess('course', selectedReport.id, selectedReport.title);
    }
  }, [selectedReport]);

  // Synchronize currentUser with the latest from accessUsers list whenever accessUsers is updated!
  useEffect(() => {
    if (currentUser && accessUsers.length > 0) {
      const match = accessUsers.find(u => (u.email || '').toLowerCase() === (currentUser.email || '').toLowerCase());
      if (match) {
        if (
          match.status !== currentUser.status ||
          match.nivelAcesso !== currentUser.nivelAcesso ||
          match.name !== currentUser.name ||
          match.tipoUsuario !== currentUser.tipoUsuario ||
          match.allowedReportIds !== currentUser.allowedReportIds ||
          match.password !== currentUser.password ||
          match.telefone !== currentUser.telefone ||
          match.loja !== currentUser.loja ||
          match.potencia !== currentUser.potencia ||
          match.cidadeLoja !== currentUser.cidadeLoja ||
          match.lodgeId !== currentUser.lodgeId
        ) {
          setCurrentUser(match);
          localStorage.setItem('masonic_current_user_v1', JSON.stringify(match));
        }
      }
    }
  }, [accessUsers, currentUser]);

  // Sincronizar todas as conclusões/progresos do Firestore para o LocalStorage ao carregar ou mudar o usuário ativo
  useEffect(() => {
    if (!currentUser?.email) return;
    const emailKey = currentUser.email.toLowerCase().trim();
    const { db } = initializeFirebase();
    if (!db) return;

    let active = true;
    const syncAllCompletionsFromFirestore = async () => {
      try {
        const completionsRef = collection(db, 'completions');
        const q = query(completionsRef, where('userEmail', '==', emailKey));
        const querySnapshot = await getDocs(q);
        
        if (!active) return;
        
        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          if (data && data.reportId && data.completed) {
            localStorage.setItem(
              `masonic_completed_${emailKey}_${data.reportId}`,
              JSON.stringify(data.completed)
            );
          }
        });
        
        // Forçar renderização para atualizar todas as barras de progresso na tela inicial
        setCompletedStateVersion((prev) => prev + 1);
      } catch (err) {
        console.error('Erro ao sincronizar progresso geral do Firestore:', err);
      }
    };

    syncAllCompletionsFromFirestore();
    return () => {
      active = false;
    };
  }, [currentUser]);

  // Cloud sync helpers
  const saveTrilhasState = (newList: Trilha[]) => {
    setTrilhas(newList);
    localStorage.setItem('masonic_trilhas_v1', JSON.stringify(newList));
  };

  const syncTrilhaToCloud = async (trilha: Trilha) => {
    const { db } = initializeFirebase();
    if (!db) return;
    try {
      await setDoc(doc(db, 'trilhas', trilha.id), cleanObjectForFirestore(trilha));
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `trilhas/${trilha.id}`);
    }
  };

  const deleteTrilhaFromCloud = async (id: string) => {
    const { db } = initializeFirebase();
    if (!db) return;
    try {
      await deleteDoc(doc(db, 'trilhas', id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `trilhas/${id}`);
    }
  };

  const syncReportToCloud = async (rep: ExecutiveReport) => {
    const { db } = initializeFirebase();
    if (!db) return;
    try {
      await setDoc(doc(db, 'reports', rep.id), cleanObjectForFirestore(rep));
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `reports/${rep.id}`);
    }
  };

  const deleteReportFromCloud = async (id: string) => {
    const { db } = initializeFirebase();
    if (!db) return;
    try {
      await deleteDoc(doc(db, 'reports', id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `reports/${id}`);
    }
  };

  const syncAlertToCloud = async (al: SystemAlert) => {
    const { db } = initializeFirebase();
    if (!db) return;
    try {
      await setDoc(doc(db, 'alerts', al.id), cleanObjectForFirestore(al));
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `alerts/${al.id}`);
    }
  };

  const deleteAlertFromCloud = async (id: string) => {
    const { db } = initializeFirebase();
    if (!db) return;
    try {
      await deleteDoc(doc(db, 'alerts', id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `alerts/${id}`);
    }
  };

  const syncAccessUserToCloud = async (u: AccessUser) => {
    const { db } = initializeFirebase();
    if (!db) return;
    try {
      await setDoc(doc(db, 'accessUsers', u.id), cleanObjectForFirestore(u));
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `accessUsers/${u.id}`);
    }
  };

  const deleteAccessUserFromCloud = async (id: string) => {
    const { db } = initializeFirebase();
    if (!db) return;
    try {
      await deleteDoc(doc(db, 'accessUsers', id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `accessUsers/${id}`);
    }
  };

  const syncBookToCloud = async (book: Book) => {
    const { db } = initializeFirebase();
    if (!db) return;
    try {
      await setDoc(doc(db, 'books', book.id), cleanObjectForFirestore(book));
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `books/${book.id}`);
    }
  };

  const deleteBookFromCloud = async (id: string) => {
    const { db } = initializeFirebase();
    if (!db) return;
    try {
      await deleteDoc(doc(db, 'books', id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `books/${id}`);
    }
  };

  // Sync state helpers
  const saveReportsState = (updated: ExecutiveReport[]) => {
    const cleaned = updated.map(r => cleanObjectForFirestore(r));
    setReports(cleaned);
    localStorage.setItem('masonic_reports_v1', JSON.stringify(cleaned));
  };

  const saveAlertsState = (updated: SystemAlert[]) => {
    setAlerts(updated);
    localStorage.setItem('masonic_alerts_v1', JSON.stringify(updated));
  };

  const saveAccessUsersState = (updated: AccessUser[]) => {
    setAccessUsers(updated);
    localStorage.setItem('masonic_access_users_v1', JSON.stringify(updated));
  };

  const saveBooksState = (updated: Book[]) => {
    const cleaned = updated.map(b => cleanObjectForFirestore(b));
    setBooks(cleaned);
    localStorage.setItem('masonic_books_v5', JSON.stringify(cleaned));
  };

  const handleUpdateStatField = (idx: number, field: string, newValue: string) => {
    const updated = statsData.map((stat: any, i: number) => {
      if (i === idx) {
        return { ...stat, [field]: newValue };
      }
      return stat;
    });
    setStatsData(updated);
    localStorage.setItem('masonic_stats_v1', JSON.stringify(updated));
  };

  const handleSelectUser = (user: AccessUser) => {
    setCurrentUser(user);
    localStorage.setItem('masonic_current_user_v1', JSON.stringify(user));
    sessionStorage.setItem('masonic_logged_this_session', 'true');
    // Log login access for this user
    logAccess('login', '', '', user);
    // If the simulated session user has changed to someone that isn't admin, switch navigation tab out of settings
    if (!isAdmin(user.email) && activeTab === 'perfil') {
      setActiveTab('inicio');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('masonic_current_user_v1');
    sessionStorage.removeItem('masonic_logged_this_session');
    setActiveTab('inicio');
  };

  const handleAddAccessUser = (newUser: AccessUser) => {
    // 1. Update users list in state and localStorage
    setAccessUsers(prevUsers => {
      const merged = [...prevUsers, newUser];
      localStorage.setItem('masonic_access_users_v1', JSON.stringify(merged));
      return merged;
    });
    syncAccessUserToCloud(newUser);

    // 2. Create and synchronize high-priority alert with createdAt timestamp
    const newAlert: SystemAlert = {
      id: `alert-reg-${Date.now()}`,
      title: 'Novo Cadastro de Usuário',
      description: `O usuário "${newUser.name}" (${newUser.email}) se cadastrou e aguarda liberação de acesso pelo Administrador.`,
      time: 'Agora mesmo',
      type: 'access',
      read: false,
      createdAt: Date.now()
    };
    
    setAlerts(prevAlerts => {
      const merged = [newAlert, ...prevAlerts];
      localStorage.setItem('masonic_alerts_v1', JSON.stringify(merged));
      return merged;
    });
    syncAlertToCloud(newAlert);
  };

  const handleUpdateAccessUser = (updatedUser: AccessUser) => {
    const updated = accessUsers.map(u => u.id === updatedUser.id ? updatedUser : u);
    saveAccessUsersState(updated);
    syncAccessUserToCloud(updatedUser);
    if (currentUser && currentUser.id === updatedUser.id) {
      setCurrentUser(updatedUser);
      localStorage.setItem('masonic_current_user_v1', JSON.stringify(updatedUser));
    }
  };

  const handleDeleteAccessUser = (userId: string) => {
    const updated = accessUsers.filter(u => u.id !== userId);
    saveAccessUsersState(updated);
    deleteAccessUserFromCloud(userId);
    if (currentUser && currentUser.id === userId) {
      const admin: AccessUser = {
        id: 'usr-nanda-master',
        name: 'Daniel Luciano',
        email: 'dani.nanda.lucas@gmail.com',
        userAcesso: 'daniel',
        allowedReportIds: '*',
        status: 'Ativo',
        tipoUsuario: 'admin',
        nivelAcesso: '33'
      };
      setCurrentUser(admin);
      localStorage.setItem('masonic_current_user_v1', JSON.stringify(admin));
    }
  };

  // Trilha management handlers
  const handleOpenTrilhaForm = (trilhaItem: any | null) => {
    if (trilhaItem) {
      setEditingTrilha(trilhaItem);
      setTrilhaFormName(trilhaItem.name);
      setTrilhaFormImage(trilhaItem.imageUrl || '');
      setTrilhaFormStatus(trilhaItem.status || 'Ativo');
      
      // Get all current course IDs assigned to this Trilha
      const currentCourses = getTrilhaCourses(trilhaItem.name);
      setTrilhaFormCourses(currentCourses.map(c => c.id));
    } else {
      setEditingTrilha(null);
      setTrilhaFormName('');
      setTrilhaFormImage('');
      setTrilhaFormStatus('Ativo');
      setTrilhaFormCourses([]);
    }
    setIsEditingTrilha(true);
  };

  const moveCourse = (index: number, direction: 'up' | 'down') => {
    const updated = [...trilhaFormCourses];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= updated.length) return;
    
    // Swap
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    setTrilhaFormCourses(updated);
  };

  const submitTrilhaForm = async () => {
    if (!trilhaFormName.trim()) {
      alert("Por favor, digite o nome da Trilha.");
      return;
    }

    setIsSavingTrilha(true);
    try {
      const isNew = !editingTrilha;
      const tId = editingTrilha ? editingTrilha.id : `trilha-${Date.now()}`;
      const oldName = editingTrilha ? editingTrilha.name : '';
      const newName = trilhaFormName.trim();
      const newImage = trilhaFormImage.trim();

      // 1. Build Trilha object
      const updatedTrilha: Trilha = {
        id: tId,
        name: newName,
        imageUrl: newImage || undefined,
        courseIds: trilhaFormCourses,
        lodgeId: currentUser?.lodgeId || 'lodge-cavaleiros',
        status: trilhaFormStatus
      };

      // 2. Save Trilha to Firestore & Local State
      await syncTrilhaToCloud(updatedTrilha);

      const existingIdx = trilhas.findIndex(t => t.id === tId || (oldName && t.name.trim().toLowerCase() === oldName.trim().toLowerCase()));
      let newTrilhasList: Trilha[] = [];
      if (existingIdx >= 0) {
        newTrilhasList = [...trilhas];
        newTrilhasList[existingIdx] = updatedTrilha;
      } else {
        newTrilhasList = [...trilhas, updatedTrilha];
      }
      saveTrilhasState(newTrilhasList);

      // 3. Update all courses (reports) in this sequence
      // We set their category to the newName, and we chains their prerequisiteId accordingly!
      const reportsMap = new Map<string, ExecutiveReport>();
      for (const r of reports) {
        reportsMap.set(r.id, { ...r });
      }

      // Loop over current sequence and update category and prerequisiteId
      for (let i = 0; i < trilhaFormCourses.length; i++) {
        const cId = trilhaFormCourses[i];
        const prevCId = i > 0 ? trilhaFormCourses[i - 1] : undefined;
        
        const course = reportsMap.get(cId);
        if (course) {
          course.category = newName;
          course.prerequisiteId = prevCId || '';
        }
      }

      // If we renamed the Trilha, we should also rename the category for any other courses that had the old category name
      if (!isNew && oldName && oldName.toLowerCase() !== newName.toLowerCase()) {
        for (const [id, course] of reportsMap.entries()) {
          if ((course.category || '').trim().toLowerCase() === oldName.trim().toLowerCase()) {
            course.category = newName;
          }
        }
      }

      // If courses were removed from this Trilha, let's reset their category and prerequisite
      if (editingTrilha) {
        const currentCourses = getTrilhaCourses(oldName);
        for (const course of currentCourses) {
          if (!trilhaFormCourses.includes(course.id)) {
            const rDoc = reportsMap.get(course.id);
            if (rDoc) {
              rDoc.category = 'Geral'; // set to default
              rDoc.prerequisiteId = '';
            }
          }
        }
      }

      // 4. Save all updated courses (reports) back to Firestore
      const updatedReportsList = Array.from(reportsMap.values());
      saveReportsState(updatedReportsList);

      const { db } = initializeFirebase();
      if (db) {
        // Batch write course changes
        const changedCourses = updatedReportsList.filter(r => {
          const original = reports.find(o => o.id === r.id);
          return !original || original.category !== r.category || original.prerequisiteId !== r.prerequisiteId;
        });

        await Promise.all(changedCourses.map(c => 
          setDoc(doc(db!, 'reports', c.id), cleanObjectForFirestore(c))
        ));
      }

      // Add a system alert logging the update/creation
      const newAlert: SystemAlert = {
        id: `alert-trilha-${Date.now()}`,
        title: isNew ? 'Nova Trilha Criada' : 'Trilha Atualizada',
        description: `A trilha "${newName}" foi ${isNew ? 'criada' : 'atualizada'} com sucesso por ${currentUser?.name || 'Administrador'}.`,
        time: 'Agora mesmo',
        type: 'update',
        read: false,
        lodgeId: currentUser?.lodgeId || 'lodge-cavaleiros'
      };
      saveAlertsState([newAlert, ...alerts]);
      await syncAlertToCloud(newAlert);

      setIsEditingTrilha(false);
      setEditingTrilha(null);
    } catch (err) {
      console.error("Error saving trilha:", err);
      alert("Ocorreu um erro ao salvar a Trilha.");
    } finally {
      setIsSavingTrilha(false);
    }
  };

  const handleDeleteTrilhaClick = (trilhaItem: any) => {
    setTrilhaToDelete(trilhaItem);
  };

  const executeDeleteTrilha = async (trilhaItem: any) => {
    if (!trilhaItem) return;
    setIsDeletingTrilha(true);

    try {
      const targetNameNorm = (trilhaItem.name || '').trim().toLowerCase();
      const matchedCustomTrilha = trilhas.find(t => t.id === trilhaItem.id || t.name.trim().toLowerCase() === targetNameNorm);
      
      const trilhaIdToDelete = matchedCustomTrilha?.id || trilhaItem.id;

      // 1. Delete Trilha doc from cloud
      if (trilhaIdToDelete && !trilhaIdToDelete.startsWith('dyn-')) {
        await deleteTrilhaFromCloud(trilhaIdToDelete);
      }

      // 2. Remove from local trilhas state
      const updatedTrilhas = trilhas.filter(t => t.id !== trilhaIdToDelete && t.name.trim().toLowerCase() !== targetNameNorm);
      saveTrilhasState(updatedTrilhas);

      // 3. Reset all courses associated with this Trilha back to "Geral"
      const currentCourses = getTrilhaCourses(trilhaItem.name);
      const reportsMap = new Map<string, ExecutiveReport>();
      for (const r of reports) {
        reportsMap.set(r.id, { ...r });
      }

      const affectedCourseIds = new Set<string>();
      for (const course of currentCourses) {
        affectedCourseIds.add(course.id);
      }
      if (matchedCustomTrilha?.courseIds) {
        matchedCustomTrilha.courseIds.forEach(id => affectedCourseIds.add(id));
      }
      for (const r of reports) {
        if ((r.category || 'Geral').trim().toLowerCase() === targetNameNorm) {
          affectedCourseIds.add(r.id);
        }
      }

      for (const cId of affectedCourseIds) {
        const rDoc = reportsMap.get(cId);
        if (rDoc) {
          rDoc.category = 'Geral';
          rDoc.prerequisiteId = '';
        }
      }

      const updatedReportsList = Array.from(reportsMap.values());
      saveReportsState(updatedReportsList);

      const { db } = initializeFirebase();
      if (db) {
        const changedCourses = updatedReportsList.filter(r => {
          const original = reports.find(o => o.id === r.id);
          return !original || original.category !== r.category || original.prerequisiteId !== r.prerequisiteId;
        });

        await Promise.all(changedCourses.map(c => 
          setDoc(doc(db!, 'reports', c.id), cleanObjectForFirestore(c))
        ));
      }

      // 4. If this trilha was currently selected in view, clear selection
      if (selectedTrilha && selectedTrilha.trim().toLowerCase() === targetNameNorm) {
        setSelectedTrilha(null);
      }

      // Add a system alert logging the deletion
      const newAlert: SystemAlert = {
        id: `alert-trilha-del-${Date.now()}`,
        title: 'Trilha Deletada',
        description: `A trilha "${trilhaItem.name}" foi removida com sucesso do sistema por ${currentUser?.name || 'Administrador'}.`,
        time: 'Agora mesmo',
        type: 'update',
        read: false,
        lodgeId: currentUser?.lodgeId || 'lodge-cavaleiros'
      };
      saveAlertsState([newAlert, ...alerts]);
      await syncAlertToCloud(newAlert);
      setTrilhaToDelete(null);
    } catch (err) {
      console.error("Error deleting trilha:", err);
      alert("Erro ao deletar a Trilha.");
    } finally {
      setIsDeletingTrilha(false);
    }
  };

  // Bind custom direct image url to a report
  const handleUpdateReportImage = async (reportId: string, imageUrl: string) => {
    let finalUrl = imageUrl.trim();
    if (finalUrl.startsWith('data:image/')) {
      try {
        finalUrl = await compressImage(finalUrl, 800, 600, 0.75);
      } catch (err) {
        console.error("Error compressing report image:", err);
      }
    }

    const updated = reports.map((rep) => {
      if (rep.id === reportId) {
        // Remove old image tag if present
        const filteredTags = rep.tags.filter(t => !t.startsWith('img:'));
        const newTags = finalUrl ? [...filteredTags, `img:${finalUrl}`] : filteredTags;
        const modifiedRep = { ...rep, tags: newTags };
        syncReportToCloud(modifiedRep);
        return modifiedRep;
      }
      return rep;
    });

    saveReportsState(updated);
    
    // Auto add a system alert logging the change
    const matched = reports.find(r => r.id === reportId);
    if (matched) {
      const newAlert: SystemAlert = {
        id: `alert-new-img-${Date.now()}`,
        title: 'Vínculo de Imagem Atualizado',
        description: `Daniel Luciano vinculou um novo gráfico direto (HTML) em: ${matched.title}`,
        time: 'Agora mesmo',
        reportId: reportId,
        type: 'update',
        read: false
      };
      saveAlertsState([newAlert, ...alerts]);
      syncAlertToCloud(newAlert);
    }

    // Refresh selected report reference if drawer is open
    if (selectedReport && selectedReport.id === reportId) {
      const updatedSelected = updated.find(r => r.id === reportId);
      if (updatedSelected) setSelectedReport(updatedSelected);
    }
  };

  // Questionnaire state management
  const saveQuestionnairesState = (updated: Questionnaire[]) => {
    setQuestionnaires(updated);
    localStorage.setItem('masonic_questionnaires_v1', JSON.stringify(updated));
  };

  const syncQuestionnaireToCloud = async (q: Questionnaire) => {
    const { db } = initializeFirebase();
    if (db) {
      try {
        await setDoc(doc(db, 'questionnaires', q.id), cleanObjectForFirestore(q));
      } catch (e) {
        console.error('Error syncing questionnaire to cloud:', e);
      }
    }
  };

  const handleAddQuestionnaire = (newQ: Questionnaire) => {
    const finalQ: Questionnaire = {
      ...newQ,
      status: newQ.status || 'Ativo',
      lodgeId: newQ.lodgeId || currentUser?.lodgeId || 'lodge-cavaleiros'
    };
    const updated = [...questionnaires, finalQ];
    saveQuestionnairesState(updated);
    syncQuestionnaireToCloud(finalQ);
  };

  const handleUpdateQuestionnaire = (updatedQ: Questionnaire) => {
    const finalQ: Questionnaire = {
      ...updatedQ,
      lodgeId: updatedQ.lodgeId || currentUser?.lodgeId || 'lodge-cavaleiros'
    };
    const updated = questionnaires.map(q => q.id === finalQ.id ? finalQ : q);
    saveQuestionnairesState(updated);
    syncQuestionnaireToCloud(finalQ);
  };

  const handleDeleteQuestionnaire = async (qId: string) => {
    const updated = questionnaires.filter(q => q.id !== qId);
    saveQuestionnairesState(updated);
    const { db } = initializeFirebase();
    if (db) {
      try {
        await deleteDoc(doc(db, 'questionnaires', qId));
      } catch (e) {
        console.error('Error deleting questionnaire from cloud:', e);
      }
    }
  };

  // Add a new executive report
  const handleAddReport = (newRep: ExecutiveReport) => {
    const finalRep = {
      ...newRep,
      lodgeId: newRep.lodgeId || currentUser?.lodgeId || 'lodge-cavaleiros'
    };
    const updated = [...reports, finalRep];
    saveReportsState(updated);
    syncReportToCloud(finalRep);
    
    // Auto add a system alert logging the inclusion
    const newAlert: SystemAlert = {
      id: `alert-add-${Date.now()}`,
      title: 'Novo Título Cadastrado',
      description: `O título "${finalRep.title}" foi adicionado com sucesso ao sistema por ${currentUser?.name || 'Administrador'}.`,
      time: 'Agora mesmo',
      reportId: finalRep.id,
      type: 'update',
      read: false,
      lodgeId: currentUser?.lodgeId || 'lodge-cavaleiros'
    };
    saveAlertsState([newAlert, ...alerts]);
    syncAlertToCloud(newAlert);
  };

  // Import a list of reports from spreadsheet
  const handleImportReports = async (newReps: ExecutiveReport[]) => {
    const userLodgeId = currentUser?.lodgeId || 'lodge-cavaleiros';
    const finalReps = newReps.map(rep => ({
      ...rep,
      lodgeId: rep.lodgeId || userLodgeId
    }));
    const updated = [...reports, ...finalReps];
    saveReportsState(updated);
    
    // Cloud sync all of them in parallel
    const { db } = initializeFirebase();
    if (db) {
      try {
        const batchPromise = finalReps.map(rep => 
          setDoc(doc(db!, 'reports', rep.id), cleanObjectForFirestore(rep))
        );
        await Promise.all(batchPromise);
      } catch (e) {
        handleFirestoreError(e, OperationType.WRITE, `reports/batch-import`);
      }
    }

    // Auto add a combined system alert logging the inclusion
    const newAlert: SystemAlert = {
      id: `alert-import-${Date.now()}`,
      title: 'Títulos Importados via Planilha',
      description: `${finalReps.length} novos títulos foram importados com sucesso para o sistema por ${currentUser?.name || 'Administrador'} via arquivo Excel.`,
      time: 'Agora mesmo',
      type: 'update',
      read: false,
      lodgeId: userLodgeId
    };
    saveAlertsState([newAlert, ...alerts]);
    syncAlertToCloud(newAlert);
  };

  // Import a list of access users from spreadsheet
  const handleImportAccessUsers = async (newUsers: AccessUser[]) => {
    // Avoid duplicates by email
    const existingEmails = new Set(accessUsers.map(u => (u.email || '').toLowerCase()));
    const filteredNewUsers = newUsers.filter(u => !existingEmails.has((u.email || '').toLowerCase()));

    if (filteredNewUsers.length === 0) return;

    const updated = [...accessUsers, ...filteredNewUsers];
    saveAccessUsersState(updated);

    const { db } = initializeFirebase();
    if (db) {
      try {
        const chunkSize = 20;
        for (let i = 0; i < filteredNewUsers.length; i += chunkSize) {
          const chunk = filteredNewUsers.slice(i, i + chunkSize);
          await Promise.all(chunk.map(user => 
            setDoc(doc(db!, 'accessUsers', user.id), cleanObjectForFirestore(user))
          ));
        }
      } catch (e) {
        handleFirestoreError(e, OperationType.WRITE, `accessUsers/batch-import`);
      }
    }

    const newAlert: SystemAlert = {
      id: `alert-access-import-${Date.now()}`,
      title: 'Acessos Importados via Planilha',
      description: `${filteredNewUsers.length} novos acessos/usuários foram importados com sucesso por Daniel Luciano via arquivo Excel.`,
      time: 'Agora mesmo',
      type: 'access',
      read: false,
      createdAt: Date.now()
    };
    saveAlertsState([newAlert, ...alerts]);
    syncAlertToCloud(newAlert);
  };

  // Update an existing executive report
  const handleUpdateReport = (updatedRep: ExecutiveReport) => {
    const finalRep = {
      ...updatedRep,
      lodgeId: updatedRep.lodgeId || currentUser?.lodgeId || 'lodge-cavaleiros'
    };
    const updated = reports.map(r => r.id === finalRep.id ? finalRep : r);
    saveReportsState(updated);
    syncReportToCloud(finalRep);

    // Auto add a system alert logging the revision
    const newAlert: SystemAlert = {
      id: `alert-edit-${Date.now()}`,
      title: 'Métricas de Título Atualizadas',
      description: `Parâmetros e diretrizes de "${finalRep.title}" foram revisados por ${currentUser?.name || 'Administrador'}.`,
      time: 'Agora mesmo',
      reportId: finalRep.id,
      type: 'update',
      read: false,
      lodgeId: currentUser?.lodgeId || 'lodge-cavaleiros'
    };
    saveAlertsState([newAlert, ...alerts]);
    syncAlertToCloud(newAlert);

    // Update opened drawer report if it matches
    if (selectedReport && selectedReport.id === finalRep.id) {
      setSelectedReport(finalRep);
    }
  };

  // Delete an existing executive report
  const handleClearReport = (reportId: string) => {
    const reportToDelete = reports.find(r => r.id === reportId);
    if (!reportToDelete) return;
    const updated = reports.filter(r => r.id !== reportId);
    saveReportsState(updated);
    deleteReportFromCloud(reportId);

    // Auto add a system alert logging the deletion
    const newAlert: SystemAlert = {
      id: `alert-del-${Date.now()}`,
      title: 'Título Removido do Painel',
      description: `O título "${reportToDelete.title}" foi excluído do sistema.`,
      time: 'Agora mesmo',
      type: 'critical',
      read: false,
      lodgeId: reportToDelete.lodgeId || currentUser?.lodgeId || 'lodge-cavaleiros'
    };
    saveAlertsState([newAlert, ...alerts]);
    syncAlertToCloud(newAlert);

    // Close drawer if deleted report was open
    if (selectedReport && selectedReport.id === reportId) {
      setSelectedReport(null);
    }
  };

  const handleAddBook = (newBook: Book) => {
    const finalBook = {
      ...newBook,
      lodgeId: newBook.lodgeId || currentUser?.lodgeId || 'lodge-cavaleiros'
    };
    const updated = [...books, finalBook];
    saveBooksState(updated);
    syncBookToCloud(finalBook);
    
    // Auto add a system alert logging the inclusion
    const newAlert: SystemAlert = {
      id: `alert-add-book-${Date.now()}`,
      title: 'Novo Material Cadastrado',
      description: `O material "${finalBook.title}" foi adicionado com sucesso à biblioteca por ${currentUser?.name || 'Administrador'}.`,
      time: 'Agora mesmo',
      type: 'update',
      read: false,
      lodgeId: currentUser?.lodgeId || 'lodge-cavaleiros'
    };
    saveAlertsState([newAlert, ...alerts]);
    syncAlertToCloud(newAlert);
  };

  const handleUpdateBook = (updatedBook: Book) => {
    const finalBook = {
      ...updatedBook,
      lodgeId: updatedBook.lodgeId || currentUser?.lodgeId || 'lodge-cavaleiros'
    };
    const updated = books.map(b => b.id === finalBook.id ? finalBook : b);
    saveBooksState(updated);
    syncBookToCloud(finalBook);

    // Auto add a system alert logging the revision
    const newAlert: SystemAlert = {
      id: `alert-edit-book-${Date.now()}`,
      title: 'Material da Biblioteca Atualizado',
      description: `Os metadados do material "${finalBook.title}" foram revisados por ${currentUser?.name || 'Administrador'}.`,
      time: 'Agora mesmo',
      type: 'update',
      read: false,
      lodgeId: currentUser?.lodgeId || 'lodge-cavaleiros'
    };
    saveAlertsState([newAlert, ...alerts]);
    syncAlertToCloud(newAlert);
  };

  const handleDeleteBook = (bookId: string) => {
    const bookToDelete = books.find(b => b.id === bookId);
    if (!bookToDelete) return;
    const updated = books.filter(b => b.id !== bookId);
    saveBooksState(updated);
    deleteBookFromCloud(bookId);

    // Auto add a system alert logging the deletion
    const newAlert: SystemAlert = {
      id: `alert-del-book-${Date.now()}`,
      title: 'Material Removido da Biblioteca',
      description: `O material "${bookToDelete.title}" foi excluído da biblioteca.`,
      time: 'Agora mesmo',
      type: 'critical',
      read: false,
      lodgeId: bookToDelete.lodgeId || currentUser?.lodgeId || 'lodge-cavaleiros'
    };
    saveAlertsState([newAlert, ...alerts]);
    syncAlertToCloud(newAlert);
  };

  const handleAddLodge = async (newLodge: Lodge) => {
    const updated = [...lodges, newLodge];
    setLodges(updated);
    localStorage.setItem('masonic_lodges_v1', JSON.stringify(updated));
    const { db } = initializeFirebase();
    if (db) {
      try {
        await setDoc(doc(db, 'lodges', newLodge.id), cleanObjectForFirestore(newLodge));
      } catch (e) {
        console.error('Error adding lodge to cloud:', e);
      }
    }
  };

  const handleUpdateLodge = async (updatedLodge: Lodge) => {
    const updated = lodges.map(l => l.id === updatedLodge.id ? updatedLodge : l);
    setLodges(updated);
    localStorage.setItem('masonic_lodges_v1', JSON.stringify(updated));
    const { db } = initializeFirebase();
    if (db) {
      try {
        await setDoc(doc(db, 'lodges', updatedLodge.id), cleanObjectForFirestore(updatedLodge));
      } catch (e) {
        console.error('Error updating lodge in cloud:', e);
      }
    }
  };

  const handleDeleteLodge = async (lodgeId: string) => {
    const updated = lodges.filter(l => l.id !== lodgeId);
    setLodges(updated);
    localStorage.setItem('masonic_lodges_v1', JSON.stringify(updated));
    const { db } = initializeFirebase();
    if (db) {
      try {
        await deleteDoc(doc(db, 'lodges', lodgeId));
      } catch (e) {
        console.error('Error deleting lodge from cloud:', e);
      }
    }
  };

  const handleBatchUpdateBooksStatus = async (bookIds: string[], status: 'Ativo' | 'Inativo') => {
    const updatedBooksList = books.map(b => {
      if (bookIds.includes(b.id)) {
        return { ...b, status };
      }
      return b;
    });
    saveBooksState(updatedBooksList);

    const { db } = initializeFirebase();
    if (db) {
      try {
        const batchPromise = bookIds.map(async (id) => {
          const matched = books.find(b => b.id === id);
          if (matched) {
            await setDoc(doc(db!, 'books', id), cleanObjectForFirestore({ ...matched, status }));
          }
        });
        await Promise.all(batchPromise);
      } catch (e) {
        handleFirestoreError(e, OperationType.WRITE, `books/batch-status-update`);
      }
    }

    const newAlert: SystemAlert = {
      id: `alert-batch-status-book-${Date.now()}`,
      title: 'Status de Materiais em Lote',
      description: `O status de ${bookIds.length} materiais foi alterado para "${status}" por Daniel Luciano.`,
      time: 'Agora mesmo',
      type: 'update',
      read: false
    };
    saveAlertsState([newAlert, ...alerts]);
    syncAlertToCloud(newAlert);
  };

  const handleBatchDeleteBooks = async (bookIds: string[]) => {
    const updatedBooksList = books.filter(b => !bookIds.includes(b.id));
    saveBooksState(updatedBooksList);

    const { db } = initializeFirebase();
    if (db) {
      try {
        const batchPromise = bookIds.map(id => deleteDoc(doc(db!, 'books', id)));
        await Promise.all(batchPromise);
      } catch (e) {
        handleFirestoreError(e, OperationType.DELETE, `books/batch-delete`);
      }
    }

    const newAlert: SystemAlert = {
      id: `alert-batch-del-book-${Date.now()}`,
      title: 'Exclusão de Materiais em Lote',
      description: `${bookIds.length} materiais foram excluídos da biblioteca por Daniel Luciano.`,
      time: 'Agora mesmo',
      type: 'critical',
      read: false
    };
    saveAlertsState([newAlert, ...alerts]);
    syncAlertToCloud(newAlert);
  };

  const handleImportBooks = async (newBooks: Book[]) => {
    const userLodgeId = currentUser?.lodgeId || 'lodge-cavaleiros';
    const finalBooks = newBooks.map(b => ({
      ...b,
      lodgeId: b.lodgeId || userLodgeId
    }));
    const updated = [...books];
    const newBooksFiltered = finalBooks.filter(newB => {
      const idx = updated.findIndex(b => b.id === newB.id);
      if (idx > -1) {
        updated[idx] = newB;
        return true;
      }
      updated.push(newB);
      return true;
    });

    saveBooksState(updated);

    const { db } = initializeFirebase();
    if (db) {
      try {
        const chunkSize = 20;
        for (let i = 0; i < newBooksFiltered.length; i += chunkSize) {
          const chunk = newBooksFiltered.slice(i, i + chunkSize);
          await Promise.all(chunk.map(book => 
            setDoc(doc(db!, 'books', book.id), cleanObjectForFirestore(book))
          ));
        }
      } catch (e) {
        handleFirestoreError(e, OperationType.WRITE, `books/batch-import`);
      }
    }

    const newAlert: SystemAlert = {
      id: `alert-import-book-${Date.now()}`,
      title: 'Materiais Importados via Planilha',
      description: `${newBooksFiltered.length} novos materiais foram importados para a biblioteca por ${currentUser?.name || 'Administrador'} via arquivo Excel.`,
      time: 'Agora mesmo',
      type: 'update',
      read: false,
      lodgeId: userLodgeId
    };
    saveAlertsState([newAlert, ...alerts]);
    syncAlertToCloud(newAlert);
  };

  // Mark all alarms as read
  const handleMarkAllAlertsRead = () => {
    const updated = alerts.map(a => {
      if (!a.read) {
        const updatedAlert = { ...a, read: true };
        syncAlertToCloud(updatedAlert);
        return updatedAlert;
      }
      return a;
    });
    saveAlertsState(updated);
  };

  // Toggle single alarm read state
  const handleToggleAlertRead = (alertId: string) => {
    const matched = alerts.find(a => a.id === alertId);
    if (matched) {
      if (matched.type === 'access') {
        const updated = alerts.filter(a => a.id !== alertId);
        saveAlertsState(updated);
        deleteAlertFromCloud(alertId);
      } else {
        const updatedAlert = { ...matched, read: true };
        const updated = alerts.map(a => a.id === alertId ? updatedAlert : a);
        saveAlertsState(updated);
        syncAlertToCloud(updatedAlert);
      }
    }
  };

  // Quick dialog triggers
  const triggerQuickImageLink = (reportId: string, currentLink: string) => {
    setLinkingReportId(reportId);
    setQuickImageInput(currentLink);
  };

  const submitQuickImageLink = () => {
    if (linkingReportId) {
      handleUpdateReportImage(linkingReportId, quickImageInput);
      setLinkingReportId(null);
    }
  };

  const submitBannerEdit = async () => {
    let trimmed = bannerImageInput.trim();
    if (trimmed) {
      if (trimmed.startsWith('data:image/')) {
        try {
          trimmed = await compressImage(trimmed, 1200, 450, 0.75);
        } catch (err) {
          console.error("Error compressing banner image:", err);
        }
      }
      setBannerImage(trimmed);
      localStorage.setItem('masonic_banner_image_v3', trimmed);
      const { db } = initializeFirebase();
      if (db) {
        try {
          await setDoc(doc(db, 'settings', 'general'), { bannerImage: trimmed }, { merge: true });
        } catch (e) {
          console.error('Falha ao sincronizar o banner da academia no Firestore:', e);
        }
      }
    }
    setIsEditingBanner(false);
  };

  const userLodgeId = currentUser?.lodgeId || 'lodge-cavaleiros';
  const isMasterAdmin = (currentUser?.email || '').toLowerCase().trim() === 'dani.nanda.lucas@gmail.com' || (currentUser?.userAcesso || '').toLowerCase().trim() === 'daniel';

  const lodgeReports = reports.filter(r => {
    if (isMasterAdmin) return true;
    const rLodge = r.lodgeId || 'lodge-cavaleiros';
    return rLodge === userLodgeId;
  });

  const isCourseAllowedForUser = (report: ExecutiveReport) => {
    if (!currentUser) return false;
    if (report.status === 'Inativo' && !isAdmin(currentUser.email)) return false;
    if (isAdmin(currentUser.email)) return true;

    const reportIdLower = (report.id || '').toLowerCase();
    if (currentUser.blockedReportIds) {
      const blockedList = currentUser.blockedReportIds
        .split(',')
        .map(id => id.trim().toLowerCase())
        .filter(Boolean);
      if (blockedList.includes(reportIdLower)) {
        return false;
      }
    }

    const userDegree = parseInt(String(currentUser.nivelAcesso || '1'), 10);
    const courseDegree = parseInt(String(report.nivelCurso || '1'), 10);
    return courseDegree <= userDegree;
  };

  const getTrilhaCourses = (trilhaName: string) => {
    const isUserAdmin = isAdmin(currentUser?.email);
    const filterByDegreeAndStatus = (r: ExecutiveReport) => {
      if (r.status === 'Inativo' && !isUserAdmin) return false;
      if (!isUserAdmin) {
        return isCourseAllowedForUser(r);
      }
      return true;
    };

    // Check if there is a custom trilha with custom course sequencing
    const matchedTrilha = trilhas.find(t => t.name.trim().toLowerCase() === trilhaName.trim().toLowerCase());
    if (matchedTrilha && matchedTrilha.courseIds && matchedTrilha.courseIds.length > 0) {
      const courseIdToIndex = new Map<string, number>();
      matchedTrilha.courseIds.forEach((id, idx) => courseIdToIndex.set(id, idx));

      // Get courses matching either the category display name OR present in courseIds
      const baseCourses = lodgeReports.filter(r => 
        filterByDegreeAndStatus(r) &&
        ((r.category || 'Geral').trim().toLowerCase() === trilhaName.trim().toLowerCase() || courseIdToIndex.has(r.id))
      );

      return [...baseCourses].sort((a, b) => {
        const idxA = courseIdToIndex.has(a.id) ? courseIdToIndex.get(a.id)! : 9999;
        const idxB = courseIdToIndex.has(b.id) ? courseIdToIndex.get(b.id)! : 9999;
        return idxA - idxB;
      });
    }

    // 1. Get base courses directly under this category/trilha
    const baseCourses = lodgeReports.filter(r => 
      filterByDegreeAndStatus(r) &&
      (r.category || 'Geral').trim().toLowerCase() === trilhaName.trim().toLowerCase()
    );

    // 2. Track down all prerequisites recursively
    const allCoursesMap = new Map<string, ExecutiveReport>();
    for (const c of baseCourses) {
      allCoursesMap.set(c.id, c);
    }

    const addPrerequisites = (course: ExecutiveReport) => {
      if (course.prerequisiteId) {
        const prereq = lodgeReports.find(r => r.id === course.prerequisiteId && filterByDegreeAndStatus(r));
        if (prereq && !allCoursesMap.has(prereq.id)) {
          allCoursesMap.set(prereq.id, prereq);
          addPrerequisites(prereq);
        }
      }
    };

    for (const c of baseCourses) {
      addPrerequisites(c);
    }

    const combinedCourses = Array.from(allCoursesMap.values());

    // 3. Perform topological sort based on prerequisiteId
    const sorted: ExecutiveReport[] = [];
    const visited = new Set<string>();
    const visiting = new Set<string>();

    const visit = (course: ExecutiveReport) => {
      if (visited.has(course.id)) return;
      if (visiting.has(course.id)) return; // prevent loop

      visiting.add(course.id);

      if (course.prerequisiteId) {
        const prereq = combinedCourses.find(r => r.id === course.prerequisiteId);
        if (prereq) {
          visit(prereq);
        }
      }

      visiting.delete(course.id);
      visited.add(course.id);
      sorted.push(course);
    };

    for (const c of combinedCourses) {
      visit(c);
    }

    return sorted;
  };

  // Combine custom trilhas from DB with any extra dynamic categories from courses
  const allAvailableTrilhasList = useMemo(() => {
    const customTrilhasMap = new Map<string, Trilha>();
    for (const t of trilhas) {
      customTrilhasMap.set(t.name.trim().toLowerCase(), t);
    }

    const isUserAdmin = isAdmin(currentUser?.email);

    const dynamicCategories = Array.from(new Set<string>(
      lodgeReports
        .filter(r => {
          // Inactive courses must not appear on the home screen ("inicio"), even for admins
          if (r.status === 'Inativo') return false;
          if (!isUserAdmin && !isCourseAllowedForUser(r)) return false;
          return true;
        })
        .map(r => (r.category || 'Geral').trim())
        .filter(Boolean)
    ));

    const combined: { id: string; name: string; imageUrl?: string; isCustom: boolean; courseIds?: string[]; status?: 'Ativo' | 'Inativo' | 'Em Construção' }[] = [];
    
    // First, add all defined custom trilhas
    for (const t of trilhas) {
      // Inactive trilhas must not appear for non-admin users
      if (!isUserAdmin && t.status === 'Inativo') {
        continue;
      }
      // For non-admin users, only show custom trilhas that have at least one allowed course (or are "Em Construção")
      if (!isUserAdmin && t.status !== 'Em Construção') {
        const allowedInTrilha = getTrilhaCourses(t.name);
        if (allowedInTrilha.length === 0) {
          continue;
        }
      }
      combined.push({
        id: t.id,
        name: t.name,
        imageUrl: t.imageUrl,
        isCustom: true,
        courseIds: t.courseIds,
        status: t.status || 'Ativo'
      });
    }

    // Next, add any dynamic categories that don't have a matching custom trilha
    for (const cat of dynamicCategories) {
      const normalizedCat = cat.trim().toLowerCase();
      if (!customTrilhasMap.has(normalizedCat)) {
        combined.push({
          id: `dyn-${normalizedCat}`,
          name: cat,
          imageUrl: undefined,
          isCustom: false,
          courseIds: undefined
        });
      }
    }

    return combined;
  }, [trilhas, lodgeReports, currentUser]);

  const lodgeBooks = books.filter(b => {
    if (isMasterAdmin) return true;
    const bLodge = b.lodgeId || 'lodge-cavaleiros';
    return bLodge === userLodgeId;
  });

  const lodgeAlerts = alerts.filter(a => {
    if (isMasterAdmin) return true;
    const aLodge = a.lodgeId || 'lodge-cavaleiros';
    return aLodge === userLodgeId;
  });

  // Compute unique categories from reports dynamics
  const availableCategories: string[] = ['TODOS', ...Array.from(new Set<string>(
    lodgeReports
      .filter(r => r.status !== 'Inativo' && (isAdmin(currentUser?.email) || isCourseAllowedForUser(r)))
      .map(r => (r.category || '').trim())
      .filter(Boolean)
  ))];

  // Filter computation logic (Search string + Active Category tab selection)
  const filteredReports = lodgeReports.filter((report) => {
    const matchesCategory = activeCategory === 'TODOS' || (report.category || '').trim().toLowerCase() === activeCategory.trim().toLowerCase();
    const matchesSearch = 
      (report.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (report.department || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (report.summary || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (report.tags || []).some(t => (t || '').toLowerCase().includes(searchQuery.toLowerCase()));
      
    return matchesCategory && matchesSearch;
  });

  // Filter permission-allowed reports for currently simulated user context
  const handleUpdateReportField = (reportId: string, field: keyof ExecutiveReport, newValue: any) => {
    const rep = reports.find(r => r.id === reportId);
    if (rep) {
      const updated = { ...rep, [field]: newValue };
      handleUpdateReport(updated);
    }
  };

  // Filter permission-allowed reports for currently simulated user context
  const allowedReportsForUser = filteredReports.filter((report) => {
    if (!currentUser) return false;
    
    // Inactive courses must not appear on the home screen ("inicio"), even for admins
    if (report.status === 'Inativo') {
      return false;
    }

    return isCourseAllowedForUser(report);
  }).filter((report) => {
    if (itemTypeFilter !== 'todos') {
      const type = report.itemType || 'curso';
      if (type !== itemTypeFilter) return false;
    }

    if (progressFilter === 'todos') return true;

    const emailKey = currentUser?.email || 'guest';
    const saved = localStorage.getItem(`masonic_completed_${emailKey}_${report.id}`);
    const completedMaterials = saved ? JSON.parse(saved) : {};
    
    let totalCount = 0;
    let completedCount = 0;
    
    if (report.htmlContent) {
      totalCount++;
      if (completedMaterials['htmlContent']) completedCount++;
    }
    if (report.material1Link) {
      totalCount++;
      if (completedMaterials['material1']) completedCount++;
    }
    if (report.material2Link) {
      totalCount++;
      if (completedMaterials['material2']) completedCount++;
    }
    if (report.material3Link) {
      totalCount++;
      if (completedMaterials['material3']) completedCount++;
    }
    if (report.material4Link) {
      totalCount++;
      if (completedMaterials['material4']) completedCount++;
    }
    if (report.material5Link) {
      totalCount++;
      if (completedMaterials['material5']) completedCount++;
    }
    if (report.material6Link) {
      totalCount++;
      if (completedMaterials['material6']) completedCount++;
    }
    if (report.linkedQuestionnaireId) {
      totalCount++;
      if (completedMaterials['linked_questionnaire']) completedCount++;
    }
    if (report.additionalLink && !report.conteudoSemProva) {
      totalCount++;
      if (completedMaterials['proof']) completedCount++;
    }

    if (progressFilter === 'concluidos') {
      return totalCount > 0 && completedCount === totalCount;
    }
    if (progressFilter === 'andamento') {
      return completedCount > 0 && completedCount < totalCount;
    }
    if (progressFilter === 'não-iniciados') {
      return completedCount === 0;
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === 'id') {
      const idxA = INITIAL_REPORTS.findIndex(r => r.id === a.id);
      const idxB = INITIAL_REPORTS.findIndex(r => r.id === b.id);
      if (idxA !== -1 && idxB !== -1) {
        return idxA - idxB;
      }
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return a.id.localeCompare(b.id);
    } else if (sortBy === 'titulo') {
      return a.title.localeCompare(b.title);
    } else if (sortBy === 'grau') {
      return (a.nivelCurso || 0) - (b.nivelCurso || 0);
    } else if (sortBy === 'atualizacao') {
      const parseDate = (dStr: string) => {
        const tm = Date.parse(dStr);
        return isNaN(tm) ? 0 : tm;
      };
      return parseDate(b.lastUpdated || '') - parseDate(a.lastUpdated || '');
    }
    return 0;
  });

  const isUserInactive = !!currentUser && !isAdmin(currentUser.email) && currentUser.status === 'Inativo';

  const unreadAlertsCount = alerts.filter(a => !a.read).length;

  // Render the title based on active view tab
  const getHeaderTitle = () => {
    switch (activeTab) {
      case 'inicio':
        return `Masonic Academy • ${dashboardTitle}`;
      case 'biblioteca':
        return 'Masonic Academy • Biblioteca de Estudos';
      case 'alertas':
        return 'Masonic Academy • Central de Alertas';
      case 'perfil':
        return 'Masonic Academy • Perfil e Ferramentas';
      case 'questionarios':
        return 'Masonic Academy • Central de Simulados';
      case 'manual':
        return 'Masonic Academy • Manual do Usuário';
      default:
        return `Masonic Academy • ${dashboardTitle}`;
    }
  };

  if (!isSessionLoaded) {
    return (
      <div className="min-h-screen bg-[#05151e] text-[#d4e5f2] flex flex-col items-center justify-center font-sans">
        <div className="space-y-4 text-center">
          <div className="w-12 h-12 border-4 border-[#E9C349] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-mono text-[#99907c] animate-pulse">Iniciando Portal de Segurança...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <LoginGate
        onLogin={handleSelectUser}
        accessUsers={accessUsers}
        onAddAccessUser={handleAddAccessUser}
      />
    );
  }

  return (
    <div id="executive-root" className="min-h-screen bg-[#05151e] text-[#d4e5f2] selection:bg-[#E9C349]/40 flex flex-col font-sans relative pb-20">
      
      {/* Top Application Bar */}
      <Header
        title={getHeaderTitle()}
        onSearchToggle={() => setShowMobileSearch(!showMobileSearch)}
        showSearch={showMobileSearch}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSelectCategory={setActiveCategory}
        activeCategory={activeCategory}
        currentUser={currentUser}
        onSelectUser={handleSelectUser}
        accessUsers={accessUsers}
        onLogout={handleLogout}
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        isAdminUser={isAdmin(currentUser.email)}
        logoUrl={lodges.find(l => l.id === (currentUser?.lodgeId || 'lodge-cavaleiros'))?.logoUrl}
      />

      {/* Main Container Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-4 space-y-4">

        {/* Dynamic & Shareable Header Banner (No Words, Editable for Admins) */}
        {(activeTab === 'inicio' || activeTab === 'perfil') && (
          <div className="space-y-1.5 w-full">
            <div id="unified-hero-banner" className="relative w-full h-36 md:h-48 rounded-xl overflow-hidden border border-[#1c2c36]/90 shadow-lg group">
              <img
                src={bannerImage}
                alt="Course Portal Banner"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover filter brightness-95 contrast-100"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80';
                }}
              />
              {/* Admin Banner Image Editing Overlay Action */}
              {isAdmin(currentUser.email) && (
                <button
                  id="edit-portal-banner-btn"
                  onClick={() => {
                    setBannerImageInput(bannerImage);
                    setBannerUploadError(null);
                    setIsEditingBanner(true);
                  }}
                  className="absolute top-3 right-3 bg-black/75 hover:bg-black text-[10px] font-mono font-bold text-[#E9C349] px-3 py-1.5 rounded border border-[#E9C349]/45 backdrop-blur-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-[#E9C349]" />
                  <span>Editar Imagem de Banner</span>
                </button>
              )}
            </div>
            {isAdmin(currentUser.email) && (
              <div className="text-[10px] font-mono text-[#99907c] text-left sm:text-right pr-1 select-none animate-fadeIn">
                Recomendação para imagem do banner: <span className="text-[#E9C349] font-bold">1200x400 px</span> (Proporção <span className="text-[#E9C349] font-bold">3:1</span>)
              </div>
            )}
          </div>
        )}

        {/* --- INCIO VIEW --- */}
        {activeTab === 'inicio' && (
          <div className="space-y-4 animate-fade-in text-left">
            {isUserInactive ? (
              <div className="bg-[#1a0e12]/80 border border-rose-500/30 rounded-xl p-10 text-center space-y-5 animate-fade-in flex flex-col items-center justify-center max-w-2xl mx-auto my-8">
                <Shield className="w-16 h-16 text-rose-500 animate-bounce mt-3" />
                <div className="max-w-md space-y-2">
                  <h3 className="font-sans font-black text-lg text-rose-200 uppercase tracking-widest leading-none">Acesso Pendente de Aprovação</h3>
                  <p className="text-sm text-rose-300 leading-relaxed font-sans mt-3">
                    Seu acesso à <strong className="text-rose-400">MASONIC ACADEMY</strong> está pendente de aprovação! Não se preocupe, seus dados de cadastro foram salvos no sistema. Assim que um Administrador aprovar o seu perfil, este aviso será liberado automaticamente.
                  </p>
                  <p className="text-xs text-[#99907c] font-sans mt-2">
                    E-mail registrado: <strong className="text-[#E9C349] font-mono">{currentUser?.email}</strong>
                  </p>
                </div>
                
                <button
                  id="inactive-logout-btn"
                  onClick={handleLogout}
                  className="mt-4 bg-[#11212b]/80 hover:bg-[#1c2c36] text-[#66d9cc] text-xs font-mono font-bold uppercase tracking-wider px-6 py-3 rounded-lg border border-[#1c2c36] transition-all cursor-pointer hover:shadow-md active:scale-95 flex items-center gap-2"
                >
                  &larr; Voltar ao Painel de Login
                </button>
              </div>
            ) : (
              <>
                {/* Cursos / Trilhas Tab switcher matching the screenshots */}
                <div className="flex border-b border-[#1c2c36] mb-5 font-sans relative">
                  <button
                    onClick={() => {
                      setCatalogTab('cursos');
                      setSelectedTrilha(null);
                    }}
                    className={`px-8 py-3.5 font-sans font-bold text-sm tracking-widest uppercase transition-all cursor-pointer relative z-10 ${
                      catalogTab === 'cursos' && !selectedTrilha
                        ? 'text-white border-b-4 border-[#00D2FF] pb-3 -mb-[2px] font-black'
                        : 'text-[#9cbfd5]/70 hover:text-white pb-3 -mb-[2px]'
                    }`}
                  >
                    Cursos
                  </button>
                  <button
                    onClick={() => {
                      setCatalogTab('trilhas');
                      setSelectedTrilha(null);
                    }}
                    className={`px-8 py-3.5 font-sans font-bold text-sm tracking-widest uppercase transition-all cursor-pointer relative z-10 ${
                      catalogTab === 'trilhas' || selectedTrilha
                        ? 'text-white border-b-4 border-[#00D2FF] pb-3 -mb-[2px] font-black'
                        : 'text-[#9cbfd5]/70 hover:text-white pb-3 -mb-[2px]'
                    }`}
                  >
                    Trilhas
                  </button>
                </div>

                {catalogTab === 'cursos' && !selectedTrilha ? (
                  <>
                    {/* View switcher header row */}
                    <div className="flex items-center justify-between pb-3.5 border-b border-[#1c2c36]/50 mb-2">
                      <h3 className="font-sans font-bold text-xs text-[#9cbfd5] tracking-widest uppercase mb-0">
                        Catálogo de Cursos
                      </h3>
                      <div className="flex items-center gap-1.5 bg-[#081721] border border-[#1c2c36] p-1 rounded-lg">
                        <button
                          onClick={() => handleToggleViewMode('grid')}
                          title="Exibição em Grade"
                          className={`p-1.5 rounded transition-all flex items-center justify-center hover:text-[#E9C349] cursor-pointer ${
                            viewMode === 'grid' 
                              ? 'bg-[#11212b] text-[#E9C349] border border-[#1c2c36]/60 shadow-xs' 
                              : 'text-[#99907c] border border-transparent'
                          }`}
                        >
                          <LayoutGrid className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleToggleViewMode('list')}
                          title="Exibição em Lista"
                          className={`p-1.5 rounded transition-all flex items-center justify-center hover:text-[#E9C349] cursor-pointer ${
                            viewMode === 'list' 
                              ? 'bg-[#11212b] text-[#E9C349] border border-[#1c2c36]/60 shadow-xs' 
                              : 'text-[#99907c] border border-transparent'
                          }`}
                        >
                          <List className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Discrete status filter & sort options */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3.5 pb-4 mt-1 font-mono text-[11px] border-b border-[#1c2c36]/20 mb-3.5 w-full">
                      <div id="course-status-filter" className="flex flex-wrap items-center gap-2 animate-fadeIn">
                        <div className="flex items-center gap-1 bg-[#081721] p-1 rounded-lg border border-[#1c2c36]">
                          <span className="text-[#99907c] px-1 uppercase select-none font-bold text-[9px]">Tipo:</span>
                          {[
                            { id: 'todos', label: 'Todos' },
                            { id: 'curso', label: 'Cursos' },
                            { id: 'trilha', label: 'Trilhas' }
                          ].map((item) => {
                            const active = itemTypeFilter === item.id;
                            return (
                              <button
                                key={item.id}
                                id={`type-filter-${item.id}`}
                                onClick={() => setItemTypeFilter(item.id as any)}
                                className={`px-2.5 py-0.5 rounded text-[10px] font-bold tracking-tight cursor-pointer transition-all ${
                                  active
                                    ? 'bg-[#66d9cc]/20 text-[#66d9cc] border border-[#66d9cc]/40 shadow-xs'
                                    : 'text-[#99907c] hover:text-[#d4e5f2]'
                                }`}
                              >
                                {item.label}
                              </button>
                            );
                          })}
                        </div>

                        <span className="text-[#99907c] mr-1 uppercase select-none font-bold text-[10px] ml-1">Status:</span>
                        {[
                          { id: 'todos', label: 'Todos os Títulos' },
                          { id: 'concluidos', label: 'Concluídos' },
                          { id: 'andamento', label: 'Em Andamento' },
                          { id: 'não-iniciados', label: 'Não Iniciados' }
                        ].map((item) => {
                          const active = progressFilter === item.id;
                          return (
                            <button
                              key={item.id}
                              id={`prog-filter-${item.id}`}
                              onClick={() => setProgressFilter(item.id as any)}
                              className={`px-3 py-1 rounded-full border text-[10px] font-bold tracking-tight cursor-pointer transition-all ${
                                active
                                  ? 'bg-[#E9C349]/15 text-[#E9C349] border-[#E9C349]/40 shadow-xs'
                                  : 'bg-[#081721]/60 text-[#99907c] border-[#1c2c36]/50 hover:text-[#d4e5f2] hover:bg-[#11212b]'
                              }`}
                            >
                              {item.label}
                            </button>
                          );
                        })}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="text-[#99907c] mr-1 uppercase select-none font-bold text-[10px]">Ordenar por:</span>
                        {[
                          { id: 'grau', label: 'Grau' },
                          { id: 'titulo', label: 'Título' },
                          { id: 'atualizacao', label: 'Última Atualização' }
                        ].map((item) => {
                          const active = sortBy === item.id;
                          return (
                            <button
                              key={item.id}
                              onClick={() => setSortBy(item.id as any)}
                              className={`px-2.5 py-1 rounded border text-[10px] font-bold tracking-right cursor-pointer transition-all ${
                                active
                                  ? 'bg-[#66d9cc]/15 text-[#66d9cc] border-[#66d9cc]/40 shadow-xs'
                                  : 'bg-[#081721]/60 text-[#99907c] border-[#1c2c36]/50 hover:text-[#d4e5f2] hover:bg-[#11212b]'
                              }`}
                            >
                              {item.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Grid or List display of cards */}
                    <div 
                      id="reports-grid" 
                      className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "flex flex-col gap-1.5"}
                    >
                      {allowedReportsForUser.map((report) => (
                        <ReportCard
                          key={`${report.id}-${completedStateVersion}`}
                          report={report}
                          onAccess={handleAccessCourse}
                          onEditImageLink={triggerQuickImageLink}
                          isAdmin={isAdmin(currentUser.email)}
                          onUpdateReportField={handleUpdateReportField}
                          currentUser={currentUser}
                          viewMode={viewMode}
                          onBlockedAccess={handleBlockedAccess}
                          reports={reports}
                          hideTrilhaStep={true}
                          onOpenSecureViewer={(url, title, htmlContent) => {
                            setSecureViewerUrl(url);
                            setSecureViewerTitle(title);
                            setSecureViewerHtmlContent(htmlContent || '');
                            setSecureViewerOpen(true);
                          }}
                        />
                      ))}

                      {allowedReportsForUser.length === 0 && (
                        <div className="col-span-1 md:col-span-2 text-center py-20 bg-[#0c1d27]/40 rounded-xl border border-dashed border-[#1c2c36]">
                          <Layers className="w-10 h-10 text-[#99907c] mx-auto opacity-40 mb-3" />
                          <p className="text-xs font-mono text-[#99907c]">Nenhum título disponível sob sua credencial ou filtro ativo.</p>
                          {(searchQuery !== '' || progressFilter !== 'todos' || activeCategory !== 'TODOS') && (
                            <button
                              onClick={() => {
                                setSearchQuery('');
                                setActiveCategory('TODOS');
                                setProgressFilter('todos');
                              }}
                              className="mt-3 text-xs font-mono font-bold text-[#E9C349] hover:underline"
                            >
                              Redefinir filtros de busca
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="space-y-6">
                    {/* TRILHAS VIEW SYSTEM */}
                    {selectedTrilha === null ? (
                      <div>
                        {/* LIST OF AVAILABLE TRILHAS (Image 2) */}
                        <div className="flex items-center justify-between border-b border-[#1c2c36]/50 pb-3 mb-6">
                          <h3 className="font-sans font-black text-[#d4e5f2] text-sm uppercase tracking-wider select-none flex items-center justify-between w-full">
                            <div className="flex items-center gap-3">
                              <span>TRILHAS DISPONÍVEIS</span>
                              {isAdmin(currentUser?.email) && (
                                <button
                                  onClick={() => handleOpenTrilhaForm(null)}
                                  className="px-2.5 py-1 bg-[#00D2FF]/10 border border-[#00D2FF]/30 text-[#00D2FF] hover:bg-[#00D2FF]/20 rounded text-[11px] font-mono font-bold tracking-tight cursor-pointer flex items-center gap-1 transition-all"
                                >
                                  <Plus className="w-3 h-3" />
                                  <span>Nova Trilha</span>
                                </button>
                              )}
                            </div>
                            <button 
                              onClick={() => setCatalogTab('cursos')}
                              className="text-xs font-bold text-[#00D2FF] hover:underline cursor-pointer flex items-center gap-1 normal-case font-sans"
                            >
                              <span>Acessar todos</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                          {allAvailableTrilhasList.map((trilhaItem) => {
                            const trilhaName = trilhaItem.name;
                            const trilhaImage = trilhaItem.imageUrl;
                            const trilhaCourses = getTrilhaCourses(trilhaName);
                            
                            const completedCount = trilhaCourses.filter(r => isCourseCompleted(r, currentUser?.email || 'guest')).length;
                            const percent = trilhaCourses.length > 0 ? Math.round((completedCount / trilhaCourses.length) * 100) : 0;
                            
                            // Visual color strategy
                            const hash = trilhaName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                            const gradients = [
                              'from-[#00c6ff]/20 to-[#0072ff]/20 border-[#00c6ff]/35 text-[#00D2FF]',
                              'from-[#11998e]/20 to-[#38ef7d]/20 border-[#11998e]/35 text-[#1ea296]',
                              'from-[#7f00ff]/20 to-[#e100ff]/20 border-[#7f00ff]/35 text-purple-400',
                              'from-[#f12711]/20 to-[#f5af19]/20 border-[#f12711]/35 text-amber-400',
                              'from-[#0575e6]/20 to-[#00f260]/20 border-[#0575e6]/35 text-emerald-400'
                            ];
                            const cardStyle = gradients[hash % gradients.length];

                            return (
                              <div
                                key={trilhaName}
                                onClick={() => {
                                  const isEmConstrucao = trilhaItem.status === 'Em Construção';
                                  const isUserAdmin = isAdmin(currentUser?.email);
                                  if (isEmConstrucao && !isUserAdmin) return;
                                  setSelectedTrilha(trilhaName);
                                }}
                                className={`bg-[#0a1b24]/90 border rounded-xl p-5 shadow-lg transition-all flex flex-col justify-between h-[230px] relative overflow-hidden ${
                                  !(trilhaItem.status === 'Em Construção') || isAdmin(currentUser?.email) ? 'cursor-pointer group hover:shadow-[#00D2FF]/5' : 'cursor-default'
                                } ${
                                  trilhaItem.status === 'Inativo' 
                                    ? 'border-dashed border-red-500/30 opacity-70 hover:opacity-100 hover:border-red-500/60' 
                                    : trilhaItem.status === 'Em Construção'
                                      ? 'border-dashed border-amber-500/35 opacity-80 hover:opacity-100'
                                      : 'border-[#1c2c36] hover:border-[#00D2FF]/60'
                                }`}
                              >
                                {/* Cosmic Mesh Network background element (Matches Image 2) */}
                                <div className="absolute inset-0 z-0 overflow-hidden opacity-35 select-none pointer-events-none">
                                  <svg className="w-full h-full stroke-[#d4e5f2]/5 stroke-[1.2]" viewBox="0 0 100 100" preserveAspectRatio="none">
                                    <line x1="15" y1="25" x2="45" y2="75" />
                                    <line x1="45" y1="75" x2="75" y2="35" />
                                    <line x1="75" y1="35" x2="90" y2="80" />
                                    <line x1="15" y1="25" x2="75" y2="35" />
                                    <circle cx="15" cy="25" r="1" className="fill-[#00D2FF]" />
                                    <circle cx="45" cy="75" r="1.5" className="fill-[#00D2FF]/80" />
                                    <circle cx="75" cy="35" r="1" className="fill-[#00D2FF]/80" />
                                    <circle cx="90" cy="80" r="1" className="fill-[#00D2FF]" />
                                  </svg>
                                  <div className="absolute inset-0 bg-[radial-gradient(#ffffff_0.5px,transparent_0.5px)] [background-size:12px_12px] opacity-10"></div>
                                </div>

                                <div className="relative z-10 text-left flex justify-between items-start gap-2">
                                  <div>
                                    <h4 className={`text-base font-sans font-black text-white tracking-tight leading-tight transition-colors mb-1 uppercase ${
                                      !(trilhaItem.status === 'Em Construção') || isAdmin(currentUser?.email) ? 'group-hover:text-[#00D2FF]' : ''
                                    }`}>
                                      {trilhaName}
                                    </h4>
                                    <div className="flex flex-wrap gap-1.5 items-center">
                                      <span className="font-mono text-[9px] text-[#9cbfd5] bg-[#11212b]/90 border border-[#1c2c36] px-2 py-0.5 rounded tracking-wider uppercase">
                                        {trilhaCourses.length} Curso{trilhaCourses.length !== 1 ? 's' : ''}
                                      </span>
                                      {trilhaItem.status === 'Inativo' && (
                                        <span className="font-mono text-[9px] text-red-400 bg-red-950/40 border border-red-500/30 px-2 py-0.5 rounded tracking-wider uppercase font-bold">
                                          Inativo
                                        </span>
                                      )}
                                      {trilhaItem.status === 'Em Construção' && (
                                        <span className="font-mono text-[9px] text-[#E9C349] bg-amber-950/40 border border-[#E9C349]/35 px-2 py-0.5 rounded tracking-wider uppercase font-bold animate-pulse">
                                          Em breve para você
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  {isAdmin(currentUser?.email) && (
                                    <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          e.preventDefault();
                                          handleOpenTrilhaForm(trilhaItem);
                                        }}
                                        title="Editar Trilha"
                                        className="p-1.5 bg-[#1c2c36]/60 border border-[#1c2c36] hover:border-[#00D2FF] text-[#9cbfd5] hover:text-[#00D2FF] rounded transition-all cursor-pointer"
                                      >
                                        <Edit className="w-3 h-3" />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          e.preventDefault();
                                          handleDeleteTrilhaClick(trilhaItem);
                                        }}
                                        title="Deletar Trilha"
                                        className="p-1.5 bg-[#1c2c36]/60 border border-red-500/20 hover:border-red-500 text-[#9cbfd5] hover:text-red-400 rounded transition-all cursor-pointer"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </button>
                                    </div>
                                  )}
                                </div>

                                {/* Custom graphical element at the bottom as shown in Image 2 */}
                                <div 
                                  className={`relative z-10 w-full h-24 rounded-lg mt-3 overflow-hidden border flex items-center justify-center ${
                                    trilhaImage ? '' : `bg-gradient-to-br ${cardStyle}`
                                  }`}
                                  style={trilhaImage ? { backgroundImage: `url(${trilhaImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
                                >
                                  {trilhaImage && <div className="absolute inset-0 bg-black/65 backdrop-blur-[1.2px]" />}
                                  {/* Overlay content of the mesh */}
                                  <div className="relative z-10 text-center p-3 select-none">
                                    {trilhaItem.status === 'Em Construção' ? (
                                      <Construction className="w-6 h-6 mx-auto mb-1 text-[#E9C349] opacity-90 animate-bounce" />
                                    ) : (
                                      <BookOpen className="w-6 h-6 mx-auto mb-1 opacity-75" />
                                    )}
                                    <span className="block text-[8px] font-mono tracking-widest uppercase opacity-65">Jornada de Estudo</span>
                                    {trilhaItem.status === 'Em Construção' ? (
                                      <span className="block text-[10px] font-mono font-bold mt-1 text-[#E9C349]">EM CONSTRUÇÃO</span>
                                    ) : percent > 0 ? (
                                      <span className="block text-[10px] font-mono font-bold mt-1 text-[#00D2FF]">{percent}% CONCLUÍDO</span>
                                    ) : (
                                      <span className="block text-[10px] font-mono font-bold mt-1 opacity-50">NÃO INICIADO</span>
                                    )}
                                  </div>
                                  
                                  {/* Tiny subtle progress gauge inside the mesh area */}
                                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#1a0f12]/30">
                                    <div className="h-full bg-[#00D2FF]" style={{ width: `${percent}%` }}></div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="animate-fade-in text-left">
                        {/* TRILHA DETAIL PAGE VIEW (Image 3) */}
                        <button
                          onClick={() => {
                            setSelectedTrilha(null);
                            setExpandedCourseId(null);
                          }}
                          className="flex items-center gap-2 text-xs font-mono font-bold text-[#9cbfd5] hover:text-[#00D2FF] mb-5 cursor-pointer bg-transparent border-none transition-colors"
                        >
                          <ArrowLeft className="w-4 h-4" />
                          <span>Voltar para as Trilhas</span>
                        </button>

                        {/* Progress Bar Header Area matching Image 3 */}
                        {(() => {
                          const trilhaCourses = getTrilhaCourses(selectedTrilha);
                          const completedTrilhaCourses = trilhaCourses.filter(r => isCourseCompleted(r, currentUser?.email || 'guest'));
                          const completedTrilhaCount = completedTrilhaCourses.length;
                          const totalTrilhaCount = trilhaCourses.length;
                          const trilhaPercent = totalTrilhaCount > 0 ? Math.round((completedTrilhaCount / totalTrilhaCount) * 100) : 0;

                          return (
                            <>
                              <div className="bg-[#0a1b24] border border-[#1c2c36]/80 rounded-xl p-5 mb-6">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                  <div className="flex-1">
                                    {/* Progress Track and Fill */}
                                    <div className="relative w-full h-2.5 bg-[#05151e] rounded-full overflow-hidden border border-[#1c2c36]/60">
                                      <div 
                                        className="h-full bg-gradient-to-r from-[#00D2FF] to-[#0072ff] rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(0,210,255,0.4)]"
                                        style={{ width: `${trilhaPercent}%` }}
                                      />
                                    </div>
                                    <div className="mt-2 text-xs font-mono font-bold text-[#9cbfd5] flex justify-between select-none">
                                      <span>{trilhaPercent}% Cursos Finalizados</span>
                                      <span>({completedTrilhaCount} de {totalTrilhaCount} Cursos)</span>
                                    </div>
                                  </div>
                                  
                                  {/* Play, ThumbsUp, Heart actions from Screenshot 3 */}
                                  <div className="flex items-center gap-2 self-start sm:self-center">
                                    <button 
                                      title="Iniciar Trilha"
                                      onClick={() => {
                                        const nextCourse = trilhaCourses.find(c => !isCourseCompleted(c, currentUser?.email || 'guest')) || trilhaCourses[0];
                                        if (nextCourse) {
                                          setSelectedReport(nextCourse);
                                        }
                                      }}
                                      className="p-2.5 bg-[#0e212d] hover:bg-[#153041] hover:text-[#00D2FF] text-[#d4e5f2] border border-[#1c2c36] rounded-lg transition-all active:scale-95 cursor-pointer shadow-sm flex items-center justify-center"
                                    >
                                      <Play className="w-4 h-4 fill-current text-white" />
                                    </button>
                                    <button 
                                      title="Gostei da Trilha"
                                      className="p-2.5 bg-[#0e212d] hover:bg-[#153041] hover:text-[#00D2FF] text-[#d4e5f2] border border-[#1c2c36] rounded-lg transition-all active:scale-95 cursor-pointer shadow-sm flex items-center justify-center"
                                    >
                                      <ThumbsUp className="w-4 h-4 text-white" />
                                    </button>
                                    <button 
                                      title="Favoritar Trilha"
                                      className="p-2.5 bg-[#0e212d] hover:bg-[#153041] hover:text-rose-500 text-[#d4e5f2] border border-[#1c2c36] rounded-lg transition-all active:scale-95 cursor-pointer shadow-sm flex items-center justify-center"
                                    >
                                      <Heart className="w-4 h-4 text-white" />
                                    </button>
                                  </div>
                                </div>
                              </div>

                              <div className="mb-6">
                                <span className="block text-[11px] font-black tracking-widest text-[#00D2FF] uppercase font-sans">
                                  TRILHA
                                </span>
                                <h2 className="text-2xl md:text-3xl font-sans font-black text-white mt-1 leading-none uppercase">
                                  {selectedTrilha}
                                </h2>
                              </div>

                              {/* Accordion List of Courses inside the Trilha */}
                              <div className="space-y-3.5">
                                {trilhaCourses.map((course) => {
                                  const isCompleted = isCourseCompleted(course, currentUser?.email || 'guest');
                                  const coursePrereq = course.prerequisiteId ? reports.find(r => r.id === course.prerequisiteId) : undefined;
                                  const isPrereqLocked = !isAdmin(currentUser?.email) && coursePrereq && !isCourseCompleted(coursePrereq, currentUser?.email || 'guest');
                                  
                                  return (
                                    <div
                                      key={course.id}
                                      className="bg-[#0a1b24]/90 border border-[#1c2c36] rounded-xl p-4 md:p-5 transition-all text-left group"
                                    >
                                      <button
                                        onClick={() => setExpandedCourseId(expandedCourseId === course.id ? null : course.id)}
                                        className="w-full flex items-center justify-between gap-4 focus:outline-none"
                                      >
                                        <div className="flex items-center gap-3.5 text-left">
                                          {isCompleted ? (
                                            <div className="w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                                              <CheckCircle2 className="w-4 h-4" />
                                            </div>
                                          ) : isPrereqLocked ? (
                                            <div className="w-6 h-6 rounded-full bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-[#E9C349] shrink-0">
                                              <Lock className="w-3.5 h-3.5 text-[#E9C349]" />
                                            </div>
                                          ) : (
                                            <div className="w-6 h-6 rounded-full bg-[#11212b] border border-[#1c2c36] flex items-center justify-center text-[#00D2FF] shrink-0">
                                              <Play className="w-2.5 h-2.5 fill-current ml-0.5 text-[#00D2FF]" />
                                            </div>
                                          )}
                                          
                                          <div>
                                            <h4 className="text-sm font-sans font-extrabold text-white group-hover:text-[#00D2FF] transition-colors leading-tight">
                                              {course.title}
                                            </h4>
                                            <div className="flex items-center gap-2 mt-1">
                                              <span className="text-[10px] font-mono text-[#99907c] uppercase">Grau {course.nivelCurso || 1}</span>
                                              {course.status === 'Inativo' && isAdmin(currentUser?.email) && (
                                                <span className="text-[9px] font-mono text-red-400 uppercase bg-red-950/40 px-1.5 py-0.5 rounded border border-red-500/20">
                                                  Oculto / Inativo
                                                </span>
                                              )}
                                              {isPrereqLocked && (
                                                <span className="text-[9px] font-mono text-[#E9C349] uppercase bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-500/20">
                                                  Bloqueado por pré-requisito
                                                </span>
                                              )}
                                              {isCompleted && (
                                                <span className="text-[9px] font-mono text-emerald-400 uppercase bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-500/20">
                                                  Concluído
                                                </span>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                        
                                        <ChevronDown 
                                          className={`w-4 h-4 text-[#9cbfd5] transition-transform duration-300 shrink-0 ${
                                            expandedCourseId === course.id ? 'rotate-180 text-[#00D2FF]' : ''
                                          }`} 
                                        />
                                      </button>

                                      {expandedCourseId === course.id && (
                                        <div className="border-t border-[#1c2c36]/60 mt-4 pt-4 space-y-4 animate-fade-in text-left">
                                          {/* Description */}
                                          <div>
                                            <span className="block text-[9px] font-mono text-[#99907c] uppercase tracking-wider mb-1.5">Resumo do Conteúdo</span>
                                            <p className="font-mono italic text-xs text-[#d4e5f2]/80 leading-relaxed bg-[#05151e]/40 p-2.5 rounded border-l-2 border-[#00D2FF]/30">
                                              {course.summary || 'Nenhum resumo cadastrado para este curso.'}
                                            </p>
                                          </div>
                                          
                                          {/* Structure checklist */}
                                          <div className="bg-[#05151e]/60 p-3 rounded-lg border border-[#1c2c36]/40">
                                            <span className="block text-[9px] font-mono text-[#99907c] uppercase tracking-wider mb-2">Estrutura do Aprendizado</span>
                                            <div className="space-y-2">
                                              {[
                                                { key: 'htmlContent', label: 'Curso Interativo HTML', link: course.htmlContent },
                                                { key: 'customAccessUrl', label: 'Conteúdo Principal', link: course.customAccessUrl },
                                                { key: 'material1', label: course.material1Name || 'Material 1', link: course.material1Link || (course.material1Name ? 'has_name' : undefined) },
                                                { key: 'material2', label: course.material2Name || 'Material 2', link: course.material2Link || (course.material2Name ? 'has_name' : undefined) },
                                                { key: 'material3', label: course.material3Name || 'Material 3', link: course.material3Link || (course.material3Name ? 'has_name' : undefined) },
                                                { key: 'material4', label: course.material4Name || 'Material 4', link: course.material4Link || (course.material4Name ? 'has_name' : undefined) },
                                                { key: 'material5', label: course.material5Name || 'Material 5', link: course.material5Link || (course.material5Name ? 'has_name' : undefined) },
                                                { key: 'material6', label: course.material6Name || 'Material 6', link: course.material6Link || (course.material6Name ? 'has_name' : undefined) },
                                                { key: 'linked_questionnaire', label: 'Questionário de Avaliação', link: course.linkedQuestionnaireId ? 'quiz' : undefined },
                                              ].filter(item => !!item.link).map((item, idx) => {
                                                const isItemCompleted = (() => {
                                                  const saved = localStorage.getItem(`masonic_completed_${currentUser?.email || 'guest'}_${course.id}`);
                                                  if (!saved) return false;
                                                  const completedObj = JSON.parse(saved);
                                                  return !!completedObj[item.key];
                                                })();
                                                
                                                return (
                                                  <div key={idx} className="flex items-center justify-between text-xs font-mono bg-[#0c1d27]/40 px-2.5 py-1.5 rounded border border-[#1c2c36]/20">
                                                    <span className="text-[#d4e5f2]/90">{item.label}</span>
                                                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                                                      isItemCompleted 
                                                        ? 'bg-emerald-950/40 border border-emerald-500/20 text-emerald-400' 
                                                        : 'bg-slate-900/40 border border-slate-700/20 text-slate-400'
                                                    }`}>
                                                      {isItemCompleted ? 'CONCLUÍDO' : 'PENDENTE'}
                                                    </span>
                                                  </div>
                                                );
                                              })}
                                            </div>
                                          </div>
                                          
                                          {/* Action button */}
                                          <div className="flex justify-end pt-2">
                                            {isPrereqLocked ? (
                                              <button
                                                onClick={() => {
                                                  if (coursePrereq) {
                                                    setPrereqBlockedCourse(course);
                                                    setPrereqRequiredCourse(coursePrereq);
                                                  }
                                                }}
                                                className="bg-[#11212b] border border-amber-500/30 text-amber-500 hover:border-[#E9C349] hover:text-[#E9C349] font-mono text-xs font-bold px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                                              >
                                                <Lock className="w-3.5 h-3.5 text-[#E9C349]" />
                                                <span>BLOQUEADO (VER PRÉ-REQUISITO)</span>
                                              </button>
                                            ) : (
                                              <button
                                                onClick={() => handleAccessCourse(course)}
                                                className="bg-[#00D2FF]/10 border border-[#00D2FF]/40 text-[#00D2FF] hover:bg-[#00D2FF]/20 font-mono text-xs font-black px-5 py-2 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                                              >
                                                <BookOpen className="w-3.5 h-3.5" />
                                                <span>ACESSAR CURSO COMPLETO</span>
                                              </button>
                                            )}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        )}



        {/* --- BIBLIOTECA VIEW --- */}
        {activeTab === 'biblioteca' && currentUser && (
          <LibraryView
            books={lodgeBooks}
            currentUser={currentUser}
            isAdmin={isAdmin(currentUser.email)}
            globalSearchQuery={searchQuery}
            onGlobalSearchChange={setSearchQuery}
            onOpenSecureViewer={(url, title) => {
              setSecureViewerUrl(url);
              setSecureViewerTitle(title);
              setSecureViewerOpen(true);
            }}
            onAccessBook={(book) => {
              logAccess('book', book.id, book.title);
            }}
          />
        )}

        {/* --- ALERTAS VIEW --- */}
        {activeTab === 'alertas' && isAdmin(currentUser.email) && (
          <AlertsView
            alerts={lodgeAlerts}
            reports={lodgeReports}
            onMarkAllRead={handleMarkAllAlertsRead}
            onToggleRead={handleToggleAlertRead}
            onSelectReport={setSelectedReport}
          />
        )}

        {/* --- QUESTIONARIOS VIEW --- */}
        {activeTab === 'questionarios' && currentUser && (
          <QuestionnairesView
            currentUser={currentUser}
            isAdmin={isAdmin(currentUser.email)}
            questionnaires={questionnaires}
            reports={lodgeReports}
            onOpenCertificate={(recipientName, title, type, date, score, grade) => {
              setActiveCertificate({
                recipientName,
                title,
                type,
                date,
                score,
                grade,
                lodgeName: lodges.find(l => l.id === currentUser?.lodgeId)?.nome || currentUser?.loja
              });
            }}
          />
        )}

        {/* --- PERFIL VIEW --- */}
        {activeTab === 'perfil' && currentUser && (
          <ProfileView
            reports={lodgeReports}
            onUpdateImageLink={handleUpdateReportImage}
            onAddReport={handleAddReport}
            onImportReports={handleImportReports}
            onUpdateReport={handleUpdateReport}
            onDeleteReport={handleClearReport}
            isAdmin={isAdmin(currentUser.email)}
            accessUsers={accessUsers}
            onAddAccessUser={handleAddAccessUser}
            onUpdateAccessUser={handleUpdateAccessUser}
            onDeleteAccessUser={handleDeleteAccessUser}
            onImportAccessUsers={handleImportAccessUsers}
            currentUser={currentUser}
            theme={theme}
            onThemeChange={setTheme}
            books={lodgeBooks}
            onAddBook={handleAddBook}
            onUpdateBook={handleUpdateBook}
            onDeleteBook={handleDeleteBook}
            onBatchUpdateBooksStatus={handleBatchUpdateBooksStatus}
            onBatchDeleteBooks={handleBatchDeleteBooks}
            onImportBooks={handleImportBooks}
            accessLogs={accessLogs}
            lodges={lodges}
            onAddLodge={handleAddLodge}
            onUpdateLodge={handleUpdateLodge}
            onDeleteLodge={handleDeleteLodge}
            questionnaires={questionnaires}
            onAddQuestionnaire={handleAddQuestionnaire}
            onUpdateQuestionnaire={handleUpdateQuestionnaire}
            onDeleteQuestionnaire={handleDeleteQuestionnaire}
            onOpenCertificate={(recipientName, title, type, date, score, grade) => {
              setActiveCertificate({
                recipientName,
                title,
                type,
                date,
                score,
                grade,
                lodgeName: lodges.find(l => l.id === currentUser?.lodgeId)?.nome || currentUser?.loja
              });
            }}
          />
        )}

        {/* --- MANUAL VIEW --- */}
        {activeTab === 'manual' && (
          <UserManualView isAdmin={isAdmin(currentUser?.email)} />
        )}

      </main>

      {/* Floating Detailed Dialog / Screen for clicked card */}
      {selectedReport && (
        <ReportDetail
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
          onUpdateImage={handleUpdateReportImage}
          isAdmin={isAdmin(currentUser.email)}
          onUpdateReportField={handleUpdateReportField}
          currentUser={currentUser}
          onToggleCompletion={() => setCompletedStateVersion(prev => prev + 1)}
          onGoToQuestionnaire={(quizId) => {
            localStorage.setItem('masonic_selected_quiz_id', quizId);
            setActiveTab('questionarios');
            setSelectedReport(null);
          }}
          onOpenSecureViewer={(url, title, htmlContent) => {
            setSecureViewerUrl(url);
            setSecureViewerTitle(title);
            setSecureViewerHtmlContent(htmlContent || '');
            setSecureViewerOpen(true);
          }}
          onOpenCertificate={(recipientName, title, type, date, score, grade) => {
            setActiveCertificate({
              recipientName,
              title,
              type,
              date,
              score,
              grade,
              lodgeName: lodges.find(l => l.id === currentUser?.lodgeId)?.nome || currentUser?.loja
            });
          }}
        />
      )}

      {/* Quick Image Attachment Modal (Standalone) */}
      {linkingReportId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[#0c1d27] border-2 border-[#D4AF37] rounded-xl p-5 w-full max-w-md text-left shadow-2xl relative font-sans">
            <h3 className="font-sans font-bold text-base text-[#d4e5f2] flex items-center gap-2 border-b border-[#1c2c36] pb-2">
              <ImageIcon className="w-5 h-5 text-[#E9C349]" /> Inserir Gráfico HTML Direto
            </h3>
            
            <p className="text-xs text-[#99907c] font-mono mt-2 mb-4 leading-normal">
              Insira a URL de um infográfico online ou elemento visual para anexar permanentemente a este título:
            </p>

            <input
              type="url"
              placeholder="https://exemplo.com/dashboards/vendas.png"
              value={quickImageInput}
              onChange={(e) => setQuickImageInput(e.target.value)}
              className="w-full bg-[#04141d] border border-[#1c2c36] text-xs p-3 rounded text-[#d4e5f2] focus:outline-none focus:border-[#E9C349]"
            />

            <div className="flex justify-end gap-2.5 mt-5">
              <button
                onClick={() => setLinkingReportId(null)}
                className="text-xs font-mono font-bold text-[#99907c] hover:text-[#d4e5f2] px-3.5 py-2.5 rounded hover:bg-[#11212b]"
              >
                Cancelar
              </button>
              
              <button
                onClick={submitQuickImageLink}
                className="bg-[#E9C349] text-[#241a00] text-xs font-mono font-bold px-5 py-2.5 rounded hover:bg-[#ffe088]"
              >
                Confirmar Vínculo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Banner Image Modal (Standalone) */}
      {isEditingBanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[#0c1d27] border-2 border-[#D4AF37] rounded-xl p-5 w-full max-w-md text-left shadow-2xl relative font-sans animate-fade-in max-h-[90vh] overflow-y-auto">
            <h3 className="font-sans font-bold text-base text-[#d4e5f2] flex items-center gap-2 border-b border-[#1c2c36] pb-2">
              <ImageIcon className="w-5 h-5 text-[#E9C349]" /> Editar Imagem do Banner
            </h3>
            
            {/* Input URL */}
            <div className="space-y-1.5 mt-4">
              <label className="block text-[10px] font-mono text-[#9cbfd5] uppercase tracking-wider">
                URL da Imagem Online
              </label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/photo-..."
                value={bannerImageInput}
                onChange={(e) => {
                  setBannerImageInput(e.target.value);
                  setBannerUploadError(null);
                }}
                className="w-full bg-[#04141d] border border-[#1c2c36] text-xs p-3 rounded text-[#d4e5f2] focus:outline-none focus:border-[#E9C349]"
              />
            </div>

            {/* Separator */}
            <div className="flex items-center gap-2 my-4 select-none">
              <div className="h-[1px] bg-[#1c2c36] flex-1" />
              <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">ou</span>
              <div className="h-[1px] bg-[#1c2c36] flex-1" />
            </div>

            {/* Local Upload */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-mono text-[#9cbfd5] uppercase tracking-wider mb-1">
                Upload do Computador
              </label>
              
              <div 
                className="border-2 border-dashed border-[#1c2c36] hover:border-[#E9C349]/60 rounded-xl p-5 bg-[#04141d] transition-all flex flex-col items-center justify-center text-center group cursor-pointer relative"
                onClick={() => document.getElementById('banner-file-input')?.click()}
              >
                <input
                  id="banner-file-input"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    
                    // Allow up to 10MB now since we compress client-side
                    if (file.size > 10 * 1024 * 1024) {
                      setBannerUploadError("Imagem muito grande (máx 10MB).");
                      return;
                    }
                    
                    const reader = new FileReader();
                    reader.onload = async (event) => {
                      if (event.target?.result) {
                        try {
                          const base64Str = event.target.result as string;
                          const compressed = await compressImage(base64Str, 1200, 450, 0.75);
                          setBannerImageInput(compressed);
                          setBannerUploadError(null);
                        } catch (err) {
                          console.error("Erro ao comprimir imagem:", err);
                          setBannerImageInput(event.target.result as string);
                          setBannerUploadError(null);
                        }
                      }
                    };
                    reader.readAsDataURL(file);
                  }}
                />
                
                <Upload className="w-7 h-7 text-[#99907c] group-hover:text-[#E9C349] transition-colors mb-2" />
                
                <p className="text-xs text-[#d4e5f2] font-semibold">
                  Clique para escolher uma imagem
                </p>
                <p className="text-[9px] text-[#99907c] font-mono mt-1">
                  Formatos aceitos: JPG, PNG, WEBP (Máx 2.5MB)
                </p>
              </div>

              {bannerUploadError && (
                <p className="text-[11px] font-mono text-red-400 mt-1.5 bg-red-950/20 px-2 py-1 rounded border border-red-900/40">
                  ⚠️ {bannerUploadError}
                </p>
              )}

              {/* Show preview of selected image */}
              {bannerImageInput && (
                <div className="mt-4 pt-4 border-t border-[#1c2c36] transition-all">
                  <span className="block text-[10px] font-mono text-[#9cbfd5] uppercase tracking-wider mb-2">
                    Pré-visualização do Banner:
                  </span>
                  <div className="relative w-full h-24 rounded-lg overflow-hidden border border-[#1c2c36] bg-[#04141d]">
                    <img 
                      src={bannerImageInput} 
                      alt="Miniatura do banner pré-visualizado" 
                      className="w-full h-full object-cover"
                      onError={() => {
                        setBannerUploadError("Erro ao carregar pré-visualização da imagem.");
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2.5 mt-5 border-t border-[#1c2c36] pt-4">
              <button
                onClick={() => setIsEditingBanner(false)}
                className="text-xs font-mono font-bold text-[#99907c] hover:text-[#d4e5f2] px-3.5 py-2.5 rounded hover:bg-[#11212b]"
              >
                Cancelar
              </button>
              
              <button
                onClick={submitBannerEdit}
                className="bg-[#E9C349] text-[#241a00] text-xs font-mono font-bold px-5 py-2.5 rounded hover:bg-[#ffe088] transition-all duration-200"
              >
                Salvar Configurações
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Security Access Blocked Modal (Degree Verification Guard) */}
      {accessBlockedCourseTitle !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md font-sans">
          <div className="bg-[#0c1d27] border-2 border-[#D4AF37] rounded-2xl p-6 sm:p-8 w-full max-w-md text-center shadow-2xl relative animate-fade-in">
            <div className="w-16 h-16 bg-[#E9C349]/10 border-2 border-[#E9C349] rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-[#E9C349]" />
            </div>
            
            <h3 className="font-sans font-black text-lg text-[#E9C349] uppercase tracking-wider">
              Acesso Restrito ao Grau
            </h3>
            
            <div className="flex flex-col gap-1.5 items-center mb-4">
              <span className="text-[10px] text-[#9cbfd5] font-mono uppercase tracking-widest bg-[#11212b] px-3 py-1 rounded-full border border-[#1c2c36] inline-block">
                Seu Grau: {getDegreeLabel(Number(currentUser ? (currentUser.nivelAcesso || '1') : '1'))}
              </span>
              <span className="text-[10px] text-[#E9C349] font-mono uppercase tracking-widest bg-[#11212b] px-3 py-1 rounded-full border border-[#D4AF37]/30 inline-block">
                Requerido: {getDegreeLabel(Number(accessBlockedRequiredLevel || 1))}
              </span>
            </div>

            <div className="bg-[#04141d] rounded-xl p-4 border border-[#1c2c36] text-left space-y-2 mb-6 font-sans">
              <span className="block text-[9px] font-mono text-[#99907c] uppercase">INFORMAÇÃO CORPORATIVA</span>
              <p className="text-xs font-mono font-medium text-[#d4e5f2]">
                Título: <span className="text-[#a5b8c7] font-sans font-semibold">{accessBlockedCourseTitle}</span>
              </p>
              <p className="text-[11px] font-sans text-[#E4C868] font-semibold mt-1 bg-amber-950/20 px-2.5 py-1.5 rounded border border-[#E9C349]/20 italic">
                &ldquo;este material ainda não é do seu Grau&rdquo;
              </p>
            </div>

            <button
              onClick={() => {
                setAccessBlockedCourseTitle(null);
                setAccessBlockedRequiredLevel(null);
              }}
              className="w-full bg-[#E9C349] hover:bg-[#ffe088] text-[#241a00] font-sans font-extrabold text-xs py-3 rounded-lg transition-colors shadow-md uppercase tracking-wider pointer-events-auto"
            >
              Compreendi e retornarei depois
            </button>
          </div>
        </div>
      )}

      {/* Prerequisite Journey Blocked Modal */}
      {prereqBlockedCourse && prereqRequiredCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md font-sans">
          <div className="bg-[#0c1d27] border-2 border-[#E9C349] rounded-2xl p-6 sm:p-8 w-full max-w-lg text-center shadow-2xl relative animate-fade-in">
            <div className="w-16 h-16 bg-[#E9C349]/10 border-2 border-[#E9C349] rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Lock className="w-8 h-8 text-[#E9C349]" />
            </div>

            <h3 className="font-sans font-black text-lg text-[#E9C349] uppercase tracking-wider mb-2">
              Curso Bloqueado - Próxima Etapa da Trilha
            </h3>

            <p className="text-xs text-[#9cbfd5] font-mono mb-6">
              Este curso faz parte de uma jornada de aprendizado sequencial.
            </p>

            {/* Visual Journey Connection Map */}
            <div className="bg-[#04141d] rounded-2xl p-5 border border-[#1c2c36] mb-6 text-left space-y-4">
              <span className="block text-[9px] font-mono text-[#99907c] uppercase tracking-wider">Jornada de Aprendizado</span>
              
              <div className="flex flex-col gap-3 relative">
                {/* Step 1: Prerequisite */}
                <div className="flex items-start gap-3 bg-[#11212b]/50 p-3 rounded-xl border border-[#1ea296]/20">
                  <div className="w-6 h-6 rounded-full bg-[#1ea296]/10 border border-[#1ea296]/30 flex items-center justify-center text-xs text-[#66d9cc] font-mono shrink-0">
                    1
                  </div>
                  <div>
                    <span className="block text-[9px] font-mono text-[#99907c] uppercase">CURSO PRÉ-REQUISITO (FALTA CONCLUIR)</span>
                    <h4 className="text-xs font-sans font-bold text-[#66d9cc]">{prereqRequiredCourse.title}</h4>
                    <span className="text-[9px] font-mono text-[#9cbfd5] bg-[#11212b] px-1.5 py-0.5 rounded border border-[#1c2c36] mt-1 inline-block">
                      {prereqRequiredCourse.category}
                    </span>
                  </div>
                </div>

                {/* Vertical Connector Line */}
                <div className="absolute left-6 top-11 bottom-11 w-[2px] bg-dashed border-l-2 border-dashed border-[#E9C349]/30 z-0"></div>

                {/* Step 2: Target Course (Locked) */}
                <div className="flex items-start gap-3 bg-[#11212b]/20 p-3 rounded-xl border border-amber-500/10 relative z-1">
                  <div className="w-6 h-6 rounded-full bg-amber-950/20 border border-[#E9C349]/30 flex items-center justify-center text-xs text-[#E9C349] font-mono shrink-0">
                    <Lock className="w-3 h-3 text-[#E9C349]" />
                  </div>
                  <div>
                    <span className="block text-[9px] font-mono text-[#99907c] uppercase">ESTE CURSO (BLOQUEADO)</span>
                    <h4 className="text-xs font-sans font-bold text-[#a5b8c7]">{prereqBlockedCourse.title}</h4>
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  setPrereqBlockedCourse(null);
                  setPrereqRequiredCourse(null);
                }}
                className="flex-1 bg-[#11212b] hover:bg-[#1a2e3b] text-[#d4e5f2] border border-[#1c2c36] font-sans font-extrabold text-xs py-3 rounded-lg transition-colors uppercase tracking-wider cursor-pointer"
              >
                Voltar ao Catálogo
              </button>
              <button
                onClick={() => {
                  const target = prereqRequiredCourse;
                  setPrereqBlockedCourse(null);
                  setPrereqRequiredCourse(null);
                  setSelectedReport(target);
                }}
                className="flex-1 bg-[#E9C349] hover:bg-[#ffe088] text-[#241a00] font-sans font-extrabold text-xs py-3 rounded-lg transition-colors shadow-md uppercase tracking-wider cursor-pointer flex items-center justify-center gap-1.5"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Acessar Pré-requisito</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Embedded Protective Document Viewer */}
      <SecureViewerModal
        isOpen={secureViewerOpen}
        onClose={() => {
          setSecureViewerOpen(false);
          setSecureViewerHtmlContent('');
        }}
        url={secureViewerUrl}
        title={secureViewerTitle}
        htmlContent={secureViewerHtmlContent}
      />

      {/* Trilha Create/Edit Modal */}
      {isEditingTrilha && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md font-sans">
          <div className="bg-[#0c1d27] border border-[#1c2c36] rounded-2xl w-full max-w-2xl text-left shadow-2xl relative flex flex-col max-h-[90vh] animate-fadeIn">
            {/* Header */}
            <div className="p-5 border-b border-[#1c2c36] flex items-center justify-between">
              <h3 className="font-sans font-black text-sm text-[#d4e5f2] uppercase tracking-wider select-none">
                {editingTrilha ? `Editar Trilha: ${editingTrilha.name}` : 'Criar Nova Trilha'}
              </h3>
              <button
                onClick={() => setIsEditingTrilha(false)}
                className="text-[#9cbfd5] hover:text-white font-mono text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Content (Scrollable) */}
            <div className="p-6 overflow-y-auto space-y-5 flex-1">
              {/* Name */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-mono text-[#99907c] uppercase tracking-wider font-bold">
                  Nome da Trilha
                </label>
                <input
                  type="text"
                  value={trilhaFormName}
                  onChange={(e) => setTrilhaFormName(e.target.value)}
                  placeholder="Ex: Aprendiz Maçom, Companheiro..."
                  className="w-full bg-[#04141d] border border-[#1c2c36] rounded-lg px-3.5 py-2 text-xs font-sans text-white focus:outline-hidden focus:border-[#00D2FF]"
                />
              </div>

              {/* Image URL */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-mono text-[#99907c] uppercase tracking-wider font-bold">
                  URL da Imagem da Trilha (Opcional)
                </label>
                <input
                  type="text"
                  value={trilhaFormImage}
                  onChange={(e) => setTrilhaFormImage(e.target.value)}
                  placeholder="https://exemplo.com/imagem.jpg"
                  className="w-full bg-[#04141d] border border-[#1c2c36] rounded-lg px-3.5 py-2 text-xs font-sans text-white focus:outline-hidden focus:border-[#00D2FF]"
                />
                <p className="text-[10px] text-[#99907c] font-mono">Deixe vazio para usar a malha cósmica geométrica padrão.</p>
              </div>

              {/* Status */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-mono text-[#99907c] uppercase tracking-wider font-bold">
                  Status da Trilha
                </label>
                <select
                  value={trilhaFormStatus}
                  onChange={(e) => setTrilhaFormStatus(e.target.value as 'Ativo' | 'Inativo' | 'Em Construção')}
                  className="w-full bg-[#04141d] border border-[#1c2c36] rounded-lg px-3.5 py-2 text-xs font-sans text-white focus:outline-hidden focus:border-[#00D2FF]"
                >
                  <option value="Ativo">Ativo (Visível no Início)</option>
                  <option value="Inativo">Inativo (Oculto no Início)</option>
                  <option value="Em Construção">Em Construção (Visível com selo, mas bloqueado)</option>
                </select>
                <p className="text-[10px] text-[#99907c] font-mono">Trilhas em construção são visíveis aos alunos, mas exibem o selo "Em breve para você" e não podem ser abertas.</p>
              </div>

              {/* Course Sequence Builder */}
              <div className="space-y-2.5">
                <label className="block text-[10px] font-mono text-[#99907c] uppercase tracking-wider font-bold">
                  Sequência de Cursos (Trilha de Aprendizado)
                </label>

                {trilhaFormCourses.length === 0 ? (
                  <div className="border border-dashed border-[#1c2c36] rounded-xl p-6 text-center text-[#99907c]">
                    <Layers className="w-8 h-8 mx-auto mb-2 opacity-30 text-[#99907c]" />
                    <p className="text-xs font-mono">Nenhum curso associado a esta trilha ainda.</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {trilhaFormCourses.map((cId, idx) => {
                      const course = reports.find(r => r.id === cId);
                      return (
                        <div
                          key={cId}
                          className="bg-[#04141d] border border-[#1c2c36] rounded-xl p-3 flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="w-5 h-5 rounded-full bg-[#00D2FF]/10 border border-[#00D2FF]/30 text-[#00D2FF] flex items-center justify-center font-mono text-[10px] font-bold shrink-0">
                              {idx + 1}
                            </span>
                            <div>
                              <span className="block text-[8px] font-mono text-[#99907c] uppercase">
                                Grau {course?.securityLevel || 1}
                              </span>
                              <h4 className="text-xs font-sans font-bold text-[#d4e5f2] leading-tight line-clamp-1">
                                {course ? course.title : 'Curso Deletado ou Inexistente'}
                              </h4>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => moveCourse(idx, 'up')}
                              disabled={idx === 0}
                              className="p-1 bg-[#11212b] hover:bg-[#1c2c36] text-[#9cbfd5] hover:text-[#00D2FF] disabled:opacity-30 border border-[#1c2c36] rounded cursor-pointer transition-colors"
                              title="Mover para cima"
                            >
                              <MoveUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => moveCourse(idx, 'down')}
                              disabled={idx === trilhaFormCourses.length - 1}
                              className="p-1 bg-[#11212b] hover:bg-[#1c2c36] text-[#9cbfd5] hover:text-[#00D2FF] disabled:opacity-30 border border-[#1c2c36] rounded cursor-pointer transition-colors"
                              title="Mover para baixo"
                            >
                              <MoveDown className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setTrilhaFormCourses(trilhaFormCourses.filter(id => id !== cId));
                              }}
                              className="p-1 bg-[#11212b] hover:bg-red-950/20 text-[#9cbfd5] hover:text-red-400 border border-[#1c2c36] hover:border-red-500/20 rounded cursor-pointer transition-colors"
                              title="Remover da trilha"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Dropdown to add more courses */}
                {reports.filter(r => !trilhaFormCourses.includes(r.id)).length > 0 ? (
                  <div className="bg-[#04141d]/55 border border-[#1c2c36] rounded-xl p-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mt-2">
                    <div className="flex-1">
                      <span className="block text-[8px] font-mono text-[#99907c] uppercase mb-1">Adicionar Curso à Trilha</span>
                      <select
                        id="add-course-to-trilha-select"
                        defaultValue=""
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val) {
                            setTrilhaFormCourses([...trilhaFormCourses, val]);
                            e.target.value = ""; // Reset
                          }
                        }}
                        className="w-full bg-[#0c1d27] border border-[#1c2c36] rounded px-2.5 py-1.5 text-xs text-[#d4e5f2] focus:outline-hidden"
                      >
                        <option value="" disabled>Selecione um curso para adicionar...</option>
                        {reports
                          .filter(r => !trilhaFormCourses.includes(r.id))
                          .map(r => (
                            <option key={r.id} value={r.id}>
                              [{r.category || 'Geral'}] {r.title}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                ) : (
                  <p className="text-[10px] text-[#99907c] font-mono italic">Todos os cursos disponíveis no sistema já estão incluídos nesta trilha.</p>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-5 border-t border-[#1c2c36] flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsEditingTrilha(false)}
                className="text-xs font-mono font-bold text-[#99907c] hover:text-[#d4e5f2] px-4 py-2.5 rounded hover:bg-[#11212b] cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={submitTrilhaForm}
                disabled={isSavingTrilha}
                className="bg-[#00D2FF] hover:bg-[#33dfff] text-slate-950 text-xs font-mono font-black px-5 py-2.5 rounded disabled:opacity-50 transition-all cursor-pointer flex items-center gap-1.5"
              >
                {isSavingTrilha ? (
                  <span>Salvando...</span>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Salvar Trilha</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Trilha Confirmation Modal */}
      {trilhaToDelete && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-[#0b1924] border border-red-500/30 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <div className="p-2.5 bg-red-500/10 rounded-xl border border-red-500/20">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="font-sans font-bold text-lg text-white">Excluir Trilha</h3>
            </div>

            <p className="text-xs font-sans text-[#9cbfd5] leading-relaxed">
              Tem certeza que deseja excluir a trilha <strong className="text-white">"{trilhaToDelete.name}"</strong>?
              Os cursos contidos nesta trilha não serão apagados, apenas retornarão para a categoria <span className="text-[#00D2FF]">Geral</span>.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setTrilhaToDelete(null)}
                disabled={isDeletingTrilha}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#9cbfd5] hover:text-white hover:bg-[#1c2c36] transition-all cursor-pointer font-sans"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => executeDeleteTrilha(trilhaToDelete)}
                disabled={isDeletingTrilha}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-red-500 hover:bg-red-600 text-white transition-all shadow-md flex items-center gap-2 cursor-pointer font-sans"
              >
                {isDeletingTrilha ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Excluindo...</span>
                  </>
                ) : (
                  <span>Confirmar Exclusão</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Visual Certificate Generator Modal */}
      {activeCertificate && (
        <CertificateModal
          certificate={activeCertificate}
          onClose={() => setActiveCertificate(null)}
          isAdmin={isAdmin(currentUser?.email)}
        />
      )}

      {/* Sticky Bottom Nav Bar with Alarms count badge */}
      <BottomNav
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        unreadAlertsCount={unreadAlertsCount}
        showProfileButton={true}
        isAdminUser={isAdmin(currentUser.email)}
      />

    </div>
  );
}
