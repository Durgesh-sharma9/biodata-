import * as React from 'react';
import { cn } from '@/lib/utils';

const Table = React.forwardRef(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto rounded-2xl border border-slate-100/80 bg-white/60 backdrop-blur-md shadow-xl shadow-slate-100/40 custom-scrollbar">
    <table ref={ref} className={cn('w-full caption-bottom text-sm border-collapse text-slate-700', className)} {...props} />
  </div>
));
Table.displayName = 'Table';

const TableHeader = React.forwardRef(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn('bg-gradient-to-r from-slate-50/70 via-slate-50/40 to-transparent border-b border-slate-100 [&_tr]:border-b-0', className)} {...props} />
));
TableHeader.displayName = 'TableHeader';

const TableBody = React.forwardRef(({ className, ...props }, ref) => (
  <tbody ref={ref} className={cn('[&_tr:last-child]:border-0 [&_tr:nth-child(even)]:bg-slate-50/20', className)} {...props} />
));
TableBody.displayName = 'TableBody';

const TableRow = React.forwardRef(({ className, ...props }, ref) => (
  <tr 
    ref={ref} 
    className={cn(
      'border-b border-slate-100/80 transition-all duration-200 hover:bg-gradient-to-r hover:from-indigo-50/30 hover:to-blue-50/10 data-[state=selected]:bg-indigo-50/50', 
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
      'h-12 px-5 text-left align-middle font-bold text-slate-500 tracking-wider text-xs uppercase select-none',
      className
    )}
    {...props}
  />
));
TableHead.displayName = 'TableHead';

const TableCell = React.forwardRef(({ className, ...props }, ref) => (
  <td ref={ref} className={cn('p-5 align-middle text-slate-600 font-medium tracking-normal', className)} {...props} />
));
TableCell.displayName = 'TableCell';

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell };