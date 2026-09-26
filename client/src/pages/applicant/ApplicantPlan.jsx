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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import { CreditCard, Loader2, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function ApplicantPlan() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [banner, setBanner] = useState(null);
  const [processingPlanId, setProcessingPlanId] = useState(null);

  const { data: subscriptionData } = useQuery({
    queryKey: ['applicant-subscription'],
    queryFn: () => getApplicantSubscription().then((r) => r.data.data),
  });

  const { data: history = [] } = useQuery({
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
        title: 'HireHub Applicant Subscription',
        description: `${plan.name} (${plan.planType === 'REQUEST_BASED' ? `${plan.requestCount} Requests` : `${plan.durationDays} Days Unlimited`})`,
        onSuccess: async (paymentResponse) => {
          try {
            await verifyApplicantPayment({
              planId: plan._id,
              ...paymentResponse,
            });

            queryClient.invalidateQueries({ queryKey: ['applicant-subscription'] });
            queryClient.invalidateQueries({ queryKey: ['applicant-subscription-history'] });
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
  const unlimitedPlans = plans.filter((p) => p.planType === 'UNLIMITED' && p.price > 0 && p.isActive);

  return (
    <div className="space-y-6 w-full antialiased text-slate-800 dark:text-white">
      <PageHeader title="My Plan" description="Manage your subscription and credits" />

      {banner && (
        <div className={`p-4 rounded-xl border text-xs font-bold flex items-center justify-between ${
          banner.type === 'success' 
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
            : 'bg-red-50 text-red-700 border-red-200'
        }`}>
          <span>{banner.message}</span>
          <button onClick={() => setBanner(null)} className="ml-4 opacity-70 hover:opacity-100">✕</button>
        </div>
      )}

      {/* Current Status */}
      <Card className="border border-slate-200/60 bg-white shadow-2xs dark:bg-slate-900">
        <CardHeader>
          <CardTitle className="text-sm font-bold text-slate-800 dark:text-slate-200">Current Status</CardTitle>
        </CardHeader>
        <CardContent>
          {subscriptionData?.requestCredits > 0 && (
            <div className="mb-4">
              <p className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">{subscriptionData.requestCredits} Request Credits</p>
              <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
                Use credits to unlock school requests. Each unlock uses 1 credit.
              </p>
            </div>
          )}
          {subscriptionData?.activePlan && subscriptionData?.planExpiryDate && (
            <div className={subscriptionData.requestCredits > 0 ? 'mt-4 pt-4 border-t border-slate-200/60 dark:border-slate-800' : ''}>
              <p className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Unlimited Plan Active</p>
              <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
                Expires: {formatDate(subscriptionData.planExpiryDate)}
              </p>
              <Badge className="mt-2 bg-emerald-100 text-emerald-700 border-emerald-200/60">Active</Badge>
            </div>
          )}
          {!subscriptionData?.requestCredits && !subscriptionData?.activePlan && (
            <div>
              <p className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Free Plan</p>
              <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
                You can create your profile, upload resume, and receive requests.
                Purchase credits or an unlimited plan to view school contact details.
              </p>
            </div>
          )}
          {subscriptionData?.unlockedRequestsCount > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-200/60 dark:border-slate-800">
              <p className="text-sm text-slate-400 dark:text-slate-500">
                Unlocked Requests: {subscriptionData.unlockedRequestsCount}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Request-Based Plans */}
      <Card className="border border-slate-200/60 bg-white shadow-2xs dark:bg-slate-900">
        <CardHeader>
          <CardTitle className="text-sm font-bold text-slate-800 dark:text-slate-200">Request-Based Plans</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {requestBasedPlans.map((plan) => (
              <Card key={plan._id} className="border border-slate-200/60 bg-slate-50/50 dark:bg-slate-900/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-bold text-slate-800 dark:text-slate-200">{plan.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">₹{plan.price}</p>
                  <p className="text-sm text-slate-400 dark:text-slate-500">{plan.requestCount} request credits</p>
                  <ul className="mt-2 text-sm list-disc pl-4 text-slate-600 dark:text-slate-400">
                    {plan.features?.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                  <Button
                    className="mt-3 bg-gradient-to-r from-[#A05AFF] to-[#7928CA] hover:from-[#8f47ec] hover:to-[#681fb0] text-white font-bold rounded-xl h-10 w-full flex items-center justify-center gap-2 shadow-xs transition-all"
                    onClick={() => handlePurchasePlan(plan)}
                    disabled={processingPlanId === plan._id}
                  >
                    {processingPlanId === plan._id ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Opening Razorpay...</span>
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-4 w-4" />
                        <span>Purchase — ₹{plan.price}</span>
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Unlimited Plans */}
      <Card className="border border-slate-200/60 bg-white shadow-2xs dark:bg-slate-900">
        <CardHeader>
          <CardTitle className="text-sm font-bold text-slate-800 dark:text-slate-200">Unlimited Plans</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {unlimitedPlans.map((plan) => (
              <Card key={plan._id} className="border border-slate-200/60 bg-slate-50/50 dark:bg-slate-900/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-bold text-slate-800 dark:text-slate-200">{plan.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">₹{plan.price}</p>
                  <p className="text-sm text-slate-400 dark:text-slate-500">{plan.durationDays} days</p>
                  <ul className="mt-2 text-sm list-disc pl-4 text-slate-600 dark:text-slate-400">
                    {plan.features?.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                  <Button
                    className="mt-3 bg-gradient-to-r from-[#A05AFF] to-[#7928CA] hover:from-[#8f47ec] hover:to-[#681fb0] text-white font-bold rounded-xl h-10 w-full flex items-center justify-center gap-2 shadow-xs transition-all"
                    onClick={() => handlePurchasePlan(plan)}
                    disabled={processingPlanId === plan._id}
                  >
                    {processingPlanId === plan._id ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Opening Razorpay...</span>
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-4 w-4" />
                        <span>Subscribe — ₹{plan.price}</span>
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Subscription History */}
      <Card className="border border-slate-200/60 bg-white shadow-2xs dark:bg-slate-900">
        <CardHeader>
          <CardTitle className="text-sm font-bold text-slate-800 dark:text-slate-200">Subscription History</CardTitle>
        </CardHeader>
        <CardContent>
          {history.length === 0 ? (
            <p className="text-sm text-slate-400 dark:text-slate-500">No subscription history</p>
          ) : (
            <div className="space-y-3">
              {history.map((item) => (
                <div key={item._id} className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div>
                    <p className="font-bold text-slate-800 dark:text-slate-200">{item.planName}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">
                      {formatDate(item.startDate)} — {formatDate(item.expiryDate)}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">
                      {item.planType === 'REQUEST_BASED' ? `${item.requestCount} credits` : `${item.durationDays} days`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-800 dark:text-slate-200">₹{item.price}</p>
                    <Badge className={item.status === 'active' ? 'bg-emerald-100 text-emerald-700 border-emerald-200/60' : 'bg-slate-100 text-slate-600 border-slate-200/60'}>
                      {item.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
