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
  TrendingUp, 
  Users, 
  Activity,
  Menu,
  X,
  Sparkle,
  Target,
  Clock,
  Unlock,
  Building2,
  Cpu,
  Layers,
  ShieldAlert,
  Send
} from 'lucide-react';

export default function Landing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Intersection Observer for scroll-driven animations and fade-in effects
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.15, // Trigger when 15% is visible
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

    // Parallax Effect for Background Elements
    const parallaxHandler = () => {
      const scrolled = window.scrollY;
      const blurs = document.querySelectorAll('.parallax-blur');
      blurs.forEach((blur, index) => {
        const speed = 0.05 + (index * 0.02);
        const yOffset = scrolled * speed * -1;
        blur.style.transform = `translateY(${yOffset}px)`;
      });
    };

    window.addEventListener('scroll', parallaxHandler);

    return () => {
      animatedElements.forEach((el) => observer.unobserve(el));
      window.removeEventListener('scroll', parallaxHandler);
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
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-indigo-500/30 selection:text-white overflow-x-hidden antialiased">
      
      {/* GLOBAL CSS & ANIMATIONS SETUP */}
      <style jsx global>{`
        html { scroll-behavior: smooth; scroll-padding-top: 80px; }
        
        .reveal-left { opacity: 0; transform: translateX(-40px); transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1); will-change: transform, opacity; }
        .reveal-right { opacity: 0; transform: translateX(40px); transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1); will-change: transform, opacity; }
        .reveal-up { opacity: 0; transform: translateY(40px); transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1); will-change: transform, opacity; }
        .reveal-scale { opacity: 0; transform: scale(0.95); transition: all 1s cubic-bezier(0.16, 1, 0.3, 1); will-change: transform, opacity; }
        .reveal-fade { opacity: 0; transition: opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1); }
        .reveal-visible { opacity: 1; transform: translate(0) scale(1); }
        
        .reveal-visible.delay-100 { transition-delay: 100ms; }
        .reveal-visible.delay-200 { transition-delay: 200ms; }
        .reveal-visible.delay-300 { transition-delay: 300ms; }
        .reveal-visible.delay-400 { transition-delay: 400ms; }
        .reveal-visible.delay-500 { transition-delay: 500ms; }
        
        .gradient-text-vibrant { background-clip: text; -webkit-background-clip: text; color: transparent; background-image: linear-gradient(to right, #818cf8, #c084fc, #f472b6); }
        .gradient-text-warm { background-clip: text; -webkit-background-clip: text; color: transparent; background-image: linear-gradient(to right, #fb923c, #f472b6); }
        
        @keyframes floatShape { 
          0%, 100% { transform: translate(0, 0) rotate(0deg); } 
          25% { transform: translate(-8px, 12px) rotate(1deg); }
          50% { transform: translate(12px, -8px) rotate(-1deg); } 
          75% { transform: translate(-4px, -8px) rotate(0.5deg); } 
        }
        
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 15px rgba(99, 102, 241, 0.15); border-color: rgba(99, 102, 241, 0.2); }
          50% { box-shadow: 0 0 30px rgba(192, 38, 211, 0.3); border-color: rgba(192, 38, 211, 0.4); }
        }
      `}</style>

      {/* DYNAMIC BACKDROP GENERATOR */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="parallax-blur absolute top-0 left-[-10%] w-[800px] h-[800px] bg-gradient-to-tr from-indigo-500/10 via-cyan-500/5 to-transparent rounded-full blur-[140px]" />
        <div className="parallax-blur absolute top-[15%] right-[-10%] w-[900px] h-[900px] bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-transparent rounded-full blur-[160px]" />
        <div className="parallax-blur absolute top-[45%] left-[5%] w-[700px] h-[700px] bg-gradient-to-tr from-cyan-500/5 via-indigo-500/10 to-transparent rounded-full blur-[130px]" />
        <div className="parallax-blur absolute top-[75%] right-[-5%] w-[850px] h-[850px] bg-gradient-to-bl from-pink-500/5 via-indigo-500/10 to-transparent rounded-full blur-[150px]" />
      </div>

      {/* GLASSMORPHISM NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-[100] w-full h-20 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl transition-all shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-full items-center">
            
            {/* Brand Logo Identity */}
            <div className="flex items-center gap-2.5 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="p-2 bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-600 rounded-xl shadow-md group-hover:scale-105 transition-transform duration-300">
                <Database className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black tracking-tight text-white bg-gradient-to-r from-white via-slate-100 to-slate-200 bg-clip-text">
                EduBase<span className="text-indigo-400">.</span>
              </span>
            </div>
            
            {/* Desktop Link Hub */}
            <div className="hidden md:flex items-center space-x-1 bg-slate-900/60 p-1.5 rounded-xl border border-slate-800/60">
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
                  className="px-4 py-1.5 text-xs font-bold text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/80 transition-all duration-200"
                >
                  {item.label}
                </a>
              ))}
            </div>

            {/* Comprehensive CTA Routing Group */}
            <div className="hidden lg:flex items-center space-x-3">
              <div className="flex items-center bg-slate-900/40 rounded-xl border border-slate-800/80 p-0.5">
                <Link to="/applicant/login">
                  <Button variant="ghost" className="text-slate-400 hover:text-white px-3 h-8 text-xs font-bold transition-all rounded-lg hover:bg-slate-800">
                    Applicant Login
                  </Button>
                </Link>
                <Link to="/applicant/signup">
                  <Button variant="ghost" className="text-slate-400 hover:text-white px-3 h-8 text-xs font-bold transition-all rounded-lg hover:bg-slate-800">
                    Applicant Signup
                  </Button>
                </Link>
              </div>
              <span className="w-px h-5 bg-slate-800" />
              <Link to="/login">
                <Button variant="ghost" className="text-slate-300 hover:text-white px-4 h-9 text-xs font-bold transition-all rounded-xl border border-slate-800 bg-slate-900/30 hover:bg-slate-800/60">
                  School Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="h-9 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 text-white font-bold text-xs px-5 rounded-xl shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 transition-all duration-300 hover:-translate-y-0.5 group/btn border border-indigo-400/20">
                  <span className="flex items-center gap-1.5">
                    School Signup <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                  </span>
                </Button>
              </Link>
            </div>

            {/* Mobile Hamburger Trigger */}
            <div className="md:hidden flex items-center">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Sidebar Flyout Panel */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 right-0 border-b border-slate-800 bg-slate-950/95 backdrop-blur-xl px-4 pt-2 pb-6 space-y-2 shadow-2xl animate-in fade-in slide-in-from-top-5 duration-200">
            {['home', 'features', 'how-it-works', 'pricing', 'contact'].map((target) => (
              <a 
                key={target}
                href={`#${target}`} 
                onClick={(e) => handleScroll(e, target)}
                className="block px-4 py-3 rounded-xl text-sm font-bold text-slate-400 hover:bg-slate-900 hover:text-white transition-all capitalize"
              >
                {target.replace('-', ' ')}
              </a>
            ))}
            <div className="pt-4 border-t border-slate-800/80 flex flex-col gap-2.5">
              <div className="grid grid-cols-2 gap-2">
                <Link to="/applicant/login" className="w-full">
                  <Button variant="outline" className="w-full text-slate-300 border-slate-800 bg-slate-900/40 text-xs font-bold rounded-xl h-10">Applicant Login</Button>
                </Link>
                <Link to="/applicant/signup" className="w-full">
                  <Button variant="outline" className="w-full text-slate-300 border-slate-800 bg-slate-900/40 text-xs font-bold rounded-xl h-10">Applicant Signup</Button>
                </Link>
              </div>
              <Link to="/login" className="w-full">
                <Button variant="outline" className="w-full text-slate-200 border-slate-800 bg-slate-900/80 font-bold text-xs rounded-xl h-10">School Login</Button>
              </Link>
              <Link to="/signup" className="w-full">
                <Button className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-bold text-xs rounded-xl h-10">School Signup</Button>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* HERO HERO COMPONENT WORKSPACE */}
      <section id="home" className="relative pt-32 pb-20 lg:pt-44 lg:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* HERO LEFT FRAMEWORK */}
            <div className="lg:col-span-6 flex flex-col justify-center text-center lg:text-left reveal-left">
              <div className="inline-flex items-center gap-2 self-center lg:self-start px-3.5 py-1 mb-6 rounded-full border border-indigo-500/30 bg-indigo-500/5 text-[11px] font-bold tracking-wider uppercase text-indigo-300 shadow-inner">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400 fill-indigo-400/20" /> Talent Management, Modernized
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1] mb-6">
                The vibrant core for 
                <span className="block mt-2 gradient-text-vibrant">
                  school talent data.
                </span>
              </h1>
              <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed font-medium">
                Streamline university and K-12 talent acquisition. Store rich portfolios, query candidates instantly with smart vector search, and accelerate institutional hiring cycles.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/signup" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto h-12 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold text-sm px-8 rounded-xl shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all hover:-translate-y-0.5">
                    Deploy Free Sandbox
                  </Button>
                </Link>
                <a href="#features" onClick={(e) => handleScroll(e, 'features')} className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 border-slate-800 bg-slate-900/60 text-slate-300 hover:text-white hover:bg-slate-800 px-8 rounded-xl font-bold transition-all shadow-sm">
                    Analyze Architecture
                  </Button>
                </a>
              </div>
            </div>

            {/* HERO RIGHT FRAMEWORK - INTERACTIVE PREVIEW */}
            <div className="lg:col-span-6 relative reveal-right">
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl blur-2xl pointer-events-none" />
              <div className="relative border border-slate-800 bg-slate-950/70 rounded-2xl p-5 sm:p-6 shadow-2xl shadow-black/80 backdrop-blur-md hover:border-slate-700/80 transition-all duration-300 group">
                
                {/* Decorative Elements */}
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-indigo-500/10 rounded-full blur-xl pointer-events-none" />
                <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-purple-500/10 rounded-xl blur-xl pointer-events-none" />

                {/* Simulated Tab Frame */}
                <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-900">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-3 h-3 rounded-full bg-slate-800" />
                    <span className="w-3 h-3 rounded-full bg-slate-800" />
                    <span className="w-3 h-3 rounded-full bg-slate-800" />
                  </div>
                  <div className="text-[11px] font-medium text-slate-400 bg-slate-900/80 px-4 py-1.5 rounded-lg border border-slate-800/80 flex items-center gap-1.5 tracking-wide">
                    <Database className="w-3 h-3 text-indigo-400" /> dashboard.edubase.io/candidates
                  </div>
                  <div className="w-6" />
                </div>

                {/* Grid Metric Blocks */}
                <div className="grid grid-cols-3 gap-3 mb-5">
                  {[
                    { label: "Applicants", value: "14,282", icon: Users, gradient: "from-indigo-500/10 to-indigo-500/5", border: "border-indigo-500/20", text: "text-indigo-400" },
                    { label: "Verified", value: "98.4%", icon: ShieldCheck, gradient: "from-purple-500/10 to-purple-500/5", border: "border-purple-500/20", text: "text-purple-400" },
                    { label: "Speed", value: "1.2 Days", icon: Activity, gradient: "from-pink-500/10 to-pink-500/5", border: "border-pink-500/20", text: "text-pink-400" }
                  ].map((stat, i) => (
                    <div key={i} className={`bg-gradient-to-b ${stat.gradient} p-4 rounded-xl border ${stat.border} transition-all duration-300`}>
                      <div className="flex items-center justify-between opacity-70 mb-1.5">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">{stat.label}</span>
                        <stat.icon className={`w-3.5 h-3.5 ${stat.text}`} />
                      </div>
                      <div className="text-xl font-black tracking-tight text-white">{stat.value}</div>
                    </div>
                  ))}
                </div>

                {/* Real-time Applicant Log Ledger */}
                <div className="bg-slate-900/50 border border-slate-900 rounded-xl overflow-hidden shadow-inner">
                  <div className="px-4 py-3 bg-slate-900/80 border-b border-slate-950 flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5 text-indigo-400" /> Live Intake Activity
                    </span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-md shadow-emerald-500/50 animate-pulse" />
                  </div>
                  <div className="divide-y divide-slate-900/60">
                    {[
                      { name: "Sarah Jenkins", role: "STEM Educator", school: "Lincoln High", status: "Shortlisted", color: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" },
                      { name: "Marcus Chen", role: "Principal Leader", school: "Oakridge Academy", status: "Reviewing", color: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
                      { name: "Elena Rostova", role: "Counselor", school: "Beacon Intl", status: "Verified", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" }
                    ].map((candidate, idx) => (
                      <div key={idx} className="p-3 flex items-center justify-between text-xs hover:bg-slate-900/30 transition-colors duration-150">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700/60 flex items-center justify-center font-bold text-xs text-slate-300">
                            {candidate.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <div className="font-bold text-slate-200 text-xs">{candidate.name}</div>
                            <div className="text-slate-500 font-medium text-[10px]">{candidate.role} • {candidate.school}</div>
                          </div>
                        </div>
                        <div className="text-right flex flex-col items-end">
                          <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold border ${candidate.color}`}>
                            {candidate.status}
                          </span>
                          <div className="text-[9px] text-slate-500 font-medium mt-1 flex gap-1 items-center">
                            <Clock className="w-2.5 h-2.5"/> {idx === 0 ? 'Just now' : `${idx * 4}m ago`}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ANALYTICS SCALER STRIP */}
      <section className="border-y border-slate-800 bg-slate-950/40 py-16 reveal-scale">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { count: "1,200+", label: "Partner Institutions", text: "from-indigo-400 to-indigo-200" },
              { count: "4.6M", label: "Candidates Tracked", text: "from-purple-400 to-purple-200" },
              { count: "25M+", label: "Portfolios Indexed", text: "from-pink-400 to-pink-200" },
              { count: "99.99%", label: "Platform Uptime", text: "from-cyan-400 to-blue-200" }
            ].map((stat, i) => (
              <div key={i} className="transition-transform duration-300 hover:scale-105">
                <div className="text-4xl sm:text-5xl font-black tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent mb-1">
                  {stat.count}
                </div>
                <div className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CORE CAPABILITIES GRID MATRIX */}
      <section id="features" className="scroll-mt-20 py-24 lg:py-32 relative overflow-hidden">
        <div className="absolute top-[20%] left-[-10%] w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-3xl animate-[floatShape_15s_infinite]" />
        <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl animate-[floatShape_20s_infinite_reverse]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-20 reveal-up">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-[10px] font-bold uppercase tracking-widest mb-4">
              <Sparkle className="h-3 w-3" /> Enterprise Architecture
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-5 leading-tight">
              A vibrant architecture for <span className="gradient-text-vibrant">education scale.</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-400 font-medium leading-relaxed">
              Ditch disconnected spreadsheets. Leverage an enterprise core infrastructure engineered to catalog and coordinate rich, deep institutional talent profiles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              { icon: <Database className="w-5 h-5 text-indigo-400" />, title: "Unified Database Structure", desc: "A singular, immutable source of truth for handling student portfolios, academic history, and background records.", border: "hover:border-indigo-500/30", glow: "shadow-indigo-500/5", delay: "" },
              { icon: <Search className="w-5 h-5 text-purple-400" />, title: "Smart Vector Search Engine", desc: "Blazing fast native indexing powered by AI heuristics to instantly parse, sort, and match applicant profiles.", border: "hover:border-purple-500/30", glow: "shadow-purple-500/5", delay: "delay-100" },
              { icon: <SlidersHorizontal className="w-5 h-5 text-pink-400" />, title: "Granular Multi-Dimensional Filters", desc: "Drill into hundreds of specific campus attributes: credentials, tenures, pedagogical specializations, and regional scores.", border: "hover:border-pink-500/30", glow: "shadow-pink-500/5", delay: "delay-200" },
              { icon: <FileText className="w-5 h-5 text-cyan-400" />, title: "DocuVault Asset Intake", desc: "OCR extraction that intelligently reads, catalogs, and tags high-fidelity transcripts, licenses, and certificates.", border: "hover:border-cyan-500/30", glow: "shadow-cyan-500/5", delay: "delay-300" },
              { icon: <School className="w-5 h-5 text-emerald-400" />, title: "Campus Silos & Access Control", desc: "Isolate and manage distinct nodes and security scopes across various branches, districts, or schools seamlessly.", border: "hover:border-emerald-500/30", glow: "shadow-emerald-500/5", delay: "delay-400" },
              { icon: <ShieldCheck className="w-5 h-5 text-amber-400" />, title: "FERPA & GDPR Compliance Ready", desc: "Data rest and transit protection meeting strict regulatory parameters with fully isolated system containers.", border: "hover:border-amber-500/30", glow: "shadow-amber-500/5", delay: "delay-500" }
            ].map((feature, idx) => (
              <div 
                key={idx} 
                className={`group relative bg-slate-950/40 border border-slate-800/80 p-8 rounded-2xl transition-all duration-300 hover:-translate-y-1 ${feature.border} hover:shadow-2xl ${feature.glow} ${idx % 2 === 0 ? 'reveal-left' : 'reveal-right'} ${feature.delay}`}
              >
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl w-fit mb-6 transition-transform duration-300 group-hover:scale-105">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-3 tracking-tight group-hover:text-slate-200 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 font-medium leading-relaxed">
                  {feature.desc}
                </p>
                <div className="absolute top-5 right-5 opacity-0 group-hover:opacity-40 transition-opacity duration-300 pointer-events-none">
                  <Unlock className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INTENSE PIPELINE INTAKE STRIP */}
      <section id="how-it-works" className="scroll-mt-20 py-24 lg:py-32 bg-slate-950/30 border-y border-slate-800 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-xl mx-auto mb-16 reveal-up">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-4">
              Designed for optimal intake velocity
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-medium leading-relaxed">
              We transition legacy admin processes into a state-of-the-art talent data ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {[
              { step: "01", title: "Tenant Provisioning", desc: "Instantly launch your unique corporate node, map custom domain routing, and set access parameters.", text: "text-indigo-500/20" },
              { step: "02", title: "Ingest Candidates", desc: "Bulk synchronize candidate profiles via rapid file streams, mapping structures instantly.", text: "text-purple-500/20" },
              { step: "03", title: "Enrich Portfolios", desc: "AI-driven tagging auto-extracts capability indexes, verifies history, and structures assets.", text: "text-pink-500/20" },
              { step: "04", title: "Query & Match", desc: "Run dynamic multi-dimensional queries to select optimal resources and deploy contracts.", text: "text-cyan-500/20" }
            ].map((item, idx) => (
              <div key={idx} className={`relative bg-slate-900/30 border border-slate-800 p-6 sm:p-7 rounded-2xl transition-all duration-300 hover:border-slate-700/60 reveal-up delay-${idx * 100} group`}>
                {idx < 3 && (
                  <div className="hidden lg:block absolute top-[3.5rem] -right-4 w-8 border-t border-dashed border-slate-800 z-10" />
                )}
                <div className={`text-5xl font-black ${item.text} mb-4 tracking-tighter transition-transform duration-300 group-hover:scale-105`}>
                  {item.step}
                </div>
                <h3 className="text-base font-bold text-slate-200 mb-2 tracking-tight">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 font-medium leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TIERS SUBSCRIPTION ARCHITECTURE */}
      <section id="pricing" className="scroll-mt-20 py-24 lg:py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-20 reveal-up">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-4">
              Clear tiers for any institutional scale.
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-medium">
              Simple structures tailored directly to the capacity boundaries your operations require.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
            
            {/* TIER 1 */}
            <div className="bg-slate-950/40 border border-slate-800 p-8 rounded-2xl flex flex-col justify-between hover:border-indigo-500/20 transition-all duration-300 reveal-left delay-200 group">
              <div className="space-y-6">
                <div>
                  <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">Starter Tier</div>
                  <div className="text-4xl font-black text-white tracking-tight mb-1">Free</div>
                  <div className="text-[11px] text-slate-500 font-semibold">Perfect for single campus setup testing</div>
                </div>
                <span className="block h-px bg-slate-900" />
                <div className="space-y-3.5">
                  {["Up to 250 Candidate Profiles", "Standard Fuzzy Search Engine", "Basic Document Uploads (2GB)", "Single Active Admin Seat", "Community Support Channel"].map((f, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-xs text-slate-400 font-medium">
                      <Check className="w-4 h-4 text-indigo-400 flex-shrink-0" /> {f}
                    </div>
                  ))}
                </div>
              </div>
              <Link to="/signup" className="w-full mt-8">
                <Button variant="outline" className="w-full border-slate-800 bg-slate-900/60 text-slate-300 hover:text-white hover:bg-slate-800 font-bold text-xs h-10 rounded-xl transition-all shadow-sm">
                  Launch Sandbox Node
                </Button>
              </Link>
            </div>

            {/* TIER 2 - ACTIVE SELECTION FRAMEWORK */}
            <div className="relative bg-slate-950 border-2 border-indigo-500 p-8 rounded-2xl flex flex-col justify-between shadow-2xl shadow-indigo-500/5 transform lg:-translate-y-4 reveal-scale delay-100 group">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-[9px] font-black uppercase tracking-wider px-4 py-1.5 rounded-full shadow-md">
                Most Operational Scale
              </div>
              <div className="space-y-6 mt-2">
                <div>
                  <div className="text-[10px] font-bold text-purple-400 uppercase tracking-widest mb-1">Professional Pro</div>
                  <div className="text-4xl font-black text-white tracking-tight mb-1">
                    $149<span className="text-xs font-bold text-slate-500"> /month</span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-semibold">Optimized for expanding district grids</div>
                </div>
                <span className="block h-px bg-slate-900" />
                <div className="space-y-3.5">
                  {["Uncapped Profiles & Records", "Vector Smart Search Matrix", "Advanced Multi-Dimensional Filters", "High-Volume Asset OCR Processing", "Up to 15 Seat Coordinators", "Priority SLA Response Channels"].map((f, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-xs text-slate-200 font-bold">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" /> {f}
                    </div>
                  ))}
                </div>
              </div>
              <Link to="/signup" className="w-full mt-8">
                <Button className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold text-xs h-10 rounded-xl shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all">
                  Provision Production instance
                </Button>
              </Link>
            </div>

            {/* TIER 3 */}
            <div className="bg-slate-950/40 border border-slate-800 p-8 rounded-2xl flex flex-col justify-between hover:border-pink-500/20 transition-all duration-300 reveal-right delay-200 group">
              <div className="space-y-6">
                <div>
                  <div className="text-[10px] font-bold text-pink-400 uppercase tracking-widest mb-1">Enterprise Grid</div>
                  <div className="text-4xl font-black text-white tracking-tight mb-1">Custom</div>
                  <div className="text-[11px] text-slate-500 font-semibold">For massive multi-region institutions</div>
                </div>
                <span className="block h-px bg-slate-900" />
                <div className="space-y-3.5">
                  {["Infinite Isolated Data Silos", "Dedicated Database clusters", "SAML/SSO Credentials Integration", "Uncapped System Storage Cloud", "On-Premises Air-Gapped Options", "24/7 Dedicated Support Engineer"].map((f, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-xs text-slate-400 font-medium">
                      <Check className="w-4 h-4 text-pink-400 flex-shrink-0" /> {f}
                    </div>
                  ))}
                </div>
              </div>
              <a href="#contact" onClick={(e) => handleScroll(e, 'contact')} className="w-full mt-8">
                <Button variant="outline" className="w-full border-slate-800 bg-slate-900/60 text-slate-300 hover:text-white hover:bg-slate-800 font-bold text-xs h-10 rounded-xl transition-all shadow-sm">
                  Contact Technical Sales
                </Button>
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* HIGHLGHT CONVERSION CTA ELEMENT */}
      <section className="py-20 lg:py-28 relative overflow-hidden border-t border-slate-900 bg-slate-950/20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 reveal-fade">
          <div className="bg-gradient-to-br from-slate-950 via-indigo-950/70 to-slate-950 border border-slate-800/80 rounded-3xl p-10 sm:p-14 text-center shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-5 leading-tight">
              Accelerate your institution intake <span className="gradient-text-vibrant">velocity now.</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
              Deploy nodes in moments. Harmonize application records dynamically. Construct an elite sovereign candidate tracking infrastructure.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/signup" className="w-full sm:w-auto">
                <Button size="lg" className="w-full h-11 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-xs px-8 rounded-xl shadow-lg hover:shadow-pink-500/20 hover:scale-105 transition-all">
                  Launch Free Instance
                </Button>
              </Link>
              <a href="#contact" onClick={(e) => handleScroll(e, 'contact')} className="w-full sm:w-auto">
                <Button size="lg" variant="ghost" className="w-full h-11 text-slate-400 hover:text-white hover:bg-white/5 px-6 rounded-xl font-bold text-xs transition-all flex gap-1.5 items-center justify-center">
                  Analyze SLA Guarantees <ArrowRight className="w-3.5 h-3.5"/>
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SOVEREIGN MATRIX FOOTER CONTAINER */}
      <footer id="contact" className="scroll-mt-20 bg-slate-950 border-t border-slate-900 text-slate-500 text-[11px] py-16 relative z-10 reveal-scale delay-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
            
            <div className="md:col-span-4 space-y-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-indigo-400 shadow-md">
                  <Database className="w-4 h-4" />
                </div>
                <span className="text-lg font-black text-white tracking-tight">EduBase<span className="text-indigo-400">.</span></span>
              </div>
              <p className="text-slate-400 max-w-xs leading-relaxed font-medium">
                Next-generation sovereign talent data workspace frameworks constructed for deep education systems.
              </p>
            </div>

            <div className="md:col-span-2 space-y-3 font-semibold">
              <div className="font-bold text-white uppercase tracking-wider text-[9px] mb-1">Product Engineering</div>
              {[{l: 'Core Engine Grid', t: 'features'}, {l: 'Smart Lookup Core', t: 'features'}, {l: 'DocuVault Vaulting', t: 'features'}, {l: 'Pricing Ledger', t: 'pricing'}].map(link => (
                <div key={link.l}><a href={`#${link.t}`} onClick={(e) => handleScroll(e, link.t)} className="hover:text-white transition-colors">{link.l}</a></div>
              ))}
            </div>

            <div className="md:col-span-2 space-y-3 font-semibold">
              <div className="font-bold text-white uppercase tracking-wider text-[9px] mb-1">Sovereignty Matrix</div>
              {['FERPA Guarantees', 'GDPR Privacy Core', 'SOC2 Certifications', 'Data Cryptography'].map(link => (
                <div key={link}><span className="hover:text-white transition-colors cursor-pointer">{link}</span></div>
              ))}
            </div>

            <div className="md:col-span-4 space-y-3 font-semibold">
              <div className="font-bold text-white uppercase tracking-wider text-[9px] mb-1">System Synchronization Updates</div>
              <p className="text-slate-400 leading-relaxed font-medium">Stay harmonized with architectural modifications, compliance alterations, and core updates.</p>
              <div className="flex gap-2 max-w-sm pt-1">
                <input 
                  type="email" 
                  placeholder="admin@school.edu" 
                  className="bg-slate-900 border border-slate-800 rounded-xl px-4 h-10 w-full text-white placeholder-slate-500 font-medium text-xs focus:outline-none focus:border-slate-700 transition-colors"
                />
                <Button className="bg-white text-slate-950 px-4 h-10 rounded-xl hover:bg-slate-200 font-bold text-xs transition-colors shrink-0">
                  Sync
                </Button>
              </div>
            </div>

          </div>

          <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row justify-between items-center gap-4 text-slate-600 font-medium text-[10px] uppercase tracking-wider">
            <div>&copy; 2026 EduBase Technology Inc. All production nodes active.</div>
            <div className="flex space-x-6">
              <span className="hover:text-slate-400 cursor-pointer">SLA Operational map</span>
              <span className="hover:text-slate-400 cursor-pointer">Privacy Map</span>
              <span className="hover:text-slate-400 cursor-pointer">Terms of Infrastructure</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}