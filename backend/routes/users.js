const express = require('express');
const {
    getUsers,
    getUser,
    updateUser,
    deleteUser
} = require('../controllers/users');

const User = require('../models/User');

const router = express.Router({ mergeParams: true });

const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('Admin'));

router
    .route('/')
    .get(getUsers);

router
    .route('/:id')
    .get(getUser)
    .put(updateUser)
    .delete(deleteUser);

module.exports = router;
