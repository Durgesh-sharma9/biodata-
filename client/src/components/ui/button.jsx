import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold tracking-wide transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40 active:scale-[0.98]',
  {
    variants: {
      variant: {
        default: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-indigo-600/20 hover:from-blue-500 hover:to-indigo-500 hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5',
        destructive: 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-md shadow-red-600/20 hover:from-red-600 hover:to-rose-700 hover:shadow-lg hover:shadow-red-600/30 hover:-translate-y-0.5',
        outline: 'border border-slate-200/80 bg-white/80 backdrop-blur-sm text-slate-700 shadow-sm hover:border-indigo-200 hover:bg-indigo-50/40 hover:text-indigo-600',
        secondary: 'bg-gradient-to-r from-purple-50 to-indigo-50 text-indigo-700 border border-indigo-100/50 shadow-sm hover:from-purple-100 hover:to-indigo-100 hover:text-indigo-800',
        ghost: 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
        link: 'text-blue-600 decoration-blue-500/30 underline-offset-4 hover:underline hover:text-indigo-600',
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