// Helper to dynamically load the official Razorpay Checkout SDK
export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      return resolve(true);
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

/**
 * Open Razorpay Checkout modal with pre-configured settings
 * @param {Object} params
 * @param {Object} params.orderData - Result of /create-order API
 * @param {Object} [params.user] - Logged in user info for prefill
 * @param {string} [params.title] - Modal title
 * @param {string} [params.description] - Modal description
 * @param {Function} params.onSuccess - Callback on payment success (receives razorpay response)
 * @param {Function} [params.onFailure] - Callback on payment failure or modal dismissal
 */
export const openRazorpayPayment = async ({
  orderData,
  user = {},
  title = 'HireHub Staff Portal',
  description = 'Payment for Credits / Subscription',
  onSuccess,
  onFailure,
}) => {
  const isLoaded = await loadRazorpayScript();
  if (!isLoaded || !window.Razorpay) {
    if (onFailure) onFailure(new Error('Razorpay SDK failed to load. Please check your internet connection.'));
    return;
  }

  const key = orderData.keyId || import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_TNFrLSunBdtmcv';

  const options = {
    key,
    amount: Math.round(Number(orderData.amount) * 100),
    currency: orderData.currency || 'INR',
    name: title,
    description: description || orderData.packageName || orderData.planName || 'Credits Purchase',
    order_id: orderData.orderId,
    prefill: {
      name: user.name || user.fullName || '',
      email: user.email || '',
      contact: user.mobile || user.phone || '',
    },
    theme: {
      color: '#A05AFF',
      backdrop_color: 'rgba(15, 23, 42, 0.65)',
    },
    handler: function (response) {
      if (onSuccess) {
        onSuccess({
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
        });
      }
    },
    modal: {
      ondismiss: function () {
        if (onFailure) {
          onFailure(new Error('Payment window closed by user'));
        }
      },
    },
  };

  const razorpayInstance = new window.Razorpay(options);
  razorpayInstance.on('payment.failed', function (response) {
    if (onFailure) {
      onFailure(new Error(response.error?.description || 'Payment transaction failed'));
    }
  });

  razorpayInstance.open();
};
