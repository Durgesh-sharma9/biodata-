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

  // Modern SaaS Skeleton loading placeholder
  if (isEdit && isLoading) {
    return (
      <div className="space-y-6 p-4 md:p-8 animate-pulse max-w-4xl mx-auto">
        <div className="space-y-2">
          <div className="h-8 bg-muted/60 rounded-xl w-1/3" />
          <div className="h-4 bg-muted/40 rounded-lg w-1/2" />
        </div>
        <div className="space-y-4 pt-4">
          <div className="h-48 bg-muted/30 rounded-2xl border border-muted/20 w-full" />
          <div className="h-32 bg-muted/30 rounded-2xl border border-muted/20 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4 md:p-8 max-w-4xl mx-auto antialiased text-foreground bg-background">
      
      {/* Premium Header Layout Module Container */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200/60 bg-gradient-to-r from-slate-50 via-white to-slate-50/50 p-6 dark:from-slate-950 dark:via-background dark:to-slate-950/50 shadow-2xs">
        <div className="absolute right-0 top-0 -mr-12 -mt-12 w-40 h-40 bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        <PageHeader
          title={isEdit ? 'Edit Candidate Profile' : 'Onboard New Candidate'}
          description={isEdit ? 'Modify background records, profile configurations, and dynamic meta indicators.' : 'Register and index a fresh talent entry profile directly into HireHub.'}
        />
      </div>

      {/* Main Core Application Form Wrapper Component */}
      <div className="rounded-2xl border border-slate-200/50 bg-card p-2 shadow-2xs">
        <DynamicCandidateForm
          initialValues={candidate}
          onSubmit={onSubmit}
          settings={settings}
          isLoading={saveMutation.isPending}
          submitButtonText={isEdit ? 'Update Candidate' : 'Add Candidate'}
          showMobileCheck={!isEdit}
          disabledFields={isEdit ? ['mobile'] : []}
        />
      </div>

      {/* Polish Premium Collision Detection / Conflict Resolution Modal */}
      <Dialog open={!!duplicate} onOpenChange={() => setDuplicate(null)}>
        <DialogContent className="sm:max-w-[480px] rounded-2xl border border-slate-200/60 shadow-xl overflow-hidden p-0 bg-background">
          {/* Warning state indicator line banner */}
          <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-500" />
          
          <div className="p-6 space-y-6">
            <DialogHeader className="space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 shadow-3xs">
                <ShieldAlert className="h-5 w-5 stroke-[2.2]" />
              </div>
              <div className="space-y-1">
                <DialogTitle className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                  Duplicate Index Checked
                </DialogTitle>
                <DialogDescription className="text-xs font-medium text-muted-foreground/90 leading-relaxed">
                  A unique constraint collision has occurred. A candidate with mobile number <code className="bg-amber-500/10 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 px-1.5 py-0.5 rounded font-mono font-bold text-[11px]">{duplicate?.mobile}</code> already maps to a live entity record.
                </DialogDescription>
              </div>
            </DialogHeader>

            {/* Entity Snapshot Alert Card Box */}
            <div className="rounded-xl border border-amber-200/50 bg-amber-500/[0.02] p-4 flex items-center justify-between gap-4">
              <div className="space-y-0.5 min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">Existing Identity Matches</span>
                <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200 tracking-tight block truncate">{duplicate?.fullName}</span>
              </div>
              <div className="inline-flex items-center text-xs font-bold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-md">
                Conflict Found
              </div>
            </div>

            {/* Advanced Responsive Form Actions Row Layout */}
            <div className="flex flex-col sm:flex-row gap-2 pt-1 sm:justify-end">
              <Button 
                variant="outline" 
                onClick={() => navigate(`/candidates/${duplicate?._id}`)}
                className="rounded-xl h-10 text-xs font-bold border-slate-200 hover:bg-slate-50 gap-2 transition-all w-full sm:w-auto"
              >
                <Eye className="h-3.5 w-3.5 text-slate-500" />
                <span>View Existing</span>
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => navigate(`/candidates/${duplicate?._id}/edit`)}
                className="rounded-xl h-10 text-xs font-bold border-slate-200 hover:bg-slate-50 gap-2 transition-all w-full sm:w-auto"
              >
                <FileEdit className="h-3.5 w-3.5 text-slate-500" />
                <span>Update Record</span>
              </Button>
              
              {!isEdit && (
                <Button 
                  onClick={() => handleForceCreate(duplicate)}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl h-10 gap-2 shadow-sm transition-all w-full sm:w-auto"
                >
                  <UserPlus className="h-3.5 w-3.5 stroke-[2.2]" />
                  <span>Create Anyway</span>
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}