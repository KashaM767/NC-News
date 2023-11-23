const { topicData, articleData, userData, commentData } = require("../db/data/test-data/index");
const { checkExists } = require("../models/comments");
const { retrieveTopics, readAllApis, retrieveArticles, commentsByArticle, retrieveArticleById, updateArticle, retrieveUsers, removeComment } = require("../models/models");

exports.getTopics = (req, res, next) => {
    retrieveTopics()
        .then((topics) => res.status(200).send({ topics }))
        .catch(next)
};

exports.listApis = (req, res, next) => {
    readAllApis().then((apis) => {
        res.status(200).send({ apis })
    }).catch(next)
};

exports.getArticles = (req, res, next) => {
    retrieveArticles().then((rows) => {
        res.status(200).send({ articles: rows })
    }).catch(next)
};

exports.listComments = (req, res, next) => {
    const { article_id } = req.params
    const articlePromises = [commentsByArticle(article_id)];

    if (article_id) {
        articlePromises.push(checkExists(article_id));
    }

    Promise.all(articlePromises)
        .then((resolvedPromises) => {
            const rows = resolvedPromises[0]
            res.status(200).send({ rows });
        })
        .catch(next);
}

exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params
    retrieveArticleById(article_id).then((rows) => {
        res.status(200).send({ article: rows })
    }).catch(next)
};

exports.deleteComment = (req, res, next) => {
    const { comment_id } = req.params;
    removeComment(comment_id).then((comment) => {
        if (comment.rowCount === 0) {
            res.status(404).send({ msg: 'not found' })
        } else {
            res.status(204).send()
        }
    }).catch(next)
}
exports.updateArticleById = (req, res, next) => {
    const { article_id } = req.params
    updateArticle(article_id, req.body).then((rows) => {
        res.status(200).send({ article: rows })
    }).catch(next)
};

exports.getUsers = (req, res, next) => {
    retrieveUsers().then((rows) => {
        res.status(200).send({ users: rows })
    }).catch(next)
}

