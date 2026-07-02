import React from 'react';
import { ExecutiveReport } from '../types';
import { getDegreeLabel } from '../utils/degrees';
import { Calendar, Shield, Image as ImageIcon } from 'lucide-react';
import InlineEditable from './InlineEditable';

interface ReportCardProps {
  report: ExecutiveReport;
  onAccess: (report: ExecutiveReport) => void;
  onEditImageLink: (reportId: string, currentLink: string) => void;
  isAdmin: boolean;
  onUpdateReportField: (reportId: string, field: keyof ExecutiveReport, newValue: any) => void;
  currentUser?: any;
  viewMode?: 'grid' | 'list';
  onBlockedAccess?: (courseTitle: string, requiredLevel: number) => void;
  onOpenSecureViewer?: (url: string, title: string) => void;
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
  onOpenSecureViewer
}) => {
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
    
    if (totalCount > 0) {
      percentage = Math.round((completedCount / totalCount) * 100);
    }
  }

  if (viewMode === 'list') {
    return (
      <div
        id={`report-card-${report.id}`}
        className={`bg-[#0c1d27] rounded-lg overflow-hidden flex flex-col md:flex-row md:items-center justify-between p-4 mb-3.5 shadow-md hover:shadow-lg transition-all duration-200 border border-[#1c2c36]/50 ${getBorderColorClass(
          report.leftBorderColor
        )}`}
      >
        {/* Left Information Section */}
        <div className="flex-1 min-w-0 pr-0 md:pr-4 space-y-2">
          {/* Dept & Title row */}
          <div className="flex items-start justify-between md:justify-start gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="font-mono text-[9px] text-[#E9C349] uppercase tracking-widest font-black block">
                  <InlineEditable
                    value={report.department}
                    isAdmin={isAdmin}
                    onSave={(val) => onUpdateReportField(report.id, 'department', val)}
                    className="font-mono text-[9px] text-[#E9C349] uppercase tracking-widest font-black"
                  />
                </span>
                {report.nivelCurso && (
                  <span className="font-mono text-[9px] text-[#E9C349] bg-[#E9C349]/10 border border-[#E9C349]/25 px-1.5 py-0.2 rounded uppercase tracking-wider font-extrabold flex items-center gap-1 select-none">
                    <Shield className="w-2.5 h-2.5 text-[#26a69a]" /> {getDegreeLabel(report.nivelCurso)}
                  </span>
                )}
              </div>
              <h3 
                className="font-sans font-bold text-base md:text-lg text-[#d4e5f2] leading-tight hover:text-[#f2ca50] transition-colors cursor-pointer text-left" 
                onClick={(e) => {
                  if (report.customAccessUrl) {
                    handleAccessClick(e, true, report.customAccessUrl);
                    if (!e.isDefaultPrevented()) {
                      if (onOpenSecureViewer) {
                        onOpenSecureViewer(report.customAccessUrl, report.title);
                      } else {
                        window.open(report.customAccessUrl, '_blank', 'noopener,noreferrer');
                      }
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
                  className="font-sans font-bold text-base md:text-lg text-[#d4e5f2] leading-tight"
                />
              </h3>
            </div>
          </div>

          {/* Description */}
          <div className="text-left">
            <span className="block text-[9px] font-mono text-[#99907c] uppercase tracking-wider mb-1">Resumo do Conteúdo</span>
            <p className="font-mono italic text-xs text-[#d4e5f2]/80 leading-relaxed bg-[#05151e]/40 p-2.5 rounded border-l border-[#1ea296]/30 text-left">
              <InlineEditable
                value={report.summary}
                isAdmin={isAdmin}
                type="textarea"
                onSave={(val) => onUpdateReportField(report.id, 'summary', val)}
                className="font-mono italic text-xs text-[#d4e5f2]/80 leading-relaxed block"
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
                    className="bg-[#11212b] text-[9px] text-[#99907c] font-mono px-1.5 py-0.5 rounded border border-[#1c2c36]"
                  >
                    #{tag}
                  </span>
                ))}
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-[#99907c] font-mono">
              <Calendar className="w-3.5 h-3.5 text-[#26a69a]" />
              <span>Atu: </span>
              <InlineEditable
                value={report.lastUpdated}
                isAdmin={isAdmin}
                onSave={(val) => onUpdateReportField(report.id, 'lastUpdated', val)}
                className="text-[10px] text-[#99907c] font-mono"
              />
            </div>
          </div>
        </div>

        {/* Middle/Progress Bar for List view */}
        {totalCount > 0 && (
          <div className="w-full md:w-52 mt-3 md:mt-0 p-2.5 bg-[#05151e]/45 rounded-lg border border-[#1c2c36]/40 flex flex-col justify-center gap-1 shrink-0 text-left">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-[#9cbfd5]">Progresso:</span>
              {percentage === 100 ? (
                <span className="text-[#66d9cc] font-black text-[10px] tracking-wide uppercase px-1.5 py-0.2 bg-[#185347]/20 border border-[#1ea296]/30 rounded">
                  Título Concluído
                </span>
              ) : (
                <span className="text-[#E9C349] font-bold">
                  {percentage}%
                </span>
              )}
            </div>
            <div className="w-full bg-[#11212b] rounded-full h-1 overflow-hidden border border-[#1c2c36]">
              <div 
                className={`h-full transition-all duration-500 rounded-full ${
                  percentage === 100 ? 'bg-gradient-to-r from-[#1ea296] to-[#66d9cc]' : 'bg-gradient-to-r from-[#E9C349] to-[#ffe088]'
                }`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        )}

        {/* Right Action Area & Thumbnail Media */}
        <div className="w-full md:w-auto mt-4 md:mt-0 pt-3 md:pt-0 border-t md:border-t-0 border-[#1c2c36]/40 flex flex-col sm:flex-row items-center gap-4 shrink-0 md:pl-4 justify-between md:justify-end">
          <div className="w-full sm:w-auto">
            {report.customAccessUrl ? (
              <a
                id={`access-btn-${report.id}`}
                href={report.customAccessUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  handleAccessClick(e, true, report.customAccessUrl);
                  if (!e.isDefaultPrevented() && onOpenSecureViewer) {
                    e.preventDefault();
                    onOpenSecureViewer(report.customAccessUrl || '', report.title);
                  }
                }}
                className="flex items-center gap-1.5 bg-[#E9C349] font-mono text-center text-xs font-bold text-[#241a00] px-4 py-2 rounded hover:bg-[#ffe088] transition-all transform active:scale-95 shadow-sm w-full md:w-auto justify-center cursor-pointer"
              >
                <span>ACESSAR</span>
              </a>
            ) : (
              <button
                id={`access-btn-${report.id}`}
                onClick={(e) => {
                  handleAccessClick(e, false);
                }}
                className="flex items-center gap-1.5 bg-[#E9C349] font-mono text-center text-xs font-bold text-[#241a00] px-4 py-2 rounded hover:bg-[#ffe088] transition-all transform active:scale-95 shadow-sm w-full md:w-auto justify-center"
              >
                <span>ACESSAR</span>
              </button>
            )}
          </div>

          {report.thumbnailUrl && (
            <img
              src={report.thumbnailUrl}
              alt="Miniatura"
              referrerPolicy="no-referrer"
              className="w-20 h-20 rounded object-cover border border-[#1c2c36]/80 grow-0 shrink-0 shadow-lg"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      id={`report-card-${report.id}`}
      className={`bg-[#0c1d27] rounded-lg overflow-hidden flex flex-col justify-between p-5 mb-5 shadow-md hover:shadow-lg transition-all duration-200 border border-[#1c2c36]/50 ${getBorderColorClass(
        report.leftBorderColor
      )}`}
    >
      <div className="space-y-3">
        {/* Department Header */}
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] text-[#E9C349] uppercase tracking-widest font-black">
            <InlineEditable
              value={report.department}
              isAdmin={isAdmin}
              onSave={(val) => onUpdateReportField(report.id, 'department', val)}
              className="font-mono text-[10px] text-[#E9C349] uppercase tracking-widest font-black"
            />
          </span>
          {report.nivelCurso && (
            <span className="font-mono text-[10px] text-[#E9C349] bg-[#E9C349]/10 border border-[#E9C349]/25 px-2 py-0.5 rounded uppercase tracking-wider font-extrabold flex items-center gap-1 select-none">
              <Shield className="w-3 h-3 text-[#26a69a]" /> {getDegreeLabel(report.nivelCurso)}
            </span>
          )}
        </div>

        {/* Title */}
        <div className="flex items-start gap-3 justify-between">
          <h3 
            className="font-sans font-bold text-lg md:text-xl text-[#d4e5f2] leading-tight hover:text-[#f2ca50] transition-colors cursor-pointer flex-1" 
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
              className="font-sans font-bold text-lg md:text-xl text-[#d4e5f2] leading-tight flex-1"
            />
          </h3>
          {report.thumbnailUrl && (
            <img
              src={report.thumbnailUrl}
              alt="Miniatura"
              referrerPolicy="no-referrer"
              className="w-24 h-24 rounded object-cover border border-[#1c2c36]/80 grow-0 shrink-0 shadow-lg"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          )}
        </div>



        {/* Cursive/Italic summary description exactly matching the screenshot style */}
        <div className="text-left w-full">
          <span className="block text-[10px] font-mono text-[#99907c] uppercase tracking-wider mb-1">Resumo do Conteúdo</span>
          <p className="font-mono italic text-xs text-[#d4e5f2]/80 leading-relaxed bg-[#05151e]/40 p-2.5 rounded border-l-2 border-[#1ea296]/30">
            <InlineEditable
              value={report.summary}
              isAdmin={isAdmin}
              type="textarea"
              onSave={(val) => onUpdateReportField(report.id, 'summary', val)}
              className="font-mono italic text-xs text-[#d4e5f2]/80 leading-relaxed block"
              as="span"
            />
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 pt-1 items-center">
          {report.tags
            .filter(tag => !tag.startsWith('img:'))
            .map((tag, idx) => (
              <span
                key={idx}
                className="bg-[#11212b] text-[10px] text-[#99907c] font-mono px-2 py-0.5 rounded border border-[#1c2c36]"
              >
                #{tag}
              </span>
            ))}
        </div>

        {/* Progress Bar */}
        {totalCount > 0 && (
          <div className="mt-4 bg-[#05151e]/45 p-3 rounded-lg border border-[#1c2c36]/40">
            <div className="flex items-center justify-between mb-1.5 text-xs font-mono">
              <span className="text-[#9cbfd5] font-medium">Progresso:</span>
              {percentage === 100 ? (
                <span className="text-[#66d9cc] font-black text-xs tracking-wide uppercase px-2 py-0.5 bg-[#185347]/20 border border-[#1ea296]/30 rounded">
                  Título Concluído
                </span>
              ) : (
                <span className="text-[#E9C349] font-bold">
                  {percentage}%
                </span>
              )}
            </div>
            <div className="w-full bg-[#11212b] rounded-full h-1.5 overflow-hidden border border-[#1c2c36]">
              <div 
                className={`h-full transition-all duration-500 rounded-full ${
                  percentage === 100 ? 'bg-gradient-to-r from-[#1ea296] to-[#66d9cc]' : 'bg-gradient-to-r from-[#E9C349] to-[#ffe088]'
                }`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Action Area */}
      <div className="flex items-center justify-between pt-5 mt-4 border-t border-[#1c2c36]/40">
        <div className="flex items-center gap-1.5 text-[11px] text-[#99907c] font-mono">
          <Calendar className="w-3.5 h-3.5 text-[#26a69a]" />
          <span>Atu: </span>
          <InlineEditable
            value={report.lastUpdated}
            isAdmin={isAdmin}
            onSave={(val) => onUpdateReportField(report.id, 'lastUpdated', val)}
            className="text-[11px] text-[#99907c] font-mono"
          />
        </div>

        <div className="flex items-center gap-2">
          {report.customAccessUrl ? (
            <a
              id={`access-btn-${report.id}`}
              href={report.customAccessUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                handleAccessClick(e, true, report.customAccessUrl);
                if (!e.isDefaultPrevented() && onOpenSecureViewer) {
                  e.preventDefault();
                  onOpenSecureViewer(report.customAccessUrl || '', report.title);
                }
              }}
              className="flex items-center gap-1.5 bg-[#E9C349] font-mono text-center text-xs font-bold text-[#241a00] px-5 py-2.5 rounded hover:bg-[#ffe088] transition-all transform active:scale-95 shadow-sm cursor-pointer"
            >
              <span>ACESSAR</span>
            </a>
          ) : (
            <button
              id={`access-btn-${report.id}`}
              onClick={(e) => {
                handleAccessClick(e, false);
              }}
              className="flex items-center gap-1.5 bg-[#E9C349] font-mono text-center text-xs font-bold text-[#241a00] px-5 py-2.5 rounded hover:bg-[#ffe088] transition-all transform active:scale-95 shadow-sm"
            >
              <span>ACESSAR</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportCard;
