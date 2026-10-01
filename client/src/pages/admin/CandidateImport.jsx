import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { 
  Upload, Download, FileSpreadsheet, CheckCircle, XCircle, 
  AlertCircle, Sparkles, UserPlus, Info, FileCheck, ArrowRight, 
  Loader2, CheckCircle2, UserCheck, Briefcase
} from 'lucide-react';
import { importSingleCandidate, importBulkCandidates, getPositions } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LocationSelect } from '@/components/common/LocationSelect';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const POSITION_TEMPLATES = {
  Teacher: ['Name', 'Mobile', 'Email', 'State', 'City', 'Area', 'Subjects', 'Classes', 'Qualification', 'Experience', 'ExpectedSalary'],
  Driver: ['Name', 'Mobile', 'Email', 'State', 'City', 'Area', 'VehicleTypes', 'Experience', 'ExpectedSalary'],
  Accountant: ['Name', 'Mobile', 'Email', 'State', 'City', 'Area', 'TallyKnowledge', 'GSTKnowledge', 'Experience', 'ExpectedSalary'],
  Receptionist: ['Name', 'Mobile', 'Email', 'State', 'City', 'Area', 'LanguagesKnown', 'Experience', 'ExpectedSalary'],
  Clerk: ['Name', 'Mobile', 'Email', 'State', 'City', 'Area', 'TypingSpeed', 'Experience', 'ExpectedSalary'],
  Librarian: ['Name', 'Mobile', 'Email', 'State', 'City', 'Area', 'LibraryManagementExperience', 'Experience', 'ExpectedSalary'],
  'Lab Assistant': ['Name', 'Mobile', 'Email', 'State', 'City', 'Area', 'LabType', 'LabExperience', 'Experience', 'ExpectedSalary'],
  'Sports Coach': ['Name', 'Mobile', 'Email', 'State', 'City', 'Area', 'SportsSpecialization', 'CoachingCertificates', 'CoachingExperience', 'Experience', 'ExpectedSalary'],
  'Security Guard': ['Name', 'Mobile', 'Email', 'State', 'City', 'Area', 'SecurityExperience', 'ExArmy', 'NightShiftAvailable', 'Experience', 'ExpectedSalary'],
  Cleaner: ['Name', 'Mobile', 'Email', 'State', 'City', 'Area', 'CleaningExperience', 'SchoolExperience', 'Experience', 'ExpectedSalary'],
};

function downloadTemplate(position) {
  const columns = POSITION_TEMPLATES[position] || ['Name', 'Mobile', 'Email', 'State', 'City', 'Area', 'Position', 'Experience', 'ExpectedSalary'];
  const csvContent = columns.join(',') + '\n';
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${position.replace(/\s+/g, '_')}_template.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
}

