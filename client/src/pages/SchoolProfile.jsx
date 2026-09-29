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
  Camera,
  Image as ImageIcon
} from 'lucide-react';
import { getMySchool, updateMySchool, uploadFiles } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SchoolLocationPicker } from '@/components/common/SchoolLocationPicker';

export default function SchoolProfile() {
  const queryClient = useQueryClient();
  const { refreshSchool } = useAuth();
  const fileInputRef = useRef(null);

  const [locationData, setLocationData] = useState(null);
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
      });
      if (school.latitude && school.longitude) {
        setLocationData({
          latitude: Number(school.latitude),
          longitude: Number(school.longitude),
        });
      }
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

  const handleLocationChange = (location) => {
    setLocationData(location);
  };

  const handleAddressResolved = (details) => {
    if (details) {
      setFormData((prev) => ({
        ...prev,
        state: details.state || prev.state || '',
        city: details.city || prev.city || '',
        area: details.area || prev.area || '',
        address: details.address || prev.address || '',
      }));
    }
  };

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

    const currentLat = locationData?.latitude ?? school?.latitude;
    const currentLng = locationData?.longitude ?? school?.longitude;

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
      ...(currentLat !== undefined && currentLat !== null ? { latitude: Number(currentLat) } : {}),
      ...(currentLng !== undefined && currentLng !== null ? { longitude: Number(currentLng) } : {}),
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

  const lat = locationData?.latitude ?? school?.latitude;
  const lng = locationData?.longitude ?? school?.longitude;

  return (
    <div className="space-y-4 sm:space-y-5 w-full max-w-7xl mx-auto antialiased text-slate-800 dark:text-slate-200 pb-8">
      
      {/* Compact Header Bar */}
      <div className="bg-white dark:bg-slate-900 px-4 py-3.5 sm:px-5 sm:py-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-[#A05AFF] flex items-center justify-center border border-[#A05AFF]/20 shrink-0 overflow-hidden shadow-2xs">
            {formData.logoUrl ? (
              <img src={formData.logoUrl} alt="School Logo" className="h-full w-full object-contain p-1" />
            ) : (
              <Building2 className="h-5 w-5" />
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white truncate">
                {formData.schoolName || 'School Profile'}
              </h1>
              {school?.schoolId && (
                <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                  #{school.schoolId}
                </span>
              )}
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/70 dark:border-emerald-800">
                Active Recruiter
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate mt-0.5">
              Manage school branding, official logo, contact info, and geo-pinning for candidate proximity search
            </p>
          </div>
        </div>

        {/* Top Save Button (Desktop / Tablet) */}
        <div className="hidden sm:flex items-center gap-2.5 shrink-0">
          <Button
            onClick={handleSave}
            disabled={updateMutation.isPending}
            className="h-9 px-4 bg-gradient-to-r from-[#A05AFF] via-[#9E58FF] to-[#4BCBEB] hover:opacity-95 text-white text-xs font-bold rounded-lg shadow-sm transition-all active:scale-95 disabled:opacity-50"
          >
            {updateMutation.isPending ? (
              <>
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-1.5 h-3.5 w-3.5" />
                Save Changes
              </>
            )}
          </Button>
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
      <div className="grid gap-4 sm:gap-5 grid-cols-1 lg:grid-cols-12">
        
        {/* Left Column: Form Cards (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-4 sm:space-y-4">
          
          {/* Card 1: Basic Information & School Logo */}
          <Card className="border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <CardHeader className="px-4 py-3 sm:px-5 sm:py-3.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
              <CardTitle className="text-xs sm:text-sm font-bold tracking-tight text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Building2 className="h-4 w-4 text-[#A05AFF]" />
                Basic Information & Branding
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-5 space-y-4">
              
              {/* School Logo Upload & Preview Section */}
              <div className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 flex flex-col sm:flex-row items-center sm:items-start gap-4">
                <div className="relative group shrink-0">
                  <div className="h-18 w-18 sm:h-20 sm:w-20 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 flex items-center justify-center overflow-hidden shadow-xs">
                    {formData.logoUrl ? (
                      <img
                        src={formData.logoUrl}
                        alt="School Logo"
                        className="h-full w-full object-contain p-1"
                      />
                    ) : (
                      <div className="text-center p-2">
                        <Building2 className="h-7 w-7 text-slate-400 mx-auto mb-0.5" />
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">No Logo</span>
                      </div>
                    )}
                  </div>
                  {isUploadingLogo && (
                    <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center">
                      <Loader2 className="h-6 w-6 text-white animate-spin" />
                    </div>
                  )}
                </div>

                <div className="space-y-1.5 flex-1 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">School Official Logo</h4>
                    {formData.logoUrl && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/60">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    Upload school crest or logo (PNG, JPG, SVG, max 5MB). Displayed on public application portal & standees.
                  </p>

                  {logoError && (
                    <p className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> {logoError}
                    </p>
                  )}

                  <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
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
                      className="h-8 px-3 text-xs font-bold bg-[#A05AFF] hover:bg-[#8e44ee] text-white rounded-lg shadow-2xs"
                    >
                      {isUploadingLogo ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="h-3.5 w-3.5 mr-1.5" />
                          {formData.logoUrl ? 'Change Logo' : 'Upload Logo'}
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
                        className="h-8 px-2.5 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200 dark:border-rose-900 rounded-lg"
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-1" />
                        Remove
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
                  className="h-9 px-3 text-xs bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-medium focus:border-[#A05AFF]"
                />
              </div>

              {/* Email (Account ID) */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Email (Account ID)</label>
                  <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                    <Lock className="h-2.5 w-2.5 text-slate-400" /> Read-Only
                  </span>
                </div>
                <Input
                  value={formData.email}
                  readOnly
                  disabled
                  className="h-9 px-3 text-xs bg-slate-100/80 dark:bg-slate-950 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 cursor-not-allowed font-medium select-none"
                />
                <p className="text-[10px] text-slate-400 dark:text-slate-500">School account login email is permanent.</p>
              </div>

              {/* Phone Number */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                  <Phone className="h-3 w-3 text-emerald-500" /> Phone Number
                </label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Enter contact phone number"
                  className="h-9 px-3 text-xs border-slate-200 dark:border-slate-800 focus:border-[#A05AFF]/60 font-medium"
                />
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Location & Proximity */}
          <Card className="border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <CardHeader className="px-4 py-3 sm:px-5 sm:py-3.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
              <CardTitle className="text-xs sm:text-sm font-bold tracking-tight text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#A05AFF]" />
                Location & Coverage
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-5 space-y-3">
              {/* State & City side-by-side */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">State</label>
                  <Input
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    placeholder="State"
                    className="h-9 px-3 text-xs border-slate-200 dark:border-slate-800 font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">City</label>
                  <Input
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="City"
                    className="h-9 px-3 text-xs border-slate-200 dark:border-slate-800 font-medium"
                  />
                </div>
              </div>

              {/* Area & Search Radius side-by-side */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Area / Locality</label>
                  <Input
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    placeholder="e.g. Bagru Nagar"
                    className="h-9 px-3 text-xs border-slate-200 dark:border-slate-800 font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Search Radius</label>
                  <div className="relative">
                    <Input
                      type="number"
                      min="1"
                      max="200"
                      value={formData.workingRadius}
                      onChange={(e) => setFormData({ ...formData, workingRadius: e.target.value })}
                      placeholder="50"
                      className="h-9 px-3 pr-8 text-xs border-slate-200 dark:border-slate-800 font-medium"
                    />
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">KM</span>
                  </div>
                </div>
              </div>

              {/* Resolved / Full Address */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                  Full Address / Landmark
                </label>
                <Input
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Street address, colony, or landmark"
                  className="h-9 px-3 text-xs border-slate-200 dark:border-slate-800 font-medium"
                />
              </div>

              {/* Coordinates Indicator */}
              <div className="pt-1 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100 dark:border-slate-800">
                <span className="flex items-center gap-1 font-mono text-[10px]">
                  <Compass className="h-3 w-3 text-[#A05AFF]" />
                  {lat && lng ? `${Number(lat).toFixed(4)}, ${Number(lng).toFixed(4)}` : 'No coordinates pinned'}
                </span>
                <span className="text-[10px] text-slate-400">
                  {school?.locationUpdatedAt ? `Updated ${new Date(school.locationUpdatedAt).toLocaleDateString()}` : 'Click map to set GPS'}
                </span>
              </div>
            </CardContent>
          </Card>
          
        </div>

        {/* Right Column: Interactive Map Pinpoint (7 cols on lg) */}
        <div className="lg:col-span-7">
          <Card className="border border-slate-200/80 dark:border-slate-800 shadow-xs h-full flex flex-col">
            <CardHeader className="px-4 py-3 sm:px-5 sm:py-3.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-row items-center justify-between">
              <CardTitle className="text-xs sm:text-sm font-bold tracking-tight text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Navigation className="h-4 w-4 text-[#A05AFF]" />
                Interactive Map Pinpoint
              </CardTitle>
              <span className="text-[11px] text-[#A05AFF] font-medium bg-[#A05AFF]/10 px-2 py-0.5 rounded-full border border-[#A05AFF]/20">
                Click map or drag pin
              </span>
            </CardHeader>
            <CardContent className="p-4 sm:p-5 flex-1 flex flex-col min-h-[460px] sm:min-h-[500px]">
              <SchoolLocationPicker
                initialLocation={locationData}
                onLocationChange={handleLocationChange}
                onAddressResolved={handleAddressResolved}
                className="w-full flex-1 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 min-h-[440px]"
              />
            </CardContent>
          </Card>
        </div>

      </div>

      {/* Floating / Sticky Mobile Save Button */}
      <div className="sm:hidden fixed bottom-4 right-4 z-40">
        <Button
          onClick={handleSave}
          disabled={updateMutation.isPending}
          className="h-11 px-5 bg-gradient-to-r from-[#A05AFF] to-[#4BCBEB] text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-2"
        >
          {updateMutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" /> Save Changes
            </>
          )}
        </Button>
      </div>

    </div>
  );
}
