import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getApplicantSubscription,
  getApplicantSubscriptionHistory,
  getApplicantPlans,
  purchaseApplicantPlan,
  createApplicantOrder,
  verifyApplicantPayment,
} from '@/lib/api';
import { openRazorpayPayment } from '@/lib/razorpay';
import { useAuth } from '@/context/AuthContext';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import {
  CreditCard,
  Loader2,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Zap,
  Calendar,
  Clock,
  History,
  Check,
  Building2,
  Lock,
} from 'lucide-react';

export default function ApplicantPlan() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [banner, setBanner] = useState(null);
  const [processingPlanId, setProcessingPlanId] = useState(null);

  const { data: subscriptionData, isLoading: subLoading } = useQuery({
    queryKey: ['applicant-subscription'],
    queryFn: () => getApplicantSubscription().then((r) => r.data.data),
  });

  const { data: history = [], isLoading: histLoading } = useQuery({
    queryKey: ['applicant-subscription-history'],
    queryFn: () => getApplicantSubscriptionHistory().then((r) => r.data.data),
  });

  const { data: plans = [] } = useQuery({
    queryKey: ['applicant-plans'],
    queryFn: () => getApplicantPlans().then((r) => r.data.data),
  });

  const handlePurchasePlan = async (plan) => {
    setProcessingPlanId(plan._id);
    setBanner(null);

    // If free plan, activate directly
    if (plan.price <= 0) {
      try {
        await purchaseApplicantPlan(plan._id);
        queryClient.invalidateQueries({ queryKey: ['applicant-subscription'] });
        queryClient.invalidateQueries({ queryKey: ['applicant-subscription-history'] });
        queryClient.invalidateQueries({ queryKey: ['applicant-dashboard'] });
        setBanner({ type: 'success', message: `${plan.name} activated successfully!` });
      } catch (err) {
        setBanner({ type: 'error', message: err.response?.data?.message || 'Failed to activate plan' });
      } finally {
        setProcessingPlanId(null);
      }
      return;
    }

    // For paid plans, launch Razorpay
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
        title: 'HireHub Candidate Membership',
        description: `${plan.name} (${plan.planType === 'REQUEST_BASED' ? `${plan.requestCount} Requests` : `${plan.durationDays} Days Unlimited`})`,
        onSuccess: async (paymentResponse) => {
          try {
            await verifyApplicantPayment({
              planId: plan._id,
              ...paymentResponse,
            });

            queryClient.invalidateQueries({ queryKey: ['applicant-subscription'] });
            queryClient.invalidateQueries({ queryKey: ['applicant-subscription-history'] });
            queryClient.invalidateQueries({ queryKey: ['applicant-dashboard'] });
            setBanner({
              type: 'success',
              message: `🎉 Payment of ₹${plan.price} Successful! ${plan.name} is now active on your account.`,
            });
          } catch (verErr) {
            setBanner({
              type: 'error',
              message: verErr.response?.data?.message || 'Payment signature verification failed.',
            });
          } finally {
            setProcessingPlanId(null);
          }
        },
        onFailure: (err) => {
          setProcessingPlanId(null);
          if (err.message && !err.message.includes('closed by user')) {
            setBanner({ type: 'error', message: err.message });
          }
        },
      });
    } catch (err) {
      setProcessingPlanId(null);
      setBanner({
        type: 'error',
        message: err.response?.data?.message || 'Failed to initialize Razorpay checkout.',
      });
    }
  };

  const requestBasedPlans = plans.filter((p) => p.planType === 'REQUEST_BASED' && p.price > 0 && p.isActive);
  const unlimitedPlans = plans.filter((p) => p.planType === 'UNLIMITED' && p.isActive);

  return (
    <div className="space-y-6 w-full antialiased text-slate-800 dark:text-white max-w-6xl mx-auto pb-10">
      
      {/* Header */}
      <PageHeader
        title="Candidate Plans & Credits"
        description="Choose a plan to unlock school employer details and accelerate your hiring process"
      />

      {banner && (
        <div className={`p-4 rounded-2xl border text-xs font-semibold flex items-center justify-between shadow-xs ${
          banner.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800' 
            : 'bg-red-50 text-red-800 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800'
        }`}>
          <span>{banner.message}</span>
          <button onClick={() => setBanner(null)} className="ml-4 opacity-70 hover:opacity-100 font-black">✕</button>
        </div>
      )}

      {/* Current Active Plan Status Hero */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="absolute top-0 right-0 h-40 w-96 bg-gradient-to-bl from-blue-500/10 via-indigo-500/5 to-transparent pointer-events-none rounded-bl-full blur-2xl" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge className="bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800 font-bold text-xs px-2.5 py-0.5">
                Current Membership
              </Badge>
              {subscriptionData?.activePlan && (
                <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-0 text-xs font-bold">
                  Active
                </Badge>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {subscriptionData?.activePlan ? subscriptionData.activePlan : 'Free Plan'}
            </h2>

            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-lg leading-relaxed">
              {subscriptionData?.activePlan
                ? `You have active access to directly view school inquiries and contact numbers until ${formatDate(subscriptionData?.planExpiryDate)}.`
                : 'With the Free Plan, you can build your profile and receive inquiries. Upgrade or purchase credits to unlock school contact details.'}
            </p>
          </div>

          {/* Credits Summary Badge Box */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 shrink-0">
            <div className="text-center px-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Available Credits</p>
              <p className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-0.5">
                {subscriptionData?.requestCredits || 0}
              </p>
            </div>
            <div className="h-10 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block" />
            <div className="text-center px-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Unlocked Inquiries</p>
              <p className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-0.5">
                {subscriptionData?.unlockedRequestsCount || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Unlimited Subscription Plans */}
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
            Unlimited Membership Plans
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Enjoy full unlimited access to all school contact details for a fixed duration
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {unlimitedPlans.map((plan) => {
            const isFree = plan.price <= 0;
            const isPopular = plan.price === 99 || plan.name.toLowerCase().includes('premium');
            return (
              <Card
                key={plan._id}
                className={`rounded-3xl border p-6 flex flex-col justify-between transition-all relative overflow-hidden ${
                  isPopular
                    ? 'border-indigo-500 bg-gradient-to-b from-indigo-50/40 via-white to-white dark:from-indigo-950/20 dark:via-slate-900 dark:to-slate-900 shadow-lg'
                    : 'border-slate-200/80 bg-white dark:bg-slate-900 dark:border-slate-800 shadow-xs hover:border-blue-500/50'
                }`}
              >
                {isPopular && (
                  <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-bl-xl shadow-xs">
                    Popular
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`p-2 rounded-xl ${isPopular ? 'bg-indigo-100 text-indigo-600' : 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400'}`}>
                      <Zap className="h-4 w-4" />
                    </div>
                    <h4 className="font-extrabold text-base text-slate-900 dark:text-white">{plan.name}</h4>
                  </div>

                  <div className="my-4">
                    <span className="text-3xl font-black text-slate-900 dark:text-white">
                      {isFree ? 'Free' : `₹${plan.price}`}
                    </span>
                    {!isFree && <span className="text-xs text-slate-400 ml-1">/ {plan.durationDays} days</span>}
                  </div>

                  <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>{isFree ? 'Receive inquiries from schools' : 'Unlimited school contact unlocks'}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>Direct phone and email visibility</span>
                    </li>
                    {plan.features?.map((f, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  className={`mt-6 w-full rounded-xl font-bold text-xs h-10 shadow-xs transition-all ${
                    isPopular
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/25'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                  onClick={() => handlePurchasePlan(plan)}
                  disabled={processingPlanId === plan._id}
                >
                  {processingPlanId === plan._id ? (
                    <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                  ) : isFree ? (
                    'Activate Free Plan'
                  ) : (
                    `Upgrade to ${plan.name}`
                  )}
                </Button>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Pay-as-you-go Request Credits */}
      {requestBasedPlans.length > 0 && (
        <div className="space-y-4 pt-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              Pay-As-You-Go Credit Bundles
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Only need to unlock a couple of specific school inquiries? Pick credits without a subscription.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {requestBasedPlans.map((plan) => (
              <Card
                key={plan._id}
                className="border border-slate-200/80 bg-white dark:bg-slate-900 dark:border-slate-800 shadow-xs hover:border-blue-500/50 transition-all rounded-2xl p-5 flex flex-col justify-between"
              >
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{plan.name}</h4>
                  <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">₹{plan.price}</p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-bold mt-1">{plan.requestCount} Request Unlock Credits</p>
                </div>

                <Button
                  variant="outline"
                  className="mt-4 w-full rounded-xl border-slate-200 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800"
                  onClick={() => handlePurchasePlan(plan)}
                  disabled={processingPlanId === plan._id}
                >
                  {processingPlanId === plan._id ? (
                    <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                  ) : (
                    `Buy for ₹${plan.price}`
                  )}
                </Button>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Subscription & Order History Table */}
      <Card className="border border-slate-200/80 bg-white dark:bg-slate-900 dark:border-slate-800 shadow-xs rounded-2xl overflow-hidden mt-6">
        <CardHeader className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              <History className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Payment & Billing History
              </CardTitle>
              <CardDescription className="text-xs">
                Record of purchased credit packs and subscriptions
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {history.length === 0 ? (
            <p className="text-center py-8 text-xs text-slate-400">
              No transactions on record yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                  <tr>
                    <th className="p-4 pl-6">Plan / Item</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Date</th>
                    <th className="p-4 pr-6 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {history.map((item) => (
                    <tr key={item._id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30">
                      <td className="p-4 pl-6 font-bold text-slate-800 dark:text-slate-200">
                        {item.planId?.name || item.planName || 'Plan'}
                      </td>
                      <td className="p-4 font-black text-slate-900 dark:text-white">
                        ₹{item.price || item.amount || 0}
                      </td>
                      <td className="p-4 text-slate-400">
                        {formatDate(item.createdAt)}
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-0 text-[10px] font-bold">
                          {item.status || 'Active'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  );
}
