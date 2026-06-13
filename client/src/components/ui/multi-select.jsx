import { useState } from 'react';
import { X, ChevronDown, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from './badge';
import { Input } from './input';

export function MultiSelect({ options = [], value = [], onChange, placeholder = 'Select...', className }) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const toggle = (option) => {
    if (value.includes(option)) {
      onChange(value.filter((v) => v !== option));
    } else {
      onChange([...value, option]);
    }
  };

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          'flex min-h-11 w-full items-center justify-between rounded-xl border bg-slate-50/40 px-4 py-2 text-sm font-medium transition-all duration-200 outline-none text-slate-800 placeholder:text-slate-400/80',
          open 
            ? 'border-indigo-500/80 bg-white ring-4 ring-indigo-500/10' 
            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/80'
        )}
      >
        <div className="flex flex-wrap gap-1.5 max-w-[92%]">
          {value.length === 0 ? (
            <span className="text-slate-400 font-medium">{placeholder}</span>
          ) : (
            value.map((v) => (
              <Badge 
                key={v} 
                variant="secondary" 
                className="gap-1 px-2 py-1 bg-gradient-to-r from-purple-50 to-indigo-50 border-indigo-100/60 text-indigo-700 font-semibold shadow-sm/5 hover:bg-purple-100 transition-all duration-200 animate-in fade-in-0 zoom-in-95"
              >
                {v}
                <X
                  className="h-3 w-3 rounded-md text-indigo-400 hover:text-indigo-600 hover:bg-indigo-100/60 p-0.5 transition-colors cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggle(v);
                  }}
                />
              </Badge>
            ))
          )}
        </div>
        <ChevronDown className={cn("h-4 w-4 shrink-0 text-slate-400 transition-transform duration-300", open && "transform rotate-180 text-indigo-500")} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute z-[100] mt-2 w-full rounded-xl border border-slate-100 bg-white/95 p-1.5 shadow-2xl shadow-slate-900/10 backdrop-blur-lg animate-in fade-in-0 zoom-in-95 duration-200 origin-top">
            <div className="border-b border-slate-100 pb-1.5 mb-1 px-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search selections..."
                  className="pl-9 h-10 rounded-lg bg-slate-50 border-slate-200/60 focus:border-indigo-500/60 focus:bg-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
            <div className="max-h-60 overflow-y-auto custom-scrollbar p-1 space-y-0.5">
              {filteredOptions.map((option) => {
                const isSelected = value.includes(option);
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => toggle(option)}
                    className={cn(
                      'flex w-full items-center justify-between px-3 py-2.5 text-left text-sm font-medium rounded-lg transition-all duration-200',
                      isSelected
                        ? 'bg-gradient-to-r from-indigo-50 to-blue-50 text-indigo-600 border border-indigo-100/40'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
                    )}
                  >
                    <span>{option}</span>
                    {isSelected && (
                      <div className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                    )}
                  </button>
                );
              })}
              {filteredOptions.length === 0 && (
                <div className="px-3 py-6 text-center text-sm font-medium text-slate-400 bg-slate-50/50 rounded-lg border border-dashed border-slate-100 m-1">
                  No results found matching "{searchTerm}"
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}