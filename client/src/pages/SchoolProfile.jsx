import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MapPin, Building2, Phone, Mail, Loader2, Save, Navigation } from 'lucide-react';
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
    <div className="space-y-6 max-w-[1400px] mx-auto w-full p-6 antialiased text-slate-800 dark:text-slate-200 bg-slate-50/50 dark:bg-slate-950 min-h-screen">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200/60 shadow-2xs">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-800 dark:text-white flex items-center gap-2">
            <Building2 className="h-5 w-5 text-purple-600" /> School Profile
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 font-medium">
            Manage your school information and location settings
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={updateMutation.isPending}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold rounded-xl px-6 transition-all"
        >
          {updateMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        
        {/* Basic Information */}
        <Card className="border border-slate-200/60 bg-white shadow-2xs dark:bg-slate-900">
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
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Email</label>
              <Input
                value={formData.email}
                readOnly
                className="bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800"
              />
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
        <Card className="border border-slate-200/60 bg-white shadow-2xs dark:bg-slate-900">
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
        <Card className="border border-slate-200/60 bg-white shadow-2xs dark:bg-slate-900 lg:col-span-2">
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
              disabled={updateMutation.isPending}
            />
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
