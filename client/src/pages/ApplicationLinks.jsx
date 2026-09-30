import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
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
  Users,
  Smartphone,
  Building2,
  Layers,
  Image as ImageIcon,
  MessageSquare,
  Send,
  CheckCheck,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  FileCheck,
  Clock,
  Eye
} from 'lucide-react';
import { getApplicationLink, getApplicationQR, getMySchool, getCandidates } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ApplicationLinks() {
  const { school: authSchool, isSuperAdmin, isApplicant } = useAuth();
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedQrUrl, setCopiedQrUrl] = useState(false);
  const [copiedImage, setCopiedImage] = useState(false);
  const [qrViewMode, setQrViewMode] = useState('standee'); // 'standee' | 'minimal'
  const [copiedBroadcast, setCopiedBroadcast] = useState(false);
  const [broadcastTab, setBroadcastTab] = useState('whatsapp'); // 'whatsapp' | 'linkedin' | 'sms'

  const { data: mySchoolData } = useQuery({
    queryKey: ['mySchool'],
    queryFn: () => getMySchool().then((r) => r.data.data),
    enabled: !isSuperAdmin && !isApplicant,
    staleTime: 30000,
  });

  const { data: walkinCandidatesData } = useQuery({
    queryKey: ['walkin-candidates-count'],
    queryFn: () => getCandidates({ source: 'SCHOOL_LINK', limit: 1 }).then((r) => r.data),
    enabled: !isSuperAdmin && !isApplicant,
    staleTime: 30000,
  });

  const { data: linkData, isLoading: isLinkLoading } = useQuery({
    queryKey: ['application-link'],
    queryFn: () => getApplicationLink().then((r) => r.data.data),
  });

  const { data: qrData, isLoading: isQrLoading } = useQuery({
    queryKey: ['application-qr'],
    queryFn: () => getApplicationQR().then((r) => r.data.data),
  });

  const school = mySchoolData || authSchool;
  const applyUrl = linkData?.applyUrl || qrData?.applyUrl || '';
  const schoolName = school?.schoolName || linkData?.schoolName || 'Our School';
  const logoUrl = school?.logoUrl;
  const schoolPhone = school?.phone || '';
  const schoolEmail = school?.email || '';
  const schoolAddress = [school?.address, school?.city, school?.state].filter(Boolean).join(', ');

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
    } catch (e) {
      // Fallback
      copyToClipboard(applyUrl, 'qr');
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

  const printQRPoster = () => {
    if (!qrData?.qrDataUrl) return;

    // Remove any existing print iframe to prevent duplicate DOM nodes
    const existingIframe = document.getElementById('qr-print-frame');
    if (existingIframe) existingIframe.remove();

    const iframe = document.createElement('iframe');
    iframe.id = 'qr-print-frame';
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    iframe.style.visibility = 'hidden';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Recruitment Poster - ${schoolName}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
            * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Plus Jakarta Sans', -apple-system, sans-serif; }
            
            @page {
              size: A4 portrait;
              margin: 8mm;
            }

            html, body {
              width: 100%;
              height: 100%;
              margin: 0;
              padding: 0;
              background: white;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }

            body { 
              display: flex; 
              align-items: stretch; 
              justify-content: center; 
              padding: 0;
            }

            .poster-sheet { 
              width: 100%; 
              height: 278mm;
              max-height: 278mm;
              background: white; 
              border: 3.5px solid #7c3aed; 
              outline: 2px solid #ddd6fe;
              outline-offset: -8px;
              border-radius: 20px; 
              padding: 24px 28px 18px 28px; 
              position: relative; 
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              box-sizing: border-box;
              page-break-after: avoid;
              page-break-inside: avoid;
            }

            .top-brand-bar { 
              height: 8px; 
              background: linear-gradient(90deg, #0F766E 0%, #7928CA 50%, #EC4899 100%); 
              border-radius: 9999px; 
              margin-bottom: 12px; 
            }

            .header-row { 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              gap: 16px; 
              margin-bottom: 10px; 
            }

            .school-logo { 
              width: 72px; 
              height: 72px; 
              border-radius: 18px; 
              border: 2px solid #d8b4fe; 
              background: #faf5ff; 
              padding: 5px; 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              flex-shrink: 0; 
              box-shadow: 0 4px 10px rgba(160, 90, 255, 0.12);
            }
            .school-logo img { max-width: 100%; max-height: 100%; object-fit: contain; }

            .header-text { text-align: left; }
            .header-text h1 { 
              font-size: 28px; 
              font-weight: 900; 
              color: #0f172a; 
              text-transform: uppercase; 
              line-height: 1.15; 
              letter-spacing: -0.5px; 
            }
            .header-text p { 
              font-size: 12px; 
              font-weight: 800; 
              color: #7c3aed; 
              letter-spacing: 1.2px; 
              text-transform: uppercase; 
              margin-top: 3px; 
            }

            .highlight-banner { 
              background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%); 
              border: 2px solid #c4b5fd; 
              border-radius: 14px; 
              padding: 10px 18px; 
              text-align: center; 
              margin-bottom: 12px; 
            }
            .highlight-banner .main-title { 
              color: #5b21b6; 
              font-size: 13.5px; 
              font-weight: 900; 
              letter-spacing: 0.8px; 
              text-transform: uppercase; 
            }
            .highlight-banner .sub-title {
              color: #6d28d9;
              font-size: 10.5px;
              font-weight: 600;
              margin-top: 2px;
            }

            .vacancies-box { 
              background: #f8fafc; 
              border: 1.5px solid #cbd5e1; 
              border-radius: 16px; 
              padding: 12px 16px; 
              margin-bottom: 12px; 
            }
            .vacancies-title { 
              font-size: 11px; 
              font-weight: 800; 
              color: #334155; 
              text-transform: uppercase; 
              letter-spacing: 0.8px; 
              text-align: center; 
              margin-bottom: 8px; 
            }
            .vacancies-grid { 
              display: grid; 
              grid-template-columns: repeat(3, 1fr); 
              gap: 10px; 
              text-align: center; 
            }
            .vacancy-col { 
              background: white; 
              border: 1.5px solid #e2e8f0; 
              border-radius: 12px; 
              padding: 10px 8px; 
              box-shadow: 0 2px 4px rgba(0,0,0,0.02);
            }
            .col-title { font-size: 12px; font-weight: 800; text-transform: uppercase; }
            .col-sub { font-size: 10px; color: #334155; font-weight: 600; margin-top: 3px; line-height: 1.35; }

            .qr-hero-card { 
              display: flex; 
              flex-direction: column; 
              align-items: center; 
              justify-content: center; 
              background: linear-gradient(180deg, #faf5ff 0%, #f3e8ff 100%); 
              border: 2.5px dashed #a855f7; 
              border-radius: 20px; 
              padding: 16px 20px; 
              margin-bottom: 12px; 
              text-align: center; 
            }
            .qr-hero-title { 
              font-size: 14px; 
              font-weight: 900; 
              color: #4c1d95; 
              text-transform: uppercase; 
              letter-spacing: 0.6px; 
              margin-bottom: 10px; 
            }
            .qr-image-frame { 
              background: white; 
              padding: 14px; 
              border-radius: 20px; 
              box-shadow: 0 8px 20px rgba(160, 90, 255, 0.18); 
              border: 2px solid #e9d5ff; 
              margin-bottom: 10px; 
            }
            .qr-image-frame img { width: 250px; height: 250px; display: block; }
            .qr-hero-badge { 
              font-size: 11px; 
              font-weight: 700; 
              color: #6b21a8; 
              background: white; 
              border: 1.5px solid #d8b4fe; 
              padding: 5px 18px; 
              border-radius: 9999px; 
            }

            .steps-grid { 
              display: grid; 
              grid-template-columns: repeat(3, 1fr); 
              gap: 10px; 
              margin-bottom: 12px; 
            }
            .step-card { 
              background: #f8fafc; 
              border: 1.5px solid #e2e8f0; 
              border-radius: 14px; 
              padding: 10px 8px; 
              text-align: center; 
            }
            .step-circle { 
              width: 24px; 
              height: 24px; 
              background: #0F766E; 
              color: white; 
              border-radius: 50%; 
              font-weight: 900; 
              font-size: 11px; 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              margin: 0 auto 5px auto; 
            }
            .step-heading { font-size: 11px; font-weight: 800; color: #0f172a; }
            .step-desc { font-size: 9.5px; color: #64748b; margin-top: 2px; line-height: 1.25; }

            .url-badge { 
              font-size: 10.5px; 
              color: #475569; 
              word-break: break-all; 
              font-family: monospace; 
              background: #f1f5f9; 
              border: 1.5px dashed #cbd5e1; 
              padding: 8px 14px; 
              border-radius: 10px; 
              text-align: center; 
              margin-bottom: 12px; 
            }

            .poster-footer { 
              border-top: 2px solid #e2e8f0; 
              padding-top: 10px; 
              display: flex; 
              justify-content: space-between; 
              align-items: center; 
              font-size: 11px; 
              color: #475569; 
            }

            @media print {
              body { 
                background: white !important;
                padding: 0 !important;
                margin: 0 !important;
              }
              .poster-sheet { 
                border: 3.5px solid #7c3aed !important; 
                outline: 2px solid #ddd6fe !important;
                outline-offset: -8px !important;
                box-shadow: none !important; 
                width: 100% !important; 
                height: 278mm !important;
                max-height: 278mm !important;
                min-height: 278mm !important;
                margin: 0 auto !important;
                page-break-after: avoid !important; 
                page-break-inside: avoid !important; 
              }
            }
          </style>
        </head>
        <body>
          <div class="poster-sheet">
            <div>
              <div class="top-brand-bar"></div>

              <div class="header-row">
                ${logoUrl ? `
                  <div class="school-logo">
                    <img src="${logoUrl}" alt="${schoolName}" />
                  </div>
                ` : ''}
                <div class="header-text" style="${logoUrl ? '' : 'text-align: center; width: 100%;'}">
                  <h1>${schoolName}</h1>
                  <p>Official Faculty & Staff Recruitment Portal</p>
                </div>
              </div>

              <div class="highlight-banner">
                <div class="main-title">⭐ Walk-In Applications & Teaching Vacancies Open ⭐</div>
                <div class="sub-title">Candidates are invited to submit their credentials directly to School Administration</div>
              </div>

              <div class="vacancies-box">
                <div class="vacancies-title">Positions Open for Immediate Consideration</div>
                <div class="vacancies-grid">
                  <div class="vacancy-col">
                    <div class="col-title" style="color: #7c3aed;">TEACHING FACULTY</div>
                    <div class="col-sub">PGT • TGT • PRT • Nursery<br/><span style="color: #64748b; font-weight: 500; font-size: 9px;">All Academic Subjects</span></div>
                  </div>
                  <div class="vacancy-col">
                    <div class="col-title" style="color: #2563eb;">ACTIVITY & SPORTS</div>
                    <div class="col-sub">Physical Ed • Music • Art<br/><span style="color: #64748b; font-weight: 500; font-size: 9px;">Yoga • Dance • Librarian</span></div>
                  </div>
                  <div class="vacancy-col">
                    <div class="col-title" style="color: #059669;">ADMIN & SUPPORT</div>
                    <div class="col-sub">Academic Coord • Receptionist<br/><span style="color: #64748b; font-weight: 500; font-size: 9px;">Accountant • Lab Assistant</span></div>
                  </div>
                </div>
              </div>
            </div>

            <div class="qr-hero-card">
              <div class="qr-hero-title">
                📷 Point Your Phone Camera at QR Code to Apply
              </div>
              <div class="qr-image-frame">
                <img src="${qrData.qrDataUrl}" alt="Application QR Code" />
              </div>
              <div class="qr-hero-badge">
                ⚡ Takes only 2 minutes • Direct submission to Principal & Management
              </div>
            </div>

            <div>
              <div class="steps-grid">
                <div class="step-card">
                  <div class="step-circle">1</div>
                  <div class="step-heading">Open Phone Camera</div>
                  <div class="step-desc">Open Camera or Google Lens on any smartphone</div>
                </div>
                <div class="step-card">
                  <div class="step-circle">2</div>
                  <div class="step-heading">Scan & Tap Link</div>
                  <div class="step-desc">Point at QR code and tap the application link</div>
                </div>
                <div class="step-card">
                  <div class="step-circle" style="background: #10b981;">3</div>
                  <div class="step-heading">Submit Biodata</div>
                  <div class="step-desc">Fill subjects & experience for direct interview call</div>
                </div>
              </div>

              <div class="url-badge">
                🌐 Direct Online Portal: <strong style="color: #0f172a;">${applyUrl}</strong>
              </div>

              <div class="poster-footer">
                <div>
                  ${schoolAddress ? `<span>📍 ${schoolAddress}</span>` : `<span>📍 ${schoolName} Campus</span>`}
                  ${schoolPhone ? `<span style="margin-left: 12px; font-weight: 700; color: #0f172a;">📞 Contact: ${schoolPhone}</span>` : ''}
                  ${schoolEmail ? `<span style="margin-left: 12px;">✉️ ${schoolEmail}</span>` : ''}
                </div>
                <div style="font-weight: 800; color: #7c3aed; text-transform: uppercase; letter-spacing: 0.5px;">
                  Official Recruitment Standee
                </div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `);
    doc.close();

    // Trigger print directly inside the iframe without navigating or opening a new tab
    setTimeout(() => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    }, 350);
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

  const walkinCount = walkinCandidatesData?.pagination?.total ?? (walkinCandidatesData?.data?.length || 0);

  const getBroadcastMessage = (type) => {
    const cleanUrl = applyUrl || (typeof window !== 'undefined' ? `${window.location.origin}/apply` : '');
    if (type === 'whatsapp') {
      return `📢 *TEACHING & STAFF VACANCIES — ${schoolName.toUpperCase()}* 🎓\n\n` +
        `We are inviting passionate, qualified teachers & administrative staff to join our vibrant academic team.\n\n` +
        `✨ *Open Positions:*\n` +
        `• PGT / TGT / PRT (All Subjects)\n` +
        `• Pre-Primary & Kindergarten Teachers\n` +
        `• Activity, Sports, Art & Music Faculty\n` +
        `• Front Desk & Administrative Executives\n\n` +
        `📝 *Direct 2-Minute Application:* \n` +
        `👉 ${cleanUrl}\n\n` +
        `No password or complex registration needed. Simply tap the link above and submit your details!\n\n` +
        (schoolAddress ? `📍 *Location:* ${schoolAddress}\n` : '') +
        (schoolPhone ? `📞 *Contact:* ${schoolPhone}` : '');
    }

    if (type === 'linkedin') {
      return `🌟 We are hiring at ${schoolName}!\n\n` +
        `We are looking for dedicated educators and professional staff members to join our team for the upcoming academic session.\n\n` +
        `🎯 Current Openings:\n` +
        `• Senior Secondary & High School Teachers (PGT/TGT)\n` +
        `• Primary & Foundational Stage Educators (PRT/NTT)\n` +
        `• Physical Education, Arts, & Performing Arts Faculty\n` +
        `• Academic Coordinators & Campus Operations\n\n` +
        `Interested candidates can apply directly through our school's portal in under 2 minutes:\n` +
        `🔗 ${cleanUrl}\n\n` +
        `#TeachingJobs #SchoolRecruitment #HiringEducators #EducationJobs #FacultyVacancies`;
    }

    // sms / status
    return `📢 Vacancies at ${schoolName}! We are hiring PGT, TGT, PRT & Admin staff. Apply directly online in 2 mins: ${cleanUrl} (Free / No login required)`;
  };

  const copyBroadcastMessage = () => {
    const msg = getBroadcastMessage(broadcastTab);
    navigator.clipboard.writeText(msg);
    setCopiedBroadcast(true);
    setTimeout(() => setCopiedBroadcast(false), 2200);
  };

  const shareBroadcastWhatsApp = () => {
    const msg = getBroadcastMessage(broadcastTab);
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const renderFormattedMessage = (text) => {
    return text.split('\n').map((line, lineIdx) => {
      const parts = line.split(/(\*[^*]+\*)/g);
      return (
        <div key={lineIdx} className={line.trim() === '' ? 'h-2' : 'min-h-[1.25rem]'}>
          {parts.map((part, pIdx) => {
            if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
              return (
                <strong key={pIdx} className="font-bold text-slate-900 dark:text-slate-100">
                  {part.slice(1, -1)}
                </strong>
              );
            }
            return <span key={pIdx}>{part}</span>;
          })}
        </div>
      );
    });
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
                  <div className="p-2.5 bg-[#0F766E]/10 text-[#0F766E] rounded-xl ring-1 ring-[#0F766E]/20">
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
                    <School className="h-3 w-3 text-[#0F766E]" />
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
                      className="h-11 pl-3.5 pr-8 border-slate-200/90 rounded-xl focus-visible:ring-[#0F766E] focus-visible:border-[#0F766E] dark:bg-slate-900 dark:border-slate-800 font-medium text-xs tracking-tight text-slate-700 dark:text-slate-200 cursor-pointer bg-slate-50/50 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors"
                    />
                  </div>
                  
                  {/* Primary Copy Action Button */}
                  <Button 
                    type="button"
                    onClick={() => copyToClipboard(applyUrl, 'link')}
                    className={`h-11 px-4 rounded-xl shrink-0 font-semibold text-xs transition-all duration-200 shadow-sm ${
                      copiedLink 
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                        : 'bg-[#0F766E] hover:bg-[#0D9488] text-white'
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
                      className="h-11 px-3.5 rounded-xl shrink-0 font-semibold text-xs border-slate-200 dark:border-slate-700 hover:border-[#0F766E]/50 hover:bg-[#0F766E]/5 hover:text-[#0F766E] text-slate-700 dark:text-slate-300"
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
              <div className="p-4 rounded-xl border border-[#0F766E]/25 bg-gradient-to-r from-[#0F766E]/5 via-[#0F766E]/[0.02] to-transparent flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-[#0F766E]/10 text-[#0F766E] shrink-0 mt-0.5">
                  <Share2 className="h-4 w-4" />
                </div>
                <div className="space-y-1 text-xs">
                  <div className="font-bold text-slate-800 dark:text-slate-200">
                    Direct School Ownership Guarantee
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                    Candidates who register through this link or QR code will be designated with source <span className="bg-[#0F766E]/10 px-1.5 py-0.5 rounded text-[#0F766E] font-mono font-bold text-[11px]">SCHOOL_LINK</span> and assigned exclusively to your school at no credit deduction.
                  </p>
                </div>
              </div>

            </CardContent>
          </Card>

          {/* Card: Ready-to-Share Broadcast Messages */}
          <Card className="shadow-md border-slate-200/80 dark:border-slate-800 overflow-hidden">
            <CardHeader className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800/60 bg-gradient-to-r from-slate-50/80 via-white to-slate-50/50 dark:from-slate-900/60 dark:to-slate-900/20">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2.5 bg-gradient-to-tr from-emerald-500/15 to-emerald-600/20 text-emerald-600 dark:text-emerald-400 rounded-xl ring-1 ring-emerald-500/30 shadow-2xs shrink-0">
                    <MessageSquare className="h-5 w-5 stroke-[2.2]" />
                  </div>
                  <div className="min-w-0">
                    <CardTitle className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 truncate">
                      Ready-to-Share Job Announcements
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate">
                      Pre-formatted templates with your school name & application link.
                    </CardDescription>
                  </div>
                </div>

                <div className="shrink-0">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60 shadow-2xs whitespace-nowrap">
                    <Sparkles className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                    1-Click Copy
                  </span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-4 sm:p-5 space-y-4">
              {/* Segmented Channel Tabs */}
              <div className="flex flex-wrap items-center justify-between gap-2.5">
                <div className="inline-flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setBroadcastTab('whatsapp')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                      broadcastTab === 'whatsapp'
                        ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs font-bold'
                        : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                    }`}
                  >
                    <MessageCircle className="h-3.5 w-3.5 text-emerald-500" />
                    <span>WhatsApp</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setBroadcastTab('linkedin')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                      broadcastTab === 'linkedin'
                        ? 'bg-white dark:bg-slate-900 text-[#0077b5] dark:text-[#38bdf8] shadow-xs font-bold'
                        : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                    }`}
                  >
                    <Share2 className="h-3.5 w-3.5 text-[#0077b5]" />
                    <span>LinkedIn</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setBroadcastTab('sms')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                      broadcastTab === 'sms'
                        ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-xs font-bold'
                        : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                    }`}
                  >
                    <Send className="h-3.5 w-3.5 text-purple-500" />
                    <span>Short SMS</span>
                  </button>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <span className="font-mono">{getBroadcastMessage(broadcastTab).length} characters</span>
                </div>
              </div>

              {/* Live Formatted Message Bubble Preview */}
              <div className="relative rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40 p-3.5 sm:p-4 transition-all">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400 pb-2 mb-2.5 border-b border-slate-200/60 dark:border-slate-800">
                  <span className="flex items-center gap-1.5">
                    {broadcastTab === 'whatsapp' ? (
                      <>
                        <MessageCircle className="h-3.5 w-3.5 text-emerald-500" />
                        <span>WhatsApp Chat Bubble Preview</span>
                      </>
                    ) : broadcastTab === 'linkedin' ? (
                      <>
                        <Share2 className="h-3.5 w-3.5 text-[#0077b5]" />
                        <span>LinkedIn Post Preview</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-3.5 w-3.5 text-purple-500" />
                        <span>SMS / Telegram Alert Preview</span>
                      </>
                    )}
                  </span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full font-medium border border-emerald-200/60">
                    Live Formatted
                  </span>
                </div>

                {/* Formatted Text Box with Custom Slim Scrollbar */}
                <div className="rounded-xl p-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 font-sans leading-relaxed max-h-52 overflow-y-auto select-all shadow-2xs space-y-0.5 [scrollbar-width:thin]">
                  {renderFormattedMessage(getBroadcastMessage(broadcastTab))}

                  {broadcastTab === 'whatsapp' && (
                    <div className="flex items-center justify-end gap-1 text-[10px] text-slate-400 pt-2 select-none font-mono">
                      <span>Just now</span>
                      <CheckCheck className="h-3.5 w-3.5 text-sky-500" />
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    onClick={copyBroadcastMessage}
                    className="h-9 px-4 rounded-xl text-xs font-semibold bg-[#0F766E] hover:bg-[#8e44eb] text-white shadow-sm transition-all"
                  >
                    {copiedBroadcast ? (
                      <>
                        <CheckCheck className="h-4 w-4 mr-1.5 stroke-[2.5]" />
                        <span>Copied to Clipboard!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-1.5" />
                        <span>Copy Broadcast Message</span>
                      </>
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={shareBroadcastWhatsApp}
                    className="h-9 px-3.5 rounded-xl text-xs font-semibold border-emerald-200 bg-emerald-50/50 text-emerald-700 hover:bg-emerald-100/70 hover:border-emerald-300 dark:bg-emerald-950/20 dark:border-emerald-800/60 dark:text-emerald-400 transition-colors"
                  >
                    <MessageCircle className="h-3.5 w-3.5 mr-1.5 text-emerald-600" />
                    <span>Send via WhatsApp</span>
                  </Button>
                </div>

                <span className="text-[11px] text-slate-400 font-medium">
                  ⚡ Pre-filled for <strong className="text-slate-700 dark:text-slate-200 capitalize">{schoolName}</strong>
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: QR Code & Walk-in Tracker Modules (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="shadow-md border-slate-200/80 dark:border-slate-800 overflow-hidden flex flex-col transition-all">
            <CardHeader className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800/60 bg-gradient-to-r from-slate-50/80 via-white to-slate-50/50 dark:from-slate-900/60 dark:to-slate-900/20">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-gradient-to-tr from-[#0F766E]/15 to-[#7928CA]/20 text-[#0F766E] rounded-xl ring-1 ring-[#0F766E]/30 shadow-2xs">
                    <QrCode className="h-5 w-5 stroke-[2.2]" />
                  </div>
                  <div>
                    <CardTitle className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
                      Instant Scan QR Code
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      Reception Standee & Print Flyers
                    </CardDescription>
                  </div>
                </div>

                {/* View Switcher: Standee vs Minimal */}
                <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 text-[11px] font-semibold shrink-0">
                  <button
                    type="button"
                    onClick={() => setQrViewMode('standee')}
                    className={`px-2.5 py-1 rounded-lg transition-all ${
                      qrViewMode === 'standee'
                        ? 'bg-white dark:bg-slate-900 text-[#0F766E] shadow-xs font-bold'
                        : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                    }`}
                  >
                    Standee
                  </button>
                  <button
                    type="button"
                    onClick={() => setQrViewMode('minimal')}
                    className={`px-2.5 py-1 rounded-lg transition-all ${
                      qrViewMode === 'minimal'
                        ? 'bg-white dark:bg-slate-900 text-[#0F766E] shadow-xs font-bold'
                        : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                    }`}
                  >
                    Clean QR
                  </button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-4 sm:p-6 flex flex-col items-center justify-center space-y-5">
              
              {/* QR Container or Loader */}
              {isQrLoading || !qrData ? (
                <div className="flex flex-col items-center justify-center p-10 space-y-3">
                  <div className="h-52 w-52 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-dashed border-slate-300 dark:border-slate-800 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 text-[#0F766E] animate-spin" />
                  </div>
                  <span className="text-xs font-bold text-slate-400 dark:text-slate-500 tracking-wider animate-pulse">
                    Rendering High-Res Matrix...
                  </span>
                </div>
              ) : qrData.qrDataUrl ? (
                qrViewMode === 'standee' ? (
                  /* ─── STANDEE PREVIEW (Light Theme Acrylic Tabletop Mockup) ─── */
                  <div className="w-full flex flex-col items-center">
                    <div className="relative w-full max-w-[320px] rounded-3xl p-5 bg-gradient-to-b from-white via-purple-50/40 to-slate-50 text-slate-800 shadow-xl border-2 border-purple-200/90 overflow-hidden transition-all duration-300 hover:scale-[1.01]">
                      {/* Top Accent Gradient Line */}
                      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#0F766E] via-[#c084fc] to-[#7928CA]" />
                      
                      {/* Ambient Glow */}
                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-44 h-24 bg-[#0F766E]/15 blur-2xl rounded-full pointer-events-none" />

                      {/* Standee Header */}
                      <div className="relative z-10 flex flex-col items-center text-center mb-3.5 space-y-1.5">
                        <div className="h-12 w-12 rounded-2xl bg-white border-2 border-purple-200 p-1 flex items-center justify-center shadow-md overflow-hidden">
                          {logoUrl ? (
                            <img src={logoUrl} alt={schoolName} className="h-full w-full object-contain" />
                          ) : (
                            <Building2 className="h-6 w-6 text-[#0F766E]" />
                          )}
                        </div>
                        <h4 className="text-base font-extrabold tracking-tight text-slate-900 line-clamp-1 capitalize">
                          {schoolName}
                        </h4>
                        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-purple-100 border border-purple-200/80 text-[10px] font-bold text-purple-700 tracking-wide uppercase">
                          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                          Walk-In Careers Portal
                        </div>
                      </div>

                      {/* White QR Box with Branded Corner Markers */}
                      <div className="relative z-10 bg-white rounded-2xl p-3.5 shadow-md border-2 border-purple-100 flex flex-col items-center">
                        <div className="relative">
                          {/* Corner Markers */}
                          <div className="absolute -top-1 -left-1 h-4 w-4 border-t-2 border-l-2 border-[#0F766E] rounded-tl-md" />
                          <div className="absolute -top-1 -right-1 h-4 w-4 border-t-2 border-r-2 border-[#0F766E] rounded-tr-md" />
                          <div className="absolute -bottom-1 -left-1 h-4 w-4 border-b-2 border-l-2 border-[#0F766E] rounded-bl-md" />
                          <div className="absolute -bottom-1 -right-1 h-4 w-4 border-b-2 border-r-2 border-[#0F766E] rounded-br-md" />

                          <img 
                            src={qrData.qrDataUrl} 
                            alt="Application QR Code" 
                            className="h-44 w-44 object-contain" 
                          />

                          {/* Center Branded Badge */}
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-white border-2 border-[#0F766E] shadow-md flex items-center justify-center p-0.5 overflow-hidden">
                            {logoUrl ? (
                              <img src={logoUrl} alt="Logo" className="h-full w-full object-contain" />
                            ) : (
                              <School className="h-4 w-4 text-[#0F766E]" />
                            )}
                          </div>
                        </div>

                        {/* Camera Scan Prompt */}
                        <div className="mt-2.5 flex items-center gap-1.5 text-xs font-bold text-slate-700">
                          <Smartphone className="h-4 w-4 text-[#0F766E]" />
                          <span>Scan with Camera to Apply</span>
                        </div>
                      </div>

                      {/* Standee Footer Note */}
                      <p className="relative z-10 text-center text-[10px] text-slate-500 mt-3 font-semibold">
                        Direct school submission • No credit deduction
                      </p>
                    </div>

                    {/* Acrylic Base Shadow */}
                    <div className="w-56 h-3 bg-purple-200/60 dark:bg-slate-800/80 blur-sm rounded-full -mt-1" />
                  </div>
                ) : (
                  /* ─── CLEAN QR CODE VIEW ─── */
                  <div className="relative group p-5 rounded-2xl bg-white dark:bg-slate-950 border-2 border-slate-200/90 dark:border-slate-800 shadow-md transition-all duration-300 hover:shadow-xl">
                    {/* Modern Corner Focus Target Markers */}
                    <div className="absolute -top-1.5 -left-1.5 h-6 w-6 border-t-3 border-l-3 border-[#0F766E] rounded-tl-lg" />
                    <div className="absolute -top-1.5 -right-1.5 h-6 w-6 border-t-3 border-r-3 border-[#0F766E] rounded-tr-lg" />
                    <div className="absolute -bottom-1.5 -left-1.5 h-6 w-6 border-b-3 border-l-3 border-[#0F766E] rounded-bl-lg" />
                    <div className="absolute -bottom-1.5 -right-1.5 h-6 w-6 border-b-3 border-r-3 border-[#0F766E] rounded-br-lg" />
                    
                    <div className="relative">
                      <img 
                        src={qrData.qrDataUrl} 
                        alt="Application QR Code" 
                        className="h-48 w-48 object-contain transition-transform duration-300 group-hover:scale-[1.02]" 
                      />

                      {/* Center Branded Badge */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white border-2 border-[#0F766E] shadow-md flex items-center justify-center p-1 overflow-hidden">
                        {logoUrl ? (
                          <img src={logoUrl} alt="Logo" className="h-full w-full object-contain" />
                        ) : (
                          <School className="h-4 w-4 text-[#0F766E]" />
                        )}
                      </div>
                    </div>

                    <div className="mt-2 text-center text-[10px] font-mono font-semibold text-slate-400 tracking-wider">
                      300 DPI HIGH-RESOLUTION
                    </div>
                  </div>
                )
              ) : (
                <div className="text-center p-6 text-slate-400 flex flex-col items-center gap-2">
                  <AlertCircle className="h-6 w-6 text-[#FE9496]" />
                  <p className="text-sm font-medium">Failed to generate QR representation</p>
                </div>
              )}

              {/* QR Code Action Buttons Grid */}
              <div className="w-full space-y-2 pt-1">
                {/* Primary Row: Download PNG & Print Poster */}
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    type="button"
                    onClick={downloadQRCode}
                    disabled={!qrData?.qrDataUrl}
                    className="h-10 px-3 rounded-xl bg-[#0F766E] hover:bg-[#0D9488] text-white text-xs font-bold shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <Download className="h-4 w-4 shrink-0" />
                    <span>Download PNG</span>
                  </Button>

                  <Button 
                    type="button"
                    variant="outline"
                    onClick={printQRPoster}
                    disabled={!qrData?.qrDataUrl}
                    className="h-10 px-3 rounded-xl border-slate-200 dark:border-slate-700 hover:border-[#0F766E]/40 hover:bg-[#0F766E]/5 hover:text-[#0F766E] text-slate-700 dark:text-slate-300 text-xs font-bold shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <Printer className="h-4 w-4 shrink-0 text-[#14B8A6]" />
                    <span>Print Standee</span>
                  </Button>
                </div>

                {/* Secondary Row: Copy Image & WhatsApp Share */}
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={copyQRImage}
                    disabled={!qrData?.qrDataUrl}
                    className="h-9 px-3 rounded-xl border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold"
                  >
                    {copiedImage ? (
                      <>
                        <Check className="h-3.5 w-3.5 mr-1.5 text-emerald-500 stroke-[2.5]" />
                        <span className="text-emerald-600">Copied Image!</span>
                      </>
                    ) : (
                      <>
                        <ImageIcon className="h-3.5 w-3.5 mr-1.5 text-slate-400" />
                        <span>Copy Image</span>
                      </>
                    )}
                  </Button>

                  <Button 
                    type="button"
                    variant="outline"
                    onClick={shareWhatsApp}
                    className="h-9 px-3 rounded-xl border-emerald-200/80 bg-emerald-50/40 text-emerald-700 hover:bg-emerald-100/60 dark:bg-emerald-950/20 dark:border-emerald-800/60 dark:text-emerald-400 text-xs font-semibold"
                  >
                    <MessageCircle className="h-3.5 w-3.5 mr-1.5 text-emerald-600" />
                    <span>WhatsApp</span>
                  </Button>
                </div>
              </div>

              {/* Target URL Substring Badge with Copy Feedback */}
              {applyUrl && (
                <button
                  type="button"
                  onClick={() => copyToClipboard(applyUrl, 'qr')}
                  className="group flex items-center justify-between gap-2 text-left text-[11px] font-mono font-medium max-w-full border border-slate-200/90 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 px-3 py-2 rounded-xl w-full transition-colors"
                  title="Click to copy link"
                >
                  <span className="truncate flex-1">{applyUrl}</span>
                  <span className="shrink-0 text-slate-400 group-hover:text-[#0F766E] transition-colors flex items-center gap-1">
                    {copiedQrUrl ? (
                      <span className="text-emerald-600 font-sans font-bold text-[10px]">Copied!</span>
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </span>
                </button>
              )}
            </CardContent>
          </Card>

          {/* Card 2: Walk-In Candidate Performance & Direct Portal Tracker */}
          <Card className="shadow-md border-slate-200/80 dark:border-slate-800 overflow-hidden">
            <CardHeader className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800/60 bg-gradient-to-r from-slate-50/80 via-white to-slate-50/50 dark:from-slate-900/60 dark:to-slate-900/20">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-gradient-to-tr from-[#0F766E]/15 to-[#7928CA]/20 text-[#0F766E] rounded-xl ring-1 ring-[#0F766E]/30 shadow-2xs shrink-0">
                    <TrendingUp className="h-5 w-5 stroke-[2.2]" />
                  </div>
                  <div>
                    <CardTitle className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
                      Direct Walk-In Performance
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      Real-time applicant reception from your QR Standee & portal link
                    </CardDescription>
                  </div>
                </div>

                <span className="text-xs font-bold text-emerald-700 bg-emerald-100/90 dark:bg-emerald-950/40 dark:text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/60 shadow-2xs whitespace-nowrap shrink-0">
                  0 Credits Deducted
                </span>
              </div>
            </CardHeader>

            <CardContent className="p-4 sm:p-5 space-y-4">
              {/* 3 Metric Stats Tiles */}
              <div className="grid grid-cols-3 gap-2.5">
                
                <div className="p-3 rounded-xl border border-purple-100 dark:border-slate-800 bg-gradient-to-b from-purple-50/60 to-white dark:from-slate-900 dark:to-slate-900/50 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                    <span className="text-[10px] font-bold uppercase tracking-wider">Walk-Ins</span>
                    <Users className="h-3.5 w-3.5 text-[#0F766E]" />
                  </div>
                  <div className="mt-1.5">
                    <div className="text-xl font-black text-slate-900 dark:text-white">
                      {walkinCount}
                    </div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                      Applicants
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-emerald-100 dark:border-slate-800 bg-gradient-to-b from-emerald-50/60 to-white dark:from-slate-900 dark:to-slate-900/50 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                    <span className="text-[10px] font-bold uppercase tracking-wider">Cost</span>
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  </div>
                  <div className="mt-1.5">
                    <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                      100% Free
                    </div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                      Full Profiles
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-sky-100 dark:border-slate-800 bg-gradient-to-b from-sky-50/60 to-white dark:from-slate-900 dark:to-slate-900/50 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                    <span className="text-[10px] font-bold uppercase tracking-wider">Speed</span>
                    <Clock className="h-3.5 w-3.5 text-sky-600" />
                  </div>
                  <div className="mt-1.5">
                    <div className="text-xl font-black text-sky-600 dark:text-sky-400">
                      ~2 Mins
                    </div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                      Mobile Flow
                    </span>
                  </div>
                </div>

              </div>

              {/* 4-Step Walk-In Workflow Checklist */}
              <div className="w-full bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 rounded-xl p-3.5 space-y-2 text-left">
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200 block mb-1">
                  Reception Standee Workflow:
                </span>

                <div className="space-y-1.5 text-[11px] text-slate-600 dark:text-slate-300">
                  <div className="flex items-start gap-2">
                    <div className="w-4 h-4 rounded-full bg-[#0F766E] text-white font-bold text-[9px] flex items-center justify-center shrink-0 mt-0.5">
                      1
                    </div>
                    <div>
                      <strong>Print ya Download karein:</strong> Upar &ldquo;Print Standee&rdquo; button se A4 sheet print karein.
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <div className="w-4 h-4 rounded-full bg-[#0F766E] text-white font-bold text-[9px] flex items-center justify-center shrink-0 mt-0.5">
                      2
                    </div>
                    <div>
                      <strong>Reception Desk par lagayein:</strong> Frame me desk ya gate par lagayein.
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <div className="w-4 h-4 rounded-full bg-[#0F766E] text-white font-bold text-[9px] flex items-center justify-center shrink-0 mt-0.5">
                      3
                    </div>
                    <div>
                      <strong>Candidate Phone se Scan karega:</strong> Google Lens ya camera se 2 minute me form bharega.
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <div className="w-4 h-4 rounded-full bg-emerald-600 text-white font-bold text-[9px] flex items-center justify-center shrink-0 mt-0.5">
                      4
                    </div>
                    <div>
                      <strong>Instant Free Save:</strong> Form submit hote hi candidate bina credit kate save ho jayega.
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Quick Links Action Bar */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/60 flex flex-wrap items-center justify-between gap-3">
                <Button
                  type="button"
                  variant="default"
                  asChild
                  className="h-9 px-4 rounded-xl text-xs font-semibold bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 shadow-sm"
                >
                  <Link to="/candidates">
                    <Users className="h-3.5 w-3.5 mr-1.5" />
                    <span>View Walk-in Candidates</span>
                    <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                  </Link>
                </Button>

                {applyUrl && (
                  <Button
                    type="button"
                    variant="ghost"
                    asChild
                    className="h-9 px-3 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-[#0F766E]"
                  >
                    <a href={applyUrl} target="_blank" rel="noreferrer">
                      <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                      <span>Test Candidate View Live</span>
                    </a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

      </div>

      {/* Recommended Best Practices Guide Section */}
      <div className="pt-2">
        <div className="mb-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#0F766E]" />
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