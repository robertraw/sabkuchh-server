// Import Mongoose
import mongoose from "mongoose"
import "dotenv/config"
mongoose.set('strictQuery', false);
// Connection string (replace with your actual values)
const mongoURI =process.env.MONGO_URI
// Connect to MongoDB Atlas
const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI, 
      {useNewUrlParser: true,
      useUnifiedTopology: true,
      });
    console.log('MongoDB Atlas connected successfully');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

export default connectDB