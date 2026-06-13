import mongoose from 'mongoose';
import ApplicantPlan from '../models/ApplicantPlan.js';
import ApplicantSubscription from '../models/ApplicantSubscription.js';
import User from '../models/User.js';

export async function migrateApplicantPlans() {
  console.log('🔄 Starting applicant plans migration...');

  try {
    // Migrate ApplicantPlan documents
    console.log('📊 Migrating ApplicantPlan documents...');
    const plans = await ApplicantPlan.find({});
    let plansUpdated = 0;

    for (const plan of plans) {
      if (!plan.planType) {
        plan.planType = 'UNLIMITED';
        await plan.save();
        plansUpdated++;
      }
    }
    console.log(`✅ Updated ${plansUpdated} ApplicantPlan documents`);

    // Migrate User documents
    console.log('📊 Migrating User documents...');
    const users = await User.find({});
    let usersUpdated = 0;

    for (const user of users) {
      let needsUpdate = false;
      
      if (user.requestCredits === undefined) {
        user.requestCredits = 0;
        needsUpdate = true;
      }
      
      if (user.unlockedRequests === undefined) {
        user.unlockedRequests = [];
        needsUpdate = true;
      }
      
      if (needsUpdate) {
        await user.save();
        usersUpdated++;
      }
    }
    console.log(`✅ Updated ${usersUpdated} User documents`);

    // Migrate ApplicantSubscription documents
    console.log('📊 Migrating ApplicantSubscription documents...');
    const subscriptions = await ApplicantSubscription.find({});
    let subscriptionsUpdated = 0;

    for (const sub of subscriptions) {
      if (!sub.planType) {
        sub.planType = 'UNLIMITED';
        await sub.save();
        subscriptionsUpdated++;
      }
    }
    console.log(`✅ Updated ${subscriptionsUpdated} ApplicantSubscription documents`);

    console.log('✨ Applicant plans migration completed successfully');
  } catch (error) {
    console.error('❌ Error migrating applicant plans:', error);
    throw error;
  }
}
