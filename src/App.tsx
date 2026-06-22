import React, { useState, useEffect } from 'react';
import { INITIAL_REPORTS, INITIAL_ALERTS } from './data';
import { ExecutiveReport, SystemAlert, AccessUser } from './types';
import { initializeFirebase, handleFirestoreError, OperationType, cleanObjectForFirestore } from './firebase';
import { collection, doc, getDocs, setDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
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
import { Search, Info, LogIn, ChevronRight, BookOpen, Layers, Shield, Image as ImageIcon, LayoutGrid, List, Upload } from 'lucide-react';
import InlineEditable from './components/InlineEditable';
import { compressImage } from './utils';

export const isAdmin = (email: string | undefined): boolean => {
  if (!email) return false;
  const lower = email.toLowerCase().trim();
  if (lower === 'dani.nanda.lucas@gmail.com') return true;
  
  try {
    const saved = localStorage.getItem('masonic_current_user_v1');
    if (saved) {
      const parsed = JSON.parse(saved) as AccessUser;
      if (parsed && parsed.email.toLowerCase().trim() === lower && parsed.tipoUsuario === 'admin') {
        return true;
      }
    }
  } catch (e) {}

  try {
    const savedUsers = localStorage.getItem('masonic_access_users_v1');
    if (savedUsers) {
      const usersList = JSON.parse(savedUsers) as AccessUser[];
      const found = usersList.find(u => u.email.toLowerCase().trim() === lower);
      if (found && found.tipoUsuario === 'admin') {
        return true;
      }
    }
  } catch (e) {}

  return false;
};

export default function App() {
  // Navigation tabs of bottom bar
  const [activeTab, setActiveTab] = useState<'inicio' | 'alertas' | 'perfil' | 'questionarios' | 'manual'>('inicio');

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
  
  const [sortBy, setSortBy] = useState<'id' | 'titulo' | 'grau' | 'atualizacao'>('id');

  // Simulated active user & accesses database
  const [currentUser, setCurrentUser] = useState<AccessUser | null>(null);
  const [isSessionLoaded, setIsSessionLoaded] = useState(false);
  const [accessUsers, setAccessUsers] = useState<AccessUser[]>(() => {
    const saved = localStorage.getItem('masonic_access_users_v1');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
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
        allowedReportIds: '*',
        status: 'Ativo',
        nivelAcesso: '33'
      },
      {
        id: 'usr-gisela',
        name: 'Gisela S. (CEO)',
        email: 'gisela.ceo@masonicacademy.com.br',
        allowedReportIds: 'rep-estrategia-segmentos',
        status: 'Ativo',
        nivelAcesso: '15'
      },
      {
        id: 'usr-rodrigo',
        name: 'Rodrigo M. (Produtos)',
        email: 'rodrigo.rm@masonicacademy.com.br',
        allowedReportIds: 'rep-visao-uso-rm',
        status: 'Ativo',
        nivelAcesso: '10'
      },
      {
        id: 'usr-fabio',
        name: 'Fábio T. (Serviços)',
        email: 'fabio.sve@masonicacademy.com.br',
        allowedReportIds: 'rep-servico-praticas',
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
  const [selectedReport, setSelectedReport] = useState<ExecutiveReport | null>(null);

  // Custom access level verification state for degree lock screen modal
  const [accessBlockedCourseTitle, setAccessBlockedCourseTitle] = useState<string | null>(null);
  const [accessBlockedRequiredLevel, setAccessBlockedRequiredLevel] = useState<number | null>(null);

  const handleAccessCourse = (report: ExecutiveReport) => {
    const isUserAdmin = isAdmin(currentUser?.email);
    const userLevel = currentUser ? parseInt(String(currentUser.nivelAcesso || (isUserAdmin ? '33' : '1')), 10) : 1;
    const courseLevel = report.nivelCurso || 1;

    if (!isUserAdmin && userLevel < courseLevel) {
      setAccessBlockedCourseTitle(report.title);
      setAccessBlockedRequiredLevel(courseLevel);
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

  // Load from Firestore (if configured) or LocalStorage fallback
  useEffect(() => {
    const savedCurrentUser = localStorage.getItem('masonic_current_user_v1');
    if (savedCurrentUser) {
      setCurrentUser(JSON.parse(savedCurrentUser));
    } else {
      setCurrentUser(null);
    }

    let unsubReports: () => void = () => {};
    let unsubAlerts: () => void = () => {};
    let unsubUsers: () => void = () => {};
    let unsubBanner: () => void = () => {};

    const loadInitialData = async () => {
      const { db } = initializeFirebase();
      if (db) {
        try {
          let reportsReady = false;
          let alertsReady = false;
          let usersReady = false;

          const checkReady = () => {
            if (reportsReady && alertsReady && usersReady) {
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
                allowedReportIds: '*',
                status: 'Ativo',
                nivelAcesso: '33'
              },
              {
                id: 'usr-gisela',
                name: 'Gisela S. (CEO)',
                email: 'gisela.ceo@masonicacademy.com.br',
                allowedReportIds: 'rep-estrategia-segmentos',
                status: 'Ativo',
                nivelAcesso: '15'
              },
              {
                id: 'usr-rodrigo',
                name: 'Rodrigo M. (Produtos)',
                email: 'rodrigo.rm@masonicacademy.com.br',
                allowedReportIds: 'rep-visao-uso-rm',
                status: 'Ativo',
                nivelAcesso: '10'
              },
              {
                id: 'usr-fabio',
                name: 'Fábio T. (Serviços)',
                email: 'fabio.sve@masonicacademy.com.br',
                allowedReportIds: 'rep-servico-praticas',
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
                loadedUsers.push(docSnap.data() as AccessUser);
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

          return; // Skip local storage fallback
        } catch (err) {
          console.error('Falha de inicialização em tempo real do Firestore:', err);
        }
      }

      // Fallback: LocalStorage loading
      const savedReports = localStorage.getItem('masonic_reports_v1');
      const savedAlerts = localStorage.getItem('masonic_alerts_v1');
      const savedAccessUsers = localStorage.getItem('masonic_access_users_v1');

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

      if (savedAccessUsers) {
        setAccessUsers(JSON.parse(savedAccessUsers));
      } else {
        const defaultUsers: AccessUser[] = [
          {
            id: 'usr-nanda',
            name: 'Daniel Luciano',
            email: 'dani.nanda.lucas@gmail.com',
            allowedReportIds: '*',
            status: 'Ativo',
            nivelAcesso: '33'
          },
          {
            id: 'usr-gisela',
            name: 'Gisela S. (CEO)',
            email: 'gisela.ceo@masonicacademy.com.br',
            allowedReportIds: 'rep-estrategia-segmentos',
            status: 'Ativo',
            nivelAcesso: '15'
          },
          {
            id: 'usr-rodrigo',
            name: 'Rodrigo M. (Produtos)',
            email: 'rodrigo.rm@masonicacademy.com.br',
            allowedReportIds: 'rep-visao-uso-rm',
            status: 'Ativo',
            nivelAcesso: '10'
          },
          {
            id: 'usr-fabio',
            name: 'Fábio T. (Serviços)',
            email: 'fabio.sve@masonicacademy.com.br',
            allowedReportIds: 'rep-servico-praticas',
            status: 'Inativo',
            nivelAcesso: '5'
          }
        ];
        setAccessUsers(defaultUsers);
        localStorage.setItem('masonic_access_users_v1', JSON.stringify(defaultUsers));
      }
      setIsSessionLoaded(true);
    };

    loadInitialData();

    return () => {
      unsubReports();
      unsubAlerts();
      unsubUsers();
      unsubBanner();
    };
  }, []);

  // Synchronize currentUser with the latest from accessUsers list whenever accessUsers is updated!
  useEffect(() => {
    if (currentUser && accessUsers.length > 0) {
      const match = accessUsers.find(u => u.email.toLowerCase() === currentUser.email.toLowerCase());
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
          match.cidadeLoja !== currentUser.cidadeLoja
        ) {
          setCurrentUser(match);
          localStorage.setItem('masonic_current_user_v1', JSON.stringify(match));
        }
      }
    }
  }, [accessUsers, currentUser]);

  // Cloud sync helpers
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
    // If the simulated session user has changed to someone that isn't admin, switch navigation tab out of settings
    if (!isAdmin(user.email) && activeTab === 'perfil') {
      setActiveTab('inicio');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('masonic_current_user_v1');
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
        allowedReportIds: '*',
        status: 'Ativo'
      };
      setCurrentUser(admin);
      localStorage.setItem('masonic_current_user_v1', JSON.stringify(admin));
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

  // Add a new executive report
  const handleAddReport = (newRep: ExecutiveReport) => {
    const updated = [...reports, newRep];
    saveReportsState(updated);
    syncReportToCloud(newRep);
    
    // Auto add a system alert logging the inclusion
    const newAlert: SystemAlert = {
      id: `alert-add-${Date.now()}`,
      title: 'Novo Título Cadastrado',
      description: `O título "${newRep.title}" foi adicionado com sucesso ao sistema por Daniel Luciano.`,
      time: 'Agora mesmo',
      reportId: newRep.id,
      type: 'update',
      read: false
    };
    saveAlertsState([newAlert, ...alerts]);
    syncAlertToCloud(newAlert);
  };

  // Import a list of reports from spreadsheet
  const handleImportReports = async (newReps: ExecutiveReport[]) => {
    const updated = [...reports, ...newReps];
    saveReportsState(updated);
    
    // Cloud sync all of them in parallel
    const { db } = initializeFirebase();
    if (db) {
      try {
        const batchPromise = newReps.map(rep => 
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
      description: `${newReps.length} novos títulos foram importados com sucesso para o sistema por Daniel Luciano via arquivo Excel.`,
      time: 'Agora mesmo',
      type: 'update',
      read: false
    };
    saveAlertsState([newAlert, ...alerts]);
    syncAlertToCloud(newAlert);
  };

  // Update an existing executive report
  const handleUpdateReport = (updatedRep: ExecutiveReport) => {
    const updated = reports.map(r => r.id === updatedRep.id ? updatedRep : r);
    saveReportsState(updated);
    syncReportToCloud(updatedRep);

    // Auto add a system alert logging the revision
    const newAlert: SystemAlert = {
      id: `alert-edit-${Date.now()}`,
      title: 'Métricas de Título Atualizadas',
      description: `Parâmetros e diretrizes de "${updatedRep.title}" foram revisados por Daniel Luciano.`,
      time: 'Agora mesmo',
      reportId: updatedRep.id,
      type: 'update',
      read: false
    };
    saveAlertsState([newAlert, ...alerts]);
    syncAlertToCloud(newAlert);

    // Update opened drawer report if it matches
    if (selectedReport && selectedReport.id === updatedRep.id) {
      setSelectedReport(updatedRep);
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
      read: false
    };
    saveAlertsState([newAlert, ...alerts]);
    syncAlertToCloud(newAlert);

    // Close drawer if deleted report was open
    if (selectedReport && selectedReport.id === reportId) {
      setSelectedReport(null);
    }
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

  // Compute unique categories from reports dynamics
  const availableCategories: string[] = ['TODOS', ...Array.from(new Set<string>(reports.map(r => r.category.trim()).filter(Boolean)))];

  // Filter computation logic (Search string + Active Category tab selection)
  const filteredReports = reports.filter((report) => {
    const matchesCategory = activeCategory === 'TODOS' || report.category.trim().toLowerCase() === activeCategory.trim().toLowerCase();
    const matchesSearch = 
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      
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
    
    // If report is inactive, do not show to standard users
    const isStandard = currentUser.tipoUsuario === 'padrao';
    if (isStandard && report.status === 'Inativo') {
      return false;
    }

    if (isAdmin(currentUser.email)) {
      return true; // Root administrative privileges
    }
    if (!currentUser.allowedReportIds) return false;
    const allowedList = currentUser.allowedReportIds
      .split(',')
      .map(id => id.trim().toLowerCase())
      .filter(Boolean);
    return allowedList.includes(report.id.toLowerCase());
  }).filter((report) => {
    if (progressFilter === 'todos') return true;

    const emailKey = currentUser?.email || 'guest';
    const saved = localStorage.getItem(`masonic_completed_${emailKey}_${report.id}`);
    const completedMaterials = saved ? JSON.parse(saved) : {};
    
    let totalCount = 0;
    let completedCount = 0;
    
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
        return dashboardTitle;
      case 'alertas':
        return 'Central de Alertas';
      case 'perfil':
        return 'Perfil e Ferramentas';
      case 'questionarios':
        return 'Central de Simulados';
      case 'manual':
        return 'Manual do Usuário';
      default:
        return dashboardTitle;
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
            
            {/* Quick Greeting Header Banner */}
            <div id="exec-greeting" className="bg-[#0c1d27] rounded-xl p-5 border border-[#1c2c36] flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="font-sans font-bold text-lg text-[#d4e5f2] tracking-tight">
                  <InlineEditable
                    value={dashboardTitle}
                    isAdmin={isAdmin(currentUser.email)}
                    onSave={(val) => {
                      setDashboardTitle(val);
                      localStorage.setItem('masonic_dashboard_title', val);
                    }}
                    className="font-sans font-bold text-lg text-[#d4e5f2] tracking-tight"
                  />
                </h2>
                <p className="text-xs text-[#99907c] font-mono mt-1 animate-fade-in pb-0.5">
                  Aluno Ativo: <strong className="text-[#E9C349] font-sans text-xs">{currentUser.name}</strong>
                </p>
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <div className="flex items-center gap-2.5 text-[11px] font-mono bg-[#11212b] px-3 py-1.5 rounded-lg border border-[#1a2d39]">
                  <span className={`w-2 h-2 rounded-full animate-pulse bg-[#66d9cc] ${isUserInactive ? 'bg-rose-500' : 'bg-[#66d9cc]'}`}></span>
                  <span className="text-[#99907c]">{isUserInactive ? 'Acesso Revogado / Inativo' : 'Sessão Ativa'}</span>
                </div>
                {isAdmin(currentUser.email) && (
                  <div className="relative group select-none">
                    <span className="text-[10px] font-mono text-[#99907c] pr-1 cursor-help flex items-center gap-1 hover:text-[#66d9cc] transition-colors">
                      Usuários com sessões ativas: <strong className="text-[#66d9cc]">{accessUsers.filter(u => u.status === 'Ativo').length}</strong>
                    </span>
                    
                    {/* Hover dropdown list of active users */}
                    <div className="absolute right-0 top-full mt-1.5 hidden group-hover:block w-56 bg-[#0c1d27] border border-[#1c2c36] rounded-lg p-3 shadow-2xl z-50 animate-fadeIn">
                      <div className="text-[9px] font-mono text-[#94a9b8] uppercase tracking-wider mb-2 pb-1.5 border-b border-[#1c2c36] flex items-center justify-between">
                        <span>Usuários Ativos</span>
                        <span className="text-[#66d9cc] font-bold">{accessUsers.filter(u => u.status === 'Ativo').length}</span>
                      </div>
                      <div className="max-h-48 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-[#1c2c36] pr-1">
                        {accessUsers.filter(u => u.status === 'Ativo').length === 0 ? (
                          <div className="text-[10px] font-mono text-gray-500 italic p-1">
                            Nenhum usuário ativo
                          </div>
                        ) : (
                          accessUsers.filter(u => u.status === 'Ativo').map((u) => (
                            <div key={u.id} className="flex items-center gap-2 p-1 rounded hover:bg-[#11212b] transition-colors text-left">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#66d9cc]" />
                              <div className="min-w-0 flex-1">
                                <div className="text-xs font-sans font-medium text-[#d4e5f2] truncate" title={u.name}>
                                  {u.name}
                                </div>
                                <div className="text-[9px] font-mono text-[#99907c] truncate" title={u.email}>
                                  {u.email}
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

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
                {/* View switcher header row */}
                <div className="flex items-center justify-between pb-3.5 border-b border-[#1c2c36]/50 mb-2">
                  <h3 className="font-sans font-bold text-xs text-[#9cbfd5] tracking-widest uppercase mb-0">
                    Catálogo de Títulos
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
                  <div id="course-status-filter" className="flex flex-wrap items-center gap-1.5 animate-fadeIn">
                    <span className="text-[#99907c] mr-1 uppercase select-none font-bold text-[10px]">Filtrar por:</span>
                    {[
                      { id: 'todos', label: 'Todos os Títulos' },
                      { id: 'concluidos', label: 'Somente Concluídos' },
                      { id: 'andamento', label: 'Somente em Andamento' },
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
                      { id: 'id', label: 'ID' },
                      { id: 'titulo', label: 'Título' },
                      { id: 'grau', label: 'Grau' },
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
                  className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 gap-x-5" : "flex flex-col gap-1.5"}
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
            )}
          </div>
        )}



        {/* --- ALERTAS VIEW --- */}
        {activeTab === 'alertas' && isAdmin(currentUser.email) && (
          <AlertsView
            alerts={alerts}
            reports={reports}
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
          />
        )}

        {/* --- PERFIL VIEW --- */}
        {activeTab === 'perfil' && currentUser && (
          <ProfileView
            reports={reports}
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
            currentUser={currentUser}
          />
        )}

        {/* --- MANUAL VIEW --- */}
        {activeTab === 'manual' && (
          <UserManualView />
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
            
            <p className="text-xs text-[#9cbfd5] font-mono mt-1.5 uppercase tracking-widest bg-[#11212b] px-3 py-1 rounded-full border border-[#1c2c36] inline-block mb-4">
              Grau Atual: {currentUser ? (currentUser.nivelAcesso || '1') : '1'} &bull; Requerido: {accessBlockedRequiredLevel}
            </p>

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
