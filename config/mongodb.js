import mongoose from "mongoose";

const connectDB = async() => {
  // mongoose.connection.on('connected',()=>console.log('DB is connected'))
  // await mongoose.connect(`${process.env.DB}`)

  const dbURI = process.env.NODE_ENV === 'test'
  ? globalThis.__MONGO_URI__
  : process.env.DB;

try {
  await mongoose.connect(dbURI);
  console.log('MongoDB connected:', dbURI);
} catch (err) {
  console.error(err.message);
  process.exit(1);
}
}

export default connectDB