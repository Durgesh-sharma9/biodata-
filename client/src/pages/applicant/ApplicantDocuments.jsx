import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  FileText,
  ExternalLink,
  Loader2,
  Upload,
  FileCheck,
  ShieldCheck,
  Sparkles,
  Info,
  CheckCircle2,
  FileSpreadsheet,
  File,
} from 'lucide-react';
import { getApplicantProfile } from '@/lib/api';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function ApplicantDocuments() {
  const { data: profile, isLoading } = useQuery({
    queryKey: ['applicant-profile'],
    queryFn: () => getApplicantProfile().then((r) => r.data.data),
  });

  if (isLoading) {
    return (
      <div className="flex h-72 flex-col items-center justify-center space-y-3 antialiased">
        <div className="h-8 w-8 rounded-full border-3 border-blue-600 border-t-transparent animate-spin" />
        <p className="text-xs font-semibold text-slate-400">Loading your candidate documents...</p>
      </div>
    );
  }

  const documents = profile?.documents || [];
  const maxDocs = 5;

  const getDocBadgeColor = (type) => {
    const t = (type || '').toLowerCase();
    if (t.includes('resume') || t.includes('cv')) return 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800';
    if (t.includes('degree') || t.includes('cert')) return 'bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800';
    return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
  };

  return (
    <div className="space-y-6 w-full antialiased text-slate-800 dark:text-white max-w-6xl mx-auto pb-10">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Documents & Credentials"
          description="Manage your professional resumes, academic degrees, and verification certificates"
        />

        <Button
          asChild
          className="h-10 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 shrink-0 self-start sm:self-auto flex items-center gap-1.5"
        >
          <Link to="/applicant/profile?edit=true">
            <Upload className="h-3.5 w-3.5" />
            <span>Upload New Document</span>
          </Link>
        </Button>
      </div>

      {/* Storage & Status Summary Card */}
      <div className="p-5 rounded-2xl border border-slate-200/80 bg-white dark:bg-slate-900 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="h-11 w-11 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400 flex items-center justify-center shrink-0">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Document Portfolio Capacity
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {documents.length} of {maxDocs} documents uploaded ({maxDocs - documents.length} slots remaining)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-36 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all"
              style={{ width: `${(documents.length / maxDocs) * 100}%` }}
            />
          </div>
          <Badge variant="outline" className="border-slate-200 text-xs font-bold text-slate-700 dark:text-slate-300">
            {documents.length} / {maxDocs}
          </Badge>
        </div>
      </div>

      {/* Main Documents Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Uploaded Files & Attachments
          </h2>
          <span className="text-xs text-slate-400">
            Visible to verified schools when viewing your profile
          </span>
        </div>

        {documents.length === 0 ? (
          <Card className="border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-center rounded-2xl">
            <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400 flex items-center justify-center mx-auto mb-3">
              <Upload className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              No Documents Uploaded Yet
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1 leading-relaxed">
              Attaching your Resume, Degree Certificates, and experience letters helps school principals review and approve your application much faster.
            </p>
            <Button
              asChild
              className="mt-4 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Link to="/applicant/profile?edit=true">Upload Your Resume Now</Link>
            </Button>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {documents.map((doc, idx) => (
              <Card
                key={idx}
                className="border border-slate-200/80 bg-white dark:bg-slate-900 dark:border-slate-800 shadow-xs hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all rounded-2xl overflow-hidden p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-blue-600 shrink-0">
                      <FileCheck className="h-6 w-6" />
                    </div>
                    <Badge className={`${getDocBadgeColor(doc.type)} text-[10px] font-bold uppercase tracking-wider`}>
                      {doc.type || 'DOCUMENT'}
                    </Badge>
                  </div>

                  <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate" title={doc.name}>
                    {doc.name || `Document ${idx + 1}`}
                  </h4>

                  {doc.note ? (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 italic">
                      "{doc.note}"
                    </p>
                  ) : (
                    <p className="text-[11px] text-slate-400 mt-1">
                      Verified Portfolio Attachment
                    </p>
                  )}
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">
                    PDF / File
                  </span>

                  {doc.url && (
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-600 text-slate-700 hover:text-white dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-blue-600 text-xs font-bold transition-colors"
                    >
                      <span>Preview</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Recommended Document Types Guide */}
      <Card className="border border-slate-200/80 bg-slate-50/60 dark:bg-slate-900/60 dark:border-slate-800 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 shrink-0 mt-0.5">
            <Info className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Recommended Documents For Job Applications
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
              <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">1. Updated Resume (CV)</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Recent teaching or work experience in PDF format.</p>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">2. Highest Degree / B.Ed</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Degree certificate or marksheets for academic positions.</p>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">3. Driving License / IDs</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Required for Driver, Transport, and Security roles.</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

    </div>
  );
}
