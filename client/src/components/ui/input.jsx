import * as React from 'react';
import { cn } from '@/lib/utils';

const Input = React.forwardRef(({ className, type, ...props }, ref) => (
  <input
    type={type}
    className={cn(
      'flex h-11 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 placeholder:text-slate-400 transition-all duration-200 outline-none focus:border-[#0F766E]/60 focus:ring-4 focus:ring-[#0F766E]/10 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 file:border-0 file:bg-transparent file:text-sm file:font-bold file:text-[#0F766E] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-[#0F766E]/60',
      className
    )}
    ref={ref}
    {...props}
  />
));
Input.displayName = 'Input';

export { Input };