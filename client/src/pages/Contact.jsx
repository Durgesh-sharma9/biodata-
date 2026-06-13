import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Mail, Phone, MapPin, Clock, LifeBuoy, ArrowRight, Sparkles, Send } from 'lucide-react';

export default function Contact() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-indigo-50/20 to-white text-slate-800 font-sans antialiased selection:bg-indigo-500/10">
      {/* Premium Navbar */}
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
              <Link to="/pricing" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 px-3 py-2 rounded-xl hover:bg-slate-50 transition-all">
                Pricing
              </Link>
              <Link to="/contact" className="text-sm font-semibold text-indigo-600 bg-indigo-50/70 px-3 py-2 rounded-xl transition-all">
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {/* Dynamic Header Section */}
        <div className="text-center mb-16 md:mb-24 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-4 w-24 h-24 bg-indigo-400/10 rounded-full blur-2xl pointer-events-none" />
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold uppercase tracking-widest mb-4 animate-fade-in">
            <Sparkles className="h-3 w-3" /> Connect with us
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight">
            Get in
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"> Touch</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
            Have questions? We'd love to hear from you. Send us a message and our global support group will respond as soon as possible.
          </p>
        </div>

        {/* Form and info split content matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 max-w-6xl mx-auto">
          
          {/* Card Form Component Block */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-10 rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/50 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 to-purple-500" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">Send us a message</h2>
            <p className="text-sm text-slate-400 font-medium mb-8">Fill out the short framework parameters below.</p>
            
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full h-11 px-4 bg-slate-50/50 border border-slate-200 hover:border-slate-300 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 rounded-xl transition-all placeholder:text-slate-400 text-sm font-medium"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full h-11 px-4 bg-slate-50/50 border border-slate-200 hover:border-slate-300 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 rounded-xl transition-all placeholder:text-slate-400 text-sm font-medium"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  className="w-full h-11 px-4 bg-slate-50/50 border border-slate-200 hover:border-slate-300 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 rounded-xl transition-all placeholder:text-slate-400 text-sm font-medium"
                  placeholder="How can we help?"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="w-full p-4 bg-slate-50/50 border border-slate-200 hover:border-slate-300 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 rounded-xl transition-all placeholder:text-slate-400 text-sm font-medium resize-none"
                  placeholder="Write your brief message text here..."
                />
              </div>
              
              <Button type="submit" className="w-full h-12 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold tracking-wide shadow-lg shadow-slate-900/10 hover:shadow-xl hover:shadow-slate-900/20 transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5 group/btn">
                <span>Send Message</span>
                <Send className="h-4 w-4 text-slate-400 group-hover/btn:translate-x-1 group-hover/btn:text-white transition-all" />
              </Button>
            </form>
          </div>

          {/* Descriptive Information Hub Grid sidebar layout */}
          <div className="lg:col-span-5 space-y-6">
            {/* Contact Information */}
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/30">
              <h3 className="text-lg font-bold text-slate-900 mb-6 tracking-tight flex items-center gap-2">
                <span className="w-1 h-5 bg-indigo-500 rounded-full" /> Contact Information
              </h3>
              <div className="space-y-6">
                <div className="flex items-start group/item">
                  <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600 border border-indigo-100/50 group-hover/item:scale-105 transition-transform">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="ml-4">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Email</p>
                    <a href="mailto:support@biodatamanager.com" className="font-semibold text-slate-700 hover:text-indigo-600 transition-colors text-sm break-all">
                      support@biodatamanager.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start group/item">
                  <div className="p-3 bg-cyan-50 rounded-xl text-cyan-600 border border-cyan-100/50 group-hover/item:scale-105 transition-transform">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className="ml-4">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Phone</p>
                    <a href="tel:+919876543210" className="font-semibold text-slate-700 hover:text-cyan-600 transition-colors text-sm">
                      +91 98765 43210
                    </a>
                  </div>
                </div>

                <div className="flex items-start group/item">
                  <div className="p-3 bg-purple-50 rounded-xl text-purple-600 border border-purple-100/50 group-hover/item:scale-105 transition-transform">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="ml-4">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Address</p>
                    <p className="font-semibold text-slate-700 text-sm leading-relaxed">
                      123 Tech Park, New Delhi, India
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Hours Container Layout */}
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/30 flex items-start">
              <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600 border border-emerald-100/50 mr-4">
                <Clock className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-slate-900 mb-3 tracking-tight">Business Hours</h3>
                <div className="space-y-2 text-xs md:text-sm font-semibold text-slate-500">
                  <div className="flex justify-between border-b border-slate-50 pb-1">
                    <span>Monday - Friday</span>
                    <span className="text-slate-700">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-50 pb-1">
                    <span>Saturday</span>
                    <span className="text-slate-700">10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span className="text-rose-500 font-bold bg-rose-50 px-1.5 py-0.5 rounded text-[11px]">CLOSED</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Support Metrics Information Box */}
            <div className="bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900 p-6 md:p-8 rounded-3xl border border-slate-800 text-white shadow-xl shadow-indigo-950/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 bg-indigo-500/10 rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />
              <div className="flex items-start">
                <div className="p-3 bg-white/10 rounded-xl text-indigo-300 border border-white/10 mr-4 shrink-0">
                  <LifeBuoy className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold tracking-tight mb-2 text-white">Technical Support</h3>
                  <p className="text-xs md:text-sm text-indigo-200/80 mb-4 leading-relaxed font-medium">
                    Please remember to include your unique assigned <span className="text-amber-400 font-bold">school ID</span> credentials along with a descriptive overview log of the anomaly encountered.
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-indigo-300 font-bold tracking-wide">
                    <span>Response timeframe: &lt; 24 business hours</span>
                    <ArrowRight className="h-3 w-3" />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Styled Footer Block Element */}
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