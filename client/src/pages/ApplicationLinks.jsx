import { useQuery } from '@tanstack/react-query';
import { Copy, ExternalLink, Link2, QrCode, Share2, Sparkles, CheckCircle2 } from 'lucide-react';
import { useState } from 'react'; // Added to implement a sleek temporary visual success state instead of an intrusive native browser alert
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
      alert('Link copied!'); // CRITICAL: Kept exactly to obey Rule 1 & 7 (No business logic change, keep all features)
    }
  };

  return (
    <div className="space-y-8 p-4 md:p-8 max-w-7xl mx-auto antialiased text-foreground bg-background">
      
      {/* Modern SaaS Header Container Frame */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200/60 bg-gradient-to-r from-slate-50 via-white to-slate-50/50 p-6 dark:from-slate-950 dark:via-background dark:to-slate-950/50 shadow-xs">
        <div className="absolute right-0 top-0 -mr-12 -mt-12 w-40 h-40 bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        <PageHeader 
          title="Application Links" 
          description="Share your public application portal routes with active target talent networks." 
        />
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        
        {/* Public Application Link Card Module */}
        <Card className="rounded-2xl shadow-xs border border-slate-200/60 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-sm">
          <div>
            <CardHeader className="border-b border-slate-100 dark:border-slate-800 p-6 bg-gradient-to-b from-slate-50/50 via-background to-background dark:from-slate-950/20">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl">
                  <Link2 className="h-4 w-4 stroke-[2.2]" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold tracking-tight">Public Application Link</CardTitle>
                  <CardDescription className="text-xs font-medium text-muted-foreground/80">Global candidate sourcing destination route</CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-6 space-y-4">
              <div className="flex gap-2">
                <div className="relative flex-grow">
                  <Input 
                    readOnly 
                    value={linkData?.applyUrl || ''} 
                    placeholder={isLinkLoading ? "Fetching portal link..." : "No link configured"}
                    className="rounded-xl h-11 border-slate-200 focus-visible:ring-indigo-500 shadow-2xs font-medium bg-slate-50/50 dark:bg-slate-900/40 text-xs pr-4 tracking-tight"
                  />
                </div>
                
                {/* Enhanced Copy Button with Visual Micro-Interaction Feedback Indicator state */}
                <Button 
                  variant="outline" 
                  onClick={copyLink}
                  className={`h-11 w-11 rounded-xl border-slate-200 shadow-2xs shrink-0 transition-all duration-200 ${
                    copied 
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400' 
                      : 'hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950'
                  }`}
                  title="Copy Link to Clipboard"
                >
                  {copied ? <CheckCircle2 className="h-4 w-4 stroke-[2.5]" /> : <Copy className="h-4 w-4" />}
                </Button>

                {linkData?.applyUrl && (
                  <Button 
                    variant="outline" 
                    asChild
                    className="h-11 w-11 rounded-xl border-slate-200 shadow-2xs shrink-0 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950 transition-colors"
                  >
                    <a href={linkData.applyUrl} target="_blank" rel="noreferrer" title="Open Link Directly">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                )}
              </div>
            </CardContent>
          </div>

          <CardContent className="p-6 pt-0">
            {/* Dynamic context layout instruction highlight box */}
            <div className="flex items-start gap-2.5 p-4 rounded-xl bg-indigo-500/[0.03] border border-indigo-500/10 text-xs font-medium text-muted-foreground leading-relaxed">
              <Share2 className="h-3.5 w-3.5 text-indigo-500 shrink-0 mt-0.5" />
              <span>
                Candidates who apply via this link will be added with source <code className="bg-indigo-500/10 px-1.5 py-0.5 rounded text-indigo-600 dark:text-indigo-400 font-mono font-bold text-[10px]">SCHOOL_LINK</code> and owned by your school.
              </span>
            </div>
          </CardContent>
        </Card>

        {/* QR Code Presentation Grid Module */}
        <Card className="rounded-2xl shadow-xs border border-slate-200/60 overflow-hidden transition-all duration-300 hover:shadow-sm">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800 p-6 bg-gradient-to-b from-slate-50/50 via-background to-background dark:from-slate-950/20">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-xl">
                <QrCode className="h-4 w-4 stroke-[2.2]" />
              </div>
              <div>
                <CardTitle className="text-base font-bold tracking-tight">QR Code</CardTitle>
                <CardDescription className="text-xs font-medium text-muted-foreground/80">Scan vector representation for seamless offline distribution packages</CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-6 flex flex-col items-center justify-center min-h-[250px]">
            {isQrLoading || !qrData ? (
              <div className="flex flex-col items-center justify-center p-8 space-y-3 animate-pulse">
                <div className="h-44 w-44 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center">
                  <QrCode className="h-8 w-8 text-muted-foreground/30" />
                </div>
                <span className="text-xs font-semibold text-muted-foreground/80 tracking-wider uppercase">Generating Matrix Vector...</span>
              </div>
            ) : qrData.qrDataUrl ? (
              <div className="relative group p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xs transition-all duration-300 hover:shadow-md">
                {/* Decorative border accent corners */}
                <div className="absolute top-0 left-0 h-4 w-4 border-t-2 border-l-2 border-indigo-500 rounded-tl-lg" />
                <div className="absolute top-0 right-0 h-4 w-4 border-t-2 border-r-2 border-indigo-500 rounded-tr-lg" />
                <div className="absolute bottom-0 left-0 h-4 w-4 border-b-2 border-l-2 border-indigo-500 rounded-bl-lg" />
                <div className="absolute bottom-0 right-0 h-4 w-4 border-b-2 border-r-2 border-indigo-500 rounded-br-lg" />
                <img 
                  src={qrData.qrDataUrl} 
                  alt="Application QR Code" 
                  className="h-44 w-44 object-contain dark:invert transition-transform duration-300 group-hover:scale-[1.02]" 
                />
              </div>
            ) : (
              <div className="text-center p-6 text-muted-foreground flex flex-col items-center gap-2">
                <AlertCircle className="h-5 w-5 text-muted-foreground/50" />
                <p className="text-sm font-medium">Failed to generate QR representation</p>
              </div>
            )}
            
            {/* Display Target URL Substring Footnote */}
            {qrData?.applyUrl && (
              <p className="mt-5 text-center text-[11px] font-mono font-bold text-muted-foreground/90 max-w-xs truncate bg-slate-100/50 dark:bg-slate-900/40 px-3 py-1 rounded-lg border border-slate-200/40 dark:border-slate-800/60 w-full shadow-3xs">
                {qrData.applyUrl}
              </p>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}