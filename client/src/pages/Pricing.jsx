import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Check, Sparkles, ShieldCheck, ArrowRight, HelpCircle, GraduationCap } from 'lucide-react';

export default function Pricing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-indigo-50/20 to-white text-slate-800 font-sans antialiased selection:bg-indigo-500/10">
      
      {/* Premium Navbar Sticky Module */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-black tracking-tight bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent hover:opacity-90 transition-opacity">
                BioData Manager
              </Link>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-6">
              <Link to="/features" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 px-3 py-2 rounded-xl hover:bg-slate-50 transition-all">
                Features
              </Link>
              <Link to="/pricing" className="text-sm font-semibold text-indigo-600 bg-indigo-50/70 px-4 py-2 rounded-xl transition-all">
                Pricing
              </Link>
              <Link to="/contact" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 px-3 py-2 rounded-xl hover:bg-slate-50 transition-all">
                Contact
              </Link>
              <span className="h-5 w-px bg-slate-200/80 mx-2 hidden sm:inline-block" />
              <Link to="/login" className="hidden sm:inline-block">
                <Button variant="outline" className="h-10 rounded-xl border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 hover:text-indigo-600 transition-all px-5">Login</Button>
              </Link>
              <Link to="/signup">
                <Button className="h-10 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold shadow-md shadow-indigo-600/10 hover:shadow-lg hover:shadow-indigo-600/20 transition-all px-5 hover:-translate-y-0.5">Sign Up</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Framework Content Canvas */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        
        {/* Dynamic Header Copywriting Container */}
        <div className="text-center mb-16 md:mb-24 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-6 w-32 h-32 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold uppercase tracking-widest mb-4">
            <Sparkles className="h-3 w-3" /> Flexible Architecture
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-none">
            Simple, Transparent
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"> Pricing</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
            Choose the plan that fits your school's needs. Start with a free trial today.
          </p>
        </div>

        {/* Pricing Cards Structural Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 items-stretch max-w-6xl mx-auto">
          
          {/* PLAN 1: Basic */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/40 flex flex-col justify-between relative overflow-hidden group hover:shadow-2xl hover:border-slate-200 transition-all duration-300 hover:-translate-y-1">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-1">Basic</h3>
                <p className="text-sm font-medium text-slate-400">Perfect for small schools</p>
              </div>
              
              <div className="flex items-baseline gap-1 py-2 border-y border-slate-50">
                <span className="text-4xl font-black text-slate-900 tracking-tight">₹999</span>
                <span className="text-sm font-semibold text-slate-400">/month</span>
              </div>
              
              <ul className="space-y-4">
                <li className="flex items-start text-sm font-medium text-slate-600 gap-3">
                  <div className="p-0.5 bg-emerald-50 rounded-md text-emerald-600 shrink-0 mt-0.5 border border-emerald-100">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                  <span>Up to 100 candidates</span>
                </li>
                <li className="flex items-start text-sm font-medium text-slate-600 gap-3">
                  <div className="p-0.5 bg-emerald-50 rounded-md text-emerald-600 shrink-0 mt-0.5 border border-emerald-100">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                  <span>Basic document storage</span>
                </li>
                <li className="flex items-start text-sm font-medium text-slate-600 gap-3">
                  <div className="p-0.5 bg-emerald-50 rounded-md text-emerald-600 shrink-0 mt-0.5 border border-emerald-100">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                  <span>Email support</span>
                </li>
              </ul>
            </div>

            <Link to="/signup" className="block w-full mt-8">
              <Button variant="outline" className="w-full h-11 border-slate-200 hover:bg-slate-50 text-slate-600 font-bold rounded-xl transition-all shadow-sm">
                Start Free Trial
              </Button>
            </Link>
          </div>

          {/* PLAN 2: Standard (Highlighted Component) */}
          <div className="bg-white p-8 rounded-3xl border-2 border-indigo-600 shadow-2xl shadow-indigo-600/10 flex flex-col justify-between relative overflow-hidden transform lg:-translate-y-4 transition-all duration-300">
            <div className="absolute top-0 right-0 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white px-5 py-1.5 rounded-bl-2xl text-xs font-black tracking-widest uppercase shadow-sm">
              Popular
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-1 flex items-center gap-2">
                  Standard <GraduationCap className="h-4 w-4 text-indigo-500" />
                </h3>
                <p className="text-sm font-medium text-indigo-500/80 font-semibold">For growing schools</p>
              </div>
              
              <div className="flex items-baseline gap-1 py-2 border-y border-slate-100">
                <span className="text-4xl font-black bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent tracking-tight">₹2,499</span>
                <span className="text-sm font-semibold text-slate-400">/month</span>
              </div>
              
              <ul className="space-y-4">
                <li className="flex items-start text-sm font-bold text-slate-700 gap-3">
                  <div className="p-0.5 bg-emerald-50 rounded-md text-emerald-600 shrink-0 mt-0.5 border border-emerald-100">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                  <span>Up to 500 candidates</span>
                </li>
                <li className="flex items-start text-sm font-bold text-slate-700 gap-3">
                  <div className="p-0.5 bg-emerald-50 rounded-md text-emerald-600 shrink-0 mt-0.5 border border-emerald-100">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                  <span>Advanced document storage</span>
                </li>
                <li className="flex items-start text-sm font-bold text-slate-700 gap-3">
                  <div className="p-0.5 bg-emerald-50 rounded-md text-emerald-600 shrink-0 mt-0.5 border border-emerald-100">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                  <span>Priority support</span>
                </li>
                <li className="flex items-start text-sm font-bold text-slate-700 gap-3">
                  <div className="p-0.5 bg-emerald-50 rounded-md text-emerald-600 shrink-0 mt-0.5 border border-emerald-100">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                  <span>Custom settings</span>
                </li>
              </ul>
            </div>

            <Link to="/signup" className="block w-full mt-8">
              <Button className="w-full h-11 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/10 hover:shadow-xl transition-all hover:-translate-y-0.5">
                Start Free Trial
              </Button>
            </Link>
          </div>

          {/* PLAN 3: Premium */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/40 flex flex-col justify-between relative overflow-hidden group hover:shadow-2xl hover:border-slate-200 transition-all duration-300 hover:-translate-y-1">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-1">Premium</h3>
                <p className="text-sm font-medium text-slate-400">For large institutions</p>
              </div>
              
              <div className="flex items-baseline gap-1 py-2 border-y border-slate-50">
                <span className="text-4xl font-black text-slate-900 tracking-tight">₹4,999</span>
                <span className="text-sm font-semibold text-slate-400">/month</span>
              </div>
              
              <ul className="space-y-4">
                <li className="flex items-start text-sm font-medium text-slate-600 gap-3">
                  <div className="p-0.5 bg-emerald-50 rounded-md text-emerald-600 shrink-0 mt-0.5 border border-emerald-100">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                  <span>Unlimited candidates</span>
                </li>
                <li className="flex items-start text-sm font-medium text-slate-600 gap-3">
                  <div className="p-0.5 bg-emerald-50 rounded-md text-emerald-600 shrink-0 mt-0.5 border border-emerald-100">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                  <span>Unlimited document storage</span>
                </li>
                <li className="flex items-start text-sm font-medium text-slate-600 gap-3">
                  <div className="p-0.5 bg-emerald-50 rounded-md text-emerald-600 shrink-0 mt-0.5 border border-emerald-100">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                  <span>24/7 phone support</span>
                </li>
                <li className="flex items-start text-sm font-medium text-slate-600 gap-3">
                  <div className="p-0.5 bg-emerald-50 rounded-md text-emerald-600 shrink-0 mt-0.5 border border-emerald-100">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                  <span>Dedicated account manager</span>
                </li>
              </ul>
            </div>

            <Link to="/signup" className="block w-full mt-8">
              <Button variant="outline" className="w-full h-11 border-slate-200 hover:bg-slate-50 text-slate-600 font-bold rounded-xl transition-all shadow-sm">
                Start Free Trial
              </Button>
            </Link>
          </div>

        </div>

        {/* Global Informational Bottom Footnotes */}
        <div className="mt-16 bg-slate-50/60 border border-slate-100 p-6 rounded-2xl max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-around text-center gap-4 shadow-inner">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
            <Check className="w-5 h-5 text-indigo-500 stroke-[3]" /> All plans include a 30-day free trial
          </div>
          <div className="hidden sm:block h-6 w-px bg-slate-200" />
          <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
            <ShieldCheck className="w-5 h-5 text-indigo-500 stroke-[3]" /> No credit card required
          </div>
        </div>

      </main>

      {/* Styled Footing Core Section Element */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-10 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p className="text-xs md:text-sm font-medium">&copy; 2026 BioData Manager. All rights reserved.</p>
          <div className="flex gap-6 text-xs font-semibold">
            <a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}