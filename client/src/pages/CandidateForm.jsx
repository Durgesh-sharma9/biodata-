import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getCandidate,
  createCandidate,
  updateCandidate,
  checkDuplicate,
  getSettings,
} from '@/lib/api';
import { DynamicCandidateForm } from '@/components/forms/DynamicCandidateForm';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function CandidateForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [duplicate, setDuplicate] = useState(null);

  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: () => getSettings().then((r) => r.data.data),
  });

  const { data: candidate, isLoading } = useQuery({
    queryKey: ['candidate', id],
    queryFn: () => getCandidate(id).then((r) => r.data.data),
    enabled: isEdit,
  });

  const saveMutation = useMutation({
    mutationFn: (data) => (isEdit ? updateCandidate(id, data) : createCandidate(data)),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['candidates'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      navigate(`/candidates/${res.data.data._id}`);
    },
    onError: (err) => {
      if (err.response?.status === 409 && err.response?.data?.duplicate) {
        setDuplicate(err.response.data.data);
      }
    },
  });

  const handleForceCreate = (data) => {
    saveMutation.mutate({
      ...data,
      forceCreate: true,
    });
    setDuplicate(null);
  };

  const onSubmit = (data) => {
    saveMutation.mutate(data);
  };

  if (isEdit && isLoading) {
    return <div className="flex h-64 items-center justify-center">Loading...</div>;
  }

  return (
    <div>
      <PageHeader
        title={isEdit ? 'Edit Candidate' : 'Add Candidate'}
        description={isEdit ? 'Update candidate information' : 'Add a new candidate to your database'}
      />

      <DynamicCandidateForm
        initialValues={candidate}
        onSubmit={onSubmit}
        settings={settings}
        isLoading={saveMutation.isPending}
        submitButtonText={isEdit ? 'Update Candidate' : 'Add Candidate'}
        showMobileCheck={!isEdit}
        disabledFields={isEdit ? ['mobile'] : []}
      />

      <Dialog open={!!duplicate} onOpenChange={() => setDuplicate(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Duplicate Mobile Number</DialogTitle>
            <DialogDescription>
              A candidate with mobile {duplicate?.mobile} already exists: <strong>{duplicate?.fullName}</strong>
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button variant="outline" onClick={() => navigate(`/candidates/${duplicate?._id}`)}>
              View Existing
            </Button>
            <Button variant="outline" onClick={() => navigate(`/candidates/${duplicate?._id}/edit`)}>
              Update Existing
            </Button>
            {!isEdit && (
              <Button onClick={() => handleForceCreate(duplicate)}>Create New Anyway</Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
