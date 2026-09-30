import * as React from 'react';
import { cn } from '@/lib/utils';

const Table = React.forwardRef(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-x-auto rounded-xl border border-slate-200/80 bg-white shadow-xs dark:bg-slate-900 dark:border-slate-800">
    <table ref={ref} className={cn('w-full caption-bottom text-sm border-collapse text-slate-700 dark:text-slate-300 antialiased', className)} {...props} />
  </div>
));
Table.displayName = 'Table';

const TableHeader = React.forwardRef(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn('bg-slate-50/90 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-700/80 [&_tr]:border-b-0', className)} {...props} />
));
TableHeader.displayName = 'TableHeader';

const TableBody = React.forwardRef(({ className, ...props }, ref) => (
  <tbody 
    ref={ref} 
    className={cn(
      '[&_tr:last-child]:border-0 [&_tr:nth-child(even)]:bg-slate-50/30 dark:[&_tr:nth-child(even)]:bg-slate-800/20', 
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
      'border-b border-slate-100 dark:border-slate-800/60 last:border-none transition-colors duration-75 hover:bg-slate-50/80 dark:hover:bg-slate-800/50 data-[state=selected]:bg-slate-100 dark:data-[state=selected]:bg-slate-800', 
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
      'h-10 px-3 text-left align-middle font-bold text-slate-600 dark:text-slate-300 tracking-wider text-[11px] uppercase select-none',
      className
    )}
    {...props}
  />
));
TableHead.displayName = 'TableHead';

const TableCell = React.forwardRef(({ className, ...props }, ref) => (
  <td ref={ref} className={cn('py-2.5 px-3 align-middle text-slate-700 dark:text-slate-300 font-normal text-xs border-none', className)} {...props} />
));
TableCell.displayName = 'TableCell';

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell };