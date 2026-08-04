const express = require('express');
const {
    getPayrolls,
    getPayroll,
    addPayroll,
    updatePayroll,
    deletePayroll
} = require('../controllers/payrolls');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router
    .route('/')
    .get(getPayrolls)
    .post(authorize('Admin'), addPayroll);

router
    .route('/:id')
    .get(getPayroll)
    .put(authorize('Admin'), updatePayroll)
    .delete(authorize('Admin'), deletePayroll);

module.exports = router;
