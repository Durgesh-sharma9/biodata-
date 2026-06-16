import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, Coins, Sparkles, FolderPlus, Loader2, Bookmark } from 'lucide-react';
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
      {/* Premium Dashboard Layout Header Row Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-5">
        <PageHeader
          title="Credit Packages"
          description="Design, maintain, and publish standalone balance top-up token tiers for registered recruitment schools."
        />
        <Button 
          onClick={() => setDialogOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-md shadow-indigo-600/20 hover:from-blue-500 hover:to-indigo-500 transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
        >
          <Plus className="mr-2 h-4 w-4 stroke-[3]" />
          Add Token Package
        </Button>
      </div>

      {/* Main Administrative Product Ledger Grid Card */}
      <Card className="border border-slate-100/80 bg-white/90 shadow-xl shadow-slate-100/40 rounded-2xl overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/70 border-b border-slate-100">
              <TableRow>
                <TableHead className="pl-6 py-4">Package Identity Name</TableHead>
                <TableHead>Distributed Credit Balance</TableHead>
                <TableHead className="pr-6 text-right">Operations</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={3} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center p-8">
                      <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 border border-slate-100 mb-3 shadow-sm">
                        <Loader2 className="h-5 w-5 text-indigo-600 animate-spin" />
                      </div>
                      <p className="text-sm font-semibold text-slate-500 tracking-wide animate-pulse">
                        Synchronizing balance top-up catalog...
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : packages.length > 0 ? (
                packages.map((pkg) => (
                  <TableRow 
                    key={pkg._id}
                    className="group border-b border-slate-100/70 last:border-0 hover:bg-gradient-to-r hover:from-indigo-50/20 hover:to-transparent transition-all duration-150"
                  >
                    {/* Package Descriptor Identifier */}
                    <TableCell className="pl-6 py-4.5 font-bold text-slate-800">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 border border-indigo-100/40 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
                          <Bookmark className="h-4 w-4" />
                        </div>
                        <span className="truncate max-w-[240px] block font-bold text-slate-800">{pkg.name}</span>
                      </div>
                    </TableCell>

                    {/* Numeric Token Balance Amount Block */}
                    <TableCell className="py-4.5">
                      <div className="inline-flex items-center gap-2 font-extrabold text-slate-900 bg-amber-50/60 border border-amber-100/80 px-3 py-1.5 rounded-xl text-sm shadow-sm/5">
                        <Coins className="h-4 w-4 text-amber-500 stroke-[2.5]" />
                        <span>{pkg.credits} Credits</span>
                      </div>
                    </TableCell>

                    {/* Operational Destructive Trigger Operations Control */}
                    <TableCell className="pr-6 py-4.5 text-right">
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteMutation.mutate(pkg._id)}
                        className="h-8 w-8 rounded-lg p-0 bg-red-50 text-red-500 border border-red-100 hover:bg-red-600 hover:text-white hover:border-red-600 shadow-sm/5 transition-all duration-200 active:scale-95 group"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center p-8">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 border border-dashed border-slate-200 text-slate-400 mb-3">
                        <Coins className="h-5 w-5" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-700">No standalone credit packages found</h4>
                      <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
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

      {/* Premium Package Architecture Asset Entry Dialog Sheet */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-800 tracking-tight flex items-center gap-2">
              <FolderPlus className="h-5 w-5 text-indigo-500" />
              Configure Top-Up Bundle
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400 font-medium mt-1">
              Construct localized standalone credit top-ups to supply platform operational tokens to recruitment entities.
            </DialogDescription>
          </DialogHeader>
          <DialogBody>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                createMutation.mutate({ name: form.name, credits: Number(form.credits) });
              }}
              className="space-y-5"
            >
              {/* Package Label Text Field Input */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Package Label Title</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  placeholder="e.g. Mid-Season Recruiter Booster Pack"
                  className="h-11 border-slate-200 rounded-xl focus:bg-white"
                />
              </div>

              {/* Total Balance Tokens Value Numerical Input */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Allocated Credit Balance Amount</Label>
                <div className="relative group">
                  <Coins className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                  <Input
                    type="number"
                    value={form.credits}
                    onChange={(e) => setForm({ ...form, credits: e.target.value })}
                    required
                    placeholder="e.g. 250"
                    min="1"
                    className="pl-10 h-11 border-slate-200 rounded-xl focus:bg-white text-sm font-medium"
                  />
                </div>
              </div>
            </form>
          </DialogBody>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setDialogOpen(false)}
              className="rounded-xl h-11 font-medium transition-all"
            >
              Cancel
            </Button>
            <Button
              onClick={() => createMutation.mutate({ name: form.name, credits: Number(form.credits) })}
              disabled={createMutation.isPending}
              className="rounded-xl h-11 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold tracking-wide shadow-md shadow-indigo-500/20 hover:from-blue-500 hover:to-indigo-500 transition-all duration-200 active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2"
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