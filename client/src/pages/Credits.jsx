import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSchoolCredits, getUnlockHistory, getCreditPackages, purchaseCreditPackage } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import { 
  Coins, 
  Sparkles, 
  ShoppingBag, 
  History, 
  User, 
  Briefcase, 
  Layers, 
  Calendar, 
  Loader2, 
  ArrowUpRight 
} from 'lucide-react';

export default function Credits() {
  const { refreshSchool } = useAuth();
  const queryClient = useQueryClient();

  const { data: credits, isLoading: isLoadingCredits } = useQuery({
    queryKey: ['credits'],
    queryFn: () => getSchoolCredits().then((r) => r.data.data),
  });

  const { data: history = [], isLoading: isLoadingHistory } = useQuery({
    queryKey: ['unlock-history'],
    queryFn: () => getUnlockHistory().then((r) => r.data.data),
  });

  const { data: packages = [], isLoading: isLoadingPackages } = useQuery({
    queryKey: ['credit-packages'],
    queryFn: () => getCreditPackages().then((r) => r.data.data),
  });

  const purchaseMutation = useMutation({
    mutationFn: (packageId) => purchaseCreditPackage(packageId),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['credits'] });
      await refreshSchool();
    },
  });

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto p-6 antialiased text-slate-800 dark:text-slate-200 bg-slate-50/50 dark:bg-slate-950 min-h-screen animate-in fade-in duration-500">
      
      {/* Page Header Panel Layout */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-800 dark:text-white flex items-center gap-2">
            <Coins className="h-5 w-5 text-purple-600" /> Wallet &amp; Credits
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 font-medium">
            Scale your talent acquisition pipelines, purchase package extensions, and monitor historical profile unlocks.
          </p>
        </div>
        <div className="inline-flex items-center border border-purple-200/60 bg-purple-50/80 text-purple-700 rounded-lg px-3 py-1 text-xs font-semibold">
          School Ecosystem Base
        </div>
      </div>

      {/* Main Structural Grid */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        
        {/* Available Balance Card Component */}
        <Card className="border border-slate-200/60 bg-white shadow-2xs dark:bg-slate-900">
          <CardHeader className="p-5 pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-2">
              Available Credits
            </CardTitle>
            <div className="p-2 border border-purple-200/60 bg-purple-50/80 text-purple-700 rounded-lg">
              <Sparkles className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="p-5 pt-2">
            {isLoadingCredits ? (
              <div className="h-16 flex items-center"><Loader2 className="h-6 w-6 text-purple-600 animate-spin" /></div>
            ) : (
              <div>
                <div className="flex items-baseline gap-2">
                  <p className="text-5xl font-bold text-slate-800 dark:text-white tracking-tight">
                    {credits?.credits ?? 0}
                  </p>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50/80 border border-purple-200/60 px-2 py-0.5 rounded-lg">Token Units</span>
                </div>
                
                {credits?.plan ? (
                  <div className="mt-4 p-3 bg-slate-50/50 border border-slate-100 rounded-lg flex items-center justify-between text-xs font-medium text-slate-500 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-600" />
                      Active Tier: <strong className="text-slate-800 dark:text-slate-200 font-bold">{credits.plan.name}</strong>
                    </span>
                    <span className="text-slate-400 dark:text-slate-500 text-[11px]">
                      Expires: {credits.expiryDate ? formatDate(credits.expiryDate) : 'N/A'}
                    </span>
                  </div>
                ) : (
                  <p className="mt-4 text-xs text-slate-400 dark:text-slate-500 font-medium">No active tier structural package identified.</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Storefront Card Component */}
        <Card className="border border-slate-200/60 bg-white shadow-2xs dark:bg-slate-900">
          <CardHeader className="p-5 pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Available Storefront Extensions
            </CardTitle>
            <div className="p-2 border border-emerald-200/60 bg-emerald-50/80 text-emerald-600 rounded-lg">
              <ShoppingBag className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="p-5 pt-2 space-y-3 max-h-[200px] overflow-y-auto pr-1">
            {isLoadingPackages ? (
              <div className="py-8 flex justify-center"><Loader2 className="h-6 w-6 text-slate-400 animate-spin" /></div>
            ) : packages.filter((p) => p.isActive !== false).length === 0 ? (
              <p className="text-sm text-slate-400 dark:text-slate-500 font-medium py-4 text-center">No active validation store packages configured.</p>
            ) : (
              packages.filter((p) => p.isActive !== false).map((pkg) => (
                <div 
                  key={pkg._id} 
                  className="flex items-center justify-between rounded-lg border border-slate-200/60 bg-slate-50/50 p-3 transition-all hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950/50 dark:hover:bg-slate-950"
                >
                  <div className="space-y-0.5">
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      {pkg.name}
                    </p>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50/80 border border-purple-200/60 rounded-lg px-1.5 py-0.5 w-fit">
                      {pkg.credits} tokens
                    </p>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => purchaseMutation.mutate(pkg._id)} 
                    disabled={purchaseMutation.isPending}
                    className="h-9 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold px-4 transition-all flex items-center gap-1.5"
                  >
                    {purchaseMutation.isPending && purchaseMutation.variables === pkg._id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <>
                        Purchase <ArrowUpRight className="h-3 w-3" />
                      </>
                    )}
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Profile Unlock Audit Trail Section */}
      <Card className="table">
        <CardHeader className="p-5 border-b border-slate-200/60 dark:border-slate-800 flex flex-row items-center justify-between space-y-0">
          <div className="space-y-0.5">
            <CardTitle className="text-sm font-bold tracking-wide text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <History className="h-4 w-4 text-purple-600" /> Profile Unlock Audit Ledger
            </CardTitle>
            <p className="text-xs font-medium text-slate-400 dark:text-slate-500">Chronological verification records of asset consumption</p>
          </div>
          <div className="border border-slate-200/60 bg-slate-50/50 text-slate-600 rounded-lg px-2.5 py-0.5 text-[11px] font-bold dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
            Total Logs: {history.length}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="w-full overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-b border-slate-200/60 dark:border-slate-800">
                  <TableHead className="text-slate-700 dark:text-slate-300 font-bold text-[11px] uppercase tracking-wider pl-6 h-12">
                    <span className="flex items-center gap-1.5"><User className="h-3 w-3" /> Candidate</span>
                  </TableHead>
                  <TableHead className="text-slate-700 dark:text-slate-300 font-bold text-[11px] uppercase tracking-wider h-12">
                    <span className="flex items-center gap-1.5"><Briefcase className="h-3 w-3" /> Target Position</span>
                  </TableHead>
                  <TableHead className="text-slate-700 dark:text-slate-300 font-bold text-[11px] uppercase tracking-wider h-12">
                    <span className="flex items-center gap-1.5"><Layers className="h-3 w-3" /> Sourcing Matrix</span>
                  </TableHead>
                  <TableHead className="text-slate-700 dark:text-slate-300 font-bold text-[11px] uppercase tracking-wider pr-6 h-12">
                    <span className="flex items-center gap-1.5"><Calendar className="h-3 w-3" /> Timestamp</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingHistory ? (
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={4} className="py-12 text-center">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Loader2 className="h-6 w-6 text-purple-600 animate-spin" />
                        <span className="text-xs text-slate-400 font-semibold tracking-wide">Syncing data log matrices...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : history.length === 0 ? (
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={4} className="py-12 text-center">
                      <div className="max-w-sm mx-auto flex flex-col items-center justify-center space-y-2">
                        <div className="p-2.5 border border-slate-200/60 bg-slate-50/50 rounded-lg text-slate-400 dark:border-slate-800 dark:bg-slate-950">
                          <History className="h-5 w-5" />
                        </div>
                        <div className="space-y-0.5">
                          <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">Audit pipeline vacant</h4>
                          <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                            No external platform profiles have been requested or unlocked inside your database pool yet.
                          </p>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  history.map((h) => (
                    <TableRow key={h._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all border-b border-slate-200/60 last:border-none dark:border-slate-800">
                      <TableCell className="font-bold text-slate-800 text-sm pl-6 dark:text-slate-200">
                        {h.candidateId?.fullName || <span className="text-slate-400 dark:text-slate-500 font-normal italic">Unavailable profile record</span>}
                      </TableCell>
                      <TableCell className="text-slate-600 font-semibold text-sm dark:text-slate-400">
                        {h.candidateId?.position || <span className="text-slate-300 dark:text-slate-600 font-normal">—</span>}
                      </TableCell>
                      <TableCell>
                        {h.candidateId?.source ? (
                          <span className="inline-block border border-indigo-200/60 bg-indigo-50/80 text-indigo-700 font-semibold rounded-lg px-2 py-0.5 text-xs">
                            {h.candidateId.source.replace(/_/g, ' ')}
                          </span>
                        ) : (
                          <span className="inline-block border border-slate-200/60 text-slate-400 text-xs font-medium rounded-lg px-2 py-0.5 dark:border-slate-700 dark:text-slate-500">
                            Talent Pool
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-slate-500 font-medium text-xs pr-6 dark:text-slate-500">
                        {formatDate(h.createdAt)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}