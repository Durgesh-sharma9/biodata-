import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getApplicantSubscription,
  getApplicantSubscriptionHistory,
  getApplicantPlans,
  purchaseApplicantPlan,
} from '@/lib/api';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';

export default function ApplicantPlan() {
  const queryClient = useQueryClient();

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

  const purchaseMutation = useMutation({
    mutationFn: purchaseApplicantPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applicant-subscription'] });
      queryClient.invalidateQueries({ queryKey: ['applicant-subscription-history'] });
      alert('Plan activated successfully');
    },
    onError: (err) => {
      alert(err.response?.data?.message || 'Failed to purchase plan');
    },
  });

  const activeSubscription = subscriptionData?.subscription;
  const paidPlans = plans.filter((p) => p.price > 0 && p.isActive);

  return (
    <div>
      <PageHeader title="Active Plan" description="Manage your subscription" />

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
        </CardHeader>
        <CardContent>
          {subscriptionData?.hasActivePlan ? (
            <div>
              <p className="text-xl font-bold">{activeSubscription.planName}</p>
              <p className="text-sm text-muted-foreground mt-1">
                Expires: {formatDate(activeSubscription.expiryDate)}
              </p>
              <Badge className="mt-2">Active</Badge>
            </div>
          ) : (
            <div>
              <p className="text-xl font-bold">Free Plan</p>
              <p className="text-sm text-muted-foreground mt-1">
                You can create your profile, upload resume, and receive requests.
                Upgrade to view school contact details.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Available Plans</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {paidPlans.map((plan) => (
              <Card key={plan._id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{plan.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">₹{plan.price}</p>
                  <p className="text-sm text-muted-foreground">{plan.durationDays} days</p>
                  <ul className="mt-2 text-sm list-disc pl-4">
                    {plan.features?.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                  <Button
                    className="mt-3"
                    onClick={() => purchaseMutation.mutate(plan._id)}
                    disabled={purchaseMutation.isPending}
                  >
                    {purchaseMutation.isPending ? 'Processing...' : `Subscribe — ₹${plan.price}`}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Subscription History</CardTitle>
        </CardHeader>
        <CardContent>
          {history.length === 0 ? (
            <p className="text-sm text-muted-foreground">No subscription history</p>
          ) : (
            <div className="space-y-3">
              {history.map((item) => (
                <div key={item._id} className="flex items-center justify-between border-b pb-3">
                  <div>
                    <p className="font-medium">{item.planName}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(item.startDate)} — {formatDate(item.expiryDate)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₹{item.price}</p>
                    <Badge variant={item.status === 'active' ? 'default' : 'secondary'}>
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
