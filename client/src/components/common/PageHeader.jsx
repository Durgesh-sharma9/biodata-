import { FileText } from 'lucide-react';

export function PageHeader({ title, description, action }) {
  return (
    <div className="relative w-full rounded-lg overflow-hidden mb-2 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
      {/* Soft Pastel Gradient Strip from reference image */}
      <div className="bg-gradient-to-r from-[#F0FCF5] via-[#EFF6FF] to-[#FAF5FF] dark:from-slate-800/90 dark:via-slate-800/70 dark:to-slate-800/90 px-4 py-3 flex items-center justify-between gap-3">
        {/* Left: Icon + Title */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="h-8 w-8 rounded-lg bg-white dark:bg-slate-700 flex items-center justify-center shrink-0 border border-slate-200/80 shadow-2xs">
            <FileText className="h-4 w-4 text-[#8A3BD4]" />
          </div>
          <div className="min-w-0">
            <h1 className="text-sm sm:text-base font-bold tracking-tight text-slate-900 dark:text-white truncate">
              {title}
            </h1>
            {description && (
              <p className="text-[11.5px] font-medium text-slate-500 dark:text-slate-400 truncate hidden sm:block">
                {description}
              </p>
            )}
          </div>
        </div>

        {/* Action Slot */}
        {action && (
          <div className="flex items-center shrink-0">
            {action}
          </div>
        )}
      </div>
    </div>
  );
}