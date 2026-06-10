import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Upload, X, FileText } from 'lucide-react';
import {
  getCandidate,
  createCandidate,
  updateCandidate,
  checkDuplicate,
  getSettings,
  uploadFiles,
} from '@/lib/api';
import { LocationSelect } from '@/components/common/LocationSelect';
import { candidateSchema, TEACHING_POSITIONS, VEHICLE_TYPES } from '@/schemas/candidateSchema';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MultiSelect } from '@/components/ui/multi-select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function CandidateForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [duplicate, setDuplicate] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [location, setLocation] = useState({});

  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: () => getSettings().then((r) => r.data.data),
  });

  const { data: candidate, isLoading } = useQuery({
    queryKey: ['candidate', id],
    queryFn: () => getCandidate(id).then((r) => r.data.data),
    enabled: isEdit,
  });

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(candidateSchema),
    defaultValues: {
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
      notes: '',
      documents: [],
    },
  });

  const position = watch('position');
  const documents = watch('documents');
  const mobile = watch('mobile');

  useEffect(() => {
    if (candidate) {
      reset({
        fullName: candidate.fullName,
        mobile: candidate.mobile,
        email: candidate.email || '',
        address: candidate.address || '',
        position: candidate.position,
        qualifications: candidate.qualifications || [],
        subjects: candidate.subjects || [],
        classesCanTeach: candidate.classesCanTeach || [],
        vehicleTypes: candidate.vehicleTypes || [],
        experienceYears: candidate.experienceYears || 0,
        expectedSalary: candidate.expectedSalary || '',
        notes: candidate.notes || '',
        documents: candidate.documents || [],
      });
    }
  }, [candidate, reset]);

  const saveMutation = useMutation({
    mutationFn: (data) => (isEdit ? updateCandidate(id, data) : createCandidate(data)),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['candidates'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      navigate(`/candidates/${res.data.data._id}`);
    },
    onError: (err) => {
      if (err.response?.status === 409 && err.response?.data?.duplicate) {
        setDuplicate(err.response.data.data);
      }
    },
  });

  const checkMobileDuplicate = async () => {
    if (!mobile || mobile.length < 10) return;
    try {
      const res = await checkDuplicate({ mobile, excludeId: isEdit ? id : undefined });
      if (res.data.duplicate) {
        setDuplicate(res.data.data);
      }
    } catch {
      // ignore
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
      const res = await uploadFiles(files);
      setValue('documents', [...documents, ...res.data.data]);
    } catch (err) {
      alert(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const removeDocument = (index) => {
    setValue(
      'documents',
      documents.filter((_, i) => i !== index)
    );
  };

  const onSubmit = (data) => {
    saveMutation.mutate({
      ...data,
      expectedSalary: data.expectedSalary ? Number(data.expectedSalary) : undefined,
      localityId: location.localityId,
    });
  };

  const handleForceCreate = () => {
    const data = watch();
    saveMutation.mutate({
      ...data,
      forceCreate: true,
      expectedSalary: data.expectedSalary ? Number(data.expectedSalary) : undefined,
      localityId: location.localityId,
    });
    setDuplicate(null);
  };

  if (isEdit && isLoading) {
    return <div className="flex h-64 items-center justify-center">Loading...</div>;
  }

  const isTeacher = TEACHING_POSITIONS.includes(position);
  const isDriver = position === 'Driver';

  return (
    <div>
      <PageHeader
        title={isEdit ? 'Edit Candidate' : 'Add Candidate'}
        description={isEdit ? 'Update candidate information' : 'Add a new candidate to your database'}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input id="fullName" {...register('fullName')} />
              {errors.fullName && <p className="text-sm text-destructive">{errors.fullName.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile Number *</Label>
              <Input
                id="mobile"
                {...register('mobile')}
                onBlur={checkMobileDuplicate}
                disabled={isEdit}
              />
              {errors.mobile && <p className="text-sm text-destructive">{errors.mobile.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register('email')} />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Textarea id="address" {...register('address')} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <LocationSelect value={location} onChange={setLocation} />
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
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent>
                      {settings?.positions?.map((p) => (
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

        {isTeacher && (
          <Card>
            <CardHeader>
              <CardTitle>Teaching Details</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Subjects Can Teach</Label>
                <Controller
                  name="subjects"
                  control={control}
                  render={({ field }) => (
                    <MultiSelect
                      options={settings?.subjects || []}
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Select subjects"
                    />
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label>Classes Can Teach</Label>
                <Controller
                  name="classesCanTeach"
                  control={control}
                  render={({ field }) => (
                    <MultiSelect
                      options={settings?.classes || []}
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Select classes"
                    />
                  )}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {isDriver && (
          <Card>
            <CardHeader>
              <CardTitle>Driver Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label>Vehicle Types</Label>
                <Controller
                  name="vehicleTypes"
                  control={control}
                  render={({ field }) => (
                    <MultiSelect
                      options={VEHICLE_TYPES}
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Select vehicle types"
                    />
                  )}
                />
              </div>
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
              <Input id="experienceYears" type="number" min="0" {...register('experienceYears')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expectedSalary">Expected Salary (₹)</Label>
              <Input id="expectedSalary" type="number" min="0" {...register('expectedSalary')} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" {...register('notes')} />
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
                  disabled={uploading || documents.length >= 10}
                />
              </label>
            </div>
            {documents.length > 0 && (
              <div className="space-y-2">
                {documents.map((doc, i) => (
                  <div key={i} className="flex items-center justify-between rounded-md border p-3">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                        {doc.name}
                      </a>
                    </div>
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeDocument(i)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex gap-2">
          <Button type="submit" disabled={isSubmitting || saveMutation.isPending}>
            {isSubmitting || saveMutation.isPending ? 'Saving...' : isEdit ? 'Update Candidate' : 'Add Candidate'}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
            Cancel
          </Button>
        </div>
      </form>

      <Dialog open={!!duplicate} onOpenChange={() => setDuplicate(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Duplicate Mobile Number</DialogTitle>
            <DialogDescription>
              A candidate with mobile {duplicate?.mobile} already exists: <strong>{duplicate?.fullName}</strong>
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button variant="outline" onClick={() => navigate(`/candidates/${duplicate?._id}`)}>
              View Existing
            </Button>
            <Button variant="outline" onClick={() => navigate(`/candidates/${duplicate?._id}/edit`)}>
              Update Existing
            </Button>
            {!isEdit && (
              <Button onClick={handleForceCreate}>Create New Anyway</Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
