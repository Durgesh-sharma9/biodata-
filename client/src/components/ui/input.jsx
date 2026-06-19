import * as React from 'react';
import { cn } from '@/lib/utils';

const Input = React.forwardRef(({ className, type, ...props }, ref) => (
  <input
    type={type}
    className={cn(
      'flex h-11 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 placeholder:text-slate-400 transition-all duration-200 outline-none focus:border-[#A05AFF]/60 focus:ring-4 focus:ring-[#A05AFF]/10 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 file:border-0 file:bg-transparent file:text-sm file:font-bold file:text-[#A05AFF] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-[#A05AFF]/60',
      className
    )}
    ref={ref}
    {...props}
  />
));
Input.displayName = 'Input';

export { Input };