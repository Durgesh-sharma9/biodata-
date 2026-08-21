import { Sparkles } from 'lucide-react';

export function PageHeader({ title, description, action }) {
  return (
    <div className="relative w-full flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-4 mb-2 border-b border-slate-200/80 dark:border-slate-800">
      {/* Premium Content Left Section */}
      <div className="space-y-2 max-w-2xl relative z-10">
        <div className="flex items-center gap-2.5">
          {/* Dynamic Gradient Accent Brand Marker */}
          <div className="h-2.5 w-2.5 rounded-full bg-gradient-to-tr from-violet-600 to-blue-600 shadow-sm shadow-indigo-500/50 hidden sm:block animate-pulse duration-3000" />
          
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-sans antialiased bg-clip-text">
            {title}
          </h1>
        </div>
        
        {description && (
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed pl-0 sm:pl-4 border-l-0 sm:border-l-2 border-slate-200/80 dark:border-slate-800 transition-all">
            {description}
          </p>
        )}
      </div>

      {/* Action Slot Section Frame with responsive padding alignment */}
      {action && (
        <div className="flex items-center self-start sm:self-auto shrink-0 z-10 sm:p-0.5">
          <div className="p-0.5 rounded-xl bg-gradient-to-r from-slate-200/60 via-slate-100 to-slate-200/60 dark:from-slate-800/40 dark:via-slate-800/80 dark:to-slate-800/40 shadow-sm">
            {action}
          </div>
        </div>
      )}
    </div>
  );
}