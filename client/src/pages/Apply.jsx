import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getSchoolBySlug, submitApplication } from '@/lib/api';
import { LocationSelect } from '@/components/common/LocationSelect';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Apply() {
  const { slug } = useParams();
  const [location, setLocation] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    mobile: '',
    email: '',
    address: '',
    position: '',
    experienceYears: 0,
    expectedSalary: '',
  });

  const { data: school, isLoading, error } = useQuery({
    queryKey: ['apply-school', slug],
    queryFn: () => getSchoolBySlug(slug).then((r) => r.data.data),
  });

  const submitMutation = useMutation({
    mutationFn: (data) => submitApplication(slug, data),
    onSuccess: () => setSubmitted(true),
  });

  if (isLoading) return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  if (error || !school) return <div className="flex min-h-screen items-center justify-center">Application link not found</div>;

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30 p-6">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <h2 className="text-xl font-bold text-primary">Application Submitted!</h2>
            <p className="mt-2 text-muted-foreground">Thank you for applying to {school.schoolName}.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 p-6">
      <div className="mx-auto max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Apply to {school.schoolName}</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submitMutation.mutate({
                  ...form,
                  experienceYears: Number(form.experienceYears),
                  expectedSalary: form.expectedSalary ? Number(form.expectedSalary) : undefined,
                  localityId: location.localityId,
                });
              }}
              className="grid gap-4 md:grid-cols-2"
            >
              <div className="md:col-span-2">
                <Label>Full Name</Label>
                <Input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required />
              </div>
              <div>
                <Label>Mobile</Label>
                <Input value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} required />
              </div>
              <div>
                <Label>Email</Label>
                <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="md:col-span-2">
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
                <Label>Address</Label>
                <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
              </div>
              <div className="md:col-span-2">
                <LocationSelect value={location} onChange={setLocation} />
              </div>
              <div className="md:col-span-2">
                <Button type="submit" className="w-full" disabled={submitMutation.isPending}>
                  Submit Application
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
