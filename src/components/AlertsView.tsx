import { SystemAlert, ExecutiveReport } from '../types';
import { Bell, AlertTriangle, RefreshCw, CheckCircle, ExternalLink, ShieldAlert } from 'lucide-react';

interface AlertsViewProps {
  alerts: SystemAlert[];
  reports: ExecutiveReport[];
  onMarkAllRead: () => void;
  onToggleRead: (id: string) => void;
  onSelectReport: (report: ExecutiveReport) => void;
}

export default function AlertsView({
  alerts,
  reports,
  onMarkAllRead,
  onToggleRead,
  onSelectReport
}: AlertsViewProps) {
  const activeAlerts = alerts.filter(a => !a.read);

  const handleAlertClick = (alert: SystemAlert) => {
    onToggleRead(alert.id);
    if (alert.reportId) {
      const associatedReport = reports.find(r => r.id === alert.reportId);
      if (associatedReport) {
        onSelectReport(associatedReport);
      }
    }
  };

  return (
    <div id="alerts-view-window" className="p-4 space-y-4 max-w-2xl mx-auto text-left animate-fade-in mb-16">
      
      {/* Alert Header Box */}
      <div className="bg-[#0c1d27] rounded-xl p-5 border border-[#1c2c36]/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-[#E9C349]/20 p-2.5 rounded-lg border border-[#E9C349]/30">
            <Bell className="w-5 h-5 text-[#E9C349]" />
          </div>
          <div>
            <h2 className="font-sans font-bold text-base text-[#d4e5f2]">Alertas de Inteligência</h2>
          </div>
        </div>
        
        {activeAlerts.length > 0 && (
          <button
            onClick={onMarkAllRead}
            className="text-[11px] font-mono font-bold text-[#66d9cc] hover:underline"
          >
            Lido por completo
          </button>
        )}
      </div>

      {/* List content */}
      <div className="space-y-3">
        {activeAlerts.map((alert) => {
          const isCritical = alert.type === 'critical';
          
          return (
            <div
              key={alert.id}
              onClick={() => handleAlertClick(alert)}
              className={`p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden group ${
                alert.read 
                  ? 'bg-[#06273a]/40 border-[#1c2c36] opacity-75' 
                  : 'bg-[#0c1d27] border-[#26a69a]/40 shadow-sm hover:border-[#E9C349]'
              }`}
            >
              {/* Alert category sidebar */}
              <div className={`absolute top-0 bottom-0 left-0 w-1 ${
                isCritical ? 'bg-rose-500' : 'bg-[#66d9cc]'
              }`} />

              <div className="flex items-start justify-between gap-3 pl-2">
                <div className="flex items-start gap-2.5">
                  {isCritical ? (
                    <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  ) : (
                    <RefreshCw className="w-4 h-4 text-[#66d9cc] shrink-0 mt-0.5 animate-spin-slow" />
                  )}
                  
                  <div>
                    <h3 className={`text-xs font-sans font-bold ${
                      alert.read ? 'text-[#99907c]' : 'text-[#d4e5f2]'
                    }`}>
                      {alert.title}
                    </h3>
                    <p className="text-xs font-sans text-[#a5b8c7] mt-1 pr-6 leading-normal">
                      {alert.description}
                    </p>
                    
                    {alert.reportId && (
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-[#E9C349] mt-2.5 bg-[#11212b] px-2 py-0.5 rounded border border-[#1a2d39]">
                        <ExternalLink className="w-2.5 h-2.5" /> Acessar Título Associado
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end shrink-0 text-right">
                  <span className="font-mono text-[9px] text-[#99907c]">
                    {alert.time}
                  </span>
                  {!alert.read && (
                    <span className="w-2 h-2 rounded-full bg-[#f2ca50] mt-2 animate-bounce" />
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {activeAlerts.length === 0 && (
          <div className="text-center py-10 bg-[#0c1d27]/40 rounded-xl border border-[#1c2c36]/40">
            <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-50" />
            <p className="text-xs text-[#99907c] font-mono italic">
              Nenhuma notificação estratégica pendente. Toda a operação está em conformidade.
            </p>
          </div>
        )}
      </div>

      {/* Informative SLA footnote */}
      <p className="text-[10.5px] font-mono font-medium text-[#99907c]/80 text-center pt-2 leading-relaxed">
        * Alertas de conformidade fiscal e acessos sensíveis expiram automaticamente a cada 48 horas de acordo com as normas da LGPD.
      </p>
    </div>
  );
}
