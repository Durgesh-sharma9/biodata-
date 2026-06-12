import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { Pencil, FileText, ExternalLink, Lock, Send } from 'lucide-react';
import {
  getCandidate,
  unlockCandidate,
  sendInterestRequest,
  getInterestRequestStatus,
} from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
  const queryClient = useQueryClient();
  const { refreshSchool, school } = useAuth();
  const [interestForm, setInterestForm] = useState({ positionOffered: '', message: '' });
  const [showInterestForm, setShowInterestForm] = useState(false);

  const { data: candidate, isLoading } = useQuery({
    queryKey: ['candidate', id],
    queryFn: () => getCandidate(id).then((r) => r.data.data),
  });

  const { data: interestStatus } = useQuery({
    queryKey: ['interest-status', id],
    queryFn: () => getInterestRequestStatus(id).then((r) => r.data.data),
    enabled: !!candidate?.canSendInterest,
  });

  const unlockMutation = useMutation({
    mutationFn: () => unlockCandidate(id),
    onSuccess: async (res) => {
      queryClient.setQueryData(['candidate', id], res.data.data);
      await refreshSchool();
    },
    onError: (err) => {
      alert(err.response?.data?.message || 'Failed to unlock profile');
    },
  });

  const interestMutation = useMutation({
    mutationFn: () =>
      sendInterestRequest({
        candidateId: id,
        positionOffered: interestForm.positionOffered,
        message: interestForm.message,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interest-status', id] });
      setShowInterestForm(false);
      alert('Interest request sent successfully');
    },
    onError: (err) => {
      alert(err.response?.data?.message || 'Failed to send interest request');
    },
  });

  if (isLoading) {
    return <div className="flex h-64 items-center justify-center">Loading...</div>;
  }

  if (!candidate) {
    return <div className="text-center text-muted-foreground">Candidate not found</div>;
  }

  const isLocked = candidate.isLocked;
  const isContactHidden = candidate.isContactHidden;
  const canViewProfileDetails = !isLocked;
  const hasSentInterest = !!interestStatus;

  const handleInterestSubmit = (e) => {
    e.preventDefault();
    interestMutation.mutate();
  };

  return (
    <div>
      <PageHeader
        title={candidate.fullName}
        description={`${candidate.position}${candidate.source ? ` • ${candidate.source}` : ''} • Added ${formatDate(candidate.createdAt)}`}
        action={
          <div className="flex gap-2">
            {isLocked && (
              <Button onClick={() => unlockMutation.mutate()} disabled={unlockMutation.isPending}>
                <Lock className="mr-2 h-4 w-4" />
                Unlock Profile (1 Credit)
              </Button>
            )}
            {candidate.canEdit && (
              <Button asChild>
                <Link to={`/candidates/${id}/edit`}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit Candidate
                </Link>
              </Button>
            )}
          </div>
        }
      />

      {isLocked && (
        <div className="mb-6 rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          Preview mode — unlock to view qualifications, experience, salary, location, and documents.
          Contact details remain hidden for talent pool candidates.
        </div>
      )}

      {canViewProfileDetails && isContactHidden && (
        <div className="mb-6 rounded-md border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
          Profile unlocked — you can view professional details and documents. Contact information is hidden until the candidate responds via interest request.
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Basic Details</CardTitle>
          </CardHeader>
          <CardContent>
            <dl>
              <DetailRow label="Full Name" value={candidate.fullName} />
              {!isContactHidden && <DetailRow label="Mobile" value={candidate.mobile} />}
              {!isContactHidden && <DetailRow label="Email" value={candidate.email} />}
              {!isContactHidden && <DetailRow label="Address" value={candidate.address} />}
              <DetailRow label="State" value={candidate.state} />
              <DetailRow label="City" value={candidate.city} />
              <DetailRow label="Locality" value={candidate.locality} />
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
              {candidate.source && <DetailRow label="Source" value={candidate.source} />}
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
                    canViewProfileDetails ? '-' : 'Unlock to view'
                  )
                }
              />
              <DetailRow
                label="Experience"
                value={canViewProfileDetails ? `${candidate.experienceYears} years` : 'Unlock to view'}
              />
              {canViewProfileDetails && candidate.expectedSalary != null && (
                <DetailRow label="Expected Salary" value={`₹${candidate.expectedSalary.toLocaleString()}`} />
              )}
            </dl>
          </CardContent>
        </Card>

        {canViewProfileDetails && !isContactHidden && candidate.notes && (
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-sm">{candidate.notes}</p>
            </CardContent>
          </Card>
        )}

        {canViewProfileDetails && (
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
        )}

        {candidate.canSendInterest && (
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Send Interest Request</CardTitle>
            </CardHeader>
            <CardContent>
              {hasSentInterest ? (
                <div className="rounded-md border border-green-200 bg-green-50 p-4 text-sm text-green-800">
                  Interest request sent on {formatDate(interestStatus.createdAt)} for{' '}
                  {interestStatus.positionOffered}. The applicant will be notified.
                </div>
              ) : showInterestForm ? (
                <form onSubmit={handleInterestSubmit} className="space-y-4 max-w-lg">
                  <div>
                    <Label>School Name</Label>
                    <Input value={school?.schoolName || ''} disabled />
                  </div>
                  <div>
                    <Label>Position Offered</Label>
                    <Input
                      value={interestForm.positionOffered}
                      onChange={(e) => setInterestForm({ ...interestForm, positionOffered: e.target.value })}
                      placeholder="e.g. Mathematics Teacher"
                      required
                    />
                  </div>
                  <div>
                    <Label>Message</Label>
                    <Textarea
                      value={interestForm.message}
                      onChange={(e) => setInterestForm({ ...interestForm, message: e.target.value })}
                      placeholder="Introduce your school and the opportunity..."
                      rows={4}
                      required
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" disabled={interestMutation.isPending}>
                      <Send className="mr-2 h-4 w-4" />
                      {interestMutation.isPending ? 'Sending...' : 'Send Request'}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setShowInterestForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <div>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Send an interest request to notify this candidate about your school and position.
                  </p>
                  <Button onClick={() => setShowInterestForm(true)}>
                    <Send className="mr-2 h-4 w-4" />
                    Send Interest Request
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
