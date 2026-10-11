import React from 'react';

/**
 * HireHub official brand logo component
 * Displays the signature ID-card with checkmark magnifying glass emblem
 * and side-by-side dual-tone "HireHub" typography (Deep Navy + Vibrant Teal)
 * with optional "SCHOOL STAFF RECRUITMENT OS" subtitle.
 */
export function HireHubLogo({
  size = 'md', // 'sm' | 'md' | 'lg' | 'xl'
  withText = true,
  withSubtitle = false,
  className = '',
  iconClassName = '',
  textClassName = '',
}) {
  const sizeMap = {
    sm: { img: 'h-6 w-auto', text: 'text-sm', sub: 'text-[8px]' },
    md: { img: 'h-8 sm:h-9 w-auto', text: 'text-lg sm:text-xl', sub: 'text-[9px]' },
    lg: { img: 'h-10 sm:h-11 w-auto', text: 'text-xl sm:text-2xl', sub: 'text-[10px]' },
    xl: { img: 'h-14 w-auto', text: 'text-2xl sm:text-3xl', sub: 'text-xs' },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  return (
    <div className={`flex items-center gap-2.5 sm:gap-3 select-none ${className}`}>
      {/* Brand Emblem */}
      <img
        src="/hirehub-brand-icon.png?v=5"
        alt="HireHub Emblem"
        className={`object-contain shrink-0 ${currentSize.img} ${iconClassName}`}
      />

      {/* Brand Typography: "Hire" in Deep Navy, "Hub" in Teal */}
      {withText && (
        <div className="flex flex-col">
          <span
            className={`font-black tracking-tight text-[#08295C] dark:text-white leading-tight font-sans ${currentSize.text} ${textClassName}`}
          >
            Hire<span className="text-[#12B9A5]">Hub</span>
          </span>
          {withSubtitle && (
            <span
              className={`font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase -mt-0.5 ${currentSize.sub}`}
            >
              School Staff Recruitment OS
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default HireHubLogo;
