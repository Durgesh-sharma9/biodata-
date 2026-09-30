import { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  X, 
  Loader2, 
  ArrowRight, 
  User, 
  Briefcase, 
  MapPin, 
  Building2, 
  SlidersHorizontal, 
  KeyRound, 
  Bell, 
  PiggyBank, 
  Share2, 
  Layers, 
  PlusCircle, 
  Sparkles, 
  CornerDownLeft, 
  Command, 
  FileText,
  LayoutDashboard,
  Users2,
  UserSquare2,
  Gift,
  ShieldCheck,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { getCandidates } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

const STATIC_NAVIGATION = [
  // Core Recruiter Pages
  {
    title: 'Dashboard',
    description: 'Hiring metrics, recent candidate applications, and overview statistics',
    path: '/dashboard',
    category: 'Pages & Navigation',
    icon: LayoutDashboard,
    badge: 'Overview',
    keywords: ['dashboard', 'home', 'stats', 'analytics', 'overview', 'metrics']
  },
  {
    title: 'My Candidates',
    description: 'Candidates registered to your school, shortlisted teachers & staff',
    path: '/my-candidates',
    category: 'Pages & Navigation',
    icon: Users2,
    badge: 'Recruitment',
    keywords: ['candidates', 'applicants', 'applications', 'shortlist', 'teachers', 'hired']
  },
  {
    title: 'Add New Candidate',
    description: 'Manually register a candidate biodata or walk-in application',
    path: '/candidates/new',
    category: 'Quick Actions',
    icon: PlusCircle,
    badge: 'Action',
    keywords: ['add candidate', 'new candidate', 'create', 'register candidate', 'manual entry']
  },
  {
    title: 'School Profile & Logo',
    description: 'School branding, official logo upload, contact numbers & campus address',
    path: '/school-profile',
    category: 'Pages & Navigation',
    icon: Building2,
    badge: 'Branding',
    keywords: ['school profile', 'logo', 'branding', 'address', 'campus', 'phone', 'contact']
  },
  {
    title: 'Application Links & QR Standee',
    description: 'Unique school candidate application URL, QR code, and reception standee',
    path: '/application-links',
    category: 'Pages & Navigation',
    icon: Share2,
    badge: 'Public Portal',
    keywords: ['application links', 'qr code', 'standee', 'flyer', 'apply link', 'walk-in url']
  },

  // Settings Deep-Links
  {
    title: 'Hiring Workflow & Portal Settings',
    description: 'Configure active hiring status, walk-in QR submissions & interview rules',
    path: '/settings?tab=hiring',
    category: 'Settings',
    icon: SlidersHorizontal,
    badge: 'Settings',
    keywords: ['settings', 'hiring workflow', 'active hiring', 'interview rules', 'working hours', 'board']
  },
  {
    title: 'Staff Perks & School Benefits',
    description: 'Highlight teacher amenities (Transport, PF, Fee concession, Accommodation)',
    path: '/settings?tab=perks',
    category: 'Settings',
    icon: Gift,
    badge: 'Settings',
    keywords: ['perks', 'benefits', 'amenities', 'transport', 'pf', 'lunch', 'quarters', 'insurance']
  },
  {
    title: 'Notification Settings',
    description: 'Email alerts, WhatsApp urgent notifications & daily candidate digest',
    path: '/settings?tab=notifications',
    category: 'Settings',
    icon: Bell,
    badge: 'Settings',
    keywords: ['notifications', 'alerts', 'whatsapp', 'email', 'daily digest', 'sms', 'reminders']
  },
  {
    title: 'Recruitment Criteria & Catalog',
    description: 'Browse teaching positions, subjects, degrees, and request new master options',
    path: '/settings?tab=taxonomy',
    category: 'Settings',
    icon: Layers,
    badge: 'Settings',
    keywords: ['criteria', 'positions', 'subjects', 'qualifications', 'classes', 'master data', 'request']
  },
  {
    title: 'Change Password & Security',
    description: 'Update admin login password, review authorized session & export data backup',
    path: '/settings?tab=security',
    category: 'Settings',
    icon: KeyRound,
    badge: 'Security',
    keywords: ['password', 'change password', 'security', 'login', 'credentials', 'backup', 'session']
  },
];

export function GlobalSearch({ triggerVariant = 'full' } = {}) {
  const navigate = useNavigate();
  const { isSuperAdmin, isApplicant } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [candidateResults, setCandidateResults] = useState([]);
  const [isSearchingCandidates, setIsSearchingCandidates] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const searchInputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Keyboard shortcut listener: Ctrl+K or Cmd+K or "/"
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
        e.preventDefault();
        setIsOpen(true);
      } else if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      setSearchTerm('');
      setCandidateResults([]);
    }
  }, [isOpen]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Filter static pages & tabs matching search query
  const filteredPages = useMemo(() => {
    if (!searchTerm.trim()) return STATIC_NAVIGATION.slice(0, 6);
    const q = searchTerm.toLowerCase().trim();
    return STATIC_NAVIGATION.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.keywords.some((k) => k.includes(q))
    ).slice(0, 6);
  }, [searchTerm]);

  // Live Candidate API Search Debounce
  useEffect(() => {
    const trimmed = searchTerm.trim();
    if (trimmed.length < 2 || isSuperAdmin || isApplicant) {
      setCandidateResults([]);
      setIsSearchingCandidates(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearchingCandidates(true);
      try {
        const res = await getCandidates({ name: trimmed, limit: 5 });
        const list = res.data?.data || [];
        setCandidateResults(list);
      } catch (err) {
        setCandidateResults([]);
      } finally {
        setIsSearchingCandidates(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [searchTerm, isSuperAdmin, isApplicant]);

  const allItems = useMemo(() => {
    const items = [];
    filteredPages.forEach((p) => items.push({ type: 'page', data: p }));
    candidateResults.forEach((c) => items.push({ type: 'candidate', data: c }));
    return items;
  }, [filteredPages, candidateResults]);

  // Keyboard navigation inside results
  const handleKeyDownInInput = (e) => {
    if (allItems.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % allItems.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + allItems.length) % allItems.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const current = allItems[selectedIndex];
      if (current) {
        handleSelectItem(current);
      }
    }
  };

  const handleSelectItem = (item) => {
    setIsOpen(false);
    if (item.type === 'page') {
      navigate(item.data.path);
    } else if (item.type === 'candidate') {
      navigate(`/candidates/${item.data._id}`);
    }
  };

  return (
    <div className={triggerVariant === 'icon' ? 'inline-block' : 'relative w-full max-w-md mx-auto'} ref={dropdownRef}>
      
      {triggerVariant === 'icon' ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="h-9 w-9 flex items-center justify-center rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:text-[#0F766E] hover:border-[#0F766E]/40 hover:bg-teal-50/50 transition-all shadow-2xs active:scale-95 cursor-pointer"
          aria-label="Search"
          title="Search (Ctrl + K)"
        >
          <Search className="w-4 h-4 text-slate-600 dark:text-slate-300" />
        </button>
      ) : (
        /* Search Input Bar in Navbar */
        <div 
          onClick={() => setIsOpen(true)}
          className="w-full flex items-center justify-between h-9 sm:h-10 px-3 bg-slate-100/90 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 rounded-xl cursor-pointer text-xs transition-all shadow-2xs group hover:border-[#0F766E]/40"
        >
          <div className="flex items-center gap-2 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 min-w-0">
            <Search className="h-4 w-4 text-[#0F766E] shrink-0" />
            <span className="truncate select-none font-medium">
              Search candidates, pages, tabs, settings...
            </span>
          </div>

          <div className="hidden md:flex items-center gap-1 font-mono text-[10px] font-semibold text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded-md border border-slate-200 dark:border-slate-700 shadow-2xs">
            <span>Ctrl</span>
            <span>K</span>
          </div>
        </div>
      )}

      {/* Global Command Palette Dropdown / Modal */}
      {isOpen && typeof document !== 'undefined' && createPortal(
        <div 
          className="fixed inset-0 z-[99999] flex items-start justify-center pt-3 sm:pt-20 px-2 sm:px-3 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[80vh] animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Search Input */}
            <div className="flex items-center gap-3 p-3.5 sm:p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
              <Search className="h-5 w-5 text-[#0F766E] shrink-0" />
              <input
                ref={searchInputRef}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={handleKeyDownInInput}
                placeholder="Type to search candidates, tabs (Profile, Settings, Links) or pages..."
                className="w-full bg-transparent text-sm sm:text-base font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              {isSearchingCandidates && (
                <Loader2 className="h-4 w-4 text-[#0F766E] animate-spin shrink-0" />
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="hidden sm:inline-flex text-[10px] font-mono font-semibold px-2 py-1 rounded bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-300"
              >
                ESC
              </button>
            </div>

            {/* Scrollable Results Body */}
            <div className="overflow-y-auto p-2 sm:p-3 divide-y divide-slate-100 dark:divide-slate-800 space-y-3">
              
              {/* SECTION 1: Matching Candidates (if any) */}
              {candidateResults.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <div className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#0F766E] flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5" />
                      Candidates Found ({candidateResults.length})
                    </span>
                    <span className="text-[10px] text-slate-400 font-normal lowercase">click to view profile</span>
                  </div>

                  <div className="space-y-1">
                    {candidateResults.map((cand, idx) => {
                      const itemIndex = filteredPages.length + idx;
                      const isSelected = selectedIndex === itemIndex;
                      return (
                        <div
                          key={cand._id}
                          onClick={() => handleSelectItem({ type: 'candidate', data: cand })}
                          className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-purple-50 dark:bg-purple-950/40 border border-[#0F766E]/30'
                              : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 border border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-[#0F766E] to-[#7928CA] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                              {cand.fullName?.charAt(0)?.toUpperCase() || 'C'}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                                  {cand.fullName}
                                </span>
                                {cand.experienceYears != null && (
                                  <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                    {cand.experienceYears > 0 ? `${cand.experienceYears}y exp` : 'Fresher'}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                                <span className="font-semibold text-slate-700 dark:text-slate-300">
                                  {cand.position || 'Teaching Staff'}
                                </span>
                                {(cand.city || cand.state) && (
                                  <>
                                    <span>•</span>
                                    <span className="flex items-center gap-0.5">
                                      <MapPin className="h-3 w-3" />
                                      {[cand.city, cand.state].filter(Boolean).join(', ')}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0 pl-2">
                            <span className="text-[11px] font-bold text-[#0F766E] flex items-center gap-1">
                              View <ArrowRight className="h-3.5 w-3.5" />
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Searching Candidates loader message */}
              {isSearchingCandidates && (
                <div className="p-3 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-[#0F766E]" />
                  <span>Searching candidate database...</span>
                </div>
              )}

              {/* SECTION 2: Navigation Pages & Sections */}
              <div className="space-y-1.5 pt-2">
                <div className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                  <span>Pages, Tabs & Tools</span>
                  {searchTerm && <span className="text-[10px] lowercase text-slate-400">matches keyword</span>}
                </div>

                {filteredPages.length === 0 && candidateResults.length === 0 && !isSearchingCandidates ? (
                  <div className="py-8 text-center space-y-2">
                    <Search className="h-8 w-8 text-slate-300 dark:text-slate-600 mx-auto" />
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                      No results found for "{searchTerm}"
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Try searching candidate name, subject, or a section like "Password", "Settings", or "Profile".
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {filteredPages.map((page, idx) => {
                      const Icon = page.icon;
                      const isSelected = selectedIndex === idx;
                      return (
                        <div
                          key={page.path}
                          onClick={() => handleSelectItem({ type: 'page', data: page })}
                          className={`flex items-start gap-3 p-2.5 rounded-xl cursor-pointer transition-all border ${
                            isSelected
                              ? 'bg-purple-50/80 dark:bg-purple-950/40 border-[#0F766E]/40 shadow-2xs'
                              : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                          }`}
                        >
                          <div className="p-2 rounded-xl bg-purple-50 text-[#0F766E] dark:bg-purple-950/50 dark:text-[#0F766E] shrink-0 mt-0.5">
                            <Icon className="h-4 w-4" />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                                {page.title}
                              </span>
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 shrink-0">
                                {page.badge}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 dark:text-slate-500 line-clamp-1 mt-0.5 leading-snug">
                              {page.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>

            {/* Footer shortcuts hint */}
            <div className="p-2.5 px-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <span className="font-mono bg-white dark:bg-slate-900 border px-1 rounded text-[10px]">↑↓</span> to navigate
                </span>
                <span className="flex items-center gap-1">
                  <span className="font-mono bg-white dark:bg-slate-900 border px-1 rounded text-[10px]">↵</span> to open
                </span>
              </div>
              <span className="font-medium text-[#0F766E]">HireHub Universal Search</span>
            </div>

          </div>
        </div>,
        document.body
      )}

    </div>
  );
}
