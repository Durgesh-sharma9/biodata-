import * as React from 'react';
import { cn } from '@/lib/utils';

const Table = React.forwardRef(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto rounded-xl border border-none bg-white shadow-sm custom-scrollbar dark:bg-slate-900">
    <table ref={ref} className={cn('w-full caption-bottom text-sm border-collapse text-slate-700 dark:text-slate-300', className)} {...props} />
  </div>
));
Table.displayName = 'Table';

const TableHeader = React.forwardRef(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn('bg-slate-50/70 dark:bg-slate-900/20 border-b border-slate-100 dark:border-slate-800 [&_tr]:border-b-0', className)} {...props} />
));
TableHeader.displayName = 'TableHeader';

const TableBody = React.forwardRef(({ className, ...props }, ref) => (
  <tbody ref={ref} className={cn('[&_tr:last-child]:border-0', className)} {...props} />
));
TableBody.displayName = 'TableBody';

const TableRow = React.forwardRef(({ className, ...props }, ref) => (
  <tr 
    ref={ref} 
    className={cn(
      'border-b border-slate-100 last:border-none dark:border-slate-800/60 transition-all duration-150 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 data-[state=selected]:bg-[#A05AFF]/5', 
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
      'h-12 px-5 text-left align-middle font-semibold text-slate-400 dark:text-slate-500 tracking-wider text-[11px] uppercase select-none',
      className
    )}
    {...props}
  />
));
TableHead.displayName = 'TableHead';

const TableCell = React.forwardRef(({ className, ...props }, ref) => (
  <td ref={ref} className={cn('p-5 align-middle text-slate-600 dark:text-slate-300 font-medium tracking-normal', className)} {...props} />
));
TableCell.displayName = 'TableCell';

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell };