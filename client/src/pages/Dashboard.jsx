import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Users, Coins, Plus, List, Search, ArrowRight, Sparkles, Loader2, Calendar, Briefcase, Layers } from 'lucide-react';
import { getDashboardStats } from '@/lib/api';
import { PageHeader } from '@/components/common/PageHeader';
import { StatCard } from '@/components/common/StatCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';

export default function Dashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => getDashboardStats().then((r) => r.data.data),
  });

  if (isLoading) {
    return (
      <div className="flex h-[70vh] flex-col items-center justify-center space-y-4 antialiased bg-[#f3f3f4]">
        <div className="relative flex items-center justify-center">
          <Loader2 className="h-12 w-12 text-[#A05AFF] animate-spin relative z-10" />
          <div className="absolute inset-0 bg-[#A05AFF]/10 rounded-full blur-xl animate-pulse scale-150" />
        </div>
        <p className="text-slate-500 font-bold tracking-wide text-sm">
          Assembling recruitment control center...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-7 max-w-[1400px] mx-auto w-full p-6 antialiased text-[#343a40] bg-[#f3f3f4] min-h-screen">
      
      {/* Top Breadcrumb & Page Info Row */}
      <div className="flex items-center justify-between bg-white px-5 py-4 rounded-xl shadow-sm border-none">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-[#A05AFF] text-white rounded-lg shadow-sm">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-slate-800">Dashboard</h1>
            <p className="text-xs text-slate-400 font-medium">Overview</p>
          </div>
        </div>
        
        {/* Quick Action Group */}
        <div className="flex items-center gap-3">
          <Button asChild className="h-9 rounded-md bg-[#A05AFF] hover:bg-[#A05AFF]/90 text-white font-semibold shadow-sm transition-all text-xs px-4">
            <Link to="/candidates/new">
              <Plus className="mr-1.5 h-3.5 w-3.5" /> Add Candidate
            </Link>
          </Button>
          <Button variant="outline" asChild className="h-9 rounded-md border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-[#A05AFF] transition-all text-xs px-4">
            <Link to="/talent-pool">
              <Search className="mr-1.5 h-3.5 w-3.5 text-[#4BCBEB]" /> Browse Pool
            </Link>
          </Button>
        </div>
      </div>

      {/* Grid Matrix of Premium Colorful Statistics Cards matching the image exactly */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        
        {/* My Candidates - Gradient Coral Red/Pink Card */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#ffbf96] to-[#fe7096] p-6 text-white shadow-sm group">
          <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 opacity-15 pointer-events-none transition-transform duration-500 group-hover:scale-110">
            <Users className="h-32 w-32" />
          </div>
          <div className="relative space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold opacity-90 tracking-wide">My Candidates</span>
              <Users className="h-5 w-5 opacity-80" />
            </div>
            <div>
              <h3 className="text-3xl font-bold tracking-tight">{data?.myCandidates || 0}</h3>
            </div>
            <p className="text-xs opacity-75 font-medium">Increased by 60%</p>
          </div>
        </div>

        {/* Talent Pool - Gradient Vibrant Blue/Sky Card */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#84d9d2] to-[#07cdae] p-6 text-white shadow-sm group">
          <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 opacity-15 pointer-events-none transition-transform duration-500 group-hover:scale-110">
            <List className="h-32 w-32" />
          </div>
          <div className="relative space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold opacity-90 tracking-wide">Talent Pool Records</span>
              <List className="h-5 w-5 opacity-80" />
            </div>
            <div>
              <h3 className="text-3xl font-bold tracking-tight">{data?.talentPoolCount || 0}</h3>
            </div>
            <p className="text-xs opacity-75 font-medium">Increased by 5%</p>
          </div>
        </div>

        {/* Owned Candidates - Gradient Deep Ocean Sky Card */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#90caf9] via-[#64b5f6] to-[#3081e4] p-6 text-white shadow-sm group">
          <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 opacity-15 pointer-events-none transition-transform duration-500 group-hover:scale-110">
            <Briefcase className="h-32 w-32" />
          </div>
          <div className="relative space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold opacity-90 tracking-wide">Owned Candidates</span>
              <Briefcase className="h-5 w-5 opacity-80" />
            </div>
            <div>
              <h3 className="text-3xl font-bold tracking-tight">{data?.ownedCandidates || 0}</h3>
            </div>
            <p className="text-xs opacity-75 font-medium">System Stabilized</p>
          </div>
        </div>

        {/* Available Credits - Gradient Purple/Violet Card */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#da8eff] to-[#9e58ff] p-6 text-white shadow-sm group">
          <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 opacity-15 pointer-events-none transition-transform duration-500 group-hover:scale-110">
            <Coins className="h-32 w-32" />
          </div>
          <div className="relative space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold opacity-90 tracking-wide">Available Credits</span>
              <Coins className="h-5 w-5 opacity-80" />
            </div>
            <div>
              <h3 className="text-3xl font-bold tracking-tight">{data?.availableCredits || 0}</h3>
            </div>
            <p className="text-xs opacity-75 font-medium">Decreased by 10%</p>
          </div>
        </div>
      </div>

      {/* Main Recent Activity Datagrid Card (Flat Canvas styling) */}
      <Card className="table">
        <CardHeader className="flex flex-row items-center justify-between p-5 border-b border-slate-100 space-y-0 bg-white">
          <div className="space-y-0.5">
            <CardTitle className="text-sm font-bold tracking-wide text-slate-800">
              Recent My Candidates
            </CardTitle>
            <p className="text-xs text-slate-400 font-medium">Your platform's latest added pipeline interactions</p>
          </div>
          <Button variant="ghost" asChild className="h-8 text-xs font-bold text-[#A05AFF] hover:bg-[#A05AFF]/10 rounded-md transition-all px-3">
            <Link to="/my-candidates" className="flex items-center gap-1">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="w-full overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-b border-slate-100">
                  <TableHead className="text-slate-700 dark:text-slate-300 font-bold text-[11px] uppercase tracking-wider pl-6 h-12">
                    <span className="flex items-center gap-1.5"><Users className="h-3 w-3" /> Candidate Name</span>
                  </TableHead>
                  <TableHead className="text-slate-700 dark:text-slate-300 font-bold text-[11px] uppercase tracking-wider h-12">
                    <span className="flex items-center gap-1.5"><Briefcase className="h-3 w-3" /> Position</span>
                  </TableHead>
                  <TableHead className="text-slate-700 dark:text-slate-300 font-bold text-[11px] uppercase tracking-wider h-12">
                    <span className="flex items-center gap-1.5"><Layers className="h-3 w-3" /> Sourcing Channel</span>
                  </TableHead>
                  <TableHead className="text-slate-700 dark:text-slate-300 font-bold text-[11px] uppercase tracking-wider pr-6 h-12">
                    <span className="flex items-center gap-1.5"><Calendar className="h-3 w-3" /> Date Added</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.recentCandidates?.length === 0 ? (
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={4} className="py-16 text-center">
                      <div className="max-w-sm mx-auto flex flex-col items-center justify-center space-y-2">
                        <div className="p-2.5 border border-slate-200 bg-slate-50 rounded-xl text-slate-400">
                          <Users className="h-5 w-5 text-[#A05AFF]" />
                        </div>
                        <div className="space-y-0.5">
                          <h4 className="text-sm font-bold text-slate-700">No candidates logged yet</h4>
                          <p className="text-xs text-slate-400 font-medium max-w-xs mx-auto">
                            Your core candidate roster database pipeline appears blank. Add your first record to begin tracking.
                          </p>
                        </div>
                        <Button size="sm" asChild className="rounded-md bg-slate-900 text-white font-semibold px-4 h-8 text-xs">
                          <Link to="/candidates/new">Create Record</Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  data?.recentCandidates?.map((c) => (
                    <TableRow key={c._id} className="hover:bg-slate-50/50 transition-all border-b border-slate-100 last:border-none">
                      <TableCell className="pl-6 font-bold text-slate-800 text-sm">
                        <Link 
                          to={`/candidates/${c._id}`} 
                          className="inline-block text-slate-800 hover:text-[#A05AFF] transition-colors tracking-tight focus:outline-none hover:underline underline-offset-4"
                        >
                          {c.fullName}
                        </Link>
                      </TableCell>
                      <TableCell className="text-slate-600 font-semibold text-sm">
                        {c.position || <span className="text-slate-300 font-normal">—</span>}
                      </TableCell>
                      <TableCell className="align-middle">
                        {c.source ? (
                          <span className="inline-block border border-[#A05AFF]/30 bg-[#A05AFF]/5 text-[#A05AFF] font-semibold rounded-md px-2 py-0.5 text-xs">
                            {c.source.replace(/_/g, ' ')}
                          </span>
                        ) : (
                          <span className="inline-block border border-slate-200 bg-slate-50 text-slate-400 text-xs font-medium rounded-md px-2 py-0.5">
                            System Pool
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-slate-500 font-medium text-xs pr-6">
                        {formatDate(c.createdAt)}
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