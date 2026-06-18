import { Home, Bell, User, HelpCircle, BookOpen } from 'lucide-react';

interface BottomNavProps {
  activeTab: 'inicio' | 'alertas' | 'perfil' | 'questionarios' | 'manual';
  onChangeTab: (tab: 'inicio' | 'alertas' | 'perfil' | 'questionarios' | 'manual') => void;
  unreadAlertsCount: number;
  showProfileButton?: boolean;
  isAdminUser?: boolean;
}

export default function BottomNav({
  activeTab,
  onChangeTab,
  unreadAlertsCount,
  showProfileButton = true,
  isAdminUser = false
}: BottomNavProps) {
  const tabs: Array<{ id: 'inicio' | 'alertas' | 'perfil' | 'questionarios' | 'manual'; label: string; icon: any; badgeCount?: number }> = [
    { id: 'inicio', label: 'Início', icon: Home },
    ...(isAdminUser ? [
      { id: 'questionarios' as const, label: 'Questionários', icon: HelpCircle }
    ] : []),
    ...(isAdminUser ? [
      { id: 'alertas' as const, label: 'Alertas', icon: Bell, badgeCount: unreadAlertsCount }
    ] : []),
    ...(showProfileButton ? [{ id: 'perfil' as const, label: 'Perfil', icon: User }] : []),
    { id: 'manual', label: 'Manual', icon: BookOpen }
  ];


  return (
    <nav
      id="bottom-navigation-bar"
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#05151e] border-t border-[#1c2c36] py-2.5 px-4 flex justify-around items-center shadow-[0_-4px_10px_rgba(0,0,0,0.4)]"
    >
      <div className="w-full max-w-lg mx-auto flex justify-between items-center">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className="flex flex-col items-center justify-center flex-1 py-1 px-2 relative group focus:outline-none transition-all duration-150"
            >
              <div className="relative">
                <IconComponent
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive
                      ? 'text-[#f2ca50] scale-110'
                      : 'text-[#99907c] group-hover:text-[#d4e5f2]'
                  }`}
                />
                
                {/* Bell notification badge indicator if any */}
                {'badgeCount' in tab && tab.badgeCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-rose-500 text-white font-mono font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center animate-pulse border border-[#05151e]">
                    {tab.badgeCount}
                  </span>
                )}
              </div>

              <span
                className={`text-[10px] font-mono mt-1 transition-colors ${
                  isActive
                    ? 'text-[#f2ca50] font-semibold'
                    : 'text-[#99907c] group-hover:text-[#d4e5f2]'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
