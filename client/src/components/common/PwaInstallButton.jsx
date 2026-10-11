import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Download, 
  Smartphone, 
  X, 
  Share, 
  PlusSquare, 
  CheckCircle2, 
  Monitor, 
  Laptop, 
  Sparkles, 
  Check, 
  Zap,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

// Custom hook to handle PWA install prompt lifecycle
export function usePwaInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState(
    typeof window !== 'undefined' ? window.__pwaDeferredPrompt || null : null
  );
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  useEffect(() => {
    // Check standalone mode (PWA installed)
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true;

    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // Listen for beforeinstallprompt event (Chromium browsers)
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      window.__pwaDeferredPrompt = e;
      setDeferredPrompt(e);
    };

    // Listen for appinstalled
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setInstallSuccess(true);
      window.__pwaDeferredPrompt = null;
      setDeferredPrompt(null);
      setTimeout(() => setInstallSuccess(false), 5000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const triggerInstall = async (onIosCallback) => {
    const promptEvent = deferredPrompt || (typeof window !== 'undefined' ? window.__pwaDeferredPrompt : null);
    if (promptEvent) {
      promptEvent.prompt();
      const choice = await promptEvent.userChoice;
      if (choice?.outcome === 'accepted') {
        setInstallSuccess(true);
      }
      window.__pwaDeferredPrompt = null;
      setDeferredPrompt(null);
    } else if (isIOS) {
      if (onIosCallback) onIosCallback();
    } else {
      // Direct instruction fallback
      alert(
        'To install HireHub, click the Install App icon (➕ or ⬇) in your browser address bar or menu!'
      );
    }
  };

  return { deferredPrompt, isInstalled, isIOS, installSuccess, triggerInstall };
}

// ─────────────────────────────────────────────────────────────
// 1. FLOATING PWA INSTALL BUTTON (Only on Landing Page '/')
// ─────────────────────────────────────────────────────────────
export function PwaInstallButton() {
  const location = useLocation();
  const [isDismissed, setIsDismissed] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);
  const { isInstalled, isIOS, installSuccess, triggerInstall } = usePwaInstall();

  // Strictly ONLY render floating pill on the public Landing page ('/')
  if (location.pathname !== '/') {
    return null;
  }

  // If already installed and running as PWA or dismissed, do not show button
  if (isInstalled || isDismissed) {
    if (installSuccess) {
      return (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-full shadow-2xl text-xs font-bold animate-in fade-in slide-in-from-bottom-3">
          <CheckCircle2 className="w-4 h-4" />
          <span>HireHub App Installed Successfully!</span>
        </div>
      );
    }
    return null;
  }

  return (
    <>
      {/* Floating Bottom-Right Download / Install Button */}
      <div className="fixed bottom-5 right-5 z-50 flex items-center gap-1 group animate-in fade-in slide-in-from-bottom-4 duration-500">
        <button
          onClick={() => triggerInstall(() => setShowIosGuide(true))}
          type="button"
          aria-label="Download and Install HireHub App"
          className="flex items-center gap-2.5 px-4 py-2.5 bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white font-bold text-xs sm:text-sm rounded-full shadow-[0_8px_25px_-5px_rgba(99,102,241,0.5)] hover:shadow-[0_12px_30px_-5px_rgba(99,102,241,0.65)] hover:scale-105 active:scale-95 transition-all duration-300 border border-white/20 backdrop-blur-sm cursor-pointer"
        >
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <Download className="w-3.5 h-3.5 text-white animate-bounce" />
          </div>
          <span className="tracking-wide">Download App</span>
          <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold bg-white/20 uppercase tracking-wider">
            PWA
          </span>
        </button>

        {/* Small dismiss button */}
        <button
          onClick={() => setIsDismissed(true)}
          type="button"
          aria-label="Dismiss install button"
          className="w-7 h-7 rounded-full bg-slate-800/80 hover:bg-slate-900 text-white/70 hover:text-white flex items-center justify-center transition-colors shadow-md text-xs cursor-pointer"
          title="Dismiss"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* iOS Safari Guide Modal */}
      {showIosGuide && (
        <IosGuideModal onClose={() => setShowIosGuide(false)} />
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// 2. EMBEDDED PWA INSTALL CARD (For Settings Page)
// ─────────────────────────────────────────────────────────────
export function PwaInstallCard() {
  const { isInstalled, isIOS, installSuccess, triggerInstall } = usePwaInstall();
  const [showIosGuide, setShowIosGuide] = useState(false);

  return (
    <Card className="border border-slate-200/80 dark:border-slate-800 shadow-xs rounded-2xl overflow-hidden">
      <CardHeader className="px-5 py-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-violet-500/15 to-indigo-500/20 text-violet-600 dark:text-violet-400 rounded-xl ring-1 ring-violet-500/20 shadow-2xs shrink-0">
              <Smartphone className="h-5 w-5 stroke-[2.2]" />
            </div>
            <div>
              <CardTitle className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>HireHub Desktop & Mobile App</span>
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Install as a native Progressive Web App (PWA) on your phone, tablet, or desktop.
              </CardDescription>
            </div>
          </div>

          <div className="shrink-0">
            {isInstalled ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                <span>Installed on This Device</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300 border border-violet-200 dark:border-violet-800">
                <Sparkles className="h-3.5 w-3.5 text-violet-600" />
                <span>Ready to Install</span>
              </span>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5 sm:p-6 space-y-6">
        {/* Main Installation Hero Panel */}
        <div className="rounded-2xl p-5 sm:p-6 bg-gradient-to-br from-violet-500/5 via-indigo-500/5 to-slate-50 dark:from-slate-900/60 dark:to-slate-900/20 border border-violet-200/60 dark:border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
              {isInstalled 
                ? 'App is Ready and Active on Your System' 
                : 'Experience HireHub as a Fast, Full-Screen App'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              Enjoy 1-click launch from your Home Screen or Taskbar with lightning-fast load times, zero browser address bar clutter, and background synchronization.
            </p>

            {/* Feature Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs text-slate-600 dark:text-slate-400 font-medium">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                <span>1-Click Launch from Home Screen</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                <span>Works on Android, iOS, Windows & Mac</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                <span>Zero app-store download or updates</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                <span>Full-screen distraction-free workspace</span>
              </div>
            </div>
          </div>

          {/* CTA Action Column */}
          <div className="flex flex-col items-stretch sm:items-center gap-2 w-full md:w-auto shrink-0">
            {installSuccess ? (
              <div className="flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 text-white font-bold text-xs sm:text-sm shadow-md animate-in fade-in">
                <CheckCircle2 className="h-4 w-4" />
                <span>App Installed Successfully!</span>
              </div>
            ) : isInstalled ? (
              <div className="flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-bold text-xs sm:text-sm">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>App Active & Pinned</span>
              </div>
            ) : (
              <Button
                type="button"
                onClick={() => triggerInstall(() => setShowIosGuide(true))}
                className="h-11 px-6 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all active:scale-98 flex items-center justify-center gap-2.5 cursor-pointer border-none"
              >
                <Download className="h-4 w-4 animate-bounce shrink-0" />
                <span>Install HireHub App</span>
              </Button>
            )}
            <span className="text-[10px] text-slate-400 font-medium text-center">
              Free • Secure PWA • Powered by Google Chrome & Webkit
            </span>
          </div>
        </div>

        {/* Step-by-Step Instructions by Platform */}
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Installation Guide by Device
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* 1. Android */}
            <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 space-y-2">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-xs">
                <Smartphone className="h-4 w-4" />
                <span>Android (Chrome / Edge)</span>
              </div>
              <p className="text-[11.5px] text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                Tap <strong>"Install HireHub App"</strong> above, or open Chrome menu (<span className="font-bold">⋮</span>) and select <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.
              </p>
            </div>

            {/* 2. Apple iOS Safari */}
            <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 space-y-2">
              <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 font-bold text-xs">
                <Share className="h-4 w-4" />
                <span>iPhone & iPad (Safari)</span>
              </div>
              <p className="text-[11.5px] text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                Tap Safari's <strong>Share</strong> button at the bottom, scroll down and choose <strong>"Add to Home Screen"</strong> (<span className="font-bold">+</span>), then tap <strong>Add</strong>.
              </p>
            </div>

            {/* 3. Windows & Mac Desktop */}
            <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 space-y-2">
              <div className="flex items-center gap-2 text-violet-700 dark:text-violet-400 font-bold text-xs">
                <Laptop className="h-4 w-4" />
                <span>Windows PC & Mac</span>
              </div>
              <p className="text-[11.5px] text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                In Chrome or Edge, click the <strong>Install</strong> icon (<span className="font-bold">⊕</span> or <span className="font-bold">⬇</span>) in your browser address bar on the top-right to pin it to taskbar.
              </p>
            </div>
          </div>
        </div>
      </CardContent>

      {/* iOS Safari Guide Modal */}
      {showIosGuide && (
        <IosGuideModal onClose={() => setShowIosGuide(false)} />
      )}
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────
// Shared iOS Guide Modal
// ─────────────────────────────────────────────────────────────
function IosGuideModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-violet-100 dark:bg-violet-950 flex items-center justify-center text-violet-600">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Install HireHub App
              </h3>
              <p className="text-xs text-slate-500">For iOS / Safari</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <ol className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
          <li className="flex items-start gap-2.5 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl">
            <span className="font-bold text-violet-600 shrink-0">1.</span>
            <span>
              Safari me neeche <strong>Share</strong> button (
              <Share className="inline w-3.5 h-3.5 mx-0.5 text-blue-500" />) par tap karein.
            </span>
          </li>
          <li className="flex items-start gap-2.5 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl">
            <span className="font-bold text-violet-600 shrink-0">2.</span>
            <span>
              Scroll karein aur <strong>Add to Home Screen</strong> (
              <PlusSquare className="inline w-3.5 h-3.5 mx-0.5 text-emerald-500" />) select karein.
            </span>
          </li>
          <li className="flex items-start gap-2.5 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl">
            <span className="font-bold text-violet-600 shrink-0">3.</span>
            <span>Top-right me <strong>Add</strong> dabayein aur app ready ho jayegi!</span>
          </li>
        </ol>

        <button
          onClick={onClose}
          className="mt-5 w-full py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl text-xs sm:text-sm transition-colors cursor-pointer"
        >
          Samajh Gaya (Done)
        </button>
      </div>
    </div>
  );
}

export default PwaInstallButton;
