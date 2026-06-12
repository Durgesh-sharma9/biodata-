import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getReceivedRequests,
  getRequestSchoolDetails,
  getApplicantPlans,
  purchaseApplicantPlan,
} from '@/lib/api';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { formatDate } from '@/lib/utils';

export default function ApplicantRequests() {
  const queryClient = useQueryClient();
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [schoolDetails, setSchoolDetails] = useState(null);
  const [showPayment, setShowPayment] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['applicant-requests'],
    queryFn: () => getReceivedRequests().then((r) => r.data),
  });

  const { data: plans = [] } = useQuery({
    queryKey: ['applicant-plans'],
    queryFn: () => getApplicantPlans().then((r) => r.data.data),
    enabled: showPayment,
  });

  const purchaseMutation = useMutation({
    mutationFn: purchaseApplicantPlan,
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['applicant-subscription'] });
      queryClient.invalidateQueries({ queryKey: ['applicant-requests'] });
      setShowPayment(false);
      if (selectedRequest) {
        const res = await getRequestSchoolDetails(selectedRequest._id);
        setSchoolDetails(res.data.data);
      }
    },
    onError: (err) => {
      alert(err.response?.data?.message || 'Payment failed');
    },
  });

  const handleViewSchool = async (request) => {
    setSelectedRequest(request);
    try {
      const res = await getRequestSchoolDetails(request._id);
      setSchoolDetails(res.data.data);
    } catch (err) {
      if (err.response?.status === 402) {
        setShowPayment(true);
      } else {
        alert(err.response?.data?.message || 'Failed to load school details');
      }
    }
  };

  const paidPlans = plans.filter((p) => p.price > 0 && p.isActive);

  return (
    <div>
      <PageHeader
        title="Received Requests"
        description="Schools interested in your profile"
      />

      <Card>
        <CardContent className="pt-6">
          {isLoading ? (
            <p className="text-center py-8">Loading...</p>
          ) : data?.data?.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">
              No requests yet. Complete your profile to attract schools.
            </p>
          ) : (
            <div className="space-y-4">
              {data.data.map((request) => (
                <div key={request._id} className="rounded-lg border p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold">{request.schoolName}</h3>
                      <p className="text-sm text-muted-foreground">
                        Position: {request.positionOffered}
                      </p>
                      <p className="mt-2 text-sm">{request.message}</p>
                      <p className="mt-2 text-xs text-muted-foreground">
                        {formatDate(request.createdAt)}
                      </p>
                    </div>
                    <Badge variant={request.status === 'viewed' ? 'secondary' : 'default'}>
                      {request.status}
                    </Badge>
                  </div>
                  <Button
                    className="mt-4"
                    size="sm"
                    variant="outline"
                    onClick={() => handleViewSchool(request)}
                  >
                    View School Details
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!schoolDetails} onOpenChange={() => setSchoolDetails(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{schoolDetails?.request?.schoolName}</DialogTitle>
          </DialogHeader>
          {schoolDetails && (
            <div className="space-y-3 text-sm">
              <p><strong>Position:</strong> {schoolDetails.request.positionOffered}</p>
              <p><strong>Message:</strong> {schoolDetails.request.message}</p>
              <hr />
              <p><strong>Email:</strong> {schoolDetails.school.email}</p>
              <p><strong>Phone:</strong> {schoolDetails.school.phone || 'Not provided'}</p>
              <Button asChild className="w-full">
                <a href={`mailto:${schoolDetails.school.email}`}>Contact School</a>
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showPayment} onOpenChange={setShowPayment}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Subscribe to View School Contact</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground mb-4">
            Purchase a plan to view school contact information and connect directly.
          </p>
          <div className="space-y-3">
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
                    className="mt-3 w-full"
                    onClick={() => purchaseMutation.mutate(plan._id)}
                    disabled={purchaseMutation.isPending}
                  >
                    {purchaseMutation.isPending ? 'Processing...' : `Pay ₹${plan.price}`}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
