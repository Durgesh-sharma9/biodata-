import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Copy, 
  ExternalLink, 
  Link2, 
  QrCode, 
  Share2, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Download, 
  Printer, 
  MessageCircle, 
  Mail, 
  Sparkles, 
  School,
  Check,
  FileText,
  Users
} from 'lucide-react';
import { getApplicationLink, getApplicationQR } from '@/lib/api';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ApplicationLinks() {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedQrUrl, setCopiedQrUrl] = useState(false);

  const { data: linkData, isLoading: isLinkLoading } = useQuery({
    queryKey: ['application-link'],
    queryFn: () => getApplicationLink().then((r) => r.data.data),
  });

  const { data: qrData, isLoading: isQrLoading } = useQuery({
    queryKey: ['application-qr'],
    queryFn: () => getApplicationQR().then((r) => r.data.data),
  });

  const applyUrl = linkData?.applyUrl || qrData?.applyUrl || '';
  const schoolName = linkData?.schoolName || 'Our School';

  const copyToClipboard = (text, type = 'link') => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    if (type === 'link') {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2200);
    } else {
      setCopiedQrUrl(true);
      setTimeout(() => setCopiedQrUrl(false), 2200);
    }
  };

  const downloadQRCode = () => {
    if (!qrData?.qrDataUrl) return;
    const link = document.createElement('a');
    link.href = qrData.qrDataUrl;
    link.download = `${linkData?.slug || 'school'}-application-qr.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const printQRPoster = () => {
    if (!qrData?.qrDataUrl) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Application QR - ${schoolName}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');
            * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Plus Jakarta Sans', sans-serif; }
            body { display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #f8fafc; padding: 20px; }
            .poster { width: 440px; background: white; border: 2px solid #e2e8f0; border-radius: 28px; padding: 40px 32px; text-align: center; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05); }
            .badge { display: inline-block; background: #f3e8ff; color: #7c3aed; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; padding: 6px 16px; border-radius: 9999px; margin-bottom: 18px; }
            h1 { font-size: 24px; font-weight: 800; color: #0f172a; margin-bottom: 8px; line-height: 1.25; }
            p.sub { font-size: 14px; color: #64748b; margin-bottom: 24px; line-height: 1.5; }
            .qr-box { background: white; padding: 18px; border-radius: 24px; display: inline-block; border: 2px dashed #cbd5e1; margin-bottom: 22px; }
            .qr-box img { width: 230px; height: 230px; display: block; }
            .instructions { background: #f1f5f9; border-radius: 16px; padding: 14px 18px; font-size: 13px; color: #334155; font-weight: 600; margin-bottom: 20px; line-height: 1.4; }
            .url-text { font-size: 11px; color: #64748b; word-break: break-all; font-family: monospace; background: #f8fafc; border: 1px solid #e2e8f0; padding: 8px 12px; border-radius: 10px; }
            @media print {
              body { background: white; padding: 0; }
              .poster { border: none; box-shadow: none; width: 100%; max-width: 480px; }
            }
          </style>
        </head>
        <body>
          <div class="poster">
            <div class="badge">Official Careers & Hiring Portal</div>
            <h1>${schoolName}</h1>
            <p class="sub">Scan the QR code below to submit your job application directly to our recruitment team.</p>
            <div class="qr-box">
              <img src="${qrData.qrDataUrl}" alt="QR Code" />
            </div>
            <div class="instructions">
              Point your smartphone camera or any QR scanner at the code to open our online application form.
            </div>
            <div class="url-text">${applyUrl}</div>
          </div>
          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const shareWhatsApp = () => {
    if (!applyUrl) return;
    const message = `*Job Vacancies at ${schoolName}*\n\nInterested candidates can submit their job application directly via our official portal:\n${applyUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`, '_blank');
  };

  const shareEmail = () => {
    if (!applyUrl) return;
    const subject = `Job Application Form - ${schoolName}`;
    const body = `Dear Candidate,\n\nPlease find the official job application link for positions at ${schoolName}:\n\n${applyUrl}\n\nPlease fill out the form with your updated credentials and qualifications.\n\nBest regards,\nRecruitment Team\n${schoolName}`;
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
  };

  return (
    <div className="space-y-6 w-full antialiased text-slate-800 dark:text-white pb-10">
      
      {/* Page Header */}
      <PageHeader 
        title="Application Links & QR Code" 
        description="Share your custom job application portal URL or QR code with candidates, teacher networks, and recruitment portals." 
        action={
          <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded-xl text-xs font-semibold">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Portal Live & Active</span>
          </div>
        }
      />

      {/* Main Structural 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Public Application Link (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="shadow-sm border-slate-200/80 dark:border-slate-800 overflow-hidden">
            <CardHeader className="p-5 border-b border-slate-100 dark:border-slate-800/60 bg-gradient-to-r from-slate-50/80 via-white to-slate-50/50 dark:from-slate-900/40 dark:to-slate-900/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-[#A05AFF]/10 text-[#A05AFF] rounded-xl ring-1 ring-[#A05AFF]/20">
                    <Link2 className="h-5 w-5 stroke-[2.2]" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100">
                      Public Application Link
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      Direct application portal tailored for {schoolName}
                    </CardDescription>
                  </div>
                </div>

                {linkData?.slug && (
                  <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-mono text-slate-600 dark:text-slate-300 font-semibold border border-slate-200/60 dark:border-slate-700">
                    <School className="h-3 w-3 text-[#A05AFF]" />
                    {linkData.slug}
                  </span>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="p-5 space-y-5">
              
              {/* URL Display Box with Quick Actions */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                  Target Candidate URL
                </label>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                  <div className="relative flex-grow">
                    <Input 
                      readOnly 
                      value={applyUrl} 
                      placeholder={isLinkLoading ? "Generating unique portal link..." : "No link configured"}
                      onClick={() => copyToClipboard(applyUrl, 'link')}
                      className="h-11 pl-3.5 pr-8 border-slate-200/90 rounded-xl focus-visible:ring-[#A05AFF] focus-visible:border-[#A05AFF] dark:bg-slate-900 dark:border-slate-800 font-medium text-xs tracking-tight text-slate-700 dark:text-slate-200 cursor-pointer bg-slate-50/50 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors"
                    />
                  </div>
                  
                  {/* Primary Copy Action Button */}
                  <Button 
                    type="button"
                    onClick={() => copyToClipboard(applyUrl, 'link')}
                    className={`h-11 px-4 rounded-xl shrink-0 font-semibold text-xs transition-all duration-200 shadow-sm ${
                      copiedLink 
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                        : 'bg-[#A05AFF] hover:bg-[#8e44ee] text-white'
                    }`}
                  >
                    {copiedLink ? (
                      <>
                        <Check className="h-4 w-4 mr-1.5 stroke-[2.5]" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-1.5" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </Button>

                  {/* Open / Preview Action Button */}
                  {applyUrl && (
                    <Button 
                      type="button"
                      variant="outline" 
                      asChild
                      className="h-11 px-3.5 rounded-xl shrink-0 font-semibold text-xs border-slate-200 dark:border-slate-700 hover:border-[#A05AFF]/50 hover:bg-[#A05AFF]/5 hover:text-[#A05AFF] text-slate-700 dark:text-slate-300"
                    >
                      <a href={applyUrl} target="_blank" rel="noreferrer" title="Open candidate form in new tab">
                        <ExternalLink className="h-4 w-4 mr-1.5" />
                        <span>Preview</span>
                      </a>
                    </Button>
                  )}
                </div>
              </div>

              {/* Quick Share Section */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/60">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2.5">
                  Fast Distribution Channels
                </span>
                <div className="flex flex-wrap items-center gap-2.5">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={shareWhatsApp}
                    className="h-9 px-3.5 rounded-xl text-xs font-semibold border-emerald-200 bg-emerald-50/40 text-emerald-700 hover:bg-emerald-100/60 hover:border-emerald-300 dark:bg-emerald-950/20 dark:border-emerald-800/50 dark:text-emerald-400 transition-colors"
                  >
                    <MessageCircle className="h-3.5 w-3.5 mr-1.5 text-emerald-600 dark:text-emerald-400" />
                    Share on WhatsApp
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={shareEmail}
                    className="h-9 px-3.5 rounded-xl text-xs font-semibold border-sky-200 bg-sky-50/40 text-sky-700 hover:bg-sky-100/60 hover:border-sky-300 dark:bg-sky-950/20 dark:border-sky-800/50 dark:text-sky-400 transition-colors"
                  >
                    <Mail className="h-3.5 w-3.5 mr-1.5 text-sky-600 dark:text-sky-400" />
                    Send via Email
                  </Button>
                </div>
              </div>

              {/* Informational Callout Banner */}
              <div className="p-4 rounded-xl border border-[#A05AFF]/25 bg-gradient-to-r from-[#A05AFF]/5 via-[#A05AFF]/[0.02] to-transparent flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-[#A05AFF]/10 text-[#A05AFF] shrink-0 mt-0.5">
                  <Share2 className="h-4 w-4" />
                </div>
                <div className="space-y-1 text-xs">
                  <div className="font-bold text-slate-800 dark:text-slate-200">
                    Direct School Ownership Guarantee
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                    Candidates who register through this link or QR code will be designated with source <span className="bg-[#A05AFF]/10 px-1.5 py-0.5 rounded text-[#A05AFF] font-mono font-bold text-[11px]">SCHOOL_LINK</span> and assigned exclusively to your school at no credit deduction.
                  </p>
                </div>
              </div>

            </CardContent>
          </Card>
        </div>

        {/* Right Column: QR Code Module (5 cols) */}
        <div className="lg:col-span-5">
          <Card className="shadow-sm border-slate-200/80 dark:border-slate-800 overflow-hidden flex flex-col">
            <CardHeader className="p-5 border-b border-slate-100 dark:border-slate-800/60 bg-gradient-to-r from-slate-50/80 via-white to-slate-50/50 dark:from-slate-900/40 dark:to-slate-900/10">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#9E58FF]/10 text-[#9E58FF] rounded-xl ring-1 ring-[#9E58FF]/20">
                  <QrCode className="h-5 w-5 stroke-[2.2]" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100">
                    Instant Scan QR Code
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    Ready for print standees, posters & flyers
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-6 flex flex-col items-center justify-center space-y-5">
              
              {/* QR Container */}
              {isQrLoading || !qrData ? (
                <div className="flex flex-col items-center justify-center p-8 space-y-3">
                  <div className="h-48 w-48 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-dashed border-slate-300 dark:border-slate-800 flex items-center justify-center">
                    <Loader2 className="h-7 w-7 text-[#A05AFF] animate-spin" />
                  </div>
                  <span className="text-xs font-bold text-slate-400 dark:text-slate-500 tracking-wider animate-pulse">
                    Generating Matrix Vector...
                  </span>
                </div>
              ) : qrData.qrDataUrl ? (
                <div className="relative group p-4 rounded-2xl bg-white dark:bg-slate-950 border-2 border-slate-200/90 dark:border-slate-800 shadow-md transition-all duration-300 hover:shadow-lg">
                  {/* Modern Corner Focus Target Markers */}
                  <div className="absolute -top-1 -left-1 h-5 w-5 border-t-2 border-l-2 border-[#A05AFF] rounded-tl-lg" />
                  <div className="absolute -top-1 -right-1 h-5 w-5 border-t-2 border-r-2 border-[#A05AFF] rounded-tr-lg" />
                  <div className="absolute -bottom-1 -left-1 h-5 w-5 border-b-2 border-l-2 border-[#A05AFF] rounded-bl-lg" />
                  <div className="absolute -bottom-1 -right-1 h-5 w-5 border-b-2 border-r-2 border-[#A05AFF] rounded-br-lg" />
                  
                  <img 
                    src={qrData.qrDataUrl} 
                    alt="Application QR Code" 
                    className="h-44 w-44 object-contain transition-transform duration-300 group-hover:scale-[1.02]" 
                  />
                </div>
              ) : (
                <div className="text-center p-6 text-slate-400 flex flex-col items-center gap-2">
                  <AlertCircle className="h-6 w-6 text-[#FE9496]" />
                  <p className="text-sm font-medium">Failed to generate QR representation</p>
                </div>
              )}

              {/* QR Code Action Buttons */}
              <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-1">
                <Button 
                  type="button"
                  variant="outline"
                  onClick={downloadQRCode}
                  disabled={!qrData?.qrDataUrl}
                  className="w-full sm:w-auto flex-1 h-10 px-4 rounded-xl border-slate-200 dark:border-slate-700 hover:border-[#A05AFF]/40 hover:bg-[#A05AFF]/5 hover:text-[#A05AFF] text-slate-700 dark:text-slate-300 text-xs font-semibold shadow-xs"
                >
                  <Download className="h-4 w-4 mr-1.5 text-[#A05AFF]" />
                  Download PNG
                </Button>

                <Button 
                  type="button"
                  variant="outline"
                  onClick={printQRPoster}
                  disabled={!qrData?.qrDataUrl}
                  className="w-full sm:w-auto flex-1 h-10 px-4 rounded-xl border-slate-200 dark:border-slate-700 hover:border-[#A05AFF]/40 hover:bg-[#A05AFF]/5 hover:text-[#A05AFF] text-slate-700 dark:text-slate-300 text-xs font-semibold shadow-xs"
                >
                  <Printer className="h-4 w-4 mr-1.5 text-[#9E58FF]" />
                  Print Poster
                </Button>
              </div>

              {/* Target URL Substring Badge */}
              {applyUrl && (
                <button
                  type="button"
                  onClick={() => copyToClipboard(applyUrl, 'qr')}
                  className="group flex items-center justify-between gap-2 text-left text-[11px] font-mono font-medium max-w-full border border-slate-200/90 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 px-3 py-2 rounded-xl w-full transition-colors"
                  title="Click to copy link"
                >
                  <span className="truncate flex-1">{applyUrl}</span>
                  <span className="shrink-0 text-slate-400 group-hover:text-[#A05AFF] transition-colors">
                    {copiedQrUrl ? <Check className="h-3.5 w-3.5 text-emerald-500 stroke-[2.5]" /> : <Copy className="h-3.5 w-3.5" />}
                  </span>
                </button>
              )}

            </CardContent>
          </Card>
        </div>

      </div>

      {/* Recommended Best Practices Guide Section */}
      <div className="pt-2">
        <div className="mb-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#A05AFF]" />
            Best Ways to Distribute Your Application Link
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Collect verified candidate profiles smoothly across offline and online touchpoints.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400 shrink-0">
              <Printer className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                1. Reception & Gate Standee
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Click <strong>"Print Poster"</strong> to create a ready-to-print flyer for walk-in applicants visiting your campus.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 shrink-0">
              <MessageCircle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                2. WhatsApp Teacher Groups
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Share directly into educator groups, alumni networks, and WhatsApp status with one click.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-950/40 dark:text-sky-400 shrink-0">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                3. Instant Candidate Tracking
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Every submission immediately reflects in your <strong>"My Candidates"</strong> tab with full details & resumes.
              </p>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}