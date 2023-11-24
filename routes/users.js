const userRouter = require('express').Router();
const { getUsers } = require('../controllers/controllers');

userRouter
    .route('/')
    .get(getUsers)

module.exports = userRouter;