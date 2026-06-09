import 'dotenv/config';
import { connectDB } from './config/db.js';
import User from './models/User.js';

const seed = async () => {
  await connectDB();

  const email = process.env.SUPER_ADMIN_EMAIL || 'admin@platform.com';
  const password = process.env.SUPER_ADMIN_PASSWORD || 'Admin@123';
  const name = process.env.SUPER_ADMIN_NAME || 'Super Admin';

  const existing = await User.findOne({ email, role: 'super_admin' });
  if (existing) {
    console.log('Super admin already exists:', email);
    process.exit(0);
  }

  await User.create({
    name,
    email,
    password,
    role: 'super_admin',
  });

  console.log('Super admin created:', email);
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
