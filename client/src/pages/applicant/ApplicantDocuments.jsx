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
    <div>
      <PageHeader
        title="Documents"
        description="Your uploaded resume and certificates"
        action={
          <Button asChild variant="outline">
            <Link to="/applicant/profile">Upload Documents</Link>
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Uploaded Documents ({documents.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {documents.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No documents uploaded yet.{' '}
              <Link to="/applicant/profile" className="underline">
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
                  className="flex items-center gap-3 rounded-md border p-4 transition-colors hover:bg-muted/50"
                >
                  <FileText className="h-8 w-8 text-primary" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{doc.name}</p>
                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
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
