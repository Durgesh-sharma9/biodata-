import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAdminMarqueeSettings, updateMarqueeSettings } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Building2, Sparkles, Save, RotateCcw, Plus, X, Gauge, Eye, Check, AlertCircle, FileText,
  ArrowRight, MapPin, FolderLock, BadgeCheck, MessageSquare, Pencil, Monitor,
} from "lucide-react";

const DEFAULT_SCHOOLS = [
  "Sunrise International School",
  "Global Wisdom Public School",
  "Bright Horizon Academy",
  "Mayur Senior Secondary School",
  "Springdale International School",
  "Pragati Educational Academy",
  "Gyan Sagar Public School",
  "Greenwood Valley School",
  "Vidyasthali Memorial School",
  "Apex International Academy"
];

const DEFAULT_HERO_NAME = "HireHub";
const DEFAULT_HERO_TAGLINE =
  "eliminates paper biodatas and agency commissions. Generate a custom QR code for gate walk-ins, organize applicants into a searchable digital vault, and streamline school staff recruitment.";

export default function PartnerMarquee() {
  const queryClient = useQueryClient();

  const [schools, setSchools] = useState(DEFAULT_SCHOOLS);
  const [speed, setSpeed] = useState(25);
  const [title, setTitle] = useState("Trusted by Reputed Schools & Educational Trusts Across India");
  const [heroName, setHeroName] = useState(DEFAULT_HERO_NAME);
  const [heroTagline, setHeroTagline] = useState(DEFAULT_HERO_TAGLINE);
  const [newSchoolInput, setNewSchoolInput] = useState("");
  const [bulkInput, setBulkInput] = useState("");
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [activeTab, setActiveTab] = useState("hero");

  const { data: marqueeData } = useQuery({
    queryKey: ["adminMarqueeSettings"],
    queryFn: () => getAdminMarqueeSettings().then((res) => res.data.data),
  });

  useEffect(() => {
    if (marqueeData) {
      if (Array.isArray(marqueeData.partnerSchools) && marqueeData.partnerSchools.length > 0) setSchools(marqueeData.partnerSchools);
      if (typeof marqueeData.marqueeSpeed === "number") setSpeed(marqueeData.marqueeSpeed);
      if (marqueeData.marqueeTitle) setTitle(marqueeData.marqueeTitle);
      if (marqueeData.heroName) setHeroName(marqueeData.heroName);
      if (marqueeData.heroTagline) setHeroTagline(marqueeData.heroTagline);
    }
  }, [marqueeData]);

  const saveMutation = useMutation({
    mutationFn: (payload) => updateMarqueeSettings(payload),
    onSuccess: () => {
      queryClient.invalidateQueries(["adminMarqueeSettings"]);
      queryClient.invalidateQueries(["publicMarqueeSettings"]);
      setSuccessMessage("Landing page settings saved successfully!");
      setTimeout(() => setSuccessMessage(""), 4000);
    },
    onError: (err) => {
      setErrorMessage(err.response?.data?.message || "Failed to save settings.");
      setTimeout(() => setErrorMessage(""), 4000);
    },
  });

  const handleAddSchool = (e) => {
    e?.preventDefault();
    const trimmed = newSchoolInput.trim();
    if (!trimmed) return;
    if (schools.includes(trimmed)) { setErrorMessage("This school is already in the list."); setTimeout(() => setErrorMessage(""), 3000); return; }
    setSchools([...schools, trimmed]);
    setNewSchoolInput("");
  };

  const handleRemoveSchool = (idx) => {
    if (schools.length <= 2) { setErrorMessage("Keep at least 2 schools for a smooth marquee loop."); setTimeout(() => setErrorMessage(""), 3000); return; }
    setSchools(schools.filter((_, i) => i !== idx));
  };

  const handleBulkAdd = () => {
    if (!bulkInput.trim()) return;
    const names = bulkInput.split(/[\n,]/).map(s => s.trim()).filter(s => s.length > 0);
    setSchools(Array.from(new Set([...schools, ...names])));
    setBulkInput(""); setShowBulkModal(false);
  };

  const handleResetDefaults = () => {
    if (window.confirm("Reset all settings to default values?")) {
      setSchools(DEFAULT_SCHOOLS); setSpeed(25);
      setTitle("Trusted by Reputed Schools & Educational Trusts Across India");
      setHeroName(DEFAULT_HERO_NAME); setHeroTagline(DEFAULT_HERO_TAGLINE);
    }
  };

  const handleSave = () => {
    saveMutation.mutate({ partnerSchools: schools, marqueeSpeed: Number(speed), marqueeTitle: title.trim(), heroName: heroName.trim(), heroTagline: heroTagline.trim(), isActive: true });
  };

  return (
    <div className="space-y-6 pb-12 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-50 text-violet-700 text-xs font-bold uppercase tracking-wider mb-2 border border-violet-100">
            <Sparkles className="w-3.5 h-3.5 text-violet-600" /> Landing Page Customizer
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Landing Page Settings</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">Control the platform name, hero speech, marquee ticker, and partner schools shown to all visitors.</p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <Button type="button" variant="outline" onClick={handleResetDefaults} className="border-slate-200 text-slate-600 hover:text-slate-900 text-xs font-bold h-10 px-4 rounded-xl cursor-pointer">
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" /> Reset
          </Button>
          <Button type="button" onClick={handleSave} disabled={saveMutation.isPending} className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white text-xs font-bold h-10 px-6 rounded-xl shadow-md shadow-violet-500/25 transition-all cursor-pointer flex items-center gap-1.5">
            {saveMutation.isPending ? "Saving..." : (<><Save className="w-4 h-4" /> Save All Changes</>)}
          </Button>
        </div>
      </div>

      {successMessage && (<div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" />{successMessage}</div>)}
      {errorMessage && (<div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2"><AlertCircle className="w-4 h-4 text-rose-600" />{errorMessage}</div>)}

      {/* Tab Switcher */}
      <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-fit">
        {[{ id: "hero", label: "Hero Section", icon: Monitor }, { id: "marquee", label: "Marquee & Schools", icon: Building2 }].map(({ id, label, icon: Icon }) => (
          <button key={id} type="button" onClick={() => setActiveTab(id)} className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTab === id ? "bg-white dark:bg-slate-900 text-violet-700 shadow-sm border border-slate-200 dark:border-slate-700" : "text-slate-500 hover:text-slate-700"}`}>
            <Icon className="w-3.5 h-3.5" /> {label}
          </button>
        ))}
      </div>

      {/* HERO TAB */}
      {activeTab === "hero" && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="space-y-5">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-violet-50 text-violet-700 flex items-center justify-center"><Pencil className="w-4 h-4" /></div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Platform Display Name</h3>
                  <p className="text-[11px] text-slate-500">Shown as bold brand name in the hero description</p>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Brand Name:</label>
                <Input type="text" value={heroName} onChange={(e) => setHeroName(e.target.value)} placeholder="e.g. HireHub" className="text-xs h-11 rounded-xl font-bold" maxLength={40} />
                <p className="text-[10px] text-slate-400">This shows as the bold brand name in the hero paragraph: <span className="font-bold text-violet-700">"{heroName || "HireHub"}"</span> eliminates paper biodatas...</p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center"><MessageSquare className="w-4 h-4" /></div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Hero Speech / Tagline</h3>
                  <p className="text-[11px] text-slate-500">Subheadline description paragraph in the hero section</p>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Description Text:</label>
                <textarea rows={5} value={heroTagline} onChange={(e) => setHeroTagline(e.target.value)} placeholder="Describe what your platform does for schools..." className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-y leading-relaxed" maxLength={500} />
                <p className="text-[10px] text-slate-400 text-right">{heroTagline.length}/500 characters</p>
              </div>
              <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/80 text-[11px] text-amber-800">
                <div className="font-bold mb-1">💡 Tip:</div>
                <div>The hero description starts with your <strong>Platform Name</strong> in bold, followed by this tagline text. Keep it concise and action-oriented.</div>
              </div>
            </div>
          </div>

          {/* Live Hero Preview */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 relative"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" /></span>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5"><Eye className="w-4 h-4 text-violet-600" /> Live Hero Preview</h3>
              </div>
              <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg">Exactly as landing page</span>
            </div>

            <div className="p-5 bg-gradient-to-br from-slate-50 via-white to-violet-50/30">
              {/* Nav strip */}
              <div className="flex items-center justify-between px-4 py-2 rounded-xl bg-white border border-slate-200 shadow-xs mb-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-violet-600 to-indigo-500" />
                  <span className="text-xs font-black text-slate-900">Hire<span className="text-violet-600">Hub</span></span>
                </div>
                <div className="flex gap-1.5">
                  <div className="h-5 px-2.5 rounded-lg bg-slate-100 text-[9px] font-bold text-slate-500 flex items-center">School Login</div>
                  <div className="h-5 px-2.5 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-[9px] font-bold text-white flex items-center">Register Free</div>
                </div>
              </div>

              <div className="space-y-3">
                {/* Pill badge */}
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-violet-200 bg-white shadow-xs">
                  <span className="flex h-1.5 w-1.5 relative"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" /></span>
                  <span className="text-[9px] font-black text-violet-700">{heroName || "HireHub"} Recruitment OS</span>
                  <span className="text-slate-300 text-[9px]">•</span>
                  <span className="text-[9px] font-semibold text-slate-600">India's School Staffing Platform</span>
                </div>

                <h2 className="text-lg font-black text-slate-900 leading-tight">
                  Hire Top Teachers & School Staff{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-indigo-600 to-sky-500">in Minutes.</span>
                </h2>

                <p className="text-[11px] text-slate-600 leading-relaxed">
                  <strong className="text-slate-900">{heroName || "HireHub"}</strong>{" "}{heroTagline || DEFAULT_HERO_TAGLINE}
                </p>

                <div className="flex gap-2 flex-wrap">
                  <div className="h-7 px-3 rounded-xl bg-gradient-to-r from-violet-600 to-sky-600 text-white text-[9px] font-bold flex items-center gap-1 shadow-md">
                    <Building2 className="w-2.5 h-2.5" /> Start Free Trial <ArrowRight className="w-2.5 h-2.5" />
                  </div>
                  <div className="h-7 px-3 rounded-xl border border-slate-200 bg-white text-slate-700 text-[9px] font-bold flex items-center gap-1">
                    <MessageSquare className="w-2.5 h-2.5 text-emerald-600" /> Demo on WhatsApp
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {["📐 PGT Maths", "🧪 TGT Science", "🚌 Bus Driver", "💻 IT"].map(c => (
                    <span key={c} className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-white border border-slate-200 text-slate-600">{c}</span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3 pt-2 border-t border-slate-200 text-[9px] font-semibold text-slate-600">
                  <span>✅ 100% Free School Access</span>
                  <span>✅ Custom Gate QR Code</span>
                  <span>✅ 100% Private to Your School</span>
                </div>
              </div>

              {/* Mockup card */}
              <div className="mt-4 bg-white/95 rounded-xl border border-slate-200/90 shadow-sm p-3 space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-1">
                    <div className="flex gap-0.5"><div className="w-1.5 h-1.5 rounded-full bg-rose-400" /><div className="w-1.5 h-1.5 rounded-full bg-amber-400" /><div className="w-1.5 h-1.5 rounded-full bg-emerald-400" /></div>
                    <span className="text-[9px] font-bold text-slate-700 ml-1 flex items-center gap-0.5"><FolderLock className="w-2.5 h-2.5 text-violet-600" /> Candidate Vault</span>
                  </div>
                  <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-0.5">
                    <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" /> Live
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {[{l:"Applicants",v:"45,200+",c:"violet"},{l:"Distance",v:"< 8.5 km",c:"sky"},{l:"Speed",v:"2.5 Days",c:"emerald"}].map(m => (
                    <div key={m.l} className={`bg-${m.c}-50 border border-${m.c}-100 rounded-lg p-1.5 text-center`}>
                      <div className="text-[7px] uppercase font-bold text-slate-400">{m.l}</div>
                      <div className="text-[10px] font-black text-slate-900">{m.v}</div>
                    </div>
                  ))}
                </div>
                <div className="border border-slate-200/90 rounded-lg p-2 flex items-center gap-1.5">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-500 text-white flex items-center justify-center font-black text-[7px]">AK</div>
                  <div>
                    <div className="text-[9px] font-bold text-slate-900 flex items-center gap-1">Ananya Kapoor
                      <span className="text-[7px] bg-emerald-50 text-emerald-700 px-1 py-px rounded border border-emerald-200 flex items-center gap-0.5"><BadgeCheck className="w-2 h-2" /> CTET</span>
                    </div>
                    <div className="text-[8px] text-slate-500">PGT Mathematics • 7 Yrs</div>
                  </div>
                  <span className="ml-auto text-[7px] font-bold text-violet-700 bg-violet-50 px-1.5 py-0.5 rounded flex items-center gap-0.5"><MapPin className="w-2 h-2" /> 6.4 km</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MARQUEE TAB */}
      {activeTab === "marquee" && (
        <div className="space-y-6">
          {/* Live Marquee Preview */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 relative"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" /></span>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5"><Eye className="w-4 h-4 text-violet-600" /> Live Marquee Preview</h3>
              </div>
              <span className="text-[11px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">Speed: {speed}s per cycle ({schools.length} Schools)</span>
            </div>
            <div className="py-6 bg-slate-50/80 dark:bg-slate-950/60 rounded-xl border border-slate-200/80 dark:border-slate-800 overflow-hidden relative shadow-inner">
              <div className="max-w-7xl mx-auto px-4 mb-3 text-center">
                <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">{title || "TRUSTED BY REPUTED SCHOOLS & EDUCATIONAL TRUSTS ACROSS INDIA"}</p>
              </div>
              <div className="relative flex overflow-x-hidden">
                <div className="animate-marquee whitespace-nowrap flex items-center gap-8 py-1" style={{ animationDuration: `${speed}s` }}>
                  {[...schools, ...schools].map((school, i) => (
                    <div key={i} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs text-xs font-bold text-slate-700 dark:text-slate-200 tracking-wide hover:border-violet-300 transition-colors">
                      <div className="w-2 h-2 rounded-full bg-violet-600" /><span>{school}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Speed & Title */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-violet-50 text-violet-700 flex items-center justify-center"><Gauge className="w-4 h-4" /></div>
                  <div><h3 className="text-sm font-bold text-slate-900 dark:text-white">Marquee Animation Speed</h3><p className="text-[11px] text-slate-500">Lower seconds = Faster scroll</p></div>
                </div>
                <span className="text-base font-black text-violet-700 bg-violet-50 border border-violet-100 px-3 py-1 rounded-xl">{speed}s</span>
              </div>
              <div className="space-y-2">
                <input type="range" min="8" max="60" step="1" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="w-full accent-violet-600 h-2 bg-slate-200 rounded-lg cursor-pointer" />
                <div className="flex justify-between text-[10px] font-bold text-slate-400"><span>🚀 8s (Fast)</span><span>⚡ 25s (Recommended)</span><span>🧘 60s (Slow)</span></div>
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">Speed Presets:</span>
                <div className="grid grid-cols-4 gap-2">
                  {[{label:"Fast",val:15,icon:"🚀"},{label:"Normal",val:25,icon:"⚡"},{label:"Smooth",val:35,icon:"🍃"},{label:"Relaxed",val:50,icon:"🧘"}].map(p => (
                    <button key={p.val} type="button" onClick={() => setSpeed(p.val)} className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${speed === p.val ? "bg-violet-600 text-white border-violet-600 shadow-sm" : "bg-slate-50 text-slate-700 border-slate-200 hover:border-violet-300"}`}>
                      <div>{p.icon} {p.val}s</div><div className="text-[9px] font-medium opacity-80">{p.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center"><FileText className="w-4 h-4" /></div>
                <div><h3 className="text-sm font-bold text-slate-900 dark:text-white">Marquee Heading Text</h3><p className="text-[11px] text-slate-500">Title displayed above the school names ticker</p></div>
              </div>
              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Section Title:</label>
                <Input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Trusted by Reputed Schools & Educational Trusts Across India" className="text-xs h-10 rounded-xl" />
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 text-[11px] text-slate-500"><div className="font-bold text-slate-700 dark:text-slate-300 mb-1">💡 Tip:</div>Changes saved here reflect in real-time on the public landing page.</div>
            </div>
          </div>

          {/* Schools Manager */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2"><Building2 className="w-5 h-5 text-violet-600" />Manage Partner Schools List ({schools.length})</h3>
                <p className="text-xs text-slate-500 mt-0.5">Add individual school names or paste in bulk. Click (X) to remove.</p>
              </div>
              <Button type="button" variant="outline" onClick={() => setShowBulkModal(true)} className="border-slate-200 text-slate-700 text-xs font-bold h-9 px-3.5 rounded-xl cursor-pointer"><Plus className="w-3.5 h-3.5 mr-1 text-violet-600" /> Bulk Paste Schools</Button>
            </div>
            <form onSubmit={handleAddSchool} className="flex gap-2">
              <Input type="text" value={newSchoolInput} onChange={(e) => setNewSchoolInput(e.target.value)} placeholder="Type school name (e.g. Modern Public School, Delhi)..." className="text-xs h-11 rounded-xl" />
              <Button type="submit" className="bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold px-5 h-11 rounded-xl shrink-0 cursor-pointer"><Plus className="w-4 h-4 mr-1" /> Add School</Button>
            </form>
            <div className="space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Active Schools ({schools.length}):</div>
              <div className="flex flex-wrap gap-2.5 p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/70 min-h-[120px]">
                {schools.map((school, index) => (
                  <div key={index} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-700 shadow-2xs text-xs font-bold text-slate-800 dark:text-slate-100 group transition-all">
                    <span className="w-2 h-2 rounded-full bg-violet-600 shrink-0" /><span>{school}</span>
                    <button type="button" onClick={() => handleRemoveSchool(index)} className="p-1 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer ml-1" title="Remove School"><X className="w-3.5 h-3.5" /></button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2"><Building2 className="w-5 h-5 text-violet-600" /> Bulk Paste School Names</h3>
              <button type="button" onClick={() => setShowBulkModal(false)} className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            <p className="text-xs text-slate-500">Paste school names separated by commas or newlines:</p>
            <textarea rows={6} value={bulkInput} onChange={(e) => setBulkInput(e.target.value)} placeholder={"Delhi Public School\nSt. Paul High School\nKendriya Vidyalaya"} className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 font-mono" />
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setShowBulkModal(false)} className="text-xs font-bold rounded-xl">Cancel</Button>
              <Button type="button" onClick={handleBulkAdd} className="bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold rounded-xl px-5">Add All Schools</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
