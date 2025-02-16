const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Add DNS retry logic
    mongoose.set('strictQuery', false);
    
    // Log the connection attempt
    console.log('Attempting to connect to MongoDB...');
    
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      family: 4, 
      retryWrites: true,
      connectTimeoutMS: 30000,
      retryReads: true,
    });

    console.log('MongoDB Connected Successfully');
  } catch (error) {
    console.error('Connection Details:', {
      host: uri.split('@')[1]?.split('/')[0],
      error: error.message,
      code: error.code,
      name: error.name
    });
    process.exit(1);
  }
};

module.exports = connectDB;