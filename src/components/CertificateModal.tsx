import React, { useState, useRef, useEffect } from 'react';
import { X, Printer, Award, ShieldCheck, Upload, RotateCcw, Sliders, Type, Image as ImageIcon, Eye, EyeOff } from 'lucide-react';
import { compressImage } from '../utils';
import { initializeFirebase } from '../firebase';

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
  const previewRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const elementInputRef = useRef<HTMLInputElement>(null);

  const dragInfoRef = useRef<{
    id: string;
    startX: number;
    startY: number;
    startClientX: number;
    startClientY: number;
  } | null>(null);

  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [draggedElementId, setDraggedElementId] = useState<string | null>(null);

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
  const [showSig, setShowSig] = useState<boolean>(() => {
    const val = localStorage.getItem('masonic_cert_show_sig');
    return val !== null ? val === 'true' : true;
  });
  const [showInfo, setShowInfo] = useState<boolean>(() => {
    const val = localStorage.getItem('masonic_cert_show_info');
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

  const [headerOffset, setHeaderOffset] = useState<number>(() => {
    const val = localStorage.getItem('masonic_cert_header_offset');
    return val !== null ? parseInt(val, 10) : 0;
  });
  const [bodyOffset, setBodyOffset] = useState<number>(() => {
    const val = localStorage.getItem('masonic_cert_body_offset');
    return val !== null ? parseInt(val, 10) : 0;
  });
  const [footerOffset, setFooterOffset] = useState<number>(() => {
    const val = localStorage.getItem('masonic_cert_footer_offset');
    return val !== null ? parseInt(val, 10) : 0;
  });

  const [sealPos, setSealPos] = useState<{ x: number; y: number; scale: number; width: number }>(() => {
    const val = localStorage.getItem('masonic_cert_seal_pos');
    return val ? JSON.parse(val) : { x: 50, y: 82, scale: 1.0, width: 64 };
  });

  const [sigPos, setSigPos] = useState<{ x: number; y: number; scale: number; width: number }>(() => {
    const val = localStorage.getItem('masonic_cert_sig_pos');
    return val ? JSON.parse(val) : { x: 80, y: 82, scale: 1.0, width: 192 };
  });

  const [infoPos, setInfoPos] = useState<{ x: number; y: number; scale: number; width: number }>(() => {
    const val = localStorage.getItem('masonic_cert_info_pos');
    return val ? JSON.parse(val) : { x: 20, y: 82, scale: 1.0, width: 200 };
  });

  const [colunaEsqPos, setColunaEsqPos] = useState<{ x: number; y: number; scale: number; width: number }>(() => {
    const val = localStorage.getItem('masonic_cert_col_esq_pos');
    return val ? JSON.parse(val) : { x: 7.7, y: 47.0, scale: 1.0, width: 60 };
  });

  const [colunaDirPos, setColunaDirPos] = useState<{ x: number; y: number; scale: number; width: number }>(() => {
    const val = localStorage.getItem('masonic_cert_col_dir_pos');
    return val ? JSON.parse(val) : { x: 92.2, y: 47.0, scale: 1.0, width: 60 };
  });

  const [olhoPos, setOlhoPos] = useState<{ x: number; y: number; scale: number; width: number }>(() => {
    const val = localStorage.getItem('masonic_cert_olho_pos');
    return val ? JSON.parse(val) : { x: 50.0, y: 12.0, scale: 1.0, width: 80 };
  });

  const [esquadroPos, setEsquadroPos] = useState<{ x: number; y: number; scale: number; width: number }>(() => {
    const val = localStorage.getItem('masonic_cert_esquadro_pos');
    return val ? JSON.parse(val) : { x: 50.0, y: 49.5, scale: 1.0, width: 180 };
  });

  const [malhoPos, setMalhoPos] = useState<{ x: number; y: number; scale: number; width: number }>(() => {
    const val = localStorage.getItem('masonic_cert_malho_pos');
    return val ? JSON.parse(val) : { x: 14.4, y: 81.7, scale: 1.0, width: 70 };
  });

  const [acaciaPos, setAcaciaPos] = useState<{ x: number; y: number; scale: number; width: number }>(() => {
    const val = localStorage.getItem('masonic_cert_acacia_pos');
    return val ? JSON.parse(val) : { x: 85.5, y: 81.7, scale: 1.0, width: 70 };
  });

  const [showColEsq, setShowColEsq] = useState<boolean>(() => {
    const val = localStorage.getItem('masonic_cert_show_col_esq');
    return val !== null ? val === 'true' : true;
  });
  const [showColDir, setShowColDir] = useState<boolean>(() => {
    const val = localStorage.getItem('masonic_cert_show_col_dir');
    return val !== null ? val === 'true' : true;
  });
  const [showOlho, setShowOlho] = useState<boolean>(() => {
    const val = localStorage.getItem('masonic_cert_show_olho');
    return val !== null ? val === 'true' : true;
  });
  const [showEsquadro, setShowEsquadro] = useState<boolean>(() => {
    const val = localStorage.getItem('masonic_cert_show_esquadro');
    return val !== null ? val === 'true' : true;
  });
  const [showMalho, setShowMalho] = useState<boolean>(() => {
    const val = localStorage.getItem('masonic_cert_show_malho');
    return val !== null ? val === 'true' : true;
  });
  const [showAcacia, setShowAcacia] = useState<boolean>(() => {
    const val = localStorage.getItem('masonic_cert_show_acacia');
    return val !== null ? val === 'true' : true;
  });

  interface CustomElement {
    id: string;
    src: string;
    x: number;   // 0 to 100
    y: number;   // 0 to 100
    scale: number; // 0.1 to 3.0
    width: number; // in px
  }

  const [customElements, setCustomElements] = useState<CustomElement[]>(() => {
    const val = localStorage.getItem('masonic_cert_custom_elements');
    return val !== null ? JSON.parse(val) : [];
  });

  const [isCompacting, setIsCompacting] = useState(false);
  const [isCompactingElement, setIsCompactingElement] = useState(false);
  const [isLoadingSettings, setIsLoadingSettings] = useState(false);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Load from Firestore on mount so that other users render according to configuration
  useEffect(() => {
    let active = true;
    const loadGlobalSettings = async () => {
      try {
        setIsLoadingSettings(true);
        const { db } = initializeFirebase();
        if (!db) return;
        const { doc, getDoc } = await import('firebase/firestore');
        const docRef = doc(db, 'settings', 'certificate_design');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && active) {
          const data = docSnap.data();
          if (data.customBg !== undefined) setCustomBg(data.customBg);
          if (data.showMasonicSymbols !== undefined) setShowMasonicSymbols(data.showMasonicSymbols);
          if (data.symbolsOpacity !== undefined) setSymbolsOpacity(data.symbolsOpacity);
          if (data.showSeal !== undefined) setShowSeal(data.showSeal);
          if (data.showSig !== undefined) setShowSig(data.showSig);
          if (data.showInfo !== undefined) setShowInfo(data.showInfo);
          if (data.fontSizeMultiplier !== undefined) setFontSizeMultiplier(data.fontSizeMultiplier);
          if (data.textColor !== undefined) setTextColor(data.textColor);
          if (data.masonicAcademyName !== undefined) setMasonicAcademyName(data.masonicAcademyName);
          if (data.certificateHeading !== undefined) setCertificateHeading(data.certificateHeading);
          if (data.directorName !== undefined) setDirectorName(data.directorName);
          if (data.directorTitle !== undefined) setDirectorTitle(data.directorTitle);
          if (data.internalPadding !== undefined) setInternalPadding(data.internalPadding);
          if (data.headerOffset !== undefined) setHeaderOffset(data.headerOffset);
          if (data.bodyOffset !== undefined) setBodyOffset(data.bodyOffset);
          if (data.footerOffset !== undefined) setFooterOffset(data.footerOffset);
          if (data.customElements !== undefined) setCustomElements(data.customElements);
          if (data.sealPos !== undefined) setSealPos(data.sealPos);
          if (data.sigPos !== undefined) setSigPos(data.sigPos);
          if (data.infoPos !== undefined) setInfoPos(data.infoPos);
          if (data.colunaEsqPos !== undefined) setColunaEsqPos(data.colunaEsqPos);
          if (data.colunaDirPos !== undefined) setColunaDirPos(data.colunaDirPos);
          if (data.olhoPos !== undefined) setOlhoPos(data.olhoPos);
          if (data.esquadroPos !== undefined) setEsquadroPos(data.esquadroPos);
          if (data.malhoPos !== undefined) setMalhoPos(data.malhoPos);
          if (data.acaciaPos !== undefined) setAcaciaPos(data.acaciaPos);
          if (data.showColEsq !== undefined) setShowColEsq(data.showColEsq);
          if (data.showColDir !== undefined) setShowColDir(data.showColDir);
          if (data.showOlho !== undefined) setShowOlho(data.showOlho);
          if (data.showEsquadro !== undefined) setShowEsquadro(data.showEsquadro);
          if (data.showMalho !== undefined) setShowMalho(data.showMalho);
          if (data.showAcacia !== undefined) setShowAcacia(data.showAcacia);
        }
      } catch (err) {
        console.error('Erro ao buscar design do certificado do Firestore:', err);
      } finally {
        if (active) setIsLoadingSettings(false);
      }
    };
    loadGlobalSettings();
    return () => {
      active = false;
    };
  }, []);

  const handleSaveGlobalSettings = async () => {
    try {
      setIsSavingSettings(true);
      setSaveSuccess(false);
      const { db } = initializeFirebase();
      if (!db) {
        alert('Erro: Banco de dados não disponível.');
        return;
      }
      const { doc, setDoc } = await import('firebase/firestore');
      const docRef = doc(db, 'settings', 'certificate_design');
      
      const payload = {
        customBg,
        showMasonicSymbols,
        symbolsOpacity,
        showSeal,
        showSig,
        showInfo,
        fontSizeMultiplier,
        textColor,
        masonicAcademyName,
        certificateHeading,
        directorName,
        directorTitle,
        internalPadding,
        headerOffset,
        bodyOffset,
        footerOffset,
        customElements,
        sealPos,
        sigPos,
        infoPos,
        colunaEsqPos,
        colunaDirPos,
        olhoPos,
        esquadroPos,
        malhoPos,
        acaciaPos,
        showColEsq,
        showColDir,
        showOlho,
        showEsquadro,
        showMalho,
        showAcacia,
        updatedAt: new Date().toISOString()
      };
      
      await setDoc(docRef, payload);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err) {
      console.error('Erro ao salvar design do certificado no Firestore:', err);
      alert('Erro ao salvar design do certificado no servidor.');
    } finally {
      setIsSavingSettings(false);
    }
  };

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
    localStorage.setItem('masonic_cert_show_sig', String(showSig));
  }, [showSig]);

  useEffect(() => {
    localStorage.setItem('masonic_cert_show_info', String(showInfo));
  }, [showInfo]);

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

  useEffect(() => {
    localStorage.setItem('masonic_cert_header_offset', String(headerOffset));
  }, [headerOffset]);

  useEffect(() => {
    localStorage.setItem('masonic_cert_body_offset', String(bodyOffset));
  }, [bodyOffset]);

  useEffect(() => {
    localStorage.setItem('masonic_cert_footer_offset', String(footerOffset));
  }, [footerOffset]);

  useEffect(() => {
    localStorage.setItem('masonic_cert_custom_elements', JSON.stringify(customElements));
  }, [customElements]);

  useEffect(() => {
    localStorage.setItem('masonic_cert_seal_pos', JSON.stringify(sealPos));
  }, [sealPos]);

  useEffect(() => {
    localStorage.setItem('masonic_cert_sig_pos', JSON.stringify(sigPos));
  }, [sigPos]);

  useEffect(() => {
    localStorage.setItem('masonic_cert_info_pos', JSON.stringify(infoPos));
  }, [infoPos]);

  useEffect(() => {
    localStorage.setItem('masonic_cert_col_esq_pos', JSON.stringify(colunaEsqPos));
  }, [colunaEsqPos]);

  useEffect(() => {
    localStorage.setItem('masonic_cert_col_dir_pos', JSON.stringify(colunaDirPos));
  }, [colunaDirPos]);

  useEffect(() => {
    localStorage.setItem('masonic_cert_olho_pos', JSON.stringify(olhoPos));
  }, [olhoPos]);

  useEffect(() => {
    localStorage.setItem('masonic_cert_esquadro_pos', JSON.stringify(esquadroPos));
  }, [esquadroPos]);

  useEffect(() => {
    localStorage.setItem('masonic_cert_malho_pos', JSON.stringify(malhoPos));
  }, [malhoPos]);

  useEffect(() => {
    localStorage.setItem('masonic_cert_acacia_pos', JSON.stringify(acaciaPos));
  }, [acaciaPos]);

  useEffect(() => {
    localStorage.setItem('masonic_cert_show_col_esq', String(showColEsq));
  }, [showColEsq]);

  useEffect(() => {
    localStorage.setItem('masonic_cert_show_col_dir', String(showColDir));
  }, [showColDir]);

  useEffect(() => {
    localStorage.setItem('masonic_cert_show_olho', String(showOlho));
  }, [showOlho]);

  useEffect(() => {
    localStorage.setItem('masonic_cert_show_esquadro', String(showEsquadro));
  }, [showEsquadro]);

  useEffect(() => {
    localStorage.setItem('masonic_cert_show_malho', String(showMalho));
  }, [showMalho]);

  useEffect(() => {
    localStorage.setItem('masonic_cert_show_acacia', String(showAcacia));
  }, [showAcacia]);

  const handleElementUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsCompactingElement(true);
      const reader = new FileReader();
      reader.onloadend = async () => {
        const rawBase64 = reader.result as string;
        try {
          const compressed = await compressImage(rawBase64, 300, 300, 0.8);
          const newEl: CustomElement = {
            id: `el_${Date.now()}`,
            src: compressed,
            x: 50,
            y: 50,
            scale: 1.0,
            width: 80
          };
          setCustomElements(prev => [...prev, newEl]);
        } catch (err) {
          console.error('Erro comprimindo elemento extra:', err);
          const newEl: CustomElement = {
            id: `el_${Date.now()}`,
            src: rawBase64,
            x: 50,
            y: 50,
            scale: 1.0,
            width: 80
          };
          setCustomElements(prev => [...prev, newEl]);
        } finally {
          setIsCompactingElement(false);
          if (elementInputRef.current) elementInputRef.current.value = '';
        }
      };
      reader.readAsDataURL(file);
    }
  };

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

  const getBuiltInElementData = (id: string) => {
    switch (id) {
      case 'col_esq':
        return {
          id: 'col_esq',
          name: 'Coluna Esq. (Boaz)',
          pos: colunaEsqPos,
          setPos: setColunaEsqPos,
          show: showColEsq,
          setShow: setShowColEsq,
          defaultPos: { x: 7.7, y: 47.0, scale: 1.0, width: 60 }
        };
      case 'col_dir':
        return {
          id: 'col_dir',
          name: 'Coluna Dir. (Jachin)',
          pos: colunaDirPos,
          setPos: setColunaDirPos,
          show: showColDir,
          setShow: setShowColDir,
          defaultPos: { x: 92.2, y: 47.0, scale: 1.0, width: 60 }
        };
      case 'olho':
        return {
          id: 'olho',
          name: 'Olho que tudo vê',
          pos: olhoPos,
          setPos: setOlhoPos,
          show: showOlho,
          setShow: setShowOlho,
          defaultPos: { x: 50.0, y: 12.0, scale: 1.0, width: 80 }
        };
      case 'esquadro':
        return {
          id: 'esquadro',
          name: 'Esquadro/Compasso',
          pos: esquadroPos,
          setPos: setEsquadroPos,
          show: showEsquadro,
          setShow: setShowEsquadro,
          defaultPos: { x: 50.0, y: 49.5, scale: 1.0, width: 180 }
        };
      case 'malho':
        return {
          id: 'malho',
          name: 'Malho e Cinzel',
          pos: malhoPos,
          setPos: setMalhoPos,
          show: showMalho,
          setShow: setShowMalho,
          defaultPos: { x: 14.4, y: 81.7, scale: 1.0, width: 70 }
        };
      case 'acacia':
        return {
          id: 'acacia',
          name: 'Ramo de Acácia',
          pos: acaciaPos,
          setPos: setAcaciaPos,
          show: showAcacia,
          setShow: setShowAcacia,
          defaultPos: { x: 85.5, y: 81.7, scale: 1.0, width: 70 }
        };
      default:
        return null;
    }
  };

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
      setShowSig(true);
      setShowInfo(true);
      setFontSizeMultiplier(1.0);
      setTextColor('#11212b');
      setMasonicAcademyName('MASONIC ACADEMY');
      setCertificateHeading('Certificado de Conclusão');
      setDirectorName('Daniel Luciano');
      setDirectorTitle('Diretor Acadêmico');
      setInternalPadding('p-8');
      setHeaderOffset(0);
      setBodyOffset(0);
      setFooterOffset(0);
      setCustomElements([]);
      setSealPos({ x: 50, y: 82, scale: 1.0, width: 64 });
      setSigPos({ x: 80, y: 82, scale: 1.0, width: 192 });
      setInfoPos({ x: 20, y: 82, scale: 1.0, width: 200 });
      setColunaEsqPos({ x: 7.7, y: 47.0, scale: 1.0, width: 60 });
      setColunaDirPos({ x: 92.2, y: 47.0, scale: 1.0, width: 60 });
      setOlhoPos({ x: 50.0, y: 12.0, scale: 1.0, width: 80 });
      setEsquadroPos({ x: 50.0, y: 49.5, scale: 1.0, width: 180 });
      setMalhoPos({ x: 14.4, y: 81.7, scale: 1.0, width: 70 });
      setAcaciaPos({ x: 85.5, y: 81.7, scale: 1.0, width: 70 });
      setShowColEsq(true);
      setShowColDir(true);
      setShowOlho(true);
      setShowEsquadro(true);
      setShowMalho(true);
      setShowAcacia(true);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      if (elementInputRef.current) {
        elementInputRef.current.value = '';
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
              
              {/* Save changes to server section */}
              <div className="bg-gradient-to-r from-[#E9C349]/15 to-transparent border border-[#E9C349]/30 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#E9C349]">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Publicar no Servidor</span>
                </div>
                <p className="text-[10px] text-[#99907c] font-mono leading-tight">
                  Alunos acessando de outros computadores só verão o design personalizado após você publicar as alterações no banco de dados.
                </p>
                <button
                  type="button"
                  onClick={handleSaveGlobalSettings}
                  disabled={isSavingSettings}
                  className="w-full bg-[#E9C349] hover:bg-[#ffe088] text-[#241a00] font-sans font-extrabold text-xs py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_2px_8px_rgba(233,195,73,0.15)] disabled:opacity-50"
                >
                  {isSavingSettings ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-[#241a00] border-t-transparent rounded-full animate-spin" />
                      <span>Salvando...</span>
                    </>
                  ) : saveSuccess ? (
                    <span>✓ Publicado com Sucesso!</span>
                  ) : (
                    <span>Publicar Design para Alunos</span>
                  )}
                </button>
              </div>

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

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Sliders className="w-4 h-4 text-[#E9C349]" />
                  <span className="text-[11px] font-sans font-black text-[#d4e5f2] uppercase tracking-wider">
                    Ajuste de Posições (Vertical)
                  </span>
                </div>
                
                <div className="space-y-3 bg-[#08151c] p-4 rounded-xl border border-[#172731]">
                  {/* Header vertical offset */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[9px] font-mono text-[#9cbfd5] uppercase">
                      <span>Cabeçalho (Vertical)</span>
                      <span className="text-white">{headerOffset}px</span>
                    </div>
                    <input
                      type="range"
                      min="-120"
                      max="120"
                      step="2"
                      value={headerOffset}
                      onChange={(e) => setHeaderOffset(parseInt(e.target.value, 10))}
                      className="w-full accent-[#E9C349] h-1 bg-[#11212b] rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  {/* Body text vertical offset */}
                  <div className="space-y-1 pt-2 border-t border-[#172731]/60">
                    <div className="flex justify-between text-[9px] font-mono text-[#9cbfd5] uppercase">
                      <span>Descrição / Aluno (Vertical)</span>
                      <span className="text-white">{bodyOffset}px</span>
                    </div>
                    <input
                      type="range"
                      min="-120"
                      max="120"
                      step="2"
                      value={bodyOffset}
                      onChange={(e) => setBodyOffset(parseInt(e.target.value, 10))}
                      className="w-full accent-[#E9C349] h-1 bg-[#11212b] rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  {/* Footer vertical offset */}
                  <div className="space-y-1 pt-2 border-t border-[#172731]/60">
                    <div className="flex justify-between text-[9px] font-mono text-[#9cbfd5] uppercase">
                      <span>Assinaturas / Selo (Vertical)</span>
                      <span className="text-white">{footerOffset}px</span>
                    </div>
                    <input
                      type="range"
                      min="-120"
                      max="120"
                      step="2"
                      value={footerOffset}
                      onChange={(e) => setFooterOffset(parseInt(e.target.value, 10))}
                      className="w-full accent-[#E9C349] h-1 bg-[#11212b] rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Default Elements (Seal, Signatures, Verification) */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <ShieldCheck className="w-4 h-4 text-[#E9C349]" />
                  <span className="text-[11px] font-sans font-black text-[#d4e5f2] uppercase tracking-wider">
                    Elementos Padrão (Selo, Assinatura e Código)
                  </span>
                </div>
                
                <div className="space-y-4 bg-[#08151c] p-4 rounded-xl border border-[#172731]">
                   {/* Select default elements */}
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setSelectedElementId(selectedElementId === 'default_seal' ? null : 'default_seal')}
                      className={`text-[8.5px] py-2 px-1 rounded-lg border font-mono transition-all text-center cursor-pointer relative ${
                        selectedElementId === 'default_seal'
                          ? 'bg-[#11212b] border-[#E9C349] text-[#E9C349] font-bold shadow-md'
                          : 'bg-[#0d1c24] border-[#1c2c36] text-[#9cbfd5] hover:text-white'
                      } ${!showSeal ? 'opacity-40 line-through decoration-red-500' : ''}`}
                    >
                      Selo Oficial
                      {!showSeal && <span className="absolute -top-1 -right-1 text-[7px] bg-red-950 text-red-400 font-bold px-1 rounded border border-red-900/40 scale-75">Off</span>}
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedElementId(selectedElementId === 'default_sig' ? null : 'default_sig')}
                      className={`text-[8.5px] py-2 px-1 rounded-lg border font-mono transition-all text-center cursor-pointer relative ${
                        selectedElementId === 'default_sig'
                          ? 'bg-[#11212b] border-[#E9C349] text-[#E9C349] font-bold shadow-md'
                          : 'bg-[#0d1c24] border-[#1c2c36] text-[#9cbfd5] hover:text-white'
                      } ${!showSig ? 'opacity-40 line-through decoration-red-500' : ''}`}
                    >
                      Assinatura
                      {!showSig && <span className="absolute -top-1 -right-1 text-[7px] bg-red-950 text-red-400 font-bold px-1 rounded border border-red-900/40 scale-75">Off</span>}
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedElementId(selectedElementId === 'default_info' ? null : 'default_info')}
                      className={`text-[8.5px] py-2 px-1 rounded-lg border font-mono transition-all text-center cursor-pointer relative ${
                        selectedElementId === 'default_info'
                          ? 'bg-[#11212b] border-[#E9C349] text-[#E9C349] font-bold shadow-md'
                          : 'bg-[#0d1c24] border-[#1c2c36] text-[#9cbfd5] hover:text-white'
                      } ${!showInfo ? 'opacity-40 line-through decoration-red-500' : ''}`}
                    >
                      Código Aut.
                      {!showInfo && <span className="absolute -top-1 -right-1 text-[7px] bg-red-950 text-red-400 font-bold px-1 rounded border border-red-900/40 scale-75">Off</span>}
                    </button>
                  </div>

                  {/* Render sliders for selected default element */}
                  {selectedElementId === 'default_seal' && (
                    <div className="p-2.5 bg-[#11212b] border border-[#E9C349] rounded-lg space-y-2">
                      <div className="flex justify-between items-center">
                        <p className="text-[9px] font-mono text-[#E9C349] font-bold">Editando: Selo Oficial</p>
                        {!showSeal && (
                          <span className="text-[8px] bg-red-950 text-red-400 font-semibold px-1.5 py-0.5 rounded border border-red-900/40 animate-pulse">
                            Inativo
                          </span>
                        )}
                      </div>
                      
                      {/* Slider X */}
                      <div className="space-y-0.5">
                        <div className="flex justify-between text-[8px] font-mono text-[#9cbfd5]">
                          <span>Horizontal (X)</span>
                          <span>{Math.round(sealPos.x)}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          step="1"
                          value={sealPos.x}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            setSealPos(prev => ({ ...prev, x: val }));
                          }}
                          className="w-full accent-[#E9C349] h-1 bg-[#0d1c24] rounded-lg appearance-none cursor-pointer"
                        />
                      </div>

                      {/* Slider Y */}
                      <div className="space-y-0.5">
                        <div className="flex justify-between text-[8px] font-mono text-[#9cbfd5]">
                          <span>Vertical (Y)</span>
                          <span>{Math.round(sealPos.y)}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          step="1"
                          value={sealPos.y}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            setSealPos(prev => ({ ...prev, y: val }));
                          }}
                          className="w-full accent-[#E9C349] h-1 bg-[#0d1c24] rounded-lg appearance-none cursor-pointer"
                        />
                      </div>

                      {/* Slider Width */}
                      <div className="space-y-0.5">
                        <div className="flex justify-between text-[8px] font-mono text-[#9cbfd5]">
                          <span>Tamanho (px)</span>
                          <span>{sealPos.width}px</span>
                        </div>
                        <input
                          type="range"
                          min="30"
                          max="200"
                          step="2"
                          value={sealPos.width}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10);
                            setSealPos(prev => ({ ...prev, width: val }));
                          }}
                          className="w-full accent-[#E9C349] h-1 bg-[#0d1c24] rounded-lg appearance-none cursor-pointer"
                        />
                      </div>

                      {/* Slider Scale */}
                      <div className="space-y-0.5">
                        <div className="flex justify-between text-[8px] font-mono text-[#9cbfd5]">
                          <span>Escala</span>
                          <span>{sealPos.scale.toFixed(1)}x</span>
                        </div>
                        <input
                          type="range"
                          min="0.2"
                          max="3.0"
                          step="0.1"
                          value={sealPos.scale}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            setSealPos(prev => ({ ...prev, scale: val }));
                          }}
                          className="w-full accent-[#E9C349] h-1 bg-[#0d1c24] rounded-lg appearance-none cursor-pointer"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setSealPos({ x: 50, y: 82, scale: 1.0, width: 64 })}
                          className="w-full text-center text-[8px] font-mono text-[#9cbfd5] hover:text-white bg-white/5 py-1.5 rounded border border-white/10 hover:border-white/20 cursor-pointer"
                        >
                          Resetar Pos.
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowSeal(!showSeal)}
                          className={`text-center text-[8px] font-mono py-1.5 rounded border cursor-pointer transition-all ${
                            showSeal
                              ? 'text-red-400 hover:text-red-300 bg-red-950/20 hover:bg-red-900/30 border-red-900/40'
                              : 'text-green-400 hover:text-green-300 bg-green-950/20 hover:bg-green-900/30 border-green-900/40'
                          }`}
                        >
                          {showSeal ? 'Excluir Selo' : 'Ativar Selo'}
                        </button>
                      </div>
                    </div>
                  )}

                  {selectedElementId === 'default_sig' && (
                    <div className="p-2.5 bg-[#11212b] border border-[#E9C349] rounded-lg space-y-2">
                      <div className="flex justify-between items-center">
                        <p className="text-[9px] font-mono text-[#E9C349] font-bold">Editando: Assinatura</p>
                        {!showSig && (
                          <span className="text-[8px] bg-red-950 text-red-400 font-semibold px-1.5 py-0.5 rounded border border-red-900/40 animate-pulse">
                            Inativo
                          </span>
                        )}
                      </div>
                      
                      {/* Slider X */}
                      <div className="space-y-0.5">
                        <div className="flex justify-between text-[8px] font-mono text-[#9cbfd5]">
                          <span>Horizontal (X)</span>
                          <span>{Math.round(sigPos.x)}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          step="1"
                          value={sigPos.x}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            setSigPos(prev => ({ ...prev, x: val }));
                          }}
                          className="w-full accent-[#E9C349] h-1 bg-[#0d1c24] rounded-lg appearance-none cursor-pointer"
                        />
                      </div>

                      {/* Slider Y */}
                      <div className="space-y-0.5">
                        <div className="flex justify-between text-[8px] font-mono text-[#9cbfd5]">
                          <span>Vertical (Y)</span>
                          <span>{Math.round(sigPos.y)}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          step="1"
                          value={sigPos.y}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            setSigPos(prev => ({ ...prev, y: val }));
                          }}
                          className="w-full accent-[#E9C349] h-1 bg-[#0d1c24] rounded-lg appearance-none cursor-pointer"
                        />
                      </div>

                      {/* Slider Width */}
                      <div className="space-y-0.5">
                        <div className="flex justify-between text-[8px] font-mono text-[#9cbfd5]">
                          <span>Largura (px)</span>
                          <span>{sigPos.width}px</span>
                        </div>
                        <input
                          type="range"
                          min="50"
                          max="400"
                          step="5"
                          value={sigPos.width}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10);
                            setSigPos(prev => ({ ...prev, width: val }));
                          }}
                          className="w-full accent-[#E9C349] h-1 bg-[#0d1c24] rounded-lg appearance-none cursor-pointer"
                        />
                      </div>

                      {/* Slider Scale */}
                      <div className="space-y-0.5">
                        <div className="flex justify-between text-[8px] font-mono text-[#9cbfd5]">
                          <span>Escala</span>
                          <span>{sigPos.scale.toFixed(1)}x</span>
                        </div>
                        <input
                          type="range"
                          min="0.2"
                          max="3.0"
                          step="0.1"
                          value={sigPos.scale}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            setSigPos(prev => ({ ...prev, scale: val }));
                          }}
                          className="w-full accent-[#E9C349] h-1 bg-[#0d1c24] rounded-lg appearance-none cursor-pointer"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setSigPos({ x: 80, y: 82, scale: 1.0, width: 192 })}
                          className="w-full text-center text-[8px] font-mono text-[#9cbfd5] hover:text-white bg-white/5 py-1.5 rounded border border-white/10 hover:border-white/20 cursor-pointer"
                        >
                          Resetar Pos.
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowSig(!showSig)}
                          className={`text-center text-[8px] font-mono py-1.5 rounded border cursor-pointer transition-all ${
                            showSig
                              ? 'text-red-400 hover:text-red-300 bg-red-950/20 hover:bg-red-900/30 border-red-900/40'
                              : 'text-green-400 hover:text-green-300 bg-green-950/20 hover:bg-green-900/30 border-green-900/40'
                          }`}
                        >
                          {showSig ? 'Excluir Ass.' : 'Ativar Ass.'}
                        </button>
                      </div>
                    </div>
                  )}

                  {selectedElementId === 'default_info' && (
                    <div className="p-2.5 bg-[#11212b] border border-[#E9C349] rounded-lg space-y-2">
                      <div className="flex justify-between items-center">
                        <p className="text-[9px] font-mono text-[#E9C349] font-bold">Editando: Cód. Autenticidade</p>
                        {!showInfo && (
                          <span className="text-[8px] bg-red-950 text-red-400 font-semibold px-1.5 py-0.5 rounded border border-red-900/40 animate-pulse">
                            Inativo
                          </span>
                        )}
                      </div>
                      
                      {/* Slider X */}
                      <div className="space-y-0.5">
                        <div className="flex justify-between text-[8px] font-mono text-[#9cbfd5]">
                          <span>Horizontal (X)</span>
                          <span>{Math.round(infoPos.x)}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          step="1"
                          value={infoPos.x}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            setInfoPos(prev => ({ ...prev, x: val }));
                          }}
                          className="w-full accent-[#E9C349] h-1 bg-[#0d1c24] rounded-lg appearance-none cursor-pointer"
                        />
                      </div>

                      {/* Slider Y */}
                      <div className="space-y-0.5">
                        <div className="flex justify-between text-[8px] font-mono text-[#9cbfd5]">
                          <span>Vertical (Y)</span>
                          <span>{Math.round(infoPos.y)}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          step="1"
                          value={infoPos.y}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            setInfoPos(prev => ({ ...prev, y: val }));
                          }}
                          className="w-full accent-[#E9C349] h-1 bg-[#0d1c24] rounded-lg appearance-none cursor-pointer"
                        />
                      </div>

                      {/* Slider Width */}
                      <div className="space-y-0.5">
                        <div className="flex justify-between text-[8px] font-mono text-[#9cbfd5]">
                          <span>Largura (px)</span>
                          <span>{infoPos.width}px</span>
                        </div>
                        <input
                          type="range"
                          min="50"
                          max="400"
                          step="5"
                          value={infoPos.width}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10);
                            setInfoPos(prev => ({ ...prev, width: val }));
                          }}
                          className="w-full accent-[#E9C349] h-1 bg-[#0d1c24] rounded-lg appearance-none cursor-pointer"
                        />
                      </div>

                      {/* Slider Scale */}
                      <div className="space-y-0.5">
                        <div className="flex justify-between text-[8px] font-mono text-[#9cbfd5]">
                          <span>Escala</span>
                          <span>{infoPos.scale.toFixed(1)}x</span>
                        </div>
                        <input
                          type="range"
                          min="0.2"
                          max="3.0"
                          step="0.1"
                          value={infoPos.scale}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            setInfoPos(prev => ({ ...prev, scale: val }));
                          }}
                          className="w-full accent-[#E9C349] h-1 bg-[#0d1c24] rounded-lg appearance-none cursor-pointer"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setInfoPos({ x: 20, y: 82, scale: 1.0, width: 200 })}
                          className="w-full text-center text-[8px] font-mono text-[#9cbfd5] hover:text-white bg-white/5 py-1.5 rounded border border-white/10 hover:border-white/20 cursor-pointer"
                        >
                          Resetar Pos.
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowInfo(!showInfo)}
                          className={`text-center text-[8px] font-mono py-1.5 rounded border cursor-pointer transition-all ${
                            showInfo
                              ? 'text-red-400 hover:text-red-300 bg-red-950/20 hover:bg-red-900/30 border-red-900/40'
                              : 'text-green-400 hover:text-green-300 bg-green-950/20 hover:bg-green-900/30 border-green-900/40'
                          }`}
                        >
                          {showInfo ? 'Excluir Cód.' : 'Ativar Cód.'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Unified Masonic Symbols & Extra Elements Section */}
              {showMasonicSymbols && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-[#E9C349]" />
                      <span className="text-[11px] font-sans font-black text-[#d4e5f2] uppercase tracking-wider">
                        Símbolos e Elementos Extras
                      </span>
                    </div>
                    
                    {/* Upload element */}
                    <button
                      type="button"
                      onClick={() => elementInputRef.current?.click()}
                      disabled={isCompactingElement}
                      className="bg-[#11212b] border border-[#1c2c36] hover:border-[#E9C349]/50 text-white text-[10px] px-2 py-1 rounded flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                    >
                      <Upload className="w-3 h-3 text-[#E9C349]" />
                      <span>{isCompactingElement ? 'Adicionando...' : 'Enviar Imagem'}</span>
                    </button>
                    <input
                      type="file"
                      ref={elementInputRef}
                      onChange={handleElementUpload}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                  
                  <div className="space-y-4 bg-[#08151c] p-4 rounded-xl border border-[#172731]">
                    {/* Grid of standard symbols + custom elements */}
                    <div className="grid grid-cols-2 gap-1.5">
                      {/* 1. Coluna Esq */}
                      <button
                        type="button"
                        onClick={() => setSelectedElementId(selectedElementId === 'col_esq' ? null : 'col_esq')}
                        className={`text-[8.5px] py-1.5 px-1 rounded-lg border font-mono transition-all text-center cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                          selectedElementId === 'col_esq'
                            ? 'bg-[#11212b] border-[#E9C349] text-[#E9C349] font-bold shadow-md'
                            : 'bg-[#0d1c24] border-[#1c2c36] text-[#9cbfd5] hover:text-white'
                        } ${!showColEsq ? 'opacity-40' : ''}`}
                      >
                        <span>Coluna Esq. (Boaz)</span>
                        {!showColEsq && <span className="text-[7.5px] text-red-400 font-bold">(Oculto)</span>}
                      </button>

                      {/* 2. Coluna Dir */}
                      <button
                        type="button"
                        onClick={() => setSelectedElementId(selectedElementId === 'col_dir' ? null : 'col_dir')}
                        className={`text-[8.5px] py-1.5 px-1 rounded-lg border font-mono transition-all text-center cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                          selectedElementId === 'col_dir'
                            ? 'bg-[#11212b] border-[#E9C349] text-[#E9C349] font-bold shadow-md'
                            : 'bg-[#0d1c24] border-[#1c2c36] text-[#9cbfd5] hover:text-white'
                        } ${!showColDir ? 'opacity-40' : ''}`}
                      >
                        <span>Coluna Dir. (Jachin)</span>
                        {!showColDir && <span className="text-[7.5px] text-red-400 font-bold">(Oculto)</span>}
                      </button>

                      {/* 3. Olho */}
                      <button
                        type="button"
                        onClick={() => setSelectedElementId(selectedElementId === 'olho' ? null : 'olho')}
                        className={`text-[8.5px] py-1.5 px-1 rounded-lg border font-mono transition-all text-center cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                          selectedElementId === 'olho'
                            ? 'bg-[#11212b] border-[#E9C349] text-[#E9C349] font-bold shadow-md'
                            : 'bg-[#0d1c24] border-[#1c2c36] text-[#9cbfd5] hover:text-white'
                        } ${!showOlho ? 'opacity-40' : ''}`}
                      >
                        <span>Olho que tudo vê</span>
                        {!showOlho && <span className="text-[7.5px] text-red-400 font-bold">(Oculto)</span>}
                      </button>

                      {/* 4. Esquadro */}
                      <button
                        type="button"
                        onClick={() => setSelectedElementId(selectedElementId === 'esquadro' ? null : 'esquadro')}
                        className={`text-[8.5px] py-1.5 px-1 rounded-lg border font-mono transition-all text-center cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                          selectedElementId === 'esquadro'
                            ? 'bg-[#11212b] border-[#E9C349] text-[#E9C349] font-bold shadow-md'
                            : 'bg-[#0d1c24] border-[#1c2c36] text-[#9cbfd5] hover:text-white'
                        } ${!showEsquadro ? 'opacity-40' : ''}`}
                      >
                        <span>Esquadro/Compasso</span>
                        {!showEsquadro && <span className="text-[7.5px] text-red-400 font-bold">(Oculto)</span>}
                      </button>

                      {/* 5. Malho */}
                      <button
                        type="button"
                        onClick={() => setSelectedElementId(selectedElementId === 'malho' ? null : 'malho')}
                        className={`text-[8.5px] py-1.5 px-1 rounded-lg border font-mono transition-all text-center cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                          selectedElementId === 'malho'
                            ? 'bg-[#11212b] border-[#E9C349] text-[#E9C349] font-bold shadow-md'
                            : 'bg-[#0d1c24] border-[#1c2c36] text-[#9cbfd5] hover:text-white'
                        } ${!showMalho ? 'opacity-40' : ''}`}
                      >
                        <span>Malho e Cinzel</span>
                        {!showMalho && <span className="text-[7.5px] text-red-400 font-bold">(Oculto)</span>}
                      </button>

                      {/* 6. Acacia */}
                      <button
                        type="button"
                        onClick={() => setSelectedElementId(selectedElementId === 'acacia' ? null : 'acacia')}
                        className={`text-[8.5px] py-1.5 px-1 rounded-lg border font-mono transition-all text-center cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                          selectedElementId === 'acacia'
                            ? 'bg-[#11212b] border-[#E9C349] text-[#E9C349] font-bold shadow-md'
                            : 'bg-[#0d1c24] border-[#1c2c36] text-[#9cbfd5] hover:text-white'
                        } ${!showAcacia ? 'opacity-40' : ''}`}
                      >
                        <span>Ramo de Acácia</span>
                        {!showAcacia && <span className="text-[7.5px] text-red-400 font-bold">(Oculto)</span>}
                      </button>

                      {/* 7. Custom elements mapped right in the same grid */}
                      {customElements.map((el, idx) => (
                        <button
                          key={el.id}
                          type="button"
                          onClick={() => setSelectedElementId(selectedElementId === el.id ? null : el.id)}
                          className={`text-[8.5px] py-1.5 px-1 rounded-lg border font-mono transition-all text-center flex flex-col items-center justify-center gap-1 cursor-pointer truncate ${
                            selectedElementId === el.id
                              ? 'bg-[#11212b] border-[#E9C349] text-[#E9C349] font-bold shadow-md'
                              : 'bg-[#0d1c24] border-[#1c2c36] text-[#9cbfd5] hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-1 max-w-full">
                            <img src={el.src} className="w-3.5 h-3.5 object-contain rounded bg-white/10 shrink-0" alt="" />
                            <span className="truncate">Imagem Extra #{idx + 1}</span>
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Render Controls for Selected Element */}
                    {selectedElementId && (
                      (() => {
                        const standardData = getBuiltInElementData(selectedElementId);
                        if (standardData) {
                          return (
                            <div className="p-3 bg-[#11212b] border border-[#E9C349] rounded-lg space-y-2.5">
                              <div className="flex justify-between items-center">
                                <p className="text-[9px] font-mono text-[#E9C349] font-bold">
                                  Editando: {standardData.name}
                                </p>
                                {!standardData.show && (
                                  <span className="text-[8px] bg-red-950 text-red-400 font-semibold px-1.5 py-0.5 rounded border border-red-900/40">
                                    Inativo
                                  </span>
                                )}
                              </div>

                              {/* Sliders for Standard Symbol */}
                              <div className="space-y-2">
                                {/* Slider X */}
                                <div className="space-y-0.5">
                                  <div className="flex justify-between text-[8px] font-mono text-[#9cbfd5]">
                                    <span>Horizontal (X)</span>
                                    <span>{Math.round(standardData.pos.x)}%</span>
                                  </div>
                                  <input
                                    type="range" min="0" max="100" step="1"
                                    value={standardData.pos.x}
                                    onChange={(e) => standardData.setPos(prev => ({ ...prev, x: parseFloat(e.target.value) }))}
                                    className="w-full accent-[#E9C349] h-1 bg-[#0d1c24] rounded-lg appearance-none cursor-pointer"
                                  />
                                </div>

                                {/* Slider Y */}
                                <div className="space-y-0.5">
                                  <div className="flex justify-between text-[8px] font-mono text-[#9cbfd5]">
                                    <span>Vertical (Y)</span>
                                    <span>{Math.round(standardData.pos.y)}%</span>
                                  </div>
                                  <input
                                    type="range" min="0" max="100" step="1"
                                    value={standardData.pos.y}
                                    onChange={(e) => standardData.setPos(prev => ({ ...prev, y: parseFloat(e.target.value) }))}
                                    className="w-full accent-[#E9C349] h-1 bg-[#0d1c24] rounded-lg appearance-none cursor-pointer"
                                  />
                                </div>

                                {/* Slider Width */}
                                <div className="space-y-0.5">
                                  <div className="flex justify-between text-[8px] font-mono text-[#9cbfd5]">
                                    <span>Largura (px)</span>
                                    <span>{standardData.pos.width}px</span>
                                  </div>
                                  <input
                                    type="range" min="10" max="300" step="2"
                                    value={standardData.pos.width}
                                    onChange={(e) => standardData.setPos(prev => ({ ...prev, width: parseInt(e.target.value, 10) }))}
                                    className="w-full accent-[#E9C349] h-1 bg-[#0d1c24] rounded-lg appearance-none cursor-pointer"
                                  />
                                </div>

                                {/* Slider Scale */}
                                <div className="space-y-0.5">
                                  <div className="flex justify-between text-[8px] font-mono text-[#9cbfd5]">
                                    <span>Escala</span>
                                    <span>{standardData.pos.scale.toFixed(1)}x</span>
                                  </div>
                                  <input
                                    type="range" min="0.1" max="3.0" step="0.1"
                                    value={standardData.pos.scale}
                                    onChange={(e) => standardData.setPos(prev => ({ ...prev, scale: parseFloat(e.target.value) }))}
                                    className="w-full accent-[#E9C349] h-1 bg-[#0d1c24] rounded-lg appearance-none cursor-pointer"
                                  />
                                </div>
                              </div>

                              {/* Actions */}
                              <div className="grid grid-cols-2 gap-2 pt-1">
                                <button
                                  type="button"
                                  onClick={() => standardData.setPos(standardData.defaultPos)}
                                  className="text-center text-[8.5px] font-mono text-[#9cbfd5] hover:text-white bg-white/5 py-1 rounded border border-white/10 hover:border-white/20 cursor-pointer"
                                >
                                  Resetar Posição
                                </button>
                                
                                <button
                                  type="button"
                                  onClick={() => standardData.setShow(!standardData.show)}
                                  className={`text-center text-[8.5px] font-mono py-1 rounded border cursor-pointer ${
                                    standardData.show
                                      ? 'text-red-400 hover:text-red-300 bg-red-950/20 hover:bg-red-900/30 border-red-900/40'
                                      : 'text-green-400 hover:text-green-300 bg-green-950/20 hover:bg-green-900/30 border-green-900/40'
                                  }`}
                                >
                                  {standardData.show ? 'Excluir Símbolo' : 'Ativar Símbolo'}
                                </button>
                              </div>
                            </div>
                          );
                        }

                        const customEl = customElements.find(item => item.id === selectedElementId);
                        if (customEl) {
                          const customIdx = customElements.findIndex(item => item.id === selectedElementId);
                          return (
                            <div className="p-3 bg-[#11212b] border border-[#E9C349] rounded-lg space-y-2.5">
                              <p className="text-[9px] font-mono text-[#E9C349] font-bold">
                                Editando: Imagem Extra #{customIdx + 1}
                              </p>

                              {/* Sliders for Custom Element */}
                              <div className="space-y-2">
                                {/* Slider X */}
                                <div className="space-y-0.5">
                                  <div className="flex justify-between text-[8px] font-mono text-[#9cbfd5]">
                                    <span>Horizontal (X)</span>
                                    <span>{Math.round(customEl.x)}%</span>
                                  </div>
                                  <input
                                    type="range" min="0" max="100" step="1"
                                    value={customEl.x}
                                    onChange={(e) => {
                                      const val = parseFloat(e.target.value);
                                      setCustomElements(prev => prev.map(item => item.id === customEl.id ? { ...item, x: val } : item));
                                    }}
                                    className="w-full accent-[#E9C349] h-1 bg-[#0d1c24] rounded-lg appearance-none cursor-pointer"
                                  />
                                </div>

                                {/* Slider Y */}
                                <div className="space-y-0.5">
                                  <div className="flex justify-between text-[8px] font-mono text-[#9cbfd5]">
                                    <span>Vertical (Y)</span>
                                    <span>{Math.round(customEl.y)}%</span>
                                  </div>
                                  <input
                                    type="range" min="0" max="100" step="1"
                                    value={customEl.y}
                                    onChange={(e) => {
                                      const val = parseFloat(e.target.value);
                                      setCustomElements(prev => prev.map(item => item.id === customEl.id ? { ...item, y: val } : item));
                                    }}
                                    className="w-full accent-[#E9C349] h-1 bg-[#0d1c24] rounded-lg appearance-none cursor-pointer"
                                  />
                                </div>

                                {/* Slider Width */}
                                <div className="space-y-0.5">
                                  <div className="flex justify-between text-[8px] font-mono text-[#9cbfd5]">
                                    <span>Largura</span>
                                    <span>{customEl.width}px</span>
                                  </div>
                                  <input
                                    type="range" min="10" max="300" step="5"
                                    value={customEl.width}
                                    onChange={(e) => {
                                      const val = parseInt(e.target.value, 10);
                                      setCustomElements(prev => prev.map(item => item.id === customEl.id ? { ...item, width: val } : item));
                                    }}
                                    className="w-full accent-[#E9C349] h-1 bg-[#0d1c24] rounded-lg appearance-none cursor-pointer"
                                  />
                                </div>

                                {/* Slider Scale */}
                                <div className="space-y-0.5">
                                  <div className="flex justify-between text-[8px] font-mono text-[#9cbfd5]">
                                    <span>Escala</span>
                                    <span>{customEl.scale.toFixed(1)}x</span>
                                  </div>
                                  <input
                                    type="range" min="0.2" max="3.0" step="0.1"
                                    value={customEl.scale}
                                    onChange={(e) => {
                                      const val = parseFloat(e.target.value);
                                      setCustomElements(prev => prev.map(item => item.id === customEl.id ? { ...item, scale: val } : item));
                                    }}
                                    className="w-full accent-[#E9C349] h-1 bg-[#0d1c24] rounded-lg appearance-none cursor-pointer"
                                  />
                                </div>
                              </div>

                              {/* Actions */}
                              <div className="pt-1">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setCustomElements(prev => prev.filter(item => item.id !== customEl.id));
                                    setSelectedElementId(null);
                                  }}
                                  className="w-full text-center text-[8.5px] font-mono text-red-400 hover:text-red-300 bg-red-950/20 hover:bg-red-900/30 py-1.5 rounded border border-red-900/40 cursor-pointer"
                                >
                                  Excluir Elemento Extra
                                </button>
                              </div>
                            </div>
                          );
                        }

                        return null;
                      })()
                    )}

                  </div>
                </div>
              )}

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
              ref={previewRef}
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  setSelectedElementId(null);
                }
              }}
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
              
              {/* Standard Masonic Vector Art Overlays as Draggable Elements */}
              {showMasonicSymbols && (
                <>
                  {/* Left Column (Boaz) */}
                  {showColEsq && (
                    <div
                      className={`absolute select-none pointer-events-auto transition-shadow ${
                        selectedElementId === 'col_esq'
                          ? 'ring-2 ring-dashed ring-[#E9C349] ring-offset-2 ring-offset-[#06273A] shadow-xl z-30'
                          : 'hover:ring-1 hover:ring-dashed hover:ring-[#E9C349]/50 z-20'
                      }`}
                      style={{
                        left: `${colunaEsqPos.x}%`,
                        top: `${colunaEsqPos.y}%`,
                        transform: `translate(-50%, -50%) scale(${colunaEsqPos.scale})`,
                        cursor: draggedElementId === 'col_esq' ? 'grabbing' : 'grab',
                        touchAction: 'none',
                        width: `${colunaEsqPos.width}px`,
                        height: `${colunaEsqPos.width * (410 / 60)}px`,
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedElementId('col_esq');
                      }}
                      onPointerDown={(e) => {
                        e.stopPropagation();
                        e.currentTarget.setPointerCapture(e.pointerId);
                        setDraggedElementId('col_esq');
                        setSelectedElementId('col_esq');
                        dragInfoRef.current = {
                          id: 'col_esq',
                          startX: colunaEsqPos.x,
                          startY: colunaEsqPos.y,
                          startClientX: e.clientX,
                          startClientY: e.clientY
                        };
                      }}
                      onPointerMove={(e) => {
                        const dragInfo = dragInfoRef.current;
                        if (!dragInfo || dragInfo.id !== 'col_esq' || draggedElementId !== 'col_esq') return;
                        e.stopPropagation();
                        const container = previewRef.current;
                        if (!container) return;
                        const rect = container.getBoundingClientRect();
                        const dxPercent = ((e.clientX - dragInfo.startClientX) / rect.width) * 100;
                        const dyPercent = ((e.clientY - dragInfo.startClientY) / rect.height) * 100;
                        let newX = Math.max(0, Math.min(100, dragInfo.startX + dxPercent));
                        let newY = Math.max(0, Math.min(100, dragInfo.startY + dyPercent));
                        setColunaEsqPos(prev => ({ ...prev, x: newX, y: newY }));
                      }}
                      onPointerUp={(e) => {
                        e.stopPropagation();
                        e.currentTarget.releasePointerCapture(e.pointerId);
                        setDraggedElementId(null);
                        dragInfoRef.current = null;
                      }}
                      onPointerCancel={(e) => {
                        e.currentTarget.releasePointerCapture(e.pointerId);
                        setDraggedElementId(null);
                        dragInfoRef.current = null;
                      }}
                    >
                      <svg className="w-full h-full" viewBox="40 90 60 410" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                      </svg>
                    </div>
                  )}

                  {/* Right Column (Jachin) */}
                  {showColDir && (
                    <div
                      className={`absolute select-none pointer-events-auto transition-shadow ${
                        selectedElementId === 'col_dir'
                          ? 'ring-2 ring-dashed ring-[#E9C349] ring-offset-2 ring-offset-[#06273A] shadow-xl z-30'
                          : 'hover:ring-1 hover:ring-dashed hover:ring-[#E9C349]/50 z-20'
                      }`}
                      style={{
                        left: `${colunaDirPos.x}%`,
                        top: `${colunaDirPos.y}%`,
                        transform: `translate(-50%, -50%) scale(${colunaDirPos.scale})`,
                        cursor: draggedElementId === 'col_dir' ? 'grabbing' : 'grab',
                        touchAction: 'none',
                        width: `${colunaDirPos.width}px`,
                        height: `${colunaDirPos.width * (410 / 60)}px`,
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedElementId('col_dir');
                      }}
                      onPointerDown={(e) => {
                        e.stopPropagation();
                        e.currentTarget.setPointerCapture(e.pointerId);
                        setDraggedElementId('col_dir');
                        setSelectedElementId('col_dir');
                        dragInfoRef.current = {
                          id: 'col_dir',
                          startX: colunaDirPos.x,
                          startY: colunaDirPos.y,
                          startClientX: e.clientX,
                          startClientY: e.clientY
                        };
                      }}
                      onPointerMove={(e) => {
                        const dragInfo = dragInfoRef.current;
                        if (!dragInfo || dragInfo.id !== 'col_dir' || draggedElementId !== 'col_dir') return;
                        e.stopPropagation();
                        const container = previewRef.current;
                        if (!container) return;
                        const rect = container.getBoundingClientRect();
                        const dxPercent = ((e.clientX - dragInfo.startClientX) / rect.width) * 100;
                        const dyPercent = ((e.clientY - dragInfo.startClientY) / rect.height) * 100;
                        let newX = Math.max(0, Math.min(100, dragInfo.startX + dxPercent));
                        let newY = Math.max(0, Math.min(100, dragInfo.startY + dyPercent));
                        setColunaDirPos(prev => ({ ...prev, x: newX, y: newY }));
                      }}
                      onPointerUp={(e) => {
                        e.stopPropagation();
                        e.currentTarget.releasePointerCapture(e.pointerId);
                        setDraggedElementId(null);
                        dragInfoRef.current = null;
                      }}
                      onPointerCancel={(e) => {
                        e.currentTarget.releasePointerCapture(e.pointerId);
                        setDraggedElementId(null);
                        dragInfoRef.current = null;
                      }}
                    >
                      <svg className="w-full h-full" viewBox="800 90 60 410" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                      </svg>
                    </div>
                  )}

                  {/* Eye of Providence (Olho que tudo vê) */}
                  {showOlho && (
                    <div
                      className={`absolute select-none pointer-events-auto transition-shadow ${
                        selectedElementId === 'olho'
                          ? 'ring-2 ring-dashed ring-[#E9C349] ring-offset-2 ring-offset-[#06273A] shadow-xl z-30'
                          : 'hover:ring-1 hover:ring-dashed hover:ring-[#E9C349]/50 z-20'
                      }`}
                      style={{
                        left: `${olhoPos.x}%`,
                        top: `${olhoPos.y}%`,
                        transform: `translate(-50%, -50%) scale(${olhoPos.scale})`,
                        cursor: draggedElementId === 'olho' ? 'grabbing' : 'grab',
                        touchAction: 'none',
                        width: `${olhoPos.width}px`,
                        height: `${olhoPos.width}px`,
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedElementId('olho');
                      }}
                      onPointerDown={(e) => {
                        e.stopPropagation();
                        e.currentTarget.setPointerCapture(e.pointerId);
                        setDraggedElementId('olho');
                        setSelectedElementId('olho');
                        dragInfoRef.current = {
                          id: 'olho',
                          startX: olhoPos.x,
                          startY: olhoPos.y,
                          startClientX: e.clientX,
                          startClientY: e.clientY
                        };
                      }}
                      onPointerMove={(e) => {
                        const dragInfo = dragInfoRef.current;
                        if (!dragInfo || dragInfo.id !== 'olho' || draggedElementId !== 'olho') return;
                        e.stopPropagation();
                        const container = previewRef.current;
                        if (!container) return;
                        const rect = container.getBoundingClientRect();
                        const dxPercent = ((e.clientX - dragInfo.startClientX) / rect.width) * 100;
                        const dyPercent = ((e.clientY - dragInfo.startClientY) / rect.height) * 100;
                        let newX = Math.max(0, Math.min(100, dragInfo.startX + dxPercent));
                        let newY = Math.max(0, Math.min(100, dragInfo.startY + dyPercent));
                        setOlhoPos(prev => ({ ...prev, x: newX, y: newY }));
                      }}
                      onPointerUp={(e) => {
                        e.stopPropagation();
                        e.currentTarget.releasePointerCapture(e.pointerId);
                        setDraggedElementId(null);
                        dragInfoRef.current = null;
                      }}
                      onPointerCancel={(e) => {
                        e.currentTarget.releasePointerCapture(e.pointerId);
                        setDraggedElementId(null);
                        dragInfoRef.current = null;
                      }}
                    >
                      <svg className="w-full h-full" viewBox="-35 -35 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g stroke="#d4af37" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" opacity={symbolsOpacity + 0.03}>
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
                      </svg>
                    </div>
                  )}

                  {/* Square and Compass with Acacia inside and Letter G */}
                  {showEsquadro && (
                    <div
                      className={`absolute select-none pointer-events-auto transition-shadow ${
                        selectedElementId === 'esquadro'
                          ? 'ring-2 ring-dashed ring-[#E9C349] ring-offset-2 ring-offset-[#06273A] shadow-xl z-30'
                          : 'hover:ring-1 hover:ring-dashed hover:ring-[#E9C349]/50 z-20'
                      }`}
                      style={{
                        left: `${esquadroPos.x}%`,
                        top: `${esquadroPos.y}%`,
                        transform: `translate(-50%, -50%) scale(${esquadroPos.scale})`,
                        cursor: draggedElementId === 'esquadro' ? 'grabbing' : 'grab',
                        touchAction: 'none',
                        width: `${esquadroPos.width}px`,
                        height: `${esquadroPos.width * (200 / 180)}px`,
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedElementId('esquadro');
                      }}
                      onPointerDown={(e) => {
                        e.stopPropagation();
                        e.currentTarget.setPointerCapture(e.pointerId);
                        setDraggedElementId('esquadro');
                        setSelectedElementId('esquadro');
                        dragInfoRef.current = {
                          id: 'esquadro',
                          startX: esquadroPos.x,
                          startY: esquadroPos.y,
                          startClientX: e.clientX,
                          startClientY: e.clientY
                        };
                      }}
                      onPointerMove={(e) => {
                        const dragInfo = dragInfoRef.current;
                        if (!dragInfo || dragInfo.id !== 'esquadro' || draggedElementId !== 'esquadro') return;
                        e.stopPropagation();
                        const container = previewRef.current;
                        if (!container) return;
                        const rect = container.getBoundingClientRect();
                        const dxPercent = ((e.clientX - dragInfo.startClientX) / rect.width) * 100;
                        const dyPercent = ((e.clientY - dragInfo.startClientY) / rect.height) * 100;
                        let newX = Math.max(0, Math.min(100, dragInfo.startX + dxPercent));
                        let newY = Math.max(0, Math.min(100, dragInfo.startY + dyPercent));
                        setEsquadroPos(prev => ({ ...prev, x: newX, y: newY }));
                      }}
                      onPointerUp={(e) => {
                        e.stopPropagation();
                        e.currentTarget.releasePointerCapture(e.pointerId);
                        setDraggedElementId(null);
                        dragInfoRef.current = null;
                      }}
                      onPointerCancel={(e) => {
                        e.currentTarget.releasePointerCapture(e.pointerId);
                        setDraggedElementId(null);
                        dragInfoRef.current = null;
                      }}
                    >
                      <svg className="w-full h-full" viewBox="-90 -125 180 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g stroke="#d4af37" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" opacity={symbolsOpacity * 0.7}>
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
                      </svg>
                    </div>
                  )}

                  {/* Mallet and Chisel (Malho e Cinzel) */}
                  {showMalho && (
                    <div
                      className={`absolute select-none pointer-events-auto transition-shadow ${
                        selectedElementId === 'malho'
                          ? 'ring-2 ring-dashed ring-[#E9C349] ring-offset-2 ring-offset-[#06273A] shadow-xl z-30'
                          : 'hover:ring-1 hover:ring-dashed hover:ring-[#E9C349]/50 z-20'
                      }`}
                      style={{
                        left: `${malhoPos.x}%`,
                        top: `${malhoPos.y}%`,
                        transform: `translate(-50%, -50%) scale(${malhoPos.scale})`,
                        cursor: draggedElementId === 'malho' ? 'grabbing' : 'grab',
                        touchAction: 'none',
                        width: `${malhoPos.width}px`,
                        height: `${malhoPos.width * (70 / 60)}px`,
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedElementId('malho');
                      }}
                      onPointerDown={(e) => {
                        e.stopPropagation();
                        e.currentTarget.setPointerCapture(e.pointerId);
                        setDraggedElementId('malho');
                        setSelectedElementId('malho');
                        dragInfoRef.current = {
                          id: 'malho',
                          startX: malhoPos.x,
                          startY: malhoPos.y,
                          startClientX: e.clientX,
                          startClientY: e.clientY
                        };
                      }}
                      onPointerMove={(e) => {
                        const dragInfo = dragInfoRef.current;
                        if (!dragInfo || dragInfo.id !== 'malho' || draggedElementId !== 'malho') return;
                        e.stopPropagation();
                        const container = previewRef.current;
                        if (!container) return;
                        const rect = container.getBoundingClientRect();
                        const dxPercent = ((e.clientX - dragInfo.startClientX) / rect.width) * 100;
                        const dyPercent = ((e.clientY - dragInfo.startClientY) / rect.height) * 100;
                        let newX = Math.max(0, Math.min(100, dragInfo.startX + dxPercent));
                        let newY = Math.max(0, Math.min(100, dragInfo.startY + dyPercent));
                        setMalhoPos(prev => ({ ...prev, x: newX, y: newY }));
                      }}
                      onPointerUp={(e) => {
                        e.stopPropagation();
                        e.currentTarget.releasePointerCapture(e.pointerId);
                        setDraggedElementId(null);
                        dragInfoRef.current = null;
                      }}
                      onPointerCancel={(e) => {
                        e.currentTarget.releasePointerCapture(e.pointerId);
                        setDraggedElementId(null);
                        dragInfoRef.current = null;
                      }}
                    >
                      <svg className="w-full h-full" viewBox="-30 -45 60 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g stroke="#d4af37" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" opacity={symbolsOpacity * 0.8}>
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
                      </svg>
                    </div>
                  )}

                  {/* Acacia Branches (Acácia) */}
                  {showAcacia && (
                    <div
                      className={`absolute select-none pointer-events-auto transition-shadow ${
                        selectedElementId === 'acacia'
                          ? 'ring-2 ring-dashed ring-[#E9C349] ring-offset-2 ring-offset-[#06273A] shadow-xl z-30'
                          : 'hover:ring-1 hover:ring-dashed hover:ring-[#E9C349]/50 z-20'
                      }`}
                      style={{
                        left: `${acaciaPos.x}%`,
                        top: `${acaciaPos.y}%`,
                        transform: `translate(-50%, -50%) scale(${acaciaPos.scale}) rotate(20deg)`,
                        cursor: draggedElementId === 'acacia' ? 'grabbing' : 'grab',
                        touchAction: 'none',
                        width: `${acaciaPos.width}px`,
                        height: `${acaciaPos.width}px`,
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedElementId('acacia');
                      }}
                      onPointerDown={(e) => {
                        e.stopPropagation();
                        e.currentTarget.setPointerCapture(e.pointerId);
                        setDraggedElementId('acacia');
                        setSelectedElementId('acacia');
                        dragInfoRef.current = {
                          id: 'acacia',
                          startX: acaciaPos.x,
                          startY: acaciaPos.y,
                          startClientX: e.clientX,
                          startClientY: e.clientY
                        };
                      }}
                      onPointerMove={(e) => {
                        const dragInfo = dragInfoRef.current;
                        if (!dragInfo || dragInfo.id !== 'acacia' || draggedElementId !== 'acacia') return;
                        e.stopPropagation();
                        const container = previewRef.current;
                        if (!container) return;
                        const rect = container.getBoundingClientRect();
                        const dxPercent = ((e.clientX - dragInfo.startClientX) / rect.width) * 100;
                        const dyPercent = ((e.clientY - dragInfo.startClientY) / rect.height) * 100;
                        let newX = Math.max(0, Math.min(100, dragInfo.startX + dxPercent));
                        let newY = Math.max(0, Math.min(100, dragInfo.startY + dyPercent));
                        setAcaciaPos(prev => ({ ...prev, x: newX, y: newY }));
                      }}
                      onPointerUp={(e) => {
                        e.stopPropagation();
                        e.currentTarget.releasePointerCapture(e.pointerId);
                        setDraggedElementId(null);
                        dragInfoRef.current = null;
                      }}
                      onPointerCancel={(e) => {
                        e.currentTarget.releasePointerCapture(e.pointerId);
                        setDraggedElementId(null);
                        dragInfoRef.current = null;
                      }}
                    >
                      <svg className="w-full h-full" viewBox="-25 -45 60 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g stroke="#d4af37" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" opacity={symbolsOpacity * 0.9}>
                          <path d="M -20,20 Q 10,-10 30,-40" fill="none" />
                          <path d="M -12,14 Q -22,8 -16,0 Q -8,6 -12,14" fill="none" />
                          <path d="M 0,2 Q -10,-4 -4,-12 Q 4,-6 0,2" fill="none" />
                          <path d="M 12,-10 Q 2,-16 8,-24 Q 16,-18 12,-10" fill="none" />
                          <path d="M -3,11 Q 12,5 6,-3" fill="none" />
                          <path d="M 9,-1 Q 24,-7 18,-15" fill="none" />
                        </g>
                      </svg>
                    </div>
                  )}
                </>
              )}
              
              {/* Corners Decorative */}
              <div className="absolute top-4 left-4 w-10 h-10 border-t-2 border-l-2 border-[#d4af37] pointer-events-none" />
              <div className="absolute top-4 right-4 w-10 h-10 border-t-2 border-r-2 border-[#d4af37] pointer-events-none" />
              <div className="absolute bottom-4 left-4 w-10 h-10 border-b-2 border-l-2 border-[#d4af37] pointer-events-none" />
              <div className="absolute bottom-4 right-4 w-10 h-10 border-b-2 border-r-2 border-[#d4af37] pointer-events-none" />
              
              {/* Custom Elements (Extra Images) */}
              {customElements.map((el) => {
                const isSelected = selectedElementId === el.id;
                const isDragging = draggedElementId === el.id;
                return (
                  <div
                    key={el.id}
                    className={`absolute select-none pointer-events-auto transition-shadow ${
                      isSelected 
                        ? 'ring-2 ring-dashed ring-[#E9C349] ring-offset-2 ring-offset-[#06273A] shadow-xl z-30' 
                        : 'hover:ring-1 hover:ring-dashed hover:ring-[#E9C349]/50 z-20'
                    }`}
                    style={{
                      left: `${el.x}%`,
                      top: `${el.y}%`,
                      transform: `translate(-50%, -50%) scale(${el.scale})`,
                      cursor: isDragging ? 'grabbing' : 'grab',
                      touchAction: 'none',
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedElementId(el.id);
                    }}
                    onPointerDown={(e) => {
                      e.stopPropagation();
                      e.currentTarget.setPointerCapture(e.pointerId);
                      setDraggedElementId(el.id);
                      setSelectedElementId(el.id);
                      dragInfoRef.current = {
                        id: el.id,
                        startX: el.x,
                        startY: el.y,
                        startClientX: e.clientX,
                        startClientY: e.clientY
                      };
                    }}
                    onPointerMove={(e) => {
                      const dragInfo = dragInfoRef.current;
                      if (!dragInfo || dragInfo.id !== el.id || draggedElementId !== el.id) return;
                      e.stopPropagation();
                      
                      const container = previewRef.current;
                      if (!container) return;
                      
                      const rect = container.getBoundingClientRect();
                      
                      // Calculate client offset delta converted to percentage
                      const dxPercent = ((e.clientX - dragInfo.startClientX) / rect.width) * 100;
                      const dyPercent = ((e.clientY - dragInfo.startClientY) / rect.height) * 100;
                      
                      let newX = dragInfo.startX + dxPercent;
                      let newY = dragInfo.startY + dyPercent;
                      
                      // Keep within bounds (0 to 100)
                      newX = Math.max(0, Math.min(100, newX));
                      newY = Math.max(0, Math.min(100, newY));
                      
                      setCustomElements(prev =>
                        prev.map(item =>
                          item.id === el.id ? { ...item, x: newX, y: newY } : item
                        )
                      );
                    }}
                    onPointerUp={(e) => {
                      e.stopPropagation();
                      e.currentTarget.releasePointerCapture(e.pointerId);
                      setDraggedElementId(null);
                      dragInfoRef.current = null;
                    }}
                    onPointerCancel={(e) => {
                      e.currentTarget.releasePointerCapture(e.pointerId);
                      setDraggedElementId(null);
                      dragInfoRef.current = null;
                    }}
                  >
                    <img
                      src={el.src}
                      style={{ width: `${el.width}px` }}
                      className="object-contain pointer-events-none select-none"
                      alt=""
                    />
                    
                    {/* Tiny action floating buttons for selected elements */}
                    {isSelected && (
                      <div className="absolute -top-3 -right-3 flex gap-1 bg-[#04141D] border border-[#d4af37] rounded-md p-0.5 shadow-md pointer-events-auto z-40">
                        {/* Delete/Remove button */}
                        <button
                          type="button"
                          title="Remover"
                          onClick={(e) => {
                            e.stopPropagation();
                            setCustomElements(prev => prev.filter(item => item.id !== el.id));
                            setSelectedElementId(null);
                          }}
                          className="p-1 text-red-400 hover:text-red-300 hover:bg-white/5 rounded transition-colors cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Header */}
              <div className="flex flex-col items-center mt-4 transition-transform duration-200" style={{ transform: `translateY(${headerOffset}px)` }}>
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
              <div className="px-10 my-4 flex flex-col justify-center items-center transition-transform duration-200" style={{ transform: `translateY(${bodyOffset}px)` }}>
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

              {/* Default Seal Element */}
              {showSeal && (
                <div
                  className={`absolute select-none pointer-events-auto transition-shadow ${
                    selectedElementId === 'default_seal'
                      ? 'ring-2 ring-dashed ring-[#E9C349] ring-offset-2 ring-offset-[#06273A] shadow-xl z-30'
                      : 'hover:ring-1 hover:ring-dashed hover:ring-[#E9C349]/50 z-20'
                  }`}
                  style={{
                    left: `${sealPos.x}%`,
                    top: `${sealPos.y}%`,
                    transform: `translate(-50%, -50%) scale(${sealPos.scale})`,
                    cursor: draggedElementId === 'default_seal' ? 'grabbing' : 'grab',
                    touchAction: 'none',
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedElementId('default_seal');
                  }}
                  onPointerDown={(e) => {
                    e.stopPropagation();
                    e.currentTarget.setPointerCapture(e.pointerId);
                    setDraggedElementId('default_seal');
                    setSelectedElementId('default_seal');
                    dragInfoRef.current = {
                      id: 'default_seal',
                      startX: sealPos.x,
                      startY: sealPos.y,
                      startClientX: e.clientX,
                      startClientY: e.clientY
                    };
                  }}
                  onPointerMove={(e) => {
                    const dragInfo = dragInfoRef.current;
                    if (!dragInfo || dragInfo.id !== 'default_seal' || draggedElementId !== 'default_seal') return;
                    e.stopPropagation();
                    
                    const container = previewRef.current;
                    if (!container) return;
                    
                    const rect = container.getBoundingClientRect();
                    const dxPercent = ((e.clientX - dragInfo.startClientX) / rect.width) * 100;
                    const dyPercent = ((e.clientY - dragInfo.startClientY) / rect.height) * 100;
                    
                    let newX = dragInfo.startX + dxPercent;
                    let newY = dragInfo.startY + dyPercent;
                    
                    newX = Math.max(0, Math.min(100, newX));
                    newY = Math.max(0, Math.min(100, newY));
                    
                    setSealPos(prev => ({ ...prev, x: newX, y: newY }));
                  }}
                  onPointerUp={(e) => {
                    e.stopPropagation();
                    e.currentTarget.releasePointerCapture(e.pointerId);
                    setDraggedElementId(null);
                    dragInfoRef.current = null;
                  }}
                  onPointerCancel={(e) => {
                    e.currentTarget.releasePointerCapture(e.pointerId);
                    setDraggedElementId(null);
                    dragInfoRef.current = null;
                  }}
                >
                  <div 
                    style={{ width: `${sealPos.width}px`, height: `${sealPos.width}px` }}
                    className="rounded-full border-4 border-[#d4af37] bg-[#fdfbf7] flex items-center justify-center shadow-md relative z-10"
                  >
                    <div 
                      style={{ width: `${sealPos.width - 12}px`, height: `${sealPos.width - 12}px` }}
                      className="rounded-full border border-dashed border-[#d4af37] flex flex-col items-center justify-center text-[#d4af37]"
                    >
                      <ShieldCheck style={{ width: `${Math.round(sealPos.width * 0.38)}px`, height: `${Math.round(sealPos.width * 0.38)}px` }} className="shrink-0" />
                      <span style={{ fontSize: `${Math.round(sealPos.width * 0.09)}px` }} className="font-bold tracking-tighter">OFICIAL</span>
                    </div>
                  </div>
                  {/* Ribbon tails */}
                  <div className="absolute top-[60%] left-[30%] w-3 h-10 bg-[#d4af37]/80 -rotate-12 transform origin-top z-0" />
                  <div className="absolute top-[60%] right-[30%] w-3 h-10 bg-[#d4af37]/80 rotate-12 transform origin-top z-0" />
                </div>
              )}

              {/* Default Signature Element */}
              {showSig && (
                <div
                  className={`absolute select-none pointer-events-auto transition-shadow ${
                    selectedElementId === 'default_sig'
                      ? 'ring-2 ring-dashed ring-[#E9C349] ring-offset-2 ring-offset-[#06273A] shadow-xl z-30'
                      : 'hover:ring-1 hover:ring-dashed hover:ring-[#E9C349]/50 z-20'
                  }`}
                  style={{
                    left: `${sigPos.x}%`,
                    top: `${sigPos.y}%`,
                    transform: `translate(-50%, -50%) scale(${sigPos.scale})`,
                    cursor: draggedElementId === 'default_sig' ? 'grabbing' : 'grab',
                    touchAction: 'none',
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedElementId('default_sig');
                  }}
                  onPointerDown={(e) => {
                    e.stopPropagation();
                    e.currentTarget.setPointerCapture(e.pointerId);
                    setDraggedElementId('default_sig');
                    setSelectedElementId('default_sig');
                    dragInfoRef.current = {
                      id: 'default_sig',
                      startX: sigPos.x,
                      startY: sigPos.y,
                      startClientX: e.clientX,
                      startClientY: e.clientY
                    };
                  }}
                  onPointerMove={(e) => {
                    const dragInfo = dragInfoRef.current;
                    if (!dragInfo || dragInfo.id !== 'default_sig' || draggedElementId !== 'default_sig') return;
                    e.stopPropagation();
                    
                    const container = previewRef.current;
                    if (!container) return;
                    
                    const rect = container.getBoundingClientRect();
                    const dxPercent = ((e.clientX - dragInfo.startClientX) / rect.width) * 100;
                    const dyPercent = ((e.clientY - dragInfo.startClientY) / rect.height) * 100;
                    
                    let newX = dragInfo.startX + dxPercent;
                    let newY = dragInfo.startY + dyPercent;
                    
                    newX = Math.max(0, Math.min(100, newX));
                    newY = Math.max(0, Math.min(100, newY));
                    
                    setSigPos(prev => ({ ...prev, x: newX, y: newY }));
                  }}
                  onPointerUp={(e) => {
                    e.stopPropagation();
                    e.currentTarget.releasePointerCapture(e.pointerId);
                    setDraggedElementId(null);
                    dragInfoRef.current = null;
                  }}
                  onPointerCancel={(e) => {
                    e.currentTarget.releasePointerCapture(e.pointerId);
                    setDraggedElementId(null);
                    dragInfoRef.current = null;
                  }}
                >
                  <div className="flex flex-col items-center" style={{ width: `${sigPos.width}px` }}>
                    <div className="w-full border-b border-slate-300 pb-1 flex justify-center" style={{ borderColor: textColor === '#000000' ? '#64748b' : '#cbd5e1' }}>
                      <span className="text-xs font-serif italic text-slate-800 tracking-wider text-center block max-w-full truncate">
                        {directorName}
                      </span>
                    </div>
                    <span className="text-[8px] font-mono text-slate-500 uppercase tracking-wider mt-1.5 text-center block max-w-full truncate">
                      {directorTitle}
                    </span>
                    <span className="text-[7px] text-slate-400 block font-mono text-center">
                      MASONIC ACADEMY
                    </span>
                  </div>
                </div>
              )}

              {/* Default Authenticity Info Element */}
              {showInfo && (
                <div
                  className={`absolute select-none pointer-events-auto transition-shadow ${
                    selectedElementId === 'default_info'
                      ? 'ring-2 ring-dashed ring-[#E9C349] ring-offset-2 ring-offset-[#06273A] shadow-xl z-30'
                      : 'hover:ring-1 hover:ring-dashed hover:ring-[#E9C349]/50 z-20'
                  }`}
                  style={{
                    left: `${infoPos.x}%`,
                    top: `${infoPos.y}%`,
                    transform: `translate(-50%, -50%) scale(${infoPos.scale})`,
                    cursor: draggedElementId === 'default_info' ? 'grabbing' : 'grab',
                    touchAction: 'none',
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedElementId('default_info');
                  }}
                  onPointerDown={(e) => {
                    e.stopPropagation();
                    e.currentTarget.setPointerCapture(e.pointerId);
                    setDraggedElementId('default_info');
                    setSelectedElementId('default_info');
                    dragInfoRef.current = {
                      id: 'default_info',
                      startX: infoPos.x,
                      startY: infoPos.y,
                      startClientX: e.clientX,
                      startClientY: e.clientY
                    };
                  }}
                  onPointerMove={(e) => {
                    const dragInfo = dragInfoRef.current;
                    if (!dragInfo || dragInfo.id !== 'default_info' || draggedElementId !== 'default_info') return;
                    e.stopPropagation();
                    
                    const container = previewRef.current;
                    if (!container) return;
                    
                    const rect = container.getBoundingClientRect();
                    const dxPercent = ((e.clientX - dragInfo.startClientX) / rect.width) * 100;
                    const dyPercent = ((e.clientY - dragInfo.startClientY) / rect.height) * 100;
                    
                    let newX = dragInfo.startX + dxPercent;
                    let newY = dragInfo.startY + dyPercent;
                    
                    newX = Math.max(0, Math.min(100, newX));
                    newY = Math.max(0, Math.min(100, newY));
                    
                    setInfoPos(prev => ({ ...prev, x: newX, y: newY }));
                  }}
                  onPointerUp={(e) => {
                    e.stopPropagation();
                    e.currentTarget.releasePointerCapture(e.pointerId);
                    setDraggedElementId(null);
                    dragInfoRef.current = null;
                  }}
                  onPointerCancel={(e) => {
                    e.currentTarget.releasePointerCapture(e.pointerId);
                    setDraggedElementId(null);
                    dragInfoRef.current = null;
                  }}
                >
                  <div className="text-left flex flex-col gap-1" style={{ width: `${infoPos.width}px` }}>
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
                </div>
              )}

              {/* Spacing alignment */}
              <div className="h-10 pointer-events-none" />
              
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
            
            {/* Standard Masonic Vector Art Overlays as Draggable Elements for Printing */}
            {showMasonicSymbols && (
              <>
                {/* Left Column (Boaz) */}
                {showColEsq && (
                  <div
                    style={{
                      position: 'absolute',
                      left: `${colunaEsqPos.x}%`,
                      top: `${colunaEsqPos.y}%`,
                      transform: `translate(-50%, -50%) scale(${colunaEsqPos.scale})`,
                      width: `${colunaEsqPos.width}px`,
                      height: `${colunaEsqPos.width * (410 / 60)}px`,
                      zIndex: 2,
                    }}
                  >
                    <svg style={{ width: '100%', height: '100%' }} viewBox="40 90 60 410" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                    </svg>
                  </div>
                )}

                {/* Right Column (Jachin) */}
                {showColDir && (
                  <div
                    style={{
                      position: 'absolute',
                      left: `${colunaDirPos.x}%`,
                      top: `${colunaDirPos.y}%`,
                      transform: `translate(-50%, -50%) scale(${colunaDirPos.scale})`,
                      width: `${colunaDirPos.width}px`,
                      height: `${colunaDirPos.width * (410 / 60)}px`,
                      zIndex: 2,
                    }}
                  >
                    <svg style={{ width: '100%', height: '100%' }} viewBox="800 90 60 410" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                    </svg>
                  </div>
                )}

                {/* Eye of Providence (Olho que tudo vê) */}
                {showOlho && (
                  <div
                    style={{
                      position: 'absolute',
                      left: `${olhoPos.x}%`,
                      top: `${olhoPos.y}%`,
                      transform: `translate(-50%, -50%) scale(${olhoPos.scale})`,
                      width: `${olhoPos.width}px`,
                      height: `${olhoPos.width}px`,
                      zIndex: 2,
                    }}
                  >
                    <svg style={{ width: '100%', height: '100%' }} viewBox="-35 -35 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g stroke="#d4af37" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" opacity={symbolsOpacity + 0.03}>
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
                    </svg>
                  </div>
                )}

                {/* Square and Compass (Esquadro e Compasso) with Acacia (Acácia) inside and Letter G */}
                {showEsquadro && (
                  <div
                    style={{
                      position: 'absolute',
                      left: `${esquadroPos.x}%`,
                      top: `${esquadroPos.y}%`,
                      transform: `translate(-50%, -50%) scale(${esquadroPos.scale})`,
                      width: `${esquadroPos.width}px`,
                      height: `${esquadroPos.width * (200 / 180)}px`,
                      zIndex: 2,
                    }}
                  >
                    <svg style={{ width: '100%', height: '100%' }} viewBox="-90 -125 180 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g stroke="#d4af37" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" opacity={symbolsOpacity * 0.7}>
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
                    </svg>
                  </div>
                )}

                {/* Mallet and Chisel (Malho e Cinzel) */}
                {showMalho && (
                  <div
                    style={{
                      position: 'absolute',
                      left: `${malhoPos.x}%`,
                      top: `${malhoPos.y}%`,
                      transform: `translate(-50%, -50%) scale(${malhoPos.scale})`,
                      width: `${malhoPos.width}px`,
                      height: `${malhoPos.width * (70 / 60)}px`,
                      zIndex: 2,
                    }}
                  >
                    <svg style={{ width: '100%', height: '100%' }} viewBox="-30 -45 60 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g stroke="#d4af37" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" opacity={symbolsOpacity * 0.8}>
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
                    </svg>
                  </div>
                )}

                {/* Acacia Branches (Acácia) */}
                {showAcacia && (
                  <div
                    style={{
                      position: 'absolute',
                      left: `${acaciaPos.x}%`,
                      top: `${acaciaPos.y}%`,
                      transform: `translate(-50%, -50%) scale(${acaciaPos.scale}) rotate(20deg)`,
                      width: `${acaciaPos.width}px`,
                      height: `${acaciaPos.width}px`,
                      zIndex: 2,
                    }}
                  >
                    <svg style={{ width: '100%', height: '100%' }} viewBox="-25 -45 60 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g stroke="#d4af37" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" opacity={symbolsOpacity * 0.9}>
                        <path d="M -20,20 Q 10,-10 30,-40" fill="none" />
                        <path d="M -12,14 Q -22,8 -16,0 Q -8,6 -12,14" fill="none" />
                        <path d="M 0,2 Q -10,-4 -4,-12 Q 4,-6 0,2" fill="none" />
                        <path d="M 12,-10 Q 2,-16 8,-24 Q 16,-18 12,-10" fill="none" />
                        <path d="M -3,11 Q 12,5 6,-3" fill="none" />
                        <path d="M 9,-1 Q 24,-7 18,-15" fill="none" />
                      </g>
                    </svg>
                  </div>
                )}
              </>
            )}
            
            <div className="absolute top-4 left-4 w-10 h-10 border-t-2 border-l-2 border-[#d4af37]" />
            <div className="absolute top-4 right-4 w-10 h-10 border-t-2 border-r-2 border-[#d4af37]" />
            <div className="absolute bottom-4 left-4 w-10 h-10 border-b-2 border-l-2 border-[#d4af37]" />
            <div className="absolute bottom-4 right-4 w-10 h-10 border-b-2 border-r-2 border-[#d4af37]" />
            
            {/* Custom Elements (Extra Images) */}
            {customElements.map((el) => (
              <div
                key={el.id}
                style={{
                  position: 'absolute',
                  left: `${el.x}%`,
                  top: `${el.y}%`,
                  transform: `translate(-50%, -50%) scale(${el.scale})`,
                  zIndex: 20,
                }}
              >
                <img
                  src={el.src}
                  style={{ width: `${el.width}px` }}
                  alt=""
                />
              </div>
            ))}

            <div className="flex flex-col items-center mt-4" style={{ transform: `translateY(${headerOffset}px)` }}>
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

            <div style={{ padding: '0 40px', margin: '20px 0', transform: `translateY(${bodyOffset}px)` }}>
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

            {/* Default Seal Element in Print */}
            {showSeal && (
              <div
                style={{
                  position: 'absolute',
                  left: `${sealPos.x}%`,
                  top: `${sealPos.y}%`,
                  transform: `translate(-50%, -50%) scale(${sealPos.scale})`,
                  zIndex: 10,
                }}
              >
                <div 
                  style={{ 
                    width: `${sealPos.width}px`, 
                    height: `${sealPos.width}px`, 
                    borderRadius: '50%', 
                    border: '4px solid #d4af37', 
                    backgroundColor: '#fdfbf7', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justify: 'center', 
                    alignContent: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    position: 'relative'
                  }}
                >
                  <div 
                    style={{ 
                      width: `${sealPos.width - 12}px`, 
                      height: `${sealPos.width - 12}px`, 
                      borderRadius: '50%', 
                      border: '1px dashed #d4af37', 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      justifyContent: 'center' 
                    }}
                  >
                    <span style={{ fontSize: `${Math.round(sealPos.width * 0.09)}px`, fontWeight: 'bold', color: '#d4af37' }}>OFICIAL</span>
                  </div>
                </div>
                {/* Ribbon tails */}
                <div style={{ position: 'absolute', top: '60%', left: '30%', width: '12px', height: '40px', backgroundColor: 'rgba(212, 175, 55, 0.8)', transform: 'rotate(-12deg)', transformOrigin: 'top', zIndex: 0 }} />
                <div style={{ position: 'absolute', top: '60%', right: '30%', width: '12px', height: '40px', backgroundColor: 'rgba(212, 175, 55, 0.8)', transform: 'rotate(12deg)', transformOrigin: 'top', zIndex: 0 }} />
              </div>
            )}

            {/* Default Signature Element in Print */}
            {showSig && (
              <div
                style={{
                  position: 'absolute',
                  left: `${sigPos.x}%`,
                  top: `${sigPos.y}%`,
                  transform: `translate(-50%, -50%) scale(${sigPos.scale})`,
                  zIndex: 10,
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: `${sigPos.width}px` }}>
                  <div style={{ width: '100%', borderBottom: `1px solid ${textColor === '#000000' ? '#64748b' : '#cbd5e1'}`, paddingBottom: '3px', textAlign: 'center' }}>
                    <span style={{ fontSize: '12px', fontFamily: "'Playfair Display', serif", fontStyle: 'italic', color: '#1e293b' }}>
                      {directorName}
                    </span>
                  </div>
                  <span style={{ fontSize: '8px', fontFamily: 'monospace', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '6px' }}>
                    {directorTitle}
                  </span>
                  <span style={{ fontSize: '7px', color: '#94a3b8', fontFamily: 'monospace' }}>
                    MASONIC ACADEMY
                  </span>
                </div>
              </div>
            )}

            {/* Default Authenticity Info Element in Print */}
            {showInfo && (
              <div
                style={{
                  position: 'absolute',
                  left: `${infoPos.x}%`,
                  top: `${infoPos.y}%`,
                  transform: `translate(-50%, -50%) scale(${infoPos.scale})`,
                  zIndex: 10,
                }}
              >
                <div style={{ textAlign: 'left', width: `${infoPos.width}px` }}>
                  <span style={{ fontSize: '8px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', display: 'block' }}>Autenticidade</span>
                  <div style={{ fontSize: '10px', fontFamily: 'monospace', fontWeight: 'bold', color: '#334155', display: 'block' }}>CÓD: {verificationCode}</div>
                  <div style={{ fontSize: '8px', color: '#94a3b8', display: 'block' }}>Emitido em: {certificate.date}</div>
                </div>
              </div>
            )}

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
