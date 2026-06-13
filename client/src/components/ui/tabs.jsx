import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cn } from '@/lib/utils';

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      'inline-flex h-12 items-center justify-center rounded-xl bg-slate-100/80 backdrop-blur-sm p-1 text-slate-500 border border-slate-200/40 shadow-inner/5',
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
      'inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold tracking-wide transition-all duration-300 ease-out select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40 data-[state=active]:bg-gradient-to-r data-[state=active]:from-white data-[state=active]:to-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-md data-[state=active]:shadow-slate-200/80 active:scale-[0.98]',
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
      'mt-4 outline-none focus-visible:outline-none focus-visible:ring-0 animate-in fade-in-30 slide-in-from-bottom-2 duration-300 ease-out',
      className
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };