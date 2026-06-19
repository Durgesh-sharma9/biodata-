import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold tracking-wide transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A05AFF] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40 active:scale-[0.98]',
  {
    variants: {
      variant: {
        default: 'bg-gradient-to-r from-[#A05AFF] via-[#9E58FF] to-[#4BCBEB] text-white shadow-md shadow-[#A05AFF]/20 hover:opacity-95 hover:shadow-lg hover:shadow-[#A05AFF]/30 hover:-translate-y-0.5 border-none',
        destructive: 'bg-gradient-to-r from-[#FE9496] to-[#ff7b8f] text-white shadow-md shadow-[#FE9496]/20 hover:opacity-95 hover:shadow-lg hover:shadow-[#FE9496]/30 hover:-translate-y-0.5 border-none',
        outline: 'border border-slate-200 bg-white text-slate-600 shadow-xs hover:border-[#A05AFF]/40 hover:bg-[#A05AFF]/5 hover:text-[#A05AFF] dark:bg-slate-900 dark:border-slate-800',
        secondary: 'border border-[#1BCFB4]/20 bg-[#1BCFB4]/5 text-[#1BCFB4] shadow-xs hover:bg-[#1BCFB4]/10 hover:border-[#1BCFB4]/40',
        ghost: 'text-slate-500 hover:bg-slate-50 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800/50',
        link: 'text-[#A05AFF] decoration-[#A05AFF]/30 underline-offset-4 hover:underline hover:text-[#9E58FF]',
      },
      size: {
        default: 'h-11 px-5 py-2.5',
        sm: 'h-9 rounded-lg px-3.5 text-xs',
        lg: 'h-12 rounded-xl px-7 text-base tracking-normal',
        icon: 'h-11 w-11 rounded-xl',
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