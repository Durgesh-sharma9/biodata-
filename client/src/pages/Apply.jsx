import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getSchoolBySlug, submitApplication, uploadPublicFiles, getSettings, getPositions } from '@/lib/api';
import { DynamicCandidateForm } from '@/components/forms/DynamicCandidateForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Apply() {
  const { slug } = useParams();
  const [submitted, setSubmitted] = useState(false);

  const { data: school, isLoading, error } = useQuery({
    queryKey: ['apply-school', slug],
    queryFn: () => getSchoolBySlug(slug).then((r) => r.data.data),
  });

  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: () => getSettings().then((r) => r.data.data),
  });

  const { data: positions } = useQuery({
    queryKey: ['positions'],
    queryFn: () => getPositions().then((r) => r.data.data),
  });

  const submitMutation = useMutation({
    mutationFn: (data) => submitApplication(slug, data),
    onSuccess: () => setSubmitted(true),
  });

  if (isLoading) return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  if (error || !school) return <div className="flex min-h-screen items-center justify-center">Application link not found</div>;

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30 p-6">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <h2 className="text-xl font-bold text-primary">Application Submitted!</h2>
            <p className="mt-2 text-muted-foreground">Thank you for applying to {school.schoolName}.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 p-6">
      <div className="mx-auto max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Apply to {school.schoolName}</CardTitle>
            <p className="text-sm text-muted-foreground">
              Complete the form below. Your application will be added to this school's candidate database.
            </p>
          </CardHeader>
          <CardContent>
            {settings && positions && (
              <DynamicCandidateForm
                onSubmit={(data) => submitMutation.mutate(data)}
                settings={settings}
                positions={positions}
                isLoading={submitMutation.isPending}
                submitButtonText="Submit Application"
                showConsent
                uploadFilesFn={uploadPublicFiles}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
