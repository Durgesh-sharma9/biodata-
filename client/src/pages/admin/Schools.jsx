import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, Power, Pencil, School, Mail, Phone, ShieldCheck, Calendar, Filter, Sparkles, AlertCircle } from 'lucide-react';
import { getSchools, toggleSchoolStatus, updateSchool } from '@/lib/api';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { formatDate } from '@/lib/utils';

const emptyForm = {
  schoolName: '',
  email: '',
  phone: '',
  subscriptionPlan: 'basic',
  subscriptionStatus: 'trial',
  startDate: '',
  expiryDate: '',
};

export default function Schools() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editSchool, setEditSchool] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const { data, isLoading } = useQuery({
    queryKey: ['schools', page, search, status],
    queryFn: () =>
      getSchools({
        page,
        limit: 10,
        search,
        status: status || undefined,
      }).then((r) => r.data),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateSchool(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schools'] });
      setDialogOpen(false);
      setEditSchool(null);
      setForm(emptyForm);
    },
  });

  const toggleMutation = useMutation({
    mutationFn: toggleSchoolStatus,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['schools'] }),
  });

  const openEdit = (school) => {
    setEditSchool(school);
    setForm({
      schoolName: school.schoolName,
      email: school.email,
      phone: school.phone || '',
      subscriptionPlan: school.subscriptionPlan,
      subscriptionStatus: school.subscriptionStatus,
      startDate: school.startDate ? school.startDate.split('T')[0] : '',
      expiryDate: school.expiryDate ? school.expiryDate.split('T')[0] : '',
    });
    setDialogOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editSchool) {
      updateMutation.mutate({ id: editSchool._id, data: form });
    }
  };

  return (
    <div className="space-y-8 p-4 md:p-8 max-w-7xl mx-auto antialiased text-foreground bg-background">
      
      {/* Premium Header Layout */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/60 bg-gradient-to-r from-slate-50 via-white to-slate-50/50 p-6 dark:from-slate-950 dark:via-background dark:to-slate-950/50 shadow-xs">
        <div className="absolute right-0 top-0 -mr-12 -mt-12 w-40 h-40 bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        <PageHeader
          title="Schools Management"
          description="Oversee partner institutions, audit infrastructure profiles, and tweak systematic licensing hierarchies."
        />
      </div>

      {/* Filter Toolbar Section */}
      <Card className="border border-slate-200/60 bg-background/60 shadow-xs backdrop-blur-md rounded-2xl overflow-hidden">
        <CardContent className="flex flex-col sm:flex-row gap-4 p-4 md:p-5">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground/70" />
            <Input
              placeholder="Filter institutions by key title metadata..."
              className="pl-10 h-11 rounded-xl focus-visible:ring-indigo-500 transition-all bg-background border-slate-200"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <div className="flex items-center gap-2">
            <Select value={status || 'all'} onValueChange={(v) => { setStatus(v === 'all' ? '' : v); setPage(1); }}>
              <SelectTrigger className="w-full sm:w-44 h-11 rounded-xl focus:ring-indigo-500 border-slate-200 bg-background font-medium text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <Filter className="h-3.5 w-3.5 text-muted-foreground/70" />
                  <SelectValue placeholder="Filter Status" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all" className="font-medium rounded-lg">All Statuses</SelectItem>
                <SelectItem value="active" className="font-medium rounded-lg text-emerald-600 dark:text-emerald-400">Active Only</SelectItem>
                <SelectItem value="inactive" className="font-medium rounded-lg text-rose-600 dark:text-rose-400">Inactive Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Core Operational Matrix Presentation Grid Card */}
      <Card className="border border-slate-200/60 bg-background shadow-xs rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-sm">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="py-24 text-center">
              <div className="flex flex-col items-center justify-center space-y-4 animate-pulse">
                <div className="h-10 w-10 rounded-xl border-4 border-indigo-500 border-t-transparent animate-spin shadow-sm" />
                <span className="text-xs font-bold text-muted-foreground/80 tracking-wider uppercase">Syncing Workspace Nodes...</span>
              </div>
            </div>
          ) : !data?.data || data.data.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center max-w-md mx-auto">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 text-muted-foreground/50 mb-4 shadow-3xs">
                <AlertCircle className="h-6 w-6 stroke-[1.5]" />
              </div>
              <h4 className="text-base font-black text-foreground tracking-tight">No Matching Records</h4>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                We couldn't track down school parameters matching your search tags. Tweak parameters or check connectivity state feeds.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto w-full">
              <Table>
                <TableHeader className="bg-slate-50/60 dark:bg-slate-900/40 border-b border-slate-200/60 dark:border-slate-800">
                  <TableRow>
                    <TableHead className="pl-6 sm:pl-8 font-bold text-xs tracking-wider uppercase text-muted-foreground/90 py-4">School Name</TableHead>
                    <TableHead className="font-bold text-xs tracking-wider uppercase text-muted-foreground/90 py-4">Email Contact</TableHead>
                    <TableHead className="font-bold text-xs tracking-wider uppercase text-muted-foreground/90 py-4">Plan Tier</TableHead>
                    <TableHead className="font-bold text-xs tracking-wider uppercase text-muted-foreground/90 py-4">Billing Status</TableHead>
                    <TableHead className="font-bold text-xs tracking-wider uppercase text-muted-foreground/90 py-4">State</TableHead>
                    <TableHead className="font-bold text-xs tracking-wider uppercase text-muted-foreground/90 py-4">Expiry Cycle</TableHead>
                    <TableHead className="pr-6 sm:pr-8 text-right font-bold text-xs tracking-wider uppercase text-muted-foreground/90 py-4">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.data.map((school) => (
                    <TableRow 
                      key={school._id} 
                      className="group hover:bg-slate-50/40 dark:hover:bg-slate-900/20 border-b border-slate-100 dark:border-slate-800/60 transition-colors last:border-none"
                    >
                      {/* Name Meta Field */}
                      <TableCell className="pl-6 sm:pl-8 py-4.5 font-bold text-slate-900 dark:text-slate-100 text-sm tracking-tight">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 text-xs font-black border border-indigo-100/40 dark:border-indigo-900/30 group-hover:bg-gradient-to-br group-hover:from-blue-600 group-hover:to-indigo-600 group-hover:text-white group-hover:scale-105 transition-all duration-200">
                            <School className="h-4 w-4" />
                          </div>
                          <span className="truncate max-w-[180px] sm:max-w-[240px] tracking-tight">{school.schoolName}</span>
                        </div>
                      </TableCell>

                      {/* Email Param */}
                      <TableCell className="py-4.5 text-xs font-medium text-muted-foreground/90">
                        <div className="flex items-center gap-1.5">
                          <Mail className="h-3.5 w-3.5 text-muted-foreground/50" />
                          <span>{school.email}</span>
                        </div>
                      </TableCell>

                      {/* Plan Configuration Badge */}
                      <TableCell className="py-4.5">
                        <Badge 
                          variant="outline" 
                          className="text-[11px] font-bold px-2.5 py-0.5 rounded-md border-indigo-100 bg-indigo-50/30 text-indigo-600 dark:border-indigo-950 dark:bg-indigo-950/20 dark:text-indigo-400 capitalize shadow-2xs"
                        >
                          {school.subscriptionPlan}
                        </Badge>
                      </TableCell>

                      {/* Subscription Processing State Badge */}
                      <TableCell className="py-4.5">
                        <Badge 
                          className={`text-xs font-bold px-2.5 py-0.5 rounded-md border tracking-wide uppercase text-[10px] shadow-3xs ${
                            school.subscriptionStatus === 'active' 
                              ? 'bg-blue-500/10 text-blue-600 border-blue-500/10 dark:bg-blue-500/20 dark:text-blue-400' 
                              : 'bg-orange-500/10 text-orange-600 border-orange-500/10 dark:bg-orange-500/20 dark:text-orange-400'
                          }`}
                        >
                          {school.subscriptionStatus}
                        </Badge>
                      </TableCell>

                      {/* System Infrastructure Activity State Flag */}
                      <TableCell className="py-4.5">
                        <Badge 
                          className={`text-xs font-bold px-2.5 py-0.5 rounded-full border tracking-wide ${
                            school.isActive 
                              ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:bg-emerald-500/20 dark:text-emerald-400' 
                              : 'bg-rose-500/10 text-rose-600 border-rose-500/20 dark:bg-rose-500/20 dark:text-rose-400'
                          }`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full mr-1.5 inline-block ${school.isActive ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                          {school.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>

                      {/* Date Format Parser String */}
                      <TableCell className="py-4.5 text-xs text-slate-500 font-semibold whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5 bg-slate-50/80 dark:bg-slate-900/40 px-2.5 py-1 rounded-lg border border-slate-100 dark:border-slate-800/40">
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground/60" />
                          <span>{formatDate(school.expiryDate)}</span>
                        </div>
                      </TableCell>

                      {/* Core Trigger Call Action Matrix Controls */}
                      <TableCell className="pr-6 sm:pr-8 py-4.5 text-right">
                        <div className="inline-flex items-center justify-end gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => openEdit(school)}
                            className="h-9 w-9 rounded-xl text-muted-foreground hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors"
                            title="Edit Parameters"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleMutation.mutate(school._id)}
                            disabled={toggleMutation.isPending}
                            className={`h-9 w-9 rounded-xl transition-colors ${
                              school.isActive 
                                ? 'text-muted-foreground hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40' 
                                : 'text-muted-foreground hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
                            }`}
                            title={school.isActive ? "Deactivate Node" : "Activate Node"}
                          >
                            <Power className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Polish Premium Configuration Form Dialog Overlay Node */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500" />
          <DialogHeader>
            <DialogTitle className="text-xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-indigo-500" />
              <span>Override Partner Configuration</span>
            </DialogTitle>
          </DialogHeader>
          <DialogBody>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-5 sm:grid-cols-2">
                
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">School Title Corporate Name *</Label>
                  <Input
                    value={form.schoolName}
                    onChange={(e) => setForm({ ...form, schoolName: e.target.value })}
                    placeholder="Enter official institutional title..."
                    className="rounded-xl focus-visible:ring-indigo-500 h-11 pl-4 transition-all"
                    required
                  />
                </div>
                
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Protected Routing Email Address *</Label>
                  <div className="relative">
                    <Input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="rounded-xl focus-visible:ring-indigo-500 h-11 pl-9 transition-all bg-slate-50 dark:bg-slate-900 cursor-not-allowed opacity-80"
                      required
                      disabled
                    />
                    <Mail className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground/50" />
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Mobile Telecom Dial Line</Label>
                  <div className="relative">
                    <Input 
                      value={form.phone} 
                      onChange={(e) => setForm({ ...form, phone: e.target.value })} 
                      placeholder="+1 (555) 000-0000"
                      className="rounded-xl focus-visible:ring-indigo-500 h-11 pl-9 transition-all"
                    />
                    <Phone className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground/50" />
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Assigned Licensing Plan Bundle</Label>
                  <Select value={form.subscriptionPlan} onValueChange={(v) => setForm({ ...form, subscriptionPlan: v })}>
                    <SelectTrigger className="rounded-xl h-11 focus:ring-indigo-500 border-slate-200">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-indigo-500" />
                        <SelectValue />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="basic" className="rounded-lg">Basic Tier</SelectItem>
                      <SelectItem value="standard" className="rounded-lg">Standard Tier</SelectItem>
                      <SelectItem value="premium" className="rounded-lg">Premium Suite</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Current Billing Status Track</Label>
                  <Select value={form.subscriptionStatus} onValueChange={(v) => setForm({ ...form, subscriptionStatus: v })}>
                    <SelectTrigger className="rounded-xl h-11 focus:ring-indigo-500 border-slate-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="trial" className="rounded-lg text-orange-600">Evaluation Trial</SelectItem>
                      <SelectItem value="active" className="rounded-lg text-emerald-600">Active Pipeline</SelectItem>
                      <SelectItem value="expired" className="rounded-lg text-rose-600">Expired Cycle</SelectItem>
                      <SelectItem value="cancelled" className="rounded-lg text-slate-500">Terminated / Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Lifecycle Activation Start Date</Label>
                  <Input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="rounded-xl h-11 focus-visible:ring-indigo-500" />
                </div>
                
                <div className="space-y-1.5 sm:col-span-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">License Termination Expiry Date</Label>
                  <Input type="date" value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} className="rounded-xl h-11 focus-visible:ring-indigo-500" />
                </div>
                
              </div>

              {/* Action Sheet Row */}
              <div className="flex justify-end gap-3.5 pt-4 border-t border-slate-100 dark:border-slate-800">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setDialogOpen(false)}
                  className="rounded-xl h-11 px-5 font-semibold transition-all"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl h-11 px-6 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  {updateMutation.isPending ? 'Committing Modifications...' : 'Apply Modifications'}
                </Button>
              </div>
            </form>
          </DialogBody>
        </DialogContent>
      </Dialog>
    </div>
  );
}