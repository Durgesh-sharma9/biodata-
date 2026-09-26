import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Briefcase,
  GraduationCap,
  Users, 
  Search, 
  MapPin, 
  SlidersHorizontal, 
  FileText, 
  Building2, 
  ShieldCheck, 
  ArrowRight, 
  Check, 
  Sparkles, 
  Menu,
  X,
  Target,
  Clock,
  Unlock,
  Coins,
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
  Laptop
} from 'lucide-react';

const CANDIDATES_DATA = [
  {
    id: 1,
    name: 'Sunita Kumari',
    initials: 'SK',
    category: 'teaching',
    role: 'TGT Science (Bio & Chem)',
    exp: '5 Yrs Exp',
    salary: '₹35,000/mo',
    distance: '5.2 km away',
    mobile: '+91 98450 12345',
    email: 'sunita.science@gmail.com',
    tags: ['B.Ed & CTET', 'CBSE Board', 'English Medium'],
    color: 'from-[#A05AFF] to-[#C084FC]',
    badgeBg: 'bg-[#A05AFF]/10',
    badgeText: 'text-[#A05AFF]',
    badgeBorder: 'border-[#A05AFF]/25',
  },
  {
    id: 2,
    name: 'Vikram Ahuja',
    initials: 'VA',
    category: 'admin',
    role: 'School Senior Accountant',
    exp: '8 Yrs Exp',
    salary: '₹42,000/mo',
    distance: '3.8 km away',
    mobile: '+91 97110 54321',
    email: 'vikram.accounts@gmail.com',
    tags: ['Tally Prime', 'GST & TDS', 'School ERP'],
    color: 'from-[#1BCFB4] to-[#07cdae]',
    badgeBg: 'bg-[#1BCFB4]/10',
    badgeText: 'text-[#1BCFB4]',
    badgeBorder: 'border-[#1BCFB4]/25',
  },
  {
    id: 3,
    name: 'Priya Rawat',
    initials: 'PR',
    category: 'prt',
    role: 'PRT English & Social Studies',
    exp: '4 Yrs Exp',
    salary: '₹28,000/mo',
    distance: '8.0 km away',
    mobile: '+91 99234 88765',
    email: 'priya.rawat@gmail.com',
    tags: ['English Medium', 'Primary Classes', 'B.Ed (English)'],
    color: 'from-[#FE7096] to-[#ff8da9]',
    badgeBg: 'bg-[#FE7096]/10',
    badgeText: 'text-[#FE7096]',
    badgeBorder: 'border-[#FE7096]/25',
  },
  {
    id: 4,
    name: 'Rameshwar Yadav',
    initials: 'RY',
    category: 'transport',
    role: 'School Bus Driver (Heavy Vehicle)',
    exp: '11 Yrs Exp',
    salary: '₹24,000/mo',
    distance: '2.5 km away',
    mobile: '+91 98102 33445',
    email: 'rameshwar.driver@gmail.com',
    tags: ['Heavy License', 'School Bus Route Exp', 'Clean Record'],
    color: 'from-amber-500 to-orange-500',
    badgeBg: 'bg-amber-500/10',
    badgeText: 'text-amber-600',
    badgeBorder: 'border-amber-500/25',
  },
  {
    id: 5,
    name: 'Dr. Alok Sen',
    initials: 'AS',
    category: 'teaching',
    role: 'PGT Physics Specialist',
    exp: '9 Yrs Exp',
    salary: '₹55,000/mo',
    distance: '6.1 km away',
    mobile: '+91 94150 99887',
    email: 'alok.physics@gmail.com',
    tags: ['M.Sc Physics', 'JEE Mains Prep', 'ICSE & CBSE'],
    color: 'from-[#3081e4] to-[#60a5fa]',
    badgeBg: 'bg-[#3081e4]/10',
    badgeText: 'text-[#3081e4]',
    badgeBorder: 'border-[#3081e4]/25',
  },
  {
    id: 6,
    name: 'Kavita Joshi',
    initials: 'KJ',
    category: 'admin',
    role: 'Front Desk & Admission Counselor',
    exp: '6 Yrs Exp',
    salary: '₹30,000/mo',
    distance: '4.5 km away',
    mobile: '+91 98765 22114',
    email: 'kavita.admissions@gmail.com',
    tags: ['Fluent English', 'Admission CRM', 'Parent Relations'],
    color: 'from-purple-600 to-pink-600',
    badgeBg: 'bg-purple-600/10',
    badgeText: 'text-purple-600',
    badgeBorder: 'border-purple-600/25',
  },
];

