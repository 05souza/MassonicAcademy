import React from 'react';
import { ExecutiveReport } from '../types';
import { getDegreeLabel } from '../utils/degrees';
import { Calendar, Shield, Image as ImageIcon, Lock } from 'lucide-react';
import InlineEditable from './InlineEditable';
import { isCourseCompleted } from '../utils';

interface ReportCardProps {
  report: ExecutiveReport;
  onAccess: (report: ExecutiveReport) => void;
  onEditImageLink: (reportId: string, currentLink: string) => void;
  isAdmin: boolean;
  onUpdateReportField: (reportId: string, field: keyof ExecutiveReport, newValue: any) => void;
  currentUser?: any;
  viewMode?: 'grid' | 'list';
  onBlockedAccess?: (courseTitle: string, requiredLevel: number) => void;
  onOpenSecureViewer?: (url: string, title: string, htmlContent?: string) => void;
  reports?: ExecutiveReport[];
  hideTrilhaStep?: boolean;
}

export const ReportCard: React.FC<ReportCardProps> = ({ 
  report, 
  onAccess, 
  onEditImageLink,
  isAdmin,
  onUpdateReportField,
  currentUser,
  viewMode = 'grid',
  onBlockedAccess,
  onOpenSecureViewer,
  reports = [],
  hideTrilhaStep = false
}) => {
  const isUserAdmin = isAdmin;
  const prereqCourse = report.prerequisiteId ? reports.find(r => r.id === report.prerequisiteId) : undefined;
  const isPrereqLocked = !isUserAdmin && prereqCourse && !isCourseCompleted(prereqCourse, currentUser?.email || 'guest');

  const getBorderColorClass = (color: string) => {
    switch (color) {
      case 'gold':
        return 'border-l-[6px] border-l-[#E9C349]';
      case 'teal':
        return 'border-l-[6px] border-l-[#66D9CC]';
      case 'blue':
        return 'border-l-[6px] border-l-[#3B82F6]';
      case 'purple':
        return 'border-l-[6px] border-l-[#A855F7]';
      default:
        return 'border-l-[6px] border-l-[#E4C868]';
    }
  };

  // Generic security access checker
  const handleAccessClick = (e: React.MouseEvent, isLink: boolean, targetUrl?: string) => {
    const isUserAdmin = isAdmin;
    const userLevel = currentUser ? parseInt(String(currentUser.nivelAcesso || (isUserAdmin ? '33' : '1')), 10) : 1;
    const courseLevel = report.nivelCurso || 1;

    if (!isUserAdmin && userLevel < courseLevel) {
      e.preventDefault();
      e.stopPropagation();
      if (onBlockedAccess) {
        onBlockedAccess(report.title, courseLevel);
      } else {
        alert("este material ainda não é do seu Grau");
      }
      return;
    }

    const prereqCourse = report.prerequisiteId ? reports.find(r => r.id === report.prerequisiteId) : undefined;
    const isPrereqLocked = !isUserAdmin && prereqCourse && !isCourseCompleted(prereqCourse, currentUser?.email || 'guest');
    if (isPrereqLocked) {
      e.preventDefault();
      e.stopPropagation();
      onAccess(report); // Let the parent's handleAccessCourse trigger the specific prerequisite lock modal
      return;
    }

    if (!isLink) {
      onAccess(report);
    }
  };

  // Calculate completion percentage
  let percentage = 0;
  let totalCount = 0;
  let completedCount = 0;
  
  {
    const emailKey = currentUser?.email || 'guest';
    const saved = localStorage.getItem(`masonic_completed_${emailKey}_${report.id}`);
    const completedMaterials = saved ? JSON.parse(saved) : {};
    
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
    
    if (totalCount > 0) {
      percentage = Math.round((completedCount / totalCount) * 100);
    }
  }

  if (viewMode === 'list') {
    return (
      <div
        id={`report-card-${report.id}`}
        className={`bg-white dark:bg-[#0c1d27] rounded-2xl overflow-hidden flex flex-col md:flex-row md:items-center justify-between p-4 mb-3.5 shadow-sm hover:shadow-md transition-all duration-300 border border-slate-100 dark:border-[#1c2c36]/50 ${getBorderColorClass(
          report.leftBorderColor
        )}`}
      >
        {/* Left Information Section */}
        <div className="flex-1 min-w-0 pr-0 md:pr-4 space-y-2">
          {/* Dept & Title row */}
          <div className="flex items-start justify-between md:justify-start gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className={`font-mono text-[8px] font-extrabold px-1.5 py-0.5 rounded-md uppercase tracking-wider select-none border ${
                  (report.itemType || 'curso') === 'trilha'
                    ? 'bg-[#66D9CC]/10 text-[#66D9CC] border-[#66D9CC]/30'
                    : 'bg-[#E9C349]/10 text-[#E9C349] border-[#E9C349]/30'
                }`}>
                  {(report.itemType || 'curso') === 'trilha' ? '🛣️ Trilha' : '📘 Curso'}
                </span>
                <span className="font-mono text-[9px] text-slate-500 dark:text-[#E9C349] uppercase tracking-widest font-black block">
                  <InlineEditable
                    value={report.department || "Curso"}
                    isAdmin={isAdmin}
                    onSave={(val) => onUpdateReportField(report.id, 'department', val)}
                    className="font-mono text-[9px] text-slate-500 dark:text-[#E9C349] uppercase tracking-widest font-black"
                  />
                </span>
                {report.nivelCurso && (
                  <span className="font-mono text-[8px] text-[#E9C349] bg-[#E9C349]/10 border border-[#E9C349]/25 px-1.5 py-0.5 rounded-md uppercase tracking-wider font-extrabold flex items-center gap-1 select-none">
                    <Shield className="w-2.5 h-2.5 text-[#26a69a]" /> {getDegreeLabel(report.nivelCurso)}
                  </span>
                )}
              </div>
              <h3 
                className="font-sans font-bold text-base md:text-lg text-slate-800 dark:text-[#d4e5f2] leading-tight hover:text-blue-600 dark:hover:text-[#ffe088] transition-colors cursor-pointer text-left" 
                onClick={(e) => handleAccessClick(e, false)}
              >
                <InlineEditable
                  value={report.title}
                  isAdmin={isAdmin}
                  onSave={(val) => onUpdateReportField(report.id, 'title', val)}
                  className="font-sans font-bold text-base md:text-lg text-slate-800 dark:text-[#d4e5f2] leading-tight"
                />
              </h3>
              {prereqCourse && !hideTrilhaStep && (
                <div className="flex items-center gap-1.5 mt-1.5 select-none text-left">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400 dark:text-[#9cbfd5]">Trilha:</span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border flex items-center gap-1 font-bold ${
                    isPrereqLocked 
                      ? 'bg-amber-50 dark:bg-amber-950/35 border-amber-500/25 text-amber-600 dark:text-[#E9C349]' 
                      : 'bg-emerald-50 dark:bg-[#185347]/20 border-emerald-500/20 dark:border-[#1ea296]/20 text-emerald-600 dark:text-[#66d9cc]'
                  }`}>
                    {isPrereqLocked ? <Lock className="w-2.5 h-2.5 text-amber-500" /> : <Shield className="w-2.5 h-2.5 text-emerald-500 dark:text-[#66d9cc]" />}
                    Próxima etapa de: {prereqCourse.title}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="text-left">
            <span className="block text-[9px] font-mono text-slate-400 dark:text-[#99907c] uppercase tracking-wider mb-1">Resumo do Conteúdo</span>
            <p className="font-mono italic text-xs text-slate-600 dark:text-[#d4e5f2]/80 leading-relaxed bg-slate-50 dark:bg-[#05151e]/40 p-2.5 rounded border-l border-slate-300 dark:border-[#1ea296]/30 text-left">
              <InlineEditable
                value={report.summary}
                isAdmin={isAdmin}
                type="textarea"
                onSave={(val) => onUpdateReportField(report.id, 'summary', val)}
                className="font-mono italic text-xs text-slate-600 dark:text-[#d4e5f2]/80 leading-relaxed block"
                as="span"
              />
            </p>
          </div>

          {/* Tags & Progress Side-by-side */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex flex-wrap gap-1">
              {report.tags
                .filter(tag => !tag.startsWith('img:'))
                .map((tag, idx) => (
                  <span
                    key={idx}
                    className="bg-slate-100 dark:bg-[#11212b] text-[9px] text-slate-500 dark:text-[#99907c] font-mono px-1.5 py-0.5 rounded border border-slate-200 dark:border-[#1c2c36]"
                  >
                    #{tag}
                  </span>
                ))}
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 dark:text-[#99907c] font-mono">
              <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-[#26a69a]" />
              <span>Atu: </span>
              <InlineEditable
                value={report.lastUpdated}
                isAdmin={isAdmin}
                onSave={(val) => onUpdateReportField(report.id, 'lastUpdated', val)}
                className="text-[10px] text-slate-500 dark:text-[#99907c] font-mono"
              />
            </div>
          </div>
        </div>

        {/* Middle/Progress Bar for List view */}
        {totalCount > 0 && (
          <div className="w-full md:w-52 mt-3 md:mt-0 p-2.5 bg-slate-50 dark:bg-[#05151e]/45 rounded-lg border border-slate-200/60 dark:border-[#1c2c36]/40 flex flex-col justify-center gap-1 shrink-0 text-left">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-500 dark:text-[#9cbfd5]">Progresso:</span>
              {percentage === 100 ? (
                <span className="text-emerald-600 dark:text-[#66d9cc] font-black text-[10px] tracking-wide uppercase px-1.5 py-0.2 bg-emerald-50 dark:bg-[#185347]/20 border border-emerald-500/20 dark:border-[#1ea296]/30 rounded">
                  Título Concluído
                </span>
              ) : (
                <span className="text-amber-600 dark:text-[#E9C349] font-bold">
                  {percentage}%
                </span>
              )}
            </div>
            <div className="w-full bg-slate-100 dark:bg-[#11212b] rounded-full h-1 overflow-hidden border border-slate-200 dark:border-[#1c2c36]">
              <div 
                className={`h-full transition-all duration-500 rounded-full ${
                  percentage === 100 ? 'bg-gradient-to-r from-emerald-500 to-emerald-400 dark:from-[#1ea296] dark:to-[#66d9cc]' : 'bg-gradient-to-r from-amber-500 to-amber-400 dark:from-[#E9C349] dark:to-[#ffe088]'
                }`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        )}

        {/* Right Action Area & Thumbnail Media */}
        <div className="w-full md:w-auto mt-4 md:mt-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-[#1c2c36]/40 flex flex-col sm:flex-row items-center gap-4 shrink-0 md:pl-4 justify-between md:justify-end">
          <div className="w-full sm:w-auto">
            {isPrereqLocked ? (
              <button
                id={`access-btn-${report.id}`}
                onClick={(e) => {
                  handleAccessClick(e, false);
                }}
                className="flex items-center gap-1.5 bg-slate-100 dark:bg-[#11212b]/80 border border-amber-500/30 text-amber-600 dark:text-amber-500 font-mono text-center text-xs font-bold px-4 py-2 rounded-xl hover:border-[#E9C349] hover:text-[#E9C349] transition-all transform active:scale-95 shadow-sm w-full md:w-auto justify-center cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-amber-500" />
                <span>BLOQUEADO</span>
              </button>
            ) : (
              <button
                id={`access-btn-${report.id}`}
                onClick={(e) => {
                  handleAccessClick(e, false);
                }}
                className="flex items-center gap-1.5 border border-blue-500/30 text-blue-600 hover:bg-blue-50/40 dark:border-[#E9C349]/40 dark:text-[#E9C349] dark:hover:bg-[#E9C349]/10 font-mono text-center text-xs font-bold px-5 py-2 rounded-xl transition-all transform active:scale-95 shadow-sm w-full md:w-auto justify-center cursor-pointer uppercase tracking-wider"
              >
                <span>DETALHES</span>
              </button>
            )}
          </div>

          {report.thumbnailUrl && (
            <img
              src={report.thumbnailUrl}
              alt="Miniatura"
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-xl object-cover border border-slate-200 dark:border-[#1c2c36]/80 grow-0 shrink-0 shadow-sm"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          )}
        </div>
      </div>
    );
  }

  const getBannerGradient = (color: string) => {
    switch (color) {
      case 'gold':
        return 'from-[#fef08a] via-[#fef9c3]/50 to-white dark:from-[#E9C349]/20 dark:via-[#E9C349]/5 dark:to-[#0c1d27]';
      case 'teal':
        return 'from-[#ccfbf1] via-[#f0fdfa]/50 to-white dark:from-[#66D9CC]/20 dark:via-[#66D9CC]/5 dark:to-[#0c1d27]';
      case 'blue':
        return 'from-[#dbeafe] via-[#eff6ff]/50 to-white dark:from-[#3B82F6]/20 dark:via-[#3B82F6]/5 dark:to-[#0c1d27]';
      case 'purple':
        return 'from-[#f3e8ff] via-[#faf5ff]/50 to-white dark:from-[#A855F7]/20 dark:via-[#A855F7]/5 dark:to-[#0c1d27]';
      default:
        return 'from-[#fef08a] via-[#fef9c3]/50 to-white dark:from-[#E4C868]/20 dark:via-[#E4C868]/5 dark:to-[#0c1d27]';
    }
  };

  return (
    <div
      id={`report-card-${report.id}`}
      className="bg-white dark:bg-[#0c1d27] rounded-2xl overflow-hidden flex flex-col justify-between hover:shadow-xl hover:border-slate-300 dark:hover:border-[#1ea296]/45 transition-all duration-300 border border-slate-100 dark:border-[#1c2c36]/50 relative group mb-5"
    >
      {/* Top Banner Cover - Full Cover Image */}
      <div className="relative h-40 w-full bg-slate-100 dark:bg-[#081721] overflow-hidden flex items-center justify-center">
        {report.thumbnailUrl ? (
          <img 
            src={report.thumbnailUrl} 
            alt={report.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-b ${getBannerGradient(report.leftBorderColor)} flex items-center justify-center`}>
            <ImageIcon className="w-10 h-10 text-[#99907c]/40" />
          </div>
        )}
      </div>

      {/* Course Body Info - compact spacing */}
      <div className="pt-3.5 p-3.5 flex-1 flex flex-col justify-between text-center space-y-2">
        <div className="space-y-1">
          {/* Category/Department */}
          <span className="font-mono text-[8px] text-slate-400 dark:text-[#99907c] uppercase tracking-widest font-black block text-center">
            <InlineEditable
              value={report.department || "Curso online"}
              isAdmin={isAdmin}
              onSave={(val) => onUpdateReportField(report.id, 'department', val)}
              className="font-mono text-[8px] text-slate-400 dark:text-[#99907c] uppercase tracking-widest font-black text-center block"
            />
          </span>

          {/* Centered Title with consistent height constraint */}
          <h3 
            className="font-sans font-bold text-xs sm:text-sm text-slate-800 dark:text-[#d4e5f2] leading-snug hover:text-blue-600 dark:hover:text-[#ffe088] transition-colors cursor-pointer text-center flex items-center justify-center h-10 line-clamp-2 px-1 overflow-hidden"
            onClick={(e) => {
              if (report.customAccessUrl) {
                handleAccessClick(e, true, report.customAccessUrl);
                if (!e.isDefaultPrevented()) {
                  window.open(report.customAccessUrl, '_blank', 'noopener,noreferrer');
                }
              } else {
                handleAccessClick(e, false);
              }
            }}
          >
            <InlineEditable
              value={report.title}
              isAdmin={isAdmin}
              onSave={(val) => onUpdateReportField(report.id, 'title', val)}
              className="font-sans font-bold text-xs sm:text-sm text-slate-800 dark:text-[#d4e5f2] leading-snug text-center line-clamp-2 block"
            />
          </h3>

          {/* Degree Badge below Title */}
          <div className="flex items-center justify-center gap-1.5 flex-wrap select-none text-center pt-0.5">
            <span className={`font-mono text-[8px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider border ${
              (report.itemType || 'curso') === 'trilha'
                ? 'bg-[#66D9CC]/10 text-[#66D9CC] border-[#66D9CC]/30'
                : 'bg-[#E9C349]/10 text-[#E9C349] border-[#E9C349]/30'
            }`}>
              {(report.itemType || 'curso') === 'trilha' ? '🛣️ Trilha' : '📘 Curso'}
            </span>
            {report.nivelCurso && (
              <span className="font-mono text-[8px] font-extrabold text-[#E9C349] dark:text-[#ffe088] bg-[#E9C349]/10 border border-[#E9C349]/20 px-1.5 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
                <Shield className="w-2.5 h-2.5 text-[#26a69a]" />
                {getDegreeLabel(report.nivelCurso)}
              </span>
            )}
          </div>

          {/* Prerequisite label if applicable */}
          {prereqCourse && !hideTrilhaStep && (
            <div className="flex items-center justify-center gap-1 select-none text-center pt-0.5">
              <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded border flex items-center gap-0.5 font-bold ${
                isPrereqLocked 
                  ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-500/20 text-amber-600 dark:text-[#E9C349]' 
                  : 'bg-emerald-50 dark:bg-[#185347]/10 border-emerald-500/10 dark:border-[#1ea296]/10 text-emerald-600 dark:text-[#66d9cc]'
              }`}>
                {isPrereqLocked ? <Lock className="w-2 h-2 text-amber-500" /> : <Shield className="w-2 h-2 text-emerald-500 dark:text-[#66d9cc]" />}
                Requer: {prereqCourse.title.length > 15 ? `${prereqCourse.title.substring(0, 15)}...` : prereqCourse.title}
              </span>
            </div>
          )}
        </div>

        {/* Minimalist Progress Bar */}
        {totalCount > 0 && (
          <div className="w-full bg-slate-50 dark:bg-[#05151e]/30 px-2 py-0.5 rounded-md border border-slate-200/40 dark:border-[#1c2c36]/20 mt-1">
            <div className="flex items-center justify-between text-[8px] font-mono text-slate-400 dark:text-[#99907c] mb-0.5">
              <span>Progresso:</span>
              <span className={percentage === 100 ? 'text-emerald-500 dark:text-[#66d9cc] font-bold' : 'text-amber-500 dark:text-[#E9C349] font-bold'}>{percentage}%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-[#11212b] rounded-full h-1 overflow-hidden border border-slate-200/40 dark:border-[#1c2c36]/50">
              <div 
                className={`h-full transition-all duration-500 rounded-full ${
                  percentage === 100 ? 'bg-gradient-to-r from-emerald-500 to-emerald-400 dark:from-[#1ea296] dark:to-[#66d9cc]' : 'bg-gradient-to-r from-amber-500 to-amber-400 dark:from-[#E9C349] dark:to-[#ffe088]'
                }`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Action Footer Button Area - more compact */}
      <div className="p-3 pt-0 mt-auto border-t border-slate-100 dark:border-[#1c2c36]/30 flex items-center justify-center gap-2">
        {isPrereqLocked ? (
          <button
            id={`access-btn-${report.id}`}
            onClick={(e) => handleAccessClick(e, false)}
            className="w-full flex items-center justify-center gap-1 bg-slate-50 dark:bg-[#11212b] border border-amber-500/20 text-amber-600 dark:text-amber-500/80 font-mono text-center text-[10px] sm:text-xs font-bold py-2 rounded-xl hover:border-amber-500 transition-all transform active:scale-95 cursor-pointer"
          >
            <Lock className="w-3 h-3 text-amber-500" />
            <span>BLOQUEADO</span>
          </button>
        ) : (
          <button
            id={`access-btn-${report.id}`}
            onClick={(e) => handleAccessClick(e, false)}
            className="w-full flex items-center justify-center border border-blue-500/30 text-blue-600 hover:bg-blue-50/40 dark:border-[#E9C349]/40 dark:text-[#E9C349] dark:hover:bg-[#E9C349]/10 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer text-center font-sans uppercase tracking-wider"
          >
            <span>DETALHES</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ReportCard;
