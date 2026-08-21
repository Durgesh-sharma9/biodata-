import * as React from 'react';
import { cn } from '@/lib/utils';

const Card = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'rounded-xl border border-slate-200/80 bg-white text-slate-800 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 relative overflow-hidden transition-all duration-200',
        className
      )}
      {...props}
    />
  );
});
Card.displayName = 'Card';

const CardHeader = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div 
      ref={ref} 
      className={cn(
        'flex flex-col space-y-1.5 p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800/80 relative z-10', 
        className
      )} 
      {...props} 
    />
  );
});
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <h3
      ref={ref}
      className={cn(
        'text-sm font-bold tracking-tight text-slate-900 dark:text-slate-50 font-sans antialiased',
        className
      )}
      {...props}
    />
  );
});
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <p 
      ref={ref} 
      className={cn(
        'text-xs font-medium text-slate-500 dark:text-slate-400 leading-normal', 
        className
      )} 
      {...props} 
    />
  );
});
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-4 sm:p-5 text-sm antialiased', className)} {...props} />
));
CardContent.displayName = 'CardContent';

export { Card, CardHeader, CardTitle, CardDescription, CardContent };