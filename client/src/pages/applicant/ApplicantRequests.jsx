import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getReceivedRequests,
  getRequestSchoolDetails,
  getApplicantPlans,
  purchaseApplicantPlan,
  createApplicantOrder,
  verifyApplicantPayment,
  unlockRequest,
} from '@/lib/api';
import { openRazorpayPayment } from '@/lib/razorpay';
import { useAuth } from '@/context/AuthContext';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogBody, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { formatDate } from '@/lib/utils';
import {
  CreditCard,
  Loader2,
  ShieldCheck,
  CheckCircle2,
  Building2,
  Mail,
  Phone,
  Lock,
  Unlock,
  Sparkles,
  Inbox,
  Clock,
  ExternalLink,
  MapPin,
  Calendar,
} from 'lucide-react';

export default function ApplicantRequests() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [schoolDetails, setSchoolDetails] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [processingPlanId, setProcessingPlanId] = useState(null);
  const [filter, setFilter] = useState('ALL'); // 'ALL' | 'UNLOCKED' | 'LOCKED'

  const { data, isLoading, isError } = useQuery({
    queryKey: ['applicant-requests'],
    queryFn: () => getReceivedRequests().then((r) => r.data),
    retry: 1,
  });

  const requests = data?.data || [];
  const hasActivePlan = data?.hasActivePlan || false;
  const requestCredits = data?.requestCredits || 0;

  const { data: plans = [] } = useQuery({
    queryKey: ['applicant-plans'],
    queryFn: () => getApplicantPlans().then((r) => r.data.data),
    enabled: showPayment,
  });

  const [errorMsg, setErrorMsg] = useState('');

  const handlePurchasePlan = async (plan) => {
    setProcessingPlanId(plan._id);
    setErrorMsg('');

    if (plan.price <= 0) {
      try {
        await purchaseApplicantPlan(plan._id);
        queryClient.invalidateQueries({ queryKey: ['applicant-subscription'] });
        queryClient.invalidateQueries({ queryKey: ['applicant-requests'] });
        setShowPayment(false);
        if (selectedRequest) {
          const res = await getRequestSchoolDetails(selectedRequest._id);
          setSchoolDetails(res.data.data);
        }
      } catch (err) {
        setErrorMsg(err.response?.data?.message || 'Failed to activate plan');
      } finally {
        setProcessingPlanId(null);
      }
      return;
    }

    try {
      const orderRes = await createApplicantOrder(plan._id);
      const orderData = orderRes.data.data;

      await openRazorpayPayment({
        orderData,
        user: {
          name: user?.name,
          email: user?.email,
          mobile: user?.mobile,
        },
        title: 'HireHub School Request Unlock',
        description: `Unlock contact details with ${plan.name}`,
        onSuccess: async (paymentResponse) => {
          try {
            await verifyApplicantPayment({
              planId: plan._id,
              ...paymentResponse,
            });

            queryClient.invalidateQueries({ queryKey: ['applicant-subscription'] });
            queryClient.invalidateQueries({ queryKey: ['applicant-requests'] });
            setShowPayment(false);

            if (selectedRequest) {
              const res = await getRequestSchoolDetails(selectedRequest._id);
              setSchoolDetails(res.data.data);
            }
          } catch (verErr) {
            setErrorMsg(verErr.response?.data?.message || 'Payment signature verification failed.');
          } finally {
            setProcessingPlanId(null);
          }
        },
        onFailure: (err) => {
          setProcessingPlanId(null);
          if (err.message && !err.message.includes('closed by user')) {
            setErrorMsg(err.message);
          }
        },
      });
    } catch (err) {
      setProcessingPlanId(null);
      setErrorMsg(err.response?.data?.message || err.message || 'Payment failed');
    }
  };

  const unlockMutation = useMutation({
    mutationFn: unlockRequest,
    onSuccess: async (res) => {
      queryClient.invalidateQueries({ queryKey: ['applicant-requests'] });
      queryClient.invalidateQueries({ queryKey: ['applicant-subscription'] });
      if (selectedRequest) {
        const detailsRes = await getRequestSchoolDetails(selectedRequest._id);
        setSchoolDetails(detailsRes.data.data);
      }
    },
    onError: (err) => {
      const status = err.response?.status;
      if (status === 402 || err.response?.data?.requiresPayment) {
        setShowPayment(true);
      } else {
        setErrorMsg(err.response?.data?.message || 'Failed to unlock request');
      }
    },
  });

  const handleUnlockRequest = (request) => {
    setSelectedRequest(request);
    setErrorMsg('');

    if (request.isUnlocked) {
      handleViewSchool(request);
      return;
    }

    if (!hasActivePlan && requestCredits <= 0) {
      setShowPayment(true);
      return;
    }

    unlockMutation.mutate(request._id);
  };

  const handleViewSchool = async (request) => {
    try {
      setErrorMsg('');
      const res = await getRequestSchoolDetails(request._id);
      setSchoolDetails(res.data.data);
    } catch (err) {
      if (err.response?.status === 402 || err.response?.data?.requiresPayment) {
        setSelectedRequest(request);
        setShowPayment(true);
      } else {
        setErrorMsg(err.response?.data?.message || 'Failed to load school details');
      }
    }
  };

  const filteredRequests = requests.filter((r) => {
    if (filter === 'UNLOCKED') return r.isUnlocked;
    if (filter === 'LOCKED') return !r.isUnlocked;
    return true;
  });

  const unlockedCount = requests.filter((r) => r.isUnlocked).length;
  const lockedCount = requests.filter((r) => !r.isUnlocked).length;

  const requestBasedPlans = plans.filter((p) => p.planType === 'REQUEST_BASED' && p.price > 0 && p.isActive);
  const unlimitedPlans = plans.filter((p) => p.planType === 'UNLIMITED' && p.price > 0 && p.isActive);

  return (
    <div className="space-y-6 w-full antialiased text-slate-800 dark:text-white max-w-6xl mx-auto pb-10">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Received School Requests"
          description="Direct interview invitations and interest requests sent by school employers"
        />

        {/* Credits Status Pill */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs shrink-0 self-start sm:self-auto">
          <Sparkles className="h-4 w-4 text-indigo-500" />
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
            Credits Balance:
          </span>
          <Badge className="bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800 font-bold text-xs">
            {requestCredits} Credits
          </Badge>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-2xl border border-red-200 bg-red-50 text-red-700 text-xs font-semibold flex items-center justify-between shadow-xs">
          <span>{errorMsg}</span>
          <button onClick={() => setErrorMsg('')} className="ml-4 font-black opacity-70 hover:opacity-100">✕</button>
        </div>
      )}

      {/* Filter Tabs Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs">
        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setFilter('ALL')}
            className={`h-9 px-3.5 rounded-xl text-xs font-bold transition-all ${
              filter === 'ALL'
                ? 'bg-blue-600 text-white hover:bg-blue-700 hover:text-white'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            All Requests ({requests.length})
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => setFilter('UNLOCKED')}
            className={`h-9 px-3.5 rounded-xl text-xs font-bold transition-all ${
              filter === 'UNLOCKED'
                ? 'bg-blue-600 text-white hover:bg-blue-700 hover:text-white'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Unlocked Contacts ({unlockedCount})
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => setFilter('LOCKED')}
            className={`h-9 px-3.5 rounded-xl text-xs font-bold transition-all ${
              filter === 'LOCKED'
                ? 'bg-blue-600 text-white hover:bg-blue-700 hover:text-white'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Pending Unlock ({lockedCount})
          </Button>
        </div>

        <span className="text-xs text-slate-400 pr-2">
          {requests.length} Total Inquiries
        </span>
      </div>

      {/* Requests List Card */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="h-8 w-8 rounded-full border-3 border-blue-600 border-t-transparent animate-spin mb-3" />
            <p className="text-xs text-slate-400 font-semibold">Loading your received requests...</p>
          </div>
        ) : isError ? (
          <Card className="p-8 text-center border-red-200 bg-red-50/50 rounded-2xl">
            <p className="text-sm font-bold text-red-600">Could not load requests. Please refresh the page.</p>
          </Card>
        ) : filteredRequests.length === 0 ? (
          <Card className="border border-dashed border-slate-200 dark:border-slate-800 p-10 text-center rounded-2xl bg-white dark:bg-slate-900">
            <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400 flex items-center justify-center mx-auto mb-3">
              <Inbox className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              No School Inquiries in this Category
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1 leading-relaxed">
              When schools discover your profile in the talent pool and invite you for an interview, their invitations will appear here.
            </p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredRequests.map((request) => (
              <Card
                key={request._id}
                className="border border-slate-200/80 bg-white dark:bg-slate-900 dark:border-slate-800 shadow-xs hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all rounded-2xl p-5 sm:p-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-base shadow-xs shrink-0">
                      <Building2 className="h-6 w-6" />
                    </div>

                    <div className="space-y-1.5 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                          {request.schoolName || 'School Inquiry'}
                        </h3>
                        <Badge className="bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800 text-xs font-bold px-2.5 py-0.5">
                          {request.positionOffered || 'General Position'}
                        </Badge>
                        {request.isUnlocked ? (
                          <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-0 text-xs font-bold flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            <span>Contact Unlocked</span>
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="border-amber-300 text-amber-700 dark:border-amber-700 dark:text-amber-300 text-xs font-semibold flex items-center gap-1">
                            <Lock className="h-3 w-3" />
                            <span>Contact Locked</span>
                          </Badge>
                        )}
                      </div>

                      {request.message && (
                        <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800 leading-relaxed italic">
                          "{request.message}"
                        </p>
                      )}

                      <div className="flex items-center gap-4 text-[11px] text-slate-400 font-medium pt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Received {formatDate(request.createdAt)}
                        </span>
                        <span className="capitalize">Status: {request.status}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="shrink-0 self-start sm:self-center">
                    {request.isUnlocked ? (
                      <Button
                        className="rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 h-10 px-5 flex items-center gap-1.5"
                        onClick={() => handleViewSchool(request)}
                      >
                        <Building2 className="h-3.5 w-3.5" />
                        <span>View School Contact</span>
                      </Button>
                    ) : (
                      <Button
                        className="rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 h-10 px-5 flex items-center gap-1.5"
                        onClick={() => handleUnlockRequest(request)}
                        disabled={unlockMutation.isPending}
                      >
                        {unlockMutation.isPending ? (
                          <>
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            <span>Unlocking...</span>
                          </>
                        ) : (
                          <>
                            <Unlock className="h-3.5 w-3.5" />
                            <span>Unlock School Details (1 Cr)</span>
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* School Contact Details Dialog Modal */}
      <Dialog open={!!schoolDetails} onOpenChange={() => setSchoolDetails(null)}>
        <DialogContent className="border border-slate-200/80 bg-white dark:bg-slate-900 shadow-2xl rounded-3xl sm:max-w-lg p-0 overflow-hidden">
          <div className="p-6 bg-gradient-to-tr from-blue-500/10 via-white to-transparent dark:from-blue-950/20 dark:via-slate-900 dark:to-transparent border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3.5">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  {schoolDetails?.request?.schoolName || schoolDetails?.school?.schoolName}
                </h3>
                <Badge className="bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800 text-[10px] font-bold mt-1">
                  Position: {schoolDetails?.request?.positionOffered || 'Offered Role'}
                </Badge>
              </div>
            </div>
          </div>

          <DialogBody className="p-6 space-y-4">
            {schoolDetails?.request?.message && (
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  School Invitation Note:
                </p>
                <p className="text-xs text-slate-700 dark:text-slate-300 italic leading-relaxed">
                  "{schoolDetails.request.message}"
                </p>
              </div>
            )}

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800/40">
                <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                  <Mail className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Official Email</p>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                    {schoolDetails?.school?.email || 'Not provided'}
                  </p>
                </div>
                {schoolDetails?.school?.email && (
                  <Button asChild size="sm" variant="outline" className="rounded-lg text-xs h-8">
                    <a href={`mailto:${schoolDetails.school.email}`}>Send Email</a>
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800/40">
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                  <Phone className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Phone Contact</p>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                    {schoolDetails?.school?.phone || 'Not provided'}
                  </p>
                </div>
                {schoolDetails?.school?.phone && (
                  <Button asChild size="sm" className="rounded-lg text-xs h-8 bg-emerald-600 hover:bg-emerald-700 text-white">
                    <a href={`tel:${schoolDetails.school.phone}`}>Call Now</a>
                  </Button>
                )}
              </div>

              {schoolDetails?.school?.address && (
                <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800/40">
                  <div className="p-2 rounded-lg bg-sky-50 text-sky-600 dark:bg-sky-950/40 dark:text-sky-400">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">School Campus Location</p>
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      {schoolDetails.school.address}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </DialogBody>

          <DialogFooter className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800">
            <Button
              variant="outline"
              className="rounded-xl border-slate-200 text-xs font-semibold"
              onClick={() => setSchoolDetails(null)}
            >
              Close Window
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Plan Purchase Dialog Modal */}
      <Dialog open={showPayment} onOpenChange={setShowPayment}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] border border-slate-200/80 bg-white dark:bg-slate-900 shadow-2xl rounded-3xl p-6 overflow-y-auto">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[#0F766E]" />
              <span>Unlock School Contact Details</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
              Select a credit bundle or unlimited subscription to view school contact details and reach out immediately.
            </DialogDescription>
          </DialogHeader>

          <DialogBody className="space-y-6">
            {requestBasedPlans.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Pay-As-You-Go Request Credits
                </h4>
                <div className="grid sm:grid-cols-2 gap-3">
                  {requestBasedPlans.map((plan) => (
                    <Card
                      key={plan._id}
                      className="border border-slate-200/80 p-4 rounded-2xl bg-white dark:bg-slate-800/50 hover:border-blue-500/50 transition-all"
                    >
                      <h5 className="font-bold text-sm text-slate-900 dark:text-white">{plan.name}</h5>
                      <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">₹{plan.price}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{plan.requestCount} Request Credits</p>
                      <Button
                        className="mt-3 w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs h-9 shadow-xs"
                        onClick={() => handlePurchasePlan(plan)}
                        disabled={processingPlanId === plan._id}
                      >
                        {processingPlanId === plan._id ? (
                          <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                        ) : (
                          `Pay ₹${plan.price}`
                        )}
                      </Button>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {unlimitedPlans.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Unlimited Access Subscriptions
                </h4>
                <div className="grid sm:grid-cols-2 gap-3">
                  {unlimitedPlans.map((plan) => (
                    <Card
                      key={plan._id}
                      className="border border-purple-200 bg-purple-50/30 dark:bg-purple-950/20 dark:border-purple-800 p-4 rounded-2xl hover:border-[#0F766E] transition-all"
                    >
                      <Badge className="bg-[#0F766E] text-white text-[10px] font-bold mb-1">
                        RECOMMENDED
                      </Badge>
                      <h5 className="font-bold text-sm text-slate-900 dark:text-white">{plan.name}</h5>
                      <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">₹{plan.price}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{plan.durationDays} Days Unlimited Contact</p>
                      <Button
                        className="mt-3 w-full rounded-xl bg-gradient-to-r from-[#0F766E] to-[#7928CA] hover:from-[#8f47ec] hover:to-[#681fb0] text-white font-bold text-xs h-9 shadow-xs"
                        onClick={() => handlePurchasePlan(plan)}
                        disabled={processingPlanId === plan._id}
                      >
                        {processingPlanId === plan._id ? (
                          <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                        ) : (
                          `Pay ₹${plan.price}`
                        )}
                      </Button>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </DialogBody>

          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              className="rounded-xl border-slate-200 text-xs font-semibold"
              onClick={() => setShowPayment(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
