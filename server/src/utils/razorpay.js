import Razorpay from 'razorpay';
import crypto from 'crypto';

let razorpayInstance = null;

export const getRazorpayInstance = () => {
  if (!razorpayInstance) {
    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_id || !key_secret) {
      console.warn('⚠️ Razorpay credentials not found in environment variables');
    }

    razorpayInstance = new Razorpay({
      key_id: key_id || 'rzp_test_placeholder',
      key_secret: key_secret || 'placeholder_secret',
    });
  }
  return razorpayInstance;
};

export const createRazorpayOrder = async ({ amount, currency = 'INR', receipt, notes = {} }) => {
  const rzp = getRazorpayInstance();
  // Razorpay requires amount in smallest currency unit (paise for INR)
  const amountInPaise = Math.round(Number(amount) * 100);

  const options = {
    amount: amountInPaise,
    currency,
    receipt: receipt || `rcpt_${Date.now()}`,
    notes,
  };

  const order = await rzp.orders.create(options);
  return order;
};

export const verifyRazorpaySignature = ({ orderId, paymentId, signature }) => {
  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  if (!key_secret) return false;

  const generatedSignature = crypto
    .createHmac('sha256', key_secret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  return generatedSignature === signature;
};
