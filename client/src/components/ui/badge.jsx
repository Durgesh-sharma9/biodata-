import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-lg border px-2.5 py-0.5 text-xs font-semibold tracking-wide shadow-2xs transition-all duration-300 backdrop-blur-[2px] uppercase text-[10px]',
  {
    variants: {
      variant: {
        default: 'border-[#A05AFF]/30 bg-[#A05AFF]/5 text-[#A05AFF] dark:border-[#A05AFF]/40',
        secondary: 'border-[#9E58FF]/30 bg-[#9E58FF]/5 text-[#9E58FF] dark:border-[#9E58FF]/40',
        destructive: 'border-[#FE9496]/30 bg-[#FE9496]/5 text-[#FE9496] dark:border-[#FE9496]/40',
        outline: 'border-slate-200 bg-white/80 text-slate-500 hover:border-slate-300 hover:text-slate-800 dark:border-slate-800 dark:bg-slate-900',
        success: 'border-[#1BCFB4]/30 bg-[#1BCFB4]/5 text-[#1BCFB4] dark:border-[#1BCFB4]/40',
        warning: 'border-amber-200 bg-amber-50/60 text-amber-600 dark:border-amber-900/30 dark:bg-amber-950/20 dark:text-amber-400',
        info: 'border-[#4BCBEB]/30 bg-[#4BCBEB]/5 text-[#4BCBEB] dark:border-[#4BCBEB]/40',
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