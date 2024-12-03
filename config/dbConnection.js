const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

async function connectDB() {
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`Connected to MongoDB: ${db.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error:${error.message}`);
    process.exit(1); 
  }
}

// const sampleSchema = new mongoose.Schema({ name: String });
// const Sample = mongoose.model('Sample', sampleSchema);

// async function createSampleData() {
  // const sample = new Sample({ name: '' });
//   await sample.save();
// }

// createSampleData();

module.exports = connectDB;