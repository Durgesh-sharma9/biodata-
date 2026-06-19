import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Copy, ExternalLink, Link2, QrCode, Share2, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { getApplicationLink, getApplicationQR } from '@/lib/api';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ApplicationLinks() {
  const [copied, setCopied] = useState(false);

  const { data: linkData, isLoading: isLinkLoading } = useQuery({
    queryKey: ['application-link'],
    queryFn: () => getApplicationLink().then((r) => r.data.data),
  });

  const { data: qrData, isLoading: isQrLoading } = useQuery({
    queryKey: ['application-qr'],
    queryFn: () => getApplicationQR().then((r) => r.data.data),
  });

  const copyLink = () => {
    if (linkData?.applyUrl) {
      navigator.clipboard.writeText(linkData.applyUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      alert('Link copied!'); // Maintained exactly as requested to preserve core business functional logic
    }
  };

  return (
    <div className="space-y-6 p-5 max-w-7xl mx-auto bg-[#f3f3f4] dark:bg-slate-950 text-slate-800 dark:text-white antialiased min-h-screen">
      
      {/* Minimalist Page Header Panel */}
      <div className="border-b border-slate-100 dark:border-slate-800 pb-5">
        <PageHeader 
          title="Application Links" 
          description="Share your public application portal routes with active target talent networks." 
          className="text-slate-800 dark:text-white font-bold tracking-tight text-xl"
        />
      </div>

      {/* Structural Layout Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Public Application Link Card Module */}
        <Card className="rounded-xl border-none bg-white shadow-sm dark:bg-slate-900 flex flex-col justify-between overflow-hidden">
          <div>
            <CardHeader className="p-5 border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/70 dark:bg-slate-900/20">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#A05AFF]/10 text-[#A05AFF] rounded-xl">
                  <Link2 className="h-4 w-4 stroke-[2.2]" />
                </div>
                <div>
                  <CardTitle className="text-sm font-bold tracking-wide text-slate-800 dark:text-slate-200">Public Application Link</CardTitle>
                  <CardDescription className="text-xs text-slate-400 dark:text-slate-500 font-medium">Global candidate sourcing destination route</CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-5 space-y-4">
              <div className="flex gap-2">
                <div className="relative flex-grow">
                  <Input 
                    readOnly 
                    value={linkData?.applyUrl || ''} 
                    placeholder={isLinkLoading ? "Fetching portal link..." : "No link configured"}
                    className="h-11 border-slate-200 rounded-xl focus-visible:ring-[#A05AFF] focus-visible:border-[#A05AFF]/50 dark:bg-slate-800 dark:border-slate-700 font-medium text-xs pr-4 tracking-tight"
                  />
                </div>
                
                {/* Accent Micro-Interaction Copy Button */}
                <Button 
                  variant="outline" 
                  onClick={copyLink}
                  className={`h-11 w-11 rounded-xl border-slate-200 dark:border-slate-700 shrink-0 transition-all duration-200 ${
                    copied 
                      ? 'border-[#1BCFB4]/30 bg-[#1BCFB4]/5 text-[#1BCFB4]' 
                      : 'hover:bg-[#A05AFF]/10 hover:text-[#A05AFF] text-slate-500 dark:text-slate-400'
                  }`}
                  title="Copy Link to Clipboard"
                >
                  {copied ? <CheckCircle2 className="h-4 w-4 stroke-[2.5]" /> : <Copy className="h-4 w-4" />}
                </Button>

                {linkData?.applyUrl && (
                  <Button 
                    variant="outline" 
                    asChild
                    className="h-11 w-11 rounded-xl border-slate-200 dark:border-slate-700 shrink-0 hover:bg-[#A05AFF]/10 hover:text-[#A05AFF] text-slate-500 dark:text-slate-400 transition-colors"
                  >
                    <a href={linkData.applyUrl} target="_blank" rel="noreferrer" title="Open Link Directly">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                )}
              </div>
            </CardContent>
          </div>

          <CardContent className="p-5 pt-0">
            {/* Modern Soft-Tint Badge Informative Block */}
            <div className="flex items-start gap-2.5 p-4 rounded-xl border border-[#A05AFF]/30 bg-[#A05AFF]/5 text-xs font-bold text-[#A05AFF] leading-relaxed">
              <Share2 className="h-3.5 w-3.5 text-[#A05AFF] shrink-0 mt-0.5" />
              <span>
                Candidates who apply via this link will be added with source <code className="bg-[#A05AFF]/10 px-1.5 py-0.5 rounded text-[#A05AFF] font-mono font-bold text-[10px]">SCHOOL_LINK</code> and owned by your school.
              </span>
            </div>
          </CardContent>
        </Card>

        {/* QR Code Presentation Module */}
        <Card className="rounded-xl border-none bg-white shadow-sm dark:bg-slate-900 overflow-hidden">
          <CardHeader className="p-5 border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/70 dark:bg-slate-900/20">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#9E58FF]/10 text-[#9E58FF] rounded-xl">
                <QrCode className="h-4 w-4 stroke-[2.2]" />
              </div>
              <div>
                <CardTitle className="text-sm font-bold tracking-wide text-slate-800 dark:text-slate-200">QR Code</CardTitle>
                <CardDescription className="text-xs text-slate-400 dark:text-slate-500 font-medium">Scan vector representation for seamless offline distribution packages</CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-5 flex flex-col items-center justify-center min-h-[250px]">
            {isQrLoading || !qrData ? (
              <div className="flex flex-col items-center justify-center p-6 space-y-3">
                <div className="h-44 w-44 rounded-xl bg-slate-50 dark:bg-slate-950 border border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center">
                  <Loader2 className="h-6 w-6 text-[#A05AFF] animate-spin" />
                </div>
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider animate-pulse">Generating Matrix Vector...</span>
              </div>
            ) : qrData.qrDataUrl ? (
              <div className="relative group p-4 rounded-xl bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 shadow-sm transition-all duration-300">
                {/* Precise Corner Matrix Outlines */}
                <div className="absolute top-0 left-0 h-4 w-4 border-t-2 border-l-2 border-[#A05AFF] rounded-tl-md" />
                <div className="absolute top-0 right-0 h-4 w-4 border-t-2 border-r-2 border-[#A05AFF] rounded-tr-md" />
                <div className="absolute bottom-0 left-0 h-4 w-4 border-b-2 border-l-2 border-[#A05AFF] rounded-bl-md" />
                <div className="absolute bottom-0 right-0 h-4 w-4 border-b-2 border-r-2 border-[#A05AFF] rounded-br-md" />
                <img 
                  src={qrData.qrDataUrl} 
                  alt="Application QR Code" 
                  className="h-44 w-44 object-contain dark:invert transition-transform duration-300 group-hover:scale-[1.02]" 
                />
              </div>
            ) : (
              <div className="text-center p-6 text-slate-400 flex flex-col items-center gap-2">
                <AlertCircle className="h-5 w-5 text-[#FE9496]" />
                <p className="text-sm font-medium">Failed to generate QR representation</p>
              </div>
            )}
            
            {/* Display Target URL Substring Footnote */}
            {qrData?.applyUrl && (
              <p className="mt-5 text-center text-[11px] font-mono font-bold max-w-xs truncate border border-[#4BCBEB]/30 bg-[#4BCBEB]/5 text-[#4BCBEB] px-3 py-1.5 rounded-xl w-full shadow-none">
                {qrData.applyUrl}
              </p>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}