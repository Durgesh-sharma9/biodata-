import * as React from 'react';
import { cn } from '@/lib/utils';

const Textarea = React.forwardRef(({ className, ...props }, ref) => (
  <textarea
    className={cn(
      'flex min-h-[100px] w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 placeholder:text-slate-400 transition-all duration-200 outline-none focus:border-[#A05AFF]/60 focus:ring-4 focus:ring-[#A05AFF]/10 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 resize-y custom-scrollbar dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-[#A05AFF]/60',
      className
    )}
    ref={ref}
    {...props}
  />
));
Textarea.displayName = 'Textarea';

export { Textarea };