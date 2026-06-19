import { Sparkles } from 'lucide-react';

export function PageHeader({ title, description, action }) {
  return (
    <div className="relative w-full flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-4">
      {/* Premium Content Left Section */}
      <div className="space-y-1.5 max-w-2xl">
        <div className="flex items-center gap-2">
          {/* Accent Brand Marker aligned to the universal Primary Accent hue */}
          <div className="h-2 w-2 rounded-full bg-[#A05AFF] hidden sm:block" />
          
          <h1 className="text-xl font-bold tracking-tight text-slate-800 dark:text-white">
            {title}
          </h1>
        </div>
        
        {description && (
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed pl-0 sm:pl-4 border-l-0 sm:border-l border-slate-200 dark:border-slate-800 transition-all">
            {description}
          </p>
        )}
      </div>

      {/* Action Slot Section Frame matching standard component layers */}
      {action && (
        <div className="flex items-center self-start sm:self-auto shrink-0 z-10">
          {action}
        </div>
      )}
    </div>
  );
}