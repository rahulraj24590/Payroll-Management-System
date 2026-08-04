const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const connectDB = async () => {
    try {
        const mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        const conn = await mongoose.connect(uri);
        console.log(`MongoDB Connected (In-Memory mode): ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
