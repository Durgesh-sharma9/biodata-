import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Mail, Phone, MapPin, Clock, LifeBuoy, ArrowRight, Sparkles, Send } from 'lucide-react';

export default function Contact() {
  return (
    <div className="min-h-screen bg-[#f3f3f4] text-slate-800 font-sans antialiased dark:bg-slate-950 dark:text-slate-200">
      {/* Premium Navbar */}
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
              <Link to="/pricing" className="text-sm font-semibold text-slate-600 hover:text-[#A05AFF] px-3 py-2 rounded-xl hover:bg-slate-50 transition-all dark:text-slate-400 dark:hover:bg-slate-800">
                Pricing
              </Link>
              <Link to="/contact" className="text-sm font-semibold text-[#A05AFF] bg-[#A05AFF]/10 px-3 py-2 rounded-xl transition-all">
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header Panel Layout */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-[#A05AFF]/30 bg-[#A05AFF]/5 text-[#A05AFF] text-[11px] font-bold uppercase tracking-wider mb-2">
              <Sparkles className="h-3 w-3" /> Connect with us
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800 dark:text-white">
              Get in Touch
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-2xl font-medium leading-relaxed">
              Have questions? We'd love to hear from you. Send us a message and our global support group will respond as soon as possible.
            </p>
          </div>
        </div>

        {/* Dynamic Matrix Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto">
          
          {/* Form Component Block */}
          <div className="lg:col-span-7 bg-white p-6 rounded-xl border-none shadow-sm dark:bg-slate-900">
            <h2 className="text-sm font-bold tracking-wide text-slate-800 dark:text-slate-200 mb-1">Send us a message</h2>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-6">Fill out the short framework parameters below.</p>
            
            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="name" className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl transition-all placeholder:text-slate-400 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A05AFF] focus-visible:border-[#A05AFF]/50 dark:bg-slate-950 dark:border-slate-800"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl transition-all placeholder:text-slate-400 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A05AFF] focus-visible:border-[#A05AFF]/50 dark:bg-slate-950 dark:border-slate-800"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl transition-all placeholder:text-slate-400 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A05AFF] focus-visible:border-[#A05AFF]/50 dark:bg-slate-950 dark:border-slate-800"
                  placeholder="How can we help?"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="w-full p-4 bg-white border border-slate-200 rounded-xl transition-all placeholder:text-slate-400 text-sm font-medium resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A05AFF] focus-visible:border-[#A05AFF]/50 dark:bg-slate-950 dark:border-slate-800"
                  placeholder="Write your brief message text here..."
                />
              </div>
              
              <Button type="submit" className="w-full h-11 rounded-xl bg-[#A05AFF] hover:bg-[#A05AFF]/90 text-white font-bold tracking-wide shadow-sm transition-all flex items-center justify-center gap-2">
                <span>Send Message</span>
                <Send className="h-4 w-4 text-white/80" />
              </Button>
            </form>
          </div>

          {/* Descriptive Information Hub Sidebar Panel Layout */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Contact Information Cards */}
            <div className="bg-white p-5 rounded-xl border-none shadow-sm dark:bg-slate-900">
              <h3 className="text-sm font-bold tracking-wide text-slate-800 dark:text-slate-200 mb-5 flex items-center gap-2">
                <span className="w-1 h-4 bg-[#A05AFF] rounded-full" /> Contact Information
              </h3>
              <div className="space-y-5">
                <div className="flex items-start">
                  <div className="p-2.5 rounded-lg border border-[#A05AFF]/30 bg-[#A05AFF]/5 text-[#A05AFF]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="ml-4">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-0.5">Email</p>
                    <a href="mailto:support@biodatamanager.com" className="font-semibold text-slate-700 hover:text-[#A05AFF] transition-colors text-sm break-all dark:text-slate-300">
                      support@biodatamanager.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="p-2.5 rounded-lg border border-[#4BCBEB]/30 bg-[#4BCBEB]/5 text-[#4BCBEB]">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="ml-4">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-0.5">Phone</p>
                    <a href="tel:+919876543210" className="font-semibold text-slate-700 hover:text-[#4BCBEB] transition-colors text-sm dark:text-slate-300">
                      +91 98765 43210
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="p-2.5 rounded-lg border border-[#9E58FF]/30 bg-[#9E58FF]/5 text-[#9E58FF]">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="ml-4">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-0.5">Address</p>
                    <p className="font-semibold text-slate-700 text-sm leading-relaxed dark:text-slate-300">
                      123 Tech Park, New Delhi, India
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Hours Container Layout */}
            <div className="bg-white p-5 rounded-xl border-none shadow-sm dark:bg-slate-900 flex items-start">
              <div className="p-2.5 rounded-lg border border-[#1BCFB4]/30 bg-[#1BCFB4]/5 text-[#1BCFB4] mr-4">
                <Clock className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold tracking-wide text-slate-800 dark:text-slate-200 mb-3">Business Hours</h3>
                <div className="space-y-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <div className="flex justify-between border-b border-slate-100 pb-1 dark:border-slate-800">
                    <span>Monday - Friday</span>
                    <span className="text-slate-700 dark:text-slate-300">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-1 dark:border-slate-800">
                    <span>Saturday</span>
                    <span className="text-slate-700 dark:text-slate-300">10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Sunday</span>
                    <span className="inline-block border border-[#FE9496]/30 bg-[#FE9496]/5 text-[#FE9496] font-bold px-1.5 py-0.5 rounded text-[10px]">CLOSED</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Support Metrics Information Box */}
            <div className="bg-white p-5 rounded-xl border-none shadow-sm dark:bg-slate-900 flex items-start">
              <div className="p-2.5 rounded-lg border border-[#A05AFF]/30 bg-[#A05AFF]/5 text-[#A05AFF] mr-4 shrink-0">
                <LifeBuoy className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold tracking-wide text-slate-800 dark:text-slate-200 mb-1">Technical Support</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 leading-relaxed font-medium">
                  Please remember to include your unique assigned <span className="text-[#A05AFF] font-bold">school ID</span> credentials along with a descriptive overview log of the anomaly encountered.
                </p>
                <div className="flex items-center gap-1.5 text-[11px] text-[#A05AFF] font-bold uppercase tracking-wider">
                  <span>Response timeframe: &lt; 24 business hours</span>
                  <ArrowRight className="h-3 w-3" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Styled Footer Block Element */}
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