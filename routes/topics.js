const topicRouter = require('express').Router();
const { getTopics } = require('../controllers/controllers');

topicRouter
    .route('/')
    .get(getTopics)

module.exports = topicRouter;