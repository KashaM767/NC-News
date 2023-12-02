const articleRouter = require('express').Router();
const { getArticleById, getArticles, listComments, updateArticleById, postComment, postArticle } = require('../controllers/controllers');

articleRouter
    .route('/')
    .get(getArticles)
    .post(postArticle)

articleRouter
    .route('/:article_id')
    .get(getArticleById)
    .patch(updateArticleById)

articleRouter
    .route('/:article_id/comments')
    .get(listComments)
    .post(postComment)

module.exports = articleRouter;



