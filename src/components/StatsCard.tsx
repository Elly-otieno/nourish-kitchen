import { LucideIcon, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  trend?: string;
  subtext?: string;
  delay?: number;
}

export function StatsCard({ icon: Icon, label, value, trend, subtext, delay = 0 }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-surface-container-lowest p-8 rounded-xl soft-shadow border border-surface-container flex flex-col gap-4 overflow-hidden relative group"
    >
      <div className="w-12 h-12 rounded-full bg-emerald-50/50 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-500">
        <Icon size={24} />
      </div>
      
      <div>
        <p className="font-sans text-[10px] md:text-[11px] font-bold text-stone-400 uppercase tracking-[0.2em] mb-1">{label}</p>
        <h3 className="font-serif text-4xl md:text-5xl font-semibold text-on-background">{value}</h3>
      </div>

      {trend && (
        <div className="flex items-center gap-1.5 text-emerald-700 text-sm font-semibold">
          <TrendingUp size={16} />
          <span>{trend}</span>
        </div>
      )}
      
      {subtext && (
        <p className="text-stone-400 text-sm italic">{subtext}</p>
      )}
    </motion.div>
  );
}
