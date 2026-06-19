import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ShieldAlert, Eye, FileEdit, UserPlus, Loader2 } from 'lucide-react';
import {
  getCandidate,
  createCandidate,
  updateCandidate,
  checkDuplicate,
  getSettings,
  getPositions,
} from '@/lib/api';
import { DynamicCandidateForm } from '@/components/forms/DynamicCandidateForm';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
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

  const { data: positions } = useQuery({
    queryKey: ['positions'],
    queryFn: () => getPositions().then((r) => r.data.data),
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

  // Modern Flat Shimmer Placeholder Loading State
  if (isEdit && isLoading) {
    return (
      <div className="space-y-6 p-5 animate-pulse max-w-4xl mx-auto">
        <div className="space-y-2">
          <div className="h-7 bg-slate-200 dark:bg-slate-800 rounded-xl w-1/3" />
          <div className="h-4 bg-slate-200/60 dark:bg-slate-800/60 rounded-xl w-1/2" />
        </div>
        <div className="space-y-6 pt-4">
          <div className="h-48 bg-slate-200/40 dark:bg-slate-800/40 rounded-xl w-full" />
          <div className="h-32 bg-slate-200/40 dark:bg-slate-800/40 rounded-xl w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto bg-slate-50/50 dark:bg-slate-950 text-slate-800 dark:text-white antialiased min-h-screen animate-in fade-in duration-500">
      
      {/* Page Header Minimalist Panel */}
      <div className="border-b border-slate-200/60 dark:border-slate-800 pb-5">
        <PageHeader
          title={isEdit ? 'Edit Candidate Profile' : 'Onboard New Candidate'}
          description={isEdit ? 'Modify background records, profile configurations, and dynamic meta indicators.' : 'Register and index a fresh talent entry profile directly into HireHub.'}
        />
      </div>

      {/* Main Container Flat Layer Constraint Padding */}
      <div className="rounded-xl border border-slate-200/60 bg-white p-5 shadow-2xs dark:bg-slate-900">
        <DynamicCandidateForm
          initialValues={candidate}
          onSubmit={onSubmit}
          settings={settings}
          positions={positions}
          isLoading={saveMutation.isPending}
          submitButtonText={isEdit ? 'Update Candidate' : 'Add Candidate'}
          disabledFields={[]}
        />
      </div>

      {/* Polish Premium Collision Detection / Conflict Resolution Modal */}
      <Dialog open={!!duplicate} onOpenChange={() => setDuplicate(null)}>
        <DialogContent className="max-w-md rounded-xl border border-slate-200/60 bg-white p-6 dark:bg-slate-900 shadow-lg">
          <DialogHeader className="space-y-3">
            {/* Soft Translucent Danger State Badge Icon */}
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-rose-200/60 bg-rose-50/80 text-rose-600">
              <ShieldAlert className="h-5 w-5 stroke-[2.2]" />
            </div>
            <div className="space-y-1">
              <DialogTitle className="text-sm font-bold tracking-wide text-slate-800 dark:text-slate-200">
                Duplicate Index Checked
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-1 leading-relaxed">
                A unique constraint collision has occurred. A candidate with mobile number <code className="bg-rose-50/80 text-rose-600 dark:bg-rose-900/30 px-1.5 py-0.5 rounded font-mono font-bold text-[11px]">{duplicate?.mobile}</code> already maps to a live entity record.
              </DialogDescription>
            </div>
          </DialogHeader>

          {/* Entity Snapshot Alert Card Box - Soft Danger Aesthetics */}
          <DialogBody className="pt-4">
            <div className="rounded-xl border border-rose-200/60 bg-rose-50/80 p-4 flex items-center justify-between gap-4">
              <div className="space-y-1 min-w-0">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">Existing Identity Matches</span>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200 tracking-tight block truncate">{duplicate?.fullName}</span>
              </div>
              <div className="inline-flex items-center text-xs font-bold text-rose-600 bg-rose-100 border border-rose-200/60 px-2.5 py-1 rounded-lg shrink-0">
                Conflict Found
              </div>
            </div>
          </DialogBody>

          <DialogFooter className="mt-6 flex flex-col sm:flex-row gap-2 sm:justify-end">
            <Button
              variant="outline"
              onClick={() => navigate(`/candidates/${duplicate?._id}`)}
              className="rounded-lg h-11 border-slate-200 text-slate-700 dark:border-slate-700 dark:text-slate-300 font-medium gap-2 transition-all w-full sm:w-auto"
            >
              <Eye className="h-3.5 w-3.5 text-slate-400" />
              <span>View Existing</span>
            </Button>

            <Button
              variant="outline"
              onClick={() => navigate(`/candidates/${duplicate?._id}/edit`)}
              className="rounded-lg h-11 border-slate-200 text-slate-700 dark:border-slate-700 dark:text-slate-300 font-medium gap-2 transition-all w-full sm:w-auto"
            >
              <FileEdit className="h-3.5 w-3.5 text-slate-400" />
              <span>Update Record</span>
            </Button>

            {!isEdit && (
              <Button
                onClick={() => handleForceCreate(duplicate)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-lg h-11 gap-2 transition-all duration-200 active:scale-95 w-full sm:w-auto"
              >
                <UserPlus className="h-3.5 w-3.5 stroke-[2.2]" />
                <span>Create Anyway</span>
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}