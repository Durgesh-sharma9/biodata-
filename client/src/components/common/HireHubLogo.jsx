import React from 'react';

/**
 * HireHub official brand logo component
 * Features the signature candidate-in-magnifying-glass emblem
 * with optional side-by-side "HireHub" typography.
 */
export function HireHubLogo({
  size = 'md', // 'sm' | 'md' | 'lg' | 'xl'
  withText = true,
  className = '',
  iconClassName = '',
  textClassName = '',
}) {
  const sizeMap = {
    sm: { img: 'h-6 w-6', text: 'text-sm' },
    md: { img: 'h-8 w-8', text: 'text-lg' },
    lg: { img: 'h-10 w-10', text: 'text-xl' },
    xl: { img: 'h-12 w-12', text: 'text-2xl' },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Pure Transparent Logo Icon */}
      <img
        src="/hirehub-logo-transparent.png"
        alt="HireHub Icon"
        className={`object-contain shrink-0 ${currentSize.img} ${iconClassName}`}
      />

      {/* Brand Typography next to the logo */}
      {withText && (
        <span
          className={`font-black tracking-tight text-slate-900 dark:text-white leading-none font-sans ${currentSize.text} ${textClassName}`}
        >
          Hire<span className="text-[#8A3BD4]">Hub</span>
        </span>
      )}
    </div>
  );
}

export default HireHubLogo;
