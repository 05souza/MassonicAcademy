import { useState } from 'react';
import { 
  Menu, 
  Search, 
  X, 
  Shield, 
  BookOpen, 
  Settings, 
  LogOut, 
  TrendingUp, 
  Home, 
  User, 
  HelpCircle, 
  Bell,
  Info 
} from 'lucide-react';
import { AccessUser } from '../types';

interface HeaderProps {
  title: string;
  onSearchToggle: () => void;
  showSearch: boolean;
  searchQuery: string;
  onSearchChange: (val: string) => void;
  onSelectCategory: (category: string) => void;
  activeCategory: string;
  currentUser: AccessUser;
  onSelectUser: (user: AccessUser) => void;
  accessUsers: AccessUser[];
  onLogout?: () => void;
  activeTab?: 'inicio' | 'biblioteca' | 'alertas' | 'perfil' | 'questionarios' | 'manual';
  onChangeTab?: (tab: 'inicio' | 'biblioteca' | 'alertas' | 'perfil' | 'questionarios' | 'manual') => void;
  isAdminUser?: boolean;
  logoUrl?: string;
}

export default function Header({
  title,
  onSearchToggle,
  showSearch,
  searchQuery,
  onSearchChange,
  onSelectCategory,
  activeCategory,
  currentUser,
  onSelectUser,
  accessUsers,
  onLogout,
  activeTab = 'inicio',
  onChangeTab,
  isAdminUser = false,
  logoUrl
}: HeaderProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const navItems = [
    { label: 'TODOS', value: 'TODOS' },
    { label: 'ESTRATÉGIA', value: 'ESTRATÉGIA' },
    { label: 'PRODUTO & OPERAÇÃO', value: 'PRODUTO & OPERAÇÃO' },
    { label: 'TECNOLOGIA', value: 'TECNOLOGIA' },
    { label: 'SERVIÇOS', value: 'SERVIÇOS' }
  ];

  const getInitials = (name: any) => {
    if (!name || typeof name !== 'string') return 'DL';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 0) return 'DL';
    if (parts.length === 1) return (parts[0] || '').slice(0, 2).toUpperCase();
    return (((parts[0] || '')[0] || '') + ((parts[parts.length - 1] || '')[0] || '')).toUpperCase();
  };

  return (
    <>
      <header id="app-header" className="sticky top-0 z-40 bg-[#06273A] border-b-2 border-[#D4AF37] px-4 py-3 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <button
            id="drawer-toggle-btn"
            onClick={() => setDrawerOpen(true)}
            className="text-[#d4e5f2] hover:text-[#f2ca50] transition-colors p-1 rounded hover:bg-[#0c354d]"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          {logoUrl && (
            <img 
              src={logoUrl} 
              alt="Lodge Logo" 
              className="w-7 h-7 object-contain rounded border border-[#D4AF37]/30 bg-[#04141D]/50 p-0.5" 
              referrerPolicy="no-referrer" 
            />
          )}

          <h1 id="header-title" className="font-sans font-semibold text-xl text-[#d4e5f2] tracking-wide">
            {title}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center bg-[#04141D] rounded-lg px-3 py-1.5 border border-[#1c2c36] max-w-xs">
            <Search className="w-4 h-4 text-[#99907c] mr-2" />
            <input
              type="text"
              placeholder="Pesquisar títulos..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="bg-transparent text-[#d4e5f2] text-sm focus:outline-none placeholder-[#99907c]"
            />
          </div>

          <button
            id="mobile-search-toggle"
            onClick={onSearchToggle}
            className="md:hidden text-[#d4e5f2] hover:text-[#f2ca50] transition-colors p-1 rounded hover:bg-[#0c354d]"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Active Logged in User */}
          <div className="flex items-center gap-1.5 bg-[#04141D] rounded-full pl-2 pr-3 py-1 border border-[#D4AF37]/35 shadow-inner">
          {currentUser.avatarUrl ? (
            <img 
              src={currentUser.avatarUrl} 
              alt={currentUser.name} 
              className="w-5.5 h-5.5 rounded-full object-cover border border-[#D4AF37]/30" 
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-5.5 h-5.5 rounded-full bg-[#D4AF37] text-[#04141D] flex items-center justify-center text-[10px] font-mono font-black select-none uppercase">
              {getInitials(currentUser.name)}
            </div>
          )}
            <span className="text-[10px] font-mono font-bold text-[#f2ca50] select-none">
              {currentUser.name}
            </span>
          </div>
        </div>
      </header>

      {/* Slide-out Navigation Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div
            id="drawer-overlay"
            onClick={() => setDrawerOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
          />

          {/* Drawer content */}
          <div id="drawer-container" className="relative w-80 max-w-[85vw] bg-[#06273A] text-[#d4e5f2] h-full shadow-2xl flex flex-col z-50 border-r border-[#1c2c36] animate-slide-in">
            {/* Header */}
            <div className="p-4 border-b border-[#1c2c36] flex items-center justify-between bg-[#04141D]">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#f2ca50]" />
                <span className="font-sans font-bold tracking-tight text-[#d4e5f2]">Masonic Academy</span>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="text-[#99907c] hover:text-[#d4e5f2] p-1 rounded hover:bg-[#0c354d]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Brief */}
            <div className="p-5 bg-gradient-to-b from-[#04141D] to-[#06273A] border-b border-[#1c2c36] text-center">
              {currentUser.avatarUrl ? (
                <img 
                  src={currentUser.avatarUrl} 
                  alt={currentUser.name} 
                  className="w-14 h-14 rounded-full object-cover mx-auto mb-3 border border-[#D4AF37]/40 shadow-md" 
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#f2ca50] text-[#04141D] flex items-center justify-center text-lg font-mono font-bold mx-auto mb-3 shadow-md border border-[#04141D] uppercase">
                  {getInitials(currentUser.name)}
                </div>
              )}
              <h3 className="font-sans font-semibold text-sm text-[#d4e5f2]">{currentUser.name}</h3>
              <p className="font-mono text-[10px] text-[#99907c] mt-0.5">{currentUser.email}</p>
              <div className={`inline-block border text-[10px] font-mono font-bold px-2.5 py-0.5 rounded mt-2.5 uppercase ${
                currentUser.status === 'Ativo' 
                  ? 'bg-[#112d2b] border-[#26a69a] text-[#66d9cc]' 
                  : 'bg-[#2d1115] border-rose-500 text-rose-400'
              }`}>
                {currentUser.status === 'Ativo' ? 'ACESSO ATIVO' : 'ACESSO INATIVO'}
              </div>
            </div>

            {/* Navigation Sections */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              <span className="text-[10px] font-mono text-[#99907c] font-black uppercase tracking-wider block mb-2 px-2">Navegação Principal</span>
              {[
                { id: 'inicio' as const, label: 'Início', icon: Home },
                { id: 'biblioteca' as const, label: 'Biblioteca', icon: BookOpen },
                ...(isAdminUser ? [
                  { id: 'questionarios' as const, label: 'Questionários', icon: HelpCircle },
                  { id: 'alertas' as const, label: 'Alertas', icon: Bell }
                ] : []),
                { id: 'perfil' as const, label: 'Meu Perfil', icon: User },
                { id: 'manual' as const, label: 'Manual de Uso', icon: Info }
              ].map((navInfo) => {
                const Icon = navInfo.icon;
                const isSelected = activeTab === navInfo.id;
                return (
                  <button
                    key={navInfo.id}
                    onClick={() => {
                      setDrawerOpen(false);
                      if (onChangeTab) onChangeTab(navInfo.id);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#E9C349]/15 text-[#f2ca50] border-[#E9C349]/45 shadow-sm'
                        : 'bg-[#04141D]/30 text-[#99907c] border-[#1c2c36]/40 hover:text-[#d4e5f2] hover:bg-[#11212b]'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{navInfo.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-[#1c2c36] bg-[#04141D] flex items-center justify-between text-xs text-[#99907c] font-mono">
              <span className="text-[10px]">v2.6.06.09.010</span>
              <button 
                onClick={() => {
                  setDrawerOpen(false);
                  if (onLogout) onLogout();
                }}
                className="text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer border-none bg-transparent focus:outline-none"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sair</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
