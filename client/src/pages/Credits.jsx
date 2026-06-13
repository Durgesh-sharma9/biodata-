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
  CheckCircle2, 
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
    <div className="space-y-8 max-w-[1600px] mx-auto p-4 md:p-6 lg:p-8 antialiased text-slate-800">
      
      {/* Redesigned Dynamic Page Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 md:p-8 shadow-xl border border-slate-800/50">
        <div className="absolute top-0 right-0 -mt-6 -mr-6 w-72 h-72 bg-gradient-to-br from-indigo-500/10 to-purple-500/0 rounded-full blur-2xl pointer-events-none" />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
              <Coins className="h-7 w-7 text-indigo-400" /> Wallet &amp; Credits
            </h1>
            <p className="text-sm text-slate-300 font-medium">
              Scale your talent acquisition pipelines, purchase package extensions, and monitor historical profile unlocks.
            </p>
          </div>
          <Badge className="w-fit bg-indigo-500/10 text-indigo-300 border-indigo-500/20 rounded-xl px-3 py-1 text-xs font-semibold backdrop-blur-sm">
            School Ecosystem Base
          </Badge>
        </div>
      </div>

      {/* Main Metric Cards Layout Row */}
      <div className="grid gap-6 md:grid-cols-2">
        
        {/* Available Balance Premium Card */}
        <Card className="border-slate-200/60 shadow-md shadow-slate-100/50 rounded-2xl overflow-hidden bg-white relative group">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-indigo-500 via-indigo-600 to-purple-600" />
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              Available Credits
            </CardTitle>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <Sparkles className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            {isLoadingCredits ? (
              <div className="h-16 flex items-center"><Loader2 className="h-6 w-6 text-indigo-600 animate-spin" /></div>
            ) : (
              <div>
                <div className="flex items-baseline gap-2">
                  <p className="text-5xl font-black text-slate-900 tracking-tight">
                    {credits?.credits ?? 0}
                  </p>
                  <span className="text-sm font-bold text-indigo-600 uppercase tracking-wide bg-indigo-50 px-2 py-0.5 rounded-md">Token Units</span>
                </div>
                
                {credits?.plan ? (
                  <div className="mt-6 p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between text-xs font-medium text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Active Tier: <strong className="text-slate-700 font-bold">{credits.plan.name}</strong>
                    </span>
                    <span className="text-slate-400">
                      Expires: {credits.expiryDate ? formatDate(credits.expiryDate) : 'N/A'}
                    </span>
                  </div>
                ) : (
                  <p className="mt-4 text-xs text-slate-400 font-medium">No active tier structural package identified.</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Purchase Credits Extended Storefront Card */}
        <Card className="border-slate-200/60 shadow-md shadow-slate-100/50 rounded-2xl overflow-hidden bg-white">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Available Storefront Extensions
            </CardTitle>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <ShoppingBag className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="pt-4 space-y-3 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin">
            {isLoadingPackages ? (
              <div className="py-8 flex justify-center"><Loader2 className="h-6 w-6 text-slate-400 animate-spin" /></div>
            ) : packages.filter((p) => p.isActive !== false).length === 0 ? (
              <p className="text-sm text-slate-400 font-medium py-4 text-center">No active validation store packages configured.</p>
            ) : (
              packages.filter((p) => p.isActive !== false).map((pkg) => (
                <div 
                  key={pkg._id} 
                  className="flex items-center justify-between rounded-xl border border-slate-100 hover:border-indigo-100 bg-slate-50/40 p-3 group/item transition-all hover:bg-white hover:shadow-sm"
                >
                  <div className="space-y-0.5">
                    <p className="text-sm font-bold text-slate-700 group-hover/item:text-indigo-600 transition-colors">
                      {pkg.name}
                    </p>
                    <p className="text-xs font-semibold text-indigo-600 bg-indigo-500/5 border border-indigo-500/10 rounded-md px-1.5 py-0.5 w-fit">
                      {pkg.credits} tokens
                    </p>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => purchaseMutation.mutate(pkg._id)} 
                    disabled={purchaseMutation.isPending}
                    className="h-9 rounded-lg bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold px-4 tracking-wide shadow-sm hover:shadow transition-all group/btn flex items-center gap-1.5"
                  >
                    {purchaseMutation.isPending && purchaseMutation.variables === pkg._id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <>
                        Purchase <ArrowUpRight className="h-3 w-3 opacity-60 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
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
      <Card className="border-slate-200/60 shadow-md shadow-slate-100/50 rounded-2xl bg-white overflow-hidden">
        <CardHeader className="border-b border-slate-50 pb-4 flex flex-row items-center justify-between bg-slate-50/30">
          <div className="space-y-0.5">
            <CardTitle className="text-sm font-bold text-slate-800 tracking-tight flex items-center gap-2">
              <History className="h-4 w-4 text-indigo-500" /> Profile Unlock Audit Ledger
            </CardTitle>
            <p className="text-xs font-medium text-slate-400">Chronological verification records of asset consumption</p>
          </div>
          <Badge className="bg-slate-100 text-slate-600 border-slate-200/60 rounded-lg px-2.5 py-0.5 text-[11px] font-bold">
            Total Logs: {history.length}
          </Badge>
        </CardHeader>
        <CardContent className="p-0">
          <div className="w-full overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/60 border-b border-slate-100/80">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-slate-500 font-bold text-xs uppercase tracking-wider pl-6">
                    <span className="flex items-center gap-1.5"><User className="h-3 w-3 text-slate-400" /> Candidate</span>
                  </TableHead>
                  <TableHead className="text-slate-500 font-bold text-xs uppercase tracking-wider">
                    <span className="flex items-center gap-1.5"><Briefcase className="h-3 w-3 text-slate-400" /> Target Position</span>
                  </TableHead>
                  <TableHead className="text-slate-500 font-bold text-xs uppercase tracking-wider">
                    <span className="flex items-center gap-1.5"><Layers className="h-3 w-3 text-slate-400" /> Sourcing Matrix</span>
                  </TableHead>
                  <TableHead className="text-slate-500 font-bold text-xs uppercase tracking-wider pr-6">
                    <span className="flex items-center gap-1.5"><Calendar className="h-3 w-3 text-slate-400" /> Timestamp</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-slate-100/80">
                {isLoadingHistory ? (
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={4} className="py-12 text-center">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Loader2 className="h-7 w-7 text-indigo-600 animate-spin" />
                        <span className="text-xs text-slate-400 font-semibold tracking-wide">Syncing data log matrices...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : history.length === 0 ? (
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={4} className="py-16 text-center">
                      <div className="max-w-sm mx-auto flex flex-col items-center justify-center space-y-3">
                        <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-400">
                          <History className="h-6 w-6" />
                        </div>
                        <div className="space-y-0.5">
                          <h4 className="text-sm font-bold text-slate-700">Audit pipeline vacant</h4>
                          <p className="text-xs text-slate-400 font-medium">
                            No external platform profiles have been requested or unlocked inside your database pool yet.
                          </p>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  history.map((h) => (
                    <TableRow key={h._id} className="hover:bg-slate-50/40 transition-colors group/row">
                      <TableCell className="font-bold text-slate-700 text-sm pl-6 group-hover/row:text-indigo-600 transition-colors">
                        {h.candidateId?.fullName || <span className="text-slate-400 font-normal italic">Unavailable profile record</span>}
                      </TableCell>
                      <TableCell className="text-slate-600 font-semibold text-sm">
                        {h.candidateId?.position || <span className="text-slate-300 font-normal">—</span>}
                      </TableCell>
                      <TableCell>
                        {h.candidateId?.source ? (
                          <Badge className="bg-purple-500/10 text-purple-600 border-purple-200/40 font-semibold rounded-md px-2 py-0.5 text-xs">
                            {h.candidateId.source.replace(/_/g, ' ')}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-slate-400 border-slate-200 text-xs font-medium">
                            Talent Pool
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-slate-500 font-medium text-xs pr-6">
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