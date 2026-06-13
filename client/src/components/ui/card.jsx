import * as React from 'react';
import { cn } from '@/lib/utils';

const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'rounded-2xl border border-slate-100 bg-white/70 text-slate-900 shadow-xl shadow-slate-100/40 backdrop-blur-md transition-all duration-300 hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-0.5 relative overflow-hidden before:absolute before:inset-0 before:p-[1px] before:bg-gradient-to-br before:from-white/60 before:to-transparent before:rounded-2xl before:-z-10',
      className
    )}
    {...props}
  />
));
Card.displayName = 'Card';

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('flex flex-col space-y-2 p-6 sm:p-8', className)} {...props} />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'text-xl font-bold tracking-tight text-slate-800 bg-gradient-to-br from-slate-900 to-slate-700 bg-clip-text text-transparent',
      className
    )}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p ref={ref} className={cn('text-sm font-medium leading-relaxed text-slate-400/90', className)} {...props} />
));
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 sm:p-8 pt-0', className)} {...props} />
));
CardContent.displayName = 'CardContent';

export { Card, CardHeader, CardTitle, CardDescription, CardContent };