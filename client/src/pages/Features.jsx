import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { 
  Users, 
  FileText, 
  Search, 
  Sliders, 
  ClipboardList, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles 
} from 'lucide-react';

export default function Features() {
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
              <Link to="/features" className="text-sm font-semibold text-[#A05AFF] bg-[#A05AFF]/10 px-4 py-2 rounded-xl transition-all">
                Features
              </Link>
              <Link to="/pricing" className="text-sm font-semibold text-slate-600 hover:text-[#A05AFF] px-3 py-2 rounded-xl hover:bg-slate-50 transition-all dark:text-slate-400 dark:hover:bg-slate-800">
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

      {/* Main Container Core Viewport */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Page Header Panel Layout */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-[#A05AFF]/30 bg-[#A05AFF]/5 text-[#A05AFF] text-[11px] font-bold uppercase tracking-wider mb-2">
              <Sparkles className="h-3 w-3" /> Core Capabilities
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800 dark:text-white">
              Powerful Features for Modern Schools
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-2xl font-medium leading-relaxed">
              Everything you need to manage your candidate recruitment process efficiently.
            </p>
          </div>
        </div>

        {/* Feature Structural Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card 1: Candidate Profiles */}
          <div className="rounded-xl border-none bg-white shadow-sm p-5 dark:bg-slate-900 transition-all hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
            <div className="p-2.5 border border-[#4BCBEB]/30 bg-[#4BCBEB]/5 text-[#4BCBEB] rounded-xl w-fit mb-4">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold tracking-wide text-slate-800 dark:text-slate-200 mb-2">Candidate Profiles</h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-medium leading-relaxed">
              Create detailed candidate profiles with qualifications, experience, and skills.
            </p>
          </div>

          {/* Card 2: Document Upload */}
          <div className="rounded-xl border-none bg-white shadow-sm p-5 dark:bg-slate-900 transition-all hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
            <div className="p-2.5 border border-[#9E58FF]/30 bg-[#9E58FF]/5 text-[#9E58FF] rounded-xl w-fit mb-4">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold tracking-wide text-slate-800 dark:text-slate-200 mb-2">Document Upload</h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-medium leading-relaxed">
              Upload and manage candidate documents like resumes, certificates, and IDs.
            </p>
          </div>

          {/* Card 3: Advanced Search */}
          <div className="rounded-xl border-none bg-white shadow-sm p-5 dark:bg-slate-900 transition-all hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
            <div className="p-2.5 border border-[#4BCBEB]/30 bg-[#4BCBEB]/5 text-[#4BCBEB] rounded-xl w-fit mb-4">
              <Search className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold tracking-wide text-slate-800 dark:text-slate-200 mb-2">Advanced Search</h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-medium leading-relaxed">
              Search candidates by position, qualification, subject, or experience.
            </p>
          </div>

          {/* Card 4: Customizable Settings */}
          <div className="rounded-xl border-none bg-white shadow-sm p-5 dark:bg-slate-900 transition-all hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
            <div className="p-2.5 border border-[#A05AFF]/30 bg-[#A05AFF]/5 text-[#A05AFF] rounded-xl w-fit mb-4">
              <Sliders className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold tracking-wide text-slate-800 dark:text-slate-200 mb-2">Customizable Settings</h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-medium leading-relaxed">
              Configure positions, subjects, classes, and qualifications to match your needs.
            </p>
          </div>

          {/* Card 5: Application Tracking */}
          <div className="rounded-xl border-none bg-white shadow-sm p-5 dark:bg-slate-900 transition-all hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
            <div className="p-2.5 border border-[#1BCFB4]/30 bg-[#1BCFB4]/5 text-[#1BCFB4] rounded-xl w-fit mb-4">
              <ClipboardList className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold tracking-wide text-slate-800 dark:text-slate-200 mb-2">Application Tracking</h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-medium leading-relaxed">
              Track candidate applications through your recruitment pipeline.
            </p>
          </div>

          {/* Card 6: Secure Data */}
          <div className="rounded-xl border-none bg-white shadow-sm p-5 dark:bg-slate-900 transition-all hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
            <div className="p-2.5 border border-[#FE9496]/30 bg-[#FE9496]/5 text-[#FE9496] rounded-xl w-fit mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold tracking-wide text-slate-800 dark:text-slate-200 mb-2">Secure Data</h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-medium leading-relaxed">
              Your data is protected with enterprise-grade security measures.
            </p>
          </div>

        </div>

        {/* Action Bottom Section Wrapper */}
        <div className="mt-12 text-center">
          <Link to="/signup">
            <Button size="lg" className="h-11 rounded-xl bg-[#A05AFF] hover:bg-[#A05AFF]/90 text-white font-bold tracking-wide px-8 shadow-sm transition-all flex items-center mx-auto gap-2">
              <span>Get Started Today</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </main>

      {/* Premium Footing Core Area */}
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