import { useState, useEffect } from 'react';
import FloatingBubbles from '@/components/common/FloatingBubbles';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getPublicMarqueeSettings } from '@/lib/api';
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
  FolderLock,
  Download,
  Share2,
  Send,
  Eye,
  Award,
  BadgeCheck,
  Quote,
  Mail,
  Phone,
  Twitter,
  Linkedin,
  Facebook,
  Instagram
} from 'lucide-react';

const PARTNER_SCHOOLS = [
  'Sunrise International School',
  'Global Wisdom Public School',
  'Bright Horizon Academy',
  'Mayur Senior Secondary School',
  'Springdale International School',
  'Pragati Educational Academy',
  'Gyan Sagar Public School',
  'Greenwood Valley School',
  'Vidyasthali Memorial School',
  'Apex International Academy'
];

export default function Landing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [heroUnlocked, setHeroUnlocked] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleWindowScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleWindowScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleWindowScroll);
  }, []);

  // Fetch dynamic marquee & hero settings configured by Super Admin
  const { data: marqueeSettings } = useQuery({
    queryKey: ['publicMarqueeSettings'],
    queryFn: () => getPublicMarqueeSettings().then((r) => r.data.data),
    staleTime: 60000,
  });

  const partnerSchools = marqueeSettings?.partnerSchools && marqueeSettings.partnerSchools.length > 0
    ? marqueeSettings.partnerSchools
    : PARTNER_SCHOOLS;

  const marqueeSpeed = marqueeSettings?.marqueeSpeed || 25;
  const marqueeTitle = marqueeSettings?.marqueeTitle || 'Trusted by Reputed Schools & Educational Trusts Across India';
  const heroName = marqueeSettings?.heroName || 'HireHub';
  const rawTagline = marqueeSettings?.heroTagline || 'eliminates paper biodatas and agency commissions. Generate a custom QR code for gate walk-ins, organize applicants into a searchable digital vault, and streamline school staff recruitment.';
  const heroTagline = rawTagline
    .replace(/dispatch 1-click WhatsApp interview invitations\.?/gi, 'streamline school staff recruitment.')
    .replace(/WhatsApp/gi, 'Direct')
    .replace(/interview/gi, 'recruitment');

  // Smooth scroll handler
  const handleScroll = (e, id) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 70;
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
    <div className="min-h-screen text-slate-800 font-sans antialiased selection:bg-violet-600 selection:text-white relative overflow-x-hidden">
      
      {/* RANDOMLY MOVING BUBBLE ORBS */}
      <FloatingBubbles />

      {/* All page content sits ABOVE the bubbles layer */}
      <div className="relative z-10">

      {/* ─────────────────────────────────────────────────────────────
          1. NAVIGATION BAR (CLEAN, PROFESSIONAL & MODERN)
      ───────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-[0_1px_10px_rgba(0,0,0,0.04)]">
        <div className="max-w-7xl mx-auto h-16 sm:h-20 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-full items-center">
            
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group">
              <img
                src="/hirehub-logo-transparent.png"
                alt="HireHub Logo"
                className="w-8 h-8 sm:w-10 sm:h-10 object-contain group-hover:scale-105 transition-transform"
              />
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 font-sans leading-tight">
                  Hire<span className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">Hub</span>
                </span>
                <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 tracking-wider uppercase -mt-0.5">
                  School Staff Recruitment OS
                </span>
              </div>
            </Link>
            
            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-7">
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
                  className="text-sm font-semibold text-slate-600 hover:text-violet-700 transition-colors cursor-pointer py-1"
                >
                  {item.label}
                </a>
              ))}
            </div>

            {/* CTA Portal Buttons (School Only) */}
            <div className="hidden sm:flex items-center space-x-3">
              <Link to="/login">
                <Button 
                  variant="outline" 
                  className="h-9 sm:h-10 px-3.5 sm:px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-violet-700 hover:border-violet-300 text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center gap-2"
                >
                  <Building2 className="w-4 h-4 text-slate-500" />
                  <span>School Login</span>
                </Button>
              </Link>

              <Link to="/signup">
                <Button className="h-9 sm:h-10 px-4 sm:px-5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold shadow-md shadow-violet-500/25 hover:shadow-lg hover:shadow-violet-500/35 transition-all cursor-pointer">
                  Register School Free
                </Button>
              </Link>
            </div>

            {/* Mobile Hamburger Toggle */}
            <div className="lg:hidden flex items-center">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-600 hover:text-violet-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Backdrop Overlay (Click outside to close) */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 h-screen h-[100dvh] w-screen bg-slate-900/60 backdrop-blur-xs z-[998] transition-opacity duration-300"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Side Drawer (Slides in from the right, full viewport height) */}
      <div 
        className={`fixed top-0 right-0 h-screen h-[100dvh] w-[290px] sm:w-[320px] max-w-[85vw] bg-white z-[999] shadow-2xl flex flex-col justify-between transition-transform duration-300 ease-in-out border-l border-slate-200 ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="h-16 px-5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2.5">
            <img
              src="/hirehub-logo-transparent.png"
              alt="HireHub Logo"
              className="w-7 h-7 object-contain"
            />
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-tight text-slate-900 leading-tight">
                Hire<span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">Hub</span>
              </span>
              <span className="text-[8px] font-bold text-slate-400 tracking-wider uppercase -mt-0.5">
                Recruitment OS
              </span>
            </div>
          </Link>
          
          <button 
            onClick={() => setMobileMenuOpen(false)}
            className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Drawer Action Buttons TOP */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/80 space-y-2 shrink-0">
          <Link to="/signup" className="w-full block" onClick={() => setMobileMenuOpen(false)}>
            <Button className="w-full justify-center h-10 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-700 hover:via-purple-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-violet-500/25">
              Register School Free
            </Button>
          </Link>
          <Link to="/login" className="w-full block" onClick={() => setMobileMenuOpen(false)}>
            <Button variant="outline" className="w-full justify-center h-10 bg-white text-slate-700 border-slate-200 hover:border-violet-300 hover:text-violet-700 rounded-xl text-xs font-bold shadow-2xs">
              <Building2 className="w-4 h-4 mr-2 text-violet-600" /> School Login
            </Button>
          </Link>
        </div>

        {/* Drawer Navigation Links (All items fully visible) */}
        <div className="p-4 space-y-1 overflow-y-auto flex-1 min-h-0 bg-white">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 py-1.5 mb-1">
            Menu Navigation
          </div>
          {[
            { label: 'Overview', target: 'overview', icon: Globe },
            { label: 'For Schools', target: 'for-schools', icon: Building2 },
            { label: 'Roles Covered', target: 'roles', icon: Briefcase },
            { label: 'How It Works', target: 'how-it-works', icon: Zap },
            { label: 'Testimonials', target: 'testimonials', icon: Star },
            { label: 'FAQ', target: 'faq', icon: HelpCircle }
          ].map((item) => {
            const IconComponent = item.icon;
            return (
              <a 
                key={item.target}
                href={`#${item.target}`} 
                onClick={(e) => handleScroll(e, item.target)}
                className="flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-bold text-slate-700 hover:bg-violet-50 hover:text-violet-700 transition-colors"
              >
                <IconComponent className="w-4 h-4 text-violet-600 shrink-0" />
                <span>{item.label}</span>
              </a>
            );
          })}
        </div>

        {/* Drawer Footer */}
        <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/50 text-center shrink-0">
          <p className="text-[10px] font-medium text-slate-400">
            &copy; {new Date().getFullYear()} HireHub OS
          </p>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. HERO SECTION - VIBRANT, MODERN & SLEEK
      ───────────────────────────────────────────────────────────── */}
      <section id="overview" className="pt-20 pb-10 sm:pt-28 sm:pb-16 lg:pt-36 lg:pb-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* HERO LEFT COLUMN */}
            <div className="lg:col-span-7 text-center lg:text-left">
              
              {/* Animated Floating Pill Badge */}
              <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full border border-violet-200 bg-white/90 shadow-2xs backdrop-blur-md mb-4 sm:mb-6 hover:border-violet-300 transition-colors max-w-full">
                <span className="flex h-2 w-2 relative shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-[11px] sm:text-xs font-black bg-gradient-to-r from-violet-700 to-indigo-600 bg-clip-text text-transparent truncate">
                  {heroName} Recruitment OS
                </span>
                <span className="hidden sm:inline text-slate-300">•</span>
                <span className="hidden sm:inline text-xs font-semibold text-slate-600">
                  India's Dedicated School Staffing Platform
                </span>
              </div>

              {/* Colorful Main Headline */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.14] mb-4 sm:mb-6">
                Hire Top Teachers &amp; School Staff{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-indigo-600 to-sky-500">
                  in Minutes.
                </span>
              </h1>

              {/* Sub-headline — controlled by Super Admin */}
              <p className="text-sm sm:text-base lg:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 mb-6 sm:mb-8 font-normal leading-relaxed">
                <strong className="text-slate-900 font-bold">{heroName}</strong> {heroTagline}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-3.5 justify-center lg:justify-start mb-6">
                <Link to="/signup" className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto h-11 sm:h-12 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-sky-600 hover:from-violet-700 hover:via-indigo-700 hover:to-sky-700 text-white font-bold px-7 sm:px-8 shadow-xl shadow-violet-500/25 hover:shadow-violet-500/35 transition-all text-xs sm:text-sm flex items-center justify-center gap-2 group cursor-pointer">
                    <Building2 className="w-4 h-4" /> Start School Free Trial
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>

                <Link to="/login" className="w-full sm:w-auto">
                  <Button variant="outline" className="w-full sm:w-auto h-11 sm:h-12 border-slate-200 bg-white/90 backdrop-blur-sm text-slate-800 hover:border-violet-300 hover:text-violet-700 hover:bg-violet-50/50 px-6 sm:px-7 rounded-xl font-bold transition-all text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs cursor-pointer">
                    <Building2 className="w-4 h-4 text-violet-600" /> School Admin Login
                  </Button>
                </Link>
              </div>

              {/* Quick Interactive Role Search Chips */}
              <div className="mb-6 sm:mb-8 flex flex-wrap items-center justify-center lg:justify-start gap-1.5 sm:gap-2">
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1 flex items-center gap-1">
                  <Search className="w-3 h-3 text-violet-600" /> Quick Roles:
                </span>
                {[
                  { label: '📐 PGT Maths', target: 'roles' },
                  { label: '🧪 TGT Science', target: 'roles' },
                  { label: '🚌 Bus Driver', target: 'roles' },
                  { label: '💻 Computer / IT', target: 'roles' },
                  { label: '📊 Accountant', target: 'roles' },
                ].map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={(e) => handleScroll(e, chip.target)}
                    className="px-2 py-1 sm:px-2.5 sm:py-1 rounded-lg text-[10px] sm:text-[11px] font-bold bg-white border border-slate-200 hover:border-violet-400 hover:text-violet-700 text-slate-600 shadow-2xs transition-all cursor-pointer"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>

              {/* Trust Badges */}
              <div className="pt-4 sm:pt-6 border-t border-slate-200/80 flex flex-wrap items-center justify-center lg:justify-start gap-y-2.5 gap-x-5 sm:gap-x-8 text-[11px] sm:text-xs font-semibold text-slate-600">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 shrink-0" /> 100% Free School Access
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 shrink-0" /> Auto Gate QR Code
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 shrink-0" /> 100% Private to School
                </div>
              </div>

            </div>

            {/* HERO RIGHT COLUMN - CLEAN FLOATING CHARACTER ILLUSTRATION (NO BOX/CONTAINER) */}
            <div className="lg:col-span-5 relative max-w-lg mx-auto lg:max-w-none w-full flex items-center justify-center">
              <div className="relative w-full max-w-[420px] flex items-center justify-center py-4">
                
                {/* Soft ambient colorful blur behind the character */}
                <div className="absolute inset-0 bg-gradient-to-tr from-violet-500/25 via-indigo-500/20 to-sky-400/25 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-glow" />

                {/* The Transparent Character Illustration */}
                <div className="relative w-full flex items-center justify-center group">
                  <img 
                    src="/hirehub-hiring-illustration.png" 
                    alt="We Are Hiring School Staff" 
                    className="w-full max-w-[340px] sm:max-w-[390px] h-auto object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Floating Pill Badge 1: 100% Verified */}
                  <div className="absolute top-2 -left-2 sm:left-0 bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-lg rounded-2xl px-3 py-2 flex items-center gap-2.5 animate-float-slow hover:border-violet-300 transition-all">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold shrink-0 shadow-2xs">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <div className="text-xs font-bold text-slate-800 leading-tight">Teaching &amp; Staff</div>
                      <div className="text-[10px] text-emerald-600 font-semibold">100% Verified</div>
                    </div>
                  </div>

                  {/* Floating Pill Badge 2: Gate QR Intake */}
                  <div className="absolute -bottom-2 -right-2 sm:right-2 bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-lg rounded-2xl px-3 py-2 flex items-center gap-2.5 shadow-violet-500/10 hover:border-violet-300 transition-all">
                    <div className="w-8 h-8 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center shrink-0 shadow-2xs">
                      <QrCode className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <div className="text-xs font-bold text-slate-800 leading-tight">Gate QR Standee</div>
                      <div className="text-[10px] text-violet-600 font-semibold">Zero Paper Biodatas</div>
                    </div>
                  </div>

                  {/* Floating Pill Badge 3: Candidate Vault (top right) */}
                  <div className="hidden sm:flex absolute top-10 -right-4 bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-md rounded-xl px-2.5 py-1.5 items-center gap-1.5 text-slate-700 font-bold text-[11px] shadow-2xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <span>Instant Candidate Vault</span>
                  </div>

                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. REAL-WORLD STATS COUNTER STRIP
      ───────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-b from-white via-slate-50/60 to-white border-y border-slate-200/80 py-8 sm:py-12 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
            
            <div className="bg-white rounded-xl sm:rounded-2xl p-3.5 sm:p-5 text-center border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-xl hover:border-violet-300 hover:-translate-y-0.5 transition-all duration-300 group">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-violet-100/70 text-violet-700 mx-auto flex items-center justify-center mb-2 sm:mb-3 group-hover:scale-110 transition-transform">
                <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-black bg-gradient-to-r from-violet-700 to-indigo-600 bg-clip-text text-transparent mb-0.5 sm:mb-1">
                100%
              </div>
              <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">
                Free For Schools
              </div>
              <span className="text-[9px] sm:text-[10px] text-emerald-600 font-semibold mt-0.5 sm:mt-1 inline-block">No Hidden Charges</span>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl p-3.5 sm:p-5 text-center border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-xl hover:border-sky-300 hover:-translate-y-0.5 transition-all duration-300 group">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-sky-100/70 text-sky-700 mx-auto flex items-center justify-center mb-2 sm:mb-3 group-hover:scale-110 transition-transform">
                <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-black bg-gradient-to-r from-sky-600 to-cyan-500 bg-clip-text text-transparent mb-0.5 sm:mb-1">
                0 Paper
              </div>
              <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">
                Biodatas — Digital
              </div>
              <span className="text-[9px] sm:text-[10px] text-emerald-600 font-semibold mt-0.5 sm:mt-1 inline-block">QR → Mobile Form</span>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl p-3.5 sm:p-5 text-center border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-xl hover:border-indigo-300 hover:-translate-y-0.5 transition-all duration-300 group">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-indigo-100/70 text-indigo-700 mx-auto flex items-center justify-center mb-2 sm:mb-3 group-hover:scale-110 transition-transform">
                <Briefcase className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-black bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent mb-0.5 sm:mb-1">
                8+ Roles
              </div>
              <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">
                Staff &amp; Teachers
              </div>
              <span className="text-[9px] sm:text-[10px] text-violet-700 font-semibold mt-0.5 sm:mt-1 inline-block">PGT, TGT, Driver, Admin</span>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl p-3.5 sm:p-5 text-center border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-xl hover:border-amber-300 hover:-translate-y-0.5 transition-all duration-300 group">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-amber-100/70 text-amber-600 mx-auto flex items-center justify-center mb-2 sm:mb-3 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-black bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent mb-0.5 sm:mb-1">
                100% Private
              </div>
              <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">
                Candidate Vault
              </div>
              <span className="text-[9px] sm:text-[10px] text-amber-600 font-semibold mt-0.5 sm:mt-1 inline-block">Confidential To Campus</span>
            </div>

          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. INFINITE SCHOOL PARTNERS MARQUEE (DYNAMIC FROM SUPER ADMIN)
      ───────────────────────────────────────────────────────────── */}
      <div className="py-6 bg-slate-50/70 border-b border-slate-200/80 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 mb-2 text-center">
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
            {marqueeTitle}
          </p>
        </div>
        <div className="relative flex overflow-x-hidden">
          <div 
            className="animate-marquee whitespace-nowrap flex items-center gap-8 py-1"
            style={{ animationDuration: `${marqueeSpeed}s` }}
          >
            {[...partnerSchools, ...partnerSchools].map((school, i) => (
              <div 
                key={i} 
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs text-xs font-bold text-slate-700 tracking-wide hover:border-violet-300 transition-colors"
              >
                <div className="w-2 h-2 rounded-full bg-violet-600" />
                <span>{school}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          5. FOR SCHOOLS VALUE PROPOSITION (BENTO-STYLE PILLARS)
      ───────────────────────────────────────────────────────────── */}
      <section id="for-schools" className="py-12 sm:py-20 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-r from-violet-400/10 via-sky-400/10 to-transparent blur-3xl pointer-events-none -z-10 animate-pulse-glow" />

        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full border border-violet-200 bg-violet-50 text-violet-700 text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-3 sm:mb-4 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5" /> Built for Indian Schools &amp; Institutes
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-900 mb-3 sm:mb-4">
            Everything your school needs to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-indigo-600 to-sky-500">
              Eliminate Paper Biodatas
            </span>
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm lg:text-base font-normal leading-relaxed">
            From gate walk-ins to newspaper advertisements, streamline your entire teacher recruitment into one high-speed digital dashboard.
          </p>
        </div>

        {/* 2 Core School Pillars (Compact & Realistic) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-7 max-w-5xl mx-auto">
          
          <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-2xl hover:border-violet-300 hover:-translate-y-1.5 transition-all duration-300 group relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-violet-500 to-indigo-500" />
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-violet-100/70 text-violet-700 flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform shadow-xs">
              <QrCode className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div className="inline-block text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-violet-50 text-violet-700 mb-2.5 sm:mb-3 border border-violet-100">
              Zero Friction Intake
            </div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 mb-2">
              Custom Career Link &amp; Gate QR
            </h3>
            <p className="text-xs text-slate-600 font-normal leading-relaxed mb-5 sm:mb-6">
              Get an instant dedicated application URL and high-res printable QR code poster. Put it on your website, reception, or newspaper ads. Walk-in candidates scan and submit digital biodatas straight to your dashboard!
            </p>
            <ul className="space-y-2 sm:space-y-2.5 text-xs font-semibold text-slate-700">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Zero duplicate resumes &amp; paper mess</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Auto-collect B.Ed, Medium &amp; Experience</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Real-time mobile applicant alerts</li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 border-2 border-violet-500/50 shadow-xl hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 relative group overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-violet-600 via-indigo-600 to-sky-500" />
            <div className="absolute top-4 right-4 sm:top-5 sm:right-5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full shadow-md">
              ⚡ Instant Search
            </div>
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-indigo-100/70 text-indigo-700 flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform shadow-xs">
              <FolderLock className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div className="inline-block text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 mb-2.5 sm:mb-3 border border-indigo-100">
              100% Private Vault
            </div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 mb-2">
              Centralized Candidate Bank
            </h3>
            <p className="text-xs text-slate-600 font-normal leading-relaxed mb-5 sm:mb-6">
              All received applications are saved permanently in your private database. Instantly search all PGT Physics or TGT Maths candidates in seconds using subject, experience, and qualification filters.
            </p>
            <ul className="space-y-2 sm:space-y-2.5 text-xs font-semibold text-slate-700">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Instant Ctrl+K subject search</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> 100% Confidential to your campus</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Never lose a good resume again</li>
            </ul>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6. ROLE-SPECIFIC COVERAGE
      ───────────────────────────────────────────────────────────── */}
      <section id="roles" className="py-12 sm:py-20 lg:py-24 bg-gradient-to-b from-slate-50/70 via-white to-slate-50/70 border-y border-slate-200/80 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full border border-violet-200 bg-violet-50 text-violet-700 text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-3 sm:mb-4">
              <Sparkles className="w-3.5 h-3.5" /> Comprehensive Campus Staffing
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-900 mb-3 sm:mb-4">
              One Hub For{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-indigo-600 to-sky-500">
                Every School Role
              </span>
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm lg:text-base font-normal leading-relaxed">
              Schools require much more than just subject teachers. HireHub includes purpose-built forms, filters, and qualification checklists for every educational and operational position.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6">
            {[
              {
                icon: <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-violet-600" />,
                iconBg: "bg-violet-100/80",
                count: "Form Available",
                role: "Teaching Faculty",
                items: "PGT, TGT, PRT, Pre-Primary, Subject Specialists (Maths, Science, Languages), B.Ed/M.Ed, CTET qualified.",
                borderHover: "hover:border-violet-400"
              },
              {
                icon: <Calculator className="w-5 h-5 sm:w-6 sm:h-6 text-sky-600" />,
                iconBg: "bg-sky-100/80",
                count: "Form Available",
                role: "Accounts & Finance",
                items: "School Accountants & Cashiers, Tally Prime, GST filing, School ERP & Fee Management software experts.",
                borderHover: "hover:border-sky-400"
              },
              {
                icon: <Bus className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />,
                iconBg: "bg-amber-100/80",
                count: "Form Available",
                role: "Transport & Drivers",
                items: "Heavy Vehicle (Bus) & Light Vehicle Drivers with valid license, route familiarity and clean record.",
                borderHover: "hover:border-amber-400"
              },
              {
                icon: <Laptop className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />,
                iconBg: "bg-indigo-100/80",
                count: "Form Available",
                role: "Lab & IT Technicians",
                items: "Physics, Chemistry, Biology & Computer Science Lab Assistants, System Admins, and Network Technicians.",
                borderHover: "hover:border-indigo-400"
              },
              {
                icon: <UserCheck className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />,
                iconBg: "bg-emerald-100/80",
                count: "Form Available",
                role: "Front Office & Admin",
                items: "Receptionists, Admission Counselors, Office Clerks with fast English/Hindi typing, and Principal Secretaries.",
                borderHover: "hover:border-emerald-400"
              },
              {
                icon: <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-rose-600" />,
                iconBg: "bg-rose-100/80",
                count: "Form Available",
                role: "Librarians",
                items: "B.Lib / M.Lib graduates skilled in digital cataloging, library software (Koha), and student reading programs.",
                borderHover: "hover:border-rose-400"
              },
              {
                icon: <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600" />,
                iconBg: "bg-teal-100/80",
                count: "Form Available",
                role: "Sports Coaches & PTI",
                items: "NIS certified physical instructors, Cricket/Football coaches, Martial Arts, Yoga trainers, and Athletic directors.",
                borderHover: "hover:border-teal-400"
              },
              {
                icon: <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-slate-700" />,
                iconBg: "bg-slate-200/80",
                count: "Form Available",
                role: "Campus Security & Staff",
                items: "Ex-servicemen, Day/Night security guards, Peons, Housekeeping supervisors, and verified Caretakers.",
                borderHover: "hover:border-slate-400"
              }
            ].map((card, idx) => (
              <div 
                key={idx} 
                className={`bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-200/90 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 ${card.borderHover} relative overflow-hidden group`}
              >
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl ${card.iconBg} flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform`}>
                    {card.icon}
                  </div>
                  <span className="text-[9px] sm:text-[10px] font-black text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                    {card.count}
                  </span>
                </div>
                <h3 className="font-black text-slate-900 text-sm sm:text-base mb-1.5 sm:mb-2">
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
          7. HOW HIREHUB WORKS (4-STEP WORKFLOW)
      ───────────────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-12 sm:py-20 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full border border-sky-200 bg-sky-50 text-sky-700 text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-3 sm:mb-4">
            <Zap className="w-3.5 h-3.5" /> Simplicity at Scale
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-900 mb-3 sm:mb-4">
            How HireHub Works for Schools
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm lg:text-base">
            Transition from messy paper biodatas and chaotic candidate folders to a high-speed, centralized digital hiring engine.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 relative">
          {[
            {
              step: "01",
              title: "Create School Account",
              desc: "Register in under 2 minutes. Instant dedicated school dashboard ready with zero setup fees.",
              gradient: "from-violet-600 to-indigo-600"
            },
            {
              step: "02",
              title: "Display Gate QR Standee",
              desc: "Print your custom QR code standee for the gate and put your link in newspaper recruitment advertisements.",
              gradient: "from-indigo-600 to-sky-600"
            },
            {
              step: "03",
              title: "Filter by Subject & Exp",
              desc: "Applicants flow directly into your private database. Filter instantly by Subject, CTET, B.Ed, and Years of Experience.",
              gradient: "from-sky-600 to-cyan-500"
            },
            {
              step: "04",
              title: "Shortlist & Manage Vault",
              desc: "Review verified credentials, shortlist matching candidates, and manage your campus talent pool with 1-click status updates.",
              gradient: "from-emerald-600 to-teal-500"
            }
          ].map((item, idx) => (
            <div 
              key={idx} 
              className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 relative group overflow-hidden"
            >
              <div className="flex items-center justify-between mb-4 sm:mb-5">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-tr ${item.gradient} text-white font-black text-sm sm:text-base flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                  {item.step}
                </div>
                <span className="text-[11px] sm:text-xs font-bold text-slate-400">Step {idx + 1} of 4</span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 mb-1.5 sm:mb-2">{item.title}</h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          8. TESTIMONIALS FROM PRINCIPALS & TRUSTEES (COMPACT 2x2 GRID)
      ───────────────────────────────────────────────────────────── */}
      <section id="testimonials" className="py-10 sm:py-16 bg-gradient-to-b from-white via-purple-50/25 to-white border-y border-purple-100 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-purple-200 bg-purple-50 text-purple-700 text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-2.5 sm:mb-3">
              <Star className="w-3.5 h-3.5 fill-current text-purple-600" /> Trusted by Principals &amp; School Owners Across India
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-900 mb-2">
              Loved by School Principals &amp; Owners
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm">
              See how schools are cutting recruitment time by 70% and hiring verified staff with zero physical paperwork.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-5">
            {[
              {
                quote: "HireHub eliminated our paper resume clutter completely. We put our school's QR code in recruitment ads and at our reception — 180+ qualified teachers applied digitally and our management shortlisted candidates effortlessly.",
                name: "RAJESH KUMAR",
                role: "SCHOOL ADMINISTRATOR",
                school: "SUNRISE INTERNATIONAL SCHOOL",
                initials: "RK",
                accent: "border-t-purple-500",
                badgeColor: "bg-purple-100 text-purple-800 border-purple-200"
              },
              {
                quote: "Managing hiring across multiple academic sessions used to be a massive administrative burden. HireHub gave us an instant digital candidate bank with 1-click subject filtering and candidate status tracking.",
                name: "SANJAY SHARMA",
                role: "DIRECTOR & OWNER",
                school: "GLOBAL WISDOM INTERNATIONAL SCHOOL",
                initials: "SS",
                accent: "border-t-indigo-500",
                badgeColor: "bg-indigo-100 text-indigo-800 border-indigo-200"
              },
              {
                quote: "Displaying our school QR code at the campus gate ended walk-in candidate chaos. Teachers scan and apply directly from their phones. We shortlisted 16 PGT faculty in just two days without paying any agency commission.",
                name: "DR. SUNITA AGRAWAL",
                role: "PRINCIPAL",
                school: "BRIGHT HORIZON ACADEMY",
                initials: "SA",
                accent: "border-t-violet-500",
                badgeColor: "bg-violet-100 text-violet-800 border-violet-200"
              },
              {
                quote: "Managing recruitment for 3 branch campuses was tricky until we adopted HireHub. Our central committee reviews teacher and admin applications in one unified dashboard with total confidentiality and zero lost biodatas.",
                name: "ANITA DESHMUKH",
                role: "MANAGING TRUSTEE & FOUNDER",
                school: "PRAGATI EDUCATIONAL GROUP",
                initials: "AD",
                accent: "border-t-fuchsia-500",
                badgeColor: "bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200"
              }
            ].map((testi, idx) => (
              <div 
                key={idx} 
                className={`bg-white rounded-2xl p-4 sm:p-6 border border-slate-200/90 shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between border-t-[3px] ${testi.accent}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5 sm:mb-3">
                    <Quote className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500 fill-purple-100" />
                    <div className="flex gap-0.5 text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs sm:text-[13px] text-slate-700 font-medium leading-relaxed mb-4 sm:mb-5">
                    "{testi.quote}"
                  </p>
                </div>
                
                <div className="flex items-center gap-2.5 sm:gap-3 pt-3 border-t border-slate-100">
                  <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg font-black text-xs flex items-center justify-center border shrink-0 tracking-wide ${testi.badgeColor}`}>
                    {testi.initials}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-black text-xs sm:text-sm text-slate-900 tracking-wide truncate">{testi.name}</h4>
                    <p className="text-[9px] sm:text-[11px] text-slate-500 font-bold uppercase tracking-wider truncate">
                      {testi.role}, {testi.school}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          9. FAQ (COMPACT PURPLE ACCORDION)
      ───────────────────────────────────────────────────────────── */}
      <section id="faq" className="py-10 sm:py-16 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-purple-200 bg-purple-50 text-purple-700 text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-2 sm:mb-2.5">
            <HelpCircle className="w-3.5 h-3.5 text-purple-600" /> Frequently Asked Questions
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 mb-2">
            Got Questions? We've Got Answers
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm">
            Quick answers for School Owners, Principals, and Administrators.
          </p>
        </div>

        <div className="space-y-2 sm:space-y-2.5">
          {[
            {
              q: "Is our school's applicant data strictly private and confidential?",
              a: "Yes, 100%. Every candidate who applies to your school via your custom QR code or career link is strictly private to your school account. We never share, sell, or expose your applicant biodatas to any other institution."
            },
            {
              q: "How does the custom School QR code work?",
              a: "When you register your school, HireHub generates an instant printable QR code. You can display it at your school gate, reception, or in newspaper recruitment advertisements. Candidates scan it with their phone camera to submit their digital biodata in under 2 minutes."
            },
            {
              q: "Can our front desk staff enter walk-in paper biodatas into HireHub?",
              a: "Yes. If a candidate brings a physical printed resume to your reception, your front office executive can click 'Add Biodata' in the school dashboard and digitize their details in seconds."
            },
            {
              q: "Can our school filter applicants by subject, experience, and qualification?",
              a: "Yes! Your school dashboard provides instant filters for teaching levels (PGT, TGT, PRT, NTT), specific subjects (Maths, Science, English, etc.), years of experience, and degrees (B.Ed, CTET, Masters). You can shortlist matching candidates in seconds."
            },
            {
              q: "Can candidates apply from their mobile phone without installing an app?",
              a: "Yes. The application link is completely web-based, ultra-lightweight, and mobile responsive. Candidates don't need to install any app. They can fill details, select subjects, and upload their resume in under 2 minutes."
            },
            {
              q: "Is HireHub really free for schools to start?",
              a: "Yes, schools can start 100% free with zero credit card required. You get your custom QR code, direct application link, and digital biodata management for your campus."
            }
          ].map((item, idx) => (
            <div 
              key={idx} 
              className={`bg-white rounded-xl border transition-all duration-200 overflow-hidden ${
                openFaq === idx 
                  ? 'border-purple-300 shadow-xs bg-purple-50/20' 
                  : 'border-slate-200/90 hover:border-purple-200'
              }`}
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full text-left px-4 py-3 sm:px-5 sm:py-3.5 flex items-center justify-between gap-3 font-bold text-slate-800 text-xs sm:text-sm cursor-pointer hover:text-purple-700 transition-colors"
              >
                <span>{item.q}</span>
                {openFaq === idx ? (
                  <ChevronUp className="w-4 h-4 text-purple-600 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                )}
              </button>
              {openFaq === idx && (
                <div className="px-4 pb-3.5 sm:px-5 sm:pb-4 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-purple-100/70 pt-2.5 sm:pt-3">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          10. HIGH IMPACT MODERN SAAS BOTTOM CTA BANNER (COMPACT PURPLE)
      ───────────────────────────────────────────────────────────── */}
      <section className="py-10 sm:py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-r from-purple-800 via-indigo-700 to-slate-900 p-6 sm:p-10 lg:p-12 text-center text-white shadow-2xl shadow-purple-950/20 relative overflow-hidden group">
          
          {/* Ambient Glowing Orbs */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-sky-400/20 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16 animate-pulse-glow" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl pointer-events-none -ml-16 -mb-16 animate-float-slow" />

          <div className="relative z-10 max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-[11px] sm:text-xs font-bold mb-3 sm:mb-4 backdrop-blur-md border border-white/20 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Start Modern School Recruitment Today
            </span>

            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black tracking-tight mb-2.5 sm:mb-3 text-white leading-tight">
              Ready to Transform Your School's Hiring Season?
            </h2>

            <p className="text-white/80 text-xs sm:text-sm font-normal mb-6 sm:mb-7 max-w-2xl mx-auto leading-relaxed">
              Join forward-thinking schools saving 20+ hours each week. Get your school's QR code and digital candidate vault in 2 minutes.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-3.5 justify-center items-center mb-5 sm:mb-6">
              <Link to="/signup" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto h-11 bg-white text-slate-900 hover:bg-slate-100 font-black px-7 sm:px-8 rounded-xl text-xs sm:text-sm shadow-xl hover:scale-105 transition-all cursor-pointer">
                  <Building2 className="w-4 h-4 mr-2 text-purple-600" /> Register Your School Free
                </Button>
              </Link>
              <Link to="/login" className="w-full sm:w-auto">
                <Button variant="ghost" className="w-full sm:w-auto h-11 bg-white/10 hover:bg-white/20 text-white font-bold px-7 sm:px-8 rounded-xl text-xs sm:text-sm border border-white/20 backdrop-blur-md cursor-pointer">
                  <Building2 className="w-4 h-4 mr-2 text-white" /> School Admin Login
                </Button>
              </Link>
            </div>

            {/* Micro Trust Points */}
            <div className="flex flex-wrap items-center justify-center gap-y-2 gap-x-5 sm:gap-x-6 text-[10px] sm:text-xs text-white/70 font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Instant 2-Minute Setup
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> No Credit Card Required
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> 100% Private to School
              </span>
            </div>

          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          11. FOOTER (DARK MODERN THEME)
      ───────────────────────────────────────────────────────────── */}
      <footer className="bg-[#0B1120] text-slate-300 border-t border-slate-800/80 pt-12 pb-8 sm:pt-16 sm:pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-12 gap-8 lg:gap-12 mb-10 sm:mb-12">
            
            {/* Brand column */}
            <div className="col-span-2 md:col-span-4 space-y-3.5 sm:space-y-4">
              <div className="flex items-center gap-2.5">
                <img
                  src="/hirehub-logo-transparent.png"
                  alt="HireHub Logo"
                  className="w-7 h-7 sm:w-8 sm:h-8 object-contain"
                />
                <span className="text-xl font-black tracking-tight text-white font-sans">
                  Hire<span className="bg-gradient-to-r from-violet-400 via-indigo-300 to-sky-400 bg-clip-text text-transparent">Hub</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-normal max-w-sm">
                HireHub is a cloud-based school recruitment and staff management operating system that helps institutions streamline teacher hiring, digital biodatas, and campus placement communication efficiently.
              </p>
              
              {/* Social Icons */}
              <div className="flex items-center gap-2.5 pt-1">
                <a 
                  href="https://twitter.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label="Twitter"
                  className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 hover:bg-slate-800 transition-all cursor-pointer"
                >
                  <Twitter className="w-3.5 h-3.5" />
                </a>
                <a 
                  href="https://linkedin.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label="LinkedIn"
                  className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 hover:bg-slate-800 transition-all cursor-pointer"
                >
                  <Linkedin className="w-3.5 h-3.5" />
                </a>
                <a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label="Facebook"
                  className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 hover:bg-slate-800 transition-all cursor-pointer"
                >
                  <Facebook className="w-3.5 h-3.5" />
                </a>
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label="Instagram"
                  className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 hover:bg-slate-800 transition-all cursor-pointer"
                >
                  <Instagram className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Features column */}
            <div className="col-span-1 md:col-span-3 space-y-2 sm:space-y-2.5 text-xs text-slate-400">
              <h4 className="text-sm font-bold text-white mb-2 sm:mb-3 tracking-wide">Features</h4>
              <div><a href="#for-schools" onClick={(e) => handleScroll(e, 'for-schools')} className="hover:text-white transition-colors">Teacher Biodata Vault</a></div>
              <div><a href="#for-schools" onClick={(e) => handleScroll(e, 'for-schools')} className="hover:text-white transition-colors">School QR Code Poster</a></div>
              <div><a href="#how-it-works" onClick={(e) => handleScroll(e, 'how-it-works')} className="hover:text-white transition-colors">Candidate Shortlisting</a></div>
              <div><a href="#roles" onClick={(e) => handleScroll(e, 'roles')} className="hover:text-white transition-colors">Role &amp; Subject Filtering</a></div>
              <div><a href="#for-schools" onClick={(e) => handleScroll(e, 'for-schools')} className="hover:text-white transition-colors">Walk-in CV Digitization</a></div>
            </div>

            {/* Support column */}
            <div className="col-span-1 md:col-span-2 space-y-2 sm:space-y-2.5 text-xs text-slate-400">
              <h4 className="text-sm font-bold text-white mb-2 sm:mb-3 tracking-wide">Support</h4>
              <div><a href="#faq" onClick={(e) => handleScroll(e, 'faq')} className="hover:text-white transition-colors">Help Center</a></div>
              <div><Link to="/login" className="hover:text-white transition-colors">School Login</Link></div>
              <div><Link to="/signup" className="hover:text-white transition-colors">Register Campus</Link></div>
              <div><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></div>
              <div><Link to="/terms" className="hover:text-white transition-colors">Terms &amp; Conditions</Link></div>
            </div>

            {/* Contact column */}
            <div className="col-span-2 md:col-span-3 space-y-2.5 sm:space-y-3 text-xs text-slate-400">
              <h4 className="text-sm font-bold text-white mb-2 sm:mb-3 tracking-wide">Contact</h4>
              <div>
                <a 
                  href="mailto:hirehub@webncode.in" 
                  className="flex items-center gap-2.5 hover:text-white transition-colors group"
                >
                  <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                  <span className="truncate">hirehub@webncode.in</span>
                </a>
              </div>
              <div>
                <a 
                  href="tel:+918947919195" 
                  className="flex items-center gap-2.5 hover:text-white transition-colors group"
                >
                  <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>+91 8947919195</span>
                </a>
              </div>
              <div className="flex items-center gap-2.5 text-slate-400">
                <MapPin className="w-4 h-4 text-pink-400 shrink-0" />
                <span>Jaipur, Rajasthan</span>
              </div>
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="pt-6 sm:pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 text-xs font-normal text-slate-500 text-center sm:text-left">
            <div>&copy; {new Date().getFullYear()} HireHub. All rights reserved.</div>
            <div className="flex gap-6">
              <Link to="/privacy" className="hover:text-slate-300 transition-colors">Privacy policy</Link>
              <Link to="/terms" className="hover:text-slate-300 transition-colors">Terms of service</Link>
            </div>
          </div>
        </div>
      </footer>

      </div>{/* end relative z-10 content wrapper */}
    </div>
  );
}