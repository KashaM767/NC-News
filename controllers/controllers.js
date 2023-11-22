const { topicData, articleData, userData, commentData } = require("../db/data/test-data/index");
const { checkExists } = require("../models/comments");
const { retrieveTopics, readAllApis, commentsByArticle, retrieveArticleById, insertComment } = require("../models/models");



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

exports.postComment = (req, res, next) => {
    const newComment = req.body;
    const { article_id } = req.params

    insertComment(newComment, article_id).then((comment) => {
        res.status(201).send({ comment })
    }).catch(next)
}

