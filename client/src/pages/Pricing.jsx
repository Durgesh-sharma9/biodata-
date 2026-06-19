import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Check, Sparkles, ShieldCheck, ArrowRight, GraduationCap } from 'lucide-react';

export default function Pricing() {
  return (
    <div className="min-h-screen bg-[#f3f3f4] text-slate-800 font-sans antialiased dark:bg-slate-950 dark:text-slate-200">
      
      {/* Premium Navbar Sticky Module */}
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-100 shadow-sm dark:bg-slate-900 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <Link to="/" className="text-xl font-bold tracking-tight text-[#A05AFF] hover:opacity-90 transition-opacity">
                BioData Manager
              </Link>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-6">
              <Link to="/features" className="text-sm font-semibold text-slate-600 hover:text-[#A05AFF] px-3 py-2 rounded-xl hover:bg-slate-50 transition-all dark:text-slate-400 dark:hover:bg-slate-800">
                Features
              </Link>
              <Link to="/pricing" className="text-sm font-semibold text-[#A05AFF] bg-[#A05AFF]/10 px-4 py-2 rounded-xl transition-all">
                Pricing
              </Link>
              <Link to="/contact" className="text-sm font-semibold text-slate-600 hover:text-[#A05AFF] px-3 py-2 rounded-xl hover:bg-slate-50 transition-all dark:text-slate-400 dark:hover:bg-slate-800">
                Contact
              </Link>
              <span className="h-5 w-px bg-slate-200 mx-2 hidden sm:inline-block dark:bg-slate-800" />
              <Link to="/login" className="hidden sm:inline-block">
                <Button variant="outline" className="h-10 rounded-xl border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 hover:text-[#A05AFF] transition-all px-5 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800">Login</Button>
              </Link>
              <Link to="/signup">
                <Button className="h-10 rounded-xl bg-[#A05AFF] hover:bg-[#A05AFF]/90 text-white font-semibold shadow-sm transition-all px-5">Sign Up</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Framework Content Canvas */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Page Header Panel Layout */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-[#A05AFF]/30 bg-[#A05AFF]/5 text-[#A05AFF] text-[11px] font-bold uppercase tracking-wider mb-2">
              <Sparkles className="h-3 w-3" /> Flexible Architecture
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800 dark:text-white">
              Simple, Transparent Pricing
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-2xl font-medium leading-relaxed">
              Choose the plan that fits your school's needs. Start with a free trial today.
            </p>
          </div>
        </div>

        {/* Pricing Cards Structural Columns (CSS Grid Constraints) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto items-stretch">
          
          {/* PLAN 1: Basic */}
          <div className="rounded-xl border-none bg-white shadow-sm p-6 dark:bg-slate-900 flex flex-col justify-between transition-all hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold tracking-wide text-slate-800 dark:text-slate-200 mb-1">Basic</h3>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Perfect for small schools</p>
              </div>
              
              <div className="flex items-baseline gap-1 py-2 border-y border-slate-100 dark:border-slate-800">
                <span className="text-3xl font-bold tracking-tight text-slate-800 dark:text-white">₹999</span>
                <span className="text-xs font-semibold text-slate-400">/month</span>
              </div>
              
              <ul className="space-y-3.5">
                <li className="flex items-start text-xs font-semibold text-slate-600 dark:text-slate-400 gap-2.5">
                  <Check className="w-4 h-4 text-[#A05AFF] flex-shrink-0" />
                  <span>Up to 100 candidates</span>
                </li>
                <li className="flex items-start text-xs font-semibold text-slate-600 dark:text-slate-400 gap-2.5">
                  <Check className="w-4 h-4 text-[#A05AFF] flex-shrink-0" />
                  <span>Basic document storage</span>
                </li>
                <li className="flex items-start text-xs font-semibold text-slate-600 dark:text-slate-400 gap-2.5">
                  <Check className="w-4 h-4 text-[#A05AFF] flex-shrink-0" />
                  <span>Email support</span>
                </li>
              </ul>
            </div>

            <Link to="/signup" className="block w-full mt-6">
              <Button variant="outline" className="w-full h-10 border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-[#A05AFF] font-bold rounded-xl text-xs transition-all shadow-sm dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800">
                Start Free Trial
              </Button>
            </Link>
          </div>

          {/* PLAN 2: Standard (Violet Code Highlighted Component) */}
          <div className="rounded-xl border-2 border-[#A05AFF] bg-white shadow-sm p-6 dark:bg-slate-900 flex flex-col justify-between relative">
            <div className="absolute top-0 right-0 bg-[#A05AFF] text-white px-3 py-1 rounded-bl-xl text-[9px] font-bold tracking-wider uppercase">
              Popular
            </div>
            
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold tracking-wide text-slate-800 dark:text-white mb-1 flex items-center gap-1.5">
                  Standard <GraduationCap className="h-4 w-4 text-[#A05AFF]" />
                </h3>
                <p className="text-xs text-[#A05AFF] font-bold">For growing schools</p>
              </div>
              
              <div className="flex items-baseline gap-1 py-2 border-y border-slate-100 dark:border-slate-800">
                <span className="text-3xl font-bold tracking-tight text-slate-800 dark:text-white">₹2,499</span>
                <span className="text-xs font-semibold text-slate-400">/month</span>
              </div>
              
              <ul className="space-y-3.5">
                <li className="flex items-start text-xs font-bold text-slate-800 dark:text-slate-200 gap-2.5">
                  <Check className="w-4 h-4 text-[#1BCFB4] flex-shrink-0" />
                  <span>Up to 500 candidates</span>
                </li>
                <li className="flex items-start text-xs font-bold text-slate-800 dark:text-slate-200 gap-2.5">
                  <Check className="w-4 h-4 text-[#1BCFB4] flex-shrink-0" />
                  <span>Advanced document storage</span>
                </li>
                <li className="flex items-start text-xs font-bold text-slate-800 dark:text-slate-200 gap-2.5">
                  <Check className="w-4 h-4 text-[#1BCFB4] flex-shrink-0" />
                  <span>Priority support</span>
                </li>
                <li className="flex items-start text-xs font-bold text-slate-800 dark:text-slate-200 gap-2.5">
                  <Check className="w-4 h-4 text-[#1BCFB4] flex-shrink-0" />
                  <span>Custom settings</span>
                </li>
              </ul>
            </div>

            <Link to="/signup" className="block w-full mt-6">
              <Button className="w-full h-10 bg-[#A05AFF] hover:bg-[#A05AFF]/90 text-white font-bold rounded-xl text-xs shadow-sm transition-all">
                Start Free Trial
              </Button>
            </Link>
          </div>

          {/* PLAN 3: Premium */}
          <div className="rounded-xl border-none bg-white shadow-sm p-6 dark:bg-slate-900 flex flex-col justify-between transition-all hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold tracking-wide text-slate-800 dark:text-slate-200 mb-1">Premium</h3>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">For large institutions</p>
              </div>
              
              <div className="flex items-baseline gap-1 py-2 border-y border-slate-100 dark:border-slate-800">
                <span className="text-3xl font-bold tracking-tight text-slate-800 dark:text-white">₹4,999</span>
                <span className="text-xs font-semibold text-slate-400">/month</span>
              </div>
              
              <ul className="space-y-3.5">
                <li className="flex items-start text-xs font-semibold text-slate-600 dark:text-slate-400 gap-2.5">
                  <Check className="w-4 h-4 text-[#9E58FF] flex-shrink-0" />
                  <span>Unlimited candidates</span>
                </li>
                <li className="flex items-start text-xs font-semibold text-slate-600 dark:text-slate-400 gap-2.5">
                  <Check className="w-4 h-4 text-[#9E58FF] flex-shrink-0" />
                  <span>Unlimited document storage</span>
                </li>
                <li className="flex items-start text-xs font-semibold text-slate-600 dark:text-slate-400 gap-2.5">
                  <Check className="w-4 h-4 text-[#9E58FF] flex-shrink-0" />
                  <span>24/7 phone support</span>
                </li>
                <li className="flex items-start text-xs font-semibold text-slate-600 dark:text-slate-400 gap-2.5">
                  <Check className="w-4 h-4 text-[#9E58FF] flex-shrink-0" />
                  <span>Dedicated account manager</span>
                </li>
              </ul>
            </div>

            <Link to="/signup" className="block w-full mt-6">
              <Button variant="outline" className="w-full h-10 border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-[#A05AFF] font-bold rounded-xl text-xs transition-all shadow-sm dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800">
                Start Free Trial
              </Button>
            </Link>
          </div>

        </div>

        {/* Modern Soft-Tint Badges Footnotes */}
        <div className="mt-12 max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-around text-center gap-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#1BCFB4]/30 bg-[#1BCFB4]/5 text-[#1BCFB4] text-xs font-bold uppercase tracking-wider">
            <Check className="w-3.5 h-3.5" /> All plans include a 30-day free trial
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#4BCBEB]/30 bg-[#4BCBEB]/5 text-[#4BCBEB] text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" /> No credit card required
          </div>
        </div>

      </main>

      {/* Modern Flat Canvas Footer Module Layout */}
      <footer className="bg-white border-t border-slate-100 text-slate-400 py-8 mt-12 dark:bg-slate-900 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p className="text-xs font-medium text-slate-400">&copy; 2026 BioData Manager. All rights reserved.</p>
          <div className="flex gap-6 text-xs font-semibold">
            <a href="#privacy" className="hover:text-[#A05AFF] text-slate-500 dark:text-slate-400 transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-[#A05AFF] text-slate-500 dark:text-slate-400 transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}