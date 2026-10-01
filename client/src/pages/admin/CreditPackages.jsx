import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Plus, Trash2, Coins, Loader2, Bookmark, Sparkles, 
  AlertCircle, Percent, ArrowRight, CheckCircle2 
} from 'lucide-react';
import { getCreditPackages, createCreditPackage, deleteCreditPackage } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Dialog, DialogBody, DialogContent, DialogDescription, 
  DialogFooter, DialogHeader, DialogTitle 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.credits) return;
    createMutation.mutate({ name: form.name, credits: Number(form.credits) });
  };

  const totalPackages = packages.length;
  const avgCredits = totalPackages > 0 ? Math.round(packages.reduce((s, p) => s + (p.credits || 0), 0) / totalPackages) : 0;
  const maxCredits = totalPackages > 0 ? Math.max(...packages.map((p) => p.credits || 0)) : 0;

  return (
    <div className="space-y-4 sm:space-y-5 w-full antialiased text-slate-800 dark:text-slate-100 pb-16">
      
      {/* ─── 1. TOP HEADER BANNER ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-[#F0FCF5] via-[#EFF6FF] to-[#FAF5FF] dark:from-slate-800/90 dark:via-slate-800/70 dark:to-slate-800/90 p-3.5 sm:px-5 sm:py-3.5 rounded-2xl shadow-2xs border border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2.5 bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-400 rounded-xl border border-slate-200/80 shadow-2xs shrink-0">
            <Percent className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-sm sm:text-base font-extrabold tracking-tight text-slate-900 dark:text-white truncate">
                Credit Top-Up Packages
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300 border border-teal-200/60 shrink-0">
                {totalPackages} Packages
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate mt-0.5">
              Publish standalone credit top-ups for schools to unlock additional candidate biodatas
            </p>
          </div>
        </div>
        
        {/* Quick Action */}
        <div className="flex items-center gap-2">
          <Button 
            onClick={() => setDialogOpen(true)}
            className="h-9 px-3.5 rounded-lg bg-gradient-to-r from-[#7C3AED] via-[#8A3BD4] to-[#00D2FF] hover:from-[#6D28D9] hover:via-[#7E22CE] hover:to-[#0284C7] text-white font-bold text-xs shadow-sm shadow-cyan-500/20 transition-all cursor-pointer border-none flex items-center gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Token Package</span>
          </Button>
        </div>
      </div>

      {/* ─── 2. MINI STATS OVERVIEW ─── */}
      <div className="grid gap-2.5 sm:gap-3 grid-cols-1 sm:grid-cols-3">
        <div className="p-3 sm:p-3.5 rounded-xl bg-gradient-to-br from-[#F0FDF4] via-white to-teal-50/50 dark:bg-slate-900 border border-teal-200/80 dark:border-teal-900/50 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] sm:text-[11px] font-bold text-teal-700 dark:text-teal-300 uppercase tracking-wider">
              Total Packages
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-teal-950 dark:text-white mt-1">
              {totalPackages}
            </h3>
            <p className="text-[10px] text-teal-600 dark:text-teal-400 font-medium mt-0.5">Configured top-ups</p>
          </div>
          <div className="p-2.5 rounded-xl bg-teal-100/80 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300">
            <Percent className="h-5 w-5" />
          </div>
        </div>

        <div className="p-3 sm:p-3.5 rounded-xl bg-gradient-to-br from-[#FFFBEB] via-white to-amber-50/50 dark:bg-slate-900 border border-amber-200/80 dark:border-amber-900/50 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] sm:text-[11px] font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider">
              Avg Token Size
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-amber-950 dark:text-white mt-1">
              {avgCredits}
            </h3>
            <p className="text-[10px] text-amber-600 dark:text-amber-400 font-medium mt-0.5">Average bundle credits</p>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-100/80 dark:bg-amber-950/60 text-amber-600 dark:text-amber-300">
            <Coins className="h-5 w-5" />
          </div>
        </div>

        <div className="p-3 sm:p-3.5 rounded-xl bg-gradient-to-br from-[#FAF5FF] via-white to-purple-50/50 dark:bg-slate-900 border border-purple-200/80 dark:border-purple-900/50 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] sm:text-[11px] font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wider">
              Max Package Size
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-purple-950 dark:text-white mt-1">
              {maxCredits} Credits
            </h3>
            <p className="text-[10px] text-purple-600 dark:text-purple-400 font-medium mt-0.5">Highest top-up option</p>
          </div>
          <div className="p-2.5 rounded-xl bg-purple-100/80 dark:bg-purple-950/60 text-[#8A3BD4] dark:text-purple-300">
            <Bookmark className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* ─── 3. VISUAL PACKAGE CARDS ─── */}
      {!isLoading && packages.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {packages.map((pkg) => (
            <div 
              key={pkg._id}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:border-[#8A3BD4]/40 hover:shadow-xs transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="h-9 w-9 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-200/80 flex items-center justify-center font-bold">
                    <Coins className="h-4 w-4" />
                  </div>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => {
                      if (window.confirm(`Delete package "${pkg.name}"?`)) {
                        deleteMutation.mutate(pkg._id);
                      }
                    }}
                    className="h-7 w-7 rounded-lg border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                    title="Delete Package"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>

                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white mt-3 group-hover:text-[#8A3BD4] transition-colors leading-tight">
                  {pkg.name}
                </h3>

                <div className="mt-3 p-2.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/60 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-600 dark:text-slate-300">Tokens</span>
                  <span className="font-black text-amber-800 dark:text-amber-300">{pkg.credits} Credits</span>
                </div>
              </div>

              <div className="mt-4 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                <span className="flex items-center gap-1 text-emerald-600 font-bold">
                  <CheckCircle2 className="h-3 w-3" /> Ready
                </span>
                <span>Active</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── 4. PACKAGES TABLE ─── */}
      <Card className="border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs rounded-2xl overflow-hidden">
        <CardHeader className="p-4 sm:p-5 flex flex-row items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-teal-50 dark:bg-teal-950/50 text-teal-700 rounded-xl border border-teal-200/60">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight">
                All Configured Packages
              </CardTitle>
              <p className="text-[11px] text-slate-500 font-medium">
                Catalog of active top-up tokens
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="py-20 text-center">
              <Loader2 className="h-7 w-7 text-teal-600 animate-spin mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-500">Loading token packages...</p>
            </div>
          ) : packages.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <AlertCircle className="h-8 w-8 mx-auto mb-2 stroke-[1.5]" />
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">No token packages found</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Click "Add Token Package" to create one</p>
            </div>
          ) : (
            <div className="overflow-x-auto w-full">
              <Table>
                <TableHeader className="bg-slate-50/70 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                  <TableRow>
                    <TableHead className="pl-5 font-bold text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 py-3.5">Package Title</TableHead>
                    <TableHead className="font-bold text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 py-3.5">Credit Balance Quota</TableHead>
                    <TableHead className="pr-5 text-right font-bold text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 py-3.5">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {packages.map((pkg) => (
                    <TableRow 
                      key={pkg._id}
                      className="group hover:bg-teal-50/20 dark:hover:bg-slate-800/40 transition-all border-b border-slate-100 dark:border-slate-800/60 last:border-none"
                    >
                      <TableCell className="pl-5 py-4 font-bold text-slate-800 dark:text-slate-200">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-teal-100 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 font-bold text-xs">
                            <Coins className="h-4 w-4" />
                          </div>
                          <span className="font-extrabold text-slate-900 dark:text-white text-sm">{pkg.name}</span>
                        </div>
                      </TableCell>

                      <TableCell className="py-4">
                        <div className="inline-flex items-center gap-1.5 text-xs font-extrabold border border-amber-200/80 bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 px-2.5 py-1 rounded-lg">
                          <Coins className="h-3.5 w-3.5 text-amber-500" />
                          <span>{pkg.credits} Credits</span>
                        </div>
                      </TableCell>

                      <TableCell className="pr-5 py-4 text-right">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          onClick={() => {
                            if (window.confirm(`Delete package "${pkg.name}"?`)) {
                              deleteMutation.mutate(pkg._id);
                            }
                          }}
                          className="h-8 w-8 rounded-lg border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                          title="Delete Package"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ─── 5. ADD PACKAGE DIALOG ─── */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white p-6 dark:bg-slate-900 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <div className="p-1.5 bg-teal-100 dark:bg-teal-950/60 text-teal-700 rounded-lg">
                <Percent className="h-4 w-4" />
              </div>
              <span>Create Top-Up Credit Package</span>
            </DialogTitle>
            <DialogDescription className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
              Add a selectable token bundle that schools can purchase to increase their balance.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 pt-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Package Name *</Label>
              <Input
                placeholder="e.g. 50 Credits Top-up, 100 Credits Booster"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="h-10 border-slate-200 rounded-xl text-xs sm:text-sm font-semibold"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Total Credits Tokens *</Label>
              <div className="relative">
                <Input
                  type="number"
                  min="1"
                  placeholder="e.g. 50, 100"
                  value={form.credits}
                  onChange={(e) => setForm({ ...form, credits: e.target.value })}
                  className="pl-9 h-10 border-slate-200 rounded-xl text-xs sm:text-sm font-semibold"
                  required
                />
                <Coins className="absolute left-3 top-3 h-4 w-4 text-amber-500" />
              </div>
            </div>

            <DialogFooter className="mt-5 flex gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setDialogOpen(false)}
                className="rounded-xl h-10 px-4 font-bold text-xs border-slate-200"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending}
                className="bg-gradient-to-r from-[#7C3AED] via-[#8A3BD4] to-[#00D2FF] hover:from-[#6D28D9] hover:via-[#7E22CE] hover:to-[#0284C7] text-white font-bold rounded-xl h-10 px-5 text-xs shadow-sm cursor-pointer"
              >
                {createMutation.isPending ? 'Creating...' : 'Create Package'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

    </div>
  );
}