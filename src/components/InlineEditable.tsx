import React, { useState, useEffect, useRef } from 'react';
import { Check, X, Pencil } from 'lucide-react';

interface InlineEditableProps {
  value: string;
  onSave: (newValue: string) => void;
  isAdmin: boolean;
  className?: string; // styles for the text
  type?: 'input' | 'textarea';
  as?: 'span' | 'p' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'li' | 'strong' | 'h5' | 'h6';
}

export default function InlineEditable({
  value,
  onSave,
  isAdmin,
  className = '',
  type = 'input',
  as = 'span'
}: InlineEditableProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  useEffect(() => {
    setTempValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const Component = as as any;

  if (!isAdmin) {
    return <Component className={className}>{value}</Component>;
  }

  const handleSave = () => {
    if (tempValue.trim() !== '') {
      onSave(tempValue);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && type === 'input') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <span className="inline-flex items-center gap-1.5 w-full text-[#d4e5f2]" onClick={(e) => e.stopPropagation()}>
        {type === 'textarea' ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-[#04141d] text-xs font-mono font-medium border border-[#D4AF37] rounded p-2.5 outline-none resize-y min-h-[60px] text-[#d4e5f2]"
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-[#04141d] text-sm font-sans font-medium border border-[#D4AF37] rounded px-2.5 py-1 outline-none text-[#d4e5f2]"
          />
        )}
        <span className="flex flex-col gap-1 shrink-0">
          <button
            onClick={handleSave}
            className="p-1.5 bg-[#E9C349] hover:bg-[#ffe088] text-[#241a00] rounded transition-all cursor-pointer flex items-center justify-center"
            title="Salvar"
          >
            <Check className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleCancel}
            className="p-1.5 bg-[#1c2c36]/80 hover:bg-[#1c2c36] text-rose-400 rounded transition-all cursor-pointer flex items-center justify-center"
            title="Cancelar"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </span>
      </span>
    );
  }

  return (
    <span
      onClick={(e) => {
        e.stopPropagation();
        setIsEditing(true);
      }}
      className="group relative inline-block cursor-pointer hover:bg-[#0c354d]/30 rounded px-1.5 py-0.5 -mx-1.5 border border-dashed border-transparent hover:border-[#D4AF37]/50 max-w-full transition-all"
      title="Clique para editar este texto diretamente na tela"
    >
      <Component className={`${className} pr-6 inline-block w-full`}>
        {value}
      </Component>
      <span className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-[#D4AF37] pointer-events-none">
        <Pencil className="w-3 h-3" />
      </span>
    </span>
  );
}
