import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { FileText, ExternalLink } from 'lucide-react';
import { getApplicantProfile } from '@/lib/api';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ApplicantDocuments() {
  const { data: profile, isLoading } = useQuery({
    queryKey: ['applicant-profile'],
    queryFn: () => getApplicantProfile().then((r) => r.data.data),
  });

  if (isLoading) {
    return <div className="flex h-64 items-center justify-center">Loading...</div>;
  }

  const documents = profile?.documents || [];

  return (
    <div className="space-y-6 p-6 max-w-[1400px] mx-auto w-full bg-slate-50/50 dark:bg-slate-950 min-h-screen animate-in fade-in duration-500">
      <PageHeader
        title="Documents"
        description="Your uploaded resume and certificates"
        action={
          <Button asChild variant="outline" className="rounded-lg border-slate-200 hover:bg-slate-50 hover:text-purple-600">
            <Link to="/applicant/profile">Upload Documents</Link>
          </Button>
        }
      />

      <Card className="border border-slate-200/60 bg-white shadow-2xs dark:bg-slate-900">
        <CardHeader>
          <CardTitle className="text-sm font-bold text-slate-800 dark:text-slate-200">Uploaded Documents ({documents.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {documents.length === 0 ? (
            <p className="text-sm text-slate-400 dark:text-slate-500">
              No documents uploaded yet.{' '}
              <Link to="/applicant/profile" className="underline text-purple-600 font-semibold">
                Add documents in your profile
              </Link>
            </p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {documents.map((doc, i) => (
                <a
                  key={i}
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-lg border border-slate-200/60 p-4 transition-all hover:bg-slate-50 hover:border-purple-200/60 dark:hover:bg-slate-800/30"
                >
                  <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-slate-800 dark:text-slate-200">{doc.name}</p>
                    <p className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
                      View <ExternalLink className="h-3 w-3" />
                    </p>
                  </div>
                </a>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
