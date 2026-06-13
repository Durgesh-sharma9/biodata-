import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Upload, Download, FileSpreadsheet, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
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
    <div>
      <PageHeader title="Candidate Import" description="Import candidates to the platform talent pool" />

      <Tabs defaultValue="single">
        <TabsList>
          <TabsTrigger value="single">Single Import</TabsTrigger>
          <TabsTrigger value="bulk">Bulk Import</TabsTrigger>
        </TabsList>

        <TabsContent value="single">
          <Card>
            <CardHeader><CardTitle>Add Candidate Manually</CardTitle></CardHeader>
            <CardContent>
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
                className="grid gap-4 md:grid-cols-2"
              >
                <div>
                  <Label>Full Name</Label>
                  <Input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required />
                </div>
                <div>
                  <Label>Mobile</Label>
                  <Input value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} required />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
                <div>
                  <Label>Position</Label>
                  <Select value={form.position} onValueChange={(v) => setForm({ ...form, position: v })} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent>
                      {positions.map((p) => (
                        <SelectItem key={p} value={p}>
                          {p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Experience (years)</Label>
                  <Input
                    type="number"
                    value={form.experienceYears}
                    onChange={(e) => setForm({ ...form, experienceYears: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Expected Salary</Label>
                  <Input
                    type="number"
                    value={form.expectedSalary}
                    onChange={(e) => setForm({ ...form, expectedSalary: e.target.value })}
                  />
                </div>
                <div className="md:col-span-2">
                  <LocationSelect value={location} onChange={setLocation} />
                </div>
                <Button type="submit" disabled={singleMutation.isPending}>Import Candidate</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bulk">
          <Card>
            <CardHeader><CardTitle>Bulk Import (CSV / Excel)</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Select Position</Label>
                  <Select value={selectedPosition} onValueChange={setSelectedPosition}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent>
                      {positions.map((p) => (
                        <SelectItem key={p} value={p}>
                          {p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {selectedPosition && (
                  <Button
                    variant="outline"
                    onClick={() => downloadTemplate(selectedPosition)}
                    className="w-full"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download {selectedPosition} Template
                  </Button>
                )}
              </div>

              {selectedPosition && (
                <div className="rounded-md border p-4 bg-muted/50">
                  <h4 className="font-medium mb-2">Template Columns for {selectedPosition}:</h4>
                  <div className="flex flex-wrap gap-2">
                    {POSITION_TEMPLATES[selectedPosition]?.map((col) => (
                      <Badge key={col} variant="secondary">
                        {col}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <Label>Upload Excel/CSV File</Label>
                <Input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleBulkUpload}
                  disabled={!selectedPosition || bulkMutation.isPending}
                />
              </div>

              {bulkMutation.isPending && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <FileSpreadsheet className="h-4 w-4 animate-spin" />
                  <p>Processing and validating data...</p>
                </div>
              )}

              {bulkResult && (
                <div className="rounded-md border p-4 space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold">{bulkResult.totalRows}</p>
                      <p className="text-sm text-muted-foreground">Total Rows</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">{bulkResult.validRows}</p>
                      <p className="text-sm text-muted-foreground">Valid Rows</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-red-600">{bulkResult.invalidRows}</p>
                      <p className="text-sm text-muted-foreground">Invalid Rows</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">{bulkResult.imported}</p>
                      <p className="text-sm text-muted-foreground">Imported</p>
                    </div>
                  </div>

                  {bulkResult.errors?.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-destructive" />
                        Validation Errors
                      </h4>
                      <div className="max-h-60 overflow-auto rounded-md border p-2 space-y-1">
                        {bulkResult.errors.map((err, i) => (
                          <div key={i} className="flex items-start gap-2 text-sm">
                            <XCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                            <div>
                              <span className="font-medium">Row {err.row}:</span>
                              <span className="text-muted-foreground ml-1">{err.message}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {bulkResult.imported > 0 && (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <p className="text-sm">Successfully imported {bulkResult.imported} candidates</p>
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
