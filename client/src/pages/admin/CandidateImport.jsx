import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Upload, Download, FileSpreadsheet, CheckCircle, XCircle, AlertCircle, Sparkles, UserPlus, Info, FileCheck, ArrowRight, Loader2 } from 'lucide-react';
import { importSingleCandidate, importBulkCandidates, getPositions } from '@/lib/api';
import { PageHeader } from '@/components/common/PageHeader';
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
  Teacher: ['Name', 'Mobile', 'Email', 'State', 'City', 'Locality', 'Subjects', 'Classes', 'Qualification', 'Experience', 'ExpectedSalary'],
  Driver: ['Name', 'Mobile', 'Email', 'State', 'City', 'Locality', 'VehicleTypes', 'Experience', 'ExpectedSalary'],
  Accountant: ['Name', 'Mobile', 'Email', 'State', 'City', 'Locality', 'TallyKnowledge', 'GSTKnowledge', 'Experience', 'ExpectedSalary'],
  Receptionist: ['Name', 'Mobile', 'Email', 'State', 'City', 'Locality', 'LanguagesKnown', 'Experience', 'ExpectedSalary'],
  Clerk: ['Name', 'Mobile', 'Email', 'State', 'City', 'Locality', 'TypingSpeed', 'Experience', 'ExpectedSalary'],
  Librarian: ['Name', 'Mobile', 'Email', 'State', 'City', 'Locality', 'LibraryManagementExperience', 'Experience', 'ExpectedSalary'],
  'Lab Assistant': ['Name', 'Mobile', 'Email', 'State', 'City', 'Locality', 'LabType', 'LabExperience', 'Experience', 'ExpectedSalary'],
  'Sports Coach': ['Name', 'Mobile', 'Email', 'State', 'City', 'Locality', 'SportsSpecialization', 'CoachingCertificates', 'CoachingExperience', 'Experience', 'ExpectedSalary'],
  'Security Guard': ['Name', 'Mobile', 'Email', 'State', 'City', 'Locality', 'SecurityExperience', 'ExArmy', 'NightShiftAvailable', 'Experience', 'ExpectedSalary'],
  Cleaner: ['Name', 'Mobile', 'Email', 'State', 'City', 'Locality', 'CleaningExperience', 'SchoolExperience', 'Experience', 'ExpectedSalary'],
};

