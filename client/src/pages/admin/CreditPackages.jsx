import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, Coins, FolderPlus, Loader2, Bookmark } from 'lucide-react';
import { getCreditPackages, createCreditPackage, deleteCreditPackage } from '@/lib/api';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogBody, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export default function CreditPackages() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ name: '', credits: '' });

  const { data: packages = [], isLoading } = useQuery({
    queryKey: ['credit-packages'],
    queryFn: () => getCreditPackages().then((r) => r.data.data),
  });

  const createMutation = useMutation({
    mutationFn: createCreditPackage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credit-packages'] });
      setDialogOpen(false);
      setForm({ name: '', credits: '' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCreditPackage,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['credit-packages'] }),
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      {/* Page Header Panel Layout */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <PageHeader
          title="Credit Packages"
          description="Design, maintain, and publish standalone balance top-up token tiers for registered recruitment schools."
          className="text-slate-800 dark:text-white font-bold tracking-tight text-xl"
        />
        <Button 
          onClick={() => setDialogOpen(true)}
          className="bg-[#A05AFF] hover:bg-[#A05AFF]/90 text-white font-bold rounded-xl transition-all duration-200 active:scale-95"
        >
          <Plus className="mr-2 h-4 w-4 stroke-[3]" />
          Add Token Package
        </Button>
      </div>

      {/* Main Container Layer Constraint */}
      <Card className="rounded-xl border-none bg-white shadow-sm dark:bg-slate-900 overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/70 dark:bg-slate-900/20 text-slate-400 font-semibold text-[11px] uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
              <TableRow>
                <TableHead className="pl-6 py-4 text-slate-400 dark:text-slate-500 font-bold text-[11px] uppercase tracking-wider">
                  Package Identity Name
                </TableHead>
                <TableHead className="text-slate-400 dark:text-slate-500 font-bold text-[11px] uppercase tracking-wider">
                  Distributed Credit Balance
                </TableHead>
                <TableHead className="pr-6 text-right text-slate-400 dark:text-slate-500 font-bold text-[11px] uppercase tracking-wider">
                  Operations
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={3} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center p-6">
                      <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 mb-3">
                        <Loader2 className="h-5 w-5 text-[#A05AFF] animate-spin" />
                      </div>
                      <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 tracking-wide animate-pulse">
                        Synchronizing balance top-up catalog...
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : packages.length > 0 ? (
                packages.map((pkg) => (
                  <TableRow 
                    key={pkg._id}
                    className="group border-b border-slate-100 dark:border-slate-800/60 last:border-none hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all"
                  >
                    {/* Package Identifier with Secondary Brand Accent Avatar */}
                    <TableCell className="pl-6 py-4 font-bold text-slate-800 dark:text-slate-200">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#A05AFF]/10 text-[#A05AFF]">
                          <Bookmark className="h-4 w-4" />
                        </div>
                        <span className="truncate max-w-[240px] block font-bold text-slate-800 dark:text-slate-200">
                          {pkg.name}
                        </span>
                      </div>
                    </TableCell>

                    {/* Modern Soft-Tint Badge Indicator */}
                    <TableCell className="py-4">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border border-[#4BCBEB]/30 bg-[#4BCBEB]/5 text-[#4BCBEB]">
                        <Coins className="h-4 w-4 stroke-[2.5]" />
                        <span>{pkg.credits} Credits</span>
                      </div>
                    </TableCell>

                    {/* Operational Actions with Soft-Tint Destructive Trigger */}
                    <TableCell className="pr-6 py-4 text-right">
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteMutation.mutate(pkg._id)}
                        className="h-8 w-8 rounded-xl p-0 border border-[#FE9496]/30 bg-[#FE9496]/5 text-[#FE9496] hover:bg-[#FE9496] hover:text-white transition-all duration-200 active:scale-95"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center p-6">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 border border-dashed border-slate-200 dark:border-slate-700 text-slate-400 mb-3">
                        <Coins className="h-5 w-5" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">No standalone credit packages found</h4>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-sm mx-auto">
                        Your micro-transaction bundle ledger is empty. Create a configuration package above to activate credit top-ups.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Premium Package Asset Entry Dialog Config */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md rounded-xl border-none bg-white p-6 dark:bg-slate-900 shadow-sm">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold tracking-wide text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <FolderPlus className="h-5 w-5 text-[#A05AFF]" />
              Configure Top-Up Bundle
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-1">
              Construct localized standalone credit top-ups to supply platform operational tokens to recruitment entities.
            </DialogDescription>
          </DialogHeader>
          <DialogBody className="pt-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                createMutation.mutate({ name: form.name, credits: Number(form.credits) });
              }}
              className="space-y-5"
            >
              {/* Package Label Text Field Input */}
              <div className="space-y-1.5">
                <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Package Label Title
                </Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  placeholder="e.g. Mid-Season Recruiter Booster Pack"
                  className="h-11 border-slate-200 rounded-xl focus:bg-white focus-visible:ring-[#A05AFF] focus-visible:border-[#A05AFF]/50 dark:bg-slate-800 dark:border-slate-700"
                />
              </div>

              {/* Total Balance Tokens Value Numerical Input */}
              <div className="space-y-1.5">
                <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Allocated Credit Balance Amount
                </Label>
                <div className="relative group">
                  <Coins className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400 group-focus-within:text-[#A05AFF] transition-colors" />
                  <Input
                    type="number"
                    value={form.credits}
                    onChange={(e) => setForm({ ...form, credits: e.target.value })}
                    required
                    placeholder="e.g. 250"
                    min="1"
                    className="pl-10 h-11 border-slate-200 rounded-xl focus:bg-white focus-visible:ring-[#A05AFF] focus-visible:border-[#A05AFF]/50 text-sm font-medium dark:bg-slate-800 dark:border-slate-700"
                  />
                </div>
              </div>
            </form>
          </DialogBody>
          <DialogFooter className="mt-6 flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDialogOpen(false)}
              className="rounded-xl h-11 font-medium transition-all border-slate-200 text-slate-700 dark:border-slate-700 dark:text-slate-300"
            >
              Cancel
            </Button>
            <Button
              onClick={() => createMutation.mutate({ name: form.name, credits: Number(form.credits) })}
              disabled={createMutation.isPending}
              className="rounded-xl h-11 bg-[#A05AFF] hover:bg-[#A05AFF]/90 text-white font-bold tracking-wide transition-all duration-200 active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {createMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Publishing Tiers...
                </>
              ) : (
                "Save Credit Bundle"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}