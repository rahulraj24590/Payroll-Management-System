const mongoose = require('mongoose');

const payrollSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    baseSalary: {
        type: Number,
        required: true
    },
    bonuses: {
        type: Number,
        default: 0
    },
    deductions: {
        type: Number,
        default: 0
    },
    netPay: {
        type: Number,
        required: true
    },
    payPeriodMonth: {
        type: String, // e.g., 'Jan', 'Feb'
        required: true
    },
    payPeriodYear: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Processing', 'Paid'],
        default: 'Pending'
    },
    paymentDate: {
        type: Date
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Payroll', payrollSchema);
