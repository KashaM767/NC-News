const articleRouter = require('express').Router();
const { getArticleById, getArticles, listComments, updateArticleById, postComment, postArticle, deleteArticle } = require('../controllers/controllers');

articleRouter
    .route('/')
    .get(getArticles)
    .post(postArticle)

articleRouter
    .route('/:article_id')
    .get(getArticleById)
    .patch(updateArticleById)
    .delete(deleteArticle)

articleRouter
    .route('/:article_id/comments')
    .get(listComments)
    .post(postComment)

module.exports = articleRouter;



