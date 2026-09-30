import { Sparkles } from 'lucide-react';

export function PageHeader({ title, description, action }) {
  return (
    <div className="relative w-full flex items-center justify-between gap-3 pb-3 mb-2 border-b border-slate-200/80 dark:border-slate-800">
      {/* Content Left Section */}
      <div className="space-y-0.5 min-w-0 flex-1 relative z-10">
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-gradient-to-tr from-violet-600 to-blue-600 shadow-sm shadow-indigo-500/50 hidden sm:block animate-pulse duration-3000" />
          <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-sans antialiased truncate">
            {title}
          </h1>
        </div>
        
        {description && (
          <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 pl-0 sm:pl-3 border-l-0 sm:border-l-2 border-slate-200/80 dark:border-slate-800 transition-all truncate sm:whitespace-normal">
            {description}
          </p>
        )}
      </div>

      {/* Action Slot Section */}
      {action && (
        <div className="flex items-center shrink-0 z-10">
          {action}
        </div>
      )}
    </div>
  );
}