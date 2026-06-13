import * as React from 'react';
import { cn } from '@/lib/utils';

const Textarea = React.forwardRef(({ className, ...props }, ref) => (
  <textarea
    className={cn(
      'flex min-h-[100px] w-full rounded-xl border border-slate-200 bg-slate-50/40 px-4 py-3 text-sm font-medium text-slate-800 placeholder:text-slate-400/80 transition-all duration-200 outline-none focus:border-indigo-500/80 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:bg-slate-100/60 disabled:opacity-50 resize-y custom-scrollbar',
      className
    )}
    ref={ref}
    {...props}
  />
));
Textarea.displayName = 'Textarea';

export { Textarea };