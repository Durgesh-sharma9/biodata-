import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold tracking-wide transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8A3BD4] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40 active:scale-[0.98]',
  {
    variants: {
      variant: {
        default: 'bg-gradient-to-r from-[#7C3AED] via-[#9333EA] to-[#A855F7] text-white shadow-sm shadow-purple-500/20 hover:from-[#6D28D9] hover:via-[#7E22CE] hover:to-[#9333EA] hover:shadow-md hover:shadow-purple-500/25 active:translate-y-0 border-none',
        destructive: 'bg-gradient-to-r from-[#FE9496] to-[#ff7b8f] text-white shadow-sm shadow-[#FE9496]/20 hover:opacity-95 hover:shadow-md hover:shadow-[#FE9496]/30 border-none',
        outline: 'border border-slate-200 bg-white text-slate-700 shadow-2xs hover:border-[#8A3BD4]/40 hover:bg-purple-50/50 hover:text-[#8A3BD4] dark:bg-slate-900 dark:border-slate-800',
        secondary: 'border border-[#8A3BD4]/20 bg-purple-50 text-[#8A3BD4] shadow-2xs hover:bg-purple-100 hover:border-[#8A3BD4]/40',
        ghost: 'text-slate-600 hover:bg-purple-50 hover:text-[#8A3BD4] dark:text-slate-400 dark:hover:bg-slate-800/50',
        link: 'text-[#8A3BD4] decoration-[#8A3BD4]/30 underline-offset-4 hover:underline hover:text-[#7B2CBF]',
        // Action button variants with specific colors and hover effects
        view: 'text-blue-600 hover:bg-blue-50 hover:scale-105 dark:text-blue-400 dark:hover:bg-blue-950/30 rounded-md transition-all duration-200',
        edit: 'text-emerald-600 hover:bg-emerald-50 hover:scale-105 dark:text-emerald-400 dark:hover:bg-emerald-950/30 rounded-md transition-all duration-200',
        delete: 'text-rose-600 hover:bg-rose-50 hover:scale-105 dark:text-rose-400 dark:hover:bg-rose-950/30 rounded-md transition-all duration-200',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-11 rounded-lg px-6 text-sm',
        icon: 'h-9 w-9 rounded-md',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'button';
  return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
});
Button.displayName = 'Button';

export { Button, buttonVariants };