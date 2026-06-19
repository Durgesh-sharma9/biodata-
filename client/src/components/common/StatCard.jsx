import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function StatCard({ title, value, icon: Icon, description, color = 'purple' }) {
  const colorMap = {
    purple: { bg: 'bg-purple-50 dark:bg-purple-950/20', text: 'text-purple-600 dark:text-purple-400', border: 'border-purple-100 dark:border-purple-900/30', glow: 'from-purple-500/5 to-transparent', hoverText: 'group-hover:text-purple-600 dark:group-hover:text-purple-400' },
    blue: { bg: 'bg-blue-50 dark:bg-blue-950/20', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-100 dark:border-blue-900/30', glow: 'from-blue-500/5 to-transparent', hoverText: 'group-hover:text-blue-600 dark:group-hover:text-blue-400' },
    emerald: { bg: 'bg-emerald-50 dark:bg-emerald-950/20', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-100 dark:border-emerald-900/30', glow: 'from-emerald-500/5 to-transparent', hoverText: 'group-hover:text-emerald-600 dark:group-hover:text-emerald-400' },
    amber: { bg: 'bg-amber-50 dark:bg-amber-950/20', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-100 dark:border-amber-900/30', glow: 'from-amber-500/5 to-transparent', hoverText: 'group-hover:text-amber-600 dark:group-hover:text-amber-400' },
    cyan: { bg: 'bg-cyan-50 dark:bg-cyan-950/20', text: 'text-cyan-600 dark:text-cyan-400', border: 'border-cyan-100 dark:border-cyan-900/30', glow: 'from-cyan-500/5 to-transparent', hoverText: 'group-hover:text-cyan-600 dark:group-hover:text-cyan-400' },
    indigo: { bg: 'bg-indigo-50 dark:bg-indigo-950/20', text: 'text-indigo-600 dark:text-indigo-400', border: 'border-indigo-100 dark:border-indigo-900/30', glow: 'from-indigo-500/5 to-transparent', hoverText: 'group-hover:text-indigo-600 dark:group-hover:text-indigo-400' },
    pink: { bg: 'bg-pink-50 dark:bg-pink-950/20', text: 'text-pink-600 dark:text-pink-400', border: 'border-pink-100 dark:border-pink-900/30', glow: 'from-pink-500/5 to-transparent', hoverText: 'group-hover:text-pink-600 dark:group-hover:text-pink-400' },
    orange: { bg: 'bg-orange-50 dark:bg-orange-950/20', text: 'text-orange-600 dark:text-orange-400', border: 'border-orange-100 dark:border-orange-900/30', glow: 'from-orange-500/5 to-transparent', hoverText: 'group-hover:text-orange-600 dark:group-hover:text-orange-400' },
    rose: { bg: 'bg-rose-50 dark:bg-rose-950/20', text: 'text-rose-600 dark:text-rose-400', border: 'border-rose-100 dark:border-rose-900/30', glow: 'from-rose-500/5 to-transparent', hoverText: 'group-hover:text-rose-600 dark:group-hover:text-rose-400' },
    violet: { bg: 'bg-violet-50 dark:bg-violet-950/20', text: 'text-violet-600 dark:text-violet-400', border: 'border-violet-100 dark:border-violet-900/30', glow: 'from-violet-500/5 to-transparent', hoverText: 'group-hover:text-violet-600 dark:group-hover:text-violet-400' },
  };
  
  const colors = colorMap[color] || colorMap.purple;
  
  return (
    <Card className="relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-sm dark:bg-slate-900 dark:border-slate-800/80 group hover:shadow-md hover:-translate-y-[1px] transition-all duration-300">
      
      {/* Dynamic backdrop ambient glow that targets the card base on hover */}
      <div className={`absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-br ${colors.glow} rounded-full blur-2xl pointer-events-none transition-opacity opacity-40 group-hover:opacity-100 duration-500`} />

      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5 pt-5 px-5">
        <CardTitle className={`text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 ${colors.hoverText} transition-colors duration-200`}>
          {title}
        </CardTitle>
        
        {Icon && (
          <div className={`p-2 rounded-xl border ${colors.bg} ${colors.text} ${colors.border} transition-all duration-300 group-hover:scale-105 shrink-0 shadow-xs`}>
            <Icon className="h-4 w-4 stroke-[2]" />
          </div>
        )}
      </CardHeader>

      <CardContent className="pb-5 px-5 pt-1.5 space-y-2 relative z-10">
        <div className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-sans antialiased">
          {value}
        </div>
        
        {description && (
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
            {/* Safe replacement execution via color keys map directly */}
            <span className={`h-1.5 w-1.5 rounded-full ${colors.text.includes('purple') ? 'bg-purple-500' : colors.text.includes('blue') ? 'bg-blue-500' : colors.text.includes('emerald') ? 'bg-emerald-500' : colors.text.includes('amber') ? 'bg-amber-500' : colors.text.includes('cyan') ? 'bg-cyan-500' : colors.text.includes('indigo') ? 'bg-indigo-500' : colors.text.includes('pink') ? 'bg-pink-500' : colors.text.includes('orange') ? 'bg-orange-500' : colors.text.includes('rose') ? 'bg-rose-500' : 'bg-violet-500'} shrink-0`} />
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}