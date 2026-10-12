import React from 'react';
import { Link } from 'react-router-dom';

export default function ArtisticAuthVisual({ 
  headline = "Changing the way", 
  highlight = "schools hire staff",
  subtext = "Direct faculty recruitment, zero paper biodatas, and 100% verified credentials for India's reputed educational institutions."
}) {
  return (
    <div className="relative w-full h-full min-h-screen flex flex-col justify-between p-8 sm:p-12 lg:p-14 overflow-hidden bg-white select-none">
      
      {/* ─────────────────────────────────────────────────────────────
          1. RECRUITMENT / HIRING BACKGROUND IMAGE ON THE LEFT SIDE
      ───────────────────────────────────────────────────────────── */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img 
          src="/hirehub-hiring-bg.jpg" 
          alt="School Staff Recruitment Interview" 
          className="w-full h-full object-cover object-center opacity-68 scale-100 transition-opacity duration-500"
        />
        {/* Balanced translucent overlay: clear visibility of people & office while keeping text crisp */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white/55 to-white/75 backdrop-blur-[0.5px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-white/75 via-transparent to-white/70" />
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. FLOATING & MOVING GEOMETRIC ARTISTIC SHAPES
      ───────────────────────────────────────────────────────────── */}
      
      {/* 1. TOP-CENTER CORAL SEMI-CIRCLE (FLOATING) */}
      <div 
        className="absolute -top-6 left-[34%] w-[150px] h-[75px] bg-[#FF8C68] rounded-b-[999px] pointer-events-none opacity-90 transition-transform duration-700 animate-float-slow z-10 shadow-lg shadow-orange-500/20" 
        style={{ transform: 'rotate(180deg)', animationDelay: '-1.5s' }}
      />

      {/* 2. TOP-LEFT SOFT PURPLE CIRCLE WITH DIFFUSE GLOW (GENTLE DRIFT) */}
      <div 
        className="absolute top-[8%] left-[8%] w-[125px] h-[125px] pointer-events-none animate-drift-horizontal z-10"
        style={{ animationDelay: '-3s' }}
      >
        <div className="absolute inset-0 bg-[#A78BFA] rounded-full opacity-60 blur-xl" />
        <div className="relative w-full h-full bg-gradient-to-tr from-[#C4B5FD] to-[#DDD6FE] rounded-full opacity-90 shadow-xl shadow-purple-300/40" />
      </div>

      {/* 3. TOP-RIGHT PURPLE QUARTER FAN (REVERSE FLOAT) */}
      <div 
        className="absolute -top-3 right-[-10px] w-[125px] h-[125px] bg-[#C084FC] rounded-tl-[999px] pointer-events-none opacity-85 animate-float-reverse z-10 shadow-lg shadow-purple-500/20"
        style={{ animationDelay: '-2s' }}
      />

      {/* 4. TOP-RIGHT CORAL SLICE (FLOATING) */}
      <div 
        className="absolute top-[16%] right-[6%] w-[90px] h-[45px] bg-[#FB923C] rounded-t-[999px] pointer-events-none opacity-90 rotate-[35deg] animate-float-slow z-10 shadow-md shadow-orange-500/20"
        style={{ animationDelay: '-4s' }}
      />

      {/* 5. DECORATIVE DOT GRID MATRIX (SUBTLE DRIFT) */}
      <div 
        className="absolute top-[26%] right-[10%] grid grid-cols-8 gap-2 pointer-events-none opacity-40 animate-drift-horizontal z-10"
        style={{ animationDelay: '-5s' }}
      >
        {[...Array(40)].map((_, i) => (
          <span key={i} className="w-1.5 h-1.5 rounded-full bg-slate-600 inline-block shadow-2xs" />
        ))}
      </div>

      {/* 6. CORAL QUARTER SLICE FLOATING NEAR HEADLINE (REVERSE FLOAT) */}
      <div 
        className="absolute top-[46%] left-[4%] w-[58px] h-[58px] bg-[#FF7A59] rounded-br-[999px] pointer-events-none opacity-90 rotate-[-15deg] animate-float-reverse z-10 shadow-md shadow-rose-500/20"
        style={{ animationDelay: '-0.8s' }}
      />

      {/* 7. BOTTOM-LEFT GLOWING VIBRANT RED/CORAL WEDGE WITH PULSING GLOW */}
      <div 
        className="absolute bottom-[9%] left-[6%] w-[105px] h-[120px] pointer-events-none animate-pulse-soft-scale z-10"
        style={{ animationDelay: '-2.5s' }}
      >
        <div className="absolute -inset-4 bg-[#F43F5E] rounded-3xl opacity-45 blur-2xl" />
        <div 
          className="relative w-full h-full bg-gradient-to-b from-[#FB7185] via-[#F43F5E] to-[#E11D48] rounded-[34px] shadow-2xl shadow-rose-600/30"
          style={{ transform: 'rotate(-8deg)' }}
        />
      </div>

      {/* 8. BOTTOM-CENTER CYAN/TEAL HALF CIRCLE (FLOATING) */}
      <div 
        className="absolute bottom-[7%] left-[34%] w-[130px] h-[65px] bg-[#38BDF8] rounded-b-[999px] pointer-events-none opacity-90 animate-float-slow z-10 shadow-lg shadow-sky-500/25"
        style={{ transform: 'rotate(-25deg)', animationDelay: '-3.2s' }}
      />

      {/* 9. BOTTOM-RIGHT LAVENDER ROUNDED TRIANGLE (REVERSE FLOAT) */}
      <div 
        className="absolute bottom-[12%] right-[8%] w-[90px] h-[90px] pointer-events-none animate-float-reverse z-10"
        style={{ animationDelay: '-1.8s' }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl" fill="none">
          <path 
            d="M 50 12 C 55 12, 88 70, 85 75 C 82 80, 18 80, 15 75 C 12 70, 45 12, 50 12 Z" 
            fill="#A78BFA"
            opacity="0.9"
          />
        </svg>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. CONTENT LAYER: DIRECTLY ON CANVAS (NO BOX / NO CARD)
      ───────────────────────────────────────────────────────────── */}
      
      {/* Top Brand Link */}
      <div className="relative z-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <img 
            src="/hirehub-brand-icon.png?v=5" 
            alt="HireHub Logo" 
            className="w-10 h-10 object-contain drop-shadow-sm group-hover:scale-105 transition-transform" 
          />
          <div className="flex flex-col">
            <span className="text-2xl font-black text-[#08295C] leading-none tracking-tight">
              Hire<span className="text-[#12B9A5]">Hub</span>
            </span>
            <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase mt-0.5">
              School Recruitment OS
            </span>
          </div>
        </Link>

        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-[11px] font-bold text-slate-800 border border-slate-200/80 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          150+ Schools Active
        </span>
      </div>

      {/* Center Headline Section - Directly on the canvas, NO surrounding box */}
      <div className="relative z-20 my-auto py-10 max-w-lg">
        <h2 className="text-4xl sm:text-5xl lg:text-[50px] xl:text-[54px] font-black text-slate-900 tracking-tight leading-[1.12]">
          {headline}{' '}
          <span className="block text-slate-900">
            {highlight}
          </span>
        </h2>
        
        {subtext && (
          <p className="mt-5 text-sm sm:text-base text-slate-600 font-normal leading-relaxed max-w-md">
            {subtext}
          </p>
        )}

        {/* Live metric mini pill */}
        <div className="mt-6 flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-700">
          <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-200/80 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#12B9A5]" />
            <span>2,480+ Verified Teachers</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-200/80 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-violet-600" />
            <span>Zero Agency Fees</span>
          </div>
        </div>
      </div>

      {/* Bottom Footer Note */}
      <div className="relative z-20 flex items-center justify-between text-xs font-semibold text-slate-500 pt-3 border-t border-slate-200/60">
        <span>&copy; {new Date().getFullYear()} HireHub OS &bull; All Rights Reserved</span>
        <span className="text-emerald-700 font-bold flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Secure Cloud
        </span>
      </div>

    </div>
  );
}
