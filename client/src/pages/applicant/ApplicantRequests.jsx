import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getReceivedRequests,
  getRequestSchoolDetails,
  getApplicantPlans,
  purchaseApplicantPlan,
  unlockRequest,
} from '@/lib/api';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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

  const unlockMutation = useMutation({
    mutationFn: unlockRequest,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['applicant-requests'] });
      setSchoolDetails(res.data.data);
    },
    onError: (err) => {
      if (err.response?.status === 402) {
        setShowPayment(true);
      } else {
        alert(err.response?.data?.message || 'Failed to unlock request');
      }
    },
  });

  const handleUnlockRequest = (request) => {
    setSelectedRequest(request);
    unlockMutation.mutate(request._id);
  };

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

  const requestBasedPlans = plans.filter((p) => p.planType === 'REQUEST_BASED' && p.price > 0 && p.isActive);
  const unlimitedPlans = plans.filter((p) => p.planType === 'UNLIMITED' && p.price > 0 && p.isActive);

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto bg-slate-50/50 dark:bg-slate-950 min-h-screen animate-in fade-in duration-500">
      <PageHeader
        title="Received Requests"
        description="Schools interested in your profile"
      />

      <Card className="border border-slate-200/60 bg-white shadow-2xs dark:bg-slate-900">
        <CardContent className="pt-6">
          {isLoading ? (
            <p className="text-center py-8 text-slate-400 dark:text-slate-500">Loading...</p>
          ) : data?.data?.length === 0 ? (
            <p className="text-center py-8 text-slate-400 dark:text-slate-500">
              No requests yet. Complete your profile to attract schools.
            </p>
          ) : (
            <div className="space-y-4">
              {data.data.map((request) => (
                <div key={request._id} className="rounded-lg border border-slate-200/60 p-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-slate-800 dark:text-slate-200">{request.schoolName}</h3>
                      <p className="text-sm text-slate-400 dark:text-slate-500">
                        Position: {request.positionOffered}
                      </p>
                      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{request.message}</p>
                      <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
                        {formatDate(request.createdAt)}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      <Badge className={request.status === 'viewed' ? 'bg-slate-100 text-slate-600 border-slate-200/60' : 'bg-purple-100 text-purple-700 border-purple-200/60'}>
                        {request.status}
                      </Badge>
                      {request.isUnlocked && (
                        <Badge variant="outline" className="text-xs border-emerald-200/60 bg-emerald-50/80 text-emerald-700">
                          Unlocked
                        </Badge>
                      )}
                    </div>
                  </div>
                  {request.isUnlocked ? (
                    <Button
                      className="mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-lg"
                      size="sm"
                      onClick={() => handleViewSchool(request)}
                    >
                      View School Details
                    </Button>
                  ) : (
                    <Button
                      className="mt-4 rounded-lg border-slate-200 hover:bg-slate-50 hover:text-purple-600"
                      size="sm"
                      variant="outline"
                      onClick={() => handleUnlockRequest(request)}
                      disabled={unlockMutation.isPending}
                    >
                      {unlockMutation.isPending ? 'Unlocking...' : 'Unlock Request'}
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!schoolDetails} onOpenChange={() => setSchoolDetails(null)}>
        <DialogContent className="border border-slate-200/60 bg-white dark:bg-slate-900 shadow-lg rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold text-slate-800 dark:text-slate-200">{schoolDetails?.request?.schoolName}</DialogTitle>
          </DialogHeader>
          <DialogBody>
            {schoolDetails && (
              <div className="space-y-3 text-sm">
                <p><strong className="text-slate-800 dark:text-slate-200">Position:</strong> {schoolDetails.request.positionOffered}</p>
                <p><strong className="text-slate-800 dark:text-slate-200">Message:</strong> {schoolDetails.request.message}</p>
                <hr className="border-slate-200/60 dark:border-slate-800" />
                <p><strong className="text-slate-800 dark:text-slate-200">Email:</strong> {schoolDetails.school.email}</p>
                <p><strong className="text-slate-800 dark:text-slate-200">Phone:</strong> {schoolDetails.school.phone || 'Not provided'}</p>
                <Button asChild className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-lg">
                  <a href={`mailto:${schoolDetails.school.email}`}>Contact School</a>
                </Button>
              </div>
            )}
          </DialogBody>
          <DialogFooter>
            <Button variant="outline" className="rounded-lg border-slate-200 hover:bg-slate-50" onClick={() => setSchoolDetails(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showPayment} onOpenChange={setShowPayment}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] border border-slate-200/60 bg-white dark:bg-slate-900 shadow-lg rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold text-slate-800 dark:text-slate-200">Purchase Plan to Unlock</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <p className="text-sm text-slate-400 dark:text-slate-500 mb-4">
              Purchase a plan to unlock school contact information and connect directly.
            </p>

            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Request-Based Plans</h3>
                <div className="space-y-2">
                  {requestBasedPlans.map((plan) => (
                    <Card key={plan._id} className="border border-slate-200/60 bg-slate-50/50 dark:bg-slate-900/30">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base font-bold text-slate-800 dark:text-slate-200">{plan.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">₹{plan.price}</p>
                        <p className="text-sm text-slate-400 dark:text-slate-500">{plan.requestCount} request credits</p>
                        <Button
                          className="mt-3 w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-lg"
                          onClick={() => purchaseMutation.mutate(plan._id)}
                          disabled={purchaseMutation.isPending}
                        >
                          {purchaseMutation.isPending ? 'Processing...' : `Pay ₹${plan.price}`}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Unlimited Plans</h3>
                <div className="space-y-2">
                  {unlimitedPlans.map((plan) => (
                    <Card key={plan._id} className="border border-slate-200/60 bg-slate-50/50 dark:bg-slate-900/30">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base font-bold text-slate-800 dark:text-slate-200">{plan.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">₹{plan.price}</p>
                        <p className="text-sm text-slate-400 dark:text-slate-500">{plan.durationDays} days</p>
                        <Button
                          className="mt-3 w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-lg"
                          onClick={() => purchaseMutation.mutate(plan._id)}
                          disabled={purchaseMutation.isPending}
                        >
                          {purchaseMutation.isPending ? 'Processing...' : `Pay ₹${plan.price}`}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </DialogBody>
          <DialogFooter>
            <Button variant="outline" className="rounded-lg border-slate-200 hover:bg-slate-50" onClick={() => setShowPayment(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
