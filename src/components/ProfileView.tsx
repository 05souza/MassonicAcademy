import React, { useState, useEffect, useMemo } from 'react';
import * as XLSX from 'xlsx';
import { ExecutiveReport, AccessUser, Questionnaire, Book, Lodge } from '../types';
import { getFirebaseConfig, saveFirebaseConfig } from '../firebase';
import { getDegreeLabel as getGlobalDegreeLabel } from '../utils/degrees';
import { 
  User, Mail, Building, Shield, Image as ImageIcon, Plus, 
  Trash2, Link, Check, ExternalLink, Calendar, Edit, 
  X, Search, Layers, FileText, Sliders, BarChart3, ChevronRight, HelpCircle,
  Upload, Download, Database, Phone, Home, Compass, MapPin, Sun, Moon, BookOpen
} from 'lucide-react';
import { compressImage } from '../utils';

interface ProfileViewProps {
  reports: ExecutiveReport[];
  onUpdateImageLink: (reportId: string, url: string) => void;
  onAddReport: (newReport: ExecutiveReport) => void;
  onUpdateReport: (updatedReport: ExecutiveReport) => void;
  onDeleteReport: (reportId: string) => void;
  isAdmin: boolean;
  onImportReports?: (newReports: ExecutiveReport[]) => void;
  
  // Access Control Props
  accessUsers: AccessUser[];
  onAddAccessUser: (user: AccessUser) => void;
  onUpdateAccessUser: (user: AccessUser) => void;
  onDeleteAccessUser: (userId: string) => void;
  onImportAccessUsers?: (newUsers: AccessUser[]) => void;
  currentUser?: AccessUser | null;
  
  // Theme selection props
  theme?: 'dark' | 'light';
  onThemeChange?: (theme: 'dark' | 'light') => void;

  // Books Props
  books?: Book[];
  onAddBook?: (newBook: Book) => void;
  onUpdateBook?: (updatedBook: Book) => void;
  onDeleteBook?: (bookId: string) => void;
  onBatchUpdateBooksStatus?: (bookIds: string[], status: 'Ativo' | 'Inativo') => void;
  onBatchDeleteBooks?: (bookIds: string[]) => void;
  onImportBooks?: (newBooks: Book[]) => void;

  // Access Logs Prop
  accessLogs?: any[];

  // Lodges Props
  lodges?: Lodge[];
  onAddLodge?: (lodge: Lodge) => void;
  onUpdateLodge?: (lodge: Lodge) => void;
  onDeleteLodge?: (lodgeId: string) => void;
}

