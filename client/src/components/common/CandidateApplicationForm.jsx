import { useState } from 'react';
import { Upload, X, FileText, User, Phone, Mail, MapPin, Briefcase, IndianRupee, GraduationCap, ClipboardCheck, Sparkles, AlertCircle } from 'lucide-react';
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
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto antialiased">
      
      {/* Premium Header Typography block */}
      {(title || subtitle) && (
        <div className="relative overflow-hidden rounded-2xl border border-slate-200/60 bg-gradient-to-r from-slate-50 via-white to-slate-50/50 p-6 dark:from-slate-950 dark:via-background dark:to-slate-950/50 shadow-xs mb-2">
          <div className="absolute right-0 top-0 -mr-12 -mt-12 w-40 h-40 bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
          <div className="flex items-start gap-3">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-xl shadow-2xs mt-0.5">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              {title && <h2 className="text-xl font-extrabold tracking-tight text-foreground">{title}</h2>}
              {subtitle && <p className="mt-1 text-xs font-medium text-muted-foreground">{subtitle}</p>}
            </div>
          </div>
        </div>
      )}

      {/* Main Structural Form Fields Box */}
      <div className="rounded-2xl border border-slate-200/60 bg-card p-6 md:p-8 shadow-xs space-y-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground/90 pb-3 border-b border-muted/40 flex items-center gap-2">
          <User className="h-4 w-4 text-indigo-500" />
          Personal & Profile Details
        </h3>
        
        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">Full Name *</Label>
            <div className="relative">
              <Input 
                value={form.fullName} 
                onChange={(e) => updateForm('fullName', e.target.value)} 
                placeholder="John Doe"
                className="rounded-xl focus-visible:ring-indigo-500 h-11 pl-10 transition-all border-slate-200"
                required 
              />
              <User className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground/50" />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">Mobile *</Label>
            <div className="relative">
              <Input 
                value={form.mobile} 
                onChange={(e) => updateForm('mobile', e.target.value)} 
                placeholder="9876543210"
                className="rounded-xl focus-visible:ring-indigo-500 h-11 pl-10 transition-all border-slate-200"
                required 
              />
              <Phone className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground/50" />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">Email Address</Label>
            <div className="relative">
              <Input 
                type="email" 
                value={form.email} 
                onChange={(e) => updateForm('email', e.target.value)} 
                placeholder="john@example.com"
                className="rounded-xl focus-visible:ring-indigo-500 h-11 pl-10 transition-all border-slate-200"
              />
              <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground/50" />
            </div>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">Street Address</Label>
            <div className="relative">
              <Input 
                value={form.address} 
                onChange={(e) => updateForm('address', e.target.value)} 
                placeholder="Apartment, Street Name, Block"
                className="rounded-xl focus-visible:ring-indigo-500 h-11 pl-10 transition-all border-slate-200"
              />
              <MapPin className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground/50" />
            </div>
          </div>

          <div className="space-y-2 md:col-span-2 rounded-xl bg-slate-50/50 dark:bg-slate-900/40 border border-dashed border-slate-200/60 p-4">
            <LocationSelect value={location} onChange={setLocation} />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">Position Applied For *</Label>
            <Select value={form.position} onValueChange={(v) => updateForm('position', v)}>
              <SelectTrigger className="rounded-xl h-11 focus:ring-indigo-500 border-slate-200 font-medium bg-background">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-muted-foreground/60" />
                  <SelectValue placeholder="Select position" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {positionOptions.map((p) => (
                  <SelectItem key={p} value={p} className="rounded-lg font-medium">
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">Expected Salary (₹)</Label>
            <div className="relative">
              <Input
                type="number"
                min="0"
                value={form.expectedSalary}
                onChange={(e) => updateForm('expectedSalary', e.target.value)}
                placeholder="e.g. 500000"
                className="rounded-xl focus-visible:ring-indigo-500 h-11 pl-10 transition-all border-slate-200"
              />
              <IndianRupee className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground/50" />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">Academic Qualifications</Label>
            <MultiSelect
              options={qualificationOptions}
              value={form.qualifications}
              onChange={(v) => updateForm('qualifications', v)}
              placeholder="Select qualifications"
              className="rounded-xl min-h-11 border-slate-200"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">Total Experience (Years)</Label>
            <div className="relative">
              <Input
                type="number"
                min="0"
                value={form.experienceYears}
                onChange={(e) => updateForm('experienceYears', e.target.value)}
                className="rounded-xl focus-visible:ring-indigo-500 h-11 pl-10 transition-all border-slate-200"
              />
              <GraduationCap className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground/50" />
            </div>
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
      </div>

      {/* Polish File Upload Area Block Section */}
      <div className="rounded-2xl border border-slate-200/60 bg-card p-6 md:p-8 shadow-xs space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground/90 pb-3 border-b border-muted/40 flex items-center gap-2">
          <FileText className="h-4 w-4 text-indigo-500" />
          Supporting Credentials
        </h3>
        
        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 block">Documents (Resume, Certificates)</Label>
        <label className="flex flex-col items-center justify-center cursor-pointer gap-3 rounded-2xl border-2 border-dashed border-slate-200 hover:border-indigo-500/50 p-6 text-center transition-all bg-slate-50/40 dark:bg-slate-900/10 hover:bg-indigo-500/5 group">
          <div className="p-3 rounded-xl bg-background border border-muted/60 text-muted-foreground/70 group-hover:text-indigo-600 group-hover:scale-105 transition-all shadow-2xs">
            <Upload className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
              {uploading ? 'Processing Server Upload...' : 'Click to upload files'}
            </p>
            <p className="text-xs text-muted-foreground/80">Max 10 files, up to 10MB each (Images, PDF, DOC, DOCX)</p>
          </div>
          <input
            type="file"
            multiple
            className="hidden"
            accept="image/*,.pdf,.doc,.docx"
            onChange={handleFileUpload}
            disabled={uploading || documents.length >= 10}
          />
        </label>

        {/* Uploaded Documents List Map View */}
        {documents.length > 0 && (
          <div className="grid gap-2 sm:grid-cols-2 pt-2">
            {documents.map((doc, i) => (
              <div key={i} className="flex items-center justify-between rounded-xl border border-slate-100 dark:border-slate-800 p-3 bg-background group hover:border-indigo-200 transition-colors shadow-2xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="p-2 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-lg shrink-0">
                    <FileText className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[180px]">{doc.name}</span>
                </div>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setDocuments(documents.filter((_, idx) => idx !== i))}
                  className="h-8 w-8 rounded-lg hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950 transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Network Privacy Consent Aggregation Panel Box */}
      {requireConsent && (
        <div className="rounded-2xl border border-slate-200/60 bg-slate-50/50 dark:bg-slate-900/20 p-5 md:p-6 space-y-4">
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <ClipboardCheck className="h-4 w-4 text-indigo-500" />
            Declaration & System Consents
          </h4>
          
          <div className="space-y-3.5">
            <label className="flex items-start gap-3 text-sm font-medium text-slate-600 dark:text-slate-400 cursor-pointer select-none group">
              <input
                type="checkbox"
                checked={form.profileSharingConsent}
                onChange={(e) => updateForm('profileSharingConsent', e.target.checked)}
                className="mt-1 h-4 w-4 rounded-md border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer accent-indigo-600"
                required
              />
              <span className="group-hover:text-foreground transition-colors leading-relaxed">
                I consent to share my profile with schools on the School Recruitment Network for recruitment purposes. *
              </span>
            </label>
            
            <label className="flex items-start gap-3 text-sm font-medium text-slate-600 dark:text-slate-400 cursor-pointer select-none group">
              <input
                type="checkbox"
                checked={form.contactConsent}
                onChange={(e) => updateForm('contactConsent', e.target.checked)}
                className="mt-1 h-4 w-4 rounded-md border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer accent-indigo-600"
                required
              />
              <span className="group-hover:text-foreground transition-colors leading-relaxed">
                I consent to be contacted by schools regarding job opportunities. *
              </span>
            </label>
          </div>
        </div>
      )}

      {/* Form Error Processing Alert String View */}
      {error && (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-sm font-semibold animate-shake">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Submission Call to Action Control Node */}
      <Button 
        type="submit" 
        disabled={isSubmitting || uploading} 
        className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 hover:from-blue-700 hover:via-indigo-700 hover:to-indigo-800 text-white font-bold h-12 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 text-base"
      >
        {isSubmitting ? 'Committing Application Pack...' : submitLabel}
      </Button>
    </form>
  );
}