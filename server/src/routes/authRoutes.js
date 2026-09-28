import { Router } from 'express';
import { login, googleLogin, getMe, registerSchool, changePassword } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.post('/register', registerSchool);
router.post('/login', login);
router.post('/google', googleLogin);
router.get('/me', protect, getMe);
router.put('/change-password', protect, changePassword);

export default router;