export default function ProfileView({ 
  reports, 
  onUpdateImageLink,
  onAddReport,
  onUpdateReport,
  onDeleteReport,
  isAdmin,
  onImportReports,
  accessUsers,
  onAddAccessUser,
  onUpdateAccessUser,
  onDeleteAccessUser,
  onImportAccessUsers,
  currentUser,
  theme = 'dark',
  onThemeChange,
  books = [],
  onAddBook,
  onUpdateBook,
  onDeleteBook,
  onBatchUpdateBooksStatus,
  onBatchDeleteBooks,
  onImportBooks,
  accessLogs = [],
  lodges = [],
  onAddLodge,
  onUpdateLodge,
  onDeleteLodge
}: ProfileViewProps) {
  const getInitials = (name: any) => {
    if (!name || typeof name !== 'string') return 'DL';
    return name
      .trim()
      .split(/\s+/)
      .map(part => part[0] || '')
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const getLogsToRender = () => {
    return accessLogs || [];
  };

  const nameToDisplay = currentUser?.name || 'Administrador';
  const initials = getInitials(nameToDisplay) || 'AD';
  const emailToDisplay = currentUser?.email || 'dani.nanda.lucas@gmail.com';
  const lowerEmail = emailToDisplay.toLowerCase().trim();
  const isMaster = lowerEmail === 'dani.nanda.lucas@gmail.com';
  
  const displaySegment = isMaster ? 'Masonic Academy Ops' : 'Acadêmico';
  const displayAccess = isMaster ? 'Grau Diretor (Mestre)' : `Acesso: Nível ${currentUser?.nivelAcesso || 1}`;

  const isStandardUser = currentUser?.tipoUsuario === 'padrao';

  const [currentTimeTick, setCurrentTimeTick] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTimeTick(Date.now());
    }, 30000); // refresh every 30 seconds
    return () => clearInterval(timer);
  }, []);

  const visibleAccessUsers = (accessUsers || []).filter(u => {
    if (isMaster) return true;
    if ((u.email || '').toLowerCase().trim() === 'dani.nanda.lucas@gmail.com') return false;
    const uLodge = u.lodgeId || 'lodge-cavaleiros';
    const userLodgeId = currentUser?.lodgeId || 'lodge-cavaleiros';
    return uLodge === userLodgeId;
  });

  const onlineUsers = useMemo(() => {
    return visibleAccessUsers.filter(u => {
      if (currentUser && u.id === currentUser.id) return true; // always online if it is the current user logged in on this tab
      if (!u.lastActiveAt) return false;
      const lastActiveTime = new Date(u.lastActiveAt).getTime();
      return (currentTimeTick - lastActiveTime) < 5 * 60 * 1000; // 5 minutes
    });
  }, [visibleAccessUsers, currentTimeTick, currentUser]);

  // Main settings tabs
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'reports' | 'accesses' | 'database' | 'books' | 'accessStats' | 'lodges'>('profile');

  useEffect(() => {
    if (isStandardUser && activeSubTab !== 'profile') {
      setActiveSubTab('profile');
    } else if (!isMaster && (activeSubTab === 'database' || activeSubTab === 'accessStats')) {
      setActiveSubTab('profile');
    }
  }, [isStandardUser, isMaster, activeSubTab]);
  
  // Access CRUD interface state
  const [accessSearchQuery, setAccessSearchQuery] = useState('');
  const [showUserForm, setShowUserForm] = useState(false);
  const [isCreatingNewUser, setIsCreatingNewUser] = useState(true);
  const [editUserId, setEditUserId] = useState<string | null>(null);
  
  // Access Form Field States
  const [userFormName, setUserFormName] = useState('');
  const [userFormEmail, setUserFormEmail] = useState('');
  const [userFormUserAcesso, setUserFormUserAcesso] = useState('');
  const [userFormAllowedReports, setUserFormAllowedReports] = useState('');
  const [userFormStatus, setUserFormStatus] = useState<'Ativo' | 'Inativo'>('Ativo');
  const [userFormTipoUsuario, setUserFormTipoUsuario] = useState<'admin' | 'padrao'>('padrao');
  const [userFormNivelAcesso, setUserFormNivelAcesso] = useState('');
  const [userFormPassword, setUserFormPassword] = useState('');
  const [userFormTelefone, setUserFormTelefone] = useState('');
  const [userFormLoja, setUserFormLoja] = useState('');
  const [userFormPotencia, setUserFormPotencia] = useState('');
  const [userFormCidadeLoja, setUserFormCidadeLoja] = useState('');
  const [userFormAvatarUrl, setUserFormAvatarUrl] = useState('');
  const [userFormLodgeId, setUserFormLodgeId] = useState('');

  // Lodge Management States
  const [showLodgeForm, setShowLodgeForm] = useState(false);
  const [isCreatingNewLodge, setIsCreatingNewLodge] = useState(true);
  const [editLodgeId, setEditLodgeId] = useState<string | null>(null);
  const [lodgeFormNome, setLodgeFormNome] = useState('');
  const [lodgeFormPotencia, setLodgeFormPotencia] = useState('');
  const [lodgeFormCidade, setLodgeFormCidade] = useState('');
  const [lodgeFormNumero, setLodgeFormNumero] = useState('');
  const [lodgeFormEstado, setLodgeFormEstado] = useState('');
  const [lodgeFormTema, setLodgeFormTema] = useState<'cavaleiros' | 'templo' | 'ecletico' | 'carbono'>('cavaleiros');
  const [lodgeFormLogoUrl, setLodgeFormLogoUrl] = useState('');
  const [lodgeCrudError, setLodgeCrudError] = useState<string | null>(null);
  const [lodgeCrudSuccess, setLodgeCrudSuccess] = useState<string | null>(null);
  
  // Self Editing State
  const [isEditingSelf, setIsEditingSelf] = useState(false);
  const [selfTelefone, setSelfTelefone] = useState('');
  const [selfLoja, setSelfLoja] = useState('');
  const [selfPotencia, setSelfPotencia] = useState('');
  const [selfCidadeLoja, setSelfCidadeLoja] = useState('');
  const [selfPassword, setSelfPassword] = useState('');
  const [selfEmail, setSelfEmail] = useState('');
  const [selfAvatarUrl, setSelfAvatarUrl] = useState('');
  const [selfName, setSelfName] = useState('');
  
  const [userCrudError, setUserCrudError] = useState<string | null>(null);
  const [userCrudSuccess, setUserCrudSuccess] = useState<string | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

  // Access Stats / Reports tab filter state
  const [reportsTab, setReportsTab] = useState<'logins' | 'courses' | 'books'>('logins');
  const [reportsGrouping, setReportsGrouping] = useState<'by-item' | 'by-user'>('by-item');
  const [searchLogUser, setSearchLogUser] = useState('');

  // Firebase Database Configuration State
  const initialFb = getFirebaseConfig();
  const [fbApiKey, setFbApiKey] = useState(initialFb?.apiKey || '');
  const [fbAuthDomain, setFbAuthDomain] = useState(initialFb?.authDomain || '');
  const [fbProjectId, setFbProjectId] = useState(initialFb?.projectId || '');
  const [fbStorageBucket, setFbStorageBucket] = useState(initialFb?.storageBucket || '');
  const [fbMessagingSenderId, setFbMessagingSenderId] = useState(initialFb?.messagingSenderId || '');
  const [fbAppId, setFbAppId] = useState(initialFb?.appId || '');
  const [fbJsonPaste, setFbJsonPaste] = useState('');
  const [fbStatusMessage, setFbStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  // JSON copy paste helper
  const handleJsonPasteChange = (val: string) => {
    setFbJsonPaste(val);
    if (!val.trim()) return;
    try {
      // clean copy-paste of JS/HTML objects
      let cleaned = val.trim();
      // If user pasted something like: apiKey: "...", convert to JSON if it is not valid JSON
      if (cleaned.startsWith('{') && cleaned.endsWith('}')) {
        // try direct JSON parsing
        const parsed = JSON.parse(cleaned);
        if (parsed.apiKey) setFbApiKey(parsed.apiKey);
        if (parsed.authDomain) setFbAuthDomain(parsed.authDomain);
        if (parsed.projectId) setFbProjectId(parsed.projectId);
        if (parsed.storageBucket) setFbStorageBucket(parsed.storageBucket);
        if (parsed.messagingSenderId) setFbMessagingSenderId(parsed.messagingSenderId);
        if (parsed.appId) setFbAppId(parsed.appId);
        setFbStatusMessage({ type: 'success', text: 'Objeto de configuração JSON detectado e preenchido!' });
        return;
      }

      // try parsing common Javascript objects like: apiKey: "..."
      const lines = cleaned.split('\n');
      const keys = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
      let foundAny = false;
      lines.forEach(line => {
        keys.forEach(k => {
          if (line.includes(k)) {
            // extract everything between quotes or double quotes
            const match = line.match(/["']([^"']+)["']/);
            if (match && match[1]) {
              foundAny = true;
              if (k === 'apiKey') setFbApiKey(match[1]);
              if (k === 'authDomain') setFbAuthDomain(match[1]);
              if (k === 'projectId') setFbProjectId(match[1]);
              if (k === 'storageBucket') setFbStorageBucket(match[1]);
              if (k === 'messagingSenderId') setFbMessagingSenderId(match[1]);
              if (k === 'appId') setFbAppId(match[1]);
            }
          }
        });
      });
      if (foundAny) {
        setFbStatusMessage({ type: 'success', text: 'Parâmetros identificados e preenchidos a partir do código colado!' });
      } else {
        // Just try parsing raw string to json
        throw new Error();
      }
    } catch (e) {
      setFbStatusMessage({ type: 'error', text: 'Não foi possível interpretar o código/JSON colado. Tente preencher os campos manualmente.' });
    }
  };

  const handleSaveFirebaseSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setFbStatusMessage(null);

    if (!fbApiKey.trim() || !fbProjectId.trim() || !fbAppId.trim()) {
      setFbStatusMessage({ type: 'error', text: 'Chave de API, ID do Projeto e ID do App são obrigatórios.' });
      return;
    }

    const config = {
      apiKey: fbApiKey.trim(),
      authDomain: fbAuthDomain.trim(),
      projectId: fbProjectId.trim(),
      storageBucket: fbStorageBucket.trim(),
      messagingSenderId: fbMessagingSenderId.trim(),
      appId: fbAppId.trim()
    };

    const isSuccess = saveFirebaseConfig(config);
    if (isSuccess) {
      setFbStatusMessage({ type: 'success', text: 'Configurações de nuvem salvas! O sistema irá reiniciar para ativar a conexão em tempo real com seu Firestore.' });
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } else {
      setFbStatusMessage({ type: 'error', text: 'Ocorreu um erro ao salvar os parâmetros.' });
    }
  };

  const handleClearFirebaseSettings = () => {
    saveFirebaseConfig(null);
    setFbApiKey('');
    setFbAuthDomain('');
    setFbProjectId('');
    setFbStorageBucket('');
    setFbMessagingSenderId('');
    setFbAppId('');
    setFbJsonPaste('');
    setFbStatusMessage({ type: 'success', text: 'Banco desconectado. O sistema voltará a utilizar o armazenamento local quando a página recarregar.' });
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };
  
  // CRUD Interface State
  const [reportsSearchQuery, setReportsSearchQuery] = useState('');
  const [reportsStatusFilter, setReportsStatusFilter] = useState<'todos' | 'Ativo' | 'Inativo'>('todos');
  const [accessStatusFilter, setAccessStatusFilter] = useState<'todos' | 'Ativo' | 'Inativo'>('todos');
  const [showForm, setShowForm] = useState(false);
  const [showImportPanel, setShowImportPanel] = useState(false);
  const [importedRows, setImportedRows] = useState<ExecutiveReport[]>([]);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);

  // Access Import States
  const [showAccessImportPanel, setShowAccessImportPanel] = useState(false);
  const [importedAccessRows, setImportedAccessRows] = useState<AccessUser[]>([]);
  const [accessImportError, setAccessImportError] = useState<string | null>(null);
  const [accessImportSuccess, setAccessImportSuccess] = useState<string | null>(null);

  const handleExcelFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError(null);
    setImportSuccess(null);
    setImportedRows([]);

    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstream = evt.target?.result;
        if (!bstream) {
          setImportError("Não foi possível ler o arquivo.");
          return;
        }

        const data = new Uint8Array(bstream as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        const jsonData = XLSX.utils.sheet_to_json<any>(worksheet);
        
        if (!jsonData || jsonData.length === 0) {
          setImportError("Planilha vazia ou em formato incorreto.");
          return;
        }

        const parsedReports: ExecutiveReport[] = [];

        for (let i = 0; i < jsonData.length; i++) {
          const row = jsonData[i];
          
          let title = '';
          let owner = '';
          let nivelCurso = 1;
          let status: 'Ativo' | 'Inativo' = 'Ativo';
          let summary = '';
          let tags: string[] = [];
          let material1Link = '';
          let material2Link = '';
          let material3Link = '';
          let material4Link = '';
          let material5Link = '';
          let material6Link = '';

          Object.keys(row).forEach(key => {
            const k = key.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
            const val = row[key];
            if (val === undefined || val === null) return;
            const strVal = String(val).trim();

            if (k === 'titulo' || k === 'title' || k === 'nome' || k === 'name') {
              title = strVal;
            } else if (k === 'instrutor' || k === 'owner' || k === 'instructor' || k === 'responsavel' || k === 'autor' || k === 'author') {
              owner = strVal;
            } else if (k === 'grau' || k === 'nivelcurso' || k === 'level' || k === 'degree' || k === 'nivel') {
              const num = parseInt(strVal.replace(/\D/g, ''), 10);
              nivelCurso = !isNaN(num) ? num : 1;
              if (nivelCurso < 1) nivelCurso = 1;
              if (nivelCurso > 33) nivelCurso = 33;
            } else if (k === 'status') {
              if (strVal.toLowerCase() === 'inativo') {
                status = 'Inativo';
              } else {
                status = 'Ativo';
              }
            } else if (k === 'resumo' || k === 'summary' || k === 'descricao' || k === 'description') {
              summary = strVal;
            } else if (k === 'tags' || k === 'tag' || k === 'palavras-chave' || k === 'palavras chave') {
              tags = strVal ? strVal.split(',').map(t => t.trim()).filter(Boolean) : [];
            } else if (k === 'link material 1' || k === 'linkmaterial1' || k === 'material1link' || k === 'material 1') {
              material1Link = strVal;
            } else if (k === 'link material 2' || k === 'linkmaterial2' || k === 'material2link' || k === 'material 2') {
              material2Link = strVal;
            } else if (k === 'link material 3' || k === 'linkmaterial3' || k === 'material3link' || k === 'material 3') {
              material3Link = strVal;
            } else if (k === 'link material 4' || k === 'linkmaterial4' || k === 'material4link' || k === 'material 4') {
              material4Link = strVal;
            } else if (k === 'link material 5' || k === 'linkmaterial5' || k === 'material5link' || k === 'material 5') {
              material5Link = strVal;
            } else if (k === 'link material 6' || k === 'linkmaterial6' || k === 'material6link' || k === 'material 6') {
              material6Link = strVal;
            }
          });

          if (!title) {
            continue;
          }

          const titleSlug = title
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');

          const cleanId = `rep-${titleSlug || Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

          const newRep: ExecutiveReport = {
            id: cleanId,
            title: title,
            category: 'Geral',
            tags: tags,
            department: 'Masonic Academy',
            summary: summary || `Importado de planilha Excel por Daniel Luciano. Instrutor: ${owner || 'Não especificado'}.`,
            fullMarkdown: `# ${title}\n\n**Instrutor:** ${owner || 'Daniel Luciano'}\n**Grau Requerido:** Grau ${nivelCurso}\n\n### Diretrizes do Curso\n${summary || 'Insira os tópicos, atualizações e informações específicas para este título aqui.'}`,
            leftBorderColor: 'gold',
            lastUpdated: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).replace('.', ''),
            owner: owner || 'Daniel Luciano',
            confidentiality: 'Interno',
            nivelCurso: nivelCurso,
            conteudoSemProva: false,
            status: status,
            material1Link: material1Link || undefined,
            material2Link: material2Link || undefined,
            material3Link: material3Link || undefined,
            material4Link: material4Link || undefined,
            material5Link: material5Link || undefined,
            material6Link: material6Link || undefined,
          };

          parsedReports.push(newRep);
        }

        if (parsedReports.length === 0) {
          setImportError("Não foram encontrados registros válidos. Verifique as colunas (titulo, status).");
          return;
        }

        setImportedRows(parsedReports);

      } catch (err: any) {
        setImportError("Erro ao processar planilha: " + (err.message || String(err)));
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleConfirmImport = () => {
    if (importedRows.length === 0) return;
    
    if (onImportReports) {
      onImportReports(importedRows);
    } else {
      importedRows.forEach(rep => onAddReport(rep));
    }

    setImportSuccess(`${importedRows.length} títulos importados com sucesso!`);
    setImportedRows([]);
    
    setTimeout(() => {
      setShowImportPanel(false);
      setImportSuccess(null);
    }, 4000);
  };

  const downloadCourseModelExcel = () => {
    const modelData = [
      {
        "titulo": "Simbologia do Templo de Salomão",
        "status": "Ativo",
        "instrutor": "Daniel Luciano",
        "grau": 1,
        "resumo": "Uma introdução aos símbolos fundamentais do Templo de Salomão e sua aplicação prática nos estudos de Grau 1.",
        "tags": "Símbolos, Templo, História",
        "link material 1": "https://exemplo.com/apostila1.pdf",
        "link material 2": "https://exemplo.com/anexo.pdf",
        "link material 3": "",
        "link material 4": "",
        "link material 5": "",
        "link material 6": ""
      },
      {
        "titulo": "O Segredo dos Símbolos Antigos",
        "status": "Ativo",
        "instrutor": "Almir de Alencar",
        "grau": 2,
        "resumo": "Exploração avançada de iconografia mística em ordens de cavalaria clássicas.",
        "tags": "Filosofia, Símbolos",
        "link material 1": "https://exemplo.com/material-cavaleiros.pdf",
        "link material 2": "",
        "link material 3": "",
        "link material 4": "",
        "link material 5": "",
        "link material 6": ""
      },
      {
        "titulo": "Curso em Construção Exemplar",
        "status": "Inativo",
        "instrutor": "Daniel Luciano",
        "grau": 3,
        "resumo": "Este curso está atualmente arquivado ou em fase de planejamento, por isso o status é Inativo.",
        "tags": "Filosofia, História",
        "link material 1": "",
        "link material 2": "",
        "link material 3": "",
        "link material 4": "",
        "link material 5": "",
        "link material 6": ""
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(modelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Modelo Cursos");

    worksheet["!cols"] = [
      { wch: 35 }, // titulo
      { wch: 10 }, // status
      { wch: 20 }, // instrutor
      { wch: 8 },  // grau
      { wch: 45 }, // resumo
      { wch: 25 }, // tags
      { wch: 30 }, // link material 1
      { wch: 30 }, // link material 2
      { wch: 30 }, // link material 3
      { wch: 30 }, // link material 4
      { wch: 30 }, // link material 5
      { wch: 30 }  // link material 6
    ];

    XLSX.writeFile(workbook, "modelo_importacao_cursos.xlsx");
  };

  // Access Import Helper Functions
  const downloadAccessModelExcel = () => {
    const modelData = [
      {
        "Nome Completo": "Carlos Silva",
        "E-mail": "carlos.silva@masonicacademy.com",
        "User de Acesso": "carlossilva",
        "Senha": "senha_masonic_123",
        "Grau (1 a 3)": 1,
        "Telefone": "(11) 99999-9999",
        "Loja": "Loja Simbólica Harmonia Nº 45",
        "Potência": "GOSP",
        "Cidade Loja": "São Paulo",
        "Acesso aos Cursos (Lista de IDs ou * para todos)": "*"
      },
      {
        "Nome Completo": "José de Souza",
        "E-mail": "jose.souza@masonicacademy.com",
        "User de Acesso": "josesouza",
        "Senha": "senha_masonic_456",
        "Grau (1 a 3)": 2,
        "Telefone": "(21) 98888-8888",
        "Loja": "Luz do Oriente Nº 12",
        "Potência": "GLMERJ",
        "Cidade Loja": "Rio de Janeiro",
        "Acesso aos Cursos (Lista de IDs ou * para todos)": "rep-inst-123, rep-inst-456"
      },
      {
        "Nome Completo": "Mateus Oliveira",
        "E-mail": "mateus.oliveira@masonicacademy.com",
        "User de Acesso": "mateusoliveira",
        "Senha": "senha_masonic_789",
        "Grau (1 a 3)": 3,
        "Telefone": "(31) 97777-7777",
        "Loja": "Fraternidade Mineira Nº 88",
        "Potência": "GOMG",
        "Cidade Loja": "Belo Horizonte",
        "Acesso aos Cursos (Lista de IDs ou * para todos)": "*"
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(modelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Planilha Modelo");

    // Adjust column widths
    const max_len = [20, 30, 18, 18, 12, 16, 32, 12, 18, 45];
    worksheet["!cols"] = max_len.map(w => ({ wch: w }));

    XLSX.writeFile(workbook, "modelo_importacao_acessos.xlsx");
  };

  const handleAccessExcelFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccessImportError(null);
    setAccessImportSuccess(null);
    setImportedAccessRows([]);

    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstream = evt.target?.result;
        if (!bstream) {
          setAccessImportError("Não foi possível ler o arquivo.");
          return;
        }

        const data = new Uint8Array(bstream as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        const jsonData = XLSX.utils.sheet_to_json<any>(worksheet);
        
        if (!jsonData || jsonData.length === 0) {
          setAccessImportError("Planilha vazia ou em formato incorreto.");
          return;
        }

        const parsedUsers: AccessUser[] = [];

        for (let i = 0; i < jsonData.length; i++) {
          const row = jsonData[i];
          
          let name = '';
          let email = '';
          let userAcesso = '';
          let password = '';
          let nivelAcesso = '1';
          let telefone = '';
          let loja = '';
          let potencia = '';
          let cidadeLoja = '';
          let allowedReportIds = '*';

          Object.keys(row).forEach(key => {
            const k = key.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
            const kNoSpaces = k.replace(/[\s\-_]+/g, '');
            const val = String(row[key] !== undefined && row[key] !== null ? row[key] : '').trim();

            if (k === 'nome' || k === 'name' || kNoSpaces === 'nomecompleto' || kNoSpaces === 'fullname') {
              name = val;
            } else if (k === 'email' || k === 'mail' || kNoSpaces === 'email') {
              email = val;
            } else if (k === 'user' || k === 'usuario' || k === 'username' || kNoSpaces === 'useracesso' || kNoSpaces === 'userdeacesso') {
              userAcesso = val;
            } else if (k === 'senha' || k === 'password' || k === 'pass' || k === 'code') {
              password = val;
            } else if (k === 'grau' || k === 'level' || k === 'degree' || kNoSpaces === 'nivelacesso' || kNoSpaces === 'grau1a3' || kNoSpaces === 'grau(1a3)') {
              const num = parseInt(val.replace(/\D/g, ''), 10);
              nivelAcesso = !isNaN(num) ? String(num) : '1';
            } else if (k === 'telefone' || k === 'tel' || k === 'phone') {
              telefone = val;
            } else if (k === 'loja' || k === 'lodge' || k === 'oficina') {
              loja = val;
            } else if (k === 'potencia' || k === 'jurisdicao' || kNoSpaces === 'grandeloja') {
              potencia = val;
            } else if (kNoSpaces === 'cidadeloja' || k === 'cidade' || k === 'city') {
              cidadeLoja = val;
            } else if (k === 'acesso' || k === 'acessos' || k === 'cursos' || kNoSpaces === 'allowedreportids' || kNoSpaces === 'acessoaoscursos' || kNoSpaces === 'acessoaoscursos(listadeidsou*paratodos)') {
              allowedReportIds = val || '*';
            }
          });

          // Validation: nome completo e (email ou user de acesso) são obrigatórios
          if (!name || (!email && !userAcesso)) {
            continue; // Ignora linhas inválidas que não possuem nome completo, ou que não possuem nem e-mail nem user de acesso
          }

          // Se o e-mail estiver presente, valida o formato. Se não estiver e tiver user de acesso, geramos um e-mail fictício compatível
          if (email && !email.includes('@')) {
            continue; // Ignora se o e-mail não tiver um formato válido
          }

          if (!email && userAcesso) {
            email = `${userAcesso.toLowerCase()}@import.local`;
          }

          const cleanId = `usr-imp-${Math.floor(100 + Math.random() * 900)}-${Date.now().toString().slice(-4)}`;
          
          const userLodgeId = currentUser?.lodgeId || 'lodge-cavaleiros';
          const matchedLodge = (lodges || []).find(l => l.id === userLodgeId);

          const newUser: AccessUser = {
            id: cleanId,
            name: name,
            email: email.toLowerCase().trim(),
            userAcesso: userAcesso || undefined,
            password: password || 'masonic123',
            nivelAcesso: nivelAcesso,
            telefone: telefone || undefined,
            loja: isMaster ? (loja || undefined) : (matchedLodge?.nome || undefined),
            potencia: isMaster ? (potencia || undefined) : (matchedLodge?.potencia || undefined),
            cidadeLoja: isMaster ? (cidadeLoja || undefined) : (matchedLodge?.cidade || undefined),
            allowedReportIds: allowedReportIds,
            status: 'Ativo',
            tipoUsuario: 'padrao',
            lodgeId: isMaster ? undefined : userLodgeId
          };

          parsedUsers.push(newUser);
        }

        if (parsedUsers.length === 0) {
          setAccessImportError("Não foram encontrados registros válidos. Verifique se o arquivo contém Nome Completo e pelo menos o E-mail ou o User de Acesso.");
          return;
        }

        setImportedAccessRows(parsedUsers);

      } catch (err: any) {
        setAccessImportError("Erro ao processar planilha: " + (err.message || String(err)));
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleConfirmAccessImport = () => {
    if (importedAccessRows.length === 0) return;
    
    if (onImportAccessUsers) {
      onImportAccessUsers(importedAccessRows);
    } else {
      importedAccessRows.forEach(user => onAddAccessUser(user));
    }

    setAccessImportSuccess(`${importedAccessRows.length} acessos importados com sucesso!`);
    setImportedAccessRows([]);
    
    setTimeout(() => {
      setShowAccessImportPanel(false);
      setAccessImportSuccess(null);
    }, 4000);
  };
  const [isCreatingNew, setIsCreatingNew] = useState(true);
  const [editReportId, setEditReportId] = useState<string | null>(null);
  const [crudError, setCrudError] = useState<string | null>(null);
  const [crudSuccess, setCrudSuccess] = useState<string | null>(null);
  const [deletingReportId, setDeletingReportId] = useState<string | null>(null);

  // Form Field States
  const [formId, setFormId] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<string>('ESTRATÉGIA');
  const [formTags, setFormTags] = useState('');
  const [formDepartment, setFormDepartment] = useState('');
  const [formSummary, setFormSummary] = useState('');
  const [formFullMarkdown, setFormFullMarkdown] = useState('');
  const [formLeftBorderColor, setFormLeftBorderColor] = useState<'gold' | 'teal' | 'blue' | 'purple'>('gold');
  const [formOwner, setFormOwner] = useState('');
  const [formConfidentiality, setFormConfidentiality] = useState<'Altamente Confidencial' | 'Restrito' | 'Interno'>('Interno');
  const [formLastUpdated, setFormLastUpdated] = useState('');
  const [formThumbnailUrl, setFormThumbnailUrl] = useState('');
  const [thumbnailUploadError, setThumbnailUploadError] = useState<string | null>(null);
  const [formAdditionalLink, setFormAdditionalLink] = useState('');
  const [formCustomAccessUrl, setFormCustomAccessUrl] = useState('');
  const [formMaterial1Link, setFormMaterial1Link] = useState('');
  const [formMaterial2Link, setFormMaterial2Link] = useState('');
  const [formMaterial3Link, setFormMaterial3Link] = useState('');
  const [formMaterial4Link, setFormMaterial4Link] = useState('');
  const [formMaterial5Link, setFormMaterial5Link] = useState('');
  const [formMaterial6Link, setFormMaterial6Link] = useState('');
  const [formNivelCurso, setFormNivelCurso] = useState<number>(1);
  const [formConteudoSemProva, setFormConteudoSemProva] = useState(false);
  const [formStatus, setFormStatus] = useState<'Ativo' | 'Inativo'>('Ativo');
  const [formLinkedQuestionnaireId, setFormLinkedQuestionnaireId] = useState<string>('');
  const [formPrerequisiteId, setFormPrerequisiteId] = useState<string>('');
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);

  useEffect(() => {
    const localQuizzes = localStorage.getItem('masonic_questionnaires_v1');
    if (localQuizzes) {
      setQuestionnaires(JSON.parse(localQuizzes));
    }
    
    import('../firebase').then(({ initializeFirebase }) => {
      const { db } = initializeFirebase();
      if (db) {
        import('firebase/firestore').then(({ collection, getDocs }) => {
          getDocs(collection(db, 'questionnaires'))
            .then((quizSnap) => {
              if (!quizSnap.empty) {
                const cloudQuizzes: Questionnaire[] = [];
                quizSnap.forEach(docSnap => {
                  cloudQuizzes.push(docSnap.data() as Questionnaire);
                });
                setQuestionnaires(cloudQuizzes);
                localStorage.setItem('masonic_questionnaires_v1', JSON.stringify(cloudQuizzes));
              }
            })
            .catch((err) => {
              console.warn('Error fetching questionnaires directly in ProfileView:', err);
            });
        });
      }
    });
  }, []);

  // Book CRUD states
  const [bookFormId, setBookFormId] = useState('');
  
  // Dynamic categories states
  const [categoriesList, setCategoriesList] = useState<string[]>(() => {
    const saved = localStorage.getItem('masonic_categories_list_v1');
    return saved ? JSON.parse(saved) : [
      'Adonhiramita',
      'Adonhiramita-Rituais',
      'História do Brasil',
      'Filosofia',
      'Simbologia',
      'Maçonaria',
      'Cabala',
      'Rituais'
    ];
  });
  const [showCategoriesManager, setShowCategoriesManager] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategoryOldName, setEditingCategoryOldName] = useState<string | null>(null);
  const [editingCategoryNewName, setEditingCategoryNewName] = useState('');

  useEffect(() => {
    let unsub: (() => void) | undefined;
    import('../firebase').then(({ initializeFirebase }) => {
      const { db } = initializeFirebase();
      if (db) {
        import('firebase/firestore').then(({ collection, onSnapshot, doc, setDoc }) => {
          const categoriesCol = collection(db, 'categories');
          unsub = onSnapshot(categoriesCol, (snapshot) => {
            if (!snapshot.empty) {
              const loaded: string[] = [];
              snapshot.forEach(docSnap => {
                const data = docSnap.data();
                if (data && data.name) {
                  loaded.push(data.name);
                }
              });
              loaded.sort((a, b) => a.localeCompare(b));
              setCategoriesList(loaded);
              localStorage.setItem('masonic_categories_list_v1', JSON.stringify(loaded));
            } else {
              const defaults = [
                'Adonhiramita',
                'Adonhiramita-Rituais',
                'História do Brasil',
                'Filosofia',
                'Simbologia',
                'Maçonaria',
                'Cabala',
                'Rituais'
              ];
              // Batch seed
              defaults.forEach(async (catName) => {
                const docId = catName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                await setDoc(doc(db, 'categories', docId), { id: docId, name: catName });
              });
              setCategoriesList(defaults);
              localStorage.setItem('masonic_categories_list_v1', JSON.stringify(defaults));
            }
          }, (err) => {
            console.error('Error listening to categories:', err);
          });
        });
      }
    });
    return () => {
      if (unsub) unsub();
    };
  }, []);

  const handleAddCategory = async (catName: string) => {
    const trimmed = catName.trim();
    if (!trimmed) return;
    if (categoriesList.includes(trimmed)) {
      alert('Esta categoria já existe!');
      return;
    }
    const { initializeFirebase } = await import('../firebase');
    const { db } = initializeFirebase();
    if (db) {
      const { doc, setDoc } = await import('firebase/firestore');
      const docId = trimmed.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      await setDoc(doc(db, 'categories', docId), { id: docId, name: trimmed });
    } else {
      const updated = [...categoriesList, trimmed].sort((a, b) => a.localeCompare(b));
      setCategoriesList(updated);
      localStorage.setItem('masonic_categories_list_v1', JSON.stringify(updated));
    }
    setNewCategoryName('');
  };

  const handleDeleteCategory = async (catName: string) => {
    if (!confirm(`Tem certeza de que deseja excluir a categoria "${catName}"?`)) {
      return;
    }
    const { initializeFirebase } = await import('../firebase');
    const { db } = initializeFirebase();
    if (db) {
      const { doc, deleteDoc } = await import('firebase/firestore');
      const docId = catName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      await deleteDoc(doc(db, 'categories', docId));
    } else {
      const updated = categoriesList.filter(c => c !== catName);
      setCategoriesList(updated);
      localStorage.setItem('masonic_categories_list_v1', JSON.stringify(updated));
    }
    setBookFormCategories(prev => prev.filter(c => c !== catName));
  };

  const handleRenameCategory = async (oldName: string, newName: string) => {
    const trimmedNew = newName.trim();
    if (!trimmedNew || trimmedNew === oldName) return;
    if (categoriesList.includes(trimmedNew)) {
      alert('Esta categoria já existe!');
      return;
    }
    const { initializeFirebase } = await import('../firebase');
    const { db } = initializeFirebase();
    if (db) {
      const { doc, setDoc, deleteDoc, writeBatch, collection, getDocs } = await import('firebase/firestore');
      const oldDocId = oldName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const newDocId = trimmedNew.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      
      await setDoc(doc(db, 'categories', newDocId), { id: newDocId, name: trimmedNew });
      await deleteDoc(doc(db, 'categories', oldDocId));

      try {
        const booksCol = collection(db, 'books');
        const snapshot = await getDocs(booksCol);
        if (!snapshot.empty) {
          const batch = writeBatch(db);
          let updatedCount = 0;
          snapshot.forEach(docSnap => {
            const bookData = docSnap.data() as Book;
            let changed = false;
            let bookCategories = bookData.categories || [];
            let bookCategory = bookData.category || '';

            if (bookCategories.includes(oldName)) {
              bookCategories = bookCategories.map(c => c === oldName ? trimmedNew : c);
              changed = true;
            }
            if (bookCategory === oldName) {
              bookCategory = trimmedNew;
              changed = true;
            }

            if (changed) {
              const bookRef = doc(db, 'books', docSnap.id);
              batch.update(bookRef, {
                category: bookCategory,
                categories: bookCategories
              });
              updatedCount++;
            }
          });
          if (updatedCount > 0) {
            await batch.commit();
          }
        }
      } catch (err) {
        console.error('Error updating books categories in rename batch:', err);
      }
    } else {
      const updated = categoriesList.map(c => c === oldName ? trimmedNew : c).sort((a, b) => a.localeCompare(b));
      setCategoriesList(updated);
      localStorage.setItem('masonic_categories_list_v1', JSON.stringify(updated));
    }
    setBookFormCategories(prev => prev.map(c => c === oldName ? trimmedNew : c));
    setEditingCategoryOldName(null);
  };
  const [bookFormTitle, setBookFormTitle] = useState('');
  const [bookFormAuthor, setBookFormAuthor] = useState('');
  const [bookFormCategory, setBookFormCategory] = useState('');
  const [bookFormCategories, setBookFormCategories] = useState<string[]>([]);
  const [bookFormNivelAcesso, setBookFormNivelAcesso] = useState<number>(1);
  const [bookFormStatus, setBookFormStatus] = useState<'Ativo' | 'Inativo'>('Ativo');
  const [bookFormTags, setBookFormTags] = useState('');
  const [bookFormThumbnailUrl, setBookFormThumbnailUrl] = useState('');
  const [bookFormLink, setBookFormLink] = useState('');
  
  const [isCreatingNewBook, setIsCreatingNewBook] = useState(true);
  const [editBookId, setEditBookId] = useState<string | null>(null);
  const [bookSearchQuery, setBookSearchQuery] = useState('');
  const [bookDegreeFilter, setBookDegreeFilter] = useState<string>('all');
  const [bookCategoryFilter, setBookCategoryFilter] = useState<string>('all');
  const [bookStatusFilter, setBookStatusFilter] = useState<string>('all');
  const [bookFormError, setBookFormError] = useState<string | null>(null);
  const [bookFormSuccess, setBookFormSuccess] = useState<string | null>(null);
  const [bookThumbnailUploadError, setBookThumbnailUploadError] = useState<string | null>(null);
  const [selectedBookIds, setSelectedBookIds] = useState<string[]>([]);

  // Get all unique categories dynamically from books list
  const allBookCategories = useMemo(() => {
    const categoriesSet = new Set<string>();
    books.forEach(b => {
      if (b.category) categoriesSet.add(b.category);
      if (b.categories && Array.isArray(b.categories)) {
        b.categories.forEach(cat => categoriesSet.add(cat));
      }
    });
    return Array.from(categoriesSet).filter(Boolean).sort();
  }, [books]);

  const filteredBooks = books.filter(b => {
    if (bookDegreeFilter !== 'all') {
      if (String(b.nivelAcesso) !== bookDegreeFilter) {
        return false;
      }
    }
    const bookCats = b.categories && b.categories.length > 0 ? b.categories : (b.category ? [b.category] : []);
    if (bookCategoryFilter !== 'all') {
      if (!bookCats.includes(bookCategoryFilter)) {
        return false;
      }
    }
    if (bookStatusFilter !== 'all') {
      if (b.status !== bookStatusFilter) {
        return false;
      }
    }
    const query = bookSearchQuery.toLowerCase();
    return b.title.toLowerCase().includes(query) || 
           b.author.toLowerCase().includes(query) || 
           b.id.toLowerCase().includes(query) ||
           bookCats.some(cat => cat.toLowerCase().includes(query));
  });

  const allFilteredChecked = filteredBooks.length > 0 && filteredBooks.every(b => selectedBookIds.includes(b.id));
  const handleToggleSelectAll = () => {
    if (allFilteredChecked) {
      const filteredIds = filteredBooks.map(b => b.id);
      setSelectedBookIds(prev => prev.filter(id => !filteredIds.includes(id)));
    } else {
      const filteredIds = filteredBooks.map(b => b.id);
      setSelectedBookIds(prev => Array.from(new Set([...prev, ...filteredIds])));
    }
  };

  const handleSelectBookToEdit = (book: Book) => {
    setIsCreatingNewBook(false);
    setEditBookId(book.id);
    setBookFormId(book.id);
    setBookFormTitle(book.title);
    setBookFormAuthor(book.author);
    setBookFormCategory(book.category);
    setBookFormCategories(book.categories && book.categories.length > 0 ? book.categories : [book.category]);
    setBookFormNivelAcesso(book.nivelAcesso);
    setBookFormStatus(book.status);
    setBookFormTags(book.tags.join(', '));
    setBookFormThumbnailUrl(book.thumbnailUrl);
    setBookFormLink(book.link);
    setBookFormError(null);
    setBookFormSuccess(null);
  };

  const handleStartCreateNewBook = () => {
    setIsCreatingNewBook(true);
    setEditBookId(null);
    
    // Generate unique ID
    const generatedId = `livro-${Date.now().toString().slice(-6)}`;
    setBookFormId(generatedId);
    setBookFormTitle('');
    setBookFormAuthor('');
    setBookFormCategory('Filosofia');
    setBookFormCategories(['Filosofia']);
    setBookFormNivelAcesso(1);
    setBookFormStatus('Ativo');
    setBookFormTags('');
    setBookFormThumbnailUrl('');
    setBookFormLink('');
    setBookFormError(null);
    setBookFormSuccess(null);
  };

  const handleSaveBook = (e: React.FormEvent) => {
    e.preventDefault();
    setBookFormError(null);
    setBookFormSuccess(null);

    if (!bookFormId.trim()) {
      setBookFormError('O ID do material é obrigatório.');
      return;
    }
    if (!bookFormTitle.trim()) {
      setBookFormError('O Título do material é obrigatório.');
      return;
    }
    if (!bookFormAuthor.trim()) {
      setBookFormError('O Autor do material é obrigatório.');
      return;
    }
    if (bookFormCategories.length === 0) {
      setBookFormError('Selecione pelo menos uma categoria.');
      return;
    }
    if (!bookFormLink.trim()) {
      setBookFormError('O Link do material é obrigatório.');
      return;
    }

    const processedTags = bookFormTags
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const savedBook: Book = {
      id: bookFormId.trim(),
      title: bookFormTitle.trim(),
      author: bookFormAuthor.trim(),
      category: bookFormCategories[0],
      categories: bookFormCategories,
      nivelAcesso: Number(bookFormNivelAcesso),
      status: bookFormStatus,
      tags: processedTags,
      thumbnailUrl: bookFormThumbnailUrl.trim(),
      link: bookFormLink.trim(),
      lodgeId: isCreatingNewBook ? (currentUser?.lodgeId || 'lodge-cavaleiros') : (books.find(b => b.id === bookFormId.trim())?.lodgeId || currentUser?.lodgeId || 'lodge-cavaleiros')
    };

    try {
      if (isCreatingNewBook) {
        if (books.some(b => b.id === savedBook.id)) {
          setBookFormError(`Um material com o ID "${savedBook.id}" já existe.`);
          return;
        }
        if (onAddBook) {
          onAddBook(savedBook);
          setBookFormSuccess('Material cadastrado com sucesso!');
        }
      } else {
        if (onUpdateBook) {
          onUpdateBook(savedBook);
          setBookFormSuccess('Material atualizado com sucesso!');
        }
      }
    } catch (err: any) {
      setBookFormError(err.message || 'Erro ao salvar o material.');
    }
  };

  const handleDeleteBookAction = (bookId: string) => {
    if (confirm('Tem certeza de que deseja excluir este material da biblioteca?')) {
      if (onDeleteBook) {
        onDeleteBook(bookId);
        if (editBookId === bookId) {
          handleStartCreateNewBook();
        }
      }
    }
  };

  const handleDownloadExcelTemplate = () => {
    const templateData = [
      {
        id: "livro-exemplo-1",
        titulo: "A SIMBOLOGIA DO GRAU DE APRENDIZ",
        autor: "José Castellani",
        categorias: "Simbologia, Maçonaria",
        grau: 1,
        status: "Ativo",
        tags: "aprendiz, simbologia, rito adonhiramita",
        thumbnailUrl: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=200&q=80",
        link: "https://exemplo.com/materiais/aprendiz.pdf"
      },
      {
        id: "livro-exemplo-2",
        titulo: "REGRAS DE ADMINISTRAÇÃO EM LOJA",
        autor: "Autor Desconhecido",
        categorias: "Filosofia, Rituais",
        grau: 4,
        status: "Inativo",
        tags: "mestre secreto, administracao",
        thumbnailUrl: "",
        link: "https://exemplo.com/materiais/regras-loja.pdf"
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Materiais Modelo");
    
    // Auto size columns to look nice
    worksheet["!cols"] = [
      { wch: 18 }, 
      { wch: 45 }, 
      { wch: 20 }, 
      { wch: 25 }, 
      { wch: 8 }, 
      { wch: 10 }, 
      { wch: 35 }, 
      { wch: 35 }, 
      { wch: 40 }
    ];

    XLSX.writeFile(workbook, "modelo_importacao_materiais.xlsx");
  };

  const handleImportExcelFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const bstr = event.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws) as any[];

        if (data.length === 0) {
          alert("A planilha está vazia ou não pôde ser lida.");
          return;
        }

        const importedBooks: Book[] = [];
        const errors: string[] = [];

        data.forEach((row, index) => {
          const rowNum = index + 2; // header is row 1
          
          const rawId = row.id || row.Identificador || row.ID;
          const rawTitle = row.titulo || row.title || row.Título || row.Titulo;
          const rawAuthor = row.autor || row.author || row.Autor;
          const rawCategorias = row.categorias || row.categories || row.Categorias || row.category || row.Category || row.categoria || row.Categoria;
          const rawGrau = row.grau || row.nivelAcesso || row.Grau || row.nivel || row.Nível || row.Nivel;
          const rawStatus = row.status || row.Status;
          const rawTags = row.tags || row.Tags || row.palavrasChave || row.PalavrasChave;
          const rawThumbnail = row.thumbnailUrl || row.ThumbnailUrl || row.imagem || row.Imagem || row.thumbnail || row.Thumbnail;
          const rawLink = row.link || row.Link || row.url || row.URL || row.documento || row.Documento;

          if (!rawTitle) {
            errors.push(`Linha ${rowNum}: O título é obrigatório.`);
            return;
          }

          if (!rawAuthor) {
            errors.push(`Linha ${rowNum}: O autor é obrigatório.`);
            return;
          }

          if (!rawLink) {
            errors.push(`Linha ${rowNum}: O link do material é obrigatório.`);
            return;
          }

          const id = rawId ? String(rawId).trim().toLowerCase().replace(/\s+/g, '-') : `livro-imp-${Date.now()}-${index}`;

          let categories: string[] = [];
          if (rawCategorias) {
            categories = String(rawCategorias).split(',').map(c => c.trim()).filter(Boolean);
          }
          if (categories.length === 0) {
            categories = ['Filosofia'];
          }

          let degree = 1;
          if (rawGrau !== undefined) {
            const parsed = parseInt(String(rawGrau), 10);
            if (!isNaN(parsed) && parsed >= 1 && parsed <= 33) {
              degree = parsed;
            }
          }

          let status: 'Ativo' | 'Inativo' = 'Ativo';
          if (rawStatus) {
            const statusStr = String(rawStatus).trim().toLowerCase();
            if (statusStr === 'inativo' || statusStr === 'inactive' || statusStr === 'oculto' || statusStr === 'false') {
              status = 'Inativo';
            }
          }

          let tags: string[] = [];
          if (rawTags) {
            tags = String(rawTags).split(',').map(t => t.trim()).filter(Boolean);
          }

          importedBooks.push({
            id,
            title: String(rawTitle).trim(),
            author: String(rawAuthor).trim(),
            category: categories[0],
            categories,
            nivelAcesso: degree,
            status,
            tags,
            thumbnailUrl: rawThumbnail ? String(rawThumbnail).trim() : '',
            link: String(rawLink).trim()
          });
        });

        if (errors.length > 0) {
          alert(`Erros encontrados na validação:\n${errors.slice(0, 5).join('\n')}${errors.length > 5 ? `\n...e mais ${errors.length - 5} erros.` : ''}`);
          return;
        }

        if (importedBooks.length > 0) {
          if (onImportBooks) {
            onImportBooks(importedBooks);
            setBookFormSuccess(`${importedBooks.length} materiais importados com sucesso de ${file.name}!`);
            setBookFormError(null);
          } else {
            alert("Erro do sistema: Função de importação não configurada.");
          }
        }
      } catch (err: any) {
        console.error("Erro ao importar planilha excel:", err);
        setBookFormError(`Erro ao ler arquivo excel: ${err.message || err}`);
      }
    };
    reader.readAsBinaryString(file);
    e.target.value = '';
  };

  const handleBatchStatusAction = (status: 'Ativo' | 'Inativo') => {
    if (selectedBookIds.length === 0) return;
    if (onBatchUpdateBooksStatus) {
      onBatchUpdateBooksStatus(selectedBookIds, status);
      setBookFormSuccess(`Status de ${selectedBookIds.length} materiais alterado para "${status}" com sucesso!`);
      setSelectedBookIds([]);
    }
  };

  const handleBatchDeleteAction = () => {
    if (selectedBookIds.length === 0) return;
    if (confirm(`Tem certeza de que deseja excluir os ${selectedBookIds.length} materiais selecionados? Esta ação é irreversível.`)) {
      if (onBatchDeleteBooks) {
        onBatchDeleteBooks(selectedBookIds);
        setBookFormSuccess(`${selectedBookIds.length} materiais excluídos com sucesso.`);
        setSelectedBookIds([]);
        handleStartCreateNewBook();
      }
    }
  };

  // CRUD logic handlers
  const handleSelectToEdit = (rep: ExecutiveReport) => {
    setIsCreatingNew(false);
    setEditReportId(rep.id);
    
    setFormId(rep.id);
    setFormTitle(rep.title);
    setFormCategory(rep.category);
    // filter out image metadata links from displayed client tags
    const displayTags = rep.tags.filter(t => !t.startsWith('img:')).join(', ');
    setFormTags(displayTags);
    
    setFormDepartment(rep.department);
    setFormSummary(rep.summary);
    setFormFullMarkdown(rep.fullMarkdown);
    setFormLeftBorderColor(rep.leftBorderColor);
    setFormOwner(rep.owner);
    setFormConfidentiality(rep.confidentiality);
    setFormLastUpdated(rep.lastUpdated || '');
    setFormThumbnailUrl(rep.thumbnailUrl || '');
    setFormAdditionalLink(rep.additionalLink || '');
    setFormCustomAccessUrl(rep.customAccessUrl || '');
    setFormMaterial1Link(rep.material1Link || '');
    setFormMaterial2Link(rep.material2Link || '');
    setFormMaterial3Link(rep.material3Link || '');
    setFormMaterial4Link(rep.material4Link || '');
    setFormMaterial5Link(rep.material5Link || '');
    setFormMaterial6Link(rep.material6Link || '');
    setFormNivelCurso(rep.nivelCurso || 1);
    setFormConteudoSemProva(!!rep.conteudoSemProva);
    setFormStatus(rep.status || 'Ativo');
    setFormLinkedQuestionnaireId(rep.linkedQuestionnaireId || '');
    setFormPrerequisiteId(rep.prerequisiteId || '');

    setShowForm(true);
    setCrudError(null);
    setCrudSuccess(null);
    // Scroll form into view gently
    setTimeout(() => {
      document.getElementById('crud-form-header')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleStartCreateNew = () => {
    setIsCreatingNew(true);
    setEditReportId(null);
    
    // Auto-generate safe unique ID
    const newId = `rep-${Math.floor(100 + Math.random() * 900)}`;
    setFormId(newId);
    setFormTitle('');
    setFormCategory('ESTRATÉGIA');
    setFormTags('');
    setFormDepartment('');
    setFormSummary('');
    setFormFullMarkdown('# Novo Curso\nConfigure as diretrizes e atualizações aqui de forma estruturada.');
    setFormLeftBorderColor('gold');
    setFormOwner('Daniel Luciano');
    setFormConfidentiality('Interno');
    setFormThumbnailUrl('');
    setFormAdditionalLink('');
    setFormCustomAccessUrl('');
    setFormMaterial1Link('');
    setFormMaterial2Link('');
    setFormMaterial3Link('');
    setFormMaterial4Link('');
    setFormMaterial5Link('');
    setFormMaterial6Link('');
    setFormNivelCurso(1);
    setFormConteudoSemProva(false);
    setFormStatus('Ativo');
    setFormLinkedQuestionnaireId('');
    setFormPrerequisiteId('');
    // Pre-fill today's formatted date
    const today = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).replace('.', '');
    setFormLastUpdated(today);

    setShowForm(true);
    setCrudError(null);
    setCrudSuccess(null);
    setTimeout(() => {
      document.getElementById('crud-form-header')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Submit trigger
  const handleSaveReport = (e: React.FormEvent) => {
    e.preventDefault();
    setCrudError(null);

    // Basic Validations
    if (!formId.trim()) {
      setCrudError('Código ID do curso é obrigatório.');
      return;
    }
    if (!formTitle.trim()) {
      setCrudError('Título do curso é obrigatório.');
      return;
    }

    // ID generation rules when creating new: code concatenated with the first 5 letters of the report name
    let finalId = formId.trim().toLowerCase();
    if (isCreatingNew) {
      const titleClean = formTitle.trim()
        .toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // remove accents
        .replace(/[^a-z0-9]/g, '') // remove special chars and spaces
        .slice(0, 5);
      finalId = `${finalId}-${titleClean}`;
    }

    // Verify unique ID if creating new
    if (isCreatingNew) {
      const exists = reports.some(r => r.id.toLowerCase() === finalId.toLowerCase());
      if (exists) {
        setCrudError(`Já existe um curso permanente com o código ID de conformidade: "${finalId}". Utilize outro.`);
        return;
      }
    }

    // Capture base tags and restore pre-existing image tags
    const manualTags = formTags
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);
    
    let finalTags = manualTags;
    if (!isCreatingNew && editReportId) {
      const existingRep = reports.find(r => r.id === editReportId);
      if (existingRep) {
        // Keep hidden tags storing visual graphics (`img:...`)
        const existingImgTags = existingRep.tags.filter(t => t.startsWith('img:'));
        finalTags = [...manualTags, ...existingImgTags];
      }
    }

    const finalReportData: ExecutiveReport = {
      id: finalId,
      title: formTitle.trim(),
      category: formCategory,
      tags: finalTags,
      department: formDepartment.trim() || 'Geral',
      summary: formSummary.trim() || 'Sem resumo executivo disponível.',
      fullMarkdown: formFullMarkdown || '# Novo Curso\n',
      leftBorderColor: formLeftBorderColor,
      lastUpdated: formLastUpdated || 'Hoje',
      owner: formOwner.trim() || 'Daniel Luciano',
      confidentiality: formConfidentiality,
      thumbnailUrl: formThumbnailUrl.trim() || undefined,
      additionalLink: formAdditionalLink.trim() || undefined,
      customAccessUrl: formCustomAccessUrl.trim() || undefined,
      material1Link: formMaterial1Link.trim() || undefined,
      material2Link: formMaterial2Link.trim() || undefined,
      material3Link: formMaterial3Link.trim() || undefined,
      material4Link: formMaterial4Link.trim() || undefined,
      material5Link: formMaterial5Link.trim() || undefined,
      material6Link: formMaterial6Link.trim() || undefined,
      nivelCurso: formNivelCurso,
      conteudoSemProva: formConteudoSemProva,
      status: formStatus,
      linkedQuestionnaireId: formLinkedQuestionnaireId || undefined,
      prerequisiteId: formPrerequisiteId || undefined,
      lodgeId: isCreatingNew ? (currentUser?.lodgeId || 'lodge-cavaleiros') : (reports.find(r => r.id === finalId)?.lodgeId || currentUser?.lodgeId || 'lodge-cavaleiros')
    };

    if (isCreatingNew) {
      onAddReport(finalReportData);
      setCrudSuccess(`Curso "${finalReportData.title}" criado e persistido com sucesso!`);
    } else {
      onUpdateReport(finalReportData);
      setCrudSuccess(`Alterações salvas para o curso "${finalReportData.title}" com sucesso!`);
    }

    // Close form and clear status feedback
    setTimeout(() => {
      setCrudSuccess(null);
      setShowForm(false);
    }, 2500);
  };

  const handleDeleteTrigger = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeletingReportId(id);
  };

  const handleConfirmDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onDeleteReport(id);
    setDeletingReportId(null);
    if (showForm && formId === id) {
      setShowForm(false);
    }
  };

  // Access User CRUD logical handlers
  const handleSelectUserToEdit = (user: AccessUser) => {
    setIsCreatingNewUser(false);
    setEditUserId(user.id);
    setUserFormName(user.name);
    setUserFormEmail(user.email);
    setUserFormUserAcesso(user.userAcesso || '');
    setUserFormAllowedReports(user.allowedReportIds);
    setUserFormStatus(user.status);
    setUserFormTipoUsuario(user.tipoUsuario || 'padrao');
    setUserFormNivelAcesso(user.nivelAcesso || '');
    setUserFormPassword(user.password || '');
    setUserFormTelefone(user.telefone || '');
    setUserFormLoja(user.loja || '');
    setUserFormPotencia(user.potencia || '');
    setUserFormCidadeLoja(user.cidadeLoja || '');
    setUserFormAvatarUrl(user.avatarUrl || '');
    setUserFormLodgeId(user.lodgeId || '');
    
    setShowUserForm(true);
    setUserCrudError(null);
    setUserCrudSuccess(null);
    setTimeout(() => {
      document.getElementById('user-form-header')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleStartCreateNewUser = () => {
    setIsCreatingNewUser(true);
    setEditUserId(null);
    setUserFormName('');
    setUserFormEmail('');
    setUserFormUserAcesso('');
    setUserFormAllowedReports('');
    setUserFormStatus('Inativo');
    setUserFormTipoUsuario('padrao');
    setUserFormNivelAcesso('');
    setUserFormPassword('');
    setUserFormTelefone('');
    setUserFormAvatarUrl('');
    
    if (!isMaster) {
      const userLodgeId = currentUser?.lodgeId || 'lodge-cavaleiros';
      setUserFormLodgeId(userLodgeId);
      const matched = (lodges || []).find(l => l.id === userLodgeId);
      if (matched) {
        setUserFormLoja(matched.nome);
        setUserFormPotencia(matched.potencia);
        setUserFormCidadeLoja(matched.cidade);
      } else {
        setUserFormLoja('');
        setUserFormPotencia('');
        setUserFormCidadeLoja('');
      }
    } else {
      setUserFormLoja('');
      setUserFormPotencia('');
      setUserFormCidadeLoja('');
      setUserFormLodgeId('');
    }
    
    setShowUserForm(true);
    setUserCrudError(null);
    setUserCrudSuccess(null);
    setTimeout(() => {
      document.getElementById('user-form-header')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSaveAccessUser = (e: React.FormEvent) => {
    e.preventDefault();
    setUserCrudError(null);

    if (!userFormName.trim()) {
      setUserCrudError('Nome é de preenchimento obrigatório.');
      return;
    }
    if (!userFormEmail.trim() || !userFormEmail.includes('@')) {
      setUserCrudError('E-mail válido é obrigatório.');
      return;
    }

    const emailToUse = userFormEmail.trim().toLowerCase();

    // Check if email already registered (if new)
    if (isCreatingNewUser) {
      if (emailToUse === 'dani.nanda.lucas@gmail.com') {
        setUserCrudError(`O administrador ${emailToUse} já possui credenciais de privilégio supremo.`);
        return;
      }
      const exists = accessUsers.some(u => u.email.toLowerCase() === emailToUse);
      if (exists) {
        setUserCrudError(`O e-mail "${userFormEmail}" já está cadastrado no banco de dados de acessos.`);
        return;
      }
    }

    const finalUserData: AccessUser = {
      id: isCreatingNewUser ? `usr-${Math.floor(100 + Math.random() * 900)}` : (editUserId || ''),
      name: userFormName.trim(),
      email: emailToUse,
      allowedReportIds: userFormAllowedReports.trim(),
      status: userFormStatus,
      tipoUsuario: userFormTipoUsuario,
      nivelAcesso: userFormNivelAcesso.trim(),
      password: userFormPassword.trim(),
      telefone: userFormTelefone.trim() || undefined,
      loja: isMaster ? (userFormLoja.trim() || undefined) : (lodges.find(l => l.id === (currentUser?.lodgeId || 'lodge-cavaleiros'))?.nome || userFormLoja.trim() || undefined),
      potencia: isMaster ? (userFormPotencia.trim() || undefined) : (lodges.find(l => l.id === (currentUser?.lodgeId || 'lodge-cavaleiros'))?.potencia || userFormPotencia.trim() || undefined),
      cidadeLoja: isMaster ? (userFormCidadeLoja.trim() || undefined) : (lodges.find(l => l.id === (currentUser?.lodgeId || 'lodge-cavaleiros'))?.cidade || userFormCidadeLoja.trim() || undefined),
      userAcesso: userFormUserAcesso.trim() || undefined,
      avatarUrl: userFormAvatarUrl.trim() || undefined,
      lodgeId: isMaster ? (userFormLodgeId || undefined) : (currentUser?.lodgeId || 'lodge-cavaleiros')
    };

    if (isCreatingNewUser) {
      onAddAccessUser(finalUserData);
      setUserCrudSuccess(`Usuário "${finalUserData.name}" registrado com sucesso.`);
    } else {
      onUpdateAccessUser(finalUserData);
      setUserCrudSuccess(`Dados do usuário "${finalUserData.name}" salvos com sucesso.`);
    }

    setTimeout(() => {
      setUserCrudSuccess(null);
      setShowUserForm(false);
    }, 2000);
  };

  const handleDeleteUserTrigger = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeletingUserId(id);
  };

  const handleConfirmDeleteUser = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onDeleteAccessUser(id);
    setDeletingUserId(null);
    if (showUserForm && editUserId === id) {
      setShowUserForm(false);
    }
  };

  // Filter local display on left column
  const filteredList = reports.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(reportsSearchQuery.toLowerCase()) ||
      r.id.toLowerCase().includes(reportsSearchQuery.toLowerCase()) ||
      r.category.toLowerCase().includes(reportsSearchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    if (reportsStatusFilter === 'todos') return true;
    
    const repStatus = r.status || 'Ativo';
    return repStatus === reportsStatusFilter;
  });

  // Static audit log trail for decoration/humble markers
  const auditLogs = [
    { event: 'Acesso Autorizado', target: 'ESTRATÉGIA DOS SEGMENTOS', status: 'OK', time: 'Hoje 14:32' },
    { event: 'Inclusão de Diretiva', target: 'PES EDUCACIONAL', status: 'OK', time: 'Ontem 10:15' },
    { event: 'Vinculação de Imagem HTML', target: 'VISÃO DE USO LINHA RM', status: 'SALVO', time: '03 Jun 2026' },
  ];

  return (
    <div id="settings-view-window" className="max-w-6xl mx-auto text-left animate-fade-in mb-16 space-y-4">
      
      {/* Settings Sub-Tab Navigation Bar */}
      <div className="flex border-b border-[#1c2c36]/80 gap-1 overflow-x-auto select-none">
        <button
          onClick={() => setActiveSubTab('profile')}
          className={`flex items-center gap-1.5 py-3 px-4 text-xs font-mono font-bold tracking-wide transition-all border-b-2 cursor-pointer ${
            activeSubTab === 'profile'
              ? 'border-[#E9C349] text-[#E9C349] bg-[#0c1d27]/40'
              : 'border-transparent text-[#99907c] hover:text-[#d4e5f2]'
          }`}
        >
          <User className="w-3.5 h-3.5" /> MEU PERFIL & SEGURANÇA
        </button>
        {!isStandardUser && (
          <>
            <button
              onClick={() => setActiveSubTab('reports')}
              className={`flex items-center gap-1.5 py-3 px-4 text-xs font-mono font-bold tracking-wide transition-all border-b-2 cursor-pointer ${
                activeSubTab === 'reports'
                  ? 'border-[#E9C349] text-[#E9C349] bg-[#0c1d27]/40'
                  : 'border-transparent text-[#99907c] hover:text-[#d4e5f2]'
              }`}
            >
              <Sliders className="w-3.5 h-3.5 text-[#66d9cc]" /> CADASTRO DE CURSOS ({reports.length})
            </button>
            <button
              onClick={() => setActiveSubTab('accesses')}
              className={`flex items-center gap-1.5 py-3 px-4 text-xs font-mono font-bold tracking-wide transition-all border-b-2 cursor-pointer ${
                activeSubTab === 'accesses'
                  ? 'border-[#E9C349] text-[#E9C349] bg-[#0c1d27]/40'
                  : 'border-transparent text-[#99907c] hover:text-[#d4e5f2]'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-orange-400" /> CADASTRO DE ACESSOS ({visibleAccessUsers.length})
            </button>
            {isMaster && (
              <button
                onClick={() => setActiveSubTab('database')}
                className={`flex items-center gap-1.5 py-3 px-4 text-xs font-mono font-bold tracking-wide transition-all border-b-2 cursor-pointer ${
                  activeSubTab === 'database'
                    ? 'border-[#E9C349] text-[#E9C349] bg-[#0c1d27]/40'
                    : 'border-transparent text-[#99907c] hover:text-[#d4e5f2]'
                }`}
              >
                <Database className="w-3.5 h-3.5 text-[#E9C349]" /> BANCO DE DADOS CLOUD (FIREBASE)
              </button>
            )}
            <button
              onClick={() => {
                setActiveSubTab('books');
                handleStartCreateNewBook();
              }}
              className={`flex items-center gap-1.5 py-3 px-4 text-xs font-mono font-bold tracking-wide transition-all border-b-2 cursor-pointer ${
                activeSubTab === 'books'
                  ? 'border-[#E9C349] text-[#E9C349] bg-[#0c1d27]/40'
                  : 'border-transparent text-[#99907c] hover:text-[#d4e5f2]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-[#E9C349]" /> CADASTRO DE MATERIAIS ({books.length})
            </button>
            {isMaster && (
              <button
                onClick={() => setActiveSubTab('accessStats')}
                className={`flex items-center gap-1.5 py-3 px-4 text-xs font-mono font-bold tracking-wide transition-all border-b-2 cursor-pointer ${
                  activeSubTab === 'accessStats'
                    ? 'border-[#E9C349] text-[#E9C349] bg-[#0c1d27]/40'
                    : 'border-transparent text-[#99907c] hover:text-[#d4e5f2]'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5 text-[#66d9cc]" /> RELATÓRIOS DE ACESSO
              </button>
            )}
            <button
              onClick={() => setActiveSubTab('lodges')}
              className={`flex items-center gap-1.5 py-3 px-4 text-xs font-mono font-bold tracking-wide transition-all border-b-2 cursor-pointer ${
                activeSubTab === 'lodges'
                  ? 'border-[#E9C349] text-[#E9C349] bg-[#0c1d27]/40'
                  : 'border-transparent text-[#99907c] hover:text-[#d4e5f2]'
              }`}
            >
              <Home className="w-3.5 h-3.5 text-amber-500" /> CADASTRO DA LOJA ({(lodges || []).filter(l => isMaster || l.id === (currentUser?.lodgeId || 'lodge-cavaleiros')).length})
            </button>
          </>
        )}
      </div>

      {activeSubTab === 'profile' && (
        // Standard profile display view
        <div className="max-w-md mx-auto space-y-4">
          {/* Hero Profile Card */}
          <div className="bg-[#0c1d27] rounded-xl p-6 border border-[#1c2c36] flex flex-col items-center text-center relative">
            {currentUser?.avatarUrl ? (
              <img 
                src={currentUser.avatarUrl} 
                alt={nameToDisplay}
                referrerPolicy="no-referrer"
                className="w-20 h-20 rounded-full object-cover border-2 border-[#E9C349] shadow-lg mb-4 bg-[#04141d]"
                onError={(e) => {
                  (e.target as HTMLImageElement).onerror = null;
                  (e.target as HTMLImageElement).src = ''; 
                }}
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#E9C349] to-[#66D9CC] text-[#04141D] flex items-center justify-center text-2xl font-mono font-bold border-2 border-[#1c2c36] shadow-lg mb-4">
                {initials}
              </div>
            )}
            <h2 className="font-sans font-bold text-base text-[#d4e5f2] tracking-tight">{nameToDisplay}</h2>
            <p className="font-mono text-[10px] text-[#E9C349] mt-0.5">{emailToDisplay}</p>
            {isStandardUser && (
              <div className="font-mono text-[10px] text-[#66d9cc]/90 mt-1.5 bg-[#11232c] border border-[#1e323e] px-3 py-1 rounded-full select-none flex items-center justify-center gap-1">
                <span>Nível de Acesso:</span>
                <strong className="text-[#E9C349] font-sans font-bold">{currentUser?.nivelAcesso || '1'}</strong>
              </div>
            )}

            <div className="w-full h-px bg-[#1c2c36] my-5" />

            {!isEditingSelf ? (
              <div className="w-full space-y-3.5 text-left">
                <div className="flex items-center gap-2.5 text-xs font-mono text-[#99907c]">
                  <Building className="w-4 h-4 text-[#66d9cc]" />
                  <span>{isMaster ? <>Segmento: <strong>{displaySegment}</strong></> : <strong>Acadêmico</strong>}</span>
                </div>
                <div className="flex items-center gap-2.5 text-[#99907c] text-xs font-mono">
                  <Shield className="w-4 h-4 text-[#e8c34c]" />
                  <span>Acesso: <strong>{displayAccess}</strong></span>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-mono text-[#99907c]">
                  <Phone className="w-4 h-4 text-[#26a69a]" />
                  <span>Telefone: <strong>{currentUser?.telefone || 'Não informado'}</strong></span>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-mono text-[#99907c]">
                  <Home className="w-4 h-4 text-[#66d9cc]" />
                  <span>Loja: <strong>{currentUser?.loja || 'Não informada'}</strong></span>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-mono text-[#99907c]">
                  <Compass className="w-4 h-4 text-[#E9C349]" />
                  <span>Potência: <strong>{currentUser?.potencia || 'Não informada'}</strong></span>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-mono text-[#99907c]">
                  <MapPin className="w-4 h-4 text-[#38bdf8]" />
                  <span>Cidade da Loja: <strong>{currentUser?.cidadeLoja || 'Não informada'}</strong></span>
                </div>

                {currentUser && (
                  <button
                    onClick={() => {
                      setSelfName(currentUser.name || '');
                      setSelfTelefone(currentUser.telefone || '');
                      setSelfLoja(currentUser.loja || '');
                      setSelfPotencia(currentUser.potencia || '');
                      setSelfCidadeLoja(currentUser.cidadeLoja || '');
                      setSelfPassword(currentUser.password || '');
                      setSelfEmail(currentUser.email || '');
                      setSelfAvatarUrl(currentUser.avatarUrl || '');
                      setIsEditingSelf(true);
                    }}
                    className="mt-4 w-full bg-[#11212b] border border-[#1c2c36] text-[10px] text-[#E9C349] font-mono font-bold py-2 rounded hover:bg-[#1a303d] transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Edit className="w-3 h-3" /> EDITAR DADOS DO PERFIL
                  </button>
                )}
              </div>
            ) : (
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!currentUser) return;
                  const updated: AccessUser = {
                    ...currentUser,
                    name: selfName.trim() || currentUser.name,
                    email: selfEmail.trim() || currentUser.email,
                    telefone: selfTelefone.trim() || undefined,
                    loja: selfLoja.trim() || undefined,
                    potencia: selfPotencia.trim() || undefined,
                    cidadeLoja: selfCidadeLoja.trim() || undefined,
                    password: selfPassword.trim() || undefined,
                    avatarUrl: selfAvatarUrl.trim() || undefined
                  };
                  onUpdateAccessUser(updated);
                  setIsEditingSelf(false);
                }}
                className="w-full space-y-3 text-left"
              >
                <div>
                  <label className="block text-[9px] font-mono text-[#9cbfd5] uppercase tracking-wider mb-1">Nome Completo</label>
                  <input
                    type="text"
                    required
                    value={selfName}
                    onChange={(e) => setSelfName(e.target.value)}
                    placeholder="Ex: Seu Nome Completo"
                    className="w-full bg-[#04141d] border border-[#1c2c36] text-xs px-2.5 py-2 rounded text-[#d4e5f2] focus:outline-none focus:border-[#E8C349]"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-mono text-[#9cbfd5] uppercase tracking-wider mb-1">E-mail de Acesso</label>
                  <input
                    type="email"
                    required
                    value={selfEmail}
                    onChange={(e) => setSelfEmail(e.target.value)}
                    placeholder="Ex: irmao@dominio.com"
                    className="w-full bg-[#04141d] border border-[#1c2c36] text-xs px-2.5 py-2 rounded text-[#d4e5f2] focus:outline-none focus:border-[#E8C349]"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-mono text-[#9cbfd5] uppercase tracking-wider mb-1">Foto de Perfil</label>
                  <div className="flex items-center gap-3 bg-[#04141d] border border-[#1c2c36] p-3 rounded-lg">
                    {selfAvatarUrl ? (
                      <div className="relative group shrink-0">
                        <img 
                          src={selfAvatarUrl} 
                          alt="Foto de Perfil"
                          className="w-12 h-12 rounded-full object-cover border border-[#E9C349]"
                          referrerPolicy="no-referrer"
                        />
                        <button
                          type="button"
                          onClick={() => setSelfAvatarUrl('')}
                          className="absolute -top-1 -right-1 bg-red-600 hover:bg-red-700 text-white rounded-full p-0.5 transition-colors cursor-pointer flex items-center justify-center shadow-lg"
                          title="Remover Foto"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-[#11212b] border border-[#1c2c36] flex items-center justify-center text-[#99907c] shrink-0">
                        <ImageIcon className="w-5 h-5" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <label className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded bg-[#11212b] hover:bg-[#1a303d] border border-[#1c2c36] text-[10px] font-mono font-bold text-[#E9C349] cursor-pointer transition-colors">
                        <Upload className="w-3.5 h-3.5" />
                        Carregar Arquivo
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const reader = new FileReader();
                            reader.onload = async (event) => {
                              if (event.target?.result) {
                                try {
                                  const base64Str = event.target.result as string;
                                  const compressed = await compressImage(base64Str, 400, 400, 0.75);
                                  setSelfAvatarUrl(compressed);
                                } catch (err) {
                                  console.error("Erro ao comprimir imagem:", err);
                                  setSelfAvatarUrl(event.target.result as string);
                                }
                              }
                            };
                            reader.readAsDataURL(file);
                          }}
                        />
                      </label>
                      <span className="block text-[8px] text-[#99907c] font-mono mt-1">PNG, JPG ou GIF</span>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-[9px] font-mono text-[#9cbfd5] uppercase tracking-wider mb-1">Telefone com Prefixo</label>
                  <input
                    type="text"
                    value={selfTelefone}
                    onChange={(e) => setSelfTelefone(e.target.value)}
                    placeholder="Ex: (11) 99999-9999"
                    className="w-full bg-[#04141d] border border-[#1c2c36] text-xs px-2.5 py-2 rounded text-[#d4e5f2] focus:outline-none focus:border-[#E8C349]"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-mono text-[#9cbfd5] uppercase tracking-wider mb-1">Loja</label>
                  <input
                    type="text"
                    value={selfLoja}
                    onChange={(e) => setSelfLoja(e.target.value)}
                    placeholder="Ex: Loja Fraternidade nº 42"
                    className="w-full bg-[#04141d] border border-[#1c2c36] text-xs px-2.5 py-2 rounded text-[#d4e5f2] focus:outline-none focus:border-[#E8C349]"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-mono text-[#9cbfd5] uppercase tracking-wider mb-1">Potência</label>
                  <input
                    type="text"
                    value={selfPotencia}
                    onChange={(e) => setSelfPotencia(e.target.value)}
                    placeholder="Ex: GOB / Glesp / GOP"
                    className="w-full bg-[#04141d] border border-[#1c2c36] text-xs px-2.5 py-2 rounded text-[#d4e5f2] focus:outline-none focus:border-[#E8C349]"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-mono text-[#9cbfd5] uppercase tracking-wider mb-1">Cidade da Loja</label>
                  <input
                    type="text"
                    value={selfCidadeLoja}
                    onChange={(e) => setSelfCidadeLoja(e.target.value)}
                    placeholder="Ex: São Paulo"
                    className="w-full bg-[#04141d] border border-[#1c2c36] text-xs px-2.5 py-2 rounded text-[#d4e5f2] focus:outline-none focus:border-[#E8C349]"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-mono text-[#9cbfd5] uppercase tracking-wider mb-1">Senha de Acesso</label>
                  <input
                    type="text"
                    value={selfPassword}
                    onChange={(e) => setSelfPassword(e.target.value)}
                    placeholder="Sua senha secreta"
                    className="w-full bg-[#04141d] border border-[#1c2c36] text-xs px-2.5 py-2 rounded text-[#d4e5f2] focus:outline-none focus:border-[#E8C349]"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-[#66D9CC] text-[#003732] py-2 rounded text-xs font-mono font-bold hover:bg-[#84f5e8] transition-colors cursor-pointer"
                  >
                    Salvar
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingSelf(false)}
                    className="flex-1 bg-[#11212b] border border-[#1c2c36] text-[#99907c] py-2 rounded text-xs font-mono hover:bg-[#1a303d] transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Tema do Portal Card */}
          <div id="theme-selector-card" className="bg-[#0c1d27] rounded-xl p-5 border border-[#1c2c36] space-y-4">
            <div className="flex items-center gap-2 border-b border-[#1c2c36]/60 pb-2.5">
              <Sliders className="w-4 h-4 text-[#E9C349]" />
              <h3 className="font-sans font-bold text-xs text-[#d4e5f2] uppercase tracking-wider">Aparência & Tema</h3>
            </div>
            <p className="text-[10.5px] font-mono text-[#9cbfd5] leading-relaxed">
              Personalize o ambiente de ensino da Masonic Academy. Escolha o tema que melhor se adapta à sua leitura.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => onThemeChange?.('dark')}
                className={`flex flex-col items-center justify-center p-3.5 rounded-lg border-2 transition-all cursor-pointer ${
                  theme === 'dark'
                    ? 'border-[#E9C349] bg-[#04141d] text-[#E9C349]'
                    : 'border-[#1c2c36] bg-[#0c1d27] text-[#99907c] hover:border-[#99907c]/40 hover:text-[#d4e5f2]'
                }`}
              >
                <Moon className="w-5 h-5 mb-1.5" />
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider">Tema Escuro</span>
                <span className="text-[8px] font-mono opacity-80 mt-0.5">Foco & Conforto visual</span>
              </button>
              
              <button
                type="button"
                onClick={() => onThemeChange?.('light')}
                className={`flex flex-col items-center justify-center p-3.5 rounded-lg border-2 transition-all cursor-pointer ${
                  theme === 'light'
                    ? 'border-[#E9C349] bg-[#04141d] text-[#E9C349]'
                    : 'border-[#1c2c36] bg-[#0c1d27] text-[#99907c] hover:border-[#99907c]/40 hover:text-[#d4e5f2]'
                }`}
              >
                <Sun className="w-5 h-5 mb-1.5" />
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider">Tema Claro</span>
                <span className="text-[8px] font-mono opacity-80 mt-0.5">Leitura sob luz do dia</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'reports' && (
        // Reports CRUD Management Sub-tab
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT PANEL: Reports List selector */}
          <div className="lg:col-span-4 bg-[#0c1d27] rounded-xl p-4 border border-[#1c2c36] space-y-4">
            <div className="flex items-center justify-between border-b border-[#1c2c36] pb-3 flex-wrap gap-2">
              <div>
                <h3 className="font-sans font-bold text-sm text-[#d4e5f2]">Catálogo de Cursos</h3>
                <p className="text-[10px] font-mono text-[#99907c] mt-0.5">Clique para selecionar e editar dados</p>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setShowImportPanel(!showImportPanel)}
                  className="bg-[#11212b] text-[#66d9cc] text-[10px] font-mono font-bold px-3 py-1.5 rounded border border-[#1c2c36] hover:bg-[#1c2c36] transition-colors flex items-center gap-1 cursor-pointer"
                  title="Importar de arquivo Excel"
                >
                  <Upload className="w-3 h-3" /> Importar
                </button>
                <button
                  onClick={handleStartCreateNew}
                  className="bg-[#66D9CC] text-[#02332e] text-[10px] font-mono font-bold px-3 py-1.5 rounded hover:bg-[#83f7eb] transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3 h-3" /> Incluir
                </button>
              </div>
            </div>

            {showImportPanel && (
              <div className="bg-[#04141d] border border-[#1c2c36] rounded-lg p-3.5 space-y-3 animate-fadeIn text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-[#E9C349] font-bold uppercase tracking-wider">Importar de Excel / CSV</span>
                  <button
                    type="button"
                    onClick={() => {
                      setShowImportPanel(false);
                      setImportedRows([]);
                      setImportError(null);
                      setImportSuccess(null);
                    }}
                    className="text-[#99907c] hover:text-[#d4e5f2] cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                
                <p className="text-[10px] text-[#9cbfd5] leading-relaxed">
                  Envie um arquivo Excel (.xlsx, .xls) contendo os dados dos cursos. Os campos <strong className="text-white">titulo</strong> e <strong className="text-white">status</strong> são obrigatórios.
                </p>
                <div className="bg-[#0c1d27]/60 p-2 rounded border border-[#1c2c36] font-mono text-[9px] text-[#a5b8c7] space-y-1">
                  <div>• <strong className="text-white">titulo</strong> (Obrigatório - Nome do curso)</div>
                  <div>• <strong className="text-white">status</strong> (Obrigatório - 'Ativo' ou 'Inativo')</div>
                  <div>• <strong className="text-white">instrutor</strong>, <strong className="text-white">grau</strong>, <strong className="text-white">resumo</strong>, <strong className="text-white">tags</strong> (Opcionais)</div>
                  <div>• <strong className="text-white">link material 1</strong> até <strong className="text-white">link material 6</strong> (Opcionais)</div>
                </div>

                <div className="flex items-center justify-between border-t border-[#1c2c36]/40 pt-2">
                  <span className="text-[10px] text-[#99907c] font-mono">Deseja usar um modelo?</span>
                  <button
                    type="button"
                    onClick={downloadCourseModelExcel}
                    className="text-[#66d9cc] hover:text-[#83f7eb] text-[10px] font-mono font-bold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Download className="w-3 h-3" /> Baixar Modelo Excel
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="flex flex-col items-center justify-center border border-dashed border-[#1c2c36] hover:border-[#E9C349]/55 bg-[#081721] rounded-lg p-4 cursor-pointer text-center group transition-all">
                    <Upload className="w-5 h-5 text-[#99907c] group-hover:text-[#66d9cc] mb-1.5 transition-colors" />
                    <span className="text-[10px] font-mono text-[#99907c] group-hover:text-[#d4e5f2] transition-colors">
                      Selecionar Arquivo
                    </span>
                    <input
                      type="file"
                      accept=".xlsx,.xls,.csv"
                      className="hidden"
                      onChange={handleExcelFileChange}
                    />
                  </label>
                </div>

                {importError && (
                  <div className="bg-red-950/20 text-rose-400 border border-rose-900/30 p-2 rounded text-[10px] font-mono">
                    ❌ {importError}
                  </div>
                )}

                {importedRows.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <div className="bg-[#185347]/20 text-[#66d9cc] border border-[#26a69a]/35 p-2 rounded text-[10px] font-mono">
                      ✅ {importedRows.length} títulos detectados com sucesso!
                    </div>
                    
                    <div className="bg-[#081721] max-h-[120px] overflow-y-auto border border-[#1c2c36] rounded p-1.5 font-mono text-[9px] space-y-1 text-[#99907c]">
                      {importedRows.slice(0, 5).map((row, index) => (
                        <div key={index} className="truncate border-b border-[#1c2c36]/40 pb-0.5 last:border-0">
                          <span className="text-[#66d9cc] font-bold">Grau {row.nivelCurso}</span> — {row.title} ({row.owner})
                        </div>
                      ))}
                      {importedRows.length > 5 && (
                        <div className="text-center text-[8px] text-[#99907c] pt-0.5 italic">
                          ...e mais {importedRows.length - 5} títulos.
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={handleConfirmImport}
                      className="w-full bg-[#E9C349] text-[#241a00] font-mono font-extrabold text-[10px] uppercase py-2 rounded-md hover:bg-[#ffe088] transition-all cursor-pointer active:scale-95 text-center block"
                    >
                      Confirmar Importação de {importedRows.length} Títulos
                    </button>
                  </div>
                )}

                {importSuccess && (
                  <div className="bg-[#185347]/20 text-[#66d9cc] border border-[#26a69a]/35 p-2 rounded text-[10px] font-mono">
                    🎉 {importSuccess}
                  </div>
                )}
              </div>
            )}

            {/* Quick Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#99907c]" />
              <input
                type="text"
                placeholder="Busca por título ou ID..."
                value={reportsSearchQuery}
                onChange={(e) => setReportsSearchQuery(e.target.value)}
                className="w-full bg-[#04141d] border border-[#1c2c36] text-[11px] pl-8 pr-3 py-2 rounded text-[#d4e5f2] placeholder-[#99907c] focus:outline-none font-mono"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center justify-between border-t border-[#1c2c36]/40 pt-2 font-mono text-[10px]">
              <span className="text-[#99907c] uppercase select-none font-bold">Status:</span>
              <div className="flex gap-1">
                {[
                  { id: 'todos', label: 'Todos' },
                  { id: 'Ativo', label: 'Ativos' },
                  { id: 'Inativo', label: 'Inativos' }
                ].map((st) => {
                  const active = reportsStatusFilter === st.id;
                  return (
                    <button
                      key={st.id}
                      onClick={() => setReportsStatusFilter(st.id as any)}
                      className={`px-2 py-0.5 rounded text-[9px] font-bold cursor-pointer border transition-colors ${
                        active
                          ? 'bg-[#E9C349]/15 text-[#E9C349] border-[#E9C349]/40'
                          : 'bg-[#081721]/60 text-[#99907c] border-[#1c2c36]/50 hover:text-[#d4e5f2]'
                      }`}
                    >
                      {st.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* List Rows */}
            <div className="space-y-1.5 max-h-[480px] overflow-y-auto pr-1">
              {filteredList.map((rep) => {
                const isActive = showForm && formId === rep.id;
                const isDeleting = deletingReportId === rep.id;
                // color indicator maps
                const labelColor = {
                  gold: 'border-l-[#E9C349]',
                  teal: 'border-l-[#66D9CC]',
                  blue: 'border-l-[#38bdf8]',
                  purple: 'border-l-[#c084fc]',
                }[rep.leftBorderColor || 'gold'];

                return (
                  <div
                    key={rep.id}
                    onClick={() => handleSelectToEdit(rep)}
                    className={`p-3 rounded-lg border text-left text-xs transition-all cursor-pointer flex items-center justify-between border-l-4 ${labelColor} ${
                      isActive 
                        ? 'bg-[#06273a] border-[#E9C349]/50' 
                        : 'bg-[#11212b]/60 border-[#1c2c36] hover:bg-[#06273a]/30'
                    }`}
                  >
                    <div className="space-y-1 pr-2 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-mono text-[9px] text-[#E9C349] bg-[#1a2d39] px-1 py-0.5 rounded border border-[#1c2c36] font-bold">
                          {rep.id}
                        </span>
                        <span className={`text-[8px] font-mono font-bold px-1.5 py-0.2 rounded border ${
                          rep.status !== 'Inativo'
                            ? 'bg-[rgba(38,166,154,0.1)] border-[#26a69a]/40 text-[#66d9cc]'
                            : 'bg-red-950/20 border-red-900/40 text-red-400'
                        }`}>
                          {rep.status !== 'Inativo' ? 'Ativo' : 'Inativo'}
                        </span>
                        <span className="text-[9px] font-mono text-[#99907c] tracking-tight truncate max-w-[100px]">
                          {rep.department}
                        </span>
                      </div>
                      <h4 className="font-sans font-bold text-[#d4e5f2] truncate text-[11px]">
                        {rep.title}
                      </h4>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {isDeleting ? (
                        <div className="flex items-center gap-1 bg-red-950/80 p-0.5 rounded border border-red-800">
                          <button
                            onClick={(e) => handleConfirmDelete(rep.id, e)}
                            className="text-red-300 font-mono text-[9px] font-bold px-1.5 py-0.5 bg-red-900 rounded hover:bg-red-800"
                            title="Confirmar exclusão permanente"
                          >
                            Sim
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeletingReportId(null);
                            }}
                            className="text-gray-300 font-mono text-[9px] px-1.5 py-0.5 hover:bg-[#0c1d27]"
                          >
                            Não
                          </button>
                        </div>
                      ) : (
                        <>
                          <button
                            onClick={(e) => handleDeleteTrigger(rep.id, e)}
                            className="p-1 rounded text-[#99907c] hover:text-red-400 hover:bg-[#1a2d39]/40 transition-colors"
                            title="Excluir curso do painel"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <ChevronRight className="w-3.5 h-3.5 text-[#99907c] opacity-60" />
                        </>
                      )}
                    </div>
                  </div>
                );
              })}

              {filteredList.length === 0 && (
                <div className="text-center py-10 bg-[#0c1d27]/40 rounded-lg border border-dashed border-[#1c2c36]/60 text-[#99907c] space-y-2">
                  <Layers className="w-8 h-8 mx-auto opacity-30" />
                  <p className="text-[11px] font-mono">Nenhum registro localizado</p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT PANEL: Form for adding/editing report */}
          <div className="lg:col-span-8 space-y-4">
            {!showForm ? (
              <div className="bg-[#0c1d27]/20 border border-dashed border-[#1c2c36]/40 rounded-xl p-12 text-center text-[#99907c] font-mono text-xs">
                Selecione um título no catálogo ao lado para visualizar ou editar os dados.
              </div>
            ) : (
              // Full CRUD Editor Form
              <div id="crud-form-window" className="bg-[#0c1d27] rounded-xl border border-[#1c2c36] overflow-hidden shadow-xl animate-fade-in">
                
                {/* Form Header */}
                <div id="crud-form-header" className="bg-[#08151e] p-4 border-b border-[#1c2c36] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded bg-[#11212b] border border-[#1c2c36]">
                      {isCreatingNew ? (
                        <Plus className="w-4 h-4 text-[#66d9cc]" />
                      ) : (
                        <Edit className="w-4 h-4 text-[#E9C349]" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-sans font-bold text-sm text-[#d4e5f2]">
                        {isCreatingNew ? 'Cadastrar Novo Curso de Controle' : `Editar Curso: ${formTitle}`}
                      </h3>
                      <p className="text-[10px] font-mono text-[#E9C349]">
                        {isCreatingNew ? 'GERANDO NOVO ATIVO PARALELO' : `ID DE CONFIABILIDADE DE REGISTRO: ${formId}`}
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setShowForm(false)}
                    className="p-1 rounded-full text-[#99907c] hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Form Elements */}
                <form onSubmit={handleSaveReport} className="p-5 space-y-4">
                  {crudError && (
                    <div className="bg-rose-950/50 border border-rose-500/40 p-3 rounded text-xs font-mono text-rose-300 leading-normal flex items-start gap-2">
                      <HelpCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                      <div>{crudError}</div>
                    </div>
                  )}

                  {crudSuccess && (
                    <div className="bg-emerald-950/40 border border-emerald-500/30 p-3 rounded text-xs font-mono text-[#66d9cc] text-center flex items-center justify-center gap-2">
                      <Check className="w-4 h-4 text-[#66d9cc]" />
                      {crudSuccess}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-mono text-[#9cbfd5] mb-1 uppercase tracking-wider">Código ID (Sistema Único comercial)</label>
                        <input
                          type="text"
                          required
                          disabled={!isCreatingNew}
                          placeholder="Ex: rep-7"
                          value={formId}
                          onChange={(e) => setFormId(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                          className="w-full bg-[#04141d] border border-[#1c2c36] text-xs px-3 py-2 rounded text-[#d4e5f2] disabled:opacity-50 disabled:cursor-not-allowed uppercase font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono text-[#9cbfd5] mb-1 uppercase tracking-wider">Título de Exibição do Cartaz</label>
                        <input
                          type="text"
                          required
                          placeholder="Ex: MARGEM LÍQUIDA INTERNACIONAL"
                          value={formTitle}
                          onChange={(e) => setFormTitle(e.target.value)}
                          className="w-full bg-[#04141d] border border-[#1c2c36] text-xs px-3 py-2 rounded text-[#d4e5f2] focus:outline-none focus:border-[#E9C349]"
                        />
                      </div>



                      <div>
                        <label className="block text-[10px] font-mono text-[#9cbfd5] mb-1 uppercase tracking-wider">Instrutor</label>
                        <input
                          type="text"
                          placeholder="Ex: Daniel Luciano"
                          value={formOwner}
                          onChange={(e) => setFormOwner(e.target.value)}
                          className="w-full bg-[#04141d] border border-[#1c2c36] text-xs px-3 py-2 rounded text-[#d4e5f2] focus:outline-none focus:border-[#E9C349]"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono text-[#9cbfd5] mb-1 uppercase tracking-wider">Categoria</label>
                        <input
                          type="text"
                          placeholder="Ex: ESTRATÉGIA, TECNOLOGIA, etc."
                          value={formCategory}
                          onChange={(e) => setFormCategory(e.target.value)}
                          className="w-full bg-[#04141d] border border-[#1c2c36] text-xs px-3 py-2 rounded text-[#d4e5f2] focus:outline-none focus:border-[#E9C349]"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono text-[#9cbfd5] mb-1 uppercase tracking-wider">Cor de Borda Lateral (Visual)</label>
                        <select
                          value={formLeftBorderColor}
                          onChange={(e) => setFormLeftBorderColor(e.target.value as any)}
                          className="w-full bg-[#04141d] border border-[#1c2c36] text-xs px-2.5 py-2 rounded text-[#d4e5f2] focus:outline-none focus:border-[#E9C349] font-mono"
                        >
                          <option value="gold">Dourado (Estratégico / Crítico)</option>
                          <option value="teal">Verde-Teal (Operacional / Seguro)</option>
                          <option value="blue">Azul (Tecnologia / Suporte)</option>
                          <option value="purple">Roxo (Especial / Governança)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono text-[#9cbfd5] mb-1 uppercase tracking-wider">Última Data de Revisão</label>
                        <input
                          type="text"
                          placeholder="Ex: 05 Jun 2026"
                          value={formLastUpdated}
                          onChange={(e) => setFormLastUpdated(e.target.value)}
                          className="w-full bg-[#04141d] border border-[#1c2c36] text-xs px-3 py-2 rounded text-[#d4e5f2] focus:outline-none focus:border-[#E9C349]"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono text-[#9cbfd5] mb-1 uppercase tracking-wider">Nível de Acesso Cursos (Grau)</label>
                        <select
                          value={formNivelCurso || 1}
                          onChange={(e) => setFormNivelCurso(Number(e.target.value))}
                          className="w-full bg-[#04141d] border border-[#1c2c36] text-xs px-2.5 py-2.5 rounded text-[#d4e5f2] focus:outline-none focus:border-[#E9C349] font-sans"
                        >
                          {Array.from({ length: 33 }, (_, i) => i + 1).map((g) => (
                            <option key={g} value={g}>
                              {getGlobalDegreeLabel(g)}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono text-[#9cbfd5] mb-1 uppercase tracking-wider">Status do Título</label>
                        <select
                          value={formStatus}
                          onChange={(e) => setFormStatus(e.target.value as 'Ativo' | 'Inativo')}
                          className="w-full bg-[#04141d] border border-[#1c2c36] text-xs px-3 py-2 rounded text-[#d4e5f2] focus:outline-none focus:border-[#E9C349]"
                        >
                          <option value="Ativo">Ativo</option>
                          <option value="Inativo">Inativo</option>
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-mono text-[#9cbfd5] mb-1 uppercase tracking-wider">Questionário Vinculado</label>
                        <select
                          value={formLinkedQuestionnaireId}
                          onChange={(e) => setFormLinkedQuestionnaireId(e.target.value)}
                          className="w-full bg-[#04141d] border border-[#1c2c36] text-xs px-3 py-2 rounded text-[#d4e5f2] focus:outline-none focus:border-[#E9C349] font-mono cursor-pointer"
                        >
                          <option value="">-- Nenhum Selecionado --</option>
                          {questionnaires.map((q) => (
                            <option key={q.id} value={q.id}>
                              {q.title} (Requer Grau {q.degreeRequired || 1})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-mono text-[#9cbfd5] mb-1 uppercase tracking-wider">Curso Pré-requisito (Jornada / Trilha de Aprendizado)</label>
                        <select
                          value={formPrerequisiteId}
                          onChange={(e) => setFormPrerequisiteId(e.target.value)}
                          className="w-full bg-[#04141d] border border-[#1c2c36] text-xs px-3 py-2 rounded text-[#d4e5f2] focus:outline-none focus:border-[#E9C349] font-mono cursor-pointer"
                        >
                          <option value="">-- Nenhum (Curso Inicial ou Independente) --</option>
                          {reports
                            .filter((r) => isCreatingNew || r.id !== editReportId)
                            .map((r) => (
                              <option key={r.id} value={r.id}>
                                {r.title} ({r.category})
                              </option>
                            ))}
                        </select>
                        <p className="text-[9px] font-mono text-[#99907c] mt-1">
                          Se selecionado, este curso só será desbloqueado para o aluno após a conclusão total do curso pré-requisito selecionado, criando uma jornada/trilha de estudos.
                        </p>
                      </div>

                      <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-mono text-[#9cbfd5] mb-1 uppercase tracking-wider">Resumo do Conteúdo (Exibido no cartão)</label>
                          <textarea
                            placeholder="Descreva o propósito deste analítico em poucas palavras..."
                            value={formSummary}
                            onChange={(e) => setFormSummary(e.target.value)}
                            rows={3}
                            className="w-full bg-[#04141d] border border-[#1c2c36] text-xs p-3 rounded text-[#d4e5f2] focus:outline-none focus:border-[#E9C349]"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-mono text-[#9cbfd5] mb-1 uppercase tracking-wider">Tags Comerciais (Separadas por vírgula)</label>
                          <textarea
                            placeholder="Ex: RM, EBITDA, SaaS, Vendas"
                            value={formTags}
                            onChange={(e) => setFormTags(e.target.value)}
                            rows={3}
                            className="w-full bg-[#04141d] border border-[#1c2c36] text-xs p-3 rounded text-[#d4e5f2] focus:outline-none focus:border-[#E8C349]"
                          />
                          <p className="text-[9px] font-mono text-[#98907b] mt-1 italic">
                            Insira termos para facilitar a busca e indexação de dados.
                          </p>
                        </div>
                      </div>

                      <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-[#1c2c36]/40 pt-4 mt-2">
                        <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="flex flex-col space-y-2.5">
                            <label className="block text-[10px] font-mono text-[#9cbfd5] mb-0.5 uppercase tracking-wider font-bold">
                              Miniatura do Curso <span className="text-[#E9C349] font-sans font-medium text-[9.5px] lowercase normal-case">(Sugestão: 128x128px ou proporção quadrado 1:1)</span>
                            </label>
                            
                            {/* Option 1: URL input */}
                            <div className="space-y-1 bg-[#04141d]/30 p-2.5 rounded border border-[#1c2c36]/40">
                              <span className="block text-[9px] font-mono text-gray-500 uppercase tracking-wide">Opção 1: URL de Imagem</span>
                              <input
                                type="url"
                                placeholder="https://exemplo.com/miniatura.jpg"
                                value={formThumbnailUrl.startsWith('data:image/') ? '' : formThumbnailUrl}
                                onChange={(e) => {
                                  setFormThumbnailUrl(e.target.value);
                                  setThumbnailUploadError(null);
                                }}
                                className="w-full bg-[#04141d] border border-[#1c2c36] text-xs px-2.5 py-1.5 rounded text-[#d4e5f2] focus:outline-none focus:border-[#E9C349]"
                              />
                            </div>

                            {/* Option 2: Upload from Computer */}
                            <div className="space-y-1 bg-[#04141d]/30 p-2.5 rounded border border-[#1c2c36]/40">
                              <span className="block text-[9px] font-mono text-gray-500 uppercase tracking-wide mb-1">Opção 2: Enviar do Computador</span>
                              <div
                                onClick={() => document.getElementById('profile-thumbnail-picker')?.click()}
                                className="border border-dashed border-[#1c2c36]/80 hover:border-[#E9C349]/50 rounded-lg p-3 bg-[#04141d] text-center cursor-pointer transition-all flex flex-col items-center justify-center group"
                              >
                                <input
                                  id="profile-thumbnail-picker"
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;

                                    if (file.size > 10 * 1024 * 1024) {
                                      setThumbnailUploadError("Imagem muito grande (máx 10MB).");
                                      return;
                                    }

                                    const reader = new FileReader();
                                    reader.onload = async (event) => {
                                      if (event.target?.result) {
                                        try {
                                          const base64Str = event.target.result as string;
                                          // Compressing profile thumbnail to max 800 width, 600 height
                                          const compressed = await compressImage(base64Str, 800, 600, 0.75);
                                          setFormThumbnailUrl(compressed);
                                          setThumbnailUploadError(null);
                                        } catch (err) {
                                          console.error("Error compressing image:", err);
                                          setFormThumbnailUrl(event.target.result as string);
                                          setThumbnailUploadError(null);
                                        }
                                      }
                                    };
                                    reader.readAsDataURL(file);
                                  }}
                                />
                                <Upload className="w-4 h-4 text-[#99907c] group-hover:text-[#E9C349] transition-colors mb-1" />
                                <span className="text-[10px] text-[#d4e5f2] font-semibold">Escolher imagem local</span>
                                <span className="text-[8px] text-[#99907c] font-mono mt-0.5">JPG, PNG, WEBP (Máx 2MB)</span>
                              </div>
                            </div>

                            {/* Upload dynamic diagnostic alerts */}
                            {thumbnailUploadError && (
                              <p className="text-[9px] font-mono text-red-400 bg-red-950/20 px-2 py-1 rounded border border-red-900/40 leading-tight">
                                ⚠️ {thumbnailUploadError}
                              </p>
                            )}

                            {/* Responsive live thumbnail visualizer */}
                            {formThumbnailUrl && (
                              <div className="flex items-center gap-3 bg-[#05151e] p-2.5 rounded border border-[#1c2c36] animate-fadeIn">
                                <div className="w-18 h-18 rounded overflow-hidden border border-[#1c2c36] bg-[#04141d] shrink-0 shadow-md">
                                  <img 
                                    src={formThumbnailUrl} 
                                    alt="Prévia Miniatura" 
                                    className="w-full h-full object-cover"
                                    onError={() => {
                                      setThumbnailUploadError("Erro ao processar imagem ou link quebrado.");
                                    }}
                                  />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <span className="block text-[8px] font-mono text-gray-500 uppercase">Pré-visualização Ativa</span>
                                  <span className="block text-[9px] font-mono text-[#99907c] truncate">
                                    {formThumbnailUrl.startsWith('data:image/') ? 'Arquivo local carregado' : formThumbnailUrl}
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setFormThumbnailUrl('');
                                    setThumbnailUploadError(null);
                                  }}
                                  className="text-[9px] font-mono text-red-400 hover:text-red-300 hover:underline px-1 py-0.5"
                                >
                                  Remover
                                </button>
                              </div>
                            )}
                          </div>

                          <div>
                            <label className="block text-[10px] font-mono text-[#9cbfd5] mb-1 uppercase tracking-wider">Link Personalizado do Botão ACESSAR (URL)</label>
                            <input
                              type="url"
                              placeholder="https://exemplo.com/direcionamento-direto"
                              value={formCustomAccessUrl}
                              onChange={(e) => setFormCustomAccessUrl(e.target.value)}
                              className="w-full bg-[#04141d] border border-[#1c2c36] text-xs px-3 py-2 rounded text-[#d4e5f2] focus:outline-none focus:border-[#E8C349]"
                            />
                            <p className="text-[9px] font-mono text-[#98907b] mt-1 italic">
                              Opcional. Redireciona o botão ACESSAR diretamente para este endereço se preenchido.
                            </p>
                          </div>
                        </div>

                        {/* Novos Campos de Materiais Complementares */}
                        <div className="sm:col-span-2 border-t border-[#1c2c36]/20 pt-4 mt-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-[10px] font-mono text-[#9cbfd5] mb-1 uppercase tracking-wider">Link do Material 1 / Referência Direta (URL)</label>
                            <input
                              type="url"
                              id="input-material-1-link"
                              placeholder="https://exemplo.com/material1"
                              value={formMaterial1Link}
                              onChange={(e) => setFormMaterial1Link(e.target.value)}
                              className="w-full bg-[#04141d] border border-[#1c2c36] text-xs px-3 py-2 rounded text-[#d4e5f2] focus:outline-none focus:border-[#E8C349]"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-mono text-[#9cbfd5] mb-1 uppercase tracking-wider">Link do Material 2 / Referência Direta (URL)</label>
                            <input
                              type="url"
                              id="input-material-2-link"
                              placeholder="https://exemplo.com/material2"
                              value={formMaterial2Link}
                              onChange={(e) => setFormMaterial2Link(e.target.value)}
                              className="w-full bg-[#04141d] border border-[#1c2c36] text-xs px-3 py-2 rounded text-[#d4e5f2] focus:outline-none focus:border-[#E8C349]"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-mono text-[#9cbfd5] mb-1 uppercase tracking-wider">Link do Material 3 / Referência Direta (URL)</label>
                            <input
                              type="url"
                              id="input-material-3-link"
                              placeholder="https://exemplo.com/material3"
                              value={formMaterial3Link}
                              onChange={(e) => setFormMaterial3Link(e.target.value)}
                              className="w-full bg-[#04141d] border border-[#1c2c36] text-xs px-3 py-2 rounded text-[#d4e5f2] focus:outline-none focus:border-[#E8C349]"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-mono text-[#9cbfd5] mb-1 uppercase tracking-wider">Link do Material 4 / Referência Direta (URL)</label>
                            <input
                              type="url"
                              id="input-material-4-link"
                              placeholder="https://exemplo.com/material4"
                              value={formMaterial4Link}
                              onChange={(e) => setFormMaterial4Link(e.target.value)}
                              className="w-full bg-[#04141d] border border-[#1c2c36] text-xs px-3 py-2 rounded text-[#d4e5f2] focus:outline-none focus:border-[#E8C349]"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-mono text-[#9cbfd5] mb-1 uppercase tracking-wider">Link do Material 5 / Referência Direta (URL)</label>
                            <input
                              type="url"
                              id="input-material-5-link"
                              placeholder="https://exemplo.com/material5"
                              value={formMaterial5Link}
                              onChange={(e) => setFormMaterial5Link(e.target.value)}
                              className="w-full bg-[#04141d] border border-[#1c2c36] text-xs px-3 py-2 rounded text-[#d4e5f2] focus:outline-none focus:border-[#E8C349]"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-mono text-[#9cbfd5] mb-1 uppercase tracking-wider">Link do Material 6 / Referência Direta (URL)</label>
                            <input
                              type="url"
                              id="input-material-6-link"
                              placeholder="https://exemplo.com/material6"
                              value={formMaterial6Link}
                              onChange={(e) => setFormMaterial6Link(e.target.value)}
                              className="w-full bg-[#04141d] border border-[#1c2c36] text-xs px-3 py-2 rounded text-[#d4e5f2] focus:outline-none focus:border-[#E8C349]"
                            />
                          </div>
                        </div>

                        {/* Link da Prova do Conteúdo / Referência Direta abaixo dos materiais */}
                        <div className="sm:col-span-2 border-t border-[#1c2c36]/20 pt-4 mt-1">
                          <label className="block text-[10px] font-mono text-[#9cbfd5] mb-1 uppercase tracking-wider">Link da Prova do Conteúdo / Referência Direta (URL)</label>
                          <input
                            type="url"
                            placeholder="https://exemplo.com/documento-compl"
                            value={formAdditionalLink}
                            onChange={(e) => setFormAdditionalLink(e.target.value)}
                            className="w-full bg-[#04141d] border border-[#1c2c36] text-xs px-3 py-2 rounded text-[#d4e5f2] focus:outline-none focus:border-[#E9C349]"
                          />
                          <p className="text-[9px] font-mono text-[#98907b] mt-1 italic">
                            Atalho de consulta adicional rápida ou prova do conteúdo (ex: Formulário, Google Forms).
                          </p>

                          {/* Conteúdo Sem Prova Flag */}
                          <div className="mt-3 flex items-center gap-2">
                            <input
                              type="checkbox"
                              id="input-conteudo-sem-prova"
                              checked={formConteudoSemProva}
                              onChange={(e) => setFormConteudoSemProva(e.target.checked)}
                              className="w-4 h-4 rounded bg-[#04141d] border border-[#1c2c36] text-[#E9C349] focus:outline-none cursor-pointer accent-[#E9C349]"
                            />
                            <label htmlFor="input-conteudo-sem-prova" className="text-xs font-mono font-medium text-[#d4e5f2] cursor-pointer select-none">
                              Conteúdo sem prova
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                  {/* Form Trigger Buttons */}
                  <div className="pt-4 border-t border-[#1c2c36] flex flex-col sm:flex-row justify-between items-center gap-3">
                    <span className="text-[10px] font-mono text-[#99907c] text-center sm:text-left">
                      Daniel Luciano • Autoridade de Segurança de Dados Direta
                    </span>

                    <div className="flex gap-2.5 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={() => setShowForm(false)}
                        className="flex-1 sm:flex-none text-xs font-mono font-bold text-[#99907c] hover:text-[#d4e5f2] px-4 py-2.5 rounded bg-[#11212b] border border-[#1c2c36] text-center transition-colors cursor-pointer"
                      >
                        Cancelar
                      </button>
                      
                      <button
                        type="submit"
                        disabled={!!crudSuccess}
                        className="flex-1 sm:flex-none bg-[#E9C349] text-[#241a00] text-xs font-mono font-bold px-6 py-2.5 rounded hover:bg-[#ffe088] transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 disabled:opacity-50"
                      >
                        <Check className="w-4 h-4" />
                        {isCreatingNew ? 'Confirmar Cadastro' : 'Salvar Alterações'}
                      </button>
                    </div>
                  </div>
                </form>

              </div>
            )}
          </div>

        </div>
      )}

      {activeSubTab === 'accesses' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fade-in text-left">
          
          {/* LEFT PANEL: Users List selector */}
          <div className="lg:col-span-5 bg-[#0c1d27] rounded-xl p-4 border border-[#1c2c36] space-y-4">
            <div className="flex items-center justify-between border-b border-[#1c2c36] pb-3">
              <div>
                <h3 className="font-sans font-bold text-sm text-[#d4e5f2]">Controle de Acessos</h3>
                <p className="text-[10px] font-mono text-[#99907c] mt-0.5">Definição de privilégios de cursos por e-mail</p>
              </div>
              <div className="flex gap-1.5">
                <button
                  onClick={() => setShowAccessImportPanel(!showAccessImportPanel)}
                  className="bg-[#E9C349]/10 border border-[#E9C349]/30 text-[#f2ca50] hover:bg-[#E9C349]/20 text-[10px] font-mono font-bold px-2.5 py-1.5 rounded transition-colors flex items-center gap-1 cursor-pointer"
                  title="Importar acessos de arquivo Excel/CSV"
                >
                  <Upload className="w-3 h-3" /> Importar
                </button>
                <button
                  onClick={handleStartCreateNewUser}
                  className="bg-[#66D9CC] text-[#02332e] text-[10px] font-mono font-bold px-2.5 py-1.5 rounded hover:bg-[#83f7eb] transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3 h-3" /> Incluir
                </button>
              </div>
            </div>

            {/* COLLAPSIBLE ACCESS IMPORT PANEL */}
            {showAccessImportPanel && (
              <div className="bg-[#05151e] border border-[#1c2c36] p-3 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-[#E9C349] font-bold uppercase tracking-wider">Importar Acessos via Excel / CSV</span>
                  <button 
                    onClick={() => {
                      setShowAccessImportPanel(false);
                      setImportedAccessRows([]);
                      setAccessImportError(null);
                      setAccessImportSuccess(null);
                    }}
                    className="text-[#99907c] hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                
                <p className="text-[10px] text-[#9cbfd5] leading-relaxed">
                  Faça o upload de uma planilha (.xlsx, .xls ou .csv) contendo as credenciais de acesso para importação em lote.
                </p>

                {/* Model / Template Download link */}
                <div className="flex justify-between items-center text-[10px] font-mono bg-[#0c1d27] p-2 rounded border border-[#1c2c36]/60">
                  <span className="text-[#99907c]">Baixar planilha exemplo:</span>
                  <button 
                    onClick={downloadAccessModelExcel}
                    className="text-[#E9C349] hover:underline flex items-center gap-1 cursor-pointer font-bold"
                  >
                    <FileText className="w-3 h-3" /> modelo_acessos.xlsx
                  </button>
                </div>

                <div className="space-y-2">
                  <input
                    type="file"
                    accept=".xlsx, .xls, .csv"
                    onChange={handleAccessExcelFileChange}
                    className="w-full text-[10px] text-[#9cbfd5] file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:font-mono file:bg-[#11212b] file:text-[#d4e5f2] hover:file:bg-[#1a2d39] file:cursor-pointer cursor-pointer font-mono"
                  />
                  
                  {accessImportError && (
                    <div className="bg-rose-950/40 border border-rose-900/60 p-2 rounded text-[10px] font-mono text-rose-300 leading-normal">
                      ❌ {accessImportError}
                    </div>
                  )}

                  {accessImportSuccess && (
                    <div className="bg-emerald-950/40 border border-emerald-900/60 p-2 rounded text-[10px] font-mono text-[#66d9cc] text-center">
                      ✓ {accessImportSuccess}
                    </div>
                  )}

                  {importedAccessRows.length > 0 && (
                    <div className="space-y-2">
                      <div className="bg-[#0c1d27] border border-[#1c2c36] p-2 rounded text-[10px] font-mono max-h-[120px] overflow-y-auto space-y-1">
                        <div className="text-[#99907c] font-bold border-b border-[#1c2c36] pb-1 mb-1">
                          Pronto para importar ({importedAccessRows.length} linhas):
                        </div>
                        {importedAccessRows.map((u, i) => (
                          <div key={i} className="flex justify-between text-[#9cbfd5] truncate">
                            <span>{u.name} ({u.email})</span>
                            <span className="text-[#E9C349]">Grau {u.nivelAcesso || '1'}</span>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={handleConfirmAccessImport}
                        className="w-full bg-[#E9C349] text-[#02332e] hover:bg-[#f3cf59] text-[10px] font-mono font-bold py-2 rounded transition-all cursor-pointer shadow-md uppercase tracking-wider"
                      >
                        Confirmar Importação de {importedAccessRows.length} Acessos
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Quick Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#99907c]" />
              <input
                type="text"
                placeholder="Busca por nome ou e-mail..."
                value={accessSearchQuery}
                onChange={(e) => setAccessSearchQuery(e.target.value)}
                className="w-full bg-[#04141d] border border-[#1c2c36] text-[11px] pl-8 pr-3 py-2 rounded text-[#d4e5f2] placeholder-[#99907c] focus:outline-none font-mono"
              />
            </div>

            {/* User Status Filter */}
            <div className="flex items-center justify-between border-t border-[#1c2c36]/40 pt-2 font-mono text-[10px]">
              <span className="text-[#99907c] uppercase select-none font-bold">Status:</span>
              <div className="flex gap-1">
                {[
                  { id: 'todos', label: 'Todos' },
                  { id: 'Ativo', label: 'Ativos' },
                  { id: 'Inativo', label: 'Inativos' }
                ].map((st) => {
                  const active = accessStatusFilter === st.id;
                  return (
                    <button
                      key={st.id}
                      onClick={() => setAccessStatusFilter(st.id as any)}
                      className={`px-2 py-0.5 rounded text-[9px] font-bold cursor-pointer border transition-colors ${
                        active
                          ? 'bg-[#E9C349]/15 text-[#E9C349] border-[#E9C349]/40'
                          : 'bg-[#081721]/60 text-[#99907c] border-[#1c2c36]/50 hover:text-[#d4e5f2]'
                      }`}
                    >
                      {st.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* List Rows */}
            <div className="space-y-1.5 max-h-[480px] overflow-y-auto pr-1">
              {/* Render Master Administrators */}
              {(isMaster ? [
                { name: 'Daniel Luciano', email: 'dani.nanda.lucas@gmail.com' }
              ] : [])
                .filter(m => {
                  if (accessStatusFilter === 'Inativo') return false; // Masters are always Ativo
                  return m.name.toLowerCase().includes(accessSearchQuery.toLowerCase()) || 
                    m.email.toLowerCase().includes(accessSearchQuery.toLowerCase());
                })
                .map((m, idx) => {
                  const masterAvatarUrl = (currentUser?.email.toLowerCase() === m.email.toLowerCase() ? currentUser?.avatarUrl : null) || 
                    accessUsers.find(u => u.email.toLowerCase() === m.email.toLowerCase())?.avatarUrl;
                  return (
                    <div
                      key={`static-m-${idx}`}
                      className="p-3 rounded-lg border text-left text-xs bg-[#0c151e]/40 border-[#D4AF37]/30 border-l-4 border-l-[#D4AF37] flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3 pr-2 min-w-0">
                        {masterAvatarUrl ? (
                          <img 
                            src={masterAvatarUrl} 
                            alt={m.name}
                            referrerPolicy="no-referrer"
                            className="w-9 h-9 rounded-full object-cover border border-[#D4AF37]/40 bg-[#0c1d27] shrink-0"
                            onError={(e) => {
                              (e.target as HTMLImageElement).onerror = null;
                              (e.target as HTMLImageElement).src = ''; 
                            }}
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#E9C349] text-[#04141D] flex items-center justify-center text-[10px] font-mono font-bold border border-[#1c2c36] shrink-0">
                            {getInitials(m.name) || 'DL'}
                          </div>
                        )}
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-[9px] text-[#E9C349] bg-[#1a2d39] px-1 py-0.5 rounded border border-[#1c2c36] font-bold">
                              MESTRE
                            </span>
                            <span className="text-[9px] font-mono text-[#98907b]">
                              DIRETORIA RM (ADMIN)
                            </span>
                          </div>
                          <h4 className="font-sans font-bold text-[#d4e5f2] text-[11px] truncate">
                            {m.name}
                          </h4>
                          <p className="text-[10px] font-mono text-[#99907c] truncate">{m.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-[9px] font-mono bg-[#E9C349]/10 text-[#E9C349] px-1.5 py-0.5 rounded border border-[#E9C349]/30">
                          Ativo (Master)
                        </span>
                      </div>
                    </div>
                  );
                })}

              {visibleAccessUsers
                .filter(u => {
                  const matchesSearch = u.name.toLowerCase().includes(accessSearchQuery.toLowerCase()) || 
                    u.email.toLowerCase().includes(accessSearchQuery.toLowerCase()) ||
                    (u.userAcesso && u.userAcesso.toLowerCase().includes(accessSearchQuery.toLowerCase()));
                  
                  if (!matchesSearch) return false;
                  if (accessStatusFilter === 'todos') return true;
                  return u.status === accessStatusFilter;
                })
                .map((user) => {
                  const isActive = showUserForm && editUserId === user.id;
                  const isDeleting = deletingUserId === user.id;
                  
                  return (
                    <div
                      key={user.id}
                      onClick={() => handleSelectUserToEdit(user)}
                      className={`p-3 rounded-lg border text-left text-xs transition-all cursor-pointer flex items-center justify-between ${
                        isActive 
                          ? 'bg-[#06273a] border-[#E9C349]/50 border-l-4 border-l-[#E9C349]' 
                          : 'bg-[#11212b]/60 border-[#1c2c36] hover:bg-[#06273a]/30 border-l-4 border-l-[#99907c]'
                      }`}
                    >
                      <div className="flex items-center gap-3 pr-2 min-w-0">
                        {user.avatarUrl ? (
                          <img 
                            src={user.avatarUrl} 
                            alt={user.name}
                            referrerPolicy="no-referrer"
                            className="w-9 h-9 rounded-full object-cover border border-[#66d9cc]/40 bg-[#0c1d27] shrink-0"
                            onError={(e) => {
                              (e.target as HTMLImageElement).onerror = null;
                              (e.target as HTMLImageElement).src = ''; 
                            }}
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#E9C349]/40 to-[#66D9CC]/40 text-[#d4e5f2] flex items-center justify-center text-[10px] font-mono font-bold border border-[#1c2c36] shrink-0">
                            {getInitials(user.name) || 'IR'}
                          </div>
                        )}
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-[9px] text-cyan-400 bg-[#1a2d39] px-1 py-0.5 rounded border border-[#1c2c36] font-bold">
                              {user.id}
                            </span>
                            {user.tipoUsuario === 'admin' ? (
                              <span className="font-mono text-[9px] text-[#E9C349] bg-[#241a00] px-1 py-0.5 rounded border border-[#E9C349]/20 font-bold uppercase">
                                Admin
                              </span>
                            ) : (
                              <span className="font-mono text-[9px] text-teal-400 bg-[#091a1e] px-1 py-0.5 rounded border border-[#1c2c36] uppercase">
                                Padrão
                              </span>
                            )}
                            <span className="text-[9px] font-mono text-[#99907c] truncate">
                              {user.allowedReportIds ? `${user.allowedReportIds.split(',').length} Curso(s)` : 'Sem acesso'}
                            </span>
                          </div>
                          <h4 className="font-sans font-bold text-[#d4e5f2] truncate text-[11px]">
                            {user.name}
                          </h4>
                          <p className="text-[10px] font-mono text-[#99907c] truncate">
                            {user.email} {user.userAcesso && <span className="text-[#E9C349] font-bold">(@{user.userAcesso})</span>}
                          </p>
                          <p className="text-[9px] font-mono text-[#E9C349] truncate mt-0.5" title={user.nivelAcesso || "1"}>
                            Nível: {getGlobalDegreeLabel(Number(user.nivelAcesso || "1"))}{' '}
                            {user.password ? (
                              <span className="text-[#66d9cc] ml-2 font-sans font-bold">🔑 {user.password}</span>
                            ) : (
                              <span className="text-[#99907c] ml-2">🔑 Sem Senha</span>
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {isDeleting ? (
                          <div className="flex items-center gap-1 bg-red-950/80 p-0.5 rounded border border-red-800">
                            <button
                              onClick={(e) => handleConfirmDeleteUser(user.id, e)}
                              className="text-red-300 font-mono text-[9px] font-bold px-1.5 py-0.5 bg-red-900 rounded hover:bg-red-800"
                            >
                              Sim
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeletingUserId(null);
                              }}
                              className="text-gray-300 font-mono text-[9px] px-1.5 py-0.5 hover:bg-[#0c1d27]"
                            >
                              Não
                            </button>
                          </div>
                        ) : (
                          <>
                            <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${
                              user.status === 'Ativo' 
                                ? 'bg-emerald-950/50 text-[#66d9cc] border-emerald-800' 
                                : 'bg-rose-950/50 text-rose-400 border-rose-900'
                            }`}>
                              {user.status}
                            </span>
                            <button
                              onClick={(e) => handleDeleteUserTrigger(user.id, e)}
                              className="p-1 rounded text-[#99907c] hover:text-red-400 hover:bg-[#1a2d39]/40 transition-colors"
                              title="Remover credencial de acesso"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                            <ChevronRight className="w-3.5 h-3.5 text-[#99907c] opacity-60" />
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}

              {visibleAccessUsers.filter(u => 
                u.name.toLowerCase().includes(accessSearchQuery.toLowerCase()) || 
                u.email.toLowerCase().includes(accessSearchQuery.toLowerCase())
              ).length === 0 && (
                <div className="text-center py-10 bg-[#0c1d27]/40 rounded-lg border border-dashed border-[#1c2c36]/60 text-[#99907c] space-y-2">
                  <Layers className="w-8 h-8 mx-auto opacity-30" />
                  <p className="text-[11px] font-mono">Nenhum usuário localizado</p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT PANEL: User Form */}
          <div className="lg:col-span-7 space-y-4">
            {!showUserForm ? (
              <div className="bg-[#0c1d27]/20 border border-dashed border-[#1c2c36]/40 rounded-xl p-12 text-center text-[#99907c] font-mono text-xs">
                Selecione uma credencial ao lado para visualizar ou configurar permissões de acesso.
              </div>
            ) : (
              <div id="user-form-window" className="bg-[#0c1d27] rounded-xl border border-[#1c2c36] overflow-hidden shadow-xl animate-fade-in">
                
                <div id="user-form-header" className="bg-[#08151e] p-4 border-b border-[#1c2c36] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded bg-[#11212b] border border-[#1c2c36]">
                      <Shield className="w-4 h-4 text-orange-400" />
                    </div>
                    <div>
                      <h3 className="font-sans font-bold text-sm text-[#d4e5f2]">
                        {isCreatingNewUser ? 'Cadastrar Credencial de Acesso' : `Editar Credencial: ${userFormName}`}
                      </h3>
                      <p className="text-[10px] font-mono text-[#E9C349]">
                        {isCreatingNewUser ? 'NOVO ACESSO CORPORATIVO' : `ID INTERNO DE CONTROLE: ${editUserId}`}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowUserForm(false)}
                    className="p-1 rounded-full text-[#99907c] hover:text-white cursor-pointer select-none"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleSaveAccessUser} className="p-5 space-y-4">
                  {userCrudError && (
                    <div className="bg-rose-950/50 border border-rose-500/40 p-3 rounded text-xs font-mono text-rose-300 leading-normal flex items-start gap-2">
                      <HelpCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                      <div>{userCrudError}</div>
                    </div>
                  )}

                  {userCrudSuccess && (
                    <div className="bg-emerald-950/40 border border-emerald-500/30 p-3 rounded text-xs font-mono text-[#66d9cc] text-center flex items-center justify-center gap-2">
                      <Check className="w-4 h-4 text-[#66d9cc]" />
                      {userCrudSuccess}
                    </div>
                  )}

                  <div className="space-y-4 text-left">
                    <div>
                      <label className="block text-[10px] font-mono text-[#9cbfd5] mb-1 uppercase tracking-wider">Nome Completo</label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Gisela S. (CEO)"
                        value={userFormName}
                        onChange={(e) => setUserFormName(e.target.value)}
                        className="w-full bg-[#04141d] border border-[#1c2c36] text-xs px-3 py-2.5 rounded text-[#d4e5f2] focus:outline-none focus:border-[#E8C349]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-[#9cbfd5] mb-1 uppercase tracking-wider">Foto de Perfil</label>
                      <div className="flex items-center gap-3 bg-[#04141d] border border-[#1c2c36] p-3 rounded-lg">
                        {userFormAvatarUrl ? (
                          <div className="relative group shrink-0">
                            <img 
                              src={userFormAvatarUrl} 
                              alt="Foto de Perfil"
                              className="w-12 h-12 rounded-full object-cover border border-[#E9C349]"
                              referrerPolicy="no-referrer"
                            />
                            <button
                              type="button"
                              onClick={() => setUserFormAvatarUrl('')}
                              className="absolute -top-1 -right-1 bg-red-600 hover:bg-red-700 text-white rounded-full p-0.5 transition-colors cursor-pointer flex items-center justify-center shadow-lg"
                              title="Remover Foto"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-[#11212b] border border-[#1c2c36] flex items-center justify-center text-[#99907c] shrink-0">
                            <ImageIcon className="w-5 h-5" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <label className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded bg-[#11212b] hover:bg-[#1a303d] border border-[#1c2c36] text-[10px] font-mono font-bold text-[#E9C349] cursor-pointer transition-colors">
                            <Upload className="w-3.5 h-3.5" />
                            Carregar Foto
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                const reader = new FileReader();
                                reader.onload = async (event) => {
                                  if (event.target?.result) {
                                    try {
                                      const base64Str = event.target.result as string;
                                      const compressed = await compressImage(base64Str, 400, 400, 0.75);
                                      setUserFormAvatarUrl(compressed);
                                    } catch (err) {
                                      console.error("Erro ao comprimir imagem:", err);
                                      setUserFormAvatarUrl(event.target.result as string);
                                    }
                                  }
                                };
                                reader.readAsDataURL(file);
                              }}
                            />
                          </label>
                          <span className="block text-[8px] text-[#99907c] font-mono mt-1">PNG, JPG ou GIF (comprimida automaticamente)</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-[#9cbfd5] mb-1 uppercase tracking-wider">E-mail de Acesso</label>
                      <input
                        type="email"
                        required
                        placeholder="Ex: usuario@masonicacademy.com.br"
                        value={userFormEmail}
                        onChange={(e) => setUserFormEmail(e.target.value)}
                        className="w-full bg-[#04141d] border border-[#1c2c36] text-xs px-3 py-2.5 rounded text-[#d4e5f2] focus:outline-none focus:border-[#E8C349]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-[#9cbfd5] mb-1 uppercase tracking-wider">User de Acesso</label>
                      <input
                        type="text"
                        placeholder="Ex: joaosilva (Opcional - para logar alternativamente)"
                        value={userFormUserAcesso}
                        onChange={(e) => setUserFormUserAcesso(e.target.value)}
                        className="w-full bg-[#04141d] border border-[#1c2c36] text-xs px-3 py-2.5 rounded text-[#d4e5f2] focus:outline-none focus:border-[#E8C349]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-[#9cbfd5] mb-1 uppercase tracking-wider">Senha de Acesso</label>
                      <input
                        type="text"
                        placeholder="Digite a senha para esta credencial (Ex: masonic123)"
                        value={userFormPassword}
                        onChange={(e) => setUserFormPassword(e.target.value)}
                        className="w-full bg-[#04141d] border border-[#1c2c36] text-xs px-3 py-2.5 rounded text-[#d4e5f2] focus:outline-none focus:border-[#E8C349]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-[#9cbfd5] mb-1 uppercase tracking-wider">Telefone com Prefixo</label>
                      <input
                        type="text"
                        placeholder="Ex: (11) 99999-9999"
                        value={userFormTelefone}
                        onChange={(e) => setUserFormTelefone(e.target.value)}
                        className="w-full bg-[#04141d] border border-[#1c2c36] text-xs px-3 py-2.5 rounded text-[#d4e5f2] focus:outline-none focus:border-[#E8C349]"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-mono text-[#E9C349] mb-1 uppercase tracking-wider font-bold">Loja Cadastrada</label>
                      <select
                        value={userFormLodgeId}
                        disabled={!isMaster}
                        onChange={(e) => {
                          const val = e.target.value;
                          setUserFormLodgeId(val);
                          const matched = (lodges || []).find(l => l.id === val);
                          if (matched) {
                            setUserFormLoja(matched.nome);
                            setUserFormPotencia(matched.potencia);
                            setUserFormCidadeLoja(matched.cidade);
                          } else {
                            setUserFormLoja('');
                            setUserFormPotencia('');
                            setUserFormCidadeLoja('');
                          }
                        }}
                        className="w-full bg-[#04141d] border border-[#E9C349]/40 text-xs px-2.5 py-2.5 rounded text-[#d4e5f2] focus:outline-none focus:border-[#E8C349] font-mono disabled:opacity-50"
                      >
                        <option value="">-- Selecione uma Loja (ou preencha manualmente abaixo) --</option>
                        {(lodges || []).map(l => (
                          <option key={l.id} value={l.id}>
                            {l.nome} {l.numero ? `Nº ${l.numero}` : ''} ({l.potencia} - {l.cidade}{l.estado ? `/${l.estado}` : ''}) - Tema: {l.tema.toUpperCase()}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-[#9cbfd5] mb-1 uppercase tracking-wider">Loja</label>
                      <input
                        type="text"
                        disabled={!isMaster}
                        placeholder="Ex: Loja Fraternidade nº 42"
                        value={userFormLoja}
                        onChange={(e) => setUserFormLoja(e.target.value)}
                        className="w-full bg-[#04141d] border border-[#1c2c36] text-xs px-3 py-2.5 rounded text-[#d4e5f2] focus:outline-none focus:border-[#E8C349] disabled:opacity-50"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-[#9cbfd5] mb-1 uppercase tracking-wider">Potência</label>
                      <input
                        type="text"
                        disabled={!isMaster}
                        placeholder="Ex: GOB / Glesp / GOP"
                        value={userFormPotencia}
                        onChange={(e) => setUserFormPotencia(e.target.value)}
                        className="w-full bg-[#04141d] border border-[#1c2c36] text-xs px-3 py-2.5 rounded text-[#d4e5f2] focus:outline-none focus:border-[#E8C349] disabled:opacity-50"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-[#9cbfd5] mb-1 uppercase tracking-wider">Cidade da Loja</label>
                      <input
                        type="text"
                        disabled={!isMaster}
                        placeholder="Ex: São Paulo"
                        value={userFormCidadeLoja}
                        onChange={(e) => setUserFormCidadeLoja(e.target.value)}
                        className="w-full bg-[#04141d] border border-[#1c2c36] text-xs px-3 py-2.5 rounded text-[#d4e5f2] focus:outline-none focus:border-[#E8C349] disabled:opacity-50"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-[#9cbfd5] mb-1 uppercase tracking-wider">Status da Credencial</label>
                      <select
                        value={userFormStatus}
                        onChange={(e) => setUserFormStatus(e.target.value as 'Ativo' | 'Inativo')}
                        className="w-full bg-[#04141d] border border-[#1c2c36] text-xs px-2.5 py-2.5 rounded text-[#d4e5f2] focus:outline-none focus:border-[#E8C349] font-mono"
                      >
                        <option value="Ativo">Ativo (Permissão concedida sob demanda)</option>
                        <option value="Inativo">Inativo (Bloquear visualizações de painel)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-[#9cbfd5] mb-1 uppercase tracking-wider">Tipo Usuário</label>
                      <select
                        value={userFormTipoUsuario}
                        onChange={(e) => setUserFormTipoUsuario(e.target.value as 'admin' | 'padrao')}
                        className="w-full bg-[#04141d] border border-[#1c2c36] text-xs px-2.5 py-2.5 rounded text-[#d4e5f2] focus:outline-none focus:border-[#E8C349] font-mono"
                      >
                        <option value="padrao">Padrão</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-[#9cbfd5] mb-1 uppercase tracking-wider">Nível de Acesso (Grau do Membro)</label>
                      <select
                        value={userFormNivelAcesso || '1'}
                        onChange={(e) => setUserFormNivelAcesso(e.target.value)}
                        className="w-full bg-[#04141d] border border-[#1c2c36] text-xs px-2.5 py-2.5 rounded text-[#d4e5f2] focus:outline-none focus:border-[#E8C349] font-sans"
                      >
                        {Array.from({ length: 33 }, (_, i) => i + 1).map((g) => (
                          <option key={g} value={String(g)}>
                            {getGlobalDegreeLabel(g)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-[#9cbfd5] mb-1 uppercase tracking-wider">IDs de Títulos Permitidos (Separados por Vírgula)</label>
                      <input
                        type="text"
                        placeholder="Ex: rep-estrategia-segmentos, rep-visao-uso-rm"
                        value={userFormAllowedReports}
                        onChange={(e) => setUserFormAllowedReports(e.target.value)}
                        className="w-full bg-[#04141d] border border-[#1c2c36] text-xs px-3 py-2.5 rounded text-[#d4e5f2] focus:outline-none focus:border-[#E8C349] font-mono placeholder:text-gray-600"
                      />
                      <p className="text-[9px] font-mono text-[#98907b] mt-1.5 leading-relaxed italic">
                        Insira os códigos ID exatos que este usuário está autorizado a consultar de forma independente. Ex: <code>rep-estrategia-segmentos, rep-visao-uso-rm</code>.
                      </p>
                    </div>

                    {/* Auto Injection Quick Picker helper inside UI! */}
                    <div className="bg-[#04141d]/55 p-3 rounded-lg border border-[#1c2c36] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="block text-[9px] font-mono text-[#99907c] uppercase">Seletor Rápido de IDs de Títulos Ativos:</span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              const allIds = reports.map(r => r.id).join(', ');
                              setUserFormAllowedReports(allIds);
                            }}
                            className="text-[9px] font-mono text-[#E9C349] hover:underline cursor-pointer bg-transparent border-none p-0 focus:outline-none"
                          >
                            Selecionar todos
                          </button>
                          <span className="text-[9px] text-[#1c2c36] font-mono">|</span>
                          <button
                            type="button"
                            onClick={() => {
                              setUserFormAllowedReports('');
                            }}
                            className="text-[9px] font-mono text-rose-400 hover:underline cursor-pointer bg-transparent border-none p-0 focus:outline-none"
                          >
                            Limpar
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                        {reports.map((r) => {
                          const currentList = userFormAllowedReports.split(',').map(s => s.trim().toLowerCase());
                          const isSelected = currentList.includes(r.id.toLowerCase());
                          return (
                            <button
                              type="button"
                              key={r.id}
                              onClick={() => {
                                const list = userFormAllowedReports
                                  .split(',')
                                  .map(s => s.trim())
                                  .filter(Boolean);
                                const index = list.findIndex(s => s.toLowerCase() === r.id.toLowerCase());
                                if (index > -1) {
                                  list.splice(index, 1);
                                } else {
                                  list.push(r.id);
                                }
                                setUserFormAllowedReports(list.join(', '));
                              }}
                              className={`text-[9px] font-mono px-2 py-1 rounded border transition-colors flex items-center gap-1 cursor-pointer ${
                                isSelected 
                                  ? 'bg-[#E9C349]/20 border-[#E9C349] text-[#E9C349] font-bold'
                                  : 'bg-[#11212b] border-[#1c2c36] text-[#99907c] hover:text-[#d4e5f2]'
                              }`}
                            >
                              <span>{r.id}</span>
                              {isSelected ? '✓' : '+'}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#1c2c36] flex flex-col sm:flex-row justify-between items-center gap-3">
                    <span className="text-[10px] font-mono text-[#99907c] text-center sm:text-left">
                      Masonic Academy Auth Provider
                    </span>

                    <div className="flex gap-2.5 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={() => setShowUserForm(false)}
                        className="flex-1 sm:flex-none text-xs font-mono font-bold text-[#99907c] hover:text-[#d4e5f2] px-4 py-2.5 rounded bg-[#11212b] border border-[#1c2c36] text-center transition-colors cursor-pointer"
                      >
                        Cancelar
                      </button>
                      
                      <button
                        type="submit"
                        disabled={!!userCrudSuccess}
                        className="flex-1 sm:flex-none bg-[#E9C349] text-[#241a00] text-xs font-mono font-bold px-6 py-2.5 rounded hover:bg-[#ffe088] transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 disabled:opacity-50"
                      >
                        <Check className="w-4 h-4" />
                        {isCreatingNewUser ? 'Criar Usuário' : 'Salvar Usuário'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}
          </div>

        </div>
      )}

      {activeSubTab === 'database' && (
        <div className="space-y-6 animate-fade-in text-left">
          
          {/* Status Bar */}
          <div className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs ${
            initialFb 
              ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300' 
              : 'bg-amber-950/30 border-amber-500/30 text-amber-300'
          }`}>
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${initialFb ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400 animate-pulse'}`} />
              <div>
                <span className="font-bold uppercase">Status de Conectividade:</span>{' '}
                {initialFb ? (
                  <span>ATIVO • Conectado à nuvem Firebase Firestore ({initialFb.projectId})</span>
                ) : (
                  <span>LOCAL-ONLY • Salvando temporariamente no LocalStorage do navegador</span>
                )}
              </div>
            </div>
            {initialFb && (
              <button
                onClick={handleClearFirebaseSettings}
                className="text-xs bg-red-950 hover:bg-red-900 text-red-300 px-3 py-1.5 rounded border border-red-800 transition-colors cursor-pointer text-center"
              >
                Desconectar Banco Nuvem
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Guide Panel */}
            <div className="lg:col-span-4 bg-[#0c1d27] rounded-xl p-5 border border-[#1c2c36] space-y-4">
              <div className="border-b border-[#1c2c36] pb-3">
                <h3 className="font-sans font-bold text-sm text-[#d4e5f2]">O Firebase é gratuito?</h3>
                <p className="text-[11px] font-mono text-emerald-400 mt-1">Sim! Plano Spark totalmente grátis</p>
              </div>

              <div className="font-sans text-xs text-[#99907c] space-y-3 leading-relaxed">
                <p>
                  O Firebase oferece uma das opções gratuitas mais generosas do mercado (o chamado <strong className="text-[#d4e5f2]">Spark Plan</strong>), perfeito para nossa escala de operação:
                </p>
                <ul className="list-disc pl-4 space-y-1.5 font-mono text-[10px] text-[#a5b8c7]">
                  <li><strong className="text-emerald-400">50.000</strong> leituras de dados gratuitas por dia</li>
                  <li><strong className="text-emerald-400">20.000</strong> gravações gratuitas por dia</li>
                  <li><strong className="text-emerald-400">20.000</strong> deleções gratuitas por dia</li>
                  <li><strong className="text-emerald-400">1 GB</strong> de armazenamento na nuvem</li>
                </ul>
                <p>
                  Isso é muito mais do que o necessário para registrar centenas de cursos, usuários e alertas com uso contínuo!
                </p>
              </div>

              <div className="border-b border-[#1c2c36] pt-2 pb-2">
                <h3 className="font-sans font-bold text-xs text-[#d4e5f2]">Passo a Passo de Criação</h3>
              </div>

              <div className="font-sans text-xs text-[#99907c] space-y-2.5 leading-relaxed">
                <p> Siga estas instruções simples para registrar seu banco na nuvem:</p>
                <ol className="list-decimal pl-4 space-y-2 font-mono text-[10px] text-[#a5b8c7]">
                  <li>
                    Acesse o console do Firebase:{' '}
                    <a href="https://firebase.google.com" target="_blank" rel="noreferrer" className="text-[#E9C349] hover:underline inline-flex items-center gap-0.5">
                      firebase.google.com <ExternalLink className="w-3 h-3" />
                    </a>
                  </li>
                  <li>Crie ou selecione um projeto na sua conta Google.</li>
                  <li>No menu esquerdo, vá em <strong className="text-white">Firestore Database</strong> e clique em <strong className="text-[#E9C349]">Criar banco de dados</strong>.</li>
                  <li>Escolha o <strong className="text-white">Modo de Teste</strong> para uso inicial. Suas regras já estão liberadas de acordo com as especificações testadas por você!</li>
                  <li>No menu lateral, vá na engrenagem de configurações <strong className="text-white">Configurações do Projeto</strong>.</li>
                  <li>No rodapé, adicione um <strong className="text-white">Web App</strong>, copie o objeto JavaScript gerado 'const firebaseConfig = &#123; ... &#125;' e cole no campo ao lado!</li>
                </ol>
              </div>
            </div>

            {/* Inputs Form */}
            <div className="lg:col-span-8 bg-[#0c1d27] rounded-xl p-5 border border-[#1c2c36] space-y-4">
              <div className="border-b border-[#1c2c36] pb-3 flex justify-between items-center">
                <div>
                  <h3 className="font-sans font-bold text-sm text-[#d4e5f2]">Inserir Parâmetros de Conexão</h3>
                  <p className="text-[11px] font-mono text-[#99907c] mt-0.5">Vincule o banco externo de forma automática ou campo a campo</p>
                </div>
              </div>

              {fbStatusMessage && (
                <div className={`p-3 rounded text-xs font-mono border text-center ${
                  fbStatusMessage.type === 'success' 
                    ? 'bg-emerald-950/40 border-emerald-500/30 text-[#66d9cc]' 
                    : 'bg-rose-950/40 border-rose-500/30 text-rose-300'
                }`}>
                  {fbStatusMessage.text}
                </div>
              )}

              {/* Paste helper input */}
              <div className="bg-[#04141d] p-4 rounded-lg border border-[#1c2c36]/60 space-y-2">
                <label className="block text-[10px] font-mono text-[#E9C349] uppercase tracking-wider font-bold">Colar código de configuração (Rápido)</label>
                <p className="text-[10px] text-[#99907c] font-sans">Cole diretamente o objeto copiado das configurações do Firebase. Nós detectamos e preenchemos tudo para você!</p>
                <textarea
                  rows={3}
                  value={fbJsonPaste}
                  onChange={(e) => handleJsonPasteChange(e.target.value)}
                  placeholder={`apiKey: "AIzaSy...",\nauthDomain: "projeto.firebaseapp.com",\nprojectId: "projeto"`}
                  className="w-full bg-[#06273a]/40 border border-[#1c2c36] text-[11px] px-3 py-2 rounded text-[#d4e5f2] placeholder-[#536573] focus:outline-none focus:border-[#E9C349] font-mono"
                />
              </div>

              <form onSubmit={handleSaveFirebaseSettings} className="space-y-4 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono text-[#9cbfd5] mb-1 uppercase tracking-wider">Chave de API (apiKey)</label>
                    <input
                      type="text"
                      required
                      placeholder="AIzaSyB..."
                      value={fbApiKey}
                      onChange={(e) => setFbApiKey(e.target.value)}
                      className="w-full bg-[#04141d] border border-[#1c2c36] text-xs px-3 py-2 rounded text-[#d4e5f2] focus:outline-none focus:border-[#E9C349] font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-[#9cbfd5] mb-1 uppercase tracking-wider">ID do Projeto (projectId)</label>
                    <input
                      type="text"
                      required
                      placeholder="meu-projeto-exemplo"
                      value={fbProjectId}
                      onChange={(e) => setFbProjectId(e.target.value)}
                      className="w-full bg-[#04141d] border border-[#1c2c36] text-xs px-3 py-2 rounded text-[#d4e5f2] focus:outline-none focus:border-[#E9C349] font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-[#9cbfd5] mb-1 uppercase tracking-wider">ID do Aplicativo (appId)</label>
                    <input
                      type="text"
                      required
                      placeholder="1:12345678:web:abcdef..."
                      value={fbAppId}
                      onChange={(e) => setFbAppId(e.target.value)}
                      className="w-full bg-[#04141d] border border-[#1c2c36] text-xs px-3 py-2 rounded text-[#d4e5f2] focus:outline-none focus:border-[#E9C349] font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-[#9cbfd5] mb-1 uppercase tracking-wider">Domínio de Autenticação (authDomain)</label>
                    <input
                      type="text"
                      placeholder="meu-projeto-exemplo.firebaseapp.com"
                      value={fbAuthDomain}
                      onChange={(e) => setFbAuthDomain(e.target.value)}
                      className="w-full bg-[#04141d] border border-[#1c2c36] text-xs px-3 py-2 rounded text-[#d4e5f2] focus:outline-none focus:border-[#E9C349] font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-[#9cbfd5] mb-1 uppercase tracking-wider">Bucket de Storage (storageBucket)</label>
                    <input
                      type="text"
                      placeholder="meu-projeto-exemplo.appspot.com"
                      value={fbStorageBucket}
                      onChange={(e) => setFbStorageBucket(e.target.value)}
                      className="w-full bg-[#04141d] border border-[#1c2c36] text-xs px-3 py-2 rounded text-[#d4e5f2] focus:outline-none focus:border-[#E9C349] font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-[#9cbfd5] mb-1 uppercase tracking-wider">ID do Sender de Sinais (messagingSenderId)</label>
                    <input
                      type="text"
                      placeholder="1234567890"
                      value={fbMessagingSenderId}
                      onChange={(e) => setFbMessagingSenderId(e.target.value)}
                      className="w-full bg-[#04141d] border border-[#1c2c36] text-xs px-3 py-2 rounded text-[#d4e5f2] focus:outline-none focus:border-[#E9C349] font-mono"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-[#1c2c36] flex justify-end">
                  <button
                    type="submit"
                    className="bg-[#E9C349] text-[#241a00] font-mono text-xs font-bold px-6 py-3 rounded-lg hover:bg-[#ffe088] transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <Check className="w-4 h-4 text-[#241a00]" /> Conectar Banco de Dados
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'books' && (
        // Books CRUD Management Sub-tab
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT PANEL: Books List */}
          <div className="lg:col-span-4 bg-[#0c1d27] rounded-xl p-4 border border-[#1c2c36] space-y-4">
            <div className="flex items-center justify-between border-b border-[#1c2c36] pb-3 flex-wrap gap-2">
              <div>
                <h3 className="font-sans font-bold text-sm text-[#d4e5f2]">Catálogo de Materiais</h3>
                <p className="text-[10px] font-mono text-[#99907c] mt-0.5">Selecione para editar dados</p>
              </div>
              <button
                onClick={handleStartCreateNewBook}
                className="bg-[#66D9CC] text-[#02332e] text-[10px] font-mono font-bold px-3 py-1.5 rounded hover:bg-[#83f7eb] transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" /> Incluir
              </button>
            </div>

            {/* Admin Import & Export Tools */}
            <div className="bg-[#05151e] border border-[#1c2c36] rounded-lg p-2.5 flex flex-col sm:flex-row gap-2 justify-between items-center">
              <span className="text-[10px] font-mono text-[#99907c] uppercase tracking-wider">Planilha Excel</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleDownloadExcelTemplate}
                  className="bg-transparent hover:bg-[#11212b] border border-[#1c2c36] text-[#E9C349] hover:text-[#f3d368] text-[9px] font-mono font-bold px-2.5 py-1 rounded transition-colors flex items-center gap-1 cursor-pointer"
                  title="Baixar planilha de exemplo para cadastro de materiais"
                >
                  <Download className="w-3 h-3" /> Modelo
                </button>
                <label className="bg-[#1ea296]/20 hover:bg-[#1ea296]/30 border border-[#1ea296]/40 text-[#66d9cc] text-[9px] font-mono font-bold px-2.5 py-1 rounded transition-all flex items-center gap-1 cursor-pointer">
                  <Upload className="w-3 h-3" /> Importar
                  <input
                    type="file"
                    accept=".xlsx, .xls"
                    className="hidden"
                    onChange={handleImportExcelFile}
                  />
                </label>
              </div>
            </div>

            {/* Quick search input and Degree Filter */}
            <div className="space-y-2.5">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Pesquisar materiais..."
                  value={bookSearchQuery}
                  onChange={(e) => setBookSearchQuery(e.target.value)}
                  className="w-full bg-[#05151e] border border-[#1c2c36] rounded px-2.5 py-1.5 text-xs text-[#d4e5f2] placeholder-[#536573] focus:outline-none focus:border-[#E9C349] font-sans"
                />
                <Search className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#99907c]" />
              </div>
              
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-mono text-[#99907c] uppercase tracking-wider">Filtrar por Grau</span>
                <select
                  value={bookDegreeFilter}
                  onChange={(e) => setBookDegreeFilter(e.target.value)}
                  className="w-full min-w-0 max-w-full bg-[#05151e] border border-[#1c2c36] rounded px-2.5 py-1.5 text-xs text-[#d4e5f2] focus:outline-none focus:border-[#E9C349] font-sans cursor-pointer truncate"
                >
                  <option value="all">Todos os Graus</option>
                  {Array.from({ length: 33 }, (_, i) => i + 1).map((degree) => (
                    <option key={degree} value={String(degree)}>
                      {getGlobalDegreeLabel(degree)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-mono text-[#99907c] uppercase tracking-wider">Filtrar por Categoria</span>
                <select
                  value={bookCategoryFilter}
                  onChange={(e) => setBookCategoryFilter(e.target.value)}
                  className="w-full min-w-0 max-w-full bg-[#05151e] border border-[#1c2c36] rounded px-2.5 py-1.5 text-xs text-[#d4e5f2] focus:outline-none focus:border-[#E9C349] font-sans cursor-pointer truncate"
                >
                  <option value="all">Todas as Categorias</option>
                  {allBookCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-mono text-[#99907c] uppercase tracking-wider">Filtrar por Status</span>
                <select
                  value={bookStatusFilter}
                  onChange={(e) => setBookStatusFilter(e.target.value)}
                  className="w-full min-w-0 max-w-full bg-[#05151e] border border-[#1c2c36] rounded px-2.5 py-1.5 text-xs text-[#d4e5f2] focus:outline-none focus:border-[#E9C349] font-sans cursor-pointer truncate"
                >
                  <option value="all">Todos os Status</option>
                  <option value="Ativo">Ativo</option>
                  <option value="Inativo">Inativo</option>
                </select>
              </div>
            </div>

            {/* Batch Actions Toolbar */}
            {selectedBookIds.length > 0 && (
              <div className="bg-[#11212b] border border-[#E9C349]/40 rounded-lg p-2.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#E9C349] font-bold uppercase tracking-wider">
                    {selectedBookIds.length} selecionados em lote
                  </span>
                  <button
                    onClick={() => setSelectedBookIds([])}
                    className="text-[10px] font-mono text-[#99907c] hover:text-[#d4e5f2] hover:underline"
                  >
                    Desmarcar
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    onClick={() => handleBatchStatusAction('Ativo')}
                    className="bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 text-[9px] font-mono font-bold py-1 px-1.5 rounded transition-all cursor-pointer text-center"
                  >
                    Ativar
                  </button>
                  <button
                    onClick={() => handleBatchStatusAction('Inativo')}
                    className="bg-yellow-950/60 hover:bg-yellow-900 border border-yellow-800 text-yellow-300 text-[9px] font-mono font-bold py-1 px-1.5 rounded transition-all cursor-pointer text-center"
                  >
                    Inativar
                  </button>
                  <button
                    onClick={handleBatchDeleteAction}
                    className="bg-red-950/60 hover:bg-red-900 border border-red-800 text-rose-300 text-[9px] font-mono font-bold py-1 px-1.5 rounded transition-all cursor-pointer text-center"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            )}

            {/* Header and Select All Toggle */}
            <div className="flex items-center justify-between text-[10px] font-mono text-[#99907c] border-b border-[#1c2c36]/40 pb-1.5 pt-1">
              <label className="flex items-center gap-1.5 cursor-pointer hover:text-[#d4e5f2] select-none">
                <input
                  type="checkbox"
                  checked={allFilteredChecked}
                  onChange={handleToggleSelectAll}
                  className="w-3.5 h-3.5 rounded bg-[#04141d] border-[#1c2c36] text-[#E9C349] focus:ring-0 focus:ring-offset-0 cursor-pointer accent-[#E9C349]"
                />
                <span>Selecionar Todos ({filteredBooks.length})</span>
              </label>
              <span>{selectedBookIds.length} de {books.length}</span>
            </div>

            {/* Books List Grid/Scroll */}
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {filteredBooks.map(book => {
                const isSelectedForEdit = editBookId === book.id;
                const isChecked = selectedBookIds.includes(book.id);
                const bookCats = book.categories && book.categories.length > 0 ? book.categories : [book.category];
                return (
                  <div
                    key={book.id}
                    onClick={() => handleSelectBookToEdit(book)}
                    className={`p-3 rounded-lg border transition-all duration-150 cursor-pointer text-left flex items-start gap-2.5 ${
                      isSelectedForEdit 
                        ? 'bg-[#E9C349]/10 border-[#E9C349] shadow-md' 
                        : 'bg-[#05151e]/60 border-[#1c2c36] hover:bg-[#11212b]/40 hover:border-[#1ea296]/30'
                    }`}
                  >
                    {/* Card Checkbox */}
                    <div 
                      className="self-center pr-1 shrink-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {
                          setSelectedBookIds(prev => 
                            prev.includes(book.id) 
                              ? prev.filter(id => id !== book.id) 
                              : [...prev, book.id]
                          );
                        }}
                        className="w-3.5 h-3.5 rounded bg-[#04141d] border-[#1c2c36] text-[#E9C349] focus:ring-0 focus:ring-offset-0 cursor-pointer accent-[#E9C349]"
                      />
                    </div>

                    {/* Mini thumbnail */}
                    {book.thumbnailUrl ? (
                      <img
                        src={book.thumbnailUrl}
                        alt=""
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 object-cover rounded border border-[#1c2c36] shrink-0"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=100&q=80';
                        }}
                      />
                    ) : (
                      <div className="w-10 h-10 bg-[#0c1d27] rounded border border-[#1c2c36] flex items-center justify-center shrink-0">
                        <BookOpen className="w-4 h-4 text-[#99907c]" />
                      </div>
                    )}

                    <div className="min-w-0 flex-1 space-y-0.5">
                      <div className="flex items-center justify-between gap-1.5">
                        <span className="font-mono text-[8px] text-[#E9C349] uppercase tracking-wider truncate shrink-0 max-w-[120px]">
                          {bookCats.join(', ')}
                        </span>
                        <span className="font-mono text-[8px] bg-[#E9C349]/10 text-[#E9C349] border border-[#E9C349]/20 px-1 rounded-sm shrink-0 uppercase font-bold">
                          Grau {book.nivelAcesso}
                        </span>
                      </div>
                      <h4 className="font-sans font-bold text-xs text-[#d4e5f2] leading-tight truncate">
                        {book.title}
                      </h4>
                      <div className="flex items-center justify-between text-[10px] font-mono text-[#99907c] pt-0.5">
                        <span className="truncate">Por: {book.author}</span>
                        <span className={`text-[9px] font-bold ${book.status === 'Ativo' ? 'text-emerald-400' : 'text-red-400'}`}>
                          {book.status}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
              {filteredBooks.length === 0 && (
                <div className="p-8 text-center text-xs font-mono text-[#99907c]">
                  Nenhum material encontrado com as configurações de filtro ativas.
                </div>
              )}
            </div>
          </div>

          {/* RIGHT PANEL: Edit / Create Form */}
          <div className="lg:col-span-8 bg-[#0c1d27] rounded-xl p-5 border border-[#1c2c36] space-y-4">
            <div className="border-b border-[#1c2c36] pb-3 flex justify-between items-center flex-wrap gap-2">
              <div>
                <h3 className="font-sans font-bold text-sm text-[#d4e5f2]">
                  {isCreatingNewBook ? 'Cadastrar Novo Material' : `Editando Material: ${bookFormTitle || bookFormId}`}
                </h3>
                <p className="text-[10px] font-mono text-[#99907c] mt-0.5">
                  {isCreatingNewBook ? 'Adicione um novo título à biblioteca' : 'Modifique os metadados do título selecionado'}
                </p>
              </div>
              {!isCreatingNewBook && (
                <button
                  type="button"
                  onClick={() => handleDeleteBookAction(bookFormId)}
                  className="bg-red-950/40 hover:bg-red-950 hover:text-red-300 text-rose-400 text-[10px] font-mono font-bold px-3 py-1.5 rounded border border-red-900/30 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Excluir Material
                </button>
              )}
            </div>

            {/* Error & Success indicators */}
            {bookFormError && (
              <div className="bg-rose-950/30 border border-rose-500/30 text-rose-300 p-3 rounded text-xs font-mono">
                ⚠️ {bookFormError}
              </div>
            )}
            {bookFormSuccess && (
              <div className="bg-emerald-950/30 border border-[#1ea296]/30 text-[#66d9cc] p-3 rounded text-xs font-mono">
                ✓ {bookFormSuccess}
              </div>
            )}

            <form onSubmit={handleSaveBook} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* ID Field */}
                <div>
                  <label className="block text-[10px] font-mono text-[#9cbfd5] mb-1 uppercase tracking-wider">Identificador Único (ID)</label>
                  <input
                    type="text"
                    required
                    disabled={!isCreatingNewBook}
                    placeholder="ex: material-manual-aprendiz"
                    value={bookFormId}
                    onChange={(e) => setBookFormId(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                    className="w-full bg-[#04141d] disabled:bg-[#081721] disabled:text-[#99907c]/60 disabled:cursor-not-allowed border border-[#1c2c36] text-xs px-3 py-2 rounded text-[#d4e5f2] focus:outline-none focus:border-[#E9C349] font-mono"
                  />
                </div>

                {/* Status Field */}
                <div>
                  <label className="block text-[10px] font-mono text-[#9cbfd5] mb-1 uppercase tracking-wider">Status do Título</label>
                  <select
                    value={bookFormStatus}
                    onChange={(e) => setBookFormStatus(e.target.value as any)}
                    className="w-full bg-[#04141d] border border-[#1c2c36] text-xs px-3 py-2 rounded text-[#d4e5f2] focus:outline-none focus:border-[#E9C349] font-sans"
                  >
                    <option value="Ativo">Ativo (Visível na Biblioteca)</option>
                    <option value="Inativo">Inativo (Oculto)</option>
                  </select>
                </div>

                {/* Title Field */}
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-mono text-[#9cbfd5] mb-1 uppercase tracking-wider">Título do Material</label>
                  <input
                    type="text"
                    required
                    placeholder="ex: A ADMINISTRAÇÃO DA LOJA NO RITO ADONHIRAMITA"
                    value={bookFormTitle}
                    onChange={(e) => setBookFormTitle(e.target.value)}
                    className="w-full bg-[#04141d] border border-[#1c2c36] text-xs px-3 py-2 rounded text-[#d4e5f2] focus:outline-none focus:border-[#E9C349] font-sans"
                  />
                </div>

                {/* Author Field */}
                <div>
                  <label className="block text-[10px] font-mono text-[#9cbfd5] mb-1 uppercase tracking-wider">Autor / Responsável</label>
                  <input
                    type="text"
                    required
                    placeholder="ex: José Castellani"
                    value={bookFormAuthor}
                    onChange={(e) => setBookFormAuthor(e.target.value)}
                    className="w-full bg-[#04141d] border border-[#1c2c36] text-xs px-3 py-2 rounded text-[#d4e5f2] focus:outline-none focus:border-[#E9C349] font-sans"
                  />
                </div>

                {/* Category Field */}
                <div className="md:col-span-2 space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="block text-[10px] font-mono text-[#9cbfd5] uppercase tracking-wider">
                      Categorias / Rito (Selecione uma ou mais)
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowCategoriesManager(!showCategoriesManager)}
                      className="text-[9px] font-mono text-[#E9C349] hover:underline flex items-center gap-1 uppercase tracking-wider bg-[#1c2c36]/40 hover:bg-[#1c2c36]/80 px-2 py-1 rounded border border-[#1c2c36] transition-all cursor-pointer"
                    >
                      {showCategoriesManager ? 'Fechar Gerenciador ✕' : '⚙️ Gerenciar Categorias'}
                    </button>
                  </div>

                  {showCategoriesManager && (
                    <div className="bg-[#05151e] border border-[#1c2c36] rounded-lg p-3 space-y-3">
                      <div className="text-[10px] font-mono font-bold text-[#E9C349] uppercase tracking-wider border-b border-[#1c2c36] pb-1.5 flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-[#26a69a]" />
                        Criar, Editar ou Excluir Categorias
                      </div>

                      {/* Create New Category Form */}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Nome da nova categoria"
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddCategory(newCategoryName);
                            }
                          }}
                          className="flex-1 bg-[#04141d] border border-[#1c2c36] text-xs px-2.5 py-1.5 rounded text-[#d4e5f2] focus:outline-none focus:border-[#E9C349]"
                        />
                        <button
                          type="button"
                          onClick={() => handleAddCategory(newCategoryName)}
                          className="bg-[#26a69a] hover:bg-[#26a69a]/80 text-white font-mono font-bold text-[10px] uppercase px-3 py-1.5 rounded transition-colors"
                        >
                          Adicionar
                        </button>
                      </div>

                      {/* List and Actions */}
                      <div className="space-y-1.5 max-h-[180px] overflow-y-auto pr-1">
                        {categoriesList.map((cat) => {
                          const isEditingThis = editingCategoryOldName === cat;
                          return (
                            <div key={cat} className="flex items-center justify-between bg-[#04141d]/50 border border-[#1c2c36]/60 rounded px-2.5 py-1.5">
                              {isEditingThis ? (
                                <div className="flex items-center gap-2 flex-1 mr-2">
                                  <input
                                    type="text"
                                    value={editingCategoryNewName}
                                    onChange={(e) => setEditingCategoryNewName(e.target.value)}
                                    className="flex-1 bg-[#04141d] border border-[#E9C349] text-xs px-2 py-1 rounded text-[#d4e5f2] focus:outline-none font-sans"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleRenameCategory(cat, editingCategoryNewName)}
                                    className="bg-emerald-600 hover:bg-emerald-500 text-white p-1 rounded transition-colors cursor-pointer"
                                    title="Salvar alteração"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setEditingCategoryOldName(null)}
                                    className="bg-rose-950/60 hover:bg-rose-900 text-rose-300 p-1 rounded transition-colors cursor-pointer"
                                    title="Cancelar"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ) : (
                                <>
                                  <span className="text-xs text-[#d4e5f2] font-medium">{cat}</span>
                                  <div className="flex items-center gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setEditingCategoryOldName(cat);
                                        setEditingCategoryNewName(cat);
                                      }}
                                      className="text-gray-400 hover:text-[#E9C349] p-1 transition-colors cursor-pointer"
                                      title="Editar nome"
                                    >
                                      <Edit className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteCategory(cat)}
                                      className="text-gray-400 hover:text-red-400 p-1 transition-colors cursor-pointer"
                                      title="Excluir categoria"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[#04141d] border border-[#1c2c36] rounded p-3">
                    {categoriesList.map((cat) => {
                      const isChecked = bookFormCategories.includes(cat);
                      return (
                        <label
                          key={cat}
                          className={`flex items-center gap-2 p-2 rounded border transition-all cursor-pointer select-none text-xs ${
                            isChecked
                              ? 'bg-[#E9C349]/10 border-[#E9C349] text-[#f2ca50]'
                              : 'bg-[#05151e]/40 border-[#1c2c36]/60 text-[#99907c] hover:text-[#d4e5f2] hover:border-[#1c2c36]'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                              if (isChecked) {
                                setBookFormCategories(prev => prev.filter(c => c !== cat));
                              } else {
                                setBookFormCategories(prev => [...prev, cat]);
                              }
                            }}
                            className="rounded bg-[#05151e] border-[#1c2c36] text-[#E9C349] focus:ring-0 w-3.5 h-3.5 accent-[#E9C349] cursor-pointer"
                          />
                          <span className="truncate">{cat}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Level of access required (Grau) */}
                <div>
                  <label className="block text-[10px] font-mono text-[#9cbfd5] mb-1 uppercase tracking-wider">Grau de Acesso Requerido (Nível de Acesso)</label>
                  <select
                    value={bookFormNivelAcesso}
                    onChange={(e) => setBookFormNivelAcesso(Number(e.target.value))}
                    className="w-full bg-[#04141d] border border-[#1c2c36] text-xs px-3 py-2 rounded text-[#d4e5f2] focus:outline-none focus:border-[#E9C349] font-sans"
                  >
                    {Array.from({ length: 33 }, (_, i) => i + 1).map((g) => (
                      <option key={g} value={g}>
                        {getGlobalDegreeLabel(g)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tags Field */}
                <div>
                  <label className="block text-[10px] font-mono text-[#9cbfd5] mb-1 uppercase tracking-wider">Tags do Título (Separadas por vírgulas)</label>
                  <input
                    type="text"
                    placeholder="ex: Adonhiramita, Administração, Manual, Simbolismo"
                    value={bookFormTags}
                    onChange={(e) => setBookFormTags(e.target.value)}
                    className="w-full bg-[#04141d] border border-[#1c2c36] text-xs px-3 py-2 rounded text-[#d4e5f2] focus:outline-none focus:border-[#E9C349] font-mono"
                  />
                </div>

                {/* Document / Book Link */}
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-mono text-[#9cbfd5] mb-1 uppercase tracking-wider">Link Completo do Documento / PDF</label>
                  <div className="relative">
                    <input
                      type="url"
                      required
                      placeholder="https://exemplo.com/documento.pdf"
                      value={bookFormLink}
                      onChange={(e) => setBookFormLink(e.target.value)}
                      className="w-full bg-[#04141d] border border-[#1c2c36] text-xs px-3 py-2 pl-9 rounded text-[#d4e5f2] focus:outline-none focus:border-[#E9C349] font-mono"
                    />
                    <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#99907c]" />
                  </div>
                </div>

                {/* Cover Image URL / File Upload */}
                <div className="md:col-span-2 space-y-3">
                  <div>
                    <label className="block text-[10px] font-mono text-[#9cbfd5] mb-1 uppercase tracking-wider">Link da Capa do Material (Miniatura)</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="https://images.unsplash.com/photo-..."
                        value={bookFormThumbnailUrl}
                        onChange={(e) => setBookFormThumbnailUrl(e.target.value)}
                        className="w-full bg-[#04141d] border border-[#1c2c36] text-xs px-3 py-2 pl-9 rounded text-[#d4e5f2] focus:outline-none focus:border-[#E9C349] font-mono"
                      />
                      <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#99907c]" />
                    </div>
                  </div>

                  {/* Thumbnail dropzone file selector with base64 compression */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center bg-[#05151e]/60 p-4 rounded-lg border border-[#1c2c36]/60">
                    <div className="space-y-1.5 text-left">
                      <span className="block text-[10px] font-mono text-[#E9C349] uppercase tracking-wider font-bold">Upload Local da Capa</span>
                      <p className="text-[10px] text-[#99907c] leading-relaxed">
                        Selecione uma imagem local para comprimir e embutir de forma otimizada para o banco Firestore.
                      </p>
                      
                      <label className="inline-flex items-center gap-1.5 bg-[#11212b] border border-[#1c2c36] hover:border-[#E9C349]/40 hover:bg-[#1c2c36]/80 text-[#d4e5f2] px-3 py-1.5 rounded text-xs font-mono font-bold cursor-pointer transition-colors">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Carregar Capa</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;

                            if (file.size > 10 * 1024 * 1024) {
                              setBookThumbnailUploadError("Imagem muito grande (máx 10MB).");
                              return;
                            }

                            const reader = new FileReader();
                            reader.onload = async (event) => {
                              if (event.target?.result) {
                                try {
                                  const base64Str = event.target.result as string;
                                  const compressed = await compressImage(base64Str, 600, 800, 0.75); // 3:4 ratio target
                                  setBookFormThumbnailUrl(compressed);
                                  setBookThumbnailUploadError(null);
                                } catch (err) {
                                  console.error("Error compressing image:", err);
                                  setBookFormThumbnailUrl(event.target.result as string);
                                  setBookThumbnailUploadError(null);
                                }
                              }
                            };
                            reader.readAsDataURL(file);
                          }}
                        />
                      </label>
                      
                      {bookThumbnailUploadError && (
                        <p className="text-[9px] font-mono text-red-400 bg-red-950/20 px-2 py-1 rounded border border-red-900/45 leading-tight">
                          ⚠️ {bookThumbnailUploadError}
                        </p>
                      )}
                    </div>

                    <div className="flex justify-center">
                      {bookFormThumbnailUrl ? (
                        <div className="relative group">
                          <img
                            src={bookFormThumbnailUrl}
                            alt="Visualização da Capa"
                            referrerPolicy="no-referrer"
                            className="w-24 h-32 object-cover rounded border border-[#1c2c36] shadow-md bg-[#04141d]"
                          />
                          <button
                            type="button"
                            onClick={() => setBookFormThumbnailUrl('')}
                            className="absolute -top-1.5 -right-1.5 bg-red-950 border border-red-500 text-red-400 hover:text-white p-1 rounded-full shadow hover:bg-red-900 cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <div className="w-24 h-32 border border-dashed border-[#1c2c36] rounded flex flex-col items-center justify-center text-[#99907c] p-2 text-center bg-[#04141d]/40">
                          <BookOpen className="w-6 h-6 opacity-40 mb-1" />
                          <span className="text-[9px] font-mono">Sem Visualização</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Form buttons */}
              <div className="pt-4 border-t border-[#1c2c36] flex justify-between items-center">
                <button
                  type="button"
                  onClick={handleStartCreateNewBook}
                  className="bg-[#11212b] border border-[#1c2c36] hover:bg-[#1c2c36] text-[#d4e5f2] text-xs font-mono font-bold px-4 py-2.5 rounded transition-all cursor-pointer"
                >
                  Cancelar / Novo
                </button>
                <button
                  type="submit"
                  className="bg-[#E9C349] hover:bg-[#ffe088] text-[#241a00] text-xs font-mono font-bold px-6 py-2.5 rounded shadow transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <Check className="w-4 h-4 text-[#241a00]" />
                  <span>{isCreatingNewBook ? 'Cadastrar Material' : 'Salvar Alterações'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeSubTab === 'accessStats' && (
        <div className="space-y-6 animate-fade-in text-left">
          
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#0c1d27] p-5 rounded-xl border border-[#1c2c36]">
            <div>
              <h3 className="font-sans font-bold text-lg text-[#d4e5f2] flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#66d9cc]" /> Relatórios de Acessos & Atividades
              </h3>
              <p className="text-xs font-mono text-[#99907c] mt-1">
                Análise em tempo real de logins de usuários, visualizações de cursos e acessos a materiais.
              </p>
            </div>
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                <input
                  type="text"
                  placeholder="Filtrar por Usuário..."
                  value={searchLogUser}
                  onChange={(e) => setSearchLogUser(e.target.value)}
                  className="w-full sm:w-64 bg-[#04141d] border border-[#1c2c36] text-xs px-3 py-2 pl-9 rounded-lg text-[#d4e5f2] focus:outline-none focus:border-[#E9C349] font-mono"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#99907c]" />
                {searchLogUser && (
                  <button
                    onClick={() => setSearchLogUser('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#99907c] hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* KPI Dashboard Grid */}
          {(() => {
            const allLogs = getLogsToRender().filter(log => {
              if (!searchLogUser) return true;
              return (log.userName || '').toLowerCase().includes(searchLogUser.toLowerCase()) || 
                     (log.userEmail || '').toLowerCase().includes(searchLogUser.toLowerCase());
            });

            const totalLogins = allLogs.filter(l => l.type === 'login').length;
            const totalCourseAccess = allLogs.filter(l => l.type === 'course').length;
            const totalBookAccess = allLogs.filter(l => l.type === 'book').length;
            
            // Count unique users who either have logs or have active status (active sessions)
            const loggedEmails = allLogs.map(l => (l.userEmail || '').toLowerCase().trim());
            const activeUserEmails = accessUsers
              .filter(u => u.status === 'Ativo')
              .map(u => (u.email || '').toLowerCase().trim())
              .filter(email => {
                if (!searchLogUser) return true;
                const query = searchLogUser.toLowerCase();
                const u = accessUsers.find(user => (user.email || '').toLowerCase().trim() === email);
                return u && ((u.name || '').toLowerCase().includes(query) || (u.email || '').toLowerCase().includes(query));
              });
            const allActiveEmails = new Set([...loggedEmails, ...activeUserEmails]);
            const uniqueUsers = allActiveEmails.size;

            return (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#0c1d27] border border-[#1c2c36] rounded-xl p-4 flex flex-col justify-between">
                  <span className="text-[10px] font-mono text-[#99907c] uppercase font-bold tracking-wider">Total de Logins</span>
                  <div className="flex items-baseline gap-1.5 mt-2">
                    <span className="text-2xl font-bold font-sans text-[#E9C349]">{totalLogins}</span>
                    <span className="text-[10px] font-mono text-[#99907c]">sessões</span>
                  </div>
                </div>
                <div className="bg-[#0c1d27] border border-[#1c2c36] rounded-xl p-4 flex flex-col justify-between">
                  <span className="text-[10px] font-mono text-[#99907c] uppercase font-bold tracking-wider">Cliques em Cursos</span>
                  <div className="flex items-baseline gap-1.5 mt-2">
                    <span className="text-2xl font-bold font-sans text-[#66d9cc]">{totalCourseAccess}</span>
                    <span className="text-[10px] font-mono text-[#99907c]">leituras</span>
                  </div>
                </div>
                <div className="bg-[#0c1d27] border border-[#1c2c36] rounded-xl p-4 flex flex-col justify-between">
                  <span className="text-[10px] font-mono text-[#99907c] uppercase font-bold tracking-wider">Cliques em Materiais</span>
                  <div className="flex items-baseline gap-1.5 mt-2">
                    <span className="text-2xl font-bold font-sans text-orange-400">{totalBookAccess}</span>
                    <span className="text-[10px] font-mono text-[#99907c]">consultas</span>
                  </div>
                </div>
                <div className="bg-[#0c1d27] border border-[#1c2c36] rounded-xl p-4 flex flex-col justify-between">
                  <span className="text-[10px] font-mono text-[#99907c] uppercase font-bold tracking-wider">Usuários Ativos</span>
                  <div className="flex items-baseline gap-1.5 mt-2">
                    <span className="text-2xl font-bold font-sans text-[#d4e5f2]">{uniqueUsers}</span>
                    <span className="text-[10px] font-mono text-[#99907c]">membros</span>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Report Tab Navigation */}
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#1c2c36] gap-2 select-none">
            <div className="flex flex-wrap gap-1">
              <button
                onClick={() => {
                  setReportsTab('logins');
                  setReportsGrouping('by-item');
                }}
                className={`py-2 px-4 text-xs font-mono font-bold tracking-wide transition-all border-b-2 cursor-pointer ${
                  reportsTab === 'logins'
                    ? 'border-[#E9C349] text-[#E9C349] bg-[#0c1d27]/40'
                    : 'border-transparent text-[#99907c] hover:text-[#d4e5f2]'
                }`}
              >
                🔑 QUANTIDADE DE ACESSOS (SESSÕES)
              </button>
              <button
                onClick={() => {
                  setReportsTab('courses');
                  setReportsGrouping('by-item');
                }}
                className={`py-2 px-4 text-xs font-mono font-bold tracking-wide transition-all border-b-2 cursor-pointer ${
                  reportsTab === 'courses'
                    ? 'border-[#66d9cc] text-[#66d9cc] bg-[#0c1d27]/40'
                    : 'border-transparent text-[#99907c] hover:text-[#d4e5f2]'
                }`}
              >
                🎓 ACESSOS POR USUÁRIO E CURSO
              </button>
              <button
                onClick={() => {
                  setReportsTab('books');
                  setReportsGrouping('by-item');
                }}
                className={`py-2 px-4 text-xs font-mono font-bold tracking-wide transition-all border-b-2 cursor-pointer ${
                  reportsTab === 'books'
                    ? 'border-orange-400 text-orange-400 bg-[#0c1d27]/40'
                    : 'border-transparent text-[#99907c] hover:text-[#d4e5f2]'
                }`}
              >
                📚 ACESSOS POR USUÁRIOS X MATERIAIS
              </button>
            </div>

            {/* Active Sessions List/Dropdown positioned next to the menu tabs */}
            <div className="relative group select-none py-1 px-2.5 self-end md:self-center">
              <span className="text-[11px] font-mono text-[#99907c] cursor-pointer flex items-center gap-1.5 hover:text-[#66d9cc] transition-colors py-1">
                <span className="w-2 h-2 rounded-full bg-[#66d9cc] animate-pulse"></span>
                Sessões Ativas: <strong className="text-[#66d9cc] font-sans">{onlineUsers.length}</strong>
              </span>
              
              {/* Hover dropdown list of active users */}
              <div className="absolute right-0 top-full mt-1.5 hidden group-hover:block w-64 bg-[#0c1d27] border border-[#1c2c36] rounded-lg p-3 shadow-2xl z-50 animate-fadeIn">
                <div className="text-[9px] font-mono text-[#94a9b8] uppercase tracking-wider mb-2 pb-1.5 border-b border-[#1c2c36] flex items-center justify-between">
                  <span>Usuários Online</span>
                  <span className="text-[#66d9cc] font-bold">{onlineUsers.length}</span>
                </div>
                <div className="max-h-48 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-[#1c2c36] pr-1">
                  {onlineUsers.length === 0 ? (
                    <div className="text-[10px] font-mono text-gray-500 italic p-1">
                      Nenhum usuário ativo
                    </div>
                  ) : (
                    onlineUsers.map((u) => (
                      <div key={u.id} className="flex items-center gap-2 p-1.5 rounded hover:bg-[#11212b] transition-colors text-left">
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
          </div>

          {/* Detail Panel */}
          <div className="bg-[#0c1d27] border border-[#1c2c36] rounded-xl p-6 space-y-6">
            
            {reportsTab === 'logins' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <h4 className="font-sans font-bold text-sm text-[#d4e5f2]">Logins Realizados por Usuário</h4>
                    <p className="text-[10px] font-mono text-[#99907c]">Quantidade acumulada de autenticações de cada irmão</p>
                  </div>
                </div>

                {(() => {
                  const filtered = getLogsToRender().filter(log => {
                    if (log.type !== 'login') return false;
                    if (!searchLogUser) return true;
                    return (log.userName || '').toLowerCase().includes(searchLogUser.toLowerCase()) || 
                           (log.userEmail || '').toLowerCase().includes(searchLogUser.toLowerCase());
                  });

                  // Group by email
                  const groupedMap: Record<string, { name: string; email: string; count: number; lastAccess: string }> = {};
                  
                  // Pre-populate with all active users (users with active sessions) so they are tracked
                  accessUsers.forEach(u => {
                    if (u.status === 'Ativo') {
                      const key = (u.email || '').toLowerCase().trim();
                      if (!key) return;
                      if (searchLogUser) {
                        const query = searchLogUser.toLowerCase();
                        if (!(u.name || '').toLowerCase().includes(query) && !(u.email || '').toLowerCase().includes(query)) {
                          return;
                        }
                      }
                      groupedMap[key] = {
                        name: u.name || 'Sem Nome',
                        email: u.email || '',
                        count: 0,
                        lastAccess: ''
                      };
                    }
                  });

                  filtered.forEach(log => {
                    const key = (log.userEmail || '').toLowerCase().trim();
                    if (!key) return;
                    if (!groupedMap[key]) {
                      groupedMap[key] = {
                        name: log.userName || 'Sem Nome',
                        email: log.userEmail || '',
                        count: 0,
                        lastAccess: log.timestamp || ''
                      };
                    }
                    groupedMap[key].count++;
                    if (log.timestamp && (!groupedMap[key].lastAccess || new Date(log.timestamp) > new Date(groupedMap[key].lastAccess))) {
                      groupedMap[key].lastAccess = log.timestamp;
                    }
                  });

                  const groupedList = Object.values(groupedMap).sort((a, b) => b.count - a.count);
                  const maxCount = groupedList.length > 0 ? Math.max(...groupedList.map(g => g.count)) : 1;

                  if (groupedList.length === 0) {
                    return (
                      <div className="text-center py-10 bg-[#04141d] rounded-lg border border-[#1c2c36]">
                        <p className="text-xs font-mono text-[#99907c]">Nenhum registro de login encontrado.</p>
                      </div>
                    );
                  }

                  return (
                    <div className="space-y-3">
                      {groupedList.map((userStats, idx) => {
                        const pct = (userStats.count / maxCount) * 100;
                        const avatarUrl = accessUsers.find(u => (u.email || '').toLowerCase() === (userStats.email || '').toLowerCase())?.avatarUrl;
                        return (
                          <div 
                            key={`log-usr-${idx}`}
                            className="p-3.5 bg-[#04141d] rounded-lg border border-[#1c2c36]/60 flex flex-col md:flex-row md:items-center justify-between gap-4"
                          >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              {avatarUrl ? (
                                <img 
                                  src={avatarUrl} 
                                  alt={userStats.name} 
                                  referrerPolicy="no-referrer"
                                  className="w-9 h-9 rounded-full object-cover border border-[#E9C349]/40 bg-[#0c1d27]"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).onerror = null;
                                    (e.target as HTMLImageElement).src = ''; 
                                  }}
                                />
                              ) : (
                                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#E9C349]/20 to-[#66D9CC]/20 text-[#d4e5f2] flex items-center justify-center text-xs font-bold font-mono border border-[#1c2c36] shrink-0">
                                  {getInitials(userStats.name)}
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <h5 className="font-sans font-bold text-[#d4e5f2] text-xs truncate">{userStats.name}</h5>
                                <p className="text-[10px] font-mono text-[#99907c] truncate">{userStats.email}</p>
                                
                                {/* Progress visual meter */}
                                <div className="mt-2 w-full bg-[#11212b] rounded-full h-1.5 overflow-hidden border border-[#1c2c36]">
                                  <div 
                                    className="bg-gradient-to-r from-[#E9C349] to-[#ffd452] h-full rounded-full transition-all"
                                    style={{ width: `${pct}%` }}
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center justify-between md:justify-end gap-6 shrink-0 border-t md:border-t-0 border-[#1c2c36] pt-2 md:pt-0">
                              <div className="text-left md:text-right font-mono">
                                <span className="text-[9px] text-[#99907c] block uppercase">Último Acesso</span>
                                <span className="text-[10px] text-[#a5b8c7]">
                                  {userStats.lastAccess ? (
                                    new Date(userStats.lastAccess).toLocaleDateString('pt-BR', {
                                      day: '2-digit',
                                      month: '2-digit',
                                      year: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })
                                  ) : (
                                    'Sem registro recente'
                                  )}
                                </span>
                              </div>
                              <div className="text-right">
                                <span className="font-mono text-[9px] text-[#E9C349] block uppercase font-bold">Total Logins</span>
                                <span className="text-lg font-bold font-sans text-[#E9C349]">{userStats.count}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
            )}

            {reportsTab === 'courses' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h4 className="font-sans font-bold text-sm text-[#d4e5f2]">Acessos a Cursos & Títulos</h4>
                    <p className="text-[10px] font-mono text-[#99907c]">Cliques e leituras de materiais dos cursos/títulos por usuário</p>
                  </div>

                  {/* Grouping Toggle */}
                  <div className="flex bg-[#04141d] border border-[#1c2c36] p-0.5 rounded-lg select-none">
                    <button
                      onClick={() => setReportsGrouping('by-item')}
                      className={`px-3 py-1 rounded-md text-[9px] font-mono font-bold uppercase transition-all cursor-pointer ${
                        reportsGrouping === 'by-item'
                          ? 'bg-[#66d9cc] text-[#02332e]'
                          : 'text-[#99907c] hover:text-white'
                      }`}
                    >
                      Agrupar por Curso
                    </button>
                    <button
                      onClick={() => setReportsGrouping('by-user')}
                      className={`px-3 py-1 rounded-md text-[9px] font-mono font-bold uppercase transition-all cursor-pointer ${
                        reportsGrouping === 'by-user'
                          ? 'bg-[#66d9cc] text-[#02332e]'
                          : 'text-[#99907c] hover:text-white'
                      }`}
                    >
                      Agrupar por Usuário
                    </button>
                  </div>
                </div>

                {(() => {
                  const filtered = getLogsToRender().filter(log => {
                    if (log.type !== 'course') return false;
                    if (!searchLogUser) return true;
                    return (log.userName || '').toLowerCase().includes(searchLogUser.toLowerCase()) || 
                           (log.userEmail || '').toLowerCase().includes(searchLogUser.toLowerCase());
                  });

                  if (filtered.length === 0) {
                    return (
                      <div className="text-center py-10 bg-[#04141d] rounded-lg border border-[#1c2c36]">
                        <p className="text-xs font-mono text-[#99907c]">Nenhum registro de acesso a curso encontrado.</p>
                      </div>
                    );
                  }

                  if (reportsGrouping === 'by-item') {
                    // Group by course title
                    const groupedMap: Record<string, { title: string; count: number; users: Record<string, { name: string; count: number }> }> = {};
                    filtered.forEach(log => {
                      const key = log.targetTitle || log.targetId || 'Curso Não Identificado';
                      if (!groupedMap[key]) {
                        groupedMap[key] = {
                          title: key,
                          count: 0,
                          users: {}
                        };
                      }
                      groupedMap[key].count++;
                      
                      const userKey = (log.userEmail || '').toLowerCase();
                      if (!groupedMap[key].users[userKey]) {
                        groupedMap[key].users[userKey] = {
                          name: log.userName || 'Sem Nome',
                          count: 0
                        };
                      }
                      groupedMap[key].users[userKey].count++;
                    });

                    const sortedList = Object.values(groupedMap).sort((a, b) => b.count - a.count);
                    const maxCount = sortedList.length > 0 ? Math.max(...sortedList.map(c => c.count)) : 1;

                    return (
                      <div className="space-y-4">
                        {sortedList.map((courseStats, idx) => {
                          const pct = (courseStats.count / maxCount) * 100;
                          return (
                            <div 
                              key={`course-stat-${idx}`}
                              className="p-4 bg-[#04141d] rounded-lg border border-[#1c2c36]/60 space-y-3 text-left"
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1c2c36]/40 pb-2">
                                <div className="flex-1 min-w-0">
                                  <span className="font-mono text-[9px] text-[#66d9cc] font-bold bg-[#66d9cc]/10 px-1.5 py-0.5 rounded border border-[#66d9cc]/30">
                                    CURSO
                                  </span>
                                  <h5 className="font-sans font-bold text-[#d4e5f2] text-xs sm:text-sm mt-1 truncate" title={courseStats.title}>
                                    {courseStats.title}
                                  </h5>
                                </div>
                                <div className="text-left sm:text-right shrink-0">
                                  <span className="text-[9px] font-mono text-[#99907c] uppercase block">Total de Acessos</span>
                                  <span className="text-base font-bold font-sans text-[#66d9cc]">{courseStats.count}</span>
                                </div>
                              </div>

                              {/* Progress visual bar */}
                              <div className="w-full bg-[#11212b] rounded-full h-1 overflow-hidden">
                                <div 
                                  className="bg-[#66d9cc] h-full rounded-full transition-all"
                                  style={{ width: `${pct}%` }}
                                />
                              </div>

                              {/* User breakdowns */}
                              <div className="space-y-1">
                                <span className="block text-[8px] font-mono text-[#99907c] uppercase tracking-wider">Acessos por Membro:</span>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1.5">
                                  {Object.entries(courseStats.users).map(([email, info], uIdx) => (
                                    <div 
                                      key={`course-u-${uIdx}`}
                                      className="flex items-center justify-between p-1.5 px-2 bg-[#11212b]/60 border border-[#1c2c36]/30 rounded text-[10px] font-mono"
                                    >
                                      <span className="text-[#a5b8c7] truncate max-w-[130px]" title={`${info.name} (${email})`}>
                                        {info.name}
                                      </span>
                                      <span className="font-bold text-[#66d9cc] bg-[#66d9cc]/10 px-1 rounded">
                                        {info.count}x
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  } else {
                    // Group by User
                    const groupedMap: Record<string, { name: string; email: string; count: number; items: Record<string, number> }> = {};
                    
                    // Pre-populate with all active users (users with active sessions) so they are tracked
                    accessUsers.forEach(u => {
                      if (u.status === 'Ativo') {
                        const key = (u.email || '').toLowerCase().trim();
                        if (!key) return;
                        if (searchLogUser) {
                          const query = searchLogUser.toLowerCase();
                          if (!(u.name || '').toLowerCase().includes(query) && !(u.email || '').toLowerCase().includes(query)) {
                            return;
                          }
                        }
                        groupedMap[key] = {
                          name: u.name || 'Sem Nome',
                          email: u.email || '',
                          count: 0,
                          items: {}
                        };
                      }
                    });

                    filtered.forEach(log => {
                      const key = (log.userEmail || '').toLowerCase().trim();
                      if (!key) return;
                      const courseTitle = log.targetTitle || 'Curso Sem Título';
                      if (!groupedMap[key]) {
                        groupedMap[key] = {
                          name: log.userName || 'Sem Nome',
                          email: log.userEmail || '',
                          count: 0,
                          items: {}
                        };
                      }
                      groupedMap[key].count++;
                      groupedMap[key].items[courseTitle] = (groupedMap[key].items[courseTitle] || 0) + 1;
                    });

                    const sortedList = Object.values(groupedMap).sort((a, b) => b.count - a.count);

                    return (
                      <div className="space-y-3">
                        {sortedList.map((userStats, idx) => {
                          const avatarUrl = accessUsers.find(u => (u.email || '').toLowerCase() === (userStats.email || '').toLowerCase())?.avatarUrl;
                          return (
                            <div 
                              key={`user-course-stat-${idx}`}
                              className="p-4 bg-[#04141d] rounded-lg border border-[#1c2c36]/60 flex flex-col md:flex-row md:items-start justify-between gap-4 text-left"
                            >
                              <div className="flex items-center gap-3 min-w-0 md:w-1/3">
                                {avatarUrl ? (
                                  <img 
                                    src={avatarUrl} 
                                    alt={userStats.name} 
                                    referrerPolicy="no-referrer"
                                    className="w-9 h-9 rounded-full object-cover border border-[#66d9cc]/40 bg-[#0c1d27]"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).onerror = null;
                                      (e.target as HTMLImageElement).src = ''; 
                                    }}
                                  />
                                ) : (
                                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#66D9CC]/20 to-[#E9C349]/20 text-[#d4e5f2] flex items-center justify-center text-xs font-bold font-mono border border-[#1c2c36] shrink-0">
                                    {getInitials(userStats.name)}
                                  </div>
                                )}
                                <div className="min-w-0">
                                  <h5 className="font-sans font-bold text-[#d4e5f2] text-xs truncate">{userStats.name}</h5>
                                  <p className="text-[10px] font-mono text-[#99907c] truncate">{userStats.email}</p>
                                  <div className="mt-1 flex items-center gap-1.5">
                                    <span className="text-[9px] font-mono text-[#66d9cc] bg-[#66d9cc]/10 px-1.5 rounded uppercase font-bold">
                                      {userStats.count} cliques totais
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex-1 border-t md:border-t-0 border-[#1c2c36] pt-2 md:pt-0 space-y-1">
                                <span className="block text-[8px] font-mono text-[#99907c] uppercase tracking-wider">Títulos Acessados por este Usuário:</span>
                                <div className="space-y-1">
                                  {Object.entries(userStats.items).length === 0 ? (
                                    <p className="text-[10px] font-mono text-[#99907c] italic">Nenhum curso acessado ainda.</p>
                                  ) : (
                                    Object.entries(userStats.items).map(([course, count], cIdx) => (
                                      <div 
                                        key={`uc-detail-${cIdx}`}
                                        className="flex items-center justify-between text-[10px] font-mono p-1 bg-[#11212b]/60 border border-[#1c2c36]/30 rounded px-2"
                                      >
                                        <span className="text-[#a5b8c7] truncate max-w-sm sm:max-w-md">{course}</span>
                                        <span className="text-[#66d9cc] font-bold">{count}x</span>
                                      </div>
                                    ))
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  }
                })()}
              </div>
            )}

            {reportsTab === 'books' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h4 className="font-sans font-bold text-sm text-[#d4e5f2]">Acessos a Materiais & Biblioteca</h4>
                    <p className="text-[10px] font-mono text-[#99907c]">Consultas e cliques para download dos títulos na Biblioteca Virtual</p>
                  </div>

                  {/* Grouping Toggle */}
                  <div className="flex bg-[#04141d] border border-[#1c2c36] p-0.5 rounded-lg select-none">
                    <button
                      onClick={() => setReportsGrouping('by-item')}
                      className={`px-3 py-1 rounded-md text-[9px] font-mono font-bold uppercase transition-all cursor-pointer ${
                        reportsGrouping === 'by-item'
                          ? 'bg-orange-400 text-[#241200]'
                          : 'text-[#99907c] hover:text-white'
                      }`}
                    >
                      Agrupar por Material
                    </button>
                    <button
                      onClick={() => setReportsGrouping('by-user')}
                      className={`px-3 py-1 rounded-md text-[9px] font-mono font-bold uppercase transition-all cursor-pointer ${
                        reportsGrouping === 'by-user'
                          ? 'bg-orange-400 text-[#241200]'
                          : 'text-[#99907c] hover:text-white'
                      }`}
                    >
                      Agrupar por Usuário
                    </button>
                  </div>
                </div>

                {(() => {
                  const filtered = getLogsToRender().filter(log => {
                    if (log.type !== 'book') return false;
                    if (!searchLogUser) return true;
                    return (log.userName || '').toLowerCase().includes(searchLogUser.toLowerCase()) || 
                           (log.userEmail || '').toLowerCase().includes(searchLogUser.toLowerCase());
                  });

                  if (filtered.length === 0) {
                    return (
                      <div className="text-center py-10 bg-[#04141d] rounded-lg border border-[#1c2c36]">
                        <p className="text-xs font-mono text-[#99907c]">Nenhum registro de acesso a material encontrado.</p>
                      </div>
                    );
                  }

                  if (reportsGrouping === 'by-item') {
                    // Group by Book title
                    const groupedMap: Record<string, { title: string; count: number; users: Record<string, { name: string; count: number }> }> = {};
                    filtered.forEach(log => {
                      const key = log.targetTitle || log.targetId || 'Material Não Identificado';
                      if (!groupedMap[key]) {
                        groupedMap[key] = {
                          title: key,
                          count: 0,
                          users: {}
                        };
                      }
                      groupedMap[key].count++;

                      const userKey = (log.userEmail || '').toLowerCase();
                      if (!groupedMap[key].users[userKey]) {
                        groupedMap[key].users[userKey] = {
                          name: log.userName || 'Sem Nome',
                          count: 0
                        };
                      }
                      groupedMap[key].users[userKey].count++;
                    });

                    const sortedList = Object.values(groupedMap).sort((a, b) => b.count - a.count);
                    const maxCount = sortedList.length > 0 ? Math.max(...sortedList.map(c => c.count)) : 1;

                    return (
                      <div className="space-y-4">
                        {sortedList.map((bookStats, idx) => {
                          const pct = (bookStats.count / maxCount) * 100;
                          return (
                            <div 
                              key={`book-stat-${idx}`}
                              className="p-4 bg-[#04141d] rounded-lg border border-[#1c2c36]/60 space-y-3 text-left"
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1c2c36]/40 pb-2">
                                <div className="flex-1 min-w-0">
                                  <span className="font-mono text-[9px] text-orange-400 bg-orange-400/10 px-1.5 py-0.5 rounded border border-orange-400/30">
                                    MATERIAL
                                  </span>
                                  <h5 className="font-sans font-bold text-[#d4e5f2] text-xs sm:text-sm mt-1 truncate" title={bookStats.title}>
                                    {bookStats.title}
                                  </h5>
                                </div>
                                <div className="text-left sm:text-right shrink-0">
                                  <span className="text-[9px] font-mono text-[#99907c] uppercase block">Acessos ao Material</span>
                                  <span className="text-base font-bold font-sans text-orange-400">{bookStats.count}</span>
                                </div>
                              </div>

                              {/* Progress bar */}
                              <div className="w-full bg-[#11212b] rounded-full h-1 overflow-hidden">
                                <div 
                                  className="bg-orange-400 h-full rounded-full transition-all"
                                  style={{ width: `${pct}%` }}
                                />
                              </div>

                              {/* Users breakdowns */}
                              <div className="space-y-1">
                                <span className="block text-[8px] font-mono text-[#99907c] uppercase tracking-wider">Acessado pelos Irmãos:</span>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1.5">
                                  {Object.entries(bookStats.users).map(([email, info], uIdx) => (
                                    <div 
                                      key={`book-u-${uIdx}`}
                                      className="flex items-center justify-between p-1.5 px-2 bg-[#11212b]/60 border border-[#1c2c36]/30 rounded text-[10px] font-mono"
                                    >
                                      <span className="text-[#a5b8c7] truncate max-w-[130px]" title={`${info.name} (${email})`}>
                                        {info.name}
                                      </span>
                                      <span className="font-bold text-orange-400 bg-orange-400/10 px-1 rounded">
                                        {info.count}x
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  } else {
                    // Group by User
                    const groupedMap: Record<string, { name: string; email: string; count: number; items: Record<string, number> }> = {};
                    
                    // Pre-populate with all active users (users with active sessions) so they are tracked
                    accessUsers.forEach(u => {
                      if (u.status === 'Ativo') {
                        const key = (u.email || '').toLowerCase().trim();
                        if (!key) return;
                        if (searchLogUser) {
                          const query = searchLogUser.toLowerCase();
                          if (!(u.name || '').toLowerCase().includes(query) && !(u.email || '').toLowerCase().includes(query)) {
                            return;
                          }
                        }
                        groupedMap[key] = {
                          name: u.name || 'Sem Nome',
                          email: u.email || '',
                          count: 0,
                          items: {}
                        };
                      }
                    });

                    filtered.forEach(log => {
                      const key = (log.userEmail || '').toLowerCase().trim();
                      if (!key) return;
                      const bookTitle = log.targetTitle || 'Obra Virtual';
                      if (!groupedMap[key]) {
                        groupedMap[key] = {
                          name: log.userName || 'Sem Nome',
                          email: log.userEmail || '',
                          count: 0,
                          items: {}
                        };
                      }
                      groupedMap[key].count++;
                      groupedMap[key].items[bookTitle] = (groupedMap[key].items[bookTitle] || 0) + 1;
                    });

                    const sortedList = Object.values(groupedMap).sort((a, b) => b.count - a.count);

                    return (
                      <div className="space-y-3">
                        {sortedList.map((userStats, idx) => {
                          const avatarUrl = accessUsers.find(u => (u.email || '').toLowerCase() === (userStats.email || '').toLowerCase())?.avatarUrl;
                          return (
                            <div 
                              key={`user-book-stat-${idx}`}
                              className="p-4 bg-[#04141d] rounded-lg border border-[#1c2c36]/60 flex flex-col md:flex-row md:items-start justify-between gap-4 text-left"
                            >
                              <div className="flex items-center gap-3 min-w-0 md:w-1/3">
                                {avatarUrl ? (
                                  <img 
                                    src={avatarUrl} 
                                    alt={userStats.name} 
                                    referrerPolicy="no-referrer"
                                    className="w-9 h-9 rounded-full object-cover border border-orange-400/40 bg-[#0c1d27]"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).onerror = null;
                                      (e.target as HTMLImageElement).src = ''; 
                                    }}
                                  />
                                ) : (
                                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#E9C349]/20 to-orange-400/20 text-[#d4e5f2] flex items-center justify-center text-xs font-bold font-mono border border-[#1c2c36] shrink-0">
                                    {getInitials(userStats.name)}
                                  </div>
                                )}
                                <div className="min-w-0">
                                  <h5 className="font-sans font-bold text-[#d4e5f2] text-xs truncate">{userStats.name}</h5>
                                  <p className="text-[10px] font-mono text-[#99907c] truncate">{userStats.email}</p>
                                  <div className="mt-1 flex items-center gap-1.5">
                                    <span className="text-[9px] font-mono text-orange-400 bg-orange-400/10 px-1.5 rounded uppercase font-bold">
                                      {userStats.count} leituras totais
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex-1 border-t md:border-t-0 border-[#1c2c36] pt-2 md:pt-0 space-y-1">
                                <span className="block text-[8px] font-mono text-[#99907c] uppercase tracking-wider">Obras Acessadas por este Usuário:</span>
                                <div className="space-y-1">
                                  {Object.entries(userStats.items).length === 0 ? (
                                    <p className="text-[10px] font-mono text-[#99907c] italic">Nenhum material acessado ainda.</p>
                                  ) : (
                                    Object.entries(userStats.items).map(([book, count], bIdx) => (
                                      <div 
                                        key={`ub-detail-${bIdx}`}
                                        className="flex items-center justify-between text-[10px] font-mono p-1 bg-[#11212b]/60 border border-[#1c2c36]/30 rounded px-2"
                                      >
                                        <span className="text-[#a5b8c7] truncate max-w-sm sm:max-w-md">{book}</span>
                                        <span className="text-orange-400 font-bold">{count}x</span>
                                      </div>
                                    ))
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  }
                })()}
              </div>
            )}

          </div>

          {/* Bottom disclaimer */}
          <div className="text-right">
            <span className="text-[9px] font-mono text-[#99907c] uppercase block">
              Nota: Os acessos são salvos automaticamente em tempo real no Firestore e na cache local.
            </span>
          </div>

        </div>
      )}

      {activeSubTab === 'lodges' && (
        <div className="space-y-6 animate-fade-in text-left">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#0c1d27] p-5 rounded-xl border border-[#1c2c36]">
            <div>
              <h3 className="font-sans font-bold text-lg text-[#d4e5f2] flex items-center gap-2">
                <Home className="w-5 h-5 text-amber-500" /> Cadastro e Gerenciamento da Loja
              </h3>
              <p className="text-xs font-mono text-[#99907c] mt-1">
                Configure múltiplas lojas, cada uma com seu próprio tema visual, cursos isolados e acervo literário.
              </p>
            </div>
            
            {isMaster && (
              <button
                onClick={() => {
                  setIsCreatingNewLodge(true);
                  setEditLodgeId(null);
                  setLodgeFormNome('');
                  setLodgeFormPotencia('');
                  setLodgeFormCidade('');
                  setLodgeFormNumero('');
                  setLodgeFormEstado('');
                  setLodgeFormTema('cavaleiros');
                  setLodgeFormLogoUrl('');
                  setLodgeCrudError(null);
                  setLodgeCrudSuccess(null);
                  setShowLodgeForm(true);
                }}
                className="bg-[#D4AF37] hover:bg-[#ffca28] text-[#04141d] font-sans font-bold text-xs px-4 py-2.5 rounded-lg flex items-center gap-1.5 transition-all shadow-md cursor-pointer uppercase tracking-wider"
              >
                <Plus className="w-4 h-4" /> Cadastrar Nova Loja
              </button>
            )}
          </div>

          {/* Error and Success banners */}
          {lodgeCrudError && (
            <div className="bg-red-900/20 border border-red-500/50 text-red-200 text-xs p-3.5 rounded-lg flex items-center gap-2">
              <span className="font-mono font-bold">❌ ERRO:</span> {lodgeCrudError}
            </div>
          )}
          {lodgeCrudSuccess && (
            <div className="bg-emerald-950/30 border border-emerald-500/50 text-emerald-200 text-xs p-3.5 rounded-lg flex items-center gap-2">
              <span className="font-mono font-bold">✓ SUCESSO:</span> {lodgeCrudSuccess}
            </div>
          )}

          {/* Form to Add / Edit Lodge */}
          {showLodgeForm && (
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                setLodgeCrudError(null);
                setLodgeCrudSuccess(null);

                if (!lodgeFormNome.trim()) {
                  setLodgeCrudError('O nome da loja é obrigatório.');
                  return;
                }
                if (!lodgeFormPotencia.trim()) {
                  setLodgeCrudError('A potência maçônica é obrigatória.');
                  return;
                }
                if (!lodgeFormCidade.trim()) {
                  setLodgeCrudError('A cidade é obrigatória.');
                  return;
                }

                const finalLodgeData: Lodge = {
                  id: isCreatingNewLodge ? `lodge-${Math.floor(100 + Math.random() * 900)}` : (editLodgeId || ''),
                  nome: lodgeFormNome.trim(),
                  potencia: lodgeFormPotencia.trim().toUpperCase(),
                  cidade: lodgeFormCidade.trim(),
                  numero: lodgeFormNumero.trim() || undefined,
                  estado: lodgeFormEstado.trim().toUpperCase() || undefined,
                  tema: lodgeFormTema,
                  logoUrl: lodgeFormLogoUrl.trim() || undefined
                };

                if (isCreatingNewLodge) {
                  if (onAddLodge) onAddLodge(finalLodgeData);
                  setLodgeCrudSuccess(`Loja "${finalLodgeData.nome}" cadastrada com sucesso!`);
                } else {
                  if (onUpdateLodge) onUpdateLodge(finalLodgeData);
                  setLodgeCrudSuccess(`Loja "${finalLodgeData.nome}" atualizada com sucesso!`);
                }

                setTimeout(() => {
                  setLodgeCrudSuccess(null);
                  setShowLodgeForm(false);
                }, 2000);
              }}
              className="bg-[#0c1d27] border border-[#1c2c36] p-5 rounded-xl space-y-4 animate-fade-in"
            >
              <h4 className="font-sans font-bold text-sm text-[#E9C349] uppercase tracking-wider">
                {isCreatingNewLodge ? 'Nova Loja' : 'Editar Loja'}
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono text-[#9cbfd5] mb-1 uppercase tracking-wider">Nome da Loja</label>
                  <input
                    type="text"
                    placeholder="Ex: Loja Cavaleiros da Ordem"
                    value={lodgeFormNome}
                    onChange={(e) => setLodgeFormNome(e.target.value)}
                    className="w-full bg-[#04141d] border border-[#1c2c36] text-xs px-3 py-2.5 rounded text-[#d4e5f2] focus:outline-none focus:border-[#E8C349]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-[#9cbfd5] mb-1 uppercase tracking-wider">Potência Maçônica</label>
                  <input
                    type="text"
                    placeholder="Ex: GOB, GLESP, GOP"
                    value={lodgeFormPotencia}
                    onChange={(e) => setLodgeFormPotencia(e.target.value)}
                    className="w-full bg-[#04141d] border border-[#1c2c36] text-xs px-3 py-2.5 rounded text-[#d4e5f2] focus:outline-none focus:border-[#E8C349]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-[#9cbfd5] mb-1 uppercase tracking-wider">Cidade da Loja</label>
                  <input
                    type="text"
                    placeholder="Ex: São Paulo"
                    value={lodgeFormCidade}
                    onChange={(e) => setLodgeFormCidade(e.target.value)}
                    className="w-full bg-[#04141d] border border-[#1c2c36] text-xs px-3 py-2.5 rounded text-[#d4e5f2] focus:outline-none focus:border-[#E8C349]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-[#9cbfd5] mb-1 uppercase tracking-wider">Nº da Loja</label>
                  <input
                    type="text"
                    placeholder="Ex: 1234"
                    value={lodgeFormNumero}
                    onChange={(e) => setLodgeFormNumero(e.target.value)}
                    className="w-full bg-[#04141d] border border-[#1c2c36] text-xs px-3 py-2.5 rounded text-[#d4e5f2] focus:outline-none focus:border-[#E8C349]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-[#9cbfd5] mb-1 uppercase tracking-wider">Estado (UF)</label>
                  <input
                    type="text"
                    maxLength={2}
                    placeholder="Ex: SP"
                    value={lodgeFormEstado}
                    onChange={(e) => setLodgeFormEstado(e.target.value)}
                    className="w-full bg-[#04141d] border border-[#1c2c36] text-xs px-3 py-2.5 rounded text-[#d4e5f2] focus:outline-none focus:border-[#E8C349] uppercase font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-[#9cbfd5] mb-1 uppercase tracking-wider">Tema do Sistema (Visual)</label>
                  <select
                    value={lodgeFormTema}
                    onChange={(e) => setLodgeFormTema(e.target.value as any)}
                    className="w-full bg-[#04141d] border border-[#1c2c36] text-xs px-2.5 py-2.5 rounded text-[#d4e5f2] focus:outline-none focus:border-[#E8C349] font-mono"
                  >
                    <option value="cavaleiros">Tema Cavaleiros (Teal & Gold Clássico)</option>
                    <option value="templo">Tema Templo (Burgundy & Sand Gold)</option>
                    <option value="ecletico">Tema Eclético (Royal Blue & Silver)</option>
                    <option value="carbono">Tema Carbono (Charcoal & Emerald)</option>
                  </select>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="block text-[10px] font-mono text-[#9cbfd5] uppercase tracking-wider">Logo da Loja</label>
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                    <div className="sm:col-span-8">
                      <input
                        type="text"
                        placeholder="Ex: https://url-da-imagem.com/logo.png ou use o botão ao lado"
                        value={lodgeFormLogoUrl}
                        onChange={(e) => setLodgeFormLogoUrl(e.target.value)}
                        className="w-full bg-[#04141d] border border-[#1c2c36] text-xs px-3 py-2.5 rounded text-[#d4e5f2] focus:outline-none focus:border-[#E8C349]"
                      />
                    </div>
                    <div className="sm:col-span-4 flex items-center gap-2">
                      <label className="bg-[#11212b] border border-[#1c2c36] hover:bg-[#1a2c36] text-white font-sans font-bold text-xs px-3 py-2.5 rounded-lg transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5 w-full">
                        <Upload className="w-3.5 h-3.5 text-[#E9C349]" />
                        <span>Upload</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const reader = new FileReader();
                            reader.onload = async (event) => {
                              if (event.target?.result) {
                                try {
                                  const base64Str = event.target.result as string;
                                  const compressed = await compressImage(base64Str, 300, 300, 0.7);
                                  setLodgeFormLogoUrl(compressed);
                                } catch (err) {
                                  console.error("Erro ao comprimir logo:", err);
                                  setLodgeFormLogoUrl(event.target.result as string);
                                }
                              }
                            };
                            reader.readAsDataURL(file);
                          }}
                        />
                      </label>
                      
                      {lodgeFormLogoUrl && (
                        <div className="w-10 h-10 border border-[#1c2c36] bg-[#04141d] rounded flex items-center justify-center overflow-hidden shrink-0">
                          <img src={lodgeFormLogoUrl} alt="Preview Logo" className="max-w-full max-h-full object-contain" referrerPolicy="no-referrer" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowLodgeForm(false)}
                  className="bg-[#11212b] border border-[#1c2c36] text-[#9cbfd5] font-sans font-bold text-xs px-4 py-2 rounded-lg hover:bg-[#1a2c36] transition-all cursor-pointer uppercase tracking-wider"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-sans font-bold text-xs px-4 py-2 rounded-lg transition-all shadow-md cursor-pointer uppercase tracking-wider"
                >
                  Salvar
                </button>
              </div>
            </form>
          )}

          {/* Lodges List Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(lodges || [])
              .filter((l) => {
                if (isMaster) return true;
                const userLodgeId = currentUser?.lodgeId || 'lodge-cavaleiros';
                return l.id === userLodgeId;
              })
              .map((lodge) => {
                const isDefaultLodge = lodge.id === 'lodge-cavaleiros';
              
              // Get current users count of this lodge
              const memberCount = accessUsers.filter(u => u.lodgeId === lodge.id || (!u.lodgeId && isDefaultLodge)).length;
              
              return (
                <div 
                  key={lodge.id}
                  className="bg-[#0c1d27] border border-[#1c2c36] rounded-xl p-5 space-y-4 hover:border-[#D4AF37]/50 transition-all shadow-lg flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {lodge.logoUrl ? (
                          <img 
                            src={lodge.logoUrl} 
                            alt={lodge.nome} 
                            className="w-9 h-9 object-contain rounded bg-transparent border border-[#1c2c36]/60 p-0.5" 
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded bg-transparent border border-[#1c2c36]/40 flex items-center justify-center text-amber-500/80 font-mono font-bold text-sm uppercase">
                            {lodge.nome.slice(0, 2)}
                          </div>
                        )}
                        <div>
                          <h4 className="font-sans font-bold text-sm text-[#d4e5f2] line-clamp-1">{lodge.nome}</h4>
                          <span className="text-[10px] font-mono text-[#99907c] uppercase tracking-wider block">ID: {lodge.id}</span>
                        </div>
                      </div>

                      <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                        lodge.tema === 'cavaleiros' ? 'bg-teal-500/10 text-teal-400' :
                        lodge.tema === 'templo' ? 'bg-rose-500/10 text-rose-400' :
                        lodge.tema === 'ecletico' ? 'bg-blue-500/10 text-blue-400' :
                        'bg-emerald-500/10 text-emerald-400'
                      }`}>
                        {lodge.tema}
                      </span>
                    </div>

                    <div className="border-t border-[#1c2c36]/60 pt-2 grid grid-cols-2 gap-x-2 gap-y-1.5 text-xs font-mono">
                      <div>
                        <span className="block text-[9px] text-[#99907c] uppercase tracking-wider">Potência</span>
                        <span className="text-[#a5b8c7] font-bold">{lodge.potencia}</span>
                      </div>
                      <div>
                        <span className="block text-[9px] text-[#99907c] uppercase tracking-wider">Nº</span>
                        <span className="text-[#a5b8c7] font-bold">{lodge.numero || '-'}</span>
                      </div>
                      <div>
                        <span className="block text-[9px] text-[#99907c] uppercase tracking-wider">Cidade</span>
                        <span className="text-[#a5b8c7] font-bold truncate block">{lodge.cidade}</span>
                      </div>
                      <div>
                        <span className="block text-[9px] text-[#99907c] uppercase tracking-wider">Estado</span>
                        <span className="text-[#a5b8c7] font-bold">{lodge.estado || '-'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-[#1c2c36]/60 pt-3 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[#9cbfd5] bg-[#04141d] px-2 py-1 rounded border border-[#1c2c36]">
                      👥 {memberCount} administradores/membros
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setIsCreatingNewLodge(false);
                          setEditLodgeId(lodge.id);
                          setLodgeFormNome(lodge.nome);
                          setLodgeFormPotencia(lodge.potencia);
                          setLodgeFormCidade(lodge.cidade);
                          setLodgeFormNumero(lodge.numero || '');
                          setLodgeFormEstado(lodge.estado || '');
                          setLodgeFormTema(lodge.tema);
                          setLodgeFormLogoUrl(lodge.logoUrl || '');
                          setLodgeCrudError(null);
                          setLodgeCrudSuccess(null);
                          setShowLodgeForm(true);
                        }}
                        title="Editar Loja"
                        className="p-1.5 text-[#9cbfd5] hover:text-[#E8C349] hover:bg-[#11212b] rounded transition-all cursor-pointer"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      
                      {isMaster && !isDefaultLodge && (
                        <button
                          onClick={() => {
                            if (window.confirm(`Tem certeza de que deseja excluir a loja "${lodge.nome}"? Esta ação não pode ser desfeita.`)) {
                              if (onDeleteLodge) {
                                onDeleteLodge(lodge.id);
                                setLodgeCrudSuccess(`Loja "${lodge.nome}" excluída.`);
                                setTimeout(() => setLodgeCrudSuccess(null), 2500);
                              }
                            }
                          }}
                          title="Excluir Loja"
                          className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-950/20 rounded transition-all cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Integration Tip Note */}
          {isMaster && (
            <div className="bg-[#11212b]/60 border border-[#1c2c36] p-4.5 rounded-xl space-y-2">
              <span className="text-[10px] font-mono text-[#E9C349] font-black uppercase tracking-wider flex items-center gap-1">
                💡 Guia Rápido de Instalação e Funcionamento Multi-Loja
              </span>
              <ul className="text-xs space-y-1.5 text-[#9cbfd5] list-disc list-inside pl-1">
                <li>Cada loja cadastrada ganha um ambiente 100% isolado de cursos e livros digitais.</li>
                <li>A <strong className="text-white">Loja Cavaleiros</strong> serve como base; registros antigos sem Loja vinculada pertencem a ela por padrão.</li>
                <li>Para adicionar um administrador para a nova loja, vá em <strong className="text-white">Cadastro de Acessos</strong>, clique em <strong className="text-white">Cadastrar Credencial</strong>, selecione a nova loja no seletor correspondente, e defina a permissão como <strong className="text-white">admin</strong>.</li>
                <li>Assim que este novo administrador fizer login, o sistema aplicará o tema customizado escolhido por ele e começará vazio, pronto para ser alimentado com seus próprios cursos e livros.</li>
              </ul>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
