import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getApplicantProfile, updateApplicantProfile, getSettings, getPositions } from '@/lib/api';
import { DynamicCandidateForm } from '@/components/forms/DynamicCandidateForm';
import { PageHeader } from '@/components/common/PageHeader';

export default function ApplicantProfile() {
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['applicant-profile'],
    queryFn: () => getApplicantProfile().then((r) => r.data.data),
  });

  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: () => getSettings().then((r) => r.data.data),
  });

  const { data: positions } = useQuery({
    queryKey: ['positions'],
    queryFn: () => getPositions().then((r) => r.data.data),
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const updateMutation = useMutation({
    mutationFn: updateApplicantProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applicant-profile'] });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    },
  });

  if (isLoading) return <div className="flex h-64 items-center justify-center font-bold text-slate-500">Loading your profile...</div>;

  return (
    <div className="space-y-6 w-full antialiased text-slate-800 dark:text-white">
      <PageHeader title="My Profile" description="Complete your profile to join the talent pool" />

      {savedSuccess && (
        <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 text-xs font-bold flex items-center justify-between dark:bg-emerald-950/30 dark:border-emerald-800 dark:text-emerald-300">
          <span>Your candidate profile has been updated successfully!</span>
          <button onClick={() => setSavedSuccess(false)} className="opacity-70 hover:opacity-100">✕</button>
        </div>
      )}

      <DynamicCandidateForm
        initialValues={profile}
        onSubmit={(data) => updateMutation.mutate(data)}
        settings={settings}
        positions={positions}
        isLoading={updateMutation.isPending}
        submitButtonText="Update Profile"
        disabledFields={[]}
      />
    </div>
  );
}
