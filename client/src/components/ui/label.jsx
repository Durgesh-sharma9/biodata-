import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cn } from '@/lib/utils';

const Label = React.forwardRef(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(
      'text-[11px] font-bold uppercase tracking-wider text-slate-400 select-none mb-1.5 inline-block peer-disabled:cursor-not-allowed peer-disabled:text-slate-300 dark:text-slate-500 transition-colors duration-200',
      className
    )}
    {...props}
  />
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };