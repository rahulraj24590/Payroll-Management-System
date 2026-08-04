require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');



const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Route files
const auth = require('./routes/auth');
const users = require('./routes/users');
const payrolls = require('./routes/payrolls');

// Mount routers
app.use('/api/auth', auth);
app.use('/api/users', users);
app.use('/api/payrolls', payrolls);

// Seed DB automatically since it's in-memory
const seedAdmin = async () => {
    const User = require('./models/User');
    const adminExists = await User.findOne({ email: 'admin@payroll.com' });
    if (!adminExists) {
        await User.create({
            name: 'Rahul Raj',
            email: 'admin@payroll.com',
            password: 'password123',
            role: 'Admin',
            department: 'Management'
        });
        console.log('Seed: Default Admin user created.');
    }

    const userExists = await User.findOne({ email: 'user@payroll.com' });
    if (!userExists) {
        await User.create({
            name: 'Test Employee',
            email: 'user@payroll.com',
            password: 'password123',
            role: 'User',
            department: 'Engineering'
        });
        console.log('Seed: Default Standard user created.');
    }
};

const PORT = process.env.PORT || 5000;

let server;
connectDB().then(() => {
    server = app.listen(
        PORT,
        async () => {
            console.log(`Server running on port ${PORT}`);
            await seedAdmin();
        }
    );
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    // Close server & exit process
    if (server) {
        server.close(() => process.exit(1));
    } else {
        process.exit(1);
    }
});
