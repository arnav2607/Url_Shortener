const mongoose = require('mongoose');
require('dotenv').config();

const testConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/urlshortener', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Database connection successful!');
    
    // Test creating a document
    const Url = require('./models/Url');
    const testUrl = new Url({
      originalUrl: 'https://test.com',
      shortUrl: 'http://localhost:5001/test123',
      urlCode: 'test123'
    });
    
    await testUrl.save();
    console.log('✅ Test document created successfully!');
    
    // Clean up
    await Url.deleteOne({ urlCode: 'test123' });
    console.log('✅ Test document cleaned up!');
    
    mongoose.connection.close();
    
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  }
};

testConnection();
