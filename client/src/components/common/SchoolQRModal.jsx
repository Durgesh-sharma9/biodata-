import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  QrCode, 
  Copy, 
  Check, 
  Download, 
  Smartphone, 
  Building2, 
  School as SchoolIcon,
  ExternalLink, 
  Loader2,
  CheckCheck,
  Share2,
  Link2
} from 'lucide-react';
import { getApplicationQR, getApplicationLink } from '@/lib/api';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export function SchoolQRModal({ isOpen, onClose, school }) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedImage, setCopiedImage] = useState(false);

  const { data: qrData, isLoading: isQrLoading } = useQuery({
    queryKey: ['application-qr'],
    queryFn: () => getApplicationQR().then((r) => r.data.data),
    enabled: isOpen,
    staleTime: 60000,
  });

  const { data: linkData } = useQuery({
    queryKey: ['application-link'],
    queryFn: () => getApplicationLink().then((r) => r.data.data),
    enabled: isOpen,
    staleTime: 60000,
  });

  const schoolName = school?.schoolName || linkData?.schoolName || 'School';
  const logoUrl = school?.logoUrl;
  const applyUrl = linkData?.applyUrl || qrData?.applyUrl || '';

  const copyToClipboard = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2200);
  };

  const copyQRImage = async () => {
    if (!qrData?.qrDataUrl) return;
    try {
      const res = await fetch(qrData.qrDataUrl);
      const blob = await res.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      setCopiedImage(true);
      setTimeout(() => setCopiedImage(false), 2200);
    } catch {
      copyToClipboard(applyUrl);
    }
  };

  const downloadQRCode = () => {
    if (!qrData?.qrDataUrl) return;
    const link = document.createElement('a');
    link.href = qrData.qrDataUrl;
    link.download = `${linkData?.slug || 'school'}-recruitment-qr.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent 
        overlayClassName="backdrop-blur-lg bg-slate-950/60"
        className="sm:max-w-[500px] w-[95vw] p-0 overflow-hidden rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl"
      >
        {/* Modal Header */}
        <div className="px-6 pt-5 pb-4 border-b border-slate-100 dark:border-slate-800/80 bg-gradient-to-b from-slate-50/90 via-white to-white dark:from-slate-900 dark:to-slate-900">
          <div className="flex items-center gap-3 pr-7">
            <div className="h-11 w-11 rounded-xl border border-teal-200/80 dark:border-teal-800/60 bg-teal-50/60 dark:bg-teal-950/40 flex items-center justify-center p-1 shrink-0 shadow-2xs overflow-hidden">
              {logoUrl ? (
                <img src={logoUrl} alt={schoolName} className="h-full w-full object-contain" />
              ) : (
                <Building2 className="h-5 w-5 text-[#0F766E]" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <DialogTitle className="text-base font-bold text-slate-900 dark:text-white truncate tracking-tight">
                {schoolName}
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500 dark:text-slate-400 truncate flex items-center gap-1.5 mt-0.5">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span>Candidate Application & Walk-In Desk QR</span>
              </DialogDescription>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="px-6 py-5 flex flex-col items-center space-y-4 bg-slate-50/50 dark:bg-slate-950/30">
          {/* QR Code Presentation Box */}
          {isQrLoading || !qrData ? (
            <div className="h-56 w-56 rounded-2xl bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 flex flex-col items-center justify-center space-y-2">
              <Loader2 className="h-6 w-6 text-[#0F766E] animate-spin" />
              <span className="text-xs font-medium text-slate-400">Generating QR Matrix...</span>
            </div>
          ) : qrData.qrDataUrl ? (
            <div className="w-full flex flex-col items-center">
              <div className="relative p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col items-center transition-all">
                <div className="relative">
                  <img
                    src={qrData.qrDataUrl}
                    alt="Application QR Code"
                    className="h-52 w-52 sm:h-56 sm:w-56 object-contain rounded-lg"
                  />

                  {/* Centered School Crest Badge */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-white border-2 border-[#0F766E] shadow-sm flex items-center justify-center p-0.5 overflow-hidden">
                    {logoUrl ? (
                      <img src={logoUrl} alt="Logo" className="h-full w-full object-contain" />
                    ) : (
                      <SchoolIcon className="h-5 w-5 text-[#0F766E]" />
                    )}
                  </div>
                </div>

                {/* Scan Instruction Chip */}
                <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/50 border border-teal-200/70 dark:border-teal-900/60 text-[#0F766E] dark:text-teal-300 text-xs font-semibold">
                  <Smartphone className="h-3.5 w-3.5" />
                  <span>Scan with Camera or Google Lens to Apply</span>
                </div>
              </div>
            </div>
          ) : null}

          {/* Target URL Group: Properly Designed Action Buttons */}
          {applyUrl && (
            <div className="w-full">
              <div className="flex items-center justify-between gap-2.5 p-1.5 pl-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <Link2 className="h-4 w-4 text-slate-400 shrink-0" />
                  <span className="text-xs font-mono font-medium text-slate-600 dark:text-slate-300 truncate select-all">
                    {applyUrl}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => copyToClipboard(applyUrl)}
                    className="h-8 px-3 rounded-lg text-xs font-semibold bg-[#0F766E] hover:bg-[#0D9488] text-white cursor-pointer shadow-2xs transition-all flex items-center gap-1.5"
                  >
                    {copiedLink ? (
                      <>
                        <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    asChild
                    className="h-8 px-2.5 rounded-lg text-xs font-semibold border-slate-200 dark:border-slate-700 bg-slate-50/80 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 cursor-pointer shadow-2xs transition-all flex items-center gap-1"
                    title="Open Form in New Tab"
                  >
                    <a href={applyUrl} target="_blank" rel="noreferrer">
                      <ExternalLink className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
                      <span>Open</span>
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer: Download & Copy Image Actions */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="grid grid-cols-2 gap-2.5">
            <Button
              type="button"
              onClick={downloadQRCode}
              className="h-10 rounded-xl text-xs font-bold bg-[#0F766E] hover:bg-[#0D9488] text-white shadow-xs cursor-pointer flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
            >
              <Download className="h-4 w-4 shrink-0" />
              <span>Download PNG</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={copyQRImage}
              className="h-10 rounded-xl text-xs font-semibold border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer flex items-center justify-center gap-2"
            >
              {copiedImage ? (
                <>
                  <CheckCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span className="text-emerald-600 font-bold">Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="h-4 w-4 text-slate-500 shrink-0" />
                  <span>Copy Image</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
