import React, { useEffect, useRef } from 'react';
import { X, ShieldAlert, EyeOff, Lock } from 'lucide-react';

interface SecureViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title: string;
}

export default function SecureViewerModal({ isOpen, onClose, url, title }: SecureViewerModalProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Save current body overflow style and lock scroll
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Prevent copy, save, and print keyboard shortcuts while modal is open
    // Also, handle Arrow keys to focus the iframe for direct scrolling
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const isCmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

      // Ctrl+S / Cmd+S (Save)
      if (isCmdOrCtrl && e.key === 's') {
        e.preventDefault();
        alert('O download deste conteúdo está desabilitado por razões de segurança.');
      }
      // Ctrl+P / Cmd+P (Print)
      if (isCmdOrCtrl && e.key === 'p') {
        e.preventDefault();
        alert('A impressão deste conteúdo está desabilitada.');
      }

      // If user presses Arrow keys or Page keys, ensure the iframe is focused
      if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', ' '].includes(e.key)) {
        if (document.activeElement !== iframeRef.current) {
          iframeRef.current?.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Focus the iframe after mounting/loading to enable keyboard scrolling immediately
    const focusTimer = setTimeout(() => {
      iframeRef.current?.focus();
    }, 600);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
      clearTimeout(focusTimer);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Function to process and convert the link if needed (e.g. Google Drive, PDF, etc.)
  const getEmbeddableUrl = (inputUrl: string): { embedUrl: string; useGoogleDocs: boolean } => {
    let cleanUrl = inputUrl.trim();

    // 1. Google Drive link converter
    if (cleanUrl.includes('drive.google.com')) {
      // If it contains /file/d/XYZ/view or /file/d/XYZ/edit or open?id=XYZ
      const fileIdMatch = cleanUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || cleanUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/);
      if (fileIdMatch && fileIdMatch[1]) {
        const fileId = fileIdMatch[1];
        // Convert to Google Drive preview embed url
        return {
          embedUrl: `https://drive.google.com/file/d/${fileId}/preview`,
          useGoogleDocs: false
        };
      }
      const folderIdMatch = cleanUrl.match(/\/drive\/folders\/([a-zA-Z0-9_-]+)/);
      if (folderIdMatch && folderIdMatch[1]) {
        const folderId = folderIdMatch[1];
        return {
          embedUrl: `https://drive.google.com/drive/folders/${folderId}?embed=true`,
          useGoogleDocs: false
        };
      }
    }

    // 2. Google Docs, Sheets, and Slides live files
    if (cleanUrl.includes('docs.google.com')) {
      if (cleanUrl.includes('/document/d/')) {
        const docIdMatch = cleanUrl.match(/\/document\/d\/([a-zA-Z0-9_-]+)/);
        if (docIdMatch && docIdMatch[1]) {
          return {
            embedUrl: `https://docs.google.com/document/d/${docIdMatch[1]}/preview`,
            useGoogleDocs: false
          };
        }
      }
      if (cleanUrl.includes('/spreadsheets/d/')) {
        const sheetIdMatch = cleanUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/);
        if (sheetIdMatch && sheetIdMatch[1]) {
          return {
            embedUrl: `https://docs.google.com/spreadsheets/d/${sheetIdMatch[1]}/preview?widget=true&headers=false`,
            useGoogleDocs: false
          };
        }
      }
      if (cleanUrl.includes('/presentation/d/')) {
        const presIdMatch = cleanUrl.match(/\/presentation\/d\/([a-zA-Z0-9_-]+)/);
        if (presIdMatch && presIdMatch[1]) {
          return {
            embedUrl: `https://docs.google.com/presentation/d/${presIdMatch[1]}/embed`,
            useGoogleDocs: false
          };
        }
      }
    }

    // 3. If it's a PDF, DOCX, XLSX, PPTX, etc., use Google Docs Viewer to avoid exposing raw files and prevent direct download buttons
    const lowerUrl = cleanUrl.toLowerCase();
    const isDocFile = lowerUrl.endsWith('.pdf') || 
                      lowerUrl.endsWith('.docx') || 
                      lowerUrl.endsWith('.doc') || 
                      lowerUrl.endsWith('.xlsx') || 
                      lowerUrl.endsWith('.xls') || 
                      lowerUrl.endsWith('.pptx') || 
                      lowerUrl.endsWith('.ppt') ||
                      lowerUrl.includes('/pdf') ||
                      lowerUrl.includes('.pdf?');

    if (isDocFile && !cleanUrl.includes('drive.google.com')) {
      return {
        embedUrl: `https://docs.google.com/viewer?url=${encodeURIComponent(cleanUrl)}&embedded=true`,
        useGoogleDocs: true
      };
    }

    // 4. Default return
    return {
      embedUrl: cleanUrl,
      useGoogleDocs: false
    };
  };

  const { embedUrl } = getEmbeddableUrl(url);

  return (
    <div 
      className="fixed inset-0 top-0 left-0 w-screen h-screen z-[9999] flex items-center justify-center bg-black/85 backdrop-blur-sm p-2 sm:p-4 animate-fade-in"
      onContextMenu={(e) => e.preventDefault()} // Block right-click on the whole modal container
      onClick={(e) => {
        // If clicking on background backdrop, refocus the iframe so keyboard arrow scrolling is restored
        if (e.target === e.currentTarget) {
          iframeRef.current?.focus();
        }
      }}
    >
      <div 
        className="bg-[#0c1d26] border-2 border-[#1c2c37] rounded-2xl w-full max-w-6xl h-[90vh] flex flex-col shadow-2xl relative overflow-hidden"
        onClick={() => {
          // Clicking anywhere inside the card (except form/buttons etc) will also focus the reader
          iframeRef.current?.focus();
        }}
      >
        
        {/* Security Warning Header Banner */}
        <div className="bg-red-950/40 border-b border-red-500/10 px-4 py-2 flex items-center gap-2 text-red-400 text-xs">
          <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
          <span className="font-mono font-medium tracking-wide">
            Visualização Segura Ativada
          </span>
        </div>

        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-[#1c2c37]/60 flex items-center justify-between bg-[#08151b]" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center gap-3 min-w-0">
            <div className="bg-[#e9c34a]/10 p-2 rounded-lg border border-[#e9c34a]/30">
              <Lock className="w-4 h-4 text-[#e9c34a]" />
            </div>
            <div className="text-left min-w-0">
              <span className="text-[9px] font-mono text-[#99907b] uppercase tracking-wider block">Visualizador Masonic Academy</span>
              <h3 className="font-sans font-bold text-sm text-[#d4e5f1] truncate uppercase" title={title}>
                {title}
              </h3>
            </div>
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="bg-[#11212a] hover:bg-red-950/40 hover:text-red-400 text-[#99907b] border border-[#1c2c37] hover:border-red-900/30 p-2 rounded-xl transition-all cursor-pointer flex items-center justify-center"
            title="Fechar Visualizador"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Viewer Content Frame */}
        <div className="flex-1 bg-[#04141e] relative flex items-center justify-center overflow-hidden">
          
          {/* Subtle protection overlay watermark */}
          <div className="absolute inset-0 pointer-events-none select-none z-10 flex items-center justify-center opacity-[0.03]">
            <div className="text-[#e9c34a] font-sans font-extrabold text-2xl sm:text-3xl rotate-45 uppercase tracking-widest text-center leading-normal">
              protegido por direitos autorais
            </div>
          </div>

          {/* Click blocker for Google Drive & Docs Viewer top-right action buttons (pop-out, download, print) */}
          <div 
            className="absolute top-0 right-0 w-48 h-14 bg-transparent z-20 cursor-not-allowed"
            title="Ações externas desabilitadas nesta visualização protegida"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          />

          <iframe
            ref={iframeRef}
            src={embedUrl}
            title={title}
            className="w-full h-full border-none bg-white"
            loading="lazy"
            onLoad={() => {
              iframeRef.current?.focus();
            }}
          />
        </div>

        {/* Footer info banner */}
        <div className="px-5 py-3 border-t border-[#1c2c37]/60 bg-[#08151b] flex flex-col sm:flex-row items-center justify-between gap-2" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#99907b] text-center sm:text-left">
            <EyeOff className="w-3.5 h-3.5 text-[#e9c34a] shrink-0" />
            <span>Este conteúdo está sendo exibido em um ambiente isolado e protegido contra cópias.</span>
          </div>
          <button
            onClick={onClose}
            className="bg-[#e9c34a]/10 border border-[#e9c34a]/30 hover:bg-[#e9c34a]/20 text-[#f2ca51] font-mono font-bold text-[10px] px-4 py-2 rounded transition-all cursor-pointer uppercase shrink-0"
          >
            Fechar Leitor Protegido
          </button>
        </div>

      </div>
    </div>
  );
}
