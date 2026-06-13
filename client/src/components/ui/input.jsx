import * as React from 'react';
import { cn } from '@/lib/utils';

const Input = React.forwardRef(({ className, type, ...props }, ref) => (
  <input
    type={type}
    className={cn(
      'flex h-11 w-full rounded-xl border border-slate-200 bg-slate-50/40 px-4 py-2.5 text-sm font-medium text-slate-800 placeholder:text-slate-400/80 transition-all duration-200 outline-none focus:border-indigo-500/80 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:bg-slate-100/60 disabled:opacity-50 file:border-0 file:bg-transparent file:text-sm file:font-semibold file:text-indigo-600',
      className
    )}
    ref={ref}
    {...props}
  />
));
Input.displayName = 'Input';

export { Input };