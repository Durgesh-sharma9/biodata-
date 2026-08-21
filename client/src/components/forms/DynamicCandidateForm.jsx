import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { 
  Upload, X, FileText, User, Camera, Calendar, Mail, Phone, 
  MapPin, Sparkles, ClipboardCheck, AlertCircle, IndianRupee, 
  FileUp, Briefcase, Loader2 
} from 'lucide-react';
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

  const professionFields = POSITION_FIELDS[position] || {};

  useEffect(() => {
    if (initialValues) {
      reset(initialValues);
      setProfilePhoto(initialValues.profilePhoto || null);
      if (initialValues.stateId || initialValues.cityId || initialValues.area || initialValues.address || initialValues.latitude || initialValues.longitude || initialValues.workingRadius) {
        setLocation({
          stateId: initialValues.stateId,
          cityId: initialValues.cityId,
          area: initialValues.area || '',
          address: initialValues.address || '',
          latitude: initialValues.latitude ?? '',
          longitude: initialValues.longitude ?? '',
          workingRadius: initialValues.workingRadius ?? '',
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
      area: location.area,
      address: location.address,
      latitude: location.latitude,
      longitude: location.longitude,
      workingRadius: location.workingRadius,
    });
  };

  const isFieldDisabled = (fieldName) => disabledFields.includes(fieldName);

  const renderField = (fieldName, fieldConfig) => {
    const { type, label, options } = fieldConfig;

    switch (type) {
      case 'multi-select':
        return (
          <div key={fieldName} className="space-y-1 group animate-in fade-in duration-200">
            <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">{label}</Label>
            <Controller
              name={fieldName}
              control={control}
              render={({ field }) => (
                <MultiSelect
                  options={Array.isArray(options) ? options : settings?.[options] || []}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={`Select ${label.toLowerCase()}`}
                  className="rounded-lg min-h-9 border-slate-200 text-xs"
                />
              )}
            />
          </div>
        );

      case 'select':
        return (
          <div key={fieldName} className="space-y-1 group animate-in fade-in duration-200">
            <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">{label}</Label>
            <Controller
              name={fieldName}
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="rounded-lg h-9 border-slate-200 bg-white font-medium text-xs focus:ring-[#A05AFF]">
                    <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg text-xs">
                    {Array.isArray(options) ? (
                      options.map((opt) => (
                        <SelectItem key={opt} value={opt} className="rounded-md font-medium text-xs">
                          {opt}
                        </SelectItem>
                      ))
                    ) : (
                      settings?.[options]?.map((opt) => (
                        <SelectItem key={opt} value={opt} className="rounded-md font-medium text-xs">
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
          <div key={fieldName} className="flex items-center space-x-2.5 p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 group transition-all duration-200 animate-in fade-in duration-200">
            <input
              type="checkbox"
              id={fieldName}
              {...register(fieldName)}
              className="h-3.5 w-3.5 rounded border-slate-300 text-[#A05AFF] focus:ring-[#A05AFF] accent-[#A05AFF] cursor-pointer"
            />
            <Label htmlFor={fieldName} className="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
              {label}
            </Label>
          </div>
        );

      case 'number':
        return (
          <div key={fieldName} className="space-y-1 group animate-in fade-in duration-200">
            <Label htmlFor={fieldName} className="text-xs font-semibold text-slate-700 dark:text-slate-300">{label}</Label>
            <Input 
              id={fieldName} 
              type="number" 
              min="0" 
              {...register(fieldName)} 
              className="rounded-lg h-9 border-slate-200 text-xs font-medium focus-visible:ring-[#A05AFF]"
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 max-w-4xl mx-auto antialiased">
      
      {/* 1. Basic Personal Details Card */}
      <Card>
        <CardHeader className="bg-white dark:bg-slate-900 py-3 px-4 sm:px-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#4BCBEB]/10 text-[#4BCBEB] rounded-lg">
              <User className="h-4 w-4 stroke-[2.2]" />
            </div>
            <div>
              <CardTitle className="text-xs sm:text-sm font-bold tracking-wide text-slate-800 dark:text-white">Basic Personal Details</CardTitle>
              <CardDescription className="text-[11px] font-medium text-slate-400">Candidate personal identity and contact details</CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-4 sm:p-5 space-y-4">
          
          {/* Compact Avatar Photo Banner */}
          <div className="flex items-center gap-4 p-3 rounded-lg bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
            {profilePhoto ? (
              <div className="relative group shrink-0">
                <img
                  src={profilePhoto}
                  alt="Profile"
                  className="h-14 w-14 rounded-full object-cover border-2 border-[#A05AFF] shadow-xs"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full shadow-md scale-90 bg-rose-500 text-white hover:bg-rose-600"
                  onClick={removeProfilePhoto}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <label className="flex h-14 w-14 cursor-pointer flex-col items-center justify-center rounded-full border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-[#A05AFF] bg-white dark:bg-slate-900 hover:bg-[#A05AFF]/5 transition-all shadow-xs shrink-0 group">
                <Camera className="h-4 w-4 text-slate-400 group-hover:text-[#A05AFF] transition-all" />
                <span className="text-[8px] font-bold text-slate-400 mt-0.5 uppercase tracking-wider group-hover:text-[#A05AFF]">Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProfilePhotoUpload}
                  disabled={uploading}
                />
              </label>
            )}
            <div className="space-y-0.5 min-w-0">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Candidate Profile Photo</h4>
              <p className="text-[11px] text-slate-400">Upload a clear portrait photo (JPG/PNG up to 5MB).</p>
            </div>
          </div>

          <div className="grid gap-3.5 grid-cols-1 sm:grid-cols-2">
            {/* Full Name */}
            <div className="space-y-1 group">
              <Label htmlFor="fullName" className="text-xs font-semibold text-slate-700 dark:text-slate-300">Full Name *</Label>
              <div className="relative">
                <Input 
                  id="fullName" 
                  placeholder="e.g. John Doe"
                  {...register('fullName')} 
                  disabled={isFieldDisabled('fullName')} 
                  className="rounded-lg h-9 pl-9 border-slate-200 focus-visible:ring-[#A05AFF] text-xs font-medium"
                />
                <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              </div>
              {errors.fullName && <div className="flex items-center gap-1 text-[11px] font-semibold text-rose-500 mt-0.5"><AlertCircle className="h-3 w-3 shrink-0" /><span>{errors.fullName.message}</span></div>}
            </div>

            {/* Mobile Number */}
            <div className="space-y-1 group">
              <Label htmlFor="mobile" className="text-xs font-semibold text-slate-700 dark:text-slate-300">Mobile Number *</Label>
              <div className="relative">
                <Input
                  id="mobile"
                  placeholder="e.g. 9876543210"
                  {...register('mobile')}
                  disabled={isFieldDisabled('mobile')}
                  className="rounded-lg h-9 pl-9 border-slate-200 focus-visible:ring-[#A05AFF] text-xs font-medium"
                />
                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              </div>
              {errors.mobile && <div className="flex items-center gap-1 text-[11px] font-semibold text-rose-500 mt-0.5"><AlertCircle className="h-3 w-3 shrink-0" /><span>{errors.mobile.message}</span></div>}
            </div>

            {/* Email */}
            <div className="space-y-1 group">
              <Label htmlFor="email" className="text-xs font-semibold text-slate-700 dark:text-slate-300">Email Address</Label>
              <div className="relative">
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="e.g. john@example.com"
                  {...register('email')} 
                  disabled={isFieldDisabled('email')} 
                  className="rounded-lg h-9 pl-9 border-slate-200 focus-visible:ring-[#A05AFF] text-xs font-medium"
                />
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              </div>
              {errors.email && <div className="flex items-center gap-1 text-[11px] font-semibold text-rose-500 mt-0.5"><AlertCircle className="h-3 w-3 shrink-0" /><span>{errors.email.message}</span></div>}
            </div>

            {/* Gender Select */}
            <div className="space-y-1 group">
              <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Gender</Label>
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange} disabled={isFieldDisabled('gender')}>
                    <SelectTrigger className="rounded-lg h-9 border-slate-200 bg-white font-medium text-xs focus:ring-[#A05AFF]">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent className="rounded-lg text-xs">
                      <SelectItem value="Male" className="rounded-md font-medium text-xs">Male</SelectItem>
                      <SelectItem value="Female" className="rounded-md font-medium text-xs">Female</SelectItem>
                      <SelectItem value="Other" className="rounded-md font-medium text-xs">Other</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* Date of Birth */}
            <div className="space-y-1 group sm:col-span-2">
              <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Date of Birth</Label>
              <div className="relative">
                <Input 
                  type="date" 
                  {...register('dob')} 
                  disabled={isFieldDisabled('dob')} 
                  className="rounded-lg h-9 pl-9 border-slate-200 focus-visible:ring-[#A05AFF] text-xs font-medium"
                />
                <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Street Address */}
            <div className="space-y-1 sm:col-span-2 group">
              <Label htmlFor="address" className="text-xs font-semibold text-slate-700 dark:text-slate-300">Complete Address</Label>
              <div className="relative">
                <Textarea 
                  id="address" 
                  placeholder="House/Apartment no., building, street, area landmark..."
                  {...register('address')} 
                  disabled={isFieldDisabled('address')} 
                  className="rounded-lg border-slate-200 focus-visible:ring-[#A05AFF] pl-9 pt-2 text-xs font-medium min-h-[60px]"
                />
                <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              </div>
            </div>

            {/* Location Select Module */}
            <div className="sm:col-span-2 rounded-lg bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 p-3">
              <LocationSelect value={location} onChange={setLocation} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Target Deployment Role Card */}
      <Card>
        <CardHeader className="bg-white dark:bg-slate-900 py-3 px-4 sm:px-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#9E58FF]/10 text-[#9E58FF] rounded-lg">
              <Briefcase className="h-4 w-4 stroke-[2.2]" />
            </div>
            <div>
              <CardTitle className="text-xs sm:text-sm font-bold tracking-wide text-slate-800 dark:text-white">Target Position & Role</CardTitle>
              <CardDescription className="text-[11px] font-medium text-slate-400">Select the position designation for this candidate</CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-4 sm:p-5 group">
          <div className="space-y-1">
            <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Position Designation *</Label>
            <Controller
              name="position"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isFieldDisabled('position')}
                >
                  <SelectTrigger className="rounded-lg h-9 border-slate-200 bg-white font-medium text-xs focus:ring-[#A05AFF]">
                    <SelectValue placeholder="Select position (e.g. Teacher, Driver, Accountant...)" />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg max-h-[300px] text-xs">
                    {(positions || settings?.positions || []).map((p) => {
                      const positionValue = typeof p === 'object' ? p.name : p;
                      return (
                        <SelectItem key={positionValue} value={positionValue} className="rounded-md font-medium text-xs">
                          {positionValue}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.position && <div className="flex items-center gap-1 text-[11px] font-semibold text-rose-500 mt-0.5"><AlertCircle className="h-3 w-3 shrink-0" /><span>{errors.position.message}</span></div>}
          </div>
        </CardContent>
      </Card>

      {/* 3. Conditional Dynamic Role Fields Card */}
      {position && professionFields && Object.keys(professionFields).length > 0 && (
        <Card className="border-l-4 border-l-[#A05AFF] animate-in fade-in duration-300">
          <CardHeader className="bg-white dark:bg-slate-900 py-3 px-4 sm:px-5">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-[#A05AFF]/10 text-[#A05AFF] rounded-lg">
                <FileUp className="h-4 w-4 stroke-[2.2]" />
              </div>
              <div>
                <CardTitle className="text-xs sm:text-sm font-bold tracking-wide text-slate-800 dark:text-white">{position} Specific Details</CardTitle>
                <CardDescription className="text-[11px] font-medium text-slate-400">Additional requirements specifically requested for {position} roles</CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="grid gap-3.5 sm:grid-cols-2 p-4 sm:p-5">
            {Object.entries(professionFields).map(([fieldName, fieldConfig]) =>
              renderField(fieldName, fieldConfig)
            )}
          </CardContent>
        </Card>
      )}

      {/* 4. Secondary Core Background Card */}
      <Card>
        <CardHeader className="bg-white dark:bg-slate-900 py-3 px-4 sm:px-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#FE9496]/10 text-[#FE9496] rounded-lg">
              <ClipboardCheck className="h-4 w-4 stroke-[2.2]" />
            </div>
            <div>
              <CardTitle className="text-xs sm:text-sm font-bold tracking-wide text-slate-800 dark:text-white">Qualifications & Experience</CardTitle>
              <CardDescription className="text-[11px] font-medium text-slate-400">Enter candidate qualifications, total experience, expected salary, and notes</CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="grid gap-3.5 sm:grid-cols-2 p-4 sm:p-5">
          {/* Qualifications */}
          <div className="space-y-1 group sm:col-span-2">
            <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Qualifications</Label>
            <Controller
              name="qualifications"
              control={control}
              render={({ field }) => (
                <MultiSelect
                  options={settings?.qualifications || []}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Select qualifications (B.Ed, MA, BSc, 10th...)"
                  className="rounded-lg border-slate-200 min-h-9 text-xs"
                />
              )}
            />
          </div>

          {/* Years of Experience */}
          <div className="space-y-1 group">
            <Label htmlFor="experienceYears" className="text-xs font-semibold text-slate-700 dark:text-slate-300">Total Experience (Years)</Label>
            <div className="relative">
              <Input
                id="experienceYears"
                type="number"
                min="0"
                placeholder="e.g. 3"
                {...register('experienceYears')}
                disabled={isFieldDisabled('experienceYears')}
                className="rounded-lg h-9 pl-9 border-slate-200 focus-visible:ring-[#A05AFF] text-xs font-medium"
              />
              <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            </div>
          </div>

          {/* Expected Salary */}
          <div className="space-y-1 group">
            <Label htmlFor="expectedSalary" className="text-xs font-semibold text-slate-700 dark:text-slate-300">Expected Monthly Salary (₹)</Label>
            <div className="relative">
              <Input
                id="expectedSalary"
                type="number"
                min="0"
                placeholder="e.g. 35000"
                {...register('expectedSalary')}
                disabled={isFieldDisabled('expectedSalary')}
                className="rounded-lg h-9 pl-9 border-slate-200 focus-visible:ring-[#A05AFF] text-xs font-medium"
              />
              <IndianRupee className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            </div>
          </div>

          {/* Notes Input Area */}
          <div className="space-y-1 sm:col-span-2 group">
            <Label htmlFor="notes" className="text-xs font-semibold text-slate-700 dark:text-slate-300">Additional Notes & Comments</Label>
            <Textarea 
              id="notes" 
              placeholder="Highlight candidate strengths, achievements, or custom notes..."
              {...register('notes')} 
              disabled={isFieldDisabled('notes')} 
              className="rounded-lg border-slate-200 focus-visible:ring-[#A05AFF] text-xs font-medium min-h-[65px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* 5. Supporting Materials File Upload Card */}
      <Card>
        <CardHeader className="bg-white dark:bg-slate-900 py-3 px-4 sm:px-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#1BCFB4]/10 text-[#1BCFB4] rounded-lg">
              <FileText className="h-4 w-4 stroke-[2.2]" />
            </div>
            <div>
              <CardTitle className="text-xs sm:text-sm font-bold tracking-wide text-slate-800 dark:text-white">Resume & Documents Upload</CardTitle>
              <CardDescription className="text-[11px] font-medium text-slate-400">Upload resume attachments, degrees, certificates, and ID documents</CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-4 sm:p-5 space-y-3">
          <div>
            <label className="flex flex-col items-center justify-center cursor-pointer gap-2 rounded-lg border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-[#A05AFF] p-4 text-center transition-all bg-slate-50/50 dark:bg-slate-900/10 hover:bg-[#A05AFF]/5 group">
              <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 group-hover:text-[#A05AFF] transition-all shadow-xs">
                <Upload className="h-4 w-4" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
                  {uploading ? 'Uploading files...' : 'Click or Drag files to upload'}
                </p>
                <p className="text-[10px] text-slate-400">Supports PDF, DOC, DOCX, JPG, PNG up to 10MB each (max 10 files)</p>
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

          {/* Document Uploads List */}
          {documents.length > 0 && (
            <div className="grid gap-2 sm:grid-cols-2 pt-1 animate-in fade-in duration-200">
              {documents.map((doc, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border border-slate-200 dark:border-slate-800 p-2.5 bg-white dark:bg-slate-900 group shadow-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="p-1.5 bg-[#A05AFF]/10 text-[#A05AFF] rounded-md shrink-0">
                      <FileText className="h-3.5 w-3.5" />
                    </div>
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-[#A05AFF] hover:underline truncate max-w-[180px]"
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
                    className="h-7 w-7 rounded-md text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all"
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
        <Card className="p-4 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <ClipboardCheck className="h-4 w-4 text-[#A05AFF]" />
            Declaration & Data Consents
          </h4>
          
          <div className="space-y-3 pt-1">
            <label className="flex items-start gap-2.5 text-xs font-medium text-slate-600 dark:text-slate-400 cursor-pointer select-none group">
              <input
                type="checkbox"
                id="profileSharingConsent"
                {...register('profileSharingConsent')}
                className="mt-0.5 h-3.5 w-3.5 rounded border-slate-300 text-[#A05AFF] focus:ring-[#A05AFF] cursor-pointer accent-[#A05AFF]"
                required
              />
              <span className="group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors leading-relaxed">
                I consent to share my profile with schools on the recruitment network for employment opportunities. *
              </span>
            </label>

            <label className="flex items-start gap-2.5 text-xs font-medium text-slate-600 dark:text-slate-400 cursor-pointer select-none group">
              <input
                type="checkbox"
                id="contactConsent"
                {...register('contactConsent')}
                className="mt-0.5 h-3.5 w-3.5 rounded border-slate-300 text-[#A05AFF] focus:ring-[#A05AFF] cursor-pointer accent-[#A05AFF]"
                required
              />
              <span className="group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors leading-relaxed">
                I consent to be contacted by schools regarding job vacancies. *
              </span>
            </label>
          </div>
        </Card>
      )}

      {/* Bottom Form Actions Control Bar */}
      <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3.5 sm:p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <Button
          type="button"
          variant="outline"
          asChild
          className="w-full sm:w-auto h-9 rounded-lg border-slate-200 text-slate-600 dark:text-slate-300 font-semibold text-xs px-5"
        >
          <Link to="/candidates">Cancel</Link>
        </Button>

        <Button 
          type="submit" 
          disabled={isSubmitting || isLoading || uploading}
          className="w-full sm:w-auto bg-gradient-to-r from-[#A05AFF] via-[#9E58FF] to-[#4BCBEB] hover:opacity-95 text-white font-bold h-9 px-6 rounded-lg shadow-md shadow-[#A05AFF]/20 transition-all text-xs"
        >
          {isSubmitting || isLoading ? (
            <span className="flex items-center gap-1.5">
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving...
            </span>
          ) : (
            submitButtonText
          )}
        </Button>
      </div>
    </form>
  );
}