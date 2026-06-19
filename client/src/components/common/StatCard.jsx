import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function StatCard({ title, value, icon: Icon, description }) {
  return (
    <Card className="relative overflow-hidden rounded-xl border-none bg-white shadow-sm dark:bg-slate-900 group">
      
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5 pt-5 px-5">
        <CardTitle className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 group-hover:text-[#A05AFF] transition-colors duration-200">
          {title}
        </CardTitle>
        
        {Icon && (
          <div className="p-2 rounded-xl bg-slate-50 text-slate-500 border border-slate-100 dark:bg-slate-950 dark:text-slate-400 dark:border-slate-800/60 transition-all duration-200 group-hover:bg-[#A05AFF]/10 group-hover:text-[#A05AFF] group-hover:border-[#A05AFF]/20 shrink-0">
            <Icon className="h-4 w-4 stroke-[2]" />
          </div>
        )}
      </CardHeader>

      <CardContent className="pb-5 px-5 pt-1 space-y-1">
        <div className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white">
          {value}
        </div>
        
        {description && (
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1">
            <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700 shrink-0" />
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}