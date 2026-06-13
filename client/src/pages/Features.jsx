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
              <Link to="/features" className="text-sm font-semibold text-indigo-600 bg-indigo-50/70 px-4 py-2 rounded-xl transition-all">
                Features
              </Link>
              <Link to="/pricing" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 px-3 py-2 rounded-xl hover:bg-slate-50 transition-all">
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

      {/* Main Container Core Viewport */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        
        {/* Dynamic Typography Centered Header Section */}
        <div className="text-center mb-20 md:mb-28 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-6 w-32 h-32 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold uppercase tracking-widest mb-4">
            <Sparkles className="h-3 w-3" /> Core Capabilities
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-none">
            Powerful Features for <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent">Modern Schools</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
            Everything you need to manage your candidate recruitment process efficiently.
          </p>
        </div>

        {/* Feature Grid Matrices Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Card 1: Candidate Profiles */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/40 relative overflow-hidden group hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-300 hover:-translate-y-1">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl w-fit border border-blue-100/50 mb-6 group-hover:scale-110 transition-transform duration-300">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">Candidate Profiles</h3>
            <p className="text-slate-500 text-sm font-medium leading-relaxed">
              Create detailed candidate profiles with qualifications, experience, and skills.
            </p>
          </div>

          {/* Card 2: Document Upload */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/40 relative overflow-hidden group hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-300 hover:-translate-y-1">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl w-fit border border-purple-100/50 mb-6 group-hover:scale-110 transition-transform duration-300">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">Document Upload</h3>
            <p className="text-slate-500 text-sm font-medium leading-relaxed">
              Upload and manage candidate documents like resumes, certificates, and IDs.
            </p>
          </div>

          {/* Card 3: Advanced Search */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/40 relative overflow-hidden group hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-300 hover:-translate-y-1">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="p-3 bg-cyan-50 text-cyan-600 rounded-2xl w-fit border border-cyan-100/50 mb-6 group-hover:scale-110 transition-transform duration-300">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">Advanced Search</h3>
            <p className="text-slate-500 text-sm font-medium leading-relaxed">
              Search candidates by position, qualification, subject, or experience.
            </p>
          </div>

          {/* Card 4: Customizable Settings */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/40 relative overflow-hidden group hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-300 hover:-translate-y-1">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl w-fit border border-orange-100/50 mb-6 group-hover:scale-110 transition-transform duration-300">
              <Sliders className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">Customizable Settings</h3>
            <p className="text-slate-500 text-sm font-medium leading-relaxed">
              Configure positions, subjects, classes, and qualifications to match your needs.
            </p>
          </div>

          {/* Card 5: Application Tracking */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/40 relative overflow-hidden group hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-300 hover:-translate-y-1">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl w-fit border border-emerald-100/50 mb-6 group-hover:scale-110 transition-transform duration-300">
              <ClipboardList className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">Application Tracking</h3>
            <p className="text-slate-500 text-sm font-medium leading-relaxed">
              Track candidate applications through your recruitment pipeline.
            </p>
          </div>

          {/* Card 6: Secure Data */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/40 relative overflow-hidden group hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-300 hover:-translate-y-1">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl w-fit border border-indigo-100/50 mb-6 group-hover:scale-110 transition-transform duration-300">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">Secure Data</h3>
            <p className="text-slate-500 text-sm font-medium leading-relaxed">
              Your data is protected with enterprise-grade security measures.
            </p>
          </div>

        </div>

        {/* Action Bottom Section Wrapper */}
        <div className="mt-20 text-center">
          <Link to="/signup">
            <Button size="lg" className="h-12 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold tracking-wide px-8 shadow-lg shadow-slate-900/10 hover:shadow-xl transition-all hover:-translate-y-0.5 group/action flex items-center mx-auto gap-2">
              <span>Get Started Today</span>
              <ArrowRight className="h-4 w-4 text-slate-400 group-hover/action:translate-x-1 group-hover/action:text-white transition-all" />
            </Button>
          </Link>
        </div>
      </main>

      {/* Premium Footing Core Area */}
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