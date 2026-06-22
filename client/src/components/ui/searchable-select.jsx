import { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from './input';

export function SearchableSelect({ 
  options = [], 
  value = '', 
  onChange, 
  placeholder = 'Select...', 
  disabled = false,
  className,
  limit = 50
}) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const triggerRef = useRef(null);
  const searchInputRef = useRef(null);

  const selectedOption = options.find(o => o.value === value);
  const filteredOptions = useMemo(() =>
    options.filter(option =>
      !option.disabled && option.label.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, limit), [options, searchTerm, limit]);

  const handleSelect = (option) => {
    onChange(option.value);
    setOpen(false);
    setSearchTerm('');
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange('');
  };

  const handleToggle = () => {
    if (!disabled) {
      if (!open) {
        updateDropdownPosition();
      }
      setOpen(!open);
    }
  };

  // Focus search input when dropdown opens
  useEffect(() => {
    if (open && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [open]);

  const dropdownRef = useRef(null);

  const updateDropdownPosition = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (triggerRef.current && !triggerRef.current.contains(event.target) && 
          dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    const handleScroll = () => {
      if (open) {
        updateDropdownPosition();
      }
    };

    const handleResize = () => {
      if (open) {
        updateDropdownPosition();
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('scroll', handleScroll);
      window.addEventListener('resize', handleResize);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [open]);

  return (
    <div className={cn('relative', className)}>
      <button
        ref={triggerRef}
        type="button"
        onClick={handleToggle}
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

      {open && !disabled &&
        createPortal(
          <div
            ref={dropdownRef}
            className="fixed z-[9999] rounded-xl border border-none bg-white p-1.5 shadow-lg animate-in fade-in-0 zoom-in-95 duration-200 origin-top dark:bg-slate-900"
            style={{
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`,
              width: `${dropdownPosition.width}px`,
            }}
          >
            <div className="border-b border-slate-50 dark:border-slate-800 pb-1.5 mb-1 px-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  ref={searchInputRef}
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
                  if (option.disabled) {
                    return (
                      <div
                        key={option.value}
                        className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-slate-300 dark:text-slate-600"
                      >
                        {option.label}
                      </div>
                    );
                  }
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
          </div>,
          document.body
        )
      }
    </div>
  );
}