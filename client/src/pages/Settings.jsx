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
  RefreshCw,
  User,
  Share2,
  CheckSquare,
  Globe,
  Calendar,
  MessageSquare,
  Award
} from 'lucide-react';
import { 
  getAllMasterData,
  createMasterDataRequest,
  getMyMasterDataRequests,
  getSchoolSettings,
  updateSchoolPreferences, 
  changeUserPassword 
} from '@/lib/api';
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

const CATEGORIES = [
  { 
    key: 'positions', 
    requestKey: 'position',
    label: 'Positions', 
    icon: Briefcase, 
    color: 'text-cyan-600 bg-cyan-50 dark:bg-cyan-950/40 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800',
  },
  { 
    key: 'subjects', 
    requestKey: 'subject',
    label: 'Subjects', 
    icon: BookOpen, 
    color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800',
  },
  { 
    key: 'qualifications', 
    requestKey: 'qualification',
    label: 'Qualifications', 
    icon: GraduationCap, 
    color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/40 dark:text-purple-400 border-purple-200 dark:border-purple-800',
  },
  { 
    key: 'classes', 
    requestKey: 'class',
    label: 'Classes', 
    icon: Layers, 
    color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
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
    if (tabParam && ['hiring', 'perks', 'notifications', 'taxonomy', 'security'].includes(tabParam)) {
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

  // Expandable Master Data Drawer State
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [catalogSearch, setCatalogSearch] = useState('');
  const [selectedCatalogCategory, setSelectedCatalogCategory] = useState('positions');

  // Custom Perk Input State
  const [newPerkInput, setNewPerkInput] = useState('');

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
      
      {/* Page Header */}
      <PageHeader 
        title="Settings & Portal Configuration" 
        description="Customize your school hiring workflow, password & security, teacher perks, notifications, and candidate rules." 
        action={
          <div className="flex items-center gap-2">
            {prefSaveSuccess && (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 text-xs font-semibold border border-emerald-200 animate-in fade-in">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Settings Saved!
              </span>
            )}
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#A05AFF]/30 bg-[#A05AFF]/5 text-[#A05AFF] text-xs font-bold shadow-2xs">
              <Building2 className="h-3.5 w-3.5" />
              <span>{school?.schoolName || 'School Portal'}</span>
            </div>
          </div>
        }
      />

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full space-y-6">
        <TabsList className="bg-slate-100 dark:bg-slate-900 p-1 rounded-xl h-auto border border-slate-200/80 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-5 gap-1">
          <TabsTrigger value="hiring" className="flex items-center gap-1.5 py-2.5 text-xs font-bold rounded-lg">
            <Settings2 className="h-4 w-4 shrink-0 text-[#A05AFF]" />
            <span className="truncate">Hiring Workflow</span>
          </TabsTrigger>

          <TabsTrigger value="perks" className="flex items-center gap-1.5 py-2.5 text-xs font-bold rounded-lg">
            <Award className="h-4 w-4 shrink-0 text-amber-500" />
            <span className="truncate">Staff Perks & Perks</span>
          </TabsTrigger>

          <TabsTrigger value="notifications" className="flex items-center gap-1.5 py-2.5 text-xs font-bold rounded-lg">
            <Bell className="h-4 w-4 shrink-0 text-sky-500" />
            <span className="truncate">Notifications</span>
          </TabsTrigger>

          <TabsTrigger value="taxonomy" className="flex items-center gap-1.5 py-2.5 text-xs font-bold rounded-lg relative">
            <Sliders className="h-4 w-4 shrink-0 text-indigo-500" />
            <span className="truncate">Criteria & Catalog</span>
            {myRequests.length > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-[#A05AFF]/15 text-[#A05AFF] font-bold">
                {myRequests.length}
              </span>
            )}
          </TabsTrigger>

          <TabsTrigger value="security" className="flex items-center gap-1.5 py-2.5 text-xs font-bold rounded-lg">
            <KeyRound className="h-4 w-4 shrink-0 text-emerald-500" />
            <span className="truncate">Password & Security</span>
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: HIRING WORKFLOW & PUBLIC PORTAL PREFERENCES */}
        <TabsContent value="hiring" className="space-y-6 mt-0">
          <form onSubmit={handleSavePreferences}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              <div className="lg:col-span-2 space-y-6">
                <Card className="border border-slate-200/80 dark:border-slate-800 shadow-sm">
                  <CardHeader className="p-5 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30">
                    <CardTitle className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Settings2 className="h-4 w-4 text-[#A05AFF]" />
                      Candidate Application & Hiring Rules
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
                      Configure how candidate submissions, QR code applications, and hiring standards operate.
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="p-5 space-y-5">
                    {/* Actively Hiring Toggle */}
                    <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/20">
                      <div className="space-y-1">
                        <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                          <span className={`h-2.5 w-2.5 rounded-full ${currentPreferences.isActivelyHiring ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                          Active Recruitment Status
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Displays "We are actively hiring teachers & staff" banner on your school's application portal.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handlePreferenceChange('isActivelyHiring', !currentPreferences.isActivelyHiring)}
                        className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                          currentPreferences.isActivelyHiring ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
                        }`}
                      >
                        <div
                          className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                            currentPreferences.isActivelyHiring ? 'translate-x-6' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Walk-in & QR applications Toggle */}
                    <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/20">
                      <div className="space-y-1">
                        <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                          <CheckSquare className="h-3.5 w-3.5 text-[#A05AFF]" />
                          Accept Walk-In & QR Code Submissions
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Allows prospective candidates to scan your reception standee or flyer and apply on smartphones.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handlePreferenceChange('allowWalkInApplications', !currentPreferences.allowWalkInApplications)}
                        className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                          currentPreferences.allowWalkInApplications ? 'bg-[#A05AFF]' : 'bg-slate-300 dark:bg-slate-700'
                        }`}
                      >
                        <div
                          className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                            currentPreferences.allowWalkInApplications ? 'translate-x-6' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Auto Acknowledge Toggle */}
                    <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/20">
                      <div className="space-y-1">
                        <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                          <MessageSquare className="h-3.5 w-3.5 text-sky-500" />
                          Auto-Acknowledge Candidate Submissions
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Instantly send a formatted confirmation screen and email acknowledging their application.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handlePreferenceChange('autoAcknowledgeCandidates', !currentPreferences.autoAcknowledgeCandidates)}
                        className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                          currentPreferences.autoAcknowledgeCandidates ? 'bg-[#A05AFF]' : 'bg-slate-300 dark:bg-slate-700'
                        }`}
                      >
                        <div
                          className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                            currentPreferences.autoAcknowledgeCandidates ? 'translate-x-6' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Grid of Select Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                      
                      {/* Board Affiliation */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                          <Globe className="h-3.5 w-3.5 text-[#A05AFF]" />
                          School Education Board / Affiliation
                        </label>
                        <select
                          value={currentPreferences.boardAffiliation}
                          onChange={(e) => handlePreferenceChange('boardAffiliation', e.target.value)}
                          className="w-full h-10 px-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#A05AFF]"
                        >
                          <option value="CBSE">CBSE (Central Board of Secondary Education)</option>
                          <option value="ICSE">ICSE / ISC Board</option>
                          <option value="State Board">State Board (RBSE / UP / MH etc.)</option>
                          <option value="IB">IB (International Baccalaureate)</option>
                          <option value="Cambridge">Cambridge / IGCSE</option>
                          <option value="Other">Other Recognized Educational Board</option>
                        </select>
                      </div>

                      {/* Minimum Experience Preference */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                          <GraduationCap className="h-3.5 w-3.5 text-indigo-500" />
                          Default Experience Requirement
                        </label>
                        <select
                          value={currentPreferences.preferredExperienceMin}
                          onChange={(e) => handlePreferenceChange('preferredExperienceMin', Number(e.target.value))}
                          className="w-full h-10 px-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#A05AFF]"
                        >
                          <option value={0}>Any Experience Level / Freshers Welcome</option>
                          <option value={1}>Minimum 1 Year Teaching / Relevant Exp.</option>
                          <option value={2}>Minimum 2 Years Teaching / Relevant Exp.</option>
                          <option value={3}>Minimum 3+ Years Prior Experience</option>
                          <option value={5}>Senior Staff (5+ Years Experience)</option>
                        </select>
                      </div>

                      {/* Interview Mode Preference */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                          <Laptop className="h-3.5 w-3.5 text-emerald-500" />
                          Preferred Interview Mode
                        </label>
                        <select
                          value={currentPreferences.interviewMode}
                          onChange={(e) => handlePreferenceChange('interviewMode', e.target.value)}
                          className="w-full h-10 px-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#A05AFF]"
                        >
                          <option value="In-Person & Online">Hybrid (In-Person & Online Video Rounds)</option>
                          <option value="In-Person Only">In-Person Campus Interview Only</option>
                          <option value="Online Video First">Online Video Demo First Round</option>
                        </select>
                      </div>

                      {/* Salary Transparency Policy */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                          <Award className="h-3.5 w-3.5 text-amber-500" />
                          Remuneration / Salary Policy
                        </label>
                        <select
                          value={currentPreferences.salaryVisibility}
                          onChange={(e) => handlePreferenceChange('salaryVisibility', e.target.value)}
                          className="w-full h-10 px-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#A05AFF]"
                        >
                          <option value="Negotiable / Competitive">Negotiable / Competitive (Based on merit)</option>
                          <option value="As Per 7th Pay / School Norms">As Per School Pay Scale & Norms</option>
                          <option value="Disclosed on Interview">Disclosed During Personal Interview</option>
                        </select>
                      </div>

                    </div>

                    {/* Contact Working Hours */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-[#A05AFF]" />
                        School Recruitment & Interview Office Hours
                      </label>
                      <Input
                        value={currentPreferences.contactWorkingHours}
                        onChange={(e) => handlePreferenceChange('contactWorkingHours', e.target.value)}
                        placeholder="e.g. 09:00 AM - 04:00 PM (Monday to Saturday)"
                        className="h-10 text-xs border-slate-200 dark:border-slate-800 rounded-xl"
                      />
                      <p className="text-[11px] text-slate-400">
                        Informs applicants when the school administrative desk is available for enquiries or demo classes.
                      </p>
                    </div>

                    {/* Custom Candidate Welcome & Acknowledgement Message */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <MessageSquare className="h-3.5 w-3.5 text-[#A05AFF]" />
                        Candidate Success Confirmation Message
                      </label>
                      <textarea
                        rows={3}
                        value={currentPreferences.customWelcomeMessage}
                        onChange={(e) => handlePreferenceChange('customWelcomeMessage', e.target.value)}
                        placeholder="Enter message displayed after candidate submits their application..."
                        className="w-full p-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#A05AFF]"
                      />
                      <p className="text-[11px] text-slate-400">
                        This custom greeting appears on the thank-you screen after an applicant finishes submission.
                      </p>
                    </div>

                  </CardContent>
                </Card>

                {/* Recruiter / HR Contact Card */}
                <Card className="border border-slate-200/80 dark:border-slate-800 shadow-sm">
                  <CardHeader className="p-5 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30">
                    <CardTitle className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <User className="h-4 w-4 text-[#A05AFF]" />
                      Recruiter / HR Contact Person (Optional Display)
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
                      Display contact info of the staff member managing recruitment communication.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-5">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          Contact Person Name
                        </label>
                        <Input
                          value={currentPreferences.hrContactPerson}
                          onChange={(e) => handlePreferenceChange('hrContactPerson', e.target.value)}
                          placeholder="e.g. Dr. Rajesh Sharma"
                          className="h-10 text-xs border-slate-200 dark:border-slate-800 rounded-xl"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          Designation
                        </label>
                        <Input
                          value={currentPreferences.hrContactDesignation}
                          onChange={(e) => handlePreferenceChange('hrContactDesignation', e.target.value)}
                          placeholder="e.g. Principal / HR Head"
                          className="h-10 text-xs border-slate-200 dark:border-slate-800 rounded-xl"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          Direct Desk Phone
                        </label>
                        <Input
                          value={currentPreferences.hrContactPhone}
                          onChange={(e) => handlePreferenceChange('hrContactPhone', e.target.value)}
                          placeholder="e.g. +91 9876543210"
                          className="h-10 text-xs border-slate-200 dark:border-slate-800 rounded-xl"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

              </div>

              {/* Right Side: Quick Action & Summary Column */}
              <div className="space-y-6">
                
                {/* Save Button Card */}
                <Card className="border border-slate-200/80 dark:border-slate-800 shadow-sm bg-gradient-to-br from-slate-50 to-purple-50/20 dark:from-slate-900/40 dark:to-slate-900/20">
                  <CardContent className="p-5 space-y-4">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-[#A05AFF]/10 text-[#A05AFF]">
                        <Save className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">Save All Workflow Preferences</h4>
                        <p className="text-[11px] text-slate-400">Settings take effect immediately on public forms.</p>
                      </div>
                    </div>

                    {prefSaveSuccess && (
                      <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                        <span>Changes saved successfully!</span>
                      </div>
                    )}

                    <Button
                      type="submit"
                      disabled={preferencesMutation.isPending}
                      className="w-full h-10 bg-[#A05AFF] hover:bg-[#8e44ee] text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-98"
                    >
                      {preferencesMutation.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Saving Preferences...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-1.5" />
                          Save Workflow Changes
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>

                {/* Application Links & Standee Shortcut */}
                <Card className="border border-slate-200/80 dark:border-slate-800 shadow-sm">
                  <CardHeader className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
                    <CardTitle className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                      <Share2 className="h-4 w-4 text-[#A05AFF]" />
                      Public Links & Standee
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-3 text-xs">
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      Share your custom school application link or download high-resolution QR standees for your school reception desk.
                    </p>
                    <a
                      href="/application-links"
                      className="inline-flex items-center justify-center w-full h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 text-slate-700 dark:text-slate-200 font-semibold text-xs shadow-2xs transition-colors"
                    >
                      View QR Code & Links ↗
                    </a>
                  </CardContent>
                </Card>

                {/* Direct Password & Security Shortcut */}
                <Card className="border border-slate-200/80 dark:border-slate-800 shadow-sm bg-gradient-to-br from-emerald-50/30 to-slate-50 dark:from-emerald-950/20 dark:to-slate-900/20">
                  <CardContent className="p-4 space-y-2.5">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                      <KeyRound className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      <span>Account Security</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      Need to update your admin login password or review active sessions?
                    </p>
                    <button
                      type="button"
                      onClick={() => handleTabChange('security')}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#A05AFF] hover:underline"
                    >
                      Jump to Password Settings →
                    </button>
                  </CardContent>
                </Card>

              </div>

            </div>
          </form>
        </TabsContent>

        {/* TAB 2: STAFF PERKS & BENEFITS */}
        <TabsContent value="perks" className="space-y-6 mt-0">
          <div className="max-w-4xl space-y-6">
            <Card className="border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <CardHeader className="p-5 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <CardTitle className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Gift className="h-4 w-4 text-amber-500" />
                    Teacher & Staff Perks Highlighted on Application Portal
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
                    Highlighting benefits increases qualified teacher applications by up to 40%. Click to toggle active perks.
                  </CardDescription>
                </div>

                <Button
                  type="button"
                  onClick={handleSavePreferences}
                  disabled={preferencesMutation.isPending}
                  className="h-9 px-4 bg-[#A05AFF] hover:bg-[#8e44ee] text-white text-xs font-bold rounded-xl shrink-0"
                >
                  {preferencesMutation.isPending ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
                  ) : (
                    <Save className="h-3.5 w-3.5 mr-1" />
                  )}
                  Save Perks Selection
                </Button>
              </CardHeader>

              <CardContent className="p-5 space-y-6">
                
                {prefSaveSuccess && (
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                    <span>Staff perks and benefits saved successfully!</span>
                  </div>
                )}

                {/* Interactive Perks Tags Grid */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Select Offered Amenities & Perks ({currentPreferences.staffBenefits?.length || 0} active)
                  </label>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                    {DEFAULT_POPULAR_PERKS.map((perk) => {
                      const isSelected = (currentPreferences.staffBenefits || []).includes(perk);
                      return (
                        <button
                          key={perk}
                          type="button"
                          onClick={() => handleTogglePerk(perk)}
                          className={`p-3 rounded-xl text-left text-xs font-semibold flex items-start gap-2.5 transition-all border ${
                            isSelected
                              ? 'bg-purple-50/80 dark:bg-purple-950/40 border-[#A05AFF]/60 text-purple-900 dark:text-purple-200 shadow-2xs'
                              : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                          }`}
                        >
                          <div className={`mt-0.5 h-4 w-4 rounded-md flex items-center justify-center shrink-0 border ${
                            isSelected ? 'bg-[#A05AFF] border-[#A05AFF] text-white' : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950'
                          }`}>
                            {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                          </div>
                          <span className="leading-snug">{perk}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom Additional Perks */}
                {((currentPreferences.staffBenefits || []).filter((p) => !DEFAULT_POPULAR_PERKS.includes(p)).length > 0) && (
                  <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Your Custom Added Perks
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {(currentPreferences.staffBenefits || [])
                        .filter((p) => !DEFAULT_POPULAR_PERKS.includes(p))
                        .map((customPerk) => (
                          <span
                            key={customPerk}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#A05AFF]/10 text-[#A05AFF] border border-[#A05AFF]/30 text-xs font-semibold"
                          >
                            <span>{customPerk}</span>
                            <button
                              type="button"
                              onClick={() => handleTogglePerk(customPerk)}
                              className="hover:text-rose-500 transition-colors"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </span>
                        ))}
                    </div>
                  </div>
                )}

                {/* Add Custom Perk Form */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                    Add a Custom School Perk
                  </label>
                  <div className="flex items-center gap-2">
                    <Input
                      value={newPerkInput}
                      onChange={(e) => setNewPerkInput(e.target.value)}
                      placeholder="e.g. Free Gym & Sports Club Access, Subsidized Hostel..."
                      className="h-10 text-xs border-slate-200 dark:border-slate-800 rounded-xl"
                    />
                    <Button
                      type="button"
                      onClick={handleAddCustomPerk}
                      className="h-10 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:hover:bg-slate-200 dark:text-slate-900 text-xs font-bold shrink-0"
                    >
                      <Plus className="h-3.5 w-3.5 mr-1" />
                      Add Perk
                    </Button>
                  </div>
                </div>

              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* TAB 3: NOTIFICATIONS & ALERT CHANNELS */}
        <TabsContent value="notifications" className="space-y-6 mt-0">
          <div className="max-w-3xl space-y-6">
            <Card className="border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <CardHeader className="p-5 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30">
                <CardTitle className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Bell className="h-4 w-4 text-[#A05AFF]" />
                  Recruitment Alert Channels & Schedule
                </CardTitle>
                <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
                  Select which events trigger automated notifications to the school administration desk.
                </CardDescription>
              </CardHeader>

              <CardContent className="p-5 space-y-5">
                
                {prefSaveSuccess && (
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                    <span>Notification preferences updated successfully!</span>
                  </div>
                )}

                {/* Email Notification on new application */}
                <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/20">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-950/40 dark:text-sky-400 shrink-0 mt-0.5">
                      <Mail className="h-4 w-4" />
                    </div>
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        New Candidate Email Alert
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Receive an instant email alert when a candidate applies (sent to {user?.email || 'school email'}).
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const nextVal = !currentPreferences.emailNotifications;
                      handlePreferenceChange('emailNotifications', nextVal);
                      preferencesMutation.mutate({ ...currentPreferences, emailNotifications: nextVal });
                    }}
                    className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                      currentPreferences.emailNotifications ? 'bg-[#A05AFF]' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        currentPreferences.emailNotifications ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Daily Digest */}
                <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/20">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400 shrink-0 mt-0.5">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        Daily Candidate Summary Digest
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        A morning summary email with total active candidates and recent submissions.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const nextVal = !currentPreferences.dailyDigest;
                      handlePreferenceChange('dailyDigest', nextVal);
                      preferencesMutation.mutate({ ...currentPreferences, dailyDigest: nextVal });
                    }}
                    className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                      currentPreferences.dailyDigest ? 'bg-[#A05AFF]' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        currentPreferences.dailyDigest ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Weekly Analytics Report */}
                <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/20">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 shrink-0 mt-0.5">
                      <Calendar className="h-4 w-4" />
                    </div>
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        Weekly Recruitment Analytics Report
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Weekly hiring velocity overview, shortlisted candidates, and credits usage metrics.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const nextVal = !currentPreferences.weeklyReport;
                      handlePreferenceChange('weeklyReport', nextVal);
                      preferencesMutation.mutate({ ...currentPreferences, weeklyReport: nextVal });
                    }}
                    className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                      currentPreferences.weeklyReport ? 'bg-[#A05AFF]' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        currentPreferences.weeklyReport ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* WhatsApp Alert */}
                <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/20">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 shrink-0 mt-0.5">
                      <Phone className="h-4 w-4" />
                    </div>
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        WhatsApp Urgent Alerts
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Instant WhatsApp ping for urgent position applications (sent to school mobile).
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const nextVal = !currentPreferences.whatsappAlerts;
                      handlePreferenceChange('whatsappAlerts', nextVal);
                      preferencesMutation.mutate({ ...currentPreferences, whatsappAlerts: nextVal });
                    }}
                    className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                      currentPreferences.whatsappAlerts ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        currentPreferences.whatsappAlerts ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* SMS Quick Alerts */}
                <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/20">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400 shrink-0 mt-0.5">
                      <MessageSquare className="h-4 w-4" />
                    </div>
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        SMS Text Alerts
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Send fast SMS alerts to recruiter mobile on candidate interview confirmations.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const nextVal = !currentPreferences.smsAlerts;
                      handlePreferenceChange('smsAlerts', nextVal);
                      preferencesMutation.mutate({ ...currentPreferences, smsAlerts: nextVal });
                    }}
                    className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                      currentPreferences.smsAlerts ? 'bg-[#A05AFF]' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        currentPreferences.smsAlerts ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Interview Reminder Schedule */}
                <div className="p-4 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/20 space-y-2">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-[#A05AFF]" />
                    Candidate Interview Auto-Reminder Schedule
                  </label>
                  <select
                    value={currentPreferences.interviewReminderHours}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      handlePreferenceChange('interviewReminderHours', val);
                      preferencesMutation.mutate({ ...currentPreferences, interviewReminderHours: val });
                    }}
                    className="w-full h-10 px-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#A05AFF]"
                  >
                    <option value={12}>Send reminder 12 Hours before scheduled interview</option>
                    <option value={24}>Send reminder 24 Hours (1 Day) before interview (Recommended)</option>
                    <option value={48}>Send reminder 48 Hours (2 Days) before interview</option>
                  </select>
                </div>

              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* TAB 4: RECRUITMENT CRITERIA & PLATFORM CATALOG */}
        <TabsContent value="taxonomy" className="space-y-6 mt-0">
          <Card className="border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <CardHeader className="p-5 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30">
              <CardTitle className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sliders className="h-4 w-4 text-[#A05AFF]" />
                Standard Platform Recruitment Taxonomies
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
                HireHub maintains a standardized database of teaching roles, subjects, and degrees across verified schools.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-5 space-y-6">
              
              {/* Stat Counters Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                <div className="p-3.5 rounded-xl border border-cyan-200/80 bg-cyan-50/40 dark:bg-cyan-950/20 dark:border-cyan-800/60 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-700 dark:text-cyan-300">
                    <Briefcase className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-base font-extrabold text-cyan-900 dark:text-cyan-200 leading-tight">
                      {positionsCount}
                    </div>
                    <div className="text-[11px] font-semibold text-cyan-700/80 dark:text-cyan-400">
                      Positions
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-indigo-200/80 bg-indigo-50/40 dark:bg-indigo-950/20 dark:border-indigo-800/60 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-700 dark:text-indigo-300">
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-base font-extrabold text-indigo-900 dark:text-indigo-200 leading-tight">
                      {subjectsCount}
                    </div>
                    <div className="text-[11px] font-semibold text-indigo-700/80 dark:text-indigo-400">
                      Subjects
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-purple-200/80 bg-purple-50/40 dark:bg-purple-950/20 dark:border-purple-800/60 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/10 text-purple-700 dark:text-purple-300">
                    <GraduationCap className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-base font-extrabold text-purple-900 dark:text-purple-200 leading-tight">
                      {qualificationsCount}
                    </div>
                    <div className="text-[11px] font-semibold text-purple-700/80 dark:text-purple-400">
                      Qualifications
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-emerald-200/80 bg-emerald-50/40 dark:bg-emerald-950/20 dark:border-emerald-800/60 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                    <Layers className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-base font-extrabold text-emerald-900 dark:text-emerald-200 leading-tight">
                      {classesCount}
                    </div>
                    <div className="text-[11px] font-semibold text-emerald-700/80 dark:text-emerald-400">
                      Class Levels
                    </div>
                  </div>
                </div>
              </div>

              {/* Collapsible "Browse Supported Options" Drawer */}
              <div className="border border-slate-200/80 dark:border-slate-800 rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setIsCatalogOpen(!isCatalogOpen)}
                  className="w-full p-3.5 bg-slate-50/70 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-900 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Search className="h-3.5 w-3.5 text-[#A05AFF]" />
                    <span>Browse or Search Supported Platform Catalog</span>
                  </span>
                  <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-medium">
                    <span>{isCatalogOpen ? 'Collapse' : 'View full catalog'}</span>
                    {isCatalogOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                  </div>
                </button>

                {isCatalogOpen && (
                  <div className="p-4 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 space-y-4">
                    {/* Category Switcher & Search */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                      <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
                        {CATEGORIES.map((cat) => (
                          <button
                            key={cat.key}
                            type="button"
                            onClick={() => setSelectedCatalogCategory(cat.key)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                              selectedCatalogCategory === cat.key
                                ? 'bg-[#A05AFF] text-white shadow-2xs'
                                : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                            }`}
                          >
                            {cat.label} ({masterData?.[cat.key]?.length || 0})
                          </button>
                        ))}
                      </div>

                      <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                        <Input
                          placeholder="Quick lookup..."
                          value={catalogSearch}
                          onChange={(e) => setCatalogSearch(e.target.value)}
                          className="h-8 pl-8 text-xs rounded-lg"
                        />
                      </div>
                    </div>

                    {/* Compact Tag View */}
                    <div className="max-h-48 overflow-y-auto p-3 bg-slate-50 dark:bg-slate-900 rounded-xl flex flex-wrap gap-1.5">
                      {filteredCatalogItems.length === 0 ? (
                        <span className="text-xs text-slate-400 italic py-2">No matching items found.</span>
                      ) : (
                        filteredCatalogItems.map((item) => (
                          <span
                            key={item}
                            className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                          >
                            {item}
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

            </CardContent>
          </Card>

          {/* School's Custom Requests Status Table */}
          <Card className="border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <CardHeader className="p-5 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <CardTitle className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-[#A05AFF]" />
                  My Custom Requested Taxonomies
                </CardTitle>
                <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
                  Track the approval & configuration status of custom positions or subjects requested by your school.
                </CardDescription>
              </div>

              <Button
                type="button"
                onClick={() => handleOpenRequestModal('position')}
                className="h-9 px-3.5 rounded-xl bg-[#A05AFF] hover:bg-[#8e44ee] text-white text-xs font-semibold self-start sm:self-auto"
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                Submit New Request
              </Button>
            </CardHeader>

            <CardContent className="p-0">
              {myRequests.length === 0 ? (
                <div className="py-12 px-4 text-center space-y-3">
                  <div className="h-10 w-10 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-[#A05AFF] flex items-center justify-center mx-auto">
                    <Send className="h-5 w-5 stroke-[1.8]" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    No custom options requested yet
                  </h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                    Need a rare position or subject not in the platform catalog? Click "Submit New Request" to ask Super Admin to configure it.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50/80 dark:bg-slate-900/50 text-slate-400 dark:text-slate-500 text-[11px] font-bold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                      <tr>
                        <th className="p-4 pl-5">Category</th>
                        <th className="p-4">Requested Name</th>
                        <th className="p-4">Requirement / Note</th>
                        <th className="p-4">Submitted On</th>
                        <th className="p-4">Review Status</th>
                        <th className="p-4 pr-5">Super Admin Response</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-medium">
                      {myRequests.map((req) => (
                        <tr key={req._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                          <td className="p-4 pl-5">
                            <span className="capitalize px-2.5 py-0.5 rounded-md text-[11px] font-bold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300">
                              {req.category}
                            </span>
                          </td>
                          <td className="p-4 font-bold text-slate-900 dark:text-slate-100">
                            {req.name}
                          </td>
                          <td className="p-4 text-slate-500 dark:text-slate-400 max-w-xs truncate">
                            {req.description || '—'}
                          </td>
                          <td className="p-4 text-slate-400 whitespace-nowrap">
                            {new Date(req.createdAt).toLocaleDateString()}
                          </td>
                          <td className="p-4 whitespace-nowrap">
                            {req.status === 'approved' && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/60 font-semibold text-[11px]">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                Approved & Added
                              </span>
                            )}
                            {req.status === 'pending' && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200/60 font-semibold text-[11px]">
                                <Clock className="h-3.5 w-3.5 animate-pulse" />
                                Under Review
                              </span>
                            )}
                            {req.status === 'rejected' && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200/60 font-semibold text-[11px]">
                                <X className="h-3.5 w-3.5" />
                                Declined
                              </span>
                            )}
                          </td>
                          <td className="p-4 pr-5 text-slate-500 dark:text-slate-400 max-w-xs">
                            {req.adminNotes || (req.status === 'pending' ? 'Reviewing criteria' : '—')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

        </TabsContent>

        {/* TAB 5: PASSWORD, ACCOUNT & SECURITY */}
        <TabsContent value="security" className="space-y-6 mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Change Password Card (7 cols on lg) */}
            <div className="lg:col-span-7 space-y-6">
              <Card className="border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-[#A05AFF] via-[#4BCBEB] to-emerald-400" />
                <CardHeader className="p-5 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <KeyRound className="h-4 w-4 text-[#A05AFF]" />
                      Change Account Password
                    </CardTitle>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#A05AFF]/10 text-[#A05AFF] border border-[#A05AFF]/20">
                      School Recruiter Access
                    </span>
                  </div>
                  <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
                    Update your login credentials. Use a strong combination of letters, numbers, and symbols.
                  </CardDescription>
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
                          className="h-10 pr-10 text-xs border-slate-200 dark:border-slate-800 rounded-xl"
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
                          className="h-10 pr-10 text-xs border-slate-200 dark:border-slate-800 rounded-xl"
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
                          className="h-10 pr-10 text-xs border-slate-200 dark:border-slate-800 rounded-xl"
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

                    <div className="pt-2">
                      <Button
                        type="submit"
                        disabled={passwordMutation.isPending}
                        className="w-full h-11 bg-gradient-to-r from-[#A05AFF] via-[#9E58FF] to-[#4BCBEB] hover:opacity-95 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-98"
                      >
                        {passwordMutation.isPending ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Updating Password...
                          </>
                        ) : (
                          <>
                            <Lock className="h-4 w-4 mr-2" />
                            Change Password
                          </>
                        )}
                      </Button>
                    </div>

                  </form>
                </CardContent>
              </Card>

              {/* Data Backup & Privacy Card */}
              <Card className="border border-slate-200/80 dark:border-slate-800 shadow-sm">
                <CardHeader className="p-5 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30">
                  <CardTitle className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Download className="h-4 w-4 text-[#A05AFF]" />
                    School Settings & Configuration Backup
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
                    Download an offline copy of all your portal settings, preferences, staff benefits, and configuration data.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs text-slate-500 space-y-0.5">
                    <p className="font-semibold text-slate-800 dark:text-slate-200">Export Backup File</p>
                    <p className="text-[11px] text-slate-400">Generates a timestamped JSON file with full settings state.</p>
                  </div>
                  <Button
                    type="button"
                    onClick={handleExportBackup}
                    className="h-9 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 text-slate-700 dark:text-slate-200 text-xs font-semibold shadow-2xs shrink-0"
                  >
                    <Download className="h-3.5 w-3.5 mr-1.5 text-[#A05AFF]" />
                    Export Backup (JSON)
                  </Button>
                </CardContent>
              </Card>

            </div>

            {/* Account Details & Session Info (5 cols on lg) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Account Details Card */}
              <Card className="border border-slate-200/80 dark:border-slate-800 shadow-sm">
                <CardHeader className="p-5 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30">
                  <CardTitle className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-[#A05AFF]" />
                    Administrator Profile Details
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
                    Logged in recruiter account metadata
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-5 space-y-3.5">
                  <div className="p-3.5 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500">Admin Name</span>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{user?.name || 'School Administrator'}</span>
                  </div>

                  <div className="p-3.5 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500">Login Email</span>
                    <span className="text-xs font-mono font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[180px]">{user?.email}</span>
                  </div>

                  <div className="p-3.5 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500">School ID Code</span>
                    <span className="text-xs font-mono font-bold text-[#A05AFF]">{school?.schoolId || 'SCH-ACTIVE'}</span>
                  </div>

                  <div className="p-3.5 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500">Portal Role</span>
                    <span className="text-xs font-semibold capitalize text-slate-700 dark:text-slate-300">
                      {user?.role?.replace('_', ' ') || 'School Admin'}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500">Authentication Mode</span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200/60 dark:bg-purple-950/40 dark:text-purple-400">
                      <BadgeCheck className="h-3 w-3" /> Secure JWT Session
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Active Session & Device Security Info */}
              <Card className="border border-slate-200/80 dark:border-slate-800 shadow-sm">
                <CardHeader className="p-5 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30">
                  <CardTitle className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Laptop className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    Current Browser & Security
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Connection</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      256-Bit SSL Encrypted
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Environment</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {window.navigator.userAgent.includes('Windows') ? 'Windows Web Client' : 'Modern Browser Client'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Last Password Check</span>
                    <span className="font-medium text-slate-500">Today</span>
                  </div>
                </CardContent>
              </Card>

            </div>

          </div>
        </TabsContent>

      </Tabs>

      {/* REQUEST NEW OPTION MODAL DIALOG */}
      <Dialog open={isRequestModalOpen} onOpenChange={setIsRequestModalOpen}>
        <DialogContent className="max-w-md p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl">
          <DialogHeader className="space-y-1 text-left">
            <DialogTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Send className="h-4 w-4 text-[#A05AFF]" />
              Request New Master Option
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
              Submit a request for a new position, subject, degree, or grade to Super Admin.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitRequest} className="space-y-4 pt-2">
            {requestSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                <span>Request sent to Super Admin for approval!</span>
              </div>
            )}

            {requestError && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                <span>{requestError}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Category</label>
              <select
                value={requestCategory}
                onChange={(e) => setRequestCategory(e.target.value)}
                className="w-full h-10 px-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#A05AFF]"
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
                className="h-10 text-xs border-slate-200 dark:border-slate-800 rounded-xl font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Description / Rationale (Optional)</label>
              <textarea
                rows={2}
                value={requestDescription}
                onChange={(e) => setRequestDescription(e.target.value)}
                placeholder="Why should this be added to the platform catalog?"
                className="w-full p-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#A05AFF]"
              />
            </div>

            <DialogFooter className="gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsRequestModalOpen(false)}
                className="h-10 rounded-xl text-xs font-semibold"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={requestMutation.isPending}
                className="h-10 px-5 rounded-xl bg-[#A05AFF] hover:bg-[#8e44ee] text-white text-xs font-semibold"
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

    </div>
  );
}