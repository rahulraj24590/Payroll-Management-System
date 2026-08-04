const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const importData = async () => {
    try {
        await User.deleteMany();

        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@payroll.com',
            password: 'password123',
            role: 'Admin',
            department: 'Management'
        });

        console.log('Data Imported - Admin created: admin@payroll.com / password123');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

if (process.argv[2] === '-i') {
    importData();
} else {
    console.log('Use node seeder.js -i to import data');
    process.exit();
}
