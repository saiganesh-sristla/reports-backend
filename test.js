// You can run this script once to create an admin user
const User = require('./models/User');
const mongoose = require('mongoose');
require('dotenv').config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Check if admin already exists
    const adminExists = await User.findOne({ email: 'admin@example.com' });
    
    if (!adminExists) {
      await User.create({
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin'
      });
      console.log('Admin user created!');
    } else {
      console.log('Admin user already exists');
    }
    
    mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
};

createAdmin();