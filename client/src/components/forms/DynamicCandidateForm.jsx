import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Upload, X, FileText, User, Camera, Calendar, Mail, Phone, MapPin, Sparkles, ClipboardCheck, AlertCircle, IndianRupee, FileUp } from 'lucide-react';
import { uploadFiles } from '@/lib/api';
import { LocationSelect } from '@/components/common/LocationSelect';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
          <div key={fieldName} className="space-y-2 group animate-in fade-in duration-200">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/90 group-focus-within:text-indigo-600 transition-colors">{label}</Label>
            <Controller
              name={fieldName}
              control={control}
              render={({ field }) => (
                <MultiSelect
                  options={Array.isArray(options) ? options : settings?.[options] || []}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={`Select ${label.toLowerCase()}`}
                  className="rounded-xl min-h-11 border-slate-200 shadow-2xs"
                />
              )}
            />
          </div>
        );

      case 'select':
        return (
          <div key={fieldName} className="space-y-2 group animate-in fade-in duration-200">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/90 group-focus-within:text-indigo-600 transition-colors">{label}</Label>
            <Controller
              name={fieldName}
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="rounded-xl h-11 border-slate-200 bg-background font-medium shadow-2xs">
                    <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {Array.isArray(options) ? (
                      options.map((opt) => (
                        <SelectItem key={opt} value={opt} className="rounded-lg">
                          {opt}
                        </SelectItem>
                      ))
                    ) : (
                      settings?.[options]?.map((opt) => (
                        <SelectItem key={opt} value={opt} className="rounded-lg">
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
          <div key={fieldName} className="flex items-center space-x-3 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/10 group hover:border-indigo-500/20 transition-all duration-200 animate-in fade-in duration-200">
            <input
              type="checkbox"
              id={fieldName}
              {...register(fieldName)}
              className="h-4.5 w-4.5 rounded-md border-slate-300 text-indigo-600 focus:ring-indigo-500 accent-indigo-600 cursor-pointer"
            />
            <Label htmlFor={fieldName} className="text-sm font-semibold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
              {label}
            </Label>
          </div>
        );

      case 'number':
        return (
          <div key={fieldName} className="space-y-2 group animate-in fade-in duration-200">
            <Label htmlFor={fieldName} className="text-xs font-bold uppercase tracking-wider text-muted-foreground/90 group-focus-within:text-indigo-600 transition-colors">{label}</Label>
            <Input 
              id={fieldName} 
              type="number" 
              min="0" 
              {...register(fieldName)} 
              className="rounded-xl h-11 border-slate-200 shadow-2xs focus-visible:ring-indigo-500"
            />
          </div>
        );

      default:
        return null;
    }
  };

  const professionFields = POSITION_FIELDS[position] || {};

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8 max-w-4xl mx-auto antialiased">
      
      {/* 1. Basic Details Block Component */}
      <Card className="rounded-2xl border border-slate-200/60 bg-card shadow-xs overflow-hidden transition-all duration-300 hover:shadow-sm">
        <CardHeader className="border-b border-muted/40 bg-slate-50/50 dark:bg-slate-900/10 pb-4 pt-5 px-6 md:px-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl">
              <User className="h-4 w-4 stroke-[2.2]" />
            </div>
            <div>
              <CardTitle className="text-base font-bold tracking-tight">Basic Details</CardTitle>
              <CardDescription className="text-xs font-medium text-muted-foreground/80">Primary candidate identity information</CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="grid gap-5 md:grid-cols-2 p-6 md:p-8">
          
          {/* Avatar Area Redesign */}
          <div className="space-y-2 md:col-span-2 flex flex-col items-start pb-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">Profile Photo</Label>
            <div className="flex items-center gap-5">
              {profilePhoto ? (
                <div className="relative group">
                  <img
                    src={profilePhoto}
                    alt="Profile"
                    className="h-20 w-20 rounded-full object-cover border-2 border-indigo-500/30 shadow-sm"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute -top-1 -right-1 h-6 w-6 rounded-full shadow-md scale-90 opacity-90 hover:opacity-100 transition-opacity"
                    onClick={removeProfilePhoto}
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ) : (
                <label className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center rounded-full border-2 border-dashed border-slate-200 hover:border-indigo-500/50 bg-slate-50/40 dark:bg-slate-900/10 hover:bg-indigo-500/5 transition-all shadow-2xs group">
                  <Camera className="h-6 w-6 text-muted-foreground/60 group-hover:text-indigo-600 group-hover:scale-110 transition-all" />
                  <span className="text-[10px] font-bold text-muted-foreground/60 mt-1 uppercase tracking-wider group-hover:text-indigo-600">Add</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleProfilePhotoUpload}
                    disabled={uploading}
                  />
                </label>
              )}
              <div className="text-xs text-muted-foreground/80 max-w-xs space-y-0.5">
                <p className="font-bold text-slate-700 dark:text-slate-300">Upload clean professional portrait</p>
                <p>Supports JPG, PNG formats up to 5MB.</p>
              </div>
            </div>
          </div>

          {/* Full Name */}
          <div className="space-y-2 md:col-span-2 group">
            <Label htmlFor="fullName" className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 group-focus-within:text-indigo-600 transition-colors">Full Name *</Label>
            <div className="relative">
              <Input 
                id="fullName" 
                placeholder="John Doe"
                {...register('fullName')} 
                disabled={isFieldDisabled('fullName')} 
                className="rounded-xl h-11 pl-10 border-slate-200 focus-visible:ring-indigo-500 shadow-2xs transition-all"
              />
              <User className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground/50" />
            </div>
            {errors.fullName && <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 mt-1"><AlertCircle className="h-3.5 w-3.5 shrink-0" /><span>{errors.fullName.message}</span></div>}
          </div>

          {/* Mobile Phone Input */}
          <div className="space-y-2 group">
            <Label htmlFor="mobile" className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 group-focus-within:text-indigo-600 transition-colors">Mobile Number *</Label>
            <div className="relative">
              <Input
                id="mobile"
                placeholder="9876543210"
                {...register('mobile')}
                disabled={isFieldDisabled('mobile') || showMobileCheck}
                className="rounded-xl h-11 pl-10 border-slate-200 focus-visible:ring-indigo-500 shadow-2xs transition-all disabled:bg-slate-50 disabled:cursor-not-allowed dark:disabled:bg-slate-900/40"
              />
              <Phone className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground/50" />
            </div>
            {errors.mobile && <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 mt-1"><AlertCircle className="h-3.5 w-3.5 shrink-0" /><span>{errors.mobile.message}</span></div>}
          </div>

          {/* Email Address */}
          <div className="space-y-2 group">
            <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 group-focus-within:text-indigo-600 transition-colors">Email Address</Label>
            <div className="relative">
              <Input 
                id="email" 
                type="email" 
                placeholder="john@example.com"
                {...register('email')} 
                disabled={isFieldDisabled('email')} 
                className="rounded-xl h-11 pl-10 border-slate-200 focus-visible:ring-indigo-500 shadow-2xs transition-all"
              />
              <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground/50" />
            </div>
            {errors.email && <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 mt-1"><AlertCircle className="h-3.5 w-3.5 shrink-0" /><span>{errors.email.message}</span></div>}
          </div>

          {/* Gender */}
          <div className="space-y-2 group">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 group-focus-within:text-indigo-600 transition-colors">Gender Identification</Label>
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange} disabled={isFieldDisabled('gender')}>
                  <SelectTrigger className="rounded-xl h-11 border-slate-200 bg-background font-medium shadow-2xs">
                    <SelectValue placeholder="Select gender orientation" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="Male" className="rounded-lg font-medium">Male</SelectItem>
                    <SelectItem value="Female" className="rounded-lg font-medium">Female</SelectItem>
                    <SelectItem value="Other" className="rounded-lg font-medium">Other</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Date of Birth */}
          <div className="space-y-2 group">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 group-focus-within:text-indigo-600 transition-colors">Date of Birth</Label>
            <div className="relative">
              <Input 
                type="date" 
                {...register('dob')} 
                disabled={isFieldDisabled('dob')} 
                className="rounded-xl h-11 pl-10 border-slate-200 focus-visible:ring-indigo-500 shadow-2xs transition-all text-slate-700 dark:text-slate-300 font-medium"
              />
              <Calendar className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground/50 pointer-events-none" />
            </div>
          </div>

          {/* Address Street Box */}
          <div className="space-y-2 md:col-span-2 group">
            <Label htmlFor="address" className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 group-focus-within:text-indigo-600 transition-colors">Street Mailing Address</Label>
            <div className="relative">
              <Textarea 
                id="address" 
                placeholder="Apartment, building numbers, locality blocks..."
                {...register('address')} 
                disabled={isFieldDisabled('address')} 
                className="rounded-xl border-slate-200 focus-visible:ring-indigo-500 shadow-2xs pl-10 pt-3 transition-all min-h-[90px]"
              />
              <MapPin className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground/50" />
            </div>
          </div>

          {/* Location Dropdown Cascaders Block */}
          <div className="space-y-2 md:col-span-2 rounded-2xl bg-slate-50/40 dark:bg-slate-900/10 border border-dashed border-slate-200 p-4 shadow-3xs">
            <LocationSelect value={location} onChange={setLocation} disabled={isFieldDisabled('location')} />
          </div>
        </CardContent>
      </Card>

      {/* 2. Target Deployment Designation Card */}
      <Card className="rounded-2xl border border-slate-200/60 bg-card shadow-xs overflow-hidden transition-all duration-300 hover:shadow-sm">
        <CardHeader className="border-b border-muted/40 bg-slate-50/50 dark:bg-slate-900/10 pb-4 pt-5 px-6 md:px-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-xl">
              <Sparkles className="h-4 w-4 stroke-[2.2]" />
            </div>
            <div>
              <CardTitle className="text-base font-bold tracking-tight">Target Role Position</CardTitle>
              <CardDescription className="text-xs font-medium text-muted-foreground/80">Select core functional structural department vector</CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-6 md:p-8 group">
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 group-focus-within:text-indigo-600 transition-colors">Position Designation *</Label>
            <Controller
              name="position"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange} disabled={isFieldDisabled('position')}>
                  <SelectTrigger className="rounded-xl h-11 border-slate-200 bg-background font-medium shadow-2xs">
                    <SelectValue placeholder="Select primary operational target position" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl max-h-[320px]">
                    {(positions || settings?.positions || []).map((p) => (
                      <SelectItem key={p} value={p} className="rounded-lg font-medium">
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.position && <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 mt-1"><AlertCircle className="h-3.5 w-3.5 shrink-0" /><span>{errors.position.message}</span></div>}
          </div>
        </CardContent>
      </Card>

      {/* 3. Conditional Dynamic Field Modules Block Grid */}
      {position && professionFields && Object.keys(professionFields).length > 0 && (
        <Card className="rounded-2xl border border-slate-200/60 bg-card shadow-xs overflow-hidden transition-all duration-300 hover:shadow-sm border-l-4 border-l-indigo-500">
          <CardHeader className="border-b border-muted/40 bg-slate-50/50 dark:bg-slate-900/10 pb-4 pt-5 px-6 md:px-8">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl">
                <FileUp className="h-4 w-4 stroke-[2.2]" />
              </div>
              <div>
                <CardTitle className="text-base font-bold tracking-tight">{position}-Specific Parameters</CardTitle>
                <CardDescription className="text-xs font-medium text-muted-foreground/80">Tailored metadata criteria requested specifically for role index matrix</CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="grid gap-5 md:grid-cols-2 p-6 md:p-8 bg-indigo-500/[0.01]">
            {Object.entries(professionFields).map(([fieldName, fieldConfig]) =>
              renderField(fieldName, fieldConfig, position)
            )}
          </CardContent>
        </Card>
      )}

      {/* 4. Secondary Core Professional Background Details Grid Block */}
      <Card className="rounded-2xl border border-slate-200/60 bg-card shadow-xs overflow-hidden transition-all duration-300 hover:shadow-sm">
        <CardHeader className="border-b border-muted/40 bg-slate-50/50 dark:bg-slate-900/10 pb-4 pt-5 px-6 md:px-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl">
              <ClipboardCheck className="h-4 w-4 stroke-[2.2]" />
            </div>
            <div>
              <CardTitle className="text-base font-bold tracking-tight">Professional Background Overview</CardTitle>
              <CardDescription className="text-xs font-medium text-muted-foreground/80">Aggregate corporate history metrics, expected pay metrics, and background annotations</CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="grid gap-5 md:grid-cols-2 p-6 md:p-8">
          {/* Qualifications List select */}
          <div className="space-y-2 group">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 group-focus-within:text-indigo-600 transition-colors">Academic Qualifications Suite</Label>
            <Controller
              name="qualifications"
              control={control}
              render={({ field }) => (
                <MultiSelect
                  options={settings?.qualifications || []}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Select background qualifications degrees..."
                  className="rounded-xl border-slate-200 shadow-2xs min-h-11"
                />
              )}
            />
          </div>

          {/* Years of Experience */}
          <div className="space-y-2 group">
            <Label htmlFor="experienceYears" className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 group-focus-within:text-indigo-600 transition-colors">Total Experience (Years)</Label>
            <div className="relative">
              <Input
                id="experienceYears"
                type="number"
                min="0"
                placeholder="e.g. 3"
                {...register('experienceYears')}
                disabled={isFieldDisabled('experienceYears')}
                className="rounded-xl h-11 pl-10 border-slate-200 focus-visible:ring-indigo-500 shadow-2xs transition-all"
              />
              <Calendar className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground/50" />
            </div>
          </div>

          {/* Expected Remuneration Pay Scale Input */}
          <div className="space-y-2 group md:col-span-2 sm:col-span-1">
            <Label htmlFor="expectedSalary" className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 group-focus-within:text-indigo-600 transition-colors">Expected Salary Compensation (Annum ₹)</Label>
            <div className="relative">
              <Input
                id="expectedSalary"
                type="number"
                min="0"
                placeholder="e.g. 600000"
                {...register('expectedSalary')}
                disabled={isFieldDisabled('expectedSalary')}
                className="rounded-xl h-11 pl-10 border-slate-200 focus-visible:ring-indigo-500 shadow-2xs transition-all"
              />
              <IndianRupee className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground/50" />
            </div>
          </div>

          {/* Notes Segment Text Area */}
          <div className="space-y-2 md:col-span-2 group">
            <Label htmlFor="notes" className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 group-focus-within:text-indigo-600 transition-colors">Additional Candidate Profile Annotations</Label>
            <Textarea 
              id="notes" 
              placeholder="Highlight particular specializations, awards, or custom placement tracking notes..."
              {...register('notes')} 
              disabled={isFieldDisabled('notes')} 
              className="rounded-xl border-slate-200 focus-visible:ring-indigo-500 shadow-2xs transition-all min-h-[100px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* 5. Supporting Materials Credential Dropzone area block */}
      <Card className="rounded-2xl border border-slate-200/60 bg-card shadow-xs overflow-hidden transition-all duration-300 hover:shadow-sm">
        <CardHeader className="border-b border-muted/40 bg-slate-50/50 dark:bg-slate-900/10 pb-4 pt-5 px-6 md:px-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <FileText className="h-4 w-4 stroke-[2.2]" />
            </div>
            <div>
              <CardTitle className="text-base font-bold tracking-tight">Supporting Portfolio Materials</CardTitle>
              <CardDescription className="text-xs font-medium text-muted-foreground/80">Upload resume attachments, degrees, certificates, and work references</CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-6 md:p-8 space-y-4">
          <div className="mb-2">
            <label className="flex flex-col items-center justify-center cursor-pointer gap-3 rounded-2xl border-2 border-dashed border-slate-200 hover:border-indigo-500/50 p-6 text-center transition-all bg-slate-50/40 dark:bg-slate-900/10 hover:bg-indigo-500/5 group">
              <div className="p-3 rounded-xl bg-background border border-muted/60 text-muted-foreground/70 group-hover:text-indigo-600 group-hover:scale-105 transition-all shadow-2xs">
                <Upload className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  {uploading ? 'Processing Server Streaming Upload...' : 'Click to add documentation packages'}
                </p>
                <p className="text-xs text-muted-foreground/80">Max 10 files, up to 10MB each (Images, PDF, DOC, DOCX)</p>
              </div>
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

          {/* Render Active Document List Feeds */}
          {documents.length > 0 && (
            <div className="grid gap-2 sm:grid-cols-2 pt-1 animate-in fade-in duration-200">
              {documents.map((doc, i) => (
                <div key={i} className="flex items-center justify-between rounded-xl border border-slate-100 dark:border-slate-800 p-3 bg-background group hover:border-indigo-200 transition-colors shadow-2xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="p-2 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-lg shrink-0">
                      <FileText className="h-4 w-4" />
                    </div>
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 hover:underline truncate max-w-[200px]"
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
                    className="h-8 w-8 rounded-lg text-muted-foreground hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 transition-all"
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 6. Legal Privacy Data Network Consents Panel Block */}
      {showConsent && (
        <div className="rounded-2xl border border-slate-200/60 bg-slate-50/50 dark:bg-slate-900/20 p-5 md:p-6 space-y-4 shadow-3xs animate-in fade-in duration-300">
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <ClipboardCheck className="h-4 w-4 text-indigo-500" />
            Declaration & System Data Consents
          </h4>
          
          <div className="space-y-3.5">
            <label className="flex items-start gap-3 text-sm font-medium text-slate-600 dark:text-slate-400 cursor-pointer select-none group">
              <input
                type="checkbox"
                id="profileSharingConsent"
                {...register('profileSharingConsent')}
                className="mt-1 h-4.5 w-4.5 rounded-md border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer accent-indigo-600"
                required
              />
              <span className="group-hover:text-foreground transition-colors leading-relaxed">
                I consent to share my profile with schools on the School Recruitment Network for recruitment purposes. *
              </span>
            </label>

            <label className="flex items-start gap-3 text-sm font-medium text-slate-600 dark:text-slate-400 cursor-pointer select-none group">
              <input
                type="checkbox"
                id="contactConsent"
                {...register('contactConsent')}
                className="mt-1 h-4.5 w-4.5 rounded-md border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer accent-indigo-600"
                required
              />
              <span className="group-hover:text-foreground transition-colors leading-relaxed">
                I consent to be contacted by schools regarding job opportunities. *
              </span>
            </label>
          </div>
        </div>
      )}

      {/* Primary Global Form Submit Button */}
      <Button 
        type="submit" 
        disabled={isSubmitting || isLoading || uploading}
        className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 hover:from-blue-700 hover:via-indigo-700 hover:to-indigo-800 text-white font-bold h-12 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 text-base"
      >
        {isSubmitting || isLoading ? 'Committing Modifications...' : submitButtonText}
      </Button>
    </form>
  );
}