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
  Unlock
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
        } else {
           // Optional: Uncomment to make elements re-animate when re-entering viewport
           // entry.target.classList.remove('reveal-visible');
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
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-indigo-500/20 selection:text-indigo-900 overflow-x-hidden antialiased">
      
      {/* GLOBAL CSS & ANIMATIONS
        Defined here for context, ensure these are in your actual CSS file 
        (e.g., globals.css or index.css)
      */}
      <style jsx global>{`
        html { scroll-behavior: smooth; scroll-padding-top: 80px; } /* Ensures accurate scrolling on direct link access */
        
        /* Reveal Animations */
        .reveal-left { opacity: 0; transform: translateX(-60px); transition: all 1s cubic-bezier(0.16, 1, 0.3, 1); will-change: transform, opacity; }
        .reveal-right { opacity: 0; transform: translateX(60px); transition: all 1s cubic-bezier(0.16, 1, 0.3, 1); will-change: transform, opacity; }
        .reveal-up { opacity: 0; transform: translateY(50px); transition: all 1s cubic-bezier(0.16, 1, 0.3, 1); will-change: transform, opacity; }
        .reveal-scale { opacity: 0; transform: scale(0.9); transition: all 1.2s cubic-bezier(0.16, 1, 0.3, 1); will-change: transform, opacity; }
        .reveal-fade { opacity: 0; transition: opacity 1.5s cubic-bezier(0.16, 1, 0.3, 1); }
        .reveal-visible { opacity: 1; transform: translate(0) scale(1); }
        
        /* Delays */
        .reveal-visible.delay-100 { transition-delay: 100ms; }
        .reveal-visible.delay-200 { transition-delay: 200ms; }
        .reveal-visible.delay-300 { transition-delay: 300ms; }
        .reveal-visible.delay-400 { transition-delay: 400ms; }
        .reveal-visible.delay-500 { transition-delay: 500ms; }
        
        /* Text Gradients */
        .gradient-text-vibrant { background-clip: text; -webkit-background-clip: text; color: transparent; background-image: linear-gradient(to right, #6366f1, #c026d3, #ec4899); }
        .gradient-text-warm { background-clip: text; -webkit-background-clip: text; color: transparent; background-image: linear-gradient(to right, #f97316, #ec4899); }
        
        /* Floating Shapes Animation */
        @keyframes floatShape { 
          0%, 100% { transform: translate(0, 0) rotate(0deg); } 
          25% { transform: translate(-10px, 15px) rotate(2deg); }
          50% { transform: translate(15px, -10px) rotate(-1deg); } 
          75% { transform: translate(-5px, -10px) rotate(1deg); } 
        }
        
        /* Pulsing Glow Animation */
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 10px rgba(99, 102, 241, 0.2); }
          50% { box-shadow: 0 0 25px rgba(192, 38, 211, 0.4); }
        }
      `}</style>

      {/* DYNAMIC BACKDROP - PARALLAX & VIBRANT GLOWS */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="parallax-blur absolute top-0 left-[-10%] w-[650px] h-[650px] bg-gradient-to-tr from-indigo-300/30 via-cyan-200/20 to-transparent rounded-full blur-[140px]" />
        <div className="parallax-blur absolute top-[15%] right-[-12%] w-[750px] h-[750px] bg-gradient-to-br from-purple-300/30 via-pink-200/20 to-orange-100/10 rounded-full blur-[160px]" />
        <div className="parallax-blur absolute top-[50%] left-[15%] w-[600px] h-[600px] bg-gradient-to-tr from-emerald-200/20 via-blue-200/20 to-transparent rounded-full blur-[120px]" />
        <div className="parallax-blur absolute top-[80%] right-[10%] w-[700px] h-[700px] bg-gradient-to-bl from-amber-200/20 via-red-200/20 to-transparent rounded-full blur-[150px]" />
      </div>

      {/* FIXED GLASS NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-[100] w-full h-20 border-b border-white/60 bg-white/70 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 shadow-[0_4px_30px_-10px_rgba(99,102,241,0.07)]">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-full items-center">
            
            {/* Logo */}
            <div className="flex items-center gap-2.5 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="p-2.5 bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-600 rounded-xl shadow-lg shadow-indigo-500/20 group-hover:rotate-12 transition-transform duration-300">
                <Database className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tight text-slate-900 gradient-text-vibrant">
                EduBase<span className="text-pink-500">.</span>
              </span>
            </div>
            
            {/* Desktop Navigation */}
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
                  className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-indigo-600 rounded-xl hover:bg-indigo-50/70 transition-all duration-200"
                >
                  {item.label}
                </a>
              ))}
            </div>

            {/* CTA Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost" className="text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 px-4 py-2 text-sm font-bold transition-all">
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="relative group overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold text-sm px-6 py-2.5 rounded-xl shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all duration-300 hover:-translate-y-0.5">
                  <span className="relative z-10 flex items-center gap-1.5">
                    Free Trial <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </Link>
            </div>

            {/* Mobile Hamburger Trigger */}
            <div className="md:hidden flex items-center">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 right-0 border-b border-slate-200 bg-white/95 backdrop-blur-lg px-4 pt-2 pb-6 space-y-2 shadow-2xl">
            {['home', 'features', 'how-it-works', 'pricing', 'contact'].map((target) => (
              <a 
                key={target}
                href={`#${target}`} 
                onClick={(e) => handleScroll(e, target)}
                className="block px-4 py-3 rounded-xl text-base font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors capitalize"
              >
                {target.replace('-', ' ')}
              </a>
            ))}
            <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
              <Link to="/login" className="w-full">
                <Button variant="outline" className="w-full py-2.5 text-slate-700 border-slate-200 font-bold">Login</Button>
              </Link>
              <Link to="/signup" className="w-full">
                <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2.5 font-bold">Free Trial</Button>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* HOME PAGE / HERO SECTION */}
      <section id="home" className="relative pt-32 pb-24 lg:pt-48 lg:pb-36 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* HERO LEFT - Vibrant Text & Actions - Slides in from Left */}
            <div className="lg:col-span-6 flex flex-col justify-center text-center lg:text-left reveal-left">
              <div className="inline-flex items-center gap-2 self-center lg:self-start px-4 py-1.5 mb-6 rounded-full border border-pink-200 bg-gradient-to-r from-pink-50 to-indigo-50 text-xs font-black tracking-wide uppercase text-indigo-700 shadow-sm animate-bounce" style={{ animationDuration: '3s' }}>
                <Sparkles className="w-3.5 h-3.5 text-pink-500 fill-pink-500" /> Talent Management, Modernized
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight text-slate-900 leading-[1.05] mb-6">
                The vibrant core for 
                <span className="block mt-2 gradient-text-vibrant">
                  school talent data.
                </span>
              </h1>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 mb-10 leading-relaxed font-medium">
                Streamline university and K-12 talent acquisition. Store rich portfolios, query candidates instantly with smart vector search, and accelerate institutional hiring cycles.
              </p>
              <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
                <Link to="/signup" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold px-10 py-4.5 rounded-2xl shadow-lg shadow-indigo-500/20 hover:scale-105 hover:-translate-y-0.5 transition-all">
                    Deploy Free Sandbox
                  </Button>
                </Link>
                <a href="#features" onClick={(e) => handleScroll(e, 'features')} className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-slate-200/90 bg-white/90 text-slate-700 hover:bg-slate-50 hover:border-slate-300 px-10 py-4.5 rounded-2xl font-bold transition-all shadow-sm">
                    Analyze Architecture
                  </Button>
                </a>
              </div>
            </div>

            {/* HERO RIGHT - Premium Interactive App Preview - Slides in from Right */}
            <div className="lg:col-span-6 relative reveal-right">
              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400/20 via-indigo-400/20 to-pink-400/20 rounded-3xl blur-2xl opacity-70 pointer-events-none" />
              <div className="relative border border-white bg-white/80 rounded-3xl p-6 sm:p-8 shadow-[0_20px_60px_-10px_rgba(99,102,241,0.2)] ring-1 ring-slate-100/80 backdrop-blur-md transition-all duration-500 hover:shadow-[0_30px_70px_-10px_rgba(192,38,211,0.25)] hover:-translate-y-1 group">
                
                {/* Floating Decorative Shapes for Movement */}
                <div className="absolute -top-6 -left-6 w-16 h-16 bg-gradient-to-br from-indigo-300/40 to-blue-200/40 rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform" />
                <div className="absolute -bottom-8 -right-8 w-20 h-20 bg-gradient-to-br from-purple-300/40 to-pink-200/40 rounded-xl blur-xl pointer-events-none group-hover:scale-125 transition-transform" />

                {/* Simulated App Header */}
                <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
                  <div className="flex items-center space-x-2.5">
                    <span className="w-3.5 h-3.5 rounded-full bg-rose-500 shadow-sm" />
                    <span className="w-3.5 h-3.5 rounded-full bg-amber-400 shadow-sm" />
                    <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 shadow-sm" />
                  </div>
                  <div className="text-xs font-black text-indigo-600 bg-indigo-50/80 px-4 py-2 rounded-xl border border-indigo-100/50 flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5" /> dashboard.edubase.io/candidates
                  </div>
                  <div className="w-12" />
                </div>

                {/* Vibrant Analytic Widgets */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
                  {[
                    { label: "Applicants", value: "14,282", icon: Users, gradient: "from-indigo-500 to-indigo-600", note: "+12% Cycle", shadow: "shadow-indigo-500/20" },
                    { label: "Verified", value: "98.4%", icon: ShieldCheck, gradient: "from-purple-500 to-purple-600", note: "Automated Compliance", shadow: "shadow-purple-500/20" },
                    { label: "Speed", value: "1.2 Days", icon: Activity, gradient: "from-pink-500 to-pink-600", note: "Slashed by 70%", shadow: "shadow-pink-500/20" }
                  ].map((stat, i) => (
                    <div key={i} className={`bg-gradient-to-b ${stat.gradient} p-5 rounded-2xl text-white shadow-lg ${stat.shadow} transform hover:scale-[1.05] hover:rotate-2 transition-all duration-300`}>
                      <div className="flex items-center justify-between opacity-90 mb-2.5">
                        <span className="text-xs font-bold uppercase tracking-wider">{stat.label}</span>
                        <stat.icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="text-3xl font-black tracking-tight">{stat.value}</div>
                      <div className="text-[10px] bg-white/20 px-2 py-0.5 rounded-md font-bold mt-2.5 w-fit flex items-center gap-1.5">
                        {stat.note}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Rich Live Intake Feed */}
                <div className="bg-slate-50/80 border border-slate-100 rounded-2xl overflow-hidden shadow-inner backdrop-blur-sm">
                  <div className="px-5 py-4.5 bg-white border-b border-slate-100 flex justify-between items-center">
                    <span className="text-xs font-black text-slate-800 tracking-wide uppercase flex items-center gap-2">
                      <Target className="w-4 h-4 text-indigo-500 animate-pulse" /> Live Intake Activity
                    </span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-md shadow-emerald-500/30" />
                  </div>
                  <div className="divide-y divide-slate-100/70">
                    {[
                      { name: "Sarah Jenkins", role: "STEM Educator", school: "Lincoln High", status: "Shortlisted", gradient: "from-blue-500 to-indigo-500", style: "bg-indigo-100 text-indigo-800 border-indigo-200" },
                      { name: "Marcus Chen", role: "Principal Leader", school: "Oakridge Academy", status: "Reviewing", gradient: "from-purple-500 to-pink-500", style: "bg-amber-100 text-amber-800 border-amber-200" },
                      { name: "Elena Rostova", role: "Counselor", school: "Beacon Intl", status: "Verified", gradient: "from-cyan-500 to-blue-500", style: "bg-emerald-100 text-emerald-800 border-emerald-200" }
                    ].map((candidate, idx) => (
                      <div key={idx} className="p-4 flex items-center justify-between text-xs hover:bg-white transition-colors duration-200 cursor-pointer">
                        <div className="flex items-center gap-3.5">
                          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${candidate.gradient} flex items-center justify-center font-black text-white shadow-md text-sm`}>
                            {candidate.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <div className="font-extrabold text-slate-900 text-[13px]">{candidate.name}</div>
                            <div className="text-slate-500 font-semibold text-[11px]">{candidate.role} • {candidate.school}</div>
                          </div>
                        </div>
                        <div className="text-right flex flex-col items-end">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${candidate.style} flex gap-1 items-center`}>
                            {candidate.status}
                          </span>
                          <div className="text-[10px] text-slate-400 font-bold mt-1.5 flex gap-1 items-center"><Clock className="w-3 h-3"/>{idx === 0 ? 'Just now' : `${idx * 4}m ago`}</div>
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

      {/* STATS HIGHLIGHT GRID - SCALE-IN ANIMATION */}
      <section className="border-y border-indigo-100 bg-gradient-to-r from-indigo-50/50 via-purple-50/30 to-pink-50/50 py-20 reveal-scale">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 text-center">
            {[
              { count: "1,200+", label: "Partner Institutions", color: "from-indigo-600 to-indigo-800" },
              { count: "4.6M", label: "Candidates Tracked", color: "from-purple-600 to-purple-800" },
              { count: "25M+", label: "Portfolios Indexed", color: "from-pink-600 to-pink-800" },
              { count: "99.99%", label: "Platform Uptime", color: "from-cyan-600 to-blue-800" }
            ].map((stat, i) => (
              <div key={i} className="transform hover:scale-110 hover:-translate-y-1 transition-all duration-300">
                <div className={`text-5xl sm:text-6xl font-black tracking-tight bg-gradient-to-r ${stat.color} gradient-text-vibrant mb-2`}>
                  {stat.count}
                </div>
                <div className="text-sm sm:text-base font-bold uppercase tracking-wider text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PREMIUM FEATURES - STAGGERED REVEAL ANIMATIONS */}
      <section id="features" className="scroll-mt-20 py-24 lg:py-36 relative overflow-hidden">
        {/* Abstract Floating Shapes for Features Backdrop */}
        <div className="absolute top-[20%] left-[-10%] w-[400px] h-[400px] bg-gradient-to-r from-cyan-100 to-indigo-100 opacity-40 rounded-full blur-3xl animate-[floatShape_15s_infinite]" />
        <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] bg-gradient-to-r from-purple-100 to-pink-100 opacity-40 rounded-full blur-3xl animate-[floatShape_20s_infinite_reverse]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-28 reveal-up">
            <h2 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 mb-6 leading-tight">
              A vibrant architecture for <span className="gradient-text-vibrant">education scale.</span>
            </h2>
            <p className="text-lg sm:text-xl text-slate-600 font-medium">
              Ditch disconnected spreadsheets. Leverage an enterprise core infrastructure engineered to catalog and coordinate rich, deep institutional talent profiles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            {[
              {
                icon: <Database className="w-5 h-5 text-white" />,
                title: "Unified Database Structure",
                desc: "A singular, immutable source of truth for handling student portfolios, academic history, and background records.",
                bg: "from-blue-500 via-indigo-500 to-indigo-600",
                shadow: "shadow-indigo-500/20",
                delay: "" // No delay for first row
              },
              {
                icon: <Search className="w-5 h-5 text-white" />,
                title: "Smart Vector Search Engine",
                desc: "Blazing fast native indexing powered by AI heuristics to instantly parse, sort, and match applicant profiles.",
                bg: "from-purple-500 via-purple-600 to-pink-600",
                shadow: "shadow-purple-500/20",
                delay: "delay-100"
              },
              {
                icon: <SlidersHorizontal className="w-5 h-5 text-white" />,
                title: "Granular Multi-Dimensional Filters",
                desc: "Drill into hundreds of specific campus attributes: credentials, tenures, pedagogical specializations, and regional scores.",
                bg: "from-pink-500 via-rose-500 to-rose-600",
                shadow: "shadow-pink-500/20",
                delay: "delay-200"
              },
              {
                icon: <FileText className="w-5 h-5 text-white" />,
                title: "DocuVault Asset Intake",
                desc: "OCR extraction that intelligently reads, catalogs, and tags high-fidelity transcripts, licenses, and certificates.",
                bg: "from-cyan-500 via-blue-500 to-blue-600",
                shadow: "shadow-cyan-500/20",
                delay: "delay-300"
              },
              {
                icon: <School className="w-5 h-5 text-white" />,
                title: "Campus Silos & Access Control",
                desc: "Isolate and manage distinct nodes and security scopes across various branches, districts, or schools seamlessly.",
                bg: "from-emerald-500 via-teal-500 to-teal-600",
                shadow: "shadow-emerald-500/20",
                delay: "delay-400"
              },
              {
                icon: <ShieldCheck className="w-5 h-5 text-white" />,
                title: "FERPA & GDPR Compliance Ready",
                desc: "Data rest and transit protection meeting strict regulatory parameters with fully isolated system containers.",
                bg: "from-amber-500 via-orange-500 to-orange-600",
                shadow: "shadow-amber-500/20",
                delay: "delay-500"
              }
            ].map((feature, idx) => (
              <div 
                key={idx} 
                className={`group relative bg-white border border-slate-200 p-9 rounded-3xl transition-all duration-500 hover:-translate-y-2 hover:border-slate-300/90 hover:shadow-[0_25px_60px_-15px_rgba(99,102,241,0.15)] ${idx % 2 === 0 ? 'reveal-left' : 'reveal-right'} ${feature.delay}`}
              >
                {/* Subtle pulsing background glow on hover */}
                <div className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 ${feature.shadow} group-hover:animate-pulse transition-opacity duration-300 pointer-events-none`} />
                
                <div className={`p-3.5 bg-gradient-to-tr ${feature.bg} rounded-2xl w-fit mb-7 shadow-lg shadow-slate-200 group-hover:scale-115 group-hover:rotate-6 transition-all duration-300 relative z-10`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-4 tracking-tight group-hover:text-indigo-600 transition-colors relative z-10">
                  {feature.title}
                </h3>
                <p className="text-base text-slate-600 font-medium leading-relaxed relative z-10">
                  {feature.desc}
                </p>
                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                   <Unlock className="w-5 h-5 text-indigo-300" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS / PROCESS - UPWARD FADE-IN */}
      <section id="how-it-works" className="scroll-mt-20 py-28 lg:py-36 bg-gradient-to-b from-slate-100/70 to-white/70 border-y border-slate-200/80 relative backdrop-blur-sm overflow-hidden">
        {/* Animated Background Line for movement */}
        <div className="absolute top-[10%] left-0 right-0 h-0.5 bg-gradient-to-r from-white via-indigo-200 to-white opacity-60 animate-[pulseGlow_10s_infinite_linear]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-24 reveal-up">
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 mb-5 leading-tight">
              Designed for optimal intake velocity
            </h2>
            <p className="text-lg sm:text-xl text-slate-600 font-medium">
              We transition legacy admin processes into a state-of-the-art talent data ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 relative">
            {[
              { step: "01", title: "Tenant Provisioning", desc: "Instantly launch your unique corporate node, map custom domain routing, and set access parameters.", color: "text-blue-500" },
              { step: "02", title: "Ingest Candidates", desc: "Bulk synchronize candidate profiles via rapid file streams, mapping structures instantly.", color: "text-indigo-500" },
              { step: "03", title: "Enrich Portfolios", desc: "AI-driven tagging auto-extracts capability indexes, verifies history, and structures assets.", color: "text-purple-500" },
              { step: "04", title: "Query & Match", desc: "Run dynamic multi-dimensional queries to select optimal resources and deploy contracts.", color: "text-pink-500" }
            ].map((item, idx) => (
              <div key={idx} className={`relative group bg-white border border-slate-200/70 p-7 sm:p-8 rounded-3xl shadow-[0_4px_15px_-4px_rgba(99,102,241,0.06)] hover:shadow-xl transition-all duration-300 reveal-up delay-${idx * 100}`}>
                 {/* Connection lines between steps */}
                 {idx < 3 && (
                  <div className="hidden lg:block absolute top-[4.5rem] -right-5 w-10 border-t-2 border-dashed border-slate-200 group-hover:border-indigo-300 z-10 group-hover:scale-x-110 transition-transform origin-left" />
                )}
                
                <div className={`text-6xl sm:text-7xl font-black ${item.color} opacity-30 group-hover:opacity-100 mb-6 tracking-tighter transition-all duration-300 transform group-hover:scale-110 group-hover:-translate-y-2`}>
                  {item.step}
                </div>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 mb-3 tracking-tight group-hover:text-indigo-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm sm:text-base text-slate-600 font-semibold leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING PLANS - ZOOM-IN ANIMATION */}
      <section id="pricing" className="scroll-mt-20 py-24 lg:py-36 relative overflow-hidden">
        {/* Floating Shapes */}
        <div className="absolute top-[30%] right-[-15%] w-[450px] h-[450px] bg-gradient-to-br from-pink-100 to-amber-100 opacity-40 rounded-xl blur-3xl animate-[floatShape_18s_infinite]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-24 reveal-up">
            <h2 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 mb-5 leading-tight">
              Clear tiers for any institutional scale.
            </h2>
            <p className="text-lg sm:text-xl text-slate-600 font-medium">
              Simple structures tailored directly to the capacity boundaries your operations require.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-10 items-stretch">
            
            {/* PLAN 1 - Starter */}
            <div className="bg-white border border-slate-200 p-9 rounded-3xl flex flex-col justify-between hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 reveal-left delay-200 group">
              <div>
                <div className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-2.5">Starter Tier</div>
                <div className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight mb-1.5 gradient-text-vibrant">Free</div>
                <div className="text-xs text-slate-400 mb-10 font-bold">Perfect for single campus setup testing</div>
                <div className="space-y-4 mb-10">
                  {["Up to 250 Candidate Profiles", "Standard Fuzzy Search Engine", "Basic Document Uploads (2GB)", "Single Active Admin Seat", "Community Support Channel"].map((f, i) => (
                    <div key={i} className="flex items-center gap-3 text-base text-slate-600 font-semibold group-hover:text-slate-800">
                      <Check className="w-5 h-5 text-indigo-600 flex-shrink-0 stroke-[3]" /> {f}
                    </div>
                  ))}
                </div>
              </div>
              <Link to="/signup" className="w-full">
                <Button variant="outline" className="w-full border-slate-200 text-slate-700 hover:bg-slate-50 font-bold py-3.5 rounded-xl transition-all shadow-sm">
                  Launch Sandbox Node
                </Button>
              </Link>
            </div>

            {/* PLAN 2 - Popular Pro (Highlighted) */}
            <div className="relative bg-white border-2 border-indigo-600 p-9 rounded-3xl flex flex-col justify-between shadow-2xl shadow-indigo-600/15 transform lg:-translate-y-6 reveal-scale delay-100">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white text-[10px] font-black uppercase tracking-widest px-6 py-2 rounded-full shadow-lg">
                Most Operational Scale
              </div>
              <div>
                <div className="text-xs font-black text-purple-600 uppercase tracking-widest mb-2.5 mt-2.5">Professional Pro</div>
                <div className="text-4xl sm:text-5xl font-black text-indigo-950 tracking-tight mb-1.5 gradient-text-vibrant">
                  $149<span className="text-sm font-bold text-slate-400"> /month</span>
                </div>
                <div className="text-xs text-slate-400 mb-10 font-bold">Optimized for expanding district grids</div>
                <div className="space-y-4 mb-10">
                  {["Uncapped Profiles & Records", "Vector Smart Search Matrix", "Advanced Multi-Dimensional Filters", "High-Volume Asset OCR Processing", "Up to 15 Seat Coordinators", "Priority SLA Response Channels"].map((f, i) => (
                    <div key={i} className="flex items-center gap-3 text-base text-slate-800 font-bold">
                      <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 stroke-[3]" /> {f}
                    </div>
                  ))}
                </div>
              </div>
              <Link to="/signup" className="w-full">
                <Button className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all">
                  Provision Production instance
                </Button>
              </Link>
            </div>

            {/* PLAN 3 - Enterprise */}
            <div className="bg-white border border-slate-200 p-9 rounded-3xl flex flex-col justify-between hover:border-pink-300 hover:shadow-xl hover:shadow-pink-500/10 transition-all duration-300 reveal-right delay-200 group">
              <div>
                <div className="text-xs font-black text-pink-600 uppercase tracking-widest mb-2.5">Enterprise Grid</div>
                <div className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight mb-1.5 gradient-text-warm">Custom</div>
                <div className="text-xs text-slate-400 mb-10 font-bold">For massive multi-region institutions</div>
                <div className="space-y-4 mb-10">
                  {["Infinite Isolated Data Silos", "Dedicated Database clusters", "SAML/SSO Credentials Integration", "Uncapped System Storage Cloud", "On-Premises Air-Gapped Options", "24/7 Dedicated Support Engineer"].map((f, i) => (
                    <div key={i} className="flex items-center gap-3 text-base text-slate-600 font-semibold group-hover:text-slate-800">
                      <Check className="w-5 h-5 text-pink-500 flex-shrink-0 stroke-[3]" /> {f}
                    </div>
                  ))}
                </div>
              </div>
              <a href="#contact" onClick={(e) => handleScroll(e, 'contact')} className="w-full">
                <Button variant="outline" className="w-full border-slate-200 text-slate-700 hover:bg-slate-50 font-bold py-3.5 rounded-xl transition-all shadow-sm">
                  Contact Technical Sales
                </Button>
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* HIGHLIGHTED CTA VIBRANT BANNER - FADE IN */}
      <section className="py-20 lg:py-32 relative overflow-hidden border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 reveal-fade">
          <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 border border-slate-800 rounded-[2.5rem] p-12 sm:p-16 lg:p-20 text-center shadow-2xl relative overflow-hidden transform hover:scale-[1.01] transition-transform duration-500">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-[pulseGlow_8s_infinite]" />
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight mb-7 leading-tight">
              Accelerate your institution intake <span className="gradient-text-vibrant">velocity now.</span>
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-slate-300 max-w-3xl mx-auto mb-12 leading-relaxed font-semibold">
              Deploy nodes in moments. Harmonize application records dynamically. Construct an elite sovereign candidate tracking infrastructure.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
              <Link to="/signup" className="w-full sm:w-auto">
                <Button size="lg" className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:from-pink-600 hover:to-rose-600 font-bold px-10 py-4.5 rounded-xl shadow-lg shadow-pink-500/30 hover:scale-105 transition-all">
                  Launch Free Instance
                </Button>
              </Link>
              <a href="#contact" onClick={(e) => handleScroll(e, 'contact')} className="w-full sm:w-auto">
                <Button size="lg" variant="ghost" className="w-full text-slate-300 hover:text-white hover:bg-white/10 px-8 py-4.5 rounded-xl font-bold transition-all flex gap-1.5 items-center">
                   Analyze SLA Guarantees <ArrowRight className="w-4 h-4"/>
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* PREMIUM HIGH-CONTRAST FOOTER - ZOOM-IN */}
      <footer id="contact" className="scroll-mt-20 bg-white border-t border-slate-200 text-slate-500 text-xs py-20 relative z-10 reveal-scale delay-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
            
            <div className="md:col-span-4 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-600 rounded-xl shadow-md group hover:rotate-6 transition-transform">
                  <Database className="w-4 h-4 text-white" />
                </div>
                <span className="text-2xl font-black text-slate-900 tracking-tight gradient-text-vibrant">EduBase<span className="text-pink-500">.</span></span>
              </div>
              <p className="text-slate-600 max-w-sm leading-relaxed font-bold text-sm">
                Next-generation sovereign talent data workspace frameworks constructed for deep education systems.
              </p>
            </div>

            <div className="md:col-span-2 space-y-3.5 font-bold">
              <div className="font-black text-slate-900 uppercase tracking-wider text-[10px] bg-indigo-50 px-2.5 py-1 rounded-md w-fit">Product Engineering</div>
              {[{l: 'Core Engine Grid', t: 'features'}, {l: 'Smart Lookup Core', t: 'features'}, {l: 'DocuVault Vaulting', t: 'features'}, {l: 'Pricing Ledger', t: 'pricing'}].map(link => (
                <div key={link.l}><a href={`#${link.t}`} onClick={(e) => handleScroll(e, link.t)} className="hover:text-indigo-600 transition-colors">{link.l}</a></div>
              ))}
            </div>

            <div className="md:col-span-2 space-y-3.5 font-bold">
              <div className="font-black text-slate-900 uppercase tracking-wider text-[10px] bg-purple-50 px-2.5 py-1 rounded-md w-fit">Sovereignty Matrix</div>
              {['FERPA Guarantees', 'GDPR Privacy Core', 'SOC2 Certifications', 'Data Cryptography'].map(link => (
                <div key={link}><span className="hover:text-indigo-600 transition-colors cursor-pointer">{link}</span></div>
              ))}
            </div>

            <div className="md:col-span-4 space-y-4 font-bold">
              <div className="font-black text-slate-900 uppercase tracking-wider text-[10px] bg-pink-50 px-2.5 py-1 rounded-md w-fit">System Synchronization Updates</div>
              <p className="text-slate-600 leading-relaxed font-semibold">Stay harmonized with architectural modifications, compliance alterations, and core updates.</p>
              <div className="flex gap-2 max-w-md">
                <input 
                  type="email" 
                  placeholder="admin@school.edu" 
                  className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 w-full text-slate-900 placeholder-slate-400 font-semibold text-xs focus:outline-none focus:border-indigo-500 transition-colors"
                />
                <Button className="bg-slate-900 text-white px-5 rounded-xl hover:bg-slate-800 font-bold text-xs shadow-md">
                  Sync
                </Button>
              </div>
            </div>

          </div>

          <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 text-slate-400 font-bold text-[11px] uppercase tracking-wider">
            <div>&copy; 2026 EduBase Technology Inc. All production nodes active.</div>
            <div className="flex space-x-6">
              <span className="hover:text-slate-600 cursor-pointer">SLA Operational map</span>
              <span className="hover:text-slate-600 cursor-pointer">Privacy Map</span>
              <span className="hover:text-slate-600 cursor-pointer">Terms of Infrastructure</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}