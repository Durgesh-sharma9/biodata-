import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Upload } from 'lucide-react';
import { importSingleCandidate, importBulkCandidates } from '@/lib/api';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LocationSelect } from '@/components/common/LocationSelect';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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

  const singleMutation = useMutation({
    mutationFn: importSingleCandidate,
    onSuccess: () => {
      setForm({ fullName: '', mobile: '', email: '', position: '', experienceYears: 0, expectedSalary: '' });
      setLocation({});
      alert('Candidate imported successfully');
    },
  });

  const bulkMutation = useMutation({
    mutationFn: importBulkCandidates,
    onSuccess: (res) => setBulkResult(res.data.data),
  });

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
                  <Input value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} required />
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
              <p className="text-sm text-muted-foreground">
                Required columns: fullName (or Name), mobile, position. Optional: email, state, city, locality, experienceYears, expectedSalary
              </p>
              <Input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) bulkMutation.mutate(file);
                }}
              />
              {bulkMutation.isPending && <p>Importing...</p>}
              {bulkResult && (
                <div className="rounded border p-4 text-sm">
                  <p>Imported: {bulkResult.imported}</p>
                  <p>Skipped: {bulkResult.skipped}</p>
                  {bulkResult.errors?.length > 0 && (
                    <ul className="mt-2 list-disc pl-5 text-destructive">
                      {bulkResult.errors.slice(0, 10).map((err, i) => (
                        <li key={i}>Row {err.row}: {err.message}</li>
                      ))}
                    </ul>
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
