import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, Power, Pencil, School, Mail, Phone, ShieldCheck, Calendar, Filter, Sparkles, AlertCircle, Loader2 } from 'lucide-react';
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
  DialogFooter,
} from '@/components/ui/dialog';
import { formatDate } from '@/lib/utils';
import { LocationSelect } from '@/components/common/LocationSelect';

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
  const [location, setLocation] = useState({});

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
    setLocation({
      stateId: school.stateId || '',
      cityId: school.cityId || '',
      area: school.area || '',
      address: school.address || '',
      latitude: school.latitude ?? '',
      longitude: school.longitude ?? '',
      workingRadius: school.workingRadius ?? '',
    });
    setDialogOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editSchool) {
      updateMutation.mutate({ id: editSchool._id, data: { ...form, ...location } });
    }
  };

  return (
    <div className="space-y-6 w-full antialiased text-slate-800 dark:text-white">
      
      {/* Page Header Panel */}
      <div className="border-b border-slate-200/60 pb-5 dark:border-slate-800">
        <PageHeader
          title="Schools Management"
          description="Oversee partner institutions, audit infrastructure profiles, and tweak systematic licensing hierarchies."
        />
      </div>

      {/* Filter Toolbar Section - Flat Container Layout */}
      <Card className="filter">
        <CardContent className="flex flex-col sm:flex-row gap-6 p-4">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Filter institutions by key title metadata..."
              className="pl-10 h-11 border-slate-200 rounded-xl dark:bg-slate-800 dark:border-slate-700 text-sm"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <div className="flex items-center gap-2">
            <Select value={status || 'all'} onValueChange={(v) => { setStatus(v === 'all' ? '' : v); setPage(1); }}>
              <SelectTrigger className="w-full sm:w-44 h-11 border-slate-200 rounded-xl dark:bg-slate-800 dark:border-slate-700 text-sm font-medium">
                <div className="flex items-center gap-2">
                  <Filter className="h-3.5 w-3.5 text-slate-400" />
                  <SelectValue placeholder="Filter Status" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-xl dark:bg-slate-800">
                <SelectItem value="all" className="font-medium rounded-lg">All Statuses</SelectItem>
                <SelectItem value="active" className="font-medium rounded-lg text-emerald-600">Active Only</SelectItem>
                <SelectItem value="inactive" className="font-medium rounded-lg text-rose-600">Inactive Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Core Operational Matrix Presentation Grid Card Layer Constraint */}
      <Card className="table">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="py-24 text-center">
              <div className="flex flex-col items-center justify-center space-y-3">
                <Loader2 className="h-5 w-5 text-indigo-600 animate-spin" />
                <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 tracking-wide animate-pulse">Syncing Workspace Nodes...</span>
              </div>
            </div>
          ) : !data?.data || data.data.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center max-w-md mx-auto">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-950 border border-dashed border-slate-200 dark:border-slate-800 text-slate-400 mb-4">
                <AlertCircle className="h-5 w-5 stroke-[1.5]" />
              </div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 tracking-wide">No Matching Records</h4>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5 leading-relaxed">
                We couldn't track down school parameters matching your search tags. Tweak parameters or check connectivity state feeds.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-6 font-bold text-[11px] uppercase tracking-wider text-slate-700 dark:text-slate-300 py-4">School Name</TableHead>
                    <TableHead className="font-bold text-[11px] uppercase tracking-wider text-slate-700 dark:text-slate-300 py-4">Email Contact</TableHead>
                    <TableHead className="font-bold text-[11px] uppercase tracking-wider text-slate-700 dark:text-slate-300 py-4">Plan Tier</TableHead>
                    <TableHead className="font-bold text-[11px] uppercase tracking-wider text-slate-700 dark:text-slate-300 py-4">Billing Status</TableHead>
                    <TableHead className="font-bold text-[11px] uppercase tracking-wider text-slate-700 dark:text-slate-300 py-4">State</TableHead>
                    <TableHead className="font-bold text-[11px] uppercase tracking-wider text-slate-700 dark:text-slate-300 py-4">Expiry Cycle</TableHead>
                    <TableHead className="pr-6 text-right font-bold text-[11px] uppercase tracking-wider text-slate-700 dark:text-slate-300 py-4">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.data.map((school) => (
                    <TableRow 
                      key={school._id} 
                      className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all border-b border-slate-100/80 dark:border-slate-800/60 last:border-none"
                    >
                      {/* Name Meta Field with Secondary Brand Accent Tint Avatar */}
                      <TableCell className="pl-6 py-4 font-bold text-slate-800 dark:text-slate-200 text-sm tracking-tight">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-600 text-xs transition-colors">
                            <School className="h-4 w-4" />
                          </div>
                          <span className="truncate max-w-[180px] sm:max-w-[240px] tracking-tight">{school.schoolName}</span>
                        </div>
                      </TableCell>

                      {/* Email Param */}
                      <TableCell className="py-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <Mail className="h-3.5 w-3.5 text-slate-400" />
                          <span>{school.email}</span>
                        </div>
                      </TableCell>

                      {/* Modern Soft-Tint Default Brand Badge */}
                      <TableCell className="py-4">
                        <Badge 
                          variant="outline" 
                          className="text-[11px] font-bold px-2.5 py-0.5 rounded-lg border-purple-200/60 bg-purple-50/80 text-purple-700 shadow-none"
                        >
                          {school.subscriptionPlan}
                        </Badge>
                      </TableCell>

                      {/* Modern Soft-Tint Info State Badge */}
                      <TableCell className="py-4">
                        <Badge 
                          className={`text-xs font-bold px-2.5 py-0.5 rounded-lg border shadow-none text-[11px] tracking-wide uppercase ${
                            school.subscriptionStatus === 'active' 
                              ? 'border-cyan-200/60 bg-cyan-50/80 text-cyan-700' 
                              : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-500'
                          }`}
                        >
                          {school.subscriptionStatus}
                        </Badge>
                      </TableCell>

                      {/* System Infrastructure Activity Success/Danger Soft-Tint Badge */}
                      <TableCell className="py-4">
                        {school.isActive ? (
                          <Badge className="border-emerald-200/60 bg-emerald-50/80 text-emerald-700 text-xs font-semibold px-2.5 py-0.5 rounded-lg shadow-none tracking-wide">
                            <span className="h-1.5 w-1.5 rounded-full mr-1.5 inline-block bg-emerald-500" />
                            Active
                          </Badge>
                        ) : (
                          <Badge className="border-rose-200/60 bg-rose-50/80 text-rose-700 text-xs font-semibold px-2.5 py-0.5 rounded-lg shadow-none tracking-wide">
                            <span className="h-1.5 w-1.5 rounded-full mr-1.5 inline-block bg-rose-500" />
                            Inactive
                          </Badge>
                        )}
                      </TableCell>

                      {/* Date Field Tracker */}
                      <TableCell className="py-4 text-xs text-slate-500 dark:text-slate-400 font-semibold whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 px-2.5 py-1 rounded-lg bg-slate-50/50 dark:bg-slate-950/20">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" />
                          <span>{formatDate(school.expiryDate)}</span>
                        </div>
                      </TableCell>

                      {/* Action Matrix Controls */}
                      <TableCell className="pr-6 py-4 text-right">
                        <div className="inline-flex items-center justify-end gap-1">
                          <Button 
                            variant="edit" 
                            size="icon" 
                            onClick={() => openEdit(school)}
                            className="h-8 w-8"
                            title="Edit Parameters"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="delete"
                            size="icon"
                            onClick={() => toggleMutation.mutate(school._id)}
                            disabled={toggleMutation.isPending}
                            className="h-8 w-8"
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
        <DialogContent className="max-w-2xl rounded-xl border border-slate-200/60 bg-white p-6 dark:bg-slate-900 shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold tracking-wide text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-purple-600" />
              <span>Override Partner Configuration</span>
            </DialogTitle>
          </DialogHeader>
          <DialogBody className="pt-4">
            <form id="school-mgmt-form" onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* School Title Form Node */}
                <div className="space-y-1.5">
                  <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">School Title Corporate Name *</Label>
                  <Input
                    value={form.schoolName}
                    onChange={(e) => setForm({ ...form, schoolName: e.target.value })}
                    placeholder="Enter official institutional title..."
                    className="h-11 border-slate-200 rounded-xl dark:bg-slate-800 dark:border-slate-700 text-sm"
                    required
                  />
                </div>
                
                {/* Disabled Email Form Node */}
                <div className="space-y-1.5">
                  <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Protected Routing Email Address *</Label>
                  <div className="relative group">
                    <Input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="pl-10 h-11 border-slate-200 rounded-xl dark:bg-slate-950 dark:border-slate-800 cursor-not-allowed opacity-60 text-sm"
                      required
                      disabled
                    />
                    <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                  </div>
                </div>
                
                {/* Phone Form Node */}
                <div className="space-y-1.5">
                  <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Mobile Telecom Dial Line</Label>
                  <div className="relative group">
                    <Input 
                      value={form.phone} 
                      onChange={(e) => setForm({ ...form, phone: e.target.value })} 
                      placeholder="+1 (555) 000-0000"
                      className="pl-10 h-11 border-slate-200 rounded-xl dark:bg-slate-800 dark:border-slate-700 text-sm"
                    />
                    <Phone className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400 group-focus-within:text-purple-600 transition-colors" />
                  </div>
                </div>
                
                {/* Subscription Selector Form Node */}
                <div className="space-y-1.5">
                  <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Assigned Licensing Plan Bundle</Label>
                  <Select value={form.subscriptionPlan} onValueChange={(v) => setForm({ ...form, subscriptionPlan: v })}>
                    <SelectTrigger className="h-11 border-slate-200 rounded-xl dark:bg-slate-800 dark:border-slate-700 text-sm">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-purple-600" />
                        <SelectValue />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="rounded-xl dark:bg-slate-800">
                      <SelectItem value="basic" className="rounded-lg">Basic Tier</SelectItem>
                      <SelectItem value="standard" className="rounded-lg">Standard Tier</SelectItem>
                      <SelectItem value="premium" className="rounded-lg">Premium Suite</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Subscription Status Form Node */}
                <div className="space-y-1.5">
                  <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Current Billing Status Track</Label>
                  <Select value={form.subscriptionStatus} onValueChange={(v) => setForm({ ...form, subscriptionStatus: v })}>
                    <SelectTrigger className="h-11 border-slate-200 rounded-xl dark:bg-slate-800 dark:border-slate-700 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl dark:bg-slate-800">
                      <SelectItem value="trial" className="rounded-lg text-amber-600">Evaluation Trial</SelectItem>
                      <SelectItem value="active" className="rounded-lg text-emerald-600">Active Pipeline</SelectItem>
                      <SelectItem value="expired" className="rounded-lg text-rose-600">Expired Cycle</SelectItem>
                      <SelectItem value="cancelled" className="rounded-lg text-slate-400">Terminated / Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Start Date Form Node */}
                <div className="space-y-1.5">
                  <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Lifecycle Activation Start Date</Label>
                  <Input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="h-11 border-slate-200 rounded-xl dark:bg-slate-800 dark:border-slate-700 text-sm" />
                </div>
                
                {/* Expiry Date Form Node */}
                <div className="space-y-1.5 md:col-span-2">
                  <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">License Termination Expiry Date</Label>
                  <Input type="date" value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} className="h-11 border-slate-200 rounded-xl dark:bg-slate-800 dark:border-slate-700 text-sm" />
                </div>

                <div className="md:col-span-2">
                  <LocationSelect value={location} onChange={setLocation} />
                </div>
                
              </div>
            </form>
          </DialogBody>
          <DialogFooter className="mt-6 flex gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setDialogOpen(false)}
              className="rounded-xl h-11 px-5 font-medium border-slate-200 text-slate-700 dark:border-slate-700 dark:text-slate-300"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="school-mgmt-form"
              disabled={updateMutation.isPending}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl h-11 px-6 transition-all duration-200"
            >
              {updateMutation.isPending ? 'Committing Modifications...' : 'Apply Modifications'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}