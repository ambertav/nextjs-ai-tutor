import mongoose from 'mongoose';

const connectToDatabase = async () => {

    console.log(process.env.MONGO_URI);
    if (mongoose.connection.readyState >= 1) {
        return;
    }

    try {
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw new Error('Database connection failed');
    }
};

export default connectToDatabase;
