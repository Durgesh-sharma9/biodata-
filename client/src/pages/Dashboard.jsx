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
      <div className="flex h-[70vh] flex-col items-center justify-center space-y-4 antialiased">
        <div className="relative flex items-center justify-center">
          <Loader2 className="h-12 w-12 text-indigo-600 animate-spin relative z-10" />
          <div className="absolute inset-0 bg-indigo-500/10 rounded-full blur-xl animate-pulse scale-150" />
        </div>
        <p className="text-slate-500 font-bold tracking-wide text-sm animate-pulse">
          Assembling recruitment control center...
        </p>
      </div>
    );
  }

  // Sourcing helper for colorful badges in table rows
  const getDynamicSourceBadge = (source) => {
    if (!source) return <Badge variant="outline" className="text-xs rounded-full font-medium text-slate-400 border-slate-200">System Pool</Badge>;
    const cleanStr = source.replace(/_/g, ' ');
    switch(source.toUpperCase()) {
      case 'ADMIN':
        return <Badge className="bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 border-blue-200/50 rounded-full font-medium px-2.5 py-0.5 transition-colors">{cleanStr}</Badge>;
      case 'SCHOOL_LINK':
        return <Badge className="bg-purple-500/10 text-purple-600 hover:bg-purple-500/20 border-purple-200/50 rounded-full font-medium px-2.5 py-0.5 transition-colors">{cleanStr}</Badge>;
      case 'SELF_APPLICANT':
        return <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-200/50 rounded-full font-medium px-2.5 py-0.5 transition-colors">{cleanStr}</Badge>;
      default:
        return <Badge className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 border-amber-200/50 rounded-full font-medium px-2.5 py-0.5 transition-colors">{cleanStr}</Badge>;
    }
  };

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto p-4 md:p-6 lg:p-8 antialiased text-slate-800">
      
      {/* Premium Hero Title Box */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 md:p-8 shadow-xl border border-slate-800/40 group">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-gradient-to-br from-indigo-500/10 to-purple-500/0 rounded-full blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-1000" />
        <div className="absolute -bottom-8 left-1/4 w-64 h-64 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold tracking-wide backdrop-blur-sm">
              <Sparkles className="h-3 w-3" /> Live Control Center
            </div>
            <h1 className="text-2xl md:text-4xl font-black tracking-tight text-white">
              HireHub Workspace
            </h1>
            <p className="text-sm md:text-base text-slate-300/90 leading-relaxed font-medium">
              Overview of your school recruitment network. Keep track of applicants, credits, and metrics.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Button asChild className="h-11 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold shadow-md shadow-indigo-600/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 border border-indigo-400/20 group/btn">
              <Link to="/candidates/new">
                <Plus className="mr-2 h-4 w-4 transition-transform duration-300 group-hover/btn:rotate-90" />
                Add Candidate
              </Link>
            </Button>
            <Button variant="outline" asChild className="h-11 rounded-xl border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-200 hover:text-white transition-all duration-300 hover:-translate-y-0.5 shadow-sm">
              <Link to="/talent-pool">
                <Search className="mr-2 h-4 w-4 text-cyan-400" />
                Browse Talent Pool
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Grid Matrix of Premium Colorful Statistics Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white via-slate-50/20 to-indigo-50/10 p-1 border border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-300 group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-full pointer-events-none" />
          <div className="absolute top-0 left-0 w-full h-1 bg-blue-500" />
          <StatCard title="My Candidates" value={data?.myCandidates || 0} icon={Users} className="border-0 bg-transparent shadow-none" />
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white via-slate-50/20 to-purple-50/10 p-1 border border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-300 group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-bl-full pointer-events-none" />
          <div className="absolute top-0 left-0 w-full h-1 bg-purple-500" />
          <StatCard title="Talent Pool" value={data?.talentPoolCount || 0} icon={List} className="border-0 bg-transparent shadow-none" />
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white via-slate-50/20 to-cyan-50/10 p-1 border border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-300 group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-bl-full pointer-events-none" />
          <div className="absolute top-0 left-0 w-full h-1 bg-cyan-50" />
          <StatCard title="Owned Candidates" value={data?.ownedCandidates || 0} icon={Users} className="border-0 bg-transparent shadow-none" />
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white via-slate-50/20 to-amber-50/10 p-1 border border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-300 group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-bl-full pointer-events-none" />
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-orange-500" />
          <StatCard title="Available Credits" value={data?.availableCredits || 0} icon={Coins} className="border-0 bg-transparent shadow-none" />
        </div>
      </div>

      {/* Main Recent Activity Datagrid Card */}
      <Card className="border-slate-200/70 shadow-md shadow-slate-100/50 rounded-2xl bg-white overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between p-6 border-b border-slate-50 bg-slate-50/40">
          <div className="space-y-0.5">
            <CardTitle className="text-lg font-bold tracking-tight text-slate-800">
              Recent My Candidates
            </CardTitle>
            <p className="text-xs text-slate-400 font-medium">Your platform's latest added pipeline interactions</p>
          </div>
          <Button variant="ghost" asChild className="h-9 text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50/80 rounded-xl transition-all group/link px-3">
            <Link to="/my-candidates" className="flex items-center gap-1">
              View all <ArrowRight className="h-3.5 w-3.5 group-hover/link:translate-x-0.5 transition-transform" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="w-full overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/30 border-b border-slate-100">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-slate-500 font-bold text-xs uppercase tracking-wider pl-6">
                    <span className="flex items-center gap-1.5"><Users className="h-3 w-3 text-slate-400" /> Candidate Name</span>
                  </TableHead>
                  <TableHead className="text-slate-500 font-bold text-xs uppercase tracking-wider">
                    <span className="flex items-center gap-1.5"><Briefcase className="h-3 w-3 text-slate-400" /> Position</span>
                  </TableHead>
                  <TableHead className="text-slate-500 font-bold text-xs uppercase tracking-wider">
                    <span className="flex items-center gap-1.5"><Layers className="h-3 w-3 text-slate-400" /> Sourcing Channel</span>
                  </TableHead>
                  <TableHead className="text-slate-500 font-bold text-xs uppercase tracking-wider pr-6">
                    <span className="flex items-center gap-1.5"><Calendar className="h-3 w-3 text-slate-400" /> Date Added</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-slate-100/80">
                {data?.recentCandidates?.length === 0 ? (
                  /* Premium Empty State Structure Layout */
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={4} className="py-20 text-center">
                      <div className="max-w-md mx-auto flex flex-col items-center justify-center space-y-4">
                        <div className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200/50 rounded-2xl shadow-inner text-slate-400">
                          <Users className="h-8 w-8 text-indigo-400" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-base font-bold text-slate-700">No candidates logged yet</h4>
                          <p className="text-xs text-slate-400 font-medium max-w-xs mx-auto">
                            Your core candidate roster database pipeline appears blank. Add your first record to begin tracking.
                          </p>
                        </div>
                        <Button size="sm" asChild className="rounded-xl bg-slate-900 text-white font-semibold px-4 h-9">
                          <Link to="/candidates/new">Create Record</Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  data?.recentCandidates?.map((c) => (
                    <TableRow key={c._id} className="hover:bg-slate-50/50 transition-colors group/row">
                      <TableCell className="pl-6 font-semibold text-sm text-slate-700">
                        <Link 
                          to={`/candidates/${c._id}`} 
                          className="inline-block text-slate-700 group-hover/row:text-indigo-600 transition-colors tracking-tight focus:outline-none hover:underline underline-offset-4"
                        >
                          {c.fullName}
                        </Link>
                      </TableCell>
                      <TableCell className="text-slate-600 font-medium text-sm">
                        {c.position || <span className="text-slate-300 font-normal">—</span>}
                      </TableCell>
                      <TableCell className="align-middle">
                        {getDynamicSourceBadge(c.source)}
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