import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cn } from '@/lib/utils';

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      'inline-flex h-11 items-center justify-center rounded-xl bg-slate-100/70 p-1 text-slate-400 dark:bg-slate-900',
      className
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      'inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-all duration-200 ease-out select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A05AFF] disabled:pointer-events-none disabled:opacity-40 data-[state=active]:bg-white data-[state=active]:text-[#A05AFF] data-[state=active]:shadow-xs active:scale-[0.98] dark:data-[state=active]:bg-slate-800',
      className
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      'mt-4 outline-none focus-visible:outline-none focus-visible:ring-0 animate-in fade-in-30 slide-in-from-bottom-2 duration-200 ease-out',
      className
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };