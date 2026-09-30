import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  MapPin, 
  Building2, 
  Phone, 
  Mail, 
  Loader2, 
  Save, 
  Navigation, 
  Lock, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  X,
  Compass,
  Upload,
  Trash2,
  Globe,
  Calendar,
  User,
  Clock,
  GraduationCap,
  Award,
  FileText,
  MessageSquare,
  ShieldCheck
} from 'lucide-react';
import { getMySchool, updateMySchool, uploadFiles } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function SchoolProfile() {
  const queryClient = useQueryClient();
  const { refreshSchool } = useAuth();
  const fileInputRef = useRef(null);

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [logoError, setLogoError] = useState('');

  const [formData, setFormData] = useState({
    schoolName: '',
    logoUrl: '',
    email: '',
    phone: '',
    state: '',
    city: '',
    area: '',
    address: '',
    workingRadius: '',
    // Recruitment & Institutional profile fields
    boardAffiliation: 'CBSE',
    schoolLevel: 'Senior Secondary (K-12)',
    website: '',
    establishedYear: '',
    hrContactPerson: '',
    altPhone: '',
    walkInTimings: '09:00 AM - 03:00 PM (Mon-Sat)',
    aboutSchool: '',
  });

  const { data: school, isLoading } = useQuery({
    queryKey: ['mySchool'],
    queryFn: () => getMySchool().then((r) => r.data.data),
  });

  useEffect(() => {
    if (school) {
      setFormData({
        schoolName: school.schoolName || '',
        logoUrl: school.logoUrl || '',
        email: school.email || '',
        phone: school.phone || '',
        state: school.state || '',
        city: school.city || '',
        area: school.area || '',
        address: school.address || '',
        workingRadius: school.workingRadius || '',
        boardAffiliation: school.boardAffiliation || 'CBSE',
        schoolLevel: school.schoolLevel || 'Senior Secondary (K-12)',
        website: school.website || '',
        establishedYear: school.establishedYear || '',
        hrContactPerson: school.hrContactPerson || '',
        altPhone: school.altPhone || '',
        walkInTimings: school.walkInTimings || '09:00 AM - 03:00 PM (Mon-Sat)',
        aboutSchool: school.aboutSchool || '',
      });
    }
  }, [school]);

  const updateMutation = useMutation({
    mutationFn: (data) => updateMySchool(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mySchool'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['candidates'] });
      if (refreshSchool) refreshSchool();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 5000);
    },
  });

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setLogoError('Please choose a valid image file (PNG, JPG, SVG, WebP)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setLogoError('Image size exceeds 5MB limit');
      return;
    }

    setLogoError('');
    setIsUploadingLogo(true);
    try {
      const res = await uploadFiles([file]);
      const uploadedUrl = res.data?.data?.[0]?.url;
      if (uploadedUrl) {
        setFormData((prev) => ({ ...prev, logoUrl: uploadedUrl }));
        await updateMutation.mutateAsync({ logoUrl: uploadedUrl });
      }
    } catch (err) {
      setLogoError(err?.response?.data?.message || 'Failed to upload logo. Please try again.');
    } finally {
      setIsUploadingLogo(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveLogo = async () => {
    setFormData((prev) => ({ ...prev, logoUrl: '' }));
    await updateMutation.mutateAsync({ logoUrl: null });
  };

  const handleSave = () => {
    if (!school) return;

    const formDataToSubmit = {
      schoolName: formData.schoolName,
      logoUrl: formData.logoUrl || null,
      email: formData.email,
      phone: formData.phone,
      state: formData.state,
      city: formData.city,
      area: formData.area,
      address: formData.address,
      workingRadius: formData.workingRadius ? Number(formData.workingRadius) : undefined,
      boardAffiliation: formData.boardAffiliation || 'CBSE',
      schoolLevel: formData.schoolLevel || 'Senior Secondary (K-12)',
      website: formData.website || '',
      establishedYear: formData.establishedYear ? Number(formData.establishedYear) : undefined,
      hrContactPerson: formData.hrContactPerson || '',
      altPhone: formData.altPhone || '',
      walkInTimings: formData.walkInTimings || '',
      aboutSchool: formData.aboutSchool || '',
    };

    updateMutation.mutate(formDataToSubmit);
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center space-y-4 antialiased bg-slate-50/50 dark:bg-slate-950">
        <div className="relative flex items-center justify-center">
          <Loader2 className="h-9 w-9 text-purple-600 animate-spin relative z-10" />
          <div className="absolute inset-0 bg-purple-100 dark:bg-purple-950/50 rounded-full blur-xl animate-pulse scale-150" />
        </div>
        <p className="text-slate-500 dark:text-slate-400 font-semibold tracking-wide text-xs">
          Loading school profile...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-5 w-full max-w-7xl mx-auto antialiased text-slate-800 dark:text-slate-200 pb-24 sm:pb-12">
      
      {/* Compact Header Bar with Reference Pastel Gradient */}
      <div className="bg-gradient-to-r from-[#F0FCF5] via-[#EFF6FF] to-[#FAF5FF] dark:from-slate-800/90 dark:via-slate-800/70 dark:to-slate-800/90 px-3.5 py-3 sm:px-5 sm:py-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl bg-white dark:bg-slate-700 text-[#8A3BD4] flex items-center justify-center border border-slate-200/80 shrink-0 overflow-hidden shadow-2xs">
            {formData.logoUrl ? (
              <img src={formData.logoUrl} alt="School Logo" className="h-full w-full object-contain p-1" />
            ) : (
              <Building2 className="h-5 w-5" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-sm sm:text-base font-bold tracking-tight text-slate-900 dark:text-white truncate">
                {formData.schoolName || 'School Profile'}
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-[#8A3BD4] dark:bg-purple-950/40 dark:text-purple-300 border border-purple-200/70 dark:border-purple-800 shrink-0">
                Active Recruiter
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate mt-0.5">
              Manage school branding, affiliation & campus address
            </p>
          </div>
        </div>
      </div>

      {/* Success Notification Alert */}
      {saveSuccess && (
        <div className="px-4 py-2.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2 font-semibold">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>School profile information and logo updated successfully!</span>
          </div>
          <button 
            type="button" 
            onClick={() => setSaveSuccess(false)}
            className="text-emerald-600 hover:text-emerald-800 dark:text-emerald-400"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Error Notification Alert */}
      {updateMutation.isError && (
        <div className="px-4 py-2.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/80 rounded-xl text-xs text-rose-800 dark:text-rose-300 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2 font-semibold">
            <AlertCircle className="h-4 w-4 text-rose-600 dark:text-rose-400 shrink-0" />
            <span>{updateMutation.error?.response?.data?.message || 'Failed to update school profile. Please try again.'}</span>
          </div>
          <button 
            type="button" 
            onClick={() => updateMutation.reset()}
            className="text-rose-600 hover:text-rose-800 dark:text-rose-400"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Main 2-Column Responsive Layout */}
      <div className="grid gap-5 grid-cols-1 lg:grid-cols-12">
        
        {/* Left Column: School & Institutional Information (6 cols on lg) */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* Card 1: Basic Information & School Logo */}
          <Card className="border border-slate-200/80 dark:border-slate-800 shadow-xs rounded-2xl overflow-hidden">
            <CardHeader className="px-4 py-3 sm:px-5 sm:py-3.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
              <CardTitle className="text-xs sm:text-sm font-bold tracking-tight text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Building2 className="h-4 w-4 text-[#0F766E]" />
                Basic Information & Branding
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-5 space-y-4">
              
              {/* School Logo Upload & Preview Section - Compact & Professional */}
              <div className="p-3 sm:p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 flex items-center gap-3.5">
                <div className="relative group shrink-0">
                  <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 flex items-center justify-center overflow-hidden shadow-2xs">
                    {formData.logoUrl ? (
                      <img
                        src={formData.logoUrl}
                        alt="School Logo"
                        className="h-full w-full object-contain p-1 rounded-xl"
                      />
                    ) : (
                      <div className="text-center p-1.5">
                        <Building2 className="h-6 w-6 text-slate-400 mx-auto mb-0.5" />
                        <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider block">No Logo</span>
                      </div>
                    )}
                  </div>
                  {isUploadingLogo && (
                    <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center">
                      <Loader2 className="h-5 w-5 text-white animate-spin" />
                    </div>
                  )}
                </div>

                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">School Official Logo</h4>
                    {formData.logoUrl && (
                      <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/60 shrink-0">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    PNG, JPG, SVG up to 5MB
                  </p>

                  {logoError && (
                    <p className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3 shrink-0" /> {logoError}
                    </p>
                  )}

                  <div className="flex items-center gap-2 pt-1 flex-wrap">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleLogoUpload}
                      accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
                      className="hidden"
                    />
                    <Button
                      type="button"
                      size="sm"
                      disabled={isUploadingLogo}
                      onClick={() => fileInputRef.current?.click()}
                      className="h-8 px-3 text-xs font-semibold bg-gradient-to-r from-[#8A3BD4] to-[#A855F7] hover:from-[#7B2CBF] hover:to-[#8A3BD4] text-white rounded-lg shadow-xs hover:shadow transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      {isUploadingLogo ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          <span>Uploading...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="h-3.5 w-3.5" />
                          <span>{formData.logoUrl ? 'Change' : 'Upload'}</span>
                        </>
                      )}
                    </Button>

                    {formData.logoUrl && (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        disabled={isUploadingLogo}
                        onClick={handleRemoveLogo}
                        className="h-8 px-3 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50/70 hover:bg-rose-100/80 border border-rose-200 dark:border-rose-900/60 dark:bg-rose-950/30 rounded-full transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5 text-rose-500" />
                        <span>Remove</span>
                      </Button>
                    )}
                  </div>
                </div>
              </div>


              {/* School Name */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">School Name</label>
                <Input
                  value={formData.schoolName}
                  onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                  placeholder="Enter school name"
                  className="h-9 px-3 text-xs bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-medium focus:border-[#0F766E]"
                />
              </div>

              {/* Email (Account ID) & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Email (Account ID)</label>
                    <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                      <Lock className="h-2.5 w-2.5 text-slate-400" /> Read-Only
                    </span>
                  </div>
                  <Input
                    value={formData.email}
                    readOnly
                    disabled
                    className="h-9 px-3 text-xs bg-slate-100/80 dark:bg-slate-950 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 cursor-not-allowed font-medium select-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                    <Phone className="h-3 w-3 text-[#0F766E]" /> Primary Phone Number
                  </label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. 9876543210"
                    className="h-9 px-3 text-xs border-slate-200 dark:border-slate-800 focus:border-[#0F766E]/60 font-medium"
                  />
                </div>
              </div>

            </CardContent>
          </Card>

          {/* Card 2: Academic & Institutional Profile (NEW) */}
          <Card className="border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <CardHeader className="px-4 py-3 sm:px-5 sm:py-3.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
              <CardTitle className="text-xs sm:text-sm font-bold tracking-tight text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-[#0F766E]" />
                Academic & Institutional Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-5 space-y-3.5">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Board Affiliation */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                    <Award className="h-3 w-3 text-[#0F766E]" /> Education Board / Affiliation
                  </label>
                  <select
                    value={formData.boardAffiliation}
                    onChange={(e) => setFormData({ ...formData, boardAffiliation: e.target.value })}
                    className="w-full h-9 px-3 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-200 font-medium focus:outline-none focus:border-[#0F766E]"
                  >
                    <option value="CBSE">CBSE (Central Board of Secondary Education)</option>
                    <option value="ICSE">ICSE / ISC (CISCE Board)</option>
                    <option value="State Board">State Board (RBSE / UP / Maharashtra / etc.)</option>
                    <option value="IB">IB (International Baccalaureate)</option>
                    <option value="Cambridge">Cambridge Assessment / IGCSE</option>
                    <option value="Other">Other Affiliation</option>
                  </select>
                </div>

                {/* School Grade Level */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                    School Level
                  </label>
                  <select
                    value={formData.schoolLevel}
                    onChange={(e) => setFormData({ ...formData, schoolLevel: e.target.value })}
                    className="w-full h-9 px-3 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-200 font-medium focus:outline-none focus:border-[#0F766E]"
                  >
                    <option value="Senior Secondary (K-12)">Senior Secondary (Pre-Primary to 12th)</option>
                    <option value="Secondary (K-10)">Secondary (Pre-Primary to 10th)</option>
                    <option value="Middle School (K-8)">Middle School (Pre-Primary to 8th)</option>
                    <option value="Primary School (K-5)">Primary School (Pre-Primary to 5th)</option>
                    <option value="Pre-School / Kindergarten">Play Group / Pre-School</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Year Established */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-slate-400" /> Established Year
                  </label>
                  <Input
                    type="number"
                    min="1800"
                    max="2100"
                    value={formData.establishedYear}
                    onChange={(e) => setFormData({ ...formData, establishedYear: e.target.value })}
                    placeholder="e.g. 2008"
                    className="h-9 px-3 text-xs border-slate-200 dark:border-slate-800 font-medium"
                  />
                </div>

                {/* Official Website */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                    <Globe className="h-3 w-3 text-slate-400" /> Official Website / Portal
                  </label>
                  <Input
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="e.g. https://aryaschool.edu.in"
                    className="h-9 px-3 text-xs border-slate-200 dark:border-slate-800 font-medium"
                  />
                </div>
              </div>

            </CardContent>
          </Card>

        </div>

        {/* Right Column: Campus Location & Recruitment Desk (6 cols on lg) */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* Card 3: Campus Location & Address */}
          <Card className="border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <CardHeader className="px-4 py-3 sm:px-5 sm:py-3.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
              <CardTitle className="text-xs sm:text-sm font-bold tracking-tight text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#0F766E]" />
                Campus Location & Address
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-5 space-y-3.5">
              {/* State & City side-by-side */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">State</label>
                  <Input
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    placeholder="e.g. Rajasthan"
                    className="h-9 px-3 text-xs border-slate-200 dark:border-slate-800 font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">City / District</label>
                  <Input
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g. Jaipur"
                    className="h-9 px-3 text-xs border-slate-200 dark:border-slate-800 font-medium"
                  />
                </div>
              </div>

              {/* Area / Locality */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Area / Locality</label>
                <Input
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  placeholder="e.g. Vaishali Nagar / Bagru"
                  className="h-9 px-3 text-xs border-slate-200 dark:border-slate-800 font-medium"
                />
              </div>

              {/* Full Address */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                  Full Campus Address / Landmark
                </label>
                <Input
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Street address, colony, or nearby landmark for walk-in applicants"
                  className="h-9 px-3 text-xs border-slate-200 dark:border-slate-800 font-medium"
                />
              </div>
            </CardContent>
          </Card>

          {/* Card 4: Recruitment Desk & Applicant Communication */}
          <Card className="border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <CardHeader className="px-4 py-3 sm:px-5 sm:py-3.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
              <CardTitle className="text-xs sm:text-sm font-bold tracking-tight text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <User className="h-4 w-4 text-[#0F766E]" />
                Recruitment Desk & Applicant Communication
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-5 space-y-3.5">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* HR Contact Person */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                    HR / Recruiter In-Charge Name
                  </label>
                  <Input
                    value={formData.hrContactPerson}
                    onChange={(e) => setFormData({ ...formData, hrContactPerson: e.target.value })}
                    placeholder="e.g. Principal / Administrator"
                    className="h-9 px-3 text-xs border-slate-200 dark:border-slate-800 font-medium"
                  />
                </div>

                {/* Alternate / WhatsApp Number */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                    <MessageSquare className="h-3 w-3 text-emerald-500" /> WhatsApp / Alternate Inquiry No.
                  </label>
                  <Input
                    value={formData.altPhone}
                    onChange={(e) => setFormData({ ...formData, altPhone: e.target.value })}
                    placeholder="e.g. 9829012345"
                    className="h-9 px-3 text-xs border-slate-200 dark:border-slate-800 font-medium"
                  />
                </div>
              </div>

              {/* Walk-in & Interview Visiting Hours */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                  <Clock className="h-3 w-3 text-[#0F766E]" /> Walk-in & Reception Timings for Candidates
                </label>
                <Input
                  value={formData.walkInTimings}
                  onChange={(e) => setFormData({ ...formData, walkInTimings: e.target.value })}
                  placeholder="e.g. 09:00 AM - 03:00 PM (Monday to Saturday)"
                  className="h-9 px-3 text-xs border-slate-200 dark:border-slate-800 font-medium"
                />
              </div>

              {/* About School / Overview for Candidates */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                  <FileText className="h-3 w-3 text-slate-400" /> About School / Campus Overview
                </label>
                <textarea
                  rows={4}
                  value={formData.aboutSchool}
                  onChange={(e) => setFormData({ ...formData, aboutSchool: e.target.value })}
                  placeholder="Briefly describe your school environment, teacher culture, campus facilities, or student strength..."
                  className="w-full p-2.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-200 font-medium focus:outline-none focus:border-[#0F766E] shadow-2xs leading-relaxed"
                />
              </div>

            </CardContent>
          </Card>

        </div>

      </div>

      {/* Floating Bottom-Right Action Button */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex items-center gap-2 sm:gap-3">
        {saveSuccess && (
          <div className="bg-emerald-600 text-white text-xs font-semibold px-3 py-2 rounded-md shadow-md flex items-center gap-1.5 animate-in slide-in-from-bottom-2 fade-in">
            <CheckCircle2 className="h-4 w-4" />
            <span>Saved Successfully!</span>
          </div>
        )}

        <Button
          onClick={handleSave}
          disabled={updateMutation.isPending}
          className="h-10 px-5 bg-gradient-to-r from-[#8A3BD4] to-[#A855F7] hover:from-[#7B2CBF] hover:to-[#8A3BD4] text-white text-xs font-bold rounded-lg shadow-md shadow-purple-500/20 active:translate-y-0 transition-all flex items-center gap-2 cursor-pointer border-none"
        >
          {updateMutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Saving Changes...</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>Save Changes</span>
            </>
          )}
        </Button>
      </div>

    </div>
  );
}
