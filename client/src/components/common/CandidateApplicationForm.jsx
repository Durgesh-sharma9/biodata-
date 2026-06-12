import { useState } from 'react';
import { Upload, X, FileText } from 'lucide-react';
import { LocationSelect } from '@/components/common/LocationSelect';
import { PositionFormFields } from '@/components/common/PositionFormFields';
import { APPLICATION_POSITIONS } from '@/config/positionForms';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MultiSelect } from '@/components/ui/multi-select';

const defaultForm = {
  fullName: '',
  mobile: '',
  email: '',
  address: '',
  position: '',
  qualifications: [],
  subjects: [],
  classesCanTeach: [],
  vehicleTypes: [],
  experienceYears: 0,
  expectedSalary: '',
  profileSharingConsent: false,
  contactConsent: false,
};

export function CandidateApplicationForm({
  title,
  subtitle,
  onSubmit,
  isSubmitting,
  uploadFiles,
  qualificationOptions = [],
  subjectOptions = [],
  classOptions = [],
  positionOptions = APPLICATION_POSITIONS,
  requireConsent = true,
  submitLabel = 'Submit Application',
}) {
  const [form, setForm] = useState(defaultForm);
  const [location, setLocation] = useState({});
  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const updateForm = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    if (documents.length + files.length > 10) {
      setError('Maximum 10 files allowed');
      return;
    }

    setUploading(true);
    setError('');
    try {
      const res = await uploadFiles(files);
      setDocuments((prev) => [...prev, ...res.data.data]);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (requireConsent && (!form.profileSharingConsent || !form.contactConsent)) {
      setError('You must accept both consent checkboxes to submit');
      return;
    }

    onSubmit({
      ...form,
      experienceYears: Number(form.experienceYears) || 0,
      expectedSalary: form.expectedSalary ? Number(form.expectedSalary) : undefined,
      documents,
      localityId: location.localityId,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {(title || subtitle) && (
        <div>
          {title && <h2 className="text-xl font-bold">{title}</h2>}
          {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <Label>Full Name *</Label>
          <Input value={form.fullName} onChange={(e) => updateForm('fullName', e.target.value)} required />
        </div>

        <div className="space-y-2">
          <Label>Mobile *</Label>
          <Input value={form.mobile} onChange={(e) => updateForm('mobile', e.target.value)} required />
        </div>

        <div className="space-y-2">
          <Label>Email</Label>
          <Input type="email" value={form.email} onChange={(e) => updateForm('email', e.target.value)} />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label>Address</Label>
          <Input value={form.address} onChange={(e) => updateForm('address', e.target.value)} />
        </div>

        <div className="space-y-2 md:col-span-2">
          <LocationSelect value={location} onChange={setLocation} />
        </div>

        <div className="space-y-2">
          <Label>Position *</Label>
          <Select value={form.position} onValueChange={(v) => updateForm('position', v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select position" />
            </SelectTrigger>
            <SelectContent>
              {positionOptions.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Expected Salary (₹)</Label>
          <Input
            type="number"
            min="0"
            value={form.expectedSalary}
            onChange={(e) => updateForm('expectedSalary', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Qualifications</Label>
          <MultiSelect
            options={qualificationOptions}
            value={form.qualifications}
            onChange={(v) => updateForm('qualifications', v)}
            placeholder="Select qualifications"
          />
        </div>

        <div className="space-y-2">
          <Label>Experience (years)</Label>
          <Input
            type="number"
            min="0"
            value={form.experienceYears}
            onChange={(e) => updateForm('experienceYears', e.target.value)}
          />
        </div>

        <PositionFormFields
          position={form.position}
          subjects={form.subjects}
          classesCanTeach={form.classesCanTeach}
          vehicleTypes={form.vehicleTypes}
          onSubjectsChange={(v) => updateForm('subjects', v)}
          onClassesChange={(v) => updateForm('classesCanTeach', v)}
          onVehicleTypesChange={(v) => updateForm('vehicleTypes', v)}
          subjectOptions={subjectOptions}
          classOptions={classOptions}
        />
      </div>

      <div className="space-y-2">
        <Label>Documents (Resume, Certificates)</Label>
        <label className="flex cursor-pointer items-center gap-2 rounded-md border border-dashed p-4 hover:bg-muted/50">
          <Upload className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {uploading ? 'Uploading...' : 'Upload documents (max 10 files, 10MB each)'}
          </span>
          <input
            type="file"
            multiple
            className="hidden"
            accept="image/*,.pdf,.doc,.docx"
            onChange={handleFileUpload}
            disabled={uploading || documents.length >= 10}
          />
        </label>
        {documents.length > 0 && (
          <div className="space-y-2">
            {documents.map((doc, i) => (
              <div key={i} className="flex items-center justify-between rounded-md border p-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{doc.name}</span>
                </div>
                <Button type="button" variant="ghost" size="icon" onClick={() => setDocuments(documents.filter((_, idx) => idx !== i))}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {requireConsent && (
        <div className="space-y-3 rounded-md border p-4">
          <label className="flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.profileSharingConsent}
              onChange={(e) => updateForm('profileSharingConsent', e.target.checked)}
              className="mt-1"
              required
            />
            <span>
              I consent to share my profile with schools on the School Recruitment Network for recruitment purposes. *
            </span>
          </label>
          <label className="flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.contactConsent}
              onChange={(e) => updateForm('contactConsent', e.target.checked)}
              className="mt-1"
              required
            />
            <span>I consent to be contacted by schools regarding job opportunities. *</span>
          </label>
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" className="w-full" disabled={isSubmitting || uploading}>
        {isSubmitting ? 'Submitting...' : submitLabel}
      </Button>
    </form>
  );
}
