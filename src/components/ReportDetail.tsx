import React, { useState, useEffect } from 'react';
import { ExecutiveReport, AccessUser, Questionnaire } from '../types';
import { getDegreeLabel } from '../utils/degrees';
import { 
  X, Calendar, Shield, User, FileText, Download, Share2, 
  Plus, CheckCircle2, Link as LinkIcon, Image as ImageIcon, Sparkles,
  Lock, Upload, HelpCircle, Award
} from 'lucide-react';
import InlineEditable from './InlineEditable';
import { initializeFirebase, cleanObjectForFirestore } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { compressImage } from '../utils';

interface ReportDetailProps {
  report: ExecutiveReport;
  onClose: () => void;
  onUpdateImage: (reportId: string, imageUrl: string) => void;
  isAdmin: boolean;
  onUpdateReportField: (reportId: string, field: keyof ExecutiveReport, newValue: any) => void;
  currentUser?: AccessUser | null;
  onToggleCompletion?: () => void;
  onGoToQuestionnaire?: (quizId: string) => void;
  onOpenSecureViewer?: (url: string, title: string, htmlContent?: string) => void;
  onOpenCertificate?: (recipientName: string, title: string, type: 'course' | 'quiz', date: string, score?: string, grade?: string) => void;
}

export default function ReportDetail({ 
  report, 
  onClose, 
  onUpdateImage,
  isAdmin,
  onUpdateReportField,
  currentUser,
  onToggleCompletion,
  onGoToQuestionnaire,
  onOpenSecureViewer,
  onOpenCertificate
}: ReportDetailProps) {
  const [completedMaterials, setCompletedMaterials] = useState<Record<string, boolean>>(() => {
    try {
      const emailKey = currentUser?.email || 'guest';
      const saved = localStorage.getItem(`masonic_completed_${emailKey}_${report.id}`);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [accessedMaterials, setAccessedMaterials] = useState<Record<string, boolean>>(() => {
    try {
      const emailKey = currentUser?.email || 'guest';
      const saved = localStorage.getItem(`masonic_accessed_${emailKey}_${report.id}`);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const markAsAccessed = (materialKey: string) => {
    setAccessedMaterials(prev => {
      const updated = { ...prev, [materialKey]: true };
      const emailKey = currentUser?.email || 'guest';
      localStorage.setItem(`masonic_accessed_${emailKey}_${report.id}`, JSON.stringify(updated));
      return updated;
    });
  };

  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
  const [approvedQuiz, setApprovedQuiz] = useState<boolean>(false);

  useEffect(() => {
    const localQuizzes = localStorage.getItem('masonic_questionnaires_v1');
    if (localQuizzes) {
      setQuestionnaires(JSON.parse(localQuizzes));
    }
    
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
            console.warn('Error fetching questionnaires directly in details view:', err);
          });
      });
    }
  }, []);

  // Sync approved status of linked questionnaire and force completedMaterials['linked_questionnaire']
  useEffect(() => {
    if (!report.linkedQuestionnaireId) return;

    const emailKey = currentUser?.email || 'guest';
    const emailKeyClean = emailKey.toLowerCase().trim();

    const checkApprovedStatus = (attempts: any[]) => {
      const linkedQuiz = questionnaires.find(q => q.id === report.linkedQuestionnaireId);
      const minScore = linkedQuiz?.approvalScore ?? 70;

      const isApproved = attempts.some(a => 
        String(a.questionnaireId) === String(report.linkedQuestionnaireId) &&
        (String(a.userEmail || '').toLowerCase().trim() === emailKeyClean || String(a.userId || '') === String(currentUser?.id || '')) &&
        (a.approved === true || (typeof a.scorePercentage === 'number' && a.scorePercentage >= minScore))
      );

      if (isApproved) {
        setApprovedQuiz(true);
        setCompletedMaterials(prev => {
          if (!prev['linked_questionnaire']) {
            const updated = {
              ...prev,
              ['linked_questionnaire']: true
            };
            localStorage.setItem(`masonic_completed_${emailKey}_${report.id}`, JSON.stringify(updated));
            
            const { db } = initializeFirebase();
            if (db) {
              const docId = `${emailKeyClean}___${report.id}`.replace(/\./g, '_');
              import('firebase/firestore').then(({ doc, setDoc }) => {
                setDoc(doc(db, 'completions', docId), cleanObjectForFirestore({
                  userEmail: emailKeyClean,
                  reportId: report.id,
                  completed: updated,
                  lastUpdated: new Date().toISOString()
                })).catch(err => console.error(err));
              });
            }
            return updated;
          }
          return prev;
        });
      } else {
        setApprovedQuiz(false);
        setCompletedMaterials(prev => {
          if (prev['linked_questionnaire']) {
            const updated = {
              ...prev,
              ['linked_questionnaire']: false
            };
            localStorage.setItem(`masonic_completed_${emailKey}_${report.id}`, JSON.stringify(updated));
            
            const { db } = initializeFirebase();
            if (db) {
              const docId = `${emailKeyClean}___${report.id}`.replace(/\./g, '_');
              import('firebase/firestore').then(({ doc, setDoc }) => {
                setDoc(doc(db, 'completions', docId), cleanObjectForFirestore({
                  userEmail: emailKeyClean,
                  reportId: report.id,
                  completed: updated,
                  lastUpdated: new Date().toISOString()
                })).catch(err => console.error(err));
              });
            }
            return updated;
          }
          return prev;
        });
      }
    };

    const savedAttempts = localStorage.getItem('masonic_attempts_v1');
    if (savedAttempts) {
      try {
        checkApprovedStatus(JSON.parse(savedAttempts));
      } catch (e) {
        console.error(e);
      }
    }

    const { db } = initializeFirebase();
    if (db) {
      import('firebase/firestore').then(({ collection, getDocs }) => {
        getDocs(collection(db, 'simulation_attempts'))
          .then((snap) => {
            if (!snap.empty) {
              const cloudAttempts: any[] = [];
              snap.forEach(d => cloudAttempts.push(d.data()));
              checkApprovedStatus(cloudAttempts);
            }
          })
          .catch(err => console.error(err));
      });
    }
  }, [report.linkedQuestionnaireId, questionnaires, currentUser, report.id]);

  // Load Completion Status from Firestore if connected
  useEffect(() => {
    if (!currentUser?.email) return;
    const emailKey = currentUser.email.toLowerCase().trim();
    const { db } = initializeFirebase();
    if (db) {
      const docId = `${emailKey}___${report.id}`.replace(/\./g, '_');
      const docRef = doc(db, 'completions', docId);
      getDoc(docRef)
        .then((docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            if (data && data.completed) {
              // Ensure we respect the forced linked_questionnaire state
              const updatedFromCloud = { ...data.completed };
              if (report.linkedQuestionnaireId) {
                updatedFromCloud['linked_questionnaire'] = approvedQuiz;
              }
              setCompletedMaterials(updatedFromCloud);
              localStorage.setItem(`masonic_completed_${emailKey}_${report.id}`, JSON.stringify(updatedFromCloud));
            }
          }
        })
        .catch((err) => {
          console.error('Falha ao sincronizar progresso inicial do irmão:', err);
        });
    }
  }, [currentUser, report.id, approvedQuiz, report.linkedQuestionnaireId]);

  const toggleMaterialCompletion = async (materialKey: string) => {
    if (materialKey === 'linked_questionnaire' && report.linkedQuestionnaireId) {
      const linkedQuiz = questionnaires.find(q => q.id === report.linkedQuestionnaireId);
      const minScore = linkedQuiz?.approvalScore ?? 70;
      if (!approvedQuiz) {
        alert(`Atenção: Este curso possui um questionário vinculado obrigatório. Para conclui-lo, você deve realizar a prova do questionário e obter aprovação com a nota mínima de ${minScore}%.`);
        return;
      }
    }

    const newVal = !completedMaterials[materialKey];

    if (newVal) {
      let needsAccess = false;
      let materialLabel = "o material";
      
      if (materialKey === 'htmlContent' && report.htmlContent) {
        needsAccess = !accessedMaterials['htmlContent'];
        materialLabel = "o Curso Interativo";
      } else if (materialKey === 'material1' && report.material1Link) {
        needsAccess = !accessedMaterials['material1'];
        materialLabel = report.material1Name ? `"${report.material1Name}"` : "o Material 1";
      } else if (materialKey === 'material2' && report.material2Link) {
        needsAccess = !accessedMaterials['material2'];
        materialLabel = report.material2Name ? `"${report.material2Name}"` : "o Material 2";
      } else if (materialKey === 'material3' && report.material3Link) {
        needsAccess = !accessedMaterials['material3'];
        materialLabel = report.material3Name ? `"${report.material3Name}"` : "o Material 3";
      } else if (materialKey === 'material4' && report.material4Link) {
        needsAccess = !accessedMaterials['material4'];
        materialLabel = report.material4Name ? `"${report.material4Name}"` : "o Material 4";
      } else if (materialKey === 'material5' && report.material5Link) {
        needsAccess = !accessedMaterials['material5'];
        materialLabel = report.material5Name ? `"${report.material5Name}"` : "o Material 5";
      } else if (materialKey === 'material6' && report.material6Link) {
        needsAccess = !accessedMaterials['material6'];
        materialLabel = report.material6Name ? `"${report.material6Name}"` : "o Material 6";
      } else if (materialKey === 'proof' && report.additionalLink) {
        needsAccess = !accessedMaterials['proof'];
        materialLabel = "a Prova do Conteúdo";
      }

      if (needsAccess) {
        alert(`Atenção: Por favor, clique primeiro no botão "Acessar Conteúdo" (ou similar) para ler/visualizar ${materialLabel} antes de marcá-lo como concluído.`);
        return;
      }
    }

    const updated = {
      ...completedMaterials,
      [materialKey]: newVal
    };
    setCompletedMaterials(updated);
    const emailKey = currentUser?.email || 'guest';
    const emailKeyClean = emailKey.toLowerCase().trim();
    localStorage.setItem(`masonic_completed_${emailKey}_${report.id}`, JSON.stringify(updated));
    if (onToggleCompletion) {
      onToggleCompletion();
    }

    // Sync completion state to Cloud Firestore
    const { db } = initializeFirebase();
    if (db) {
      try {
        const docId = `${emailKeyClean}___${report.id}`.replace(/\./g, '_');
        await setDoc(doc(db, 'completions', docId), cleanObjectForFirestore({
          userEmail: emailKeyClean,
          reportId: report.id,
          completed: updated,
          lastUpdated: new Date().toISOString()
        }));
      } catch (err) {
        console.error('Falha ao salvar progresso do irmão na nuvem:', err);
      }
    }
  };

  const requiredMaterials = [
    ...(report.htmlContent ? [{ key: 'htmlContent', link: report.htmlContent, label: 'Curso Interativo HTML' }] : []),
    { key: 'material1', link: report.material1Link, label: report.material1Name || 'Material 1' },
    { key: 'material2', link: report.material2Link, label: report.material2Name || 'Material 2' },
    { key: 'material3', link: report.material3Link, label: report.material3Name || 'Material 3' },
    { key: 'material4', link: report.material4Link, label: report.material4Name || 'Material 4' },
    { key: 'material5', link: report.material5Link, label: report.material5Name || 'Material 5' },
    { key: 'material6', link: report.material6Link, label: report.material6Name || 'Material 6' },
    ...(report.linkedQuestionnaireId ? [{ key: 'linked_questionnaire', link: report.linkedQuestionnaireId, label: 'Questionário' }] : [])
  ].filter(m => !!m.link);

  const onlyMaterials = [
    ...(report.htmlContent ? [{ key: 'htmlContent', link: report.htmlContent, label: 'Curso Interativo HTML' }] : []),
    { key: 'material1', link: report.material1Link, label: report.material1Name || 'Material 1' },
    { key: 'material2', link: report.material2Link, label: report.material2Name || 'Material 2' },
    { key: 'material3', link: report.material3Link, label: report.material3Name || 'Material 3' },
    { key: 'material4', link: report.material4Link, label: report.material4Name || 'Material 4' },
    { key: 'material5', link: report.material5Link, label: report.material5Name || 'Material 5' },
    { key: 'material6', link: report.material6Link, label: report.material6Name || 'Material 6' },
  ].filter(m => !!m.link);

  const materialsCompleted = onlyMaterials.every(m => completedMaterials[m.key]);

  const allCompleted = requiredMaterials.every(m => completedMaterials[m.key]);

  const handleExport = (type: 'pdf' | 'csv') => {
    alert(`[SIMULAÇÃO] Exportando "${report.title}" como ${type.toUpperCase()}...`);
  };

  return (
    <div id="report-detail-drawer" className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Background overlay */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-all pointer-events-auto"
      />

      {/* Main Drawer Container */}
      <div className="relative w-full max-w-2xl bg-[#06273A] text-[#d4e5f2] h-full sm:h-auto sm:max-h-[90vh] rounded-xl sm:rounded-2xl flex flex-col shadow-2xl border-l-2 sm:border-2 border-[#D4AF37] z-10 overflow-hidden font-sans">
        
        {/* Drawer Header */}
        <div className="p-4 bg-[#04141D] border-b border-[#1c2c36] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {report.thumbnailUrl ? (
              <img
                src={report.thumbnailUrl}
                alt="Miniatura"
                referrerPolicy="no-referrer"
                className="w-18 h-18 sm:w-[72px] sm:h-[72px] rounded object-cover border border-[#1c2c36]/80 grow-0 shrink-0 shadow-md animate-fade-in"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            ) : (
              <Shield className="w-10 h-10 text-[#f2ca50]" />
            )}
            <div className="text-left">
              <span className="block text-[9px] font-mono text-[#f2ca50] uppercase tracking-wider flex items-center gap-1.5 flex-wrap">
                <InlineEditable
                  value={report.department}
                  isAdmin={isAdmin}
                  onSave={(val) => onUpdateReportField(report.id, 'department', val)}
                  className="font-mono text-[9px] text-[#f2ca50] uppercase tracking-wider"
                />
                {report.nivelCurso && (
                  <span className="bg-[#E9C349]/10 border border-[#E9C349]/20 text-[#E9C349] px-1 rounded text-[8.5px] uppercase font-black tracking-wide leading-none py-0.5 select-none font-mono">
                    {getDegreeLabel(report.nivelCurso)}
                  </span>
                )}
              </span>
              <h2 className="font-sans font-bold text-sm md:text-base leading-tight text-[#d4e5f2] max-w-sm truncate">
                <InlineEditable
                  value={report.title}
                  isAdmin={isAdmin}
                  onSave={(val) => onUpdateReportField(report.id, 'title', val)}
                  className="font-sans font-bold text-sm md:text-base leading-tight text-[#d4e5f2] max-w-sm truncate"
                />
              </h2>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-[#99907c] hover:text-[#d4e5f2] p-1.5 rounded-full hover:bg-[#0c354d] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body - Scrollable content */}
        <div id="drawer-body-scroll" className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* Quick Info Grid / Ficha Técnica do Curso */}
          <div className="bg-[#04141d]/50 p-5 rounded-xl border border-[#1c2c36]/40 space-y-4">
            <h3 className="text-xs font-mono text-[#E9C349] tracking-wider uppercase border-b border-[#1c2c36]/30 pb-2 font-bold mb-3">
              Ficha Técnica do Curso
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Curso */}
              <div className="col-span-1 sm:col-span-2">
                <span className="block text-[10px] font-mono text-[#99907c] uppercase tracking-wider">Curso</span>
                <span className="text-sm font-sans font-bold text-[#d4e5f2] block mt-1">
                  <InlineEditable
                    value={report.title}
                    isAdmin={isAdmin}
                    onSave={(val) => onUpdateReportField(report.id, 'title', val)}
                    className="text-sm font-sans font-bold text-[#d4e5f2]"
                  />
                </span>
              </div>

              {/* Líder / Responsável Ativo */}
              <div>
                <span className="block text-[10px] font-mono text-[#99907c] uppercase tracking-wider">Instrutor</span>
                <span className="text-xs font-sans font-medium text-[#d4e5f2] flex items-center gap-1.5 mt-1">
                  <User className="w-3.5 h-3.5 text-[#66d9cc] shrink-0" />
                  <InlineEditable
                    value={report.owner}
                    isAdmin={isAdmin}
                    onSave={(val) => onUpdateReportField(report.id, 'owner', val)}
                    className="text-xs font-sans font-medium text-[#d4e5f2]"
                  />
                </span>
              </div>

              {/* Categoria */}
              <div>
                <span className="block text-[10px] font-mono text-[#99907c] uppercase tracking-wider">Categoria</span>
                <span className="text-xs font-sans font-medium text-[#d4e5f2] flex items-center gap-1.5 mt-1">
                  <span className="w-2 h-2 rounded-full bg-[#E9C349]" />
                  <InlineEditable
                    value={report.category}
                    isAdmin={isAdmin}
                    onSave={(val) => onUpdateReportField(report.id, 'category', val)}
                    className="text-xs font-sans font-medium text-[#d4e5f2]"
                  />
                </span>
              </div>

              {/* Grau Requerido */}
              <div>
                <span className="block text-[10px] font-mono text-[#99907c] uppercase tracking-wider font-bold">Grau Requerido</span>
                <span className="text-xs font-mono font-extrabold text-[#E9C349] flex items-center gap-1.5 mt-1">
                  <Shield className="w-3.5 h-3.5 text-[#26a69a]" />
                  {getDegreeLabel(report.nivelCurso || 1)}
                </span>
              </div>

              {/* Questionário Vinculado */}
              <div>
                <span className="block text-[10px] font-mono text-[#99907c] uppercase tracking-wider font-bold">Questionário Vinculado</span>
                <span className="text-xs font-sans font-medium text-[#d4e5f2] flex items-center gap-1.5 mt-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-[#E9C349]" />
                  {report.linkedQuestionnaireId ? (
                    questionnaires.find(q => q.id === report.linkedQuestionnaireId)?.title || 'Questionário Vinculado'
                  ) : (
                    <span className="text-[#99907c] italic font-mono text-[11px]">Nenhum vinculado</span>
                  )}
                </span>
              </div>

              {/* Breve Resumo Executivo */}
              <div className="col-span-1 sm:col-span-2">
                <span className="block text-[10px] font-mono text-[#99907c] uppercase tracking-wider">Resumo do Conteúdo</span>
                <div className="text-xs font-mono italic text-[#d4e5f2]/85 bg-[#04141d] p-3 rounded border-l-2 border-[#E9C349] mt-1.5">
                  <InlineEditable
                    value={report.summary}
                    isAdmin={isAdmin}
                    type="textarea"
                    onSave={(val) => onUpdateReportField(report.id, 'summary', val)}
                    className="font-mono italic text-xs text-[#d4e5f2]/85 leading-relaxed block"
                    as="span"
                  />
                </div>
              </div>
                      {/* Miniatura do Curso */}
              {isAdmin && (
                <div className="col-span-1 sm:col-span-2">
                  <span className="block text-[10px] font-mono text-[#99907c] uppercase tracking-wider mb-1.5 font-bold">Miniatura do Curso <span className="text-[#E9C349] font-sans font-medium text-[9.5px] lowercase normal-case">(Sugestão: 128x128px ou proporção quadrado 1:1)</span></span>
                  <div className="flex flex-col gap-2.5 bg-[#04141d]/50 p-3 rounded-lg border border-[#1c2c36]">
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-24 rounded overflow-hidden border border-[#1c2c36] bg-[#04141d] flex items-center justify-center shrink-0 shadow-md">
                        {report.thumbnailUrl ? (
                          <img
                            src={report.thumbnailUrl}
                            alt="Miniatura do Curso"
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <ImageIcon className="w-7 h-7 text-gray-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="block text-[9px] font-mono text-gray-500 uppercase">Status da Imagem</span>
                        <p className="text-[10px] font-mono text-[#a5b8c7] truncate hover:text-[#E9C349] cursor-help" title={report.thumbnailUrl || 'Nenhuma imagem cadastrada'}>
                          {report.thumbnailUrl ? (report.thumbnailUrl.startsWith('data:image/') ? 'Arquivo local cadastrado' : report.thumbnailUrl) : 'Nenhuma imagem cadastrada'}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1 pt-2 border-t border-[#1c2c36]/40">
                      {/* URL Option */}
                      <div className="space-y-1">
                        <span className="block text-[8px] font-mono text-gray-500 uppercase">Substituir por URL</span>
                        <input
                          type="url"
                          placeholder="Cole o link da imagem..."
                          value={report.thumbnailUrl?.startsWith('data:image/') ? '' : (report.thumbnailUrl || '')}
                          onChange={(e) => {
                            onUpdateReportField(report.id, 'thumbnailUrl', e.target.value);
                          }}
                          className="w-full bg-[#04141d] border border-[#1c2c36] text-[10px] px-2 py-1 rounded text-[#d4e5f2] focus:outline-none focus:border-[#E8C349]"
                        />
                      </div>

                      {/* Local File Selector */}
                      <div className="space-y-1">
                        <span className="block text-[8px] font-mono text-gray-500 uppercase">Substituir por Arquivo</span>
                        <div
                          onClick={() => document.getElementById(`detail-thumbnail-picker-${report.id}`)?.click()}
                          className="w-full bg-[#11212b] border border-[#1c2c36] hover:border-[#E8C349]/50 text-[10px] py-1 px-2.5 rounded text-[#d4e5f2] cursor-pointer text-center flex items-center justify-center gap-1.5 transition-all select-none"
                        >
                          <Upload className="w-3.5 h-3.5 text-[#99907c]" />
                          <span>Enviar do PC (Máx 2MB)</span>
                          <input
                            id={`detail-thumbnail-picker-${report.id}`}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;

                              if (file.size > 10 * 1024 * 1024) {
                                alert("Imagem muito grande! O tamanho máximo permitido é de 10MB.");
                                return;
                              }

                              const reader = new FileReader();
                              reader.onload = async (event) => {
                                if (event.target?.result) {
                                  try {
                                    const base64Str = event.target.result as string;
                                    // Compressing thumbnail image to 800x600 for performance and database storage sizing
                                    const compressed = await compressImage(base64Str, 800, 600, 0.75);
                                    onUpdateReportField(report.id, 'thumbnailUrl', compressed);
                                  } catch (err) {
                                    console.error("Error compressing image:", err);
                                    onUpdateReportField(report.id, 'thumbnailUrl', event.target.result as string);
                                  }
                                }
                              };
                              reader.readAsDataURL(file);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Última Atualização */}
              <div>
                <span className="block text-[10px] font-mono text-[#99907c] uppercase tracking-wider">Última Atualização</span>
                <span className="text-xs font-sans font-medium text-[#d4e5f2] flex items-center gap-1.5 mt-1">
                  <Calendar className="w-3.5 h-3.5 text-[#66d9cc] shrink-0" />
                  <InlineEditable
                    value={report.lastUpdated}
                    isAdmin={isAdmin}
                    onSave={(val) => onUpdateReportField(report.id, 'lastUpdated', val)}
                    className="text-xs font-sans font-medium text-[#d4e5f2]"
                  />
                </span>
              </div>
            </div>
          </div>

          {/* Acesso ao Curso em formato HTML para todos os usuários */}
          {report.htmlContent && (
            <div className="bg-[#11212b]/80 border border-[#e9c34a]/30 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-md mb-2 text-left">
              <div className="flex items-center gap-3 min-w-0">
                <div className="bg-[#e9c34a]/10 p-2 rounded-lg border border-[#e9c34a]/30 shrink-0">
                  <span className="text-[#e9c34a] text-xs font-bold font-mono">HTML</span>
                </div>
                <div className="text-left min-w-0">
                  <span className="block text-[9px] font-mono text-[#e9c34a] uppercase tracking-wider font-bold">Conteúdo Interativo</span>
                  <span className="text-xs font-sans text-[#d4e5f1] font-semibold block truncate">
                    Este curso possui uma versão interativa em HTML de alta fidelidade.
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0 mt-2 md:mt-0 flex-wrap sm:flex-nowrap">
                <button
                  onClick={() => toggleMaterialCompletion('htmlContent')}
                  className={`flex items-center gap-1.5 text-[11px] font-mono font-bold px-3 py-2 rounded-lg border transition-all cursor-pointer select-none ${
                    completedMaterials['htmlContent']
                      ? 'bg-[#185347]/40 text-[#66d9cc] border-[#185347]'
                      : 'bg-[#04141d] text-[#99907c] border-[#1c2c36] hover:border-[#E9C349]'
                  }`}
                >
                  {completedMaterials['htmlContent'] ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#66d9cc]" />
                      <span>CONCLUÍDO</span>
                    </>
                  ) : (
                    <>
                      <span className="w-3.5 h-3.5 rounded-full border border-[#99907c] flex items-center justify-center text-[8px]" />
                      <span>CONCLUIR</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    markAsAccessed('htmlContent');
                    if (onOpenSecureViewer) {
                      onOpenSecureViewer('', report.title, report.htmlContent);
                    }
                  }}
                  className="text-xs font-mono font-bold text-[#241a00] hover:bg-[#ffe088] bg-[#E9C349] px-4 py-2.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer shadow"
                >
                  ACESSAR CURSO INTERATIVO
                </button>
              </div>
            </div>
          )}

          {/* Link Personalizado do Botão ACESSAR (URL) - Visível apenas para Administradores de acordo com a solicitação */}
          {isAdmin && report.customAccessUrl && (
            <div className="bg-[#11212b] border border-[#1c2c36] rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2 min-w-0">
                <LinkIcon className="w-4 h-4 text-[#E9C349] shrink-0" />
                <div className="text-left min-w-0">
                  <span className="block text-[10px] font-mono text-[#99907c] uppercase tracking-wider">Link Personalizado do Botão ACESSAR (URL)</span>
                  <span className="text-[11px] font-mono text-[#a5b8c7] block truncate max-w-xs md:max-w-md" title={report.customAccessUrl}>
                    {report.customAccessUrl}
                  </span>
                </div>
              </div>
              <a
                href={report.customAccessUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  if (onOpenSecureViewer) {
                    e.preventDefault();
                    onOpenSecureViewer(report.customAccessUrl || '', report.title);
                  }
                }}
                className="text-xs font-mono font-bold text-[#241a00] hover:bg-[#ffe088] bg-[#E9C349] px-4 py-2 rounded flex items-center gap-1.5 transition-all w-full sm:w-auto text-center justify-center shrink-0 cursor-pointer"
              >
                ACESSAR
              </a>
            </div>
          )}

          {/* Link do Material 1 / Referência Direta (URL) */}
          {report.material1Link && (
            <div id={`detail-material1-block`} className="bg-[#11212b] border border-[#1c2c36] rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2 min-w-0">
                <LinkIcon className="w-4 h-4 text-[#E9C349] shrink-0" />
                <div className="text-left min-w-0">
                  {isAdmin ? (
                    <>
                      <span className="block text-[10px] font-mono text-[#9cbfd5] uppercase tracking-wider">{report.material1Name ? `Link: ${report.material1Name}` : 'Link do Material 1 / Referência Direta (URL)'}</span>
                      <span className="text-[11px] font-mono text-[#a5b8c7] block truncate max-w-xs md:max-w-md" title={report.material1Link}>
                        {report.material1Link}
                      </span>
                    </>
                  ) : (
                    <span className="block text-[11px] font-mono text-[#a5b8c7] tracking-wider font-bold">{report.material1Name || 'Material 1'}</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 mt-2 sm:mt-0">
                <button
                  onClick={() => toggleMaterialCompletion('material1')}
                  className={`flex items-center gap-1.5 text-[11px] font-mono font-bold px-3 py-1.5 rounded border transition-all cursor-pointer select-none ${
                    completedMaterials['material1']
                      ? 'bg-[#185347]/40 text-[#66d9cc] border-[#185347]'
                      : 'bg-[#04141d] text-[#99907c] border-[#1c2c36] hover:border-[#E9C349]'
                  }`}
                >
                  {completedMaterials['material1'] ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#66d9cc]" />
                      <span>CONCLUÍDO</span>
                    </>
                  ) : (
                    <>
                      <span className="w-3.5 h-3.5 rounded border border-[#99907c] flex items-center justify-center text-[8px]" />
                      <span>CONCLUIR</span>
                    </>
                  )}
                </button>
                <a
                  href={report.material1Link}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => {
                    markAsAccessed('material1');
                    if (onOpenSecureViewer) {
                      e.preventDefault();
                      onOpenSecureViewer(report.material1Link || '', `${report.title} - ${report.material1Name || 'Material 1'}`);
                    }
                  }}
                  className="text-xs font-mono font-bold text-[#241a00] hover:bg-[#ffe088] bg-[#E9C349] px-3.5 py-1.5 rounded flex items-center gap-1.5 transition-all w-full sm:w-auto text-center justify-center shrink-0 cursor-pointer"
                >
                  Acessar Conteúdo
                </a>
              </div>
            </div>
          )}

          {/* Link do Material 2 / Referência Direta (URL) */}
          {report.material2Link && (
            <div id={`detail-material2-block`} className="bg-[#11212b] border border-[#1c2c36] rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2 min-w-0">
                <LinkIcon className="w-4 h-4 text-[#E9C349] shrink-0" />
                <div className="text-left min-w-0">
                  {isAdmin ? (
                    <>
                      <span className="block text-[10px] font-mono text-[#9cbfd5] uppercase tracking-wider">{report.material2Name ? `Link: ${report.material2Name}` : 'Link do Material 2 / Referência Direta (URL)'}</span>
                      <span className="text-[11px] font-mono text-[#a5b8c7] block truncate max-w-xs md:max-w-md" title={report.material2Link}>
                        {report.material2Link}
                      </span>
                    </>
                  ) : (
                    <span className="block text-[11px] font-mono text-[#a5b8c7] tracking-wider font-bold">{report.material2Name || 'Material 2'}</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 mt-2 sm:mt-0">
                <button
                  onClick={() => toggleMaterialCompletion('material2')}
                  className={`flex items-center gap-1.5 text-[11px] font-mono font-bold px-3 py-1.5 rounded border transition-all cursor-pointer select-none ${
                    completedMaterials['material2']
                      ? 'bg-[#185347]/40 text-[#66d9cc] border-[#185347]'
                      : 'bg-[#04141d] text-[#99907c] border-[#1c2c36] hover:border-[#E9C349]'
                  }`}
                >
                  {completedMaterials['material2'] ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#66d9cc]" />
                      <span>CONCLUÍDO</span>
                    </>
                  ) : (
                    <>
                      <span className="w-3.5 h-3.5 rounded border border-[#99907c] flex items-center justify-center text-[8px]" />
                      <span>CONCLUIR</span>
                    </>
                  )}
                </button>
                <a
                  href={report.material2Link}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => {
                    markAsAccessed('material2');
                    if (onOpenSecureViewer) {
                      e.preventDefault();
                      onOpenSecureViewer(report.material2Link || '', `${report.title} - ${report.material2Name || 'Material 2'}`);
                    }
                  }}
                  className="text-xs font-mono font-bold text-[#241a00] hover:bg-[#ffe088] bg-[#E9C349] px-3.5 py-1.5 rounded flex items-center gap-1.5 transition-all w-full sm:w-auto text-center justify-center shrink-0 cursor-pointer"
                >
                  Acessar Conteúdo
                </a>
              </div>
            </div>
          )}

          {/* Link do Material 3 / Referência Direta (URL) */}
          {report.material3Link && (
            <div id={`detail-material3-block`} className="bg-[#11212b] border border-[#1c2c36] rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2 min-w-0">
                <LinkIcon className="w-4 h-4 text-[#E9C349] shrink-0" />
                <div className="text-left min-w-0">
                  {isAdmin ? (
                    <>
                      <span className="block text-[10px] font-mono text-[#9cbfd5] uppercase tracking-wider">{report.material3Name ? `Link: ${report.material3Name}` : 'Link do Material 3 / Referência Direta (URL)'}</span>
                      <span className="text-[11px] font-mono text-[#a5b8c7] block truncate max-w-xs md:max-w-md" title={report.material3Link}>
                        {report.material3Link}
                      </span>
                    </>
                  ) : (
                    <span className="block text-[11px] font-mono text-[#a5b8c7] tracking-wider font-bold">{report.material3Name || 'Material 3'}</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 mt-2 sm:mt-0">
                <button
                  onClick={() => toggleMaterialCompletion('material3')}
                  className={`flex items-center gap-1.5 text-[11px] font-mono font-bold px-3 py-1.5 rounded border transition-all cursor-pointer select-none ${
                    completedMaterials['material3']
                      ? 'bg-[#185347]/40 text-[#66d9cc] border-[#185347]'
                      : 'bg-[#04141d] text-[#99907c] border-[#1c2c36] hover:border-[#E9C349]'
                  }`}
                >
                  {completedMaterials['material3'] ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#66d9cc]" />
                      <span>CONCLUÍDO</span>
                    </>
                  ) : (
                    <>
                      <span className="w-3.5 h-3.5 rounded border border-[#99907c] flex items-center justify-center text-[8px]" />
                      <span>CONCLUIR</span>
                    </>
                  )}
                </button>
                <a
                  href={report.material3Link}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => {
                    markAsAccessed('material3');
                    if (onOpenSecureViewer) {
                      e.preventDefault();
                      onOpenSecureViewer(report.material3Link || '', `${report.title} - ${report.material3Name || 'Material 3'}`);
                    }
                  }}
                  className="text-xs font-mono font-bold text-[#241a00] hover:bg-[#ffe088] bg-[#E9C349] px-3.5 py-1.5 rounded flex items-center gap-1.5 transition-all w-full sm:w-auto text-center justify-center shrink-0 cursor-pointer"
                >
                  Acessar Conteúdo
                </a>
              </div>
            </div>
          )}

          {/* Link do Material 4 / Referência Direta (URL) */}
          {report.material4Link && (
            <div id={`detail-material4-block`} className="bg-[#11212b] border border-[#1c2c36] rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2 min-w-0">
                <LinkIcon className="w-4 h-4 text-[#E9C349] shrink-0" />
                <div className="text-left min-w-0">
                  {isAdmin ? (
                    <>
                      <span className="block text-[10px] font-mono text-[#9cbfd5] uppercase tracking-wider">{report.material4Name ? `Link: ${report.material4Name}` : 'Link do Material 4 / Referência Direta (URL)'}</span>
                      <span className="text-[11px] font-mono text-[#a5b8c7] block truncate max-w-xs md:max-w-md" title={report.material4Link}>
                        {report.material4Link}
                      </span>
                    </>
                  ) : (
                    <span className="block text-[11px] font-mono text-[#a5b8c7] tracking-wider font-bold">{report.material4Name || 'Material 4'}</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 mt-2 sm:mt-0">
                <button
                  onClick={() => toggleMaterialCompletion('material4')}
                  className={`flex items-center gap-1.5 text-[11px] font-mono font-bold px-3 py-1.5 rounded border transition-all cursor-pointer select-none ${
                    completedMaterials['material4']
                      ? 'bg-[#185347]/40 text-[#66d9cc] border-[#185347]'
                      : 'bg-[#04141d] text-[#99907c] border-[#1c2c36] hover:border-[#E9C349]'
                  }`}
                >
                  {completedMaterials['material4'] ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#66d9cc]" />
                      <span>CONCLUÍDO</span>
                    </>
                  ) : (
                    <>
                      <span className="w-3.5 h-3.5 rounded border border-[#99907c] flex items-center justify-center text-[8px]" />
                      <span>CONCLUIR</span>
                    </>
                  )}
                </button>
                <a
                  href={report.material4Link}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => {
                    markAsAccessed('material4');
                    if (onOpenSecureViewer) {
                      e.preventDefault();
                      onOpenSecureViewer(report.material4Link || '', `${report.title} - ${report.material4Name || 'Material 4'}`);
                    }
                  }}
                  className="text-xs font-mono font-bold text-[#241a00] hover:bg-[#ffe088] bg-[#E9C349] px-3.5 py-1.5 rounded flex items-center gap-1.5 transition-all w-full sm:w-auto text-center justify-center shrink-0 cursor-pointer"
                >
                  Acessar Conteúdo
                </a>
              </div>
            </div>
          )}

          {/* Link do Material 5 / Referência Direta (URL) */}
          {report.material5Link && (
            <div id={`detail-material5-block`} className="bg-[#11212b] border border-[#1c2c36] rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2 min-w-0">
                <LinkIcon className="w-4 h-4 text-[#E9C349] shrink-0" />
                <div className="text-left min-w-0">
                  {isAdmin ? (
                    <>
                      <span className="block text-[10px] font-mono text-[#9cbfd5] uppercase tracking-wider">{report.material5Name ? `Link: ${report.material5Name}` : 'Link do Material 5 / Referência Direta (URL)'}</span>
                      <span className="text-[11px] font-mono text-[#a5b8c7] block truncate max-w-xs md:max-w-md" title={report.material5Link}>
                        {report.material5Link}
                      </span>
                    </>
                  ) : (
                    <span className="block text-[11px] font-mono text-[#a5b8c7] tracking-wider font-bold">{report.material5Name || 'Material 5'}</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 mt-2 sm:mt-0">
                <button
                  onClick={() => toggleMaterialCompletion('material5')}
                  className={`flex items-center gap-1.5 text-[11px] font-mono font-bold px-3 py-1.5 rounded border transition-all cursor-pointer select-none ${
                    completedMaterials['material5']
                      ? 'bg-[#185347]/40 text-[#66d9cc] border-[#185347]'
                      : 'bg-[#04141d] text-[#99907c] border-[#1c2c36] hover:border-[#E9C349]'
                  }`}
                >
                  {completedMaterials['material5'] ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#66d9cc]" />
                      <span>CONCLUÍDO</span>
                    </>
                  ) : (
                    <>
                      <span className="w-3.5 h-3.5 rounded border border-[#99907c] flex items-center justify-center text-[8px]" />
                      <span>CONCLUIR</span>
                    </>
                  )}
                </button>
                <a
                  href={report.material5Link}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => {
                    markAsAccessed('material5');
                    if (onOpenSecureViewer) {
                      e.preventDefault();
                      onOpenSecureViewer(report.material5Link || '', `${report.title} - ${report.material5Name || 'Material 5'}`);
                    }
                  }}
                  className="text-xs font-mono font-bold text-[#241a00] hover:bg-[#ffe088] bg-[#E9C349] px-3.5 py-1.5 rounded flex items-center gap-1.5 transition-all w-full sm:w-auto text-center justify-center shrink-0 cursor-pointer"
                >
                  Acessar Conteúdo
                </a>
              </div>
            </div>
          )}

          {/* Link do Material 6 / Referência Direta (URL) */}
          {report.material6Link && (
            <div id={`detail-material6-block`} className="bg-[#11212b] border border-[#1c2c36] rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2 min-w-0">
                <LinkIcon className="w-4 h-4 text-[#E9C349] shrink-0" />
                <div className="text-left min-w-0">
                  {isAdmin ? (
                    <>
                      <span className="block text-[10px] font-mono text-[#9cbfd5] uppercase tracking-wider">{report.material6Name ? `Link: ${report.material6Name}` : 'Link do Material 6 / Referência Direta (URL)'}</span>
                      <span className="text-[11px] font-mono text-[#a5b8c7] block truncate max-w-xs md:max-w-md" title={report.material6Link}>
                        {report.material6Link}
                      </span>
                    </>
                  ) : (
                    <span className="block text-[11px] font-mono text-[#a5b8c7] tracking-wider font-bold">{report.material6Name || 'Material 6'}</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 mt-2 sm:mt-0">
                <button
                  onClick={() => toggleMaterialCompletion('material6')}
                  className={`flex items-center gap-1.5 text-[11px] font-mono font-bold px-3 py-1.5 rounded border transition-all cursor-pointer select-none ${
                    completedMaterials['material6']
                      ? 'bg-[#185347]/40 text-[#66d9cc] border-[#185347]'
                      : 'bg-[#04141d] text-[#99907c] border-[#1c2c36] hover:border-[#E9C349]'
                  }`}
                >
                  {completedMaterials['material6'] ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#66d9cc]" />
                      <span>CONCLUÍDO</span>
                    </>
                  ) : (
                    <>
                      <span className="w-3.5 h-3.5 rounded border border-[#99907c] flex items-center justify-center text-[8px]" />
                      <span>CONCLUIR</span>
                    </>
                  )}
                </button>
                <a
                  href={report.material6Link}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => {
                    markAsAccessed('material6');
                    if (onOpenSecureViewer) {
                      e.preventDefault();
                      onOpenSecureViewer(report.material6Link || '', `${report.title} - ${report.material6Name || 'Material 6'}`);
                    }
                  }}
                  className="text-xs font-mono font-bold text-[#241a00] hover:bg-[#ffe088] bg-[#E9C349] px-3.5 py-1.5 rounded flex items-center gap-1.5 transition-all w-full sm:w-auto text-center justify-center shrink-0 cursor-pointer"
                >
                  Acessar Conteúdo
                </a>
              </div>
            </div>
          )}

          {/* Seção de Questionário Vinculado */}
          {report.linkedQuestionnaireId && (
            (() => {
              const userAccessLevel = currentUser ? parseInt(String(currentUser.nivelAcesso || (isAdmin ? '33' : '1')), 10) : 1;
              const linkedQuiz = questionnaires.find(q => q.id === report.linkedQuestionnaireId);
              if (!linkedQuiz) return null;
              const quizDegreeRequired = linkedQuiz.degreeRequired || 1;
              const isQuizBlocked = userAccessLevel < quizDegreeRequired;

              return (
                <div id="linked-quiz-promo-block" className="bg-[#0c1d27] border-2 border-dashed border-[#E9C349]/50 rounded-xl p-5 space-y-4 shadow-lg animate-fade-in text-left">
                  <div className="flex items-start gap-3">
                    <div className="bg-[#E9C349]/10 p-2.5 rounded-lg border border-[#E9C349]/35 shrink-0">
                      <HelpCircle className="w-5 h-5 text-[#E9C349]" />
                    </div>
                    <div className="text-left">
                      <span className="block text-[10px] font-mono text-[#66d9cc] uppercase tracking-wider font-extrabold font-bold">Avaliação Oficial do Curso</span>
                      <h4 className="font-sans font-bold text-sm text-[#d4e5f2] mt-0.5">{linkedQuiz.title}</h4>
                      <p className="text-[11px] text-[#99907c] mt-1 leading-relaxed">
                        Este curso possui um questionário online associado. Responda às questões e atinja a pontuação mínima de <strong className="text-[#E9C349]">{linkedQuiz.approvalScore}%</strong> para aprovação!
                      </p>
                    </div>
                  </div>

                  {isQuizBlocked ? (
                    <div className="flex items-start gap-2 bg-rose-950/40 border border-rose-900/60 text-rose-300 p-3 rounded-lg text-[10.5px] leading-relaxed font-mono">
                      <Shield className="w-4 h-4 text-rose-400 shrink-0 mt-0.5 animate-pulse" />
                      <span>
                        <strong className="text-rose-400">Acesso Restrito ao Grau:</strong> este material ainda não é do seu Grau.
                      </span>
                    </div>
                  ) : !materialsCompleted ? (
                    <div className="space-y-3">
                      <button
                        type="button"
                        disabled
                        className="w-full bg-[#11212b]/50 text-[#99907c]/60 font-sans font-extrabold text-xs uppercase py-3 rounded-lg border border-[#1c2c36]/90 flex items-center justify-center gap-2 select-none cursor-not-allowed opacity-60"
                        title="Conclua todos os materiais acima para habilitar o questionário"
                      >
                        <Lock className="w-4 h-4 text-[#99907c]/60" /> Questionário Bloqueado
                      </button>

                      <div className="flex items-start gap-2 bg-[#11212b]/30 border border-[#1c2c36]/50 text-[#99907c] p-2.5 rounded-lg text-[10.5px] leading-relaxed font-mono">
                        <Lock className="w-3.5 h-3.5 text-[#E9C349] shrink-0 mt-0.5 animate-pulse" />
                        <span>
                          Para habilitar o questionário, marque todos os materiais de estudo acima como <strong className="text-[#66d9cc]">CONCLUÍDOS</strong>.
                        </span>
                      </div>

                      {/* Flag de Concluído do Questionário (Disabled) */}
                      <div className="flex items-center justify-between gap-3 bg-[#04141d]/20 border border-[#1c2c36]/40 p-3 rounded-lg opacity-40">
                        <div className="text-left">
                          <span className="block text-[10.5px] font-mono text-[#99907c] font-semibold leading-tight">Marcar Como Concluído</span>
                          <span className="text-[9px] font-mono text-[#99907c]">Concluir voluntariamente o questionário deste título</span>
                        </div>
                        <button
                          type="button"
                          disabled
                          className="flex items-center gap-1.5 text-[11px] font-mono font-bold px-3 py-1.5 rounded border border-[#1c2c36] bg-[#04141d] text-[#99907c]/60 cursor-not-allowed select-none shrink-0"
                        >
                          <span className="w-3.5 h-3.5 rounded border border-[#99907c]/40 flex items-center justify-center text-[8px]" />
                          <span>CONCLUIR</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <button
                        type="button"
                        onClick={() => onGoToQuestionnaire && onGoToQuestionnaire(report.linkedQuestionnaireId!)}
                        className="w-full bg-[#E9C349] text-[#241a00] font-sans font-extrabold text-xs uppercase py-3 rounded-lg hover:bg-[#ffe088] tracking-widest active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 select-none shadow-md border-none"
                      >
                        <FileText className="w-4 h-4" /> Realizar Questionário de Avaliação
                      </button>

                      {/* Flag de Concluído do Questionário */}
                      <div className="flex items-center justify-between gap-3 bg-[#04141d]/60 border border-[#1c2c36]/90 p-3 rounded-lg">
                        <div className="text-left">
                          <span className="block text-[10.5px] font-mono text-[#d4e5f2] font-semibold leading-tight">Status do Questionário</span>
                          <span className="text-[9px] font-mono text-[#99907c]">
                            {approvedQuiz 
                              ? `Aprovado com sucesso! (Nota mínima exigida: ${linkedQuiz?.approvalScore ?? 70}%)` 
                              : `Realize a prova do questionário acima e obtenha nota mínima de ${linkedQuiz?.approvalScore ?? 70}%.`
                            }
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleMaterialCompletion('linked_questionnaire')}
                          className={`flex items-center gap-1.5 text-[11px] font-mono font-bold px-3 py-1.5 rounded border transition-all cursor-pointer select-none shrink-0 ${
                            completedMaterials['linked_questionnaire']
                              ? 'bg-[#185347]/40 text-[#66d9cc] border-[#185347]'
                              : 'bg-rose-950/20 text-rose-300 border-rose-900/60 hover:bg-rose-950/30'
                          }`}
                        >
                          {completedMaterials['linked_questionnaire'] ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#66d9cc]" />
                              <span>APROVADO</span>
                            </>
                          ) : (
                            <>
                              <Lock className="w-3.5 h-3.5 text-rose-400" />
                              <span>PENDENTE</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()
          )}

          {/* Link da Prova do Conteúdo / Referência Direta (URL) */}
          {report.additionalLink && (!report.conteudoSemProva || isAdmin) && (
            allCompleted ? (
              <div className="bg-[#05281b]/30 border border-[#185347]/45 rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 animate-fadeIn">
                <div className="flex items-center gap-2 min-w-0">
                  <LinkIcon className="w-4 h-4 text-[#66d9cc] shrink-0" />
                  <div className="text-left min-w-0">
                    <div className="flex items-center gap-2 max-w-full flex-wrap">
                      <span className="block text-[10px] font-mono text-[#99907c] uppercase tracking-wider">Link da Prova do Conteúdo / Referência Direta (URL)</span>
                      {report.conteudoSemProva && (
                        <span className="bg-red-950/80 border border-red-800 text-red-400 font-mono text-[9px] px-1.5 py-0.5 rounded font-black uppercase tracking-wider shrink-0">
                          Conteúdo sem prova
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] font-mono text-[#66d9cc] block truncate max-w-xs md:max-w-md" title={report.additionalLink}>
                      {report.additionalLink}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 mt-2 sm:mt-0">
                  <button
                    onClick={() => toggleMaterialCompletion('proof')}
                    className={`flex items-center gap-1.5 text-[11px] font-mono font-bold px-3 py-1.5 rounded border transition-all cursor-pointer select-none ${
                      completedMaterials['proof']
                        ? 'bg-[#185347]/40 text-[#66d9cc] border-[#185347]'
                        : 'bg-[#04141d] text-[#99907c] border-[#1c2c36] hover:border-[#E9C349]'
                    }`}
                  >
                    {completedMaterials['proof'] ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#66d9cc]" />
                        <span>CONCLUÍDO</span>
                      </>
                    ) : (
                      <>
                        <span className="w-3.5 h-3.5 rounded border border-[#99907c] flex items-center justify-center text-[8px]" />
                        <span>CONCLUIR</span>
                      </>
                    )}
                  </button>
                  <a
                    href={report.additionalLink}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => {
                      markAsAccessed('proof');
                      if (onOpenSecureViewer) {
                        e.preventDefault();
                        onOpenSecureViewer(report.additionalLink || '', `${report.title} - Prova`);
                      }
                    }}
                    className="text-xs font-mono font-bold text-[#66d9cc] hover:underline flex items-center gap-1.5 bg-[#11212b] px-3.5 py-1.5 rounded border border-[#1c2c36] shrink-0 cursor-pointer"
                  >
                    PROVA DO CONTEÚDO
                  </a>
                </div>
              </div>
            ) : (
              <div className="bg-[#1c1811]/30 border border-[#3e3422]/45 rounded-xl p-4 flex flex-col items-stretch gap-3">
                <div className="flex items-start gap-2.5">
                  <div className="bg-[#E9C349]/10 p-2 rounded-lg border border-[#E9C349]/20 shrink-0">
                    <Lock className="w-4 h-4 text-[#E9C349]" />
                  </div>
                  <div className="text-left">
                    <span className="block text-[10px] font-mono text-[#E9C349] uppercase tracking-wider font-bold">PROVA DO CONTEÚDO (BLOQUEADA)</span>
                    <p className="text-xs text-[#d4e5f2]/80 mt-1 leading-normal">
                      Este link só será liberado após você marcar todos os materiais/conteúdos deste curso como <strong className="text-[#66d9cc] font-mono font-bold">CONCLUÍDOS</strong>.
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2.5 pt-3 border-t border-[#1c2c36]/40 text-[11px] font-mono text-[#99907c]">
                  <div>
                    Progresso: <span className="text-[#E9C349] font-bold">{requiredMaterials.filter(m => completedMaterials[m.key]).length} de {requiredMaterials.length}</span> concluídos
                  </div>
                  <button
                    disabled
                    title="Conclua todos os materiais para acessar"
                    className="text-xs font-mono font-bold text-[#99907c]/60 bg-[#11212b]/50 px-4 py-2 rounded border border-[#1c2c36] flex items-center gap-1.5 cursor-not-allowed select-none opacity-60"
                  >
                    PROVA DO CONTEÚDO <Lock className="w-3.5 h-3.5 text-[#99907c]/60" />
                  </button>
                </div>
              </div>
            )
          )}


          {/* Certificate section */}
          {report.hasCertificate && (
            <div className="mt-6 border-t border-[#1c2c36]/40 pt-6">
              {allCompleted ? (
                <div className="bg-[#05281b]/30 border-2 border-[#E9C349]/40 rounded-xl p-5 text-left flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-lg animate-fadeIn">
                  <div className="space-y-1">
                    <h4 className="font-sans font-extrabold text-sm text-[#E9C349] uppercase tracking-wider flex items-center gap-1.5">
                      <Award className="w-5 h-5 text-[#E9C349] animate-pulse animate-duration-1000" /> Certificado Disponível!
                    </h4>
                    <p className="text-[11px] text-[#d4e5f2]/90 leading-relaxed">
                      Parabéns! Você concluiu 100% das etapas e requisitos estabelecidos para o curso <strong>"{report.title}"</strong>. Seu certificado oficial digital já foi gerado e está pronto para visualização e impressão.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (onOpenCertificate) {
                        const userName = currentUser?.name || 'Membro';
                        const dateStr = new Date().toLocaleDateString('pt-BR');
                        const gradeLabel = report.nivelCurso ? `Grau ${report.nivelCurso}` : undefined;
                        onOpenCertificate(userName, report.title, 'course', dateStr, undefined, gradeLabel);
                      }
                    }}
                    className="bg-[#E9C349] text-[#241a00] hover:bg-[#ffe088] font-bold text-xs font-mono px-5 py-3 rounded-lg flex items-center justify-center gap-2 shrink-0 transition-all active:scale-95 cursor-pointer uppercase tracking-wider w-full md:w-auto"
                  >
                    <Award className="w-4 h-4" /> Emitir Certificado
                  </button>
                </div>
              ) : (
                <div className="bg-[#111921]/60 border border-[#1c2c36]/50 rounded-xl p-5 text-left flex items-start gap-4 shadow-inner">
                  <div className="w-10 h-10 rounded-full bg-[#11212b] border border-[#E9C349]/35 flex items-center justify-center text-[#E9C349] font-bold text-lg shrink-0">
                    ★
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <h4 className="font-sans font-bold text-xs text-[#E9C349] uppercase tracking-wider font-mono">Curso com Certificado Habilitado</h4>
                    <p className="text-[11px] text-[#99907c] leading-relaxed">
                      Este curso de instrução oferece outorga de certificado oficial digital após a sua conclusão integral. Conclua todos os materiais, simulados e testes obrigatórios para desbloquear seu diploma acadêmico.
                    </p>
                    <div className="pt-2">
                      <div className="w-full bg-[#04141d] h-2 rounded-full overflow-hidden border border-[#1c2c36]">
                        <div 
                          className="bg-gradient-to-r from-[#d4af37] to-[#E9C349] h-full transition-all duration-500" 
                          style={{ width: `${(requiredMaterials.filter(m => completedMaterials[m.key]).length / (requiredMaterials.length || 1)) * 100}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-mono text-[#E9C349]/80 mt-1 block">
                        Progresso Atual: {requiredMaterials.filter(m => completedMaterials[m.key]).length} de {requiredMaterials.length} requisitos concluídos ({Math.round((requiredMaterials.filter(m => completedMaterials[m.key]).length / (requiredMaterials.length || 1)) * 100)}%)
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}


        </div>

        {/* Drawer footer */}
        <div className="p-4 bg-[#04141D] border-t border-[#1c2c36] flex items-center justify-between text-xs font-mono text-[#99907c]">
          <span>© 2026 Masonic Academy</span>
          <span className="flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-[#26a69a]" /> Protegido por criptografia
          </span>
        </div>
      </div>
    </div>
  );
}
