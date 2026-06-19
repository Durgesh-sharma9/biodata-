import { useState } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from './input';

export function SearchableSelect({ 
  options = [], 
  value = '', 
  onChange, 
  placeholder = 'Select...', 
  disabled = false,
  className 
}) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const selectedOption = options.find(o => o.value === value);
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (option) => {
    onChange(option.value);
    setOpen(false);
    setSearchTerm('');
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange('');
  };

  return (
    <div className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => !disabled && setOpen(!open)}
        disabled={disabled}
        className={cn(
          'flex min-h-11 w-full items-center justify-between rounded-xl border px-4 py-2 text-sm font-medium transition-all duration-200 outline-none',
          disabled 
            ? 'border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed opacity-50 dark:bg-slate-900/50 dark:border-slate-800'
            : open 
              ? 'border-[#A05AFF]/60 bg-white ring-4 ring-[#A05AFF]/10 text-slate-800' 
              : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
        )}
      >
        <div className="flex items-center gap-2 max-w-[92%]">
          {!selectedOption ? (
            <span className="text-slate-400 font-medium">{placeholder}</span>
          ) : (
            <span className="truncate text-slate-700 dark:text-slate-200">{selectedOption.label}</span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {selectedOption && !disabled && (
            <X
              className="h-4 w-4 text-slate-400 hover:text-[#FE9496] transition-colors cursor-pointer"
              onClick={handleClear}
            />
          )}
          <ChevronDown className={cn("h-4 w-4 shrink-0 text-slate-400 transition-transform duration-300", open && "transform rotate-180 text-[#A05AFF]")} />
        </div>
      </button>

      {open && !disabled && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute z-[100] mt-2 w-full rounded-xl border border-none bg-white p-1.5 shadow-md animate-in fade-in-0 zoom-in-95 duration-200 origin-top dark:bg-slate-900">
            <div className="border-b border-slate-50 dark:border-slate-800 pb-1.5 mb-1 px-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search..."
                  className="pl-9 h-10 rounded-lg bg-slate-50 dark:bg-slate-950 border-slate-200/60 focus:border-[#A05AFF]/60 focus:bg-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
            <div className="max-h-60 overflow-y-auto custom-scrollbar p-1 space-y-0.5">
              {filteredOptions.length === 0 ? (
                <div className="px-3 py-6 text-center text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-50/50 dark:bg-slate-950/40 rounded-lg border border-dashed border-slate-100 dark:border-slate-800 m-1">
                  No results found matching "{searchTerm}"
                </div>
              ) : (
                filteredOptions.map((option) => {
                  const isSelected = value === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleSelect(option)}
                      className={cn(
                        'flex w-full items-center px-3 py-2.5 text-left text-sm font-medium rounded-lg transition-all duration-200',
                        isSelected
                          ? 'bg-[#A05AFF]/5 text-[#A05AFF]'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100'
                      )}
                    >
                      {option.label}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}