import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getApplicantProfile, updateApplicantProfile, uploadFiles } from '@/lib/api';
import { LocationSelect } from '@/components/common/LocationSelect';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

export default function ApplicantProfile() {
  const queryClient = useQueryClient();
  const [location, setLocation] = useState({});
  const [consents, setConsents] = useState({ profileSharingConsent: false, contactConsent: false });
  const [form, setForm] = useState({
    fullName: '',
    mobile: '',
    email: '',
    address: '',
    position: '',
    experienceYears: 0,
    expectedSalary: '',
    qualifications: '',
    notes: '',
  });
  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);

  const { data: profile, isLoading } = useQuery({
    queryKey: ['applicant-profile'],
    queryFn: () => getApplicantProfile().then((r) => r.data.data),
  });

  useEffect(() => {
    if (profile) {
      setForm({
        fullName: profile.fullName || '',
        mobile: profile.mobile === 'pending' ? '' : profile.mobile || '',
        email: profile.email || '',
        address: profile.address || '',
        position: profile.position === 'Pending' ? '' : profile.position || '',
        experienceYears: profile.experienceYears || 0,
        expectedSalary: profile.expectedSalary || '',
        qualifications: profile.qualifications?.join(', ') || '',
        notes: profile.notes || '',
      });
      setDocuments(profile.documents || []);
      setConsents({
        profileSharingConsent: profile.profileSharingConsent || false,
        contactConsent: profile.contactConsent || false,
      });
    }
  }, [profile]);

  const updateMutation = useMutation({
    mutationFn: updateApplicantProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applicant-profile'] });
      alert('Profile updated successfully');
    },
  });

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    try {
      const res = await uploadFiles(files);
      setDocuments((prev) => [...prev, ...res.data.data]);
    } finally {
      setUploading(false);
    }
  };

  if (isLoading) return <div className="flex h-64 items-center justify-center">Loading...</div>;

  return (
    <div>
      <PageHeader title="My Profile" description="Complete your profile to join the talent pool" />

      <Card>
        <CardHeader><CardTitle>Profile Details</CardTitle></CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              updateMutation.mutate({
                ...form,
                experienceYears: Number(form.experienceYears),
                expectedSalary: form.expectedSalary ? Number(form.expectedSalary) : undefined,
                qualifications: form.qualifications.split(',').map((q) => q.trim()).filter(Boolean),
                documents,
                localityId: location.localityId,
                ...consents,
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
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <Label>Position</Label>
              <Input value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} required />
            </div>
            <div>
              <Label>Experience (years)</Label>
              <Input type="number" value={form.experienceYears} onChange={(e) => setForm({ ...form, experienceYears: e.target.value })} />
            </div>
            <div>
              <Label>Expected Salary</Label>
              <Input type="number" value={form.expectedSalary} onChange={(e) => setForm({ ...form, expectedSalary: e.target.value })} />
            </div>
            <div className="md:col-span-2">
              <Label>Qualifications (comma separated)</Label>
              <Input value={form.qualifications} onChange={(e) => setForm({ ...form, qualifications: e.target.value })} />
            </div>
            <div className="md:col-span-2">
              <Label>Address</Label>
              <Textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            </div>
            <div className="md:col-span-2">
              <LocationSelect value={location} onChange={setLocation} />
            </div>
            <div className="md:col-span-2">
              <Label>Documents</Label>
              <Input type="file" multiple onChange={handleUpload} disabled={uploading} />
              {documents.length > 0 && (
                <ul className="mt-2 space-y-1 text-sm">
                  {documents.map((d, i) => (
                    <li key={i}>
                      <a href={d.url} target="_blank" rel="noreferrer" className="text-primary hover:underline">{d.name}</a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="flex items-start gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={consents.profileSharingConsent}
                  onChange={(e) => setConsents({ ...consents, profileSharingConsent: e.target.checked })}
                />
                I agree that my profile may be shared with verified schools on this recruitment platform.
              </label>
              <label className="flex items-start gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={consents.contactConsent}
                  onChange={(e) => setConsents({ ...consents, contactConsent: e.target.checked })}
                />
                I agree to be contacted regarding relevant job opportunities.
              </label>
            </div>
            <div className="md:col-span-2">
              <Button type="submit" disabled={updateMutation.isPending}>
                Save Profile
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
