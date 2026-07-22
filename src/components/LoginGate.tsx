import React, { useState } from 'react';
import { AccessUser } from '../types';
import { Shield, Lock, Mail, User, UserPlus, CheckCircle, AlertCircle, LogIn, ChevronRight } from 'lucide-react';

interface LoginGateProps {
  onLogin: (user: AccessUser) => void;
  accessUsers: AccessUser[];
  onAddAccessUser: (newUser: AccessUser) => void;
}

export default function LoginGate({ onLogin, accessUsers, onAddAccessUser }: LoginGateProps) {
  const [emailInput, setEmailInput] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successUser, setSuccessUser] = useState<AccessUser | null>(null);
  
  // Custom Registration Mode
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regUserAcesso, setRegUserAcesso] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regTelefone, setRegTelefone] = useState('');
  const [regLoja, setRegLoja] = useState('');
  const [regPotencia, setRegPotencia] = useState('');
  const [regCidadeLoja, setRegCidadeLoja] = useState('');

  // Hardcoded premium administrators for fallback
  const masterAdmins: AccessUser[] = [
    {
      id: 'usr-nanda-master',
      name: 'Daniel Luciano',
      email: 'dani.nanda.lucas@gmail.com',
      userAcesso: 'daniel',
      allowedReportIds: '*',
      status: 'Ativo',
      tipoUsuario: 'admin',
      nivelAcesso: '33'
    }
  ];

  const handleValidateEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const emailClean = emailInput.trim().toLowerCase();
    if (!emailClean) {
      setErrorMsg('Por favor, informe seu e-mail ou User de Acesso.');
      return;
    }

    // 1. Check master admins first (check by email or userAcesso if configured)
    const adminFound = masterAdmins.find(admin => 
      (admin.email || '').toLowerCase() === emailClean || 
      (admin.userAcesso || '').toLowerCase() === emailClean ||
      (emailClean === 'daniel' && (admin.email || '').toLowerCase() === 'dani.nanda.lucas@gmail.com')
    );
    if (adminFound) {
      if (adminFound.password && adminFound.password !== loginPassword) {
        setErrorMsg('Senha incorreta. Por favor, tente novamente.');
        return;
      }
      triggerSuccess(adminFound);
      return;
    }

    // 2. Check access users lists (check by email or userAcesso)
    const userFound = accessUsers.find(user => 
      (user.email || '').toLowerCase() === emailClean || 
      (user.userAcesso || '').toLowerCase() === emailClean ||
      (emailClean === 'daniel' && (user.email || '').toLowerCase() === 'dani.nanda.lucas@gmail.com')
    );
    if (userFound) {
      // Validate password if user has a password registered
      if (userFound.password && userFound.password !== loginPassword) {
        setErrorMsg('Senha incorreta. Por favor, tente novamente.');
        return;
      }
      triggerSuccess(userFound);
      return;
    }

    // 3. Not found - offer helper options
    setErrorMsg(`O e-mail ou User de Acesso "${emailClean}" não foi localizado na base ativa.`);
  };

  const triggerSuccess = (user: AccessUser) => {
    setSuccessUser(user);
    setTimeout(() => {
      onLogin(user);
    }, 1200);
  };

  const handleCreateAndLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const name = regName.trim();
    const email = regEmail.trim().toLowerCase();
    const userAcesso = regUserAcesso.trim().toLowerCase();
    const password = regPassword.trim();
    const telefone = regTelefone.trim();
    const loja = regLoja.trim();
    const potencia = regPotencia.trim();
    const cidadeLoja = regCidadeLoja.trim();

    if (!name || !email || !password) {
      setErrorMsg('Por favor, preencha nome, e-mail e senha.');
      return;
    }

    // Ensure email or userAcesso is not already registered in master or user lists
    const isMaster = masterAdmins.some(a => 
      a.email.toLowerCase() === email || 
      (a.userAcesso && a.userAcesso.toLowerCase() === userAcesso)
    );
    const isUser = accessUsers.some(u => 
      u.email.toLowerCase() === email || 
      (u.userAcesso && u.userAcesso.toLowerCase() === userAcesso)
    );
    if (isMaster || isUser) {
      setErrorMsg(`O e-mail ou User de Acesso informado já está cadastrado no sistema.`);
      return;
    }

    const newUser: AccessUser = {
      id: `usr-custom-${Date.now()}`,
      name: name,
      email: email,
      userAcesso: userAcesso || undefined,
      allowedReportIds: '*', // Default full access for ease of demonstration
      status: 'Inativo',
      tipoUsuario: 'padrao',
      password: password,
      telefone: telefone || undefined,
      loja: loja || undefined,
      potencia: potencia || undefined,
      cidadeLoja: cidadeLoja || undefined
    };

    // Register user in the parent list and persist
    onAddAccessUser(newUser);
    triggerSuccess(newUser);
  };

  const handleQuickDemoLogin = (user: AccessUser) => {
    triggerSuccess(user);
  };

  // Combine lists of active profiles for quick demonstration
  const allActiveProfilesForDemo = [
    ...masterAdmins,
    ...accessUsers.filter(u => u.status === 'Ativo' && u.email !== 'dani.nanda.lucas@gmail.com')
  ];

  return (
    <div id="login-gate-root" className="min-h-screen bg-[#05151e] text-[#d4e5f2] selection:bg-[#E9C349]/40 flex flex-col items-center justify-center font-sans p-4 relative overflow-hidden">
      
      {/* Visual Ambient Grid and Background Accents */}
      <div className="absolute inset-0 login-grid-bg pointer-events-none"></div>
      
      <div className="relative w-full max-w-lg bg-[#0c1d27] rounded-2xl border-2 border-[#1c2c36] shadow-2xl p-6 sm:p-10 space-y-6 md:space-y-8 backdrop-blur-md">
        
        {/* Success Splash Overlay */}
        {successUser && (
          <div className="absolute inset-0 bg-[#0c1d27] rounded-2xl flex flex-col items-center justify-center p-6 text-center z-20 space-y-4 animate-fade-in">
            <div className="w-16 h-16 bg-[#66d9cc]/15 border-2 border-[#66d9cc] rounded-full flex items-center justify-center animate-bounce">
              <CheckCircle className="w-9 h-9 text-[#66d9cc]" />
            </div>
            <div>
              <h3 className="font-sans font-black text-xl text-[#66d9cc] uppercase tracking-wide">Identidade Validada!</h3>
              <p className="text-xs text-[#99907c] font-mono mt-1">Carregando painel analítico para:</p>
              <p className="text-base font-bold text-[#d4e5f2] mt-2 font-sans">{successUser.name}</p>
              <p className="text-[10px] text-[#E9C349] font-mono bg-[#11212b] px-3 py-1 rounded border border-[#1c2c36] inline-block mt-1 uppercase">
                {successUser.email === 'dani.nanda.lucas@gmail.com' ? 'Acesso Diretor (Mestre)' : `Irmão (${successUser.status})`}
              </p>
            </div>
          </div>
        )}

        {/* Corporate branding header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2.5 bg-[#11212b] border border-[#1c2c36] px-4.5 py-2.5 rounded-full text-[#E9C349] font-mono text-[11px] font-black uppercase tracking-widest shadow-sm">
            <Shield className="w-4 h-4 text-[#26a69a]" /> MASONIC ACADEMY
          </div>
          
          <div className="space-y-1">
            <h1 className="font-sans font-black text-2xl sm:text-3xl text-[#d4e5f2] tracking-tight">
              Portal de <span className="text-[#E9C349]">Ensino</span>
            </h1>
            <p className="text-xs text-[#99907c] font-mono">
              seu espaço de busca pelo conhecimento
            </p>
          </div>
        </div>

        {/* Main interactive validation flow */}
        {!showRegisterForm ? (
          <div className="space-y-5">
            <form onSubmit={handleValidateEmail} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-xs font-mono font-bold text-[#99907c] uppercase tracking-wider">
                  Informe seu E-mail ou User de Acesso:
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#99907c]">
                    <User className="w-4 h-4 text-[#26a69a]" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Ex: seu.email@masonicacademy.com.br ou seu_user"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full bg-[#04141d] border-2 border-[#1c2c36]/80 text-xs sm:text-sm rounded-xl pl-10 pr-4 py-3 text-[#d4e5f2] placeholder-[#99907c]/60 focus:outline-none focus:border-[#E9C349] hover:border-[#1c2c36] transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-mono font-bold text-[#99907c] uppercase tracking-wider">
                  Senha de Acesso (se cadastrada):
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#99907c]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    placeholder="Sua senha de acesso"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full bg-[#04141d] border-2 border-[#1c2c36]/80 text-xs sm:text-sm rounded-xl pl-10 pr-4 py-3 text-[#d4e5f2] placeholder-[#99907c]/60 focus:outline-none focus:border-[#E9C349] hover:border-[#1c2c36] transition-colors"
                  />
                </div>
              </div>

              {errorMsg && (
                <div className="bg-rose-500/10 border-l-4 border-rose-500 rounded p-3 text-left space-y-1">
                  <div className="flex items-center gap-2 text-[11px] font-mono text-rose-400 font-bold">
                    <AlertCircle className="w-4 h-4 shrink-0" /> ACESSO NÃO ENCONTRADO
                  </div>
                  <p className="text-[11px] text-[#d4e5f2]/80 leading-relaxed font-sans">{errorMsg}</p>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-[#E9C349] hover:bg-[#ffe088] text-[#241a00] font-sans font-extrabold text-sm py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer border-none active:scale-95 transform"
              >
                <LogIn className="w-4 h-4" /> VALIDAR E ACESSAR ÁREA DE ENSINO
              </button>
            </form>

            {/* 
            <div className="relative py-2 flex items-center justify-center select-none">
              <span className="absolute inset-x-0 h-px bg-[#1c2c36]/60"></span>
              <span className="relative bg-[#0c1d27] px-3 font-mono text-[9px] text-[#99907c] uppercase tracking-wide">
                Novo Usuário?
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => setShowRegisterForm(true)}
                  className="w-full bg-[#11212b] text-[11px] font-mono font-bold uppercase tracking-wider text-[#66d9cc] hover:bg-[#16303d] border border-[#1c2c36] py-3 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-3.5 h-3.5" /> Criar Novo Cadastro
                </button>
              </div>
            </div>
            */}
          </div>
        ) : (
          /* Custom registration form to bypass any lockout comfortably */
          <div className="space-y-5 animate-fade-in">
            <div className="flex items-center justify-between border-b border-[#1c2c36] pb-2">
              <span className="text-xs font-mono font-bold text-[#f2ca50] tracking-wide flex items-center gap-1.5">
                <User className="w-4 h-4 text-[#26a69a]" /> REGISTRO no Portal de Ensino
              </span>
              <button
                onClick={() => {
                  setShowRegisterForm(false);
                  setErrorMsg(null);
                }}
                className="text-xs font-mono text-[#99907c] hover:text-[#d4e5f2] cursor-pointer"
              >
                &larr; Voltar ao Login
              </button>
            </div>

            <form onSubmit={handleCreateAndLogin} className="space-y-4 text-left">
              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-bold text-[#99907c]">Nome Completo:</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: João da Silva"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full bg-[#04141d] border border-[#1c2c36] text-xs px-3.5 py-2.5 rounded-lg text-[#d4e5f2] focus:outline-none focus:border-[#E9C349]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-bold text-[#99907c]">E-mail:</label>
                <input
                  type="email"
                  required
                  placeholder="Ex: joao.silva@masonicacademy.com.br"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full bg-[#04141d] border border-[#1c2c36] text-xs px-3.5 py-2.5 rounded-lg text-[#d4e5f2] focus:outline-none focus:border-[#E8C349]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-bold text-[#99907c]">User de Acesso:</label>
                <input
                  type="text"
                  placeholder="Ex: joaosilva (Opcional)"
                  value={regUserAcesso}
                  onChange={(e) => setRegUserAcesso(e.target.value)}
                  className="w-full bg-[#04141d] border border-[#1c2c36] text-xs px-3.5 py-2.5 rounded-lg text-[#d4e5f2] focus:outline-none focus:border-[#E8C349]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-bold text-[#99907c]">Senha:</label>
                <input
                  type="password"
                  required
                  placeholder="Sua senha de acesso"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="w-full bg-[#04141d] border border-[#1c2c36] text-xs px-3.5 py-2.5 rounded-lg text-[#d4e5f2] focus:outline-none focus:border-[#E9C349]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-bold text-[#99907c]">Telefone com Prefixo:</label>
                <input
                  type="text"
                  placeholder="Ex: (11) 99999-9999"
                  value={regTelefone}
                  onChange={(e) => setRegTelefone(e.target.value)}
                  className="w-full bg-[#04141d] border border-[#1c2c36] text-xs px-3.5 py-2.5 rounded-lg text-[#d4e5f2] focus:outline-none focus:border-[#E8C349]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-bold text-[#99907c]">Loja:</label>
                <input
                  type="text"
                  placeholder="Ex: Loja Fraternidade nº 42"
                  value={regLoja}
                  onChange={(e) => setRegLoja(e.target.value)}
                  className="w-full bg-[#04141d] border border-[#1c2c36] text-xs px-3.5 py-2.5 rounded-lg text-[#d4e5f2] focus:outline-none focus:border-[#E8C349]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-bold text-[#99907c]">Potência:</label>
                <input
                  type="text"
                  placeholder="Ex: GOB / Glesp / GOP"
                  value={regPotencia}
                  onChange={(e) => setRegPotencia(e.target.value)}
                  className="w-full bg-[#04141d] border border-[#1c2c36] text-xs px-3.5 py-2.5 rounded-lg text-[#d4e5f2] focus:outline-none focus:border-[#E8C349]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-bold text-[#99907c]">Cidade da Loja:</label>
                <input
                  type="text"
                  placeholder="Ex: São Paulo"
                  value={regCidadeLoja}
                  onChange={(e) => setRegCidadeLoja(e.target.value)}
                  className="w-full bg-[#04141d] border border-[#1c2c36] text-xs px-3.5 py-2.5 rounded-lg text-[#d4e5f2] focus:outline-none focus:border-[#E8C349]"
                />
              </div>

              {errorMsg && (
                <p className="bg-rose-500/10 border-l-4 border-rose-500 rounded p-2.5 text-xs text-rose-300 font-sans leading-normal">
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                className="w-full bg-[#66D9CC] text-[#003732] font-sans font-extrabold text-xs py-3 rounded-lg hover:bg-[#84f5e8] cursor-pointer transition-colors border-none"
              >
                CADASTRAR PERFIL
              </button>
            </form>
          </div>
        )}

        {/* Footer legalities/security watermark */}
        <div className="flex items-center justify-between text-[10px] font-mono text-[#99907c] pt-2 border-t border-[#1c2c36]/40">
          <span>Sessão de Acesso Protegida</span>
          <span className="flex items-center gap-1">
            <Lock className="w-3 h-3 text-[#26a69a]" /> AES-256 ERP MASONIC ACADEMY
          </span>
        </div>

      </div>
    </div>
  );
}
