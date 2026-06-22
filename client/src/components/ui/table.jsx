import * as React from 'react';
import { cn } from '@/lib/utils';

const Table = React.forwardRef(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-x-auto rounded-2xl border border-slate-200/60 bg-white shadow-sm custom-scrollbar dark:bg-slate-900 dark:border-slate-800/80">
    <table ref={ref} className={cn('w-full caption-bottom text-sm border-collapse text-slate-700 dark:text-slate-300 antialiased', className)} {...props} />
  </div>
));
Table.displayName = 'Table';

const TableHeader = React.forwardRef(({ className, headerColor = 'slate', ...props }, ref) => {
  // Premium gradient header backgrounds for modern SaaS aesthetic
  const headerColors = {
    slate: 'bg-gradient-to-r from-violet-50 via-blue-50 to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900',
    purple: 'bg-gradient-to-r from-violet-50 via-purple-50 to-blue-50 dark:from-violet-950/20 dark:via-purple-900/10 dark:to-blue-950/20',
    blue: 'bg-gradient-to-r from-blue-50 via-cyan-50 to-sky-50 dark:from-blue-950/20 dark:via-cyan-900/10 dark:to-sky-950/20',
    emerald: 'bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950/20 dark:via-teal-900/10 dark:to-cyan-950/20',
    amber: 'bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-950/20 dark:via-orange-900/10 dark:to-yellow-950/20',
    cyan: 'bg-gradient-to-r from-cyan-50 via-sky-50 to-blue-50 dark:from-cyan-950/20 dark:via-sky-900/10 dark:to-blue-950/20',
    indigo: 'bg-gradient-to-r from-indigo-50 via-violet-50 to-purple-50 dark:from-indigo-950/20 dark:via-violet-900/10 dark:to-purple-950/20',
    pink: 'bg-gradient-to-r from-pink-50 via-rose-50 to-red-50 dark:from-pink-950/20 dark:via-rose-900/10 dark:to-red-950/20',
    orange: 'bg-gradient-to-r from-orange-50 via-amber-50 to-yellow-50 dark:from-orange-950/20 dark:via-amber-900/10 dark:to-yellow-950/20',
    rose: 'bg-gradient-to-r from-rose-50 via-pink-50 to-red-50 dark:from-rose-950/20 dark:via-pink-900/10 dark:to-red-950/20',
    violet: 'bg-gradient-to-r from-violet-50 via-purple-50 to-indigo-50 dark:from-violet-950/20 dark:via-purple-900/10 dark:to-indigo-950/20',
  };
  
  const selectedColor = headerColors[headerColor] || headerColors.slate;
  
  return (
    <thead ref={ref} className={cn(`${selectedColor} border-b border-slate-200/80 dark:border-slate-700/80 [&_tr]:border-b-0`, className)} {...props} />
  );
});
TableHeader.displayName = 'TableHeader';

const TableBody = React.forwardRef(({ className, ...props }, ref) => (
  <tbody 
    ref={ref} 
    className={cn(
      '[&_tr:last-child]:border-0 [&_tr:nth-child(even)]:bg-gradient-to-r [&_tr:nth-child(even)]:from-slate-50/50 [&_tr:nth-child(even)]:to-blue-50/30 dark:[&_tr:nth-child(even)]:from-slate-800/30 dark:[&_tr:nth-child(even)]:to-slate-900/20 [&_tr:hover]:bg-gradient-to-r [&_tr:hover]:from-violet-50/40 [&_tr:hover]:to-blue-50/30 dark:[&_tr:hover]:from-violet-950/20 dark:[&_tr:hover]:to-blue-950/10 transition-all duration-200', 
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
      'border-b border-slate-200/50 last:border-none dark:border-slate-800/50 transition-all duration-200 hover:bg-gradient-to-r hover:from-violet-50/40 hover:to-blue-50/30 dark:hover:from-violet-950/20 dark:hover:to-blue-950/10 data-[state=selected]:bg-violet-50/60 dark:data-[state=selected]:bg-violet-900/30', 
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
      'h-12 px-6 text-left align-middle font-bold text-slate-700 dark:text-slate-300 tracking-wider text-[11px] uppercase select-none transition-colors duration-150',
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