import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Sliders, 
  Briefcase, 
  BookOpen, 
  GraduationCap, 
  Layers, 
  Loader2, 
  Plus, 
  X, 
  Search, 
  Check, 
  AlertCircle, 
  CheckCircle2, 
  Bell, 
  ShieldCheck, 
  Lock, 
  Eye, 
  EyeOff, 
  Mail, 
  Phone, 
  Clock, 
  Building2, 
  FileText, 
  Save, 
  KeyRound,
  Settings2,
  Send,
  HelpCircle,
  BadgeCheck,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Gift,
  Download,
  Laptop,
  Smartphone,
  Monitor,
  RefreshCw,
  User,
  Share2,
  CheckSquare,
  Globe,
  Calendar,
  MessageSquare,
  Award,
  MapPin
} from 'lucide-react';
import { 
  getAllMasterData,
  createMasterDataRequest,
  getMyMasterDataRequests,
  getSchoolSettings,
  updateSchoolPreferences, 
  changeUserPassword,
  setSchoolSettingField,
  resetSchoolSettingField
} from '@/lib/api';
import { 
  DEFAULT_POSITIONS, 
  DEFAULT_SUBJECTS, 
  DEFAULT_CLASSES, 
  DEFAULT_QUALIFICATIONS 
} from '@/config/defaults';
import { useAuth } from '@/context/AuthContext';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

const DEFAULTS_MAP = {
  positions: DEFAULT_POSITIONS,
  classes: DEFAULT_CLASSES,
  subjects: DEFAULT_SUBJECTS,
  qualifications: DEFAULT_QUALIFICATIONS,
};

const CATEGORIES = [
  { 
    key: 'positions', 
    requestKey: 'position',
    label: 'Staff Positions', 
    icon: Briefcase, 
    color: 'text-cyan-600 bg-cyan-50 dark:bg-cyan-950/40 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800',
    description: 'Designations and staff roles open for applications.',
  },
  { 
    key: 'classes', 
    requestKey: 'class',
    label: 'Classes & Grades', 
    icon: Layers, 
    color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
    description: 'Manage class levels taught at your school (e.g. Nursery to Class 8). Higher classes can be turned OFF.',
  },
  { 
    key: 'subjects', 
    requestKey: 'subject',
    label: 'Teaching Subjects', 
    icon: BookOpen, 
    color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800',
    description: 'Select subjects taught at your school. Turn OFF subjects your school does not offer.',
  },
  { 
    key: 'qualifications', 
    requestKey: 'qualification',
    label: 'Qualifications', 
    icon: GraduationCap, 
    color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/40 dark:text-purple-400 border-purple-200 dark:border-purple-800',
    description: 'Accepted educational qualifications and degrees for candidates.',
  },
];

const DEFAULT_POPULAR_PERKS = [
  'Provident Fund (PF / EPF)',
  'Paid Vacation & Casual Leaves',
  'Free Staff Transport (Bus Facility)',
  'Staff Children School Fee Concession',
  'Medical & ESIC Health Insurance',
  'Free Daily Lunch / School Canteen',
  'Furnished Staff Quarters / Accommodation',
  'Annual Performance Bonus & Gratuity',
  'Teacher Training & Skill Workshops',
  'Air-Conditioned Staff Room & Labs',
  'Maternity & Paternity Benefits',
  'Laptop / Digital Teaching Device Allowance',
];

