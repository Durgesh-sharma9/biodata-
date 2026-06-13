import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 duration-300 ease-out',
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-6 border border-slate-100 bg-white/95 p-6 sm:p-8 shadow-2xl shadow-slate-900/10 backdrop-blur-lg duration-300 ease-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-1/2 data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-1/2 rounded-2xl relative overflow-hidden before:absolute before:inset-0 before:p-[1px] before:bg-gradient-to-br before:from-white before:to-transparent before:rounded-2xl before:-z-10',
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-xl p-2 text-slate-400 opacity-70 ring-offset-white transition-all duration-200 hover:bg-slate-50 hover:text-slate-700 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({ className, ...props }) => (
  <div className={cn('flex flex-col space-y-2 text-center sm:text-left border-b border-slate-50 pb-4 -mx-6 sm:-mx-8 px-6 sm:px-8', className)} {...props} />
);
DialogHeader.displayName = 'DialogHeader';

const DialogTitle = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Title 
    ref={ref} 
    className={cn('text-xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-800 bg-clip-text text-transparent', className)} 
    {...props} 
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Description 
    ref={ref} 
    className={cn('text-sm font-medium leading-relaxed text-slate-400/90', className)} 
    {...props} 
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export { Dialog, DialogPortal, DialogOverlay, DialogClose, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription };