import 'dotenv/config';
import { connectDB } from './config/db.js';
import User from './models/User.js';
import Plan from './models/Plan.js';
import CreditPackage from './models/CreditPackage.js';

const seed = async () => {
  await connectDB();

  const email = process.env.SUPER_ADMIN_EMAIL || 'admin@platform.com';
  const password = process.env.SUPER_ADMIN_PASSWORD || 'Admin@123';
  const name = process.env.SUPER_ADMIN_NAME || 'Super Admin';

  const existing = await User.findOne({ email, role: 'super_admin' });
  if (!existing) {
    await User.create({ name, email, password, role: 'super_admin' });
    console.log('Super admin created:', email);
  } else {
    console.log('Super admin already exists:', email);
  }

  const defaultPlans = [
    { name: 'Starter', credits: 10, durationDays: 30 },
    { name: 'Professional', credits: 50, durationDays: 30 },
    { name: 'Premium', credits: 200, durationDays: 90 },
  ];

  for (const plan of defaultPlans) {
    await Plan.findOneAndUpdate({ name: plan.name }, plan, { upsert: true });
  }
  console.log('Default plans seeded');

  const defaultPackages = [
    { name: '10 Credits', credits: 10 },
    { name: '50 Credits', credits: 50 },
    { name: '100 Credits', credits: 100 },
    { name: '200 Credits', credits: 200 },
  ];

  for (const pkg of defaultPackages) {
    await CreditPackage.findOneAndUpdate({ name: pkg.name }, pkg, { upsert: true });
  }
  console.log('Default credit packages seeded');

  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