export default function Settings() {
  const queryClient = useQueryClient();
  const { user, school } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  // Tab state synced with URL ?tab=...
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabParam || 'hiring');

  useEffect(() => {
    if (tabParam && ['hiring', 'taxonomy', 'security'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const handleTabChange = (val) => {
    setActiveTab(val);
    setSearchParams({ tab: val });
  };

  // Request New Option Modal State
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [requestCategory, setRequestCategory] = useState('position');
  const [requestName, setRequestName] = useState('');
  const [requestDescription, setRequestDescription] = useState('');
  const [requestSuccess, setRequestSuccess] = useState(false);
  const [requestError, setRequestError] = useState('');

  // Criteria & Catalog Tab State
  const [catalogSearch, setCatalogSearch] = useState('');
  const [selectedCatalogCategory, setSelectedCatalogCategory] = useState('positions');

  // Custom Perk Input State
  const [newPerkInput, setNewPerkInput] = useState('');

  // Live Confirmation Preview Modal State
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewDevice, setPreviewDevice] = useState('desktop');

  // Preferences form state
  const [preferencesForm, setPreferencesForm] = useState(null);
  const [prefSaveSuccess, setPrefSaveSuccess] = useState(false);

  // Password change form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Fetch Central Master Data (for reference)
  const { data: masterData, isLoading: isMasterLoading } = useQuery({
    queryKey: ['platform-master-data'],
    queryFn: () => getAllMasterData().then((r) => r.data.data),
  });

  // Fetch School Settings & Preferences
  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: () => getSchoolSettings().then((r) => r.data.data),
  });

  // Fetch My Submitted Requests
  const { data: myRequests = [], isLoading: isRequestsLoading } = useQuery({
    queryKey: ['my-master-data-requests'],
    queryFn: () => getMyMasterDataRequests().then((r) => r.data.data),
  });

  // Sync preferences from loaded settings
  const preferences = useMemo(() => {
    if (!settings) return null;
    return {
      isActivelyHiring: settings.isActivelyHiring ?? true,
      allowWalkInApplications: settings.allowWalkInApplications ?? true,
      emailNotifications: settings.emailNotifications ?? true,
      whatsappAlerts: settings.whatsappAlerts ?? false,
      dailyDigest: settings.dailyDigest ?? true,
      smsAlerts: settings.smsAlerts ?? false,
      weeklyReport: settings.weeklyReport ?? true,
      autoAcknowledgeCandidates: settings.autoAcknowledgeCandidates ?? true,
      customWelcomeMessage: settings.customWelcomeMessage || 'Thank you for applying to our school. Our recruitment team will review your application soon.',
      contactWorkingHours: settings.contactWorkingHours || '09:00 AM - 04:00 PM (Monday to Saturday)',
      preferredExperienceMin: settings.preferredExperienceMin ?? 0,
      boardAffiliation: settings.boardAffiliation || 'CBSE',
      hrContactPerson: settings.hrContactPerson || '',
      hrContactDesignation: settings.hrContactDesignation || 'HR Manager / Principal',
      hrContactPhone: settings.hrContactPhone || '',
      interviewMode: settings.interviewMode || 'In-Person & Online',
      salaryVisibility: settings.salaryVisibility || 'Negotiable / Competitive',
      staffBenefits: settings.staffBenefits?.length ? settings.staffBenefits : [
        'Provident Fund (PF / EPF)',
        'Paid Vacation & Casual Leaves',
        'Free Staff Transport (Bus Facility)',
        'Staff Children School Fee Concession',
      ],
      interviewReminderHours: settings.interviewReminderHours ?? 24,
    };
  }, [settings]);

  const currentPreferences = preferencesForm || preferences || {
    isActivelyHiring: true,
    allowWalkInApplications: true,
    emailNotifications: true,
    whatsappAlerts: false,
    dailyDigest: true,
    smsAlerts: false,
    weeklyReport: true,
    autoAcknowledgeCandidates: true,
    customWelcomeMessage: 'Thank you for applying to our school. Our recruitment team will review your application soon.',
    contactWorkingHours: '09:00 AM - 04:00 PM (Monday to Saturday)',
    preferredExperienceMin: 0,
    boardAffiliation: 'CBSE',
    hrContactPerson: '',
    hrContactDesignation: 'HR Manager / Principal',
    hrContactPhone: '',
    interviewMode: 'In-Person & Online',
    salaryVisibility: 'Negotiable / Competitive',
    staffBenefits: [
      'Provident Fund (PF / EPF)',
      'Paid Vacation & Casual Leaves',
      'Free Staff Transport (Bus Facility)',
      'Staff Children School Fee Concession',
    ],
    interviewReminderHours: 24,
  };

  // Request Mutation
  const requestMutation = useMutation({
    mutationFn: createMasterDataRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-master-data-requests'] });
      setRequestSuccess(true);
      setRequestError('');
      setRequestName('');
      setRequestDescription('');
      setTimeout(() => {
        setRequestSuccess(false);
        setIsRequestModalOpen(false);
      }, 2000);
    },
    onError: (err) => {
      setRequestError(err?.response?.data?.message || 'Failed to submit request.');
    },
  });

  const preferencesMutation = useMutation({
    mutationFn: updateSchoolPreferences,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      setPrefSaveSuccess(true);
      setTimeout(() => setPrefSaveSuccess(false), 3500);
    },
  });

  const passwordMutation = useMutation({
    mutationFn: changeUserPassword,
    onSuccess: () => {
      setPasswordSuccess(true);
      setPasswordError('');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setPasswordSuccess(false), 5000);
    },
    onError: (err) => {
      setPasswordError(err?.response?.data?.message || 'Failed to update password. Please check your current password.');
    },
  });

  // Criteria & Catalog Toggle Mutations & Handlers
  const setFieldMutation = useMutation({
    mutationFn: setSchoolSettingField,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
  });

  const resetFieldMutation = useMutation({
    mutationFn: resetSchoolSettingField,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
  });

  const handleToggleItem = (category, item) => {
    const baseItems = masterData?.[category] || DEFAULTS_MAP[category] || [];
    const schoolItems = Array.isArray(settings?.[category]) ? settings[category] : [];
    const currentActiveList = schoolItems.length ? schoolItems : baseItems;

    let updatedList;
    if (currentActiveList.includes(item)) {
      // Turn OFF
      updatedList = currentActiveList.filter((x) => x !== item);
    } else {
      // Turn ON
      updatedList = [...currentActiveList, item];
    }

    setFieldMutation.mutate({ field: category, values: updatedList });
  };

  const handleEnableAll = (category) => {
    const baseItems = masterData?.[category] || DEFAULTS_MAP[category] || [];
    const schoolItems = Array.isArray(settings?.[category]) ? settings[category] : [];
    const allCategoryItems = Array.from(new Set([...baseItems, ...schoolItems]));
    setFieldMutation.mutate({ field: category, values: allCategoryItems });
  };

  const handleResetDefaults = (category) => {
    resetFieldMutation.mutate({ field: category });
  };

  const handlePreferenceChange = (key, value) => {
    setPreferencesForm((prev) => ({
      ...(prev || preferences || currentPreferences),
      [key]: value,
    }));
  };

  const handleTogglePerk = (perk) => {
    const currentList = currentPreferences.staffBenefits || [];
    const exists = currentList.includes(perk);
    const updatedList = exists ? currentList.filter((p) => p !== perk) : [...currentList, perk];
    handlePreferenceChange('staffBenefits', updatedList);
  };

  const handleAddCustomPerk = (e) => {
    e.preventDefault();
    if (!newPerkInput.trim()) return;
    const trimmed = newPerkInput.trim();
    const currentList = currentPreferences.staffBenefits || [];
    if (!currentList.includes(trimmed)) {
      handlePreferenceChange('staffBenefits', [...currentList, trimmed]);
    }
    setNewPerkInput('');
  };

  const handleSavePreferences = (e) => {
    if (e) e.preventDefault();
    preferencesMutation.mutate(currentPreferences);
  };

  // Password Strength calculation
  const passwordStrength = useMemo(() => {
    const pw = passwordForm.newPassword;
    if (!pw) return { score: 0, text: '', color: 'bg-slate-200 dark:bg-slate-800' };
    let score = 0;
    if (pw.length >= 6) score += 1;
    if (pw.length >= 8) score += 1;
    if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score += 1;
    if (/[0-9]/.test(pw)) score += 1;
    if (/[^A-Za-z0-9]/.test(pw)) score += 1;

    if (score <= 2) return { score: 1, text: 'Weak', color: 'bg-rose-500' };
    if (score <= 3) return { score: 2, text: 'Medium', color: 'bg-amber-500' };
    return { score: 3, text: 'Strong', color: 'bg-emerald-500' };
  }, [passwordForm.newPassword]);

  const handleChangePassword = (e) => {
    e.preventDefault();
    setPasswordError('');
    if (passwordForm.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New password and confirmation do not match.');
      return;
    }
    passwordMutation.mutate({
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword,
    });
  };

  const handleOpenRequestModal = (defaultCat = 'position') => {
    setRequestCategory(defaultCat);
    setRequestName('');
    setRequestDescription('');
    setRequestError('');
    setRequestSuccess(false);
    setIsRequestModalOpen(true);
  };

  const handleSubmitRequest = (e) => {
    e.preventDefault();
    if (!requestName.trim()) {
      setRequestError('Please provide a name for the requested option.');
      return;
    }
    requestMutation.mutate({
      category: requestCategory,
      name: requestName.trim(),
      description: requestDescription.trim(),
    });
  };

  // Download School Settings & Data Backup JSON
  const handleExportBackup = () => {
    const exportData = {
      schoolName: school?.schoolName || 'School',
      schoolId: school?.schoolId,
      adminEmail: user?.email,
      preferences: currentPreferences,
      staffBenefits: currentPreferences.staffBenefits,
      taxonomyCounts: {
        positions: masterData?.positions?.length || 0,
        subjects: masterData?.subjects?.length || 0,
        qualifications: masterData?.qualifications?.length || 0,
        classes: masterData?.classes?.length || 0,
      },
      exportedAt: new Date().toISOString(),
      platform: 'HireHub School Recruitment Portal',
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const sanitizedName = (school?.schoolName || 'School').replace(/[^a-zA-Z0-9]/g, '_');
    link.download = `${sanitizedName}_settings_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const positionsCount = masterData?.positions?.length || 0;
  const subjectsCount = masterData?.subjects?.length || 0;
  const qualificationsCount = masterData?.qualifications?.length || 0;
  const classesCount = masterData?.classes?.length || 0;

  const catalogItems = masterData?.[selectedCatalogCategory] || [];
  const filteredCatalogItems = catalogSearch
    ? catalogItems.filter((i) => i.toLowerCase().includes(catalogSearch.toLowerCase()))
    : catalogItems;

  return (
    <div className="space-y-6 w-full antialiased text-slate-800 dark:text-slate-200 pb-16">
      
      {/* Tabs Navigation - Sleek Horizontal Segmented Control */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full space-y-4">
        <TabsList className="bg-slate-100/90 dark:bg-slate-800/80 p-1 rounded-xl h-auto border border-slate-200/80 dark:border-slate-700/80 grid grid-cols-3 gap-1 w-full shadow-2xs">
          <TabsTrigger 
            value="hiring" 
            className="flex items-center justify-center gap-1.5 py-2 px-1.5 sm:px-3 text-xs font-semibold rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-[#0F766E] dark:data-[state=active]:text-teal-400 data-[state=active]:shadow-xs transition-all text-slate-600 dark:text-slate-400 hover:text-slate-900 min-w-0"
          >
            <MessageSquare className="h-4 w-4 shrink-0 text-[#0F766E]" />
            <span className="truncate">
              <span className="sm:hidden">Message</span>
              <span className="hidden sm:inline">Application Message</span>
            </span>
          </TabsTrigger>

          <TabsTrigger 
            value="taxonomy" 
            className="flex items-center justify-center gap-1.5 py-2 px-1.5 sm:px-3 text-xs font-semibold rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-[#0F766E] dark:data-[state=active]:text-teal-400 data-[state=active]:shadow-xs transition-all text-slate-600 dark:text-slate-400 hover:text-slate-900 relative min-w-0"
          >
            <Sliders className="h-4 w-4 shrink-0 text-amber-500" />
            <span className="truncate">
              <span className="sm:hidden">Criteria</span>
              <span className="hidden sm:inline">Criteria & Catalog</span>
            </span>
            {myRequests.length > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] bg-amber-400 text-slate-900 font-extrabold shrink-0">
                {myRequests.length}
              </span>
            )}
          </TabsTrigger>

          <TabsTrigger 
            value="security" 
            className="flex items-center justify-center gap-1.5 py-2 px-1.5 sm:px-3 text-xs font-semibold rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-[#0F766E] dark:data-[state=active]:text-teal-400 data-[state=active]:shadow-xs transition-all text-slate-600 dark:text-slate-400 hover:text-slate-900 min-w-0"
          >
            <KeyRound className="h-4 w-4 shrink-0 text-blue-500" />
            <span className="truncate">
              <span className="sm:hidden">Security</span>
              <span className="hidden sm:inline">Password & Security</span>
            </span>
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: APPLICATION MESSAGE & CANDIDATE CONFIRMATION */}
        <TabsContent value="hiring" className="space-y-4 mt-0">
          <form onSubmit={handleSavePreferences}>
            <Card className="border border-slate-200/80 dark:border-slate-800 shadow-xs rounded-2xl overflow-hidden">
              <CardHeader className="px-4 sm:px-5 py-3.5 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30">
                <div>
                  <CardTitle className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-[#0F766E]" />
                    Candidate Confirmation & Welcome Message
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Configure the instant acknowledgement and thank-you greeting teachers see when submitting their biodata.
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="p-5 space-y-4">
                {/* Auto Acknowledge Toggle */}
                <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/20">
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#0F766E]" />
                      Auto-Acknowledge Candidate Submissions
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Display confirmation screen immediately when applicants submit their biodata.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handlePreferenceChange('autoAcknowledgeCandidates', !currentPreferences.autoAcknowledgeCandidates)}
                    className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors shrink-0 ${
                      currentPreferences.autoAcknowledgeCandidates ? 'bg-[#8A3BD4]' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        currentPreferences.autoAcknowledgeCandidates ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Custom Candidate Welcome & Acknowledgement Message */}
                <div className="space-y-1.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <FileText className="h-3.5 w-3.5 text-[#8A3BD4]" />
                      Confirmation Message Text
                    </label>
                    <span className="text-[11px] text-slate-400 font-medium">Shown on final submission screen</span>
                  </div>
                  <textarea
                    rows={4}
                    value={currentPreferences.customWelcomeMessage}
                    onChange={(e) => handlePreferenceChange('customWelcomeMessage', e.target.value)}
                    placeholder="Enter message displayed after candidate submits their application..."
                    className="w-full p-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#8A3BD4] shadow-2xs leading-relaxed"
                  />
                  <p className="text-[11px] text-slate-400">
                    This greeting appears immediately on screen after an applicant completes submitting their biodata.
                  </p>
                </div>

                {/* Footer Save Row & Status Notice */}
                <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800/80">
                  <div className="text-xs">
                    {prefSaveSuccess ? (
                      <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="h-4 w-4" /> Changes saved successfully!
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400">
                        Updates take effect immediately on public submission forms.
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setIsPreviewModalOpen(true)}
                      className="h-9 px-3.5 rounded-lg border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-[#8A3BD4] hover:border-purple-300 hover:bg-purple-50/50 shadow-2xs gap-1.5 cursor-pointer"
                    >
                      <Eye className="h-3.5 w-3.5 text-[#8A3BD4]" />
                      Preview
                    </Button>

                    <Button
                      type="submit"
                      disabled={preferencesMutation.isPending}
                      className="h-9 px-4 bg-gradient-to-r from-[#8A3BD4] to-[#A855F7] hover:from-[#7B2CBF] hover:to-[#8A3BD4] text-white font-semibold text-xs rounded-lg shadow-sm transition-all active:scale-98 cursor-pointer flex items-center gap-1.5 border-none"
                    >
                      {preferencesMutation.isPending ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-3.5 w-3.5" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </form>
        </TabsContent>

        {/* TAB 2: RECRUITMENT CRITERIA & PLATFORM CATALOG */}
        <TabsContent value="taxonomy" className="space-y-4 mt-0">
          <Card className="border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <CardHeader className="px-4 py-3.5 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Sliders className="h-4 w-4 text-[#8A3BD4]" />
                    Application Criteria & Catalog
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Toggle active classes, subjects, positions, and qualifications available on candidate application forms.
                  </CardDescription>
                </div>

                <Button
                  type="button"
                  onClick={() => handleOpenRequestModal(CATEGORIES.find((c) => c.key === selectedCatalogCategory)?.requestKey || 'position')}
                  className="h-8 px-3 rounded-lg bg-gradient-to-r from-[#8A3BD4] to-[#A855F7] hover:from-[#7B2CBF] hover:to-[#8A3BD4] text-white text-xs font-semibold self-start sm:self-auto shrink-0 shadow-2xs border-none"
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Request New Option
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-4 sm:p-5 space-y-4">
              
              {/* Category Navigation - Compact Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const baseItems = masterData?.[cat.key] || DEFAULTS_MAP[cat.key] || [];
                  const schoolItems = Array.isArray(settings?.[cat.key]) ? settings[cat.key] : baseItems;
                  const allItems = Array.from(new Set([...baseItems, ...schoolItems]));
                  const activeItems = schoolItems;
                  const isSelected = selectedCatalogCategory === cat.key;
                  const activeCount = activeItems.length;
                  const totalCount = allItems.length;
                  const disabledCount = Math.max(0, totalCount - activeCount);

                  return (
                    <button
                      key={cat.key}
                      type="button"
                      onClick={() => {
                        setSelectedCatalogCategory(cat.key);
                        setCatalogSearch('');
                      }}
                      className={`p-2.5 sm:p-3 rounded-xl border text-left transition-all flex items-center justify-between gap-2.5 ${
                        isSelected
                          ? 'border-[#0F766E] bg-[#0F766E]/5 ring-1 ring-[#0F766E]/30 shadow-2xs'
                          : 'border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={`p-2 rounded-lg shrink-0 ${cat.color}`}>
                          <Icon className="h-3.5 w-3.5" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                            {cat.label}
                          </div>
                          <div className="text-[10px] text-slate-400 truncate">
                            {disabledCount === 0 ? 'All enabled' : `${disabledCount} disabled`}
                          </div>
                        </div>
                      </div>

                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                        activeCount === totalCount
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/60'
                          : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200/60'
                      }`}>
                        {activeCount}/{totalCount}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Action Toolbar */}
              <div className="p-3 rounded-xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {CATEGORIES.find((c) => c.key === selectedCatalogCategory)?.label}:
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Click items to toggle ON or OFF for applicant forms.
                  </span>
                </div>

                <div className="flex items-center gap-2 self-stretch sm:self-auto">
                  <div className="relative flex-1 sm:w-44">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                    <Input
                      placeholder="Filter items..."
                      value={catalogSearch}
                      onChange={(e) => setCatalogSearch(e.target.value)}
                      className="h-7 pl-8 text-xs bg-white dark:bg-slate-950 rounded-lg border-slate-200 dark:border-slate-800"
                    />
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleEnableAll(selectedCatalogCategory)}
                    disabled={setFieldMutation.isPending}
                    className="h-7 px-2.5 text-xs font-semibold rounded-lg border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                  >
                    Enable All
                  </Button>
                </div>
              </div>

              {/* Items Compact Grid */}
              {(() => {
                const baseItems = masterData?.[selectedCatalogCategory] || DEFAULTS_MAP[selectedCatalogCategory] || [];
                const schoolItems = Array.isArray(settings?.[selectedCatalogCategory]) ? settings[selectedCatalogCategory] : baseItems;
                const allItems = Array.from(new Set([...baseItems, ...schoolItems]));
                const activeItems = schoolItems;
                const filtered = catalogSearch
                  ? allItems.filter((item) => item.toLowerCase().includes(catalogSearch.toLowerCase()))
                  : allItems;

                if (filtered.length === 0) {
                  return (
                    <div className="py-6 text-center text-xs text-slate-400 italic">
                      No matching items found for "{catalogSearch}".
                    </div>
                  );
                }

                return (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2">
                    {filtered.map((item) => {
                      const isActive = activeItems.includes(item);

                      return (
                        <div
                          key={item}
                          onClick={() => handleToggleItem(selectedCatalogCategory, item)}
                          className={`px-3 py-2 rounded-xl border transition-all cursor-pointer flex items-center justify-between select-none ${
                            isActive
                              ? 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 hover:border-teal-500/70 shadow-2xs'
                              : 'bg-slate-50/70 dark:bg-slate-900/40 border-slate-200/50 dark:border-slate-800/50 opacity-60 hover:opacity-90'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0 pr-2">
                            <span
                              className={`h-2 w-2 rounded-full shrink-0 transition-colors ${
                                isActive
                                  ? 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]'
                                  : 'bg-slate-300 dark:bg-slate-600'
                              }`}
                            />
                            <span
                              className={`text-xs font-medium truncate ${
                                isActive
                                  ? 'text-slate-800 dark:text-slate-100 font-semibold'
                                  : 'text-slate-500 dark:text-slate-400 line-through decoration-slate-300 dark:decoration-slate-700'
                              }`}
                            >
                              {item}
                            </span>
                          </div>

                          {/* Compact Toggle Switch */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleItem(selectedCatalogCategory, item);
                            }}
                            className={`w-8 h-4.5 flex items-center rounded-full p-0.5 transition-colors shrink-0 ${
                              isActive ? 'bg-[#8A3BD4]' : 'bg-slate-300 dark:bg-slate-700'
                            }`}
                          >
                            <div
                              className={`bg-white w-3.5 h-3.5 rounded-full shadow-xs transform transition-transform ${
                                isActive ? 'translate-x-3.5' : 'translate-x-0'
                              }`}
                            />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}

            </CardContent>
          </Card>

        </TabsContent>

        {/* TAB 3: PASSWORD & SECURITY */}
        <TabsContent value="security" className="space-y-4 mt-0">
          <Card className="w-full border border-slate-200/80 dark:border-slate-800 shadow-xs relative overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-[#0F766E] via-[#4BCBEB] to-emerald-400" />
            <CardHeader className="px-5 py-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <KeyRound className="h-4 w-4 text-[#0F766E]" />
                    Change Account Password
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Update your login credentials. Use a strong combination of letters, numbers, and symbols.
                  </CardDescription>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#0F766E]/10 text-[#0F766E] border border-[#0F766E]/20">
                  School Recruiter Access
                </span>
              </div>
            </CardHeader>

            <CardContent className="p-5">
              <form onSubmit={handleChangePassword} className="space-y-4">
                
                {passwordSuccess && (
                  <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                    <div>
                      <p className="font-bold">Password Updated Successfully!</p>
                      <p className="text-[11px] font-normal text-emerald-600 dark:text-emerald-400">Your school account password has been changed and secured.</p>
                    </div>
                  </div>
                )}

                {passwordError && (
                  <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in">
                    <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                    <span>{passwordError}</span>
                  </div>
                )}

                {/* Current Password Field */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Current Password
                    </label>
                    <span className="text-[10px] text-slate-400 font-normal">
                      (Leave blank if signed up via Google)
                    </span>
                  </div>
                  <div className="relative">
                    <Input
                      type={showCurrentPw ? 'text' : 'password'}
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      placeholder="Enter your current password..."
                      className="h-10 pr-10 text-xs border-slate-200 dark:border-slate-800 rounded-xl font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPw(!showCurrentPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showCurrentPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* New Password & Confirm Password Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* New Password Field */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      New Password (Minimum 6 characters)
                    </label>
                    <div className="relative">
                      <Input
                        type={showNewPw ? 'text' : 'password'}
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                        required
                        placeholder="Create strong new password..."
                        className="h-10 pr-10 text-xs border-slate-200 dark:border-slate-800 rounded-xl font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPw(!showNewPw)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showNewPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>

                    {/* Password Strength Indicator Bar */}
                    {passwordForm.newPassword && (
                      <div className="space-y-1 pt-1">
                        <div className="flex items-center justify-between text-[10px] font-semibold">
                          <span className="text-slate-400">Password Strength:</span>
                          <span className={
                            passwordStrength.score === 1 ? 'text-rose-500' :
                            passwordStrength.score === 2 ? 'text-amber-500' : 'text-emerald-500'
                          }>
                            {passwordStrength.text}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-1.5 h-1.5 w-full">
                          <div className={`h-full rounded-full transition-colors ${passwordStrength.score >= 1 ? passwordStrength.color : 'bg-slate-200 dark:bg-slate-800'}`} />
                          <div className={`h-full rounded-full transition-colors ${passwordStrength.score >= 2 ? passwordStrength.color : 'bg-slate-200 dark:bg-slate-800'}`} />
                          <div className={`h-full rounded-full transition-colors ${passwordStrength.score >= 3 ? passwordStrength.color : 'bg-slate-200 dark:bg-slate-800'}`} />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Confirm New Password Field */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Confirm New Password
                      </label>
                      {passwordForm.confirmPassword && (
                        <span className={`text-[10px] font-semibold flex items-center gap-1 ${
                          passwordForm.newPassword === passwordForm.confirmPassword ? 'text-emerald-600' : 'text-rose-500'
                        }`}>
                          {passwordForm.newPassword === passwordForm.confirmPassword ? (
                            <><CheckCircle2 className="h-3 w-3" /> Passwords match</>
                          ) : (
                            <><X className="h-3 w-3" /> Passwords do not match</>
                          )}
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <Input
                        type={showConfirmPw ? 'text' : 'password'}
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                        required
                        placeholder="Re-enter new password..."
                        className="h-10 pr-10 text-xs border-slate-200 dark:border-slate-800 rounded-xl font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPw(!showConfirmPw)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showConfirmPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-3 flex justify-end">
                  <Button
                    type="submit"
                    disabled={passwordMutation.isPending}
                    className="h-9 px-5 bg-gradient-to-r from-[#8A3BD4] to-[#A855F7] hover:from-[#7B2CBF] hover:to-[#8A3BD4] text-white font-semibold text-xs rounded-lg shadow-sm transition-all active:scale-98 border-none"
                  >
                    {passwordMutation.isPending ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                        Updating Password...
                      </>
                    ) : (
                      <>
                        <Lock className="h-3.5 w-3.5 mr-1.5" />
                        Update Password
                      </>
                    )}
                  </Button>
                </div>

              </form>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>

      {/* REQUEST NEW OPTION MODAL DIALOG */}
      <Dialog open={isRequestModalOpen} onOpenChange={setIsRequestModalOpen}>
        <DialogContent className="max-w-md p-6 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl">
          <DialogHeader className="space-y-1 text-left">
            <DialogTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Send className="h-4 w-4 text-[#8A3BD4]" />
              Request New Master Option
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
              Submit a request for a new position, subject, degree, or grade to Super Admin.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitRequest} className="space-y-4 pt-2">
            {requestSuccess && (
              <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                <span>Request sent to Super Admin for approval!</span>
              </div>
            )}

            {requestError && (
              <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                <span>{requestError}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Category</label>
              <select
                value={requestCategory}
                onChange={(e) => setRequestCategory(e.target.value)}
                className="w-full h-10 px-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#8A3BD4]"
              >
                <option value="position">Position (e.g. Robotics Instructor, Coding Teacher)</option>
                <option value="subject">Subject (e.g. Artificial Intelligence, French)</option>
                <option value="qualification">Degree / Qualification (e.g. B.Tech Ed, M.P.Ed)</option>
                <option value="class">Class / Grade Level (e.g. Day Care, Cambridge Grade 1)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Name / Title</label>
              <Input
                value={requestName}
                onChange={(e) => setRequestName(e.target.value)}
                placeholder="e.g. STEAM Facilitator"
                required
                className="h-10 text-xs border-slate-200 dark:border-slate-800 rounded-lg font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Description / Rationale (Optional)</label>
              <textarea
                rows={2}
                value={requestDescription}
                onChange={(e) => setRequestDescription(e.target.value)}
                placeholder="Why should this be added to the platform catalog?"
                className="w-full p-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#8A3BD4]"
              />
            </div>

            <DialogFooter className="gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsRequestModalOpen(false)}
                className="h-10 rounded-lg text-xs font-semibold"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={requestMutation.isPending}
                className="h-10 px-5 rounded-lg bg-gradient-to-r from-[#8A3BD4] to-[#A855F7] hover:from-[#7B2CBF] hover:to-[#8A3BD4] text-white text-xs font-semibold border-none"
              >
                {requestMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5 mr-1.5" />
                    Submit Request
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* LIVE CONFIRMATION SCREEN PREVIEW DIALOG (MOBILE & DESKTOP) */}
      <Dialog open={isPreviewModalOpen} onOpenChange={setIsPreviewModalOpen}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden bg-slate-100/90 dark:bg-slate-950 border-slate-200 dark:border-slate-800 shadow-2xl">
          <DialogHeader className="p-4 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <DialogTitle className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Eye className="h-4 w-4 text-[#0F766E]" />
                Application Confirmation Preview
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Preview what teachers see after successfully submitting their biodata.
              </DialogDescription>
            </div>

            {/* Desktop vs Mobile Toggle */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl self-start sm:self-auto border border-slate-200/60 dark:border-slate-700/60">
              <button
                type="button"
                onClick={() => setPreviewDevice('desktop')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  previewDevice === 'desktop'
                    ? 'bg-white dark:bg-slate-900 text-[#0F766E] shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Monitor className="h-3.5 w-3.5" />
                Desktop
              </button>
              <button
                type="button"
                onClick={() => setPreviewDevice('mobile')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  previewDevice === 'mobile'
                    ? 'bg-white dark:bg-slate-900 text-[#0F766E] shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Smartphone className="h-3.5 w-3.5" />
                Mobile
              </button>
            </div>
          </DialogHeader>

          {/* Modal Preview Body */}
          <div className="p-4 sm:p-6 max-h-[72vh] overflow-y-auto flex items-center justify-center">
            {previewDevice === 'desktop' ? (
              /* Desktop Mockup Frame */
              <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden text-center">
                {/* Header Banner */}
                <div className="bg-gradient-to-r from-teal-50/80 via-slate-50 to-teal-50/80 dark:from-slate-800/80 dark:via-slate-900 dark:to-slate-800/80 p-5 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex flex-col items-center gap-2">
                    {school?.logoUrl ? (
                      <img
                        src={school.logoUrl}
                        alt={school?.schoolName}
                        className="h-12 w-12 object-contain rounded-xl p-1 bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-2xs"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-xl bg-[#0F766E]/10 text-[#0F766E] border border-[#0F766E]/20 flex items-center justify-center font-black text-base shadow-2xs">
                        {school?.schoolName ? school.schoolName.charAt(0).toUpperCase() : <Building2 className="h-6 w-6" />}
                      </div>
                    )}
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                        {school?.schoolName || 'Your School Name'}
                      </h4>
                      <div className="flex items-center justify-center gap-2 mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                        {(school?.city || school?.state) && (
                          <span className="inline-flex items-center gap-1 font-medium">
                            <MapPin className="h-3 w-3 text-slate-400" />
                            {[school?.city, school?.state].filter(Boolean).join(', ')}
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#0F766E] bg-[#0F766E]/10 px-1.5 py-0.2 rounded-full border border-[#0F766E]/20">
                          <ShieldCheck className="h-3 w-3" /> Verified
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-4">
                  <div className="inline-flex p-2.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 border border-emerald-200/80 dark:border-emerald-800 shadow-2xs">
                    <CheckCircle2 className="h-6 w-6 stroke-[2.2]" />
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Application Submitted Successfully!
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Your biodata has been securely received by {school?.schoolName || 'the school'} recruitment desk.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 text-left">
                    <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1">
                      <MessageSquare className="h-3 w-3 text-[#0F766E]" /> Message from School Administration
                    </div>
                    <p className="text-xs font-medium text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-line italic">
                      "{currentPreferences.customWelcomeMessage || 'Thank you for applying to our school. Our recruitment team will review your application soon.'}"
                    </p>
                  </div>

                  {(school?.phone || school?.email) && (
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-center gap-4 flex-wrap text-[11px] text-slate-500 dark:text-slate-400">
                      {school?.phone && (
                        <span className="inline-flex items-center gap-1 font-medium">
                          <Phone className="h-3 w-3 text-[#0F766E]" /> {school.phone}
                        </span>
                      )}
                      {school?.email && (
                        <span className="inline-flex items-center gap-1 font-medium">
                          <Mail className="h-3 w-3 text-[#0F766E]" /> {school.email}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Mobile Realistic Frame */
              <div className="w-[300px] bg-slate-900 rounded-[38px] p-2.5 shadow-2xl border-4 border-slate-700">
                {/* Mobile Camera Notch */}
                <div className="h-3.5 flex items-center justify-center mb-1">
                  <div className="w-14 h-2.5 bg-slate-800 rounded-full" />
                </div>

                <div className="bg-white dark:bg-slate-950 rounded-[28px] overflow-hidden text-center pb-3">
                  {/* Mobile School Header */}
                  <div className="bg-gradient-to-r from-teal-50/90 to-slate-50 dark:from-slate-900 dark:to-slate-850 p-3.5 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex flex-col items-center gap-1.5">
                      {school?.logoUrl ? (
                        <img
                          src={school.logoUrl}
                          alt={school?.schoolName}
                          className="h-9 w-9 object-contain rounded-xl p-0.5 bg-white dark:bg-slate-800 border border-slate-200"
                        />
                      ) : (
                        <div className="h-9 w-9 rounded-xl bg-[#0F766E]/10 text-[#0F766E] border border-[#0F766E]/20 flex items-center justify-center font-black text-xs">
                          {school?.schoolName ? school.schoolName.charAt(0).toUpperCase() : <Building2 className="h-4 w-4" />}
                        </div>
                      )}
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[220px]">
                          {school?.schoolName || 'Your School Name'}
                        </h4>
                        <span className="inline-flex items-center gap-1 text-[9px] font-bold text-[#0F766E] bg-[#0F766E]/10 px-1.5 py-0.2 rounded-full mt-0.5">
                          <ShieldCheck className="h-2.5 w-2.5" /> Verified
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Success Message */}
                  <div className="p-3 space-y-2.5">
                    <div className="inline-flex p-2 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 border border-emerald-200/80">
                      <CheckCircle2 className="h-5 w-5 stroke-[2.2]" />
                    </div>

                    <div className="space-y-0.5">
                      <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                        Application Submitted!
                      </h3>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">
                        Received by school recruitment desk.
                      </p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-left">
                      <div className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 mb-0.5 flex items-center gap-1">
                        <MessageSquare className="h-2.5 w-2.5 text-[#0F766E]" /> Message from School
                      </div>
                      <p className="text-[10px] font-medium text-slate-700 dark:text-slate-200 leading-relaxed italic">
                        "{currentPreferences.customWelcomeMessage || 'Thank you for applying to our school. Our recruitment team will review your application soon.'}"
                      </p>
                    </div>

                    {(school?.phone || school?.email) && (
                      <div className="pt-1.5 border-t border-slate-100 dark:border-slate-800 flex flex-col items-center gap-0.5 text-[9px] text-slate-500">
                        {school?.phone && <span>📞 {school.phone}</span>}
                        {school?.email && <span>✉️ {school.email}</span>}
                      </div>
                    )}
                  </div>
                </div>

                {/* Mobile Bottom Bar Indicator */}
                <div className="h-2.5 flex items-center justify-center mt-1">
                  <div className="w-16 h-1 bg-slate-600 rounded-full" />
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="p-3 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between sm:justify-between">
            <span className="text-[11px] text-slate-400">
              Viewing in {previewDevice === 'desktop' ? 'Desktop Mode' : 'Mobile Phone Mode'}
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsPreviewModalOpen(false)}
              className="h-8 px-3 rounded-lg text-xs font-medium"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}