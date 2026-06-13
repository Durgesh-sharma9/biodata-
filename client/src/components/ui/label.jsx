import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cn } from '@/lib/utils';

const Label = React.forwardRef(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(
      'text-xs sm:text-sm font-semibold tracking-wide text-slate-700/90 select-none mb-1.5 inline-block peer-disabled:cursor-not-allowed peer-disabled:text-slate-400 peer-disabled:opacity-60 transition-colors duration-200',
      className
    )}
    {...props}
  />
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };