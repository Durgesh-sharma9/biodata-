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

  const updateMutation = useMutation({
    mutationFn: updateApplicantProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applicant-profile'] });
      alert('Profile updated successfully');
    },
  });

  if (isLoading) return <div className="flex h-64 items-center justify-center">Loading...</div>;

  return (
    <div>
      <PageHeader title="My Profile" description="Complete your profile to join the talent pool" />

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
