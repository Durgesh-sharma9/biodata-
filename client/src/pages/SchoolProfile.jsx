import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MapPin, Building2, Phone, Mail, Loader2, Save, Navigation, Lock, Sparkles } from 'lucide-react';
import { getMySchool, updateMySchool } from '@/lib/api';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SchoolLocationPicker } from '@/components/common/SchoolLocationPicker';

export default function SchoolProfile() {
  const queryClient = useQueryClient();
  const [locationData, setLocationData] = useState(null);
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
    }
  }, [school]);

  const updateMutation = useMutation({
    mutationFn: (data) => updateMySchool(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mySchool'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['candidates'] });
    },
  });

  const handleLocationChange = (location) => {
    setLocationData(location);
  };

  const handleAddressResolved = (details) => {
    if (details) {
      setFormData((prev) => ({
        ...prev,
        state: prev.state || details.state || '',
        city: prev.city || details.city || '',
        area: prev.area || details.area || '',
        address: prev.address || details.address || '',
      }));
    }
  };

  const handleSave = () => {
    if (!school) return;

    const formDataToSubmit = {
      schoolName: formData.schoolName,
      email: formData.email,
      phone: formData.phone,
      state: formData.state,
      city: formData.city,
      area: formData.area,
      address: formData.address,
      workingRadius: formData.workingRadius ? Number(formData.workingRadius) : undefined,
      ...locationData,
    };

    updateMutation.mutate(formDataToSubmit);
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center space-y-4 antialiased bg-slate-50/50 dark:bg-slate-950">
        <div className="relative flex items-center justify-center">
          <Loader2 className="h-10 w-10 text-purple-600 animate-spin relative z-10" />
          <div className="absolute inset-0 bg-purple-100 rounded-full blur-xl animate-pulse scale-150" />
        </div>
        <p className="text-slate-500 dark:text-slate-400 font-bold tracking-wide text-xs">
          Loading school profile...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full antialiased text-slate-800 dark:text-slate-200">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-800 dark:text-white flex items-center gap-2">
            <Building2 className="h-5 w-5 text-[#A05AFF]" /> School Profile
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 font-medium">
            Manage your school information and location settings
          </p>
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        
        {/* Basic Information */}
        <Card>
          <CardHeader className="p-5 pb-3">
            <CardTitle className="text-sm font-bold tracking-wide text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Building2 className="h-4 w-4 text-purple-600" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-2 space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">School Name</label>
              <Input
                value={formData.schoolName}
                readOnly
                className="bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800"
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Email (Account ID)</label>
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                  <Lock className="h-3 w-3 text-slate-400" /> Read-Only
                </span>
              </div>
              <Input
                value={formData.email}
                readOnly
                disabled
                className="bg-slate-100/80 dark:bg-slate-950 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 cursor-not-allowed font-medium select-none"
              />
              <p className="text-[11px] text-slate-400 dark:text-slate-500">School account login email cannot be changed.</p>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Phone</label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Enter phone number"
                className="border-slate-200 dark:border-slate-800"
              />
            </div>
          </CardContent>
        </Card>

        {/* Location Information */}
        <Card>
          <CardHeader className="p-5 pb-3">
            <CardTitle className="text-sm font-bold tracking-wide text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-purple-600" />
              School Location
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-2 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">State</label>
                <Input
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  placeholder="State"
                  className="border-slate-200 dark:border-slate-800"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">City</label>
                <Input
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="City"
                  className="border-slate-200 dark:border-slate-800"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Area</label>
              <Input
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                placeholder="Area/Locality"
                className="border-slate-200 dark:border-slate-800"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Full Address</label>
              <Input
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Complete address"
                className="border-slate-200 dark:border-slate-800"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Latitude</label>
                <Input
                  value={locationData?.latitude ?? school?.latitude ?? ''}
                  readOnly
                  placeholder="Auto-filled from map"
                  className="bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-xs"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Longitude</label>
                <Input
                  value={locationData?.longitude ?? school?.longitude ?? ''}
                  readOnly
                  placeholder="Auto-filled from map"
                  className="bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-xs"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Working Radius (km)</label>
              <Input
                type="number"
                value={formData.workingRadius}
                onChange={(e) => setFormData({ ...formData, workingRadius: e.target.value })}
                placeholder="Maximum distance for nearby search"
                className="border-slate-200 dark:border-slate-800"
                min="0"
                step="0.1"
              />
            </div>
          </CardContent>
        </Card>

        {/* Map Picker */}
        <Card className="lg:col-span-2">
          <CardHeader className="p-5 pb-3">
            <CardTitle className="text-sm font-bold tracking-wide text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Navigation className="h-4 w-4 text-purple-600" />
              Location Picker
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-2">
            <SchoolLocationPicker
              initialLocation={school}
              onLocationChange={handleLocationChange}
              onAddressResolved={handleAddressResolved}
              disabled={updateMutation.isPending}
            />
          </CardContent>
        </Card>

      </div>

      {/* Bottom Save Action Panel */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
          <Sparkles className="h-4 w-4 text-[#A05AFF] shrink-0" />
          <span>Verify your school address and map pin coordinates before saving.</span>
        </div>

        <Button
          onClick={handleSave}
          disabled={updateMutation.isPending}
          className="w-full sm:w-auto bg-gradient-to-r from-[#A05AFF] via-[#9E58FF] to-[#4BCBEB] hover:opacity-95 text-white font-bold rounded-xl px-6 h-11 transition-all active:scale-95 shadow-md shadow-[#A05AFF]/20 text-xs shrink-0"
        >
          {updateMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving Changes...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4 stroke-[2.5]" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
