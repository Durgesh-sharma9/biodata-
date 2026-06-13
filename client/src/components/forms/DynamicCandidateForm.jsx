import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Upload, X, FileText, User, Camera } from 'lucide-react';
import { uploadFiles } from '@/lib/api';
import { LocationSelect } from '@/components/common/LocationSelect';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MultiSelect } from '@/components/ui/multi-select';

const POSITION_FIELDS = {
  Teacher: {
    subjects: { type: 'multi-select', label: 'Subjects', options: 'subjects' },
    classesCanTeach: { type: 'multi-select', label: 'Classes Can Teach', options: 'classes' },
    medium: { type: 'select', label: 'Medium', options: ['English', 'Hindi', 'Regional', 'Bilingual'] },
    boardExperience: { type: 'multi-select', label: 'Board Experience', options: ['CBSE', 'ICSE', 'State Board', 'IB', 'IGCSE'] },
    bEd: { type: 'checkbox', label: 'B.Ed' },
    mEd: { type: 'checkbox', label: 'M.Ed' },
  },
  Driver: {
    vehicleTypes: { type: 'multi-select', label: 'Vehicle Types', options: ['Two Wheeler', 'Three Wheeler', 'Four Wheeler', 'Heavy Vehicle', 'School Bus'] },
    lightVehicle: { type: 'checkbox', label: 'Light Vehicle License' },
    heavyVehicle: { type: 'checkbox', label: 'Heavy Vehicle License' },
    schoolBusExperience: { type: 'checkbox', label: 'School Bus Experience' },
    drivingExperience: { type: 'number', label: 'Driving Experience (Years)' },
  },
  Accountant: {
    tallyKnowledge: { type: 'checkbox', label: 'Tally Knowledge' },
    gstKnowledge: { type: 'checkbox', label: 'GST Knowledge' },
    payrollExperience: { type: 'checkbox', label: 'Payroll Experience' },
    schoolAccountingExperience: { type: 'checkbox', label: 'School Accounting Experience' },
    erpExperience: { type: 'checkbox', label: 'ERP Experience' },
  },
  Receptionist: {
    languagesKnown: { type: 'multi-select', label: 'Languages Known', options: ['English', 'Hindi', 'Regional', 'Other'] },
    computerSkills: { type: 'checkbox', label: 'Computer Skills' },
    frontDeskExperience: { type: 'checkbox', label: 'Front Desk Experience' },
    communicationSkills: { type: 'checkbox', label: 'Communication Skills' },
  },
  Clerk: {
    typingSpeed: { type: 'select', label: 'Typing Speed', options: ['Slow', 'Average', 'Fast', 'Very Fast'] },
    msOfficeKnowledge: { type: 'checkbox', label: 'MS Office Knowledge' },
    excelKnowledge: { type: 'checkbox', label: 'Excel Knowledge' },
    schoolOfficeExperience: { type: 'checkbox', label: 'School Office Experience' },
  },
  Librarian: {
    libraryManagementExperience: { type: 'checkbox', label: 'Library Management Experience' },
    librarySoftwareKnowledge: { type: 'checkbox', label: 'Library Software Knowledge' },
  },
  'Lab Assistant': {
    labType: { type: 'select', label: 'Lab Type', options: ['Physics', 'Chemistry', 'Biology', 'Computer'] },
    labExperience: { type: 'checkbox', label: 'Lab Experience' },
  },
  'Sports Coach': {
    sportsSpecialization: { type: 'select', label: 'Sports Specialization', options: ['Cricket', 'Football', 'Basketball', 'Volleyball', 'Athletics', 'Swimming', 'Other'] },
    coachingCertificates: { type: 'multi-select', label: 'Coaching Certificates', options: ['NIS', 'DPE', 'BPEd', 'MPEd', 'Other'] },
    coachingExperience: { type: 'number', label: 'Coaching Experience (Years)' },
  },
  'Security Guard': {
    securityExperience: { type: 'checkbox', label: 'Security Experience' },
    exArmy: { type: 'checkbox', label: 'Ex-Army' },
    nightShiftAvailable: { type: 'checkbox', label: 'Night Shift Available' },
  },
  Cleaner: {
    cleaningExperience: { type: 'checkbox', label: 'Cleaning Experience' },
    schoolExperience: { type: 'checkbox', label: 'School Experience' },
  },
};