export default function Landing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activePersona, setActivePersona] = useState('schools'); // 'schools' | 'applicants'
  const [activeCategory, setActiveCategory] = useState('teaching');
  const [pricingPeriod, setPricingPeriod] = useState('monthly'); // 'monthly' | 'yearly'
  const [openFaq, setOpenFaq] = useState(null);
  const [heroUnlocked, setHeroUnlocked] = useState(false);
  const [poolCategory, setPoolCategory] = useState('all');
  const [unlockedPoolCards, setUnlockedPoolCards] = useState({});

  const toggleUnlockPoolCard = (id) => {
    setUnlockedPoolCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

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
    <div className="min-h-screen bg-[#f8f9fc] text-slate-800 font-sans antialiased dark:bg-slate-950 dark:text-slate-100 selection:bg-[#A05AFF] selection:text-white">
      
      {/* ─────────────────────────────────────────────────────────────
          1. NAVIGATION BAR
      ───────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 w-full h-20 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-sm dark:bg-slate-900/90 dark:border-slate-800">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-full items-center">
            
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#A05AFF] to-[#7928CA] flex items-center justify-center text-white shadow-md shadow-[#A05AFF]/25 group-hover:scale-105 transition-transform">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-1">
                  Hire<span className="text-[#A05AFF]">Hub</span>
                </span>
                <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase -mt-1">
                  School Staff Recruitment
                </span>
              </div>
            </Link>
            
            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-1">
              {[
                { label: 'Overview', target: 'overview' },
                { label: 'For Schools', target: 'for-schools' },
                { label: 'For Job Seekers', target: 'for-candidates' },
                { label: 'Talent Pool', target: 'talent-pool' },
                { label: 'Roles', target: 'roles' },
                { label: 'Pricing', target: 'pricing' },
                { label: 'FAQ', target: 'faq' }
              ].map((item) => (
                <a 
                  key={item.target}
                  href={`#${item.target}`} 
                  onClick={(e) => handleScroll(e, item.target)}
                  className="px-3.5 py-2 text-sm font-semibold text-slate-600 hover:text-[#A05AFF] rounded-xl hover:bg-slate-100/60 transition-all dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  {item.label}
                </a>
              ))}
            </div>

            {/* CTA Portal Buttons */}
            <div className="hidden sm:flex items-center space-x-2.5">
              <Link to="/applicant/login">
                <Button variant="ghost" className="text-slate-600 hover:text-[#A05AFF] hover:bg-slate-100/70 text-xs font-semibold px-3.5 py-2 rounded-xl dark:text-slate-300 dark:hover:bg-slate-800">
                  <GraduationCap className="w-4 h-4 mr-1.5 text-[#A05AFF]" /> Candidate Login
                </Button>
              </Link>

              <Link to="/login">
                <Button variant="outline" className="border-slate-200 text-slate-700 hover:border-[#A05AFF] hover:text-[#A05AFF] hover:bg-slate-50 text-xs font-semibold px-3.5 py-2 rounded-xl dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
                  <Building2 className="w-4 h-4 mr-1.5 text-slate-500" /> School Login
                </Button>
              </Link>

              <Link to="/signup">
                <Button className="bg-[#A05AFF] hover:bg-[#8B3DFF] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md shadow-[#A05AFF]/20 transition-all">
                  Register School
                </Button>
              </Link>
            </div>

            {/* Mobile Hamburger Toggle */}
            <div className="lg:hidden flex items-center">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-600 hover:text-[#A05AFF] hover:bg-slate-100 rounded-xl transition-colors dark:text-slate-300 dark:hover:bg-slate-800"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-20 left-0 right-0 border-b border-slate-200 bg-white/95 backdrop-blur-md px-6 py-6 space-y-2 shadow-xl dark:bg-slate-900/95 dark:border-slate-800">
            {['overview', 'for-schools', 'for-candidates', 'talent-pool', 'roles', 'pricing', 'faq'].map((target) => (
              <a 
                key={target}
                href={`#${target}`} 
                onClick={(e) => handleScroll(e, target)}
                className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-[#A05AFF] transition-colors capitalize dark:text-slate-300 dark:hover:bg-slate-800"
              >
                {target.replace('-', ' ')}
              </a>
            ))}
            <div className="pt-4 border-t border-slate-100 flex flex-col gap-2.5 dark:border-slate-800">
              <Link to="/applicant/login" className="w-full">
                <Button variant="outline" className="w-full justify-center text-slate-700 border-slate-200 rounded-xl py-2.5 text-xs font-bold">
                  <GraduationCap className="w-4 h-4 mr-2 text-[#A05AFF]" /> Candidate Portal
                </Button>
              </Link>
              <Link to="/login" className="w-full">
                <Button variant="outline" className="w-full justify-center text-slate-700 border-slate-200 rounded-xl py-2.5 text-xs font-bold">
                  <Building2 className="w-4 h-4 mr-2" /> School Admin Login
                </Button>
              </Link>
              <Link to="/signup" className="w-full">
                <Button className="w-full justify-center bg-[#A05AFF] hover:bg-[#8B3DFF] text-white rounded-xl py-2.5 text-xs font-bold shadow-md">
                  Get Started Free
                </Button>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* ─────────────────────────────────────────────────────────────
          2. HERO SECTION - VIBRANT, ANIMATED & INTERACTIVE
      ───────────────────────────────────────────────────────────── */}
      <section id="overview" className="pt-24 pb-16 lg:pt-28 lg:pb-24 overflow-hidden relative">
        {/* Floating Ambient Colorful Mesh Orbs */}
        <div className="absolute top-10 left-1/4 w-[500px] h-[350px] bg-gradient-to-tr from-[#A05AFF]/25 via-[#FE7096]/20 to-[#1BCFB4]/15 blur-3xl pointer-events-none -z-10 animate-pulse-glow" />
        <div className="absolute top-40 right-10 w-[420px] h-[400px] bg-gradient-to-br from-[#1BCFB4]/25 via-[#3081e4]/15 to-transparent blur-3xl pointer-events-none -z-10 animate-float-slow" />
        <div className="absolute bottom-10 left-10 w-[380px] h-[300px] bg-gradient-to-tr from-amber-400/20 to-[#FE7096]/15 blur-3xl pointer-events-none -z-10 animate-float-reverse" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* HERO LEFT COLUMN */}
            <div className="lg:col-span-7 text-center lg:text-left">
              
              {/* Animated Floating Pill Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#A05AFF]/30 bg-gradient-to-r from-[#A05AFF]/15 via-[#FE7096]/10 to-[#1BCFB4]/15 text-slate-800 dark:text-white text-xs font-bold tracking-wide mb-6 shadow-xs backdrop-blur-md">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1BCFB4] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1BCFB4]" />
                </span>
                <Sparkles className="w-3.5 h-3.5 text-[#A05AFF]" />
                <span className="font-extrabold text-[#A05AFF]">HireHub 2.0</span>
                <span className="text-slate-400">•</span>
                <span>India's Dedicated Education Staffing Platform</span>
              </div>

              {/* Colorful Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.12] mb-6">
                Hire Top Teachers &amp; School Staff{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A05AFF] via-[#FE7096] to-[#07cdae]">
                  in Minutes.
                </span>
              </h1>

              {/* Sub-headline */}
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 mb-8 font-normal leading-relaxed">
                <strong className="text-slate-900 dark:text-white font-bold">HireHub</strong> eliminates paper biodatas and agency delays. Generate a custom QR link for walk-ins, browse 45,000+ verified educators, and match local staff with real-time GPS distance filters.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3.5 justify-center lg:justify-start mb-6">
                <Link to="/signup" className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto h-12 rounded-xl bg-gradient-to-r from-[#A05AFF] to-[#7928CA] hover:from-[#8B3DFF] hover:to-[#6820B0] text-white font-bold px-8 shadow-xl shadow-[#A05AFF]/30 transition-all text-sm flex items-center justify-center gap-2 group">
                    <Building2 className="w-4 h-4" /> Start School Free Trial
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>

                <Link to="/join" className="w-full sm:w-auto">
                  <Button variant="outline" className="w-full sm:w-auto h-12 border-slate-300 bg-white/90 backdrop-blur-sm text-slate-800 hover:border-[#A05AFF] hover:text-[#A05AFF] hover:bg-slate-50 px-7 rounded-xl font-bold transition-all text-sm flex items-center justify-center gap-2 shadow-sm dark:bg-slate-900 dark:border-slate-700 dark:text-slate-200">
                    <GraduationCap className="w-4 h-4 text-[#1BCFB4]" /> Join Free as Candidate
                  </Button>
                </Link>
              </div>

              {/* Quick Interactive Role Search Chips */}
              <div className="mb-8 flex flex-wrap items-center justify-center lg:justify-start gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1 flex items-center gap-1">
                  <Search className="w-3 h-3 text-[#A05AFF]" /> Popular:
                </span>
                {[
                  { label: '📐 PGT Maths', cat: 'teaching' },
                  { label: '🧪 TGT Science', cat: 'teaching' },
                  { label: '🚌 Bus Driver', cat: 'transport' },
                  { label: '💻 Computer / IT', cat: 'teaching' },
                  { label: '📊 School Accountant', cat: 'admin' },
                ].map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={(e) => {
                      setPoolCategory(chip.cat);
                      handleScroll(e, 'talent-pool');
                    }}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-white/90 border border-slate-200 hover:border-[#A05AFF] hover:text-[#A05AFF] text-slate-600 shadow-2xs transition-all dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-center lg:justify-start gap-y-3 gap-x-8 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#1BCFB4]" /> 14-Day Free School Access
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#1BCFB4]" /> Auto Custom QR Code
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#1BCFB4]" /> GPS Radius 5-50km Search
                </div>
              </div>

            </div>

            {/* HERO RIGHT COLUMN - LIVE INTERACTIVE MOCKUP */}
            <div className="lg:col-span-5 relative">
              <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-white/60 dark:border-slate-800 shadow-2xl p-6 dark:bg-slate-900/90 relative overflow-hidden group">
                
                {/* Decorative corner glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#A05AFF]/15 to-transparent rounded-bl-full pointer-events-none" />

                {/* Header of Mockup */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="w-3 h-3 rounded-full bg-rose-400 shadow-xs" />
                    <div className="w-3 h-3 rounded-full bg-amber-400 shadow-xs" />
                    <div className="w-3 h-3 rounded-full bg-emerald-400 shadow-xs" />
                    <span className="ml-2 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#A05AFF]" />
                      HireHub Talent Intelligence
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live System
                  </span>
                </div>

                {/* Interactive Metrics Row with Vivid Gradient Cards */}
                <div className="grid grid-cols-3 gap-2.5 my-4">
                  <div className="bg-gradient-to-br from-[#FE7096]/15 via-[#FE7096]/5 to-white border border-[#FE7096]/30 rounded-2xl p-3 dark:from-[#FE7096]/20 dark:to-slate-900">
                    <div className="text-[9px] uppercase font-bold text-slate-500">Candidates</div>
                    <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white">45,200+</div>
                    <div className="text-[10px] text-emerald-600 font-bold mt-0.5">↑ 48% this mo</div>
                  </div>

                  <div className="bg-gradient-to-br from-[#1BCFB4]/15 via-[#1BCFB4]/5 to-white border border-[#1BCFB4]/30 rounded-2xl p-3 dark:from-[#1BCFB4]/20 dark:to-slate-900">
                    <div className="text-[9px] uppercase font-bold text-slate-500">Avg. Distance</div>
                    <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white">&lt; 8.5 km</div>
                    <div className="text-[10px] text-[#1BCFB4] font-bold mt-0.5">Local campus</div>
                  </div>

                  <div className="bg-gradient-to-br from-[#A05AFF]/15 via-[#A05AFF]/5 to-white border border-[#A05AFF]/30 rounded-2xl p-3 dark:from-[#A05AFF]/20 dark:to-slate-900">
                    <div className="text-[9px] uppercase font-bold text-slate-500">Hire Speed</div>
                    <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white">2.5 Days</div>
                    <div className="text-[10px] text-[#A05AFF] font-bold mt-0.5">70% faster</div>
                  </div>
                </div>

                {/* Live Interactive Simulated Candidate Card */}
                <div className={`border rounded-2xl p-4 transition-all duration-300 mb-3 ${
                  heroUnlocked 
                    ? 'bg-gradient-to-br from-emerald-50/80 via-white to-purple-50/40 border-emerald-300 dark:bg-slate-800 dark:border-emerald-700 shadow-md'
                    : 'bg-slate-50/80 border-slate-200 hover:border-[#A05AFF]/50 dark:bg-slate-800/60 dark:border-slate-700'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#A05AFF] to-[#FE7096] text-white flex items-center justify-center font-black text-base shadow-md ${
                        heroUnlocked ? 'ring-2 ring-emerald-500' : ''
                      }`}>
                        AK
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-sm text-slate-900 dark:text-white">Ananya Kapoor</h4>
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md border border-emerald-200">
                            CTET &amp; B.Ed
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium">PGT Mathematics • 7 Yrs Exp</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-[#A05AFF] bg-[#A05AFF]/10 border border-[#A05AFF]/25 px-2.5 py-1 rounded-xl flex items-center gap-1 shadow-2xs">
                      <MapPin className="w-3 h-3 text-[#A05AFF]" /> 6.4 km away
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    <span className="text-[10px] bg-white border border-slate-200 px-2 py-0.5 rounded-md font-semibold text-slate-700 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300">CBSE &amp; ICSE</span>
                    <span className="text-[10px] bg-white border border-slate-200 px-2 py-0.5 rounded-md font-semibold text-slate-700 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300">Classes 9-12</span>
                    <span className="text-[10px] bg-white border border-slate-200 px-2 py-0.5 rounded-md font-semibold text-slate-700 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300">English Medium</span>
                    <span className="text-[10px] bg-white border border-slate-200 px-2 py-0.5 rounded-md font-semibold text-slate-700 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300">M.Sc Math</span>
                  </div>

                  {/* UNLOCKED CONTACT REVEAL BOX */}
                  {heroUnlocked ? (
                    <div className="mt-3.5 p-3 rounded-xl bg-white border border-emerald-200 dark:bg-slate-900 dark:border-emerald-800 space-y-2 animate-in fade-in zoom-in-95 duration-200">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                          📞 Mobile: <span className="text-emerald-600 font-extrabold">+91 98112 43210</span>
                        </span>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          Active on WhatsApp
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100 dark:border-slate-800">
                        <span className="text-slate-500 font-medium">✉️ ananya.kapoor@edu.in</span>
                        <span className="text-[10px] font-bold text-[#A05AFF] hover:underline cursor-pointer">
                          View Resume (PDF)
                        </span>
                      </div>
                    </div>
                  ) : null}

                  <div className="mt-3.5 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs dark:border-slate-700/60">
                    <span className="text-slate-500 font-bold text-[11px]">Exp: ₹45,000 - ₹55,000 / mo</span>
                    <Button 
                      type="button"
                      size="sm" 
                      onClick={() => setHeroUnlocked(!heroUnlocked)}
                      className={`h-8 text-[11px] font-bold rounded-xl px-3 transition-all shadow-sm ${
                        heroUnlocked 
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                          : 'bg-gradient-to-r from-[#A05AFF] to-[#FE7096] hover:from-[#8B3DFF] hover:to-[#e05b81] text-white shadow-md shadow-[#A05AFF]/25'
                      }`}
                    >
                      {heroUnlocked ? (
                        <>
                          <Check className="w-3.5 h-3.5 mr-1" /> Unlocked (Click to reset)
                        </>
                      ) : (
                        <>
                          <Unlock className="w-3.5 h-3.5 mr-1" /> Test Unlock Contact (1 Credit)
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Secondary Simulated Non-Teaching Candidate */}
                <div className="border border-slate-200/90 rounded-2xl p-3.5 bg-white dark:bg-slate-900 shadow-2xs flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-orange-500 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                      RS
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-900 dark:text-white">Rajesh Sharma</div>
                      <p className="text-[11px] text-slate-500">School Bus Driver • Heavy Vehicle (12 Yrs Exp)</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 font-bold px-2 py-0.5 rounded-lg">
                    Nearby (4.2 km)
                  </span>
                </div>

                {/* Floating QR Badge with Soft Purple Glow */}
                <div className="mt-3 p-3 bg-gradient-to-r from-[#A05AFF]/15 via-purple-50/50 to-transparent border border-[#A05AFF]/30 rounded-2xl flex items-center justify-between dark:from-[#A05AFF]/20 dark:to-transparent">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-white dark:bg-slate-800 shadow-2xs text-[#A05AFF]">
                      <QrCode className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                        Your School Walk-In QR &amp; Career Page
                      </span>
                      <span className="text-[10px] text-slate-400">hirehub.com/apply/your-school</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-[#A05AFF] font-bold bg-white dark:bg-slate-800 px-2 py-0.5 rounded-md border border-[#A05AFF]/20 shadow-2xs">
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
      <section className="bg-gradient-to-b from-white via-purple-50/20 to-white border-y border-slate-200/80 py-12 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 dark:border-slate-800 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            
            <div className="bg-white/90 backdrop-blur-sm border border-purple-100 rounded-2xl p-5 text-center shadow-xs hover:shadow-lg hover:border-[#A05AFF]/40 hover:-translate-y-1 transition-all duration-300 dark:bg-slate-900/90 dark:border-purple-950/40 group">
              <div className="w-10 h-10 rounded-xl bg-[#A05AFF]/10 text-[#A05AFF] mx-auto flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#A05AFF] to-[#7928CA] mb-1">
                1,200+
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Schools &amp; Institutes
              </div>
              <span className="text-[10px] text-emerald-600 font-semibold mt-1 inline-block">Across 28+ Cities</span>
            </div>

            <div className="bg-white/90 backdrop-blur-sm border border-cyan-100 rounded-2xl p-5 text-center shadow-xs hover:shadow-lg hover:border-[#1BCFB4]/40 hover:-translate-y-1 transition-all duration-300 dark:bg-slate-900/90 dark:border-cyan-950/40 group">
              <div className="w-10 h-10 rounded-xl bg-[#1BCFB4]/10 text-[#1BCFB4] mx-auto flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#1BCFB4] to-[#07cdae] mb-1">
                45,000+
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Verified Candidates
              </div>
              <span className="text-[10px] text-emerald-600 font-semibold mt-1 inline-block">Growing 1,500/mo</span>
            </div>

            <div className="bg-white/90 backdrop-blur-sm border border-rose-100 rounded-2xl p-5 text-center shadow-xs hover:shadow-lg hover:border-[#FE7096]/40 hover:-translate-y-1 transition-all duration-300 dark:bg-slate-900/90 dark:border-rose-950/40 group">
              <div className="w-10 h-10 rounded-xl bg-[#FE7096]/10 text-[#FE7096] mx-auto flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Briefcase className="w-5 h-5" />
              </div>
              <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FE7096] to-[#fe9496] mb-1">
                10+ Roles
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Teaching &amp; Non-Teaching
              </div>
              <span className="text-[10px] text-[#A05AFF] font-semibold mt-1 inline-block">PGT, TGT, Drivers, Accounts</span>
            </div>

            <div className="bg-white/90 backdrop-blur-sm border border-amber-100 rounded-2xl p-5 text-center shadow-xs hover:shadow-lg hover:border-amber-400/40 hover:-translate-y-1 transition-all duration-300 dark:bg-slate-900/90 dark:border-amber-950/40 group">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 mx-auto flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Star className="w-5 h-5 fill-amber-500" />
              </div>
              <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500 mb-1">
                99.2%
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Principal Satisfaction
              </div>
              <span className="text-[10px] text-emerald-600 font-semibold mt-1 inline-block">Over 18,000 Matches</span>
            </div>

          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. DUAL PERSONA VALUE PROPOSITION (SCHOOLS VS APPLICANTS)
      ───────────────────────────────────────────────────────────── */}
      <section id="for-schools" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-r from-[#A05AFF]/15 via-[#FE7096]/10 to-[#1BCFB4]/15 blur-3xl pointer-events-none -z-10 animate-pulse-glow" />

        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#A05AFF]/30 bg-gradient-to-r from-[#A05AFF]/15 via-[#FE7096]/10 to-[#1BCFB4]/15 text-[#A05AFF] text-xs font-bold uppercase tracking-wider mb-4 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5" /> Two Portals, One Seamless Ecosystem
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-4">
            Built Specifically for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A05AFF] to-[#FE7096]">
              Schools
            </span>{' '}
            &amp;{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#07cdae] to-[#1BCFB4]">
              Educators
            </span>
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base font-normal leading-relaxed">
            Whether you are a School Principal hunting for an experienced PGT Physics teacher, or an educator seeking your dream role close to home, HireHub connects both sides effortlessly.
          </p>

          {/* Animated Toggle Switch */}
          <div className="mt-8 inline-flex p-1.5 rounded-2xl bg-slate-200/90 dark:bg-slate-800 shadow-inner">
            <button
              onClick={() => setActivePersona('schools')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 ${
                activePersona === 'schools'
                  ? 'bg-gradient-to-r from-[#A05AFF] to-[#7928CA] text-white shadow-lg shadow-[#A05AFF]/30 scale-102'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
              }`}
            >
              <Building2 className="w-4 h-4" /> For Schools &amp; Colleges
            </button>
            <button
              onClick={() => setActivePersona('applicants')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 ${
                activePersona === 'applicants'
                  ? 'bg-gradient-to-r from-[#1BCFB4] to-[#07cdae] text-white shadow-lg shadow-[#1BCFB4]/30 scale-102'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
              }`}
            >
              <GraduationCap className="w-4 h-4" /> For Teachers &amp; Staff
            </button>
          </div>
        </div>

        {/* Dynamic Persona Content */}
        {activePersona === 'schools' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            
            <div className="bg-white/90 backdrop-blur-md rounded-3xl p-7 border border-slate-200/90 shadow-sm hover:shadow-2xl hover:border-[#A05AFF]/40 hover:-translate-y-2 transition-all duration-300 dark:bg-slate-900/90 dark:border-slate-800 group relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#A05AFF] to-[#C084FC]" />
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#A05AFF]/20 to-[#A05AFF]/5 text-[#A05AFF] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-xs">
                <QrCode className="w-7 h-7" />
              </div>
              <div className="inline-block text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-[#A05AFF]/10 text-[#A05AFF] mb-3">
                Zero Friction Intake
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2.5">
                Custom Career Link &amp; QR Code
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-normal leading-relaxed mb-6">
                Get an instant dedicated application URL (e.g. <code>hirehub.com/apply/your-school</code>) and high-res printable QR code. Put it on your website, school entrance, or newspaper ads. Walk-in candidates scan and apply directly to your internal database!
              </p>
              <ul className="space-y-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#1BCFB4] shrink-0" /> Zero duplicate resumes &amp; paper mess</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#1BCFB4] shrink-0" /> Auto-collect B.Ed, Medium &amp; Experience</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#1BCFB4] shrink-0" /> Real-time mobile applicant alerts</li>
              </ul>
            </div>

            <div className="bg-white/90 backdrop-blur-md rounded-3xl p-7 border-2 border-[#A05AFF]/50 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative dark:bg-slate-900/90 group overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#A05AFF] via-[#FE7096] to-[#1BCFB4]" />
              <div className="absolute top-5 right-5 bg-gradient-to-r from-[#A05AFF] to-[#FE7096] text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                ⚡ Highest Retention
              </div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#1BCFB4]/20 to-[#1BCFB4]/5 text-[#1BCFB4] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-xs">
                <MapPin className="w-7 h-7" />
              </div>
              <div className="inline-block text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-[#1BCFB4]/15 text-[#07cdae] mb-3">
                Radius Proximity Tech
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2.5">
                Geo-Radius Proximity Search
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-normal leading-relaxed mb-6">
                Staff turnover is highest when teachers commute long distances. With HireHub's interactive radius filter, search the global Talent Pool within 5 km, 15 km, or 30 km of your school campus. Find verified teachers living right in your neighborhood!
              </p>
              <ul className="space-y-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#1BCFB4] shrink-0" /> Interactive map-based radius slider</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#1BCFB4] shrink-0" /> Filter by expected salary &amp; notice period</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#1BCFB4] shrink-0" /> Local staff stay 3x longer on average</li>
              </ul>
            </div>

            <div className="bg-white/90 backdrop-blur-md rounded-3xl p-7 border border-slate-200/90 shadow-sm hover:shadow-2xl hover:border-[#FE7096]/40 hover:-translate-y-2 transition-all duration-300 dark:bg-slate-900/90 dark:border-slate-800 group relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#FE7096] to-amber-400" />
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#FE7096]/20 to-[#FE7096]/5 text-[#FE7096] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-xs">
                <Coins className="w-7 h-7" />
              </div>
              <div className="inline-block text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-[#FE7096]/15 text-[#FE7096] mb-3">
                No Agency Markups
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2.5">
                Credit Unlock &amp; In-House Pipeline
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-normal leading-relaxed mb-6">
                Manage your candidates through stages: Applied, Shortlisted, Interview Scheduled, Selected. Want to tap into external talent? Spend flexible credits only to unlock phone and email details—no expensive agency commissions!
              </p>
              <ul className="space-y-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#1BCFB4] shrink-0" /> Flexible pay-as-you-go credit packs</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#1BCFB4] shrink-0" /> Candidate interview logs &amp; rating scorecards</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#1BCFB4] shrink-0" /> Save up to ₹1,50,000 per hiring season</li>
              </ul>
            </div>

          </div>
        ) : (
          <div id="for-candidates" className="grid grid-cols-1 md:grid-cols-3 gap-7">
            
            <div className="bg-white/90 backdrop-blur-md rounded-3xl p-7 border border-slate-200/90 shadow-sm hover:shadow-2xl hover:border-[#1BCFB4]/40 hover:-translate-y-2 transition-all duration-300 dark:bg-slate-900/90 dark:border-slate-800 group relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#1BCFB4] to-[#07cdae]" />
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#1BCFB4]/20 to-[#1BCFB4]/5 text-[#1BCFB4] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-xs">
                <FileText className="w-7 h-7" />
              </div>
              <div className="inline-block text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-[#1BCFB4]/15 text-[#07cdae] mb-3">
                100% Free Forever
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2.5">
                Specialized Teacher &amp; Staff Biodata
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-normal leading-relaxed mb-6">
                Generic job portals don't understand school hiring. HireHub lets you showcase your exact teaching medium (English, Hindi), board exposure (CBSE, ICSE, State), classes you teach (Primary to Sr. Secondary), and B.Ed/CTET credentials.
              </p>
              <ul className="space-y-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#1BCFB4] shrink-0" /> 100% Free candidate profile &amp; search ranking</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#1BCFB4] shrink-0" /> One-click printable PDF resume generation</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#1BCFB4] shrink-0" /> Showcase subject mastery &amp; teaching samples</li>
              </ul>
            </div>

            <div className="bg-white/90 backdrop-blur-md rounded-3xl p-7 border-2 border-[#1BCFB4]/50 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative dark:bg-slate-900/90 group overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#1BCFB4] via-[#A05AFF] to-[#FE7096]" />
              <div className="absolute top-5 right-5 bg-gradient-to-r from-[#1BCFB4] to-[#07cdae] text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                Direct Calls
              </div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#A05AFF]/20 to-[#A05AFF]/5 text-[#A05AFF] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-xs">
                <PhoneCall className="w-7 h-7" />
              </div>
              <div className="inline-block text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-[#A05AFF]/10 text-[#A05AFF] mb-3">
                Zero Middlemen
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2.5">
                Get Discovered by Top Schools
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-normal leading-relaxed mb-6">
                Once your profile is in the HireHub Talent Pool, reputed schools searching within your locality can discover your profile, express interest, and invite you for interviews directly to your phone and email.
              </p>
              <ul className="space-y-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#1BCFB4] shrink-0" /> Direct WhatsApp &amp; phone interview calls</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#1BCFB4] shrink-0" /> Live notifications on school shortlist events</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#1BCFB4] shrink-0" /> Zero agent fees or cut from your salary</li>
              </ul>
            </div>

            <div className="bg-white/90 backdrop-blur-md rounded-3xl p-7 border border-slate-200/90 shadow-sm hover:shadow-2xl hover:border-[#FE7096]/40 hover:-translate-y-2 transition-all duration-300 dark:bg-slate-900/90 dark:border-slate-800 group relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#FE7096] to-[#A05AFF]" />
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#FE7096]/20 to-[#FE7096]/5 text-[#FE7096] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-xs">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div className="inline-block text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-[#FE7096]/15 text-[#FE7096] mb-3">
                Bank-Grade Security
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2.5">
                Verified Cloud Document Vault
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-normal leading-relaxed mb-6">
                Securely store your degrees, marksheets, experience certificates, and Aadhaar/ID documents in your private vault powered by ImageKit. Share them only with authorized schools with full consent controls.
              </p>
              <ul className="space-y-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#1BCFB4] shrink-0" /> High-speed watermarked document preview</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#1BCFB4] shrink-0" /> Privacy controls to hide phone from unknown schools</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#1BCFB4] shrink-0" /> Verified badge upon degree inspection</li>
              </ul>
            </div>

          </div>
        )}

      </section>

      {/* ─────────────────────────────────────────────────────────────
          4B. TALENT POOL LIVE SEARCH SHOWCASE - INTERACTIVE & COLORFUL
      ───────────────────────────────────────────────────────────── */}
      <section id="talent-pool" className="py-20 bg-gradient-to-b from-white via-slate-50/70 to-white border-y border-slate-200/80 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 dark:border-slate-800 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#A05AFF]/30 bg-gradient-to-r from-[#A05AFF]/15 via-[#FE7096]/10 to-[#1BCFB4]/15 text-[#A05AFF] text-xs font-bold uppercase tracking-wider mb-3">
              <Search className="w-3.5 h-3.5" /> Direct Access to 45,000+ Verified Profiles
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white mb-3">
              Explore the Local Talent Pool
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
              Filter by subject, teaching board, experience, and campus distance. Free to browse and shortlist — test the live unlock below!
            </p>

            {/* Interactive Category Filter Pills */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
              {[
                { id: 'all', label: 'All Roles (45k+)' },
                { id: 'teaching', label: 'PGT / TGT Teachers' },
                { id: 'prt', label: 'PRT & Primary' },
                { id: 'transport', label: 'Transport & Drivers' },
                { id: 'admin', label: 'Accounts & Front Office' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setPoolCategory(tab.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 shadow-2xs ${
                    poolCategory === tab.id
                      ? 'bg-[#A05AFF] text-white shadow-md shadow-[#A05AFF]/25 scale-105'
                      : 'bg-white border border-slate-200 text-slate-700 hover:border-[#A05AFF] hover:text-[#A05AFF] dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Filtered Candidate Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CANDIDATES_DATA.filter(
              (c) => poolCategory === 'all' || c.category === poolCategory
            ).map((cand) => {
              const isUnlocked = Boolean(unlockedPoolCards[cand.id]);

              return (
                <div
                  key={cand.id}
                  className={`rounded-2xl p-5 border transition-all duration-300 flex flex-col justify-between ${
                    isUnlocked
                      ? 'bg-gradient-to-br from-emerald-50/70 via-white to-purple-50/30 border-emerald-300 shadow-lg dark:bg-slate-800 dark:border-emerald-700'
                      : 'bg-white border-slate-200/90 shadow-sm hover:shadow-xl hover:border-[#A05AFF]/40 hover:-translate-y-1 dark:bg-slate-900 dark:border-slate-800'
                  }`}
                >
                  <div>
                    {/* Header Row */}
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${cand.color} text-white font-black text-sm flex items-center justify-center shadow-md`}
                        >
                          {cand.initials}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                            {cand.name}
                            {isUnlocked && (
                              <span className="text-[10px] text-emerald-600 font-extrabold bg-emerald-100 px-1.5 py-0.2 rounded">
                                Verified
                              </span>
                            )}
                          </h4>
                          <p className="text-xs text-slate-500 font-medium">{cand.role}</p>
                        </div>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full border flex items-center gap-1 ${cand.badgeBg} ${cand.badgeText} ${cand.badgeBorder}`}
                      >
                        <MapPin className="w-3 h-3" /> {cand.distance}
                      </span>
                    </div>

                    {/* Skill Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-3 text-[10px]">
                      {cand.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md font-semibold text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300"
                        >
                          {tag}
                        </span>
                      ))}
                      <span className="bg-purple-50 border border-purple-200 text-[#A05AFF] px-2 py-0.5 rounded-md font-bold">
                        {cand.exp}
                      </span>
                    </div>

                    {/* Revealed Contact Details Box if unlocked */}
                    {isUnlocked && (
                      <div className="p-3 mb-3 rounded-xl bg-white/90 border border-emerald-200 text-xs space-y-1.5 dark:bg-slate-900/90 dark:border-emerald-800 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between font-bold">
                          <span className="text-slate-700 dark:text-slate-200">📞 {cand.mobile}</span>
                          <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            WhatsApp Ready
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium">✉️ {cand.email}</div>
                      </div>
                    )}
                  </div>

                  {/* Footer Row */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-600 dark:text-slate-400 text-[11px]">
                      {cand.salary}
                    </span>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => toggleUnlockPoolCard(cand.id)}
                      className={`h-8 text-[11px] font-bold rounded-xl px-3 transition-all ${
                        isUnlocked
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          : 'bg-gradient-to-r from-[#A05AFF] to-[#FE7096] hover:from-[#8B3DFF] hover:to-[#e05b81] text-white shadow-md shadow-[#A05AFF]/20'
                      }`}
                    >
                      {isUnlocked ? (
                        <>
                          <Check className="w-3.5 h-3.5 mr-1" /> Unlocked (Click to hide)
                        </>
                      ) : (
                        <>
                          <Unlock className="w-3.5 h-3.5 mr-1" /> Test Unlock (1 Credit)
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick CTA Box below Talent Pool */}
          <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-[#A05AFF]/10 via-[#FE7096]/10 to-[#1BCFB4]/10 border border-[#A05AFF]/25 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Want to search candidates within 5km of your specific campus?
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Register your school and get 10 free unlock credits instantly to try HireHub with zero commitment.
              </p>
            </div>
            <Link to="/signup" className="shrink-0">
              <Button className="h-10 px-5 rounded-xl bg-[#A05AFF] hover:bg-[#8B3DFF] text-white font-bold text-xs shadow-md shadow-[#A05AFF]/25">
                Start 14-Day Free School Trial <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </Link>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. ROLE-SPECIFIC HIRING COVERAGE (TEACHING & NON-TEACHING)
      ───────────────────────────────────────────────────────────── */}
      <section id="roles" className="py-24 bg-gradient-to-b from-slate-50 via-purple-50/20 to-slate-50 border-y border-slate-200/80 dark:from-slate-900/50 dark:via-purple-950/10 dark:to-slate-900/50 dark:border-slate-800 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#A05AFF]/30 bg-[#A05AFF]/10 text-[#A05AFF] text-xs font-bold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5" /> Comprehensive Campus Staffing
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-4">
              One Hub For{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A05AFF] via-[#FE7096] to-[#1BCFB4]">
                Every School Role
              </span>
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base font-normal leading-relaxed">
              Schools require much more than just subject teachers. HireHub includes purpose-built forms, filters, and qualification checklists for every educational and operational position.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <BookOpen className="w-6 h-6 text-[#A05AFF]" />,
                iconBg: "bg-[#A05AFF]/10",
                count: "18,400+ Candidates",
                role: "Teaching Faculty",
                items: "PGT, TGT, PRT, Pre-Primary, Subject Specialists (Maths, Science, Languages), B.Ed/M.Ed, CTET qualified.",
                gradient: "from-[#A05AFF]/10 via-transparent to-transparent",
                borderHover: "hover:border-[#A05AFF]/50"
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
                icon: <ShieldCheck className="w-6 h-6 text-[#A05AFF]" />,
                iconBg: "bg-[#A05AFF]/10",
                count: "6,200+ Personnel",
                role: "Campus Security & Staff",
                items: "Ex-servicemen, Day/Night security guards, Peons, Housekeeping supervisors, and verified Caretakers.",
                gradient: "from-[#A05AFF]/10 via-transparent to-transparent",
                borderHover: "hover:border-[#A05AFF]/50"
              }
            ].map((card, idx) => (
              <div 
                key={idx} 
                className={`bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-slate-200/90 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 dark:bg-slate-900/90 dark:border-slate-800 ${card.borderHover} relative overflow-hidden group`}
              >
                <div className={`absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl ${card.gradient} rounded-bl-full pointer-events-none group-hover:scale-125 transition-transform duration-300`} />
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-2xl ${card.iconBg} flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform`}>
                    {card.icon}
                  </div>
                  <span className="text-[10px] font-black text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                    {card.count}
                  </span>
                </div>
                <h3 className="font-black text-slate-900 text-base mb-2 dark:text-white">
                  {card.role}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                  {card.items}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6. HOW HIREHUB WORKS (4-STEP WORKFLOW)
      ───────────────────────────────────────────────────────────── */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#1BCFB4]/30 bg-[#1BCFB4]/10 text-[#07cdae] text-xs font-bold uppercase tracking-wider mb-4">
            <Zap className="w-3.5 h-3.5" /> Simplicity at Scale
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-4">
            How HireHub Works for Schools
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base">
            Transition from messy paper biodatas and chaotic WhatsApp groups to a high-speed, centralized digital hiring engine.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {[
            {
              step: "01",
              title: "Create School Profile",
              desc: "Register in under 2 minutes. Pin your campus location on the map and set your preferred hiring radius.",
              gradient: "from-[#A05AFF] to-[#7928CA]"
            },
            {
              step: "02",
              title: "Publish Career QR Link",
              desc: "Share your dedicated school application link on job ads and campus gates. All applicants flow into your private dashboard.",
              gradient: "from-[#FE7096] to-[#ff8da9]"
            },
            {
              step: "03",
              title: "Search the Talent Pool",
              desc: "Need an immediate replacement? Query 45,000+ active candidates by subject, board experience, and distance.",
              gradient: "from-[#1BCFB4] to-[#07cdae]"
            },
            {
              step: "04",
              title: "Unlock & Interview",
              desc: "Use flexible credits to instantly reveal candidate contact details and schedule interviews in one click.",
              gradient: "from-[#3081e4] to-[#A05AFF]"
            }
          ].map((item, idx) => (
            <div 
              key={idx} 
              className="bg-white/95 backdrop-blur-md rounded-3xl p-7 border border-slate-200/90 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative dark:bg-slate-900/95 dark:border-slate-800 group overflow-hidden"
            >
              <div className="flex items-center justify-between mb-5">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${item.gradient} text-white font-black text-base flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                  {item.step}
                </div>
                <span className="text-xs font-bold text-slate-300 dark:text-slate-700">Step {idx + 1} of 4</span>
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-2 dark:text-white">{item.title}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6B. SOCIAL PROOF & TESTIMONIALS FROM PRINCIPALS & SCHOOLS
      ───────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-b from-white via-slate-50 to-white border-y border-slate-200/80 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:border-slate-800 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-amber-400/40 bg-amber-400/10 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-4">
              <Star className="w-3.5 h-3.5 fill-current" /> Trusted by 350+ Educational Institutions
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-4">
              Loved by Principals &amp; Trustees Across India
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
              See how schools are cutting recruitment time by 70% and hiring verified staff living right in their locality.
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
                gradient: "from-[#A05AFF] to-[#FE7096]"
              },
              {
                quote: "The GPS distance filter is a lifesaver. We found a qualified PGT Physics and Chemistry teacher living just 4 km away. They joined within 3 days without commute issues!",
                name: "Sister Mary D'Souza",
                role: "Headmistress",
                school: "St. Xavier's Convent High School",
                rating: 5,
                tag: "Hired in 3 Days",
                avatar: "MD",
                gradient: "from-[#1BCFB4] to-[#07cdae]"
              },
              {
                quote: "We used to pay agencies ₹30,000 per teacher. With HireHub's Credit system, we unlocked 20 candidate contacts and finalized 6 top staff at 90% lower cost.",
                name: "Arun Sharma",
                role: "Managing Trustee",
                school: "Ryan International Group of Schools",
                rating: 5,
                tag: "Saved ₹1.8 Lakhs",
                avatar: "AS",
                gradient: "from-[#FE7096] to-amber-500"
              }
            ].map((review, idx) => (
              <div 
                key={idx} 
                className="bg-white/95 rounded-3xl p-7 border border-slate-200/90 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 dark:bg-slate-900/95 dark:border-slate-800 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400" />
                      ))}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                      {review.tag}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed italic mb-6">
                    "{review.quote}"
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${review.gradient} text-white font-black text-sm flex items-center justify-center shadow-md`}>
                    {review.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">{review.name}</h4>
                    <p className="text-[11px] text-slate-500 font-medium">{review.role} • {review.school}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          7. PRICING TIERS - WITH DYNAMIC MONTHLY / YEARLY TOGGLE
      ───────────────────────────────────────────────────────────── */}
      <section id="pricing" className="py-24 bg-slate-50/80 border-t border-slate-200/80 dark:bg-slate-900/30 dark:border-slate-800 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#A05AFF]/30 bg-[#A05AFF]/10 text-[#A05AFF] text-xs font-bold uppercase tracking-wider mb-4">
              <Coins className="w-3.5 h-3.5" /> Transparent &amp; Affordable
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-4">
              Plans Built for Every School Size
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
              All plans include your custom QR application page. Upgrade anytime or purchase additional talent unlock credits as needed.
            </p>

            {/* Interactive Billing Toggle */}
            <div className="mt-8 inline-flex items-center gap-3 p-1.5 rounded-2xl bg-white border border-slate-200 shadow-sm dark:bg-slate-900 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setPricingPeriod('monthly')}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                  pricingPeriod === 'monthly'
                    ? 'bg-[#A05AFF] text-white shadow-md shadow-[#A05AFF]/25'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
                }`}
              >
                Monthly Billing
              </button>
              <button
                type="button"
                onClick={() => setPricingPeriod('yearly')}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  pricingPeriod === 'yearly'
                    ? 'bg-[#A05AFF] text-white shadow-md shadow-[#A05AFF]/25'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
                }`}
              >
                <span>Annual Billing</span>
                <span className="text-[10px] bg-emerald-500 text-white font-black px-2 py-0.5 rounded-full">
                  SAVE 20%
                </span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
            
            {/* PLAN 1: Starter */}
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-300 dark:bg-slate-900 dark:border-slate-800">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Starter Trial</span>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-5xl font-black text-slate-900 dark:text-white">Free</span>
                  <span className="text-xs text-slate-400 font-semibold">/ 14 Days</span>
                </div>
                <p className="text-xs text-slate-500 mt-2 mb-6 font-medium">
                  Perfect for schools wanting to test digital candidate intake.
                </p>

                <div className="space-y-3.5 mb-8">
                  {[
                    "Up to 50 In-House Candidates",
                    "Dedicated QR Code & Application Link",
                    "Basic Radius & Subject Filters",
                    "10 Free Talent Pool Unlock Credits",
                    "Standard Document Viewer"
                  ].map((feat, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-300 font-medium">
                      <Check className="w-4 h-4 text-[#1BCFB4] shrink-0" />
                      {feat}
                    </div>
                  ))}
                </div>
              </div>

              <Link to="/signup" className="w-full">
                <Button variant="outline" className="w-full h-12 border-slate-300 text-slate-700 hover:text-[#A05AFF] hover:border-[#A05AFF] rounded-xl font-bold text-xs">
                  Start Free 14-Day Trial
                </Button>
              </Link>
            </div>

            {/* PLAN 2: School Pro (Popular - Glowing Card) */}
            <div className="bg-white rounded-3xl border-2 border-[#A05AFF] p-8 shadow-2xl flex flex-col justify-between relative dark:bg-slate-900 ring-4 ring-[#A05AFF]/15 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#A05AFF] to-[#FE7096] text-white text-[10px] font-black uppercase tracking-wider px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" /> Most Popular for Standalone Schools
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#A05AFF]">School Pro</span>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-5xl font-black text-slate-900 dark:text-white">
                    {pricingPeriod === 'yearly' ? '₹1,999' : '₹2,499'}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">
                    / month {pricingPeriod === 'yearly' && '(billed annually)'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-2 mb-6 font-medium">
                  Complete hiring infrastructure for standalone K-12 schools.
                </p>

                <div className="space-y-3.5 mb-8">
                  {[
                    "Unlimited In-House Candidate Storage",
                    "Custom Branded School Career URL & QR",
                    "GPS Map Radius Search (up to 50 km)",
                    "100 Monthly Talent Pool Unlock Credits",
                    "Automatic Duplicate Phone Detection",
                    "Printable Biodata & PDF Export",
                    "Priority WhatsApp & Email Support"
                  ].map((feat, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-xs text-slate-900 dark:text-slate-100 font-bold">
                      <CheckCircle2 className="w-4 h-4 text-[#1BCFB4] shrink-0" />
                      {feat}
                    </div>
                  ))}
                </div>
              </div>

              <Link to="/signup" className="w-full">
                <Button className="w-full h-12 bg-gradient-to-r from-[#A05AFF] to-[#7928CA] hover:from-[#8B3DFF] hover:to-[#6820B0] text-white rounded-xl font-bold text-xs shadow-xl shadow-[#A05AFF]/30 group flex items-center justify-center gap-2">
                  <span>Get Started with Pro</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            {/* PLAN 3: Multi-Campus Enterprise */}
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-300 dark:bg-slate-900 dark:border-slate-800">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Institutional Group</span>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-5xl font-black text-slate-900 dark:text-white">Custom</span>
                  <span className="text-xs text-slate-400 font-semibold">/ annual</span>
                </div>
                <p className="text-xs text-slate-500 mt-2 mb-6 font-medium">
                  For school chains, multi-branch trusts, and universities.
                </p>

                <div className="space-y-3.5 mb-8">
                  {[
                    "Multiple Campus Tenants & Logins",
                    "Shared Regional Talent Pool Access",
                    "Bulk Candidate Excel / CSV Importer",
                    "Bulk Credit Packages at Wholesale Rates",
                    "Custom Role & Subject Configuration",
                    "Dedicated Account Manager & SLA"
                  ].map((feat, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-300 font-medium">
                      <Check className="w-4 h-4 text-[#1BCFB4] shrink-0" />
                      {feat}
                    </div>
                  ))}
                </div>
              </div>

              <Link to="/contact" className="w-full">
                <Button variant="outline" className="w-full h-12 border-slate-300 text-slate-700 hover:text-[#A05AFF] hover:border-[#A05AFF] rounded-xl font-bold text-xs">
                  Talk to Institutional Sales
                </Button>
              </Link>
            </div>

          </div>

          {/* Job Seeker Info Banner */}
          <div className="mt-14 bg-gradient-to-r from-emerald-50 via-teal-50/50 to-purple-50/40 rounded-3xl border border-emerald-200/80 p-6 sm:p-8 max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left dark:bg-slate-900 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#1BCFB4] text-white flex items-center justify-center font-bold shadow-md shadow-[#1BCFB4]/25 shrink-0">
                <GraduationCap className="w-7 h-7" />
              </div>
              <div>
                <div className="font-black text-slate-900 text-base dark:text-white">Are you a Teacher or Job Seeker?</div>
                <div className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-0.5">Creating your profile, uploading documents, and receiving interview calls is 100% Free!</div>
              </div>
            </div>
            <Link to="/join" className="shrink-0">
              <Button className="bg-[#1BCFB4] hover:bg-[#16B59D] text-white font-bold text-xs rounded-xl px-6 h-11 shadow-md shadow-[#1BCFB4]/25">
                Register Free as Candidate
              </Button>
            </Link>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          8. FREQUENTLY ASKED QUESTIONS (FAQ)
      ───────────────────────────────────────────────────────────── */}
      <section id="faq" className="py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-slate-200 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 text-xs font-bold uppercase tracking-wider mb-3 shadow-2xs">
            <HelpCircle className="w-3.5 h-3.5 text-[#A05AFF]" /> Clear Answers
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-500 text-sm">
            Everything you need to know about HireHub for schools and educators.
          </p>
        </div>

        <div className="space-y-4">
          {[
            {
              q: "What is HireHub and how does it help schools?",
              a: "HireHub is a specialized education recruitment SaaS. It replaces paper biodatas and scattered emails with a clean digital applicant tracking system. Every school gets a custom career link and QR code, plus access to a shared verified candidate talent pool with geo-radius distance matching."
            },
            {
              q: "How does the custom QR Code & Application link work?",
              a: "Once registered, your school is assigned a unique URL (e.g., hirehub.com/apply/delhi-public-school) and a downloadable QR code. You can print this on school banners, notice boards, or newspaper job ads. When applicants fill out the form on their phone, their details directly land in your private 'My Candidates' dashboard."
            },
            {
              q: "What is the difference between 'My Candidates' and 'Talent Pool'?",
              a: "'My Candidates' contains all applicants who applied directly to your school through your link or whom you entered manually. They are 100% private to your school. The 'Talent Pool' is a shared verified database of job seekers across your state/city that you can search and unlock using credits."
            },
            {
              q: "How does the Credit System work?",
              a: "In the Talent Pool, schools can view candidate qualifications, experience, teaching board, and distance for free. To see their phone number, email, and download their full resume/documents, you use 1 credit. This eliminates expensive recruitment agency commissions."
            },
            {
              q: "Is HireHub free for teachers and job seekers?",
              a: "Yes! Candidates can register, build their teaching or non-teaching profile, upload experience certificates, and receive interview invitations from schools completely free of charge."
            },
            {
              q: "Can we bulk import our existing Excel or CSV candidate records?",
              a: "Yes. HireHub includes an automated Bulk Import module that parses Excel (.xlsx) and CSV files, sanitizes phone numbers, and maps all teaching and non-teaching columns automatically."
            }
          ].map((item, idx) => (
            <div 
              key={idx} 
              className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs transition-all dark:bg-slate-900 dark:border-slate-800"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full px-6 py-4.5 text-left flex justify-between items-center text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200 hover:text-[#A05AFF] transition-colors"
              >
                <span>{item.q}</span>
                <ChevronRight 
                  className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                    openFaq === idx ? 'rotate-90 text-[#A05AFF]' : ''
                  }`} 
                />
              </button>
              {openFaq === idx && (
                <div className="px-6 pb-5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 pt-4 dark:border-slate-800 animate-in fade-in duration-200">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          9. HIGH IMPACT COLORFUL BOTTOM CTA BANNER
      ───────────────────────────────────────────────────────────── */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="rounded-3xl bg-gradient-to-r from-[#A05AFF] via-[#FE7096] to-[#7928CA] p-10 sm:p-16 text-center text-white shadow-2xl relative overflow-hidden group">
          
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
              Join 350+ forward-thinking schools saving 20+ hours each week. Start your 14-day free trial or create your verified educator biodata now.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Link to="/signup" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto h-13 bg-white text-slate-900 hover:bg-slate-100 font-black px-9 rounded-2xl text-sm shadow-xl hover:scale-105 transition-all">
                  <Building2 className="w-4 h-4 mr-2 text-[#A05AFF]" /> Register Your School Free
                </Button>
              </Link>
              <Link to="/join" className="w-full sm:w-auto">
                <Button variant="ghost" className="w-full sm:w-auto h-13 bg-white/15 hover:bg-white/25 text-white font-bold px-8 rounded-2xl text-sm border border-white/30 backdrop-blur-md">
                  <GraduationCap className="w-4 h-4 mr-2" /> Apply as Candidate
                </Button>
              </Link>
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
                <CheckCircle2 className="w-4 h-4 text-emerald-300" /> 10 Free Unlock Credits Included
              </span>
            </div>

          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          10. FOOTER
      ───────────────────────────────────────────────────────────── */}
      <footer className="bg-white border-t border-slate-200 py-14 dark:bg-slate-900 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
            
            {/* Brand column */}
            <div className="md:col-span-4 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#A05AFF] to-[#7928CA] flex items-center justify-center text-white shadow-sm">
                  <Briefcase className="w-4 h-4" />
                </div>
                <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                  Hire<span className="text-[#A05AFF]">Hub</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed font-medium max-w-sm">
                HireHub is India's dedicated recruitment operating system for educational institutions. Connecting schools with top-tier teaching and administrative talent seamlessly.
              </p>
            </div>

            {/* Quick Links */}
            <div className="md:col-span-3 space-y-2.5 text-xs text-slate-600 dark:text-slate-400 font-semibold">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Platform Portals</div>
              <div><Link to="/login" className="hover:text-[#A05AFF] transition-colors">School Admin Login</Link></div>
              <div><Link to="/signup" className="hover:text-[#A05AFF] transition-colors">School Registration</Link></div>
              <div><Link to="/applicant/login" className="hover:text-[#A05AFF] transition-colors">Candidate / Teacher Login</Link></div>
              <div><Link to="/join" className="hover:text-[#A05AFF] transition-colors">Candidate Self-Registration</Link></div>
            </div>

            {/* Features */}
            <div className="md:col-span-2 space-y-2.5 text-xs text-slate-600 dark:text-slate-400 font-semibold">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Features</div>
              <div><a href="#for-schools" className="hover:text-[#A05AFF] transition-colors">QR Application Links</a></div>
              <div><a href="#for-schools" className="hover:text-[#A05AFF] transition-colors">Geo-Radius Search</a></div>
              <div><a href="#roles" className="hover:text-[#A05AFF] transition-colors">10+ School Roles</a></div>
              <div><a href="#pricing" className="hover:text-[#A05AFF] transition-colors">Plans &amp; Credits</a></div>
            </div>

            {/* Contact Info */}
            <div className="md:col-span-3 space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Support &amp; Inquiries</div>
              <p className="text-xs text-slate-500 font-medium">Need institutional setup help or custom enterprise plans?</p>
              <div className="font-semibold text-slate-700 dark:text-slate-300">
                Email: support@hirehub.edu
              </div>
              <div className="font-semibold text-slate-700 dark:text-slate-300">
                Mon - Sat: 9:00 AM - 6:00 PM IST
              </div>
            </div>

          </div>

          <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-medium text-slate-400 dark:border-slate-800">
            <div>&copy; {new Date().getFullYear()} HireHub Technologies. All rights reserved.</div>
            <div className="flex gap-6">
              <Link to="/privacy" className="hover:text-[#A05AFF] transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-[#A05AFF] transition-colors">Terms of Service</Link>
              <Link to="/contact" className="hover:text-[#A05AFF] transition-colors">Contact Support</Link>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}