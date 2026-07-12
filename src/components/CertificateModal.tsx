import React, { useRef } from 'react';
import { X, Printer, Award, ShieldCheck, Download } from 'lucide-react';

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
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ certificate, onClose }) => {
  const certificateRef = useRef<HTMLDivElement>(null);

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

  const handlePrint = () => {
    const printContent = certificateRef.current?.innerHTML;
    if (!printContent) return;

    // Create a hidden iframe for clean printing without affecting the main page state
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

      // Clean up the iframe from the parent window safely after 10 seconds
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 10000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="bg-[#0b141a] border border-[#1c2c36] rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden font-sans my-4 flex flex-col">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#0d1c24] border-b border-[#1c2c36] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Award className="w-5 h-5 text-[#E9C349]" />
            <div>
              <h3 className="font-sans font-bold text-sm text-[#d4e5f2] uppercase tracking-wider">
                Certificado Oficial Digital
              </h3>
              <p className="text-[10px] text-[#99907c] font-mono">
                {certificate.type === 'course' ? 'Conclusão de Curso de Instrução' : 'Aprovação em Exame de Simulado'}
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

        {/* Certificate Display Area (Landscape ratio) */}
        <div className="p-6 bg-[#040c11] flex items-center justify-center overflow-x-auto min-h-[350px] md:min-h-[500px]">
          <div className="shrink-0 w-[900px] h-[636px] bg-[#fdfbf7] border-[16px] double border-[#d4af37] p-8 text-slate-800 flex flex-col justify-between relative shadow-2xl select-none rounded text-center">
            
            {/* Elegant Background Vectors / Filigrees */}
            <div className="absolute inset-2 border border-[#d4af37]/30 pointer-events-none" />
            
            {/* Corners Decorative */}
            <div className="absolute top-4 left-4 w-10 h-10 border-t-2 border-l-2 border-[#d4af37] pointer-events-none" />
            <div className="absolute top-4 right-4 w-10 h-10 border-t-2 border-r-2 border-[#d4af37] pointer-events-none" />
            <div className="absolute bottom-4 left-4 w-10 h-10 border-b-2 border-l-2 border-[#d4af37] pointer-events-none" />
            <div className="absolute bottom-4 right-4 w-10 h-10 border-b-2 border-r-2 border-[#d4af37] pointer-events-none" />
            
            {/* Header */}
            <div className="flex flex-col items-center mt-4">
              <div className="flex items-center gap-2.5 mb-1.5">
                <div className="w-1.5 h-1.5 bg-[#d4af37] rotate-45" />
                <span className="text-[10px] font-semibold tracking-[0.25em] text-[#d4af37] font-sans">
                  MASONIC ACADEMY
                </span>
                <div className="w-1.5 h-1.5 bg-[#d4af37] rotate-45" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-[#11212b] font-serif" style={{ fontFamily: 'Cinzel, Playfair Display, serif' }}>
                Certificado de Conclusão
              </h1>
              <div className="w-36 h-[2px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mt-2.5" />
            </div>

            {/* Body Text */}
            <div className="px-10 my-4 flex flex-col justify-center items-center">
              <p className="text-xs italic text-slate-500 font-serif mb-3">Concedido a</p>
              
              <h2 className="text-3xl font-bold text-slate-900 border-b-2 border-slate-300 px-6 pb-1.5 inline-block tracking-wide max-w-[80%] truncate font-serif" style={{ fontFamily: 'Playfair Display, serif' }}>
                {certificate.recipientName}
              </h2>

              <p className="text-sm leading-relaxed text-slate-700 max-w-[650px] mt-6 font-serif">
                {certificate.type === 'course' ? (
                  <>
                    Por haver concluído com aproveitamento integral o conteúdo didático do curso{' '}
                    <strong className="text-slate-900 font-sans font-bold italic">“{certificate.title}”</strong>
                    {certificate.grade ? `, correspondente ao grau de ${certificate.grade}` : ''}, 
                    cumprindo todas as etapas de estudo teórico e instrução interna de forma regular.
                  </>
                ) : (
                  <>
                    Por haver obtido aproveitamento de proficiência e aprovação no Simulado Teórico da Instrução{' '}
                    <strong className="text-slate-900 font-sans font-bold italic">“{certificate.title}”</strong>,
                    alcançando a nota expressiva de <strong className="text-amber-800 font-bold">{certificate.score || '100%'}</strong> de acertos,
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
                <div className="w-16 h-16 rounded-full border-4 border-[#d4af37] bg-[#fdfbf7] flex items-center justify-center shadow-md relative z-10">
                  <div className="w-12 h-12 rounded-full border border-dashed border-[#d4af37] flex flex-col items-center justify-center text-[#d4af37]">
                    <ShieldCheck className="w-6 h-6 shrink-0" />
                    <span className="text-[6px] font-bold tracking-tighter">OFICIAL</span>
                  </div>
                </div>
                {/* Ribbon tails */}
                <div className="absolute top-10 left-[40%] w-3 h-10 bg-[#d4af37]/80 -rotate-12 transform origin-top" />
                <div className="absolute top-10 right-[40%] w-3 h-10 bg-[#d4af37]/80 rotate-12 transform origin-top" />
              </div>

              {/* Signatures */}
              <div className="flex flex-col items-center">
                <div className="w-48 border-b border-slate-300 pb-1 flex justify-center">
                  <span className="text-xs font-serif italic text-slate-800 tracking-wider">
                    Daniel Luciano
                  </span>
                </div>
                <span className="text-[8px] font-mono text-slate-500 uppercase tracking-wider mt-1.5">
                  Diretor Acadêmico
                </span>
                <span className="text-[7px] text-slate-400 block font-mono">
                  MASONIC ACADEMY
                </span>
              </div>

            </div>
            
          </div>
        </div>

        {/* Printable/Hidden node representation purely for ref-based print capture if needed */}
        <div ref={certificateRef} className="hidden">
          <div className="w-[1020px] h-[720px] bg-[#fdfbf7] border-[16px] double border-[#d4af37] p-8 text-slate-800 flex flex-col justify-between relative text-center" style={{ pageBreakInside: 'avoid' }}>
            <div className="absolute inset-2 border border-[#d4af37]/30" />
            <div className="absolute top-4 left-4 w-10 h-10 border-t-2 border-l-2 border-[#d4af37]" />
            <div className="absolute top-4 right-4 w-10 h-10 border-t-2 border-r-2 border-[#d4af37]" />
            <div className="absolute bottom-4 left-4 w-10 h-10 border-b-2 border-l-2 border-[#d4af37]" />
            <div className="absolute bottom-4 right-4 w-10 h-10 border-b-2 border-r-2 border-[#d4af37]" />
            
            <div className="flex flex-col items-center mt-4">
              <div className="flex items-center gap-2 mb-1.5" style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ fontSize: '10px', fontWeight: 'bold', letterSpacing: '0.25em', color: '#d4af37' }}>
                  MASONIC ACADEMY
                </span>
              </div>
              <h1 style={{ fontSize: '30px', fontWeight: 'bold', color: '#11212b', fontFamily: "'Playfair Display', serif", margin: '5px 0' }}>
                Certificado de Conclusão
              </h1>
              <div style={{ width: '150px', height: '2px', backgroundColor: '#d4af37', margin: '8px auto' }} />
            </div>

            <div style={{ padding: '0 40px', margin: '20px 0' }}>
              <p style={{ fontSize: '13px', fontStyle: 'italic', color: '#64748b', fontFamily: "'Playfair Display', serif" }}>Concedido a</p>
              <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#0f172a', borderBottom: '2px solid #cbd5e1', paddingBottom: '6px', display: 'inline-block', margin: '10px 0' }}>
                {certificate.recipientName}
              </h2>
              <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#334155', fontFamily: "'Playfair Display', serif", margin: '20px auto 0', maxWidth: '650px' }}>
                {certificate.type === 'course' ? (
                  `Por haver concluído com aproveitamento integral o conteúdo didático do curso “${certificate.title}” ${certificate.grade ? `, correspondente ao grau de ${certificate.grade}` : ''}, cumprindo todas as etapas de estudo teórico e instrução interna de forma regular.`
                ) : (
                  `Por haver obtido aproveitamento de proficiência e aprovação no Simulado Teórico da Instrução “${certificate.title}”, alcançando a nota expressiva de ${certificate.score || '100%'} de acertos, qualificando-se segundo as diretrizes acadêmicas regimentais.`
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
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', border: '4px solid #d4af37', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: '46px', height: '46px', borderRadius: '50%', border: '1px dashed #d4af37', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#d4af37' }}>
                    <span style={{ fontSize: '6px', fontWeight: 'bold' }}>OFICIAL</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '200px' }}>
                <div style={{ width: '180px', borderBottom: '1px solid #cbd5e1', paddingBottom: '3px', textAlign: 'center' }}>
                  <span style={{ fontSize: '12px', fontStyle: 'italic', fontFamily: "'Playfair Display', serif" }}>Daniel Luciano</span>
                </div>
                <span style={{ fontSize: '8px', fontFamily: 'monospace', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '6px' }}>Diretor Acadêmico</span>
                <span style={{ fontSize: '7px', color: '#94a3b8', fontFamily: 'monospace' }}>MASONIC ACADEMY</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="px-6 py-4 bg-[#0d1c24] border-t border-[#1c2c36] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[10px] text-[#99907c] font-mono text-center sm:text-left">
            Este certificado utiliza assinaturas criptográficas e selo digital com rastreamento permanente.
          </p>
          <div className="flex gap-2.5 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none text-xs font-mono font-bold text-[#99907c] hover:text-[#d4e5f2] px-4 py-2.5 rounded-lg bg-[#11212b] border border-[#1c2c36] text-center transition-colors cursor-pointer"
            >
              Fechar
            </button>
            <button
              onClick={handlePrint}
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
