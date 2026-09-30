import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Building2,
  GraduationCap,
  Briefcase,
  Users, 
  Search, 
  MapPin, 
  SlidersHorizontal, 
  FileText, 
  ShieldCheck, 
  ArrowRight, 
  Check, 
  Sparkles, 
  Menu,
  X,
  Target,
  Clock,
  QrCode,
  Star,
  CheckCircle2,
  ChevronRight,
  BookOpen,
  Bus,
  Calculator,
  UserCheck,
  Zap,
  Globe,
  HelpCircle,
  PhoneCall,
  Laptop,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  FolderLock
} from 'lucide-react';

const PARTNER_SCHOOLS = [
  'Delhi Public School (DPS)',
  'Cambridge International School',
  'Ryan International Group',
  "St. Xavier's Senior Secondary School",
  'DAV Public School',
  'Birla Public School',
  'Heritage Global Academy',
  'Army Public School',
  'Podar International School',
  'Mount Litera Zee School'
];

export default function Landing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [heroUnlocked, setHeroUnlocked] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  // Smooth scroll handler
  const handleScroll = (e, id) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc] text-slate-800 font-sans antialiased selection:bg-[#0F766E] selection:text-white">
      
      {/* ─────────────────────────────────────────────────────────────
          1. NAVIGATION BAR (CLEAN, NO CANDIDATE LOGIN, NO PRICING)
      ───────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 w-full h-20 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-full items-center">
            
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <img
                src="/hirehub-logo-transparent.png"
                alt="HireHub Logo"
                className="w-9 h-9 object-contain group-hover:scale-105 transition-transform"
              />
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-1 font-sans">
                  Hire<span className="bg-gradient-to-r from-[#8A3BD4] to-[#00D2FF] bg-clip-text text-transparent">Hub</span>
                </span>
                <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase -mt-1">
                  School Staff Recruitment OS
                </span>
              </div>
            </Link>
            
            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-1">
              {[
                { label: 'Overview', target: 'overview' },
                { label: 'For Schools', target: 'for-schools' },
                { label: 'Roles Covered', target: 'roles' },
                { label: 'How It Works', target: 'how-it-works' },
                { label: 'Testimonials', target: 'testimonials' },
                { label: 'FAQ', target: 'faq' }
              ].map((item) => (
                <a 
                  key={item.target}
                  href={`#${item.target}`} 
                  onClick={(e) => handleScroll(e, item.target)}
                  className="px-3.5 py-2 text-sm font-semibold text-slate-600 hover:text-[#0F766E] rounded-xl hover:bg-slate-100/60 transition-all cursor-pointer"
                >
                  {item.label}
                </a>
              ))}
            </div>

            {/* CTA Portal Buttons (School Only) */}
            <div className="hidden sm:flex items-center space-x-3">
              <Link to="/login">
                <Button variant="outline" className="border-slate-200 text-slate-700 hover:border-[#0F766E] hover:text-[#0F766E] hover:bg-slate-50 text-xs font-semibold px-4 py-2 rounded-xl transition-all cursor-pointer">
                  <Building2 className="w-4 h-4 mr-1.5 text-slate-500" /> School Login
                </Button>
              </Link>

              <Link to="/signup">
                <Button className="bg-gradient-to-r from-[#0F766E] to-[#7928CA] hover:from-[#115E59] hover:to-[#6820B0] text-white text-xs font-bold px-5 py-2 rounded-xl shadow-md shadow-[#0F766E]/20 hover:shadow-lg transition-all cursor-pointer">
                  Register School Free
                </Button>
              </Link>
            </div>

            {/* Mobile Hamburger Toggle */}
            <div className="lg:hidden flex items-center">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-600 hover:text-[#0F766E] hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-20 left-0 right-0 border-b border-slate-200 bg-white/98 backdrop-blur-md px-6 py-6 space-y-2 shadow-xl">
            {['overview', 'for-schools', 'roles', 'how-it-works', 'testimonials', 'faq'].map((target) => (
              <a 
                key={target}
                href={`#${target}`} 
                onClick={(e) => handleScroll(e, target)}
                className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-[#0F766E] transition-colors capitalize"
              >
                {target.replace('-', ' ')}
              </a>
            ))}
            <div className="pt-4 border-t border-slate-100 flex flex-col gap-2.5">
              <Link to="/login" className="w-full">
                <Button variant="outline" className="w-full justify-center text-slate-700 border-slate-200 rounded-xl py-2.5 text-xs font-bold">
                  <Building2 className="w-4 h-4 mr-2" /> School Admin Login
                </Button>
              </Link>
              <Link to="/signup" className="w-full">
                <Button className="w-full justify-center bg-gradient-to-r from-[#0F766E] to-[#7928CA] text-white rounded-xl py-2.5 text-xs font-bold shadow-md">
                  Register School Free
                </Button>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* ─────────────────────────────────────────────────────────────
          2. HERO SECTION - VIBRANT, ANIMATED & COLORFUL WITH MOCKUP
      ───────────────────────────────────────────────────────────── */}
      <section id="overview" className="pt-28 pb-16 lg:pt-32 lg:pb-24 overflow-hidden relative">
        {/* Floating Ambient Colorful Mesh Orbs */}
        <div className="absolute top-10 left-1/4 w-[500px] h-[350px] bg-gradient-to-tr from-[#0F766E]/25 via-[#FE7096]/20 to-[#1BCFB4]/15 blur-3xl pointer-events-none -z-10 animate-pulse-glow" />
        <div className="absolute top-40 right-10 w-[420px] h-[400px] bg-gradient-to-br from-[#1BCFB4]/25 via-[#3081e4]/15 to-transparent blur-3xl pointer-events-none -z-10 animate-float-slow" />
        <div className="absolute bottom-10 left-10 w-[380px] h-[300px] bg-gradient-to-tr from-amber-400/20 to-[#FE7096]/15 blur-3xl pointer-events-none -z-10 animate-float-reverse" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* HERO LEFT COLUMN */}
            <div className="lg:col-span-7 text-center lg:text-left">
              
              {/* Animated Floating Pill Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#0F766E]/30 bg-gradient-to-r from-[#0F766E]/15 via-[#FE7096]/10 to-[#1BCFB4]/15 text-slate-800 text-xs font-bold tracking-wide mb-6 shadow-xs backdrop-blur-md">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1BCFB4] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1BCFB4]" />
                </span>
                <Sparkles className="w-3.5 h-3.5 text-[#0F766E]" />
                <span className="font-extrabold text-[#0F766E]">HireHub Recruitment OS</span>
                <span className="text-slate-400">•</span>
                <span>India's Dedicated School Staffing Platform</span>
              </div>

              {/* Colorful Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.12] mb-6">
                Hire Top Teachers &amp; School Staff{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0F766E] via-[#FE7096] to-[#07cdae]">
                  in Minutes.
                </span>
              </h1>

              {/* Sub-headline */}
              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 mb-8 font-normal leading-relaxed">
                <strong className="text-slate-900 font-bold">HireHub</strong> eliminates paper biodatas and agency delays. Generate a custom QR code for walk-ins, organize applicants into a searchable digital vault, and dispatch 1-click WhatsApp interview invitations.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3.5 justify-center lg:justify-start mb-6">
                <Link to="/signup" className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto h-12 rounded-xl bg-gradient-to-r from-[#0F766E] to-[#7928CA] hover:from-[#115E59] hover:to-[#6820B0] text-white font-bold px-8 shadow-xl shadow-[#0F766E]/30 transition-all text-sm flex items-center justify-center gap-2 group cursor-pointer">
                    <Building2 className="w-4 h-4" /> Start School Free Trial
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>

                <a 
                  href="https://wa.me/918288863132?text=Hello%20HireHub%2C%20we%20want%20to%20schedule%20a%20demo%20for%20our%20school." 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-full sm:w-auto"
                >
                  <Button variant="outline" className="w-full sm:w-auto h-12 border-slate-300 bg-white/90 backdrop-blur-sm text-slate-800 hover:border-[#0F766E] hover:text-[#0F766E] hover:bg-slate-50 px-7 rounded-xl font-bold transition-all text-sm flex items-center justify-center gap-2 shadow-sm cursor-pointer">
                    <MessageSquare className="w-4 h-4 text-[#1BCFB4]" /> Schedule Demo on WhatsApp
                  </Button>
                </a>
              </div>

              {/* Quick Interactive Role Search Chips */}
              <div className="mb-8 flex flex-wrap items-center justify-center lg:justify-start gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1 flex items-center gap-1">
                  <Search className="w-3 h-3 text-[#0F766E]" /> Positions:
                </span>
                {[
                  { label: '📐 PGT Maths', target: 'roles' },
                  { label: '🧪 TGT Science', target: 'roles' },
                  { label: '🚌 Bus Driver', target: 'roles' },
                  { label: '💻 Computer / IT', target: 'roles' },
                  { label: '📊 School Accountant', target: 'roles' },
                ].map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={(e) => handleScroll(e, chip.target)}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-white/90 border border-slate-200 hover:border-[#0F766E] hover:text-[#0F766E] text-slate-600 shadow-2xs transition-all cursor-pointer"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-slate-200/80 flex flex-wrap items-center justify-center lg:justify-start gap-y-3 gap-x-8 text-xs font-semibold text-slate-500">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#1BCFB4]" /> 100% Free School Access
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#1BCFB4]" /> Auto Custom Gate QR Code
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#1BCFB4]" /> 100% Private to Your School
                </div>
              </div>

            </div>

            {/* HERO RIGHT COLUMN - THE ORIGINAL GORGEOUS LIVE INTERACTIVE MOCKUP */}
            <div className="lg:col-span-5 relative">
              <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-white/80 shadow-2xl p-6 relative overflow-hidden group">
                
                {/* Decorative corner glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#0F766E]/15 to-transparent rounded-bl-full pointer-events-none" />

                {/* Header of Mockup */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-3 h-3 rounded-full bg-rose-400 shadow-xs" />
                    <div className="w-3 h-3 rounded-full bg-amber-400 shadow-xs" />
                    <div className="w-3 h-3 rounded-full bg-emerald-400 shadow-xs" />
                    <span className="ml-2 text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#0F766E]" />
                      HireHub Recruitment OS
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live System
                  </span>
                </div>

                {/* Interactive Metrics Row with Vivid Gradient Cards */}
                <div className="grid grid-cols-3 gap-2.5 my-4">
                  <div className="bg-gradient-to-br from-[#FE7096]/15 via-[#FE7096]/5 to-white border border-[#FE7096]/30 rounded-2xl p-3">
                    <div className="text-[9px] uppercase font-bold text-slate-500">Applicants</div>
                    <div className="text-base sm:text-lg font-black text-slate-900">45,200+</div>
                    <div className="text-[10px] text-emerald-600 font-bold mt-0.5">↑ 48% this mo</div>
                  </div>

                  <div className="bg-gradient-to-br from-[#1BCFB4]/15 via-[#1BCFB4]/5 to-white border border-[#1BCFB4]/30 rounded-2xl p-3">
                    <div className="text-[9px] uppercase font-bold text-slate-500">Avg. Distance</div>
                    <div className="text-base sm:text-lg font-black text-slate-900">&lt; 8.5 km</div>
                    <div className="text-[10px] text-[#1BCFB4] font-bold mt-0.5">Local campus</div>
                  </div>

                  <div className="bg-gradient-to-br from-[#0F766E]/15 via-[#0F766E]/5 to-white border border-[#0F766E]/30 rounded-2xl p-3">
                    <div className="text-[9px] uppercase font-bold text-slate-500">Hire Speed</div>
                    <div className="text-base sm:text-lg font-black text-slate-900">2.5 Days</div>
                    <div className="text-[10px] text-[#0F766E] font-bold mt-0.5">70% faster</div>
                  </div>
                </div>

                {/* Live Interactive Simulated Candidate Card */}
                <div className={`border rounded-2xl p-4 transition-all duration-300 mb-3 ${
                  heroUnlocked 
                    ? 'bg-gradient-to-br from-emerald-50/80 via-white to-purple-50/40 border-emerald-300 shadow-md'
                    : 'bg-slate-50/80 border-slate-200 hover:border-[#0F766E]/50'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#0F766E] to-[#FE7096] text-white flex items-center justify-center font-black text-base shadow-md ${
                        heroUnlocked ? 'ring-2 ring-emerald-500' : ''
                      }`}>
                        AK
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-sm text-slate-900">Ananya Kapoor</h4>
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md border border-emerald-200">
                            CTET &amp; B.Ed
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium">PGT Mathematics • 7 Yrs Exp</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-[#0F766E] bg-[#0F766E]/10 border border-[#0F766E]/25 px-2.5 py-1 rounded-xl flex items-center gap-1 shadow-2xs">
                      <MapPin className="w-3 h-3 text-[#0F766E]" /> 6.4 km away
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    <span className="text-[10px] bg-white border border-slate-200 px-2 py-0.5 rounded-md font-semibold text-slate-700">CBSE &amp; ICSE</span>
                    <span className="text-[10px] bg-white border border-slate-200 px-2 py-0.5 rounded-md font-semibold text-slate-700">Classes 9-12</span>
                    <span className="text-[10px] bg-white border border-slate-200 px-2 py-0.5 rounded-md font-semibold text-slate-700">English Medium</span>
                    <span className="text-[10px] bg-white border border-slate-200 px-2 py-0.5 rounded-md font-semibold text-slate-700">M.Sc Math</span>
                  </div>

                  {/* REVEALED WHATSAPP INVITATION DETAILS */}
                  {heroUnlocked ? (
                    <div className="mt-3.5 p-3 rounded-xl bg-white border border-emerald-200 space-y-2 animate-in fade-in zoom-in-95 duration-200">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-700 flex items-center gap-1.5">
                          📞 Mobile: <span className="text-emerald-600 font-extrabold">+91 98112 43210</span>
                        </span>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          Active on WhatsApp
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                        <span className="text-slate-500 font-medium">✉️ ananya.kapoor@edu.in</span>
                        <span className="text-[10px] font-bold text-[#0F766E] hover:underline cursor-pointer">
                          View Resume (PDF)
                        </span>
                      </div>
                    </div>
                  ) : null}

                  <div className="mt-3.5 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-bold text-[11px]">Exp: ₹45,000 - ₹55,000 / mo</span>
                    <Button 
                      type="button"
                      size="sm" 
                      onClick={() => setHeroUnlocked(!heroUnlocked)}
                      className={`h-8 text-[11px] font-bold rounded-xl px-3 transition-all shadow-sm cursor-pointer ${
                        heroUnlocked 
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                          : 'bg-gradient-to-r from-[#0F766E] to-[#FE7096] hover:from-[#115E59] hover:to-[#e05b81] text-white shadow-md shadow-[#0F766E]/25'
                      }`}
                    >
                      {heroUnlocked ? (
                        <>
                          <Check className="w-3.5 h-3.5 mr-1" /> WhatsApp Invite Dispatched
                        </>
                      ) : (
                        <>
                          <MessageSquare className="w-3.5 h-3.5 mr-1 text-emerald-300" /> Send 1-Click WhatsApp Invite
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Secondary Simulated Non-Teaching Candidate */}
                <div className="border border-slate-200/90 rounded-2xl p-3.5 bg-white shadow-2xs flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-orange-500 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                      RS
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-900">Rajesh Sharma</div>
                      <p className="text-[11px] text-slate-500">School Bus Driver • Heavy Vehicle (12 Yrs Exp)</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 font-bold px-2 py-0.5 rounded-lg">
                    Nearby (4.2 km)
                  </span>
                </div>

                {/* Floating QR Badge with Soft Purple Glow */}
                <div className="mt-3 p-3 bg-gradient-to-r from-[#0F766E]/15 via-purple-50/50 to-transparent border border-[#0F766E]/30 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-white shadow-2xs text-[#0F766E]">
                      <QrCode className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">
                        Your School Gate QR &amp; Career Page
                      </span>
                      <span className="text-[10px] text-slate-400">hirehub.in/apply/your-school</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-[#0F766E] font-bold bg-white px-2 py-0.5 rounded-md border border-[#0F766E]/20 shadow-2xs">
                    Auto Generated
                  </span>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. REAL-WORLD STATS COUNTER STRIP - COLORFUL & ANIMATED
      ───────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-b from-white via-purple-50/20 to-white border-y border-slate-200/80 py-12 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            
            <div className="bg-white/90 backdrop-blur-sm border border-purple-100 rounded-2xl p-5 text-center shadow-xs hover:shadow-lg hover:border-[#0F766E]/40 hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-10 h-10 rounded-xl bg-[#0F766E]/10 text-[#0F766E] mx-auto flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#0F766E] to-[#7928CA] mb-1">
                1,200+
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Schools &amp; Institutes
              </div>
              <span className="text-[10px] text-emerald-600 font-semibold mt-1 inline-block">Across 28+ Cities</span>
            </div>

            <div className="bg-white/90 backdrop-blur-sm border border-cyan-100 rounded-2xl p-5 text-center shadow-xs hover:shadow-lg hover:border-[#1BCFB4]/40 hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-10 h-10 rounded-xl bg-[#1BCFB4]/10 text-[#1BCFB4] mx-auto flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#1BCFB4] to-[#07cdae] mb-1">
                45,000+
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Teacher Biodatas Managed
              </div>
              <span className="text-[10px] text-emerald-600 font-semibold mt-1 inline-block">100% Paperless</span>
            </div>

            <div className="bg-white/90 backdrop-blur-sm border border-rose-100 rounded-2xl p-5 text-center shadow-xs hover:shadow-lg hover:border-[#FE7096]/40 hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-10 h-10 rounded-xl bg-[#FE7096]/10 text-[#FE7096] mx-auto flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Briefcase className="w-5 h-5" />
              </div>
              <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FE7096] to-[#fe9496] mb-1">
                10+ Roles
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Teaching &amp; Non-Teaching
              </div>
              <span className="text-[10px] text-[#0F766E] font-semibold mt-1 inline-block">PGT, TGT, Drivers, Accounts</span>
            </div>

            <div className="bg-white/90 backdrop-blur-sm border border-amber-100 rounded-2xl p-5 text-center shadow-xs hover:shadow-lg hover:border-amber-400/40 hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 mx-auto flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Star className="w-5 h-5 fill-amber-500" />
              </div>
              <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500 mb-1">
                99.2%
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Principal Satisfaction
              </div>
              <span className="text-[10px] text-emerald-600 font-semibold mt-1 inline-block">Over 18,000 Matches</span>
            </div>

          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. INFINITE SCHOOL PARTNERS MARQUEE
      ───────────────────────────────────────────────────────────── */}
      <div className="py-6 bg-slate-100/70 border-b border-slate-200 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 mb-2 text-center">
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
            Trusted by Reputed Schools &amp; Educational Trusts Across India
          </p>
        </div>
        <div className="relative flex overflow-x-hidden">
          <div className="animate-marquee whitespace-nowrap flex items-center gap-8 py-1">
            {[...PARTNER_SCHOOLS, ...PARTNER_SCHOOLS].map((school, i) => (
              <div 
                key={i} 
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-white border border-slate-200 shadow-2xs text-xs font-bold text-slate-700 tracking-wide"
              >
                <div className="w-2 h-2 rounded-full bg-[#0F766E]" />
                <span>{school}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          5. FOR SCHOOLS VALUE PROPOSITION (VIBRANT & COLORFUL)
      ───────────────────────────────────────────────────────────── */}
      <section id="for-schools" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-r from-[#0F766E]/15 via-[#FE7096]/10 to-[#1BCFB4]/15 blur-3xl pointer-events-none -z-10 animate-pulse-glow" />

        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#0F766E]/30 bg-gradient-to-r from-[#0F766E]/15 via-[#FE7096]/10 to-[#1BCFB4]/15 text-[#0F766E] text-xs font-bold uppercase tracking-wider mb-4 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5" /> Built for Indian Schools &amp; Institutes
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 mb-4">
            Everything your school needs to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0F766E] to-[#FE7096]">
              Eliminate Paper Biodatas
            </span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base font-normal leading-relaxed">
            From gate walk-ins to newspaper advertisements, streamline your entire teacher recruitment into one high-speed digital dashboard.
          </p>
        </div>

        {/* 3 Vibrant School Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-7 border border-slate-200/90 shadow-sm hover:shadow-2xl hover:border-[#0F766E]/40 hover:-translate-y-2 transition-all duration-300 group relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#0F766E] to-[#C084FC]" />
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#0F766E]/20 to-[#0F766E]/5 text-[#0F766E] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-xs">
              <QrCode className="w-7 h-7" />
            </div>
            <div className="inline-block text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-[#0F766E]/10 text-[#0F766E] mb-3">
              Zero Friction Intake
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2.5">
              Custom Career Link &amp; Gate QR
            </h3>
            <p className="text-xs text-slate-600 font-normal leading-relaxed mb-6">
              Get an instant dedicated application URL and high-res printable QR code poster. Put it on your website, reception, or newspaper ads. Walk-in candidates scan and submit digital biodatas straight to your dashboard!
            </p>
            <ul className="space-y-2.5 text-xs font-semibold text-slate-700">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#1BCFB4] shrink-0" /> Zero duplicate resumes &amp; paper mess</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#1BCFB4] shrink-0" /> Auto-collect B.Ed, Medium &amp; Experience</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#1BCFB4] shrink-0" /> Real-time mobile applicant alerts</li>
            </ul>
          </div>

          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-7 border-2 border-[#0F766E]/50 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative group overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#0F766E] via-[#FE7096] to-[#1BCFB4]" />
            <div className="absolute top-5 right-5 bg-gradient-to-r from-[#0F766E] to-[#FE7096] text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
              ⚡ Instant Search
            </div>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#1BCFB4]/20 to-[#1BCFB4]/5 text-[#1BCFB4] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-xs">
              <FolderLock className="w-7 h-7" />
            </div>
            <div className="inline-block text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-[#1BCFB4]/15 text-[#07cdae] mb-3">
              100% Private Vault
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2.5">
              Centralized Candidate Bank
            </h3>
            <p className="text-xs text-slate-600 font-normal leading-relaxed mb-6">
              All received applications are saved permanently in your private database. Instantly search all PGT Physics or TGT Maths candidates in seconds using subject, experience, and qualification filters.
            </p>
            <ul className="space-y-2.5 text-xs font-semibold text-slate-700">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#1BCFB4] shrink-0" /> Instant Ctrl+K subject search</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#1BCFB4] shrink-0" /> 100% Confidential to your campus</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#1BCFB4] shrink-0" /> Never lose a good resume again</li>
            </ul>
          </div>

          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-7 border border-slate-200/90 shadow-sm hover:shadow-2xl hover:border-[#FE7096]/40 hover:-translate-y-2 transition-all duration-300 group relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#FE7096] to-amber-400" />
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#FE7096]/20 to-[#FE7096]/5 text-[#FE7096] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-xs">
              <MessageSquare className="w-7 h-7" />
            </div>
            <div className="inline-block text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-[#FE7096]/15 text-[#FE7096] mb-3">
              1-Click Dispatch
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2.5">
              WhatsApp Calling &amp; Pipeline
            </h3>
            <p className="text-xs text-slate-600 font-normal leading-relaxed mb-6">
              Track candidates through stages: Applied, Shortlisted, Interview Scheduled, Demo Class, and Selected. Send pre-formatted interview invitations directly to their WhatsApp without saving numbers.
            </p>
            <ul className="space-y-2.5 text-xs font-semibold text-slate-700">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#1BCFB4] shrink-0" /> 1-Click WhatsApp interview letters</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#1BCFB4] shrink-0" /> Demo lecture scorecards &amp; notes</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#1BCFB4] shrink-0" /> 80% faster candidate response rate</li>
            </ul>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6. ROLE-SPECIFIC COVERAGE (ALL VIBRANT COLORS)
      ───────────────────────────────────────────────────────────── */}
      <section id="roles" className="py-24 bg-gradient-to-b from-slate-50 via-purple-50/20 to-slate-50 border-y border-slate-200/80 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#0F766E]/30 bg-[#0F766E]/10 text-[#0F766E] text-xs font-bold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5" /> Comprehensive Campus Staffing
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 mb-4">
              One Hub For{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0F766E] via-[#FE7096] to-[#1BCFB4]">
                Every School Role
              </span>
            </h2>
            <p className="text-slate-600 text-sm sm:text-base font-normal leading-relaxed">
              Schools require much more than just subject teachers. HireHub includes purpose-built forms, filters, and qualification checklists for every educational and operational position.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <BookOpen className="w-6 h-6 text-[#0F766E]" />,
                iconBg: "bg-[#0F766E]/10",
                count: "18,400+ Candidates",
                role: "Teaching Faculty",
                items: "PGT, TGT, PRT, Pre-Primary, Subject Specialists (Maths, Science, Languages), B.Ed/M.Ed, CTET qualified.",
                gradient: "from-[#0F766E]/10 via-transparent to-transparent",
                borderHover: "hover:border-[#0F766E]/50"
              },
              {
                icon: <Calculator className="w-6 h-6 text-[#1BCFB4]" />,
                iconBg: "bg-[#1BCFB4]/10",
                count: "4,200+ Candidates",
                role: "Accounts & Finance",
                items: "School Accountants & Cashiers, Tally Prime, GST filing, School ERP & Fee Management software experts.",
                gradient: "from-[#1BCFB4]/10 via-transparent to-transparent",
                borderHover: "hover:border-[#1BCFB4]/50"
              },
              {
                icon: <Bus className="w-6 h-6 text-[#FE7096]" />,
                iconBg: "bg-[#FE7096]/10",
                count: "3,100+ Drivers",
                role: "Transport & Drivers",
                items: "Verified Heavy Vehicle (Bus) & Light Vehicle Drivers with spotless records and school bus route familiarity.",
                gradient: "from-[#FE7096]/10 via-transparent to-transparent",
                borderHover: "hover:border-[#FE7096]/50"
              },
              {
                icon: <Laptop className="w-6 h-6 text-[#7928CA]" />,
                iconBg: "bg-[#7928CA]/10",
                count: "2,800+ Techs",
                role: "Lab & IT Technicians",
                items: "Physics, Chemistry, Biology & Computer Science Lab Assistants, System Admins, and Network Technicians.",
                gradient: "from-[#7928CA]/10 via-transparent to-transparent",
                borderHover: "hover:border-[#7928CA]/50"
              },
              {
                icon: <UserCheck className="w-6 h-6 text-[#3081e4]" />,
                iconBg: "bg-[#3081e4]/10",
                count: "5,600+ Staff",
                role: "Front Office & Admin",
                items: "Receptionists, Admission Counselors, Office Clerks with fast English/Hindi typing, and Principal Secretaries.",
                gradient: "from-[#3081e4]/10 via-transparent to-transparent",
                borderHover: "hover:border-[#3081e4]/50"
              },
              {
                icon: <GraduationCap className="w-6 h-6 text-[#FE9496]" />,
                iconBg: "bg-[#FE9496]/10",
                count: "1,900+ Specialists",
                role: "Librarians",
                items: "B.Lib / M.Lib graduates skilled in digital cataloging, library software (Koha), and student reading programs.",
                gradient: "from-[#FE9496]/10 via-transparent to-transparent",
                borderHover: "hover:border-[#FE9496]/50"
              },
              {
                icon: <Zap className="w-6 h-6 text-[#1BCFB4]" />,
                iconBg: "bg-[#1BCFB4]/10",
                count: "3,400+ Instructors",
                role: "Sports Coaches & PTI",
                items: "NIS certified physical instructors, Cricket/Football coaches, Martial Arts, Yoga trainers, and Athletic directors.",
                gradient: "from-[#1BCFB4]/10 via-transparent to-transparent",
                borderHover: "hover:border-[#1BCFB4]/50"
              },
              {
                icon: <ShieldCheck className="w-6 h-6 text-[#0F766E]" />,
                iconBg: "bg-[#0F766E]/10",
                count: "6,200+ Personnel",
                role: "Campus Security & Staff",
                items: "Ex-servicemen, Day/Night security guards, Peons, Housekeeping supervisors, and verified Caretakers.",
                gradient: "from-[#0F766E]/10 via-transparent to-transparent",
                borderHover: "hover:border-[#0F766E]/50"
              }
            ].map((card, idx) => (
              <div 
                key={idx} 
                className={`bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-slate-200/90 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 ${card.borderHover} relative overflow-hidden group`}
              >
                <div className={`absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl ${card.gradient} rounded-bl-full pointer-events-none group-hover:scale-125 transition-transform duration-300`} />
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-2xl ${card.iconBg} flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform`}>
                    {card.icon}
                  </div>
                  <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                    {card.count}
                  </span>
                </div>
                <h3 className="font-black text-slate-900 text-base mb-2">
                  {card.role}
                </h3>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  {card.items}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          7. HOW HIREHUB WORKS (4-STEP COLORFUL WORKFLOW)
      ───────────────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#1BCFB4]/30 bg-[#1BCFB4]/10 text-[#07cdae] text-xs font-bold uppercase tracking-wider mb-4">
            <Zap className="w-3.5 h-3.5" /> Simplicity at Scale
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 mb-4">
            How HireHub Works for Schools
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Transition from messy paper biodatas and chaotic WhatsApp groups to a high-speed, centralized digital hiring engine.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {[
            {
              step: "01",
              title: "Create School Account",
              desc: "Register in under 2 minutes. Instant dedicated school dashboard ready with zero setup fees.",
              gradient: "from-[#0F766E] to-[#7928CA]"
            },
            {
              step: "02",
              title: "Display Gate QR Standee",
              desc: "Print your custom QR code standee for the gate and put your link in newspaper recruitment advertisements.",
              gradient: "from-[#FE7096] to-[#ff8da9]"
            },
            {
              step: "03",
              title: "Filter by Subject & Exp",
              desc: "Applicants flow directly into your private database. Filter instantly by Subject, CTET, B.Ed, and Years of Experience.",
              gradient: "from-[#1BCFB4] to-[#07cdae]"
            },
            {
              step: "04",
              title: "1-Click WhatsApp Invite",
              desc: "Shortlist candidates and dispatch pre-filled WhatsApp interview call letters with a single tap.",
              gradient: "from-[#3081e4] to-[#0F766E]"
            }
          ].map((item, idx) => (
            <div 
              key={idx} 
              className="bg-white/95 backdrop-blur-md rounded-3xl p-7 border border-slate-200/90 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative group overflow-hidden"
            >
              <div className="flex items-center justify-between mb-5">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${item.gradient} text-white font-black text-base flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                  {item.step}
                </div>
                <span className="text-xs font-bold text-slate-400">Step {idx + 1} of 4</span>
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-2">{item.title}</h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          8. TESTIMONIALS FROM PRINCIPALS & TRUSTEES
      ───────────────────────────────────────────────────────────── */}
      <section id="testimonials" className="py-20 bg-gradient-to-b from-white via-slate-50 to-white border-y border-slate-200/80 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-amber-400/40 bg-amber-400/10 text-amber-600 text-xs font-bold uppercase tracking-wider mb-4">
              <Star className="w-3.5 h-3.5 fill-current" /> Trusted by 350+ Educational Institutions
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 mb-4">
              Loved by Principals &amp; Trustees Across India
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              See how schools are cutting recruitment time by 70% and hiring verified staff with zero physical paperwork.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {[
              {
                quote: "HireHub's QR code on our campus entrance solved our walk-in chaos completely. 140+ teachers applied online directly without a single paper resume lost!",
                name: "Dr. R. K. Singhania",
                role: "Director & Principal",
                school: "Heritage Public Academy, Delhi-NCR",
                rating: 5,
                tag: "Hired 14 Teachers",
                avatar: "RS",
                gradient: "from-[#0F766E] to-[#FE7096]"
              },
              {
                quote: "The 1-click WhatsApp interview invite is a game changer for our HR. We shortlisted 15 PGT candidates and dispatched all interview schedules in 5 minutes without typing individual messages.",
                name: "Meenakshi Sundaram",
                role: "HR Director",
                school: "Cambridge International School",
                rating: 5,
                tag: "Saved 25 Hours/wk",
                avatar: "MS",
                gradient: "from-[#1BCFB4] to-[#07cdae]"
              },
              {
                quote: "We manage 3 branches. HireHub allowed our central office to review teacher applications across all schools with complete transparency and zero placement agency fees.",
                name: "Col. V. P. Sharma (Retd.)",
                role: "Trustee & Administrator",
                school: "St. Xavier's Educational Society",
                rating: 5,
                tag: "Multi-Campus Setup",
                avatar: "VS",
                gradient: "from-[#7928CA] to-[#FE7096]"
              }
            ].map((testi, idx) => (
              <div 
                key={idx} 
                className="bg-white/90 backdrop-blur-md rounded-3xl p-7 border border-slate-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex gap-1 text-amber-400">
                      {[...Array(testi.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {testi.tag}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed italic mb-6">
                    "{testi.quote}"
                  </p>
                </div>
                
                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  <div className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${testi.gradient} text-white font-black text-sm flex items-center justify-center shadow-xs`}>
                    {testi.avatar}
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-slate-900">{testi.name}</h4>
                    <p className="text-[11px] text-slate-500 font-medium">{testi.role} • {testi.school}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          9. FAQ (CLEAN ACCORDION)
      ───────────────────────────────────────────────────────────── */}
      <section id="faq" className="py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-slate-200 bg-white text-slate-700 text-xs font-bold uppercase tracking-wider mb-4 shadow-2xs">
            <HelpCircle className="w-3.5 h-3.5 text-[#0F766E]" /> Everything You Need To Know
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-500 text-sm">
            Common questions from School Principals, Administrators, and Trustees.
          </p>
        </div>

        <div className="space-y-4">
          {[
            {
              q: "Is our school's applicant data strictly private and confidential?",
              a: "Yes, 100%. Every candidate who applies to your school via your custom QR code or career link is strictly private to your school account. We never share, sell, or expose your applicant biodatas to any other school or institution."
            },
            {
              q: "How does the custom School QR code work?",
              a: "When you register your school, HireHub generates a high-resolution printable QR code poster. You can print and display it at your school gate, reception desk, or include it in newspaper recruitment advertisements. When teachers scan it, they get a mobile form to submit their digital biodata."
            },
            {
              q: "Can candidates apply from their mobile phone without installing an app?",
              a: "Yes. The application link is completely web-based, ultra-lightweight, and mobile responsive. Candidates don't need to install any app. They can fill details, select subjects, and upload their resume in under 2 minutes."
            },
            {
              q: "Can our front desk staff enter walk-in paper biodatas into HireHub?",
              a: "Yes! If a candidate brings a physical printed resume to your reception, your front office executive can click 'Add Biodata' in the school dashboard and save their details into your digital bank in seconds."
            },
            {
              q: "How do 1-click WhatsApp interview invites work?",
              a: "When you shortlist a candidate for an interview or demo lecture, you can click the WhatsApp button next to their profile. A pre-formatted interview invitation letter opens directly in WhatsApp with their name, role, school location, and interview date."
            },
            {
              q: "Is HireHub really free for schools to start?",
              a: "Yes, schools can get started 100% free with no credit card required. You get your custom QR code, direct application link, and unlimited biodata management for your campus."
            }
          ].map((item, idx) => (
            <div 
              key={idx} 
              className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden transition-all"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full text-left px-6 py-4.5 flex items-center justify-between gap-4 font-bold text-slate-800 text-sm sm:text-base cursor-pointer hover:text-[#0F766E] transition-colors"
              >
                <span>{item.q}</span>
                {openFaq === idx ? (
                  <ChevronUp className="w-5 h-5 text-[#0F766E] shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                )}
              </button>
              {openFaq === idx && (
                <div className="px-6 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4 animate-in fade-in duration-200">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          10. HIGH IMPACT COLORFUL BOTTOM CTA BANNER
      ───────────────────────────────────────────────────────────── */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="rounded-3xl bg-gradient-to-r from-[#0F766E] via-[#FE7096] to-[#7928CA] p-10 sm:p-16 text-center text-white shadow-2xl relative overflow-hidden group">
          
          {/* Ambient Glowing Orbs */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none -mr-20 -mt-20 animate-pulse-glow" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-black/10 rounded-full blur-2xl pointer-events-none -ml-20 -mb-20 animate-float-slow" />

          <div className="relative z-10 max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/20 text-white text-xs font-bold mb-6 backdrop-blur-md border border-white/25 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Start Modern School Recruitment Today
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-5 text-white leading-tight">
              Ready to Transform Your School's Hiring Season?
            </h2>

            <p className="text-white/90 text-sm sm:text-base font-normal mb-9 max-w-2xl mx-auto leading-relaxed">
              Join 350+ forward-thinking schools saving 20+ hours each week. Get your school's QR code and digital candidate vault in 2 minutes.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Link to="/signup" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto h-13 bg-white text-slate-900 hover:bg-slate-100 font-black px-9 rounded-2xl text-sm shadow-xl hover:scale-105 transition-all cursor-pointer">
                  <Building2 className="w-4 h-4 mr-2 text-[#0F766E]" /> Register Your School Free
                </Button>
              </Link>
              <a 
                href="https://wa.me/918288863132?text=Hello%20HireHub%2C%20we%20want%20to%20schedule%20a%20demo%20for%20our%20school." 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-full sm:w-auto"
              >
                <Button variant="ghost" className="w-full sm:w-auto h-13 bg-white/15 hover:bg-white/25 text-white font-bold px-8 rounded-2xl text-sm border border-white/30 backdrop-blur-md cursor-pointer">
                  <MessageSquare className="w-4 h-4 mr-2 text-emerald-300" /> Schedule Demo on WhatsApp
                </Button>
              </a>
            </div>

            {/* Micro Trust Points */}
            <div className="flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-white/80 font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" /> Instant 2-Minute Setup
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" /> No Credit Card Required
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" /> 100% Private to School
              </span>
            </div>

          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          11. FOOTER (CLEAN & PROFESSIONAL)
      ───────────────────────────────────────────────────────────── */}
      <footer className="bg-white border-t border-slate-200 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
            
            {/* Brand column */}
            <div className="md:col-span-5 space-y-3">
              <div className="flex items-center gap-2.5">
                <img
                  src="/hirehub-logo-transparent.png"
                  alt="HireHub Logo"
                  className="w-8 h-8 object-contain"
                />
                <span className="text-xl font-black tracking-tight text-slate-900 font-sans">
                  Hire<span className="bg-gradient-to-r from-[#8A3BD4] to-[#00D2FF] bg-clip-text text-transparent">Hub</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed font-medium max-w-sm">
                HireHub is India's dedicated recruitment operating system for educational institutions. Connecting schools with top-tier teaching and administrative talent seamlessly.
              </p>
            </div>

            {/* School Portals */}
            <div className="md:col-span-3 space-y-2.5 text-xs text-slate-600 font-semibold">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Platform Portals</div>
              <div><Link to="/login" className="hover:text-[#0F766E] transition-colors">School Admin Login</Link></div>
              <div><Link to="/signup" className="hover:text-[#0F766E] transition-colors">School Registration</Link></div>
            </div>

            {/* Navigation Links */}
            <div className="md:col-span-2 space-y-2.5 text-xs text-slate-600 font-semibold">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Navigation</div>
              <div><a href="#overview" onClick={(e) => handleScroll(e, 'overview')} className="hover:text-[#0F766E] transition-colors">Overview</a></div>
              <div><a href="#for-schools" onClick={(e) => handleScroll(e, 'for-schools')} className="hover:text-[#0F766E] transition-colors">For Schools</a></div>
              <div><a href="#roles" onClick={(e) => handleScroll(e, 'roles')} className="hover:text-[#0F766E] transition-colors">Roles Covered</a></div>
              <div><a href="#how-it-works" onClick={(e) => handleScroll(e, 'how-it-works')} className="hover:text-[#0F766E] transition-colors">How It Works</a></div>
              <div><a href="#faq" onClick={(e) => handleScroll(e, 'faq')} className="hover:text-[#0F766E] transition-colors">FAQ</a></div>
            </div>

            {/* Contact Info */}
            <div className="md:col-span-2 space-y-2.5 text-xs text-slate-600">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">School Support</div>
              <p className="text-xs text-slate-500 font-medium">Need institutional setup help or a personalized demo?</p>
              <div className="pt-1">
                <a 
                  href="https://wa.me/918288863132" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 hover:bg-emerald-100 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-600" /> WhatsApp Support
                </a>
              </div>
            </div>

          </div>

          <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-medium text-slate-400">
            <div>&copy; {new Date().getFullYear()} HireHub Technologies. All rights reserved. Built for Indian Schools.</div>
            <div className="flex gap-6">
              <Link to="/privacy" className="hover:text-[#0F766E] transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-[#0F766E] transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}