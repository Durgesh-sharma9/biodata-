import { Sparkles } from 'lucide-react';

export function PageHeader({ title, description, action }) {
  return (
    <div className="relative w-full flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-2">
      {/* Premium Content Left Section */}
      <div className="space-y-1.5 max-w-2xl">
        <div className="flex items-center gap-2">
          {/* Subtle Accent Brand Marker for HireHub Layouts */}
          <div className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 shadow-xs hidden sm:block animate-pulse" />
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white sm:text-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 dark:from-white dark:via-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
            {title}
          </h1>
        </div>
        
        {description && (
          <p className="text-sm font-medium text-muted-foreground/90 leading-relaxed pl-0 sm:pl-4 border-l-0 sm:border-l-2 sm:border-slate-200/60 dark:sm:border-slate-800/60 transition-all">
            {description}
          </p>
        )}
      </div>

      {/* Action Slot Section Frame with Micro-Hover Lift Wrapper */}
      {action && (
        <div className="flex items-center self-start sm:self-auto shrink-0 z-10 transform hover:scale-[1.01] active:scale-[0.99] transition-all duration-150">
          {action}
        </div>
      )}
    </div>
  );
}