import * as React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const Select = SelectPrimitive.Root;
const SelectGroup = SelectPrimitive.Group;
const SelectValue = SelectPrimitive.Value;

const SelectTrigger = React.forwardRef(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      'flex h-11 w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50/40 px-4 py-2.5 text-sm font-medium text-slate-800 outline-none transition-all duration-200 placeholder:text-slate-400 data-[state=open]:border-indigo-500/80 data-[state=open]:bg-white data-[state=open]:ring-4 data-[state=open]:ring-indigo-500/10 disabled:cursor-not-allowed disabled:bg-slate-100/60 disabled:opacity-50 text-left [&>span]:line-clamp-1',
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 text-slate-400 transition-transform duration-200 data-[state=open]:rotate-180" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectContent = React.forwardRef(({ className, children, position = 'popper', ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        'relative z-[100] max-h-96 min-w-[8rem] overflow-auto rounded-xl border border-slate-200 bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700 shadow-2xl shadow-slate-900/10 duration-200 ease-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95 origin-top',
        position === 'popper' && 'data-[side=bottom]:translate-y-2 data-[side=top]:-translate-y-2 data-[side=right]:translate-x-2 data-[side=left]:translate-x-2',
        className
      )}
      position={position}
      {...props}
    >
      <SelectPrimitive.Viewport className="p-1 space-y-0.5">{children}</SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectItem = React.forwardRef(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex w-full cursor-pointer select-none items-center rounded-lg py-2.5 pl-3 pr-4 text-sm font-medium text-slate-700 dark:text-slate-300 outline-none transition-colors duration-150 focus:bg-indigo-50 dark:focus:bg-indigo-950/30 focus:text-indigo-600 dark:focus:text-indigo-400 data-[disabled]:pointer-events-none data-[disabled]:opacity-40 data-[state=checked]:text-indigo-600 dark:data-[state=checked]:text-indigo-400 data-[state=checked]:font-semibold',
      className
    )}
    {...props}
  >
    <span className="absolute left-0 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

export { Select, SelectGroup, SelectValue, SelectTrigger, SelectContent, SelectItem };