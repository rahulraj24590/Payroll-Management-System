const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const connectDB = async () => {
    try {
        let uri = process.env.MONGO_URI;

        if (!uri) {
            const mongoServer = await MongoMemoryServer.create();
            uri = mongoServer.getUri();
        }

        const conn = await mongoose.connect(uri);

        if (process.env.MONGO_URI) {
            console.log(`MongoDB Connected (Persistent Data): ${conn.connection.host}`);
        } else {
            console.log(`MongoDB Connected (In-Memory mode! Data will wipe on restart): ${conn.connection.host}`);
        }
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
