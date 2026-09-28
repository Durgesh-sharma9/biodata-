import { useState, useMemo } from 'react';
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
  Sparkle, 
  KeyRound,
  Settings2,
  Send,
  HelpCircle,
  BadgeCheck,
  ChevronDown,
  ChevronUp,
  Sparkles
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

export default function Settings() {
  const queryClient = useQueryClient();
  const { user, school } = useAuth();

  // Default tab is now Hiring Workflow (general school preferences)
  const [activeTab, setActiveTab] = useState('hiring');

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
      autoAcknowledgeCandidates: settings.autoAcknowledgeCandidates ?? true,
      customWelcomeMessage: settings.customWelcomeMessage || 'Thank you for applying to our school. Our recruitment team will review your application soon.',
      contactWorkingHours: settings.contactWorkingHours || '09:00 AM - 04:00 PM',
      preferredExperienceMin: settings.preferredExperienceMin ?? 0,
    };
  }, [settings]);

  const currentPreferences = preferencesForm || preferences || {};

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
      setTimeout(() => setPrefSaveSuccess(false), 3000);
    },
  });

  const passwordMutation = useMutation({
    mutationFn: changeUserPassword,
    onSuccess: () => {
      setPasswordSuccess(true);
      setPasswordError('');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setPasswordSuccess(false), 4000);
    },
    onError: (err) => {
      setPasswordError(err?.response?.data?.message || 'Failed to update password. Please check your current password.');
    },
  });

  const handlePreferenceChange = (key, value) => {
    setPreferencesForm((prev) => ({
      ...(prev || preferences),
      [key]: value,
    }));
  };

  const handleSavePreferences = (e) => {
    e.preventDefault();
    preferencesMutation.mutate(currentPreferences);
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    setPasswordError('');
    if (passwordForm.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
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

  const positionsCount = masterData?.positions?.length || 0;
  const subjectsCount = masterData?.subjects?.length || 0;
  const qualificationsCount = masterData?.qualifications?.length || 0;
  const classesCount = masterData?.classes?.length || 0;

  const catalogItems = masterData?.[selectedCatalogCategory] || [];
  const filteredCatalogItems = catalogSearch
    ? catalogItems.filter((i) => i.toLowerCase().includes(catalogSearch.toLowerCase()))
    : catalogItems;

  return (
    <div className="space-y-6 w-full antialiased text-slate-800 dark:text-slate-200 pb-12">
      
      {/* Page Header */}
      <PageHeader 
        title="Settings & Preferences" 
        description="Manage your school's recruitment status, candidate portal settings, notifications, and security." 
        action={
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#A05AFF]/30 bg-[#A05AFF]/5 text-[#A05AFF] text-xs font-bold">
            <Building2 className="h-3.5 w-3.5" />
            <span>{school?.schoolName || 'School Admin'}</span>
          </div>
        }
      />

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
        <TabsList className="bg-slate-100 dark:bg-slate-900 p-1 rounded-xl h-auto border border-slate-200/80 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-1">
          <TabsTrigger value="hiring" className="flex items-center gap-2 py-2.5 text-xs font-bold rounded-lg">
            <Settings2 className="h-4 w-4" />
            <span>Hiring Workflow</span>
          </TabsTrigger>

          <TabsTrigger value="taxonomy" className="flex items-center gap-2 py-2.5 text-xs font-bold rounded-lg relative">
            <Sliders className="h-4 w-4" />
            <span>Recruitment Criteria</span>
            {myRequests.length > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-[#A05AFF]/15 text-[#A05AFF] font-bold">
                {myRequests.length}
              </span>
            )}
          </TabsTrigger>

          <TabsTrigger value="notifications" className="flex items-center gap-2 py-2.5 text-xs font-bold rounded-lg">
            <Bell className="h-4 w-4" />
            <span>Notifications</span>
          </TabsTrigger>

          <TabsTrigger value="security" className="flex items-center gap-2 py-2.5 text-xs font-bold rounded-lg">
            <ShieldCheck className="h-4 w-4" />
            <span>Account & Security</span>
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: HIRING WORKFLOW (PRIMARY SCHOOL SETTINGS) */}
        <TabsContent value="hiring" className="space-y-6 mt-0">
          <form onSubmit={handleSavePreferences}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              <div className="lg:col-span-2 space-y-6">
                <Card className="border border-slate-200/80 dark:border-slate-800 shadow-sm">
                  <CardHeader className="p-5 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30">
                    <CardTitle className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Settings2 className="h-4 w-4 text-[#A05AFF]" />
                      Public Application Portal Behaviour
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
                      Configure how candidate submissions are handled through your unique QR code and portal links.
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="p-5 space-y-6">
                    {/* Actively Hiring Toggle */}
                    <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/20">
                      <div className="space-y-1">
                        <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                          <span className={`h-2.5 w-2.5 rounded-full ${currentPreferences.isActivelyHiring ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                          Active Recruitment Status
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Show "We are actively hiring" banner on your school's public candidate application form.
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
                        <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          Accept Walk-In & QR Code Submissions
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Allows candidates to scan your reception standee and apply on their smartphone immediately.
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

                    {/* Minimum Experience Preference */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Default Preferred Experience Requirement
                      </label>
                      <select
                        value={currentPreferences.preferredExperienceMin}
                        onChange={(e) => handlePreferenceChange('preferredExperienceMin', Number(e.target.value))}
                        className="w-full h-11 px-3.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#A05AFF]"
                      >
                        <option value={0}>Any Experience Level / Freshers Welcome</option>
                        <option value={1}>Minimum 1 Year Teaching / Relevant Experience</option>
                        <option value={2}>Minimum 2 Years Teaching / Relevant Experience</option>
                        <option value={3}>Minimum 3+ Years Prior Experience</option>
                        <option value={5}>Senior Staff (5+ Years Experience)</option>
                      </select>
                      <p className="text-[11px] text-slate-400">
                        Applicants meeting this threshold get tagged with a priority indicator in your dashboard.
                      </p>
                    </div>

                    {/* Contact Working Hours */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-[#A05AFF]" />
                        School Recruitment & Interview Hours
                      </label>
                      <Input
                        value={currentPreferences.contactWorkingHours}
                        onChange={(e) => handlePreferenceChange('contactWorkingHours', e.target.value)}
                        placeholder="e.g. 09:00 AM - 04:00 PM (Monday to Saturday)"
                        className="h-10 text-xs border-slate-200 dark:border-slate-800 rounded-xl"
                      />
                      <p className="text-[11px] text-slate-400">
                        Informs candidates when to contact the school administration office.
                      </p>
                    </div>

                    {/* Custom Candidate Welcome & Acknowledgement Message */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Candidate Success Confirmation Message
                      </label>
                      <textarea
                        rows={3}
                        value={currentPreferences.customWelcomeMessage}
                        onChange={(e) => handlePreferenceChange('customWelcomeMessage', e.target.value)}
                        placeholder="Enter the message displayed to candidates immediately after form submission..."
                        className="w-full p-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#A05AFF]"
                      />
                      <p className="text-[11px] text-slate-400">
                        Displayed on screen when an applicant completes their submission.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Action Sidebar Card */}
              <div className="space-y-6">
                <Card className="border border-slate-200/80 dark:border-slate-800 shadow-sm p-5 space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Save Hiring Preferences
                    </h3>
                    <p className="text-xs text-slate-500">
                      Changes take effect instantly on your public link and application workflow.
                    </p>
                  </div>

                  {prefSaveSuccess && (
                    <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 shrink-0" />
                      <span>Preferences saved successfully!</span>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={preferencesMutation.isPending}
                    className="w-full h-11 bg-[#A05AFF] hover:bg-[#8e44ee] text-white font-semibold text-xs rounded-xl shadow-sm"
                  >
                    {preferencesMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving Changes...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Preferences
                      </>
                    )}
                  </Button>
                </Card>

                <Card className="border border-[#A05AFF]/20 bg-[#A05AFF]/5 p-5 space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#A05AFF]">
                    <Sparkle className="h-4 w-4" />
                    <span>Recruiter Tip</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                    Setting your <strong>Recruitment Hours</strong> clearly helps candidates call during official school office timings.
                  </p>
                </Card>
              </div>

            </div>
          </form>
        </TabsContent>

        {/* TAB 2: RECRUITMENT CRITERIA & REQUESTS (CLEAN SUMMARY - NO MESSY PILL DUMP) */}
        <TabsContent value="taxonomy" className="space-y-6 mt-0">
          
          {/* Clean Overview Card with Stats */}
          <Card className="border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
            <CardHeader className="p-5 border-b border-slate-100 dark:border-slate-800/80 bg-gradient-to-r from-purple-50/60 via-white to-slate-50/40 dark:from-slate-900/50 dark:to-slate-900/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-[#A05AFF]/10 text-[#A05AFF] shrink-0 mt-0.5">
                  <BadgeCheck className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Central Platform Recruitment Criteria
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Centrally maintained by Super Admin according to CBSE / ICSE standards. Need a custom role or subject? Request it below.
                  </CardDescription>
                </div>
              </div>

              <Button
                type="button"
                onClick={() => handleOpenRequestModal('position')}
                className="shrink-0 h-9 px-4 rounded-xl bg-[#A05AFF] hover:bg-[#8e44ee] text-white text-xs font-bold shadow-xs flex items-center gap-1.5"
              >
                <Plus className="h-4 w-4 stroke-[2.2]" />
                Request Custom Option
              </Button>
            </CardHeader>

            <CardContent className="p-5 space-y-6">
              
              {/* 4 Sleek Compact Metric Counters */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl border border-cyan-200/80 bg-cyan-50/40 dark:bg-cyan-950/20 dark:border-cyan-800/60 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-700 dark:text-cyan-300">
                    <Briefcase className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-base font-extrabold text-cyan-900 dark:text-cyan-200 leading-tight">
                      {positionsCount}
                    </div>
                    <div className="text-[11px] font-semibold text-cyan-700/80 dark:text-cyan-400">
                      Standard Positions
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
                      Academic Subjects
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
                      Degrees & Diplomas
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
                      Active Classes
                    </div>
                  </div>
                </div>
              </div>

              {/* Collapsible "Browse Supported Options" Drawer (Hidden by default, clean when opened) */}
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
                    <div className="max-h-40 overflow-y-auto p-3 bg-slate-50 dark:bg-slate-900 rounded-xl flex flex-wrap gap-1.5">
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
                  My Custom Requests
                </CardTitle>
                <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
                  Track the approval & configuration status of positions, subjects, or qualifications requested by your school.
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
                    Need a position or subject not in the platform defaults? Click "Submit New Request" to ask Super Admin to configure it.
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
                            {req.adminNotes || (req.status === 'pending' ? 'Reviewing criteria & custom fields' : '—')}
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

        {/* TAB 3: NOTIFICATIONS */}
        <TabsContent value="notifications" className="space-y-6 mt-0">
          <div className="max-w-3xl space-y-6">
            <Card className="border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <CardHeader className="p-5 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30">
                <CardTitle className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Bell className="h-4 w-4 text-[#A05AFF]" />
                  Recruitment Alert Channels
                </CardTitle>
                <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
                  Select which events trigger automated notifications to the school administration.
                </CardDescription>
              </CardHeader>

              <CardContent className="p-5 space-y-5">
                
                {/* Email Notification on new application */}
                <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/20">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-950/40 dark:text-sky-400 shrink-0 mt-0.5">
                      <Mail className="h-4 w-4" />
                    </div>
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        New Candidate Email Notification
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Receive an immediate email alert whenever a candidate submits a form to {user?.email || 'your email'}.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      handlePreferenceChange('emailNotifications', !currentPreferences.emailNotifications);
                      preferencesMutation.mutate({
                        ...currentPreferences,
                        emailNotifications: !currentPreferences.emailNotifications,
                      });
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
                      handlePreferenceChange('dailyDigest', !currentPreferences.dailyDigest);
                      preferencesMutation.mutate({
                        ...currentPreferences,
                        dailyDigest: !currentPreferences.dailyDigest,
                      });
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

                {/* WhatsApp Alert */}
                <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/20">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 shrink-0 mt-0.5">
                      <Phone className="h-4 w-4" />
                    </div>
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        WhatsApp Alerts
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Instant WhatsApp ping for urgent position applications (sent to school mobile).
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      handlePreferenceChange('whatsappAlerts', !currentPreferences.whatsappAlerts);
                      preferencesMutation.mutate({
                        ...currentPreferences,
                        whatsappAlerts: !currentPreferences.whatsappAlerts,
                      });
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

              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* TAB 4: ACCOUNT & SECURITY */}
        <TabsContent value="security" className="space-y-6 mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Account Details Card */}
            <Card className="border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <CardHeader className="p-5 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30">
                <CardTitle className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-[#A05AFF]" />
                  Administrator Profile & Session
                </CardTitle>
                <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
                  Current authenticated school recruiter credentials
                </CardDescription>
              </CardHeader>

              <CardContent className="p-5 space-y-4">
                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500">Administrator Name</span>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{user?.name || 'School Admin'}</span>
                  </div>

                  <div className="p-3.5 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500">Login Email</span>
                    <span className="text-xs font-mono font-semibold text-slate-800 dark:text-slate-200">{user?.email}</span>
                  </div>

                  <div className="p-3.5 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500">School Identifier</span>
                    <span className="text-xs font-mono font-bold text-[#A05AFF]">{school?.schoolId || 'N/A'}</span>
                  </div>

                  <div className="p-3.5 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500">Security Clearance</span>
                    <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60 dark:bg-emerald-950/40 dark:text-emerald-400">
                      Active Authorized Session
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Change Password Card */}
            <Card className="border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <CardHeader className="p-5 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30">
                <CardTitle className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <KeyRound className="h-4 w-4 text-[#A05AFF]" />
                  Change Password
                </CardTitle>
                <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
                  Update your school admin portal access password
                </CardDescription>
              </CardHeader>

              <CardContent className="p-5">
                <form onSubmit={handleChangePassword} className="space-y-4">
                  
                  {passwordSuccess && (
                    <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 shrink-0" />
                      <span>Password changed successfully!</span>
                    </div>
                  )}

                  {passwordError && (
                    <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400 text-xs font-semibold flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{passwordError}</span>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Current Password
                    </label>
                    <div className="relative">
                      <Input
                        type={showCurrentPw ? 'text' : 'password'}
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                        required
                        placeholder="••••••••"
                        className="h-10 pr-10 text-xs border-slate-200 dark:border-slate-800 rounded-xl"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPw(!showCurrentPw)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showCurrentPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      New Password (min 6 characters)
                    </label>
                    <div className="relative">
                      <Input
                        type={showNewPw ? 'text' : 'password'}
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                        required
                        placeholder="••••••••"
                        className="h-10 pr-10 text-xs border-slate-200 dark:border-slate-800 rounded-xl"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPw(!showNewPw)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showNewPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Confirm New Password
                    </label>
                    <Input
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      required
                      placeholder="••••••••"
                      className="h-10 text-xs border-slate-200 dark:border-slate-800 rounded-xl"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={passwordMutation.isPending}
                    className="w-full h-10 bg-[#A05AFF] hover:bg-[#8e44ee] text-white font-semibold text-xs rounded-xl shadow-xs"
                  >
                    {passwordMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Updating Password...
                      </>
                    ) : (
                      <>
                        <Lock className="h-3.5 w-3.5 mr-1.5" />
                        Update Password
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

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
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>Request sent to Super Admin for approval!</span>
              </div>
            )}

            {requestError && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{requestError}</span>
              </div>
            )}

            {/* Category Select */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Option Category
              </label>
              <select
                value={requestCategory}
                onChange={(e) => setRequestCategory(e.target.value)}
                className="w-full h-10 px-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#A05AFF]"
              >
                <option value="position">Position (e.g. Swimming Coach, AI Trainer)</option>
                <option value="subject">Subject (e.g. French, Coding, Robotics)</option>
                <option value="qualification">Qualification (e.g. CTET, PhD, NTT)</option>
                <option value="class">Class (e.g. Pre-Nursery, Daycare)</option>
              </select>
            </div>

            {/* Name Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Requested Title / Name *
              </label>
              <Input
                value={requestName}
                onChange={(e) => setRequestName(e.target.value)}
                placeholder="e.g. Robotics & Coding Trainer"
                required
                className="h-10 text-xs border-slate-200 dark:border-slate-800 rounded-xl"
              />
            </div>

            {/* Description / Requirement Note */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                School Requirement / Field Details (Optional)
              </label>
              <textarea
                rows={3}
                value={requestDescription}
                onChange={(e) => setRequestDescription(e.target.value)}
                placeholder="Describe why this option is needed or any specific fields to collect from candidates..."
                className="w-full p-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#A05AFF]"
              />
            </div>

            <DialogFooter className="pt-2 flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsRequestModalOpen(false)}
                className="h-10 text-xs font-semibold rounded-xl border-slate-200"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={requestMutation.isPending || requestSuccess}
                className="h-10 px-5 text-xs font-semibold rounded-xl bg-[#A05AFF] hover:bg-[#8e44ee] text-white"
              >
                {requestMutation.isPending ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5 mr-1.5" />
                    Send Request
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