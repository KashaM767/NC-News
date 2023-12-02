const topicRouter = require('express').Router();
const { getTopics, postTopic } = require('../controllers/controllers');

topicRouter
    .route('/')
    .get(getTopics)
    .post(postTopic)

module.exports = topicRouter;