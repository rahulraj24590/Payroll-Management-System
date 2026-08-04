const Payroll = require('../models/Payroll');
const User = require('../models/User');

// @desc    Get all payrolls
// @route   GET /api/payrolls
// @access  Private (Admins see all, Users see own)
exports.getPayrolls = async (req, res, next) => {
    try {
        let query;

        if (req.user.role === 'Admin') {
            query = Payroll.find().populate('userId', 'name email department');
        } else {
            query = Payroll.find({ userId: req.user.id });
        }

        const payrolls = await query;

        res.status(200).json({
            success: true,
            count: payrolls.length,
            data: payrolls
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Get single payroll
// @route   GET /api/payrolls/:id
// @access  Private
exports.getPayroll = async (req, res, next) => {
    try {
        const payroll = await Payroll.findById(req.params.id).populate('userId', 'name email');

        if (!payroll) {
            return res.status(404).json({ success: false, error: 'Payroll record not found' });
        }

        // Make sure user owns payroll, or is an Admin
        if (payroll.userId._id.toString() !== req.user.id && req.user.role !== 'Admin') {
            return res.status(401).json({ success: false, error: 'Not authorized to view this payroll record' });
        }

        res.status(200).json({
            success: true,
            data: payroll
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Add payroll
// @route   POST /api/payrolls
// @access  Private/Admin
exports.addPayroll = async (req, res, next) => {
    try {
        const { userId, baseSalary, bonuses, deductions, payPeriodMonth, payPeriodYear } = req.body;

        // Calculate net pay
        const netPay = (baseSalary || 0) + (bonuses || 0) - (deductions || 0);

        const payroll = await Payroll.create({
            userId,
            baseSalary,
            bonuses,
            deductions,
            netPay,
            payPeriodMonth,
            payPeriodYear
        });

        res.status(201).json({
            success: true,
            data: payroll
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Update payroll
// @route   PUT /api/payrolls/:id
// @access  Private/Admin
exports.updatePayroll = async (req, res, next) => {
    try {
        let payroll = await Payroll.findById(req.params.id);

        if (!payroll) {
            return res.status(404).json({ success: false, error: 'Payroll record not found' });
        }

        // Recalculate net pay if salary components are updated
        if (req.body.baseSalary || req.body.bonuses !== undefined || req.body.deductions !== undefined) {
            const base = req.body.baseSalary || payroll.baseSalary;
            const bonus = req.body.bonuses !== undefined ? req.body.bonuses : payroll.bonuses;
            const deduct = req.body.deductions !== undefined ? req.body.deductions : payroll.deductions;
            req.body.netPay = base + bonus - deduct;
        }

        if (req.body.status === 'Paid' && payroll.status !== 'Paid') {
            req.body.paymentDate = Date.now();
        }

        payroll = await Payroll.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: payroll
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Delete payroll
// @route   DELETE /api/payrolls/:id
// @access  Private/Admin
exports.deletePayroll = async (req, res, next) => {
    try {
        const payroll = await Payroll.findByIdAndDelete(req.params.id);

        if (!payroll) {
            return res.status(404).json({ success: false, error: 'Payroll record not found' });
        }

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};
