import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function StatCard({ title, value, icon: Icon, description }) {
  return (
    <Card className="relative overflow-hidden border border-slate-200/60 dark:border-slate-800/80 bg-card rounded-2xl shadow-xs transition-all duration-300 hover:shadow-md group">
      
      {/* Decorative inner gradient orb background blur for premium SaaS feel */}
      <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-gradient-to-br from-blue-500/5 to-indigo-500/10 dark:from-blue-500/2 dark:to-indigo-500/5 rounded-full blur-xl transition-transform duration-500 group-hover:scale-125 pointer-events-none" />

      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5 pt-5 px-5">
        <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground/90 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200">
          {title}
        </CardTitle>
        
        {Icon && (
          <div className="p-2 rounded-xl bg-slate-50 text-slate-500 border border-slate-100 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800/60 transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-blue-600 group-hover:to-indigo-600 group-hover:text-white group-hover:border-transparent group-hover:shadow-xs group-hover:scale-105 shrink-0">
            <Icon className="h-4 w-4 stroke-[2]" />
          </div>
        )}
      </CardHeader>

      <CardContent className="pb-5 px-5 pt-1 space-y-1">
        <div className="text-3xl font-black tracking-tight text-slate-900 dark:text-white bg-gradient-to-r from-slate-900 to-slate-800 dark:from-white dark:to-slate-200 bg-clip-text">
          {value}
        </div>
        
        {description && (
          <p className="text-[11px] font-semibold text-muted-foreground/80 tracking-wide flex items-center gap-1">
            <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700 shrink-0" />
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}