function downloadTemplate(position) {
  const columns = POSITION_TEMPLATES[position] || ['Name', 'Mobile', 'Email', 'State', 'City', 'Locality', 'Position', 'Experience', 'ExpectedSalary'];
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

  const { data: positions = [] } = useQuery({
    queryKey: ['positions'],
    queryFn: () => getPositions().then((r) => r.data.data),
  });

  const singleMutation = useMutation({
    mutationFn: importSingleCandidate,
    onSuccess: () => {
      setForm({ fullName: '', mobile: '', email: '', position: '', experienceYears: 0, expectedSalary: '' });
      setLocation({});
      alert('Candidate imported successfully');
    },
  });

  const bulkMutation = useMutation({
    mutationFn: (file) => {
      const formData = new FormData();
      formData.append('file', file);
      if (selectedPosition) formData.append('position', selectedPosition);
      return importBulkCandidates(formData);
    },
    onSuccess: (res) => setBulkResult(res.data.data),
  });

  const handleBulkUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!selectedPosition) {
        alert('Please select a position first');
        return;
      }
      bulkMutation.mutate(file);
    }
  };

  return (
    <div className="space-y-6 bg-slate-50/50 dark:bg-slate-950 min-h-screen p-6 max-w-[1400px] mx-auto w-full antialiased animate-in fade-in duration-500">
      {/* Page Header Panel */}
      <div className="pb-5">
        <PageHeader 
          title="Candidate Import" 
          description="Expand your talent network repository using single profile creation fields or fast bulk database spreadsheet integrations." 
        />
      </div>

      <Tabs defaultValue="single" className="w-full space-y-6">
        <TabsList className="inline-flex h-12 items-center justify-center rounded-xl bg-white dark:bg-slate-900 p-1 text-slate-500 border border-slate-200/60 dark:border-slate-800 shadow-sm">
          <TabsTrigger value="single" className="inline-flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-semibold tracking-wide transition-all data-[state=active]:bg-purple-50 data-[state=active]:text-purple-600 data-[state=active]:font-semibold shadow-none">
            <UserPlus className="h-4 w-4" />
            Single Profile Ingest
          </TabsTrigger>
          <TabsTrigger value="bulk" className="inline-flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-semibold tracking-wide transition-all data-[state=active]:bg-purple-50 data-[state=active]:text-purple-600 data-[state=active]:font-semibold shadow-none">
            <FileSpreadsheet className="h-4 w-4" />
            Bulk CSV Spreadsheets
          </TabsTrigger>
        </TabsList>

        {/* Single Manual Profile Import Tab Content Panel */}
        <TabsContent value="single" className="outline-none focus:outline-none focus:ring-0">
          <Card className="border border-slate-200/60 bg-white shadow-2xs dark:bg-slate-900 overflow-hidden">
            <CardHeader className="p-5 border-none pb-0">
              <CardTitle className="text-sm font-bold tracking-wide text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-purple-600" />
                Add Candidate Manually
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  singleMutation.mutate({
                    ...form,
                    experienceYears: Number(form.experienceYears),
                    expectedSalary: form.expectedSalary ? Number(form.expectedSalary) : undefined,
                    localityId: location.localityId,
                  });
                }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Full Name</Label>
                    <Input 
                      value={form.fullName} 
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })} 
                      required 
                      placeholder="Jane Doe"
                      className="rounded-xl border-slate-200 dark:bg-slate-800 dark:border-slate-700"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Mobile Number</Label>
                    <Input 
                      value={form.mobile} 
                      onChange={(e) => setForm({ ...form, mobile: e.target.value })} 
                      required 
                      placeholder="+91 XXXXX XXXXX"
                      className="rounded-xl border-slate-200 dark:bg-slate-800 dark:border-slate-700"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Email Address</Label>
                    <Input 
                      value={form.email} 
                      onChange={(e) => setForm({ ...form, email: e.target.value })} 
                      type="email"
                      placeholder="jane.doe@example.com"
                      className="rounded-xl border-slate-200 dark:bg-slate-800 dark:border-slate-700"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Target Position Role</Label>
                    <Select value={form.position} onValueChange={(v) => setForm({ ...form, position: v })} required>
                      <SelectTrigger className="rounded-xl border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                        <SelectValue placeholder="Select talent role profile" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
                        {positions.map((p) => (
                          <SelectItem key={p} value={p} className="rounded-lg py-2 focus:text-purple-600 focus:bg-purple-50">
                            {p}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Experience Logs (Years)</Label>
                    <Input
                      type="number"
                      value={form.experienceYears}
                      onChange={(e) => setForm({ ...form, experienceYears: e.target.value })}
                      placeholder="0"
                      min="0"
                      className="rounded-xl border-slate-200 dark:bg-slate-800 dark:border-slate-700"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Expected Salary (₹ Annual)</Label>
                    <Input
                      type="number"
                      value={form.expectedSalary}
                      onChange={(e) => setForm({ ...form, expectedSalary: e.target.value })}
                      placeholder="e.g. 450000"
                      className="rounded-xl border-slate-200 dark:bg-slate-800 dark:border-slate-700"
                    />
                  </div>
                  <div className="md:col-span-2 rounded-xl bg-slate-50/50 dark:bg-slate-900/40 p-5">
                    <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 inline-block">Geographic Placement Location Mapping</Label>
                    <LocationSelect value={location} onChange={setLocation} />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={singleMutation.isPending}
                  className="w-full sm:w-auto min-w-[180px] bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {singleMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing Profile Ingest...
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

        {/* Bulk Data CSV Spreadsheet Upload Tab Content Panel */}
        <TabsContent value="bulk" className="outline-none focus:outline-none focus:ring-0">
          <Card className="border border-slate-200/60 bg-white shadow-2xs dark:bg-slate-900 overflow-hidden">
            <CardHeader className="p-5 border-none pb-0">
              <CardTitle className="text-sm font-bold tracking-wide text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <FileSpreadsheet className="h-4 w-4 text-purple-600" />
                Bulk Import (CSV / Excel Ledger)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-6">
              
              {/* Dynamic Action Trigger Framework Configuration Area */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end rounded-xl bg-slate-50/50 dark:bg-slate-900/40 p-5">
                <div className="space-y-1.5">
                  <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Target Mapping Position</Label>
                  <Select value={selectedPosition} onValueChange={setSelectedPosition}>
                    <SelectTrigger className="rounded-xl border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-700">
                      <SelectValue placeholder="Choose role to unlock spreadsheet architecture" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
                      {positions.map((p) => (
                        <SelectItem key={p} value={p} className="rounded-lg py-2 focus:text-purple-600 focus:bg-purple-50">
                          {p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {selectedPosition ? (
                  <Button
                    variant="outline"
                    onClick={() => downloadTemplate(selectedPosition)}
                    className="h-11 rounded-xl border-purple-200/60 bg-purple-50/80 text-purple-700 font-bold hover:bg-purple-600 hover:text-white hover:border-purple-600 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <Download className="h-4 w-4 stroke-[2.5]" />
                    Download {selectedPosition} CSV Template
                  </Button>
                ) : (
                  <div className="flex h-11 items-center gap-2 rounded-xl border border-dashed border-slate-200 px-4 text-xs font-medium text-slate-400 bg-white/50 dark:bg-slate-900/50 italic">
                    <Info className="h-3.5 w-3.5 text-slate-300 shrink-0" />
                    Select a target job position to generate structured CSV layouts.
                  </div>
                )}
              </div>

              {/* Dynamic Columns Configuration Matrix Banner */}
              {selectedPosition && (
                <div className="rounded-xl border border-slate-100 dark:border-slate-800 p-5 bg-slate-50/30 dark:bg-slate-900/10">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3 flex items-center gap-1.5">
                    <FileCheck className="h-4 w-4 text-purple-600" />
                    Required Column Architecture Guidelines
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {POSITION_TEMPLATES[selectedPosition]?.map((col) => (
                      <span 
                        key={col} 
                        className="px-2.5 py-1 border border-purple-200/60 bg-purple-50/80 text-purple-700 font-bold uppercase tracking-wider text-[11px] rounded-md"
                      >
                        {col}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Secure Media File Ingest Dropzone Area Box */}
              <div className="space-y-1.5">
                <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Upload Complete Data Sheet Ledger</Label>
                <div className={cn(
                  "relative group flex flex-col items-center justify-center rounded-xl border border-dashed p-6 text-center transition-all duration-200",
                  selectedPosition 
                    ? "border-slate-200 bg-white dark:bg-slate-900 hover:border-purple-600 hover:bg-purple-50 cursor-pointer" 
                    : "border-slate-200 bg-slate-100/40 dark:bg-slate-800/40 opacity-60 cursor-not-allowed"
                )}>
                  <Input
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleBulkUpload}
                    disabled={!selectedPosition || bulkMutation.isPending}
                    className="absolute inset-0 opacity-0 z-10 h-full w-full cursor-pointer disabled:cursor-not-allowed"
                  />
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 border border-slate-100 dark:border-slate-700 group-hover:scale-105 group-hover:bg-purple-50 group-hover:text-purple-600 transition-all duration-300 mb-3">
                    <Upload className="h-5 w-5" />
                  </div>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Click to locate or drag spreadsheet ledger file here</p>
                  <p className="text-xs text-slate-400 mt-1 font-medium">Accepts formatted CSV, XLSX, or XLS documentation archives up to 10MB</p>
                </div>
              </div>

              {/* In-flight Data Processing Live Monitor Block Banner */}
              {bulkMutation.isPending && (
                <div className="flex items-center gap-3 p-4 rounded-xl border border-cyan-200/60 bg-cyan-50/80 text-cyan-700 font-semibold text-sm">
                  <Loader2 className="h-4 w-4 animate-spin text-cyan-600" />
                  <p className="animate-pulse">HireHub Parser parsing spreadsheet rows, validating constraints, and building network logs...</p>
                </div>
              )}

              {/* Comprehensive Processing Feedback Result Ledger Scoreboard Dashboard */}
              {bulkResult && (
                <div className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/10 p-5 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white dark:bg-slate-900 p-4 rounded-xl text-center shadow-sm">
                      <p className="text-2xl font-extrabold text-slate-800 dark:text-white">{bulkResult.totalRows}</p>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mt-1">Total Parsed Rows</p>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-4 rounded-xl text-center shadow-sm">
                      <p className="text-2xl font-extrabold text-emerald-600">{bulkResult.validRows}</p>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mt-1">Valid Structures</p>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-4 rounded-xl text-center shadow-sm">
                      <p className="text-2xl font-extrabold text-rose-600">{bulkResult.invalidRows}</p>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mt-1">Invalid Warnings</p>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-4 rounded-xl text-center shadow-sm">
                      <p className="text-2xl font-extrabold text-cyan-600">{bulkResult.imported}</p>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mt-1">Ingested Success</p>
                    </div>
                  </div>

                  {/* Operational Validation Structural Error Reports Stack Box Log */}
                  {bulkResult.errors?.length > 0 && (
                    <div className="space-y-2.5">
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-rose-600 flex items-center gap-1.5 pl-0.5">
                        <AlertCircle className="h-4 w-4 text-rose-600" />
                        Platform Validation Error Logs
                      </h4>
                      <div className="max-h-60 overflow-y-auto rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 space-y-1.5 custom-scrollbar">
                        {bulkResult.errors.map((err, i) => (
                          <div key={i} className="flex items-start gap-2.5 text-xs py-1.5 border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 rounded px-1 transition-colors">
                            <XCircle className="h-3.5 w-3.5 text-rose-600 mt-0.5 shrink-0" />
                            <div className="leading-normal font-medium">
                              <span className="font-bold text-rose-600 border border-rose-200/60 bg-rose-50/80 px-1.5 py-0.5 rounded-md mr-1.5 text-[10px] uppercase tracking-wide">Row {err.row}</span>
                              <span className="text-slate-500 dark:text-slate-400">{err.message}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Batch Success Feedback Confirmation Floating Module Row */}
                  {bulkResult.imported > 0 && (
                    <div className="flex items-center gap-2.5 p-4 rounded-xl border border-emerald-200/60 bg-emerald-50/80 text-emerald-700 font-semibold text-sm">
                      <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                      <p>Pipeline operation complete. Successfully ingested <span className="font-bold underline">{bulkResult.imported}</span> candidate ledger records directly into the platform repository.</p>
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