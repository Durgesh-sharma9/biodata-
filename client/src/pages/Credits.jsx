import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  getSchoolCredits, 
  getUnlockHistory, 
  getCreditPackages, 
  createCreditOrder, 
  verifyCreditPayment 
} from '@/lib/api';
import { openRazorpayPayment } from '@/lib/razorpay';
import { useAuth } from '@/context/AuthContext';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import { 
  Coins, 
  Sparkles, 
  ShoppingBag, 
  History, 
  User, 
  Briefcase, 
  Layers, 
  Calendar, 
  Loader2, 
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  CreditCard
} from 'lucide-react';

export default function Credits() {
  const { user, refreshSchool } = useAuth();
  const queryClient = useQueryClient();
  const [processingPackageId, setProcessingPackageId] = useState(null);
  const [paymentBanner, setPaymentBanner] = useState(null);

  const { data: credits, isLoading: isLoadingCredits } = useQuery({
    queryKey: ['credits'],
    queryFn: () => getSchoolCredits().then((r) => r.data.data),
  });

  const { data: history = [], isLoading: isLoadingHistory } = useQuery({
    queryKey: ['unlock-history'],
    queryFn: () => getUnlockHistory().then((r) => r.data.data),
  });

  const { data: packages = [], isLoading: isLoadingPackages } = useQuery({
    queryKey: ['credit-packages'],
    queryFn: () => getCreditPackages().then((r) => r.data.data),
  });

  const handlePurchaseWithRazorpay = async (pkg) => {
    setProcessingPackageId(pkg._id);
    setPaymentBanner(null);

    try {
      // 1. Create Order on Backend
      const orderRes = await createCreditOrder(pkg._id);
      const orderData = orderRes.data.data;

      // 2. Launch Razorpay modal
      await openRazorpayPayment({
        orderData,
        user: {
          name: user?.name,
          email: user?.email,
          mobile: user?.mobile,
        },
        title: 'HireHub Candidate Credits',
        description: `${pkg.credits} Token Credits for School Account`,
        onSuccess: async (paymentResponse) => {
          try {
            // 3. Verify Payment Signature
            const verifyRes = await verifyCreditPayment({
              packageId: pkg._id,
              ...paymentResponse,
            });

            queryClient.invalidateQueries({ queryKey: ['credits'] });
            await refreshSchool();

            setPaymentBanner({
              type: 'success',
              message: `🎉 Payment of ₹${pkg.price || orderData.amount} Successful! ${pkg.credits} credits added to your wallet. (Ref: ${paymentResponse.razorpay_payment_id})`,
            });
          } catch (verErr) {
            setPaymentBanner({
              type: 'error',
              message: verErr.response?.data?.message || 'Payment signature verification failed.',
            });
          } finally {
            setProcessingPackageId(null);
          }
        },
        onFailure: (err) => {
          setProcessingPackageId(null);
          if (err.message && !err.message.includes('closed by user')) {
            setPaymentBanner({ type: 'error', message: err.message });
          }
        },
      });
    } catch (err) {
      setProcessingPackageId(null);
      setPaymentBanner({
        type: 'error',
        message: err.response?.data?.message || 'Failed to initiate Razorpay checkout. Please try again.',
      });
    }
  };

  return (
    <div className="space-y-6 w-full antialiased text-slate-800 dark:text-slate-200">
      
      {/* Payment Feedback Banner */}
      {paymentBanner && (
        <div className={`p-4 rounded-xl border text-xs font-bold flex items-center justify-between shadow-xs animate-in fade-in duration-200 ${
          paymentBanner.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300' 
            : 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-300'
        }`}>
          <div className="flex items-center gap-2.5">
            {paymentBanner.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
            )}
            <span>{paymentBanner.message}</span>
          </div>
          <button 
            type="button" 
            onClick={() => setPaymentBanner(null)} 
            className="ml-4 opacity-70 hover:opacity-100 font-bold px-1.5 py-0.5 rounded hover:bg-black/5"
          >
            ✕
          </button>
        </div>
      )}

      {/* Page Header Panel Layout */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-800 dark:text-white flex items-center gap-2">
            <Coins className="h-5 w-5 text-purple-600" /> Wallet &amp; Credits
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 font-medium">
            Scale your talent acquisition pipelines, purchase package extensions via Razorpay, and monitor historical profile unlocks.
          </p>
        </div>
        <div className="inline-flex items-center gap-1.5 border border-purple-200/60 bg-purple-50/80 text-purple-700 rounded-lg px-3 py-1.5 text-xs font-bold">
          <ShieldCheck className="h-3.5 w-3.5 text-purple-600" /> Razorpay Test Gateway Active
        </div>
      </div>

      {/* Main Structural Grid */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        
        {/* Available Balance Card Component */}
        <Card>
          <CardHeader className="p-5 pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-2">
              Available Credits
            </CardTitle>
            <div className="p-2 border border-purple-200/60 bg-purple-50/80 text-purple-700 rounded-lg">
              <Sparkles className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="p-5 pt-2">
            {isLoadingCredits ? (
              <div className="h-16 flex items-center"><Loader2 className="h-6 w-6 text-purple-600 animate-spin" /></div>
            ) : (
              <div>
                <div className="flex items-baseline gap-2">
                  <p className="text-5xl font-bold text-slate-800 dark:text-white tracking-tight">
                    {credits?.credits ?? 0}
                  </p>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50/80 border border-purple-200/60 px-2 py-0.5 rounded-lg">Token Units</span>
                </div>
                
                {credits?.plan ? (
                  <div className="mt-4 p-3 bg-slate-50/50 border border-slate-100 rounded-lg flex items-center justify-between text-xs font-medium text-slate-500 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-600" />
                      Active Tier: <strong className="text-slate-800 dark:text-slate-200 font-bold">{credits.plan.name}</strong>
                    </span>
                    <span className="text-slate-400 dark:text-slate-500 text-[11px]">
                      Expires: {credits.expiryDate ? formatDate(credits.expiryDate) : 'N/A'}
                    </span>
                  </div>
                ) : (
                  <p className="mt-4 text-xs text-slate-400 dark:text-slate-500 font-medium">No active tier structural package identified.</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Storefront Card Component */}
        <Card>
          <CardHeader className="p-5 pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Purchase Credit Packs
            </CardTitle>
            <div className="p-2 border border-emerald-200/60 bg-emerald-50/80 text-emerald-600 rounded-lg">
              <ShoppingBag className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="p-5 pt-2 space-y-3 max-h-[300px] overflow-y-auto pr-1">
            {isLoadingPackages ? (
              <div className="py-8 flex justify-center"><Loader2 className="h-6 w-6 text-slate-400 animate-spin" /></div>
            ) : packages.filter((p) => p.isActive !== false).length === 0 ? (
              <p className="text-sm text-slate-400 dark:text-slate-500 font-medium py-4 text-center">No active packages configured.</p>
            ) : (
              packages.filter((p) => p.isActive !== false).map((pkg) => (
                <div 
                  key={pkg._id} 
                  className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-white p-3.5 transition-all hover:border-[#A05AFF]/50 hover:shadow-xs dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        {pkg.name}
                      </p>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 border border-purple-200/70 rounded-md px-1.5 py-0.5">
                        {pkg.credits} Credits
                      </span>
                    </div>
                    <p className="text-xs font-extrabold text-[#A05AFF]">
                      ₹{pkg.price || Math.max(99, pkg.credits * 15)}
                    </p>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => handlePurchaseWithRazorpay(pkg)} 
                    disabled={processingPackageId === pkg._id}
                    className="h-9 rounded-xl bg-gradient-to-r from-[#A05AFF] to-[#7928CA] hover:from-[#8f47ec] hover:to-[#681fb0] text-white text-xs font-bold px-3.5 transition-all shadow-xs flex items-center gap-1.5"
                  >
                    {processingPackageId === pkg._id ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        <span>Opening...</span>
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-3.5 w-3.5" />
                        <span>Buy Now</span>
                      </>
                    )}
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Profile Unlock Audit Trail Section */}
      <Card>
        <CardHeader className="p-5 border-b border-slate-200/60 dark:border-slate-800 flex flex-row items-center justify-between space-y-0">
          <div className="space-y-0.5">
            <CardTitle className="text-sm font-bold tracking-wide text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <History className="h-4 w-4 text-purple-600" /> Profile Unlock Audit Ledger
            </CardTitle>
            <p className="text-xs font-medium text-slate-400 dark:text-slate-500">Chronological verification records of asset consumption</p>
          </div>
          <div className="border border-slate-200/60 bg-slate-50/50 text-slate-600 rounded-lg px-2.5 py-0.5 text-[11px] font-bold dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
            Total Logs: {history.length}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="w-full overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-b border-slate-200/60 dark:border-slate-800">
                  <TableHead className="text-slate-700 dark:text-slate-300 font-bold text-[11px] uppercase tracking-wider pl-6 h-12">
                    <span className="flex items-center gap-1.5"><User className="h-3 w-3" /> Candidate</span>
                  </TableHead>
                  <TableHead className="text-slate-700 dark:text-slate-300 font-bold text-[11px] uppercase tracking-wider h-12">
                    <span className="flex items-center gap-1.5"><Briefcase className="h-3 w-3" /> Target Position</span>
                  </TableHead>
                  <TableHead className="text-slate-700 dark:text-slate-300 font-bold text-[11px] uppercase tracking-wider h-12">
                    <span className="flex items-center gap-1.5"><Layers className="h-3 w-3" /> Sourcing Matrix</span>
                  </TableHead>
                  <TableHead className="text-slate-700 dark:text-slate-300 font-bold text-[11px] uppercase tracking-wider pr-6 h-12">
                    <span className="flex items-center gap-1.5"><Calendar className="h-3 w-3" /> Timestamp</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingHistory ? (
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={4} className="py-12 text-center">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Loader2 className="h-6 w-6 text-purple-600 animate-spin" />
                        <span className="text-xs text-slate-400 font-semibold tracking-wide">Syncing data log matrices...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : history.length === 0 ? (
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={4} className="py-12 text-center">
                      <div className="max-w-sm mx-auto flex flex-col items-center justify-center space-y-2">
                        <div className="p-2.5 border border-slate-200/60 bg-slate-50/50 rounded-lg text-slate-400 dark:border-slate-800 dark:bg-slate-950">
                          <History className="h-5 w-5" />
                        </div>
                        <div className="space-y-0.5">
                          <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">Audit pipeline vacant</h4>
                          <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                            No external platform profiles have been requested or unlocked inside your database pool yet.
                          </p>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  history.map((h) => (
                    <TableRow key={h._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all border-b border-slate-200/60 last:border-none dark:border-slate-800">
                      <TableCell className="font-bold text-slate-800 text-sm pl-6 dark:text-slate-200">
                        {h.candidateId?.fullName || <span className="text-slate-400 dark:text-slate-500 font-normal italic">Unavailable profile record</span>}
                      </TableCell>
                      <TableCell className="text-slate-600 font-semibold text-sm dark:text-slate-400">
                        {h.candidateId?.position || <span className="text-slate-300 dark:text-slate-600 font-normal">—</span>}
                      </TableCell>
                      <TableCell>
                        {h.candidateId?.source ? (
                          <span className="inline-block border border-indigo-200/60 bg-indigo-50/80 text-indigo-700 font-semibold rounded-lg px-2 py-0.5 text-xs">
                            {h.candidateId.source.replace(/_/g, ' ')}
                          </span>
                        ) : (
                          <span className="inline-block border border-slate-200/60 text-slate-400 text-xs font-medium rounded-lg px-2 py-0.5 dark:border-slate-700 dark:text-slate-500">
                            Talent Pool
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-slate-500 font-medium text-xs pr-6 dark:text-slate-500">
                        {formatDate(h.createdAt)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}