export function DynamicCandidateForm({
  initialValues,
  onSubmit,
  settings,
  positions,
  isLoading = false,
  submitButtonText = 'Submit',
  showMobileCheck = true,
  disabledFields = [],
  showConsent = false,
  uploadFilesFn = uploadFiles,
}) {
  const [uploading, setUploading] = useState(false);
  const [location, setLocation] = useState({});
  const [profilePhoto, setProfilePhoto] = useState(initialValues?.profilePhoto || null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      fullName: '',
      mobile: '',
      email: '',
      address: '',
      position: '',
      qualifications: [],
      experienceYears: 0,
      expectedSalary: '',
      notes: '',
      documents: [],
      profilePhoto: '',
      ...initialValues,
    },
  });

  const position = watch('position');
  const documents = watch('documents');
  const mobile = watch('mobile');

  useEffect(() => {
    if (initialValues) {
      reset(initialValues);
      setProfilePhoto(initialValues.profilePhoto || null);
      if (initialValues.state || initialValues.city || initialValues.locality) {
        setLocation({
          state: initialValues.state,
          city: initialValues.city,
          locality: initialValues.locality,
          localityId: initialValues.localityId,
        });
      }
    }
  }, [initialValues, reset]);

  const handleProfilePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await uploadFilesFn([file]);
      const photoUrl = res.data.data[0]?.url;
      setProfilePhoto(photoUrl);
      setValue('profilePhoto', photoUrl);
    } catch (err) {
      alert(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    if (documents.length + files.length > 10) {
      alert('Maximum 10 files allowed');
      return;
    }

    setUploading(true);
    try {
      const res = await uploadFilesFn(files);
      setValue('documents', [...documents, ...res.data.data]);
    } catch (err) {
      alert(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const removeDocument = (index) => {
    setValue('documents', documents.filter((_, i) => i !== index));
  };

  const removeProfilePhoto = () => {
    setProfilePhoto(null);
    setValue('profilePhoto', '');
  };

  const onFormSubmit = (data) => {
    onSubmit({
      ...data,
      expectedSalary: data.expectedSalary ? Number(data.expectedSalary) : undefined,
      localityId: location.localityId,
    });
  };

  const isFieldDisabled = (fieldName) => disabledFields.includes(fieldName);

  const renderField = (fieldName, fieldConfig, position) => {
    const { type, label, options } = fieldConfig;

    switch (type) {
      case 'multi-select':
        return (
          <div key={fieldName} className="space-y-2">
            <Label>{label}</Label>
            <Controller
              name={fieldName}
              control={control}
              render={({ field }) => (
                <MultiSelect
                  options={Array.isArray(options) ? options : settings?.[options] || []}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={`Select ${label.toLowerCase()}`}
                />
              )}
            />
          </div>
        );

      case 'select':
        return (
          <div key={fieldName} className="space-y-2">
            <Label>{label}</Label>
            <Controller
              name={fieldName}
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.isArray(options) ? (
                      options.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))
                    ) : (
                      settings?.[options]?.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        );

      case 'checkbox':
        return (
          <div key={fieldName} className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={fieldName}
              {...register(fieldName)}
              className="h-4 w-4 rounded border-gray-300"
            />
            <Label htmlFor={fieldName} className="cursor-pointer">
              {label}
            </Label>
          </div>
        );

      case 'number':
        return (
          <div key={fieldName} className="space-y-2">
            <Label htmlFor={fieldName}>{label}</Label>
            <Input id={fieldName} type="number" min="0" {...register(fieldName)} />
          </div>
        );

      default:
        return null;
    }
  };

  const professionFields = POSITION_FIELDS[position] || {};

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Profile Photo</Label>
            <div className="flex items-center gap-4">
              {profilePhoto ? (
                <div className="relative">
                  <img
                    src={profilePhoto}
                    alt="Profile"
                    className="h-20 w-20 rounded-full object-cover border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6"
                    onClick={removeProfilePhoto}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <label className="flex h-20 w-20 cursor-pointer items-center justify-center rounded-full border-2 border-dashed hover:bg-muted/50">
                  <Camera className="h-8 w-8 text-muted-foreground" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleProfilePhotoUpload}
                    disabled={uploading}
                  />
                </label>
              )}
            </div>
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="fullName">Full Name *</Label>
            <Input id="fullName" {...register('fullName')} disabled={isFieldDisabled('fullName')} />
            {errors.fullName && <p className="text-sm text-destructive">{errors.fullName.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="mobile">Mobile Number *</Label>
            <Input
              id="mobile"
              {...register('mobile')}
              disabled={isFieldDisabled('mobile') || showMobileCheck}
            />
            {errors.mobile && <p className="text-sm text-destructive">{errors.mobile.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register('email')} disabled={isFieldDisabled('email')} />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>Gender</Label>
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange} disabled={isFieldDisabled('gender')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="space-y-2">
            <Label>Date of Birth</Label>
            <Input type="date" {...register('dob')} disabled={isFieldDisabled('dob')} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="address">Address</Label>
            <Textarea id="address" {...register('address')} disabled={isFieldDisabled('address')} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <LocationSelect value={location} onChange={setLocation} disabled={isFieldDisabled('location')} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Position</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>Position *</Label>
            <Controller
              name="position"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange} disabled={isFieldDisabled('position')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    {(positions || settings?.positions || []).map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.position && <p className="text-sm text-destructive">{errors.position.message}</p>}
          </div>
        </CardContent>
      </Card>

      {position && professionFields && Object.keys(professionFields).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Position-Specific Details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            {Object.entries(professionFields).map(([fieldName, fieldConfig]) =>
              renderField(fieldName, fieldConfig, position)
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Professional Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Qualifications</Label>
            <Controller
              name="qualifications"
              control={control}
              render={({ field }) => (
                <MultiSelect
                  options={settings?.qualifications || []}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Select qualifications"
                />
              )}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="experienceYears">Experience (Years)</Label>
            <Input
              id="experienceYears"
              type="number"
              min="0"
              {...register('experienceYears')}
              disabled={isFieldDisabled('experienceYears')}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="expectedSalary">Expected Salary (₹)</Label>
            <Input
              id="expectedSalary"
              type="number"
              min="0"
              {...register('expectedSalary')}
              disabled={isFieldDisabled('expectedSalary')}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" {...register('notes')} disabled={isFieldDisabled('notes')} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
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
                disabled={uploading || documents.length >= 10 || isFieldDisabled('documents')}
              />
            </label>
          </div>
          {documents.length > 0 && (
            <div className="space-y-2">
              {documents.map((doc, i) => (
                <div key={i} className="flex items-center justify-between rounded-md border p-3">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      {doc.name}
                    </a>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeDocument(i)}
                    disabled={isFieldDisabled('documents')}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Button type="submit" disabled={isSubmitting || isLoading || uploading}>
        {isSubmitting || isLoading ? 'Saving...' : submitButtonText}
      </Button>

      {showConsent && (
        <div className="space-y-3 rounded-md border p-4">
          <label className="flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              id="profileSharingConsent"
              {...register('profileSharingConsent')}
              className="mt-1"
              required
            />
            <span htmlFor="profileSharingConsent">
              I consent to share my profile with schools on the School Recruitment Network for recruitment purposes. *
            </span>
          </label>
          <label className="flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              id="contactConsent"
              {...register('contactConsent')}
              className="mt-1"
              required
            />
            <span htmlFor="contactConsent">I consent to be contacted by schools regarding job opportunities. *</span>
          </label>
        </div>
      )}
    </form>
  );
}
