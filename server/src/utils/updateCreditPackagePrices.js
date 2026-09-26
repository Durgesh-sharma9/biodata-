import mongoose from 'mongoose';
import dotenv from 'dotenv';
import CreditPackage from '../models/CreditPackage.js';

dotenv.config();

async function updatePrices() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  const packages = [
    { name: '10 Credits', credits: 10, price: 199 },
    { name: '50 Credits', credits: 50, price: 799 },
    { name: '100 Credits', credits: 100, price: 1499 },
    { name: '200 Credits', credits: 200, price: 2499 },
  ];

  for (const pkg of packages) {
    await CreditPackage.findOneAndUpdate(
      { name: pkg.name },
      { ...pkg, isActive: true },
      { upsert: true, new: true }
    );
    console.log(`Updated ${pkg.name} with price ₹${pkg.price}`);
  }

  // Also update any package with price 0
  const anyFree = await CreditPackage.find({ price: { $in: [0, null] } });
  for (const p of anyFree) {
    p.price = Math.max(99, p.credits * 15);
    await p.save();
    console.log(`Updated package ${p.name} with fallback price ₹${p.price}`);
  }

  await mongoose.disconnect();
  console.log('Finished updating package prices');
}

updatePrices().catch(console.error);
