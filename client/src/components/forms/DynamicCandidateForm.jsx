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

  const professionFields = POSITION_FIELDS[position] || {};

  useEffect(() => {
    if (initialValues) {
      reset(initialValues);
      setProfilePhoto(initialValues.profilePhoto || null);
      if (initialValues.stateId || initialValues.cityId || initialValues.localityId) {
        setLocation({
          stateId: initialValues.stateId,
          cityId: initialValues.cityId,
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
      stateId: location.stateId,
      cityId: location.cityId,
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
            <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 group-focus-within:text-[#A05AFF] transition-colors">{label}</Label>
            <Controller
              name={fieldName}
              control={control}
              render={({ field }) => (
                <MultiSelect
                  options={Array.isArray(options) ? options : settings?.[options] || []}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={`Select ${label.toLowerCase()}`}
                  className="rounded-xl min-h-11 border-slate-200 shadow-xs focus-within:border-[#A05AFF]"
                />
              )}
            />
          </div>
        );

      case 'select':
        return (
          <div key={fieldName} className="space-y-2 group animate-in fade-in duration-200">
            <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 group-focus-within:text-[#A05AFF] transition-colors">{label}</Label>
            <Controller
              name={fieldName}
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="rounded-xl h-11 border-slate-200 bg-white font-medium shadow-xs focus:ring-[#A05AFF]">
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
          <div key={fieldName} className="flex items-center space-x-3 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/10 group hover:border-[#A05AFF]/30 transition-all duration-200 animate-in fade-in duration-200">
            <input
              type="checkbox"
              id={fieldName}
              {...register(fieldName)}
              className="h-4.5 w-4.5 rounded-md border-slate-300 text-[#A05AFF] focus:ring-[#A05AFF] accent-[#A05AFF] cursor-pointer"
            />
            <Label htmlFor={fieldName} className="text-sm font-semibold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
              {label}
            </Label>
          </div>
        );

      case 'number':
        return (
          <div key={fieldName} className="space-y-2 group animate-in fade-in duration-200">
            <Label htmlFor={fieldName} className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 group-focus-within:text-[#A05AFF] transition-colors">{label}</Label>
            <Input 
              id={fieldName} 
              type="number" 
              min="0" 
              {...register(fieldName)} 
              className="rounded-xl h-11 border-slate-200 shadow-xs focus-visible:ring-[#A05AFF]"
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8 max-w-4xl mx-auto antialiased">
      
      {/* 1. Basic Details Card */}
      <Card className="rounded-xl border border-none bg-white shadow-sm overflow-hidden">
        <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-white pb-4 pt-5 px-6 md:px-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#4BCBEB]/10 text-[#4BCBEB] rounded-xl">
              <User className="h-4 w-4 stroke-[2.2]" />
            </div>
            <div>
              <CardTitle className="text-sm font-bold tracking-wide text-slate-800 dark:text-white">Basic Details</CardTitle>
              <CardDescription className="text-xs font-medium text-slate-400">Primary candidate identity information</CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="grid gap-5 md:grid-cols-2 p-6 md:p-8">
          
          {/* Avatar Photo Slot */}
          <div className="space-y-2 md:col-span-2 flex flex-col items-start pb-2">
            <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Profile Photo</Label>
            <div className="flex items-center gap-5">
              {profilePhoto ? (
                <div className="relative group">
                  <img
                    src={profilePhoto}
                    alt="Profile"
                    className="h-20 w-20 rounded-full object-cover border-2 border-[#A05AFF]/40 shadow-xs"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute -top-1 -right-1 h-6 w-6 rounded-full shadow-md scale-90 bg-[#FE9496] text-white hover:bg-[#ff7b8f]"
                    onClick={removeProfilePhoto}
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ) : (
                <label className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center rounded-full border-2 border-dashed border-slate-200 hover:border-[#A05AFF]/50 bg-slate-50/40 dark:bg-slate-900/10 hover:bg-[#A05AFF]/5 transition-all shadow-xs group">
                  <Camera className="h-6 w-6 text-slate-400 group-hover:text-[#A05AFF] group-hover:scale-105 transition-all" />
                  <span className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-wider group-hover:text-[#A05AFF]">Add</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleProfilePhotoUpload}
                    disabled={uploading}
                  />
                </label>
              )}
              <div className="text-xs text-slate-400 max-w-xs space-y-0.5">
                <p className="font-bold text-slate-700 dark:text-slate-300">Upload clean professional portrait</p>
                <p>Supports JPG, PNG formats up to 5MB.</p>
              </div>
            </div>
          </div>

          {/* Full Name */}
          <div className="space-y-2 md:col-span-2 group">
            <Label htmlFor="fullName" className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 group-focus-within:text-[#A05AFF] transition-colors">Full Name *</Label>
            <div className="relative">
              <Input 
                id="fullName" 
                placeholder="John Doe"
                {...register('fullName')} 
                disabled={isFieldDisabled('fullName')} 
                className="rounded-xl h-11 pl-10 border-slate-200 focus-visible:ring-[#A05AFF] shadow-xs transition-all bg-white"
              />
              <User className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
            </div>
            {errors.fullName && <div className="flex items-center gap-1.5 text-xs font-semibold text-[#FE9496] mt-1"><AlertCircle className="h-3.5 w-3.5 shrink-0" /><span>{errors.fullName.message}</span></div>}
          </div>

          {/* Mobile Number */}
          <div className="space-y-2 group">
            <Label htmlFor="mobile" className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 group-focus-within:text-[#A05AFF] transition-colors">Mobile Number *</Label>
            <div className="relative">
              <Input
                id="mobile"
                placeholder="9876543210"
                {...register('mobile')}
                disabled={isFieldDisabled('mobile')}
                className="rounded-xl h-11 pl-10 border-slate-200 focus-visible:ring-[#A05AFF] shadow-xs transition-all disabled:bg-slate-50 bg-white"
              />
              <Phone className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
            </div>
            {errors.mobile && <div className="flex items-center gap-1.5 text-xs font-semibold text-[#FE9496] mt-1"><AlertCircle className="h-3.5 w-3.5 shrink-0" /><span>{errors.mobile.message}</span></div>}
          </div>

          {/* Email */}
          <div className="space-y-2 group">
            <Label htmlFor="email" className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 group-focus-within:text-[#A05AFF] transition-colors">Email Address</Label>
            <div className="relative">
              <Input 
                id="email" 
                type="email" 
                placeholder="john@example.com"
                {...register('email')} 
                disabled={isFieldDisabled('email')} 
                className="rounded-xl h-11 pl-10 border-slate-200 focus-visible:ring-[#A05AFF] shadow-xs transition-all bg-white"
              />
              <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
            </div>
            {errors.email && <div className="flex items-center gap-1.5 text-xs font-semibold text-[#FE9496] mt-1"><AlertCircle className="h-3.5 w-3.5 shrink-0" /><span>{errors.email.message}</span></div>}
          </div>

          {/* Gender Select */}
          <div className="space-y-2 group">
            <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 group-focus-within:text-[#A05AFF] transition-colors">Gender Identification</Label>
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange} disabled={isFieldDisabled('gender')}>
                  <SelectTrigger className="rounded-xl h-11 border-slate-200 bg-white font-medium shadow-xs focus:ring-[#A05AFF]">
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
            <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 group-focus-within:text-[#A05AFF] transition-colors">Date of Birth</Label>
            <div className="relative">
              <Input 
                type="date" 
                {...register('dob')} 
                disabled={isFieldDisabled('dob')} 
                className="rounded-xl h-11 pl-10 border-slate-200 focus-visible:ring-[#A05AFF] shadow-xs transition-all text-slate-700 font-medium bg-white"
              />
              <Calendar className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Street Address */}
          <div className="space-y-2 md:col-span-2 group">
            <Label htmlFor="address" className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 group-focus-within:text-[#A05AFF] transition-colors">Street Mailing Address</Label>
            <div className="relative">
              <Textarea 
                id="address" 
                placeholder="Apartment, building numbers, locality blocks..."
                {...register('address')} 
                disabled={isFieldDisabled('address')} 
                className="rounded-xl border-slate-200 focus-visible:ring-[#A05AFF] shadow-xs pl-10 pt-3 transition-all min-h-[90px] bg-white"
              />
              <MapPin className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
            </div>
          </div>

          {/* Location Select Module */}
          <div className="space-y-2 md:col-span-2 rounded-xl bg-slate-50/50 border border-dashed border-slate-200 p-4">
            <LocationSelect value={location} onChange={setLocation} />
          </div>
        </CardContent>
      </Card>

      {/* 2. Target Deployment Role Card */}
      <Card className="rounded-xl border border-none bg-white shadow-sm overflow-hidden">
        <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-white pb-4 pt-5 px-6 md:px-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#9E58FF]/10 text-[#9E58FF] rounded-xl">
              <Sparkles className="h-4 w-4 stroke-[2.2]" />
            </div>
            <div>
              <CardTitle className="text-sm font-bold tracking-wide text-slate-800 dark:text-white">Target Role Position</CardTitle>
              <CardDescription className="text-xs font-medium text-slate-400">Select core functional structural operational vector</CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-6 md:p-8 group">
          <div className="space-y-2">
            <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 group-focus-within:text-[#A05AFF] transition-colors">Position Designation *</Label>
            <Controller
              name="position"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isFieldDisabled('position')}
                >
                  <SelectTrigger className="rounded-xl h-11 border-slate-200 bg-white font-medium shadow-xs focus:ring-[#A05AFF]">
                    <SelectValue placeholder="Select primary operational target position" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl max-h-[320px]">
                    {(positions || settings?.positions || []).map((p) => {
                      const positionValue = typeof p === 'object' ? p.name : p;
                      return (
                        <SelectItem key={positionValue} value={positionValue} className="rounded-lg font-medium">
                          {positionValue}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.position && <div className="flex items-center gap-1.5 text-xs font-semibold text-[#FE9496] mt-1"><AlertCircle className="h-3.5 w-3.5 shrink-0" /><span>{errors.position.message}</span></div>}
          </div>
        </CardContent>
      </Card>

      {/* 3. Conditional Dynamic Role Fields Card */}
      {position && professionFields && Object.keys(professionFields).length > 0 && (
        <Card className="rounded-xl border border-none bg-white shadow-sm overflow-hidden border-l-4 border-l-[#A05AFF] animate-in fade-in duration-300">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-white pb-4 pt-5 px-6 md:px-8">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#A05AFF]/10 text-[#A05AFF] rounded-xl">
                <FileUp className="h-4 w-4 stroke-[2.2]" />
              </div>
              <div>
                <CardTitle className="text-sm font-bold tracking-wide text-slate-800 dark:text-white">{position}-Specific Parameters</CardTitle>
                <CardDescription className="text-xs font-medium text-slate-400">Tailored metadata criteria requested specifically for role metrics</CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="grid gap-5 md:grid-cols-2 p-6 md:p-8 bg-[#A05AFF]/[0.01]">
            {Object.entries(professionFields).map(([fieldName, fieldConfig]) =>
              renderField(fieldName, fieldConfig, position)
            )}
          </CardContent>
        </Card>
      )}

      {/* 4. Secondary Core Background Card */}
      <Card className="rounded-xl border border-none bg-white shadow-sm overflow-hidden">
        <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-white pb-4 pt-5 px-6 md:px-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#FE9496]/10 text-[#FE9496] rounded-xl">
              <ClipboardCheck className="h-4 w-4 stroke-[2.2]" />
            </div>
            <div>
              <CardTitle className="text-sm font-bold tracking-wide text-slate-800 dark:text-white">Professional Background Overview</CardTitle>
              <CardDescription className="text-xs font-medium text-slate-400">Aggregate qualification metrics, corporate pay requirements, and notes</CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="grid gap-5 md:grid-cols-2 p-6 md:p-8">
          {/* Qualifications Suite */}
          <div className="space-y-2 group">
            <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 group-focus-within:text-[#A05AFF] transition-colors">Academic Qualifications Suite</Label>
            <Controller
              name="qualifications"
              control={control}
              render={({ field }) => (
                <MultiSelect
                  options={settings?.qualifications || []}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Select background qualifications degrees..."
                  className="rounded-xl border-slate-200 shadow-xs min-h-11"
                />
              )}
            />
          </div>

          {/* Years of Experience */}
          <div className="space-y-2 group">
            <Label htmlFor="experienceYears" className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 group-focus-within:text-[#A05AFF] transition-colors">Total Experience (Years)</Label>
            <div className="relative">
              <Input
                id="experienceYears"
                type="number"
                min="0"
                placeholder="e.g. 3"
                {...register('experienceYears')}
                disabled={isFieldDisabled('experienceYears')}
                className="rounded-xl h-11 pl-10 border-slate-200 focus-visible:ring-[#A05AFF] shadow-xs transition-all bg-white"
              />
              <Calendar className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
            </div>
          </div>

          {/* Expected Salary */}
          <div className="space-y-2 group md:col-span-2 sm:col-span-1">
            <Label htmlFor="expectedSalary" className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 group-focus-within:text-[#A05AFF] transition-colors">Expected Monthly Salary (₹)</Label>
            <div className="relative">
              <Input
                id="expectedSalary"
                type="number"
                min="0"
                placeholder="e.g. 50000"
                {...register('expectedSalary')}
                disabled={isFieldDisabled('expectedSalary')}
                className="rounded-xl h-11 pl-10 border-slate-200 focus-visible:ring-[#A05AFF] shadow-xs transition-all bg-white"
              />
              <IndianRupee className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
            </div>
          </div>

          {/* Notes Input Area */}
          <div className="space-y-2 md:col-span-2 group">
            <Label htmlFor="notes" className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 group-focus-within:text-[#A05AFF] transition-colors">Additional Candidate Profile Annotations</Label>
            <Textarea 
              id="notes" 
              placeholder="Highlight particular specializations, awards, or custom placement tracking notes..."
              {...register('notes')} 
              disabled={isFieldDisabled('notes')} 
              className="rounded-xl border-slate-200 focus-visible:ring-[#A05AFF] shadow-xs transition-all min-h-[100px] bg-white"
            />
          </div>
        </CardContent>
      </Card>

      {/* 5. Supporting Materials File Upload Card */}
      <Card className="rounded-xl border border-none bg-white shadow-sm overflow-hidden">
        <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-white pb-4 pt-5 px-6 md:px-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#1BCFB4]/10 text-[#1BCFB4] rounded-xl">
              <FileText className="h-4 w-4 stroke-[2.2]" />
            </div>
            <div>
              <CardTitle className="text-sm font-bold tracking-wide text-slate-800 dark:text-white">Supporting Portfolio Materials</CardTitle>
              <CardDescription className="text-xs font-medium text-slate-400">Upload resume attachments, degrees, certificates, and work references</CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-6 md:p-8 space-y-4">
          <div className="mb-2">
            <label className="flex flex-col items-center justify-center cursor-pointer gap-3 rounded-xl border-2 border-dashed border-slate-200 hover:border-[#A05AFF]/50 p-6 text-center transition-all bg-slate-50/50 dark:bg-slate-900/10 hover:bg-[#A05AFF]/5 group">
              <div className="p-3 rounded-xl bg-white border border-slate-200 text-slate-400 group-hover:text-[#A05AFF] group-hover:scale-105 transition-all shadow-xs">
                <Upload className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                  {uploading ? 'Processing Server Streaming Upload...' : 'Click to add documentation packages'}
                </p>
                <p className="text-xs text-slate-400">Max 10 files, up to 10MB each (Images, PDF, DOC, DOCX)</p>
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

          {/* Document Uploads Map List Layout */}
          {documents.length > 0 && (
            <div className="grid gap-2 sm:grid-cols-2 pt-1 animate-in fade-in duration-200">
              {documents.map((doc, i) => (
                <div key={i} className="flex items-center justify-between rounded-xl border border-slate-100 dark:border-slate-800 p-3 bg-white group hover:border-[#A05AFF]/40 transition-colors shadow-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="p-2 bg-[#A05AFF]/10 text-[#A05AFF] rounded-lg shrink-0">
                      <FileText className="h-4 w-4" />
                    </div>
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-[#A05AFF] hover:text-[#9E58FF] hover:underline truncate max-w-[200px]"
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
                    className="h-8 w-8 rounded-lg text-slate-400 hover:text-[#FE9496] hover:bg-[#FE9496]/10 transition-all"
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 6. Legal Data Consent Blocks */}
      {showConsent && (
        <div className="rounded-xl border border-none bg-white p-6 shadow-sm space-y-4 dark:bg-slate-900 animate-in fade-in duration-300">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <ClipboardCheck className="h-4 w-4 text-[#A05AFF]" />
            Declaration & System Data Consents
          </h4>
          
          <div className="space-y-4 pt-1">
            <label className="flex items-start gap-3 text-sm font-medium text-slate-600 dark:text-slate-400 cursor-pointer select-none group">
              <input
                type="checkbox"
                id="profileSharingConsent"
                {...register('profileSharingConsent')}
                className="mt-1 h-4.5 w-4.5 rounded-md border-slate-300 text-[#A05AFF] focus:ring-[#A05AFF] cursor-pointer accent-[#A05AFF]"
                required
              />
              <span className="group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors leading-relaxed">
                I consent to share my profile with schools on the School Recruitment Network for recruitment purposes. *
              </span>
            </label>

            <label className="flex items-start gap-3 text-sm font-medium text-slate-600 dark:text-slate-400 cursor-pointer select-none group">
              <input
                type="checkbox"
                id="contactConsent"
                {...register('contactConsent')}
                className="mt-1 h-4.5 w-4.5 rounded-md border-slate-300 text-[#A05AFF] focus:ring-[#A05AFF] cursor-pointer accent-[#A05AFF]"
                required
              />
              <span className="group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors leading-relaxed">
                I consent to be contacted by schools regarding job opportunities. *
              </span>
            </label>
          </div>
        </div>
      )}

      {/* Global Form Submit Action Control Button */}
      <Button 
        type="submit" 
        disabled={isSubmitting || isLoading || uploading}
        className="w-full bg-gradient-to-r from-[#A05AFF] via-[#9E58FF] to-[#4BCBEB] hover:opacity-95 text-white font-bold h-12 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 text-base border-none"
      >
        {isSubmitting || isLoading ? 'Committing Modifications...' : submitButtonText}
      </Button>
    </form>
  );
}