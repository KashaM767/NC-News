const commentRouter = require('express').Router();
const { deleteComment, patchCommentVotes } = require('../controllers/controllers');

commentRouter
    .route('/:comment_id')
    .delete(deleteComment)
    .patch(patchCommentVotes)

module.exports = commentRouter;