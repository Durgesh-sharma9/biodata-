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
      'fixed inset-0 z-50 bg-slate-950/20 backdrop-blur-xs data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 duration-300 ease-out',
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
        'fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl border border-none bg-white shadow-md max-h-[90vh] overflow-hidden flex flex-col dark:bg-slate-900 dark:text-slate-100',
        className
      )}
      style={{
        maxHeight: '90vh',
      }}
      {...props}
    >
      {children}

      <DialogPrimitive.Close className="absolute right-4 top-4 z-50 rounded-lg p-1.5 text-slate-400 opacity-70 transition-all duration-200 hover:bg-slate-50 hover:text-slate-700 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-[#A05AFF] dark:hover:bg-slate-800 dark:hover:text-slate-200">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({ className, ...props }) => (
  <div
    className={cn(
      'flex flex-col space-y-1 text-center sm:text-left border-b border-slate-50 dark:border-slate-800/60 pb-4 px-5 pt-5 flex-shrink-0 bg-white dark:bg-slate-900',
      className
    )}
    {...props}
  />
);
DialogHeader.displayName = 'DialogHeader';

const DialogFooter = ({ className, ...props }) => (
  <div
    className={cn(
      'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 border-t border-slate-50 dark:border-slate-800/60 pt-4 mt-2 px-5 pb-5 flex-shrink-0 bg-white dark:bg-slate-900',
      className
    )}
    {...props}
  />
);
DialogFooter.displayName = 'DialogFooter';

const DialogTitle = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      'text-sm font-bold tracking-wide text-slate-800 dark:text-slate-200',
      className
    )}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn(
      'text-xs font-medium text-slate-400 dark:text-slate-500 leading-normal',
      className
    )}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

const DialogBody = React.forwardRef(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex-1 overflow-y-auto px-5 py-4 text-sm text-slate-600 dark:text-slate-300',
      className
    )}
    style={{
      minHeight: 0,
    }}
    {...props}
  />
));
DialogBody.displayName = 'DialogBody';

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogBody,
};