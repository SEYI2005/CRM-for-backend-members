import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import User from './model/User.js'
import Customer from './model/Customer.js';

const runTest = async () => {
  try {
    // 1. Connect to MongoDB
    await connectDB();

    // 2. Create a dummy user
    const testUser = await User.create({
      name: 'Test Agent',
      email: `testagent_${Date.now()}@example.com`, // unique email each run
      password: 'password123', // plain text for now, hashing comes later
      role: 'agent',
    });
    console.log('User created:', testUser);

    // 3. Create a dummy customer linked to that user
    const testCustomer = await Customer.create({
      name: 'John Doe',
      phone: '08012345678',
      email: 'johndoe@example.com',
      tags: ['vip', 'lagos'],
      user: testUser._id, // link customer to the user we just made
    });
    console.log('Customer created:', testCustomer);

    console.log('\n✅ Test passed — models are writing to MongoDB correctly.');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    // 4. Close the connection so the script exits cleanly
    await mongoose.connection.close();
    process.exit(0);
  }
};

runTest();