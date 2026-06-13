import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { submitPublicApplication, uploadPublicFiles, getSettings, getPositions } from '@/lib/api';
import { DynamicCandidateForm } from '@/components/forms/DynamicCandidateForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function SelfApply() {
  const [submitted, setSubmitted] = useState(false);

  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: () => getSettings().then((r) => r.data.data),
  });

  const { data: positions } = useQuery({
    queryKey: ['positions'],
    queryFn: () => getPositions().then((r) => r.data.data),
  });

  const submitMutation = useMutation({
    mutationFn: submitPublicApplication,
    onSuccess: () => setSubmitted(true),
  });

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30 p-6">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <h2 className="text-xl font-bold text-primary">Application Submitted!</h2>
            <p className="mt-2 text-muted-foreground">
              Thank you for joining the School Recruitment Network. Schools can now discover your profile in the talent pool.
            </p>
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
            <CardTitle>Join the School Recruitment Network</CardTitle>
            <p className="text-sm text-muted-foreground">
              Submit your profile to be discovered by schools across the network. No login required.
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
