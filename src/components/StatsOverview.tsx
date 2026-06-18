import { TrendingUp, Award, Cloud, Users } from 'lucide-react';
import InlineEditable from './InlineEditable';

export interface StatCardData {
  title: string;
  value: string;
  change: string;
  trend: string;
  desc: string;
  iconName: string;
  color: string;
}

interface StatsOverviewProps {
  stats: StatCardData[];
  isAdmin: boolean;
  onUpdateStatField: (index: number, field: keyof StatCardData, newValue: string) => void;
}

const IconMap: Record<string, any> = {
  TrendingUp,
  Users,
  Cloud,
  Award
};

export default function StatsOverview({ stats, isAdmin, onUpdateStatField }: StatsOverviewProps) {
  return (
    <div id="stats-overview-grid" className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mb-2.5">
      {stats.map((card, idx) => {
        const IconComp = IconMap[card.iconName] || TrendingUp;
        return (
          <div
            key={idx}
            className="bg-[#0c1d27] rounded-xl p-4 border border-[#1c2c36]/70 shadow-sm relative overflow-hidden group hover:border-[#E9C349]/40 transition-all flex flex-col justify-between"
          >
            {/* Ambient Background Glow on hover */}
            <div className="absolute -right-3 -bottom-3 opacity-5 group-hover:opacity-10 transition-all">
              <IconComp className="w-16 h-16 text-[#d4e5f2]" />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[9.5px] font-mono text-[#99907c] tracking-wider uppercase">
                <InlineEditable
                  value={card.title}
                  isAdmin={isAdmin}
                  onSave={(val) => onUpdateStatField(idx, 'title', val)}
                  className="font-mono text-[9.5px] text-[#99907c] tracking-wider uppercase"
                />
              </span>
              <IconComp className={`w-4 h-4 ${card.color}`} />
            </div>

            <div className="mt-2.5 space-y-1">
              <InlineEditable
                value={card.value}
                isAdmin={isAdmin}
                onSave={(val) => onUpdateStatField(idx, 'value', val)}
                className="font-sans font-bold text-base md:text-lg text-[#d4e5f2] tracking-tight truncate block"
              />
              <div className="flex flex-wrap items-center gap-1.5 mt-1">
                <InlineEditable
                  value={card.change}
                  isAdmin={isAdmin}
                  onSave={(val) => onUpdateStatField(idx, 'change', val)}
                  className="text-[10px] bg-[#26a69a]/20 text-[#66d9cc] font-mono px-1 py-0.5 rounded font-bold"
                />
                <InlineEditable
                  value={card.desc}
                  isAdmin={isAdmin}
                  onSave={(val) => onUpdateStatField(idx, 'desc', val)}
                  className="text-[9px] font-mono text-[#99907c] truncate block"
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
