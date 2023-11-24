const apiRouter = require('express').Router();
const articleRouter = require('./articles');
const commentRouter = require('./comments');
const topicRouter = require('./topics');
const userRouter = require('./users');


apiRouter.use('/articles', articleRouter);
apiRouter.use('/topics', topicRouter);
apiRouter.use('/users', userRouter);
apiRouter.use('/comments', commentRouter);

module.exports = apiRouter;

