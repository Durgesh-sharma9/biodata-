import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { Pencil, FileText, ExternalLink } from 'lucide-react';
import { getCandidate } from '@/lib/api';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';

function DetailRow({ label, value }) {
  return (
    <div className="grid grid-cols-3 gap-2 border-b py-3 last:border-0">
      <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
      <dd className="col-span-2 text-sm">{value || '-'}</dd>
    </div>
  );
}

export default function CandidateProfile() {
  const { id } = useParams();

  const { data: candidate, isLoading } = useQuery({
    queryKey: ['candidate', id],
    queryFn: () => getCandidate(id).then((r) => r.data.data),
  });

  if (isLoading) {
    return <div className="flex h-64 items-center justify-center">Loading...</div>;
  }

  if (!candidate) {
    return <div className="text-center text-muted-foreground">Candidate not found</div>;
  }

  return (
    <div>
      <PageHeader
        title={candidate.fullName}
        description={`${candidate.position} • Added ${formatDate(candidate.createdAt)}`}
        action={
          <Button asChild>
            <Link to={`/candidates/${id}/edit`}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit Candidate
            </Link>
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Basic Details</CardTitle>
          </CardHeader>
          <CardContent>
            <dl>
              <DetailRow label="Full Name" value={candidate.fullName} />
              <DetailRow label="Mobile" value={candidate.mobile} />
              <DetailRow label="Email" value={candidate.email} />
              <DetailRow label="Address" value={candidate.address} />
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Professional Details</CardTitle>
          </CardHeader>
          <CardContent>
            <dl>
              <DetailRow label="Position" value={candidate.position} />
              <DetailRow
                label="Qualifications"
                value={
                  candidate.qualifications?.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {candidate.qualifications.map((q) => (
                        <Badge key={q} variant="secondary">
                          {q}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    '-'
                  )
                }
              />
              {candidate.subjects?.length > 0 && (
                <DetailRow
                  label="Subjects"
                  value={
                    <div className="flex flex-wrap gap-1">
                      {candidate.subjects.map((s) => (
                        <Badge key={s} variant="secondary">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  }
                />
              )}
              {candidate.classesCanTeach?.length > 0 && (
                <DetailRow
                  label="Classes"
                  value={
                    <div className="flex flex-wrap gap-1">
                      {candidate.classesCanTeach.map((c) => (
                        <Badge key={c} variant="outline">
                          {c}
                        </Badge>
                      ))}
                    </div>
                  }
                />
              )}
              {candidate.vehicleTypes?.length > 0 && (
                <DetailRow
                  label="Vehicle Types"
                  value={candidate.vehicleTypes.join(', ')}
                />
              )}
              <DetailRow label="Experience" value={`${candidate.experienceYears} years`} />
            </dl>
          </CardContent>
        </Card>

        {candidate.notes && (
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-sm">{candidate.notes}</p>
            </CardContent>
          </Card>
        )}

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Documents ({candidate.documents?.length || 0})</CardTitle>
          </CardHeader>
          <CardContent>
            {candidate.documents?.length === 0 ? (
              <p className="text-sm text-muted-foreground">No documents uploaded</p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {candidate.documents.map((doc, i) => (
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
    </div>
  );
}
