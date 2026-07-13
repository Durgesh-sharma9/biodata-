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
      stateId: location.stateId,
      cityId: location.cityId,
      area: location.area,
      address: location.address,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto antialiased">
      
      {/* Vibrant Gradient Header Block */}
      {(title || subtitle) && (
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#A05AFF] via-[#9E58FF] to-[#4BCBEB] p-6 text-white shadow-md mb-2">
          <div className="absolute right-[-10px] top-[-10px] w-32 h-32 rounded-full bg-white/10 blur-xl pointer-events-none" />
          <div className="flex items-start gap-4 relative z-10">
            <div className="p-2 bg-white/15 text-white rounded-xl shadow-xs mt-0.5">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              {title && <h2 className="text-xl font-extrabold tracking-tight">{title}</h2>}
              {subtitle && <p className="mt-1 text-xs font-medium text-white/80">{subtitle}</p>}
            </div>
          </div>
        </div>
      )}

      {/* Main Structural Form Fields Box */}
      <div className="rounded-xl border border-none bg-white p-6 md:p-8 shadow-sm space-y-6 dark:bg-slate-900">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
          <User className="h-4 w-4 text-[#A05AFF]" />
          Personal & Profile Details
        </h3>
        
        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Full Name *</Label>
            <div className="relative">
              <Input 
                value={form.fullName} 
                onChange={(e) => updateForm('fullName', e.target.value)} 
                placeholder="John Doe"
                className="rounded-xl focus-visible:ring-[#A05AFF] h-11 pl-10 transition-all border-slate-200 bg-white"
                required 
              />
              <User className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Mobile *</Label>
            <div className="relative">
              <Input 
                value={form.mobile} 
                onChange={(e) => updateForm('mobile', e.target.value)} 
                placeholder="9876543210"
                className="rounded-xl focus-visible:ring-[#A05AFF] h-11 pl-10 transition-all border-slate-200 bg-white"
                required 
              />
              <Phone className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Email Address</Label>
            <div className="relative">
              <Input 
                type="email" 
                value={form.email} 
                onChange={(e) => updateForm('email', e.target.value)} 
                placeholder="john@example.com"
                className="rounded-xl focus-visible:ring-[#A05AFF] h-11 pl-10 transition-all border-slate-200 bg-white"
              />
              <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
            </div>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Street Address</Label>
            <div className="relative">
              <Input 
                value={form.address} 
                onChange={(e) => updateForm('address', e.target.value)} 
                placeholder="Apartment, Street Name, Block"
                className="rounded-xl focus-visible:ring-[#A05AFF] h-11 pl-10 transition-all border-slate-200 bg-white"
              />
              <MapPin className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
            </div>
          </div>

          <div className="space-y-2 md:col-span-2 rounded-xl bg-slate-50/50 dark:bg-slate-900/40 border border-dashed border-slate-200 p-4">
            <LocationSelect value={location} onChange={setLocation} />
          </div>

          <div className="space-y-2">
            <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Position Applied For *</Label>
            <Select value={form.position} onValueChange={(v) => updateForm('position', v)}>
              <SelectTrigger className="rounded-xl h-11 focus:ring-[#A05AFF] border-slate-200 font-medium bg-white">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-slate-400" />
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
            <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Expected Monthly Salary (₹)</Label>
            <div className="relative">
              <Input
                type="number"
                min="0"
                value={form.expectedSalary}
                onChange={(e) => updateForm('expectedSalary', e.target.value)}
                placeholder="e.g. 50000"
                className="rounded-xl focus-visible:ring-[#A05AFF] h-11 pl-10 transition-all border-slate-200 bg-white"
              />
              <IndianRupee className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Academic Qualifications</Label>
            <MultiSelect
              options={qualificationOptions}
              value={form.qualifications}
              onChange={(v) => updateForm('qualifications', v)}
              placeholder="Select qualifications"
              className="rounded-xl min-h-11 border-slate-200"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Total Experience (Years)</Label>
            <div className="relative">
              <Input
                type="number"
                min="0"
                value={form.experienceYears}
                onChange={(e) => updateForm('experienceYears', e.target.value)}
                className="rounded-xl focus-visible:ring-[#A05AFF] h-11 pl-10 transition-all border-slate-200 bg-white"
              />
              <GraduationCap className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
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
      <div className="rounded-xl border border-none bg-white p-6 md:p-8 shadow-sm space-y-4 dark:bg-slate-900">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
          <FileText className="h-4 w-4 text-[#A05AFF]" />
          Supporting Credentials
        </h3>
        
        <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">Documents (Resume, Certificates)</Label>
        <label className="flex flex-col items-center justify-center cursor-pointer gap-3 rounded-xl border-2 border-dashed border-slate-200 hover:border-[#A05AFF]/60 p-6 text-center transition-all bg-slate-50/50 dark:bg-slate-900/10 hover:bg-[#A05AFF]/5 group">
          <div className="p-3 rounded-xl bg-white border border-slate-200 text-slate-400 group-hover:text-[#A05AFF] group-hover:scale-105 transition-all shadow-xs">
            <Upload className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
              {uploading ? 'Processing Server Upload...' : 'Click to upload files'}
            </p>
            <p className="text-xs text-slate-400">Max 10 files, up to 10MB each (Images, PDF, DOC, DOCX)</p>
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

        {/* Uploaded Documents List */}
        {documents.length > 0 && (
          <div className="grid gap-2 sm:grid-cols-2 pt-2">
            {documents.map((doc, i) => (
              <div key={i} className="flex items-center justify-between rounded-xl border border-slate-100 dark:border-slate-800 p-3 bg-white group hover:border-[#4BCBEB]/50 transition-colors shadow-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="p-2 bg-[#4BCBEB]/10 text-[#4BCBEB] rounded-lg shrink-0">
                    <FileText className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[180px]">{doc.name}</span>
                </div>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setDocuments(documents.filter((_, idx) => idx !== i))}
                  className="h-8 w-8 rounded-lg hover:bg-[#FE9496]/10 hover:text-[#FE9496] transition-colors"
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
        <div className="rounded-xl border border-none bg-white p-6 shadow-sm space-y-4 dark:bg-slate-900">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <ClipboardCheck className="h-4 w-4 text-[#A05AFF]" />
            Declaration & System Consents
          </h4>
          
          <div className="space-y-4 pt-1">
            <label className="flex items-start gap-3 text-sm font-medium text-slate-600 dark:text-slate-400 cursor-pointer select-none group">
              <input
                type="checkbox"
                checked={form.profileSharingConsent}
                onChange={(e) => updateForm('profileSharingConsent', e.target.checked)}
                className="mt-1 h-4 w-4 rounded-md border-slate-300 text-[#A05AFF] focus:ring-[#A05AFF] cursor-pointer accent-[#A05AFF]"
                required
              />
              <span className="group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors leading-relaxed">
                I consent to share my profile with schools on the School Recruitment Network for recruitment purposes. *
              </span>
            </label>
            
            <label className="flex items-start gap-3 text-sm font-medium text-slate-600 dark:text-slate-400 cursor-pointer select-none group">
              <input
                type="checkbox"
                checked={form.contactConsent}
                onChange={(e) => updateForm('contactConsent', e.target.checked)}
                className="mt-1 h-4 w-4 rounded-md border-slate-300 text-[#A05AFF] focus:ring-[#A05AFF] cursor-pointer accent-[#A05AFF]"
                required
              />
              <span className="group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors leading-relaxed">
                I consent to be contacted by schools regarding job opportunities. *
              </span>
            </label>
          </div>
        </div>
      )}

      {/* Form Error Processing Alert */}
      {error && (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-[#FE9496]/10 border border-[#FE9496]/30 text-[#FE9496] text-sm font-semibold">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Vibrant Purple Theme Submit Button */}
      <Button 
        type="submit" 
        disabled={isSubmitting || uploading} 
        className="w-full bg-gradient-to-r from-[#A05AFF] via-[#9E58FF] to-[#4BCBEB] hover:opacity-95 text-white font-bold h-12 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 text-base border-none"
      >
        {isSubmitting ? 'Committing Application Pack...' : submitLabel}
      </Button>
    </form>
  );
}