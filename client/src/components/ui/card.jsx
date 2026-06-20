import * as React from 'react';
import { cn } from '@/lib/utils';

// Dynamic sub-variant maps keeping codebase clean without changing props signature
const CARD_THEME_MAP = {
  // Card Headers Gradients
  'dashboard-header': 'bg-gradient-to-r from-violet-600 to-blue-600 text-white dark:from-violet-700 dark:to-blue-700',
  'candidates-header': 'bg-gradient-to-r from-orange-500 to-pink-500 text-white dark:from-orange-600 dark:to-pink-600',
  'pool-header': 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white dark:from-emerald-600 dark:to-cyan-600',
  'credits-header': 'bg-gradient-to-r from-amber-500 to-orange-500 text-white dark:from-amber-600 dark:to-orange-600',
  
  // Filter Engine Specific Top Section
  'filter-header': 'bg-amber-50 text-amber-900 border-b border-amber-100 dark:bg-amber-950/30 dark:text-amber-200 dark:border-amber-900/50',
};

// Card background gradients for different contexts
const CARD_BACKGROUND_MAP = {
  'dashboard': 'bg-gradient-to-br from-white to-violet-50 dark:from-slate-900 dark:to-violet-950/20',
  'table': 'bg-gradient-to-br from-white to-blue-50/30 dark:from-slate-900 dark:to-blue-950/20',
  'filter': 'bg-gradient-to-br from-white to-purple-50/30 dark:from-slate-900 dark:to-purple-950/20',
  'default': 'bg-white dark:bg-slate-900',
};

const Card = React.forwardRef(({ className, ...props }, ref) => {
  // Detect card type from className to apply appropriate background
  let cardBackground = CARD_BACKGROUND_MAP['default'];
  
  if (className?.includes('dashboard')) cardBackground = CARD_BACKGROUND_MAP['dashboard'];
  else if (className?.includes('table')) cardBackground = CARD_BACKGROUND_MAP['table'];
  else if (className?.includes('filter')) cardBackground = CARD_BACKGROUND_MAP['filter'];

  return (
    <div
      ref={ref}
      className={cn(
        // SaaS modern aesthetic: soft shadow, micro-border, active scale transitions
        'rounded-2xl border border-slate-200/60 text-slate-800 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-[2px] dark:border-slate-800/80 dark:text-slate-100 relative overflow-hidden',
        cardBackground,
        className
      )}
      {...props}
    />
  );
});
Card.displayName = 'Card';

const CardHeader = React.forwardRef(({ className, ...props }, ref) => {
  // Dynamically resolve gradient classes using className clues safely to protect logic
  let headerTheme = 'border-b border-slate-100 dark:border-slate-800/60';
  
  if (className?.includes('dashboard')) headerTheme = CARD_THEME_MAP['dashboard-header'];
  else if (className?.includes('candidates')) headerTheme = CARD_THEME_MAP['candidates-header'];
  else if (className?.includes('pool')) headerTheme = CARD_THEME_MAP['pool-header'];
  else if (className?.includes('credits')) headerTheme = CARD_THEME_MAP['credits-header'];
  else if (className?.includes('filter')) headerTheme = CARD_THEME_MAP['filter-header'];

  return (
    <div 
      ref={ref} 
      className={cn(
        'flex flex-col space-y-1.5 p-5 relative z-10', 
        headerTheme,
        className
      )} 
      {...props} 
    />
  );
});
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef(({ className, ...props }, ref) => {
  const isGradientHeader = className?.includes('dashboard') || className?.includes('candidates') || className?.includes('pool') || className?.includes('credits');
  
  return (
    <h3
      ref={ref}
      className={cn(
        'text-sm font-semibold tracking-wide text-slate-900 dark:text-slate-50 font-sans antialiased',
        isGradientHeader && 'text-white dark:text-white font-bold drop-shadow-sm',
        className
      )}
      {...props}
    />
  );
});
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef(({ className, ...props }, ref) => {
  const isGradientHeader = className?.includes('dashboard') || className?.includes('candidates') || className?.includes('pool') || className?.includes('credits');

  return (
    <p 
      ref={ref} 
      className={cn(
        'text-xs font-medium text-slate-500 dark:text-slate-400 leading-normal mix-blend-normal opacity-90', 
        isGradientHeader && 'text-slate-100 dark:text-slate-200 opacity-85 font-medium',
        className
      )} 
      {...props} 
    />
  );
});
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 text-sm antialiased', className)} {...props} />
));
CardContent.displayName = 'CardContent';

export { Card, CardHeader, CardTitle, CardDescription, CardContent };