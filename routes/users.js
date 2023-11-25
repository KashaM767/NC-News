const userRouter = require('express').Router();
const { getUsers, getByUsername } = require('../controllers/controllers');

userRouter
    .route('/')
    .get(getUsers)

userRouter
    .route('/:username')
    .get(getByUsername)

module.exports = userRouter;