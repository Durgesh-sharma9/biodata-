import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { 
  Database, 
  Search, 
  SlidersHorizontal, 
  FileText, 
  School, 
  ShieldCheck, 
  ArrowRight, 
  Check, 
  Sparkles, 
  Users, 
  Menu,
  X,
  Target,
  Clock,
  Unlock,
  Coins,
  List,
  Briefcase
} from 'lucide-react';

export default function Landing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Intersection Observer for scroll-driven animations and fade-in effects
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.15,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
        }
      });
    }, observerOptions);

    const animatedElements = document.querySelectorAll(
      '.reveal-left, .reveal-right, .reveal-up, .reveal-scale, .reveal-fade'
    );
    animatedElements.forEach((el) => observer.observe(el));

    return () => {
      animatedElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  // Smooth Scroll with accurate offset calculation
  const handleScroll = (e, id) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // Navbar height
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

  return (
    <div className="min-h-screen bg-[#f3f3f4] text-slate-800 font-sans antialiased dark:bg-slate-950 dark:text-slate-200">
      
      <style>{`
        html { scroll-behavior: smooth; scroll-padding-top: 80px; }
        .reveal-left { opacity: 0; transform: translateX(-40px); transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1); will-change: transform, opacity; }
        .reveal-right { opacity: 0; transform: translateX(40px); transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1); will-change: transform, opacity; }
        .reveal-up { opacity: 0; transform: translateY(40px); transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1); will-change: transform, opacity; }
        .reveal-scale { opacity: 0; transform: scale(0.95); transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1); will-change: transform, opacity; }
        .reveal-fade { opacity: 0; transition: opacity 1s cubic-bezier(0.16, 1, 0.3, 1); }
        .reveal-visible { opacity: 1; transform: translate(0) scale(1); }
      `}</style>

      {/* FIXED NAVBAR NAVIGATION */}
      <nav className="fixed top-0 left-0 right-0 z-[100] w-full h-20 border-b border-slate-100 bg-white shadow-sm dark:bg-slate-900 dark:border-slate-800">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-full items-center">
            
            {/* Logo */}
            <div className="flex items-center gap-2 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <span className="text-xl font-bold tracking-tight text-[#A05AFF]">
                EduBase
              </span>
            </div>
            
            {/* Desktop Navigation links */}
            <div className="hidden md:flex items-center space-x-1">
              {[
                { label: 'Home', target: 'home' },
                { label: 'Features', target: 'features' },
                { label: 'Process', target: 'how-it-works' },
                { label: 'Pricing', target: 'pricing' },
                { label: 'Contact', target: 'contact' }
              ].map((item) => (
                <a 
                  key={item.target}
                  href={`#${item.target}`} 
                  onClick={(e) => handleScroll(e, item.target)}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-[#A05AFF] rounded-xl hover:bg-slate-50 transition-all dark:text-slate-400 dark:hover:bg-slate-800"
                >
                  {item.label}
                </a>
              ))}
            </div>

            {/* CTA Interaction Nodes */}
            <div className="hidden md:flex items-center space-x-2">
              <Link to="/applicant/login">
                <Button variant="ghost" className="text-slate-600 hover:text-[#A05AFF] hover:bg-slate-50 text-sm font-semibold transition-all rounded-xl dark:text-slate-400 dark:hover:bg-slate-800">
                  Applicant Login
                </Button>
              </Link>
              <span className="h-5 w-px bg-slate-200 mx-2 dark:bg-slate-800" />
              <Link to="/login">
                <Button variant="ghost" className="text-slate-600 hover:text-[#A05AFF] hover:bg-slate-50 text-sm font-semibold transition-all rounded-xl dark:text-slate-400 dark:hover:bg-slate-800">
                  School Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="h-10 rounded-xl bg-[#A05AFF] hover:bg-[#A05AFF]/90 text-white font-semibold shadow-sm px-5 transition-all">
                  School Signup
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Action Node */}
            <div className="md:hidden flex items-center">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-600 hover:text-[#A05AFF] hover:bg-slate-50 rounded-xl transition-colors dark:text-slate-400 dark:hover:bg-slate-800"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Framework Container */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 right-0 border-b border-slate-100 bg-white px-4 py-4 space-y-1 shadow-sm dark:bg-slate-900 dark:border-slate-800">
            {['home', 'features', 'how-it-works', 'pricing', 'contact'].map((target) => (
              <a 
                key={target}
                href={`#${target}`} 
                onClick={(e) => handleScroll(e, target)}
                className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#A05AFF] transition-colors capitalize dark:text-slate-300 dark:hover:bg-slate-800"
              >
                {target.replace('-', ' ')}
              </a>
            ))}
            <div className="pt-4 border-t border-slate-100 flex flex-col gap-2 dark:border-slate-800">
              <Link to="/applicant/login" className="w-full">
                <Button variant="outline" className="w-full text-slate-600 border-slate-200 rounded-xl dark:border-slate-700 dark:text-slate-400">Applicant Login</Button>
              </Link>
              <Link to="/login" className="w-full">
                <Button variant="outline" className="w-full text-slate-600 border-slate-200 rounded-xl dark:border-slate-700 dark:text-slate-400">School Login</Button>
              </Link>
              <Link to="/signup" className="w-full">
                <Button className="w-full bg-[#A05AFF] text-white rounded-xl">School Signup</Button>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* HERO SECTION CONTAINER */}
      <section id="home" className="pt-32 pb-16 lg:pt-40 lg:pb-24 overflow-hidden max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* HERO LEFT - Primary Layout Component Block */}
          <div className="lg:col-span-6 flex flex-col justify-center text-center lg:text-left reveal-left">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-[#A05AFF]/30 bg-[#A05AFF]/5 text-[#A05AFF] text-[11px] font-bold uppercase tracking-wider mb-4 self-center lg:self-start">
              <Sparkles className="w-3 h-3" /> Talent Management, Modernized
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-800 dark:text-white leading-tight mb-4">
              The vibrant core for school talent data.
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto lg:mx-0 mb-8 font-medium leading-relaxed">
              Streamline university and K-12 talent acquisition. Store rich portfolios, query candidates instantly with smart vector search, and accelerate institutional hiring cycles.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/signup" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto h-11 rounded-xl bg-[#A05AFF] hover:bg-[#A05AFF]/90 text-white font-bold px-8 shadow-sm transition-all">
                  Deploy Free Sandbox
                </Button>
              </Link>
              <a href="#features" onClick={(e) => handleScroll(e, 'features')} className="w-full sm:w-auto">
                <Button variant="outline" className="w-full sm:w-auto h-11 border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-[#A05AFF] px-8 rounded-xl font-bold transition-all dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800">
                  Analyze Architecture
                </Button>
              </a>
            </div>
          </div>

          {/* HERO RIGHT - Functional Matrix Widgets Preview Layer */}
          <div className="lg:col-span-6 relative reveal-right">
            <div className="rounded-xl border-none bg-white shadow-sm dark:bg-slate-900 p-5 space-y-5">
              
              {/* Image Inspired Color Metrics Row Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Coral/Pink Gradient block */}
                <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#ffbf96] to-[#fe7096] p-4 text-white">
                  <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider opacity-90 mb-1">
                    <span>Applicants</span>
                    <Users className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-xl font-bold">14,282</div>
                  <p className="text-[10px] opacity-75 mt-2 font-medium">Increased by 60%</p>
                </div>

                {/* Mint Teal Gradient block */}
                <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#84d9d2] to-[#07cdae] p-4 text-white">
                  <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider opacity-90 mb-1">
                    <span>Verified</span>
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-xl font-bold">98.4%</div>
                  <p className="text-[10px] opacity-75 mt-2 font-medium">Increased by 5%</p>
                </div>

                {/* Deep Purple Gradient block */}
                <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#da8eff] to-[#9e58ff] p-4 text-white">
                  <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider opacity-90 mb-1">
                    <span>Speed Units</span>
                    <Coins className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-xl font-bold">1.2 Days</div>
                  <p className="text-[10px] opacity-75 mt-2 font-medium">Decreased by 10%</p>
                </div>
              </div>

              {/* Live Intake Asset Ledger Card Panel layout */}
              <div className="bg-slate-50/50 border border-slate-100 rounded-xl overflow-hidden dark:bg-slate-950/50 dark:border-slate-800">
                <div className="px-4 py-3 bg-white border-b border-slate-100 flex justify-between items-center dark:bg-slate-900 dark:border-slate-800">
                  <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 dark:text-slate-200">
                    <Target className="w-3.5 h-3.5 text-[#A05AFF]" /> Live Intake Activity
                  </span>
                  <span className="w-2 h-2 rounded-full bg-[#1BCFB4]" />
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {[
                    { name: "Sarah Jenkins", role: "STEM Educator", school: "Lincoln High", status: "Shortlisted", color: "border-[#4BCBEB]/30 bg-[#4BCBEB]/5 text-[#4BCBEB]" },
                    { name: "Marcus Chen", role: "Principal Leader", school: "Oakridge Academy", status: "Reviewing", color: "border-[#A05AFF]/30 bg-[#A05AFF]/5 text-[#A05AFF]" },
                    { name: "Elena Rostova", role: "Counselor", school: "Beacon Intl", status: "Verified", color: "border-[#1BCFB4]/30 bg-[#1BCFB4]/5 text-[#1BCFB4]" }
                  ].map((candidate, idx) => (
                    <div key={idx} className="p-3.5 flex items-center justify-between text-xs hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#A05AFF]/10 border border-[#A05AFF]/20 flex items-center justify-center font-bold text-[#A05AFF] text-xs">
                          {candidate.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-bold text-slate-800 dark:text-slate-200">{candidate.name}</div>
                          <div className="text-slate-400 text-[11px] font-semibold">{candidate.role} • {candidate.school}</div>
                        </div>
                      </div>
                      <div className="text-right flex flex-col items-end gap-1">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${candidate.color}`}>
                          {candidate.status}
                        </span>
                        <div className="text-[10px] text-slate-400 font-semibold flex gap-1 items-center"><Clock className="w-3 h-3"/>Just now</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* STATS COUNT OVERVIEW HUB LINE */}
      <section className="border-y border-slate-100 bg-white py-12 dark:bg-slate-900 dark:border-slate-800 reveal-scale">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {[
              { count: "1,200+", label: "Partner Institutions" },
              { count: "4.6M", label: "Candidates Tracked" },
              { count: "25M+", label: "Portfolios Indexed" },
              { count: "99.99%", label: "Platform Uptime" }
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-3xl font-bold tracking-tight text-[#A05AFF] mb-1">
                  {stat.count}
                </div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CORE ARCHITECTURE FEATURES PANEL */}
      <section id="features" className="scroll-mt-20 py-16 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4 reveal-up">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-800 dark:text-white">
              A vibrant architecture for education scale.
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-2xl font-medium leading-relaxed">
              Ditch disconnected spreadsheets. Leverage an enterprise core infrastructure engineered to catalog and coordinate rich, deep institutional talent profiles.
            </p>
          </div>
        </div>

        {/* CSS GRID CONSTRAINTS LAYOUT MATRIX */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: <Database className="w-5 h-5" />, badgeColor: "border-[#A05AFF]/30 bg-[#A05AFF]/5 text-[#A05AFF]", title: "Unified Database Structure", desc: "A singular, immutable source of truth for handling student portfolios, academic history, and background records." },
            { icon: <Search className="w-5 h-5" />, badgeColor: "border-[#4BCBEB]/30 bg-[#4BCBEB]/5 text-[#4BCBEB]", title: "Smart Vector Search Engine", desc: "Blazing fast native indexing powered by AI heuristics to instantly parse, sort, and match applicant profiles." },
            { icon: <SlidersHorizontal className="w-5 h-5" />, badgeColor: "border-[#9E58FF]/30 bg-[#9E58FF]/5 text-[#9E58FF]", title: "Granular Multi-Dimensional Filters", desc: "Drill into hundreds of specific campus attributes: credentials, tenures, pedagogical specializations, and regional scores." },
            { icon: <FileText className="w-5 h-5" />, badgeColor: "border-[#4BCBEB]/30 bg-[#4BCBEB]/5 text-[#4BCBEB]", title: "DocuVault Asset Intake", desc: "OCR extraction that intelligently reads, catalogs, and tags high-fidelity transcripts, licenses, and certificates." },
            { icon: <School className="w-5 h-5" />, badgeColor: "border-[#1BCFB4]/30 bg-[#1BCFB4]/5 text-[#1BCFB4]", title: "Campus Silos & Access Control", desc: "Isolate and manage distinct nodes and security scopes across various branches, districts, or schools seamlessly." },
            { icon: <ShieldCheck className="w-5 h-5" />, badgeColor: "border-[#FE9496]/30 bg-[#FE9496]/5 text-[#FE9496]", title: "FERPA & GDPR Compliance Ready", desc: "Data rest and transit protection meeting strict regulatory parameters with fully isolated system containers." }
          ].map((feature, idx) => (
            <div 
              key={idx} 
              className="rounded-xl border-none bg-white shadow-sm p-5 dark:bg-slate-900 transition-all hover:bg-slate-50/50 dark:hover:bg-slate-800/50 flex flex-col justify-between"
            >
              <div>
                <div className={`p-2.5 rounded-xl border w-fit mb-4 ${feature.badgeColor}`}>
                  {feature.icon}
                </div>
                <h3 className="text-sm font-bold tracking-wide text-slate-800 dark:text-slate-200 mb-2">
                  {feature.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                  {feature.desc}
                </p>
              </div>
              <div className="mt-4 flex justify-end">
                <Unlock className="w-4 h-4 text-slate-300 dark:text-slate-700" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS CHRONOLOGICAL FLOW PROCESS */}
      <section id="how-it-works" className="scroll-mt-20 py-16 bg-white border-y border-slate-100 dark:bg-slate-900 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 reveal-up">
            <h2 className="text-xl font-bold tracking-tight text-slate-800 dark:text-white mb-2">
              Designed for optimal intake velocity
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              We transition legacy admin processes into a state-of-the-art talent data ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: "01", title: "Tenant Provisioning", desc: "Instantly launch your unique corporate node, map custom domain routing, and set access parameters.", badgeColor: "text-[#4BCBEB]" },
              { step: "02", title: "Ingest Candidates", desc: "Bulk synchronize candidate profiles via rapid file streams, mapping structures instantly.", badgeColor: "text-[#A05AFF]" },
              { step: "03", title: "Enrich Portfolios", desc: "AI-driven tagging auto-extracts capability indexes, verifies history, and structures assets.", badgeColor: "text-[#9E58FF]" },
              { step: "04", title: "Query & Match", desc: "Run dynamic multi-dimensional queries to select optimal resources and deploy contracts.", badgeColor: "text-[#FE9496]" }
            ].map((item, idx) => (
              <div key={idx} className="rounded-xl border-none bg-[#f3f3f4] p-5 dark:bg-slate-950 flex flex-col justify-between">
                <div>
                  <div className={`text-4xl font-bold tracking-tighter ${item.badgeColor} opacity-40 mb-4`}>
                    {item.step}
                  </div>
                  <h3 className="text-sm font-bold tracking-wide text-slate-800 dark:text-slate-200 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING STRUCTURAL PLANS */}
      <section id="pricing" className="scroll-mt-20 py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 reveal-up">
          <h2 className="text-xl font-bold tracking-tight text-slate-800 dark:text-white mb-2">
            Clear tiers for any institutional scale.
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
            Simple structures tailored directly to the capacity boundaries your operations require.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          
          {/* PLAN 1 - Starter */}
          <div className="rounded-xl border-none bg-white shadow-sm p-6 dark:bg-slate-900 flex flex-col justify-between">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Starter Tier</div>
              <div className="text-3xl font-bold text-slate-800 dark:text-white mb-1">Free</div>
              <div className="text-xs text-slate-400 dark:text-slate-500 mb-6 font-semibold">Perfect for single campus setup testing</div>
              <div className="space-y-3.5 mb-8">
                {["Up to 250 Candidate Profiles", "Standard Fuzzy Search Engine", "Basic Document Uploads (2GB)", "Single Active Admin Seat", "Community Support Channel"].map((f, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs text-slate-600 font-semibold dark:text-slate-400">
                    <Check className="w-4 h-4 text-[#A05AFF] flex-shrink-0" /> {f}
                  </div>
                ))}
              </div>
            </div>
            <Link to="/signup" className="w-full">
              <Button variant="outline" className="w-full h-10 border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-[#A05AFF] font-bold rounded-xl text-xs dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800">
                Launch Sandbox Node
              </Button>
            </Link>
          </div>

          {/* PLAN 2 - Pro (Image Core Specific Violet Highlight) */}
          <div className="rounded-xl border-2 border-[#A05AFF] bg-white shadow-sm p-6 dark:bg-slate-900 flex flex-col justify-between relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#A05AFF] text-white text-[9px] font-bold uppercase tracking-wider px-3 py-1 rounded-md">
              Most Operational Scale
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#A05AFF] mb-2 mt-1">Professional Pro</div>
              <div className="text-3xl font-bold text-slate-800 dark:text-white mb-1">
                $149<span className="text-xs font-semibold text-slate-400">/month</span>
              </div>
              <div className="text-xs text-slate-400 dark:text-slate-500 mb-6 font-semibold">Optimized for expanding district grids</div>
              <div className="space-y-3.5 mb-8">
                {["Uncapped Profiles & Records", "Vector Smart Search Matrix", "Advanced Multi-Dimensional Filters", "High-Volume Asset OCR Processing", "Up to 15 Seat Coordinators", "Priority SLA Response Channels"].map((f, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs text-slate-800 font-bold dark:text-slate-200">
                    <Check className="w-4 h-4 text-[#1BCFB4] flex-shrink-0" /> {f}
                  </div>
                ))}
              </div>
            </div>
            <Link to="/signup" className="w-full">
              <Button className="w-full h-10 bg-[#A05AFF] hover:bg-[#A05AFF]/90 text-white font-bold rounded-xl text-xs shadow-sm">
                Provision Production Instance
              </Button>
            </Link>
          </div>

          {/* PLAN 3 - Enterprise */}
          <div className="rounded-xl border-none bg-white shadow-sm p-6 dark:bg-slate-900 flex flex-col justify-between">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Enterprise Grid</div>
              <div className="text-3xl font-bold text-slate-800 dark:text-white mb-1">Custom</div>
              <div className="text-xs text-slate-400 dark:text-slate-500 mb-6 font-semibold">For massive multi-region institutions</div>
              <div className="space-y-3.5 mb-8">
                {["Infinite Isolated Data Silos", "Dedicated Database clusters", "SAML/SSO Credentials Integration", "Uncapped System Storage Cloud", "On-Premises Air-Gapped Options", "24/7 Dedicated Support Engineer"].map((f, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs text-slate-600 font-semibold dark:text-slate-400">
                    <Check className="w-4 h-4 text-[#9E58FF] flex-shrink-0" /> {f}
                  </div>
                ))}
              </div>
            </div>
            <a href="#contact" onClick={(e) => handleScroll(e, 'contact')} className="w-full">
              <Button variant="outline" className="w-full h-10 border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-[#A05AFF] font-bold rounded-xl text-xs dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800">
                Contact Technical Sales
              </Button>
            </a>
          </div>

        </div>
      </section>

      {/* CALL TO ACTION BOTTOM MODULE GRID */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 reveal-fade">
        <div className="rounded-xl bg-white border-none p-8 text-center shadow-sm dark:bg-slate-900">
          <h2 className="text-lg font-bold tracking-tight text-slate-800 dark:text-white mb-2">
            Accelerate your institution intake velocity now.
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xl mx-auto mb-6 font-medium leading-relaxed">
            Deploy nodes in moments. Harmonize application records dynamically. Construct an elite sovereign candidate tracking infrastructure.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Link to="/signup" className="w-full sm:w-auto">
              <Button className="w-full h-10 bg-[#A05AFF] hover:bg-[#A05AFF]/90 text-white font-bold px-6 rounded-xl text-xs shadow-sm">
                Launch Free Instance
              </Button>
            </Link>
            <a href="#contact" onClick={(e) => handleScroll(e, 'contact')} className="w-full sm:w-auto">
              <Button variant="ghost" className="w-full h-10 text-slate-500 hover:bg-slate-50 hover:text-[#A05AFF] px-6 rounded-xl font-bold text-xs flex gap-1 items-center justify-center dark:text-slate-400 dark:hover:bg-slate-800">
                Analyze SLA Guarantees <ArrowRight className="w-3.5 h-3.5"/>
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* MODERN FLAT CANVAS FOOTER LAYOUT */}
      <footer id="contact" className="bg-white border-t border-slate-100 py-12 dark:bg-slate-900 dark:border-slate-800 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-10">
            
            <div className="md:col-span-4 space-y-2">
              <span className="text-lg font-bold text-[#A05AFF] tracking-tight">EduBase</span>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed font-semibold">
                Next-generation sovereign talent data workspace frameworks constructed for deep education systems.
              </p>
            </div>

            <div className="md:col-span-3 space-y-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">Product Engineering</div>
              <div><a href="#features" onClick={(e) => handleScroll(e, 'features')} className="hover:text-[#A05AFF] transition-colors">Core Engine Grid</a></div>
              <div><a href="#features" onClick={(e) => handleScroll(e, 'features')} className="hover:text-[#A05AFF] transition-colors">Smart Lookup Core</a></div>
              <div><a href="#pricing" onClick={(e) => handleScroll(e, 'pricing')} className="hover:text-[#A05AFF] transition-colors">Pricing Ledger</a></div>
            </div>

            <div className="md:col-span-5 space-y-3 font-semibold text-xs text-slate-500 dark:text-slate-400">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">System Synchronization Updates</div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">Stay harmonized with architectural modifications, compliance alterations, and core updates.</p>
              <div className="flex gap-2 max-w-sm">
                <input 
                  type="email" 
                  placeholder="admin@school.edu" 
                  className="w-full h-10 px-4 bg-white border border-slate-200 rounded-xl text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A05AFF] focus-visible:border-[#A05AFF]/50 dark:bg-slate-950 dark:border-slate-800"
                />
                <Button className="h-10 bg-slate-950 text-white px-5 rounded-xl hover:bg-slate-800 font-bold text-xs shadow-sm dark:bg-slate-800">
                  Sync
                </Button>
              </div>
            </div>

          </div>

          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 text-slate-400 font-bold text-[11px] uppercase tracking-wider dark:border-slate-800">
            <div>&copy; 2026 EduBase Technology Inc. All production nodes active.</div>
            <div className="flex space-x-6">
              <span className="hover:text-[#A05AFF] cursor-pointer">SLA Operational map</span>
              <span className="hover:text-[#A05AFF] cursor-pointer">Privacy Map</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}