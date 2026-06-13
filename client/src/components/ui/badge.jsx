import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-lg border px-2.5 py-0.5 text-xs font-semibold tracking-wide shadow-sm/5 transition-all duration-300 backdrop-blur-[2px]',
  {
    variants: {
      variant: {
        default: 'border-blue-200/60 bg-gradient-to-r from-blue-50/90 to-indigo-50/90 text-indigo-700 shadow-sm shadow-indigo-500/5',
        secondary: 'border-purple-200/60 bg-gradient-to-r from-purple-50/90 to-fuchsia-50/90 text-purple-700 shadow-sm shadow-purple-500/5',
        destructive: 'border-red-200/60 bg-red-50/80 text-red-700 shadow-sm shadow-red-500/5',
        outline: 'border-slate-200 bg-white/80 text-slate-600 hover:border-slate-300 hover:text-slate-800',
        success: 'border-emerald-200/60 bg-emerald-50/90 text-emerald-700 shadow-sm shadow-emerald-500/5',
        warning: 'border-amber-200/60 bg-amber-50/90 text-amber-700 shadow-sm shadow-amber-500/5',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

function Badge({ className, variant, ...props }) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };