import React, { useState, useEffect } from 'react';
import { Download, Smartphone, X, Share, PlusSquare, CheckCircle2 } from 'lucide-react';

export function PwaInstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  useEffect(() => {
    // Check if already running in standalone (PWA) mode
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
      setDeferredPrompt(e);
    };

    // Listen for successful installation
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setInstallSuccess(true);
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

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setInstallSuccess(true);
      }
      setDeferredPrompt(null);
    } else if (isIOS) {
      setShowIosGuide(true);
    } else {
      // Fallback instruction for browsers where prompt hasn't triggered
      alert(
        'To install HireHub app, click the Install icon (➕ or ⬇) in your browser address bar or menu!'
      );
    }
  };

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
          onClick={handleInstallClick}
          type="button"
          aria-label="Download and Install HireHub App"
          className="flex items-center gap-2.5 px-4 py-2.5 bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white font-bold text-xs sm:text-sm rounded-full shadow-[0_8px_25px_-5px_rgba(99,102,241,0.5)] hover:shadow-[0_12px_30px_-5px_rgba(99,102,241,0.65)] hover:scale-105 active:scale-95 transition-all duration-300 border border-white/20 backdrop-blur-sm"
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
          className="w-7 h-7 rounded-full bg-slate-800/80 hover:bg-slate-900 text-white/70 hover:text-white flex items-center justify-center transition-colors shadow-md text-xs"
          title="Dismiss"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* iOS Safari Guide Modal */}
      {showIosGuide && (
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
                onClick={() => setShowIosGuide(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
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
              onClick={() => setShowIosGuide(false)}
              className="mt-5 w-full py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl text-xs sm:text-sm transition-colors"
            >
              Samajh Gaya (Done)
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default PwaInstallButton;
