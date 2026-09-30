import * as React from 'react';
import { cn } from '@/lib/utils';

const Card = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'rounded-lg border border-slate-200/80 bg-white text-slate-800 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 relative transition-all duration-200 overflow-hidden',
        className
      )}
      {...props}
    />
  );
});
Card.displayName = 'Card';

const CardHeader = React.forwardRef(({ className, ...props }, ref) => {
  const cleanClassName = className ? className.replace(/\bbg-(?:slate|white|gray|zinc|neutral|teal)[^\s]*/g, '') : '';
  const isBorderless = className && (className.includes('border-none') || className.includes('border-b-0'));

  return (
    <div 
      ref={ref} 
      className={cn(
        'flex flex-col space-y-1.5 p-4 sm:p-5 relative z-10', 
        !isBorderless && 'border-b border-slate-200/70 dark:border-slate-800/80',
        cleanClassName,
        'bg-gradient-to-r from-[#F0FCF5] via-[#EFF6FF] to-[#FAF5FF] dark:from-slate-800/80 dark:via-slate-800/60 dark:to-slate-800/80'
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
  <div ref={ref} className={cn('p-4 sm:p-5 text-sm antialiased bg-white dark:bg-slate-900', className)} {...props} />
));
CardContent.displayName = 'CardContent';

export { Card, CardHeader, CardTitle, CardDescription, CardContent };