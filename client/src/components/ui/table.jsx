import * as React from 'react';
import { cn } from '@/lib/utils';

const Table = React.forwardRef(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto rounded-2xl border border-slate-200/60 bg-white shadow-sm custom-scrollbar dark:bg-slate-900 dark:border-slate-800/80">
    <table ref={ref} className={cn('w-full caption-bottom text-sm border-collapse text-slate-700 dark:text-slate-300 antialiased', className)} {...props} />
  </div>
));
Table.displayName = 'Table';

const TableHeader = React.forwardRef(({ className, headerColor = 'slate', ...props }, ref) => {
  // Enhanced to match professional SaaS tools with elegant gradients and high-contrast dark mode filters
  const headerColors = {
    slate: 'bg-gradient-to-b from-slate-50/80 to-slate-100/60 dark:from-slate-900 dark:to-slate-900/40',
    purple: 'bg-gradient-to-r from-purple-50/80 via-purple-50/30 to-transparent dark:from-purple-950/20 dark:to-transparent',
    blue: 'bg-gradient-to-r from-blue-50/80 via-blue-50/30 to-transparent dark:from-blue-950/20 dark:to-transparent',
    emerald: 'bg-gradient-to-r from-emerald-50/80 via-emerald-50/30 to-transparent dark:from-emerald-950/20 dark:to-transparent',
    amber: 'bg-gradient-to-r from-amber-50/80 via-amber-50/30 to-transparent dark:from-amber-950/20 dark:to-transparent',
    cyan: 'bg-gradient-to-r from-cyan-50/80 via-cyan-50/30 to-transparent dark:from-cyan-950/20 dark:to-transparent',
    indigo: 'bg-gradient-to-r from-indigo-50/80 via-indigo-50/30 to-transparent dark:from-indigo-950/20 dark:to-transparent',
    pink: 'bg-gradient-to-r from-pink-50/80 via-pink-50/30 to-transparent dark:from-pink-950/20 dark:to-transparent',
    orange: 'bg-gradient-to-r from-orange-50/80 via-orange-50/30 to-transparent dark:from-orange-950/20 dark:to-transparent',
    rose: 'bg-gradient-to-r from-rose-50/80 via-rose-50/30 to-transparent dark:from-rose-950/20 dark:to-transparent',
    violet: 'bg-gradient-to-r from-violet-50/80 via-violet-50/30 to-transparent dark:from-violet-950/20 dark:to-transparent',
  };
  
  const selectedColor = headerColors[headerColor] || headerColors.slate;
  
  return (
    <thead ref={ref} className={cn(`${selectedColor} border-b border-slate-200/80 dark:border-slate-800/80 [&_tr]:border-b-0`, className)} {...props} />
  );
});
TableHeader.displayName = 'TableHeader';

const TableBody = React.forwardRef(({ className, ...props }, ref) => (
  <tbody 
    ref={ref} 
    className={cn(
      '[&_tr:last-child]:border-0 [&_tr:nth-child(even)]:bg-slate-50/40 dark:[&_tr:nth-child(even)]:bg-slate-800/10', 
      className
    )} 
    {...props} 
  />
));
TableBody.displayName = 'TableBody';

const TableRow = React.forwardRef(({ className, ...props }, ref) => (
  <tr 
    ref={ref} 
    className={cn(
      'border-b border-slate-200/50 last:border-none dark:border-slate-800/50 transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-800/30 data-[state=selected]:bg-purple-50/60 dark:data-[state=selected]:bg-purple-900/30', 
      className
    )} 
    {...props} 
  />
));
TableRow.displayName = 'TableRow';

const TableHead = React.forwardRef(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      'h-11 px-6 text-left align-middle font-semibold text-slate-600 dark:text-slate-400 tracking-wider text-[11px] uppercase select-none transition-colors duration-150',
      className
    )}
    {...props}
  />
));
TableHead.displayName = 'TableHead';

const TableCell = React.forwardRef(({ className, ...props }, ref) => (
  <td ref={ref} className={cn('p-4 px-6 align-middle text-slate-700 dark:text-slate-300 font-normal tracking-normal text-sm border-none', className)} {...props} />
));
TableCell.displayName = 'TableCell';

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell };