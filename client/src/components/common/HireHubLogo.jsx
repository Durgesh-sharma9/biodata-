import React from 'react';

/**
 * HireHub official brand logo component
 * Displays the signature ID-card with checkmark magnifying glass emblem
 * and the dual-tone "HireHub" typography (Navy + Vibrant Teal).
 * Supports both horizontal (side-by-side) and vertical (icon on top, text underneath) layouts.
 */
export function HireHubLogo({
  size = 'md', // 'sm' | 'md' | 'lg' | 'xl'
  withText = true,
  layout = 'horizontal', // 'horizontal' | 'vertical'
  useFullImage = false,
  className = '',
  iconClassName = '',
  textClassName = '',
}) {
  const sizeMap = {
    sm: { img: 'h-6 w-auto', text: 'text-sm', fullImg: 'h-10 w-auto' },
    md: { img: 'h-8 w-auto', text: 'text-lg', fullImg: 'h-14 w-auto' },
    lg: { img: 'h-10 w-auto', text: 'text-xl', fullImg: 'h-20 w-auto' },
    xl: { img: 'h-14 w-auto', text: 'text-2xl', fullImg: 'h-28 w-auto' },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  if (useFullImage) {
    return (
      <div className={`flex items-center justify-center select-none ${className}`}>
        <img
          src="/hirehub-full-logo.png"
          alt="HireHub"
          className={`object-contain ${currentSize.fullImg} ${iconClassName}`}
        />
      </div>
    );
  }

  const isVertical = layout === 'vertical';

  return (
    <div
      className={`flex select-none ${
        isVertical ? 'flex-col items-center gap-1.5' : 'flex-row items-center gap-2.5'
      } ${className}`}
    >
      {/* Brand Emblem */}
      <img
        src="/hirehub-logo-transparent.png"
        alt="HireHub Emblem"
        className={`object-contain shrink-0 ${currentSize.img} ${iconClassName}`}
      />

      {/* Brand Typography: "Hire" in Deep Navy, "Hub" in Teal */}
      {withText && (
        <span
          className={`font-black tracking-tight text-[#08295C] dark:text-white leading-none font-sans ${currentSize.text} ${textClassName}`}
        >
          Hire<span className="text-[#12B9A5]">Hub</span>
        </span>
      )}
    </div>
  );
}

export default HireHubLogo;
