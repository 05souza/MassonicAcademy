import React, { useState, useRef, useEffect } from 'react';
import { X, Printer, Award, ShieldCheck, Upload, RotateCcw, Sliders, Type, Image as ImageIcon, Eye, EyeOff } from 'lucide-react';
import { compressImage } from '../utils';

export interface CertificateData {
  recipientName: string;
  title: string;
  type: 'course' | 'quiz';
  date: string;
  score?: string;
  lodgeName?: string;
  grade?: string;
}

interface CertificateModalProps {
  certificate: CertificateData | null;
  onClose: () => void;
  isAdmin?: boolean;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ certificate, onClose, isAdmin = false }) => {
  const certificateRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Layout and Customization State loaded from localStorage if exists
  const [customBg, setCustomBg] = useState<string | null>(() => {
    return localStorage.getItem('masonic_cert_custom_bg') || null;
  });
  const [showMasonicSymbols, setShowMasonicSymbols] = useState<boolean>(() => {
    const val = localStorage.getItem('masonic_cert_show_symbols');
    return val !== null ? val === 'true' : true;
  });
  const [symbolsOpacity, setSymbolsOpacity] = useState<number>(() => {
    const val = localStorage.getItem('masonic_cert_symbols_opacity');
    return val !== null ? parseFloat(val) : 0.25;
  });
  const [showSeal, setShowSeal] = useState<boolean>(() => {
    const val = localStorage.getItem('masonic_cert_show_seal');
    return val !== null ? val === 'true' : true;
  });
  const [fontSizeMultiplier, setFontSizeMultiplier] = useState<number>(() => {
    const val = localStorage.getItem('masonic_cert_font_size_multiplier');
    return val !== null ? parseFloat(val) : 1.0;
  });
  const [textColor, setTextColor] = useState<string>(() => {
    return localStorage.getItem('masonic_cert_text_color') || '#11212b';
  });
  const [masonicAcademyName, setMasonicAcademyName] = useState<string>(() => {
    return localStorage.getItem('masonic_cert_academy_name') || 'MASONIC ACADEMY';
  });
  const [certificateHeading, setCertificateHeading] = useState<string>(() => {
    return localStorage.getItem('masonic_cert_heading') || 'Certificado de Conclusão';
  });
  const [directorName, setDirectorName] = useState<string>(() => {
    return localStorage.getItem('masonic_cert_director_name') || 'Daniel Luciano';
  });
  const [directorTitle, setDirectorTitle] = useState<string>(() => {
    return localStorage.getItem('masonic_cert_director_title') || 'Diretor Acadêmico';
  });
  const [internalPadding, setInternalPadding] = useState<string>(() => {
    return localStorage.getItem('masonic_cert_internal_padding') || 'p-8';
  });

  const [isCompacting, setIsCompacting] = useState(false);

  // Persist configurations to localStorage
  useEffect(() => {
    if (customBg) {
      try {
        localStorage.setItem('masonic_cert_custom_bg', customBg);
      } catch (e) {
        console.error('Falha ao salvar no localStorage (limite excedido?):', e);
      }
    } else {
      localStorage.removeItem('masonic_cert_custom_bg');
    }
  }, [customBg]);

  useEffect(() => {
    localStorage.setItem('masonic_cert_show_symbols', String(showMasonicSymbols));
  }, [showMasonicSymbols]);

  useEffect(() => {
    localStorage.setItem('masonic_cert_symbols_opacity', String(symbolsOpacity));
  }, [symbolsOpacity]);

  useEffect(() => {
    localStorage.setItem('masonic_cert_show_seal', String(showSeal));
  }, [showSeal]);

  useEffect(() => {
    localStorage.setItem('masonic_cert_font_size_multiplier', String(fontSizeMultiplier));
  }, [fontSizeMultiplier]);

  useEffect(() => {
    localStorage.setItem('masonic_cert_text_color', textColor);
  }, [textColor]);

  useEffect(() => {
    localStorage.setItem('masonic_cert_academy_name', masonicAcademyName);
  }, [masonicAcademyName]);

  useEffect(() => {
    localStorage.setItem('masonic_cert_heading', certificateHeading);
  }, [certificateHeading]);

  useEffect(() => {
    localStorage.setItem('masonic_cert_director_name', directorName);
  }, [directorName]);

  useEffect(() => {
    localStorage.setItem('masonic_cert_director_title', directorTitle);
  }, [directorTitle]);

  useEffect(() => {
    localStorage.setItem('masonic_cert_internal_padding', internalPadding);
  }, [internalPadding]);

  if (!certificate) return null;

  // Generate a consistent verification code based on name and title
  const generateVerificationCode = (name: string, title: string) => {
    let hash = 0;
    const combined = `${name}-${title}`;
    for (let i = 0; i < combined.length; i++) {
      hash = combined.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hex = Math.abs(hash).toString(16).toUpperCase().padStart(8, '0');
    return `MA-CERT-${hex.substring(0, 4)}-${hex.substring(4, 8)}`;
  };

  const verificationCode = generateVerificationCode(certificate.recipientName, certificate.title);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsCompacting(true);
      const reader = new FileReader();
      reader.onloadend = async () => {
        const rawBase64 = reader.result as string;
        try {
          // Compress background to prevent localStorage quota exceeded issues
          const compressed = await compressImage(rawBase64, 1000, 700, 0.7);
          setCustomBg(compressed);
        } catch (err) {
          console.error('Erro comprimindo imagem:', err);
          setCustomBg(rawBase64); // Fallback to raw base64 if compression fails
        } finally {
          setIsCompacting(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetLayout = () => {
    if (window.confirm('Deseja realmente restaurar as configurações padrão de layout e textos?')) {
      setCustomBg(null);
      setShowMasonicSymbols(true);
      setSymbolsOpacity(0.25);
      setShowSeal(true);
      setFontSizeMultiplier(1.0);
      setTextColor('#11212b');
      setMasonicAcademyName('MASONIC ACADEMY');
      setCertificateHeading('Certificado de Conclusão');
      setDirectorName('Daniel Luciano');
      setDirectorTitle('Diretor Acadêmico');
      setInternalPadding('p-8');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Convert tailwind padding to CSS value for printing
  const getPaddingStyleVal = (p: string) => {
    if (p === 'p-6') return '24px';
    if (p === 'p-12') return '48px';
    return '32px'; // p-8 default
  };

  const handlePrint = () => {
    const printContent = certificateRef.current?.innerHTML;
    if (!printContent) return;

    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.bottom = '0';
    iframe.style.right = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = 'none';
    iframe.style.visibility = 'hidden';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document || iframe.contentDocument;
    if (doc) {
      doc.open();
      doc.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Certificado - ${certificate.recipientName}</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
              @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700&family=Great+Vibes&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@400;500;600&family=JetBrains+Mono&display=swap');
              
              body {
                margin: 0;
                padding: 0;
                background: white;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
                font-family: 'Playfair Display', serif;
              }
              @page {
                size: landscape;
                margin: 0;
              }
              .print-container {
                width: 100vw;
                height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                box-sizing: border-box;
                padding: 20px;
                background: #fdfbf7;
              }
            </style>
          </head>
          <body>
            <div class="print-container">
              ${printContent}
            </div>
            <script>
              window.onload = function() {
                setTimeout(function() {
                  window.focus();
                  window.print();
                }, 300);
              };
            </script>
          </body>
        </html>
      `);
      doc.close();

      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 10000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="bg-[#0b141a] border border-[#1c2c36] rounded-2xl w-full max-w-7xl shadow-2xl overflow-hidden font-sans my-4 flex flex-col">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#0d1c24] border-b border-[#1c2c36] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <Award className="w-5 h-5 text-[#E9C349]" />
            <div>
              <h3 className="font-sans font-bold text-sm text-[#d4e5f2] uppercase tracking-wider">
                {isAdmin ? 'Masonic Academy - Layout Studio & Diploma' : 'Masonic Academy - Certificado Oficial'}
              </h3>
              <p className="text-[10px] text-[#99907c] font-mono">
                {certificate.type === 'course' ? 'Conclusão de Curso de Instrução' : 'Aprovação em Questionário Oficial'}
                {isAdmin && <span className="text-[#E9C349] ml-1.5">• Modo Administrador Ativo</span>}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#99907c] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Section: Customizer Grid */}
        <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-[#1c2c36] bg-[#040c11] overflow-y-auto max-h-[calc(100vh-180px)]">
          
          {/* LEFT: Customizer Panel (Admin Only) */}
          {isAdmin ? (
            <div className="w-full lg:w-[350px] shrink-0 p-5 bg-[#0d1c24]/50 space-y-5 overflow-y-auto">
              
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Sliders className="w-4 h-4 text-[#E9C349]" />
                  <span className="text-[11px] font-sans font-black text-[#d4e5f2] uppercase tracking-wider">
                    Layout & Símbolos
                  </span>
                </div>
                
                <div className="space-y-4 bg-[#08151c] p-4 rounded-xl border border-[#172731]">
                  {/* Background Upload */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-[#9cbfd5] uppercase block">
                      Fundo Customizado (Diploma)
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isCompacting}
                        className="flex-1 bg-[#11212b] border border-[#1c2c36] hover:border-[#E9C349]/50 text-white text-xs px-3 py-2 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                      >
                        <Upload className="w-3.5 h-3.5 text-[#E9C349]" />
                        <span>{isCompacting ? 'Comprimindo...' : (customBg ? 'Alterar Imagem' : 'Subir Imagem')}</span>
                      </button>
                      {customBg && (
                        <button
                          onClick={() => {
                            setCustomBg(null);
                            if (fileInputRef.current) fileInputRef.current.value = '';
                          }}
                          className="bg-red-950/30 hover:bg-red-900/40 text-red-400 border border-red-900/50 p-2 rounded-lg text-xs transition-colors cursor-pointer"
                          title="Remover Fundo"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <p className="text-[9px] text-[#99907c] font-mono leading-tight">
                      * Imagem landscape para o fundo. Ela é comprimida para carregar rapidamente para todos os alunos.
                    </p>
                  </div>

                  {/* Masonic Symbols Check and Opacity */}
                  <div className="space-y-2 pt-2 border-t border-[#172731]/60">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-mono text-[#9cbfd5] uppercase block">
                        Elementos Maçônicos
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowMasonicSymbols(!showMasonicSymbols)}
                        className="text-[#99907c] hover:text-white transition-colors"
                      >
                        {showMasonicSymbols ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                    </div>
                    
                    {showMasonicSymbols && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-[9px] font-mono text-[#99907c]">
                          <span>Opacidade dos Símbolos</span>
                          <span>{Math.round(symbolsOpacity * 100)}%</span>
                        </div>
                        <input
                          type="range"
                          min="0.05"
                          max="0.8"
                          step="0.05"
                          value={symbolsOpacity}
                          onChange={(e) => setSymbolsOpacity(parseFloat(e.target.value))}
                          className="w-full accent-[#E9C349] h-1 bg-[#11212b] rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                    )}
                    <p className="text-[8.5px] text-[#99907c] font-mono leading-tight">
                      Desenhos sobrepostos: Acácia, Colunas, Olho, Esquadro/Compasso, Malho/Cinzel.
                    </p>
                  </div>

                  {/* Show Seal */}
                  <div className="flex items-center justify-between pt-2 border-t border-[#172731]/60 text-xs">
                    <span className="text-[10px] font-mono text-[#9cbfd5] uppercase">Selo de Autenticidade</span>
                    <input
                      type="checkbox"
                      checked={showSeal}
                      onChange={(e) => setShowSeal(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-[#E9C349] focus:ring-[#E9C349] accent-[#E9C349]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Type className="w-4 h-4 text-[#E9C349]" />
                  <span className="text-[11px] font-sans font-black text-[#d4e5f2] uppercase tracking-wider">
                    Textos do Certificado
                  </span>
                </div>
                
                <div className="space-y-3 bg-[#08151c] p-4 rounded-xl border border-[#172731]">
                  {/* Organization title */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono text-[#9cbfd5] uppercase">Cabeçalho Institucional</label>
                    <input
                      type="text"
                      value={masonicAcademyName}
                      onChange={(e) => setMasonicAcademyName(e.target.value)}
                      className="w-full bg-[#11212b] border border-[#1c2c36] text-xs text-white p-2 rounded-lg focus:outline-none focus:border-[#E9C349]"
                    />
                  </div>

                  {/* Header Title */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono text-[#9cbfd5] uppercase">Título do Diploma</label>
                    <input
                      type="text"
                      value={certificateHeading}
                      onChange={(e) => setCertificateHeading(e.target.value)}
                      className="w-full bg-[#11212b] border border-[#1c2c36] text-xs text-white p-2 rounded-lg focus:outline-none focus:border-[#E9C349]"
                    />
                  </div>

                  {/* Director Name */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono text-[#9cbfd5] uppercase">Nome do Assinante</label>
                    <input
                      type="text"
                      value={directorName}
                      onChange={(e) => setDirectorName(e.target.value)}
                      className="w-full bg-[#11212b] border border-[#1c2c36] text-xs text-white p-2 rounded-lg focus:outline-none focus:border-[#E9C349]"
                    />
                  </div>

                  {/* Director Title */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono text-[#9cbfd5] uppercase">Cargo do Assinante</label>
                    <input
                      type="text"
                      value={directorTitle}
                      onChange={(e) => setDirectorTitle(e.target.value)}
                      className="w-full bg-[#11212b] border border-[#1c2c36] text-xs text-white p-2 rounded-lg focus:outline-none focus:border-[#E9C349]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <ImageIcon className="w-4 h-4 text-[#E9C349]" />
                  <span className="text-[11px] font-sans font-black text-[#d4e5f2] uppercase tracking-wider">
                    Dimensionamento
                  </span>
                </div>
                
                <div className="space-y-3 bg-[#08151c] p-4 rounded-xl border border-[#172731]">
                  {/* Font Size Multiplier */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[9px] font-mono text-[#9cbfd5] uppercase">
                      <span>Escala das Fontes</span>
                      <span className="text-white">{Math.round(fontSizeMultiplier * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.8"
                      max="1.25"
                      step="0.05"
                      value={fontSizeMultiplier}
                      onChange={(e) => setFontSizeMultiplier(parseFloat(e.target.value))}
                      className="w-full accent-[#E9C349] h-1 bg-[#11212b] rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  {/* Text Color preset picker */}
                  <div className="space-y-1.5 pt-2 border-t border-[#172731]/60">
                    <label className="text-[9px] font-mono text-[#9cbfd5] uppercase block">Cor dos Textos</label>
                    <div className="flex gap-2">
                      {[
                        { color: '#11212b', label: 'Slate' },
                        { color: '#000000', label: 'Black' },
                        { color: '#451a03', label: 'Brown' },
                        { color: '#854d0e', label: 'Gold' }
                      ].map((item) => (
                        <button
                          key={item.color}
                          type="button"
                          onClick={() => setTextColor(item.color)}
                          className={`flex-1 text-[9px] font-mono py-1 rounded border transition-all cursor-pointer ${
                            textColor === item.color
                              ? 'border-[#E9C349] bg-[#E9C349]/10 text-white font-bold'
                              : 'border-[#1c2c36] bg-[#11212b] text-[#99907c]'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Margins/Padding selection */}
                  <div className="space-y-1.5 pt-2 border-t border-[#172731]/60">
                    <label className="text-[9px] font-mono text-[#9cbfd5] uppercase block">Margem Interna</label>
                    <div className="flex gap-2">
                      {[
                        { value: 'p-6', label: 'Estreita' },
                        { value: 'p-8', label: 'Padrão' },
                        { value: 'p-12', label: 'Larga' }
                      ].map((item) => (
                        <button
                          key={item.value}
                          type="button"
                          onClick={() => setInternalPadding(item.value)}
                          className={`flex-1 text-[9px] font-mono py-1 rounded border transition-all cursor-pointer ${
                            internalPadding === item.value
                              ? 'border-[#E9C349] bg-[#E9C349]/10 text-white font-bold'
                              : 'border-[#1c2c36] bg-[#11212b] text-[#99907c]'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleResetLayout}
                className="w-full bg-transparent hover:bg-white/5 border border-[#1c2c36] hover:border-white/20 text-[#99907c] hover:text-white text-xs font-mono py-2 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restaurar Padrão</span>
              </button>

            </div>
          ) : null}

          {/* RIGHT/CENTER: Live Interactive Preview */}
          <div className="flex-1 p-6 bg-[#040c11] flex items-center justify-center overflow-x-auto min-h-[450px] md:min-h-[600px]">
            <div 
              className="shrink-0 w-[900px] h-[636px] bg-[#fdfbf7] border-[16px] double border-[#d4af37] text-slate-800 flex flex-col justify-between relative shadow-2xl select-none rounded text-center transition-all"
              style={{
                backgroundImage: customBg ? `url(${customBg})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                padding: getPaddingStyleVal(internalPadding)
              }}
            >
              
              {/* Elegant Background Border Filigrees */}
              <div className="absolute inset-2 border border-[#d4af37]/30 pointer-events-none" />
              
              {/* Standard Masonic Vector Art Overlays */}
              {showMasonicSymbols && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none select-none" viewBox="0 0 900 636" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Left Column (Boaz) */}
                  <g stroke="#d4af37" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" opacity={symbolsOpacity}>
                    <path d="M 50 110 L 90 110 M 45 116 L 95 116 M 55 122 L 85 122" />
                    <rect x="58" y="122" width="24" height="8" rx="1" fill="none" />
                    <circle cx="70" cy="100" r="10" fill="none" />
                    <line x1="62" y1="130" x2="62" y2="480" />
                    <line x1="70" y1="130" x2="70" y2="480" />
                    <line x1="78" y1="130" x2="78" y2="480" />
                    <rect x="55" y="480" width="30" height="12" rx="1" fill="none" />
                    <path d="M 45 492 L 95 492 M 40 498 L 100 498" />
                  </g>

                  {/* Right Column (Jachin) */}
                  <g stroke="#d4af37" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" opacity={symbolsOpacity}>
                    <path d="M 810 110 L 850 110 M 805 116 L 855 116 M 815 122 L 845 122" />
                    <rect x="818" y="122" width="24" height="8" rx="1" fill="none" />
                    <circle cx="830" cy="100" r="10" fill="none" />
                    <line x1="822" y1="130" x2="822" y2="480" />
                    <line x1="830" y1="130" x2="830" y2="480" />
                    <line x1="838" y1="130" x2="838" y2="480" />
                    <rect x="815" y="480" width="30" height="12" rx="1" fill="none" />
                    <path d="M 805 492 L 855 492 M 800 498 L 860 498" />
                  </g>

                  {/* Eye of Providence (Olho que tudo vê) */}
                  <g stroke="#d4af37" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" opacity={symbolsOpacity + 0.03} transform="translate(450, 48)">
                    <polygon points="0,-25 -30,22 30,22" fill="none" />
                    <path d="M -12,6 Q 0,-6 12,6 Q 0,16 -12,6 Z" fill="none" />
                    <circle cx="0" cy="6" r="4.5" fill="none" />
                    <circle cx="0" cy="6" r="1.5" fill="#d4af37" />
                    <line x1="0" y1="-32" x2="0" y2="-28" />
                    <line x1="-22" y1="-22" x2="-18" y2="-18" />
                    <line x1="22" y1="-22" x2="18" y2="-18" />
                    <line x1="-32" y1="5" x2="-26" y2="5" />
                    <line x1="32" y1="5" x2="26" y2="5" />
                    <line x1="-20" y1="30" x2="-16" y2="24" />
                    <line x1="20" y1="30" x2="16" y2="24" />
                  </g>

                  {/* Square and Compass (Esquadro e Compasso) with Acacia (Acácia) inside and Letter G */}
                  <g stroke="#d4af37" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" opacity={symbolsOpacity * 0.7} transform="translate(450, 315) scale(0.9)">
                    <path d="M 0,-110 L -65,55" />
                    <path d="M 0,-110 L 65,55" />
                    <circle cx="0" cy="-110" r="12" fill="none" />
                    <circle cx="0" cy="-110" r="4" fill="#d4af37" />
                    <path d="M -50,40 A 110,110 0 0,0 50,40" fill="none" />
                    <path d="M -85,-15 L 0,70 L 85,-15 L 60,-40 L 0,20 L -60,-40 Z" fill="none" />
                    
                    <g transform="translate(0, -15) scale(0.75)">
                      <path d="M 0,35 Q -10,10 0,-25" fill="none" />
                      <path d="M -2,22 Q -12,18 -10,10 Q -2,15 -2,22" fill="none" />
                      <path d="M -1,5 Q -12,3 -11,-5 Q -1,-1 -1,5" fill="none" />
                      <path d="M 0,-12 Q -10,-15 -8,-22 Q 0,-16 0,-12" fill="none" />
                      <path d="M 2,22 Q 12,18 10,10 Q 2,15 2,22" fill="none" />
                      <path d="M 1,5 Q 12,3 11,-5 Q 1,1 1,5" fill="none" />
                      <path d="M 0,-12 Q 10,-15 8,-22 Q 0,-16 0,-12" fill="none" />
                    </g>
                    <text x="-9" y="11" fontFamily="'Cinzel', serif" fontWeight="bold" fontSize="36" fill="#d4af37" stroke="none" opacity={0.8}>G</text>
                  </g>

                  {/* Mallet and Chisel (Malho e Cinzel) */}
                  <g stroke="#d4af37" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" opacity={symbolsOpacity * 0.8} transform="translate(130, 520) scale(0.7)">
                    <g transform="rotate(-30)">
                      <rect x="-8" y="-35" width="16" height="24" rx="2" fill="none" />
                      <line x1="0" y1="-11" x2="0" y2="25" />
                    </g>
                    <g transform="rotate(30)">
                      <rect x="-3" y="-35" width="6" height="50" rx="1" fill="none" />
                      <path d="M -5,-35 L 5,-35" />
                      <path d="M -3,15 L 0,25 L 3,15 Z" fill="none" />
                    </g>
                  </g>

                  {/* Acacia Branches (Acácia) flanking bottom right */}
                  <g stroke="#d4af37" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" opacity={symbolsOpacity * 0.9} transform="translate(770, 520) scale(0.7) rotate(20)">
                    <path d="M -20,20 Q 10,-10 30,-40" fill="none" />
                    <path d="M -12,14 Q -22,8 -16,0 Q -8,6 -12,14" fill="none" />
                    <path d="M 0,2 Q -10,-4 -4,-12 Q 4,-6 0,2" fill="none" />
                    <path d="M 12,-10 Q 2,-16 8,-24 Q 16,-18 12,-10" fill="none" />
                    <path d="M -3,11 Q 12,5 6,-3" fill="none" />
                    <path d="M 9,-1 Q 24,-7 18,-15" fill="none" />
                  </g>
                </svg>
              )}
              
              {/* Corners Decorative */}
              <div className="absolute top-4 left-4 w-10 h-10 border-t-2 border-l-2 border-[#d4af37] pointer-events-none" />
              <div className="absolute top-4 right-4 w-10 h-10 border-t-2 border-r-2 border-[#d4af37] pointer-events-none" />
              <div className="absolute bottom-4 left-4 w-10 h-10 border-b-2 border-l-2 border-[#d4af37] pointer-events-none" />
              <div className="absolute bottom-4 right-4 w-10 h-10 border-b-2 border-r-2 border-[#d4af37] pointer-events-none" />
              
              {/* Header */}
              <div className="flex flex-col items-center mt-4">
                <div className="flex items-center gap-2.5 mb-1.5">
                  <div className="w-1.5 h-1.5 bg-[#d4af37] rotate-45" />
                  <span 
                    className="font-semibold tracking-[0.25em] text-[#d4af37] font-sans"
                    style={{ fontSize: `${10 * fontSizeMultiplier}px` }}
                  >
                    {masonicAcademyName}
                  </span>
                  <div className="w-1.5 h-1.5 bg-[#d4af37] rotate-45" />
                </div>
                <h1 
                  className="font-bold tracking-tight font-serif" 
                  style={{ 
                    fontFamily: 'Cinzel, Playfair Display, serif',
                    fontSize: `${30 * fontSizeMultiplier}px`,
                    color: textColor
                  }}
                >
                  {certificateHeading}
                </h1>
                <div className="w-36 h-[2px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mt-2.5" />
              </div>

              {/* Body Text */}
              <div className="px-10 my-4 flex flex-col justify-center items-center">
                <p className="italic text-slate-500 font-serif mb-3" style={{ fontSize: `${12 * fontSizeMultiplier}px` }}>Concedido a</p>
                
                <h2 
                  className="font-bold text-slate-900 border-b-2 border-slate-300 px-6 pb-1.5 inline-block tracking-wide max-w-[80%] truncate font-serif" 
                  style={{ 
                    fontFamily: 'Playfair Display, serif',
                    fontSize: `${28 * fontSizeMultiplier}px`,
                    borderColor: textColor === '#000000' ? '#64748b' : '#cbd5e1'
                  }}
                >
                  {certificate.recipientName}
                </h2>

                <p 
                  className="leading-relaxed text-slate-700 max-w-[650px] mt-6 font-serif"
                  style={{ fontSize: `${14 * fontSizeMultiplier}px` }}
                >
                  {certificate.type === 'course' ? (
                    <>
                      Por haver concluído com aproveitamento integral o conteúdo didático do curso{' '}
                      <strong className="font-sans font-bold italic" style={{ color: textColor }}>“{certificate.title}”</strong>
                      {certificate.grade ? `, correspondente ao grau de ${certificate.grade}` : ''}, 
                      cumprindo todas as etapas de estudo teórico e instrução interna de forma regular.
                    </>
                  ) : (
                    <>
                      Por haver obtido aproveitamento de proficiência e aprovação no Questionário Oficial da Instrução{' '}
                      <strong className="font-sans font-bold italic" style={{ color: textColor }}>“{certificate.title}”</strong>,
                      alcançando a nota expressiva de <strong className="font-bold text-amber-800">{certificate.score || '100%'}</strong> de acertos,
                      qualificando-se segundo as diretrizes acadêmicas regimentais.
                    </>
                  )}
                </p>
              </div>

              {/* Footer / Signatures and Seal */}
              <div className="grid grid-cols-3 items-end px-6 mb-3">
                
                {/* Verification Info */}
                <div className="text-left flex flex-col gap-1">
                  <span className="text-[8px] font-mono uppercase tracking-wider text-slate-400 block">
                    Autenticidade
                  </span>
                  <span className="text-[9px] font-mono font-semibold text-slate-700 block">
                    CÓD: {verificationCode}
                  </span>
                  <span className="text-[8px] text-slate-400 block">
                    Emitido em: {certificate.date}
                  </span>
                </div>

                {/* Decorative Gold Seal representation */}
                <div className="flex justify-center relative">
                  {showSeal && (
                    <>
                      <div className="w-16 h-16 rounded-full border-4 border-[#d4af37] bg-[#fdfbf7] flex items-center justify-center shadow-md relative z-10">
                        <div className="w-12 h-12 rounded-full border border-dashed border-[#d4af37] flex flex-col items-center justify-center text-[#d4af37]">
                          <ShieldCheck className="w-6 h-6 shrink-0" />
                          <span className="text-[6px] font-bold tracking-tighter">OFICIAL</span>
                        </div>
                      </div>
                      {/* Ribbon tails */}
                      <div className="absolute top-10 left-[40%] w-3 h-10 bg-[#d4af37]/80 -rotate-12 transform origin-top" />
                      <div className="absolute top-10 right-[40%] w-3 h-10 bg-[#d4af37]/80 rotate-12 transform origin-top" />
                    </>
                  )}
                </div>

                {/* Signatures */}
                <div className="flex flex-col items-center">
                  <div className="w-48 border-b border-slate-300 pb-1 flex justify-center" style={{ borderColor: textColor === '#000000' ? '#64748b' : '#cbd5e1' }}>
                    <span className="text-xs font-serif italic text-slate-800 tracking-wider">
                      {directorName}
                    </span>
                  </div>
                  <span className="text-[8px] font-mono text-slate-500 uppercase tracking-wider mt-1.5">
                    {directorTitle}
                  </span>
                  <span className="text-[7px] text-slate-400 block font-mono">
                    MASONIC ACADEMY
                  </span>
                </div>

              </div>
              
            </div>
          </div>
        </div>

        {/* Printable/Hidden node representation purely for ref-based print capture with active customization applied */}
        <div ref={certificateRef} className="hidden">
          <div 
            className="w-[1020px] h-[720px] bg-[#fdfbf7] border-[16px] double border-[#d4af37] text-slate-800 flex flex-col justify-between relative text-center" 
            style={{ 
              pageBreakInside: 'avoid',
              backgroundImage: customBg ? `url(${customBg})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              padding: getPaddingStyleVal(internalPadding)
            }}
          >
            <div className="absolute inset-2 border border-[#d4af37]/30" />
            
            {showMasonicSymbols && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none select-none" viewBox="0 0 900 636" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
                {/* Left Column (Boaz) */}
                <g stroke="#d4af37" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" opacity={symbolsOpacity}>
                  <path d="M 50 110 L 90 110 M 45 116 L 95 116 M 55 122 L 85 122" />
                  <rect x="58" y="122" width="24" height="8" rx="1" fill="none" />
                  <circle cx="70" cy="100" r="10" fill="none" />
                  <line x1="62" y1="130" x2="62" y2="480" />
                  <line x1="70" y1="130" x2="70" y2="480" />
                  <line x1="78" y1="130" x2="78" y2="480" />
                  <rect x="55" y="480" width="30" height="12" rx="1" fill="none" />
                  <path d="M 45 492 L 95 492 M 40 498 L 100 498" />
                </g>

                {/* Right Column (Jachin) */}
                <g stroke="#d4af37" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" opacity={symbolsOpacity}>
                  <path d="M 810 110 L 850 110 M 805 116 L 855 116 M 815 122 L 845 122" />
                  <rect x="818" y="122" width="24" height="8" rx="1" fill="none" />
                  <circle cx="830" cy="100" r="10" fill="none" />
                  <line x1="822" y1="130" x2="822" y2="480" />
                  <line x1="830" y1="130" x2="830" y2="480" />
                  <line x1="838" y1="130" x2="838" y2="480" />
                  <rect x="815" y="480" width="30" height="12" rx="1" fill="none" />
                  <path d="M 805 492 L 855 492 M 800 498 L 860 498" />
                </g>

                {/* Eye of Providence (Olho que tudo vê) */}
                <g stroke="#d4af37" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" opacity={symbolsOpacity + 0.03} transform="translate(450, 48)">
                  <polygon points="0,-25 -30,22 30,22" fill="none" />
                  <path d="M -12,6 Q 0,-6 12,6 Q 0,16 -12,6 Z" fill="none" />
                  <circle cx="0" cy="6" r="4.5" fill="none" />
                  <circle cx="0" cy="6" r="1.5" fill="#d4af37" />
                  <line x1="0" y1="-32" x2="0" y2="-28" />
                  <line x1="-22" y1="-22" x2="-18" y2="-18" />
                  <line x1="22" y1="-22" x2="18" y2="-18" />
                  <line x1="-32" y1="5" x2="-26" y2="5" />
                  <line x1="32" y1="5" x2="26" y2="5" />
                  <line x1="-20" y1="30" x2="-16" y2="24" />
                  <line x1="20" y1="30" x2="16" y2="24" />
                </g>

                {/* Square and Compass (Esquadro e Compasso) with Acacia (Acácia) inside and Letter G */}
                <g stroke="#d4af37" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" opacity={symbolsOpacity * 0.7} transform="translate(450, 315) scale(0.9)">
                  <path d="M 0,-110 L -65,55" />
                  <path d="M 0,-110 L 65,55" />
                  <circle cx="0" cy="-110" r="12" fill="none" />
                  <circle cx="0" cy="-110" r="4" fill="#d4af37" />
                  <path d="M -50,40 A 110,110 0 0,0 50,40" fill="none" />
                  <path d="M -85,-15 L 0,70 L 85,-15 L 60,-40 L 0,20 L -60,-40 Z" fill="none" />
                  
                  <g transform="translate(0, -15) scale(0.75)">
                    <path d="M 0,35 Q -10,10 0,-25" fill="none" />
                    <path d="M -2,22 Q -12,18 -10,10 Q -2,15 -2,22" fill="none" />
                    <path d="M -1,5 Q -12,3 -11,-5 Q -1,-1 -1,5" fill="none" />
                    <path d="M 0,-12 Q -10,-15 -8,-22 Q 0,-16 0,-12" fill="none" />
                    <path d="M 2,22 Q 12,18 10,10 Q 2,15 2,22" fill="none" />
                    <path d="M 1,5 Q 12,3 11,-5 Q 1,1 1,5" fill="none" />
                    <path d="M 0,-12 Q 10,-15 8,-22 Q 0,-16 0,-12" fill="none" />
                  </g>
                  <text x="-9" y="11" fontFamily="'Cinzel', serif" fontWeight="bold" fontSize="36" fill="#d4af37" stroke="none" opacity={0.8}>G</text>
                </g>

                {/* Mallet and Chisel (Malho e Cinzel) */}
                <g stroke="#d4af37" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" opacity={symbolsOpacity * 0.8} transform="translate(130, 520) scale(0.7)">
                  <g transform="rotate(-30)">
                    <rect x="-8" y="-35" width="16" height="24" rx="2" fill="none" />
                    <line x1="0" y1="-11" x2="0" y2="25" />
                  </g>
                  <g transform="rotate(30)">
                    <rect x="-3" y="-35" width="6" height="50" rx="1" fill="none" />
                    <path d="M -5,-35 L 5,-35" />
                    <path d="M -3,15 L 0,25 L 3,15 Z" fill="none" />
                  </g>
                </g>

                {/* Acacia Branches (Acácia) flanking bottom right */}
                <g stroke="#d4af37" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" opacity={symbolsOpacity * 0.9} transform="translate(770, 520) scale(0.7) rotate(20)">
                  <path d="M -20,20 Q 10,-10 30,-40" fill="none" />
                  <path d="M -12,14 Q -22,8 -16,0 Q -8,6 -12,14" fill="none" />
                  <path d="M 0,2 Q -10,-4 -4,-12 Q 4,-6 0,2" fill="none" />
                  <path d="M 12,-10 Q 2,-16 8,-24 Q 16,-18 12,-10" fill="none" />
                  <path d="M -3,11 Q 12,5 6,-3" fill="none" />
                  <path d="M 9,-1 Q 24,-7 18,-15" fill="none" />
                </g>
              </svg>
            )}
            
            <div className="absolute top-4 left-4 w-10 h-10 border-t-2 border-l-2 border-[#d4af37]" />
            <div className="absolute top-4 right-4 w-10 h-10 border-t-2 border-r-2 border-[#d4af37]" />
            <div className="absolute bottom-4 left-4 w-10 h-10 border-b-2 border-l-2 border-[#d4af37]" />
            <div className="absolute bottom-4 right-4 w-10 h-10 border-b-2 border-r-2 border-[#d4af37]" />
            
            <div className="flex flex-col items-center mt-4">
              <div className="flex items-center gap-2 mb-1.5" style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ fontSize: `${10 * fontSizeMultiplier}px`, fontWeight: 'bold', letterSpacing: '0.25em', color: '#d4af37' }}>
                  {masonicAcademyName}
                </span>
              </div>
              <h1 style={{ fontSize: `${30 * fontSizeMultiplier}px`, fontWeight: 'bold', color: textColor, fontFamily: "'Playfair Display', serif", margin: '5px 0' }}>
                {certificateHeading}
              </h1>
              <div style={{ width: '150px', height: '2px', backgroundColor: '#d4af37', margin: '8px auto' }} />
            </div>

            <div style={{ padding: '0 40px', margin: '20px 0' }}>
              <p style={{ fontSize: `${13 * fontSizeMultiplier}px`, fontStyle: 'italic', color: '#64748b', fontFamily: "'Playfair Display', serif" }}>Concedido a</p>
              <h2 style={{ fontSize: `${28 * fontSizeMultiplier}px`, fontWeight: 'bold', color: '#0f172a', borderBottom: `2px solid ${textColor === '#000000' ? '#64748b' : '#cbd5e1'}`, paddingBottom: '6px', display: 'inline-block', margin: '10px 0' }}>
                {certificate.recipientName}
              </h2>
              <p style={{ fontSize: `${14 * fontSizeMultiplier}px`, lineHeight: '1.6', color: '#334155', fontFamily: "'Playfair Display', serif", margin: '20px auto 0', maxWidth: '650px' }}>
                {certificate.type === 'course' ? (
                  `Por haver concluído com aproveitamento integral o conteúdo didático do curso “${certificate.title}” ${certificate.grade ? `, correspondente ao grau de ${certificate.grade}` : ''}, cumprindo todas as etapas de estudo teórico e instrução interna de forma regular.`
                ) : (
                  `Por haver obtido aproveitamento de proficiência e aprovação no Questionário Oficial da Instrução “${certificate.title}”, alcançando a nota expressiva de ${certificate.score || '100%'} de acertos, qualificando-se segundo as diretrizes acadêmicas regimentais.`
                )}
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', padding: '0 40px', marginBottom: '10px' }}>
              <div style={{ textAlign: 'left', minWidth: '200px' }}>
                <span style={{ fontSize: '8px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>Autenticidade</span>
                <div style={{ fontSize: '10px', fontFamily: 'monospace', fontWeight: 'bold', color: '#334155' }}>CÓD: {verificationCode}</div>
                <div style={{ fontSize: '8px', color: '#94a3b8' }}>Emitido em: {certificate.date}</div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {showSeal && (
                  <div style={{ width: '60px', height: '60px', borderRadius: '50%', border: '4px solid #d4af37', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '46px', height: '46px', borderRadius: '50%', border: '1px dashed #d4af37', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#d4af37' }}>
                      <span style={{ fontSize: '6px', fontWeight: 'bold' }}>OFICIAL</span>
                    </div>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '200px' }}>
                <div style={{ width: '180px', borderBottom: `1px solid ${textColor === '#000000' ? '#64748b' : '#cbd5e1'}`, paddingBottom: '3px', textAlign: 'center' }}>
                  <span style={{ fontSize: '12px', fontStyle: 'italic', fontFamily: "'Playfair Display', serif" }}>{directorName}</span>
                </div>
                <span style={{ fontSize: '8px', fontFamily: 'monospace', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '6px' }}>{directorTitle}</span>
                <span style={{ fontSize: '7px', color: '#94a3b8', fontFamily: 'monospace' }}>MASONIC ACADEMY</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="px-6 py-4 bg-[#0d1c24] border-t border-[#1c2c36] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <p className="text-[10px] text-[#99907c] font-mono text-center sm:text-left">
            {isAdmin 
              ? 'Edite os parâmetros acima à esquerda. As alterações refletem instantaneamente no preview e na impressão final.'
              : 'Visualização do certificado oficial emitido. As configurações estéticas foram definidas pela administração institucional.'
            }
          </p>
          <div className="flex gap-2.5 w-full sm:w-auto">
            <button
              onClick={onClose}
              type="button"
              className="flex-1 sm:flex-none text-xs font-mono font-bold text-[#99907c] hover:text-[#d4e5f2] px-4 py-2.5 rounded-lg bg-[#11212b] border border-[#1c2c36] text-center transition-colors cursor-pointer"
            >
              Fechar
            </button>
            <button
              onClick={handlePrint}
              type="button"
              className="flex-1 sm:flex-none bg-[#E9C349] text-[#241a00] text-xs font-mono font-bold px-6 py-2.5 rounded-lg hover:bg-[#ffe088] transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / Salvar PDF</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
