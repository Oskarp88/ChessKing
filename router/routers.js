const authRoutes = require('./authRouter');
const userRouter = require('./userRouter');
const gameRouter = require('./gameRouter');

const express = require('express');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/', userRouter);
router.use('/', gameRouter);

module.exports = router;

