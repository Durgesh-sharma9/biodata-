import { Router } from 'express';
import {
  login,
  googleLogin,
  getMe,
  registerSchool,
  sendSignupOtp,
  changePassword,
  forgotPassword,
  verifyOtp,
  resetPasswordWithOtp,
  testSmtp,
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.post('/register', registerSchool);
router.post('/send-signup-otp', sendSignupOtp);
router.post('/login', login);
router.post('/google', googleLogin);
router.get('/me', protect, getMe);
router.put('/change-password', protect, changePassword);

// OTP & Password Reset via SMTP
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPasswordWithOtp);
router.post('/test-smtp', testSmtp);

export default router;


