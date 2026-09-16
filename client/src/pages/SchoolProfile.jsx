import { useState, useEffect } from 'react';
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
  Compass
} from 'lucide-react';
import { getMySchool, updateMySchool } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SchoolLocationPicker } from '@/components/common/SchoolLocationPicker';

export default function SchoolProfile() {
  const queryClient = useQueryClient();
  const [locationData, setLocationData] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [formData, setFormData] = useState({
    schoolName: '',
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

  const handleSave = () => {
    if (!school) return;

    const currentLat = locationData?.latitude ?? school?.latitude;
    const currentLng = locationData?.longitude ?? school?.longitude;

    const formDataToSubmit = {
      schoolName: formData.schoolName,
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
          <div className="h-10 w-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-[#A05AFF] flex items-center justify-center border border-[#A05AFF]/20 shrink-0">
            <Building2 className="h-5 w-5" />
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
              Manage school contact info and geo-pinning for candidate proximity search
            </p>
          </div>
        </div>

        {/* Top Save Button (Desktop / Tablet) */}
        <div className="hidden sm:flex items-center gap-2 shrink-0">
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
        <div className="px-4 py-2.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-between shadow-xs animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="flex items-center gap-2 font-semibold">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>School profile & location settings updated successfully!</span>
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
          
          {/* Card 1: Basic Information */}
          <Card className="border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <CardHeader className="px-4 py-3 sm:px-5 sm:py-3.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
              <CardTitle className="text-xs sm:text-sm font-bold tracking-tight text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Building2 className="h-4 w-4 text-[#A05AFF]" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-5 space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">School Name</label>
                <Input
                  value={formData.schoolName}
                  readOnly
                  className="h-9 px-3 text-xs bg-slate-50 dark:bg-slate-950/70 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                />
              </div>

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
                <p className="text-[10px] text-slate-400 dark:text-slate-500">School account login email cannot be changed.</p>
              </div>

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

              {/* Area & Working Radius side-by-side */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Area / Locality</label>
                  <Input
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    placeholder="e.g. Bapu Nagar"
                    className="h-9 px-3 text-xs border-slate-200 dark:border-slate-800 font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Search Radius</label>
                    <span className="text-[10px] font-bold text-[#A05AFF]">KM</span>
                  </div>
                  <Input
                    type="number"
                    value={formData.workingRadius}
                    onChange={(e) => setFormData({ ...formData, workingRadius: e.target.value })}
                    placeholder="e.g. 25"
                    className="h-9 px-3 text-xs border-slate-200 dark:border-slate-800 font-medium"
                    min="0"
                    step="0.5"
                  />
                </div>
              </div>

              {/* Full Address */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Full Address</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Complete postal address with landmarks..."
                  rows={2}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 font-medium text-slate-700 dark:text-slate-200 placeholder:text-slate-400 outline-none focus:border-[#A05AFF]/60 focus:ring-2 focus:ring-[#A05AFF]/10 resize-none"
                />
              </div>

              {/* GPS Coordinates Badge Preview */}
              <div className="bg-slate-50 dark:bg-slate-950/60 p-2.5 rounded-lg border border-slate-200/70 dark:border-slate-800/80 space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                    <Compass className="h-3.5 w-3.5 text-[#A05AFF]" />
                    GPS Coordinates:
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">Auto-pinned</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <div className="bg-white dark:bg-slate-900 px-2.5 py-1.5 rounded border border-slate-200 dark:border-slate-800 truncate">
                    <span className="text-slate-400 select-none mr-1">Lat:</span>
                    <span className="text-slate-800 dark:text-slate-200 font-semibold">{lat !== undefined && lat !== null && lat !== '' ? Number(lat).toFixed(5) : 'Not set'}</span>
                  </div>
                  <div className="bg-white dark:bg-slate-900 px-2.5 py-1.5 rounded border border-slate-200 dark:border-slate-800 truncate">
                    <span className="text-slate-400 select-none mr-1">Lng:</span>
                    <span className="text-slate-800 dark:text-slate-200 font-semibold">{lng !== undefined && lng !== null && lng !== '' ? Number(lng).toFixed(5) : 'Not set'}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Right Column: Interactive Map Picker (7 cols on lg) */}
        <div className="lg:col-span-7">
          <Card className="border border-slate-200/80 dark:border-slate-800 shadow-xs h-full flex flex-col">
            <CardHeader className="px-4 py-3 sm:px-5 sm:py-3.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-row items-center justify-between">
              <CardTitle className="text-xs sm:text-sm font-bold tracking-tight text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Navigation className="h-4 w-4 text-[#A05AFF]" />
                Interactive Map Pinpoint
              </CardTitle>
              <span className="hidden sm:inline-block text-[11px] font-semibold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/50 px-2 py-0.5 rounded border border-purple-200/60 dark:border-purple-800">
                Click map or drag pin
              </span>
            </CardHeader>
            <CardContent className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
              <SchoolLocationPicker
                initialLocation={school}
                onLocationChange={handleLocationChange}
                onAddressResolved={handleAddressResolved}
                disabled={updateMutation.isPending}
                mapHeight="380px"
              />
            </CardContent>
          </Card>
        </div>

      </div>

      {/* Bottom Save Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3.5 sm:p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
          <Sparkles className="h-4 w-4 text-[#A05AFF] shrink-0" />
          <span>Clicking save will update your school address and synchronize nearby candidate search radius.</span>
        </div>

        <Button
          onClick={handleSave}
          disabled={updateMutation.isPending}
          className="w-full sm:w-auto bg-gradient-to-r from-[#A05AFF] via-[#9E58FF] to-[#4BCBEB] hover:opacity-95 text-white font-bold rounded-xl px-6 h-10 transition-all active:scale-95 shadow-sm text-xs shrink-0"
        >
          {updateMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving Changes...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4 stroke-[2.5]" />
              Save Profile Changes
            </>
          )}
        </Button>
      </div>

    </div>
  );
}