export default function CandidateImport() {
  const [location, setLocation] = useState({});
  const [form, setForm] = useState({
    fullName: '',
    mobile: '',
    email: '',
    position: '',
    experienceYears: 0,
    expectedSalary: '',
  });
  const [bulkResult, setBulkResult] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState('');
  const [importNotice, setImportNotice] = useState(null);

  const { data: positions = [] } = useQuery({
    queryKey: ['positions'],
    queryFn: () => getPositions().then((r) => r.data.data),
  });

  const singleMutation = useMutation({
    mutationFn: importSingleCandidate,
    onSuccess: () => {
      setForm({ fullName: '', mobile: '', email: '', position: '', experienceYears: 0, expectedSalary: '' });
      setLocation({});
      setImportNotice({ type: 'success', message: 'Candidate successfully imported into the central talent pool!' });
      setTimeout(() => setImportNotice(null), 5000);
    },
    onError: (err) => {
      setImportNotice({ type: 'error', message: err.response?.data?.message || 'Failed to import candidate profile.' });
    },
  });

  const bulkMutation = useMutation({
    mutationFn: (file) => {
      const formData = new FormData();
      formData.append('file', file);
      if (selectedPosition) formData.append('position', selectedPosition);
      return importBulkCandidates(formData);
    },
    onSuccess: (res) => {
      setBulkResult(res.data.data);
      setImportNotice({ type: 'success', message: `Bulk import completed! Ingested ${res.data.data?.imported || 0} candidates successfully.` });
    },
    onError: (err) => {
      setImportNotice({ type: 'error', message: err.response?.data?.message || 'Bulk import failed. Please check spreadsheet headers and file formatting.' });
    },
  });

  const handleBulkUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!selectedPosition) {
        setImportNotice({ type: 'error', message: 'Please select a target position role before uploading CSV file.' });
        return;
      }
      setImportNotice(null);
      bulkMutation.mutate(file);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-5 w-full antialiased text-slate-800 dark:text-slate-100 pb-16">
      
      {/* ─── 1. TOP HEADER BANNER ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-[#F0FCF5] via-[#EFF6FF] to-[#FAF5FF] dark:from-slate-800/90 dark:via-slate-800/70 dark:to-slate-800/90 p-3.5 sm:px-5 sm:py-3.5 rounded-2xl shadow-2xs border border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2.5 bg-white dark:bg-slate-700 text-[#3A86FF] rounded-xl border border-slate-200/80 shadow-2xs shrink-0">
            <Upload className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-sm sm:text-base font-extrabold tracking-tight text-slate-900 dark:text-white truncate">
                Candidate Import & Central Pool Influx
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 text-[#3A86FF] dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200/60 shrink-0">
                Single & Bulk CSV
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate mt-0.5">
              Add individual job-seekers or upload structured CSV spreadsheets into the platform talent pool
            </p>
          </div>
        </div>
      </div>

      {/* Notice Alert */}
      {importNotice && (
        <div
          className={cn(
            'flex items-center justify-between gap-3 p-3.5 rounded-2xl border text-xs font-semibold animate-in fade-in duration-200',
            importNotice.type === 'success'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300'
              : 'border-rose-200 bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-300'
          )}
        >
          <div className="flex items-center gap-2">
            {importNotice.type === 'success' ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <AlertCircle className="h-4 w-4 text-rose-600" />}
            <span>{importNotice.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setImportNotice(null)}
            className="font-bold opacity-70 hover:opacity-100 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* ─── 2. TABS: SINGLE VS BULK ─── */}
      <Tabs defaultValue="single" className="w-full space-y-4">
        <TabsList className="inline-flex h-11 items-center justify-start rounded-xl bg-white dark:bg-slate-900 p-1 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <TabsTrigger 
            value="single" 
            className="inline-flex items-center gap-2 rounded-lg px-4 py-1.5 text-xs font-bold tracking-wide transition-all data-[state=active]:bg-purple-50 data-[state=active]:text-[#8A3BD4] cursor-pointer"
          >
            <UserPlus className="h-3.5 w-3.5" />
            Single Profile Ingest
          </TabsTrigger>
          <TabsTrigger 
            value="bulk" 
            className="inline-flex items-center gap-2 rounded-lg px-4 py-1.5 text-xs font-bold tracking-wide transition-all data-[state=active]:bg-purple-50 data-[state=active]:text-[#8A3BD4] cursor-pointer"
          >
            <FileSpreadsheet className="h-3.5 w-3.5" />
            Bulk CSV Spreadsheets
          </TabsTrigger>
        </TabsList>

        {/* ─── SINGLE INGEST TAB ─── */}
        <TabsContent value="single" className="space-y-4">
          <Card className="border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs rounded-2xl overflow-hidden">
            <CardHeader className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
              <CardTitle className="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#8A3BD4]" />
                <span>Add Candidate Profile Manually</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  singleMutation.mutate({
                    ...form,
                    experienceYears: Number(form.experienceYears),
                    expectedSalary: form.expectedSalary ? Number(form.expectedSalary) : undefined,
                    stateId: location.stateId,
                    cityId: location.cityId,
                    area: location.area,
                    address: location.address,
                    latitude: location.latitude,
                    longitude: location.longitude,
                    workingRadius: location.workingRadius,
                  });
                }}
                className="space-y-5"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Candidate Full Name *</Label>
                    <Input 
                      value={form.fullName} 
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })} 
                      required 
                      placeholder="e.g. Ramesh Sharma"
                      className="h-10 border-slate-200 rounded-xl text-xs sm:text-sm font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Mobile Number *</Label>
                    <Input 
                      value={form.mobile} 
                      onChange={(e) => setForm({ ...form, mobile: e.target.value })} 
                      required 
                      placeholder="+91 98765 43210"
                      className="h-10 border-slate-200 rounded-xl text-xs sm:text-sm font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Email Address</Label>
                    <Input 
                      value={form.email} 
                      onChange={(e) => setForm({ ...form, email: e.target.value })} 
                      type="email"
                      placeholder="candidate@example.com"
                      className="h-10 border-slate-200 rounded-xl text-xs sm:text-sm font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Target Position Role *</Label>
                    <Select value={form.position} onValueChange={(v) => setForm({ ...form, position: v })} required>
                      <SelectTrigger className="h-10 border-slate-200 rounded-xl text-xs sm:text-sm font-semibold">
                        <SelectValue placeholder="Select target role" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl dark:bg-slate-800">
                        {positions.map((p) => {
                          const pName = typeof p === 'object' ? p.name : p;
                          return (
                            <SelectItem key={pName} value={pName} className="text-xs font-semibold">
                              {pName}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Experience (Years)</Label>
                    <Input
                      type="number"
                      value={form.experienceYears}
                      onChange={(e) => setForm({ ...form, experienceYears: e.target.value })}
                      placeholder="0"
                      min="0"
                      className="h-10 border-slate-200 rounded-xl text-xs sm:text-sm font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Expected Salary (₹ Annual)</Label>
                    <Input
                      type="number"
                      value={form.expectedSalary}
                      onChange={(e) => setForm({ ...form, expectedSalary: e.target.value })}
                      placeholder="e.g. 350000"
                      className="h-10 border-slate-200 rounded-xl text-xs sm:text-sm font-medium"
                    />
                  </div>

                  <div className="md:col-span-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <LocationSelect value={location} onChange={setLocation} />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={singleMutation.isPending}
                  className="bg-gradient-to-r from-[#7C3AED] via-[#8A3BD4] to-[#00D2FF] hover:from-[#6D28D9] hover:via-[#7E22CE] hover:to-[#0284C7] text-white font-bold h-10 px-6 rounded-xl text-xs shadow-sm cursor-pointer flex items-center gap-2"
                >
                  {singleMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Importing Candidate...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      Import Candidate Profile
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── BULK CSV TAB ─── */}
        <TabsContent value="bulk" className="space-y-4">
          <Card className="border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs rounded-2xl overflow-hidden">
            <CardHeader className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
              <CardTitle className="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <FileSpreadsheet className="h-4 w-4 text-[#8A3BD4]" />
                <span>Bulk Spreadsheet Import (CSV / Excel)</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 space-y-5">
              
              {/* Position Selector & Download Template */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end rounded-2xl p-4 sm:p-5 bg-slate-50/70 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Select Target Position *</Label>
                  <Select value={selectedPosition} onValueChange={setSelectedPosition}>
                    <SelectTrigger className="h-10 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-semibold">
                      <SelectValue placeholder="Choose Role for CSV Layout" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl dark:bg-slate-800">
                      {positions.map((p) => {
                        const pName = typeof p === 'object' ? p.name : p;
                        return (
                          <SelectItem key={pName} value={pName} className="text-xs font-semibold">
                            {pName}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
                
                {selectedPosition ? (
                  <Button
                    variant="outline"
                    onClick={() => downloadTemplate(selectedPosition)}
                    className="h-10 rounded-xl border-purple-200/80 bg-purple-50 text-[#8A3BD4] font-bold hover:bg-purple-100 text-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Download {selectedPosition} CSV Template
                  </Button>
                ) : (
                  <div className="flex h-10 items-center gap-2 rounded-xl border border-dashed border-slate-200 px-3 text-xs text-slate-400 bg-white dark:bg-slate-800 italic">
                    <Info className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    Pick a position first to unlock template download
                  </div>
                )}
              </div>

              {/* Column Architecture Guidelines */}
              {selectedPosition && (
                <div className="rounded-2xl border border-slate-100 dark:border-slate-800 p-4 bg-purple-50/30 dark:bg-purple-950/20">
                  <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                    <FileCheck className="h-4 w-4 text-[#8A3BD4]" />
                    Required Column Headers
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {POSITION_TEMPLATES[selectedPosition]?.map((col) => (
                      <span 
                        key={col} 
                        className="px-2.5 py-0.5 border border-purple-200 bg-purple-50 text-[#8A3BD4] dark:bg-purple-950/50 dark:text-purple-300 font-bold text-[11px] rounded-lg"
                      >
                        {col}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Dropzone */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Upload Spreadsheet Ledger</Label>
                <div className={cn(
                  "relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition-all",
                  selectedPosition 
                    ? "border-purple-200 bg-white dark:bg-slate-900 hover:border-[#8A3BD4] hover:bg-purple-50/30 cursor-pointer" 
                    : "border-slate-200 bg-slate-50/50 opacity-60 cursor-not-allowed"
                )}>
                  <Input
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleBulkUpload}
                    disabled={!selectedPosition || bulkMutation.isPending}
                    className="absolute inset-0 opacity-0 z-10 h-full w-full cursor-pointer disabled:cursor-not-allowed"
                  />
                  <div className="h-12 w-12 rounded-2xl bg-purple-50 dark:bg-purple-950/50 text-[#8A3BD4] flex items-center justify-center mb-2">
                    <Upload className="h-6 w-6" />
                  </div>
                  <p className="text-sm font-bold text-slate-800 dark:text-white">Click or drag & drop candidate spreadsheet here</p>
                  <p className="text-xs text-slate-400 mt-0.5">Supports standard CSV or Excel files</p>
                </div>
              </div>

              {/* Processing Spinner */}
              {bulkMutation.isPending && (
                <div className="flex items-center gap-2.5 p-3.5 rounded-xl border border-cyan-200 bg-cyan-50 text-cyan-800 text-xs font-bold">
                  <Loader2 className="h-4 w-4 animate-spin text-cyan-600" />
                  <span>Processing and parsing candidate rows...</span>
                </div>
              )}

              {/* Bulk Results Scoreboard */}
              {bulkResult && (
                <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 p-4 sm:p-5 space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-white dark:bg-slate-900 p-3 rounded-xl text-center border border-slate-100 dark:border-slate-800">
                      <p className="text-xl font-black text-slate-800 dark:text-white">{bulkResult.totalRows}</p>
                      <p className="text-[10px] font-bold uppercase text-slate-400 mt-0.5">Total Rows</p>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-3 rounded-xl text-center border border-slate-100 dark:border-slate-800">
                      <p className="text-xl font-black text-emerald-600">{bulkResult.validRows}</p>
                      <p className="text-[10px] font-bold uppercase text-slate-400 mt-0.5">Valid</p>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-3 rounded-xl text-center border border-slate-100 dark:border-slate-800">
                      <p className="text-xl font-black text-rose-600">{bulkResult.invalidRows}</p>
                      <p className="text-[10px] font-bold uppercase text-slate-400 mt-0.5">Warnings</p>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-3 rounded-xl text-center border border-slate-100 dark:border-slate-800">
                      <p className="text-xl font-black text-[#8A3BD4]">{bulkResult.imported}</p>
                      <p className="text-[10px] font-bold uppercase text-slate-400 mt-0.5">Ingested</p>
                    </div>
                  </div>

                  {bulkResult.imported > 0 && (
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                      <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>Successfully added {bulkResult.imported} candidate profiles to the system!</span>
                    </div>
                  )}

                  {bulkResult.errors?.length > 0 && (
                    <div className="space-y-1.5">
                      <h5 className="text-xs font-bold text-rose-600">Row Errors ({bulkResult.errors.length})</h5>
                      <div className="max-h-40 overflow-y-auto space-y-1 text-xs">
                        {bulkResult.errors.map((err, i) => (
                          <div key={i} className="p-2 rounded-lg bg-rose-50 border border-rose-100 text-rose-800">
                            <span className="font-bold">Row {err.row}: </span>{err.message}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

    </div>
  );
}